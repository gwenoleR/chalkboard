import '../global.css';
import '../lib/i18n';
import '../lib/suppress-lib-warnings';

import { ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@rn-primitives/portal';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';

const LIGHT_THEME: Theme = NAV_THEME.light;
const DARK_THEME: Theme = NAV_THEME.dark;

function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="boulder/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          </Stack>
          <StatusBar style="auto" />
          <PortalHost />
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true'
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../.rnstorybook').default
  : RootLayout;
