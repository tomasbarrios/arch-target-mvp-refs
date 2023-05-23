import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
// import { useUser } from "~/utils";
import { getOrganization } from "~/models/organization.server";
import { getWishListItems } from "~/models/la-lista-pa.server";
import { getWishListAsNote } from "~/models/note.server";

export async function loader({ request, params }: LoaderArgs) {
    
    
    const userId = await requireUserId(request);
    const organization = await getOrganization({userId});
    
    if (!params.listaId) throw new Error("No listId provided")
    
    const wishListItems = await getWishListItems({ noteId: params.listaId });
    const note = await getWishListAsNote({ id: params.listaId });

    console.log({organization, list: "hey", list2: wishListItems, note})
    return json({ 
      wishListItems: wishListItems.map(w => (
        {
          ...w,
          url: `/lista/${params.listaId}/deseo/${w.id}`
        }
      )), 
      note,
      organization
    });
}

export default function WishesPage() {
  const data = useLoaderData<typeof loader>();
  // const user = useUser()

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Lista </Link>
        </h1>
        <p>
          {/* FIXME: Org should bot be optional */}
          Lista de deseos para "{data.note.title}"
          </p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">

          {data.wishListItems.length === 0 ? (
            <p className="p-4">No wishs yet</p>
          ) : (
            <ol>
              {data.wishListItems.map((wish) => (
                <li key={wish.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={wish.url}
                  >
                    📝 {wish.title}
                    
                  </NavLink>
                  
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
