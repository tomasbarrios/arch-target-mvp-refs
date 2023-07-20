import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, 
  useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import type { User } from "~/models/user.server";

import { getOrganization } from "~/models/organization.server";
import { getAllWishListsForUser } from "~/models/note.server";
import { getUserById } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  const organization = await getOrganization({ userId });

  if (!user?.latestKnownUrls) {
    // XXX: Verify that is allowed to see this list
    console.log("WHAT", { params });
    return json({
      wishLists: [],
      organization,
      user,
    });
  } else {
    // redirect("listas")
    // throw new Error(`NO CAN DO${Object.entries(user)}`,)
    // todo, this will fuck up current users, no URL yet they have.
    // THis can totally happen to "good"" users
  }

  const wishLists = await getAllWishListsForUser(user);

  // const host =
  //   request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  return json({
    wishLists: (wishLists || []).map((w) => ({ ...w, url: `/lista/${w.id}` })),
    organization,
    user,
  });
}

type Message = {
  text: string;
  action: string;
};

const checkUsername = function (user: User, messagesState: Message[]) {
  if (user.username === null) {
    messagesState.push({
      text: "No has guardado tu nombre aún!",
      action: "/me",
    });
  }
};
// console.log({ user })
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

  const messages: Message[] = [];
  const user = useUser();

  checkUsername(user, messages);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          Lista
          {/* <Link to="/lista">Ir a la lista de deseos de</Link> */}
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
      {messages && messages.length > 0 && (
        <ul className="my-1 bg-green-800 text-white">
          {messages.map((m) => (
            <li key={m.text}>
              <span>{m.text}</span>{" "}
              <a href={m.action}>Entra aqui para definirlo</a>
            </li>
          ))}
        </ul>
      )}
      {/* MESSAGES end */}

      <main>
        <div>
          <p>
            Selecciona la lista para ver los deseos que puedes ayudar a cumplir{" "}
          </p>

          <hr />

          {data.wishLists.length === 0 ? (
            <div>
              <p className="p-4">No hay listas aún</p>
              <p>
                Si crees que esto es un error, solicita el enlace de la lista
                nuevamente.
              </p>
            </div>
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
        
      </main>

    </div>
  );
}
