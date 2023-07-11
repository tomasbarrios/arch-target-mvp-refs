import type { ActionArgs, LoaderArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
  useLocation, // can delete safely, not using currently
} from "@remix-run/react";
import { useState } from "react";

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
  CheckCircledIcon
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
// import { Confetti } from "~/shared/Confetti";

import { requireUserId, commitSession, getSession } from "~/session.server";
import styles from "~/styles/deseo.css";

import { Confetti, links as confettiLinks } from "~/shared/Confetti";

console.log({ confettiLinks }, "http://localhost:3000/" + confettiLinks);

export const links: LinksFunction = () => {
  return [
    // ...tileGridLinks(),
    // ...productTileLinks(),
    // ...productDetailsLinks(),
    ...confettiLinks(),
    { rel: "stylesheet", href: styles },
  ];
};

// import Text from "../shared/Text";
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
  invariant(params.wishId, "wishId s not found");

  const wish = await getWish({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }

  // USER

  const userId = await requireUserId(request);
  const session = await getSession(request);

  const globalMessage = session.get("globalMessage");
  let additional: {} = {};
  // VERY IMPORTANT, these clears out the flash messages, if any
  // if not changing this, the message wont dessapear when clicking on other wishes
  if (session && globalMessage) {
    additional = {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    };
  }

  //WISH

  const wishWithVolunteers = await getWishAlreadyVolunteered({
    wishId: wish.id,
  });
  const isCurrentUserAVolunteer = await isUserVolunteer({
    wishId: wish.id,
    userId,
  });

  console.log("isCurrentUserAVolunteer", { wishWithVolunteers });
  // console.log("wishHasCurrentUserAsVolunteer", {isUserVolunteer})

  return json(
    {
      wish: {
        ...wish,
        hasWishAlreadyVolunteer: !!wishWithVolunteers,
        isCurrentUserAVolunteer: isCurrentUserAVolunteer,
        volunteers: wishWithVolunteers?.volunteers,
      },
      globalMessage,
    },
    additional
  );
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");
  const userId = await requireUserId(request);

  const session = await getSession(request);
  session.flash("globalMessage", "Eres voluntaria para este deseo! Muuuuuchas gracias ❤️");
  await assignVolunteer({ wishId: params.wishId, userId });

  // OK? then ...

  const redirectToURL = new URL(request.url).pathname;
  const searchParams = new URLSearchParams([["redirectTo", redirectToURL]]);

  const redirectTo =
    searchParams.get("redirectTo") || `/lista/${params.listaId}`;
  console.log("REDIRECTREDIRECTREDIRECT", { redirectTo });
  // console.log("session flash", { msg: session.get("globalMessage") });
  const additionalOpts = {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
  // console.log("headers", { additionalOpts });

  return redirect(redirectTo, additionalOpts);
  // return redirect("/", {
  //   // headers: {
  //   //   "Set-Cookie": await commitSession(session)
  //   // }
  // });
}

const showUsername = (user: any) => {
  const showFirst = (str: string, index: number) => {
    return str.slice(0, index);
  };
  return user.username || showFirst(user.email, 8) + "***";
};

export default function WishDetailsPage() {
  console.log("Rendering WishListPage Wish");
  const data = useLoaderData<typeof loader>();

  const { globalMessage } = data;
  // const user = useUser()
  const location = useLocation();
  const [savedLocation] = useState(location.key);

  return (
    <div>
      {/* THIS WILL NOT SHOW */}
      {location.key === savedLocation && <p>{globalMessage}</p>}

      {/* THIS WILL SHOW */}
      {globalMessage && (
        <Alert className="mb-6">
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Se guardó correctamente</AlertTitle>

          <AlertDescription>
            {globalMessage}
          </AlertDescription>
        </Alert>
      )}
      {globalMessage && <Confetti />}

      <h3 className="text-2xl font-bold">{data.wish.title}</h3>

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
            <details open>
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
              <AlertTitle>Tu Estado: En espiritu</AlertTitle>
              <br />
              <h3>Anotate oficialmente para cumplir este deseo</h3>
              <br />
              <button
                type="submit"
                className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Asignarme como voluntaria para cumplirlo 🧙🏻‍♀️
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
