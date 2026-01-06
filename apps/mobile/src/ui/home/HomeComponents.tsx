import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Zap, ArrowRight, Clock, Bookmark, Bot } from 'lucide-react-native';
import { cn } from '../cn';
import { useColorScheme } from 'nativewind';

export const HomeHeader = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#d1d5db' : '#374151'; // Matching text-gray-700/300

  return (
    <View className="flex-row items-center justify-between px-5 py-4 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md z-40">
      <View className="flex-row items-center gap-2">
        <View className="items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/20 dark:bg-cyan-400/10">
           <Bot size={24} color="#13ecec" />
        </View>
        <Text className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">GPT Guide</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <Search size={24} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity className="relative items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <Bell size={24} color={iconColor} />
          <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-gray-50 dark:border-slate-900" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const HeroSection = () => {
  return (
    <View className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm mx-5">
      {/* Background decorations approximated */}
      <View className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <View className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl" />
      
      <View className="relative p-6 flex-col items-start gap-4">
        <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
          <Zap size={14} color="#13ecec" fill="#13ecec" />
          <Text className="text-xs font-bold text-cyan-400 uppercase tracking-wider">New Features</Text>
        </View>
        <View className="gap-2">
          <Text className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">Unlock GPT-4 Power</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[85%]">
            Master ChatGPT Plus today. 5 new advanced guides added this week.
          </Text>
        </View>
        <TouchableOpacity className="mt-2 flex-row items-center justify-center gap-2 h-11 px-6 rounded-xl bg-cyan-400 active:scale-95 transition-all shadow-sm shadow-cyan-400/30">
          <Text className="text-[#0d1b1b] font-bold text-sm">Start Learning</Text>
          <ArrowRight size={18} color="#0d1b1b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CategoryScroller = ({ categories }: { categories: any[] }) => {
  return (
    <View className="w-full">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }} className="pb-1">
        {categories.map((cat, index) => {
             const isActive = index === 0;
             return (
                <TouchableOpacity 
                    key={cat.id} 
                    className={cn(
                        "h-9 px-5 rounded-full items-center justify-center border",
                        isActive 
                            ? "bg-gray-900 dark:bg-white border-transparent" 
                            : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                    )}
                >
                    <Text className={cn(
                        "text-sm font-medium",
                        isActive
                            ? "text-white dark:text-gray-900"
                            : "text-gray-700 dark:text-gray-300"
                    )}>
                        {cat.label}
                    </Text>
                </TouchableOpacity>
             );
        })}
      </ScrollView>
    </View>
  );
};

export const FeaturedGuide = ({ guide }: { guide: any }) => {
    return (
        <View className="flex-col gap-4 px-5">
            <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Featured Guide</Text>
                <TouchableOpacity>
                    <Text className="text-cyan-400 text-sm font-semibold">See all</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="group relative flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm active:opacity-95">
                <View className="aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 relative">
                    <Image source={{ uri: guide.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={500} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' }} />
                    <View className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/10">
                        <Text className="text-white text-xs font-bold uppercase tracking-wide">{guide.tag}</Text>
                    </View>
                </View>
                <View className="p-5 flex-col gap-2">
                    <Text className="text-lg font-bold leading-tight text-gray-900 dark:text-white">{guide.title}</Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>{guide.excerpt}</Text>
                    <View className="mt-2 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-1">
                            <Clock size={14} color="#9ca3af" />
                            <Text className="text-xs font-medium text-gray-400">{guide.readTime}</Text>
                        </View>
                        <Text className="text-cyan-400 font-semibold text-sm">Read Now</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export const GuideListItem = ({ guide }: { guide: any }) => {
    // Helper for badge color logic (simplified)
    const isPro = guide.badge === 'Pro';
    const badgeBg = isPro ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-green-100 dark:bg-green-900/30';
    const badgeText = isPro ? 'text-purple-600 dark:text-purple-300' : 'text-green-600 dark:text-green-300';

    return (
        <TouchableOpacity className="flex-row items-start gap-4 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mx-5 mb-4 active:scale-[0.99]">
            <View className="w-20 h-20 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden">
                 <Image source={{ uri: guide.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </View>
            <View className="flex-1 min-w-0 gap-1 h-20 justify-between py-0.5">
                <View>
                     <View className="flex-row justify-between items-start">
                        <Text className="text-sm font-bold text-gray-900 dark:text-white leading-snug flex-1 mr-2" numberOfLines={2}>
                            {guide.title}
                        </Text>
                        <Bookmark size={20} color="#9ca3af" />
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>
                        {guide.excerpt}
                    </Text>
                </View>
                
                <View className="flex-row items-center gap-2">
                    <View className={cn("px-2 py-0.5 rounded-md", badgeBg)}>
                        <Text className={cn("text-[10px] font-bold uppercase", badgeText)}>{guide.badge}</Text>
                    </View>
                    <Text className="text-[10px] text-gray-400">{guide.readTime}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const UpgradeCard = () => {
    return (
        <View className="mx-5 mt-2 mb-6">
            <View className="relative overflow-hidden rounded-2xl bg-gray-900 dark:bg-cyan-400/10 p-5 flex-row items-center justify-between">
                 {/* Dot pattern simulated with opacity */}
                 <View className="absolute inset-0 opacity-20" /> 
                 
                 <View className="relative z-10 flex-col gap-1">
                    <Text className="text-white dark:text-cyan-400 font-bold text-base">Unlock All 500+ Guides</Text>
                    <Text className="text-gray-400 dark:text-cyan-400/70 text-xs">Join Premium for exclusive content.</Text>
                 </View>
                 <TouchableOpacity className="relative z-10 h-9 px-4 bg-cyan-400 items-center justify-center rounded-xl shadow-lg active:scale-95">
                    <Text className="text-[#0d1b1b] text-sm font-bold">Upgrade</Text>
                 </TouchableOpacity>
            </View>
        </View>
    );
}