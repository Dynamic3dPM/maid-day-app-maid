import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';

export default function SignOut() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignOut = async () => {
        setError('');
        setLoading(true);

        try {
            await signOut();
            router.push('/signIn');
        } catch (err) {
            const error = err as Error;
            setError(`Sign-out error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Out</Text>
            <Text style={styles.subtitle}>Are you sure you want to sign out?</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <Button title="Sign Out" onPress={handleSignOut} disabled={loading} />
            )}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});