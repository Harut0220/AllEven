import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import * as cheerio from 'cheerio';

class DocxService{
    index = async (p,dir = 'storage/') => {
        let newPath = 'docs/' + path.parse(p).name + '.html';


        await mammoth.convertToHtml({path: dir + p})
            .then(function(result){
                
                fs.writeFile(dir + newPath, result.value, function (err) {
                    if (err) throw err;
                  });
            })
            .done();

            async function extractTextFromHtmlWithCheerio(filePath) {
                try {
                    const htmlContent = fs.readFileSync(filePath, 'utf-8'); // Read the HTML file
                    const $ = cheerio.load(htmlContent);
                    return $.text().trim(); // Get all text and trim extra spaces
                } catch (error) {
                    console.error("Error extracting text from HTML with Cheerio:", error);
                    throw error;
                }
            }
            
            // Usage example:
            let result=[];
           await extractTextFromHtmlWithCheerio("storage/"+newPath)
                .then((text) => result.push (text))
                .catch(error => console.error("Failed to extract text:", error));
    
            const text=result[0]
            
        return {newPath,text}

    }
}


export default DocxService