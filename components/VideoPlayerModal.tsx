import { Modal, Pressable, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

const MUX_STREAM = 'https://stream.mux.com';
const MUX_STREAM_PARAMS = '?max_resolution=720p';

interface VideoPlayerModalProps {
  videoId: string | null;
  onClose: () => void;
}

/**
 * Full-screen modal video player for Mux HLS streams.
 * Pass a Mux playback ID as `videoId`; null hides the modal.
 */
export function VideoPlayerModal({ videoId, onClose }: VideoPlayerModalProps) {
  const insets = useSafeAreaInsets();
  const source = videoId ? `${MUX_STREAM}/${videoId}.m3u8${MUX_STREAM_PARAMS}` : null;

  const player = useVideoPlayer(source, (p) => {
    p.play();
  });

  return (
    <Modal
      visible={!!videoId}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <VideoView
          player={player}
          style={{ flex: 1 }}
          nativeControls
        />

        {/* Close button */}
        <Pressable
          onPress={onClose}
          className="absolute items-center justify-center rounded-full bg-black/50 active:opacity-70"
          style={{ top: insets.top + 12, right: 16, width: 40, height: 40 }}
        >
          <X size={22} color="white" />
        </Pressable>
      </View>
    </Modal>
  );
}
