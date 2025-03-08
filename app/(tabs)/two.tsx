import { StyleSheet, Button, ActivityIndicator, Text } from 'react-native';
import { signOut } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import EditScreenInfo from '@/backup/components/EditScreenInfo';
import { View } from '@/backup/components/Themed';
import { useState } from 'react';

export default function TabTwoScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);

    try {
      await signOut();
      router.push('/(auth)'); // Navigate to the auth welcome screen
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-out failed');
      console.error('Error signing out: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Sign Out" onPress={handleSignOut} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});