'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

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
  className?: string;
}

export interface ReCAPTCHARef {
  execute: () => Promise<string | null>;
}

const ReCAPTCHA = forwardRef<ReCAPTCHARef, ReCAPTCHAProps>(({
  onVerify,
  onError,
  action = 'submit',
  className = '',
}, ref) => {
  const mountedRef = useRef<boolean>(true);
  const scriptLoadedRef = useRef<boolean>(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Load reCAPTCHA v3 script
  useEffect(() => {
    mountedRef.current = true;

    if (!siteKey) {
      console.warn('reCAPTCHA site key is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.');
      return;
    }

    // Load reCAPTCHA v3 script if not already loaded
    if (!document.querySelector('script[src*="recaptcha"]')) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoadedRef.current = !!window.grecaptcha;
      };

      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        scriptLoadedRef.current = false;
        if (mountedRef.current && onError) {
          onError();
        }
      };

      document.head.appendChild(script);
    } else {
      // Tag may exist from a prior navigation but API not ready yet — do not mark loaded here
      scriptLoadedRef.current = !!window.grecaptcha;
    }

    return () => {
      mountedRef.current = false;
    };
  }, [onError, siteKey]);

  // Expose execute method via ref
  useImperativeHandle(ref, () => ({
    execute: async (): Promise<string | null> => {
      if (!siteKey) {
        console.error('reCAPTCHA site key is not configured');
        if (onError) onError();
        return null;
      }

      const waitMs = 15000;
      const start = Date.now();
      while (!window.grecaptcha && Date.now() - start < waitMs) {
        await new Promise((r) => setTimeout(r, 50));
      }

      if (!window.grecaptcha) {
        console.error('reCAPTCHA API not available (blocked script, slow network, or invalid domain for this site key)');
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
  }), [siteKey, action, onVerify, onError]);


  if (!siteKey) {
    return (
      <div className={`recaptcha-placeholder ${className}`}>
        <p>reCAPTCHA is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.</p>
      </div>
    );
  }

  // reCAPTCHA v3 is invisible, no visual element needed
  return null;
});

ReCAPTCHA.displayName = 'ReCAPTCHA';

export default ReCAPTCHA;
