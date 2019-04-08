const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const folder = path.join(__dirname, 'dist');
const indexFile = path.join(folder, 'index.html');

express()
	.use(express.static(folder))
	.get('/', (req, res) => res.sendFile(indexFile))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
