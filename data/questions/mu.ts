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
    methods: ["Trig Identity"],
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
    methods: ["Maclaurin Series"],
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
    methods: ["Trig Identity"],
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
    methods: ["Trig Identity"],
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
\[\frac{2\sqrt b}{\sqrt{2b}}=\sqrt2.\]

The printed solution substitutes \(\theta=\pi/4\) before resolving the indeterminate form and then cancels \(x-y\). However, the relation \(t^2=b/a\) shows that \(x=y=\sqrt{ab}\), so its cancellation is actually a cancellation of zero in the limiting configuration. That step is invalid. The correct answer is \(\boxed{\sqrt2}\).`,
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
    methods: ["Chain Rule", "Trig Identity"],
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
    methods: ["Homogeneous First-Order"],
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
    methods: ["Maclaurin Series"],
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
But \(f-g\) is a polynomial with integer coefficients. If it were nonzero, this equation would make \(\pi\) algebraic, contradicting the fact that \(\pi\) is transcendental. Therefore \(f-g\) must be the zero polynomial and \(f=g\). One requested value is sufficient, and zero values clearly cannot identify the polynomial. The minimum is therefore 1, which is not listed, so the answer is NOTA.

The printed solution obtains 2 by first requesting \(f(1)=S\) and then using \(f(S+1)\) as a base-\((S+1)\) encoding of the coefficients. That method works, but it is not minimal because the question does not require \(n\) to be an integer.`,
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
    methods: ["U-Substitution", "Trig Identity"],
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
];
