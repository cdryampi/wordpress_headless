import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../src/ui/Screen';
import { GuidesHeader, SearchBar, FeaturedGuideCard, GuideListCard } from '../../src/ui/guides/GuideComponents';
import { CategoryScroller } from '../../src/ui/home/HomeComponents';
import { MOCK_CATEGORIES, MOCK_FEATURED_GUIDE, MOCK_LATEST_GUIDES } from '../../src/lib/mockData';

export default function GuidesScreen() {
  return (
    <Screen safeArea={false} className="bg-background-light dark:bg-background-dark">
        {/* Header Section with Safe Area - approximated pt-12 */}
        <View className="bg-background-light/95 dark:bg-background-dark/95 pt-12">
            <GuidesHeader />
            <SearchBar />
            <View className="py-2">
                <CategoryScroller categories={MOCK_CATEGORIES} />
            </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            {/* Featured Section */}
            <View className="mb-2">
                <View className="flex-row items-center justify-between px-5 mb-3">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">Featured Guide</Text>
                </View>
                <FeaturedGuideCard guide={MOCK_FEATURED_GUIDE} />
            </View>

            {/* List Section */}
            <View>
                 <View className="flex-row items-center justify-between px-5 mb-3">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white">Latest Updates</Text>
                    <TouchableOpacity>
                        <Text className="text-sm font-medium text-cyan-400">View all</Text>
                    </TouchableOpacity>
                </View>
                
                {MOCK_LATEST_GUIDES.map(guide => (
                    <GuideListCard key={guide.id} guide={guide} />
                ))}
            </View>

            {/* Load More Button */}
            <View className="px-5 py-4">
                <TouchableOpacity className="w-full py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 items-center justify-center active:bg-slate-50 dark:active:bg-slate-700">
                    <Text className="text-slate-900 dark:text-white font-bold">Load More Guides</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    </Screen>
  );
}