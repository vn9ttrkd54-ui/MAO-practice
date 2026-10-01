import { Suspense } from "react";

import QuestionBankDivisionClient from "@/components/practice/QuestionBankDivisionClient";
import PracticeLoading from "@/components/practice/PracticeLoading";
import { getQuestionBankListing } from "@/lib/questionBankCatalog";

export default function AlphaQuestionBankPage() {
  return (
    <Suspense fallback={<PracticeLoading />}>
      <QuestionBankDivisionClient division="Alpha" items={getQuestionBankListing("Alpha")} />
    </Suspense>
  );
}
