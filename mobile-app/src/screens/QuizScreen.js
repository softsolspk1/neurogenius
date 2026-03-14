
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Animated } from 'react-native';
import { COLORS, SPACING } from '../theme';
import api from '../services/api';
import { X } from 'lucide-react-native';

const QuizScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleNext();
    }
  }, [timer]);

  const fetchQuestions = async () => {
    try {
      if (route.params.questions) {
        setQuestions(route.params.questions);
        startTimer();
      } else {
        const response = await api.get(`/questions/category/${categoryId}?limit=10`);
        setQuestions(response.data);
        startTimer();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load questions');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
  };

  const handleAnswer = (optionChar) => {
    const isCorrect = optionChar === questions[currentIndex].correct_answer;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Multiplayer sync
    if (route.params.isMultiplayer && route.params.socket) {
      route.params.socket.emit('submit_answer', { 
        roomId: route.params.roomId, 
        isCorrect 
      });
    }

    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      startTimer();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    clearInterval(timerRef.current);
    
    if (route.params.isMultiplayer && route.params.socket) {
       // Potentially wait for all players or show final rank
    }

    navigation.replace('Result', {
      score,
      correctAnswers,
      totalQuestions: questions.length,
      categoryId,
      sessionId: route.params.sessionId,
      gameMode: route.params.isWardActivity ? 'ward' : (route.params.isMultiplayer ? 'multi' : 'single')
    });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><X color={COLORS.text} size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <View style={styles.timerContainer}>
           <Text style={styles.timerText}>{timer}s</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionNumber}>Question {currentIndex + 1} of {questions.length}</Text>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const char = String.fromCharCode(65 + index);
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.optionButton}
                onPress={() => handleAnswer(char)}
              >
                <Text style={styles.optionChar}>{char}</Text>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  timerContainer: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  timerText: { color: COLORS.white, fontWeight: '700' },
  progressContainer: { height: 4, backgroundColor: COLORS.border, width: '100%' },
  progressBar: { height: '100%', backgroundColor: COLORS.secondary },
  content: { padding: SPACING.lg },
  questionNumber: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginBottom: SPACING.sm },
  questionText: { fontSize: 20, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xl, lineHeight: 28 },
  optionsContainer: { gap: SPACING.md },
  optionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: SPACING.md, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  optionChar: { width: 32, height: 32, backgroundColor: COLORS.background, borderRadius: 16, textAlign: 'center', textAlignVertical: 'center', fontWeight: '700', marginRight: SPACING.md, color: COLORS.primary },
  optionText: { flex: 1, fontSize: 16, color: COLORS.text }
});

export default QuizScreen;
