import { ScrollView, View, Text } from 'react-native';
import { Screen } from '../../src/ui/Screen';
import { BookmarksHeader, BookmarkCard, EmptyState } from '../../src/ui/bookmarks/BookmarkComponents';
import { MOCK_LATEST_GUIDES } from '../../src/lib/mockData';

export default function BookmarksScreen() {
  const hasBookmarks = true; 

  return (
    <Screen safeArea={false} className="bg-background-light dark:bg-background-dark">
        <View className="pt-12 bg-background-light/95 dark:bg-background-dark/95">
             <BookmarksHeader />
        </View>
      
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }} showsVerticalScrollIndicator={false}>
            {hasBookmarks ? (
                <>
                    <View className="flex-row items-center justify-between px-5 mb-4">
                        <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recently Added</Text>
                        <Text className="text-xs font-medium text-cyan-400">Edit</Text>
                    </View>

                    {MOCK_LATEST_GUIDES.map((guide) => (
                        <BookmarkCard 
                            key={guide.id}
                            title={guide.title}
                            excerpt={guide.excerpt}
                            image={guide.image}
                            category={guide.badge || 'Article'}
                            readTime={guide.readTime}
                        />
                    ))}
                </>
            ) : (
                <EmptyState />
            )}
        </ScrollView>
    </Screen>
  );
}