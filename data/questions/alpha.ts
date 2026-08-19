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
    topic: "System of Equations",
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
    topic: "Polynomial Equations",
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
    solution: String.raw`The quadratic-form matrix is \(\begin{pmatrix}2&-7/2\\-7/2&-22\end{pmatrix}\), whose eigenvalues are \(5/2\) and \(-45/2\). After rotation, the hyperbola has semiaxis squares proportional to \(a^2=2/5\) and \(b^2=2/45\). Hence
\[e=\sqrt{1+\frac{b^2}{a^2}}=\sqrt{1+\frac19}=\frac{\sqrt{10}}3.\]`,
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
];
