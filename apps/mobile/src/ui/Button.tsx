import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from './cn';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  className?: string;
}

export const Button = ({ onPress, title, variant = 'primary', loading, className }: ButtonProps) => {
  const baseStyles = "h-12 rounded-lg flex-row items-center justify-center px-4";
  const variants = {
    primary: "bg-blue-600",
    secondary: "bg-gray-200",
    outline: "border border-gray-300 bg-transparent",
    danger: "bg-red-600"
  };
  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-gray-900 font-semibold",
    outline: "text-gray-700 font-semibold",
    danger: "text-white font-semibold"
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={loading}
      className={cn(baseStyles, variants[variant], className, loading && "opacity-70")}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? 'white' : 'black'} />
      ) : (
        <Text className={cn("text-base", textVariants[variant])}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
