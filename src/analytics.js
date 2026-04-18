// analytics.js
// Simple wrapper for Google Analytics 4 (gtag) initialization and event tracking.

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Load the gtag.js script and initialize dataLayer.  Call once on app startup.
export function initAnalytics() {
  if (!GA_ID || typeof window === 'undefined') return;

  // avoid injecting twice
  if (window.gtag) return;

  // add script tag to load gtag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);} // eslint-disable-line
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false });
}

// Generic event sender. name should be a string; params is an object matching GA4 event parameters.
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
