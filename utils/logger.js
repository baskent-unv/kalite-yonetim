import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logError = (err) => {
    const logMessage = `${new Date().toISOString()} - ERROR: ${err.message}\n${err.stack}\n\n`;

    fs.appendFile(path.join(__dirname, '../logs/errors.log'), logMessage, (writeErr) => {
        if (writeErr) {
            console.error('Error logging the error:', writeErr)
        }
    })
}