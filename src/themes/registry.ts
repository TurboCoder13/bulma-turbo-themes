// SPDX-License-Identifier: MIT
// Theme registry - collects all available theme flavors

import type { ThemeFlavor } from './types.js';
import { bulmaThemes } from './packs/bulma.js';
import { catppuccinSynced } from './packs/catppuccin.synced.js';
import { draculaThemes } from './packs/dracula.js';
import { gruvboxThemes } from './packs/gruvbox.js';
import { githubSynced } from './packs/github.synced.js';
import { nordThemes } from './packs/nord.js';
import { rosePineSynced } from './packs/rose-pine.synced.js';
import { solarizedThemes } from './packs/solarized.js';

// Collect all flavors from all theme packages
const allFlavors: ThemeFlavor[] = [
  ...bulmaThemes.flavors,
  ...catppuccinSynced.flavors,
  ...draculaThemes.flavors,
  ...gruvboxThemes.flavors,
  ...githubSynced.flavors,
  ...nordThemes.flavors,
  ...rosePineSynced.flavors,
  ...solarizedThemes.flavors,
];

// Export flavors array for use in CSS generation
export const flavors = allFlavors;
