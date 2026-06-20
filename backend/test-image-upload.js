import fs from 'fs';

const run = async () => {
  const registerResponse = await fetch('http://127.0.0.1:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `UploadTest${Date.now()}`,
      email: `upload-test-${Date.now()}@local.com`,
      password: 'password123',
    }),
  });

  const registerBody = await registerResponse.json();
  const token = registerBody.token;
  console.log('Registration successful');
  
  // Create a test image
  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52]);
  
  const form = new FormData();
  const blob = new Blob([pngHeader], { type: 'image/png' });
  form.append('file', blob, 'test-image.png');

  console.log('Uploading file...');
  const uploadResponse = await fetch('http://127.0.0.1:5001/api/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  console.log('upload status', uploadResponse.status);
  const responseText = await uploadResponse.text();
  console.log('upload response:', responseText);
};

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
