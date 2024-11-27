import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProgressBar } from '../components/ProgressBar';
import { StoryHeader } from '../components/StoryHeader';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { User } from '../types/story';

interface StoryViewerProps {
	user: User;
	onClose: () => void;
	onNavigateStories: (direction: 'next' | 'previous') => void;
	onStoryComplete: (storyId: string) => void;
}

/**
 * StoryViewer Component
 * Displays individual stories with animations, progress tracking, and navigation
 * Handles touch interactions, image preloading, and automatic story progression
 * Memoized to prevent unnecessary re-renders
 */
const StoryViewer = memo(({ user, onClose, onNavigateStories, onStoryComplete }: StoryViewerProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [direction, setDirection] = useState(0);

	// Refs for animation timing
	const startTimeRef = useRef<number>(Date.now());
	const animationFrameRef = useRef<number>();

	const stories = user.stories;
	const currentStory = stories[currentIndex];
	const nextStory = stories[currentIndex + 1];

	// Preload current and next images
	const { isLoaded, blur } = useImagePreloader(currentStory.imageUrl);
	const nextImageState = useImagePreloader(nextStory?.imageUrl || '');

	const resetProgress = useCallback(() => {
		// Reset the progress bar and update the start time reference
		setProgress(0);
		startTimeRef.current = Date.now();
	}, []);

	const handleStoryComplete = useCallback(() => {
		// Mark the current story as complete and navigate to the next story
		const currentStory = stories[currentIndex];
		onStoryComplete(currentStory.id);

		// If there are more stories from the current user, navigate to the next story
		if (currentIndex < stories.length - 1) {
			setDirection(1);
			setCurrentIndex(prev => prev + 1);
		} else {
			// If it's the last story, navigate to the next user's stories
			onNavigateStories('next');
		}
	}, [currentIndex, stories, onStoryComplete, onNavigateStories]);

	const updateProgress = useCallback(() => {
		// Calculate the elapsed time and update the progress
		const currentTime = Date.now();
		const elapsed = currentTime - startTimeRef.current;
		const newProgress = Math.min(100, (elapsed / 5000) * 100);

		setProgress(newProgress);

		// If progress reaches 100%, complete the story
		if (newProgress >= 100) {
			handleStoryComplete();
		} else {
			// Continue the progress animation
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}
	}, [handleStoryComplete]);

	const handlePrevious = useCallback(() => {
		// If there are more stories from the current user, navigate to the previous story
		if (currentIndex > 0) {
			setDirection(-1);
			setCurrentIndex(prev => prev - 1);
			resetProgress();
		} else {
			// If it's the first story, navigate to the previous user's stories
			onNavigateStories('previous');
		}
	}, [currentIndex, onNavigateStories, resetProgress]);

	const handleNext = useCallback(() => {
		// Complete the current story and navigate to the next story
		handleStoryComplete();
	}, [handleStoryComplete]);

	// Effect for managing story progress animation
	useEffect(() => {
		if (!isLoaded) return;

		// Reset the progress bar and start the progress animation
		resetProgress();
		animationFrameRef.current = requestAnimationFrame(updateProgress);

		// Cleanup function to cancel the animation frame when the component unmounts
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [currentIndex, updateProgress, resetProgress, isLoaded]);

	// If there are no stories, return null
	if (!stories.length) return null;

	return (
		<ViewerContainer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<StoryContainer>
				<ProgressBar stories={stories} currentIndex={currentIndex} progress={progress} />

				<StoryHeader user={user} timestamp={currentStory.timestamp} onClose={onClose} />

				{!isLoaded && <LoadingSpinner />}

				<AnimatePresence mode="wait" initial={false}>
					<StoryImage
						key={currentStory.id}
						initial={{ opacity: 0, scale: 1.05, x: direction * 20 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0.95, x: direction * -20 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						src={currentStory.imageUrl}
						$blur={blur}
						alt=""
						loading="eager"
						decoding="async"
					/>
				</AnimatePresence>

				<TouchArea>
					<div onClick={handlePrevious} />
					<div onClick={handleNext} />
				</TouchArea>
			</StoryContainer>
		</ViewerContainer>
	);
});

// Styled components for layout and styling
const ViewerContainer = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 51;
`;

const StoryContainer = styled.div`
	position: relative;
	height: 100%;

	@media (min-width: 768px) {
		height: 80vh;
		width: 360px;
		border-radius: 1.5rem;
		overflow: hidden;
	}
`;

const StoryImage = styled(motion.img)<{ $blur: string }>`
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: filter 0.3s ease-in-out;
	filter: ${props => props.$blur};
	will-change: filter;
`;

const TouchArea = styled.div`
	position: absolute;
	inset: 0;
	z-index: 10;
	display: grid;
	grid-template-columns: repeat(2, 1fr);

	@media (min-width: 768px) {
		display: none;
	}
`;

export { StoryViewer };
