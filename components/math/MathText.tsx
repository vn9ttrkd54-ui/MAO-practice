import katex from "katex";

type MathTextProps = { children: string; className?: string };
const MATH_DELIMITER = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;

export default function MathText({ children, className }: MathTextProps) {
  return (
    <span className={className}>
      {children.split(MATH_DELIMITER).map((part, index) => {
        const display = part.startsWith("\\[") && part.endsWith("\\]");
        const inline = part.startsWith("\\(") && part.endsWith("\\)");
        if (!display && !inline) return <span key={index}>{part}</span>;

        const html = katex.renderToString(part.slice(2, -2), {
          displayMode: display,
          throwOnError: false,
          strict: false,
          output: "htmlAndMathml",
        });
        return <span key={index} className={display ? "my-3 block overflow-x-auto py-1" : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </span>
  );
}
