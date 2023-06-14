/**
 * Returns an array of loan callouts following a hierarchy of importance
 *
 * @param {Object} loan The loan data object
 * @param {String} categoryPageName The optional name of the category
 * @returns An array of loan callout strings
 */
function loanCallouts(loan, categoryPageName) {
	const callouts = [];
	const activityName = loan?.activity?.name ?? '';
	const sectorName = loan?.sector?.name ?? '';
	const tags = loan?.tags?.filter(tag => tag.charAt(0) === '#')
		.map(tag => tag.substring(1)) ?? [];
	const themes = loan?.themes ?? [];
	const categories = {
		ecoFriendly: !!tags
			.filter(t => t.toUpperCase() === 'ECO-FRIENDLY' || t.toUpperCase() === 'SUSTAINABLE AG').length,
		refugeesIdps: !!themes.filter(t => t.toUpperCase() === 'REFUGEES/DISPLACED').length,
		singleParents: !!tags.filter(t => t.toUpperCase() === 'SINGLE PARENT').length
	};

	// P1 Category
	// Exp limited to: Eco-friendly, Refugees and IDPs, Single Parents
	if (!categoryPageName) {
		if (categories.ecoFriendly) {
			callouts.push('Eco-friendly');
		} else if (categories.refugeesIdps) {
			callouts.push('Refugees and IDPs');
		} else if (categories.singleParents) {
			callouts.push('Single Parent');
		}
	}

	// P2 Activity
	if (activityName && categoryPageName?.toUpperCase() !== activityName.toUpperCase()) {
		callouts.push(activityName);
	}

	// P3 Sector
	if (sectorName
		&& (activityName.toUpperCase() !== sectorName.toUpperCase())
		&& (sectorName.toUpperCase() !== categoryPageName?.toUpperCase())
		&& callouts.length < 2) {
		callouts.push(sectorName);
	}

	// P4 Tag
	if (!!tags.length && callouts.length < 2) {
		const position = Math.floor(Math.random() * tags.length);
		const tag = tags[position];
		if (!callouts.filter(c => c.toUpperCase() === tag.toUpperCase()).length) {
			callouts.push(tag);
		}
	}

	// P5 Theme
	if (!!themes.length && callouts.length < 2) {
		const position = Math.floor(Math.random() * themes.length);
		const theme = themes[position];
		if (!callouts.filter(c => c.toUpperCase() === theme.toUpperCase()).length) {
			callouts.push(theme);
		}
	}

	return callouts;
}

module.exports = loanCallouts;
