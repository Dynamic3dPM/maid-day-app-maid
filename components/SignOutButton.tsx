import React from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Text,
} from 'react-native';


export default function SignOutButton() {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
});