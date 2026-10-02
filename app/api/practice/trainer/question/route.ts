import { getTrainerQuestion } from "@/lib/trainerCatalog";

// Same public question/solution already available on the Question Bank page.
// This route reads the checked-in catalog only; it never reads or writes accounts.
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const raw = params.get("id") ?? "";
  const headers = { "Cache-Control": "no-store" };
  if (params.getAll("id").length !== 1 || !/^[1-9]\d{0,9}$/.test(raw)) {
    return Response.json({ error: "Invalid question ID." }, { status: 400, headers });
  }
  const question = getTrainerQuestion(Number(raw));
  if (!question) return Response.json({ error: "Question not found." }, { status: 404, headers });
  return Response.json({ question }, { headers });
}
