declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
    BASE_URL: string;
    JWT_SECRET: string;
    EMAIL_SERVICE: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    ADMIN_EMAIL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
