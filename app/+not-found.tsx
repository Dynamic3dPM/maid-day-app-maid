import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Appearance } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors, { getTheme } from '../constants/Colors'; // Adjust path based on nesting

export default function NotFoundScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const [theme, setTheme] = React.useState(getTheme());

  // Update theme when appearance changes
  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(getTheme()); // Update theme state to trigger re-render
    });
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

  const router = useRouter();

  const handleHomeNavigation = () => {
    router.push('/'); // Navigate to home screen
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Image
          source={require('../assets/images/not_found.png')} // Placeholder image
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.text }]}>
          This screen doesn't exist.
        </Text>

        <TouchableOpacity onPress={handleHomeNavigation} style={styles.link}>
          <Text style={[styles.linkText, { color: theme.tint }]}>
            Go to home screen!
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24, // Consistent with other screens
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,


  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36, // H1 per typography guidelines
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16, // Body text size
    fontWeight: '400',
    textAlign: 'center',
  },
});