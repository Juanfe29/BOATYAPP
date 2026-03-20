import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Star, Shield, CreditCard, Bell, ChevronRight, LogOut } from 'lucide-react-native';
import { renterUser, renterTripHistory } from '../../data/renterMockData';
import { C, card } from '../../constants/colors';

const menuItems = [
  { Icon: CreditCard, label: 'Métodos de pago', sub: 'Visa •••• 4242' },
  { Icon: Bell, label: 'Notificaciones', sub: 'Activadas' },
  { Icon: Shield, label: 'Seguridad', sub: 'Verificado ✓' },
];

export default function RenterProfile() {
  const completed = renterTripHistory.filter(t => t.status === 'completed');
  const totalSpent = completed.reduce((a, t) => a + t.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarBox}>
            <Text style={{ fontSize: 38 }}>{renterUser.avatar}</Text>
          </View>
          <Text style={styles.name}>{renterUser.name}</Text>
          <Text style={styles.memberSince}>Miembro desde {renterUser.memberSince}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color={C.gold} fill={C.gold} />
            <Text style={styles.ratingNum}>{renterUser.rating}</Text>
            <Text style={styles.ratingLabel}>rating de usuario</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.navy }]}>{renterUser.totalTrips}</Text>
            <Text style={styles.statLabel}>Viajes</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.orange }]}>${totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Gastado</Text>
          </View>
          <View style={[card, styles.stat]}>
            <Text style={[styles.statNum, { color: C.success }]}>✓</Text>
            <Text style={styles.statLabel}>Verificado</Text>
          </View>
        </View>

        <View style={[card, styles.menuCard]}>
          {menuItems.map(({ Icon, label, sub }, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.divider }]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Icon size={16} color={C.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{label}</Text>
                <Text style={styles.menuSub}>{sub}</Text>
              </View>
              <ChevronRight size={16} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <LogOut size={16} color={C.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6,
  },
  name: { fontSize: 22, fontWeight: '800', color: C.text },
  memberSince: { fontSize: 12, color: C.muted, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ratingNum: { fontSize: 16, fontWeight: '800', color: C.text },
  ratingLabel: { fontSize: 12, color: C.muted },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  stat: { flex: 1, alignItems: 'center', padding: 14 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: C.muted },
  menuCard: { padding: 0, overflow: 'hidden', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(27,60,108,0.07)', alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { fontSize: 14, fontWeight: '600', color: C.text },
  menuSub: { fontSize: 11, color: C.muted },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 14, borderRadius: 14, backgroundColor: 'rgba(239,68,68,0.06)',
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: C.danger },
});
