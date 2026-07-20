import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteWish, getWishWithNote } from "~/models/wish.server";
import Button from "~/shared/Button";
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
    path: wish.noteId ? `/lista/${wish.noteId}` : "undefined",
    url: host 
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");

  await deleteWish({ id: params.wishId });
  

  return redirect("/wishes");
}

export default function WishDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const linkImages: Record<string, string> = data.wish.linkImages
    ? JSON.parse(data.wish.linkImages)
    : {};

  return (
    <>
      <div>
        <h3 className="text-2xl font-bold">{data.wish.title}</h3>

        {data.wish.hidden && (
          <p className="text-sm font-semibold text-gray-500">
            🙈 Oculto de la lista pública
          </p>
        )}

        <p className="py-6">{data.wish.body}</p>

        {data.wish.exampleUrls && (
          <div>
            <h4>Links de ejemplo</h4>
            <ul className="ml-4 list-disc">
              {data.wish.exampleUrls.split("\n").map((url) => {
                const image = linkImages[url];
                return (
                  <li key={url} className="flex items-center gap-2">
                    {image && (
                      <img
                        src={image}
                        alt=""
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <a href={url}>{url}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <hr className="my-4" />
      </div>

      {data.url && (
        <div>
          <p>Comparte esta lista de deseos usando el siguiente link</p>
          <br />

          <p>
            <a href={data.path}>{data.url+data.path}</a>
          </p>
        </div>
      )}

      <div>
        <hr className="my-4" />

        <Form method="post" className="flex">
          <div className="mr-1 ">
            <Button>
              <Link to="edit">Editar</Link>
            </Button>
          </div>
          <div className="flex-grow text-right">
            <Button
              type="submit"
              confirmPrompt={"Seguro deseas borrar este deseo?"}
            >
              Borrar
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
