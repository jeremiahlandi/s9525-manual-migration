const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const htmlSource = path.join(__dirname, '../s9525'); 
const outputFolder = './scraped-data';

// Helper function to find all HTML files in subdirectories
function getFilesRecursively(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFilesRecursively(filePath, fileList);
        } else if (file.endsWith('.html') && !file.startsWith('_')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

async function runMigration() {
    await fs.ensureDir(outputFolder);
    const allFiles = getFilesRecursively(htmlSource);
    console.log(`Found ${allFiles.length} files to scrape.`);

    const results = [];

    for (const file of allFiles) {
        try {
            const html = await fs.readFile(file, 'utf8');
            const $ = cheerio.load(html);

            // Using Cheerio selectors to target your specific legacy structure
            const data = {
                fileName: path.basename(file),
                title: $('h1').first().text().trim(),
                tools: [],
                steps: []
            };

            // Scraping the specific toolkit attributes we found earlier
            $('[toolkit]').each((i, el) => {
                data.tools.push({
                    id: $(el).attr('id'),
                    name: $(el).closest('td').text().trim()
                });
            });

            // Scraping the ordered list steps
            $('ol > li').each((i, el) => {
                data.steps.push($(el).text().trim());
            });

            results.push(data);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    // Save the final result as one big JSON file for Sanity
    await fs.writeJson('./all-manual-data.json', results, { spaces: 2 });
    console.log('Migration complete! Data saved to all-manual-data.json');
}

runMigration();