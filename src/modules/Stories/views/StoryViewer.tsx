import { IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { User } from '../types/story';

interface StoryViewerProps {
	user: User;
	onClose: () => void;
	onNavigateStories: (direction: 'next' | 'previous') => void;
	onStoryComplete: (storyId: string) => void;
	viewedStories: Set<string>;
}

const StoryViewer = ({ user, onClose, onNavigateStories, onStoryComplete, viewedStories }: StoryViewerProps) => {
	const stories = user.stories;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [direction, setDirection] = useState(0);
	const startTimeRef = useRef<number>(Date.now());
	const animationFrameRef = useRef<number>();

	const resetProgress = useCallback(() => {
		setProgress(0);
		startTimeRef.current = Date.now();
	}, []);

	const handleStoryComplete = useCallback(() => {
		const currentStory = stories[currentIndex];
		onStoryComplete(currentStory.id);

		if (currentIndex < stories.length - 1) {
			setDirection(1);
			setCurrentIndex(prev => prev + 1);
			resetProgress();
		} else {
			onNavigateStories('next');
		}
	}, [currentIndex, stories, onStoryComplete, onNavigateStories, resetProgress]);

	const updateProgress = useCallback(() => {
		if (isPaused) return;

		const currentTime = Date.now();
		const elapsed = currentTime - startTimeRef.current;
		const newProgress = Math.min(100, (elapsed / 5000) * 100);

		setProgress(newProgress);

		if (newProgress >= 100) {
			handleStoryComplete();
		} else {
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}
	}, [isPaused, handleStoryComplete]);

	useEffect(() => {
		resetProgress();
		animationFrameRef.current = requestAnimationFrame(updateProgress);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [currentIndex, updateProgress, resetProgress]);

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setDirection(-1);
			setCurrentIndex(prev => prev - 1);
			resetProgress();
		} else {
			onNavigateStories('previous');
		}
	};

	const handleNext = () => {
		handleStoryComplete();
	};

	const handleTouchStart = () => {
		setIsPaused(true);
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
	};

	const handleTouchEnd = () => {
		setIsPaused(false);
		startTimeRef.current = Date.now() - (progress / 100) * 5000;
		animationFrameRef.current = requestAnimationFrame(updateProgress);
	};

	if (!stories.length) {
		return null;
	}

	const currentStory = stories[currentIndex];

	return (
		<ViewerContainer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onMouseDown={handleTouchStart}
			onMouseUp={handleTouchEnd}
		>
			<StoryContainer>
				<ProgressBarContainer>
					{stories.map((story, index) => (
						<ProgressBar key={story.id}>
							<ProgressFill
								initial={{ width: '0%' }}
								animate={{
									width:
										index === currentIndex
											? `${progress}%`
											: index < currentIndex || viewedStories.has(story.id)
												? '100%'
												: '0%',
								}}
								transition={{ duration: 0.1, ease: 'linear' }}
							/>
						</ProgressBar>
					))}
				</ProgressBarContainer>

				<Header>
					<UserInfo>
						<AvatarContainer>
							<Avatar src={user.avatar} alt={user.username} loading="eager" />
						</AvatarContainer>
						<UserTextInfo>
							<Username>{user.username}</Username>
							<Timestamp>{currentStory.timestamp}</Timestamp>
						</UserTextInfo>
					</UserInfo>
					<CloseButton onClick={onClose}>
						<IconX />
					</CloseButton>
				</Header>

				<AnimatePresence mode="wait" initial={false}>
					<StoryImage
						key={currentStory.id}
						initial={{ opacity: 0, x: direction * 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction * -50 }}
						transition={{ duration: 0.3 }}
						src={currentStory.imageUrl}
						alt=""
						loading="lazy"
					/>
				</AnimatePresence>

				<TouchArea>
					<div onClick={handlePrevious} />
					<div onClick={handleNext} />
				</TouchArea>
			</StoryContainer>
		</ViewerContainer>
	);
};

const ViewerContainer = styled(motion.div)`
	position: fixed;
	inset: 0;
	background-color: black;
	z-index: 50;
	touch-action: none;

	@media (min-width: 768px) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
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

const ProgressBarContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 20;
	display: flex;
	gap: 0.25rem;
	padding: 0.5rem;
`;

const ProgressBar = styled.div`
	height: 0.125rem;
	flex: 1;
	background-color: rgba(75, 85, 99, 0.3);
	overflow: hidden;
	border-radius: 9999px;
`;

const ProgressFill = styled(motion.div)`
	height: 100%;
	background-color: white;
	border-radius: 9999px;
`;

const Header = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	padding-top: 2rem;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), transparent);
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const AvatarContainer = styled.div`
	position: relative;
`;

const Avatar = styled.img`
	width: 2rem;
	height: 2rem;
	border-radius: 9999px;
	border: 1px solid rgba(255, 255, 255, 0.2);
`;

const UserTextInfo = styled.div`
	display: flex;
	flex-direction: column;
`;

const Username = styled.span`
	color: white;
	font-weight: 600;
	font-size: 0.875rem;
`;

const Timestamp = styled.span`
	color: rgb(209 213 219);
	font-size: 0.75rem;
`;

const StoryImage = styled(motion.img)`
	width: 100%;
	height: 100%;
	object-fit: cover;
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

const CloseButton = styled.button`
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		opacity: 0.8;
	}
`;

export { StoryViewer };