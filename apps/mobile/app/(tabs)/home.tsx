import { ScrollView, View, Text } from 'react-native';
import { Screen } from '../../src/ui/Screen';
import { HomeHeader, HeroSection, CategoryScroller, FeaturedGuide, GuideListItem, UpgradeCard } from '../../src/ui/home/HomeComponents';
import { MOCK_CATEGORIES, MOCK_FEATURED_GUIDE, MOCK_LATEST_GUIDES } from '../../src/lib/mockData';

export default function HomeScreen() {
  return (
    <Screen safeArea={false} className="bg-background-light dark:bg-background-dark">
      {/* Sticky Header Wrapper with Safe Area Top padding - approximated for now */}
      <View className="bg-background-light/90 dark:bg-background-dark/90 pt-12 pb-2">
          <HomeHeader />
      </View>
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, gap: 24 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="mt-2">
            <HeroSection />
        </View>

        <CategoryScroller categories={MOCK_CATEGORIES} />

        <FeaturedGuide guide={MOCK_FEATURED_GUIDE} />

        <View>
            <View className="px-5 mb-4">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Latest Guides</Text>
            </View>
            {MOCK_LATEST_GUIDES.map(guide => (
                <GuideListItem key={guide.id} guide={guide} />
            ))}
        </View>

        <UpgradeCard />
      </ScrollView>
    </Screen>
  );
}