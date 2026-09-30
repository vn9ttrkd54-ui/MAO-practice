import type { Question } from "@/types/question";

export const alphaQuestions: Question[] = [
  {
    id: 20001,
    number: 1,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 1,
    methods: [],
    question: String.raw`Legosi, whose eye level is \(2\) meters above the ground, is standing a horizontal distance of \(6\sqrt3\) meters from a tree. When he looks at the top of the tree, his eyes form a \(30^\circ\) angle of elevation with the ground. Find the height of the tree, in meters. Assume the tree is perfectly upright and the ground is perfectly flat.`,
    choices: ["8", "18", "6", "20", "NOTA"],
    answer: "A",
    solution: String.raw`Drawing a right triangle, the vertical distance from Legosi's eyes to the top of the tree is
\[6\sqrt3\tan(30^\circ)=6.\]
Adding Legosi's eye height gives a total tree height of \(6+2=\boxed{8}\) meters.`,
  },
  {
    id: 20002,
    number: 2,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 1,
    methods: [],
    question: String.raw`Find the smallest positive \(x\) satisfying
\[\sqrt3\csc(x)=2.\]`,
    choices: [String.raw`\(\frac\pi6\)`, String.raw`\(\frac\pi4\)`, String.raw`\(\frac\pi3\)`, String.raw`\(\frac\pi2\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Rearranging gives
\[\sin(x)=\frac{\sqrt3}{2}.\]
The smallest positive angle with this sine value is \(x=\boxed{\frac\pi3}\).`,
  },
  {
    id: 20003,
    number: 3,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 1,
    methods: [],
    question: String.raw`For which of the following angles \(x\) is
\[\arcsin(\sin x)\ne x?\]`,
    choices: [String.raw`\(-\frac{3\pi}{10}\)`, String.raw`\(\frac{4\pi}{7}\)`, String.raw`\(\frac{2\pi}{5}\)`, String.raw`\(\frac{5\pi}{11}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The range of \(\arcsin\) is \(\left[-\frac\pi2,\frac\pi2\right]\), so \(\arcsin(\sin x)=x\) for every \(x\) in that interval. Among the choices, only \(\frac{4\pi}{7}>\frac\pi2\). Therefore the answer is \(\boxed{\frac{4\pi}{7}}\).`,
  },
  {
    id: 20004,
    number: 4,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 2,
    methods: [],
    question: String.raw`Collot is riding an old bicycle whose front wheel has three times the radius of its back wheel. Assuming both wheels roll without slipping, if the back wheel completes \(120\) revolutions per minute, how many revolutions per minute does the front wheel complete?`,
    choices: ["360", "40", "120", "240", "NOTA"],
    answer: "B",
    solution: String.raw`Because both wheels roll without slipping, they have the same linear speed. If the back-wheel radius is \(r\), the front-wheel radius is \(3r\). Thus
\[3r\omega_F=r\omega_B,\]
so \(\omega_F=\frac13\omega_B\). Therefore the front wheel completes
\[\frac13(120)=\boxed{40}\]
revolutions per minute.`,
  },
  {
    id: 20005,
    number: 5,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 1,
    methods: [],
    question: String.raw`A first-quadrant angle \(\theta\) satisfies
\[\sin\theta=\frac35.\]
Compute \(\sec\theta\).`,
    choices: [String.raw`\(\frac45\)`, String.raw`\(\frac43\)`, String.raw`\(\frac54\)`, String.raw`\(\frac53\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Draw a right triangle with opposite leg \(3\) and hypotenuse \(5\). The adjacent leg is
\[\sqrt{5^2-3^2}=4.\]
Therefore
\[\sec\theta=\frac{\text{hypotenuse}}{\text{adjacent}}=\boxed{\frac54}.\]`,
  },
  {
    id: 20006,
    number: 6,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 4,
    methods: ["Law of Sines"],
    question: String.raw`For which of the following values of \(k\) is there a unique triangle \(ABC\) satisfying
\[\angle A=30^\circ,\qquad AB=10,\qquad BC=k?\]`,
    choices: ["4", "8", "12", "6", "NOTA"],
    answer: "C",
    solution: String.raw`By the Law of Sines,
\[\frac{\sin 30^\circ}{k}=\frac{\sin C}{10},\]
so \(\sin C=\frac5k\). If \(k<5\), there is no triangle; if \(k=5\), there is one right triangle; and if \(5<k<10\), both the acute and obtuse values of \(C\) produce triangles. When \(k\ge10\), the obtuse candidate would make \(A+C\ge180^\circ\), so only the acute candidate works. Among the choices, only \(k=12\) produces exactly one triangle. Thus \(k=\boxed{12}\).`,
  },
  {
    id: 20007,
    number: 7,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 2,
    methods: ["Trigonometric Identities"],
    question: String.raw`Let \(\alpha\) be a second-quadrant angle satisfying \(\sin\alpha=\frac35\), and let \(\beta\) be a fourth-quadrant angle satisfying \(\cos\beta=\frac5{13}\). Compute \(\sin(\beta-\alpha)\).`,
    choices: [String.raw`\(\frac{33}{65}\)`, String.raw`\(\frac{63}{65}\)`, String.raw`\(\frac{16}{65}\)`, String.raw`\(\frac{56}{65}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Because \(\alpha\) is in Quadrant II,
\[\cos\alpha=-\sqrt{1-\left(\frac35\right)^2}=-\frac45.\]
Because \(\beta\) is in Quadrant IV,
\[\sin\beta=-\sqrt{1-\left(\frac5{13}\right)^2}=-\frac{12}{13}.\]
Therefore
\[\sin(\beta-\alpha)=\sin\beta\cos\alpha-\cos\beta\sin\alpha
=\left(-\frac{12}{13}\right)\left(-\frac45\right)-\left(\frac5{13}\right)\left(\frac35\right)
=\boxed{\frac{33}{65}}.\]`,
  },
  {
    id: 20008,
    number: 8,
    division: "Alpha",
    topic: "Polynomial Equations",
    difficulty: 3,
    methods: ["Substitution", "Rational Root Theorem"],
    question: String.raw`Find the sum of all real solutions \(x\) to
\[\sqrt{x}-4\sqrt[3]{x}+\sqrt[6]{x}+6=0.\]`,
    choices: ["794", "64", "65", "793", "NOTA"],
    answer: "D",
    solution: String.raw`Let \(a=\sqrt[6]{x}\). Because \(a\) is a real sixth root, \(a\ge0\), and the equation becomes
\[a^3-4a^2+a+6=0.\]
Factoring gives
\[(a+1)(a-2)(a-3)=0.\]
The nonnegative solutions are \(a=2\) and \(a=3\), corresponding to \(x=2^6=64\) and \(x=3^6=729\). Their sum is
\[64+729=\boxed{793}.\]`,
  },
  {
    id: 20009,
    number: 9,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 1,
    methods: [],
    question: String.raw`Find the sum of the period and amplitude of
\[f(x)=-20\sin\left(\frac\pi{25}x\right).\]`,
    choices: ["70", "45", "30", "5", "NOTA"],
    answer: "A",
    solution: String.raw`For \(f(x)=A\sin(Bx)\), the amplitude is \(|A|\) and the period is \(\frac{2\pi}{|B|}\). Here the amplitude is \(20\), and the period is
\[\frac{2\pi}{\pi/25}=50.\]
Their sum is \(20+50=\boxed{70}\).`,
  },
  {
    id: 20010,
    number: 10,
    division: "Alpha",
    topic: "Conic Sections",
    difficulty: 1,
    methods: ["Discriminant Test"],
    question: String.raw`Classify the conic section
\[3x^2-4xy+5y^2=1.\]`,
    choices: ["Circle", "Non-Circular Ellipse", "Parabola", "Hyperbola", "NOTA"],
    answer: "B",
    solution: String.raw`For a conic \(Ax^2+Bxy+Cy^2+\cdots=0\), compute
\[B^2-4AC=(-4)^2-4(3)(5)=-44<0.\]
Therefore the conic is an ellipse. Because the \(xy\)-coefficient is nonzero, the ellipse is rotated and is not a circle. Hence it is a \(\boxed{\text{non-circular ellipse}}\).`,
  },
  {
    id: 20011,
    number: 11,
    division: "Alpha",
    topic: "Analytic Geometry",
    difficulty: 1,
    methods: ["Point-to-Line Distance Formula"],
    question: String.raw`Find the distance from the point \((5,-1)\) to the line
\[3x+4y=1.\]`,
    choices: [String.raw`\(\frac{12}{5}\)`, "2", String.raw`\(\frac{18}{5}\)`, "4", "NOTA"],
    answer: "B",
    solution: String.raw`Write the line as \(3x+4y-1=0\). The point-to-line distance formula gives
\[d=\frac{|3(5)+4(-1)-1|}{\sqrt{3^2+4^2}}=\frac{10}{5}=\boxed2.\]`,
  },
  {
    id: 20012,
    number: 12,
    division: "Alpha",
    topic: "Matrices",
    difficulty: 2,
    methods: ["Matrix Inverse"],
    question: String.raw`Jack is given the system
\[2x+3y=1,\qquad 3x-y=7.\]
He writes
\[\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}1\\7\end{pmatrix}.\]
Assuming his calculation is correct, find \(a+b+c+d\).`,
    choices: [String.raw`\(-\frac7{11}\)`, String.raw`\(-\frac5{11}\)`, String.raw`\(\frac5{11}\)`, String.raw`\(\frac7{11}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`The coefficient matrix is
\[A=\begin{pmatrix}2&3\\3&-1\end{pmatrix},\qquad \det A=2(-1)-3(3)=-11.\]
Thus
\[A^{-1}=\frac1{-11}\begin{pmatrix}-1&-3\\-3&2\end{pmatrix}.\]
The sum of the four entries is
\[\frac{-1-3-3+2}{-11}=\boxed{\frac5{11}}.\]`,
  },
  {
    id: 20013,
    number: 13,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 2,
    methods: ["Trigonometric Identities"],
    question: String.raw`Find the sum of all \(x\in[0,2\pi\)) satisfying
\[\cos(2x)+\sin x=0.\]`,
    choices: [String.raw`\(\frac{3\pi}{2}\)`, String.raw`\(\frac{9\pi}{2}\)`, String.raw`\(\frac{7\pi}{2}\)`, String.raw`\(\frac{5\pi}{2}\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Using \(\cos(2x)=1-2\sin^2x\), the equation becomes
\[1-2\sin^2x+\sin x=0.\]
Let \(u=\sin x\). Then
\[2u^2-u-1=(2u+1)(u-1)=0,\]
so \(\sin x=1\) or \(\sin x=-\frac12\). In \([0,2\pi\)), the solutions are
\[x=\frac\pi2,\ \frac{7\pi}{6},\ \frac{11\pi}{6}.\]
Their sum is \(\boxed{\frac{7\pi}{2}}\).`,
  },
  {
    id: 20014,
    number: 14,
    division: "Alpha",
    topic: "Logs and Exponents",
    difficulty: 3,
    methods: [],
    question: String.raw`A cup of water is initially at \(2^\circ\mathrm C\) and is left in a room of constant temperature \(22^\circ\mathrm C\). The difference between the water temperature and room temperature decays exponentially. If the water takes \(10\) minutes to warm to \(12^\circ\mathrm C\), find its temperature, in degrees Celsius, \(20\) minutes after the initial time.`,
    choices: ["22", "18", "17", "20", "NOTA"],
    answer: "C",
    solution: String.raw`The temperature difference from room temperature has the form
\[T(t)-22=ka^{-t}.\]
At \(t=0\), \(k=-20\). At \(t=10\),
\[-10=-20a^{-10},\]
so \(a^{10}=2\). Therefore
\[T(20)-22=-20a^{-20}=-20\left(\frac12\right)^2=-5,\]
and \(T(20)=\boxed{17^\circ\mathrm C}\).`,
  },
  {
    id: 20015,
    number: 15,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 3,
    methods: ["Trigonometric Identities"],
    question: String.raw`If \(t=\tan\left(\frac12\right)\), which expression is equivalent to \(\sin(1)\)?`,
    choices: [String.raw`\(\frac{1-t^2}{1+t^2}\)`, String.raw`\(\sqrt{\frac{1+t}{1-t}}\)`, String.raw`\(\sqrt{\frac{1-t}{1+t}}\)`, String.raw`\(\frac{2t}{1+t^2}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The tangent half-angle identity is
\[\sin\theta=\frac{2\tan(\theta/2)}{1+\tan^2(\theta/2)}.\]
With \(\theta=1\) and \(t=\tan(1/2)\), this gives
\[\sin(1)=\boxed{\frac{2t}{1+t^2}}.\]`,
  },
  {
    id: 20016,
    number: 16,
    division: "Alpha",
    topic: "Matrices",
    difficulty: 2,
    methods: ["Determinant"],
    question: String.raw`Find the product of all values of \(k\) for which the matrix
\[\begin{pmatrix}k&k+2\\9&2k\end{pmatrix}\]
is non-invertible.`,
    choices: ["−12", "−9", "3", "12", "NOTA"],
    answer: "B",
    solution: String.raw`The matrix is non-invertible when its determinant is zero:
\[2k^2-9(k+2)=0.\]
Factoring gives
\[(2k+3)(k-6)=0,\]
so \(k=-\frac32\) or \(k=6\). Their product is \(\boxed{-9}\).`,
  },
  {
    id: 20017,
    number: 17,
    division: "Alpha",
    topic: "Conic Sections",
    difficulty: 3,
    methods: [],
    question: String.raw`A parabola of the form
\[x=ay^2+by+c\]
passes through \((3,-1)\), \((1,-5)\), and \((-5,7)\). Find the distance between its focus and its directrix.`,
    choices: ["2", "4", "8", "12", "NOTA"],
    answer: "B",
    solution: String.raw`Substitution gives
\[\begin{cases}
3=a-b+c,\\
1=25a-5b+c,\\
-5=49a+7b+c.
\end{cases}\]
Solving yields \(a=-\frac18\), \(b=-\frac14\), and \(c=\frac{23}{8}\). Hence
\[8x=-y^2-2y+23,\]
or
\[(y+1)^2=-8(x-3).\]
Comparing with \((y-k)^2=4p(x-h)\) gives \(4p=-8\), so \(p=-2\). The distance between the focus and directrix is \(2|p|=\boxed4\).`,
  },
  {
    id: 20018,
    number: 18,
    division: "Alpha",
    topic: "Complex Numbers",
    difficulty: 3,
    methods: ["De Moivre's Theorem"],
    question: String.raw`Suppose \(\theta\) is a first-quadrant angle and
\[\cos\theta=\frac1{\sqrt3}.\]
Compute \(\cos(6\theta)\).`,
    choices: [String.raw`\(-\frac{13}{27}\)`, String.raw`\(-\frac{23}{27}\)`, String.raw`\(\frac{13}{27}\)`, String.raw`\(\frac{23}{27}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`By De Moivre's Theorem, \(\cos(6\theta)\) is the real part of \((\cos\theta+i\sin\theta)^6\), so
\[\cos(6\theta)=\cos^6\theta-15\cos^4\theta\sin^2\theta+15\cos^2\theta\sin^4\theta-\sin^6\theta.\]
Because \(\cos^2\theta=\frac13\) and \(\sin^2\theta=\frac23\),
\[\cos(6\theta)=\left(\frac13\right)^3-15\left(\frac13\right)^2\left(\frac23\right)+15\left(\frac13\right)\left(\frac23\right)^2-\left(\frac23\right)^3
=\boxed{\frac{23}{27}}.\]`,
  },
  {
    id: 20019,
    number: 19,
    division: "Alpha",
    topic: "Complex Numbers",
    difficulty: 2,
    methods: [],
    question: String.raw`Every nonzero complex number \(z\) can be written as \(z=re^{i\theta}\), where \(r>0\) and \(0\le\theta<2\pi\). Define \(\arg(z)=\theta\). For complex numbers \(z\) and \(w\) with \(\arg z,\arg w<\pi\), which expression equals \(\arg(zw)\)?`,
    choices: [String.raw`\(\arg z+\arg w\)`, String.raw`\((\arg z)(\arg w)\)`, String.raw`\(|\arg z-\arg w|\)`, String.raw`\(\arg z+\arg w-\pi\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Write \(z=r_1e^{i\theta_1}\) and \(w=r_2e^{i\theta_2}\). Then
\[zw=r_1r_2e^{i(\theta_1+\theta_2)}.\]
Since \(0\le\theta_1,\theta_2<\pi\), their sum lies in \([0,2\pi\)). Therefore
\[\arg(zw)=\boxed{\arg z+\arg w}.\]`,
  },
  {
    id: 20020,
    number: 20,
    division: "Alpha",
    topic: "Complex Numbers",
    difficulty: 3,
    methods: ["Arguments of Complex Numbers"],
    question: String.raw`Compute
\[\arctan(1)+\arctan\left(\frac12\right)+\arctan\left(\frac13\right).\]`,
    choices: [String.raw`\(\arctan\left(\frac{11}{6}\right)\)`, String.raw`\(\frac\pi3\)`, String.raw`\(\frac\pi2\)`, String.raw`\(\arctan\left(\frac{11}{5}\right)\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Observe that
\[(1+i)(1+2i)(1+3i)=10i.\]
The argument of a product equals the sum of the arguments, and
\[\arg(1+ki)=\arctan(k)\]
for \(k>0\). Thus the given sum is the argument of \(10i\), which is \(\boxed{\frac\pi2}\).`,
  },
  {
    id: 20021,
    number: 21,
    division: "Alpha",
    topic: "Geometry",
    difficulty: 4,
    methods: [],
    question: String.raw`Find the area inside both circles
\[(x-\sqrt3)^2+y^2=4\qquad\text{and}\qquad(x+\sqrt3)^2+y^2=4.\]`,
    choices: [String.raw`\(\frac{4\pi}{3}-2\sqrt3\)`, String.raw`\(\frac{16\pi}{3}-8\sqrt3\)`, String.raw`\(\frac{8\pi}{3}-2\sqrt3\)`, String.raw`\(\frac{2\pi}{3}-\sqrt3\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Both circles have radius \(2\), and their centers are \(2\sqrt3\) units apart. The common chord subtends an angle of \(60^\circ=\frac\pi3\) at each center. One circular segment has area
\[\frac12(2^2)\left(\frac\pi3\right)-\frac12(2^2)\sin\left(\frac\pi3\right)=\frac{2\pi}{3}-\sqrt3.\]
The overlap consists of two congruent segments, so its area is
\[2\left(\frac{2\pi}{3}-\sqrt3\right)=\boxed{\frac{4\pi}{3}-2\sqrt3}.\]`,
  },
  {
    id: 20022,
    number: 22,
    division: "Alpha",
    topic: "Geometry",
    difficulty: 3,
    methods: ["Law of Cosines"],
    question: String.raw`Convex quadrilateral \(ABCD\) has
\[AB=7,\quad BC=5,\quad CD=12,\quad AD=8,\quad\text{and}\quad \angle DAB=120^\circ.\]
Its area can be written as \(m\sqrt3+n\), where \(m\) and \(n\) are positive integers. Find \(m+n\).`,
    choices: ["28", "36", "44", "54", "NOTA"],
    answer: "C",
    solution: String.raw`First,
\[[\triangle DAB]=\frac12(7)(8)\sin120^\circ=14\sqrt3.\]
By the Law of Cosines,
\[BD^2=7^2+8^2-2(7)(8)\cos120^\circ=169,\]
so \(BD=13\). Therefore \(\triangle BCD\) is a \(5\)-\(12\)-\(13\) right triangle with area \(30\). The quadrilateral's area is
\[14\sqrt3+30,\]
so \(m+n=14+30=\boxed{44}\).`,
  },
  {
    id: 20023,
    number: 23,
    division: "Alpha",
    topic: "Optimization",
    difficulty: 4,
    methods: ["Substitution"],
    question: String.raw`Find the maximum possible value of
\[\left(4x+5\sqrt{1-x^2}\right)^2\]
for \(-1\le x\le1\).`,
    choices: ["25", "41", "40", "30", "NOTA"],
    answer: "B",
    solution: String.raw`Let \(x=\sin\theta\), where \(-\frac\pi2\le\theta\le\frac\pi2\). Then \(\sqrt{1-x^2}=\cos\theta\), so the expression is
\[\left(4\sin\theta+5\cos\theta\right)^2.\]
The maximum of \(4\sin\theta+5\cos\theta\) is
\[\sqrt{4^2+5^2}=\sqrt{41}.\]
Therefore the maximum squared value is \(\boxed{41}\).`,
  },
  {
    id: 20024,
    number: 24,
    division: "Alpha",
    topic: "Conic Sections",
    difficulty: 4,
    methods: [],
    question: String.raw`An ellipse is centered at \((0,0)\), has a focus at \((2,0)\), and passes through \((2,3)\). Find its area.`,
    choices: [String.raw`\(16\pi\)`, String.raw`\(4\pi\sqrt3\)`, String.raw`\(8\pi\)`, String.raw`\(8\pi\sqrt3\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The ellipse is horizontal, so it has equation
\[\frac{x^2}{a^2}+\frac{y^2}{b^2}=1.\]
Because the focal distance is \(c=2\),
\[a^2-b^2=4.\]
Since \((2,3)\) lies on the ellipse,
\[\frac4{a^2}+\frac9{b^2}=1.\]
Solving gives \(a^2=16\) and \(b^2=12\), so \(a=4\) and \(b=2\sqrt3\). Therefore the area is
\[\pi ab=\pi(4)(2\sqrt3)=\boxed{8\pi\sqrt3}.\]`,
  },
  {
    id: 20025,
    number: 25,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 3,
    methods: ["Rational Root Theorem"],
    question: String.raw`If \(x\in[0,\pi]\) satisfies
\[\tan^2x-16\cos x-11=0,\]
find the product of all possible values of \(\sin x\).`,
    choices: [String.raw`\(\frac{3\sqrt5}{8}\)`, String.raw`\(\frac18\)`, String.raw`\(\frac{\sqrt{15}}8\)`, String.raw`\(\frac{\sqrt5}8\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Let \(a=\cos x\). Using \(\tan^2x=\sec^2x-1\), multiply the equation by \(a^2\) to obtain
\[16a^3+12a^2-1=0.\]
Factoring gives
\[(2a+1)^2(4a-1)=0.\]
Thus the possible cosine values are \(-\frac12\) and \(\frac14\). Since \(x\in[0,\pi]\), the corresponding sine values are
\[\frac{\sqrt3}{2}\qquad\text{and}\qquad\frac{\sqrt{15}}4.\]
Their product is \(\boxed{\frac{3\sqrt5}{8}}\).`,
  },
  {
    id: 20026,
    number: 26,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 5,
    methods: ["Law of Sines", "Product-to-Sum Identity"],
    question: String.raw`Triangle \(ABC\) has
\[\angle A=30^\circ,\qquad \angle B=70^\circ,\qquad BC=1.\]
Its area can be written as \(p+q\cos(10^\circ)\), where \(p^2\) and \(q^2\) are rational. Compute \(pq\).`,
    choices: [String.raw`\(\frac{\sqrt3}{8}\)`, String.raw`\(-\frac{\sqrt3}{8}\)`, String.raw`\(\frac{\sqrt3}{2}\)`, String.raw`\(-\frac{\sqrt3}{2}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`First, \(\angle C=80^\circ\). By the Law of Sines,
\[\frac{AC}{\sin70^\circ}=\frac{BC}{\sin30^\circ},\]
so \(AC=2\sin70^\circ\). Therefore
\[[\triangle ABC]=\frac12(BC)(AC)\sin80^\circ=\sin70^\circ\sin80^\circ.\]
Using product-to-sum,
\[\sin70^\circ\sin80^\circ=\frac12\left(\cos10^\circ-\cos150^\circ\right)=\frac12\cos10^\circ+\frac{\sqrt3}{4}.\]
Thus \(p=\frac{\sqrt3}{4}\), \(q=\frac12\), and
\[pq=\boxed{\frac{\sqrt3}{8}}.\]`,
  },
  {
    id: 20027,
    number: 27,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 4,
    methods: ["Law of Sines", "Law of Cosines"],
    question: String.raw`The angles of triangle \(ABC\) satisfy
\[\sin A:\sin B:\sin C=2:3:4.\]
Compute \(\cos A+\cos B+\cos C\).`,
    choices: [String.raw`\(\frac{27}{16}\)`, String.raw`\(\frac{21}{16}\)`, String.raw`\(\frac{29}{16}\)`, String.raw`\(\frac{23}{16}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`By the Law of Sines, the side lengths are proportional to \(2:3:4\). We may therefore use side lengths \(a=2\), \(b=3\), and \(c=4\). By the Law of Cosines,
\[\cos A=\frac{b^2+c^2-a^2}{2bc}=\frac78,\]
\[\cos B=\frac{a^2+c^2-b^2}{2ac}=\frac{11}{16},\]
and
\[\cos C=\frac{a^2+b^2-c^2}{2ab}=-\frac14.\]
Hence
\[\cos A+\cos B+\cos C=\frac{14+11-4}{16}=\boxed{\frac{21}{16}}.\]`,
  },
  {
    id: 20028,
    number: 28,
    division: "Alpha",
    topic: "Matrices",
    difficulty: 5,
    methods: ["Row Operations"],
    question: String.raw`Let \(M\) be the \(100\times100\) matrix such that \(M_{jj}=0\) for \(2\le j\le100\), and \(M_{jk}=1\) otherwise. Thus \(M\) has zeros on the main diagonal except in the top-left entry, and ones everywhere else. Compute \(\det M\).`,
    choices: ["0", "1", "100", "−1", "NOTA"],
    answer: "D",
    solution: String.raw`Subtract the first row from every other row; this does not change the determinant. The first row remains all ones. Each later row has a single \(-1\) in its diagonal position and zeros in every other position. The resulting matrix is upper triangular, with diagonal entries
\[1,-1,-1,\ldots,-1.\]
Therefore
\[\det M=1\cdot(-1)^{99}=\boxed{-1}.\]`,
  },
  {
    id: 20029,
    number: 29,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 4,
    methods: ["Trigonometric Identities"],
    question: String.raw`If \(\theta\) is a first-quadrant angle satisfying
\[\frac{\sin^3\theta+\cos^3\theta}{\sin\theta+\cos\theta}=\frac23,\]
compute
\[\frac{\sin^5\theta+\cos^5\theta}{\sin^3\theta+\cos^3\theta}.\]`,
    choices: [String.raw`\(\frac23\)`, String.raw`\(\frac59\)`, String.raw`\(\frac56\)`, String.raw`\(\frac49\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(s=\sin\theta\) and \(c=\cos\theta\). Since \(s^2+c^2=1\),
\[\frac{s^3+c^3}{s+c}=s^2-sc+c^2=1-sc=\frac23,\]
so \(sc=\frac13\). Also,
\[s^5+c^5=(s^2+c^2)(s^3+c^3)-s^2c^2(s+c).\]
Therefore
\[\frac{s^5+c^5}{s^3+c^3}=1-\frac{s^2c^2(s+c)}{(s+c)(1-sc)}
=1-\frac{(1/3)^2}{1-1/3}
=1-\frac16
=\boxed{\frac56}.\]`,
  },
  {
    id: 20030,
    number: 30,
    division: "Alpha",
    topic: "Geometry",
    difficulty: 5,
    methods: ["Imaginary-Part Argument"],
    question: String.raw`A quadrilateral \(ABCD\) has an inscribed circle tangent to \(\overline{DA}\), \(\overline{AB}\), \(\overline{BC}\), and \(\overline{CD}\) at \(M\), \(N\), \(P\), and \(Q\), respectively. Suppose
\[AM=AN=1,\quad BN=BP=3,\quad CP=CQ=2,\quad DQ=DM=3.\]
Compute the radius of the inscribed circle.`,
    choices: [String.raw`\(\frac{\sqrt{29}}3\)`, String.raw`\(\frac{3\sqrt{29}}{29}\)`, String.raw`\(\frac{\sqrt{39}}{13}\)`, String.raw`\(\frac{\sqrt{39}}3\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Let \(I\) be the incenter and let the radius be \(r\). If the half-angles at \(A,B,C,D\) are \(\alpha,\beta,\gamma,\delta\), respectively, then the tangent lengths give
\[\tan\alpha=\frac1r,\qquad \tan\beta=\frac3r,\qquad \tan\gamma=\frac2r,\qquad \tan\delta=\frac3r.\]
Because the four half-angles sum to \(\pi\),
\[\tan(\alpha+\beta+\gamma+\delta)=0.\]
Equivalently, the imaginary part of
\[(1+ri)(3+ri)(2+ri)(3+ri)\]
must be zero. Expanding its imaginary part gives
\[39r-9r^3=0.\]
Since \(r>0\),
\[r^2=\frac{13}{3},\qquad r=\boxed{\frac{\sqrt{39}}3}.\]`,
  },
  {
    id: 20031,
    number: 31,
    division: "Alpha",
    topic: "Logs and Exponents",
    difficulty: 1,
    methods: [],
    question: String.raw`What is the value of \(\log_6 9+\log_6 4-\log_6\!\left(\frac{1}{\sqrt6}\right)\)?`,
    choices: [String.raw`\(\frac32\)`, String.raw`\(\frac52\)`, String.raw`\(\frac72\)`, String.raw`\(\frac{13}{2}\)`, "NOTA"],
    answer: "B",
    solution: String.raw`Using logarithm properties,
\[\log_6 9+\log_6 4-\log_6\!\left(\frac1{\sqrt6}\right)=\log_6 36-\log_6(6^{-1/2})=2-\left(-\frac12\right)=\frac52.\]`,
  },
  {
    id: 20032,
    number: 32,
    division: "Alpha",
    topic: "Systems of Equations",
    difficulty: 1,
    methods: [],
    question: String.raw`In what quadrant do the lines \(\frac{x}{4}+\frac{y}{2}=1\) and \(\frac{x}{12}-\frac{y}{2}=1\) intersect?`,
    choices: ["I", "II", "III", "IV", "NOTA"],
    answer: "D",
    solution: String.raw`Adding the equations gives \(\frac{x}{3}=2\), so \(x=6\). Substitution gives \(y=-1\). Thus, the lines intersect at \((6,-1)\), which lies in Quadrant IV.`,
  },
  {
    id: 20033,
    number: 33,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 2,
    methods: [],
    question: String.raw`On the interval \([0,2\pi)\), how many solutions are there to \(\sin^2(4x)=1\)?`,
    choices: ["2", "4", "8", "16", "NOTA"],
    answer: "C",
    solution: String.raw`The equation \(\sin^2(4x)=1\) is equivalent to \(\sin(4x)=\pm1\). As \(x\) runs through \([0,2\pi)\), the angle \(4x\) runs through \([0,8\pi)\), which contains four full periods of sine. There are two solutions per period, for a total of \(8\).`,
  },
  {
    id: 20034,
    number: 34,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 2,
    methods: [],
    question: String.raw`The function \(f(x)=a\sin\!\left(\frac{x}{2}\right)+b\) has range \(\left[-\frac{13}{2},\frac72\right]\), where \(a>0\). What is \(f\!\left(\frac\pi3\right)\)?`,
    choices: [String.raw`\(-1\)`, String.raw`\(1\)`, String.raw`\(\frac{17}{4}\)`, String.raw`\(\frac32\)`, "NOTA"],
    answer: "B",
    solution: String.raw`The midline is \(b=\frac{(-13/2)+(7/2)}2=-\frac32\), and the amplitude is \(a=\frac{(7/2)-(-13/2)}2=5\). Therefore,
\[f\!\left(\frac\pi3\right)=5\sin\!\left(\frac\pi6\right)-\frac32=1.\]`,
  },
  {
    id: 20035,
    number: 35,
    division: "Alpha",
    topic: "Parametric",
    difficulty: 2,
    methods: [],
    question: String.raw`The equations \(x=2+3\sin t\) and \(y=-1+3\cos t\) define a curve parametrically. Which equation is its rectangular form?`,
    choices: [String.raw`\((x-2)^2+(y+1)^2=9\)`, String.raw`\((x+2)^2+(y-1)^2=9\)`, String.raw`\((x-2)^2+(y+1)^2=3\)`, String.raw`\((x+2)^2+(y-1)^2=3\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Since \(\sin^2t+\cos^2t=1\),
\[\left(\frac{x-2}{3}\right)^2+\left(\frac{y+1}{3}\right)^2=1,\]
so \((x-2)^2+(y+1)^2=9\).`,
  },
  {
    id: 20036,
    number: 36,
    division: "Alpha",
    topic: "Functions",
    difficulty: 1,
    methods: [],
    question: String.raw`Which function has domain \(( -\infty,3)\) and is undefined elsewhere?`,
    choices: [String.raw`\(f(x)=\frac4{x-3}\)`, String.raw`\(f(x)=4\sqrt{x-3}\)`, String.raw`\(f(x)=\frac4{\sqrt{3-x}}\)`, String.raw`\(f(x)=\ln(x+3)\)`, "NOTA"],
    answer: "C",
    solution: String.raw`For \(f(x)=\frac4{\sqrt{3-x}}\), the radicand must be positive because the square root is in the denominator. Thus \(3-x>0\), or \(x<3\), giving domain \(( -\infty,3)\).`,
  },
  {
    id: 20037,
    number: 37,
    division: "Alpha",
    topic: "Functions",
    difficulty: 3,
    methods: [],
    question: String.raw`The rational function \(f(x)=\frac{x^3+x^2-3x-5}{x^2-4}\) intersects its oblique asymptote at \((p,q)\). Find \(p+q\).`,
    choices: ["1", "3", "5", "7", "NOTA"],
    answer: "B",
    solution: String.raw`Polynomial division gives
\[f(x)=x+1+\frac{x-1}{x^2-4}.\]
The oblique asymptote is \(y=x+1\). The graph intersects it when \(\frac{x-1}{x^2-4}=0\), so \(x=1\) and \(y=2\). Hence \(p+q=3\).`,
  },
  {
    id: 20038,
    number: 38,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 2,
    methods: ["Trigonometric Identities"],
    question: String.raw`For all values in its domain, which expression is equivalent to
\[\frac{1+\tan^2t+\sec^2t\cot^2t}{\csc^2t+\cot^2t\csc^2t}?\]`,
    choices: [String.raw`\(\tan t\)`, String.raw`\(\sec^2t\)`, String.raw`\(\sec t\)`, String.raw`\(\tan^2t\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Using \(1+\tan^2t=\sec^2t\) and \(1+\cot^2t=\csc^2t\),
\[\frac{\sec^2t(1+\cot^2t)}{\csc^2t(1+\cot^2t)}=\frac{\sec^2t}{\csc^2t}=\tan^2t.\]`,
  },
  {
    id: 20039,
    number: 39,
    division: "Alpha",
    topic: "Conic Sections",
    difficulty: 2,
    methods: [],
    question: String.raw`What is the distance between the foci of the hyperbola \(\frac{(x-1)^2}{9}-\frac{(y+2)^2}{16}=1\)?`,
    choices: [String.raw`\(2\sqrt5\)`, "10", String.raw`\(2\sqrt7\)`, "8", "NOTA"],
    answer: "B",
    solution: String.raw`For a hyperbola, \(c^2=a^2+b^2\). Thus \(c^2=9+16=25\), so \(c=5\). The distance between the two foci is \(2c=10\).`,
  },
  {
    id: 20040,
    number: 40,
    division: "Alpha",
    topic: "Polynomial Equations",
    difficulty: 2,
    methods: ["Substitution"],
    question: String.raw`Find the greatest real solution to \(16^x=9\cdot4^{x+1}-128\).`,
    choices: ["1", String.raw`\(\frac32\)`, String.raw`\(\frac52\)`, String.raw`\(\frac72\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Let \(u=4^x\). Then \(16^x=u^2\), so
\[u^2-36u+128=(u-32)(u-4)=0.\]
Thus \(4^x=32\) or \(4^x=4\), giving \(x=\frac52\) or \(x=1\). The greatest solution is \(\frac52\).`,
  },
  {
    id: 20041,
    number: 41,
    division: "Alpha",
    topic: "Matrices",
    difficulty: 2,
    methods: ["Matrix Inverse"],
    question: String.raw`Let
\[A=\begin{pmatrix}\tan(2t)&\sec(2t)\\\sec(2t)&\tan(2t)\end{pmatrix},\qquad 0<t<\frac\pi2.\]
What is \(A^{-1}\)?`,
    choices: [String.raw`\(\begin{pmatrix}-\sec(2t)&\tan(2t)\\\tan(2t)&-\sec(2t)\end{pmatrix}\)`, String.raw`\(\begin{pmatrix}\tan(2t)&-\sec(2t)\\-\sec(2t)&\tan(2t)\end{pmatrix}\)`, String.raw`\(\begin{pmatrix}\tan(2t)&\sec(2t)\\\sec(2t)&\tan(2t)\end{pmatrix}\)`, String.raw`\(\begin{pmatrix}-\tan(2t)&\sec(2t)\\\sec(2t)&-\tan(2t)\end{pmatrix}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`The determinant is \(\tan^2(2t)-\sec^2(2t)=-1\). Therefore,
\[A^{-1}=\frac1{-1}\begin{pmatrix}\tan(2t)&-\sec(2t)\\-\sec(2t)&\tan(2t)\end{pmatrix}=\begin{pmatrix}-\tan(2t)&\sec(2t)\\\sec(2t)&-\tan(2t)\end{pmatrix}.\]`,
  },
  {
    id: 20042,
    number: 42,
    division: "Alpha",
    topic: "Vectors",
    difficulty: 2,
    methods: [],
    question: String.raw`Let \(\vec u=\langle2,-2,1\rangle\) and \(\vec v=\langle4,4,-2\rangle\). Which expression represents the angle \(\theta\) between \(\vec u\) and \(\vec v\)?`,
    choices: [String.raw`\(\cos^{-1}\!\left(-\frac19\right)\)`, String.raw`\(\cos^{-1}\!\left(-\frac29\right)\)`, String.raw`\(\sin^{-1}\!\left(-\frac29\right)\)`, String.raw`\(\sin^{-1}\!\left(-\frac19\right)\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Since \(\vec u\cdot\vec v=8-8-2=-2\), \(\lVert\vec u\rVert=3\), and \(\lVert\vec v\rVert=6\),
\[\cos\theta=\frac{\vec u\cdot\vec v}{\lVert\vec u\rVert\lVert\vec v\rVert}=-\frac19.\]
Thus \(\theta=\cos^{-1}(-1/9)\).`,
  },
  {
    id: 20043,
    number: 43,
    division: "Alpha",
    topic: "Polynomials",
    difficulty: 3,
    methods: [],
    question: String.raw`Let \(r_1,r_2,r_3\) be the roots of \(4x^3+8x^2-29x+12=0\). Find \(\frac1{r_1}+\frac1{r_2}+\frac1{r_3}\).`,
    choices: [String.raw`\(\frac{29}{12}\)`, String.raw`\(\frac{29}{6}\)`, String.raw`\(\frac{25}{12}\)`, String.raw`\(\frac{12}{25}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`By Vieta's formulas, \(r_1r_2+r_1r_3+r_2r_3=-\frac{29}{4}\) and \(r_1r_2r_3=-3\). Hence
\[\frac1{r_1}+\frac1{r_2}+\frac1{r_3}=\frac{r_1r_2+r_1r_3+r_2r_3}{r_1r_2r_3}=\frac{29}{12}.\]`,
  },
  {
    id: 20044,
    number: 44,
    division: "Alpha",
    topic: "Polar",
    difficulty: 2,
    methods: ["Law of Cosines"],
    question: String.raw`Find the exact distance between the points \(\left(-8,\frac\pi6\right)\) and \(\left(6,-\frac\pi3\right)\) represented in polar coordinates.`,
    choices: [String.raw`\(6\sqrt3\)`, String.raw`\(8\sqrt3\)`, "10", "12", "NOTA"],
    answer: "C",
    solution: String.raw`The first point has the equivalent representation \(\left(8,\frac{7\pi}{6}\right)\). The angular difference is \(\frac{3\pi}{2}\), so the two radius vectors are perpendicular. Therefore, the distance is \(\sqrt{8^2+6^2}=10\).`,
  },
  {
    id: 20045,
    number: 45,
    division: "Alpha",
    topic: "Logs and Exponents",
    difficulty: 3,
    methods: [],
    question: String.raw`The half-life of an isotope is \(40\) days. If there are initially \(20\) grams, which expression gives the number of days until exactly \(1\) gram remains?`,
    choices: [String.raw`\(\frac{40\ln20}{\ln2}\)`, String.raw`\(40\ln20\)`, String.raw`\(40\ln10\)`, String.raw`\(\frac{40\ln10}{\ln2}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`The decay model is \(1=20(1/2)^{t/40}\). Taking logarithms gives
\[\frac{t}{40}\ln\!\left(\frac12\right)=\ln\!\left(\frac1{20}\right),\]
so \(t=\frac{40\ln20}{\ln2}\).`,
  },
  {
    id: 20046,
    number: 46,
    division: "Alpha",
    topic: "Complex Numbers",
    difficulty: 3,
    methods: ["De Moivre's Theorem"],
    question: String.raw`Which choice is not a complex solution to \(x^6=-64\)? Recall that \(\operatorname{cis}\theta=\cos\theta+i\sin\theta\).`,
    choices: [String.raw`\(2\operatorname{cis}\!\left(\frac\pi6\right)\)`, String.raw`\(2\operatorname{cis}\!\left(\frac{5\pi}6\right)\)`, String.raw`\(2\operatorname{cis}\!\left(\frac{11\pi}6\right)\)`, String.raw`\(2\operatorname{cis}\!\left(\frac{3\pi}2\right)\)`, "NOTA"],
    answer: "E",
    solution: String.raw`Write \(-64=64\operatorname{cis}\pi\). By De Moivre's theorem, its sixth roots are
\[2\operatorname{cis}\!\left(\frac\pi6\right),\ 2\operatorname{cis}\!\left(\frac\pi2\right),\ 2\operatorname{cis}\!\left(\frac{5\pi}6\right),\ 2\operatorname{cis}\!\left(\frac{7\pi}6\right),\ 2\operatorname{cis}\!\left(\frac{3\pi}2\right),\ 2\operatorname{cis}\!\left(\frac{11\pi}6\right).\]
Every listed number is a root, so the answer is NOTA.`,
  },
  {
    id: 20047,
    number: 47,
    division: "Alpha",
    topic: "Vectors",
    difficulty: 3,
    methods: [],
    question: String.raw`If \(\vec u=-3\mathbf i+(m+3)\mathbf j\) and \(\vec v=2m\mathbf i-2\mathbf j\), find the sum of all values of \(m\) such that \(\lVert\vec u+\vec v\rVert=5\).`,
    choices: ["-5", "-2", "2", "5", "NOTA"],
    answer: "C",
    solution: String.raw`We have \(\vec u+\vec v=\langle-3+2m,m+1\rangle\). Thus
\[(-3+2m)^2+(m+1)^2=25,\]
which simplifies to \(m^2-2m-3=0\). The solutions are \(m=3\) and \(m=-1\), whose sum is \(2\).`,
  },
  {
    id: 20048,
    number: 48,
    division: "Alpha",
    topic: "Polar",
    difficulty: 3,
    methods: [],
    question: String.raw`Which Cartesian equation is equivalent to the polar equation \(r^2=4\cos(2\theta)\)?`,
    choices: [String.raw`\((x^2-y^2)^2=16(x^2+y^2)\)`, String.raw`\((x^2-y^2)^2=4(x^2+y^2)\)`, String.raw`\((x^2+y^2)^2=16(x^2-y^2)\)`, String.raw`\((x^2+y^2)^2=4(x^2-y^2)\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Multiply by \(r^2\): \(r^4=4r^2\cos(2\theta)\). Since \(r^2=x^2+y^2\) and \(r^2\cos(2\theta)=x^2-y^2\),
\[(x^2+y^2)^2=4(x^2-y^2).\]`,
  },
  {
    id: 20049,
    number: 49,
    division: "Alpha",
    topic: "Conic Sections",
    difficulty: 5,
    methods: [],
    question: String.raw`The hyperbola \(2x^2-7xy-22y^2=1\) has an asymptote of positive slope. Find its slope.`,
    choices: [String.raw`\(\frac12\)`, String.raw`\(\frac{11}{2}\)`, "2", String.raw`\(\frac2{11}\)`, "NOTA"],
    answer: "D",
    solution: String.raw`For an asymptote \(y=mx\), the quadratic part must vanish:
\[2-7m-22m^2=0=(2-11m)(1+2m).\]
The positive root is \(m=\frac2{11}\).`,
  },
  {
    id: 20050,
    number: 50,
    division: "Alpha",
    topic: "Functions",
    difficulty: 3,
    methods: [],
    question: String.raw`A graph is increasing and concave down, and it approaches the positive horizontal asymptote \(y=2\) from below as \(x\to\infty\). Which equation could represent the graph?`,
    illustration: {
      src: "/questions/alpha-50-graph.svg",
      alt: "An increasing, concave-down exponential curve that approaches y equals 2 from below.",
      width: 720,
      height: 360,
    },
    choices: [String.raw`\(y=2-4\left(\frac12\right)^x\)`, String.raw`\(y=2+4\left(\frac12\right)^x\)`, String.raw`\(y=-4+2\left(\frac12\right)^x\)`, String.raw`\(y=4\left(\frac12\right)^x-2\)`, "NOTA"],
    answer: "A",
    solution: String.raw`A positive horizontal asymptote requires a positive vertical shift. To be increasing toward that asymptote from below, the decaying exponential term must be subtracted. Thus \(y=2-4(1/2)^x\).`,
  },
  {
    id: 20051,
    number: 51,
    division: "Alpha",
    topic: "Conic Sections",
    difficulty: 5,
    methods: [],
    question: String.raw`The eccentricity of a hyperbola is the ratio of the distance between its foci to the distance between its vertices. Find the eccentricity of \(2x^2-7xy-22y^2=1\), given that its transverse axis has negative slope.`,
    choices: [String.raw`\(\frac54\)`, String.raw`\(\sqrt{10}\)`, String.raw`\(\frac{\sqrt{10}}3\)`, String.raw`\(\frac53\)`, "NOTA"],
    answer: "C",
    solution: String.raw`Write the quadratic form as
\[\begin{pmatrix}x&y\end{pmatrix}
\begin{pmatrix}2&-7/2\\-7/2&-22\end{pmatrix}
\begin{pmatrix}x\\y\end{pmatrix}=1.\]
The matrix has eigenvalues \(5/2\) and \(-45/2\). An eigenvector for \(5/2\) satisfies \(x=-7y\), so this eigendirection has negative slope and is therefore the given transverse axis. Rotating to coordinates \((u,v)\) along the two eigendirections gives
\[\frac52u^2-\frac{45}{2}v^2=1,
\qquad
\frac{u^2}{2/5}-\frac{v^2}{2/45}=1.\]
Thus \(a^2=2/5\) and \(b^2=2/45\). For a hyperbola, \(c^2=a^2+b^2\), where the foci are \(2c\) apart and the vertices are \(2a\) apart. Therefore
\[e=\frac{2c}{2a}=\frac ca
=\sqrt{1+\frac{b^2}{a^2}}
=\sqrt{1+\frac19}
=\boxed{\frac{\sqrt{10}}3}.\]`,
  },
  {
    id: 20052,
    number: 52,
    division: "Alpha",
    topic: "Functions",
    difficulty: 2,
    methods: [],
    question: String.raw`Which statement is true about \(f(x)=-2x^2+8x\)?`,
    choices: [String.raw`It is increasing on \((2,\infty)\).`, String.raw`Its range is \([8,\infty)\).`, String.raw`Its \(x\)-intercepts are \(x=0\) and \(x=8\).`, "It is bounded.", "NOTA"],
    answer: "E",
    solution: String.raw`Completing the square gives \(f(x)=-2(x-2)^2+8\). The function decreases on \((2,\infty)\), has range \(( -\infty,8]\), has \(x\)-intercepts \(0\) and \(4\), and is unbounded below. Therefore none of the first four statements is true.`,
  },
  {
    id: 20053,
    number: 53,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 3,
    methods: [],
    question: String.raw`Which of the following statements are true?
\[\begin{aligned}
1.&\ \text{For real }a,b,\ \cos^{-1}(a)<\cos^{-1}(b)\Rightarrow a<b.\\
2.&\ \sin\!\left(2\cos^{-1}\!\frac35\right)=\frac{24}{25}.\\
3.&\ \sin(\sin^{-1}x+\cos^{-1}x)=1\quad\text{for }-1\le x\le1.\\
4.&\ \text{The range of }y=\tan^{-1}x\text{ is }\left[-\frac\pi2,\frac\pi2\right].
\end{aligned}\]`,
    choices: ["1, 2, 3", "1, 3, 4", "1, 2, 4", "2, 3, 4", "NOTA"],
    answer: "E",
    solution: String.raw`Statement 1 is false because arccosine is decreasing. Statement 2 is true since \(2(3/5)(4/5)=24/25\). Statement 3 is true because \(\sin^{-1}x+\cos^{-1}x=\pi/2\). Statement 4 is false because the endpoints are not included. Thus only statements 2 and 3 are true, so the answer is NOTA.`,
  },
  {
    id: 20054,
    number: 54,
    division: "Alpha",
    topic: "Logs and Exponents",
    difficulty: 5,
    methods: [],
    question: String.raw`Let
\[\begin{aligned}
f(x)={}&\log_8x\log_{16}x\log_{128}x+\log_4x\log_{16}x\log_{128}x\\
&+\log_4x\log_8x\log_{128}x+\log_4x\log_8x\log_{16}x,
\end{aligned}\]
and \(g(x)=\log_4(x^2)\log_8(x^2)\log_{16}(x^2)\log_{128}(x^2)\). How many real \(x\) satisfy \(f(x)=g(x)\)?`,
    choices: ["0", "1", "2", "3", "NOTA"],
    answer: "C",
    solution: String.raw`Let \(a=\log_4x\), \(b=\log_8x\), \(c=\log_{16}x\), and \(d=\log_{128}x\). Then \(g(x)=16abcd\). The value \(x=1\) is one solution. For \(x\ne1\), divide by \(abcd\) to obtain
\[\frac1a+\frac1b+\frac1c+\frac1d=16.\]
By change of base, the left side is \(\log_x(4\cdot8\cdot16\cdot128)=\log_x(2^{16})\). Thus \(x^{16}=2^{16}\), and the domain requires \(x>0\), so \(x=2\). There are \(2\) real solutions.`,
  },
  {
    id: 20055,
    number: 55,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 4,
    methods: ["Product-to-Sum Identity"],
    question: String.raw`If
\[\cos\!\left(\frac{11\pi}{12}\right)\cos\!\left(\frac\pi{12}\right)\sin\!\left(\frac{5\pi}{12}\right)\sin\!\left(\frac{7\pi}{12}\right)=-\frac{a+b\sqrt3}{c}\]
for positive integers \(a,b,c\), find \(a+b+c\).`,
    choices: ["21", "23", "25", "27", "NOTA"],
    answer: "D",
    solution: String.raw`Using product-to-sum identities,
\[\cos\!\left(\frac{11\pi}{12}\right)\cos\!\left(\frac\pi{12}\right)=-\frac{\sqrt3+2}{4}\]
and
\[\sin\!\left(\frac{5\pi}{12}\right)\sin\!\left(\frac{7\pi}{12}\right)=\frac{\sqrt3+2}{4}.\]
Their product is \(-\frac{7+4\sqrt3}{16}\), so \(a+b+c=7+4+16=27\).`,
  },
  {
    id: 20056,
    number: 56,
    division: "Alpha",
    topic: "Analytic Geometry",
    difficulty: 5,
    methods: [],
    question: String.raw`Points \(A=(0,0)\) and \(B=(7,0)\). There is a unique point \(C\) such that \((4,2)\) is the incenter of \(\triangle ABC\). Find the sum of the coordinates of \(C\).`,
    choices: [String.raw`\(\frac{21}{2}\)`, "11", "8", String.raw`\(\frac{15}{2}\)`, "NOTA"],
    answer: "A",
    solution: String.raw`Let \(I=(4,2)\). Since the distance from \(I\) to \(AB\) is \(2\), the other two sides are tangent to the circle centered at \(I\) with radius \(2\). The nonhorizontal tangent through \(A\) is \(y=\frac43x\), and the nonhorizontal tangent through \(B\) is \(y=-\frac{12}{5}(x-7)\). Their intersection is \(C=(9/2,6)\), whose coordinate sum is \(21/2\).`,
  },
  {
    id: 20057,
    number: 57,
    division: "Alpha",
    topic: "Analytic Geometry",
    difficulty: 5,
    methods: ["Point-to-Line Distance Formula"],
    question: String.raw`Let \(S\) be the set of points that are twice as far from the line \(3x+4y=1\) as they are from the point \((5,-1)\). Find the area enclosed by \(S\).`,
    choices: [String.raw`\(\frac{2\sqrt3}{3}\pi\)`, String.raw`\(\frac{3\sqrt3}{4}\pi\)`, String.raw`\(\frac{\sqrt3}{2}\pi\)`, String.raw`\(\frac{8\sqrt3}{9}\pi\)`, "NOTA"],
    answer: "D",
    solution: String.raw`Rigidly move the plane so the focus is \((0,0)\) and the directrix is \(x=2\); distances and area are unchanged. The condition is
\[|x-2|=2\sqrt{x^2+y^2}.\]
Squaring and simplifying gives \(3x^2+4x+4y^2=4\), or
\[\frac{(x+2/3)^2}{(4/3)^2}+\frac{y^2}{(2/\sqrt3)^2}=1.\]
Thus the area is \(\pi(4/3)(2/\sqrt3)=\frac{8\sqrt3}{9}\pi\).`,
  },

  // ID 20058 / question 58 is reserved for source question 28,
  // which was not included in the supplied screenshots.

  {
    id: 20058,
    number: 58,
    division: "Alpha",
    topic: "Trigonometry",
    difficulty: 3,
    methods: [],
    question: String.raw`Let the domain of \(f(x)=\tan\!\left(\arcsin\!\left(\frac{x}{2}+4\right)\right)\) be \(p<x<q\), where \(p,q\) are integers. Find \(p^2+q^2\).`,
    choices: ["136", "144", "160", "164", "NOTA"],
    answer: "A",
    solution: String.raw`For arcsine, \(-1\le\frac{x}{2}+4\le1\), giving \(-10\le x\le-6\). At \(x=-10\) and \(x=-6\), the arcsine is \(\pm\pi/2\), where tangent is undefined. Hence the domain is \(-10<x<-6\), so \(p^2+q^2=100+36=136\).`,
  },
  {
    id: 20059,
    number: 59,
    division: "Alpha",
    topic: "Geometry",
    difficulty: 3,
    methods: ["Law of Cosines"],
    question: String.raw`Triangle \(ABC\) has side lengths \(a=7\), \(b=4\), and \(c=5\), opposite angles \(A,B,C\), respectively. Find
\[2ab\cos C+2ac\cos B+2bc\cos A.\]`,
    choices: ["68", "74", "84", "90", "NOTA"],
    answer: "D",
    solution: String.raw`Applying the Law of Cosines to all three angles gives
\[\begin{aligned}
c^2&=a^2+b^2-2ab\cos C,\\
b^2&=a^2+c^2-2ac\cos B,\\
a^2&=b^2+c^2-2bc\cos A.
\end{aligned}\]
Adding and simplifying yields
\[2ab\cos C+2ac\cos B+2bc\cos A=a^2+b^2+c^2=7^2+4^2+5^2=90.\]`,
  },
  {
     id: 20061,
     number: 60,
     division: "Alpha",
     topic: "Functions",
     difficulty: 1,
     methods: [],
     question: String.raw`Define \(P(x) = x^2 - \frac{3}{x-1}\) and \(D(x) = x + 1\). What is the value of \((P \circ D)(-3)\)?`,
     choices: ["3", "5", "7", "9", "NOTA"],
     answer: "B",
     solution: String.raw`Evaluate the inner function first: \(D(-3) = -3 + 1 = -2\). Then
  \[(P \circ D)(-3) = P(-2) = (-2)^2 - \frac{3}{-2-1} = 4 + 1 = \boxed{5}.\]`,
  },
  
  
  
  
  {
     id: 20062,
     number: 61,
     division: "Alpha",
     topic: "Limits",
     difficulty: 1,
     methods: [],
     question: String.raw`Define \(P(x) = x^2 - \frac{3}{x-1}\) and \(D(x) = x + 1\). Evaluate \(\displaystyle\lim_{x \to -3}[P(x)]^{\frac{1}{2}}\).`,
     choices: [String.raw`\(\sqrt{3}\)`, String.raw`\(2\sqrt{3}\)`, String.raw`\(\sqrt{39}\)`, String.raw`\(\frac{\sqrt{39}}{2}\)`, "NOTA"],
     answer: "D",
     solution: String.raw`By direct substitution:
  \[\lim_{x \to -3}[P(x)]^{\frac{1}{2}} = \left((-3)^2 - \frac{3}{-3-1}\right)^{\!\frac{1}{2}} = \left(9 + \frac{3}{4}\right)^{\!\frac{1}{2}} = \sqrt{\frac{39}{4}} = \boxed{\frac{\sqrt{39}}{2}}.\]`,
  },
  
  
  
  
  {
     id: 20063,
     number: 62,
     division: "Alpha",
     topic: "Probability",
     difficulty: 1,
     methods: [],
     question: String.raw`The surface temperature on Mars has a uniform probability distribution between \(-150\) degrees Celsius and \(20\) degrees Celsius. Find the probability that the surface temperature on Mars is greater than \(-40\) degrees Celsius and at most \(10\) degrees Celsius.`,
     choices: [String.raw`\(\frac{3}{17}\)`, String.raw`\(\frac{5}{17}\)`, String.raw`\(\frac{7}{17}\)`, String.raw`\(\frac{9}{17}\)`, "NOTA"],
     answer: "B",
     solution: String.raw`The total range is \(20 - (-150) = 170\). The favorable interval \((-40,\, 10]\) has length
  \(10 - (-40) = 50\). The probability is
  \[\frac{50}{170} = \boxed{\frac{5}{17}}.\]`,
  },
  
  
  
  
  {
     id: 20064,
     number: 63,
     division: "Alpha",
     topic: "Vectors",
     difficulty: 1,
     methods: [],
     question: String.raw`Mars is home to the tallest mountain in our Solar System: Olympus Mons. Marvin the Martian wants to climb Olympus Mons. He decides to use a vector to determine his path. If he needs to travel \(610\) km at a direction of \(30\) degrees north of east, what is his path's vector with coordinates in km?`,
     choices: [String.raw`\(\langle 305,\, 305\sqrt{3}\rangle\)`, String.raw`\(\langle 305\sqrt{3},\, 305\rangle\)`, String.raw`\(\langle 305\sqrt{2},\, 305\rangle\)`, String.raw`\(\langle 305,\, 305\rangle\)`, "NOTA"],
     answer: "B",
     solution: String.raw`The east (horizontal) component is \(610\cos(30^\circ) = 610\cdot\frac{\sqrt{3}}{2} = 305\sqrt{3}\)
  and the north (vertical) component is \(610\sin(30^\circ) = 610\cdot\frac{1}{2} = 305\).
  The vector is \(\boxed{\langle 305\sqrt{3},\, 305\rangle}\) km.`,
  },
  
  
  
  
  {
     id: 20065,
     number: 64,
     division: "Alpha",
     topic: "Parametric",
     difficulty: 3,
     methods: [],
     question: String.raw`Marvin starts at the origin, travels to the point \(\left(\frac{\sqrt{3}}{2},\frac{1}{2}\right)\) in a straight line, moves along the curve given by \(x(t)=\cos t\) and \(y(t)=\sin t\) for \(\frac{\pi}{6}\le t\le\frac{\pi}{4}\), then returns to the origin in a straight line. Help Marvin find the area bounded by his path.`,
     choices: [String.raw`\(\frac{\pi}{36}\)`, String.raw`\(\frac{\pi}{24}\)`, String.raw`\(\frac{\pi}{15}\)`, String.raw`\(\frac{\pi}{12}\)`, "NOTA"],
     answer: "B",
     solution: String.raw`The path encloses a circular sector of radius \(r = 1\) and central angle
  \(\frac{\pi}{4} - \frac{\pi}{6} = \frac{\pi}{12}\) (which is \(15^\circ\)).
  The area of the sector is
  \[\frac{15}{360}\pi(1)^2 = \frac{\pi}{24}.\]
  The enclosed area is \(\boxed{\dfrac{\pi}{24}}\).`,
  },
  
  
  
  
  {
     id: 20066,
     number: 65,
     division: "Alpha",
     topic: "Conic Sections",
     difficulty: 2,
     methods: ["Eccentricity"],
     question: String.raw`Mars has the largest dust storms in the Solar System. The seasons are extreme because its elliptical orbital path around the Sun is more elongated than most other planets. If the location of Mars follows the path given by \(\dfrac{x^2}{10000}+\dfrac{y^2}{9919}=1\), what is the eccentricity of Mars?`,
     choices: [String.raw`\(\frac{9}{100}\)`, String.raw`\(\frac{9}{50}\)`, String.raw`\(\frac{9\sqrt{2}}{100}\)`, String.raw`\(\frac{9\sqrt{2}}{50}\)`, "NOTA"],
     answer: "A",
     solution: String.raw`Here \(a^2 = 10000\) and \(b^2 = 9919\), so \(c^2 = a^2 - b^2 = 81\), giving \(c = 9\).
  Since \(a = \sqrt{10000} = 100\), the eccentricity is
  \[e = \frac{c}{a} = \frac{9}{100} = \boxed{\frac{9}{100}}.\]`,
  },
  
  
  
  
  {
     id: 20067,
     number: 66,
     division: "Alpha",
     topic: "Polar",
     difficulty: 1,
     methods: [],
     question: String.raw`Pieces of the Martian atmosphere have been crash-landing on Earth for years. One scientist plotted the location of a Martian rock in polar coordinates that is in Quadrant II of the coordinate plane. Which point could the scientist have plotted?`,
     choices: [String.raw`\(\left(-6,\,-\frac{4\pi}{3}\right)\)`, String.raw`\(\left(-6,\,-\frac{11\pi}{3}\right)\)`, String.raw`\(\left(6,\,\frac{5\pi}{3}\right)\)`, String.raw`\(\left(-6,\,-\frac{7\pi}{3}\right)\)`, "NOTA"],
     answer: "D",
     solution: String.raw`A negative radius plots the point in the opposing quadrant.
  \(-\frac{4\pi}{3}\) terminates in Quadrant II, so \(r=-6\) places the point in Quadrant IV.
  \(-\frac{11\pi}{3}\) terminates in Quadrant I, so \(r=-6\) places it in Quadrant III.
  \(\frac{5\pi}{3}\) terminates in Quadrant IV, so \(r=6\) gives Quadrant IV.
  \(-\frac{7\pi}{3}\) terminates in Quadrant IV, so \(r=-6\) places the point in \(\boxed{\text{Quadrant II}}\), as desired.`,
  },
  
  
  
  
  {
     id: 20068,
     number: 67,
     division: "Alpha",
     topic: "Sequences and Series",
     difficulty: 2,
     methods: ["Geometric Sequence"],
     question: String.raw`Mars does not have nearly the same gravitational pull as Earth does. You can jump nearly three times as high on Mars as you can here. Marvin the Martian is jumping whose heights form a geometric progression with \(6\) feet and \(4\) feet as the first two terms. What is the height of his tenth jump in inches?`,
     choices: [String.raw`\(\frac{2048}{729}\)`, String.raw`\(\frac{1024}{729}\)`, String.raw`\(\frac{4096}{2187}\)`, String.raw`\(\frac{2048}{2187}\)`, "NOTA"],
     answer: "C",
     solution: String.raw`The common ratio is \(r = \frac{4}{6} = \frac{2}{3}\). Converting the first term to inches:
  \(6\text{ ft} = 72\text{ in}\). The tenth term is
  \[72\cdot\left(\frac{2}{3}\right)^{\!9} = 72\cdot\frac{2^9}{3^9} = 8\cdot\frac{2^9}{3^7} = \frac{2^{12}}{3^7} = \boxed{\frac{4096}{2187}}\text{ inches}.\]`,
  },
  
  
  
  
  {
     id: 20069,
     number: 68,
     division: "Alpha",
     topic: "Probability",
     difficulty: 2,
     methods: ["Conditional Probability"],
     question: String.raw`In the year 2045, space travel will become affordable for most families. In a survey, \(25\) students will travel to Mars, \(24\) students will travel to Jupiter, and \(10\) students will travel to Venus. \(3\) students will travel to both Mars and Venus, \(4\) students will travel to both Venus and Jupiter, and \(5\) students will travel to both Jupiter and Mars. \(2\) students will travel to all \(3\). Find the probability that a student chosen randomly from the survey will travel to Mars given that they will travel to Venus.`,
     choices: ["0.2", "0.25", "0.28", "0.3", "NOTA"],
     answer: "D",
     solution: String.raw`There are \(10\) students traveling to Venus and \(3\) traveling to both Mars and Venus.
  By the definition of conditional probability:
  \[P(\text{Mars}\mid\text{Venus}) = \frac{P(\text{Mars and Venus})}{P(\text{Venus})} = \frac{3}{10} = \boxed{0.3}.\]`,
  },
  
  
  
  
  {
     id: 20070,
     number: 69,
     division: "Alpha",
     topic: "Sequences and Series",
     difficulty: 1,
     methods: [],
     question: String.raw`Marvin the Martian is interested in the series represented by \(\displaystyle\sum_{i=1}^{\infty} i^2\). Which statement is true about Marvin's series?`,
     choices: ["Converges to 0", "Converges to 100", String.raw`Converges to \(\infty\)`, "Diverges", "NOTA"],
     answer: "D",
     solution: String.raw`The series \(\sum_{i=1}^{\infty} i^2 = 1 + 4 + 9 + 16 + \cdots\). Since the terms \(i^2\)
  increase without bound and do not approach \(0\), the series \(\boxed{\text{diverges}}\)
  by the Divergence Test.`,
  },
  
  
  
  
  {
     id: 20071,
     number: 70,
     division: "Alpha",
     topic: "Limits",
     difficulty: 2,
     methods: [],
     question: String.raw`Use the graph of \(f(x)\) below to help Marvin find all values of \(k\) on \([-3,4]\) such that \(\displaystyle\lim_{x\to k} f(x)\) does not exist. Assume that all \(x\)-values where the limit does not exist are integers. [Graph shows labeled points: \((-2,2)\), \((-2,1)\), \((1,2)\), \((2,3)\), \((2,1)\), \((2,-1)\), \((3,2)\), \((3,0)\) with open and closed circles indicating jump discontinuities at \(x=2\) and \(x=3\).]`,
     illustration: {
       src: "/questions/alpha-20071-limit-graph.svg",
       alt: "Graph of a piecewise function with jump discontinuities at x equals 2 and x equals 3.",
       width: 720,
       height: 430,
     },
     choices: [String.raw`\(x=2\) only`, String.raw`\(x=3\) only`, String.raw`\(x=2,3\) only`, String.raw`\(x=-2,1,2,3\) only`, "NOTA"],
     answer: "C",
     solution: String.raw`The limit does not exist at jump discontinuities. From the graph, jump discontinuities occur
  at \(x=2\) (left-hand limit \(\neq\) right-hand limit) and at \(x=3\) (same reason).
  Therefore the limit fails to exist at \(\boxed{x=2\text{ and }x=3}\).`,
  },
  
  
  
  
  {
     id: 20072,
     number: 71,
     division: "Alpha",
     topic: "Statistics",
     difficulty: 1,
     methods: ["Z-Score"],
     question: String.raw`Mars has an average of \(10\) dust storms per year with a standard deviation of \(3\) dust storms. Calculate the \(z\)-score for the year 2045 when there will be only \(4\) dust storms.`,
     choices: ["-18", "-3", "-2", "-1.8", "NOTA"],
     answer: "C",
     solution: String.raw`The \(z\)-score formula is \(z = \dfrac{x-\mu}{\sigma}\). For \(x=4\), \(\mu=10\), \(\sigma=3\):
  \[z = \frac{4-10}{3} = \frac{-6}{3} = \boxed{-2}.\]`,
  },
  
  
  
  
  {
     id: 20073,
     number: 72,
     division: "Alpha",
     topic: "Limits",
     difficulty: 2,
     methods: [],
     question: String.raw`Determine \(\displaystyle\lim_{x\to\infty}\frac{\sin\!\left(\frac{x}{2}\pi\right)}{x^2-4}\).`,
     choices: ["DNE", "0", "2", "4", "NOTA"],
     answer: "B",
     solution: String.raw`Although \(\sin\!\left(\frac{x}{2}\pi\right)\) oscillates, its values satisfy
  \(-1\le\sin\!\left(\frac{x}{2}\pi\right)\le 1\). The denominator \(x^2-4\to\infty\) as
  \(x\to\infty\). Therefore
  \[\lim_{x\to\infty}\frac{\sin\!\left(\frac{x}{2}\pi\right)}{x^2-4} = \boxed{0}.\]`,
  },
  
  
  
  
  {
     id: 20074,
     number: 73,
     division: "Alpha",
     topic: "Binomial Expansion",
     difficulty: 2,
     methods: ["Binomial Theorem"],
     question: String.raw`Find the coefficient of the \(x^3y^2\) term of the binomial expansion of \(\left(\frac{1}{2}x - 3y\right)^5\).`,
     choices: [String.raw`\(\frac{45}{2}\)`, String.raw`\(-\frac{135}{2}\)`, String.raw`\(\frac{45}{4}\)`, String.raw`\(-\frac{135}{4}\)`, "NOTA"],
     answer: "C",
     solution: String.raw`By the Binomial Theorem, the \(x^3y^2\) term is
  \[\binom{5}{2}\!\left(\frac{1}{2}x\right)^{\!3}(-3y)^2 = 10\cdot\frac{x^3}{8}\cdot 9y^2 = \frac{90}{8}x^3y^2 = \frac{45}{4}x^3y^2.\]
  The coefficient is \(\boxed{\dfrac{45}{4}}\).`,
  },
  
  
  
  
  {
     id: 20075,
     number: 74,
     division: "Alpha",
     topic: "Trigonometry",
     difficulty: 2,
     methods: ["Law of Cosines"],
     question: String.raw`Marvin is trying to triangulate his position on Mars. He has a labeled triangle \(\Delta MAR\). If \(m\angle A = \frac{2\pi}{3}\), \(MA = 3\), and \(AR = 5\), what is the length \(MR\)?`,
     choices: ["7", String.raw`\(7\sqrt{2}\)`, String.raw`\(7\sqrt{3}\)`, String.raw`\(5\sqrt{3}\)`, "NOTA"],
     answer: "A",
     solution: String.raw`Apply the Law of Cosines with the angle at \(A\):
  \[MR^2 = MA^2 + AR^2 - 2\cdot MA\cdot AR\cdot\cos\!\left(\frac{2\pi}{3}\right) = 9+25-30\!\left(-\frac{1}{2}\right) = 34+15 = 49.\]
  Therefore \(MR = \boxed{7}\).`,
  },
  
  
  
  
  {
     id: 20076,
     number: 75,
     division: "Alpha",
     topic: "Vectors",
     difficulty: 3,
     methods: ["Dot Product"],
     question: String.raw`Marvin found the angle \(\theta\) between vectors: \(\mathbf{m} = \langle -10, 8\rangle\) and \(\mathbf{r} = \left\langle\frac{1}{2},-4\right\rangle\). Find \(\sec\theta\).`,
     choices: [String.raw`\(-\frac{\sqrt{697}}{37}\)`, String.raw`\(-\frac{37\sqrt{697}}{697}\)`, String.raw`\(-\frac{\sqrt{41}}{37}\)`, String.raw`\(-\frac{7\sqrt{41}}{41}\)`, "NOTA"],
     answer: "E",
     solution: String.raw`Compute the dot product: \(\mathbf{m}\cdot\mathbf{r} = (-10)\!\left(\frac{1}{2}\right)+(8)(-4) = -5-32 = -37\).
  The magnitudes are \(\|\mathbf{m}\| = \sqrt{100+64} = 2\sqrt{41}\) and \(\|\mathbf{r}\| = \sqrt{\frac{1}{4}+16} = \frac{\sqrt{65}}{2}\).
  Then \(\cos\theta = \dfrac{-37}{2\sqrt{41}\cdot\frac{\sqrt{65}}{2}} = \dfrac{-37}{\sqrt{2665}}\),
  so \(\sec\theta = -\dfrac{\sqrt{2665}}{37}\), which is NOTA.`,
  },
  
  
  
  
  {
     id: 20077,
     number: 76,
     division: "Alpha",
     topic: "Polar",
     difficulty: 2,
     methods: [],
     question: String.raw`Marvin wants to give his long-lost love a polar rose with \(8\) petals on it. Which of the following polar equations could satisfy his requirements?`,
     choices: [String.raw`\(r = 8\cos\theta\)`, String.raw`\(r = -8\cos^2\theta\)`, String.raw`\(r = 2\cos 4\theta\)`, String.raw`\(r = -2\cos 8\theta\)`, "NOTA"],
     answer: "C",
     solution: String.raw`For the polar rose \(r = a\cos(n\theta)\) with \(n\) a positive integer, the number of
  petals is \(2n\) when \(n\) is even, and \(n\) when \(n\) is odd.
  Choice C has \(n=4\) (even), giving \(2\times 4 = \boxed{8}\) petals.`,
  },
  
  
  
  
  {
     id: 20078,
     number: 77,
     division: "Alpha",
     topic: "Derivatives",
     difficulty: 3,
     methods: ["Power Rule"],
     question: String.raw`Marvin the Martian wants to calculate an equation of a line that will be tangent to the Sun. The path of his rocket from his location fired to the Sun is represented by \(y = 3x^2 - 3x + 2019\). Find the equation of the tangent line to that path when \(x=2\).`,
     choices: [String.raw`\(y + 2025 = 9(x-2)\)`, String.raw`\(y + 2025 = \frac{1}{9}(x-2)\)`, String.raw`\(y - 2025 = 9(x-2)\)`, String.raw`\(y - 2025 = \frac{1}{9}(x-2)\)`, "NOTA"],
     answer: "C",
     solution: String.raw`Using the limit definition, the slope at \(x=2\) is
  \[\lim_{h\to 0}\frac{3(2+h)^2-3(2+h)+2019-(3(4)-6+2019)}{h} = \lim_{h\to 0}\frac{9h+3h^2}{h} = 9.\]
  The point on the curve: \(y(2) = 12-6+2019 = 2025\). Point-slope form gives
  \[\boxed{y-2025 = 9(x-2)}.\]`,
  },
  
  
  
  
  {
     id: 20079,
     number: 78,
     division: "Alpha",
     topic: "Sequences and Series",
     difficulty: 2,
     methods: ["Geometric Series"],
     question: String.raw`Marvin finds the following geometric series carved in a rock on Mars: \(-2+4-8+\cdots+1024\). Write the series in summation notation and find its sum.`,
     choices: [String.raw`\(\sum_{i=2}^{10}[(-1)^{i+1}(2)^{i-1}]\); Sum \(=-342\)`, String.raw`\(\sum_{i=2}^{11}[(-1)^{i+1}(2)^{i-1}]\); Sum \(=682\)`, String.raw`\(\sum_{i=2}^{10}[(-1)^{i+1}(2)^{i}]\); Sum \(=-684\)`, String.raw`\(\sum_{i=2}^{11}[(-1)^{i+1}(2)^{2i}]\); Sum \(=1364\)`, "NOTA"],
     answer: "B",
     solution: String.raw`The sequence has first term \(-2\), common ratio \(r = -2\), and last term \(1024\).
  The general term is \((-2)^n\). Solving \((-2)^n = 1024 = 2^{10}\) gives \(n = 10\).
  The summation \(\sum_{i=2}^{11}[(-1)^{i+1}(2)^{i-1}]\) correctly expands to \(-2+4-8+\cdots+1024\).
  The finite geometric series sum is
  \[S = \frac{a(r^n-1)}{r-1} = \frac{-2((-2)^{10}-1)}{-2-1} = \frac{-2(1023)}{-3} = \boxed{682}.\]`,
  },
  
  
  
  
  {
     id: 20080,
     number: 79,
     division: "Alpha",
     topic: "Parametric",
     difficulty: 3,
     methods: [],
     question: String.raw`Marvin the Martian is traveling along the circular path shown on the coordinate plane. Which set of parametric equations could represent this graph of his path? Each square represents one square unit, for \(t\) in radians. [Graph shows a circle of radius \(2\) centered at the origin, starting at \((-2,0)\) when \(t=0\), at \((0,-2)\) when \(t=\frac{\pi}{2}\), at \((2,0)\) when \(t=\pi\), and at \((0,2)\) when \(t=\frac{3\pi}{2}\).]`,
     choices: [String.raw`\(x(t)=2\cos t,\ y(t)=2\sin t\)`, String.raw`\(x(t)=\cos 2t,\ y(t)=\sin 2t\)`, String.raw`\(x(t)=2\sin t,\ y(t)=2\sin t\)`, String.raw`\(x(t)=\sin 2t,\ y(t)=\cos 2t\)`, "NOTA"],
     answer: "E",
     solution: String.raw`When \(t=0\), the path begins at \((-2,0)\). Testing each choice at \(t=0\):
  A gives \((2,0)\), B gives \((1,0)\), C gives \((0,0)\), D gives \((0,1)\) --- all wrong.
  A valid parametrization is \(x(t)=-2\cos t\), \(y(t)=-2\sin t\), which is not a choice.
  The answer is \(\boxed{\text{NOTA}}\).`,
  },
  
  
  
  
  {
     id: 20081,
     number: 80,
     division: "Alpha",
     topic: "Vectors",
     difficulty: 2,
     methods: ["Dot Product"],
     question: String.raw`Marvin the Martian's favorite baseball team is the Los Angeles Dodgers. Joc Pederson, Left Fielder for the Los Angeles Dodgers, spots a fly ball coming to his region of the baseball outfield. He begins his motion towards the ball at a vector of: \(\langle 100, 5, 2\rangle\). Which of the following vectors would be perpendicular to his motion vector?`,
     choices: [String.raw`\(\langle 2, 20, 50\rangle\)`, String.raw`\(\langle -2, -20, 50\rangle\)`, String.raw`\(\langle 2, -20, -50\rangle\)`, String.raw`\(\langle 2, -20, 50\rangle\)`, "NOTA"],
     answer: "C",
     solution: String.raw`Two vectors are perpendicular when their dot product is zero.
  Testing choice C: \(\langle100,5,2\rangle\cdot\langle2,-20,-50\rangle = 200-100-100 = \boxed{0}\).
  Therefore \(\langle 2,-20,-50\rangle\) is perpendicular to Joc's vector.`,
  },
  
  
  
  
  
  
  {
     id: 20083,
     number: 81,
     division: "Alpha",
     topic: "Polar",
     difficulty: 2,
     methods: [],
     question: String.raw`Marvin is lost on his planet. He tried to write his location using polar and rectangular coordinates in three different ways: \(P\!\left(-24,-\frac{2\pi}{3}\right)\) in polar, \(Q\!\left(12,-12\sqrt{3}\right)\) in rectangular, \(R\!\left(24,\frac{199\pi}{3}\right)\) in polar. Which statement is true about these three points?`,
     choices: [String.raw`Only \(P\) and \(Q\) are equivalent`, String.raw`Only \(P\) and \(R\) are equivalent`, String.raw`Only \(Q\) and \(R\) are equivalent`, "None are equivalent", "NOTA"],
     answer: "B",
     solution: String.raw`Convert \(P\): \(x=-24\cos\!\left(-\frac{2\pi}{3}\right)=12\) and \(y=-24\sin\!\left(-\frac{2\pi}{3}\right)=12\sqrt{3}\), so \(P=(12,12\sqrt{3})\neq Q\).
  Convert \(R\): \(\frac{199\pi}{3}=66\pi+\frac{\pi}{3}\) is coterminal with \(\frac{\pi}{3}\),
  so \(x=24\cos\!\left(\frac{\pi}{3}\right)=12\) and \(y=24\sin\!\left(\frac{\pi}{3}\right)=12\sqrt{3}\).
  Thus \(R=(12,12\sqrt{3})=P\), so only \(\boxed{P\text{ and }R}\) are equivalent.`,
  },
  
  
  
  
  {
     id: 20084,
     number: 82,
     division: "Alpha",
     topic: "Polar",
     difficulty: 3,
     methods: [],
     question: String.raw`Convert the following equation from polar form to rectangular form: \(r^4 = 16\csc 4\theta\).`,
     choices: [String.raw`\(xy(x^2-y^2)=4\)`, String.raw`\(xy(x^2+y^2)=4\)`, String.raw`\(xy(x^2-y^2)=2\)`, String.raw`\((x+y)(x^2-y^2)=4\)`, "NOTA"],
     answer: "A",
     solution: String.raw`Multiply both sides by \(\sin(4\theta)\): \(r^4\sin(4\theta)=16\).
  Expand using double-angle identities:
  \[r^4\cdot 2\sin(2\theta)\cos(2\theta) = r^4\cdot 4\sin\theta\cos\theta(2\cos^2\theta-1) = 16.\]
  Writing \(r\sin\theta=y\) and \(r\cos\theta=x\):
  \[4(yx)(2x^2-(x^2+y^2))=16 \implies 4xy(x^2-y^2)=16 \implies \boxed{xy(x^2-y^2)=4}.\]`,
  },
  
  
  
  
  {
     id: 20085,
     number: 83,
     division: "Alpha",
     topic: "Sequences and Series",
     difficulty: 4,
     methods: ["Euler's Formula"],
     question: String.raw`The value of \(\displaystyle\sum_{n=0}^{\infty}\frac{\cos(n)}{2^n}\) can be expressed as \(\dfrac{a-b\cos(1)}{c-d\cos(1)}\), where \(a\), \(b\), \(c\), and \(d\) are positive integers that do not all share a common prime factor. Find \(a+b+c+d\).`,
     choices: ["12", "15", "16", "18", "NOTA"],
     answer: "B",
     solution: String.raw`Since \(e^{i\theta}=\cos\theta+i\sin\theta\), we have \(\cos(n)=\text{Re}(e^{in})\). Thus
  \[\sum_{n=0}^{\infty}\frac{\cos(n)}{2^n}=\text{Re}\!\left(\sum_{n=0}^{\infty}\frac{e^{in}}{2^n}\right)=\text{Re}\!\left(\frac{1}{1-\frac{e^i}{2}}\right).\]
  Writing \(\frac{1}{1-\frac{e^i}{2}}=\frac{2}{2-e^i}\) and rationalizing with the conjugate \(2-e^{-i}\):
  \[\text{Re}\!\left(\frac{2(2-e^{-i})}{(2-e^i)(2-e^{-i})}\right)=\frac{2(2-\cos(1))}{5-4\cos(1)}=\frac{4-2\cos(1)}{5-4\cos(1)}.\]
  So \(a=4\), \(b=2\), \(c=5\), \(d=4\), giving \(a+b+c+d=\boxed{15}\).`,
  },
  
  
  
  
  {
     id: 20086,
     number: 84,
     division: "Alpha",
     topic: "Conic Sections",
     difficulty: 5,
     methods: [],
     question: String.raw`Find the unique positive integer \(K\) such that the (non-degenerate) ellipse given by \(3x^2+4xy+6y^2-10x+12y+K=0\) has vertices with integer coordinates. (For convenience, the major axis of the conic has negative slope.)`,
     choices: ["10", "12", "15", "17", "NOTA"],
     answer: "D",
     solution: String.raw`Rewrite as \(3(x-h)^2+4(x-h)(y-k)+6(y-k)^2=F\) to find the center.
  Matching \(x\) and \(y\) coefficients: \(-6h-4k=-10\) and \(-4h-12k=12\). Solving gives \(h=3\), \(k=-2\).
  Shifting to the origin and using major axis direction \(x=-2y\) (slope \(-\tfrac{1}{2}\)):
  \[3(4y^2)+4(-2y)(y)+6y^2 = 12y^2-8y^2+6y^2 = 10y^2 = F.\]
  For integer vertex coordinates, \(F=10p^2\) for positive integer \(p\).
  Shifting back: \(K = 27-10p^2\). For \(p=1\): \(K = 27-10 = \boxed{17}\).`,
  },
  
  
  
  
  {
     id: 20087,
     number: 85,
     division: "Alpha",
     topic: "Sequences and Series",
     difficulty: 2,
     methods: [],
     question: String.raw`Consider the sequence defined recursively by \(A_1=100\), \(A_n=-6(A_{n-1})^3\) for \(n\ge 2\). Which of the following correctly describes this sequence?`,
     choices: ["Increasing", "Decreasing", "Monotonic", "Alternating", "NOTA"],
     answer: "D",
     solution: String.raw`The first few terms are \(A_1=100\), \(A_2=-6(100)^3=-6{,}000{,}000\), \(A_3>0\).
  Cubing preserves sign; multiplying by \(-6\) changes sign each iteration.
  Therefore the sequence is \(\boxed{\text{alternating}}\) in sign.`,
  },
  
  
  
  
  {
     id: 20088,
     number: 86,
     division: "Alpha",
     topic: "Probability",
     difficulty: 2,
     methods: ["Binomial Theorem"],
     question: String.raw`Marvin strikes out \(40\%\) of his attempts at the plate. What is the probability that he will strike out exactly \(3\) of his \(5\) attempts in his baseball game? Assume all the attempts are independent.`,
     choices: [String.raw`\(\frac{144}{625}\)`, String.raw`\(\frac{144}{1875}\)`, String.raw`\(\frac{432}{625}\)`, String.raw`\(\frac{481}{1875}\)`, "NOTA"],
     answer: "A",
     solution: String.raw`Using the binomial probability formula with \(n=5\), \(k=3\), \(p=\frac{2}{5}\):
  \[P(X=3)=\binom{5}{3}\!\left(\frac{2}{5}\right)^{\!3}\!\left(\frac{3}{5}\right)^{\!2}=10\cdot\frac{8}{125}\cdot\frac{9}{25}=\frac{720}{3125}=\boxed{\frac{144}{625}}.\]`,
  },
  
  
  
  
  {
     id: 20089,
     number: 87,
     division: "Alpha",
     topic: "Complex Numbers",
     difficulty: 5,
     methods: ["Roots of Unity"],
     question: String.raw`Did you know complex numbers are a favorite of Martians? Let \(z=e^{i\cdot\frac{2\pi}{7}}\), where \(i=\sqrt{-1}\). Define \(S=z+z^2+z^4\) and \(T=S^4\). What is the real part of \(T\)?`,
     choices: [String.raw`\(-\frac{1}{2}\)`, "0", String.raw`\(\frac{1}{8}\)`, String.raw`\(\frac{1}{2}\)`, "NOTA"],
     answer: "D",
     solution: String.raw`Note \(\bar{S}=\overline{z+z^2+z^4}=z^6+z^5+z^3\). Since \(z^7=1\),
  \(1+z+z^2+z^3+z^4+z^5+z^6=0\), so \(S+\bar{S}=-1\) and \(\text{Re}(S)=-\tfrac{1}{2}\).
  Also \(|S|^2=S\bar{S}=(z+z^2+z^4)(z^3+z^5+z^6)=3+(-1)=2\), so \(|S|=\sqrt{2}\).
  Write \(S=\sqrt{2}e^{i\theta}\) with \(\cos\theta=-\frac{1}{2\sqrt{2}}\).
  Then \(T=S^4=4e^{4i\theta}\) and \(\text{Re}(T)=4\cos(4\theta)\).
  Using double-angle identities: \(\cos(4\theta)=8\cos^4\theta-8\cos^2\theta+1=8\cdot\frac{1}{64}-8\cdot\frac{1}{8}+1=\frac{1}{8}\).
  Therefore \(\text{Re}(T)=4\cdot\frac{1}{8}=\boxed{\frac{1}{2}}\).`,
  },
  
  
  
  
  {
     id: 20090,
     number: 88,
     division: "Alpha",
     topic: "Trigonometry",
     difficulty: 4,
     methods: ["Sum-to-Product Identity"],
     question: String.raw`Marvin found the following trig equation inscribed on a rock on his favorite planet:
  \[\sin(2x)\cos(5x)+\cos(2x)\sin(5x)=\sin(10x)+\sin(4x).\]
  What is the sum of all solutions in radians on \([0,2\pi)\)?`,
     choices: [String.raw`\(6\pi\)`, String.raw`\(13\pi\)`, String.raw`\(16\pi\)`, String.raw`\(19\pi\)`, "NOTA"],
     answer: "D",
     solution: String.raw`By the angle-addition identity, the left side equals \(\sin(7x)\).
  By sum-to-product, the right side equals \(2\sin(7x)\cos(3x)\).
  So the equation becomes \(\sin(7x)=2\sin(7x)\cos(3x)\), i.e., \(\sin(7x)(1-2\cos(3x))=0\).
  \(\textbf{Case 1:}\) \(\sin(7x)=0\). Then \(x=\frac{\pi n}{7}\) for \(n\in\{0,1,\ldots,13\}\).
  Sum \(=\frac{\pi}{7}\cdot\frac{13\cdot14}{2}=13\pi\).
  \(\textbf{Case 2:}\) \(\cos(3x)=\frac{1}{2}\). Then \(x=\frac{\pi}{9}+\frac{2\pi k}{3}\) or \(x=\frac{5\pi}{9}+\frac{2\pi k}{3}\) for \(k\in\{0,1,2\}\).
  Sum \(=3\!\left(\frac{\pi}{9}+\frac{5\pi}{9}\right)+2\cdot\frac{2\pi}{3}(0+1+2)=2\pi+4\pi=6\pi\).
  Total sum \(=13\pi+6\pi=\boxed{19\pi}\).`,
  },
  
  
  
  

{
   id: 20091,
   number: 89,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: ["Trigonometric Identities"],
   question: String.raw`Simplify \(\sec^2 x + \csc^2 x\).`,
   choices: [String.raw`\(\sec^2 x\csc^2 x\)`, String.raw`\(\tan^2 x+\cot^2 x\)`, String.raw`\(\tan^2 x+\cot^2 x+1\)`, "1", "NOTA"],
   answer: "A",
   solution: String.raw`\[\sec^2 x+\csc^2 x=\frac{1}{\cos^2 x}+\frac{1}{\sin^2 x}=\frac{\sin^2 x+\cos^2 x}{\cos^2 x\sin^2 x}=\frac{1}{\cos^2 x\sin^2 x}=\boxed{\sec^2 x\csc^2 x}.\]`,
},




{
   id: 20092,
   number: 90,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: [],
   question: String.raw`Let A be the length of the period of \(y=\sin x\). Let B be the length of the period of \(y=\tan x\). Find the value of A-2B.`,
   choices: [String.raw`\(-2\pi\)`, String.raw`\(-\pi\)`, "0", String.raw`\(\pi\)`, "NOTA"],
   answer: "C",
   solution: String.raw`The period of \(\sin x\) is \(A=2\pi\) and the period of \(\tan x\) is \(B=\pi\).
\[A-2B=2\pi-2\pi=\boxed{0}.\]`,
},




{
   id: 20093,
   number: 91,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: [],
   question: String.raw`A right triangle has a hypotenuse of length 2 and an angle with measure \(\dfrac{\pi}{7}\). Which of the following is \(\textbf{not}\) one of the side lengths of the triangle?`,
   choices: [String.raw`\(2\tan\dfrac{\pi}{7}\)`, String.raw`\(2\cos\dfrac{\pi}{7}\)`, String.raw`\(2\sin\dfrac{\pi}{7}\)`, "2", "NOTA"],
   answer: "A",
   solution: String.raw`In a right triangle with hypotenuse 2 and an angle \(\pi/7\):
the two legs are \(2\sin(\pi/7)\) (opposite) and \(2\cos(\pi/7)\) (adjacent), and the hypotenuse is 2. These correspond to choices C, B, and D.
\(2\tan(\pi/7)\) is not a side length of this triangle, so the answer is \(\boxed{A}\).`,
},




{
   id: 20094,
   number: 92,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: [],
   question: String.raw`Solve for all x on the interval \(\left[-\dfrac{\pi}{2},\dfrac{\pi}{2}\right]\): \((\tan x)^2-3=0\).`,
   choices: [String.raw`\(\dfrac{\pi}{6}\)`, String.raw`\(\dfrac{\pi}{3}\)`, String.raw`\(-\dfrac{\pi}{6},\,\dfrac{\pi}{6}\)`, String.raw`\(-\dfrac{\pi}{3},\,\dfrac{\pi}{3}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`Rearrange: \(\tan^2 x=3\), so \(\tan x=\pm\sqrt{3}\).
On \([-\pi/2,\,\pi/2]\): \(\tan x=\sqrt{3}\Rightarrow x=\pi/3\) and \(\tan x=-\sqrt{3}\Rightarrow x=-\pi/3\).
The solutions are \(\boxed{x=-\dfrac{\pi}{3},\,\dfrac{\pi}{3}}\).`,
},




{
   id: 20095,
   number: 93,
   division: "Alpha",
   topic: "Parametric",
   difficulty: 2,
   methods: [],
   question: String.raw`Of the following pairs of parametric equations, how many lie completely on the line \(x+y=1\) when graphed on the xy-plane?
\(I.\quad x(t)=\sin^2 t,\quad y(t)=\cos^2 t\)
\(II.\quad x(t)=-\tan^2 t,\quad y(t)=\sec^2 t\)
\(III.\quad x(t)=\csc^2 t,\quad y(t)=\sec^2 t\)
\(IV.\quad x(t)=\csc^2 t,\quad y(t)=-\cot^2 t\)`,
   choices: ["0", "1", "2", "3", "NOTA"],
   answer: "D",
   solution: String.raw`Check each pair by computing x(t)+y(t):
I: \(\sin^2 t+\cos^2 t=1 \checkmark \quad\) (Pythagorean identity).
II: \(-\tan^2 t+\sec^2 t=1 \checkmark\) (since \(\sec^2 t-\tan^2 t=1\)).
III: \(\csc^2 t+\sec^2 t\neq 1\) in general (both terms are \(\geq 1\)). \(\times\)
IV: \(\csc^2 t-\cot^2 t=1 \checkmark\) (since \(\csc^2 t-\cot^2 t=1\)).
Three pairs (I, II, IV) lie on the line \(x+y=1\). Answer: \(\boxed{3}\).`,
},




{
   id: 20096,
   number: 94,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 2,
   methods: [],
   question: String.raw`Which of the following conditions regarding two real-valued variables, x and y, does \(\textbf{not}\) necessarily imply \(x^y=1\)?`,
   choices: [String.raw`\(x=1\)`, String.raw`\(y=0,\ x\neq 0\)`, String.raw`\(x=-1\), \(y\) is an even integer`, String.raw`\(x=-1\), \(y\) is an odd integer`, "NOTA"],
   answer: "D",
   solution: String.raw`\(A) 1^y=1\) for all y. Always implies \(x^y=1\).
\(B) x^0=1\) for all \(x\neq 0\). Always implies \(x^y=1\).
\(C) (-1)^{\text{even}}=1\). Always implies \(x^y=1\).
\(D) (-1)^{\text{odd}}=-1\neq 1\). Does \(\textbf{not}\) imply \(x^y=1\).
The answer is \(\boxed{D}\).`,
},




{
   id: 20097,
   number: 95,
   division: "Alpha",
   topic: "Functions",
   difficulty: 1,
   methods: [],
   question: String.raw`Given \(f(x)=2\tan^{-1}x\), find the range of f(x).`,
   choices: [String.raw`\(\left(-\dfrac{\pi}{2},\dfrac{\pi}{2}\right)\)`, String.raw`\(\left[-\dfrac{\pi}{2},\dfrac{\pi}{2}\right]\)`, String.raw`\((-\pi,\pi)\)`, String.raw`\([-\pi,\pi]\)`, "NOTA"],
   answer: "C",
   solution: String.raw`The range of \(\tan^{-1}x\) is \(\left(-\dfrac{\pi}{2},\dfrac{\pi}{2}\right)\) (open interval, since \(\pm\pi/2\) are not achieved).
Multiplying by 2: the range of \(f(x)=2\tan^{-1}x\) is \(\boxed{(-\pi,\pi)}\).`,
},




{
   id: 20098,
   number: 96,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 2,
   methods: [],
   question: String.raw`Let (a,b) be the center of the conic given by the equation \(x^2-4y+6=-y^2-10x+8\). Find the value of a-b.`,
   choices: [String.raw`-14`, String.raw`-7`, String.raw`7`, String.raw`14`, "NOTA"],
   answer: "B",
   solution: String.raw`Rearrange: \(x^2+10x+y^2-4y=2\).
Complete the square: \((x+5)^2-25+(y-2)^2-4=2\), so \((x+5)^2+(y-2)^2=31\).
The center is (-5,2), giving \(a-b=-5-2=\boxed{-7}\).`,
},




{
   id: 20099,
   number: 97,
   division: "Alpha",
   topic: "Functions",
   difficulty: 3,
   methods: [],
   question: String.raw`The following four functions have various symmetries. Let S have an initial value of 0. Add 1 to S for each function symmetric with respect to the x-axis. Add 2 to S for each function symmetric with respect to the y-axis. Add 3 to S for each function symmetric with respect to the origin. Compute S.
\(I.\quad a(x)=x\sin x\)
\(II.\quad b(x)=|x|\cos x+x^3\)
\(III.\quad c(x)=0\) if \(x\geq 0\); \(c(x)=1\) if \(x<0\)
\(IV.\quad d(x)=[x]+c(x)\), where c(x) is defined above and [x] denotes the greatest integer \(\leq x\)`,
   choices: ["2", "3", "4", "5", "NOTA"],
   answer: "A",
   solution: String.raw`I. \(a(-x)=(-x)\sin(-x)=x\sin x=a(x)\), so \(a\) is even and has y-axis symmetry. Add 2.
II. \(b(-x)=|x|\cos x-x^3\), which is neither \(b(x)\) nor \(-b(x)\). Add 0.
III. The piecewise function \(c\) has none of the listed symmetries. Add 0.
IV. The function \(d\) is not odd at integer inputs: \(d(1)=1\), while \(d(-1)=[-1]+1=0\neq-d(1)\). It also has none of the listed symmetries. Add 0.
Therefore \(S=2+0+0+0=\boxed{2}\).`,
},




{
   id: 20100,
   number: 98,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Trigonometric Identities"],
   question: String.raw`Compute the value of \(\cos(36^{\circ})+2\cos^2(72^{\circ})\).`,
   choices: ["-1", "0", String.raw`\(\sin 18^{\circ}\)`, "1", "NOTA"],
   answer: "D",
   solution: String.raw`Note \(\cos(72^{\circ})=\sin(18^{\circ})\), so \(2\cos^2(72^{\circ})=2\sin^2(18^{\circ})\).
By the double-angle identity: \(\cos(36^{\circ})=1-2\sin^2(18^{\circ})\).
\[\cos(36^{\circ})+2\cos^2(72^{\circ})=1-2\sin^2(18^{\circ})+2\sin^2(18^{\circ})=\boxed{1}.\]`,
},




{
   id: 20101,
   number: 99,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 4,
   methods: [],
   question: String.raw`Find the number of solutions to the equation \(\sin x=\sin(1000x)\) on the interval \((0,\pi)\).`,
   choices: ["998", "999", "1000", "1001", "NOTA"],
   answer: "B",
   solution: String.raw`Use \(\sin A=\sin B\), which holds when \(A=B+2k\pi\) or \(A=\pi-B+2k\pi\).

First, \(x=1000x+2k\pi\), so \(x=\frac{2m\pi}{999}\). The values in \((0,\pi)\) correspond to \(m=1,2,\ldots,499\), giving 499 solutions.

Second, \(x=\pi-1000x+2k\pi\), so \(x=\frac{(2k+1)\pi}{1001}\). The values in \((0,\pi)\) correspond to \(k=0,1,\ldots,499\), giving 500 solutions.

The two families do not overlap, so the total number of solutions is \(499+500=\boxed{999}\).`,
},




{
   id: 20102,
   number: 100,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 2,
   methods: [],
   question: String.raw`Consider the equation \(x^2+kxy+y^2=25\). The value of k may be any real number. As k ranges from 0 to \(\infty\), which of the following conic sections will the graph of the equation above \(\textbf{never}\) be?
\(\textit{(Note: "Ellipse" refers to a non-circular ellipse.)}\)`,
   choices: ["ellipse", "parabola", "hyperbola", "circle", "NOTA"],
   answer: "B",
   solution: String.raw`For \(Ax^2+Bxy+Cy^2=25\), the discriminant is \(B^2-4AC=k^2-4\).
At \(k=0\), the graph is the circle \(x^2+y^2=25\).
For \(0<k<2\), a rotation diagonalizes the positive-definite quadratic form, producing a non-circular ellipse.
At \(k=2\), the equation becomes \((x+y)^2=25\), which is a degenerate pair of parallel lines, not a parabola.
For \(k>2\), the quadratic form is indefinite, producing a hyperbola.
Therefore the graph is never a parabola, so the answer is \(\boxed{\text{parabola}}\).`,
},




{
   id: 20103,
   number: 101,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 4,
   methods: [],
   question: String.raw`A fourth-degree polynomial f(x) with leading coefficient 1 has the property that \(f(k)=k\) for \(k=1,2,3,4\). Compute f(5).`,
   choices: ["5", "19", "24", "29", "NOTA"],
   answer: "D",
   solution: String.raw`The polynomial f(x)-x has roots 1,2,3,4 and leading coefficient 1, so:
\[f(x)-x=(x-1)(x-2)(x-3)(x-4)\implies f(x)=x+(x-1)(x-2)(x-3)(x-4).\]
\[f(5)=5+(4)(3)(2)(1)=5+24=\boxed{29}.\]`,
},




{
   id: 20104,
   number: 102,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: ["Law of Cosines"],
   question: String.raw`A triangle ABC has a right angle at B. Points D and E lie on \(\overline{AC}\) such that \(AD=DE=EC\). Given \(BD^2+BE^2=15\), find \(AC^2\).`,
   choices: ["25", "26", "27", "28", "NOTA"],
   answer: "C",
   solution: String.raw`Let \(AB=c, BC=a, AC=b, BD=d, BE=e\). Since D and E trisect AC: \(AD=DE=EC=b/3\).
Apply the Law of Cosines in \(\triangle ABD\) (noting \(\cos\angle CAB=c/b\), so \(b\cos A=c\)):
\[d^2=\tfrac{b^2}{9}+c^2-2\cdot\tfrac{b}{3}\cdot c\cdot\tfrac{c}{b}=\tfrac{b^2}{9}+\tfrac{c^2}{3}.\]
Similarly in \(\triangle CBE\) (noting \(b\cos C=a\)):
\[e^2=\tfrac{b^2}{9}+\tfrac{a^2}{3}.\]
Adding: \(d^2+e^2=\dfrac{2b^2}{9}+\dfrac{a^2+c^2}{3}=\dfrac{2b^2}{9}+\dfrac{b^2}{3}=\dfrac{5b^2}{9}=15\).
\[b^2=27,\quad AC^2=\boxed{27}.\]`,
},




{
   id: 20105,
   number: 103,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: ["Double-Angle Identity"],
   question: String.raw`In an isosceles triangle, the length of the base is 2 and the lengths of the legs are 3. Find the sine of the vertex angle.`,
   choices: [String.raw`\(\dfrac{2\sqrt{2}}{9}\)`, String.raw`\(\dfrac{1}{3}\)`, String.raw`\(\dfrac{4\sqrt{2}}{9}\)`, String.raw`\(\dfrac{2}{3}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`Let the vertex angle be \(2\theta\). The altitude to the base bisects it, creating a right triangle with hypotenuse 3 and opposite side 1 (half the base).
\[\sin\theta=\frac{1}{3},\quad \cos\theta=\frac{\sqrt{9-1}}{3}=\frac{2\sqrt{2}}{3}.\]
\[\sin(2\theta)=2\sin\theta\cos\theta=2\cdot\frac{1}{3}\cdot\frac{2\sqrt{2}}{3}=\boxed{\frac{4\sqrt{2}}{9}}.\]`,
},




{
   id: 20106,
   number: 104,
   division: "Alpha",
   topic: "Limits",
   difficulty: 3,
   methods: [],
   question: String.raw`The function f(x) is a rational function, and the function g(x) is a cubic polynomial such that \(f(x)=\dfrac{g(x)}{x^2-1}\). As \(x\to 1, f(x)\to 5\). As \(x\to\) -1, \(f(x)\to 9\). Find the value of g(0).`,
   choices: [String.raw`-7`, String.raw`-3`, String.raw`3`, String.raw`7`, "NOTA"],
   answer: "A",
   solution: String.raw`Since the limits of f(x) are finite at \(x=\pm 1\), (x-1) and (x+1) must both divide g(x).
Write \(g(x)=(ax+b)(x-1)(x+1)=(ax+b)(x^2-1)\).
Then \(f(x)=ax+b\) (for \(x\neq\pm 1)\). The limits give: \(a+b=5\) and \(-a+b=9\).
Solving: \(b=7, a=-2\).
\[g(0)=(a\cdot 0+b)(0-1)(0+1)=b\cdot(-1)=-7.\quad\boxed{g(0)=-7}.\]`,
},




{
   id: 20107,
   number: 105,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: [],
   question: String.raw`Two stakes are nailed into the ground, 8 meters apart. The ends of a 10-meter-long inextensible rope are tied to these stakes. A robot is tied to the rope such that the robot may move along the rope but remains attached to it, and may move in any direction not restricted by the rope. Find the area (in square meters) of the region in which the robot may travel.`,
   choices: [String.raw`\(15\pi\)`, String.raw`\(16\pi\)`, String.raw`\(60\pi\)`, String.raw`\(80\pi\)`, "NOTA"],
   answer: "A",
   solution: String.raw`The constraint (sum of distances \(\leq 10)\) describes the interior of an ellipse with foci at the stakes.
The major axis has length \(2a=10\Rightarrow a=5\). The distance between foci is \(2c=8\Rightarrow c=4\).
\[b^2=a^2-c^2=25-16=9\Rightarrow b=3.\]
Area of ellipse \(=\pi ab=\pi(5)(3)=\boxed{15\pi}\) square meters.`,
},




{
   id: 20108,
   number: 106,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 5,
   methods: ["Trigonometric Identities"],
   question: String.raw`Find a value for \(\theta\) that satisfies the given equation:
\[\tan\theta=\frac{\tan\!\left(\dfrac{5\pi}{36}\right)-1}{\tan\!\left(\dfrac{\pi}{9}\right)-1}.\]`,
   choices: [String.raw`\(\dfrac{\pi}{36}\)`, String.raw`\(\dfrac{2\pi}{9}\)`, String.raw`\(\dfrac{\pi}{6}\)`, String.raw`\(\dfrac{\pi}{4}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Using \(\tan(\pi/4)=1\) and the addition formula \(\tan(\pi/9+5\pi/36)=\tan(\pi/4)=1\):
\[1=\frac{\tan(\pi/9)+\tan(5\pi/36)}{1-\tan(\pi/9)\tan(5\pi/36)}.\]
This gives \(\tan(5\pi/36)=\dfrac{1-\tan(\pi/9)}{1+\tan(\pi/9)}\). Substituting:
\[\tan\theta=\frac{\dfrac{1-\tan(\pi/9)}{1+\tan(\pi/9)}-1}{\tan(\pi/9)-1}=\frac{-2\tan(\pi/9)}{(1+\tan(\pi/9))(\tan(\pi/9)-1)}=\frac{2\tan(\pi/9)}{1-\tan^2(\pi/9)}=\tan\!\left(\frac{2\pi}{9}\right).\]
Therefore \(\theta=\boxed{\dfrac{2\pi}{9}}\).`,
},




{
   id: 20109,
   number: 107,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 2,
   methods: [],
   question: String.raw`Find the sum of the slopes of the asymptotes of the hyperbola given by \(5x^2-10x-4y^2+16y-31=0\).`,
   choices: [String.raw`\(\dfrac{\sqrt{5}}{2}\)`, String.raw`\(\dfrac{5}{4}\)`, String.raw`\(\sqrt{5}\)`, String.raw`\(\dfrac{5}{2}\)`, "NOTA"],
   answer: "E",
   solution: String.raw`Complete the square: \(5(x-1)^2-4(y-2)^2=20\), i.e., \(\dfrac{(x-1)^2}{4}-\dfrac{(y-2)^2}{5}=1\).
This is a horizontal hyperbola with \(a^2=4, b^2=5\).
Asymptotes: \(y-2=\pm\dfrac{\sqrt{5}}{2}(x-1)\), with slopes \(+\dfrac{\sqrt{5}}{2}\) and \(-\dfrac{\sqrt{5}}{2}\).
Sum of slopes \(=\dfrac{\sqrt{5}}{2}+\left(-\dfrac{\sqrt{5}}{2}\right)=0\).
Since 0 is not among choices A--D, the answer is \(\boxed{\text{NOTA}}\).`,
},




{
   id: 20110,
   number: 108,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: [],
   question: String.raw`Let x and y be measures of acute angles such that \(\sin(3x-y)-\cos(2x+2y)=2\). Find the value of x.`,
   choices: [String.raw`\(\dfrac{\pi}{12}\)`, String.raw`\(\dfrac{\pi}{6}\)`, String.raw`\(\dfrac{\pi}{4}\)`, String.raw`\(\dfrac{\pi}{3}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`For the sum of a sine and a negative cosine to equal 2 (the maximum possible), we need:
\(\sin(3x-y)=1\) and \(\cos(2x+2y)=-1\).
So \(3x-y=\pi/2\) and \(2x+2y=\pi\Rightarrow x+y=\pi/2\).
From \(x+y=\pi/2\): \(y=\pi/2-x\). Substituting: \(3x-(\pi/2-x)=\pi/2\Rightarrow 4x=\pi\Rightarrow x=\pi/4\).
Verify: \(x=y=\pi/4\) (both acute). \(\boxed{x=\pi/4}\).`,
},




{
   id: 20111,
   number: 109,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 2,
   methods: [],
   question: String.raw`A radioactive substance has a half-life of 24 years. A sample of this substance decays over a period of k years to 75% of its original amount. Compute the value of k.`,
   choices: [String.raw`\(48-24\log_2 3\)`, "12", "18", "48", "NOTA"],
   answer: "A",
   solution: String.raw`The decay model: \(A(t)=A_0\left(\dfrac{1}{2}\right)^{t/24}\). Set \(A(k)=\dfrac{3}{4}A_0\):
\[\left(\frac{1}{2}\right)^{k/24}=\frac{3}{4}\implies \frac{k}{24}\ln\!\frac{1}{2}=\ln\frac{3}{4}.\]
\[\frac{k}{24}(-\ln 2)=\ln 3-2\ln 2\implies k=\frac{24(2\ln 2-\ln 3)}{\ln 2}=48-\frac{24\ln 3}{\ln 2}=\boxed{48-24\log_2 3}.\]`,
},




{
   id: 20112,
   number: 110,
   division: "Alpha",
   topic: "Geometry",
   difficulty: 3,
   methods: [],
   question: String.raw`Consider a circle with radius 3, inside which two radii are drawn to form a sector with central angle \(\dfrac{\pi}{3}\). A second circle is drawn such that it is tangent to both radii and internally tangent to the first circle. Find the radius of the second circle.`,
   choices: ["1", String.raw`\(\dfrac{3\sqrt{3}-3}{2}\)`, String.raw`\(\dfrac{2\sqrt{3}}{3}\)`, String.raw`\(\sqrt{3}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Let r be the radius and x the distance from the large circle's center to the small circle's center.
Internal tangency: \(x+r=3\).
The sector has half-angle \(\pi/6\). The small circle is tangent to both radii, so \(\sin(\pi/6)=r/x\Rightarrow 1/2=r/x\Rightarrow x=2r\).
Substituting: \(2r+r=3\Rightarrow r=\boxed{1}\).`,
},




{
   id: 20113,
   number: 111,
   division: "Alpha",
   topic: "Functions",
   difficulty: 5,
   methods: ["Double-Angle Identity"],
   question: String.raw`Let \(f(x)=2x\) and \(g(x)=\dfrac{x}{4-x^2}\). Given \(h^1(x)=4g(f(x))\) and \(h^n(x)=h\!\left(h^{n-1}(x)\right)\), find \(h^{100}(\sqrt{3})\).`,
   choices: [String.raw`\(-\sqrt{3}\)`, String.raw`\(-\dfrac{\sqrt{3}}{3}\)`, String.raw`\(\dfrac{\sqrt{3}}{3}\)`, String.raw`\(\sqrt{3}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`Compute \(h(x)=4g(f(x))=4\cdot\dfrac{2x}{4-(2x)^2}=\dfrac{8x}{4-4x^2}=\dfrac{2x}{1-x^2}\).
This is the double-angle formula for tangent: \(\dfrac{2\tan\theta}{1-\tan^2\theta}=\tan(2\theta)\).
Setting \(x=\tan\theta\): \(h(\tan\theta)=\tan(2\theta)\), so \(h^n(\tan\theta)=\tan(2^n\theta)\).
Since \(\sqrt{3}=\tan(\pi/3)\): \(h^{100}(\sqrt{3})=\tan\!\left(\dfrac{2^{100}\pi}{3}\right)\).
Now \(2^{100}\bmod 3\): since \(2\equiv -1\pmod{3}, 2^{100}\equiv(-1)^{100}=1\pmod{3}\).
So \(\dfrac{2^{100}\pi}{3}=k\pi+\dfrac{\pi}{3}\) for some integer k, and \(\tan\!\left(k\pi+\dfrac{\pi}{3}\right)=\tan\!\left(\dfrac{\pi}{3}\right)=\boxed{\sqrt{3}}\).`,
},




{
   id: 20114,
   number: 112,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: [],
   question: String.raw`Find all real solutions for x: \(\sin^2 x=\cos^2 x\).`,
   choices: [String.raw`\(\dfrac{\pi}{4}+2k\pi\), where \(k\) is an integer`, String.raw`\(\dfrac{\pi}{4}+k\pi\), where \(k\) is an integer`, String.raw`\(\dfrac{\pi}{4}+\dfrac{k\pi}{2}\), where \(k\) is an integer`, String.raw`\(\dfrac{\pi}{4},\dfrac{3\pi}{4},\dfrac{5\pi}{4},\ldots\)`, "NOTA"],
   answer: "C",
   solution: String.raw`\(\sin^2 x=\cos^2 x\Rightarrow\sin^2 x-\cos^2 x=0\Rightarrow-\cos(2x)=0\Rightarrow\cos(2x)=0\).
So \(2x=\dfrac{\pi}{2}+k\pi\Rightarrow x=\dfrac{\pi}{4}+\dfrac{k\pi}{2}\) for integer k.
The answer is \(\boxed{C}\).`,
},




{
   id: 20115,
   number: 113,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: [],
   question: String.raw`A sinusoidal function has a vertical shift of magnitude 3 and amplitude of 5. Which of the following could \(\textbf{not}\) be this function?`,
   choices: [String.raw`\(f(x)=5\sin x-3\)`, String.raw`\(f(x)=-5\cos(3x-\pi)+3\)`, String.raw`\(f(x)=10\sin x\cos x+3\)`, String.raw`\(f(x)=5\cos x-3\)`, "NOTA"],
   answer: "E",
   solution: String.raw`A) \(5\sin x-3\): amplitude 5 and vertical shift \(-3\). \(\checkmark\)
B) \(-5\cos(3x-\pi)+3\): amplitude 5 and vertical shift \(+3\). \(\checkmark\)
C) \(10\sin x\cos x+3=5\sin(2x)+3\): amplitude 5 and vertical shift \(+3\). \(\checkmark\)
D) \(5\cos x-3\): amplitude 5 and vertical shift \(-3\). \(\checkmark\)
All four choices qualify, so the answer is \(\boxed{\text{NOTA}}\).`,
},




{
   id: 20116,
   number: 114,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: [],
   question: String.raw`Let \(\Delta\) be an operator such that \(\Delta(f(x))=f(x+1)-f(x)\). Furthermore, \(\Delta^1(f(x))=\Delta(f(x))\) and for \(n\geq 2, \Delta^n(f(x))=\Delta(\Delta^{n-1}(f(x)))\).
Let \(g(x)=\Delta(x^3)+\Delta((x-1)^3)\). Compute g(1).`,
   choices: ["2", "7", "8", "9", "NOTA"],
   answer: "C",
   solution: String.raw`\(\Delta(x^3)=(x+1)^3-x^3=3x^2+3x+1\).
\(\Delta((x-1)^3)=x^3-(x-1)^3=3x^2-3x+1\).
\(g(x)=\Delta(x^3)+\Delta((x-1)^3)=(x+1)^3-(x-1)^3\).
\(g(1)=2^3-0^3=8-0=\boxed{8}\).`,
},




{
   id: 20117,
   number: 115,
   division: "Alpha",
   topic: "Functions",
   difficulty: 3,
   methods: [],
   question: String.raw`Let \(\Delta\) be an operator such that \(\Delta(f(x))=f(x+1)-f(x)\). Furthermore, \(\Delta^1(f(x))=\Delta(f(x))\) and for \(n\geq 2, \Delta^n(f(x))=\Delta(\Delta^{n-1}(f(x)))\).
Given that f(x) is a polynomial and \(\Delta^k(f(x))=c\), where c is a non-zero constant, find the degree of f(x).`,
   choices: [String.raw`c`, String.raw`k-1`, String.raw`k`, String.raw`k+1`, "NOTA"],
   answer: "C",
   solution: String.raw`Each application of \(\Delta\) reduces the degree of a polynomial by exactly 1: if f has degree n, then \(\Delta(f)\) has degree n-1.
After k applications, the degree has been reduced to 0 (a non-zero constant c).
Therefore f(x) has degree \(\boxed{k}\).`,
},




{
   id: 20118,
   number: 116,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: [],
   question: String.raw`Which of the following functions is \(\textbf{not}\) monotonic on its domain?`,
   choices: [String.raw`\(a(x)=x^3,\quad x\in(-\infty,\infty)\)`, String.raw`\(b(x)=\sin(2x),\quad x\in\left(-\dfrac{\pi}{4},\dfrac{\pi}{4}\right)\)`, String.raw`\(c(x)=\arctan(x),\quad x\in(-\infty,\infty)\)`, String.raw`\(d(x)=\ln(x^2),\quad x\in(0,\infty)\)`, "NOTA"],
   answer: "E",
   solution: String.raw`\(A) x^3\) is strictly increasing on all of \(\mathbb{R}\). Monotonic.
\(B) \sin(2x)\) on \((-\pi/4,\pi/4)\): the argument \(2x\in(-\pi/2,\pi/2)\), where \(\sin\) is strictly increasing. Monotonic.
\(C) \arctan(x)\) is strictly increasing on all of \(\mathbb{R}\). Monotonic.
D) On \((0,\infty)\): \(\ln(x^2)=2\ln x\), which is strictly increasing. Monotonic.
All four functions are monotonic, so the answer is \(\boxed{\text{NOTA}}\).`,
},




{
   id: 20119,
   number: 117,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 2,
   methods: ["Determinant"],
   question: String.raw`For the \(3\times 3\) matrix \(\begin{pmatrix}A&B&C\\D&E&F\\G&H&I\end{pmatrix}\), Jack says the determinant equals AEI+BFG+CDH-(CEG+BDI+AFH). Jim says the determinant equals \(A\begin{vmatrix}E&F\\H&I\end{vmatrix}-B\begin{vmatrix}D&F\\G&I\end{vmatrix}+C\begin{vmatrix}D&E\\G&H\end{vmatrix}\). Who is correct?`,
   choices: ["Jack", "Jim", "neither", "both", "NOTA"],
   answer: "D",
   solution: String.raw`Jack's formula is the Sarrus' rule (diagonal method) for a \(3\times 3\) determinant: correct.
Jim's formula is cofactor expansion along the first row: also correct.
Expanding Jim's expression yields exactly Jack's expression.
Both methods are valid. Answer: \(\boxed{\text{both}}\).`,
},




{
   id: 20120,
   number: 118,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 1,
   methods: [],
   question: String.raw`Identify the following non-degenerate conic section: \(x^2+xy+y^2+x+y=0\).
\(\textit{(Note: "Ellipse" refers to a non-circular ellipse.)}\)`,
   choices: ["circle", "ellipse", "parabola", "hyperbola", "NOTA"],
   answer: "B",
   solution: String.raw`For the general conic \(Ax^2+Bxy+Cy^2+Dx+Ey+F=0\), the discriminant is \(B^2-4AC\).
Here \(A=1\), \(B=1\), and \(C=1\), so \(B^2-4AC=1-4=-3<0\). The quadratic part is positive definite, and the equation has real points, such as \((0,0)\). Thus the graph is an ellipse or a circle.
Because the \(xy\)-term is nonzero, the conic is rotated and is not a circle. Therefore it is a \(\boxed{\text{non-circular ellipse}}\).`,
},


{
   id: 20121,
   number: 119,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: [],
   question: String.raw`Find the length of the chord of the hyperbola \(\dfrac{x^2}{16}-\dfrac{y^2}{36}=1\) cut by the vertical line passing through a focus.`,
   choices: ["9", "12", String.raw`\(9\sqrt{2}\)`, "18", "NOTA"],
   answer: "D",
   solution: String.raw`For \(\dfrac{x^2}{16}-\dfrac{y^2}{36}=1\), we have \(a^2=16, b^2=36\), so \(c^2=16+36=52\) and the foci are at \((\pm 2\sqrt{13},\,0)\).
Substituting \(x=2\sqrt{13}\) into the hyperbola equation:
\[\frac{52}{16}-\frac{y^2}{36}=1 \implies \frac{y^2}{36}=\frac{52}{16}-1=\frac{36}{16} \implies y^2=81 \implies y=\pm 9.\]
The chord has length \(9-(-9)=\boxed{18}\).`,
},




{
   id: 20122,
   number: 120,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 2,
   methods: ["Determinant"],
   question: String.raw`Find \(\det\begin{pmatrix}2004&2005&2006\\2003&2004&2005\\2002&2003&2004\end{pmatrix}\).`,
   choices: ["1", "0", "-1", "2", "NOTA"],
   answer: "B",
   solution: String.raw`Subtract row 2 from row 1 and row 3 from row 2:
\[R_1\leftarrow R_1-R_2:\;(1,1,1),\quad R_2\leftarrow R_2-R_3:\;(1,1,1).\]
Now rows 1 and 2 are identical, so \(\det=\boxed{0}\).`,
},




{
   id: 20123,
   number: 121,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 1,
   methods: ["Matrix Multiplication"],
   question: String.raw`Compute \(\begin{bmatrix}\sin x & \cos x\end{bmatrix}\begin{bmatrix}\sin x\\\cos x\end{bmatrix}\).`,
   choices: [String.raw`[0]`, String.raw`\([\sin x\cos x]\)`, String.raw`[1]`, String.raw`[2]`, "NOTA"],
   answer: "C",
   solution: String.raw`Multiplying a \(1\times 2\) matrix by a \(2\times 1\) matrix gives a \(1\times 1\) matrix:
\[\begin{bmatrix}\sin x & \cos x\end{bmatrix}\begin{bmatrix}\sin x\\\cos x\end{bmatrix}=[\sin^2 x+\cos^2 x]=\boxed{[1]}.\]`,
},




{
   id: 20124,
   number: 122,
   division: "Alpha",
   topic: "Polar",
   difficulty: 2,
   methods: ["Law of Cosines"],
   question: String.raw`Find the distance between the polar points \(\left(4,\,\dfrac{5\pi}{3}\right)\) and \(\left(-\sqrt{2},\,\dfrac{5\pi}{4}\right)\).`,
   choices: [String.raw`\(\sqrt{6+4\sqrt{3}}\)`, String.raw`\(\sqrt{12+4\sqrt{3}}\)`, String.raw`\(\sqrt{14+4\sqrt{3}}\)`, String.raw`\(\sqrt{16+4\sqrt{3}}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`Convert to rectangular coordinates.
Point 1: \(r=4, \theta=\frac{5\pi}{3}\): \(x=4\cos\!\frac{5\pi}{3}=4\cdot\frac{1}{2}=2, y=4\sin\!\frac{5\pi}{3}=4\cdot\!\left(-\frac{\sqrt{3}}{2}\right)=-2\sqrt{3}\). So \(P_1=(2,-2\sqrt{3})\).
Point 2: \(r=-\sqrt{2}, \theta=\frac{5\pi}{4}\): \(x=(-\sqrt{2})\cos\!\frac{5\pi}{4}=(-\sqrt{2})\!\left(-\frac{\sqrt{2}}{2}\right)=1, y=(-\sqrt{2})\sin\!\frac{5\pi}{4}=(-\sqrt{2})\!\left(-\frac{\sqrt{2}}{2}\right)=1\). So \(P_2=(1,1)\).
\[d=\sqrt{(2-1)^2+(-2\sqrt{3}-1)^2}=\sqrt{1+(4\cdot 3+4\sqrt{3}+1)}=\boxed{\sqrt{14+4\sqrt{3}}}.\]`,
},




{
   id: 20125,
   number: 123,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 2,
   methods: ["Determinant", "Logarithms"],
   question: String.raw`Find \(\det\begin{pmatrix}\log_2 6 & 1\\\ln e & \log_{36} 16\end{pmatrix}\).`,
   choices: ["0", "1", "2", String.raw`\(\log_2 6\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Note \(\ln e=1\) and \(\log_{36}16=\dfrac{\log 16}{\log 36}=\dfrac{4\log 2}{2\log 6}=\dfrac{2}{\log_2 6}\).
\[\det=(\log_2 6)\cdot\frac{2}{\log_2 6}-1\cdot 1=2-1=\boxed{1}.\]`,
},




{
   id: 20126,
   number: 124,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 5,
   methods: ["Rationalization", "Telescoping"],
   question: String.raw`Evaluate \(\displaystyle\sum_{k=4}^{120}\frac{1}{k\sqrt{k+1}+(k+1)\sqrt{k}}\).`,
   choices: [String.raw`\(\dfrac{9}{22}\)`, String.raw`\(\dfrac{7}{20}\)`, String.raw`\(\dfrac{1}{2}\)`, String.raw`\(\dfrac{1}{11}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Factor the denominator: \(k\sqrt{k+1}+(k+1)\sqrt{k}=\sqrt{k}\,\sqrt{k+1}\!\left(\sqrt{k}+\sqrt{k+1}\right)\).
Rationalize by multiplying by \(\dfrac{\sqrt{k+1}-\sqrt{k}}{\sqrt{k+1}-\sqrt{k}}\):
\[\frac{1}{k\sqrt{k+1}+(k+1)\sqrt{k}}=\frac{\sqrt{k+1}-\sqrt{k}}{\sqrt{k}\,\sqrt{k+1}\cdot 1}=\frac{1}{\sqrt{k}}-\frac{1}{\sqrt{k+1}}.\]
The sum telescopes:
\[\sum_{k=4}^{120}\!\left(\frac{1}{\sqrt{k}}-\frac{1}{\sqrt{k+1}}\right)=\frac{1}{\sqrt{4}}-\frac{1}{\sqrt{121}}=\frac{1}{2}-\frac{1}{11}=\boxed{\frac{9}{22}}.\]`,
},




{
   id: 20127,
   number: 125,
   division: "Alpha",
   topic: "Polar",
   difficulty: 1,
   methods: [],
   question: String.raw`Express \(-1+\sqrt{3}\,i\) in polar form.`,
   choices: [String.raw`\(2\!\left(\cos\dfrac{\pi}{3}+i\sin\dfrac{\pi}{3}\right)\)`, String.raw`\(2\!\left(\cos\dfrac{2\pi}{3}+i\sin\dfrac{2\pi}{3}\right)\)`, String.raw`\(\cos\dfrac{2\pi}{3}+i\sin\dfrac{2\pi}{3}\)`, String.raw`\(2\!\left(\cos\dfrac{4\pi}{3}+i\sin\dfrac{4\pi}{3}\right)\)`, "NOTA"],
   answer: "B",
   solution: String.raw`The modulus is \(r=\sqrt{(-1)^2+(\sqrt{3})^2}=\sqrt{4}=2\).
The argument: the point \((-1,\sqrt{3})\) is in quadrant II, so
\(\theta=\pi-\arctan\!\left(\dfrac{\sqrt{3}}{1}\right)=\pi-\dfrac{\pi}{3}=\dfrac{2\pi}{3}\).
Thus \(-1+\sqrt{3}\,i=\boxed{2\!\left(\cos\dfrac{2\pi}{3}+i\sin\dfrac{2\pi}{3}\right)}\).`,
},




{
   id: 20128,
   number: 126,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 4,
   methods: ["Logarithms"],
   question: String.raw`Evaluate \(\displaystyle\sum_{n=1}^{45}\log\!\left(2^{2n-1}\cdot\tan(2n-1)^{\circ}\right)\).`,
   choices: ["2025", String.raw`\(45\log 2\)`, String.raw`\(900\log 2\)`, String.raw`\(2025\log 2\)`, "NOTA"],
   answer: "D",
   solution: String.raw`Split using log rules: \(\sum_{n=1}^{45}(2n-1)\log 2+\sum_{n=1}^{45}\log\tan(2n-1)^{\circ}\).
The angles \((2n-1)^{\circ}\) for \(n=1,\ldots,45\) are \(1^{\circ},3^{\circ},\ldots,89^{\circ}\). Since \(\tan\theta\cdot\tan(90^{\circ}-\theta)=1\), the product of all these tangents equals 1, so \(\sum_{n=1}^{45}\log\tan(2n-1)^{\circ}=0\).
The sum of exponents: \(\sum_{n=1}^{45}(2n-1)=45^2=2025\).
Therefore the total is \(\boxed{2025\log 2}\).`,
},




{
   id: 20129,
   number: 127,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: [],
   question: String.raw`Find \(\dfrac{1}{\cos 45^{\circ}}+\dfrac{1}{\sin 45^{\circ}}\).`,
   choices: [String.raw`\(\sqrt{2}\)`, String.raw`\(\sqrt{2}+1\)`, "2", String.raw`\(2\sqrt{2}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`\(\cos 45^{\circ}=\sin 45^{\circ}=\dfrac{\sqrt{2}}{2}\), so
\[\frac{1}{\cos 45^{\circ}}+\frac{1}{\sin 45^{\circ}}=\frac{2}{\sqrt{2}}+\frac{2}{\sqrt{2}}=\sqrt{2}+\sqrt{2}=\boxed{2\sqrt{2}}.\]`,
},




{
   id: 20130,
   number: 128,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Trigonometric Identities"],
   question: String.raw`Find the smallest positive solution (in degrees) to \(\dfrac{1}{1+\sin 2x}+\dfrac{1}{1-\sin 2x}=\dfrac{8}{3}\).`,
   choices: [String.raw`\(15^{\circ}\)`, String.raw`\(22.5^{\circ}\)`, String.raw`\(30^{\circ}\)`, String.raw`\(45^{\circ}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Combine the fractions:
\[\frac{(1-\sin 2x)+(1+\sin 2x)}{(1+\sin 2x)(1-\sin 2x)}=\frac{2}{1-\sin^2 2x}=\frac{2}{\cos^2 2x}=\frac{8}{3}.\]
So \(\cos^2 2x=\dfrac{3}{4}\), giving \(\cos 2x=\pm\dfrac{\sqrt{3}}{2}\).
The smallest positive x: \(2x=30^{\circ}\Rightarrow x=\boxed{15^{\circ}}\).`,
},




{
   id: 20131,
   number: 129,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 2,
   methods: [],
   question: String.raw`If \((5-2m)x^2+(m-1)y^2-4x+6y+2m=0\) is a circle, find its radius.`,
   choices: [String.raw`\(\sqrt{3}\)`, "3", "2", "9", "NOTA"],
   answer: "B",
   solution: String.raw`For a circle the coefficients of \(x^2\) and \(y^2\) must be equal:
\[5-2m=m-1\implies 6=3m\implies m=2.\]
The equation becomes \(x^2+y^2-4x+6y+4=0\), i.e., \((x-2)^2+(y+3)^2=4+9-4=9\).
The radius is \(r=\sqrt{9}=\boxed{3}\).`,
},




{
   id: 20132,
   number: 130,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: ["Even Functions"],
   question: String.raw`If \(f(x)=\dfrac{3x^2+(a-2)x+3}{1-x^2}\) is an even function, find \(a^2\cdot\) f(a).`,
   choices: ["-20", "-16", "12", "20", "NOTA"],
   answer: "A",
   solution: String.raw`An even function satisfies \(f(-x)=f(x)\). The numerator \(3x^2+(a-2)x+3\) must be even, so its odd part must vanish: \(a-2=0\Rightarrow a=2\).
\[f(x)=\frac{3x^2+3}{1-x^2}=\frac{3(x^2+1)}{1-x^2}.\]
\[f(2)=\frac{3(4+1)}{1-4}=\frac{15}{-3}=-5.\]
\[a^2\cdot f(a)=4\cdot(-5)=\boxed{-20}.\]`,
},




{
   id: 20133,
   number: 131,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: ["Trigonometric Identities"],
   question: String.raw`If \(a+b=\dfrac{\pi}{3}\), evaluate \((\sin a-\sin b)^2+(\cos a+\cos b)^2\).`,
   choices: ["1", "2", String.raw`\(\sqrt{3}\)`, "3", "NOTA"],
   answer: "D",
   solution: String.raw`Expand:
\[(\sin a-\sin b)^2+(\cos a+\cos b)^2\]
\[=\sin^2 a-2\sin a\sin b+\sin^2 b+\cos^2 a+2\cos a\cos b+\cos^2 b\]
\[=1+1+2(\cos a\cos b-\sin a\sin b)=2+2\cos(a+b).\]
With \(a+b=\dfrac{\pi}{3}\): \(2+2\cos\dfrac{\pi}{3}=2+2\cdot\dfrac{1}{2}=\boxed{3}\).`,
},




{
   id: 20134,
   number: 132,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 3,
   methods: ["Vieta's Formulas"],
   question: String.raw`The roots of \(x^3+4ax^2+bx+2-3a=0\) satisfy \(\sum x_n=\prod(2x_n)\). Find a.`,
   choices: [String.raw`\(-\dfrac{4}{7}\)`, String.raw`\(\dfrac{2}{7}\)`, String.raw`\(\dfrac{4}{7}\)`, String.raw`\(\dfrac{8}{7}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`By Vieta's formulas for \(x^3+4ax^2+bx+(2-3a)=0\):
\(\sum x_n=-4a\) and \(\prod x_n=-(2-3a)=3a-2\).
The condition \(\sum x_n=\prod(2x_n)=8\prod x_n\) gives:
\[-4a=8(3a-2)\implies -4a=24a-16\implies 16=28a\implies a=\boxed{\frac{4}{7}}.\]`,
},




{
   id: 20135,
   number: 133,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Trigonometric Identities"],
   question: String.raw`If \(\sin 25^{\circ}=a\), find \(\sin 40^{\circ}\) in terms of a.`,
   choices: [String.raw`\(2a^2-1\)`, String.raw`\(2a\sqrt{1-a^2}\)`, String.raw`\(1-2a^2\)`, String.raw`\(a\sqrt{1-a^2}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`\(\sin 40^{\circ}=\cos 50^{\circ}=\cos(2\cdot 25^{\circ})=1-2\sin^2 25^{\circ}=\boxed{1-2a^2}\).`,
},




{
   id: 20136,
   number: 134,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: [],
   question: String.raw`Which of the following has the greatest value: \(\sin 250^{\circ}, \cos 300^{\circ}, \tan 100^{\circ}, \cot 260^{\circ}, \tan 80^{\circ}\)?`,
   choices: [String.raw`\(\tan 80^{\circ}\)`, String.raw`\(\cos 300^{\circ}\)`, String.raw`\(\cot 260^{\circ}\)`, String.raw`\(\tan 100^{\circ}\)`, String.raw`\(\sin 250^{\circ}\)`],
   answer: "A",
   solution: String.raw`Evaluate each approximately:
\(\sin 250^{\circ}=-\cos 20^{\circ}\approx\) -0.94 (negative).
\(\cos 300^{\circ}=\cos(-60^{\circ})=0.5\).
\(\tan 100^{\circ}=-\tan 80^{\circ}\approx\) -5.67 (negative).
\(\cot 260^{\circ}=\tan 10^{\circ}\approx 0.18\).
\(\tan 80^{\circ}\approx 5.67\).
The greatest value is \(\boxed{\tan 80^{\circ}}\).`,
},




{
   id: 20137,
   number: 135,
   division: "Alpha",
   topic: "Probability",
   difficulty: 3,
   methods: [],
   question: String.raw`Esha and Harshitha are 2 of 12 people chosen to stand in a row of 7. What is the probability that both are chosen \(\textit{and}\) are standing adjacent to each other?`,
   choices: [String.raw`\(\dfrac{1}{22}\)`, String.raw`\(\dfrac{2}{11}\)`, String.raw`\(\dfrac{1}{11}\)`, String.raw`\(\dfrac{3}{22}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`Total arrangements of 7 from 12: \(P(12,7)=12!/5!=3{,}991{,}680\).
Favorable: choose one of the 6 adjacent position pairs for Esha and Harshitha, arrange them within that pair in 2 orders, and fill the remaining 5 positions with an ordered selection from the other 10 people in \(P(10,5)=10!/5!=30{,}240\) ways.
\[P=\frac{2\cdot 6\cdot P(10,5)}{P(12,7)}=\frac{2\cdot 6\cdot 30240}{3991680}=\frac{362880}{3991680}=\boxed{\frac{1}{11}}.\]`,
},




{
   id: 20138,
   number: 136,
   division: "Alpha",
   topic: "Limits",
   difficulty: 2,
   methods: [],
   question: String.raw`Evaluate \(\displaystyle\lim_{x\to 1}\frac{x^4-4x^3+6x^2-4x+1}{x-1}\).`,
   choices: ["4", "0", "1", "-4", "NOTA"],
   answer: "B",
   solution: String.raw`Recognize the numerator: \(x^4-4x^3+6x^2-4x+1=(x-1)^4\).
\[\lim_{x\to 1}\frac{(x-1)^4}{x-1}=\lim_{x\to 1}(x-1)^3=0^3=\boxed{0}.\]`,
},




{
   id: 20139,
   number: 137,
   division: "Alpha",
   topic: "Limits",
   difficulty: 2,
   methods: [],
   question: String.raw`Evaluate \(\displaystyle\lim_{x\to 1}\left(\frac{x^3-1}{x-1}\right)^{\!\frac{x^2-1}{x-1}}\).`,
   choices: ["3", "1", "6", "9", "NOTA"],
   answer: "D",
   solution: String.raw`As \(x\to 1\):
\[\frac{x^3-1}{x-1}=x^2+x+1\to 3,\qquad \frac{x^2-1}{x-1}=x+1\to 2.\]
Therefore \(\displaystyle\lim_{x\to 1}\left(x^2+x+1\right)^{x+1}=3^2=\boxed{9}\).`,
},




{
   id: 20140,
   number: 138,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 3,
   methods: ["Synthetic Division"],
   question: String.raw`\(P(x)=3x^4+6x^3+5x^2+8x-4\) is divided by (x+2), yielding quotient Q(x). Find the sum of the coefficients of Q(3x-1).`,
   choices: ["56", "14", "28", "32", "NOTA"],
   answer: "D",
   solution: String.raw`\(Q(x)=3x^3+5x-2\) via synthetic division. The sum of coefficients of a polynomial f equals f(1). For Q(3x-1), substitute \(x=1\): \(Q(3\cdot 1-1)=Q(2)\).
\[Q(2)=3(2^3)+5(2)-2=24+10-2=\boxed{32}.\]`,
},




{
   id: 20141,
   number: 139,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 3,
   methods: ["Remainder Theorem"],
   question: String.raw`A polynomial P(x) satisfies \(P(3)=2\) and \(P(-3)=8\). Find the remainder when P(x) is divided by \(x^2-9\).`,
   choices: [String.raw`5+x`, String.raw`x-5`, String.raw`5-x`, String.raw`x+5`, "NOTA"],
   answer: "C",
   solution: String.raw`The remainder \(R(x)=ax+b\) satisfies \(R(3)=P(3)\) and \(R(-3)=P(-3)\):
\[3a+b=2\quad\text{and}\quad -3a+b=8.\]
Adding: \(2b=10\Rightarrow b=5\). Subtracting: \(6a=-6\Rightarrow a=-1\).
\(R(x)=-x+5=\boxed{5-x}\).`,
},




{
   id: 20142,
   number: 140,
   division: "Alpha",
   topic: "Simplification",
   difficulty: 3,
   methods: [],
   question: String.raw`Which of the following is a possible value of \(\left(\dfrac{x^3-y^3}{xy}+3y-3x\right)\cdot\dfrac{x+y}{\dfrac{y}{x}+\dfrac{x}{y}-2}+y^2\), where \(x\neq y, x,y\neq 0\), and x is a positive integer.`,
   choices: ["3", "16", "22", "30", "NOTA"],
   answer: "B",
   solution: String.raw`Factor the first factor's bracket: \(\dfrac{x^3-y^3}{xy}+3(y-x)=\dfrac{(x-y)(x^2+xy+y^2)-3xy(x-y)}{xy}=\dfrac{(x-y)^3}{xy}\).
The denominator of the second factor: \(\dfrac{y}{x}+\dfrac{x}{y}-2=\dfrac{x^2+y^2-2xy}{xy}=\dfrac{(x-y)^2}{xy}\).
Multiplying:
\[\frac{(x-y)^3}{xy}\cdot\frac{(x+y)\cdot xy}{(x-y)^2}=(x-y)(x+y)=x^2-y^2.\]
Adding \(y^2\): \(x^2-y^2+y^2=x^2\).
Since x is a positive integer, \(x^2\) is a perfect square. The only perfect square among the choices is \(\boxed{16}\) (with \(x=4)\).`,
},




{
   id: 20143,
   number: 141,
   division: "Alpha",
   topic: "Simplification",
   difficulty: 2,
   methods: [],
   question: String.raw`Given \(b=a+c\), simplify \(\left(1+\dfrac{a^2-b^2-c^2}{2bc}\right)\div\dfrac{a+b-c}{2bc}\).`,
   choices: ["0", "1", String.raw`2c`, String.raw`2bc`, "NOTA"],
   answer: "A",
   solution: String.raw`Combine the numerator: \(1+\dfrac{a^2-b^2-c^2}{2bc}=\dfrac{2bc+a^2-b^2-c^2}{2bc}=\dfrac{a^2-(b-c)^2}{2bc}=\dfrac{(a-b+c)(a+b-c)}{2bc}\).
With \(b=a+c\): \(a-b+c=a-(a+c)+c=0\).
So the numerator equals 0, and the entire expression is \(\boxed{0}\).`,
},




{
   id: 20144,
   number: 142,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 3,
   methods: [],
   question: String.raw`If \(\log_3 5=a\), find \(\log_{75} 45\).`,
   choices: [String.raw`\(\dfrac{1+a}{a+2}\)`, String.raw`\(\dfrac{2+a}{2a+1}\)`, String.raw`\(\dfrac{a+2}{a+1}\)`, String.raw`\(\dfrac{2a+1}{a+2}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Express everything in terms of \(\log 3\). Let \(\log 3=1\) (unit) and \(\log 5=a\).
\(\log 45=\log(9\cdot 5)=2+a\) and \(\log 75=\log(25\cdot 3)=2a+1\).
\[\log_{75}45=\frac{\log 45}{\log 75}=\boxed{\frac{2+a}{2a+1}}.\]`,
},




{
   id: 20145,
   number: 143,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 2,
   methods: ["De Moivre's Theorem", "Rationalization"],
   question: String.raw`Evaluate \(\left(\dfrac{1-i}{1+i}\right)^{12}\).`,
   choices: ["-1", String.raw`i`, "1", String.raw`-i`, "NOTA"],
   answer: "C",
   solution: String.raw`Simplify the base: \(\dfrac{1-i}{1+i}=\dfrac{(1-i)^2}{(1+i)(1-i)}=\dfrac{1-2i+i^2}{2}=\dfrac{-2i}{2}=-i\).
\[\left(-i\right)^{12}=\left((-i)^4\right)^3=\left(i^4\right)^3=1^3=\boxed{1}.\]`,
},




{
   id: 20146,
   number: 144,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 2,
   methods: [],
   question: String.raw`If \(\dfrac{1-i}{z}=\dfrac{1+i}{z+i}\), find |z|.`,
   choices: [String.raw`\(\dfrac{\sqrt{2}}{2}\)`, String.raw`\(\sqrt{2}\)`, "1", String.raw`\(\dfrac{1}{2}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Cross-multiply: \((1-i)(z+i)=(1+i)z\).
\[(1-i)z+(1-i)i=(1+i)z \implies (1-i)i=(1+i)z-(1-i)z=2iz.\]
\((1-i)i=i-i^2=i+1=1+i\), so \(2iz=1+i\Rightarrow z=\dfrac{1+i}{2i}=\dfrac{(1+i)(-i)}{2}=\dfrac{-i+1}{2}=\dfrac{1-i}{2}\).
\[|z|=\frac{|1-i|}{2}=\frac{\sqrt{2}}{2}=\boxed{\frac{\sqrt{2}}{2}}.\]`,
},




{
   id: 20147,
   number: 145,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: ["Trigonometric Identities"],
   question: String.raw`Find \(T=\arcsin\!\dfrac{1}{\sqrt{10}}+\arcsin\!\dfrac{3}{\sqrt{10}}\).`,
   choices: [String.raw`\(\dfrac{\pi}{6}\)`, String.raw`\(\dfrac{\pi}{4}\)`, String.raw`\(\dfrac{\pi}{3}\)`, String.raw`\(\dfrac{\pi}{2}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`Let \(\alpha=\arcsin\!\dfrac{1}{\sqrt{10}}\) and \(\beta=\arcsin\!\dfrac{3}{\sqrt{10}}\).
Then \(\sin\alpha=\dfrac{1}{\sqrt{10}}\) and \(\cos\alpha=\dfrac{3}{\sqrt{10}}\) (first quadrant).
But \(\cos\alpha=\dfrac{3}{\sqrt{10}}=\sin\beta\), so \(\alpha+\beta=\dfrac{\pi}{2}\).
Therefore \(T=\boxed{\dfrac{\pi}{2}}\).`,
},




{
   id: 20148,
   number: 146,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 1,
   methods: [],
   question: String.raw`Find the magnitude of the vector \(\langle -1,\,3,\,4\rangle\).`,
   choices: [String.raw`\(\sqrt{14}\)`, String.raw`\(\sqrt{24}\)`, String.raw`\(\sqrt{26}\)`, String.raw`\(\sqrt{30}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`\[|\langle -1,3,4\rangle|=\sqrt{(-1)^2+3^2+4^2}=\sqrt{1+9+16}=\boxed{\sqrt{26}}.\]`,
},




{
   id: 20149,
   number: 147,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 2,
   methods: ["Cross Product"],
   question: String.raw`Find a unit vector in the direction of \(\langle 1,-2,1\rangle\times\langle -2,1,2\rangle\).`,
   choices: [String.raw`\(\dfrac{\sqrt{2}}{10}\langle 5,4,3\rangle\)`, String.raw`\(\dfrac{1}{5\sqrt{2}}\langle 5,4,3\rangle\)`, String.raw`\(\dfrac{1}{\sqrt{50}}\langle -5,-4,3\rangle\)`, String.raw`\(\dfrac{1}{\sqrt{50}}\langle -5,4,-3\rangle\)`, "NOTA"],
   answer: "E",
   solution: String.raw`Compute the cross product:
\[\langle 1,-2,1\rangle\times\langle -2,1,2\rangle=\begin{vmatrix}\mathbf{i}&\mathbf{j}&\mathbf{k}\\1&-2&1\\-2&1&2\end{vmatrix}\]
\[=\mathbf{i}[(-2)(2)-(1)(1)]-\mathbf{j}[(1)(2)-(1)(-2)]+\mathbf{k}[(1)(1)-(-2)(-2)]\]
\[=\mathbf{i}(-4-1)-\mathbf{j}(2+2)+\mathbf{k}(1-4)=\langle -5,-4,-3\rangle.\]
Magnitude: \(\sqrt{25+16+9}=\sqrt{50}=5\sqrt{2}\).
Unit vector: \(\dfrac{1}{5\sqrt{2}}\langle -5,-4,-3\rangle=\dfrac{\sqrt{2}}{10}\langle -5,-4,-3\rangle\).
This does not match any of choices A--D, so the answer is \(\boxed{\text{NOTA}}\).`,
},

{
   id: 20211,
   number: 148,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 1,
   methods: ["Trigonometric Identities"],
   question: String.raw`Which of the following gives a pair of values which are \(\textbf{NOT}\) equal?`,
   choices: [String.raw`\(\cos(25^\circ)\) and \(\cos(-25^\circ)\)`, String.raw`\(\sin(25^\circ)\) and \(\cos(65^\circ)\)`, String.raw`\(\sin(-25^\circ)\) and \(-\sin(25^\circ)\)`, String.raw`\(\sin(25^\circ)\) and \(-\sin(155^\circ)\)`, "NOTA"],
   answer: "D",
   solution: String.raw`A is true: cosine is an even function, so \(\cos(-25^\circ)=\cos(25^\circ)\).
B is true: \(\cos(65^\circ)=\sin(90^\circ-65^\circ)=\sin(25^\circ)\).
C is true: sine is an odd function, so \(\sin(-25^\circ)=-\sin(25^\circ)\).
D: \(\sin(155^\circ)=\sin(180^\circ-155^\circ)=\sin(25^\circ)\), so \(-\sin(155^\circ)=-\sin(25^\circ)\neq\sin(25^\circ)\).
Answer: \(\boxed{D}\).`,
},



{
   id: 20212,
   number: 149,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: [],
   question: String.raw`In \(\triangle PQR, PQ=8, PR=10\), and angle P is obtuse such that \(\tan P=-\dfrac{3}{4}\). Give the area of \(\triangle PQR\).`,
   choices: ["20", "24", "48", "52", "NOTA"],
   answer: "B",
   solution: String.raw`With \(\tan P = -\dfrac{3}{4}\) and P obtuse (second quadrant): \(\sin P = \dfrac{3}{5}, \cos P = -\dfrac{4}{5}\).
Area \(= \dfrac{1}{2}\cdot PQ\cdot PR\cdot\sin P = \dfrac{1}{2}(8)(10)\!\cdot\!\dfrac{3}{5} = 40\cdot\dfrac{3}{5} = \boxed{24}\).`,
},



{
   id: 20213,
   number: 150,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Law of Cosines"],
   question: String.raw`In \(\triangle PQR, PQ=8, PR=10\), and angle P is obtuse such that \(\tan P=-\dfrac{3}{4}\). Find the length of side \(\overline{QR}\).`,
   choices: [String.raw`\(14\sqrt{3}\)`, "16", String.raw`\(2\sqrt{73}\)`, "14", "NOTA"],
   answer: "C",
   solution: String.raw`By the Law of Cosines with \(\cos P = -\dfrac{4}{5}\):
\[QR^2 = PQ^2+PR^2-2\cdot PQ\cdot PR\cdot\cos P = 64+100-2(8)(10)\!\left(-\tfrac{4}{5}\right).\]
\(QR = \boxed{2\sqrt{73}}\).`,
},



{
   id: 20214,
   number: 151,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: [],
   question: String.raw`A parabola has focus at coordinates (-1,5) and vertex at coordinates (-1,-7). If the equation of the parabola is written as \(f(x)=ax^2+bx+c\), find the value of \(3\cdot\) f(3).`,
   choices: [String.raw`-20`, String.raw`-17`, "16", "31", "NOTA"],
   answer: "A",
   solution: String.raw`The vertex is (-1,-7) and focus is (-1,5); the parabola opens upward with \(p=12\).
Equation: \((x+1)^2=4(12)(y+7)=48(y+7)\), so \(f(x)=\dfrac{(x+1)^2}{48}-7\).
\(f(3)=\dfrac{(3+1)^2}{48}-7=\dfrac{16}{48}-7=\dfrac{1}{3}-7=-\dfrac{20}{3}\).
\(3\cdot f(3)=3\!\cdot\!\left(-\dfrac{20}{3}\right)=\boxed{-20}\).`,
},



{
   id: 20215,
   number: 152,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Half-Angle Identity"],
   question: String.raw`If \(\cos\theta=\dfrac{1}{3}\) and \(0<\theta<\dfrac{\pi}{2}\), find \(\sin\!\left(\dfrac{1}{2}\theta\right)\).`,
   choices: [String.raw`\(\dfrac{\sqrt{7}}{6}\)`, String.raw`\(\dfrac{\sqrt{3}}{3}\)`, String.raw`\(\dfrac{\sqrt{7}}{9}\)`, String.raw`\(\dfrac{\sqrt{2}}{6}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Using the half-angle formula: \(\sin\!\left(\dfrac{\theta}{2}\right)=\sqrt{\dfrac{1-\cos\theta}{2}}\).
\[\sin\!\left(\dfrac{\theta}{2}\right)=\sqrt{\dfrac{1-\tfrac{1}{3}}{2}}=\sqrt{\dfrac{\tfrac{2}{3}}{2}}=\sqrt{\dfrac{1}{3}}=\dfrac{1}{\sqrt{3}}=\dfrac{\sqrt{3}}{3}.\]
Answer: \(\boxed{\dfrac{\sqrt{3}}{3}}\).`,
},



{
   id: 20216,
   number: 153,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 4,
   methods: [],
   question: String.raw`Two fixed vertical poles are 20 yards apart in a field, and a dog (Ralph) has his collar attached to a 30-yard-long rope whose endpoints are attached to each pole, 3 ft above ground. Ralph's collar is also 3 ft above ground. Discounting the dimensions of the dog and the poles, find the maximum area that the dog can roam on the ground, in square yards. Assume the poles are perpendicular to the field and the field is planar.`,
   choices: [String.raw`\(25\pi\sqrt{3}\)`, String.raw`\(75\pi\sqrt{3}\)`, String.raw`\(75\pi\sqrt{5}\)`, String.raw`\(150\pi\sqrt{5}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`The locus of points where the rope endpoints are fixed forms an ellipse with foci at the two poles.
The rope has total length \(2a=30\), so \(a=15\). The distance between poles is \(2c=20\), so \(c=10\).
\(b^2=a^2-c^2=225-100=125\), giving \(b=5\sqrt{5}\).
The area of the ellipse is \(\pi ab=\pi(15)(5\sqrt{5})=\boxed{75\pi\sqrt{5}} sq\) yards.`,
},



{
   id: 20217,
   number: 154,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Trigonometric Identities"],
   question: String.raw`Given \(2\tan^2 x - \sec^2 x = 0\) for \(0\le x < 2\pi\), give the sum of the values of x.`,
   choices: [String.raw`\(4.5\pi\)`, String.raw`\(4\pi\)`, String.raw`\(3\pi\)`, String.raw`\(2\pi\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Rewrite: \(2\tan^2 x=\sec^2 x\), i.e. \(\dfrac{2\sin^2 x}{\cos^2 x}=\dfrac{1}{\cos^2 x}\).
So \(2\sin^2 x=1\) (where the expressions are defined), giving \(\sin^2 x=\dfrac{1}{2}, |\sin x|=\dfrac{\sqrt{2}}{2}\).
Solutions on \([0,2\pi)\): \(x=\dfrac{\pi}{4},\dfrac{3\pi}{4},\dfrac{5\pi}{4},\dfrac{7\pi}{4}\).
Sum \(=\dfrac{\pi}{4}+\dfrac{3\pi}{4}+\dfrac{5\pi}{4}+\dfrac{7\pi}{4}=\dfrac{16\pi}{4}=\boxed{4\pi}\).`,
},



{
   id: 20218,
   number: 155,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: ["Asymptotes"],
   question: String.raw`\(f(x)=\dfrac{\log(x)-1}{\log^2(x)-1}\) is graphed on the xy-plane for \(x\ge0\). Which of the following is a vertical asymptote of the graph?
I. \(x=0 \quad II\). \(x=-1 \quad\) III. \(x=\dfrac{1}{10} \quad IV\). \(x=10\)`,
   choices: ["IV only", "I, II only", "III only", "III, IV only", "NOTA"],
   answer: "C",
   solution: String.raw`Factor: \(f(x)=\dfrac{\log x-1}{(\log x-1)(\log x+1)}=\dfrac{1}{\log x+1}\) for \(\log x\neq1\) (i.e. \(x\neq10\), which is a removable discontinuity).
Vertical asymptote where \(\log x+1=0\Rightarrow\log x=-1\Rightarrow x=10^{-1}=\dfrac{1}{10}\).
\(x=0\) is not in the domain but is not an asymptote of the simplified form.
Answer: \(\boxed{\text{III only}}\).`,
},



{
   id: 20219,
   number: 156,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 2,
   methods: [],
   question: String.raw`Consider the graph of \(C_1\) with equation \(x^2+y^2-10x+2y-10=0\). A point P on \(C_1\) is the point on the graph with the least possible distance to point Q(-1,7). What is the distance PQ?`,
   choices: ["10", "8", "6", "4", "NOTA"],
   answer: "D",
   solution: String.raw`Complete the square: \((x-5)^2+(y+1)^2=36\). Circle with center (5,-1) and radius 6.
Distance from center to Q(-1,7): \(\sqrt{(5-(-1))^2+(-1-7)^2}=\sqrt{36+64}=\sqrt{100}=10\).
Minimum distance from Q to the circle: \(10-6=\boxed{4}\).`,
},



{
   id: 20220,
   number: 157,
   division: "Alpha",
   topic: "Functions",
   difficulty: 3,
   methods: ["Nested Functions"],
   question: String.raw`The expression
\[\sqrt{\frac{\tan(x)}{3}-\sqrt{\frac{\tan(x)}{3}-\sqrt{\frac{\tan(x)}{3}-\cdots}}}\]
has value \(\dfrac{1}{2}\), over \(-\dfrac{\pi}{2}<x<\dfrac{\pi}{2}\). Find \(\sec^2 x\).`,
   choices: [String.raw`\(\dfrac{3}{4}\)`, String.raw`\(\dfrac{97}{81}\)`, String.raw`\(\dfrac{25}{16}\)`, String.raw`\(\dfrac{97}{16}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`Let y denote the nested radical. Then \(y=\sqrt{\dfrac{\tan x}{3}-y}\), so \(y^2=\dfrac{\tan x}{3}-y\).
With \(y=\dfrac{1}{2}\): \(\dfrac{1}{4}=\dfrac{\tan x}{3}-\dfrac{1}{2}\), giving \(\dfrac{\tan x}{3}=\dfrac{3}{4}\), so \(\tan x=\dfrac{9}{4}\).
\(\sec^2 x=1+\tan^2 x=1+\dfrac{81}{16}=\dfrac{97}{16}\).
Answer: \(\boxed{\dfrac{97}{16}}\).`,
},



{
   id: 20221,
   number: 158,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 2,
   methods: ["Substitution"],
   question: String.raw`If \(e^{2x}-3e^x=10\) is solved over the real numbers, then \(x=\)`,
   choices: [String.raw`\(\ln 5\)`, String.raw`\(2\ln 2\)`, String.raw`\(\ln 3\)`, String.raw`\(1-\ln 2\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Let \(u=e^x\): \(u^2-3u-10=0\Rightarrow(u-5)(u+2)=0\).
Since \(e^x>0\), we take \(u=5\), giving \(e^x=5, x=\ln5\).
Answer: \(\boxed{\ln 5}\).`,
},



{
   id: 20222,
   number: 159,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: ["Asymptotes"],
   question: String.raw`The graph of \(\dfrac{(y-k)^2}{a^2}-\dfrac{(x-h)^2}{b^2}=1\) has asymptotes with equations \(2x+3y=-4\) and \(2x-3y=8\). Give the sum h-k.`,
   choices: ["3", "1", "0", String.raw`-1`, "NOTA"],
   answer: "A",
   solution: String.raw`The asymptotes intersect at the center (h,k).
Solve: \(2x+3y=-4\) and \(2x-3y=8\). Adding: \(4x=4\Rightarrow x=1\). Then \(3y=-6\Rightarrow y=-2\).
Center: \((h,k)=(1,-2)\). \(h-k=1-(-2)=\boxed{3}\).`,
},



{
   id: 20223,
   number: 160,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: ["Asymptotes"],
   question: String.raw`The graph of \(\dfrac{(y-k)^2}{a^2}-\dfrac{(x-h)^2}{b^2}=1\) has asymptotes with equations \(2x+3y=-4\) and \(2x-3y=8\). If the conjugate axis of the graph has length 6, tell the distance between the foci of the graph.`,
   choices: [String.raw`\(2\sqrt{13}\)`, String.raw`\(4\sqrt{2}\)`, String.raw`\(2\sqrt{39}\)`, String.raw`\(4\sqrt{19}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`The asymptotes have slopes \(\pm\dfrac{2}{3}=\pm\dfrac{a}{b}\), so \(a=2k, b=3k\) for some k.
Conjugate axis \(=2b=6\Rightarrow b=3\Rightarrow k=1\Rightarrow a=2\).
\(c^2=a^2+b^2=4+9=13\), so \(c=\sqrt{13}\) and the distance between foci is \(2c=2\sqrt{13}\).
Answer: \(\boxed{2\sqrt{13}}\).`,
},



{
   id: 20224,
   number: 161,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 2,
   methods: ["Dot Product"],
   question: String.raw`What is the angle between the vectors \(\langle-1,3\rangle\) and \(\langle6,12\rangle\), both of which are in standard position?`,
   choices: [String.raw`\(\dfrac{\pi}{3}\)`, String.raw`\(\dfrac{\pi}{4}\)`, String.raw`\(\arccos\!\left(\dfrac{\sqrt{5}}{2}\right)\)`, String.raw`\(\dfrac{5\pi}{4}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`\(\cos\theta=\dfrac{\langle-1,3\rangle\cdot\langle6,12\rangle}{|\langle-1,3\rangle||\langle6,12\rangle|}=\dfrac{-6+36}{\sqrt{10}\cdot\sqrt{180}}=\dfrac{30}{\sqrt{1800}}=\dfrac{30}{30\sqrt{2}}=\dfrac{1}{\sqrt{2}}\).
\(\theta=\dfrac{\pi}{4}\).
Answer: \(\boxed{\dfrac{\pi}{4}}\).`,
},



{
   id: 20225,
   number: 162,
   division: "Alpha",
   topic: "Polar",
   difficulty: 3,
   methods: [],
   question: String.raw`The polar graph of \(r^2=9\sin(2\theta)\) intersects the polar graph of \(r=2\cos\theta\) at how many points?`,
   choices: ["0", "1", "2", "3", "NOTA"],
   answer: "C",
   solution: String.raw`\(r^2=9\sin(2\theta)\) is a lemniscate; \(r=2\cos\theta\) is a circle.
Substituting \(r=2\cos\theta\) into the lemniscate: \(4\cos^2\theta=9\sin(2\theta)=18\sin\theta\cos\theta\).
Either \(\cos\theta=0\) (pole, \(r=0)\) or \(4\cos\theta=18\sin\theta\Rightarrow\tan\theta=\dfrac{2}{9}\).
\(\tan\theta=\dfrac{2}{9}\) gives one solution in \([0,\pi/2]\); checking with the lemniscate gives one intersection.
Including the pole (verified as a common point) gives \(\boxed{2}\) intersection points.`,
},



{
   id: 20226,
   number: 163,
   division: "Alpha",
   topic: "Binomial Expansion",
   difficulty: 1,
   methods: ["Binomial Theorem"],
   question: String.raw`Give the coefficient of the fourth term of the expansion of \(\left(2x+\dfrac{1}{2x^2}\right)^{10}\), if the first term is \((2x)^{10}\).`,
   choices: ["120", "1920", "3840", "7680", "NOTA"],
   answer: "B",
   solution: String.raw`The kth term (with first term at \(k=1)\) is \(\binom{10}{k-1}(2x)^{10-(k-1)}\!\left(\dfrac{1}{2x^2}\right)^{k-1}\).
For \(k=4\) (fourth term): \(\binom{10}{3}(2x)^7\!\left(\dfrac{1}{2x^2}\right)^3=\binom{10}{3}\cdot2^7\cdot x^7\cdot\dfrac{1}{8x^6}\).
\(=120\cdot128\cdot\dfrac{1}{8}\cdot x=120\cdot16\cdot x=1920x\).
Coefficient: \(\boxed{1920}\).`,
},



{
   id: 20227,
   number: 164,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: [],
   question: String.raw`The population of deer in a small forest is given by \(d(t)=\left\lfloor\dfrac{120}{4+100e^{-t}}\right\rfloor\) at t days after January 1, 2017, for domain and range over whole numbers. \(\lfloor x\rfloor\) is the greatest integer less than or equal to x. As the value of t in days approaches December of 2020, how many deer are in the small forest?`,
   choices: ["120", "30", "20", "1", "NOTA"],
   answer: "B",
   solution: String.raw`December 2020 is approximately 3(365)+334 to 4(365) days, roughly 1400–1460 days.
As \(t\to\infty\): \(100e^{-t}\to0\), so \(d(t)\to\left\lfloor\dfrac{120}{4}\right\rfloor=\lfloor30\rfloor=30\).
At \(t\approx1460\): \(100e^{-1460}\approx0\), so the population is \(\boxed{30}\) deer.`,
},



{
   id: 20228,
   number: 165,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: [],
   question: String.raw`A parabola has directrix equation \(3x-4y=8\) and vertex (0,4). What is the distance between the focus and the directrix?`,
   choices: ["2.4", "4.8", "9.6", "19.2", "NOTA"],
   answer: "C",
   solution: String.raw`Distance from vertex (0,4) to the directrix \(3x-4y-8=0\):
\(p=\dfrac{|3(0)-4(4)-8|}{\sqrt{9+16}}=\dfrac{|-24|}{5}=\dfrac{24}{5}=4.8\).
The distance from focus to directrix is \(2p=2(4.8)=\boxed{9.6}\).`,
},



{
   id: 20229,
   number: 166,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 3,
   methods: [],
   question: String.raw`For the equation \(2\log_3(x)+\log_9(x)=-\dfrac{5}{2}\) solved over the real numbers, find the positive real value of (27x) to the power of \(\left(x+\dfrac{1}{6}\right)\).`,
   choices: [String.raw`\(\dfrac{1}{9}\)`, String.raw`\(\dfrac{1}{3}\)`, "3", "9", "NOTA"],
   answer: "C",
   solution: String.raw`Convert to \(\log_3\): \(\log_9(x)=\dfrac{\log_3 x}{2}\). So \(2\log_3 x+\dfrac{\log_3 x}{2}=\dfrac{5\log_3 x}{2}=-\dfrac{5}{2}\).
\(\log_3 x=-1\Rightarrow x=\dfrac{1}{3}\).
\(27x=27\cdot\dfrac{1}{3}=9\). \(\quad x+\dfrac{1}{6}=\dfrac{1}{3}+\dfrac{1}{6}=\dfrac{1}{2}\).
\((27x)^{x+1/6}=9^{1/2}=\boxed{3}\).`,
},



{
   id: 20230,
   number: 167,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 2,
   methods: ["Rational Root Theorem"],
   question: String.raw`\(f(x)=2x^3-11x^2-x+30\) has zeros \(x_1, x_2\), and \(x_3\). Give the least possible value of \(\left(4^{x_1}\right)\!\left(4^{x_2}\right)\).`,
   choices: [String.raw`\(\dfrac{1}{8}\)`, String.raw`\(\dfrac{1}{4}\)`, "2", "32", "NOTA"],
   answer: "C",
   solution: String.raw`Factor: \(f(x)=(x-2)(2x^2-7x-15)=(x-2)(2x+3)(x-5)\). Zeros: \(2,\,-\dfrac{3}{2},\,5\).
\((4^{x_1})(4^{x_2})=4^{x_1+x_2}\). To minimize, take the two smallest zeros: \(-\dfrac{3}{2}\) and 2.
\(x_1+x_2=-\dfrac{3}{2}+2=\dfrac{1}{2}\). \(\quad 4^{1/2}=\boxed{2}\).`,
},



{
   id: 20231,
   number: 168,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 4,
   methods: ["De Moivre's Theorem"],
   question: String.raw`Which is \(\textbf{NOT}\) a fourth root of \(-8+8i\sqrt{3}\)?`,
   choices: [String.raw`\(\sqrt{3}+i\)`, String.raw`\(-1+i\sqrt{3}\)`, String.raw`\(-1-i\sqrt{3}\)`, String.raw`\(1-i\sqrt{3}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`\(-8+8i\sqrt{3}=16\operatorname{cis}\!\left(\dfrac{2\pi}{3}\right)\).
Fourth roots: \(16^{1/4}\operatorname{cis}\!\left(\dfrac{2\pi/3+2\pi k}{4}\right)=2\operatorname{cis}\!\left(\dfrac{\pi}{6}+\dfrac{\pi k}{2}\right)\) for \(k=0,1,2,3\).
\(k=0\): \(2\operatorname{cis}(\pi/6)=\sqrt{3}+i\) ✓ (A). \(\quad k=1\): \(2\operatorname{cis}(2\pi/3)=-1+i\sqrt{3}\) ✓ (B).
\(k=2\): \(2\operatorname{cis}(7\pi/6)=-\sqrt{3}-i\). \(\quad k=3\): \(2\operatorname{cis}(5\pi/3)=1-i\sqrt{3}\) ✓ (D).
\(-1-i\sqrt{3}\) is not among the four roots. Answer: \(\boxed{C}\).`,
},



{
   id: 20232,
   number: 169,
   division: "Alpha",
   topic: "Polar",
   difficulty: 3,
   methods: [],
   question: String.raw`For \(y^3=2x\) and \(0<\theta<\dfrac{\pi}{2}\), which is a polar representation of the equation?`,
   choices: [String.raw`\(r=\sqrt[3]{2}\tan\theta\sec^2\theta\)`, String.raw`\(r^2=2\tan\theta\sec^2\theta\)`, String.raw`\(r=2\cot\theta\csc^2\theta\)`, String.raw`\(r^2=2\cot\theta\csc^2\theta\)`, "NOTA"],
   answer: "D",
   solution: String.raw`Substitute \(x=r\cos\theta\) and \(y=r\sin\theta\):
\((r\sin\theta)^3=2(r\cos\theta)\Rightarrow r^3\sin^3\theta=2r\cos\theta\Rightarrow r^2=\dfrac{2\cos\theta}{\sin^3\theta}=2\cot\theta\csc^2\theta\).
Answer: \(\boxed{r^2=2\cot\theta\csc^2\theta}\).`,
},



{
   id: 20233,
   number: 170,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 3,
   methods: ["Mathematical Induction"],
   question: String.raw`If our task is to prove by Mathematical Induction that
\[P(n)=1^2+2^2+3^2+\cdots+n^2=\frac{1}{6}n(n+1)(2n+1),\]
our first step is to say \(1^2=\dfrac{1}{6}(1)(1+1)(2\cdot1+1)=1\), and say the formula works for \(n=1\). What is our \(2^{\text{nd}}\) step?`,
   choices: [String.raw`Verify that \(\dfrac{1}{6}(2)(2+1)(4+1)\neq2^2\)`, String.raw`Find values for which \((n+1)^2=\dfrac{1}{6}n(n+1)(2n+1)\)`, String.raw`Add \(\dfrac{1}{6}(2)(2+1)(4+1)\) to \(\dfrac{1}{6}n(n+1)(2n+1)\)`, String.raw`Show that \(\dfrac{1}{6}(n+1)(n+2)(2n+3)\) is equal to \(P(n)+1\)`, "NOTA"],
   answer: "E",
   solution: String.raw`In mathematical induction, after verifying the base case \((n=1)\), the second step is:
assume P(n) holds (induction hypothesis), then show P(n+1) follows — i.e. show \(1^2+2^2+\cdots+n^2+(n+1)^2=\dfrac{1}{6}(n+1)(n+2)(2n+3)\).
None of choices A–D describes this correctly. Answer: \(\boxed{\text{NOTA}}\).`,
},



{
   id: 20234,
   number: 171,
   division: "Alpha",
   topic: "Probability",
   difficulty: 3,
   methods: [],
   question: String.raw`A lotto game has the following rules: every week, three different numbers from the set \(\{1,2,3,\ldots,20\}\) are randomly chosen by the lotto officials. These are the "winning numbers." Players each buy a ticket with 3 different numbers of their choice from the same set. What is the probability that a player matches at least two of the winning numbers on the player's ticket to the winning numbers, in any order?`,
   choices: [String.raw`\(\dfrac{13}{285}\)`, String.raw`\(\dfrac{17}{380}\)`, String.raw`\(\dfrac{1}{380}\)`, String.raw`\(\dfrac{26}{285}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Total ways to choose 3 from 20: \(\binom{20}{3}=1140\).
\(P(\text{exactly }2)=\dfrac{\binom{3}{2}\binom{17}{1}}{\binom{20}{3}}=\dfrac{3\cdot17}{1140}=\dfrac{51}{1140}\).
\(P(\text{exactly }3)=\dfrac{\binom{3}{3}}{\binom{20}{3}}=\dfrac{1}{1140}\).
\(P(\text{at least }2)=\dfrac{52}{1140}=\dfrac{13}{285}\).
Answer: \(\boxed{\dfrac{13}{285}}\).`,
},



{
   id: 20235,
   number: 172,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 3,
   methods: [],
   question: String.raw`The graphs of \(9(x-5)^2+25(y-3)^2=225\) and \(x^2+y^2-10x-6y+25=0\) intersect at two points. Find the distance between the two points.`,
   choices: ["10", "6", String.raw`\(3\sqrt{3}\)`, String.raw`\(3\sqrt{2}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Ellipse: \(\dfrac{(x-5)^2}{25}+\dfrac{(y-3)^2}{9}=1\), center (5,3), \(a=5, b=3\).
Circle: \((x-5)^2+(y-3)^2=9\), center (5,3), radius 3.
Both have the same center. The circle's radius equals the ellipse's semi-minor axis \(b=3\).
Substituting the circle into the ellipse: \(-16(x-5)^2=0\Rightarrow x=5\).
Then \((y-3)^2=9\Rightarrow y=0\) or \(y=6\). Points: (5,0) and (5,6), distance \(=\boxed{6}\).`,
},



{
   id: 20236,
   number: 173,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Trigonometric Identities"],
   question: String.raw`For \(\cos\alpha=\dfrac{1}{4}\) and \(0<\alpha<\dfrac{\pi}{2}\), and \(\sin\beta=\dfrac{-1}{4}\) and \(\dfrac{\pi}{2}<\beta<\dfrac{3\pi}{2}\), find the value of \(\cos(\alpha-\beta)\).`,
   choices: [String.raw`\(-\dfrac{\sqrt{15}}{8}\)`, "0", String.raw`\(\dfrac{\sqrt{15}}{4}\)`, String.raw`\(\dfrac{\sqrt{15}}{8}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`\(\sin\alpha=\dfrac{\sqrt{15}}{4}\) (since \(\alpha\) is in Q1).
\(\beta\) with \(\sin\beta=-\dfrac{1}{4}\) and \(\dfrac{\pi}{2}<\beta<\dfrac{3\pi}{2}\): \(\beta\) is in Q3, so \(\cos\beta=-\dfrac{\sqrt{15}}{4}\).
\(\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta=\dfrac{1}{4}\!\cdot\!\left(-\dfrac{\sqrt{15}}{4}\right)+\dfrac{\sqrt{15}}{4}\!\cdot\!\left(-\dfrac{1}{4}\right)=-\dfrac{\sqrt{15}}{16}-\dfrac{\sqrt{15}}{16}=-\dfrac{\sqrt{15}}{8}\).
Answer: \(\boxed{-\dfrac{\sqrt{15}}{8}}\).`,
},



{
   id: 20237,
   number: 174,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 3,
   methods: [],
   question: String.raw`If the sum of the first n positive integers is 150 less than the sum of the first 3n positive integers, what is the sum of the first 5n positive integers?`,
   choices: ["520", "505", "510", "465", "NOTA"],
   answer: "D",
   solution: String.raw`\(\dfrac{1}{2}n(n+1)=\dfrac{1}{2}(3n)(3n+1)-150\).
\(n(n+1)=3n(3n+1)-300\Rightarrow n^2+n=9n^2+3n-300\Rightarrow8n^2+2n-300=0\Rightarrow4n^2+n-150=0\).
\((4n+25)(n-6)=0\Rightarrow n=6\).
Sum of first \(5n=30\) integers: \(\dfrac{1}{2}(30)(31)=\boxed{465}\).`,
},



{
   id: 20238,
   number: 175,
   division: "Alpha",
   topic: "Probability",
   difficulty: 2,
   methods: [],
   question: String.raw`In a group of 50 girls, each girl is either blonde or brunette, and each has either blue eyes or brown eyes. There are 14 blue-eyed blondes. There are 31 brunettes. 18 of the girls are brown-eyed. What is the probability of choosing a girl from this group at random and getting a brown-eyed brunette?`,
   choices: [String.raw`\(\dfrac{1}{10}\)`, String.raw`\(\dfrac{7}{50}\)`, String.raw`\(\dfrac{9}{25}\)`, String.raw`\(\dfrac{13}{50}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`14 blue-eyed blondes (given). Total girls \(=50\), brunettes \(=31\), so blondes \(=19\).
Brown-eyed blondes \(=19-14=5\). Brown-eyed total \(=18\), so brown-eyed brunettes \(=18-5=13\).
\(P(\text{brown-eyed brunette})=\dfrac{13}{50}\).
Answer: \(\boxed{\dfrac{13}{50}}\).`,
},



{
   id: 20239,
   number: 176,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: [],
   question: String.raw`A Ferris wheel has a seat at point P at time \(t=0\), which is 3 feet above ground. The maximum height of P is 303 ft above ground. Point P makes a complete rotation and is back at its original position every 1.5 minutes. If the distance of point P above ground is given by \(d(t)=-R\cos(St)+U\), for t minutes and d in feet, with R>0, S>0, find the value of \(R+\dfrac{6S}{\pi}+3U\).`,
   choices: ["309", "454", "617", "615", "NOTA"],
   answer: "C",
   solution: String.raw`Since \(d(0)=-R+U=3\), the starting height is the minimum: \(U-R=3\). Also, the maximum gives \(U+R=303\). Adding: \(2U=306\Rightarrow U=153\). Subtracting: \(2R=300\Rightarrow R=150\).
Period \(=\dfrac{2\pi}{S}=1.5\Rightarrow S=\dfrac{4\pi}{3}\).
\(R+\dfrac{6S}{\pi}+3U=150+\dfrac{6\cdot(4\pi/3)}{\pi}+3(153)=150+8+459=\boxed{617}\).`,
},



{
   id: 20240,
   number: 177,
   division: "Alpha",
   topic: "Functions",
   difficulty: 3,
   methods: ["Substitution", "Vieta's Formulas"],
   question: String.raw`If \(f\!\left(\dfrac{x}{2}\right)=x^2-x-1\), find the sum of the values of z so that \(f(2z)=1\).`,
   choices: [String.raw`\(-\dfrac{1}{2}\)`, String.raw`\(-\dfrac{1}{4}\)`, String.raw`\(\dfrac{1}{4}\)`, String.raw`\(\dfrac{1}{2}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`Let \(u=x/2\), so \(x=2u\): \(f(u)=(2u)^2-2u-1=4u^2-2u-1\).
\(f(2z)=4(2z)^2-2(2z)-1=16z^2-4z-1\).
Set \(=1\): \(16z^2-4z-2=0\Rightarrow8z^2-2z-1=0\).
By Vieta's formulas, sum of roots \(=\dfrac{2}{8}=\boxed{\dfrac{1}{4}}\).`,
},



{
   id: 20241,
   number: 178,
   division: "Alpha",
   topic: "Number Theory",
   difficulty: 2,
   methods: ["Parity"],
   question: String.raw`Let S be the sum of the first 13117532 primes, the first prime number starting with 2. Without calculating S or prior knowledge of the number, which of the following could be the units digit of S?`,
   choices: ["2", "4", "6", "8", "NOTA"],
   answer: "E",
   solution: String.raw`The only even prime is 2. Every prime thereafter is odd.
Adding two odd numbers yields an even; adding an odd and an even yields an odd.
So S is the sum of 1 even number and 13117531 odd numbers.
Since 13117531 is odd, the sum of that many odd numbers is odd.
Thus \(S = \text{even} + \text{odd} = \text{odd}\), so S cannot end in 2, 4, 6, or 8.
Answer: \(\boxed{E}\) (NOTA).`,
},


{
   id: 20242,
   number: 179,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 3,
   methods: ["Dot Product"],
   question: String.raw`Vectors \(\vec{J}, \vec{K}\), and \(\vec{L}\) can be expressed as: \(\vec{J}=2\vec{i}+4\vec{j}-6\vec{k}, \vec{K}=3\vec{i}+6\vec{j}+5\vec{k}, \vec{L}=2\vec{k}+4\vec{j}-6\vec{i}\). Which of the following are true?
I. \(\vec{J}\cdot\vec{K}<\vec{K}\cdot\vec{L} \quad II\). \(\vec{J}\parallel\vec{L} \quad\) III. \(\vec{J}\perp\vec{K}\)`,
   choices: ["I only", "II, III", "I, III", "I, II, III", "NOTA"],
   answer: "C",
   solution: String.raw`Rewrite \(\vec{L}=-6\vec{i}+4\vec{j}+2\vec{k}\).
I: \(\vec{J}\cdot\vec{K}=(2)(3)+(4)(6)+(-6)(5)=6+24-30=0\). \(\vec{K}\cdot\vec{L}=(3)(-6)+(6)(4)+(5)(2)=-18+24+10=16\). So 0<16. \(\textbf{True.}\)
II: \(\vec{J}=(2,4,-6)\) and \(\vec{L}=(-6,4,2)\) are not scalar multiples of each other. \(\textbf{False.}\)
III: \(\vec{J}\cdot\vec{K}=0\), so \(\vec{J}\perp\vec{K}\). \(\textbf{True.}\)
Answer: I and III, \(\boxed{C}\).`,
},


{
   id: 20243,
   number: 180,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 2,
   methods: [],
   question: String.raw`Find the sum of the solutions to \(\ln(2\sin x)+\ln(\sin x-1)=\ln(\sin\) x-1) for \(x\in[0,2\pi)\).`,
   choices: [String.raw`\(\pi\)`, String.raw`\(\frac{3\pi}{2}\)`, String.raw`\(\frac{2\pi}{3}\)`, String.raw`\(\frac{4\pi}{3}\)`, "NOTA"],
   answer: "E",
   solution: String.raw`By inspection: \(\ln(\sin x - 1)\) requires \(\sin x - 1 > 0\), i.e. \(\sin x > 1\).
But \(\sin x \le 1\) for all real x, so the domain of the equation is empty.
There are no solutions. Answer: \(\boxed{E}\) (NOTA).
(Algebraically: combining logs gives \(\ln(2\sin^2 x-2\sin x)=\ln(\sin\) x-1), yielding \(\sin x=\frac{1}{2}\) or 1, both extraneous.)`,
},


{
   id: 20244,
   number: 181,
   division: "Alpha",
   topic: "Inequalities",
   difficulty: 3,
   methods: [],
   question: String.raw`The solution set of the inequality \(\frac{2x^2+x-5}{x-5}-x<1\) can be put in the form \((-\infty,A)\cup(B,C)\). Find A+B+C.`,
   choices: ["0", "5", "10", "15", "NOTA"],
   answer: "A",
   solution: String.raw`Domain restriction: \(x\ne 5\). Set the expression equal to 1:
\(\frac{2x^2+x-5}{x-5}-x=1\Rightarrow 2x^2+x-5-x(x-5)=x-5\Rightarrow x^2+5x=0\Rightarrow x(x+5)=0\).
Critical values: \(-5,0,5\). Testing intervals via sign chart gives solution \((-\infty,-5)\cup(0,5)\).
So \(A=-5,\ B=0,\ C=5\), and \(A+B+C=-5+0+5=\boxed{0}\).`,
},


{
   id: 20245,
   number: 182,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 4,
   methods: ["Reflection"],
   question: String.raw`Kamryn lives on Cortez Blvd. \((y=16)\). She begins at her house and travels along the shortest path through the Caloosahatchee River (the x-axis) to Chipotle at (20,20), a total of exactly 39 units. What is the positive difference between the possible x-values of Kamryn's house?`,
   choices: ["10", "20", "30", "40", "NOTA"],
   answer: "C",
   solution: String.raw`Reflect Chipotle (20,20) over the x-axis to \(C'=(20,-20)\).
Let \(K=(x,16)\). The total path length equals \(|KC'|=39\):
\((x-20)^2+(16+20)^2=39^2\Rightarrow(x-20)^2+1296=1521\Rightarrow(x-20)^2=225\).
\(x-20=\pm15\Rightarrow x=5\) or \(x=35\). Difference \(=35-5=\boxed{30}\).`,
},


{
   id: 20246,
   number: 183,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 4,
   methods: ["Reflection"],
   question: String.raw`Kamryn lives on Cortez Blvd. \((y=16)\). She begins at her house and travels along the shortest path through the Caloosahatchee River (the x-axis) to Chipotle at (20,20), a total of exactly 39 units. If \(\theta\) is the angle formed by Kamryn's path towards the Caloosahatchee River and the river itself, then what is \(|\tan(\theta)|\)?`,
   choices: [String.raw`\(\frac{36}{5}\)`, String.raw`\(\frac{18}{5}\)`, String.raw`\(\frac{12}{5}\)`, String.raw`\(\frac{9}{5}\)`, "NOTA"],
   answer: "C",
   solution: String.raw` Reflect Chipotle (20,20) over the x-axis to \(C'=(20,-20)\).
Let \(K=(x,16)\). The total path length equals \(|KC'|=39\):
\((x-20)^2+(16+20)^2=39^2\Rightarrow(x-20)^2+1296=1521\Rightarrow(x-20)^2=225\).
\(x-20=\pm15\Rightarrow x=5\) or \(x=35\). Kamryn's house is at (5,16) (or (35,16)).
The path goes toward \(C'=(20,-20)\).
\(|\tan\theta| = |\text{slope}| = \left|\frac{16-(-20)}{5-20}\right| = \left|\frac{36}{-15}\right| = \frac{12}{5}\).
Answer: \(\boxed{\frac{12}{5}}\).`,
},


{
   id: 20247,
   number: 184,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 4,
   methods: ["Shoelace Theorem"],
   question: String.raw`Let a figure be defined by connecting straight lines in the order (2,10),(-6,4),(9,-6),(-3,-15), then back to (2,10). What is the area enclosed by this figure?`,
   choices: [String.raw`\(\frac{85}{2}\)`, "85", String.raw`\(\frac{157}{2}\)`, "157", "NOTA"],
   answer: "E",
   solution: String.raw`The figure is self-intersecting, so the shoelace theorem cannot be applied directly.
The line through (-6,4) and (9,-6) is \(y=-\frac{2}{3}x\); the line through (2,10) and (-3,-15) is \(y=5x\). They intersect at (0,0).
Split the enclosed region into two triangles at the origin. For the triangle with vertices (0,0),(-6,4),(2,10),
\(A_1=\frac{1}{2}|(-6)(10)-(4)(2)|=34\).
For the triangle with vertices (0,0),(9,-6),(-3,-15),
\(A_2=\frac{1}{2}|(9)(-15)-(-6)(-3)|=\frac{153}{2}\).
Thus \(A=34+\frac{153}{2}=\frac{221}{2}\), which matches none of the choices. Answer: \(\boxed{E}\) (NOTA).`,
},


{
   id: 20248,
   number: 185,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: ["Asymptotes"],
   question: String.raw`How many asymptotes does the function \(f(x)=\frac{x+5}{\sqrt{x^2-9}}\) have?`,
   choices: ["2", "3", "4", "5", "NOTA"],
   answer: "C",
   solution: String.raw`Vertical asymptotes: \(\sqrt{x^2-9}=0\Rightarrow x=\pm3\). Both are non-removable. \(\#\text{VA}=2\).
Horizontal asymptotes: \(\lim_{x\to+\infty}f(x)=1\) and \(\lim_{x\to-\infty}f(x)=-1\). \(\#\text{HA}=2\).
No oblique asymptotes. Total \(=2+2=\boxed{4}\).`,
},


{
   id: 20249,
   number: 186,
   division: "Alpha",
   topic: "Polar",
   difficulty: 3,
   methods: [],
   question: String.raw`Let R be the region bounded above by \(r=-\frac{25}{12\cos\theta-13}, 0\le\theta<\pi\), and bounded below by \(y=0\). What is the area enclosed by R?`,
   choices: [String.raw`\(30\pi\)`, String.raw`\(60\pi\)`, String.raw`\(\frac{65\pi}{2}\)`, String.raw`\(65\pi\)`, "NOTA"],
   answer: "C",
   solution: String.raw`Multiply: \(r(12\cos\theta-13)=-25\Rightarrow 12r\cos\theta-13r=-25\Rightarrow 25+12x=13r\).
Squaring: \((25+12x)^2=169(x^2+y^2)\Rightarrow 625+600x+144x^2=169x^2+169y^2\).
\(\Rightarrow 25x^2-600x+169y^2=625\Rightarrow 25(x-12)^2+169y^2=4225\).
\(\Rightarrow \frac{(x-12)^2}{169}+\frac{y^2}{25}=1\): upper semi-ellipse, \(a=13, b=5\).
Area \(=\frac{1}{2}\pi ab=\frac{1}{2}\pi(13)(5)=\boxed{\frac{65\pi}{2}}\).`,
},


{
   id: 20250,
   number: 187,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 3,
   methods: ["Determinant", "Row Operations"],
   question: String.raw`Evaluate: \(\begin{vmatrix}7&5&0&-10\\6&-1&4&7\\13&8&-2&-4\\4&3&0&-6\end{vmatrix}\).`,
   choices: ["-174", "174", "-58", "58", "NOTA"],
   answer: "D",
   solution: String.raw`Scale \(R_1\to3R_1\), which multiplies the determinant by 3. Then apply \(R_1\to R_1-5R_4\), which does not change the determinant:
\(\begin{bmatrix}21&15&0&-30\\6&-1&4&7\\13&8&-2&-4\\4&3&0&-6\end{bmatrix}\)
\(\longrightarrow\)
\(\begin{bmatrix}1&0&0&0\\6&-1&4&7\\13&8&-2&-4\\4&3&0&-6\end{bmatrix}\).
Expanding along the first row gives
\(3\det(A)=\begin{vmatrix}-1&4&7\\8&-2&-4\\3&0&-6\end{vmatrix}=174\).
Therefore, \(\det(A)=\frac{174}{3}=\boxed{58}\).`,
},


{
   id: 20251,
   number: 188,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 3,
   methods: ["Telescoping", "Partial Fractions"],
   question: String.raw`Evaluate the series: \(\displaystyle\sum_{n=1}^{\infty}\frac{5760}{n^2+2n}\).`,
   choices: ["2880", "4320", "5760", "8640", "NOTA"],
   answer: "B",
   solution: String.raw`\(\frac{5760}{n^2+2n}=\frac{5760}{n(n+2)}=\frac{2880}{n}-\frac{2880}{n+2}\) (partial fractions).
This is a telescoping series:
\(2880\!\left[\!\left(1-\frac{1}{3}\right)+\left(\frac{1}{2}-\frac{1}{4}\right)+\left(\frac{1}{3}-\frac{1}{5}\right)+\cdots\right]=2880\!\left(1+\frac{1}{2}\right)=2880\cdot\frac{3}{2}=\boxed{4320}\).`,
},


{
   id: 20252,
   number: 189,
   division: "Alpha",
   topic: "Inequalities",
   difficulty: 1,
   methods: ["Absolute Value"],
   question: String.raw`How many integer values of x are there such that 4|x-5|+5<1?`,
   choices: ["1", "2", "3", "4", "NOTA"],
   answer: "E",
   solution: String.raw`\(4|x-5|+5<1\Rightarrow 4|x-5|<-4\Rightarrow|x-5|<-1\).
An absolute value is always \(\ge0\), so this is impossible.
There are no solutions. Answer: \(\boxed{E}\) (NOTA).`,
},


{
   id: 20253,
   number: 190,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 4,
   methods: ["Cross Product", "Planes"],
   question: String.raw`The vector equation of plane \(\pi\) is: \(\vec{r}=(3+4t+s)\vec{i}+(5+7t+3s)\vec{j}+(2+6t+8s)\vec{k}\)
where s and t are real parameters. The Cartesian equation is \(Ax+By+Cz+D=0\). Find \(\frac{A+B}{D-C}\).`,
   choices: ["12", "-12", "64", "-64", "NOTA"],
   answer: "A",
   solution: String.raw`Direction vectors: \(\vec{d_1}=(4,7,6), \vec{d_2}=(1,3,8)\).
Normal \(\vec{n}=\vec{d_1}\times\vec{d_2}\):
\(\vec{n}=\bigl(7\cdot8-6\cdot3,\;6\cdot1-4\cdot8,\;4\cdot3-7\cdot1\bigr)=(38,-26,5)\).
Point (3,5,2): \(38(3)-26(5)+5(2)+D=0\Rightarrow114-130+10+D=0\Rightarrow D=6\).
\(\frac{A+B}{D-C}=\frac{38+(-26)}{6-5}=\frac{12}{1}=\boxed{12}\).`,
},


{
   id: 20254,
   number: 191,
   division: "Alpha",
   topic: "Probability",
   difficulty: 2,
   methods: [],
   question: String.raw`A computer generates a 3-digit number uniformly at random. What is the probability that the digits are in strictly decreasing order (540 is an example, 422 is not)?`,
   choices: [String.raw`\(\frac{3}{25}\)`, String.raw`\(\frac{2}{15}\)`, String.raw`\(\frac{1}{6}\)`, String.raw`\(\frac{1}{3}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`The digits must be distinct and can be arranged in exactly one decreasing order.
Number of ways to choose 3 distinct digits from 0--9: \(\binom{10}{3}=120\).
Total 3-digit numbers: 900.
Probability \(=\frac{120}{900}=\boxed{\frac{2}{15}}\).`,
},


{
   id: 20255,
   number: 192,
   division: "Alpha",
   topic: "Binomial Expansion",
   difficulty: 3,
   methods: ["Multinomial Theorem"],
   question: String.raw`Find the coefficient of the \(x^3y\) term in the trinomial expansion \((3x-2y-5z)^4\).`,
   choices: ["54", "-54", "216", "-216", "NOTA"],
   answer: "D",
   solution: String.raw`There is no z-term needed, so set \(z=0\): expand \((3x-2y)^4\).
The \(x^3y\) term: \(\binom{4}{3}(3x)^3(-2y)^1=4\cdot27\cdot(-2)\cdot x^3y=-216x^3y\).
Coefficient \(=\boxed{-216}\).`,
},


{
   id: 20256,
   number: 193,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 2,
   methods: ["Generating Functions"],
   question: String.raw`If the sequence is \(1,2,4,8,16,\ldots\), which of the following is the generating function?`,
   choices: [String.raw`\(\frac{1}{1-x}\)`, String.raw`\(\frac{1}{1+2x}\)`, String.raw`\(\frac{1}{1-2x}\)`, String.raw`\(\frac{1}{1+x}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`\(f(x)=1+2x+4x^2+8x^3+\cdots=\sum_{n=0}^{\infty}(2x)^n=\frac{1}{1-2x}\) (geometric series, ratio 2x).
Answer: \(\boxed{\frac{1}{1-2x}}\).`,
},


{
   id: 20257,
   number: 194,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 2,
   methods: ["Generating Functions"],
   question: String.raw`If the sequence is \(1,0,1,0,1,0,\ldots\), which of the following is the generating function?`,
   choices: [String.raw`\(\frac{1}{1-2x^2}\)`, String.raw`\(\frac{1}{1+2x^2}\)`, String.raw`\(\frac{1}{1+x^2}\)`, String.raw`\(\frac{1}{1-x^2}\)`, "NOTA"],
   answer: "D",
   solution: String.raw`\(f(x)=1+x^2+x^4+x^6+\cdots=\sum_{n=0}^{\infty}(x^2)^n=\frac{1}{1-x^2}\) (geometric, ratio \(x^2)\).
Answer: \(\boxed{\frac{1}{1-x^2}}\).`,
},


{
   id: 20258,
   number: 195,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 2,
   methods: ["Binomial Theorem", "Generating Functions"],
   question: String.raw`If \(a_n=\binom{100}{n}\) and \(a_n=0\) for n>100, which is the generating function?`,
   choices: [String.raw`\(\frac{1}{1+x^{100}}\)`, String.raw`\((x+1)^{100}\)`, String.raw`\((x+2)^{100}\)`, String.raw`\(\frac{2}{1+2x^{100}}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`\(f(x)=\sum_{n=0}^{100}\binom{100}{n}x^n=(x+1)^{100}\) by the Binomial Theorem.
Answer: \(\boxed{(x+1)^{100}}\).`,
},


{
   id: 20259,
   number: 196,
   division: "Alpha",
   topic: "Geometry",
   difficulty: 4,
   methods: ["Law of Cosines"],
   question: String.raw`Suppose there exists a parallelogram ABCD such that \(AB=9, BC=7\), and diagonal \(BD=14\). What is the length of diagonal \(\overline{AC}\)?`,
   choices: ["8", "9", String.raw`\(\sqrt{66}\)`, String.raw`\(4\sqrt{5}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`In \(\triangle BCD\) (with \(BC=7, CD=AB=9, BD=14)\):
\(\cos(\angle BCD)=\frac{7^2+9^2-14^2}{2(7)(9)}=\frac{49+81-196}{126}=\frac{-66}{126}=-\frac{11}{21}\).
Since \(\angle ABC+\angle BCD=180^\circ, \cos(\angle ABC)=\frac{11}{21}\).
\(AC^2=AB^2+BC^2-2(AB)(BC)\cos(\angle ABC)=81+49-2(9)(7)\cdot\frac{11}{21}=130-66=64\).
\(AC=\boxed{8}\).`,
},


{
   id: 20260,
   number: 197,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 3,
   methods: ["Eigenvalues"],
   question: String.raw`If \(A=\begin{bmatrix}2&1\\3&4\end{bmatrix}\) and the two distinct eigenvalues are \(\lambda_1\) and \(\lambda_2\), find \(S=\lambda_1\lambda_2+\lambda_1+\lambda_2\).`,
   choices: ["11", "17", "-1", "1", "NOTA"],
   answer: "A",
   solution: String.raw`\(\det(A-\lambda I)=(2-\lambda)(4-\lambda)-3=\lambda^2-6\lambda+5=0\).
\((\lambda-1)(\lambda-5)=0\Rightarrow\lambda_1=1,\ \lambda_2=5\).
\(S=\lambda_1\lambda_2+\lambda_1+\lambda_2=5+1+5=\boxed{11}\).
(Alternatively: \(\lambda_1\lambda_2=\det(A)=5\); \(\lambda_1+\lambda_2=\operatorname{tr}(A)=6\); \(S=5+6=11.)\)`,
},


{
   id: 20261,
   number: 198,
   division: "Alpha",
   topic: "Number Theory",
   difficulty: 2,
   methods: ["Base Conversion"],
   question: String.raw`The number \(856_9\) can be put into the form \(X_3\). Let \(S =\) (number of digits in X) + (sum of digits of X). Find S.`,
   choices: ["14", "15", "16", "17", "NOTA"],
   answer: "B",
   solution: String.raw`Convert to base 10: \(856_9=8(81)+5(9)+6=648+45+6=699\).
Convert 699 to base 3:
\(699=2(243)+2(81)+1(27)+2(9)+2(3)+0(1)=221220_3\).
Number of digits in \(221220_3\): 6. Sum of digits: \(2+2+1+2+2+0=9\).
\(S=6+9=\boxed{15}\).`,
},


{
   id: 20262,
   number: 199,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 3,
   methods: ["Vieta's Formulas"],
   question: String.raw`Let \(f(x)=4x^4-5x^5+3x^3+5x+2x^2+7x-1\). Let the roots be \(r_1,r_2,r_3,r_4,r_5\). Find \(\frac{1}{r_1}+\frac{1}{r_2}+\frac{1}{r_3}+\frac{1}{r_4}+\frac{1}{r_5}\).`,
   choices: ["12", "-12", "7", "-7", "NOTA"],
   answer: "A",
   solution: String.raw`Rewrite in descending order: \(f(x)=-5x^5+4x^4+3x^3+2x^2+12x-1\) (combining \(5x+7x=12x)\).
By Vieta's: \(r_1r_2r_3r_4r_5=(-1)^5\cdot\frac{-1}{-5}=-\frac{1}{5}\).
Sum of products of 4 roots: \(e_4=(-1)^4\cdot\frac{12}{-5}=-\frac{12}{5}\).
\(\sum\frac{1}{r_i}=\frac{e_4}{e_5}=\frac{-12/5}{-1/5}=\boxed{12}\).`,
},


{
   id: 20263,
   number: 200,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 3,
   methods: ["Cross Product", "Scalar Triple Product"],
   question: String.raw`Dialga is at (5,1,2), Palkia is at (-2,3,5), Giratina is at (0,0,0), and Arceus is at (4,5,-1). Find the volume of the tetrahedron they form.`,
   choices: ["166", "83", String.raw`\(\frac{83}{3}\)`, String.raw`\(\frac{83}{2}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`Using Giratina as origin, edge vectors: \(\vec{v_1}=(5,1,2), \vec{v_2}=(-2,3,5), \vec{v_3}=(4,5,-1)\).
\(V=\frac{1}{6}\left|\det[\vec{v_1},\vec{v_2},\vec{v_3}]\right|\).
\(\det=5(3(-1)-5\cdot5)-1((-2)(-1)-5\cdot4)+2((-2)(5)-3\cdot4)\)
\(=5(-28)-1(-18)+2(-22)=-140+18-44=-166\).
\(V=\frac{1}{6}(166)=\boxed{\frac{83}{3}}\).`,
},


{
   id: 20264,
   number: 201,
   division: "Alpha",
   topic: "Number Theory",
   difficulty: 1,
   methods: ["Fermat's Last Theorem"],
   question: String.raw`Describe the solution set (x,y,z) for \(x^n+y^n=z^n\) for positive integers x,y,z and n>2. (Each choice is a phrase, followed by what it means.)
A: *silence* (infinite solutions). B: 'TAKE THAT!' (finite but >1 solutions).
C: 'HOLD IT!' (exactly one solution). D: 'OBJECTION!' (no solutions). E: NOTA`,
   choices: ["*silence* (infinite solutions)", "TAKE THAT! (finite, >1 solutions)", "HOLD IT! (exactly one solution)", "OBJECTION! (no solutions)", "NOTA"],
   answer: "D",
   solution: String.raw`This is \(\textbf{Fermat's Last Theorem}\): there are no positive integer solutions to
\(x^n+y^n=z^n\) for n>2. Proven by Andrew Wiles in 1995.
Answer: 'OBJECTION!' \(\Rightarrow\boxed{D}\).`,
},


{
   id: 20265,
   number: 202,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 4,
   methods: ["Completing the Square", "Quadratic Formula", "Conjugates"],
   question: String.raw`The roots of \(f(x)=4x^4+16x^2+25\) can be expressed as \(A\pm Bi\) and \(C\pm Di\). Find |A|+|B|+|C|+|D|.`,
   choices: ["8", "6", "4", "2", "NOTA"],
   answer: "C",
   solution: String.raw`\(4x^4+16x^2+25=4x^4+20x^2+25-4x^2=(2x^2+5)^2-(2x)^2\)
\(=(2x^2-2x+5)(2x^2+2x+5)=0\).
For \(2x^2-2x+5=0\): \(x=\frac{2\pm\sqrt{4-40}}{4}=\frac{2\pm6i}{4}=\frac{1}{2}\pm\frac{3}{2}i\).
For \(2x^2+2x+5=0\): \(x=\frac{-2\pm\sqrt{4-40}}{4}=\frac{-2\pm6i}{4}=-\frac{1}{2}\pm\frac{3}{2}i\).
\(|A|+|B|+|C|+|D|=\frac{1}{2}+\frac{3}{2}+\frac{1}{2}+\frac{3}{2}=\boxed{4}\).`,
},


{
   id: 20266,
   number: 203,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 2,
   methods: ["Hyperbolic Functions", "Euler's Formula"],
   question: String.raw`\(\sinh(x)\) is defined as \(\frac{e^x-e^{-x}}{2}\) and \(\cosh(x)\) as \(\frac{e^x+e^{-x}}{2}\). Which of the following expresses \(\sinh(x)\) in terms of trigonometric functions only?`,
   choices: [String.raw`\(-i\sin(ix)\)`, String.raw`\(i\sin(ix)\)`, String.raw`\(-\cos(ix)\)`, String.raw`\(\cos(ix)\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Using \(e^{i\theta}=\cos\theta+i\sin\theta\): \(\sin(ix)=\frac{e^{i(ix)}-e^{-i(ix)}}{2i}=\frac{e^{-x}-e^{x}}{2i}\).
\(-i\sin(ix)=-i\cdot\frac{e^{-x}-e^x}{2i}=\frac{e^x-e^{-x}}{2}=\sinh(x)\).
Answer: \(\boxed{-i\sin(ix)}\).`,
},


{
   id: 20267,
   number: 204,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 2,
   methods: ["Hyperbolic Functions", "Euler's Formula"],
   question: String.raw`Which of the following expresses \(\cosh(x)\) in terms of trigonometric functions only?`,
   choices: [String.raw`\(-i\sin(ix)\)`, String.raw`\(i\sin(ix)\)`, String.raw`\(-\cos(ix)\)`, String.raw`\(\cos(ix)\)`, "NOTA"],
   answer: "D",
   solution: String.raw`\(\cos(ix)=\frac{e^{i(ix)}+e^{-i(ix)}}{2}=\frac{e^{-x}+e^{x}}{2}=\cosh(x)\).
Answer: \(\boxed{\cos(ix)}\).`,
},


{
   id: 20268,
   number: 205,
   division: "Alpha",
   topic: "Hyperbolic Functions",
   difficulty: 2,
   methods: ["Hyperbolic Functions"],
   question: String.raw`Which represents the hyperbolic analog to the Pythagorean identity \(\sin^2(x)+\cos^2(x)=1\)?`,
   choices: [String.raw`\(\cosh^2(x)+\sinh^2(x)=1\)`, String.raw`\(\cosh^2(x)+\sinh^2(x)=-1\)`, String.raw`\(\sinh^2(x)-\cosh^2(x)=1\)`, String.raw`\(\cosh^2(x)-\sinh^2(x)=1\)`, "NOTA"],
   answer: "D",
   solution: String.raw`\(\cosh^2(x)=\frac{e^{2x}+2+e^{-2x}}{4}, \quad \sinh^2(x)=\frac{e^{2x}-2+e^{-2x}}{4}\).
\(\cosh^2(x)-\sinh^2(x)=\frac{4}{4}=\boxed{1}\).`,
},


{
   id: 20269,
   number: 206,
   division: "Alpha",
   topic: "Geometry",
   difficulty: 4,
   methods: ["Pythagorean Theorem"],
   question: String.raw`Define: \(T =\) number of diagonals in a regular icosagon; \(I =\) hypotenuse of a right triangle with legs 65 and 72;
\(M\pi =\) volume of a frustum with height 3, radii 4 and 8; \(Z =\) number of letters in the name of the author of \(\textit{The Elements}\).
If a variable's value is \(\ge100\), add it (start from 0); if <100, subtract it. Find the resultant value.`,
   choices: ["178", "179", "348", "349", "NOTA"],
   answer: "B",
   solution: String.raw`\(T=\frac{20\cdot17}{2}=170\ge100\): add. Running total: +170.
\(I=\sqrt{65^2+72^2}=\sqrt{4225+5184}=\sqrt{9409}=97<100\): subtract. Total: \(170-97=73\).
\(M\pi=\frac{\pi h}{3}(r_1^2+r_1r_2+r_2^2)=\frac{3\pi}{3}(16+32+64)=112\pi\), so \(M=112\ge100\): add. Total: \(73+112=185\).
\(Z=|\text{Euclid}|=6<100\): subtract. Total: \(185-6=\boxed{179}\).`,
},


{
   id: 20270,
   number: 207,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 5,
   methods: ["Telescoping"],
   question: String.raw`Given a and b are relatively prime: \(\displaystyle\sum_{n=1}^{187}\operatorname{arccot}(2n^2)=\arctan\!\left(\frac{a}{b}\right)\). What is 2a+3b?`,
   choices: ["937", "938", "939", "940", "NOTA"],
   answer: "B",
   solution: String.raw`Compute partial sums: \(S_1=\operatorname{arccot}(2)\).
\(S_2=\operatorname{arccot}(2)+\operatorname{arccot}(8)\). Using \(\cot(S_2)=\frac{(2)(8)-1}{2+8}=\frac{15}{10}=\frac{3}{2}\), so \(S_2=\operatorname{arccot}\!\left(\frac{3}{2}\right)\).
\(S_3=\operatorname{arccot}\!\left(\frac{4}{3}\right), S_4=\operatorname{arccot}\!\left(\frac{5}{4}\right)\). Pattern: \(S_n=\operatorname{arccot}\!\left(\frac{n+1}{n}\right)=\arctan\!\left(\frac{n}{n+1}\right)\).
\(S_{187}=\arctan\!\left(\frac{187}{188}\right)\), so \(a=187, b=188, \gcd(187,188)=1 \checkmark\).
\(2a+3b=2(187)+3(188)=374+564=\boxed{938}\).`,
},


{
   id: 20271,
   number: 208,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 2,
   methods: ["De Moivre's Theorem"],
   question: String.raw`If \(x + \frac{1}{x} = 0\), find \(x^6 + \frac{1}{x^6}\).`,
   choices: [String.raw`-2`, String.raw`-1`, "0", "1", "NOTA"],
   answer: "A",
   solution: String.raw`From \(x + \frac{1}{x} = 0\) we get \(x^2 =\) -1, so \(x = \pm i\).
Then \(x^6 = (x^2)^3 = (-1)^3 =\) -1 and \(\frac{1}{x^6} = \frac{1}{-1} =\) -1.
Thus \(x^6 + \frac{1}{x^6} =\) -1 + (-1) \(=\) -2.
Answer: \(\boxed{A}\).`,
},


{
   id: 20272,
   number: 209,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: ["Double-Angle Identity"],
   question: String.raw`A wheel with diameter 2 ft rolls along the underside of a plank. The base of the wheel is 3 ft from the point where the plank contacts the ground (the ground and the plank are tangent to the wheel). Find the slope of the plank from the ground.`,
   choices: [String.raw`\(\frac{1}{3}\)`, String.raw`\(\frac{1}{2}\)`, String.raw`\(\frac{3}{4}\)`, String.raw`\(\frac{4}{3}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`The wheel has radius 1 ft. Let \(\phi\) be half the angle the plank makes with the ground. The wheel's center lies on the angle bisector, and the right triangle formed by the contact point on the ground, the center, and the plank's contact point gives
\(\tan\phi=\frac{1}{3}\).
The plank's slope is therefore
\(\tan(2\phi)=\frac{2\tan\phi}{1-\tan^2\phi}\)
\(=\frac{2\cdot\frac{1}{3}}{1-\frac{1}{9}}\)
\(=\frac{3}{4}\).
Answer: \(\boxed{C}\).`,
},


{
   id: 20273,
   number: 210,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 2,
   methods: ["Dot Product", "Trigonometric Identities"],
   question: String.raw`Let \(\vec{u} = \langle \sin 20^\circ, \cos 40^\circ \rangle\) and \(\vec{v} = \langle \sin(-40^\circ), \cos 20^\circ \rangle\). Find \(\vec{u} \cdot \vec{v}\).`,
   choices: ["0", String.raw`\(\frac{1}{2}\)`, String.raw`\(\frac{\sqrt{3}}{2}\)`, "1", "NOTA"],
   answer: "B",
   solution: String.raw`\(\vec{u} \cdot \vec{v} = \sin 20^\circ \cdot \sin(-40^\circ) + \cos 40^\circ \cdot \cos 20^\circ\).
\(= -\sin 20^\circ \sin 40^\circ + \cos 40^\circ \cos 20^\circ\)
\(= \cos(40^\circ + 20^\circ) = \cos 60^\circ = \frac{1}{2}\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20274,
   number: 211,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 2,
   methods: ["Double-Angle Identity"],
   question: String.raw`Find \(\sin(2\tan^{-1} 5)\).`,
   choices: [String.raw`\(\frac{1}{13}\)`, String.raw`\(\frac{5}{13}\)`, String.raw`\(\frac{10}{13}\)`, String.raw`\(\frac{12}{13}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Let \(\theta = \tan^{-1} 5\), so \(\tan\theta = 5\).
Draw a right triangle with opposite \(= 5\), adjacent \(= 1\), hypotenuse \(= \sqrt{26}\).
\(\sin(2\theta) = 2\sin\theta\cos\theta = 2 \cdot \frac{5}{\sqrt{26}} \cdot \frac{1}{\sqrt{26}} = \frac{10}{26} = \frac{5}{13}\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20275,
   number: 212,
   division: "Alpha",
   topic: "Polar",
   difficulty: 1,
   methods: [],
   question: String.raw`Convert \((\sqrt{2},\ 30^\circ)\) from polar to rectangular coordinates.`,
   choices: [String.raw`\(\left(\frac{\sqrt{6}}{2},\ \frac{\sqrt{2}}{2}\right)\)`, String.raw`\(\left(\frac{\sqrt{2}}{2},\ \frac{\sqrt{6}}{2}\right)\)`, String.raw`\(\left(\frac{\sqrt{3}}{2},\ \frac{1}{2}\right)\)`, String.raw`\((\sqrt{6},\ \sqrt{2})\)`, "NOTA"],
   answer: "A",
   solution: String.raw`\(x = r\cos\theta = \sqrt{2}\cos 30^\circ = \sqrt{2} \cdot \frac{\sqrt{3}}{2} = \frac{\sqrt{6}}{2}\).
\(y = r\sin\theta = \sqrt{2}\sin 30^\circ = \sqrt{2} \cdot \frac{1}{2} = \frac{\sqrt{2}}{2}\).
Answer: \(\boxed{A}\).`,
},


{
   id: 20276,
   number: 213,
   division: "Alpha",
   topic: "Algebra",
   difficulty: 1,
   methods: [],
   question: String.raw`Find the sum of the real solutions to \(6 + \sqrt{x} = x\).`,
   choices: ["4", "7", "9", "13", "NOTA"],
   answer: "C",
   solution: String.raw`Isolate the radical: \(\sqrt{x} = x - 6\). Square both sides: \(x = (x-6)^2 = x^2 -\) 12x + 36.
Rearrange: \(x^2 -\) 13x \(+ 36 = 0 \Rightarrow\) (x-4)(x-9) \(= 0 \Rightarrow x = 4\) or \(x = 9\).
Check \(x = 4\): \(6 + \sqrt{4} = 6 + 2 = 8 \neq 4\). Extraneous.
Check \(x = 9\): \(6 + \sqrt{9} = 6 + 3 = 9\). \(\checkmark\)
The only solution is \(x = 9\). Answer: \(\boxed{C}\).`,
},


{
   id: 20277,
   number: 214,
   division: "Alpha",
   topic: "Quadratics",
   difficulty: 2,
   methods: ["Discriminant Test"],
   question: String.raw`Find the positive value of b such that \(bx^2 + 2x + 1 = x - b\) has exactly one real solution.`,
   choices: [String.raw`\(\frac{\sqrt{2}-1}{2}\)`, String.raw`\(\frac{\sqrt{2}+1}{2}\)`, String.raw`\(\sqrt{2} - 1\)`, String.raw`\(\sqrt{2} + 1\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Rewrite: \(bx^2 + x + (b + 1) = 0\).
For exactly one real solution, the discriminant equals zero:
\(\Delta = 1 -\) 4b(b+1) \(= 0 \Rightarrow 4b^2 + 4b - 1 = 0\).
By the quadratic formula: \(b = \frac{-4 \pm \sqrt{16 + 16}}{8} = \frac{-4 \pm 4\sqrt{2}}{8} = \frac{-1 \pm \sqrt{2}}{2}\).
Taking the positive root: \(b = \frac{\sqrt{2} - 1}{2}\).
Answer: \(\boxed{A}\).`,
},


{
   id: 20278,
   number: 215,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 2,
   methods: ["Conjugates"],
   question: String.raw`Given that f(x) \(= x^4 - 4x^3 - 8x^2 -\) 16x - 48 has 2i as a root, find the sum of all roots of f(x).`,
   choices: ["2", "3", "4", "6", "NOTA"],
   answer: "C",
   solution: String.raw`Since coefficients are real, -2i is also a root.
(x - 2i)(x \(+ 2i) = x^2 + 4\) is a factor.
Divide: f(x) \(\div (x^2 + 4) = x^2 - 4x - 12 =\) (x+2)(x-6).
The four roots are 2i, -2i, -2, 6.
Sum \(= 2i +\) (-2i) + (-2) \(+ 6 = 4\).
Answer: \(\boxed{C}\).`,
},


{
   id: 20279,
   number: 216,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 5,
   methods: [],
   question: String.raw`A circle of radius 1 and a downward-opening parabola whose latus rectum has length 1 are tangent at two points. Those two points of tangency and a point below form an equilateral triangle. Find the distance from the center of the circle to the vertex of the parabola.`,
   choices: ["1", String.raw`\(\frac{5}{4}\)`, String.raw`\(\frac{3}{2}\)`, String.raw`\(\frac{7}{4}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`Let the downward-opening parabola be \(y=-x^2+c\); its latus rectum has length 1. By symmetry, write the circle's center as (0,k) and a tangency point as \((t,c-t^2)\).
The parabola has slope -2t there. The circle \(x^2+(y-k)^2=1\) has slope \(-\frac{x}{y-k}\), so tangency gives
\(-2t=-\frac{t}{c-t^2-k}\Rightarrow c-t^2-k=\frac{1}{2}\).
Because the tangency point is one radius from the center,
\(t^2+\left(\frac{1}{2}\right)^2=1\Rightarrow t^2=\frac{3}{4}\).
Thus \(k=c-t^2-\frac{1}{2}=c-\frac{5}{4}\). The distance from the center to the vertex (0,c) is therefore
\(c-k=\boxed{\frac{5}{4}}\),
so the answer is \(\frac{5}{4}\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20280,
   number: 217,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 2,
   methods: [],
   question: String.raw`Let \(A = \begin{bmatrix}1&0\\0&0\end{bmatrix}, B = \begin{bmatrix}0&1\\0&0\end{bmatrix}, C = \begin{bmatrix}0&0\\0&1\end{bmatrix}, D = \begin{bmatrix}0&0\\1&0\end{bmatrix}\).
Compute \((ABCD)^{2020}\).`,
   choices: [String.raw`\(\begin{bmatrix}1&0\\0&0\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}0&0\\0&1\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}0&1\\0&0\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}0&0\\1&0\end{bmatrix}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Compute step by step: \(AB = \begin{bmatrix}0&1\\0&0\end{bmatrix}\).
ABC \(= AB \cdot C = \begin{bmatrix}0&1\\0&0\end{bmatrix}\begin{bmatrix}0&0\\0&1\end{bmatrix} = \begin{bmatrix}0&1\\0&0\end{bmatrix}\).
ABCD \(= \begin{bmatrix}0&1\\0&0\end{bmatrix}\begin{bmatrix}0&0\\1&0\end{bmatrix} = \begin{bmatrix}1&0\\0&0\end{bmatrix} = A\).
Since ABCD \(= A\) and \(A^2 = A\) (idempotent), \((ABCD)^{2020} = A^{2020} = A = \begin{bmatrix}1&0\\0&0\end{bmatrix}\).
Answer: \(\boxed{A}\).`,
},


{
   id: 20281,
   number: 218,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 3,
   methods: ["Change of Base"],
   question: String.raw`The solution to \(2^x = 3 \cdot 4^x\) can be written as \(x = -\frac{a\log b}{\log c}\), where a,b,c are positive integers and a is as small as possible. Find b-c+a.`,
   choices: ["0", "2", "4", "6", "NOTA"],
   answer: "B",
   solution: String.raw`\(2^x = 3 \cdot 4^x = 3 \cdot 2^{2x}\).
\(2^x \cdot 2^{-2x} = 3 \Rightarrow 2^{-x} = 3 \Rightarrow\) -x \(= \log_2 3\).
\(x = -\log_2 3 = -\frac{\log 3}{\log 2}\).
Thus \(a=1,\ b=3,\ c=2\), and \(b-c+a=3-2+1=2\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20282,
   number: 219,
   division: "Alpha",
   topic: "Polynomials",
   difficulty: 3,
   methods: [],
   question: String.raw`If \(\sum_{n=0}^{4}(x+1)^n = A + Bx + Cx^2 + Dx^3 + Ex^4\), find \(A+B+C+D+E\).`,
   choices: ["16", "25", "31", "32", "NOTA"],
   answer: "C",
   solution: String.raw`Substituting \(x = 1\): \(A + B + C + D + E = \sum_{n=0}^{4}(1+1)^n = \sum_{n=0}^{4} 2^n\).
\(= 1 + 2 + 4 + 8 + 16 = 31\).
Answer: \(\boxed{C}\).`,
},


{
   id: 20283,
   number: 220,
   division: "Alpha",
   topic: "Logs and Exponents",
   difficulty: 2,
   methods: ["Asymptotes"],
   question: String.raw`Find the vertical asymptote of \(y = \ln(\ln(\ln(x)))\).`,
   choices: ["0", "1", String.raw`e`, String.raw`\(e^e\)`, "NOTA"],
   answer: "C",
   solution: String.raw`The outermost \(\ln\) requires its argument \(\ln(\ln(x)) > 0\).
\(\ln(\ln(x)) = 0 \Rightarrow \ln(x) = 1 \Rightarrow x = e\).
So y is defined for x > e, and the vertical asymptote is at \(x = e\).
Answer: \(\boxed{C}\).`,
},


{
   id: 20284,
   number: 221,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 3,
   methods: [],
   question: String.raw`The line \(2y = x + k\) bisects the circle \(x^2 + y^2 -\) 12x - 10y \(= 2112\). Find k.`,
   choices: ["0", "2", "4", "6", "NOTA"],
   answer: "C",
   solution: String.raw`Complete the square: \((x-6)^2 + (y-5)^2 = 2112 + 36 + 25 = 2173\).
Center is (6, 5). A bisecting line must pass through the center.
Substitute into \(2y = x + k\): 2(5) \(= 6 + k \Rightarrow k = 4\).
Answer: \(\boxed{C}\).`,
},


{
   id: 20285,
   number: 222,
   division: "Alpha",
   topic: "Vectors",
   difficulty: 2,
   methods: ["Cross Product", "Dot Product", "Scalar Triple Product"],
   question: String.raw`Let \(\vec{a} = (\sqrt{2}, \sqrt{2}, 0), \vec{b} = (-3\sqrt{2}, 3\sqrt{2}, 0), \vec{c} = (-2\sqrt{3}, 0, 2)\). Find \((\vec{a} \times \vec{b}) \cdot \vec{c}\).`,
   choices: ["12", "18", "20", "24", "NOTA"],
   answer: "D",
   solution: String.raw`\(|\vec{a}| = \sqrt{2+2} = 2, |\vec{b}| = \sqrt{18+18} = 6\).
\(\vec{a} \cdot \vec{b} = (\sqrt{2})(-3\sqrt{2}) + (\sqrt{2})(3\sqrt{2}) + 0 =\) -6 \(+ 6 = 0\), so \(\vec{a} \perp \vec{b}\).
\(|\vec{a} \times \vec{b}| = |\vec{a}||\vec{b}|\sin 90^\circ = 12\). Direction is +z: \(\vec{a} \times \vec{b} = (0, 0, 12)\).
\(\vec{c} = (-2\sqrt{3}, 0, 2), |\vec{c}| = \sqrt{12+4} = 4\).
\((\vec{a} \times \vec{b}) \cdot \vec{c} = 0(-2\sqrt{3}) +\) 0(0) + 12(2) \(= 24\).
Answer: \(\boxed{D}\).`,
},


{
   id: 20286,
   number: 223,
   division: "Alpha",
   topic: "Trigonometry",
   difficulty: 3,
   methods: ["Law of Cosines"],
   question: String.raw`In triangle ABC, angle \(A = 135^\circ\), a \(= 5, c = 1\). Find the area of triangle ABC.`,
   choices: [String.raw`\(\frac{3}{2}\)`, String.raw`\(\frac{5}{2}\)`, "3", String.raw`\(\frac{7}{2}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`By the Law of Cosines,
\(a^2=b^2+c^2-2bc\cos A\).
Substituting \(a=5,\ c=1,\ A=135^\circ\) gives
\(25 = b^2 + 1 - 2b(1)(-\frac{\sqrt{2}}{2}) = b^2 + \sqrt{2}b + 1\), so \(b^2 + \sqrt{2}b - 24 = 0\).
The positive solution is \(b=3\sqrt{2}\). Therefore,
\(\text{Area}=\frac{1}{2}bc\sin A\)
\(=\frac{1}{2}(3\sqrt{2})(1)\left(\frac{\sqrt{2}}{2}\right)\)
\(=\frac{3}{2}\).
Answer: \(\boxed{A}\).`,
},


{
   id: 20287,
   number: 224,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 1,
   methods: ["Discriminant Test"],
   question: String.raw`Identify the type of conic section: \(x^2 +\) 2xy \(+ 3y^2 + 4x + 5y = 0\).`,
   choices: ["Circle", "Parabola", "Non-Circular Ellipse", "Hyperbola", "NOTA"],
   answer: "C",
   solution: String.raw`For \(Ax^2 +\) Bxy \(+ Cy^2 + \ldots = 0\), here \(A=1, B=2, C=3\).
Discriminant: \(B^2 -\) 4AC \(= 4 - 12 =\) -8 < 0.
Since \(B^2 -\) 4AC < 0 and \(A \neq C\), the conic is a non-circular ellipse.
Answer: \(\boxed{C}\).`,
},


{
   id: 20288,
   number: 225,
   division: "Alpha",
   topic: "Functions",
   difficulty: 3,
   methods: [],
   question: String.raw`A function has discontinuities at \(x=A,B,C,D\), where A<B<C<D.
The function is \(f(x)=\frac{1}{(x+2)(2x-1)(2x-3)(x-2)}\).
Compute \(B(D-A)^C\).`,
   choices: ["2", "4", "8", "16", "NOTA"],
   answer: "B",
   solution: String.raw`Given \(A =\) -2, \(B = \frac{1}{2}, C = \frac{3}{2}, D = 2\).
\(D - A = 2 -\) (-2) \(= 4\).
\(B(D-A)^C = \frac{1}{2} \cdot 4^{3/2} = \frac{1}{2} \cdot 8 = 4\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20289,
   number: 226,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 3,
   methods: ["Real and Imaginary Parts"],
   question: String.raw`A complex sequence is defined by \(a_n=(n+i)^2=(b_n+c_n i)^2\), where \(b_n\) and \(c_n\) are positive real sequences.
The first few terms of \(\{a_n\}\) are 0+2i, 3+4i, 8+6i, 15+8i, \(\ldots\)
Find \(b_{10} + c_{10}\).`,
   choices: ["11", "12", "13", "14", "NOTA"],
   answer: "A",
   solution: String.raw`Because \((b_n+c_ni)^2=(n+i)^2\), we have \(b_n+c_ni=\pm(n+i)\). Since \(b_n\) and \(c_n\) are positive, \(b_n=n\) and \(c_n=1\).
\(b_{10} + c_{10} = 10 + 1 = 11\).
Answer: \(\boxed{A}\).`,
},


{
   id: 20290,
   number: 227,
   division: "Alpha",
   topic: "Limits",
   difficulty: 3,
   methods: ["Conjugates"],
   question: String.raw`Evaluate \(\displaystyle\lim_{x \to \pi/4} \frac{1 - \sqrt{\tan x}}{1 - \tan x}\).`,
   choices: [String.raw`\(\frac{1}{2}\)`, String.raw`\(\frac{\sqrt{2}}{2}\)`, "1", String.raw`\(\frac{3}{2}\)`, "NOTA"],
   answer: "A",
   solution: String.raw`Let \(u = \tan x\), so as \(x \to \pi/4, u \to 1\).
\(\lim_{u \to 1} \frac{1 - \sqrt{u}}{1 - u} = \lim_{u \to 1} \frac{1 - \sqrt{u}}{(1-\sqrt{u})(1+\sqrt{u})} = \lim_{u \to 1} \frac{1}{1 + \sqrt{u}} = \frac{1}{2}\).
Answer: \(\boxed{A}\).`,
},


{
   id: 20291,
   number: 228,
   division: "Alpha",
   topic: "Matrices",
   difficulty: 1,
   methods: ["Matrix Inverse"],
   question: String.raw`Find the inverse of \(\begin{bmatrix}5&-3\\-3&2\end{bmatrix}\).`,
   choices: [String.raw`\(\begin{bmatrix}2&-3\\-3&5\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}-2&3\\3&-5\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}2&3\\3&5\end{bmatrix}\)`, String.raw`\(\begin{bmatrix}5&3\\3&2\end{bmatrix}\)`, "NOTA"],
   answer: "C",
   solution: String.raw`For \(M = \begin{bmatrix}a&b\\c&d\end{bmatrix}, M^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\).
\(\det(M) =\) (5)(2) - (-3)(-3) \(= 10 - 9 = 1\).
\(M^{-1} = \begin{bmatrix}2&3\\3&5\end{bmatrix}\).
Answer: \(\boxed{C}\).`,
},


{
   id: 20292,
   number: 229,
   division: "Alpha",
   topic: "Functions",
   difficulty: 2,
   methods: [],
   question: String.raw`Let f(x) \(= \sqrt{e - |\pi - x|}\). If the domain of f is [A, B], find B - A.`,
   choices: [String.raw`e`, String.raw`\(\pi\)`, String.raw`\(e + \pi\)`, String.raw`2e`, "NOTA"],
   answer: "D",
   solution: String.raw`We need \(e - |\pi -\) x| \(\ge 0\), i.e., \(|\pi -\) x| \(\le e\).
-e \(\le \pi - x \le e \Rightarrow \pi - e \le x \le \pi + e\).
So \(A = \pi - e\) and \(B = \pi + e\).
\(B - A = (\pi + e) - (\pi - e) = 2e\).
Answer: \(\boxed{D}\).`,
},


{
   id: 20293,
   number: 230,
   division: "Alpha",
   topic: "Analytic Geometry",
   difficulty: 2,
   methods: ["Optimization"],
   question: String.raw`A rectangle has one corner at the origin and the opposite corner on the line \(y =\) -2x + 4 (with x > 0, y > 0). Find the maximum possible area of the rectangle.`,
   choices: ["1", "2", "3", "4", "NOTA"],
   answer: "B",
   solution: String.raw`Area \(= xy =\) x(-2x \(+ 4) = -2x^2 + 4x\).
This is a downward-opening parabola; maximum at \(x = -\frac{4}{2(-2)} = 1\).
Maximum area \(= -2(1)^2 +\) 4(1) \(= 2\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20294,
   number: 231,
   division: "Alpha",
   topic: "Optimization",
   difficulty: 2,
   methods: ["AM-GM"],
   question: String.raw`Find the maximum value of f(x) \(= \frac{1}{e^x + e^{-x}}\).`,
   choices: ["1", String.raw`\(\frac{1}{2}\)`, String.raw`\(\frac{1}{e}\)`, String.raw`\(\frac{e}{2}\)`, "NOTA"],
   answer: "B",
   solution: String.raw`By AM-GM inequality: \(e^x + e^{-x} \ge 2\sqrt{e^x \cdot e^{-x}} = 2\).
So f(x) \(= \frac{1}{e^x + e^{-x}} \le \frac{1}{2}\).
Equality holds when \(e^x = e^{-x}\), i.e., \(x = 0\).
Maximum value is \(\frac{1}{2}\).
Answer: \(\boxed{B}\).`,
},


{
   id: 20295,
   number: 232,
   division: "Alpha",
   topic: "Combinatorics",
   difficulty: 1,
   methods: [],
   question: String.raw`A pizza restaurant offers 3 sizes and 5 toppings. A customer may choose at most 3 toppings. How many distinct pizzas can be ordered?`,
   choices: ["45", "60", "75", "78", "NOTA"],
   answer: "D",
   solution: String.raw`Number of topping combinations: \(\binom{5}{0} + \binom{5}{1} + \binom{5}{2} + \binom{5}{3} = 1 + 5 + 10 + 10 = 26\).
With 3 sizes: total \(= 3 \times 26 = 78\).
Answer: \(\boxed{D}\).`,
},


{
   id: 20296,
   number: 233,
   division: "Alpha",
   topic: "Polar",
   difficulty: 3,
   methods: [],
   question: String.raw`Which polar curve, when converted to parametric form \(x = x(\theta), y = y(\theta)\), gives \(x = \sin\theta\) and \(y = \sec\theta - \cos\theta\)?`,
   choices: [String.raw`\(r = \sin\theta\)`, String.raw`\(r = \cos\theta\)`, String.raw`\(r = \cot\theta\)`, String.raw`\(r = \tan\theta\)`, "NOTA"],
   answer: "D",
   solution: String.raw`\(x = \sin\theta\) means \(r\cos\theta = \sin\theta\), so \(x = r\cos\theta = \sin\theta\)... let's verify with \(r = \tan\theta\).
If \(r = \tan\theta = \frac{\sin\theta}{\cos\theta}\), then \(x = r\cos\theta = \sin\theta \checkmark\).
\(y = r\sin\theta = \frac{\sin^2\theta}{\cos\theta} = \frac{1-\cos^2\theta}{\cos\theta} = \sec\theta - \cos\theta \checkmark\).
Answer: \(\boxed{D}\).`,
},


{
   id: 20297,
   number: 234,
   division: "Alpha",
   topic: "Functions",
   difficulty: 4,
   methods: ["Asymptotes"],
   question: String.raw`How many linear asymptotes (horizontal and vertical) does \(y = \frac{e^x}{1 - e^x} + \frac{1}{x^2 - x - 6}\) have?`,
   choices: ["1", "2", "3", "4", "NOTA"],
   answer: "E",
   solution: String.raw`First term \(\frac{e^x}{1-e^x}\): vertical asymptote at \(e^x = 1 \Rightarrow x = 0\).
As \(x \to +\infty\): \(\frac{e^x}{1-e^x} \to\) -1 (horizontal asymptote \(y =\) -1).
As \(x \to -\infty\): \(\frac{e^x}{1-e^x} \to 0\) (horizontal asymptote \(y = 0)\).
Second term \(\frac{1}{x^2-x-6} = \frac{1}{(x-3)(x+2)}\): vertical asymptotes at \(x = 3\) and \(x =\) -2.
Total: 3 vertical asymptotes \((x = 0, 3\), -2) and 2 horizontal \((y =\) -1, \(0) = 5\) total
Answer: \(\boxed{E}\).`,
},


{
   id: 20298,
   number: 235,
   division: "Alpha",
   topic: "Complex Numbers",
   difficulty: 2,
   methods: ["De Moivre's Theorem"],
   question: String.raw`Compute \((1 + i)^{2020}\).`,
   choices: [String.raw`\(2^{1010}\)`, String.raw`\(i \cdot 2^{1010}\)`, String.raw`\(-i \cdot 2^{1010}\)`, String.raw`\(-(2^{1010})\)`, "NOTA"],
   answer: "D",
   solution: String.raw`\((1+i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = 2i\).
\((1+i)^{2020} = [(1+i)^2]^{1010} = (2i)^{1010} = 2^{1010} \cdot i^{1010}\).
\(i^{1010} = i^{4 \cdot 252 + 2} = (i^4)^{252} \cdot i^2 = 1 \cdot\) (-1) \(=\) -1.
\((1+i)^{2020} = 2^{1010} \cdot\) (-1) \(= -(2^{1010})\).
Answer: \(\boxed{D}\).`,
},


{
   id: 20299,
   number: 236,
   division: "Alpha",
   topic: "Sequences and Series",
   difficulty: 1,
   methods: [],
   question: String.raw`A government applies successive taxes to the original 10 Rupees at rates of 10%, 5%, 2.5%, and so on indefinitely, with each rate half the preceding rate. Find the total tax collected.`,
   choices: ["1", "2", "3", "4", "NOTA"],
   answer: "B",
   solution: String.raw`
Total rate: \(10\%+5\%+2.5\%+\cdots=\frac{10\%}{1-\frac12}=20\%\).
Total tax: \(10\times20\%=2\) Rupees.
Answer: \(\boxed{B}\).`,
},


{
   id: 20300,
   number: 237,
   division: "Alpha",
   topic: "Conic Sections",
   difficulty: 1,
   methods: [],
   question: String.raw`Find the area enclosed by \(x^2 + y^2 = 1\).`,
   choices: ["1", String.raw`\(2\pi\)`, String.raw`\(\pi\)`, "2", "NOTA"],
   answer: "C",
   solution: String.raw`\(x^2 + y^2 = 1\) is the unit circle with radius \(r = 1\).
Area \(= \pi r^2 = \pi(1)^2 = \pi\).
Answer: \(\boxed{C}\).`,
},

{
  id: 20301,
  number: 238,
  division: "Alpha",
  topic: "Number Theory",
  difficulty: 2,
  methods: [],
  question: String.raw`For how many positive integer values of \(k\) are both \(\frac{k}{3}\) and \(3k\) three-digit integers?`,
  choices: [String.raw`\(12\)`, String.raw`\(27\)`, String.raw`\(33\)`, String.raw`\(34\)`, "NOTA"],
  answer: "A",
  solution: String.raw`For \(\frac{k}{3}\) to be a three-digit integer,
\[
100\le \frac{k}{3}\le 999,
\]
so \(300\le k\le 2997\), and \(k\) must be divisible by \(3\). For \(3k\) to be three-digit,
\[
100\le 3k\le 999,
\]
which gives \(34\le k\le333\). Combining the bounds leaves the multiples of \(3\) from \(300\) through \(333\):
\[
300,303,\ldots,333.
\]
Their number is \(\frac{333-300}{3}+1=12\). Therefore the answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20302,
  number: 239,
  division: "Alpha",
  topic: "Geometry",
  difficulty: 2,
  methods: [],
  question: String.raw`For how many values of \(x\in[0,2\pi)\) does the triangle with vertices \((-5,0)\), \((5,0)\), and \((5\cos x,5\sin x)\) have area \(10\)?`,
  choices: [String.raw`\(2\)`, String.raw`\(3\)`, String.raw`\(4\)`, String.raw`\(6\)`, "NOTA"],
  answer: "C",
  solution: String.raw`The segment joining \((-5,0)\) and \((5,0)\) is a horizontal base of length \(10\). The height from \((5\cos x,5\sin x)\) to the \(x\)-axis is \(|5\sin x|\). Hence
\[
\text{Area}=\frac12(10)|5\sin x|=25|\sin x|.
\]
Setting the area equal to \(10\) gives \(|\sin x|=\frac25\). On \([0,2\pi)\), a nonzero sine magnitude strictly below \(1\) occurs twice above and twice below the \(x\)-axis, for a total of \(4\) values. Therefore the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20303,
  number: 240,
  division: "Alpha",
  topic: "Number Theory",
  difficulty: 3,
  methods: [],
  question: String.raw`The sum of the three largest prime divisors of \(15!-13!\) is \(X\). What is the sum of the digits of \(X\)?`,
  choices: [String.raw`\(7\)`, String.raw`\(8\)`, String.raw`\(15\)`, String.raw`\(16\)`, "NOTA"],
  answer: "A",
  solution: String.raw`Factor out \(13!\):
\[
15!-13!=13!\bigl(15\cdot14-1\bigr)=13!\cdot209=13!\cdot11\cdot19.
\]
The prime divisors contributed by \(13!\) are at most \(13\), while the remaining factor contributes \(19\). Thus the three largest prime divisors are \(19\), \(13\), and \(11\). Their sum is
\[
X=19+13+11=43,
\]
whose digits sum to \(4+3=7\). Therefore the answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20304,
  number: 241,
  division: "Alpha",
  topic: "Probability",
  difficulty: 2,
  methods: ["Conditional Probability"],
  question: String.raw`A bin contains \(3\) red marbles and \(2\) green marbles. Marbles are drawn randomly, one at a time without replacement, until all \(3\) red marbles have been drawn or both green marbles have been drawn. What is the probability that all \(3\) red marbles are drawn first?`,
  choices: [String.raw`\(\frac{3}{10}\)`, String.raw`\(\frac25\)`, String.raw`\(\frac12\)`, String.raw`\(\frac35\)`, "NOTA"],
  answer: "B",
  solution: String.raw`Imagine all five marbles placed in a uniformly random order. The third red marble appears before the second green marble exactly when a green marble is last: if the final marble is green, all three reds have already appeared when the first four draws end; if the final marble is red, both greens appear before the third red. Each marble is equally likely to occupy the final position, and \(2\) of the \(5\) marbles are green. Therefore
\[
P(\text{all reds first})=\frac25.
\]
The answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20305,
  number: 242,
  division: "Alpha",
  topic: "Functions",
  difficulty: 3,
  methods: ["Nested Functions"],
  question: String.raw`Let
\[
g(x)=\sqrt{\frac{x}{x-1}}
\qquad\text{and}\qquad
f(x)=\log_3(x-1).
\]
Find the sum of the integers less than or equal to \(10\) that lie in the domain of \(g(f(x))\).`,
  choices: [String.raw`\(45\)`, String.raw`\(47\)`, String.raw`\(50\)`, String.raw`\(51\)`, "NOTA"],
  answer: "B",
  solution: String.raw`First, \(f(x)\) requires \(x>1\). The expression \(g(u)\) is defined when
\[
\frac{u}{u-1}\ge0
\quad\text{and}\quad u\ne1,
\]
which gives \(u\le0\) or \(u>1\). Substituting \(u=\log_3(x-1)\):
\[
\log_3(x-1)\le0 \Longrightarrow 1<x\le2,
\]
and
\[
\log_3(x-1)>1 \Longrightarrow x>4.
\]
The qualifying integers at most \(10\) are \(2,5,6,7,8,9,10\), whose sum is \(47\). Therefore the answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20306,
  number: 243,
  division: "Alpha",
  topic: "Geometry",
  difficulty: 3,
  methods: ["Point-to-Line Distance Formula"],
  question: String.raw`A semicircle is inscribed in an isosceles triangle with base \(16\) and height \(15\), with the semicircle's diameter contained in the base of the triangle. What is the radius of the semicircle?`,
  choices: [String.raw`\(4\sqrt3\)`, String.raw`\(\frac{17\sqrt3}{2}\)`, String.raw`\(\frac{64}{17}\)`, String.raw`\(\frac{120}{17}\)`, "NOTA"],
  answer: "D",
  solution: String.raw`Place the triangle's base endpoints at \((-8,0)\) and \((8,0)\), and its vertex at \((0,15)\). A sloping side has equation
\[
15x+8y-120=0.
\]
By symmetry, the center of the inscribed semicircle is \((0,0)\). Its radius is the perpendicular distance from this center to either sloping side:
\[
r=\frac{|15(0)+8(0)-120|}{\sqrt{15^2+8^2}}
=\frac{120}{17}.
\]
Therefore the answer is \(\boxed{\text{D}}\).`,
},

{
  id: 20307,
  number: 244,
  division: "Alpha",
  topic: "Trigonometry",
  difficulty: 4,
  methods: ["Double-Angle Identity"],
  question: String.raw`Given
\[
8\sin^5k\cos k+1-8\sin k\cos^5k=0,
\]
find the smallest positive angle \(k\), in degrees, that satisfies the equation.`,
  choices: [String.raw`\(7.5^\circ\)`, String.raw`\(15^\circ\)`, String.raw`\(37.5^\circ\)`, String.raw`\(75^\circ\)`, "NOTA"],
  answer: "A",
  solution: String.raw`Move the trigonometric terms to the other side and factor:
\[
1=8\sin k\cos k\bigl(\cos^4k-\sin^4k\bigr).
\]
Because \(\cos^4k-\sin^4k=(\cos^2k-\sin^2k)(\cos^2k+\sin^2k)=\cos(2k)\),
\[
1=8\sin k\cos k\cos(2k)=4\sin(2k)\cos(2k)=2\sin(4k).
\]
Thus \(\sin(4k)=\frac12\). The smallest positive possibility is \(4k=30^\circ\), so \(k=7.5^\circ\). Therefore the answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20308,
  number: 245,
  division: "Alpha",
  topic: "Analytic Geometry",
  difficulty: 2,
  methods: ["Point-to-Line Distance Formula"],
  question: String.raw`Let \(L\) be the locus of points equidistant from the point \((-1,0)\) and the line \(x=3\). If \((M,4)\) lies on \(L\), compute \(M\).`,
  choices: [String.raw`\(-3\)`, String.raw`\(-1\)`, String.raw`\(4\sqrt2-1\)`, String.raw`\(4\sqrt2+1\)`, "NOTA"],
  answer: "B",
  solution: String.raw`The locus is a parabola with focus \((-1,0)\) and directrix \(x=3\). Its vertex is the midpoint \((1,0)\), and \(p=-2\), so its equation is
\[
y^2=4p(x-1)=-8(x-1).
\]
Substituting \((M,4)\) gives
\[
16=-8(M-1),
\]
so \(M-1=-2\) and \(M=-1\). Therefore the answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20309,
  number: 246,
  division: "Alpha",
  topic: "Geometry",
  difficulty: 3,
  methods: ["Law of Cosines"],
  question: String.raw`One side of a triangle has twice the length of another side, and the third side has length \(6\). If \(6\) is the longest side and one angle of the triangle is \(120^\circ\), then the product of the other two side lengths can be written as \(\frac{L}{U}\), where \(L\) and \(U\) are relatively prime positive integers. Compute \(L+U\).`,
  choices: [String.raw`\(41\)`, String.raw`\(55\)`, String.raw`\(75\)`, String.raw`\(79\)`, "NOTA"],
  answer: "D",
  solution: String.raw`The longest side lies opposite the largest angle, so the side of length \(6\) is opposite the \(120^\circ\) angle. Let the other sides be \(x\) and \(2x\). By the Law of Cosines,
\[
6^2=x^2+(2x)^2-2(x)(2x)\cos120^\circ.
\]
Since \(\cos120^\circ=-\frac12\), this becomes \(36=7x^2\), so \(x^2=\frac{36}{7}\). The product of the other sides is
\[
x(2x)=2x^2=\frac{72}{7}.
\]
Thus \(L+U=72+7=79\), and the answer is \(\boxed{\text{D}}\).`,
},

{
  id: 20310,
  number: 247,
  division: "Alpha",
  topic: "Polynomials",
  difficulty: 3,
  methods: [],
  question: String.raw`It is known that
\[
f(x)=3x^2+x^3-x^7
\]
has no negative real roots. How many nonreal roots does \(f\) have, counted with multiplicity?`,
  choices: [String.raw`\(0\)`, String.raw`\(2\)`, String.raw`\(4\)`, String.raw`\(6\)`, "NOTA"],
  answer: "C",
  solution: String.raw`Factor
\[
f(x)=x^2(3+x-x^5).
\]
Thus \(x=0\) is a real root of multiplicity \(2\). In descending order, the remaining factor is \(-x^5+x+3\), whose signs change exactly once. By Descartes' Rule of Signs, it has exactly one positive real root. The problem states that there are no negative real roots. A degree-seven polynomial has seven complex roots counted with multiplicity, so the number of nonreal roots is
\[
7-2-1=4.
\]
Therefore the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20311,
  number: 248,
  division: "Alpha",
  topic: "Trigonometry",
  difficulty: 4,
  methods: ["Trigonometric Identities"],
  question: String.raw`Find the smallest positive value of \(L\), in degrees, given that
\[
\sin(L-U)+\cos(L+U)=0
\qquad\text{and}\qquad
\tan U=\frac{1}{2026}.
\]`,
  choices: [String.raw`\(45^\circ\)`, String.raw`\(60^\circ\)`, String.raw`\(120^\circ\)`, String.raw`\(135^\circ\)`, "NOTA"],
  answer: "D",
  solution: String.raw`Expand the angle sums:
\[
\sin L\cos U-\cos L\sin U+\cos L\cos U-\sin L\sin U=0.
\]
Dividing by \(\cos L\cos U\) gives
\[
\tan L-\tan U+1-\tan L\tan U=0.
\]
Factor the left side:
\[
(1+\tan L)(1-\tan U)=0.
\]
Because \(\tan U=\frac1{2026}\ne1\), we must have \(\tan L=-1\). The smallest positive angle with tangent \(-1\) is \(135^\circ\). Therefore the answer is \(\boxed{\text{D}}\).`,
},

{
  id: 20312,
  number: 249,
  division: "Alpha",
  topic: "Probability",
  difficulty: 3,
  methods: ["Conditional Probability", "Binomial Theorem"],
  question: String.raw`The Snowman flips \(5\) fair coins and Jwigs flips \(2\) fair coins. The probability that Jwigs obtains more heads than the Snowman can be written as \(\frac{L}{U}\), where \(L\) and \(U\) are relatively prime positive integers. Compute \(L+U\).`,
  choices: [String.raw`\(7\)`, String.raw`\(17\)`, String.raw`\(33\)`, String.raw`\(39\)`, "NOTA"],
  answer: "B",
  solution: String.raw`Let \(J\) and \(S\) be the respective numbers of heads. Since \(J\le2\), the event \(J>S\) consists of
\[
(J,S)=(1,0),(2,0),(2,1).
\]
Using the binomial probabilities,
\[
P(J>S)
=\frac{2}{4}\frac{1}{32}
+\frac{1}{4}\frac{1}{32}
+\frac{1}{4}\frac{5}{32}
=\frac{8}{128}
=\frac{1}{16}.
\]
Thus \(L+U=1+16=17\), and the answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20313,
  number: 250,
  division: "Alpha",
  topic: "Combinatorics",
  difficulty: 2,
  methods: [],
  question: String.raw`How many four-digit positive integers have four different digits, are multiples of \(5\), and have \(5\) as their largest digit?`,
  choices: [String.raw`\(48\)`, String.raw`\(60\)`, String.raw`\(84\)`, String.raw`\(108\)`, "NOTA"],
  answer: "C",
  solution: String.raw`A multiple of \(5\) ends in \(0\) or \(5\).

If the last digit is \(0\), the other three distinct digits must come from \(\{1,2,3,4,5\}\) and must include \(5\). Choose the other two digits in \(\binom42=6\) ways and arrange the three leading digits in \(3!=6\) ways, giving \(36\).

If the last digit is \(5\), choose and arrange three digits from \(\{0,1,2,3,4\}\), but do not allow \(0\) in the thousands place. This gives
\[
5\cdot4\cdot3-1\cdot4\cdot3=60-12=48.
\]
The total is \(36+48=84\), so the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20314,
  number: 251,
  division: "Alpha",
  topic: "Geometry",
  difficulty: 4,
  methods: ["Pythagorean Theorem"],
  question: String.raw`Trapezoid \(SNOW\) has parallel bases \(\overline{SN}\) and \(\overline{OW}\). Point \(R\) is the midpoint of \(\overline{SW}\), and \(\angle NOR\) is a right angle. If \(SN=NO=7\) and \(OW=18\), what is \(NR\)?`,
  choices: [String.raw`\(\sqrt{193}\)`, String.raw`\(\sqrt{130}\)`, String.raw`\(\frac{\sqrt{674}}2\)`, String.raw`\(2\sqrt7\)`, "NOTA"],
  answer: "A",
  solution: String.raw`Let \(Q\) be the midpoint of \(\overline{NO}\). Since \(R\) and \(Q\) are the midpoints of the trapezoid's legs, \(\overline{RQ}\) is its midsegment. Therefore
\[
RQ=\frac{SN+OW}{2}=\frac{7+18}{2}=\frac{25}{2}.
\]
Also, \(OQ=\frac72\). Because \(\angle NOR=90^\circ\), triangle \(ROQ\) is right at \(O\), so
\[
RO=\sqrt{\left(\frac{25}{2}\right)^2-\left(\frac72\right)^2}=12.
\]
Finally, triangle \(NOR\) is right with legs \(NO=7\) and \(OR=12\). Hence
\[
NR=\sqrt{7^2+12^2}=\sqrt{193}.
\]
Therefore the answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20315,
  number: 252,
  division: "Alpha",
  topic: "Complex Numbers",
  difficulty: 2,
  methods: ["Real and Imaginary Parts"],
  question: String.raw`The two complex numbers whose squares equal \(5-12i\) are \(M+Ri\) and \(L+Ui\), where \(M,R,L,U\) are integers. Compute \(MR\).`,
  choices: [String.raw`\(-12\)`, String.raw`\(-6\)`, String.raw`\(6\)`, String.raw`\(12\)`, "NOTA"],
  answer: "B",
  solution: String.raw`Write a square root as \(a+bi\). Then
\[
(a+bi)^2=(a^2-b^2)+2ab\,i=5-12i,
\]
so \(a^2-b^2=5\) and \(2ab=-12\). The integer solution is \(a=3\), \(b=-2\), giving one root \(3-2i\); the other is its negative, \(-3+2i\). For either root, the product of its real and imaginary coefficients is
\[
MR=(3)(-2)=(-3)(2)=-6.
\]
Therefore the answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20316,
  number: 253,
  division: "Alpha",
  topic: "Number Theory",
  difficulty: 4,
  methods: ["Difference of Squares"],
  question: String.raw`Evaluate
\[
\left\lfloor
\frac{2027^3}{2025\cdot2026}
-\frac{2025^3}{2026\cdot2027}
\right\rfloor.
\]`,
  choices: [String.raw`\(2\)`, String.raw`\(4\)`, String.raw`\(7\)`, String.raw`\(8\)`, "NOTA"],
  answer: "D",
  solution: String.raw`Let \(x=2026\). Combining the two fractions gives
\[
\frac{(x+1)^4-(x-1)^4}{(x-1)x(x+1)}.
\]
The numerator simplifies to \(8x^3+8x=8x(x^2+1)\), so the expression equals
\[
\frac{8(x^2+1)}{x^2-1}
=8+\frac{16}{x^2-1}.
\]
For \(x=2026\), the added fraction is strictly between \(0\) and \(1\). Therefore the floor is \(8\), and the answer is \(\boxed{\text{D}}\).`,
},

{
  id: 20317,
  number: 254,
  division: "Alpha",
  topic: "Conic Sections",
  difficulty: 3,
  methods: ["Completing the Square", "Asymptotes"],
  question: String.raw`Find an equation of one asymptote of the hyperbola
\[
49y^2-4x^2+98y-48x-291=0.
\]`,
  choices: [String.raw`\(7x-2y=-40\)`, String.raw`\(7x-2y=44\)`, String.raw`\(2x-7y=19\)`, String.raw`\(2x-7y=-5\)`, "NOTA"],
  answer: "D",
  solution: String.raw`Complete both squares:
\[
49(y+1)^2-4(x+6)^2=196,
\]
so the standard form is
\[
\frac{(y+1)^2}{4}-\frac{(x+6)^2}{49}=1.
\]
Its asymptotes satisfy
\[
y+1=\pm\frac27(x+6).
\]
Using the positive sign gives \(7y+7=2x+12\), or
\[
2x-7y=-5.
\]
Therefore the answer is \(\boxed{\text{D}}\).`,
},

{
  id: 20318,
  number: 255,
  division: "Alpha",
  topic: "Polynomials",
  difficulty: 2,
  methods: ["Vieta's Formulas"],
  question: String.raw`The roots of the polynomial \(g(x)\) are \(-5\), \(2\), \(3\), and \(7\). The constant term of \(g(x)\) is \(105\), and the degree of \(g\) is minimized. What is the sum of the coefficients of \(g(x)\)?`,
  choices: [String.raw`\(-42\)`, String.raw`\(-36\)`, String.raw`\(36\)`, String.raw`\(42\)`, "NOTA"],
  answer: "C",
  solution: String.raw`The minimum-degree polynomial has the form
\[
g(x)=a(x+5)(x-2)(x-3)(x-7).
\]
Its constant term is \(-210a\), so \(-210a=105\) and \(a=-\frac12\). The sum of a polynomial's coefficients is \(g(1)\):
\[
g(1)=-\frac12(6)(-1)(-2)(-6)=36.
\]
Therefore the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20319,
  number: 256,
  division: "Alpha",
  topic: "Probability",
  difficulty: 4,
  methods: ["Conditional Probability"],
  question: String.raw`Snow rolls a fair six-sided die three times. It is known that the positive difference between the first two rolls equals the third roll. What is the probability that at least one of the three rolls is \(3\)?`,
  choices: [String.raw`\(\frac{5}{72}\)`, String.raw`\(\frac{7}{108}\)`, String.raw`\(\frac{7}{15}\)`, String.raw`\(\frac{8}{15}\)`, "NOTA"],
  answer: "C",
  solution: String.raw`Under the given condition, the first two rolls must be distinct, and then the third roll is uniquely determined by their difference. Thus there are \(6\cdot5=30\) equally likely valid ordered triples.

There are \(6\) triples whose third roll is \(3\), corresponding to ordered first-roll pairs with difference \(3\). There are \(5\) valid triples with first roll \(3\) and \(5\) with second roll \(3\). The triples \((3,6,3)\) and \((6,3,3)\) have each been counted twice, so inclusion-exclusion gives
\[
6+5+5-2=14
\]
favorable triples. The conditional probability is
\[
\frac{14}{30}=\frac{7}{15}.
\]
Therefore the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20320,
  number: 257,
  division: "Alpha",
  topic: "Trigonometry",
  difficulty: 3,
  methods: ["Trigonometric Identities"],
  question: String.raw`Given
\[
\sin x=-\frac5{13},\quad 0<x<\frac{3\pi}{2},
\qquad
\csc y=\frac{\sqrt{10}}3,\quad \frac\pi2<y<\pi,
\]
find \(\cos(x-y)\).`,
  choices: [String.raw`\(-\frac{3\sqrt{10}}{130}\)`, String.raw`\(-\frac{27\sqrt{10}}{130}\)`, String.raw`\(\frac{27\sqrt{10}}{130}\)`, String.raw`\(\frac{-120+13\sqrt{10}}{130}\)`, "NOTA"],
  answer: "A",
  solution: String.raw`The restrictions place \(x\) in Quadrant III, so \(\cos x=-\frac{12}{13}\). They place \(y\) in Quadrant II. Since \(\sin y=\frac3{\sqrt{10}}\), we have \(\cos y=-\frac1{\sqrt{10}}\). Therefore
\[
\cos(x-y)=\cos x\cos y+\sin x\sin y
=\frac{12}{13\sqrt{10}}-\frac{15}{13\sqrt{10}}
=-\frac{3\sqrt{10}}{130}.
\]
Therefore the answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20321,
  number: 258,
  division: "Alpha",
  topic: "Geometry",
  difficulty: 5,
  methods: ["Angle Bisector Theorem"],
  question: String.raw`Triangle \(XYZ\) is inscribed in a circle. The angle bisector through \(X\) intersects \(\overline{YZ}\) at \(W\) and intersects the circle again at \(K\). If \(XY:XZ=4:1\) and \(XW\cdot WK=36\), what is the length of \(YZ\)?`,
  choices: [String.raw`\(3\)`, String.raw`\(12\)`, String.raw`\(15\)`, String.raw`\(16\)`, "NOTA"],
  answer: "C",
  solution: String.raw`By the Angle Bisector Theorem,
\[
YW:WZ=XY:XZ=4:1.
\]
Write \(YW=4a\) and \(WZ=a\). The intersecting chords \(XK\) and \(YZ\) meet at \(W\), so
\[
XW\cdot WK=YW\cdot WZ.
\]
Thus \(36=(4a)(a)=4a^2\), giving \(a=3\). Therefore
\[
YZ=YW+WZ=4a+a=5a=15.
\]
The answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20322,
  number: 259,
  division: "Alpha",
  topic: "Logs and Exponents",
  difficulty: 3,
  methods: ["Logarithms", "Vieta's Formulas"],
  question: String.raw`What is the sum of the real solutions to
\[
7^{3x^2}\cdot5^x=11?
\]`,
  choices: [String.raw`\(\log_5 7\)`, String.raw`\(\frac{\log(1/5)}{\log7}\)`, String.raw`\(\frac{\log5}{3\log7}\)`, String.raw`\(-\frac{\log5}{3\log7}\)`, "NOTA"],
  answer: "D",
  solution: String.raw`Take logarithms of both sides:
\[
3x^2\log7+x\log5-\log11=0.
\]
This is a quadratic in \(x\). By Vieta's formulas, the sum of its roots is the negative coefficient of \(x\) divided by the coefficient of \(x^2\):
\[
-\frac{\log5}{3\log7}.
\]
The discriminant is positive, so both roots are real. Therefore the answer is \(\boxed{\text{D}}\).`,
},

{
  id: 20323,
  number: 260,
  division: "Alpha",
  topic: "Analytic Geometry",
  difficulty: 3,
  methods: ["Distance Formula"],
  question: String.raw`A line intersects the graph of \(y=|x|\) at points \(L\) and \(U\). The midpoint of \(\overline{LU}\) is \((3,4)\). Find the length of \(\overline{LU}\).`,
  choices: [String.raw`\(6\sqrt2\)`, String.raw`\(4\sqrt5\)`, String.raw`\(10\)`, String.raw`\(8\sqrt2\)`, "NOTA"],
  answer: "C",
  solution: String.raw`The two intersection points must lie on opposite branches of \(y=|x|\). Write them as \((a,a)\) and \((b,-b)\), where \(a\ge0\) and \(b\le0\). The midpoint condition gives
\[
\frac{a+b}{2}=3,
\qquad
\frac{a-b}{2}=4.
\]
Thus \(a+b=6\) and \(a-b=8\), so \(a=7\) and \(b=-1\). The points are \((7,7)\) and \((-1,1)\), and their distance is
\[
\sqrt{(7-(-1))^2+(7-1)^2}=\sqrt{8^2+6^2}=10.
\]
Therefore the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20324,
  number: 261,
  division: "Alpha",
  topic: "Trigonometry",
  difficulty: 5,
  methods: ["Trigonometric Identities", "Substitution"],
  question: String.raw`Let \(S\) be the set of intersection points of the graphs
\[
y=5\sec x+2\sin(2x)
\qquad\text{and}\qquad
y=5\tan x+8\cos x
\]
on \([0,2\pi]\). Find the product of the \(y\)-coordinates of all points in \(S\).`,
  choices: [String.raw`\(-\frac{49}{3}\)`, String.raw`\(-\frac{25}{3}\)`, String.raw`\(-\frac{16}{3}\)`, String.raw`\(-\frac43\)`, "NOTA"],
  answer: "A",
  solution: String.raw`At any intersection, \(\cos x\ne0\) because \(\sec x\) and \(\tan x\) must be defined. Set the expressions equal and multiply by \(\cos x\):
\[
5+4\sin x\cos^2x=5\sin x+8\cos^2x.
\]
With \(s=\sin x\) and \(\cos^2x=1-s^2\), this becomes
\[
4s^3-8s^2+s+3=0
=(s-1)(2s-3)(2s+1).
\]
The value \(s=\frac32\) is impossible, and \(s=1\) occurs where \(\cos x=0\), outside the original domains. Thus \(\sin x=-\frac12\), giving \(x=\frac{7\pi}{6},\frac{11\pi}{6}\). The corresponding \(y\)-values are
\[
-\frac{7\sqrt3}{3}
\quad\text{and}\quad
\frac{7\sqrt3}{3}.
\]
Their product is \(-\frac{49}{3}\), so the answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20325,
  number: 262,
  division: "Alpha",
  topic: "Simplification",
  difficulty: 4,
  methods: ["Difference of Squares"],
  question: String.raw`For values of \(M\) and \(U\) for which it is defined, simplify
\[
\frac{(M^2-3^2-U^2)^2-4(3U)^2}
{(M^2-U^2-6M+9)(M^2+3M+3U-U^2)}.
\]`,
  choices: [String.raw`\(1\)`, String.raw`\(\frac{M+U+3}{M+U}\)`, String.raw`\(\frac{M-U+3}{M-U}\)`, String.raw`\(\frac{M+U-9}{M+U+9}\)`, "NOTA"],
  answer: "B",
  solution: String.raw`Factor the numerator as a difference of squares:
\[
\begin{aligned}
&(M^2-9-U^2)^2-(6U)^2\\
&=(M^2-(U+3)^2)(M^2-(U-3)^2)\\
&=(M-U-3)(M+U+3)(M-U+3)(M+U-3).
\end{aligned}
\]
The denominator factors as
\[
\begin{aligned}
M^2-U^2-6M+9&=(M-U-3)(M+U-3),\\
M^2+3M+3U-U^2&=(M+U)(M-U+3).
\end{aligned}
\]
Canceling the common factors, while retaining the original domain restrictions, leaves
\[
\frac{M+U+3}{M+U}.
\]
Therefore the answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20326,
  number: 263,
  division: "Alpha",
  topic: "Geometry",
  difficulty: 4,
  methods: ["Shoelace Theorem"],
  question: String.raw`In triangle \(WIG\), \(m\angle WIG=150^\circ\), \(WI=3\sqrt3\), and \(IG=4\). A line perpendicular to \(\overline{WI}\) is constructed through \(W\), and a line perpendicular to \(\overline{IG}\) is constructed through \(G\). The perpendicular lines intersect at \(J\). Find the area enclosed by quadrilateral \(JWIG\).`,
  choices: [String.raw`\(13\sqrt3+21\)`, String.raw`\(50\sqrt3\)`, String.raw`\(\frac{91\sqrt3}{2}\)`, String.raw`\(\frac{109\sqrt3}{2}\)`, "NOTA"],
  answer: "C",
  solution: String.raw`Place \(I=(0,0)\) and \(W=(3\sqrt3,0)\). Since \(IG=4\) and its direction is \(150^\circ\),
\[
G=(4\cos150^\circ,4\sin150^\circ)=(-2\sqrt3,2).
\]
The line through \(W\) perpendicular to \(WI\) is \(x=3\sqrt3\). A direction perpendicular to \(IG\) is \((2,2\sqrt3)\), so the other line is
\[
(-2\sqrt3,2)+t(2,2\sqrt3).
\]
Setting its \(x\)-coordinate equal to \(3\sqrt3\) gives \(t=\frac{5\sqrt3}{2}\), hence \(J=(3\sqrt3,17)\). Applying the Shoelace Theorem to \(J,W,I,G\) gives
\[
\text{Area}=\frac12\left|-34\sqrt3-57\sqrt3\right|
=\frac{91\sqrt3}{2}.
\]
Therefore the answer is \(\boxed{\text{C}}\).`,
},

{
  id: 20327,
  number: 264,
  division: "Alpha",
  topic: "Systems of Equations",
  difficulty: 4,
  methods: ["Substitution"],
  question: String.raw`Let \(S\) be the set of intersection points of
\[
xy-x+y-1=0
\qquad\text{and}\qquad
3x^2-y^2-2y=0.
\]
Find the sum of the \(y\)-coordinates of all points in \(S\).`,
  choices: [String.raw`\(-3\)`, String.raw`\(-2\)`, String.raw`\(1\)`, String.raw`\(2\)`, "NOTA"],
  answer: "E",
  solution: String.raw`Factor the first equation:
\[
xy-x+y-1=(x+1)(y-1)=0.
\]
If \(x=-1\), the second equation becomes
\[
3-y^2-2y=0,
\]
so \(y=1\) or \(y=-3\). If \(y=1\), the second equation becomes \(3x^2-3=0\), so \(x=\pm1\). The distinct intersection points are
\[
(-1,-3),\quad(-1,1),\quad(1,1).
\]
Their \(y\)-coordinates sum to \(-3+1+1=-1\), which is not among choices A through D. Therefore the answer is \(\boxed{\text{E}}\).`,
},

{
  id: 20328,
  number: 265,
  division: "Alpha",
  topic: "Complex Numbers",
  difficulty: 2,
  methods: ["De Moivre's Theorem", "Arguments of Complex Numbers"],
  question: String.raw`What is the smallest positive integer \(n\) for which
\[
(-3+i\sqrt3)^n
\]
is a real number?`,
  choices: [String.raw`\(4\)`, String.raw`\(6\)`, String.raw`\(8\)`, String.raw`\(16\)`, "NOTA"],
  answer: "B",
  solution: String.raw`The number \(-3+i\sqrt3\) has modulus \(2\sqrt3\) and argument \(150^\circ=\frac{5\pi}{6}\). Thus
\[
(-3+i\sqrt3)^n=(2\sqrt3)^n
\left(\cos\frac{5n\pi}{6}+i\sin\frac{5n\pi}{6}\right).
\]
This is real exactly when \(\frac{5n\pi}{6}\) is an integer multiple of \(\pi\), or equivalently when \(6\mid5n\). Since \(5\) and \(6\) are relatively prime, the smallest positive such \(n\) is \(6\). Therefore the answer is \(\boxed{\text{B}}\).`,
},

{
  id: 20329,
  number: 266,
  division: "Alpha",
  topic: "Matrices",
  difficulty: 5,
  methods: ["Matrix Inverse", "Determinant"],
  question: String.raw`What is the entry in the third row and first column of the inverse of
\[
A=\begin{bmatrix}
3&2&4\\
0&5&1\\
-2&5&-3
\end{bmatrix}?
\]`,
  choices: [String.raw`\(-\frac5{12}\)`, String.raw`\(-\frac16\)`, String.raw`\(\frac12\)`, String.raw`\(\frac34\)`, "NOTA"],
  answer: "A",
  solution: String.raw`The \((3,1)\) entry of \(A^{-1}\) is \(\frac{C_{1,3}}{\det A}\). The relevant cofactor is
\[
C_{1,3}=\det\begin{bmatrix}0&5\\-2&5\end{bmatrix}=10.
\]
Expanding the determinant of \(A\) along the first row gives
\[
\det A
=3(-20)-2(2)+4(10)
=-24.
\]
Therefore
\[
(A^{-1})_{3,1}=\frac{10}{-24}=-\frac5{12}.
\]
The answer is \(\boxed{\text{A}}\).`,
},

{
  id: 20330,
  number: 267,
  division: "Alpha",
  topic: "Sequences and Series",
  difficulty: 2,
  methods: [],
  question: String.raw`The first \(102\) positive integers are placed into three rows of consecutive integers, snaking as shown:
\[
\begin{array}{cccccc}
1&6&7&\cdots&102\\
2&5&8&\cdots&101\\
3&4&9&\cdots&100
\end{array}
\]
What is the sum of the numbers in the first row?`,
  choices: [String.raw`\(721\)`, String.raw`\(1648\)`, String.raw`\(1687\)`, String.raw`\(1751\)`, "NOTA"],
  answer: "D",
  solution: String.raw`The first row is the union of two arithmetic sequences:
\[
1,7,13,\ldots,97
\]
and
\[
6,12,18,\ldots,102.
\]
Each sequence has \(17\) terms. Their sums are
\[
\frac{17}{2}(1+97)=833
\quad\text{and}\quad
\frac{17}{2}(6+102)=918.
\]
Therefore the first-row sum is \(833+918=1751\), and the answer is \(\boxed{\text{D}}\).`,
},
];
