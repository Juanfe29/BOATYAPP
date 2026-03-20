import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { C } from '../constants/colors';

const { width } = Dimensions.get('window');

interface WaveHeaderProps {
  children?: React.ReactNode;
  height?: number;
}

export default function WaveHeader({ children, height = 200 }: WaveHeaderProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.background}>
        {children}
      </View>
      <Svg
        width={width}
        height={48}
        viewBox={`0 0 ${width} 48`}
        style={styles.wave}
      >
        <Defs>
          <LinearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={C.navy} />
            <Stop offset="1" stopColor={C.navyLight} />
          </LinearGradient>
        </Defs>
        <Path
          d={`M0,16 C${width * 0.25},0 ${width * 0.5},32 ${width * 0.75},16 C${width * 0.88},8 ${width},20 ${width},20 L${width},0 L0,0 Z`}
          fill="url(#waveGrad)"
        />
        <Path
          d={`M0,28 C${width * 0.2},12 ${width * 0.45},40 ${width * 0.7},24 C${width * 0.85},16 ${width},30 ${width},30 L${width},48 L0,48 Z`}
          fill={C.bg}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    backgroundColor: C.navy,
    paddingHorizontal: 20,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
  },
});
