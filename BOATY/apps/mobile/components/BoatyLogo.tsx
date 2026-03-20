import Svg, { Text as SvgText, Rect, Polygon, G } from 'react-native-svg';
import { View } from 'react-native';

interface Props {
  size?: number;
  color?: string;
  underlineColor?: string;
}

// Recreates the BOATY wordmark: bold white text + orange underline + sail "A" accent
export default function BoatyLogo({ size = 1, color = '#ffffff', underlineColor = '#f26a31' }: Props) {
  const fs = 44 * size;
  const w = 220 * size;
  const h = fs + 14 * size;

  // Approximate sail triangle over the "A" — positioned at ~60% of width
  const sailX = w * 0.595;
  const sailW = fs * 0.28;
  const sailTop = fs * 0.08;
  const sailMid = fs * 0.52;

  return (
    <View>
      <Svg width={w} height={h}>
        <G>
          {/* Main wordmark */}
          <SvgText
            x={w / 2}
            y={fs - 2}
            textAnchor="middle"
            fontSize={fs}
            fontWeight="800"
            fill={color}
            letterSpacing={size * 3}
          >
            BOATY
          </SvgText>

          {/* Sail triangle overlay on the "A" */}
          <Polygon
            points={`${sailX},${sailTop} ${sailX - sailW / 2},${sailMid} ${sailX + sailW / 2},${sailMid}`}
            fill={underlineColor}
            opacity={0.9}
          />

          {/* Orange underline */}
          <Rect
            x={w * 0.06}
            y={fs + 4 * size}
            width={w * 0.88}
            height={2.5 * size}
            rx={1}
            fill={underlineColor}
          />
        </G>
      </Svg>
    </View>
  );
}
