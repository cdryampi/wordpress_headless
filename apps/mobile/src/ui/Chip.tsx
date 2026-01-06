import { View, Text } from 'react-native';
import { cn } from './cn';

export const Chip = ({ label, className }: { label: string; className?: string }) => {
  return (
    <View className={cn("bg-gray-100 rounded-full px-3 py-1 self-start dark:bg-gray-700", className)}>
      <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</Text>
    </View>
  );
};
