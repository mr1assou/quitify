import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { MotivationQuote } from "@/constants/craving/motivationQuotes";

import { MotivationQuoteCardBackground } from "./MotivationQuoteCardBackground";

type Props = {
  quote: MotivationQuote;
  width: number;
  height: number;
  /** Optional little footer shown bottom-left (e.g. "3 / 7"). */
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
        <Ionicons name="sparkles" size={28} color={palette.text} />

        <View>
          <Text
            style={{
              color: palette.text,
              fontSize: 24,
              lineHeight: 32,
              fontWeight: "800",
            }}
          >
            “{quote.text}”
          </Text>
          {quote.author ? (
            <Text
              style={{
                marginTop: 14,
                color: palette.muted,
                fontSize: 13,
                fontWeight: "600",
                letterSpacing: 0.4,
              }}
            >
              — {quote.author}
            </Text>
          ) : null}
        </View>

        {footer ? (
          <Text
            style={{
              color: palette.muted,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 1.2,
              textTransform: "uppercase",
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
