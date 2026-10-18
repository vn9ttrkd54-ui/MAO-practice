import type { Question } from "@/types/question";

const kingFebruaryStatewide2025 = {
  competition: "2025 February King Statewide",
  event: "Calculus Individual",
};

const kingFebruaryStatewide2025Graph = {
  src: "/questions/mu-442-444-original.svg",
  alt: "Vector f graph on [-1/2,15/2]: zero to x=0; line to (1,1); upper unit quarter circle to (2,0); line to (3,-1); horizontal to (4,-1); line to (5,0); upper unit semicircle centered at (6,0) to (7,0); then zero.",
  width: 290, height: 153,
};

const januaryRegional2025 = {
  competition: "2025 January Regional",
  event: "Calculus Individual",
};

const chilesStatewide2025 = {
  competition: "2025 Chiles Statewide",
  event: "Calculus Individual",
};

const chilesStatewide2025Table = {
  src: "/questions/mu-360-362-original.svg",
  alt: "Columns x=-1,0,1,2. f(x)=3,1,7,-1; f prime(x)=5,4,-3,0; g(x)=-8,6,2,4; g prime(x)=6,0,3,1.",
  width: 906, height: 161,
};

const kingFebruary2026 = {
  competition: "2026 February King Invitational",
  event: "Calculus Individual",
};

const februaryRegional2026 = {
  competition: "2026 February Regional",
  event: "Calculus Individual",
};

const januaryRegional2026 = {
  competition: "2026 January Regional",
  event: "Calculus Individual",
};

const januaryStatewide2026 = {
  competition: "2026 January Statewide",
  event: "Calculus Individual",
};

const stateConvention2026 = {
  competition: "2026 FAMAT State Convention",
  event: "Calculus Individual",
};

const stateConvention2025 = {
  competition: "2025 FAMAT State Convention",
  event: "Calculus Individual",
};

const stateConvention2024 = {
  competition: "2024 FAMAT State Convention",
  event: "Calculus Individual",
};

const marchRegional2026 = {
  competition: "2026 March Regional",
  event: "Calculus Individual",
};

const marchRegional2026Table = {
  src: "/questions/mu-336-338-original.svg",
  alt: "At x=1, p=2, p prime=1, p double prime=1; at x=2, p=1, p prime=4, p double prime=-1; at x=3, p=4, p prime=3, p double prime=2.",
  width: 607, height: 155,
};

// National sets are withheld in data/question-references/muNationals.ts pending permission.
// Use those offline records to calibrate labels; never import them into the app.
// Stable IDs preserve saved progress; public numbers are consecutive.

export const muQuestions: Question[] = [
  // 2026 FAMAT State Convention Calculus Individual Test.
  // Preserve the prior exclusion of original 26 and corrected answer for 29.
  // The supplied PDF does not include the prior dispute record for original 26.
  {
    id: 10119,
    source: { ...stateConvention2026, questionNumber: 1 },
    number: 1,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Trigonometric Identities"],
    question: String.raw`Compute
\[\left.\frac{d}{dx}\left(\frac{\sin^2x-\cos^2x}{\cos^2x+\sin^2x}\right)\right|_{x=1}.\]`,
    choices: ["0", String.raw`\(2\sin2\)`, String.raw`\(-2\sin2\)`, String.raw`\(\sin2\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Since \(\sin^2x+\cos^2x=1\) and \(\cos^2x-\sin^2x=\cos(2x)\), the expression is \(-\cos(2x)\). Therefore
\[\left.\frac d{dx}[-\cos(2x)]\right|_{x=1}=2\sin2.\]`,
  },
  {
    id: 10120,
    source: { ...stateConvention2026, questionNumber: 2 },
    number: 2,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: [],
    question: String.raw`The equation of the line tangent to the graph of \(y=\frac1x\) at the point \(x=1\) is of the form \(Ax+By=C\), where \(A,B,C\) are integers and the greatest common divisor of \(A\) and \(B\) is 1. Find \(AB+BC\).`,
    choices: ["−1", "1", "3", "2", "NOTA"],
    answer: "C",
    solution: String.raw`Since \(y'=-1/x^2\), the slope at \(x=1\) is \(-1\). The tangent line is
\[y-1=-(x-1),\qquad x+y=2.\]
Thus \(A=B=1\), \(C=2\), and \(AB+BC=1+2=3\).`,
  },
  {
    id: 10121,
    source: { ...stateConvention2026, questionNumber: 3 },
    number: 3,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 1,
    methods: [],
    question: String.raw`Consider the function \(f(x)=1-|\cos x|\). Which of the following statements are true?

I. \(f(x)\) is continuous everywhere.

II. \(f(x)\) is nowhere differentiable.

III. \(f(x)\) is non-differentiable at an infinite number of points.`,
    choices: ["I only", "I, II only", "I, III only", "III only", "NOTA"],
    answer: "C",
    solution: String.raw`Because \(\cos x\) is continuous everywhere and taking an absolute value preserves continuity, \(|\cos x|\), and therefore \(f(x)=1-|\cos x|\), is continuous everywhere. Thus statement I is true.

On any interval where \(\cos x>0\), we have \(f(x)=1-\cos x\), and where \(\cos x<0\), we have \(f(x)=1+\cos x\). Both expressions are differentiable, so statement II is false.

The possible failures of differentiability occur where \(\cos x=0\), namely
\[x=\frac{(2k+1)\pi}{2},\qquad k\in\mathbb Z.\]
At each such point, the sign of \(\cos x\) changes, so the two formulas above meet in a corner and the one-sided derivatives are unequal. There are infinitely many such points, making statement III true. Therefore I and III only are true.`,
  },
  {
    id: 10122,
    source: { ...stateConvention2026, questionNumber: 4 },
    number: 4,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Series"],
    question: String.raw`Let \(f(x)=(-2+x)(1-x^3)(1+x^6)\). Find \(f'(0)\).`,
    choices: ["−2", "−1", "0", "1", "NOTA"],
    answer: "D",
    solution: String.raw`The value \(f'(0)\) is the coefficient of \(x\) in the Maclaurin expansion of \(f(x)\). The factors \(1-x^3\) and \(1+x^6\) have constant term 1 and contain no linear term. Therefore the only linear term in
\[(-2+x)(1-x^3)(1+x^6)\]
comes from choosing \(x\) from the first factor and the constant term from each of the other two factors. Its coefficient is \(1\), so \(f'(0)=1\).`,
  },
  {
    id: 10123,
    source: { ...stateConvention2026, questionNumber: 5 },
    number: 5,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["L'Hopital's Rule"],
    question: String.raw`Compute
\[\lim_{x\to\pi/4}\frac{1}{x^2-\pi^2/16}\int_2^{\sec^2x}\cos(t^2)\,dt.\]`,
    choices: [String.raw`\(\frac8\pi\cos4\)`, String.raw`\(\frac2\pi\cos4\)`, String.raw`\(\frac2\pi\cos\left(\frac14\right)\)`, String.raw`\(4\cos4\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Both numerator and denominator approach 0. By the Fundamental Theorem of Calculus and the chain rule,
\[\frac d{dx}\int_2^{\sec^2x}\cos(t^2)dt=2\sec^2x\tan x\cos(\sec^4x).\]
L'Hopital's Rule gives
\[\lim_{x\to\pi/4}\frac{2\sec^2x\tan x\cos(\sec^4x)}{2x}
=\frac{4\cos4}{\pi/2}=\frac8\pi\cos4.\]`,
  },
  {
    id: 10124,
    source: { ...stateConvention2026, questionNumber: 6 },
    number: 6,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: [],
    question: String.raw`It is known that
\[\sum_{n=0}^{\infty}a_nx^n=xe^{-x^2}\]
for all \(x\in\mathbb R\). Compute
\[\sum_{n=0}^{\infty}\frac{(-1)^na_n}{2^{2n}}.\]`,
    choices: [String.raw`\(-\frac14e^{1/16}\)`, String.raw`\(-\frac14e^{-1/16}\)`, String.raw`\(-\frac12e^{1/4}\)`, String.raw`\(-\frac12e^{-1/4}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The requested series is obtained by substituting \(x=-1/4\):
\[\sum_{n=0}^{\infty}a_n\left(-\frac14\right)^n
=\left(-\frac14\right)e^{-(-1/4)^2}
=-\frac14e^{-1/16}.\]`,
  },
  {
    id: 10125,
    source: { ...stateConvention2026, questionNumber: 7 },
    number: 7,
    division: "Mu",
    topic: "Polar",
    difficulty: 3,
    methods: ["Distance Formula"],
    question: String.raw`There is one bee that moves along line segments on an imaginary path. Initially located at the origin \((0,0)\), the bee moves northeast along the line \(y=x\) until it reaches the next intersection with the polar curve \(r=\cos\theta\), at which point it starts to move south to the point \(\left(\frac12,-\frac12\right)\). Finally, the bee returns to the origin along a line segment. What is the total distance traveled by the bee?`,
    choices: [String.raw`\(\sqrt2\)`, String.raw`\(2\sqrt2\)`, String.raw`\(\frac{\sqrt2}{2}\)`, String.raw`\(1+\sqrt2\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Since \(r=\cos\theta\), multiplying by \(r\) gives \(r^2=r\cos\theta\), which is equivalent to \(x^2+y^2=x\) using rectangular coordinates. The origin already lies on this circle, so the next intersection is intended.

The bee intersects the curve at the point \((a,a)\) such that \(2a^2=a\). Factoring, \(a(2a-1)=0\), and the nonzero solution is \(a=1/2\). The distance from the origin to \((1/2,1/2)\) is
\[\sqrt{(1/2)^2+(1/2)^2}=\frac1{\sqrt2}.\]
The distance from \((1/2,1/2)\) to \((1/2,-1/2)\) is 1. The final segment back to the origin again has length \(1/\sqrt2\). Therefore the total distance traveled is
\[\frac1{\sqrt2}+1+\frac1{\sqrt2}=1+\sqrt2.\]`,
  },
  {
    id: 10126,
    source: { ...stateConvention2026, questionNumber: 8 },
    number: 8,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: [],
    question: String.raw`Let \(A\subseteq\mathbb R\) be an interval. The characteristic function \(\chi_A:\mathbb R\to\mathbb R\) is defined as
\[\chi_A(x)=\begin{cases}1,&x\in A,\\0,&x\notin A.\end{cases}\]
Compute
\[\int_{-1}^{5}\left(\chi_{[0,2]}(x)-0.5\chi_{[1,3]}(x)+\chi_{[2,4]}(x)\right)dx.\]`,
    choices: ["−1", "3", "2", "0", "NOTA"],
    answer: "B",
    solution: String.raw`The integral of a characteristic function over a domain containing its interval is the interval's length. Therefore the value is
\[(2-0)-\frac12(3-1)+(4-2)=2-1+2=3.\]`,
  },
  {
    id: 10127,
    source: { ...stateConvention2026, questionNumber: 9 },
    number: 9,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: ["L'Hopital's Rule"],
    question: String.raw`Evaluate
\[\lim_{x\to0}\frac{1-\cos(3x)}{2x}.\]`,
    choices: [String.raw`\(\frac32\)`, String.raw`\(\frac94\)`, String.raw`\(\frac92\)`, "DNE", "NOTA"],
    answer: "E",
    solution: String.raw`Applying L'Hopital's Rule,
\[\lim_{x\to0}\frac{1-\cos(3x)}{2x}
=\lim_{x\to0}\frac{3\sin(3x)}2=0.\]
Since 0 is not listed, the answer is NOTA.`,
  },
  {
    id: 10128,
    source: { ...stateConvention2026, questionNumber: 10 },
    number: 10,
    division: "Mu",
    topic: "Parametric",
    difficulty: 4,
    methods: [],
    question: String.raw`The planar curve \(\alpha:\mathbb R\to\mathbb R^2\) defined as
\[\alpha(t)=(t^3-4t,t^2-4)\]
intersects itself at the point \((x,y)\). Find the sum of all possible \(x+y\).`,
    choices: ["0", "3", "2", "−6", "NOTA"],
    answer: "A",
    solution: String.raw`Suppose two distinct parameter values \(s\ne t\) produce the same point. Equality of the second coordinates gives
\[s^2-4=t^2-4,\]
so \(s^2=t^2\). Since \(s\ne t\), we must have \(s=-t\).

Now equate the first coordinates and substitute \(s=-t\):
\[s^3-4s=t^3-4t\]
\[-t^3+4t=t^3-4t,\]
so
\[2t^3-8t=2t(t^2-4)=0.\]
The solution \(t=0\) would give \(s=t\), which is not a self-intersection. Thus \(t=\pm2\), paired with \(s=\mp2\). Both parameter values produce
\[\alpha(2)=\alpha(-2)=(0,0).\]
Hence the only self-intersection point has \(x+y=0\).`,
  },
  {
    id: 10129,
    source: { ...stateConvention2026, questionNumber: 11 },
    number: 11,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    question: String.raw`Let \(a,b\in\mathbb R\) such that \(a<b\). A bump function is a function of the form
\[f_{a,b}(x)=\begin{cases}e^{1/((x-a)(x-b))},&a<x<b,\\0,&x\ge b\text{ or }x\le a.\end{cases}\]
Compute the absolute maximum of the bump function \(f_{1/2,3/2}(x)\).`,
    choices: [String.raw`\(e^{-4}\)`, String.raw`\(e^{-2}\)`, String.raw`\(e^{-4/3}\)`, String.raw`\(e^4\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Observe that in general, a function of the form \(e^{1/h(x)}\) has derivative
\[-\frac{h'(x)}{h(x)^2}e^{1/h(x)}.\]
Inside the interval, \(h(x)=(x-a)(x-b)\ne0\), so the derivative of the bump function is zero exactly where \(h'(x)=0\). Here \(h'(x)=2x-a-b\), giving \(x=(a+b)/2=1\).

For \(a=1/2\), \(b=3/2\), we have \(h'(x)=2x-2\). The factor \(e^{1/h(x)}/h(x)^2\) is positive, so the bump function increases when \(x<1\) and decreases when \(x>1\). The quadratic \(h\) itself has a minimum at 1, but the bump function has a maximum there. The function is 0 at and outside the endpoints, while
\[f_{1/2,3/2}(1)=e^{1/((1/2)(-1/2))}=e^{-4}.\]
Thus the absolute maximum is \(e^{-4}\).`,
  },
  {
    id: 10130,
    source: { ...stateConvention2026, questionNumber: 12 },
    number: 12,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`Luster is pouring salt into a glass jar that has the shape of a solid with height \(h\) cm and whose volume is given by \(V(h)=\frac5{18}\pi h^{3/2}\) cm\(^3\). Luster's rate of pouring salt is not constant, as he sometimes gets distracted, as is modeled by the volume rate \(r(t)=e^{-t}\) cm\(^3\) per minute, where \(t\) is measured in minutes. After two minutes, the height of the salt in the glass jar is 4 cm. How rapidly is the height increasing at that moment?`,
    choices: [String.raw`\(\frac5{6\pi e}\)`, String.raw`\(\frac5{6\pi e^2}\)`, String.raw`\(\frac6{5\pi e}\)`, String.raw`\(\frac6{5\pi e^2}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Differentiate volume with respect to time:
\[\frac{dV}{dt}=\frac5{12}\pi\sqrt h\,\frac{dh}{dt}.\]
At \(t=2\), \(dV/dt=e^{-2}\) and \(h=4\), so
\[e^{-2}=\frac{5\pi}{6}\frac{dh}{dt},\qquad \frac{dh}{dt}=\frac6{5\pi e^2}.\]`,
  },
  {
    id: 10131,
    source: { ...stateConvention2026, questionNumber: 13 },
    number: 13,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["Trigonometric Identities"],
    question: String.raw`An inner product on a vector space of continuous functions on the interval \([-\pi,\pi]\) is defined as
\[\langle f,g\rangle=\int_{-\pi}^{\pi}f(x)g(x)\,dx.\]
Compute \(\langle\sin2x,\sin3x\rangle+\langle\sin3x,\cos4x\rangle-\langle\sin4x,\sin4x\rangle\).`,
    choices: [String.raw`\(-2\pi\)`, String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Recall that distinct positive integer-frequency sine functions are orthogonal on \([-\pi,\pi]\), as are sine and cosine functions. In the present expression, this can be seen directly from product-to-sum identities:
\[\sin2x\sin3x=\frac12(\cos x-\cos5x).\]
Each cosine term has integral 0 over \([-\pi,\pi]\), since its antiderivative is a constant multiple of a sine that vanishes at both endpoints. Thus \(\langle\sin2x,\sin3x\rangle=0\).

The product \(\sin3x\cos4x\) is odd, so its integral over this symmetric interval is also 0. Finally, the double-angle identity gives
\[\int_{-\pi}^{\pi}\sin^2(4x)\,dx
=\frac12\int_{-\pi}^{\pi}(1-\cos8x)\,dx=\pi.\]
Therefore,
\[\langle\sin2x,\sin3x\rangle+\langle\sin3x,\cos4x\rangle-\langle\sin4x,\sin4x\rangle
=0+0-\pi=-\pi.\]`,
  },
  {
    id: 10132,
    source: { ...stateConvention2026, questionNumber: 14 },
    number: 14,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 2,
    methods: ["First Derivative Test", "Second Derivative Test"],
    question: String.raw`The derivative \(f'(x)\) of a function \(y=f(x)\) is given by
\[f'(x)=\frac{x}{1+x^2}.\]
The interval where \(f(x)\) is both concave up and increasing is \([N,M]\) for integers \(N\) and \(M\). Find \(N+M\).`,
    choices: ["−1", "1", "0", "2", "NOTA"],
    answer: "B",
    solution: String.raw`The function is increasing where \(f'(x)\ge0\), namely \([0,\infty)\). Also
\[f''(x)=\frac{1-x^2}{(1+x^2)^2},\]
so it is concave up on \([-1,1]\). The common interval is \([0,1]\), giving \(N+M=1\).`,
  },
  {
    id: 10133,
    source: { ...stateConvention2026, questionNumber: 15 },
    number: 15,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: [],
    question: String.raw`Suppose \(f(x)=x^3-x^2+x\). Compute \(\frac d{dx}(f^{-1}(x))\) at \(x=6\).`,
    choices: [String.raw`\(\frac19\)`, String.raw`\(\frac15\)`, String.raw`\(\frac1{11}\)`, String.raw`\(-\frac19\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Since \(f(2)=8-4+2=6\), we have \(f^{-1}(6)=2\). By the inverse-function derivative formula,
\[(f^{-1})'(6)=\frac1{f'(2)}=\frac1{3(2)^2-2(2)+1}=\frac19.\]`,
  },
  {
    id: 10134,
    source: { ...stateConvention2026, questionNumber: 16 },
    number: 16,
    division: "Mu",
    topic: "Series",
    difficulty: 4,
    methods: [],
    question: String.raw`The function \(f_n:\mathbb R\to\mathbb R\) is defined as
\[f_n(x)=\begin{cases}1,&\frac1{2n}<x\le\frac1{2n-1},\\0,&\text{otherwise}.\end{cases}\]
Compute
\[\sum_{n=1}^{\infty}\int_0^1f_n(x)\,dx.\]`,
    choices: ["1", String.raw`\(\ln2\)`, String.raw`\(\infty\)`, String.raw`\(-\ln2\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Each integral is the length of the interval on which \(f_n=1\):
\[\int_0^1f_n(x)dx=\frac1{2n-1}-\frac1{2n}.\]
Therefore
\[\sum_{n=1}^{\infty}\left(\frac1{2n-1}-\frac1{2n}\right)
=1-\frac12+\frac13-\frac14+\cdots=\ln2.\]`,
  },
  {
    id: 10135,
    source: { ...stateConvention2026, questionNumber: 17 },
    number: 17,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: ["First Derivative Test", "Second Derivative Test"],
    question: String.raw`Let \(n\) be the number of critical points, \(m\) be the number of discontinuities, and \(s\) be the number of inflection points of the function
\[f(x)=\frac{-1}{3+2x^2}.\]
Find \(n^m+m^n+n^s\).`,
    choices: ["2", "3", "4", "5", "NOTA"],
    answer: "A",
    solution: String.raw`We have
\[f'(x)=\frac{4x}{(3+2x^2)^2},\qquad
f''(x)=\frac{12(1-2x^2)}{(3+2x^2)^3}.\]
Thus there is one critical point, no discontinuity, and two inflection points: \(n=1,m=0,s=2\). Hence
\[n^m+m^n+n^s=1^0+0^1+1^2=2.\]`,
  },
  {
    id: 10136,
    source: { ...stateConvention2026, questionNumber: 18 },
    number: 18,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate
\[\int_0^1\frac{d(x^2)}{1+x^2}.\]`,
    choices: [String.raw`\(\frac\pi4\)`, String.raw`\(\ln2\)`, String.raw`\(\frac\pi2\)`, String.raw`\(\infty\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let \(u=x^2\), so \(du=d(x^2)\). Then
\[\int_0^1\frac{d(x^2)}{1+x^2}=\int_0^1\frac{du}{1+u}=\ln(1+u)\bigg|_0^1=\ln2.\]`,
  },
  {
    id: 10137,
    source: { ...stateConvention2026, questionNumber: 19 },
    number: 19,
    division: "Mu",
    topic: "Series",
    difficulty: 4,
    methods: ["Limit Comparison Test", "Alternating Series Test"],
    question: String.raw`Consider the following numerical series:
\[(a)\quad\sum_{n=2}^{\infty}\frac{n^2}{\sqrt{1+n^5}},\]
\[(b)\quad\sum_{n=2}^{\infty}(-1)^n\frac{n^2-1}{n^3+1},\]
\[(c)\quad\sum_{n=1}^{\infty}(-1)^n\left(1-\cos\left(\frac1n\right)\right).\]
If the series in \((x)\) is absolutely convergent, assign 1 to letter \((x)\). If the series in \((x)\) converges conditionally (i.e. converges, but does not converge absolutely), assign \(-1\) to letter \((x)\). Otherwise (that is, if the series diverges), assign 0 to letter \((x)\). Find \((a)+(b)+(c)\).`,
    choices: ["2", "1", "0", "−2", "NOTA"],
    answer: "C",
    solution: String.raw`For (a), compare the terms with \(1/\sqrt n\):
\[\lim_{n\to\infty}\frac{n^2/\sqrt{1+n^5}}{1/\sqrt n}
=\lim_{n\to\infty}\frac{n^{5/2}}{\sqrt{1+n^5}}=1.\]
Since \(\sum 1/\sqrt n\) diverges, the Limit Comparison Test shows that (a) diverges, so it contributes 0.

For (b),
\[\frac{n^2-1}{n^3+1}=\frac{(n-1)(n+1)}{(n+1)(n^2-n+1)}=\frac{n-1}{n^2-n+1}.\]
These positive magnitudes approach 0 and are eventually decreasing, so the Alternating Series Test gives convergence. Their ratio to \(1/n\) approaches 1, so the corresponding absolute-value series diverges by limit comparison with the harmonic series. Thus (b) converges conditionally and contributes \(-1\).

To justify monotonicity explicitly, extend the magnitude to \(b(x)=(x-1)/(x^2-x+1)\). Its derivative is
\[b'(x)=\frac{x(2-x)}{(x^2-x+1)^2}\le0\qquad(x\ge2),\]
and \(b(x)\to0\). These are exactly the hypotheses required by the Alternating Series Test.

For (c), use the standard limit
\[\lim_{u\to0}\frac{1-\cos u}{u^2}=\frac12.\]
With \(u=1/n\), this gives
\[1-\cos(1/n)\sim\frac1{2n^2}.\]
Therefore the absolute-value series converges by comparison with \(\sum 1/n^2\), so (c) converges absolutely and contributes 1. The requested total is
\[0+(-1)+1=0.\]`,
  },
  {
    id: 10138,
    source: { ...stateConvention2026, questionNumber: 20 },
    number: 20,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["Distance Formula", "First Derivative Test", "Second Derivative Test"],
    question: String.raw`Let \((a,b)\) be the closest point on the curve \(y=\ln x\) to the point \((2,0)\). Find
\[\frac{\ln a}{a}+a.\]`,
    choices: ["3", String.raw`\(e\)`, "2", "1", "NOTA"],
    answer: "C",
    solution: String.raw`A point on the curve has coordinates \((x,\ln x)\), where \(x>0\). Its squared distance from \((2,0)\) is
\[D^2(x)=(x-2)^2+(\ln x)^2.\]
Minimizing \(D^2\) is equivalent to minimizing the distance. Differentiate:
\[(D^2)'(x)=2(x-2)+\frac{2\ln x}{x}.\]
At the closest point \((a,b)\), we must have
\[0=2(a-2)+\frac{2\ln a}{a},\]
and hence
\[a+\frac{\ln a}{a}=2.\]
There is no need to solve for \(a\) explicitly. To verify that such a minimum exists, note that \(D^2(x)\to\infty\) as \(x\to0^+\) or \(x\to\infty\), so the continuous function attains an interior global minimum. To check the second derivative there,
\[(D^2)''(x)=2+\frac{2(1-\ln x)}{x^2},\]
and the critical-point equation gives \(\ln a=2a-a^2\). Substituting,
\[(D^2)''(a)=2+\frac{2(1-2a+a^2)}{a^2}
=4+\frac2{a^2}-\frac4a
=2+2\left(\frac1a-1\right)^2>0.\]
Thus every critical point is a strict local minimum, and in particular the closest point must satisfy the equation already derived. Therefore the requested value is 2. Notice that \(a=1\) is not a solution: \(1+\ln(1)/1=1\), not 2.`,
  },
  {
    id: 10139,
    source: { ...stateConvention2026, questionNumber: 21 },
    number: 21,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 4,
    methods: [],
    question: String.raw`The symbol \(\{x\}\) is the fractional part of the real number \(x\), defined by \(\{x\}=x-\lfloor x\rfloor\). Compute
\[\left.\frac d{dx}\left(x\lfloor x\rfloor\{x\}\right)\right|_{x=26/25}.\]`,
    choices: [String.raw`\(\frac{24}{25}\)`, "1", String.raw`\(\frac{26}{25}\)`, String.raw`\(\frac{27}{25}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`On \((1,2)\), \(\lfloor x\rfloor=1\) and \(\{x\}=x-1\). Thus
\[x\lfloor x\rfloor\{x\}=x(x-1)=x^2-x,\]
whose derivative at \(x=26/25\) is
\[2\left(\frac{26}{25}\right)-1=\frac{27}{25}.\]`,
  },
  {
    id: 10140,
    source: { ...stateConvention2026, questionNumber: 22 },
    number: 22,
    division: "Mu",
    topic: "Polar",
    difficulty: 4,
    methods: [],
    question: String.raw`Compute the arc length of the polar curve \(r=\max(\sin\theta,\cos\theta)\) on the interval \(0\le\theta\le\pi\).`,
    choices: [String.raw`\(\pi\)`, String.raw`\(\frac{7\pi}{8}\)`, String.raw`\(2\pi\)`, String.raw`\(\frac\pi2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`First determine which expression is larger. Since \(\cos\theta\ge\sin\theta\) on \([0,\pi/4]\), and \(\sin\theta\ge\cos\theta\) on \([\pi/4,\pi]\),
\[r=\begin{cases}
\cos\theta,&0\le\theta\le\pi/4,\\
\sin\theta,&\pi/4\le\theta\le\pi.
\end{cases}\]
The polar arc-length formula is
\[L=\int\sqrt{r^2+\left(\frac{dr}{d\theta}\right)^2}\,d\theta.\]
For \(r=\cos\theta\), the integrand is
\[\sqrt{\cos^2\theta+(-\sin\theta)^2}=1,\]
and for \(r=\sin\theta\), it is
\[\sqrt{\sin^2\theta+\cos^2\theta}=1.\]
Therefore
\[L=\int_0^{\pi/4}1\,d\theta+\int_{\pi/4}^{\pi}1\,d\theta
=\frac\pi4+\frac{3\pi}4=\pi.\]`,
  },
  {
    id: 10141,
    source: { ...stateConvention2026, questionNumber: 23 },
    number: 23,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`Let \(A\) be the x-intercept and \(B\) be the y-intercept of the tangent line to the curve \(x^2+y^3=y\) at the point \(\left(\frac{\sqrt6}{4},\frac12\right)\). Find \(\frac BA\).`,
    choices: [String.raw`\(-\sqrt6\)`, String.raw`\(-3\sqrt6\)`, String.raw`\(-2\sqrt6\)`, String.raw`\(-2\sqrt5\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Implicit differentiation gives
\[2x+3y^2y'=y',\qquad y'=\frac{2x}{1-3y^2}.\]
At the given point, \(y'=2\sqrt6\), so the tangent line is
\[y=2\sqrt6x-\frac52.\]
Hence \(B=-5/2\), while setting \(y=0\) gives \(A=5\sqrt6/24\). Therefore
\[\frac BA=\frac{-5/2}{5\sqrt6/24}=-2\sqrt6.\]`,
  },
  {
    id: 10142,
    source: { ...stateConvention2026, questionNumber: 24 },
    number: 24,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Power Series"],
    question: String.raw`Evaluate
\[\int_0^1\lfloor\log_2x\rfloor\,dx.\]`,
    choices: ["−2", String.raw`\(-\frac1{\ln2}\)`, "2", "divergent", "NOTA"],
    answer: "A",
    solution: String.raw`The integral is improper because \(\log_2x\to-\infty\) as \(x\to0^+\). Partition \((0,1]\) into the intervals
\[\left[2^{-(n+1)},2^{-n}\right),\qquad n=0,1,2,\ldots.\]
On each such interval,
\[-(n+1)\le\log_2x<-n,\]
so \(\lfloor\log_2x\rfloor=-(n+1)\). The interval has length
\[2^{-n}-2^{-(n+1)}=2^{-(n+1)}.\]
Therefore
\[\int_0^1\lfloor\log_2x\rfloor\,dx
=-\sum_{n=0}^{\infty}(n+1)\left(2^{-n}-2^{-(n+1)}\right)
=-\sum_{n=0}^{\infty}\frac{n+1}{2^{n+1}}.\]
Using \(\sum_{n=0}^{\infty}(n+1)r^n=1/(1-r)^2\) with \(r=1/2\),
\[\sum_{n=0}^{\infty}\frac{n+1}{2^{n+1}}
=\frac12\cdot\frac1{(1-1/2)^2}=2.\]
Hence the improper integral converges to \(-2\).`,
  },
  {
    id: 10143,
    source: { ...stateConvention2026, questionNumber: 25 },
    number: 25,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: [],
    question: String.raw`An inverted conical tank with diameter equal to its height is leaking oil directly into a big cylindrical tank of height 20 inches and diameter 8 inches. Suppose the conical tank initially contains 5 gallons of oil and all leaked oil enters the cylindrical tank at a constant rate of \(\frac23\) gallons per half an hour. If the cylindrical container was initially empty, how rapidly (in inches per hour) is its level increasing when there is exactly one gallon of oil in there? Note: \(1\text{ gal}=231\text{ in}^3\).`,
    choices: [String.raw`\(\frac{77}{8\pi}\)`, String.raw`\(\frac{77}{4\pi}\)`, String.raw`\(\frac{231}{8\pi}\)`, String.raw`\(\frac{231}{4\pi}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Oil enters the cylinder at
\[\frac43\text{ gal/hr}=\frac43(231)=308\text{ in}^3/\text{hr}.\]
The cylinder has radius 4, so \(V=16\pi h\). Hence
\[16\pi\frac{dh}{dt}=308,\qquad \frac{dh}{dt}=\frac{77}{4\pi}.\]
The height rate has units inches per hour, not cubic inches per hour; the latter describes the volume rate. The stated one-gallon moment does not change this constant rate. It is feasible: the cylinder's capacity is \(320\pi\) cubic inches, exceeding 231 cubic inches, and the source tank still has oil then.`,
  },
  {
    id: 10144,
    source: { ...stateConvention2026, questionNumber: 27 },
    number: 26,
    division: "Mu",
    topic: "Power Series",
    difficulty: 5,
    methods: ["Power Series"],
    question: String.raw`Find the sum of the following convergent series:
\[\sum_{n=1}^{\infty}\frac{(n+1)(-1)^n}{n!2^n}.\]`,
    choices: [String.raw`\(\frac1{2\sqrt e}\)`, String.raw`\(\frac1{2\sqrt e}-1\)`, String.raw`\(1-\frac1{2\sqrt e}\)`, String.raw`\(-\frac1{2\sqrt e}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Differentiate the series \(xe^{-x}=\sum_{n=0}^{\infty}(-1)^nx^{n+1}/n!\):
\[(1-x)e^{-x}=\sum_{n=0}^{\infty}\frac{(n+1)(-1)^nx^n}{n!}.\]
At \(x=1/2\), the full series equals \(1/(2\sqrt e)\). Removing its \(n=0\) term gives
\[\sum_{n=1}^{\infty}\frac{(n+1)(-1)^n}{n!2^n}=\frac1{2\sqrt e}-1.\]`,
  },
  {
    id: 10145,
    source: { ...stateConvention2026, questionNumber: 28 },
    number: 27,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["Cross Sections"],
    question: String.raw`A solid with a triangular base with vertices \((0,1)\), \((-2,0)\), and \((3,0)\) has rectangular cross-sections perpendicular to the y-axis with height twice as large as the width. Find the volume of the solid.`,
    choices: [String.raw`\(\frac{25}{54}\)`, String.raw`\(\frac{10}{3}\)`, "25", String.raw`\(\frac{50}{3}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let \(\ell(y)\) be the width of the triangular base at height \(y\). The line through \((0,1)\) and \((3,0)\) is
\[x=3-3y,\]
while the line through \((-2,0)\) and \((0,1)\) is
\[x=2y-2.\]
Thus the right and left boundaries at height \(y\) are \(g(y)=3-3y\) and \(f(y)=2y-2\), respectively, so
\[\ell(y)=g(y)-f(y)=(3-3y)-(2y-2)=5(1-y).\]
Each cross-section is a rectangle whose height is twice its width. Its height is therefore \(2\ell(y)=10(1-y)\), and its area is
\[A(y)=\ell(y)\cdot2\ell(y)=2[5(1-y)]^2=50(1-y)^2.\]
Integrating from the base \(y=0\) to the top \(y=1\) gives
\[V=\int_0^1 50(1-y)^2\,dy
=50\left[-\frac{(1-y)^3}{3}\right]_0^1
=\frac{50}{3}.\]`,
  },
  {
    id: 10146,
    source: { ...stateConvention2026, questionNumber: 29 },
    number: 28,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: ["Trigonometric Identities"],
    question: String.raw`In the figure below, all segment lengths are positive and \(b\) is held constant. Evaluate
\[\lim_{a\to b}\left(\frac{a-b}{c-d}\right).\]`,
    choices: [String.raw`\(\frac{\sqrt2}{2}\)`, String.raw`\(-\frac{\sqrt2}{2}\)`, String.raw`\(\sqrt2\)`, "1", "NOTA"],
    answer: "C",
    solution: String.raw`Let \(t=\tan\theta\). From the left and right triangles,
\[x=at,\qquad y=\frac bt,\qquad c=a\sqrt{1+t^2},\qquad d=\frac b{t}\sqrt{1+t^2}.\]

The line containing \(c\) makes direction angle \(\theta-\pi/2\) with the positive horizontal axis. Because the angle between \(c\) and the upper segment is also \(\theta\), the upper segment has direction angle \(2\theta-\pi/2\). Its slope can therefore be written in two ways:
\[\frac{b-a}{x+y}=\tan\left(2\theta-\frac\pi2\right)=\frac{t^2-1}{2t}.\]
Substituting \(x=at\) and \(y=b/t\) gives
\[\frac{b-a}{at+b/t}=\frac{t^2-1}{2t}.\]
After cross-multiplying and factoring,
\[2t^2(b-a)=(at^2+b)(t^2-1),\]
\[0=at^4+(a-b)t^2-b=(t^2+1)(at^2-b).\]
Since \(t^2+1\ne0\), we obtain
\[t^2=\frac ba.\]
Consequently,
\[c=a\sqrt{1+\frac ba}=\sqrt{a(a+b)},\qquad
d=\frac b{\sqrt{b/a}}\sqrt{1+\frac ba}=\sqrt{b(a+b)}.\]
Thus
\[\frac{a-b}{c-d}
=\frac{(\sqrt a-\sqrt b)(\sqrt a+\sqrt b)}{\sqrt{a+b}(\sqrt a-\sqrt b)}
=\frac{\sqrt a+\sqrt b}{\sqrt{a+b}},\]
and letting \(a\to b\) gives
\[\frac{2\sqrt b}{\sqrt{2b}}=\boxed{\sqrt2}.\]
The lengths \(x\) and \(y\) vary with \(a\); they cannot be held fixed while replacing \(\theta\) by \(\pi/4\). In fact \(x=at=\sqrt{ab}\) and \(y=b/t=\sqrt{ab}\), so the purported quotient \((x-y)/(\sqrt2(x-y))\) would be \(0/0\), not an evaluation of the limit. The rationalization above avoids that indeterminate substitution.`,
    illustration: {
      src: "/questions/mu-146-original.svg",
      alt: "Two adjacent right triangles with vertical sides a and b, bases x and y, diagonals c and d, and three angles labeled theta",
      width: 600,
      height: 390,
    },
  },
  {
    id: 10147,
    source: { ...stateConvention2026, questionNumber: 30 },
    number: 29,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 4,
    methods: [],
    question: String.raw`Find the number of points where \(f\) is non-differentiable:
\[f(x)=\sum_{n=0}^{2026}|x-n|.\]`,
    choices: ["2026", "2027", "1013", "4052", "NOTA"],
    answer: "B",
    solution: String.raw`Each term \(|x-n|\) has a corner at \(x=n\). At that point all other terms are differentiable, so their sum cannot remove the jump in slope. The distinct corner locations are
\[0,1,2,\ldots,2026,\]
for a total of \(2027\) non-differentiable points.`,
  },
  // 2025 FAMAT State Convention Calculus Individual Test (source confirmed by owner).
  // Public Mu 30-58; established IDs 10148-10176 remain unchanged.
  // Preserve the prior omission of original 17 (inconsistent physical units).
  // Original 19 retains the unrestricted-query interpretation and answer NOTA.
  {
    id: 10148,
    source: { ...stateConvention2025, questionNumber: 1 },
    number: 30,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Evaluate:
\[\lim_{x\to\sqrt{2025}}\sqrt{25}.\]`,
    choices: ["5", "25", "45", "2025", "NOTA"],
    answer: "A",
    solution: String.raw`The expression \(\sqrt{25}\) is the constant 5, so
\[\lim_{x\to\sqrt{2025}}\sqrt{25}=\lim_{x\to45}5=5.\]`,
  },
  {
    id: 10149,
    source: { ...stateConvention2025, questionNumber: 2 },
    number: 31,
    division: "Mu",
    topic: "Probability",
    difficulty: 2,
    methods: ["U-Substitution"],
    question: String.raw`Use the following information. Bob Beamon is competing in the Long Jump event at the 1968 Summer Olympics in Mexico City. According to some sportswriters, Bob's longest jump must be between \(x=26\) and \(x=28\) feet, with the probability density function for the length of this jump following the curve
\[y=\frac{k}{1+(x-27)^2}\]
in that range for some positive constant \(k\).

Find the value of \(k\). Hint: The area under a probability density function must be one.`,
    choices: [String.raw`\(\frac1\pi\)`, String.raw`\(\frac2\pi\)`, String.raw`\(\frac\pi4\)`, String.raw`\(\frac\pi2\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using the substitution \(u=x-27\),
\[\int_{26}^{28}\frac{k}{1+(x-27)^2}\,dx
=k\int_{-1}^{1}\frac{du}{1+u^2}
=k\,[\arctan u]_{-1}^{1}
=\frac{k\pi}{2}.\]
The area under a probability distribution is 1, so \(k\pi/2=1\), and therefore
\[k=\frac2\pi.\]`,
  },
  {
    id: 10150,
    source: { ...stateConvention2025, questionNumber: 3 },
    number: 32,
    division: "Mu",
    topic: "Probability",
    difficulty: 3,
    methods: [],
    question: String.raw`Use the following information. Bob Beamon is competing in the Long Jump event at the 1968 Summer Olympics in Mexico City. According to some sportswriters, Bob's longest jump must be between \(x=26\) and \(x=28\) feet, with the probability density function for the length of this jump following the curve
\[y=\frac{k}{1+(x-27)^2}\]
in that range for some positive constant \(k\).

Find the probability (rounded to the nearest tenth) that, according to the model, Bob's jump will be 29.2 feet or longer. Hint: The area under a range of values of a probability density function is the probability of an outcome in that range occurring.`,
    choices: ["0.1", "0.2", "0.3", "0.4", "NOTA"],
    answer: "E",
    solution: String.raw`The model states that \(x\) must be between 26 and 28. Therefore a jump of 29.2 feet or longer is outside the support of the probability density function and is impossible according to the model. Its probability is 0, which is not among choices A–D, so the answer is NOTA.`,
  },
  {
    id: 10151,
    source: { ...stateConvention2025, questionNumber: 4 },
    number: 33,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Rule"],
    question: String.raw`Find the slope of the tangent line to \(y=x^{20}+25x\) at \(x=-1\).`,
    choices: ["−20", "5", "20", "45", "NOTA"],
    answer: "B",
    solution: String.raw`Differentiate:
\[\frac{dy}{dx}=20x^{19}+25.\]
At \(x=-1\), this is
\[20(-1)^{19}+25=-20+25=5.\]`,
  },
  {
    id: 10152,
    source: { ...stateConvention2025, questionNumber: 5 },
    number: 34,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 3,
    methods: [],
    question: String.raw`\(f(x)\) is a monic cubic function with a local minimum at \((2,9)\) and an inflection point at \(x=1\). Find \(f(3)\).`,
    choices: ["13", "15", "17", "19", "NOTA"],
    answer: "A",
    solution: String.raw`Let
\[f(x)=x^3+bx^2+cx+d.\]
Since \((2,9)\) is on the graph,
\[8+4b+2c+d=9.\]
Also,
\[f'(x)=3x^2+2bx+c,\]
and the local minimum at \(x=2\) gives
\[12+4b+c=0.\]
Finally,
\[f''(x)=6x+2b,\]
and the inflection point at \(x=1\) gives \(6+2b=0\), so \(b=-3\). Working backward yields \(c=0\) and \(d=13\). Thus
\[f(x)=x^3-3x^2+13,\qquad f(3)=27-27+13=13.\]`,
  },
  {
    id: 10153,
    source: { ...stateConvention2025, questionNumber: 6 },
    number: 35,
    division: "Mu",
    topic: "Series",
    difficulty: 5,
    methods: ["Infinite Geometric Series"],
    question: String.raw`Find the nonzero \(-1<r<1\) such that
\[\sum_{n\text{ odd}}nr^n=2\left(\sum_{n\text{ even}}nr^n\right),\]
where \(n\) ranges over \(\mathbb N\).`,
    choices: [String.raw`\(3-2\sqrt2\)`, String.raw`\(2-\sqrt3\)`, String.raw`\(\sqrt2-1\)`, String.raw`\(\frac{\sqrt5-1}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let
\[S=2\sum_{k=1}^{\infty}(2k)r^{2k}-\sum_{k=1}^{\infty}(2k-1)r^{2k-1}.\]
The required equation is \(S=0\). Using
\[\sum_{k=1}^{\infty}kr^{2k}=\frac{r^2}{(1-r^2)^2},\]
we obtain
\[2\sum_{k=1}^{\infty}(2k)r^{2k}=\frac{4r^2}{(1-r^2)^2}.\]
For the odd terms,
\[\sum_{k=1}^{\infty}(2k-1)r^{2k-1}=\frac{r(1+r^2)}{(1-r^2)^2}.\]
Therefore
\[S=\frac{4r^2-r-r^3}{(1-r^2)^2}=0.\]
Since \(r\ne0\),
\[r^2-4r+1=0,\]
so \(r=2\pm\sqrt3\). The condition \(-1<r<1\) leaves
\[r=2-\sqrt3.\]

An elementary manipulation gives the same result. Let \(E=\sum_{k=1}^{\infty}2kr^{2k}\), \(O=\sum_{k=1}^{\infty}(2k-1)r^{2k-1}\), and let their required common value be \(S=2E=O\). Absolute convergence for \(|r|<1\) permits shifting and subtracting these sums. Matching powers gives
\[E-rO=\sum_{k=1}^{\infty}r^{2k}=\frac{r^2}{1-r^2},\]
so \(S/2-rS=r^2/(1-r^2)\). In particular \(r=1/2\) cannot satisfy the equation. Thus
\[S=\frac{2r^2}{(1-r^2)(1-2r)}.\]
Matching the odd powers instead gives
\[rE-O=-\sum_{k=1}^{\infty}r^{2k-1}=-\frac r{1-r^2},\]
so \(rS/2-S=-r/(1-r^2)\), or
\[S=\frac{2r}{(1-r^2)(2-r)}.\]
Equating the two expressions and using \(r\ne0\) again gives \(r(2-r)=1-2r\), or \(r^2-4r+1=0\). The allowed root is \(2-\sqrt3\).`,
  },
  {
    id: 10154,
    source: { ...stateConvention2025, questionNumber: 7 },
    number: 36,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule", "Trigonometric Identities"],
    question: String.raw`The graph of \(f(x)=-\ln(2+\cos x)\) has an inflection point for \(x\) in the range \([0,\pi]\). Find the slope of the tangent line to \(f(x)\) at this point.`,
    choices: [String.raw`\(\frac{4-\sqrt3}{13}\)`, String.raw`\(\frac{\sqrt3}{5}\)`, String.raw`\(\frac{4+\sqrt3}{13}\)`, String.raw`\(\frac{\sqrt3}{3}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`By the Chain Rule,
\[f'(x)=\frac{\sin x}{2+\cos x}.\]
Using the Quotient Rule,
\[f''(x)=\frac{\cos x(2+\cos x)+\sin^2x}{(2+\cos x)^2}
=\frac{2\cos x+1}{(2+\cos x)^2}.\]
This equals 0 when \(\cos x=-1/2\), so the inflection point in \([0,\pi]\) occurs at \(x=2\pi/3\). Therefore
\[f'\left(\frac{2\pi}{3}\right)
=\frac{\sqrt3/2}{2-1/2}
=\frac{\sqrt3}{3}.\]`,
  },
  {
    id: 10155,
    source: { ...stateConvention2025, questionNumber: 8 },
    number: 37,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate:
\[\exp\left(\int_0^{2025}\frac{dx}{x+\sqrt x}\right),\]
where \(\exp(x)=e^x\).`,
    choices: ["2025", "2026", "2115", "2116", "NOTA"],
    answer: "D",
    solution: String.raw`Let \(u=\sqrt x\). Then \(x=u^2\) and \(dx=2u\,du\). The upper bound becomes \(u=45\), so
\[\int_0^{2025}\frac{dx}{x+\sqrt x}
=\int_0^{45}\frac{2u}{u^2+u}\,du
=2\int_0^{45}\frac{du}{u+1}
=2\ln46.\]
Therefore
\[\exp(2\ln46)=46^2=2116.\]`,
  },
  {
    id: 10156,
    source: { ...stateConvention2025, questionNumber: 9 },
    number: 38,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 5,
    methods: ["Homogeneous First-Order Equations"],
    question: String.raw`Find the general solution to the differential equation
\[\frac{dy}{dx}=\frac{3y^4-x^4}{xy^3}.\]
Here \(K\) denotes an arbitrary real constant, on intervals where the real solution has \(x\ne0\) and \(y\ne0\).`,
    choices: [String.raw`\(y^4=Kx^4+\frac1{2x^4}\)`, String.raw`\(y^4=Kx^8+\frac1{3x^4}\)`, String.raw`\(y^4=Kx^{12}+\frac{x^4}{2}\)`, String.raw`\(y^4=Kx^{16}+\frac{x^4}{3}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The differential equation is homogeneous, so let \(y=vx\). Then \(y'=v+v'x\). Substituting,
\[v+x\frac{dv}{dx}=\frac{3v^4-1}{v^3},\]
so
\[x\frac{dv}{dx}=\frac{2v^4-1}{v^3}.\]
Separating variables gives
\[\frac{v^3}{2v^4-1}\,dv=\frac{dx}{x}.\]
Integrating with \(u=2v^4-1\),
\[\frac18\ln|2v^4-1|=\ln|x|+C,\]
so
\[2v^4-1=Kx^8.\]
Since \(v=y/x\), multiplying by \(x^4\) yields
\[y^4=Kx^{12}+\frac{x^4}{2}.\]
The factor of 2 has been absorbed into the arbitrary constant. Separating variables divided by \(2v^4-1\), so we must also check the constant-ratio solutions \(v^4=1/2\). They satisfy the original equation and are included by \(K=0\).

As a check, implicit differentiation of the final family gives \(4y^3y'=12Kx^{11}+2x^3\). Eliminating \(Kx^{12}=y^4-x^4/2\) yields
\[4y^3y'=\frac{12y^4}{x}-4x^3,\]
which is exactly \(y'=(3y^4-x^4)/(xy^3)\).`,
  },
  {
    id: 10157,
    source: { ...stateConvention2025, questionNumber: 10 },
    number: 39,
    division: "Mu",
    topic: "Riemann Sums",
    difficulty: 3,
    methods: ["Riemann Sums"],
    question: String.raw`Hopefully you are aware that \(\int_{-a}^{a}\sin\theta\,d\theta=0\) for all \(a\). Which of the following methods of definite integral approximation can have a value of \(a\) and a number of equal-width subintervals selected such that the resulting approximation is positive?

I) Left-hand Riemann sum

II) Midpoint sum

III) Right-hand Riemann sum`,
    choices: ["III only", "I and II only", "I and III only", "I, II, and III", "NOTA"],
    answer: "C",
    solution: String.raw`For a left-hand Riemann sum, choose \(a=3\pi/2\) with 2 equal subintervals. The width is \(3\pi/2\), and the sampled points are \(-3\pi/2\) and 0. Therefore
\[L_2=\frac{3\pi}{2}\bigl(\sin(-3\pi/2)+\sin0\bigr)=\frac{3\pi}{2}>0.\]
Similarly, for a right-hand Riemann sum, choose \(a=\pi/2\) with 2 equal subintervals. The width is \(\pi/2\), and the sampled points are 0 and \(\pi/2\), so
\[R_2=\frac\pi2\bigl(\sin0+\sin(\pi/2)\bigr)=\frac\pi2>0.\]

Every midpoint sum is 0 because the midpoint samples occur in symmetric pairs and \(\sin x\) is odd. Therefore only I and III can be positive.`,
  },
  {
    id: 10158,
    source: { ...stateConvention2025, questionNumber: 11 },
    number: 40,
    division: "Mu",
    topic: "Limits",
    difficulty: 4,
    methods: [],
    question: String.raw`Evaluate:
\[\lim_{x\to-2}f(f(x))\]
where
\[f(x)=\begin{cases}
3-x&\text{if }x<-2,\\
4-\dfrac{x^2}{2}&\text{if }-2<x<2,\\
\dfrac{6x-21}{x-5}&\text{if }2<x<5,\\
\dfrac{2x-1}{3}&\text{if }x>5,
\end{cases}\]
and \(f(-2)=f(2)=f(5)=4\).`,
    choices: ["2", "3", "5", "DNE", "NOTA"],
    answer: "B",
    solution: String.raw`First evaluate the one-sided behavior of the inner function. As \(x\to-2^-\),
\[f(x)=3-x\to5^+,\]
while as \(x\to-2^+\),
\[f(x)=4-\frac{x^2}{2}\to2^+.\]
For the direction of approach, write \(x=-2+h\) with \(h>0\) small. Then \(f(x)=2+2h-h^2/2>2\), so the outer function must use its formula to the right of 2, not its value at 2.
Therefore
\[\lim_{x\to-2^-}f(f(x))=\lim_{u\to5^+}f(u)=\lim_{u\to5^+}\frac{2u-1}{3}=3,\]
and
\[\lim_{x\to-2^+}f(f(x))=\lim_{u\to2^+}f(u)=\lim_{u\to2^+}\frac{6u-21}{u-5}=3.\]
The one-sided limits agree, so
\[\lim_{x\to-2}f(f(x))=3.\]`,
  },
  {
    id: 10159,
    source: { ...stateConvention2025, questionNumber: 12 },
    number: 41,
    division: "Mu",
    topic: "Telescoping Series",
    difficulty: 5,
    methods: [],
    question: String.raw`Let \(H_k\) be the \(k^{\text{th}}\) harmonic sum, \(H_k=\sum_{n=1}^{k}\frac1n\). If
\[\sum_{n=46}^{\infty}\frac{8100}{n^3-2025n}=RH_Y-TH_M,\]
find the value of \(RY-TM\), using the coefficients and indices obtained by direct partial-fraction telescoping. Here \(R,Y,T,M\) are positive integers.`,
    choices: ["−12", "−3", "0", "6", "NOTA"],
    answer: "C",
    solution: String.raw`Write \(2025=45^2\). More generally, with \(a=45\),
\[\frac{4a^2}{n^3-a^2n}=\frac{4a^2}{n(n-a)(n+a)}
=-\frac4n+\frac2{n-a}+\frac2{n+a}.\]
Thus
\[\sum_{n=a+1}^{\infty}\frac{4a^2}{n^3-a^2n}
=\sum_{n=a+1}^{\infty}\left(-\frac4n+\frac2{n-a}+\frac2{n+a}\right).\]
To avoid subtracting divergent series separately, first sum only through \(N\):
\[\sum_{n=a+1}^N\left(-\frac4n+\frac2{n-a}+\frac2{n+a}\right)
=-4(H_N-H_a)+2H_{N-a}+2(H_{N+a}-H_{2a}).\]
This equals
\[4H_a-2H_{2a}+2(H_{N-a}+H_{N+a}-2H_N).\]
The last parentheses tend to 0: they are a difference of two sums of \(a\) terms near \(1/N\), each bounded in magnitude by \(a/(N-a+1)\). Therefore the convergent sum is
\[4H_a-2H_{2a}.\]
For \(a=45\), the given expression is
\[4H_{45}-2H_{90}.\]
Hence \(R=4\), \(Y=45\), \(T=2\), and \(M=90\), so
\[RY-TM=4(45)-2(90)=0.\]`,
  },
  {
    id: 10160,
    source: { ...stateConvention2025, questionNumber: 13 },
    number: 42,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: [],
    question: String.raw`\(f(x)\) is a polynomial of degree 2025. The number of inflection points on the graph of \(y=f(x)\) is \(I\). The minimum possible value of \(I\) is \(m\), and the maximum possible value of \(I\) is \(M\). Find the ordered pair \((m,M)\).`,
    choices: ["(0, 2022)", "(0, 2023)", "(1, 2022)", "(1, 2023)", "NOTA"],
    answer: "D",
    solution: String.raw`Inflection points are found by investigating sign changes of \(f''(x)\). Since \(f\) has degree 2025, \(f''\) has degree 2023. Therefore it can have at most 2023 real zeros, and this maximum can be attained with 2023 distinct real roots, each producing a sign change. Thus \(M=2023\).

Because \(f''\) has odd degree, its values have opposite end behavior as \(x\to-\infty\) and \(x\to\infty\). It must therefore change sign at least once. The example \(f(x)=x^{2025}\) has exactly one inflection point, at 0, so the minimum 1 is attainable.

To attain the maximum, choose \(f''(x)=\prod_{j=1}^{2023}(x-j)\) and integrate twice. This gives a polynomial \(f\) of degree 2025, and all 2023 roots of \(f''\) are simple, so the concavity changes at every one. Thus the endpoints of the possible range are both attained. Hence
\[(m,M)=(1,2023).\]`,
  },
  {
    id: 10161,
    source: { ...stateConvention2025, questionNumber: 14 },
    number: 43,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: [],
    question: String.raw`Which of the following incorrectly matches a derivative of the position vector \(\vec{x}\) with respect to time with its name?`,
    choices: [String.raw`\(\dfrac{d^3\vec{x}}{dt^3}\): Jounce`, String.raw`\(\dfrac{d^4\vec{x}}{dt^4}\): Snap`, String.raw`\(\dfrac{d^5\vec{x}}{dt^5}\): Crackle`, String.raw`\(\dfrac{d^6\vec{x}}{dt^6}\): Pop`, "NOTA"],
    answer: "A",
    solution: String.raw`The third derivative of position is called jerk. Jounce, also called snap, is the fourth derivative of position. Therefore choice A is the incorrect match.`,
  },
  {
    id: 10162,
    source: { ...stateConvention2025, questionNumber: 15 },
    number: 44,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 4,
    methods: [],
    question: String.raw`The tangent line to the graph of \(y=ax^2+bx+c\) at \(x=1\) is the line \(ax+by+c=0\) for some \(a\), \(b\), and \(c\). Find \(\frac ca\) in terms of \(b\).`,
    choices: [String.raw`\(\frac1{1+2b}\)`, String.raw`\(\frac b{1+2b}\)`, String.raw`\(\frac1{1+b}\)`, String.raw`\(\frac b{1+b}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`At \(x=1\), the point on the parabola is
\[(1,a+b+c),\]
and since \(y'=2ax+b\), the tangent slope is \(2a+b\). Therefore the tangent line is
\[y-(a+b+c)=(2a+b)(x-1),\]
or
\[y=(2a+b)x+(c-a).\]
The given line \(ax+by+c=0\) has slope-intercept form
\[y=-\frac abx-\frac cb.\]
Matching slope and intercept gives
\[2a+b=-\frac ab,\qquad c-a=-\frac cb.\]
The second equation yields
\[bc-ab=-c,\]
so
\[c(1+b)=ab,\qquad \frac ca=\frac b{1+b}.\]
The requested ratio assumes \(a\ne0\). Also \(b\ne0\), since otherwise the stated line would be vertical while a polynomial graph has a finite tangent slope. If \(b=-1\), the intercept equation forces \(a=0\), so \(b+1\ne0\) for the stated ratio. One can also solve the slope equation to obtain
\[a=-\frac{b^2}{1+2b},\qquad c=-\frac{b^3}{(1+b)(1+2b)},\]
and dividing again gives \(c/a=b/(1+b)\).`,
  },
  {
    id: 10163,
    source: { ...stateConvention2025, questionNumber: 16 },
    number: 45,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 3,
    methods: ["Power Series"],
    question: String.raw`Evaluate:
\[\left.\frac{d^{2025}}{dx^{2025}}[\arctan x]\right|_{x=0}.\]`,
    choices: ["−2024!", String.raw`\(-\frac1{2025}\)`, String.raw`\(\frac1{2025}\)`, "2024!", "NOTA"],
    answer: "D",
    solution: String.raw`The Maclaurin series for arctangent is
\[\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}-\frac{x^7}{7}+\cdots.\]
Since 2025 is one more than a multiple of 4, the coefficient of \(x^{2025}\) is \(1/2025\). In a Maclaurin series, that coefficient is
\[\frac{f^{(2025)}(0)}{2025!}.\]
Therefore
\[\frac{f^{(2025)}(0)}{2025!}=\frac1{2025},\]
and
\[f^{(2025)}(0)=2024!.\]`,
  },
  {
    id: 10164,
    source: { ...stateConvention2025, questionNumber: 18 },
    number: 46,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate:
\[\int_0^1(1-2x)^4x^2\,dx.\]`,
    choices: [String.raw`\(\frac1{70}\)`, String.raw`\(\frac3{35}\)`, String.raw`\(\frac{107}{840}\)`, String.raw`\(\frac{71}{420}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let \(u=2x-1\), so \(du=2\,dx\), \(x=(u+1)/2\), and the bounds become \(-1\) and 1. Then
\[\int_0^1(1-2x)^4x^2\,dx
=\frac18\int_{-1}^{1}u^4(u+1)^2\,du
=\frac18\int_{-1}^{1}(u^6+2u^5+u^4)\,du.\]
The odd term integrates to 0 over \([-1,1]\), so
\[\frac18\int_{-1}^{1}(u^6+u^4)\,du
=\frac14\int_0^1(u^6+u^4)\,du
=\frac14\left(\frac17+\frac15\right)
=\frac3{35}.\]`,
  },
  {
    id: 10165,
    source: { ...stateConvention2025, questionNumber: 19 },
    number: 47,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 5,
    methods: [],
    question: String.raw`\(f(x)\) is a polynomial of unknown degree \(d\) with non-negative integer coefficients. Nick agrees that he will tell Manny the exact value of \(f(n)\) for any real value of \(n\) Manny wants. Find the minimum number of values of \(n\) Manny would need to ask Nick to evaluate to guarantee that he can identify \(f(x)\) uniquely.`,
    choices: ["2", "3", String.raw`\(d\)`, String.raw`\(d+1\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Manny can ask for the value at a transcendental number, such as \(n=\pi\), because the query is not restricted to integers and exact values are returned. Suppose two polynomials \(f\) and \(g\), both with non-negative integer coefficients, gave the same value there. Then
\[f(\pi)-g(\pi)=0.\]
But \(f-g\) is a polynomial with integer coefficients. If it were nonzero, this equation would make \(\pi\) algebraic, contradicting the fact that \(\pi\) is transcendental. Therefore \(f-g\) must be the zero polynomial and \(f=g\). One requested value uniquely determines the polynomial, and zero values clearly cannot. The minimum is therefore 1, which is not listed, so the answer is NOTA. This is an exact uniqueness argument, not a claim that finite-precision measurements at \(\pi\) recover arbitrary coefficients.

For comparison, if the query inputs were restricted to positive integers, the usual two-request solution would apply. Get the sum of the coefficients with \(f(1)\) and call it \(S\). If \(S=0\), the polynomial is zero. Otherwise all coefficients lie between 0 and \(S\), so \(f(S+1)\) has those coefficients as its digits in base \(S+1\), and the second response identifies the polynomial. One positive-integer query alone does not guarantee uniqueness: at an input \(m\ge1\), the distinct polynomials \(f(x)=m\) and \(g(x)=x\) give the same response. That restricted-input variant would have answer 2, but it is not the version stated here.`,
  },
  {
    id: 10166,
    source: { ...stateConvention2025, questionNumber: 20 },
    number: 48,
    division: "Mu",
    topic: "Optimization",
    difficulty: 5,
    methods: ["Implicit Differentiation", "First Derivative Test"],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G\) of
\[2xy^2-x^3=y^4\]
in the first quadrant. \(\mathcal G\) is a closed loop and can be separated into a portion that is concave up and a portion that is concave down.

The line \(y=y_0\) intersects \(\mathcal G\). If the maximum possible value of \(y_0\) is \(\frac{A\sqrt B}{C}\) in simplest form for positive integers \(A,B,C\), find \(A+B+C\).`,
    choices: ["14", "16", "17", "19", "NOTA"],
    answer: "D",
    solution: String.raw`Instead of maximizing \(y\), maximize \(y^2\). Treating the equation as a quadratic in \(y^2\),
\[y^4-2xy^2+x^3=0,\]
so
\[y^2=x\pm x\sqrt{1-x}.\]
The upper branch is \(y^2=x+x\sqrt{1-x}\). Differentiating,
\[\frac d{dx}(y^2)=1+\sqrt{1-x}-\frac{x}{2\sqrt{1-x}}.\]
At the maximum this equals 0, so
\[2\sqrt{1-x}+2(1-x)-x=0,\]
or
\[2\sqrt{1-x}=3x-2.\]
Squaring gives
\[4(1-x)=9x^2-12x+4,\]
so \(9x^2-8x=0\), and the valid positive solution is \(x=8/9\). Substitution gives
\[y^2=\frac89+\frac8{27}=\frac{32}{27},\qquad y=\frac{4\sqrt6}{9}.\]
Thus \(A=4\), \(B=6\), \(C=9\), and
\[A+B+C=19.\]
The squaring step also produced \(x=0\), but it fails \(2\sqrt{1-x}=3x-2\), since the left side is positive and the right side negative. The upper branch has endpoint heights 0 and 1 at \(x=0,1\); its interior height \(4\sqrt6/9>1\) is therefore the global maximum.`,
  },
  {
    id: 10167,
    source: { ...stateConvention2025, questionNumber: 21 },
    number: 49,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 5,
    methods: ["Implicit Differentiation"],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G\) of
\[2xy^2-x^3=y^4\]
in the first quadrant. \(\mathcal G\) is a closed loop and can be separated into a portion that is concave up and a portion that is concave down.

Let \(m_\ell(x_0)\) be the slope of the tangent line to the concave up portion of \(\mathcal G\) at \(x=x_0\). Find the value of
\[\lim_{x_0\to0^+}m_\ell(x_0).\]`,
    choices: [String.raw`\(\frac{\sqrt6}{6}\)`, String.raw`\(\frac{\sqrt2}{2}\)`, String.raw`\(\frac{\sqrt6}{3}\)`, String.raw`\(\frac{\sqrt3}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Implicit differentiation of
\[2xy^2-x^3=y^4\]
gives
\[2y^2+4xy\frac{dy}{dx}-3x^2=4y^3\frac{dy}{dx},\]
so
\[\frac{dy}{dx}=\frac{2y^2-3x^2}{4y^3-4xy}.\]
For a rigorous slope limit, solve the equation as a quadratic in \(y^2\):
\[y^2=x\pm x\sqrt{1-x}.\]
The lower, concave up branch uses the minus sign. Rationalizing gives
\[y^2=x(1-\sqrt{1-x})=\frac{x^2}{1+\sqrt{1-x}},\]
so, because \(x,y>0\),
\[y=\frac{x}{\sqrt{1+\sqrt{1-x}}}.\]
Differentiating this explicit expression yields
\[y'=\frac1{\sqrt{1+\sqrt{1-x}}}
+\frac{x}{4\sqrt{1-x}(1+\sqrt{1-x})^{3/2}}.\]
As \(x\to0^+\), the first term approaches \(1/\sqrt2\) and the second approaches 0. Therefore the requested slope limit is
\[\frac1{\sqrt2}=\frac{\sqrt2}{2}.\]
This justifies the leading-order observation that \(y\sim x/\sqrt2\), without assuming that asymptotic equivalence alone permits differentiating both sides.`,
  },
  {
    id: 10168,
    source: { ...stateConvention2025, questionNumber: 22 },
    number: 50,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: ["Implicit Differentiation"],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G\) of
\[2xy^2-x^3=y^4\]
in the first quadrant. \(\mathcal G\) is a closed loop and can be separated into a portion that is concave up and a portion that is concave down.

Let \(m_\mathcal U(x_0)\) be the slope of the tangent line to the concave down portion of \(\mathcal G\) at \(x=x_0\). Find the value of
\[\lim_{x_0\to0^+}m_\mathcal U(x_0).\]`,
    choices: [String.raw`\(\frac32\)`, String.raw`\(\sqrt6\)`, String.raw`\(2\sqrt2\)`, String.raw`\(\frac{3\sqrt3}{2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`The loop can be written as
\[y^2=x\pm x\sqrt{1-x}.\]
The concave down branch is the upper branch,
\[y^2=x+x\sqrt{1-x}.\]
Differentiate this explicit branch identity at positive \(x\):
\[2y\,y'=1+\sqrt{1-x}-\frac{x}{2\sqrt{1-x}}.\]
Thus
\[y'=\frac{1+\sqrt{1-x}-\frac{x}{2\sqrt{1-x}}}
{2\sqrt{x+x\sqrt{1-x}}}.\]
As \(x\to0^+\), the numerator approaches 2, while the denominator approaches 0 through positive values. Therefore \(y'\to+\infty\), so none of the finite choices A-D is correct and the answer is NOTA.

In particular, \(y^2\sim2x\) gives the expected vertical behavior, but directly substituting the origin into the unsimplified implicit derivative would give \(0/0\). The explicit branch calculation establishes the limit without that invalid substitution.`,
  },
  {
    id: 10169,
    source: { ...stateConvention2025, questionNumber: 23 },
    number: 51,
    division: "Mu",
    topic: "Polar Area",
    difficulty: 4,
    methods: ["U-Substitution"],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G\) of
\[2xy^2-x^3=y^4\]
in the first quadrant. \(\mathcal G\) is a closed loop and can be separated into a portion that is concave up and a portion that is concave down.

Let the area of the portion of \(\mathcal G\) above the line \(y=x\) equal \(\frac AB\), where \(A\) and \(B\) are relatively prime positive integers. Find \(A+B\).`,
    choices: ["176", "209", "253", "281", "NOTA"],
    answer: "D",
    solution: String.raw`Convert the curve to polar coordinates with \(x=r\cos\theta\) and \(y=r\sin\theta\):
\[2r^3\cos\theta\sin^2\theta-r^3\cos^3\theta=r^4\sin^4\theta.\]
For \(r\ne0\),
\[r=2\cot\theta\csc\theta-\cot^3\theta\csc\theta
=\cot\theta\csc\theta(2-\cot^2\theta).\]
The portion above \(y=x\) corresponds to \(\pi/4\le\theta\le\pi/2\). Its area is
\[\frac12\int_{\pi/4}^{\pi/2}\cot^2\theta\csc^2\theta(2-\cot^2\theta)^2\,d\theta.\]
Let \(u=\cot\theta\), so \(du=-\csc^2\theta\,d\theta\). The bounds become 1 and 0, giving
\[\frac12\int_0^1u^2(2-u^2)^2\,du
=\frac12\int_0^1(4u^2-4u^4+u^6)\,du.\]
Thus the area is
\[\frac12\left(\frac43-\frac45+\frac17\right)=\frac{71}{210}.\]
Therefore
\[A+B=71+210=281.\]`,
  },
  {
    id: 10170,
    source: { ...stateConvention2025, questionNumber: 24 },
    number: 52,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate:
\[\int_0^{\pi/21}\frac{d\theta}{\cos(7\theta)}.\]`,
    choices: [String.raw`\(\frac{\ln3}{7}\)`, String.raw`\(\frac{\ln(2+\sqrt3)}7\)`, String.raw`\(\ln3\)`, String.raw`\(\ln(2+\sqrt3)\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let \(u=7\theta\), so \(d\theta=du/7\). Then
\[\int_0^{\pi/21}\frac{d\theta}{\cos(7\theta)}
=\frac17\int_0^{\pi/3}\sec u\,du.\]
Using \(\int\sec u\,du=\ln|\sec u+\tan u|+C\),
\[\frac17\left[\ln(\sec u+\tan u)\right]_0^{\pi/3}
=\frac{\ln(2+\sqrt3)}7.\]`,
  },
  {
    id: 10171,
    source: { ...stateConvention2025, questionNumber: 25 },
    number: 53,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["U-Substitution", "Trigonometric Identities"],
    question: String.raw`Evaluate:
\[\int_0^{\pi/21}\frac{d\theta}{\cos(7\theta)+1}.\]`,
    choices: [String.raw`\(\frac1{21}\)`, String.raw`\(\frac{\sqrt3}{21}\)`, String.raw`\(\frac13\)`, String.raw`\(\frac{\sqrt3}{3}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let \(u=7\theta\), so
\[\int_0^{\pi/21}\frac{d\theta}{1+\cos(7\theta)}
=\frac17\int_0^{\pi/3}\frac{du}{1+\cos u}.\]
Using \(1+\cos u=2\cos^2(u/2)\),
\[\frac1{1+\cos u}=\frac12\sec^2\left(\frac u2\right).\]
Therefore
\[\frac17\int_0^{\pi/3}\frac12\sec^2\left(\frac u2\right)du
=\frac17\left[\tan\left(\frac u2\right)\right]_0^{\pi/3}
=\frac1{7\sqrt3}
=\frac{\sqrt3}{21}.\]`,
  },
  {
    id: 10172,
    source: { ...stateConvention2025, questionNumber: 26 },
    number: 54,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: [],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G_n\) of
\[x^n+y^n=1\]
for positive integer \(n\). This graph is a closed loop when \(n\) is even and a function when \(n\) is odd.

Let \(n\) be odd. As \(n\) approaches \(\infty\), find the arc length of \(\mathcal G_n\) for \(x\in[-3,3]\).`,
    choices: [String.raw`\(6\sqrt2\)`, String.raw`\(4\sqrt2+4\)`, String.raw`\(2\sqrt2+8\)`, "12", "NOTA"],
    answer: "B",
    solution: String.raw`For odd \(n\),
\[y=(1-x^n)^{1/n}.\]
As \(n\to\infty\), when \(|x|<1\), \(x^n\to0\) and the graph approaches \(y=1\). When \(|x|>1\), the dominant terms must nearly cancel, and the graph approaches \(y=-x\).

Near \(x=1\), the increasingly sharp transition from \(y=1\) to \(y=-1\) contributes a vertical segment in the limiting arc. Thus, on \([-3,3]\), the limiting arc follows

\[(-3,3)\to(-1,1)\to(1,1)\to(1,-1)\to(3,-3).\]
The two diagonal segments each have length \(2\sqrt2\), the horizontal segment has length 2, and the vertical segment has length 2. Therefore the limiting arc length is
\[2\sqrt2+2+2+2\sqrt2=4\sqrt2+4.\]
It is important not to discard the vertical segment merely because it occurs over a shrinking x-interval. For fixed small \(\delta>0\), the heights at \(x=1-\delta\) and \(x=1+\delta\) tend to 1 and \(-(1+\delta)\), respectively. The graph is decreasing, so the length in this interval is at least the vertical drop and at most that drop plus the horizontal width \(2\delta\). As \(n\to\infty\), these bounds are \(2+\delta\) and \(2+3\delta\); letting \(\delta\to0\) gives a limiting contribution of 2. Away from the transitions at \(x=\pm1\), both the graphs and their slopes converge to the indicated line segments. The transition near \(-1\) has horizontal and vertical variations tending to 0 with \(\delta\), so it contributes no additional length.`,
  },
  {
    id: 10173,
    source: { ...stateConvention2025, questionNumber: 27 },
    number: 55,
    division: "Mu",
    topic: "Limits",
    difficulty: 4,
    methods: [],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G_n\) of
\[x^n+y^n=1\]
for positive integer \(n\). This graph is a closed loop when \(n\) is even and a function when \(n\) is odd.

Let \(n\) be even. Which of the following is the most restrictive continuous interval that contains all possible values of the area of \(\mathcal G_n\)?`,
    choices: ["[2, 4)", "[2, 4]", String.raw`\([\pi,4)\)`, String.raw`\([\pi,4]\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The smallest even value is \(n=2\), which gives the unit circle, of area \(\pi\). To prove that no other even value has smaller area, consider a point in the unit disk. It has \(|x|,|y|\le1\), so for even \(n\ge2\),
\[|x|^n+|y|^n\le x^2+y^2\le1.\]
Thus every such region contains the unit disk, and \(\pi\) really is the minimum, attained at \(n=2\).

All the regions lie inside the square \([-1,1]^2\), of area 4. For every finite \(n\), neighborhoods of the square's corners are outside the region since \(1^n+1^n=2>1\), so its area is strictly less than 4.

On the other hand, fix any \(0<q<1\). For sufficiently large even \(n\), \(2q^n\le1\), so the entire square \([-q,q]^2\) lies inside the region. Its area is \(4q^2\), which can be made arbitrarily close to 4 by choosing \(q\) close to 1. Therefore 4 is the supremum but is never attained. The limiting square has vertices \((1,1)\), \((-1,1)\), \((-1,-1)\), and \((1,-1)\). Hence the most restrictive continuous interval is
\[[\pi,4).\]`,
  },
  {
    id: 10174,
    source: { ...stateConvention2025, questionNumber: 28 },
    number: 56,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Logarithmic Differentiation"],
    question: String.raw`Find \(f'(0)\) if
\[f(x)=(x+1)^3(x+2)^2\sqrt{x+4}.\]`,
    choices: ["33", "34", "36", "40", "NOTA"],
    answer: "A",
    solution: String.raw`Using logarithmic differentiation,
\[\ln f(x)=3\ln(x+1)+2\ln(x+2)+\frac12\ln(x+4),\]
so
\[\frac{f'(x)}{f(x)}=\frac3{x+1}+\frac2{x+2}+\frac1{2(x+4)}.\]
Now \(f(0)=1^3\cdot2^2\cdot2=8\), and
\[\frac{f'(0)}{f(0)}=3+1+\frac18=\frac{33}{8}.\]
Therefore
\[f'(0)=8\left(\frac{33}{8}\right)=33.\]`,
  },
  {
    id: 10175,
    source: { ...stateConvention2025, questionNumber: 29 },
    number: 57,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 5,
    methods: ["Pappus's Theorem"],
    question: String.raw`A convex polygon has vertices at \((-1,3)\), \((1,2)\), \((1,9)\), and \((4,13)\). It is rotated about the line \(x=8\). Find the volume of the solid formed.`,
    choices: [String.raw`\(\frac{560\pi}{3}\)`, String.raw`\(\frac{640\pi}{3}\)`, String.raw`\(\frac{700\pi}{3}\)`, String.raw`\(\frac{850\pi}{3}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The line \(x=1\) splits the quadrilateral into two triangles, each with vertical base 7. The left triangle has horizontal height 2 and area 7; its centroid has x-coordinate
\[\frac{-1+1+1}{3}=\frac13.\]
The right triangle has horizontal height 3 and area \(21/2\); its centroid has x-coordinate
\[\frac{1+1+4}{3}=2.\]
Thus the quadrilateral has area
\[7+\frac{21}{2}=\frac{35}{2},\]
and its centroid has x-coordinate
\[\bar x=\frac{7(1/3)+(21/2)(2)}{35/2}=\frac43.\]
The centroid is therefore \(8-4/3=20/3\) units from the axis of rotation. By Pappus's Centroid Theorem,
\[V=\left(2\pi\cdot\frac{20}{3}\right)\left(\frac{35}{2}\right)=\frac{700\pi}{3}.\]`,
  },
  {
    id: 10176,
    source: { ...stateConvention2025, questionNumber: 30 },
    number: 58,
    division: "Mu",
    topic: "Sequences",
    difficulty: 5,
    methods: [],
    question: String.raw`\(\{a_n\}_{1\le n\le9}\) is a nonconstant arithmetic sequence of integers such that the following is true for some positive integer \(N\):
\[\sum_{n=1}^{9}a_n^2=N^2.\]
Find the smallest possible value of \(N\).`,
    choices: ["24", "48", "60", "72", "NOTA"],
    answer: "A",
    solution: String.raw`Write the nine-term arithmetic sequence as
\[p-4q,p-3q,\ldots,p,\ldots,p+3q,p+4q,\]
where \(q\ne0\). When the squares are summed, the cross terms cancel. There are nine \(p^2\) terms, and the squared coefficients of the paired \(q^2\) terms sum to
\[2(1^2+2^2+3^2+4^2)=60.\]
Therefore
\[N^2=9p^2+60q^2,\]
so
\[(N-3p)(N+3p)=60q^2.\]
To establish the minimum rigorously, reduce the original equation modulo 3. It gives \(N^2\equiv0\pmod3\), so \(N=3r\) for some integer \(r\). Dividing by 3 gives
\[3r^2=3p^2+20q^2.\]
Reducing this equation modulo 3 shows \(2q^2\equiv0\pmod3\), so \(q\) is divisible by 3. Since the sequence is nonconstant, \(|q|\ge3\). Hence
\[N^2=9p^2+60q^2\ge540.\]
Because \(23^2=529<540\), any positive integer \(N\) must be at least 24. It remains to attain this bound. Trying \(q=3\), we seek factors of
\[60q^2=540\]
whose difference is divisible by 6. The pair \(N-3p=18\), \(N+3p=30\) gives
\[N=24,\qquad p=2.\]
Indeed, the sequence
\[-10,-7,-4,-1,2,5,8,11,14\]
satisfies
\[(-10)^2+(-7)^2+(-4)^2+(-1)^2+2^2+5^2+8^2+11^2+14^2=24^2.\]
Hence the smallest possible value is \(24\).`,
  },
  // 2024 FAMAT State Convention — Calculus Individual Test.
  // Original questions 1-30 map to public Mu 59-88 (IDs 10177-10206).
  // Checked against the supplied answer key and independently derived solutions.
  // NOTA means none of choices A–D. Ratings use the existing 1–5 bank scale;
  // contest success rates inform, but do not determine, mathematical difficulty.
  // Q2 adds continuity at 4 to repair the composition-limit assumption.
  // Q20 specifies the standard upright cone/cube placement used by the key.
  // Q27/Q29/Q30 repeat required definitions so each works independently.
  // Source-faithful transcription: preserve prose, solution order and alternatives.
  // Corrections: Q9 missing minus sign; Q13 third derivative coefficient/typo;
  // Q19 substitution variable; Q20 cone/cube names and polynomial constant;
  // Q22 substitution sign; Q23 Gamma factors; Q24 intercept exponent;
  // Q25 differentiated sign; Q27 monotonicity and continuous-spike construction;
  // Q29 whole-line integration-by-parts bounds. Source diagrams remain solution-only.
  // Q30 supplies the preceding result, matching the source's one-step solution.
  // Preserve the established difficulty ratings along with all IDs and choices.
  {
    id: 10177,
    source: { ...stateConvention2024, questionNumber: 1 },
    number: 59,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Mean Value Theorem"],
question: String.raw`Legosi asks Louis to find the value of \(c_1\) satisfying the mean value theorem for derivatives for the function \(f(x)=x^2\) on the interval \([0,1]\), but Louis mishears him and instead finds the value \(c_2\) satisfying the mean value theorem for integrals for the same function and interval. Find \(c_1c_2\).`,
    choices: [String.raw`\(\frac{\sqrt3}{6}\)`, String.raw`\(\frac14\)`, String.raw`\(\frac16\)`, String.raw`\(\frac{\sqrt3}{3}\)`, "NOTA"],
    answer: "A",
solution: String.raw`For the mean value theorem for derivatives, we want the value \(c_1\) such that \(f'(c_1)=\frac{f(1)-f(0)}{1-0}\), or \(2c_1=1\Rightarrow c_1=\frac12\). For the mean value theorem for integrals, we want the value \(c_2\) such that \(c_2^2=f(c_2)=\frac1{1-0}\int_0^1x^2\,dx=\frac13\), so \(c_2=\frac{\sqrt3}{3}\). Thus \(c_1c_2=\boxed{\frac{\sqrt3}{6}}\).`,
  },
  {
    id: 10178,
    source: { ...stateConvention2024, questionNumber: 2 },
    number: 60,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
question: String.raw`If \(\lim_{x\to2}f(x)=4\) and \(\lim_{x\to4}f(x)=3\), compute \(\displaystyle\lim_{x\to2}[2\cdot f(x)+f(f(x))]\). Assume additionally that \(f\) is continuous at \(4\).`,
    choices: ["11", "12", "10", "7", "NOTA"],
    answer: "A",
solution: String.raw`Since \(f\) is continuous at \(4\), we can see that \(\lim_{x\to2}f(f(x))=\lim_{u\to4}f(u)=3\), so the desired limit is \(2(4)+3=\boxed{11}\).

In detail, the inner value \(f(x)\) tends to \(4\). Continuity makes \(f(4)=3\) and ensures that the outer function tends to \(3\) even if the inner value equals \(4\) infinitely often. The sum and constant-multiple limit laws then give the result.

The added continuity assumption is necessary: the two limits in the original paper alone do not specify \(f(4)\). For example, set \(f(x)=4\) near \(2\), set \(f(x)=3\) near but not at \(4\), and set \(f(4)=0\). Both stated limits hold, but the requested expression tends to \(8\), not \(11\).`,
  },
  {
    id: 10179,
    source: { ...stateConvention2024, questionNumber: 3 },
    number: 61,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Rule"],
question: String.raw`If \(f(x)=x^2+2x-\frac1x\), compute \(f'(2)\).`,
    choices: [String.raw`\(\frac{23}{4}\)`, String.raw`\(\frac{13}{2}\)`, String.raw`\(\frac{25}{4}\)`, String.raw`\(\frac{11}{2}\)`, "NOTA"],
    answer: "C",
solution: String.raw`We compute \(f'(x)=2x+2+\frac1{x^2}\), and plugging in \(x=2\) gives \(2(2)+2+\frac1{2^2}=\boxed{\frac{25}{4}}\).`,
  },
  {
    id: 10180,
    source: { ...stateConvention2024, questionNumber: 4 },
    number: 62,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Product Rule"],
question: String.raw`If \(f(1)=2\), \(f'(1)=3\), \(g(1)=-1\), and \(g'(1)=-2\), compute \(\frac{d}{dx}[f(x)g(x)]\) at \(x=1\).`,
    choices: ["9", "−7", "6", "−8", "NOTA"],
    answer: "B",
solution: String.raw`By the product rule, \(\frac{d}{dx}[f(x)g(x)]=f'(x)g(x)+f(x)g'(x)\), and plugging in \(x=1\) gives \(3(-1)+2(-2)=\boxed{-7}\).`,
  },
  {
    id: 10181,
    source: { ...stateConvention2024, questionNumber: 5 },
    number: 63,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
question: String.raw`If \(f(2)=1\), \(f(4)=2\), \(f'(2)=-1\), and \(f'(4)=-2\), compute \(\frac{d}{dx}[(f(x^2))^2]\) at \(x=2\).`,
    choices: ["−32", "−16", "−8", "−4", "NOTA"],
    answer: "A",
solution: String.raw`By the chain rule, \(\frac{d}{dx}[(f(x^2))^2]=2f(x^2)f'(x^2)(2x)\), and plugging in \(x=2\) gives \(2(2)(-2)(4)=\boxed{-32}\).`,
  },
  {
    id: 10182,
    source: { ...stateConvention2024, questionNumber: 6 },
    number: 64,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["U-Substitution"],
question: String.raw`If \(\int_0^1f(x)\,dx=4\), compute \(\displaystyle\int_0^1xf(x^2)\,dx\).`,
    choices: ["16", "4", "8", "2", "NOTA"],
    answer: "D",
solution: String.raw`Substituting \(u=x^2\), \(du=2x\,dx\) gives \(\frac12\int_0^1f(u)\,du=\frac12\int_0^1f(x)\,dx=\frac12(4)=\boxed{2}\).`,
  },
  {
    id: 10183,
    source: { ...stateConvention2024, questionNumber: 7 },
    number: 65,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution", "Integral Properties"],
question: String.raw`If \(\int_0^1f(x)\,dx=2\) and \(\int_0^1f(2x)\,dx=3\), compute \(\displaystyle\int_1^2f(x)\,dx\).`,
    choices: ["4", "1", "5", "8", "NOTA"],
    answer: "A",
solution: String.raw`Substituting \(u=2x\) into the second integral gives \(\frac12\int_0^2f(u)\,du=3\Rightarrow\int_0^2f(x)\,dx=6\), so \(\int_1^2f(x)\,dx=\int_0^2f(x)\,dx-\int_0^1f(x)\,dx=6-2=\boxed{4}\).`,
  },
  {
    id: 10184,
    source: { ...stateConvention2024, questionNumber: 8 },
    number: 66,
    division: "Mu",
    topic: "Area Between Curves",
    difficulty: 2,
    methods: [],
question: String.raw`Find the total area of all finite regions bounded by the graph of \(y=x^3-x\) and the \(x\)-axis.`,
    choices: [String.raw`\(\frac14\)`, "0", String.raw`\(\frac32\)`, String.raw`\(\frac12\)`, "NOTA"],
    answer: "D",
solution: String.raw`Factoring \(x-x^3=x(1+x)(1-x)\), we have roots at \(x=-1,0,1\), thus the finite regions are for \(-1\le x\le0\) and \(0\le x\le1\). We can compute \(\int_{-1}^0(x-x^3)\,dx=\left[\frac{x^2}{2}-\frac{x^4}{4}\right]_{-1}^0=-\frac14\) and \(\int_0^1(x-x^3)\,dx=\left[\frac{x^2}{2}-\frac{x^4}{4}\right]_0^1=\frac14\), so each region has an area of \(\frac14\), for a total area of \(\boxed{\frac12}\).

The source computes with \(x-x^3\), the negative of the curve in the question. Reflecting a curve across the \(x\)-axis preserves its bounded areas. Equivalently, use the original function directly:
\[\text{Area}=\int_{-1}^0(x^3-x)\,dx-\int_0^1(x^3-x)\,dx
=\frac14+\frac14=\frac12.\]
The minus sign on the second integral is essential because that part of the original curve is below the axis.`,
  },
  {
    id: 10185,
    source: { ...stateConvention2024, questionNumber: 9 },
    number: 67,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 2,
    methods: ["Implicit Differentiation"],
question: String.raw`Find the \(y\)-intercept of the tangent line to the graph of \(x^3+y^3=9\) at the point \((1,2)\).`,
    choices: [String.raw`\(\frac94\)`, String.raw`\(-\frac14\)`, String.raw`\(\frac14\)`, String.raw`\(\frac74\)`, "NOTA"],
    answer: "A",
solution: String.raw`Implicit differentiation gives \(3x^2+3y^2y'=0\Rightarrow y'=-\frac{x^2}{y^2}\). Plugging in \((1,2)\) gives \(y'=-\frac14\), so the tangent line takes the form \(x+4y=9\). Plugging in \(x=0\) gives \(\boxed{\frac94}\) as the \(y\)-intercept.`,
  },
  {
    id: 10186,
    source: { ...stateConvention2024, questionNumber: 10 },
    number: 68,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
question: String.raw`Jack is taking a calculus test, and one of the problems is asking him to compute \(\displaystyle\lim_{x\to3}\frac{x^2+2x-\square}{x-3}\)... oh no! The problem is smudged, and he can’t read it! Given that the smudged value “\(\square\)” is such that the limit exists (which, in particular, means it is finite), what is the correct answer to the problem?`,
    choices: ["8", "−2", "0", "15", "NOTA"],
    answer: "A",
solution: String.raw`We want the numerator, when factored, to have an \(x-3\) term to cancel out of the denominator. Thus 3 is a root of \(x^2+2x-\square\), so \(3^2+2(3)-\square=0\Rightarrow\square=15\). Thus we want
\[\lim_{x\to3}\frac{x^2+2x-15}{x-3}=\lim_{x\to3}\frac{(x+5)(x-3)}{x-3}=\lim_{x\to3}x+5=\boxed{8}.\]`,
  },
  {
    id: 10187,
    source: { ...stateConvention2024, questionNumber: 11 },
    number: 69,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["First Derivative Test"],
question: String.raw`Legom has monopolized the egg sandwich market. If she produces \(x\) egg sandwiches (where \(0\le x\le36\)), she can sell them for a price of \(\sqrt{36-x}\) each. If Legom wants to maximize her revenue, how many egg sandwiches should she produce?`,
    choices: ["12", "24", "18", "27", "NOTA"],
    answer: "B",
solution: String.raw`If she sells \(x\) sandwiches for \(\sqrt{36-x}\) each, her total revenue is \(x\sqrt{36-x}\). Maximising this is equivalent to maximising its square, \(36x^2-x^3\). Taking the derivative gives \(72x-3x^2\), which is 0 when \(x=0,24\). Of these, it’s not hard to check that \(x=\boxed{24}\) corresponds to a maximum.

To verify the global maximum, revenue is nonnegative on \([0,36]\), so squaring preserves its ordering. The derivative of the square is \(3x(24-x)\), positive on \((0,24)\) and negative on \((24,36)\). Thus revenue increases up to \(24\) and decreases afterward. The endpoint revenues are both zero, whereas \(R(24)=24\sqrt{12}>0\). Since \(24\) is an integer, restricting sandwich counts to integers does not change this maximum.`,
  },
  {
    id: 10188,
    source: { ...stateConvention2024, questionNumber: 12 },
    number: 70,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 3,
    methods: [],
question: String.raw`If \(S\) is a set of real numbers, the supremum of \(S\), denoted \(\sup(S)\), is the “least upper bound” of \(S\); that is, the smallest value of \(y\) such that for all \(x\) in \(S\), \(x\le y\). The infimum of \(S\), denoted \(\inf(S)\), is the “greatest lower bound” of \(S\); that is, the largest value of \(y\) such that for all \(x\) in \(S\), \(y\le x\). If \(S\) is the set of all real \(x\) such that \(2<x^2<3\), compute \(\sup(S)\cdot\inf(S)\).`,
    choices: [String.raw`\(\sqrt6\)`, "3", "2", String.raw`\(-\sqrt6\)`, "NOTA"],
    answer: "E",
solution: String.raw`\(S\) is the set of all \(x\) such that \(-\sqrt3<x<-\sqrt2\) or \(\sqrt2<x<\sqrt3\). The smallest upper bound (supremum) of this set is \(\sqrt3\), and the greatest lower bound (infimum) of this set is \(-\sqrt3\), the product of which is \(\boxed{-3}\). Thus the answer is NOTA.`,
  },
  {
    id: 10189,
    source: { ...stateConvention2024, questionNumber: 13 },
    number: 71,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: ["L'Hopital's Rule", "Power Series"],
question: String.raw`Compute \(\displaystyle\lim_{x\to0}\frac{\sin(x)-\tan(x)}{x^3}\).`,
    choices: [String.raw`\(\frac16\)`, String.raw`\(-\frac12\)`, String.raw`\(-\frac16\)`, "0", "NOTA"],
    answer: "B",
solution: String.raw`The limit takes the form \(\frac00\), so we apply L’Hôpital’s rule to get
\[\lim_{x\to0}\frac{\sin(x)-\tan(x)}{x^3}=\lim_{x\to0}\frac{\cos(x)-\sec^2(x)}{3x^2}.\]
This also takes the form \(\frac00\), so we apply L’Hôpital’s rule again to get
\[\lim_{x\to0}\frac{\cos(x)-\sec^2(x)}{3x^2}=\lim_{x\to0}\frac{-\sin(x)-2\sec^2(x)\tan(x)}{6x}.\]
This once again takes the form \(\frac00\), so we apply L’Hôpital’s rule one last time to get
\[\lim_{x\to0}\frac{-\sin(x)-2\sec^2(x)\tan(x)}{6x}
=\lim_{x\to0}\frac{-\cos(x)-2\sec^4(x)-4\sec^2(x)\tan^2(x)}6
=-\frac36=\boxed{-\frac12}.\]
Alternatively, if you know the series expansions of sin and tan, you can compute
\[\lim_{x\to0}\frac{\sin(x)-\tan(x)}{x^3}
=\lim_{x\to0}\frac{(x-\frac{x^3}6+O(x^5))-(x+\frac{x^3}3+O(x^5))}{x^3}
=\lim_{x\to0}\frac{-\frac12x^3+O(x^5)}{x^3}=\boxed{-\frac12}.\]`,
  },
  {
    id: 10190,
    source: { ...stateConvention2024, questionNumber: 14 },
    number: 72,
    division: "Mu",
    topic: "Linear Approximation",
    difficulty: 2,
    methods: ["Linear Approximation"],
question: String.raw`Collot thinks of a positive integer \(n\) and wants to approximate \(\sqrt n\). To do this, he uses a tangent line approximation to the graph of \(y=\sqrt x\) at the point \((25,5)\). If the value of his approximation is \(\frac{28}5\), what is \(n\)?`,
    choices: ["29", "30", "31", "28", "NOTA"],
    answer: "C",
solution: String.raw`The slope of the tangent line to \(y=\sqrt x\) at \(x=25\) is \(\frac1{2\sqrt{25}}=\frac1{10}\). Thus the equation of the tangent line in question is \(y-5=\frac1{10}(x-25)\). We are interested in the value of \(x\) that gives \(y=\frac{28}5\). Plugging in \(y=\frac{28}5\) gives \(x=\boxed{31}\).`,
  },
  {
    id: 10191,
    source: { ...stateConvention2024, questionNumber: 15 },
    number: 73,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["U-Substitution", "Partial Fractions"],
question: String.raw`Evaluate \(\displaystyle\int_1^9\frac1{(8x+27)\sqrt{2x+7}}\,dx\).`,
    choices: [String.raw`\(\frac12\ln\frac{63}{55}\)`, String.raw`\(\frac12\ln\frac{51}{19}\)`, String.raw`\(\frac14\ln\frac{63}{55}\)`, String.raw`\(\frac14\ln\frac{51}{19}\)`, "NOTA"],
    answer: "C",
solution: String.raw`Substitute \(u=\sqrt{2x+7}\), \(du=\frac1{\sqrt{2x+7}}\,dx\) to get \(\int_3^5\frac1{4u^2-1}\,du\). Factoring \(4u^2-1=(2u+1)(2u-1)\), partial fraction decomposition gives \(\frac1{4u^2-1}=\frac{1/2}{2u-1}-\frac{1/2}{2u+1}\). Integrating gives
\[\left[\frac14\ln(2u-1)-\frac14\ln(2u+1)\right]_3^5
=\frac14(\ln(9)-\ln(5)-\ln(11)+\ln(7))=\boxed{\frac14\ln\left(\frac{63}{55}\right)}.\]`,
  },
  {
    id: 10192,
    source: { ...stateConvention2024, questionNumber: 16 },
    number: 74,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["Stirling's Approximation"],
question: String.raw`Let \(f(n)=\sqrt{2\pi n}\left(\frac ne\right)^n\). Stirling’s approximation states that \(\lim_{n\to\infty}\frac{n!}{f(n)}=1\) (often denoted \(n!\sim f(n)\)). Use this (or don’t, I’m not going to tell you how to live your life) to compute \(\displaystyle\lim_{n\to\infty}\frac{\sqrt[n]{n!}}n\).`,
    choices: [String.raw`\(\frac1e\)`, "0", "1", String.raw`\(\frac12\)`, "NOTA"],
    answer: "A",
solution: String.raw`Using Stirling’s approximation, the limit becomes
\[\lim_{n\to\infty}\frac{(\sqrt{2\pi n}(n/e)^n)^{1/n}}n
=\lim_{n\to\infty}(2\pi)^{1/(2n)}(n)^{1/(2n)}\cdot\left(\frac1e\right).\]
The first term clearly goes to 1 and the third is constant \(\frac1e\), so it suffices to look at the second. Let \(L=\lim_{n\to\infty}n^{1/(2n)}\Rightarrow\ln(L)=\lim_{n\to\infty}\frac{\ln(n)}{2n}=0\Rightarrow L=1\).
So the original limit is \(1\cdot1\cdot\frac1e=\boxed{\frac1e}\).

For a precise use of the approximation, write \(n!=f(n)r_n\), where \(r_n>0\) and \(r_n\to1\). Taking \(n\)th roots introduces the extra factor
\[r_n^{1/n}=\exp\!\left(\frac{\ln r_n}{n}\right)\longrightarrow1.\]
Also \((2\pi n)^{1/(2n)}=\exp(\ln(2\pi n)/(2n))\to1\), since a logarithm grows more slowly than \(n\). These two facts justify replacing the factorial by its Stirling expression inside the root.`,
  },
  {
    id: 10193,
    source: { ...stateConvention2024, questionNumber: 17 },
    number: 75,
    division: "Mu",
    topic: "Series",
    difficulty: 3,
    methods: ["Root Test", "Comparison Test"],
question: String.raw`Which of the following series converge?
\[\text{I: }\sum_{n=1}^{10^{100}}\frac1{\sqrt n}\qquad
\text{II: }\sum_{n=2}^{\infty}\frac{(-1)^n n}{\ln(n)}\]
\[\text{III: }\sum_{n=1}^{\infty}\frac{n!}{n^n}\qquad
\text{IV: }\sum_{n=1}^{\infty}(e^{1/n}-1).\]`,
    choices: ["III and IV only", "I and III only", "I and IV only", "I, II, and IV only", "NOTA"],
    answer: "B",
solution: String.raw`I: This is a finite sum of finite terms and thus converges.

II: This fails the \(n\)th term test; as \(n\) grows large, the terms of the sequence do not approach 0 (in fact, they grow in magnitude), so it diverges.

III: By the root test and \(\lim_{n\to\infty}\frac{\sqrt[n]{n!}}n=\frac1e<1\) (from Stirling’s approximation), this converges.

IV: By the inequality \(e^x\ge1+x\), we have \(e^{1/n}-1\ge\frac1n\), so \(\sum_{n=1}^{\infty}(e^{1/n}-1)\ge\sum_{n=1}^{\infty}\frac1n\), which diverges, so the original series diverges as well.

Therefore, the series that converge are \(\boxed{\text{I and III only}}\).`,
  },
  {
    id: 10194,
    source: { ...stateConvention2024, questionNumber: 18 },
    number: 76,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 3,
    methods: [],
question: String.raw`Evaluate \(\displaystyle\int_0^{2024\pi}\frac1{\sqrt{\arccos(\cos(x))}}\,dx\).`,
    choices: [String.raw`\(2024\sqrt\pi\)`, String.raw`\(1012\sqrt\pi\)`, String.raw`\(4048\sqrt\pi\)`, String.raw`\(9096\sqrt\pi\)`, "NOTA"],
    answer: "C",
solution: String.raw`Note that \(\arccos(\cos(x))\) consists of a bunch of “triangles”.
[[solution-diagram:mu-194]]
It thus suffices to calculate the integral from 0 to \(\pi\) and multiply by 2024. For \(0\le x\le\pi\), \(\arccos(\cos(x))=x\), so \(\int_0^\pi\frac1{\sqrt{\arccos(\cos(x))}}\,dx=\int_0^\pi\frac1{\sqrt x}\,dx=[2\sqrt x]_0^\pi=2\sqrt\pi\), and multiplying by 2024 gives \(\boxed{4048\sqrt\pi}\).

Here is why the multiplier is \(2024\), despite the period being \(2\pi\). On the second half of each period, \(\arccos(\cos x)=2\pi-x\), whose substitution \(u=2\pi-x\) gives the same integral as the first half. There are \(1012\) full periods, or \(2024\) equal half-period contributions.

Each zero at a multiple of \(2\pi\) creates an improper integral, not a divergence: locally the integrand has the form \(1/\sqrt{|x-2k\pi|}\). Its one-sided integral is finite because \(\int_0^\delta t^{-1/2}\,dt=2\sqrt\delta\). Thus splitting at all these points is valid.`,
  },
  {
    id: 10195,
    source: { ...stateConvention2024, questionNumber: 19 },
    number: 77,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["U-Substitution"],
question: String.raw`Evaluate \(\displaystyle\int_0^{1/2024}\sqrt{\frac1x-2024}\,dx\).`,
    choices: [String.raw`\(\frac{\pi\sqrt{506}}{506}\)`, String.raw`\(\frac{\pi\sqrt{506}}{4048}\)`, String.raw`\(\frac{\pi\sqrt{506}}{2024}\)`, String.raw`\(\frac{\pi\sqrt{506}}{1012}\)`, "NOTA"],
    answer: "C",
solution: String.raw`Substitute \(x=\frac u{2024}\) to get
\[\int_0^{1/2024}\sqrt{\frac1x-2024}\,dx
=\frac1{2024}\int_0^1\sqrt{\frac{2024}u-2024}\,du
=\frac1{\sqrt{2024}}\int_0^1\sqrt{\frac1u-1}\,du
=\frac1{\sqrt{2024}}\int_0^1\frac{\sqrt{1-u}}{\sqrt u}\,du.\]
Then substitute \(v=u^{1/2}\) to get
\[\frac1{\sqrt{2024}}\int_0^1 2\sqrt{1-v^2}\,dv
=\frac{2(\pi/4)}{\sqrt{2024}}=\boxed{\frac{\pi\sqrt{506}}{2024}},\]
where the \(\frac\pi4\) comes from \(y=\sqrt{1-x^2}\) being a quarter circle between \(x=0\) and \(x=1\).
Alternatively, if you’re familiar with the Gamma and Beta functions, then
\[\frac1{\sqrt{2024}}\int_0^1\frac{\sqrt{1-u}}{\sqrt u}\,du
=\frac1{\sqrt{2024}}B\left(\frac32,\frac12\right)
=\frac1{\sqrt{2024}}\frac{\Gamma(3/2)\Gamma(1/2)}{\Gamma(2)}
=\frac1{\sqrt{2024}}\frac{(\frac12\sqrt\pi)(\sqrt\pi)}1
=\boxed{\frac{\pi\sqrt{506}}{2024}}.\]`,
  },
  {
    id: 10196,
    source: { ...stateConvention2024, questionNumber: 20 },
    number: 78,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
question: String.raw`Find the smallest possible volume of a cone that has an inscribed cube of side length 1. Assume a right circular cone, with one face of the cube centered in the base plane and the opposite four vertices on the cone’s lateral surface.`,
    choices: [String.raw`\(\frac{32\pi}{27}\)`, String.raw`\(\frac{9\pi}{8}\)`, String.raw`\(\frac{4\pi}{3}\)`, String.raw`\(\frac{25\pi}{24}\)`, "NOTA"],
    answer: "B",
solution: String.raw`Take a cross section through a face diagonal of the cube. The 1 and \(\frac{\sqrt2}2\) in the diagram come from direct measurements on the cube. Now let the difference between the base radii of the cone and the cube’s circumscribed circle be \(\frac{x\sqrt2}2\) (this will make our algebra a bit cleaner; just letting it be \(x\) also works). Similar triangles show that the difference in heights \(h\) satisfies \(\frac1{x\sqrt2/2}=\frac h{\sqrt2/2}\Rightarrow h=\frac1x\), also shown in the diagram.
[[solution-diagram:mu-196]]
With this, the radius and height of the cone are \(\frac{\sqrt2}2(1+x)\) and \(1+\frac1x\) respectively. The volume of the cone is thus
\[\frac\pi6(1+x)^2\left(1+\frac1x\right)=\frac\pi6\left(x^2+3x+3+\frac1x\right).\]
Taking the derivative gives \(\frac\pi6(2x+3-\frac1{x^2})\), which is 0 if and only if \(2x+3=\frac1{x^2}\Rightarrow2x^3+3x^2-1=0\). Rational root theorem then motivates us to check \(x=\frac12\), so we can factor as \((2x-1)(x^2+2x+1)=0\Rightarrow x=\frac12,-1\). Only \(x=\frac12\) makes sense, and it’s not hard to check it corresponds to a minimum volume of \(\boxed{\frac{9\pi}8}\).

Here \(x>0\) because the cone's base radius exceeds the half-diagonal of the cube. On this domain,
\[V'(x)=\frac{\pi}{6x^2}(2x-1)(x+1)^2.\]
All factors except \(2x-1\) are positive. Therefore \(V\) decreases for \(0<x<1/2\) and increases for \(x>1/2\), proving a global minimum. At the minimum the height is \(3\) and radius is \(3\sqrt2/4\), giving
\[V=\frac13\pi(3\sqrt2/4)^2(3)=\frac{9\pi}{8}.\]`,
  },
  {
    id: 10197,
    source: { ...stateConvention2024, questionNumber: 21 },
    number: 79,
    division: "Mu",
    topic: "Riemann Sums",
    difficulty: 4,
    methods: ["Riemann Sums", "Partial Fractions"],
question: String.raw`Given that \(\ln(2)\approx0.693\), \(\ln(3)\approx1.099\), and \(\ln(5)\approx1.609\), which of the following is closest to
\[\frac1{2000^2+2000(1000)}+\frac1{2001^2+2001(1000)}+\frac1{2002^2+2002(1000)}+\cdots+\frac1{2999^2+2999(1000)}?\]`,
    choices: ["0.000287", "0.000119", "0.000283", "0.000104", "NOTA"],
    answer: "B",
solution: String.raw`Letting \(1000=n\), the sum in question is equivalent to \(\sum_{i=2n}^{3n-1}\frac1{i^2+in}\), noticing the resemblance to a Riemann sum, we manipulate to get
\[\sum_{i=2n}^{3n-1}\frac1{i^2+in}
=\frac1{n^2}\sum_{i=2n}^{3n-1}\frac1{(i/n)^2+(i/n)}
=\frac1n\left(\frac1n\sum_{i=2n}^{3n-1}\frac1{(i/n)^2+(i/n)}\right).\]
This latter term is a left-hand Riemann sum of the function \(\frac1{x^2+x}\) on the interval \((2,3)\) with \(n\) equal subintervals. As \(n\) grows large, the latter term approaches \(\int_2^3\frac1{x^2+x}\,dx\). Partial fraction decomposition yields \(\frac1{x^2+x}=\frac1x-\frac1{x+1}\), and integrating yields
\[[\ln(x)-\ln(x+1)]_2^3=\ln\left(\frac98\right)=2\ln(3)-3\ln(2)\approx0.119\]
using the given approximation. But we will need to account for the leading \(\frac1n\), which is \(\frac1{1000}\) in the actual sum. Multiplying it in gives \(\boxed{0.000119}\).

For reference, the actual value of the sum is approximately \(0.00011782\ldots\).

The sum has finitely many terms, so a limiting Riemann-sum argument gives an approximation, not an exact equality. Its error is small enough to identify the closest choice. Put \(g(x)=1/(x^2+x)\), \(\Delta x=1/1000\), and let \(L_{1000}\) be its left sum on \([2,3]\). Since \(g\) decreases,
\[0\le L_{1000}-\int_2^3g(x)\,dx
\le\frac{g(2)-g(3)}{1000}=\frac1{12000}.\]
The requested sum is \(L_{1000}/1000\), hence
\[\frac{\ln(9/8)}{1000}\le S
\le\frac{\ln(9/8)}{1000}+\frac1{12000000}.\]
Using the actual logarithm gives \(0.0001177830<S<0.0001178664\), throughout which \(0.000119\) is closer than \(0.000104\), \(0.000283\), or \(0.000287\). The supplied rounded logarithms give the source's quicker estimate \(0.000119\); they are not exact logarithmic values.`,
  },
  {
    id: 10198,
    source: { ...stateConvention2024, questionNumber: 22 },
    number: 80,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 4,
    methods: ["First-Order Linear Equations", "Integration by Parts"],
question: String.raw`Consider the differential equation \(y'+\frac y{x^2}=\frac1{x^3}\), where \(y\) is a function of \(x\). If \(y(1)=3\), compute \(y(2)\).
(Hint: find a function \(I(x)\) such that multiplying both sides of the differential equation by \(I(x)\) turns the left-hand side into \([y\cdot I(x)]'\), and then integrate both sides.)`,
    choices: [String.raw`\(\frac32+\sqrt e\)`, String.raw`\(\frac12+\frac3{\sqrt e}\)`, String.raw`\(\frac12+3\sqrt e\)`, String.raw`\(\frac32+\frac1{\sqrt e}\)`, "NOTA"],
    answer: "D",
solution: String.raw`Considering the hint, we want a function \(I(x)\) such that
\[y'I(x)+\frac{yI(x)}{x^2}=y'I(x)+yI'(x)\Rightarrow\frac{I(x)}{x^2}=I'(x).\]
This is a separable differential equation, and we can get
\[\frac{I'(x)}{I(x)}=\frac1{x^2}\Rightarrow\ln(I(x))=-\frac1x+C\Rightarrow I(x)=Ce^{-1/x}.\]
Multiplying the original equation through by \(I(x)\) (letting \(C=1\) because it doesn’t matter), we get
\[y'e^{-1/x}+\frac{ye^{-1/x}}{x^2}=\frac{e^{-1/x}}{x^3}.\]
By construction, the LHS is \([ye^{-1/x}]'\), which integrates to \(ye^{-1/x}\). The RHS then becomes \(\int\frac{e^{-1/x}}{x^3}\,dx\). Letting \(u=-\frac1x\), we get \(\int-ue^u\,du\), which integrates by parts to \(-ue^u+e^u+C\), so plugging back in gives
\[ye^{-1/x}=\frac1xe^{-1/x}+e^{-1/x}+C\Rightarrow y=\frac1x+1+Ce^{1/x}.\]
\(y(1)=3\) gives \(C=\frac1e\), so \(y(2)=\frac12+1+(e^{-1})(e^{1/2})=\boxed{\frac32+\frac1{\sqrt e}}\).`,
  },
  {
    id: 10199,
    source: { ...stateConvention2024, questionNumber: 23 },
    number: 81,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 4,
    methods: ["Disk Method", "U-Substitution"],
question: String.raw`One of Legom’s eggs can be modeled by the equation \(x^2+y^2=z(1-z)^{3/2}\). Compute the volume of such an egg.`,
    choices: [String.raw`\(\frac{4\pi}{35}\)`, String.raw`\(\frac{8\pi}{15}\)`, String.raw`\(\frac{4\pi}{15}\)`, String.raw`\(\frac{8\pi}{35}\)`, "NOTA"],
    answer: "A",
solution: String.raw`The \(x^2+y^2\) implies circular symmetry, so we can express the egg as a solid of revolution about the \(z\) axis. In particular, we can revolve the graph of \(x^2=z(1-z)^{3/2}\) about the \(z\)-axis to get the desired solid. Using the disk/washer method, the desired volume is \(\pi\int_0^1x^2\,dz=\pi\int_0^1z(1-z)^{3/2}\,dz\). Substitute \(u=1-z\) to get
\[\pi\int_0^1(1-u)u^{3/2}\,du=\pi\int_0^1(u^{3/2}-u^{5/2})\,du
=\pi\left[\frac25u^{5/2}-\frac27u^{7/2}\right]_0^1=\boxed{\frac{4\pi}{35}}.\]
Alternatively, if you’re familiar with the Gamma and Beta functions, you can compute
\[\pi\int_0^1z(1-z)^{3/2}\,dz
=\pi B\left(2,\frac52\right)
=\pi\frac{\Gamma(2)\Gamma(5/2)}{\Gamma(9/2)}
=\pi\frac{(1)(\frac32)(\frac12)\sqrt\pi}{(\frac72)(\frac52)(\frac32)(\frac12)\sqrt\pi}
=\boxed{\frac{4\pi}{35}}.\]`,
  },
  {
    id: 10200,
    source: { ...stateConvention2024, questionNumber: 24 },
    number: 82,
    division: "Mu",
    topic: "Applications of Integration",
    difficulty: 4,
    methods: [],
question: String.raw`For \(0<a<1\), consider the triangle formed by the tangent line to the graph of \(y=\sqrt[3]x\) at the point \((a,\sqrt[3]a)\) and the coordinate axes. Find the average area of this triangle over \(0<a<1\).`,
    choices: [String.raw`\(\frac37\)`, String.raw`\(\frac25\)`, String.raw`\(\frac27\)`, String.raw`\(\frac35\)`, "NOTA"],
    answer: "C",
solution: String.raw`The derivative of \(y=\sqrt[3]x\) at \((a,\sqrt[3]a)\) is \(\frac13a^{-2/3}\), so the tangent line can be written in standard form as
\[x-3a^{2/3}y=-2a,\]
the intercepts of which are \((-2a,0)\) and \((0,\frac23a^{1/3})\). The third vertex of the triangle is \((0,0)\), so the area of the triangle is \(\frac12(2a)(\frac23a^{1/3})=\frac23a^{4/3}\). To find the average value over \(0<a<1\) we compute
\[\frac1{1-0}\int_0^1\frac23a^{4/3}\,da=\boxed{\frac27}.\]`,
  },
  {
    id: 10201,
    source: { ...stateConvention2024, questionNumber: 25 },
    number: 83,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: ["Law of Cosines", "Implicit Differentiation"],
question: String.raw`The base of a 7 meter long ladder is fixed to the ground at a distance of 5 meters from the base of a tree, and the other end of the ladder is leaning against the tree. Suddenly, the tree begins to tip away from the ladder, with the angle \(\theta\) between the tree and the ground (facing the ladder) increasing at 2 radians per second (the base of the tree remains fixed, and the ladder remains in contact with the tree at its tips). Find the speed (in m/s) at which the top of the ladder is sliding parallel to the tree at the moment \(\theta=2\pi/3\).`,
    choices: [String.raw`\(\frac{30\sqrt3}{11}\)`, String.raw`\(\frac{30\sqrt3}{13}\)`, String.raw`\(\frac{30\sqrt3}{7}\)`, String.raw`\(30\sqrt3\)`, "NOTA"],
    answer: "A",
solution: String.raw`Consider the labeling as shown in the diagram.
[[solution-diagram:mu-201]]
The law of cosines gives \(a^2=b^2+c^2-2bc\cos(A)\), and we can plug in \(a=7\), \(b=5\), \(A=\frac{2\pi}3\) to get \(24=c^2+5c\Rightarrow c=3,-8\), of which only \(c=3\) makes sense. Differentiation gives
\[2aa'=2bb'+2cc'-2bc'\cos(A)-2b'c\cos(A)+2bc\sin(A)A'.\]
Plugging in \(a=7\), \(b=5\), \(c=3\), \(A=\frac{2\pi}3\), \(a'=b'=0\), and \(A'=2\) gives \(0=0+6c'+5c'+30\sqrt3\), so \(c'=-\frac{30\sqrt3}{11}\). The desired speed is precisely \(|c'|=\boxed{\frac{30\sqrt3}{11}}\).

The quantity \(c\) is the distance measured along the tree from its fixed base to the ladder's contact point. Thus \(c'<0\) means the ladder slides toward the tree's base. This is the along-tree sliding speed; it is not the magnitude of the contact point's full ground-frame velocity, which also includes motion from the tree's rotation. Since the problem asks for speed rather than signed velocity, take the absolute value.`,
  },
  {
    id: 10202,
    source: { ...stateConvention2024, questionNumber: 26 },
    number: 84,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: ["Infinite Geometric Series"],
question: String.raw`Suppose \(\sum_{n=0}^{\infty}a_nx^n\) is the Maclaurin series expansion of \(\frac1{x^2+x+1}\). Compute \(\displaystyle\sum_{n=0}^{\infty}\frac{a_{2n}}{2^n}\).`,
    choices: [String.raw`\(\frac{68}{63}\)`, String.raw`\(\frac{20}{21}\)`, String.raw`\(\frac{10}{7}\)`, String.raw`\(\frac67\)`, "NOTA"],
    answer: "D",
solution: String.raw`Recalling that \(1-x^3=(1-x)(x^2+x+1)\), we can write \(\frac1{x^2+x+1}=\frac{1-x}{1-x^3}=\frac1{1-x^3}-\frac{x}{1-x^3}\). Expanding the power series for \(\frac1{1-u}\) gives
\[\frac1{x^2+x+1}=1-x+x^3-x^4+x^6-x^7+\cdots,\]
so \(a_{3n}=1\), \(a_{3n+1}=-1\), and \(a_{3n+2}=0\). The desired sum is thus
\[1-\frac1{2^2}+\frac1{2^3}-\frac1{2^5}+\frac1{2^6}-\frac1{2^8}+\cdots
=\left(1-\frac14\right)\left(1+\frac18+\frac1{64}+\cdots\right)=\frac34\left(\frac1{1-1/8}\right)=\boxed{\frac67}.\]
Alternatively, note that plugging in \(x=\frac1{\sqrt2}\) to our power series gives
\[\sum_{n=0}^{\infty}\frac{a_{2n}}{2^n}+\sum_{n=0}^{\infty}\frac{a_{2n+1}}{2^n\sqrt2},\]
while plugging in \(x=-\frac1{\sqrt2}\) gives
\[\sum_{n=0}^{\infty}\frac{a_{2n}}{2^n}-\sum_{n=0}^{\infty}\frac{a_{2n+1}}{2^n\sqrt2}.\]
Adding these and dividing by 2 gives our desired sum. But we could also plug these values into \(\frac1{x^2+x+1}\) to get
\[\frac12\left(\frac1{\frac12+\frac1{\sqrt2}+1}+\frac1{\frac12-\frac1{\sqrt2}+1}\right)
=\frac12\left(\frac2{3+\sqrt2}+\frac2{3-\sqrt2}\right)=\boxed{\frac67}.\]
Both substitutions are valid because the geometric expansion converges absolutely for \(|x|<1\), and \(1/\sqrt2<1\). Absolute convergence also permits separating the even and odd terms. In the last simplification,
\[\frac1{3+\sqrt2}+\frac1{3-\sqrt2}
=\frac{(3-\sqrt2)+(3+\sqrt2)}{9-2}=\frac67.\]`,
  },
  {
    id: 10203,
    source: { ...stateConvention2024, questionNumber: 27 },
    number: 85,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 5,
    methods: ["Arc Length"],
question: String.raw`Suppose \(f\) is a continuous function that takes on non-negative real values such that \(\int_0^3f(x)\,dx=4\). If \(S\) is the set of all possible values of \(\int_0^3\sqrt{1+(f(x))^2}\,dx\), compute \(\sup(S)+\inf(S)\). Here \(\sup(S)\) is the least upper bound of \(S\), and \(\inf(S)\) is the greatest lower bound.`,
    choices: ["10", "9", "12", "15", "NOTA"],
    answer: "C",
solution: String.raw`Note that the desired integral looks like an arc length integral, just with \(f(x)\) instead of \(f'(x)\). This motivates us to set \(F(x)=\int_0^x f(t)\,dt\), recalling that \(F'(x)=f(x)\) by the first fundamental theorem of calculus. The given conditions then become that \(F\) is a nondecreasing function with \(F(0)=0\) and \(F(3)=4\), and we are interested in the arc length of \(F\) between \(x=0\) and \(x=3\). The shortest possible arc length is given by a straight line, which has length \(\sqrt{3^2+4^2}=5\). Note that the graph of \(F\) moves up 4 units and right 3 units, for a total of 7 units, and any diagonal movement decreases this sum, so 7 is an upper bound.

To make both bounds rigorous, the function \(\phi(t)=\sqrt{1+t^2}\) has \(\phi''(t)=(1+t^2)^{-3/2}>0\). Its tangent at \(t=4/3\) gives the pointwise bound
\[\sqrt{1+t^2}\ge\frac35+\frac45t.\]
Integrating with \(t=f(x)\) gives
\[\int_0^3\sqrt{1+f(x)^2}\,dx
\ge\frac35(3)+\frac45(4)=5.\]
Equality holds for the allowed continuous function \(f(x)=4/3\). Thus \(\inf(S)=5\), and this infimum is attained.

For the upper bound, \(t\ge0\) implies \(\sqrt{1+t^2}\le1+t\), with strict inequality for \(t>0\). Since \(f\) is continuous and its integral is \(4>0\), it is positive on some interval. Therefore
\[\int_0^3\sqrt{1+f(x)^2}\,dx<\int_0^3(1+f(x))\,dx=7.\]

The paper approaches \(7\) with a piecewise linear \(F\), but its corner would make \(f=F'\) discontinuous. An explicit continuous replacement avoids that issue. For \(0<\varepsilon<3\), take the triangular spike
\[f_\varepsilon(x)=
\begin{cases}
0,&0\le x\le3-\varepsilon,\\
\dfrac{16(x-3+\varepsilon)}{\varepsilon^2},
&3-\varepsilon\le x\le3-\varepsilon/2,\\
\dfrac{16(3-x)}{\varepsilon^2},
&3-\varepsilon/2\le x\le3.
\end{cases}\]
It is nonnegative and continuous, and its triangular area is
\(\frac12\varepsilon(8/\varepsilon)=4\). Outside its support the length integrand is \(1\); on its support it is at least \(f_\varepsilon\). Consequently,
\[7-\varepsilon=(3-\varepsilon)+4
\le\int_0^3\sqrt{1+f_\varepsilon(x)^2}\,dx<7.\]
Letting \(\varepsilon\to0^+\) proves \(\sup(S)=7\), though \(7\) is never attained. Hence \(\sup(S)+\inf(S)=7+5=\boxed{12}\).

In fact \(S=[5,7)\): interpolate between \(4/3\) and a spike by \(f_t=(1-t)(4/3)+tf_\varepsilon\). Every \(f_t\) remains admissible, and its length varies continuously with \(t\). The intermediate value theorem, together with spikes arbitrarily close to \(7\), supplies every value between \(5\) and \(7\).`,
  },
  {
    id: 10204,
    source: { ...stateConvention2024, questionNumber: 28 },
    number: 86,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: [],
question: String.raw`Evaluate \(\displaystyle\int_0^{2\pi}\frac1{1+e^{\sin^3(x)}}\,dx\).`,
    choices: [String.raw`\(\frac{2\pi}{3}\)`, String.raw`\(2\pi\)`, String.raw`\(\pi\)`, String.raw`\(\frac{4\pi}{3}\)`, "NOTA"],
    answer: "C",
solution: String.raw`Note that
\[\frac1{1+e^{\sin^3(x+\pi)}}=\frac1{1+e^{-\sin^3(x)}}=\frac{e^{\sin^3(x)}}{1+e^{\sin^3(x)}}.\]
This motivates us to split up the given integral into
\[\int_0^\pi\frac1{1+e^{\sin^3(x)}}\,dx+\int_\pi^{2\pi}\frac1{1+e^{\sin^3(x)}}\,dx.\]
The substitution \(x=u+\pi\) turns the latter integral into
\[\int_0^\pi\frac1{1+e^{\sin^3(u+\pi)}}\,du=\int_0^\pi\frac{e^{\sin^3(u)}}{1+e^{\sin^3(u)}}\,du.\]
Adding this to the first integral gives \(\int_0^\pi\frac{1+e^{\sin^3(x)}}{1+e^{\sin^3(x)}}\,dx=\int_0^\pi1\,dx=\boxed{\pi}\).`,
  },
  {
    id: 10205,
    source: { ...stateConvention2024, questionNumber: 29 },
    number: 87,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Integration by Parts", "Stirling's Approximation"],
question: String.raw`A sequence \(I_0,I_1,\ldots\) is defined via \(I_n=\int_{-\infty}^{\infty}x^{2n}e^{-x^2}\,dx\). Which of the following functions \(f(n)\) satisfies the property that \(L=\lim_{n\to\infty}\frac{I_n}{f(n)}\) is finite and nonzero?
You may use Stirling’s approximation \(n!\sim\sqrt{2\pi n}(n/e)^n\).`,
    choices: [String.raw`\(\left(\frac{2n}e\right)^n\)`, String.raw`\(\left(\frac ne\right)^n\)`, String.raw`\(\left(\frac ne\right)^n\sqrt n\)`, String.raw`\(\left(\frac{2n}e\right)^n\sqrt n\)`, "NOTA"],
    answer: "B",
solution: String.raw`Rewrite \(I_{n+1}=\int_{-\infty}^{\infty}x^{2n+1}(xe^{-x^2})\,dx\). Integration by parts yields
\[I_{n+1}=\left[x^{2n+1}\left(-\frac12e^{-x^2}\right)\right]_{-\infty}^{\infty}
+\frac{2n+1}{2}\int_{-\infty}^{\infty}x^{2n}e^{-x^2}\,dx.\]
The boundary term vanishes at both \(-\infty\) and \(+\infty\): exponential decay beats every fixed power of \(x\). All these improper integrals converge for the same reason. Applying integration by parts first on finite intervals and then taking limits is therefore valid. The remaining integral is \(I_n\), so we can simplify to \(I_{n+1}=\frac{2n+1}{2}I_n\). Iterating this yields \(I_n=\frac{(2n-1)(2n-3)\cdots(3)(1)}{2^n}I_0\). The numerator can be written as \(\frac{(2n)!}{2^n(n!)}\) (the denominator removes the even terms), so \(I_n=\frac{(2n)!}{4^n(n!)}I_0\). By Stirling’s approximation, this is approximately
\[\frac{\sqrt{2\pi(2n)}(2n/e)^{2n}}{4^n\sqrt{2\pi n}(n/e)^n}I_0
=\frac{\sqrt2\,n^n}{e^n}I_0\]
as \(n\) grows large.
Thus \(f(n)=\boxed{\left(\frac ne\right)^n}\) gives \(L=\lim_{n\to\infty}\frac{I_n}{f(n)}=\sqrt2 I_0\), which is finite and nonzero.

Explicitly, the square-root prefactors give \(\sqrt{4\pi n}/\sqrt{2\pi n}=\sqrt2\), while
\[\frac{(2n/e)^{2n}}{4^n(n/e)^n}=(n/e)^n.\]
The ratios omitted in each Stirling approximation tend to \(1\), so their quotient also tends to \(1\). This establishes an asymptotic equivalence, not merely a guess about growth.

The other choices give zero limits: dividing by choice A adds a factor \(2^{-n}\), dividing by C adds \(n^{-1/2}\), and dividing by D adds both factors. Only B leaves a nonzero finite limit.`,
  },
  {
    id: 10206,
    source: { ...stateConvention2024, questionNumber: 30 },
    number: 88,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Stirling's Approximation"],
question: String.raw`For the appropriate choice of \(f(n)\) in the previous problem, compute \(L\). It may be helpful to know that \(\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt\pi\).

For this standalone question, the preceding result is
\[I_n=\int_{-\infty}^{\infty}x^{2n}e^{-x^2}\,dx
=\frac{(2n)!}{4^n n!}I_0,\qquad
f(n)=(n/e)^n,\qquad L=\sqrt2 I_0.\]`,
    choices: [String.raw`\(\pi\sqrt2\)`, String.raw`\(\frac{\pi\sqrt2}{2}\)`, String.raw`\(\frac{\sqrt{2\pi}}2\)`, String.raw`\(\sqrt{2\pi}\)`, "NOTA"],
    answer: "D",
solution: String.raw`Using the work from the previous problem, \(L=\sqrt2 I_0\). From the given integral \(I_0=\sqrt\pi\), so \(L=\sqrt2\sqrt\pi=\boxed{\sqrt{2\pi}}\).

To see the cancellation directly, apply Stirling's approximation to the given formula:
\[I_n\sim\frac{\sqrt{4\pi n}(2n/e)^{2n}}{4^n\sqrt{2\pi n}(n/e)^n}\sqrt\pi
=\sqrt{2\pi}\left(\frac ne\right)^n.\]
Therefore
\[\lim_{n\to\infty}\frac{I_n}{(n/e)^n}=\boxed{\sqrt{2\pi}}.\]`,
  },
  // FAMAT January Statewide Calculus Individual Test.
  // Retained source questions map to public Mu 89-116; original 26/28 are excluded.
  // Original source numbers and established IDs 10207-10235 remain unchanged.
  // Preserve all remaining IDs/numbers and credit original paper numbers.
  {
    id: 10207,
    source: { ...januaryStatewide2026, questionNumber: 1 },
    number: 89,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Evaluate \(\displaystyle\lim_{x\to-1}f(x)\). Select DNE if you believe the limit does not exist.`,
    illustration: {
      src: "/questions/mu-207-210-original.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1380,
      height: 523,
    },
    choices: ["−1", "3", "4", "DNE", "NOTA"],
    answer: "D",
    solution: String.raw`The left-hand and right-hand limits are different; therefore, the limit does not exist.

Reading the open endpoints of the two pieces near \(x=-1\),
\[\lim_{x\to-1^-}f(x)=4,\qquad\lim_{x\to-1^+}f(x)=3.\]
A two-sided limit exists only when the one-sided limits agree. The filled dot giving \(f(-1)=1\) does not change either limiting value. Thus select DNE.`,
  },
  {
    id: 10208,
    source: { ...januaryStatewide2026, questionNumber: 2 },
    number: 90,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Determine \(\displaystyle\lim_{x\to-1}[f(x)g(x)]\). Select DNE if you believe the limit does not exist.`,
    illustration: {
      src: "/questions/mu-207-210-original.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1380,
      height: 523,
    },
    choices: ["0", "3", "4", "DNE", "NOTA"],
    answer: "A",
    solution: String.raw`The limit exists as long as
\[\lim_{x\to-1^-}[f(x)g(x)]=\lim_{x\to-1^+}[f(x)g(x)].\]
From the graphs,
\[\lim_{x\to-1^-}[f(x)g(x)]=(4)(0)=0,\qquad
\lim_{x\to-1^+}[f(x)g(x)]=(3)(0)=0.\]
Therefore, \(\displaystyle\lim_{x\to-1}[f(x)g(x)]=0\).`,
  },
  {
    id: 10209,
    source: { ...januaryStatewide2026, questionNumber: 3 },
    number: 91,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Determine \(\displaystyle\lim_{x\to0^-}f(g(x))\). Select DNE if you believe the limit does not exist.`,
    illustration: {
      src: "/questions/mu-207-210-original.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1380,
      height: 523,
    },
    choices: ["1", "3", "4", "DNE", "NOTA"],
    answer: "B",
    solution: String.raw`\(\displaystyle\lim_{x\to0^-}g(x)=-1\). As this value is approached from above, the outer limit of \(f(x)\) is approached from the right. Thus,
\[\lim_{x\to0^-}f(g(x))=\lim_{x\to-1^+}f(x)=3.\]`,
  },
  {
    id: 10210,
    source: { ...januaryStatewide2026, questionNumber: 4 },
    number: 92,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 1,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Determine the product of \(f(-1)\) and \(g(-3)\).`,
    illustration: {
      src: "/questions/mu-207-210-original.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1380,
      height: 523,
    },
    choices: ["−2", "−1", "1", "DNE", "NOTA"],
    answer: "E",
    solution: String.raw`From the filled points on the graphs, \(f(-1)=1\) and \(g(-3)=3\). Thus \(f(-1)g(-3)=3\), which is not an answer choice.`,
  },
  {
    id: 10211,
    source: { ...januaryStatewide2026, questionNumber: 5 },
    number: 93,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    question: String.raw`Evaluate \(\displaystyle\lim_{n\to\infty}\left(\frac{n+3}{n-2}\right)^n\).`,
    choices: [String.raw`\(e^{-2}\)`, String.raw`\(e^2\)`, String.raw`\(e^3\)`, String.raw`\(e^5\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Rewrite
\[\left(\frac{n+3}{n-2}\right)^n
=\left(\frac{n-2+5}{n-2}\right)^n
=\left(1+\frac5{n-2}\right)^n.\]
To justify the exponential limit exactly, let \(m=n-2\). Then \(m\to\infty\) and
\[\left(1+\frac5{n-2}\right)^n
=\left(1+\frac5m\right)^m\left(1+\frac5m\right)^2.\]
The first factor tends to \(e^5\) by the standard limit \((1+c/m)^m\to e^c\), and the second tends to 1. Therefore the limit is \(e^5\).`,
  },
  {
    id: 10212,
    source: { ...januaryStatewide2026, questionNumber: 6 },
    number: 94,
    division: "Mu",
    topic: "Linear Approximation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`Given the curve \(\arctan(y)=x+\frac12y\), use the line tangent to the curve at \(\left(\frac{\pi-\sqrt3}{6},\frac1{\sqrt3}\right)\) to give the tangent-line estimate of \(y\) at \(x=\frac35\).`,
    choices: [String.raw`\(\frac{\sqrt3}{3}+\frac{10\pi-36-10\sqrt3}{15}\)`, String.raw`\(\sqrt3+\frac{10\pi-36-10\sqrt3}{15}\)`, String.raw`\(\frac{\sqrt3}{3}+\frac{36-10\pi}{15}\)`, String.raw`\(\sqrt3+\frac{36-10\pi}{15}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Differentiate implicitly:
\[\frac1{1+y^2}y'=1+\frac12y'.\]
Rearranging,
\[y'=\frac1{\frac1{1+y^2}-\frac12}.\]
At \(y=1/\sqrt3\), this gives \(y'=1/(3/4-1/2)=4\). Building the equation of the tangent line, we have
\[L(x)=\frac1{\sqrt3}+4\left(x-\frac{\pi-\sqrt3}{6}\right).\]
The requested tangent-line estimate is therefore
\[L\!\left(\frac35\right)=\frac1{\sqrt3}+4\left(\frac35-\frac{\pi-\sqrt3}{6}\right)
=\frac{\sqrt3}{3}+\frac{36-10\pi+10\sqrt3}{15}
=\sqrt3+\frac{36-10\pi}{15}.\]
This is a formal extrapolation of the tangent line, not a guaranteed accurate value on the curve. In fact, on the positive-y branch, \(x=\arctan y-y/2\) has maximum \(\pi/4-1/2<3/5\), attained at \(y=1\). Thus the positive branch through the given point does not reach the requested x-coordinate; the tangent-line estimate itself is nevertheless well-defined.`,
  },
  {
    id: 10213,
    source: { ...januaryStatewide2026, questionNumber: 7 },
    number: 95,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Mean Value Theorem"],
    question: String.raw`Given the function
\[f(x)=\begin{cases}x\sin(1/x),&x\ne0,\\0,&x=0,\end{cases}\]
which of the following statements is correct regarding whether or not the Mean Value Theorem (MVT) guarantees a value \(c\in(0,2/\pi)\) such that
\[f'(c)=\frac{f(2/\pi)-f(0)}{2/\pi-0}?\]`,
    choices: ["MVT applies", String.raw`MVT does not apply because \(f\) is not continuous on \([0,2/\pi]\)`, String.raw`MVT does not apply because \(f\) is not differentiable on \((0,2/\pi)\)`, String.raw`MVT does not apply because \(f'\) is not bounded near \(0\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The function is differentiable over the open interval and continuous on the closed interval, so the MVT applies. Although \(f'\) is unbounded near 0, this does not invalidate the application of the MVT.

For \(x\ne0\), \(x\sin(1/x)\) is differentiable. At the only potentially troublesome endpoint, 0, the bound
\[|x\sin(1/x)|\le|x|\]
shows by the squeeze theorem that \(f(x)\to0=f(0)\). Thus \(f\) is continuous on \([0,2/\pi]\) and differentiable throughout \((0,2/\pi)\). The theorem does not require differentiability at the endpoints or a derivative bounded near them.

Indeed, \(f(2/\pi)=2/\pi\), so the secant slope is 1. The MVT guarantees at least one \(c\in(0,2/\pi)\) with \(f'(c)=1\).`,
  },
  {
    id: 10214,
    source: { ...januaryStatewide2026, questionNumber: 8 },
    number: 96,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: ["Rationalization"],
    question: String.raw`Evaluate
\[\lim_{x\to\infty}\left(\sqrt{3x^2-5x+4}-\sqrt{3x^2+7x+9}\right).\]`,
    choices: ["−2", String.raw`\(-2\sqrt3\)`, "0", String.raw`\(-\frac{4\sqrt3}{3}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Multiply by the conjugate:
\[\frac{-12x-5}{\sqrt{3x^2-5x+4}+\sqrt{3x^2+7x+9}}.\]
Dividing the numerator and denominator by \(x\) and taking the limit gives
\[\frac{-12}{2\sqrt3}=-2\sqrt3.\]`,
  },
  {
    id: 10215,
    source: { ...januaryStatewide2026, questionNumber: 9 },
    number: 97,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Rule"],
    question: String.raw`Given that \(f(x)=x^6+6x^5+15x^4+20x^3+15x^2+6x+1\), determine \(f'(1)\).`,
    choices: ["64", "182", "192", "193", "NOTA"],
    answer: "C",
    solution: String.raw`Notice that \(f(x)=(x+1)^6\). Thus \(f'(x)=6(x+1)^5\), so \(f'(1)=6(2)^5=192\).`,
  },
  {
    id: 10216,
    source: { ...januaryStatewide2026, questionNumber: 10 },
    number: 98,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    question: String.raw`Evaluate \(\displaystyle\lim_{x\to0}\frac{\sin^2(2x)\tan^2(3x)\sec^2(4x)}{x^4}\). If you believe the limit does not exist, select DNE.`,
    choices: ["0", "9", "18", "DNE", "NOTA"],
    answer: "E",
    solution: String.raw`Reorganize the expression as
\[\left(\frac{\sin(2x)}x\right)^2
\left(\frac{\tan(3x)}x\right)^2\sec^2(4x).\]
The limit is \((2^2)(3^2)(1^2)=36\), which is not an answer choice.`,
  },
  {
    id: 10217,
    source: { ...januaryStatewide2026, questionNumber: 11 },
    number: 99,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: ["Related Rates"],
    question: String.raw`A circle is inscribed inside a square which is, in turn, inscribed inside an equilateral triangle, with one side of the square lying on a side of the triangle. At the moment when a side length of the square is \(6\text{ cm}\), the area of the circle is increasing at a rate of \(3\text{ cm}^2/\text{sec}\). At this instant, what is the rate at which the area of the equilateral triangle is increasing in \(\text{cm}^2/\text{sec}\)?`,
    choices: [String.raw`\(\frac{24+14\sqrt3}{\pi}\)`, String.raw`\(\frac{24+14\sqrt3}{3\pi}\)`, String.raw`\(\frac{12+7\sqrt3}{\pi}\)`, String.raw`\(\frac{48+28\sqrt3}{3\pi}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(s\) be the side length of the square. The inscribed circle has radius \(r=s/2\), so
\[A_c=\frac\pi4s^2,\qquad \frac{dA_c}{dt}=\frac\pi2s\frac{ds}{dt}.\]
At \(s=6\) and \(dA_c/dt=3\), we obtain \(3=(\pi/2)(6)(ds/dt)\), so \(ds/dt=1/\pi\).

Let \(a\) be the side length of the equilateral triangle. Comparing the triangle above the square with the full triangle using similar triangles gives
[[solution-diagram:mu-217]]
The height of the full triangle is \(\sqrt3a/2\). The small equilateral triangle above the square has side \(s\) and height \(\sqrt3s/2\). The difference of these heights is the square's height \(s\), so
\[s=\frac{\sqrt3}{2}a-\frac{\sqrt3}{2}s,\qquad a=s\left(1+\frac2{\sqrt3}\right).\]
Thus
\[A_t=\frac{\sqrt3}{4}a^2=\left(1+\frac{7\sqrt3}{12}\right)s^2.\]
Therefore, at \(s=6\),
\[\frac{dA_t}{dt}=2\left(1+\frac{7\sqrt3}{12}\right)s\frac{ds}{dt}
=\frac{12+7\sqrt3}{\pi}.\]`,
  },
  {
    id: 10218,
    source: { ...januaryStatewide2026, questionNumber: 12 },
    number: 100,
    division: "Mu",
    topic: "Optimization",
    difficulty: 1,
    methods: [],
    question: String.raw`Determine the x-coordinate of the point corresponding to the absolute maximum value of \(f(x)=x^3-3x^2+2\) over the domain \([-1,4]\).`,
    choices: ["−1", "0", "2", "4", "NOTA"],
    answer: "D",
    solution: String.raw`Differentiate to get \(f'(x)=3x^2-6x=3x(x-2)\), so the critical points are \(x=0\) and \(x=2\). Checking these and the endpoints gives
\[f(-1)=-2,\quad f(0)=2,\quad f(2)=-2,\quad f(4)=18.\]
Therefore, the absolute maximum occurs at \(x=4\).`,
  },
  {
    id: 10219,
    source: { ...januaryStatewide2026, questionNumber: 13 },
    number: 101,
    division: "Mu",
    topic: "Inverse Functions",
    difficulty: 2,
    methods: ["Derivative of Inverse Functions"],
    question: String.raw`Given that \(f(x)=x^3-2x+2\), and given that \(g(x)\) is the local inverse of \(f(x)\) near \(x=2\), with \(g(6)=2\), determine the value of \((g'(6))^3\).`,
    choices: [String.raw`\(\frac1{1000}\)`, String.raw`\(\frac1{100}\)`, String.raw`\(\frac1{27}\)`, String.raw`\(\frac1{12}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Since \(f(2)=6\), the inverse-function derivative formula gives
\[g'(6)=\frac1{f'(2)}.\]
Because \(f'(x)=3x^2-2\), we have \(f'(2)=10\ne0\), so the inverse function theorem ensures this local inverse exists. The cubic is not one-to-one on the whole real line, which is why the branch is specified. Therefore,
\[(g'(6))^3=\left(\frac1{10}\right)^3=\frac1{1000}.\]`,
  },
  {
    id: 10220,
    source: { ...januaryStatewide2026, questionNumber: 14 },
    number: 102,
    division: "Mu",
    topic: "Riemann Sums",
    difficulty: 4,
    methods: ["Riemann Sums"],
    question: String.raw`Evaluate
\[\lim_{n\to\infty}\sum_{k=1}^n\frac{e^{2k/n}(n^2+kn+k^2)}{n^3}.\]`,
    choices: [String.raw`\(\frac{3e^2}{2}\)`, String.raw`\(\frac{e^2-1}{2}\)`, String.raw`\(\frac{2e^2-1}{2}\)`, String.raw`\(\frac{3e^2-1}{4}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Rewrite the sum as
\[\sum_{k=1}^n e^{2k/n}\left(1+\frac kn+\frac{k^2}{n^2}\right)\frac1n.\]
This is a Riemann sum for
\[\int_0^1e^{2x}(1+x+x^2)\,dx.\]
Integrate each term separately using integration by parts for the second and third terms:
\[\int e^{2x}\,dx=\frac12e^{2x},\]
\[\int xe^{2x}\,dx=\frac12xe^{2x}-\frac14e^{2x},\]
\[\int x^2e^{2x}\,dx=\frac12x^2e^{2x}-\frac12xe^{2x}+\frac14e^{2x}.\]
Adding these cancels the linear terms and the extra constants, leaving \(\frac12e^{2x}(1+x^2)\) as an antiderivative. Now plug in the limits of the integral:
\[\int_0^1e^{2x}(1+x+x^2)\,dx
=\left[\frac12e^{2x}(1+x^2)\right]_0^1
=e^2-\frac12=\frac{2e^2-1}{2}.\]`,
  },
  {
    id: 10221,
    source: { ...januaryStatewide2026, questionNumber: 15 },
    number: 103,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 4,
    methods: ["Implicit Differentiation"],
    question: String.raw`Select the correct expression for \(\frac{dy}{dx}\) given the curve
\[x^2y^3+e^{xy}=\ln(xy)+xy^2.\]`,
    choices: [String.raw`\(\frac{-2x^2y^4+xy^2e^{xy}-xy^3}{3x^3y^3+x^2ye^{xy}-x-2x^2y^2}\)`, String.raw`\(\frac{2x^2y^4+xy^2e^{xy}-y-xy^3}{3x^3y^3+x^2ye^{xy}-x-2x^2y^2}\)`, String.raw`\(\frac{2x^2y^4-xy^2e^{xy}-y-xy^3}{3x^3y^3+x^2ye^{xy}-x-2x^2y^2}\)`, String.raw`\(\frac{-2x^2y^4-xy^2e^{xy}+y+xy^3}{3x^3y^3+x^2ye^{xy}-x-2x^2y^2}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Differentiate implicitly:
\[2xy^3+3x^2y^2y'+e^{xy}(y+xy')=\frac1x+\frac{y'}y+y^2+2xyy'.\]
Here \(xy>0\) is required by \(\ln(xy)\), so neither \(x\) nor \(y\) is zero. Collecting the \(y'\) terms gives
\[\left(3x^2y^2+xe^{xy}-\frac1y-2xy\right)y'
=\frac1x+y^2-2xy^3-ye^{xy}.\]
Factoring out \(y'\), dividing by its coefficient where nonzero, and multiplying the numerator and denominator by \(xy\) gives
\[\frac{dy}{dx}=\frac{-2x^2y^4-xy^2e^{xy}+y+xy^3}{3x^3y^3+x^2ye^{xy}-x-2x^2y^2}.\]`,
  },
  {
    id: 10222,
    source: { ...januaryStatewide2026, questionNumber: 16 },
    number: 104,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: ["L'Hopital's Rule"],
    question: String.raw`Evaluate
\[\lim_{x\to0}\left(1+\frac{\ln(1+x^2)}{\sin^2x}\right)^{1/\tan^2x}.\]
If the limit does not approach a finite real number, then select DNE.`,
    choices: ["1", String.raw`\(e^{1/3}\)`, String.raw`\(e^{1/2}\)`, "DNE", "NOTA"],
    answer: "D",
    solution: String.raw`Make
\[L(x)=\left(1+\frac{\ln(1+x^2)}{\sin^2x}\right)^{1/\tan^2x},\qquad
E(x)=\ln L(x)=\frac{\ln\left(1+\frac{\ln(1+x^2)}{\sin^2x}\right)}{\tan^2x}.\]
Therefore \(L(x)=e^{E(x)}\). First evaluate the inner ratio. One may apply L'Hopital's rule twice, or use standard limits directly:
\[\frac{\ln(1+x^2)}{\sin^2x}
=\frac{\ln(1+x^2)}{x^2}\left(\frac{x}{\sin x}\right)^2\longrightarrow1\cdot1=1.\]
Thus the numerator in \(E(x)\) tends to \(\ln(1+1)=\ln2>0\), while its denominator \(\tan^2x\) tends to 0 through positive values from either side. Consequently \(E(x)\to+\infty\), and hence \(L(x)\to+\infty\).

This does not approach a finite real number, so the instruction requires DNE, choice D. The base approaches 2, not 1, so this is not the usual finite \(1^\infty\) exponential-limit situation.`,
  },
  {
    id: 10223,
    source: { ...januaryStatewide2026, questionNumber: 17 },
    number: 105,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["Distance Formula", "Tangency"],
    question: String.raw`Determine the shortest distance between the curve \(y=x^2+3\) and the line \(y=2x-1\).`,
    choices: [String.raw`\(\frac2{\sqrt5}\)`, String.raw`\(\frac3{\sqrt5}\)`, String.raw`\(\frac4{\sqrt5}\)`, String.raw`\(\sqrt5\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The closest tangent line to the parabola must have the same slope as the given line. Since \(y'=2x\), this occurs at \(x=1\), giving the point \((1,4)\). The parallel line through this point is
\[y-4=2(x-1),\quad\text{or}\quad 2x-y+2=0.\]
The given line is \(2x-y-1=0\). The distance between these parallel lines is
\[\frac{|2-(-1)|}{\sqrt{2^2+(-1)^2}}=\frac3{\sqrt5}.\]
To verify this is the global minimum rather than just a stationary candidate, the distance from an arbitrary point \((x,x^2+3)\) on the parabola to the given line is
\[d(x)=\frac{|2x-(x^2+3)-1|}{\sqrt5}
=\frac{(x-1)^2+3}{\sqrt5}\ge\frac3{\sqrt5}.\]
Equality occurs at \(x=1\). Alternatively, the normal line at \((1,4)\) is \(y-4=-\frac12(x-1)\), or \(y=-x/2+9/2\). Its intersection with \(y=2x-1\) is \((11/5,17/5)\), and the distance from \((1,4)\) to this perpendicular foot is
\[\sqrt{\left(\frac{11}5-1\right)^2+\left(\frac{17}5-4\right)^2}
=\sqrt{\frac{36}{25}+\frac9{25}}=\frac3{\sqrt5}.\]`,
  },
  {
    id: 10224,
    source: { ...januaryStatewide2026, questionNumber: 18 },
    number: 106,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Power Rule"],
    question: String.raw`If \(f(a)=b\), which of the following could be \(f'(a)\) given \(f(x)=x^2+(1-2a)x+b\)?`,
    choices: ["−1", "0", "1", "2", "NOTA"],
    answer: "C",
    solution: String.raw`The condition \(f(a)=b\) gives
\[a^2+(1-2a)a+b=b,\]
so \(a^2-a=0\) and \(a=0\) or \(a=1\). Since
\[f'(x)=2x+1-2a,\]
we have \(f'(a)=1\) for either possible value of \(a\).`,
  },
  {
    id: 10225,
    source: { ...januaryStatewide2026, questionNumber: 19 },
    number: 107,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 4,
    methods: ["Logarithmic Differentiation", "Implicit Differentiation"],
    question: String.raw`Given that \(y^y=x^{x^2}\), determine \(\frac{d^2y}{dx^2}\) at \(x=1\).`,
    choices: ["0", String.raw`\(-\frac12\)`, "1", "2", "NOTA"],
    answer: "D",
    solution: String.raw`Take the natural logarithm of both sides:
\[y\ln y=x^2\ln x.\]
Differentiate implicitly:
\[y'(\ln y+1)=2x\ln x+x.\]
At \(x=1\), the given equation gives \(y=1\), and then the first-derivative equation gives \(y'=1\). Differentiating once more,
\[y''(\ln y+1)+\frac{(y')^2}{y}=2\ln x+3.\]
At \(x=1\), this becomes \(y''+1=3\), so \(y''=2\).`,
  },
  {
    id: 10226,
    source: { ...januaryStatewide2026, questionNumber: 20 },
    number: 108,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["Simpson's Rule"],
    question: String.raw`Use the composite Simpson's rule with \(n=4\) subintervals to approximate \(\displaystyle\int_{-1}^3e^x\,dx\).`,
    choices: [String.raw`\(\frac14(e^{-1}+e^3)+\frac12(e^0+e^1+e^2)\)`, String.raw`\(\frac13(e^{-1}+4e^0+2e^1+4e^2+e^3)\)`, String.raw`\(\frac13(e^{-1}+2e^0+2e^1+2e^2+e^3)\)`, String.raw`\(\frac12(e^{-1/2}+e^{1/2}+e^{3/2}+e^{5/2})\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The interval has width \(4\), so with \(n=4\), the step size is \(h=1\). Composite Simpson's rule gives
\[\int_{-1}^3e^x\,dx\approx\frac13\left(e^{-1}+4e^0+2e^1+4e^2+e^3\right).\]`,
  },
  {
    id: 10227,
    source: { ...januaryStatewide2026, questionNumber: 21 },
    number: 109,
    division: "Mu",
    topic: "Conic Sections",
    difficulty: 5,
    methods: ["Implicit Differentiation", "Symmetry"],
    question: String.raw`Given that curve \(c_1\) is defined by \(5x^2+8=2y^2+20x+4y\) and curve \(c_2\) is defined by \(3x^2+7y^2+14y=12x+2\), determine the sum of the slopes of \(c_2\) at the point or points where \(c_1\) and \(c_2\) intersect. If you feel that there is an infinite slope, select DNE as your answer.`,
    choices: [String.raw`\(-\frac{21}{25}\)`, String.raw`\(\frac{42}{25}\)`, "4", "DNE", "NOTA"],
    answer: "E",
    solution: String.raw`Completing the square shows that both conics have center \((2,-1)\):
\[c_1:\quad \frac{(x-2)^2}{2}-\frac{(y+1)^2}{5}=1,\]
\[c_2:\quad \frac{(x-2)^2}{7}+\frac{(y+1)^2}{3}=1.\]
[[solution-diagram:mu-227]]
Their intersections occur in four points symmetric about both center lines. Implicit differentiation of \(c_2\) gives
\[6x+14yy'+14y'=12,
\qquad y'=-\frac{3(x-2)}{7(y+1)}.\]
To verify there really are four intersections with finite slopes, put \(U=(x-2)^2\) and \(V=(y+1)^2\). The two conic equations become
\[5U-2V=10,\qquad3U+7V=21.\]
Solving gives \(U=112/41>0\) and \(V=75/41>0\). Therefore both square roots are nonzero and may independently have either sign, yielding four distinct points. In particular \(y+1\ne0\), so none of the four slopes is vertical.

Changing the sign of \(x-2\) while keeping \(y+1\) fixed reverses the slope \(-3(x-2)/(7(y+1))\). The four symmetric intersection points therefore produce slopes in opposite pairs, so their sum is 0, which is not an answer choice.`,
  },
  {
    id: 10228,
    source: { ...januaryStatewide2026, questionNumber: 22 },
    number: 110,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["Integration by Parts"],
    question: String.raw`Calculate
\[\int_{-\pi/2}^{\pi/2}(x^2\cos x)(\sin x+1)\,dx.\]`,
    choices: [String.raw`\(\frac{\pi^2-16}{4}\)`, String.raw`\(\frac{\pi^2-8}{2}\)`, String.raw`\(\frac{\pi^2-8}{4}\)`, String.raw`\(\frac{\pi^2-4}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Distribute to create two integrals. The function \(x^2\cos x\sin x\) is odd, so its integral over \([-\pi/2,\pi/2]\) is \(0\). Since \(x^2\cos x\) is even,
\[\int_{-\pi/2}^{\pi/2}x^2\cos x\,dx=2\int_0^{\pi/2}x^2\cos x\,dx.\]
For completeness, take \(u=x^2\) and \(dv=\cos x\,dx\). Then
\[\int x^2\cos x\,dx=x^2\sin x-2\int x\sin x\,dx.\]
A second integration by parts gives \(\int x\sin x\,dx=-x\cos x+\sin x\). Substituting back and evaluating the even integral gives
\[2\left[x^2\sin x+2x\cos x-2\sin x\right]_0^{\pi/2}
=\frac{\pi^2}{2}-4=\frac{\pi^2-8}{2}.\]`,
  },
  {
    id: 10229,
    source: { ...januaryStatewide2026, questionNumber: 23 },
    number: 111,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 4,
    methods: ["Logarithmic Differentiation"],
    question: String.raw`Given that
\[y=\frac{(x^2+1)^x(x-1)^3}{(2x+3)^{\cos x}},\]
determine \(\frac{dy}{dx}\) at \(x=0\).`,
    choices: [String.raw`\(-\frac79\)`, String.raw`\(\frac19\)`, String.raw`\(\frac79\)`, String.raw`\(\frac{11}{9}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Take the natural logarithm of the absolute value of both sides:
\[\ln|y|=x\ln(1+x^2)+3\ln|x-1|-\cos x\ln(2x+3).\]
Differentiate implicitly:
\[\frac{y'}y=\ln(1+x^2)+\frac{2x^2}{1+x^2}+\frac3{x-1}+\sin x\ln(2x+3)-\frac{2\cos x}{2x+3}.\]
Since \(y(0)=-1/3\), substitution gives
\[y'(0)=-\frac13\left(-3-\frac23\right)=\frac{11}{9}.\]`,
  },
  {
    id: 10230,
    source: { ...januaryStatewide2026, questionNumber: 24 },
    number: 112,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 3,
    methods: ["Chain Rule"],
    question: String.raw`Evaluate
\[\left.\frac{d}{d\sqrt{2x+3}}(4x^3+15x^2+7x+10)\right|_{x=1}.\]`,
    choices: [String.raw`\(49\sqrt5\)`, String.raw`\(\frac{49}{2\sqrt5}\)`, String.raw`\(\frac{49}{\sqrt5}\)`, "49", "NOTA"],
    answer: "A",
    solution: String.raw`Let \(u=\sqrt{2x+3}\). Then \(du/dx=1/\sqrt{2x+3}\), so \(dx/du=\sqrt{2x+3}\). Therefore,
\[\frac d{du}(4x^3+15x^2+7x+10)=(12x^2+30x+7)\sqrt{2x+3}.\]
At \(x=1\), this equals \(49\sqrt5\).`,
  },
  {
    id: 10231,
    source: { ...januaryStatewide2026, questionNumber: 25 },
    number: 113,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["U-Substitution"],
    question: String.raw`Calculate
\[\int_0^1\sqrt{1-\sqrt{1-\sqrt x}}\,dx.\]`,
    choices: [String.raw`\(\frac{32}{315}\)`, String.raw`\(\frac{48}{315}\)`, String.raw`\(\frac{144}{315}\)`, String.raw`\(\frac{208}{315}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let \(u=\sqrt x\), so \(x=u^2\) and \(dx=2u\,du\). Then let \(v=\sqrt{1-u}\), so \(u=1-v^2\) and \(du=-2v\,dv\). The integral becomes
\[4\int_0^1v\sqrt{1-v}(1-v^2)\,dv.\]
Finally let \(w=1-v\), so \(dw=-dv\), and reverse the new limits back to 0 and 1. The transformed polynomial factor is
\[(1-w)\sqrt w\bigl(1-(1-w)^2\bigr)
=2w^{3/2}-3w^{5/2}+w^{7/2}.\]
Thus
\[4\int_0^1\left(2w^{3/2}-3w^{5/2}+w^{7/2}\right)dw
=4\left[\frac45w^{5/2}-\frac67w^{7/2}+\frac29w^{9/2}\right]_0^1
=4\left(\frac45-\frac67+\frac29\right)
=\frac{208}{315}.\]`,
  },
  {
    id: 10233,
    source: { ...januaryStatewide2026, questionNumber: 27 },
    number: 114,
    division: "Mu",
    topic: "Series",
    difficulty: 5,
    methods: ["Partial Fractions"],
    question: String.raw`Evaluate
\[\prod_{n=1}^{\infty}\frac{\sqrt[a]{64}}{\sqrt[b]{4}},\]
where \(a=n^2+2n\) and \(b=n^2+4n+3\).`,
    choices: [String.raw`\(2^{7/3}\)`, String.raw`\(2^{11/3}\)`, String.raw`\(2^{11/9}\)`, String.raw`\(2^{28/6}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Take the natural logarithm of the product:
\[\ln P=(\ln64)\sum_{n=1}^{\infty}\frac1{n^2+2n}-(\ln4)\sum_{n=1}^{\infty}\frac1{n^2+4n+3}.\]
Using partial fraction decomposition, the first sum has finite partial sums
\[\sum_{n=1}^N\frac1{n(n+2)}
=\frac12\sum_{n=1}^N\left(\frac1n-\frac1{n+2}\right)
=\frac12\left(1+\frac12-\frac1{N+1}-\frac1{N+2}\right).\]
All the middle terms cancel, so its limit is \(\frac12(1+1/2)=3/4\). Likewise,
\[\sum_{n=1}^N\frac1{(n+1)(n+3)}
=\frac12\sum_{n=1}^N\left(\frac1{n+1}-\frac1{n+3}\right)
=\frac12\left(\frac12+\frac13-\frac1{N+2}-\frac1{N+3}\right).\]
This tends to \(\frac12(1/2+1/3)=5/12\). Both series converge absolutely because their terms are bounded by constant multiples of \(1/n^2\), so the finite logarithmic partial sums converge and exponentiation gives a well-defined positive infinite product.
Therefore,
\[\ln P=6\ln2\left(\frac34\right)-2\ln2\left(\frac5{12}\right)
=\frac{11}{3}\ln2,\]
so \(P=2^{11/3}\).`,
  },
  {
    id: 10234,
    source: { ...januaryStatewide2026, questionNumber: 29 },
    number: 115,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Evaluate
\[\lim_{x\to\infty}\frac1{1+\frac1{1+\frac1{e^x}}}.\]`,
    choices: ["0", String.raw`\(\frac12\)`, String.raw`\(\frac1e\)`, String.raw`\(e\)`, "NOTA"],
    answer: "B",
    solution: String.raw`As \(x\to\infty\), \(e^x\to\infty\), so \(1/e^x=e^{-x}\to0\). Evaluate the nested expression from the inside outward:
\[\frac1{1+\frac1{e^x}}\longrightarrow\frac1{1+0}=1,\]
\[\frac1{1+\frac1{1+\frac1{e^x}}}\longrightarrow\frac1{1+1}=\frac12.\]
All denominators remain positive, so the reciprocal operations are continuous and valid.`,
  },
  {
    id: 10235,
    source: { ...januaryStatewide2026, questionNumber: 30 },
    number: 116,
    division: "Mu",
    topic: "Indefinite Integrals",
    difficulty: 5,
    methods: ["Trigonometric Substitution", "Integration by Parts"],
    question: String.raw`Calculate
\[\int\frac{x^2-6x+10}{\sqrt{x^2-6x+18}}\,dx.\]`,
    choices: [String.raw`\(\frac{x-3}{2}\sqrt{x^2-6x+18}+\frac92\ln\left(\frac{\sqrt{x^2-6x+18}+x-3}{3}\right)+C\)`, String.raw`\(\frac{x-3}{2}\sqrt{x^2-6x+18}-\frac72\ln|x-3|+C\)`, String.raw`\(\frac{x-3}{2}\sqrt{x^2-6x+18}-\frac72\arctan\left(\frac{x-3}{3}\right)+C\)`, String.raw`\(\frac{x-3}{2}\sqrt{x^2-6x+18}-\frac72\ln\left|\frac{\sqrt{x^2-6x+18}+x-3}{3}\right|+C\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Complete the square and let \(u=x-3\):
\[\int\frac{x^2-6x+10}{\sqrt{x^2-6x+18}}\,dx
=\int\frac{u^2+1}{\sqrt{u^2+9}}\,du.\]
Using \(u=3\tan\theta\), the integral becomes
\[\int\frac{9\tan^2\theta+1}{3\sec\theta}\,3\sec^2\theta\,d\theta
=\int(9\tan^2\theta+1)\sec\theta\,d\theta.\]
Choose \(-\pi/2<\theta<\pi/2\) so \(\sec\theta>0\) and the square root is \(3\sec\theta\). Using \(\tan^2\theta=\sec^2\theta-1\), the integral is
\[9\int\sec^3\theta\,d\theta-8\int\sec\theta\,d\theta.\]
For the integral \(K=\int\sec^3\theta\,d\theta\), use integration by parts with \(a=\sec\theta\), \(db=\sec^2\theta\,d\theta\), \(da=\sec\theta\tan\theta\,d\theta\), and \(b=\tan\theta\):
\[K=\sec\theta\tan\theta-\int\sec\theta\tan^2\theta\,d\theta.\]
Rewrite the remaining integrand as \(\sec^3\theta-\sec\theta\), giving
\[K=\sec\theta\tan\theta-K+\int\sec\theta\,d\theta.\]
Adding \(K\) to both sides and using \(\int\sec\theta\,d\theta=\ln|\sec\theta+\tan\theta|+C\), we obtain
\[\int\sec^3\theta\,d\theta=\frac12\sec\theta\tan\theta+\frac12\ln|\sec\theta+\tan\theta|.\]
Substituting this into the original integral and collecting logarithms gives
\[\frac92\sec\theta\tan\theta-\frac72\ln|\sec\theta+\tan\theta|+C.\]
Given that \(x-3=3\tan\theta\), substitute \(\tan\theta=(x-3)/3\) and \(\sec\theta=\sqrt{x^2-6x+18}/3\) into the solution to obtain
\[\frac{x-3}{2}\sqrt{x^2-6x+18}
-\frac72\ln\left|\frac{\sqrt{x^2-6x+18}+x-3}{3}\right|+C.\]`,
  },
  // 2026 FAMAT January Regional Calculus Individual Test.
  // Retained source questions map to public Mu 117-145 (IDs 10236-10265).
  // Original question 13 was thrown out in Region 5 and is excluded.
  // Keep the remaining IDs and original source-credit numbers stable.
  {
    id: 10236,
    source: { ...januaryRegional2026, questionNumber: 1 },
    number: 117,
    division: "Mu",
    topic: "Continuity",
    difficulty: 2,
    methods: ["Intermediate Value Theorem"],
    question: String.raw`How many of the following functions can be shown to have a root on the interval \([-2,1]\) due to the application of the Intermediate Value Theorem?
\[f_1(x)=\frac{x}{x-2},\quad f_2(x)=\frac{x}{x+1},\quad f_3(x)=2x^2+5,\quad f_4(x)=2\sin(3x)+5\]`,
    choices: ["0", "1", "2", "3", "NOTA"],
    answer: "C",
    solution: String.raw`The Intermediate Value Theorem requires \(f\) to be continuous on the given interval \([a,b]\). To guarantee a root in its interior, \(f(a)\) and \(f(b)\) must be of opposite signs.

Functions 3 and 4 cannot be shown to have roots: \(2x^2+5\ge5\), and \(2\sin(3x)+5\ge3\), so both are always positive. Functions one and two can be shown to have roots on the interval.

\(f_1(x)\) is continuous on \([-2,1]\), since its denominator vanishes only at 2, outside that interval. We have \(f_1(-2)=1/2>0\), while \(f_1(1)=-1<0\), so IVT guarantees a root.

\(f_2(x)\) is not continuous on the whole interval because its denominator vanishes at \(-1\). However, it is continuous on the smaller interval \([-1/2,1]\), which lies inside \([-2,1]\). We have \(f_2(-1/2)=-1<0\), while \(f_2(1)=1/2>0\), so IVT guarantees a root on this smaller interval. Therefore the count is 2.`,
  },
  {
    id: 10237,
    source: { ...januaryRegional2026, questionNumber: 2 },
    number: 118,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 1,
    methods: [],
    question: String.raw`What are the equations of all asymptotes of the function
\[f(x)=\frac{\sqrt{x^2-9}}{x-3}?\]`,
    choices: [String.raw`\(y=1,\ y=-1,\ x=-3\)`, String.raw`\(y=0,\ x=3\)`, String.raw`\(y=1,\ x=3\)`, String.raw`\(y=1,\ y=-1,\ x=3\)`, "NOTA"],
    answer: "D",
    solution: String.raw`There is a vertical asymptote at \(x=3\) since \(f(x)\to\infty\) as \(x\to3^+\). Indeed, for \(x>3\),
\[f(x)=\frac{\sqrt{(x-3)(x+3)}}{x-3}=\sqrt{\frac{x+3}{x-3}},\]
which grows without bound as \(x\to3^+\).

For the limits at infinity, write
\[f(x)=\frac{|x|\sqrt{1-9/x^2}}{x(1-3/x)}.\]
As \(x\to\infty\), \(|x|/x=1\), so \(f(x)\to1\), and as \(x\to-\infty\), \(|x|/x=-1\), so \(f(x)\to-1\). The horizontal asymptotes are \(y=\pm1\).

The other domain boundary, \(x=-3\), is not a vertical asymptote: the numerator tends to 0 and the denominator tends to \(-6\), so the limit from the domain is 0. Thus all the asymptotes are \(y=1\), \(y=-1\), and \(x=3\).`,
  },
  {
    id: 10238,
    source: { ...januaryRegional2026, questionNumber: 3 },
    number: 119,
    division: "Mu",
    topic: "Continuity",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the graph of \(f(x)\) shown below on the interval \([-5,6]\). The function is not defined for \(x<-5\) or \(x>6\), and there is a vertical tangent line at \(x=2\).

For how many values of \(x\) on \([-5,6]\) is \(f\) discontinuous?`,
    illustration: {
      src: "/questions/mu-238-240-original.svg",
      alt: "Piecewise graph of f on the closed interval from negative 5 to 6",
      width: 374,
      height: 272,
    },
    choices: ["3", "4", "5", "6", "NOTA"],
    answer: "A",
    solution: String.raw`The function is discontinuous at 3 values: \(x=-1\) (jump), \(x=1\) (removable), and \(x=4\) (jump).

At \(x=-1\) and \(x=4\), the left and right pieces approach different heights, so the two-sided limit does not exist. At \(x=1\), both sides approach the hole at height 0, but the filled dot gives \(f(1)=-2\), so the limit does not equal the function value.

The cusp at \(-3\), the vertical tangent at 2, and the corner at 5 do not break continuity. At the domain endpoints \(-5\) and 6, continuity is checked using the one-sided limit from inside the domain; the curve meets the filled endpoint dots. Therefore neither endpoint adds a discontinuity.`,
  },
  {
    id: 10239,
    source: { ...januaryRegional2026, questionNumber: 4 },
    number: 120,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the graph of \(f(x)\) shown below on the interval \([-5,6]\). The function is not defined for \(x<-5\) or \(x>6\), and there is a vertical tangent line at \(x=2\).

For how many values of \(x\) on \((-5,6)\) is \(f\) non-differentiable?`,
    illustration: {
      src: "/questions/mu-238-240-original.svg",
      alt: "Piecewise graph of f on the closed interval from negative 5 to 6",
      width: 374,
      height: 272,
    },
    choices: ["3", "4", "5", "6", "NOTA"],
    answer: "D",
    solution: String.raw`The function is non-differentiable at 6 values: the three discontinuities above along with \(x=-3\) (cusp), \(x=2\) (vertical tangent), and \(x=5\) (corner).

More explicitly, the discontinuities are \(x=-1,1,4\). A differentiable function must be continuous, so none of those points can be differentiable. At the cusp \(-3\) and corner 5, there is no single matching finite slope from both sides. At 2 the supplied vertical tangent means there is no finite derivative. The endpoints \(-5\) and 6 are excluded by the open interval \((-5,6)\). Thus the total is \(3+3=6\).`,
  },
  {
    id: 10240,
    source: { ...januaryRegional2026, questionNumber: 5 },
    number: 121,
    division: "Mu",
    topic: "Continuity",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the graph of \(f(x)\) shown below on the interval \([-5,6]\). The function is not defined for \(x<-5\) or \(x>6\), and there is a vertical tangent line at \(x=2\).

At what value \(a\) do both \(\displaystyle\lim_{x\to a}f(x)\) and \(f(a)\) exist, but \(\displaystyle\lim_{x\to a}f(x)\ne f(a)\)?`,
    illustration: {
      src: "/questions/mu-238-240-original.svg",
      alt: "Piecewise graph of f on the closed interval from negative 5 to 6",
      width: 374,
      height: 272,
    },
    choices: ["−3", "−1", "1", "4", "NOTA"],
    answer: "C",
    solution: String.raw`The given property means that \(f\) must have a removable discontinuity. The only choice where a removable discontinuity occurs is \(x=1\).

There the graph approaches the hole at \((1,0)\) from both sides, so \(\lim_{x\to1}f(x)=0\). The filled point is at \((1,-2)\), so \(f(1)=-2\). Both quantities exist, but they are unequal. The jumps at \(-1\) and 4 have no two-sided limit, and the graph is continuous at \(-3\). Therefore \(a=1\).`,
  },
  {
    id: 10241,
    source: { ...januaryRegional2026, questionNumber: 6 },
    number: 122,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: ["Exponential Limits"],
    question: String.raw`Which limit approaches the constant \(e\)?`,
    choices: [String.raw`\(\displaystyle\lim_{x\to\infty}\left(1+\frac1x\right)^x\)`, String.raw`\(\displaystyle\lim_{x\to0}\left(1+\frac1x\right)^x\)`, String.raw`\(\displaystyle\lim_{x\to0}(1-x)^{1/x}\)`, String.raw`\(\displaystyle\lim_{x\to\infty}(1+x)^{1/x}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The limit definition of \(e\) is
\[e=\lim_{x\to\infty}\left(1+\frac1x\right)^x.\]`,
  },
  {
    id: 10242,
    source: { ...januaryRegional2026, questionNumber: 7 },
    number: 123,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Quotient Rule"],
    question: String.raw`What is the x-coordinate of the x-intercept of the tangent line to \(f(x)=\frac{e^x}{e^x+1}\) at \(x=0\)?`,
    choices: ["−4", "−2", String.raw`\(\frac12\)`, "2", "NOTA"],
    answer: "B",
    solution: String.raw`We have \(f(0)=1/2\). By the quotient rule,
\[f'(x)=\frac{e^x(e^x+1)-e^x(e^x)}{(e^x+1)^2},\]
so \(f'(0)=1/4\). The tangent line is \(y-1/2=\frac14x\). Setting \(y=0\) gives \(x=-2\).`,
  },
  {
    id: 10243,
    source: { ...januaryRegional2026, questionNumber: 8 },
    number: 124,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`If \(y=\frac14\sin(2x)\), what is \(\frac{d^{99}y}{dx^{99}}\)?`,
    choices: [String.raw`\(2^{98}\sin(2x)\)`, String.raw`\(-2^{98}\sin(2x)\)`, String.raw`\(-2^{97}\cos(2x)\)`, String.raw`\(-2^{98}\cos(2x)\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Compute the first few derivatives using the Chain Rule:
\[y=2^{-2}\sin(2x),\qquad y'=2^{-1}\cos(2x),\]
\[y''=-2^0\sin(2x),\qquad y'''=-2^1\cos(2x),\qquad y^{(4)}=2^2\sin(2x).\]
Each derivative multiplies the coefficient by 2. Generally, the \(n\)th derivative has coefficient \(2^{n-2}\). Also, the derivatives of sine have a period of 4: cosine, negative sine, negative cosine, and sine. Since \(99=4(24)+3\), the 99th derivative has the same trigonometric form as the third derivative, namely negative cosine. Therefore,
\[\frac{d^{99}y}{dx^{99}}=-2^{97}\cos(2x).\]`,
  },
  {
    id: 10244,
    source: { ...januaryRegional2026, questionNumber: 9 },
    number: 125,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["First Derivative Test"],
    question: String.raw`If \(f'(x)=-2x^2(x-1)(x+2)\), which statement is true about \(f\)?`,
    choices: [String.raw`\(f\) has a local maximum at \(x=-2\) and a local minimum at \(x=1\).`, String.raw`\(f\) has a local maximum at \(x=1\) and a local minimum at \(x=-2\).`, String.raw`\(f\) has a local maximum at \(x=-2\) and no local minimum.`, String.raw`\(f\) has local maxima at \(x=-2\) and \(x=0\) and a local minimum at \(x=1\).`, "NOTA"],
    answer: "B",
    solution: String.raw`The critical values are \(x=0\), \(x=1\), and \(x=-2\). Test values in the intervals \((-\infty,-2)\), \((-2,0)\), \((0,1)\), and \((1,\infty)\) to find that \(f'\) is negative, positive, positive, and negative, respectively.

This means that \(f\) decreases on \((-\infty,-2)\) and \((1,\infty)\) and increases on \((-2,0)\) and \((0,1)\). Therefore, \(f\) attains a local minimum at \(x=-2\) and a local maximum at \(x=1\). The factor \(x^2\) does not change sign across 0, so \(f'\) stays positive on both sides of 0; there is no local extremum there.`,
  },
  {
    id: 10245,
    source: { ...januaryRegional2026, questionNumber: 10 },
    number: 126,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`Which represents \(f''(x)\) if \(f(x)=\arctan(2x)\)?`,
    choices: [String.raw`\(\frac{2(1-4x^2)}{(1+4x^2)^2}\)`, String.raw`\(\frac2{(1+4x^2)}\)`, String.raw`\(\frac{2(1-4x^2)}{(1+2x^2)^2}\)`, String.raw`\(\frac{2(1+4x^2)}{(1-4x^2)^2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Using the chain rule,
\[f'(x)=\frac2{1+(2x)^2}=\frac2{1+4x^2},\]
so
\[f''(x)=-\frac{16x}{(1+4x^2)^2}.\]
This is not listed, so the answer is NOTA.`,
  },
  {
    id: 10246,
    source: { ...januaryRegional2026, questionNumber: 11 },
    number: 127,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["First Derivative Test"],
    question: String.raw`A right circular cylinder is inscribed in a sphere of radius \(6\). What is the maximum volume of the cylinder?`,
    choices: [String.raw`\(48\pi\sqrt3\)`, String.raw`\(64\pi\sqrt3\)`, String.raw`\(96\pi\sqrt3\)`, String.raw`\(108\pi\sqrt3\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(r\) be the cylinder's radius and \(h\) half its height. Then \(r^2+h^2=36\), so
\[V=\pi r^2(2h)=2\pi(36-h^2)h=72\pi h-2\pi h^3.\]
The possible half-heights satisfy \(0\le h\le6\). The derivative \(V'(h)=72\pi-6\pi h^2\) is zero when \(h=\sqrt{12}=2\sqrt3\). This choice of \(h\) maximizes \(V\) since \(V''(h)=-12\pi h<0\) for \(h>0\); the degenerate endpoint volumes are both 0. Thus the maximum volume is
\[V=72\pi(2\sqrt3)-2\pi(2\sqrt3)^3=96\pi\sqrt3.\]`,
  },
  {
    id: 10247,
    source: { ...januaryRegional2026, questionNumber: 12 },
    number: 128,
    division: "Mu",
    topic: "Sequences",
    difficulty: 5,
    methods: [],
    question: String.raw`Let \(a_1=1\) and define \(a_{n+1}=a_n+\frac1{2a_n+1}\) for \(n\ge1\). Evaluate \(\displaystyle\lim_{n\to\infty}\frac{a_n}{\sqrt n}\).`,
    choices: [String.raw`\(\frac{\sqrt3}{2}\)`, String.raw`\(\frac34\)`, String.raw`\(\frac43\)`, String.raw`\(\frac{2\sqrt3}{3}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Let \(x_n=2a_n+1\), so \(x_1=3\) and
\[x_{n+1}=x_n+\frac2{x_n}.\]
Therefore,
\[x_{n+1}^2-x_n^2=4+\frac4{x_n^2}.\]
Summing from \(k=1\) to \(n-1\) gives the exact identity
\[x_n^2=9+4(n-1)+4\sum_{k=1}^{n-1}\frac1{x_k^2}
=4n+5+4\sum_{k=1}^{n-1}\frac1{x_k^2}.\]
Also \(x_{k+1}^2-x_k^2>4\), so \(x_k^2\ge4k+5\). Therefore
\[0\le\sum_{k=1}^{n-1}\frac1{x_k^2}
\le\sum_{k=1}^{n-1}\frac1{4k+5}
\le\frac14\sum_{k=1}^{n-1}\frac1k.\]
The harmonic sum is at most \(1+\ln(n-1)\) for \(n\ge2\), and \(\ln n/n\to0\). Dividing the exact identity by \(4n\), the extra terms tend to 0, so \(x_n^2/(4n)\to1\). Since \(x_n>0\), taking square roots gives \(x_n/(2\sqrt n)\to1\).

Since \(a_n=(x_n-1)/2\),
\[\frac{a_n}{\sqrt n}=\frac{x_n}{2\sqrt n}-\frac1{2\sqrt n}\longrightarrow1-0=1.\]
Hence
\[\lim_{n\to\infty}\frac{a_n}{\sqrt n}=1,\]
which is NOTA.`,
  },
  {
    id: 10249,
    source: { ...januaryRegional2026, questionNumber: 14 },
    number: 129,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 1,
    methods: ["Related Rates"],
    question: String.raw`A rectangle has a constant area of \(40\) square inches. Its base increases at a rate of \(2\) inches per second. Which best describes the rate of change of the rectangle's height when the height is \(10\) inches?`,
    choices: ["The height is decreasing at a rate of 5 inches per second.", "The height is decreasing at a rate of 2 inches per second.", "The height is decreasing at a rate of 0.5 inches per second.", "The height is increasing at a rate of 2 inches per second.", "NOTA"],
    answer: "A",
    solution: String.raw`Let \(40=bh\), where \(b\) is the base and \(h\) is the height. When \(h=10\), \(b=4\). Differentiating gives
\[0=b'h+bh'=2(10)+4h',\]
so \(h'=-5\). The height is decreasing at \(5\) inches per second.`,
  },
  {
    id: 10250,
    source: { ...januaryRegional2026, questionNumber: 15 },
    number: 130,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 3,
    methods: [],
    question: String.raw`Three functions, \(p\), \(r\), and \(s\), are graphed. Which correctly matches how the graphs relate?`,
    illustration: {
      src: "/questions/mu-250-original.svg",
      alt: "Three curves labeled p, r, and s for identifying first- and second-derivative relationships",
      width: 440,
      height: 245,
    },
    choices: [String.raw`\(r=s',\ p=s''\)`, String.raw`\(s=r',\ p=r''\)`, String.raw`\(p=r',\ s=r''\)`, String.raw`\(p=s',\ r=s''\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The zeros of \(r\) correspond with the local extrema of \(s\), showing \(s'=r\). Similarly, the zeros of \(p\) correspond to the local extrema of \(r\), showing \(r'=p\), or \(s''=p\).

The sign patterns also agree: where the solid curve \(s\) decreases, the dotted curve \(r\) is below the horizontal axis; where \(s\) increases, \(r\) is above it. The dotted curve changes from negative to positive at the solid curve's minimum and from positive to negative at its maximum. Applying the same check to the dotted curve, its increasing portions correspond to positive values of the dashed curve \(p\), and its decreasing portions correspond to negative values of \(p\). Thus the matching pair is \(r=s'\) and \(p=s''\).`,
  },
  {
    id: 10251,
    source: { ...januaryRegional2026, questionNumber: 16 },
    number: 131,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 2,
    methods: ["Limit Definition of Derivatives"],
    question: String.raw`If \(\displaystyle\lim_{x\to2}\frac{f(x)-f(2)}{x-2}=5\), which statement(s) must be true about \(f(x)\)?

I. \(f(x)\) is continuous at \(x=2\).

II. \(f(x)\) is differentiable at \(x=2\).

III. \(f'(5)=2\).`,
    choices: ["I only", "I and II only", "I and III only", "I, II, and III", "NOTA"],
    answer: "B",
    solution: String.raw`The given limit is the definition of \(f'(2)\), so \(f\) is differentiable at \(x=2\). Differentiability implies continuity there. Nothing is given about \(f'(5)\), so only I and II must be true.`,
  },
  {
    id: 10252,
    source: { ...januaryRegional2026, questionNumber: 17 },
    number: 132,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 2,
    methods: ["Implicit Differentiation"],
    question: String.raw`What is the slope of the normal line to the equation \(x^2y-xy^2=6\) at the point \((3,1)\)?`,
    choices: [String.raw`\(-\frac53\)`, String.raw`\(-\frac35\)`, String.raw`\(\frac35\)`, String.raw`\(\frac53\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Implicit differentiation gives
\[2xy+x^2y'-y^2-2xyy'=0,
\qquad y'=\frac{y^2-2xy}{x^2-2xy}.\]
At \((3,1)\), the tangent slope is \(-5/3\). The normal slope is its opposite reciprocal, \(3/5\).`,
  },
  {
    id: 10253,
    source: { ...januaryRegional2026, questionNumber: 18 },
    number: 133,
    division: "Mu",
    topic: "Linear Approximation",
    difficulty: 2,
    methods: ["Linear Approximation"],
    question: String.raw`Which of the following best describes the local linear approximation of \(\sqrt{105}\) using \(f(x)=\sqrt x\) at \(x=100\)?`,
    choices: [String.raw`\(\sqrt{105}\approx10.25\) and it is an underestimate.`, String.raw`\(\sqrt{105}\approx10.25\) and it is an overestimate.`, String.raw`\(\sqrt{105}\approx10.5\) and it is an underestimate.`, String.raw`\(\sqrt{105}\approx10.5\) and it is an overestimate.`, "NOTA"],
    answer: "B",
    solution: String.raw`We have \(f(100)=10\) and \(f'(100)=1/20\), so the local linear approximation gives
\[\sqrt{105}\approx10+\frac1{20}(5)=10.25.\]
Since \(f\) is concave down, its tangent line lies above the curve, making this an overestimate.`,
  },
  {
    id: 10254,
    source: { ...januaryRegional2026, questionNumber: 19 },
    number: 134,
    division: "Mu",
    topic: "Inverse Functions",
    difficulty: 2,
    methods: ["Derivative of Inverse Functions"],
    question: String.raw`Use the following table for differentiable functions \(f\) and \(g\). Function \(f\) is invertible, and \(h(x)=f^{-1}(x)\).
\[
\begin{array}{c|rrrrr}
x&-2&-1&0&1&2\\\hline
f(x)&4&2&0&-1&-2\\
g(x)&0&-2&1&-2&-1\\
f'(x)&-4&-3&-2&-2&-2\\
g'(x)&1&2&-2&1&3
\end{array}
\]
What is \(h'(-2)\)?`,
    choices: ["−2", String.raw`\(-\frac12\)`, String.raw`\(-\frac14\)`, String.raw`\(\frac12\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Since \(f(2)=-2\), we have \(h(-2)=2\). Derivatives of inverse functions are reciprocal at corresponding points, so
\[h'(-2)=\frac1{f'(2)}=-\frac12.\]`,
  },
  {
    id: 10255,
    source: { ...januaryRegional2026, questionNumber: 20 },
    number: 135,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`Use the following table for differentiable functions \(f\) and \(g\). Function \(f\) is invertible where \(h(x)=f^{-1}(x)\).
\[
\begin{array}{c|rrrrr}
x&-2&-1&0&1&2\\\hline
f(x)&4&2&0&-1&-2\\
g(x)&0&-2&1&-2&-1\\
f'(x)&-4&-3&-2&-2&-2\\
g'(x)&1&2&-2&1&3
\end{array}
\]
If \(r(x)=f(g(2x))\), what is \(r'(1)\)?`,
    choices: ["−12", "−6", "−3", "3", "NOTA"],
    answer: "E",
    solution: String.raw`By the chain rule,
\[r'(x)=2f'(g(2x))g'(2x).\]
Using \(g(2)=-1\), \(f'(-1)=-3\), and \(g'(2)=3\),
\[r'(1)=2(-3)(3)=-18,\]
which is NOTA.`,
  },
  {
    id: 10256,
    source: { ...januaryRegional2026, questionNumber: 21 },
    number: 136,
    division: "Mu",
    topic: "Probability",
    difficulty: 5,
    methods: ["Integration by Parts"],
    question: String.raw`What is the probability that \(\displaystyle\int_0^1x^n\tan^{-1}x\,dx\) is rational if \(n\) is a positive integer? Interpret probability as the limiting fraction of qualifying integers among \(1,2,\ldots,N\) as \(N\to\infty\).`,
    choices: [String.raw`\(\frac3{4e}\)`, String.raw`\(\frac{\sqrt2}{6}\)`, String.raw`\(\frac14\)`, String.raw`\(\frac3{4\pi}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let
\[I_n=\int_0^1x^n\tan^{-1}x\,dx.\]
We will show that \(I_n\) is rational exactly when \(n=4k-1\), where \(k\) is a positive integer, and then count those exponents.

Step 1: Use integration by parts. Take \(u=\tan^{-1}x\), \(dv=x^n\,dx\), so \(du=dx/(1+x^2)\) and \(v=x^{n+1}/(n+1)\). At \(x=1\), \(\tan^{-1}1=\pi/4\); at \(x=0\), the boundary term is 0. Thus
\[I_n=\frac1{n+1}\left(\frac\pi4-J_{n+1}\right),\qquad
J_m=\int_0^1\frac{x^m}{1+x^2}\,dx.\]

Step 2: Reduce the exponent in \(J_m\). For \(m\ge2\), polynomial division gives
\[\frac{x^m}{1+x^2}=x^{m-2}-\frac{x^{m-2}}{1+x^2}.\]
Integrating from 0 to 1,
\[J_m=\frac1{m-1}-J_{m-2}.\]
The two starting values are
\[J_0=\left[\tan^{-1}x\right]_0^1=\frac\pi4,\qquad
J_1=\left[\frac12\ln(1+x^2)\right]_0^1=\frac12\ln2.\]
Each recurrence step contributes a rational number and reverses the sign of the remaining \(J\)-term.

Step 3: Handle odd \(n\). Write \(n=2k-1\), so \(n+1=2k\). After \(k\) recurrence steps,
\[J_{2k}=R_k+(-1)^k\frac\pi4,\qquad
R_k=\sum_{j=1}^k\frac{(-1)^{k-j}}{2j-1}.\]
Every summand in \(R_k\) is rational. Therefore
\[I_{2k-1}=\frac1{2k}\left(\bigl(1-(-1)^k\bigr)\frac\pi4-R_k\right).\]
If \(k\) is even, the coefficient of \(\pi\) is 0 and the answer is rational. These are precisely \(n=4r-1\), or \(n\equiv3\pmod4\). If \(k\) is odd, the coefficient of \(\pi\) is nonzero; a nonzero rational multiple of \(\pi\) plus a rational number is irrational. These are \(n\equiv1\pmod4\).

For example, \(J_2=1-\pi/4\) and \(J_4=1/3-J_2=\pi/4-2/3\). Hence
\[I_1=\frac\pi4-\frac12\quad\hbox{is irrational},\qquad
I_3=\frac14\left(\frac\pi4-J_4\right)=\frac16\quad\hbox{is rational}.\]

Step 4: Rule out even \(n\). Write \(n=2k\), where \(k\ge1\). The same recurrence now ends at \(J_1\), giving
\[J_{2k+1}=S_k+(-1)^k\frac12\ln2,\qquad
S_k=\sum_{j=1}^k\frac{(-1)^{k-j}}{2j}.\]
Thus
\[I_{2k}=\frac1{2k+1}\left(\frac\pi4-(-1)^k\frac12\ln2-S_k\right).\]
This contains both \(\pi\) and \(\ln2\). Merely saying that both constants are irrational is not enough to prove their combination irrational.

A rigorous justification uses the following advanced theorem of Baker: a nonzero linear combination, with algebraic coefficients, of logarithms of nonzero algebraic numbers is transcendental. An algebraic number is a root of a nonzero polynomial with integer coefficients; a transcendental number is not algebraic and in particular is not rational.

Choose \(\log(-1)=i\pi\), where \(i^2=-1\). Then
\[L=\frac\pi4-(-1)^k\frac12\ln2
=-\frac i4\log(-1)-\frac{(-1)^k}{2}\log2.\]
Here \(-1\) and 2 are nonzero algebraic numbers, and both coefficients are algebraic. Also \(L\ne0\): even the smaller possible value is \(\pi/4-\ln2/2>0\), since \(\pi>2\) and \(\ln2<1\). Baker's theorem therefore makes \(L\) transcendental. Subtracting the rational number \(S_k\) and dividing by the nonzero integer \(2k+1\) cannot make it rational. Thus no positive even \(n\) qualifies. The integration and recurrence are elementary; this final irrationality justification is the advanced part.

Step 5: Count the qualifying integers. They are exactly
\[3,7,11,15,\ldots\]
Among \(1,2,\ldots,N\), there are \(\lfloor(N+1)/4\rfloor\) of them. Therefore the limiting fraction is
\[\lim_{N\to\infty}\frac{\lfloor(N+1)/4\rfloor}{N}=\frac14.\]
So the answer is choice C. This uses natural density, not a nonexistent uniform probability distribution on all positive integers.`,
  },
  {
    id: 10257,
    source: { ...januaryRegional2026, questionNumber: 22 },
    number: 137,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    question: String.raw`Consider the three limits below. Which limit(s) evaluate to \(0\)?

I. \(\displaystyle\lim_{x\to\infty}\frac{\ln(x^2)}{x^2}\)

II. \(\displaystyle\lim_{x\to\infty}\frac{x^{100}}{e^{2x}}\)

III. \(\displaystyle\lim_{x\to\infty}\frac{10\sin(4x)}x\)`,
    choices: ["I and II only", "II and III only", "I and III only", "I, II, and III", "NOTA"],
    answer: "D",
    solution: String.raw`Evaluate each limit separately, all of which evaluate to 0.

I. For positive \(x\), \(\ln(x^2)=2\ln x\). Both numerator and denominator tend to infinity, so L'Hopital's rule gives
\[\lim_{x\to\infty}\frac{\ln(x^2)}{x^2}
=\lim_{x\to\infty}\frac{2/x}{2x}
=\lim_{x\to\infty}\frac1{x^2}=0.\]
This illustrates the relative growth rates of a logarithm and a polynomial.

II. Exponential growth dominates polynomial growth. More explicitly, applying L'Hopital's rule 100 times gives
\[\lim_{x\to\infty}\frac{x^{100}}{e^{2x}}
=\lim_{x\to\infty}\frac{100!}{2^{100}e^{2x}}=0.\]

III. Since \(-1\le\sin(4x)\le1\), for \(x>0\) we have
\[-\frac{10}{x}\le\frac{10\sin(4x)}x\le\frac{10}{x}.\]
Both bounding expressions tend to 0, so the squeeze theorem gives a limit of 0. The numerator is bounded while the denominator is unbounded. Therefore I, II, and III all evaluate to 0.`,
  },
  {
    id: 10258,
    source: { ...januaryRegional2026, questionNumber: 23 },
    number: 138,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution"],
    question: String.raw`For a continuous function \(f(x)\), it is given that
\[\int_1^3xf(x^2)\,dx=8.\]
What is the value of \(\displaystyle\int_1^9f(x)\,dx\)?`,
    choices: ["4", "8", "12", "16", "NOTA"],
    answer: "D",
    solution: String.raw`Let \(u=x^2\), so \(du=2x\,dx\). The bounds become \(u=1\) and \(u=9\), giving
\[\frac12\int_1^9f(u)\,du=8.\]
Therefore, \(\int_1^9f(x)\,dx=16\).`,
  },
  {
    id: 10259,
    source: { ...januaryRegional2026, questionNumber: 24 },
    number: 139,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: [],
    question: String.raw`Evaluate
\[\int_0^{1/2}\tan^{-1}(x^2-x+1)\,dx.\]`,
    choices: [String.raw`\(\frac{\pi\ln2}{6}\)`, String.raw`\(\ln\sqrt2\)`, String.raw`\(\frac\pi8\)`, String.raw`\(\frac\pi4\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let \(I\) denote the requested integral. On \([0,1]\), the expression \(x^2-x+1\) is positive. The inverse-tangent addition formula gives
\[\tan^{-1}x+\tan^{-1}(1-x)=\tan^{-1}\left(\frac1{x^2-x+1}\right)
=\frac\pi2-\tan^{-1}(x^2-x+1),\]
because \(1-x(1-x)=x^2-x+1>0\) and the sum of the two nonnegative angles lies in \((0,\pi/2)\), so no extra \(\pi\) adjustment is needed.

The polynomial \(x^2-x+1\) is unchanged by replacing \(x\) with \(1-x\). Thus the integrand is symmetric about \(x=1/2\), and
\[2I=\int_0^1\tan^{-1}(x^2-x+1)\,dx.\]
Integrating the addition formula and substituting \(u=1-x\) in the second inverse-tangent integral gives
\[2I=\frac\pi2-2\int_0^1\tan^{-1}x\,dx.\]
Integration by parts with \(u=\tan^{-1}x\) and \(dv=dx\) yields
\[\int\tan^{-1}x\,dx=x\tan^{-1}x-\frac12\ln(1+x^2)+C,\]
so \(\int_0^1\tan^{-1}x\,dx=\pi/4-\ln2/2\). Therefore \(2I=\ln2\), and
\[I=\frac12\ln2=\ln\sqrt2.\]`,
  },
  {
    id: 10260,
    source: { ...januaryRegional2026, questionNumber: 25 },
    number: 140,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["Infinite Series", "Partial Fractions"],
    question: String.raw`If \(g(x)=\left\lfloor\frac1x\right\rfloor\) (the floor function applied to \(1/x\)), evaluate
\[\int_0^1\frac1{g(x)}\,dx.\]
Interpret the integral at 0 as an improper integral.`,
    choices: [String.raw`\(\frac{\pi^2}{16}\)`, String.raw`\(\frac{\pi^2}{8}\)`, String.raw`\(\frac{\pi^2}{6}\)`, String.raw`\(\frac{\pi^2}{12}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`For \(x\in(1/(k+1),1/k]\), \(g(x)=k\), where \(k=1,2,\ldots\). Indeed, \(k\le1/x<k+1\) on that interval. Hence \(1/g(x)=1/k\) is constant there, and its integral is the height \(1/k\) times the interval width \(1/k-1/(k+1)\). Therefore,
\[\int_0^1\frac1{g(x)}\,dx
=\sum_{k=1}^{\infty}\frac1k\left(\frac1k-\frac1{k+1}\right)
=\sum_{k=1}^{\infty}\frac1{k^2(k+1)}.\]
Since
\[\frac1{k^2(k+1)}=\frac1{k^2}-\frac1k+\frac1{k+1},\]
the partial sums are
\[\sum_{k=1}^N\frac1{k^2(k+1)}
=\sum_{k=1}^N\frac1{k^2}-1+\frac1{N+1}.\]
Using \(\sum_{k=1}^{\infty}1/k^2=\pi^2/6\) and letting \(N\to\infty\), the sum is \(\pi^2/6-1\), which is NOTA. The integral converges: for \(0<x\le1\), \(0<1/\lfloor1/x\rfloor\le1\), and this reciprocal tends to 0 at the lower endpoint. The contributions from the intervals accumulating at 0 therefore give the convergent improper integral above.`,
  },
  {
    id: 10261,
    source: { ...januaryRegional2026, questionNumber: 26 },
    number: 141,
    division: "Mu",
    topic: "Applications of Integration",
    difficulty: 1,
    methods: [],
    question: String.raw`The function \(f(t)\) represents the rate of rainfall, in inches per hour, at time \(t\) in hours after 12 p.m. Which of the following is the best interpretation of
\[\frac1{3-1}\int_1^3f(t)\,dt=0.5?\]`,
    choices: ["At 3 pm, 0.5 inches of rain was accumulated.", "An accumulation of 0.5 inches of rain occurred from 1 pm to 3 pm.", "An average of 0.5 inches of rain per hour fell from 1 pm to 3 pm.", "An average of 0.5 inches of rain per hour was accumulated at 3 pm.", "NOTA"],
    answer: "C",
    solution: String.raw`The average value of a function \(f\) on \([a,b]\) is
\[\frac1{b-a}\int_a^bf(x)\,dx.\]
Thus the expression represents an average rainfall rate of \(0.5\) inches per hour from 1 p.m. to 3 p.m.`,
  },
  {
    id: 10262,
    source: { ...januaryRegional2026, questionNumber: 27 },
    number: 142,
    division: "Mu",
    topic: "Optimization",
    difficulty: 5,
    methods: ["Implicit Differentiation", "First Derivative Test"],
    question: String.raw`A tangent line is drawn at a point in the first quadrant on the graph of
\[\frac{x^2}{16}+\frac{y^2}{4}=1.\]
This tangent line, together with the coordinate axes, encloses a triangular region in the first quadrant. What is the minimum possible area of the interior of this triangle?`,
    choices: ["16", String.raw`\(\frac{16\sqrt3}{3}\)`, "8", String.raw`\(4\sqrt3\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \((a,b)\) be the point of tangency, so \(a^2+4b^2=16\). The tangent line to the ellipse at \((a,b)\) is
\[\frac{ax}{16}+\frac{by}{4}=1.\]
Its intercepts are \(16/a\) and \(4/b\), so the enclosed triangle has area
\[A(b)=\frac12\left(\frac{16}{a}\right)\left(\frac4b\right)
=\frac{16}{b\sqrt{4-b^2}}.\]
Here \(a=\sqrt{16-4b^2}=2\sqrt{4-b^2}\) and \(0<b<2\), since the point of tangency is strictly in the first quadrant. Differentiate and simplify:
\[A'(b)=-\frac{32(2-b^2)}{b^2(4-b^2)^{3/2}}.\]
The denominator is positive, so \(A'\) is negative for \(0<b<\sqrt2\) and positive for \(\sqrt2<b<2\). Thus \(A\) has its global minimum at \(b=\sqrt2\); the area grows without bound near either domain endpoint. Substitution gives
\[A(\sqrt2)=\frac{16}{\sqrt2\sqrt{4-2}}=8.\]`,
  },
  {
    id: 10263,
    source: { ...januaryRegional2026, questionNumber: 28 },
    number: 143,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 2,
    methods: ["Separation of Variables"],
    question: String.raw`If \(\frac{dy}{dx}=x^2y\) with \(y(0)=2\), what is \(y(3)\)?`,
    choices: [String.raw`\(2e^3\)`, String.raw`\(e^9\)`, String.raw`\(2e^9\)`, String.raw`\(2e^{27}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Separate variables:
\[\frac{dy}{y}=x^2\,dx.\]
Integration gives \(\ln|y|=x^3/3+C\). Since \(y(0)=2\), \(C=\ln2\), so
\[y=2e^{x^3/3}.\]
Thus \(y(3)=2e^9\).`,
  },
  {
    id: 10264,
    source: { ...januaryRegional2026, questionNumber: 29 },
    number: 144,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 4,
    methods: ["Implicit Differentiation"],
    question: String.raw`Consider the three statements about the graph of the curve given by \(x^2-xy+y^2=3\).

I. The graph is increasing at \((-1,1)\).

II. The graph is concave up at \((-1,1)\).

III. The graph has a vertical tangent line at \((2,1)\).

Which of these statements are true?`,
    choices: ["I only", "III only", "I and II only", "I, II, and III", "NOTA"],
    answer: "E",
    solution: String.raw`Implicit differentiation gives
\[2x-y-xy'+2yy'=0,
\qquad y'=\frac{2x-y}{x-2y}.\]
At \((-1,1)\), \(y'=(-3)/(-3)=1>0\), so the graph is increasing at this point, making I true.

To check concavity, differentiate the first implicit equation again:
\[2-2y'+2(y')^2+(2y-x)y''=0.\]
At \((-1,1)\), use \(y'=1\) to obtain \(2-2+2+3y''=0\), so \(y''=-2/3<0\). The graph is concave down, not up, and II is false.

At \((2,1)\), the denominator of \(y'\) is zero while the numerator is 3. More formally, for \(F(x,y)=x^2-xy+y^2-3\), \(F_x(2,1)=3\ne0\), so the curve is smooth there and can locally be written as \(x\) as a function of \(y\), with \(dx/dy=0\). Its tangent is therefore vertical, and III is true. Thus only I and III are true, which is NOTA.`,
  },
  {
    id: 10265,
    source: { ...januaryRegional2026, questionNumber: 30 },
    number: 145,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 4,
    methods: ["Trigonometric Identities", "Chain Rule"],
    question: String.raw`Let
\[f(x)=\frac{\sec^2(2x)+\csc^2(2x)-\tan^2(2x)-\cot^2(2x)}{(\cos(4x)+\sin(4x))^2}.\]
Which of the following is \(f'(\pi/48)\)?`,
    choices: [String.raw`\(-\frac{32\sqrt3}{9}\)`, String.raw`\(-\frac{16\sqrt3}{9}\)`, String.raw`\(\frac{32\sqrt3}{9}\)`, String.raw`\(\frac{16\sqrt3}{9}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Using the Pythagorean and double-angle identities,
\[\sec^2(2x)-\tan^2(2x)=1,\qquad\csc^2(2x)-\cot^2(2x)=1.\]
Thus the numerator is 2. For the denominator,
\[(\cos4x+\sin4x)^2=\cos^2(4x)+\sin^2(4x)+2\sin(4x)\cos(4x)=1+\sin8x.\]
Hence, wherever the original expression is defined (in particular near \(x=\pi/48\)),
\[f(x)=\frac2{1+\sin(8x)}.\]
Therefore,
\[f'(x)=-\frac{16\cos(8x)}{(1+\sin(8x))^2}.\]
At \(x=\pi/48\), this is
\[-\frac{16(\sqrt3/2)}{(1+1/2)^2}=-\frac{32\sqrt3}{9}.\]`,
  },
  // 2026 FAMAT February Regional Calculus Individual Test.
  // Retained source questions map to public Mu 146-173 (IDs 10266-10295).
  // Original questions 13 and 20 were thrown out in Region 5 and are excluded.
  // Keep the remaining IDs and original source-credit numbers stable.
  {
    id: 10266,
    source: { ...februaryRegional2026, questionNumber: 1 },
    number: 146,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Rule"],
    question: String.raw`If \(f(x)=2x^3+4x^2+x+\pi\), find \(f'(1)\).`,
    choices: ["15", "16", "17", "18", "NOTA"],
    answer: "A",
    solution: String.raw`\[f(x)=2x^3+4x^2+x+\pi\]
Differentiate term by term using the power rule. The derivative of the constant \(\pi\) is 0:
\[f'(x)=6x^2+8x+1.\]
\[f'(1)=6(1)^2+8(1)+1=15.\]`,
  },
  {
    id: 10267,
    source: { ...februaryRegional2026, questionNumber: 2 },
    number: 147,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: [],
    question: String.raw`If \(f(x)=3\cos(2x)-6\sin(3x)\), find \(\displaystyle\int_0^\pi f(x)\,dx\).`,
    choices: ["−12", "−4", "4", "12", "NOTA"],
    answer: "B",
    solution: String.raw`\[\int_0^\pi\bigl(3\cos(2x)-6\sin(3x)\bigr)\,dx
=\left[\frac32\sin(2x)+2\cos(3x)\right]_0^\pi
=0-2-0-2=-4.\]
The factors \(1/2\) and \(1/3\) in the antiderivatives account for the inner derivatives of \(2x\) and \(3x\).`,
  },
  {
    id: 10268,
    source: { ...februaryRegional2026, questionNumber: 3 },
    number: 148,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Evaluate
\[\lim_{x\to1}\frac{x^2+2x-3}{x^2+4x+3}.\]`,
    choices: ["0", String.raw`\(\frac23\)`, String.raw`\(\frac35\)`, "1", "NOTA"],
    answer: "A",
    solution: String.raw`The denominator is nonzero at \(x=1\), so direct substitution gives
\[\frac{1+2-3}{1+4+3}=0.\]`,
  },
  {
    id: 10269,
    source: { ...februaryRegional2026, questionNumber: 4 },
    number: 149,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Limit Definition of Derivatives"],
    question: String.raw`Evaluate
\[\lim_{x\to0}\frac{\cos\left(\frac\pi6+x\right)-\cos\left(\frac\pi6\right)}x.\]`,
    choices: [String.raw`\(-\frac{\sqrt3}{2}\)`, String.raw`\(-\frac12\)`, String.raw`\(\frac12\)`, String.raw`\(\frac{\sqrt3}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`This is the difference-quotient definition of the derivative of cosine at \(\pi/6\). Therefore, the limit is
\[-\sin\left(\frac\pi6\right)=-\frac12.\]`,
  },
  {
    id: 10270,
    source: { ...februaryRegional2026, questionNumber: 5 },
    number: 150,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule", "Double-Angle Identity"],
    question: String.raw`If \(f(x)=\sin(x^2)\cos(x^2)\), then \(f'\!\left(\sqrt{\frac\pi6}\right)=\)`,
    choices: [String.raw`\(-\frac{\sqrt{2\pi}}2\)`, String.raw`\(-\frac{\sqrt{6\pi}}6\)`, String.raw`\(\frac{\sqrt{6\pi}}6\)`, String.raw`\(\frac{\sqrt{2\pi}}2\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Using the sine double-angle identity,
\[f(x)=\frac12\sin(2x^2),\qquad f'(x)=2x\cos(2x^2).\]
Thus,
\[f'\!\left(\sqrt{\frac\pi6}\right)
=2\sqrt{\frac\pi6}\cos\left(\frac\pi3\right)
=\sqrt{\frac\pi6}=\frac{\sqrt{6\pi}}6.\]`,
  },
  {
    id: 10271,
    source: { ...februaryRegional2026, questionNumber: 6 },
    number: 151,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate
\[\int_0^{\pi/2}\sin^2x\cos x\,dx.\]`,
    choices: ["0", String.raw`\(\frac13\)`, String.raw`\(\frac12\)`, "1", "NOTA"],
    answer: "B",
    solution: String.raw`Using the substitution \(u=\sin x\), \(du=\cos x\,dx\), we get
\[\int_0^{\pi/2}\sin^2x\cos x\,dx=\int_0^1u^2\,du
=\left[\frac{u^3}{3}\right]_0^1=\frac13.\]
The new bounds are \(\sin0=0\) and \(\sin(\pi/2)=1\).`,
  },
  {
    id: 10272,
    source: { ...februaryRegional2026, questionNumber: 7 },
    number: 152,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`If \(f(x)=e^{\cos(2x)}\), find \(f'(\pi/3)\).`,
    choices: [String.raw`\(-\sqrt3e^{-1/2}\)`, String.raw`\(-\frac{\sqrt3}{2}e^{-1/2}\)`, String.raw`\(\frac{\sqrt3}{2}e^{-1/2}\)`, String.raw`\(\sqrt3e^{-1/2}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\[f'(x)=-2\sin(2x)e^{\cos(2x)}.\]
Therefore,
\[f'(\pi/3)=-2\left(\frac{\sqrt3}{2}\right)e^{-1/2}=-\sqrt3e^{-1/2}.\]`,
  },
  {
    id: 10273,
    source: { ...februaryRegional2026, questionNumber: 8 },
    number: 153,
    division: "Mu",
    topic: "Riemann Sums",
    difficulty: 3,
    methods: ["Riemann Sums"],
    question: String.raw`Let \(f(x)=x^5+2x^4+9x^3+2x^2+x+6\). Consider the following four values on the real interval \([0,5]\):

I. The integral of \(f(x)\).

II. The left-handed rectangular Riemann sum of \(f(x)\) with 4 subdivisions.

III. The right-handed rectangular Riemann sum of \(f(x)\) with 4 subdivisions.

IV. The trapezoidal Riemann sum of \(f(x)\) with 4 subdivisions.

Rank these four values from least to greatest.`,
    choices: ["II, IV, I, III", "II, I, IV, III", "III, IV, I, II", "III, I, IV, II", "NOTA"],
    answer: "B",
    solution: String.raw`\[f(x)=x^5+2x^4+9x^3+2x^2+x+6\]
\[f'(x)=5x^4+8x^3+27x^2+4x+1\]
\[f''(x)=20x^3+24x^2+54x+4\]
Notice that on the interval \([0,5]\), \(f\) is increasing and concave up: both derivatives are strictly positive there. Thus the left-handed Riemann sum will be less than the actual integral, and both the trapezoidal and the right-handed Riemann sum will be greater than the actual integral, with the trapezoidal sum less than the right-handed sum:
\[\mathrm{II}<\mathrm{I}<\mathrm{IV}<\mathrm{III}.\]
Indeed, for the same four equal subdivisions, the trapezoidal sum is the average of the left and right sums, so it is strictly less than the right sum.`,
  },
  {
    id: 10274,
    source: { ...februaryRegional2026, questionNumber: 9 },
    number: 154,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Chain Rule"],
    question: String.raw`Evaluate
\[\frac d{dx}\ln(\cos x).\]`,
    choices: [String.raw`\(\tan x\)`, String.raw`\(-\tan x\)`, String.raw`\(\cot x\)`, String.raw`\(-\cot x\)`, "NOTA"],
    answer: "B",
    solution: String.raw`\[\frac d{dx}\ln(\cos x)=\frac{-\sin x}{\cos x}=-\tan x.\]`,
  },
  {
    id: 10275,
    source: { ...februaryRegional2026, questionNumber: 10 },
    number: 155,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    question: String.raw`Let \(f(x)=5-x-\frac6x\), restricted to \(x>0\). Let \(a\) and \(b\) be the values with \(a<b\) that maximize \(\displaystyle\int_a^bf(x)\,dx\). What is \(a+b\)?`,
    choices: ["2", "3", "4", "5", "NOTA"],
    answer: "D",
    solution: String.raw`Computing the derivative gives
\[f'(x)=-1+\frac6{x^2},\qquad f''(x)=-\frac{12}{x^3}.\]
Notice that in the domain \(x>0\), \(f\) is entirely concave down and has only one critical point, which is a global maximum. To locate the positive region, factor:
\[f(x)=5-x-\frac6x=-\frac{(x-2)(x-3)}x.\]
For \(x>0\), this is positive exactly on \((2,3)\) and negative outside that interval. In order to maximize the integral, we want to include as much of the positive region and exclude as much of the negative region as possible. This occurs when \(a=2\) and \(b=3\), and so our answer is \(2+3=5\).`,
  },
  {
    id: 10276,
    source: { ...februaryRegional2026, questionNumber: 11 },
    number: 156,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 4,
    methods: [],
    question: String.raw`Let \(f\) be a piecewise-smooth, real-valued function (that is, a function that is smooth everywhere on the real line except at a discrete set of points). How many of the following statements are true? Interpret the derivative statements wherever the derivatives exist.

I. If \(f(x)\) is even, then \(f'(x)\) is odd.

II. If \(f'(x)\) is even, then \(f(x)\) is odd.

III. If \(f(x)\) is odd, then \(f'(x)\) is even.

IV. If \(f'(x)\) is odd, then \(f(x)\) is even.`,
    choices: ["1", "2", "3", "4", "NOTA"],
    answer: "B",
    solution: String.raw`I and III are both true from the difference quotient definition of the derivative. More explicitly, if \(f(-x)=f(x)\), differentiating gives \(-f'(-x)=f'(x)\), so \(f'\) is odd. If \(f(-x)=-f(x)\), differentiating gives \(-f'(-x)=-f'(x)\), so \(f'\) is even. These conclusions apply wherever the derivatives exist.

IV is however false. IV would be true if \(f\) were smooth everywhere, since any even function plus a constant is still even. However, without the smooth everywhere condition, this is no longer true. For example: take \(f'(x)=1/x\), which is odd on its domain. The constants of integration on the two sides of 0 can differ. As a concrete example, define the real-valued function on the whole real line by
\[f(x)=\begin{cases}\ln|x|+1,&x<0,\\0,&x=0,\\\ln|x|-1,&x>0.\end{cases}\]
It is smooth except at 0 and has the odd derivative \(1/x\) wherever that derivative exists, but \(f(-1)=1\ne-1=f(1)\), so \(f\) is not even.

II is also false: for example, the antiderivative of the constant function \(f'(x)=c\), which is even, is \(cx+m\) for any constant \(m\), which is not odd in general. Taking \(c=m=1\) gives an explicit counterexample. Therefore exactly two statements, I and III, are true.`,
  },
  {
    id: 10277,
    source: { ...februaryRegional2026, questionNumber: 12 },
    number: 157,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 2,
    methods: ["Second Derivative Test"],
    question: String.raw`A cubic polynomial has roots 2, 3, and 5. Its inflection point has x-coordinate \(\frac ab\), where \(a\) and \(b\) are relatively prime positive integers. What is \(a+b\)?`,
    choices: ["11", "12", "13", "14", "NOTA"],
    answer: "C",
    solution: String.raw`Let
\[p(x)=k(x-2)(x-3)(x-5)\]
for some nonzero real number \(k\). Differentiating gives
\[p'(x)=k\bigl((x-3)(x-5)+(x-2)(x-5)+(x-2)(x-3)\bigr),\]
\[p''(x)=k(6x-20).\]
The inflection point is then obtained by setting \(p''(x)=0\), yielding \(x=10/3\). Because \(k\ne0\), \(p''\) changes sign there, so this is indeed an inflection point. Since 10 and 3 are relatively prime, \(a+b=10+3=13\).`,
  },
  {
    id: 10279,
    source: { ...februaryRegional2026, questionNumber: 14 },
    number: 158,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 1,
    methods: [],
    question: String.raw`A cube is pushed with an initial velocity of \(3\text{ m/s}\) to the right. Suppose the wind causes an acceleration of \(2\text{ m/s}^2\) toward the left. How far in meters does the cube move until it starts turning around?`,
    choices: [String.raw`\(\frac34\)`, String.raw`\(\frac54\)`, String.raw`\(\frac74\)`, String.raw`\(\frac94\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let \(x(t)\) be the position of the cube. Then
\[x''(t)=-2,\qquad x'(t)=-2t+3.\]
The velocity remains positive until \(t=3/2\). Therefore, the distance traveled is
\[\int_0^{3/2}(-2t+3)\,dt=\left[-t^2+3t\right]_0^{3/2}
=-\frac94+\frac92=\frac94.\]
The integration constant in the velocity is 3, fixed by the initial velocity \(x'(0)=3\). Since the velocity is nonnegative on this interval, its integral is the distance traveled, not merely displacement.`,
  },
  {
    id: 10280,
    source: { ...februaryRegional2026, questionNumber: 15 },
    number: 159,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 3,
    methods: ["Related Rates"],
    question: String.raw`One side of a triangle is growing at a rate of \(2\text{ m/s}\), another side is shrinking at a rate of \(1\text{ m/s}\), and the angle between these two sides is increasing at a rate of \(\sqrt3/2\) radians per second. At some point during this process, the triangle is an equilateral triangle with side length 4 meters. What is the rate of change of the area of the triangle at this time in \(\text{m}^2/\text{s}\)?`,
    choices: [String.raw`\(4\sqrt3\)`, String.raw`\(3\sqrt3\)`, String.raw`\(2\sqrt3\)`, String.raw`\(\sqrt3\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The area is \(A=\frac12ab\sin C\), where \(a\) and \(b\) are the two side lengths and \(C\) is their included angle. Thus,
\[\frac{dA}{dt}=\frac12\frac{da}{dt}b\sin C+\frac12a\frac{db}{dt}\sin C+\frac12ab\cos C\frac{dC}{dt}.\]
Substituting \(da/dt=2\), \(db/dt=-1\), \(dC/dt=\sqrt3/2\), \(a=b=4\), and \(C=\pi/3\) gives
\[\frac{dA}{dt}
=\frac12(2)(4)\frac{\sqrt3}{2}
+\frac12(4)(-1)\frac{\sqrt3}{2}
+\frac12(4)(4)\frac12\frac{\sqrt3}{2}
=2\sqrt3-\sqrt3+2\sqrt3=3\sqrt3.\]`,
  },
  {
    id: 10281,
    source: { ...februaryRegional2026, questionNumber: 16 },
    number: 160,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: ["Related Rates", "Law of Cosines"],
    question: String.raw`One side of a triangle is growing at a rate of \(2\text{ m/s}\), another side is shrinking at a rate of \(1\text{ m/s}\), and the angle between these two sides is increasing at a rate of \(\sqrt3/2\) radians per second. At some point during this process, the triangle is an equilateral triangle with side length 4 meters. What is the rate of change of the third side length at this time?`,
    choices: [String.raw`\(\frac12\)`, String.raw`\(\frac32\)`, String.raw`\(\frac52\)`, String.raw`\(\frac72\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let \(c\) be the third side. The Law of Cosines gives
\[c^2=a^2+b^2-2ab\cos C.\]
Differentiating with respect to time,
\[2c\frac{dc}{dt}=2a\frac{da}{dt}+2b\frac{db}{dt}-2\frac{da}{dt}b\cos C-2a\frac{db}{dt}\cos C+2ab\sin C\frac{dC}{dt}.\]
At the given instant, \(a=b=c=4\), \(C=\pi/3\), \(da/dt=2\), \(db/dt=-1\), and \(dC/dt=\sqrt3/2\). Substitution gives
\[8\frac{dc}{dt}=16-8-8+4+24=28,\]
\[\frac{dc}{dt}=\frac72\text{ m/s}.\]`,
  },
  {
    id: 10282,
    source: { ...februaryRegional2026, questionNumber: 17 },
    number: 161,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["Product-to-Sum Identity"],
    question: String.raw`Let \(m\) and \(n\) be positive integers. HINT: If you have forgotten the trig product to sum formulas, use Euler's identity \(e^{ix}=\cos x+i\sin x\) and relate these integrands to \(e^{imx}e^{inx}\).

Evaluate
\[\int_0^{2\pi}\sin(mx)\cos(nx)\,dx.\]`,
    choices: [String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, String.raw`\(\frac{m+n}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using the product-to-sum identity,
\[\sin(mx)\cos(nx)=\frac12\bigl(\sin((m+n)x)+\sin((m-n)x)\bigr).\]
Each sine term integrates to 0 over \([0,2\pi]\), including when \(m=n\). Therefore, the integral is 0.`,
  },
  {
    id: 10283,
    source: { ...februaryRegional2026, questionNumber: 18 },
    number: 162,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["Product-to-Sum Identity"],
    question: String.raw`Let \(m\) and \(n\) be positive integers. HINT: If you have forgotten the trig product to sum formulas, use Euler's identity \(e^{ix}=\cos x+i\sin x\) and relate these integrands to \(e^{imx}e^{inx}\).

Evaluate
\[\int_0^{2\pi}\sin(mx)\sin(nx)\,dx.\]`,
    choices: [String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, String.raw`\(\frac{m+n}{2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Using the product-to-sum identity,
\[\sin(mx)\sin(nx)=\frac12\bigl(\cos((m-n)x)-\cos((m+n)x)\bigr).\]
If \(m\ne n\), the integral is 0. If \(m=n\), the integral is \(\pi\). Because the value depends on whether \(m=n\), none of the listed choices is always correct.`,
  },
  {
    id: 10284,
    source: { ...februaryRegional2026, questionNumber: 19 },
    number: 163,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["Gaussian Integral"],
    question: String.raw`Let \(m\) and \(n\) be positive integers. HINT: If you have forgotten the trig product to sum formulas, use Euler's identity \(e^{ix}=\cos x+i\sin x\) and relate these integrands to \(e^{imx}e^{inx}\).

One of the most famous integrals is the Gaussian integral \(\displaystyle\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt\pi\). What is
\[\int_{-\infty}^{\infty}e^{-(ax^2+bx+c)}\,dx\]
for positive \(a\)? Side note: the integral diverges if \(a\) is negative. Additionally, this formula extends to complex \(a\), \(b\), and \(c\) when the real part of \(a\) is positive, using the square-root branch positive on the positive real axis.`,
    choices: [String.raw`\(\frac{\sqrt{\pi a}}a e^{\frac{b^2}{2a}-c}\)`, String.raw`\(\frac{\sqrt{\pi a}}a e^{-c+\frac{b^2}{4a}}\)`, String.raw`\(\frac{\sqrt{2\pi a}}{2a}e^{\frac{b^2}{2a}-c}\)`, String.raw`\(\frac{\sqrt{2\pi a}}{2a}e^{\frac{b^2}{4a}-c}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The idea is to get the integral into the given form that we know. To do this, we complete the square:
\[ax^2+bx+c=a\left(x+\frac{b}{2a}\right)^2+c-\frac{b^2}{4a}.\]
We can then use the substitution \(u=x+b/(2a)\), and the integral becomes
\[e^{-c+b^2/(4a)}\int_{-\infty}^{\infty}e^{-au^2}\,du.\]
We use one more substitution \(v=\sqrt a\,u\), \(dv=\sqrt a\,du\), and the integral becomes
\[\int_{-\infty}^{\infty}e^{-(ax^2+bx+c)}\,dx
=\frac{e^{-c+b^2/(4a)}}{\sqrt a}\int_{-\infty}^{\infty}e^{-v^2}\,dv
=\frac{\sqrt{\pi a}}a e^{-c+b^2/(4a)}.\]
The shifts preserve the infinite limits for real \(b\), and \(a>0\) makes the scaling positive. The supplied Gaussian integral evaluates the final integral to \(\sqrt\pi\).`,
  },
  {
    id: 10286,
    source: { ...februaryRegional2026, questionNumber: 21 },
    number: 164,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution", "Integration by Parts"],
    question: String.raw`Evaluate
\[\int_1^4\frac{\ln x}{\sqrt x}\,dx.\]`,
    choices: [String.raw`\(\ln2-1\)`, String.raw`\(4\ln2-2\)`, String.raw`\(2\ln2-1\)`, String.raw`\(8\ln2-4\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Using the substitution \(u=\sqrt x\), \(du=\frac1{2\sqrt x}\,dx\), which implies \(dx=2u\,du\), substituting into the integral yields
\[\int_1^4\frac{\ln x}{\sqrt x}\,dx=4\int_1^2\ln u\,du.\]
Here \(\ln x=\ln(u^2)=2\ln u\), and the bounds become 1 and 2. The integral of \(\ln u\) can be determined with integration by parts, setting \(w=\ln u\), \(dw=du/u\), \(dv=du\), and \(v=u\):
\[\int\ln u\,du=u\ln u-\int1\,du=u\ln u-u+C.\]
\[4\left[u\ln u-u\right]_1^2=4(2\ln2-2+1)=8\ln2-4.\]`,
  },
  {
    id: 10287,
    source: { ...februaryRegional2026, questionNumber: 22 },
    number: 165,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 4,
    methods: ["First Derivative Test"],
    question: String.raw`Let \(f(x)=\ln x+\frac1{x^2}+bx^2\), whose domain is the positive real numbers. The values of \(b\) for which \(f\) has exactly two critical points are given in interval notation by \((m,n)\). What is \(m+n\)?`,
    choices: [String.raw`\(-\frac1{16}\)`, String.raw`\(\frac1{16}\)`, "−16", "16", "NOTA"],
    answer: "A",
    solution: String.raw`Differentiating and multiplying the critical-point equation by \(x^3\) gives
\[f'(x)=\frac1x-\frac2{x^3}+2bx=0
\quad\Longleftrightarrow\quad 2bx^4+x^2-2=0.\]
Let \(u=x^2>0\). We need the quadratic
\[2bu^2+u-2=0\]
to have two positive roots. Its discriminant must be positive, its product \(-1/b\) positive, and its sum \(-1/(2b)\) positive. These conditions give
\[-\frac1{16}<b<0.\]
To see the discriminant condition explicitly, the quadratic formula gives
\[u=\frac{-1\pm\sqrt{1+16b}}{4b}.\]
Two distinct roots require \(1+16b>0\). When \(b<0\), their positive product and positive sum force both roots to be positive. Each positive \(u\) gives exactly one allowed \(x=\sqrt u\), since the domain is \(x>0\).

At \(b=-1/16\) the roots coincide, and at \(b=0\) the equation reduces to \(u=2\), so neither endpoint belongs. Thus \(m=-1/16\), \(n=0\), and \(m+n=-1/16\).`,
  },
  {
    id: 10288,
    source: { ...februaryRegional2026, questionNumber: 23 },
    number: 166,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["First Derivative Test"],
    question: String.raw`What is the absolute value of the difference between the minimum and the maximum real values of
\[\sqrt{25-x^2}+x?\]`,
    choices: [String.raw`\(5\sqrt2+5\)`, String.raw`\(5\sqrt2\)`, "5", "10", "NOTA"],
    answer: "A",
    solution: String.raw`The domain is \([-5,5]\). Differentiating gives
\[f'(x)=-\frac{x}{\sqrt{25-x^2}}+1.\]
Setting the derivative equal to 0 gives
\[\frac{x}{\sqrt{25-x^2}}=1,\qquad x^2=25-x^2,\qquad x=\pm\frac{5\sqrt2}{2}.\]
Checking for extraneous solutions, the negative value makes the left-hand side negative and cannot satisfy the unsquared equation. The only critical point is therefore \(x=5\sqrt2/2\). A second derivative also verifies that this critical point is a local maximum:
\[f''(x)=-\frac{25}{(25-x^2)^{3/2}}<0.\]
Now, notice that to get real values of this expression, we are restricted to the domain \([-5,5]\). Thus, to find the minimum and maximum values, we have to plug in \(\pm5\) and \(5\sqrt2/2\):
\[f(-5)=-5,\qquad f(5)=5,\qquad f\left(\frac{5\sqrt2}{2}\right)=5\sqrt2.\]
Thus, we see that the maximum is \(5\sqrt2\) and the minimum is \(-5\). The requested absolute difference is
\[5\sqrt2-(-5)=5\sqrt2+5.\]`,
  },
  {
    id: 10289,
    source: { ...februaryRegional2026, questionNumber: 24 },
    number: 167,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: ["Taylor's Theorem"],
    question: String.raw`Let \(f\) be a function defined on the real line such that \(f(x)=e^{-1/x^2}\) for \(x>0\) and \(f(x)=0\) otherwise. Which of the following statements are true?

I. \(f\) is infinitely differentiable everywhere.

II. The Taylor series of \(f\) centered at \(x=0\) converges everywhere on the real line.

III. \(f\) is analytic on the real line; that is, at every real point it agrees with its Taylor series in some neighborhood of that point.`,
    choices: ["I", "I, II", "I, II, III", "All three are false", "NOTA"],
    answer: "B",
    solution: String.raw`I is true: since the exponential function and \(-1/x^2\) are infinitely differentiable for positive \(x\), \(e^{-1/x^2}\) is infinitely differentiable for positive \(x\), and of course constant functions are infinitely differentiable. Thus, we only need to check the behavior at \(x=0\).

We have that \(\lim_{x\to0^+}e^{-1/x^2}=0\) and that all derivatives for \(x>0\) are of the form \(R(x)e^{-1/x^2}\), where \(R(x)\) is a polynomial in \(1/x\). This form follows inductively from the product and chain rules. Exponential decay dominates every power: putting \(u=1/x\), we have \(u^ke^{-u^2}\to0\) as \(u\to\infty\) for every nonnegative integer \(k\).

To establish the derivatives at 0, not just their one-sided limits, suppose \(f^{(j)}(0)=0\). Its right-hand difference quotient is \(R_j(h)e^{-1/h^2}/h\), which tends to 0 by the same decay property. Its left-hand difference quotient is 0 because the function is identically 0 on \(x<0\). Starting with continuity at 0, induction gives \(f^{(j)}(0)=0\) for every \(j\). Thus \(f\) is infinitely differentiable.

II is true: due to the previous calculation, all derivatives of \(f\) at \(x=0\) are 0, meaning the Taylor series of \(f\) at \(x=0\) is simply the constant function 0, which converges everywhere on the real line.

III is false: clearly, \(e^{-1/x^2}\) is not equal to 0 for \(x>0\). Every neighborhood of 0 includes positive \(x\), so \(f\) does not agree with its Taylor series in any neighborhood of 0 and is not analytic there.

This problem illustrates the subtleties of smooth functions, analytic functions, and Taylor series. A function being smooth at a point means it has a Taylor series at that point. The Taylor series can have any radius of convergence, but this in no way implies that in that radius of convergence, the function may or may not equal its Taylor series. Only I and II are true.`,
  },
  {
    id: 10290,
    source: { ...februaryRegional2026, questionNumber: 25 },
    number: 168,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 3,
    methods: ["Related Rates"],
    question: String.raw`A particle is moving along the parabola \(y=-x^2+5x+6\) at a constant speed of \(1\text{ m/s}\) measured along the curve, in the direction of increasing \(x\). What is \(\frac{dx}{dt}\) when the particle is at the larger of the two roots?`,
    choices: [String.raw`\(\frac{\sqrt2}{6}\)`, String.raw`\(\frac{\sqrt2}{8}\)`, String.raw`\(\frac{\sqrt2}{10}\)`, String.raw`\(\frac{\sqrt2}{12}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Differentiating the curve with respect to time gives
\[\frac{dy}{dt}=(-2x+5)\frac{dx}{dt}.\]
The speed condition is
\[\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2=1.\]
Thus, because \(x\) is increasing,
\[\frac{dx}{dt}=\frac1{\sqrt{1+(-2x+5)^2}}.\]
The larger root of \(-x^2+5x+6\) is \(x=6\), so
\[\frac{dx}{dt}=\frac1{\sqrt{50}}=\frac{\sqrt2}{10}.\]`,
  },
  {
    id: 10291,
    source: { ...februaryRegional2026, questionNumber: 26 },
    number: 169,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 2,
    methods: ["Related Rates"],
    question: String.raw`A particle is moving along the parabola \(y=-x^2+5x+6\) at a constant speed of \(1\text{ m/s}\) measured along the curve, in the direction of increasing \(x\). What is \(\frac{dx}{dt}\) at the maximum of the parabola?`,
    choices: [String.raw`\(\frac15\)`, String.raw`\(\frac25\)`, String.raw`\(\frac35\)`, String.raw`\(\frac45\)`, "NOTA"],
    answer: "E",
    solution: String.raw`At the maximum of the parabola, \(dy/dx=0\), so \(dy/dt=0\). Since the particle has speed \(1\text{ m/s}\) and \(x\) is increasing,
\[\frac{dx}{dt}=1.\]
This is not one of the listed choices.`,
  },
  {
    id: 10292,
    source: { ...februaryRegional2026, questionNumber: 27 },
    number: 170,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate
\[\int_{1/2}^2\frac{\tan^{-1}x}{x}\,dx.\]`,
    choices: [String.raw`\(\pi\ln4\)`, String.raw`\(\frac\pi2\ln4\)`, String.raw`\(\frac\pi3\ln4\)`, String.raw`\(\frac\pi4\ln4\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let
\[I=\int_{1/2}^2\frac{\tan^{-1}x}{x}\,dx.\]
Using \(u=1/x\) and \(\tan^{-1}(1/u)=\pi/2-\tan^{-1}u\), we obtain
\[I=\int_{1/2}^2\frac{\pi/2-\tan^{-1}u}{u}\,du
=\frac\pi2\int_{1/2}^2\frac{du}{u}-I.\]
Therefore,
\[2I=\frac\pi2\ln4,\qquad I=\frac\pi4\ln4.\]`,
  },
  {
    id: 10293,
    source: { ...februaryRegional2026, questionNumber: 28 },
    number: 171,
    division: "Mu",
    topic: "Polynomials",
    difficulty: 4,
    methods: [],
    question: String.raw`The Legendre polynomials are a set of polynomials with positive leading coefficients, where \(P_n(x)\) denotes the Legendre polynomial of degree \(n\) that satisfies
\[\int_{-1}^1P_m(x)P_n(x)\,dx=\frac2{2n+1}\delta_{mn}\]
for all nonnegative integers \(m\) and \(n\), including 0. Here, \(\delta_{mn}\) is the Kronecker delta and equals 1 when \(m=n\), and 0 otherwise. Using this property, find \(P_2(x)\).`,
    choices: [String.raw`\(\frac32x^2-\frac12\)`, String.raw`\(\frac34x^2-\frac12\)`, String.raw`\(\frac32x^2+\frac12\)`, String.raw`\(\frac34x^2+\frac12\)`, "NOTA"],
    answer: "A",
    solution: String.raw`First, we find \(P_0(x)\). The rule for Legendre Polynomials gives
\[\int_{-1}^1P_0(x)^2\,dx=2.\]
Since \(P_0\) has degree 0, it is a constant \(k\), so \(2k^2=2\). The positive-leading-coefficient convention fixes \(k=1\), so \(P_0(x)=1\).

Now we find \(P_1(x)=ax+b\). Using the rule, we get the following two equations:
\[\int_{-1}^1(ax+b)\,dx=0,\qquad \int_{-1}^1(ax+b)^2\,dx=\frac23.\]
The first equation gives \(2b=0\), so \(b=0\). The second equation is then
\[\int_{-1}^1(ax)^2\,dx=\frac{2a^2}{3}=\frac23.\]
Hence \(a^2=1\); the positive leading coefficient gives \(a=1\), so \(P_1(x)=x\).

Finally, we find \(P_2(x)=cx^2+dx+e\). We get the following three equations from orthogonality with \(P_0\) and \(P_1\), together with normalization:
\[\int_{-1}^1(cx^2+dx+e)\,dx=0,\]
\[\int_{-1}^1x(cx^2+dx+e)\,dx=0,\]
\[\int_{-1}^1(cx^2+dx+e)^2\,dx=\frac25.\]
The second equation gives \(2d/3=0\), so \(d=0\). The first and third equations are then
\[\frac{2c}{3}+2e=0,\]
\[\frac{2c^2}{5}+\frac{4ce}{3}+2e^2=\frac25.\]
The first equation gives \(e=-c/3\). Substituting into the second yields
\[c^2\left(\frac25-\frac49+\frac29\right)=\frac25,\]
\[\frac{8c^2}{45}=\frac25,\qquad c^2=\frac94.\]
The positive leading coefficient selects \(c=3/2\), and hence \(e=-1/2\). Therefore,
\[P_2(x)=\frac32x^2-\frac12.\]`,
  },
  {
    id: 10294,
    source: { ...februaryRegional2026, questionNumber: 29 },
    number: 172,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["U-Substitution", "Trigonometric Substitution"],
    question: String.raw`Evaluate
\[\int_{\ln2}^{2\ln2}\frac{1}{1-4e^{-x}+8e^{-2x}}\,dx.\]`,
    choices: [String.raw`\(\frac14\ln2+\frac\pi4\)`, String.raw`\(\frac12\ln2+\frac\pi4\)`, String.raw`\(\ln2+\frac\pi4\)`, String.raw`\(2\ln2+\frac\pi4\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Multiply the numerator and denominator by \(e^{2x}\), then let \(u=e^x\), \(du=e^x\,dx\):
\[\int_{\ln2}^{2\ln2}\frac{e^{2x}}{e^{2x}-4e^x+8}\,dx
=\int_2^4\frac{u}{(u-2)^2+4}\,du.\]
Let \(u-2=2\tan\theta\). The bounds become \(0\) and \(\pi/4\), and the integral simplifies to
\[\frac12\int_0^{\pi/4}(2\tan\theta+2)\,d\theta
=\left[-\ln(\cos\theta)+\theta\right]_0^{\pi/4}
=\frac12\ln2+\frac\pi4.\]
Indeed, \(du=2\sec^2\theta\,d\theta\), \((u-2)^2+4=4\sec^2\theta\), and \(u=2\tan\theta+2\), which explains the factor \(1/2\) in the transformed integral.`,
  },
  {
    id: 10295,
    source: { ...februaryRegional2026, questionNumber: 30 },
    number: 173,
    division: "Mu",
    topic: "Parametric",
    difficulty: 3,
    methods: ["Chain Rule"],
    question: String.raw`A particle starting at \((1,0)\) at rest moves counterclockwise on the unit circle, such that its rotational speed increases uniformly at a rate of \(\pi/6\) radians per second squared. What is the particle's acceleration the first time it reaches the point \((-1,0)\)?`,
    choices: [String.raw`\(\left\langle\frac{\pi^2}{3},-\frac\pi3\right\rangle\)`, String.raw`\(\left\langle\frac{\pi^2}{6},-\frac\pi3\right\rangle\)`, String.raw`\(\left\langle\frac{\pi^2}{3},-\frac\pi6\right\rangle\)`, String.raw`\(\left\langle\frac{\pi^2}{6},-\frac\pi6\right\rangle\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Parameterize the unit circle by
\[x=\cos\theta,\qquad y=\sin\theta.\]
Since \(\theta''=\pi/6\) and the particle starts at rest,
\[\theta'=\frac\pi6t,\qquad \theta=\frac\pi{12}t^2.\]
The first time the particle reaches \((-1,0)\), \(\theta=\pi\), so \(t=2\sqrt3\). Differentiating twice,
\[x''=-\theta''\sin\theta-(\theta')^2\cos\theta,\]
\[y''=\theta''\cos\theta-(\theta')^2\sin\theta.\]
At \(\theta=\pi\) and \(t=2\sqrt3\), this gives
\[x''=-\frac\pi6\sin\pi-\left(\frac\pi6\,2\sqrt3\right)^2\cos\pi=\frac{\pi^2}{3},\]
\[y''=\frac\pi6\cos\pi-\left(\frac\pi6\,2\sqrt3\right)^2\sin\pi=-\frac\pi6.\]
Thus, the acceleration vector is
\[\left\langle x'',y''\right\rangle
=\left\langle\frac{\pi^2}{3},-\frac\pi6\right\rangle.\]`,
  },
  // 2026 Mu Alpha Theta King February Statewide Calculus Individual Test.
  // Source questions 1-30 map to public Mu 174-203 (IDs 10296-10325).
  {
    id: 10296,
    source: { ...kingFebruary2026, questionNumber: 1 },
    number: 174,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate \(\displaystyle\int_0^3(1+x)^2\,dx\).`,
    choices: ["21", String.raw`\(\frac{64}{3}\)`, "63", String.raw`\(\frac{190}{3}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\[\int_0^3(1+x)^2\,dx
=\left[\frac{(1+x)^3}{3}\right]_0^3
=\frac{64}{3}-\frac13=21.\]`,
  },
  {
    id: 10297,
    source: { ...kingFebruary2026, questionNumber: 2 },
    number: 175,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["First Derivative Test"],
    question: String.raw`Find the maximum value of \(f(x)=-x^4+4x^2+1\), where the domain is all real numbers.`,
    choices: ["1", String.raw`\(\frac{11}{4}\)`, "4", "5", "NOTA"],
    answer: "D",
    solution: String.raw`First, notice that \(f(x)\to-\infty\) when \(x\to\pm\infty\), so we don't have to worry about it approaching \(+\infty\) anywhere. The maximum must be at a point where \(f'(x)=0\): this means
\[-4x^3+8x=-4x(x^2-2)=0,\]
so either \(x=0\) or \(x=\pm\sqrt2\). We can plug in and check which is greater:
\[f(0)=1,\qquad f(\pm\sqrt2)=-4+8+1=5\]
for both \(+\sqrt2\) and \(-\sqrt2\). Of these, the maximum is \(\boxed5\).`,
  },
  {
    id: 10298,
    source: { ...kingFebruary2026, questionNumber: 3 },
    number: 176,
    division: "Mu",
    topic: "Fundamental Theorem of Calculus",
    difficulty: 2,
    methods: [],
    question: String.raw`For \(0<x<2\pi\), find the sum of the possible values of \(x\) such that
\[\int_{\pi/4}^x\cos(t)\,dt=0.\]`,
    choices: [String.raw`\(\pi\)`, String.raw`\(\frac{3\pi}{2}\)`, String.raw`\(2\pi\)`, String.raw`\(3\pi\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\[\int_{\pi/4}^x\cos(t)\,dt=\left[\sin(t)\right]_{\pi/4}^x=\sin(x)-\sin\left(\frac\pi4\right).\]
If we set this to 0 then we get \(\sin(x)=\sin(\pi/4)\). This happens at \(x=\pi/4,3\pi/4\) in \(0<x<2\pi\). The sum of these is \(\pi/4+3\pi/4=\boxed\pi\).`,
  },
  {
    id: 10299,
    source: { ...kingFebruary2026, questionNumber: 4 },
    number: 177,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 1,
    methods: ["Disk Method"],
    question: String.raw`Gabriel's Little Horn is formed by revolving the graph \(y=\frac1x\) for \(1\le x\le4\) around the \(x\)-axis. What is the volume of Gabriel's little Horn?`,
    choices: [String.raw`\(\frac\pi4\)`, String.raw`\(\frac\pi2\)`, String.raw`\(\frac{3\pi}{4}\)`, String.raw`\(\pi\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The volume of a solid of revolution defined by \(y=f(x)\), rotated around the \(x\)-axis, is \(\pi\int(f(x))^2\,dx\), by the washer method (here the inner radius is 0). So, the volume is
\[\pi\int_1^4\frac1{x^2}\,dx=\pi\left[-\frac1x\right]_1^4=\pi\left[1-\frac14\right]=\boxed{\frac{3\pi}4}.\]`,
  },
  {
    id: 10300,
    source: { ...kingFebruary2026, questionNumber: 5 },
    number: 178,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: ["First Derivative Test", "Second Derivative Test"],
    question: String.raw`The graph of \(y=\sin(x)-x\) has many points where the slope of the tangent line is 0. Which choice correctly describes the nature of these points?`,
    choices: ["Some are local maxima, some are local minima", "Some are local maxima, some are inflection points", "All are local maxima", "All are inflection points", "NOTA"],
    answer: "D",
    solution: String.raw`Call such points good points; since \(y'=\cos(x)-1\), all good points have \(\cos(x)=1\), so \(x=2\pi k\) for integers \(k\).
Now, \(y''=-\sin(x)\): you can either check the \(x\)-values or use \(\sin^2(x)+\cos^2(x)=1\) to see that \(y''=0\) at all good points. This means all good points are inflection points as long as \(y'''=-\cos(x)\) is nonzero, and since \(\cos(x)=1\) at good points, it definitely will be. More explicitly, near \(x=2\pi k\), \(-\sin(x)\) changes from positive to negative, so the concavity changes there. Also \(y'=\cos x-1\le0\) on both sides, so none is a local maximum or minimum. The good points are all inflection points.`,
  },
  {
    id: 10301,
    source: { ...kingFebruary2026, questionNumber: 6 },
    number: 179,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Mean Value Theorem"],
    question: String.raw`Let \(f(t)=\ln(t)\). What is the value of \(t\) that satisfies the mean value theorem of derivatives for \(f(t)\) on the interval \([1,e]\)?`,
    choices: [String.raw`\(e-1\)`, String.raw`\(\frac e2\)`, String.raw`\(\frac e2+1\)`, String.raw`\(\frac{e+1}{2}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The mean value theorem of derivatives says there must exist some \(t\) in the open interval \((1,e)\) such that
\[f'(t)=\frac{f(e)-f(1)}{e-1}.\]
The theorem applies because \(\ln t\) is continuous on \([1,e]\) and differentiable on \((1,e)\). Using \(f'(t)=1/t\) and solving:
\[\frac1t=\frac{\ln(e)-\ln(1)}{e-1}=\frac1{e-1}\quad\Longrightarrow\quad t=\boxed{e-1}.\]
This lies in \((1,e)\), as required.`,
  },
  {
    id: 10302,
    source: { ...kingFebruary2026, questionNumber: 7 },
    number: 180,
    division: "Mu",
    topic: "Geometry",
    difficulty: 3,
    methods: [],
    question: String.raw`A line is drawn on the curved surface of a cylinder. The line is straight, and perpendicular to both of the cylinder's circular faces. If this line is fixed in place and the cylinder is revolved around it, what shape would be formed by the revolution?`,
    choices: ["Sphere", "Cylinder", "Torus", "Two spheres", "NOTA"],
    answer: "B",
    solution: String.raw`The diagram shows the scenario; the volume traced out by rotating the red cylinder about the blue line is everything enclosed by the green region. This is shaped like another cylinder, with double the radius of the original cylinder.
[[solution-diagram:mu-302]]
To see why the entire interior is swept out, take a cross-section perpendicular to the fixed line. The original cylinder gives a disk of radius \(r\), and the line meets its circumference. Rotating that disk about this boundary point sweeps every distance from 0 to \(2r\), making a disk of radius \(2r\). The cylinder's height does not change, so the resulting solid is a cylinder.`,
  },
  {
    id: 10303,
    source: { ...kingFebruary2026, questionNumber: 8 },
    number: 181,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate \(\displaystyle\int_1^e\frac{e^x}{e^x+1}\,dx\):`,
    choices: [String.raw`\(\ln\left(\frac{e^e+e}{e^e-e}\right)\)`, String.raw`\(\ln\left(\frac{e^e+1}{e+1}\right)\)`, String.raw`\(\ln\left(\frac{e^e-e}{e^e+e}\right)\)`, String.raw`\(\ln\left(\frac{e^e-1}{e-1}\right)\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Use the substitution \(u=e^x+1\), \(du=e^x\,dx\). Note the bounds must change: \(1\mapsto e^1+1=e+1\), and \(e\mapsto e^e+1\).
\[\int_1^e\frac1{e^x+1}e^x\,dx=\int_{e+1}^{e^e+1}\frac1u\,du\]
\[=\left[\ln(u)\right]_{e+1}^{e^e+1}=\ln(e^e+1)-\ln(e+1)=\boxed{\ln\left(\frac{e^e+1}{e+1}\right)}.\]`,
  },
  {
    id: 10304,
    source: { ...kingFebruary2026, questionNumber: 9 },
    number: 182,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`At the point \((\pi,2\pi)\) on the curve \(y\sin(x)=x\sin(y)\), what is \(\frac{dy}{dx}\)?`,
    choices: ["−2", String.raw`\(-\frac12\)`, String.raw`\(\frac12\)`, "2", "NOTA"],
    answer: "A",
    solution: String.raw`First, check that the point \((\pi,2\pi)\) is on the curve; plugging in gives \(2\pi\sin(\pi)=\pi\sin(2\pi)\); both sides are 0, so it is on the curve. Now, take \(d/dx\) of both sides and evaluate at the point:
\[\frac d{dx}(y\sin x)=\frac d{dx}(x\sin y)\]
\[y'\sin x+y\cos x=\sin y+xy'\cos y\]
\[y'\sin\pi+2\pi\cos\pi=\sin(2\pi)+\pi y'\cos(2\pi)\]
\[0\cdot y'+2\pi(-1)=0+\pi\cdot y'\cdot1\]
\[-2\pi=\pi y'\quad\Longrightarrow\quad y'=\boxed{-2}.\]`,
  },
  {
    id: 10305,
    source: { ...kingFebruary2026, questionNumber: 10 },
    number: 183,
    division: "Mu",
    topic: "Parametric",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`A parametric curve is defined by \((x(t),y(t))\) for \(t\ge0\), where:
\[x(t)=t\cos(t),\qquad y(t)=\sin(t).\]
What is \(\frac{dy}{dx}\) on the curve at \(t=\pi\)?`,
    choices: ["−1", "0", "1", String.raw`\(\infty\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Note that \(dy/dx=y'(t)/x'(t)\). Finding these and then plugging in \(t=\pi\):
\[\frac{dy}{dx}=\frac{(\sin t)'}{(t\cos t)'}=\frac{\cos t}{\cos t-t\sin t}=\frac{-1}{-1-0}=\boxed1.\]
Here the product rule gives \(x'(t)=\cos t-t\sin t\), which is nonzero at \(t=\pi\), so the quotient is defined.`,
  },
  {
    id: 10306,
    source: { ...kingFebruary2026, questionNumber: 11 },
    number: 184,
    division: "Mu",
    topic: "Parametric",
    difficulty: 4,
    methods: ["Chain Rule"],
    question: String.raw`A parametric curve is defined by \((x(t),y(t))\) for \(t\ge0\), where:
\[x(t)=t\cos(t),\qquad y(t)=\sin(t).\]
Vignesh picks a point \((X,Y)\) on the curve and finds that the curve has a vertical tangent line at that point. Which of the following must be true?`,
    choices: [String.raw`\(X=\frac{1-Y^2}{Y}\)`, String.raw`\(X=\frac{Y^2-1}{Y^2}\)`, String.raw`\(X=\sqrt{\frac{1-Y^2}{Y}}\)`, String.raw`\(X=\frac{\sqrt{Y^2-1}}Y\)`, "NOTA"],
    answer: "A",
    solution: String.raw`There are two conditions that any point \((X,Y)\) must obey in order for the curve to have a vertical tangent at \((X,Y)\). First, the point has to be on the curve; second, \(dy/dx\) diverges to \(\pm\infty\) at that point, which implies \(x'(t)=0\) at that point. Using the second condition:
\[\cos(t)-t\sin(t)=0\quad\Longrightarrow\quad\cot(t)=t.\]
At such a point \(\sin t\ne0\): otherwise the equation would also force \(\cos t=0\), which is impossible. Likewise \(y'(t)=\cos t\ne0\), since \(\cos t=0\) would force \(t=0\), where \(\cos0=1\).
Using the first condition, \((X,Y)=(t\cos t,\sin t)\) for some \(t\). We want to use this along with our condition that \(t=\cot t\) to get an equation with only \(X\) and \(Y\), no \(t\). The easiest way to do this is to look at \(X/Y\):
\[\frac XY=\frac{t\cos t}{\sin t}=t\cot t=\cot^2t=\csc^2t-1=\frac1{\sin^2t}-1=\frac1{Y^2}-1.\]
Multiplying by \(Y\ne0\) gives \(\boxed{X=\frac{1-Y^2}{Y}}\).`,
  },
  {
    id: 10307,
    source: { ...kingFebruary2026, questionNumber: 12 },
    number: 185,
    division: "Mu",
    topic: "Sequences",
    difficulty: 2,
    methods: ["Recursion"],
    question: String.raw`Let \(x_0=1\), and \(x_{n+1}=\cos(x_n)\) for integers \(n\ge0\). This sequence converges, so \(\displaystyle\lim_{n\to\infty}\{x_n\}=D\), where \(D\) is Dottie's number. Which of the following is equivalent to \(\sin(D)\)?`,
    choices: [String.raw`\(\sqrt{1-D^2}\)`, String.raw`\(-\sqrt{1-D^2}\)`, String.raw`\(D^2-D\)`, String.raw`\(D-D^2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Since the sequence converges as \(n\to\infty\), it implies that, as \(n\to\infty\), \(x_n\) won't change from one term to the next. This means that the converging value \(D\) satisfies the equation \(D=\cos(D)\). Using \(\sin^2(D)+\cos^2(D)=1\), we get
\[\sin(D)=\pm\sqrt{1-\cos^2(D)}=\pm\sqrt{1-D^2}.\]
To know whether \(\sin(D)\) is positive or negative, we need to find its approximate location. The easiest way to do this is to plot the graphs \(y=x\) and \(y=\cos x\); the intersection point has \(x=\cos x\), so the \(x\)-position of that point is \(D\).
No numerical approximation is needed: \(x_0=1\), and \(0\le x_n\le1\) implies \(\cos1\le x_{n+1}\le1\). Consequently \(\cos1\le D\le1<\pi/2\), so \(0<D<\pi/2\). Since sine is positive throughout this interval, we must use the positive sign:
\[\sin(D)=\boxed{\sqrt{1-D^2}}.\]`,
  },
  {
    id: 10308,
    source: { ...kingFebruary2026, questionNumber: 13 },
    number: 186,
    division: "Mu",
    topic: "Systems of Equations",
    difficulty: 3,
    methods: [],
    question: String.raw`Let \(F(x)=Ae^x+Be^{-x}+C\sin(x)+D\cos(x)\) for constants \(A,B,C,D\).
Given that \(F(0)=0\), \(F'(0)=1\), \(F''(0)=2\), \(F'''(0)=3\), what is \(ABCD\)?`,
    choices: [String.raw`\(-\frac94\)`, String.raw`\(-\frac9{16}\)`, String.raw`\(-\frac34\)`, String.raw`\(-\frac3{16}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`We set up a system of equations using the given information; it looks like this (each line corresponds to one of the given equations):
\[\begin{aligned}A+B+D&=0&&(a)\\A-B+C&=1&&(b)\\A+B-D&=2&&(c)\\A-B-C&=3&&(d)\end{aligned}\]
Evaluating \((a)-(c)\) shows \(D=-1\). Evaluating \((b)-(d)\) shows \(C=-1\). Using \(C=D=-1\), equations \((a)\) and \((b)\) become \(A+B=1\) and \(A-B=2\); adding gives \(A=3/2\). Finally, \(B\) can be solved with any equation, which gives \(B=-1/2\). So,
\[ABCD=\left(\frac32\right)\left(-\frac12\right)(-1)(-1)=\boxed{-\frac34}.\]`,
  },
  {
    id: 10309,
    source: { ...kingFebruary2026, questionNumber: 14 },
    number: 187,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: [],
    question: String.raw`Evaluate
\[\lim_{x\to\infty}\frac{\lfloor\sin(\pi x)\rfloor+\lceil\sin(\pi x)\rceil}{(-1)^{\lfloor x\rfloor}}.\]`,
    choices: ["−1", "0", "1", String.raw`\(\infty\)`, "NOTA"],
    answer: "E",
    solution: String.raw`There are several ways to show that this expression doesn't converge. Here is one:
If \(x\) is an integer, then \(\sin(\pi x)=0\), so the whole expression is 0.
Along \(x=2n+1/4\), \(\sin(\pi x)=\sqrt2/2\), so its floor is 0 and its ceiling is 1; the denominator is \((-1)^{2n}=1\). Thus the expression is 1 along this sequence.
Both sequences tend to \(+\infty\), but give different limits, 0 and 1. Therefore the limit does not exist (DNE), and the answer is NOTA.
The floor and ceiling cannot simply be replaced by -1 and 0 at every noninteger \(x\): when \(\sin(\pi x)=1\) or -1, both have that same integer value. The two sequences above avoid this exception.`,
  },
  {
    id: 10310,
    source: { ...kingFebruary2026, questionNumber: 15 },
    number: 188,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 5,
    methods: ["Continued Fractions", "Implicit Differentiation"],
    question: String.raw`Evaluate
\[\frac d{dx}\left(x+\cfrac{1+\cfrac{x+\frac{1+\cdots}{x+\cdots}}{1+\frac{x+\cdots}{1+\cdots}}}{x+\cfrac{1+\frac{x+\cdots}{1+\cdots}}{x+\frac{1+\cdots}{x+\cdots}}}\right)\]
at \(x=1\). (Every \(x\) is added to \(\frac{1+\cdots}{x+\cdots}\), and every \(1\) is added to \(\frac{x+\cdots}{1+\cdots}\).)`,
    choices: [String.raw`\(\frac14\)`, String.raw`\(\frac34\)`, "2", String.raw`\(\frac{11}{4}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`If the expression in parentheses is \(y\), we can write an implicit equation for \(y\). Notice that for every \(x\), the expression added to it is \((1+\text{thing 1})/(x+\text{thing 2})\), where thing 1 and thing 2 are more nested expressions. But looking carefully, we can see that \(\text{thing 2}=1/\text{thing 1}\) and \(\text{thing 2}=y-x\). Mathematically, this means:
\[y=x+\frac{1+\frac1{y-x}}{x+(y-x)}=x+\frac{1+\frac1{y-x}}y\]
\[y^2=xy+1+\frac1{y-x}\]
\[y^3-xy^2=xy^2-x^2y+y-x+1\]
\[0=-y^3+2xy^2-x^2y+y-x+1.\]
Now, at \(x=1\), we get \(y^3=2y^2\), which implies either \(y=0\) or \(y=2\); given our expression is 1 plus something positive, clearly the first is impossible, so we take \(y=2\). Taking the derivative of our implicit equation:
\[0=-3y^2y'+2y^2+4xyy'-2xy-x^2y'+y'-1.\]
Substituting \((x,y)=(1,2)\) gives
\[0=y'(-12+8-1+1)+(8-4-1)=-4y'+3,\]
so \(y'=\boxed{3/4}\). The coefficient of \(y'\) is nonzero, so implicit differentiation determines the derivative locally.`,
  },
  {
    id: 10311,
    source: { ...kingFebruary2026, questionNumber: 16 },
    number: 189,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["U-Substitution"],
    question: String.raw`What is \(\displaystyle\lim_{n\to\infty}\left(n\cdot\int_0^1x(1-x^2)^n\,dx\right)\)?`,
    choices: ["0", String.raw`\(\frac14\)`, String.raw`\(\frac12\)`, String.raw`\(\frac{\sqrt2}{2}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`We can evaluate this integral using \(u=1-x^2\), \(du=-2x\,dx\) (trig sub works too):
\[\int_0^1x(1-x^2)^n\,dx=-\frac12\int_1^0u^n\,du=-\frac12\left[\frac{u^{n+1}}{n+1}\right]_1^0=\frac1{2(n+1)}.\]
So, the limit is
\[\lim_{n\to\infty}\frac{n}{2(n+1)}=\lim_{n\to\infty}\frac{n}{2n+2}=\boxed{\frac12}.\]`,
  },
  {
    id: 10312,
    source: { ...kingFebruary2026, questionNumber: 17 },
    number: 190,
    division: "Mu",
    topic: "Inverse Functions",
    difficulty: 4,
    methods: ["U-Substitution"],
    question: String.raw`Let \(f(x)=x^3+x\), and \(f^{-1}(x)\) be the inverse of \(f(x)\). The integral \(\displaystyle\int\frac{f^{-1}(x)}x\,dx\), ignoring the integration constant, can be written as \(Af^{-1}(x)+B\arctan(f^{-1}(x))\) for integers \(A,B\). Find \(A+B\).`,
    choices: ["−2", "−1", "0", "1", "NOTA"],
    answer: "D",
    solution: String.raw`Finding \(f^{-1}(x)\) analytically is technically possible with the cubic formula, but way too difficult. Instead, let's make the substitution \(x=\xi^3+\xi\), \(dx=(3\xi^2+1)\,d\xi\), then make use of the fact that \(f^{-1}(x)=f^{-1}(\xi^3+\xi)=\xi\):
\[\int\frac{f^{-1}(x)}x\,dx=\int\frac{f^{-1}(\xi^3+\xi)}{\xi^3+\xi}(3\xi^2+1)\,d\xi\]
\[=\int\frac{\xi}{\xi^3+\xi}(3\xi^2+1)\,d\xi=\int\frac{3\xi^2+1}{\xi^2+1}\,d\xi\]
\[=\int\left(3-\frac2{\xi^2+1}\right)d\xi=3\xi-2\arctan\xi.\]
The cancellation is valid on each interval where the original integrand is defined, namely \(x\ne0\). Also \(f'(x)=3x^2+1>0\), so \(f\) is one-to-one and the inverse exists.
Finally, again by definition, \(\xi=f^{-1}(x)\), so this is equivalent to \(3f^{-1}(x)-2\arctan(f^{-1}(x))\), so \(A+B=3-2=\boxed1\).`,
  },
  {
    id: 10313,
    source: { ...kingFebruary2026, questionNumber: 18 },
    number: 191,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 5,
    methods: ["Infinite Geometric Series"],
    question: String.raw`Evaluate
\[\int_0^1\min\left(|x-1|,\left|x-\frac12\right|,\left|x-\frac14\right|,\left|x-\frac18\right|,\ldots\right)dx.\]
At \(x=0\), use the continuous limiting value 0 for the integrand.`,
    choices: [String.raw`\(\frac1{32}\)`, String.raw`\(\frac1{20}\)`, String.raw`\(\frac1{16}\)`, String.raw`\(\frac1{12}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Note that the integrand is 0 at \(x=1,1/2,1/4,\ldots\). Between these powers of two, the integrand is equal to the distance of \(x\) to the nearest power of two. Plotting it out, the integrand looks something like the image below:
[[solution-diagram:mu-313]]
Each colored triangular region lies between consecutive powers of \(1/2\). Its two sides come from the absolute-value terms for the two endpoints, switching at the midpoint. There are 0s where \(x\) is equal to a power of 2, since one of the \(|x-2^{-n}|\) terms will be 0 at those points. The peaks are when \(x\) is exactly halfway between powers of 2; for instance, for \(x=3/4\), the distance from \(x\) to both \(x=1/2\) and \(x=1\) is \(1/4\), hence the integrand's value is \(1/4\). Notice that the value of the integrand at each peak must equal half of the distance between the powers of two.
So, as \(x\) goes from \(2^{-n}\) to \(2^{-(n-1)}\), the integrand forms a triangle with width \(2^{-(n-1)}-2^{-n}=2^{-n}\), and height equal to half of that. So, the area of the \(n\)th triangle is
\[\frac12hw=\frac12\left(\frac12\cdot\frac1{2^n}\right)\left(\frac1{2^n}\right)=\frac1{2^{2n+2}}.\]
This means the total area is
\[\sum_{n=1}^\infty\frac1{2^{2n+2}}=\frac{1/16}{1-1/4}=\frac1{16}\cdot\frac43=\boxed{\frac1{12}}.\]
At 0 the displayed infinite list has infimum 0 but no attained minimum; defining the integrand there by its limiting value makes the endpoint well-defined and does not change the integral.`,
  },
  {
    id: 10314,
    source: { ...kingFebruary2026, questionNumber: 19 },
    number: 192,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["Integration by Parts"],
    question: String.raw`Given that \(\displaystyle\int_0^\infty\frac{\sin t}{t}\,dt=\frac\pi2\), evaluate
\[\int_0^\infty\frac{1-\cos(4t)}{t^2}\,dt.\]`,
    choices: [String.raw`\(\frac\pi4\)`, String.raw`\(\frac\pi2\)`, String.raw`\(\pi\)`, String.raw`\(2\pi\)`, "NOTA"],
    answer: "D",
    solution: String.raw`First, use integration by parts with \(u=1-\cos(4t)\), \(dv=t^{-2}\,dt\), so \(du=4\sin(4t)\,dt\) and \(v=-1/t\):
\[\int_0^\infty\frac{1-\cos(4t)}{t^2}\,dt=-\left[\frac{1-\cos(4t)}t\right]_0^\infty+\int_0^\infty\frac{4\sin(4t)}t\,dt.\]
We can convert the second term into the given integral by substituting \(u=4t\):
\[\int_0^\infty\frac{4\sin(4t)}t\,dt=4\int_0^\infty\frac{\sin u}{u/4}\frac{du}4=4\int_0^\infty\frac{\sin u}u\,du=2\pi.\]
What about the first term? We need to evaluate it as \(t\to+\infty\) and as \(t\to0^+\). In the former case, the denominator means the expression approaches 0, because \(|1-\cos(4t)|\le2\). In the latter, we can evaluate it using L'Hopital's:
\[\lim_{t\to0^+}\frac{1-\cos(4t)}t=\lim_{t\to0^+}4\sin(4t)=0.\]
So, we get \(-[0-0]+2\pi=\boxed{2\pi}\). The integrations by parts can first be performed on \([\varepsilon,R]\), then passed to the limits just established.`,
  },
  {
    id: 10315,
    source: { ...kingFebruary2026, questionNumber: 20 },
    number: 193,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["L'Hopital's Rule", "U-Substitution"],
    question: String.raw`What is \(\displaystyle\lim_{x\to1^+}\left((\ln x)^2\cdot\int_x^\infty\frac1{t(\ln t)^3}\,dt\right)\)?`,
    choices: [String.raw`\(\frac13\)`, String.raw`\(\frac12\)`, "2", "3", "NOTA"],
    answer: "B",
    solution: String.raw`We can evaluate this using L'Hopital's by writing it as a fraction whose numerator and denominator both approach \(+\infty\):
\[\lim_{x\to1^+}\frac{\int_x^\infty\frac1{t(\ln t)^3}\,dt}{1/(\ln x)^2}
=\lim_{x\to1^+}\frac{-1/[x(\ln x)^3]}{-2/[x(\ln x)^3]}=\boxed{\frac12}.\]
For a direct check, put \(u=\ln t\), \(du=dt/t\). For every \(x>1\),
\[\int_x^\infty\frac{dt}{t(\ln t)^3}=\int_{\ln x}^\infty u^{-3}\,du=\left[-\frac1{2u^2}\right]_{\ln x}^\infty=\frac1{2(\ln x)^2}.\]
Thus the product is exactly \(1/2\) for every \(x>1\).
The factor \(t\) in the denominator is essential: without it, the improper integral diverges at infinity, so the printed limit would not have the keyed finite value.`,
  },
  {
    id: 10316,
    source: { ...kingFebruary2026, questionNumber: 21 },
    number: 194,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: [],
    question: String.raw`Given that:
\[f(x)=\int_0^\infty\frac{\sin(t)}{t+x}\,dt\]
\[g(x)=\int_0^\infty\frac{\cos(t)}{t+x}\,dt\]
\[h(x)=f(x)\sin(x)-g(x)\cos(x)\]
What is \(h'(\pi)\)? (Note: \(f(\pi)\) and \(g(\pi)\) are well-defined.)`,
    choices: [String.raw`\(-\frac1{2\pi}\)`, String.raw`\(-\frac1\pi\)`, String.raw`\(\frac1{2\pi}\)`, String.raw`\(\frac1\pi\)`, "NOTA"],
    answer: "B",
    solution: String.raw`We could simply try finding expressions for \(f'(x)\) and \(g'(x)\), but this is difficult when there is an \(x\) term in the integral itself. However, rewriting \(h(x)\) by putting the \(\sin x\) and \(\cos x\) factors into the integrals allows us to simplify it considerably:
\[h(x)=f(x)\sin x-g(x)\cos x\]
\[=\sin x\int_0^\infty\frac{\sin t}{t+x}\,dt-\cos x\int_0^\infty\frac{\cos t}{t+x}\,dt\]
\[=\int_0^\infty\frac{\sin x\sin t-\cos x\cos t}{t+x}\,dt=\int_0^\infty\frac{-\cos(x+t)}{x+t}\,dt\]
\[=-\int_x^\infty\frac{\cos u}u\,du.\]
The change of bounds in the final line can be justified by using the substitution \(u=t+x\), noting that \(x\) is a constant with respect to the integral, so \(du=dt\). This means that \(h'(x)=\cos(x)/x\) by the Fundamental Theorem of Calculus, so
\[h'(\pi)=\frac{\cos\pi}\pi=\boxed{-\frac1\pi}.\]
This use of the theorem does not require differentiating under an improper integral: for a fixed \(a>0\), write \(h(x)=h(a)+\int_a^x\cos(u)/u\,du\), whose derivative follows from the ordinary theorem on a finite interval.`,
  },
  {
    id: 10317,
    source: { ...kingFebruary2026, questionNumber: 22 },
    number: 195,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 5,
    methods: ["Trigonometric Substitution"],
    question: String.raw`Given that
\[\int_{-\pi/2}^{\pi/2}\ln|\cos t|\,dt=-\pi\ln2,\]
what is
\[\int_0^4\frac{\ln x}{\sqrt{4x-x^2}}\,dx?\]`,
    choices: [String.raw`\(\frac{\pi\ln2}{16}\)`, String.raw`\(\frac{\pi\ln2}{8}\)`, String.raw`\(\frac{\pi\ln2}{4}\)`, String.raw`\(\frac{\pi\ln2}{2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Let \(x=u+2\), \(dx=du\) so the denominator simplifies. Then, use the trig sub \(u=2\sin\theta\), \(du=2\cos\theta\,d\theta\):
\[\int_0^4\frac{\ln x}{\sqrt{4x-x^2}}\,dx=\int_{-2}^2\frac{\ln(u+2)}{\sqrt{4-u^2}}\,du\]
\[=\int_{-\pi/2}^{\pi/2}\frac{\ln(2\sin\theta+2)}{2\cos\theta}\,2\cos\theta\,d\theta=\int_{-\pi/2}^{\pi/2}\ln(2\sin\theta+2)\,d\theta\]
\[=\int_{-\pi/2}^{\pi/2}\ln2\,d\theta+\int_{-\pi/2}^{\pi/2}\ln(1+\sin\theta)\,d\theta.\]
The first is the integral of a constant, so it's just \(\pi\ln2\). For the second integral, substitute \(\theta'=-\theta\):
\[\int_{-\pi/2}^{\pi/2}\ln(1+\sin\theta)\,d\theta=\int_{\pi/2}^{-\pi/2}\ln(1-\sin\theta')(-d\theta')=\int_{-\pi/2}^{\pi/2}\ln(1-\sin\theta')\,d\theta'.\]
Since this integral has the same bounds as the other one, we can add them together, as long as we rename \(\theta'\) to \(\theta\). We'll let this integral equal \(I\) to keep track of it:
\[I=\int_{-\pi/2}^{\pi/2}\ln(1+\sin\theta)\,d\theta=\int_{-\pi/2}^{\pi/2}\ln(1-\sin\theta)\,d\theta\]
\[2I=\int_{-\pi/2}^{\pi/2}\left[\ln(1+\sin\theta)+\ln(1-\sin\theta)\right]d\theta\]
\[=\int_{-\pi/2}^{\pi/2}\ln(1-\sin^2\theta)\,d\theta=\int_{-\pi/2}^{\pi/2}\ln(\cos^2\theta)\,d\theta=2\int_{-\pi/2}^{\pi/2}\ln|\cos\theta|\,d\theta.\]
Hence, \(I=-\pi\ln2\) based on the given in the problem, so the total integral is \(\pi\ln2-\pi\ln2=\boxed0\), which is NOTA.
The endpoint singularities are integrable: near \(x=0\) the magnitude behaves like \(|\ln x|/\sqrt{x}\), and near \(x=4\) like a constant times \(1/\sqrt{4-x}\). Thus the substitutions and endpoint limits are legitimate.`,
  },
  {
    id: 10318,
    source: { ...kingFebruary2026, questionNumber: 23 },
    number: 196,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 3,
    methods: [],
    question: String.raw`The Airy function, \(f(x)=\operatorname{Ai}(x)\), is a solution to the differential equation \(f''(x)-xf(x)=0\). Given that \(\operatorname{Ai}(1)=\psi\) and \(\operatorname{Ai}'(1)=\phi\), the value of \(\operatorname{Ai}'''(1)+\operatorname{Ai}^{(4)}(1)\) can be written as \(A\psi+B\phi\) for integers \(A,B\). What is \(A+B\)?`,
    choices: ["2", "3", "5", "7", "NOTA"],
    answer: "C",
    solution: String.raw`Take the first and second derivatives of the given differential equation:
\[f''(x)=xf(x)\]
\[f'''(x)=f(x)+xf'(x)\]
\[f^{(4)}(x)=2f'(x)+xf''(x)=2f'(x)+x^2f(x).\]
Using \(f(x)=\operatorname{Ai}(x)\), we get
\[\operatorname{Ai}'''(1)=\operatorname{Ai}(1)+\operatorname{Ai}'(1)=\psi+\phi,\]
and
\[\operatorname{Ai}^{(4)}(1)=2\operatorname{Ai}'(1)+\operatorname{Ai}(1)=2\phi+\psi.\]
Therefore \(\operatorname{Ai}'''(1)+\operatorname{Ai}^{(4)}(1)=2\psi+3\phi\). Comparing coefficients gives \(A=2\), \(B=3\), and the answer is \(\boxed5\).`,
  },
  {
    id: 10319,
    source: { ...kingFebruary2026, questionNumber: 24 },
    number: 197,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 2,
    methods: [],
    question: String.raw`A function \(f(x)\) is sadder than another function \(g(x)\) on an interval \(V\) if both of the following are true:
\(f(x)\) and \(g(x)\) are defined for all \(x\in V\).
There is at least one value \(x_0\in V\) such that \(f(x_0)<g(x_0)\).

One, and only one, of these functions \(f(x)\) is sadder than \(g(x)=\arctan x\) on the interval \(0<x<1\). Which is it?`,
    choices: [String.raw`\(\frac{x}{1-x}\)`, String.raw`\(2x\)`, String.raw`\(2x^2\)`, String.raw`\(\frac{2x}{1+x^2}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`For \(0<x<1\),
\[\frac{x}{1-x}>x>\arctan x\qquad\text{and}\qquad 2x>x>\arctan x.\]
Also, \(2x^2<\arctan x\) for sufficiently small positive \(x\). Finally, let
\[q(x)=\frac{2x}{1+x^2}-\arctan x.\]
Then \(q(0)=0\), \(q(1)=1-\pi/4>0\), and
\[q'(x)=\frac{1-3x^2}{(1+x^2)^2},\]
so \(q\) first increases and then decreases while remaining positive on \((0,1)\).
To justify the assertion about choice C, \(\arctan x/x\to1\) as \(x\to0^+\), whereas \(2x^2/x=2x\to0\). Thus \(2x^2<\arctan x\) at some sufficiently small positive \(x\), which is all that "sadder" requires; it need not hold throughout \((0,1)\). Hence \(2x^2\) is the unique choice that is sadder than \(\arctan x\).`,
  },
  {
    id: 10320,
    source: { ...kingFebruary2026, questionNumber: 25 },
    number: 198,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 5,
    methods: [],
    question: String.raw`A function \(f(x)\) is sadder than another function \(g(x)\) on an interval \(V\) if both of the following are true:
\(f(x)\) and \(g(x)\) are defined for all \(x\in V\).
There is at least one value \(x_0\in V\) such that \(f(x_0)<g(x_0)\).

Assume \(f(x)\) and \(g(x)\) are both continuous and differentiable on \(0\le x\le1\), with \(f(0)=g(0)=0\), \(f(1)=g(1)=1\), and \(f(x)\) sadder than \(g(x)\). Which of the following statements must be true?

I. There exists some real number \(r>1\) such that \(|g(x)|^r\) is sadder than \(f(x)\).

II. There exists some real number \(n>1\) such that \(x^ng(x)\) is sadder than \(f(x)\).`,
    choices: ["Neither I nor II", "Both I and II", "Only I", "Only II", "NOTA"],
    answer: "D",
    solution: String.raw`Only II is true.

I. This is false. A counterexample is shown in the plot. The key is that \(g(x)\) can stay greater than or equal to 1 wherever \(f(x)>0\); then raising \(g(x)\) to a power greater than 1 cannot bring it below \(f(x)\).
[[solution-diagram:mu-320]]
For a separate concrete algebraic counterexample, let
\[f(x)=2x^2-x,\qquad g(x)=5x-4x^2.\]
These functions satisfy all the endpoint conditions and \(f(x)<g(x)\) on \((0,1)\), because \(g(x)-f(x)=6x(1-x)>0\). They also have \(g(x)\ge0\). Where \(f(x)\le0\), we have \(|g(x)|^r\ge0\ge f(x)\). Where \(f(x)>0\), necessarily \(x>1/2\), and \(g(x)-1=(1-x)(4x-1)\ge0\), so \(|g(x)|^r\ge g(x)>f(x)\) for every \(r>1\). At the endpoints both sides are equal. Thus I need not hold.

II. This is true. The key is that \(0<x<1\) in the relevant interval, so multiplying by \(x^n\) for a large enough \(n\), we can make \(g(x)\) as small in magnitude as we want. This does not by itself work if \(f(x)\le0\). Fortunately, since \(f\) is continuous and \(f(1)=1\), the definition of continuity gives an interval \(1-\varepsilon<x<1\) on which \(0<f(x)<2\). Choose any fixed \(x_0\) in this interval. As \(n\to\infty\), \(x_0^ng(x_0)\to0\). Therefore, for sufficiently large \(n>1\),
\[x_0^ng(x_0)<f(x_0),\]
so \(x^ng(x)\) is sadder than \(f(x)\). Also, \(x^ng(x)\) is defined throughout \([0,1]\) for \(n>1\), including its value 0 at \(x=0\). Only II is guaranteed. If \(g(x_0)<0\), it is already below the positive \(f(x_0)\), and any \(n>1\) works at that point.`,
  },
  {
    id: 10321,
    source: { ...kingFebruary2026, questionNumber: 26 },
    number: 199,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["First Derivative Test"],
    question: String.raw`A function \(f(x)\) is sadder than another function \(g(x)\) on an interval \(V\) if both of the following are true:
\(f(x)\) and \(g(x)\) are defined for all \(x\in V\).
There is at least one value \(x_0\in V\) such that \(f(x_0)<g(x_0)\).

Consider \(f(x)=-\ln x\) and \(g(x)=k-x^2\) for a constant \(k\). What is the maximum value of \(k\) such that \(f(x)\) is not sadder than \(g(x)\) on \(0<x<\infty\)?`,
    choices: [String.raw`\(\frac12+\frac{\ln2}{2}\)`, String.raw`\(\frac12+\ln2\)`, String.raw`\(1+\frac{\ln2}{2}\)`, String.raw`\(2+2\ln2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Let
\[\Delta(x)=f(x)-g(x)=x^2-\ln x-k.\]
The function \(f\) is not sadder than \(g\) exactly when \(\Delta(x)\ge0\) for every \(x>0\). As \(x\to0^+\) or \(x\to+\infty\), we have \(\Delta(x)\to\infty\), so we should look somewhere between. Its minimum occurs where
\[\Delta'(x)=2x-\frac1x=0,\qquad x=\frac{\sqrt2}{2}.\]
At this point,
\[\Delta\left(\frac{\sqrt2}{2}\right)=\frac12+\frac12\ln2-k.\]
The critical point is the unique global minimum because \(\Delta''(x)=2+1/x^2>0\) for every \(x>0\). At \(k=1/2+(\ln2)/2\), the minimum is exactly 0, not negative, so \(f\) is still not sadder. Increasing \(k\) makes this minimum negative. Thus the maximum possible \(k\) is
\[\frac12+\frac{\ln2}{2}.\]`,
  },
  {
    id: 10322,
    source: { ...kingFebruary2026, questionNumber: 27 },
    number: 200,
    division: "Mu",
    topic: "Functions",
    difficulty: 3,
    methods: ["Chain Rule"],
    question: String.raw`Let \(f(x)\) be a continuous and differentiable function, defined for \(x>0\).
Given that \(f'(4)=5\), and that
\[f(x)=f\left(\frac x2\right)+f(2x),\]
what is \(f'(1/2)\)?
(Note: there do actually exist continuous and differentiable functions that satisfy these conditions.)`,
    choices: ["−80", "−40", "5", "10", "NOTA"],
    answer: "B",
    solution: String.raw`Differentiate the functional equation:
\[f'(x)=\frac12f'\left(\frac x2\right)+2f'(2x).\]
At \(x=1\) and \(x=2\), respectively,
\[f'(1)=\frac12f'\left(\frac12\right)+2f'(2),\]
\[f'(2)=\frac12f'(1)+2f'(4).\]
Substituting the second equation into the first gives
\[f'(1)=\frac12f'\left(\frac12\right)+f'(1)+4f'(4).\]
Canceling \(f'(1)\) from both sides gives \(\tfrac12f'(1/2)=-4f'(4)=-20\). Multiplying by 2 gives \(f'(1/2)=-8f'(4)=\boxed{-40}\).
It is not necessary to find a function \(f(x)\) that satisfies the given conditions, but it is pretty fun and challenging. A useful starting point is to put \(x=2^t\) and \(F(t)=f(2^t)\), turning the equation into \(F(t)=F(t-1)+F(t+1)\). For example, \(F(t)=C\sin(\pi t/3)\) satisfies this relation, and \(C\) can be scaled to give \(f'(4)=5\).`,
  },
  {
    id: 10323,
    source: { ...kingFebruary2026, questionNumber: 28 },
    number: 201,
    division: "Mu",
    topic: "Polynomials",
    difficulty: 4,
    methods: ["Product Rule"],
    question: String.raw`The Hermite polynomials \(H_n(x)\) for \(n\ge1\) are defined as follows:
\[H_n(x)=(-1)^ne^{x^2}\left(\frac d{dx}\right)^n\left(e^{-x^2}\right).\]
The first two Hermite polynomials are:
\[H_1(x)=(-1)^1e^{x^2}\frac d{dx}(e^{-x^2})=-e^{x^2}(-2xe^{-x^2})=2x\]
\[H_2(x)=(-1)^2e^{x^2}\frac{d^2}{dx^2}(e^{-x^2})=e^{x^2}((-2+4x^2)e^{-x^2})=-2+4x^2.\]
Given that \(H_8(a)=h\) and \(H_8'(a)=0\), what is \(H_9(a)\)?`,
    choices: [String.raw`\(18h\)`, String.raw`\(2ah\)`, String.raw`\((9+8a)h\)`, String.raw`\((9+2a)h\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Take the derivative of the given equation to find \(H_n'(x)\). Note that \(H_n(x)\) is the product of two expressions, the second of which involves an \(n\)th derivative that becomes an \((n+1)\)th derivative:
\[H_n(x)=(-1)^ne^{x^2}\left(\frac d{dx}\right)^n(e^{-x^2})\]
\[H_n'(x)=(-1)^n2xe^{x^2}\left(\frac d{dx}\right)^n(e^{-x^2})+(-1)^ne^{x^2}\left(\frac d{dx}\right)^{n+1}(e^{-x^2})\]
\[=2xH_n(x)-H_{n+1}(x).\]
The minus sign follows because \((-1)^n=-(-1)^{n+1}\). If we let \(n=8\) and substitute \(x=a\), we get
\[H_8'(a)=0=2aH_8(a)-H_9(a),\]
so \(H_9(a)=2aH_8(a)=\boxed{2ah}\).`,
  },
  {
    id: 10324,
    source: { ...kingFebruary2026, questionNumber: 29 },
    number: 202,
    division: "Mu",
    topic: "Polynomials",
    difficulty: 5,
    methods: ["Product Rule"],
    question: String.raw`The Hermite polynomials \(H_n(x)\) for \(n\ge1\) are defined as follows:
\[H_n(x)=(-1)^ne^{x^2}\left(\frac d{dx}\right)^n\left(e^{-x^2}\right).\]
The first two Hermite polynomials are:
\[H_1(x)=(-1)^1e^{x^2}\frac d{dx}(e^{-x^2})=-e^{x^2}(-2xe^{-x^2})=2x\]
\[H_2(x)=(-1)^2e^{x^2}\frac{d^2}{dx^2}(e^{-x^2})=e^{x^2}((-2+4x^2)e^{-x^2})=-2+4x^2.\]
Given that \(H_8(a)=h\) and \(H_8'(a)=0\), what is \(H_9'(a)\)?`,
    choices: [String.raw`\(18h\)`, String.raw`\(2ah\)`, String.raw`\((9+8a)h\)`, String.raw`\((9+2a)h\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The equation \(H_n'(x)=2xH_n(x)-H_{n+1}(x)\), obtained by the product rule from the definition, is helpful, but we need another relation to other terms. The easiest way to do this is to take the \((n+1)\)th derivative in \(H_{n+1}\), break it into an \(n\)th derivative and a first derivative, and then take advantage of the Leibniz product rule. Write \(D=d/dx\):
\[H_{n+1}(x)=(-1)^{n+1}e^{x^2}D^{n+1}(e^{-x^2})=(-1)^{n+1}e^{x^2}D^n(-2xe^{-x^2})\]
\[=(-1)^ne^{x^2}D^n(2xe^{-x^2}).\]
By the Leibniz product rule,
\[D^n(2xe^{-x^2})=\sum_{k=0}^n\binom nk D^k(2x)D^{n-k}(e^{-x^2}).\]
Only \(k=0\) and \(k=1\) are nonzero, because higher derivatives of \(2x\) vanish. Thus
\[D^n(2xe^{-x^2})=2xD^n(e^{-x^2})+2nD^{n-1}(e^{-x^2}),\]
and substituting back gives
\[H_{n+1}(x)=2xH_n(x)-2nH_{n-1}(x).\]
Now substitute this expression for \(H_{n+1}\) into \(H_n'=2xH_n-H_{n+1}\) to get
\[H_n'(x)=2nH_{n-1}(x).\]
With \(n=9\), this means \(H_9'(a)=2(9)H_8(a)=\boxed{18h}\). This identity holds without using the extra condition \(H_8'(a)=0\).`,
  },
  {
    id: 10325,
    source: { ...kingFebruary2026, questionNumber: 30 },
    number: 203,
    division: "Mu",
    topic: "Geometry",
    difficulty: 4,
    methods: ["Tangency", "Double-Angle Identity"],
    question: String.raw`A mirror is shaped like the curve \(y=\sqrt[3]x\) for positive \(x\). A ray of light is emitted from the origin following the line \(y=mx\), in the direction of increasing \(x\). It hits and reflects off the mirror. What is the positive value of \(m\) such that, after reflection, the ray travels parallel to the \(x\)-axis?`,
    choices: [String.raw`\(\sqrt[3]3\)`, String.raw`\(\sqrt3\)`, String.raw`\(\sqrt[3]9\)`, "3", "NOTA"],
    answer: "B",
    solution: String.raw`For a straight mirror, the angle that the light ray is incident on the mirror is the same as the angle it reflects at. For the curved mirror shaped like \(y=f(x)=\sqrt[3]x\), assume it reflects off a straight mirror shaped like the tangent line to \(\sqrt[3]x\) at the point of contact \(P\).
[[solution-diagram:mu-325]]
In the diagram, the blue lines are the light ray, the black curve is the curved mirror, and the dashed black line is the tangent line. The angle of incidence equaling the angle of reflection means \(\theta_1=\theta_2\). The angle between them is \(\pi-2\theta_1\). Notice that, if the ray is horizontal after reflecting, then \(\beta=\pi-(\pi-2\theta_1)=2\theta_1\).
Let \(P=(x_P,\sqrt[3]{x_P})\) be the point of reflection. Because \(P\) also lies on \(y=mx\),
\[mx_P=\sqrt[3]{x_P},\qquad x_P=m^{-3/2}.\]
The tangent slope at \(P\) is
\[f'(x_P)=\frac13x_P^{-2/3}=\frac m3.\]
Let \(\beta=\arctan m\) be the incident ray's angle with the horizontal, and let \(\theta_1=\arctan(m/3)\) be the tangent's angle. The law of reflection and the horizontal reflected ray give \(\beta=2\theta_1\). Thus,
\[\arctan m=2\arctan\left(\frac m3\right).\]
Using the tangent double-angle identity,
\[m=\frac{2m/3}{1-m^2/9}.\]
Since \(m>0\), divide by \(m\) to get \(1-m^2/9=2/3\), hence \(m^2=3\). The positive solution is
\[m=\sqrt3.\]`,
  },
  // March Regional 2026: all 30 retained; no throw-out/dispute annotations in supplied PDFs.
  // Public Mu 204-233, stable IDs 10326-10355, original paper credits 1-30.
  {
    id: 10326, number: 204, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 1 },
    topic: "Limits", difficulty: 1, methods: [],
    question: String.raw`For all real values of \(a\) and \(b\), \(\displaystyle\lim_{x\to+\infty}(ae^{-x}+bx^{-2})\) is equal to which of the following?`,
    choices: ["0", String.raw`\(a\)`, String.raw`\(b\)`, String.raw`\(a+b\)`, "NOTA"],
    answer: "A",
    solution: String.raw`We can rewrite our limit as
\[\lim_{x\to+\infty}(ae^{-x}+bx^{-2})
=\lim_{x\to+\infty}\left(\frac a{e^x}+\frac b{x^2}\right)=0\]
because \(e^x\) and \(x^2\) both tend to \(+\infty\) as \(x\to+\infty\). The denominators will grow without bound while the numerators \(a\) and \(b\) are constant, so each term tends to \(0\), as will their sum. This holds for positive, negative, and zero values of either constant.`,
  },
  {
    id: 10327, number: 205, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 2 },
    topic: "Function Analysis", difficulty: 1, methods: [],
    question: String.raw`The function \(f(x)=x^3-x^2+2\) has a point of inflection at which \(x\)-value?`,
    choices: ["0", String.raw`\(\frac12\)`, String.raw`\(\frac13\)`, String.raw`\(\frac23\)`, "NOTA"],
    answer: "C",
    solution: String.raw`To determine an inflection point for this polynomial, we need to first locate all points where the second derivative of \(f\) is zero. Since \(f(x)=x^3-x^2+2\), then
\[f'(x)=3x^2-2x,\qquad f''(x)=6x-2.\]
Solving \(f''(x)=0\) gives \(x=1/3\), where we can then show that \(f''\) changes from negative to positive around \(x=1/3\): it is negative when \(x<1/3\) and positive when \(x>1/3\). This means concavity changes around \(x=1/3\) and so \(x=1/3\) is a guaranteed place for an inflection point. A zero second derivative alone would not suffice without this sign change.`,
  },
  {
    id: 10328, number: 206, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 3 },
    topic: "Definite Integrals", difficulty: 1, methods: ["Integral Properties"],
    question: String.raw`If \(f\) is differentiable and \(\int_1^3f(x)\,dx=5\) and \(\int_4^7f(x)\,dx=13\), then \(\int_1^7f(x)\,dx\) is necessarily equal to which of the following?`,
    choices: [String.raw`\(8+\int_3^4f(x)\,dx\)`, String.raw`\(8-\int_3^4f(x)\,dx\)`, String.raw`\(18+\int_3^4f(x)\,dx\)`, String.raw`\(18-\int_3^4f(x)\,dx\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Since \(f\) is differentiable, it must also be continuous. This means we can safely apply the additivity property of integrals for \(f\) on the given interval and then substitute the given values:
\[\int_1^7f(x)\,dx=\int_1^3f(x)\,dx+\int_3^4f(x)\,dx+\int_4^7f(x)\,dx\]
\[=5+\int_3^4f(x)\,dx+13=18+\int_3^4f(x)\,dx,\]
which gives the desired result. The middle interval \([3,4]\) is not supplied, so its integral must remain in the answer.`,
  },
  {
    id: 10329, number: 207, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 4 },
    topic: "Derivatives", difficulty: 1, methods: [],
    question: String.raw`If \(f(x)=\sin(x)\), what is the value of \(f^{(1738)}\!\left(\frac\pi2\right)\)?`,
    choices: ["-1", "0", "1", String.raw`\(\frac\pi2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The derivative of \(\sin(x)\) repeats every four iterations (try it!)
\[\sin x\longmapsto\cos x\longmapsto-\sin x\longmapsto-\cos x\longmapsto\sin x.\]
Given we want the 1738th derivative, we can observe that 1700 is a multiple of 4, as is 36, so 1736 is a multiple of 4. This means that the 1736th derivative of \(\sin(x)\) is still \(\sin(x)\). Taking two more derivatives gives us that the 1737th derivative is \(\cos(x)\) and the 1738th derivative is \(-\sin(x)\). Plugging in \(x=\pi/2\) into \(-\sin(x)\) gives us \(-\sin(\pi/2)=-1\) as our answer. The notation \(f^{(1738)}\) denotes a derivative, not a power.`,
  },
  {
    id: 10330, number: 208, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 5 },
    topic: "Implicit Differentiation", difficulty: 2, methods: ["Implicit Differentiation"],
    question: String.raw`What is the slope of the tangent line on the curve \(x^2y-y^3+1=x\) at the point \((x,y)=(1,1)\)?`,
    choices: ["1", String.raw`\(\frac12\)`, String.raw`\(\frac13\)`, String.raw`\(\frac14\)`, "NOTA"],
    answer: "B",
    solution: String.raw`We can get the slope of the tangent line via plugging in the point \((1,1)\) into \(\frac{dy}{dx}=y'\). In order to get the derivative here, we need to use implicit differentiation, which is done by taking the derivative of the left and right-hand sides separately.
\[\frac d{dx}[x^2y-y^3+1]=\frac d{dx}[x]\]
\[2xy+x^2y'-3y^2y'+0=1\]
\[y'(x^2-3y^2)=1-2xy,\qquad y'=\frac{1-2xy}{x^2-3y^2}.\]
Plugging in our point \((1,1)\) gives
\[y'=\frac{1-2(1)(1)}{1-3(1)^2}=\frac{-1}{-2}=\frac12.\]
Note: You should ALWAYS check that the point given is actually on the curve! Some test writers will purposefully have it not be on the curve, to which you would put choice E. Here \(1^2(1)-1^3+1=1\), so the point does lie on the curve. The denominator is nonzero there, so this is a finite tangent slope.`,
  },
  {
    id: 10331, number: 209, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 6 },
    topic: "Differential Equations", difficulty: 1, methods: [],
    question: String.raw`Which of the following curves satisfies the differential equation \(y''=6x\) for all values of \(x\)?`,
    choices: [String.raw`\(y=x^3+6x\)`, String.raw`\(y=2x^3-2\)`, String.raw`\(y=3x^2+5\)`, String.raw`\(y=6x^2+1\)`, "NOTA"],
    answer: "A",
    solution: String.raw`We can take the second derivative of the answer choices and see which one produces \(y''=6x\).

Choice A gives \(y'=3x^2+6\), so \(y''=6x\). This choice is correct.

Choice B gives \(y'=6x^2\), so \(y''=12x\).

Choice C gives \(y'=6x\), so \(y''=6\).

Choice D gives \(y'=12x\), so \(y''=12\).

The requirement is equality for all \(x\), not merely at a particular input. Equivalently, integrating twice gives the full family \(y=x^3+C_1x+C_2\); only A has this form.`,
  },
  {
    id: 10332, number: 210, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 7 },
    topic: "Optimization", difficulty: 2, methods: ["First Derivative Test", "Trigonometric Identities"],
    question: String.raw`What is the maximum value of the function \(r\) if \(r'(x)=\cos(x)+\sin(x)\) and \(r(0)=0\)?`,
    choices: [String.raw`\(\sqrt2\)`, String.raw`\(\sqrt2+1\)`, String.raw`\(\frac{1+\sqrt3}{2}\)`, String.raw`\(\frac{3+\sqrt3}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`To get the maximum value of \(r\), we need to first find \(r(x)\). Integrating \(r'(x)=\cos(x)+\sin(x)\) gives
\[\int r'(x)\,dx=\int(\cos(x)+\sin(x))\,dx\]
\[r(x)+C_1=\sin(x)-\cos(x)+C_2.\]
At this point, we usually consolidate the constants of integration into just one. This does not lose generality. Let's make \(C=C_2-C_1\).
\[r(x)=\sin(x)-\cos(x)+C.\]
Plugging in the initial condition \(r(0)=0\) gives \(0=\sin(0)-\cos(0)+C=-1+C\), so \(C=1\). Thus, \(r(x)=\sin(x)-\cos(x)+1\). We can determine potential extrema by setting the given derivative equal to \(0\). \(\cos(x)+\sin(x)=0\) gives \(x=3\pi/4\) and \(x=7\pi/4\) in \(0\le x<2\pi\) (other solutions give redundant \(r\) values). Plugging these in gives
\[r(3\pi/4)=\sqrt2+1,\qquad r(7\pi/4)=-\sqrt2+1,\]
the former of which is our maximum.

To verify that this is a global maximum over all real \(x\), write \(r(x)=1+\sqrt2\sin(x-\pi/4)\). Sine is at most \(1\), and it attains \(1\), so the largest possible value is \(1+\sqrt2\).`,
  },
  {
    id: 10333, number: 211, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 8 },
    topic: "Fundamental Theorem of Calculus", difficulty: 1, methods: ["Integral Properties"],
    question: String.raw`If there exists a continuous function \(f\) such that \(\int_k^x f(t)\,dt=x^3+64\) for all \(x\), then constant \(k\) must be equal to which of the following?`,
    choices: [String.raw`\(-\frac{8\sqrt3}{3}\)`, "-4", "4", String.raw`\(\frac{8\sqrt3}{3}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Applying the 2nd Fundamental Theorem of Calculus, taking the derivative of both sides yields
\[\frac d{dx}\left[\int_k^x f(t)\,dt\right]=\frac d{dx}[x^3+64],\qquad f(x)=3x^2.\]
Substituting \(f(x)=3x^2\) (or \(f(t)=3t^2\)) into the original equation yields
\[\int_k^x3t^2\,dt=x^3+64,\qquad [t^3]_{t=k}^{t=x}=x^3+64\]
\[x^3-k^3=x^3+64,\]
where \(-k^3=64\) tells us \(k=-4\).

A shorter check uses equal integration limits: substituting \(x=k\) into the given identity immediately gives \(0=k^3+64\). The continuous function \(f(t)=3t^2\) verifies that this value really works for every \(x\).`,
  },
  {
    id: 10334, number: 212, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 9 },
    topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`Let \(m\) and \(s\) denote unit measurements of meters and seconds, respectively. If twice-differentiable functions \(f(t)\) and \(g(t)\) with input \(t\ge0\) in seconds are measured in the units \(\frac ms\) and \(\frac m{s^2}\) respectively, what are the units measured from the function \(h(t)=\frac d{dt}[(f(t))^2g(t)]\) for \(t>0\)?`,
    choices: [String.raw`\(\frac{m^2}{s^3}\)`, String.raw`\(\frac{m^2}{s^5}\)`, String.raw`\(\frac{m^3}{s^3}\)`, String.raw`\(\frac{m^3}{s^5}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The units of \((f(t))^2\) will be the squared units of \(f(t)\). Since \(f(t)\) was measured in \(\frac ms\), \((f(t))^2\) will be measured in \(\frac{m^2}{s^2}\). Then, the units of a product of functions will involve the product of the functions' units. So the units of \((f(t))^2g(t)\) will be
\[\frac{m^2}{s^2}\cdot\frac m{s^2}=\frac{m^3}{s^4}.\]
Taking the derivative with respect to time (in this case, seconds) divides the units by one additional second, so our final units are measured in \(\frac{m^3}{s^5}\).

The product rule gives the same check: both terms in \(h(t)=2ff'g+f^2g'\) have these units. Squaring \(f\) squares its units; differentiation instead adds a factor of \(1/s\).`,
  },
  {
    id: 10335, number: 213, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 10 },
    topic: "Derivatives", difficulty: 2, methods: [],
    question: String.raw`In the \(xy\)-plane, the line normal to the curve \(y=\cos(x)\) at \(x=\frac\pi3\) has an \(x\)-intercept of which of the following points?`,
    choices: [String.raw`\(\left(\frac\pi3-\frac14,0\right)\)`, String.raw`\(\left(\frac\pi3-\frac{\sqrt3}{4},0\right)\)`, String.raw`\(\left(\frac\pi3+\frac14,0\right)\)`, String.raw`\(\left(\frac\pi3+\frac{\sqrt3}{4},0\right)\)`, "NOTA"],
    answer: "B",
    solution: String.raw`We first need the point where this normal line is intersecting the curve \(y=\cos(x)\); plugging in \(x=\pi/3\) gives \(1/2\). So we'll plug \((x_1,y_1)=(\pi/3,1/2)\) into our point-slope form \(y-y_1=m(x-x_1)\). To get \(m\), we'll need the perpendicular slope to \(y=\cos(x)\) at this point (as the line is normal, not tangent).
\[y'=-\sin(x),\qquad y'(\pi/3)=-\frac{\sqrt3}{2}=-\frac1m
\quad\Longrightarrow\quad m=\frac2{\sqrt3}.\]
Substituting everything in gives \(y-\frac12=\frac2{\sqrt3}(x-\frac\pi3)\). Since we want the \(x\)-intercept of this line, we set \(y=0\) and solve:
\[-\frac12=\frac2{\sqrt3}\left(x-\frac\pi3\right)
\quad\Longrightarrow\quad x=\frac\pi3-\frac{\sqrt3}{4}.\]
The requested point is \((\pi/3-\sqrt3/4,0)\), not just its \(x\)-coordinate.`,
  },
  {
    id: 10336, number: 214, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 11 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule"],
    illustration: marchRegional2026Table,
    question: String.raw`Please Follow Meepfrog The Leapfrog's Information to Answer Questions 11 to 13:
Select values of a function \(p(x)\) and its first and second derivatives are provided in the table below.

What is the value of \(\frac d{dx}[p(p'(x))]\) at \(x=1\)?`,
    choices: ["1", "2", "3", "4", "NOTA"],
    answer: "A",
    solution: String.raw`Applying the chain rule gives
\[\frac d{dx}[p(p'(x))]=p'(p'(x))\cdot p''(x)\]
and evaluating this at \(x=1\) gives \(p'(p'(1))\cdot p''(1)=1\).

Read the table in the order required by the composition: first \(p'(1)=1\); then the outer derivative is \(p'(p'(1))=p'(1)=1\); finally \(p''(1)=1\). The product is \(1\cdot1=1\). The value \(p(1)=2\) is not used, because the inner function is \(p'\), not \(p\).`,
  },
  {
    id: 10337, number: 215, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 12 },
    topic: "Continuity", difficulty: 4, methods: [],
    illustration: marchRegional2026Table,
    question: String.raw`Please Follow Meepfrog The Leapfrog's Information to Answer Questions 11 to 13:
Select values of a function \(p(x)\) and its first and second derivatives are provided in the table below.

If \(p\) is also continuous everywhere, which of the following statements must be true?

I: There exists some value \(v_1\) such that \(p(v_1)=0\).

II: There exists some value \(v_2\) such that \(p'(v_2)=0\).

III: There exists some value \(v_3\) such that \(p''(v_3)=0\).`,
    choices: ["II only", "III only", "I, II only", "II, III only", "NOTA"],
    answer: "E",
    solution: String.raw`None of the statements are necessarily true!

For item I, even though \(p\) is given to be a continuous function, the table values only show cases where \(p>0\). We would need at least one additional case where \(p<0\) for some value of \(x\) to apply the Intermediate Value Theorem to argue there is some \(v_1\) such that \(p(v_1)=0\). The values in the table do not force such a sign change.

For item II, \(p\) need not be differentiable between the tabulated points. It can reverse direction at a corner where the derivative does not exist instead of passing through a horizontal tangent. Continuity of \(p\) does not rule out such corners. The table gives derivatives at \(1,2,3\), not differentiability at every real number. If \(p\) were differentiable everywhere, the decrease from \(p(1)=2\) to \(p(2)=1\), together with its positive tabulated derivatives, would force a zero of \(p'\) by the Mean Value Theorem and the intermediate-value property of derivatives.

For item III, we can employ the same logic as item II about what might happen if \(p\) is not twice differentiable. Its concavity can switch at points where the relevant derivative does not exist. Opposite signs of \(p''(1)\) and \(p''(2)\) alone do not give an intermediate value theorem for a second derivative that is not defined throughout the interval.

A concrete simultaneous counterexample can be built as follows. Put \(\varepsilon=1/100\) and use these quadratics on \([j-\varepsilon,j+\varepsilon]\):
\[P_1(x)=2+(x-1)+\tfrac12(x-1)^2,\]
\[P_2(x)=1+4(x-2)-\tfrac12(x-2)^2,\qquad
P_3(x)=4+3(x-3)+(x-3)^2.\]
They give exactly the three rows of the table. All are positive and have nonzero first and second derivatives on their small intervals. In each intervening gap \([L,R]\), join the endpoint values \(u\) and \(v\) with
\[H(x)=u+(v-u)\frac{e^{(x-L)/(R-L)}-1}{e-1}.\]
Here \(u\ne v\), so both \(H'\) and \(H''\) are nonzero. The first gap decreases and the second increases, and these arcs remain between their positive endpoint values. Their slopes do not match the adjacent quadratic slopes, so the joins are corners rather than stationary points. Extend the two outer ends by positive multiples of \(e^x\), matching their endpoint values. These also create corners and have nonzero first and second derivatives.

The resulting function is continuous and positive everywhere, satisfies the entire table, and has no zero of \(p'\) or \(p''\) wherever those derivatives exist. Thus none of I, II, or III is guaranteed, so select NOTA.`,
  },
  {
    id: 10338, number: 216, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 13 },
    topic: "Definite Integrals", difficulty: 4, methods: ["Product Rule"],
    illustration: marchRegional2026Table,
    question: String.raw`Please Follow Meepfrog The Leapfrog's Information to Answer Questions 11 to 13:
Select values of a function \(p(x)\) and its first and second derivatives are provided in the table below.

If \(p\) is now also twice-differentiable on \((1,2)\) and \(\int_1^2\frac{(p'(x))^2+xp'(x)p''(x)+1}{\sqrt{1+(p'(x))^2}}\,dx\) converges, what is the value of \(\int_1^2\frac{(p'(x))^2+xp'(x)p''(x)+1}{\sqrt{1+(p'(x))^2}}\,dx\)?`,
    choices: [String.raw`\(2\sqrt5-\sqrt2\)`, String.raw`\(4\sqrt5-\sqrt2\)`, String.raw`\(2\sqrt{17}-\sqrt2\)`, String.raw`\(4\sqrt{17}-\sqrt2\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The "main" way we can simplify this integral is by regrouping the terms and recognizing the integrand is the result of a product rule:
\[\int_1^2\frac{(p'(x))^2+xp'(x)p''(x)+1}{\sqrt{1+(p'(x))^2}}\,dx\]
\[=\int_1^2\left(\sqrt{1+(p'(x))^2}
+\frac{xp'(x)p''(x)}{\sqrt{1+(p'(x))^2}}\right)\,dx\]
\[=\int_1^2\frac d{dx}\left[x\sqrt{1+(p'(x))^2}\right]\,dx
=\left[x\sqrt{1+(p'(x))^2}\right]_1^2\]
\[=2\sqrt{1+(p'(2))^2}-\sqrt{1+(p'(1))^2}
=2\sqrt{17}-\sqrt2.\]
In the last line the table supplies \(p'(2)=4\) and \(p'(1)=1\). The denominator never vanishes, since \(1+(p')^2\ge1\).

Our entirely unnecessary way (and not as easy) way of spotting and approaching this question would be to recognize the \(\sqrt{1+(p'(x))^2}\) part as something related to the arc length formula of \(p(x)\) on \([1,2]\). Indeed, I made this integral by integrating by parts backwards and combining terms! This is not, however, meant to be an AP Calculus BC-only question.

For that alternative, write the integrand as \(u+xu'\) with \(u=\sqrt{1+(p')^2}\). Integration by parts gives \(\int xu'\,dx=xu-\int u\,dx\), so the two integrals of \(u\) cancel.

The convergence condition also handles possible improper behavior at the endpoints. Integrate on interior closed subintervals first. Convergence then gives finite one-sided limits of \(x\sqrt{1+(p')^2}\), hence of \(|p'|\). The derivative's intermediate-value property prevents endless sign changes when this magnitude tends to a positive number; if it tends to zero the derivative itself tends to zero. Thus \(p'\) has a finite limit at each endpoint. By the Mean Value Theorem and the tabulated endpoint differentiability, these limits equal \(p'(1)\) and \(p'(2)\). This justifies the endpoint evaluation even without separately assuming \(p'\) is continuous there.`,
  },
  {
    id: 10339, number: 217, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 14 },
    topic: "Limits", difficulty: 3, methods: ["Limit Definition of Derivatives", "Logarithmic Differentiation"],
    question: String.raw`Which of the following is equal to \(\displaystyle\lim_{h\to0}\frac{(e+h)^{\ln(e+h)}-e}{h}\)?`,
    choices: ["0", "1", String.raw`\(e\)`, String.raw`\(e^2\)`, "NOTA"],
    answer: "E",
    solution: String.raw`We can also use L'Hopital's rule for this and reach the same answer, but I will use logarithmic differentiation. This is the limit definition for the derivative of \(f(x)=x^{\ln(x)}\) at \(x=e\) since \(f(e)=e\) (and that's why we're subtracting \(e\) in the numerator as well). Sure enough, we have all the pieces of
\[\lim_{h\to0}\frac{f(x+h)-f(x)}h\]
at \(x=e\). We need \(f'(e)\).

To accomplish this, we can take the natural logarithm of both sides to make taking the derivative easier:
\[f(x)=x^{\ln(x)},\qquad \ln(f(x))=(\ln x)^2,\]
\[\frac{f'(x)}{f(x)}=\frac{2\ln x}{x},\qquad
f'(x)=x^{\ln x}\frac{2\ln x}{x}.\]
Plugging in \(x=e\) yields
\[f'(e)=e^{\ln e}\frac{2\ln e}{e}=e\frac2e=2.\]
That's not an answer among A-D, so select NOTA. The logarithm is valid in a neighborhood of \(e>0\), where both \(x\) and \(f(x)\) are positive.`,
  },
  {
    id: 10340, number: 218, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 15 },
    topic: "Number Theory", difficulty: 3, methods: ["Infinite Geometric Series"],
    question: String.raw`Let \(0.\overline{ab}\) represent the decimal with infinite repeating digit sequence \(ab\). That is, we can write \(0.\overline{ab}=0.ababab\ldots\) forever. If \(0.\overline{ab}\) for digits \(0\le a,b\le9\) can be written as the fraction \(\frac pq\) for positive and relatively prime integers \(p\) and \(q\), which of the following values can be achieved by \(p+q\)?`,
    choices: ["105", "110", "115", "120", "NOTA"],
    answer: "C",
    solution: String.raw`We can think about \(0.\overline{ab}=0.ababab\ldots\) as being the infinite sum
\[\frac{10a+b}{100}+\frac{10a+b}{100^2}+\cdots\]
forever. This is a geometric series with initial term \((10a+b)/100\) and common ratio \(1/100\). Applying these to the sum of a geometric series gives
\[S=\frac{(10a+b)/100}{1-1/100}=\frac{10a+b}{99}=\frac pq.\]
The denominator before reduction is \(99\); it is not always the reduced denominator. Put \(N=10a+b\) and \(d=\gcd(N,99)\). Then \(p=N/d\) and \(q=99/d\). If \(d>1\), then \(d\ge3\) and
\[p+q=\frac{N+99}{d}\le\frac{198}{3}=66.\]
All four proposed values exceed \(66\), so any successful choice must have \(d=1\), hence \(q=99\). Since \(p\) is relatively prime to \(q\), we can see which of the answer choices, if any, gives a value of \(p\) relatively prime to \(q\).

\(p+q=105\) implies \(p=6\), but \(6\) and \(99\) are not relatively prime.

\(p+q=110\) implies \(p=11\), but \(11\) and \(99\) are not relatively prime.

\(p+q=115\) implies \(p=16\), and \(16\) and \(99\) are relatively prime! Yay!

\(p+q=120\) implies \(p=21\), but \(21\) and \(99\) are not relatively prime.

The digits \(a=1,b=6\) realize \(16/99\), so \(115\) is actually achieved. The all-zero decimal is ruled out by the requirement \(p>0\).`,
  },
  {
    id: 10341, number: 219, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 16 },
    topic: "Riemann Sums", difficulty: 1, methods: ["Riemann Sums"],
    question: String.raw`Approximate \(\int_0^2(3x^2+2x)\,dx\) as a right Riemann sum with four equally-sized subintervals.`,
    choices: [String.raw`\(\frac{33}{4}\)`, String.raw`\(\frac{63}{4}\)`, String.raw`\(\frac{65}{4}\)`, String.raw`\(\frac{33}{2}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Since we have four subintervals of equal length, and the length of the interval \([0,2]\) is \(2-0=2\), then the length of each interval is \(\Delta x=2/4=1/2\). A right Riemann sum will use the right endpoints of the intervals \([0,1/2],[1/2,1],[1,3/2],[3/2,2]\). Altogether, we let \(f(x)=3x^2+2x\) and get that
\[\int_0^2(3x^2+2x)\,dx\approx\Delta x(f(0.5)+f(1)+f(1.5)+f(2))\]
\[=\tfrac12\left(3(0.5^2+1^2+1.5^2+2^2)+2(0.5+1+1.5+2)\right)\]
\[=\tfrac12(3(7.5)+2(5))=\frac{65}{4}\]
as our estimated area. The factor \(\Delta x=1/2\) is the width of each rectangle and must multiply the entire sum. This is an approximation, not the exact integral, which is \(12\).`,
  },
  {
    id: 10342, number: 220, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 17 },
    topic: "Limits", difficulty: 3, methods: ["L'Hopital's Rule"],
    question: String.raw`\[\lim_{x\to+\infty}\left[x\cdot\arctan\left(\frac ax\right)-x\cdot\operatorname{arccot}\left(\frac bx\right)+x\cdot\frac\pi2\right]\]
for all \(a>b>0\) is correctly evaluated as which of the following?`,
    choices: ["0", "1", String.raw`\(a-b\)`, String.raw`\(a+b\)`, "NOTA"],
    answer: "D",
    solution: String.raw`We can first rewrite the limit as
\[\lim_{x\to+\infty}
\frac{\arctan(a/x)-\operatorname{arccot}(b/x)+\pi/2}{1/x}.\]
We can apply the substitution \(u=1/x\) (where \(x\to+\infty\) means \(u\to0^+\)) to get the limit to be equivalent to
\[\lim_{u\to0^+}\frac{\arctan(au)-\operatorname{arccot}(bu)+\pi/2}{u}.\]
Applying the limit to the numerator and denominator here separately yields \(0\) for both, which allows us to apply L'Hopital's rule:
\[\lim_{u\to0^+}\left[\frac a{1+a^2u^2}-\frac{-b}{1+b^2u^2}\right]
=a+b.\]
We use the standard real branch \(\operatorname{arccot}z\in(0,\pi)\), so its derivative is \(-1/(1+z^2)\) and its value at \(0\) is \(\pi/2\).

Alternatively, for positive \(x\), \(\operatorname{arccot}(b/x)=\pi/2-\arctan(b/x)\). The original expression becomes \(x\arctan(a/x)+x\arctan(b/x)\), and \(\arctan t/t\to1\) immediately gives \(a+b\).`,
  },
  {
    id: 10343, number: 221, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 18 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`Let \(g(x)=e^x\). If \(h(x)=g(g(g(x)))\), then which of the following is the value of \(h'(1)\)?`,
    choices: [String.raw`\(e^{e^e}\)`, String.raw`\(e^{(e^e+1)}\)`, String.raw`\(e^{(e^e+e)}\)`, String.raw`\(e^{(e^e+e+1)}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`This derivative will involve repeated instances of the chain rule, where we first note that the derivative of \(g(x)=e^x=\exp(x)\) is itself. Applying \(g(x)=g'(x)\), we get the following work:
\[\frac d{dx}[g(g(g(x)))]=g'(g(g(x)))\frac d{dx}[g(g(x))]\]
\[=g'(g(g(x)))g'(g(x))g'(x)
=g(g(g(x)))g(g(x))g(x)\]
\[=e^{e^{e^x}}e^{e^x}e^x.\]
Now set \(x=1\), obtaining
\[h'(1)=e^{e^e}e^ee=e^{(e^e+e+1)},\]
using the identity \(e^a\cdot e^b=e^{a+b}\). Evaluation at \(x=1\) happens after differentiation; the three chain-rule factors must all be included.`,
  },
  {
    id: 10344, number: 222, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 19 },
    topic: "Fundamental Theorem of Calculus", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`What is \(f'(1)\) if \(f(x)=\int_{x^2}^x(\cos(t)+\sin(t))\,dt\)?`,
    choices: [String.raw`\(3\cos(1)+\sin(1)\)`, String.raw`\( \cos(1)+3\sin(1)\)`, String.raw`\( \cos(1)+\sin(1)\)`, String.raw`\(3\cos(1)+3\sin(1)\)`, "NOTA"],
    answer: "E",
    solution: String.raw`By the first fundamental theorem of calculus,
\[f'(x)=[\cos(x)+\sin(x)]-[\cos(x^2)+\sin(x^2)][2x],\]
and plugging in \(x=1\) gives \(-\cos(1)-\sin(1)\).

For an integral \(\int_{a(x)}^{b(x)}F(t)\,dt\), the derivative is \(F(b(x))b'(x)-F(a(x))a'(x)\). Here \(b(x)=x\), so \(b'(x)=1\), while \(a(x)=x^2\), so \(a'(x)=2x\). At \(1\) the two integrand values coincide, but their endpoint speeds are \(1\) and \(2\), so their contributions do not cancel. Since both \(\cos1\) and \(\sin1\) are positive, the result is negative, unlike A-D. Select NOTA.`,
  },
  {
    id: 10345, number: 223, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 20 },
    topic: "Definite Integrals", difficulty: 4, methods: ["Inverse Functions"],
    question: String.raw`Let
\[J=\int_0^1\left(\sqrt[7]{1-x^9}-\sqrt[9]{1-x^7}\right)\,dx.\]
Evaluate \(63J\).`,
    choices: ["0", "1", "2", "3", "NOTA"],
    answer: "A",
    solution: String.raw`The most important insight we can make here is that the "parts" of the integrand are inverse functions: if \(f(x)=\sqrt[7]{1-x^9}\) then \(f^{-1}(x)=\sqrt[9]{1-x^7}\). Then, we can notice \(f(0)=f^{-1}(0)=1\) and \(f(1)=f^{-1}(1)=0\). There is an identity to relate the integral of a function with its inverse, with the motivation as the below picture.
[[solution-diagram:mu-345]]
The picture illustrates the general identity with an increasing function; our particular \(f\) is decreasing, so its inverse integral has reversed limits.

In general,
\[\int_a^b f(x)\,dx+\int_{f(a)}^{f(b)}f^{-1}(x)\,dx=bf(b)-af(a).\]
In our example, \(a=0,b=1,f(a)=1\), and \(f(b)=0\). This leads to
\[\int_0^1\sqrt[7]{1-x^9}\,dx+\int_1^0\sqrt[9]{1-x^7}\,dx
=1(0)-0(1)=0.\]
Reversing the second integral gives exactly \(J\). If \(J=0\), then \(63J=0\) all the same.

To verify the inverse relation, \(y=(1-x^9)^{1/7}\) implies \(x^9=1-y^7\), hence \(x=(1-y^7)^{1/9}\) on \([0,1]\). To justify the identity, substitute \(y=f(x)\) in the inverse integral and use integration by parts:
\[\int_{f(a)}^{f(b)}f^{-1}(y)\,dy
=\int_a^b x f'(x)\,dx=[xf(x)]_a^b-\int_a^bf(x)\,dx.\]
The same equality holds here by taking endpoint limits; \(f\) is continuous and bounded on the closed interval and the transformed integrals converge.`,
  },
  {
    id: 10346, number: 224, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 21 },
    topic: "Implicit Differentiation", difficulty: 2, methods: ["Implicit Differentiation"],
    question: String.raw`Which of the following is equal to \(\frac{d^2y}{dx^2}\) for all positive \(x\) and \(y\) such that \(x^2+y^2=1\)?`,
    choices: [String.raw`\(-\frac1{y^3}\)`, String.raw`\(\frac{x^2-y^2}{y^3}\)`, String.raw`\(\frac{y^2-x^2}{y^3}\)`, String.raw`\(\frac{-y^2+x^2+1}{y^3}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`We can apply implicit differentiation to the given equation to first calculate \(y'=\frac{dy}{dx}\):
\[\frac d{dx}[x^2+y^2]=\frac d{dx}[1],\qquad 2x+2yy'=0,\]
\[x+yy'=0,\qquad y'=-\frac xy.\]
To finish the question, we can now take the derivative of both sides once more to calculate \(y''=\frac{d^2y}{dx^2}\):
\[y''=\frac{(-1)y-(-x)y'}{y^2}
=\frac{-y+x(-x/y)}{y^2}
=\frac{-y^2-x^2}{y^3}
=-\frac{x^2+y^2}{y^3}=-\frac1{y^3}.\]
We substituted \(y'=-x/y\) before simplifying and used the original equation \(x^2+y^2=1\) only at the end. The condition \(y>0\) ensures that each division by \(y\) is valid.`,
  },
  {
    id: 10347, number: 225, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 22 },
    topic: "Indefinite Integrals", difficulty: 2, methods: ["Trigonometric Identities"],
    question: String.raw`Meepfrog claims that \(-\cos^2(x)+C_1\) and \(\sin^2(x)+C_2\) are both antiderivatives of \(2\sin(x)\cos(x)\) for some real integration constants \(C_1\) and \(C_2\). Is Meepfrog correct, and, if so, how do \(C_1\) and \(C_2\) relate?`,
    choices: [
      "Meepfrog is incorrect.",
      String.raw`Meepfrog is correct, but \(C_1-C_2\) cannot equal \(1\).`,
      String.raw`Meepfrog is correct, and we could have \(C_1-C_2=1\).`,
      String.raw`Meepfrog is correct, and we absolutely must have \(C_1-C_2=1\).`,
      "NOTA",
    ],
    answer: "C",
    solution: String.raw`Note that the derivative of each of our proposed antiderivatives is indeed \(2\sin(x)\cos(x)\) (by the chain rule), so Meepfrog is correct:
\[\frac d{dx}[-\cos^2x+C_1]=2\sin x\cos x,\qquad
\frac d{dx}[\sin^2x+C_2]=2\sin x\cos x.\]
If two functions are antiderivatives of another function on an interval, then the antiderivatives must differ by only a constant. Here their difference is
\[(-\cos^2x+C_1)-(\sin^2x+C_2)
=C_1-C_2-(\cos^2x+\sin^2x)=C_1-C_2-1.\]
Any two real integration constants give valid antiderivatives. They need not represent the same antiderivative. If we choose to set the two expressions equal, we get
\[-\cos^2x+C_1=\sin^2x+C_2
\quad\Longleftrightarrow\quad 1=C_1-C_2.\]
Thus we could have \(C_1-C_2=1\), as C states, but this is not absolutely required, so D is false. For example \(C_1=1,C_2=0\) makes the two expressions identical, whereas \(C_1=C_2=0\) gives distinct antiderivatives that differ by \(-1\).

The original B said we cannot say "anything at all" about the relationship, which overlaps the freedom of the constants described above. B has been clarified to an explicitly false impossibility claim, keeping the intended answer C unique.`,
  },
  {
    id: 10348, number: 226, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 23 },
    topic: "Optimization", difficulty: 3, methods: ["First Derivative Test"],
    illustration: {
      src: "/questions/mu-348-original.svg",
      alt: "Meepfrog is 40 feet offshore. The seagull is on the shore 80 feet west of the point directly below Meepfrog.",
      width: 690, height: 359,
    },
    question: String.raw`At the beach, Meepfrog is 40 feet North from shore and 80 feet East from the closest part of the shore to Meepfrog from a relaxed seagull with Meepfrog's wallet (see diagram below). Meepfrog intends to swim in a straight line to shore, then run the remaining shoreline distance to the seagull. If Meepfrog runs exactly twice as fast as they swim constantly, what is the optimal swimming distance to reach the seagull the fastest?`,
    choices: [String.raw`\(\frac{50\sqrt3}{3}\) feet`, String.raw`\(20\sqrt3\) feet`, String.raw`\(\frac{80\sqrt3}{3}\) feet`, String.raw`\(30\sqrt3\) feet`, "NOTA"],
    answer: "C",
    solution: String.raw`We can define Meepfrog's journey to the seagull as swimming in a straight line (at some angle) to the shore, and then immediately moving West to the seagull. Suppose Meepfrog travels \(x\) feet in the water. Then, the horizontal component of that \(x\) feet is \(\sqrt{x^2-1600}\), applying the Pythagorean Theorem (draw a right triangle!). Then, the remaining shore running distance would be \(80-\sqrt{x^2-1600}\) feet.

We don't know the exact speeds here, but we'll see that won't be necessary. Let's call the swimming speed \(s\) and the running speed \(2s\). Then "time equals distance over speed" yields
\[T(x)=\text{swimming time}+\text{running time}
=\frac xs+\frac{80-\sqrt{x^2-1600}}{2s},\]
where \(T(x)\) is the time it takes Meepfrog to reach the seagull due to the choice of \(x\) feet swum. Minimizing \(T(x)\) yields the critical-point equation
\[T'(x)=\frac1s-\frac{x}{2s\sqrt{x^2-1600}}=0.\]
Since \(s>0\) is just a constant, we can multiply it out. The derivative is positive if and only if \(2\sqrt{x^2-1600}>x\), so the derivative changes from negative to positive at
\[2\sqrt{x^2-1600}=x,\quad
4x^2-6400=x^2,\quad x=\frac{80\sqrt3}{3},\]
giving us our minimum.

For completeness, the landing point can be restricted to the shoreline between the point directly below Meepfrog and the seagull: landing to the east or beyond the seagull increases both swimming and running distances compared with the nearest endpoint. Thus \(40\le x\le\sqrt{40^2+80^2}=40\sqrt5\). The critical distance lies strictly inside this interval. Since the time decreases before it and increases afterward, it beats both swimming straight to the nearest shore and swimming all the way to the seagull. The optimal horizontal swimming displacement is only \(\sqrt{x^2-1600}=40/\sqrt3\); the question asks for the full hypotenuse distance \(80\sqrt3/3\).`,
  },
  {
    id: 10349, number: 227, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 24 },
    topic: "Function Analysis", difficulty: 3, methods: ["Asymptotes"],
    question: String.raw`If a single-variable, non-piecewise function \(f\) has \(v>0\) vertical asymptotes at finite \(x\)-coordinates and \(h>0\) horizontal asymptotes at finite \(y\)-values, what is the minimum possible number of discontinuities \(f'(x)\) has when graphed in the \(xy\)-plane \((y=f'(x))\)? Here, \(\min(v,h)\) represents the minimum value between \(v\) and \(h\).

Count an isolated undefined point where \(f'\) has no finite continuous extension as a discontinuity.`,
    choices: [String.raw`\(v\)`, String.raw`\(h\)`, String.raw`\(\min(v,h)\)`, String.raw`\(v+h\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Horizontal asymptotes need not create discontinuities in our original function \(f\). One simple example of this is \(f(x)=1/x\), where \(y=0\) is a horizontal asymptote in both directions but \(f'(x)\) is only discontinuous, in the stated singularity-counting sense, at \(x=0\). For each vertical asymptote, however, \(f\) cannot have a finite continuous extension there, and \(f'\) cannot have a finite continuous extension there either. We have a minimum of \(v\) vertical asymptotes that create these discontinuities.

The original assertion needs justification: a discontinuity of a function alone does not always force a discontinuity of its derivative on the punctured domain. What matters here is unbounded behavior at a vertical asymptote. If \(f'\) extended continuously with a finite value across \(x=a\), then it would be bounded in a neighborhood of \(a\). The Mean Value Theorem would imply \(|f(x)-f(b)|\le M|x-b|\) for a fixed nearby \(b\) on either side. This would keep \(f(x)\) bounded as \(x\to a\), contradicting the vertical asymptote. Each of the \(v\) distinct finite locations therefore contributes an unavoidable singular point of \(f'\).

We must also show the bound is attainable. For one horizontal asymptote, take
\[f(x)=\sum_{j=1}^v\frac1{x-j}.\]
It has precisely the vertical asymptotes \(x=1,\ldots,v\), tends to \(0\) at both infinities, and its derivative is continuous everywhere else. For two distinct horizontal asymptotes, take
\[f(x)=\arctan x+\sum_{j=1}^v\frac1{x-j}.\]
Its horizontal asymptotes are \(y=-\pi/2\) and \(y=\pi/2\), and again its derivative has exactly those \(v\) singular points and no others. A real function can have at most two distinct horizontal asymptotes, so these cover all possible positive \(h\). Thus the minimum is \(v\), independent of \(h\).`,
  },
  {
    id: 10350, number: 228, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 25 },
    topic: "Limits", difficulty: 2, methods: ["Asymptotes"],
    question: String.raw`Find the equation of the slant asymptote of the function \(f(x)=\frac{x^2+\sin(x)}{x+1}\).`,
    choices: [String.raw`\(y=x\)`, String.raw`\(y=x-1\)`, String.raw`\(y=x+1\)`, String.raw`\(y=x+\sin(x)\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Split the function into \(\frac{x^2}{x+1}+\frac{\sin(x)}{x+1}\); we want to consider the limiting behavior as \(x\to\pm\infty\). In the former case, we have
\[\frac{x^2}{x+1}=x-1+\frac1{x+1},\]
where the latter term vanishes as \(x\) grows large in magnitude. In the latter case,
\[\left|\frac{\sin x}{x+1}\right|\le\frac1{|x+1|}\longrightarrow0,\]
so by the squeeze theorem \(\sin(x)/(x+1)\) goes to \(0\). As such, the limiting behavior of the original function looks like \(y=x-1\).

More precisely,
\[f(x)-(x-1)=\frac{1+\sin x}{x+1},\qquad
|f(x)-(x-1)|\le\frac2{|x+1|}\longrightarrow0\]
as \(x\to+\infty\) and \(x\to-\infty\). This vanishing difference is the definition of a slant asymptote. The absolute-value bounds avoid reversing inequalities when \(x+1<0\).`,
  },
  {
    id: 10351, number: 229, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 26 },
    topic: "Inequalities", difficulty: 4, methods: ["Mean Value Theorem", "Triangle Inequality"],
    question: String.raw`Which of the following function(s) \(f\) satisfy \(|f(u)-f(v)|\le|u-v|\) for all real, distinct values of \(u\) and \(v\)?

\[\text{I: }f(x)=\sin(x),\qquad \text{II: }f(x)=\arctan(x)\]
\[\text{III: }f(x)=-|x|,\qquad
\text{IV: }f(x)=\begin{cases}\frac{x}{|x|},&x\ne0,\\1,&x=0.\end{cases}\]`,
    choices: ["I, II only", "I, II, III only", "I, II, IV only", "I, II, III, IV", "NOTA"],
    answer: "B",
    solution: String.raw`Dividing both sides by \(|u-v|\) (safe as \(u\) and \(v\) are distinct) gives
\[\left|\frac{f(u)-f(v)}{u-v}\right|\le1.\]
This looks very similar to something involving the Mean Value Theorem (MVT). For a function differentiable on the real line, the MVT shows that a bound \(|f'|\le1\) implies the desired bound on every average rate of change. Conversely, the original inequality bounds \(|f'|\) wherever the derivative exists. It does not require differentiability everywhere, as III demonstrates.

If \(f(x)=\sin(x)\), then \(f'(x)=\cos(x)\) and \(|\cos(x)|\le1\). On the interval between any \(u\) and \(v\), the MVT gives the required inequality.

If \(f(x)=\arctan(x)\), then \(f'(x)=1/(1+x^2)\) and \(|1/(1+x^2)|\le1\). The same argument applies.

If \(f(x)=-|x|\), we could find \(f'(x)\) here as a piecewise function, but the more beautiful solution just means plugging the function into the original inequality. If we do, we actually get
\[\big||u|-|v|\big|\le|u-v|,\]
which is exactly the Reverse Triangle Inequality! It follows from \(|u|\le|u-v|+|v|\) and the same inequality with \(u,v\) interchanged.

We can use \(u=0.1\) and \(v=-0.1\) as a counterexample to the last example. Their function values are \(1\) and \(-1\), so \(|f(u)-f(v)|=2>0.2=|u-v|\). If you'd like the simplest geometric answer as to why this one fails, it's because the absolute value of the average rate of change on the different pieces of \(f\) could exceed \(1\) if we are super close to the discontinuity (\(x=0\)).

Therefore, items I, II, and III work only.`,
  },
  {
    id: 10352, number: 230, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 27 },
    topic: "Geometric Series", difficulty: 3, methods: ["Infinite Geometric Series"],
    question: String.raw`Meepfrog begins writing out numbers in an infinite geometric sequence \(\{a_n\}\) in order, starting with the first term \(a_1\) and so on. Meepfrog then writes down the infinite geometric sequence \(\{b_n\}\) that satisfies \(b_{2k-1}=a_{2k-1}\) and \(b_{2k}=-a_{2k}\) for any integer \(k\ge1\). If \(a_1=b_1=1\), \(\sum_{k=1}^\infty a_k<\sum_{k=1}^\infty b_k\), and \(\sum_{k=1}^\infty a_k+\sum_{k=1}^\infty b_k=4\), then \(a_5\) can be written as \(\frac pq\) for relatively prime integers \(p\) and \(q\), with \(q>0\). What is the value of \(p+q\)?`,
    choices: ["3", "5", "7", "9", "NOTA"],
    answer: "B",
    solution: String.raw`The statements "\(b_{2k-1}=a_{2k-1}\) and \(b_{2k}=-a_{2k}\) for any integer \(k\ge1\)" tell us that the odd-position (first, third, etc.) terms are equal in these sequences, but their even-position terms are opposite in sign. This is extremely important because it also reveals that their common ratios are opposite in sign (so if one of these sequences converges, the other will always as \(|r|<1\) implies \(|-r|<1\)!).

When we add these convergent series together, their even-position terms cancel each other out, leaving just the odd-position terms. The terms in the resulting sum will be \(1+1=2\), \(r^2+(-r)^2=2r^2\), \(r^4+(-r)^4=2r^4\), and so on.

This is a geometric series with first term \(2\) and common ratio \(r^2\) whose infinite sum is given to add to \(4\). Applying the formula for this yields
\[\frac2{1-r^2}=4,\qquad r^2=\frac12,\qquad r=\pm\frac{\sqrt2}{2}.\]
The inequality between the two given sums determines the sign:
\[\frac1{1-r}<\frac1{1+r}.\]
Since \(|r|<1\), both denominators are positive; cross multiplication gives \(1+r<1-r\), hence \(r<0\). Thus \(r=-\sqrt2/2\), not the positive root.

In this case, \(a_5=b_5=a_1r^4=1\cdot(-\sqrt2/2)^4=1/4\) (\(k=3\) for \(b_{2k-1}=a_{2k-1}\)). Therefore, \(p=1\) and \(q=4\), so \(p+q=5\). Stating \(q>0\) fixes the usual reduced-fraction sign convention.`,
  },
  {
    id: 10353, number: 231, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 28 },
    topic: "Definite Integrals", difficulty: 4, methods: ["Trigonometric Identities"],
    question: String.raw`Which of the following is equal to the ratio \(\frac{I_s}{I_c}\) for
\[I_s=\int_0^{\pi/2}\frac{\sin^2(x)}{k\sin^2(x)+\cos^2(x)}\,dx,\qquad
I_c=\int_0^{\pi/2}\frac{\cos^2(x)}{k\sin^2(x)+\cos^2(x)}\,dx\]
in terms of
\[I=\int_0^{\pi/2}\frac1{k\sin^2(x)+\cos^2(x)}\,dx\]
for \(0<k<1\)?`,
    choices: [String.raw`\(\frac{2\pi-I}{kI-2\pi}\)`, String.raw`\(\frac{I-2\pi}{kI-2\pi}\)`, String.raw`\(\frac{I-\pi}{2kI-\pi}\)`, String.raw`\(\frac{\pi-2I}{2kI-\pi}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Even though the \(I_s\) and \(I_c\) integrals look intractable at first, we can actually extract their ratio without insane calculation! With the motivation of using \(\sin^2(x)+\cos^2(x)=1\) as much as possible, we can note that \(I_s+I_c=I\) immediately. The more complicated equation involves (thinking to simplify via the denominators) \(kI_s+I_c\) because
\[kI_s+I_c=\int_0^{\pi/2}
\frac{k\sin^2(x)+\cos^2(x)}{k\sin^2(x)+\cos^2(x)}\,dx
=\int_0^{\pi/2}1\,dx=\frac\pi2.\]
Solving this system of equations gives
\[(k-1)I_s=\frac\pi2-I,\qquad
I_s=\frac{\pi-2I}{2(k-1)},\]
\[I_c=I-I_s=\frac{2kI-\pi}{2(k-1)}.\]
So
\[\frac{I_s}{I_c}=\frac{\pi-2I}{2kI-\pi}.\]
All original denominators are at least \(k>0\), so the integrals exist. Also \(I_c>0\), because its continuous integrand is positive on the interior; hence \(2kI-\pi=2(k-1)I_c\ne0\). This justifies the division when forming the ratio.`,
  },
  {
    id: 10354, number: 232, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 29 },
    topic: "Definite Integrals", difficulty: 3, methods: ["U-Substitution"],
    question: String.raw`For what value of \(n\) does
\[I=\int_0^{\pi/2}\frac1{k\sin^2(x)+\cos^2(x)}\,dx=\frac{\pi k^n}{2}\]
for all \(0<k<1\)?`,
    choices: ["-1", String.raw`\(-\frac12\)`, String.raw`\(\frac12\)`, "1", "NOTA"],
    answer: "B",
    solution: String.raw`Dividing the top and bottom of this fraction by \(\cos^2(x)\) makes the integral now
\[\int_0^{\pi/2}\frac{\sec^2(x)}{k\tan^2(x)+1}\,dx.\]
We can rewrite this creatively as
\[\int_0^{\pi/2}\frac{\sec^2(x)}{(\sqrt{k}\tan(x))^2+1}\,dx\]
to apply the substitution \(u=\sqrt{k}\tan(x)\), so that \(du/\sqrt{k}=\sec^2(x)\,dx\). Plugging this all in yields
\[\frac1{\sqrt{k}}\int_0^\infty\frac{du}{u^2+1}
=\lim_{t\to\infty}\left[\frac1{\sqrt{k}}\arctan u\right]_0^t
=\frac{\pi k^{-1/2}}2,\]
so \(n=-1/2\).

The original integrand is continuous even at \(x=\pi/2\), where its value is \(1/k\). The transformed upper limit is nevertheless infinite because \(\tan x\to+\infty\). Perform the substitution up to \(b<\pi/2\) and then take \(b\to(\pi/2)^-\); this avoids dividing by the zero value of \(\cos(\pi/2)\) at the endpoint.`,
  },
  {
    id: 10355, number: 233, division: "Mu",
    source: { ...marchRegional2026, questionNumber: 30 },
    topic: "Power Series", difficulty: 5, methods: ["Power Series"],
    question: String.raw`For all integers \(n\ge2\), let \(y=f_n(x)\) be the solution to the differential equation \(y^{(n)}=n^2x\) with initial conditions
\[f_n(0)=f_n^{(1)}(0)=\cdots=f_n^{(n-1)}(0)=0.\]
If the value of \(\sum_{k=2}^{+\infty}f_k(2)\) can be expressed as \(Ae^B-C\) for positive integers \(A\), \(B\), and \(C\), what is the value of \(A+B+C\)?`,
    choices: ["4", "6", "8", "10", "NOTA"],
    answer: "C",
    solution: String.raw`The differential equation \(y^{(n)}=n^2x\) requires us to integrate \(n^2x\) with respect to \(x\) a total of \(n\) times. With each antiderivative, we divide by a number one more than the current exponent of \(x\) (i.e., the inverse power rule). Doing so for an arbitrary \(n\ge2\) means that the highest degree inside \(f_n(x)\) will be \(n+1\) and we will end up dividing \(n^2\) by \((n+1)!\), and because our initial conditions are all \(0\), this will be the only nonzero term in each \(f_n(x)\)... let's look at some small cases what this paragraph actually means:

If \(n=2\), then \(y''=n^2x\) means \(y'=\frac{n^2}{2}x^2+C_1\). Plugging in \(y'(0)=0\) gives \(C_1=0\), so \(y'=\frac{n^2}{2}x^2\). Integrating one more time gives \(y=\frac{n^2}{6}x^3+C_2\), and plugging in \(y(0)=0\) gives \(C_2=0\), so \(y=f_2(x)=\frac{2^2}{3!}x^3\).

For \(n=3\), integrate \(y'''=9x\) three times, applying the zero initial values at each stage, to get \(y=f_3(x)=\frac{3^2}{4!}x^4\). The pattern continues to hold. In general,
\[f_n(x)=\frac{n^2}{(n+1)!}x^{n+1}.\]
Differentiating \(n\) times recovers \(n^2x\), and all derivatives through order \(n-1\) vanish at \(0\). The only other possible terms after integrating are a polynomial of degree at most \(n-1\), all of whose coefficients are forced to zero by those initial values.

So
\[\sum_{k=2}^{+\infty}f_k(2)=\sum_{k=2}^{+\infty}\frac{k^2\,2^{k+1}}{(k+1)!}.\]
Now we get to evaluate this monster sum! Given that our answer is supposed to be in a form that involves a power of \(e\), we definitely want to manipulate this sum to be terms of \(\sum_{k=0}^{+\infty}2^k/k!=e^2\), referencing the popular Taylor series \(\sum_{k=0}^{+\infty}x^k/k!=e^x\). But the \(k^2\) in the numerator of our sum proposes a problem: how do we reduce an extra quadratic factor to get that easier sum? The trick will be to break up \(k^2\) into a linear combination of terms involving \(k+1\).

Ready? It's time to put everything together in painstaking fashion:
\[\sum_{k=2}^\infty\frac{k^2\,2^{k+1}}{(k+1)!}
=\sum_{k=2}^\infty\frac{(k+1)^2\,2^{k+1}}{(k+1)!}
-2\sum_{k=2}^\infty\frac{(k+1)\,2^{k+1}}{(k+1)!}
+\sum_{k=2}^\infty\frac{2^{k+1}}{(k+1)!}\]
\[=\sum_{k=2}^\infty\frac{(k+1)\,2^{k+1}}{k!}
-2\sum_{k=2}^\infty\frac{2^{k+1}}{k!}
+\sum_{k=2}^\infty\frac{2^{k+1}}{(k+1)!}\]
\[=\sum_{k=2}^\infty\frac{2^{k+1}}{(k-1)!}
-\sum_{k=2}^\infty\frac{2^{k+1}}{k!}
+\sum_{k=2}^\infty\frac{2^{k+1}}{(k+1)!}\]
\[=4\sum_{k=2}^\infty\frac{2^{k-1}}{(k-1)!}
-2\sum_{k=2}^\infty\frac{2^k}{k!}
+\sum_{k=2}^\infty\frac{2^{k+1}}{(k+1)!}.\]
The algebra uses \(k^2=(k+1)^2-2(k+1)+1\), and then \(k/k!=1/(k-1)!\).

Fun! Now re-indexing each sum so that each sum features \(2^k/k!\) means we now deal with:
\[4\sum_{k=1}^\infty\frac{2^k}{k!}
-2\sum_{k=2}^\infty\frac{2^k}{k!}
+\sum_{k=3}^\infty\frac{2^k}{k!}\]
\[=4(e^2-1)-2(e^2-1-2)+(e^2-1-2-2)\]
\[=4e^2-4-2e^2+6+e^2-5=3e^2-3.\]
All these series are absolutely convergent, so splitting and re-indexing are valid. The omitted Taylor terms are \(1,2,2\) for indices \(0,1,2\), respectively. So \(A=3,B=2\), and \(C=3\). We can finally calculate \(A+B+C=8\) to be done with this question!`,
  },
  // Chiles Statewide, January 11, 2025. All 30 retained; see the source audit.
  {
    id: 10356, number: 234, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 1 },
    topic: "Limits", difficulty: 1, methods: [],
    question: String.raw`Evaluate \(\displaystyle\lim_{x\to1}\frac{x^2+3x+2}{1-x^2}\). Select DNE if you believe the limit does not exist.`,
    choices: [String.raw`\(-\frac12\)`, String.raw`\(\frac12\)`, "1", "DNE", "NOTA"],
    answer: "D",
    solution: String.raw`By inspection we can see there is a vertical asymptote at \(x=1\) therefore the limit does not exist.

To check both sides explicitly, factor and cancel only away from the canceled zero:
\[\frac{(x+1)(x+2)}{(1-x)(1+x)}=\frac{x+2}{1-x}\qquad(x\ne-1,1).\]
As \(x\to1^-\), the numerator approaches \(3>0\) and the denominator approaches \(0^+\), giving \(+\infty\). As \(x\to1^+\), the denominator approaches \(0^-\), giving \(-\infty\). The one-sided limits disagree, so the two-sided limit is DNE, choice D.`,
  },
  {
    id: 10357, number: 235, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 2 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`Determine \(f'(\frac{\sqrt\pi}{2})\) given \(f(x)=\tan^2(x^2)\).`,
    choices: [String.raw`\(2\sqrt{2\pi}\)`, String.raw`\(4\sqrt\pi\)`, String.raw`\(4\pi\)`, "DNE", "NOTA"],
    answer: "B",
    solution: String.raw`\(f'(x)=4x\tan(x^2)\sec^2(x^2)\) by application of the chain rule, therefore
\[f'\left(\frac{\sqrt\pi}{2}\right)
=4\left(\frac{\sqrt\pi}{2}\right)\tan\left(\frac\pi4\right)
\sec^2\left(\frac\pi4\right)
=4\left(\frac{\sqrt\pi}{2}\right)(1)(\sqrt2)^2=4\sqrt\pi.\]
There are three nested operations: squaring the tangent contributes \(2\tan(x^2)\), differentiating tangent contributes \(\sec^2(x^2)\), and differentiating its input \(x^2\) contributes \(2x\). Also \((\sqrt\pi/2)^2=\pi/4\), not \(\pi/2\). Thus the answer is B.`,
  },
  {
    id: 10358, number: 236, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 3 },
    topic: "Derivatives", difficulty: 1, methods: [],
    question: String.raw`Determine the equation of the line tangent to \(f(x)=e^x+\cos x+x\) at \(x=0\).`,
    choices: [String.raw`\(-2x+y=2\)`, String.raw`\(-x+y=1\)`, String.raw`\(-x+y=0\)`, String.raw`\(y=1\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\(f(0)=2\) by substitution, \(f'(x)=e^x-\sin x+1\) so \(f'(0)=2\) by substitution, then the equation of the tangent line is found using \(y-2=2(x-0)\) or \(y-2x=2\).

The point of tangency is \((0,2)\), and the derivative gives its slope, \(2\). Rearranging point-slope form to match the listed choices gives \(-2x+y=2\), choice A.`,
  },
  {
    id: 10359, number: 237, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 4 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`Determine \(\frac{dy}{du}\) given that \(y=2^{x-1}\) and \(x=2u^3\).`,
    choices: [String.raw`\(2^{2u^3-1}\ln2\)`, String.raw`\(2^{u^3}\ln8\)`, String.raw`\(2^{u^3}u^2\ln2\)`, String.raw`\(4^{u^3}u^2\ln8\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Deriving both equations in terms of \(u\) we get
\[\frac{dy}{du}=2^{x-1}\ln2\,\frac{dx}{du},\qquad \frac{dx}{du}=6u^2\]
then substituting we have \(\frac{dy}{du}=2^{x-1}\ln2\cdot6u^2\). Replacing \(x\) with \(2u^3\), we then have \(2^{2u^3-1}\ln2\cdot6u^2\). By splitting the exponential term, simplifying, and using properties of logarithms and exponents, we end up with D:
\[6u^2\frac{2^{2u^3}}2\ln2
=2^{2u^3}u^2(3\ln2)
=4^{u^3}u^2\ln8.\]
The factor \(\ln2\) comes from differentiating an exponential with base \(2\); the factor \(6u^2\) comes from its changing exponent.`,
  },
  {
    id: 10360, number: 238, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 5 },
    topic: "Derivatives", difficulty: 1, methods: [],
    illustration: chilesStatewide2025Table,
    question: String.raw`Use the Following Table to Answer this Question. Both \(f\) and \(g\) are continuous and differentiable for all values of \(x\):

Evaluate \(\frac{d}{dx}[f^{-1}(-1)]\).

For this expression, \(f^{-1}(-1)\) denotes a fixed chosen preimage of \(-1\), for example \(2\); a global inverse is not assumed.`,
    choices: ["-1", "0", String.raw`\(\frac15\)`, "5", "NOTA"],
    answer: "B",
    solution: String.raw`The chosen inverse value of \(f\) at \(-1\) is just a number, so its derivative is zero.

The table gives \(f(2)=-1\). Choosing this preimage makes the expression \(\frac d{dx}[2]=0\), choice B. More generally, any fixed chosen preimage is constant with respect to \(x\). The input inside the brackets is \(-1\), not \(x\).

There is a necessary notation repair in the question: the table does not permit a global inverse on the real line. A continuous injective real function must be strictly monotone, whereas \(f(-1)=3>f(0)=1<f(1)=7\). The question therefore specifies a chosen preimage rather than assuming a nonexistent global inverse. Also \(\frac d{dx}[f^{-1}(-1)]\) is not the same expression as \((f^{-1})'(-1)\), the derivative of an inverse function evaluated at \(-1\). The latter would require additional inverse-function hypotheses; the usual reciprocal formula cannot be applied with \(f'(2)=0\).`,
  },
  {
    id: 10361, number: 239, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 6 },
    topic: "Limits", difficulty: 2, methods: [],
    illustration: chilesStatewide2025Table,
    question: String.raw`Use the Following Table to Answer this Question. Both \(f\) and \(g\) are continuous and differentiable for all values of \(x\):

Evaluate \(\displaystyle\lim_{x\to2}\frac{f(x)+x-1}{x^2-g(x)}\). Select DNE if you believe the limit does not exist.`,
    choices: [String.raw`\(-\frac12\)`, "0", String.raw`\(\frac13\)`, "DNE", "NOTA"],
    answer: "C",
    solution: String.raw`Evaluating the numerator and denominator at \(2\) gives \(-1+2-1=0\) and \(4-4=0\). The source uses L'Hopital's rule to obtain \((0+1)/(4-1)=1/3\). However, differentiability alone does not guarantee that the derivatives approach their values at \(2\), so the following difference-quotient argument justifies the result using exactly the stated assumptions.

For \(x\ne2\), divide both numerator and denominator by \(x-2\):
\[\frac{f(x)+x-1}{x^2-g(x)}
=\frac{\dfrac{f(x)-f(2)}{x-2}+1}
{x+2-\dfrac{g(x)-g(2)}{x-2}}.\]
The two difference quotients tend to \(f'(2)=0\) and \(g'(2)=1\), respectively. Hence
\[\lim_{x\to2}\frac{f(x)+x-1}{x^2-g(x)}
=\frac{f'(2)+1}{4-g'(2)}
=\frac{0+1}{4-1}=\frac13.\]
The transformed denominator approaches \(3\ne0\), so division is valid sufficiently close to \(2\). Thus C is correct, without needing continuity of \(f'\) or \(g'\).`,
  },
  {
    id: 10362, number: 240, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 7 },
    topic: "Derivatives", difficulty: 2, methods: ["Quotient Rule", "Chain Rule"],
    illustration: chilesStatewide2025Table,
    question: String.raw`Use the Following Table to Answer this Question. Both \(f\) and \(g\) are continuous and differentiable for all values of \(x\):

Given that \(h(x)=\frac{f(x)}{g(x^2+1)}\) determine the value of \(h'(1)\).`,
    choices: ["-12", String.raw`\(-\frac{13}{8}\)`, String.raw`\(-\frac{19}{16}\)`, "12", "NOTA"],
    answer: "B",
    solution: String.raw`Using the quotient rule
\[h'(x)=\frac{f'(x)g(x^2+1)-2xf(x)g'(x^2+1)}
{[g(x^2+1)]^2}\]
so
\[h'(1)=\frac{f'(1)g(2)-2f(1)g'(2)}{[g(2)]^2}
=\frac{(-3)(4)-2(7)(1)}{4^2}
=\frac{-12-14}{16}=-\frac{13}{8}.\]
In particular, the chain rule contributes the factor \(2x\) when differentiating \(g(x^2+1)\). At \(x=1\) the inner argument is \(2\), so use the \(x=2\) column for \(g\) and \(g'\), but the \(x=1\) column for \(f\) and \(f'\). The denominator \(g(2)=4\) is nonzero. The answer is B.`,
  },
  {
    id: 10363, number: 241, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 8 },
    topic: "Differential Equations", difficulty: 3, methods: [],
    question: String.raw`Given that \(g''(x)=f''(x)\), \(f(1)=3\), \(g(1)=2\), \(g(-1)=4\), and \(f(x)\) is an even power function with degree greater than 1, which of the following could be the value of the coefficient of the linear term of \(g(x)\)?`,
    choices: ["-3", "-1", "2", "7", "NOTA"],
    answer: "B",
    solution: String.raw`Integrating the expression \(g''(x)=f''(x)\), we have \(g'(x)=f'(x)+c_1\), where \(c_1\) represents some real constant. Integrate again and we have \(g(x)=f(x)+c_1x+c_2\), where \(c_2\) is another real constant. Using the initial conditions for \(x=1\), \(g(1)=f(1)+c_1+c_2\), and thus \(2=3+c_1+c_2\) or \(c_2=-1-c_1\).

Since \(f(x)\) is even, \(f(1)=f(-1)\), therefore \(g(-1)=3-c_1+c_2\). Substituting for \(c_2\), \(g(-1)=3-c_1-1-c_1\) or \(g(-1)=2-2c_1\). Given that \(g(-1)=4\), \(4=2-2c_1\) or \(c_1=-1\).

Consequently \(c_2=0\) and \(g(x)=f(x)-x\). Because the even power function \(f\) has degree greater than \(1\), it contains no linear term. Therefore the coefficient of the linear term of \(g\) is exactly \(-1\), choice B.`,
  },
  {
    id: 10364, number: 242, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 9 },
    topic: "Limits", difficulty: 2, methods: ["Exponential Limits"],
    question: String.raw`Evaluate \(\displaystyle\lim_{n\to\infty}\left(\frac{n}{n-2}\right)^n\).`,
    choices: ["0", "1", String.raw`\(e\)`, String.raw`\(e^{-2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Notice that the limit can be rewritten as
\[\lim_{n\to\infty}\left(\frac{n-2}{n}\right)^{-n}
=\lim_{n\to\infty}\left(1-\frac2n\right)^{-n}
=e^{(-2)(-1)}=e^2.\]
To justify the exponential-limit step, let \(L_n=(1-2/n)^{-n}>0\) for \(n>2\). Then
\[\ln L_n=-n\ln(1-2/n)
=2\,\frac{\ln(1-2/n)}{-2/n}\longrightarrow2,\]
using \(\lim_{u\to0}\ln(1+u)/u=1\). Continuity of the exponential gives \(L_n\to e^2\), which is not among A-D, so E is correct. The printed limit uses \(x\to\infty\) despite an expression in \(n\); the bound variable has been corrected to \(n\).`,
  },
  {
    id: 10365, number: 243, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 10 },
    topic: "Linear Approximation", difficulty: 2, methods: ["Linear Approximation", "Product Rule"],
    question: String.raw`Given that \(f(x)=x\arcsin x\), use the line tangent to \(f(x)\) at \(x=\frac12\) to approximate \(f(1)\).`,
    choices: [String.raw`\(\frac{\sqrt3}{6}\)`, String.raw`\(\frac{\pi+\sqrt3}{6}\)`, String.raw`\(\frac{\pi+\sqrt3}{12}\)`, String.raw`\(\frac{\pi+2\sqrt3}{12}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`\(f(\frac12)=\frac\pi{12}\) by substitution, \(f'(x)=\frac{x}{\sqrt{1-x^2}}+\arcsin x\) by the product rule, \(f'(\frac12)=\frac1{\sqrt3}+\frac\pi6\) by substitution, then the equation of the tangent line is found using
\[y-\frac\pi{12}=\left(\frac1{\sqrt3}+\frac\pi6\right)\left(x-\frac12\right).\]
So
\[f(1)\approx\left(\frac1{\sqrt3}+\frac\pi6\right)\left(1-\frac12\right)+\frac\pi{12}
=\frac1{2\sqrt3}+\frac\pi{12}+\frac\pi{12}
=\frac{\sqrt3+\pi}{6}.\]
This is the tangent-line estimate, choice B, not the actual value \(f(1)=\pi/2\). The requested procedure extrapolates from \(x=1/2\) to \(x=1\).`,
  },
  {
    id: 10366, number: 244, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 11 },
    topic: "Optimization", difficulty: 2, methods: ["First Derivative Test"],
    question: String.raw`Determine the absolute maximum value of \(y=2x^3-4x^2+2x+1\) over the domain \([-\frac12,\frac32]\).`,
    choices: [String.raw`\(\frac13\)`, "1", String.raw`\(\frac{35}{27}\)`, String.raw`\(\frac32\)`, "NOTA"],
    answer: "E",
    solution: String.raw`The absolute maximum of a continuous function over a closed interval will occur at a critical point or an endpoint. Deriving \(f(x)\) we have \(f'(x)=6x^2-8x+2\). Setting equal to \(0\) and factoring we have \(0=2(3x-1)(x-1)\) giving us critical points at \(x=\frac13,1\).

Check all four candidates:
\[f(-1/2)=-\frac54,\qquad f(1/3)=\frac{35}{27},\qquad f(1)=1,\qquad f(3/2)=\frac74.\]
The largest is \(7/4\), which is not listed, so the answer is E. The source's opening word "minimum" is a typo; this is a maximum problem.

For the local behavior, \(f'\) is positive before \(1/3\), negative between \(1/3\) and \(1\), and positive after \(1\). Thus \(1/3\) is a local maximum and \(1\) a local minimum, but an endpoint can still give the absolute maximum, as happens here.`,
  },
  {
    id: 10367, number: 245, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 12 },
    topic: "Limits", difficulty: 2, methods: ["Trigonometric Identities"],
    question: String.raw`Evaluate \(\displaystyle\lim_{x\to0}\frac{\tan x}{x^3\csc^2(2x)}\).`,
    choices: ["0", "1", "2", "4", "NOTA"],
    answer: "D",
    solution: String.raw`Begin by rewriting each trig ratio in terms of sines and cosines:
\[\lim_{x\to0}\frac{\sin x\sin^2(2x)}{x^3\cos x}
=\lim_{x\to0}\frac{\sin x}{x}\cdot\frac{\sin^2(2x)}{x^2}\cdot\frac1{\cos x}
=1\cdot4\cdot1=4.\]
In detail, \(\sin(2x)/x=2[\sin(2x)/(2x)]\to2\), so its square tends to \(4\). The other factors tend to \(1\) by the standard sine limit and continuity of cosine. These identities hold in a punctured neighborhood of \(0\), which is all the limit requires. The answer is D.`,
  },
  {
    id: 10368, number: 246, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 13 },
    topic: "Limits", difficulty: 2, methods: ["Rationalization"],
    question: String.raw`Evaluate
\[\lim_{x\to\infty}\left(\sqrt{2x^2-2x}-\sqrt{2x^2+12x+1}\right).\]`,
    choices: [String.raw`\(-\frac{7\sqrt2}{2}\)`, String.raw`\(-\frac72\)`, "0", String.raw`\(-14\sqrt2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Utilize the conjugate:
\[\sqrt{2x^2-2x}-\sqrt{2x^2+12x+1}
=\frac{(2x^2-2x)-(2x^2+12x+1)}
{\sqrt{2x^2-2x}+\sqrt{2x^2+12x+1}}\]
\[=\frac{-14x-1}{\sqrt{2x^2-2x}+\sqrt{2x^2+12x+1}}.\]
Because \(x\to+\infty\), we have \(x>0\) eventually, so dividing numerator and denominator by \(x\) gives
\[\frac{-14-1/x}{\sqrt{2-2/x}+\sqrt{2+12/x+1/x^2}}
\longrightarrow\frac{-14}{2\sqrt2}=-\frac{7\sqrt2}{2}.\]
Rationalization removes the indeterminate difference of two unbounded terms. The answer is A.`,
  },
  {
    id: 10369, number: 247, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 14 },
    topic: "Differentiability", difficulty: 2, methods: ["Mean Value Theorem"],
    question: String.raw`Given that \(f(x)=(4x^2-4x+1)^{1/3}\) determine the value of \(f'(c)\) that results from the application of the mean value theorem over the interval \(0\le x\le1\).`,
    choices: ["0", String.raw`\(\frac12\)`, String.raw`\(\sqrt2\)`, "2", "NOTA"],
    answer: "E",
    solution: String.raw`Although we could derive \(f(x)\), rewriting
\[(4x^2-4x+1)^{1/3}=((2x-1)^2)^{1/3}=|2x-1|^{2/3},\]
it becomes easy to see that this function has a cusp at \(x=\frac12\) therefore the mean value theorem does not apply as \(f(x)\) is not differentiable over the interval in question.

The theorem requires continuity on \([0,1]\) and differentiability at every point of \((0,1)\). The first condition holds but the second fails at \(1/2\). Although the endpoint secant slope is \((f(1)-f(0))/(1-0)=0\), that alone does not guarantee an interior derivative of \(0\).

Indeed, at every \(x\ne1/2\),
\[f'(x)=\frac43(2x-1)^{-1/3},\]
which never equals \(0\). Thus there is no such value supplied by the theorem, and NOTA, choice E, is correct rather than A.`,
  },
  {
    id: 10370, number: 248, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 15 },
    topic: "Implicit Differentiation", difficulty: 3, methods: ["Implicit Differentiation"],
    question: String.raw`Select the correct expression for \(\frac{dy}{dx}\) given the curve \(y\sec(xy)=x\).`,
    choices: [String.raw`\(\cos(xy)-y\tan(xy)\)`, String.raw`\(\frac1{\sqrt{\sec(xy)\tan(xy)}}\)`, String.raw`\(\frac{1-y^2\tan(xy)}{1+xy\sec(xy)}\)`, String.raw`\(\frac{\cos(xy)-y^2\tan(xy)}{1+xy\tan(xy)}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Implicitly, using the product rule,
\[\sec(xy)y'+y\sec(xy)\tan(xy)(y+xy')=1.\]
Here \((xy)'=y+xy'\), and \((\sec u)'=\sec u\tan u\cdot u'\). With some algebraic manipulation we have
\[\sec(xy)y'+y^2\sec(xy)\tan(xy)+xy\sec(xy)\tan(xy)y'=1,\]
then
\[[\sec(xy)+xy\sec(xy)\tan(xy)]y'=1-y^2\sec(xy)\tan(xy).\]
Thus
\[y'=\frac{1-y^2\sec(xy)\tan(xy)}
{\sec(xy)+xy\sec(xy)\tan(xy)}
=\frac{\cos(xy)-y^2\tan(xy)}{1+xy\tan(xy)},\]
which is D. The final simplification divides numerator and denominator by \(\sec(xy)\); the original curve already requires \(\cos(xy)\ne0\). The formula describes a finite derivative where \(1+xy\tan(xy)\ne0\).`,
  },
  {
    id: 10371, number: 249, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 16 },
    topic: "Rate of Change", difficulty: 3, methods: ["Related Rates"],
    question: String.raw`A square is inscribed in a circle which is inscribed in an equilateral triangle. At the moment when the diagonal of the square is 5 cm in length, the area of the circle is increasing at a rate of 4 \(\mathrm{cm}^2/\mathrm{sec}\). At this moment, what is the rate at which the area of the equilateral triangle is increasing in \(\mathrm{cm}^2/\mathrm{sec}\)?`,
    choices: [String.raw`\(\frac5{\sqrt3}\)`, String.raw`\(\frac8\pi\)`, String.raw`\(\frac{4\sqrt3}\pi\)`, String.raw`\(\frac{12\sqrt3}\pi\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The area of an equilateral triangle in terms of its apothem and perimeter is \(T=aP/2\), or in terms of one of its sides \(T=\sqrt3\,s^2/4\). The radius of the circle is equivalent to the apothem of the triangle and also equivalent to half the diagonal of the square, therefore the apothem at this moment is \(2.5\) cm.

Thus, the area of the circle can be written as \(C=\pi a^2\), so \(C'=2\pi aa'\). Substitute for \(C'\) and \(a\), then solve for \(a'\) (the rate of change of the apothem):
\[a'=\frac4{2\pi(2.5)}=\frac4{5\pi}\ \mathrm{cm/sec}.\]
The side length of an equilateral triangle in relation to its apothem can be written as \(s=2a\sqrt3\), so we can rewrite the area of the equilateral triangle as
\[T=\frac{a(6a\sqrt3)}2=3a^2\sqrt3.\]
Deriving the area of the equilateral triangle we have \(T'=6a\sqrt3\,a'\). Plugging in \(a\) and \(a'\),
\[T'=6\left(\frac52\right)\sqrt3\left(\frac4{5\pi}\right)
=\frac{12\sqrt3}{\pi}\ \mathrm{cm}^2/\mathrm{sec},\]
choice D.

The source printed linear units for both area rates and omitted the square on \(s\) in one area formula; these have been corrected. A useful check is \(T=(3\sqrt3/\pi)C\), so their rates have the same fixed ratio. This also shows why the given diagonal ultimately cancels from the answer.`,
  },
  {
    id: 10372, number: 250, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 17 },
    topic: "Derivatives", difficulty: 2, methods: [],
    question: String.raw`If \(f(a)=b\), which of the following must equal \(f'(a)\) for every admissible value of \(a\), given \(f(x)=x^3-2x^2+ax+b\)?`,
    choices: ["-1", "0", "1", String.raw`\(3a^2\)`, "NOTA"],
    answer: "B",
    solution: String.raw`If \(f(a)=b\), then \(b=a^3-2a^2+a^2+b=a^3-a^2+b\), or \(a^3-a^2=0\). Factoring, we have \(a^2(a-1)=0\), or \(a=0\) or \(a=1\). \(f'(x)=3x^2-4x+a\), so \(f'(a)=3a^2-4a+a\). If \(a=0\), then \(f'(a)=0\) and if \(a=1\), \(f'(a)=0\), therefore the answer is B.

In differentiating with respect to \(x\), the parameter \(a\) is held constant. Equivalently \(f'(a)=3a(a-1)=0\) for both possible parameter values. The original "could be" wording is ambiguous because \(3a^2\), choice D, also equals \(0\) when \(a=0\). The repaired question asks for an expression that works for every admissible \(a\); D fails when \(a=1\), whereas B always works.`,
  },
  {
    id: 10373, number: 251, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 18 },
    topic: "Limits", difficulty: 2, methods: ["L'Hopital's Rule"],
    question: String.raw`Cady is running out of time and needs to quickly evaluate
\[\lim_{x\to0^-}\frac{\ln(1-x)-\sin x}{1-\cos^2x}.\]
Help her out by choosing the correct answer! If you believe the limit doesn't exist, select DNE. Treat an infinite one-sided limit as its signed extended-real value.`,
    choices: [String.raw`\(-\infty\)`, "0", "1", "DNE", "NOTA"],
    answer: "E",
    solution: String.raw`Use a Pythagorean identity on the denominator of the limit, then, evaluating the limit at zero results in an indeterminate form so L'Hopital's gives us
\[\lim_{x\to0^-}\frac{\ln(1-x)-\sin x}{\sin^2x}
=\lim_{x\to0^-}\frac{-1/(1-x)-\cos x}{2\sin x\cos x}.\]
The numerator of the derivative quotient tends to \(-2\), while its denominator approaches \(0\) through negative values because \(\sin x<0\) and \(\cos x>0\) for small negative \(x\). Thus the quotient tends to \(+\infty\), and the one-sided version of L'Hopital's rule establishes the same infinite limit for the original expression.

This is not \(-\infty\), \(0\), or \(1\), and the signed value \(+\infty\) is not listed, so the intended answer is E. The question now explicitly uses the source's extended-real convention for infinite one-sided limits; otherwise some conventions use DNE for every nonfinite limit. A direct check uses \(\ln(1-x)-\sin x\sim-2x\) and \(\sin^2x\sim x^2\), giving \(-2/x\to+\infty\) from the left.`,
  },
  {
    id: 10374, number: 252, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 19 },
    topic: "Riemann Sums", difficulty: 2, methods: ["Riemann Sums"],
    question: String.raw`Evaluate \(\displaystyle\lim_{n\to\infty}\sum_{i=1}^n\frac{e^2(n+i)}{n^2}\).`,
    choices: ["0", String.raw`\(\frac{e^2}{2}\)`, String.raw`\(e^2\)`, String.raw`\(\frac{3e^2}{2}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`With a little algebra, the sum can be rewritten as
\[\lim_{n\to\infty}\sum_{i=1}^n\left(e+\frac en i\right)\frac en,\]
which is the following definite integral \(\int_e^{2e}x\,dx\). Integrating, we have \((2e)^2/2-e^2/2=3e^2/2\).

Here the interval is \([e,2e]\), the width is \(\Delta x=e/n\), and the right endpoints are \(x_i=e+ei/n\). Thus the expression is exactly a right-endpoint Riemann sum for the continuous function \(x\).

An independent finite-sum check gives
\[\frac{e^2}{n^2}\left(n^2+\frac{n(n+1)}2\right)
=e^2\left(\frac32+\frac1{2n}\right)\longrightarrow\frac{3e^2}{2},\]
choice D. The factor \(e^2\) is constant; \(n+i\) is not part of its exponent.`,
  },
  {
    id: 10375, number: 253, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 20 },
    topic: "Implicit Differentiation", difficulty: 3, methods: ["Logarithmic Differentiation"],
    question: String.raw`Given that \(y^y=x^x\) determine \(\frac{dy}{dx}\). Assume \(x,y>0\) and \(1+\ln y\ne0\).`,
    choices: [String.raw`\(\frac{dy}{dx}=\frac{\ln x+1}{\ln y+1}\)`, String.raw`\(\frac{dy}{dx}=\frac{1-\ln x}{\ln y}\)`, String.raw`\(\frac{dy}{dx}=\frac{x\,x^{x-1}}{y\,y^{y-1}}\)`, String.raw`\(\frac{dy}{dx}=\frac{x^x\ln x}{y^y\ln y}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Taking the natural log of both sides of the equation once we have \(y\ln y=x\ln x\), then deriving and applying the product rule we have
\[y'+y'\ln y=\ln x+1.\]
Then reorganizing we have \(y'(1+\ln y)=\ln x+1\) and finally
\[\frac{dy}{dx}=\frac{\ln x+1}{\ln y+1},\]
choice A.

The source says to take the logarithm "twice"; only one application is needed. The positivity assumptions make the real logarithms meaningful. The derivative of \(y\ln y\) is \(y'\ln y+y(1/y)y'=y'(\ln y+1)\). Neither the constant-exponent power rule nor the constant-base exponential rule alone works for \(y^y\), since both its base and exponent vary.

The condition \(1+\ln y\ne0\) justifies solving for a finite implicit derivative. At \(x=y=1/e\), both sides of the differentiated equation vanish, so this quotient is \(0/0\) and cannot determine a branch derivative there.`,
  },
  {
    id: 10376, number: 254, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 21 },
    topic: "Optimization", difficulty: 3, methods: ["Distance Formula", "First Derivative Test"],
    question: String.raw`Determine the shortest distance between the curve \(y^2=x\) and the point \((0,-3)\).`,
    choices: [String.raw`\(\frac{\sqrt2}{2}\)`, "1", String.raw`\(\sqrt3\)`, String.raw`\(\sqrt5\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Since the point in question is below the vertex of the curve, we can focus only on the lower half of the curve which we can define as \(y=-\sqrt x\). The distance between the curve and the given point can be written as
\[d=\sqrt{(x-0)^2+(-\sqrt x+3)^2}\]
or even easier \(d^2=x^2+(-\sqrt x+3)^2\). To minimize the distance, derive and set the derivative equal to zero:
\[2dd'=2x-\frac{-\sqrt x+3}{\sqrt x}\qquad(x>0).\]
For \(d'=0\) we can look exclusively at the numerator
\[0=x-\frac{-\sqrt x+3}{2\sqrt x}.\]
The candidate \(x=1\) satisfies this equation, giving \((1,-1)\). Now we use the Pythagorean Theorem to find a distance of \(d=\sqrt5\).

Here is a full verification that this is the unique global minimum, not just a candidate found by inspection. Parameterize the entire parabola as \((x,y)=(y^2,y)\), where \(y\) can be any real number. Minimizing distance is equivalent to minimizing its square because the square-root function is increasing:
\[Q(y)=y^4+(y+3)^2.\]
Then
\[Q'(y)=4y^3+2y+6=2(y+1)(2y^2-2y+3).\]
The quadratic factor is \(2(y-\frac12)^2+\frac52>0\) for every real \(y\). Thus \(Q'<0\) for \(y<-1\) and \(Q'>0\) for \(y>-1\). It decreases all the way to \(y=-1\) and increases thereafter, proving a global minimum there. Its value is \(Q(-1)=1+4=5\), so the shortest distance is \(\sqrt5\), choice D. This argument also checks the upper half and the vertex automatically.`,
  },
  {
    id: 10377, number: 255, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 22 },
    topic: "Definite Integrals", difficulty: 3, methods: ["Symmetry", "Product Rule"],
    question: String.raw`Given that \(A=\int_{-\pi/2}^{\pi/2}x\sin x\,dx\) and \(B=\int_0^{\pi/2}x^2\cos x\,dx\), determine the value of \(A+B\).`,
    choices: ["0", String.raw`\(\frac{\pi^2}{4}\)`, String.raw`\(\frac{11\pi^2}{24}\)`, String.raw`\(\frac{\pi^2}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Although both integrals can be calculated using by-parts, noticing that \(x\sin x\) is an even function as it is the product of two odd functions allows integral \(A\) to be rewritten as \(A=2\int_0^{\pi/2}x\sin x\,dx\). Now the two integrals can be written together as
\[A+B=\int_0^{\pi/2}(2x\sin x+x^2\cos x)\,dx.\]
Noticing that \(2x\sin x+x^2\cos x\) is the derivative of \(x^2\sin x\), then
\[A+B=[x^2\sin x]_0^{\pi/2}
=\left(\frac\pi2\right)^2\sin\left(\frac\pi2\right)-0^2\sin0
=\frac{\pi^2}{4}.\]
The key is to combine the integrals only after their bounds match. The product rule supplies exactly the two summands, avoiding two separate integrations by parts. As a check, integration by parts separately gives \(A=2\) and \(B=\pi^2/4-2\); their sum agrees with B.`,
  },
  {
    id: 10378, number: 256, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 23 },
    topic: "Riemann Sums", difficulty: 1, methods: ["Riemann Sums"],
    question: String.raw`Use a midpoint rectangular Riemann sum with four subintervals of equal width to approximate \(\int_0^2e^x\,dx\).`,
    choices: [String.raw`\(\frac{e^{1/2}+e+e^{3/2}+e^2}{4}\)`, String.raw`\(\frac{e^{1/2}+2e+2e^{3/2}+e^2}{4}\)`, String.raw`\(\frac{\sqrt[4]{e+e^2+e^3+e^4}}2\)`, String.raw`\(\frac{\sqrt[4]e+\sqrt[4]{e^3}+\sqrt[4]{e^5}+\sqrt[4]{e^7}}2\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The width of each interval will be \(1/2\) and the heights will be based on using the middle \(x\)-values over each interval or \(1/4,3/4,5/4,7/4\), giving us
\[\frac12e^{1/4}+\frac12e^{3/4}+\frac12e^{5/4}+\frac12e^{7/4}
=\frac{\sqrt[4]e+\sqrt[4]{e^3}+\sqrt[4]{e^5}+\sqrt[4]{e^7}}2.\]
Indeed the four subintervals are \([0,1/2]\), \([1/2,1]\), \([1,3/2]\), and \([3/2,2]\). Each rectangle's area is its width, \(1/2\), times the function value at its midpoint.

Choice D and the last equality in the supplied solution printed one fourth-root sign over the entire sum. Fourth roots do not distribute over addition. D has been repaired to the sum of four separate fourth roots, preserving the intended answer and the correct midpoint calculation. This is an approximation, not the exact integral \(e^2-1\).`,
  },
  {
    id: 10379, number: 257, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 24 },
    topic: "Implicit Differentiation", difficulty: 4, methods: ["Determinant", "Implicit Differentiation"],
    question: String.raw`Determine \(\frac{dy}{dx}\) given the following non-invertible matrix:
\[\begin{pmatrix}x&2&y\\3&x^2&-1\\xy&y&1\end{pmatrix}.\]`,
    choices: ["0", String.raw`\(-\frac{y^2-y}{x^3+x}\)`, String.raw`\(\frac{3x^2y^2-3x^2+y}{2x^3y+3x+3y}\)`, String.raw`\(-\frac{3x^2y^2-3x^2+y}{2x^3y+x-6y}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The determinant of the matrix is
\[x(x^2+y)-2(3+xy)+y(3y-x^3y)=0\]
as the matrix is non-invertible, so the determinant must equal \(0\). Rewrite as
\[x^3-6-xy+3y^2-x^3y^2=0,\]
then derive
\[3x^2-y-xy'+6yy'-3x^2y^2-2x^3yy'=0.\]
After some algebra
\[-xy'+6yy'-2x^3yy'=-3x^2+y+3x^2y^2.\]
Then \(y'(-x+6y-2x^3y)=-3x^2+y+3x^2y^2\). Divide through for
\[\frac{dy}{dx}=\frac{-3x^2+y+3x^2y^2}{-x+6y-2x^3y}
=-\frac{3x^2y^2-3x^2+y}{2x^3y+x-6y},\]
choice D.

The determinant expansion uses first-row cofactor signs \(+,-,+\). In differentiating, both \(xy\) and \(x^3y^2\) require the product rule, and powers of \(y\) also require the chain rule. The quotient applies where its denominator is nonzero; at a zero denominator the curve requires a separate tangent analysis.

The source notes that a constant on the right differentiates to zero. Although that is true, a nonzero constant would define a different level curve and would not express the stated non-invertibility. Here the determinant itself must be zero.`,
  },
  {
    id: 10380, number: 258, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 25 },
    topic: "Indefinite Integrals", difficulty: 1, methods: [],
    question: String.raw`Given that \(f'(x)=a\) where \(a\) is some real constant, and \(f(a)=b\), which of the following is the correct expression for \(f(b)\)?`,
    choices: [String.raw`\(b-a^2\)`, String.raw`\(ab-a^2\)`, String.raw`\(ab+b-a^2\)`, String.raw`\(ab\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Integrate the expression to find that \(f(x)=ax+C\) where \(C\) is some constant. Since \(f(a)=b\), \(b=a^2+C\) or \(C=b-a^2\), therefore \(f(x)=ax+b-a^2\). Plugging in \(b\) we have
\[f(b)=ab+b-a^2,\]
choice C.

The condition \(f(a)=b\) fixes the integration constant before we evaluate the function at the different input \(b\). The source's final line mistakenly labels this evaluation \(f(a)\); the input must be \(b\). The result remains valid when \(a=0\): \(f\) is then the constant function \(b\).`,
  },
  {
    id: 10381, number: 259, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 26 },
    topic: "Rate of Change", difficulty: 4, methods: [],
    question: String.raw`The position of a particle moving back and forth on the x-axis over some time \(t\) (with \(t=0\) representing the current time) can be modeled by the equation
\[x(t)=t^4+\frac43t^3-10t^2-20t+1.\]
Over which of the following intervals of time has the particle been slowing down exactly twice as long as it has been speeding up?`,
    choices: [String.raw`\([1,\frac{3\sqrt5-1}{2}]\)`, String.raw`\([-\sqrt5,-1]\)`, String.raw`\([-1,2]\)`, String.raw`\([-\sqrt5,\frac{9\sqrt5-10}{3}]\)`, "NOTA"],
    answer: "A",
    solution: String.raw`By deriving we have the velocity function \(x'(t)=4t^3+4t^2-20t-20\) and again for the acceleration function \(x''(t)=12t^2+8t-20\). Setting the velocity function equal to zero, factoring and utilizing the rational root theorem, we find the critical times \(t=-\sqrt5,-1,\sqrt5\) and factoring the acceleration function, we find critical times \(t=-5/3,1\).

Explicitly,
\[v(t)=4(t+1)(t^2-5),\qquad a(t)=4(3t+5)(t-1).\]
The particle will be slowing down when velocity and acceleration have opposite signs and speeding up when they have the same signs. The sign chart gives slowing on
\[(-\infty,-\sqrt5),\quad(-5/3,-1),\quad(1,\sqrt5),\]
and speeding on
\[(-\sqrt5,-5/3),\quad(-1,1),\quad(\sqrt5,\infty).\]
The finitely many zero-velocity or zero-acceleration instants contribute no duration.

The particle is slowing down over the time \((1,\sqrt5)\) which is a length of time of \(\sqrt5-1\). If we halve that time and add it to the interval, we have
\[\left[1,\sqrt5+\frac{\sqrt5-1}{2}\right]
=\left[1,\frac{3\sqrt5-1}{2}\right],\]
which simplifies to answer choice A as the particle is speeding up when \(t>\sqrt5\).

For completeness, B has slowing duration \(2/3\) and speeding duration \(\sqrt5-5/3\), which do not have ratio \(2\). C has slowing duration \(1\) and speeding duration \(2\), the reverse of what is asked. In D, the right endpoint \(3\sqrt5-10/3\) exceeds \(\sqrt5\). Its slowing duration is \(2/3+\sqrt5-1=\sqrt5-1/3\), while its speeding duration is
\[(\sqrt5-5/3)+2+(2\sqrt5-10/3)=3\sqrt5-3,\]
also not in the requested ratio.

The printed position formula used \(x\) in place of the time variable on the right; those occurrences have been corrected to \(t\), consistently with the source's intended time derivatives.`,
  },
  {
    id: 10382, number: 260, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 27 },
    topic: "Optimization", difficulty: 4, methods: ["Distance Formula", "Tangency"],
    question: String.raw`Captain Matheson is hauling their boat down a perfectly straight country road in order to get the boat as close as possible to the river before putting to sea. The course of the river can be modeled by the curve
\[5y^2+10y=-3x^2+12x-2,\]
while the road can be modeled by the line \(x+2y=6\). What is the x-coordinate of the location on the river that is closest to the road.`,
    choices: [String.raw`\(\frac{174+\sqrt{15945}}{102}\)`, String.raw`\(\frac{696+\sqrt{484418}}{408}\)`, String.raw`\(\frac{348+\sqrt{17}}{102}\)`, String.raw`\(\frac{348+\sqrt{255118}}{102}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Realizing that the river's course is in fact an ellipse helps to simplify this problem. Completing the square, we can put the equation \(5y^2+10y=-3x^2+12x-2\) into the standard form for an ellipse
\[\frac{(x-2)^2}{5}+\frac{(y+1)^2}{3}=1.\]
The point on the ellipse closest to the line will be one of the two points where the line tangent to the ellipse has the same slope as the given line. Deriving the equation of the ellipse we have
\[\frac{2(x-2)}5+\frac{2(y+1)}3y'=0,\qquad
y'=-\frac{3(x-2)}{5(y+1)}.\]
The slope of the road is \(-1/2\), so the tangency condition gives
\[-\frac12=-\frac{3(x-2)}{5(y+1)},\qquad
y+1=\frac65(x-2).\]
Write \(u=x-2\), \(v=y+1\). Substituting \(v=6u/5\) into the ellipse gives
\[\frac{u^2}5+\frac{(6u/5)^2}3=1
\quad\Longrightarrow\quad\frac{17u^2}{25}=1.\]
Thus the two parallel-tangent candidates are
\[(x,y)=\left(2\pm\frac5{\sqrt{17}},-1\pm\frac6{\sqrt{17}}\right),\]
with matching signs.

To determine which is closest and verify a global minimum, the point-to-line distance is \(|x+2y-6|/\sqrt5=|u+2v-6|/\sqrt5\). By Cauchy-Schwarz,
\[|u+2v|
=\left|\frac u{\sqrt5}\sqrt5+\frac v{\sqrt3}(2\sqrt3)\right|
\le\sqrt{\frac{u^2}5+\frac{v^2}3}\sqrt{5+12}
=\sqrt{17}<6.\]
So the ellipse lies strictly on one side of the road, and minimizing distance means maximizing \(u+2v\). Its maximum \(\sqrt{17}\) is attained at \(u=5/\sqrt{17}\), \(v=6/\sqrt{17}\), the plus-sign candidate. Therefore
\[x=2+\frac5{\sqrt{17}}\approx3.212678,\qquad
d_{\min}=\frac{6-\sqrt{17}}{\sqrt5}.\]
None of A-D equals this \(x\)-coordinate, so the corrected answer is E.

The supplied key gives A, but its solution incorrectly changes \(10y+10\) to \(10y+5\) in the implicit derivative, and later changes the original constant \(-2\) to \(-1\). Those errors produce its different quadratic. The valid ellipse/tangency method is retained above with the algebra corrected; the printed river and road equations are unchanged.`,
  },
  {
    id: 10383, number: 261, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 28 },
    topic: "Indefinite Integrals", difficulty: 4, methods: ["U-Substitution", "Trigonometric Substitution"],
    question: String.raw`Evaluate the following indefinite integral: \(\displaystyle\int\frac{\sqrt{1-x}}{\sqrt x}\,dx\).`,
    choices: [String.raw`\(\frac23\sqrt{(1-x)^3}+C\)`, String.raw`\(\arcsin\sqrt x+\sqrt{x-x^2}+C\)`, String.raw`\(\arcsin\sqrt x+\sqrt{\sqrt x-x}+C\)`, String.raw`\(\frac12\arcsin\sqrt x+C\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Use \(u^2=x\) thus \(2u\,du=dx\). Substituting, we have
\[\int\frac{\sqrt{1-u^2}}u\,2u\,du=2\int\sqrt{1-u^2}\,du.\]
Now use \(u=\sin t\) and \(du=\cos t\,dt\). Substituting again we have
\[2\int\sqrt{1-\sin^2t}\cos t\,dt
=2\int\sqrt{\cos^2t}\cos t\,dt
=2\int\cos^2t\,dt\]
\[=\int(1+\cos2t)\,dt
=t+\frac12\sin2t+C=t+\sin t\cos t+C.\]
Since \(u=\sin t\), \(\arcsin u=t\) or \(\arcsin\sqrt x=t\). Substituting for \(t\), we have
\[\arcsin\sqrt x+\sin(\arcsin\sqrt x)\cos(\arcsin\sqrt x)+C\]
\[=\arcsin\sqrt x+\sqrt x\sqrt{1-x}+C
=\arcsin\sqrt x+\sqrt{x-x^2}+C,\]
choice B.

For a real antiderivative on \(0<x<1\), choose \(u=\sqrt x\) and \(t=\arcsin u\in(0,\pi/2)\). Then \(\sqrt{\cos^2t}=|\cos t|=\cos t\), which justifies removing the square root in the trigonometric substitution.

Differentiating the result provides a check:
\[\frac1{2\sqrt x\sqrt{1-x}}
+\frac{1-2x}{2\sqrt{x-x^2}}
=\frac{2-2x}{2\sqrt x\sqrt{1-x}}
=\frac{\sqrt{1-x}}{\sqrt x}.\]`,
  },
  {
    id: 10384, number: 262, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 29 },
    topic: "Series", difficulty: 2, methods: ["Comparison Test"],
    question: String.raw`Determine the following sum, \(\displaystyle\sum_{n=1}^\infty\sqrt[a]{128}\), where \(a=n^2+11n+30\).`,
    choices: [String.raw`\(\frac{\pi^2}{6}\)`, "128", String.raw`\(8\sqrt2\)`, String.raw`\(2\sqrt[6]2\)`, "NOTA"],
    answer: "E",
    solution: String.raw`The printed expression is a sum. Its \(n\)th term is
\[b_n=128^{1/(n^2+11n+30)}
=128^{1/((n+5)(n+6))}.\]
The exponent approaches \(0\), so \(b_n\to128^0=1\), not \(0\). The necessary term condition for convergence fails. More strongly, \(b_n>1\) for every positive integer \(n\); hence the first \(N\) terms sum to more than \(N\), so the series diverges to \(+\infty\). None of A-D is the sum, and the corrected answer is E.

The source's answer D results from incorrectly replacing a sum of powers by a power whose exponent is a sum. The identity
\[\sum_n128^{c_n}=128^{\sum_n c_n}\]
is false. Addition of exponents corresponds to multiplication of powers, not addition.

The source's telescoping calculation does correctly evaluate a different expression, an infinite product. Using partial fractions,
\[\frac1{(n+5)(n+6)}=\frac1{n+5}-\frac1{n+6},\]
so
\[\sum_{n=1}^N\frac1{(n+5)(n+6)}
=\frac16-\frac1{N+6}\longrightarrow\frac16.\]
Consequently the product, not the printed sum, would be
\[\prod_{n=1}^\infty128^{1/((n+5)(n+6))}
=128^{1/6}=2\sqrt[6]2.\]
This explains where the source's D came from while keeping the actual question's sum unchanged.`,
  },
  {
    id: 10385, number: 263, division: "Mu",
    source: { ...chilesStatewide2025, questionNumber: 30 },
    topic: "Indefinite Integrals", difficulty: 4, methods: ["Trigonometric Identities", "U-Substitution"],
    question: String.raw`Evaluate the following indefinite integral:
\[\int\frac{1+2x}{\cos(x^2)\sin x+\sin(x^2)\cos x}\,dx.\]`,
    choices: [String.raw`\(\ln|\sin(x+x^2)|-\ln|\cos(x+x^2)|+C\)`, String.raw`\(2\ln|\sin(x+x^2)|+\ln|\cos(x+x^2)|+C\)`, String.raw`\(\ln|\sin(x+x^2)|-\ln|1+\cos(x+x^2)|+C\)`, String.raw`\(\ln|\cos(x+x^2)|+\ln|\sin(x+x^2)+\cos(x+x^2)|+C\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Use an angle addition identity and rewrite the integral as follows:
\[\int\frac{1+2x}{\sin(x+x^2)}\,dx
=\int(1+2x)\csc(x+x^2)\,dx.\]
Set \(\theta=x+x^2\), so \(d\theta=(1+2x)\,dx\). In order to integrate cosecant, multiply the top and bottom of the expression by \(\csc\theta+\cot\theta\):
\[\int\csc\theta\,d\theta
=\int\frac{\csc^2\theta+\csc\theta\cot\theta}
{\csc\theta+\cot\theta}\,d\theta.\]
Use the substitution \(u=\csc\theta+\cot\theta\) and
\[du=-(\csc\theta\cot\theta+\csc^2\theta)\,d\theta.\]
The numerator is exactly \(-du\), so integrating and substituting back in we have
\[-\int\frac{du}u=-\ln|u|+C
=-\ln|\csc\theta+\cot\theta|+C.\]
Substituting with sine and cosine we get
\[-\ln\left|\frac{1+\cos\theta}{\sin\theta}\right|+C
=\ln|\sin\theta|-\ln|1+\cos\theta|+C.\]
Therefore the answer is
\[\ln|\sin(x+x^2)|-\ln|1+\cos(x+x^2)|+C,\]
choice C.

The source's intermediate multiplication and substitution differential contain incorrect cosecant/cotangent factors; the corrected factors are shown explicitly above. The antiderivative is valid on each interval where the original denominator \(\sin(x+x^2)\ne0\). On such intervals, \(1+\cos(x+x^2)\ne0\) as well, so the logarithms are defined with absolute values. A quick check differentiates \(\ln|\sin\theta|-\ln|1+\cos\theta|\) to \(\cot\theta+\sin\theta/(1+\cos\theta)=\csc\theta\), then multiplies by \(1+2x\).`,
  },
  // January Regional 2025: all 30 retained, with original source answer letters.
  {
    id: 10386, number: 264, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 1 },
    topic: "Derivatives", difficulty: 1, methods: [],
    question: String.raw`What is the derivative of the function \(f(x)=7x^5\) with respect to \(x\)?`,
    choices: [String.raw`\(28x^4\)`, String.raw`\(35x^4\)`, String.raw`\(\frac{7x^6}{6}\)`, String.raw`\(\frac{7x^6}{5}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`When using the power rule of differentiation on a monomial, multiply by the original exponent, then reduce the exponent by \(1\). So, the derivative of \(f(x)=7x^5\) is
\[f'(x)=5(7x^{5-1})=35x^4.\]
The constant coefficient \(7\) remains as a multiplier, while the exponent \(5\) supplies a second multiplier. The new exponent is \(4\), not \(6\); increasing the exponent would be part of finding an antiderivative instead. Thus the answer is B.`,
  },
  {
    id: 10387, number: 265, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 2 },
    topic: "Derivatives", difficulty: 1, methods: ["Chain Rule"],
    question: String.raw`If \(f(x)=\sin(4x+3)\), then which function represents \(f'(x)\)?`,
    choices: [String.raw`\(-4\cos(4x+3)\)`, String.raw`\(\cos(4x+3)\)`, String.raw`\(3\cos(4x+3)\)`, String.raw`\(4\cos(4x+3)\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Using the chain rule and the fact that the derivative of sine is cosine, we have
\[f'(x)=\frac d{dx}[\sin(4x+3)]
=\cos(4x+3)\frac d{dx}(4x+3)
=4\cos(4x+3).\]
The outer function is sine and the inner function is \(4x+3\). Its inner derivative is \(4\); the constant \(3\) differentiates to zero. All angles here are in radians, as stipulated by the original test. The answer is D.`,
  },
  {
    id: 10388, number: 266, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 3 },
    topic: "Limits", difficulty: 1, methods: [],
    question: String.raw`What is the value, if any, of \(\displaystyle\lim_{x\to\infty}\frac{3x+7}{x}\)?`,
    choices: ["3", "7", "10", String.raw`\(\infty\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Separating into two rational expressions, simplifying, and then evaluating the limit yields
\[\lim_{x\to\infty}\frac{3x+7}{x}
=\lim_{x\to\infty}\left(\frac{3x}x+\frac7x\right)
=\lim_{x\to\infty}\left(3+\frac7x\right)=3+0=3.\]
For large positive \(x\), the denominator grows without bound while the numerator of \(7/x\) stays fixed, so \(7/x\to0\). The nonvanishing term is the constant \(3\). The answer is A, not infinity merely because the original numerator and denominator both grow.`,
  },
  {
    id: 10389, number: 267, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 4 },
    topic: "Indefinite Integrals", difficulty: 1, methods: [],
    question: String.raw`What is the general antiderivative of the function \(5\sin x+5\)?`,
    choices: [String.raw`\(5\cos x+C\)`, String.raw`\(-5\cos x+C\)`, String.raw`\(5\cos x+5x+C\)`, String.raw`\(-5\cos x+5x+C\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Observe that \(5\sin x+5=-5(-\sin x)+5x^0\). Using the fact that the derivative of cosine is negative sine, the fact that the derivative of a function is zero if and only if the function is constant on an interval, and the reverse of the power rule for differentiation, we conclude that the general antiderivative of \(5\sin x+5\) is
\[-5\cos x+\frac{5x^1}{1}+C=-5\cos x+5x+C.\]
To verify both terms, differentiate: \((-5\cos x)'=5\sin x\), \((5x)'=5\), and \(C'=0\). The arbitrary real constant \(C\) accounts for every antiderivative on the real line. The answer is D.`,
  },
  {
    id: 10390, number: 268, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 5 },
    topic: "Derivatives", difficulty: 1, methods: ["Logarithms"],
    question: String.raw`If \(f(x)=\ln(e^{6-x})\), then which function or constant represents \(f'(x)\)?`,
    choices: [String.raw`\(e^{x-6}\)`, "1", "-1", String.raw`\(6-x\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Because the natural logarithm function undoes exponentiation using base \(e\), we have
\[f'(x)=\frac d{dx}[\ln(e^{6-x})]
=\frac d{dx}(6-x)=-1.\]
This simplification is valid for every real \(x\) because \(e^{6-x}>0\). Equivalently, direct chain-rule differentiation gives
\[\frac1{e^{6-x}}\cdot e^{6-x}\cdot(-1)=-1.\]
The expression \(6-x\) is the simplified function itself, not its derivative. Thus C is correct.`,
  },
  {
    id: 10391, number: 269, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 6 },
    topic: "Derivatives", difficulty: 2, methods: [],
    question: String.raw`If the slope of the normal line to the graph of \(f(x)=x^4\) at \(x=a\) is \(12\), then what is the value of \(a\)?`,
    choices: [String.raw`\(-\sqrt[3]3\)`, String.raw`\(-\frac{\sqrt[3]6}{6}\)`, String.raw`\(\frac{\sqrt[3]{36}}{12}\)`, String.raw`\(\sqrt[3]3\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Since \(f(x)=x^4\), it follows from the power rule that \(f'(a)=4a^3\). Since the slope of the normal line at \(x=a\) is \(12\), the slope of the tangent line there is \(f'(a)=-1/12\). Therefore, we have \(4a^3=-1/12\) which yields
\[a=\sqrt[3]{-\frac1{12\cdot4}}
=-\frac{\sqrt[3]{36}}{12}.\]
The tangent and normal lines are perpendicular, so their finite slopes multiply to \(-1\). The normal slope is nonzero, making the negative reciprocal legitimate. To check the radical simplification,
\[\left(-\frac{\sqrt[3]{36}}{12}\right)^3
=-\frac{36}{1728}=-\frac1{48}.\]
Choice C has the correct magnitude but the wrong sign; neither A nor B has the required cube. Thus the value is not listed and E is correct.`,
  },
  {
    id: 10392, number: 270, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 7 },
    topic: "Limits", difficulty: 1, methods: [],
    question: String.raw`What is the value, if any, of
\[\lim_{x\to-\infty}\frac{4x^3+3x^2-7x-20}{6x^3-8x^2+5x-12}?\]`,
    choices: [String.raw`\(-\infty\)`, String.raw`\(\frac23\)`, String.raw`\(\frac53\)`, "DNE", "NOTA"],
    answer: "B",
    solution: String.raw`The limit to \(\infty\) or to \(-\infty\) of any rational expression in one variable is determined completely by the highest degree term in the numerator and the highest degree term in the denominator; the lower-degree terms have no effect on the value of the limit. Therefore,
\[\lim_{x\to-\infty}\frac{4x^3+3x^2-7x-20}{6x^3-8x^2+5x-12}
=\lim_{x\to-\infty}\frac{4x^3}{6x^3}=\frac46=\frac23.\]
More explicitly, divide numerator and denominator by \(x^3\):
\[\frac{4+3/x-7/x^2-20/x^3}{6-8/x+5/x^2-12/x^3}
\longrightarrow\frac46.\]
Every reciprocal power tends to zero, even as \(x\) tends to negative infinity. The denominator tends to \(6\ne0\), so the quotient limit is valid. The answer is B.`,
  },
  {
    id: 10393, number: 271, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 8 },
    topic: "Derivatives", difficulty: 1, methods: [],
    question: String.raw`In slope-intercept form, what is the equation of the line tangent to the graph of \(y=\frac{80}{x^3}\) at \(x=2\)?`,
    choices: [String.raw`\(y=-15x+40\)`, String.raw`\(y=-15x-40\)`, String.raw`\(y=-20x+50\)`, String.raw`\(y=-20x-50\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The graph of \(y=80/x^3\) passes through the point \((2,80/2^3)=(2,10)\), so the same is true for the line tangent to this graph at \(x=2\). Furthermore, \(y=80/x^3=80x^{-3}\) which yields
\[\frac{dy}{dx}=-3(80x^{-4})=-\frac{240}{x^4}\]
from the power rule. So, the slope of the line tangent to the graph of \(y=80/x^3\) at \(x=2\) is \(-240/2^4=-15\). Therefore, from point-slope, the equation of this line is \(y-10=-15(x-2)\) or equivalently \(y=-15x+40\).

The intercept is \(40\), because expanding gives \(y-10=-15x+30\). Both the slope and the intercept therefore match A.`,
  },
  {
    id: 10394, number: 272, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 9 },
    topic: "Derivatives", difficulty: 1, methods: [],
    question: String.raw`What is the derivative of the function \(f(x)=18x\sqrt[3]x\)?`,
    choices: [String.raw`\(\frac{6\sqrt[3]x}{x}\)`, String.raw`\(6\sqrt[3]x\)`, String.raw`\(24\sqrt[3]x\)`, String.raw`\(24x\sqrt[3]x\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Observe that \(f(x)=18x\sqrt[3]x=18x\cdot x^{1/3}=18x^{4/3}\). Therefore, from the power rule, the derivative of \(f(x)\) is
\[f'(x)=\frac43(18x^{4/3-1})=24x^{1/3}=24\sqrt[3]x.\]
The fractional powers here use the real cube root, so the expression also makes sense for negative \(x\). The usual power calculation applies for \(x\ne0\). To verify the value at the potentially delicate point \(0\), use the derivative definition:
\[f'(0)=\lim_{h\to0}\frac{18h\sqrt[3]h-0}{h}
=\lim_{h\to0}18\sqrt[3]h=0.\]
This agrees with \(24\sqrt[3]0=0\), so C is valid for all real \(x\).`,
  },
  {
    id: 10395, number: 273, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 10 },
    topic: "Definite Integrals", difficulty: 2, methods: ["Reverse Power Rule"],
    question: String.raw`Let \(a\) represent a positive constant such that the area of the region bounded by the \(x\)-axis, the \(y\)-axis, the line \(x=1\), and the curve \(y=x^a\) is equal to \(\frac57\). What is the area of the region bounded by the \(x\)-axis, the \(y\)-axis, the line \(x=1\), and the curve \(y=x^{2a}\)?`,
    choices: [String.raw`\(\frac5{14}\)`, String.raw`\(\frac25\)`, String.raw`\(\frac{25}{49}\)`, String.raw`\(\frac59\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Since \(a\) is positive, the area of the region bounded by the \(x\)-axis, the \(y\)-axis, the line \(x=1\), and the curve \(y=x^a\) is equal to
\[\int_0^1x^a\,dx=\left[\frac{x^{a+1}}{a+1}\right]_0^1
=\frac1{a+1}-0=\frac1{a+1},\]
from using the reverse of the power rule and using the Fundamental Theorem of Calculus. Since this area is \(5/7\), we have \(1/(a+1)=5/7\) which yields \(a=2/5\). Therefore, the area of the region bounded by the \(x\)-axis, the \(y\)-axis, the line \(x=1\), and the curve \(y=x^{2a}\) is equal to
\[\int_0^1x^{2a}\,dx
=\left[\frac{x^{2a+1}}{2a+1}\right]_0^1
=\frac1{2a+1}
=\frac1{2(2/5)+1}=\frac59,\]
again from using the reverse of the power rule and using the Fundamental Theorem of Calculus.

Both curves are nonnegative on \([0,1]\), so these integrals equal their geometric areas. Doubling an exponent does not square or halve an integral; the denominator changes from \(a+1\) to \(2a+1\). The answer is D.`,
  },
  {
    id: 10396, number: 274, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 11 },
    topic: "Rate of Change", difficulty: 1, methods: ["Chain Rule"],
    question: String.raw`The position of a particle at time \(t\) is given by the function \(s(t)=\sqrt{3t+1}\), for \(t\ge0\). What is the particle's instantaneous velocity when its position is \(5\)?`,
    choices: [String.raw`\(\frac1{10}\)`, String.raw`\(\frac18\)`, String.raw`\(\frac3{10}\)`, String.raw`\(\frac38\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Observe that the position function is \(s(t)=\sqrt{3t+1}=(3t+1)^{1/2}\). Since the instantaneous velocity function is the derivative of the position function, it follows from the power and chain rules that the instantaneous velocity function is
\[s'(t)=\frac12(3t+1)^{1/2-1}\frac d{dt}(3t+1)
=\frac32(3t+1)^{-1/2}
=\frac3{2\sqrt{3t+1}}=\frac3{2s(t)}.\]
Therefore, when the position is \(5\), the instantaneous velocity is \(3/(2\cdot5)=3/10\).

The condition is position \(5\), not time \(5\). If desired, solve \(\sqrt{3t+1}=5\) to obtain \(t=8\ge0\), and substituting \(8\) into \(s'\) gives the same result. The answer is C.`,
  },
  {
    id: 10397, number: 275, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 12 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule", "Double-Angle Identity"],
    question: String.raw`If \(f(x)=\sin^2(x^\circ)\), then which function represents \(f'(x)\)?`,
    choices: [String.raw`\(\sin(2x^\circ)\)`, String.raw`\(2\sin(x^\circ)\)`, String.raw`\(\frac\pi{90}\sin(x^\circ)\)`, String.raw`\(\frac{180}\pi\sin(2x^\circ)\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Using the degrees to radians conversion, the fact that the derivative of sine is cosine, the power rule, two applications of the chain rule, and the double angle identity for sine, we have
\[f(x)=\sin^2\left(\frac{\pi x}{180}\right),\]
where the rewritten input is measured in radians. Thus
\[f'(x)=2\sin\left(\frac{\pi x}{180}\right)
\cos\left(\frac{\pi x}{180}\right)\frac\pi{180}\]
\[=\frac\pi{180}\sin\left(\frac{2\pi x}{180}\right)
=\frac\pi{180}\sin(2x^\circ).\]
The identity \(2\sin u\cos u=\sin(2u)\) combines the trigonometric factors, but it does not remove the degree-conversion factor \(\pi/180\). None of A-D equals this function: D has the conversion factor upside down, and C has both a different factor and a different argument. The answer is E.`,
  },
  {
    id: 10398, number: 276, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 13 },
    topic: "Limits", difficulty: 2, methods: [],
    question: String.raw`For any two functions \(p(x)\) and \(q(x)\) that are positive for sufficiently large positive values of \(x\), define the inequality \(p(x)\ll q(x)\) as \(\lim_{x\to\infty}\frac{p(x)}{q(x)}=0\). Define the three functions
\[f(x)=x^{2025},\qquad g(x)=\left(\frac{2025}{2024}\right)^x,\qquad
h(x)=\sum_{k=0}^{2024}(k+1)x^k.\]
Which inequality correctly compares these functions for sufficiently large positive values of \(x\)?`,
    choices: [String.raw`\(f(x)\ll g(x)\ll h(x)\)`, String.raw`\(f(x)\ll h(x)\ll g(x)\)`, String.raw`\(g(x)\ll f(x)\ll h(x)\)`, String.raw`\(g(x)\ll h(x)\ll f(x)\)`, "NOTA"],
    answer: "E",
    solution: String.raw`In the long run, exponential growth dominates polynomial growth, and polynomials with larger degrees dominate polynomials with smaller degrees. Since \(f(x)\) is a polynomial growth function with degree \(2025\), \(g(x)\) is an exponential growth function, and \(h(x)\) is a polynomial growth function with degree \(2024\). Therefore, \(h(x)\ll f(x)\ll g(x)\).

To check the first comparison, \(h\)'s leading term is \(2025x^{2024}\). Dividing by \(x^{2025}\), every term tends to zero; in particular the leading ratio is \(2025/x\to0\). For the second comparison, put \(c=\ln(2025/2024)>0\). Then
\[\ln\left(\frac{f(x)}{g(x)}\right)=2025\ln x-cx
=x\left(2025\frac{\ln x}{x}-c\right)\longrightarrow-\infty,\]
because \(\ln x/x\to0\). Exponentiating gives \(f(x)/g(x)\to0\).

The exponential base is only slightly greater than \(1\), so it may take very large \(x\) to dominate, but the limiting order is unchanged. The correct order is absent from A-D, giving E.`,
  },
  {
    id: 10399, number: 277, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 14 },
    topic: "Derivatives", difficulty: 2, methods: ["Power Rule"],
    question: String.raw`Let \(k\) and \(n\) represent positive integer constants such that \(k<n\). Which function represents the \(k\)th derivative of the function \(x^n\), with respect to \(x\)?`,
    choices: [String.raw`\(\frac{n!}{(n-k)!}x^{n-k}\)`, String.raw`\(\frac{(n-1)!}{(n-k-1)!}x^{n-k}\)`, String.raw`\(n^kx^{n-k}\)`, String.raw`\(\frac{n!}{(n-k)!}x^{n-k+1}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`We use \(k\) applications of the power rule. In each application, we first multiply by the current exponent on \(x\), and then reduce this exponent by \(1\). So, the \(k\)th derivative of \(x^n\), with respect to \(x\), is
\[n(n-1)(n-2)\cdots(n-k+1)x^{n-k}
=\frac{n!}{(n-k)!}x^{n-k}.\]
The coefficient contains exactly \(k\) factors: it begins at \(n\) and ends at \(n-k+1\). Multiplying and dividing by \((n-k)!\) identifies this product as the factorial quotient. For example, \(k=2\) gives \(n(n-1)x^{n-2}\), not \(n^2x^{n-2}\).

Since \(k<n\), the factorial arguments in the choices are nonnegative integers. A has both the correct coefficient and the correct remaining exponent; B starts its coefficient one integer too low, C incorrectly uses the same multiplier repeatedly, and D reduces the exponent one too few times.`,
  },
  {
    id: 10400, number: 278, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 15 },
    topic: "Rate of Change", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`A particle's position at time \(t\) is given by the function \(s(t)=3^{2t}\). What is its instantaneous acceleration at time \(t=1\)?`,
    choices: [String.raw`\(36(\ln3)^2\)`, "36", String.raw`\(18\ln3\)`, String.raw`\(9(\ln3)^2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The instantaneous velocity is the derivative of the position, and the instantaneous acceleration is the derivative of the instantaneous velocity. Using the fact that the derivative of an exponential function is this function times the natural logarithm of the base, and the chain rule, we find that the instantaneous velocity is
\[s'(t)=\frac d{dt}(3^{2t})
=3^{2t}\ln3\frac d{dt}(2t)=2\cdot3^{2t}\ln3,\]
and the instantaneous acceleration is
\[s''(t)=\frac d{dt}(2\cdot3^{2t}\ln3)
=2\cdot3^{2t}\ln3\cdot\ln3\cdot2
=4\cdot3^{2t}(\ln3)^2.\]
Therefore, the instantaneous acceleration at time \(1\) is
\[s''(1)=4\cdot3^{2(1)}(\ln3)^2=36(\ln3)^2.\]
Each differentiation contributes a factor \(2\ln3\). It is important to differentiate twice before setting \(t=1\), since substituting first would leave a constant rather than a position function. The answer is A.`,
  },
  {
    id: 10401, number: 279, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 16 },
    topic: "Inverse Functions", difficulty: 2, methods: ["Derivative of Inverse Functions"],
    question: String.raw`If \(f(x)=\frac{x^5+x^3}{4}\) and \(g(x)=f^{-1}(x)\), then what is the value of \(g'(10)\)?`,
    choices: [String.raw`\(\frac1{23}\)`, String.raw`\(\frac1{12575}\)`, String.raw`\(-\frac1{12575}\)`, String.raw`\(-\frac1{23}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Note that \(f(x)=(x^5+x^3)/4\) is indeed invertible since this function is strictly increasing (which follows from the fact that \(x^5\) and \(x^3\) are strictly increasing, the fact that the sum of two strictly increasing functions is strictly increasing, and the fact that a strictly increasing function divided by a positive constant is strictly increasing).

Let \(y=g(x)=f^{-1}(x)\), so \(x=f(y)\). Implicitly differentiating with respect to \(x\) gives \(1=f'(y)\frac{dy}{dx}\) which gives
\[g'(x)=\frac1{f'(y)}=\frac1{f'(f^{-1}(x))}\]
where the denominator is nonzero. By inspection, \(f(2)=(2^5+2^3)/4=10\), so \(f^{-1}(10)=2\). From the power rule, \(f'(x)=(5x^4+3x^2)/4\). Therefore,
\[g'(10)=\frac1{f'(2)}=\frac4{5(2^4)+3(2^2)}=\frac1{23}.\]
Here \(f'(2)=23\ne0\), justifying the inverse derivative formula at the requested point. The inverse is defined on all real numbers because this continuous strictly increasing polynomial also tends to opposite infinities at the two ends. The inverse derivative need not exist at every input; only its behavior at \(10\) is being used. The answer is A.`,
  },
  {
    id: 10402, number: 280, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 17 },
    topic: "Limits", difficulty: 2, methods: ["Asymptotes"],
    question: String.raw`Which list below precisely shows the \(y\)-coordinate(s) of the horizontal asymptote(s) of the graph of the function
\[f(x)=\frac{16e^{7x}+20e^{6x}}{8e^{7x}+4e^{6x}}?\]`,
    choices: ["2", "2, 3", "3", "2, 5", "NOTA"],
    answer: "D",
    solution: String.raw`The \(y\)-coordinates of the horizontal asymptotes are precisely
\[\lim_{x\to\infty}f(x)
=\lim_{x\to\infty}\frac{16+20e^{-x}}{8+4e^{-x}}
=\frac{16+0}{8+0}=2\]
and
\[\lim_{x\to-\infty}f(x)
=\lim_{x\to-\infty}\frac{16e^x+20}{8e^x+4}
=\frac{0+20}{0+4}=5.\]
For the first limit, divide numerator and denominator by \(e^{7x}\). For the second, divide by \(e^{6x}\). Both exponentials are positive for every real \(x\), so these simplifications do not change the function or introduce denominator zeros.

As \(x\to+\infty\), the \(e^{7x}\) terms dominate. As \(x\to-\infty\), \(e^{7x}\) decays faster than \(e^{6x}\), so the latter terms determine the ratio. Both ends must be checked; the asymptotes are \(y=2\) and \(y=5\), giving D.`,
  },
  {
    id: 10403, number: 281, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 18 },
    topic: "Implicit Differentiation", difficulty: 2, methods: ["Implicit Differentiation"],
    question: String.raw`What is the slope of the line normal to the curve \(3^x+2^y=17\), at the point \((2,3)\) on this curve?`,
    choices: [String.raw`\(\frac89\)`, String.raw`\(\frac{8\ln2}{9\ln3}\)`, String.raw`\(-\frac98\)`, String.raw`\(\frac{9\ln3}{8\ln2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using the fact that the derivative of an exponential function is this function times the natural logarithm of the base, and the chain rule, we implicitly differentiate both sides of the equation \(3^x+2^y=17\) with respect to \(x\):
\[3^x\ln3+2^y\ln2\,\frac{dy}{dx}=0,\qquad
\frac{dy}{dx}=-\frac{3^x\ln3}{2^y\ln2}.\]
At the point \((2,3)\), the slope of the tangent line is \(-9\ln3/(8\ln2)\). Therefore, at this point, the slope of the normal line is
\[-\frac1{-9\ln3/(8\ln2)}=\frac{8\ln2}{9\ln3}.\]
The point really is on the curve because \(3^2+2^3=9+8=17\). Both logarithms are positive and nonzero, so the tangent slope is finite and nonzero, and taking its negative reciprocal is valid. The answer is B.`,
  },
  {
    id: 10404, number: 282, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 19 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule", "Product Rule"],
    question: String.raw`If \(f(x)=\arctan(x^2e^x)\), where the arctan function has its usual restricted range, then which function below represents \(f'(x)\)?`,
    choices: [String.raw`\(\frac1{1+x^4e^{2x}}\)`, String.raw`\(\frac{2xe^x}{1+x^4e^{2x}}\)`, String.raw`\(\frac{x(x+2)e^x}{\sqrt{1-x^4e^{2x}}}\)`, String.raw`\(\frac{x(x+2)e^x}{1+x^4e^{2x}}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`From the derivative of the arctangent function, the derivative of the exponential function, the power rule, the chain rule, and the product rule, we have
\[f'(x)=\frac d{dx}[\arctan(x^2e^x)]
=\frac1{1+(x^2e^x)^2}\frac d{dx}(x^2e^x)\]
\[=\frac{x^2\frac d{dx}(e^x)+e^x\frac d{dx}(x^2)}
{1+(x^2e^x)^2}
=\frac{x^2e^x+2xe^x}{1+x^4e^{2x}}
=\frac{x(x+2)e^x}{1+x^4e^{2x}}.\]
The usual arctangent has range \((-\pi/2,\pi/2)\) and derivative \(1/(1+u^2)\). Its denominator has a plus sign and no square root; that distinguishes it from an arcsine derivative. The product inside it requires both numerator terms, not just \(2xe^x\). The denominator is strictly positive for all real \(x\), and the correct answer is D.`,
  },
  {
    id: 10405, number: 283, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 20 },
    topic: "Function Analysis", difficulty: 3, methods: [],
    question: String.raw`What is the smallest possible constant positive integer value of \(n\), such that the graph of the function \(f(x)=x^{n+1}-x^n\) has a point of inflection at \(x=0\)?`,
    choices: ["1", "2", "3", "5", "NOTA"],
    answer: "C",
    solution: String.raw`For this polynomial, an inflection point occurs where concavity changes; we can detect this by a sign change of its second derivative. From the power rule, we have
\[f'(x)=(n+1)x^n-nx^{n-1},\]
and, for \(n\ge2\),
\[f''(x)=n(n+1)x^{n-1}-n(n-1)x^{n-2}
=nx^{n-2}[(n+1)x-(n-1)].\]
For \(n=1\), \(f''(x)=2\), which never changes sign.

For \(n\ge2\), the factor \((n+1)x-(n-1)\) is negative both just to the left and just to the right of \(x=0\), \(nx^{n-2}\) is positive just to the right of \(x=0\), and \(nx^{n-2}\) is positive for even \(n\) and negative for odd \(n\), just to the left of \(x=0\). So \(f''(x)\) changes sign for odd \(n\) but not for even \(n\), at \(x=0\).

Therefore, the smallest possible constant positive integer value of \(n\), such that the graph of \(f(x)=x^{n+1}-x^n\) has a point of inflection at \(x=0\), is \(3\).

For an explicit check of the smallest candidates, \(n=2\) gives \(f''(x)=6x-2\), negative on both sides near zero, while \(n=3\) gives \(f''(x)=12x^2-6x=6x(2x-1)\), positive immediately to the left of zero and negative immediately to the right. Thus \(n=3\) genuinely changes concavity, not merely makes \(f''(0)=0\). The opening criterion is stated specifically for this polynomial; a general differentiable function need not possess a second derivative. The answer is C.`,
  },
  {
    id: 10406, number: 284, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 21 },
    topic: "Derivatives", difficulty: 2, methods: ["Product Rule", "Chain Rule"],
    question: String.raw`Define differentiable functions \(f(x)\), \(g(x)\), and \(h(x)\) such that \(f(0)=4\), \(g(0)=5\), \(h(0)=6\), \(f'(0)=1\), \(g'(0)=2\), and \(h'(0)=3\). Define the function \(j(x)=[f(x)g(x)h(x)]^2\). What is the value of \(j'(0)\)?`,
    choices: ["240", "1,440", "12,240", "33,120", "NOTA"],
    answer: "D",
    solution: String.raw`From the power rule, the chain rule, and two applications of the product rule, we have
\[j'(x)=2f(x)g(x)h(x)\frac d{dx}[f(x)g(x)h(x)].\]
Apply the product rule first to \(f(gh)\) and then to \(gh\):
\[\frac d{dx}[fgh]=f'gh+f(g'h+gh')=f'gh+fg'h+fgh'.\]
Therefore, from the given information, we have
\[j'(0)=2f(0)g(0)h(0)\bigl[f'(0)g(0)h(0)
+f(0)g'(0)h(0)+f(0)g(0)h'(0)\bigr]\]
\[=2(4)(5)(6)[(1)(5)(6)+(4)(2)(6)+(4)(5)(3)]
=240(30+48+60)=33120.\]
Each term inside the brackets differentiates exactly one of the three factors while keeping the other two unchanged. The outside factor \(2fgh\) is also essential because \(j\) is the square of that product, not the product itself. Thus D is correct.`,
  },
  {
    id: 10407, number: 285, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 22 },
    topic: "Limits", difficulty: 2, methods: ["Limit Definition of Derivatives", "Quotient Rule"],
    question: String.raw`What is the value, if any, of
\[\lim_{h\to0}\left\{\frac1h\left[\frac{(2+h)^3}{(2+h)^2-8}+2\right]\right\}?\]`,
    choices: ["-5", "-3", "3", "5", "NOTA"],
    answer: "A",
    solution: String.raw`We first write the given limit in the form of the definition of a derivative, express this limit as a derivative, then use the power and quotient rules to perform the differentiation.

Let \(F(x)=x^3/(x^2-8)\). Since \(F(2)=2^3/(2^2-8)=-2\), the original limit is
\[\lim_{h\to0}\frac{F(2+h)-F(2)}h=F'(2).\]
The \(+2\) is precisely the subtraction of \(F(2)=-2\). Now
\[F'(x)=\frac{(x^2-8)(3x^2)-x^3(2x)}{(x^2-8)^2}
=\frac{x^4-24x^2}{(x^2-8)^2}.\]
Thus
\[F'(2)=\frac{16-96}{(4-8)^2}=\frac{-80}{16}=-5.\]
The denominator of \(F\) at \(2\) is \(-4\ne0\), so \(F\) is differentiable in a neighborhood of \(2\) and its difference quotient has this limit. The answer is A.`,
  },
  {
    id: 10408, number: 286, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 23 },
    topic: "Implicit Differentiation", difficulty: 3, methods: ["Implicit Differentiation"],
    question: String.raw`If the equation \(\sqrt[3]x+4xy+2\sqrt[3]y=7\) defines \(y\) implicitly as a function of \(x\), then which expression below represents \(\frac{dy}{dx}\)? Assume \(x\ne0\) and \(y\ne0\), at points where the implicit derivative is finite.`,
    choices: [String.raw`\(-\frac{y\sqrt[3]x+12xy^2}{12x^2y+2x\sqrt[3]y}\)`, String.raw`\(-\frac{y\sqrt[3]x+12xy^2+2x\sqrt[3]y}{12x^2y}\)`, String.raw`\(-\frac{y\sqrt[3]x}{12x^2y+2x\sqrt[3]y}\)`, String.raw`\(-\frac{y\sqrt[3]x+12xy^2}{2x\sqrt[3]y}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Using the power, product, and chain rules (keeping in mind that \(\sqrt[3]x=x^{1/3}\), and \(y\) is viewed implicitly as a function of \(x\)), we implicitly differentiate both sides of \(\sqrt[3]x+4xy+2\sqrt[3]y=7\) with respect to \(x\):
\[\frac13\frac{\sqrt[3]x}{x}+4xy'+4y
+\frac23\frac{\sqrt[3]y}{y}y'=0.\]
The product \(4xy\) contributes \(4xy'+4y\); the cube root of \(y\) contributes a factor \(y'\) by the chain rule. Multiplying the whole equation by \(3xy\) clears the fractional coefficients and denominators:
\[y\sqrt[3]x+12x^2yy'+12xy^2+2x\sqrt[3]y\,y'=0.\]
Collect the \(y'\) terms and move the others to the right:
\[(12x^2y+2x\sqrt[3]y)y'=-y\sqrt[3]x-12xy^2.\]
Therefore,
\[\frac{dy}{dx}=-\frac{y\sqrt[3]x+12xy^2}{12x^2y+2x\sqrt[3]y},\]
which is A.

The displayed rational formula requires \(x,y\ne0\) and a nonzero denominator; the question now makes its intended nonsingular setting explicit. This matters because cube-root differentiation is singular at zero, and multiplication by \(xy\) can conceal exceptional points. For example, the original curve contains \((343,0)\), where A is \(0/0\), but the curve still has a horizontal tangent: writing \(y=v^3\) gives \(\sqrt[3]x+4xv^3+2v=7\), which has a smooth local solution \(v(x)\) there and \(y'=3v^2v'=0\). Such points need separate analysis rather than literal evaluation of A. No answer letter changes.`,
  },
  {
    id: 10409, number: 287, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 24 },
    topic: "Derivatives", difficulty: 3, methods: ["Product Rule"],
    question: String.raw`Let \(f(x)\) and \(g(x)\) represent thrice-differentiable functions with \(f(0)=1\), \(g(0)=2\), \(f'(0)=3\), \(g'(0)=4\), \(f''(0)=5\), \(g''(0)=6\), \(f'''(0)=10\), and \(g'''(0)=25\). Assume that these functions and their first three derivatives have a domain of all real numbers. Define \(h(x)=f(x)g(x)\). What is the value of \(h'''(0)\)?`,
    choices: ["45", "83", "159", "250", "NOTA"],
    answer: "C",
    solution: String.raw`From repeatedly using the product rule, we have
\[h'(x)=\frac d{dx}[f(x)g(x)]=f(x)g'(x)+f'(x)g(x),\]
\[h''(x)=f(x)g''(x)+f'(x)g'(x)+f'(x)g'(x)+f''(x)g(x)\]
\[=f(x)g''(x)+2f'(x)g'(x)+f''(x)g(x),\]
and
\[h'''(x)=f(x)g'''(x)+f'(x)g''(x)
+2f'(x)g''(x)+2f''(x)g'(x)
+f''(x)g'(x)+f'''(x)g(x)\]
\[=f(x)g'''(x)+3f'(x)g''(x)+3f''(x)g'(x)+f'''(x)g(x).\]
Therefore, from the given information,
\[h'''(0)=f(0)g'''(0)+3f'(0)g''(0)+3f''(0)g'(0)+f'''(0)g(0)\]
\[=1\cdot25+3\cdot3\cdot6+3\cdot5\cdot4+10\cdot2
=25+54+60+20=159.\]
The coefficients \(1,3,3,1\) arise because the mixed-derivative terms repeat during successive product-rule applications. Differentiating a product three times is not just multiplying the third derivatives. The answer is C.`,
  },
  {
    id: 10410, number: 288, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 25 },
    topic: "Probability", difficulty: 3, methods: [],
    question: String.raw`A machine has three parts, each of which has a continuously distributed lifetime of 3 years or less. For any given part, the probability that this part fails within \(T\) years from now is given by the expression
\[\int_0^T\frac1{84}(2t+2)^2\,dt,\]
where \(T\) is a constant such that \(0\le T\le3\). The parts are neither repaired nor replaced, and the lifetimes of the parts are independent. The machine fails as soon as at least two of the three parts fail. What is the probability that the machine fails within 1 year from now?`,
    choices: [String.raw`\(\frac8{243}\)`, String.raw`\(\frac{25}{729}\)`, String.raw`\(\frac{28}{243}\)`, String.raw`\(\frac{92}{729}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using the reverse power rule and the reverse chain rule, we find that the probability that any given part fails within \(1\) year from now is
\[p=\int_0^1\frac1{84}(2t+2)^2\,dt
=\left[\frac{(2t+2)^3}{84\cdot3\cdot2}\right]_0^1
=\frac{4^3-2^3}{84\cdot3\cdot2}=\frac19.\]
Since the machine fails as soon as two parts fail, the probability that the machine fails within \(1\) year from now equals the probability that at least two of the three parts fail within a year from now. Therefore, since the lifetimes of the parts are independent, the probability that the machine fails within \(1\) year from now is
\[\binom32\left(\frac19\right)^2\left(\frac89\right)
+\binom33\left(\frac19\right)^3
=3\left(\frac8{729}\right)+\frac1{729}
=\frac{25}{729}.\]
The first term counts exactly two failed parts: choose which two in \(3\) ways, multiply their failure probabilities, and multiply by the remaining part's survival probability. The second term counts all three failing. These events are disjoint, so add them. Repairs and replacements are excluded, which makes failure by the deadline equivalent to at least two individual lifetimes being at most \(1\).

As a normalization check, the same integral to \(T=3\) is \((8^3-2^3)/504=1\), consistent with the stated maximum lifetime. The answer is B.`,
  },
  {
    id: 10411, number: 289, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 26 },
    topic: "Rate of Change", difficulty: 2, methods: ["Related Rates"],
    question: String.raw`Consider the graph of the changing ellipse
\[\frac{x^2}{(b+1)^2}+\frac{y^2}{b^2}=1,\]
where \(b\) is positive and changing with time \(t\). Let \(c\) represent the \(x\)-coordinate of the ellipse's focus that lies on the positive \(x\)-axis. At a particular moment, \(b=4\) and \(\frac{db}{dt}=2.5\). At that moment, what is the value of \(\frac{dc}{dt}\)?`,
    choices: [String.raw`\(\frac13\)`, String.raw`\(\frac56\)`, String.raw`\(\frac{9\sqrt{41}}{41}\)`, String.raw`\(\frac{45\sqrt{41}}{82}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Since \(b\) is positive, the ellipse \(x^2/(b+1)^2+y^2/b^2=1\) has one focus on the positive \(x\)-axis, which has \(x\)-coordinate
\[c=\sqrt{(b+1)^2-b^2}=\sqrt{2b+1}.\]
At the moment mentioned in the problem, \(b=4\) and \(db/dt=2.5\). Therefore, at that moment,
\[\frac{dc}{dt}=\frac d{db}\sqrt{2b+1}\,\frac{db}{dt}
=\frac12(2b+1)^{-1/2}(2)\frac{db}{dt}\]
\[=\frac{2.5}{\sqrt{2(4)+1}}=\frac{2.5}{3}=\frac56.\]
The source's intermediate evaluation subscripts say \(b=2\); these are typos. The stated value \(b=4\), used in its final numerical substitution, is the correct one.

Alternatively, we can write \(c^2=(b+1)^2-b^2=2b+1\). Implicit differentiation of the leftmost and rightmost sides with respect to time \(t\) (using the power and chain rules) yields \(2c\,dc/dt=2\,db/dt\), which yields \(dc/dt=(1/c)\,db/dt\). Note that when \(b=4\), \(c=\sqrt{2(4)+1}=3\). Therefore, at that moment, \(dc/dt=(1/3)(2.5)=5/6\).

The horizontal semiaxis is \(b+1>b\), which is why the foci lie on the \(x\)-axis and the focal relation subtracts \(b^2\) from \((b+1)^2\), not the reverse. The answer is B.`,
  },
  {
    id: 10412, number: 290, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 27 },
    topic: "Rate of Change", difficulty: 3, methods: ["Related Rates", "Pythagorean Theorem"],
    question: String.raw`The lengths of the vertical and horizontal legs of a right triangle are changing with time. At a particular moment, the length of the vertical leg is 30 feet and is increasing at 2 feet per second, and the length of the horizontal leg is 40 feet and is increasing at 3 feet per second. At that moment, how fast is the length of the altitude to the hypotenuse increasing, in feet per second?`,
    choices: [String.raw`\(\frac{6\sqrt{13}}{13}\)`, String.raw`\(\frac{209}{125}\)`, String.raw`\(\frac{18}{5}\)`, String.raw`\(\sqrt{13}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let \(a\) represent the length (in feet) of the vertical leg, let \(b\) represent the length (in feet) of the horizontal leg, let \(c\) represent the length of the hypotenuse (in feet), and let \(h\) represent the length of the altitude to the hypotenuse (in feet). From the Pythagorean theorem, \(a^2+b^2=c^2\). From expressing twice the area of the triangle in two ways (using either leg as the base for one way, and using the hypotenuse as the base for the other way), we have \(ab=hc\).

Differentiating the first equation with respect to time \(t\) (in seconds) gives
\[2a\frac{da}{dt}+2b\frac{db}{dt}=2c\frac{dc}{dt},\qquad
\frac{dc}{dt}=\frac{a\,da/dt+b\,db/dt}{c}.\]
Differentiating the second equation with respect to time \(t\) (in seconds) gives
\[a\frac{db}{dt}+b\frac{da}{dt}
=h\frac{dc}{dt}+c\frac{dh}{dt},\qquad
\frac{dh}{dt}=\frac{a\,db/dt+b\,da/dt-h\,dc/dt}{c}.\]
At the moment mentioned in the problem, \(a=30\), \(da/dt=2\), \(b=40\), \(db/dt=3\), and so \(c=\sqrt{30^2+40^2}=50\) and \(h=ab/c=30(40)/50=24\). Therefore, at that moment,
\[\frac{dc}{dt}=\frac{30(2)+40(3)}{50}=3.6,\]
and finally
\[\frac{dh}{dt}=\frac{30(3)+40(2)-24(3.6)}{50}
=\frac{209}{125}.\]
The length of the altitude to the hypotenuse increases at \(209/125\) feet per second.

Both \(h\) and \(c\) change, so differentiating \(hc\) needs both product-rule terms. In particular \(c'=18/5\), choice C, is the rate of the hypotenuse, not the requested altitude. The answer is B.`,
  },
  {
    id: 10413, number: 291, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 28 },
    topic: "Rate of Change", difficulty: 3, methods: ["Related Rates"],
    question: String.raw`A boat travels horizontally in a straight line with constant velocity, directly away from the base of a 20-meter-tall vertical lighthouse. At the moment the boat is 60 meters away from the base, the angle of elevation from the boat to the top of the lighthouse is decreasing at 0.05 radians per second. At the moment the boat is 600 meters away from the base, how fast is this angle of elevation decreasing in radians per second?`,
    choices: [String.raw`\(\frac1{18020}\)`, String.raw`\(\frac1{1802}\)`, "0.005", "0.05", "NOTA"],
    answer: "B",
    solution: String.raw`Let \(D\) represent the boat's distance away from the base of the lighthouse (in meters), and let \(\theta\) represent the angle of elevation from the boat to the top of the lighthouse (in radians). Consider the right triangle with vertices at the base of the lighthouse, the top of the lighthouse, and the boat. The horizontal leg has length \(D\) meters, the vertical leg has length \(20\) meters, and \(\theta\) is the angle between the horizontal leg and the hypotenuse. Therefore, \(\cot\theta=D/20\), which gives \(\theta=\operatorname{arccot}(D/20)\).

Using the derivative of the arc cotangent function and the chain rule, we differentiate both sides with respect to time \(t\):
\[\frac{d\theta}{dt}
=-\frac1{20}\frac1{1+(D/20)^2}\frac{dD}{dt}.\]
Since we are given that the boat's velocity is constant, \(dD/dt\) is constant. Therefore, the magnitude of \(d\theta/dt\) is inversely proportional to \(1+(D/20)^2\). We are given that when \(D=60\), \(d\theta/dt=-0.05\).

Therefore, when \(D=600\),
\[\frac{d\theta}{dt}
=-0.05\frac{1+(60/20)^2}{1+(600/20)^2}
=-0.05\frac{10}{901}=-\frac1{1802}.\]
At the moment the boat is \(600\) meters away from the base of the lighthouse, this angle of elevation is decreasing at \(1/1802\) of a radian per second.

As an independent check, rewrite the derivative as \(\theta'=-20D'/(400+D^2)\). The first observation gives \(-0.05=-20D'/4000\), so \(D'=10\) meters per second. At \(D=600\), \(\theta'=-200/360400=-1/1802\). The question asks how fast it is decreasing, so report the positive magnitude, choice B, rather than a negative rate or a simple tenfold rescaling.`,
  },
  {
    id: 10414, number: 292, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 29 },
    topic: "Optimization", difficulty: 3, methods: ["Distance Formula", "First Derivative Test"],
    question: String.raw`In the coordinate plane, what is the minimum distance between the point \((0,1)\) and a point on the parabola \(y=\frac23x^2\) with a domain of all real numbers?`,
    choices: [String.raw`\(\frac{\sqrt6}{4}\)`, String.raw`\(\frac{15}{16}\)`, String.raw`\(\frac{\sqrt{15}}4\)`, "1", "NOTA"],
    answer: "C",
    solution: String.raw`We need to find the minimum distance between \((0,1)\) and \((x,\frac23x^2)\). At a given \(x\) value, the distance is minimized if and only if the square of the distance is minimized. So, let's first minimize the square of the distance, which is represented by the function
\[S(x)=(x-0)^2+\left(\frac23x^2-1\right)^2
=\frac49x^4-\frac13x^2+1.\]
Differentiating with respect to \(x\) gives us
\[S'(x)=\frac{16}9x^3-\frac23x
=\frac{16}9x\left(x^2-\frac38\right).\]
Observe that \(S'(x)\) is zero at \(x=0\) and at \(x=\pm\sqrt{3/8}\), negative when \(x<-\sqrt{3/8}\) or \(0<x<\sqrt{3/8}\), and positive when \(-\sqrt{3/8}<x<0\) or \(x>\sqrt{3/8}\). So, the (global) minimum value of the square of the distance is the smaller of \(S(-\sqrt{3/8})\) and \(S(\sqrt{3/8})\). Observe that
\[S\left(-\sqrt{3/8}\right)=S\left(\sqrt{3/8}\right)
=\frac49\left(\frac38\right)^2-\frac13\left(\frac38\right)+1
=\frac{15}{16},\]
so the minimum value of the square of the distance is \(15/16\). Therefore, the minimum distance is \(\sqrt{15/16}=\sqrt{15}/4\).

The positive quartic leading term ensures \(S(x)\to+\infty\) as \(|x|\to\infty\), so there is no missing minimum at infinity. Completing the square also verifies the global bound directly:
\[S(x)=\frac49\left(x^2-\frac38\right)^2+\frac{15}{16}.\]
Equality holds at both \(x=\pm\sqrt{3/8}\). Choice B is the squared distance, not the distance; C is correct.`,
  },
  {
    id: 10415, number: 293, division: "Mu",
    source: { ...januaryRegional2025, questionNumber: 30 },
    topic: "Optimization", difficulty: 3, methods: ["First Derivative Test"],
    question: String.raw`A manufacturer wants to create a circular spinner with only a blue section and a red section, in the shape of circular sectors that may or may not have equal size. The manufacturer wants to maximize the probability that the spinner lands on blue exactly 2 times or exactly 3 times, in the next 4 spins. What fraction of the spinner should the manufacturer make blue to achieve this goal, assuming that the spins are independent?`,
    choices: [String.raw`\(\frac{4-\sqrt7}{3}\)`, String.raw`\(\frac58\)`, String.raw`\(\frac{3-\sqrt3}{2}\)`, String.raw`\(\frac23\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(p\) represent the fraction of the spinner that is blue, with \(0\le p\le1\). Note that \(p\) is the probability that the spinner lands on blue on any given spin. The number of times that the spinner lands on blue out of the next \(4\) spins has a binomial distribution with \(4\) trials and success probability \(p\), so the probability that the spinner lands on blue exactly \(2\) times or exactly \(3\) times, in the next \(4\) spins, is given by the function
\[f(p)=\binom42p^2(1-p)^{4-2}+\binom43p^3(1-p)^{4-3}\]
\[=6p^2(1-p)^2+4p^3(1-p)=2p^4-8p^3+6p^2.\]
We need to maximize this function on the interval \(0\le p\le1\), so we need to study the derivative of this function. We have
\[f'(p)=8p^3-24p^2+12p=4p(2p^2-6p+3).\]
Therefore, on the interval \(0\le p\le1\), \(f'(p)\) is zero at \(p=0\) and at
\[p=\frac{6-\sqrt{(-6)^2-4(2)(3)}}{2(2)}
=\frac{3-\sqrt3}{2},\]
positive for \(0<p<(3-\sqrt3)/2\), and negative for \((3-\sqrt3)/2<p\le1\). It follows that on the interval \(0\le p\le1\), \(f(p)\) has a global maximum at \(p=(3-\sqrt3)/2\).

The other quadratic root, \((3+\sqrt3)/2\), is greater than \(1\) and is not an admissible fraction. Both endpoints give probability zero: an all-red spinner never gives \(2\) or \(3\) blues, and an all-blue spinner gives \(4\) blues. The interior critical point gives a positive probability and the derivative changes from positive to negative there, so C is the unique maximizing fraction. As usual for a circular spinner, the source interprets the probability as proportional to the sector's angular size; independence allows the binomial count.`,
  },
  // February 1, 2025 King Statewide. Corrected disputes 17,18,23 retained; thrown-out 30 excluded.
  {
    id: 10416, number: 294, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 1 },
    topic: "Limits", difficulty: 2, methods: ["Asymptotes"],
    question: String.raw`Let \(q(x)=\frac{4x^2+5x+4}{x+1}\). If \((a,b)\) is a point on the graph of \(q\) such that \(b\) equals the slope of the oblique asymptote of \(q(x)\) and \(a\) is negative, find \(a\).`,
    choices: ["-1", "-2", String.raw`\(-\frac12\)`, String.raw`\(-\frac14\)`, "NOTA"],
    answer: "D",
    solution: String.raw`By synthetic or long division, the slope of the oblique asymptote of \(q(x)\) is \(m=4\). \(q(x)=4\) at \(x=0,-1/4\). Since \(x\) is negative, then \(a=-1/4\).

In detail, division gives
\[q(x)=4x+1+\frac3{x+1}.\]
The last term tends to zero as \(x\to\pm\infty\), so the oblique asymptote is \(y=4x+1\). Its slope, not its intercept, is the required \(b=4\). Solve the equation for a point on the original graph:
\[4x^2+5x+4=4(x+1),\qquad x(4x+1)=0.\]
Both roots are in the domain \(x\ne-1\), and only \(-1/4\) is negative, giving D.`,
  },
  {
    id: 10417, number: 295, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 2 },
    topic: "Derivatives", difficulty: 2, methods: ["Quotient Rule", "Product Rule"],
    question: String.raw`Let \(f(2)=3\), \(f'(2)=6\), \(g(2)=-5\), and \(g'(2)=8\). If \(h(x)=\frac{xf(x)}{g(x)}\), find \(h'(2)\).`,
    choices: [String.raw`\(-\frac{27}{25}\)`, String.raw`\(-\frac{33}{25}\)`, String.raw`\(-\frac{117}{25}\)`, String.raw`\(-\frac{123}{25}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`\[
h'(x)=\frac{g(x)[xf'(x)+f(x)]-xf(x)g'(x)}{(g(x))^2}.
\]
By substituting in our values given, \(h'(2)=-123/25\).

The numerator \(xf(x)\) is itself a product, so its derivative is \(xf'(x)+f(x)\). Apply the quotient rule only after accounting for that derivative:
\[h'(2)=\frac{(-5)[2(6)+3]-2(3)(8)}{(-5)^2}
=\frac{-75-48}{25}=-\frac{123}{25}.\]
The denominator is nonzero at \(2\), and its square is positive. Forgetting either the derivative of the initial factor \(x\) or the minus sign in the quotient rule changes the result. D is correct.`,
  },
  {
    id: 10418, number: 296, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 3 },
    topic: "Definite Integrals", difficulty: 2, methods: ["Symmetry"],
    question: String.raw`Find the area enclosed by the graph of \(g(x)=\frac{x+2}{x^2+1}\) and the \(x\)-axis on the interval \([-1,1]\).`,
    choices: [String.raw`\(\pi\)`, String.raw`\(2\pi\)`, String.raw`\(\ln2+\pi\)`, String.raw`\(\ln2+2\pi\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\(\int_{-1}^1g(x)\,dx\) can be rewritten as the sum of two rational functions:
\[\int_{-1}^1\left(\frac{x}{x^2+1}+\frac2{x^2+1}\right)\,dx.\]
\(\left[\frac12\ln|x^2+1|+2\arctan x\right]\) evaluated from \(-1\) to \(1\) results in \(\pi\).

This integral really equals the geometric area: \(x+2\ge1>0\) throughout the interval and \(x^2+1>0\), so the graph stays above the axis. The logarithmic endpoint terms cancel because \(1^2+1=(-1)^2+1=2\). The remaining contribution is
\[2\left(\arctan1-\arctan(-1)\right)
=2\left(\frac\pi4+\frac\pi4\right)=\pi.\]
Alternatively, \(x/(x^2+1)\) is odd, so its symmetric integral is zero immediately. The answer is A.`,
  },
  {
    id: 10419, number: 297, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 4 },
    topic: "Implicit Differentiation", difficulty: 3, methods: ["Implicit Differentiation"],
    question: String.raw`Calculate the slope of the line perpendicular to the normal line of
\[x\sin(\pi y)+e^y=\tan(x+1)+e^{-x}\]
at the point \((-1,1)\).`,
    choices: [String.raw`\(\frac{-e-\pi}{1-e}\)`, String.raw`\(\frac{1+e}{\pi+e}\)`, String.raw`\(\frac{1-e}{\pi+e}\)`, String.raw`\(\frac{-e-\pi}{1+e}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Differentiating to find the slope:
\[x\pi y'\cos(\pi y)+\sin(\pi y)+y'e^y
=\sec^2(x+1)-e^{-x}.\]
Isolating \(y'\) and substituting \(x=-1\), \(y=1\) results in \((1-e)/(\pi+e)\).

Specifically, collect the derivative terms:
\[y'[x\pi\cos(\pi y)+e^y]
=\sec^2(x+1)-e^{-x}-\sin(\pi y).\]
At the given point, \(\sin\pi=0\), \(\cos\pi=-1\), and \(\sec^20=1\), so
\[y'=\frac{1-e-0}{(-1)\pi(-1)+e}=\frac{1-e}{\pi+e}.\]
The original equation holds there because both sides equal \(e\). The normal line is perpendicular to the tangent; a line perpendicular to that normal is parallel to the tangent and has the tangent's slope, not the normal's reciprocal slope. The coefficient \(\pi+e\) is nonzero, so this is a finite slope, choice C.

The supplied solution prints \(yy'e^y\) in one intermediate line. Differentiating \(e^y\) gives \(y'e^y\) with no extra \(y\); this typo is corrected above and did not affect its numerical result at \(y=1\).`,
  },
  {
    id: 10420, number: 298, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 5 },
    topic: "Limits", difficulty: 1, methods: [],
    question: String.raw`If \(\displaystyle\lim_{x\to6}\frac{g(x)+12}{x-6}=9\), find \(\displaystyle\lim_{x\to6}g(x)\).`,
    choices: ["9", "12", "15", "21", "NOTA"],
    answer: "E",
    solution: String.raw`For \(x\ne6\), write
\[g(x)+12=(x-6)\frac{g(x)+12}{x-6}.\]
The first factor tends to \(0\) and the second has the given finite limit \(9\). By the product law,
\[\lim_{x\to6}[g(x)+12]=0\cdot9=0,\qquad
\lim_{x\to6}g(x)=-12.\]
The value \(-12\) is not among A-D, so the answer is E.

The source's intended conclusion is correct, but its claim that the quotient must be a rational function with a hole, and that \(g(6)=-12\), is not justified. No formula or continuity of \(g\) at \(6\) is assumed; \(g(6)\) may be undefined or assigned a different value. A limit concerns nearby inputs, not the function's value at the limiting input. The product-law proof needs no such extra assumption.`,
  },
  {
    id: 10421, number: 299, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 6 },
    topic: "Definite Integrals", difficulty: 2, methods: ["U-Substitution"],
    question: String.raw`If \(p\) is a continuous function such that \(\int_0^{10}p(\frac s5)\,ds=35\), then find \(\int_2^3p(2t-4)\,dt\).`,
    choices: [String.raw`\(\frac72\)`, String.raw`\(\frac{11}{2}\)`, "14", "22", "NOTA"],
    answer: "A",
    solution: String.raw`If \(P(x)\) represents an antiderivative of \(p(x)\), then
\[\int_0^{10}p(s/5)\,ds=5[P(2)-P(0)]=35,\]
which can be written as \(P(2)-P(0)=7\). Considering the other integral,
\[\int_2^3p(2t-4)\,dt=\frac12[P(2)-P(0)].\]
Thus, \(\frac12(7)=7/2\).

The substitution details explain the scaling factors. For the given integral let \(u=s/5\), so \(ds=5\,du\) and \(s=0,10\) become \(u=0,2\). Hence \(5\int_0^2p(u)\,du=35\). For the requested integral let \(u=2t-4\), so \(dt=du/2\) and \(t=2,3\) also become \(u=0,2\). It is therefore half of the same integral, giving A. Matching the transformed bounds is essential; the original integration variables have different scales.`,
  },
  {
    id: 10422, number: 300, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 7 },
    topic: "Fundamental Theorem of Calculus", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`If \(G(x)=\int_{\arctan x}^0\tan^2(t)\,dt\), then evaluate \(G'(1)\).`,
    choices: [String.raw`\(\frac12\)`, String.raw`\(-\frac12\)`, String.raw`\(\pi\)`, String.raw`\(\frac14\)`, "NOTA"],
    answer: "B",
    solution: String.raw`\[
G'(x)=-\frac{\tan^2(\arctan x)}{x^2+1}.
\]
Substituting \(x=1\) results in \(G'(1)=-1/2\).

The moving bound is the lower bound, which contributes a minus sign in the Fundamental Theorem of Calculus:
\[\frac d{dx}\int_{a(x)}^0H(t)\,dt=-H(a(x))a'(x).\]
Here \(a(x)=\arctan x\) and \(a'(x)=1/(1+x^2)\). Also \(\tan(\arctan x)=x\), so \(G'(x)=-x^2/(1+x^2)\). At \(1\), this is \(-1/(1+1)=-1/2\), giving B. The integrand is continuous between the finite bounds because \(\arctan x\) lies strictly between the tangent poles.`,
  },
  {
    id: 10423, number: 301, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 8 },
    topic: "Derivatives", difficulty: 2, methods: ["Product Rule"],
    question: String.raw`Suppose \(f(x)=e^x(mx+b)\), where \(m\) and \(b\) are real numbers. Find \(b\) if the tangent line to \(f\) at \(x=1\) is \(y=6x-10\).`,
    choices: [String.raw`\(-\frac{10}e\)`, String.raw`\(\frac{10}e\)`, String.raw`\(-\frac{14}e\)`, String.raw`\(\frac{14}e\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let's set up a system!
\[f'(x)=me^x+e^x(mx+b).\]
The tangent slope is \(6\), so at \(x=1\),
\[6=me+em+eb=2em+eb.\]
Now, for the function itself,
\[f(1)=e(m+b),\qquad -4=em+eb.\]
By elimination, \(m=10/e\). Thus, \(b=-14/e\).

The tangent line supplies two pieces of information: its slope is \(6\), and its value at the tangency input is \(6(1)-10=-4\). Subtracting the value equation from the slope equation gives \(em=10\), then \(eb=-4-10=-14\). The parameter named \(b\) is inside \(e^x(mx+b)\); it is not the tangent line's \(y\)-intercept \(-10\). The answer is C.`,
  },
  {
    id: 10424, number: 302, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 9 },
    topic: "Function Analysis", difficulty: 2, methods: ["Intermediate Value Theorem"],
    question: String.raw`How many real solutions does \(5e^x+x^7=8\) have on its domain?`,
    choices: ["0", "1", "2", "3", "NOTA"],
    answer: "B",
    solution: String.raw`By rearranging the equation, we can compare \(5e^x=-x^7+8\). The exponential function is one-to-one, monotonically increasing. The seventh-degree polynomial on the right is also one-to-one, monotonically decreasing. The functions will intersect one time.

To justify both existence and uniqueness explicitly, let \(H(x)=5e^x+x^7-8\). It is continuous for every real \(x\), with
\[H(0)=-3<0,\qquad H(1)=5e-7>0.\]
The Intermediate Value Theorem guarantees a root between \(0\) and \(1\). Furthermore,
\[H'(x)=5e^x+7x^6>0\]
for all real \(x\), since \(e^x>0\) and \(x^6\ge0\). Thus \(H\) is strictly increasing and can cross zero at most once. There is exactly one solution, giving B. Opposite monotonicity alone establishes at most one intersection; the sign check establishes that it actually occurs.`,
  },
  {
    id: 10425, number: 303, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 10 },
    topic: "Rate of Change", difficulty: 2, methods: ["Related Rates"],
    question: String.raw`A particle is traveling downward and to the right along the curve \(y=\ln(1-\sin x)\). Its \(x\)-coordinate is increasing at the rate \(\frac{dx}{dt}=\sec x\) m/sec. At what rate is the \(y\)-coordinate changing when \(x=\frac\pi6\)?`,
    choices: [String.raw`\(-\frac2{2-\sqrt3}\)`, String.raw`\(\frac2{2-\sqrt3}\)`, "-1", "-2", "NOTA"],
    answer: "D",
    solution: String.raw`At \(x=\pi/6\), \(y=\ln(1/2)\). Differentiating with respect to \(t\),
\[\frac{dy}{dt}=\frac1{1-\sin x}(-\cos x)\frac{dx}{dt}.\]
Substituting the coordinate and \(dx/dt=\sec x\), \(dy/dt=-2\).

In fact, \(\cos x\sec x=1\) wherever the given velocity is defined, so
\[\frac{dy}{dt}=-\frac1{1-\sin x}.\]
At \(x=\pi/6\), \(\sin x=1/2\), giving \(-1/(1-1/2)=-2\) m/sec. The negative sign means downward motion, as stated; the \(x\)-velocity there is positive, consistent with motion to the right. The logarithm is defined at this point because its input \(1/2\) is positive. The answer is D.`,
  },
  {
    id: 10426, number: 304, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 11 },
    topic: "Riemann Sums", difficulty: 2, methods: ["Riemann Sums"],
    question: String.raw`Evaluate the limit \(\displaystyle\lim_{n\to\infty}\sum_{k=1}^n(1+\frac kn)^{-2}\cdot\frac1n\).`,
    choices: [String.raw`\(\frac15\)`, String.raw`\(\frac14\)`, String.raw`\(\frac13\)`, String.raw`\(\frac12\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Limit definition of an integral: \(\int_1^2x^{-2}\,dx\). Evaluating this results in \(1/2\).

Here \(\Delta x=1/n\), and the right endpoints \(x_k=1+k/n\) partition \([1,2]\). The summand is \(x_k^{-2}\Delta x\), so continuity of \(x^{-2}\) on \([1,2]\) lets us pass to its definite integral:
\[\int_1^2x^{-2}\,dx=[-x^{-1}]_1^2=-\frac12-(-1)=\frac12.\]
Equivalently, use endpoints \(k/n\) on \([0,1]\) and the function \((1+x)^{-2}\). Either interpretation includes the interval width \(1/n\); it is not part of the exponent. The answer is D.`,
  },
  {
    id: 10427, number: 305, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 12 },
    topic: "Optimization", difficulty: 2, methods: ["First Derivative Test"],
    question: String.raw`Determine the value of \(b\) for which the definite integral \(\int_{-3}^b-(x+3)(x-1)^2(x-4)\,dx\) is the largest possible if \(b>-3\).`,
    choices: ["-3", "1", "4", "8", "NOTA"],
    answer: "C",
    solution: String.raw`This is a fourth-degree polynomial with a negative leading coefficient and zeros at \(x=-3,1,\) and \(4\). The accumulated integral increases for \(-3<b<4\), except that its derivative is zero at the isolated point \(b=1\). After \(4\), the integrand crosses the axis and begins accumulating negative area, causing the value of the definite integral to decrease without bound. The maximum the definite integral will be is when \(b=4\).

Precisely, define \(A(b)=\int_{-3}^b-(x+3)(x-1)^2(x-4)\,dx\). By the Fundamental Theorem of Calculus,
\[A'(b)=-(b+3)(b-1)^2(b-4).\]
On the allowed domain \(b>-3\), the factor \(b+3\) is positive, and \((b-1)^2\) is nonnegative. Consequently \(A'>0\) on \((-3,1)\) and \((1,4)\), but \(A'<0\) on \((4,\infty)\). The double root at \(1\) does not change sign and gives no maximum. The change from positive to negative at \(4\) is the global maximum, choice C.

The source's phrase "for all \(b<4\)" needs the stated restriction \(b>-3\); outside that domain the same sign claim would be false.`,
  },
  {
    id: 10428, number: 306, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 13 },
    topic: "Limits", difficulty: 2, methods: ["L'Hopital's Rule"],
    question: String.raw`Evaluate the limit \(\displaystyle\lim_{x\to1^+}x^{1/(1-x)}\).`,
    choices: ["0", "-1", String.raw`\(e\)`, String.raw`\(e^{-1}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Apply the natural logarithm to the positive expression:
\[\ln\left(x^{1/(1-x)}\right)=\frac{\ln x}{1-x}.\]
Applying L'Hopital's Rule and the limit gives
\[\lim_{x\to1^+}\frac{\ln x}{1-x}
=\lim_{x\to1^+}\frac{1/x}{-1}=-1.\]
Therefore, exponentiating gives the original limit \(e^{-1}\).

The logarithmic quotient is \(0/0\), and both its numerator and denominator are differentiable near \(1\) with denominator derivative \(-1\ne0\), so L'Hopital's rule applies. Establishing the logarithm's limit first and using continuity of the exponential avoids assuming in advance that the original limit exists. Because \(x>1\), the original exponent is negative, consistent with a limit between \(0\) and \(1\). D is correct.`,
  },
  {
    id: 10429, number: 307, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 14 },
    topic: "Derivatives", difficulty: 3, methods: ["Chain Rule", "Product Rule"],
    question: String.raw`If \(g(x)=e^{e^x+e^{-x}}\), then find \(g''(\ln2)\).`,
    choices: [String.raw`\(\frac{19}4e^{5/2}\)`, String.raw`\(\frac{13}4e^{7/4}\)`, String.raw`\(e^{3/4}\)`, String.raw`\(e^{7/4}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\[
g'(x)=e^{e^x+e^{-x}}(e^x-e^{-x}),
\]
so
\[g''(x)=e^{e^x+e^{-x}}(e^x+e^{-x})
+(e^x-e^{-x})[e^{e^x+e^{-x}}(e^x-e^{-x})].\]
Substituting \(\ln2\) (very carefully...) results in \(\frac{19}4e^{5/2}\).

To organize the arithmetic, set \(u(x)=e^x+e^{-x}\). Then \(g=e^u\), \(u'=e^x-e^{-x}\), and \(u''=e^x+e^{-x}\). The second derivative is
\[g''=e^u[(u')^2+u''].\]
At \(x=\ln2\), \(e^x=2\) and \(e^{-x}=1/2\), so \(u=5/2\), \(u'=3/2\), and \(u''=5/2\). Hence
\[g''(\ln2)=e^{5/2}\left[\left(\frac32\right)^2+\frac52\right]
=e^{5/2}\left(\frac94+\frac{10}4\right)=\frac{19}4e^{5/2},\]
choice A. Differentiating \(e^u u'\) needs both product-rule contributions.`,
  },
  {
    id: 10430, number: 308, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 15 },
    topic: "Derivatives", difficulty: 2, methods: ["Chain Rule", "Product Rule"],
    question: String.raw`If the graph of the function \(u\) passes through the origin with a slope of \(-1\), find \(v'(3)\) if \(v(x)=x\cdot u(x^2+4x-21)\).`,
    choices: ["-4", "0", "-6", "-30", "NOTA"],
    answer: "D",
    solution: String.raw`\[
v'(x)=x[u'(x^2+4x-21)(2x+4)]+u(x^2+4x-21).
\]
Substituting \(x=3\) results in \(v'(3)=-30\).

Passing through the origin means \(u(0)=0\), while the slope there means \(u'(0)=-1\). At the requested input the inner expression is \(3^2+4(3)-21=0\), so both of those given values apply:
\[v'(3)=3[u'(0)(2(3)+4)]+u(0)
=3(-1)(10)+0=-30.\]
The factor \(x\) also differentiates, producing the final \(u\) term. The source labels the left side \(v'(t)\) despite using \(x\) throughout the right side; the variable is corrected to \(x\). The answer is D.`,
  },
  {
    id: 10431, number: 309, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 16 },
    topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`Suppose the velocity of a particle is given by \(v(t)=(t^2+t-2)\cdot|t^2+t-12|\), \(t>0\). For which value(s) of \(t\) does the particle turn around?`,
    choices: ["1 only", "1 and 3", String.raw`\(\sqrt5\) only`, String.raw`\(3\) and \(\sqrt5\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The roots of the velocity of the particle are \(t=-2,1,-4,\) and \(3\), but the latter two roots come from an absolute-value factor, which does not change sign across its zeros. Since \(t>0\), there is one location where the particle turns around, at \(t=1\) only.

Factor the expression:
\[v(t)=(t+2)(t-1)|(t+4)(t-3)|.\]
For positive \(t\), \(t+2>0\), and the absolute-value factor is strictly positive except at \(3\). Thus the sign chart is:

For \(0<t<1\), \(v(t)<0\).

For \(1<t<3\), \(v(t)>0\).

For \(t>3\), \(v(t)>0\).

Velocity changes sign at \(1\), so the particle reverses direction there. At \(3\) it momentarily stops but continues in the same direction. A zero velocity is necessary but not sufficient for a turnaround. The source's description of the absolute-value factor as positive on the entire domain is corrected to nonnegative, since it vanishes at \(3\). A is correct.`,
  },
  {
    id: 10432, number: 310, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 17 },
    topic: "Limits", difficulty: 3, methods: ["Absolute Value"],
    question: String.raw`Let \(f(x)=\frac{|3-x|}{9-x^2}\). Which of the following statements are true?

I. \(\lim_{x\to3^-}f(x)\) exists.

II. \(\lim_{x\to3}f(x)\) does not exist.

III. The domain of \(f\) can be extended to be continuous at \(x=3\).

IV. The domain of \(f\) can be extended to be differentiable at \(x=3\).

V. \(\lim_{x\to3^+}f'(x)\) exists.`,
    choices: ["I, II only", "I only", "I, III, IV", "I, II, III, IV, V", "NOTA"],
    answer: "E",
    solution: String.raw`The limit does exist from the left and from the right, since the numerator and denominator simplify as they share a linear factor. However, since the numerator is an absolute value, the two-sided limit does not exist. Since there is a gap between the sides of the limit, the function \(f\) cannot be extended to be continuous. It is not differentiable at \(3\) either, as the limit of the function does not exist there.

The corrected key also accounts for statement V. For \(x\) close to \(3\), but not equal to \(3\),
\[f(x)=\begin{cases}\dfrac1{3+x},&x<3,\\[3pt]-\dfrac1{3+x},&x>3.\end{cases}\]
Hence the left limit is \(1/6\) and the right limit is \(-1/6\). Statements I and II are true, while III is false because changing or assigning one point cannot reconcile these distinct limits. IV is false because differentiability would imply continuity.

On the right-hand branch, \(f'(x)=1/(3+x)^2\), so
\[\lim_{x\to3^+}f'(x)=\frac1{36}.\]
Thus V is true even though \(f'(3)\) does not exist: the limit of derivatives at nearby inputs is a different assertion from differentiability at \(3\). The true set is I, II, V, not listed in A-D, so the answer is E.

The supplied correction explicitly changes A to E because statement V is true. The original A answer is not retained.`,
  },
  {
    id: 10433, number: 311, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 18 },
    topic: "Improper Integrals", difficulty: 2, methods: [],
    question: String.raw`Evaluate \(\displaystyle\int_{\pi/4}^{2\pi/3}\left(\frac{2\cot\theta}{\sin\theta}+\frac1{\cos^2\theta}\right)\,d\theta\).`,
    choices: [String.raw`\(1+2\sqrt2+\frac{7\sqrt3}{3}\)`, String.raw`\(-1+2\sqrt2+\frac{7\sqrt3}{3}\)`, String.raw`\(1+2\sqrt2-\frac{7\sqrt3}{3}\)`, String.raw`\(-1+2\sqrt2-\frac{7\sqrt3}{3}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`By using some trig properties, we can rewrite the integrand as \(2\csc\theta\cot\theta+\sec^2\theta\). However, the interval contains \(\theta=\pi/2\), where \(\cos\theta=0\). The integral is improper and must be split at that interior singularity:
\[\lim_{b\to(\pi/2)^-}\int_{\pi/4}^{b}(2\csc\theta\cot\theta+\sec^2\theta)\,d\theta\]
\[+\lim_{a\to(\pi/2)^+}\int_a^{2\pi/3}(2\csc\theta\cot\theta+\sec^2\theta)\,d\theta.\]
On either side an antiderivative is \(-2\csc\theta+\tan\theta\). As \(b\to(\pi/2)^-\), \(\csc b\to1\) but \(\tan b\to+\infty\), so the first integral diverges to \(+\infty\). As \(a\to(\pi/2)^+\), \(\tan a\to-\infty\), so subtracting the lower antiderivative also makes the second integral diverge to \(+\infty\).

The \(2\csc\theta\cot\theta\) term is continuous at \(\pi/2\) and cannot cancel the divergence of \(\sec^2\theta\). Consequently the full integral diverges to \(+\infty\), and none of the finite listed values is correct. The answer is E.

The supplied correction explicitly changes D to E for divergence. Directly subtracting the two outer endpoint values of an antiderivative across its pole is invalid and is the source of the original finite D result.`,
  },
  {
    id: 10434, number: 312, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 19 },
    topic: "Hyperbolic Functions", difficulty: 2, methods: ["Chain Rule"],
    question: String.raw`Let \(h(x)=\tan^{-1}(\sinh x)\). Compute the value of \(h'(\ln3)\).`,
    choices: [String.raw`\(\frac35\)`, String.raw`\(\frac{24}{25}\)`, String.raw`\(\frac9{25}\)`, String.raw`\(e^{9/25}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\[
h'(x)=\frac1{1+\sinh^2x}\cosh x.
\]
Substituting \(\ln3\), we find \(h'(\ln3)=3/5\).

Here \(\tan^{-1}\) denotes arctangent, not reciprocal tangent. The chain rule uses \((\arctan u)'=u'/(1+u^2)\) and \((\sinh x)'=\cosh x\). From the hyperbolic identity \(\cosh^2x-\sinh^2x=1\), we get
\[h'(x)=\frac{\cosh x}{\cosh^2x}=\frac1{\cosh x}.\]
Finally,
\[\cosh(\ln3)=\frac{e^{\ln3}+e^{-\ln3}}2
=\frac{3+1/3}2=\frac53,\]
so its reciprocal is \(3/5\). As a direct check, \(\sinh(\ln3)=4/3\), giving \((5/3)/(1+16/9)=3/5\). The answer is A.`,
  },
  {
    id: 10435, number: 313, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 20 },
    topic: "Applications of Integration", difficulty: 2, methods: [],
    question: String.raw`The number of peas hidden in Elementary school children's napkins is increasing at a stable and known rate approximated by the equation \(p(t)=\sqrt t+\frac37t^2\) (where rate is measured in peas per minute). For inexplicable reasons, all 13 children enter the lunchroom with twelve peas already hidden in napkins in each of their lunchbags, and of course, kids only carry one lunch bag each. Lunch at this particular school runs for 16 minutes. To the nearest pea, how many total peas are hidden at the end of the lunch period?`,
    choices: ["750", "784", "836", "993", "NOTA"],
    answer: "B",
    solution: String.raw`Integrate the rate over the lunch period to find the number of additional hidden peas:
\[\int_0^{16}\left(t^{1/2}+\frac37t^2\right)\,dt
=\left[\frac23t^{3/2}+\frac17t^3\right]_0^{16}
=\frac{128}3+\frac{4096}7=\frac{13184}{21}.\]
Since the students each came in with \(12\) peas each, we will need to add \(12\cdot13=156\). Therefore the total is
\[156+\frac{13184}{21}=\frac{16460}{21}
\approx783.8095,\]
which to the nearest pea would be a total of \(784\) peas, choice B.

The integral of a rate measured in peas per minute over time measured in minutes gives peas. The source interprets \(p(t)\) as the total rate for the group, not a per-child rate, so the integral is not multiplied by \(13\); only the initial \(12\) peas per child need that multiplication. The source rounded \(4096/7\) prematurely to \(585\) and reported \(783.6\). Keeping the exact fractions corrects that arithmetic without changing the rounded answer.`,
  },
  {
    id: 10436, number: 314, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 21 },
    topic: "Definite Integrals", difficulty: 1, methods: ["Integral Properties"],
    question: String.raw`\(\int_1^8f(x)\,dx=q\). \(\int_4^1 2f(x)\,dx=-4\). Find \(\int_4^8f(x)\,dx\) in terms of \(q\).`,
    choices: [String.raw`\(2q-2\)`, String.raw`\(q-4\)`, String.raw`\(q+4\)`, String.raw`\(q-2\)`, "NOTA"],
    answer: "D",
    solution: String.raw`It is given that \(\int_4^1 2f(x)\,dx=-4\), so \(2\int_1^4f(x)\,dx=4\) and then \(\int_1^4f(x)\,dx=2\). Since
\[\int_1^8f(x)\,dx=\int_1^4f(x)\,dx+\int_4^8f(x)\,dx,\]
we then know that \(\int_4^8f(x)\,dx=q-2\).

There are three elementary integral properties at work. First, pull the constant \(2\) outside the integral. Second, reversing the bounds changes the sign:
\[\int_1^4f(x)\,dx=-\int_4^1f(x)\,dx=-(-2)=2.\]
Third, split an integral at an interior endpoint to subtract the known piece from the total. No antiderivative or formula for \(f\) is necessary; the supplied definite integrals determine the result, choice D.`,
  },
  {
    id: 10437, number: 315, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 22 },
    topic: "Riemann Sums", difficulty: 3, methods: ["Riemann Sums", "Simpson's Rule"],
    question: String.raw`Johann decides to approximate the values of integrals using the various methods he learned in calculus class. He uses left Riemann, right Riemann, Midpoint Riemann, Trapezoidal Rule and Simpson's rule on the curve \(f(x)=(x-2)^2+5\) on \([3,5]\) using \(n=4\). How many of the approximations result in an over approximation?`,
    choices: ["1", "2", "3", "4", "NOTA"],
    answer: "B",
    solution: String.raw`\(f(x)\) is concave up on the entire domain. A trapezoidal sum overestimates a concave-up function. Midpoint sums underestimate for concave up, regardless of whether the function is increasing or decreasing. Using Simpson's rule for this quadratic gives the exact integral.

For left and right Riemann sums, monotonicity is the relevant condition, not concavity alone. Here \(f'(x)=2(x-2)>0\) on \([3,5]\), so the function is increasing: the left sum underestimates and the right sum overestimates. Also \(f''(x)=2>0\), justifying the trapezoidal and midpoint statements. Simpson's rule is exact for every polynomial of degree at most \(3\), including this degree-\(2\) polynomial; \(n=4\) is even as required.

An explicit numerical check uses \(\Delta x=(5-3)/4=1/2\):
\[L_4=\frac{67}4,\quad R_4=\frac{83}4,\quad
M_4=\frac{149}{8},\quad T_4=\frac{75}4,\quad S_4=\frac{56}3.\]
The exact integral is
\[\int_3^5[(x-2)^2+5]\,dx=\left[\frac{(x-2)^3}3+5x\right]_3^5=\frac{56}3.\]
Only \(R_4\) and \(T_4\) are strictly larger, so there are \(2\) overapproximations, choice B. The source's implication that concavity alone determines left/right error is corrected; its final count is unchanged.`,
  },
  {
    id: 10438, number: 316, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 23 },
    topic: "Probability", difficulty: 3, methods: ["Geometric Probability"],
    question: String.raw`Aaryan is playing with areas. He decides to graph five functions at once. On the same set of axes, he graphs \(f(x)=x^2\), \(g(x)=x^3\), \(h(x)=x^4\), \(i(x)=x^5\) and \(j(x)=x^6\) and calculates the area of each function between \(x=0\) and \(x=1\) and the \(x\)-axis. He then selects one of these labeled regions with probability proportional to its area, and selects a point uniformly within that region. Overlapping regions are counted separately according to their labels. Given that the selected region belongs to an even function, what is the probability that it is the region belonging to the quartic, \(h(x)\)?`,
    choices: [String.raw`\(\frac{21}{71}\)`, String.raw`\(\frac15\)`, String.raw`\(\frac35\)`, String.raw`\(\frac13\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The supplied correction changes C to A because the denominator should be the sum of the areas associated with the three even functions.

The even functions are \(f(x)=x^2\), \(h(x)=x^4\), and \(j(x)=x^6\). Their corresponding areas on \([0,1]\) are
\[A_f=\int_0^1x^2\,dx=\frac13,\qquad
A_h=\int_0^1x^4\,dx=\frac15,\qquad
A_j=\int_0^1x^6\,dx=\frac17.\]
Under the area-weighted labeled-region experiment specified in the repaired question, conditioning on an even function removes the two odd-function regions and renormalizes the three remaining weights. Thus
\[P(h\mid\text{even})
=\frac{A_h}{A_f+A_h+A_j}
=\frac{1/5}{1/3+1/5+1/7}
=\frac{21/105}{71/105}=\frac{21}{71},\]
choice A.

The original wording only says a point is selected "within the areas" and does not specify how overlapping regions are sampled. These regions are nested, so a point's coordinates can belong to several regions at once. The source's original \(3/5\) computes the quartic area divided by the union of the even regions, not the corrected area's sum. Choosing one of three even functions uniformly would instead give \(1/3\). The sampling and region-label wording is made explicit to uniquely implement the official correction, rather than silently mixing these different experiments.`,
  },
  {
    id: 10439, number: 317, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 24 },
    topic: "Differential Equations", difficulty: 3, methods: ["First-Order Linear Equations"],
    question: String.raw`Find the general solution of the differential equation \(\frac{dy}{dx}+\frac3x y=\frac{e^x}{x^3}\).`,
    choices: [String.raw`\(y=\frac{e^x+C}{x^3}\)`, String.raw`\(y=\frac{e^{3/x+c}}{x^3}\)`, String.raw`\(y=\frac{e^{x+c}}{3x}\)`, String.raw`\(y=\frac{3e^{x+c}}x\)`, "NOTA"],
    answer: "A",
    solution: String.raw`First, multiplying both sides by \(x^3\) shows a familiar pattern:
\[x^3\frac{dy}{dx}+3x^2y=e^x.\]
That's product rule!
\[\frac d{dx}(x^3y)=e^x,\qquad x^3y=e^x+C.\]
Finally, by isolating \(y\), we can see that
\[y=\frac{e^x+C}{x^3}.\]
This is the general solution on any interval not containing \(0\), where the differential equation is defined. The integrating factor approach gives the same result: an integrating factor is \(x^3\), whose logarithmic derivative is \(3/x\).

The printed choice A and the source's final quotient place the constant inside the exponent, \(e^{x+c}/x^3\), despite the correct preceding equation \(x^3y=e^x+C\). That is not an equivalent family: the integration constant is additive to \(e^x\), not to its exponent. A is repaired to the correct general solution above.

As a check,
\[y'=\frac{e^x}{x^3}-\frac{3(e^x+C)}{x^4},\qquad
y'+\frac3xy=\frac{e^x}{x^3}.\]
In contrast, using \(e^{x+c}/x^3\) gives \(e^{x+c}/x^3\) on the right, which matches the required equation only when \(c=0\). The intended answer letter A is retained after this notation repair.`,
  },
  {
    id: 10440, number: 318, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 25 },
    topic: "Differential Equations", difficulty: 3, methods: ["Separation of Variables"],
    question: String.raw`Whew. That was a toughie! Let's try another, easier, differential equation. Find the particular solution to \(x^2\frac{dy}{dx}+y=4\) when \(y(1)=0\).`,
    choices: [String.raw`\(y=4-4e^{1/x}\)`, String.raw`\(y=4-e^{1/x}\)`, String.raw`\(y=4-4e^{1/x-1}\)`, String.raw`\(y=4-4e^{1/x}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`First, work to get "like terms" on the same side of the equation. From \(x^2y'=4-y\), separate the variables:
\[\frac{dy}{4-y}=\frac{dx}{x^2}.\]
Integrating results in
\[-\ln|4-y|=-\frac1x+C.\]
Equivalently, writing the integration constant on the other side,
\[-\frac1x=-\ln|4-y|+C_1.\]
After substituting the coordinate \((1,0)\), \(C_1=-1+\ln4\). Substituting in \(C_1\) and working to isolate \(y\) results in
\[y=4-\frac{4e^{1/x}}e=4-4e^{1/x-1}.\]
The branch through the initial value has \(4-y>0\). Its interval containing the initial input is \(x>0\), since the equation in solved form is singular at \(0\).

To verify the result directly, \(y'=4e^{1/x-1}/x^2\), so
\[x^2y'+y=4e^{1/x-1}+4-4e^{1/x-1}=4,\qquad y(1)=0.\]
The equilibrium solution \(y=4\), lost when dividing by \(4-y\), does not satisfy the initial condition. The source prints integrals with reciprocal differentials before its valid logarithmic line; the properly separated integrals are given above. Duplicate wrong choices A and D are preserved. The answer is C.`,
  },
  {
    id: 10441, number: 319, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 26 },
    topic: "Power Series", difficulty: 2, methods: ["Power Series"],
    question: String.raw`If \(e^x=\sum_{n=0}^\infty\frac{x^n}{n!}\), then what is \(\displaystyle\sum_{n=1}^\infty\frac{(-2-x)^n(x-2)^n}{n!}\)?`,
    choices: [String.raw`\(e^{4-x^2}\)`, String.raw`\(e^{4-4x+x^2}\)`, String.raw`\(2e^{4-x^2}\)`, String.raw`\(e^{4-4x+x^2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Notice that \((-2-x)^n(x-2)^n\) can be written as \((4-x^2)^n\), because
\[(-2-x)(x-2)=-(x+2)(x-2)=4-x^2.\]
This summation would be equal to \(e^{4-x^2}\), but since this one starts at \(n=1\) and not \(n=0\), it is one term short of being equivalent. That term that the expansion is "missing" is \(1\), therefore
\[\sum_{n=1}^\infty\frac{(-2-x)^n(x-2)^n}{n!}
=e^{4-x^2}-1.\]
This is not any of A-D, so the answer is E. The exponential series converges absolutely at every real argument, including \(4-x^2\), so the substitution is valid for all real \(x\).

At \(x=2\) or \(x=-2\), every displayed term of the requested sum is zero because \(n\ge1\); the result \(e^0-1=0\) checks that the missing constant has been handled correctly. Duplicate wrong choices B and D are preserved.`,
  },
  {
    id: 10442, number: 320, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 27 },
    topic: "Fundamental Theorem of Calculus", difficulty: 2, methods: ["Chain Rule"],
    illustration: kingFebruaryStatewide2025Graph,
    question: String.raw`The diagram shows \(f(x)\), which is comprised of linear segments, a quarter circle, and a semicircle. It is defined on the interval \([-\frac12,\frac{15}2]\).

If \(F(x)=\int_5^{3x}f(t)\,dt\), then find the equation of the tangent line to \(F(x)\) at \(x=\frac32\).`,
    choices: [String.raw`\(8x-8y=11\)`, String.raw`\(12x+8y=19\)`, String.raw`\(8x-8y=13\)`, String.raw`\(6x-4y=1\)`, "NOTA"],
    answer: "B",
    solution: String.raw`To find the slope of the tangent line at \(F(3/2)\), we use the Fundamental Theorem of Calculus and the chain rule:
\[\frac d{dx}\left(\int_5^{3x}f(t)\,dt\right)=3f(3x).\]
The slope of the tangent line is found by substituting \(x=3/2\) into our derivative, which results in \(m=-3/2\). Then, to find the point on the graph of \(F\), we find
\[F(3/2)=\int_5^{9/2}f(t)\,dt=\frac18.\]
Finally, the equation of the line is then
\[y-\frac18=-\frac32\left(x-\frac32\right),\]
which is equivalent to \(12x+8y=19\).

On the original diagram, the segment from \((4,-1)\) to \((5,0)\) has equation \(f(t)=t-5\), so \(f(9/2)=-1/2\). Multiplying by the upper-bound derivative \(3\) gives the slope \(-3/2\). For the function value, the triangle on \([9/2,5]\) lies below the axis and has base \(1/2\), height \(1/2\), and signed integral \(-1/8\). Reversing its bounds from \(5\) to \(9/2\) changes the sign to \(+1/8\).

Expanding point-slope form gives \(y=-3x/2+19/8\), hence choice B. The derivative value and the integral value play different roles: one gives the slope and the other gives the point of tangency.`,
  },
  {
    id: 10443, number: 321, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 28 },
    topic: "Function Analysis", difficulty: 3, methods: ["Chain Rule"],
    illustration: kingFebruaryStatewide2025Graph,
    question: String.raw`The diagram shows \(f(x)\), which is comprised of linear segments, a quarter circle, and a semicircle. It is defined on the interval \([-\frac12,\frac{15}2]\).

Using the same function, \(F(x)\), from original question 27, find the intervals when \(F(x)\) is concave up.
\[F(x)=\int_5^{3x}f(t)\,dt.\]`,
    choices: [String.raw`\((0,2)\cup(5,7)\)`, String.raw`\((0,1)\cup(4,6)\)`, String.raw`\((0,\frac13)\cup(\frac43,2)\)`, String.raw`\((2,5)\)`, "NOTA"],
    answer: "C",
    solution: String.raw`We found that \(F'(x)=3f(3x)\), so wherever \(f'\) exists,
\[F''(x)=9f'(3x).\]
We are looking to see where this function is positive, so we analyze the slopes of the original graph. The graph of \(f\) has positive derivative on
\[(0,1)\cup(4,5)\cup(5,6).\]
Since \(F''(x)\) involves \(f'(3x)\), divide each input endpoint by \(3\). This gives
\[(0,\tfrac13)\cup(\tfrac43,\tfrac53)\cup(\tfrac53,2)\]
as the intervals on which \(F''\) exists and is strictly positive. The source calls this a horizontal stretch by \(3\); it is actually a compression by a factor of \(3\).

There is an additional distinction between a positive second derivative and concavity itself. At the joining point \(3x=5\), the left line joins the semicircle continuously, but \(f'\) does not exist there. Thus \(F''(5/3)\) is undefined. Nevertheless \(f\) is strictly increasing across \(5\), so \(F'=3f(3x)\) is strictly increasing across \(5/3\). Therefore \(F\) remains concave up throughout the larger interval \((4/3,2)\); the joining point need not be removed for concavity.

The corrected maximal open intervals of concavity are
\[(0,\tfrac13)\cup(\tfrac43,2),\]
choice C. The printed C splits the second interval at \(5/3\), reporting only where \(F''>0\). C is repaired to include that concave-up joining point while retaining its intended answer letter. On the flat pieces \(F\) is linear rather than strictly concave up; on the remaining curved or sloping pieces \(F'\) decreases.`,
  },
  {
    id: 10444, number: 322, division: "Mu",
    source: { ...kingFebruaryStatewide2025, questionNumber: 29 },
    topic: "Definite Integrals", difficulty: 2, methods: [],
    illustration: kingFebruaryStatewide2025Graph,
    question: String.raw`The diagram shows \(f(x)\), which is comprised of linear segments, a quarter circle, and a semicircle. It is defined on the interval \([-\frac12,\frac{15}2]\).

Define \(G(x)=k+\int_0^xf(t)\,dt\), where \(k\) is a real constant. If \(G(6)=\pi-3\), then find the value of \(G(1)\).`,
    choices: [String.raw`\(\frac{3-\pi}{2}\)`, String.raw`\(\frac{-2+\pi}{2}\)`, String.raw`\(\frac{1-\pi}{2}\)`, String.raw`\(\frac{5-\pi}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Let's consider the signed area underneath the function \(f(x)\) on the interval \(0\) to \(6\). This area is comprised of \(3\) right triangles with base and height of \(1\) (one above the \(x\)-axis, two below), two unit quarter-circle areas above the axis, and one square of side length \(1\) below the axis. Two triangles (one above, one below) cancel out in signed area, so the total integral is
\[\frac12\pi(1)^2-1^2-\frac12(1)(1)=\frac\pi2-\frac32.\]
The two quarter-circle contributions are on \([1,2]\) and \([5,6]\), respectively. Each contributes \(\pi/4\); together their areas equal a semicircle's area, although they belong to different circular arcs in the diagram.

Since \(G(6)=\pi-3\) and \(G(0)=k\), we get
\[k+\frac\pi2-\frac32=\pi-3,\qquad k=\frac\pi2-\frac32.\]
Finally, the triangle on \([0,1]\) contributes \(1/2\), giving
\[G(1)=\frac12+\frac\pi2-\frac32=\frac\pi2-1
=\frac{\pi-2}{2},\]
choice B.

The source's intermediate expression for \(k\) has its signs reversed; its subsequent substitution and final answer use the correct value shown above. A direct difference check avoids \(k\) altogether:
\[G(6)-G(1)=\int_1^6f(t)\,dt=\frac\pi2-2,\]
so \(G(1)=(\pi-3)-(\pi/2-2)=\pi/2-1\), confirming the result. Areas below the axis must be counted negatively in these accumulation integrals.`,
  },
];
