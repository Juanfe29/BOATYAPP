import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Star, ChevronRight } from 'lucide-react-native';
import { renterTripHistory, renterUser } from '../../data/renterMockData';
import { C, card } from '../../constants/colors';

export default function MyTrips() {
  const [tab, setTab] = useState<'history' | 'upcoming'>('history');
  const completed = renterTripHistory.filter(t => t.status === 'completed');
  const totalSpent = completed.reduce((a, t) => a + t.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.title}>Mis Viajes</Text>
          <Text style={styles.sub}>{completed.length} viajes completados</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.navy }]}>{completed.length}</Text>
            <Text style={styles.statLabel}>Viajes</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.orange }]}>${totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total gastado</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.gold }]}>{renterUser.rating}</Text>
            <Text style={styles.statLabel}>Tu rating</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          {[{ id: 'history' as const, label: 'Historial' }, { id: 'upcoming' as const, label: 'Próximos' }].map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, tab === t.id && styles.tabActive]}
              onPress={() => setTab(t.id)}
            >
              <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'history' ? (
          <View>
            {renterTripHistory.map((trip, i) => (
              <TouchableOpacity
                key={trip.id}
                style={[styles.tripItem, i < renterTripHistory.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.divider }]}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.tripIcon,
                  trip.status === 'completed' ? styles.tripIconCompleted : styles.tripIconCancelled,
                ]}>
                  <Text style={{ fontSize: 20 }}>{trip.status === 'completed' ? '🛥️' : '❌'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tripBoat}>{trip.boat}</Text>
                  <Text style={styles.tripMeta}>{trip.captain} · {trip.duration}</Text>
                  {trip.rating && (
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                      {[...Array(5)].map((_, k) => (
                        <Star
                          key={k}
                          size={10}
                          color={C.gold}
                          fill={k < trip.rating ? C.gold : 'none'}
                        />
                      ))}
                    </View>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.tripAmount}>${trip.amount.toLocaleString()}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                </View>
                <ChevronRight size={16} color={C.muted} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={[card, styles.emptyCard]}>
            <Text style={{ fontSize: 40 }}>⚓</Text>
            <Text style={styles.emptyTitle}>Sin viajes próximos</Text>
            <Text style={styles.emptySub}>¡Explora y reserva tu próxima aventura!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '800', color: C.text },
  sub: { fontSize: 12, color: C.muted },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center', padding: 12 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: C.muted },
  tabBar: {
    flexDirection: 'row', gap: 4, padding: 4, borderRadius: 14, marginBottom: 16,
    backgroundColor: 'rgba(27,60,108,0.05)', borderWidth: 1, borderColor: C.border,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: {
    backgroundColor: C.navy,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  tabText: { fontSize: 13, fontWeight: '700', color: C.muted },
  tabTextActive: { color: '#fff' },
  tripItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14,
  },
  tripIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tripIconCompleted: { backgroundColor: C.navy },
  tripIconCancelled: { backgroundColor: 'rgba(239,68,68,0.08)' },
  tripBoat: { fontSize: 14, fontWeight: '700', color: C.text },
  tripMeta: { fontSize: 11, color: C.muted },
  tripAmount: { fontSize: 15, fontWeight: '800', color: C.text },
  tripDate: { fontSize: 10, color: C.muted },
  emptyCard: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginTop: 12 },
  emptySub: { fontSize: 12, color: C.muted, marginTop: 4 },
});
