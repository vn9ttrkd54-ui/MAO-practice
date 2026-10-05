# Llama tutor pet

The approved left-facing pixel llama replaces the circular tutor launcher. The unused original `public/llama-tutor.png` was removed from the website during cleanup; it remains recoverable from Git history.

`public/llama-pet.png` is a transparent 2172 x 724 PNG generated with the built-in image-generation tool from the user-approved interaction storyboard. Four equal-width cells, left to right: idle, attentive, happy, resting. Each cell is 543 x 724 (3:4); keep that ratio in the CSS. No API call or generated image is requested at runtime.

`LlamaPet.module.css` supplies idle bob/blink, hover/focus tilt, click hop, answer nod, and resting breathing. The thinking bubble and its animated dots are CSS rather than baked into the artwork. Reduced-motion preferences disable all pet animations. The launcher remains clickable when usage is exhausted; server limits still control requests. Desktop visibility remains unchanged.

## Final generation prompt

> Convert the reference approved pixel llama storyboard into a production sprite sheet PNG with REAL transparent background, NO text, NO labels, NO arrows, NO motion ticks, NO bubbles, NO symbols. EXACTLY FOUR columns in ONE horizontal row, each cell occupying exactly one quarter of the total canvas width. All four characters face LEFT. Cell1 neutral idle standing llama from top left reference; cell2 perked attentive head-tilt llama from top middle reference; cell3 happy eyes closed standing llama from lower middle; cell4 seated sleepy llama from lower right. Preserve pixel-art identity, cream wool brown outlines and exact character proportions. Consistent scale and bottom baseline across all four equal-width cells. Each character completely within its own cell with 12 percent padding on all sides; no overlap, no clipping. Output wide landscape aspect ratio 4:1. This is sprite texture artwork, not a presentation: strictly transparent empty pixels around figures, no gray/white/black/checkerboard opaque background. All states left facing. No thought bubble because UI will draw it separately.

The returned sheet is 3:1 overall rather than the requested 4:1. The implementation uses its actual dimensions, without distorting or cropping the poses.
