import activities from '@/util/loanSearch/filters/activities';

describe('activities.js', () => {
	describe('activities', () => {
		describe('getFlssFilter', () => {
			it('should handle missing', () => {
				expect(activities.getFlssFilter({})).toEqual({});
			});

			it('should handle empty', () => {
				expect(activities.getFlssFilter({ activityId: null })).toEqual({});
			});

			it('should return filters', () => {
				expect(activities.getFlssFilter({ activityId: [1] })).toEqual({ activityId: { any: [1] } });
			});
		});
	});
});
