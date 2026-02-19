import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(340 15% 10%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(340 15% 10%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(340 15% 10%)',
    primary: 'hsl(339 70% 63%)', // French Rose
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(159 60% 42%)', // Teal
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(340 20% 96%)',
    mutedForeground: 'hsl(340 10% 45%)',
    accent: 'hsl(340 20% 94%)',
    accentForeground: 'hsl(339 70% 50%)',
    destructive: 'hsl(0 84% 60%)',
    border: 'hsl(340 20% 88%)',
    input: 'hsl(340 20% 88%)',
    ring: 'hsl(339 70% 63%)',
    radius: '0.5rem',
  },
  dark: {
    background: 'hsl(340 15% 8%)',
    foreground: 'hsl(340 20% 96%)',
    card: 'hsl(340 15% 11%)',
    cardForeground: 'hsl(340 20% 96%)',
    popover: 'hsl(340 15% 11%)',
    popoverForeground: 'hsl(340 20% 96%)',
    primary: 'hsl(339 70% 63%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(159 60% 42%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(340 15% 16%)',
    mutedForeground: 'hsl(340 10% 60%)',
    accent: 'hsl(340 15% 18%)',
    accentForeground: 'hsl(339 70% 70%)',
    destructive: 'hsl(0 72% 51%)',
    border: 'hsl(340 15% 20%)',
    input: 'hsl(340 15% 20%)',
    ring: 'hsl(339 70% 63%)',
    radius: '0.5rem',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
    fonts: {
      bold: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
      medium: { fontFamily: 'Outfit_500Medium', fontWeight: '500' },
      regular: { fontFamily: 'DMSans_400Regular', fontWeight: '400' },
      heavy: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
    fonts: {
      bold: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
      medium: { fontFamily: 'Outfit_500Medium', fontWeight: '500' },
      regular: { fontFamily: 'DMSans_400Regular', fontWeight: '400' },
      heavy: { fontFamily: 'Outfit_700Bold', fontWeight: '700' },
    },
  },
};
