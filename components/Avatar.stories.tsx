import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: { name: 'Gwenole Roton', size: 64 },
};

export const SingleName: Story = {
  args: { name: 'Gwe', size: 64 },
};

export const WithPhoto: Story = {
  args: {
    name: 'Wattabloc',
    avatarUrl: 'https://socialboulder.s3-eu-west-1.amazonaws.com/gyms/wattabloc/android-chrome-192x192.png',
    size: 64,
  },
};

export const Large: Story = {
  args: { name: 'Gwenole Roton', size: 96 },
};
