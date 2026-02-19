import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Check, Heart, MessageCircle } from 'lucide-react-native';

import { IconStat } from './IconStat';

const meta: Meta<typeof IconStat> = {
  title: 'Components/IconStat',
  component: IconStat,
  decorators: [
    (Story) => (
      <View className="bg-background flex-row gap-4 p-4">
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IconStat>;

export const Sends: Story = {
  args: { icon: Check, value: 24 },
};

export const Likes: Story = {
  args: { icon: Heart, value: 8 },
};

export const Comments: Story = {
  args: { icon: MessageCircle, value: 3 },
};

export const Zero: Story = {
  args: { icon: Check, value: 0 },
};
