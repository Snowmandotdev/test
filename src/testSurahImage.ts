import { writeFileSync } from 'fs';
import { SurahImageGenerator } from './SurahImageGenerator.js';

async function main() {
    const surahData = {
        id: '36',
        nameAr: 'يس',
        nameEn: 'Ya-Sin',
        reader: 'مشاري راشد العفاسي',
        verses: '83',
        type: 'مكية',
        volume: '75%',
        state: 'playing' as const,
    };

    console.log('Generating Surah image...');
    const buffer = await SurahImageGenerator.generate(surahData);
    writeFileSync('surah-output.png', buffer);
    console.log('Image saved to surah-output.png');
}

main().catch(console.error);
