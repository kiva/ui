import { INVITE_LABELS } from '#src/util/invites/invitesConstants';

/**
 * An invite date as "Mar 5, 2026" in the viewer's timezone, or '' when it can't be read.
 *
 * @param {String} date an ISO date
 * @returns {String}
 */
export function formatInviteDate(date) {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return '';
	}
	return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * How an invite was sent and what it created, e.g. "via Email, Team Recruit (Team Tula)". '' when neither is known,
 * or when sources is given and doesn't include the invite's source.
 *
 * @param {Object} row an invite with source, createdAsType and team
 * @param {String[]} [sources] the InviteSourceEnum values to label
 * @returns {String}
 */
export function inviteViaLabel(row, sources) {
	if (sources && !sources.includes(row.source)) {
		return '';
	}
	const labels = [INVITE_LABELS[row.source], INVITE_LABELS[row.createdAsType]].filter(Boolean);
	if (!labels.length) {
		return '';
	}
	const team = row.team?.name ? ` (${row.team.name})` : '';
	return `via ${labels.join(', ')}${team}`;
}
