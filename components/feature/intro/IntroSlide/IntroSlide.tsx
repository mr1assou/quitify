import { type ReactNode } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

type Props = {
  title: string;
  body: string;
  visual: ReactNode;
};

export function IntroSlide({ title, body, visual }: Props) {
  return (
    <View className="flex-1 px-6">
      <View className="flex-1 items-center justify-center">{visual}</View>

      <View className="pb-8">
        <Animated.Text
          entering={FadeInUp.delay(120).duration(480)}
          className="text-3xl font-bold text-foreground dark:text-d-text"
        >
          {title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(250).duration(480)}
          className="mt-3 text-base leading-6 text-muted-foreground dark:text-d-muted"
        >
          {body}
        </Animated.Text>
      </View>
    </View>
  );
}
