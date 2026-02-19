import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { BoulderCard } from './BoulderCard';
import type { Boulder } from '@/types/boulder';
import type { Gym } from '@/types/gym';

const mockGym: Gym = {
  id: 'abc123',
  slug: 'wattabloc',
  name: 'Wattabloc',
  labels: {
    '1': 'jaune',
    '2': 'vert',
    '3': 'bleu',
    '4': 'rouge',
    '5': 'violet',
    '6': 'noir',
    '7': 'blanc',
    '8': 'rose',
  },
  labelsHexa: {
    '1': '#f5e642',
    '2': '#4caf50',
    '3': '#1e88e5',
    '4': '#e53935',
    '5': '#8a2be2',
    '6': '#222222',
    '7': '#dddddd',
    '8': '#ff69b4',
  },
  grades: {},
  holdsColors: {
    '1': 'roses',
    '2': 'noires',
    '3': 'oranges',
    '7': 'rouges',
    '8': 'bleues',
    '9': 'jaunes',
  },
  holdsColorsHexa: {
    '1': ['#ff69b4'],
    '2': ['#000000'],
    '3': ['#ff9800'],
    '7': ['#dd0000'],
    '8': ['#1e88e5'],
    '9': ['#ffeb2b'],
  },
  zones: { '1': { name: 'Bout du Monde' }, '6': { name: 'Dévers' } },
  map: {
    viewBox: '0 0 200 120',
    lines: [
      { zone: 1, points: '10,20 80,20 80,70 10,70 10,20' },
      { zone: 6, points: '100,20 190,20 190,100 100,100 100,20' },
    ],
  },
  routeTypes: [
    [4, ['Physique', true, true, true, true]],
    [11, ['Dynamique', true, true, false, true]],
    [14, ['Run & Jump', true, false, true, true]],
    [17, ['Traversée', true, false, true, true]],
  ],
  bouldersLifeLength: 90,
};

const baseBoulder: Boulder = {
  id: 'boulder1',
  gym: 'wattabloc',
  label: 3,
  grade: '6B+',
  holdsColor: 9,
  routeTypes: [4, 11],
  zone: 6,
  boulderNum: 42,
  createdAt: new Date().toISOString(),
  isClosed: null,
  sentsCount: 12,
  sentsList: [],
  flashesCount: 3,
  flashesList: [],
  projectsList: [],
  likesList: [],
  likesCount: 0,
  commentsCount: 2,
  videosCount: 0,
};

const meta: Meta<typeof BoulderCard> = {
  title: 'Components/BoulderCard',
  component: BoulderCard,
  decorators: [
    (Story) => (
      <View className="bg-background p-4">
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoulderCard>;

export const WithOnPress: Story = {
  args: {
    boulder: { ...baseBoulder, sentsCount: 5, likesCount: 2 },
    gym: mockGym,
    onPress: () => console.log('Boulder pressed'),
  },
};

export const Default: Story = {
  args: { boulder: baseBoulder, gym: mockGym },
};

export const WithRouteTypes: Story = {
  args: {
    boulder: { ...baseBoulder, routeTypes: [14, 17] },
    gym: mockGym,
  },
};

export const NoRouteType: Story = {
  args: {
    boulder: { ...baseBoulder, routeTypes: [] },
    gym: mockGym,
  },
};

export const DarkLabel: Story = {
  args: {
    boulder: { ...baseBoulder, label: 6, holdsColor: 2 },
    gym: mockGym,
  },
};

export const EasyGrade: Story = {
  args: {
    boulder: { ...baseBoulder, grade: '4A', label: 1, holdsColor: 3, sentsCount: 0 },
    gym: mockGym,
  },
};

export const WithVideo: Story = {
  args: {
    boulder: { ...baseBoulder, videosCount: 1 },
    gym: mockGym,
  },
};

export const WithStats: Story = {
  args: {
    boulder: { ...baseBoulder, sentsCount: 24, likesCount: 8, commentsCount: 3 },
    gym: mockGym,
  },
};

export const NoPhoto: Story = {
  args: {
    boulder: { ...baseBoulder, picture: undefined },
    gym: mockGym,
  },
};
