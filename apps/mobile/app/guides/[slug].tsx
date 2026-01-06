import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share, Bookmark, Clock, ChevronDown, List, Copy, ChevronRight, Lock } from 'lucide-react-native';
import { MOCK_FEATURED_GUIDE, MOCK_LATEST_GUIDES } from '../../src/lib/mockData';
import { useColorScheme } from 'nativewind';

export default function GuideDetailScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const guide = MOCK_FEATURED_GUIDE; 

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" />
      
      {/* Sticky Header */}
      <View className="absolute top-0 w-full z-50 flex-row items-center justify-between px-4 pt-12 pb-3 bg-background-light/85 dark:bg-background-dark/85 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
          <ChevronLeft size={24} color={isDark ? "white" : "#111"} /> 
        </TouchableOpacity>
        <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                <Share size={24} color={isDark ? "white" : "#111"} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-cyan-400/10 hover:bg-cyan-400/20">
                <Bookmark size={24} color="#13ecec" fill="#13ecec" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="w-full h-80 relative bg-gray-200 dark:bg-gray-800 rounded-b-[2rem] overflow-hidden shadow-sm">
            <Image source={{ uri: guide.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            <LinearGradient colors={['transparent', isDark ? 'rgba(16, 34, 34, 0.6)' : 'rgba(246, 248, 248, 0.4)']} style={{ position: 'absolute', left:0, right:0, top:0, bottom:0 }} />
        </View>

        {/* Article Container */}
        <View className="px-5 -mt-10 relative z-10">
            {/* Title Card */}
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
                <Text className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight mb-5">
                    {guide.title}
                </Text>
                
                {/* Author Row */}
                <View className="flex-row items-center gap-3 pt-2">
                     <View className="w-10 h-10 rounded-full bg-gray-300 ring-2 ring-cyan-400/30 overflow-hidden">
                        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSzZ0IQoHypRIjtQ5SH81z_qdzHZHSPu_0lNTeiXQx3dv_EbaiSYMk4TAoOLrDv7hZhxao1DaQgZtoI445XV5kbcshFH1uA6n-CePCRvpGw_sEEfCOad9-s4mHZHUwphbtlfcVEtzWMZ3DIIs8r76nq5mUdDNBxVDPCmkGEqcFClfJJ7RzprR2eR4fgxHupJ_-oiwfo1kfvXebUPYOFoW73jzraIHxfE4GqDOAAUlo4ydCNTt14fJoF86lrUvMzCNASrHiUqXCHf4h' }} style={{ width: '100%', height: '100%' }} />
                     </View>
                     <View className="justify-center">
                        <Text className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Sarah Tech</Text>
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 dark:text-gray-400">Oct 24, 2023 • </Text>
                            <View className="flex-row items-center gap-0.5 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded ml-1">
                                <Clock size={10} color="#9ca3af" />
                                <Text className="text-[10px] font-medium text-gray-600 dark:text-gray-300 ml-1">{guide.readTime}</Text>
                            </View>
                        </View>
                     </View>
                </View>
            </View>

            {/* TOC Accordion (Static) */}
            <View className="mt-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30">
                    <View className="flex-row items-center gap-2">
                        <List size={18} color="#13ecec" />
                        <Text className="text-sm font-bold text-gray-900 dark:text-white">On this page</Text>
                    </View>
                    <ChevronDown size={20} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            {/* Content Body */}
            <View className="mt-8">
                <Text className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
                    Custom instructions allow you to tailor ChatGPT to your specific needs, ensuring that every response you get is formatted exactly how you like it. Whether you're a coder, a writer, or a project manager.
                </Text>
                
                <View className="flex-row items-center gap-2 mb-4">
                     <Text className="text-cyan-400 text-2xl font-black">#</Text>
                     <Text className="text-xl font-bold text-gray-900 dark:text-white">Setting up parameters</Text>
                </View>

                <Text className="text-[16px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
                     By defining a persona or a set of rules, you reduce the need for context-setting in every new chat.
                </Text>

                {/* Callout */}
                <View className="my-6 p-5 rounded-2xl bg-cyan-400/5 dark:bg-cyan-400/10 border-l-4 border-cyan-400 flex-row gap-4">
                     <View className="p-1.5 bg-cyan-400/20 rounded-lg shrink-0 h-8 w-8 items-center justify-center">
                        <View className="w-4 h-4 rounded-full bg-cyan-400" />
                     </View>
                     <View className="flex-1">
                        <Text className="font-bold text-gray-900 dark:text-white text-sm mb-1">Pro Tip</Text>
                        <Text className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                             Be specific about the tone. "Professional but friendly" yields better results than just "Professional".
                        </Text>
                     </View>
                </View>

                {/* Code Block */}
                <View className="my-6 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-lg">
                    <View className="flex-row items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                        <View className="flex-row gap-1.5">
                            <View className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <View className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <View className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </View>
                        <Text className="text-xs font-mono text-gray-400">test_script.py</Text>
                        <TouchableOpacity className="flex-row items-center gap-1.5 px-2 py-1 rounded bg-white/5">
                            <Copy size={12} color="#9ca3af" />
                            <Text className="text-xs font-medium text-gray-400">Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="p-4">
                        <Text className="text-sm font-mono text-gray-300 leading-relaxed">
{`def greet_user(name):
    """Simple greeting"""
    return f"Hello, {name}!"`}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="w-full h-px bg-gray-200 dark:bg-gray-800 my-10" />

            {/* Related Guides */}
            <View className="mb-8">
                <View className="flex-row items-center justify-between mb-5 px-1">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">Related Guides</Text>
                    <TouchableOpacity className="flex-row items-center">
                        <Text className="text-sm text-cyan-400 font-bold">View all</Text>
                        <ChevronRight size={18} color="#13ecec" />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                    {MOCK_LATEST_GUIDES.map(item => (
                        <TouchableOpacity key={item.id} className="w-[260px] flex-col gap-3 mr-4">
                            <View className="aspect-[16/9] w-full rounded-2xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                            </View>
                            <View>
                                <Text className="font-bold text-gray-900 dark:text-white leading-tight mb-1" numberOfLines={2}>{item.title}</Text>
                                <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>{item.excerpt}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 w-full z-50 px-5 pb-8 pt-12">
         {/* Simplified Gradient background wrapper */}
          <LinearGradient 
            colors={isDark ? ['transparent', 'rgba(16, 34, 34, 0.95)', '#102222'] : ['transparent', 'rgba(246, 248, 248, 0.95)', '#f6f8f8']}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
         
         <TouchableOpacity className="relative flex-row items-center justify-center gap-3 bg-cyan-400 py-4 rounded-2xl shadow-lg shadow-cyan-400/25 active:scale-98">
            <Lock size={20} color="#0d1b1b" />
            <Text className="text-[#0d1b1b] font-bold text-[17px]">Unlock Full Library - Upgrade</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}