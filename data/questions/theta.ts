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
];
