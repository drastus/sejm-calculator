/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

export default {
	target: 'web',
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
				test: /\.pug$/,
				exclude: /node_modules/,
				use: '@webdiscus/pug-loader',
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
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/templates/index.pug',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new ESLintPlugin({
			files: ['./*.[jt]s', './src/**/*.[jt]s'],
		}),
		new StyleLintPlugin({
			configFile: path.resolve(__dirname, '.stylelintrc.json'),
			context: path.resolve(__dirname, './src'),
			files: '**/*.css',
		}),
	],
	devServer: {
		watchFiles: ['src/**/*'],
	},
};
