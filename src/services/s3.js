import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as presigner } from "@aws-sdk/s3-request-presigner";

// Configuração do AWS S3
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Faz upload de um Buffer para o S3
 * @param {Buffer} buffer - conteúdo do arquivo em buffer
 * @param {string} key - chave no bucket (ex: "procedimentos/123/antes_1616161616.jpg")
 * @param {string} contentType - MIME type do arquivo
 * @param {boolean} [publicRead=false] - se deve liberar leitura pública
 */
export async function uploadBuffer(buffer, key, contentType, publicRead = false) {
    const cmd = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });
    await s3.send(cmd);
}

/**
 * Faz upload de um Buffer de PDF para o S3
 * Mantém compatibilidade com uso atual de orçamentos
 * @param {Buffer} buffer
 * @param {string} key
 */
export async function uploadPdf(buffer, key) {
    // PDF sempre privado por padrão
    await uploadBuffer(buffer, key, 'application/pdf', false);
}

/**
 * Gera URL assinada para download de qualquer arquivo no S3 (expiresIn em segundos)
 * @param {string} key
 * @param {number} expiresIn
 * @returns {Promise<string>}
 */
export async function getUrl(key, expiresIn = 300) {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return presigner(s3, cmd, { expiresIn });
}

/**
 * Gera URL assinada especificamente para PDF de orçamento
 * Mantém compatibilidade com uso atual
 * @param {string} key
 * @param {number} expiresIn
 * @returns {Promise<string>}
 */
export async function getPdfUrl(key, expiresIn = 300) {
    return getUrl(key, expiresIn);
}
