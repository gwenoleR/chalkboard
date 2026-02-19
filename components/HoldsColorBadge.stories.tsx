import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { HoldsColorBadge } from './HoldsColorBadge';

const meta: Meta<typeof HoldsColorBadge> = {
  title: 'Components/HoldsColorBadge',
  component: HoldsColorBadge,
  decorators: [
    (Story) => (
      <View className="flex-1 items-center justify-center gap-3 bg-background p-6">
        <Story />
      </View>
    ),
  ],
  argTypes: {
    name: { control: 'text' },
    hex: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof HoldsColorBadge>;

export const Yellow: Story = { args: { name: 'jaunes', hex: '#ffeb2b' } };
export const Black: Story = { args: { name: 'noires', hex: '#000000' } };
export const White: Story = { args: { name: 'blanches', hex: '#dddddd' } };
export const Pink: Story = { args: { name: 'roses', hex: '#ff69b4' } };
export const Blue: Story = { args: { name: 'bleues', hex: '#1e88e5' } };
export const NoColor: Story = { args: { name: 'inconnues' } };

export const AllColors: Story = {
  render: () => (
    <View className="gap-2">
      {[
        { name: 'roses', hex: '#ff69b4' },
        { name: 'noires', hex: '#000000' },
        { name: 'oranges', hex: '#ff9800' },
        { name: 'vertes', hex: '#008000' },
        { name: 'violettes', hex: '#8a2be2' },
        { name: 'blanches', hex: '#dddddd' },
        { name: 'rouges', hex: '#dd0000' },
        { name: 'bleues', hex: '#1e88e5' },
        { name: 'jaunes', hex: '#ffeb2b' },
        { name: 'mint', hex: '#91e0c8' },
      ].map((c) => (
        <HoldsColorBadge key={c.name} name={c.name} hex={c.hex} />
      ))}
    </View>
  ),
};
