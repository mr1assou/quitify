import { Image, useWindowDimensions, View } from "react-native";

import { IntroSlide } from "@/components/feature/intro/IntroSlide";
import { introHeroImageHeight, type IntroSlideContent } from "@/constants/app/intro";

type Props = {
  slide: IntroSlideContent;
};

export function AfterOnboardIntroSlide({ slide }: Props) {
  const { height: winH } = useWindowDimensions();
  const imageHeight = introHeroImageHeight(winH);

  const visual = (
    <View className="w-full flex-1 items-center justify-center px-1">
      <Image
        source={require("../../../../assets/images/after_onboard.png")}
        style={{ width: "100%", height: imageHeight }}
        resizeMode="contain"
        accessibilityLabel="Welcome illustration"
      />
    </View>
  );

  return <IntroSlide title={slide.title} body={slide.body} visual={visual} />;
}
