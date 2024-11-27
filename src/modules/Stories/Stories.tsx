import { IconAntennaBars5, IconBattery4, IconWifi } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { users } from './data/data';
import { StoryCircle } from './views/StoryCircle';
import { StoryViewer } from './views/StoryViewer';

/**
 * PhoneHeader Component
 * Displays the phone status bar with time and system icons
 * Memoized to prevent unnecessary re-renders since its content only depends on time
 */
const PhoneHeader = React.memo(() => (
	<HeaderContainer>
		<Time>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Time>
		<StatusIcons>
			<IconAntennaBars5 />
			<IconWifi />
			<IconBattery4 />
		</StatusIcons>
	</HeaderContainer>
));

/**
 * LogoHeader Component
 * Displays the Instagram logo text
 * Memoized since it's a static component that never changes
 */
const LogoHeader = React.memo(() => (
	<HeaderContainer>
		<LogoText>Instagram</LogoText>
	</HeaderContainer>
));

/**
 * Stories Component
 * Main component that manages the Instagram-like stories feature
 * Handles story navigation, viewing states, and touch interactions
 */
const Stories = () => {
	const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
	const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
	const [touchStart, setTouchStart] = useState<number | null>(null);

	const memoizedUsers = useMemo(() => users, []);

	const handleStoryClick = useCallback((userIndex: number) => {
		setSelectedUserIndex(userIndex);
	}, []);

	const handleCloseStory = useCallback(() => {
		setSelectedUserIndex(null);
	}, []);

	const markStoryAsViewed = useCallback((storyId: string) => {
		setViewedStories(prev => {
			const newSet = new Set(prev);
			newSet.add(storyId);
			return newSet;
		});
	}, []);

	const handleNavigateStories = useCallback(
		(direction: 'next' | 'previous') => {
			setSelectedUserIndex(prev => {
				if (prev === null) return null;

				if (direction === 'next') {
					// Move to next user or close viewer if at the end
					return prev < memoizedUsers.length - 1 ? prev + 1 : null;
				} else {
					// Move to previous user or stay at current if at the beginning
					return prev > 0 ? prev - 1 : prev;
				}
			});
		},
		[memoizedUsers],
	);

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		setTouchStart(e.touches[0].clientX);
	}, []);

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!touchStart) return;

			const container = e.currentTarget;
			const touch = e.touches[0];
			const diff = touchStart - touch.clientX;

			// Update scroll position based on touch movement
			container.scrollLeft += diff;
			setTouchStart(touch.clientX);
		},
		[touchStart],
	);

	return (
		<Container>
			<PhoneFrame>
				{/* Phone status bar */}
				<PhoneHeader />
				<LogoHeader />

				{/* Horizontally scrollable stories container */}
				<StoriesContainer
					data-testid="stories-container"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={() => setTouchStart(null)}
				>
					<StoriesRow>
						{memoizedUsers.map((user, index) => (
							<StoryCircle
								key={user.id}
								user={user}
								onClick={() => handleStoryClick(index)}
								isViewed={user.stories.every(story => viewedStories.has(story.id))}
							/>
						))}
					</StoriesRow>
				</StoriesContainer>

				{/* Story viewer modal with animation */}
				<AnimatePresence initial={false}>
					{selectedUserIndex !== null && (
						<StoryViewerContainer
							key="story-viewer"
							initial={{ opacity: 1 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 1 }}
						>
							<StoryViewer
								key={`user-${memoizedUsers[selectedUserIndex].id}`}
								user={memoizedUsers[selectedUserIndex]}
								onClose={handleCloseStory}
								onNavigateStories={handleNavigateStories}
								onStoryComplete={markStoryAsViewed}
							/>
						</StoryViewerContainer>
					)}
				</AnimatePresence>
			</PhoneFrame>
		</Container>
	);
};

export { Stories };

// Styled components for layout and styling
const StoryViewerContainer = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
	background-color: black;
`;

const Container = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
`;

const PhoneFrame = styled.div`
	width: 100%;
	max-width: 375px;
	height: 812px;
	margin: 0 auto;
	background-color: white;
	border-radius: 40px;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	overflow: hidden;
	position: relative;
	border: 1px solid #d8d3d3;
`;

const HeaderContainer = styled.div`
	background-color: white;
	padding: 0.75rem 1.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const LogoText = styled.div`
	font-size: 1.625rem;
	font-weight: 500;
	-webkit-background-clip: text;
	background-clip: text;
`;

const Time = styled.div`
	font-size: 0.875rem;
`;

const StatusIcons = styled.div`
	display: flex;
	align-items: center;
`;

const StoriesContainer = styled.div`
	overflow-x: auto;
	padding: 0.5rem;
	border-bottom: 1px solid rgb(243 244 246);
	width: 100%;
	-webkit-overflow-scrolling: touch;

	/* Hide scrollbar for Chrome, Safari and Opera */
	&::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`;

const StoriesRow = styled.div`
	display: flex;
	gap: 1rem;
	padding: 0 0.5rem;
	width: max-content;
`;
