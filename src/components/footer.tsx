"use client";

import { useEffect, useState } from 'react';

export function Footer() {

  const [appVersion, setAppVersion] = useState<string>('');
  const [apiVersion, setApiVersion] = useState<string>('');

  useEffect(() => {
    fetch('/api').then(res => res.json()).then(data => {
      setAppVersion(data.version);
      setApiVersion(data.api);
    }).catch(() => {
      setAppVersion('dev');
      setApiVersion('dev');
    });
  }, []);

  return (
    <footer className="relative border-t border-border bg-card py-3 text-center text-sm text-muted-foreground">
      <div>
        © {new Date().getFullYear()}{' '}
        <a
          href="https://github.com/linuskang"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white-600 dark:text-white-400 hover:underline underline-offset-2"
        >
          Linus Kang
        </a>
        {" | "}
        <a
          href="/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white-600 dark:text-white-400 hover:underline underline-offset-2"
        >
          Privacy Policy
        </a>
        {" | "}
        <a
          href="/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white-600 dark:text-white-400 hover:underline underline-offset-2"
        >
          Terms of Service
        </a>
      </div>
      {(appVersion || apiVersion) && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/70">
          {appVersion}
        </div>
      )}
    </footer>
  );
}