
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING } from '../theme';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Store token and navigate
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue your challenge</Text>

      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={{fontWeight: '700'}}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg, alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: SPACING.xl, marginTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
  form: { width: '100%' },
  input: { 
    backgroundColor: COLORS.white, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    padding: SPACING.md, 
    marginBottom: SPACING.md,
    fontSize: 16
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: SPACING.md, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: SPACING.md,
    marginBottom: SPACING.lg
  },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: '600' },
  linkText: { color: COLORS.primary, fontSize: 16, textAlign: 'center' }
});

export default LoginScreen;
