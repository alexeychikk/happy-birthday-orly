const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const getLocalIp = require('./getLocalIp');

console.log(`Listening on http://${getLocalIp()}:8080`);

const local = {
	devServer: {
		host: getLocalIp()
	}
};

module.exports = merge(dev, local);
