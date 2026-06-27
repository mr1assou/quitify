import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { PostComposerForm } from "@/components/feature/community/PostComposer";

export default function PostComposerScreen() {
  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <PostComposerForm />
    </ScreenCanvas>
  );
}
