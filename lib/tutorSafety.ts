type AnswerCheckQuestion = {
  answer: string;
  choices: string[];
};

export function containsProgrammingInstructions(text: string) {
  // Catch code even if the model incorrectly labels the reply as in scope.
  return /```/.test(text)
    || /\b(?:print|printf|puts|console\.log|document\.write|System\.out\.print(?:ln)?|eval|exec)\s*\(/i.test(text)
    || /\b(?:def|function)\s+[a-z_$][\w$]*\s*\(/i.test(text)
    || /\b(?:const|let|var)\s+[a-z_$][\w$]*\s*=/i.test(text)
    || /(?:^|\n)\s*(?:from\s+[\w.]+\s+import\s+|import\s+[\w.]+(?:\s+as\s+\w+)?\s*(?:;|$))/m.test(text);
}

function normalizedAnswerText(value: string) {
  return value
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\(?:boxed|textbf|mathbf)\{([^{}]+)\}/g, "$1")
    .replace(/\\left|\\right|\\displaystyle/g, "")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/\\[()[\]]/g, "")
    .replace(/[{}$]/g, "")
    .replace(/\\,/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function revealsFinalAnswer(text: string, question: AnswerCheckQuestion) {
  const correctChoice = question.choices[question.answer.charCodeAt(0) - 65];
  if (!correctChoice) return false;

  const response = normalizedAnswerText(text);
  const answer = normalizedAnswerText(correctChoice);
  const letter = question.answer.toLowerCase();
  const choiceLeak = new RegExp(`(?:answer|choice)\\s*(?:is|=|:)?\\s*${letter}\\b`, "i").test(response);
  if (!answer || answer === "nota") return choiceLeak;

  const answerPattern = escapeRegExp(answer);
  const answerOccurrence = new RegExp(`(?:^|[^a-z0-9])${answerPattern}(?=$|[^a-z0-9])`, "i");
  const resultLanguage = /(?:answer|choice|value|sum|result|therefore|thus|so)\b/i;
  const occurrences = Array.from(response.matchAll(new RegExp(answerOccurrence.source, "gi")));
  const finalAnswerStatement = occurrences
    .some((match) => resultLanguage.test(response.slice(Math.max(0, match.index - 90), match.index)));
  const answerAtEnd = occurrences.some((match) => {
    const remaining = response.slice(match.index + match[0].length).trim();
    return remaining.length <= 24 && /^(?:[.,;:!?)]|\s|choice|answer|[a-e])*$/i.test(remaining);
  });

  return choiceLeak || finalAnswerStatement || answerAtEnd;
}
