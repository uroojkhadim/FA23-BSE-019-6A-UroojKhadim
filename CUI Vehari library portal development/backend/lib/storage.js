const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: 'us-east-005', // B2 standard region
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

const uploadFile = async (key, buffer, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  return s3.send(command);
};

const getDownloadUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
  });
  return s3.send(command);
};

module.exports = { uploadFile, getDownloadUrl, deleteFile };
