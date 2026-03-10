import Image from "next/image";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth"; // <-- Importamos signIn también

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="text-2xl">⚡</span>
        <span className="text-xl font-black text-gray-900 tracking-tight">
          Energ<span className="text-blue-600">AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Si el usuario ESTÁ logueado */}
        {session?.user ? (
          <>
            <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
              <span className="hidden md:block">{session.user.name}</span>
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="Perfil"
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
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
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
          </>
        ) : (
          /* Si el usuario NO ESTÁ logueado */
          <div className="flex items-center gap-3">
            <form
              action={async () => {
                "use server";
                await signIn("credentials", {
                  email: "demo@energai.com",
                  password: "demo123",
                  redirectTo: "/",
                });
              }}
            >
              <button
                type="submit"
                className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-1.5 px-4 rounded-md transition-colors shadow-sm flex items-center gap-2"
              >
                <span>✨</span> Ver Demo
              </button>
            </form>

            {/* El botón de Google normal */}
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-md transition-colors shadow-sm"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
