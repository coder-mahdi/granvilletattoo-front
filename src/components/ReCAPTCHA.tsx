'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptchaConfig';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
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

    const injectScript = useCallback((siteKey: string) => {
      if (!document.querySelector('script[src*="recaptcha"]')) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoadedRef.current = !!window.grecaptcha;
        };
        script.onerror = () => {
          scriptLoadedRef.current = false;
          if (mountedRef.current && onError) onError();
        };
        document.head.appendChild(script);
      } else {
        scriptLoadedRef.current = !!window.grecaptcha;
      }
    }, [onError]);

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
          if (!document.querySelector('script[src*="recaptcha"]')) {
            injectScript(siteKey);
          }

          const waitMs = 15000;
          const start = Date.now();
          while (!window.grecaptcha && Date.now() - start < waitMs) {
            await new Promise((r) => setTimeout(r, 50));
          }

          if (!window.grecaptcha) {
            console.error(
              'reCAPTCHA API not available (blocked script, slow network, or invalid domain for this site key)',
            );
            if (onError) onError();
            return null;
          }

          scriptLoadedRef.current = true;

          const runExecute = () =>
            new Promise<string>((resolve, reject) => {
              window.grecaptcha.ready(() => {
                window.grecaptcha
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
            console.error('Error executing reCAPTCHA v3:', error);
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
