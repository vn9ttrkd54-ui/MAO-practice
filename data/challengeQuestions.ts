import type {
  ChallengeQuestion,
  ChallengeQuestionId,
} from "@/types/challenge";

export const challengeQuestions = [
  {
    id: "CH-0001",
    division: "Mu",
    topic: "Algebra",
    difficulty: 2,
    question:
      "Three consecutive integers have a sum of 72. What is the greatest of the three integers?",
    choices: {
      A: "23",
      B: "24",
      C: "25",
      D: "26",
      E: "27",
    },
    answer: "C",
    solution:
      "Let the integers be n - 1, n, and n + 1. Their sum is 3n = 72, so n = 24. The greatest integer is 25.",
  },
  {
    id: "CH-0002",
    division: "Alpha",
    topic: "Geometry",
    difficulty: 3,
    question:
      "A rectangle has perimeter 34 units and length 3 units greater than its width. What is its area?",
    choices: {
      A: "60 square units",
      B: "64 square units",
      C: "70 square units",
      D: "72 square units",
      E: "77 square units",
    },
    answer: "C",
    solution:
      "If the width is w, the length is w + 3. Then 2w + 2(w + 3) = 34, so w = 7 and the length is 10. The area is 7 × 10 = 70 square units.",
  },
  {
    id: "CH-0003",
    division: "Theta",
    topic: "Number Theory",
    difficulty: 4,
    question:
      "What is the remainder when 2^20 is divided by 7?",
    choices: {
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      E: "6",
    },
    answer: "D",
    solution:
      "Powers of 2 modulo 7 repeat every 3 exponents because 2^3 = 8 has remainder 1. Since 20 has remainder 2 when divided by 3, 2^20 has the same remainder as 2^2, which is 4.",
  },
  {
    id: "CH-0004",
    division: "Mu",
    topic: "Counting",
    difficulty: 3,
    question:
      "How many different three-letter arrangements can be made from the letters M, A, T, and H if no letter may be repeated?",
    choices: {
      A: "12",
      B: "18",
      C: "24",
      D: "36",
      E: "64",
    },
    answer: "C",
    solution:
      "There are 4 choices for the first letter, 3 for the second, and 2 for the third. Therefore, there are 4 × 3 × 2 = 24 arrangements.",
  },
  {
    id: "CH-0005",
    division: "Alpha",
    topic: "Probability",
    difficulty: 4,
    question:
      "A fair six-sided die is rolled twice. What is the probability that the sum of the two rolls is 9?",
    choices: {
      A: "1/12",
      B: "1/9",
      C: "1/8",
      D: "5/36",
      E: "1/6",
    },
    answer: "B",
    solution:
      "There are 36 equally likely ordered outcomes. The four outcomes with sum 9 are (3, 6), (4, 5), (5, 4), and (6, 3), so the probability is 4/36 = 1/9.",
  },
  {
    id: "CH-0006",
    division: "Theta",
    topic: "Arithmetic",
    difficulty: 1,
    question: "What is 1 + 1?",
    choices: {
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      E: "5",
    },
    answer: "B",
    solution: "Adding 1 and 1 gives 2.",
  },
  {
    id: "CH-0007",
    division: "Mu",
    topic: "Limits",
    difficulty: 4,
    question: String.raw`Evaluate
\[
\lim_{x\to 0}\frac{\displaystyle\int_0^{\sin x}\arctan(t)\,dt}{x^2}.
\]`,
    choices: {
      A: String.raw`\(0\)`,
      B: String.raw`\(\frac14\)`,
      C: String.raw`\(\frac12\)`,
      D: String.raw`\(1\)`,
      E: String.raw`\(2\)`,
    },
    answer: "C",
    solution: String.raw`Both the numerator and denominator approach \(0\). By the Fundamental Theorem of Calculus and the chain rule,
\[
\frac{d}{dx}\int_0^{\sin x}\arctan(t)\,dt
=\arctan(\sin x)\cos x.
\]
One application of L'Hopital's Rule still gives \(0/0\), so differentiate again:
\[
\frac{d}{dx}\bigl(\arctan(\sin x)\cos x\bigr)
=\frac{\cos^2x}{1+\sin^2x}-\arctan(\sin x)\sin x.
\]
At \(x=0\), this expression equals \(1\), while \(\frac{d^2}{dx^2}(x^2)=2\). Therefore the limit is \(\boxed{\frac12}\).`,
  },
  {
    id: "CH-0008",
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 4,
    question: String.raw`Let \(\theta\) be an acute angle satisfying
\[
\sec\theta+\tan\theta=3.
\]
What is \(\cos(2\theta)\)?`,
    choices: {
      A: String.raw`\(-\frac{24}{25}\)`,
      B: String.raw`\(-\frac{16}{25}\)`,
      C: String.raw`\(-\frac{9}{25}\)`,
      D: String.raw`\(-\frac{7}{25}\)`,
      E: String.raw`\(\frac{7}{25}\)`,
    },
    answer: "D",
    solution: String.raw`Use the conjugate identity
\[
(\sec\theta+\tan\theta)(\sec\theta-\tan\theta)=\sec^2\theta-\tan^2\theta=1.
\]
Thus \(\sec\theta-\tan\theta=\frac13\). Adding this to the given equation gives \(2\sec\theta=\frac{10}{3}\), so \(\sec\theta=\frac53\) and \(\cos\theta=\frac35\). Since \(\theta\) is acute, \(\sin\theta=\frac45\). Hence
\[
\cos(2\theta)=\cos^2\theta-\sin^2\theta
=\frac{9}{25}-\frac{16}{25}
=\boxed{-\frac{7}{25}}.
\]`,
  },
  {
    id: "CH-0009",
    division: "Theta",
    topic: "Functions",
    difficulty: 5,
    question: String.raw`Define
\[
f(x)=\frac{x-1}{x+1},
\]
and let \(f^{(n)}\) denote the composition of \(f\) with itself \(n\) times. What is \(f^{(2026)}(2)\)?`,
    choices: {
      A: String.raw`\(-2\)`,
      B: String.raw`\(-\frac12\)`,
      C: String.raw`\(\frac13\)`,
      D: String.raw`\(\frac12\)`,
      E: String.raw`\(2\)`,
    },
    answer: "B",
    solution: String.raw`First compose \(f\) with itself:
\[
f^{(2)}(x)
=\frac{\frac{x-1}{x+1}-1}{\frac{x-1}{x+1}+1}
=\frac{-2}{2x}
=-\frac1x.
\]
Applying this transformation twice gives \(f^{(4)}(x)=x\), so the iterates repeat with period \(4\). Since
\[
2026=4(506)+2,
\]
we have \(f^{(2026)}(2)=f^{(2)}(2)=\boxed{-\frac12}\).`,
  },
  {
    id: "CH-0010",
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    question: String.raw`A right circular cylinder is inscribed in a sphere of radius \(6\). What is the maximum possible volume of the cylinder?`,
    choices: {
      A: String.raw`\(72\sqrt3\pi\)`,
      B: String.raw`\(96\pi\)`,
      C: String.raw`\(96\sqrt3\pi\)`,
      D: String.raw`\(144\pi\)`,
      E: String.raw`\(144\sqrt3\pi\)`,
    },
    answer: "C",
    solution: String.raw`Let the cylinder have radius \(r\) and height \(h\). A central cross-section gives a right triangle with legs \(r\) and \(\frac h2\) and hypotenuse \(6\), so
\[
r^2+\frac{h^2}{4}=36.
\]
Therefore
\[
V(h)=\pi r^2h=\pi\left(36-\frac{h^2}{4}\right)h.
\]
Differentiate:
\[
V'(h)=36\pi-\frac{3\pi h^2}{4}.
\]
The positive critical point satisfies \(h^2=48\), so \(h=4\sqrt3\) and \(r^2=24\). The volume is
\[
V_{\max}=\pi(24)(4\sqrt3)=\boxed{96\sqrt3\pi}.
\]`,
  },
  {
    id: "CH-0011",
    division: "Alpha",
    topic: "Polynomials",
    difficulty: 5,
    question: String.raw`A monic quartic polynomial \(P\) has four distinct real roots and satisfies
\[
P(x)=P(4-x)
\]
for every real \(x\). If \(-2\) and \(1\) are roots of \(P\), what is \(P(0)\)?`,
    choices: {
      A: String.raw`\(-36\)`,
      B: String.raw`\(-12\)`,
      C: String.raw`\(12\)`,
      D: String.raw`\(24\)`,
      E: String.raw`\(36\)`,
    },
    answer: "A",
    solution: String.raw`The identity \(P(x)=P(4-x)\) means that reflection across \(x=2\) preserves the roots. Thus a root \(r\) is paired with \(4-r\). The root \(-2\) is paired with \(6\), and the root \(1\) is paired with \(3\). Since \(P\) is a monic quartic with distinct roots,
\[
P(x)=(x+2)(x-1)(x-3)(x-6).
\]
Consequently,
\[
P(0)=(2)(-1)(-3)(-6)=\boxed{-36}.
\]`,
  },
  {
    id: "CH-0012",
    division: "Theta",
    topic: "Number Theory",
    difficulty: 5,
    question: String.raw`How many integers \(n\) with \(1\le n\le 1000\) satisfy
\[
n^2\equiv 1\pmod{24}?
\]`,
    choices: {
      A: String.raw`\(166\)`,
      B: String.raw`\(167\)`,
      C: String.raw`\(332\)`,
      D: String.raw`\(333\)`,
      E: String.raw`\(334\)`,
    },
    answer: "D",
    solution: String.raw`An odd integer has square congruent to \(1\pmod 8\). Also, an integer not divisible by \(3\) has square congruent to \(1\pmod 3\). By the Chinese Remainder Theorem, both conditions together are equivalent to
\[
n^2\equiv1\pmod{24}.
\]
Thus the valid integers are exactly those relatively prime to \(6\), namely the integers congruent to \(1\) or \(5\pmod6\). Each complete block of six contributes two values. The first \(996=6\cdot166\) integers contribute \(332\), and among \(997,998,999,1000\), only \(997\equiv1\pmod6\) qualifies. The total is \(332+1=\boxed{333}\).`,
  },
  {
    id: "CH-0013",
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 4,
    question: String.raw`A function \(y\) satisfies
\[
\frac{dy}{dx}=y(2-y),\qquad y(0)=1.
\]
What is \(y(\ln\sqrt3)\)?`,
    choices: {
      A: String.raw`\(1\)`,
      B: String.raw`\(\frac43\)`,
      C: String.raw`\(\frac32\)`,
      D: String.raw`\(\frac53\)`,
      E: String.raw`\(2\)`,
    },
    answer: "C",
    solution: String.raw`Separate variables and use partial fractions:
\[
\int\frac{dy}{y(2-y)}=\int dx
\quad\Longrightarrow\quad
\frac12\ln\left(\frac{y}{2-y}\right)=x+C.
\]
The condition \(y(0)=1\) gives \(C=0\), so
\[
\frac{y}{2-y}=e^{2x}.
\]
At \(x=\ln\sqrt3\), we have \(e^{2x}=3\). Hence \(y=3(2-y)\), so \(4y=6\) and
\[
y(\ln\sqrt3)=\boxed{\frac32}.
\]`,
  },
  {
    id: "CH-0014",
    division: "Alpha",
    topic: "Complex Numbers",
    difficulty: 5,
    question: String.raw`Let
\[
z=\frac{1+i\sqrt3}{1-i}.
\]
What is \(z^6\)?`,
    choices: {
      A: String.raw`\(-8\)`,
      B: String.raw`\(-4i\)`,
      C: String.raw`\(4i\)`,
      D: String.raw`\(-8i\)`,
      E: String.raw`\(8i\)`,
    },
    answer: "D",
    solution: String.raw`Write the numerator and denominator in polar form:
\[
1+i\sqrt3=2\operatorname{cis}\left(\frac\pi3\right),
\qquad
1-i=\sqrt2\operatorname{cis}\left(-\frac\pi4\right).
\]
Therefore
\[
z=\sqrt2\operatorname{cis}\left(\frac{7\pi}{12}\right).
\]
By De Moivre's Theorem,
\[
z^6=(\sqrt2)^6\operatorname{cis}\left(\frac{7\pi}{2}\right)
=8\operatorname{cis}\left(\frac{3\pi}{2}\right)
=\boxed{-8i}.
\]`,
  },
  {
    id: "CH-0015",
    division: "Theta",
    topic: "Counting",
    difficulty: 5,
    question: String.raw`How many five-digit palindromes are divisible by \(9\)?`,
    choices: {
      A: String.raw`\(81\)`,
      B: String.raw`\(90\)`,
      C: String.raw`\(99\)`,
      D: String.raw`\(100\)`,
      E: String.raw`\(110\)`,
    },
    answer: "D",
    solution: String.raw`Every five-digit palindrome has the form \(\overline{abcba}\), where \(a\in\{1,\ldots,9\}\) and \(b,c\in\{0,\ldots,9\}\). Divisibility by \(9\) requires
\[
2a+2b+c\equiv0\pmod9.
\]
For each of the \(90\) choices of \((a,b)\), there is normally one digit \(c\) with the required residue. There is a second choice precisely when that residue is \(0\), because then both \(c=0\) and \(c=9\) work. This occurs when \(a+b\equiv0\pmod9\). There are eight pairs \((1,8),\ldots,(8,1)\), plus \((9,0)\) and \((9,9)\), for \(10\) extra choices. Thus the total is
\[
90+10=\boxed{100}.
\]`,
  },
  {
    id: "CH-0016",
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    question: String.raw`Evaluate
\[
\int_0^\infty\frac{dx}{x^2+6x+13}.
\]`,
    choices: {
      A: String.raw`\(\tan^{-1}\!\left(\frac23\right)\)`,
      B: String.raw`\(\frac12\tan^{-1}\!\left(\frac23\right)\)`,
      C: String.raw`\(\frac12\tan^{-1}\!\left(\frac32\right)\)`,
      D: String.raw`\(\frac\pi4\)`,
      E: String.raw`\(\frac\pi2-\frac12\tan^{-1}\!\left(\frac23\right)\)`,
    },
    answer: "B",
    solution: String.raw`Complete the square in the denominator:
\[
x^2+6x+13=(x+3)^2+4.
\]
Thus
\[
\int_0^\infty\frac{dx}{(x+3)^2+2^2}
=\frac12\left[\tan^{-1}\left(\frac{x+3}{2}\right)\right]_0^\infty
=\frac12\left(\frac\pi2-\tan^{-1}\frac32\right).
\]
The positive angles \(\tan^{-1}(3/2)\) and \(\tan^{-1}(2/3)\) are complementary, so the value is
\[
\boxed{\frac12\tan^{-1}\left(\frac23\right)}.
\]`,
  },
  {
    id: "CH-0017",
    division: "Alpha",
    topic: "Trigonometric Equations",
    difficulty: 4,
    question: String.raw`How many solutions does
\[
\sin(3x)=\sin x
\]
have on the interval \(0\le x<2\pi\)?`,
    choices: {
      A: String.raw`\(4\)`,
      B: String.raw`\(5\)`,
      C: String.raw`\(6\)`,
      D: String.raw`\(7\)`,
      E: String.raw`\(8\)`,
    },
    answer: "C",
    solution: String.raw`Move all terms to one side and use the difference identity:
\[
\sin(3x)-\sin x=2\cos(2x)\sin x=0.
\]
The equation \(\sin x=0\) gives \(x=0,\pi\), contributing two solutions. The equation \(\cos(2x)=0\) gives
\[
x=\frac\pi4+\frac{k\pi}{2},
\]
which contributes \(\frac\pi4,\frac{3\pi}4,\frac{5\pi}4,\frac{7\pi}4\), four more solutions. These sets do not overlap, so there are \(2+4=\boxed{6}\) solutions.`,
  },
  {
    id: "CH-0018",
    division: "Theta",
    topic: "Polynomials",
    difficulty: 5,
    question: String.raw`The roots of
\[
x^3-3x+1=0
\]
are \(a,b,c\). Compute \((a^2+1)(b^2+1)(c^2+1)\).`,
    choices: {
      A: String.raw`\(9\)`,
      B: String.raw`\(13\)`,
      C: String.raw`\(17\)`,
      D: String.raw`\(21\)`,
      E: String.raw`\(25\)`,
    },
    answer: "C",
    solution: String.raw`Let \(P(x)=x^3-3x+1=(x-a)(x-b)(x-c)\). For each root \(r\),
\[
(i-r)(-i-r)=r^2+1.
\]
Multiplying this identity for \(r=a,b,c\) gives
\[
(a^2+1)(b^2+1)(c^2+1)=P(i)P(-i).
\]
Now
\[
P(i)=i^3-3i+1=1-4i,
\qquad
P(-i)=1+4i.
\]
Therefore the requested product is
\[
(1-4i)(1+4i)=1+16=\boxed{17}.
\]`,
  },
  {
    id: "CH-0019",
    division: "Mu",
    topic: "Derivatives",
    difficulty: 4,
    question: String.raw`Suppose \(f\) is twice differentiable and
\[
f(1)=2,\qquad f'(1)=-1,\qquad f''(1)=3.
\]
If \(g(x)=x^2f(1/x)\), what is \(g''(1)\)?`,
    choices: {
      A: String.raw`\(3\)`,
      B: String.raw`\(5\)`,
      C: String.raw`\(7\)`,
      D: String.raw`\(9\)`,
      E: String.raw`\(11\)`,
    },
    answer: "D",
    solution: String.raw`Let \(u=1/x\). Differentiating once gives
\[
g'(x)=2xf(u)-f'(u).
\]
Differentiate again, remembering that \(u'=-1/x^2\):
\[
g''(x)=2f(u)-\frac{2}{x}f'(u)+\frac{1}{x^2}f''(u).
\]
At \(x=1\), we also have \(u=1\), so
\[
g''(1)=2f(1)-2f'(1)+f''(1)
=2(2)-2(-1)+3
=\boxed{9}.
\]`,
  },
  {
    id: "CH-0020",
    division: "Alpha",
    topic: "Logarithms",
    difficulty: 5,
    question: String.raw`The equation
\[
\log_2x+\log_x2=\frac52
\]
has two positive real solutions. What is their product?`,
    choices: {
      A: String.raw`\(2\sqrt2\)`,
      B: String.raw`\(4\)`,
      C: String.raw`\(2+\sqrt2\)`,
      D: String.raw`\(4\sqrt2\)`,
      E: String.raw`\(8\)`,
    },
    answer: "D",
    solution: String.raw`Let \(u=\log_2x\). By the reciprocal identity, \(\log_x2=1/u\). The equation becomes
\[
u+\frac1u=\frac52
\quad\Longrightarrow\quad
2u^2-5u+2=0.
\]
Thus \(u=2\) or \(u=\frac12\), giving \(x=4\) or \(x=\sqrt2\). Both satisfy the logarithm domain restrictions. Their product is
\[
4\cdot\sqrt2=\boxed{4\sqrt2}.
\]`,
  },
  {
    id: "CH-0021",
    division: "Theta",
    topic: "Combinatorics",
    difficulty: 5,
    question: String.raw`How many subsets of \(\{1,2,\ldots,10\}\) contain no two consecutive integers?`,
    choices: {
      A: String.raw`\(89\)`,
      B: String.raw`\(120\)`,
      C: String.raw`\(132\)`,
      D: String.raw`\(144\)`,
      E: String.raw`\(155\)`,
    },
    answer: "D",
    solution: String.raw`Let \(A_n\) be the number of valid subsets of \(\{1,2,\ldots,n\}\). A valid subset either omits \(n\), leaving any of the \(A_{n-1}\) valid subsets, or includes \(n\), which forces it to omit \(n-1\) and leaves any of the \(A_{n-2}\) valid subsets. Hence
\[
A_n=A_{n-1}+A_{n-2}.
\]
The initial values are \(A_0=1\) and \(A_1=2\). Continuing the recurrence gives
\[
1,2,3,5,8,13,21,34,55,89,144.
\]
Therefore \(A_{10}=\boxed{144}\).`,
  },
] as const satisfies readonly ChallengeQuestion[];

function buildChallengeQuestionMap(
  questions: readonly ChallengeQuestion[]
) {
  const questionMap = new Map<
    ChallengeQuestionId,
    ChallengeQuestion
  >();

  for (const question of questions) {
    if (questionMap.has(question.id)) {
      throw new Error(
        `Duplicate Challenge question ID: ${question.id}`
      );
    }

    questionMap.set(question.id, question);
  }

  return questionMap;
}

const challengeQuestionById = buildChallengeQuestionMap(
  challengeQuestions
);

export function getChallengeQuestionById(
  id: ChallengeQuestionId
): ChallengeQuestion | null {
  return challengeQuestionById.get(id) ?? null;
}

export function requireChallengeQuestionById(
  id: ChallengeQuestionId
): ChallengeQuestion {
  const question = getChallengeQuestionById(id);

  if (!question) {
    throw new Error(`Challenge question not found: ${id}`);
  }

  return question;
}
