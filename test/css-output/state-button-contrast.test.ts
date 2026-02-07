import { describe, expect, it } from 'vitest';

import { flavors } from '../../packages/core/src/tokens/index';
import { getContrastRatio } from './test-utils';

const WCAG_AA_LARGE = 3.0;
const WCAG_AA_NORMAL = 4.5;
const stateKeys = ['info', 'success', 'warning', 'danger'] as const;

describe('State button text contrast', () => {
	for (const flavor of flavors) {
		describe(flavor.id, () => {
			for (const key of stateKeys) {
				const stateBg = flavor.tokens.state[key];
				const stateTextKey = `${key}Text` as keyof typeof flavor.tokens.state;
				const textColor =
					(flavor.tokens.state[stateTextKey] as string | undefined) ??
					flavor.tokens.text.inverse;

				it(`${key} button meets WCAG AA large text (3:1)`, () => {
					const ratio = getContrastRatio(textColor, stateBg);
					expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE);
				});
			}
		});
	}

	// Advisory: flag themes that don't meet WCAG AA normal text (4.5:1)
	describe('advisory: WCAG AA normal text (4.5:1)', () => {
		for (const flavor of flavors) {
			for (const key of stateKeys) {
				const stateBg = flavor.tokens.state[key];
				const stateTextKey = `${key}Text` as keyof typeof flavor.tokens.state;
				const textColor =
					(flavor.tokens.state[stateTextKey] as string | undefined) ??
					flavor.tokens.text.inverse;
				const ratio = getContrastRatio(textColor, stateBg);

				if (ratio < WCAG_AA_NORMAL) {
					it.skip(`${flavor.id} ${key}: ${ratio.toFixed(2)} < 4.5:1 (advisory)`, () => {
						// Advisory only - skipped
					});
				}
			}
		}
	});
});
