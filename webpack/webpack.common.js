const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
	entry: './src/game.ts',
	output: {
		filename: 'game.bundle.js',
		path: path.resolve(__dirname, '../dist')
	},
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, '../src/')
		},
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]|[\\/]src[\\/]plugins[\\/]/,
					name: 'vendors',
					chunks: 'all',
					filename: '[name].bundle.js'
				}
			}
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: process.env.NODE_ENV === 'production' && {
				collapseWhitespace: true,
				removeComments: true,
				minifyCSS: true,
				minifyJS: true
			}
		}),
		new CopyWebpackPlugin([
			{ from: 'src/assets', to: 'assets' },
			{ from: 'src/pwa', to: '' },
			{ from: 'src/favicon.ico', to: '' }
		]),
		new InjectManifest({
			swSrc: path.resolve(__dirname, '../src/pwa/sw.js'),
			exclude: [/\/spine\/raw\/*/]
		})
	]
};
