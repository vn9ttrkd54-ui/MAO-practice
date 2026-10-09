// Valid JSON with mis-escaped LaTeX reproduces the screenshot's control characters.
export const garbledTutorJson = String.raw`{"scope":"math","message":"Use the chain rule: compute \frac{d}{dx}\big(14\\u03c0\\,\\sin(\\sqrt{x})\big)=14\\pi\\cos(\\sqrt{x})\\cdot\frac{d}{dx}(\\sqrt{x})=14\\pi\\cos(\\sqrt{x})\\cdot\frac{1}{2\\sqrt{x}}; now evaluate this at x=\\pi^2 - try that."}`;
export const garbledTutorMessage = JSON.parse(garbledTutorJson).message;
export const chainRuleFormula = String.raw`\frac{d}{dx}\big(14\pi\,\sin(\sqrt{x})\big)=14\pi\cos(\sqrt{x})\cdot\frac{d}{dx}(\sqrt{x})=14\pi\cos(\sqrt{x})\cdot\frac{1}{2\sqrt{x}}`;
