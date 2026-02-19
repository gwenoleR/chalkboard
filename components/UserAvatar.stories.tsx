import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { UserAvatar } from './UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Components/UserAvatar',
  component: UserAvatar,
  decorators: [
    (Story) => (
      <View className="flex-row flex-wrap items-end gap-4 bg-background p-6">
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {
  args: { name: 'Alice Dupont' },
};

export const SingleName: Story = {
  args: { name: 'Corentin' },
};

export const Small: Story = {
  args: { name: 'Jean-Pierre Martin', size: 32 },
};

export const Large: Story = {
  args: { name: 'Sophie Lambert', size: 56 },
};
