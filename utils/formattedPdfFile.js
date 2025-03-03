import { exec } from "child_process";
import { configDotenv } from "dotenv";
configDotenv();
export const disablePdfPriting = (filePath, outputFilePath, callback) => {
    const command = `qpdf --encrypt "" "${process.env.PDF_PASSPWORD}" 256 --print=none -- ${filePath} ${outputFilePath}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        callback(null, outputFilePath);
    });
}