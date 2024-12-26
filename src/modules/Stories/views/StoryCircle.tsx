import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import type { User } from '../types/story';

interface StoryCircleProps {
	user: User;
	isViewed?: boolean;
	onClick: () => void;
}

const StoryCircle = React.memo(({ user, isViewed = false, onClick }: StoryCircleProps) => {
	return (
		<CircleContainer whileTap={{ scale: 0.8 }} onClick={onClick}>
			<GradientRing data-testid="story-ring" isViewed={isViewed}>
				<ImageContainer>
					<StoryImage src={user.avatar} alt={user.username} />
				</ImageContainer>
			</GradientRing>
			<Username>{user.username}</Username>
		</CircleContainer>
	);
});

export { StoryCircle };

const CircleContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
	cursor: pointer;
`;

const GradientRing = styled.div<{ isViewed: boolean }>`
	padding: 2px;
	border-radius: 50%;
	background: ${({ isViewed }) =>
		isViewed
			? 'rgb(209 213 219)'
			: 'linear-gradient(to top right, rgb(236 72 153), rgb(239 68 68), rgb(234 179 8))'};
`;

const ImageContainer = styled.div`
	padding: 2px;
	background-color: white;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StoryImage = styled.img`
	width: 3.5rem;
	height: 3.5rem;
	border-radius: 50%;
	object-fit: cover;
	display: block;
`;

const Username = styled.span`
	font-size: 0.75rem;
	color: #000;
	width: 4rem;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
