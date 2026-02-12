/**
 * Configuration for connecting to a maf-standalone backend.
 * Reads from environment variables.
 */

/** Base URL for the MAF backend API */
export function getMafUrl(): string {
  return process.env.NEXT_PUBLIC_MAF_URL || 'http://localhost:5555';
}

/** Whether MAF backend integration is enabled */
export function isMafEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_MAF_URL;
}

/** MAF configuration */
export interface MafConfig {
  /** Base URL for the MAF API (e.g., http://localhost:5555) */
  url: string;
  /** Whether MAF integration is enabled */
  enabled: boolean;
}

/** Get current MAF configuration */
export function getMafConfig(): MafConfig {
  return {
    url: getMafUrl(),
    enabled: isMafEnabled(),
  };
}
