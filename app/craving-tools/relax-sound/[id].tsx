import { useLocalSearchParams } from "expo-router";

import { RelaxSoundDetailScreenFromId } from "@/components/feature/craving/relax-sound/RelaxSoundDetailScreen";

export default function RelaxSoundDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RelaxSoundDetailScreenFromId id={id ?? ""} />;
}
