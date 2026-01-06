import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Image } from 'expo-image';
import { Bell, Edit2, CheckCircle2, Bookmark, MessageSquare, Mail, User, ChevronRight, Gem, Moon, LogOut } from 'lucide-react-native';
import { cn } from '../cn';
import { useColorScheme } from 'nativewind';

export const AccountHeader = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <View className="flex-row items-center justify-between px-6 py-4 pt-4 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Account</Text>
            <TouchableOpacity className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5">
                <Bell size={24} color={isDark ? "#d1d5db" : "#4b5563"} />
            </TouchableOpacity>
        </View>
    );
}

export const ProfileSection = () => {
     return (
        <View className="flex-col items-center pt-4">
            <View className="relative">
                <View className="w-28 h-28 rounded-full border-[3px] border-cyan-400 p-1">
                    <Image 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkgxsSF_0EM6z1YqPW1fZM2d3eoqYf3izxpY7r1hXCUP2w6qfxBUII0Ky75UgkM_nw9jkJdiLGuNE7YRHqIylGzAm7FXbtA6OHFkZuVpjIm8BFq2NezWTi7EIxZxOJZvAPmqXs6sKI2nL391mqKdqT6pG9QXrM10LIOkybmCogMz1XqB5Rw5p8n71sYi4Tyw8oj36bp5kqkfw_Yby5OnSey16an8dUSD_NHbWWwkFf8kmXnRz_G0y4RBLX4ZNUmdpzcoee70_LQDJT' }} 
                        style={{ width: '100%', height: '100%', borderRadius: 9999 }} 
                    />
                </View>
                <View className="absolute bottom-0 right-0 bg-cyan-400 rounded-full p-1.5 border-4 border-background-light dark:border-background-dark flex items-center justify-center">
                    <Edit2 size={12} color="#102222" />
                </View>
            </View>
            <View className="mt-4 items-center gap-1">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white">Alex Morgan</Text>
                <Text className="text-slate-500 dark:text-slate-400 font-medium">alex.morgan@example.com</Text>
                <View className="flex-row items-center gap-1 px-3 py-1 mt-2 rounded-full bg-cyan-400/10">
                    <CheckCircle2 size={14} color="#13ecec" fill="#13ecec" />
                    <Text className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Free Plan</Text>
                </View>
            </View>
        </View>
     );
}

export const StatsGrid = () => {
    return (
        <View>
             <View className="flex-row items-center justify-between mb-4 px-1">
                <Text className="text-lg font-bold text-slate-900 dark:text-white">Your Activity</Text>
             </View>
             <View className="flex-row gap-3">
                <StatCard icon={Bookmark} label="Saved" value="12" color="indigo" />
                <StatCard icon={MessageSquare} label="Comments" value="5" color="emerald" />
                <StatCard icon={Mail} label="Newsletter" value="Active" color="orange" />
             </View>
        </View>
    );
}

const StatCard = ({ icon: Icon, label, value, color }: any) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const iconColor = isDark ? '#fff' : '#475569';

    const colorMap: any = {
        indigo: 'bg-indigo-50 dark:bg-indigo-500/20',
        emerald: 'bg-emerald-50 dark:bg-emerald-500/20',
        orange: 'bg-orange-50 dark:bg-orange-500/20',
    };
    
    // Simplification for brevity in icon color handling
    const iconColorMap: any = {
        indigo: isDark ? '#a5b4fc' : '#6366f1',
        emerald: isDark ? '#6ee7b7' : '#10b981',
        orange: isDark ? '#fdba74' : '#f97316',
    }

    return (
        <TouchableOpacity className="flex-1 flex-col items-center justify-center p-4 bg-white dark:bg-[#162a2a] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 gap-2 active:scale-95">
             <View className={cn("p-2 rounded-full", colorMap[color])}>
                <Icon size={20} color={iconColorMap[color]} />
             </View>
             <View className="items-center">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">{value}</Text>
                <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</Text>
             </View>
        </TouchableOpacity>
    )
}

export const SettingsList = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View className="mb-8">
            <Text className="text-lg font-bold mb-4 px-1 text-slate-900 dark:text-white">Settings</Text>
            <View className="gap-3">
                <SettingsItem icon={User} label="Edit Profile" isDark={isDark} />
                
                {/* Pro Upgrade */}
                <TouchableOpacity className="relative flex-row items-center justify-between p-4 bg-slate-900 dark:bg-cyan-400/10 rounded-xl overflow-hidden active:scale-[0.99]">
                    <View className="flex-row items-center gap-4 relative z-10">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-cyan-400/20">
                            <Gem size={20} color="#13ecec" />
                        </View>
                        <View>
                            <Text className="font-bold text-base text-white">ChatGPT Plus Guide Pro</Text>
                            <Text className="text-xs text-cyan-400">Upgrade for full access</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="#13ecec" />
                </TouchableOpacity>

                {/* Dark Mode */}
                <View className="flex-row items-center justify-between p-4 bg-white dark:bg-[#162a2a] rounded-xl border border-slate-100 dark:border-white/5">
                    <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                             <Moon size={20} className="text-slate-600 dark:text-slate-300" color={isDark ? "#cbd5e1" : "#475569"} />
                        </View>
                        <Text className="font-medium text-base text-slate-900 dark:text-white">Dark Mode</Text>
                    </View>
                    <Switch 
                        value={isDark} 
                        onValueChange={toggleColorScheme} 
                        trackColor={{ false: "#e2e8f0", true: "#13ecec" }}
                        thumbColor={"#fff"}
                    />
                </View>

                <TouchableOpacity className="flex-row items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 mt-2">
                    <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                             <LogOut size={20} color="#dc2626" />
                        </View>
                        <Text className="font-medium text-base text-red-600 dark:text-red-400">Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const SettingsItem = ({ icon: Icon, label, isDark }: any) => {
    return (
        <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white dark:bg-[#162a2a] rounded-xl border border-slate-100 dark:border-white/5 active:bg-slate-50 dark:active:bg-white/5">
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                     <Icon size={20} color={isDark ? "#cbd5e1" : "#475569"} /> 
                </View>
                <Text className="font-medium text-base text-slate-900 dark:text-white">{label}</Text>
            </View>
            <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
    )
}
