import dotenv from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '..', '..', '.env');
const { error } = dotenv.config({ path: envPath });
if (error) throw new Error('Could not load .env file.');

const undefinedEnvVariables = [
  'VERSION',
  'MONGODB_URI',
  'MONGODB_DATABASE',
].filter(key => !process.env[key]);

if (undefinedEnvVariables.length > 0) {
  throw new Error(`
    The following environment variables are required for the app to start but were not defined:
    ${undefinedEnvVariables.join(', ')}
  `);
}
