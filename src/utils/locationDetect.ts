/**
 * Detect the user's country via their IP address.
 * Uses the free ip-api.com service (no API key required, 45 req/min free).
 * Falls back to 'MA' (Morocco) if detection fails.
 */

export interface IpLocationResult {
  countryCode: string;   // ISO 3166-1 alpha-2 (e.g. "MA", "FR")
  countryName: string;
  city: string;
  lat: number;
  lng: number;
}

/**
 * Detect user country from IP.
 * Returns null if offline or detection fails — caller should handle gracefully.
 */
export async function detectCountryFromIp(): Promise<IpLocationResult | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch('https://ip-api.com/json/?fields=status,countryCode,country,city,lat,lon', {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) {return null;}
    const data = await resp.json();
    if (data.status !== 'success') {return null;}
    return {
      countryCode: data.countryCode as string,
      countryName: data.country as string,
      city: data.city as string,
      lat: data.lat as number,
      lng: data.lon as number,
    };
  } catch {
    return null;
  }
}
