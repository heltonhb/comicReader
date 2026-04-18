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

    // Define a local temp directory to avoid filling up the OS /tmp
    const localTmp = path.resolve(__dirname, '../source_hqs/tmp');
    if (!fs.existsSync(localTmp)) fs.mkdirSync(localTmp, { recursive: true });
    process.env.MAGICK_TMPDIR = localTmp;
    process.env.TMPDIR = localTmp;

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

        let pageNum = 1;
        let successCount = 0;

        while (true) {
            try {
                console.log(`Processando página ${pageNum} de ${file}...`);
                const result = await convert(pageNum, false);
                if (!result || !result.name) {
                    break;
                }
                successCount++;
                pageNum++;
            } catch (e) {
                // Chegou ao final do PDF ou erro
                console.log(`Fim do PDF ou erro na página ${pageNum}. Total convertido: ${successCount}`);
                break;
            }
        }

        // Gerar metadata.json
        if (successCount > 0) {
            fs.writeFileSync(
                path.join(volumePath, 'metadata.json'),
                JSON.stringify({ numPages: successCount, id: volumeId }, null, 2)
            );
            console.log(`✅ ${file}: ${successCount} páginas convertidas com sucesso.`);
        }
    }

    // Limpar temp local
    try {
        fs.rmSync(localTmp, { recursive: true, force: true });
    } catch (e) { }

    console.log("Conversão finalizada!");
}

convertPdfs();
