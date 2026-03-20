import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import BoatyLogo from './BoatyLogo';

const { width, height } = Dimensions.get('window');
const WAVE_W = width * 3;

function wavePath(offset: number, amp: number, yBase: number): string {
  const seg = WAVE_W / 4;
  return [
    `M0,${yBase}`,
    `C${seg * 0.5},${yBase - amp} ${seg * 0.5},${yBase + amp} ${seg},${yBase}`,
    `C${seg * 1.5},${yBase - amp} ${seg * 1.5},${yBase + amp} ${seg * 2},${yBase}`,
    `C${seg * 2.5},${yBase - amp} ${seg * 2.5},${yBase + amp} ${seg * 3},${yBase}`,
    `C${seg * 3.5},${yBase - amp} ${seg * 3.5},${yBase + amp} ${WAVE_W},${yBase}`,
    `L${WAVE_W},120 L0,120 Z`,
  ].join(' ');
}

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.8)).current;
  const subtitleOp  = useRef(new Animated.Value(0)).current;
  const screenOp    = useRef(new Animated.Value(1)).current;

  // Wave offsets — 3 independent layers
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(-width * 0.3)).current;
  const wave3 = useRef(new Animated.Value(-width * 0.6)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(logoScale,   { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    Animated.timing(subtitleOp, { toValue: 1, duration: 700, delay: 600, useNativeDriver: true }).start();

    // Wave loops
    const makeWave = (anim: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -width, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0,      duration, useNativeDriver: true }),
        ])
      );

    makeWave(wave1, 3200).start();
    makeWave(wave2, 4500).start();
    makeWave(wave3, 2800).start();

    // Exit after 2.8s
    const timer = setTimeout(() => {
      Animated.timing(screenOp, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => onDone());
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const WAVE_H = 120;

  return (
    <Animated.View style={[styles.root, { opacity: screenOp }]}>
      {/* Center logo */}
      <View style={styles.center}>
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <BoatyLogo size={1.1} />
        </Animated.View>
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOp }]}>
          Tu plataforma náutica
        </Animated.Text>
      </View>

      {/* Animated ocean waves at bottom */}
      <View style={styles.waveContainer} pointerEvents="none">
        {/* Layer 3 — orange accent, fastest */}
        <Animated.View style={[styles.waveLayer, { transform: [{ translateX: wave3 }] }]}>
          <Svg width={WAVE_W} height={WAVE_H}>
            <Path d={wavePath(0, 10, 60)} fill="rgba(242,106,49,0.18)" />
          </Svg>
        </Animated.View>

        {/* Layer 2 — mid navy */}
        <Animated.View style={[styles.waveLayer, { transform: [{ translateX: wave2 }] }]}>
          <Svg width={WAVE_W} height={WAVE_H}>
            <Path d={wavePath(0, 14, 45)} fill="rgba(27,60,108,0.55)" />
          </Svg>
        </Animated.View>

        {/* Layer 1 — front navy, slowest */}
        <Animated.View style={[styles.waveLayer, { transform: [{ translateX: wave1 }] }]}>
          <Svg width={WAVE_W} height={WAVE_H}>
            <Path d={wavePath(0, 18, 35)} fill="rgba(27,60,108,0.85)" />
          </Svg>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0c2545',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  center: {
    alignItems: 'center',
    marginBottom: 80,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: 'hidden',
  },
  waveLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
