// components/UserMenu.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BaseUser } from "@/types/user";

interface UserMenuProps {
  user: BaseUser | null;
  handleLogout: () => void;
}

export default function UserMenu({ user, handleLogout }: UserMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const initial =
    (user?.name || user?.email || "U").trim().slice(0, 1).toUpperCase();

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <span className="hidden sm:inline">
          {user?.name || user?.email || "Account"}
        </span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white"
        >
          {initial}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="User menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          <div className="px-4 py-3">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.email || user?.name || "User"}
            </p>
          </div>

          <div className="border-t border-gray-100 py-1">
            <Link
              href="/settings/profile"
              role="menuitem"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Profile Settings
            </Link>
            <Link
              href="/settings/password"
              role="menuitem"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Change Password
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                handleLogout?.();
              }}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Logout
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 4.5A1.5 1.5 0 014.5 3h6A1.5 1.5 0 0112 4.5v2a.5.5 0 01-1 0v-2a.5.5 0 00-.5-.5h-6a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h6a.5.5 0 00.5-.5v-2a.5.5 0 011 0v2A1.5 1.5 0 0110.5 17h-6A1.5 1.5 0 013 15.5v-11z" />
                <path d="M14.854 10.354a.5.5 0 00.146-.354v-.001a.5.5 0 00-.146-.353l-2.5-2.5a.5.5 0 10-.708.708L13.293 9.5H8.5a.5.5 0 000 1h4.793l-1.647 1.646a.5.5 0 10.708.708l2.5-2.5z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
