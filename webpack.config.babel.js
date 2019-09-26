import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

export default {
	entry: './src/index.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				enforce: 'pre',
				use: {
					loader: 'eslint-loader',
					options: {
						configFile: __dirname + '/.eslintrc.json',
					},
				}
			},
			{
				test: /\.pug$/,
				exclude: /node_modules/,
				use: 'pug-loader',
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {importLoaders: 1},
					},
					{
						loader: 'postcss-loader',
						options: {
							config: {
								path: __dirname + '/postcss.config.js',
							},
						},
					},
				],
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/templates/index.pug',
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new StyleLintPlugin({
			configFile: path.resolve(__dirname, '.stylelintrc.json'),
			context: path.resolve(__dirname, './src'),
			files: '**/*.css',
			failOnError: false,
			quiet: false,
		}),
		new LiveReloadPlugin({
			appendScriptTag: true
		}),
	],
};
