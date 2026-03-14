
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../theme';
import { Hash, ChevronRight } from 'lucide-react-native';
import api from '../services/api';

const WardActivityScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (pin.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter a 6-digit PIN code.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/quizzes/join/${pin}`);
      if (response.data.success) {
        navigation.navigate('Quiz', {
          categoryId: response.data.session.category_id,
          isWardActivity: true,
          questions: response.data.questions,
          sessionId: response.data.session.id
        });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not join session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ward Activity</Text>
        <Text style={styles.subtitle}>Enter the 6-digit PIN to join the session</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Hash color={COLORS.primary} size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="000000"
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleJoin}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.buttonText}>Join Session</Text>
              <ChevronRight color={COLORS.white} size={20} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.xl, marginTop: 40 },
  title: { fontSize: 32, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textMuted },
  content: { padding: SPACING.lg, alignItems: 'center' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    marginBottom: SPACING.xl
  },
  icon: { marginRight: SPACING.md },
  input: { flex: 1, fontSize: 32, fontWeight: '700', letterSpacing: 8, textAlign: 'center' },
  button: { 
    backgroundColor: COLORS.primary, 
    width: '100%', 
    padding: SPACING.lg, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: '700' }
});

export default WardActivityScreen;
