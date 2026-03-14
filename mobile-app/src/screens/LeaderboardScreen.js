
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { COLORS, SPACING } from '../theme';
import api from '../services/api';
import { Trophy, Medal } from 'lucide-react-native';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.rankItem}>
      <View style={styles.rankLeft}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userSub}>{item.specialty} • {item.hospital}</Text>
        </View>
      </View>
      <View style={styles.rankRight}>
        <Text style={styles.scoreText}>{item.points}</Text>
        <Text style={styles.ptsLabel}>pts</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Trophy color={COLORS.white} size={32} />
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Top Neuro Geniuses</Text>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={leaderboard}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: SPACING.xl }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: { padding: SPACING.xl, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.white, marginTop: 8 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  listContainer: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32,
    padding: SPACING.md
  },
  rankItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: SPACING.md, 
    borderRadius: 16, 
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  rankLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rankNumber: { fontSize: 18, fontWeight: '800', color: COLORS.primary, width: 30 },
  userInfo: { marginLeft: 8 },
  userName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  userSub: { fontSize: 12, color: COLORS.textMuted },
  rankRight: { alignItems: 'flex-end' },
  scoreText: { fontSize: 18, fontWeight: '800', color: COLORS.secondary },
  ptsLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700' }
});

export default LeaderboardScreen;
