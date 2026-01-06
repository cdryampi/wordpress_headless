import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/ui/Screen';
import { Input } from '../../src/ui/Input';
import { Button } from '../../src/ui/Button';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.dismiss();
    }
  };

  return (
    <Screen className="p-4" safeArea={false}>
      <Text className="text-2xl font-bold mb-6 text-center">Welcome Back</Text>
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      <Input 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <Button title="Login" onPress={handleLogin} loading={loading} className="mt-2" />
      <View className="mt-4 flex-row justify-center">
        <Text onPress={() => router.push('/auth/signup')} className="text-blue-600 font-semibold">
          Create an account
        </Text>
      </View>
    </Screen>
  );
}
