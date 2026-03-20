import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Phone, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { activeTrip } from '../../data/mockData';
import { C, card } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function ActiveTrip() {
  const [elapsed, setElapsed] = useState(
    Math.floor((Date.now() - activeTrip.startTime.getTime()) / 1000)
  );

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

  const etaMin = Math.max(0, Math.floor((activeTrip.estimatedArrival.getTime() - Date.now()) / 60000));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapArea}>
          {activeTrip.route.map((_, i) => (
            <View
              key={i}
              style={[
                styles.routeDot,
                {
                  left: `${15 + i * 22}%` as any,
                  top: `${25 + i * 12 + (i % 2 === 0 ? 8 : 0)}%` as any,
                  width: i === 0 || i === activeTrip.route.length - 1 ? 12 : 6,
                  height: i === 0 || i === activeTrip.route.length - 1 ? 12 : 6,
                  backgroundColor: i === 0 ? '#22c55e' : i === activeTrip.route.length - 1 ? C.orange : 'rgba(255,255,255,0.2)',
                },
              ]}
            />
          ))}

          <View style={styles.statusPill}>
            <View style={styles.liveDot} />
            <Text style={styles.statusText}>Navegando</Text>
          </View>

          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{fmt(elapsed)}</Text>
          </View>

          <View style={styles.etaPill}>
            <Text style={styles.etaText}>ETA: {etaMin} min</Text>
          </View>

          <View style={styles.anchorCenter}>
            <Text style={{ fontSize: 40, opacity: 0.15 }}>⚓</Text>
          </View>
        </View>

        <View style={[card, styles.passengerCard]}>
          <View style={styles.passengerAvatar}>
            <Text style={{ fontSize: 22 }}>{activeTrip.passenger.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.passengerName}>{activeTrip.passenger.name}</Text>
            <Text style={styles.rating}>⭐ {activeTrip.passenger.rating}</Text>
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

        <View style={[card, styles.routeCard]}>
          <View style={styles.routePoints}>
            <View style={styles.routeDotsCol}>
              <View style={styles.dotGreen} />
              <View style={styles.routeLine} />
              <View style={styles.dotOrange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeText}>{activeTrip.pickup}</Text>
              <Text style={[styles.routeText, { marginTop: 8 }]}>{activeTrip.destination}</Text>
            </View>
          </View>
          <View style={styles.routeMeta}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Distancia</Text>
              <Text style={styles.metaValue}>{activeTrip.distance}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Embarcación</Text>
              <Text style={styles.metaValue}>{activeTrip.boat}</Text>
            </View>
          </View>
        </View>

        <View style={[card, styles.fareCard]}>
          <View>
            <Text style={styles.fareLabel}>Tarifa del viaje</Text>
            <Text style={styles.fareAmount}>${activeTrip.fare.toLocaleString()}</Text>
          </View>
          <View style={styles.inProgressBadge}>
            <Text style={styles.inProgressText}>En curso</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.dangerBtn}>
            <AlertTriangle size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.successBtn}>
            <CheckCircle2 size={20} color="#fff" />
            <Text style={styles.successBtnText}>Completar Viaje</Text>
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
  mapArea: {
    height: 240,
    borderRadius: 20,
    backgroundColor: '#0d2137',
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDot: {
    position: 'absolute',
    borderRadius: 6,
    zIndex: 10,
  },
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
  anchorCenter: { position: 'absolute', zIndex: 5, alignItems: 'center', justifyContent: 'center' },
  passengerCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  passengerAvatar: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
  },
  passengerName: { fontSize: 15, fontWeight: '700', color: C.text },
  rating: { fontSize: 12, color: C.muted },
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
  fareCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  fareLabel: { fontSize: 11, color: C.muted },
  fareAmount: { fontSize: 28, fontWeight: '800', color: C.text },
  inProgressBadge: {
    backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5,
  },
  inProgressText: { fontSize: 12, fontWeight: '700', color: C.success },
  actionsRow: { flexDirection: 'row', gap: 10 },
  dangerBtn: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  successBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14, backgroundColor: C.success,
    shadowColor: C.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  successBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
