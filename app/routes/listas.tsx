import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
// import { useUser } from "~/utils";
import { getOrganization } from "~/models/organization.server";
import { getAllWishLists } from "~/models/note.server";
import { getUserById } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const userInfo = await getUserById(userId);
  const organization = await getOrganization({ userId });

  const wishLists = await getAllWishLists();

  console.log({userInfo})

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  return json({
    wishLists: wishLists.map((w) => ({ ...w, url: `/lista/${w.id}` })),
    organization,
    userInfo
  });
}

type Message = {
  text: string,
  action: string,
}

// const addMessage = ({message, action}: Message) => {
//   return (
//     <p className="bg-green">
//       <span>{message}</span>
//       <a href={action}>Entra aqui para definirlo</a>
//     </p>
//   )
// }
export default function AllWishListsPage() {
  const data = useLoaderData<typeof loader>();

  const messages: Message[] = []

  if(data.userInfo?.username === null) {
    messages.push({text: "No has guardado tu nombre aún!", action: "/me"})
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          Lista
          {/* <Link to="/lista">Ir a la lista de deseos de {data.organization[0].id}</Link> */}
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

        {/* MESSAGES */}
        {messages && messages.length > 0 &&
          <ul  className="bg-green-800 text-white my-1">
            {messages.map(m =>
              (<li>
                <span>{m.text}</span> <a href={m.action}>Entra aqui para definirlo</a>
              </li>)
            )}
          </ul>
        }
        {/* MESSAGES end */}

      <main>
        <div>
          <p>
            Selecciona la lista para ver los deseos que puedes ayudar a cumplir{" "}
          </p>

          <hr />

          {data.wishLists.length === 0 ? (
            <p className="p-4">No hay listas aún</p>
          ) : (
            <ol>
              {data.wishLists.map((wl) => (
                <li key={wl.id}>
                  <a href={wl.url}>📝 {wl.title}</a>
                </li>
              ))}
            </ol>
          )}
        </div>
        <hr />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Link to="/mejoras">
          Sugerencias? Mira algunas mejoras propuestas por nuestras usuarias
        </Link>
      </main>
    </div>
  );
}
