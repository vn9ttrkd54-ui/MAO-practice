import { Suspense } from "react";

import QuestionBankDivisionClient from "@/components/practice/QuestionBankDivisionClient";

export default function MuQuestionBankPage() {
  return (
    <Suspense fallback={null}>
      <QuestionBankDivisionClient division="Mu" />
    </Suspense>
  );
}
