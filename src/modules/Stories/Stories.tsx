import { IconAntennaBars5, IconBattery4, IconWifi } from '@tabler/icons-react';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { users } from './data/data';
import { StoryCircle } from './views/StoryCircle';
import { StoryViewer } from './views/StoryViewer';

const Stories = () => {
	const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
	const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

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

				<StoriesContainer>
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

				<AnimatePresence mode="wait">
					{selectedUserIndex !== null && (
						<StoryViewer
							key={`${users[selectedUserIndex].id}`}
							user={users[selectedUserIndex]}
							onClose={handleCloseStory}
							onNavigateStories={handleNavigateStories}
							onStoryComplete={markStoryAsViewed}
							viewedStories={viewedStories}
						/>
					)}
				</AnimatePresence>
			</PhoneFrame>
		</Container>
	);
};

export { Stories };

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
`;

const StoriesRow = styled.div`
	display: flex;
	gap: 1rem;
	padding: 0 0.5rem;
`;
