'use client';

import clsx from "classnames";
import { FieldError } from "react-hook-form";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  error?: FieldError;
  help?: string;
  required?: boolean;
};

export function FormField({ label, children, error, help, required }: FormFieldProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-slate-100">
        {label}
        {required ? <span className="ml-1 text-red-400">*</span> : null}
      </span>
      {children}
      <span className={clsx("text-xs", error ? "text-red-400" : "text-slate-400")}>{error?.message ?? help}</span>
    </label>
  );
}
