import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
// FIXME
// No deberíamos estar consultando wish.server ... (?)
// Investigar si esto es efectivamente renderizado o no se usa realmente
import { deleteWish, getWishListItems } from "~/models/wish.server";
import { getWishListAsNote } from "~/models/note.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.listaId, "listaId not found");

  const wishListItems = await getWishListItems({ noteId: params.listaId });
  if (!wishListItems) {
    console.log(`Note does not appear to have associated wishes ${params.listaId}`)
    throw new Response("Not Found", { status: 404 });
  }

  const wishList = await getWishListAsNote({ id: params.listaId });

  

  return json({ wishList, wishListItems });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.listaId, "listaId not found");

  await deleteWish({ id: params.listaId });

  return redirect("/wishes");
}



export default function WishDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.wishList.title}</h3>

      <p>
          {/* FIXME: Org should bot be optional */}
          {data.wishList.body}
          </p>

      <hr className="my-4" />


    <div>Selecciona un deseo de la lista</div>
      
      {
        /**
         * If not fulfilled yet, offer to fulfill
         */
      }
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Selecciona un deseo de la lista</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
