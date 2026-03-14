
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../theme';
import api from '../services/api';
import { Play, Trophy, Users } from 'lucide-react-native';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/questions/categories');
      setCategories(response.data);
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
          <Text style={styles.welcomeText}>Hello, Doctor!</Text>
          <Text style={styles.subtitle}>Ready for today's challenge?</Text>
        </View>
        <TouchableOpacity style={styles.trophyButton} onPress={() => navigation.navigate('Leaderboard')}>
           <Trophy color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainGrid}>
        <TouchableOpacity 
          style={[styles.modeCard, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Multiplayer')}
        >
           <Users color={COLORS.white} size={32} />
           <Text style={styles.modeText}>Multiplayer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modeCard, { backgroundColor: COLORS.secondary }]}>
           <Play color={COLORS.white} size={32} />
           <Text style={styles.modeText}>Daily Quiz</Text>
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
  subtitle: { fontSize: 14, color: COLORS.textMuted },
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
