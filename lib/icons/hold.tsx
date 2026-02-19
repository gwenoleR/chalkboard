import type { LucideProps } from 'lucide-react-native';
import { Circle, Path, Svg } from 'react-native-svg';

/**
 * Custom climbing hold (jug) icon traced from the project design reference.
 * Organic wide blob with a finger-scoop groove and a mounting hole, on a 24×24 grid.
 *
 * Written as a plain JSX component (instead of createLucideIcon) to avoid the
 * "missing key prop" warning that createLucideIcon triggers on its SVG children.
 */
function Hold({ size = 24, color = '#000000', strokeWidth = 2 }: LucideProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color as string}
      strokeWidth={strokeWidth as number}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M4 8C4 6 6 4 10 4L14 4C18 4 22 5 22 9C22 14 20 18 16 19C13 20 8 20 5 19C3 18 2 15 2 12C2 9 3 9 4 8Z" />
      <Circle cx="11" cy="12" r="2.5" />
    </Svg>
  );
}

export { Hold };
