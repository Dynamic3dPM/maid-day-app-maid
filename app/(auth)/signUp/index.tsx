// F:\maid-day-app\app\(auth)\signUp\index.tsx
"use client";

import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    Pressable,
    Appearance,
} from 'react-native';
import { signUp, confirmSignUp, resendSignUpCode } from '@aws-amplify/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors, { getTheme } from '../../../backup/constants/Colors';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export default function SignUp() {
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
    });

    const router = useRouter();
    const params = useLocalSearchParams(); // To receive survey data if needed
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [theme, setTheme] = useState(getTheme());

    React.useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(getTheme());
        });
        return () => subscription.remove();
    }, []);

    const handleInputChange = (name: keyof FormData, value: string) => {
        if (name === 'phone') {
            value = '+1' + value.replace(/^\+1/, '');
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        const { email, password, confirmPassword, firstName, lastName, phone } = formData;
        if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!phone.match(/^\+\d{10,15}$/)) {
            setError('Phone must be in E.164 format (e.g., +12345678901)');
            setLoading(false);
            return;
        }

        try {
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        given_name: firstName,
                        family_name: lastName,
                        phone_number: phone,
                        'custom:reliableTransportation': 'yes', // Passed from survey
                        'custom:scheduleReliability': 'yes',    // Passed from survey
                        'custom:backgroundCheckConsent': 'yes', // Passed from survey
                        'custom:zipCode': '',
                    },
                    autoSignIn: { enabled: true },
                },
            });
            console.log('Sign-up initiated, showing OTP modal');
            setOtpModalVisible(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign-up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpConfirm = async () => {
        setOtpError('');
        setOtpLoading(true);

        try {
            await confirmSignUp({
                username: formData.email,
                confirmationCode: otpCode,
            });
            console.log('Sign-up confirmed');
            setOtpModalVisible(false);
            router.push('/(tabs)');
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Confirmation failed');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResend = async () => {
        setOtpError('');
        setOtpLoading(true);

        try {
            await resendSignUpCode({ username: formData.email });
            setOtpError('A new code has been sent to your email');
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Resend failed');
        } finally {
            setOtpLoading(false);
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={theme.tint} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Sign Up</Text>

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

            <Text style={[styles.label, { color: theme.secondaryText }]}>First Name</Text>
            <TextInput
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                placeholder="Enter your first name"
                placeholderTextColor={theme.secondaryText}
            />

            <Text style={[styles.label, { color: theme.secondaryText }]}>Last Name</Text>
            <TextInput
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                placeholder="Enter your last name"
                placeholderTextColor={theme.secondaryText}
            />

            <Text style={[styles.label, { color: theme.secondaryText }]}>Phone</Text>
            <TextInput
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                keyboardType="phone-pad"
                placeholder="+1 5555555555"
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

            <Text style={[styles.label, { color: theme.secondaryText }]}>Confirm Password</Text>
            <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                secureTextEntry
                placeholder="Confirm your password"
                placeholderTextColor={theme.secondaryText}
            />

            {loading ? (
                <ActivityIndicator size="large" color={theme.tint} />
            ) : (
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.button, { backgroundColor: theme.maidButton, borderColor: theme.maidButtonBorder }]}
                >
                    <Text style={[styles.buttonText, { color: theme.maidButtonText }]}>Sign Up</Text>
                </TouchableOpacity>
            )}

            {error && <Text style={[styles.error, { color: '#FF4444' }]}>{error}</Text>}

            <TouchableOpacity onPress={() => router.push('/(auth)/index')}>
                <Text style={[styles.link, { color: theme.tint }]}>Back to Home</Text>
            </TouchableOpacity>

            <Modal
                visible={otpModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Enter Confirmation Code
                        </Text>
                        <Text style={[styles.modalSubtitle, { color: theme.secondaryText }]}>
                            Check your email ({formData.email || 'unknown'}) for the code sent by Maid Day.
                        </Text>
                        <TextInput
                            value={otpCode}
                            onChangeText={setOtpCode}
                            style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                            keyboardType="numeric"
                            placeholder="Enter 6-digit code"
                            placeholderTextColor={theme.secondaryText}
                            maxLength={6}
                        />
                        {otpLoading ? (
                            <ActivityIndicator size="large" color={theme.tint} />
                        ) : (
                            <TouchableOpacity
                                onPress={handleOtpConfirm}
                                style={[styles.button, { backgroundColor: theme.customerButton, borderColor: theme.customerButton }]}
                            >
                                <Text style={[styles.buttonText, { color: theme.customerButtonText }]}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        )}
                        {otpError && <Text style={[styles.error, { color: '#FF4444' }]}>{otpError}</Text>}
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={[styles.link, { color: theme.tint }]}>Resend Code</Text>
                        </TouchableOpacity>
                        <Pressable onPress={() => setOtpModalVisible(false)}>
                            <Text style={[styles.cancelLink, { color: theme.tint }]}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 36,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 8,
    },
    input: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        borderWidth: 1,
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
    },
    button: {
        borderRadius: 30,
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    cancelLink: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 15,
    },
});