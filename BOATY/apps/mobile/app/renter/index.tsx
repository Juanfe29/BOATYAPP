import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Search, MapPin, Star, Users, Filter, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { nearbyBoats } from '../../data/renterMockData';
import { C, card } from '../../constants/colors';
import BoatyLogo from '../../components/BoatyLogo';

const categories = ['Todos', 'Yacht', 'Speedboat', 'Catamaran', 'Fishing Boat'];

export default function Discover() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = nearbyBoats.filter(b => {
    const matchCat = activeCategory === 'Todos' || b.type === activeCategory;
    const matchQ = b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.location.label.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoHeader}>
          <BoatyLogo size={0.7} color={C.navyDark} underlineColor={C.orange} />
          <View style={styles.locationRow}>
            <MapPin size={11} color={C.orange} />
            <Text style={styles.location}>Cartagena, Colombia</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Search size={16} color={C.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar bote o marina..."
            placeholderTextColor={C.muted}
            style={styles.searchInput}
          />
          <View style={styles.filterBtn}>
            <Filter size={15} color="#fff" />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ gap: 8, paddingRight: 20 }}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.mapArea}>
          {filtered.map((boat, i) => (
            <TouchableOpacity
              key={boat.id}
              style={[styles.mapPin, { left: `${20 + i * 20}%` as any, top: `${25 + (i % 2 === 0 ? 20 : 40)}%` as any }]}
              onPress={() => router.push({ pathname: '/renter/boat', params: { data: JSON.stringify(boat) } })}
            >
              <View style={styles.pinBubble}>
                <Text style={styles.pinPrice}>🚤 ${(boat.pricePerDay / 1000).toFixed(0)}k</Text>
              </View>
              <View style={styles.pinDot} />
            </TouchableOpacity>
          ))}
          <View style={styles.mapLabel}>
            <Text style={styles.mapLabelText}>📍 Colombia · Caribe</Text>
          </View>
          <View style={styles.anchorDecor}>
            <Text style={{ fontSize: 36, opacity: 0.2 }}>⚓</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>{filtered.length} botes disponibles</Text>
        </View>

        <View style={{ gap: 12 }}>
          {filtered.map(boat => (
            <TouchableOpacity
              key={boat.id}
              style={[card, { padding: 0, overflow: 'hidden' }]}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/renter/boat', params: { data: JSON.stringify(boat) } })}
            >
              <View style={styles.boatHero}>
                <Image source={boat.image} style={{ width: '100%', height: '100%', position: 'absolute' }} resizeMode="cover" />
                <View style={styles.ratingBadge}>
                  <Star size={10} color={C.gold} fill={C.gold} />
                  <Text style={styles.ratingText}>{boat.rating}</Text>
                </View>
                <View style={styles.distanceBadge}>
                  <MapPin size={10} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.distanceText}>{boat.distanceKm} km</Text>
                </View>
              </View>
              <View style={{ padding: 14 }}>
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
                <View style={styles.captainRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 18 }}>{boat.captain.avatar}</Text>
                    <View>
                      <Text style={styles.captainName}>{boat.captain.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Users size={9} color={C.muted} />
                        <Text style={styles.captainSub}>Hasta {boat.capacity} personas</Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={18} color={C.muted} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  logoHeader: { alignItems: 'flex-start', marginBottom: 16 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  location: { fontSize: 12, color: C.muted, fontWeight: '600' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14,
    borderWidth: 1, borderColor: 'rgba(27,60,108,0.1)',
    shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1, paddingVertical: 13, fontSize: 14, color: C.text,
  },
  filterBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center',
  },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 100,
    backgroundColor: '#fff',
    shadowColor: C.navy, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  catPillActive: {
    backgroundColor: C.navy,
    shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  catText: { fontSize: 12, fontWeight: '700', color: C.muted },
  catTextActive: { color: '#fff' },
  mapArea: {
    height: 160, borderRadius: 20, backgroundColor: '#0d2137',
    overflow: 'hidden', marginBottom: 20, position: 'relative',
  },
  mapPin: { position: 'absolute', zIndex: 10, alignItems: 'center' },
  pinBubble: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  pinPrice: { fontSize: 10, fontWeight: '800', color: C.orange },
  pinDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.orange, marginTop: 2, alignSelf: 'center' },
  mapLabel: {
    position: 'absolute', bottom: 10, left: 12, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  mapLabelText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  anchorDecor: { position: 'absolute', bottom: 10, right: 10, zIndex: 5 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  boatHero: {
    height: 140, overflow: 'hidden',
    backgroundColor: C.navy, position: 'relative',
  },
  ratingBadge: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  distanceBadge: {
    position: 'absolute', bottom: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  distanceText: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
  boatNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  boatName: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
  typePill: {
    backgroundColor: 'rgba(27,60,108,0.08)', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start',
  },
  typeText: { fontSize: 10, color: C.navy, fontWeight: '600' },
  price: { fontSize: 18, fontWeight: '800', color: C.orange },
  priceSub: { fontSize: 11, fontWeight: '400', color: C.muted },
  captainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  captainName: { fontSize: 12, fontWeight: '600', color: C.text },
  captainSub: { fontSize: 10, color: C.muted },
});
