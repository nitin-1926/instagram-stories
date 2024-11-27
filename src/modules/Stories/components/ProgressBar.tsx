import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
	stories: Array<{ id: string }>;
	currentIndex: number;
	progress: number;
}

const ProgressBar = React.memo(({ stories, currentIndex, progress }: ProgressBarProps) => {
	return (
		<ProgressBarContainer>
			{stories.map((story, index) => (
				<Bar key={story.id}>
					<Fill
						data-testid="progress-bar"
						initial={{ width: '0%' }}
						animate={{
							width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
						}}
						transition={{ duration: 0.1, ease: 'linear' }}
					/>
				</Bar>
			))}
		</ProgressBarContainer>
	);
});

export { ProgressBar };

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

const Bar = styled.div`
	height: 0.125rem;
	flex: 1;
	background-color: rgba(75, 85, 99, 0.3);
	overflow: hidden;
	border-radius: 9999px;
`;

const Fill = styled(motion.div)`
	height: 100%;
	background-color: white;
	border-radius: 9999px;
`;
