import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { GymAvatar } from './GymAvatar';

const meta: Meta<typeof GymAvatar> = {
  title: 'GymAvatar',
  component: GymAvatar,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GymAvatar>;

/** Gym with a known logo (Wattabloc). */
export const WithLogo: Story = {
  args: {
    gym: { id: 'wattabloc', name: 'Wattabloc', city: 'Paris', filesGym: 'wattabloc', logoType: 'png' },
    size: 36,
  },
};

/** Gym without a logo — shows initials fallback. */
export const Initials: Story = {
  args: {
    gym: { id: 'unknown-gym', name: 'Unknown Gym', city: 'Lyon' },
    size: 36,
  },
};

/** Larger size (40px) as used in the onboarding screen. */
export const LargeWithLogo: Story = {
  args: {
    gym: { id: 'isatix', name: 'Isatix', city: 'Paris', filesGym: 'isatix', logoType: 'png' },
    size: 40,
  },
};

/** Larger size without a logo. */
export const LargeInitials: Story = {
  args: {
    gym: { id: 'my-gym', name: 'My Gym', city: 'Bordeaux' },
    size: 40,
  },
};
