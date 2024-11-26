import { IconAntennaBars5, IconBattery4, IconWifi } from '@tabler/icons-react';
import { useState } from 'react';
import styled from 'styled-components';
import { users } from './data/data';
import type { User } from './types/story';
import { StoryCircle } from './views/StoryCircle';

const Stories = () => {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);

	const handleStoryClick = (user: User) => {
		setSelectedUser(user);
		setSelectedStoryIndex(0);
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

				<StoriesContainer>
					<StoriesRow>
						{users.map(user => (
							<StoryCircle
								key={user.id}
								user={user}
								onClick={() => handleStoryClick(user)}
								isViewed={user.stories.every(story => viewedStories.has(story.id))}
							/>
						))}
					</StoriesRow>
				</StoriesContainer>

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
