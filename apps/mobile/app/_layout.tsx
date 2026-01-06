import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="guides/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ presentation: 'modal', headerShown: true, title: 'Login' }} />
          <Stack.Screen name="auth/signup" options={{ presentation: 'modal', headerShown: true, title: 'Sign Up' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
