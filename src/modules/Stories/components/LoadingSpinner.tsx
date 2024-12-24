import styled from 'styled-components';

const LoadingSpinner = styled.div`
	width: 40px;
	height: 40px;
	border: 3px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	border-top-color: white;
	animation: spin 1s ease-in-out infinite;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	@keyframes spin {
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
`;

export { LoadingSpinner };

// Update: 2024-12-09 20:04

// Update: 2024-12-18 20:00

// Update: 2024-12-18 20:03

// Update: 2024-12-24 20:04

// Update: 2024-12-07 20:00

// Update: 2024-12-08 20:00

// Update: 2024-12-24 20:00
