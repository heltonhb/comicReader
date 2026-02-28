import fs from 'fs';
import path from 'path';
import { fromPath } from 'pdf2pic';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SOURCE_DIR = path.resolve(__dirname, '../source_hqs');
const VOLUMES_DIR = path.resolve(PUBLIC_DIR, 'volumes');

// Configuração do pdf2pic
const baseOptions = {
    density: 300,
    saveFilename: "page",
    savePath: VOLUMES_DIR,
    format: "webp",
    quality: 80,
    preserveAspectRatio: true
};

async function convertPdfs() {
    if (!fs.existsSync(VOLUMES_DIR)) {
        fs.mkdirSync(VOLUMES_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));

    for (const file of files) {
        const volumeId = file.replace('_final.pdf', '').toLowerCase();
        const volumePath = path.join(VOLUMES_DIR, volumeId);
        const pdfPath = path.join(SOURCE_DIR, file);

        if (!fs.existsSync(volumePath)) {
            fs.mkdirSync(volumePath, { recursive: true });
        }

        console.log(`Convertendo ${file} para a pasta ${volumePath}...`);

        const options = {
            ...baseOptions,
            savePath: volumePath
        };

        const convert = fromPath(pdfPath, options);

        // pdf2pic não retorna page count por padrão em fromPath bulk sem instanciar
        // Usaremos uma abordagem para converter todas as páginas usando bulk
        try {
            const results = await convert.bulk(-1, false);
            console.log(`✅ ${file}: ${results.length} páginas convertidas.`);

            // Gerar metadata.json
            fs.writeFileSync(
                path.join(volumePath, 'metadata.json'),
                JSON.stringify({ numPages: results.length, id: volumeId }, null, 2)
            );
        } catch (e) {
            console.error(`Erro ao converter ${file}:`, e);
        }
    }

    console.log("Conversão finalizada!");
}

convertPdfs();
