import { View } from 'react-native';
import { cn } from './cn';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <View className={cn("bg-white rounded-xl p-4 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700", className)}>
      {children}
    </View>
  );
};
