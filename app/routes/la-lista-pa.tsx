import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
// import { useUser } from "~/utils";
import { getOrganization } from "~/models/organization.server";
import { getWishListItems } from "~/models/la-lista-pa.server";

export async function loader({ request, params }: LoaderArgs) {
    
    
    const userId = await requireUserId(request);
    const organization = await getOrganization({userId});
    
    console.log("WHAY", {params})
    // const noteId = await requireNoteId(request);
    // console.log("WHAY2", {noteId})

    // params.wishId is really a noteId
    // then, we get all wishes for that note
    if (!params.wishId) throw new Error("No id provided")
    
    const wishListItems = await getWishListItems({ noteId: params.wishId });

    console.log({organization})
    return json({ wishListItems, organization });
}

export default function WishesPage() {
  const data = useLoaderData<typeof loader>();
  // const user = useUser()

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Wishes</Link>
        </h1>
        <p>
          {/* FIXME: Org should bot be optional */}
          Lista de: {data.wishListItems[0].noteId}
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
                    to={wish.id}
                  >
                    📝 {wish.title}
                    
                  </NavLink>
                  
                  {/* If we have a related note, this would show it */}
                  {/* <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={`/notes/${wish.noteId}`}
                  >
                  ⨾ {wish.noteId}
                    
                  </NavLink> */}
                  
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
