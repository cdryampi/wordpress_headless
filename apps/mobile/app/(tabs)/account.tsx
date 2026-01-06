import { ScrollView, View } from 'react-native';
import { Screen } from '../../src/ui/Screen';
import { AccountHeader, ProfileSection, StatsGrid, SettingsList } from '../../src/ui/account/AccountComponents';

export default function AccountScreen() {
  return (
    <Screen safeArea={false} className="bg-background-light dark:bg-background-dark">
        <AccountHeader />
        
        <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 32 }} showsVerticalScrollIndicator={false} className="px-6">
            <ProfileSection />
            <StatsGrid />
            <SettingsList />
        </ScrollView>
    </Screen>
  );
}