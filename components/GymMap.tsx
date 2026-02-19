import { useWindowDimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import type { GymMapData, GymZone } from '@/types/gym';

interface GymMapProps {
  map: GymMapData;
  zones: Record<string, GymZone>;
  activeZone: string | null;
  onZonePress: (zoneId: string) => void;
}

const PADDING = 16;
const GAP = 0.8; // units to trim from each end of a polyline

/** Shortens a polyline by `amount` units from both ends to create visual gaps at junctions. */
function shortenPolyline(pointsStr: string, amount: number): string {
  const pts = pointsStr
    .trim()
    .split(' ')
    .map((p) => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });

  if (pts.length < 2) return pointsStr;

  function trimFromStart(points: { x: number; y: number }[], dist: number) {
    let rem = dist;
    while (points.length > 1 && rem > 0) {
      const dx = points[1].x - points[0].x;
      const dy = points[1].y - points[0].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len <= rem) {
        points.shift();
        rem -= len;
      } else {
        const t = rem / len;
        points[0] = { x: points[0].x + dx * t, y: points[0].y + dy * t };
        rem = 0;
      }
    }
  }

  trimFromStart(pts, amount);
  pts.reverse();
  trimFromStart(pts, amount);
  pts.reverse();

  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

export function GymMap({ map, zones, activeZone, onZonePress }: GymMapProps) {
  const { width } = useWindowDimensions();
  const svgWidth = width - PADDING * 2;

  const [vbX, vbY, vbW, vbH] = map.viewBox.split(' ').map(Number);
  const svgHeight = (svgWidth * vbH) / vbW;

  const knownZoneIds = new Set(Object.keys(zones));

  return (
    <Svg width={svgWidth} height={svgHeight} viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}>
      {map.lines.map((line) => {
        const zoneId = String(line.zone);
        if (!knownZoneIds.has(zoneId)) return null;
        const isActive = activeZone === zoneId;
        const shortenedPoints = shortenPolyline(line.points, GAP);

        return (
          <Polyline
            key={zoneId}
            points={shortenedPoints}
            fill="none"
            stroke={isActive ? '#e35f8d' : '#94a3b8'}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            onPress={() => onZonePress(zoneId)}
          />
        );
      })}
    </Svg>
  );
}
