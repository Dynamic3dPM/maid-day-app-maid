import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, useSegments, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from '@aws-amplify/auth';
import outputs from '../amplify_outputs.json';
import { useColorScheme } from '@/components/useColorScheme';

// Define possible segment types
type Segment = '(auth)' | '(tabs)' | 'modal' | '+not-found';

Amplify.configure(outputs);

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const pathname = usePathname();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      const currentSegment = segments[0] as Segment | undefined;
      console.log('Auth check - Current pathname:', pathname, 'Segments:', segments, 'Auth state:', await getCurrentUser().catch(() => 'unauthenticated'));
      if (!currentSegment || !mounted || hasCheckedAuth) return;

      try {
        await getCurrentUser();
        if (currentSegment === '(auth)') {
          console.log('Authenticated, redirecting to /(tabs)');
          setHasCheckedAuth(true);
          router.replace('/(tabs)'); // Redirect to the (tabs) group’s default route (index.tsx)
        }
      } catch (err) {
        if (currentSegment === '(tabs)' || currentSegment === '+not-found') {
          console.log('Not authenticated, redirecting to /(auth)');
          setHasCheckedAuth(true);
          router.replace('/(auth)'); // Redirect to the (auth) group’s default route (index.tsx)
        } else {
          console.log('Not authenticated, staying on (auth) route:', segments);
        }
      }
    };

    checkUser();

    return () => {
      mounted = false;
    };
  }, [segments, pathname]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}