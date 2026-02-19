import type { Meta, StoryObj } from '@storybook/react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Text } from '@/components/ui/text';
import { UserListSheet } from './UserListSheet';

function SheetDemo({ title, userIds }: { title: string; userIds: string[] }) {
  const sheetRef = useRef<BottomSheetModal>(null);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="flex-1 items-center justify-center bg-background">
          <Pressable
            className="rounded-full bg-primary px-6 py-3 active:opacity-80"
            onPress={() => sheetRef.current?.present()}
          >
            <Text className="font-outfit-semibold text-base text-white">Ouvrir la liste</Text>
          </Pressable>
          <UserListSheet sheetRef={sheetRef} title={title} userIds={userIds} />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const meta: Meta = {
  title: 'Components/UserListSheet',
  component: SheetDemo,
};

export default meta;
type Story = StoryObj<typeof SheetDemo>;

export const Empty: Story = {
  args: { title: 'Enchainements', userIds: [] },
};

export const WithUsers: Story = {
  args: { title: 'Enchainements', userIds: [] },
};
