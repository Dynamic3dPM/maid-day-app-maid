import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Appearance,
    Image, // Import Image component
} from 'react-native';
import { signIn } from '@aws-amplify/auth';
import { router } from 'expo-router'; // Import router only, remove Link
import Colors, { getTheme } from '../../../backup/constants/Colors'; // Path adjusted for nesting

interface FormData {
    email: string;
    password: string;
}

interface HandleInputChange {
    (name: keyof FormData, value: string): void;
}

export default function SignIn() {
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState(getTheme());

    // Update theme when appearance changes
    React.useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(getTheme());
        });
        return () => subscription.remove();
    }, []);

    const handleInputChange: HandleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            await signIn({
                username: formData.email,
                password: formData.password,
            });
            console.log('Navigating to / after sign-in');
            router.replace('/'); // Navigate to (tabs)/index
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpNavigation = () => {
        router.push('/(auth)/signUp'); // Navigate to SignUp page
    };

    if (!fontsLoaded) {
        return null; // Or <ActivityIndicator size="large" color={theme.tint} />
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Image source={require('../../../assets/images/clean.png')} style={styles.image} /> {/* Add Image */}
            <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

            <Text style={[styles.label, { color: theme.secondaryText }]}>Email</Text>
            <TextInput
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={theme.secondaryText}
            />

            <Text style={[styles.label, { color: theme.secondaryText }]}>Password</Text>
            <TextInput
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor={theme.secondaryText}
            />

            {loading ? (
                <ActivityIndicator size="large" color={theme.tint} />
            ) : (
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.button, { backgroundColor: theme.customerButton, borderColor: theme.customerButton }]}
                >
                    <Text style={[styles.buttonText, { color: theme.customerButtonText }]}>Sign In</Text>
                </TouchableOpacity>
            )}

            {error && <Text style={[styles.error, { color: '#FF4444' }]}>{error}</Text>}

            <TouchableOpacity onPress={handleSignUpNavigation}>
                <Text style={[styles.link, { color: theme.tint }]}>Need an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    image: {
        width: '100%', // Flex across the screen
        height: 200, // Adjust height as needed
        resizeMode: 'contain',
        marginBottom: 24,
    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 36, // H1 per typography guidelines
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16, // Body text size
        fontWeight: '400',
        marginBottom: 8,
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        fontWeight: '400',
        borderWidth: 1,
        padding: 12,
        marginBottom: 16,
        borderRadius: 8, // Softer corners

    },
    button: {
        borderRadius: 30, // Match AuthIndex button style
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        alignItems: 'center',
        marginVertical: 16,
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 26,
    },
    error: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    link: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
});