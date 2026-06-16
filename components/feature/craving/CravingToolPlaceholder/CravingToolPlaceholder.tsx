import { View } from "react-native";

import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import type { CravingToolId } from "@/constants/craving/cravingTools";

type Props = {
  toolId: CravingToolId;
};

/** Empty tool page shell. */
export function CravingToolPlaceholder({ toolId }: Props) {
  return (
    <CravingToolScreen toolId={toolId}>
      <View className="flex-1" />
    </CravingToolScreen>
  );
}
