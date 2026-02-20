import type { Meta, StoryObj } from '@storybook/react-native';

import { VideoPlayerModal } from './VideoPlayerModal';

// Real Mux playback ID from Social Boulder (wattabloc boulder jQy29Kri9QszWqZnz)
const SAMPLE_PLAYBACK_ID = 'fR3c60000BH00L41icfKl5sAmYWAiBP6GmOLwrVkoUE00aY';

const meta: Meta<typeof VideoPlayerModal> = {
  title: 'Components/VideoPlayerModal',
  component: VideoPlayerModal,
};

export default meta;
type Story = StoryObj<typeof VideoPlayerModal>;

export const Visible: Story = {
  args: {
    videoId: SAMPLE_PLAYBACK_ID,
    onClose: () => console.log('close'),
  },
};

export const Hidden: Story = {
  args: {
    videoId: null,
    onClose: () => console.log('close'),
  },
};
