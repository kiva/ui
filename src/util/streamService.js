import { connect } from 'getstream';

/**
 * A class that abstracts calls to the GetStream.io API.
 *
 * @class StreamService
 */
class StreamService {
	/**
	 * Creates an instance of StreamService.
	 *
	 * @param {string} apiKey - The GetStream.io API key.
	 * @param {string} appId - The GetStream.io App id.
	 * @param {string} authToken - The auth user token.
	 * @memberof StreamService
	 */
	constructor(apiKey, authToken, appId) {
		/**
		 * The GetStream.io client instance.
		 *
		 * @type {Stream.Client}
		 */
		this.client = connect(apiKey, authToken, appId);
	}

	/**
	 * Creates a user feed for the specified user ID.
	 *
	 * @param {string} userId - The ID of the user.
	 * @returns {Stream.Feed}
	 * @memberof StreamService
	 */
	createUserFeed(userId) {
		return this.client.feed('user', userId);
	}

	/**
	 * Follows another user.
	 *
	 * @param {string} sourceUserId - The ID of the user initiating the follow.
	 * @param {string} targetUserId - The ID of the user being followed.
	 * @returns {Promise<void>}
	 * @memberof StreamService
	 */
	followUser(sourceUserId, targetUserId) {
		const sourceFeed = this.createUserFeed(sourceUserId);
		const targetFeed = this.createUserFeed(targetUserId);

		return sourceFeed.follow(targetFeed);
	}

	/**
	 * Adds an activity to the specified feed.
	 *
	 * @param {Stream.Feed} feed - The feed to which the activity will be added.
	 * @param {object} activity - The activity object to add
	 * Read: https://getstream.io/activity-feeds/docs/javascript/adding_activities/?language=javascript#fields
	 * @returns {Promise<void>}
	 * @memberof StreamService
	 */
	static addActivity(feed, activity) {
		return feed.addActivity(activity);
	}

	/**
	 * Retrieves activities from a feed based on the provided parameters.
	 *
	 * @param {Stream.Feed} feed - The feed from which to retrieve activities.
	 * @param {object} params - Parameters for the get request (e.g., limit).
	 * @returns {Promise<Stream.GetStreamResponse>}
	 * @memberof StreamService
	 */
	static getActivity(feed, params) {
		return feed.get(params);
	}
}

export default StreamService;
