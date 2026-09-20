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
];
