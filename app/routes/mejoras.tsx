import { Form, useLoaderData } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import { getUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return json({ user });
};

export default function RoadmapPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">Hoja de Ruta</h1>
        {user ? (
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        ) : null}
      </header>

      <main className="container mx-auto max-w-3xl space-y-16 px-4 py-12">

        {/* Sección 1: Qué dice la gente */}
        <section>
          <h2 className="mb-2 text-2xl font-bold">¿Qué dice la gente?</h2>
          <p className="mb-6 text-gray-600">
            Patrones y temas que nos han contado quienes usan la lista.
          </p>

          <div className="space-y-6">
            <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 px-4 py-3">
              <p className="text-sm text-gray-500">Varios usuarios</p>
              <p className="mt-1">
                "Quiero poder sugerir un regalo si el que está en la lista no me convence"
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-green-400 bg-green-50 px-4 py-3">
              <p className="text-sm text-gray-500">Camila C.</p>
              <p className="mt-1">
                "Sería lindo que aparezca un mensaje tipo 'Gracias por asignarte este deseo' — algo simpático que lo haga más amigable"
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-purple-400 bg-purple-50 px-4 py-3">
              <p className="text-sm text-gray-500">Camila C.</p>
              <p className="mt-1">
                "Debería poder verse un nombre en vez del email cuando alguien se asigna un deseo"
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-orange-400 bg-orange-50 px-4 py-3">
              <p className="text-sm text-gray-500">Usuario</p>
              <p className="mt-1">
                "No se entiende bien lo de la cantidad — ¿por qué tengo que comprar 250 pañales?"
              </p>
            </div>
          </div>
        </section>

        {/* Sección 2: Qué hemos hecho con eso */}
        <section>
          <h2 className="mb-2 text-2xl font-bold">¿Qué hemos hecho con eso?</h2>
          <p className="mb-6 text-gray-600">
            Cambios que ya implementamos en respuesta al feedback.
          </p>

          <ul className="space-y-4">
            <li className="rounded-lg border p-4">
              <h3 className="font-semibold">
                Mensaje de bienvenida al entrar a la lista
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Contexto: usuaria ingresa a la lista → ahora ve un mensajito
                breve y amigable de bienvenida.
              </p>
            </li>
            <li className="rounded-lg border p-4">
              <h3 className="font-semibold">
                Mostrar qué deseos ya tienen voluntarias
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Contexto: usuaria ve la lista → ahora sabe qué deseos están
                asignados antes de decidir.
              </p>
            </li>
          </ul>
        </section>

        {/* Sección 3: Qué estamos explorando */}
        <section>
          <h2 className="mb-2 text-2xl font-bold">¿Qué estamos explorando?</h2>
          <p className="mb-6 text-gray-600">
            Ideas que estamos evaluando. Sin promesas — solo transparencia.
          </p>

          <ul className="space-y-4">
            <li className="rounded-lg border border-dashed border-gray-300 p-4">
              <h3 className="font-semibold">
                Mensaje de agradecimiento al asignarse un deseo
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Que aparezca un texto o gráfico simpático después de asignarte
                un deseo.
              </p>
            </li>
            <li className="rounded-lg border border-dashed border-gray-300 p-4">
              <h3 className="font-semibold">
                Limitar quién puede asignarse un deseo
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Hoy cualquiera con el link puede asignarse. Evaluamos formas de
                restringirlo.
              </p>
            </li>
            <li className="rounded-lg border border-dashed border-gray-300 p-4">
              <h3 className="font-semibold">
                Mostrar nombre en vez de email
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Al ver quién se asignó un deseo, mostrar un nombre en lugar del
                correo electrónico.
              </p>
            </li>
            <li className="rounded-lg border border-dashed border-gray-300 p-4">
              <h3 className="font-semibold">
                Cantidad más clara
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Explicar mejor para qué sirve la cantidad (total necesario, no
                por persona).
              </p>
            </li>
          </ul>
        </section>

        {/* Sección 4: Quieres sumarte */}
        <section className="rounded-lg bg-slate-100 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">¿Quieres sumarte?</h2>
          <p className="mb-4 text-gray-600">
            Esto es un diálogo. Si tienes una idea, crítica o simplemente
            quieres contarnos algo, escríbenos.
          </p>
          <p>
            <a
              href="mailto:tomasbarrios@gmail.com"
              className="inline-block rounded bg-slate-800 px-6 py-3 text-white hover:bg-slate-700"
            >
              Enviar feedback
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
