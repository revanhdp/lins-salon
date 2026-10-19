"use client";

import type { ButtonHTMLAttributes } from "react";

/** Tombol submit yang meminta konfirmasi dulu (untuk aksi hapus). */
export function ConfirmButton({
  message,
  onClick,
  ...props
}: { message: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}
