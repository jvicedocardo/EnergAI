import { signIn } from "@/auth";

export default function LandingHero() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-6 py-12 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Efecto de resplandor de fondo (glow) sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Etiqueta superior */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Inteligencia Artificial aplicada a tus finanzas
        </div>

        {/* Titular Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
          Toma el control de tu <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
            gasto energético
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Sube tus facturas en PDF. Nuestra IA extrae los datos, categoriza el
          consumo y te ofrece análisis visuales y recomendaciones de ahorro al
          instante. Sin plantillas, sin esfuerzo.
        </p>

        {/* Botones de Acción (CTAs) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mb-24">
          {/* Formulario para Login Demo */}
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
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
            >
              <span>✨</span> Probar Demo en 1 clic
            </button>
          </form>

          {/* Formulario para Login Google */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Iniciar con Google
            </button>
          </form>
        </div>

        {/* Grid de Características (Features) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
              📄
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Visión Artificial
            </h3>
            <p className="text-slate-600 leading-relaxed">
              No pierdas tiempo picando datos. Sube tus PDFs de cualquier
              comercializadora y el motor multimodal de Gemini extraerá los
              importes, fechas y consumos con precisión absoluta.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Analítica Visual
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Compara el histórico de tu consumo de luz, agua y gas con gráficos
              interactivos. Detecta picos de gasto al instante filtrando por
              años, meses y tipo de suministro.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-6">
              🧠
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Asesor Inteligente
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Recibe recomendaciones de ahorro dinámicas basadas en el contexto
              de tu pantalla actual. La IA analiza tus patrones de gasto reales
              y te da consejos personalizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
