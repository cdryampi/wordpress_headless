import { Tabs } from 'expo-router';
import { Home, BookOpen, Bookmark, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb', headerShown: false }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color }) => <Home size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="guides" 
        options={{ 
          title: 'Guides',
          headerShown: false,
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="bookmarks" 
        options={{ 
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="account" 
        options={{ 
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color }) => <User size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
