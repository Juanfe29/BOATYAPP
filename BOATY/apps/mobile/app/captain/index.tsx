import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { captain, earningsData, activeTrip, fleet, recentActivity } from '../../data/mockData';
import { C, card } from '../../constants/colors';

export default function Dashboard() {
  const today = earningsData.today;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcome}>Bienvenido de vuelta</Text>
            <Text style={styles.name}>{captain.name.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 22 }}>{captain.avatar}</Text>
          </View>
        </View>


        <View style={styles.kpiRow}>
          <View style={[card, styles.kpiMain]}>
            <Text style={styles.kpiLabel}>Hoy</Text>
            <Text style={styles.kpiBig}>${today.total.toLocaleString()}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+12%</Text>
            </View>
          </View>
          <View style={styles.kpiCol}>
            <View style={[card, styles.kpiSmall]}>
              <Text style={{ fontSize: 20 }}>🚢</Text>
              <View>
                <Text style={styles.kpiNum}>{today.trips}</Text>
                <Text style={styles.kpiSub}>Viajes</Text>
              </View>
            </View>
            <View style={[card, styles.kpiSmall]}>
              <Text style={{ fontSize: 20 }}>⏱️</Text>
              <View>
                <Text style={styles.kpiNum}>{today.hours}h</Text>
                <Text style={styles.kpiSub}>En línea</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.tripBanner} activeOpacity={0.8}>
          <View style={styles.tripBannerHeader}>
            <View style={styles.tripLiveRow}>
              <View style={styles.greenDot} />
              <Text style={styles.liveLabel}>VIAJE EN CURSO</Text>
            </View>
            <ChevronRight size={18} color={C.muted} />
          </View>
          <View style={styles.tripRow}>
            <View style={styles.passengerIcon}>
              <Text style={{ fontSize: 20 }}>{activeTrip.passenger.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.passengerName}>{activeTrip.passenger.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} color={C.muted} />
                <Text style={styles.destination}>{activeTrip.destination}</Text>
              </View>
            </View>
            <Text style={styles.fare}>${activeTrip.fare}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mi Flota</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.seeAll}>Ver todo</Text>
            <ChevronRight size={14} color={C.orange} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {fleet.slice(0, 3).map(boat => (
            <View key={boat.id} style={[card, styles.fleetCard]}>
              <Text style={{ fontSize: 32, marginBottom: 6 }}>{boat.image}</Text>
              <Text style={styles.fleetName}>{boat.name}</Text>
              <View style={[
                styles.statusBadge,
                boat.status === 'active' ? styles.badgeSuccess :
                boat.status === 'maintenance' ? styles.badgeWarning : styles.badgeDanger
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: boat.status === 'active' ? C.success : boat.status === 'maintenance' ? C.warning : C.danger }
                ]}>
                  {boat.status === 'active' ? 'Activo' : boat.status === 'maintenance' ? 'Servicio' : 'Inactivo'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Actividad</Text>
        {recentActivity.slice(0, 4).map((a, i) => (
          <View key={a.id} style={[styles.activityItem, i < 3 && styles.activityDivider]}>
            <Text style={{ fontSize: 18 }}>{a.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityMsg}>{a.message}</Text>
              <Text style={styles.activityTime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcome: { fontSize: 13, color: C.muted, fontWeight: '500' },
  name: { fontSize: 26, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  avatar: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
  },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  kpiMain: { flex: 1.3, alignItems: 'center', justifyContent: 'center', padding: 14 },
  kpiLabel: { fontSize: 11, color: C.muted, marginBottom: 4 },
  kpiBig: { fontSize: 28, fontWeight: '800', color: C.orange },
  badge: { backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
  badgeText: { fontSize: 10, color: C.success, fontWeight: '700' },
  kpiCol: { flex: 1, gap: 10 },
  kpiSmall: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, flex: 1 },
  kpiNum: { fontSize: 20, fontWeight: '800', color: C.text },
  kpiSub: { fontSize: 10, color: C.muted },
  tripBanner: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(242,106,49,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(242,106,49,0.18)',
  },
  tripBannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tripLiveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  liveLabel: { fontSize: 11, fontWeight: '700', color: C.success, letterSpacing: 0.5 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  passengerIcon: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: 'rgba(27,60,108,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  passengerName: { fontSize: 14, fontWeight: '700', color: C.text },
  destination: { fontSize: 12, color: C.muted },
  fare: { fontSize: 18, fontWeight: '800', color: C.orange },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  seeAll: { fontSize: 12, fontWeight: '600', color: C.orange },
  fleetCard: { minWidth: 130, padding: 14, alignItems: 'center', marginRight: 10 },
  fleetName: { fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center', marginBottom: 6 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeSuccess: { backgroundColor: 'rgba(34,197,94,0.12)' },
  badgeWarning: { backgroundColor: 'rgba(217,119,6,0.12)' },
  badgeDanger: { backgroundColor: 'rgba(220,38,38,0.12)' },
  statusText: { fontSize: 10, fontWeight: '700' },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  activityMsg: { fontSize: 13, fontWeight: '500', color: C.text },
  activityTime: { fontSize: 11, color: C.muted, marginTop: 2 },
});
