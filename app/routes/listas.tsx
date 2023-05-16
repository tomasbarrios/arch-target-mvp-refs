import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
// import { useUser } from "~/utils";
import { getOrganization } from "~/models/organization.server";
import { getWishListItems } from "~/models/la-lista-pa.server";
import { getAllWishLists, getNote } from "~/models/note.server";

export async function loader({ request, params }: LoaderArgs) {
    
    
    const userId = await requireUserId(request);
    const organization = await getOrganization({userId});

    const wishLists = await getAllWishLists();

    // console.log({organization})
    const host =
        request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
    return json({ 
        wishLists: wishLists.map(w => ({ ...w, url: `/lista/${w.id}`})), 
        organization
    });
}

export default function AllWishListsPage() {
  const data = useLoaderData<typeof loader>();

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
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main>
        <div>
          <p>Selecciona la lista para ver los deseos que puedes ayudar a cumplir </p>

          <hr />

          {data.wishLists.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.wishLists.map((wl) => (
                <li key={wl.id}>
                  <a
                    href={wl.url}
                  >
                    📝 {wl.title}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>

      </main>
    </div>
  );
}
