import { useState, useEffect, useRef } from 'react';

interface PreloadResult {
	isLoaded: boolean;
	blur: string;
	lowQualityUrl?: string;
}

export const useImagePreloader = (imageUrl: string): PreloadResult => {
	const [state, setState] = useState<PreloadResult>({
		isLoaded: false,
		blur: 'blur(20px)',
	});

	const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

	// Generate low quality image URL (20% of original size)
	const getLowQualityUrl = (url: string) => {
		const urlObj = new URL(url);
		urlObj.searchParams.set('w', '200'); // Set width to 200px
		urlObj.searchParams.set('q', '50'); // Set quality to 50%
		return urlObj.toString();
	};

	useEffect(() => {
		if (!imageUrl) return;

		const loadImage = async () => {
			try {
				// Check if image is already cached
				if (imageCache.current.has(imageUrl)) {
					setState({ isLoaded: true, blur: 'blur(0)' });
					return;
				}

				// Load low quality version first
				const lowQualityUrl = getLowQualityUrl(imageUrl);
				const lowQualityImg = new Image();

				await new Promise(resolve => {
					lowQualityImg.onload = resolve;
					lowQualityImg.src = lowQualityUrl;
				});

				// Show low quality image with medium blur
				setState({
					isLoaded: false,
					blur: 'blur(10px)',
					lowQualityUrl,
				});

				// Load high quality version
				const highQualityImg = new Image();

				await new Promise(resolve => {
					highQualityImg.onload = resolve;
					highQualityImg.src = imageUrl;
				});

				// Cache the high quality image
				imageCache.current.set(imageUrl, highQualityImg);

				// Show high quality image with no blur
				setState({
					isLoaded: true,
					blur: 'blur(0)',
					lowQualityUrl: undefined,
				});
			} catch (error) {
				console.error('Error loading image:', error);
			}
		};

		// Preload next image
		loadImage();

		return () => {
			// Clean up cached images if cache grows too large
			if (imageCache.current.size > 20) {
				const keys = Array.from(imageCache.current.keys());
				keys.slice(0, 10).forEach(key => imageCache.current.delete(key));
			}
		};
	}, [imageUrl]);

	return state;
};
