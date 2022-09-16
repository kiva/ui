export default {
	computed: {
		/**
		 * Depends on various custom properties on Contentful dataObject
		 */
		customGridStyles() {
			let customStyles = '';
			// Custom text alignment
			const textAlign = this.uiSetting?.dataObject?.textAlign ?? null;
			if (textAlign) {
				customStyles = `${customStyles} text-align: ${textAlign};`;
			}
			// Vertical alignment of grid items
			const verticalAlign = this.uiSetting?.dataObject?.verticalAlign ?? null;
			if (verticalAlign) {
				customStyles = `${customStyles} align-items: ${verticalAlign};`;
			}

			// Horizontal alignment of grid items
			const horizontalAlign = this.uiSetting?.dataObject?.horizontalAlign ?? null;
			if (horizontalAlign) {
				customStyles = `${customStyles} justify-items: ${horizontalAlign};`;
			}

			return customStyles;
		},
		maxWidthStyles() {
			// Custom max-width
			const maxWidthValue = this.uiSetting?.dataObject?.maxWidthValue ?? null;
			const maxWidthUnit = this.uiSetting?.dataObject?.maxWidthUnit ?? 'rem';
			if (maxWidthValue) {
				return `max-width: ${maxWidthValue}${maxWidthUnit};`;
			}
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
		/**
		 * Depends on themeName property on Contentful dataObject
		 */
		themeName() {
			return this.uiSetting?.dataObject?.themeName ?? '';
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
