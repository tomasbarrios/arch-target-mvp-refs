import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import * as React from "react";

import { Combobox } from "~/components/ui/combobox";
import {
  createWishGroup,
  getDefaultNoteForWish,
  getDefaultNotesForWish,
} from "~/models/note.server";
import { createWish } from "~/models/wish.server";
import { requireUserId } from "~/session.server";
import { validateURLString } from "~/urls";
const flags = ["important", "ok2ndHand"];
const flagLabels: Record<string, string> = {
  important: "¿Es importante?",
  ok2ndHand: "¿Aceptas segunda mano?",
};

export async function loader({ request, params }: LoaderArgs) {
  console.log("WE HERE?", { flags });
  // invariant(params.wishId, "wishId not found");

  const userId = await requireUserId(request);
  console.log("WE HERE?", { userId });

  /**
   * FIXME
   * We select the first note, this can generate problems if the user creates more than one note
   *
   * SOL: Note should be dynamically changed
   */
  const defaultNote = await getDefaultNoteForWish({ userId });
  const defaultNotes = await getDefaultNotesForWish({ userId });
  console.log({ defaultNotes });
  // if (!defaultNote) {
  //   throw new Response("No default note Found", { status: 404 });
  // }

  return json({ defaultNote, defaultNotes });
  // return null
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  // const noteId = "123"//await requirenoteId(request);
  const formData = await request.formData();
  // console.log({formData}, "HHHH")
  const title = formData.get("title");
  const body = formData.get("body");
  const exampleUrls = formData.get("exampleUrls");
  const noteId = formData.get("noteId");
  const flaggedAs = flags
    .map((f) => {
      return formData.get("flaggedAs_" + f) == "on" ? f : null;
    })
    .filter((f) => f !== null);

  console.log("ERRRRRRR0");
  console.log({ title, body, noteId, exampleUrls, flaggedAs });

  if (typeof title !== "string" || title.length === 0) {
    return json(
      {
        errors: {
          title: "Title is required",
          body: null,
          exampleUrls: null,
          flaggedAs: null,
          noteId: null,
        },
      },
      { status: 400 }
    );
  }
  console.log("ERRRRRRR1");

  if (typeof body !== "string" || body.length === 0) {
    return json(
      {
        errors: {
          title: null,
          body: "Body is required",
          exampleUrls: null,
          flaggedAs: null,
          noteId: null,
        },
      },
      { status: 400 }
    );
  }

  // console.log('typeof exampleUrls !== "string"',typeof exampleUrls !== "string")
  // console.log('typeof exampleUrls !== "string"', exampleUrls.length >= 0)
  // console.log('typeof exampleUrls !== "string"', exampleUrls.length)
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

  console.log("ERRRRRRR2");

  // if (typeof noteId !== "string" || noteId.length === 0) {
  //   console.log("ERRRRRRR3")
  //   return json(
  //     { errors: { title: null, body: null, noteId: "List is required" } },
  //     { status: 400 }
  //   );
  // }
  // console.log({
  //   flagged: flaggedAs.join("\n"),
  // });

  // return json(
  //   {
  //     errors: {
  //       title: null,
  //       body: null,
  //       exampleUrls: null,
  //       flaggedAs:
  //         "Links deben válidos y uno por linea. También verifica que comienzan con http o https",
  //       noteId: null,
  //     },
  //   },
  //   { status: 400 }
  // );

  let listToAssign;

  if (typeof noteId === "string" && noteId.length > 0) {
    listToAssign = { id: noteId };
  } else {
    const defaultNote = await getDefaultNoteForWish({ userId });

    let firstList = null;
    if (!defaultNote) {
      firstList = await createWishGroup({
        title: "Mi primera lista 💕",
        userId,
      });
    }

    listToAssign = defaultNote || firstList;
  }

  if (!listToAssign) {
    throw new Error("Could not find a valid list to assign");
  }
  const wish = await createWish({
    title,
    body,
    exampleUrls,
    flaggedAs: flaggedAs.length > 0 ? flaggedAs.join("\n") : null,
    noteId: listToAssign.id,
  });

  return redirect(`/wishes/${wish.id}`);
}

export default function NewWishPage() {
  const data = useLoaderData<typeof loader>();

  // const MultiSelect = (props: any) => <Combobox/>;

  console.log("FALGGGGG,", { flags });
  // console.log( "DATAs DATA DATA DATA", data )
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const noteIdRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const exampleUrlsRef = React.useRef<HTMLTextAreaElement>(null);
  const flaggedAsRef = React.useRef<HTMLInputElement>(null);

  const [selectedNoteId, setSelectedNoteId] = React.useState(
    data.defaultNote?.id || ""
  );

  React.useEffect(() => {
    const stored = localStorage.getItem("lastWishListId");
    if (stored) setSelectedNoteId(stored);
  }, []);

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

  // const alternativeNotes =
  //   data.defaultNotes.length > 1
  //     ? [data.defaultNotes[0], data.defaultNotes[0]]
  //     : null;

  // console.log({ data.defaultNotes });
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
        <label className="flex w-full flex-col gap-1">
          <span>Nombre: </span>
          <input
            ref={titleRef}
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
          <span>Descripción o detalles: </span>
          <textarea
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
      {flags.length > 0 && (
        <>
          <h3 className="text-sm font-medium">Opciones:</h3>
          {flags.map((flagName) => (
            <div key={flagName} className="flex items-center">
              <input
                ref={flaggedAsRef}
                id={`flaggedAs_${flagName}`}
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
                {flagLabels[flagName]}
              </label>
            </div>
          ))}
        </>
      )}

      {actionData?.errors?.flaggedAs && (
        <div className="pt-1 text-red-700" id="flaggedAs-error">
          {actionData.errors.flaggedAs}
        </div>
      )}

      {/* FLAGS end */}

      <hr />
      {/* LISTA begin */}

      <div>
        <label className="flex w-full flex-col gap-1">
          {data.defaultNote ? (
            <span>
              Se agregara a la <i>Lista de deseos</i>:{" "}
              <b>
                {data.defaultNotes.find((n) => n.id === selectedNoteId)
                  ?.title || data.defaultNote?.title}
              </b>
              <Combobox
                data={data.defaultNotes.map((el) => ({
                  value: el.id,
                  label: el.title,
                }))}
                value={selectedNoteId}
                onSelect={(val) => {
                  setSelectedNoteId(val);
                  localStorage.setItem("lastWishListId", val);
                }}
              />
            </span>
          ) : (
            <span>
              Al guardar este deseo se creará tu primera lista de deseos 💕
            </span>
          )}

          <input
            ref={noteIdRef}
            hidden={true}
            readOnly={true}
            value={selectedNoteId}
            name="noteId"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.noteId ? true : undefined}
            aria-errormessage={
              actionData?.errors?.noteId ? "noteId-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.noteId && (
          <div className="pt-1 text-red-700" id="noteId-error">
            {actionData.errors.noteId}
          </div>
        )}
      </div>

      {/* LISTA end */}

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
