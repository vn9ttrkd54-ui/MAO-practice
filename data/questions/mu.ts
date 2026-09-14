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
  // 2024 FAMAT State Convention — Calculus Individual Test.
  // Original questions 1–30 map to bank questions 177–206 (IDs 10177–10206).
  // Checked against the supplied answer key and independently derived solutions.
  // NOTA means none of choices A–D. Ratings use the existing 1–5 bank scale;
  // contest success rates inform, but do not determine, mathematical difficulty.
  // Q2 adds continuity at 4 to repair the composition-limit assumption.
  // Q20 specifies the standard upright cone/cube placement used by the key.
  // Q27/Q29/Q30 repeat required definitions so each works independently.
  {
    id: 10177,
    number: 177,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Mean Value Theorem"],
    question: String.raw`Legosi asks Louis to find the value \(c_1\) satisfying the mean value theorem for derivatives for \(f(x)=x^2\) on \([0,1]\). Louis instead finds the value \(c_2\) satisfying the mean value theorem for integrals for the same function and interval. Find \(c_1c_2\).`,
    choices: [String.raw`\(\frac{\sqrt3}{6}\)`, String.raw`\(\frac14\)`, String.raw`\(\frac16\)`, String.raw`\(\frac{\sqrt3}{3}\)`, "NOTA"], answer: "A",
    solution: String.raw`For derivatives, \(2c_1=(f(1)-f(0))/(1-0)=1\), so \(c_1=1/2\). For integrals,
\[c_2^2=\frac1{1-0}\int_0^1x^2\,dx=\frac13.\]
Since \(c_2\in(0,1)\), \(c_2=1/\sqrt3\). Thus \(c_1c_2=\sqrt3/6\).`,
  },
  {
    id: 10178,
    number: 178,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    question: String.raw`If \(\lim_{x\to2}f(x)=4\), \(\lim_{x\to4}f(x)=3\), and \(f\) is continuous at \(4\), compute \(\displaystyle\lim_{x\to2}[2f(x)+f(f(x))]\).`,
    choices: ["11", "12", "10", "7", "NOTA"], answer: "A",
    solution: String.raw`Since \(f(x)\to4\) and \(f\) is continuous at 4, \(f(f(x))\to f(4)=3\). Therefore the limit is \(2(4)+3=11\). The continuity assumption ensures this remains true even if \(f(x)=4\) near \(x=2\).`,
  },
  {
    id: 10179,
    number: 179,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Power Rule"],
    question: String.raw`If \(f(x)=x^2+2x-\frac1x\), compute \(f'(2)\).`,
    choices: [String.raw`\(\frac{23}{4}\)`, String.raw`\(\frac{13}{2}\)`, String.raw`\(\frac{25}{4}\)`, String.raw`\(\frac{11}{2}\)`, "NOTA"], answer: "C",
    solution: String.raw`Differentiating gives \(f'(x)=2x+2+x^{-2}\). Hence \(f'(2)=4+2+1/4=25/4\).`,
  },
  {
    id: 10180,
    number: 180,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Product Rule"],
    question: String.raw`If \(f(1)=2\), \(f'(1)=3\), \(g(1)=-1\), and \(g'(1)=-2\), compute \(\left.\frac{d}{dx}[f(x)g(x)]\right|_{x=1}\).`,
    choices: ["9", "−7", "6", "−8", "NOTA"], answer: "B",
    solution: String.raw`The product rule gives \(f'(1)g(1)+f(1)g'(1)=3(-1)+2(-2)=-7\).`,
  },
  {
    id: 10181,
    number: 181,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    question: String.raw`If \(f(2)=1\), \(f(4)=2\), \(f'(2)=-1\), and \(f'(4)=-2\), compute \(\left.\frac{d}{dx}[(f(x^2))^2]\right|_{x=2}\).`,
    choices: ["−32", "−16", "−8", "−4", "NOTA"], answer: "A",
    solution: String.raw`Apply the chain rule twice:
\[\frac{d}{dx}[(f(x^2))^2]=2f(x^2)f'(x^2)(2x).\]
At \(x=2\), this is \(2(2)(-2)(4)=-32\).`,
  },
  {
    id: 10182,
    number: 182,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["U-Substitution"],
    question: String.raw`If \(\int_0^1 f(x)\,dx=4\), compute \(\displaystyle\int_0^1 xf(x^2)\,dx\).`,
    choices: ["16", "4", "8", "2", "NOTA"], answer: "D",
    solution: String.raw`Let \(u=x^2\), so \(du=2x\,dx\). The endpoints remain 0 and 1, giving \(\frac12\int_0^1f(u)\,du=2\).`,
  },
  {
    id: 10183,
    number: 183,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["U-Substitution", "Integral Properties"],
    question: String.raw`If \(\int_0^1f(x)\,dx=2\) and \(\int_0^1f(2x)\,dx=3\), compute \(\displaystyle\int_1^2f(x)\,dx\).`,
    choices: ["4", "1", "5", "8", "NOTA"], answer: "A",
    solution: String.raw`Substituting \(u=2x\) gives \(3=\frac12\int_0^2f(u)\,du\), so \(\int_0^2f=6\). Subtract \(\int_0^1f=2\) to obtain \(\int_1^2f=4\).`,
  },
  {
    id: 10184,
    number: 184,
    division: "Mu",
    topic: "Area Between Curves",
    difficulty: 2,
    methods: [],
    question: String.raw`Find the total area of all finite regions bounded by \(y=x^3-x\) and the \(x\)-axis.`,
    choices: [String.raw`\(\frac14\)`, "0", String.raw`\(\frac32\)`, String.raw`\(\frac12\)`, "NOTA"], answer: "D",
    solution: String.raw`The zeros are \(-1,0,1\). The two bounded regions have equal area by odd symmetry. On \((0,1)\), the graph is below the axis, so the total area is
\[2\int_0^1(x-x^3)\,dx=2\left(\frac12-\frac14\right)=\frac12.\]`,
  },
  {
    id: 10185,
    number: 185,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 2,
    methods: ["Implicit Differentiation"],
    question: String.raw`Find the \(y\)-intercept of the tangent line to \(x^3+y^3=9\) at \((1,2)\).`,
    choices: [String.raw`\(\frac94\)`, String.raw`\(-\frac14\)`, String.raw`\(\frac14\)`, String.raw`\(\frac74\)`, "NOTA"], answer: "A",
    solution: String.raw`Implicit differentiation gives \(3x^2+3y^2y'=0\), hence \(y'=-x^2/y^2=-1/4\) at \((1,2)\). Thus \(y-2=-\frac14(x-1)\), whose \(y\)-intercept is \(9/4\).`,
  },
  {
    id: 10186,
    number: 186,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    question: String.raw`Jack's calculus test asks him to compute \(\displaystyle\lim_{x\to3}\frac{x^2+2x-n}{x-3}\), but the constant \(n\) is smudged. Given that the limit exists and is finite, what is the value of the limit?`,
    choices: ["8", "−2", "0", "15", "NOTA"], answer: "A",
    solution: String.raw`A finite limit requires the numerator to vanish at 3, so \(9+6-n=0\) and \(n=15\). Then
\[\frac{x^2+2x-15}{x-3}=\frac{(x+5)(x-3)}{x-3}=x+5\quad(x\ne3).\]
The requested limit is 8, not the smudged constant 15.`,
  },
  {
    id: 10187,
    number: 187,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["First Derivative Test"],
    question: String.raw`Legom produces \(x\) egg sandwiches, where \(0\le x\le36\), and sells each for \(\sqrt{36-x}\). How many sandwiches should she produce to maximize revenue?`,
    choices: ["12", "24", "18", "27", "NOTA"], answer: "B",
    solution: String.raw`Revenue is \(R=x\sqrt{36-x}\ge0\), so maximizing \(R\) is equivalent to maximizing \(R^2=36x^2-x^3\). Its derivative is \(3x(24-x)\), positive on \((0,24)\) and negative on \((24,36)\). Both endpoint revenues are zero. The maximum occurs at \(x=24\).`,
  },
  {
    id: 10188,
    number: 188,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 2,
    methods: [],
    question: String.raw`For a set \(S\) of real numbers, \(\sup(S)\) is its least upper bound and \(\inf(S)\) is its greatest lower bound. If \(S=\{x\in\mathbb R:2<x^2<3\}\), compute \(\sup(S)\inf(S)\).`,
    choices: [String.raw`\(\sqrt6\)`, "3", "2", String.raw`\(-\sqrt6\)`, "NOTA"], answer: "E",
    solution: String.raw`The set is \((-\sqrt3,-\sqrt2)\cup(\sqrt2,\sqrt3)\). Its supremum is \(\sqrt3\) and its infimum is \(-\sqrt3\), even though neither endpoint belongs to the set. Their product is \(-3\), so the answer is NOTA.`,
  },
  {
    id: 10189,
    number: 189,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: ["Trig Identity"],
    question: String.raw`Compute \(\displaystyle\lim_{x\to0}\frac{\sin x-\tan x}{x^3}\).`,
    choices: [String.raw`\(\frac16\)`, String.raw`\(-\frac12\)`, String.raw`\(-\frac16\)`, "0", "NOTA"], answer: "B",
    solution: String.raw`Factor using \(\sin x-\tan x=\sin x(\cos x-1)/\cos x\):
\[\frac{\sin x-\tan x}{x^3}=\frac{\sin x}{x}\frac{\cos x-1}{x^2}\frac1{\cos x}.\]
Since \(\cos x-1=-2\sin^2(x/2)\), the middle factor tends to \(-1/2\). The other factors tend to 1, giving \(-1/2\).`,
  },
  {
    id: 10190,
    number: 190,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Linear Approximation"],
    question: String.raw`Collot approximates \(\sqrt n\), for a positive integer \(n\), using the tangent line to \(y=\sqrt x\) at \((25,5)\). His approximation is \(28/5\). Find \(n\).`,
    choices: ["29", "30", "31", "28", "NOTA"], answer: "C",
    solution: String.raw`The tangent slope is \(1/(2\sqrt{25})=1/10\), so the linear approximation is \(5+(n-25)/10\). Set this equal to \(28/5\): \((n-25)/10=3/5\), hence \(n=31\).`,
  },
  {
    id: 10191,
    number: 191,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["U-Substitution", "Partial Fractions"],
    question: String.raw`Evaluate \(\displaystyle\int_1^9\frac{dx}{(8x+27)\sqrt{2x+7}}\).`,
    choices: [String.raw`\(\frac12\ln\frac{63}{55}\)`, String.raw`\(\frac12\ln\frac{51}{19}\)`, String.raw`\(\frac14\ln\frac{63}{55}\)`, String.raw`\(\frac14\ln\frac{51}{19}\)`, "NOTA"], answer: "C",
    solution: String.raw`Let \(u=\sqrt{2x+7}\). Then \(dx=u\,du\), \(8x+27=4u^2-1\), and the bounds become 3 and 5. Thus
\[\int_3^5\frac{du}{4u^2-1}=\frac14\left[\ln\frac{2u-1}{2u+1}\right]_3^5
=\frac14\ln\left(\frac9{11}\frac75\right)=\frac14\ln\frac{63}{55}.\]`,
  },
  {
    id: 10192,
    number: 192,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["Stirling's Approximation"],
    question: String.raw`Stirling's approximation states that \(\displaystyle\frac{n!}{\sqrt{2\pi n}(n/e)^n}\to1\) as \(n\to\infty\). Compute \(\displaystyle\lim_{n\to\infty}\frac{\sqrt[n]{n!}}n\).`,
    choices: [String.raw`\(\frac1e\)`, "0", "1", String.raw`\(\frac12\)`, "NOTA"], answer: "A",
    solution: String.raw`Write \(n!=r_n\sqrt{2\pi n}(n/e)^n\), where \(r_n\to1\). Then
\[\frac{\sqrt[n]{n!}}n=r_n^{1/n}(2\pi n)^{1/(2n)}\frac1e.\]
The first two factors tend to 1: their logarithms tend to 0. Therefore the limit is \(1/e\).`,
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
\text{II: }\sum_{n=2}^{\infty}\frac{(-1)^n n}{\ln n}\]
\[\text{III: }\sum_{n=1}^{\infty}\frac{n!}{n^n}\qquad
\text{IV: }\sum_{n=1}^{\infty}(e^{1/n}-1).\]`,
    choices: ["III and IV only", "I and III only", "I and IV only", "I, II, and IV only", "NOTA"], answer: "B",
    solution: String.raw`I is a finite sum of finite terms. II diverges because its terms do not tend to zero. For III, Stirling's approximation gives \(\sqrt[n]{n!/n^n}\to1/e<1\), so the root test proves convergence. For IV, \(e^t\ge1+t\) implies \(e^{1/n}-1\ge1/n\); comparison with the harmonic series proves divergence. Thus only I and III converge.`,
  },
  {
    id: 10194,
    number: 194,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 3,
    methods: ["Integral Properties"],
    question: String.raw`Evaluate the improper integral \(\displaystyle\int_0^{2024\pi}\frac{dx}{\sqrt{\arccos(\cos x)}}\).`,
    choices: [String.raw`\(2024\sqrt\pi\)`, String.raw`\(1012\sqrt\pi\)`, String.raw`\(4048\sqrt\pi\)`, String.raw`\(9096\sqrt\pi\)`, "NOTA"], answer: "C",
    solution: String.raw`On \([0,\pi]\), \(\arccos(\cos x)=x\), giving the convergent improper integral \(\int_0^\pi x^{-1/2}\,dx=2\sqrt\pi\). On \([\pi,2\pi]\), the expression is \(2\pi-x\), giving the same integral. This pattern repeats every \(2\pi\). There are 2024 half-periods, so the total is \(2024(2\sqrt\pi)=4048\sqrt\pi\).`,
  },
  {
    id: 10195,
    number: 195,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["Trig Substitution"],
    question: String.raw`Evaluate \(\displaystyle\int_0^{1/2024}\sqrt{\frac1x-2024}\,dx\).`,
    choices: [String.raw`\(\frac{\pi\sqrt{506}}{506}\)`, String.raw`\(\frac{\pi\sqrt{506}}{4048}\)`, String.raw`\(\frac{\pi\sqrt{506}}{2024}\)`, String.raw`\(\frac{\pi\sqrt{506}}{1012}\)`, "NOTA"], answer: "C",
    solution: String.raw`Set \(x=\sin^2\theta/2024\), with \(0<\theta\le\pi/2\). Then the integrand is \(\sqrt{2024}\cot\theta\) and \(dx=2\sin\theta\cos\theta\,d\theta/2024\). Hence
\[\frac2{\sqrt{2024}}\int_0^{\pi/2}\cos^2\theta\,d\theta
=\frac{\pi}{2\sqrt{2024}}=\frac{\pi\sqrt{506}}{2024}.\]`,
  },
  {
    id: 10196,
    number: 196,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    question: String.raw`A cube of side length 1 is inscribed in a right circular cone with one face in the cone's base plane and the opposite four vertices on its lateral surface. The cube is centered on the cone's axis. Find the smallest possible cone volume.`,
    choices: [String.raw`\(\frac{32\pi}{27}\)`, String.raw`\(\frac{9\pi}{8}\)`, String.raw`\(\frac{4\pi}{3}\)`, String.raw`\(\frac{25\pi}{24}\)`, "NOTA"], answer: "B",
    solution: String.raw`Let the cone have height \(H>1\) and radius \(R\). At height 1 its cross-sectional radius equals the cube's half-diagonal \(1/\sqrt2\). Similar triangles give \(R(H-1)/H=1/\sqrt2\), so
\[V(H)=\frac\pi3R^2H=\frac{\pi H^3}{6(H-1)^2},\qquad
V'(H)=\frac{\pi H^2(H-3)}{6(H-1)^3}.\]
The volume decreases for \(1<H<3\) and increases for \(H>3\), so its global minimum is \(V(3)=9\pi/8\).`,
  },
  {
    id: 10197,
    number: 197,
    division: "Mu",
    topic: "Riemann Sums",
    difficulty: 4,
    methods: ["Riemann Sums", "Partial Fractions"],
    question: String.raw`Given \(\ln2\approx0.693\), \(\ln3\approx1.099\), and \(\ln5\approx1.609\), which choice is closest to
\[\frac1{2000^2+2000(1000)}+\frac1{2001^2+2001(1000)}+\cdots+\frac1{2999^2+2999(1000)}?\]`,
    choices: ["0.000287", "0.000119", "0.000283", "0.000104", "NOTA"], answer: "B",
    solution: String.raw`Writing \(g(t)=1/(t^2+t)\), the sum is \(\frac1{1000}\) times a left Riemann sum for \(\int_2^3g(t)\,dt\). Partial fractions give
\[\int_2^3g(t)\,dt=[\ln t-\ln(t+1)]_2^3=2\ln3-3\ln2\approx0.119.\]
Thus the sum is near \(0.000119\). This is not an exact integral identity: since \(g\) decreases, the discretization error is at most \((g(2)-g(3))/1000^2=1/12000000\). Even allowing rounding error in the supplied logarithms (at most \(0.0000025\) after division by 1000), choice B remains closer than any other choice.`,
  },
  {
    id: 10198,
    number: 198,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 4,
    methods: ["First-Order Linear Equations", "Integration by Parts"],
    question: String.raw`Consider \(y'+\frac{y}{x^2}=\frac1{x^3}\), where \(y(1)=3\). Compute \(y(2)\).
Hint: find \(I(x)\) so that multiplying by it makes the left side \([yI(x)]'\), then integrate.`,
    choices: [String.raw`\(\frac32+\sqrt e\)`, String.raw`\(\frac12+\frac3{\sqrt e}\)`, String.raw`\(\frac12+3\sqrt e\)`, String.raw`\(\frac32+\frac1{\sqrt e}\)`, "NOTA"], answer: "D",
    solution: String.raw`An integrating factor is \(I(x)=e^{-1/x}\), since \(I'/I=1/x^2\). Then
\[(ye^{-1/x})'=\frac{e^{-1/x}}{x^3}.\]
With \(u=-1/x\), the right side integrates to \(\int-ue^u\,du=(1-u)e^u+C\). Thus \(y=1+1/x+Ce^{1/x}\). The initial condition gives \(C=1/e\), so \(y(2)=3/2+e^{-1/2}\).`,
  },
  {
    id: 10199,
    number: 199,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 3,
    methods: ["Disk Method", "U-Substitution"],
    question: String.raw`The surface of an egg is modeled by \(x^2+y^2=z(1-z)^{3/2}\) for \(0\le z\le1\). Compute the volume enclosed.`,
    choices: [String.raw`\(\frac{4\pi}{35}\)`, String.raw`\(\frac{8\pi}{15}\)`, String.raw`\(\frac{4\pi}{15}\)`, String.raw`\(\frac{8\pi}{35}\)`, "NOTA"], answer: "A",
    solution: String.raw`A cross section perpendicular to the \(z\)-axis is a disk of area \(\pi z(1-z)^{3/2}\). Substitute \(u=1-z\):
\[V=\pi\int_0^1z(1-z)^{3/2}\,dz
=\pi\int_0^1(u^{3/2}-u^{5/2})\,du
=\pi\left(\frac25-\frac27\right)=\frac{4\pi}{35}.\]`,
  },
  {
    id: 10200,
    number: 200,
    division: "Mu",
    topic: "Applications of Integration",
    difficulty: 3,
    methods: [],
    question: String.raw`For \(0<a<1\), consider the triangle formed by the tangent line to \(y=\sqrt[3]x\) at \((a,\sqrt[3]a)\) and the coordinate axes. Find the average area of this triangle over \(0<a<1\).`,
    choices: [String.raw`\(\frac37\)`, String.raw`\(\frac25\)`, String.raw`\(\frac27\)`, String.raw`\(\frac35\)`, "NOTA"], answer: "C",
    solution: String.raw`The tangent line is \(y=\frac13a^{-2/3}x+\frac23a^{1/3}\), with intercepts \(-2a\) and \(\frac23a^{1/3}\). Its triangle has area \(\frac12(2a)(\frac23a^{1/3})=\frac23a^{4/3}\). The average over an interval of length 1 is
\[\int_0^1\frac23a^{4/3}\,da=\frac23\frac37=\frac27.\]`,
  },
  {
    id: 10201,
    number: 201,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 4,
    methods: ["Law of Cosines", "Implicit Differentiation"],
    question: String.raw`The foot of a 7-meter ladder is fixed to the ground 5 meters from a tree's base. The ladder's top stays in contact with the tree as the tree tips away from the ladder, its base fixed. The angle \(\theta\) between the tree and the ground ray pointing toward the ladder's foot increases at 2 radians per second. Find the speed (m/s) at which the ladder's top slides along the tree when \(\theta=2\pi/3\).`,
    choices: [String.raw`\(\frac{30\sqrt3}{11}\)`, String.raw`\(\frac{30\sqrt3}{13}\)`, String.raw`\(\frac{30\sqrt3}{7}\)`, String.raw`\(30\sqrt3\)`, "NOTA"], answer: "A",
    solution: String.raw`Let \(c\) be the distance along the tree from its base to the ladder's top. The law of cosines gives \(49=25+c^2-10c\cos\theta\). At \(\theta=2\pi/3\), \(c^2+5c-24=0\), so \(c=3\). Differentiating with respect to time gives
\[0=(2c-10\cos\theta)c'+10c\sin\theta\,\theta'.\]
Substituting gives \(0=11c'+30\sqrt3\), so the sliding speed is \(|c'|=30\sqrt3/11\).`,
  },
  {
    id: 10202,
    number: 202,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: ["Infinite Geometric Series"],
    question: String.raw`Suppose \(\sum_{n=0}^{\infty}a_nx^n\) is the Maclaurin series of \(\frac1{x^2+x+1}\). Compute \(\displaystyle\sum_{n=0}^{\infty}\frac{a_{2n}}{2^n}\).`,
    choices: [String.raw`\(\frac{68}{63}\)`, String.raw`\(\frac{20}{21}\)`, String.raw`\(\frac{10}{7}\)`, String.raw`\(\frac67\)`, "NOTA"], answer: "D",
    solution: String.raw`For \(|x|<1\),
\[\frac1{1+x+x^2}=\frac{1-x}{1-x^3}=\sum_{k=0}^{\infty}(x^{3k}-x^{3k+1}).\]
Thus the even-index coefficients \(a_0,a_2,a_4,a_6,\ldots\) repeat \(1,0,-1\). The desired sum is
\[1-\frac14+\frac18-\frac1{32}+\cdots
=\left(1-\frac14\right)\sum_{k=0}^{\infty}\frac1{8^k}=\frac34\frac87=\frac67.\]`,
  },
  {
    id: 10203,
    number: 203,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 5,
    methods: ["Integral Inequalities"],
    question: String.raw`Let \(f\) range over all continuous nonnegative functions on \([0,3]\) satisfying \(\int_0^3f(x)\,dx=4\). Let \(S\) be the set of possible values of \(\int_0^3\sqrt{1+f(x)^2}\,dx\). Compute \(\sup(S)+\inf(S)\), where \(\sup\) and \(\inf\) mean least upper bound and greatest lower bound.`,
    choices: ["10", "9", "12", "15", "NOTA"], answer: "C",
    solution: String.raw`The tangent-line inequality for the convex function \(\sqrt{1+t^2}\) at \(t=4/3\) is
\[\sqrt{1+t^2}\ge\frac35+\frac45t.\]
Integrating gives a lower bound of \(9/5+16/5=5\), attained by \(f\equiv4/3\). Also \(\sqrt{1+t^2}\le1+t\) for \(t\ge0\), so every integral is at most 7.
To approach 7, take a continuous triangular spike of width \(\varepsilon\) and height \(8/\varepsilon\), zero elsewhere. Its area is 4. Outside the spike the integrand is 1; inside it is at least \(f\). Hence the integral is at least \(3-\varepsilon+4=7-\varepsilon\). Thus \(\inf(S)=5\), \(\sup(S)=7\), and their sum is 12.`,
  },
  {
    id: 10204,
    number: 204,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["Integral Properties"],
    question: String.raw`Evaluate \(\displaystyle\int_0^{2\pi}\frac{dx}{1+e^{\sin^3x}}\).`,
    choices: [String.raw`\(\frac{2\pi}{3}\)`, String.raw`\(2\pi\)`, String.raw`\(\pi\)`, String.raw`\(\frac{4\pi}{3}\)`, "NOTA"], answer: "C",
    solution: String.raw`Let \(h(x)=1/(1+e^{\sin^3x})\). Since \(\sin(x+\pi)=-\sin x\),
\[h(x)+h(x+\pi)=\frac1{1+e^{\sin^3x}}+\frac1{1+e^{-\sin^3x}}=1.\]
Split the integral at \(\pi\) and shift the second half by \(\pi\). The result is \(\int_0^\pi1\,dx=\pi\).`,
  },
  {
    id: 10205,
    number: 205,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Integration by Parts", "Stirling's Approximation"],
    question: String.raw`Define \(I_n=\int_{-\infty}^{\infty}x^{2n}e^{-x^2}\,dx\) for nonnegative integers \(n\). Which function \(f(n)\) makes \(\lim_{n\to\infty}I_n/f(n)\) finite and nonzero? You may use Stirling's approximation \(n!\sim\sqrt{2\pi n}(n/e)^n\).`,
    choices: [String.raw`\(\left(\frac{2n}e\right)^n\)`, String.raw`\(\left(\frac ne\right)^n\)`, String.raw`\(\left(\frac ne\right)^n\sqrt n\)`, String.raw`\(\left(\frac{2n}e\right)^n\sqrt n\)`, "NOTA"], answer: "B",
    solution: String.raw`Integration by parts, with vanishing boundary terms, gives \(I_n=\frac{2n-1}{2}I_{n-1}\). Thus
\[I_n=\frac{(2n)!}{4^n n!}I_0
\sim\frac{\sqrt{4\pi n}(2n/e)^{2n}}{4^n\sqrt{2\pi n}(n/e)^n}I_0
=\sqrt2\left(\frac ne\right)^n I_0.\]
Since \(I_0\) is finite and positive, choice B gives a finite nonzero limit. Each other proposed denominator grows faster and gives zero.`,
  },
  {
    id: 10206,
    number: 206,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Integration by Parts", "Stirling's Approximation", "Gaussian Integral"],
    question: String.raw`Let \(I_n=\int_{-\infty}^{\infty}x^{2n}e^{-x^2}\,dx\). Compute
\[L=\lim_{n\to\infty}\frac{I_n}{(n/e)^n}.\]
You may use \(\int_{-\infty}^{\infty}e^{-x^2}\,dx=\sqrt\pi\) and Stirling's approximation \(n!\sim\sqrt{2\pi n}(n/e)^n\).`,
    choices: [String.raw`\(\pi\sqrt2\)`, String.raw`\(\frac{\pi\sqrt2}{2}\)`, String.raw`\(\frac{\sqrt{2\pi}}2\)`, String.raw`\(\sqrt{2\pi}\)`, "NOTA"], answer: "D",
    solution: String.raw`Integration by parts yields \(I_n=\frac{2n-1}{2}I_{n-1}\), hence \(I_n=\frac{(2n)!}{4^n n!}\sqrt\pi\). Applying Stirling's approximation,
\[\frac{I_n}{(n/e)^n}\sim
\frac{\sqrt{4\pi n}(2n/e)^{2n}\sqrt\pi}
{4^n\sqrt{2\pi n}(n/e)^n(n/e)^n}
=\sqrt{2\pi}.\]
Therefore \(L=\sqrt{2\pi}\).`,
  },
];
