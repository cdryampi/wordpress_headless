import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Search, ArrowRight, Clock, BookOpen } from 'lucide-react-native';
import { cn } from '../cn';

export const GuidesHeader = () => {
    return (
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2 bg-background-light/90 dark:bg-background-dark/90 z-30 backdrop-blur-md">
            <View className="flex-row items-center gap-3">
                <View className="items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm">
                    <BookOpen size={24} color="#1e293b" /> 
                </View>
                <Text className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Guides</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-cyan-400">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC073d5jghejC3vN5A5u5KjqEQfngvyGPPm7DcK_BlYW2DE8MCFG0onSzJNl816MFA8cLpgdzYs4OotZcez8YTZE2zN4pTHooT1j_r9pNIAvhvCDkAmk5RhR9AljGKLgV63pqgFpu-x6WDotWUH5DxMU-Qn1KOXVURrK-RqbNorG9M2KA9y9qPTGXi6FYv01EtrINSJExtSbg-CKLo58vPxTwMN4Chop8WwiS_wf_XMRG1Saquf955a63-RPlrOYPzeEHGA7KlcnWsd' }} style={{ width: '100%', height: '100%' }} />
            </TouchableOpacity>
        </View>
    );
}

export const SearchBar = () => {
    return (
        <View className="px-5 py-2">
            <View className="flex-row items-center w-full h-14 px-4 gap-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-transparent focus:border-cyan-400/50 transition-all">
                <Search size={20} color="#94a3b8" />
                <TextInput 
                    placeholder="Search guides, topics..." 
                    placeholderTextColor="#94a3b8"
                    className="flex-1 text-base font-medium text-slate-900 dark:text-white h-full"
                />
            </View>
        </View>
    );
}

export const FeaturedGuideCard = ({ guide }: { guide: any }) => {
    return (
        <TouchableOpacity className="flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm active:scale-[0.99] mb-6 mx-5">
            <View className="relative w-full aspect-[16/9] overflow-hidden">
                <Image source={{ uri: guide.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <View className="absolute inset-0 bg-black/20" /> 
                <View className="absolute top-3 left-3 bg-cyan-400/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Text className="text-slate-900 text-xs font-bold uppercase tracking-wide">Editor's Choice</Text>
                </View>
            </View>
            <View className="p-5 flex-col gap-2">
                <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-xs font-semibold text-cyan-400">Advanced</Text>
                    <Text className="text-xs text-slate-400">•</Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Oct 24, 2023</Text>
                </View>
                <Text className="text-xl font-bold leading-tight text-slate-900 dark:text-white">{guide.title}</Text>
                <Text className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" numberOfLines={2}>{guide.excerpt}</Text>
                
                <View className="flex-row items-center gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Clock size={16} color="#94a3b8" />
                    <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">{guide.readTime}</Text>
                    <View className="flex-1" />
                    <View className="flex-row items-center gap-1">
                         <Text className="text-sm font-bold text-cyan-400">Read now</Text>
                         <ArrowRight size={16} color="#13ecec" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export const GuideListCard = ({ guide }: { guide: any }) => {
    const isPro = guide.badge === 'Pro';
    // Simplified logic for badges
    return (
        <TouchableOpacity className="flex-row gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm active:scale-[0.99] mx-5 mb-4">
            <View className="shrink-0 w-28 h-28 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <Image source={{ uri: guide.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </View>
            <View className="flex-1 flex-col justify-center gap-1.5">
                <View className="flex-row items-center gap-2">
                    <View className={cn("px-2 py-0.5 rounded-md", isPro ? "bg-purple-100 dark:bg-purple-900/30" : "bg-green-100 dark:bg-green-900/30")}>
                        <Text className={cn("text-[10px] font-bold uppercase", isPro ? "text-purple-600 dark:text-purple-400" : "text-green-600 dark:text-green-400")}>
                            {guide.badge || 'Tips'}
                        </Text>
                    </View>
                </View>
                <Text className="text-base font-bold text-slate-900 dark:text-white leading-tight" numberOfLines={2}>
                    {guide.title}
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400 leading-snug" numberOfLines={2}>
                    {guide.excerpt}
                </Text>
                <View className="flex-row items-center gap-3 text-xs font-medium mt-1">
                     <View className="flex-row items-center gap-1">
                        <Clock size={12} color="#94a3b8" />
                        <Text className="text-slate-400 dark:text-slate-500 text-xs">{guide.readTime}</Text>
                     </View>
                     <Text className="text-slate-400 dark:text-slate-500 text-xs">• Nov 12</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
