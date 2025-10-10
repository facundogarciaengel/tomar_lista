'use client';

import Cookies from "js-cookie";

const TOKEN_KEY = "tomar-lista-token";
let memoryToken: string | null = null;

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return memoryToken;
  }

  if (memoryToken) {
    return memoryToken;
  }

  const cookieToken = Cookies.get(TOKEN_KEY);
  if (cookieToken) {
    memoryToken = cookieToken;
    return cookieToken;
  }

  const storageToken = window.localStorage.getItem(TOKEN_KEY);
  if (storageToken) {
    memoryToken = storageToken;
    return storageToken;
  }

  return null;
}

export function setToken(token: string) {
  memoryToken = token;
  if (typeof window !== "undefined") {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7,
      sameSite: "lax"
    });
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  memoryToken = null;
  if (typeof window !== "undefined") {
    Cookies.remove(TOKEN_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function hasToken() {
  return Boolean(getToken());
}
