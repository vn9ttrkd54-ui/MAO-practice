import type { Question } from "@/types/question";

// Chiles Statewide Competition, January 11, 2025. Source #9 was thrown out.
export const thetaQuestions: Question[] = [
  {
    id: 30001, number: 1, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: ["Tangency"],
    question: String.raw`When graphed on the real \(xy\)-plane, the graphs of \(f(x)=(x-1)^2+(y+3)^2=4\) and \(x=3\) intersect at how many distinct points?`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`\(f(x)\) is a circle whose center is at \((1,-3)\) and radius \(2\). That means the circle contains the point \((3,-3)\), through which \(x=3\) passes. The line \(x=3\) is tangent to the circle, so there is \(\boxed{1}\) distinct intersection point.`,
  },
  {
    id: 30002, number: 2, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Remainder Theorem"],
    question: String.raw`The polynomial \(P=3x^3-9x^2+kx-18\) has \((x-3)\) as a factor. Which is also a factor of the polynomial \(P\)?`,
    choices: [String.raw`\(x^2+2\)`, String.raw`\(3x+6\)`, String.raw`\(3x^2-6\)`, String.raw`\(x^2-2x\)`, "NOTA"], answer: "A",
    solution: String.raw`Since \((x-3)\) is a factor, \(P(3)=0\). Thus \(81-81+3k-18=0\), and \(k=6\).
\[P=3x^3-9x^2+6x-18=3x^2(x-3)+6(x-3)=3(x^2+2)(x-3).\]
Of the choices, \(\boxed{x^2+2}\) is a factor.`,
  },
  {
    id: 30003, number: 3, division: "Theta", topic: "Rate of Change", difficulty: 1, methods: [],
    question: String.raw`A car travels \(\frac{x}{12}\) feet in \(y\) seconds. If this rate is maintained, then in \(6\) seconds, how many yards does the car travel?`,
    choices: [String.raw`\(\frac{x}{6y}\)`, String.raw`\(\frac{x}{36y}\)`, String.raw`\(\frac{xy}{36}\)`, String.raw`\(\frac{4x}{y}\)`, "NOTA"], answer: "A",
    solution: String.raw`The rate is \(\frac{x}{12y}\) feet per second. In \(6\) seconds the car travels \(\frac{x}{2y}\) feet. Dividing by \(3\) feet per yard gives \(\boxed{\frac{x}{6y}}\) yards.`,
  },
  {
    id: 30004, number: 4, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: ["Logarithms"],
    question: String.raw`For \(y=\log16\div\log\left(\frac18\right)\), give the value of \(120-12y\).`,
    choices: ["140", "136", "104", "98", "NOTA"], answer: "B",
    solution: String.raw`\[y=\frac{4\log2}{-3\log2}=-\frac43.\]
So \(120-12y=120-12\left(-\frac43\right)=\boxed{136}\).`,
  },
  {
    id: 30005, number: 5, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`A jar contains \(n\) ounces of a solution which is \(n\%\) sugar. How many ounces of sugar must be added to make the resultant solution \(2n\%\) sugar?`,
    choices: [String.raw`\(\frac{50n}{50-n}\)`, String.raw`\(\frac n{50}\)`, String.raw`\(\frac{100n}{100-n}\)`, String.raw`\(\frac{n^2}{100-2n}\)`, "NOTA"], answer: "D",
    solution: String.raw`There are \(\frac{n^2}{100}\) ounces of sugar initially. If \(x\) ounces are added,
\[\frac{n^2/100+x}{n+x}=\frac{2n}{100}.\]
Therefore \(n^2+100x=2n^2+2nx\), so \(x=\boxed{\frac{n^2}{100-2n}}\).`,
  },
  {
    id: 30006, number: 6, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`Fifteen of the first \(20\) questions of a test were answered correctly by Ralph. On the rest of the test, Ralph answered \(\frac13\) of the questions correctly. He answered \(50\%\) correctly in all, of the \(T\) total questions. If he had answered \(X\) more of the questions correctly (out of the \(T\) total) he would have gotten \(60\%\) correct. Find the value of \(X\).`,
    choices: ["5", "8", "10", "12", "NOTA"], answer: "A",
    solution: String.raw`Ralph got \(15+\frac13(T-20)=\frac12T\) questions correct, which gives \(T=50\). Thus he answered \(25\) correctly. If he answered \(X\) more correctly, then \(\frac{X+25}{50}=\frac35\), so \(\boxed{X=5}\).`,
  },
  {
    id: 30007, number: 7, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    question: String.raw`A balanced scale is available to weigh packages which may weigh from \(1\) lb to \(9\) pounds, inclusive. All packages have integral weights. If you can use a \(1\) lb, a \(3\) lb, and/or a \(5\) lb weight on either plate of the scale, in addition to the object to be weighed, how many distinct pound weights \(\{1,2,\ldots,9\}\) of packages can you accurately determine? (Note: the weights can be put on either or both plates of the scale.)`,
    choices: ["5", "6", "8", "9", "NOTA"], answer: "D",
    solution: String.raw`All are possible:
\[1=1,\ 2=3-1,\ 3=3,\ 4=5-1,\ 5=5,\]
\[6=5+1,\ 7=5+3-1,\ 8=5+3,\ 9=5+3+1.\]
Thus all \(\boxed9\) package weights can be determined.`,
    illustration: {
      src: "/questions/theta-7-balance-scale.svg",
      alt: "A balanced two-pan scale with an object on the left pan, alongside separate 1-pound, 3-pound, and 5-pound weights.",
      width: 600,
      height: 230,
    },
  },
  {
    id: 30008, number: 8, division: "Theta", topic: "Simplification", difficulty: 2, methods: [],
    question: String.raw`The expression,
\[\frac{x^2+y^2-z^2+2xy}{x^2+z^2-y^2+2xz},\]
where defined, can be reduced to which of the following?`,
    choices: [String.raw`\(\frac{x(x+y)}{z(x-y)}\)`, String.raw`\(-1\)`, String.raw`\(\frac{x+y-z}{x+z-y}\)`, String.raw`\(\frac{x-y+z}{x+y-z}\)`, "NOTA"], answer: "C",
    solution: String.raw`Using difference of squares,
\[\frac{(x+y-z)(x+y+z)}{(x+z-y)(x+z+y)}
=\boxed{\frac{x+y-z}{x+z-y}},\]
where the original expression is defined.`,
  },
  {
    id: 30010, number: 10, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`The expression \(84k\), for positive integer \(k\), can be divided into three parts which are in the ratio of \(1:\frac13:\frac16\). If each of the parts are integers, then what is the least possible value of the largest part?`,
    choices: ["112", "142", "152", "168", "NOTA"], answer: "D",
    solution: String.raw`Let the parts be \(x,\frac x3,\frac x6\). Since their sum is \(84k\), \(x=56k\). The parts are \(56k,\frac{56k}{3},\frac{28k}{3}\), so the least possible \(k\) is \(3\). The largest part is \(\boxed{168}\).`,
  },
  {
    id: 30011, number: 11, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    question: String.raw`The sum of the real solutions of \(\sqrt{3x+1}+\sqrt{x-4}=5\) is ...`,
    choices: ["45", "40", "35", "5", "NOTA"], answer: "D",
    solution: String.raw`Isolate one radical and square:
\[\sqrt{3x+1}=5-\sqrt{x-4}\quad\Longrightarrow\quad5\sqrt{x-4}=10-x.\]
Squaring again gives \(25(x-4)=(10-x)^2\), or \((x-5)(x-40)=0\). Checking the original equation, \(x=5\) works and \(x=40\) does not. The sum is \(\boxed5\).`,
  },
  {
    id: 30012, number: 12, division: "Theta", topic: "Analytic Geometry", difficulty: 3, methods: [],
    question: String.raw`A circle is graphed on the \(xy\)-plane so that it passes through the points \((0,1)\), \((0,3)\) and \((5,8)\). Find the radius of the circle.`,
    choices: [String.raw`\(\sqrt{37}\)`, "6", String.raw`\(\sqrt{35}\)`, String.raw`\(\sqrt[3]{35}\)`, "NOTA"], answer: "A",
    solution: String.raw`Let the circle be \(x^2+y^2+ax+by+c=0\). Substitution gives \(a=-12\), \(b=-4\), and \(c=3\). Thus
\[(x-6)^2+(y-2)^2=37,\]
so the radius is \(\boxed{\sqrt{37}}\).`,
  },
  {
    id: 30013, number: 13, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`\(f(x)=\frac{x-2}{x+5}\) and \(g(x)=\frac{x+10}{x-8}\). The domain of the function \(y=g(f(x))\) is all real numbers with the exception of which values?`,
    choices: [String.raw`\(5,8\)`, String.raw`\(-5,8\)`, String.raw`\(-5,-6\)`, String.raw`\(-8,-5\)`, "NOTA"], answer: "C",
    solution: String.raw`For \(g(f(x))\) to be defined, \(f\) must be defined, so \(x\ne-5\). Also \(f(x)\ne8\). Solving \(\frac{x-2}{x+5}=8\) gives \(x=-6\). The excluded values are \(\boxed{-5,-6}\).`,
  },
  {
    id: 30014, number: 14, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: [],
    question: String.raw`\(\sqrt{8a}\cdot\sqrt{2a}\), for \(a<0\), is equal to which of the following expressions?`,
    choices: [String.raw`\(-4a\)`, String.raw`\(-4|a|\)`, String.raw`\(4|a|\)`, String.raw`\(4i|a|\)`, "NOTA"], answer: "B",
    solution: String.raw`Since \(a<0\), \(\sqrt{8a}=i\sqrt{8|a|}\) and \(\sqrt{2a}=i\sqrt{2|a|}\). Their product is
\[i^2\sqrt{16a^2}=\boxed{-4|a|}.\]`,
  },
  {
    id: 30015, number: 15, division: "Theta", topic: "Number Theory", difficulty: 2, methods: ["Modular Arithmetic"],
    question: String.raw`Find the remainder when \(3^{21}+4^{22}+5^{23}\) is divided by \(10\).`,
    choices: ["0", "3", "4", "7", "NOTA"], answer: "C",
    solution: String.raw`The units digits of \(3^{21}\), \(4^{22}\), and \(5^{23}\) are \(3\), \(6\), and \(5\), respectively. Their sum ends in \(3+6+5=14\), so the remainder is \(\boxed4\).`,
  },
  {
    id: 30016, number: 16, division: "Theta", topic: "Polynomials", difficulty: 2, methods: [],
    question: String.raw`Two numbers have a sum of \(2\). The two numbers have a product of \(2\). What is the sum of the cubes of the two numbers?`,
    choices: [String.raw`\(-8\)`, String.raw`\(-4\)`, String.raw`\(4i\)`, String.raw`\(8i\)`, "NOTA"], answer: "B",
    solution: String.raw`Let the numbers be \(a\) and \(b\). Since \(a^3+b^3=(a+b)^3-3ab(a+b)\),
\[a^3+b^3=2^3-3(2)(2)=8-12=\boxed{-4}.\]`,
  },
  {
    id: 30017, number: 17, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`The conic with equation \(9x^2-4y^2-18x+16y+29=0\) has foci on points \(P\) and \(Q\). Which could be the coordinates of \(P\)?`,
    choices: [String.raw`\((1,2-\sqrt{13})\)`, String.raw`\((1+\sqrt{13},2)\)`, String.raw`\((1+\sqrt{13},-2)\)`, String.raw`\((-1,2+\sqrt{13})\)`, "NOTA"], answer: "A",
    solution: String.raw`Completing the square gives
\[\frac{(y-2)^2}{9}-\frac{(x-1)^2}{4}=1.\]
The hyperbola has center \((1,2)\), vertical transverse axis, and \(c=\sqrt{13}\). Its foci are \((1,2\pm\sqrt{13})\), so \(\boxed{(1,2-\sqrt{13})}\) could be \(P\).`,
  },
  {
    id: 30018, number: 18, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    question: String.raw`The operation \(@\) is defined by \(x@y=x^2-2xy+y^2\). Find the value of \((2027@2025)\).`,
    choices: ["16", "4", String.raw`\(-8\)`, String.raw`\(-16\)`, "NOTA"], answer: "B",
    solution: String.raw`Since \(x^2-2xy+y^2=(x-y)^2\), \((2027@2025)=(2027-2025)^2=\boxed4\).`,
  },
  {
    id: 30019, number: 19, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Geometric Sequence"],
    question: String.raw`The population of Logville is \(P\) on January 1, 2021. In the following years, on January 1 of each year, the population is measured and the results show an increase of \(25\%\), a decrease of \(25\%\), an increase of \(25\%\), and a decrease of \(25\%\), in that order. Each increase or decrease is from the previous year's population. On January 1, 2025, find the total change in population expressed as a fraction in lowest terms. What is the numerator of that fraction?`,
    choices: ["25", "31", "75", "225", "NOTA"], answer: "B",
    solution: String.raw`The 2025 population is
\[P\left(\frac54\right)\left(\frac34\right)\left(\frac54\right)\left(\frac34\right)=\frac{225}{256}P.\]
The population decreased by \(P-\frac{225}{256}P=\frac{31}{256}P\). Therefore the numerator is \(\boxed{31}\).`,
  },
  {
    id: 30020, number: 20, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant"],
    question: String.raw`\[\begin{vmatrix}1&3&-1\\4&x&y\\1&2&5\end{vmatrix}=15\]
and \(y=x+6\). Find the value of \(x\).`,
    choices: ["11", "9", "5", "2", "NOTA"], answer: "A",
    solution: String.raw`Expanding the determinant gives \((5x+3y-8)-(-x+60+2y)=15\), so \(6x+y=83\). Since \(y=x+6\), \(7x+6=83\), and \(x=\boxed{11}\).`,
  },
  {
    id: 30021, number: 21, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: [],
    question: String.raw`\[\frac{x-1}{6}=\frac{z}{-18}=\frac y3.\]
If \(y=12\), then give the value of \(x+z\).`,
    choices: ["97", "49", String.raw`\(-47\)`, String.raw`\(-72\)`, "NOTA"], answer: "C",
    solution: String.raw`Since \(y=12\), the common ratio is \(\frac y3=4\). Therefore \(x=25\) and \(z=-72\), so \(x+z=\boxed{-47}\).`,
  },
  {
    id: 30022, number: 22, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    question: String.raw`For \(f(2x-5)=x^2-2x-3\), which is NOT an integral factor of the value of \(f(2025)\)?`,
    choices: ["2032", "1012", "936", "8", "NOTA"], answer: "C",
    solution: String.raw`Set \(2x-5=2025\), giving \(x=1015\). Then
\[f(2025)=(1015-3)(1015+1)=(1012)(1016).\]
\(2032=2(1016)\), \(1012\), and \(8\) are factors. But \(936\) is divisible by \(3\), while neither \(1012\) nor \(1016\) is. Therefore \(\boxed{936}\) is not a factor.`,
  },
  {
    id: 30023, number: 23, division: "Theta", topic: "Complex Numbers", difficulty: 1, methods: [],
    question: String.raw`Consider the following numbers:
\[\text{I. }\pi\qquad \text{II. }8-\sqrt{-8}\qquad \text{III. }\frac3{\sqrt{16}}\qquad \text{IV. }5+\sqrt3.\]
Which of the following above is/are complex numbers?`,
    choices: ["I, II only", "I only", "III, IV only", "I, III only", "NOTA"], answer: "E",
    solution: String.raw`Every real number is also a complex number with imaginary part \(0\). Thus I, III, and IV are complex numbers, and II is a nonreal complex number. All four are complex, but that combination is not listed. Therefore the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30024, number: 24, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    question: String.raw`The integer value of \(202!\) is evenly divisible by \(6^n\). What is the greatest possible integer value of \(n\)?`,
    choices: ["99", "98", "97", "96", "NOTA"], answer: "B",
    solution: String.raw`The exponent of \(3\) in \(202!\) is
\[\left\lfloor\frac{202}{3}\right\rfloor+\left\lfloor\frac{202}{9}\right\rfloor+\left\lfloor\frac{202}{27}\right\rfloor+\left\lfloor\frac{202}{81}\right\rfloor=67+22+7+2=98.\]
There are more than \(98\) factors of \(2\), so the exponent of \(6=2\cdot3\) is limited by the factors of \(3\). Hence \(n=\boxed{98}\).`,
  },
  {
    id: 30025, number: 25, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: [],
    question: String.raw`Give the sum of the integral values of \(x\) for which
\[\left(x^2-2x-4\right)^{x^2-6x+9}=1.\]`,
    choices: ["4", "3", "2", "1", "NOTA"], answer: "C",
    solution: String.raw`The exponent is \((x-3)^2\), so \(x=3\) gives \((-1)^0=1\). The base cannot be \(1\) for an integral \(x\). For base \(-1\),
\[x^2-2x-4=-1\quad\Longrightarrow\quad(x-3)(x+1)=0.\]
This gives \(x=3\) again and \(x=-1\); at \(x=-1\), the exponent is \(16\), which is even. The distinct integral solutions are \(-1\) and \(3\), whose sum is \(\boxed2\).`,
  },
  {
    id: 30026, number: 26, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    question: String.raw`Give the greatest value of \(x\) for which \(4-|x-5|=-1\).`,
    choices: ["10", "8", "2", "0", "NOTA"], answer: "A",
    solution: String.raw`The equation is equivalent to \(|x-5|=5\), so \(x=0\) or \(x=10\). The greatest value is \(\boxed{10}\).`,
  },
  {
    id: 30027, number: 27, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    question: String.raw`Which of the following equations has a graph that intersects \(y=|x-3|\) at an infinite number of points?
\[\begin{aligned}\text{I. }&y=|x|-3\\\text{II. }&y=|3-x|\\\text{III. }&y=|x-6|+3\\\text{IV. }&y=3-x\\\text{V. }&y=-|3-x|\end{aligned}\]`,
    choices: ["I, II, III, IV, V", "I, II, III, IV only", "II, IV, V only", "I, II, IV, V only", "NOTA"], answer: "B",
    solution: String.raw`The graph \(y=|x-3|\) equals \(x-3\) for \(x\ge3\) and \(3-x\) for \(x\le3\). I agrees for \(x\ge3\); II is the same graph; III agrees for \(x\ge6\); and IV agrees for \(x\le3\). V meets it only at \((3,0)\). Thus the answer is \(\boxed{\text{I, II, III, IV only}}\).`,
  },
  {
    id: 30028, number: 28, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`For complex numbers \(x\) and \(y\), \(x\ne y\), \(x^2=19x+y\) and \(y^2=x+19y\). Find the value of \(\sqrt{x^2+y^2+1}\).`,
    choices: ["16", "17", "18", "19", "NOTA"], answer: "D",
    solution: String.raw`Subtracting gives \((x-y)(x+y)=18(x-y)\). Since \(x\ne y\), \(x+y=18\). Adding the original equations gives \(x^2+y^2=20(x+y)=360\). Therefore \(\sqrt{x^2+y^2+1}=\sqrt{361}=\boxed{19}\).`,
  },
  {
    id: 30029, number: 29, division: "Theta", topic: "Systems of Equations", difficulty: 3, methods: [],
    question: String.raw`Each balloon/pattern represents a positive integral value. Each pattern is distinct in value. For example, a striped balloon pattern is not equal in value to a dotted pattern. Which could be the value of the last row above?`,
    choices: ["85", "110", "190", "250", "NOTA"], answer: "C",
    solution: String.raw`The first row gives the checker balloons value \(100\) each. The second gives the gray balloons value \(20\) each. The third gives the striped balloons value \(30\) each. If \(d\) is the dotted-balloon value, the last row equals \(20+2d+30=50+2d\).

Choice A makes \(d\) nonintegral, B makes \(d=30\) equal to the striped value, and D makes \(d=100\) equal to the checker value. Choice C makes \(d=70\), a distinct positive integer. Thus \(\boxed{190}\) could be the last row's value.`,
    illustration: { src: "/questions/theta-29-balloons.svg", alt: "Four equations using checker, gray, striped, and dotted balloons.", width: 600, height: 350 },
  },
  {
    id: 30030, number: 30, division: "Theta", topic: "Function Analysis", difficulty: 1, methods: [],
    question: String.raw`The graph of \(y=\frac{2x^2-4x}{x^2+2x-8}\) has vertical asymptote with equation \(x=P\) and horizontal asymptote with equation \(y=Q\). Give the value of \(P+Q\).`,
    choices: [String.raw`\(-2\)`, "2", "4", "6", "NOTA"], answer: "A",
    solution: String.raw`Factoring gives
\[y=\frac{2x(x-2)}{(x-2)(x+4)}.\]
Thus \(x=2\) is a hole and \(x=-4\) is the vertical asymptote, so \(P=-4\). The horizontal asymptote is \(y=2\), so \(Q=2\). Therefore \(P+Q=\boxed{-2}\).`,
  },
  {
    id: 30031, number: 31, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: [],
    question: String.raw`Evaluate \((2^{3^2})(-2^{-2})\).`,
    choices: ["−512", "−128", "−64", "128", "NOTA"], answer: "B",
    solution: String.raw`\[(2^{3^2})(-2^{-2})=2^9\left(-\frac1{2^2}\right)=-2^7=\boxed{-128}.\]`,
  },
  {
    id: 30032, number: 32, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    question: String.raw`Given that \(f(x)=x^3-5x^2+1\) and \(g(x)=2x+5\), determine \(f(g(f(1)))\).`,
    choices: ["−71", "−5", "−3", "−1", "NOTA"], answer: "B",
    solution: String.raw`Work from the inside out: \(f(1)=-3\), \(g(-3)=-1\), and \(f(-1)=-5\). Therefore the answer is \(\boxed{-5}\).`,
  },
  {
    id: 30033, number: 33, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: ["Discriminant Test"],
    question: String.raw`For how many values of \(a\) does \(f(x)=ax^2-5x+6\) have one and only one real root?`,
    choices: ["0", "1", "2", "Infinitely many", "NOTA"], answer: "C",
    solution: String.raw`For a quadratic, \(25-24a=0\), so \(a=\frac{25}{24}\). Also, when \(a=0\), the function is linear and has exactly one real root. Therefore there are \(\boxed2\) values.`,
  },
  {
    id: 30034, number: 34, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`The following table represents select values of an odd function \(f(x)\).
\[\begin{array}{c|ccccc}x&-7&-2&4&a&7\\\hline f(x)&b&7&5&-7&4\end{array}\]
Determine the following: \(af(a)f(b)\).`,
    choices: ["−56", "35", "56", "70", "NOTA"], answer: "D",
    solution: String.raw`Since \(f\) is odd, \(a=2\), \(b=-4\), and \(f(b)=-5\). Thus \(af(a)f(b)=(2)(-7)(-5)=\boxed{70}\).`,
  },
  {
    id: 30035, number: 35, division: "Theta", topic: "Binomial Expansion", difficulty: 2, methods: ["Binomial Theorem"],
    question: String.raw`Given that \(f(x)=(2x^3-3)^5\), determine the coefficient of the \(12^{\text{th}}\) degree term if \(f(x)\) is fully expanded.`,
    choices: ["−240", "−120", "32", "720", "NOTA"], answer: "A",
    solution: String.raw`The \(12^{\text{th}}\)-degree term occurs when \(2x^3\) is raised to the fourth power:
\[5(2x^3)^4(-3)=-240x^{12}.\]
The coefficient is \(\boxed{-240}\).`,
  },
  {
    id: 30036, number: 36, division: "Theta", topic: "Complex Numbers", difficulty: 3, methods: [],
    question: String.raw`Given that \((1-i)^3+(1-i)^5+(1-i)^7=a+bi\), determine the product of \(a\) and \(b\).`,
    choices: ["−12", "4", "20", "84", "NOTA"], answer: "C",
    solution: String.raw`Since \((1-i)^2=-2i\), factoring \(1-i\) gives \(2+10i\). Thus \(a=2\), \(b=10\), and \(ab=\boxed{20}\).`,
  },
  {
    id: 30037, number: 37, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Rational Root Theorem", "Vieta's Formulas"],
    question: String.raw`Determine the sum of the non-real roots of \(f(x)=x^7+3x^6+2x^5+5x^3+11x^2+8x+2\).`,
    choices: ["1", "2", "4", "6", "NOTA"], answer: "B",
    solution: String.raw`Repeated division by \(x+1\) gives \(f(x)=(x+1)^5(x^2-2x+2)\). The non-real roots are \(1+i\) and \(1-i\), whose sum is \(\boxed2\).`,
  },
  {
    id: 30038, number: 38, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: ["Discriminant Test"],
    question: String.raw`Which of the following values of \(a\) guarantee that the following parabolic system has only one solution:
\[y=ax^2-2x-5\]
\[y=2x^2+6x+5+\sqrt5\]`,
    choices: [String.raw`\(\frac25\)`, String.raw`\(\frac{30+16\sqrt5}{95}\)`, String.raw`\(\frac{30+8\sqrt5}{95}\)`, String.raw`\(\frac{350+16\sqrt5}{95}\)`, "NOTA"], answer: "B",
    solution: String.raw`Setting the curves equal gives \((a-2)x^2-8x-10-\sqrt5=0\). Setting its discriminant equal to zero and rationalizing gives \(a=\boxed{\frac{30+16\sqrt5}{95}}\).`,
  },
  {
    id: 30039, number: 39, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`Evaluate \(\left(\frac{7!!}{90}\right)^{-1}\).`,
    choices: [String.raw`\(\frac67\)`, String.raw`\(\frac{67}{6}\)`, "67", String.raw`\(6^{-7}\)`, "NOTA"], answer: "A",
    solution: String.raw`The double factorial is \(7!!=105\). Therefore
\[\left(\frac{7!!}{90}\right)^{-1}=\left(\frac{105}{90}\right)^{-1}=\boxed{\frac67}.\]`,
  },
  {
    id: 30040, number: 40, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`Given a parabola in the form \(f(x)=ax^2+bx+c\) that passes through the points \((1,2)\), \((3,4)\), and \((5,3)\), determine the product of \(a\), \(b\), and \(c\).`,
    choices: [String.raw`\(-\frac{15}{128}\)`, String.raw`\(\frac{15}{64}\)`, String.raw`\(\frac{15}{16}\)`, String.raw`\(\frac{16}{15}\)`, "NOTA"], answer: "E",
    solution: String.raw`Substitution gives \(a=-\frac38\), \(b=\frac52\), and \(c=-\frac18\). Hence \(abc=\frac{15}{128}\), which is not listed. Therefore the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30041, number: 41, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    question: String.raw`Choose the answer that correctly simplifies the expression
\[\frac{\log_7(5^9)\cdot\log_5(3^8)\cdot\log_3(2^6)}{\log_7(3^4)\cdot\log_3(5^3)\cdot\log_5(2^2)}.\]`,
    choices: ["9", "18", String.raw`\(\log_7(5^9\cdot3^8\cdot2^6)\)`, String.raw`\(5^6\cdot3^4\cdot2^4\)`, "NOTA"], answer: "B",
    solution: String.raw`Using exponent properties gives \(\frac{9\cdot8\cdot6}{4\cdot3\cdot2}=18\). By change of base, the remaining logarithmic factors cancel, leaving \(\boxed{18}\).`,
  },
  {
    id: 30042, number: 42, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Vieta's Formulas"],
    question: String.raw`Given a polynomial \(p(x)\) with roots \(x=1\), \(x=2-i\), and \(x=\pm\sqrt2\), determine the value of the constant term if the polynomial is written in standard form: \(p(x)=x^5+bx^4+cx^3+dx^2+ex+f\) where \(b,c,d,e,\) and \(f\) are integers.`,
    choices: ["−4", "−5", "5", "10", "NOTA"], answer: "D",
    solution: String.raw`Since the coefficients are integers, \(2+i\) is also a root. The product is \(1(2-i)(2+i)(\sqrt2)(-\sqrt2)=-10\). Since the product is \(-f\), \(f=\boxed{10}\).`,
  },
  {
    id: 30043, number: 43, division: "Theta", topic: "Matrices", difficulty: 4, methods: ["Matrix Multiplication", "Determinant", "Vieta's Formulas"],
    question: String.raw`Given that matrix \(A=\begin{pmatrix}x&3\\5&-1\end{pmatrix}\) and matrix \(B=\begin{pmatrix}1&-5\\x^2&2x\end{pmatrix}\), the product \(A\cdot B\) results in an invertible matrix with a determinant equal to \(-42x^2\). Determine the product of all values of \(x\) that satisfies these conditions.`,
    choices: ["−7", "−1", "0", "6", "NOTA"], answer: "D",
    solution: String.raw`Computing the determinant and setting it equal to \(-42x^2\) gives \(-5x(x^2+7x+6)=0\). Exclude \(x=0\), which makes the matrix noninvertible. By Vieta's formulas, the product of the remaining roots is \(\boxed6\).`,
  },
  {
    id: 30044, number: 44, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["Modular Arithmetic"],
    question: String.raw`Find the value of \(|7-i^{6767}|\).`,
    choices: ["6", String.raw`\(4\sqrt3\)`, String.raw`\(5\sqrt2\)`, "8", "NOTA"], answer: "C",
    solution: String.raw`Since \(6767\equiv3\pmod4\), \(i^{6767}=-i\). Thus \(|7+i|=\sqrt{50}=\boxed{5\sqrt2}\).`,
  },
  {
    id: 30045, number: 45, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Logarithms"],
    question: String.raw`Which of the following is the minimum possible value for \(x\) given the expression \(\ln(\ln(\ln(\ln x)))\).`,
    choices: ["0", "1", String.raw`\(e\)`, String.raw`\(e^e\)`, "NOTA"], answer: "E",
    solution: String.raw`The domain is \(x>e^e\). Since \(e^e\) is not included, there is no minimum possible value. Therefore the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30046, number: 46, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    question: String.raw`Determine the only real root for \(f(x)=x^9-8\).`,
    choices: [String.raw`\(2^{1/9}\)`, String.raw`\(2^{1/3}\)`, String.raw`\(2^{1/2}\)`, "2", "NOTA"], answer: "B",
    solution: String.raw`Factoring gives \(x^9-8=(x^3-2)(x^6+2x^3+4)\). The latter factor has no real zeros, so the only real root is \(\boxed{2^{1/3}}\).`,
  },
  {
    id: 30047, number: 47, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    question: String.raw`Given \(f(x)=\frac{x}{x^2-1}\), \(g(x)=\frac{x+1}{x-3}\), and \(h(x)=\sqrt{x-1}\), for which of the following integers is \(f(g(h(x)))\) undefined?
\[\text{I. }1\qquad\text{II. }2\qquad\text{III. }3\qquad\text{IV. }10\]`,
    choices: ["I, II, and III only", "II and III only", "II and IV only", "I, II, III, and IV", "NOTA"], answer: "C",
    solution: String.raw`Testing each value, \(x=1\) and \(x=3\) produce defined outputs. For \(x=2\), \(g(h(2))=-1\), where \(f\) is undefined. For \(x=10\), \(h(10)=3\), where \(g\) is undefined. Thus the answer is \(\boxed{\text{II and IV only}}\).`,
  },
  {
    id: 30048, number: 48, division: "Theta", topic: "Systems of Equations", difficulty: 3, methods: ["Determinant"],
    question: String.raw`Given the system:
\[x+2y-z=3\]
\[2x-y+3z=1\]
\[ax+y+z=5\]
For what value of \(a\) does this system have no unique solution?`,
    choices: ["−3", "−1", "0", "2", "NOTA"], answer: "D",
    solution: String.raw`The system has no unique solution when
\[\begin{vmatrix}1&2&-1\\2&-1&3\\a&1&1\end{vmatrix}=5a-10=0.\]
Thus \(a=\boxed2\).`,
  },
  {
    id: 30049, number: 49, division: "Theta", topic: "Simplification", difficulty: 4, methods: ["Binomial Theorem"],
    question: String.raw`Which of the following correctly simplifies the expression
\[\frac{x^5-5x^4+10x^3-10x^2+5x-1}{x^7+3x^6+x^5-5x^4-5x^3+x^2+3x+1}\]
where defined, given the fact that the expression is undefined at \(x=1\).`,
    choices: [String.raw`\(\frac1{(x+1)^2}\)`, String.raw`\(\frac{(x-1)^3}{(x+1)^3}\)`, String.raw`\(\frac{(x-1)^3}{(x+1)^5}\)`, String.raw`\(\frac{(x-1)^5}{(x+1)^5}\)`, "NOTA"], answer: "C",
    solution: String.raw`The numerator is \((x-1)^5\), while the denominator factors as \((x-1)^2(x+1)^5\). Therefore the expression simplifies to \(\boxed{\frac{(x-1)^3}{(x+1)^5}}\).`,
  },
  {
    id: 30050, number: 50, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    question: String.raw`Which of the following correctly writes \(0.00\overline{76}\) as a fraction?`,
    choices: [String.raw`\(\frac{19}{2475}\)`, String.raw`\(\frac{19}{2250}\)`, String.raw`\(\frac{38}{4995}\)`, String.raw`\(\frac{76}{9999}\)`, "NOTA"], answer: "A",
    solution: String.raw`Since \(0.\overline{76}=\frac{76}{99}\),
\[0.00\overline{76}=\frac{76}{99}\cdot\frac1{100}=\frac{76}{9900}=\boxed{\frac{19}{2475}}.\]`,
  },
  {
    id: 30051, number: 51, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`The population of Boringville can be represented by \(450p\) people where \(p\) represents some positive integer. Let \(A\) represent the number of people in Boringville that are under the age of 18, let \(B\) represent the number of people who are between 18 and 35, let \(C\) represent the number of people between 36 and 50, \(D\) represent the number of people between 51 and 65, \(E\) represent the number of people over 65. Given that the ratio of \(A:B:C\) is \(1:3:7\) and the ratio of \(C:D:E\) is \(2:5:6\), what is the minimum possible value for \(p\) that guarantees an integer number of people in each category, \(A,B,C,D,\) and \(E\)?`,
    choices: ["1", "11", "23", "99", "NOTA"], answer: "B",
    solution: String.raw`Combining the ratios gives \(A:B:C:D:E=2:6:14:35:42\), totaling \(99\) parts. Thus \(99x=450p\). Since \(\gcd(450,99)=9\), the least possible \(p\) is \(\boxed{11}\).`,
  },
  {
    id: 30052, number: 52, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: [],
    question: String.raw`Determine the value of \(y\) given that
\[\frac1{x-y}+\frac1{x+y}=\frac13\qquad\text{and}\qquad\frac1x=x-\frac{y^2}{x}.\]`,
    choices: ["0", String.raw`\(\frac16\)`, String.raw`\(\frac{\sqrt{35}}6\)`, "6", "NOTA"], answer: "E",
    solution: String.raw`The second equation gives \(1=x^2-y^2\). The first then gives \(2x=\frac13\), so \(x=\frac16\). Hence \(y^2=-\frac{35}{36}\), which has no real solution. The answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30053, number: 53, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`Determine the slope of the line that passes through the focus of the parabola \(y^2+2y-x=1\) and the origin.`,
    choices: [String.raw`\(-\frac74\)`, String.raw`\(\frac12\)`, String.raw`\(\frac47\)`, String.raw`\(\frac23\)`, "NOTA"], answer: "C",
    solution: String.raw`Completing the square gives \((y+1)^2=x+2\). Since \(4p=1\), the focus is \(\left(-\frac74,-1\right)\). The slope from the origin is \(\frac{-1}{-7/4}=\boxed{\frac47}\).`,
  },
  {
    id: 30054, number: 54, division: "Theta", topic: "Conic Sections", difficulty: 5, methods: [],
    question: String.raw`How many of the following conics are degenerate?
\[x^2+4xy+4y^2-2x+4y=-1.\]
\[9x^2+16y^2-54x+64y+145=0.\]
\[x^2-y^2-4x-6y+13=0.\]`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`The first is a rotated, nondegenerate parabola. Completing the square in the second gives
\[9(x-3)^2+16(y+2)^2=0,\]
a single point, so it is degenerate. The third becomes \((x-2)^2-(y+3)^2=-18\), a nondegenerate hyperbola. Exactly \(\boxed1\) conic is degenerate.`,
  },
  {
    id: 30055, number: 55, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    question: String.raw`How many integer solutions are there to the inequality \(2|3x-1|-|2-x|<5\)?`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "C",
    solution: String.raw`The critical values are \(x=\frac13\) and \(x=2\). Checking the resulting intervals shows that the only integer solutions are \(x=0\) and \(x=1\). Therefore there are \(\boxed2\) integer solutions.`,
  },
  {
    id: 30056, number: 56, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: [],
    question: String.raw`Given that \(f(x)=\frac1{x-2}+\frac2{x+1}-\frac3{x^2-x-2}\), how many vertical asymptotes does \(f(x)\) have?`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`Combining the terms gives
\[f(x)=\frac{3(x-2)}{(x+1)(x-2)}=\frac3{x+1},\]
with a hole at \(x=2\). The only vertical asymptote is \(x=-1\), so the answer is \(\boxed1\).`,
  },
  {
    id: 30057, number: 57, division: "Theta", topic: "Systems of Equations", difficulty: 5, methods: ["Substitution"],
    question: String.raw`Given that \(xy=6\) and \(x^3y+xy^3-2x^2y^2-2x-2y=16\), which of the following is a possible value of \(x^2+y^2\)?`,
    choices: [String.raw`\(\frac{148}{9}\)`, String.raw`\(\frac{202}{9}\)`, String.raw`\(\frac{68}{3}\)`, String.raw`\(\frac{74}{3}\)`, "NOTA"], answer: "A",
    solution: String.raw`Using \(xy=6\), the equation reduces to \(3(x+y)^2-(x+y)-80=0\). Thus \(x+y=\frac{16}{3}\) or \(5\). The first value gives
\[x^2+y^2=(x+y)^2-2xy=\frac{256}{9}-12=\boxed{\frac{148}{9}},\]
which appears among the choices.`,
  },
  {
    id: 30058, number: 58, division: "Theta", topic: "Polynomial Equations", difficulty: 4, methods: ["Substitution", "Vieta's Formulas"],
    question: String.raw`Find the sum of all solutions to the equation \(2^{4x}+70(2^{2x})+64=15(2^{3x})+120(2^x)\).`,
    choices: ["5", "6", "7", "15", "NOTA"], answer: "B",
    solution: String.raw`Let \(u=2^x\). The equation becomes
\[u^4-15u^3+70u^2-120u+64=0.\]
If its positive roots are \(u_1,\ldots,u_4\), the sum of the corresponding \(x\)-values is
\[\log_2(u_1u_2u_3u_4)=\log_2(64)=\boxed6\]
by Vieta's formulas.`,
  },
  {
    id: 30059, number: 59, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    question: String.raw`\[\frac{10\%}{5\%}=\_\_\_\]`,
    choices: ["0.5", "2%", "20%", "200%", "NOTA"], answer: "D",
    solution: String.raw`\[\frac{10\%}{5\%}=\frac{1/10}{1/20}=2=\boxed{200\%}.\]`,
  },
  {
    id: 30060, number: 60, division: "Theta", topic: "Number Theory", difficulty: 1, methods: [],
    question: String.raw`How many of these four sets below are CLOSED under the given operation?
\[\begin{array}{ll}
\{\text{Odd Integers}\}\text{ Addition} & \{\text{Integers}\}\text{ Multiplication}\\
\{\text{Rational Numbers}\}\text{ Division} & \{\text{Natural Numbers}\}\text{ Subtraction}
\end{array}\]`,
    choices: ["1", "2", "3", "4", "NOTA"], answer: "A",
    solution: String.raw`Odd plus odd is even, so the odd integers are not closed under addition. Division by \(0\), which is rational, is undefined, so the rational numbers are not closed under division. Since \(3-8=-5\), the natural numbers are not closed under subtraction. However, the product of two integers is always an integer. Therefore, \(\boxed1\) set is closed.`,
  },
  {
    id: 30061, number: 61, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Rational Root Theorem"],
    question: String.raw`Find the number of rational zeros of \(P(x)=x^3+2x^2-4x+5\).`,
    choices: ["1", "2", "3", "4", "NOTA"], answer: "E",
    solution: String.raw`By the Rational Zero's Theorem, the potential rational zeros are \(\{\pm1,\pm5\}\). Testing them gives
\[P(-1)=10,\quad P(1)=4,\quad P(-5)=-50,\quad P(5)=160.\]
Therefore, \(P(x)\) has no rational zeros, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30062, number: 62, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: [],
    question: String.raw`Write the equation of a line in standard form passing through the point \((3,-5)\) and perpendicular to the line \(y=\frac34x+2\).`,
    choices: [String.raw`\(3x-4y=29\)`, String.raw`\(3x+4y=-11\)`, String.raw`\(4x+3y=-3\)`, String.raw`\(4x-3y=27\)`, "NOTA"], answer: "C",
    solution: String.raw`A perpendicular line has slope \(-\frac43\). Using point-slope form,
\[y+5=-\frac43(x-3).\]
Multiplying by \(3\) and rearranging gives \(\boxed{4x+3y=-3}\).`,
  },
  {
    id: 30063, number: 63, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    question: String.raw`Given \(f(x)=3x+7\) and \(g(x)=x^2+2x-1\), then \(g(g(g(f(-2))))=?\)`,
    choices: ["-7", "2", "7", "62", "NOTA"], answer: "D",
    solution: String.raw`Working from the inside out,
\[f(-2)=1,\quad g(1)=2,\quad g(2)=7,\quad g(7)=62.\]
Thus the value is \(\boxed{62}\).`,
  },
  {
    id: 30064, number: 64, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    question: String.raw`Given \(x-2y+3z=3\), \(2x+y+5z=8\), and \(3x-y-3z=-22\), solve for \((x,y,z)\). What is \(x+y+z\)?`,
    choices: ["-4", "0", "1", "3", "NOTA"], answer: "B",
    solution: String.raw`Eliminating \(y\) gives
\[5x+2z=-14,\qquad 5x+13z=19.\]
Subtracting yields \(11z=33\), so \(z=3\). Then \(x=-4\), and substitution gives \(y=1\). Therefore,
\[x+y+z=-4+1+3=\boxed0.\]`,
  },
  {
    id: 30065, number: 65, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    question: String.raw`When the following system is graphed, there are no solutions in which quadrant(s)?
\[2x+y\le4\]
\[x-2y\le-2\]`,
    choices: ["I, II", "II", "II, III", "IV", "NOTA"], answer: "D",
    solution: String.raw`The inequalities are \(y\le4-2x\) and \(y\ge\frac{x+2}{2}\). Their overlap lies above the increasing line and below the decreasing line. In quadrant IV, \(x>0\) and \(y<0\), but \(y\ge\frac{x+2}{2}>0\), which is impossible. The answer is \(\boxed{\text{IV}}\).`,
  },
  {
    id: 30066, number: 66, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    question: String.raw`For the function \(y=2x^2-8x+3\), determine the equation of the axis of symmetry \((x=a)\) and the minimum value \((y=b)\). What is \(a+b\)?`,
    choices: ["-3", "1", "2", "5", "NOTA"], answer: "A",
    solution: String.raw`Completing the square gives
\[y=2(x-2)^2-5.\]
Thus \(a=2\) and \(b=-5\), so \(a+b=\boxed{-3}\).`,
  },
  {
    id: 30067, number: 67, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: ["Discriminant Test"],
    question: String.raw`What are the \(x\)-coordinates of the \(x\)-intercepts of \(f(x)=x^2-3x+15\)?`,
    choices: ["3, 5", "-3, 5", "3, -5", "-3, -5", "NOTA"], answer: "E",
    solution: String.raw`The discriminant is
\[b^2-4ac=(-3)^2-4(1)(15)=-51<0.\]
There are no real roots and therefore no \(x\)-intercepts. The answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30068, number: 68, division: "Theta", topic: "Complex Numbers", difficulty: 1, methods: [],
    question: String.raw`In what quadrant does the point \(-3+5i\) lie on the argand plane (the complex number plane)?`,
    choices: ["I", "II", "III", "IV", "NOTA"], answer: "B",
    solution: String.raw`The real part is negative and the imaginary part is positive, corresponding to the point \((-3,5)\). It lies in \(\boxed{\text{Quadrant II}}\).`,
  },
  {
    id: 30069, number: 69, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    question: String.raw`Find the quadratic function \(f(x)=ax^2+bx+c\) that passes through the points \((-2,9)\), \((1,-6)\), \((3,4)\). What is the sum \(a+b+c\)?`,
    choices: ["-12", "-9", "-6", "0", "NOTA"], answer: "C",
    solution: String.raw`Substitution of the three points gives
\[4a-2b+c=9,\qquad a+b+c=-6,\qquad 9a+3b+c=4.\]
Elimination yields \(a=2\), \(b=-3\), and \(c=-5\). Hence \(a+b+c=\boxed{-6}\).`,
  },
  {
    id: 30070, number: 70, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`How many pounds of salt must be added to 80 pounds of a \(5\%\) salt solution to make a \(24\%\) salt solution?`,
    choices: ["5 lbs.", "15 lbs.", "20 lbs.", "30 lbs.", "NOTA"], answer: "C",
    solution: String.raw`The original solution contains \(0.05(80)=4\) pounds of salt. If \(x\) pounds of pure salt are added, then
\[4+x=0.24(80+x).\]
Thus \(4+x=19.2+0.24x\), so \(0.76x=15.2\) and \(x=\boxed{20}\) pounds.`,
  },
  {
    id: 30071, number: 71, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`When simplifying the expression
\[\frac{(6x^{2/7}y^{-4}z^0)^3}{9x^2y^5z^{-8}},\]
the final result is of the form \(Kx^ay^bz^c\) where \(K,a,b,\) and \(c\) are some rational numbers. What is \(a+b+c\)?`,
    choices: [String.raw`\(-\frac{71}{7}\)`, String.raw`\(-\frac{92}{7}\)`, String.raw`\(-\frac{99}{7}\)`, String.raw`\(-\frac{101}{7}\)`, "NOTA"], answer: "A",
    solution: String.raw`The expression simplifies to
\[24x^{6/7-2}y^{-12-5}z^{0-(-8)}=24x^{-8/7}y^{-17}z^8.\]
Therefore,
\[a+b+c=-\frac87-17+8=\boxed{-\frac{71}{7}}.\]`,
  },
  {
    id: 30072, number: 72, division: "Theta", topic: "Logs and Exponents", difficulty: 5, methods: ["Logarithms"],
    question: String.raw`Which of the following expressions is equal to \(\log_2x\), if \(x>0\) satisfies the following equation?
\[\frac{\log_2(\sqrt{x})+\log_{\sqrt2}(x)}{\sqrt{\log_2(x)}}
=
\frac{\log_4(\sqrt[4]{x})+\log_{\sqrt[4]{4}}(x)}{\sqrt[4]{\log_4(x)}}\]`,
    choices: [String.raw`\(8\left(\frac5{17}\right)^4\)`, String.raw`\(2\left(\frac{17}{5}\right)^4\)`, String.raw`\(8\left(\frac{17}{5}\right)^4\)`, String.raw`\(8\left(\frac{10}{17}\right)^4\)`, "NOTA"], answer: "D",
    solution: String.raw`By logarithm properties, the equation becomes
\[\frac52(\log_2x)^{1/2}=\frac{17}{4}(\log_4x)^{3/4}.\]
Since \(\log_4x=\frac12\log_2x\), rearranging gives
\[(\log_2x)^{1/4}=\frac{10}{17}\sqrt[4]{8}.\]
Raising both sides to the fourth power yields
\[\log_2x=\boxed{8\left(\frac{10}{17}\right)^4}.\]`,
  },
  {
    id: 30073, number: 73, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: ["Logarithms"],
    question: String.raw`Given \(x=\log_2(\log_3(\log_4 64))\), then \(x=?\)`,
    choices: ["1", "2", "3", "4", "NOTA"], answer: "E",
    solution: String.raw`\[\log_4 64=3,\qquad \log_3 3=1,\qquad \log_2 1=0.\]
Thus \(x=0\), so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30074, number: 74, division: "Theta", topic: "Probability", difficulty: 4, methods: [],
    question: String.raw`A real number \(x\) is randomly chosen from the interval \((0,10)\). What is the probability that
\[(x^2-5x+6)(x^2-9x+18)(x^2-9x+14)(x^2-7x+12)\]
is positive?`,
    choices: [String.raw`\(\frac12\)`, String.raw`\(\frac35\)`, String.raw`\(\frac7{10}\)`, String.raw`\(\frac45\)`, "NOTA"], answer: "D",
    solution: String.raw`Factoring gives
\[(x-2)^2(x-3)^3(x-4)(x-6)(x-7).\]
The expression is positive on \((0,3)\cup(4,6)\cup(7,10)\), whose total length is \(3+2+3=8\). Therefore, the probability is \(\frac8{10}=\boxed{\frac45}\).`,
  },
  {
    id: 30075, number: 75, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    question: String.raw`Factor: \((3x-4)^2-(2x+5)^2\). Which of the following is one of the factors?`,
    choices: [String.raw`\(x-1\)`, String.raw`\(x-9\)`, String.raw`\(5x-1\)`, String.raw`\(5x-9\)`, "NOTA"], answer: "B",
    solution: String.raw`Using the difference of squares,
\[(3x-4)^2-(2x+5)^2=[(3x-4)+(2x+5)][(3x-4)-(2x+5)]
=(5x+1)(x-9).\]
Thus one factor is \(\boxed{x-9}\).`,
  },
  {
    id: 30076, number: 76, division: "Theta", topic: "Function Analysis", difficulty: 1, methods: [],
    question: String.raw`What is(are) the equation(s) of the horizontal asymptote(s) for the following rational function?
\[f(x)=\frac{6x^2-3x+2}{4x^2-9}\]`,
    choices: [String.raw`\(y=\pm\frac32\)`, String.raw`\(x=\pm\frac32\)`, String.raw`\(y=\frac32\)`, String.raw`\(x=\frac32\)`, "NOTA"], answer: "C",
    solution: String.raw`When the numerator and denominator have equal degree, the horizontal asymptote is the ratio of their leading coefficients. Thus
\[y=\frac64=\boxed{\frac32}.\]`,
  },
  {
    id: 30077, number: 77, division: "Theta", topic: "Polynomials", difficulty: 2, methods: [],
    question: String.raw`When multiplied, what is the coefficient of the \(x^3\) term for \((x^2-x+2)(x^3+3x^2-5x+4)\)?`,
    choices: ["-6", "-1", "-8", "-3", "NOTA"], answer: "A",
    solution: String.raw`The terms contributing to \(x^3\) are
\[(x^2)(-5x)+(-x)(3x^2)+2(x^3)=(-5-3+2)x^3=-6x^3.\]
The coefficient is \(\boxed{-6}\).`,
  },
  {
    id: 30078, number: 78, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    question: String.raw`Factor by completing the square: \(x^4+2x^2+9\). Which of the following is one of the factors?`,
    choices: [String.raw`\(x^2+3\)`, String.raw`\(x^2+x+3\)`, String.raw`\(x^2-x+3\)`, String.raw`\(x^2-2x+3\)`, "NOTA"], answer: "D",
    solution: String.raw`\[
x^4+2x^2+9=(x^2+3)^2-(2x)^2
=(x^2+2x+3)(x^2-2x+3).
\]
Therefore, one factor is \(\boxed{x^2-2x+3}\).`,
  },
  {
    id: 30079, number: 79, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`What is the least common multiple, plus the greatest common factor of 126 and 140?`,
    choices: ["14", "648", "1274", "1310", "NOTA"], answer: "C",
    solution: String.raw`The prime factorizations are \(126=2\cdot3^2\cdot7\) and \(140=2^2\cdot5\cdot7\). Therefore,
\[\operatorname{lcm}(126,140)=1260,\qquad \gcd(126,140)=14.\]
Their sum is \(\boxed{1274}\).`,
  },
  {
    id: 30080, number: 80, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Remainder Theorem"],
    question: String.raw`What is the remainder when \(x^4+7x^3+5x^2-8x-14\) is divided by \(x+6\)?`,
    choices: ["-6", "-2", "4", "6", "NOTA"], answer: "B",
    solution: String.raw`By the Remainder Theorem, the remainder is
\[P(-6)=(-6)^4+7(-6)^3+5(-6)^2-8(-6)-14=\boxed{-2}.\]`,
  },
  {
    id: 30081, number: 81, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: ["Substitution"],
    question: String.raw`Given \(3x^2-5y^2=22\) and \(3x^2-y^2-6x=8\), solve the system for all real ordered pairs \((x,y)\) that satisfy the system. What is the sum of all the real coordinates of the ordered pair solutions? That is, what is \(x_1+y_1+x_2+y_2+\cdots\) where each \(x_k\) and \(y_k\) corresponds to a real ordered pair solution \((x_k,y_k)\).`,
    choices: ["8", "6", "5", "4", "NOTA"], answer: "B",
    solution: String.raw`From the first equation, \(y^2=\frac{3x^2-22}{5}\). Substituting into the second gives
\[2x^2-5x-3=0,\]
so \(x=3\) or \(x=-\frac12\). The latter produces no real \(y\). When \(x=3\), \(y=\pm1\), so the real solutions are \((3,1)\) and \((3,-1)\). The requested sum is
\[3+1+3-1=\boxed6.\]`,
  },
  {
    id: 30082, number: 82, division: "Theta", topic: "Sequences", difficulty: 3, methods: ["Recursion"],
    question: String.raw`Define a sequence such that \(a_1=1\) and \(a_{n+1}=1+ia_n\) for all \(n\ge1\) and \(i=\sqrt{-1}\). Compute \(a_{1066}\). (By the way, the year 1066 is when the Battle of Hastings was fought in England.)`,
    choices: ["1", "-1", String.raw`\(i\)`, String.raw`\(-i\)`, "NOTA"], answer: "E",
    solution: String.raw`The first terms are
\[a_1=1,\quad a_2=1+i,\quad a_3=i,\quad a_4=0,\quad a_5=1,\]
so the sequence repeats every four terms. Since \(1066\equiv2\pmod4\), \(a_{1066}=1+i\), which is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30083, number: 83, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    question: String.raw`Find the quadratic function \(f(x)\) which has a zero of \(x=-5+2i\sqrt3\) in the form \(f(x)=ax^2+bx+c\) where \(a,b,\) and \(c\) are pairwise relatively prime integers and \(a>0\). What is \(a+b+c\)?`,
    choices: ["48", "37", "28", "-26", "NOTA"], answer: "A",
    solution: String.raw`Because the polynomial has real integer coefficients, \(-5-2i\sqrt3\) is also a zero. Therefore,
\[(x+5-2i\sqrt3)(x+5+2i\sqrt3)=x^2+10x+37.\]
Thus \(a+b+c=1+10+37=\boxed{48}\).`,
  },
  {
    id: 30084, number: 84, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: ["Point-to-Line Distance Formula"],
    question: String.raw`The shortest distance between a point \((x_0,y_0)\) and a line \(Ax+By+C=0\) is given by
\[\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}.\]
Compute the shortest distance between the lines \(x+2y=20\) and \(x+2y=25\).`,
    choices: ["5", String.raw`\(\sqrt5\)`, "1", String.raw`\(\frac{\sqrt5}{5}\)`, "NOTA"], answer: "B",
    solution: String.raw`The lines are parallel. Taking \((20,0)\) on the first line, its distance from the second line is
\[\frac{|20+2(0)-25|}{\sqrt{1^2+2^2}}=\frac5{\sqrt5}=\boxed{\sqrt5}.\]`,
  },
  {
    id: 30085, number: 85, division: "Theta", topic: "Analytic Geometry", difficulty: 5, methods: ["Point-to-Line Distance Formula"],
    question: String.raw`The shortest distance between a point \((x_0,y_0)\) and a line \(Ax+By+C=0\) is given by
\[\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}.\]
Let \(S\) be the set of all points \(P\) such that the distance from \(P\) to \((0,0)\) is half the distance from \(P\) to the line \(3x+4y=5\). There exist real numbers \(A,B,C,D,\) and \(E\) such that \(S\) is modeled by the equation
\[Ax^2+Bxy+Cy^2+Dx+Ey=1.\]
Compute \(A+B+C+D+E\).`,
    choices: [String.raw`\(\frac{67}{50}\)`, String.raw`\(\frac{81}{25}\)`, String.raw`\(-\frac{213}{50}\)`, String.raw`\(\frac{221}{25}\)`, "NOTA"], answer: "D",
    solution: String.raw`For \(P=(x,y)\),
\[\sqrt{x^2+y^2}=\frac12\cdot\frac{|3x+4y-5|}{5}=\frac1{10}|3x+4y-5|.\]
Squaring and rearranging into the requested form gives
\[\frac{91}{25}x^2-\frac{24}{25}xy+\frac{84}{25}y^2+\frac{30}{25}x+\frac{40}{25}y=1.\]
The sum of the coefficients is \(\boxed{\frac{221}{25}}\).`,
  },
  {
    id: 30086, number: 86, division: "Theta", topic: "Conic Sections", difficulty: 5, methods: ["Discriminant Test"],
    question: String.raw`The shortest distance between a point \((x_0,y_0)\) and a line \(Ax+By+C=0\) is given by
\[\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}.\]
Let \(S\) be the set of all points \(P\) such that the product of the distance from \(P\) to the line \(y=x\) and the distance from \(P\) to the line \(y=-\frac34x\) is \(\frac1{5\sqrt2}\). Set \(S\) consists of two slightly rotated hyperbolas such that one of which has a transverse axis with a positive slope (call this hyperbola \(H\)). Compute the smallest positive \(x\)-coordinate of any point on \(H\).`,
    choices: [String.raw`\(\frac47\)`, String.raw`\(\frac35\)`, String.raw`\(\frac59\)`, String.raw`\(\frac23\)`, "NOTA"], answer: "A",
    solution: String.raw`The distance product condition becomes
\[\left|\frac{x-y}{\sqrt2}\right|\left|\frac{3x+4y}{5}\right|=\frac1{5\sqrt2},\]
so \(|x-y||3x+4y|=1\). The hyperbola with a positive-slope transverse axis has
\[(x-y)(3x+4y)=1,\]
or \(3x^2+xy-4y^2=1\). Treating this as a quadratic in \(y\), a real point exists when
\[\Delta=x^2-4(-4)(3x^2-1)=49x^2-16\ge0.\]
For positive \(x\), this means \(x\ge\boxed{\frac47}\).`,
  },
  {
    id: 30087, number: 87, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    question: String.raw`According to Descartes' Rule of Signs, there are a few possible candidates for the numbers of positive real, negative real, and non-real complex roots of the following function:
\[f(x)=x^4-2x^3-x+1.\]
Which of the following is one such candidate? Answers are in the form of an ordered triple as follows: (positive real, negative real, non-real complex).`,
    choices: ["(2, 1, 1)", "(2, 0, 2)", "(1, 2, 1)", "(2, 2, 0)", "NOTA"], answer: "B",
    solution: String.raw`There are two sign changes in \(f(x)\), so there are \(2\) or \(0\) positive real roots. Also,
\[f(-x)=x^4+2x^3+x+1\]
has no sign changes, so there are no negative real roots. Since the polynomial has degree \(4\), \((2,0,2)\) is a possible distribution. The answer is \(\boxed{(2,0,2)}\).`,
  },
  {
    id: 30088, number: 88, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`A plane can fly 200mph in still air. Flying with the wind, it can fly 960 miles. Flying against the wind, it can fly only two-thirds of the distance in the same amount of time. Find the speed of the wind in mph.`,
    choices: ["20", "40", "60", "80", "NOTA"], answer: "B",
    solution: String.raw`If the wind speed is \(w\), equal travel times give
\[\frac{960}{200+w}=\frac{640}{200-w}.\]
Cross-multiplying yields \(192000-960w=128000+640w\), so \(1600w=64000\) and \(w=\boxed{40}\) mph.`,
  },
  {
    id: 30089, number: 89, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: ["Row Operations"],
    question: String.raw`Solve this system: \(3x+4y=1\) and \(5x+9y=2\). What is \(x+y\)?`,
    choices: [String.raw`\(\frac27\)`, String.raw`\(\frac49\)`, String.raw`\(\frac73\)`, String.raw`\(\frac45\)`, "NOTA"], answer: "A",
    solution: String.raw`Eliminating \(x\) gives \(7y=1\), so \(y=\frac17\). Substitution gives \(x=\frac17\). Therefore,
\[x+y=\boxed{\frac27}.\]`,
  },
  {
    id: 30090, number: 90, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: [],
    question: String.raw`Let's get familiar with coordinates. In what quadrant is the coordinate \(\left(-e,\frac{2\pi}{7}\right)\) located?`,
    choices: ["Quadrant 1", "Quadrant 2", "Quadrant 3", "Quadrant 4", "NOTA"], answer: "B",
    solution: String.raw`Since the \(x\)-coordinate is negative, it must be in either Quadrant 2 or 3. Since the \(y\)-coordinate is positive, the point must be in Quadrant 2.`,
  },
  {
    id: 30091, number: 91, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: ["Distance Formula"],
    question: String.raw`Consider the distance between the coordinate \(\left(-e,\frac{2\pi}{7}\right)\) and the origin. Which of the following best represents this distance, \(d\)?`,
    choices: [String.raw`\(0<d<1\)`, String.raw`\(1<d<2\)`, String.raw`\(2<d<3\)`, String.raw`\(3<d<4\)`, "NOTA"], answer: "C",
    solution: String.raw`Since \(e\approx2.71\) and \(\frac{2\pi}{7}\approx0.89\), the distance formula gives
\[d=\sqrt{e^2+\left(\frac{2\pi}{7}\right)^2}\approx\sqrt{(2.71)^2+(0.89)^2}<3.\]
Because \(e>2\), the distance is greater than \(2\). Therefore, \(2<d<3\).`,
  },
  {
    id: 30092, number: 92, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    question: String.raw`Let's introduce our very special coordinate for this test: \((h,k)\). Consider the line \(f(x)=x\). What is the \(y\)-intercept of the transformed function \(f(x-h)+k\)?`,
    choices: [String.raw`\(k\)`, String.raw`\(h+k\)`, String.raw`\(-h+k\)`, String.raw`\(-h-k\)`, "NOTA"], answer: "C",
    solution: String.raw`In the parent linear function, a horizontal shift in either direction also changes the \(y\)-intercept in that corresponding direction. In other words, \(y=(0-h)+k\) has value \(-h+k\).`,
  },
  {
    id: 30093, number: 93, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`The line \(2x-4y=5\) is shifted horizontally by \(h\) and vertically by \(k\). If the transformed function is mapped onto the original function for all points \((x,y)\), what could be the values of \(h\) and \(k\)?`,
    choices: [String.raw`\(h=3,k=6\)`, String.raw`\(h=-4,k=8\)`, String.raw`\(h=10,k=-5\)`, String.raw`\(h=5,k=\frac52\)`, "NOTA"], answer: "D",
    solution: String.raw`The transformed equation
\[2(x-h)-4(y-k)=5\]
can be rewritten as \(y=\frac12x-\frac54-\frac12h+k\). Setting this equal to the original function gives \(k=\frac12h\). Of the choices, \(h=5\) and \(k=\frac52\) satisfy this condition.`,
  },
  {
    id: 30094, number: 94, division: "Theta", topic: "Inverse Functions", difficulty: 2, methods: [],
    question: String.raw`Consider linear function \(g(x)\) where \(g(2)=3\) and \(g(-4)=10\). Find \(g^{-1}(-4)\).`,
    choices: ["-10", "-4", "8", "10", "NOTA"], answer: "C",
    solution: String.raw`The slope is \(m=-\frac76\), so
\[g(x)=-\frac76(x-2)+3.\]
Since we are looking for the inverse function's value at \(-4\), solve \(g(x)=-4\):
\[-4=-\frac76(x-2)+3.\]
This gives \(x=8\), so \(g^{-1}(-4)=8\).`,
  },
  {
    id: 30095, number: 95, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    question: String.raw`Consider two perpendicular lines graphed on a coordinate plane. Which of the following must be true?
\[\begin{array}{ll}
\text{I.} & \text{Two perpendicular lines will always intersect exactly once}\\
\text{II.} & \text{For any line, there is exactly one possible perpendicular line}\\
\text{III.} & \text{Two perpendicular lines are inverses of each other}\\
\text{IV.} & \text{If a line is a function, then a line perpendicular to it must also be a function.}
\end{array}\]`,
    choices: ["I only", "I, III", "I, III, IV", "I, II, IV", "NOTA"], answer: "A",
    solution: String.raw`The first statement is true: two perpendicular lines intersect once and only once. The second is false because infinitely many parallel lines can have the required perpendicular slope. The third is not always true; reflection across \(y=x\) does not generally produce a perpendicular line. The fourth is not always true because a line perpendicular to a horizontal function is vertical. Therefore, I is the only statement that must be true.`,
  },
  {
    id: 30096, number: 96, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    question: String.raw`Let's take another look at our special coordinate \((h,k)\). The quadratic function \(y=4x^2+6x-5\) can be rewritten as \(y=4(x-h)^2+k\). Find \(h+k\).`,
    choices: ["-8", String.raw`\(-\frac{23}{4}\)`, String.raw`\(-\frac{21}{2}\)`, String.raw`\(-\frac64\)`, "NOTA"], answer: "A",
    solution: String.raw`Complete the square:
\[y=4\left(x^2+\frac32x+\frac9{16}\right)-5-\frac94
=4\left(x+\frac34\right)^2-\frac{29}{4}.\]
Thus \(h=-\frac34\), \(k=-\frac{29}{4}\), and \(h+k=-8\).`,
  },
  {
    id: 30097, number: 97, division: "Theta", topic: "Function Analysis", difficulty: 1, methods: [],
    question: String.raw`Which of the following correctly describes the translations that occurred to \(y=4x^2\) to create the function \(y=4\left(x-\frac34\right)^2-\frac{17}{4}\)?`,
    choices: [
      String.raw`Translation to the right by \(\frac34\), translation down by \(\frac{17}{4}\)`,
      String.raw`Translation to the left by \(\frac34\), translation down by \(\frac{17}{4}\)`,
      String.raw`Translation to the right by \(\frac34\), translation up by \(\frac{17}{4}\)`,
      String.raw`Translation to the left by \(\frac34\), translation up by \(\frac{17}{4}\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`The general form \(y=a(x-h)^2+k\) is translated horizontally \(h\) units and vertically \(k\) units from \(y=ax^2\). The given function has been translated \(\frac34\) unit to the right and \(\frac{17}{4}\) units down.`,
  },
  {
    id: 30098, number: 98, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`A quadratic relation has an axis of symmetry of \(y=5\), an \(x\)-intercept of \((48,0)\) and intersects with the coordinate \((6,3)\). Find the sum of the coefficients \((a,b,\text{ and }c)\) of this relation when it is written in the form \(x=ay^2+by+c\).`,
    choices: ["-60", "30", "60", "70", "NOTA"], answer: "B",
    solution: String.raw`Based on the given information, we can generate a system of equations from the general form \(x=a(y-k)^2+h\):
\[48=a(0-5)^2+h,\qquad 6=a(3-5)^2+h.\]
Solving gives \(a=2\) and \(h=-2\). Expanding to standard form gives \(x=2y^2-20y+48\), whose sum of coefficients is \(30\).`,
  },
  {
    id: 30099, number: 99, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Vieta's Formulas"],
    question: String.raw`Questions #10-12 all concern the same quadratic. Given \(f(x)=ax^2+bx+c\) where \(a,b,c\in\mathbb Z\), which of the following must be true?
\[\begin{array}{ll}
\text{I.} & \text{The sum of the roots is an integer.}\\
\text{II.} & \text{The roots are integers.}\\
\text{III.} & f(x)\text{ is defined for all integer values of }x.
\end{array}\]`,
    choices: ["I only", "II only", "III only", "I, III", "NOTA"], answer: "C",
    solution: String.raw`By Vieta's formulae, the sum of the roots is \(-\frac ba\), which may not be an integer. If \(b^2-4ac\) is not a perfect square, the roots may not be rational and therefore may not be integers. Quadratic functions with integer coefficients are defined for all values of \(x\). This means that only III is necessarily true.`,
  },
  {
    id: 30100, number: 100, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    question: String.raw`Questions #10-12 all concern the same quadratic. Given \(f(x)=ax^2+bx+c\) where \(a,b,c\in\mathbb Z\), Dorin rewrites the function in vertex form, giving \(f(x)=a(x-h)^2+11\). Which of the following must be true?
\[\begin{array}{ll}
\text{I.} & f(x)\text{ must have two non-real, complex roots}\\
\text{II.} & f(x)\text{ must have a double root at }x=h\\
\text{III.} & f(x)\text{ must have an axis of symmetry at }x=11
\end{array}\]`,
    choices: ["I, II", "I, III", "II, III", "I, II, and III", "NOTA"], answer: "E",
    solution: String.raw`If \(a\) is negative, \(f(x)\) has two real roots, so I need not be true. With a vertex \(y\)-coordinate of \(11\), there cannot be a double root at \(x=h\), so II is false. The axis of symmetry is \(x=h\), which may be \(x=11\) but does not have to be. This results in none of the above answers.`,
  },
  {
    id: 30101, number: 101, division: "Theta", topic: "Conic Sections", difficulty: 4, methods: [],
    question: String.raw`Questions #10-12 all concern the same quadratic. Given \(f(x)=ax^2+bx+c\) where \(a,b,c\in\mathbb Z\), Dorin rewrites the function in vertex form as \(f(x)=a(x-h)^2+11\). Through further inspection, Dorin finds the focus of the function at \((3,10.75)\). Find \(a+b+c\).`,
    choices: ["6", "-6", "7", "15", "NOTA"], answer: "C",
    solution: String.raw`The focus reveals that the quadratic has a negative leading coefficient, signed focal length \(p=-\frac14\), and axis of symmetry \(x=3\). Therefore,
\[y=-(x-3)^2+11=-x^2+6x+2.\]
Thus \(a+b+c=-1+6+2=7\).`,
  },
  {
    id: 30102, number: 102, division: "Theta", topic: "Polynomial Equations", difficulty: 4, methods: [],
    question: String.raw`Our coordinate helps us change and move functions yet again! This time, a cubic function \(c(x)\) has roots at \(x=-1\) and \(x=4\), \(c(1)=2\), and \(c(x)\ge0\) on the interval \([-1,\infty)\). What is the \(y\)-intercept of the function \(c(x+3)-1\)?`,
    choices: ["-1", String.raw`\(-\frac59\)`, String.raw`\(\frac19\)`, String.raw`\(\frac59\)`, "NOTA"], answer: "B",
    solution: String.raw`Since \(c(x)\ge0\) on \([-1,\infty)\), there must be a double root at \(x=4\) and a positive leading coefficient. Thus
\[c(x)=a(x+1)(x-4)^2.\]
Using \(c(1)=2\) gives \(a=\frac19\). Therefore,
\[c(x+3)-1=\frac19(x+4)(x-1)^2-1,\]
which has a \(y\)-intercept of \(-\frac59\).`,
  },
  {
    id: 30103, number: 103, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    question: String.raw`This coordinate helps us change and move functions, no matter their behavior. Consider the parent cubic function \(f(x)=x^3\) with point \(A(0,0)\). Point \(A\) (and all other coordinates of \(f(x)\)) has been translated to create function \(g(x)=f(x-h)+k\). Similarly, exponential function \(d(x)=2^x\) has been translated to create \(p(x)=d(x-h)+k\). Find \(p(1)-g(1)\) in terms of \(h\).`,
    choices: [
      String.raw`\(\frac1{2^h}-(h+1)^3\)`,
      String.raw`\((h-1)^3+\frac2{2^h}\)`,
      String.raw`\(h^3+\frac1{2^h}\)`,
      String.raw`\(h^3-3h^2-3h-1+\frac2{2^h}\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`We have \(p(1)=2^{1-h}+k\) and \(g(1)=(1-h)^3+k\). Subtracting eliminates \(k\):
\[p(1)-g(1)=2^{1-h}-(1-h)^3.\]
Since \(-(1-h)^3=(h-1)^3\) and \(2^{1-h}=\frac2{2^h}\), this is
\[(h-1)^3+\frac2{2^h}.\]`,
  },
  {
    id: 30104, number: 104, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Rational Root Theorem"],
    question: String.raw`Consider \(y=3x^5+7x^4-x^2+x-12\). The rational root theorem defines a set of possible rational roots of certain polynomial functions. How many unique integer roots are contained in this set of possible roots of \(y\)?`,
    choices: ["5", "6", "12", "18", "NOTA"], answer: "C",
    solution: String.raw`The Rational Root Theorem gives possible rational roots \(\frac pq\), where \(p\mid12\) and \(q\mid3\). The integer candidates among them are
\[\{\pm1,\pm2,\pm3,\pm4,\pm6,\pm12\}.\]
There are \(12\) unique integer candidates in this set.`,
  },
  {
    id: 30105, number: 105, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`The radical \(\sqrt{a+\sqrt{bc}}\) can be simplified into \(\sqrt{\frac b2}+\sqrt{\frac c2}\). If \(x^3-64=(x-b)(x^2+bx+c)\), what is \(a\)?`,
    choices: ["2", "10", "16", "32", "NOTA"], answer: "B",
    solution: String.raw`By the difference of cubes, \(b=4\) and \(c=16\). Thus
\[\sqrt{a+\sqrt{64}}=\sqrt2+\sqrt8=3\sqrt2.\]
Squaring both sides gives \(a+8=18\), so \(a=10\).`,
  },
  {
    id: 30106, number: 106, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Remainder Theorem"],
    question: String.raw`Consider the following functions:
\[f(x)=3x^3-2x+10,\quad g(x)=x-\frac13,\quad h(x)=2x+4,\quad j(x)=x+2,\quad k(x)=3x-1.\]
Which order below shows the remainders of the polynomial divisions in order from least to greatest?`,
    choices: [
      String.raw`\(\frac{f(x)}{g(x)},\frac{f(x)}{h(x)},\frac{f(x)}{j(x)},\frac{f(x)}{k(x)}\)`,
      String.raw`\(\frac{f(x)}{j(x)},\frac{f(x)}{k(x)},\frac{f(x)}{g(x)},\frac{f(x)}{h(x)}\)`,
      String.raw`\(\frac{f(x)}{j(x)},\frac{f(x)}{h(x)},\frac{f(x)}{k(x)},\frac{f(x)}{g(x)}\)`,
      String.raw`\(\frac{f(x)}{k(x)},\frac{f(x)}{g(x)},\frac{f(x)}{h(x)},\frac{f(x)}{j(x)}\)`,
      "NOTA",
    ], answer: "C",
    solution: String.raw`The remainder when dividing by a linear polynomial is the value of \(f\) at its zero. Both \(j(x)\) and \(h(x)\) have zero \(-2\), so their remainders are
\[f(-2)=-10.\]
Both \(k(x)\) and \(g(x)\) have zero \(\frac13\), so their remainders are
\[f\left(\frac13\right)=\frac{85}{9}.\]
Therefore, a valid nondecreasing order is
\[\frac{f(x)}{j(x)},\frac{f(x)}{h(x)},\frac{f(x)}{k(x)},\frac{f(x)}{g(x)}.\]`,
  },
  {
    id: 30107, number: 107, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    question: String.raw`The following questions (#18-19) consider the function
\[h(x)=\frac{ax^2+bx+c}{x^2-2x-35},\qquad a,b,c\in\mathbb Z.\]
If it is known that \(h(x)\) has no vertical asymptotes, what is the value of \(h(x)\) on its domain?`,
    choices: [String.raw`\(h(x)=a\)`, String.raw`\(h(x)=b\)`, String.raw`\(h(x)=c\)`, String.raw`\(h(x)=1\)`, "NOTA"], answer: "A",
    solution: String.raw`If \(h(x)\) has no vertical asymptotes, the denominator must divide the numerator entirely. Because both are quadratic and the numerator's leading coefficient is \(a\), the simplified value is \(h(x)=a\) on its domain.`,
  },
  {
    id: 30108, number: 108, division: "Theta", topic: "Function Analysis", difficulty: 4, methods: [],
    question: String.raw`The following questions (#18-19) consider the function
\[h(x)=\frac{ax^2+bx+c}{x^2-2x-35},\qquad a,b,c\in\mathbb Z.\]
If it is known that \(h(x)\) has exactly one removable discontinuity, which of the following could be true?
\[\begin{array}{ll}
\text{I.} & c\text{ is divisible by 7 but is not divisible by 5}\\
\text{II.} & c\text{ has a 0 as its units digit}\\
\text{III.} & c\text{ is divisible by both 7 and 5}
\end{array}\]`,
    choices: ["I only", "III only", "I and II", "I, II, and III", "NOTA"], answer: "D",
    solution: String.raw`The denominator factors as \((x-7)(x+5)\). Exactly one removable discontinuity means the numerator can share either one of these factors, but not both. Each condition can occur: for example, numerators with other factors \(x+7\), \(x+10\), and \(x+25\), respectively, give constant terms meeting I, II, and III while sharing only one denominator factor. Thus all three could be true.`,
  },
  {
    id: 30109, number: 109, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: [],
    question: String.raw`Don't worry, \((h,k)\) is back again! Consider \(f(x)=\frac{4x-8}{x^2-4}\) and \(g(x)=f(x+h)-k\) where \(h,k\in\mathbb N\). If \(g(x)\) has a vertical asymptote at \(x=-8\) and horizontal asymptote at \(y=-1\), what is the value of \(h+k\)?`,
    choices: ["-9", "-7", "7", "11", "NOTA"], answer: "C",
    solution: String.raw`Simplifying \(f(x)\) gives
\[f(x)=\frac4{x+2}\]
with a vertical asymptote at \(x=-2\) and horizontal asymptote at \(y=0\). To obtain \(g(x)\), the graph is translated left \(6\) units and down \(1\) unit. Thus \(h=6\), \(k=1\), and \(h+k=7\).`,
  },
  {
    id: 30110, number: 110, division: "Theta", topic: "Vectors", difficulty: 1, methods: ["Distance Formula"],
    question: String.raw`Let's look at \((h,k)\) in a slightly different light. Consider point \(A_0(x,y)\) on any function \(f(x)\) corresponding to point \(A_1\) on function \(g(x)\), where \(g(x)=f(x-h)+k\). What is the displacement from \(A_0\) to \(A_1\) in terms of \(h\) and \(k\)?`,
    choices: [String.raw`\(h+k\)`, String.raw`\(\sqrt{h^2+k^2}\)`, String.raw`\(h-k\)`, String.raw`\(\sqrt{h^2-k^2}\)`, "NOTA"], answer: "B",
    solution: String.raw`The translation moves each point by the vector \(\langle h,k\rangle\). Its magnitude, and therefore the displacement, is \(\sqrt{h^2+k^2}\) by the distance formula.`,
  },
  {
    id: 30111, number: 111, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`A vector is a quantity that has both magnitude and direction. When functions are translated by horizontal and vertical shifts, the change in each coordinate's position can be modeled by a vector \((h,k)\). If function \(f(x)=\ln(x+1)-10\) is translated by \((3,-2)\), which of the following coordinates lies on the transformed function?`,
    choices: ["(0, -10)", "(-3, -2)", "(3, -12)", "(-3, -12)", "NOTA"], answer: "C",
    solution: String.raw`The parent function \(y=\ln x\) has an \(x\)-intercept at \((1,0)\). The function \(f(x)=\ln(x+1)-10\) shifts this point left \(1\) and down \(10\), giving \((0,-10)\). Translating by \((3,-2)\) moves it to \((3,-12)\).`,
  },
  {
    id: 30112, number: 112, division: "Theta", topic: "Vectors", difficulty: 1, methods: ["Distance Formula"],
    question: String.raw`If \(f(x)=\log_2x\) is first translated by \((-3,4)\), then translated again by \((8,15)\), find the total displacement of any point on \(f(x)\) to its corresponding translated point.`,
    choices: [String.raw`\(\sqrt{146}\)`, "17", String.raw`\(\sqrt{386}\)`, "22", "NOTA"], answer: "C",
    solution: String.raw`The two vectors combine to give the vector \((5,19)\). Its magnitude is
\[\sqrt{5^2+19^2}=\sqrt{25+361}=\sqrt{386}.\]`,
  },
  {
    id: 30113, number: 113, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    question: String.raw`Steven likes logarithms. He realizes that dilations and translations aren't so different when dealing with functions like \(y=\log_5x\). Which of the following functions has equivalent translations to \((2,-3)\)?`,
    choices: [
      String.raw`\(\log_5\frac{x-2}{5}\)`,
      String.raw`\(\log_5(125x-25)\)`,
      String.raw`\(\log_5\frac{x-2}{125}\)`,
      String.raw`\(\log_5(125(x-25))\)`,
      "NOTA",
    ], answer: "C",
    solution: String.raw`The translated function is \(\log_5(x-2)-3\). By the quotient rule for logarithms,
\[\log_5(x-2)-\log_5 125=\log_5\left(\frac{x-2}{125}\right).\]`,
  },
  {
    id: 30114, number: 114, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`Translations still have applications to non-functions. Consider \(16x=8(y-20)^2+2\). What translation would map the focus of this relation to its vertex?`,
    choices: [String.raw`\(\left\langle-\frac12,0\right\rangle\)`, String.raw`\(\left\langle\frac12,0\right\rangle\)`, String.raw`\(\left\langle0,\frac12\right\rangle\)`, String.raw`\(\left\langle0,-\frac12\right\rangle\)`, "NOTA"], answer: "A",
    solution: String.raw`Rewriting gives
\[(y-20)^2=2\left(x-\frac18\right).\]
The vertex is \(\left(\frac18,20\right)\) and the focal length is \(p=\frac12\), so the focus is \(\left(\frac58,20\right)\). To map the focus onto the vertex, translate by \(\left\langle-\frac12,0\right\rangle\).`,
  },
  {
    id: 30115, number: 115, division: "Theta", topic: "Conic Sections", difficulty: 4, methods: ["Eccentricity"],
    question: String.raw`Consider \(2x^2+8x=-y^2-y+10\). Tahir finds the center of this ellipse, then translates the relation so that the center is located at the origin. Find the eccentricity of this ellipse.`,
    choices: [String.raw`\(\frac{\sqrt2}{4}\)`, String.raw`\(\frac{\sqrt2}{2}\)`, "1", String.raw`\(\frac{\sqrt2}{8}\)`, "NOTA"], answer: "B",
    solution: String.raw`Completing the square gives
\[2(x+2)^2+\left(y+\frac12\right)^2=\frac{73}{4},\]
or
\[\frac{(x+2)^2}{73/8}+\frac{(y+1/2)^2}{73/4}=1.\]
Thus \(a^2=\frac{73}{4}\), \(b^2=\frac{73}{8}\), and \(c^2=a^2-b^2=\frac{73}{8}\). The eccentricity is
\[\frac ca=\frac{\sqrt{73/8}}{\sqrt{73/4}}=\frac{\sqrt2}{2}.\]`,
  },
  {
    id: 30116, number: 116, division: "Theta", topic: "Binomial Expansion", difficulty: 3, methods: ["Binomial Theorem"],
    question: String.raw`Even binomials can be translated! Consider the expansion of \((x+2)^4\). Find the difference between the cubic term of \((x+2)^4\) and the cubic term of \(((x-h)+2)^4\) in terms of \(h\).`,
    choices: ["0", "-4h", "4h", "8 - 4h", "NOTA"], answer: "C",
    solution: String.raw`The cubic term of \((x+2)^4\) is
\[\binom41x^3(2)=8x^3.\]
Since \(((x-h)+2)^4=(x+(2-h))^4\), its cubic term is
\[\binom41x^3(2-h)=(8-4h)x^3.\]
The difference between the cubic terms is \(8x^3-(8-4h)x^3=4hx^3\), so the difference between their coefficients is \(4h\).`,
  },
  {
    id: 30117, number: 117, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`Which of the following is equivalent to \(424_6\)?`,
    choices: [String.raw`\(160_9\)`, String.raw`\(311_7\)`, String.raw`\(242_8\)`, String.raw`\(2200_4\)`, "NOTA"], answer: "D",
    solution: String.raw`In base ten,
\[424_6=4(6^2)+2(6)+4=160.\]
The choices have base-ten values \(160_9=135\), \(311_7=155\), \(242_8=162\), and \(2200_4=160\). Therefore, \(424_6=2200_4\).`,
  },
  {
    id: 30118, number: 118, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Substitution"],
    question: String.raw`Find the sum of the solutions to \(2^{2x-1}-4=2^x\).`,
    choices: ["1", "2", "3", String.raw`\(\frac32\)`, "NOTA"], answer: "B",
    solution: String.raw`Let \(a=2^x\). Then
\[\frac12a^2-a-4=0,\]
so
\[\left(\frac12a-2\right)(a+2)=0.\]
The solution \(a=-2\) is extraneous because \(2^x>0\). Thus \(a=4\), so \(x=2\). The sum of the solutions is \(2\).`,
  },
  {
    id: 30119, number: 119, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    question: String.raw`What is the difference between the number of distinct arrangements of the word "LIONS" and the number of distinct arrangements of the letters "ROOAR"?`,
    choices: ["0", "90", "105", "120", "NOTA"], answer: "B",
    solution: String.raw`The number of arrangements of "LIONS" is \(5!=120\). The number of distinct arrangements of "ROOAR" is
\[\frac{5!}{2!2!}=30\]
because the letters O and R are each repeated. The difference is \(120-30=90\).`,
  },
  {
    id: 30120, number: 120, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: [],
    question: String.raw`One of the most celebrated traditions of March is "March Madness" when people fill out their NCAA Division I men's basketball tournament brackets to predict who will win. Which of the following is a root of the following polynomial equation, which uses brackets to group terms together?
\[\left[4x^3-8x^2+3x-6\right]\left[9x^2-4\right]=0\]`,
    choices: ["-2", String.raw`\(-\frac{i\sqrt3}{2}\)`, String.raw`\(\frac{1-i\sqrt5}{2}\)`, String.raw`\(\frac32\)`, "NOTA"], answer: "B",
    solution: String.raw`Factor the first expression:
\[4x^2(x-2)+3(x-2)=(4x^2+3)(x-2),\]
so its roots are \(x=2\) and \(x=\pm\frac{i\sqrt3}{2}\). The second expression factors as \((3x+2)(3x-2)\), with roots \(x=-\frac23\) and \(x=\frac23\). From this, only \(x=-\frac{i\sqrt3}{2}\) is a listed root.`,
  },
  {
    id: 30121, number: 121, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: ["Row Operations"],
    question: String.raw`How fast can you "march" through this problem? Find the sum of \(x\) and \(y\), which are the solutions to the following system of equations.
\[2x-3y=-39\]
\[-4x+5y=73\]`,
    choices: ["-11", "-9", "-7", "-5", "NOTA"], answer: "C",
    solution: String.raw`Adding twice the top equation, \(4x-6y=-78\), to the bottom equation gives \(-y=-5\), so \(y=5\). Solving \(2x-15=-39\) gives \(x=-12\). Therefore, \(x+y=-12+5=-7\).`,
  },
  {
    id: 30122, number: 122, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant"],
    question: String.raw`Beware the Ides of March and large matrices! If \(D\) is determinant of the following matrix, find the remainder when \(|D|\) is divided by 10.
\[\begin{bmatrix}
1&5&1&5\\
0&15&15&9\\
0&15&15&5\\
0&0&0&9
\end{bmatrix}\]`,
    choices: ["1", "3", "5", "9", "NOTA"], answer: "E",
    solution: String.raw`Expanding along row 4, the determinant is \(9\) times the determinant of the upper \(3\times3\) matrix. Expanding that determinant along column 1 leaves
\[\begin{vmatrix}15&15\\15&15\end{vmatrix}=0.\]
Thus \(D=0\), and the remainder when \(|D|\) is divided by \(10\) is \(0\), or NOTA.`,
  },
  {
    id: 30123, number: 123, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Logarithms"],
    question: String.raw`Spring is in the air, and the bunnies are multiplying exponentially! Megan's farm has 5 bunnies at the end of March 1st and 600 bunnies at the end of March 10th. If \(a=\ln2\), \(b=\ln3\), and \(c=\ln5\), then which expression below represents the rate of growth per day for the bunny population on the farm in terms of \(a\), \(b\), and \(c\)?`,
    choices: [
      String.raw`\(\frac{3a+b+c}{e^{2b}}\)`,
      String.raw`\(\frac{3a+b+c}{e^{a+c}}\)`,
      String.raw`\(\frac{3a+b+3c}{e^{2b}}\)`,
      String.raw`\(\frac{3a+b+3c}{e^{a+c}}\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`The number of bunnies multiplies by \(\frac{600}{5}=120\) in 9 days, so the continuous rate is
\[\frac{\ln120}{9}=\frac{\ln8+\ln3+\ln5}{e^{\ln9}}=\frac{3a+b+c}{e^{2b}}.\]`,
  },
  {
    id: 30124, number: 124, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    question: String.raw`Randall is chasing after one of the bunnies on the farm, which got loose and is now hopping along the bunny trail! The bunny takes one gigantic bounce whose height during the hop can be modeled by the equation \(y=-3t^2+25.5t-45\), where \(t\) is time in seconds. How many seconds pass while the bunny has jumped in the air? You may assume \(y=0\) is the ground.`,
    choices: ["3.5", "4.5", "6", "6.5", "NOTA"], answer: "A",
    solution: String.raw`Multiplying the equation by \(-\frac23\) gives
\[2t^2-17t+30=0.\]
This factors as \((2t-5)(t-6)=0\), so the bunny is in the air from \(t=\frac52\) to \(t=6\). The elapsed time is \(6-2.5=3.5\) seconds.`,
  },
  {
    id: 30125, number: 125, division: "Theta", topic: "Analytic Geometry", difficulty: 4, methods: [],
    question: String.raw`One of the best holidays in March is, of course, Pi Day! Find the \(x\)-coordinate of the \(x\)-intercept of the line that perpendicularly bisects the segment with endpoints \((\pi,1)\) and \((-3\pi,-5)\).`,
    choices: [String.raw`\(1-\pi\)`, "-2", String.raw`\(\frac9{2\pi}-\pi\)`, String.raw`\(\pi\)`, "NOTA"], answer: "E",
    solution: String.raw`The midpoint is
\[\left(\frac{\pi-3\pi}{2},\frac{1-5}{2}\right)=(-\pi,-2).\]
The segment's slope is \(\frac{3}{2\pi}\), so the perpendicular bisector's slope is \(-\frac{2\pi}{3}\). Its equation is
\[y+2=-\frac{2\pi}{3}(x+\pi).\]
Setting \(y=0\) gives \(x=-\pi-\frac3\pi\), which is not among choices A-D. Therefore, the answer is NOTA.`,
  },
  {
    id: 30126, number: 126, division: "Theta", topic: "Probability", difficulty: 2, methods: [],
    question: String.raw`Before 150 B.C.E., March was the first month of the calendar! You can still see traces of this in the modern calendar. For example, December is named after the Latin word for ten. Find the number of distinct permutations of the letters in the word DECEMBER.`,
    choices: ["720", "6720", "13440", "20160", "NOTA"], answer: "B",
    solution: String.raw`There are 8 letters in DECEMBER, 3 of which are E; all others are unique. Therefore, the number of distinct permutations is
\[\frac{8!}{3!}=\frac{40320}{6}=6720.\]`,
  },
  {
    id: 30127, number: 127, division: "Theta", topic: "Polynomials", difficulty: 5, methods: [],
    question: String.raw`March was named for the Roman god of war, Mars. Suppose Mars is arranging his soldiers in rows so that the \(n\)th row of soldiers contains \(f(n)\) soldiers for some degree-4 polynomial \(f(n)\). The first five rows contain 8, 27, 64, 125, and 336 soldiers, respectively. How many soldiers are there in the ninth row?`,
    choices: ["9400", "14824", "17280", "20683", "NOTA"], answer: "A",
    solution: String.raw`For \(n\in\{1,2,3,4\}\), the values agree with \((n+1)^3\). Therefore, \(f(n)-(n+1)^3\) is a quartic with roots \(1,2,3,\) and \(4\), so
\[f(n)=(n+1)^3+A(n-1)(n-2)(n-3)(n-4).\]
Using \(f(5)=336\) gives \(336=216+24A\), so \(A=5\). Hence
\[f(9)=10^3+5(8)(7)(6)(5)=9400.\]`,
  },
  {
    id: 30128, number: 128, division: "Theta", topic: "Binomial Expansion", difficulty: 2, methods: ["Binomial Theorem"],
    question: String.raw`NASA astronaut Scott Kelly returned to Earth after one full year in space on March 2nd, 2016. In honor of Scott, find the coefficient of the \(x^3y^2\) term in the expansion of \((2y-x)^5\).`,
    choices: ["-80", "-40", "40", "80", "NOTA"], answer: "B",
    solution: String.raw`\[\binom53(-x)^3(2y)^2=10(-x^3)(4y^2)=-40x^3y^2.\]
Thus the coefficient is \(-40\).`,
  },
  {
    id: 30129, number: 129, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    question: String.raw`On March 17th, 1973, Pink Floyd's album "The Dark Side of the Moon" first hit the Billboard Top 200 album chart at number 95. If the claim made at the closing of the album that, "There is no dark side of the moon...as a matter of fact, it's all dark." is true, in other words, all sides of the moon are actually dark; then, what is the probability of randomly selecting a point on the moon that is on the dark side of the moon?`,
    choices: ["0", String.raw`\(\frac12\)`, "1", String.raw`\(\frac23\)`, "NOTA"], answer: "C",
    solution: String.raw`Given that all sides of the moon are dark, the probability of randomly selecting a point on the moon that is on the dark side of the moon is \(1\).`,
  },
  {
    id: 30130, number: 130, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    question: String.raw`As the saying goes, March comes "in like a lion, out like a lamb." That was certainly true on March 1st, 2007, when a detachment of 170 Swiss infantrymen accidentally invaded neighboring Liechtenstein when they got lost on a training mission. Rewrite the logarithmic expression \(\log_3 170\) in terms of \(a=\log3\) and \(b=\log289\).`,
    choices: [String.raw`\(1+\frac{b}{2a}\)`, String.raw`\(\frac{1+a}{b}\)`, String.raw`\(1+\frac b2+\frac1a\)`, String.raw`\(\frac{2+b}{2a}\)`, "NOTA"], answer: "D",
    solution: String.raw`Using change of base,
\[\log_3 170=\frac{\log170}{\log3}
=\frac{\log10+\log17}{\log3}
=\frac{1+\frac b2}{a}
=\frac{2+b}{2a}.\]`,
  },
  {
    id: 30131, number: 131, division: "Theta", topic: "Matrices", difficulty: 3, methods: ["Matrix Inverse"],
    question: String.raw`Find \(A_{12}\) if \(A^{-1}=\begin{bmatrix}2&3\\5&7\end{bmatrix}\). Note \(A_{12}\) means the entry in the first row and second column.`,
    choices: ["-5", "-3", "3", "5", "NOTA"], answer: "C",
    solution: String.raw`Since \(A=(A^{-1})^{-1}\) and the determinant of \(A^{-1}\) is \(2(7)-3(5)=-1\),
\[A=-\begin{bmatrix}7&-3\\-5&2\end{bmatrix}
=\begin{bmatrix}-7&3\\5&-2\end{bmatrix}.\]
Therefore, \(A_{12}=3\).`,
  },
  {
    id: 30132, number: 132, division: "Theta", topic: "Sequences and Series", difficulty: 3, methods: ["Infinite Geometric Series"],
    question: String.raw`A University of Miami player drops a basketball beginning at a point 10 feet in the air and it begins bouncing off the ground. After the initial bounce off the ground, the ball continues bouncing straight up and down vertically returning to a height that is \(\frac45\) of the height of the bounce before it. If this ball could continue bouncing forever, find the sum of the vertical distances (both up and down) the ball travels beginning with the initial drop, in feet.`,
    choices: ["40", "50", "80", "90", "NOTA"], answer: "D",
    solution: String.raw`The downward distances form a geometric series with first term \(10\) and ratio \(\frac45\), with sum
\[\frac{10}{1-4/5}=50.\]
The upward distances form a geometric series with first term \(10\cdot\frac45=8\), with sum
\[\frac8{1-4/5}=40.\]
The total distance is \(50+40=90\) feet.`,
  },
  {
    id: 30133, number: 133, division: "Theta", topic: "Simplification", difficulty: 4, methods: [],
    question: String.raw`March is a radical month! Simplify
\[(\sqrt[3]{36}-\sqrt[3]{6}+1)(\sqrt{56}-\sqrt{24})(\sqrt[3]{6}+1)(\sqrt{56}+\sqrt{24}).\]`,
    choices: ["160", "224", "400", "560", "NOTA"], answer: "B",
    solution: String.raw`Reordering the cube-root factors gives a sum-of-cubes factorization:
\[(\sqrt[3]{36}-\sqrt[3]{6}+1)(\sqrt[3]{6}+1)=6+1=7.\]
The square-root factors give a difference of squares:
\[(\sqrt{56}-\sqrt{24})(\sqrt{56}+\sqrt{24})=56-24=32.\]
Thus the product is \(7\cdot32=224\).`,
  },
  {
    id: 30134, number: 134, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    question: String.raw`On March 5, 1981, Clive Sinclair launched the ZX81 computer, the first British model to sell more than a million units. It cost just €70, and nobody who uses its peculiar keyboard will ever forget it. The ZX81 uses an 8-bit processor, meaning it uses strings of 8 values, each of which is either a 0 or a 1. How many different 8-bit strings are possible?`,
    choices: ["127", "128", "255", "256", "NOTA"], answer: "D",
    solution: String.raw`Each of the eight bits can independently take one of 2 values, so there are \(2^8=256\) possible strings.`,
  },
  {
    id: 30135, number: 135, division: "Theta", topic: "Probability", difficulty: 3, methods: [],
    question: String.raw`Blaise Pascal time-travels to the future along with a 23-bit processor. He inputs a value into the computer to generate a 23-bit string, but due to the time travel, the processor is faulty, and up to 3 bits may be processed as the wrong values. How many possible values might the computer have stored incorrectly after Blaise's input?`,
    choices: ["2023", "2024", "2047", "2048", "NOTA"], answer: "C",
    solution: String.raw`Choose \(1\), \(2\), or \(3\) of the \(23\) bits to be incorrect. The case with no incorrectly processed bits is excluded by the wording. Therefore, the number of incorrectly stored values is
\[\binom{23}{1}+\binom{23}{2}+\binom{23}{3}=23+253+1771=2047.\]`,
  },
  {
    id: 30136, number: 136, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: [],
    question: String.raw`Read Across America is celebrated on Dr. Seuss's birthday, March 2. What would you be reading about if you saw the statement "Every polynomial equation with complex coefficients and degree \(\ge1\) has at least one complex root."?`,
    choices: ["Descartes's Rule of Signs", "Fundamental Theorem of Algebra", "Fundamental Theorem of Arithmetic", "Rational Root Theorem", "NOTA"], answer: "B",
    solution: String.raw`This is a formulation of the Fundamental Theorem of Algebra, which also states that a degree-\(n\ge1\) polynomial with complex coefficients has exactly \(n\) complex roots when multiplicity is counted.`,
  },
  {
    id: 30137, number: 137, division: "Theta", topic: "Inequalities", difficulty: 4, methods: ["Rational Root Theorem"],
    question: String.raw`March is Women's History Month. Help fight the inequality and give the interval of real values for \(x\) such that
\[x^5-5x^4+4x^3+4x^2+3x+9>0.\]`,
    choices: [
      String.raw`\((-\infty,-3)\cup(3,\infty)\)`,
      String.raw`\((-3,1)\)`,
      String.raw`\((-1,3)\cup(3,\infty)\)`,
      String.raw`\((-1,\infty)\)`,
      "NOTA",
    ], answer: "C",
    solution: String.raw`The polynomial factors as
\[(x+1)(x-3)^2(x^2+1).\]
The second and third factors are nonnegative for real \(x\), with zeros at \(x=3\) for the squared factor. The strict inequality therefore holds on
\[(-1,3)\cup(3,\infty).\]`,
  },
  {
    id: 30138, number: 138, division: "Theta", topic: "Conic Sections", difficulty: 5, methods: [],
    question: String.raw`March 31 is the International Transgender Day of Visibility. The rectangular transgender pride flag consists of five congruent rectangles (colored blue, pink, white, pink, and blue) stacked on top of each other. This flag is placed on the coordinate plane such that each of its vertices has an \(x\)-coordinate of \(\pm5\) and a \(y\)-coordinate of \(\pm3\). An ellipse is drawn around the flag such that it passes through each vertex of the flag and the points \((\sqrt5,\sqrt{21})\) and \((2\sqrt5,\sqrt{k})\). Find \(k\).`,
    choices: ["6", "8", "10", "12", "NOTA"], answer: "D",
    solution: String.raw`By symmetry, the ellipse is centered at the origin and has equation
\[\frac{x^2}{a^2}+\frac{y^2}{b^2}=1.\]
Using \((5,3)\) and \((\sqrt5,\sqrt{21})\) gives
\[\frac{25}{a^2}+\frac9{b^2}=1,\qquad \frac5{a^2}+\frac{21}{b^2}=1,\]
which yields \(a^2=40\) and \(b^2=24\). Substituting \((2\sqrt5,\sqrt{k})\) gives
\[\frac{20}{40}+\frac{k}{24}=1,\]
so \(k=12\).`,
  },
  {
    id: 30139, number: 139, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    question: String.raw`Which of the following is an asymptote of the graph of the equation \(y=\frac{x^3-1}{x-1}\)?`,
    choices: [String.raw`\(x=-1\)`, String.raw`\(x=1\)`, String.raw`\(y=1\)`, String.raw`\(y=x^2\)`, "NOTA"], answer: "E",
    solution: String.raw`Using the difference of cubes,
\[\frac{x^3-1}{x-1}=x^2+x+1\qquad(x\ne1).\]
The graph is the parabola \(y=x^2+x+1\) with a hole at \((1,3)\), so it has no asymptotes. The answer is NOTA.`,
  },
  {
    id: 30140, number: 140, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: ["Symmetry"],
    question: String.raw`How many of the following describe the graph of \(xy=1\)?
\[\begin{array}{lll}
\text{i.} & \text{Relation}\\
\text{ii.} & \text{Function}\\
\text{iii.} & \text{One-to-one}\\
\text{iv.} & \text{Symmetric about the }x\text{-axis}\\
\text{v.} & \text{Symmetric about the }y\text{-axis}\\
\text{vi.} & \text{Symmetric about the line }y=x
\end{array}\]`,
    choices: ["2", "3", "4", "5", "NOTA"], answer: "C",
    solution: String.raw`The equation \(y=\frac1x\) is a relation, a function, and a one-to-one function. It is also its own inverse, so it is symmetric about \(y=x\). It is not symmetric about either coordinate axis. Therefore, \(4\) statements describe the graph.`,
  },
  {
    id: 30141, number: 141, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Discriminant Test"],
    question: String.raw`Which of the following equations describes a parabola?`,
    choices: [
      String.raw`\(x^2+6xy+9y^2+20x+24y+311838=0\)`,
      String.raw`\(3x^2+6xy+7y^2+20x+24y+311838=0\)`,
      String.raw`\(5x^2+6xy+5y^2+20x+24y+311838=0\)`,
      String.raw`\(7x^2+6xy+3y^2+20x+24y+311838=0\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`A nondegenerate conic is a parabola when \(B^2-4AC=0\). For choice A,
\[6^2-4(1)(9)=0,\]
so \(x^2+6xy+9y^2+20x+24y+311838=0\) describes a parabola.`,
  },
  {
    id: 30142, number: 142, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: ["Substitution"],
    question: String.raw`The Easter Bunny takes a parabolic hop starting at \(t=0\) seconds and a height of 0 cm. At time \(t=3\) seconds, he is at a height of 60 cm, and at \(t=4\) seconds he is at a height of 66 cm. At what time (in seconds) will he land at a height of 0 cm again?`,
    choices: ["7", String.raw`\(\frac{51}{7}\)`, "8", String.raw`\(\frac{61}{7}\)`, "NOTA"], answer: "D",
    solution: String.raw`Because the parabola passes through \((0,0)\), write it as \(y=at^2+bt\). The other points give
\[9a+3b=60,\qquad16a+4b=66.\]
Solving yields \(a=-\frac72\) and \(b=\frac{61}{2}\). Thus
\[y=\frac t2(-7t+61),\]
whose nonzero root is \(t=\frac{61}{7}\).`,
  },
  {
    id: 30143, number: 143, division: "Theta", topic: "Sequences", difficulty: 2, methods: [],
    question: String.raw`St. Patrick's Day is famous for its green attire. In the year 2010, 712 students wore green shirts to the IMAO National Convention. In the year 2019, 1027 students wore green shirts to the IMAO National Convention. If the number of students who wear green shirts follows an arithmetic progression every year, how many students are predicted to be wearing green in the year 2038?`,
    choices: ["1622", "1657", "1692", "1787", "NOTA"], answer: "C",
    solution: String.raw`The number of students increases by \(1027-712=315\) in \(9\) years, or \(35\) students per year. The year 2038 is \(28\) years after 2010, so the prediction is
\[712+35(28)=1692.\]`,
  },
  {
    id: 30144, number: 144, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`March 9 is a date such that the number of the month is the square root of the number of the day - nice! Find the digit \(M\) such that the five-digit integer formed by \(3M9M2\) is divisible by 12. What is \(M\)?`,
    choices: ["1", "5", "8", "9", "NOTA"], answer: "B",
    solution: String.raw`The number must be divisible by both \(3\) and \(4\). Its digit sum is \(14+2M\), so divisibility by \(3\) gives \(M\in\{2,5,8\}\). Its final two digits are \(M2\), so divisibility by \(4\) gives \(M\in\{1,5,9\}\). The intersection is \(M=5\).`,
  },
  {
    id: 30145, number: 145, division: "Theta", topic: "Probability", difficulty: 4, methods: ["Complement Rule"],
    question: String.raw`March is Red Cross Month. Every 8 minutes, the American Red Cross responds to an emergency. One of the ways people at least 17 years old can help the Red Cross is to donate blood. The 8 blood types are \(O^-,O^+,A^-,A^+,B^-,B^+,AB^-,\) and \(AB^+\), where the positive and negative signs indicate the presence of the rhesus factor on the surface of red blood cells. Suppose you randomly select 3 out of those 8 blood types. Let \(X\) represent the probability that your 3 randomly selected blood types are either not all positive or not all negative for the rhesus factor when the selections are done without replacement. Let \(Y\) represent the probability that your 3 randomly selected blood types are either not all positive or not all negative for the rhesus factor when the selections are done with replacement. What is \(X-Y\)?`,
    choices: [String.raw`\(\frac3{28}\)`, String.raw`\(\frac67\)`, String.raw`\(\frac14\)`, String.raw`\(\frac{17}{28}\)`, "NOTA"], answer: "A",
    solution: String.raw`Without replacement, there are \(\binom83=56\) selections. There are \(2\binom43=8\) selections that are all positive or all negative, so
\[X=\frac{56-8}{56}=\frac67.\]
With replacement, the \(2^3=8\) equally likely sign patterns include two constant-sign patterns, so
\[Y=\frac{8-2}{8}=\frac34.\]
Therefore,
\[X-Y=\frac67-\frac34=\frac3{28}.\]`,
  },
  {
    id: 30146, number: 146, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Logarithms"],
    question: String.raw`March is Fire Prevention Month. A wood fire burns at \(600^\circ\text{C}\). Newton's Law of Cooling states that the difference in temperature between an object and its ambient environment experiences exponential decay; despite being named after the case when an object is cooling down, it also applies when an object is heating up! An object at \(80^\circ\text{C}\) at time \(t=0\) minutes has a temperature of \(470^\circ\text{C}\) at \(t=4\) minutes. Assuming Newton's Law of Cooling to be true, at an integer \(t=T\) minutes, the temperature of the object will be closest to \(599^\circ\text{C}\). Find \(T\).`,
    choices: ["11", "14", "18", "19", "NOTA"], answer: "C",
    solution: String.raw`The difference from the ambient temperature is \(520^\circ\text{C}\) at \(t=0\) and \(130^\circ\text{C}\) at \(t=4\). Thus the difference is quartered every \(4\) minutes, or halved every \(2\) minutes. After \(18\) minutes, the difference is
\[\frac{520}{2^9}=\frac{65}{64},\]
so the temperature is \(598.984375^\circ\text{C}\), closer to \(599^\circ\text{C}\) than at either adjacent integer time. Therefore, \(T=18\).`,
  },
  {
    id: 30147, number: 147, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["De Moivre's Theorem"],
    question: String.raw`The zodiac signs for the month of March are Pisces and Aries. If \(i=\sqrt{-1}\), find \((1+i)^{10}\).`,
    choices: [String.raw`\(-32i\)`, "-32", "32", String.raw`\(32i\)`, "NOTA"], answer: "D",
    solution: String.raw`Observe that \((1+i)^2=2i\). Therefore,
\[(1+i)^{10}=(2i)^5=2^5i^5=32i.\]`,
  },
  {
    id: 30148, number: 148, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Eccentricity"],
    question: String.raw`Spring into this problem and find the eccentricity of the following hyperbola.
\[2x^2-y^2-6y=-4\]`,
    choices: [String.raw`\(\frac{\sqrt6}{2}\)`, String.raw`\(\sqrt2\)`, String.raw`\(\frac32\)`, String.raw`\(\sqrt3\)`, "NOTA"], answer: "A",
    solution: String.raw`Completing the square gives
\[2x^2-(y^2+6y+9)=-13,\]
so
\[\frac{(y+3)^2}{13}-\frac{x^2}{13/2}=1.\]
The eccentricity is
\[\frac{\sqrt{13+13/2}}{\sqrt{13}}=\sqrt{1+\frac12}=\frac{\sqrt6}{2}.\]`,
  },
  {
    id: 30149, number: 149, division: "Theta", topic: "Simplification", difficulty: 2, methods: [],
    question: String.raw`Time goes on eternally, much like the following infinitely nested radical. Find its value.
\[\sqrt{3+\sqrt{3+\sqrt{3+\sqrt{3+\cdots}}}}\]`,
    choices: ["2", String.raw`\(\frac12+\sqrt3\)`, String.raw`\(\frac{1+\sqrt{13}}2\)`, "3", "NOTA"], answer: "C",
    solution: String.raw`Let the nested radical equal \(x\). Then
\[x=\sqrt{3+x}.\]
Squaring gives \(x^2-x-3=0\), so
\[x=\frac{1\pm\sqrt{13}}2.\]
The nested radical is positive, so \(x=\frac{1+\sqrt{13}}2\).`,
  },
  {
    id: 30150, number: 150, division: "Theta", topic: "Inverse Functions", difficulty: 3, methods: [],
    question: String.raw`What is the range of the function \(f^{-1}(x)\) if \(f(x)=\frac{\ln(x+1)}{\sqrt{x-13}}\)?`,
    choices: [String.raw`\(y>-1\)`, String.raw`\(y>13\)`, String.raw`\(-1<x<13\)`, String.raw`\(x>-1\)`, "NOTA"], answer: "B",
    solution: String.raw`The range of \(f^{-1}(x)\) is the same as the domain of \(f(x)\). For \(\ln(x+1)\), we need \(x+1>0\), so \(x>-1\). The denominator \(\sqrt{x-13}\) requires \(x\ge13\), but it also cannot equal \(0\), so \(x>13\). Both conditions together give \(x>13\). Therefore, the range of \(f^{-1}(x)\) is \(y>13\).`,
  },
  {
    id: 30151, number: 151, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`Express the following as a single simplified radical expression without rationalizing the denominator:
\[\sqrt[12]{x^5y}\div\sqrt[8]{x^3y^5}\]`,
    choices: [String.raw`\(\sqrt[24]{\frac{x}{y^{13}}}\)`, String.raw`\(\sqrt{\frac{x}{y^2}}\)`, String.raw`\(\sqrt[4]{\frac{x}{y^2}}\)`, String.raw`\(\sqrt[48]{\frac{x}{y^2}}\)`, "NOTA"], answer: "A",
    solution: String.raw`The twelfth root is a \(\frac1{12}\) power and the eighth root is a \(\frac18\) power. The least common multiple of \(12\) and \(8\) is \(24\), so
\[\sqrt[12]{x^5y}=\sqrt[24]{x^{10}y^2},\qquad
\sqrt[8]{x^3y^5}=\sqrt[24]{x^9y^{15}}.\]
Combining the roots gives \(\sqrt[24]{\frac{x}{y^{13}}}\).`,
  },
  {
    id: 30152, number: 152, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    question: String.raw`The function \(y=g(x)\) has the property that \(f(g(x))=x+2\) for all values of \(x\). If \(f(x)=\sqrt[3]{x-1}\), and \(g(x)=x^3+bx^2+cx+d\), then give the value of \(\frac{b+c}{d}\).`,
    choices: ["-1", "0", "1", "2", "NOTA"], answer: "D",
    solution: String.raw`Since \(f(x)=\sqrt[3]{x-1}\),
\[\sqrt[3]{g(x)-1}=x+2.\]
Cubing gives \(g(x)-1=x^3+6x^2+12x+8\), so
\[g(x)=x^3+6x^2+12x+9.\]
Thus \(b=6\), \(c=12\), and \(d=9\), giving \(\frac{b+c}{d}=2\).`,
  },
  {
    id: 30153, number: 153, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`Pat can cut and split a cord of firewood in 6 fewer hours than Jesse can. When they work together, it takes them 4 hr. How long would it take Jesse to do the job alone?`,
    choices: ["2 hr.", "6 hr.", "7 hr.", "12 hr.", "NOTA"], answer: "D",
    solution: String.raw`Let \(J\) be Jesse's time, so Pat's time is \(J-6\). The work-rate equation is
\[\frac4{J-6}+\frac4J=1.\]
Multiplying by \(J(J-6)\) and simplifying gives
\[J^2-14J+24=0=(J-12)(J-2).\]
The value \(J=2\) is impossible because their combined time is \(4\) hours, so \(J=12\).`,
  },
  {
    id: 30154, number: 154, division: "Theta", topic: "Inequalities", difficulty: 1, methods: [],
    question: String.raw`Which mathematical symbol best compares \(|x+y|\) and \(|x|+|y|\) over all real numbers \(x\) and \(y\) (that is, replace "and" with one of the following symbols to make a true mathematical statement in all cases)?`,
    choices: ["<", String.raw`\(\le\)`, "=", String.raw`\(\ge\)`, "NOTA"], answer: "B",
    solution: String.raw`By the triangle inequality,
\[|x+y|\le|x|+|y|.\]
Equality occurs when \(x\) and \(y\) have the same sign, while the inequality is strict for some values with opposite signs.`,
  },
  {
    id: 30155, number: 155, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: ["Substitution"],
    question: String.raw`How many real number solutions does the following equation have?
\[\left(\frac1x+2\right)^2+5\left(\frac1x+2\right)-14=0\]`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`Let \(u=\frac1x+2\). Then
\[u^2+5u-14=(u+7)(u-2)=0,\]
so \(u=-7\) or \(u=2\). The first gives \(\frac1x=-9\), hence \(x=-\frac19\). The second gives \(\frac1x=0\), which has no solution. Therefore, the original equation has one real solution.`,
  },
  {
    id: 30156, number: 156, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    question: String.raw`For a given line \(l_1\) with slope \(m\), we'll call a perpendicular line \(l_2\) and the "inverse" line to \(l_1\) we'll call \(l_3\), where the "inverse" line is defined as \(y=\frac1m x-\frac bm\). What is the product of the slopes of \(l_2\) and \(l_3\)?`,
    choices: ["We cannot determine", "-1", String.raw`\(\frac1m\)`, String.raw`\(-\frac1m\)`, "NOTA"], answer: "E",
    solution: String.raw`For \(l_1:y=mx+b\), a perpendicular line has slope \(-\frac1m\), while the defined "inverse" line has slope \(\frac1m\). Their product is
\[-\frac1m\cdot\frac1m=-\frac1{m^2},\]
which is not listed among choices A-D. Therefore, the answer is NOTA.`,
  },
  {
    id: 30157, number: 157, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`The current in a river moves at a rate of 3 ft/sec. Rowing his kayak with the current, Pat travels 150 ft forward in the time it takes to travel 50 ft in the opposite direction. How fast can Pat row in still water?`,
    choices: ["5 ft/sec.", "10 ft/sec.", "12 ft/sec.", "15 ft/sec.", "NOTA"], answer: "E",
    solution: String.raw`Let \(r\) be Pat's still-water speed and \(t\) the common travel time. Then
\[150=(r+3)t,\qquad50=(r-3)t.\]
Dividing the equations gives \(3=\frac{r+3}{r-3}\), so \(r=6\) ft/sec. Since \(6\) is not listed, the answer is NOTA.`,
  },
  {
    id: 30158, number: 158, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Geometric Sequence"],
    question: String.raw`The number of poodles in Pat's Pet Palace doubles every three months. If after nine months, Pat has \(p\) poodles, which expression below represents how many poodles will Pat have after \(y\) years?`,
    choices: [String.raw`\((2p)^{4y}\)`, String.raw`\(p(2^{3y-2})\)`, String.raw`\(p(2^{4y-3})\)`, String.raw`\((2p)^3(4y-3)\)`, "NOTA"], answer: "C",
    solution: String.raw`In nine months, the population has doubled three times, so Pat began with \(\frac{p}{2^3}\) poodles. Since \(y\) years is \(12y\) months, there are \(4y\) doubling periods. Thus the population is
\[\frac{p}{2^3}(2^{4y})=p(2^{4y-3}).\]`,
  },
  {
    id: 30159, number: 159, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    question: String.raw`What is the domain of the relation \(y=\log_2\left(\frac{\sqrt{6-2x}}{x-5}\right)\) in interval notation?`,
    choices: [String.raw`\((5,\infty)\)`, String.raw`\((-\infty,3]\)`, String.raw`\([3,5)\)`, String.raw`\((-\infty,3]\cup(5,\infty)\)`, "NOTA"], answer: "E",
    solution: String.raw`The logarithm's argument must be positive. The numerator \(\sqrt{6-2x}\) exists only for \(x\le3\) and equals \(0\) at \(x=3\); the denominator is negative throughout \(x\le3\). Thus the quotient is never positive. There is no real domain, so the answer is NOTA.`,
  },
  {
    id: 30160, number: 160, division: "Theta", topic: "Optimization", difficulty: 1, methods: [],
    question: String.raw`Over all integers, what integer will minimize \(f(x)=5x^2-7x+11\)?`,
    choices: ["-1", "0", "1", "2", "NOTA"], answer: "C",
    solution: String.raw`The vertex occurs at
\[x=-\frac{b}{2a}=\frac7{10}.\]
Since the parabola opens upward, the closest integer to \(\frac7{10}\) minimizes the function. That integer is \(x=1\).`,
  },
  {
    id: 30161, number: 161, division: "Theta", topic: "Inequalities", difficulty: 5, methods: [],
    question: String.raw`What is the solution set to the following inequality in interval notation?
\[\frac{x^7(x-2)^4}{(x+5)^3(x+8)^6(x-9)^{11}}\le0\]`,
    choices: [
      String.raw`\((-\infty,-5)\cup[0,9)\)`,
      String.raw`\((-\infty,-8)\cup(-8,-5)\cup[0,9)\)`,
      String.raw`\((-\infty,-8)\cup(-8,-5)\cup[0,2)\cup(2,9)\)`,
      String.raw`\((-\infty,-8)\cup(-8,-5)\cup(0,2)\cup(2,9)\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`A sign chart uses the critical values \(-8,-5,0,2,\) and \(9\). The even powers at \(-8\) and \(2\) do not change the sign, although \(x=-8\) is excluded because it makes the denominator zero. The odd powers change the sign at \(-5,0,\) and \(9\). The expression is nonpositive on
\[(-\infty,-8)\cup(-8,-5)\cup[0,9).\]`,
  },
  {
    id: 30162, number: 162, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    question: String.raw`For \(f(x)=\frac{x-1}{x-2}\) and \(g(x)=\frac{x-3}{x-2}\), where \(x\) is over the real numbers, what is the domain of \(f\circ g\) in set notation?`,
    choices: [
      String.raw`\(\{x\mid x\ne2\}\)`,
      String.raw`\(\{x\mid x\ne1,x\ne2\}\)`,
      String.raw`\(\{x\mid x\ne1,x\ne3\}\)`,
      String.raw`\(\{x\mid x\ne1,x\ne2,x\ne3\}\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`The inner function requires \(x\ne2\). The outer function also requires \(g(x)\ne2\). Solving
\[\frac{x-3}{x-2}=2\]
gives \(x=1\). Therefore, the domain is \(\{x\mid x\ne1,x\ne2\}\).`,
  },
  {
    id: 30163, number: 163, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    question: String.raw`Solve the inequality \(|x+2|+|2x+10|>4\) in interval notation.`,
    choices: [
      String.raw`\((-\infty,-\frac{16}{3})\cup(\frac83,\infty)\)`,
      String.raw`\((-\infty,-\frac{16}{3})\cup(-4,\infty)\)`,
      String.raw`\((-\infty,-\frac{16}{3})\cup(-4,-2)\cup(\frac83,\infty)\)`,
      String.raw`\((-4,-2)\cup(\frac83,\infty)\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`The critical points are \(x=-5\) and \(x=-2\). Solving on the three intervals gives:
\[\begin{array}{ll}
x<-5:&-3x-12>4\Longrightarrow x<-\frac{16}{3},\\
-5\le x<-2:&x+8>4\Longrightarrow x>-4,\\
x\ge-2:&3x+12>4,
\end{array}\]
and the last inequality holds for every \(x\ge-2\). Combining the valid portions gives
\[(-\infty,-\tfrac{16}{3})\cup(-4,\infty).\]`,
  },
  {
    id: 30164, number: 164, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`Simplify \(\sqrt{27x-18}+\sqrt{3x^3-2x^2}-\sqrt{12x-8}\) by collecting radical terms so that you are only left with one radical expression. Assume all expressions under all radicals represent nonnegative real numbers and \(x\) is a nonnegative real number as well.`,
    choices: [
      String.raw`\((x+1)\sqrt{3x-2}\)`,
      String.raw`\(x\sqrt{3x-2}\)`,
      String.raw`\(\sqrt{3x^3-2x^2+15x-10}\)`,
      String.raw`\((x^2+5)\sqrt{3x-2}\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`Treat each square root separately:
\[\sqrt{27x-18}=3\sqrt{3x-2},\]
\[\sqrt{3x^3-2x^2}=x\sqrt{3x-2}\]
because \(x\ge0\), and
\[\sqrt{12x-8}=2\sqrt{3x-2}.\]
Collecting like radical terms gives \((x+1)\sqrt{3x-2}\).`,
  },
  {
    id: 30165, number: 165, division: "Theta", topic: "Sequences and Series", difficulty: 2, methods: ["Telescoping"],
    question: String.raw`What is \(\sum_{n=1}^{100}\left(\frac1n-\frac1{n+1}\right)\)?`,
    choices: ["1", String.raw`\(\frac12\)`, String.raw`\(\frac{99}{100}\)`, String.raw`\(\frac{100}{101}\)`, "NOTA"], answer: "D",
    solution: String.raw`Writing out the sum,
\[\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\cdots+\left(\frac1{100}-\frac1{101}\right),\]
all intermediate terms cancel. The result is
\[1-\frac1{101}=\frac{100}{101}.\]`,
  },
  {
    id: 30166, number: 166, division: "Theta", topic: "Simplification", difficulty: 4, methods: ["Partial Fractions"],
    question: String.raw`If
\[\frac{x^2+7x}{(x-1)(x^2+1)}=\frac{A}{x-1}+\frac{Bx+C}{x^2+1},\]
then what is \(\frac{AB}{C}\)?`,
    choices: ["-3", "-12", "6", "9", "NOTA"], answer: "A",
    solution: String.raw`Equating numerators gives
\[x^2+7x=A(x^2+1)+(Bx+C)(x-1).\]
Matching coefficients yields
\[1=A+B,\qquad7=-B+C,\qquad0=A-C.\]
Solving gives \(A=4\), \(B=-3\), and \(C=4\). Therefore,
\[\frac{AB}{C}=\frac{4(-3)}4=-3.\]`,
  },
  {
    id: 30167, number: 167, division: "Theta", topic: "Inequalities", difficulty: 2, methods: [],
    question: String.raw`If \(f(x)=x^2-8x+23\) and \(g(x)=2x-13\), find all values of \(a\) such that \(g(a)<f(x)\) for all values of \(x\). Express your answer in interval notation.`,
    choices: [String.raw`\((-\infty,4)\)`, String.raw`\((4,\infty)\)`, String.raw`\((-\infty,10)\)`, String.raw`\((10,\infty)\)`, "NOTA"], answer: "C",
    solution: String.raw`Completing the square gives
\[f(x)=(x-4)^2+7,\]
so the minimum value of \(f\) is \(7\). We need
\[g(a)=2a-13<7,\]
which gives \(a<10\). Therefore, the solution is \((-\infty,10)\).`,
  },
  {
    id: 30168, number: 168, division: "Theta", topic: "Inequalities", difficulty: 1, methods: [],
    question: String.raw`If \(f(x)=x^2-8x+23\) and \(g(x)=2x-13\) as in the problem above, find all values of \(a\) such that \(g(a)<f(x)\) for some value \(x\). Express your answer in interval notation.`,
    choices: [String.raw`\((-\infty,\infty)\)`, String.raw`\([7,\infty)\)`, String.raw`\((-\infty,10)\)`, String.raw`\((4,\infty)\)`, "NOTA"], answer: "A",
    solution: String.raw`The parabola \(f(x)=(x-4)^2+7\) is unbounded above. For every real \(a\), the value \(g(a)\) is finite, so some sufficiently large \(|x|\) makes \(f(x)>g(a)\). Thus every real \(a\) works, giving \((-\infty,\infty)\).`,
  },
  {
    id: 30169, number: 169, division: "Theta", topic: "Probability", difficulty: 4, methods: [],
    question: String.raw`Angela has exactly one $1 bill, one $5 bill, one $10 bill, one $20 bill, one $50 bill and one $100 bill. She wants to give Bob and Casey all of her money so that the difference in the amounts she gives them differs by $25 or less. How many different ways can Angela give Bob and Casey her money?`,
    choices: ["8", "6", "4", "2", "NOTA"], answer: "B",
    solution: String.raw`The total is \(\$186\), so each person must receive between \(\$81\) and \(\$105\). The possible unordered splits are
\[\$81/\$105,\qquad \$85/\$101,\qquad \$86/\$100.\]
Each split can be assigned to Bob and Casey in two orders, giving \(3\cdot2=6\) ways.`,
  },
  {
    id: 30170, number: 170, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    question: String.raw`When the cubic function \(f(x)=9x^3-x+5\) is divided by \(g(x)=3x-2\), it approaches a quadratic function as \(x\) goes to positive infinity. What is the smallest positive integer value for \(x\) such that the height difference between \(f(x)\div g(x)\) and the quadratic equation it approaches is less than one?`,
    choices: ["2", "3", "4", "5", "NOTA"], answer: "C",
    solution: String.raw`Polynomial division gives
\[\frac{9x^3-x+5}{3x-2}=3x^2+2x+1+\frac7{3x-2}.\]
For positive \(x\), the height difference is \(\frac7{3x-2}\). Solving
\[\frac7{3x-2}<1\]
gives \(x>3\). Therefore, the smallest positive integer is \(x=4\).`,
  },
  {
    id: 30171, number: 171, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: [],
    question: String.raw`A mold grows exponentially and doubles its size every 4 years. If there is 100 grams of mold to begin with, which value or expression below represents how many grams of mold there will be after 7 years?`,
    choices: [String.raw`\(200\sqrt[4]{8}\)`, "350", String.raw`\(175\ln2\)`, "275", "NOTA"], answer: "A",
    solution: String.raw`With a doubling time of \(4\) years, the amount after \(7\) years is
\[100\cdot2^{7/4}=100\cdot2\cdot2^{3/4}=200\sqrt[4]{8}.\]`,
  },
  {
    id: 30172, number: 172, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: [],
    question: String.raw`What is the range of the function \(f(x)=\frac1{x^2-6x+14}-7\)?`,
    choices: [String.raw`\((-\frac{34}{5},\infty)\)`, String.raw`\([-7,\infty)\)`, String.raw`\([-\frac{34}{5},\infty)\)`, String.raw`\((-\frac{34}{5},-7)\)`, "NOTA"], answer: "E",
    solution: String.raw`Complete the square:
\[x^2-6x+14=(x-3)^2+5.\]
The reciprocal term has range \((0,\frac15]\). Subtracting \(7\) gives
\[\left(-7,-\frac{34}{5}\right].\]
This interval is not listed, so the answer is NOTA.`,
  },
  {
    id: 30173, number: 173, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    question: String.raw`What is the area between the \(x\)-axis and the function \(f(x)=|6-2x|\) between the \(x\) values (vertical lines) of \(x=-1\) and \(x=5\)?`,
    choices: ["12", "20", "24", "40", "NOTA"], answer: "B",
    solution: String.raw`The graph meets the \(x\)-axis at \(x=3\). From \(x=-1\) to \(x=3\), it forms a triangle with base \(4\) and height \(8\), having area \(16\). From \(x=3\) to \(x=5\), it forms a triangle with base \(2\) and height \(4\), having area \(4\). The total area is \(16+4=20\).`,
  },
  {
    id: 30174, number: 174, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Substitution"],
    question: String.raw`Alex was digging a hole in his yard when he thought: "I've dug half of the depth of this hole. I'm 70 inches tall, and right now my head is above ground-level by a certain amount when I stand in the hole. When I am done digging this hole and stand in it, my head will be twice as far below ground-level as it is now above." What will be the hole's final depth?`,
    choices: ["100 inches", "105 inches", "110 inches", "115 inches", "NOTA"], answer: "B",
    solution: String.raw`Let \(x\) be the final depth and \(y\) the amount Alex's head is currently above ground level. Then
\[\frac12x+y=70,\qquad x-2y=70.\]
Solving the system gives \(x=105\) inches.`,
  },
  {
    id: 30175, number: 175, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    question: String.raw`The outer edge of a picture frame measures 14 cm by 20 cm and the picture inside the frame measures \(160\text{ cm}^2\). The frame forms a border that is the same width all around the picture in that there is a border of uniform width between the outer edge of the picture frame and the outer edge of the picture that is inside the frame. What is the width of this border?`,
    choices: ["1 cm", "2 cm", "3 cm", "4 cm", "NOTA"], answer: "B",
    solution: String.raw`If the border width is \(x\), then
\[(14-2x)(20-2x)=160.\]
Expanding and simplifying gives
\[x^2-17x+30=0=(x-15)(x-2).\]
The value \(x=15\) is impossible for a frame only \(14\) cm wide, so \(x=2\) cm.`,
  },
  {
    id: 30176, number: 176, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    question: String.raw`Find all values of \(x\) (in interval notation) such that
\[-x^2+10x-18>|3x-18|.\]`,
    choices: [String.raw`\((0,7)\)`, String.raw`\((4,7)\)`, String.raw`\((4,9)\)`, String.raw`\([0,7]\)`, "NOTA"], answer: "B",
    solution: String.raw`For \(x<6\), \(|3x-18|=-3x+18\), and the inequality reduces to
\[-x^2+13x-36>0,\]
which holds between its roots \(4\) and \(9\), giving \((4,6)\) in this case. For \(x\ge6\), the inequality becomes
\[-x^2+7x>0,\]
which gives \([6,7)\) in this case. Combining them gives \((4,7)\).`,
  },
  {
    id: 30177, number: 177, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`Which of the following expressions is equivalent to
\[\sqrt{a\cdot\sqrt[3]{a}\cdot\sqrt[4]{\sqrt[3]{a}}}\ ?\]`,
    choices: [String.raw`\(a^{15/16}\)`, String.raw`\(a^{1/24}\)`, String.raw`\(a^{17/24}\)`, String.raw`\(a^4\)`, "NOTA"], answer: "C",
    solution: String.raw`Writing each radical as an exponent, the expression is
\[\left(a\cdot a^{1/3}\cdot a^{1/12}\right)^{1/2}
=a^{(1+1/3+1/12)/2}
=a^{17/24}.\]`,
  },
  {
    id: 30178, number: 178, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`Alex is trying to fill her pool with water using 2 hoses. The first hose could fill her pool in 2 hours working alone and the second hose could fill her pool in 3 hours working alone. Suppose Alex uses both hoses to fill her pool, but she also leaves the drain open which can empty her entire pool in 4 hours. How many hours does it take for her pool to fill up under these conditions?`,
    choices: [String.raw`\(\frac7{12}\)`, String.raw`\(\frac{12}{7}\)`, String.raw`\(\frac56\)`, String.raw`\(\frac65\)`, "NOTA"], answer: "B",
    solution: String.raw`If \(t\) is the filling time, the rate equation is
\[\frac t2+\frac t3-\frac t4=1.\]
Thus \(\frac7{12}t=1\), so \(t=\frac{12}{7}\) hours.`,
  },
  {
    id: 30179, number: 179, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: [],
    question: String.raw`There are two numbers such that each one is sixteen times as large as four times its multiplicative inverse. What is the smaller of the two values of these two numbers?`,
    choices: ["-64", "-8", "8", "64", "NOTA"], answer: "B",
    solution: String.raw`Let one of the numbers be \(x\). The condition gives
\[\frac{x}{16}=\frac4x.\]
Cross-multiplying yields \(x^2=64\), so \(x=\pm8\). The smaller value is \(-8\).`,
  },
  {
    id: 30180, number: 180, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`The following diagram contains several circles that are connected by lines, with 3 circles to each line. The integers from 1 to 7 must be inserted, one number to a circle, such that the sum of the three numbers in each line is the same. Which number cannot be placed in the lower left circle?`,
    choices: ["3", "7", "2", "4", "NOTA"], answer: "D",
    solution: String.raw`If we represent the numbers in the circles with letters \(A\) through \(G\), and let the sum of each line be \(S\), the numbers 1 through 7 sum to 28. Therefore,
\[(A+B+E)+(A+C+F)+(A+D+G)=3S\Longrightarrow 2A+28=3S,\]
and
\[(B+C+D)+(E+F+G)=2S\Longrightarrow 28-A=2S.\]
Solving this system gives \(A=4\). Since the top circle must contain 4, no other circle, including the lower left circle, can contain 4.`,
    illustration: {
      src: "/questions/theta-180-circle-sum.svg",
      alt: "Seven empty circles connected along the sides and interior lines of a triangle.",
      width: 420,
      height: 230,
    },
  },
  {
    id: 30181, number: 181, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: [],
    question: String.raw`Solve for the sum of the values of \(x\):
\[x+9+4\sqrt{2x+3}=0\]`,
    choices: ["0", "3", "11", "14", "NOTA"], answer: "A",
    solution: String.raw`If we subtract \(x+9\) from both sides and square, we have
\[4\sqrt{2x+3}=-(x+9)\Longrightarrow16(2x+3)=x^2+18x+81\]
\[\Longrightarrow x^2-14x+33=0\Longrightarrow(x-11)(x-3)=0.\]
Our initial assessment would be that \(x=11\) and \(x=3\); however, both are extraneous when plugged back into the original equation. Therefore, with no solutions, the sum of the solutions is 0.`,
  },
  {
    id: 30182, number: 182, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`The combined area of the congruent two triangles, which each have two vertices on the circle and one vertex at the center of the circle, is \(5\sqrt3\). If \(m\widehat{BC}=m\widehat{AD}=60^\circ\), then what is the circumference of the circle?`,
    choices: [String.raw`\(5\pi\)`, String.raw`\(\pi\sqrt5\)`, String.raw`\(2\pi\sqrt{10}\)`, String.raw`\(\pi\sqrt{10}\)`, "NOTA"], answer: "C",
    solution: String.raw`Given the triangles are congruent, the central angles intercept congruent arcs. Since the remaining arcs of the circle \(m\widehat{BC}=m\widehat{AD}\) sum to \(120^\circ\), our two central angles are \(120^\circ\) each. If we drop a perpendicular from the center, we get four \(30^\circ-60^\circ-90^\circ\) triangles. For one of these triangles, \(2b=r\) and \(b\sqrt3=h\). Thus,
\[A=\frac{bh}{2}\Longrightarrow\frac{5\sqrt3}{4}=\frac{b^2\sqrt3}{2}
\Longrightarrow\frac52=b^2\Longrightarrow b=\frac{\sqrt{10}}2.\]
Therefore, the radius is \(\sqrt{10}\), and the circumference is \(2\pi\sqrt{10}\).`,
    illustration: {
      src: "/questions/theta-182-circle-chords.svg",
      alt: "A circle with upper chord BA, lower chord CD, and crossed segments BD and CA.",
      width: 380,
      height: 270,
    },
  },
  {
    id: 30183, number: 183, division: "Theta", topic: "Matrices", difficulty: 1, methods: ["Determinant"],
    question: String.raw`Find the determinant of the matrix:
\[\begin{bmatrix}4&3\\-9&10\end{bmatrix}\]`,
    choices: ["13", "-66", "-6", "-13", "NOTA"], answer: "E",
    solution: String.raw`The determinant of the \(2\times2\) matrix is
\[\begin{vmatrix}4&3\\-9&10\end{vmatrix}=(4)(10)-(3)(-9)=40-(-27)=67.\]
Since 67 is not listed, the answer is NOTA.`,
  },
  {
    id: 30184, number: 184, division: "Theta", topic: "Functions", difficulty: 4, methods: ["Substitution"],
    question: String.raw`Suppose \(f(x)\) is a real-valued function such that
\[5f\left(\frac1x\right)+\frac{f(2x)}{x^2}=x\]
for \(x\ne0\). Find \(f(1)\).`,
    choices: [String.raw`\(\frac3{10}\)`, String.raw`\(\frac1{21}\)`, String.raw`\(\frac17\)`, String.raw`\(\frac3{14}\)`, "NOTA"], answer: "D",
    solution: String.raw`To solve this functional equation, plug in \(x=1\) and \(x=\frac12\):
\[x=1\Longrightarrow5f(1)+f(2)=1,\]
\[x=\frac12\Longrightarrow5f(2)+4f(1)=\frac12.\]
Solving this system of equations yields \(f(1)=\frac3{14}\).`,
  },
  {
    id: 30185, number: 185, division: "Theta", topic: "Polynomials", difficulty: 1, methods: ["Remainder Theorem"],
    question: String.raw`If the function \(g(x)=x^3-4x^2+ax-12\) is divisible by \((x-3)\), find \(a^2\).`,
    choices: ["25", "49", "441", "625", "NOTA"], answer: "B",
    solution: String.raw`By the Remainder Theorem, \(g(3)=0\):
\[g(3)=3^3-4\cdot3^2+3a-12=-21+3a=0.\]
Thus \(a=7\), so \(a^2=49\).`,
  },
  {
    id: 30186, number: 186, division: "Theta", topic: "Statistics", difficulty: 2, methods: [],
    question: String.raw`For \(1<x<y\), let \(S=\{1,x,y,x+y\}\). Compute the absolute value of the difference between the mean and median of the set \(S\).`,
    choices: [String.raw`\(\frac14\)`, String.raw`\(\frac{y-1}{2}\)`, String.raw`\(x\)`, "1", "NOTA"], answer: "A",
    solution: String.raw`The mean is
\[\frac{1+x+y+(x+y)}4=\frac14+\frac{x+y}{2},\]
and the median is \(\frac{x+y}{2}\), so their absolute difference is \(\frac14\).`,
  },
  {
    id: 30187, number: 187, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    question: String.raw`Let \([x]\) represent the greatest integer function, also known as the floor function, which outputs the greatest integer less than or equal to \(x\). Compute the number of first quadrant ordered pairs \((x,y)\) that are solutions to the following system:
\[\begin{cases}x+[y]=5.3\\y+[x]=5.7\end{cases}\]`,
    choices: ["2", "4", "5", "6", "NOTA"], answer: "D",
    solution: String.raw`Let \(x=n+0.3\) and \(y=m+0.7\) for two nonnegative integers \(m\) and \(n\). Then \(m+n=5\), which gives 6 pairs: \((0.3,5.7)\), \((1.3,4.7)\), \((2.3,3.7)\), \((3.3,2.7)\), \((4.3,1.7)\), and \((5.3,0.7)\).`,
  },
  {
    id: 30188, number: 188, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`What is the domain of the function below?
\[f(x)=\frac{(x^2-4)\sqrt{9x^2-9}}{x-2}\]`,
    choices: [String.raw`\((-1,1)\)`, String.raw`\((-\infty,-1]\cup[1,\infty)\)`, String.raw`\((-\infty,-1]\cup[1,2)\cup(2,\infty)\)`, String.raw`\((1,2)\cup(2,\infty)\)`, "NOTA"], answer: "C",
    solution: String.raw`We can factor:
\[f(x)=\frac{(x-2)(x+2)\cdot3\sqrt{(x-1)(x+1)}}{x-2}
=3(x+2)\sqrt{(x-1)(x+1)},\qquad x\ne2.\]
The radicand requires \((x-1)(x+1)\ge0\), and the original denominator requires \(x\ne2\). Therefore, the domain is
\[(-\infty,-1]\cup[1,2)\cup(2,\infty).\]`,
  },
  {
    id: 30189, number: 189, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    question: String.raw`A right cone's ratio of its height to its radius is \(8:1\). The cone and a sphere have the same volume. What is the ratio of the radius of the sphere to the radius of the cone?`,
    choices: [String.raw`\(\sqrt[3]{2}\)`, String.raw`\(\sqrt2\)`, String.raw`\(\sqrt[3]{4}\)`, String.raw`\(\frac1{\sqrt[3]{2}}\)`, "NOTA"], answer: "A",
    solution: String.raw`Let the cone have radius \(r\) and height \(h=8r\). Then
\[V_{\text{cone}}=\frac13\pi r^2h=\frac83\pi r^3.\]
If the sphere has radius \(R\), then \(V_{\text{sphere}}=\frac43\pi R^3\). Equal volumes give
\[\frac83\pi r^3=\frac43\pi R^3\Longrightarrow2r^3=R^3
\Longrightarrow\frac Rr=\sqrt[3]{2}.\]`,
  },
  {
    id: 30190, number: 190, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Remainder Theorem"],
    question: String.raw`Let \(Q(x)\) be the quotient when \(20x^{26}-26x^{20}+6\) is divided by \(x-1\). Compute the sum of the coefficients of \(Q(x)\).`,
    choices: ["6", "20", "0", "520", "NOTA"], answer: "C",
    solution: String.raw`Write
\[P(x)=20(x^{26}-1)-26(x^{20}-1).\]
Using \(x^n-1=(x-1)(x^{n-1}+x^{n-2}+\cdots+1)\),
\[Q(x)=20(x^{25}+x^{24}+\cdots+1)-26(x^{19}+x^{18}+\cdots+1).\]
The sum of the coefficients is
\[Q(1)=20(26)-26(20)=0.\]`,
  },
  {
    id: 30191, number: 191, division: "Theta", topic: "Conic Sections", difficulty: 4, methods: ["Distance Formula"],
    question: String.raw`Let \(P\) be the parabola with vertex at the origin and directrix of \(y=-1\). Compute the number of lattice points on \(P\) whose distance to \((0,1)\) is less than or equal to 2026.`,
    choices: ["90", "46", "91", "181", "NOTA"], answer: "C",
    solution: String.raw`The equation of the parabola is
\[y=\frac{x^2}{4}.\]
Its lattice points can be written as \((2k,k^2)\), where \(k\) is an integer. The distance from \((2k,k^2)\) to \((0,1)\) is
\[d=\sqrt{(2k)^2+(k^2-1)^2}=\sqrt{k^4+2k^2+1}=k^2+1.\]
Thus \(k^2+1\le2026\), so \(-45\le k\le45\). There are 91 values of \(k\).`,
  },
  {
    id: 30192, number: 192, division: "Theta", topic: "Sequences", difficulty: 5, methods: ["Geometric Sequence"],
    question: String.raw`Three integers, \(a,b,\) and \(c\), form a sequence where there exists some ratio \(r\) such that \(ar=b\), \(br=c\). If
\[a+b+c=21\qquad\text{and}\qquad\frac1a+\frac1b+\frac1c=\frac7{12},\]
what is the sum of all possible values of \(a\)?`,
    choices: ["3", "9", "12", "15", "NOTA"], answer: "D",
    solution: String.raw`Rewrite the sequence in terms of \(b\): \(a=\frac br\) and \(c=br\). Factoring the common terms in the two given equations gives
\[b\left(\frac1r+1+r\right)=21\]
and
\[\frac1b\left(r+1+\frac1r\right)=\frac7{12}.\]
Therefore,
\[\frac{21}{b}=\frac1r+1+r=\frac{7b}{12},\]
so \(b^2=36\). The value \(b=-6\) would make \(r\) irrational and cannot produce integer \(a\) and \(c\), so \(b=6\). Now
\[\frac{21}{6}=\frac1r+1+r
\Longrightarrow2r^2-5r+2=0,\]
giving \(r=\frac12\) or \(r=2\). Since \(a=\frac br\), the possible values of \(a\) are 12 and 3, whose sum is 15.`,
  },
  {
    id: 30193, number: 193, division: "Theta", topic: "Geometry", difficulty: 4, methods: [],
    question: String.raw`Two concentric circles, shown below, are made such that a chord of the larger circle is trisected by the smaller circle. The length of the chord is 36, and the sum of the radii of the two circles is also 36. Find the smaller radius.`,
    choices: ["14", "12", "16", "15", "NOTA"], answer: "A",
    solution: String.raw`Let \(R\) be the radius of the larger circle, \(r\) the radius of the smaller circle, and \(a\) the perpendicular distance from the common center to the chord. The chord is divided into lengths \(12,12,12\), so
\[a^2+6^2=r^2,\qquad a^2+18^2=R^2.\]
Thus
\[r^2-6^2=R^2-18^2
\Longrightarrow288=R^2-r^2=(R+r)(R-r).\]
Since \(R+r=36\), \(R-r=8\). Solving the two equations gives \(r=14\).`,
    illustration: {
      src: "/questions/theta-193-concentric-chord.svg",
      alt: "Two concentric circles and a chord divided into three portions labeled 12.",
      width: 440,
      height: 310,
    },
  },
  {
    id: 30194, number: 194, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: [],
    question: String.raw`For a function \(f(x)=ab^x\), it is given that \(f(3)=6\) and \(f(6)=3\). Find \(b^{-a}\).`,
    choices: ["4", "8", "16", "32", "NOTA"], answer: "C",
    solution: String.raw`Because of the exponential nature of the function,
\[\frac{f(6)}{f(3)}=b^3=\frac12,\]
so \(b=2^{-1/3}\). Also, \(a=\frac6{b^3}=12\). Therefore,
\[b^{-a}=(2^{-1/3})^{-12}=2^4=16.\]`,
  },
  {
    id: 30195, number: 195, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`In base-\(n\), \(524_n+312_n=1240_n\). If the same equation in base-10 is \(a+b=c\), find the sum of the digits of \(a\), \(b\), and \(c\).`,
    choices: ["18", "21", "24", "30", "NOTA"], answer: "D",
    solution: String.raw`Converting each number to base 10 gives
\[524_n=5n^2+2n+4,\quad312_n=3n^2+n+2,\quad1240_n=n^3+2n^2+4n.\]
Therefore,
\[8n^2+3n+6=n^3+2n^2+4n,\]
so
\[n^3-6n^2+n-6=(n^2+1)(n-6)=0.\]
The only valid base is \(n=6\). Thus
\[524_6=196,\qquad312_6=116,\qquad1240_6=312.\]
The sum of all digits of \(a\), \(b\), and \(c\) is 30.`,
  },
  {
    id: 30196, number: 196, division: "Theta", topic: "Sequences", difficulty: 5, methods: [],
    question: String.raw`The sum of 2027 positive numbers in an increasing arithmetic progression is 1. If the width of the smallest interval that contains all possible values of the common difference is equal to \(\frac1K\), find the value of the last two digits of \(K\).`,
    choices: ["1", "51", "81", "21", "NOTA"], answer: "B",
    solution: String.raw`Suppose \(x\) is the first term and \(d\) is the common difference. Then
\[x+(x+d)+\cdots+(x+2026d)=1,\]
so
\[\frac{2027}{2}(2x+2026d)=1
\Longrightarrow x+1013d=\frac1{2027}.\]
Because all terms are positive and the progression is increasing,
\[0<d<\frac1{2027\cdot1013}.\]
The width is \(\frac1K=\frac1{2027\cdot1013}\). Therefore,
\[K\equiv27\cdot13\equiv51\pmod{100}.\]`,
  },
  {
    id: 30197, number: 197, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`A semicircle with radius \(\overline{DC}\) is inscribed in a right triangle \(ABC\) as shown. The semicircle is tangent to \(\overline{AB}\). If \(AB=10\) and \(AC=4\), find the length of \(\overline{BD}-\overline{DC}\).`,
    choices: [String.raw`\(\frac67\sqrt{21}\)`, String.raw`\(\frac76\sqrt{21}\)`, "18", String.raw`\(\frac37\sqrt{21}\)`, "NOTA"], answer: "A",
    solution: String.raw`First compute the length of \(BC\):
\[BC=\sqrt{AB^2-AC^2}=\sqrt{10^2-4^2}=2\sqrt{21}.\]
For this configuration,
\[BD-DC=BC\cdot\frac{AB-AC}{AB+AC}.\]
This follows from similar triangles formed using the point where the semicircle is tangent to \(\overline{AB}\). Substituting,
\[BD-DC=2\sqrt{21}\cdot\frac{10-4}{10+4}
=\frac67\sqrt{21}.\]`,
    illustration: {
      src: "/questions/theta-197-semicircle-triangle.svg",
      alt: "Right triangle ABC containing a semicircle on segment DC tangent to side AB.",
      width: 390,
      height: 380,
    },
  },
  {
    id: 30198, number: 198, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: [],
    question: String.raw`Given the system
\[\begin{cases}xy+9=y^2\\xy+7=x^2,\end{cases}\]
find the sum of the absolute values of all coordinates of the solutions.`,
    choices: ["4", "8", String.raw`\(\frac{17}{4}\)`, "0", "NOTA"], answer: "B",
    solution: String.raw`Subtracting the equations gives
\[y^2-x^2=2\Longrightarrow(x+y)(x-y)=-2.\]
Adding the equations gives
\[2xy+16=x^2+y^2\Longrightarrow(x-y)^2=16,\]
so \(x-y=\pm4\). The solutions are
\[\left(\frac74,-\frac94\right)\quad\text{and}\quad\left(-\frac74,\frac94\right).\]
The sum of the absolute values of all coordinates is 8.`,
  },
  {
    id: 30199, number: 199, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Logarithms"],
    question: String.raw`Find the product of all solutions to the equation
\[\sqrt{\frac{\log\sqrt{3x}}{\log x}}\cdot\frac{\log x}{\log3}=-1.\]`,
    choices: ["1", String.raw`\(\frac13\)`, String.raw`\(\frac19\)`, "3", "NOTA"], answer: "C",
    solution: String.raw`Squaring and simplifying gives
\[\frac{\log\sqrt{3x}}{\log x}=\left(\frac{\log3}{\log x}\right)^2.\]
Let \(a=\frac{\log3}{\log x}\). Since
\[\frac{\log\sqrt{3x}}{\log x}=\frac12(a+1),\]
we get
\[a+1=2a^2\Longrightarrow(2a+1)(a-1)=0.\]
Thus \(a=-\frac12\) or \(a=1\), giving \(x=\frac19\) or \(x=3\). However, \(x=3\) is extraneous in the original equation because its left side is positive. The product of all solutions is \(\frac19\).`,
  },
  {
    id: 30200, number: 200, division: "Theta", topic: "Polynomials", difficulty: 5, methods: [],
    question: String.raw`A quartic polynomial \(P(x)\) with real coefficients satisfies \(P(1)=0\) and attains a maximum value of 3 at both \(x=2\) and \(x=3\). Compute \(P(5)\).`,
    choices: ["-24", "-21", "-12", "-6", "NOTA"], answer: "A",
    solution: String.raw`Consider \(Q(x)=P(x)-3\). It has roots at \(x=2\) and \(x=3\). Because both points are maxima, each is a double root, so
\[Q(x)=a(x-2)^2(x-3)^2.\]
Hence \(P(x)=a(x-2)^2(x-3)^2+3\). Since \(P(1)=0\), \(a=-\frac34\). Therefore,
\[P(5)=-\frac34(5-2)^2(5-3)^2+3=-24.\]`,
  },
  {
    id: 30201, number: 201, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Tangency"],
    question: String.raw`Two circles \(O_1\) and \(O_2\) are tangent to each other, and the radius of circle \(O_1\) is 1. Points \(A\), \(B\), and \(P\) are such that \(P\) lies on line \(O_1O_2\), ray \(PA\) is tangent to circle \(O_1\) at \(A\) and to circle \(O_2\) at \(B\), and \(A\) is the midpoint of \(PB\). Find the area of quadrilateral \(AO_1O_2B\).`,
    choices: ["3", String.raw`\(2\sqrt3\)`, String.raw`\(3\sqrt2\)`, String.raw`\(2\sqrt6\)`, "NOTA"], answer: "C",
    solution: String.raw`Radii \(\overline{O_1A}\) and \(\overline{O_2B}\) are both perpendicular to ray \(PA\), so \(\triangle PO_1A\sim\triangle PO_2B\). Since \(PA=AB=\frac{PB}{2}\), the constant of proportionality is \(\frac12\). Thus \(PO_1=O_1O_2=3\), and
\[PA=\sqrt{PO_1^2-O_1A^2}=\sqrt{3^2-1^2}=2\sqrt2.\]
Quadrilateral \(AO_1O_2B\) is a trapezoid with bases 1 and 2 and height \(2\sqrt2\), so its area is
\[\frac{1+2}{2}\cdot2\sqrt2=3\sqrt2.\]`,
    illustration: {
      src: "/questions/theta-201-tangent-circles.svg",
      alt: "Two externally tangent circles with centers O1 and O2 and common rays from P through the centers and tangent points A and B.",
      width: 620,
      height: 300,
    },
  },
  {
    id: 30202, number: 202, division: "Theta", topic: "Number Theory", difficulty: 3, methods: ["Modular Arithmetic"],
    question: String.raw`If the number \(A8640543981270644B\) is divisible by 99, compute \(A^2+B^2\).`,
    choices: ["81", "82", "100", "32", "NOTA"], answer: "B",
    solution: String.raw`Using the divisibility-by-11 rule,
\[(A+6+0+4+9+1+7+6+4)-(8+4+5+3+8+2+0+4+B)\equiv0\pmod{11},\]
which gives \(A-B\equiv8\pmod{11}\). Divisibility by 9 gives
\[71+A+B\equiv0\pmod9,\]
so \(A+B\equiv1\pmod9\). Since \(A\) and \(B\) are digits, the only possibility is \(A=9\) and \(B=1\). Therefore, \(A^2+B^2=82\).`,
  },
  {
    id: 30203, number: 203, division: "Theta", topic: "Simplification", difficulty: 4, methods: [],
    question: String.raw`If \((a^2+b^2)^3=(a^3+b^3)^2\) and \(ab\ne0\), find the numerical value of
\[\frac ab+\frac ba.\]`,
    choices: ["1", String.raw`\(\frac23\)`, String.raw`\(\frac8{27}\)`, "Cannot Be Determined", "NOTA"], answer: "B",
    solution: String.raw`Expanding gives
\[a^6+3a^4b^2+3a^2b^4+b^6=a^6+2a^3b^3+b^6,\]
so \(3a^4b^2+3a^2b^4=2a^3b^3\). Since \(ab\ne0\), divide by \(a^2b^2\):
\[3a^2+3b^2=2ab.\]
Dividing by \(3ab\) gives
\[\frac ab+\frac ba=\frac23.\]`,
  },
  {
    id: 30204, number: 204, division: "Theta", topic: "Probability", difficulty: 2, methods: [],
    question: String.raw`A lottery cost \(\$7\) to play. The probability of winning a \(\$28\) payout is \(\frac27\). Otherwise, there is no payout. What is the expected value of the lottery?`,
    choices: ["$0.80", "$1.00", "$1.40", "$3.00", "NOTA"], answer: "B",
    solution: String.raw`The net payout for winning is \(\$21\), while the net payout for losing is \(-\$7\). Therefore, the expected value is
\[21\cdot\frac27+(-7)\cdot\frac57=\$1.00.\]`,
  },
  {
    id: 30205, number: 205, division: "Theta", topic: "Probability", difficulty: 3, methods: [],
    question: String.raw`A card game is played with these rules: a card is drawn from a standard deck (no jokers). If the card is a face card, you win \(\$10\). If the card is a prime number, you win \(\$8\). Otherwise, you lose \(\$12\). Find the expected value of the game.`,
    choices: ["$0", String.raw`\(-\$\frac{10}{13}\)`, String.raw`\(-\$\frac5{13}\)`, String.raw`\(\$\frac8{13}\)`, "NOTA"], answer: "B",
    solution: String.raw`In a standard deck, the face cards are \(J,Q,K\): 3 per suit, so 12 total. Prime number cards are \(2,3,5,7\): 4 ranks times 4 suits, so 16 cards. These categories do not overlap. The remaining 24 cards lose. Therefore,
\[E=10\cdot\frac{12}{52}+8\cdot\frac{16}{52}-12\cdot\frac{24}{52}
=-\frac{10}{13}\text{ dollars}.\]`,
  },
  {
    id: 30206, number: 206, division: "Theta", topic: "Probability", difficulty: 4, methods: [],
    question: String.raw`A digital watch displays the digits from 0 to 9 as shown below by displaying some subset of the seven segments which make up an 8 as shown at the right. If a randomly chosen segment fails to light up, compute the expected value of the number of digits that can still be displayed.`,
    choices: ["3", String.raw`\(\frac{19}{7}\)`, String.raw`\(\frac{18}{7}\)`, String.raw`\(\frac{22}{7}\)`, "NOTA"], answer: "D",
    solution: String.raw`For each digit, count how many single segments could fail while still allowing that digit to be displayed:
\[\begin{array}{c|cccccccccc}
\text{Digit}&0&1&2&3&4&5&6&7&8&9\\\hline
\text{Possible failed segments}&1&5&2&2&3&2&1&4&0&2
\end{array}\]
Averaging over the seven equally likely failed segments gives
\[\frac{1+5+2+2+3+2+1+4+0+2}{7}=\frac{22}{7}.\]`,
    illustration: {
      src: "/questions/theta-206-seven-segment.svg",
      alt: "The digits zero through nine represented by a simplified seven-segment display, with dashed segments showing possible failures.",
      width: 900,
      height: 245,
    },
  },
  {
    id: 30207, number: 207, division: "Theta", topic: "Probability", difficulty: 4, methods: [],
    question: String.raw`A six-sided die has these markings on its sides: \(\$12\), \(\$12\), \(\$16\), \(\$16\), \(\$26\), and \(\$26\). The following game is played. The die is rolled and the player wins whatever amount of money comes up. The player keeps rolling the die and winning money until a money amount comes up a second time, in which case the game ends. A sample game would be rolls of \(\$16\), \(\$12\), and \(\$16\), in which case the player wins \(\$44\). Compute the expected winnings by the player in this game.`,
    choices: ["36", "44", "52", "60", "NOTA"], answer: "C",
    solution: String.raw`The expected amount earned per throw is \(\$18\), the average of the values on the faces. The game ends in 2 to 4 throws. Two throws occur with probability \(\frac13\). Three throws occur with probability \(\frac49\), and four throws occur with probability
\[1-\frac13-\frac49=\frac29.\]
Thus, the expected number of throws is
\[2\cdot\frac13+3\cdot\frac49+4\cdot\frac29=\frac{26}{9}.\]
The expected winnings are \(\frac{26}{9}\cdot18=\$52\).`,
  },
  {
    id: 30208, number: 208, division: "Theta", topic: "Number Theory", difficulty: 5, methods: [],
    question: String.raw`What is the greatest possible integer that always divides \(n^3(n^2-1)(n^2-4)\), given \(n\) is a positive integer greater than 2026?`,
    choices: ["360", "180", "120", "40", "NOTA"], answer: "A",
    solution: String.raw`Factoring in a particular way gives
\[n^3(n^2-1)(n^2-4)=n^2(n-2)(n-1)n(n+1)(n+2).\]
This contains five consecutive integers, so it is divisible by 5. It contains four consecutive integers and an extra factor of \(n\), ensuring divisibility by 8, and the factors \((n-2)(n-1)n\) and \(n(n+1)(n+2)\) each ensure a factor of 3, so the product is divisible by 9. Therefore, it is always divisible by \(5\cdot8\cdot9=360\). The greatest common divisor of the expression's values at \(n=2027,2028,\ldots,2032\) is 360, so no larger integer can always divide it.`,
  },
  {
    id: 30209, number: 209, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    question: String.raw`Chloe informed me that it was perfect square day on September 16th, 2025, because the date reads \(9/16/25\) in order! I retorted that it wouldn't be in order in most of the world. However, September 27th, 2025 would be an even more perfect square day because the numbers \(9{,}272{,}025\) and \(27{,}092{,}025\) are both perfect squares and most countries that use the Gregorian calendar could celebrate. What is the sum of the square roots of those numbers?`,
    choices: ["8,110", "8,250", "8,350", "9,150", "NOTA"], answer: "B",
    solution: String.raw`\[\sqrt{9{,}272{,}025}=3045\qquad\text{and}\qquad
\sqrt{27{,}092{,}025}=5205.\]
Therefore, \(3045+5205=8250\).`,
  },
  // FAMAT State Convention 2025, Theta Individual.
  {
    id: 30210, number: 210, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: [],
    question: String.raw`If \(8x-4y=7\) and \(x-2y=5\), find the value of \(x+y\).`,
    choices: [String.raw`\(-\frac{15}{7}\)`, String.raw`\(-\frac{13}{4}\)`, String.raw`\(\frac{15}{7}\)`, String.raw`\(\frac{13}{4}\)`, "NOTA"], answer: "B",
    solution: String.raw`Subtracting twice the second equation from the first equation eliminates the \(y\), leaving
\[6x=-3\Longrightarrow x=-\frac12.\]
Plugging this into the first equation yields \(-4y=11\Longrightarrow y=-\frac{11}{4}\). Thus
\[-\frac12+\left(-\frac{11}{4}\right)=\boxed{-\frac{13}{4}}.\]`,
  },
  {
    id: 30211, number: 211, division: "Theta", topic: "Functions", difficulty: 1, methods: ["Inverse Functions", "Nested Functions"],
    question: String.raw`If \(f(x)=4x^2-12x\), \(g(x)=47-3x\), and \(h(x)=\sqrt{x}\), find the value of \(f\bigl(g(h^{-1}(4))\bigr)\).`,
    choices: ["16", "-8", "4", "6232", "NOTA"], answer: "A",
    solution: String.raw`\[f\bigl(g(h^{-1}(4))\bigr)=f(g(16))=f(-1)=\boxed{16}.\]`,
  },
  {
    id: 30212, number: 212, division: "Theta", topic: "Geometry", difficulty: 4, methods: [],
    question: String.raw`A right triangle has one interior angle that is four times as large as another interior angle. Find the largest possible value, in degrees, of the smallest interior angle of such a triangle.`,
    choices: [String.raw`\(15^\circ\)`, String.raw`\(16^\circ\)`, String.raw`\(18^\circ\)`, String.raw`\(20^\circ\)`, "NOTA"], answer: "E",
    solution: String.raw`Call the two angles mentioned in the problem \(x\) and \(4x\). The angle \(4x\) is either the larger acute angle or the right angle. In the first scenario, \(4x+x+90^\circ=180^\circ\), so \(x=18^\circ\), which is the smallest interior angle. In the second scenario, \(4x=90^\circ\), so \(x=22.5^\circ\), which is the smallest interior angle. Therefore, the largest possible smallest interior angle is \(22.5^\circ\), so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30213, number: 213, division: "Theta", topic: "Algebra", difficulty: 1, methods: [],
    question: String.raw`Solve for \(x\): \(x+x+\cdots+x=1369\), where \(x\) copies of \(x\) are being summed on the left side of the equation.`,
    choices: ["31", "33", "37", "39", "NOTA"], answer: "C",
    solution: String.raw`This equation is \(x^2=1369\), and since \(x\) is being used as a quantity number, \(x\ge0\). Therefore, \(\boxed{x=37}\).`,
  },
  {
    id: 30214, number: 214, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: [],
    question: String.raw`Take a complex number with positive imaginary part, and consider four new complex numbers: the original number added to itself, the original number subtracted from itself, the original number multiplied by itself, and the original number divided by itself. When the four new complex numbers are added together, the result is \(-4\). What was the original complex number?`,
    choices: [String.raw`\(2i\)`, String.raw`\(1+2i\)`, String.raw`\(-1+2i\)`, String.raw`\(1+i\)`, "NOTA"], answer: "C",
    solution: String.raw`Let \(x\) be the original complex number; the four new complex numbers would then be \(x+x=2x\), \(x-x=0\), \(x\cdot x=x^2\), and \(x/x=1\). Thus
\[-4=2x+0+x^2+1=(x+1)^2,\]
so \(x+1=2i\) since the imaginary part was positive. Therefore, \(\boxed{x=-1+2i}\).`,
  },
  {
    id: 30215, number: 215, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`\(ABCD\) is a square, \(E\) is the midpoint of side \(BC\), and \(F\) is the intersection of line segment \(DE\) and diagonal \(AC\). Find the ratio of the area enclosed by triangle \(CEF\) to that of quadrilateral \(ABEF\).`,
    choices: ["2:9", "1:6", "2:11", "1:5", "NOTA"], answer: "D",
    solution: String.raw`Let \(A,B,C,D\) be at \((0,2),(2,2),(2,0),(0,0)\), respectively; this puts \(E\) at \((2,1)\), and line segment \(DE\) has equation \(y=\frac12x\). Diagonal \(AC\) has equation \(y=2-x\), so for \(F\), \(\frac12x=2-x\Longrightarrow x=\frac43\Longrightarrow y=\frac23\). The area enclosed by triangle \(CEF\) is \(\frac13\), and the area enclosed by quadrilateral \(ABEF\) is \(\frac53\), so the ratio of those areas is \(\frac13:\frac53=\boxed{1:5}\).`,
  },
  {
    id: 30216, number: 216, division: "Theta", topic: "Geometry", difficulty: 2, methods: ["Pythagorean Theorem"],
    question: String.raw`A right triangle has legs with lengths 476 and 765. Find the length of the triangle's hypotenuse.`,
    choices: ["881", "899", "901", "919", "NOTA"], answer: "C",
    solution: String.raw`\(476=28\cdot17\) and \(765=45\cdot17\), and since \(28\text{-}45\text{-}53\) is a primitive Pythagorean triple, the hypotenuse has length \(53\cdot17=\boxed{901}\).`,
  },
  {
    id: 30217, number: 217, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Asymptotes"],
    question: String.raw`Find the non-linear asymptote of the function \(y=\frac{x^4}{(x+1)(x-2)}\).`,
    choices: [String.raw`\(y=x^2+x+3\)`, String.raw`\(y=x^2-x+3\)`, String.raw`\(y=x^2+x-3\)`, String.raw`\(y=x^2-x-3\)`, "NOTA"], answer: "A",
    solution: String.raw`\[\frac{x^4}{(x+1)(x-2)}=x^2+x+3+\frac{5x+6}{(x+1)(x-2)}.\]
Because the remainder after this polynomial division is nonzero, the non-linear asymptote is the quotient: \(\boxed{y=x^2+x+3}\).`,
  },
  {
    id: 30218, number: 218, division: "Theta", topic: "Derivatives", difficulty: 1, methods: ["Power Rule"],
    question: String.raw`A significant topic in calculus is that of derivatives of functions. One important result in the study of derivatives is that if \(f(x)=x^n\), where \(n\) is a real number, then the derivative \(f'(x)\) of this function is given by \(f'(x)=n\cdot x^{n-1}\). If \(f(x)=x^4\), find the value of \(f'(-2)\).`,
    choices: ["16", "64", "-16", "-64", "NOTA"], answer: "E",
    solution: String.raw`\[f'(x)=4x^3\Longrightarrow f'(-2)=4(-2)^3=-32.\]
Thus the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30219, number: 219, division: "Theta", topic: "Derivatives", difficulty: 3, methods: ["Power Rule"],
    question: String.raw`A significant topic in calculus is that of derivatives of functions. One important result in the study of derivatives is that if \(f(x)=x^n\), where \(n\) is a real number, then the derivative \(f'(x)\) of this function is given by \(f'(x)=n\cdot x^{n-1}\). If \(g(x)=\frac{1}{x\sqrt[3]{x}}\), find the value of \(g'(-8)\).`,
    choices: [String.raw`\(\frac38\)`, String.raw`\(-\frac38\)`, String.raw`\(\frac1{96}\)`, String.raw`\(-\frac1{96}\)`, "NOTA"], answer: "C",
    solution: String.raw`\[g(x)=x^{-4/3}\Longrightarrow g'(x)=-\frac43x^{-7/3}\Longrightarrow g'(-8)=-\frac43(-8)^{-7/3}=\frac1{96}.\]`,
  },
  {
    id: 30220, number: 220, division: "Theta", topic: "Sequences", difficulty: 3, methods: ["Recursion"],
    question: String.raw`A sequence of integers is defined by the rule that any term in the sequence is the sum of the two immediate preceding terms, similarly to how the Fibonacci sequence is defined. The 532nd term in this sequence is 10, and the 537th term in this sequence is 15. Find the least possible absolute value of a term in this sequence.`,
    choices: ["0", "1", "3", "4", "NOTA"], answer: "C",
    solution: String.raw`Call the 533rd term of the sequence \(a\). Then the 534th through 537th terms are \(10+a\), \(10+2a\), \(20+3a\), and \(30+5a\), respectively. Therefore, \(30+5a=15\Longrightarrow a=-3\), which makes the sequence \(\ldots,10,-3,7,4,11,15,\ldots\). Going forward in the sequence, terms are all positive and continue to get larger. Going backward, terms alternate between positive and negative, and their magnitudes continue to get larger. Therefore, the least possible absolute value is \(\boxed3\).`,
  },
  {
    id: 30221, number: 221, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`Two integers \(a\) and \(b\) satisfy the condition \(ab=6a+8b\). How many such ordered pairs \((a,b)\) of integers exist?`,
    choices: ["16", "20", "28", "32", "NOTA"], answer: "B",
    solution: String.raw`\[ab=6a+8b\Longrightarrow ab-6a-8b+48=48\Longrightarrow(a-8)(b-6)=48.\]
Since \(48=2^4\cdot3\), there are \((4+1)(1+1)=10\) ordered pairs of positive factors. Both factors can be negative as well, so there are \(\boxed{20}\) ordered pairs of integers \((a,b)\).`,
  },
  {
    id: 30222, number: 222, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`Two integers \(a\) and \(b\) satisfy the condition \(ab=6a+8b\). Among these ordered pairs, what is the least possible product \(ab\)?`,
    choices: ["-294", "-200", "-108", "-64", "NOTA"], answer: "A",
    solution: String.raw`Since \((a-8)(b-6)=48\), a negative product \(ab\) requires one of \(a\) and \(b\) to be positive and the other negative. Checking the negative factor pairs of 48 gives the possible products
\[-294,-108,-50,-24,-4,0,-8,-24,-64,-200.\]
The least possible product is \(\boxed{-294}\).`,
  },
  {
    id: 30223, number: 223, division: "Theta", topic: "Logs and Exponents", difficulty: 5, methods: ["Change of Base"],
    question: String.raw`The function \(y=a\cdot x^b\), where \(a\) and \(b\) are real numbers, passes through the points \((6,5)\) and \((18,25)\). If \(\log_5a=\log_3c\), find the value of \(c\).`,
    choices: [String.raw`\(\frac52\)`, String.raw`\(\frac25\)`, "2", String.raw`\(\frac12\)`, "NOTA"], answer: "D",
    solution: String.raw`The two points give \(25=a(18)^b\) and \(5=a(6)^b\). Dividing yields \(5=3^b\), so \(b=\log_3 5\). Then
\[\log_5a=\log_5\left(\frac5{6^b}\right)=1-\log_3 6=\log_3\left(\frac12\right).\]
Therefore, \(\log_3c=\log_3\left(\frac12\right)\), and \(\boxed{c=\frac12}\).`,
  },
  {
    id: 30224, number: 224, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms", "Rational Root Theorem"],
    question: String.raw`Find the sum of the solutions to the equation \(\log_x(6x^2-3x-10)=3\).`,
    choices: ["6", "7", "8", "10", "NOTA"], answer: "B",
    solution: String.raw`The exponential form of this equation is
\[x^3=6x^2-3x-10\Longrightarrow x^3-6x^2+3x+10=(x-5)(x-2)(x+1)=0.\]
The logarithm's base must be positive and cannot equal 1, so only 2 and 5 are solutions. Their sum is \(\boxed7\).`,
  },
  {
    id: 30225, number: 225, division: "Theta", topic: "Geometry", difficulty: 3, methods: ["Tangency"],
    question: String.raw`In this diagram, three congruent circles are all pairwise externally tangent to each other, and all three are contained within and tangent to a rectangle. The two lower circles are tangent to exactly two sides of the rectangle, and the upper circle is tangent to exactly one side of the rectangle. If the circles each have a radius of length \(\sqrt3-1\) inches, find the area, in square inches, enclosed by the rectangle.`,
    choices: [String.raw`\(6\sqrt3\)`, String.raw`\(8\sqrt3\)`, "6", "8", "NOTA"], answer: "D",
    solution: String.raw`Call the radius of any of the circles \(r\). The horizontal side length of the rectangle is \(4r\). The centers form an equilateral triangle of side \(2r\), whose altitude is \(r\sqrt3\), so the vertical side length of the rectangle is \((2+\sqrt3)r\). Thus its area is
\[4(2+\sqrt3)r^2=4(2+\sqrt3)(\sqrt3-1)^2=\boxed8.\]`,
    illustration: {
      src: "/questions/theta-225-three-circles.svg",
      alt: "Three congruent pairwise tangent circles inside a rectangle, with two circles along the bottom and one centered above them touching the top.",
      width: 520,
      height: 470,
    },
  },
  {
    id: 30226, number: 226, division: "Theta", topic: "Analytic Geometry", difficulty: 3, methods: [],
    question: String.raw`Find the area of the region enclosed by the graphs of \(y=x\), \(y=-x\), and \(y=-6x-10\).`,
    choices: [String.raw`\(\frac{20}{7}\)`, String.raw`\(\frac{24}{7}\)`, String.raw`\(\frac{30}{7}\)`, String.raw`\(\frac{34}{7}\)`, "NOTA"], answer: "A",
    solution: String.raw`The intersections are \((0,0)\), \((-2,2)\), and \(\left(-\frac{10}{7},\frac{10}{7}\right)\). Since \(y=x\) and \(y=-x\) are perpendicular, the region is a right triangle whose legs have lengths \(2\sqrt2\) and \(\frac{10\sqrt2}{7}\). Therefore, its area is
\[\frac12(2\sqrt2)\left(\frac{10\sqrt2}{7}\right)=\boxed{\frac{20}{7}}.\]`,
  },
  {
    id: 30227, number: 227, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant"],
    question: String.raw`Evaluate:
\[\begin{vmatrix}4&-2&1\\-5&-2&0\\0&3&5\end{vmatrix}.\]`,
    choices: ["5", "-5", "105", "-105", "NOTA"], answer: "D",
    solution: String.raw`Expanding the determinant gives
\[(-40)+0+(-15)-0-0-50=\boxed{-105}.\]`,
  },
  {
    id: 30228, number: 228, division: "Theta", topic: "Algebra", difficulty: 3, methods: ["Absolute Value"],
    question: String.raw`Consider the equation \(\left|\left|\left|\left|x-1\right|-2\right|-3\right|-2\right|=1\). How many real numbers satisfy the equation?`,
    choices: ["8", "9", "15", "16", "NOTA"], answer: "B",
    solution: String.raw`Working from the outside inward gives
\[\left|\left|x-1\right|-2\right|-3=1\text{ or }3,\]
then \(\left|x-1\right|-2=2,4,0,\) or \(6\), and then \(\left|x-1\right|=0,2,4,6,\) or \(8\). The resulting values are
\[x=1,-1,3,-3,5,-5,7,-7,9,\]
which is a total of \(\boxed9\) solutions.`,
  },
  {
    id: 30229, number: 229, division: "Theta", topic: "Algebra", difficulty: 3, methods: ["Absolute Value"],
    question: String.raw`Consider the equation \(\left|\left|\left|\left|x-1\right|-2\right|-3\right|-2\right|=1\). Find the sum of the real solutions to the equation.`,
    choices: ["8", "9", "15", "16", "NOTA"], answer: "B",
    solution: String.raw`The solutions are \(1,-1,3,-3,5,-5,7,-7,9\). Their sum is \(\boxed9\).`,
  },
  {
    id: 30230, number: 230, division: "Theta", topic: "Polynomials", difficulty: 5, methods: [],
    question: String.raw`The polynomial \(3x^4-8x^3-5x^2+16x-5\) can be factored as \((ax^2+bx+c)(dx^2+ex+f)\), where \(a,b,c,d,e,\) and \(f\) are all integers, and \(a,d>0\). Additionally, both quadratic factors are irreducible over integers. Find the value of \(a+b+c+d+e+f\).`,
    choices: ["-2", "-1", "1", "2", "NOTA"], answer: "A",
    solution: String.raw`The factorization is
\[3x^4-8x^3-5x^2+16x-5=(3x^2+x-5)(x^2-3x+1).\]
Both factors are irreducible over the integers, and the requested sum is
\[3+1-5+1-3+1=\boxed{-2}.\]`,
  },
  {
    id: 30231, number: 231, division: "Theta", topic: "Applications of Integration", difficulty: 4, methods: ["Riemann Sums"],
    question: String.raw`In calculus, we sometimes use rectangles to estimate the area of a region. For example, if I wanted to estimate the area in the first quadrant bounded by the \(x\)- and \(y\)-axes and the graph of \(x^2+y^2=100\), I might create five non-overlapping rectangles whose bases, all of which have length 2 units, lie on the \(x\)-axis. The heights of these rectangles will extend from the \(x\)-axis to the graph of \(x^2+y^2=100\) as measured from the left endpoint of each of the rectangle's bases. Determine this approximation for the area of this region.`,
    choices: [String.raw`\(28+8\sqrt6+4\sqrt{21}\)`, String.raw`\(36+12\sqrt6+4\sqrt{21}\)`, String.raw`\(48+8\sqrt6+4\sqrt{21}\)`, String.raw`\(36+8\sqrt6+6\sqrt{21}\)`, "NOTA"], answer: "C",
    solution: String.raw`The bases are \([0,2],[2,4],[4,6],[6,8],\) and \([8,10]\), so the left-endpoint heights are \(10,4\sqrt6,2\sqrt{21},8,\) and \(6\), respectively. Since each base has length 2, the approximation is
\[2(10+4\sqrt6+2\sqrt{21}+8+6)=\boxed{48+8\sqrt6+4\sqrt{21}}.\]`,
  },
  {
    id: 30232, number: 232, division: "Theta", topic: "Matrices", difficulty: 4, methods: ["Matrix Inverse", "Matrix Multiplication"],
    question: String.raw`Solve for matrix \(A\):
\[A\begin{bmatrix}5&1\\2&1\end{bmatrix}=\begin{bmatrix}7&-1\\9&3\end{bmatrix}.\]`,
    choices: [String.raw`\(\begin{bmatrix}-\frac23&-\frac43\\\frac{31}{3}&\frac{17}{3}\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}-12&5\\-14&5\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}-\frac{17}{3}&\frac{11}{3}\\-\frac23&-\frac43\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}\frac{17}{3}&-\frac{11}{3}\\\frac23&\frac43\end{bmatrix}\)`, "NOTA"], answer: "E",
    solution: String.raw`The inverse of \(\begin{bmatrix}5&1\\2&1\end{bmatrix}\) is \(\frac13\begin{bmatrix}1&-1\\-2&5\end{bmatrix}\). Thus
\[A=\begin{bmatrix}7&-1\\9&3\end{bmatrix}\frac13\begin{bmatrix}1&-1\\-2&5\end{bmatrix}=\begin{bmatrix}3&-4\\1&2\end{bmatrix}.\]
This is not among choices A through D, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30233, number: 233, division: "Theta", topic: "Conic Sections", difficulty: 4, methods: ["Eccentricity"],
    question: String.raw`A hyperbola has focal width (length of a latus rectum) 6 and eccentricity \(\frac74\). Find the distance between the two vertices of this hyperbola.`,
    choices: [String.raw`\(\frac{24}{13}\)`, String.raw`\(\frac{32}{13}\)`, String.raw`\(\frac{24}{11}\)`, String.raw`\(\frac{32}{11}\)`, "NOTA"], answer: "D",
    solution: String.raw`Using the notation common to conic sections, \(\frac{2b^2}{a}=6\), so \(b^2=3a\). Since the eccentricity is \(\frac74\), \(c^2=\frac{49}{16}a^2\). For a hyperbola, \(a^2+b^2=c^2\), so
\[a^2+3a=\frac{49}{16}a^2\Longrightarrow a=\frac{16}{11}.\]
Therefore, the distance between the vertices is \(2a=\boxed{\frac{32}{11}}\).`,
  },
  {
    id: 30234, number: 234, division: "Theta", topic: "Probability", difficulty: 5, methods: ["Conditional Probability"],
    question: String.raw`Suppose that two bags contain solid white and solid black marbles only. The first bag initially contains exactly 16 marbles: 10 white and 6 black. The second bag initially contains exactly 14 marbles: 5 white and 9 black. A marble is selected at random from the first bag and transferred to the second bag without looking to see what color it is; a marble is then drawn from the second bag. If the marble drawn from the second bag is white, what is the probability that the marble transferred from the first bag to the second bag was also white?`,
    choices: [String.raw`\(\frac{15}{23}\)`, String.raw`\(\frac{12}{19}\)`, String.raw`\(\frac6{11}\)`, String.raw`\(\frac23\)`, "NOTA"], answer: "D",
    solution: String.raw`The transferred marble is white with probability \(\frac58\) and black with probability \(\frac38\). The probability of then drawing white is \(\frac25\) after a white transfer and \(\frac13\) after a black transfer. Therefore, the requested conditional probability is
\[\frac{\frac58\cdot\frac25}{\frac58\cdot\frac25+\frac38\cdot\frac13}=\boxed{\frac23}.\]`,
  },
  {
    id: 30235, number: 235, division: "Theta", topic: "Sequences", difficulty: 4, methods: [],
    question: String.raw`An arithmetic sequence has 519 as its 207th term and 471 as its 315th term. What is the term number of the term in this sequence that is closest to 0?`,
    choices: ["1375", "1442", "1502", "1598", "NOTA"], answer: "A",
    solution: String.raw`The common difference is
\[d=\frac{519-471}{207-315}=-\frac49,\]
so \(a_n=471-\frac49(n-315)=\frac{5499-4n}{9}\). Setting this equal to 0 gives \(n=1374.75\). The adjacent terms are \(a_{1374}=\frac13\) and \(a_{1375}=-\frac19\), so the closest term to 0 is the \(\boxed{1375\text{th}}\) term.`,
  },
  {
    id: 30236, number: 236, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    question: String.raw`There is a positive real solution to the equation \(x\lfloor x\rfloor=2026\) \(\left(x=45\frac1{45}\right)\) and a positive real solution to the equation \(x\lfloor x\rfloor=2025\) \((x=45)\), but there is no positive real solution to the equation \(x\lfloor x\rfloor=2024\). What is the greatest integer \(a\) less than 2025 for which \(x\lfloor x\rfloor=a\) has a positive real solution?`,
    choices: ["1964", "1979", "1996", "2005", "NOTA"], answer: "B",
    solution: String.raw`Let \(x=n+f\), where \(n\) is a positive integer and \(0\le f<1\). Then
\[x\lfloor x\rfloor=(n+f)n=n^2+fn,\]
which ranges from \(n^2\) through values strictly less than \(n^2+n\). For \(n=44\), every integer from 1936 through 1979 occurs, while \(n=45\) begins at 2025. Therefore, the greatest qualifying integer less than 2025 is \(\boxed{1979}\).`,
  },
  {
    id: 30237, number: 237, division: "Theta", topic: "Geometry", difficulty: 4, methods: [],
    question: String.raw`Let \(D_n\) equal the total number of diagonals of a regular \(n\)-gon, \(E_n\) be the number of degrees in one exterior angle of a regular \(n\)-gon, and \(I_n\) be the number of degrees in the sum of the interior angles of a regular \(n\)-gon. If \(\frac{D_mE_m}{I_m}=0.998\) and \(\frac{D_kE_k}{I_k}=0.999\), find the value of \(k-m\).`,
    choices: ["250", "500", "1000", "2000", "NOTA"], answer: "B",
    solution: String.raw`Since \(D_n=\frac{n(n-3)}2\), \(E_n=\frac{360}{n}\), and \(I_n=180(n-2)\),
\[\frac{D_nE_n}{I_n}=\frac{n-3}{n-2}=1-\frac1{n-2}.\]
Thus \(1-\frac1{m-2}=\frac{499}{500}\) gives \(m=502\), and \(1-\frac1{k-2}=\frac{999}{1000}\) gives \(k=1002\). Therefore, \(k-m=\boxed{500}\).`,
  },
  {
    id: 30238, number: 238, division: "Theta", topic: "Geometry", difficulty: 5, methods: ["Point-to-Line Distance Formula"],
    question: String.raw`A right triangle has sides of length 5, 12, and 13. A point \(P\) is located in the region bounded by the triangle such that the distances from \(P\) to all three sides of the triangle are at least 1. Find the minimum value of the sum of those three distances.`,
    choices: [String.raw`\(\frac{43}{13}\)`, "3", String.raw`\(\frac{69}{13}\)`, "6", "NOTA"], answer: "C",
    solution: String.raw`Place the vertices at \((0,0),(0,5),\) and \((12,0)\), so the hypotenuse is \(5x+12y=60\). If \((a,b)\) is an eligible point, then \(a,b\ge1\), and its distance sum is
\[a+b+\frac{60-5a-12b}{13}=\frac{60+8a+b}{13}.\]
This is minimized at \(a=b=1\), which is feasible, and the minimum is \(\boxed{\frac{69}{13}}\).`,
  },
  {
    id: 30239, number: 239, division: "Theta", topic: "Functions", difficulty: 5, methods: [],
    question: String.raw`Find the area of the region in the first quadrant enclosed by the graphs of \(y=\lfloor11-x\rfloor\), \(x=\lfloor11-y\rfloor\), the \(x\)-axis, the \(y\)-axis, and the set \(\{(x,y)\mid x\text{ and }y\text{ are positive integers with }x+y=10\}\).`,
    choices: ["55", "60", "66", "70", "NOTA"], answer: "A",
    solution: String.raw`The first equation gives the horizontal portions of the staircase, the second gives the vertical portions, and the listed integer points fill the remaining holes. Working from left to right, the region consists of strips with areas
\[10+9+8+7+6+5+4+3+2+1=\boxed{55}.\]`,
  },
  // FAMAT State Convention 2024, Theta Individual.
  {
    id: 30240, number: 240, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Heron's Formula"],
    question: String.raw`The diagonals of a parallelogram are 20 and 16 units long and one side of the parallelogram is 12 units. Find the area of the parallelogram.`,
    choices: [String.raw`\(60\sqrt3\)`, String.raw`\(60\sqrt5\)`, String.raw`\(60\sqrt7\)`, "Not enough information", "NOTA"], answer: "C",
    solution: String.raw`The diagonals divide the parallelogram into four triangles of equal area. Each triangle has side lengths 8, 10, and 12, so its semiperimeter is 15. By Heron's formula, its area is
\[\sqrt{15(15-8)(15-10)(15-12)}=15\sqrt7.\]
Thus the parallelogram's area is \(4(15\sqrt7)=\boxed{60\sqrt7}\).`,
  },
  {
    id: 30241, number: 241, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`Snow started counting the number of digits for the page number of his favorite book, “Math for beginners”. He counted 2025 digits. If the book begins on page 1 and ends on page \(R\), find \(R\).`,
    choices: ["612", "675", "711", "712", "NOTA"], answer: "C",
    solution: String.raw`Pages 1 through 9 use 9 digits, and pages 10 through 99 use \(2\cdot90=180\) digits. This leaves \(2025-189=1836\) digits, enough for \(1836\div3=612\) three-digit page numbers. Therefore, \(R=99+612=\boxed{711}\).`,
  },
  {
    id: 30242, number: 242, division: "Theta", topic: "Simplification", difficulty: 4, methods: ["Absolute Value"],
    question: String.raw`Simplify: \(\sqrt{(5-2\sqrt7)^2}+\sqrt{(5+2\sqrt7)^2}\).`,
    choices: ["0", "10", String.raw`\(4\sqrt7\)`, String.raw`\(4\sqrt7+10\)`, "NOTA"], answer: "C",
    solution: String.raw`Since \(2\sqrt7>5\),
\[\sqrt{(5-2\sqrt7)^2}+\sqrt{(5+2\sqrt7)^2}
=|5-2\sqrt7|+|5+2\sqrt7|=\boxed{4\sqrt7}.\]`,
  },
  {
    id: 30243, number: 243, division: "Theta", topic: "Number Theory", difficulty: 3, methods: ["Difference of Squares"],
    question: String.raw`How many of the prime numbers below are factors of \(3^{128}-2^{128}\)?
\[\text{I. }2\qquad\text{II. }5\qquad\text{III. }13\qquad\text{IV. }97\]`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "D",
    solution: String.raw`Repeatedly factor as a difference of squares:
\[3^{128}-2^{128}=(3^{64}-2^{64})(3^{64}+2^{64})=\cdots.\]
The resulting factors include \(3^4-2^4=65=5\cdot13\) and \(3^4+2^4=97\). The number is odd, so 2 is not a factor. Thus exactly \(\boxed3\) listed primes are factors.`,
  },
  {
    id: 30244, number: 244, division: "Theta", topic: "Geometry", difficulty: 3, methods: ["Angle Chasing"],
    question: String.raw`Right triangle \(WIG\) has a right angle at \(G\) and median \(\overline{GM}\) and altitude \(\overline{GU}\). If \(m\angle MGU=\frac12m\angle W\), \(m\angle W>m\angle I\), then the degree measure of \(\angle MGU\) is?`,
    choices: ["18", "30", "34", "36", "NOTA"], answer: "B",
    solution: String.raw`Let \(m\angle W=x\), so \(m\angle I=90^\circ-x\). The midpoint of the hypotenuse is equidistant from the three vertices, so \(GM=WM\) and \(m\angle WGM=x\). Also, triangle \(WGU\) is right at \(U\), so \(m\angle WGU=90^\circ-x\). Therefore,
\[m\angle MGU=x-(90^\circ-x)=2x-90^\circ.\]
The given condition yields \(2x-90^\circ=\frac{x}{2}\), so \(x=60^\circ\) and \(m\angle MGU=\boxed{30^\circ}\).`,
  },
  {
    id: 30245, number: 245, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    question: String.raw`How many integers between -10 and 10 inclusive satisfy the inequality \(\frac1{k-1}+\frac{k}{k+2}\le\frac32\)?`,
    choices: ["16", "17", "18", "19", "NOTA"], answer: "B",
    solution: String.raw`Combining terms gives
\[\frac1{k-1}+\frac{k}{k+2}-\frac32
=-\frac{(k+5)(k-2)}{2(k-1)(k+2)}\le0.\]
A sign chart gives \(( -\infty,-5]\cup(-2,1)\cup[2,\infty)\). Intersecting with the integers from -10 through 10 gives \(6+2+9=\boxed{17}\).`,
  },
  {
    id: 30246, number: 246, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    question: String.raw`Find the greatest integer \(x\) such that \(\left\lfloor\sqrt{\left\lfloor\sqrt{\left\lfloor\sqrt{x}\right\rfloor}\right\rfloor}\right\rfloor=2\). Here, \(\lfloor\ \rfloor\) denotes the greatest integer less than or equal to its argument. What is the sum of the digits of \(x\)?`,
    choices: ["13", "17", "18", "19", "NOTA"], answer: "B",
    solution: String.raw`Working outward from \(2\le\sqrt{\lfloor\sqrt{\lfloor\sqrt{x}\rfloor}\rfloor}<3\) gives
\[4\le\lfloor\sqrt{\lfloor\sqrt{x}\rfloor}\rfloor\le8,
\quad16\le\lfloor\sqrt{x}\rfloor\le80,
\quad256\le x<6561.\]
Thus the greatest integer is 6560, whose digits sum to \(\boxed{17}\).`,
  },
  {
    id: 30247, number: 247, division: "Theta", topic: "Geometric Series", difficulty: 2, methods: [],
    question: String.raw`Mr. Wiggins needs \(\$40.95\) to buy a new 3-volume set of romance novels. He puts a penny in his piggy bank on day 1, 2 cents in on day 2, 4 cents in on day 3, 8 cents in on day 4, and he continues this doubling pattern until he has enough money. On what day will it be when he has exactly enough money to purchase this 3-volume set?`,
    choices: ["10", "11", "12", "13", "NOTA"], answer: "C",
    solution: String.raw`In cents, the total after \(n\) days is
\[1+2+\cdots+2^{n-1}=2^n-1.\]
Since \(4095=2^{12}-1\), he has exactly enough money on day \(\boxed{12}\).`,
  },
  {
    id: 30248, number: 248, division: "Theta", topic: "Binomial Expansion", difficulty: 3, methods: ["Binomial Theorem"],
    question: String.raw`Find the coefficient of the 4th term of the binomial expansion of \(\left(2x-\frac12\right)^n\) when terms are written in order of decreasing power of \(x\) if it is known the middle term is the 6th term.`,
    choices: ["-1920", "-252", String.raw`\(-\frac{15}{2}\)`, "840", "NOTA"], answer: "A",
    solution: String.raw`If the 6th term is the middle term, the expansion has 11 terms, so \(n=10\). The 4th term has coefficient
\[\binom{10}{3}2^7\left(-\frac12\right)^3=\boxed{-1920}.\]`,
  },
  {
    id: 30249, number: 249, division: "Theta", topic: "Analytic Geometry", difficulty: 3, methods: [],
    question: String.raw`Find an equation of a line perpendicular to \(5x-y=1\) and is such that the area of the triangle formed by the line, the \(x\)-axis and the \(y\)-axis is equal to 5.`,
    choices: [String.raw`\(x-5y=10\)`, String.raw`\(5x-y=10\)`, String.raw`\(x+5y=10\)`, String.raw`\(5x+y=10\)`, "NOTA"], answer: "E",
    solution: String.raw`A perpendicular line must have slope \(-\frac15\), so among choices A through D only \(x+5y=10\) has the correct slope. Its intercepts are 10 and 2, which form a triangle of area \(\frac12(10)(2)=10\), not 5. Therefore, the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30250, number: 250, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Logarithms"],
    question: String.raw`Find the sum of the solutions to \(\log_{x+1}(9x^2+22x-83)=3\).`,
    choices: ["3", "6", "7", "10", "NOTA"], answer: "D",
    solution: String.raw`Writing the equation in exponential form gives
\[(x+1)^3=9x^2+22x-83,
\quad x^3-6x^2-19x+84=(x-3)(x-7)(x+4)=0.\]
The value \(x=-4\) is extraneous because it gives a negative logarithm base. The valid solutions are 3 and 7, whose sum is \(\boxed{10}\).`,
  },
  {
    id: 30251, number: 251, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`In right triangle \(ROB\), with right angle at \(R\), \(RB=3\) and \(RO=4\), point \(S\) is on \(\overline{OB}\) so that triangles \(RBS\) and \(ROS\) have equal perimeters. What is the area of triangle \(SOR\)?`,
    choices: ["1.5", "2", "2.4", "2.5", "NOTA"], answer: "C",
    solution: String.raw`Since \(OB=5\), equal perimeters give \(3+BS=4+OS\), while \(BS+OS=5\). Hence \(BS=3\) and \(OS=2\). Triangles \(ROB\) and \(ROS\) share the altitude from \(R\), so their areas are in the ratio \(OB:OS=5:2\). Since \([ROB]=6\),
\[[ROS]=\frac25\cdot6=\boxed{2.4}.\]`,
  },
  {
    id: 30252, number: 252, division: "Theta", topic: "Functions", difficulty: 3, methods: ["Removable Discontinuity"],
    question: String.raw`Given \(f(x)=\frac{x^3-2x^2+cx+d}{(x+1)(x-3)}\), where \(c\) and \(d\) are real numbers. If we know that \(f(x)\) has no vertical asymptotes, what is the value of \(f(1)\)?`,
    choices: ["-4", "-1", "1", "3", "NOTA"], answer: "C",
    solution: String.raw`To avoid vertical asymptotes, the numerator must be zero at \(x=3\) and \(x=-1\). These conditions give \(c=-3\) and \(d=0\). Thus
\[f(x)=\frac{x(x-3)(x+1)}{(x+1)(x-3)}=x\]
where defined, and \(f(1)=\boxed1\).`,
  },
  {
    id: 30253, number: 253, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pick's Theorem"],
    question: String.raw`Find the number of integral coordinates in the interior of the triangle with vertices \((0,0)\), \((0,17)\), and \((17,0)\).`,
    choices: ["120", "136", "153", "171", "NOTA"], answer: "A",
    solution: String.raw`The area is \(\frac12(17)(17)=\frac{289}{2}\), and the boundary contains \(17+17+17=51\) lattice intervals. By Pick's theorem,
\[I=\frac{289}{2}-\frac{51}{2}+1=\boxed{120}.\]`,
  },
  {
    id: 30254, number: 254, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`What is the largest integer \(k\) for which \(5^k\) is a factor of \(98!+99!+100!\)?`,
    choices: ["23", "24", "25", "26", "NOTA"], answer: "D",
    solution: String.raw`\[98!+99!+100!=98!(1+99+9900)=98!\cdot10{,}000.\]
The exponent of 5 in \(98!\) is \(\lfloor98/5\rfloor+\lfloor98/25\rfloor=19+3=22\), and \(10{,}000\) contributes four more factors of 5. Therefore, \(k=\boxed{26}\).`,
  },
  {
    id: 30255, number: 255, division: "Theta", topic: "Geometry", difficulty: 5, methods: ["Angle Bisector Theorem", "Pythagorean Theorem"],
    question: String.raw`Circle \(K\) has diameter \(\overline{JW}\), \(Z\) lies on the circle and \(U\) is on \(\overline{JW}\) such that \(\overline{ZU}\) bisects \(\angle JZW\). If \(JK=13\), \(ZW=10\), and \(KU=\frac ab\), where \(a\) and \(b\) are relatively prime, what is \(a+b\)?`,
    choices: ["13", "18", "54", "108", "NOTA"], answer: "D",
    solution: String.raw`Since \(JK=13\), the diameter \(JW=26\). By Thales' theorem and the Pythagorean theorem, \(JZ=24\). Let \(KU=x\), so \(JU=13+x\) and \(UW=13-x\). The angle bisector theorem gives
\[\frac{10}{13-x}=\frac{24}{13+x},\]
so \(x=\frac{91}{17}\). Therefore, \(a+b=91+17=\boxed{108}\).`,
  },
  {
    id: 30256, number: 256, division: "Theta", topic: "Algebra", difficulty: 4, methods: ["Quadratic Formula"],
    question: String.raw`If \(a^2=ab+12b^2\) and \(a\) and \(b\) are non-zero real numbers, how many possible values exist for \(\frac ab\)?`,
    choices: ["1", "2", "4", "Infinitely many", "NOTA"], answer: "B",
    solution: String.raw`Dividing by \(b^2\) and setting \(t=\frac ab\) gives
\[t^2-t-12=(t-4)(t+3)=0.\]
Thus \(\frac ab\) can equal 4 or -3, for \(\boxed2\) possible values.`,
  },
  {
    id: 30257, number: 257, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    question: String.raw`Wiggie the pool man needs to empty a dirty pool for cleaning. He turned on pump one and after 3 hours he turned on a second pump and the pool was emptied in 8 more hours. The first pump could have done the job alone in 20 hours. How many hours would it take for the second pump to empty the pool working alone?`,
    choices: [String.raw`\(\frac{40}{3}\)`, String.raw`\(\frac{124}{9}\)`, String.raw`\(\frac{52}{3}\)`, String.raw`\(\frac{160}{9}\)`, "NOTA"], answer: "D",
    solution: String.raw`Let the second pump's time be \(x\) hours. The work equation is
\[\frac{11}{20}+\frac8x=1.\]
Thus \(\frac8x=\frac9{20}\), so \(x=\boxed{\frac{160}{9}}\) hours.`,
  },
  {
    id: 30258, number: 258, division: "Theta", topic: "Geometry", difficulty: 4, methods: [],
    question: String.raw`A sphere is inscribed in a cube with a surface area of 24 square units. A second cube is then inscribed within the sphere. What is the surface area of the inner cube, in square units?`,
    choices: ["4", "8", "12", "16", "NOTA"], answer: "B",
    solution: String.raw`The outer cube has side length 2, so the sphere has diameter 2. If the inner cube has side length \(L\), its space diagonal is the sphere's diameter:
\[L\sqrt3=2\Longrightarrow L^2=\frac43.\]
Its surface area is \(6L^2=\boxed8\).`,
  },
  {
    id: 30259, number: 259, division: "Theta", topic: "Probability", difficulty: 3, methods: [],
    question: String.raw`Three fair six-sided dice are rolled. The probability that the sum of the 3 numbers is 9 is \(\frac{L}{216}\). What does \(L\) equal?`,
    choices: ["25", "26", "27", "28", "NOTA"], answer: "A",
    solution: String.raw`The number of positive integer solutions to \(a+b+c=9\) is \(\binom82=28\). Three of these have one variable equal to 7 or more and are invalid for a die. Hence \(L=28-3=\boxed{25}\).`,
  },
  {
    id: 30260, number: 260, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Completing the Square"],
    question: String.raw`How many ordered pairs of positive integers \((J,W)\) satisfy \(J^2+W^2-8J+4W-5=0\)?`,
    choices: ["3", "4", "12", "16", "NOTA"], answer: "B",
    solution: String.raw`Completing the square gives
\[(J-4)^2+(W+2)^2=25.\]
The positive integer solutions are \((4,3),(1,2),(7,2),\) and \((8,1)\), so there are \(\boxed4\) ordered pairs.`,
  },
  {
    id: 30261, number: 261, division: "Theta", topic: "Complex Numbers", difficulty: 4, methods: [],
    question: String.raw`In the complex plane, a square is centered at the origin with a diagonal of length 6. The sides of the square are parallel to the coordinate axes with vertices \(z_1,z_2,z_3\) and \(z_4\). What does \(z_1z_2z_3z_4\) equal?`,
    choices: ["-324", "20.25", "81", "324", "NOTA"], answer: "C",
    solution: String.raw`Each vertex is distance 3 from the origin, and the four arguments sum to a multiple of \(2\pi\). Therefore,
\[z_1z_2z_3z_4=3^4=\boxed{81}.\]`,
  },
  {
    id: 30262, number: 262, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`How many positive integers less than 100 can be represented as the product of exactly 3 different primes?`,
    choices: ["1", "3", "4", "8", "NOTA"], answer: "E",
    solution: String.raw`The qualifying products are
\[2\cdot3\cdot5=30,
\quad2\cdot3\cdot7=42,
\quad2\cdot3\cdot11=66,
\quad2\cdot3\cdot13=78,
\quad2\cdot5\cdot7=70.\]
There are 5 such integers, which is not listed, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30263, number: 263, division: "Theta", topic: "Geometry", difficulty: 5, methods: ["Pythagorean Theorem"],
    question: String.raw`The length of the base of an isosceles triangle and the length of the height to that base sum to 62. If the perimeter of the triangle is 100, what is the sum of all the possible values for the height of the triangle to the base?`,
    choices: ["30", "35", "45", "50", "NOTA"], answer: "D",
    solution: String.raw`Let the base be \(b\), height be \(h\), and equal side length be \(x\). Then \(b+h=62\) and \(2x+b=100\). The altitude bisects the base, so
\[h^2=x^2-\left(\frac b2\right)^2.\]
Substitution gives \(h^2-50h+600=0\), so \(h=20\) or 30. Their sum is \(\boxed{50}\).`,
  },
  {
    id: 30264, number: 264, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Completing the Square"],
    question: String.raw`Find the distance from the directrix to the vertex for: \(4x=2y^2+2y+3\).`,
    choices: ["0.125", "0.5", "2", "8", "NOTA"], answer: "B",
    solution: String.raw`Completing the square gives
\[2x-\frac54=\left(y+\frac12\right)^2.\]
In the form \((y-k)^2=4p(x-h)\), this has \(4p=2\), so \(p=\frac12\). The vertex-to-directrix distance is \(\boxed{0.5}\).`,
  },
  {
    id: 30265, number: 265, division: "Theta", topic: "Area Between Curves", difficulty: 3, methods: ["Absolute Value"],
    question: String.raw`Find the area of the region bounded by the graphs: \(y=|x+2|+|x-3|\), \(x=-2\), \(x=3\), and \(y=0\).`,
    choices: ["10", "12.5", "15", "25", "NOTA"], answer: "D",
    solution: String.raw`For \(-2\le x\le3\),
\[|x+2|+|x-3|=(x+2)+(3-x)=5.\]
The bounded region is a rectangle of width 5 and height 5, so its area is \(\boxed{25}\).`,
  },
  {
    id: 30266, number: 266, division: "Theta", topic: "Combinatorics", difficulty: 4, methods: ["Complement Rule"],
    question: String.raw`Point \(W\), \(J\), and \(F\) lie on the sides of triangle \(ROB\) so that segments \(RW\), \(OJ\), and \(BF\), if drawn, would intersect at one interior point \(S\). Using 3 of these 7 points as vertices, how many triangles can be formed?`,
    choices: ["28", "29", "32", "34", "NOTA"], answer: "B",
    solution: String.raw`There are \(\binom73=35\) triples of points. Six triples are collinear: three lie on the sides of triangle \(ROB\), and three lie on the concurrent segments \(RW\), \(OJ\), and \(BF\). Therefore, \(35-6=\boxed{29}\) triangles can be formed.`,
  },
  {
    id: 30267, number: 267, division: "Theta", topic: "Rate of Change", difficulty: 3, methods: [],
    question: String.raw`In Snowman's most recent triathlon, he ran 15 miles at 6 mph, he biked 6 miles in 15 minutes, and he swam for 10 minutes at 1.5 mph. His average speed can be represented as \(\frac RS\), where \(R\) and \(S\) are relatively prime. What is \(R+S\)?`,
    choices: ["58", "64", "117", "127", "NOTA"], answer: "A",
    solution: String.raw`The total distance is \(15+6+\frac14=\frac{85}{4}\) miles. The total time is \(\frac{15}{6}+\frac14+\frac16=\frac{35}{12}\) hours. Thus the average speed is
\[\frac{85/4}{35/12}=\frac{51}{7},\]
so \(R+S=\boxed{58}\).`,
  },
  {
    id: 30268, number: 268, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Angle Chasing"],
    question: String.raw`In \(\triangle WIG\), point \(U\) is on \(\overline{GI}\) and point \(L\) is on \(\overline{WI}\). Triangles \(WIG\), \(WGU\), \(WUL\), and \(ILU\) are isosceles with bases \(\overline{WG}\), \(\overline{UG}\), \(\overline{WL}\), and \(\overline{IU}\), respectively. The degree measure of \(\angle G=\frac X7\). What is \(X\)?`,
    choices: ["180", "270", "360", "540", "NOTA"], answer: "D",
    solution: String.raw`Let \(m\angle G=g\). The isosceles conditions give \(m\angle I=180^\circ-2g\), \(m\angle WUG=g\), and \(m\angle WUL=540^\circ-6g\). Because \(G,U,I\) are collinear,
\[g+(540^\circ-6g)+(180^\circ-2g)=180^\circ,\]
so \(7g=540^\circ\). Since \(g=\frac X7\), \(\boxed{X=540}\).`,
  },
  {
    id: 30269, number: 269, division: "Theta", topic: "Statistics", difficulty: 3, methods: [],
    question: String.raw`Dr. S gave 252 cans of his favorite energy drink to 100 members of his math team. If each team member got at least 1 can, what is the maximum possible median number of cans per team member?`,
    choices: ["3.0", "3.5", "4.0", "4.5", "NOTA"], answer: "B",
    solution: String.raw`For 100 ordered values, the median is the average of the 50th and 51st. Give the first 49 members one can each, the 50th member 3 cans, and the remaining 50 members 4 cans each. This uses \(49+3+200=252\) cans and gives median \(\frac{3+4}{2}=3.5\). A larger median would require more than 252 cans. Thus the maximum is \(\boxed{3.5}\).`,
  },
  // FAMAT State Convention 2023, Theta Individual.
  {
    id: 30270, number: 270, division: "Theta", topic: "Polynomials", difficulty: 2, methods: [],
    question: String.raw`The quartic polynomial \(3x^4-8x^3-50x^2-57x-18\) can be factored as \((x^2-5x-6)(ax^2+bx+c)\). Find \(a+b+c\).`,
    choices: ["-23", "7", "13", "27", "NOTA"], answer: "C",
    solution: String.raw`Using long division, the quotient is \(3x^2+7x+3\). The sum of its coefficients is \(3+7+3=\boxed{13}\).`,
  },
  {
    id: 30271, number: 271, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: ["Logarithms"],
    question: String.raw`The value of \(\log_{10}(172)\), rounded to four decimal places, is 2.2355. Find the value of \(\log_{10}(0.172)\), rounded to four decimal places.`,
    choices: ["-1.7645", "-0.7645", "0.0022", "0.0224", "NOTA"], answer: "B",
    solution: String.raw`Since \(0.172=172\cdot10^{-3}\), \(\log_{10}(0.172)=2.2355-3=\boxed{-0.7645}\).`,
  },
  {
    id: 30272, number: 272, division: "Theta", topic: "Matrices", difficulty: 3, methods: ["Matrix Inverse"],
    question: String.raw`Find the element in the second row, third column of \(A^{-1}\), if \(A=\begin{bmatrix}3&-11&4\\1&2&3\\2&3&1\end{bmatrix}\).`,
    choices: ["-5", String.raw`\(-\frac3{16}\)`, String.raw`\(\frac3{16}\)`, String.raw`\(\frac1{16}\)`, "NOTA"], answer: "D",
    solution: String.raw`\(\det A=-80\). The required entry uses cofactor \(C_{3,2}=(-1)^5\begin{vmatrix}3&4\\1&3\end{vmatrix}=-5\). Hence it is \(\frac{-5}{-80}=\boxed{\frac1{16}}\).`,
  },
  {
    id: 30273, number: 273, division: "Theta", topic: "Inequalities", difficulty: 4, methods: ["Absolute Value"],
    question: String.raw`Solve for \(x\): \(\left|\frac{2-3x}{3+x}\right|\le\frac1x\).`,
    choices: [String.raw`\((0,1]\)`, String.raw`\((-3,0)\)`, String.raw`\(\left(0,\frac{1+\sqrt3}{2}\right]\)`, String.raw`\(\left(0,\frac{1+\sqrt5}{2}\right]\)`, "NOTA"], answer: "D",
    solution: String.raw`The right side forces \(x>0\). Squaring and solving the resulting rational inequality gives \(\boxed{\left(0,\frac{1+\sqrt5}{2}\right]}\).`,
  },
  {
    id: 30274, number: 274, division: "Theta", topic: "Number Theory", difficulty: 2, methods: ["Modular Arithmetic"],
    question: String.raw`Determine the last digit of \(3^{3^3}\).`, choices: ["1", "3", "7", "9", "NOTA"], answer: "C",
    solution: String.raw`The exponent is 27. Last digits of powers of 3 cycle as \(3,9,7,1\), and \(27\equiv3\pmod4\), so the last digit is \(\boxed7\).`,
  },
  {
    id: 30275, number: 275, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`How many real number solutions are there for the equation \(\left(x^2+4x+5\right)^{x^2+1}=1\)?`, choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`The base is \((x+2)^2+1\ge1\) and the exponent is positive. Equality occurs only when the base is 1, at \(x=-2\), so there is \(\boxed1\) solution.`,
  },
  {
    id: 30276, number: 276, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: ["Rational Root Theorem"],
    question: String.raw`Find the positive difference between the largest and the smallest roots of \(30x^3-31x^2-66x+72=0\), given that there is a root in the interval \((-2,-1)\).`,
    choices: [String.raw`\(-\frac32\)`, String.raw`\(\frac65\)`, String.raw`\(\frac43\)`, String.raw`\(\frac{17}{6}\)`, "NOTA"], answer: "D",
    solution: String.raw`The roots are \(-\frac32,\frac43,\frac65\). The requested difference is \(\frac43-(-\frac32)=\boxed{\frac{17}{6}}\).`,
  },
  {
    id: 30277, number: 277, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    question: String.raw`If \(x+2y+3z=6\), \(2x-3y+2z=14\), and \(3x+y-z=-2\), then \(x+y+z\) is`, choices: ["0", "2", "3", "4", "NOTA"], answer: "B",
    solution: String.raw`Solving gives \((x,y,z)=(1,-2,3)\), so \(x+y+z=\boxed2\).`,
  },
  {
    id: 30278, number: 278, division: "Theta", topic: "Polynomials", difficulty: 1, methods: ["Remainder Theorem"],
    question: String.raw`Solve for \(k\) such that \((x-3)\) is a factor of \(x^3-kx^2+2x-1\).`, choices: [String.raw`\(\frac{22}{9}\)`, String.raw`\(\frac{32}{9}\)`, String.raw`\(-\frac{22}{9}\)`, String.raw`\(-\frac{32}{9}\)`, "NOTA"], answer: "B",
    solution: String.raw`Substituting \(x=3\) gives \(32-9k=0\), so \(\boxed{k=\frac{32}{9}}\).`,
  },
  {
    id: 30279, number: 279, division: "Theta", topic: "Conic Sections", difficulty: 1, methods: ["Eccentricity"],
    question: String.raw`Consider the following statements:
I. The eccentricity of a hyperbola is greater than 1
II. The eccentricity of a parabola is equal to 1
III. The eccentricity of an ellipse is less than 1

Which of the following statement(s) is(are) always true?`, choices: ["I only", "I and III", "I and II", "I, II, and III", "NOTA"], answer: "D",
    solution: String.raw`These are the defining eccentricity ranges for the three conics, so all three statements are true: \(\boxed{\text{I, II, and III}}\).`,
  },
  {
    id: 30280, number: 280, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["Conjugates"],
    question: String.raw`For what value of \(b\) is \(\frac{2+i}{bi-1}\) a real number?`, choices: [String.raw`\(-\frac32\)`, String.raw`\(-\frac12\)`, String.raw`\(\frac12\)`, "2", "NOTA"], answer: "B",
    solution: String.raw`After multiplying by the denominator's conjugate, the imaginary part is proportional to \(2b+1\). Thus \(2b+1=0\), giving \(\boxed{b=-\frac12}\).`,
  },
  {
    id: 30281, number: 281, division: "Theta", topic: "Geometry", difficulty: 2, methods: ["Pythagorean Theorem"],
    question: String.raw`What is the radius of a circle which circumscribes the triangle with vertices \((2,0)\), \((0,4)\), and \((4,6)\)?`, choices: [String.raw`\(\sqrt5\)`, String.raw`\(\sqrt{10}\)`, String.raw`\(2\sqrt{10}\)`, String.raw`\(2\sqrt5\)`, "NOTA"], answer: "B",
    solution: String.raw`The triangle is right with hypotenuse \(\sqrt{40}=2\sqrt{10}\). A right triangle's circumradius is half its hypotenuse, so \(r=\boxed{\sqrt{10}}\).`,
  },
  {
    id: 30282, number: 282, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    question: String.raw`What percentage of the interval \([-10,10]\) is the inequality \(x+2>\frac5{x-2}\) satisfied?`, choices: ["70%", "60%", "50%", "40%", "NOTA"], answer: "B",
    solution: String.raw`The inequality becomes \(\frac{x^2-9}{x-2}>0\), true on \((-3,2)\cup(3,\infty)\). Inside \([-10,10]\), the total length is 12 out of 20, or \(\boxed{60\%}\).`,
  },
  {
    id: 30283, number: 283, division: "Theta", topic: "Binomial Expansion", difficulty: 3, methods: ["Multinomial Theorem"],
    question: String.raw`Let \(a\) and \(b\) be the coefficients of \(x^3\) in \((1+x+2x^2+3x^3)^3\) and \((1+x+2x^2+3x^3+4x^4)^3\), respectively. Find \(a-b\).`, choices: ["0", "1", "-1", String.raw`\(3^3-4^3\)`, "NOTA"], answer: "A",
    solution: String.raw`The added \(4x^4\) term cannot contribute to an \(x^3\) coefficient. Hence \(a=b\), so \(\boxed{a-b=0}\).`,
  },
  {
    id: 30284, number: 284, division: "Theta", topic: "Polynomials", difficulty: 1, methods: ["Remainder Theorem"],
    question: String.raw`When the polynomial \(f(x)\) is divided by \(x+3\), the quotient is \(x^2-1\) and the remainder is 2. Find the remainder when \(f(x)\) is divided by \(x-2\).`, choices: ["1", "2", "15", "17", "NOTA"], answer: "D",
    solution: String.raw`\(f(x)=(x+3)(x^2-1)+2=x^3+3x^2-x-1\). Thus the remainder is \(f(2)=\boxed{17}\).`,
  },
  {
    id: 30285, number: 285, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    question: String.raw`Find all values of \(x\) such that \(\sqrt{2x+3}-\sqrt{4x-1}\ge\sqrt{6x-2}\).`, choices: [String.raw`\(\left[\frac13,\frac12\right]\)`, String.raw`\(\left[\frac14,\frac12\right]\)`, String.raw`\(\left[0,\frac12\right]\)`, String.raw`\(\left[-\frac74,\frac12\right]\)`, "NOTA"], answer: "A",
    solution: String.raw`The domain requires \(x\ge\frac13\). Squaring carefully and checking the resulting candidates gives \(x\le\frac12\), including both endpoints. Thus \(\boxed{\left[\frac13,\frac12\right]}\).`,
  },
  {
    id: 30286, number: 286, division: "Theta", topic: "Matrices", difficulty: 3, methods: ["Determinant", "Vieta's Formulas"],
    question: String.raw`Find the sum of the solutions of \(\begin{vmatrix}x^2&x&2\\x&-x&1\\-4&5&-2\end{vmatrix}=0\).`, choices: [String.raw`\(-\frac32\)`, String.raw`\(\frac23\)`, "3", String.raw`\(\frac73\)`, "NOTA"], answer: "E",
    solution: String.raw`The determinant is \(2x^3-3x^2-2x=x(2x+1)(x-2)\). Its roots sum to \(\frac32\), which is not listed, so \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30287, number: 287, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    question: String.raw`Solve for \(n\) if \(\frac{(n-1)!(n+1)!}{n!n!}=\frac{10}{9}\).`, choices: ["10", "9", "8", "7", "NOTA"], answer: "B",
    solution: String.raw`The left side simplifies to \(\frac{n+1}{n}\). Hence \(\frac{n+1}{n}=\frac{10}{9}\), so \(\boxed{n=9}\).`,
  },
  {
    id: 30288, number: 288, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    question: String.raw`Find all solutions such that \(9^{\log_3x}+\log_x x^{2x}=\log_3 27\).`, choices: ["No Solution", "-3", "1", "1, -3", "NOTA"], answer: "A",
    solution: String.raw`The equation becomes \(x^2+2x=3\), with candidates \(1,-3\). The first is an invalid logarithm base and the second is outside the domain, so there is \(\boxed{\text{no solution}}\).`,
  },
  {
    id: 30289, number: 289, division: "Theta", topic: "Polynomial Equations", difficulty: 4, methods: ["Rational Root Theorem"],
    question: String.raw`Find the sum of the value(s) of an integer \(k\) for which the equation \(x^3+kx^2+kx+2=0\) has at least one rational root.`, choices: ["3", "2", "1", "0", "NOTA"], answer: "A",
    solution: String.raw`A rational root must be among \(\pm1,\pm2\). Substitution produces an integer \(k\) only for \(x=-2\), giving \(k=3\). The requested sum is \(\boxed3\).`,
  },
  {
    id: 30290, number: 290, division: "Theta", topic: "Matrices", difficulty: 3, methods: ["Matrix Inverse", "Matrix Multiplication"],
    question: String.raw`Let \(A=\begin{bmatrix}-1&0\\1&2\end{bmatrix}\), \(B=\begin{bmatrix}2&1\\1&-1\end{bmatrix}\), and \(C=\begin{bmatrix}-2&2\\3&1\end{bmatrix}\). Find the largest entry in matrix \(X\) if \(AX+B=CX\).`, choices: [String.raw`\(\frac43\)`, String.raw`\(\frac53\)`, "1", "2", "NOTA"], answer: "B",
    solution: String.raw`Rearranging and multiplying by the inverse gives \(X=(C-A)^{-1}B\). Carrying out the multiplication, the largest entry is \(\boxed{\frac53}\).`,
  },
  {
    id: 30291, number: 291, division: "Theta", topic: "Number Theory", difficulty: 3, methods: ["Parity"],
    question: String.raw`What is the largest power of 2 that divides \(2^{2010}+10^{2010}\)?`, choices: [String.raw`\(2^{2000}\)`, String.raw`\(2^{2010}\)`, String.raw`\(2^{2009}\)`, String.raw`\(2^{2011}\)`, "NOTA"], answer: "D",
    solution: String.raw`The expression is \(2^{2010}(1+5^{2010})\). Since \(5^{2010}\equiv1\pmod8\), the parenthetical factor is divisible by 2 but not 4. The answer is \(\boxed{2^{2011}}\).`,
  },
  {
    id: 30292, number: 292, division: "Theta", topic: "Algebra", difficulty: 1, methods: ["Difference of Squares"],
    question: String.raw`If \(x-y=3\) and \(x^2-y^2=9\), then \(xy=?\)`, choices: ["0", "1", "2", "3", "NOTA"], answer: "A",
    solution: String.raw`\((x-y)(x+y)=9\), so \(x+y=3\). Thus \(x=3,y=0\), and \(\boxed{xy=0}\).`,
  },
  {
    id: 30293, number: 293, division: "Theta", topic: "Number Theory", difficulty: 1, methods: ["Modular Arithmetic"],
    question: String.raw`An odd integer between 600 and 800 is divisible by 9 and 11. What is the sum of its digits?`, choices: ["9", "12", "18", "21", "NOTA"], answer: "C",
    solution: String.raw`The only odd multiple of 99 in the interval is 693. Its digit sum is \(6+9+3=\boxed{18}\).`,
  },
  {
    id: 30294, number: 294, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: ["Point-to-Line Distance Formula"],
    question: String.raw`Find the minimum distance from the point \((20,23)\) to the line \(3x+4y-2=0\).`, choices: ["30", "32", "34", "36", "NOTA"], answer: "A",
    solution: String.raw`\[d=\frac{|3(20)+4(23)-2|}{\sqrt{3^2+4^2}}=\frac{150}{5}=\boxed{30}.\]`,
  },
  {
    id: 30295, number: 295, division: "Theta", topic: "Combinatorics", difficulty: 1, methods: [],
    question: String.raw`Four points, no three of which are collinear, determine how many line segments?`, choices: ["8", "6", "5", "4", "NOTA"], answer: "B",
    solution: String.raw`Choose the two endpoints from four points: \(\binom42=\boxed6\).`,
  },
  {
    id: 30296, number: 296, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["Vieta's Formulas"],
    question: String.raw`If \(r\) and \(s\) are the complex roots of \(x^2-\sqrt{27}x+13=0\), what is \(r^2+s^2\)?`, choices: [String.raw`\(\sqrt{27}\)`, "1", "13", "53", "NOTA"], answer: "B",
    solution: String.raw`Since \(r+s=\sqrt{27}\) and \(rs=13\), \(r^2+s^2=(r+s)^2-2rs=27-26=\boxed1\).`,
  },
  {
    id: 30297, number: 297, division: "Theta", topic: "Algebra", difficulty: 2, methods: ["Quadratic Formula"],
    question: String.raw`Let \(A>B>1\). If the arithmetic mean of two positive numbers is \(A\) and the geometric mean is \(B\), what are the two numbers?`, choices: [String.raw`\(A\pm\sqrt{A^2-B^2}\)`, String.raw`\(B\pm\sqrt{A^2-B^2}\)`, String.raw`\(A\pm\sqrt{A-B}\)`, String.raw`\(A\pm B\)`, "NOTA"], answer: "A",
    solution: String.raw`The numbers are roots of \(t^2-2At+B^2=0\), hence \(\boxed{A\pm\sqrt{A^2-B^2}}\).`,
  },
  {
    id: 30298, number: 298, division: "Theta", topic: "Functions", difficulty: 3, methods: ["Recursion"],
    question: String.raw`Suppose that for any integer \(n\), \(f(n)=\begin{cases}n-1,&\text{if }n\text{ is even}\\2n,&\text{if }n\text{ is odd}\end{cases}\). If \(k\) is a natural number, and \(f(f(f(k)))=21\), find the sum of the digits in \(k\).`, choices: ["3", "4", "5", "7", "NOTA"], answer: "A",
    solution: String.raw`Working backward uniquely gives \(21\leftarrow22\leftarrow11\leftarrow12\). Thus \(k=12\), whose digits sum to \(\boxed3\).`,
  },
  {
    id: 30299, number: 299, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Reflection"],
    question: String.raw`Find the area of quadrilateral \(ABCD\) if \(\overline{AD}\cong\overline{DC}\), \(\overline{AB}\perp\overline{BC}\), \(\overline{AD}\perp\overline{DC}\), and diagonal \(\overline{BD}\) has length 2.`, choices: ["2", "8", String.raw`\(2\sqrt2\)`, String.raw`\(\sqrt2\)`, "NOTA"], answer: "A",
    solution: String.raw`Reflect triangle \(CDB\) across \(BD\). The conditions make the reflected figure a square of side \(BD=2\), while \(ABCD\) occupies half its area. Hence \([ABCD]=\frac12(2^2)=\boxed2\).`,
    illustration: { src: "/questions/theta-299-quadrilateral.svg", alt: "Quadrilateral ABCD with perpendicular adjacent sides at B and D and diagonal BD labeled 2.", width: 560, height: 360 },
  },
  // FAMAT State Convention 2022, Theta Individual.
  { id: 30300, number: 300, division: "Theta", topic: "Algebra", difficulty: 1, methods: [],
    question: String.raw`Vasisht skips around the alley as he uses Jose, the human calculator. Unfortunately, Jose malfunctions. When addition is inputted, Jose performs multiplication instead. For example, if Vasisht inputs “2 + 3”, then Jose outputs “6”. What would Jose output when Vasisht inputs “1 + 2 + 3 + 4 + 5”?`, choices: ["6","15","30","120","NOTA"], answer: "D",
    solution: String.raw`Jose calculates \(1\cdot2\cdot3\cdot4\cdot5=5!=\boxed{120}\).` },
  { id: 30301, number: 301, division: "Theta", topic: "Statistics", difficulty: 1, methods: [],
    question: String.raw`In order to pass a certain beatmap, a group of four friends need an average of at least 3000 pp. Saathvik has 3150 pp, Alex has 3000 pp, and Sena has 2200 pp. They get Vincent's brother to be the fourth person. What is the minimum amount of pp Vincent's brother need for them to unlock a new beatmap?`, choices: [String.raw`\(\frac{8350}{3}\)`,"3000","3650","4950","NOTA"], answer: "C",
    solution: String.raw`At the minimum, \(\frac{3150+3000+2200+x}{4}=3000\), giving \(\boxed{x=3650}\).` },
  { id: 30302, number: 302, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Chinese Remainder Theorem"],
    question: String.raw`Hari has a lot of netherite to share with his friends. If he gives 3 per person, there is one left over. If he gives 5 per person, there are three left over. If he gives 7 per person, there are five left over. If he gives 11 per person, there are nine left over. If Hari can only have up to 600 friends, how much netherite does he have?`, choices: ["1153","1157","2308","2312","NOTA"], answer: "A",
    solution: String.raw`Each remainder is two less than the divisor, so \(n+2\) is divisible by \(3,5,7,11\). Thus \(n=1155k-2\). The friend limit leaves \(k=1\), so \(\boxed{n=1153}\).` },
  { id: 30303, number: 303, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    question: String.raw`In a game of Among Us, there are 8 crewmates and 2 imposters. Swaggy Shar, who is not playing the game, decides to guess the imposter with his swag. How many people does Swaggy Shar have to call out to be certain that he has called out at least one imposter?`, choices: ["1","8","9","10","NOTA"], answer: "C",
    solution: String.raw`In the worst case he first calls all 8 crewmates, then one imposter. Thus he needs \(\boxed9\) calls.` },
  { id: 30304, number: 304, division: "Theta", topic: "Telescoping Series", difficulty: 3, methods: ["Telescoping"],
    question: String.raw`Evaluate: \(\frac12+\frac16+\frac1{12}+\frac1{20}+\frac1{30}+\frac1{42}+\frac1{56}+\cdots+\frac1{2020\cdot2021}+\frac1{2021\cdot2022}\).`, choices: [String.raw`\(\frac{2021}{2022}\)`,String.raw`\(\frac{2022}{2023}\)`,"1",String.raw`\(\frac{2023}{2022}\)`,"NOTA"], answer: "A",
    solution: String.raw`Since \(\frac1{n(n+1)}=\frac1n-\frac1{n+1}\), the sum telescopes to \(1-\frac1{2022}=\boxed{\frac{2021}{2022}}\).` },
  { id: 30305, number: 305, division: "Theta", topic: "Combinatorics", difficulty: 2, methods: ["Multinomial Theorem"],
    question: String.raw`Aryaan says DADDYCHILL often to calm down. On an unOrdinary day, he can't chill unless he finds out the number of distinct permutations of letters in the word DADDYCHILL. How many distinct permutations are there?`, choices: ["302400","604800","907200","3628800","NOTA"], answer: "A",
    solution: String.raw`There are 10 letters, with D repeated 3 times and L repeated twice. The count is \(\frac{10!}{3!2!}=\boxed{302400}\).` },
  { id: 30306, number: 306, division: "Theta", topic: "Geometry", difficulty: 1, methods: [],
    question: String.raw`Vlad draws a perfect icosahedron with volume 1. Saaketh complains that the drawing is too tiny, so Vlad decides to draw another icosahedron with triple the side lengths. What is the volume of the newly drawn icosahedron?`, choices: [String.raw`\(\frac1{27}\)`,String.raw`\(\frac19\)`,"9","27","NOTA"], answer: "D",
    solution: String.raw`Tripling all lengths multiplies volume by \(3^3\), so the new volume is \(\boxed{27}\).` },
  { id: 30307, number: 307, division: "Theta", topic: "Geometry", difficulty: 3, methods: ["Angle Chasing"],
    question: String.raw`Samuil takes a pentagon and extends each of its sides both directions to create a five-pointed star. What is the sum of the measures of the vertex angles of the five-pointed star?`, choices: [String.raw`\(180^\circ\)`,String.raw`\(270^\circ\)`,String.raw`\(360^\circ\)`,String.raw`\(540^\circ\)`,"NOTA"], answer: "A",
    solution: String.raw`The five exterior turns around the star total \(720^\circ\), so the five tip angles sum to \(5(180^\circ)-720^\circ=\boxed{180^\circ}\).` },
  { id: 30308, number: 308, division: "Theta", topic: "Combinatorics", difficulty: 3, methods: ["Inclusion-Exclusion"],
    question: String.raw`Joanne the photographer loves to categorize her pictures. Among her 1000 pictures, 50 have no human beings, 150 have weebs and koreaboos, 300 have weebs and epic gamers, and 200 have koreaboos and epic gamers. Furthermore, out of the 1000 pictures, 400 have weebs, 700 have epic gamers, and 400 have koreaboos. How many pictures capture weebs, koreaboos, and epic gamers (who are all types of people)?`, choices: ["50","100","150","200","NOTA"], answer: "B",
    solution: String.raw`The union contains 950 pictures. Inclusion-exclusion gives \(950=400+400+700-150-300-200+x\), so \(\boxed{x=100}\).` },
  { id: 30309, number: 309, division: "Theta", topic: "Rate of Change", difficulty: 3, methods: [],
    question: String.raw`Connor accidentally viewed the time displayed on his phone as a fraction, and told Eunice the “simplified time.” He says that the time is \(1/5\) (if the time was 12:30, he would have said \(2/5\)). He laughs at his own mistake and he covers it up with his intellectual math fact that after exactly half an hour, he would say the time is \(2/3\). If the current time can be represented as \(a:b\), find \(a+b\).`, choices: ["36","42","48","54","NOTA"], answer: "D",
    solution: String.raw`Allowing the hour to advance gives \(\frac{x}{5x-30}=\frac23\), so \(x=9\). The time is 9:45 and \(a+b=\boxed{54}\).` },
  { id: 30310, number: 310, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    question: String.raw`At 9:45, find the smaller angle (in degrees) formed by the minute hand and the hour hand of an analog clock.`, choices: [String.raw`\(15^\circ\)`,String.raw`\(20^\circ\)`,String.raw`\(\frac{45^\circ}{2}\)`,String.raw`\(15^\circ\)`,"NOTA"], answer: "C",
    solution: String.raw`The preceding setup gives 9:45. The smaller angle is \(\left|30(9)-\frac{11}{2}(45)\right|=\boxed{\frac{45^\circ}{2}}\).` },
  { id: 30311, number: 311, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    question: String.raw`In the second round of the Squid Game, the contestants cut out a particular shape from a circular Dalgona with a radius of 1. Albert must cut out a circle with half the radius of the Dalgona. Iris must cut out an inscribed equilateral triangle. Pierre has to cut out an inscribed square. If the correct way to cut out a shape is to suck and lick the Dalgona around a shape until there is only the shape left with no excess, who consumes the most amount of Dalgona?`, choices: ["Albert","Iris","Pierre","There is a Tie","NOTA"], answer: "A",
    solution: String.raw`The cutout areas are \(\frac\pi4\), \(\frac{3\sqrt3}{4}\), and 2. The smallest cutout leaves the most candy consumed, so \(\boxed{\text{Albert}}\).` },
  { id: 30312, number: 312, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Triangle Inequality"],
    question: String.raw`Corbin has a triangle with side lengths 20, 22, and 41. Christina has a triangle with side lengths 20, 41, and 60. They put the two triangles together such that the sides of length 41 coincide, forming a quadrilateral. Given that the other diagonal also has an integral side length, what is its length?`, choices: ["39","40","41","42","NOTA"], answer: "C",
    solution: String.raw`Triangle inequalities give \(2<AC<42\) from one triangle and \(40<AC<80\) from the other. The only integer satisfying both is \(\boxed{41}\).` },
  { id: 30313, number: 313, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`Kangana can pack Chicken McNuggets in a package of 5 or 7, and then combine as many of these packages into a large box as she wants. What is the sum of all possible positive integer numbers of Chicken McNuggets that she cannot put in her box?`, choices: ["23","69","101","114","NOTA"], answer: "D",
    solution: String.raw`The nonrepresentable positive integers are \(1,2,3,4,6,8,9,11,13,16,18,23\). Their sum is \(\boxed{114}\).` },
  { id: 30314, number: 314, division: "Theta", topic: "Sequences", difficulty: 3, methods: ["Recursion"],
    question: String.raw`Let \(\{a_n\}\) be a sequence defined by \(a_1=2022\) and \(a_{n+1}=\frac{a_n-1}{a_n+1}\) for \(n>0\). Find \(a_{2022}\).`, choices: [String.raw`\(-\frac{2023}{2021}\)`,String.raw`\(-\frac1{2022}\)`,String.raw`\(\frac{2021}{2023}\)`,"2022","NOTA"], answer: "C",
    solution: String.raw`The transformation repeats every four applications. Since \(2022\equiv2\pmod4\), \(a_{2022}=a_2=\boxed{\frac{2021}{2023}}\).` },
  { id: 30315, number: 315, division: "Theta", topic: "Sequences", difficulty: 3, methods: [],
    question: String.raw`Jake listed an arithmetic sequence of positive integers in the alternating pattern shown in the table below. If 2022 is in row \(a\) and column \(b\), what is \(a+b\)?`, choices: ["53","54","55","56","NOTA"], answer: "C",
    solution: String.raw`Column 4 in odd rows has values \(22+80(n-1)\), where the row is \(2n-1\). Setting this equal to 2022 gives \(n=26\), so \(a=51,b=4\), and \(a+b=\boxed{55}\).`,
    illustration: { src: "/questions/theta-315-sequence-table.svg", alt: "Alternating six-column arithmetic-sequence table with the first four rows shown.", width: 760, height: 250 } },
  { id: 30316, number: 316, division: "Theta", topic: "Combinatorics", difficulty: 2, methods: [],
    question: String.raw`Briya is thinking of an integer between 1 and 2022, inclusive. After Akanksha tries to guess the number, Briya tells her if the guess is too high or too low or correct. Given that Akanksha uses optimal strategy in her guessing, what is the largest number of guesses she would need to make before being able to figure out what number Briya is thinking of?`, choices: ["9","10","11","12","NOTA"], answer: "C",
    solution: String.raw`Binary search needs \(\lceil\log_2 2022\rceil=\boxed{11}\) guesses because \(2^{10}<2022<2^{11}\).` },
  { id: 30317, number: 317, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`Sihwan wants to create a large stamp to engrave. His stamp is an equiangular octagon with alternating side lengths of 1 and 2. Find the area of this stamp.`, choices: [String.raw`\(4+4\sqrt2\)`,String.raw`\(5+4\sqrt2\)`,String.raw`\(6+2\sqrt2\)`,String.raw`\(6+4\sqrt2\)`,"NOTA"], answer: "B",
    solution: String.raw`The octagon completes a square of side \(2+\sqrt2\) after adding four right isosceles triangles of leg \(\frac{\sqrt2}{2}\). Its area is \((2+\sqrt2)^2-4\cdot\frac12(\frac{\sqrt2}{2})^2=\boxed{5+4\sqrt2}\).` },
  { id: 30318, number: 318, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pythagorean Theorem"],
    question: String.raw`Square \(ABCD\) has side length 2. Let points \(E,F,G,H\) be the midpoints of sides \(AB,BC,CD,DA\), respectively. Christina draws lines \(AG,EC,BH,FD\). Find the area of the closed region bounded by these four lines.`, choices: [String.raw`\(\frac45\)`,"1",String.raw`\(\frac85\)`,"2","NOTA"], answer: "A",
    solution: String.raw`Extending the lines forms a \(3\times3\) arrangement of congruent small squares. If the requested square has side \(x\), a corner right triangle gives \(x^2+(2x)^2=2^2\), so its area is \(x^2=\boxed{\frac45}\).` },
  { id: 30319, number: 319, division: "Theta", topic: "Algebra", difficulty: 2, methods: [],
    question: String.raw`Given \(x^2-2022x+1=0\), evaluate \(\sqrt{x}+\frac1{\sqrt{x}}\).`, choices: [String.raw`\(\sqrt{2022}\)`,String.raw`\(2\sqrt{506}\)`,"2022","2024","NOTA"], answer: "B",
    solution: String.raw`Dividing by \(x\) gives \(x+\frac1x=2022\). Hence \((\sqrt{x}+\frac1{\sqrt{x}})^2=2024\), and the positive value is \(\boxed{2\sqrt{506}}\).` },
  { id: 30320, number: 320, division: "Theta", topic: "Number Theory", difficulty: 5, methods: [],
    question: String.raw`Shreyas is listing “pog” numbers from least to greatest. A “pog” number is a positive integer that can be made from the digits 0, 3, 6, and 9, with repeats allowed. Shreyas's list begins \(3,6,9,30,33,36,39,60,63,66,69,90,93,96,99,300,303,306,309,330,\ldots\). What is the 2022nd “pog” number?`, choices: ["399609","399630","399633","399636","NOTA"], answer: "D",
    solution: String.raw`There are \(3\cdot4^{k-1}\) \(k\)-digit pog numbers. Counting through five digits and indexing the six-digit block in lexicographic order gives the 2022nd number as \(\boxed{399636}\).` },
  { id: 30321, number: 321, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`2022 students stand in a line numbered 1 through 2022. Students repeatedly say \(1,2\), and those who say 2 remain; then they say \(1,2,3\), and those who say 3 remain; then \(1,2,3,4\), and those who say 4 remain, continuing until two students remain. Of these two students, what is the higher number?`, choices: ["720","1440","1920","1936","NOTA"], answer: "B",
    solution: String.raw`After stages 2 through 6, remaining students are multiples of \(2\cdot3\cdot4\cdot5\cdot6=720\). Only 720 and 1440 remain, so the higher number is \(\boxed{1440}\).` },
  { id: 30322, number: 322, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Modular Arithmetic"],
    question: String.raw`Find the remainder when \(\sqrt{2022\cdot2021\cdot2020\cdot2019+1}\) is divided by 5.`, choices: ["1","2","3","4","NOTA"], answer: "D",
    solution: String.raw`Let \(x=2019\). The radicand is \(x(x+1)(x+2)(x+3)+1=(x^2+3x+1)^2\). The root is 4 modulo 5, so the remainder is \(\boxed4\).` },
  { id: 30323, number: 323, division: "Theta", topic: "Matrices", difficulty: 4, methods: ["Determinant", "Row Operations"],
    question: String.raw`Evaluate \(\begin{vmatrix}\ln6&\ln2&\log5\\\ln\frac16&\ln3&\log2\\0&\ln6&2\end{vmatrix}\).`, choices: ["0",String.raw`\((\ln6)^2\)`,String.raw`\(\ln18\)`,String.raw`\((\ln18)^2\)`,"NOTA"], answer: "B",
    solution: String.raw`Adding the first row to the second, then subtracting the new second row from the third, reduces the determinant to a triangular minor whose value is \(\boxed{(\ln6)^2}\).` },
  { id: 30324, number: 324, division: "Theta", topic: "Polynomials", difficulty: 4, methods: ["Remainder Theorem"],
    question: String.raw`Let \(R(x)\) be the remainder after dividing \(x^{2021}+1\) by \(x^2+x+1\). Evaluate \(R(2022)\).`, choices: ["-2022","-2021","2022","2023","NOTA"], answer: "A",
    solution: String.raw`Modulo \(x^2+x+1\), \(x^3\equiv1\), so \(x^{2021}+1\equiv x^2+1\equiv-x\). Thus \(R(2022)=\boxed{-2022}\).` },
  { id: 30325, number: 325, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Remainder Theorem"],
    question: String.raw`\(S(x)\) has a remainder of 1 when divided by \(x+3\) and a remainder of 5 when divided by \(x+6\). Find the remainder when \(S(x)\) is divided by \(x^2+9x+18\).`, choices: [String.raw`\(-\frac{4x}{3}-3\)`,String.raw`\(\frac{-x+13}{2}\)`,"5",String.raw`\(\frac{3x+9}{4}\)`,"NOTA"], answer: "A",
    solution: String.raw`The remainder is linear, \(R(x)=ax+b\), with \(R(-3)=1\) and \(R(-6)=5\). Solving gives \(\boxed{R(x)=-\frac43x-3}\).` },
  { id: 30326, number: 326, division: "Theta", topic: "Probability", difficulty: 5, methods: ["Geometric Probability"],
    question: String.raw`William draws an infinite unit square grid and drops a unit square whose sides always make \(45^\circ\) angles with the grid. What is the probability that the dropped square will cover a corner of the grid?`, choices: [String.raw`\(\frac14\)`,String.raw`\(\frac12\)`,String.raw`\(\frac{9-4\sqrt2}{8}\)`,String.raw`\(\frac{3-2\sqrt2}{2}\)`,"NOTA"], answer: "D",
    solution: String.raw`Track the dropped square's center within one unit cell. It misses every grid corner exactly in a centered square of side \(1-\frac{\sqrt2}{2}\). The complementary probability simplifies to \(\boxed{\frac{3-2\sqrt2}{2}}\).` },
  { id: 30327, number: 327, division: "Theta", topic: "Probability", difficulty: 5, methods: ["Expected Value"],
    question: String.raw`Tiger and Allan play a game guessing whether a positive number of marbles is odd or even. If a player guesses correctly, the game repeats with the same player; if wrong, the other player guesses. A player wins after guessing correctly three times in a row. What is the expected number of guesses a game will take?`, choices: ["8","14","16","30","NOTA"], answer: "B",
    solution: String.raw`Let \(E_n\) be the expected remaining guesses with \(n\) consecutive wins. Then \(E_n=1+\frac12E_0+\frac12E_{n+1}\) for \(n=0,1,2\), with \(E_3=0\). Solving gives \(\boxed{E_0=14}\).` },
  { id: 30328, number: 328, division: "Theta", topic: "Polynomials", difficulty: 4, methods: ["Vieta's Formulas"],
    question: String.raw`Matthew's favorite cubic polynomial is \(M(x)=2x^3+5x^2-7x+4\) and has roots \(m_1,m_2,m_3\) (all distinct). Wetham's favorite cubic polynomial \(W(x)\) has roots \(\frac1{m_1},\frac1{m_2},\frac1{m_3}\). If \(M(0)=W(0)\), find \(W(2)\).`, choices: ["16","28","32","44","NOTA"], answer: "C",
    solution: String.raw`Reversing coefficients and scaling gives \(W(x)=k(4x^3-7x^2+5x+2)\). Since \(W(0)=M(0)=4\), \(k=2\), and \(W(2)=\boxed{32}\).` },
  { id: 30329, number: 329, division: "Theta", topic: "Combinatorics", difficulty: 1, methods: [],
    question: String.raw`Jae wants to make sure that he included the names he wanted on the test. So, he tries to list every distinct name written on this test in alphabetical order. How many distinct ways can he do this?`, choices: ["1","69","420","1337","NOTA"], answer: "A",
    solution: String.raw`There is only one alphabetical ordering of a fixed set of distinct names, so the answer is \(\boxed1\).` },

  // FAMAT State Convention 2021, Theta Individual.
  { id: 30330, number: 330, division: "Theta", topic: "Combinatorics", difficulty: 1, methods: ["Multinomial Theorem"],
    question: String.raw`How many distinguishable permutations exist for the word \(\text{NATIONALS}\)?`, choices: ["90,210","90,720","181,440","362,880","NOTA"], answer: "B",
    solution: String.raw`There are 9 letters to permute, with two A's and two N's. Thus the number of distinguishable permutations is \(\frac{9!}{2!2!}=\boxed{90,720}\).` },
  { id: 30331, number: 331, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: ["Vieta's Formulas"],
    question: String.raw`Given that \(r_1\) is the only real root of \(f(x)=x^3-15x-126=0\) and \(r_2\) and \(r_3\) are complex roots of \(f(x)\), find \(\frac1{r_2}+\frac1{r_3}\).`, choices: [String.raw`-\frac7{150}`,String.raw`-\frac27`,String.raw`-\frac1{21}`,"1","NOTA"], answer: "B",
    solution: String.raw`Checking small integers gives \(r_1=6\). By Vieta's formulas, \(r_2+r_3=-6\) and \(r_1r_2r_3=126\), so \(r_2r_3=21\). Therefore \(\frac1{r_2}+\frac1{r_3}=\frac{r_2+r_3}{r_2r_3}=\boxed{-\frac27}\).` },
  { id: 30332, number: 332, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`What is the area of the largest square that can be inscribed in the ellipse \(9x^2+16y^2=144\)?`, choices: [String.raw`\frac{576}{25}`,String.raw`\frac{144}{25}`,String.raw`\frac{25}{144}`,String.raw`\frac{25}{576}`,"NOTA"], answer: "A",
    solution: String.raw`The largest square is centered at the origin with vertices \((\pm t,\pm t)\). Substitution gives \(25t^2=144\). Its side length is \(2t\), so its area is \(4t^2=\boxed{\frac{576}{25}}\).` },
  { id: 30333, number: 333, division: "Theta", topic: "Conic Sections", difficulty: 2, methods: ["Completing the Square"],
    question: String.raw`Let \(g(x)=2x^2-3x+4\). Find the distance from the vertex of this parabola to its focus.`, choices: ["2","1","0.5","0.125","NOTA"], answer: "D",
    solution: String.raw`Completing the square puts the parabola in the form \(y=2(x-h)^2+k\). Comparing \((x-h)^2=4p(y-k)\) gives \(4p=\frac12\), so the vertex-to-focus distance is \(p=\boxed{\frac18}=0.125\).` },
  { id: 30334, number: 334, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    question: String.raw`The following system of equations has exactly one solution \((x_1,x_2,x_3,x_4)\). Find \(x_2+x_4\).\[\begin{aligned}2x_1-3x_2+x_3-x_4&=4\\-5x_1+x_2-x_3+2x_4&=-1\\x_2-x_3-4x_4&=-20\\3x_1-x_2+x_3+x_4&=11\end{aligned}\]`, choices: ["7","6","3","-3","NOTA"], answer: "C",
    solution: String.raw`Adding all four equations cancels the \(x_1\)- and \(x_3\)-terms and gives \(-2x_2-2x_4=-6\). Hence \(x_2+x_4=\boxed3\).` },
  { id: 30335, number: 335, division: "Theta", topic: "Functions", difficulty: 2, methods: ["Symmetry"],
    question: String.raw`Let \(f_1,f_2,\) and \(f_3\) be roots of \(F(x)=ax^3+bx^2+cx+d\), an odd function. Let \(g_1\) and \(g_2\) be two of the 5 roots of \(G(x)=\sqrt[5]{2}x^5-\sqrt[3]{3}x^3-2x^2+1\). Find the maximum possible value of \(f_1\cdot f_2\cdot f_3\cdot g_1\cdot g_2\).`, choices: ["1","0",String.raw`\sqrt2`,String.raw`-1+\sqrt2`,"NOTA"], answer: "B",
    solution: String.raw`An odd function has origin symmetry and must satisfy \(F(0)=0\). Thus one of \(f_1,f_2,f_3\) is 0, so the entire product is always \(\boxed0\).` },
  { id: 30336, number: 336, division: "Theta", topic: "Inequalities", difficulty: 2, methods: ["Absolute Value"],
    question: String.raw`How many integer solutions exist for the inequality \(\bigl||x-3|-4\bigr|\le7\)?`, choices: ["7","15","11","22","NOTA"], answer: "E",
    solution: String.raw`Since \(|x-3|-4\ge-4\), the lower bound is automatic. The upper bound gives \(|x-3|\le11\), so \(-8\le x\le14\). There are \(14-(-8)+1=23\) integer solutions, which is not listed. Thus the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30337, number: 337, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Base Conversion"],
    question: String.raw`When \(2020!\) is written in base 10, it has 5802 digits. When it is written in base \(b\), it has exactly half as many digits, where \(b\) is a perfect square. Compute the sum of the positive proper divisors of \(b\).`, choices: ["117","103","217","256","NOTA"], answer: "A",
    solution: String.raw`A base-100 digit represents exactly two base-10 digits, so \(b=100\) gives 2901 digits and is a perfect square. Its positive proper divisors are \(1,2,4,5,10,20,25,50\), whose sum is \(\boxed{117}\).` },
  { id: 30338, number: 338, division: "Theta", topic: "Geometry", difficulty: 5, methods: ["Tangency", "Pythagorean Theorem"],
    question: String.raw`Let triangle \(APX\) have a right angle at \(X\), and side lengths \(\overline{AX}=6\) and \(\overline{PX}=11\). Suppose a circle is to pass through point \(X\) such that it is tangent to side \(\overline{AP}\). What is the minimum area of this circle?`, choices: [String.raw`\frac{1024\pi}{169}`,String.raw`\frac{4356\pi}{157}`,String.raw`\frac{1089\pi}{157}`,String.raw`\frac{157\pi}{128}`,"NOTA"], answer: "C",
    solution: String.raw`The smallest such circle has the altitude from \(X\) to \(AP\) as a diameter. If that altitude is \(h\), then \(\frac1{h^2}=\frac1{6^2}+\frac1{11^2}\), so \(h^2=\frac{4356}{157}\). Therefore the circle's area is \(\frac{\pi h^2}{4}=\boxed{\frac{1089\pi}{157}}\).` },
  { id: 30339, number: 339, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    question: String.raw`The interior angle of a regular \(p\)-gon is \(176^\circ\). Consider a \((2p+1)\)-gon, then find the sum of the measures of its interior angles.`, choices: [String.raw`32{,}580^\circ`,String.raw`32{,}220^\circ`,String.raw`32{,}040^\circ`,String.raw`18{,}600^\circ`,"NOTA"], answer: "B",
    solution: String.raw`The exterior angle of the regular \(p\)-gon is \(4^\circ\), so \(p=360/4=90\). A \(181\)-gon has interior-angle sum \((181-2)180^\circ=\boxed{32{,}220^\circ}\).` },
  { id: 30340, number: 340, division: "Theta", topic: "Complex Numbers", difficulty: 3, methods: ["Vieta's Formulas"],
    question: String.raw`Let the solutions of \(x^2+2x+10=0\) be \(p\) and \(q\). Compute \(\frac{p^4}{4}+\frac{q^4}{4}\).`, choices: ["7","24",String.raw`14+48i`,String.raw`14-48i`,"NOTA"], answer: "E",
    solution: String.raw`By Vieta, \(p+q=-2\) and \(pq=10\). Thus \(p^2+q^2=(p+q)^2-2pq=-16\), and \(p^4+q^4=(p^2+q^2)^2-2p^2q^2=256-200=56\). The requested value is \(14\), which is not listed, so the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30341, number: 341, division: "Theta", topic: "Number Theory", difficulty: 2, methods: ["Modular Arithmetic"],
    question: String.raw`What are the last two digits of \(7^{2020}\)?`, choices: ["07","01","49","43","NOTA"], answer: "B",
    solution: String.raw`The last two digits of powers of 7 repeat every 4 powers: \(07,49,43,01\). Since \(2020\equiv0\pmod4\), the last two digits are \(\boxed{01}\).` },
  { id: 30342, number: 342, division: "Theta", topic: "Quadratics", difficulty: 3, methods: ["Discriminant Test"],
    question: String.raw`Let \(p(x)=\displaystyle\sum_{k=1}^{16}[(x-k)(x-2k)]\). Describe the roots of \(p(x)\).`, choices: ["Two positive reals","Two negative reals","One positive, one negative","Two non-reals","NOTA"], answer: "D",
    solution: String.raw`Expanding the sum gives \(p(x)=16x^2-408x+2992=8(2x^2-51x+374)\). Its discriminant is \((-51)^2-4(2)(374)=-391<0\), so it has \(\boxed{\text{two non-real roots}}\).` },
  { id: 30343, number: 343, division: "Theta", topic: "Sequences", difficulty: 3, methods: ["Geometric Sequence"],
    question: String.raw`The product of the first five terms of a geometric sequence is 1024. If the second term is 3, find the fifth term.`, choices: ["2","4","8","16","NOTA"], answer: "E",
    solution: String.raw`Let the middle term be \(a\). The product of the five terms is \(a^5=1024\), so \(a=4\). Since the second term is \(a/r=3\), \(r=4/3\). The fifth term is \(ar^2=\frac{64}{9}\), which is not listed, so the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30344, number: 344, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    question: String.raw`Which of the following statements must be true given that \(f\) is a function that satisfies the following properties?\[\begin{aligned}&\text{I. } f(x)\ge0\text{ for all }x\ge0\\&\text{II. } f(x+y)=\frac{yf(x)+xf(y)}2\end{aligned}\]`, choices: [String.raw`f(x)=0`,String.raw`f(0)=1`,String.raw`f(x)\text{ is not bounded above}`,String.raw`f(1)=-1`,"NOTA"], answer: "A",
    solution: String.raw`Set \(x=y=0\) in property II to get \(f(0)=0\). Then set \(y=0\): \(f(x)=\frac{x f(0)}2=0\) for every \(x\). Thus \(\boxed{f(x)=0}\).` },
  { id: 30345, number: 345, division: "Theta", topic: "Algebra", difficulty: 3, methods: [],
    question: String.raw`Let \(a=\sqrt{42+\sqrt{42+\sqrt{42+\cdots}}}\) and \(b=\sqrt[3]{-2+5\sqrt[3]{-2+5\sqrt[3]{-2+5\cdots}}}\), with \(a,b\in\mathbb Z\). Find the discriminant of \(y=x^2+bx-a\).`, choices: ["16","32","56","-24","NOTA"], answer: "B",
    solution: String.raw`The first radical satisfies \(a^2=42+a\), giving the positive integer \(a=7\). The second satisfies \(b^3=-2+5b\), and \(b=2\) is its integer value. The discriminant of \(x^2+bx-a\) is \(b^2+4a=4+28=\boxed{32}\).` },
  { id: 30346, number: 346, division: "Theta", topic: "Probability", difficulty: 4, methods: ["Inclusion-Exclusion"],
    question: String.raw`Compute the probability that in a given distinguishable permutation of the letters of \(\text{SCAROLINA}\), the C appears next to an A.`, choices: [String.raw`\frac1{18}`,String.raw`\frac29`,String.raw`\frac{16}{9!}`,String.raw`\frac1{9!}`,"NOTA"], answer: "E",
    solution: String.raw`There are \(9!/2!\) distinguishable permutations. Treating CA or AC as a block gives \(8!\) arrangements of each type, but the \(7!\) arrangements containing the block ACA are counted twice. Thus the probability is \(\frac{2\cdot8!-7!}{9!/2!}=\frac5{12}\), which is not listed. Therefore the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30347, number: 347, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`Alex was the only person absent on quiz day in Mr. Friedlander's class. Without him, the class average was 87. Once he made up the quiz with a score of 99, the class average increased to 89. How many total people are in Mr. Friedlander's class?`, choices: ["10","8","7","6","NOTA"], answer: "D",
    solution: String.raw`Let \(n\) be the number of students who took the quiz before Alex. Then \(87n+99=89(n+1)\), so \(n=5\). Including Alex, the class has \(\boxed6\) students.` },
  { id: 30348, number: 348, division: "Theta", topic: "Geometric Series", difficulty: 2, methods: [],
    question: String.raw`Let \(f(x)=\displaystyle\sum_{n=1}^{2020}2^n x^n\), then find the nearest integer to \(\frac{f(1)}{2^{2019}}\).`, choices: ["8","4","2","1","NOTA"], answer: "B",
    solution: String.raw`The geometric sum is \(f(1)=2+4+\cdots+2^{2020}=2^{2021}-2\). Hence \(\frac{f(1)}{2^{2019}}=4-\frac2{2^{2019}}\), whose nearest integer is \(\boxed4\).` },
  { id: 30349, number: 349, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`Which of the following statements about functions are always true?\[\begin{aligned}&\text{I. A function can have a greatest lower bound but no minimum.}\\&\text{II. An odd function can be constant.}\\&\text{III. A function that passes the vertical line test is invertible.}\\&\text{IV. A function can intersect its inverse infinitely many times.}\end{aligned}\]`, choices: ["I, II, IV","I, II, III, IV","I, IV","II, III, IV","NOTA"], answer: "A",
    solution: String.raw`I is true, for example \(e^x\) has greatest lower bound 0 but no minimum. II is true because the zero function is odd and constant. III is false because the vertical line test only establishes that a relation is a function, not that it is one-to-one. IV is true because \(y=x\) is its own inverse. Thus \(\boxed{\text{I, II, IV}}\).` },
  { id: 30350, number: 350, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    question: String.raw`Find the area bounded by the graphs of \(y=\frac{x}{2}-3\), \(y=2x-18\), and the line \(y=-2\).`, choices: ["24","12","6","3","NOTA"], answer: "B",
    solution: String.raw`The first line meets \(y=-2\) at \(x=2\), and the second meets it at \(x=8\), so the triangle's base is 6. The slanted lines meet at \((10,2)\), giving height 4. Thus the area is \(\frac12(6)(4)=\boxed{12}\).` },
  { id: 30351, number: 351, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: ["Absolute Value", "Vieta's Formulas"],
    question: String.raw`Find the sum of the solutions to \(\lvert10x^2-30x+20\rvert=x\).`, choices: [String.raw`\frac{31}{10}`,String.raw`\frac{29}{10}`,String.raw`\frac{41}{10}`,String.raw`\frac{17}{10}`,"NOTA"], answer: "E",
    solution: String.raw`The two cases are \(10x^2-30x+20=x\), whose roots sum to \(31/10\), and \(10x^2-30x+20=-x\), whose roots sum to \(29/10\). All four roots satisfy their respective sign conditions, so the total is \(6\), which is not listed. Thus the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30352, number: 352, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pythagorean Theorem"],
    question: String.raw`Two parallel chords with length 8 and 10 lie within a circle such that the center of the circle is between them. Let the distance from the center to the shorter chord be \(m\) and the distance to the longer chord be \(n\). Given that \(m+n=10\), find \(mn\).`, choices: ["10","100",String.raw`\frac{9919}{400}`,String.raw`\frac{10081}{400}`,"NOTA"], answer: "C",
    solution: String.raw`Perpendiculars from the center bisect the chords, so \(m^2+4^2=r^2\) and \(n^2+5^2=r^2\). Thus \((m-n)(m+n)=9\), giving \(m-n=9/10\). With \(m+n=10\), \(m=109/20\) and \(n=91/20\), so \(mn=\boxed{\frac{9919}{400}}\).` },
  { id: 30353, number: 353, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`The quantity \(\sqrt{4+\sqrt{12}}\) can be written as \(\sqrt a+\sqrt b\), where \(a\) is not prime and \(b\) is not divisible by the square of any prime. Compute \((10b+a)^{b-a}\).`, choices: ["961","441","121","1","NOTA"], answer: "A",
    solution: String.raw`Squaring \(\sqrt a+\sqrt b\) gives \(a+b+2\sqrt{ab}=4+\sqrt{12}\). Thus \(a+b=4\) and \(ab=3\). The conditions select \(a=1,b=3\), so \((10b+a)^{b-a}=31^2=\boxed{961}\).` },
  { id: 30354, number: 354, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Base Conversion"],
    question: String.raw`Rational number \(r\) is the largest number less than 1 whose base 5 expansion has two distinct repeating digits, \(r=0.\overline{ABABAB\ldots}_5\). Written as a reduced fraction, \(r=\frac pq\). Compute \(p+q\).`, choices: ["47","24","39","95","NOTA"], answer: "A",
    solution: String.raw`The largest possible distinct repeating digits are \(A=4\) and \(B=3\), so \(r=0.\overline{43}_5\). Therefore \(r=\frac{(43)_5}{5^2-1}=\frac{23}{24}\), and \(p+q=\boxed{47}\).` },
  { id: 30355, number: 355, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pythagorean Theorem"],
    question: String.raw`Quadrilateral \(LMAO\) is a kite with \(LM=MA=5\), \(LA=8\), and \(MO=11\). Compute the length of \(LO\).`, choices: [String.raw`4\sqrt3`,"8",String.raw`4\sqrt5`,String.raw`4\sqrt6`,"NOTA"], answer: "C",
    solution: String.raw`Let the diagonals \(LA\) and \(MO\) meet at \(X\). In a kite, \(MO\) perpendicularly bisects \(LA\), so \(LX=4\). From right triangle \(LMX\), \(MX=3\), hence \(XO=11-3=8\). Therefore \(LO=\sqrt{4^2+8^2}=\boxed{4\sqrt5}\).` },
  { id: 30356, number: 356, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    question: String.raw`In interval notation, what is the solution set of the inequality \(\frac{x+2}{x-3}\le5\)?`, choices: [String.raw`(-\infty,-3)\cup[5,\infty)`,String.raw`(-\infty,-3]\cup\left[\frac{17}{4},\infty\right)`,String.raw`(-\infty,\infty)`,String.raw`(-\infty,3)\cup\left[\frac{17}{4},\infty\right)`,"NOTA"], answer: "D",
    solution: String.raw`Moving everything to one side gives \(\frac{-4x+17}{x-3}\le0\). Its critical values are \(3\), where the expression is undefined, and \(17/4\), where it is zero. A sign chart gives \(\boxed{(-\infty,3)\cup\left[\frac{17}{4},\infty\right)}\).` },
  { id: 30357, number: 357, division: "Theta", topic: "Polynomials", difficulty: 4, methods: ["Vieta's Formulas"],
    question: String.raw`The roots of \(d(x)=x^3-9x^2+21x+D\) form an arithmetic progression. Find the sum of the reciprocals of the roots of \(d(x)\).`, choices: ["9",String.raw`\frac{10}{3}`,String.raw`\frac73`,"21","NOTA"], answer: "C",
    solution: String.raw`Write the roots as \(p-r,p,p+r\). Their sum is \(3p=9\), so \(p=3\). Substituting \(x=3\) into the polynomial gives \(27-81+63+D=0\), hence \(D=-9\). By Vieta's formulas, the sum of the reciprocals is \(\frac{21}{-D}=\boxed{\frac73}\).` },
  { id: 30358, number: 358, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`For this question, \(\lfloor x\rfloor\) means "the greatest integer less than or equal to \(x\)." The smallest \(x\) that satisfies the equation \(\left\lfloor\lfloor x\rfloor+0.5\right\rfloor=20\) is the positive square root of what number?`, choices: ["324","361","441","484","NOTA"], answer: "E",
    solution: String.raw`Because \(\lfloor x\rfloor\) is an integer, \(\left\lfloor\lfloor x\rfloor+0.5\right\rfloor=\lfloor x\rfloor\). Thus the smallest \(x\) is 20, which is the positive square root of 400. Since 400 is not listed, the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30359, number: 359, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: [],
    question: String.raw`Given that \(\log2=a\) and \(\log3=b\), express \(\log375\) in terms of \(a\) and \(b\).`, choices: [String.raw`\frac{3-a}{b}`,String.raw`b-3a+3`,String.raw`3ab-b`,String.raw`a+3b-3`,"NOTA"], answer: "B",
    solution: String.raw`Since \(375=3\cdot5^3\), \(\log375=b+3\log5\). Also \(\log5=\log(10/2)=1-a\). Therefore \(\log375=b+3(1-a)=\boxed{b-3a+3}\).` },
];
