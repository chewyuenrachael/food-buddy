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
  
  // Feature flags
  features: {
    enableAI: getEnvVar('ENABLE_AI_FEATURES', false) === 'true',
  },
} as const;

export type Env = typeof env;
