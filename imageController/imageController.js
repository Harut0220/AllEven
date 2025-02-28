import fs from "fs";
import path from "path";
import axios from "axios";

async function saveImageToDisk(url, outputPath) {
    try {
        // Use axios to fetch the local file
        const response = await axios.get(url, {
            responseType: 'stream'
        });

        // Determine the file name from the URL
        const fileName = path.basename(url);

        // Construct the full output path
        const fullPath = path.join(outputPath, fileName);

        // Create a writable stream to save the file
        const writer = fs.createWriteStream(fullPath);

        // Pipe the response stream to the writable stream
        response.data.pipe(writer);

        // Return a promise that resolves when the file is fully written
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading file:', error.message);
        throw error; // Rethrow the error to handle it upstream
    }
}

export default saveImageToDisk;
