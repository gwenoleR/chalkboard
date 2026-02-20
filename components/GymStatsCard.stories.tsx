import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { GymStatsCard } from './GymStatsCard';

const meta: Meta<typeof GymStatsCard> = {
  title: 'GymStatsCard',
  component: GymStatsCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GymStatsCard>;

export const WithStats: Story = {
  args: {
    gymSlug: 'wattabloc',
    userId: '57gTQAqa9uh2eW6af',
    scores: {
      counts: { '0': 8 },
      bestGrades: { '0': '7A' },
      lastSend: '2026-02-20T21:15:11.767Z',
    },
  },
};

export const NoActivity: Story = {
  args: {
    gymSlug: 'arkose',
    userId: '57gTQAqa9uh2eW6af',
    scores: {},
  },
};
