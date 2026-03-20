import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Image,
} from 'react-native';
import { ArrowLeft, Star, Users, MapPin, Check, ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { C, card } from '../../constants/colors';
import { paymentMethods } from '../../data/renterMockData';

type Mode = 'dia' | 'noche';
type Step = 'booking' | 'payment' | 'terms' | 'confirmed';

const nightHours = ['1h', '2h', '3h', '4h', '5h'];
const nightStartTimes = ['7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

const fmt = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

// Next 6 days for scheduling
const upcomingDates = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i + 1);
  return {
    key: d.toISOString().split('T')[0],
    day: d.toLocaleDateString('es-CO', { weekday: 'short' }),
    date: d.getDate(),
    month: d.toLocaleDateString('es-CO', { month: 'short' }),
  };
});

export default function BoatDetail() {
  const params = useLocalSearchParams();
  const boat = params.data ? JSON.parse(params.data as string) : null;

  const [mode, setMode] = useState<Mode>('dia');
  const [nightHour, setNightHour] = useState('2h');
  const [nightStart, setNightStart] = useState('8:00 PM');
  const [guests, setGuests] = useState(2);
  const [step, setStep] = useState<Step>('booking');
  const [selectedPM, setSelectedPM] = useState(paymentMethods[0].id);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitPeople, setSplitPeople] = useState(2);
  const [bookTiming, setBookTiming] = useState<'now' | 'later'>('now');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!boat) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: C.muted }}>Bote no encontrado</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: C.orange, fontWeight: '600' }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nightHourNum = parseInt(nightHour);
  const total = mode === 'dia'
    ? boat.pricePerDay
    : boat.pricePerNightHour * nightHourNum;

  const selectedMethod = paymentMethods.find(p => p.id === selectedPM)!;

  // ── CONFIRMED ──────────────────────────────────────────────
  if (step === 'confirmed') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centeredPage}>
          <View style={styles.checkCircle}>
            <Check size={36} color={C.success} />
          </View>
          <Text style={styles.confirmedTitle}>¡Reserva Confirmada!</Text>
          <Text style={styles.confirmedSub}>
            {boat.name} · {mode === 'dia' ? 'Día · 10:00 AM – 4:00 PM' : `Noche · ${nightStart} · ${nightHour}`}
          </Text>
          <Text style={styles.confirmedAmount}>{fmt(total)}</Text>

          <View style={[card, { width: '100%', marginBottom: 24 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 28 }}>{boat.captain.avatar}</Text>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.text }}>{boat.captain.name}</Text>
                <Text style={{ fontSize: 11, color: C.muted }}>Tu capitán · ⭐ {boat.captain.rating}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.orangeBtn} onPress={() => router.push('/renter/active')}>
            <Text style={styles.orangeBtnText}>Ver Viaje Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/renter')} style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 13, color: C.muted }}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── TERMS MODAL ────────────────────────────────────────────
  if (step === 'terms') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setStep('payment')} style={styles.backBtn}>
            <ArrowLeft size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Términos y Condiciones</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={styles.termsTitle}>Acuerdo de Servicio Náutico — Boaty</Text>
          <Text style={styles.termsDate}>Versión 1.0 · Marzo 2026</Text>

          {TERMS_SECTIONS.map((s, i) => (
            <View key={i} style={{ marginBottom: 20 }}>
              <Text style={styles.termsSectionTitle}>{s.title}</Text>
              <Text style={styles.termsBody}>{s.body}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.termsFooter}>
          <TouchableOpacity
            style={styles.termsCheck}
            onPress={() => setTermsAccepted(v => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
              {termsAccepted && <Check size={12} color="#fff" />}
            </View>
            <Text style={styles.termsCheckLabel}>
              He leído y acepto los términos y condiciones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.orangeBtn, !termsAccepted && { opacity: 0.4 }]}
            disabled={!termsAccepted}
            onPress={() => setStep('confirmed')}
          >
            <Text style={styles.orangeBtnText}>Confirmar Reserva</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── PAYMENT MODAL ──────────────────────────────────────────
  if (step === 'payment') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setStep('booking')} style={styles.backBtn}>
            <ArrowLeft size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Método de Pago</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={styles.pmSubtitle}>Selecciona cómo quieres pagar</Text>

          {paymentMethods.map(pm => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.pmCard, selectedPM === pm.id && styles.pmCardActive]}
              onPress={() => setSelectedPM(pm.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.pmIcon}>{pm.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.pmLabel}>{pm.label}{pm.last4 ? ` •••• ${pm.last4}` : ''}</Text>
                {pm.isDefault && <Text style={styles.pmDefault}>Predeterminado</Text>}
              </View>
              <View style={[styles.radioOuter, selectedPM === pm.id && styles.radioOuterActive]}>
                {selectedPM === pm.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addPmBtn}>
            <Text style={styles.addPmText}>+ Agregar método de pago</Text>
          </TouchableOpacity>

          {/* Split Bill */}
          <View style={[card, { marginBottom: 12 }]}>
            <TouchableOpacity
              style={styles.splitRow}
              onPress={() => setSplitEnabled(v => !v)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.splitTitle}>Dividir cuenta</Text>
                <Text style={styles.splitSub}>Divide el pago entre varias personas</Text>
              </View>
              <View style={[styles.splitToggle, splitEnabled && styles.splitToggleActive]}>
                <View style={[styles.splitThumb, splitEnabled && styles.splitThumbActive]} />
              </View>
            </TouchableOpacity>

            {splitEnabled && (
              <View style={styles.splitExpanded}>
                <View style={styles.splitDivider} />
                <Text style={styles.splitPeopleLabel}>¿Entre cuántas personas?</Text>
                <View style={styles.splitPeopleRow}>
                  <TouchableOpacity
                    style={styles.guestBtn}
                    onPress={() => setSplitPeople(n => Math.max(2, n - 1))}
                  >
                    <Text style={styles.guestBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.splitPeopleNum}>{splitPeople}</Text>
                  <TouchableOpacity
                    style={styles.guestBtn}
                    onPress={() => setSplitPeople(n => Math.min(10, n + 1))}
                  >
                    <Text style={styles.guestBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.splitResult}>
                  <Text style={styles.splitResultLabel}>Cada persona paga</Text>
                  <Text style={styles.splitResultAmount}>
                    {fmt(Math.ceil(total / splitPeople))}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={[card, styles.summaryBox]}>
            <Text style={styles.summaryLabel}>Resumen</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>{boat.name}</Text>
              <Text style={styles.summaryVal}>{mode === 'dia' ? 'Día completo' : `${nightHour} noche`}</Text>
            </View>
            {splitEnabled && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Split · {splitPeople} personas</Text>
                <Text style={styles.summaryVal}>{fmt(Math.ceil(total / splitPeople))} c/u</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Total</Text>
              <Text style={[styles.summaryVal, { color: C.orange, fontWeight: '800' }]}>{fmt(total)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.orangeBtn} onPress={() => setStep('terms')}>
            <Text style={styles.orangeBtnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── MAIN BOOKING SCREEN ────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={boat.image} style={{ width: '100%', height: '100%', position: 'absolute' }} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroRating}>
            <Star size={11} color={C.gold} fill={C.gold} />
            <Text style={styles.heroRatingText}>{boat.rating}</Text>
            <Text style={styles.heroRatingSub}>· {boat.totalTrips} viajes</Text>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          {/* Title + location */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.boatName}>{boat.name}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <View style={styles.typePill}>
                  <Text style={styles.typeText}>{boat.type}</Text>
                </View>
                <View style={[styles.typePill, { backgroundColor: 'rgba(242,106,49,0.1)' }]}>
                  <MapPin size={9} color={C.orange} />
                  <Text style={[styles.typeText, { color: C.orange }]}>{boat.location.label}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Capacity */}
          <View style={[card, styles.specSingle]}>
            <Users size={16} color={C.navy} />
            <Text style={styles.specNum}>{boat.capacity}</Text>
            <Text style={styles.specLabel}>Personas máx.</Text>
          </View>

          {/* Description + amenities */}
          <View style={[card, { marginBottom: 16 }]}>
            <Text style={styles.description}>{boat.description}</Text>
            <View style={styles.amenities}>
              {boat.amenities?.map((a: string, i: number) => (
                <View key={i} style={styles.amenityPill}>
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Captain */}
          <View style={[card, { marginBottom: 16 }]}>
            <Text style={styles.sectionLabel}>TU CAPITÁN</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.captainAvatar}>
                <Text style={{ fontSize: 22 }}>{boat.captain.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.captainName}>{boat.captain.name}</Text>
                <Text style={styles.captainMeta}>⭐ {boat.captain.rating} · {boat.captain.trips} viajes</Text>
              </View>
            </View>
          </View>

          {/* Mode selector */}
          <View style={[card, { marginBottom: 16 }]}>
            <Text style={styles.sectionLabel}>TIPO DE SALIDA</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'dia' && styles.modeBtnActive]}
                onPress={() => setMode('dia')}
              >
                <Text style={styles.modeEmoji}>☀️</Text>
                <Text style={[styles.modeBtnText, mode === 'dia' && styles.modeBtnTextActive]}>Día</Text>
                <Text style={[styles.modeBtnSub, mode === 'dia' && { color: 'rgba(255,255,255,0.75)' }]}>
                  {fmt(boat.pricePerDay)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'noche' && styles.modeBtnNocheActive]}
                onPress={() => setMode('noche')}
              >
                <Text style={styles.modeEmoji}>🌙</Text>
                <Text style={[styles.modeBtnText, mode === 'noche' && styles.modeBtnTextActive]}>Noche</Text>
                <Text style={[styles.modeBtnSub, mode === 'noche' && { color: 'rgba(255,255,255,0.75)' }]}>
                  {fmt(boat.pricePerNightHour)}/h
                </Text>
              </TouchableOpacity>
            </View>

            {/* Día — fixed schedule info */}
            {mode === 'dia' && (
              <View style={styles.diaInfo}>
                <Text style={styles.diaInfoText}>🕙  10:00 AM – 4:00 PM  ·  Día completo</Text>
              </View>
            )}

            {/* Noche — hour + start time selectors */}
            {mode === 'noche' && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.bookingLabel}>Hora de inicio</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 16 }}>
                  {nightStartTimes.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.timePill, nightStart === t && styles.timePillActive]}
                      onPress={() => setNightStart(t)}
                    >
                      <Text style={[styles.timePillText, nightStart === t && styles.timePillTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.bookingLabel}>Cuántas horas</Text>
                <View style={styles.durationsRow}>
                  {nightHours.map(h => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.durPill, nightHour === h && styles.durPillActive]}
                      onPress={() => setNightHour(h)}
                    >
                      <Text style={[styles.durPillText, nightHour === h && styles.durPillTextActive]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Guests */}
          <View style={[card, { marginBottom: 16 }]}>
            <Text style={styles.bookingLabel}>Pasajeros</Text>
            <View style={styles.guestRow}>
              <TouchableOpacity style={styles.guestBtn} onPress={() => setGuests(g => Math.max(1, g - 1))}>
                <Text style={styles.guestBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.guestCount}>{guests}</Text>
              <TouchableOpacity style={styles.guestBtn} onPress={() => setGuests(g => Math.min(boat.capacity, g + 1))}>
                <Text style={styles.guestBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Total */}
          <View style={[card, styles.totalCard]}>
            <View>
              <Text style={styles.totalLabel}>Total estimado</Text>
              <Text style={styles.totalAmount}>{fmt(total)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.totalSub}>
                {mode === 'dia' ? '10:00 AM – 4:00 PM' : `${nightStart} · ${nightHour}`}
              </Text>
              <Text style={styles.totalSub}>{guests} pax</Text>
            </View>
          </View>

          {/* Timing toggle */}
          <View style={[card, { marginBottom: 16 }]}>
            <View style={styles.timingRow}>
              <TouchableOpacity
                style={[styles.timingBtn, bookTiming === 'now' && styles.timingBtnActive]}
                onPress={() => setBookTiming('now')}
              >
                <Text style={[styles.timingBtnText, bookTiming === 'now' && styles.timingBtnTextActive]}>⚡ Reservar ahora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timingBtn, bookTiming === 'later' && styles.timingBtnActive]}
                onPress={() => setBookTiming('later')}
              >
                <Text style={[styles.timingBtnText, bookTiming === 'later' && styles.timingBtnTextActive]}>📅 Otro día</Text>
              </TouchableOpacity>
            </View>

            {bookTiming === 'later' && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.bookingLabel}>Selecciona la fecha</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {upcomingDates.map(d => (
                    <TouchableOpacity
                      key={d.key}
                      style={[styles.datePill, selectedDate === d.key && styles.datePillActive]}
                      onPress={() => setSelectedDate(d.key)}
                    >
                      <Text style={[styles.datePillDay, selectedDate === d.key && { color: 'rgba(255,255,255,0.7)' }]}>{d.day}</Text>
                      <Text style={[styles.datePillNum, selectedDate === d.key && { color: '#fff' }]}>{d.date}</Text>
                      <Text style={[styles.datePillMonth, selectedDate === d.key && { color: 'rgba(255,255,255,0.7)' }]}>{d.month}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.bookBtn, bookTiming === 'later' && !selectedDate && { opacity: 0.45 }]}
            disabled={bookTiming === 'later' && !selectedDate}
            onPress={() => setStep('payment')}
          >
            <Text style={styles.bookBtnText}>
              {bookTiming === 'now' ? '⚡ Reservar Ahora' : selectedDate ? `📅 Reservar para el ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}` : 'Selecciona una fecha'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── TERMS CONTENT ──────────────────────────────────────────────
const TERMS_SECTIONS = [
  {
    title: '1. Partes del Acuerdo',
    body: 'Este acuerdo se celebra entre BOATY S.A.S. ("Boaty"), el Usuario ("Pasajero") y el propietario/operador de la embarcación ("Capitán"). Al confirmar la reserva, el Pasajero acepta todos los términos aquí establecidos.',
  },
  {
    title: '2. Uso de la Embarcación',
    body: 'La embarcación se arrienda exclusivamente para uso recreativo dentro de las áreas marítimas autorizadas. Queda expresamente prohibido: exceder la capacidad máxima de pasajeros, consumir sustancias psicoactivas a bordo, alterar el itinerario acordado sin autorización del Capitán, y operar la embarcación sin la presencia del Capitán asignado.',
  },
  {
    title: '3. Responsabilidades del Pasajero',
    body: 'El Pasajero es responsable del comportamiento de todos los miembros de su grupo. Cualquier daño causado a la embarcación, su equipo o a terceros, será facturado al método de pago registrado. El Pasajero acepta seguir en todo momento las instrucciones de seguridad del Capitán.',
  },
  {
    title: '4. Condiciones Climáticas y Cancelaciones',
    body: 'BOATY se reserva el derecho de cancelar o reprogramar salidas por condiciones climáticas adversas o situaciones de fuerza mayor, sin costo para el Pasajero. Las cancelaciones realizadas con menos de 24 horas de anticipación por parte del Pasajero tendrán un cargo del 30% del valor total.',
  },
  {
    title: '5. Seguridad a Bordo',
    body: 'Es obligatorio el uso de chalecos salvavidas para menores de 14 años. El Capitán tiene autoridad absoluta sobre la embarcación y puede terminar el servicio sin reembolso si considera que existe riesgo para la seguridad de los pasajeros o la tripulación.',
  },
  {
    title: '6. Limitación de Responsabilidad',
    body: 'BOATY actúa como intermediario tecnológico. La responsabilidad operativa recae en el Capitán registrado. BOATY no será responsable por lesiones, pérdida de objetos personales o daños que ocurran durante la travesía, salvo negligencia comprobada imputable a la plataforma.',
  },
  {
    title: '7. Privacidad y Datos',
    body: 'Al usar la plataforma, el Pasajero autoriza el tratamiento de sus datos personales conforme a la Política de Privacidad de BOATY, disponible en boaty.app/privacidad, cumpliendo la Ley 1581 de 2012 de Colombia.',
  },
];

// ── STYLES ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  // Hero
  hero: {
    height: 280, backgroundColor: '#0c2545',
    position: 'relative', overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,37,69,0.35)',
  },
  backBtn: {
    position: 'absolute', top: 14, left: 14,
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center',
  },
  heroRating: {
    position: 'absolute', bottom: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroRatingText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  heroRatingSub:  { fontSize: 10, color: 'rgba(255,255,255,0.6)' },

  // Title
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  boatName: { fontSize: 24, fontWeight: '800', color: C.text },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(27,60,108,0.08)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  typeText: { fontSize: 10, color: C.navy, fontWeight: '600' },

  // Spec
  specSingle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, paddingVertical: 12 },
  specNum:    { fontSize: 15, fontWeight: '800', color: C.text },
  specLabel:  { fontSize: 10, color: C.muted },

  // Description
  description:  { fontSize: 13, color: C.text, lineHeight: 20 },
  amenities:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  amenityPill:  { backgroundColor: 'rgba(27,60,108,0.05)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  amenityText:  { fontSize: 11, color: C.navy, fontWeight: '600' },
  sectionLabel: { fontSize: 11, color: C.muted, fontWeight: '600', letterSpacing: 0.5, marginBottom: 12 },

  // Captain
  captainAvatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center' },
  captainName:   { fontSize: 15, fontWeight: '700', color: C.text },
  captainMeta:   { fontSize: 12, color: C.muted },

  // Mode selector
  modeRow:    { flexDirection: 'row', gap: 10 },
  modeBtn:    { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', backgroundColor: 'rgba(27,60,108,0.06)' },
  modeBtnActive:      { backgroundColor: C.navy, shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  modeBtnNocheActive: { backgroundColor: C.navyDark, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  modeEmoji:          { fontSize: 22, marginBottom: 4 },
  modeBtnText:        { fontSize: 14, fontWeight: '700', color: C.text },
  modeBtnTextActive:  { color: '#fff' },
  modeBtnSub:         { fontSize: 10, color: C.muted, marginTop: 2 },
  diaInfo: {
    marginTop: 14, backgroundColor: 'rgba(27,60,108,0.06)',
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  diaInfoText: { fontSize: 13, color: C.navy, fontWeight: '600' },

  // Booking controls
  bookingLabel:  { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 10 },
  timePill:      { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(27,60,108,0.05)' },
  timePillActive:     { backgroundColor: C.navy },
  timePillText:       { fontSize: 12, fontWeight: '700', color: C.muted },
  timePillTextActive: { color: '#fff' },
  durationsRow:  { flexDirection: 'row', gap: 6 },
  durPill:       { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: 'rgba(27,60,108,0.05)' },
  durPillActive: { backgroundColor: C.orange, shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  durPillText:        { fontSize: 12, fontWeight: '700', color: C.muted },
  durPillTextActive:  { color: '#fff' },

  // Guests
  guestRow:    { flexDirection: 'row', alignItems: 'center', gap: 16 },
  guestBtn:    { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(27,60,108,0.08)', alignItems: 'center', justifyContent: 'center' },
  guestBtnText:{ fontSize: 18, color: C.text },
  guestCount:  { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: C.text },

  // Total
  totalCard:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel:  { fontSize: 11, color: C.muted },
  totalAmount: { fontSize: 26, fontWeight: '900', color: C.orange },
  totalSub:    { fontSize: 11, color: C.muted },

  // Book button
  bookBtn:     { backgroundColor: C.orange, borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  // Payment screen
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  modalTitle:  { fontSize: 16, fontWeight: '700', color: C.text },
  pmSubtitle:  { fontSize: 13, color: C.muted, marginBottom: 16 },
  pmCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 14, marginBottom: 10,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.border,
  },
  pmCardActive: { borderColor: C.navy, backgroundColor: 'rgba(27,60,108,0.04)' },
  pmIcon:       { fontSize: 22 },
  pmLabel:      { fontSize: 14, fontWeight: '600', color: C.text },
  pmDefault:    { fontSize: 11, color: C.muted },
  radioOuter:   { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: C.navy },
  radioInner:   { width: 10, height: 10, borderRadius: 5, backgroundColor: C.navy },
  addPmBtn:     { paddingVertical: 14, alignItems: 'center' },
  addPmText:    { fontSize: 14, color: C.orange, fontWeight: '600' },
  summaryBox:   { marginTop: 8 },
  summaryLabel: { fontSize: 11, color: C.muted, fontWeight: '600', letterSpacing: 0.5, marginBottom: 10 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryKey:   { fontSize: 13, color: C.text },
  summaryVal:   { fontSize: 13, color: C.text, fontWeight: '600' },

  // Terms
  termsTitle:        { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 4 },
  termsDate:         { fontSize: 11, color: C.muted, marginBottom: 24 },
  termsSectionTitle: { fontSize: 13, fontWeight: '700', color: C.navy, marginBottom: 6 },
  termsBody:         { fontSize: 12, color: C.text, lineHeight: 20, opacity: 0.8 },
  termsFooter:       { padding: 20, borderTopWidth: 1, borderTopColor: C.border },
  termsCheck:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  checkbox:          { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive:    { backgroundColor: C.navy, borderColor: C.navy },
  termsCheckLabel:   { flex: 1, fontSize: 13, color: C.text, lineHeight: 18 },

  // Confirmed
  centeredPage:     { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  checkCircle:      { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  confirmedTitle:   { fontSize: 24, fontWeight: '800', color: C.text, marginBottom: 8 },
  confirmedSub:     { fontSize: 13, color: C.muted, marginBottom: 6, textAlign: 'center' },
  confirmedAmount:  { fontSize: 28, fontWeight: '900', color: C.orange, marginBottom: 24 },

  // Timing toggle
  timingRow:           { flexDirection: 'row', gap: 8 },
  timingBtn:           { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: 'rgba(27,60,108,0.05)' },
  timingBtnActive:     { backgroundColor: C.navy, shadowColor: C.navy, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  timingBtnText:       { fontSize: 12, fontWeight: '700', color: C.muted },
  timingBtnTextActive: { color: '#fff' },
  datePill:            { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(27,60,108,0.05)', minWidth: 56 },
  datePillActive:      { backgroundColor: C.orange, shadowColor: C.orange, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  datePillDay:         { fontSize: 10, color: C.muted, fontWeight: '600', textTransform: 'capitalize' },
  datePillNum:         { fontSize: 20, fontWeight: '800', color: C.text, lineHeight: 24 },
  datePillMonth:       { fontSize: 10, color: C.muted, textTransform: 'capitalize' },

  // Split bill
  splitRow:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  splitTitle:       { fontSize: 14, fontWeight: '700', color: C.text },
  splitSub:         { fontSize: 11, color: C.muted, marginTop: 2 },
  splitToggle:      { width: 44, height: 26, borderRadius: 13, backgroundColor: C.border, justifyContent: 'center', padding: 2 },
  splitToggleActive:{ backgroundColor: C.navy },
  splitThumb:       { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  splitThumbActive: { alignSelf: 'flex-end' },
  splitExpanded:    { marginTop: 12 },
  splitDivider:     { height: 1, backgroundColor: C.border, marginBottom: 12 },
  splitPeopleLabel: { fontSize: 12, fontWeight: '600', color: C.text, marginBottom: 10 },
  splitPeopleRow:   { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 },
  splitPeopleNum:   { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: C.navy },
  splitResult:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(27,60,108,0.05)', borderRadius: 10, padding: 12 },
  splitResultLabel: { fontSize: 12, color: C.muted },
  splitResultAmount:{ fontSize: 18, fontWeight: '800', color: C.orange },

  // Shared
  orangeBtn:     { width: '100%', backgroundColor: C.orange, borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: C.orange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  orangeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
