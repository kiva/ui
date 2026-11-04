export const INVITES_ROUTE = '/portfolio/invites-beta';

// Rows an invite table shows before "More"
export const INVITES_TABLE_INITIAL_SIZE = 4;

// Rows each "More" adds to an invite table
export const INVITES_TABLE_PAGE_SIZE = 20;

// Display labels for InviteSourceEnum and InviteTypeEnum values
export const INVITE_LABELS = {
	EMAIL: 'Email',
	FACEBOOK: 'Facebook',
	FACEBOOK_SHARE: 'Shared Loan on Facebook',
	TWITTER: 'Twitter',
	URL: 'Special Invitation Link',
	PERMURL: 'Invitation Link',
	PERMTEAM: 'Team Invitation Link',
	KIVACARD: 'Kiva Card Redemption',
	INVITE: 'Invite',
	THANKS: 'User credited you as invitee',
	TEAM_RECRUIT: 'Team Recruit',
};

// InviteStatusEnum values: the status of an invite activity row
export const INVITE_STATUS = {
	SENT: 'SENT',
	PENDING: 'PENDING',
	ACCEPTED: 'ACCEPTED',
	JOINED_TEAM: 'JOINED_TEAM',
};

// InviteActionStatusEnum values: the outcome of reminding or clearing an invite
export const INVITE_ACTION_STATUS = {
	SENT: 'SENT',
	TOO_SOON: 'TOO_SOON',
	CLEARED: 'CLEARED',
	INVALID: 'INVALID',
	ERROR: 'ERROR',
};
