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
        scriptLoadedRef.current = true;
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
      scriptLoadedRef.current = true;
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

      // Wait for script to load and be ready
      if (!scriptLoadedRef.current && !window.grecaptcha) {
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.grecaptcha || document.querySelector('script[src*="recaptcha"]')) {
              clearInterval(checkInterval);
              scriptLoadedRef.current = true;
              resolve();
            }
          }, 100);

          setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
          }, 5000);
        });
      }

      if (!window.grecaptcha) {
        console.error('reCAPTCHA script not loaded');
        if (onError) onError();
        return null;
      }

      try {
        // Use grecaptcha.ready() to ensure API is fully initialized
        const token = await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute(siteKey, { action })
              .then((token: string) => {
                resolve(token);
              })
              .catch((error: Error) => {
                reject(error);
              });
          });
        });

        if (mountedRef.current) {
          onVerify();
        }
        return token;
      } catch (error) {
        console.error('Error executing reCAPTCHA v3:', error);
        if (mountedRef.current && onError) {
          onError();
        }
        return null;
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
