import type { Meta, StoryObj } from '@storybook/react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Text } from '@/components/ui/text';
import { GymPickerModal } from './GymPickerModal';

const meta: Meta<typeof GymPickerModal> = {
  title: 'GymPickerModal',
  component: GymPickerModal,
};

export default meta;

type Story = StoryObj<typeof GymPickerModal>;

export const Default: Story = {
  render: () => {
    const sheetRef = useRef<BottomSheetModal>(null);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          onPress={() => sheetRef.current?.present()}
          style={{ padding: 16, backgroundColor: '#e35f8d', borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Open gym picker</Text>
        </Pressable>
        <GymPickerModal
          sheetRef={sheetRef as React.RefObject<BottomSheetModal | null>}
          selectedGymId="wattabloc"
          userGymIds={['wattabloc', 'arkose']}
          onSelect={() => {}}
        />
      </View>
    );
  },
};
