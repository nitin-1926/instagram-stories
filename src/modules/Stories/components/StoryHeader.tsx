import { IconX } from '@tabler/icons-react';
import React from 'react';
import styled from 'styled-components';
import { User } from '../types/story';

interface StoryHeaderProps {
	user: User;
	timestamp: string;
	onClose: () => void;
}

const StoryHeader = React.memo(({ user, timestamp, onClose }: StoryHeaderProps) => {
	return (
		<Header>
			<UserInfo>
				<AvatarContainer>
					<Avatar src={user.avatar} alt={user.username} loading="eager" />
				</AvatarContainer>
				<UserTextInfo>
					<Username>{user.username}</Username>
					<Timestamp>{timestamp}</Timestamp>
				</UserTextInfo>
			</UserInfo>
			<CloseButton aria-label="Close story" onClick={onClose}>
				<IconX />
			</CloseButton>
		</Header>
	);
});

export { StoryHeader };

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
