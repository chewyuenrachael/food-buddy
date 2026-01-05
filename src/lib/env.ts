/**
 * Environment configuration with validation
 */

const getEnvVar = (key: string, required = true): string => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? '';
};

export const env = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', false) || 'https://placeholder.supabase.co',
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', false) || 'placeholder-key',
  },
  
  // Mapbox
  mapbox: {
    accessToken: getEnvVar('NEXT_PUBLIC_MAPBOX_TOKEN', false) || '',
  },
  
  // App
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',
    name: 'Food Buddy',
  },
  
  // AI Service
  aiService: {
    url: getEnvVar('NEXT_PUBLIC_AI_SERVICE_URL', false) || 'http://localhost:8000',
  },
  
  // Feature flags
  features: {
    enableAI: getEnvVar('ENABLE_AI_FEATURES', false) === 'true',
  },
} as const;

export type Env = typeof env;

/**
 * Check if required environment variables are set
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_MAPBOX_TOKEN',
  ];

  const missing = required.filter((key) => !process.env[key]);

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if we're in development mode
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * Check if we're in production mode
 */
export const isProd = process.env.NODE_ENV === 'production';
