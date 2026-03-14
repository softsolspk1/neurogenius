
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SPACING } from '../theme';
import io from 'socket.io-client';
import { User, Play, Copy } from 'lucide-react-native';

const LobbyScreen = ({ route, navigation }) => {
  const { isCreator, roomId: initialRoomId } = route.params;
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In emulator, use 10.0.2.2. In real device, use local IP.
    const newSocket = io('http://10.0.2.2:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      if (isCreator) {
        newSocket.emit('create_room', { userName: 'Dr. User', categoryId: 1 }); // Mocking name/cat
      } else {
        newSocket.emit('join_room', { roomId: initialRoomId, userName: 'Dr. Player' });
      }
    });

    newSocket.on('room_created', (roomData) => {
      setRoom(roomData);
      setLoading(false);
    });

    newSocket.on('room_updated', (roomData) => {
      setRoom(roomData);
    });

    newSocket.on('game_started', (roomData) => {
      navigation.replace('Quiz', { 
        categoryId: roomData.categoryId, 
        isMultiplayer: true, 
        roomId: roomData.id,
        socket: newSocket 
      });
    });

    newSocket.on('error', (err) => {
      Alert.alert('Error', err.message);
      navigation.goBack();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleStartGame = () => {
    if (room && room.players.length > 1) {
      socket.emit('start_game', { roomId: room.id });
    } else {
      Alert.alert('Waiting for Players', 'Invite at least one friend to start!');
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Waiting Lobby</Text>
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeLabel}>ROOM CODE</Text>
          <View style={styles.codeRow}>
            <Text style={styles.roomCode}>{room?.id}</Text>
            <TouchableOpacity><Copy color={COLORS.primary} size={20} /></TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.playersList}>
        <Text style={styles.sectionTitle}>Players Connected ({room?.players.length})</Text>
        <FlatList
          data={room?.players}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
               <View style={styles.avatar}>
                  <User color={COLORS.white} size={20} />
               </View>
               <Text style={styles.playerName}>{item.name}</Text>
               {item.id === room.creator && <Text style={styles.hostBadge}>HOST</Text>}
            </View>
          )}
        />
      </View>

      {isCreator && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Play color={COLORS.white} size={20} />
            <Text style={styles.startButtonText}>Start Challenge</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: SPACING.xl, alignItems: 'center', backgroundColor: COLORS.white, borderBottomRightRadius: 32, borderBottomLeftRadius: 32 },
  headerTitle: { fontSize: 18, color: COLORS.textMuted, fontWeight: '600', marginBottom: SPACING.md },
  roomCodeContainer: { alignItems: 'center' },
  roomCodeLabel: { fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roomCode: { fontSize: 48, fontWeight: '800', color: COLORS.primary },
  playersList: { flex: 1, padding: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  playerItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  playerName: { fontSize: 16, fontWeight: '600', color: COLORS.text, flex: 1 },
  hostBadge: { fontSize: 10, fontWeight: '700', color: COLORS.secondary, backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  footer: { padding: SPACING.xl, backgroundColor: COLORS.white },
  startButton: { backgroundColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: SPACING.lg, borderRadius: 16 },
  startButtonText: { color: COLORS.white, fontSize: 18, fontWeight: '700' }
});

export default LobbyScreen;
