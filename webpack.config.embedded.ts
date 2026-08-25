import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
	target: 'web',
	entry: './src/index-embedded.ts',
	output: {
		filename: 'sejm-calculator.js',
		path: path.resolve(__dirname, 'dist-embedded'),
		clean: true,
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
				test: /\.csv$/,
				type: 'asset/source',
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
					{loader: MiniCssExtractPlugin.loader},
					{loader: 'css-loader', options: {importLoaders: 1}},
					{loader: 'postcss-loader'},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
	],
};
