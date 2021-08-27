export default {
	computed: {
		/**
		 * Depends on various custom properties on Contentful dataObject
		 */
		customGridStyles() {
			let customStyles = '';
			// Check for custom width
			const maxWidthValue = this.uiSetting?.dataObject?.maxWidthValue ?? null;
			const maxWidthUnit = this.uiSetting?.dataObject?.maxWidthUnit ?? 'rem';
			if (maxWidthValue) {
				customStyles = `maxWidth: ${maxWidthValue}${maxWidthUnit};`;
			}
			// Check for custom text alignment
			const textAlign = this.uiSetting?.dataObject?.textAlign ?? null;
			if (textAlign) {
				customStyles = `${customStyles} textAlign: ${textAlign};`;
			}
			return customStyles;
		},
		/**
		 * Depends on singleColumn property on Contentful dataObject
		 */
		singleColumn() {
			return this.uiSetting?.dataObject?.singleColumn ?? false;
		},
		/**
		 * Depends on swapOrder property on Contentful dataObject
		 */
		swapOrder() {
			return this.uiSetting?.dataObject?.swapOrder ?? false;
		},
		uiSetting() {
			const uiSetting = this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
			return uiSetting ?? {};
		},
		/**
		 * Depends on verticalPadding property on Contentful dataObject
		 */
		verticalPadding() {
			return this.uiSetting?.dataObject?.verticalPadding ?? {};
		},
	}
};
