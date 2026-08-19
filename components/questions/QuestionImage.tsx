import Image from "next/image";

import type { QuestionIllustration } from "@/types/question";

export default function QuestionImage({ illustration }: { illustration?: QuestionIllustration }) {
  if (!illustration) return null;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-3">
      <Image
        src={illustration.src}
        alt={illustration.alt}
        width={illustration.width}
        height={illustration.height}
        className="mx-auto h-auto w-full max-w-3xl"
      />
    </div>
  );
}
