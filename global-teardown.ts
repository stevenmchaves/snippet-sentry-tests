import { promises as fs } from 'fs';
import * as path from 'path';

async function globalTeardown() {
  const filePath = path.resolve(__dirname, 'user.json');
  try {
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File not found: ${filePath}`);
    } else {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  }
}

export default globalTeardown;