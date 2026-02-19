import { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';

interface FullScreenImageProps {
  /** Image URI to display full screen. */
  uri: string;
  visible: boolean;
  onClose: () => void;
}

/**
 * Full-screen zoomable image viewer presented as a modal.
 * Supports pinch-to-zoom, pan when zoomed, and double-tap to zoom/reset.
 * Close with the X button or double-tap to reset → then press X.
 */
export function FullScreenImage({ uri, visible, onClose }: FullScreenImageProps) {
  const insets = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Reset zoom state each time the modal opens
  useEffect(() => {
    if (visible) {
      scale.value = 1;
      savedScale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }
  }, [visible, scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY]);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, Math.min(savedScale.value * e.scale, 8));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .maxPointers(2)
    .onUpdate((e) => {
      // Only pan when zoomed in
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        // Reset instantly
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom in to 2.5× instantly
        scale.value = 2.5;
        savedScale.value = 2.5;
      }
    });

  const gesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[{ flex: 1 }, imageStyle]}>
            <Image source={{ uri }} style={{ flex: 1 }} contentFit="contain" />
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Close button — outside GestureDetector to avoid conflicts */}
      <Pressable
        onPress={onClose}
        className="absolute items-center justify-center rounded-full"
        style={{
          top: insets.top + 12,
          right: 16,
          width: 40,
          height: 40,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
      >
        <X size={20} color="#ffffff" />
      </Pressable>
    </Modal>
  );
}
