import { vi } from 'vitest';

// Avoid outbound fetches during happy-dom runs
vi.stubGlobal(
  'fetch',
  vi.fn(
    async () =>
      // eslint-disable-next-line no-undef
      new Response('', { status: 200, statusText: 'OK' })
  )
);

// Pretend CSS links load successfully without hitting the network.
// Override the href setter to trigger onload after the element is appended.
const originalHrefDescriptor = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href');

if (originalHrefDescriptor) {
  Object.defineProperty(HTMLLinkElement.prototype, 'href', {
    ...originalHrefDescriptor,
    set(value: string) {
      // Call the original setter
      originalHrefDescriptor.set?.call(this, value);

      // If this is a stylesheet link, simulate successful load
      if (this.rel === 'stylesheet') {
        // Use setTimeout to ensure this runs after the element is in the DOM
        // eslint-disable-next-line no-undef
        setTimeout(() => {
          this.onload?.(new Event('load'));
        }, 0);
      }
    },
  });
}
