import { Suspense } from "react";

import QuestionBankDivisionClient from "@/components/practice/QuestionBankDivisionClient";

export default function AlphaQuestionBankPage() {
  return (
    <Suspense fallback={null}>
      <QuestionBankDivisionClient division="Alpha" />
    </Suspense>
  );
}
