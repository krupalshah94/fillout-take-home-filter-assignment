import dotenv from "dotenv";
dotenv.config();

interface AppConfig {
  apiUrl: string;
  port: number;
  serverHost: string;
  externalApiToken: string;
}

const envConfig: AppConfig = {
  apiUrl: process.env.FILL_OUT_API_ENV_POINT || 'default-api-url',
  port: parseInt(process.env.PORT || '8000', 8000),
  serverHost: process.env.SERVER_HOST || 'localhost',
  externalApiToken: process.env.FILL_OUT_API_TOKEN || '',
};


export default envConfig;