process.env.NODE_ENV = 'production';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const JavaScriptObfuscator = require('webpack-obfuscator');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const prod = {
	mode: 'production',
	output: {
		filename: 'game.[contenthash].js'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					filename: '[name].[contenthash].js'
				}
			}
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new JavaScriptObfuscator(
			{
				rotateStringArray: true,
				stringArray: true,
				// stringArrayEncoding: 'base64', // disabled by default
				stringArrayThreshold: 0.75
			},
			['vendors.*.js']
		),
		new InjectManifest({
			swSrc: path.resolve(__dirname, '../src/pwa/sw.js'),
			exclude: [/sw\.js$/, /audio.*\.ogg$/, /index\.html$/]
		})
	]
};

module.exports = merge(common, prod);
