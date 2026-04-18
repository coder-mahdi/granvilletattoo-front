'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { RECAPTCHA_SITE_KEY, RECAPTCHA_USE_ENTERPRISE } from '@/lib/recaptchaConfig';

type GrecaptchaClient = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaClient & {
      enterprise?: GrecaptchaClient;
    };
  }
}

interface ReCAPTCHAProps {
  onVerify: () => void;
  onError?: () => void;
  action?: string;
}

export interface ReCAPTCHARef {
  execute: () => Promise<string | null>;
}

function parseRenderKeyFromScriptSrc(src: string): string | null {
  const m = src.match(/[?&]render=([^&]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function isEnterpriseScriptSrc(src: string): boolean {
  return src.includes('recaptcha/enterprise.js');
}

/** Drop stale script/globals when key or standard vs Enterprise changes. */
function removeRecaptchaGlobals() {
  try {
    delete (window as unknown as { grecaptcha?: unknown }).grecaptcha;
    delete (window as unknown as { ___grecaptcha_cfg?: unknown }).___grecaptcha_cfg;
  } catch {
    /* ignore */
  }
}

function findRecaptchaLoaderScript(): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(
    'script[src*="recaptcha/api.js"], script[src*="recaptcha/enterprise.js"]',
  );
}

function getRecaptchaClient(): GrecaptchaClient | null {
  const g = window.grecaptcha;
  if (!g) return null;
  if (RECAPTCHA_USE_ENTERPRISE) {
    return g.enterprise ?? null;
  }
  return g;
}

function createSiteKeyResolver(): () => Promise<string | null> {
  let promise: Promise<string | null> | null = null;
  return () => {
    if (!promise) {
      promise = (async () => {
        if (RECAPTCHA_SITE_KEY) return RECAPTCHA_SITE_KEY;
        try {
          const res = await fetch('/api/recaptcha-site-key', { cache: 'no-store' });
          if (!res.ok) return null;
          const data = (await res.json()) as { siteKey?: string | null };
          const k = typeof data?.siteKey === 'string' ? data.siteKey.trim() : '';
          return k || null;
        } catch {
          return null;
        }
      })();
    }
    return promise;
  };
}

const ReCAPTCHA = forwardRef<ReCAPTCHARef, ReCAPTCHAProps>(
  ({ onVerify, onError, action = 'submit' }, ref) => {
    const mountedRef = useRef(true);
    const scriptLoadedRef = useRef(false);
    const resolveSiteKey = useRef(createSiteKeyResolver()).current;

    const injectScript = useCallback(
      (siteKey: string) => {
        const existing = findRecaptchaLoaderScript();
        if (existing) {
          const loadedKey = parseRenderKeyFromScriptSrc(existing.src);
          const sameKey = loadedKey === siteKey;
          const sameMode = isEnterpriseScriptSrc(existing.src) === RECAPTCHA_USE_ENTERPRISE;
          if (sameKey && sameMode) {
            scriptLoadedRef.current = !!getRecaptchaClient();
            return;
          }
          existing.remove();
          removeRecaptchaGlobals();
        }

        const script = document.createElement('script');
        const base = RECAPTCHA_USE_ENTERPRISE
          ? 'https://www.google.com/recaptcha/enterprise.js'
          : 'https://www.google.com/recaptcha/api.js';
        script.src = `${base}?render=${encodeURIComponent(siteKey)}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoadedRef.current = !!getRecaptchaClient();
        };
        script.onerror = () => {
          scriptLoadedRef.current = false;
          if (mountedRef.current && onError) onError();
        };
        document.head.appendChild(script);
      },
      [onError],
    );

    useEffect(() => {
      mountedRef.current = true;
      let cancelled = false;

      (async () => {
        const key = await resolveSiteKey();
        if (cancelled || !key) return;
        injectScript(key);
      })();

      return () => {
        cancelled = true;
        mountedRef.current = false;
      };
    }, [injectScript, resolveSiteKey]);

    useImperativeHandle(
      ref,
      () => ({
        execute: async (): Promise<string | null> => {
          const siteKey = await resolveSiteKey();
          if (!siteKey) {
            return null;
          }
          injectScript(siteKey);

          const waitMs = 15000;
          const start = Date.now();
          while (!getRecaptchaClient() && Date.now() - start < waitMs) {
            await new Promise((r) => setTimeout(r, 50));
          }

          const client = getRecaptchaClient();
          if (!client) {
            console.error(
              'reCAPTCHA API not available (blocked script, wrong key type for Standard vs Enterprise, or domain not allowed)',
            );
            if (onError) onError();
            return null;
          }

          scriptLoadedRef.current = true;

          const runExecute = () =>
            new Promise<string>((resolve, reject) => {
              client.ready(() => {
                client
                  .execute(siteKey, { action })
                  .then((t: string) => resolve(t))
                  .catch((err: Error) => reject(err));
              });
            });

          try {
            let token = await runExecute();
            if (!token) {
              token = await runExecute();
            }
            if (mountedRef.current && token) {
              onVerify();
            }
            return token || null;
          } catch (error) {
            console.error('Error executing reCAPTCHA:', error);
            try {
              const token = await runExecute();
              if (mountedRef.current && token) onVerify();
              return token || null;
            } catch {
              if (mountedRef.current && onError) {
                onError();
              }
              return null;
            }
          }
        },
      }),
      [action, onVerify, onError, injectScript, resolveSiteKey],
    );

    return null;
  },
);

ReCAPTCHA.displayName = 'ReCAPTCHA';

export default ReCAPTCHA;
