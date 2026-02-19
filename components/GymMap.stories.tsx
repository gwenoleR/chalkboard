import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { GymMap } from './GymMap';
import type { GymMapData, GymZone } from '@/types/gym';

// Minimal wattabloc-like floor plan with 3 zones for demo purposes
const demoMap: GymMapData = {
  viewBox: '-1 -1 40 25',
  lines: [
    { zone: 1, points: '2,2 15,2 15,12 2,12 2,2' },
    { zone: 2, points: '15,2 30,2 30,12 15,12 15,2' },
    { zone: 3, points: '2,12 30,12 30,22 2,22 2,12' },
  ],
};

const demoZones: Record<string, GymZone> = {
  '1': { name: 'Zone A' },
  '2': { name: 'Zone B' },
  '3': { name: 'Zone C' },
};

function InteractiveMap() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <View className="gap-3">
      <GymMap map={demoMap} zones={demoZones} activeZone={active} onZonePress={setActive} />
      <Text className="text-center font-dm-sans text-sm text-muted-foreground">
        {active ? `Zone active : ${demoZones[active]?.name}` : 'Appuie sur une zone'}
      </Text>
    </View>
  );
}

const meta: Meta<typeof GymMap> = {
  title: 'Components/GymMap',
  component: GymMap,
  decorators: [
    (Story) => (
      <View className="bg-background p-4">
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GymMap>;

export const NoActiveZone: Story = {
  args: {
    map: demoMap,
    zones: demoZones,
    activeZone: null,
    onZonePress: () => {},
  },
};

export const WithActiveZone: Story = {
  args: {
    map: demoMap,
    zones: demoZones,
    activeZone: '2',
    onZonePress: () => {},
  },
};

export const Interactive: Story = {
  render: () => <InteractiveMap />,
};
