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
