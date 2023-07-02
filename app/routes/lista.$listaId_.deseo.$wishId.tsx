import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  getWish,
  getWishAlreadyVolunteered,
  isUserVolunteer,
  assignVolunteer,
} from "~/models/wish.server";
// import {showDate} from "@/lib/date"
// import { getUsers } from "~/models/user.server";
import {
  RocketIcon,
  ExclamationTriangleIcon,
  CircleIcon,
} from "@radix-ui/react-icons";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

import { Alert, AlertDescription, AlertTitle } from "~/ui/alert";

import { requireUserId } from "~/session.server";

import Text from "../shared/Text";
// import { Alert } from "@/components/ui/alert";

// default: short

function showDate(date: Date) {
  // https://stackoverflow.com/questions/66590691/typescript-type-string-is-not-assignable-to-type-numeric-2-digit-in-d

  let options = {
    // weekday: "long",
    // year: "numeric", // not addingthis will result in
    // month: "long",
    // day: "numeric",
    timeZone: "America/Santiago",
    // timeZoneName: "short",
  };
  // let options2 = {};
  // const defaultOptions = {
  //   ...options,
  //   ...options2,
  // };
  const dateFormat = new Intl.DateTimeFormat(undefined, options);
  const usedOptions = dateFormat.resolvedOptions();

  // console.log({ calendar: usedOptions.calendar });
  // // "chinese"

  // console.log({ numberingSystem: usedOptions.numberingSystem });
  // // "arab"

  console.log({ timeZone: usedOptions.timeZone });

  return dateFormat.format(date);
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.wishId, "wishId not found");

  const wish = await getWish({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }
  const userId = await requireUserId(request);

  const wishWithVolunteers = await getWishAlreadyVolunteered({
    wishId: wish.id,
  });
  const isCurrentUserAVolunteer = await isUserVolunteer({
    wishId: wish.id,
    userId,
  });

  console.log("isCurrentUserAVolunteer", { wishWithVolunteers });
  // console.log("wishHasCurrentUserAsVolunteer", {isUserVolunteer})

  return json({
    wish: {
      ...wish,
      hasWishAlreadyVolunteer: !!wishWithVolunteers,
      isCurrentUserAVolunteer: isCurrentUserAVolunteer,
      volunteers: wishWithVolunteers?.volunteers,
    },
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");
  const userId = await requireUserId(request);

  await assignVolunteer({ wishId: params.wishId, userId });

  return redirect("");
}

const showUsername = (user: any) => {
  const showFirst = (str: string, index: number) => {
    return str.slice(0,index)
  }
  return user.username || showFirst(user.email, 8) + "***"
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
                <li key={url}>
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
        {data.wish.hasWishAlreadyVolunteer && data.wish.volunteers ? (
          <>
            <details>
              <summary>
                Este deseo ya tiene ({data.wish.volunteers.length})
                voluntaria(s). 🧙🏻‍♀️ Haz click para ver quienes son
              </summary>
              <br />
              <h2>Lista de voluntarias</h2>
              <ol className="list-inside list-decimal">
                {data.wish.volunteers?.map((v, i) => (
                  <li key={v.user.id}>
                    {showUsername(v.user)}
                    <i> --- {showDate(new Date(v.assignedAt))}</i>
                  </li>
                ))}
              </ol>
            </details>
            <br />
          </>
        ) : (
          <>
            <p>Este deseo aún no tiene voluntaria(s). Se tu la primera</p>
            <br />
          </>
        )}

        {data.wish.isCurrentUserAVolunteer ? (
          <Form method="post">
            {/* variant="default" */}

            <Alert>
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Tu Estado: Voluntaria</AlertTitle>

              <AlertDescription>
                <br />

                <p>
                  {" "}
                  Actualmente{" "}
                  <b>
                    <u>ya eres</u> voluntaria
                  </b>{" "}
                  para cumplir este deseo. Muchas gracias!
                </p>

                <br />
                <details>
                  <summary>Haz click aqui para cambiar tu estado</summary>

                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />

                    <AlertTitle>Salir de lista de Voluntarias</AlertTitle>

                    <AlertDescription>
                      <p>
                        (Se quitará tu nombre la lista)
                        <button
                          type="submit"
                          className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                        >
                          Ya NO QUIERO ser voluntaria
                        </button>{" "}
                      </p>
                    </AlertDescription>
                  </Alert>
                </details>
              </AlertDescription>
            </Alert>
          </Form>
        ) : (
          <Form method="post">
            <Alert>
              <CircleIcon className="h-4 w-4" />
              <AlertTitle>Tu Estado: NO Voluntaria</AlertTitle>
              <br />
              <h3>Anotate oficialmente para cumplir este deseo</h3>
              <br />
              <button
                type="submit"
                className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Asignarme para cumplirlo
              </button>{" "}
              (Se mostrará tu nombre en la lista)
            </Alert>
          </Form>
        )}
      </div>
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
