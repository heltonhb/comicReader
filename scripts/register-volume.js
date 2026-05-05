#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node register-volume.js <nome-volume>');
    console.log('Example: node register-volume.js hq-naruto');
    process.exit(1);
}

const name = args[0];
const metadataPath = path.join(ROOT_DIR, 'public/volumes', name, 'metadata.json');

if (!fs.existsSync(metadataPath)) {
    console.error(`❌ Erro: metadata.json não encontrado em public/volumes/${name}/`);
    process.exit(1);
}

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
const volumesPath = path.join(ROOT_DIR, 'src/volumes.js');

let volumesContent = fs.readFileSync(volumesPath, 'utf-8');

const volumeEntry = `    {
        id: '${name}',
        title: '${metadata.title}',
        folder: '/volumes/${name}',
    },`;

if (volumesContent.includes(`id: '${name}'`)) {
    console.log(`⚠️  Volume "${name}" já está registrado`);
    process.exit(0);
}

const insertMarker = '];';
const insertIndex = volumesContent.lastIndexOf(insertMarker);
volumesContent = volumesContent.slice(0, insertIndex) + ',\n' + volumeEntry + '\n' + volumesContent.slice(insertIndex);

fs.writeFileSync(volumesPath, volumesContent);

console.log(`✅ Volume "${metadata.title}" registrado em src/volumes.js`);
console.log(`\n🚀 Execute "npm run dev" para testar`);