import { MetadataRoute } from 'next'

const siteUrl = 'https://voidpresence.site'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${siteUrl}/download`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.9,
		},
		{
			url: `${siteUrl}/docs`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${siteUrl}/configs`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${siteUrl}/status`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${siteUrl}/singin`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${siteUrl}/profile`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	]
}
