/* ==========================================================================
   generator/index.ts — Barrel Exports do Gerador de Sites
   AI Site Generator — thiagolab.com
   ========================================================================== */

export { interpretPrompt } from './prompt-engine';
export type { ParsedPrompt, SiteType, ToneType } from './prompt-engine';

export {
  selectPalette,
  selectFontPairing,
  generateAnimationCSS,
  generateAnimationUtilities,
  generateColorCSS,
  generateTailwindUtilities,
  COLOR_PALETTES,
  FONT_PAIRINGS,
  TAILWIND_ANIMATIONS,
  LAYOUT_TEMPLATES,
} from './design-system';
export type { ColorPalette, FontPairing } from './design-system';

export { generateSite } from './code-generator';
export type { GeneratedFile, GenerateResult } from './code-generator';

export { generateSection } from './templates';
export type { SectionContext, SectionGenerator } from './templates';
