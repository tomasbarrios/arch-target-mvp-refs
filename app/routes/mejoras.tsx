import { Form } from "@remix-run/react";
import Text from "../shared/Text";

export default function ImprovementsPage() {
  const suggestionsDone = [
    {
      context:
        "Contexto: Lista de deseos (barra en la izquierda de la pantalla)",
      doneChanges: ["✅ Mostrar que deseos ya tienen voluntarias"],
    },
    {
      context: "Contexto: Usuaria ingresa a listas disponibles",
      doneChanges: ["✅ mensajito breve y amigable de bienvenida"],
    },
  ];

  const suggestionsToReview = `
    Contexto: Usuaria acepta ser voluntaria
    - Sería lindo que aparezca un mensaje de texto o gráfico tipo: Gracias por asignarte este deseo! Un abrazo de Camila,Tomás y la bebé💖 Algo simpático que lo haga más amigable y cercano

    Contexto: En la lista 
    - Desafio/Reto: Debería ser limitado quien accede a cumplir un deseo, hoy esta abierto a cualquier persona

    Contexto: En la lista, cuando estoy viendo un deseo, y se muestra el email de la persona que se asigno como voluntaria
    - Propuesta: Sería mejor que se vea un nombre en vez del email
    `;

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          Mejoras sugeridas por nuestras usuarias
        </h1>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main>
        <div>
          <h2>Historial de mejoras y sugerencias realizadas</h2>

          <ul>
            {suggestionsDone.map((item) => {
              return (
                <li>
                  <br />

                  <h3>{item.context}</h3>
                  {item.doneChanges.map((change, i) => (
                    <p>{change}</p>
                  ))}
                  <br />

                  <hr />
                </li>
              );
            })}
          </ul>
        </div>

        <br />
        <br />
        <br />
        <div>
          <h2>Sugerencias de usuarias (pendientes por evaluar)</h2>

          <Text>{suggestionsToReview}</Text>
        </div>
        <br />

        <p>Quieres sugerir algo?</p>
        <p>
          Escribe a{" "}
          <a href="mailto:tomasbarrios@gmail.com">tomasbarrios@gmail.com</a>
        </p>
      </main>
    </div>
  );
}
