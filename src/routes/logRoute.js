const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const logDirectory = path.join(process.cwd(), 'logs');

router.get('/logs', (req, res) => {
    fs.readdir(logDirectory, (err, files) => {
        if (err) {
            console.error('Error reading log directory:', err);
            return res.status(500).send('Error reading log directory');
        }

        const logFiles = files.filter(file => file.startsWith('log_') && file.endsWith('.log'));

        logFiles.sort((a, b) => {
            const dateA = new Date(a.replace('log_', '').replace('.log', ''));
            const dateB = new Date(b.replace('log_', '').replace('.log', ''));
            return dateB - dateA;
        });

        const escapeHTML = (str) => {
            return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        const html = `
            <html>
            <body>
            <h1>Log Files</h1>
            <ul>
            ${logFiles.map(file => `<li><a href="/logs/${escapeHTML(file)}">${escapeHTML(file)}</a></li>`).join('')}
            </ul>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    });
});

router.get('/logs/:filename', (req, res) => {
    const filename = path.basename(req.params.filename); // Sanitize input
    const filePath = path.join(logDirectory, filename);  // Safe resolve

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Error accessing log file:', err);
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Type', 'text/plain');
        res.sendFile(filePath);
    });
});

module.exports = router;
