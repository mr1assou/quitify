import {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
  Svg,
} from "react-native-svg";

import type { MotivationCardPalette } from "@/constants/craving/motivationQuotes";

type Props = {
  width: number;
  height: number;
  palette: MotivationCardPalette;
  radius: number;
};

/** SVG gradient + accent shape used as the card background. */
export function MotivationQuoteCardBackground({
  width,
  height,
  palette,
  radius,
}: Props) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="card-bg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={palette.gradientTop} stopOpacity="1" />
          <Stop offset="1" stopColor={palette.gradientBottom} stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="url(#card-bg)"
      />
      {/* Decorative accent circle for visual interest. */}
      <Rect
        x={width * 0.55}
        y={-height * 0.25}
        width={height * 0.7}
        height={height * 0.7}
        rx={height * 0.35}
        ry={height * 0.35}
        fill={palette.accent}
        opacity={0.35}
      />
    </Svg>
  );
}
