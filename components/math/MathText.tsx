import katex from "katex";
import Image from "next/image";

type MathTextProps = { children: string; className?: string };
const MATH_DELIMITER = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\[\[solution-diagram:mu-(?:194|196|201)\]\])/g;
// Explicit local allowlist: never interpret arbitrary URLs or HTML from text.
const SOLUTION_DIAGRAMS: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "[[solution-diagram:mu-194]]": {
    src: "/questions/mu-194-solution.svg",
    alt: "Graph of arccos(cos x): triangular waves of height pi, with zeros at multiples of 2 pi.",
    width: 1000, height: 210,
  },
  "[[solution-diagram:mu-196]]": {
    src: "/questions/mu-196-solution.svg",
    alt: "Axial cone cross section through a cube face diagonal. Cube height 1, half-diagonal square root of 2 over 2, extra base radius x times square root of 2 over 2, and height above the cube 1 over x.",
    width: 420, height: 390,
  },
  "[[solution-diagram:mu-201]]": {
    src: "/questions/mu-201-solution.svg",
    alt: "Ladder triangle: ground b equals 5, leaning tree segment c equals 3, ladder a equals 7, with angle A equal to 2 pi over 3 at the tree base.",
    width: 460, height: 240,
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
