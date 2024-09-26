import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

const Register = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://img.icons8.com/color/452/pokeball--v1.png' }}
                style={styles.logo}
            />
            <Text style={styles.title}>Regístrate</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Repetir contraseña"
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>
            <View style={styles.separator}>
                <Text style={styles.separatorText}>──────── o ────────</Text>
            </View>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 20,
    },
    separatorText: {
        color: '#888',
        fontSize: 16,
    },
    loginText: {
        fontSize: 16,
        color: '#888',
    },
    loginButton: {
        marginTop: 10,
        backgroundColor: '#00bfff',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Register;
