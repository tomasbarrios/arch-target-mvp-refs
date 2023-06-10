import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getWish, getWishAlreadyVolunteered, isUserVolunteer, assignVolunteer } from "~/models/wish.server";
// import { getUsers } from "~/models/user.server";
import { requireUserId } from "~/session.server";

import Text from "../shared/Text"

export async function loader({ request, params }: LoaderArgs) {
  console.log("DESEO DESEO DESEO")
  console.log("DESEO DESEO DESEO")
  console.log("DESEO DESEO DESEO")
  invariant(params.wishId, "wishId not found");

  const wish = await getWish({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }
  const userId = await requireUserId(request);

  const wishThatHasVolunteer = await getWishAlreadyVolunteered({wishId: wish.id})
  const isCurrentUserAVolunteer = await isUserVolunteer({wishId: wish.id, userId })

  // console.log("isCurrentUserAVolunteer", {wishThatHasVolunteer})
  // console.log("wishHasCurrentUserAsVolunteer", {isUserVolunteer})

  return json({ 
    wish: (
      { 
        ...wish, 
        hasWishAlreadyVolunteer: !!wishThatHasVolunteer,
        isCurrentUserAVolunteer: isCurrentUserAVolunteer,
        volunteers: wishThatHasVolunteer?.volunteers
      }
    ) 
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");
  const userId = await requireUserId(request);

  await assignVolunteer({ wishId: params.wishId, userId });

  return redirect("");
}

export default function WishDetailsPage() {
  const data = useLoaderData<typeof loader>();

  
  return (
    <div>
      <h3 className="text-2xl font-bold">{data.wish.title}</h3>
      <Text className="py-6">{data.wish.body}
      </Text>
      <hr className="my-4" />
       
      <br /><br />
      <div>

      {data.wish.hasWishAlreadyVolunteer && data.wish.volunteers &&
          <> 
          <p></p>
          <details>
            <summary>Ya tiene voluntarias ({data.wish.volunteers.length})! Ver la lista</summary>
            <ul>
              {data.wish.volunteers?.map(v => 
                (<li>{v.user.email}, {v.assignedAt}</li>)
              )}
            </ul>
          </details>
          </>
        }

        {!data.wish.isCurrentUserAVolunteer &&
          <Form method="post">
                  <hr className="my-4" />

            <p>Anotate oficialmente para cumplir este deseo</p>
        <br />
        
              <button
                type="submit"
                className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Asignarme para cumplirlo
            </button>
            (Se mostrará tu nombre en la lista)
          </Form>
        }
        
        {data.wish.isCurrentUserAVolunteer &&
          <Form method="post">
              <br />
              <p> <b>Eres voluntaria</b> para cumplir este deseo. Muchas gracias</p>
              <br />
              <hr />
              <br />
              <button
                type="submit"
                className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Ya NO QUIERO ser voluntaria
            </button>
            (Se quitará tu nombre la lista)
          </Form>
        }   
      
      </div>


      {!data.wish.noteId &&
        <Form method="post">
          <span>Add it to a Wishlist </span>
          <option value=""></option>
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Send as link
          </button>
        </Form>
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
    return <div>Wish not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
