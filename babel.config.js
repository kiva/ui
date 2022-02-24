module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: {
					browsers: [
						'> 1%',
						'last 2 versions',
						'not ie <= 9'
					]
				}
			}
		]
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		[
			'@babel/plugin-transform-runtime',
			{
				regenerator: true
			}
		]
	],
	overrides: [{
		test: './src/lib/globekit/globekit.esm.js',
		compact: true
	}],
	env: {
		test: {
			presets: [
				'@babel/preset-env'
			],
			plugins: [
				'@babel/plugin-transform-modules-commonjs',
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-syntax-import-meta',
				[
					'@babel/plugin-transform-runtime',
					{
						regenerator: true
					}
				]
			]
		}
	}
};
