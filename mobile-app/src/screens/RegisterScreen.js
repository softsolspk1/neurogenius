
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING } from '../theme';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    designation: '', specialty: '', 
    hospital: '', pmdc_number: '', 
    city: '', phone: ''
  });

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3001/api/auth/signup', formData);
      Alert.alert('Success', 'Account created! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Check your details');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the Neuro Genius medical community</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Full Name" onChangeText={t => setFormData({...formData, name: t})} />
        <TextInput style={styles.input} placeholder="Email" onChangeText={t => setFormData({...formData, email: t})} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" onChangeText={t => setFormData({...formData, password: t})} secureTextEntry />
        <TextInput style={styles.input} placeholder="PMDC Number" onChangeText={t => setFormData({...formData, pmdc_number: t})} />
        <TextInput style={styles.input} placeholder="Specialty" onChangeText={t => setFormData({...formData, specialty: t})} />
        <TextInput style={styles.input} placeholder="Hospital" onChangeText={t => setFormData({...formData, hospital: t})} />
        <TextInput style={styles.input} placeholder="City" onChangeText={t => setFormData({...formData, city: t})} />
        <TextInput style={styles.input} placeholder="Phone Number" onChangeText={t => setFormData({...formData, phone: t})} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? <Text style={{fontWeight: '700'}}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.lg, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8, marginTop: 40 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  form: { width: '100%' },
  input: { 
    backgroundColor: COLORS.white, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 8, 
    padding: SPACING.md, 
    marginBottom: SPACING.sm,
    fontSize: 14
  },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: SPACING.md, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: SPACING.md,
    marginBottom: SPACING.lg
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  linkText: { color: COLORS.primary, fontSize: 14, textAlign: 'center', marginBottom: 40 }
});

export default RegisterScreen;
