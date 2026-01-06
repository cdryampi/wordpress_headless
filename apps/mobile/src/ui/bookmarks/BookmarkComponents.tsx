import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, Search, Clock, Bookmark as BookmarkIcon, Compass } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export const BookmarksHeader = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#fff' : '#111';

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 sticky top-0 z-20">
            <TouchableOpacity className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                <ArrowLeft size={24} color={iconColor} /> 
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Saved Guides</Text>
            <TouchableOpacity className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                <Search size={24} color={iconColor} />
            </TouchableOpacity>
        </View>
    );
}

export const BookmarkCard = ({ title, excerpt, image, category, readTime }: any) => {
    return (
        <TouchableOpacity className="group relative flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5 active:scale-[0.98] mb-5 mx-4">
            <View className="relative w-full h-40 shrink-0">
                <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <View className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
                    <Text className="text-[10px] font-bold text-white uppercase tracking-wide">{category}</Text>
                </View>
            </View>
            <View className="flex-col justify-between p-4 flex-1 h-full">
                <View className="gap-2">
                    <Text className="text-base font-bold text-gray-900 dark:text-white leading-snug" numberOfLines={2}>{title}</Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={2}>{excerpt}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                    <View className="flex-row items-center gap-2">
                        <Clock size={16} color="#9ca3af" />
                        <Text className="text-xs text-gray-400 dark:text-gray-500">{readTime}</Text>
                    </View>
                    <BookmarkIcon size={20} color="#13ecec" fill="#13ecec" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

export const EmptyState = () => {
    return (
        <View className="flex-col items-center justify-center py-8 px-4 text-center">
            <View className="relative w-48 h-48 mb-6">
                <View className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl" />
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGInMT1zPNBmvJ-CeW8wQXBF9fzHeCf4GYNPqmUL6sP8v40kGXJSnl5hciRfx2FLP4SfMAIwRATCu440MmPO3j2L6svh-L26uoWh6gRxZCFSundE4uvxNSvmO64sa_IPv6hdOLOOibxoUvAe70-VZdjoIUnXchv7fY2WfMBGWojXQ5iHNrtXpl0wTva4V3wuy9WAe-XL0sIGvnlw9bT2G9SeY9v6kvyLWu2eWH18KGJLgd8DpP11Nhp9Uwo_qb5ovv1fpNHuGU9wyB' }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookmarks yet</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mb-8 leading-relaxed">
                Guides you bookmark will appear here. Build your personal library of ChatGPT knowledge.
            </Text>
            <TouchableOpacity className="flex-row items-center gap-2 px-6 py-3 bg-cyan-400 rounded-xl shadow-lg active:scale-95">
                <Compass size={20} color="#0d1b1b" />
                <Text className="text-[#0d1b1b] text-sm font-bold">Explore Guides</Text>
            </TouchableOpacity>
        </View>
    );
}
