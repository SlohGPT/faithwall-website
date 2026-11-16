import { useEffect, useState } from 'react';

const BOTS = /Googlebot|Google-InspectionTool|AdsBot-Google|Mediapartners-Google|Storebot-Google|Chrome-Lighthouse/i;

/**
 * True on Android phones (never for Google's crawlers, which can present an Android user agent).
 * False on the server and on the first client render, so prerendered HTML and hydration agree;
 * the user agent is read in an effect after hydration.
 */
export function useIsAndroid(): boolean {
  const [isAndroid, setIsAndroid] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsAndroid(/Android/i.test(ua) && !BOTS.test(ua));
  }, []);
  return isAndroid;
}

export default useIsAndroid;
