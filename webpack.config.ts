import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
				test: /\.svg$/,
				type: 'asset/resource',
				generator: {
					filename: (name: {filename: string}) => {
						const filePath = name.filename.split('/').slice(1, -1).join('/');
						return `${filePath}/[name][ext]`;
					},
				},
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
	],
	devServer: {
		watchFiles: ['src/**/*'],
		client: {
			overlay: false,
		},
	},
};
