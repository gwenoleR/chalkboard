import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/lib/auth/auth-context';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, loginAsGuest } = useAuth();
  const colorScheme = useColorScheme();
  const mutedFg = THEME[colorScheme === 'dark' ? 'dark' : 'light'].mutedForeground;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch {
      setError(t('auth.error'));
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    loginAsGuest();
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="mb-8 font-outfit-bold text-3xl text-foreground">{t('auth.title')}</Text>

        <TextInput
          className={cn(
            'mb-4 rounded-xl border border-border bg-card px-4 py-3',
            'font-dm-sans text-base text-foreground'
          )}
          placeholder={t('auth.email')}
          placeholderTextColor={mutedFg}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TextInput
          className={cn(
            'mb-2 rounded-xl border border-border bg-card px-4 py-3',
            'font-dm-sans text-base text-foreground'
          )}
          placeholder={t('auth.password')}
          placeholderTextColor={mutedFg}
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          onSubmitEditing={handleLogin}
        />

        {error && (
          <Text className="mb-4 font-dm-sans text-sm text-destructive">{error}</Text>
        )}

        <View
          className={cn(
            'mt-4 items-center justify-center rounded-xl py-4',
            loading ? 'bg-primary/60' : 'bg-primary'
          )}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className="font-outfit-semibold text-base text-primary-foreground"
              onPress={handleLogin}
            >
              {t('auth.submit')}
            </Text>
          )}
        </View>

        <Text
          className="mt-6 text-center font-dm-sans text-sm text-muted-foreground"
          onPress={handleGuest}
        >
          {t('auth.continueAsGuest')}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
