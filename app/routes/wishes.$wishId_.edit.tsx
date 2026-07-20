import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";

import { Combobox } from "~/components/ui/combobox";
import { updateWish, getWish } from "~/models/wish.server";
import { getDefaultNotesForWish } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { validateURLString } from "~/urls";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.wishId, "wishId not found");

  const userId = await requireUserId(request);
  const wish = await getWish({ id: params.wishId });
  if (!wish) {
    throw new Response("Not Found", { status: 404 });
  }
  const defaultNotes = await getDefaultNotesForWish({ userId });
  return json({ wish, defaultNotes });
}

const validFlags = ["important", "ok2ndHand"];
const flagLabels: Record<string, string> = {
  important: "¿Es importante?",
  ok2ndHand: "¿Aceptas segunda mano?",
};

export async function action({ request }: ActionArgs) {
  // const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const maxQuantity = formData.get("maxQuantity");
  const exampleUrls = formData.get("exampleUrls");
  const hidden = formData.get("hidden") === "on";
  const flexibility = formData.get("flexibility");
  const flaggedAs = validFlags
    .map((f) => {
      return formData.get("flaggedAs_" + f) == "on" ? f : null;
    })
    .filter((f) => f !== null);
  if (formData.get("flaggedAs_done") === "on") flaggedAs.push("done");
  const id = formData.get("id");
  const noteId = formData.get("noteId");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      {
        errors: {
          title: "Title is required",
          body: null,
          maxQuantity: null,
          exampleUrls: null,
          flaggedAs: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      {
        errors: {
          title: null,
          body: "Body is required",
          maxQuantity: null,
          exampleUrls: null,
          flaggedAs: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof maxQuantity !== "string" || maxQuantity.length === 0) {
    return json(
      {
        errors: {
          title: null,
          body: null,
          maxQuantity: "Cantidad debe ser válida",
          exampleUrls: null,
          flaggedAs: null,
        },
      },
      { status: 400 }
    );
  } else if (Number(maxQuantity) <= 0) {
    return json(
      {
        errors: {
          title: null,
          body: null,
          maxQuantity: "Cantidad debe ser mayor que 0",
          exampleUrls: null,
          flaggedAs: null,
        },
      },
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
          maxQuantity: null,
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
          maxQuantity: null,
          exampleUrls: null,
          flaggedAs: null,
          id: "id is required",
        },
      },
      { status: 400 }
    );
  }

  flaggedAs.forEach((flag) => {
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
    maxQuantity: Number(maxQuantity),
    noteId: typeof noteId === "string" && noteId.length > 0 ? noteId : null,
    hidden,
    flexibility: typeof flexibility === "string" ? flexibility : null,
  });

  return redirect(`/wishes/${wish.id}`);
}

export default function NewWishPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const maxQuantityRef = React.useRef<HTMLTextAreaElement>(null);
  const exampleUrlsRef = React.useRef<HTMLTextAreaElement>(null);
  const flaggedAsRef = React.useRef<HTMLInputElement>(null);

  const [selectedNoteId, setSelectedNoteId] = React.useState(
    data.wish.noteId || ""
  );

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (actionData?.errors?.maxQuantity) {
      maxQuantityRef.current?.focus();
    } else if (actionData?.errors?.exampleUrls) {
      exampleUrlsRef.current?.focus();
    } else if (actionData?.errors?.flaggedAs) {
      flaggedAsRef.current?.focus();
    }
  }, [actionData]);

  const separator = "\n";
  const wishFlags = data.wish.flaggedAs?.split(separator) || [];

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
          <span>Nombre: </span>

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

      <div className="flex items-center gap-2">
        <input
          id="flaggedAs_done"
          name="flaggedAs_done"
          type="checkbox"
          defaultChecked={wishFlags.some((f) => f.startsWith("done"))}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="flaggedAs_done" className="text-sm text-gray-900">
          Marcar como cumplido
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="hidden"
          name="hidden"
          type="checkbox"
          defaultChecked={data.wish.hidden}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="hidden" className="text-sm text-gray-900">
          Ocultar de la lista pública
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Indicador de flexibilidad (opcional):</span>
          <select
            name="flexibility"
            defaultValue={data.wish.flexibility ?? ""}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          >
            <option value="">Sin indicador</option>
            <option value="exact">Quiero exactamente este</option>
            <option value="similar">Algo como esto — la marca da lo mismo</option>
          </select>
        </label>
      </div>

      {/* BODY start */}
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Descripción o detalles: </span>
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

      {/* QUANTITY */}
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Cantidad: </span>

          <input
            ref={titleRef}
            defaultValue={data.wish.maxQuantity || 0}
            name="maxQuantity"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.maxQuantity ? true : undefined}
            aria-errormessage={
              actionData?.errors?.maxQuantity ? "maxQuantity-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.maxQuantity && (
          <div className="pt-1 text-red-700" id="maxQuantity-error">
            {actionData.errors.maxQuantity}
          </div>
        )}
      </div>
      {/* QUANTITY end */}

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
      {validFlags.length > 0 && (
        <>
          <h3 className="text-sm font-medium">Opciones:</h3>
          {validFlags.map((flagName) => {
            return (
              <div key={flagName} className="flex items-center">
                <input
                  ref={flaggedAsRef}
                  id={`flaggedAs_${flagName}`}
                  defaultChecked={wishFlags.some((f) => f.startsWith(flagName))}
                  name={`flaggedAs_${flagName}`}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-invalid={
                    actionData?.errors?.flaggedAs ? true : undefined
                  }
                  aria-errormessage={
                    actionData?.errors?.flaggedAs
                      ? "flaggedAs-error"
                      : undefined
                  }
                  type="checkbox"
                />
                <label
                  htmlFor={`flaggedAs_${flagName}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {flagLabels[flagName]}
                </label>
              </div>
            );
          })}
        </>
      )}

      {actionData?.errors?.flaggedAs && (
        <div className="pt-1 text-red-700" id="flaggedAs-error">
          {actionData.errors.flaggedAs}
        </div>
      )}

      {/* LISTA */}
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Lista de deseos:</span>
          <Combobox
            data={data.defaultNotes.map((el) => ({
              value: el.id,
              label: el.title,
            }))}
            value={selectedNoteId}
            onSelect={(val) => setSelectedNoteId(val)}
          />
          <input
            hidden={true}
            readOnly={true}
            value={selectedNoteId}
            name="noteId"
          />
        </label>
      </div>

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
