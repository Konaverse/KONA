const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const FRAMES_DIR = path.join(__dirname, '../public/frames');
const QUALITY = 85;

async function convertFile(filePath) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);

    // Skip non-jpg files
    if (ext.toLowerCase() !== '.jpg' && ext.toLowerCase() !== '.jpeg') {
        return false;
    }

    const targetPath = path.join(dir, `${basename}.webp`);

    // Skip if webp already exists
    if (fs.existsSync(targetPath)) {
        return false;
    }

    try {
        await sharp(filePath)
            .webp({ quality: QUALITY })
            .toFile(targetPath);
        return true;
    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
        return false;
    }
}

async function processDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let convertedCount = 0;

    const filesToConvert = [];

    // Collect all files
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            convertedCount += await processDirectory(fullPath);
        } else {
            filesToConvert.push(fullPath);
        }
    }

    // Process files in batches to avoid overwhelming memory/CPU
    const batchSize = 10;
    for (let i = 0; i < filesToConvert.length; i += batchSize) {
        const batch = filesToConvert.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(file => convertFile(file)));
        convertedCount += results.filter(r => r).length;

        // Log progress per folder if we're inside a specific frame folder
        if (results.some(r => r) && path.basename(dirPath) !== 'frames') {
            const folderName = path.basename(dirPath);
            const totalJpgs = filesToConvert.filter(f => f.toLowerCase().endsWith('.jpg')).length;
            console.log(`[${folderName}] Converted ${Math.min(i + batchSize, totalJpgs)} / ${totalJpgs}`);
        }
    }

    return convertedCount;
}

async function main() {
    console.log('🖼️  Starting WebP conversion pipeline...');
    console.log(`📂 Scanning directory: ${FRAMES_DIR}`);
    console.log(`🎯 Target quality: ${QUALITY}`);
    console.log('-------------------------------------------');

    if (!fs.existsSync(FRAMES_DIR)) {
        console.error(`❌ Error: Directory not found: ${FRAMES_DIR}`);
        process.exit(1);
    }

    const startTime = Date.now();
    const totalConverted = await processDirectory(FRAMES_DIR);
    const durationInSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('-------------------------------------------');
    console.log(`✅ Conversion complete in ${durationInSeconds}s!`);
    console.log(`✨ Total files converted to WebP: ${totalConverted}`);
    if (totalConverted > 0) {
        console.log('⚠️  Note: Original JPG files have NOT been deleted. Please verify the WebP files before manually removing JPGs.');
    } else {
        console.log('ℹ️  No new files needed conversion.');
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
