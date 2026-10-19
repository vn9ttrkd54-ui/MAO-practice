import type { Question } from "@/types/question";

const chilesStatewide2025Source = {
  competition: "2025 Chiles Statewide",
  event: "Algebra 2 Individual",
};

// Chiles Statewide Competition, January 11, 2025. Source #9 was thrown out.
export const thetaQuestions: Question[] = [
  {
    id: 30001, number: 1, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: ["Tangency"],
    source: { ...chilesStatewide2025Source, questionNumber: 1 },
    question: String.raw`When graphed on the real \(xy\)-plane, the graphs of \((x-1)^2+(y+3)^2=4\) and \(x=3\) intersect at how many distinct points?`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`The first equation is a circle whose center is at \((1,-3)\) and radius \(2\). That means the circle contains the point \((3,-3)\), through which \(x=3\) passes. To check that this is the only intersection, substitute \(x=3\):
\[(3-1)^2+(y+3)^2=4\quad\Longrightarrow\quad(y+3)^2=0.\]
Thus \(y=-3\) is the only possibility. The line \(x=3\) is tangent to the circle at \((3,-3)\), so there is \(\boxed{1}\) distinct intersection point.`,
  },
  {
    id: 30002, number: 2, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Remainder Theorem"],
    source: { ...chilesStatewide2025Source, questionNumber: 2 },
    question: String.raw`The polynomial \(P=3x^3-9x^2+kx-18\) has \((x-3)\) as a factor. Which is also a factor of the polynomial \(P\)?`,
    choices: [String.raw`\(x^2+2\)`, String.raw`\(3x+6\)`, String.raw`\(3x^2-6\)`, String.raw`\(x^2-2x\)`, "NOTA"], answer: "A",
    solution: String.raw`Since \((x-3)\) is a factor, \(P(3)=0\). Thus \(81-81+3k-18=0\), and \(k=6\).
\[P=3x^3-9x^2+6x-18=3x^2(x-3)+6(x-3)=3(x^2+2)(x-3).\]
Of the choices, \(\boxed{x^2+2}\) is a factor.`,
  },
  {
    id: 30003, number: 3, division: "Theta", topic: "Rate of Change", difficulty: 1, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 3 },
    question: String.raw`A car travels \(\frac{x}{12}\) feet in \(y\) seconds. If this rate is maintained, then in \(6\) seconds, how many yards does the car travel?`,
    choices: [String.raw`\(\frac{x}{6y}\)`, String.raw`\(\frac{x}{36y}\)`, String.raw`\(\frac{xy}{36}\)`, String.raw`\(\frac{4x}{y}\)`, "NOTA"], answer: "A",
    solution: String.raw`The rate is \(\frac{x}{12y}\) feet per second. In \(6\) seconds the car travels \(\frac{x}{2y}\) feet. Dividing by \(3\) feet per yard gives \(\boxed{\frac{x}{6y}}\) yards.`,
  },
  {
    id: 30004, number: 4, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: ["Change of Base"],
    source: { ...chilesStatewide2025Source, questionNumber: 4 },
    question: String.raw`For \(y=\log16\div\log\left(\frac18\right)\), give the value of \(120-12y\).`,
    choices: ["140", "136", "104", "98", "NOTA"], answer: "B",
    solution: String.raw`Both logarithms have the same base. Using \(16=2^4\) and \(\frac18=2^{-3}\), the logarithm power rule gives
\[y=\frac{\log(2^4)}{\log(2^{-3})}=\frac{4\log2}{-3\log2}=-\frac43.\]
So \(120-12y=120-12\left(-\frac43\right)=\boxed{136}\).`,
  },
  {
    id: 30005, number: 5, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 5 },
    question: String.raw`A jar contains \(n\) ounces of a solution which is \(n\%\) sugar. Assume \(0<n<50\), and all ounces and percentages are measured by mass. How many ounces of pure sugar must be added to make the resultant solution \(2n\%\) sugar?`,
    choices: [String.raw`\(\frac{50n}{50-n}\)`, String.raw`\(\frac n{50}\)`, String.raw`\(\frac{100n}{100-n}\)`, String.raw`\(\frac{n^2}{100-2n}\)`, "NOTA"], answer: "D",
    solution: String.raw`If there are \(n\) ounces, and \(n\%\) is sugar, then there is \(\frac{n}{100}(n)=\frac{n^2}{100}\) ounces of sugar. If we add \(x\) ounces of pure sugar, the sugar mass becomes \(\frac{n^2}{100}+x\) and the total mass becomes \(n+x\). Therefore
\[\frac{n^2/100+x}{n+x}=\frac{2n}{100}.\]
Multiplying by \(100(n+x)\) gives
\[n^2+100x=2n^2+2nx,\qquad x(100-2n)=n^2.\]
Thus \(x=\boxed{\frac{n^2}{100-2n}}\) ounces. The assumption \(0<n<50\) makes this a positive, finite amount and keeps the target percentage below \(100\%\).`,
  },
  {
    id: 30006, number: 6, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 6 },
    question: String.raw`Fifteen of the first \(20\) questions of a test were answered correctly by Ralph. On the rest of the test, Ralph answered \(\frac13\) of the questions correctly. He answered \(50\%\) correctly in all, of the \(T\) total questions. If he had answered \(X\) more of the questions correctly (out of the \(T\) total) he would have gotten \(60\%\) correct. Find the value of \(X\).`,
    choices: ["5", "8", "10", "12", "NOTA"], answer: "A",
    solution: String.raw`Ralph got correct \(15+\frac13(T-20)=\frac12T\), for total number of questions \(T\). Expanding and collecting terms gives
\[15+\frac13T-\frac{20}{3}=\frac12T,\qquad \frac{25}{3}=\frac16T.\]
Thus \(T=50\) questions. He answered correctly \(15+10=25\) questions. If he had answered \(X\) more correctly, then he would have had \(X+25\) correct out of \(50\):
\[\frac{X+25}{50}=\frac35\quad\Longrightarrow\quad X+25=30.\]
\(X\) would be \(\boxed5\) more questions.`,
  },
  {
    id: 30007, number: 7, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 7 },
    question: String.raw`A balanced scale is available to weigh packages which may weigh from \(1\) lb to \(9\) pounds, inclusive. All packages have integral weights. If you can use a \(1\) lb, a \(3\) lb, and/or a \(5\) lb weight on either plate of the scale, in addition to the object to be weighed, how many distinct pound weights \(\{1,2,\ldots,9\}\) of packages can you accurately determine? (Note: the weights can be put on either or both plates of the scale.)`,
    choices: ["5", "6", "8", "9", "NOTA"], answer: "D",
    solution: String.raw`All are possible. Keep the object on the left plate and put the available weights on either plate as shown. Every row balances using each of the \(1\), \(3\), and \(5\) lb weights at most once.
[[solution-diagram:theta-7]]
For example, a \(2\) lb package together with the \(1\) lb weight balances the \(3\) lb weight, and a \(7\) lb package together with the \(1\) lb weight balances the \(5\) lb and \(3\) lb weights. The table covers every integer weight from \(1\) to \(9\), so all \(\boxed9\) package weights can be determined.`,
    illustration: {
      src: "/questions/theta-7-balance-scale.svg",
      alt: "A two-pan balance scale with an object on the lower left pan, alongside separate 1-pound, 3-pound, and 5-pound weights; no object weight is specified by the illustration.",
      width: 600,
      height: 230,
    },
  },
  {
    id: 30008, number: 8, division: "Theta", topic: "Simplification", difficulty: 2, methods: ["Difference of Squares"],
    source: { ...chilesStatewide2025Source, questionNumber: 8 },
    question: String.raw`The expression,
\[\frac{x^2+y^2-z^2+2xy}{x^2+z^2-y^2+2xz},\]
where defined, can be reduced to which of the following?`,
    choices: [String.raw`\(\frac{x(x+y)}{z(x-y)}\)`, String.raw`\(-1\)`, String.raw`\(\frac{x+y-z}{x+z-y}\)`, String.raw`\(\frac{x-y+z}{x+y-z}\)`, "NOTA"], answer: "C",
    solution: String.raw`Group the numerator as \((x+y)^2-z^2\) and the denominator as \((x+z)^2-y^2\). Use difference of squares:
\[\frac{(x+y-z)(x+y+z)}{(x+z-y)(x+z+y)}
=\boxed{\frac{x+y-z}{x+z-y}},\]
The second factor cancels because \(x+y+z=x+z+y\). This cancellation is valid only where the original expression is defined: \(x+y+z\ne0\) and \(x+z-y\ne0\). Simplifying does not restore any originally excluded values.`,
  },
  {
    id: 30010, number: 10, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 10 },
    question: String.raw`The expression \(84k\), for positive integer \(k\), can be divided into three parts which are in the ratio of \(1:\frac13:\frac16\). If each of the parts are integers, then what is the least possible value of the largest part?`,
    choices: ["112", "142", "152", "168", "NOTA"], answer: "D",
    solution: String.raw`Since the ratio is \(1:\frac13:\frac16\), let the parts be \(x,\frac x3,\frac x6\). Their sum is \(84k\):
\[x+\frac13x+\frac16x=84k.\]
Multiply by \(6\): \(6x+2x+x=504k\), so \(9x=504k\) and \(x=56k\). The parts are therefore
\[56k,\quad\frac{56k}{3},\quad\frac{28k}{3}.\]
Since neither \(56\) nor \(28\) is divisible by \(3\), these are all integers exactly when \(k\) is a multiple of \(3\). The least positive choice is \(k=3\), giving parts \(168,56,28\). The largest is \(\boxed{168}\). Larger positive \(k\) only increases it.`,
  },
  {
    id: 30011, number: 11, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 11 },
    question: String.raw`The sum of the real solutions of \(\sqrt{3x+1}+\sqrt{x-4}=5\) is ...`,
    choices: ["45", "40", "35", "5", "NOTA"], answer: "D",
    solution: String.raw`The radicals require \(x\ge4\). Isolate one radical and square:
\[\sqrt{3x+1}=5-\sqrt{x-4},\]
\[3x+1=25-10\sqrt{x-4}+x-4.\]
Collecting terms gives \(5\sqrt{x-4}=10-x\). Its left side is nonnegative, so any solution also satisfies \(x\le10\). Square again:
\[25(x-4)=(10-x)^2,\]
\[x^2-45x+200=0,\qquad(x-5)(x-40)=0.\]
This produces candidates \(x=5\) and \(x=40\). At \(x=5\), the original left side is \(\sqrt{16}+\sqrt1=5\). At \(x=40\), it is \(11+6=17\ne5\); that candidate is extraneous. The only real solution is \(5\), so the sum is \(\boxed5\).`,
  },
  {
    id: 30012, number: 12, division: "Theta", topic: "Analytic Geometry", difficulty: 3, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 12 },
    question: String.raw`A circle is graphed on the \(xy\)-plane so that it passes through the points \((0,1)\), \((0,3)\) and \((5,8)\). Find the radius of the circle.`,
    choices: [String.raw`\(\sqrt{37}\)`, "6", String.raw`\(\sqrt{35}\)`, String.raw`\(\sqrt{35}\)`, "NOTA"], answer: "A",
    solution: String.raw`Let the circle have equation \(x^2+y^2+ax+by+c=0\). From \((0,1)\), we get \(1+b+c=0\), or \(b+c=-1\). From \((0,3)\), we have \(9+3b+c=0\), or \(3b+c=-9\). Subtract \(b+c=-1\) to get \(2b=-8\), so \(b=-4\) and \(c=3\). Use \((5,8)\) to get
\[25+64+5a+8b+c=0,\]
\[25+64+5a-32+3=0,\qquad a=-12.\]
Thus the circle's equation becomes \(x^2+y^2-12x-4y+3=0\). Completing the square,
\[(x-6)^2+(y-2)^2=37,\]
so its center is \((6,2)\) and its radius is \(\boxed{\sqrt{37}}\).`,
  },
  {
    id: 30013, number: 13, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 13 },
    question: String.raw`\(f(x)=\frac{x-2}{x+5}\) and \(g(x)=\frac{x+10}{x-8}\). The domain of the function \(y=g(f(x))\) is all real numbers with the exception of which values?`,
    choices: [String.raw`\(5,8\)`, String.raw`\(-5,8\)`, String.raw`\(-5,-6\)`, String.raw`\(-8,-5\)`, "NOTA"], answer: "C",
    solution: String.raw`For \(g(f(x))\) to be defined, \(f\) must be defined, so \(x\ne-5\). Then the function \(f\) cannot be equal to \(8\), since this would make the denominator of \(g(f(x))\) zero. Solve for this additional excluded input:
\[\frac{x-2}{x+5}=8\quad\Longrightarrow\quad x-2=8x+40\quad\Longrightarrow\quad x=-6.\]
For every other real input both stages are defined. Thus the excluded values are \(\boxed{-5,-6}\). The exclusion \(x=-5\) remains even if an algebraically simplified composite cancels the factor \(x+5\).`,
  },
  {
    id: 30014, number: 14, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 14 },
    question: String.raw`\(\sqrt{8a}\cdot\sqrt{2a}\), for real \(a<0\), is equal to which of the following expressions? Use principal square roots.`,
    choices: [String.raw`\(-4a\)`, String.raw`\(-4|a|\)`, String.raw`\(4|a|\)`, String.raw`\(4i|a|\)`, "NOTA"], answer: "B",
    solution: String.raw`Since \(a<0\), \(\sqrt{8a}=i\sqrt{8|a|}\) and \(\sqrt{2a}=i\sqrt{2|a|}\). Their product is
\[i^2\sqrt{16a^2}=\boxed{-4|a|}.\]
The identity \(\sqrt{u}\sqrt{v}=\sqrt{uv}\) cannot be applied indiscriminately to negative radicands: here the two factors of \(i\) produce a minus sign. The absolute value is needed because \(\sqrt{a^2}=|a|\). For \(a<0\), choices A and C are positive, while D is nonreal; only B is the required negative real number.`,
  },
  {
    id: 30015, number: 15, division: "Theta", topic: "Number Theory", difficulty: 2, methods: ["Modular Arithmetic"],
    source: { ...chilesStatewide2025Source, questionNumber: 15 },
    question: String.raw`Find the remainder when \(3^{21}+4^{22}+5^{23}\) is divided by \(10\).`,
    choices: ["0", "3", "4", "7", "NOTA"], answer: "C",
    solution: String.raw`The units digits of successive positive powers of \(3\) cycle through \(3,9,7,1\). Every power whose exponent is a multiple of \(4\) has units digit \(1\). Since \(21\equiv1\pmod4\), \(3^{21}\) has units digit \(3\).

Similarly, the units digits of powers of \(4\) alternate \(4,6\). Since \(22\) is even, \(4^{22}\) ends with \(6\). All positive powers of \(5\) end with \(5\), so \(5^{23}\) ends with \(5\). Thus the sum has the same remainder modulo \(10\) as \(3+6+5=14\). The remainder is \(\boxed4\).`,
  },
  {
    id: 30016, number: 16, division: "Theta", topic: "Polynomials", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 16 },
    question: String.raw`Two complex numbers have a sum of \(2\). The two numbers have a product of \(2\). What is the sum of the cubes of the two numbers?`,
    choices: [String.raw`\(-8\)`, String.raw`\(-4\)`, String.raw`\(4i\)`, String.raw`\(8i\)`, "NOTA"], answer: "B",
    solution: String.raw`Let the numbers be \(a\) and \(b\), so \(a+b=2\) and \(ab=2\). Expanding the cube of their sum gives
\[(a+b)^3=a^3+3a^2b+3ab^2+b^3\]
\[=a^3+b^3+3ab(a+b).\]
Hence
\[a^3+b^3=(a+b)^3-3ab(a+b)\]
\[=2^3-3(2)(2)=8-12=\boxed{-4}.\]
Such numbers do exist over the complex numbers: they are the roots \(1+i\) and \(1-i\) of \(t^2-2t+2=0\). There is no real pair with the stated sum and product.`,
  },
  {
    id: 30017, number: 17, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Completing the Square"],
    source: { ...chilesStatewide2025Source, questionNumber: 17 },
    question: String.raw`The conic with equation \(9x^2-4y^2-18x+16y+29=0\) has foci on points \(P\) and \(Q\). Which could be the coordinates of \(P\)?`,
    choices: [String.raw`\((1,2-\sqrt{13})\)`, String.raw`\((1+\sqrt{13},2)\)`, String.raw`\((1+\sqrt{13},-2)\)`, String.raw`\((-1,2+\sqrt{13})\)`, "NOTA"], answer: "A",
    solution: String.raw`Move the constant and group the \(x\) and \(y\) terms:
\[9(x^2-2x)-4(y^2-4y)=-29.\]
Completing the square gives
\[9(x-1)^2-4(y-2)^2=-29+9-16=-36.\]
Divide by \(-36\) to obtain
\[\frac{(y-2)^2}{9}-\frac{(x-1)^2}{4}=1.\]
The hyperbola has center \((1,2)\) and a transverse axis that is vertical. For a hyperbola, \(c^2=a^2+b^2=9+4=13\), so \(c=\sqrt{13}\). Therefore the foci are \((1,2\pm\sqrt{13})\), and \(\boxed{(1,2-\sqrt{13})}\) could be \(P\).`,
  },
  {
    id: 30018, number: 18, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 18 },
    question: String.raw`The operation \(@\) is defined by \(x@y=x^2-2xy+y^2\). Find the value of \((2027@2025)\).`,
    choices: ["16", "4", String.raw`\(-8\)`, String.raw`\(-16\)`, "NOTA"], answer: "B",
    solution: String.raw`Since \(x^2-2xy+y^2=(x-y)^2\), \((2027@2025)=(2027-2025)^2=\boxed4\).`,
  },
  {
    id: 30019, number: 19, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 19 },
    question: String.raw`The population of Logville is \(P>0\) on January 1, 2021. In the following years, on January 1 of each year, the population is measured and the results show an increase of \(25\%\), a decrease of \(25\%\), an increase of \(25\%\), and a decrease of \(25\%\), in that order. Each increase or decrease is from the previous year's population. On January 1, 2025, express the amount by which the population has decreased as a fraction of its original population, in lowest terms. What is the numerator of that fraction?`,
    choices: ["25", "31", "75", "225", "NOTA"], answer: "B",
    solution: String.raw`In \(2021\), the population is \(P\). An increase of \(25\%\) multiplies the preceding population by \(\frac54\), while a decrease of \(25\%\) multiplies it by \(\frac34\). Thus
\[\begin{aligned}
\text{2022: }&\frac54P,\\
\text{2023: }&\frac54P\cdot\frac34=\frac{15}{16}P,\\
\text{2024: }&\frac{15}{16}P\cdot\frac54=\frac{75}{64}P,\\
\text{2025: }&\frac{75}{64}P\cdot\frac34=\frac{225}{256}P.
\end{aligned}\]
The population decreased by \(P-\frac{225}{256}P=\frac{31}{256}P\). Divide by the original population \(P\) to obtain the fractional decrease \(\frac{31}{256}\). Since \(31\) and \(256\) are relatively prime, the numerator is \(\boxed{31}\). Equal percentage increases and decreases do not cancel because they apply to different populations.`,
  },
  {
    id: 30020, number: 20, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant"],
    source: { ...chilesStatewide2025Source, questionNumber: 20 },
    question: String.raw`\[\begin{vmatrix}1&3&-1\\4&x&y\\1&2&5\end{vmatrix}=15\]
and \(y=x+6\). Find the value of \(x\).`,
    choices: ["11", "9", "5", "2", "NOTA"], answer: "A",
    solution: String.raw`Expanding the determinant along its first row gives
\[1(5x-2y)-3(20-y)+(-1)(8-x)=15.\]
The signs of the first-row cofactors alternate plus, minus, plus; the third entry itself is \(-1\). Collecting terms,
\[5x-2y-60+3y-8+x=15,\]
\[6x+y=83.\]
Since \(y=x+6\), we have \(6x+x+6=83\), so \(7x=77\) and \(x=\boxed{11}\). This gives \(y=17\), which checks in the determinant.`,
  },
  {
    id: 30021, number: 21, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 21 },
    question: String.raw`\[\frac{x-1}{6}=\frac{z}{-18}=\frac y3.\]
If \(y=12\), then give the value of \(x+z\).`,
    choices: ["97", "49", String.raw`\(-47\)`, String.raw`\(-72\)`, "NOTA"], answer: "C",
    solution: String.raw`Since \(y=12\), the common ratio is \(\frac y3=\frac{12}{3}=4\). Therefore
\[\frac{x-1}{6}=4\quad\Longrightarrow\quad x-1=24\quad\Longrightarrow\quad x=25,\]
\[\frac{z}{-18}=4\quad\Longrightarrow\quad z=-72.\]
Thus \(x+z=25-72=\boxed{-47}\).`,
  },
  {
    id: 30022, number: 22, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 22 },
    question: String.raw`For \(f(2x-5)=x^2-2x-3\), which is NOT an integral factor of the value of \(f(2025)\)?`,
    choices: ["2032", "1012", "936", "8", "NOTA"], answer: "C",
    solution: String.raw`Set \(2x-5=2025\), giving \(x=1015\). Then
\[f(2025)=(1015-3)(1015+1)=(1012)(1016).\]
Choice A is a factor because \(2032=2(1016)\) and \(1012\) is even: the quotient is \(506\). Choice B, \(1012\), is visibly a factor. Choice D, \(8\), divides \(1016=8\cdot127\), so it is also a factor.

But \(936\) is divisible by \(3\), while the digit sums of \(1012\) and \(1016\) are \(4\) and \(8\), respectively. Neither factor is divisible by \(3\), so their product is not divisible by \(3\). It cannot be divisible by \(936\). Therefore \(\boxed{936}\) is not an integral factor.`,
  },
  {
    id: 30023, number: 23, division: "Theta", topic: "Complex Numbers", difficulty: 1, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 23 },
    question: String.raw`Consider the following numbers:
\[\text{I. }\pi\qquad \text{II. }8-\sqrt{-8}\qquad \text{III. }\frac3{\sqrt{16}}\qquad \text{IV. }5+\sqrt3.\]
Which of the following above is/are complex numbers?`,
    choices: ["I, II only", "I only", "III, IV only", "I, III only", "NOTA"], answer: "E",
    solution: String.raw`All of the given numbers are complex. Every real number is also a complex number with imaginary part \(0\): \(\pi=\pi+0i\), \(\frac3{\sqrt{16}}=\frac34+0i\), and \(5+\sqrt3=(5+\sqrt3)+0i\). For II, \(\sqrt{-8}=2\sqrt2\,i\), so \(8-\sqrt{-8}=8-2\sqrt2\,i\), a nonreal complex number.

Thus I, II, III, and IV are all complex. That combination is not listed, so the answer is \(\boxed{\text{NOTA}}\). Complex does not mean exclusively nonreal.`,
  },
  {
    id: 30024, number: 24, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 24 },
    question: String.raw`The integer value of \(202!\) is evenly divisible by \(6^n\). What is the greatest possible integer value of \(n\)?`,
    choices: ["99", "98", "97", "96", "NOTA"], answer: "B",
    solution: String.raw`\(202!=202(201)(200)\cdots(2)(1)\). To get a factor of \(6\), we need a \(3\) and a \(2\). Count the prime factors separately.

There are \(\lfloor202/3\rfloor=67\) multiples of \(3\). Multiples of \(9\) supply an additional \(22\) factors of \(3\), multiples of \(27\) supply \(7\) more, and multiples of \(81\) supply \(2\) more. There are no multiples of \(243\). Hence
\[v_3(202!)=67+22+7+2=98.\]
Likewise, counting multiples of successive powers of \(2\) gives
\[v_2(202!)=101+50+25+12+6+3+1=198.\]
Since \(6^n=2^n3^n\), both prime exponents must be at least \(n\). The largest possible value is therefore \(\min(198,98)=\boxed{98}\). A factor \(6^{99}\) would require a ninety-ninth factor of \(3\), which is not available.`,
  },
  {
    id: 30025, number: 25, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 25 },
    question: String.raw`Give the sum of the integral values of \(x\) for which
\[\left(x^2-2x-4\right)^{x^2-6x+9}=1.\]`,
    choices: ["4", "3", "2", "1", "NOTA"], answer: "C",
    solution: String.raw`For integral \(x\), the exponent is the nonnegative integer \((x-3)^2\), and the base is an integer. If the exponent is \(0\), and the base is not zero, we have a solution. This happens for \(x=3\): the base is \(-1\), so \((-1)^0=1\).

For \(x\ne3\), the exponent is positive. An integer base can have a positive integral power equal to \(1\) only if it is \(1\), or if it is \(-1\) and the exponent is even. A base of absolute value greater than \(1\) gives absolute value greater than \(1\); a zero base gives \(0\).

If the base is \(1\), we have \(x^2-2x-4=1\), so \(x=1\pm\sqrt6\), neither of which is an integer. For base \(-1\),
\[x^2-2x-4=-1\quad\Longrightarrow\quad(x-3)(x+1)=0.\]
This gives \(x=3\) again and \(x=-1\); at \(x=-1\), the exponent is \(16\), which is even. The distinct integral solutions are \(-1\) and \(3\), whose sum is \(\boxed2\).`,
  },
  {
    id: 30026, number: 26, division: "Theta", topic: "Functions", difficulty: 1, methods: ["Absolute Value"],
    source: { ...chilesStatewide2025Source, questionNumber: 26 },
    question: String.raw`Give the greatest value of \(x\) for which \(4-|x-5|=-1\).`,
    choices: ["10", "8", "2", "0", "NOTA"], answer: "A",
    solution: String.raw`The equation is equivalent to \(|x-5|=5\), so \(x=0\) or \(x=10\). The greatest value is \(\boxed{10}\).`,
  },
  {
    id: 30027, number: 27, division: "Theta", topic: "Functions", difficulty: 3, methods: ["Absolute Value"],
    source: { ...chilesStatewide2025Source, questionNumber: 27 },
    question: String.raw`Which of the following equations has a graph that intersects \(y=|x-3|\) at an infinite number of points?
\[\begin{aligned}\text{I. }&y=|x|-3\\\text{II. }&y=|3-x|\\\text{III. }&y=|x-6|+3\\\text{IV. }&y=3-x\\\text{V. }&y=-|3-x|\end{aligned}\]`,
    choices: ["I, II, III, IV, V", "I, II, III, IV only", "II, IV, V only", "I, II, IV, V only", "NOTA"], answer: "B",
    solution: String.raw`The graph \(y=|x-3|\) has two branches: \(y=x-3\) for \(x\ge3\), and \(y=3-x\) for \(x\le3\). Sharing a whole ray gives infinitely many intersection points.

I. For \(x\ge3\), \(|x|-3=x-3=|x-3|\). Thus I shares the right-hand ray.

II. \(|3-x|=|x-3|\) for every real \(x\), so II is the same graph.

III. For \(x\ge6\), \(|x-6|+3=x-6+3=x-3=|x-3|\). Thus III shares a right-hand ray.

IV. For \(x\le3\), \(3-x=|x-3|\). Thus IV shares the left-hand ray.

V. The graph of V coincides only at \((3,0)\): since \(-|3-x|=-|x-3|\), equality would require \(|x-3|=-|x-3|\), or \(|x-3|=0\). This gives just \(x=3\).

The answer is \(\boxed{\text{I, II, III, IV only}}\).`,
  },
  {
    id: 30028, number: 28, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 28 },
    question: String.raw`For complex numbers \(x\) and \(y\), \(x\ne y\), \(x^2=19x+y\) and \(y^2=x+19y\). Find the value of \(\sqrt{x^2+y^2+1}\).`,
    choices: ["16", "17", "18", "19", "NOTA"], answer: "D",
    solution: String.raw`Subtract \(y^2=x+19y\) from \(x^2=19x+y\):
\[x^2-y^2=18x-18y,\qquad(x-y)(x+y)=18(x-y).\]
Since \(x\ne y\), we may divide by the nonzero factor \(x-y\) to obtain \(x+y=18\). Now add the same two equations:
\[x^2+y^2=20x+20y=20(x+y)=360.\]
Therefore \(\sqrt{x^2+y^2+1}=\sqrt{361}=\boxed{19}\). The radical denotes the principal square root, not both signs. The hypotheses are consistent; for example, the distinct real (and hence complex) numbers \(9+3\sqrt{11}\) and \(9-3\sqrt{11}\) satisfy them.`,
  },
  {
    id: 30029, number: 29, division: "Theta", topic: "Systems of Equations", difficulty: 3, methods: [],
    source: { ...chilesStatewide2025Source, questionNumber: 29 },
    question: String.raw`Each balloon/pattern represents a positive integral value. Each pattern is distinct in value. For example, a striped balloon pattern is not equal in value to a dotted pattern. Which could be the value of the last row in the diagram?`,
    choices: ["85", "110", "190", "250", "NOTA"], answer: "C",
    solution: String.raw`The first row gives the checker balloons are \(100\) each, since \(3c=300\). The second row gives \(2g+100=140\), so the gray balloons are \(20\) each. The third row gives
\[20+100+2s=180\quad\Longrightarrow\quad s=30.\]
Thus the striped balloons are \(30\) each. If \(d\) is the dotted-balloon value, the last row equals \(20+2d+30=50+2d\).

Choice A, \(85\), makes \(d=(85-50)/2=17.5\), not an integer. Choice B, \(110\), makes \(d=30\), equal to the striped value, which is not allowed. Choice C, \(190\), makes \(d=70\), a positive integer different from \(100\), \(20\), and \(30\); this is possible. Choice D, \(250\), makes \(d=100\), equal to the checker value, which is not allowed. Thus \(\boxed{190}\) could be the last row's value.`,
    illustration: { src: "/questions/theta-29-balloons.svg", alt: "Three checker balloons equal 300. Gray plus checker plus gray equals 140. Gray plus striped plus checker plus striped equals 180. Gray plus dotted plus dotted plus striped equals an unknown value.", width: 600, height: 350 },
  },
  {
    id: 30030, number: 30, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: ["Asymptotes"],
    source: { ...chilesStatewide2025Source, questionNumber: 30 },
    question: String.raw`The graph of \(y=\frac{2x^2-4x}{x^2+2x-8}\) has vertical asymptote with equation \(x=P\) and horizontal asymptote with equation \(y=Q\). Give the value of \(P+Q\).`,
    choices: [String.raw`\(-2\)`, "2", "4", "6", "NOTA"], answer: "A",
    solution: String.raw`Factoring gives
\[y=\frac{2x(x-2)}{(x-2)(x+4)}.\]
For \(x\ne2,-4\), this simplifies to \(y=\frac{2x}{x+4}\). At \(x=2\) the canceled factor creates a hole, not a vertical asymptote: the simplified expression approaches \(\frac23\). At \(x=-4\), the denominator still vanishes while the simplified numerator is \(-8\ne0\). This gives a vertical asymptote at \(x=-4\), so \(P=-4\).

The numerator and denominator of the original rational function have the same degree. The horizontal asymptote is the ratio of their leading coefficients, \(y=\frac21=2\), so \(Q=2\). Therefore \(P+Q=-4+2=\boxed{-2}\).`,
  },
  {
    id: 30031, number: 31, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 1 },
    question: String.raw`Evaluate \((2^{3^2})(-2^{-2})\).`,
    choices: ["−512", "−128", "−64", "128", "NOTA"], answer: "B",
    solution: String.raw`\[(2^{3^2})(-2^{-2})=2^9\left(-\frac1{2^2}\right)=-\frac{2^9}{2^2}=-2^7=-128.\]
Note - the negative is NOT included under the exponent.`,
  },
  {
    id: 30032, number: 32, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 2 },
    question: String.raw`Given that \(f(x)=x^3-5x^2+1\) and \(g(x)=2x+5\), determine \(f(g(f(1)))\).`,
    choices: ["−71", "−5", "−3", "−1", "NOTA"], answer: "B",
    solution: String.raw`Work from the inside out: \(f(1)=1^3-5(1)^2+1=-3\). \(g(-3)=2(-3)+5=-1\). \(f(-1)=(-1)^3-5(-1)^2+1=-5\).`,
  },
  {
    id: 30033, number: 33, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: ["Discriminant Test"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 4 },
    question: String.raw`For how many values of \(a\) does \(f(x)=ax^2-5x+6\) have one and only one real root?`,
    choices: ["0", "1", "2", "Infinitely many", "NOTA"], answer: "C",
    solution: String.raw`Setting the discriminant equal to zero will give us a single root, therefore \((-5)^2-4(a)(6)=0\), so \(a=\frac{25}{24}\) for one value; however, if \(a\) equals zero, we have a line with slope of \(-5\) which also has only one real root, therefore there are 2 values of \(a\), \(0\) and \(\frac{25}{24}\).`,
  },
  {
    id: 30034, number: 34, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 5 },
    question: String.raw`The following table represents select values of an odd, one-to-one function \(f(x)\). Determine the following: \(af(a)f(b)\).`,
    choices: ["−56", "35", "56", "70", "NOTA"], answer: "D",
    solution: String.raw`Given that \(f(x)\) is odd, \(f(-x)=-f(x)\). Since \(f(-2)=7\), \(f(2)=-7\), so \(a=2\). The one-to-one assumption ensures that no other input can have the same output \(-7\). Additionally, \(f(7)=4\), therefore \(f(-7)=-4\), so \(b=-4\). Additionally, since \(f(4)=5\), \(f(-4)=-5\), thus we have
\[af(a)f(b)=(2)(f(2))(f(-4))=(2)(-7)(-5)=70.\]`,
    illustration: {"src":"/questions/theta-january-statewide-2026-table.svg","alt":"Table: x values negative 7, negative 2, 4, a, 7; corresponding f(x) values b, 7, 5, negative 7, 4.","width":660,"height":120},
  },
  {
    id: 30035, number: 35, division: "Theta", topic: "Binomial Expansion", difficulty: 2, methods: ["Binomial Theorem"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 6 },
    question: String.raw`Given that \(f(x)=(2x^3-3)^5\), determine the coefficient of the \(12^{\text{th}}\) degree term if \(f(x)\) is fully expanded.`,
    choices: ["−240", "−120", "32", "720", "NOTA"], answer: "A",
    solution: String.raw`Use the binomial theorem and Pascal's triangle to expand the binomial, giving us the general form:
\[(a+b)^5=a^5+5a^4b+10a^3b^2+10a^2b^3+5ab^4+b^5.\]
Therefore the 12th degree term will happen when \(2x^3\) is raised to the 4th power, so plugging in to \(5a^4b\), we get
\[5(2x^3)^4(-3)=(-15)(16)x^{12}=-240x^{12}.\]`,
  },
  {
    id: 30036, number: 36, division: "Theta", topic: "Complex Numbers", difficulty: 3, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 7 },
    question: String.raw`Given that \((1-i)^3+(1-i)^5+(1-i)^7=a+bi\), determine the product of \(a\) and \(b\).`,
    choices: ["−12", "4", "20", "84", "NOTA"], answer: "C",
    solution: String.raw`Given that \((1-i)^2=1-2i+i^2=1-2i-1=-2i\), rewrite the expression as
\[\begin{aligned}
&(-2i)(1-i)+(-2i)^2(1-i)+(-2i)^3(1-i)\\
&=-2i+2i^2+4i^2(1-i)-8i^3(1-i)\\
&=-2i-2-4(1-i)+8i(1-i)\\
&=-2i-2-4+4i+8i-8i^2\\
&=2+10i.
\end{aligned}\]
\(a=2\), \(b=10\), \(ab=2(10)=20\).`,
  },
  {
    id: 30037, number: 37, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Rational Root Theorem", "Vieta's Formulas"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 8 },
    question: String.raw`Determine the sum of the non-real roots of \(f(x)=x^7+3x^6+2x^5+5x^3+11x^2+8x+2\).`,
    choices: ["1", "2", "4", "6", "NOTA"], answer: "B",
    solution: String.raw`Testing rational roots given the rational root theorem, we have all possible rational roots \(\pm1,\pm2\). Looking at the fact that all coefficients are positive, we'll try \(x=-1\) first.
\[(-1)^7+3(-1)^6+2(-1)^5+5(-1)^3+11(-1)^2+8(-1)+2=0,\]
therefore \(-1\) is a root of \(f(x)\). Using long division by \((x+1)\), we get the quotient \(x^6+2x^5+5x^2+6x+2\). Testing \(x=-1\) again results in a 2nd root of \(-1\) so dividing again by \((x+1)\) gives us a quotient of \(x^5+x^4-x^3+x^2+4x+2\). If we keep going, we will notice we can divide by \((x+1)\) five times, resulting in
\[f(x)=(x+1)^5(x^2-2x+2).\]
Only the quadratic factor will result in non-real roots, giving us \(1+i\) and \(1-i\). Adding those together we get \(1+i+1-i=2\). Alternatively, we can see by Vieta that the sum of all roots is \(-3\), then subtract five \(-1\)'s for the real roots giving us the sum of the non-real roots or \(-3-(-5)=2\).`,
  },
  {
    id: 30038, number: 38, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: ["Discriminant Test"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 9 },
    question: String.raw`Which of the following values of \(a\) guarantee that the following parabolic system has only one solution:
\[y=ax^2-2x-5\]
\[y=2x^2+6x+5+\sqrt5\]`,
    choices: [String.raw`\(\frac25\)`, String.raw`\(\frac{30+16\sqrt5}{95}\)`, String.raw`\(\frac{30+8\sqrt5}{95}\)`, String.raw`\(\frac{350+16\sqrt5}{95}\)`, "NOTA"], answer: "B",
    solution: String.raw`Note that we do not have to check \(a=0\) because we are told this is a system of parabolas, and we don't need to check \(a=2\) because it isn't an answer choice. Setting the curves equal to each other we have
\[ax^2-2x-5=2x^2+6x+5+\sqrt5.\]
Setting equal to zero and reorganizing: \((a-2)x^2-8x-10-\sqrt5=0\). Setting the discriminant equal to zero we have
\[(-8)^2-4(a-2)(-10-\sqrt5)=0.\]
Simplifying, we have \((a-2)(-10-\sqrt5)=16\), then
\[a-2=\frac{16}{-10-\sqrt5},\qquad a=\frac{4+2\sqrt5}{10+\sqrt5}.\]
Rationalizing, we have
\[\frac{4+2\sqrt5}{10+\sqrt5}\cdot\frac{10-\sqrt5}{10-\sqrt5}
=\frac{30+16\sqrt5}{95}.\]`,
  },
  {
    id: 30039, number: 39, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 10 },
    question: String.raw`Evaluate \(\left(\frac{7!!}{90}\right)^{-1}\).`,
    choices: [String.raw`\(\frac67\)`, String.raw`\(\frac{67}{76}\)`, String.raw`67`, String.raw`\(6^{-7}\)`, String.raw`NOTA`], answer: "A",
    solution: String.raw`The double factorial evaluates as the product of every other value of a standard factorial so \(7!!=7\times5\times3\times1=105\).
\[\left(\frac{105}{90}\right)^{-1}=\left(\frac76\right)^{-1}=\frac67.\]`,
  },
  {
    id: 30040, number: 40, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 11 },
    question: String.raw`Given a parabola in the form \(f(x)=ax^2+bx+c\) that passes through the points \((1,2)\), \((3,4)\), and \((5,3)\), determine the product of \(a\), \(b\), and \(c\).`,
    choices: [String.raw`\(-\frac{15}{128}\)`, String.raw`\(\frac{15}{64}\)`, String.raw`\(\frac{15}{16}\)`, String.raw`\(\frac{16}{15}\)`, "NOTA"], answer: "E",
    solution: String.raw`Plugging in the points results in the following system:
\[\begin{aligned}2&=a+b+c\\4&=9a+3b+c\\3&=25a+5b+c.\end{aligned}\]
Elimination results in \(a=-\frac38\), \(b=\frac52\), and \(c=-\frac18\).
\[abc=\left(-\frac38\right)\left(\frac52\right)\left(-\frac18\right)=\frac{15}{128}.\]
This is not listed, so the answer is NOTA.`,
  },
  {
    id: 30041, number: 41, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 12 },
    question: String.raw`Choose the answer that correctly simplifies the expression
\[\frac{\log_7(5^9)\cdot\log_5(3^8)\cdot\log_3(2^6)}{\log_7(3^4)\cdot\log_3(5^3)\cdot\log_5(2^2)}.\]`,
    choices: ["9", "18", String.raw`\(\log_7(5^9\cdot3^8\cdot2^6)\)`, String.raw`\(5^6\cdot3^4\cdot2^4\)`, "NOTA"], answer: "B",
    solution: String.raw`Use the exponent property of logarithms, then simplify the coefficients:
\[\frac{9\log_7(5)\cdot8\log_5(3)\cdot6\log_3(2)}
{4\log_7(3)\cdot3\log_3(5)\cdot2\log_5(2)}
=18\frac{\log_7(5)\log_5(3)\log_3(2)}
{\log_7(3)\log_3(5)\log_5(2)}.\]
Using change of base, then canceling:
\[18\frac{\frac{\ln5}{\ln7}\cdot\frac{\ln3}{\ln5}\cdot\frac{\ln2}{\ln3}}
{\frac{\ln3}{\ln7}\cdot\frac{\ln5}{\ln3}\cdot\frac{\ln2}{\ln5}}
=18\frac{\ln2/\ln7}{\ln2/\ln7}=18.\]`,
  },
  {
    id: 30042, number: 42, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Vieta's Formulas"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 13 },
    question: String.raw`Given a polynomial \(p(x)\) with roots \(x=1\), \(x=2-i\), and \(x=\pm\sqrt2\), determine the value of the constant term if the polynomial is written in standard form: \(p(x)=x^5+bx^4+cx^3+dx^2+ex+f\) where \(b,c,d,e,\) and \(f\) are integers.`,
    choices: ["−4", "−5", "5", "10", "NOTA"], answer: "D",
    solution: String.raw`By Vieta's formulas, the product of the roots would be \(-f\). Since \(2-i\) is a root, \(2+i\) must also be a root. A 5th degree polynomial must have 5 complex roots; therefore, the product of the roots will be:
\[1(2-i)(2+i)(\sqrt2)(-\sqrt2)=(4-i^2)(-2)=(5)(-2)=-10.\]
Since \(-f=-10\), \(f=10\).`,
  },
  {
    id: 30043, number: 43, division: "Theta", topic: "Matrices", difficulty: 4, methods: ["Matrix Multiplication", "Determinant", "Vieta's Formulas"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 14 },
    question: String.raw`Given that matrix \(A=\begin{pmatrix}x&3\\5&-1\end{pmatrix}\) and matrix \(B=\begin{pmatrix}1&-5\\x^2&2x\end{pmatrix}\), the product \(A\cdot B\) results in an invertible matrix with a determinant equal to \(-42x^2\). Determine the product of all values of \(x\) that satisfies these conditions.`,
    choices: ["−7", "−1", "0", "6", "NOTA"], answer: "D",
    solution: String.raw`Multiplying
\[\begin{pmatrix}x&3\\5&-1\end{pmatrix}
\begin{pmatrix}1&-5\\x^2&2x\end{pmatrix}
=\begin{pmatrix}x+3x^2&x\\5-x^2&-25-2x\end{pmatrix}.\]
Given that the resulting matrix is invertible, the determinant must not be equal to zero.
\[(x+3x^2)(-25-2x)-x(5-x^2)=-42x^2.\]
Simplifying, we have \(-25x-2x^2-75x^2-6x^3-(5x-x^3)=-42x^2\). Setting equal to zero we have \(-5x^3-35x^2-30x=0\). Since zero can't be a solution, divide through by \(-5x\), resulting in \(x^2+7x+6=0\). By Vieta, the product of the roots would be \(\frac61=6\). Note, \(\det(AB)=\det(A)\det(B)\) so this would be an alternate approach.`,
  },
  {
    id: 30044, number: 44, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["Modular Arithmetic"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 15 },
    question: String.raw`Find the value of \(|7-i^{6767}|\).`,
    choices: ["6", String.raw`\(4\sqrt3\)`, String.raw`\(5\sqrt2\)`, "8", "NOTA"], answer: "C",
    solution: String.raw`Dividing the power of \(i\) by 4 and looking at the remainder, we have \(i^{6767}=i^3=-i\). Thus,
\[|7-i^{6767}|=|7+i|=\sqrt{7^2+1^2}=\sqrt{50}=5\sqrt2.\]`,
  },
  {
    id: 30045, number: 45, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Logarithms"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 16 },
    question: String.raw`Which of the following is the minimum possible value for \(x\) given the expression \(\ln(\ln(\ln(\ln x)))\).`,
    choices: ["0", "1", String.raw`\(e\)`, String.raw`\(e^e\)`, "NOTA"], answer: "E",
    solution: String.raw`Although \(x\) must be greater than \(e^e\), there is no minimum value. Notice if we plug in \(e^e\), we have
\[\ln(\ln(\ln(\ln e^e)))=\ln(\ln(\ln e))=\ln(\ln(1))=\ln0,\]
which is undefined, however for any value greater than \(e^e\), we would have a positive value inside the final natural log, so the domain would be \(x>e^e\).`,
  },
  {
    id: 30046, number: 46, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 17 },
    question: String.raw`Determine the only real root for \(f(x)=x^9-8\).`,
    choices: [String.raw`\(2^{1/9}\)`, String.raw`\(2^{1/3}\)`, String.raw`\(2^{1/2}\)`, "2", "NOTA"], answer: "B",
    solution: String.raw`Factoring by the difference of cubes we have \(f(x)=(x^3-2)(x^6+2x^3+4)\), and again
\[f(x)=(x-2^{1/3})(x^2+2^{1/3}x+2^{2/3})(x^6+2x^3+4).\]
The quadratic in \(x\) and the quadratic in \(x^3\) have negative discriminants, so neither can vanish for real \(x\). The only real solution comes from the first factor \(x-2^{1/3}=0\), so \(x=2^{1/3}\).`,
  },
  {
    id: 30047, number: 47, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 18 },
    question: String.raw`Given \(f(x)=\frac{x}{x^2-1}\), \(g(x)=\frac{x+1}{x-3}\), and \(h(x)=\sqrt{x-1}\), for which of the following integers is \(f(g(h(x)))\) undefined?
\[\text{I. }1\qquad\text{II. }2\qquad\text{III. }3\qquad\text{IV. }10\]`,
    choices: ["I, II, and III only", "II and III only", "II and IV only", "I, II, III, and IV", "NOTA"], answer: "C",
    solution: String.raw`Testing each value,
\[f(g(h(1)))=f(g(0))=f\left(-\frac13\right),\]
which is defined.
\[f(g(h(2)))=f(g(1))=f(-1)=\frac{-1}{(-1)^2-1}=\frac{-1}{0},\]
which is undefined.
\[f(g(h(3)))=f(g(\sqrt2))=f\left(\frac{\sqrt2+1}{\sqrt2-3}\right),\]
which is defined: the input to \(f\) is neither \(1\) nor \(-1\).
\[f(g(h(10)))=f(g(3)),\]
which is undefined as \(g(3)=\frac{3+1}{3-3}=\frac40\), which is not defined. Thus II and IV only.`,
  },
  {
    id: 30048, number: 48, division: "Theta", topic: "Systems of Equations", difficulty: 3, methods: ["Determinant"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 19 },
    question: String.raw`Given the system:
\[x+2y-z=3\]
\[2x-y+3z=1\]
\[ax+y+z=5\]
For what value of \(a\) does this system have no unique solution?`,
    choices: ["−3", "−1", "0", "2", "NOTA"], answer: "D",
    solution: String.raw`A linear system has no unique solution if the determinant of its coefficient matrix is zero, therefore:
\[\begin{aligned}
\begin{vmatrix}1&2&-1\\2&-1&3\\a&1&1\end{vmatrix}
&=1((-1)(1)-(3)(1))\\
&\quad-2((2)(1)-(3)(a))\\
&\quad+(-1)((2)(1)-(-1)(a))\\
&=-4-2(2-3a)-(2+a)\\
&=5a-10=0.
\end{aligned}\]
Thus \(5a=10\) or \(a=2\). A zero determinant need not mean no solution; it means no unique solution, as the question asks.`,
  },
  {
    id: 30049, number: 49, division: "Theta", topic: "Simplification", difficulty: 4, methods: ["Binomial Theorem"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 20 },
    question: String.raw`Which of the following correctly simplifies the expression
\[\frac{x^5-5x^4+10x^3-10x^2+5x-1}{x^7+3x^6+x^5-5x^4-5x^3+x^2+3x+1}\]
where defined, given the fact that the expression is undefined at \(x=1\).`,
    choices: [String.raw`\(\frac1{(x+1)^2}\)`, String.raw`\(\frac{(x-1)^3}{(x+1)^3}\)`, String.raw`\(\frac{(x-1)^3}{(x+1)^5}\)`, String.raw`\(\frac{(x-1)^5}{(x+1)^5}\)`, "NOTA"], answer: "C",
    solution: String.raw`The numerator is the binomial expansion of \((x-1)^5\). Additionally, \((x-1)\) must be a factor of the denominator as we have been told the expression is undefined at \(x=1\). Dividing the denominator by \((x-1)\) results in \(x^6+4x^5+5x^4-5x^2-4x-1\). We can now use the rational root theorem; however, looking at the answer choices suggests we should try to divide by \((x-1)\) again, resulting in \(x^5+5x^4+10x^3+10x^2+5x+1\) which is the binomial expansion of \((x+1)^5\). Thus:
\[\frac{(x-1)^5}{(x-1)^2(x+1)^5}=\frac{(x-1)^3}{(x+1)^5}.\]
The original restrictions \(x\ne1,-1\) still apply.`,
  },
  {
    id: 30050, number: 50, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 21 },
    question: String.raw`Which of the following correctly writes \(0.00\overline{76}\) as a fraction?`,
    choices: [String.raw`\(\frac{19}{2475}\)`, String.raw`\(\frac{19}{2250}\)`, String.raw`\(\frac{38}{4995}\)`, String.raw`\(\frac{76}{9999}\)`, "NOTA"], answer: "A",
    solution: String.raw`Given that \(0.\overline{ab}=\frac{ab}{99}\), multiply the expression by 100, resulting in \(0.\overline{76}=\frac{76}{99}\). Now divide by 100 resulting in \(\frac{76}{99}\cdot\frac1{100}=\frac{76}{9900}\) which simplifies to \(\frac{19}{2475}\). Here \(ab\) denotes the two-digit numeral, not a product.`,
  },
  {
    id: 30051, number: 51, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 22 },
    question: String.raw`The population of Boringville can be represented by \(450p\) people where \(p\) represents some positive integer. Let \(A\) represent the number of people in Boringville that are under the age of 18, let \(B\) represent the number of people who are between 18 and 35, let \(C\) represent the number of people between 36 and 50, \(D\) represent the number of people between 51 and 65, \(E\) represent the number of people over 65. Given that the ratio of \(A:B:C\) is \(1:3:7\) and the ratio of \(C:D:E\) is \(2:5:6\), what is the minimum possible value for \(p\) that guarantees an integer number of people in each category, \(A,B,C,D,\) and \(E\)?`,
    choices: ["1", "11", "23", "99", "NOTA"], answer: "B",
    solution: String.raw`Multiply the 1st ratio by 2 and the 2nd ratio by 7 so as to combine into a single ratio: \(A:B:C:D:E=2:6:14:35:42\). Writing as an algebraic expression we have \(2x+6x+14x+35x+42x=450p\). Simplifying, we have: \(99x=450p\). We are looking for the smallest value of \(p\) such that the amount of people in each category is an integer amount; therefore, we need \(x\) to be an integer, thus \(450p\) must be divisible by 99. Since the greatest common factor of 450 and 99 is 9, but 99 is also divisible by 11, \(p\) must equal 11. More explicitly, the integer category sizes force \(x\) to be an integer because \(\gcd(2,6,14,35,42)=1\); the least positive \(p\) making \(99\mid450p\) is \(99/\gcd(99,450)=11\).`,
  },
  {
    id: 30052, number: 52, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 23 },
    question: String.raw`Determine the value of \(y\) given that
\[\frac1{x-y}+\frac1{x+y}=\frac13\qquad\text{and}\qquad\frac1x=x-\frac{y^2}{x}.\]`,
    choices: ["0", String.raw`\(\frac16\)`, String.raw`\(\frac{\sqrt{35}}6\)`, "6", "NOTA"], answer: "E",
    solution: String.raw`Multiplying the 2nd equation through by \(x\), we have \(1=x^2-y^2\). Taking the left side of the 1st equation and finding a common denominator we have
\[\frac1{x-y}\cdot\frac{x+y}{x+y}+\frac1{x+y}\cdot\frac{x-y}{x-y}
=\frac{x+y+x-y}{x^2-y^2}=\frac{2x}{x^2-y^2}.\]
Substituting \(1=x^2-y^2\), we have \(\frac{2x}{1}=\frac13\), or \(x=\frac16\). Plugging into \(1=x^2-y^2\) gets us \(1=\frac1{36}-y^2\), and then \(-\frac{35}{36}=y^2\) which has no real solution. If complex solutions are allowed, \(y=\pm i\sqrt{35}/6\); neither is listed. In either interpretation, the answer is NOTA.`,
  },
  {
    id: 30053, number: 53, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 24 },
    question: String.raw`Determine the slope of the line that passes through the focus of the parabola \(y^2+2y-x=1\) and the origin.`,
    choices: [String.raw`\(-\frac74\)`, String.raw`\(\frac12\)`, String.raw`\(\frac47\)`, String.raw`\(\frac23\)`, "NOTA"], answer: "C",
    solution: String.raw`Rewrite \(y^2+2y-x=1\) as \(y^2+2y=x+1\), then complete the square to write in focus/directrix form \(y^2+2y+1=x+1+1\), and then \((y+1)^2=x+2\). A parabola written in the form \((y-k)^2=4p(x-h)\) has a focus at \((h+p,k)\). Therefore, the focus is found at \((-2+\frac14,-1)=(-\frac74,-1)\). The line going through this point and the origin would have a slope of
\[\frac{-1-0}{-7/4-0}=\frac1{7/4}=\frac47.\]`,
  },
  {
    id: 30054, number: 54, division: "Theta", topic: "Conic Sections", difficulty: 5, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 25 },
    question: String.raw`How many of the following conics are degenerate?
\[x^2+4xy+4y^2-2x+4y=-1.\]
\[9x^2+16y^2-54x+64y+145=0.\]
\[x^2-y^2-4x-6y+13=0.\]`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`The first equation is the trickiest as, for the others, all we have to do is complete the square. Factoring its quadratic part gives \((x+2y)^2-2x+4y=-1\). The direction \((-2,1)\) makes the squared part constant but has nonzero linear coefficient \((-2,4)\cdot(-2,1)=8\), so this is a genuine rotated parabola, not a degenerate pair of lines.

For the other equations, we will complete the square twice:
\[\begin{aligned}
9x^2+16y^2-54x+64y+145&=0,\\
9(x^2-6x)+16(y^2+4y)&=-145,\\
9(x-3)^2+16(y+2)^2&=-145+81+64=0.
\end{aligned}\]
This is the single point \((3,-2)\), so it is degenerate.
\[\begin{aligned}
x^2-y^2-4x-6y+13&=0,\\
(x^2-4x)-(y^2+6y)&=-13,\\
(x-2)^2-(y+3)^2&=-13+4-9=-18.
\end{aligned}\]
Note that the negative value from the last conic is not a problem: dividing by \(-18\) gives a nondegenerate hyperbola. So only one of the conics is degenerate.`,
  },
  {
    id: 30055, number: 55, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 26 },
    question: String.raw`How many integer solutions are there to the inequality \(2|3x-1|-|2-x|<5\)?`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "C",
    solution: String.raw`The absolute value equation has critical values where each absolute value term equals zero, so we will bound our intervals by \(x=\frac13\) and \(x=2\).

When \(x<\frac13\), our inequality becomes \(2(1-3x)-(2-x)<5\) which simplifies to \(-5x<5\), and then \(x>-1\). The only integer on the interval \(-1<x<\frac13\) is 0.

When \(\frac13\le x<2\), we can just test \(x=1\) as this is the only integer in this interval: \(2|3(1)-1|-|2-1|=4-1=3<5\), therefore 1 is also a solution.

For \(x\ge2\), our inequality becomes \(2(3x-1)-(x-2)<5\) which simplifies to \(6x-2-x+2<5\), and then \(5x<5\), and then \(x<1\), which is not within \(x\ge2\) so there are no additional integer solutions here.

Therefore, the only integer solutions are \(x=0\) and \(x=1\), or 2 solutions.`,
  },
  {
    id: 30056, number: 56, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 27 },
    question: String.raw`Given that \(f(x)=\frac1{x-2}+\frac2{x+1}-\frac3{x^2-x-2}\), how many vertical asymptotes does \(f(x)\) have?`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`Add terms together by finding common denominators to check for holes that are masquerading as asymptotes.
\[\begin{aligned}
\frac1{x-2}+\frac2{x+1}-\frac3{(x+1)(x-2)}
&=\frac{x+1+2x-4-3}{(x+1)(x-2)}\\
&=\frac{3x-6}{(x+1)(x-2)}\\
&=\frac{3(x-2)}{(x+1)(x-2)}.
\end{aligned}\]
As the factor \((x-2)\) is in the numerator and denominator, this represents a hole (removable discontinuity), with a hole at \(x=2\); therefore, the only vertical asymptote comes from the \((x+1)\) in the denominator, or at \(x=-1\).`,
  },
  {
    id: 30057, number: 57, division: "Theta", topic: "Systems of Equations", difficulty: 5, methods: ["Substitution"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 28 },
    question: String.raw`Given that \(xy=6\) and \(x^3y+xy^3-2x^2y^2-2x-2y=16\), which of the following is a possible value of \(x^2+y^2\)?`,
    choices: [String.raw`\(\frac{148}{9}\)`, String.raw`\(\frac{202}{9}\)`, String.raw`\(\frac{68}{3}\)`, String.raw`\(\frac{74}{3}\)`, "NOTA"], answer: "A",
    solution: String.raw`We can start by substituting \(xy=6\) into the larger equation, giving us \(6x^2+6y^2-72-2x-2y=16\). Reorganizing, we have \(6(x^2+y^2)-2(x+y)-88=0\). Divide by 2 and we have \(3(x^2+y^2)-(x+y)-44=0\). Now note that \((x+y)^2=x^2+2xy+y^2\), or \((x+y)^2-12=x^2+y^2\). Substituting again, we have \(3((x+y)^2-12)-(x+y)-44=0\). Now simplify:
\[3(x+y)^2-(x+y)-80=0.\]
Let's set \(x+y=Q\), then we see we have a simple quadratic
\[3Q^2-Q-80=(3Q-16)(Q+5)=0,\]
so \(Q=\frac{16}{3}\) and \(Q=-5\). Looking at the answer choices, we will focus on \(Q=x+y=\frac{16}{3}\). Since
\[(x+y)^2-12=x^2+y^2=\left(\frac{16}{3}\right)^2-12=\frac{256}{9}-\frac{108}{9}=\frac{148}{9}.\]
The other branch gives \(x^2+y^2=13\), not listed. Both sums are compatible with real \(x,y\), since the discriminants of \(t^2-Qt+6\) are nonnegative.`,
  },
  {
    id: 30058, number: 58, division: "Theta", topic: "Polynomial Equations", difficulty: 4, methods: ["Substitution", "Vieta's Formulas"],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 29 },
    question: String.raw`Find the sum of all solutions to the equation \(2^{4x}+70(2^{2x})+64=15(2^{3x})+120(2^x)\).`,
    choices: ["5", "6", "7", "15", "NOTA"], answer: "B",
    solution: String.raw`Make \(u=2^x\), then rewrite the equation as \(u^4+70u^2+64=15u^3+120u\). Setting equal to zero we have
\[u^4-15u^3+70u^2-120u+64=0.\]
This factors as \((u-1)(u-2)(u-4)(u-8)=0\), so all four roots are positive and correspond to real \(x\). If we call the roots of the original equation \(x_1,x_2,x_3,x_4\), each root has the relationship with the \(u\) equation as \(x=\log_2(u)\). Therefore, the sum of the roots of the original equation equals
\[\log_2(u_1)+\log_2(u_2)+\log_2(u_3)+\log_2(u_4),\]
which, using properties of logarithms becomes \(\log_2(u_1u_2u_3u_4)\). By Vieta, \(u_1u_2u_3u_4=64\), therefore \(x_1+x_2+x_3+x_4=\log_2 64=6\).`,
  },
  {
    id: 30059, number: 59, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    source: { competition: "2026 January Statewide", event: "Algebra 2 Individual", questionNumber: 30 },
    question: String.raw`\[\frac{10\%}{5\%}=\_\_\_\]`,
    choices: ["0.5", "2%", "20%", "200%", "NOTA"], answer: "D",
    solution: String.raw`\[\frac{10\%}{5\%}=\frac{1/10}{1/20}=2=200\%.\]`,
  },
  {
    id: 30060, number: 60, division: "Theta", topic: "Number Theory", difficulty: 1, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 1 },
    question: String.raw`How many of these four sets below are CLOSED under the given operation?
\[\begin{array}{ll}
\{\text{Odd Integers}\}\text{ Addition} & \{\text{Integers}\}\text{ Multiplication}\\
\{\text{Rational Numbers}\}\text{ Division} & \{\text{Natural Numbers}\}\text{ Subtraction}
\end{array}\] Here CLOSED requires the operation to be defined and stay in the set for every ordered pair, including a zero divisor when testing division.`,
    choices: ["1", "2", "3", "4", "NOTA"], answer: "A",
    solution: String.raw`Odd + odd = even, so the odd integers are not closed under addition. Division by \(0\) (which is rational) is undefined, so the rational numbers are not closed under division. Since \(3-8=-5\) the Natural numbers are not closed under subtraction. However, the product of two integers will always result in another integer. Thus only \(\boxed1\) of the sets is closed under its given operation. Here closure requires that the operation be defined and remain in the set for every ordered pair, including a zero divisor in the division test.`,
  },
  {
    id: 30061, number: 61, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Rational Root Theorem"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 2 },
    question: String.raw`Find the number of rational zeros of \(P(x)=x^3+2x^2-4x+5\).`,
    choices: ["1", "2", "3", "4", "NOTA"], answer: "E",
    solution: String.raw`By the Rational Zero's Theorem, the set of potential rational zeros of \(P(x)\) is \(\{\pm1,\pm5\}\). Testing each of these values one at a time we get:
\[\begin{aligned}
P(-1)&=(-1)^3+2(-1)^2-4(-1)+5=10,\\
P(1)&=1^3+2(1)^2-4(1)+5=4,\\
P(-5)&=(-5)^3+2(-5)^2-4(-5)+5=-50,\\
P(5)&=5^3+2(5)^2-4(5)+5=160.
\end{aligned}\]
Therefore, \(P(x)\) has no rational zeros, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30062, number: 62, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 3 },
    question: String.raw`Write the equation of a line in standard form passing through the point \((3,-5)\) and perpendicular to the line \(y=\frac34x+2\).`,
    choices: [String.raw`\(3x-4y=29\)`, String.raw`\(3x+4y=-11\)`, String.raw`\(4x+3y=-3\)`, String.raw`\(4x-3y=27\)`, "NOTA"], answer: "C",
    solution: String.raw`The line \(y=\frac34x+2\) has slope \(\frac34\). A perpendicular line has slope \(-\frac43\), so write it as \(4x+3y=C\). Substituting \((3,-5)\) gives
\[4(3)+3(-5)=12-15=-3.\]
The answer is \(\boxed{4x+3y=-3}\), or \(4x+3y+3=0\).`,
  },
  {
    id: 30063, number: 63, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 4 },
    question: String.raw`Given \(f(x)=3x+7\) and \(g(x)=x^2+2x-1\), then \(g(g(g(f(-2))))=?\)`,
    choices: ["-7", "2", "7", "62", "NOTA"], answer: "D",
    solution: String.raw`\[f(-2)=3(-2)+7=1,\qquad g(1)=1^2+2(1)-1=2.\]
\[g(2)=2^2+2(2)-1=7,\qquad g(7)=7^2+2(7)-1=49+14-1=\boxed{62}.\]`,
  },
  {
    id: 30064, number: 64, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 5 },
    question: String.raw`Given \(x-2y+3z=3\), \(2x+y+5z=8\), and \(3x-y-3z=-22\), solve for \((x,y,z)\). What is \(x+y+z\)?`,
    choices: ["-4", "0", "1", "3", "NOTA"], answer: "B",
    solution: String.raw`Add the equations \(2x+y+5z=8\) and \(3x-y-3z=-22\) to eliminate \(y\):
\[(2x+y+5z=8)+(3x-y-3z=-22)\ \Longrightarrow\ 5x+2z=-14.\]
Add twice \(2x+y+5z=8\) to \(x-2y+3z=3\):
\[(x-2y+3z=3)+2(2x+y+5z=8)\ \Longrightarrow\ 5x+13z=19.\]
Subtracting gives \(11z=33\), so \(z=3\). Then
\[5x+2(3)=-14\ \Longrightarrow\ x=-4,\]
\[2(-4)+y+5(3)=8\ \Longrightarrow\ y=1.\]
Therefore, \(x+y+z=-4+1+3=\boxed0\).`,
  },
  {
    id: 30065, number: 65, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 6 },
    question: String.raw`When the following system is graphed, there are no solutions in which quadrant(s)?
\[2x+y\le4\]
\[x-2y\le-2\]`,
    choices: ["I, II", "II", "II, III", "IV", "NOTA"], answer: "D",
    solution: String.raw`Shade below \(2x+y\le4\), shade above \(x-2y\le-2\). In slope-intercept form, these are
\[y\le4-2x,\qquad y\ge\frac{x}{2}+1.\]
Both boundary lines are solid because equality is included. Their intersection satisfies \(4-2x=x/2+1\), giving \((x,y)=(6/5,8/5)\). The overlap is the wedge to the left of this point.
[[solution-diagram:theta-feb-2026-6]]
The overlap contains points in Quadrants I, II, and III, for example \((1,2)\), \((-1,1)\), and \((-4,-1/2)\). If \(x>0\), the second inequality forces \(y\ge x/2+1>0\), so no point in Quadrant \(\boxed{\text{IV}}\) satisfies the system.`,
  },
  {
    id: 30066, number: 66, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 7 },
    question: String.raw`For the function \(y=2x^2-8x+3\), determine the equation of the axis of symmetry \((x=a)\) and the minimum value \((y=b)\). What is \(a+b\)?`,
    choices: ["-3", "1", "2", "5", "NOTA"], answer: "A",
    solution: String.raw`\[y=2x^2-8x+3=2(x^2-4x)+3.\]
To complete the square, \(\left(\frac12(-4)\right)^2=(-2)^2=4\). Hence
\[y=2(x^2-4x+4)+3-4(2)=2(x-2)^2-5.\]
Thus \(a=2\), \(b=-5\), and \(a+b=2+(-5)=\boxed{-3}\).`,
  },
  {
    id: 30067, number: 67, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: ["Discriminant Test"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 8 },
    question: String.raw`What are the \(x\)-coordinates of the \(x\)-intercepts of \(f(x)=x^2-3x+15\)?`,
    choices: ["3, 5", "-3, 5", "3, -5", "-3, -5", "NOTA"], answer: "E",
    solution: String.raw`The discriminant \((b^2-4ac)\) is
\[(-3)^2-4(1)(15)=9-60=-51.\]
\(b^2-4ac<0\) implies no real root (no \(x\)-intercepts), so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30068, number: 68, division: "Theta", topic: "Complex Numbers", difficulty: 1, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 9 },
    question: String.raw`In what quadrant does the point \(-3+5i\) lie on the argand plane (the complex number plane)?`,
    choices: ["I", "II", "III", "IV", "NOTA"], answer: "B",
    solution: String.raw`Move left \(3\) on the real number axis and up \(5\) on the imaginary axis (like graphing \((-3,5)\)). This is in Quadrant \(\boxed{\text{II}}\).`,
  },
  {
    id: 30069, number: 69, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 10 },
    question: String.raw`Find the quadratic function \(f(x)=ax^2+bx+c\) that passes through the points \((-2,9)\), \((1,-6)\), \((3,4)\). What is the sum \(a+b+c\)?`,
    choices: ["-12", "-9", "-6", "0", "NOTA"], answer: "C",
    solution: String.raw`Substituting the three points into \(y=Ax^2+Bx+C\) gives
\[\begin{aligned}
9A+3B+C&=4 &&\text{from }(3,4),\\
4A-2B+C&=9 &&\text{from }(-2,9),\\
A+B+C&=-6 &&\text{from }(1,-6).
\end{aligned}\]
Subtracting the second equation from the first gives \(5A+5B=-5\), or \(A+B=-1\). Subtracting the third equation from the second gives \(3A-3B=15\), or \(A-B=5\). Adding these yields \(2A=4\), so \(A=2\). Then \(2+B=-1\), giving \(B=-3\), and \(2-3+C=-6\), giving \(C=-5\).
\[A+B+C=2-3-5=\boxed{-6}.\]`,
  },
  {
    id: 30070, number: 70, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 11 },
    question: String.raw`How many pounds of salt must be added to 80 pounds of a \(5\%\) salt solution to make a \(24\%\) salt solution?`,
    choices: ["5 lbs.", "15 lbs.", "20 lbs.", "30 lbs.", "NOTA"], answer: "C",
    solution: String.raw`Let \(x\) be the number of pounds of pure salt added. The table organizes the mixture; its last column is \(100\) times the salt mass, so the percentages can be used without decimal factors.
[[solution-diagram:theta-feb-2026-11]]
\[400+100x=24x+1920\ \Longrightarrow\ 76x=1520\ \Longrightarrow\ x=20.\]
The answer is \(\boxed{20}\) pounds of salt.`,
  },
  {
    id: 30071, number: 71, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 12 },
    question: String.raw`When simplifying the expression
\[\frac{(6x^{2/7}y^{-4}z^0)^3}{9x^2y^5z^{-8}},\]
the final result is of the form \(Kx^ay^bz^c\) where \(K,a,b,\) and \(c\) are some rational numbers. What is \(a+b+c\)?`,
    choices: [String.raw`\(-\frac{71}{7}\)`, String.raw`\(-\frac{92}{7}\)`, String.raw`\(-\frac{99}{7}\)`, String.raw`\(-\frac{101}{7}\)`, "NOTA"], answer: "A",
    solution: String.raw`Apply the power rule to each factor in the numerator, then subtract denominator exponents:
\[\frac{(6x^{2/7}y^{-4}z^0)^3}{9x^2y^5z^{-8}}
=\frac{216x^{6/7}y^{-12}}{9x^2y^5z^{-8}}
=24x^{-8/7}y^{-17}z^8.\]
Thus
\[a+b+c=-\frac87-17+8=\boxed{-\frac{71}{7}}.\]`,
  },
  {
    id: 30072, number: 72, division: "Theta", topic: "Logs and Exponents", difficulty: 5, methods: ["Logarithms"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 13 },
    question: String.raw`Which of the following expressions is equal to \(\log_2x\), if \(x>0\) satisfies the following equation?
\[\frac{\log_2(\sqrt{x})+\log_{\sqrt2}(x)}{\sqrt{\log_2(x)}}
=
\frac{\log_4(\sqrt[4]{x})+\log_{\sqrt[4]{4}}(x)}{\sqrt[4]{\log_4(x)}}\]`,
    choices: [String.raw`\(8\left(\frac5{17}\right)^4\)`, String.raw`\(2\left(\frac{17}{5}\right)^4\)`, String.raw`\(8\left(\frac{17}{5}\right)^4\)`, String.raw`\(8\left(\frac{10}{17}\right)^4\)`, "NOTA"], answer: "D",
    solution: String.raw`By log properties, we can rewrite the equation as
\[\frac{\frac12\log_2x+2\log_2x}{\sqrt{\log_2x}}
=\frac{\frac14\log_4x+4\log_4x}{\sqrt[4]{\log_4x}}.\]
The real radicals and nonzero denominators require \(x>1\). Thus both logarithms are positive, and simplifying gives
\[\frac52(\log_2x)^{1/2}=\frac{17}{4}(\log_4x)^{3/4}.\]
Since \(\log_4x=\frac12\log_2x\), we can rearrange to get
\[\frac{10}{17}(\log_2x)^{1/2}=2^{-3/4}(\log_2x)^{3/4},\]
\[(\log_2x)^{1/4}=\frac{10}{17}\sqrt[4]{8}.\]
Raise both positive sides to the fourth power:
\[\log_2x=\left(\frac{10}{17}\sqrt[4]{8}\right)^4=\boxed{8\left(\frac{10}{17}\right)^4}.\]`,
  },
  {
    id: 30073, number: 73, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: ["Logarithms"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 14 },
    question: String.raw`Given \(x=\log_2(\log_3(\log_4 64))\), then \(x=?\)`,
    choices: ["1", "2", "3", "4", "NOTA"], answer: "E",
    solution: String.raw`\[x=\log_2(\log_3(\log_4 64))=\log_2(\log_3 3)=\log_2 1=0.\]
Since \(0\) is not listed, the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30074, number: 74, division: "Theta", topic: "Probability", difficulty: 4, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 15 },
    question: String.raw`A real number \(x\) is chosen uniformly at random from the interval \((0,10)\). What is the probability that
\[(x^2-5x+6)(x^2-9x+18)(x^2-9x+14)(x^2-7x+12)\]
is positive?`,
    choices: [String.raw`\(\frac12\)`, String.raw`\(\frac35\)`, String.raw`\(\frac7{10}\)`, String.raw`\(\frac45\)`, "NOTA"], answer: "D",
    solution: String.raw`Factoring each quadratic gives
\[(x-2)(x-3)(x-3)(x-6)(x-2)(x-7)(x-3)(x-4),\]
or \((x-2)^2(x-3)^3(x-4)(x-6)(x-7)\). This expression is positive when \(x>7\), and then changes signs at \(x=3,4,6,\) and \(7\). It does not change sign at \(x=2\), but equals zero there. Thus, within \((0,10)\), the expression is positive for
\[x\in(0,2)\cup(2,3)\cup(4,6)\cup(7,10).\]
The isolated zero at \(2\) has no effect on length. These intervals have total length \(8\), while \((0,10)\) has length \(10\). Thus, the probability is \(\frac8{10}=\boxed{\frac45}\).`,
  },
  {
    id: 30075, number: 75, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 16 },
    question: String.raw`Factor: \((3x-4)^2-(2x+5)^2\). Which of the following is one of the factors?`,
    choices: [String.raw`\(x-1\)`, String.raw`\(x-9\)`, String.raw`\(5x-1\)`, String.raw`\(5x-9\)`, "NOTA"], answer: "B",
    solution: String.raw`\[\begin{aligned}
(3x-4)^2-(2x+5)^2
&=[(3x-4)+(2x+5)][(3x-4)-(2x+5)]\\
&=(5x+1)(x-9).
\end{aligned}\]
The answer is \(\boxed{x-9}\).`,
  },
  {
    id: 30076, number: 76, division: "Theta", topic: "Function Analysis", difficulty: 1, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 17 },
    question: String.raw`What is(are) the equation(s) of the horizontal asymptote(s) for the following rational function?
\[f(x)=\frac{6x^2-3x+2}{4x^2-9}\]`,
    choices: [String.raw`\(y=\pm\frac32\)`, String.raw`\(x=\pm\frac32\)`, String.raw`\(y=\frac32\)`, String.raw`\(x=\frac32\)`, "NOTA"], answer: "C",
    solution: String.raw`When the degree of the numerator and denominator are equal, the horizontal asymptote is the quotient of the leading coefficients:
\[y=\frac64=\boxed{\frac32}.\]`,
  },
  {
    id: 30077, number: 77, division: "Theta", topic: "Polynomials", difficulty: 2, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 18 },
    question: String.raw`When multiplied, what is the coefficient of the \(x^3\) term for \((x^2-x+2)(x^3+3x^2-5x+4)\)?`,
    choices: ["-6", "-1", "-8", "-3", "NOTA"], answer: "A",
    solution: String.raw`The terms contributing to \(x^3\) are
\[(x^2)(-5x)+(-x)(3x^2)+2(x^3)=(-5-3+2)x^3=-6x^3.\]
The answer is \(\boxed{-6}\).`,
  },
  {
    id: 30078, number: 78, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 19 },
    question: String.raw`Factor by completing the square: \(x^4+2x^2+9\). Which of the following is one of the factors?`,
    choices: [String.raw`\(x^2+3\)`, String.raw`\(x^2+x+3\)`, String.raw`\(x^2-x+3\)`, String.raw`\(x^2-2x+3\)`, "NOTA"], answer: "D",
    solution: String.raw`\[\begin{aligned}
x^4+2x^2+9
&=x^4+2x^2+4x^2+9-4x^2\\
&=(x^4+6x^2+9)-4x^2\\
&=(x^2+3)^2-(2x)^2\\
&=(x^2+3+2x)(x^2+3-2x)\\
&=(x^2+2x+3)(x^2-2x+3).
\end{aligned}\]
Thus \(\boxed{x^2-2x+3}\) is a factor.`,
  },
  {
    id: 30079, number: 79, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 20 },
    question: String.raw`What is the least common multiple, plus the greatest common factor of 126 and 140?`,
    choices: ["14", "648", "1274", "1310", "NOTA"], answer: "C",
    solution: String.raw`\[126=6\times21=2\times3\times7\times3=2\times3^2\times7,\]
\[140=10\times14=2^2\times5\times7.\]
The LCM uses the largest exponent of each prime, and the GCF uses the smallest:
\[\operatorname{LCM}=2^2\times3^2\times5\times7=1260,\]
\[\operatorname{GCF}=2\times7=14.\]
The sum is \(1260+14=\boxed{1274}\).`,
  },
  {
    id: 30080, number: 80, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Remainder Theorem"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 21 },
    question: String.raw`What is the remainder when \(x^4+7x^3+5x^2-8x-14\) is divided by \(x+6\)?`,
    choices: ["-6", "-2", "4", "6", "NOTA"], answer: "B",
    solution: String.raw`Use synthetic division, \(x+6=0\ \Longrightarrow\ x=-6\).
[[solution-diagram:theta-feb-2026-21]]
Bring down the leading \(1\), then repeatedly multiply by \(-6\) and add in the next column. The quotient is \(x^3+x^2-x-2\); the final entry is the remainder, \(\boxed{-2}\).`,
  },
  {
    id: 30081, number: 81, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: ["Substitution"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 22 },
    question: String.raw`Given \(3x^2-5y^2=22\) and \(3x^2-y^2-6x=8\), solve the system for all real ordered pairs \((x,y)\) that satisfy the system. What is the sum of all the real coordinates of the ordered pair solutions? That is, what is \(x_1+y_1+x_2+y_2+\cdots\) where each \(x_k\) and \(y_k\) corresponds to a real ordered pair solution \((x_k,y_k)\).`,
    choices: ["8", "6", "5", "4", "NOTA"], answer: "B",
    solution: String.raw`\[3x^2-5y^2=22\ \Longrightarrow\ y^2=\frac{3x^2-22}{5}.\]
Substitute this into the other equation:
\[3x^2-\frac{3x^2-22}{5}-6x=8,\]
\[15x^2-3x^2+22-30x=40,\]
\[12x^2-30x-18=0\ \Longrightarrow\ 2x^2-5x-3=0.\]
The correct factorization is
\[(2x+1)(x-3)=0,\]
giving \(x=3\) or \(x=-\frac12\). For \(x=3\), \(y^2=1\), so \(y=1,-1\). For \(x=-\frac12\), \(y^2=-17/4<0\), so there is no real \(y\). The real ordered pairs that satisfy the system are \((3,1)\) and \((3,-1)\). The final answer is
\[3+1+3+(-1)=\boxed6.\]`,
  },
  {
    id: 30082, number: 82, division: "Theta", topic: "Sequences", difficulty: 3, methods: ["Recursion"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 23 },
    question: String.raw`Define a sequence such that \(a_1=1\) and \(a_{n+1}=1+ia_n\) for all \(n\ge1\) and \(i=\sqrt{-1}\). Compute \(a_{1066}\). (By the way, the year 1066 is when the Battle of Hastings was fought in England.)`,
    choices: ["1", "-1", String.raw`\(i\)`, String.raw`\(-i\)`, "NOTA"], answer: "E",
    solution: String.raw`The first few terms are \(a_1=1\), \(a_2=1+i\), \(a_3=i\), \(a_4=0\), \(a_5=1\), and from there it repeats every \(4\) terms. Since \(1066\equiv2\pmod4\), \(a_{1066}=1+i\). This is not listed, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30084, number: 84, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: ["Point-to-Line Distance Formula"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 25 },
    question: String.raw`The shortest distance between a point \((x_0,y_0)\) and a line \(Ax+By+C=0\) is given by
\[\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}.\]
Compute the shortest distance between the lines \(x+2y=20\) and \(x+2y=25\).`,
    choices: ["5", String.raw`\(\sqrt5\)`, "1", String.raw`\(\frac{\sqrt5}{5}\)`, "NOTA"], answer: "B",
    solution: String.raw`To compute the distance between the lines, it suffices to consider one point on one of the lines and find the distance from that point to the other line (since the lines are equally spaced everywhere). Picking \((20,0)\) from the first line, the formula gives
\[\frac{|1(20)+2(0)-25|}{\sqrt{1^2+2^2}}=\frac5{\sqrt5}=\boxed{\sqrt5}.\]`,
  },
  {
    id: 30085, number: 85, division: "Theta", topic: "Analytic Geometry", difficulty: 5, methods: ["Point-to-Line Distance Formula"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 26 },
    question: String.raw`The shortest distance between a point \((x_0,y_0)\) and a line \(Ax+By+C=0\) is given by
\[\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}.\]
Let \(S\) be the set of all points \(P\) such that the distance from \(P\) to \((0,0)\) is half the distance from \(P\) to the line \(3x+4y=5\). There exist real numbers \(A,B,C,D,\) and \(E\) such that \(S\) is modeled by the equation
\[Ax^2+Bxy+Cy^2+Dx+Ey=1.\]
Compute \(A+B+C+D+E\).`,
    choices: [String.raw`\(\frac{67}{50}\)`, String.raw`\(\frac{81}{25}\)`, String.raw`\(-\frac{213}{50}\)`, String.raw`\(\frac{221}{25}\)`, "NOTA"], answer: "D",
    solution: String.raw`For a point \((x,y)\), the distance to \((0,0)\) is \(\sqrt{x^2+y^2}\), while the distance to the line \(3x+4y=5\) is \(\frac{|3x+4y-5|}{\sqrt{3^2+4^2}}\). So, we're interested in points such that
\[\sqrt{x^2+y^2}=\frac1{10}|3x+4y-5|.\]
Multiplying both sides by \(10\) and squaring gives
\[100x^2+100y^2=9x^2+16y^2+25+24xy-30x-40y.\]
Rearranging and dividing by \(25\),
\[\frac{91}{25}x^2-\frac{24}{25}xy+\frac{84}{25}y^2+\frac{30}{25}x+\frac{40}{25}y=1.\]
Adding the coefficients on the LHS (left-hand side) gives
\[\frac{91-24+84+30+40}{25}=\boxed{\frac{221}{25}}.\]`,
  },
  {
    id: 30086, number: 86, division: "Theta", topic: "Conic Sections", difficulty: 5, methods: ["Discriminant Test"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 27 },
    question: String.raw`The shortest distance between a point \((x_0,y_0)\) and a line \(Ax+By+C=0\) is given by
\[\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}.\]
Let \(S\) be the set of all points \(P\) such that the product of the distance from \(P\) to the line \(y=x\) and the distance from \(P\) to the line \(y=-\frac34x\) is \(\frac1{5\sqrt2}\). Set \(S\) consists of two slightly rotated hyperbolas such that one of which has a transverse axis with a positive slope (call this hyperbola \(H\)). Compute the smallest positive \(x\)-coordinate of any point on \(H\).`,
    choices: [String.raw`\(\frac47\)`, String.raw`\(\frac35\)`, String.raw`\(\frac59\)`, String.raw`\(\frac23\)`, "NOTA"], answer: "A",
    solution: String.raw`\(S\) is defined via
\[\frac{|x-y|}{\sqrt2}\cdot\frac{|3x+4y|}{5}=\frac1{5\sqrt2},\]
or \(|x-y|\cdot|3x+4y|=1\). The two different hyperbolas correspond to whether or not the absolute values introduce a negative sign, so they have equations
\[(x-y)(3x+4y)=1,\qquad(x-y)(3x+4y)=-1.\]
We can expand the LHS out to \(3x^2+xy-4y^2\). Recalling (or observing) that the axes of a hyperbola correspond to the angle bisectors of the asymptotes, and noting that \(y=x\) is steeper positive than \(y=-\frac34x\) is negative, the hyperbola with positive-slope transverse axis corresponds to the rightwards and leftwards portions between these lines. On its right branch, \(x-y>0\) and \(3x+4y>0\), so we are interested in \(3x^2+xy-4y^2=1\) (the purple curve below).
[[solution-diagram:theta-feb-2026-27]]
To find the smallest positive \(x\)-coordinate, we are interested in a positive real number \(x\) such that \(3x^2+xy-4y^2=1\) has a real solution for \(y\). Taking the discriminant of \(-4y^2+xy+(3x^2-1)=0\) gives
\[x^2-4(-4)(3x^2-1)=49x^2-16.\]
To have a solution, we need this to be non-negative, so \(x^2\ge16/49\). Since \(x\) must be positive, \(x\ge4/7\), giving a minimum value of \(\boxed{\frac47}\). Equality is attained at \(y=x/8=1/14\), so this bound is actually reached.`,
  },
  {
    id: 30087, number: 87, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 28 },
    question: String.raw`According to Descartes' Rule of Signs, there are a few possible candidates for the numbers of positive real, negative real, and non-real complex roots of the following function:
\[f(x)=x^4-2x^3-x+1.\]
Which of the following is one such candidate? Answers are in the form of an ordered triple as follows: (positive real, negative real, non-real complex).`,
    choices: ["(2, 1, 1)", "(2, 0, 2)", "(1, 2, 1)", "(2, 2, 0)", "NOTA"], answer: "B",
    solution: String.raw`\(P(x)=x^4-2x^3-x+1\). There are \(2\) sign changes: from \(x^4\) to \(-2x^3\) and from \(-x\) to \(1\). Thus, there are two or no positive roots. \(P(-x)=x^4+2x^3+x+1\). Since there are no sign changes, there are no negative roots. Since \(P(x)\) is degree \(4\), there are four total complex roots, counting multiplicity.
[[solution-diagram:theta-feb-2026-28]]
Of the possible choices from above, only one listed is \(\boxed{(2,0,2)}\).`,
  },
  {
    id: 30088, number: 88, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 29 },
    question: String.raw`A plane can fly 200mph in still air. Flying with the wind, it can fly 960 miles. Flying against the wind, it can fly only two-thirds of the distance in the same amount of time. Find the speed of the wind in mph.`,
    choices: ["20", "40", "60", "80", "NOTA"], answer: "B",
    solution: String.raw`Let \(w\) be the speed of the wind in mph. The distance against the wind is \(\frac23(960)=640\) miles.
[[solution-diagram:theta-feb-2026-29]]
The times are equal, so
\[\frac{960}{200+w}=\frac{640}{200-w}\ \Longrightarrow\ \frac3{200+w}=\frac2{200-w}.\]
Cross-multiplying gives
\[400+2w=600-3w\ \Longrightarrow\ 5w=200\ \Longrightarrow\ w=\boxed{40\text{ mph}}.\]`,
  },
  {
    id: 30089, number: 89, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: ["Row Operations"],
    source: { competition: "2026 February Regional", event: "Algebra 2 Individual", questionNumber: 30 },
    question: String.raw`Solve this system: \(3x+4y=1\) and \(5x+9y=2\). What is \(x+y\)?`,
    choices: [String.raw`\(\frac27\)`, String.raw`\(\frac49\)`, String.raw`\(\frac73\)`, String.raw`\(\frac45\)`, "NOTA"], answer: "A",
    solution: String.raw`Solve by using Cramer's rule. For
\[Ax+By=C,\qquad Dx+Ey=F,\]
when \(AE-BD\ne0\), the solution is
\[(x,y)=\left(\frac{CE-BF}{AE-BD},\frac{AF-CD}{AE-BD}\right).\]
For \(3x+4y=1\) and \(5x+9y=2\), \(AE-BD=3(9)-4(5)=7\), so
\[x=\frac{1(9)-4(2)}7=\frac17,\qquad y=\frac{3(2)-1(5)}7=\frac17.\]
Therefore \(x+y=\boxed{\frac27}\). You can always use elimination and have fun working with fractions.`,
  },
  {
    id: 30090, number: 90, division: "Theta", topic: "Analytic Geometry", difficulty: 1, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 1 },
    question: String.raw`Let's get familiar with coordinates. In what quadrant is the coordinate \(\left(-e,\frac{2\pi}{7}\right)\) located?`,
    choices: ["Quadrant 1", "Quadrant 2", "Quadrant 3", "Quadrant 4", "NOTA"], answer: "B",
    solution: String.raw`Since the \(x\)-coordinate is negative, it must be in either Quadrant 2 or 3. Since the \(y\)-coordinate is positive, the point must be in Quadrant 2.`,
  },
  {
    id: 30091, number: 91, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: ["Distance Formula"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 2 },
    question: String.raw`Consider the distance between the coordinate \(\left(-e,\frac{2\pi}{7}\right)\) and the origin. Which of the following best represents this distance, \(d\)?`,
    choices: [String.raw`\(0<d<1\)`, String.raw`\(1<d<2\)`, String.raw`\(2<d<3\)`, String.raw`\(3<d<4\)`, "NOTA"], answer: "C",
    solution: String.raw`\(e\approx2.71\). \(2\pi\approx6.28\), so \(\frac{2\pi}{7}<1\) (or approximately 0.89).
\[d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2},\]
so \(\sqrt{(2.71)^2+(0.89)^2}\approx2.85<3\). Also \(d>e>2\), so \(2<d<3\).`,
  },
  {
    id: 30092, number: 92, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 3 },
    question: String.raw`Let's introduce our very special coordinate for this test: \((h,k)\). Consider the line \(f(x)=x\). What is the \(y\)-intercept of the transformed function \(f(x-h)+k\)?`,
    choices: [String.raw`\(k\)`, String.raw`\(h+k\)`, String.raw`\(-h+k\)`, String.raw`\(-h-k\)`, "NOTA"], answer: "C",
    solution: String.raw`The transformed function is \(y=f(x-h)+k=(x-h)+k\). In other words, \(y=(0-h)+k\) has value \(-h+k\) at the \(y\)-intercept.`,
  },
  {
    id: 30093, number: 93, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 4 },
    question: String.raw`The line \(2x-4y=5\) is shifted horizontally by \(h\) and vertically by \(k\). If the transformed function is mapped onto the original function for all points \((x,y)\), what could be the values of \(h\) and \(k\)?`,
    choices: [String.raw`\(h=3,k=6\)`, String.raw`\(h=-4,k=8\)`, String.raw`\(h=10,k=-5\)`, String.raw`\(h=5,k=\frac52\)`, "NOTA"], answer: "D",
    solution: String.raw`\(2(x-h)-4(y-k)=5\) results in the function \(y=\frac12x-\frac54-\frac12h+k\). When setting this transformed equation equal to the original function, this gives the equivalency \(k=\frac12h\). A translation parallel to a line leaves that line unchanged. Among the choices, \(h=5,\ k=\frac52\) satisfies this relation.`,
  },
  {
    id: 30094, number: 94, division: "Theta", topic: "Inverse Functions", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 5 },
    question: String.raw`Consider linear function \(g(x)\) where \(g(2)=3\) and \(g(-4)=10\). Find \(g^{-1}(-4)\).`,
    choices: ["-10", "-4", "8", "10", "NOTA"], answer: "C",
    solution: String.raw`\(m=-\frac76\), so \(y=-\frac76(x-2)+3\). Then, since we are looking for the inverse function's value at \(-4\), substitute \(-4\) for \(y\) on the given function:
\[-4=-\frac76(x-2)+3.\]
This gives \(x-2=6\) and \(x=8\), so \(g^{-1}(-4)=8\).`,
  },
  {
    id: 30095, number: 95, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 6 },
    question: String.raw`Consider two perpendicular lines graphed on a coordinate plane. Which of the following must be true?
\[\begin{array}{ll}
\text{I.} & \text{Two perpendicular lines will always intersect exactly once}\\
\text{II.} & \text{For any line, there is exactly one possible perpendicular line}\\
\text{III.} & \text{Two perpendicular lines are inverses of each other}\\
\text{IV.} & \text{If a line is a function, then a line perpendicular to it must also be a function.}
\end{array}\]`,
    choices: ["I only", "I, III", "I, III, IV", "I, II, IV", "NOTA"], answer: "A",
    solution: String.raw`The first option is true; when two lines that are not parallel are graphed on a coordinate plane, they must intersect once (and only once). The second choice is not true; for any given line, there are infinitely many perpendicular lines through different points. For a nonzero finite slope \(m\), they have slope \(-\frac1m\) and different \(y\)-intercepts. The third choice is sometimes true but not always true; the inverse relation of a horizontal line \((y=a,\ m=0)\) is a vertical line \((x=a,\ m\text{ undefined})\), but the inverse of many other linear functions (including \(y=x\)) is not perpendicular. The fourth option is sometimes true; consider vertical and horizontal lines. Therefore, I is the only statement that must be true.`,
  },
  {
    id: 30096, number: 96, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 7 },
    question: String.raw`Let's take another look at our special coordinate \((h,k)\). The quadratic function \(y=4x^2+6x-5\) can be rewritten as \(y=4(x-h)^2+k\). Find \(h+k\).`,
    choices: ["-8", String.raw`\(-\frac{23}{4}\)`, String.raw`\(-\frac{21}{2}\)`, String.raw`\(-\frac64\)`, "NOTA"], answer: "A",
    solution: String.raw`Complete the square to write the given quadratic in vertex form.
\[y=4\left(x^2+\frac32x+\frac9{16}\right)-5-\frac94\]
\[y=4\left(x+\frac34\right)^2-\frac{29}{4}\]
\[-\frac34-\frac{29}{4}=-8.\]`,
  },
  {
    id: 30097, number: 97, division: "Theta", topic: "Function Analysis", difficulty: 1, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 8 },
    question: String.raw`Which of the following correctly describes the translations that occurred to \(y=4x^2\) to create the function \(y=4\left(x-\frac34\right)^2-\frac{17}{4}\)?`,
    choices: [
      String.raw`Translation to the right by \(\frac34\), translation down by \(\frac{17}{4}\)`,
      String.raw`Translation to the left by \(\frac34\), translation down by \(\frac{17}{4}\)`,
      String.raw`Translation to the right by \(\frac34\), translation up by \(\frac{17}{4}\)`,
      String.raw`Translation to the left by \(\frac34\), translation up by \(\frac{17}{4}\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`Consider the general form \(y=a(x-h)^2+k\) which has been translated horizontally \(h\) units and vertically \(k\) units from \(y=ax^2\). The function given has been translated \(\frac34\) units to the right and \(\frac{17}{4}\) units down.`,
  },
  {
    id: 30098, number: 98, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 9 },
    question: String.raw`A quadratic relation has an axis of symmetry of \(y=5\), an \(x\)-intercept of \((48,0)\) and intersects with the coordinate \((6,3)\). Find the sum of the coefficients \((a,b,\text{ and }c)\) of this relation when it is written in the form \(x=ay^2+by+c\).`,
    choices: ["-60", "30", "60", "70", "NOTA"], answer: "B",
    solution: String.raw`Based on the given information, we can generate a system of equations based on the general form \(x=a(y-k)^2+h\).
\[48=a(0-5)^2+h\quad\text{and}\quad6=a(3-5)^2+h.\]
Solving this system results in \(a=2\) and \(h=-2\). Expanding to standard form gives the equation \(x=2y^2-20y+48\) whose sum of coefficients is 30.`,
  },
  {
    id: 30099, number: 99, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Vieta's Formulas"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 10 },
    question: String.raw`Given \(f(x)=ax^2+bx+c\) where \(a,b,c\in\mathbb Z\), which of the following must be true?
\[\begin{array}{ll}
\text{I.} & \text{The sum of the roots is an integer.}\\
\text{II.} & \text{The roots are integers.}\\
\text{III.} & f(x)\text{ is defined for all integer values of }x.
\end{array}\]`,
    choices: ["I only", "II only", "III only", "I, III", "NOTA"], answer: "C",
    solution: String.raw`By Vieta's formulae, the sum of the roots of this polynomial is \(-\frac ba\) which may not be an integer. By the quadratic formula and the discriminant, if \(b^2-4ac\) is not a perfect square, the roots may not be rational (and therefore not integers). Yes, quadratic functions with integer coefficients are certainly defined for all values of \(x\). This means that only III is necessarily true.`,
  },
  {
    id: 30100, number: 100, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 11 },
    question: String.raw`Given \(f(x)=ax^2+bx+c\) where \(a,b,c\in\mathbb Z\), Dorin rewrites the function in vertex form, giving \(f(x)=a(x-h)^2+11\). Which of the following must be true?
\[\begin{array}{ll}
\text{I.} & f(x)\text{ must have two non-real, complex roots}\\
\text{II.} & f(x)\text{ must have a double root at }x=h\\
\text{III.} & f(x)\text{ must have an axis of symmetry at }x=11
\end{array}\]`,
    choices: ["I, II", "I, III", "II, III", "I, II, and III", "NOTA"], answer: "E",
    solution: String.raw`If \(a\) is negative, \(f(x)\) would have two real roots. With a vertex \(y\)-coordinate at 11, there cannot be a double root at \(x=h\). Based on the equation in vertex form, \(f(x)\) must have an axis of symmetry at \(x=h\), which may be at \(x=11\) but does not have to be. This results in none of the above answers.`,
  },
  {
    id: 30101, number: 101, division: "Theta", topic: "Conic Sections", difficulty: 4, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 12 },
    question: String.raw`Given \(f(x)=ax^2+bx+c\) where \(a,b,c\in\mathbb Z\), Dorin rewrites the function in vertex form as \(f(x)=a(x-h)^2+11\). Through further inspection, Dorin finds the focus of the function at \((3,10.75)\). Find \(a+b+c\).`,
    choices: ["6", "-6", "7", "15", "NOTA"], answer: "C",
    solution: String.raw`This last bit of information reveals that the quadratic has a negative leading coefficient, focal length \(|p|=\frac14\), and axis of symmetry \(x=3\). The signed focal parameter is \(p=10.75-11=-\frac14\), so \(a=\frac1{4p}=-1\). This results in:
\[y=-1(x-3)^2+11,\]
which, written in standard form, \(y=-x^2+6x+2\), where \(a+b+c=7\).`,
  },
  {
    id: 30102, number: 102, division: "Theta", topic: "Polynomial Equations", difficulty: 4, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 13 },
    question: String.raw`Our coordinate is back again! This time, a cubic function \(c(x)\) has roots at \(x=-1\) and \(x=4\), \(c(1)=2\), and \(c(x)\ge0\) on the interval \([-1,\infty)\). What is the \(y\)-intercept of the function \(c(x+3)-1\)?`,
    choices: ["-1", String.raw`\(-\frac59\)`, String.raw`\(\frac19\)`, String.raw`\(\frac59\)`, "NOTA"], answer: "B",
    solution: String.raw`Since \(c(x)\ge0\) on the interval \([-1,\infty)\), there must be a double root at \(x=4\) and positive leading coefficient, resulting in the equation \(y=a(x+1)(x-4)^2\). By substituting the coordinate \((1,2)\), we can find \(a=\frac19\). Then, considering the transformations given, the equation
\[c(x+3)-1=\frac19(x+4)(x-1)^2-1,\]
which has a \(y\)-intercept of \(-\frac59\).`,
  },
  {
    id: 30103, number: 103, division: "Theta", topic: "Functions", difficulty: 4, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 14 },
    question: String.raw`This coordinate helps us change and move functions, no matter their behavior. Consider the parent cubic function \(f(x)=x^3\) with point \(A(0,0)\). Point \(A\) (and all other coordinates of \(f(x)\)) has been translated to create function \(g(x)=f(x-h)+k\). Similarly, exponential function \(d(x)=2^x\) has been translated to create \(p(x)=d(x-h)+k\). Find \(p(1)-g(1)\) in terms of \(h\).`,
    choices: [
      String.raw`\(\frac1{2^h}-(h+1)^3\)`,
      String.raw`\((h-1)^3+\frac2{2^h}\)`,
      String.raw`\(h^3+\frac1{2^h}\)`,
      String.raw`\(h^3-3h^2-3h-1+\frac2{2^h}\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`\(p(1)=2^{1-h}+k\) and \(g(1)=(1-h)^3+k\). Subtracting \(g(1)\) from \(p(1)\) eliminates the \(k\) and can be written as \(2^{1-h}-(1-h)^3\). By recalling laws of negative exponents, and by factoring out a negative from the second expression, this can be rewritten as
\[\frac{2^1}{2^h}-((-1)(h-1))^3,\]
which is equivalent to \((h-1)^3+\frac2{2^h}\).`,
  },
  {
    id: 30104, number: 104, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Rational Root Theorem"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 15 },
    question: String.raw`Consider \(y=3x^5+7x^4-x^2+x-12\). The rational root theorem defines a set of possible rational roots of certain polynomial functions. How many unique integer roots are contained in this set of possible roots of \(y\)?`,
    choices: ["5", "6", "12", "18", "NOTA"], answer: "C",
    solution: String.raw`Read this question carefully! While the rational root theorem does establish a set of possible rational roots (in this case,
\[\begin{gathered}
\pm1,\pm2,\pm3,\pm4,\pm6,\pm12,\\
\pm\frac13,\pm\frac23,\pm\frac43
\end{gathered}\]
) only a subset of those potential roots are integers. There are 12 integer candidates within the set \(\{\pm(1,2,3,4,6,12)\}\). This counts possible roots, not actual zeros of the polynomial.`,
  },
  {
    id: 30105, number: 105, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 16 },
    question: String.raw`The radical \(\sqrt{a+\sqrt{bc}}\) can be simplified into \(\sqrt{\frac b2}+\sqrt{\frac c2}\). If \(x^3-64=(x-b)(x^2+bx+c)\), what is \(a\)?`,
    choices: ["2", "10", "16", "32", "NOTA"], answer: "B",
    solution: String.raw`Based on the difference of cubes, \(b=4\) and \(c=16\). \(\sqrt{a+\sqrt{64}}=\sqrt2+\sqrt8\), then \(\sqrt{a+8}=3\sqrt2\). By squaring both sides, \(a+8=18\), so \(a=10\).`,
  },
  {
    id: 30106, number: 106, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Remainder Theorem"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 17 },
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
    solution: String.raw`Possibly most obvious using long division, but remainders can be found using synthetic division in all four cases. A linear divisor's remainder is \(f(r)\), where \(r\) is its zero. Since \(h(x)=2j(x)\), \(h\) and \(j\) have the same zero, \(-2\), and both remainders are \(f(-2)=-10\). Since \(k(x)=3g(x)\), \(k\) and \(g\) have the same zero, \(\frac13\), and both remainders are \(f(\frac13)=\frac{85}{9}\). Scaling a divisor changes the quotient, not the constant remainder. The appropriate order of remainders is
\[\frac{f(x)}{j(x)},\ \frac{f(x)}{h(x)},\ \frac{f(x)}{k(x)},\ \frac{f(x)}{g(x)}.\]`,
  },
  {
    id: 30107, number: 107, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 18 },
    question: String.raw`The following questions (#18-19) consider the function
\[h(x)=\frac{ax^2+bx+c}{x^2-2x-35},\qquad a,b,c\in\mathbb Z.\]
If it is known that \(h(x)\) has no vertical asymptotes, what is the value of \(h(x)\) on its domain?`,
    choices: [String.raw`\(h(x)=a\)`, String.raw`\(h(x)=b\)`, String.raw`\(h(x)=c\)`, String.raw`\(h(x)=1\)`, "NOTA"], answer: "A",
    solution: String.raw`If \(h(x)\) has no vertical asymptotes, the denominator (entirely) must be a factor of the numerator, leaving the value of \(a\). Indeed, the denominator is \((x-7)(x+5)\); the numerator of degree at most 2 must vanish at both roots. It is therefore \(a(x-7)(x+5)\), including the zero-polynomial case \(a=0\). On the original domain \(x\ne7,-5\), \(h(x)=a\).`,
  },
  {
    id: 30108, number: 108, division: "Theta", topic: "Function Analysis", difficulty: 4, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 19 },
    question: String.raw`The following questions (#18-19) consider the function
\[h(x)=\frac{ax^2+bx+c}{x^2-2x-35},\qquad a,b,c\in\mathbb Z.\]
If it is known that \(h(x)\) has exactly one removable discontinuity, which of the following could be true?
\[\begin{array}{ll}
\text{I.} & c\text{ is divisible by 7 but is not divisible by 5}\\
\text{II.} & c\text{ has a 0 as its units digit}\\
\text{III.} & c\text{ is divisible by both 7 and 5}
\end{array}\]`,
    choices: ["I only", "III only", "I and II", "I, II, and III", "NOTA"], answer: "D",
    solution: String.raw`Since the denominator of \(h(x)\) can be factored as \((x-7)(x+5)\), then exactly one of these distinct factors must cancel to give exactly one removable discontinuity. The first option could be true; the numerator factors could be \((x-7)(x+7)\), giving \(c=-49\). The second option could be true; the factors could be \((x-7)(x+10)\), giving \(c=-70\). The third option could be true; the factors could be \((x-14)(x+5)\), also giving \(c=-70\). Each example cancels exactly one denominator factor. So all three (I, II, III) could be true.`,
  },
  {
    id: 30109, number: 109, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 20 },
    question: String.raw`Don't worry, \((h,k)\) is back again! Consider \(f(x)=\frac{4x-8}{x^2-4}\) and \(g(x)=f(x+h)-k\) where \(h,k\in\mathbb N\). If \(g(x)\) has a vertical asymptote at \(x=-8\) and horizontal asymptote at \(y=-1\), what is the value of \(h+k\)?`,
    choices: ["-9", "-7", "7", "11", "NOTA"], answer: "C",
    solution: String.raw`Simplifying \(f(x)\) reveals a vertical asymptote at \(x=-2\) and horizontal asymptote at \(y=0\). To result in the new function \(g(x)\), we must translate the original function to the left 6 units and down 1 unit. So, \(g(x)=f(x+6)-1\) and \(h+k=7\).`,
  },
  {
    id: 30110, number: 110, division: "Theta", topic: "Vectors", difficulty: 1, methods: ["Distance Formula"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 21 },
    question: String.raw`Let's look at \((h,k)\) in a slightly different light. Consider point \(A_0(x,y)\) on any function \(f(x)\) corresponding to point \(A_1\) on function \(g(x)\), where \(g(x)=f(x-h)+k\). What is the magnitude of the displacement from \(A_0\) to \(A_1\) in terms of \(h\) and \(k\)?`,
    choices: [String.raw`\(h+k\)`, String.raw`\(\sqrt{h^2+k^2}\)`, String.raw`\(h-k\)`, String.raw`\(\sqrt{h^2-k^2}\)`, "NOTA"], answer: "B",
    solution: String.raw`This is the distance formula/Pythagorean Theorem at work. The corresponding point is \(A_1=(x+h,y+k)\), so the displacement vector is \(\langle h,k\rangle\), and its magnitude is \(\sqrt{h^2+k^2}\).`,
  },
  {
    id: 30111, number: 111, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 22 },
    question: String.raw`A vector is a quantity that has both magnitude and direction. When functions are translated by horizontal and vertical shifts, the change in each coordinate's position can be modeled by a vector \((h,k)\). If function \(f(x)=\ln(x+1)-10\) is translated by \((3,-2)\), which of the following coordinates lies on the transformed function?`,
    choices: ["(0, -10)", "(-3, -2)", "(3, -12)", "(-3, -12)", "NOTA"], answer: "C",
    solution: String.raw`Parent function \(y=\ln x\) has an \(x\)-intercept at \((1,0)\). When it is transformed to the function given, with a shift left of 1 and shift down 10, there is a corresponding point located at \((0,-10)\). Finally, when transformed by the vector \(\langle3,-2\rangle\), that same corresponding point becomes \((3,-12)\).`,
  },
  {
    id: 30112, number: 112, division: "Theta", topic: "Vectors", difficulty: 1, methods: ["Distance Formula"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 23 },
    question: String.raw`If \(f(x)=\log_2x\) is first translated by \((-3,4)\), then translated again by \((8,15)\), find the magnitude of the total displacement of any point on \(f(x)\) to its corresponding translated point.`,
    choices: [String.raw`\(\sqrt{146}\)`, "17", String.raw`\(\sqrt{386}\)`, "22", "NOTA"], answer: "C",
    solution: String.raw`These two vectors working together will cause a final displacement along the vector \(\langle5,19\rangle\) of a point on the parent function to a corresponding point on the transformed function. This results in a total displacement magnitude of \(\sqrt{25+361}=\sqrt{386}\).`,
  },
  {
    id: 30113, number: 113, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 24 },
    question: String.raw`Steven likes logarithms. He realizes that dilations and translations aren't so different when dealing with functions like \(y=\log_5x\). Which of the following functions have equivalent translations to \((2,-3)\)?`,
    choices: [
      String.raw`\(\log_5\frac{x-2}{5}\)`,
      String.raw`\(\log_5(125x-25)\)`,
      String.raw`\(\log_5\frac{x-2}{125}\)`,
      String.raw`\(\log_5(125(x-25))\)`,
      "NOTA",
    ], answer: "C",
    solution: String.raw`These transformations would first be written as \(\log_5(x-2)-3\), which can also be written as \(\log_5(x-2)-\log_5 125\). By the quotient rule for logarithms, this can be written as \(\log_5\frac{x-2}{125}\).`,
  },
  {
    id: 30114, number: 114, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 25 },
    question: String.raw`Translations still have applications to non-functions. Consider \(16x=8(y-20)^2+2\). What translation would map the focus of this relation to its vertex?`,
    choices: [String.raw`\(\left\langle-\frac12,0\right\rangle\)`, String.raw`\(\left\langle\frac12,0\right\rangle\)`, String.raw`\(\left\langle0,\frac12\right\rangle\)`, String.raw`\(\left\langle0,-\frac12\right\rangle\)`, "NOTA"], answer: "A",
    solution: String.raw`Rewrite the relation as \((y-20)^2=2(x-\frac18)\). This quadratic relation has a vertex at \((\frac18,20)\) and a focal length of \(p=\frac12\). Its focus is \((\frac58,20)\). To map its focus onto its vertex, the relation would have to be translated \(\langle-\frac12,0\rangle\).`,
  },
  {
    id: 30115, number: 115, division: "Theta", topic: "Conic Sections", difficulty: 4, methods: ["Eccentricity"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 26 },
    question: String.raw`Consider \(2x^2+8x=-y^2-y+10\). Tahir finds the center of this ellipse, then translates the relation so that the center is located at the origin. Find the eccentricity of this ellipse.`,
    choices: [String.raw`\(\frac{\sqrt2}{4}\)`, String.raw`\(\frac{\sqrt2}{2}\)`, "1", String.raw`\(\frac{\sqrt2}{8}\)`, "NOTA"], answer: "B",
    solution: String.raw`Begin by completing the square to find this ellipse in standard form:
\[2\left(x^2+4x+4\right)+\left(y^2+y+\frac14\right)=10+8+\frac14\]
\[2(x+2)^2+\left(y+\frac12\right)^2=\frac{73}{4}\]
\[\frac{(x+2)^2}{73/8}+\frac{(y+1/2)^2}{73/4}=1.\]
The translation changes the center but does not change the eccentricity of the ellipse, which can be found by \(\frac ca\). \(a=\sqrt{\frac{73}{4}}=\frac{\sqrt{73}}2\) and \(a^2-b^2=c^2\), so \(\frac{73}{4}-\frac{73}{8}=c^2\) and \(c=\sqrt{\frac{73}{8}}=\frac{\sqrt{73}}{2\sqrt2}\). Simplifying \(\frac ca\) gives \(\frac{\sqrt2}{2}\).`,
  },
  {
    id: 30116, number: 116, division: "Theta", topic: "Binomial Expansion", difficulty: 3, methods: ["Binomial Theorem"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 27 },
    question: String.raw`Even binomials can be translated! Consider the expansion of \((x+2)^4\). Find the difference between the coefficient of the cubic term of \((x+2)^4\) and the coefficient of the cubic term of \(((x-h)+2)^4\) (original minus translated), in terms of \(h\).`,
    choices: ["0", "-4h", "4h", "8 - 4h", "NOTA"], answer: "C",
    solution: String.raw`The cubic term of \((x+2)^4\) is \(\binom41x^3 2^1=8x^3\). The cubic term of the translated binomial is similar; \(((x-h)+2)^4=(x+(2-h))^4\), where the cubic term is \(\binom41x^3(2-h)=(8-4h)x^3\). The difference between their coefficients is \(4h\), since \(8-(8-4h)=4h\). The full difference of the terms would be \(4hx^3\), so the prompt explicitly asks for coefficients.`,
  },
  {
    id: 30117, number: 117, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 28 },
    question: String.raw`Which of the following is equivalent to \(424_6\)?`,
    choices: [String.raw`\(160_9\)`, String.raw`\(311_7\)`, String.raw`\(242_8\)`, String.raw`\(2200_4\)`, "NOTA"], answer: "D",
    solution: String.raw`\(424_6=4(6^0)+2(6^1)+4(6^2)=160\) (in base 10). Through inspection of the answer choices:
\[\begin{aligned}
160_9&=0(9^0)+6(9^1)+1(9^2)=135,\\
311_7&=1(7^0)+1(7^1)+3(7^2)=155,\\
242_8&=2(8^0)+4(8^1)+2(8^2)=162,\\
2200_4&=0(4^0)+0(4^1)+2(4^2)+2(4^3)=160.
\end{aligned}\]`,
  },
  {
    id: 30118, number: 118, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Substitution"],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 29 },
    question: String.raw`Find the sum of the solutions to \(2^{2x-1}-4=2^x\).`,
    choices: ["1", "2", "3", String.raw`\(\frac32\)`, "NOTA"], answer: "B",
    solution: String.raw`Using laws of exponents, we can rewrite the first term as \(\frac12(2^x)^2\). This is a quadratic which can be represented using the substitution \(a=2^x\):
\[\frac12a^2-a-4=0\]
\[\left(\frac12a-2\right)(a+2)=0\]
\[a=4,\quad a=-2.\]
Considering the original substitution, one of these solutions is extraneous as \(2^x\ne-2\). However, by solving the equation \(2^x=4\), we find \(x=2\).`,
  },
  {
    id: 30119, number: 119, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    source: { competition: "2026 King February Statewide", event: "Algebra 2 Individual", questionNumber: 30 },
    question: String.raw`What is the difference between the number of distinct arrangements of the word "LIONS" and the number of distinct arrangements of the letters "ROOAR"?`,
    choices: ["0", "90", "105", "120", "NOTA"], answer: "B",
    solution: String.raw`The number of possible arrangements of the word "LIONS" is \(5!=120\) (all of which are distinct, since each letter is different). The number of distinct arrangements of "ROOAR" is \(\frac{5!}{2!\cdot2!}=30\) since the letters "O" and "R" are doubled. The difference between the two arrangements \((120-30)\) is 90.`,
  },
  {
    id: 30120, number: 120, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 1 },
    question: String.raw`One of the most celebrated traditions of March is "March Madness" when people fill out their NCAA Division I men's basketball tournament brackets to predict who will win. Which of the following is a root of the following polynomial equation, which uses brackets to group terms together?
\[\left[4x^3-8x^2+3x-6\right]\left[9x^2-4\right]=0\]`,
    choices: ["-2", String.raw`\(-\frac{i\sqrt3}{2}\)`, String.raw`\(\frac{1-i\sqrt5}{2}\)`, String.raw`\(\frac32\)`, "NOTA"], answer: "B",
    solution: String.raw`Factor the first as \(4x^2(x-2)+3(x-2)=(4x^2+3)(x-2)\), so the roots are \(x=2\) and \(x=\pm\frac{i\sqrt3}{2}\). Factor the second as \((3x+2)(3x-2)\), so its roots are \(x=-\frac23\) and \(x=\frac23\). From this, only \(x=-\frac{i\sqrt3}{2}\) is a root among the choices.`,
  },
  {
    id: 30121, number: 121, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: ["Row Operations"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 2 },
    question: String.raw`How fast can you "march" through this problem? Find the sum of \(x\) and \(y\), which are the solutions to the following system of equations.
\[2x-3y=-39\]
\[-4x+5y=73\]`,
    choices: ["-11", "-9", "-7", "-5", "NOTA"], answer: "C",
    solution: String.raw`Adding twice the top equation \((4x-6y=-78)\) to the bottom equation gives \(-y=-5\), so \(y=5\). Solving \(2x-15=-39\) gives \(x=-12\). The sum \(x+y=-12+5=-7\).`,
  },
  {
    id: 30122, number: 122, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 3 },
    question: String.raw`Beware the Ides of March and large matrices! If \(D\) is determinant of the following matrix, find the remainder when \(|D|\) is divided by 10.
\[\begin{bmatrix}
1&5&1&5\\
0&15&15&9\\
0&15&15&5\\
0&0&0&9
\end{bmatrix}\]`,
    choices: ["1", "3", "5", "9", "NOTA"], answer: "E",
    solution: String.raw`Taking the determinant by minors along row 4, the determinant of the matrix is \(+9\) times the determinant of the upper 3-by-3 matrix. Using minors again along column 1, the determinant of that is \(+1\) times \(\begin{vmatrix}15&15\\15&15\end{vmatrix}\), which is 0, so the overall matrix has determinant 0.`,
  },
  {
    id: 30123, number: 123, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Logarithms"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 4 },
    question: String.raw`Spring is in the air, and the bunnies are multiplying exponentially! Megan's farm has 5 bunnies at the end of March 1st and 600 bunnies at the end of March 10th. If \(a=\ln2\), \(b=\ln3\), and \(c=\ln5\), then which expression below represents the continuous rate of growth per day for the bunny population on the farm in terms of \(a\), \(b\), and \(c\)?`,
    choices: [
      String.raw`\(\frac{3a+b+c}{e^{2b}}\)`,
      String.raw`\(\frac{3a+b+c}{e^{a+c}}\)`,
      String.raw`\(\frac{3a+b+3c}{e^{2b}}\)`,
      String.raw`\(\frac{3a+b+3c}{e^{a+c}}\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`The number of bunnies multiplies by \(\frac{600}{5}=120\) in 9 days, so the continuous growth rate is
\[\frac{\ln120}{9}=\frac{\ln8+\ln3+\ln5}{e^{\ln9}}=\frac{3a+b+c}{e^{2b}}.\]
Here the exponential model is \(P(t)=P_0e^{rt}\); the daily percentage increase in a discrete model would instead be \(e^r-1\).`,
  },
  {
    id: 30124, number: 124, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 5 },
    question: String.raw`Randall is chasing after one of the bunnies on the farm, which got loose and is now hopping along the bunny trail! The bunny takes one gigantic bounce whose height during the hop can be modeled by the equation \(y=-3t^2+25.5t-45\), where \(t\) is time in seconds. How many seconds pass while the bunny has jumped in the air? You may assume \(y=0\) is the ground.`,
    choices: ["3.5", "4.5", "6", "6.5", "NOTA"], answer: "A",
    solution: String.raw`Multiplying the equation by \(-\frac23\), \(2t^2-17t+30=0\). This factors as \((2t-5)(t-6)\), so the bunny is in the air from \(t=\frac52\) to \(t=6\). The time in the air \(6-2.5=3.5\) seconds.`,
  },
  {
    id: 30125, number: 125, division: "Theta", topic: "Analytic Geometry", difficulty: 4, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 6 },
    question: String.raw`One of the best holidays in March is, of course, Pi Day! Find the \(x\)-coordinate of the \(x\)-intercept of the line that perpendicularly bisects the segment with endpoints \((\pi,1)\) and \((-3\pi,-5)\).`,
    choices: [String.raw`\(1-\pi\)`, "-2", String.raw`\(\frac9{2\pi}-\pi\)`, String.raw`\(\pi\)`, "NOTA"], answer: "E",
    solution: String.raw`The midpoint of the line segment is \(\left(\frac{\pi-3\pi}{2},\frac{1-5}{2}\right)=(-\pi,-2)\). The slope of the line is \(\frac{1+5}{\pi+3\pi}=\frac3{2\pi}\). The slope of the perpendicular bisector is \(-\frac{2\pi}{3}\), so the equation is
\[y=-\frac{2\pi}{3}x-\left(2+\frac{2\pi^2}{3}\right).\]
The \(x\)-intercept of this is
\[\frac3{2\pi}\left(-2-\frac{2\pi^2}{3}\right)=-\pi-\frac3\pi.\]
This is not listed, so the answer is NOTA.`,
  },
  {
    id: 30126, number: 126, division: "Theta", topic: "Probability", difficulty: 2, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 7 },
    question: String.raw`Before 150 B.C.E., March was the first month of the calendar! You can still see traces of this in the modern calendar. For example, December is named after the Latin word for ten. Find the number of distinct permutations of the letters in the word DECEMBER.`,
    choices: ["720", "6720", "13440", "20160", "NOTA"], answer: "B",
    solution: String.raw`There are 8 letters in DECEMBER, 3 of which are E; all others are unique: \(\frac{8!}{3!}=\frac{40320}{6}=6720\).`,
  },
  {
    id: 30127, number: 127, division: "Theta", topic: "Polynomials", difficulty: 5, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 8 },
    question: String.raw`March was named for the Roman god of war, Mars. Suppose Mars is arranging his soldiers in rows so that the \(n\)th row of soldiers contains \(f(n)\) soldiers for some degree-4 polynomial \(f(n)\). The first five rows contain 8, 27, 64, 125, and 336 soldiers, respectively. How many soldiers are there in the ninth row?`,
    choices: ["9400", "14824", "17280", "20683", "NOTA"], answer: "A",
    solution: String.raw`Noting that \(f(n)=(n+1)^3\) for \(n\in\{1,2,3,4\}\), \(f(n)-(n+1)^3\) is a quartic polynomial with roots 1, 2, 3, and 4;
\[f(x)=(x+1)^3+A(x-1)(x-2)(x-3)(x-4).\]
Plugging in \(x=5\), \(336=216+24A\), so \(A=5\).
\[f(9)=10^3+5\cdot8\cdot7\cdot6\cdot5=1000+40\cdot7\cdot30=9400.\]`,
  },
  {
    id: 30128, number: 128, division: "Theta", topic: "Binomial Expansion", difficulty: 2, methods: ["Binomial Theorem"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 9 },
    question: String.raw`NASA astronaut Scott Kelly returned to Earth after one full year in space on March 2nd, 2016. In honor of Scott, find the coefficient of the \(x^3y^2\) term in the expansion of \((2y-x)^5\).`,
    choices: ["-80", "-40", "40", "80", "NOTA"], answer: "B",
    solution: String.raw`\[\binom53(-x)^3(2y)^2=10\cdot(-x^3)\cdot4y^2=-40x^3y^2.\]
The requested coefficient is \(-40\).`,
  },
  {
    id: 30129, number: 129, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 10 },
    question: String.raw`On March 17th, 1973, Pink Floyd's album "The Dark Side of the Moon" first hit the Billboard Top 200 album chart at number 95. If the claim made at the closing of the album that, "There is no dark side of the moon...as a matter of fact, it's all dark." is true, in other words, all sides of the moon are actually dark; then, what is the probability of randomly selecting a point on the moon that is on the dark side of the moon?`,
    choices: ["0", String.raw`\(\frac12\)`, "1", String.raw`\(\frac23\)`, "NOTA"], answer: "C",
    solution: String.raw`Given that all sides of the moon are dark, then the probability of randomly selecting a point on the moon that is on the dark side of the moon is 1.`,
  },
  {
    id: 30130, number: 130, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 11 },
    question: String.raw`As the saying goes, March comes "in like a lion, out like a lamb." That was certainly true on March 1st, 2007, when a detachment of 170 Swiss infantrymen accidentally invaded neighboring Liechtenstein when they got lost on a training mission. Rewrite the logarithmic expression \(\log_3 170\) in terms of \(a=\log3\) and \(b=\log289\).`,
    choices: [String.raw`\(1+\frac{b}{2a}\)`, String.raw`\(\frac{1+a}{b}\)`, String.raw`\(1+\frac b2+\frac1a\)`, String.raw`\(\frac{2+b}{2a}\)`, "NOTA"], answer: "D",
    solution: String.raw`Using Change of Base,
\[\begin{aligned}
\log_3 170&=\frac{\log170}{\log3}\\
&=\frac{\log10+\log17}{\log3}\\
&=\frac{1+\log17}{\log3}\\
&=\frac{1+b/2}{a}=\frac{2+b}{2a}.
\end{aligned}\]`,
  },
  {
    id: 30131, number: 131, division: "Theta", topic: "Matrices", difficulty: 3, methods: ["Matrix Inverse"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 12 },
    question: String.raw`Find \(A_{12}\) if \(A^{-1}=\begin{bmatrix}2&3\\5&7\end{bmatrix}\). Note \(A_{12}\) means the entry in the first row and second column.`,
    choices: ["-5", "-3", "3", "5", "NOTA"], answer: "C",
    solution: String.raw`\(A=(A^{-1})^{-1}\). The determinant of \(A^{-1}\) is \(2\cdot7-3\cdot5=-1\).
\[A=-\begin{bmatrix}7&-3\\-5&2\end{bmatrix}
=\begin{bmatrix}-7&3\\5&-2\end{bmatrix},\]
so \(A_{12}=3\).`,
  },
  {
    id: 30132, number: 132, division: "Theta", topic: "Sequences and Series", difficulty: 3, methods: ["Infinite Geometric Series"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 13 },
    question: String.raw`A University of Miami player drops a basketball beginning at a point 10 feet in the air and it begins bouncing off the ground. After the initial bounce off the ground, the ball continues bouncing straight up and down vertically returning to a height that is \(\frac45\) of the height of the bounce before it. If this ball could continue bouncing forever, find the sum of the vertical distances (both up and down) the ball travels beginning with the initial drop, in feet.`,
    choices: ["40", "50", "80", "90", "NOTA"], answer: "D",
    solution: String.raw`The distance going down is a geometric series with first term 10 and ratio \(\frac45\) and has sum \(\frac{10}{1-4/5}=50\). The distance going up is a geometric series with first term \(10\cdot\frac45=8\) (coming off the first bounce) and has sum \(\frac8{1-4/5}=40\), for a total distance of 90.`,
  },
  {
    id: 30133, number: 133, division: "Theta", topic: "Simplification", difficulty: 4, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 14 },
    question: String.raw`March is a radical month! Simplify
\[(\sqrt[3]{36}-\sqrt[3]{6}+1)(\sqrt{56}-\sqrt{24})(\sqrt[3]{6}+1)(\sqrt{56}+\sqrt{24}).\]`,
    choices: ["160", "224", "400", "560", "NOTA"], answer: "B",
    solution: String.raw`Swapping the second and third factors gives the sum of cubes factorization for \((\sqrt[3]6)^3+1^3=7\) multiplied by the difference of squares factorization for \((\sqrt{56})^2-(\sqrt{24})^2=32\). Then \(7\cdot32=224\).`,
  },
  {
    id: 30134, number: 134, division: "Theta", topic: "Probability", difficulty: 1, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 15 },
    question: String.raw`On March 5, 1981, Clive Sinclair launched the ZX81 computer, the first British model to sell more than a million units. It cost just €70, and nobody who uses its peculiar keyboard will ever forget it. The ZX81 uses an 8-bit processor, meaning it uses strings of 8 values, each of which is either a 0 or a 1. How many different 8-bit strings are possible?`,
    choices: ["127", "128", "255", "256", "NOTA"], answer: "D",
    solution: String.raw`Each of the eight bits can independently take one of 2 values. \(2^8=256\).`,
  },
  {
    id: 30135, number: 135, division: "Theta", topic: "Probability", difficulty: 3, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 16 },
    question: String.raw`Blaise Pascal time-travels to the future along with a 23-bit processor. He inputs a value into the computer to generate a 23-bit string, but due to the time travel, the processor is faulty, and up to 3 bits may be processed as the wrong values. How many possible values might the computer have stored incorrectly after Blaise's input?`,
    choices: ["2023", "2024", "2047", "2048", "NOTA"], answer: "C",
    solution: String.raw`Of the 23 bits, you can choose 0, 1, 2, or 3 of them to be incorrect.
\[\binom{23}{0}+\binom{23}{1}+\binom{23}{2}+\binom{23}{3}\]
can be simplified using the principles of Pascal's Triangle.
\[\binom{24}{1}+\binom{24}{3}
=24+\frac{24\cdot23\cdot22}{3\cdot2}
=24+4\cdot23\cdot22=24+2024=2048;\]
however, since \(\binom{23}{0}\) actually represents the case where there are no incorrectly stored values, we should not count it in the total. The case with no incorrectly processed bits is excluded. So, the final answer is \(2048-1=2047\).`,
  },
  {
    id: 30136, number: 136, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 17 },
    question: String.raw`Read Across America is celebrated on Dr. Seuss's birthday, March 2. What would you be reading about if you saw the statement "Every polynomial equation with complex coefficients and degree \(\ge1\) has at least one complex root."?`,
    choices: ["Descartes's Rule of Signs", "Fundamental Theorem of Algebra", "Fundamental Theorem of Arithmetic", "Rational Root Theorem", "NOTA"], answer: "B",
    solution: String.raw`This is another formulation of the Fundamental Theorem of Algebra, which also states that a degree-\(n\ge1\) polynomial with complex coefficients has exactly \(n\) complex roots, counting multiplicity.`,
  },
  {
    id: 30137, number: 137, division: "Theta", topic: "Inequalities", difficulty: 4, methods: ["Rational Root Theorem"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 18 },
    question: String.raw`March is Women's History Month. Help fight the inequality and give the interval of real values for \(x\) such that
\[x^5-5x^4+4x^3+4x^2+3x+9>0.\]`,
    choices: [
      String.raw`\((-\infty,-3)\cup(3,\infty)\)`,
      String.raw`\((-3,1)\)`,
      String.raw`\((-1,3)\cup(3,\infty)\)`,
      String.raw`\((-1,\infty)\)`,
      "NOTA",
    ], answer: "C",
    solution: String.raw`The Rational Root Theorem narrows down the roots to be tested; the given polynomial factors as \((x+1)(x-3)^2(x^2+1)\). The second two factors are always non-negative, so the relaxed inequality would solve as \([-1,\infty)\). Eliminating the roots of \(-1\) and 3 gives the strict inequality solution as \((-1,3)\cup(3,\infty)\).`,
  },
  {
    id: 30138, number: 138, division: "Theta", topic: "Conic Sections", difficulty: 5, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 19 },
    question: String.raw`March 31 is the International Transgender Day of Visibility. The rectangular transgender pride flag consists of five congruent rectangles (colored blue, pink, white, pink, and blue) stacked on top of each other. This flag is placed on the coordinate plane such that each of its vertices has an \(x\)-coordinate of \(\pm5\) and a \(y\)-coordinate of \(\pm3\). An ellipse is drawn around the flag such that it passes through each vertex of the flag and the points \((\sqrt5,\sqrt{21})\) and \((2\sqrt5,\sqrt{k})\). Find \(k\).`,
    choices: ["6", "8", "10", "12", "NOTA"], answer: "D",
    solution: String.raw`By symmetry, the center of the ellipse is the origin, so the ellipse has the equation \(\frac{x^2}{a^2}+\frac{y^2}{b^2}=1\). More explicitly, substituting all four corners \((\pm5,\pm3)\) into a general conic forces the \(xy\), \(x\), and \(y\) coefficients to vanish. We have a system of equations
\[\frac{25}{a^2}+\frac9{b^2}=1,\qquad\frac5{a^2}+\frac{21}{b^2}=1,\]
which solves as \(a=\sqrt{40}\) and \(b=\sqrt{24}\). The solution to \(\frac{20}{40}+\frac{k}{24}=1\) is \(k=12\).`,
  },
  {
    id: 30139, number: 139, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 20 },
    question: String.raw`Which of the following is an asymptote of the graph of the equation \(y=\frac{x^3-1}{x-1}\)?`,
    choices: [String.raw`\(x=-1\)`, String.raw`\(x=1\)`, String.raw`\(y=1\)`, String.raw`\(y=x^2\)`, "NOTA"], answer: "E",
    solution: String.raw`Using Difference of Cubes, this is the parabola \(y=x^2+x+1\) with a hole at \((1,3)\). Thus, there are no straight-line asymptotes. The listed curve \(y=x^2\) is not an asymptote either, since the difference \(x+1\) does not tend to zero. The answer is NOTA.`,
  },
  {
    id: 30140, number: 140, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: ["Symmetry"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 21 },
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
    solution: String.raw`\(y=\frac1x\) is a relation that describes a rotated hyperbola. It passes both the horizontal- and vertical-line tests, so it is a one-to-one function that is also its own inverse, so it is symmetric about the line \(y=x\). Graphing shows it is not symmetric about either axis, so the number of true statements is 4.`,
  },
  {
    id: 30141, number: 141, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Discriminant Test"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 22 },
    question: String.raw`Which of the following equations describes a parabola?`,
    choices: [
      String.raw`\(x^2+6xy+9y^2+20x+24y+311838=0\)`,
      String.raw`\(3x^2+6xy+7y^2+20x+24y+311838=0\)`,
      String.raw`\(5x^2+6xy+5y^2+20x+24y+311838=0\)`,
      String.raw`\(7x^2+6xy+3y^2+20x+24y+311838=0\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`If the discriminant of a nondegenerate conic is 0, then it is a parabola. By inspection, \(6^2-4\cdot1\cdot9=0\), so
\[x^2+6xy+9y^2+20x+24y+311838=0\]
is a parabola. Nondegeneracy matters: its squared quadratic part is \((x+3y)^2\), and along the perpendicular direction \((-3,1)\) the linear term has coefficient \(20(-3)+24=-36\ne0\). Thus it is a genuine parabola, not parallel lines or an empty conic. The other choices have \(B^2-4AC<0\).`,
  },
  {
    id: 30142, number: 142, division: "Theta", topic: "Systems of Equations", difficulty: 4, methods: ["Substitution"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 23 },
    question: String.raw`The Easter Bunny takes a parabolic hop starting at \(t=0\) seconds and a height of 0 cm. At time \(t=3\) seconds, he is at a height of 60 cm, and at \(t=4\) seconds he is at a height of 66 cm. At what time (in seconds) will he land at a height of 0 cm again?`,
    choices: ["7", String.raw`\(\frac{51}{7}\)`, "8", String.raw`\(\frac{61}{7}\)`, "NOTA"], answer: "D",
    solution: String.raw`The parabola passes through \((0,0)\), \((3,60)\), and \((4,66)\). Because of the first point, the parabola can be written as \(y=at^2+bt\) for coefficients \(a\) and \(b\). Plugging in the other points, \(9a+3b=60\) and \(16a+4b=66\). The solution to this system is \(a=-\frac72\) and \(b=\frac{61}{2}\). The other root of the polynomial is \(\frac{61}{7}\).`,
  },
  {
    id: 30143, number: 143, division: "Theta", topic: "Sequences", difficulty: 2, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 24 },
    question: String.raw`St. Patrick's Day is famous for its green attire. In the year 2010, 712 students wore green shirts to the IMAO National Convention. In the year 2019, 1027 students wore green shirts to the IMAO National Convention. If the number of students who wear green shirts follows an arithmetic progression every year, how many students are predicted to be wearing green in the year 2038?`,
    choices: ["1622", "1657", "1692", "1787", "NOTA"], answer: "C",
    solution: String.raw`The number of students wearing green increases 315 in 9 years, meaning there are 35 more students wearing green per year, specifically \(712+35n\) students \(n\) years after 2010. Plugging in \(n=28\) gives 1692 students predicted to wear green in 2038.`,
  },
  {
    id: 30144, number: 144, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 25 },
    question: String.raw`March 9 is a date such that the number of the month is the square root of the number of the day - nice! Find the digit \(M\) such that the five-digit integer formed by \(3M9M2\) is divisible by 12. What is \(M\)?`,
    choices: ["1", "5", "8", "9", "NOTA"], answer: "B",
    solution: String.raw`The number must be divisible by 3 and 4. For the former, the sum of the digits \((14+2M)\) must be a multiple of 3, giving \(M\in\{2,5,8\}\). For the latter, the last two digits must be a multiple of 4, giving \(M\in\{1,5,9\}\). The intersection of these sets is \(M=5\).`,
  },
  {
    id: 30145, number: 145, division: "Theta", topic: "Probability", difficulty: 4, methods: ["Complement Rule"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 26 },
    question: String.raw`March is Red Cross Month. Every 8 minutes, the American Red Cross responds to an emergency. One of the ways people at least 17 years old can help the Red Cross is to donate blood. The 8 blood types are \(O^-,O^+,A^-,A^+,B^-,B^+,AB^-,\) and \(AB^+\), where the positive and negative signs indicate the presence of the rhesus factor on the surface of red blood cells. Suppose you randomly select 3 out of those 8 blood types. Let \(X\) represent the probability that your 3 randomly selected blood types are not all positive and not all negative for the rhesus factor when the selections are done without replacement. Let \(Y\) represent the probability that your 3 randomly selected blood types are not all positive and not all negative for the rhesus factor when the selections are done with replacement. What is \(X-Y\)?`,
    choices: [String.raw`\(\frac3{28}\)`, String.raw`\(\frac67\)`, String.raw`\(\frac14\)`, String.raw`\(\frac{17}{28}\)`, "NOTA"], answer: "A",
    solution: String.raw`There are \(\binom83=56\) ways to choose 3 distinct blood types when sampling without replacement. There are \(\binom43\binom40=4\) ways to select three positive and no negative types, and another 4 ways to select three negative and no positive types. Therefore,
\[X=\frac{56-2(4)}{56}=\frac{48}{56}=\frac67.\]
Now, there are \(2^3=8\) ways of randomly selecting 3 blood types with respect to each one being either rhesus factor positive or rhesus factor negative when sampling with replacement; and we want neither one of the two cases where all 3 blood types are either all rhesus factor positive or all rhesus factor negative. Thus, \(Y=\frac{8-2}{8}=\frac68=\frac34\). Finally, \(X-Y=\frac67-\frac34=\frac3{28}\).`,
  },
  {
    id: 30146, number: 146, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Logarithms"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 27 },
    question: String.raw`March is Fire Prevention Month. A wood fire burns at \(600^\circ\text{C}\). Newton's Law of Cooling states that the difference in temperature between an object and its ambient environment experiences exponential decay; despite being named after the case when an object is cooling down, it also applies when an object is heating up! An object at \(80^\circ\text{C}\) at time \(t=0\) minutes has a temperature of \(470^\circ\text{C}\) at \(t=4\) minutes. Assuming Newton's Law of Cooling to be true, at an integer \(t=T\) minutes, the temperature of the object will be closest to \(599^\circ\text{C}\). Find \(T\).`,
    choices: ["11", "14", "18", "19", "NOTA"], answer: "C",
    solution: String.raw`The difference in temperature at \(t=0\) is 520, and the difference at \(t=4\) is 130. The difference decreases by half every 2 minutes. Noting \(130\approx2^7\), it will take 7 more halvings of temperature to attain a difference of approximately 1. \(4+7\cdot2=18\). To verify the closest integer time rather than just approximate it, the temperature is \(600-520\cdot2^{-t/2}\). It equals 599 at \(t=2\log_2 520\approx18.045\). Monotonicity means only 18 and 19 need comparing. At 18 the difference from 599 is \(|1-520/512|=0.015625\); at 19 it is approximately \(0.282\). Thus \(T=18\).`,
  },
  {
    id: 30147, number: 147, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["De Moivre's Theorem"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 28 },
    question: String.raw`The zodiac signs for the month of March are Pisces and Aries. If \(i=\sqrt{-1}\), find \((1+i)^{10}\).`,
    choices: [String.raw`\(-32i\)`, "-32", "32", String.raw`\(32i\)`, "NOTA"], answer: "D",
    solution: String.raw`Observe \((1+i)^2=2i\). \((1+i)^{10}=(2i)^5=2^5i^5=32i\).`,
  },
  {
    id: 30148, number: 148, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Eccentricity"],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 29 },
    question: String.raw`Spring into this problem and find the eccentricity of the following hyperbola.
\[2x^2-y^2-6y=-4\]`,
    choices: [String.raw`\(\frac{\sqrt6}{2}\)`, String.raw`\(\sqrt2\)`, String.raw`\(\frac32\)`, String.raw`\(\sqrt3\)`, "NOTA"], answer: "A",
    solution: String.raw`Rewrite the hyperbola as \(2x^2-(y^2+6y+9)=-13\), so
\[\frac{(y+3)^2}{13}-\frac{x^2}{13/2}=1.\]
The eccentricity is
\[\frac{\sqrt{13+13/2}}{\sqrt{13}}=\sqrt{1+\frac12}=\frac{\sqrt6}{2}.\]`,
  },
  {
    id: 30149, number: 149, division: "Theta", topic: "Simplification", difficulty: 2, methods: [],
    source: { competition: "2026 March Regional", event: "Algebra 2 Individual", questionNumber: 30 },
    question: String.raw`Time goes on eternally, much like the following infinitely nested radical. Find its value.
\[\sqrt{3+\sqrt{3+\sqrt{3+\sqrt{3+\cdots}}}}\]`,
    choices: ["2", String.raw`\(\frac12+\sqrt3\)`, String.raw`\(\frac{1+\sqrt{13}}2\)`, "3", "NOTA"], answer: "C",
    solution: String.raw`Let the nested radical equal \(x\). Then \(x=\sqrt{3+x}\). Squaring, \(x^2=3+x\), so \(x^2-x-3=0\) and \(x=\frac{1\pm\sqrt{13}}2\). Obviously, \(x\) is positive, so \(x=\frac{1+\sqrt{13}}2\). To justify that the infinite radical exists, its finite truncations start at \(\sqrt3\), increase, and remain bounded above by this positive fixed point; their limit therefore satisfies the displayed equation.`,
  },
  {
    id: 30150, number: 150, division: "Theta", topic: "Inverse Functions", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 1 },
    question: String.raw`What is the range of the function \(f^{-1}(x)\) if \(f(x)=\frac{\ln(x+1)}{\sqrt{x-13}}\)?`,
    choices: [String.raw`\(y>-1\)`, String.raw`\(y>13\)`, String.raw`\(-1<x<13\)`, String.raw`\(x>-1\)`, "NOTA"], answer: "B",
    solution: String.raw`The range of \(f^{-1}(x)\) is the same as the domain of \(f(x)\). To solve for the domain of \(f(x)\), note on the top of the fraction that we have \(\ln(x+1)\) which means that \(x+1>0\); and so, \(x>-1\). On the bottom of the fraction, we have \(\sqrt{x-13}\), which means \(x\ge13\) for the square root and \(x\ne13\) for the denominator, so \(x>13\). So, we need \(x>-1\) and \(x>13\) at the same time, which means we just need \(x>13\). Since we're talking about the range of \(f^{-1}(x)\), this translates into \(y>13\).`,
  },
  {
    id: 30151, number: 151, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 2 },
    question: String.raw`Express the following as a single simplified radical expression without rationalizing the denominator:
\[\sqrt[12]{x^5y}\div\sqrt[8]{x^3y^5}\]`,
    choices: [String.raw`\(\sqrt[24]{\frac{x}{y^{13}}}\)`, String.raw`\(\sqrt{\frac{x}{y^2}}\)`, String.raw`\(\sqrt[4]{\frac{x}{y^2}}\)`, String.raw`\(\sqrt[48]{\frac{x}{y^2}}\)`, "NOTA"], answer: "A",
    solution: String.raw`The twelfth root is like a \(\frac1{12}\)th power, and the eighth root is like a \(\frac18\)th power. The least common multiple of 12 and 8 is 24, so we should express each of these roots as an equivalent twenty-fourth root. That gives us \(\sqrt[24]{x^{10}y^2}\div\sqrt[24]{x^9y^{15}}\). Combining these roots and using the properties of exponents we get \(\sqrt[24]{\frac{x}{y^{13}}}\). The original denominator requires \(x^3y^5>0\); keep that restriction when simplifying.`,
  },
  {
    id: 30152, number: 152, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 3 },
    question: String.raw`The function \(y=g(x)\) has the property that \(f(g(x))=x+2\) for all values of \(x\). If \(f(x)=\sqrt[3]{x-1}\), and \(g(x)=x^3+bx^2+cx+d\), then give the value of \(\frac{b+c}{d}\).`,
    choices: ["-1", "0", "1", "2", "NOTA"], answer: "D",
    solution: String.raw`Since \(f(x)=\sqrt[3]{x-1}\), then \(f(g(x))=\sqrt[3]{g(x)-1}\), so \(\sqrt[3]{g(x)-1}=x+2\). Cubing both sides gives \(g(x)-1=x^3+6x^2+12x+8\), which means that \(g(x)=x^3+6x^2+12x+9\), so \(b=6\), \(c=12\) and \(d=9\). Therefore, \(\frac{b+c}{d}=2\).`,
  },
  {
    id: 30153, number: 153, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 4 },
    question: String.raw`Pat can cut and split a cord of firewood in 6 fewer hours than Jesse can. When they work together, it takes them 4 hr. How long would it take Jesse to do the job alone?`,
    choices: ["2 hr.", "6 hr.", "7 hr.", "12 hr.", "NOTA"], answer: "D",
    solution: String.raw`Since Pat (\(P\)) can do the job in 6 less hours than Jesse (\(J\)), this sets up the equation \(P=J-6\). The working together/apart equation is represented in this case by \(\frac{t}{P}+\frac{t}{J}=1\). Using that the total time together \(t=4\) and \(P=J-6\), this becomes \(\frac4{J-6}+\frac4J=1\). Multiplying everything by the common denominator \(J(J-6)\) we get \(4J+4(J-6)=J^2-6J\). Rearranging, we get \(0=J^2-14J+24\), and factoring we get \(0=(J-12)(J-2)\). This gives either \(J=2\) (impossible since it takes them 4 hours working together) or the correct answer of \(J=12\).`,
  },
  {
    id: 30154, number: 154, division: "Theta", topic: "Inequalities", difficulty: 1, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 5 },
    question: String.raw`Which mathematical symbol best compares \(|x+y|\) and \(|x|+|y|\) over all real numbers \(x\) and \(y\) (that is, replace "and" with one of the following symbols to make a true mathematical statement in all cases)?`,
    choices: ["<", String.raw`\(\le\)`, "=", String.raw`\(\ge\)`, "NOTA"], answer: "B",
    solution: String.raw`While \(|x+y|\) could add nonnegative and negative stuff that interacts before you take the absolute value, \(|x|+|y|\) only adds nonnegative stuff to other nonnegative stuff. If \(x\) and \(y\) are both the same sign, both statements are equal, but if \(x\) and \(y\) are opposite signs, then \(|x+y|<|x|+|y|\). If either number is zero, equality holds as well. Therefore the symbol valid in all cases is \(\le\).`,
  },
  {
    id: 30155, number: 155, division: "Theta", topic: "Polynomial Equations", difficulty: 3, methods: ["Substitution"],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 6 },
    question: String.raw`How many real number solutions does the following equation have?
\[\left(\frac1x+2\right)^2+5\left(\frac1x+2\right)-14=0\]`,
    choices: ["0", "1", "2", "3", "NOTA"], answer: "B",
    solution: String.raw`Let \(u=\frac1x+2\) so that the equation reads \(u^2+5u-14=0\). This can factor into \((u+7)(u-2)=0\) or you can use the quadratic formula to find that \(u=-7\) and \(u=2\). Since \(u=\frac1x+2\), this means \(\frac1x+2=-7\), which has solution \(x=-\frac19\) and \(\frac1x+2=2\), which has no solution. So, this equation has one solution.`,
  },
  {
    id: 30156, number: 156, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 7 },
    question: String.raw`For a given line \(l_1\) with nonzero slope \(m\), we'll call a perpendicular line \(l_2\) and the "inverse" line to \(l_1\) we'll call \(l_3\) where the "inverse" line is defined as \(y=\frac1m x-\frac bm\). What is the product of the slopes of \(l_2\) and \(l_3\)?`,
    choices: ["We cannot determine", "-1", String.raw`\(\frac1m\)`, String.raw`\(-\frac1m\)`, "NOTA"], answer: "E",
    solution: String.raw`For a line \(y=mx+b\), the perpendicular line has slope \(-\frac1m\), while the inverse line is \(y=\frac1m x-\frac bm\) and therefore has slope \(\frac1m\). Therefore, the product of the two slopes is \(-\frac1{m^2}\), which is not listed.`,
  },
  {
    id: 30157, number: 157, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 8 },
    question: String.raw`The current in a river moves at a rate of 3 ft/sec. Rowing his kayak with the current, Pat travels 150 ft forward in the time it takes to travel 50 ft in the opposite direction. How fast can Pat row in still water?`,
    choices: ["5 ft/sec.", "10 ft/sec.", "12 ft/sec.", "15 ft/sec.", "NOTA"], answer: "E",
    solution: String.raw`This sets up the distance = rate * time equation \(d=r*t\). In the first scenario, Pat is getting a boost from the current, so the new rate is \(r+3\). Against the current gives \(r-3\). So, the first scenario becomes \(150=(r+3)*t\) and the second scenario is \(50=(r-3)*t\). One thing to do is to divide the first scenario by the second, which eliminates time and gives us \(3=\frac{r+3}{r-3}\). Solving for \(r\) then gives that \(r=6\) ft/sec. This is not listed, so the answer is NOTA.`,
  },
  {
    id: 30158, number: 158, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Geometric Sequence"],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 9 },
    question: String.raw`The number of poodles in Pat's Pet Palace doubles every three months. If after nine months, Pat has \(p\) poodles, which expression below represents how many poodles will Pat have after \(y\) years?`,
    choices: [String.raw`\((2p)^{4y}\)`, String.raw`\(p(2^{3y-2})\)`, String.raw`\(p(2^{4y-3})\)`, String.raw`\((2p)^3(4y-3)\)`, "NOTA"], answer: "C",
    solution: String.raw`In nine months, Pat's poodles have doubled three times, so Pat began with \(\frac{p}{2^3}\) poodles. Since \(y\) years is \(12y\) months, in terms of the doubling time, this is \(4y*3\) months, so after \(y\) years, Pat will have \(p\left(\frac1{2^3}\right)(2^{4y})=p(2^{4y-3})\) poodles.`,
  },
  {
    id: 30159, number: 159, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 10 },
    question: String.raw`What is the domain of the relation \(y=\log_2\left(\frac{\sqrt{6-2x}}{x-5}\right)\) in interval notation?`,
    choices: [String.raw`\((5,\infty)\)`, String.raw`\((-\infty,3]\)`, String.raw`\([3,5)\)`, String.raw`\((-\infty,3]\cup(5,\infty)\)`, "NOTA"], answer: "E",
    solution: String.raw`To make the log part work, the inside of the parentheses must be greater than 0. Since the inside of the parentheses is a fraction, that means the numerator and the denominator must both be negative or both be positive. Since the numerator is a square root, it is always nonnegative but only exists when \(x\le3\), while the denominator is positive when \(x>5\). Since no number satisfies these two conditions, there is no number that satisfies the domain of this function. In particular, at \(x=3\) the logarithm's argument is zero, also forbidden. The domain is empty, so the answer is NOTA.`,
  },
  {
    id: 30160, number: 160, division: "Theta", topic: "Optimization", difficulty: 1, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 11 },
    question: String.raw`Over all integers, what integer will minimize \(f(x)=5x^2-7x+11\)?`,
    choices: ["-1", "0", "1", "2", "NOTA"], answer: "C",
    solution: String.raw`For this quadratic equation, the vertex occurs at \(h=-\frac b{2a}=-\frac{-7}{2*5}=\frac7{10}\). Since this is an upward facing quadratic, the vertex corresponds to a minimum for the function. Since \(\frac7{10}\) isn't an integer, the closest integer will minimize the function. The closest integer is \(x=1\).`,
  },
  {
    id: 30161, number: 161, division: "Theta", topic: "Inequalities", difficulty: 5, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 12 },
    question: String.raw`What is the solution set to the following inequality in interval notation?
\[\frac{x^7(x-2)^4}{(x+5)^3(x+8)^6(x-9)^{11}}\le0\]`,
    choices: [
      String.raw`\((-\infty,-5)\cup[0,9)\)`,
      String.raw`\((-\infty,-8)\cup(-8,-5)\cup[0,9)\)`,
      String.raw`\((-\infty,-8)\cup(-8,-5)\cup[0,2)\cup(2,9)\)`,
      String.raw`\((-\infty,-8)\cup(-8,-5)\cup(0,2)\cup(2,9)\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`The easiest way to solve is to draw a number line with the zeros of the terms in parentheses labelled. When you do this and label the intervals where each part is positive or negative (the terms raised to an even power are positive away from their zeros), you find that the intervals \((-\infty,-8)\), \((-8,-5)\), \([0,2]\), and \([2,9)\) work with the inequality. The values of \(-8\) and \(-5\) are not allowed since it will make you divide by 0, but the values of 0 and 2 are fine. Since we are taking the union of two intervals at the end containing 2, those just become one interval \([0,9)\). Thus the answer is \((-\infty,-8)\cup(-8,-5)\cup[0,9)\).`,
  },
  {
    id: 30162, number: 162, division: "Theta", topic: "Functions", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 13 },
    question: String.raw`For \(f(x)=\frac{x-1}{x-2}\) and \(g(x)=\frac{x-3}{x-2}\), where \(x\) is over the real numbers, what is the domain of \(f\circ g\) in set notation?`,
    choices: [
      String.raw`\(\{x\mid x\ne2\}\)`,
      String.raw`\(\{x\mid x\ne1,x\ne2\}\)`,
      String.raw`\(\{x\mid x\ne1,x\ne3\}\)`,
      String.raw`\(\{x\mid x\ne1,x\ne2,x\ne3\}\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`Write the composite function without simplifying to find
\[f\circ g(x)=f(g(x))=\frac{\frac{x-3}{x-2}-1}{\frac{x-3}{x-2}-2}.\]
The value \(x=2\) will right away make you divide by zero, while \(x=1\) will make the denominator \(\frac{x-3}{x-2}-2\) equal zero, so that's out too. Anything else is fine, as it will not make you divide by zero. The domain is \(\{x\in\mathbb R\mid x\ne1,\ x\ne2\}\).`,
  },
  {
    id: 30163, number: 163, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 14 },
    question: String.raw`Solve the inequality \(|x+2|+|2x+10|>4\) in interval notation.`,
    choices: [
      String.raw`\((-\infty,-\frac{16}{3})\cup(\frac83,\infty)\)`,
      String.raw`\((-\infty,-\frac{16}{3})\cup(-4,\infty)\)`,
      String.raw`\((-\infty,-\frac{16}{3})\cup(-4,-2)\cup(\frac83,\infty)\)`,
      String.raw`\((-4,-2)\cup(\frac83,\infty)\)`,
      "NOTA",
    ], answer: "B",
    solution: String.raw`Split the real line at the zeros \(x=-5\) and \(x=-2\) of the expressions inside the absolute values.
\[
|x+2|+|2x+10|=
\begin{cases}
-3x-12,&x<-5,\\
x+8,&-5\le x<-2,\\
3x+12,&x\ge-2.
\end{cases}
\]
In the first case, \(-3x-12>4\) gives \(x<-\frac{16}{3}\). In the second, \(x+8>4\) gives \(-4<x<-2\). In the third, \(3x+12>4\) holds for all \(x\ge-2\). The above results now give us the interval
\[\left(-\infty,-\frac{16}{3}\right)\cup(-4,\infty)\]
as the solution set in interval notation. The graph below also confirms this is indeed the correct solution:
[[solution-diagram:theta-nsu-2026-14]]`,
  },
  {
    id: 30164, number: 164, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 15 },
    question: String.raw`Simplify \(\sqrt{27x-18}+\sqrt{3x^3-2x^2}-\sqrt{12x-8}\) by collecting radical terms so that you are only left with one radical expression. Assume all expressions under all radicals represent nonnegative real numbers and \(x\) is a nonnegative real number as well.`,
    choices: [
      String.raw`\((x+1)\sqrt{3x-2}\)`,
      String.raw`\(x\sqrt{3x-2}\)`,
      String.raw`\(\sqrt{3x^3-2x^2+15x-10}\)`,
      String.raw`\((x^2+5)\sqrt{3x-2}\)`,
      "NOTA",
    ], answer: "A",
    solution: String.raw`Treat each square root as its own expression. For the first square root, you can factor out a 9, which becomes a 3 outside the square root. For the second square root, you can factor out an \(x^2\), which becomes an \(x\) outside the square root (since we assume \(x\) is nonnegative). For the third square root, you can factor out a 4, which becomes a 2 outside the square root. Inside each square root is now \(3x-2\), so that becomes a common term you can factor out. Putting together like terms and not combining unlike terms, you get \((x+1)\) times the common factor of \(\sqrt{3x-2}\).`,
  },
  {
    id: 30165, number: 165, division: "Theta", topic: "Sequences and Series", difficulty: 2, methods: ["Telescoping"],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 16 },
    question: String.raw`What is \(\sum_{n=1}^{100}\left(\frac1n-\frac1{n+1}\right)\)?`,
    choices: ["1", String.raw`\(\frac12\)`, String.raw`\(\frac{99}{100}\)`, String.raw`\(\frac{100}{101}\)`, "NOTA"], answer: "D",
    solution: String.raw`As we start writing out the sum
\[\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\left(\frac13-\frac14\right)+\cdots+\left(\frac1{99}-\frac1{100}\right)+\left(\frac1{100}-\frac1{101}\right)\]
we see that the middle terms all cancel out, leaving us with just the end terms \(1-\frac1{101}\), which is \(\frac{100}{101}\).`,
  },
  {
    id: 30166, number: 166, division: "Theta", topic: "Simplification", difficulty: 4, methods: ["Partial Fractions"],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 17 },
    question: String.raw`If
\[\frac{x^2+7x}{(x-1)(x^2+1)}=\frac{A}{x-1}+\frac{Bx+C}{x^2+1},\]
then what is \(\frac{AB}{C}\)?`,
    choices: ["-3", "-12", "6", "9", "NOTA"], answer: "A",
    solution: String.raw`We multiply what's needed to each fraction to get the common denominator of \((x-1)(x^2+1)\) and then equate the numerators: \(x^2+7x=A(x^2+1)+(Bx+C)(x-1)\). By distributing, we get \(x^2+7x=Ax^2+A+Bx^2-Bx+Cx-C\). By looking at the like terms for \(x^2\), \(x\) and the constants, it builds the system of equations:
\[\begin{aligned}1&=A+B\\7&=-B+C\\0&=A-C.\end{aligned}\]
Solving this system of equations gives \(A=4\), \(B=-3\), \(C=4\), which leads to answer A, since \(\frac{AB}{C}=-3\).`,
  },
  {
    id: 30167, number: 167, division: "Theta", topic: "Inequalities", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 18 },
    question: String.raw`If \(f(x)=x^2-8x+23\) and \(g(x)=2x-13\), find all values of \(a\) such that \(g(a)<f(x)\) for all values of \(x\). Express your answer in interval notation.`,
    choices: [String.raw`\((-\infty,4)\)`, String.raw`\((4,\infty)\)`, String.raw`\((-\infty,10)\)`, String.raw`\((10,\infty)\)`, "NOTA"], answer: "C",
    solution: String.raw`For \(f(x)=x^2-8x+23\), we can find the \(y\) value of the vertex by either using the formula \(k=c-\frac{b^2}{4a}\) or by completing the square to find that the vertex has \(y\) value 7. Therefore, \(f(x)\) is a quadratic with range \([7,\infty)\). So, we need \(g(a)=2a-13<7\), which gives \(a<10\), which is displayed in interval notation in answer choice C.`,
  },
  {
    id: 30168, number: 168, division: "Theta", topic: "Inequalities", difficulty: 1, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 19 },
    question: String.raw`If \(f(x)=x^2-8x+23\) and \(g(x)=2x-13\) as in the problem above, find all values of \(a\) such that \(g(a)<f(x)\) for some value \(x\). Express your answer in interval notation.`,
    choices: [String.raw`\((-\infty,\infty)\)`, String.raw`\([7,\infty)\)`, String.raw`\((-\infty,10)\)`, String.raw`\((4,\infty)\)`, "NOTA"], answer: "A",
    solution: String.raw`Since the range of \(f(x)\) is \([7,\infty)\), and the range of the line \(g(x)\) is \((-\infty,\infty)\), for any \(a\) we can find at least one \(x\) such that \(g(a)<f(x)\). For example, if \(a=x\) it is always true that \(g(a)=g(x)<f(x)\); i.e., the graph of the parabola is always above the graph of the line. Indeed, \(f(x)-g(x)=x^2-10x+36=(x-5)^2+11>0\). Thus every real \(a\) works.`,
  },
  {
    id: 30169, number: 169, division: "Theta", topic: "Probability", difficulty: 4, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 20 },
    question: String.raw`Angela has exactly one $1 bill, one $5 bill, one $10 bill, one $20 bill, one $50 bill and one $100 bill. She wants to give Bob and Casey all of her money so that the difference in the amounts she gives them differs by $25 or less. How many different ways can Angela give Bob and Casey her money?`,
    choices: ["8", "6", "4", "2", "NOTA"], answer: "B",
    solution: String.raw`The minimum amount that either Bob or Casey can receive is \(\frac{186-25}{2}=80.5\), so \(\$81\). The maximum amount that either one can receive is \(\$186-\$81=\$105\). The only values within this range that are possible to form from the given set of bills are listed below for a total of 6 ways when we consider that either Bob or Casey can receive either amount listed:
\[\begin{aligned}
50+20+10+1&=81,\quad100+5=105,\\
50+20+10+5&=85,\quad100+1=101,\\
50+20+10+5+1&=86,\quad100=100.
\end{aligned}\]
Their respective differences are \(|81-105|=24\), \(|85-101|=16\), and \(|86-100|=14\). To see completeness, the recipient without the \(\$100\) bill has at most \(\$86\), so must receive between \(\$81\) and \(\$86\). Omitting any of the \(\$50,\$20,\$10\) bills makes that impossible; the optional \(\$5,\$1\) bills give exactly \(81,85,86\). Each split has two assignments to the two named recipients.`,
  },
  {
    id: 30170, number: 170, division: "Theta", topic: "Polynomials", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 21 },
    question: String.raw`When the cubic function \(f(x)=9x^3-x+5\) is divided by \(g(x)=3x-2\), it approaches a quadratic function as \(x\) goes to positive infinity. What is the smallest positive integer value for \(x\) such that the height difference between \(f(x)\div g(x)\) and the quadratic equation it approaches is less than one?`,
    choices: ["2", "3", "4", "5", "NOTA"], answer: "C",
    solution: String.raw`When we long divide \(f(x)=9x^3-x+5\) by \(g(x)=3x-2\), we get
\[3x^2+2x+1+\frac7{3x-2}.\]
Therefore, the quadratic equation \(f\div g\) approaches is \(3x^2+2x+1\), with error/remainder \(\frac7{3x-2}\). Therefore, we want the absolute height difference to be less than 1. For positive integer \(x\), \(3x-2>0\), so solving \(\frac7{3x-2}<1\) gives \(x>3\), and thus, we need \(x=4\).`,
  },
  {
    id: 30171, number: 171, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 22 },
    question: String.raw`A mold grows exponentially and doubles its size every 4 years. If there is 100 grams of mold to begin with, which value or expression below represents how many grams of mold there will be after 7 years?`,
    choices: [String.raw`\(200\sqrt[4]{8}\)`, "350", String.raw`\(175\ln2\)`, "275", "NOTA"], answer: "A",
    solution: String.raw`Since the doubling time is every 4 years, this creates the exponential equation \(2=e^{4k}\), where \(k\) is the growth rate. Solving for \(k\), we get \(k=\frac{\ln2}{4}\). Now, using the exponential growth equation \(P(t)=P_0e^{kt}\), with \(P_0=100\), after 7 years we get
\[P(7)=100e^{\frac{\ln2}{4}(7)},\]
which, after properties of logs, simplifies to \(100e^{\ln(2^{7/4})}=100(2^{7/4})\), which simplifies finally to \(200\sqrt[4]{8}\).`,
  },
  {
    id: 30172, number: 172, division: "Theta", topic: "Function Analysis", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 23 },
    question: String.raw`What is the range of the function \(f(x)=\frac1{x^2-6x+14}-7\)?`,
    choices: [String.raw`\((-\frac{34}{5},\infty)\)`, String.raw`\([-7,\infty)\)`, String.raw`\([-\frac{34}{5},\infty)\)`, String.raw`\((-\frac{34}{5},-7)\)`, "NOTA"], answer: "E",
    solution: String.raw`We can either complete the square in the denominator or figure out the coordinates of the vertex to find \(x^2-6x+14=(x-3)^2+5\). This means that the denominator is at least 5 (since \((x-3)^2\ge0\)) and can go to infinity. So, the fraction can go down to 0 (but never actually reach 0) since the quadratic can go up to infinity, and the fraction can be \(\frac15\) at its biggest (and can actually reach \(\frac15\)). So, subtracting 7 at the end means that \(f(x)\) will go between \(\frac15-7=-\frac{34}{5}\) and \(0-7=-7\). It will actually reach \(-\frac{34}{5}\) but will never reach \(-7\). So, the answer is \(\left(-7,-\frac{34}{5}\right]\), which is not any of the choices.`,
  },
  {
    id: 30173, number: 173, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 24 },
    question: String.raw`What is the area between the \(x\)-axis and the function \(f(x)=|6-2x|\) between the \(x\) values (vertical lines) of \(x=-1\) and \(x=5\)?`,
    choices: ["12", "20", "24", "40", "NOTA"], answer: "B",
    solution: String.raw`We can draw this function and see that it makes two triangles, one starting at height 8 when \(x=-1\) and then going down to height 0 when \(x=3\). That's when the other triangle begins, going until \(x=5\), when the height becomes 4. So, the first triangle has height 8 and base 4, which means area \(\frac12*8*4=16\), and the second triangle has height 4 and base 2, which means area \(\frac12*4*2=4\). Adding these areas together gives total area 20.`,
  },
  {
    id: 30174, number: 174, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Substitution"],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 25 },
    question: String.raw`Alex was digging a hole in her yard when she thought: "I've dug half of the depth of this hole. I'm 70 inches tall, and right now my head is above ground-level by a certain amount when I stand in the hole. When I am done digging this hole and stand in it, my head will be twice as far below ground-level as it is now above." What will be the hole's final depth?`,
    choices: ["100 inches", "105 inches", "110 inches", "115 inches", "NOTA"], answer: "B",
    solution: String.raw`Let \(x\) be the final depth of the hole and let \(y\) be the amount that Alex's head is above ground-level when the hole is half dug. So \(\frac12x+y=70\) and \(x-2y=70\). Solving this system of equations gives \(x=105\) inches.`,
  },
  {
    id: 30175, number: 175, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 26 },
    question: String.raw`The outer edge of a picture frame measures 14 cm by 20 cm and the picture inside the frame measures \(160\text{ cm}^2\). The frame forms a border that is the same width all around the picture in that there is a border of uniform width between the outer edge of the picture frame and the outer edge of the picture that is inside the frame. What is the width of this border?`,
    choices: ["1 cm", "2 cm", "3 cm", "4 cm", "NOTA"], answer: "B",
    solution: String.raw`Since the frame takes up space on both sides of the picture, as well as above and below the picture, this sets up the equation \((14-2x)(20-2x)=160\). Expanding and moving things around gives \(4x^2-68x+120=0\), which simplifies to \(x^2-17x+30=0\), which factors into \((x-15)(x-2)=0\). This means either \(x=15\) cm (an impossibility since one entire side of the picture frame is 14 cm) or \(x=2\) cm, which is the correct answer.`,
  },
  {
    id: 30176, number: 176, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 27 },
    question: String.raw`Find all values of \(x\) (in interval notation) such that
\[-x^2+10x-18>|3x-18|.\]`,
    choices: [String.raw`\((0,7)\)`, String.raw`\((4,7)\)`, String.raw`\((4,9)\)`, String.raw`\([0,7]\)`, "NOTA"], answer: "B",
    solution: String.raw`The expression \(|3x-18|\) is \(-3x+18\) when \(x<6\) and \(3x-18\) when \(x\ge6\). Solving the equation \(-x^2+10x-18=-3x+18\) gives that either \(x=4\) or \(x=9\); and so, only \(x=4\) works on the branch \(x<6\). Similarly, solving \(-x^2+10x-18=3x-18\) gives either \(x=0\) or \(x=7\); and so, only \(x=7\) works on the branch \(x\ge6\). So, strictly between \(x=4\) and \(x=7\), the downward opening parabola is above the V-shaped absolute value function. The solution is \((4,7)\).`,
  },
  {
    id: 30177, number: 177, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 28 },
    question: String.raw`Which of the following expressions is equivalent to \(\sqrt{a\cdot\sqrt[3]{a\cdot\sqrt[4]{a}}}\)?`,
    choices: [String.raw`\(a^{15/16}\)`, String.raw`\(a^{1/24}\)`, String.raw`\(a^{17/24}\)`, String.raw`\(a^4\)`, "NOTA"], answer: "C",
    solution: String.raw`This can be rewritten in ways to make this more obvious, such as
\[\sqrt a\cdot\sqrt{\sqrt[3]a}\cdot\sqrt{\sqrt[3]{\sqrt[4]a}},\]
which is \(a^{1/2}\cdot a^{(1/2)(1/3)}\cdot a^{(1/2)(1/3)(1/4)}\), which is \(a^{1/2}\cdot a^{1/6}\cdot a^{1/24}\), which is \(a^{1/2+1/6+1/24}=a^{17/24}\). The real radical domain requires \(a\ge0\), including \(a=0\).`,
  },
  {
    id: 30178, number: 178, division: "Theta", topic: "Rate of Change", difficulty: 2, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 29 },
    question: String.raw`Alex is trying to fill her pool with water using 2 hoses. The first hose could fill her pool in 2 hours working alone and the second hose could fill her pool in 3 hours working alone. Suppose Alex uses both hoses to fill her pool, but she also leaves the drain open which can empty her entire pool in 4 hours. How many hours does it take for her pool to fill up under these conditions?`,
    choices: [String.raw`\(\frac7{12}\)`, String.raw`\(\frac{12}{7}\)`, String.raw`\(\frac56\)`, String.raw`\(\frac65\)`, "NOTA"], answer: "B",
    solution: String.raw`This sets up the equation \(\frac t2+\frac t3-\frac t4=1\). Solving for \(t\) gives \(t=\frac{12}{7}\).`,
  },
  {
    id: 30179, number: 179, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: [],
    source: { competition: "2026 NSU March Statewide", event: "Algebra 2 Individual", questionNumber: 30 },
    question: String.raw`There are two numbers such that each one is sixteen times as large as four times its multiplicative inverse. What is the smaller of the two values of these two numbers?`,
    choices: ["-64", "-8", "8", "64", "NOTA"], answer: "B",
    solution: String.raw`This sets up the equation \(\frac{x}{16}=\frac4x\). Cross-multiplying, we get \(x^2=64\), which gives us that \(x=\pm8\). So, the smaller value is \(x=-8\).`,
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
    question: String.raw`Given that \(r_1\) is the only real root of \(f(x)=x^3-15x-126=0\) and \(r_2\) and \(r_3\) are complex roots of \(f(x)\), find \(\frac1{r_2}+\frac1{r_3}\).`, choices: [String.raw`\(-\frac7{150}\)`,String.raw`\(-\frac27\)`,String.raw`\(-\frac1{21}\)`,"1","NOTA"], answer: "B",
    solution: String.raw`Checking small integers gives \(r_1=6\). By Vieta's formulas, \(r_2+r_3=-6\) and \(r_1r_2r_3=126\), so \(r_2r_3=21\). Therefore \(\frac1{r_2}+\frac1{r_3}=\frac{r_2+r_3}{r_2r_3}=\boxed{-\frac27}\).` },
  { id: 30332, number: 332, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`What is the area of the largest square that can be inscribed in the ellipse \(9x^2+16y^2=144\)?`, choices: [String.raw`\(\frac{576}{25}\)`,String.raw`\(\frac{144}{25}\)`,String.raw`\(\frac{25}{144}\)`,String.raw`\(\frac{25}{576}\)`,"NOTA"], answer: "A",
    solution: String.raw`The largest square is centered at the origin with vertices \((\pm t,\pm t)\). Substitution gives \(25t^2=144\). Its side length is \(2t\), so its area is \(4t^2=\boxed{\frac{576}{25}}\).` },
  { id: 30333, number: 333, division: "Theta", topic: "Conic Sections", difficulty: 2, methods: ["Completing the Square"],
    question: String.raw`Let \(g(x)=2x^2-3x+4\). Find the distance from the vertex of this parabola to its focus.`, choices: ["2","1","0.5","0.125","NOTA"], answer: "D",
    solution: String.raw`Completing the square puts the parabola in the form \(y=2(x-h)^2+k\). Comparing \((x-h)^2=4p(y-k)\) gives \(4p=\frac12\), so the vertex-to-focus distance is \(p=\boxed{\frac18}=0.125\).` },
  { id: 30334, number: 334, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: ["Row Operations"],
    question: String.raw`The following system of equations has exactly one solution \((x_1,x_2,x_3,x_4)\). Find \(x_2+x_4\).\[\begin{aligned}2x_1-3x_2+x_3-x_4&=4\\-5x_1+x_2-x_3+2x_4&=-1\\x_2-x_3-4x_4&=-20\\3x_1-x_2+x_3+x_4&=11\end{aligned}\]`, choices: ["7","6","3","-3","NOTA"], answer: "C",
    solution: String.raw`Adding all four equations cancels the \(x_1\)- and \(x_3\)-terms and gives \(-2x_2-2x_4=-6\). Hence \(x_2+x_4=\boxed3\).` },
  { id: 30335, number: 335, division: "Theta", topic: "Functions", difficulty: 2, methods: ["Symmetry"],
    question: String.raw`Let \(f_1,f_2,\) and \(f_3\) be roots of \(F(x)=ax^3+bx^2+cx+d\), an odd function. Let \(g_1\) and \(g_2\) be two of the 5 roots of \(G(x)=\sqrt[5]{2}x^5-\sqrt[3]{3}x^3-2x^2+1\). Find the maximum possible value of \(f_1\cdot f_2\cdot f_3\cdot g_1\cdot g_2\).`, choices: ["1","0",String.raw`\(\sqrt2\)`,String.raw`\(-1+\sqrt2\)`,"NOTA"], answer: "B",
    solution: String.raw`An odd function has origin symmetry and must satisfy \(F(0)=0\). Thus one of \(f_1,f_2,f_3\) is 0, so the entire product is always \(\boxed0\).` },
  { id: 30336, number: 336, division: "Theta", topic: "Inequalities", difficulty: 2, methods: ["Absolute Value"],
    question: String.raw`How many integer solutions exist for the inequality \(\bigl||x-3|-4\bigr|\le7\)?`, choices: ["7","15","11","22","NOTA"], answer: "E",
    solution: String.raw`Since \(|x-3|-4\ge-4\), the lower bound is automatic. The upper bound gives \(|x-3|\le11\), so \(-8\le x\le14\). There are \(14-(-8)+1=23\) integer solutions, which is not listed. Thus the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30337, number: 337, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Base Conversion"],
    question: String.raw`When \(2020!\) is written in base 10, it has 5802 digits. When it is written in base \(b\), it has exactly half as many digits, where \(b\) is a perfect square. Compute the sum of the positive proper divisors of \(b\).`, choices: ["117","103","217","256","NOTA"], answer: "A",
    solution: String.raw`A base-100 digit represents exactly two base-10 digits, so \(b=100\) gives 2901 digits and is a perfect square. Its positive proper divisors are \(1,2,4,5,10,20,25,50\), whose sum is \(\boxed{117}\).` },
  { id: 30338, number: 338, division: "Theta", topic: "Geometry", difficulty: 5, methods: ["Tangency", "Pythagorean Theorem"],
    question: String.raw`Let triangle \(APX\) have a right angle at \(X\), and side lengths \(\overline{AX}=6\) and \(\overline{PX}=11\). Suppose a circle is to pass through point \(X\) such that it is tangent to side \(\overline{AP}\). What is the minimum area of this circle?`, choices: [String.raw`\(\frac{1024\pi}{169}\)`,String.raw`\(\frac{4356\pi}{157}\)`,String.raw`\(\frac{1089\pi}{157}\)`,String.raw`\(\frac{157\pi}{128}\)`,"NOTA"], answer: "C",
    solution: String.raw`The smallest such circle has the altitude from \(X\) to \(AP\) as a diameter. If that altitude is \(h\), then \(\frac1{h^2}=\frac1{6^2}+\frac1{11^2}\), so \(h^2=\frac{4356}{157}\). Therefore the circle's area is \(\frac{\pi h^2}{4}=\boxed{\frac{1089\pi}{157}}\).` },
  { id: 30339, number: 339, division: "Theta", topic: "Geometry", difficulty: 2, methods: [],
    question: String.raw`The interior angle of a regular \(p\)-gon is \(176^\circ\). Consider a \((2p+1)\)-gon, then find the sum of the measures of its interior angles.`, choices: [String.raw`\(32{,}580^\circ\)`,String.raw`\(32{,}220^\circ\)`,String.raw`\(32{,}040^\circ\)`,String.raw`\(18{,}600^\circ\)`,"NOTA"], answer: "B",
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
    question: String.raw`Which of the following statements must be true given that \(f\) is a function that satisfies the following properties?\[\begin{aligned}&\text{I. } f(x)\ge0\text{ for all }x\ge0\\&\text{II. } f(x+y)=\frac{yf(x)+xf(y)}2\end{aligned}\]`, choices: [String.raw`\(f(x)=0\)`,String.raw`\(f(0)=1\)`,String.raw`\(f(x)\text{ is not bounded above}\)`,String.raw`\(f(1)=-1\)`,"NOTA"], answer: "A",
    solution: String.raw`Set \(x=y=0\) in property II to get \(f(0)=0\). Then set \(y=0\): \(f(x)=\frac{x f(0)}2=0\) for every \(x\). Thus \(\boxed{f(x)=0}\).` },
  { id: 30345, number: 345, division: "Theta", topic: "Algebra", difficulty: 3, methods: [],
    question: String.raw`Let \(a=\sqrt{42+\sqrt{42+\sqrt{42+\cdots}}}\) and \(b=\sqrt[3]{-2+5\sqrt[3]{-2+5\sqrt[3]{-2+5\cdots}}}\), with \(a,b\in\mathbb Z\). Find the discriminant of \(y=x^2+bx-a\).`, choices: ["16","32","56","-24","NOTA"], answer: "B",
    solution: String.raw`The first radical satisfies \(a^2=42+a\), giving the positive integer \(a=7\). The second satisfies \(b^3=-2+5b\), and \(b=2\) is its integer value. The discriminant of \(x^2+bx-a\) is \(b^2+4a=4+28=\boxed{32}\).` },
  { id: 30346, number: 346, division: "Theta", topic: "Probability", difficulty: 4, methods: ["Inclusion-Exclusion"],
    question: String.raw`Compute the probability that in a given distinguishable permutation of the letters of \(\text{SCAROLINA}\), the C appears next to an A.`, choices: [String.raw`\(\frac1{18}\)`,String.raw`\(\frac29\)`,String.raw`\(\frac{16}{9!}\)`,String.raw`\(\frac1{9!}\)`,"NOTA"], answer: "E",
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
    question: String.raw`Find the sum of the solutions to \(\lvert10x^2-30x+20\rvert=x\).`, choices: [String.raw`\(\frac{31}{10}\)`,String.raw`\(\frac{29}{10}\)`,String.raw`\(\frac{41}{10}\)`,String.raw`\(\frac{17}{10}\)`,"NOTA"], answer: "E",
    solution: String.raw`The two cases are \(10x^2-30x+20=x\), whose roots sum to \(31/10\), and \(10x^2-30x+20=-x\), whose roots sum to \(29/10\). All four roots satisfy their respective sign conditions, so the total is \(6\), which is not listed. Thus the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30352, number: 352, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pythagorean Theorem"],
    question: String.raw`Two parallel chords with length 8 and 10 lie within a circle such that the center of the circle is between them. Let the distance from the center to the shorter chord be \(m\) and the distance to the longer chord be \(n\). Given that \(m+n=10\), find \(mn\).`, choices: ["10","100",String.raw`\(\frac{9919}{400}\)`,String.raw`\(\frac{10081}{400}\)`,"NOTA"], answer: "C",
    solution: String.raw`Perpendiculars from the center bisect the chords, so \(m^2+4^2=r^2\) and \(n^2+5^2=r^2\). Thus \((m-n)(m+n)=9\), giving \(m-n=9/10\). With \(m+n=10\), \(m=109/20\) and \(n=91/20\), so \(mn=\boxed{\frac{9919}{400}}\).` },
  { id: 30353, number: 353, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    question: String.raw`The quantity \(\sqrt{4+\sqrt{12}}\) can be written as \(\sqrt a+\sqrt b\), where \(a\) is not prime and \(b\) is not divisible by the square of any prime. Compute \((10b+a)^{b-a}\).`, choices: ["961","441","121","1","NOTA"], answer: "A",
    solution: String.raw`Squaring \(\sqrt a+\sqrt b\) gives \(a+b+2\sqrt{ab}=4+\sqrt{12}\). Thus \(a+b=4\) and \(ab=3\). The conditions select \(a=1,b=3\), so \((10b+a)^{b-a}=31^2=\boxed{961}\).` },
  { id: 30354, number: 354, division: "Theta", topic: "Number Theory", difficulty: 4, methods: ["Base Conversion"],
    question: String.raw`Rational number \(r\) is the largest number less than 1 whose base 5 expansion has two distinct repeating digits, \(r=0.\overline{ABABAB\ldots}_5\). Written as a reduced fraction, \(r=\frac pq\). Compute \(p+q\).`, choices: ["47","24","39","95","NOTA"], answer: "A",
    solution: String.raw`The largest possible distinct repeating digits are \(A=4\) and \(B=3\), so \(r=0.\overline{43}_5\). Therefore \(r=\frac{(43)_5}{5^2-1}=\frac{23}{24}\), and \(p+q=\boxed{47}\).` },
  { id: 30355, number: 355, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pythagorean Theorem"],
    question: String.raw`Quadrilateral \(LMAO\) is a kite with \(LM=MA=5\), \(LA=8\), and \(MO=11\). Compute the length of \(LO\).`, choices: [String.raw`\(4\sqrt3\)`,"8",String.raw`\(4\sqrt5\)`,String.raw`\(4\sqrt6\)`,"NOTA"], answer: "C",
    solution: String.raw`Let the diagonals \(LA\) and \(MO\) meet at \(X\). In a kite, \(MO\) perpendicularly bisects \(LA\), so \(LX=4\). From right triangle \(LMX\), \(MX=3\), hence \(XO=11-3=8\). Therefore \(LO=\sqrt{4^2+8^2}=\boxed{4\sqrt5}\).` },
  { id: 30356, number: 356, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    question: String.raw`In interval notation, what is the solution set of the inequality \(\frac{x+2}{x-3}\le5\)?`, choices: [String.raw`\((-\infty,-3)\cup[5,\infty)\)`,String.raw`\((-\infty,-3]\cup\left[\frac{17}{4},\infty\right)\)`,String.raw`\((-\infty,\infty)\)`,String.raw`\((-\infty,3)\cup\left[\frac{17}{4},\infty\right)\)`,"NOTA"], answer: "D",
    solution: String.raw`Moving everything to one side gives \(\frac{-4x+17}{x-3}\le0\). Its critical values are \(3\), where the expression is undefined, and \(17/4\), where it is zero. A sign chart gives \(\boxed{(-\infty,3)\cup\left[\frac{17}{4},\infty\right)}\).` },
  { id: 30357, number: 357, division: "Theta", topic: "Polynomials", difficulty: 4, methods: ["Vieta's Formulas"],
    question: String.raw`The roots of \(d(x)=x^3-9x^2+21x+D\) form an arithmetic progression. Find the sum of the reciprocals of the roots of \(d(x)\).`, choices: ["9",String.raw`\(\frac{10}{3}\)`,String.raw`\(\frac73\)`,"21","NOTA"], answer: "C",
    solution: String.raw`Write the roots as \(p-r,p,p+r\). Their sum is \(3p=9\), so \(p=3\). Substituting \(x=3\) into the polynomial gives \(27-81+63+D=0\), hence \(D=-9\). By Vieta's formulas, the sum of the reciprocals is \(\frac{21}{-D}=\boxed{\frac73}\).` },
  { id: 30358, number: 358, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    question: String.raw`For this question, \(\lfloor x\rfloor\) means "the greatest integer less than or equal to \(x\)." The smallest \(x\) that satisfies the equation \(\left\lfloor\lfloor x\rfloor+0.5\right\rfloor=20\) is the positive square root of what number?`, choices: ["324","361","441","484","NOTA"], answer: "E",
    solution: String.raw`Because \(\lfloor x\rfloor\) is an integer, \(\left\lfloor\lfloor x\rfloor+0.5\right\rfloor=\lfloor x\rfloor\). Thus the smallest \(x\) is 20, which is the positive square root of 400. Since 400 is not listed, the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30359, number: 359, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: [],
    question: String.raw`Given that \(\log2=a\) and \(\log3=b\), express \(\log375\) in terms of \(a\) and \(b\).`, choices: [String.raw`\(\frac{3-a}{b}\)`,String.raw`b-3a+3`,String.raw`3ab-b`,String.raw`a+3b-3`,"NOTA"], answer: "B",
    solution: String.raw`Since \(375=3\cdot5^3\), \(\log375=b+3\log5\). Also \(\log5=\log(10/2)=1-a\). Therefore \(\log375=b+3(1-a)=\boxed{b-3a+3}\).` },

  // 2025 MAO National Convention, Theta Individual.
  { id: 30360, number: 360, division: "Theta", topic: "Systems of Equations", difficulty: 1, methods: [],
    question: String.raw`The Snowman has 2 bags of nuts. He knows the mixture in bag 1 is 60% walnuts and 40% pecans. Bag 2 contains pecans only. If The Snowman wants 20 pounds of nuts, 36% of them walnuts, how many pounds of nuts from bag 1 should he combine with nuts from bag 2?`, choices: ["8","10","12","16","NOTA"], answer: "C",
    solution: String.raw`The final mixture must contain \(0.36(20)=7.2\) pounds of walnuts. If \(x\) pounds come from bag 1, then those walnuts weigh \(0.60x\) pounds; bag 2 contributes no walnuts. Thus \(0.60x=7.2\), so \(x=\boxed{12}\) pounds.` },
  { id: 30361, number: 361, division: "Theta", topic: "Inequalities", difficulty: 1, methods: [],
    question: String.raw`Find the number of integers \(K\) that satisfy the inequality \(2025!+17<K<2025!+76\).`, choices: ["58","59","60","76","NOTA"], answer: "A",
    solution: String.raw`Because both endpoints are integers and the inequalities are strict, \(K-2025!\) can be any integer from 18 through 75. The inclusive count is \(75-18+1=\boxed{58}\).` },
  { id: 30362, number: 362, division: "Theta", topic: "Complex Numbers", difficulty: 2, methods: ["Conjugates", "Vieta's Formulas"],
    question: String.raw`A quadratic equation of the form \(ax^2+bx+c=0\), with real coefficients and \(a>0\), has a solution of \(\frac{-3-i\sqrt2}{2}\). Find the coefficient of the linear term if the coefficients are relatively prime and \(a>0\).`, choices: ["-12","-6","6","12","NOTA"], answer: "D",
    solution: String.raw`A polynomial with real coefficients must also have the conjugate root \(\frac{-3+i\sqrt2}{2}\). Their sum is \(-3\) and their product is \(\frac{9+2}{4}=\frac{11}{4}\), so the monic quadratic is \(x^2+3x+\frac{11}{4}=0\). Multiplying by 4 gives the relatively prime integer coefficients \(4x^2+12x+11=0\); hence \(b=\boxed{12}\).` },
  { id: 30363, number: 363, division: "Theta", topic: "Inverse Functions", difficulty: 2, methods: ["Inverse Functions"],
    question: String.raw`Find \(g^{-1}(4)\) if \(g(x)=\sqrt{\frac{x-1}{5}}+7\).`, choices: ["No solution",String.raw`\(\frac{35+\sqrt{15}}5\)`,"46","50","NOTA"], answer: "A",
    solution: String.raw`For every input in the domain, \(\sqrt{\frac{x-1}{5}}\ge0\), so \(g(x)\ge7\). Therefore 4 is not in the range of \(g\), and there is \(\boxed{\text{no solution}}\) to \(g(x)=4\).` },
  { id: 30364, number: 364, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant", "Matrix Inverse"],
    question: String.raw`Given matrix \(A=\begin{bmatrix}2&2\\-1&4\end{bmatrix}\), find the value of the determinant of \(3A^{-1}\).`, choices: [String.raw`\(\frac3{10}\)`,String.raw`\(\frac9{10}\)`,String.raw`\(\frac{13}{10}\)`,String.raw`\(\frac95\)`,"NOTA"], answer: "B",
    solution: String.raw`First, \(\det A=2(4)-2(-1)=10\), so \(\det(A^{-1})=1/10\). Multiplying a \(2\times2\) matrix by 3 multiplies its determinant by \(3^2\). Hence \(\det(3A^{-1})=9\det(A^{-1})=\boxed{\frac9{10}}\).` },
  { id: 30365, number: 365, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Pythagorean Theorem"],
    question: String.raw`A sphere of radius 2 is inscribed in a right circular cone whose height is 12. Find the radius of the cone.`, choices: [String.raw`\(\sqrt6\)`,"2.4","3","6","NOTA"], answer: "A",
    solution: String.raw`An axial cross-section is an isosceles triangle with height 12, half-base \(R\), equal side \(\ell=\sqrt{R^2+144}\), and incircle radius 2. Its area is \(12R\) and semiperimeter is \(R+\ell\), so \(2=\frac{12R}{R+\ell}\). Thus \(\ell=5R\). Squaring \(\sqrt{R^2+144}=5R\) gives \(24R^2=144\), so the cone radius is \(R=\boxed{\sqrt6}\).` },
  { id: 30366, number: 366, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    question: String.raw`A parabola with a vertical directrix passes through the point \((3,3)\) and has its vertex at \((4,1)\). What is the sum of the \(y\)-intercepts?`, choices: ["0","2","4","8","NOTA"], answer: "B",
    solution: String.raw`A vertical directrix means the parabola has a horizontal axis, so its equation is \((y-1)^2=4p(x-4)\). Substituting \((3,3)\) gives \(4=4p(-1)\), hence \(p=-1\). At a \(y\)-intercept, \(x=0\), so \((y-1)^2=16\), giving \(y=5\) and \(y=-3\). Their sum is \(\boxed2\).` },
  { id: 30367, number: 367, division: "Theta", topic: "Logs and Exponents", difficulty: 2, methods: ["Geometric Sequence"],
    question: String.raw`Wiggie started a math team with 10 kids, and it has grown exponentially to 160 kids after 8 years. How many members (rounded to the nearest integer) will it have after the 9th year if the pattern continues?`, choices: ["224","226","240","320","NOTA"], answer: "B",
    solution: String.raw`If the annual growth factor is \(r\), then \(10r^8=160\), so \(r^8=16\) and \(r=\sqrt2\). After the ninth year the team has \(160\sqrt2\approx226.27\) members, which rounds to \(\boxed{226}\).` },
  { id: 30368, number: 368, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`In rectangle \(MRLU\), point \(F\) lies on side \(\overline{LU}\) such that the area of triangle \(LRF\) minus the area of triangle \(MUF\) equals the area of triangle \(MFR\) minus the area of triangle \(LRF\). If the area of triangle \(MUF\) equals 8, what is the area of triangle \(MRF\)?`, choices: [String.raw`\(\frac{40}{3}\)`,"16","20","24","NOTA"], answer: "D",
    solution: String.raw`The three triangles \(MUF\), \(LRF\), and \(MRF\) partition the rectangle. Because \(MRF\) has base \(MR\) and the rectangle's full height, it occupies half the rectangle; the other two triangles occupy the other half. Thus \([MRF]=[MUF]+[LRF]\). Let \([LRF]=x\). The given condition becomes \(x-8=(x+8)-x=8\), so \(x=16\). Therefore \([MRF]=8+16=\boxed{24}\).` },
  { id: 30369, number: 369, division: "Theta", topic: "Probability", difficulty: 2, methods: ["Complement Rule"],
    question: String.raw`A permutation of the letters in MRWIGYLU is selected at random. What is the probability that there is a vowel among the first five letters? (I and U are the only vowels)`, choices: [String.raw`\(\frac3{28}\)`,String.raw`\(\frac3{14}\)`,String.raw`\(\frac{11}{14}\)`,String.raw`\(\frac{25}{28}\)`,"NOTA"], answer: "D",
    solution: String.raw`Only the positions of I and U matter. Their two positions are equally likely to be any of the \(\binom82=28\) pairs of positions. The complement event has both vowels among the last three positions, which can occur in \(\binom32=3\) ways. Therefore the desired probability is \(1-\frac3{28}=\boxed{\frac{25}{28}}\).` },
  { id: 30370, number: 370, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    question: String.raw`There are some integral ordered pairs \((M,U)\) with \(M<U\) that satisfy \(M^2+U^2=25\). Find the sum of all possible distinct values of \(M\).`, choices: ["-6","0","3","7","NOTA"], answer: "E",
    solution: String.raw`The integer points on \(M^2+U^2=25\) use \((|M|,|U|)=(0,5),(3,4),(4,3),\) or \((5,0)\). Imposing \(M<U\) leaves the possible first coordinates \(M\in\{-5,-4,-3,0,3\}\). Their sum is \(-5-4-3+0+3=-9\), which is not listed, so the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30371, number: 371, division: "Theta", topic: "Geometry", difficulty: 4, methods: [],
    question: String.raw`Find the area of the intersection of the graphs of \((x+1)^2+y^2\le2\) and \((x-1)^2+y^2\le2\).`, choices: [String.raw`\(\pi-2\)`,String.raw`\(2\pi-2\)`,String.raw`\(\pi+2\)`,String.raw`\(2\pi\)`,"NOTA"], answer: "A",
    solution: String.raw`The two disks have radius \(\sqrt2\), centers \((-1,0)\) and \((1,0)\), and intersection points \((0,\pm1)\). At each center, the radii to those points are perpendicular, so half of the lens is a \(90^\circ\) sector minus a right triangle. One sector has area \(\frac14\pi(\sqrt2)^2=\frac\pi2\), while the triangle has area \(\frac12(\sqrt2)(\sqrt2)=1\). Doubling gives \(2(\frac\pi2-1)=\boxed{\pi-2}\).` },
  { id: 30372, number: 372, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Law of Cosines"],
    question: String.raw`Triangle \(ZLU\) is isosceles with \(ZL=ZU\) and \(LU=\sqrt3-1\). If the degree measure of angle \(LZU\) is 30, compute the value of \((ZL)^6\).`, choices: [String.raw`\(\frac1{64}\)`,String.raw`\(\frac18\)`,"8",String.raw`\(\frac1{512}\)`,"NOTA"], answer: "C",
    solution: String.raw`Let \(ZL=ZU=s\). Applying the Law of Cosines to the \(30^\circ\) vertex angle gives \((\sqrt3-1)^2=s^2+s^2-2s^2\cos30^\circ=s^2(2-\sqrt3)\). Since \((\sqrt3-1)^2=4-2\sqrt3=2(2-\sqrt3)\), we get \(s^2=2\). Therefore \(s^6=(s^2)^3=\boxed8\).` },
  { id: 30373, number: 373, division: "Theta", topic: "Number Theory", difficulty: 4, methods: [],
    question: String.raw`What is the \(2025^{\text{th}}\) smallest positive integer that gains an extra digit in length when doubled?`, choices: ["6469","6470","6471","6472","NOTA"], answer: "A",
    solution: String.raw`Among the \(d\)-digit positive integers, exactly those from \(5\cdot10^{d-1}\) through \(10^d-1\) gain a digit when doubled, giving \(5\cdot10^{d-1}\) such integers. There are \(5+50+500=555\) with at most three digits. The desired number is therefore the \((2025-555)=1470\)th qualifying four-digit integer, starting at 5000: \(5000+1469=\boxed{6469}\).` },
  { id: 30374, number: 374, division: "Theta", topic: "Geometry", difficulty: 5, methods: ["Angle Chasing"],
    question: String.raw`In pentagon \(JWIGS\), angles \(I\) and \(S\) are both right angles and the degree measure of angle \(G\) is 120. If \(JS=WI=18\), \(JW=12\), and \(GS=IG\), what is \(GS\)?`, choices: [String.raw`\(\frac{15}{2}\)`,String.raw`\(5\sqrt3\)`,String.raw`\(\frac{15\sqrt3}{2}\)`,String.raw`\(10\sqrt3\)`,"NOTA"], answer: "D",
    solution: String.raw`Connect \(I\) to \(S\). Triangle \(IGS\) is isosceles with vertex angle \(120^\circ\), so its base angles are \(30^\circ\). Because the pentagon angles at \(I\) and \(S\) are \(90^\circ\), the angles between \(IS\) and each of \(IW,SJ\) are \(60^\circ\). Thus \(JWIS\) is an isosceles trapezoid with legs 18 and shorter base \(JW=12\). Each leg contributes \(18\cos60^\circ=9\) horizontally, so \(IS=12+9+9=30\). In the \(30\)-\(30\)-\(120\) triangle, \(IS=GS\sqrt3\); hence \(GS=30/\sqrt3=\boxed{10\sqrt3}\).` },
  { id: 30375, number: 375, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`The interior angles of a convex polygon form an arithmetic sequence with a common difference of 4 degrees. If the largest interior angle measures 172 degrees, what is the number of sides of the polygon?`, choices: ["8","9","12","15","NOTA"], answer: "C",
    solution: String.raw`The corresponding exterior angles form an arithmetic sequence with difference 4 when written in increasing order. Since the largest interior angle is \(172^\circ\), the smallest exterior angle is \(8^\circ\), so the exterior angles are \(8,12,\ldots,8+4(n-1)\). Their sum is 360: \(\frac n2[8+8+4(n-1)]=360\), or \(n(n+3)=180\). The positive solution is \(n=\boxed{12}\).` },
  { id: 30376, number: 376, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms"],
    question: String.raw`Solve for \(k\): \(\ln(k-2)-1=\ln(k+2)\).`, choices: [String.raw`\(\frac{2+2e}{1-e}\)`,String.raw`\(\frac{2+2e}{1+2e}\)`,String.raw`\(\frac{2-e}{1+e}\)`,String.raw`\(\frac{2-e}{1-2e}\)`,"NOTA"], answer: "E",
    solution: String.raw`The logarithms require \(k-2>0\), so \(k>2\). Since \(1=\ln e\), the equation becomes \(\ln\!\left(\frac{k-2}{e}\right)=\ln(k+2)\), hence \(\frac{k-2}{e}=k+2\). Solving gives \(k=\frac{2+2e}{1-e}\), which is negative and violates \(k>2\). Therefore there is no real solution and the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30377, number: 377, division: "Theta", topic: "Combinatorics", difficulty: 2, methods: [],
    question: String.raw`Snow-Pooh, Zoo-Lu, and Wiggie-Mu are having a mental math competition. In how many different ways can the three finish if it is possible for two or more participants to finish in a tie?`, choices: ["10","11","12","13","NOTA"], answer: "D",
    solution: String.raw`There are \(3!=6\) finishes with no tie. If exactly two participants tie, choose the tied pair in \(\binom32=3\) ways and choose whether that pair finishes ahead of or behind the remaining participant in 2 ways, giving 6 more. There is also 1 three-way tie. The total is \(6+6+1=\boxed{13}\).` },
  { id: 30378, number: 378, division: "Theta", topic: "Algebra", difficulty: 2, methods: ["Absolute Value"],
    question: String.raw`Given \((x^2-10x+25)^{-1/2}=8\), the smallest solution can be written as \(\frac L8\). Compute \(L\).`, choices: ["7","39","41","53","NOTA"], answer: "B",
    solution: String.raw`Since \(x^2-10x+25=(x-5)^2\), the left side is \(1/\sqrt{(x-5)^2}=1/|x-5|\). Thus \(1/|x-5|=8\), so \(|x-5|=1/8\) and \(x=5\pm1/8\). The smaller solution is \(39/8\), giving \(L=\boxed{39}\).` },
  { id: 30379, number: 379, division: "Theta", topic: "Combinatorics", difficulty: 2, methods: ["Inclusion-Exclusion"],
    question: String.raw`At a chess competition each of 15 schools sent one senior and one junior. Each senior played a match with everyone except with their junior teammate, and no matches took place between juniors. How many matches were there among these 30 attendees?`, choices: ["210","225","315","330","NOTA"], answer: "C",
    solution: String.raw`There are \(\binom{30}{2}=435\) possible pairs of attendees. Remove the 15 senior-junior teammate pairs and the \(\binom{15}{2}=105\) junior-junior pairs, since neither type plays. This leaves \(435-15-105=\boxed{315}\) matches.` },
  { id: 30380, number: 380, division: "Theta", topic: "Optimization", difficulty: 4, methods: [],
    question: String.raw`What is the maximum possible value of \(x\) in an ordered pair that satisfies the following system of inequalities?\[\begin{cases}-10\le x+y\le4\\x^2+y^2-36(x+y)\le2xy\end{cases}\]`, choices: ["4","8","21","35","NOTA"], answer: "B",
    solution: String.raw`Let \(s=x+y\) and \(d=x-y\). The second inequality becomes \(d^2\le36s\), so \(s\ge0\), while the first gives \(0\le s\le4\). Also \(x=(s+d)/2\), and for fixed \(s\) this is largest when \(d=6\sqrt s\). Hence \(x\le\frac{s+6\sqrt s}{2}\), an increasing expression on \([0,4]\). At \(s=4,d=12\), \(x=8\) and \(y=-4\), so the maximum is \(\boxed8\).` },
  { id: 30381, number: 381, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    question: String.raw`The area bounded by the \(x\)-axis, the line \(y=kx\), \(x=1\), and \(x=4\) has an area of 30. What is the largest possible value for \(k\)?`, choices: ["3.75","4","5","7.5","NOTA"], answer: "B",
    solution: String.raw`Between \(x=1\) and \(x=4\), the area between \(y=kx\) and the \(x\)-axis is \(\int_1^4|kx|\,dx=|k|\left[\frac{x^2}{2}\right]_1^4=\frac{15}{2}|k|\). Setting this equal to 30 gives \(|k|=4\), so the largest possible value is \(\boxed4\).` },
  { id: 30382, number: 382, division: "Theta", topic: "Geometry", difficulty: 2, methods: ["Pythagorean Theorem"],
    question: String.raw`In triangle \(ROB\), \(RB=42\), \(OB=40\), and \(RO=58\). What is the radius of the inscribed circle?`, choices: ["12","15","24","30","NOTA"], answer: "A",
    solution: String.raw`Because \(40^2+42^2=58^2\), the triangle is right with legs 40 and 42 and hypotenuse 58. The inradius of a right triangle is \(r=\frac{a+b-c}{2}\), so \(r=\frac{40+42-58}{2}=\boxed{12}\).` },
  { id: 30383, number: 383, division: "Theta", topic: "Functions", difficulty: 2, methods: ["Completing the Square"],
    question: String.raw`What is the sum of the integral values that are in the range of the following function? Let \(f(x)=1-2\sqrt{8+2x-x^2}\).`, choices: ["-14","2","12",String.raw`\(-\infty\)`,"NOTA"], answer: "A",
    solution: String.raw`Complete the square inside the radical: \(8+2x-x^2=9-(x-1)^2\). On the domain \(-2\le x\le4\), the square root takes every value from 0 to 3, so \(f(x)=1-2\sqrt{9-(x-1)^2}\) has range \([-5,1]\). Its integer values are \(-5,-4,-3,-2,-1,0,1\), whose sum is \(\boxed{-14}\).` },
  { id: 30384, number: 384, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`A circular cone with radius 10 and altitude 8 is cut by a plane parallel to its base so that the two resulting pieces have equal volume. What is the altitude of the piece which is a cone?`, choices: [String.raw`\(4\sqrt[3]2\)`,String.raw`\(4\sqrt[3]4\)`,String.raw`\(4\sqrt[3]3\)`,"4","NOTA"], answer: "B",
    solution: String.raw`The smaller cone is similar to the original cone. If its altitude is \(h\), its linear scale factor is \(h/8\), so its volume is \((h/8)^3\) times the original volume. Equal pieces mean the smaller cone has half the original volume: \((h/8)^3=1/2\). Thus \(h=8/\sqrt[3]2=4\sqrt[3]4\), so the answer is \(\boxed{4\sqrt[3]4}\).` },
  { id: 30385, number: 385, division: "Theta", topic: "Geometry", difficulty: 2, methods: ["Pythagorean Theorem"],
    question: String.raw`Triangle \(ROB\) has median \(BS\), centroid \(F\), and altitude \(BL\). If \(BL=45\) and \(SL=24\), find \(FS\).`, choices: [String.raw`\(\sqrt{161}\)`,"17","34","51","NOTA"], answer: "B",
    solution: String.raw`Since \(BL\) is an altitude to the line containing \(RO\), triangle \(BLS\) is right. Therefore \(BS=\sqrt{BL^2+SL^2}=\sqrt{45^2+24^2}=\sqrt{2601}=51\). A centroid divides each median in a \(2:1\) ratio measured from the vertex, so \(FS=BS/3=\boxed{17}\).` },
  { id: 30386, number: 386, division: "Theta", topic: "Statistics", difficulty: 3, methods: [],
    question: String.raw`You have a set of 9 distinct integers. 6 of the elements of the set are 1, 2, 3, 5, 8, and 12. Compute the sum of all possible values of the median of this set.`, choices: ["18","22","26","35","NOTA"], answer: "D",
    solution: String.raw`The median is the fifth number after sorting. It cannot be below 2 because only three new integers can be inserted below 1, and it cannot exceed 8 because the five fixed numbers \(1,2,3,5,8\) would already lie at or below 8. Every integer from 2 through 8 can occur: the existing values 2, 3, 5, and 8 can be made fifth by placing the new integers appropriately, while 4, 6, and 7 can themselves be inserted as the fifth value. Thus the possible medians are \(2,3,4,5,6,7,8\), whose sum is \(\boxed{35}\).` },
  { id: 30387, number: 387, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`J-Wigs invests his life savings of \(\$2500\) in three accounts earning 6%, 8%, and 9% simple interest. He invests twice as much in the 6% account as in the 9% account. If he wants to earn \(\$185\) in interest after one year, how much should he invest at 9%?`, choices: ["$300","$500","$600","$1000","NOTA"], answer: "B",
    solution: String.raw`Let \(x\) be the amount invested at 9%. Then \(2x\) is invested at 6%, and \(2500-3x\) is invested at 8%. The interest equation is \(0.09x+0.06(2x)+0.08(2500-3x)=185\). Simplifying gives \(200-0.03x=185\), so \(x=\boxed{\$500}\).` },
  { id: 30388, number: 388, division: "Theta", topic: "Probability", difficulty: 3, methods: ["Inclusion-Exclusion"],
    question: String.raw`You draw two cards without replacement from a standard 52 card deck, what is the probability that two black cards or two kings are drawn?`, choices: [String.raw`\(\frac{165}{676}\)`,String.raw`\(\frac{331}{1326}\)`,String.raw`\(\frac{331}{552}\)`,String.raw`\(\frac{52}{221}\)`,"NOTA"], answer: "E",
    solution: String.raw`There are \(\binom{52}{2}=1326\) unordered two-card draws. Two black cards can be drawn in \(\binom{26}{2}=325\) ways, and two kings in \(\binom42=6\) ways. The pair of black kings belongs to both counts, so inclusion-exclusion gives \(325+6-1=330\) favorable draws. The probability is \(330/1326=55/221\), which is not listed. Therefore the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30389, number: 389, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`The sum of the digits of a three-digit number is 26. The number is multiplied by 13, then by 11, and finally by 7. How many times will the digit 9 occur in the final product?`, choices: ["0","2","4","6","NOTA"], answer: "C",
    solution: String.raw`Three decimal digits sum to 26 only when the digits are 9, 9, and 8, since their maximum possible sum is 27. Also \(13\cdot11\cdot7=1001\). Multiplying a three-digit number \(N\) by 1001 gives \(1000N+N\), which writes two copies of its three digits consecutively. Each copy contains two 9s, so the final product contains \(\boxed4\) occurrences of the digit 9.` },

  // 2024 MAO National Convention, Theta Individual.
  { id: 30390, number: 390, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    question: String.raw`If a line that is not a function contains the point \((R,S)\) where \(RS\ne0\), then the line must also contain which of the following points?`, choices: [String.raw`(-R,S)`,String.raw`(-S,R)`,String.raw`(R,-S)`,String.raw`(S,-R)`,"NOTA"], answer: "C",
    solution: String.raw`A nonvertical line passes the vertical line test, so a line that is not a function of \(x\) must be vertical. Since it contains \((R,S)\), its equation is \(x=R\). Every point on it has first coordinate \(R\), including \(\boxed{(R,-S)}\). The condition \(RS\ne0\) ensures this is distinct from the given point.` },
  { id: 30391, number: 391, division: "Theta", topic: "Number Theory", difficulty: 3, methods: [],
    question: String.raw`How many ordered triplets \((p_1,p_2,p_3)\) of prime numbers exist for which the sum of the numbers is 24?`, choices: ["9","12","15","18","NOTA"], answer: "C",
    solution: String.raw`Three odd primes have an odd sum, so exactly one prime must be the only even prime, 2. The other two primes must sum to 22, giving the unordered pairs \(3+19\), \(5+17\), and \(11+11\). Each of the first two triples has three distinct entries and therefore \(3!=6\) orderings; \((2,11,11)\) has 3 orderings. The total is \(6+6+3=\boxed{15}\).` },
  { id: 30392, number: 392, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant", "Matrix Multiplication"],
    question: String.raw`Find the determinant of matrix \(L\) if \(L=\begin{bmatrix}1&0&3\\2&4&-1\\1&4&2\end{bmatrix}\begin{bmatrix}1&1&6\\4&2&3\\5&3&2\end{bmatrix}\).`, choices: ["38","140","336","521","NOTA"], answer: "C",
    solution: String.raw`For square matrices, \(\det(AB)=\det(A)\det(B)\), so the product matrix need not be multiplied out. Expanding the first determinant gives \(\det(A)=24\), and expanding the second gives \(\det(B)=14\). Therefore \(\det(L)=24\cdot14=\boxed{336}\).` },
  { id: 30393, number: 393, division: "Theta", topic: "Complex Numbers", difficulty: 4, methods: ["Conjugates", "Rationalization"],
    question: String.raw`\(\frac{A+B\sqrt5+(C-4\sqrt5)i}{-29}=\frac2{1+i+\sqrt5}\) for integers \(A,B,\) and \(C\). Compute \(A+B+C\).`, choices: ["-18","-12","10","30","NOTA"], answer: "C",
    solution: String.raw`Rationalize the right side in two stages. First multiply by \(1+\sqrt5-i\), then by \(7-2\sqrt5\): \[\frac2{1+\sqrt5+i}=\frac{2(1+\sqrt5-i)}{7+2\sqrt5}=\frac{2(1+\sqrt5-i)(7-2\sqrt5)}{29}.\] Expanding the numerator gives \(\frac{-6+10\sqrt5+(-14+4\sqrt5)i}{29}\). Because the left denominator is \(-29\), its numerator is the negative of this: \(6-10\sqrt5+(14-4\sqrt5)i\). Thus \(A=6,B=-10,C=14\), and \(A+B+C=\boxed{10}\).` },
  { id: 30394, number: 394, division: "Theta", topic: "Geometric Series", difficulty: 2, methods: ["Infinite Geometric Series"],
    question: String.raw`Sansa dropped his bouncy ball from a height of 6 yards. The bouncy ball always bounces up at a constant ratio compared to the maximum height in the previous bounce. The ball bounced back to a height of 4 yards on its first bounce. The ball continues to bounce until it eventually comes to a rest. What is the total distance the ball traveled in feet?`, choices: ["18","30","54","90","NOTA"], answer: "D",
    solution: String.raw`The rebound ratio is \(4/6=2/3\). The ball first falls 6 yards. It then travels both upward and downward through every rebound height, whose sum is \(4+4(2/3)+4(2/3)^2+\cdots=\frac4{1-2/3}=12\) yards. Hence the total distance is \(6+2(12)=30\) yards. Converting units gives \(30\cdot3=\boxed{90}\) feet.` },
  { id: 30395, number: 395, division: "Theta", topic: "Polynomials", difficulty: 3, methods: ["Rational Root Theorem", "Synthetic Division"],
    question: String.raw`If the zeroes of \(J(x)=x^4-13x^3+47x^2-23x-84\) are \(S,N,O,W\) with \(S>N>O>W\), compute \(S+N+W\).`, choices: ["9","10","11","13","NOTA"], answer: "B",
    solution: String.raw`The Rational Root Theorem suggests testing integer divisors of 84. Synthetic division shows \(J(x)=(x-7)(x-4)(x-3)(x+1)\), so the ordered roots are \(S=7,N=4,O=3,W=-1\). Therefore \(S+N+W=7+4-1=\boxed{10}\).` },
  { id: 30396, number: 396, division: "Theta", topic: "Systems of Equations", difficulty: 3, methods: [],
    question: String.raw`Given that \(B\ne\frac{220}{3}\), what value for \(B\), in terms of \(A\), will make the following system of equations have no solution? \[\begin{cases}Ax+20y=3\\24x+By=11\end{cases}\]`, choices: [String.raw`\(\frac{220A}{3}\)`,String.raw`\(\frac{A}{480}\)`,String.raw`\(\frac{20A}{24}\)`,String.raw`\(\frac{480}{A}\)`,"NOTA"], answer: "D",
    solution: String.raw`A two-equation linear system has no solution when the left sides are proportional but the constants are not. Parallel coefficient rows require \(\frac A{24}=\frac{20}{B}\), so \(AB=480\) and \(B=\frac{480}{A}\). If the constants were also proportional, then \(A/24=3/11\), which would force \(B=220/3\); the stated restriction excludes that coincident-line case. Thus \(\boxed{B=480/A}\).` },
  { id: 30397, number: 397, division: "Theta", topic: "Sequences", difficulty: 2, methods: ["Geometric Sequence"],
    question: String.raw`According to Newton's law of cooling, when the difference in the temperature of an object and its surroundings is measured at equal time intervals, the temperature differences form a geometric sequence. If the temperature of Allison's coffee was 26 degrees at 11:00 p.m. and 22 degrees at 11:10 p.m., what was its temperature at 10:40 p.m.? Assume that the air temperature remained constant at 20 degrees.`, choices: ["38","50","54","74","NOTA"], answer: "D",
    solution: String.raw`Subtract the \(20^\circ\) room temperature. The coffee's excess temperature fell from 6 degrees at 11:00 to 2 degrees at 11:10, so the common ratio for each 10-minute interval is \(1/3\). Going backward from 11:00 to 10:40 covers two intervals, so the excess temperature was \(6(3)^2=54\) degrees. Adding the room temperature gives \(54+20=\boxed{74}\) degrees.` },
  { id: 30398, number: 398, division: "Theta", topic: "Inverse Functions", difficulty: 2, methods: ["Inverse Functions"],
    question: String.raw`The following table gives some values of \(g(x)\) and \(g^{-1}(x)\). Compute \(A+B\). \[\begin{array}{c|ccccccc}x&0&1&2&3&4&5&?\\\hline g(x)&5&3&?&A&?&4&8\\g^{-1}(x)&2&4&3&B&?&?&8\end{array}\]`, choices: ["3","4","5","6","NOTA"], answer: "A",
    solution: String.raw`Inverse-function entries reverse ordered pairs. Since \(g^{-1}(2)=3\), we have \(g(3)=2\), so \(A=2\). Since \(g(1)=3\), reversing that pair gives \(g^{-1}(3)=1\), so \(B=1\). Therefore \(A+B=2+1=\boxed3\).` },
  { id: 30399, number: 399, division: "Theta", topic: "Systems of Equations", difficulty: 2, methods: [],
    question: String.raw`Arya invests \(\$25{,}000\) in three accounts earning 6%, 8%, and 9% simple interest. She invests twice as much in the 6% account as in the 9% account. If she wants to earn \(\$1850\) in interest after one year how much should she invest at 9%?`, choices: ["$3000","$5000","$6000","$10000","NOTA"], answer: "B",
    solution: String.raw`Let \(x\) be the amount invested at 9%. Then \(2x\) is invested at 6% and \(25{,}000-3x\) at 8%. The interest equation is \(0.09x+0.06(2x)+0.08(25{,}000-3x)=1850\). Simplifying gives \(2000-0.03x=1850\), so \(x=\boxed{\$5000}\).` },
  { id: 30400, number: 400, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`Trapezoid \(BRAN\) is circumscribed around a circle. Points \(S\) and \(T\) are midpoints of legs \(\overline{BN}\) and \(\overline{RA}\) respectively. If \(\overline{ST}=10\), what is the perimeter of \(BRAN\)?`, choices: ["30","38","40","48","NOTA"], answer: "C",
    solution: String.raw`Segment \(ST\) is the trapezoid's midsegment, so it equals the average of the two bases. Thus the bases have sum \(2(10)=20\). In any tangential quadrilateral, the sums of opposite sides are equal; therefore the two legs also have sum 20. The perimeter is the base sum plus the leg sum, \(20+20=\boxed{40}\).` },
  { id: 30401, number: 401, division: "Theta", topic: "Geometry", difficulty: 4, methods: ["Angle Chasing"],
    question: String.raw`In triangle \(ABC\), \(AC=BC\). If \(\overline{AC}\) is extended its own length through \(C\) to \(D\) and \(\overline{DB}\) is drawn, find the sum of the degree measures of angles \(A\) and \(D\).`, choices: ["60","90","120","150","NOTA"], answer: "B",
    solution: String.raw`Let \(\angle A=\angle B=x\), since \(AC=BC\). Then \(\angle ACB=180^\circ-2x\). Because \(CD\) extends \(CA\), \(\angle BCD=180^\circ-\angle ACB=2x\). Also \(BC=AC=CD\), so triangle \(BCD\) is isosceles and its base angles at \(B\) and \(D\) are each \((180^\circ-2x)/2=90^\circ-x\). Hence \(\angle A+\angle D=x+(90^\circ-x)=\boxed{90^\circ}\).` },
  { id: 30402, number: 402, division: "Theta", topic: "Algebra", difficulty: 3, methods: [],
    question: String.raw`How many real solutions exist for the equation \(\sqrt{2x+9}+\sqrt{x+1}=\sqrt{x+4}\)?`, choices: ["0","1","2","3","NOTA"], answer: "A",
    solution: String.raw`The radicals require \(x\ge-1\). Move \(\sqrt{x+1}\) to the right and square: \(2x+9=(\sqrt{x+4}-\sqrt{x+1})^2=2x+5-2\sqrt{(x+4)(x+1)}\). This would require \(2\sqrt{(x+4)(x+1)}=-4\), impossible because a square root is nonnegative. Therefore there are \(\boxed0\) real solutions.` },
  { id: 30403, number: 403, division: "Theta", topic: "Number Theory", difficulty: 3, methods: ["Pythagorean Theorem"],
    question: String.raw`A circle centered at the origin has radius 25. How many lattice points lie on the circle?`, choices: ["8","12","16","20","NOTA"], answer: "D",
    solution: String.raw`Integer points satisfy \(x^2+y^2=625\). The nonnegative absolute-value pairs are \((25,0)\), \((24,7)\), and \((20,15)\), together with their coordinate reversals where distinct. The axis pair contributes 4 points. Each of \((24,7)\) and \((20,15)\) contributes 8 points from sign choices and swapping coordinates. Thus the total is \(4+8+8=\boxed{20}\).` },
  { id: 30404, number: 404, division: "Theta", topic: "Combinatorics", difficulty: 3, methods: ["Inclusion-Exclusion"],
    question: String.raw`The Heritage math team has 100 members with the following data. 45 are on the science team, 34 are on the debate team, and 15 play sports. 20 are on the science and debate team only, 7 are on the science team and play sports only. 6 are on the debate team and play sports only. 1 person did all 3. How many members did not do any of the 3?`, choices: ["12","19","38","42","NOTA"], answer: "E",
    solution: String.raw`Because the pairwise counts are stated as "only," first find the single-group regions: science only is \(45-20-7-1=17\), debate only is \(34-20-6-1=7\), and sports only is \(15-7-6-1=1\). The union contains \(17+7+1+20+7+6+1=59\) members. Therefore \(100-59=41\) members did none, which is not listed, so the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30405, number: 405, division: "Theta", topic: "Geometry", difficulty: 2, methods: ["Triangle Inequality"],
    question: String.raw`The side lengths of a triangle are 15, 47, and \(\frac W2\). How many integer values of \(W\) are possible?`, choices: ["29","30","59","69","NOTA"], answer: "C",
    solution: String.raw`The third side must lie strictly between the difference and sum of the other two sides: \(47-15<\frac W2<47+15\). Thus \(32<W/2<62\), or \(64<W<124\). The integer values are \(65,66,\ldots,123\), a total of \(123-65+1=\boxed{59}\).` },
  { id: 30406, number: 406, division: "Theta", topic: "Geometry", difficulty: 5, methods: [],
    question: String.raw`From point \(A\) outside of circle \(R\), two secants, \(\overline{AS}\) intersecting the circle at \(T\) and \(\overline{AK}\) going through the center (point \(R\)). The degree measure of angle \(SRT\) is 74 and the degree measure of angle \(SAK\) is 28. What is the degree measure of minor arc \(SK\)?`, choices: ["56","68","74","81","NOTA"], answer: "D",
    solution: String.raw`Let \(P\) be the nearer intersection of secant \(AK\) with the circle. Since \(PK\) is a diameter and central angle \(SRT=74^\circ\), the arcs \(PT\) and \(SK\) together measure \(180^\circ-74^\circ=106^\circ\). Write their measures as \(a\) and \(b\). The external-secant theorem gives \(28^\circ=\frac12(b-a)\), so \(b-a=56\). Solving with \(a+b=106\) yields \(b=\boxed{81^\circ}\).` },
  { id: 30407, number: 407, division: "Theta", topic: "Volumes of Revolution", difficulty: 2, methods: [],
    question: String.raw`A rectangle with vertices \((8,4)\), \((2,4)\), \((8,1)\), and \((2,1)\) is revolved about the \(x\)-axis, creating a hollowed-out cylinder. What is the volume of this resulting solid?`, choices: [String.raw`\(54\pi\)`,String.raw`\(90\pi\)`,String.raw`\(96\pi\)`,String.raw`\(180\pi\)`,"NOTA"], answer: "B",
    solution: String.raw`The rectangle extends 6 units in the \(x\)-direction. Rotating it creates washers with outer radius 4 and inner radius 1. The cross-sectional area is \(\pi(4^2-1^2)=15\pi\), so the volume is \(6(15\pi)=\boxed{90\pi}\).` },
  { id: 30408, number: 408, division: "Theta", topic: "Inequalities", difficulty: 2, methods: ["Completing the Square"],
    question: String.raw`How many integral values of \(x\) does the expression \(x^2+2x-19\) have a negative value?`, choices: ["8","9","16","17","NOTA"], answer: "B",
    solution: String.raw`Complete the square: \(x^2+2x-19=(x+1)^2-20\). It is negative exactly when \((x+1)^2<20\), or \(-\sqrt{20}<x+1<\sqrt{20}\). The integer solutions are \(x=-5,-4,\ldots,3\), which is \(3-(-5)+1=\boxed9\) values.` },
  { id: 30409, number: 409, division: "Theta", topic: "Simplification", difficulty: 4, methods: [],
    question: String.raw`Simplify: \(\frac1{\sqrt[3]{A^2}-\sqrt[3]{AB^2}+\sqrt[3]{B^4}}\).`, choices: [String.raw`\(\frac{\sqrt[3]A+\sqrt[3]B}{A-B}\)`,String.raw`\(\frac{\sqrt[3]A-\sqrt[3]B}{A+B}\)`,String.raw`\(\frac{\sqrt[3]A+\sqrt[3]{B^2}}{A+B^2}\)`,String.raw`\(\frac{\sqrt[3]A+\sqrt[3]{B^2}}{A-B^2}\)`,"NOTA"], answer: "C",
    solution: String.raw`Let \(u=\sqrt[3]A\) and \(v=\sqrt[3]{B^2}\). The denominator becomes \(u^2-uv+v^2\). Using \((u^2-uv+v^2)(u+v)=u^3+v^3\), multiply numerator and denominator by \(u+v\). Since \(u^3=A\) and \(v^3=B^2\), the result is \(\boxed{\frac{\sqrt[3]A+\sqrt[3]{B^2}}{A+B^2}}\).` },
  { id: 30410, number: 410, division: "Theta", topic: "Geometry", difficulty: 4, methods: [],
    question: String.raw`Trapezoid \(STAR\) has base \(ST=20\) and base \(AR=30\). Diagonals intersect at point \(K\). If the area of the trapezoid is 300, what is the area of triangle \(KAT\)?`, choices: ["72","78","84","96","NOTA"], answer: "A",
    solution: String.raw`The trapezoid height is \(h=\frac{2(300)}{20+30}=12\). Triangle \(RAT\) has base \(RA=30\) and the same height, so its area is \(\frac12(30)(12)=180\). The diagonals of a trapezoid divide each other in the ratio of the bases, so on diagonal \(RT\), \(RK:KT=30:20=3:2\). Triangles \(RKA\) and \(KTA\) share the altitude from \(A\) to \(RT\), so \([KTA]/[RTA]=KT/RT=2/5\). Hence \([KTA]=(2/5)(180)=\boxed{72}\).` },
  { id: 30411, number: 411, division: "Theta", topic: "Algebra", difficulty: 2, methods: [],
    question: String.raw`The width of a right rectangular prism decreased by seventy-five percent and the length increased by thirty-three and one-third percent. If the volume remained unchanged, by what percent did the height increase?`, choices: ["0","50","100","300","NOTA"], answer: "E",
    solution: String.raw`The new width is \(1/4\) of the original, while the new length is \(4/3\) of the original. Their product is therefore multiplied by \((1/4)(4/3)=1/3\). To keep volume unchanged, the height must be multiplied by 3. Going from the original height to three times that height is a \(200\%\) increase, which is not listed, so the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30412, number: 412, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`How many ordered pairs \((A,B)\), where \(A\) and \(B\) are whole numbers, satisfy \(2A+3B=72\)?`, choices: ["11","12","13","14","NOTA"], answer: "C",
    solution: String.raw`Whole numbers include 0. Since \(2A=72-3B\) must be even, \(B\) must be even. Also \(0\le B\le24\). Thus \(B\) can be \(0,2,4,\ldots,24\), giving \(24/2+1=\boxed{13}\) choices, and each determines one nonnegative integer \(A\).` },
  { id: 30413, number: 413, division: "Theta", topic: "Logs and Exponents", difficulty: 4, methods: ["Change of Base"],
    question: String.raw`For \(k\in\mathbb R\), find the product of the solutions to \(\log_4k+\log_{k^2}\frac18=1\).`, choices: [String.raw`\(-\frac14\)`,String.raw`\(\frac14\)`,String.raw`\(\frac34\)`,"4","NOTA"], answer: "D",
    solution: String.raw`The logarithms require \(k>0\) and \(k\ne1\). Let \(t=\log_2k\), so \(t\ne0\). Then \(\log_4k=t/2\) and \(\log_{k^2}(1/8)=-3/(2t)\). The equation becomes \(t/2-3/(2t)=1\), or \(t^2-2t-3=0\). Thus \(t=3\) or \(t=-1\), giving \(k=8\) or \(k=1/2\). Their product is \(\boxed4\).` },
  { id: 30414, number: 414, division: "Theta", topic: "Inequalities", difficulty: 4, methods: [],
    question: String.raw`Solve for \(k\): \(\frac{k+3}{k-1}<\frac{k+5}{k+2}\).`, choices: [String.raw`k<-11`,String.raw`k>-11`,String.raw`k<11`,String.raw`k>11`,"NOTA"], answer: "E",
    solution: String.raw`Move the right side to the left and combine fractions: \[\frac{k+3}{k-1}-\frac{k+5}{k+2}=\frac{(k+3)(k+2)-(k+5)(k-1)}{(k-1)(k+2)}=\frac{k+11}{(k-1)(k+2)}.\] A sign chart at \(-11,-2,1\) gives the solution \(( -\infty,-11)\cup(-2,1)\). None of the listed one-sided inequalities matches this set, so the answer is \(\boxed{\text{NOTA}}\).` },
  { id: 30415, number: 415, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Rational Root Theorem"],
    question: String.raw`If \(j\) and \(k\) are integers, which of the following could not be a root of the function \(f(x)=3x^3+jx^2+kx-10\)?`, choices: ["-10","-5",String.raw`\(\frac53\)`,"6","NOTA"], answer: "D",
    solution: String.raw`By the Rational Root Theorem, a rational root in lowest terms must have numerator dividing 10 and denominator dividing 3. The values \(-10\), \(-5\), and \(5/3\) meet that necessary condition and can be realized by suitable integer choices of \(j,k\). The integer 6 cannot be a root because its numerator does not divide 10. Thus the impossible choice is \(\boxed6\).` },
  { id: 30416, number: 416, division: "Theta", topic: "Algebra", difficulty: 2, methods: ["Absolute Value"],
    question: String.raw`How many real solutions does the equation \(|k|^2-\sqrt{k^2}-6=0\) have?`, choices: ["0","1","2","4","NOTA"], answer: "C",
    solution: String.raw`Because \(\sqrt{k^2}=|k|\), let \(u=|k|\ge0\). The equation becomes \(u^2-u-6=0\), which factors as \((u-3)(u+2)=0\). Only \(u=3\) is nonnegative, so \(|k|=3\) and \(k=\pm3\). Therefore there are \(\boxed2\) real solutions.` },
  { id: 30417, number: 417, division: "Theta", topic: "Geometry", difficulty: 3, methods: [],
    question: String.raw`The height of a regular square pyramid is 4 units and the length of the side of its base is 6. Find the volume of the smaller pyramid that results from cutting the original pyramid by a plane parallel to the base and passing one unit above the base.`, choices: [String.raw`\(\frac{81}{4}\)`,"27","36",String.raw`\(\frac{243}{4}\)`,"NOTA"], answer: "A",
    solution: String.raw`The original pyramid has volume \(\frac13(6^2)(4)=48\). The cutting plane is one unit above the base, so the smaller top pyramid has height 3 and is similar to the original with linear scale factor \(3/4\). Volumes scale by the cube of the linear factor, so its volume is \(48(3/4)^3=48\cdot27/64=\boxed{\frac{81}{4}}\).` },
  { id: 30418, number: 418, division: "Theta", topic: "Number Theory", difficulty: 2, methods: [],
    question: String.raw`January 1, 2024 was a Monday. What is the next year in which January 1 will fall on a Monday?`, choices: ["2028","2029","2030","2031","NOTA"], answer: "B",
    solution: String.raw`A normal year shifts the next January 1 forward one weekday, while a leap year shifts it forward two. Since 2024 is a leap year, January 1 is Wednesday in 2025, then Thursday in 2026, Friday in 2027, and Saturday in 2028. The leap year 2028 then shifts January 1 forward two days, making January 1, \(\boxed{2029}\), a Monday.` },
  { id: 30419, number: 419, division: "Theta", topic: "Rate of Change", difficulty: 3, methods: [],
    question: String.raw`Brandon and Eddard are going running. Brandon starts running 16 minutes before Eddard. Brandon runs at a rate of 9 minutes per mile and Eddard runs at a rate of 8.25 minutes per mile. If they both start at the same location and run the same route how many minutes will Eddard take to catch up to Brandon?`, choices: ["156","162","176","192","NOTA"], answer: "C",
    solution: String.raw`Brandon's 16-minute head start is \(16/9\) mile. Their speeds are \(1/9\) and \(1/8.25=4/33\) mile per minute, so Eddard gains at \(4/33-1/9=1/99\) mile per minute. The catch-up time after Eddard starts is \((16/9)/(1/99)=(16/9)(99)=\boxed{176}\) minutes.` },
  {
    id: 30420, number: 420, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":1},
    question: String.raw`What is the \(y\)-intercept of the graph of \(f(x)=9-(x+1)^2\)?`,
    choices: [String.raw`9`, String.raw`8`, String.raw`6`, String.raw`-9`, String.raw`NOTA`], answer: "B",
    solution: String.raw`The \(y\)-intercept occurs when \(x=0\). \(f(0)=9-(1)^2=\boxed8\).`,
  },
  {
    id: 30421, number: 421, division: "Theta", topic: "Functions", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":2},
    question: String.raw`Let \(f(x)=\frac32x-\frac12\). For what value of \(x\) is \(f(-x)=2\)?`,
    choices: [String.raw`\(x=-\frac53\)`, String.raw`\(x=-\frac35\)`, String.raw`\(x=\frac53\)`, String.raw`\(x=\frac32\)`, String.raw`NOTA`], answer: "A",
    solution: String.raw`\(f(-x)=-\frac32x-\frac12=2\) so \(-\frac32x=\frac52\). Therefore, \(x=\frac52\cdot-\frac23=\boxed{-\frac53}\).`,
  },
  {
    id: 30422, number: 422, division: "Theta", topic: "Inequalities", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":3},
    question: String.raw`What is the smallest value of \(x\) that is a solution to \(-4\le1-2x\le8\)?`,
    choices: [String.raw`\(-\frac52\)`, String.raw`\(\frac72\)`, String.raw`\(\frac52\)`, String.raw`\(-\frac25\)`, String.raw`NOTA`], answer: "E",
    solution: String.raw`Subtract \(1\) to get \(-5\le-2x\le7\). Divide by \(-2\), making sure to change the direction of the inequalities: \(-\frac72\le x\le\frac52\). From this, the smallest value of \(x\) is \(x=-\frac72\), which is not listed, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30423, number: 423, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":4},
    question: String.raw`If \(2\sqrt{12}+3\sqrt{27}=\sqrt n\) for some positive integer \(n\), what is the value of \(n\)?`,
    choices: [String.raw`30`, String.raw`195`, String.raw`300`, String.raw`507`, String.raw`NOTA`], answer: "D",
    solution: String.raw`Simplify the radicals so that \(2(2\sqrt3)+3(3\sqrt3)=13\sqrt3=\sqrt n\). Therefore, \(n=13^2\cdot3=\boxed{507}\).`,
  },
  {
    id: 30424, number: 424, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":5},
    question: String.raw`For real numbers \(a\) and \(b\), the power function \(f(x)=ax^b\) satisfies \(f(-1)=2\) and \(f(2)=-16\). Find \(f(-3)\).`,
    choices: [String.raw`18`, String.raw`-27`, String.raw`-54`, String.raw`54`, String.raw`NOTA`], answer: "D",
    solution: String.raw`It is given that \(a(-1)^b=2\) and \(a(2)^b=-16\). Since \(2^b>0\), the second equation implies \(a<0\). For a real power of \(-1\) to be defined over the reals, its value has magnitude \(1\). The first equation therefore gives \(|a|=2\), so \(a=-2\). Then \(-2(2)^b=-16\), giving \(2^b=8\) and \(b=3\). Therefore, \(f(x)=-2x^3\) and \(f(-3)=-2(-3)^3=\boxed{54}\).`,
  },
  {
    id: 30425, number: 425, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":6},
    question: String.raw`For what value of \(k\) does the equation \(3-|2x-1|=x+k\) have only one real solution?`,
    choices: [String.raw`\(k=\frac12\)`, String.raw`\(k=\frac32\)`, String.raw`\(k=\frac52\)`, String.raw`\(k=\frac72\)`, String.raw`NOTA`], answer: "C",
    solution: String.raw`To have only one real solution, the line \(y=x+k\) must intersect the vertex \((\frac12,3)\) of the absolute value graph. Thus, \(3=\frac12+k\) showing \(k=\boxed{\frac52}\).

To check uniqueness, for \(x\le\frac12\) the equation is \(2+2x=x+k\), so \(x=k-2\), valid exactly when \(k\le\frac52\). For \(x\ge\frac12\) it is \(4-2x=x+k\), so \(x=(4-k)/3\), also valid exactly when \(k\le\frac52\). If \(k<\frac52\) these are two distinct solutions; if \(k>\frac52\) there are none. At \(k=\frac52\), both formulas give the single vertex \(x=\frac12\).`,
  },
  {
    id: 30426, number: 426, division: "Theta", topic: "Functions", difficulty: 2, methods: ["Inverse Functions"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":7},
    question: String.raw`Let \(f(x)=\frac{x+2}{x-2}\) and \(g(x)=f^{-1}(x)\). Find the value of \((f\cdot f^{-1})(4)\). NOTE: This is the multiplication and not the composition of the two functions.`,
    choices: [String.raw`10`, String.raw`6`, String.raw`4`, String.raw`2`, String.raw`NOTA`], answer: "A",
    solution: String.raw`\(f(4)=\frac{4+2}{4-2}=3\). To find \(f^{-1}(4)\), solve \(\frac{x+2}{x-2}=4\) to get \(x=\frac{10}{3}\). Thus, \((f\cdot f^{-1})(4)=3\cdot\frac{10}{3}=\boxed{10}\).`,
  },
  {
    id: 30427, number: 427, division: "Theta", topic: "Polynomials", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":8},
    question: String.raw`If the functions \(f(x)=2x^2+7x-4\) and \(g(x)=4x^2+bx+4\) share a root, what is the sum of all possible values \(b\)?`,
    choices: [String.raw`17`, String.raw`7`, String.raw`-10`, String.raw`-17`, String.raw`NOTA`], answer: "B",
    solution: String.raw`Factor \(f(x)=2x^2+7x-4=(2x-1)(x+4)\) to find roots \(x=\frac12\), \(x=-4\). Thus,
\[g\left(\frac12\right)=4\left(\frac12\right)^2+b\left(\frac12\right)+4=0\]
for which \(b=-10\), or \(g(-4)=4(-4)^2-4b+4=0\) when \(b=17\). The sum is \(-10+17=\boxed7\).`,
  },
  {
    id: 30428, number: 428, division: "Theta", topic: "Analytic Geometry", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":9},
    question: String.raw`Lines \(p\) and \(q\) have equations \(2x+3y=4\) and \(ax+by=6\), respectively, where \(a\) and \(b\) are real numbers. If \(p\) and \(q\) are perpendicular and intersect at \((2,0)\), what is the value of \(a+b\)?`,
    choices: [String.raw`5`, String.raw`1`, String.raw`-1`, String.raw`-3`, String.raw`NOTA`], answer: "B",
    solution: String.raw`Since line \(q\) passes through \((2,0)\), then \(2a+0b=6\) showing \(a=3\). Write line \(p\) as \(y=-\frac23x+\frac43\) to find its slope to be \(-\frac23\). The slope of \(q\) is the opposite reciprocal, \(\frac32=-\frac ab=-\frac3b\). Thus, \(b=-2\). Therefore, \(a+b=3-2=\boxed1\).`,
  },
  {
    id: 30429, number: 429, division: "Theta", topic: "Logs and Exponents", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":10},
    question: String.raw`Consider the expressions \(r=\log_4 8\), \(s=\log_8 2\) and \(t=\log_{1/2}16\). Which of the following correctly compares these three values in increasing order?`,
    choices: [String.raw`\(t<s<r\)`, String.raw`\(t<r<s\)`, String.raw`\(r<t<s\)`, String.raw`\(s<t<r\)`, String.raw`NOTA`], answer: "A",
    solution: String.raw`\(r=\frac32\) since \(4^{3/2}=8\), \(s=\frac13\) since \(8^{1/3}=2\), and \(t=-4\) since \((\frac12)^{-4}=16\). Thus, \(\boxed{t<s<r}\).`,
  },
  {
    id: 30430, number: 430, division: "Theta", topic: "Conic Sections", difficulty: 2, methods: ["Tangency"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":11},
    question: String.raw`Consider the circle given by the equation \((x+a)^2+(y-b)^2=k\), where \(a\), \(b\), and \(k\) are positive real numbers. If the circle is tangent to both axes, find \(k\) in terms of both \(a\) and \(b\); i.e., the expression for \(k\) must include both \(a\) and \(b\) in it.`,
    choices: [String.raw`\(k=a+b\)`, String.raw`\(k=a^2+b^2\)`, String.raw`\(k=\frac{a^2+b^2}{2}\)`, String.raw`\(k=2a^2+2b^2\)`, String.raw`NOTA`], answer: "C",
    solution: String.raw`Since the circle is tangent to both axes, then \(a=b\) and the radius is \(a\), so \(k=a^2\). Notice that choice C has the correct value of \(k\) since
\[\frac{a^2+b^2}{2}=\frac{a^2+a^2}{2}=\frac{2a^2}{2}=a^2.\]
Therefore, \(\boxed{k=\frac{a^2+b^2}{2}}\).`,
  },
  {
    id: 30431, number: 431, division: "Theta", topic: "Polynomial Equations", difficulty: 2, methods: ["Substitution"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":12},
    question: String.raw`What is the product of all the real solutions to \((x^2-5)^2=3(x^2-5)+4\)?`,
    choices: [String.raw`72`, String.raw`36`, String.raw`9`, String.raw`4`, String.raw`NOTA`], answer: "B",
    solution: String.raw`Let \(u=x^2-5\). Then \(u^2-3u-4=(u-4)(u+1)=0\) so \(u=4\), \(u=-1\). Now solve \(x^2-5=4\) to find \(x=\pm3\) and \(x^2-5=-1\) to find \(x=\pm2\). The product of all the real solutions is \((3)(-3)(2)(-2)=\boxed{36}\).`,
  },
  {
    id: 30432, number: 432, division: "Theta", topic: "Polynomial Equations", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":13},
    question: String.raw`The solution to \(x-2(x-1)+3(x-2)-4(x-3)=x+2x+3x+4x\) can be written in the form \(x=\frac pq\) for relatively prime positive integers \(p\) and \(q\). Find \(p+q\).`,
    choices: [String.raw`7`, String.raw`9`, String.raw`11`, String.raw`20`, String.raw`NOTA`], answer: "E",
    solution: String.raw`Simplify to write \(x-2x+2+3x-6-4x+12=10x\) or \(-2x+8=10x\). Solve to find \(x=\frac23\). Thus, \(p+q=2+3=5\), which is not listed, so the answer is \(\boxed{\text{NOTA}}\).`,
  },
  {
    id: 30433, number: 433, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":14},
    question: String.raw`Suppose \(y\) varies directly with \(x\) and \(z\) varies inversely with \(y\). It is given that \(z=-32\) when \(x=-\frac16\). Find the value of \(x\) when \(z=\frac13\).`,
    choices: [String.raw`\(x=32\)`, String.raw`\(x=16\)`, String.raw`\(x=1\)`, String.raw`\(x=-16\)`, String.raw`NOTA`], answer: "B",
    solution: String.raw`It must be that \(z\) varies inversely with \(x\), so write \(z=\frac kx\). Then \(-32=\frac{k}{-1/6}\) so \(k=\frac{16}{3}\). So \(\frac13=\frac{16/3}{x}\) when \(x=\boxed{16}\).`,
  },
  {
    id: 30434, number: 434, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":15},
    question: String.raw`A hyperbola has asymptotes \(2x+3y=3\) and \(2x-3y=9\). If \((0,-1)\) is a vertex of the hyperbola, which of the following is a focus of the hyperbola?`,
    choices: [String.raw`\((3-\sqrt5,-1)\)`, String.raw`\((3,-1+\sqrt{13})\)`, String.raw`\((3+\sqrt{13},-1)\)`, String.raw`\((3,-1-\sqrt5)\)`, String.raw`NOTA`], answer: "C",
    solution: String.raw`The asymptotes intersect at \((3,-1)\), which is the center of the horizontal hyperbola. The vertex is \(3\) units away from the center so \(a=3\). Since the slopes of the asymptotes are \(\pm\frac23\), then \(b=2\). Use \(c^2=a^2+b^2\) to find \(c=\sqrt{13}\). The foci are then \((3\pm\sqrt{13},-1)\), so the listed focus is \(\boxed{(3+\sqrt{13},-1)}\).`,
  },
  {
    id: 30435, number: 435, division: "Theta", topic: "Quadratics", difficulty: 3, methods: ["Discriminant Test"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":16},
    question: String.raw`Let \(f(x)=ax^2+bx+1\) and \(g(x)=bx^2+ax-1\), where \(a\) and \(b\) are both nonzero real numbers. How many possible pairs \((a,b)\) are there if \(f(x)\) and \(g(x)\) both have exactly one real root?`,
    choices: [String.raw`0`, String.raw`1`, String.raw`2`, String.raw`4`, String.raw`NOTA`], answer: "B",
    solution: String.raw`The discriminants \(b^2-4a=0\) and \(a^2+4b=0\). Thus, \(b^2=4a\) and \(a^2=-4b\). Square the first and substitute to get \(b^4=16a^2=16(-4b)\) so \(b^4+64b=b(b^3+64)=0\). Thus, \(b=0\), \(b=-4\). Since it is given that \(b\) is nonzero, then \(b=-4\). Then \(a^2=-4(-4)=16\) so \(a=\pm4\). The possible pairs \((a,b)\) are \((4,-4)\) and \((-4,-4)\). The first option checks since \((-4)^2-4(4)=0\) and \((4)^2+4(-4)=0\). However, the second one does not since \((-4)^2-4(-4)=32\ne0\). There is only \(\boxed1\) pair, \((4,-4)\), that works.`,
  },
  {
    id: 30436, number: 436, division: "Theta", topic: "Functions", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":17},
    question: String.raw`The domain of the function \(f(x)=\frac{\sqrt{9-x^2}}{x+2}\) can be written as \([a,b)\cup(b,c]\) for real numbers \(a<b<c\). What is the value of \(a\cdot b\cdot c\)?`,
    choices: [String.raw`-18`, String.raw`-9`, String.raw`9`, String.raw`18`, String.raw`NOTA`], answer: "D",
    solution: String.raw`To be defined, \(9-x^2\ge0\) so \(-3\le x\le3\). However, the denominator cannot be zero, so \(x\ne-2\). Thus, the domain is \([-3,-2)\cup(-2,3]\). Then \(a\cdot b\cdot c=-3\cdot-2\cdot3=\boxed{18}\).`,
  },
  {
    id: 30437, number: 437, division: "Theta", topic: "Function Analysis", difficulty: 2, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":18},
    question: String.raw`What could be the value of \(d\) so that the functions \(f(x)=4-(x+1)^2\) and \(g(x)=\frac{-4x^d+2x}{x^2+3}\) have the same end behavior?`,
    choices: [String.raw`2`, String.raw`3`, String.raw`4`, String.raw`5`, String.raw`NOTA`], answer: "C",
    solution: String.raw`For the quadratic \(f(x)\), both ends are approaching \(-\infty\) since the leading coefficient is negative. For the listed integer choices, the function \(g(x)\) has the same end behavior as \(-4x^{d-2}\), showing that \(d\) is an even integer greater than or equal to \(4\). Of the choices, \(\boxed{d=4}\).`,
  },
  {
    id: 30438, number: 438, division: "Theta", topic: "Polynomials", difficulty: 2, methods: ["Conjugates"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":19},
    question: String.raw`Let \(i=\sqrt{-1}\). If \(p(x)=x^4-2x^3+x^2+8x-20\) has \(x=1+2i\) as a root, what is the product of the real roots of \(p(x)\)?`,
    choices: [String.raw`4`, String.raw`-4`, String.raw`8`, String.raw`-20`, String.raw`NOTA`], answer: "B",
    solution: String.raw`Non-real roots come in conjugate pairs, so \(x=1-2i\) is also a root. Thus,
\[q(x)=(x-(1+2i))(x-(1-2i))=x^2-2x+5\]
must be a factor. Divide \(p(x)\) by \(q(x)\) to get \(x^2-4\), whose roots are \(x=\pm2\). Their product is \(\boxed{-4}\).`,
  },
  {
    id: 30439, number: 439, division: "Theta", topic: "Inequalities", difficulty: 3, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":20},
    question: String.raw`In the plane, consider the graph of the solution set to \(4x-y\le5\) and \(ax-2y<3\). What is the smallest possible value of \(a\) so that any point in the second quadrant will be a solution to the system?`,
    choices: [String.raw`-5`, String.raw`-3`, String.raw`0`, String.raw`1`, String.raw`NOTA`], answer: "C",
    solution: String.raw`Notice that in Quadrant 2, \(x<0\) and \(y>0\) so \(4x-y<0\le5\). Now \(ax-2y<3\) must contain Quadrant 2 as well. Notice \(ax-2y=3\) can be written as \(y=\frac a2x-\frac32\). As \(a\) varies, the line rotates about the \(y\)-intercept \((0,-\frac32)\). If \(a<0\), then the line decreases through the \(y\)-intercept, causing it to go into Quadrant 2. In fact, fixing any \(y>0\) and taking \(x\) sufficiently negative makes \(ax-2y\ge3\), so not every point works. For \(a\ge0\), \(ax\le0\) and \(-2y<0\), so every point in Quadrant 2 satisfies the inequality. Thus, \(a\ge0\) showing the smallest possible value of \(a\) to be \(\boxed0\).`,
  },
  {
    id: 30440, number: 440, division: "Theta", topic: "Conic Sections", difficulty: 3, methods: ["Completing the Square"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":21},
    question: String.raw`Consider the ellipse whose equation is \(16x^2-32x+9y^2+36y=92\). Construct a decreasing line from one vertex to one co-vertex of this ellipse. What is the greatest possible \(x\)-intercept of this line?`,
    choices: [String.raw`\(-\frac12\)`, String.raw`\(\frac43\)`, String.raw`\(\frac52\)`, String.raw`\(-\frac72\)`, String.raw`NOTA`], answer: "C",
    solution: String.raw`Complete the square to write
\[16(x^2-2x+1)+9(y^2+4y+4)=92+16+36,\]
or \(16(x-1)^2+9(y+2)^2=144\). This can be written as
\[\frac{(x-1)^2}{9}+\frac{(y+2)^2}{16}=1,\]
yielding a vertical ellipse with center \((1,-2)\), \(a=4\) and \(b=3\). The vertices are \(A(1,-6)\), \(B(1,2)\) and the co-vertices are \(C(-2,-2)\), \(D(4,-2)\). One line with negative slope passes through \(B\) and \(D\). Its slope is \(\frac{2+2}{1-4}=-\frac43\). The equation of the line is \(y+2=-\frac43(x-4)\). When \(y=0\), \(2=-\frac43(x-4)\). So \(-\frac32=x-4\) and \(x=\frac52\). The other decreasing line passes through \(A\) and \(C\) with slope \(-\frac43\) and equation \(y+2=-\frac43(x+2)\). When \(y=0\), \(2=-\frac43(x+2)\) so \(x=-\frac72\). The greatest possible \(x\)-intercept is \(x=\boxed{\frac52}\).`,
  },
  {
    id: 30441, number: 441, division: "Theta", topic: "Matrices", difficulty: 2, methods: ["Determinant","Row Operations"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":22},
    question: String.raw`If \(\begin{vmatrix}2&-1&3\\0&-3&1\\1&1&-1\end{vmatrix}=12\), what is the value of \(\begin{vmatrix}0&6&-2\\-4&2&-6\\-2&-2&2\end{vmatrix}\)?`,
    choices: [String.raw`-12`, String.raw`-24`, String.raw`24`, String.raw`96`, String.raw`NOTA`], answer: "D",
    solution: String.raw`Notice rows \(1\) and \(2\) have swapped. Switching two rows multiplies the determinant by \(-1\). Also, every row has been multiplied by \(-2\), thus this contributes a factor of \((-2)^3=-8\). Thus, the new determinant has value \(12(-1)(-8)=\boxed{96}\).`,
  },
  {
    id: 30442, number: 442, division: "Theta", topic: "Conic Sections", difficulty: 1, methods: ["Distance Formula"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":23},
    question: String.raw`A parabola with focus \((-1,-2)\) contains \(P(-7,-10)\). What is the distance between \(P\) and the directrix?`,
    choices: [String.raw`5`, String.raw`\(5\sqrt2\)`, String.raw`10`, String.raw`\(10\sqrt2\)`, String.raw`NOTA`], answer: "C",
    solution: String.raw`The distance between the focus and \(P\) is
\[\sqrt{(-1+7)^2+(-2+10)^2}=\sqrt{36+64}=10.\]
A property of a parabola is that any point on the parabola is equidistant to the focus and directrix. Thus, the distance from \(P\) to the directrix is also \(\boxed{10}\).`,
  },
  {
    id: 30443, number: 443, division: "Theta", topic: "Polynomials", difficulty: 1, methods: ["Remainder Theorem"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":24},
    question: String.raw`What is the remainder when \(f(x)=(x-1)(x+3)(2x-1)\) is divided by \(x+4\)?`,
    choices: [String.raw`-147`, String.raw`45`, String.raw`147`, String.raw`-45`, String.raw`NOTA`], answer: "D",
    solution: String.raw`By the Remainder Theorem, the remainder is \(f(-4)=(-5)(-1)(-9)=\boxed{-45}\).`,
  },
  {
    id: 30444, number: 444, division: "Theta", topic: "Complex Numbers", difficulty: 3, methods: ["Real and Imaginary Parts"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":25},
    question: String.raw`How many complex numbers \(z=a+bi\) satisfy \(z^2=\overline z\) where \(\overline z\) is the conjugate of \(z\)?`,
    choices: [String.raw`1`, String.raw`2`, String.raw`3`, String.raw`4`, String.raw`NOTA`], answer: "D",
    solution: String.raw`The equation to solve is \((a+bi)^2=a-bi\). Expand to find \((a^2-b^2)+2abi=a-bi\) so \(a^2-b^2=a\) and \(2ab=-b\). From the second equation, either \(b=0\) or \(a=-\frac12\). If \(b=0\), then \(a^2=a\) so \(a=0\) or \(a=1\). If \(a=-\frac12\), then \((-\frac12)^2-b^2=-\frac12\) so \(b^2=\frac34\) and \(b=\pm\frac{\sqrt3}{2}\). Therefore, there are \(\boxed4\) such complex numbers:
\[z=0+0i,\quad z=1+0i,\quad z=-\frac12+\frac{\sqrt3}{2}i,\quad z=-\frac12-\frac{\sqrt3}{2}i.\]`,
  },
  {
    id: 30445, number: 445, division: "Theta", topic: "Logs and Exponents", difficulty: 3, methods: ["Logarithms","Substitution"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":26},
    question: String.raw`What is the product of the real solutions to \(\frac{x^{\log_2x}}{x^2}=256\)?`,
    choices: [String.raw`\(\frac14\)`, String.raw`1`, String.raw`4`, String.raw`16`, String.raw`NOTA`], answer: "C",
    solution: String.raw`Write as \(x^{\log_2x}=256x^2\). The logarithm requires \(x>0\). Take the logarithm base \(2\) of both sides and use log properties to write
\[(\log_2x)^2=8+2\log_2x.\]
Let \(u=\log_2x\) so \(u^2-2u-8=(u-4)(u+2)=0\) showing \(u=4\), \(u=-2\). Thus, \(\log_2x=4\) and \(\log_2x=-2\). Hence, \(x=2^4=16\) and \(x=2^{-2}=\frac14\). Their product is \((16)(\frac14)=\boxed4\).`,
  },
  {
    id: 30446, number: 446, division: "Theta", topic: "Functions", difficulty: 1, methods: ["Nested Functions"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":27},
    question: String.raw`Define \(f(x)=2x+1\). If \((f\circ f\circ f\circ f)(x)=ax+b\), find \(a+b\).`,
    choices: [String.raw`15`, String.raw`23`, String.raw`31`, String.raw`47`, String.raw`NOTA`], answer: "C",
    solution: String.raw`\[(f\circ f\circ f\circ f)(x)=2(2(2(2x+1)+1)+1)+1=16x+15.\]
So \(a+b=16+15=\boxed{31}\).`,
  },
  {
    id: 30447, number: 447, division: "Theta", topic: "Functions", difficulty: 2, methods: ["Distance Formula"],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":28},
    question: String.raw`Define \(f(x)=2x+1\). What is the distance between the intersection points of the graphs of the following two functions?
\[y=f(2+x^2)\quad\text{and}\quad y=f(4-x^2)\]`,
    choices: [String.raw`2`, String.raw`\(2\sqrt3\)`, String.raw`4`, String.raw`\(3\sqrt3\)`, String.raw`NOTA`], answer: "A",
    solution: String.raw`\(f(2+x^2)=2(2+x^2)+1=2x^2+5\) and \(f(4-x^2)=2(4-x^2)+1=-2x^2+9\). Solve \(2x^2+5=-2x^2+9\) to find \(4x^2=4\) or \(x=\pm1\). The points \((1,7)\) and \((-1,7)\) are a distance \(\boxed2\) away.`,
  },
  {
    id: 30448, number: 448, division: "Theta", topic: "Simplification", difficulty: 3, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":29},
    question: String.raw`The expression \(\sqrt{11+6\sqrt2}+\sqrt{11-6\sqrt2}\) evaluates to an integer. What is that integer value?`,
    choices: [String.raw`4`, String.raw`5`, String.raw`6`, String.raw`7`, String.raw`NOTA`], answer: "C",
    solution: String.raw`We want \(\sqrt{11+6\sqrt2}=a+b\sqrt2\) for positive integers \(a,b\), in other words, \((a+b\sqrt2)^2=11+6\sqrt2\). Expanding, \(a^2+2b^2+2ab\sqrt2=11+6\sqrt2\). Then \(a^2+2b^2=11\) and \(2ab=6\). Substitute \(b=\frac3a\) into the first equation to get \(a^2+2(\frac9{a^2})=11\), or
\[a^4-11a^2+18=(a^2-9)(a^2-2)=0.\]
So \(a=3\) and \(b=1\). Thus, \(\sqrt{11+6\sqrt2}=3+\sqrt2\). Similarly, \(\sqrt{11-6\sqrt2}=3-\sqrt2\), which is positive. Their sum is \((3+\sqrt2)+(3-\sqrt2)=\boxed6\).`,
  },
  {
    id: 30449, number: 449, division: "Theta", topic: "Simplification", difficulty: 1, methods: [],
    source: {"competition":"2026 January Regional","event":"Algebra 2 Individual","questionNumber":30},
    question: String.raw`What is the value of \(-2^2-(-2)^2-2^{-2}\)?`,
    choices: [String.raw`\(-\frac14\)`, String.raw`\(-\frac{33}{4}\)`, String.raw`-4`, String.raw`-12`, String.raw`NOTA`], answer: "B",
    solution: String.raw`\[-2^2-(-2)^2-2^{-2}=-4-(4)-\frac14=-8-\frac14=\boxed{-\frac{33}{4}}.\]
Exponentiation takes precedence over an unparenthesized leading minus: \(-2^2=-(2^2)=-4\), whereas \((-2)^2=4\).`,
  },
];
