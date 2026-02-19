import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

const SAMPLE_HEADING = 'Boulder 6B+';
const SAMPLE_BODY = 'Technique, gainage, à doigts. Ouverture du 14 février. 42 envois, 8 flash.';

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 12 }} />;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '600',
        color: '#e35f8d',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}
    >
      {children}
    </Text>
  );
}

function TypographyScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <SectionTitle>Outfit — Headings</SectionTitle>
      {[
        { label: 'outfit (400)', family: 'Outfit_400Regular', size: 22 },
        { label: 'outfit-medium (500)', family: 'Outfit_500Medium', size: 22 },
        { label: 'outfit-semibold (600)', family: 'Outfit_600SemiBold', size: 22 },
        { label: 'outfit-bold (700)', family: 'Outfit_700Bold', size: 22 },
      ].map(({ label, family, size }) => (
        <View key={label} className="mb-3">
          <Text style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>{label}</Text>
          <Text style={{ fontFamily: family, fontSize: size, color: '#111' }}>
            {SAMPLE_HEADING}
          </Text>
        </View>
      ))}

      <Divider />

      <SectionTitle>DM Sans — Body / UI</SectionTitle>
      {[
        { label: 'dm-sans (400)', family: 'DMSans_400Regular', size: 14 },
        { label: 'dm-sans-medium (500)', family: 'DMSans_500Medium', size: 14 },
        { label: 'dm-sans-semibold (600)', family: 'DMSans_600SemiBold', size: 14 },
        { label: 'dm-sans-bold (700)', family: 'DMSans_700Bold', size: 14 },
      ].map(({ label, family, size }) => (
        <View key={label} className="mb-3">
          <Text style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>{label}</Text>
          <Text
            style={{ fontFamily: family, fontSize: size, color: '#444', lineHeight: size * 1.5 }}
          >
            {SAMPLE_BODY}
          </Text>
        </View>
      ))}

      <Divider />

      <SectionTitle>Preview combiné</SectionTitle>
      <View
        style={{
          padding: 16,
          backgroundColor: '#fafafa',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#eee',
        }}
      >
        <Text
          style={{ fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#e35f8d', marginBottom: 4 }}
        >
          {SAMPLE_HEADING}
        </Text>
        <Text
          style={{ fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#555', lineHeight: 21 }}
        >
          {SAMPLE_BODY}
        </Text>
      </View>

      <Divider />

      <SectionTitle>Échelle de tailles (DM Sans)</SectionTitle>
      {[
        { label: 'text-xs (12)', size: 12 },
        { label: 'text-sm (14)', size: 14 },
        { label: 'text-base (16)', size: 16 },
        { label: 'text-lg (18)', size: 18 },
        { label: 'text-xl (20)', size: 20 },
        { label: 'text-2xl (24)', size: 24, family: 'Outfit_600SemiBold' },
        { label: 'text-3xl (30)', size: 30, family: 'Outfit_700Bold' },
      ].map(({ label, size, family }) => (
        <Text
          key={label}
          style={{
            fontFamily: family ?? 'DMSans_400Regular',
            fontSize: size,
            color: '#333',
            marginBottom: 4,
          }}
        >
          {label} — Wattabloc
        </Text>
      ))}
    </ScrollView>
  );
}

const meta: Meta<typeof TypographyScreen> = {
  title: 'Design System/Typography',
  component: TypographyScreen,
};

export default meta;

export const Default: StoryObj<typeof TypographyScreen> = {};
