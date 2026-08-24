import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTranslation } from "@/hooks/i18n/useTranslation";
import { formatLastSeenAgo } from "@/utils/community";

const PREFIX_VISIBLE_MS = 2500;
const FADE_MS = 300;

type Props = {
  lastSeenAt: number;
};

/** On enter: "last seen " shows ~2.5s, fades out, then only the time remains. */
export function ChatLastSeenSuffix({ lastSeenAt }: Props) {
  const { t, locale } = useTranslation();
  const [showPrefix, setShowPrefix] = useState(true);
  const prefixOpacity = useSharedValue(1);

  useEffect(() => {
    setShowPrefix(true);
    prefixOpacity.value = 1;

    const timer = setTimeout(() => {
      prefixOpacity.value = withTiming(0, { duration: FADE_MS }, (finished) => {
        if (finished) runOnJS(setShowPrefix)(false);
      });
    }, PREFIX_VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [lastSeenAt, prefixOpacity]);

  const prefixStyle = useAnimatedStyle(() => ({
    opacity: prefixOpacity.value,
  }));

  return (
    <View className="shrink-0 flex-row items-center">
      <Text className="text-xs text-muted-foreground dark:text-d-muted"> · </Text>
      {showPrefix ? (
        <Animated.Text
          style={prefixStyle}
          className="text-xs text-muted-foreground dark:text-d-muted"
        >
          {t("chat.lastSeenPrefix")}{" "}
        </Animated.Text>
      ) : null}
      <Text className="text-xs text-muted-foreground dark:text-d-muted" numberOfLines={1}>
        {formatLastSeenAgo(lastSeenAt, locale)}
      </Text>
    </View>
  );
}
