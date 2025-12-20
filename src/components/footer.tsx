import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Linus Kang.
      <a
        href='/privacy'
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
      > Privacy Policy.
      </a>

      <a
        href='/terms'
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
      > Terms of Service.
      </a>

    </footer>
  );
}