import { getToken } from "@/lib/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: HeadersInit;
  auth?: boolean;
};

export interface ApiErrorShape {
  status: number;
  message: string;
  details?: unknown;
}

export class ApiError extends Error implements ApiErrorShape {
  status: number;
  details?: unknown;

  constructor({ status, message, details }: ApiErrorShape) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json"
};

function buildQuery(params?: RequestOptions["params"]): string {
  if (!params) {
    return "";
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.append(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export class ApiClient {
  baseUrl: string;
  onUnauthorized?: () => void;

  constructor(baseUrl: string, onUnauthorized?: () => void) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.onUnauthorized = onUnauthorized;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, params, headers, auth = true } = options;

    const url = `${this.baseUrl}${path}${buildQuery(params)}`;
    const requestHeaders: HeadersInit = {
      ...DEFAULT_HEADERS,
      ...headers
    };

    if (auth) {
      const token = getToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get("content-type");
    const payload = contentType?.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.msg || "Error al comunicarse con la API";
      const apiError = new ApiError({
        status: response.status,
        message,
        details: payload
      });

      if (response.status === 401 || response.status === 403) {
        this.onUnauthorized?.();
      }

      throw apiError;
    }

    return payload as T;
  }

  get<T>(path: string, params?: RequestOptions["params"], options?: Omit<RequestOptions, "method" | "params">) {
    return this.request<T>(path, { ...options, params, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, body, method: "POST" });
  }

  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, body, method: "PUT" });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = new ApiClient(baseUrl);
