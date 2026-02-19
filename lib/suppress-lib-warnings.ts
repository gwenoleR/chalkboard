import { LogBox, Platform } from 'react-native';

// Warnings from react-native-web / react-navigation internals that cannot be
// fixed from our side (pointerEvents prop API, TouchableMixin, responder system).
const IGNORED_SUBSTRINGS = [
  'props.pointerEvents is deprecated',
  'TouchableMixin is deprecated',
  'Unknown event handler property',
  'onStartShouldSetResponder',
  'onResponder',
];

LogBox.ignoreLogs(IGNORED_SUBSTRINGS);

// On web these are fired via console.warn (warnOnce) or console.error.
// Patch both to filter them out.
if (Platform.OS === 'web') {
  const filter =
    (original: (...args: unknown[]) => void) =>
    (...args: unknown[]) => {
      const anyMatch = args.some(
        (a) => typeof a === 'string' && IGNORED_SUBSTRINGS.some((s) => a.includes(s))
      );
      if (anyMatch) return;
      original(...args);
    };

  console.warn = filter(console.warn.bind(console));
  console.error = filter(console.error.bind(console));
}
