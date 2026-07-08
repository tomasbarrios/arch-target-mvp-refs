import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getWishListAsNote } from "~/models/note.server";

import Text from "../shared/Text";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.listaId, "listaId not found");

  const wishList = await getWishListAsNote({ id: params.listaId });

  return json({ wishList, listaId: params.listaId });
}

export default function WishListPage() {
  console.log("Rendering WishListPage With Id");
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.wishList.title}</h3>

      {/* FIXME: Org should bot be optional */}
      <Text>{data.wishList.body}</Text>
      <hr className="my-4" />

      <div>
        <Link
          to={`/wishes/new`}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Agregar deseo a esta lista
        </Link>
      </div>
      <br />

      {/**
       * If not fulfilled yet, offer to fulfill
       */}
      <footer className={"text-center"}>
        <br />
        <br />
        <br />
        Sugerencias? Mira algunas <a href="/mejoras">mejoras propuestas</a> por
        nuestras usuarias
        <br />
      </footer>
      <br />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
