import {
	lightHeader,
	greenHeader,
	lightFooter,
	blueHeader,
	blueFooter,
	iwdHeaderTheme,
	iwdFooterTheme,
	wrdHeaderTheme,
	wrdFooterTheme,
	fifteenYearHeaderTheme,
	fifteenYearFooterTheme,
} from '#src/util/siteThemes';

describe('siteThemes.js', () => {
	describe('lightHeader', () => {
		it('should have correct theme properties', () => {
			expect(lightHeader.themeKey).toBe('lightHeader');
			expect(lightHeader.backgroundColor).toBe('#fff');
			expect(lightHeader.logoColor).toBe('#4faf4e');
			expect(lightHeader.linkColor).toBe('#767676');
			expect(lightHeader.linkHoverColor).toBe('#efefef');
			expect(lightHeader.separatorColor).toBe('transparent');
			expect(lightHeader.shadow).toBe('0 0 0.5rem 0 rgba(0, 0, 0, 0.15)');
			expect(lightHeader.textColor).toBe('#484848');
		});
	});

	describe('greenHeader', () => {
		it('should have correct theme properties', () => {
			expect(greenHeader.themeKey).toBe('greenHeader');
			expect(greenHeader.backgroundColor).toBe('#4faf4e');
			expect(greenHeader.logoColor).toBe('#fff');
			expect(greenHeader.linkColor).toBe('#fff');
			expect(greenHeader.linkHoverColor).toBe('#49953f');
			expect(greenHeader.separatorColor).toBe('#49953f');
			expect(greenHeader.shadow).toBe('none');
			expect(greenHeader.textColor).toBe('#fff');
		});
	});

	describe('lightFooter', () => {
		it('should have correct theme properties', () => {
			expect(lightFooter.themeKey).toBe('lightFooter');
			expect(lightFooter.backgroundColor).toBe('#fff');
			expect(lightFooter.logoColor).toBe('#4faf4e');
			expect(lightFooter.textColor).toBe('#484848');
			expect(lightFooter.linkColor).toBe('#4faf4e');
			expect(lightFooter.separatorColor).toBe('#8ccb8c');
		});
	});

	describe('blueHeader', () => {
		it('should have correct theme properties', () => {
			expect(blueHeader.themeKey).toBe('blueHeader');
			expect(blueHeader.backgroundColor).toBe('#005CC4');
			expect(blueHeader.logoColor).toBe('#fff');
			expect(blueHeader.linkColor).toBe('#fff');
			expect(blueHeader.linkHoverColor).toBe('#0b70e2');
			expect(blueHeader.separatorColor).toBe('#0b70e2');
		});
	});

	describe('blueFooter', () => {
		it('should have correct theme properties', () => {
			expect(blueFooter.themeKey).toBe('blueFooter');
			expect(blueFooter.backgroundColor).toBe('#005CC4');
			expect(blueFooter.logoColor).toBe('#fff');
			expect(blueFooter.textColor).toBe('#fff');
			expect(blueFooter.linkColor).toBe('#ededed');
			expect(blueFooter.separatorColor).toBe('#0b70e2');
		});
	});

	describe('iwdHeaderTheme', () => {
		it('should have correct International Womens Day theme properties', () => {
			expect(iwdHeaderTheme.themeKey).toBe('IWD');
			expect(iwdHeaderTheme.backgroundColor).toBe('#fff');
			expect(iwdHeaderTheme.logoColor).toBe('#060f9f');
			expect(iwdHeaderTheme.linkColor).toBe('#060f9f');
			expect(iwdHeaderTheme.linkHoverColor).toBe('#a0e2ba');
			expect(iwdHeaderTheme.separatorColor).toBe('transparent');
		});
	});

	describe('iwdFooterTheme', () => {
		it('should have correct International Womens Day theme properties', () => {
			expect(iwdFooterTheme.themeKey).toBe('IWD');
			expect(iwdFooterTheme.backgroundColor).toBe('#fff');
			expect(iwdFooterTheme.logoColor).toBe('#060f9f');
			expect(iwdFooterTheme.textColor).toBe('#484848');
			expect(iwdFooterTheme.linkColor).toBe('#060f9f');
			expect(iwdFooterTheme.separatorColor).toBe('#a0e2ba');
		});
	});

	describe('wrdHeaderTheme', () => {
		it('should have correct World Refugee Day theme properties', () => {
			expect(wrdHeaderTheme.themeKey).toBe('WRD');
			expect(wrdHeaderTheme.backgroundColor).toBe('#fff');
			expect(wrdHeaderTheme.logoColor).toBe('#6b62ca');
			expect(wrdHeaderTheme.linkColor).toBe('#6b62ca');
			expect(wrdHeaderTheme.linkHoverColor).toBe('#f3f3f3');
			expect(wrdHeaderTheme.separatorColor).toBe('transparent');
			expect(wrdHeaderTheme.shadow).toBe('0 0 0.5rem 0 rgba(0, 0, 0, 0.15)');
		});
	});

	describe('wrdFooterTheme', () => {
		it('should have correct World Refugee Day theme properties', () => {
			expect(wrdFooterTheme.themeKey).toBe('WRD');
			expect(wrdFooterTheme.backgroundColor).toBe('#6b62ca');
			expect(wrdFooterTheme.logoColor).toBe('#fff');
			expect(wrdFooterTheme.textColor).toBe('#fff');
			expect(wrdFooterTheme.linkColor).toBe('#b9ddb8');
			expect(wrdFooterTheme.separatorColor).toBe('#fff');
		});
	});

	describe('fifteenYearHeaderTheme', () => {
		it('should have correct 15 year anniversary theme properties', () => {
			expect(fifteenYearHeaderTheme.themeKey).toBe('15year');
			expect(fifteenYearHeaderTheme.backgroundColor).toBe('hsla(0, 0%, 100%, 0.8)');
			expect(fifteenYearHeaderTheme.logoColor).toBe('#3E4653');
			expect(fifteenYearHeaderTheme.linkColor).toBe('#3E4653');
			expect(fifteenYearHeaderTheme.linkHoverColor).toBe('#9EEBD5');
			expect(fifteenYearHeaderTheme.separatorColor).toBe('transparent');
		});
	});

	describe('fifteenYearFooterTheme', () => {
		it('should have correct 15 year anniversary theme properties', () => {
			expect(fifteenYearFooterTheme.themeKey).toBe('15year');
			expect(fifteenYearFooterTheme.backgroundColor).toBe('#3e4653');
			expect(fifteenYearFooterTheme.logoColor).toBe('#fff');
			expect(fifteenYearFooterTheme.textColor).toBe('#F8F8F8');
			expect(fifteenYearFooterTheme.linkColor).toBe('#fff');
			expect(fifteenYearFooterTheme.separatorColor).toBe('#F8F8F8');
		});
	});

	describe('theme consistency', () => {
		it('should have unique themeKeys for different themes', () => {
			const themes = [
				lightHeader, greenHeader, lightFooter, blueHeader, blueFooter,
				iwdHeaderTheme, iwdFooterTheme, wrdHeaderTheme, wrdFooterTheme,
				fifteenYearHeaderTheme, fifteenYearFooterTheme
			];
			const keys = themes.map(theme => theme.themeKey);
			// Check that we have expected number of themes
			expect(themes.length).toBe(11);
			// Check that some keys appear multiple times for header/footer pairs
			expect(keys.filter(k => k === 'IWD').length).toBe(2);
			expect(keys.filter(k => k === 'WRD').length).toBe(2);
			expect(keys.filter(k => k === '15year').length).toBe(2);
		});
	});
});
