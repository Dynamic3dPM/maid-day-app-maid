// F:\maid-day-app\app\(auth)\index.tsx
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    Appearance,
    Modal,
    TextInput,
} from 'react-native';
import { useRouter, useSegments, usePathname } from 'expo-router';
import { getCurrentUser } from '@aws-amplify/auth';
import { getTheme } from '../../backup/constants/Colors';

interface SurveyData {
    reliableTransportation: string;
    scheduleReliability: string;
    backgroundCheckConsent: string;
}

export default function AuthIndex() {
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });

    const router = useRouter();
    const segments = useSegments();
    const pathname = usePathname();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
    const [theme, setTheme] = useState(getTheme());
    const [surveyModalVisible, setSurveyModalVisible] = useState(false);
    const [surveyData, setSurveyData] = useState<SurveyData>({
        reliableTransportation: '',
        scheduleReliability: '',
        backgroundCheckConsent: '',
    });
    const [surveyError, setSurveyError] = useState('');

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(getTheme());
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            if (!mounted || hasCheckedAuth) return;

            try {
                await getCurrentUser();
                console.log('User is authenticated, redirecting to /(tabs)/index');
                setHasCheckedAuth(true);
                router.replace('/(tabs)');
            } catch (err) {
                console.log('User is not authenticated, staying on auth route');
                setHasCheckedAuth(true);
            }
        };

        checkAuth();

        return () => {
            mounted = false;
        };
    }, [hasCheckedAuth]);

    useEffect(() => {
        console.log('AuthIndex - Current pathname:', pathname, 'Segments:', segments);
    }, [pathname, segments]);

    const handleNavigation = (path: string) => () => {
        console.log('Attempting to navigate to:', path);
        router.push(path as any);
    };

    const handleSurveyInputChange = (name: keyof SurveyData, value: string) => {
        setSurveyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSurveySubmit = () => {
        setSurveyError('');

        const { reliableTransportation, scheduleReliability, backgroundCheckConsent } = surveyData;

        if (!reliableTransportation || !scheduleReliability || !backgroundCheckConsent) {
            setSurveyError('Please answer all questions.');
            return;
        }

        const allYes =
            reliableTransportation.toLowerCase() === 'yes' &&
            scheduleReliability.toLowerCase() === 'yes' &&
            backgroundCheckConsent.toLowerCase() === 'yes';

        if (allYes) {
            setSurveyModalVisible(false);
            router.push('/(auth)/signUp');
        } else {
            setSurveyError('Sorry, you must meet all eligibility criteria to join as a maid.');
            setTimeout(() => {
                setSurveyModalVisible(false);
                setSurveyData({ reliableTransportation: '', scheduleReliability: '', backgroundCheckConsent: '' });
            }, 2000); // Show error for 2 seconds, then close modal
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.headerImgContainer, { backgroundColor: theme.background }]}>
                        <Image
                            alt="Maid Day Logo"
                            resizeMode="contain"
                            style={styles.headerImg}
                            source={require('../../assets/images/Maid_Logo.png')}
                        />
                    </View>
                    <Text style={[styles.h1, { color: theme.text }]}>
                        Welcome to <Text style={{ color: theme.tint }}>Maid Day</Text>
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                        Sign in or sign up to manage your cleaning services
                    </Text>
                </View>

                <View style={styles.form}>
                    <TouchableOpacity
                        onPress={handleNavigation('/(auth)/signIn')}
                        style={[
                            styles.btn,
                            {
                                backgroundColor: theme.customerButton,
                                borderColor: theme.customerButton,
                            },
                        ]}
                    >
                        <Text style={[styles.btnText, { color: theme.customerButtonText }]}>
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSurveyModalVisible(true)} // Open survey modal
                        style={[
                            styles.btn,
                            {
                                backgroundColor: theme.maidButton,
                                borderColor: theme.maidButtonBorder,
                            },
                        ]}
                    >
                        <Text style={[styles.btnText, { color: theme.maidButtonText }]}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={surveyModalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setSurveyModalVisible(false)}
                >
                    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Pre-Signup Eligibility Survey
                            </Text>

                            <Text style={[styles.label, { color: theme.secondaryText }]}>
                                Do you have reliable transportation?
                            </Text>
                            <TextInput
                                value={surveyData.reliableTransportation}
                                onChangeText={(text) => handleSurveyInputChange('reliableTransportation', text)}
                                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                                placeholder="Yes or No"
                                placeholderTextColor={theme.secondaryText}
                            />

                            <Text style={[styles.label, { color: theme.secondaryText }]}>
                                Can you stick to a schedule and make it on time?
                            </Text>
                            <TextInput
                                value={surveyData.scheduleReliability}
                                onChangeText={(text) => handleSurveyInputChange('scheduleReliability', text)}
                                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                                placeholder="Yes or No"
                                placeholderTextColor={theme.secondaryText}
                            />

                            <Text style={[styles.label, { color: theme.secondaryText }]}>
                                Do you consent to a background check?
                            </Text>
                            <TextInput
                                value={surveyData.backgroundCheckConsent}
                                onChangeText={(text) => handleSurveyInputChange('backgroundCheckConsent', text)}
                                style={[styles.input, { borderColor: theme.tint, color: theme.text }]}
                                placeholder="Yes or No"
                                placeholderTextColor={theme.secondaryText}
                            />

                            <TouchableOpacity
                                onPress={handleSurveySubmit}
                                style={[styles.btn, { backgroundColor: theme.maidButton, borderColor: theme.maidButtonBorder }]}
                            >
                                <Text style={[styles.btnText, { color: theme.maidButtonText }]}>Submit</Text>
                            </TouchableOpacity>

                            {surveyError && <Text style={[styles.error, { color: '#FF4444' }]}>{surveyError}</Text>}

                            <TouchableOpacity onPress={() => setSurveyModalVisible(false)}>
                                <Text style={[styles.cancelLink, { color: theme.tint }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 36,
    },
    headerImgContainer: {
        width: 170,
        height: 170,
        borderRadius: 85,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'hidden',
    },
    headerImg: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    h1: {
        fontFamily: 'Poppins-Bold',
        fontSize: 36,
        fontWeight: '700',
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
    },
    form: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        alignItems: 'center',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        marginVertical: 8,
        width: '80%',
    },
    btnText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '700',
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
        marginBottom: 15,
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
        width: '100%',
    },
    error: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    cancelLink: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 15,
    },
});