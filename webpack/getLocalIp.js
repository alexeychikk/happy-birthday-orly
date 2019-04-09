'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

module.exports = () => {
	for (let ifname in ifaces) {
		for (let iface of ifaces[ifname]) {
			if (
				'IPv4' !== iface.family ||
				iface.internal !== false ||
				iface.netmask !== '255.255.255.0'
			) {
				continue;
			}

			if (iface.address.startsWith('192.168.1')) return iface.address;
		}
	}
};
