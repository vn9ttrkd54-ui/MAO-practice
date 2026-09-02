import QuestionClient from "./QuestionClient";
import { questions } from "@/data/questions";
import { createClient } from "@/lib/supabase/server";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <QuestionClient question={question} tutorEnabled={Boolean(user)} />
  );
}
