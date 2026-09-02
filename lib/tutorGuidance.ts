export type TutorGuidance = {
  likelyStickingPoint: string;
  firstHint: string;
  progression: string[];
  relevantKnowledge: string[];
  commonMistakes: string[];
  responseNotes?: string[];
};

const GUIDANCE_BY_QUESTION_ID: Readonly<Record<number, TutorGuidance>> = {
  10007: {
    likelyStickingPoint: "The student may not know how to locate a shared tangency point or may be unsure how to differentiate an equation containing the parameter a.",
    firstHint: "Find the slope of each curve by implicit differentiation and set the two slopes equal at the tangency point.",
    progression: [
      "Explain that tangent curves have equal slopes at their shared point.",
      "Implicitly differentiate each curve while treating a as a constant.",
      "Set the two slope expressions equal.",
      "Use the resulting relationship together with both original curve equations.",
      "Solve for the positive value of the parameter only at the final stage.",
    ],
    relevantKnowledge: ["implicit differentiation", "parameters treated as constants", "tangent curves have equal slopes", "a tangency point lies on both curves"],
    commonMistakes: ["differentiating terms containing a incorrectly", "using only the equal-slope condition", "substituting a point that does not satisfy both original equations"],
  },
  10008: {
    likelyStickingPoint: "The student may not know how to turn an infinite continued fraction into a finite equation.",
    firstHint: "Name the entire repeated continued fraction and use the fact that the same expression appears inside itself.",
    progression: [
      "Write the self-referential algebraic equation.",
      "Rearrange it into a quadratic relation.",
      "Differentiate the relation implicitly.",
      "Use positivity to select the appropriate value only when it is needed.",
    ],
    relevantKnowledge: ["self-similarity of continued fractions", "quadratic equations", "implicit differentiation"],
    commonMistakes: ["trying to differentiate the infinite fraction term by term", "using the quotient rule before replacing the repeated expression"],
  },
  10014: {
    likelyStickingPoint: "The number of Simpson's Rule subintervals may distract the student into a long calculation.",
    firstHint: "Check the degree of the polynomial and recall when Simpson's Rule is exact.",
    progression: [
      "Recognize that Simpson's Rule is exact for polynomials of degree at most three.",
      "Replace the numerical approximation with the corresponding definite integral.",
      "Find an antiderivative and evaluate it only at the final stage.",
    ],
    relevantKnowledge: ["degree of a polynomial", "exactness of Simpson's Rule for cubics", "definite integrals"],
    commonMistakes: ["expanding the full 20-subinterval Simpson's Rule sum", "forgetting that exactness includes degree three"],
    responseNotes: ["If asked why Simpson's Rule is exact for a cubic, explain only that its error depends on the fourth derivative and a cubic's fourth derivative is zero. Give another proof only if the student explicitly requests one."],
  },
  10021: {
    likelyStickingPoint: "The student may not see how the three differential equations relate to the logarithm in the integral.",
    firstHint: "Divide each differential equation by its corresponding function and look for logarithmic derivatives that can be combined.",
    progression: [
      "Use \(y_i'/y_i=(\ln y_i)'\) for each equation.",
      "Combine them with coefficients matching \(\ln(y_1y_2^2/y_3)\).",
      "Use the initial values to determine the combined constant.",
      "Recognize derivative expressions using the product rule \(f'h+fh'=(fh)'\).",
      "Evaluate the requested integral only after the combined logarithm has been simplified.",
    ],
    relevantKnowledge: ["logarithmic derivatives", "logarithm laws", "product rule", "initial-value problems"],
    commonMistakes: ["solving all three functions separately before combining them", "substituting the initial values into the final integral too early", "missing the square on the second function"],
  },
  10022: {
    likelyStickingPoint: "The student may not know how to find the angle between eigenvectors or how to express the condition that the eigenvectors are perpendicular.",
    firstHint: "Recall that two eigenvectors are perpendicular exactly when their dot product is zero.",
    progression: [
      "Find the eigenvalues of the matrix.",
      "Find a corresponding eigenvector for each eigenvalue.",
      "Set the dot product of the eigenvectors equal to zero to locate when they are perpendicular.",
      "Use the normalized dot-product formula to express the cosine of the smaller angle between the eigenvectors.",
      "Explain how the cosine expression depends on x.",
      "Differentiate with respect to time and use the given rate of change of x only at the final stage.",
    ],
    relevantKnowledge: ["eigenvalues and eigenvectors", "matrix characteristic equations", "dot products", "the angle formula for vectors", "related rates"],
    commonMistakes: ["calculating an eigenvalue incorrectly", "using unnormalized dot product as the cosine", "forgetting that x depends on time", "losing the sign when differentiating the cosine of the angle"],
    responseNotes: ["For the first hint, state only that perpendicular eigenvectors have dot product zero and ask the student to begin by finding the eigenvectors. Do not set up the dot product or mention solving for x yet."],
  },
  10023: {
    likelyStickingPoint: "The student may assume the expression with the larger exponent is larger or jump immediately to decimal approximation.",
    firstHint: "Rewrite the comparison so both sides can be studied through the same function, \(x^{1/x}\).",
    progression: [
      "Transform the inequality into a comparison of values of \(x^{1/x}\).",
      "Use logarithmic differentiation on \(f(x)=x^{1/x}\).",
      "Determine where the function increases or decreases.",
      "Compare the two inputs, using a small decimal estimate only at this stage if needed.",
      "Use the monotonic behavior to return to the original expressions.",
    ],
    relevantKnowledge: ["equivalent inequalities with positive quantities", "logarithmic differentiation", "first derivative test", "monotonicity"],
    commonMistakes: ["choosing by exponent size alone", "rearranging the inequality incorrectly", "differentiating \(x^{1/x}\) without taking logarithms first"],
  },
  10030: {
    likelyStickingPoint: "The student may mishandle the chain rule or stop after finding only one inflection-point candidate.",
    firstHint: "Differentiate twice, factor out the exponential term, and set the remaining factor equal to zero.",
    progression: [
      "Apply the chain rule carefully to find the second derivative.",
      "Factor out the exponential, which is never zero.",
      "Solve the remaining algebraic equation and retain every real candidate.",
      "Check that concavity changes at the candidates.",
      "Apply the operation the question requests to all resulting x-values.",
    ],
    relevantKnowledge: ["chain rule", "second derivatives", "inflection points and concavity changes", "solving squared equations"],
    commonMistakes: ["forgetting the chain rule", "dropping one solution of a squared equation", "finding the x-values but not applying the requested operation"],
  },
  10043: {
    likelyStickingPoint: "The student may not see how the alternating turns repeat or how to account for neither player winning during earlier rounds.",
    firstHint: "Treat one round as Romir rolling once followed, if necessary, by Sydney rolling once, and find the probability that neither wins during that complete round.",
    progression: [
      "Find Romir's probability of rolling a sum of 5.",
      "Find Sydney's probability of rolling a sum of 10.",
      "Multiply the appropriate failure probabilities to find the probability of one complete unsuccessful round.",
      "Express Romir winning after k unsuccessful rounds as a geometric sequence.",
      "Sum the infinite geometric series only at the final stage.",
    ],
    relevantKnowledge: ["counting outcomes for two dice", "complement probabilities", "independent events", "infinite geometric series"],
    commonMistakes: ["counting dice combinations incorrectly", "forgetting that Sydney rolls only after Romir fails", "adding independent failure probabilities instead of multiplying them", "omitting the case where Romir wins on his first roll"],
    responseNotes: ["For the first hint, introduce the idea of one complete unsuccessful round without calculating either player's success probability or writing the geometric series."],
  },
};

export function getTutorGuidance(questionId: number) {
  return GUIDANCE_BY_QUESTION_ID[questionId] ?? null;
}

export function formatTutorGuidance(guidance: TutorGuidance) {
  const sections = [
    `Likely sticking point: ${guidance.likelyStickingPoint}`,
    `Intended first hint: ${guidance.firstHint}`,
    `Teaching progression:\n${guidance.progression.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
    `Relevant knowledge: ${guidance.relevantKnowledge.join("; ")}`,
    `Common mistakes to watch for: ${guidance.commonMistakes.join("; ")}`,
  ];

  if (guidance.responseNotes?.length) {
    sections.push(`Response-specific notes: ${guidance.responseNotes.join("; ")}`);
  }

  return sections.join("\n\n");
}
