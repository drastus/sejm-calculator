"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
exports.default = {
    target: 'web',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path_1.default.resolve(__dirname, 'dist'),
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
                    filename: function (name) {
                        var filePath = name.filename.split('/').slice(1, -1).join('/');
                        return "".concat(filePath, "/[name][ext]");
                    },
                },
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: mini_css_extract_plugin_1.default.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    },
                    {
                        loader: 'postcss-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new html_webpack_plugin_1.default({
            template: './src/templates/index.pug',
        }),
        new mini_css_extract_plugin_1.default({
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
//# sourceMappingURL=webpack.config.js.map