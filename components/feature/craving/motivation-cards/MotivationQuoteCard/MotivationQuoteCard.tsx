import { Text, View } from "react-native";

import type { MotivationQuote } from "@/constants/craving/motivationQuotes";

import { MotivationQuoteCardBackground } from "./MotivationQuoteCardBackground";

type Props = {
  quote: MotivationQuote;
  width: number;
  height: number;
  /** Optional little footer shown bottom-left (e.g. "3 / 300"). */
  footer?: string;
};

const RADIUS = 28;

export function MotivationQuoteCard({ quote, width, height, footer }: Props) {
  const { palette } = quote;

  return (
    <View
      style={{
        width,
        height,
        borderRadius: RADIUS,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        <MotivationQuoteCardBackground
          width={width}
          height={height}
          palette={palette}
          radius={RADIUS}
        />
      </View>

      <View style={{ flex: 1, padding: 28, justifyContent: "space-between" }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              color: palette.text,
              fontSize: 24,
              lineHeight: 34,
              fontWeight: "700",
            }}
          >
            {quote.text}
          </Text>
        </View>

        {footer ? (
          <Text
            style={{
              color: palette.muted,
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 0.6,
            }}
          >
            {footer}
          </Text>
        ) : (
          <View style={{ height: 16 }} />
        )}
      </View>
    </View>
  );
}
