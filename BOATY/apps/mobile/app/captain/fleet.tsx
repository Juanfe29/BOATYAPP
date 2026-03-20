import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView } from 'react-native';
import { Star, Users, MapPin, Wrench } from 'lucide-react-native';
import { fleet } from '../../data/mockData';
import { C, card } from '../../constants/colors';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Activo', color: C.success, bg: 'rgba(34,197,94,0.12)' },
  inactive: { label: 'Inactivo', color: C.danger, bg: 'rgba(220,38,38,0.12)' },
  maintenance: { label: 'Servicio', color: C.warning, bg: 'rgba(217,119,6,0.12)' },
};

export default function MyFleet() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(fleet.map(b => [b.id, b.status === 'active']))
  );

  const avgPrice = Math.round(fleet.reduce((a, b) => a + b.pricePerHour, 0) / fleet.length);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Mi Flota</Text>
            <Text style={styles.sub}>{fleet.length} embarcaciones</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={{ color: '#fff', fontSize: 22, lineHeight: 26 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.success }]}>{fleet.filter(b => b.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.warning }]}>{fleet.filter(b => b.status === 'maintenance').length}</Text>
            <Text style={styles.statLabel}>Servicio</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.orange }]}>${avgPrice}</Text>
            <Text style={styles.statLabel}>Avg $/hr</Text>
          </View>
        </View>

        {fleet.map(boat => {
          const st = statusConfig[boat.status];
          const isOn = toggles[boat.id];
          return (
            <View key={boat.id} style={[card, styles.boatCard]}>
              <View style={styles.boatHero}>
                <Text style={{ fontSize: 48 }}>{boat.image}</Text>
                <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                </View>
                <View style={styles.ratingPill}>
                  <Star size={11} color={C.gold} fill={C.gold} />
                  <Text style={styles.ratingText}>{boat.rating}</Text>
                </View>
              </View>

              <View style={styles.boatInfo}>
                <View style={styles.boatNameRow}>
                  <View>
                    <Text style={styles.boatName}>{boat.name}</Text>
                    <View style={styles.typePill}>
                      <Text style={styles.typeText}>{boat.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.price}>
                    ${boat.pricePerHour}<Text style={styles.priceSub}>/hr</Text>
                  </Text>
                </View>

                <View style={styles.boatMeta}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Users size={12} color={C.muted} />
                    <Text style={styles.metaText}>{boat.capacity}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color={C.muted} />
                    <Text style={styles.metaText}>{boat.location.label}</Text>
                  </View>
                </View>

                <View style={styles.boatFooter}>
                  <Text style={styles.trips}>{boat.totalTrips} viajes</Text>
                  {boat.status !== 'maintenance' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[styles.toggleLabel, { color: isOn ? C.success : C.muted }]}>
                        {isOn ? 'Activo' : 'Off'}
                      </Text>
                      <Switch
                        value={isOn}
                        onValueChange={() => setToggles(p => ({ ...p, [boat.id]: !p[boat.id] }))}
                        trackColor={{ false: C.border, true: 'rgba(34,197,94,0.4)' }}
                        thumbColor={isOn ? '#22c55e' : '#f4f3f4'}
                        style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                      />
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Wrench size={12} color={C.warning} />
                      <Text style={[styles.metaText, { color: C.warning }]}>En servicio</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: C.text },
  sub: { fontSize: 12, color: C.muted },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center', padding: 12 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: C.muted },
  boatCard: { padding: 0, overflow: 'hidden', marginBottom: 12 },
  boatHero: {
    height: 100, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.navy, position: 'relative',
  },
  statusPill: {
    position: 'absolute', top: 10, right: 10,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  ratingPill: {
    position: 'absolute', bottom: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  boatInfo: { padding: 14 },
  boatNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  boatName: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
  typePill: { backgroundColor: 'rgba(27,60,108,0.08)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  typeText: { fontSize: 10, color: C.navy, fontWeight: '600' },
  price: { fontSize: 18, fontWeight: '800', color: C.orange },
  priceSub: { fontSize: 11, fontWeight: '400', color: C.muted },
  boatMeta: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  metaText: { fontSize: 12, color: C.muted },
  boatFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: C.divider,
  },
  trips: { fontSize: 11, color: C.muted },
  toggleLabel: { fontSize: 11, fontWeight: '600' },
});
