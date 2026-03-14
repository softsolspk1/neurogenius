
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../theme';
import { Bell, Info, AlertTriangle } from 'lucide-react-native';
import api from '../services/api';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const Icon = item.type === 'alert' ? AlertTriangle : Info;
    const iconColor = item.type === 'alert' ? COLORS.error : COLORS.primary;

    return (
      <View style={styles.notificationCard}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Icon color={iconColor} size={24} />
        </View>
        <div style={styles.textContainer}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifMessage}>{item.message}</Text>
          <Text style={styles.notifTime}>{new Date(item.sent_at).toLocaleDateString()}</Text>
        </div>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Bell color={COLORS.primary} size={32} />
        <Text style={styles.title}>Notifications</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notifications yet</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  list: { padding: SPACING.md },
  notificationCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: SPACING.md, 
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: SPACING.md
  },
  textContainer: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  notifMessage: { fontSize: 14, color: COLORS.textMuted, marginBottom: 8 },
  notifTime: { fontSize: 12, color: COLORS.textMuted },
  emptyText: { textAlign: 'center', marginTop: 100, color: COLORS.textMuted, fontSize: 16 }
});

export default NotificationsScreen;
