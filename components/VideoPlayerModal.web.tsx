import { useEffect, useRef } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Hls from 'hls.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

const MUX_STREAM = 'https://stream.mux.com';
const MUX_STREAM_PARAMS = '?max_resolution=720p';

interface VideoPlayerModalProps {
  videoId: string | null;
  onClose: () => void;
}

/**
 * Web-specific video player using hls.js.
 * expo-video on web uses a bare <video> element that Chrome can't decode for HLS.
 * We attach hls.js to a raw HTML <video> element instead.
 */
export function VideoPlayerModal({ videoId, onClose }: VideoPlayerModalProps) {
  const insets = useSafeAreaInsets();
  // HACK: React Native Web renders to DOM, so we can ref an HTML <video> element
  // via React.createElement. The ref type is unknown at compile time.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current as HTMLVideoElement | null;
    if (!video || !videoId) return;

    const src = `${MUX_STREAM}/${videoId}.m3u8${MUX_STREAM_PARAMS}`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS — Safari supports it without hls.js
      video.src = src;
      video.play();
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [videoId]);

  return (
    <Modal
      visible={!!videoId}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black">
        {/* React.createElement('video') renders a real <video> DOM element on web */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(require('react') as any).createElement('video', {
          ref: videoRef,
          controls: true,
          style: { width: '100%', height: '100%', objectFit: 'contain', background: '#000' },
          playsInline: true,
        })}

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
