import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds the Hotmart Checkout URL while preserving 100% of the UTM parameters
 * from the visitor's landing URL (including utm_content / criativo, utm_source,
 * utm_campaign, utm_medium, utm_term, sck, src).
 * This is essential for UTMify to attribute the winning creative on Hotmart sales!
 */
export function getCheckoutUrlWithUtms(
  baseUrl: string = "https://pay.hotmart.com/G106783622L?checkoutMode=10"
): string {
  if (typeof window === "undefined") return baseUrl;

  try {
    const currentUrl = new URL(window.location.href);
    const checkout = new URL(baseUrl);

    // Forward all query parameters present in the visitor's current browser URL
    currentUrl.searchParams.forEach((val, key) => {
      if (val && key !== "checkoutMode") {
        checkout.searchParams.set(key, val);
      }
    });

    // Hotmart uses 'sck' as the tracking parameter for creative/content if utm_content is present
    const utmContent = checkout.searchParams.get("utm_content");
    const utmSource = checkout.searchParams.get("utm_source");

    if (utmContent && !checkout.searchParams.get("sck")) {
      checkout.searchParams.set("sck", utmContent);
    }
    if (utmSource && !checkout.searchParams.get("src")) {
      checkout.searchParams.set("src", utmSource);
    }

    return checkout.toString();
  } catch {
    const search = window.location.search.replace(/^\?/, "");
    if (!search) return baseUrl;
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}${search}`;
  }
}
