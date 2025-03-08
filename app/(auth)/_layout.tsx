import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Welcome', headerShown: false }} />
            <Stack.Screen name="signIn/index" options={{ title: 'Sign In', headerShown: false }} />
            <Stack.Screen name="signOut/index" options={{ title: 'Sign Out' }} />
            <Stack.Screen name="signUp/index" options={{ title: 'Sign Up', headerShown: false }} />
        </Stack>
    );
}