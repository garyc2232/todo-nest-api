import 'dotenv/config';

export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE: {
    HOST: process.env.DATABASE_HOST || 'localhost',
    PORT: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    NAME: process.env.DB_NAME || 'todo-app',
    USERNAME: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'password',
  },
  JWT: {
    AT_SECRET: process.env.AT_SECRET || 'at-secret',
    RT_SECRET: process.env.RT_SECRET || 'rt-secret',
  },
});
