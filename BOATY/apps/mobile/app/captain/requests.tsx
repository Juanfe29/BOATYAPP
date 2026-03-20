import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Users, Clock, Star, Check, X } from 'lucide-react-native';
import { tripRequests } from '../../data/mockData';
import { C, card } from '../../constants/colors';

type Request = typeof tripRequests[0];

function RequestCard({ request, onDecline }: { request: Request; onDecline: (id: string) => void }) {
  const [timeLeft, setTimeLeft] = useState(request.expiresIn);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  useEffect(() => {
    if (status !== 'pending') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); setStatus('declined'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const pct = (timeLeft / request.expiresIn) * 100;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (status === 'accepted') {
    return (
      <View style={[card, styles.acceptedCard]}>
        <View style={styles.acceptedIcon}>
          <Check size={22} color={C.success} />
        </View>
        <Text style={styles.acceptedTitle}>¡Viaje Aceptado!</Text>
        <Text style={styles.acceptedSub}>Contacta a {request.passenger.name}</Text>
      </View>
    );
  }

  if (status === 'declined') return null;

  return (
    <View style={[card, { padding: 0, overflow: 'hidden' }]}>
      <View style={styles.timerBarBg}>
        <View style={[styles.timerBar, {
          width: `${pct}%`,
          backgroundColor: pct > 30 ? C.orange : C.danger,
        }]} />
      </View>

      <View style={{ padding: 16 }}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.passengerAvatar}>
              <Text style={{ fontSize: 18 }}>{request.passenger.avatar}</Text>
            </View>
            <View>
              <Text style={styles.passengerName}>{request.passenger.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={10} color={C.gold} fill={C.gold} />
                <Text style={styles.passengerMeta}>
                  {request.passenger.rating} · {request.passenger.trips} viajes
                </Text>
              </View>
            </View>
          </View>
          <Text style={[styles.timer, { color: pct > 30 ? C.orange : C.danger }]}>
            {fmt(timeLeft)}
          </Text>
        </View>

        <View style={styles.routeBox}>
          <View style={styles.routeDots}>
            <View style={styles.dotGreen} />
            <View style={styles.routeLine} />
            <View style={styles.dotOrange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeText}>{request.pickup}</Text>
            <Text style={[styles.routeText, { marginTop: 6 }]}>{request.destination}</Text>
          </View>
        </View>

        <View style={styles.tags}>
          <View style={styles.tag}>
            <Clock size={10} color={C.navy} />
            <Text style={styles.tagText}>{request.estimatedDuration}</Text>
          </View>
          <View style={styles.tag}>
            <Users size={10} color={C.navy} />
            <Text style={styles.tagText}>{request.passengers}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: 'rgba(242,106,49,0.1)' }]}>
            <Text style={[styles.tagText, { color: C.orange }]}>🛥️ {request.boat}</Text>
          </View>
        </View>

        <View style={styles.fareRow}>
          <View>
            <Text style={styles.fareLabel}>Tarifa</Text>
            <Text style={styles.fareAmount}>${request.estimatedFare.toLocaleString()}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnDecline}
              onPress={() => { setStatus('declined'); onDecline(request.id); }}
            >
              <X size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAccept}
              onPress={() => setStatus('accepted')}
            >
              <Check size={16} color="#fff" />
              <Text style={styles.acceptText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TripRequests() {
  const [requests, setRequests] = useState(tripRequests);
  const potential = requests.reduce((a, r) => a + r.estimatedFare, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.title}>Solicitudes</Text>
          <Text style={styles.sub}>{requests.length} pendientes</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.success }]}>92%</Text>
            <Text style={styles.statLabel}>Aceptación</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.orange }]}>${potential.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Potencial</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          {requests.map(r => (
            <RequestCard
              key={r.id}
              request={r}
              onDecline={(id) => setRequests(prev => prev.filter(x => x.id !== id))}
            />
          ))}
        </View>

        {requests.length === 0 && (
          <View style={[card, styles.emptyCard]}>
            <Text style={{ fontSize: 40 }}>🌊</Text>
            <Text style={styles.emptyTitle}>Sin solicitudes</Text>
            <Text style={styles.emptySub}>Aparecerán aquí en tiempo real</Text>
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
  acceptedCard: { alignItems: 'center', padding: 20, borderColor: 'rgba(34,197,94,0.2)' },
  acceptedIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  acceptedTitle: { fontSize: 14, fontWeight: '700', color: C.success },
  acceptedSub: { fontSize: 11, color: C.muted, marginTop: 4 },
  timerBarBg: { height: 3, backgroundColor: 'rgba(27,60,108,0.06)' },
  timerBar: { height: '100%', borderRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  passengerAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
  },
  passengerName: { fontSize: 14, fontWeight: '700', color: C.text },
  passengerMeta: { fontSize: 11, color: C.muted },
  timer: { fontSize: 18, fontWeight: '800' },
  routeBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 12, borderRadius: 12, backgroundColor: 'rgba(27,60,108,0.03)',
    borderWidth: 1, borderColor: C.divider, marginBottom: 12,
  },
  routeDots: { alignItems: 'center', gap: 2, paddingTop: 3 },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  dotOrange: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange },
  routeLine: { width: 1.5, height: 18, backgroundColor: 'rgba(27,60,108,0.12)' },
  routeText: { fontSize: 12, fontWeight: '600', color: C.text },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(27,60,108,0.07)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  tagText: { fontSize: 10, fontWeight: '600', color: C.navy },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { fontSize: 10, color: C.muted },
  fareAmount: { fontSize: 22, fontWeight: '800', color: C.text },
  actions: { flexDirection: 'row', gap: 8 },
  btnDecline: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center',
  },
  btnAccept: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
    backgroundColor: C.success,
  },
  acceptText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  emptyCard: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginTop: 12 },
  emptySub: { fontSize: 12, color: C.muted, marginTop: 4 },
});
