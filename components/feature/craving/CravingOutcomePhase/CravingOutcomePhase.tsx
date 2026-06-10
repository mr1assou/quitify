import { ScrollView, View } from "react-native";

import {
  CravingResult,
  type CravingResultProps,
} from "@/components/feature/craving/CravingResult";

type Props = CravingResultProps & {
  contentTopClassName?: string;
};

export function CravingOutcomePhase({
  contentTopClassName = "pt-8",
  ...cravingResultProps
}: Props) {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
      <View className={contentTopClassName}>
        <CravingResult {...cravingResultProps} />
      </View>
    </ScrollView>
  );
}
