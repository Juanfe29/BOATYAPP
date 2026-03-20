import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Phone, MessageSquare, Star } from 'lucide-react-native';
import { renterActiveTrip } from '../../data/renterMockData';
import { C, card } from '../../constants/colors';

export default function RenterActiveTrip() {
  const trip = renterActiveTrip;
  const [elapsed, setElapsed] = useState(
    Math.floor((Date.now() - trip.startTime.getTime()) / 1000)
  );
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const etaMin = Math.max(0, Math.floor((trip.estimatedArrival.getTime() - Date.now()) / 60000));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapArea}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.routeDot,
                {
                  left: `${15 + i * 22}%` as any,
                  top: `${30 + i * 10 + (i % 2 === 0 ? 5 : 0)}%` as any,
                  width: i === 0 || i === 3 ? 12 : 6,
                  height: i === 0 || i === 3 ? 12 : 6,
                  backgroundColor: i === 0 ? '#22c55e' : i === 3 ? C.orange : 'rgba(255,255,255,0.25)',
                },
              ]}
            />
          ))}

          <View style={styles.statusPill}>
            <View style={styles.liveDot} />
            <Text style={styles.statusText}>En ruta</Text>
          </View>

          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{fmt(elapsed)}</Text>
          </View>

          <View style={styles.etaPill}>
            <Text style={styles.etaText}>ETA: {etaMin} min</Text>
          </View>

          <View style={styles.anchorDecor}>
            <Text style={{ fontSize: 40, opacity: 0.12 }}>⚓</Text>
          </View>
        </View>

        <View style={[card, styles.boatCard]}>
          <View style={styles.boatRow}>
            <View style={styles.boatIconBox}>
              <Text style={{ fontSize: 26 }}>{trip.boat.image}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.boatName}>{trip.boat.name}</Text>
              <Text style={styles.captainText}>
                Capitán {trip.boat.captain.name} · ⭐ {trip.boat.captain.rating}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.ghostBtn}>
                <Phone size={16} color={C.navy} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ghostBtn}>
                <MessageSquare size={16} color={C.navy} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[card, styles.routeCard]}>
          <View style={styles.routePoints}>
            <View style={styles.routeDotsCol}>
              <View style={styles.dotGreen} />
              <View style={styles.routeLine} />
              <View style={styles.dotOrange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeText}>{trip.pickup}</Text>
              <Text style={[styles.routeText, { marginTop: 8 }]}>{trip.destination}</Text>
            </View>
          </View>
          <View style={styles.routeMeta}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Distancia</Text>
              <Text style={styles.metaValue}>{trip.distance}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>ETA</Text>
              <Text style={styles.metaValue}>{etaMin} min</Text>
            </View>
          </View>
        </View>

        <View style={[card, styles.fareCard]}>
          <View>
            <Text style={styles.fareLabel}>Tarifa del viaje</Text>
            <Text style={styles.fareAmount}>${trip.fare.toLocaleString()}</Text>
          </View>
          <View style={styles.inProgressBadge}>
            <Text style={styles.inProgressText}>En curso</Text>
          </View>
        </View>

        <View style={[card, styles.ratingCard]}>
          <Text style={styles.ratingTitle}>¿Cómo va el viaje?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Star
                  size={28}
                  color={C.gold}
                  fill={n <= rating ? C.gold : 'none'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  mapArea: {
    height: 240, borderRadius: 20, backgroundColor: '#0d2137',
    overflow: 'hidden', marginBottom: 16, position: 'relative',
    alignItems: 'center', justifyContent: 'center',
  },
  routeDot: { position: 'absolute', borderRadius: 6, zIndex: 10 },
  statusPill: {
    position: 'absolute', top: 12, left: 12, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  timerPill: {
    position: 'absolute', top: 12, right: 12, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  timerText: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  etaPill: {
    position: 'absolute', bottom: 12, alignSelf: 'center', zIndex: 10,
    backgroundColor: C.orange, borderRadius: 100,
    paddingHorizontal: 20, paddingVertical: 8,
    shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  etaText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  anchorDecor: { position: 'absolute', zIndex: 5 },
  boatCard: { marginBottom: 12 },
  boatRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  boatIconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
  },
  boatName: { fontSize: 15, fontWeight: '700', color: C.text },
  captainText: { fontSize: 12, color: C.muted },
  actions: { flexDirection: 'row', gap: 8 },
  ghostBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(27,60,108,0.07)', alignItems: 'center', justifyContent: 'center',
  },
  routeCard: { marginBottom: 12 },
  routePoints: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  routeDotsCol: { alignItems: 'center', gap: 2, paddingTop: 3 },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  dotOrange: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange },
  routeLine: { width: 1.5, height: 22, backgroundColor: 'rgba(27,60,108,0.12)' },
  routeText: { fontSize: 13, fontWeight: '600', color: C.text },
  routeMeta: { flexDirection: 'row', gap: 10 },
  metaBox: {
    flex: 1, padding: 10, borderRadius: 10,
    backgroundColor: 'rgba(27,60,108,0.04)', alignItems: 'center',
  },
  metaLabel: { fontSize: 10, color: C.muted },
  metaValue: { fontSize: 15, fontWeight: '700', color: C.text },
  fareCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  fareLabel: { fontSize: 11, color: C.muted },
  fareAmount: { fontSize: 28, fontWeight: '800', color: C.text },
  inProgressBadge: {
    backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5,
  },
  inProgressText: { fontSize: 12, fontWeight: '700', color: C.success },
  ratingCard: { padding: 20, alignItems: 'center' },
  ratingTitle: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 12 },
  starsRow: { flexDirection: 'row', gap: 8 },
});
