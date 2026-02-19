import type { Meta, StoryObj } from '@storybook/react-native';

import { FullScreenImage } from './FullScreenImage';

// Use a public placeholder image so the story works on device/simulator.
const PLACEHOLDER = 'https://picsum.photos/seed/boulder/800/1000';

const meta: Meta<typeof FullScreenImage> = {
  title: 'Components/FullScreenImage',
  component: FullScreenImage,
};

export default meta;
type Story = StoryObj<typeof FullScreenImage>;

export const Visible: Story = {
  args: {
    uri: PLACEHOLDER,
    visible: true,
    onClose: () => console.log('close'),
  },
};

export const Hidden: Story = {
  args: {
    uri: PLACEHOLDER,
    visible: false,
    onClose: () => console.log('close'),
  },
};
