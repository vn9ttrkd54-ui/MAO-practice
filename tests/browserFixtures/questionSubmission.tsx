import { createRoot } from "react-dom/client";
import SubmitChallengeQuestionPage from "@/app/challenge/submit/page";
import ChallengePage from "@/app/challenge/page";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import AdminFeedbackList from "@/components/admin/AdminFeedbackList";

const root = createRoot(document.getElementById("root")!);
const params = new URLSearchParams(location.search);
async function render() {
  if (params.get("view") === "admin") {
    root.render(<AdminFeedbackList initialRequests={[
      { id: "submission", kind: "question_submission", username: "Fixture student", questionId: null, division: "Alpha", questionLabel: null, message: "Problem, answer, full solution, and source credit.", createdAt: "2026-10-21T12:00:00Z" },
      { id: "report", kind: "question_report", username: "Fixture student", questionId: 42, division: "Mu", questionLabel: "Mu #42", message: "A useful question report.", createdAt: "2026-10-21T12:00:00Z" },
      { id: "suggestion", kind: "general_suggestion", username: "Fixture student", questionId: null, division: null, questionLabel: null, message: "A useful general suggestion.", createdAt: "2026-10-21T12:00:00Z" },
    ]} />);
  } else if (params.get("view") === "suggestion") {
    root.render(<main className="p-6"><FeedbackForm kind="general_suggestion" /></main>);
  } else if (params.get("view") === "report") {
    root.render(<main className="p-6"><FeedbackForm kind="question_report" questionId={42} division="Mu" /></main>);
  } else if (location.pathname === "/challenge/submit") {
    try { root.render(await SubmitChallengeQuestionPage()); }
    catch (error) {
      if (error instanceof Error && error.message === "fixture-redirect") root.render(<h1>Sign in</h1>);
      else throw error;
    }
  } else {
    root.render(await ChallengePage({ searchParams: Promise.resolve({ division: params.get("division") ?? "Mu" }) }));
  }
}
void render();
