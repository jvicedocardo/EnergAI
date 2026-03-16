# ⚡ EnergAI - Smart Dashboard & Asesor Energético

EnergAI es un SaaS (Software as a Service) moderno diseñado para ayudar a los usuarios a tomar el control de sus gastos domésticos. A través de Inteligencia Artificial (LLMs), la aplicación extrae automáticamente los datos de facturas en PDF/Imagen, los categoriza y ofrece insights personalizados de ahorro energético.

## ✨ Características Clave

- **📄 Extracción con IA (OCR Avanzado):** Sube tus facturas de Luz, Agua o Gas (PDF/PNG/JPG). El motor multimodal de Gemini extrae y estructura los datos clave (importe, consumos, empresa) sin necesidad de plantillas estáticas.
- **🔒 Autenticación Segura:** Sistema multi-usuario implementado con Auth.js (NextAuth v5) y Google OAuth. Cada usuario tiene su propio espacio de datos encriptado y privado.
- **📊 Analítica Visual:** Dashboard interactivo con gráficos de barras apiladas (Recharts) para visualizar la evolución del gasto, filtrable por año, mes y tipo de suministro.
- **🤖 Asesor Energético IA:** Un consultor virtual integrado que analiza los datos de tu vista actual en pantalla y te ofrece consejos prácticos y personalizados para reducir tu factura.
- **📥 Exportación a Excel:** Descarga tu histórico completo de facturas en formato `.csv` (optimizado para Europa con codificación BOM) con un solo clic.
- **⚡ Rendimiento y Resiliencia:** Construido con React 19 Server Components, Server Actions, Streaming de UI (Suspense) y manejo de errores global para una UX impecable.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Lenguaje:** TypeScript (Modo Estricto)
- **Base de Datos:** MongoDB + [Prisma ORM](https://www.prisma.io/)
- **Inteligencia Artificial:** [Vercel AI SDK](https://sdk.vercel.ai/) + Google Gemini (Flash & Pro)
- **Autenticación:** [Auth.js (v5 Beta)](https://authjs.dev/)
- **Estilos y UI:** Tailwind CSS, Sonner (Toasts)
- **Gráficos:** Recharts

## 🚀 Instalación y Despliegue Local

Si quieres clonar este repositorio y correrlo en tu máquina, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jvicedocardo/EnergAI.git
   cd energy-ai
   ```
2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo .env en la raíz del proyecto basándote en el archivo .env.example (necesitarás tu propia base de datos MongoDB y claves de API de Google/Gemini).

4. **Sincronizar la Base de Datos (Prisma):**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Abre http://localhost:3000 en tu navegador para ver la aplicación.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de abrir un Issue o enviar un Pull Request para mejorar la herramienta.
