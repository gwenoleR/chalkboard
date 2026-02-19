import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

/** Returns black or white depending on which contrasts better with the given hex color. */
function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

interface HoldsColorBadgeProps {
  name: string;
  hex?: string;
}

export function HoldsColorBadge({ name, hex }: HoldsColorBadgeProps) {
  return (
    <Badge className="px-2 py-0.5" style={hex ? { backgroundColor: hex } : undefined}>
      <Text
        className="font-dm-sans text-xs capitalize"
        style={hex ? { color: contrastColor(hex) } : undefined}
      >
        {name}
      </Text>
    </Badge>
  );
}
