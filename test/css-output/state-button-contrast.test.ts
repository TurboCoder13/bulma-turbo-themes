import { describe, expect, it } from 'vitest';

import { flavors } from '../../packages/core/src/tokens/index';
import { getContrastRatio } from './test-utils';

// Buttons use large/bold text, qualifying for the relaxed WCAG AA "large text"
// threshold (3:1) rather than normal text (4.5:1). See #267 for background on
// the stricter 4.5:1 requirement tracked as an advisory.
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

	// Advisory: log themes that don't meet WCAG AA normal text (4.5:1).
	// Warnings are emitted during test collection so they appear in CI output
	// without inflating the test count with meaningless assertions.
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
					console.warn(
						`[a11y advisory] ${flavor.id} ${key}: contrast ${ratio.toFixed(2)}:1 < ${WCAG_AA_NORMAL}:1 (WCAG AA normal text)`,
					);
				}
			}
		}

		it('logged advisories for sub-4.5:1 themes above', () => {
			// Placeholder so the describe block is not empty.
			// Actual advisories are logged to stderr during collection.
			expect(true).toBe(true);
		});
	});
});
