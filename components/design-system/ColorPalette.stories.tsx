import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { THEME } from '@/lib/theme';

const palette = {
  primary: {
    50: '#f8f5f6',
    100: '#f1e3e8',
    200: '#eac2d0',
    300: '#e599b3',
    400: '#e37ca0',
    500: '#e35f8d',
    600: '#dc316d',
    700: '#be1c55',
    800: '#921641',
    900: '#63112e',
    950: '#3b0b1c',
  },
  secondary: {
    50: '#f5f8f7',
    100: '#e4f0ec',
    200: '#c5e7db',
    300: '#93dcc2',
    400: '#52cfa4',
    500: '#2aab7e',
    600: '#1f8964',
    700: '#176d4f',
    800: '#10503a',
    900: '#0d3527',
    950: '#091f17',
  },
} as const;

// Tokens sémantiques exposés par RNR/Tailwind via CSS variables
const semanticTokens: { label: string; key: keyof typeof THEME.light; fg?: string }[] = [
  { label: 'background', key: 'background' },
  { label: 'foreground', key: 'foreground' },
  { label: 'card', key: 'card' },
  { label: 'card-foreground', key: 'cardForeground' },
  { label: 'primary', key: 'primary', fg: '#fff' },
  { label: 'primary-foreground', key: 'primaryForeground' },
  { label: 'secondary', key: 'secondary', fg: '#fff' },
  { label: 'secondary-foreground', key: 'secondaryForeground' },
  { label: 'muted', key: 'muted' },
  { label: 'muted-foreground', key: 'mutedForeground' },
  { label: 'accent', key: 'accent' },
  { label: 'accent-foreground', key: 'accentForeground' },
  { label: 'destructive', key: 'destructive', fg: '#fff' },
  { label: 'border', key: 'border' },
  { label: 'input', key: 'input' },
  { label: 'ring', key: 'ring', fg: '#fff' },
];

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <View className="mb-2 flex-row items-center">
      <View
        style={{ backgroundColor: hex }}
        className="mr-3 h-10 w-14 rounded-md border border-gray-200"
      />
      <View>
        <Text style={{ color: '#111', fontWeight: '600', fontSize: 13 }}>{label}</Text>
        <Text style={{ color: '#555', fontSize: 11 }}>{hex}</Text>
      </View>
    </View>
  );
}

function SemanticSwatch({
  label,
  color,
  textColor,
}: {
  label: string;
  color: string;
  textColor?: string;
}) {
  return (
    <View className="mb-2 flex-row items-center">
      <View
        style={{ backgroundColor: color }}
        className="mr-3 h-10 w-14 items-center justify-center rounded-md border border-gray-200"
      >
        <Text style={{ fontSize: 8, color: textColor ?? '#333', fontWeight: '600' }}>Aa</Text>
      </View>
      <View className="flex-1">
        <Text style={{ color: '#111', fontWeight: '600', fontSize: 13 }}>--{label}</Text>
        <Text style={{ color: '#555', fontSize: 11 }}>{color}</Text>
      </View>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 6,
      }}
    >
      {children}
    </Text>
  );
}

function ColorPaletteScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <SectionTitle>Tokens sémantiques (light)</SectionTitle>
      {semanticTokens.map(({ label, key, fg }) => (
        <SemanticSwatch key={label} label={label} color={THEME.light[key]} textColor={fg} />
      ))}

      <SectionTitle>Primary — French Rose</SectionTitle>
      {Object.entries(palette.primary).map(([shade, hex]) => (
        <Swatch key={shade} hex={hex} label={`primary-${shade}`} />
      ))}

      <SectionTitle>Secondary — Teal</SectionTitle>
      {Object.entries(palette.secondary).map(([shade, hex]) => (
        <Swatch key={shade} hex={hex} label={`secondary-${shade}`} />
      ))}
    </ScrollView>
  );
}

const meta: Meta<typeof ColorPaletteScreen> = {
  title: 'Design System/Color Palette',
  component: ColorPaletteScreen,
};

export default meta;

export const Default: StoryObj<typeof ColorPaletteScreen> = {};
