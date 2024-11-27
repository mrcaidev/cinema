declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      SESSION_SECRET: string;
      MONGO_URL: string;
      MONGO_DB_NAME: string;
      RESEND_API_KEY: string;
    }
  }
}

export {};
