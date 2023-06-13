import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  getWish,
  getWishAlreadyVolunteered,
  isUserVolunteer,
  assignVolunteer,
} from "~/models/wish.server";
// import { getUsers } from "~/models/user.server";
import { requireUserId } from "~/session.server";

import Text from "../shared/Text";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.wishId, "wishId not found");

  const wish = await getWish({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }
  const userId = await requireUserId(request);

  const wishThatHasVolunteer = await getWishAlreadyVolunteered({
    wishId: wish.id,
  });
  const isCurrentUserAVolunteer = await isUserVolunteer({
    wishId: wish.id,
    userId,
  });

  console.log("isCurrentUserAVolunteer", { wishThatHasVolunteer });
  // console.log("wishHasCurrentUserAsVolunteer", {isUserVolunteer})

  return json({
    wish: {
      ...wish,
      hasWishAlreadyVolunteer: !!wishThatHasVolunteer,
      isCurrentUserAVolunteer: isCurrentUserAVolunteer,
      volunteers: wishThatHasVolunteer?.volunteers,
    },
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");
  const userId = await requireUserId(request);

  await assignVolunteer({ wishId: params.wishId, userId });

  return redirect("");
}

export default function WishDetailsPage() {
  console.log("Rendering WishListPage Wish");
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.wish.title}</h3>

      <Text className="py-3">{data.wish.body}</Text>

      {data.wish.exampleUrls && (
        <div>
          <h4>Links de ejemplo</h4>
          <ul className="ml-4 list-disc">
            {data.wish.exampleUrls.split("\n").map((url) => {
              return (
                <li>
                  <a href={url}>{url}</a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <hr className="my-4" />

      <div>
        {/* Lista de voluntarios */}
        {data.wish.hasWishAlreadyVolunteer && data.wish.volunteers && (
          <>
            <details>
              <summary>
                Este deseo ya tiene ({data.wish.volunteers.length})
                voluntaria(s). 🧙🏻‍♀️ Haz click para ver quienes son
              </summary>
              <br />
              <h3>Lista de voluntarias</h3>
              <ol className="list-inside list-decimal">
                {data.wish.volunteers?.map((v, i) => (
                  <li>
                    {v.user.email}, el pasado {v.assignedAt}
                  </li>
                ))}
              </ol>
            </details>
            <br />
          </>
        )}

        {data.wish.isCurrentUserAVolunteer ? (
          <Form method="post">
            <p>
              {" "}
              <b>Eres voluntaria</b> para cumplir este deseo. Muchas gracias
            </p>
            <br />
            <p>
              <button
                type="submit"
                className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Ya NO QUIERO ser voluntaria
              </button>{" "}
              (Se quitará tu nombre la lista)
            </p>
          </Form>
        ) : (
          <Form method="post">
            <p>Anotate oficialmente para cumplir este deseo</p>
            <br />
            <button
              type="submit"
              className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Asignarme para cumplirlo
            </button>{" "}
            (Se mostrará tu nombre en la lista)
          </Form>
        )}
      </div>
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
    return <div>Wish not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
