import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { cn } from './cn';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  safeArea?: boolean;
}

export const Screen = ({ children, className, safeArea = true }: ScreenProps) => {
  const Container = safeArea ? SafeAreaView : View;
  const { colorScheme } = useColorScheme();
  
  return (
    <Container className={cn("flex-1 bg-gray-50 dark:bg-gray-900", className)}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </Container>
  );
};