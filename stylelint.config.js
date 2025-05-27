const tailwindAtRules = [
	'tailwind',
	'apply',
	'variants',
	'responsive',
	'screen'
];

export default {
	extends: [
		'stylelint-config-standard-scss',
		'stylelint-config-standard-vue/scss'
	],
	rules: {
		'at-rule-no-unknown': null,
		'at-rule-no-deprecated': [
			true,
			{
				ignoreAtRules: tailwindAtRules
			}
		],
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: tailwindAtRules
			}
		],
		'at-rule-empty-line-before': null,
		'no-empty-source': null,
		'unit-allowed-list': ['em', 'rem', '%', 'px', 'deg', 'vh', 'vw', 'ms', 's', 'fr'],
		'keyframes-name-pattern': null,
		'scss/dollar-variable-pattern': null,
		'selector-class-pattern': null,
		'selector-id-pattern': null,
		'selector-attribute-quotes': 'never',
		'scss/at-mixin-argumentless-call-parentheses': 'always',
		'number-max-precision': null,
		'scss/comment-no-empty': null,
		'scss/at-extend-no-missing-placeholder': null,
		'scss/operator-no-newline-after': null,
		'scss/operator-no-unspaced': null
	}
};
