
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING } from '../theme';
import { Trophy, Home, Share2, RefreshCcw } from 'lucide-react-native';
import axios from 'axios';

const ResultScreen = ({ route, navigation }) => {
  const { score, correctAnswers, totalQuestions, categoryId } = route.params;

  useEffect(() => {
    submitResult();
  }, []);

  const submitResult = async () => {
    try {
      // In a real app, you'd get the auth token from storage
      await axios.post('http://10.0.2.2:3001/api/quiz/submit', {
        category_id: categoryId,
        score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        game_mode: 'single'
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.trophyContainer}>
           <Trophy color={COLORS.white} size={64} />
        </View>
        
        <Text style={styles.congratsText}>Quiz Completed!</Text>
        <Text style={styles.subtitle}>You've done a great job</Text>

        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
             <Text style={styles.scoreLabel}>Score</Text>
             <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={[styles.scoreItem, { borderLeftWidth: 1, borderLeftColor: COLORS.border }]}>
             <Text style={styles.scoreLabel}>Correct</Text>
             <Text style={styles.scoreValue}>{correctAnswers}/{totalQuestions}</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Home')}>
            <Home color={COLORS.white} size={20} />
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryGroup}>
            <TouchableOpacity style={styles.secondaryButton}>
               <RefreshCcw color={COLORS.primary} size={20} />
               <Text style={styles.secondaryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
               <Share2 color={COLORS.primary} size={20} />
               <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  content: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    marginTop: 100, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    padding: SPACING.xl,
    alignItems: 'center'
  },
  trophyContainer: { 
    width: 120, 
    height: 120, 
    backgroundColor: COLORS.primary, 
    borderRadius: 60, 
    marginTop: -60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: COLORS.background
  },
  congratsText: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginTop: SPACING.lg },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: SPACING.xl },
  scoreBoard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: SPACING.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: SPACING.xl
  },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreLabel: { fontSize: 14, color: COLORS.textMuted, marginBottom: 4 },
  scoreValue: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  buttonGroup: { width: '100%', gap: SPACING.md },
  primaryButton: { 
    backgroundColor: COLORS.primary, 
    padding: SPACING.md, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8
  },
  primaryButtonText: { color: COLORS.white, fontSize: 18, fontWeight: '600' },
  secondaryGroup: { flexDirection: 'row', gap: SPACING.md },
  secondaryButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12
  },
  secondaryButtonText: { color: COLORS.primary, fontWeight: '600' }
});

export default ResultScreen;
