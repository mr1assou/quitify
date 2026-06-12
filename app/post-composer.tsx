import { SafeAreaView } from "react-native-safe-area-context";

import { PostComposerForm } from "@/components/feature/community/PostComposer";

export default function PostComposerScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <PostComposerForm />
    </SafeAreaView>
  );
}
