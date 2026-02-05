// SPDX-License-Identifier: MIT
// Theme registry - collects all available theme flavors

import type { ThemeFlavor } from './types.js';
import { bulmaThemes } from './packs/bulma.js';
import { catppuccinSynced } from './packs/catppuccin.synced.js';
import { draculaThemes } from './packs/dracula.js';
import { githubSynced } from './packs/github.synced.js';
import { rosePineSynced } from './packs/rose-pine.synced.js';

// Collect all flavors from all theme packages
const allFlavors: ThemeFlavor[] = [
  ...bulmaThemes.flavors,
  ...catppuccinSynced.flavors,
  ...draculaThemes.flavors,
  ...githubSynced.flavors,
  ...rosePineSynced.flavors,
];

// Export flavors array for use in CSS generation
export const flavors = allFlavors;
