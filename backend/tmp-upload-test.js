import fs from 'fs';
import path from 'path';

const fetchFn = globalThis.fetch;
const FormDataCtor = globalThis.FormData;

if (!fetchFn || !FormDataCtor) {
  throw new Error('Node environment must support global fetch and FormData.');
}

const run = async () => {
  const registerResponse = await fetchFn('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `UploadTest${Date.now()}`,
      email: `upload-test-${Date.now()}@local.com`,
      password: 'password123',
    }),
  });

  const registerBody = await registerResponse.json();
  console.log('register status', registerResponse.status);
  console.log('register response', registerBody);

  if (!registerBody.token) {
    throw new Error('Registration failed while creating temporary upload test user');
  }

  const filePath = path.join(process.cwd(), 'package.json');
  const form = new FormDataCtor();
  form.append('file', fs.createReadStream(filePath));

  const uploadResponse = await fetchFn('http://localhost:5000/api/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${registerBody.token}`,
    },
    body: form,
  });

  console.log('upload status', uploadResponse.status);
  console.log(await uploadResponse.text());
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
