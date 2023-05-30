import { Form } from "@remix-run/react";

export default function ImprovementsPage() {
    const content = `
    Contexto: Lista de deseos (barra en la izquierda de la pantalla)
    - Mostrar que deseos ya tienen voluntarias
    
    Contexto: Usuaria se asigna como voluntaria
    - Sería lindo que aparezca un mensaje de texto o gráfico tipo: Gracias por asignarte este deseo! Un abrazo de Camila,Tomás y la bebé💖 Algo simpático que lo haga más amigable y cercano

    Contexto: Usuaria ingresa a listas disponibles
    - mensajito breve y amigable de bienvenida. 
    `

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
            Mejoras sugeridas por nuestras usuarias 
        </h1>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main>
        <div>
            <p className="py-6"
            style={{
                whiteSpace: "pre-line"
              }}>
            {content}
            </p>
        </div>
        <p>Quieres sugerir algo?</p>
        <p>
            Escribe a <a href="mailto:tomasbarrios@gmail.com">tomasbarrios@gmail.com</a>
            </p>
        
         

      </main>
    </div>
  );
}
