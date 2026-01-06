import { TextInput, View, Text } from 'react-native';
import { cn } from './cn';

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{label}</Text>}
      <TextInput
        className={cn(
          "h-12 rounded-lg border border-gray-300 bg-white px-3 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          error && "border-red-500",
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
