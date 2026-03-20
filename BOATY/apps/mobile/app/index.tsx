import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { C } from '../constants/colors';
import SplashScreen from '../components/SplashScreen';
import BoatyLogo from '../components/BoatyLogo';

export default function Root() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BoatyLogo size={0.85} color={C.navyDark} underlineColor={C.orange} />
          <Text style={styles.tagline}>Tu plataforma náutica · Cartagena, Colombia</Text>
        </View>

        {/* Role cards */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: C.navyDark }]}
            onPress={() => router.push('/renter')}
            activeOpacity={0.88}
          >
            <Text style={styles.emoji}>🌊</Text>
            <Text style={styles.cardTitle}>Soy Usuario</Text>
            <Text style={styles.cardSub}>Explora y reserva botes cerca de ti</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Explorar →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: C.navy }]}
            onPress={() => router.push('/captain')}
            activeOpacity={0.88}
          >
            <Text style={styles.emoji}>🛥️</Text>
            <Text style={styles.cardTitle}>Soy Capitán</Text>
            <Text style={styles.cardSub}>Gestiona tu flota y recibe viajes</Text>
            <View style={[styles.pill, { backgroundColor: C.orange }]}>
              <Text style={styles.pillText}>Mi Flota →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Splash overlay — rendered on top, disappears after animation */}
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.cream },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header:    { alignItems: 'center', marginBottom: 44 },
  tagline:   { fontSize: 12, color: C.muted, marginTop: 10, letterSpacing: 0.5 },
  cards:     { gap: 16 },
  card: {
    borderRadius: 24,
    padding: 28,
    shadowColor: '#0c2545',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  emoji:     { fontSize: 36, marginBottom: 12 },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 },
  cardSub:   { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 18 },
  pill: {
    marginTop: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  pillText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
