/**
 * StackBlitz integration utilities.
 * Provides helpers for generating StackBlitz URLs and embedding projects.
 */

const GITHUB_OWNER = 'TurboCoder13';
const GITHUB_REPO = 'turbo-themes';
const GITHUB_BRANCH = 'main';

export type ExampleName =
  | 'html-vanilla'
  | 'react'
  | 'vue'
  | 'tailwind'
  | 'bootstrap';

/**
 * Generate a StackBlitz URL to open an example directly from GitHub.
 *
 * @param example - The name of the example directory
 * @returns The StackBlitz URL
 */
export function getStackBlitzUrl(example: ExampleName): string {
  return `https://stackblitz.com/github/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${GITHUB_BRANCH}/examples/${example}`;
}

/**
 * Generate a StackBlitz embed URL for an iframe.
 *
 * @param example - The name of the example directory
 * @param options - Embed options
 * @returns The StackBlitz embed URL
 */
export function getStackBlitzEmbedUrl(
  example: ExampleName,
  options: {
    file?: string;
    view?: 'preview' | 'editor' | 'both';
    hideNavigation?: boolean;
    hideDevTools?: boolean;
    theme?: 'light' | 'dark';
  } = {}
): string {
  const baseUrl = getStackBlitzUrl(example);
  const params = new URLSearchParams();

  if (options.file) {
    params.set('file', options.file);
  }
  if (options.view) {
    params.set('view', options.view);
  }
  if (options.hideNavigation) {
    params.set('hideNavigation', '1');
  }
  if (options.hideDevTools) {
    params.set('hideDevTools', '1');
  }
  if (options.theme) {
    params.set('theme', options.theme);
  }

  // Enable embed mode
  params.set('embed', '1');

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Get the default file to show for each example type.
 *
 * @param example - The name of the example directory
 * @returns The default file path
 */
export function getDefaultFile(example: ExampleName): string {
  switch (example) {
    case 'html-vanilla':
      return 'index.html';
    case 'react':
      return 'src/App.tsx';
    case 'vue':
      return 'src/App.vue';
    case 'tailwind':
      return 'index.html';
    case 'bootstrap':
      return 'index.html';
    default:
      return 'index.html';
  }
}

/**
 * Example metadata for display purposes.
 */
export const EXAMPLE_METADATA: Record<
  ExampleName,
  {
    title: string;
    description: string;
  }
> = {
  'html-vanilla': {
    title: 'HTML Vanilla',
    description: 'Zero-dependency vanilla JavaScript implementation',
  },
  react: {
    title: 'React',
    description: 'React 18 + TypeScript with custom useTheme hook',
  },
  vue: {
    title: 'Vue',
    description: 'Vue 3 Composition API with useTheme composable',
  },
  tailwind: {
    title: 'Tailwind CSS',
    description: 'Tailwind preset integration with utility classes',
  },
  bootstrap: {
    title: 'Bootstrap',
    description: 'Bootstrap 5 integration with SCSS variable mapping',
  },
};
