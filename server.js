const fs = require('fs');
const express = require('express');
const { addAsync } = require('@awaitjs/express');
const path = require('path');

const app = addAsync(express());

const PORT = process.env.PORT || 5000;

const folder = path.join(__dirname, 'dist');
const indexFile = path.join(folder, 'index.html');
const assets = path.join(folder, 'assets');
const audio = path.join(assets, 'audio');

app
	.getAsync('/assets/audio/:audio', async (req, res, next) => {
		const filePath = path.join(audio, req.params.audio);
		const stat = fs.statSync(filePath);

		const range = req.headers.range;
		if (!range) return next();

		const positions = range.replace(/bytes=/, '').split('-');
		const start = parseInt(positions[0], 10);
		const total = stat.size;
		const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		const chunkSize = end - start + 1;

		res.writeHead(206, {
			'Accept-Ranges': 'bytes',
			'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
			'Content-Type': 'audio/ogg',
			'Content-Length': chunkSize
		});

		const stream = fs
			.createReadStream(filePath, { start: start, end: end })
			.on('open', () => stream.pipe(res));
	})
	.use(express.static(folder, { maxAge: 0 }))
	.get('/', (req, res) => res.sendFile(indexFile))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
