import { useState, useEffect } from 'react';

export const useImagePreloader = (imageUrl: string) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = imageUrl;
		img.onload = () => setIsLoaded(true);
	}, [imageUrl]);

	return isLoaded;
};
