import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteWish, getWishWithNote } from "~/models/wish.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.wishId, "wishId not found");

  const wish = await getWishWithNote({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  console.log();
  return json({
    wish,
    url: wish.noteId ? `${host}/lista/${wish.noteId}` : "undefined",
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");

  await deleteWish({ id: params.wishId });

  return redirect("/wishes");
}

export default function WishDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div>
        <h3 className="text-2xl font-bold">{data.wish.title}</h3>
        <p className="py-6">{data.wish.body}</p>
        <hr className="my-4" />
      </div>

      {data.url && (
        <div>
          <p>Comparte este deseo con tus amigxs usando el siguiente link</p>
          <br />

          <p>{data.url}</p>
        </div>
      )}

      <div>
        <hr className="my-4" />

        <Form method="post">
          <button
            type="submit"
            className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>
        <Link to="edit">Editar</Link>
      </div>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Wish not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
