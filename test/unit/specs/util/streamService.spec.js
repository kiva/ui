// StreamService.test.js

import StreamService from '@/util/streamService';
import { connect } from 'getstream';

const mockFollow = jest.fn(() => Promise.resolve());
const mockAddActivity = jest.fn(() => Promise.resolve());
const mockGet = jest.fn(() => Promise.resolve({ results: [] }));

const mockFeed = jest.fn(() => ({
	follow: mockFollow,
	addActivity: mockAddActivity,
	get: mockGet,
}));

jest.mock('getstream', () => ({
	connect: jest.fn(() => ({
		feed: mockFeed
	})),
}));

describe('StreamService', () => {
	let streamService;

	beforeEach(() => {
		// Reset the mocks and create a new StreamService instance for each test
		jest.clearAllMocks();
		streamService = new StreamService('API_KEY', 'AUTH_TOKEN', 'APP_ID');
	});

	describe('createUserFeed', () => {
		it('should create a user feed', () => {
			const userId = 'user123';
			const userFeed = streamService.createUserFeed(userId);

			expect(userFeed).toBeDefined();
			expect(connect).toHaveBeenCalledWith(
				'API_KEY',
				'AUTH_TOKEN',
				'APP_ID'
			);
			expect(connect().feed).toHaveBeenCalledWith('user', userId);
		});
	});

	describe('followUser', () => {
		it('should follow another user', async () => {
			const sourceUserId = 'user123';
			const targetUserId = 'user456';

			await streamService.followUser(sourceUserId, targetUserId);

			expect(connect().feed).toHaveBeenCalledWith('user', sourceUserId);
			expect(connect().feed().follow).toHaveBeenCalled();
		});
	});

	describe('addActivity', () => {
		it('should add an activity to the feed', async () => {
			const userFeed = streamService.createUserFeed('user123');
			const activity = {
				actor: 'user123',
				verb: 'post',
				object: 'message:1',
			};

			await StreamService.addActivity(userFeed, activity);

			expect(connect().feed).toHaveBeenCalled();
			expect(connect().feed().addActivity).toHaveBeenCalledWith(activity);
		});
	});

	describe('getActivity', () => {
		it('should retrieve activities from the feed', async () => {
			const userFeed = streamService.createUserFeed('user123');
			const params = { limit: 10 };

			await StreamService.getActivity(userFeed, params);

			expect(connect().feed).toHaveBeenCalled();
			expect(connect().feed().get).toHaveBeenCalledWith(params);
		});
	});
});
