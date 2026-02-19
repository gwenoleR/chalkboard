import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { BoulderStatRow } from './BoulderStatRow';

const meta: Meta<typeof BoulderStatRow> = {
  title: 'Components/BoulderStatRow',
  component: BoulderStatRow,
  decorators: [
    (Story) => (
      <View className="bg-background px-4">
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoulderStatRow>;

export const Default: Story = {
  args: {
    stats: [
      { value: 47, label: 'Envois' },
      { value: 12, label: 'Flashs' },
      { value: 8, label: 'Likes' },
    ],
  },
};

export const TwoStats: Story = {
  args: {
    stats: [
      { value: 3, label: 'Envois' },
      { value: 1, label: 'Flashs' },
    ],
  },
};

export const LargeNumbers: Story = {
  args: {
    stats: [
      { value: 314, label: 'Envois' },
      { value: 87, label: 'Flashs' },
      { value: 102, label: 'Likes' },
    ],
  },
};

export const ZeroValues: Story = {
  args: {
    stats: [
      { value: 0, label: 'Envois' },
      { value: 0, label: 'Flashs' },
      { value: 0, label: 'Likes' },
    ],
  },
};
