import { z, defineCollection } from 'astro:content';

/**
 * Documentation content collection schema.
 * Defines the structure for all documentation markdown files.
 */
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),

    // Navigation & Organization
    category: z.enum([
      'getting-started',
      'installation',
      'integrations',
      'api-reference',
      'guides',
      'contributing',
    ]),
    order: z.number().default(100), // Lower = appears first in sidebar

    // Navigation features
    sidebar: z.boolean().default(true), // Show in sidebar navigation
    toc: z.boolean().default(true), // Generate table of contents

    // Optional metadata
    lastUpdated: z.date().optional(),
    draft: z.boolean().default(false),

    // Related content navigation
    prev: z.string().optional(), // Slug of previous doc
    next: z.string().optional(), // Slug of next doc

    // SEO
    keywords: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};
