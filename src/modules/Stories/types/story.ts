export interface Story {
	id: string;
	imageUrl: string;
	timestamp: string;
}

export interface User {
	id: string;
	username: string;
	avatar: string;
	stories: Story[];
}

// Update: 2024-12-10 20:00
