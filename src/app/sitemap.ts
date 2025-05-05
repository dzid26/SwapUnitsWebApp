import { MetadataRoute } from 'next';

// Replace with your actual deployed URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(), // Update automatically on build
      changeFrequency: 'monthly', // How often the content is likely to change
      priority: 1, // Priority for the homepage (1.0 is highest)
    },
    // Add other static pages here if needed
    // {
    //   url: `${siteUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.8,
    // },
  ];
}
