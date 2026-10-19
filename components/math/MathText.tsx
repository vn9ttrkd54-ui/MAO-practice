import katex from "katex";
import Image from "next/image";

type MathTextProps = { children: string; className?: string };
const MATH_DELIMITER = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\[\[solution-diagram:(?:mu-(?:194|196|201|217|227|302|313|320|325|345|502|558)|theta-7|theta-nsu-2026-14|theta-feb-2026-(?:6|11|21|27|28|29))\]\])/g;
// Explicit local allowlist: never interpret arbitrary URLs or HTML from text.
const SOLUTION_DIAGRAMS: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "[[solution-diagram:theta-nsu-2026-14]]": {
    src: "/questions/theta-nsu-2026-14-solution.svg",
    alt: "Absolute-value graph h(x) equals |x+2| plus |2x+10|, intersecting y equals 4 at x negative sixteen thirds and negative four.",
    width: 620, height: 430,
  },
  "[[solution-diagram:theta-feb-2026-6]]": {
    src: "/questions/theta-feb-2026-6-solution.svg",
    alt: "The overlap of y at most 4 minus 2x and y at least x over 2 plus 1, with closed boundaries intersecting at six fifths, eight fifths. No overlap lies in Quadrant IV.",
    width: 620, height: 430,
  },
  "[[solution-diagram:theta-feb-2026-11]]": {
    src: "/questions/theta-feb-2026-11-solution.svg",
    alt: "Salt mixture table: 5 percent of 80 pounds, 100 percent of x pounds, and 24 percent of x plus 80 pounds; scaled salt masses 400, 100x, 24x plus 1920.",
    width: 720, height: 250,
  },
  "[[solution-diagram:theta-feb-2026-21]]": {
    src: "/questions/theta-feb-2026-21-solution.svg",
    alt: "Synthetic division by negative 6: coefficients 1, 7, 5, negative 8, negative 14 give quotient coefficients 1, 1, negative 1, negative 2, and remainder negative 2.",
    width: 620, height: 200,
  },
  "[[solution-diagram:theta-feb-2026-27]]": {
    src: "/questions/theta-feb-2026-27-solution.svg",
    alt: "Purple hyperbola H: 3x squared plus xy minus 4y squared equals 1. Orange conjugate hyperbola has right-hand side negative 1. Dashed asymptotes are y equals x and y equals negative three fourths x.",
    width: 620, height: 430,
  },
  "[[solution-diagram:theta-feb-2026-28]]": {
    src: "/questions/theta-feb-2026-28-solution.svg",
    alt: "Descartes root-count possibilities: positive, negative, non-real counts are 2, 0, 2 or 0, 0, 4.",
    width: 720, height: 248,
  },
  "[[solution-diagram:theta-feb-2026-29]]": {
    src: "/questions/theta-feb-2026-29-solution.svg",
    alt: "With wind: rate 200 plus w, time 960 over 200 plus w, distance 960. Against wind: rate 200 minus w, time 640 over 200 minus w, distance 640.",
    width: 720, height: 192,
  },
  "[[solution-diagram:theta-7]]": {
    src: "/questions/theta-7-solution.svg",
    alt: "Balance configurations for package weights 1 through 9 pounds. The object is on the left. Added left weights are none, 1, none, 1, none, none, 1, none, none; right weights are 1; 3; 3; 5; 5; 5 and 1; 5 and 3; 5 and 3; 5, 3 and 1 pounds, respectively.",
    width: 600, height: 720,
  },
  "[[solution-diagram:mu-558]]": {
    src: "/questions/mu-558-solution.svg",
    alt: "Green graph y equals ln of one plus x squared, with the two dashed slope-one-half tangent lines at x equals two minus square root of three and two plus square root of three. Their intercepts bound the three-intersection range.",
    width: 620, height: 380,
  },
  "[[solution-diagram:mu-502]]": {
    src: "/questions/mu-502-solution.svg",
    alt: "Labeled paper fold: crease L between the top and right edges; reflected legs x and z, right-edge segments x and 8 minus x, bottom gap y.",
    width: 620, height: 440,
  },
  "[[solution-diagram:mu-345]]": {
    src: "/questions/mu-345-original-solution.svg",
    alt: "General illustration of signed integrals of a function and its inverse partitioning a rectangle; the example curve is increasing, unlike the decreasing function in the question.",
    width: 558, height: 560,
  },
  "[[solution-diagram:mu-302]]": {
    src: "/questions/mu-302-solution.svg",
    alt: "Solution diagram: a red cylinder rotates about the blue generator line, sweeping the larger green cylinder.",
    width: 280, height: 200,
  },
  "[[solution-diagram:mu-313]]": {
    src: "/questions/mu-313-solution.svg",
    alt: "Solution graph: successively smaller triangular areas between consecutive powers of one-half.",
    width: 432, height: 130,
  },
  "[[solution-diagram:mu-320]]": {
    src: "/questions/mu-320-solution.svg",
    alt: "Schematic counterexample: the green graph g reaches one before the blue graph f becomes positive.",
    width: 156, height: 150,
  },
  "[[solution-diagram:mu-325]]": {
    src: "/questions/mu-325-solution.svg",
    alt: "Reflection diagram showing incident and horizontal reflected rays, the tangent at P, and angles beta, theta one and theta two.",
    width: 227, height: 207,
  },
  "[[solution-diagram:mu-194]]": {
    src: "/questions/mu-194-original-solution.svg",
    alt: "Graph of arccos(cos x): triangular waves of height pi, with zeros at multiples of 2 pi.",
    width: 1353, height: 172,
  },
  "[[solution-diagram:mu-196]]": {
    src: "/questions/mu-196-original-solution.svg",
    alt: "Axial cone cross section through a cube face diagonal. Cube height 1, half-diagonal square root of 2 over 2, extra base radius x times square root of 2 over 2, and height above the cube 1 over x.",
    width: 322, height: 416,
  },
  "[[solution-diagram:mu-201]]": {
    src: "/questions/mu-201-original-solution.svg",
    alt: "Ladder triangle: ground b equals 5, leaning tree segment c equals 3, ladder a equals 7, with angle A equal to 2 pi over 3 at the tree base.",
    width: 387, height: 291,
  },
  "[[solution-diagram:mu-217]]": {
    src: "/questions/mu-217-original-solution.svg",
    alt: "A circle inscribed in a square of side s, with the square inscribed in an equilateral triangle of side a.",
    width: 507, height: 371,
  },
  "[[solution-diagram:mu-227]]": {
    src: "/questions/mu-227-original-solution.svg",
    alt: "A centered ellipse and hyperbola intersecting at four points symmetric about x equals 2 and y equals negative 1.",
    width: 380, height: 354,
  },
};

export default function MathText({ children, className }: MathTextProps) {
  return (
    <span className={className}>
      {children.split(MATH_DELIMITER).map((part, index) => {
        const diagram = Object.hasOwn(SOLUTION_DIAGRAMS, part) ? SOLUTION_DIAGRAMS[part] : undefined;
        if (diagram) return (
          <span key={index} className="my-4 block">
            <Image {...diagram} alt={diagram.alt} unoptimized className="mx-auto h-auto max-w-full rounded-lg bg-white" />
          </span>
        );
        const display = part.startsWith("\\[") && part.endsWith("\\]");
        const inline = part.startsWith("\\(") && part.endsWith("\\)");
        if (!display && !inline) return <span key={index}>{part}</span>;

        const html = katex.renderToString(part.slice(2, -2), {
          displayMode: display,
          throwOnError: false,
          strict: false,
          trust: false,
          maxExpand: 1000,
          output: "htmlAndMathml",
        });
        return <span key={index} className={display ? "my-3 block overflow-x-auto py-1" : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </span>
  );
}
