import 'dotenv/config' // Если используете .env
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'file:./dev.db', // Путь к файлу базы данных
  },
})