
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { COLORS, SPACING } from '../theme';
import { Users, Plus, LogIn } from 'lucide-react-native';

const MultiplayerScreen = ({ navigation }) => {
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    // Navigate to Lobby with 'isCreator: true'
    navigation.navigate('Lobby', { isCreator: true });
  };

  const handleJoinRoom = () => {
    if (roomId.length !== 6) {
      Alert.alert('Invalid ID', 'Room ID must be 6 characters');
      return;
    }
    navigation.navigate('Lobby', { isCreator: false, roomId: roomId.toUpperCase() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Users color={COLORS.primary} size={64} style={{ marginBottom: SPACING.xl }} />
        <Text style={styles.title}>Play with Friends</Text>
        <Text style={styles.subtitle}>Challenge your colleagues in real-time</Text>

        <View style={styles.section}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
            <Plus color={COLORS.white} size={24} />
            <Text style={styles.createButtonText}>Create New Room</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.section}>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Room ID (e.g. AB1234)" 
            value={roomId}
            onChangeText={setRoomId}
            autoCapitalize="characters"
            maxLength={6}
          />
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinRoom}>
            <LogIn color={COLORS.white} size={20} />
            <Text style={styles.joinButtonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.xl, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: 40, textAlign: 'center' },
  section: { width: '100%', marginBottom: SPACING.xl },
  createButton: { 
    backgroundColor: COLORS.secondary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    padding: SPACING.lg, 
    borderRadius: 16 
  },
  createButtonText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  orText: { color: COLORS.textMuted, fontWeight: '600' },
  input: { 
    backgroundColor: COLORS.white, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 12, 
    padding: SPACING.md, 
    fontSize: 18, 
    textAlign: 'center', 
    fontWeight: '700',
    marginBottom: SPACING.md
  },
  joinButton: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    padding: SPACING.md, 
    borderRadius: 12 
  },
  joinButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' }
});

export default MultiplayerScreen;
