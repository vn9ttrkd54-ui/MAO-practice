import { Suspense } from "react";

import QuestionBankDivisionClient from "@/components/practice/QuestionBankDivisionClient";
import PracticeLoading from "@/components/practice/PracticeLoading";

export default function ThetaQuestionBankPage() {
  return (
    <Suspense fallback={<PracticeLoading />}>
      <QuestionBankDivisionClient division="Theta" />
    </Suspense>
  );
}
