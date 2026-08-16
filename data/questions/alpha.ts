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
    solution: String.raw`Let \(x=\sin\theta\), where \(-\frac\pi2\le\theta\le\frac\pi2\). Then \(\sqrt{1-x^2}=\cos\theta\\), so the expression is
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
];
