#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public/volumes');

const args = process.argv.slice(2);

function usage() {
    console.log(`
📚 Adicionar Volume ao Gibiteca HQ

Usage: node add-volume.js <nome> [opções]

Arguments:
  nome              Nome da pasta do volume (sem espaços, ex: "hq-naruto")

Options:
  --title "TÍTULO"  Título do volume (padrão: nome com espaços)
  --pages N         Número de páginas (obrigatório)
  --cover PATH     Caminho para imagem de capa

Example:
  node add-volume.js hq-naruto --pages 120 --title "Naruto Vol.1"
`);
    process.exit(1);
}

if (args.length === 0) usage();

const name = args[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
let title = name.replace(/-/g, ' ');
let numPages = null;
let coverPath = null;

for (let i = 1; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) {
        title = args[i + 1];
        i++;
    } else if (args[i] === '--pages' && args[i + 1]) {
        numPages = parseInt(args[i + 1], 10);
        i++;
    } else if (args[i] === '--cover' && args[i + 1]) {
        coverPath = args[i + 1];
        i++;
    }
}

if (!numPages) {
    console.error('❌ Erro: Número de páginas é obrigatório (--pages N)');
    usage();
}

const volumeDir = path.join(PUBLIC_DIR, name);

if (fs.existsSync(volumeDir)) {
    console.error(`❌ Erro: Volume "${name}" já existe em ${volumeDir}`);
    process.exit(1);
}

console.log(`\n📁 Criando volume: ${name}`);
console.log(`   Título: ${title}`);
console.log(`   Páginas: ${numPages}`);

fs.mkdirSync(volumeDir, { recursive: true });
console.log('   ✓ Pasta criada');

const metadata = {
    id: name,
    title,
    numPages,
    createdAt: new Date().toISOString()
};

if (coverPath && fs.existsSync(coverPath)) {
    const ext = path.extname(coverPath);
    const destCover = path.join(volumeDir, `cover${ext}`);
    fs.copyFileSync(coverPath, destCover);
    metadata.cover = `cover${ext}`;
    console.log(`   ✓ Capa copiada: ${path.basename(destCover)}`);
}

fs.writeFileSync(
    path.join(volumeDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
);
console.log('   ✓ metadata.json criado');

console.log('\n✅ Volume criado com sucesso!');
console.log(`\n📋 Próximos passos:`);
console.log(`   1. Adicione as imagens em: public/volumes/${name}/`);
console.log(`   2. Renomeie as imagens para: page-001.webp, page-002.webp, etc.`);
console.log(`   3. Execute: node scripts/register-volume.js ${name}`);