import QuestionClient from "./QuestionClient";
import { questions } from "@/data/questions";
import { getQuestionBankListing } from "@/lib/questionBankCatalog";
import { questionBankNavigation } from "@/lib/questionBankListing";

export default async function QuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;

  const questionId = Number(id);

  const question = questions.find(
    (q) => q.id === questionId
  );

  if (!question) {
    return (
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold">
          Question Not Found
        </h1>
      </main>
    );
  }

  const query = await searchParams;
  const navigation = questionBankNavigation(question.id,
    getQuestionBankListing(question.division).map(item => item.id),
    typeof query.sequence === "string" ? query.sequence : undefined);

  return (
    <QuestionClient question={question} navigation={navigation} />
  );
}
