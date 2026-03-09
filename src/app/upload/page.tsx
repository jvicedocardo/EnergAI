// src/app/upload/page.tsx
import Link from "next/link";
import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg mb-4">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium transition-colors"
        >
          <span>&larr;</span> Volver al Dashboard
        </Link>
      </div>

      <div className="text-center space-y-6 max-w-lg w-full bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Subir Factura
        </h1>
        <p className="text-sm text-gray-500">
          Sube tu factura (Luz, Agua o Gas) para extraer los datos con IA.
        </p>

        <div className="pt-2">
          <UploadForm />
        </div>
      </div>
    </main>
  );
}
