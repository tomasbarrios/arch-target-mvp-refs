import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";

import { updateWish, getWish } from "~/models/wish.server";
import { validateURLString } from "~/urls";

export async function loader({ request, params }: LoaderArgs) {
  // const userId = await requireUserId(request);
  invariant(params.wishId, "wishId not found");

  const wish = await getWish({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ wish });
}

const validFlags = ["important", "ok2ndHand", "done"];

export async function action({ request }: ActionArgs) {
  // const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const exampleUrls = formData.get("exampleUrls");
  const flaggedAs = validFlags.map(f => {
    return formData.get("flaggedAs_" + f) == "on" ? f : null;
  })
    .filter(f => f !== null);
  const id = formData.get("id");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null, exampleUrls: null, flaggedAs: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required", exampleUrls: null, flaggedAs: null } },
      { status: 400 }
    );
  }

  if (
    typeof exampleUrls !== "string" ||
    (exampleUrls.length > 0 && !validateURLString(exampleUrls))
  ) {
    return json(
      {
        errors: {
          title: null,
          body: null,
          exampleUrls:
            "Links deben válidos y uno por linea. También verifica que comienzan con http o https",
          flaggedAs: null,
          noteId: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof id !== "string" || id.length === 0) {
    console.log("ID", { id });
    return json(
      {
        errors: {
          title: null,
          body: null,
          exampleUrls: null,
          flaggedAs: null,
          id: "id is required",
        },
      },
      { status: 400 }
    );
  }

  flaggedAs.forEach(flag => {
    if (typeof flag !== "string" || flag.length == 0) {
      return json(
        {
          errors: {
            title: null,
            body: null,
            exampleUrls: null,
            flaggedAs: "Opcion no valida para marcar",
            noteId: null,
          },
        },
        { status: 400 }
      );
    }
    // return null
  });


  const wish = await updateWish({
    id,
    title,
    body,
    flaggedAs: flaggedAs.length > 0 ? flaggedAs.join("\n") : null,
    exampleUrls,
    maxQuantity: null
  });

  return redirect(`/wishes/${wish.id}`);
}

export default function NewWishPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const exampleUrlsRef = React.useRef<HTMLTextAreaElement>(null);
  const flaggedAsRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (actionData?.errors?.exampleUrls) {
      exampleUrlsRef.current?.focus();
    } else if (actionData?.errors?.flaggedAs) {
      flaggedAsRef.current?.focus();
    }
  }, [actionData]);

  const separator = "\n"
  const wishFlags = data.wish.flaggedAs?.split(separator) || []

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <input name="id" type="hidden" value={data.wish.id} />

        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>

          <input
            ref={titleRef}
            defaultValue={data.wish.title}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      {/* BODY start */}
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            defaultValue={data.wish.body}
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>
      {/* BODY end */}

      {/* URLs */}
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Links de ejemplo (opcional): </span>
          <textarea
            defaultValue={data.wish.exampleUrls || ""}
            ref={exampleUrlsRef}
            name="exampleUrls"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.exampleUrls ? true : undefined}
            aria-errormessage={
              actionData?.errors?.exampleUrls ? "exampleUrls-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.exampleUrls && (
          <div className="pt-1 text-red-700" id="exampleUrls-error">
            {actionData.errors.exampleUrls}
          </div>
        )}
      </div>
      {/* URLs end */}

      {/* FLAGS */}
      {validFlags && validFlags.map((flagName) => {
        return (
          <div key={flagName} className="flex items-center">
            <h3>Marcar como:</h3>
            <input
              ref={flaggedAsRef}
              id={`flaggedAs_${flagName}`}
              defaultChecked={(wishFlags.some(f => f.startsWith(flagName)))}
              name={`flaggedAs_${flagName}`}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-invalid={actionData?.errors?.flaggedAs ? true : undefined}
              aria-errormessage={
                actionData?.errors?.flaggedAs ? "flaggedAs-error" : undefined
              }
              type="checkbox"
            />
            <label
              htmlFor={`flaggedAs_${flagName}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {flagName}
            </label>
            {actionData?.errors?.flaggedAs && (
              <div className="pt-1 text-red-700" id="flaggedAs-error">
                {actionData.errors.flaggedAs}
              </div>
            )}
          </div>
        );
      })}

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
