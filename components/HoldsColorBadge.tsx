import { contrastColor } from '@/lib/color';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

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
