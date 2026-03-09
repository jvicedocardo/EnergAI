import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  // Obtenemos la sesión del usuario actual directamente en el servidor
  const session = await auth();

  // Si no hay sesión (ej. pantalla de login), no renderizamos la barra
  if (!session?.user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Logo / Título izquierdo */}
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="text-2xl">⚡</span>
        <span className="text-xl font-black text-gray-900 tracking-tight">
          Energy<span className="text-blue-600">AI</span>
        </span>
      </Link>

      {/* Zona del Usuario a la derecha */}
      <div className="flex items-center gap-4">
        {/* Info del usuario (ocultamos el nombre en móviles muy pequeños para que no rompa el diseño) */}
        <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
          <span className="hidden md:block">{session.user.name}</span>

          {session.user.image ? (
            // Usamos un tag img normal para evitar tener que configurar los dominios externos en next.config.js
            <Image
              src={session.user.image}
              alt="Perfil de usuario"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold shadow-sm">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* Separador visual */}
        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

        {/* Botón de Cerrar Sesión (Server Action inline) */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="text-sm bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold py-1.5 px-3 rounded-md transition-colors border border-gray-200"
          >
            Salir
          </button>
        </form>
      </div>
    </nav>
  );
}
