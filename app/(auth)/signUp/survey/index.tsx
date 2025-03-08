// F:\maid-day-app\app\(auth)\survey\index.tsx
"use client";

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Appearance } from 'react-native';
import { useRouter } from 'expo-router';
import Colors, { getTheme } from '../../../../backup/constants/Colors';

interface SurveyData {
    reliableTransportation: string;
    scheduleReliability: string;
    backgroundCheckConsent: string;
}

export default function SurveyScreen() {
    const router = useRouter();
    const [surveyData, setSurveyData] = useState<SurveyData>({
        reliableTransportation: '',
        scheduleReliability: '',
        backgroundCheckConsent: '',
    });
    const [error, setError] = useState('');
    const [theme, setTheme] = useState(getTheme());

    React.useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(getTheme());
        });
        return () => subscription.remove();
    }, []);

    const handleInputChange = (name: keyof SurveyData, value: string) => {
        setSurveyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSurveySubmit = () => {
        setError('');

        const { reliableTransportation, scheduleReliability, backgroundCheckConsent } = surveyData;

        if (!reliableTransportation || !scheduleReliability || !backgroundCheckConsent) {
            setError('Please answer all questions.');
            return;
        }

        const allYes =
            reliableTransportation.toLowerCase() === 'yes' &&
            scheduleReliability.toLowerCase() === 'yes' &&
            backgroundCheckConsent.toLowerCase() === 'yes';

        if (allYes) {
            router.push('/(auth)/signUp'); // Proceed to signup
        } else {
            setError('Sorry, you must meet all eligibility criteria to join as a maid.');
            setTimeout(() => {
                router.push('/(auth)/index'); // Redirect to home after delay
            }, 2000); // Show error for 2 seconds before redirect
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Pre-Signup Eligibility Survey
            </Text>

            <Text style={[styles.label, { color: theme.secondaryText }]}>
                Do you have reliable transportation?
            </Text>
            <TextInput
                value={surveyData.reliableTransportation}
                onChangeText={(text) => handleInputChange('reliableTransportation', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                placeholder="Yes or No"
                placeholderTextColor={theme.secondaryText}
            />

            <Text style={[styles.label, { color: theme.secondaryText }]}>
                Can you stick to a schedule and make it on time?
            </Text>
            <TextInput
                value={surveyData.scheduleReliability}
                onChangeText={(text) => handleInputChange('scheduleReliability', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                placeholder="Yes or No"
                placeholderTextColor={theme.secondaryText}
            />

            <Text style={[styles.label, { color: theme.secondaryText }]}>
                Do you consent to a background check?
            </Text>
            <TextInput
                value={surveyData.backgroundCheckConsent}
                onChangeText={(text) => handleInputChange('backgroundCheckConsent', text)}
                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                placeholder="Yes or No"
                placeholderTextColor={theme.secondaryText}
            />

            <TouchableOpacity
                onPress={handleSurveySubmit}
                style={[styles.button, { backgroundColor: theme.maidButton, borderColor: theme.maidButtonBorder }]}
            >
                <Text style={[styles.buttonText, { color: theme.maidButtonText }]}>Submit</Text>
            </TouchableOpacity>

            {error && <Text style={[styles.error, { color: '#FF4444' }]}>{error}</Text>}

            <TouchableOpacity onPress={() => router.push('/(auth)/index')}>
                <Text style={[styles.link, { color: theme.tint }]}>Back to Home</Text>
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
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
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