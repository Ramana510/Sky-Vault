import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root reliably, regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Parses a CLOUDINARY_URL of the form:
 *   cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * Returns { cloud_name, api_key, api_secret }
 */
function parseCloudinaryUrl(url) {
  const withoutScheme = url.replace('cloudinary://', '');
  const atIdx = withoutScheme.lastIndexOf('@');
  if (atIdx === -1) throw new Error('CLOUDINARY_URL is missing "@" separator. Format: cloudinary://api_key:api_secret@cloud_name');
  const cloud_name = withoutScheme.slice(atIdx + 1).trim();
  const credentials = withoutScheme.slice(0, atIdx);
  const colonIdx = credentials.indexOf(':');
  if (colonIdx === -1) throw new Error('CLOUDINARY_URL is missing ":" between api_key and api_secret.');
  const api_key = credentials.slice(0, colonIdx).trim();
  const api_secret = credentials.slice(colonIdx + 1).trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('CLOUDINARY_URL is incomplete. Format: cloudinary://api_key:api_secret@cloud_name');
  }
  return { cloud_name, api_key, api_secret };
}

const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
const cloudName   = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey      = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret   = process.env.CLOUDINARY_API_SECRET?.trim();

if (cloudinaryUrl) {
  if (!cloudinaryUrl.startsWith('cloudinary://')) {
    throw new Error('Invalid CLOUDINARY_URL format. It must start with cloudinary://');
  }
  // Parse URL manually so the SDK receives explicit, validated credentials
  const creds = parseCloudinaryUrl(cloudinaryUrl);
  cloudinary.v2.config(creds);
  console.log(`Cloudinary configured for cloud: ${creds.cloud_name}`);
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  console.log(`Cloudinary configured for cloud: ${cloudName}`);
} else {
  throw new Error(
    'Cloudinary is not configured. Set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET) in backend/.env'
  );
}

export default cloudinary.v2;
