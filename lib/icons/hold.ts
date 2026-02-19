import { createLucideIcon } from 'lucide-react-native';

/**
 * Custom climbing hold (jug) icon traced from the project design reference.
 * Organic wide blob with a finger-scoop groove and a mounting hole, on a 24×24 grid.
 */
const Hold = createLucideIcon('Hold', [
  // Outer hold body — wide organic blob, flat-ish top, rounded bumpy bottom
  [
    'path',
    {
      d: 'M4 8C4 6 6 4 10 4L14 4C18 4 22 5 22 9C22 14 20 18 16 19C13 20 8 20 5 19C3 18 2 15 2 12C2 9 3 9 4 8Z',
    },
  ],
  // Mounting hole
  ['circle', { cx: '11', cy: '12', r: '2.5' }],
]);

export { Hold };
