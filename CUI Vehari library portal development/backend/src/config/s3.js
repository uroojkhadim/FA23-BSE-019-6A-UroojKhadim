const { S3Client } = require('@aws-sdk/client-s3');

const endpointRaw = process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com';
const endpoint = endpointRaw.startsWith('http') ? endpointRaw : `https://${endpointRaw}`;
const accessKeyId = process.env.B2_KEY_ID || process.env.B2_APPLICATION_KEY_ID;
const secretAccessKey = process.env.B2_APPLICATION_KEY;
const region = process.env.B2_REGION || 'us-east-005';

if (!accessKeyId || !secretAccessKey || !process.env.B2_BUCKET_NAME || !process.env.B2_ENDPOINT) {
  console.warn('B2 storage is not fully configured. Check B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME, and B2_ENDPOINT.');
}

const s3 = new S3Client({
  region,
  endpoint: endpoint, 
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

module.exports = s3;
