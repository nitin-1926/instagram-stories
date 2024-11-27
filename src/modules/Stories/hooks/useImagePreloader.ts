import { useState, useEffect } from 'react';

interface PreloadResult {
	isLoaded: boolean;
	blur: string;
}

export const useImagePreloader = (imageUrl: string): PreloadResult => {
	const [state, setState] = useState<PreloadResult>({
		isLoaded: false,
		blur: 'blur(20px)',
	});

	useEffect(() => {
		if (!imageUrl) return;

		const img = new Image();
		
		const loadImage = async () => {
			try {
				// Start with low quality
				setState(prev => ({ ...prev, blur: 'blur(20px)' }));
				
				await new Promise((resolve, reject) => {
					img.onload = resolve;
					img.onerror = reject;
					img.src = imageUrl;
				});

				// Smoothly transition to full quality
				setState({ isLoaded: true, blur: 'blur(0)' });
			} catch (error) {
				console.error('Error loading image:', error);
			}
		};

		loadImage();

		return () => {
			img.src = '';
		};
	}, [imageUrl]);

	return state;
};
