
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../theme';
import api from '../services/api';
import { Play, Trophy, Users, Bell, Hash } from 'lucide-react-native';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, userRes] = await Promise.all([
        api.get('/questions/categories'),
        api.get('/users/profile')
      ]);
      setCategories(catRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('Quiz', { categoryId: item.id, categoryName: item.name })}
    >
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryCount}>{item.questionCount} Questions</Text>
      </View>
      <Play color={COLORS.primary} size={24} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, {user?.name || 'Doctor'}!</Text>
          <View style={styles.badgeContainer}>
             <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lvl {user?.level || 1}</Text>
             </View>
             <Text style={styles.pointsText}>{user?.points || 0} pts</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
             <Bell color={COLORS.primary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.trophyButton} onPress={() => navigation.navigate('Leaderboard')}>
             <Trophy color={COLORS.white} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainGrid}>
        <TouchableOpacity 
          style={[styles.modeCard, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Multiplayer')}
        >
           <Users color={COLORS.white} size={32} />
           <Text style={styles.modeText}>Multiplayer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeCard, { backgroundColor: COLORS.accent }]}
          onPress={() => navigation.navigate('WardActivity')}
        >
           <Hash color={COLORS.white} size={32} />
           <Text style={styles.modeText}>Ward Activity</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Topic Categories</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    padding: SPACING.lg, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  welcomeText: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  levelBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  levelText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  pointsText: { fontSize: 14, color: COLORS.secondary, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 8, borderRadius: 12, backgroundColor: COLORS.background },
  trophyButton: { backgroundColor: COLORS.accent, padding: 10, borderRadius: 12 },
  mainGrid: { flexDirection: 'row', padding: SPACING.lg, gap: SPACING.md },
  modeCard: { flex: 1, padding: SPACING.lg, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modeText: { color: COLORS.white, fontWeight: '700', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginLeft: SPACING.lg, marginBottom: SPACING.md },
  listContainer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  categoryCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.white, 
    padding: SPACING.md, 
    borderRadius: 12, 
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  categoryName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  categoryCount: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 }
});

export default HomeScreen;
