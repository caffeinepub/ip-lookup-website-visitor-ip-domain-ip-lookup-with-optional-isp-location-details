export interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
}

/**
 * Validates if a string is a valid IP address (IPv4 or IPv6)
 */
export function isValidIp(input: string): boolean {
  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 pattern (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (ipv4Pattern.test(input)) {
    const parts = input.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  return ipv6Pattern.test(input);
}

/**
 * Validates if a string is a valid domain name
 */
export function isValidDomain(input: string): boolean {
  const domainPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainPattern.test(input);
}

/**
 * Fetches IP information from ipapi.co
 * @param input - IP address or domain name to lookup. If undefined, fetches visitor's IP
 * @param includeDetails - Whether to include ISP and location details
 */
export async function fetchIpInfo(input?: string, includeDetails: boolean = false): Promise<IpInfo> {
  try {
    let url: string;
    
    if (!input) {
      // Fetch visitor's own IP
      url = includeDetails 
        ? 'https://ipapi.co/json/'
        : 'https://ipapi.co/ip/';
    } else {
      // Validate input
      const isIp = isValidIp(input);
      const isDomain = isValidDomain(input);
      
      if (!isIp && !isDomain) {
        throw new Error('Invalid IP address or domain name. Please check your input.');
      }
      
      // Lookup specific IP or domain
      url = includeDetails
        ? `https://ipapi.co/${input}/json/`
        : `https://ipapi.co/${input}/ip/`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      throw new Error('Failed to fetch IP information. Please try again.');
    }

    if (includeDetails) {
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address or domain name.');
      }
      
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        org: data.org,
      };
    } else {
      const ip = await response.text();
      return { ip: ip.trim() };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}
