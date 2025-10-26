import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn) {
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, segments, isLoaded]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
      </QueryClientProvider>
    </ClerkProvider>
  );
}