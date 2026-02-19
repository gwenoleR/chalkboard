import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Video, Check, Heart } from 'lucide-react-native';

import { IconBadge } from './IconBadge';

const meta: Meta<typeof IconBadge> = {
  title: 'Components/IconBadge',
  component: IconBadge,
  decorators: [
    (Story) => (
      <View className="bg-background p-4">
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IconBadge>;

export const Default: Story = {
  args: { icon: Video, label: 'Beta' },
};

export const CustomColor: Story = {
  args: { icon: Check, label: 'jaunes', backgroundColor: '#ffeb2b', color: '#111111' },
};

export const DarkBackground: Story = {
  args: { icon: Heart, label: 'roses', backgroundColor: '#ff69b4', color: '#ffffff' },
};
