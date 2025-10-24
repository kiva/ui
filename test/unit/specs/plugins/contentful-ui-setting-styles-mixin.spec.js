import contentfulUiSettingStylesMixin from '#src/plugins/contentful-ui-setting-styles-mixin';

describe('contentful-ui-setting-styles-mixin.js', () => {
	let context;

	beforeEach(() => {
		context = {
			content: null,
			uiSetting: null
		};
	});

	describe('uiSetting', () => {
		it('should return uiSetting from content when it exists', () => {
			context.content = {
				contents: [
					{ contentType: 'other' },
					{ contentType: 'uiSetting', dataObject: { test: 'value' } }
				]
			};

			const result = contentfulUiSettingStylesMixin.computed.uiSetting.call(context);

			expect(result).toEqual({ contentType: 'uiSetting', dataObject: { test: 'value' } });
		});

		it('should return empty object when no uiSetting found', () => {
			context.content = {
				contents: [
					{ contentType: 'other' }
				]
			};

			const result = contentfulUiSettingStylesMixin.computed.uiSetting.call(context);

			expect(result).toEqual({});
		});

		it('should return empty object when content is null', () => {
			context.content = null;

			const result = contentfulUiSettingStylesMixin.computed.uiSetting.call(context);

			expect(result).toEqual({});
		});

		it('should handle contents without contentType', () => {
			context.content = {
				contents: [
					{ name: 'test' },
					{ contentType: 'uiSetting', dataObject: {} }
				]
			};

			const result = contentfulUiSettingStylesMixin.computed.uiSetting.call(context);

			expect(result).toEqual({ contentType: 'uiSetting', dataObject: {} });
		});
	});

	describe('customGridStyles', () => {
		it('should return empty string when uiSetting is empty', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.customGridStyles.call(context);

			expect(result).toBe('');
		});

		it('should include textAlign style', () => {
			context.uiSetting = {
				dataObject: { textAlign: 'center' }
			};

			const result = contentfulUiSettingStylesMixin.computed.customGridStyles.call(context);

			expect(result).toContain('text-align: center;');
		});

		it('should include verticalAlign style', () => {
			context.uiSetting = {
				dataObject: { verticalAlign: 'flex-start' }
			};

			const result = contentfulUiSettingStylesMixin.computed.customGridStyles.call(context);

			expect(result).toContain('align-items: flex-start;');
		});

		it('should include horizontalAlign style', () => {
			context.uiSetting = {
				dataObject: { horizontalAlign: 'space-between' }
			};

			const result = contentfulUiSettingStylesMixin.computed.customGridStyles.call(context);

			expect(result).toContain('justify-items: space-between;');
		});

		it('should combine all alignment styles', () => {
			context.uiSetting = {
				dataObject: {
					textAlign: 'left',
					verticalAlign: 'center',
					horizontalAlign: 'end'
				}
			};

			const result = contentfulUiSettingStylesMixin.computed.customGridStyles.call(context);

			expect(result).toContain('text-align: left;');
			expect(result).toContain('align-items: center;');
			expect(result).toContain('justify-items: end;');
		});
	});

	describe('maxWidthStyles', () => {
		it('should return undefined when maxWidthValue is not set', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.maxWidthStyles.call(context);

			expect(result).toBeUndefined();
		});

		it('should return max-width style with default unit', () => {
			context.uiSetting = {
				dataObject: { maxWidthValue: 50 }
			};

			const result = contentfulUiSettingStylesMixin.computed.maxWidthStyles.call(context);

			expect(result).toBe('max-width: 50rem;');
		});

		it('should return max-width style with custom unit', () => {
			context.uiSetting = {
				dataObject: {
					maxWidthValue: 100,
					maxWidthUnit: 'px'
				}
			};

			const result = contentfulUiSettingStylesMixin.computed.maxWidthStyles.call(context);

			expect(result).toBe('max-width: 100px;');
		});

		it('should handle percentage unit', () => {
			context.uiSetting = {
				dataObject: {
					maxWidthValue: 75,
					maxWidthUnit: '%'
				}
			};

			const result = contentfulUiSettingStylesMixin.computed.maxWidthStyles.call(context);

			expect(result).toBe('max-width: 75%;');
		});
	});

	describe('singleColumn', () => {
		it('should return false when not set', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.singleColumn.call(context);

			expect(result).toBe(false);
		});

		it('should return true when set', () => {
			context.uiSetting = {
				dataObject: { singleColumn: true }
			};

			const result = contentfulUiSettingStylesMixin.computed.singleColumn.call(context);

			expect(result).toBe(true);
		});
	});

	describe('swapOrder', () => {
		it('should return false when not set', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.swapOrder.call(context);

			expect(result).toBe(false);
		});

		it('should return true when set', () => {
			context.uiSetting = {
				dataObject: { swapOrder: true }
			};

			const result = contentfulUiSettingStylesMixin.computed.swapOrder.call(context);

			expect(result).toBe(true);
		});
	});

	describe('themeName', () => {
		it('should return empty string when not set', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.themeName.call(context);

			expect(result).toBe('');
		});

		it('should return themeName when set', () => {
			context.uiSetting = {
				dataObject: { themeName: 'dark-theme' }
			};

			const result = contentfulUiSettingStylesMixin.computed.themeName.call(context);

			expect(result).toBe('dark-theme');
		});
	});

	describe('verticalPadding', () => {
		it('should return empty object when not set', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.verticalPadding.call(context);

			expect(result).toEqual({});
		});

		it('should return verticalPadding object when set', () => {
			const padding = { top: '2rem', bottom: '2rem' };
			context.uiSetting = {
				dataObject: { verticalPadding: padding }
			};

			const result = contentfulUiSettingStylesMixin.computed.verticalPadding.call(context);

			expect(result).toEqual(padding);
		});
	});

	describe('bodyColumns', () => {
		it('should return null when not set', () => {
			context.uiSetting = {};

			const result = contentfulUiSettingStylesMixin.computed.bodyColumns.call(context);

			expect(result).toBeNull();
		});

		it('should return bodyColumns value when set', () => {
			context.uiSetting = {
				dataObject: { bodyColumns: 3 }
			};

			const result = contentfulUiSettingStylesMixin.computed.bodyColumns.call(context);

			expect(result).toBe(3);
		});
	});
});
