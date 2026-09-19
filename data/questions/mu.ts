import type { Question } from "@/types/question";

// 2025 MAO National Convention — Mu Individual Test.
// Original questions 21 and 29 were thrown out. The accepted set is renumbered 1–28.
// Question 17 was disputed to choice D.

export const muQuestions: Question[] = [
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  






























// 2023 MAO National Convention — Mu Individual Test.





























  

// 2026 MAO National Convention - Mu Individual Test.
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // 2026 FAMAT State Convention Calculus Individual Test.
  // Original question 26 was thrown out. Original question 25 was clarified
  // to remove its disputed NOTA reading, and question 29 uses the revised key.
  {
    id: 10119,
    number: 119,
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
    number: 120,
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
    number: 121,
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
    number: 122,
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
    number: 123,
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
    number: 124,
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
    number: 125,
    division: "Mu",
    topic: "Polar",
    difficulty: 3,
    methods: ["Distance Formula"],
    question: String.raw`There is one bee that moves along line segments on an imaginary path. Initially located at the origin \((0,0)\), the bee moves along the line \(y=x\) until it reaches the polar curve \(r=\cos\theta\), at which point it starts to move south to the point \(\left(\frac12,-\frac12\right)\). Finally, the bee returns to the origin along a line segment. What is the total distance traveled by the bee?`,
    choices: [String.raw`\(\sqrt2\)`, String.raw`\(2\sqrt2\)`, String.raw`\(\frac{\sqrt2}{2}\)`, String.raw`\(1+\sqrt2\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The curve \(r=\cos\theta\) is \(x^2+y^2=x\). On \(y=x\), the nonzero intersection satisfies \(2x^2=x\), so it is \((1/2,1/2)\). The three segment lengths are \(\sqrt2/2\), \(1\), and \(\sqrt2/2\). Their sum is \(1+\sqrt2\).`,
  },
  {
    id: 10126,
    number: 126,
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
    number: 127,
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
    number: 128,
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
    number: 129,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    question: String.raw`Let \(a,b\in\mathbb R\) such that \(a<b\). A bump function is a function of the form
\[f_{a,b}(x)=\begin{cases}e^{1/((x-a)(x-b))},&a<x<b,\\0,&x\ge b\text{ or }x\le a.\end{cases}\]
Compute the absolute maximum of the bump function \(f_{1/2,3/2}(x)\).`,
    choices: [String.raw`\(e^{-4}\)`, String.raw`\(e^{-2}\)`, String.raw`\(e^{-4/3}\)`, String.raw`\(e^4\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Inside the interval, the only critical point occurs where the derivative of \((x-a)(x-b)\) is zero, namely \(x=(a+b)/2=1\). The function is 0 at and outside the endpoints, while
\[f_{1/2,3/2}(1)=e^{1/((1/2)(-1/2))}=e^{-4}.\]
Thus the absolute maximum is \(e^{-4}\).`,
  },
  {
    id: 10130,
    number: 130,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`Luster is pouring salt into a glass jar that has the shape of a solid with height \(h\) cm and whose volume is given by \(V(h)=\frac5{18}\pi h^{3/2}\) cm\(^3\). Luster's rate of pouring salt is not constant, as he sometimes gets distracted, as is modeled by the function \(r(t)=e^{-t}\), where \(t\) is measured in minutes. After two minutes, the height of the salt in the glass jar is 4 cm. How rapidly is the height increasing at that moment?`,
    choices: [String.raw`\(\frac5{6\pi e}\)`, String.raw`\(\frac5{6\pi e^2}\)`, String.raw`\(\frac6{5\pi e}\)`, String.raw`\(\frac6{5\pi e^2}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Differentiate volume with respect to time:
\[\frac{dV}{dt}=\frac5{12}\pi\sqrt h\,\frac{dh}{dt}.\]
At \(t=2\), \(dV/dt=e^{-2}\) and \(h=4\), so
\[e^{-2}=\frac{5\pi}{6}\frac{dh}{dt},\qquad \frac{dh}{dt}=\frac6{5\pi e^2}.\]`,
  },
  {
    id: 10131,
    number: 131,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["Trigonometric Identities"],
    question: String.raw`An inner product on a vector space of continuous functions on the interval \([-\pi,\pi]\) is defined as
\[\langle f,g\rangle=\int_{-\pi}^{\pi}f(x)g(x)\,dx.\]
Compute \(\langle\sin2x,\sin3x\rangle+\langle\sin3x,\cos4x\rangle-\langle\sin4x,\sin4x\rangle\).`,
    choices: [String.raw`\(-2\pi\)`, String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Distinct integer-frequency sine functions are orthogonal on \([-\pi,\pi]\), as are sine and cosine functions. Hence the first two inner products are 0. Also
\[\int_{-\pi}^{\pi}\sin^2(4x)\,dx=\pi.\]
Therefore the expression equals \(-\pi\).`,
  },
  {
    id: 10132,
    number: 132,
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
    number: 133,
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
    number: 134,
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
    number: 135,
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
    number: 136,
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
    number: 137,
    division: "Mu",
    topic: "Series",
    difficulty: 4,
    methods: ["Limit Comparison Test", "Alternating Series Test"],
    question: String.raw`Consider the following numerical series:
\[(a)\quad\sum_{n=2}^{\infty}\frac{n^2}{\sqrt{1+n^5}},\]
\[(b)\quad\sum_{n=2}^{\infty}(-1)^n\frac{n^2-1}{n^3+1},\]
\[(c)\quad\sum_{n=1}^{\infty}(-1)^n\left(1-\cos\left(\frac1n\right)\right).\]
If the series in \((x)\) is absolutely convergent, assign 1 to letter \((x)\). If it converges conditionally, assign \(-1\). Otherwise, assign 0. Find \((a)+(b)+(c)\).`,
    choices: ["2", "1", "0", "−2", "NOTA"],
    answer: "C",
    solution: String.raw`For (a), compare the terms with \(1/\sqrt n\):
\[\lim_{n\to\infty}\frac{n^2/\sqrt{1+n^5}}{1/\sqrt n}
=\lim_{n\to\infty}\frac{n^{5/2}}{\sqrt{1+n^5}}=1.\]
Since \(\sum 1/\sqrt n\) diverges, the Limit Comparison Test shows that (a) diverges, so it contributes 0.

For (b),
\[\frac{n^2-1}{n^3+1}=\frac{(n-1)(n+1)}{(n+1)(n^2-n+1)}=\frac{n-1}{n^2-n+1}.\]
These positive magnitudes approach 0 and are eventually decreasing, so the Alternating Series Test gives convergence. Their ratio to \(1/n\) approaches 1, so the corresponding absolute-value series diverges by limit comparison with the harmonic series. Thus (b) converges conditionally and contributes \(-1\).

For (c), use the standard limit
\[\lim_{u\to0}\frac{1-\cos u}{u^2}=\frac12.\]
With \(u=1/n\), this gives
\[1-\cos(1/n)\sim\frac1{2n^2}.\]
Therefore the absolute-value series converges by comparison with \(\sum 1/n^2\), so (c) converges absolutely and contributes 1. The requested total is
\[0+(-1)+1=0.\]`,
  },
  {
    id: 10138,
    number: 138,
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
For completeness, \(a=1\) satisfies this critical-point equation. Also,
\[(D^2)''(x)=2+\frac{2(1-\ln x)}{x^2},\]
so \((D^2)''(1)=4>0\). Moreover, \(D^2(x)\to\infty\) as \(x\to0^+\) or \(x\to\infty\), confirming that this critical point gives the absolute minimum. Therefore the requested value is \(2\).`,
  },
  {
    id: 10139,
    number: 139,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 4,
    methods: [],
    question: String.raw`Compute
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
    number: 140,
    division: "Mu",
    topic: "Polar",
    difficulty: 4,
    methods: [],
    question: String.raw`Compute the perimeter of the polar curve \(r=\max(\sin\theta,\cos\theta)\) on the interval \(0\le\theta\le\pi\).`,
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
    number: 141,
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
    number: 142,
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
    number: 143,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: [],
    question: String.raw`An inverted conical tank with diameter equal to its height is leaking oil directly into a big cylindrical tank of height 20 inches and diameter 8 inches. Suppose the conical tank initially contains 5 gallons of oil and all leaked oil enters the cylindrical tank at a constant rate of \(\frac23\) gallons per half an hour. If the cylindrical container was initially empty, how rapidly (in cubic inches per hour) is its level increasing when there is exactly one gallon of oil in there? Note: \(1\text{ gal}=231\text{ in}^3\).`,
    choices: [String.raw`\(\frac{77}{8\pi}\)`, String.raw`\(\frac{77}{4\pi}\)`, String.raw`\(\frac{231}{8\pi}\)`, String.raw`\(\frac{231}{4\pi}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Oil enters the cylinder at
\[\frac43\text{ gal/hr}=\frac43(231)=308\text{ in}^3/\text{hr}.\]
The cylinder has radius 4, so \(V=16\pi h\). Hence
\[16\pi\frac{dh}{dt}=308,\qquad \frac{dh}{dt}=\frac{77}{4\pi}.\]
The stated one-gallon moment does not change this constant rate.`,
  },
  {
    id: 10144,
    number: 144,
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
    number: 145,
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
    number: 146,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: ["Trigonometric Identities"],
    question: String.raw`In the figure below, \(b\) is held constant. Evaluate
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
\[\frac{2\sqrt b}{\sqrt{2b}}=\boxed{\sqrt2}.\]`,
    illustration: {
      src: "/questions/mu-146-geometry.svg",
      alt: "Two adjacent right triangles with vertical sides a and b, bases x and y, diagonals c and d, and three angles labeled theta",
      width: 720,
      height: 360,
    },
  },
  {
    id: 10147,
    number: 147,
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
  // Existing bank questions 148–176; preserve their established IDs and numbering.
  {
    id: 10148,
    number: 148,
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
    number: 149,
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
    number: 150,
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
    number: 151,
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
    number: 152,
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
    number: 153,
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
\[r=2-\sqrt3.\]`,
  },
  {
    id: 10154,
    number: 154,
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
    number: 155,
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
    number: 156,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 5,
    methods: ["Homogeneous First-Order Equations"],
    question: String.raw`Find the general solution to the differential equation
\[\frac{dy}{dx}=\frac{3y^4-x^4}{xy^3}.\]`,
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
\[y^4=Kx^{12}+\frac{x^4}{2}.\]`,
  },
  {
    id: 10157,
    number: 157,
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
    solution: String.raw`For a left-hand Riemann sum, choose \(a=3\pi/2\) with 2 equal subintervals. One sampled endpoint lies above the axis while the other contributes no negative rectangle, producing a positive approximation. Similarly, for a right-hand Riemann sum, choose \(a=\pi/2\) with 2 equal subintervals; this also produces a positive approximation.

Every midpoint sum is 0 because the midpoint samples occur in symmetric pairs and \(\sin x\) is odd. Therefore only I and III can be positive.`,
  },
  {
    id: 10158,
    number: 158,
    division: "Mu",
    topic: "Limits",
    difficulty: 4,
    methods: [],
    question: String.raw`Evaluate:
\[\lim_{x\to-2}f(f(x))\]
where
\[f(x)=\begin{cases}
3-x&\text{if }x<-2,\\
\dfrac{4-x^2}{2}&\text{if }-2<x<2,\\
\dfrac{6x-21}{x-5}&\text{if }2<x<5,\\
\dfrac{2x-1}{3}&\text{if }x>5,
\end{cases}\]
and \(f(-2)=f(2)=f(5)=4\).`,
    choices: ["2", "3", "5", "DNE", "NOTA"],
    answer: "B",
    solution: String.raw`First evaluate the one-sided behavior of the inner function. As \(x\to-2^-\),
\[f(x)=3-x\to5^+,\]
while as \(x\to-2^+\),
\[f(x)=\frac{4-x^2}{2}\to2^+.\]
Therefore
\[\lim_{x\to-2^-}f(f(x))=\lim_{u\to5^+}f(u)=\lim_{u\to5^+}\frac{2u-1}{3}=3,\]
and
\[\lim_{x\to-2^+}f(f(x))=\lim_{u\to2^+}f(u)=\lim_{u\to2^+}\frac{6u-21}{u-5}=3.\]
The one-sided limits agree, so
\[\lim_{x\to-2}f(f(x))=3.\]`,
  },
  {
    id: 10159,
    number: 159,
    division: "Mu",
    topic: "Telescoping Series",
    difficulty: 5,
    methods: [],
    question: String.raw`Let \(H_k\) be the \(k^{\text{th}}\) harmonic sum, \(H_k=\sum_{n=1}^{k}\frac1n\). If
\[\sum_{n=46}^{\infty}\frac{8100}{n^3-2025n}=RH_Y-TH_M,\]
find the value of \(RY-TM\).`,
    choices: ["−12", "−3", "0", "6", "NOTA"],
    answer: "C",
    solution: String.raw`Write \(2025=45^2\). More generally, with \(a=45\),
\[\frac{4a^2}{n^3-a^2n}=\frac{4a^2}{n(n-a)(n+a)}
=-\frac4n+\frac2{n-a}+\frac2{n+a}.\]
Thus
\[\sum_{n=a+1}^{\infty}\frac{4a^2}{n^3-a^2n}
=\sum_{n=a+1}^{\infty}\left(-\frac4n+\frac2{n-a}+\frac2{n+a}\right).\]
The tails cancel, leaving
\[4H_a-2H_{2a}.\]
For \(a=45\), the given expression is
\[4H_{45}-2H_{90}.\]
Hence \(R=4\), \(Y=45\), \(T=2\), and \(M=90\), so
\[RY-TM=4(45)-2(90)=0.\]`,
  },
  {
    id: 10160,
    number: 160,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: [],
    question: String.raw`\(f(x)\) is a polynomial of degree 2025. The number of inflection points on the graph of \(y=f(x)\) is \(I\). The minimum possible value of \(I\) is \(m\), and the maximum possible value of \(I\) is \(M\). Find the ordered pair \((m,M)\).`,
    choices: ["(0, 2022)", "(0, 2023)", "(1, 2022)", "(1, 2023)", "NOTA"],
    answer: "D",
    solution: String.raw`Inflection points are found by investigating sign changes of \(f''(x)\). Since \(f\) has degree 2025, \(f''\) has degree 2023. Therefore it can have at most 2023 real zeros, and this maximum can be attained with 2023 distinct real roots, each producing a sign change. Thus \(M=2023\).

Because \(f''\) has odd degree, its values have opposite end behavior as \(x\to-\infty\) and \(x\to\infty\). It must therefore change sign at least once, so \(m=1\). Hence
\[(m,M)=(1,2023).\]`,
  },
  {
    id: 10161,
    number: 161,
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
    number: 162,
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
\[2a+b=-\frac ab,qquad c-a=-\frac cb.\]
The second equation yields
\[bc-ab=-c,\]
so
\[c(1+b)=ab,qquad \frac ca=\frac b{1+b}.\]`,
  },
  {
    id: 10163,
    number: 163,
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
    number: 164,
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
    number: 165,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 5,
    methods: [],
    question: String.raw`\(f(x)\) is a polynomial of unknown degree \(d\) with non-negative integer coefficients. Nick agrees that he will tell Manny the value of \(f(n)\) for any value of \(n\) Manny wants. Find the minimum number of values of \(n\) Manny would need to ask Nick to evaluate to guarantee that he can identify \(f(x)\) uniquely.`,
    choices: ["2", "3", String.raw`\(d\)`, String.raw`\(d+1\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Manny can ask for the value at a transcendental number, such as \(n=\pi\). Suppose two polynomials \(f\) and \(g\), both with non-negative integer coefficients, gave the same value there. Then
\[f(\pi)-g(\pi)=0.\]
But \(f-g\) is a polynomial with integer coefficients. If it were nonzero, this equation would make \(\pi\) algebraic, contradicting the fact that \(\pi\) is transcendental. Therefore \(f-g\) must be the zero polynomial and \(f=g\). One requested value is sufficient, and zero values clearly cannot identify the polynomial. The minimum is therefore 1, which is not listed, so the answer is NOTA.`,
  },
  {
    id: 10166,
    number: 166,
    division: "Mu",
    topic: "Optimization",
    difficulty: 5,
    methods: ["Implicit Differentiation", "First Derivative Test"],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G\) of
\[2xy^2-x^3=y^4\]
in the first quadrant. \(\mathcal G\) is a closed loop and can be separated into a portion that is concave up and a portion that is concave down.

The line \(y=y_0\) intersects \(\mathcal G\). If the maximum possible value of \(y_0\) is \(\frac{A\sqrt B}{C}\) in simplest form, find \(A+B+C\).`,
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
\[A+B+C=19.\]`,
  },
  {
    id: 10167,
    number: 167,
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
As the concave up branch approaches the origin, write \(y\sim mx\). In the original equation, the fourth-degree term \(y^4\) approaches 0 faster than the cubic terms, so the leading relation is
\[2x(mx)^2-x^3\sim0.\]
Thus
\[2m^2-1=0.\]
The first-quadrant branch has positive slope, so
\[m=\frac1{\sqrt2}=\frac{\sqrt2}{2}.\]`,
  },
  {
    id: 10168,
    number: 168,
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
As \(x\to0^+\), this satisfies \(y^2\sim2x\), so \(y\sim\sqrt{2x}\). Therefore
\[\frac{dy}{dx}\sim\frac1{\sqrt{2x}}\to+\infty.\]
Equivalently, setting \(x=0\) in the implicit derivative expression gives \(dy/dx=1/(2y)\), which becomes unbounded as \(y\to0^+\). No finite choice A–D is correct, so the answer is NOTA.`,
  },
  {
    id: 10169,
    number: 169,
    division: "Mu",
    topic: "Polar Area",
    difficulty: 4,
    methods: ["U-Substitution"],
    question: String.raw`Use the following information. Consider the graph \(\mathcal G\) of
\[2xy^2-x^3=y^4\]
in the first quadrant. \(\mathcal G\) is a closed loop and can be separated into a portion that is concave up and a portion that is concave down.

Let the area of the portion of \(\mathcal G\) above the line \(y=x\) equal \(\frac AB\). Find \(A+B\).`,
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
    number: 170,
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
    number: 171,
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
    number: 172,
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
\[2\sqrt2+2+2+2\sqrt2=4\sqrt2+4.\]`,
  },
  {
    id: 10173,
    number: 173,
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
    solution: String.raw`The smallest even value is \(n=2\), which gives the unit circle, so the minimum area is \(\pi\). As even \(n\to\infty\), the graph approaches the square with vertices \((1,1)\), \((-1,1)\), \((-1,-1)\), and \((1,-1)\), whose area is 4. No finite \(n\) produces the square itself, so 4 is approached but not attained. Therefore the most restrictive interval is
\[[\pi,4).\]`,
  },
  {
    id: 10174,
    number: 174,
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
    number: 175,
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
    number: 176,
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
The two factors have difference \(6p\), so both must be divisible by 6. It follows that \(q\) must be divisible by 3. Trying the smallest possibility \(|q|=3\), we seek factors of
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
  // Original questions 1–30 map to bank questions 177–206 (IDs 10177–10206).
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
  // Q30 supplies the preceding result, matching the source's one-step solution;
  // its standalone difficulty is consequently 1, not the difficulty of Q29.
  {
    id: 10177,
    number: 177,
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
    number: 178,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
question: String.raw`If \(\lim_{x\to2}f(x)=4\) and \(\lim_{x\to4}f(x)=3\), compute \(\displaystyle\lim_{x\to2}[2\cdot f(x)+f(f(x))]\). Assume additionally that \(f\) is continuous at \(4\).`,
    choices: ["11", "12", "10", "7", "NOTA"],
    answer: "A",
solution: String.raw`Since \(f\) is continuous at \(4\), we can see that \(\lim_{x\to2}f(f(x))=\lim_{u\to4}f(u)=3\), so the desired limit is \(2(4)+3=\boxed{11}\).`,
  },
  {
    id: 10179,
    number: 179,
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
    number: 180,
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
    number: 181,
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
    number: 182,
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
    number: 183,
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
    number: 184,
    division: "Mu",
    topic: "Area Between Curves",
    difficulty: 2,
    methods: [],
question: String.raw`Find the total area of all finite regions bounded by the graph of \(y=x^3-x\) and the \(x\)-axis.`,
    choices: [String.raw`\(\frac14\)`, "0", String.raw`\(\frac32\)`, String.raw`\(\frac12\)`, "NOTA"],
    answer: "D",
solution: String.raw`Factoring \(x-x^3=x(1+x)(1-x)\), we have roots at \(x=-1,0,1\), thus the finite regions are for \(-1\le x\le0\) and \(0\le x\le1\). We can compute \(\int_{-1}^0(x-x^3)\,dx=\left[\frac{x^2}{2}-\frac{x^4}{4}\right]_{-1}^0=-\frac14\) and \(\int_0^1(x-x^3)\,dx=\left[\frac{x^2}{2}-\frac{x^4}{4}\right]_0^1=\frac14\), so each region has an area of \(\frac14\), for a total area of \(\boxed{\frac12}\).`,
  },
  {
    id: 10185,
    number: 185,
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
    number: 186,
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
    number: 187,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["First Derivative Test"],
question: String.raw`Legom has monopolized the egg sandwich market. If she produces \(x\) egg sandwiches (where \(0\le x\le36\)), she can sell them for a price of \(\sqrt{36-x}\) each. If Legom wants to maximize her revenue, how many egg sandwiches should she produce?`,
    choices: ["12", "24", "18", "27", "NOTA"],
    answer: "B",
solution: String.raw`If she sells \(x\) sandwiches for \(\sqrt{36-x}\) each, her total revenue is \(x\sqrt{36-x}\). Maximising this is equivalent to maximising its square, \(36x^2-x^3\). Taking the derivative gives \(72x-3x^2\), which is 0 when \(x=0,24\). Of these, it’s not hard to check that \(x=\boxed{24}\) corresponds to a maximum.`,
  },
  {
    id: 10188,
    number: 188,
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
    number: 189,
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
    number: 190,
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
    number: 191,
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
    number: 192,
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
So the original limit is \(1\cdot1\cdot\frac1e=\boxed{\frac1e}\).`,
  },
  {
    id: 10193,
    number: 193,
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
    number: 194,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 3,
    methods: [],
question: String.raw`Evaluate \(\displaystyle\int_0^{2024\pi}\frac1{\sqrt{\arccos(\cos(x))}}\,dx\).`,
    choices: [String.raw`\(2024\sqrt\pi\)`, String.raw`\(1012\sqrt\pi\)`, String.raw`\(4048\sqrt\pi\)`, String.raw`\(9096\sqrt\pi\)`, "NOTA"],
    answer: "C",
solution: String.raw`Note that \(\arccos(\cos(x))\) consists of a bunch of “triangles”.
[[solution-diagram:mu-194]]
It thus suffices to calculate the integral from 0 to \(\pi\) and multiply by 2024. For \(0\le x\le\pi\), \(\arccos(\cos(x))=x\), so \(\int_0^\pi\frac1{\sqrt{\arccos(\cos(x))}}\,dx=\int_0^\pi\frac1{\sqrt x}\,dx=[2\sqrt x]_0^\pi=2\sqrt\pi\), and multiplying by 2024 gives \(\boxed{4048\sqrt\pi}\).`,
  },
  {
    id: 10195,
    number: 195,
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
    number: 196,
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
Taking the derivative gives \(\frac\pi6(2x+3-\frac1{x^2})\), which is 0 if and only if \(2x+3=\frac1{x^2}\Rightarrow2x^3+3x^2-1=0\). Rational root theorem then motivates us to check \(x=\frac12\), so we can factor as \((2x-1)(x^2+2x+1)=0\Rightarrow x=\frac12,-1\). Only \(x=\frac12\) makes sense, and it’s not hard to check it corresponds to a minimum volume of \(\boxed{\frac{9\pi}8}\).`,
  },
  {
    id: 10197,
    number: 197,
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

For reference, the actual value of the sum is approximately \(0.00011782\ldots\).`,
  },
  {
    id: 10198,
    number: 198,
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
    number: 199,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 4,
    methods: ["Disk Method", "U-Substitution"],
question: String.raw`Legom’s eggs can be modeled by the equation \(x^2+y^2=z(1-z)^{3/2}\). Compute the volume of such an egg.`,
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
    number: 200,
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
    number: 201,
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
Plugging in \(a=7\), \(b=5\), \(c=3\), \(A=\frac{2\pi}3\), \(a'=b'=0\), and \(A'=2\) gives \(0=0+6c'+5c'+30\sqrt3\), so \(c'=-\frac{30\sqrt3}{11}\). The desired speed is precisely \(|c'|=\boxed{\frac{30\sqrt3}{11}}\).`,
  },
  {
    id: 10202,
    number: 202,
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
=\frac12\left(\frac2{3+\sqrt2}+\frac2{3-\sqrt2}\right)=\boxed{\frac67}.\]`,
  },
  {
    id: 10203,
    number: 203,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 5,
    methods: ["Arc Length"],
question: String.raw`Suppose \(f\) is a continuous function that takes on non-negative real values such that \(\int_0^3f(x)\,dx=4\). If \(S\) is the set of all possible values of \(\int_0^3\sqrt{1+(f(x))^2}\,dx\), compute \(\sup(S)+\inf(S)\). Here \(\sup(S)\) is the least upper bound of \(S\), and \(\inf(S)\) is the greatest lower bound.`,
    choices: ["10", "9", "12", "15", "NOTA"],
    answer: "C",
solution: String.raw`Note that the desired integral looks like an arc length integral, just with \(f(x)\) instead of \(f'(x)\). This motivates us to set \(F(x)=\int_0^x f(t)\,dt\), recalling that \(F'(x)=f(x)\) by the first fundamental theorem of calculus. The given conditions then become that \(F\) is a nondecreasing function with \(F(0)=0\) and \(F(3)=4\), and we are interested in the arc length of \(F\) between \(x=0\) and \(x=3\). The shortest possible arc length is given by a straight line, which has length \(\sqrt{3^2+4^2}=5\). Note that the graph of \(F\) moves up 4 units and right 3 units, for a total of 7 units, and any diagonal movement decreases this sum, so 7 is an upper bound. We can get arbitrarily close to 7 by taking a piecewise linear function passing through \((0,0)\), \((3-\varepsilon,0)\), and \((3,4)\), for arbitrarily small \(\varepsilon\), and smoothing its corner while preserving the endpoints and nonnegative slope so that \(F'=f\) is continuous. Thus the possible arc lengths are \(S=[5,7)\), so \(\sup(S)+\inf(S)=7+5=\boxed{12}\).`,
  },
  {
    id: 10204,
    number: 204,
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
    number: 205,
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
The former term goes to 0 (at both 0 and the infinities) and the latter term is a constant multiple of \(I_n\), so we can simplify to \(I_{n+1}=\frac{2n+1}{2}I_n\). Iterating this yields \(I_n=\frac{(2n-1)(2n-3)\cdots(3)(1)}{2^n}I_0\). The numerator can be written as \(\frac{(2n)!}{2^n(n!)}\) (the denominator removes the even terms), so \(I_n=\frac{(2n)!}{4^n(n!)}I_0\). By Stirling’s approximation, this is approximately
\[\frac{\sqrt{2\pi(2n)}(2n/e)^{2n}}{4^n\sqrt{2\pi n}(n/e)^n}I_0
=\frac{\sqrt2\,n^n}{e^n}I_0\]
as \(n\) grows large.
Thus \(f(n)=\boxed{\left(\frac ne\right)^n}\) gives \(L=\lim_{n\to\infty}\frac{I_n}{f(n)}=\sqrt2 I_0\), which is finite and nonzero.`,
  },
  {
    id: 10206,
    number: 206,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Stirling's Approximation"],
question: String.raw`Let
\[I_n=\int_{-\infty}^{\infty}x^{2n}e^{-x^2}\,dx
=\frac{(2n)!}{4^n n!}\sqrt\pi.\]
Using Stirling's approximation \(n!\sim\sqrt{2\pi n}(n/e)^n\), compute
\[\lim_{n\to\infty}\frac{I_n}{(n/e)^n}.\]`,
    choices: [String.raw`\(\pi\sqrt2\)`, String.raw`\(\frac{\pi\sqrt2}{2}\)`, String.raw`\(\frac{\sqrt{2\pi}}2\)`, String.raw`\(\sqrt{2\pi}\)`, "NOTA"],
    answer: "D",
solution: String.raw`Apply Stirling's approximation to the given formula:
\[I_n\sim\frac{\sqrt{4\pi n}(2n/e)^{2n}}{4^n\sqrt{2\pi n}(n/e)^n}\sqrt\pi
=\sqrt{2\pi}\left(\frac ne\right)^n.\]
Therefore
\[\lim_{n\to\infty}\frac{I_n}{(n/e)^n}=\boxed{\sqrt{2\pi}}.\]`,
  },
  // FAMAT January Statewide Calculus Individual Test.
  // Source questions 1–27 map to bank questions 207–233. Source question 28
  // was thrown out and is excluded. Source questions 29–30 map to 234–235.
  // Questions 222, 232, and 233 use the final accepted wording and choices.
  {
    id: 10207,
    number: 207,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Evaluate \(\displaystyle\lim_{x\to-1}f(x)\). Select DNE if you believe the limit does not exist.`,
    illustration: {
      src: "/questions/mu-207-210-graphs.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1100,
      height: 480,
    },
    choices: ["−1", "3", "4", "DNE", "NOTA"],
    answer: "D",
    solution: String.raw`The left-hand and right-hand limits are different; therefore, the limit does not exist.`,
  },
  {
    id: 10208,
    number: 208,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Determine \(\displaystyle\lim_{x\to-1}[f(x)g(x)]\). Select DNE if you believe the limit does not exist.`,
    illustration: {
      src: "/questions/mu-207-210-graphs.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1100,
      height: 480,
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
    number: 209,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Determine \(\displaystyle\lim_{x\to0^-}f(g(x))\). Select DNE if you believe the limit does not exist.`,
    illustration: {
      src: "/questions/mu-207-210-graphs.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1100,
      height: 480,
    },
    choices: ["1", "3", "4", "DNE", "NOTA"],
    answer: "B",
    solution: String.raw`\(\displaystyle\lim_{x\to0^-}g(x)=-1\). As this value is approached from above, the outer limit of \(f(x)\) is approached from the right. Thus,
\[\lim_{x\to0^-}f(g(x))=\lim_{x\to-1^+}f(x)=3.\]`,
  },
  {
    id: 10210,
    number: 210,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 1,
    methods: [],
    question: String.raw`Use the figures representing the graphs of the piecewise functions \(f(x)\) (left) and \(g(x)\) (right). The graph of \(f\) has asymptotes at \(x=-2\), \(y=2\), and \(y=1\); the graph of \(g\) has an asymptote at \(x=1\).

Determine the product of \(f(-1)\) and \(g(-3)\).`,
    illustration: {
      src: "/questions/mu-207-210-graphs.svg",
      alt: "Graphs of the piecewise functions f and g used in MU questions 207 through 210",
      width: 1100,
      height: 480,
    },
    choices: ["−2", "−1", "1", "DNE", "NOTA"],
    answer: "E",
    solution: String.raw`From the filled points on the graphs, \(f(-1)=1\) and \(g(-3)=3\). Thus \(f(-1)g(-3)=3\), which is not an answer choice.`,
  },
  {
    id: 10211,
    number: 211,
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
For large values of \(n\), this has the same limit as \(\left(1+\frac5n\right)^n\), so the limit is \(e^5\).`,
  },
  {
    id: 10212,
    number: 212,
    division: "Mu",
    topic: "Linear Approximation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`Given the function \(f(x)\) defined by the curve \(\arctan(y)=x+\frac12y\), use the line tangent to the curve at \(f\!\left(\frac{\pi-\sqrt3}{6}\right)=\frac1{\sqrt3}\) to approximate \(f\!\left(\frac35\right)\).`,
    choices: [String.raw`\(\frac{\sqrt3}{3}+\frac{10\pi-36-10\sqrt3}{15}\)`, String.raw`\(\sqrt3+\frac{10\pi-36-10\sqrt3}{15}\)`, String.raw`\(\frac{\sqrt3}{3}+\frac{36-10\pi}{15}\)`, String.raw`\(\sqrt3+\frac{36-10\pi}{15}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Differentiate implicitly:
\[\frac1{1+y^2}y'=1+\frac12y'.\]
At \(y=1/\sqrt3\), this gives \(y'=4\). The tangent-line approximation is therefore
\[f\!\left(\frac35\right)\approx\frac1{\sqrt3}+4\left(\frac35-\frac{\pi-\sqrt3}{6}\right)
=\sqrt3+\frac{36-10\pi}{15}.\]`,
  },
  {
    id: 10213,
    number: 213,
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
    solution: String.raw`The function is differentiable over the open interval and continuous on the closed interval, so the MVT applies. Although \(f'\) is unbounded near \(0\), this does not invalidate the application of the MVT.`,
  },
  {
    id: 10214,
    number: 214,
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
    number: 215,
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
    number: 216,
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
    number: 217,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: ["Related Rates"],
    question: String.raw`A circle is inscribed inside a square which is, in turn, inscribed inside an equilateral triangle. At the moment when a side length of the square is \(6\text{ cm}\), the area of the circle is increasing at a rate of \(3\text{ cm}^2/\text{sec}\). At this instant, what is the rate at which the area of the equilateral triangle is increasing in \(\text{cm}^2/\text{sec}\)?`,
    choices: [String.raw`\(\frac{24+14\sqrt3}{\pi}\)`, String.raw`\(\frac{24+14\sqrt3}{3\pi}\)`, String.raw`\(\frac{12+7\sqrt3}{\pi}\)`, String.raw`\(\frac{48+28\sqrt3}{3\pi}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(s\) be the side length of the square. The inscribed circle has radius \(r=s/2\), so
\[A_c=\frac\pi4s^2,\qquad \frac{dA_c}{dt}=\frac\pi2s\frac{ds}{dt}.\]
At \(s=6\) and \(dA_c/dt=3\), we obtain \(ds/dt=1/\pi\).

Let \(a\) be the side length of the equilateral triangle. Comparing the triangle above the square with the full triangle using similar triangles gives
[[solution-diagram:mu-217]]
\[a=s\left(1+\frac2{\sqrt3}\right).\]
Thus
\[A_t=\frac{\sqrt3}{4}a^2=\left(1+\frac{7\sqrt3}{12}\right)s^2.\]
Therefore, at \(s=6\),
\[\frac{dA_t}{dt}=2\left(1+\frac{7\sqrt3}{12}\right)s\frac{ds}{dt}
=\frac{12+7\sqrt3}{\pi}.\]`,
  },
  {
    id: 10218,
    number: 218,
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
    number: 219,
    division: "Mu",
    topic: "Inverse Functions",
    difficulty: 2,
    methods: ["Derivative of Inverse Functions"],
    question: String.raw`Given that \(f(x)=x^3-2x+2\), and given that \(g(x)\) is the inverse of \(f(x)\), determine the value of \((g'(6))^3\).`,
    choices: [String.raw`\(\frac1{1000}\)`, String.raw`\(\frac1{100}\)`, String.raw`\(\frac1{27}\)`, String.raw`\(\frac1{12}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Since \(f(2)=6\), the inverse-function derivative formula gives
\[g'(6)=\frac1{f'(2)}.\]
Because \(f'(x)=3x^2-2\), we have \(f'(2)=10\). Therefore,
\[(g'(6))^3=\left(\frac1{10}\right)^3=\frac1{1000}.\]`,
  },
  {
    id: 10220,
    number: 220,
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
Integrating the three terms, using integration by parts as needed, gives
\[\int_0^1e^{2x}(1+x+x^2)\,dx=e^2-\frac12=\frac{2e^2-1}{2}.\]`,
  },
  {
    id: 10221,
    number: 221,
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
Collecting the \(y'\) terms and multiplying the numerator and denominator by \(xy\) gives
\[\frac{dy}{dx}=\frac{-2x^2y^4-xy^2e^{xy}+y+xy^3}{3x^3y^3+x^2ye^{xy}-x-2x^2y^2}.\]`,
  },
  {
    id: 10222,
    number: 222,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: ["L'Hopital's Rule"],
    question: String.raw`Evaluate
\[\lim_{x\to0}\left(1+\frac{\ln(1+x^2)}{\sin^2x}\right)^{1/\tan^2x}.\]
If the limit does not approach a finite real number, then select DNE.`,
    choices: ["1", String.raw`\(e^{1/3}\)`, String.raw`\(e^{1/2}\)`, "DNE", "NOTA"],
    answer: "D",
    solution: String.raw`As \(x\to0\),
\[\frac{\ln(1+x^2)}{\sin^2x}\to1,\]
so the base approaches \(2\), while \(1/\tan^2x\to+\infty\). Hence the expression grows without bound and does not approach a finite real number. Therefore the answer is DNE.`,
  },
  {
    id: 10223,
    number: 223,
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
\[\frac{|2-(-1)|}{\sqrt{2^2+(-1)^2}}=\frac3{\sqrt5}.\]`,
  },
  {
    id: 10224,
    number: 224,
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
    number: 225,
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
    number: 226,
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
    number: 227,
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
The four symmetric intersection points produce slopes in opposite pairs, so their sum is \(0\), which is not an answer choice.`,
  },
  {
    id: 10228,
    number: 228,
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
Integration by parts gives
\[2\left[x^2\sin x+2x\cos x-2\sin x\right]_0^{\pi/2}
=\frac{\pi^2}{2}-4=\frac{\pi^2-8}{2}.\]`,
  },
  {
    id: 10229,
    number: 229,
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
    number: 230,
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
    number: 231,
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
Finally let \(w=1-v\). Expanding and integrating gives
\[4\int_0^1\left(2w^{3/2}-3w^{5/2}+w^{9/2}\right)dw
=4\left(\frac45-\frac67+\frac2{11}\right)
=\frac{208}{315}.\]`,
  },
  {
    id: 10232,
    number: 232,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 3,
    methods: [],
    question: String.raw`Given that \(h''(x)=p''(x)\), \(p(2)=5\), \(h(2)=3\), \(h(-2)=7\), and \(p(x)\) is an even monomial function with degree greater than \(1\), which of the following could be the value of the coefficient of the linear term of \(h(x)\)?`,
    choices: ["−3", "−1", "2", "7", "NOTA"],
    answer: "B",
    solution: String.raw`Since \(h''(x)=p''(x)\), integrating twice gives
\[h(x)=p(x)+C_1x+C_2.\]
Because \(p\) is even, \(p(-2)=p(2)=5\). The two given values of \(h\) therefore yield
\[3=5+2C_1+C_2,\qquad 7=5-2C_1+C_2.\]
Subtracting gives \(-4=4C_1\), so \(C_1=-1\).`,
  },
  {
    id: 10233,
    number: 233,
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
Partial fractions give
\[\sum_{n=1}^{\infty}\frac1{n(n+2)}=\frac34,\qquad
\sum_{n=1}^{\infty}\frac1{(n+1)(n+3)}=\frac5{12}.\]
Therefore,
\[\ln P=6\ln2\left(\frac34\right)-2\ln2\left(\frac5{12}\right)
=\frac{11}{3}\ln2,\]
so \(P=2^{11/3}\).`,
  },
  {
    id: 10234,
    number: 234,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`Evaluate
\[\lim_{x\to\infty}\frac1{1+\frac1{1+\frac1x}}.\]`,
    choices: ["0", String.raw`\(\frac12\)`, String.raw`\(\frac1e\)`, String.raw`\(e\)`, "NOTA"],
    answer: "B",
    solution: String.raw`As \(x\to\infty\), \(1/x\to0\). Therefore,
\[\frac1{1+\frac1{1+\frac1x}}\to\frac1{1+\frac1{1+0}}=\frac12.\]`,
  },
  {
    id: 10235,
    number: 235,
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
\[9\int\sec^3\theta\,d\theta-8\int\sec\theta\,d\theta.\]
Integration by parts gives
\[\int\sec^3\theta\,d\theta=\frac12\sec\theta\tan\theta+\frac12\ln|\sec\theta+\tan\theta|.\]
Substituting back yields
\[\frac{x-3}{2}\sqrt{x^2-6x+18}
-\frac72\ln\left|\frac{\sqrt{x^2-6x+18}+x-3}{3}\right|+C.\]`,
  },
  // 2026 FAMAT January Regional Calculus Individual Test.
  // Source questions 1–30 map to bank questions 236–265 (IDs 10236–10265).
  {
    id: 10236,
    number: 236,
    division: "Mu",
    topic: "Continuity",
    difficulty: 2,
    methods: ["Intermediate Value Theorem"],
    question: String.raw`How many of the following functions can be shown to have a root on the interval \([-2,1]\) due to the application of the Intermediate Value Theorem?
\[f_1(x)=\frac{x}{x-2},\quad f_2(x)=\frac{x}{x+1},\quad f_3(x)=2x^2+5,\quad f_4(x)=2\sin(3x)+5\]`,
    choices: ["0", "1", "2", "3", "NOTA"],
    answer: "C",
    solution: String.raw`The Intermediate Value Theorem requires continuity on a closed interval and values of opposite signs at its endpoints. Functions \(f_3\) and \(f_4\) cannot be shown to have roots because they are always positive. Function \(f_1\) is continuous on \([-2,1]\), with \(f_1(-2)>0\) and \(f_1(1)<0\). Although \(f_2\) is not continuous on all of \([-2,1]\), it is continuous on \([-1/2,1]\), where \(f_2(-1/2)<0\) and \(f_2(1)>0\). Thus two functions can be shown to have roots.`,
  },
  {
    id: 10237,
    number: 237,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 1,
    methods: [],
    question: String.raw`What are the equations of all asymptotes of the function
\[f(x)=\frac{\sqrt{x^2-9}}{x-3}?\]`,
    choices: [String.raw`\(y=1,\ y=-1,\ x=-3\)`, String.raw`\(y=0,\ x=3\)`, String.raw`\(y=1,\ x=3\)`, String.raw`\(y=1,\ y=-1,\ x=3\)`, "NOTA"],
    answer: "D",
    solution: String.raw`There is a vertical asymptote at \(x=3\) because \(f(x)\to\infty\) as \(x\to3^+\). As \(x\to\infty\), \(f(x)\to1\), while as \(x\to-\infty\), \(f(x)\to-1\). Thus the horizontal asymptotes are \(y=1\) and \(y=-1\).`,
  },
  {
    id: 10238,
    number: 238,
    division: "Mu",
    topic: "Continuity",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the graph of \(f(x)\) shown below on the interval \([-5,6]\). The function is not defined for \(x<-5\) or \(x>6\), and there is a vertical tangent line at \(x=2\).

For how many values of \(x\) on \([-5,6]\) is \(f\) discontinuous?`,
    illustration: {
      src: "/questions/mu-238-240-graph.svg",
      alt: "Piecewise graph of f on the closed interval from negative 5 to 6",
      width: 760,
      height: 520,
    },
    choices: ["3", "4", "5", "6", "NOTA"],
    answer: "A",
    solution: String.raw`The function is discontinuous at three values: \(x=-1\) (jump), \(x=1\) (removable), and \(x=4\) (jump).`,
  },
  {
    id: 10239,
    number: 239,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the graph of \(f(x)\) shown below on the interval \([-5,6]\). The function is not defined for \(x<-5\) or \(x>6\), and there is a vertical tangent line at \(x=2\).

For how many values of \(x\) on \((-5,6)\) is \(f\) non-differentiable?`,
    illustration: {
      src: "/questions/mu-238-240-graph.svg",
      alt: "Piecewise graph of f on the closed interval from negative 5 to 6",
      width: 760,
      height: 520,
    },
    choices: ["3", "4", "5", "6", "NOTA"],
    answer: "D",
    solution: String.raw`The function is non-differentiable at six values: the three discontinuities \(x=-1,1,4\), together with \(x=-3\) (cusp), \(x=2\) (vertical tangent), and \(x=5\) (corner).`,
  },
  {
    id: 10240,
    number: 240,
    division: "Mu",
    topic: "Continuity",
    difficulty: 2,
    methods: [],
    question: String.raw`Use the graph of \(f(x)\) shown below on the interval \([-5,6]\). The function is not defined for \(x<-5\) or \(x>6\), and there is a vertical tangent line at \(x=2\).

At what value \(a\) do both \(\displaystyle\lim_{x\to a}f(x)\) and \(f(a)\) exist, but \(\displaystyle\lim_{x\to a}f(x)\ne f(a)\)?`,
    illustration: {
      src: "/questions/mu-238-240-graph.svg",
      alt: "Piecewise graph of f on the closed interval from negative 5 to 6",
      width: 760,
      height: 520,
    },
    choices: ["−3", "−1", "1", "4", "NOTA"],
    answer: "C",
    solution: String.raw`The given property describes a removable discontinuity. The only removable discontinuity occurs at \(x=1\), where the curve has a hole and \(f(1)\) is defined at a different value.`,
  },
  {
    id: 10241,
    number: 241,
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
    number: 242,
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
    number: 243,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`If \(y=\frac14\sin(2x)\), what is \(\frac{d^{99}y}{dx^{99}}\)?`,
    choices: [String.raw`\(2^{98}\sin(2x)\)`, String.raw`\(-2^{98}\sin(2x)\)`, String.raw`\(-2^{97}\cos(2x)\)`, String.raw`\(-2^{98}\cos(2x)\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The derivatives of sine repeat with period four, while each derivative contributes a factor of \(2\). The \(n\)th derivative has coefficient \(2^{n-2}\). Since the 99th derivative has the same trigonometric form as the third derivative, it equals
\[-2^{97}\cos(2x).\]`,
  },
  {
    id: 10244,
    number: 244,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["First Derivative Test"],
    question: String.raw`If \(f'(x)=-2x^2(x-1)(x+2)\), which statement is true about \(f\)?`,
    choices: [String.raw`\(f\) has a local maximum at \(x=-2\) and a local minimum at \(x=1\).`, String.raw`\(f\) has a local maximum at \(x=1\) and a local minimum at \(x=-2\).`, String.raw`\(f\) has a local maximum at \(x=-2\) and no local minimum.`, String.raw`\(f\) has local maxima at \(x=-2\) and \(x=0\) and a local minimum at \(x=1\).`, "NOTA"],
    answer: "B",
    solution: String.raw`The critical values are \(x=-2,0,1\). A sign chart shows that \(f'\) is negative, positive, positive, and negative on the four resulting intervals. Therefore \(f\) has a local minimum at \(x=-2\), no extremum at \(x=0\), and a local maximum at \(x=1\).`,
  },
  {
    id: 10245,
    number: 245,
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
    number: 246,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["First Derivative Test"],
    question: String.raw`A right circular cylinder is inscribed in a sphere of radius \(6\). What is the maximum volume of the cylinder?`,
    choices: [String.raw`\(48\pi\sqrt3\)`, String.raw`\(64\pi\sqrt3\)`, String.raw`\(96\pi\sqrt3\)`, String.raw`\(108\pi\sqrt3\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(r\) be the cylinder's radius and \(h\) half its height. Then \(r^2+h^2=36\), so
\[V=\pi r^2(2h)=2\pi(36-h^2)h=72\pi h-2\pi h^3.\]
Thus \(V'(h)=72\pi-6\pi h^2\), which is zero when \(h=2\sqrt3\). Since \(V''(h)<0\), this gives the maximum:
\[V=72\pi(2\sqrt3)-2\pi(2\sqrt3)^3=96\pi\sqrt3.\]`,
  },
  {
    id: 10247,
    number: 247,
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
Summing gives \(x_n^2=4n+O(\ln n)\), so \(x_n/(2\sqrt n)\to1\). Since \(a_n=(x_n-1)/2\),
\[\lim_{n\to\infty}\frac{a_n}{\sqrt n}=1,\]
which is NOTA.`,
  },
  {
    id: 10248,
    number: 248,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 5,
    methods: ["Cauchy-Schwarz Inequality"],
    question: String.raw`If \(f\) is a continuously differentiable, real-valued function on \([0,1]\) such that \(f(0)=0\), find the rational number which is the least upper bound of
\[\frac{\left(\int_0^1f(x)\,dx\right)^2}{\int_0^1(f'(x))^2\,dx}.\]
If the maximum can be written in the form \(a/b\), where \(a\) and \(b\) are relatively prime, what is the remainder when \(a+b\) is divided by \(6\)?`,
    choices: ["5", "4", "3", "2", "NOTA"],
    answer: "B",
    solution: String.raw`Since \(f(0)=0\), write \(f(x)=\int_0^x f'(t)\,dt\). Reversing the order of integration gives
\[\int_0^1f(x)\,dx=\int_0^1(1-t)f'(t)\,dt.\]
By Cauchy-Schwarz,
\[\left(\int_0^1(1-t)f'(t)\,dt\right)^2
\le\left(\int_0^1(1-t)^2dt\right)\left(\int_0^1(f'(t))^2dt\right)
=\frac13\int_0^1(f'(t))^2dt.\]
Equality occurs when \(f'(t)=c(1-t)\), so the maximum is \(1/3\). Thus \(a+b=4\), whose remainder modulo \(6\) is \(4\).`,
  },
  {
    id: 10249,
    number: 249,
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
    number: 250,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 3,
    methods: [],
    question: String.raw`Three functions, \(p\), \(r\), and \(s\), are graphed. Which correctly matches how the graphs relate?`,
    illustration: {
      src: "/questions/mu-250-derivative-graphs.svg",
      alt: "Three curves labeled p, r, and s for identifying first- and second-derivative relationships",
      width: 760,
      height: 430,
    },
    choices: [String.raw`\(r=s',\ p=s''\)`, String.raw`\(s=r',\ p=r''\)`, String.raw`\(p=r',\ s=r''\)`, String.raw`\(p=s',\ r=s''\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The zeros of \(r\) correspond with the local extrema of \(s\), showing that \(s'=r\). Similarly, the zeros of \(p\) correspond to the local extrema of \(r\), showing that \(r'=p\), and therefore \(s''=p\).`,
  },
  {
    id: 10251,
    number: 251,
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
    number: 252,
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
    number: 253,
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
    number: 254,
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
    number: 255,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`Use the following table for differentiable functions \(f\) and \(g\).
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
    number: 256,
    division: "Mu",
    topic: "Probability",
    difficulty: 5,
    methods: ["Integration by Parts", "Infinite Series"],
    question: String.raw`What is the probability that \(\displaystyle\int_0^1x^n\tan^{-1}x\,dx\) is rational if \(n\) is a positive integer?`,
    choices: [String.raw`\(\frac3{4e}\)`, String.raw`\(\frac{\sqrt2}{6}\)`, String.raw`\(\frac14\)`, String.raw`\(\frac3{4\pi}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let
\[I_n=\int_0^1x^n\tan^{-1}x\,dx.\]
Integration by parts gives
\[I_n=\frac1{n+1}\left(\frac\pi4-\int_0^1\frac{x^{n+1}}{1+x^2}\,dx\right).\]
For odd \(n\), repeatedly using
\[\frac{x^{m}}{1+x^2}=x^{m-2}-\frac{x^{m-2}}{1+x^2}\]
shows that the integral on the right contains \(\pi/4\) with alternating sign. The \(\pi\)-terms cancel precisely when \(n\equiv3\pmod4\). Thus the integral is rational for the positive integers \(3,7,11,\ldots\), which have natural density \(1/4\).`,
  },
  {
    id: 10257,
    number: 257,
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
    solution: String.raw`All three limits equal \(0\). In I, polynomial growth dominates logarithmic growth. In II, exponential growth dominates polynomial growth. In III, the numerator is bounded while the denominator grows without bound.`,
  },
  {
    id: 10258,
    number: 258,
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
    number: 259,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: [],
    question: String.raw`Evaluate
\[\int_0^{1/2}\tan^{-1}(x^2-x+1)\,dx.\]`,
    choices: [String.raw`\(\frac{\pi\ln2}{6}\)`, String.raw`\(\ln\sqrt2\)`, String.raw`\(\frac\pi8\)`, String.raw`\(\frac\pi4\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using
\[\tan^{-1}x+\tan^{-1}(1-x)=\tan^{-1}\left(\frac1{x^2-x+1}\right)
=\frac\pi2-\tan^{-1}(x^2-x+1),\]
and the symmetry of \(x^2-x+1\) about \(x=1/2\), we obtain
\[2I=\frac\pi2-2\int_0^1\tan^{-1}x\,dx.\]
Since \(\int_0^1\tan^{-1}x\,dx=\frac\pi4-\frac12\ln2\), it follows that
\[I=\frac12\ln2=\ln\sqrt2.\]`,
  },
  {
    id: 10260,
    number: 260,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["Infinite Series", "Partial Fractions"],
    question: String.raw`If \(g(x)=\left\lfloor\frac1x\right\rfloor\), evaluate
\[\int_0^1\frac1{g(x)}\,dx.\]`,
    choices: [String.raw`\(\frac{\pi^2}{16}\)`, String.raw`\(\frac{\pi^2}{8}\)`, String.raw`\(\frac{\pi^2}{6}\)`, String.raw`\(\frac{\pi^2}{12}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`For \(x\in(1/(k+1),1/k]\), \(g(x)=k\). Therefore,
\[\int_0^1\frac1{g(x)}\,dx
=\sum_{k=1}^{\infty}\frac1k\left(\frac1k-\frac1{k+1}\right)
=\sum_{k=1}^{\infty}\frac1{k^2(k+1)}.\]
Since
\[\frac1{k^2(k+1)}=\frac1{k^2}-\frac1k+\frac1{k+1},\]
the sum is \(\pi^2/6-1\), which is NOTA.`,
  },
  {
    id: 10261,
    number: 261,
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
    number: 262,
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
Differentiation shows the minimum occurs at \(b=\sqrt2\), yielding \(A=8\).`,
  },
  {
    id: 10263,
    number: 263,
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
    number: 264,
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
At \((-1,1)\), \(y'>0\), so I is true. Differentiating again shows \(y''<0\) there, so II is false. At \((2,1)\), the denominator of \(y'\) is zero while the numerator is nonzero, so the tangent is vertical and III is true. Thus I and III are true, which is NOTA.`,
  },
  {
    id: 10265,
    number: 265,
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
\[f(x)=\frac2{1+\sin(8x)}.\]
Therefore,
\[f'(x)=-\frac{16\cos(8x)}{(1+\sin(8x))^2}.\]
At \(x=\pi/48\), this is
\[-\frac{16(\sqrt3/2)}{(1+1/2)^2}=-\frac{32\sqrt3}{9}.\]`,
  },
  // 2026 FAMAT February Regional Calculus Individual Test.
  // Source questions 1-30 map to bank questions 266-295 (IDs 10266-10295).
  {
    id: 10266,
    number: 266,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Rule"],
    question: String.raw`If \(f(x)=2x^3+4x^2+x+\pi\), find \(f'(1)\).`,
    choices: ["15", "16", "17", "18", "NOTA"],
    answer: "A",
    solution: String.raw`\[f'(x)=6x^2+8x+1,\qquad f'(1)=15.\]`,
  },
  {
    id: 10267,
    number: 267,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: [],
    question: String.raw`If \(f(x)=3\cos(2x)-6\sin(3x)\), find \(\displaystyle\int_0^\pi f(x)\,dx\).`,
    choices: ["−12", "−4", "4", "12", "NOTA"],
    answer: "B",
    solution: String.raw`\[\int_0^\pi\bigl(3\cos(2x)-6\sin(3x)\bigr)\,dx
=\left[\frac32\sin(2x)+2\cos(3x)\right]_0^\pi=-4.\]`,
  },
  {
    id: 10268,
    number: 268,
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
    number: 269,
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
    number: 270,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule", "Double-Angle Identity"],
    question: String.raw`If \(f(x)=\sin(x^2)\cos(x^2)\), find \(f'\!\left(\sqrt{\frac\pi6}\right)\).`,
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
    number: 271,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["Trigonometric Substitution"],
    question: String.raw`Evaluate
\[\int_0^{\pi/2}\sin^2x\cos x\,dx.\]`,
    choices: ["0", String.raw`\(\frac13\)`, String.raw`\(\frac12\)`, "1", "NOTA"],
    answer: "B",
    solution: String.raw`Using the substitution \(u=\sin x\), \(du=\cos x\,dx\), we get
\[\int_0^{\pi/2}\sin^2x\cos x\,dx=\int_0^1u^2\,du=\frac13.\]`,
  },
  {
    id: 10272,
    number: 272,
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
    number: 273,
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
    solution: String.raw`On \([0,5]\), \(f\) is increasing and concave up. Thus, the left-handed sum is less than the integral, while both the trapezoidal and right-handed sums are greater than the integral. The trapezoidal sum is less than the right-handed sum, so
\[\mathrm{II}<\mathrm{I}<\mathrm{IV}<\mathrm{III}.\]`,
  },
  {
    id: 10274,
    number: 274,
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
    number: 275,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    question: String.raw`Let \(f(x)=5-x-\frac6x\), restricted to \(x>0\). Let \(a\) and \(b\) be the values with \(a<b\) that maximize \(\displaystyle\int_a^bf(x)\,dx\). What is \(a+b\)?`,
    choices: ["2", "3", "4", "5", "NOTA"],
    answer: "D",
    solution: String.raw`We have
\[f(x)=5-x-\frac6x=-\frac{(x-2)(x-3)}x.\]
For \(x>0\), this is positive exactly on \((2,3)\) and negative outside that interval. Therefore, the integral is maximized by choosing \(a=2\) and \(b=3\), so \(a+b=5\).`,
  },
  {
    id: 10276,
    number: 276,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 4,
    methods: [],
    question: String.raw`Let \(f\) be a piecewise-smooth, real-valued function; that is, a function that is smooth everywhere on the real line except at a discontinuous set of points. How many of the following statements are true?

I. If \(f(x)\) is even, then \(f'(x)\) is odd.

II. If \(f'(x)\) is even, then \(f(x)\) is odd.

III. If \(f(x)\) is odd, then \(f'(x)\) is even.

IV. If \(f'(x)\) is odd, then \(f(x)\) is even.`,
    choices: ["1", "2", "3", "4", "NOTA"],
    answer: "B",
    solution: String.raw`Statements I and III follow from the difference-quotient definition of the derivative and are true wherever the derivative exists.

Statement IV need not hold for a piecewise-smooth function. For example, define
\[f(x)=\begin{cases}\ln|x|+1,&x<0,\\ \ln|x|-1,&x>0.\end{cases}\]
Then \(f'(x)=1/x\) is odd, but \(f\) is not even. Statement II also need not hold: an antiderivative of the even constant function \(f'(x)=c\) is \(f(x)=cx+m\), which is not necessarily odd. Therefore, exactly two statements are true.`,
  },
  {
    id: 10277,
    number: 277,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 2,
    methods: ["Second Derivative Test"],
    question: String.raw`A cubic polynomial has roots 2, 3, and 5. Its inflection point has the form \(a/b\), where \(a\) and \(b\) are relatively prime. What is \(a+b\)?`,
    choices: ["11", "12", "13", "14", "NOTA"],
    answer: "C",
    solution: String.raw`Let
\[p(x)=k(x-2)(x-3)(x-5)\]
for some nonzero real number \(k\). Differentiating twice gives
\[p''(x)=k(6x-20).\]
Setting \(p''(x)=0\) yields \(x=10/3\). Thus \(a+b=10+3=13\).`,
  },
  {
    id: 10278,
    number: 278,
    division: "Mu",
    topic: "Limits",
    difficulty: 4,
    methods: [],
    question: String.raw`Two functions \(f\) and \(g\) are said to be asymptotically equivalent, denoted as \(f\sim g\), if and only if
\[\lim_{x\to\infty}\frac{f(x)}{g(x)}=1.\]
Suppose the limit to infinity of \(f\), \(g\), and \(h\) are nonzero, but they can be infinite. Which of the following statements are true?

I. Let \(r\) be a real number for which \([f(x)]^r\) and \([g(x)]^r\) are defined for all sufficiently large \(x\). If \(f\sim g\), then \([f(x)]^r\sim[g(x)]^r\).

II. All polynomials of the same degree are asymptotically equivalent.

III. Asymptotic equivalence is a transitive relation: if \(f\sim g\) and \(g\sim h\), then \(f\sim h\).

IV. \(f\sim g\) if and only if \(\displaystyle\lim_{x\to\infty}(f(x)-g(x))=0\).`,
    choices: ["I, II, and III", "I, III, and IV", "I, II, and IV", "II, III, and IV", "NOTA"],
    answer: "E",
    solution: String.raw`Statement I is true because
\[\frac{[f(x)]^r}{[g(x)]^r}=\left(\frac{f(x)}{g(x)}\right)^r\longrightarrow1.\]
Statement II is false because polynomials of the same degree can have different leading coefficients. Statement III is true because
\[\frac{f(x)}{h(x)}=\frac{f(x)}{g(x)}\frac{g(x)}{h(x)}\longrightarrow1.\]
Statement IV is false; for example, \(x^2+x\sim x^2\), but their difference diverges. Thus only I and III are true, which is NOTA.`,
  },
  {
    id: 10279,
    number: 279,
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
\[\int_0^{3/2}(-2t+3)\,dt=\left[-t^2+3t\right]_0^{3/2}=\frac94.\]`,
  },
  {
    id: 10280,
    number: 280,
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
\[\frac{dA}{dt}=3\sqrt3.\]`,
  },
  {
    id: 10281,
    number: 281,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: ["Related Rates", "Law of Cosines"],
    question: String.raw`One side of a triangle is growing at a rate of \(2\text{ m/s}\), another side is shrinking at a rate of \(1\text{ m/s}\), and the angle between these two sides is increasing at a rate of \(\sqrt3/2\) radians per second. At an instant when the triangle is equilateral with side length 4 meters, what is the rate of change of the third side length?`,
    choices: [String.raw`\(\frac12\)`, String.raw`\(\frac32\)`, String.raw`\(\frac52\)`, String.raw`\(\frac72\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let \(c\) be the third side. The Law of Cosines gives
\[c^2=a^2+b^2-2ab\cos C.\]
Differentiating with respect to time,
\[2c\frac{dc}{dt}=2a\frac{da}{dt}+2b\frac{db}{dt}-2\frac{da}{dt}b\cos C-2a\frac{db}{dt}\cos C+2ab\sin C\frac{dC}{dt}.\]
At the given instant, \(a=b=c=4\), \(C=\pi/3\), \(da/dt=2\), \(db/dt=-1\), and \(dC/dt=\sqrt3/2\). Substitution gives
\[\frac{dc}{dt}=\frac72.\]`,
  },
  {
    id: 10282,
    number: 282,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["Product-to-Sum Identity"],
    question: String.raw`For positive integers \(m\) and \(n\), evaluate
\[\int_0^{2\pi}\sin(mx)\cos(nx)\,dx.\]`,
    choices: [String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, String.raw`\(\frac{m+n}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using the product-to-sum identity,
\[\sin(mx)\cos(nx)=\frac12\bigl(\sin((m+n)x)+\sin((m-n)x)\bigr).\]
Each sine term integrates to 0 over \([0,2\pi]\), including when \(m=n\). Therefore, the integral is 0.`,
  },
  {
    id: 10283,
    number: 283,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["Product-to-Sum Identity"],
    question: String.raw`For positive integers \(m\) and \(n\), evaluate
\[\int_0^{2\pi}\sin(mx)\sin(nx)\,dx.\]`,
    choices: [String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, String.raw`\(\frac{m+n}{2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Using the product-to-sum identity,
\[\sin(mx)\sin(nx)=\frac12\bigl(\cos((m-n)x)-\cos((m+n)x)\bigr).\]
If \(m\ne n\), the integral is 0. If \(m=n\), the integral is \(\pi\). Because the value depends on whether \(m=n\), none of the listed choices is always correct.`,
  },
  {
    id: 10284,
    number: 284,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["Gaussian Integral"],
    question: String.raw`One of the most famous integrals is the Gaussian integral \(\displaystyle\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt\pi\). What is
\[\int_{-\infty}^{\infty}e^{-(ax^2+bx+c)}\,dx\]
for positive \(a\)? Side note: the integral diverges if \(a\) is negative. Additionally, this integral still holds if \(a\), \(b\), and \(c\) are complex numbers, with convergence holding if and only if the real part of \(a\) is positive.`,
    choices: [String.raw`\(\frac{\sqrt{\pi a}}a e^{\frac{b^2}{2a}-c}\)`, String.raw`\(\frac{\sqrt{\pi a}}a e^{-c+\frac{b^2}{4a}}\)`, String.raw`\(\frac{\sqrt{2\pi a}}{2a}e^{\frac{b^2}{2a}-c}\)`, String.raw`\(\frac{\sqrt{2\pi a}}{2a}e^{\frac{b^2}{4a}-c}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Complete the square:
\[ax^2+bx+c=a\left(x+\frac{b}{2a}\right)^2+c-\frac{b^2}{4a}.\]
Using \(u=x+b/(2a)\), followed by \(v=\sqrt a\,u\), gives
\[\int_{-\infty}^{\infty}e^{-(ax^2+bx+c)}\,dx
=\frac{e^{-c+b^2/(4a)}}{\sqrt a}\int_{-\infty}^{\infty}e^{-v^2}\,dv
=\frac{\sqrt{\pi a}}a e^{-c+b^2/(4a)}.\]`,
  },
  {
    id: 10285,
    number: 285,
    division: "Mu",
    topic: "Analytic Geometry",
    difficulty: 4,
    methods: ["Tangency"],
    question: String.raw`Let \(f(0)=0\) and \(f(x)=e^{-1/x}\) for \(x>0\). What is the slope of the line tangent to \(f(x)\), with \(y\)-intercept \(\left(0,\frac12e^{-1/2}\right)\), that intersects \(f(x)\) at precisely that one point of tangency?`,
    choices: [String.raw`\(4e^{-2}\)`, String.raw`\(e^{-1/2}\)`, String.raw`\(\frac14e^{-1/2}\)`, String.raw`\(\frac1{16}e^{-1/4}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`We have
\[f'(x)=\frac1{x^2}e^{-1/x}.\]
The tangent line at \(x=a\) has \(y\)-intercept
\[f(a)-af'(a)=\left(1-\frac1a\right)e^{-1/a}.\]
Setting this equal to \(\frac12e^{-1/2}\) gives \(a=2\). Therefore, the slope is
\[f'(2)=\frac14e^{-1/2}.\]`,
  },
  {
    id: 10286,
    number: 286,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution", "Integration by Parts"],
    question: String.raw`Evaluate
\[\int_1^4\frac{\ln x}{\sqrt x}\,dx.\]`,
    choices: [String.raw`\(\ln2-1\)`, String.raw`\(4\ln2-2\)`, String.raw`\(2\ln2-1\)`, String.raw`\(8\ln2-4\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Using \(u=\sqrt x\), so \(x=u^2\) and \(dx=2u\,du\), gives
\[\int_1^4\frac{\ln x}{\sqrt x}\,dx=4\int_1^2\ln u\,du.\]
Integration by parts yields
\[4\left[u\ln u-u\right]_1^2=8\ln2-4.\]`,
  },
  {
    id: 10287,
    number: 287,
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
Thus \(m+n=-1/16\).`,
  },
  {
    id: 10288,
    number: 288,
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
The only critical point is \(x=5\sqrt2/2\), where \(f(x)=5\sqrt2\), the absolute maximum. Checking the endpoints gives \(f(-5)=-5\) and \(f(5)=5\), so the absolute minimum is \(-5\). The requested absolute difference is
\[5\sqrt2-(-5)=5\sqrt2+5.\]`,
  },
  {
    id: 10289,
    number: 289,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: ["Taylor's Theorem"],
    question: String.raw`Let \(f\) be a function defined on the real line such that \(f(x)=e^{-1/x^2}\) for \(x>0\) and \(f(x)=0\) otherwise. Which of the following statements are true?

I. \(f\) is infinitely differentiable everywhere.

II. The Taylor series of \(f\) centered at \(x=0\) converges everywhere on the real line.

III. \(f\) is analytic on the real line; that is, \(f\) is equal to its Taylor series expansion centered at \(x=0\).`,
    choices: ["I", "I, II", "I, II, III", "All three are false", "NOTA"],
    answer: "B",
    solution: String.raw`For \(x>0\), every derivative has the form \(R(x)e^{-1/x^2}\), where \(R\) is a rational function. Since
\[\lim_{x\to0^+}R(x)e^{-1/x^2}=0,\]
all derivatives at \(x=0\) exist and equal 0. Thus I is true.

The Taylor series centered at 0 is therefore the zero series, which converges everywhere, so II is true. However, \(f(x)>0\) for \(x>0\), so \(f\) is not equal to that Taylor series there. Thus III is false.`,
  },
  {
    id: 10290,
    number: 290,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 3,
    methods: ["Related Rates"],
    question: String.raw`A particle moves along the parabola \(y=-x^2+5x+6\) with speed \(1\text{ m/s}\) and with \(x\) increasing. What is \(dx/dt\) when the particle is at the larger of the two roots?`,
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
    number: 291,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 2,
    methods: ["Related Rates"],
    question: String.raw`A particle moves along the parabola \(y=-x^2+5x+6\) with speed \(1\text{ m/s}\) and with \(x\) increasing. What is \(dx/dt\) at the maximum of the parabola?`,
    choices: [String.raw`\(\frac15\)`, String.raw`\(\frac25\)`, String.raw`\(\frac35\)`, String.raw`\(\frac45\)`, "NOTA"],
    answer: "E",
    solution: String.raw`At the maximum of the parabola, \(dy/dx=0\), so \(dy/dt=0\). Since the particle has speed \(1\text{ m/s}\) and \(x\) is increasing,
\[\frac{dx}{dt}=1.\]
This is not one of the listed choices.`,
  },
  {
    id: 10292,
    number: 292,
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
    number: 293,
    division: "Mu",
    topic: "Polynomials",
    difficulty: 4,
    methods: [],
    question: String.raw`The Legendre polynomials are a set of polynomials with positive leading coefficients, where \(P_n(x)\) denotes the Legendre polynomial of degree \(n\) that satisfies
\[\int_{-1}^1P_m(x)P_n(x)\,dx=\frac2{2n+1}\delta_{mn}\]
for all nonnegative integers \(m\) and \(n\), including 0. Here, \(\delta_{mn}\) is the Kronecker delta and equals 1 when \(m=n\), and 0 otherwise. Using this property, find \(P_2(x)\).`,
    choices: [String.raw`\(\frac32x^2-\frac12\)`, String.raw`\(\frac34x^2-\frac12\)`, String.raw`\(\frac32x^2+\frac12\)`, String.raw`\(\frac34x^2+\frac12\)`, "NOTA"],
    answer: "A",
    solution: String.raw`First, \(P_0(x)=1\). Write \(P_1(x)=ax+b\). Orthogonality with \(P_0\) gives \(b=0\), and normalization gives \(a=1\), so \(P_1(x)=x\).

Now write \(P_2(x)=cx^2+dx+e\). Orthogonality with \(P_0\) and \(P_1\), together with normalization, gives
\[\int_{-1}^1(cx^2+dx+e)\,dx=0,\]
\[\int_{-1}^1x(cx^2+dx+e)\,dx=0,\]
\[\int_{-1}^1(cx^2+dx+e)^2\,dx=\frac25.\]
Solving yields \(d=0\), \(c=3/2\), and \(e=-1/2\). Therefore,
\[P_2(x)=\frac32x^2-\frac12.\]`,
  },
  {
    id: 10294,
    number: 294,
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
=\frac12\ln2+\frac\pi4.\]`,
  },
  {
    id: 10295,
    number: 295,
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
\[\left\langle x'',y''\right\rangle
=\left\langle\frac{\pi^2}{3},-\frac\pi6\right\rangle.\]`,
  },
  // 2026 Mu Alpha Theta King February Statewide Calculus Individual Test.
  // Source questions 1-30 map to bank questions 296-325 (IDs 10296-10325).
  {
    id: 10296,
    number: 296,
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
    number: 297,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["First Derivative Test"],
    question: String.raw`Find the maximum value of \(f(x)=-x^4+4x^2+1\), where the domain is all real numbers.`,
    choices: ["1", String.raw`\(\frac{11}{4}\)`, "4", "5", "NOTA"],
    answer: "D",
    solution: String.raw`First notice that \(f(x)\to-\infty\) when \(x\to\pm\infty\), so the maximum must be at a point where \(f'(x)=0\). Since
\[f'(x)=-4x^3+8x=-4x(x^2-2),\]
the critical points are \(x=0\) and \(x=\pm\sqrt2\). We have \(f(0)=1\) and \(f(\pm\sqrt2)=5\), so the maximum is 5.`,
  },
  {
    id: 10298,
    number: 298,
    division: "Mu",
    topic: "Fundamental Theorem of Calculus",
    difficulty: 2,
    methods: [],
    question: String.raw`For \(0<x<2\pi\), find the sum of the possible values of \(x\) such that
\[\int_{\pi/4}^x\cos(t)\,dt=0.\]`,
    choices: [String.raw`\(\pi\)`, String.raw`\(\frac{3\pi}{2}\)`, String.raw`\(2\pi\)`, String.raw`\(3\pi\)`, "NOTA"],
    answer: "A",
    solution: String.raw`\[\int_{\pi/4}^x\cos(t)\,dt
=\sin(x)-\sin\left(\frac\pi4\right).\]
Setting this equal to 0 gives \(x=\pi/4\) or \(x=3\pi/4\) in the given interval. Their sum is \(\pi\).`,
  },
  {
    id: 10299,
    number: 299,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 1,
    methods: ["Disk Method"],
    question: String.raw`Gabriel's Little Horn is formed by revolving the graph \(y=1/x\) for \(1\le x\le4\) around the \(x\)-axis. What is the volume of Gabriel's Little Horn?`,
    choices: [String.raw`\(\frac\pi4\)`, String.raw`\(\frac\pi2\)`, String.raw`\(\frac{3\pi}{4}\)`, String.raw`\(\pi\)`, "NOTA"],
    answer: "C",
    solution: String.raw`By the washer method,
\[V=\pi\int_1^4\left(\frac1x\right)^2dx
=\pi\left[-\frac1x\right]_1^4
=\frac{3\pi}{4}.\]`,
  },
  {
    id: 10300,
    number: 300,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: ["First Derivative Test", "Second Derivative Test"],
    question: String.raw`The graph of \(y=\sin(x)-x\) has many points where the slope of the tangent line is 0. Which choice correctly describes the nature of these points?`,
    choices: ["Some are local maxima, some are local minima", "Some are local maxima, some are inflection points", "All are local maxima", "All are inflection points", "NOTA"],
    answer: "D",
    solution: String.raw`Since \(y'=\cos x-1\), all such points occur at \(x=2\pi k\) for integers \(k\). At each one,
\[y''=-\sin x=0,\qquad y'''=-\cos x=-1\ne0.\]
Thus the concavity changes at every stationary point, so all are inflection points.`,
  },
  {
    id: 10301,
    number: 301,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Mean Value Theorem"],
    question: String.raw`Let \(f(t)=\ln(t)\). What is the value of \(t\) that satisfies the Mean Value Theorem for derivatives for \(f(t)\) on the interval \([1,e]\)?`,
    choices: [String.raw`\(e-1\)`, String.raw`\(\frac e2\)`, String.raw`\(\frac e2+1\)`, String.raw`\(\frac{e+1}{2}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The Mean Value Theorem gives
\[f'(t)=\frac{f(e)-f(1)}{e-1}.\]
Since \(f'(t)=1/t\),
\[\frac1t=\frac1{e-1},\]
so \(t=e-1\).`,
  },
  {
    id: 10302,
    number: 302,
    division: "Mu",
    topic: "Geometry",
    difficulty: 3,
    methods: [],
    question: String.raw`A line is drawn on the curved surface of a cylinder. The line is straight and perpendicular to both of the cylinder's circular faces. If this line is fixed in place and the cylinder is revolved around it, what shape would be formed by the revolution?`,
    choices: ["Sphere", "Cylinder", "Torus", "Two spheres", "NOTA"],
    answer: "B",
    solution: String.raw`The fixed line is a generator of the cylinder and is parallel to its central axis. In a cross-section perpendicular to these lines, the original cylinder is a disk and the fixed line is a point on its circumference. Rotating that disk about the fixed point sweeps out a disk with twice the original radius. Extending this cross-section along the cylinder's height forms another cylinder.`,
  },
  {
    id: 10303,
    number: 303,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate \(\displaystyle\int_1^e\frac{e^x}{e^x+1}\,dx\).`,
    choices: [String.raw`\(\ln\left(\frac{e^e+e}{e^e-e}\right)\)`, String.raw`\(\ln\left(\frac{e^e+1}{e+1}\right)\)`, String.raw`\(\ln\left(\frac{e^e-e}{e^e+e}\right)\)`, String.raw`\(\ln\left(\frac{e^e-1}{e-1}\right)\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Use \(u=e^x+1\), \(du=e^x\,dx\). The bounds become \(e+1\) and \(e^e+1\), so
\[\int_1^e\frac{e^x}{e^x+1}\,dx
=\int_{e+1}^{e^e+1}\frac1u\,du
=\ln\left(\frac{e^e+1}{e+1}\right).\]`,
  },
  {
    id: 10304,
    number: 304,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    question: String.raw`At the point \((\pi,2\pi)\) on the curve \(y\sin(x)=x\sin(y)\), what is \(dy/dx\)?`,
    choices: ["−2", String.raw`\(-\frac12\)`, String.raw`\(\frac12\)`, "2", "NOTA"],
    answer: "A",
    solution: String.raw`Differentiate both sides:
\[y'\sin x+y\cos x=\sin y+xy'\cos y.\]
At \((\pi,2\pi)\), this becomes
\[0-2\pi=0+\pi y',\]
so \(y'=-2\).`,
  },
  {
    id: 10305,
    number: 305,
    division: "Mu",
    topic: "Parametric",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`A parametric curve is defined for \(t\ge0\) by
\[x(t)=t\cos t,\qquad y(t)=\sin t.\]
What is \(dy/dx\) on the curve at \(t=\pi\)?`,
    choices: ["−1", "0", "1", String.raw`\(\infty\)`, "NOTA"],
    answer: "C",
    solution: String.raw`\[\frac{dy}{dx}=\frac{y'(t)}{x'(t)}
=\frac{\cos t}{\cos t-t\sin t}.\]
At \(t=\pi\), this equals \((-1)/(-1)=1\).`,
  },
  {
    id: 10306,
    number: 306,
    division: "Mu",
    topic: "Parametric",
    difficulty: 4,
    methods: ["Chain Rule"],
    question: String.raw`A parametric curve is defined for \(t\ge0\) by
\[x(t)=t\cos t,\qquad y(t)=\sin t.\]
Vignesh picks a point \((X,Y)\) on the curve and finds that the curve has a vertical tangent line at that point. Which of the following must be true?`,
    choices: [String.raw`\(X=\frac{1-Y^2}{Y}\)`, String.raw`\(X=\frac{Y^2-1}{Y^2}\)`, String.raw`\(X=\sqrt{\frac{1-Y^2}{Y}}\)`, String.raw`\(X=\frac{\sqrt{Y^2-1}}Y\)`, "NOTA"],
    answer: "A",
    solution: String.raw`A vertical tangent requires \(x'(t)=0\), so
\[\cos t-t\sin t=0\quad\Longrightarrow\quad t=\cot t.\]
At the point, \(X=t\cos t\) and \(Y=\sin t\). Therefore,
\[\frac XY=t\cot t=\cot^2t=\csc^2t-1=\frac1{Y^2}-1,\]
which gives
\[X=\frac{1-Y^2}{Y}.\]`,
  },
  {
    id: 10307,
    number: 307,
    division: "Mu",
    topic: "Sequences",
    difficulty: 2,
    methods: ["Recursion"],
    question: String.raw`Let \(x_0=1\), and \(x_{n+1}=\cos(x_n)\) for integers \(n\ge0\). This sequence converges, so \(\displaystyle\lim_{n\to\infty}x_n=D\), where \(D\) is Dottie's number. Which of the following is equivalent to \(\sin(D)\)?`,
    choices: [String.raw`\(\sqrt{1-D^2}\)`, String.raw`\(-\sqrt{1-D^2}\)`, String.raw`\(D^2-D\)`, String.raw`\(D-D^2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Taking limits in the recurrence gives \(D=\cos D\). Since \(0<D<\pi/2\), \(\sin D\) is positive. Thus,
\[\sin D=\sqrt{1-\cos^2D}=\sqrt{1-D^2}.\]`,
  },
  {
    id: 10308,
    number: 308,
    division: "Mu",
    topic: "Systems of Equations",
    difficulty: 3,
    methods: [],
    question: String.raw`Let \(F(x)=Ae^x+Be^{-x}+C\sin x+D\cos x\) for constants \(A,B,C,D\). Given that \(F(0)=0\), \(F'(0)=1\), \(F''(0)=2\), and \(F'''(0)=3\), what is \(ABCD\)?`,
    choices: [String.raw`\(-\frac94\)`, String.raw`\(-\frac9{16}\)`, String.raw`\(-\frac34\)`, String.raw`\(-\frac3{16}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The four conditions give
\[A+B+D=0,\]
\[A-B+C=1,\]
\[A+B-D=2,\]
\[A-B-C=3.\]
Subtracting the first and third equations gives \(D=-1\), while subtracting the second and fourth gives \(C=-1\). Solving the remaining equations gives \(A=3/2\) and \(B=-1/2\). Therefore,
\[ABCD=\left(\frac32\right)\left(-\frac12\right)(-1)(-1)=-\frac34.\]`,
  },
  {
    id: 10309,
    number: 309,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: [],
    question: String.raw`Evaluate
\[\lim_{x\to\infty}\frac{\lfloor\sin(\pi x)\rfloor+\sin(\pi x)}{(-1)^{\lfloor x\rfloor}}.\]`,
    choices: ["−1", "0", "1", String.raw`\(\infty\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Along the sequence \(x=n\) of integers, the expression equals 0. Along \(x=2n+1/2\), the numerator is \(\lfloor1\rfloor+1=2\) and the denominator is 1, so the expression equals 2. Since these two sequences approach different values, the limit does not exist.`,
  },
  {
    id: 10310,
    number: 310,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 5,
    methods: ["Continued Fractions", "Implicit Differentiation"],
    question: String.raw`Let \(y=y(x)\) be the value of the infinite continued expression in which every \(x\) is followed by adding \(1+\cdots\), and every 1 is followed by adding \(x+\cdots\). Equivalently, \(y\) satisfies
\[y=x+\frac{1+\frac1{y-x}}{x+(y-x)}.\]
Evaluate \(dy/dx\) at \(x=1\), taking the value \(y>1\) represented by the continued expression.`,
    choices: [String.raw`\(\frac14\)`, String.raw`\(\frac34\)`, "2", String.raw`\(\frac{11}{4}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The defining relation simplifies as follows:
\[y=x+\frac{1+\frac1{y-x}}{y}.\]
Multiplying through and rearranging gives
\[y^3-xy^2=xy^2-x^2y+y-x+1.\]
At \(x=1\), this becomes \(y^3=2y^2\), and the continued expression has \(y=2\). Differentiating the implicit equation and substituting \((x,y)=(1,2)\) gives
\[0=-3y^2y'+2xy^2+4xyy'-2xy-x^2y'+y'-1,\]
so \(y'=3/4\).`,
  },
  {
    id: 10311,
    number: 311,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["U-Substitution"],
    question: String.raw`Evaluate
\[\lim_{n\to\infty}\left(n\int_0^1x(1-x^2)^n\,dx\right).\]`,
    choices: ["0", String.raw`\(\frac14\)`, String.raw`\(\frac12\)`, String.raw`\(\frac{\sqrt2}{2}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Use \(u=1-x^2\), \(du=-2x\,dx\):
\[\int_0^1x(1-x^2)^n\,dx
=\frac1{2(n+1)}.\]
Therefore,
\[\lim_{n\to\infty}\frac{n}{2(n+1)}=\frac12.\]`,
  },
  {
    id: 10312,
    number: 312,
    division: "Mu",
    topic: "Inverse Functions",
    difficulty: 4,
    methods: ["U-Substitution"],
    question: String.raw`Let \(f(x)=x^3+x\), and let \(f^{-1}(x)\) be its inverse. Ignoring the integration constant, the integral
\[\int\frac{f^{-1}(x)}x\,dx\]
can be written as \(Af^{-1}(x)+B\arctan(f^{-1}(x))\) for integers \(A,B\). Find \(A+B\).`,
    choices: ["−2", "−1", "0", "1", "NOTA"],
    answer: "D",
    solution: String.raw`Let \(\xi=f^{-1}(x)\), so \(x=\xi^3+\xi\) and \(dx=(3\xi^2+1)\,d\xi\). Then
\[\int\frac{f^{-1}(x)}x\,dx
=\int\frac{\xi}{\xi^3+\xi}(3\xi^2+1)\,d\xi
=\int\left(3-\frac2{\xi^2+1}\right)d\xi.\]
Thus,
\[\int\frac{f^{-1}(x)}x\,dx=3f^{-1}(x)-2\arctan(f^{-1}(x)),\]
so \(A+B=3-2=1\).`,
  },
  {
    id: 10313,
    number: 313,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 5,
    methods: ["Infinite Geometric Series"],
    question: String.raw`Evaluate
\[\int_0^1\min\left(|x-1|,\left|x-\frac12\right|,\left|x-\frac14\right|,\left|x-\frac18\right|,\ldots\right)dx.\]`,
    choices: [String.raw`\(\frac1{32}\)`, String.raw`\(\frac1{20}\)`, String.raw`\(\frac1{16}\)`, String.raw`\(\frac1{12}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The integrand is the distance from \(x\) to the nearest nonnegative power of \(1/2\). Between consecutive powers \(2^{-n}\) and \(2^{-(n-1)}\), its graph is an isosceles triangle with base \(2^{-n}\) and height \(2^{-(n+1)}\). Its area is therefore
\[\frac12\cdot\frac1{2^n}\cdot\frac1{2^{n+1}}=\frac1{2^{2n+2}}.\]
Summing over \(n\ge1\),
\[\sum_{n=1}^\infty\frac1{2^{2n+2}}
=\frac{1/16}{1-1/4}=\frac1{12}.\]`,
  },
  {
    id: 10314,
    number: 314,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["Integration by Parts"],
    question: String.raw`Given that \(\displaystyle\int_0^\infty\frac{\sin t}{t}\,dt=\frac\pi2\), evaluate
\[\int_0^\infty\frac{1-\cos(4t)}{t^2}\,dt.\]`,
    choices: [String.raw`\(\frac\pi4\)`, String.raw`\(\frac\pi2\)`, String.raw`\(\pi\)`, String.raw`\(2\pi\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Integrate by parts with \(u=1-\cos(4t)\) and \(dv=t^{-2}dt\):
\[\int_0^\infty\frac{1-\cos(4t)}{t^2}\,dt
=-\left[\frac{1-\cos(4t)}t\right]_0^\infty
+\int_0^\infty\frac{4\sin(4t)}t\,dt.\]
The boundary term is 0. With \(u=4t\), the remaining integral is
\[4\int_0^\infty\frac{\sin u}{u}\,du=2\pi.\]`,
  },
  {
    id: 10315,
    number: 315,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["L'Hopital's Rule"],
    question: String.raw`Evaluate
\[\lim_{x\to1^+}\left((\ln x)^2\int_x^\infty\frac1{t(\ln t)^3}\,dt\right).\]`,
    choices: [String.raw`\(\frac13\)`, String.raw`\(\frac12\)`, "2", "3", "NOTA"],
    answer: "B",
    solution: String.raw`Write the expression as a quotient and apply L'Hopital's Rule:
\[\lim_{x\to1^+}\frac{\int_x^\infty[t(\ln t)^3]^{-1}\,dt}{(\ln x)^{-2}}
=\lim_{x\to1^+}\frac{-1/(x(\ln x)^3)}{-2/(x(\ln x)^3)}
=\frac12.\]`,
  },
  {
    id: 10316,
    number: 316,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: [],
    question: String.raw`Given
\[f(x)=\int_0^\infty\frac{\sin t}{t+x}\,dt,\qquad
g(x)=\int_0^\infty\frac{\cos t}{t+x}\,dt,\]
and
\[h(x)=f(x)\sin x-g(x)\cos x,\]
what is \(h'(\pi)\)? Note that \(f(\pi)\) and \(g(\pi)\) are well-defined.`,
    choices: [String.raw`\(-\frac1{2\pi}\)`, String.raw`\(-\frac1\pi\)`, String.raw`\(\frac1{2\pi}\)`, String.raw`\(\frac1\pi\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Put the sine and cosine factors into the integrals:
\[h(x)=\int_0^\infty\frac{\sin x\sin t-\cos x\cos t}{t+x}\,dt
=\int_0^\infty\frac{-\cos(x+t)}{t+x}\,dt.\]
Using \(u=t+x\),
\[h(x)=-\int_x^\infty\frac{\cos u}{u}\,du.\]
By the Fundamental Theorem of Calculus,
\[h'(x)=\frac{\cos x}{x},\qquad h'(\pi)=-\frac1\pi.\]`,
  },
  {
    id: 10317,
    number: 317,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 5,
    methods: ["Trigonometric Substitution", "Integral Properties"],
    question: String.raw`Given that
\[\int_{-\pi/2}^{\pi/2}\ln|\cos t|\,dt=-\pi\ln2,\]
what is
\[\int_0^4\frac{\ln x}{\sqrt{4x-x^2}}\,dx?\]`,
    choices: [String.raw`\(\frac{\pi\ln2}{16}\)`, String.raw`\(\frac{\pi\ln2}{8}\)`, String.raw`\(\frac{\pi\ln2}{4}\)`, String.raw`\(\frac{\pi\ln2}{2}\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Let \(x=u+2\), then use \(u=2\sin\theta\). This gives
\[\int_0^4\frac{\ln x}{\sqrt{4x-x^2}}\,dx
=\int_{-\pi/2}^{\pi/2}\ln(2+2\sin\theta)\,d\theta.\]
Split the logarithm:
\[\pi\ln2+\int_{-\pi/2}^{\pi/2}\ln(1+\sin\theta)\,d\theta.\]
If the second integral is \(I\), substituting \(\theta\mapsto-\theta\) and adding gives
\[2I=\int_{-\pi/2}^{\pi/2}\ln(1-\sin^2\theta)\,d\theta
=2\int_{-\pi/2}^{\pi/2}\ln|\cos\theta|\,d\theta=-2\pi\ln2.\]
Thus \(I=-\pi\ln2\), and the original integral is 0, which is NOTA.`,
  },
  {
    id: 10318,
    number: 318,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 3,
    methods: [],
    question: String.raw`The Airy function, \(f(x)=\operatorname{Ai}(x)\), is a solution to the differential equation \(f''(x)-xf(x)=0\). Given that \(\operatorname{Ai}(1)=\psi\) and \(\operatorname{Ai}'(1)=\phi\), the value of \(\operatorname{Ai}'''(1)+\operatorname{Ai}^{(4)}(1)\) can be written as \(A\psi+B\phi\) for integers \(A,B\). What is \(A+B\)?`,
    choices: ["2", "3", "5", "7", "NOTA"],
    answer: "C",
    solution: String.raw`From \(f''=xf\), differentiate successively:
\[f'''=f+xf',\]
\[f^{(4)}=2f'+xf''=2f'+x^2f.\]
At \(x=1\),
\[f'''(1)=\psi+\phi,\qquad f^{(4)}(1)=\psi+2\phi.\]
Their sum is \(2\psi+3\phi\), so \(A+B=5\).`,
  },
  {
    id: 10319,
    number: 319,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 2,
    methods: [],
    question: String.raw`A function \(f(x)\) is sadder than another function \(g(x)\) on an interval \(V\) if both functions are defined for all \(x\in V\) and there is at least one \(x_0\in V\) such that \(f(x_0)<g(x_0)\).

One, and only one, of these functions \(f(x)\) is sadder than \(g(x)=\arctan x\) on the interval \(0<x<1\). Which is it?`,
    choices: [String.raw`\(\frac{x}{1-x}\)`, String.raw`\(2x\)`, String.raw`\(2x^2\)`, String.raw`\(\frac{2x}{1+x^2}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`For \(0<x<1\),
\[\frac{x}{1-x}>x>\arctan x\qquad\text{and}\qquad 2x>x>\arctan x.\]
Also, \(2x^2<\arctan x\) for sufficiently small positive \(x\). Finally, let
\[q(x)=\frac{2x}{1+x^2}-\arctan x.\]
Then \(q(0)=0\), \(q(1)=1-\pi/4>0\), and
\[q'(x)=\frac{1-3x^2}{(1+x^2)^2},\]
so \(q\) first increases and then decreases while remaining positive on \((0,1)\). Therefore,
\[2x^2<\arctan x.\]
Thus \(2x^2\) is the unique function that is sadder than \(\arctan x\).`,
  },
  {
    id: 10320,
    number: 320,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 5,
    methods: [],
    question: String.raw`A function \(f(x)\) is sadder than another function \(g(x)\) on an interval \(V\) if both functions are defined for all \(x\in V\) and there is at least one \(x_0\in V\) such that \(f(x_0)<g(x_0)\).

Assume \(f(x)\) and \(g(x)\) are both continuous and differentiable on \(0\le x\le1\), with \(f(0)=g(0)=0\), \(f(1)=g(1)=1\), and \(f(x)\) sadder than \(g(x)\). Which statements must be true?

I. There exists some real number \(r>1\) such that \([g(x)]^r\) is sadder than \(f(x)\).

II. There exists some real number \(n>1\) such that \(x^ng(x)\) is sadder than \(f(x)\).`,
    choices: ["Neither I nor II", "Both I and II", "Only I", "Only II", "NOTA"],
    answer: "D",
    solution: String.raw`Statement I is false. For example, let
\[f(x)=2x^2-x,\qquad g(x)=5x-4x^2.\]
These functions satisfy all the endpoint conditions and \(f(x)<g(x)\) on \((0,1)\). Where \(f(x)\le0\), we have \([g(x)]^r\ge0\ge f(x)\). Where \(f(x)>0\), we have \(g(x)\ge1\), so \([g(x)]^r\ge g(x)>f(x)\) for every \(r>1\). Thus I need not hold.

Statement II must be true. Since \(f(1)=1\) and \(f\) is continuous, there is an interval \(1-\varepsilon<x<1\) on which \(0<f(x)<2\). Choose any \(x_0\) in this interval. As \(n\to\infty\), \(x_0^ng(x_0)\to0\). Therefore, for sufficiently large \(n\),
\[x_0^ng(x_0)<f(x_0),\]
so \(x^ng(x)\) is sadder than \(f(x)\). Thus only II is guaranteed.`,
  },
  {
    id: 10321,
    number: 321,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["First Derivative Test"],
    question: String.raw`A function \(f(x)\) is sadder than another function \(g(x)\) on an interval \(V\) if both functions are defined for all \(x\in V\) and there is at least one \(x_0\in V\) such that \(f(x_0)<g(x_0)\).

Consider \(f(x)=-\ln x\) and \(g(x)=k-x^2\) for a constant \(k\). What is the maximum value of \(k\) such that \(f(x)\) is not sadder than \(g(x)\) on \(0<x<\infty\)?`,
    choices: [String.raw`\(\frac12+\frac{\ln2}{2}\)`, String.raw`\(\frac12+\ln2\)`, String.raw`\(1+\frac{\ln2}{2}\)`, String.raw`\(2+2\ln2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Let
\[\Delta(x)=f(x)-g(x)=x^2-\ln x-k.\]
The function \(f\) is not sadder than \(g\) exactly when \(\Delta(x)\ge0\) for every \(x>0\). Its minimum occurs where
\[\Delta'(x)=2x-\frac1x=0,\qquad x=\frac{\sqrt2}{2}.\]
At this point,
\[\Delta\left(\frac{\sqrt2}{2}\right)=\frac12+\frac12\ln2-k.\]
Thus the maximum possible \(k\) is
\[\frac12+\frac{\ln2}{2}.\]`,
  },
  {
    id: 10322,
    number: 322,
    division: "Mu",
    topic: "Functions",
    difficulty: 3,
    methods: ["Chain Rule"],
    question: String.raw`Let \(f(x)\) be a continuous and differentiable function defined for \(x>0\). Given that \(f'(4)=5\) and
\[f(x)=f\left(\frac x2\right)+f(2x),\]
what is \(f'(1/2)\)? Note that continuous and differentiable functions satisfying these conditions do exist.`,
    choices: ["−80", "−40", "5", "10", "NOTA"],
    answer: "B",
    solution: String.raw`Differentiate the functional equation:
\[f'(x)=\frac12f'\left(\frac x2\right)+2f'(2x).\]
At \(x=1\) and \(x=2\), respectively,
\[f'(1)=\frac12f'\left(\frac12\right)+2f'(2),\]
\[f'(2)=\frac12f'(1)+2f'(4).\]
Substituting the second equation into the first gives
\[f'(1)=\frac12f'\left(\frac12\right)+f'(1)+4f'(4).\]
Since \(f'(4)=5\), we obtain \(f'(1/2)=-40\).`,
  },
  {
    id: 10323,
    number: 323,
    division: "Mu",
    topic: "Polynomials",
    difficulty: 4,
    methods: ["Product Rule"],
    question: String.raw`For \(n\ge1\), the Hermite polynomials are defined by
\[H_n(x)=(-1)^ne^{x^2}\left(\frac d{dx}\right)^n\left(e^{-x^2}\right).\]
Given that \(H_8(a)=h\) and \(H_8'(a)=0\), what is \(H_9(a)\)?`,
    choices: [String.raw`\(18h\)`, String.raw`\(2ah\)`, String.raw`\((9+8a)h\)`, String.raw`\((9+2a)h\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Differentiate the defining relation to obtain
\[H_n'(x)=2xH_n(x)-H_{n+1}(x).\]
For \(n=8\) and \(x=a\),
\[0=H_8'(a)=2aH_8(a)-H_9(a).\]
Since \(H_8(a)=h\), it follows that
\[H_9(a)=2ah.\]`,
  },
  {
    id: 10324,
    number: 324,
    division: "Mu",
    topic: "Polynomials",
    difficulty: 5,
    methods: ["Product Rule"],
    question: String.raw`For \(n\ge1\), the Hermite polynomials are defined by
\[H_n(x)=(-1)^ne^{x^2}\left(\frac d{dx}\right)^n\left(e^{-x^2}\right).\]
Given that \(H_8(a)=h\) and \(H_8'(a)=0\), what is \(H_9'(a)\)?`,
    choices: [String.raw`\(18h\)`, String.raw`\(2ah\)`, String.raw`\((9+8a)h\)`, String.raw`\((9+2a)h\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The Hermite identities
\[H_n'(x)=2nH_{n-1}(x),\qquad H_{n+1}(x)=2xH_n(x)-2nH_{n-1}(x)\]
combine to give
\[H_{n+1}(x)=2xH_n(x)-H_n'(x).\]
Differentiate this last identity:
\[H_{n+1}'(x)=2H_n(x)+2xH_n'(x)-H_n''(x).\]
At a zero of \(H_8'\), the Hermite differential equation \(H_8''-2xH_8'+16H_8=0\) gives \(H_8''(a)=-16h\). Therefore,
\[H_9'(a)=2h-(-16h)=18h.\]`,
  },
  {
    id: 10325,
    number: 325,
    division: "Mu",
    topic: "Geometry",
    difficulty: 4,
    methods: ["Tangency", "Double-Angle Identity"],
    question: String.raw`A mirror is shaped like the curve \(y=\sqrt[3]x\) for positive \(x\). A ray of light is emitted from the origin following the line \(y=mx\), in the direction of increasing \(x\). It hits and reflects off the mirror. What is the positive value of \(m\) such that, after reflection, the ray travels parallel to the \(x\)-axis?`,
    choices: [String.raw`\(\sqrt[3]3\)`, String.raw`\(\sqrt3\)`, String.raw`\(\sqrt[3]9\)`, "3", "NOTA"],
    answer: "B",
    solution: String.raw`Let \(P=(x_P,\sqrt[3]{x_P})\) be the point of reflection. Because \(P\) also lies on \(y=mx\),
\[mx_P=\sqrt[3]{x_P},\qquad x_P=m^{-3/2}.\]
The tangent slope at \(P\) is
\[f'(x_P)=\frac13x_P^{-2/3}=\frac m3.\]
Let \(\beta=\arctan m\) be the incident ray's angle with the horizontal, and let \(\theta_1=\arctan(m/3)\) be the tangent's angle. The law of reflection and the horizontal reflected ray give \(\beta=2\theta_1\). Thus,
\[\arctan m=2\arctan\left(\frac m3\right).\]
Using the tangent double-angle identity,
\[m=\frac{2m/3}{1-m^2/9}.\]
For positive \(m\), this yields \(m^2=3\), so
\[m=\sqrt3.\]`,
  },
];
