import { IconAntennaBars5, IconBattery4, IconWifi } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { users } from './data/data';
import { StoryCircle } from './views/StoryCircle';
import { StoryViewer } from './views/StoryViewer';

const Stories = () => {
	const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
	const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
	const [touchStart, setTouchStart] = useState<number | null>(null);

	const handleStoryClick = (userIndex: number) => {
		setSelectedUserIndex(userIndex);
	};

	const handleCloseStory = useCallback(() => {
		setSelectedUserIndex(null);
	}, []);

	const markStoryAsViewed = useCallback((storyId: string) => {
		setViewedStories(prev => new Set([...prev, storyId]));
	}, []);

	const handleNavigateStories = useCallback((direction: 'next' | 'previous') => {
		setSelectedUserIndex(prev => {
			if (prev === null) return null;

			if (direction === 'next') {
				return prev < users.length - 1 ? prev + 1 : null;
			} else {
				return prev > 0 ? prev - 1 : prev;
			}
		});
	}, []);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.touches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!touchStart) return;

		const container = e.currentTarget;
		const touch = e.touches[0];
		const diff = touchStart - touch.clientX;

		container.scrollLeft += diff;
		setTouchStart(touch.clientX);
	};

	return (
		<Container>
			<PhoneFrame>
				<PhoneHeader>
					<Time>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Time>
					<StatusIcons>
						<IconAntennaBars5 />
						<IconWifi />
						<IconBattery4 />
					</StatusIcons>
				</PhoneHeader>

				<StoriesContainer
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={() => setTouchStart(null)}
				>
					<StoriesRow>
						{users.map((user, index) => (
							<StoryCircle
								key={user.id}
								user={user}
								onClick={() => handleStoryClick(index)}
								isViewed={user.stories.every(story => viewedStories.has(story.id))}
							/>
						))}
					</StoriesRow>
				</StoriesContainer>

				<AnimatePresence initial={false}>
					{selectedUserIndex !== null && (
						<StoryViewerContainer
							key="story-viewer"
							initial={{ opacity: 1 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 1 }}
						>
							<StoryViewer
								key={`user-${users[selectedUserIndex].id}`}
								user={users[selectedUserIndex]}
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

const PhoneHeader = styled.div`
	background-color: white;
	padding: 0.75rem 1.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
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
