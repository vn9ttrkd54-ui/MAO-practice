import { Suspense } from "react";

import QuestionBankDivisionClient from "@/components/practice/QuestionBankDivisionClient";

export default function ThetaQuestionBankPage() {
  return (
    <Suspense fallback={null}>
      <QuestionBankDivisionClient division="Theta" />
    </Suspense>
  );
}
