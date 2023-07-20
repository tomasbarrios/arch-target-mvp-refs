import type { ActionArgs, LoaderArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
  useLocation,
  useActionData, // can delete safely, not using currently
} from "@remix-run/react";
import { useState, useRef, useEffect } from "react";

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
  ExclamationTriangleIcon,
  CircleIcon,
  CheckCircledIcon,
  HeartFilledIcon,
  PersonIcon,
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
import Text from "../shared/Text";

import styles from "~/styles/deseo.css";

import { Confetti, links as confettiLinks } from "~/shared/Confetti";
import Button from "~/shared/Button";

// console.log({ confettiLinks }, "http://localhost:3000/" + confettiLinks);

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

  let currentUserWishVolunteeringInfo = null;
  if (isCurrentUserAVolunteer) {
    currentUserWishVolunteeringInfo = wishWithVolunteers?.volunteers.find(
      (v) => v.userId === userId
    );
  }

  console.log("isCurrentUserAVolunteer", { wishWithVolunteers });
  // console.log("wishHasCurrentUserAsVolunteer", {isUserVolunteer})

  return json(
    {
      wish: {
        ...wish,
        hasWishAlreadyVolunteer: !!wishWithVolunteers,
        isCurrentUserAVolunteer: isCurrentUserAVolunteer,
        volunteers: wishWithVolunteers?.volunteers,
        currentUserWishVolunteeringInfo,
      },
      globalMessage,
    },
    additional
  );
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.wishId, "wishId not found");

  const formData = await request.formData();
  const quantity = formData.get("quantity");

  if (typeof quantity !== "string" || quantity.length === 0) {
    return json(
      {
        errors: {
          quantity: "Cantidad debe ser válida",
        },
      },
      { status: 400 }
    );
  } else if (Number(quantity) <= 0) {
    return json(
      {
        errors: {
          quantity: "Cantidad debe ser mayor que 0",
        },
      },
      { status: 400 }
    );
  }

  const userId = await requireUserId(request);

  await assignVolunteer({
    wishId: params.wishId,
    userId,
    quantity,
  });

  const session = await getSession(request);
  session.flash(
    "globalMessage",
    "Gracias por sumarte para que este deseo sea una realidad ❤️"
  );
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
  return redirect(redirectTo, additionalOpts);
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

  const actionData = useActionData<typeof action>();
  const quantityRef = useRef<HTMLInputElement>(null);

  const validFlags = {
    important: "important",
    done: "done",
  };
  const separator = "\n";
  const wishFlags = data.wish.flaggedAs?.split(separator);

  const { globalMessage } = data;
  // const user = useUser()
  const location = useLocation();
  const [savedLocation] = useState(location.key);

  const sumFn = (accumulator: any, currentObject: any) =>
    accumulator + currentObject.quantity;

  console.log("TYPE", data.wish.volunteers);
  const compromisedQuotaByVolunteers = (data.wish?.volunteers || []).reduce(
    sumFn,
    0
  );
  const pendingQuota =
    data.wish.volunteers !== undefined && data.wish.volunteers.length >= 1
      ? (Number(data.wish.maxQuantity) || 1) - compromisedQuotaByVolunteers
      : undefined;

  console.log("pendingQuota", {
    pendingQuota,
    numberMax: Number(data.wish.maxQuantity),
    compromisedQuotaByVolunteers,
  });
  useEffect(() => {
    if (actionData?.errors?.quantity) {
      quantityRef.current?.focus();
    }
  }, [actionData]);

  console.log({ wwww: data.wish, pendingQuota });
  const shouldShowQuantityDisclaimer =
    data.wish.maxQuantity && data.wish.maxQuantity > 1;

  const QuantityBanner = (
    <>
      <br />
      <Alert className="mb-6">
        <span className="flex">
          <PersonIcon className="h-4 w-4" />
          <PersonIcon className="h-4 w-4" />
          <PersonIcon className="h-4 w-4" />
        </span>
        {/* <PersonIcon className="h-4 w-4" /> */}
        <AlertTitle>
          <div className="flex">Deseo colaborativo</div>
        </AlertTitle>

        <AlertDescription>
          <p>
            Este deseo tiene como meta {data.wish.maxQuantity}{" "}
            <i>"{data.wish.title}". </i>
          </p>
          <p>Puedes ser voluntaria junto con otras personas.</p>
          <p>
            <b>La cantidad la defines tu ;)</b>
          </p>
        </AlertDescription>
      </Alert>
    </>
  );

  return (
    <div>
      {/* THIS WILL NOT SHOW */}
      {location.key === savedLocation && <p>{globalMessage}</p>}

      {/* THIS WILL SHOW */}
      {globalMessage && (
        <Alert variant="success" className="mb-6">
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Perfecto! Quedaste registrada como voluntaria</AlertTitle>

          <AlertDescription>{globalMessage}</AlertDescription>
        </Alert>
      )}
      {/* TODO
        globalMessage could be anything, must have a better condition
        It will fail if globalMessage exists for another reason
      */}
      {globalMessage && <Confetti />}

      <h3 className="text-2xl font-bold">{data.wish.title}</h3>

      <Text className="py-3">{data.wish.body}</Text>

      {shouldShowQuantityDisclaimer && (
        <div>
          <p>
            <b>Cantidad total</b> (meta): {data.wish.maxQuantity}{" "}
          </p>
          <br />
        </div>
      )}

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

      {wishFlags?.some((wf) => wf.startsWith(validFlags.important)) && (
        <div>
          <b>🔝 Proridad Top</b>: Deseo prioritario
        </div>
      )}

      {shouldShowQuantityDisclaimer && (
        <div>{shouldShowQuantityDisclaimer}</div>
      )}
      {shouldShowQuantityDisclaimer && QuantityBanner}
      <hr className="my-4" />
      {wishFlags?.some((wf) => wf.startsWith(validFlags.done)) && (
        <div>
          <b>✅ Deseo cumplido</b>: La meta se alcanzó! 🎊🥳
          <br />
          <br />
        </div>
      )}

      <div>
        {/* Lista de voluntarios */}
        {data.wish.hasWishAlreadyVolunteer && data.wish.volunteers ? (
          <>
            <details>
              <summary>
                Este deseo tiene {data.wish.volunteers.length} voluntaria(s). 🧙🏻‍♀️
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
              <HeartFilledIcon className="h-4 w-4" />
              <AlertTitle>Tu Estado: Voluntaria</AlertTitle>

              <AlertDescription>
                <br />

                <p>
                  {" "}
                  Actualmente <b>eres voluntaria</b> para cumplir este deseo.
                </p>
                <p>
                  Estas anotada con{" "}
                  <b>
                    {data.wish.currentUserWishVolunteeringInfo?.quantity}{" "}
                    unidad(es)
                  </b>
                  .
                </p>
                <br />

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
              <AlertTitle>Anotate como voluntaria</AlertTitle>
              <AlertDescription>
                <br />
                <details>
                  <summary>
                    <span>Define la cantidad y confirma</span>
                  </summary>
                  <br />
                  <hr />
                  <br />

                  <br />
                  <label className="flex w-full flex-col gap-1">
                    <span>Cantidad</span>
                    <input
                      ref={quantityRef}
                      name="quantity"
                      type="number"
                      defaultValue={1}
                      className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                      aria-invalid={
                        actionData?.errors?.quantity ? true : undefined
                      }
                      aria-errormessage={
                        actionData?.errors?.quantity
                          ? "noteId-error"
                          : undefined
                      }
                    />
                  </label>
                  {actionData?.errors?.quantity && (
                    <div className="pt-1 text-red-700" id="quantity-error">
                      {actionData.errors.quantity}
                    </div>
                  )}

                  <br />
                  {pendingQuota && pendingQuota > 0 && (
                    <p>
                    Aun faltan {pendingQuota} para el objetivo total
                  </p>
                  )}
                  <br />

                  <Button
                    type="submit"
                    className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                  >
                    Confirmar como voluntaria 🧙🏻‍♀️
                  </Button>
                </details>
              </AlertDescription>
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
