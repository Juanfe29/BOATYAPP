import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { earningsData } from '../../data/mockData';
import { C, card } from '../../constants/colors';

type Period = 'today' | 'week' | 'month';
const periods: Period[] = ['today', 'week', 'month'];
const periodLabels: Record<Period, string> = { today: 'Hoy', week: 'Semana', month: 'Mes' };

export default function Earnings() {
  const [period, setPeriod] = useState<Period>('week');
  const data = earningsData[period];
  const chart = earningsData.chartData[period];
  const maxVal = Math.max(...chart.map(d => d.value), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ganancias</Text>

        <View style={styles.pillBar}>
          {periods.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.pill, period === p && styles.pillActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.pillText, period === p && styles.pillTextActive]}>
                {periodLabels[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[card, styles.mainCard]}>
          <Text style={styles.mainLabel}>Ganancias totales</Text>
          <Text style={styles.mainAmount}>${data.total.toLocaleString()}</Text>
          <View style={styles.statsRow}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.statNum}>{data.trips}</Text>
              <Text style={styles.statLabel}>Viajes</Text>
            </View>
            <View style={styles.divider} />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.statNum}>{data.hours}h</Text>
              <Text style={styles.statLabel}>Horas</Text>
            </View>
            <View style={styles.divider} />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.statNum}>${data.tips}</Text>
              <Text style={styles.statLabel}>Propinas</Text>
            </View>
          </View>
        </View>

        <View style={[card, styles.chartCard]}>
          <Text style={styles.chartTitle}>{periodLabels[period]}</Text>
          <View style={styles.chart}>
            {chart.map((d, i) => {
              const heightPct = maxVal > 0 ? Math.max((d.value / maxVal) * 100, 3) : 3;
              return (
                <View key={i} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height: `${heightPct}%` as any }]} />
                  </View>
                  <Text style={styles.barLabel}>{d.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Historial</Text>
        {earningsData.tripHistory.slice(0, 5).map((trip, i) => (
          <View
            key={trip.id}
            style={[styles.historyItem, i < 4 && { borderBottomWidth: 1, borderBottomColor: C.divider }]}
          >
            <View style={[styles.historyIcon, {
              backgroundColor: trip.status === 'completed' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            }]}>
              <Text style={{ fontSize: 14 }}>{trip.status === 'completed' ? '✅' : '❌'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyPassenger}>{trip.passenger}</Text>
              <Text style={styles.historyMeta}>{trip.boat} · {trip.duration}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.historyAmount}>${trip.amount.toLocaleString()}</Text>
              <Text style={styles.historyDate}>{trip.date}</Text>
            </View>
          </View>
        ))}

        <View style={styles.payoutCard}>
          <View style={styles.payoutHeader}>
            <View>
              <Text style={styles.payoutLabel}>Próximo pago</Text>
              <Text style={styles.payoutAmount}>${data.total.toLocaleString()}</Text>
            </View>
            <View style={styles.cardBadge}>
              <CreditCard size={14} color="#fff" />
              <Text style={styles.cardBadgeText}>•••• 4242</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.payoutBtn}>
            <Text style={styles.payoutBtnText}>Solicitar Pago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '800', color: C.text, marginBottom: 16 },
  pillBar: {
    flexDirection: 'row', gap: 4, padding: 4, borderRadius: 14, marginBottom: 16,
    backgroundColor: 'rgba(27,60,108,0.05)', borderWidth: 1, borderColor: C.border,
  },
  pill: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
  },
  pillActive: {
    backgroundColor: C.orange,
    shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  pillText: { fontSize: 13, fontWeight: '700', color: C.muted },
  pillTextActive: { color: '#fff' },
  mainCard: { alignItems: 'center', padding: 24, marginBottom: 12 },
  mainLabel: { fontSize: 12, color: C.muted },
  mainAmount: { fontSize: 42, fontWeight: '900', color: C.orange, letterSpacing: -1, marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14 },
  statNum: { fontSize: 18, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 10, color: C.muted },
  divider: { width: 1, height: 30, backgroundColor: C.border },
  chartCard: { padding: 16, marginBottom: 16 },
  chartTitle: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 16 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barContainer: { flex: 1, justifyContent: 'flex-end', width: '100%' },
  bar: {
    width: '100%', borderRadius: 4,
    backgroundColor: C.orange,
    minHeight: 3,
  },
  barLabel: { fontSize: 10, color: C.muted, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  historyIcon: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  historyPassenger: { fontSize: 13, fontWeight: '600', color: C.text },
  historyMeta: { fontSize: 11, color: C.muted },
  historyAmount: { fontSize: 15, fontWeight: '800', color: C.text },
  historyDate: { fontSize: 10, color: C.muted },
  payoutCard: {
    borderRadius: 16, padding: 18, marginTop: 16,
    backgroundColor: C.navy, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  payoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  payoutLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  payoutAmount: { fontSize: 24, fontWeight: '800', color: '#fff' },
  cardBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  cardBadgeText: { fontSize: 11, fontWeight: '500', color: '#fff' },
  payoutBtn: {
    backgroundColor: C.orange, borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  payoutBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
