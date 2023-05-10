import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import * as React from "react";

import { createWish } from "~/models/wish.server";
import { requireUserId } from "~/session.server";
import { getDefaultNoteForWish, createWishGroup } from "~/models/note.server";


export async function loader({ request, params }: LoaderArgs) {
  console.log("WE HERE?")
  // invariant(params.wishId, "wishId not found");

  const userId = await requireUserId(request);
  console.log("WE HERE?", {userId})

  /**
   * FIXME
   * We select the first note, this can generate problems if the user creates more than one note
   * 
   * SOL: Note should be dynamically changed
   */
  const defaultNote = await getDefaultNoteForWish({userId})

  // if (!defaultNote) {
  //   throw new Response("No default note Found", { status: 404 });
  // }
  
  return json({ defaultNote });
  // return null
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  // const noteId = "123"//await requirenoteId(request);
  const formData = await request.formData();
  // console.log({formData}, "HHHH")
  const title = formData.get("title");
  const body = formData.get("body");
  const noteId = formData.get("noteId");
  // const body = formData.get("body");

  console.log("ERRRRRRR0")
  console.log({ title, body, noteId })


  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null, noteId: null } },
      { status: 400 }
    );
  }
  console.log("ERRRRRRR1")

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required",  noteId: null } },
      { status: 400 }
    );
  }
  console.log("ERRRRRRR2")

  // if (typeof noteId !== "string" || noteId.length === 0) {
  //   console.log("ERRRRRRR3")
  //   return json(
  //     { errors: { title: null, body: null, noteId: "List is required" } },
  //     { status: 400 }
  //   );
  // }

  console.log("WHAT")


  const firstList = await createWishGroup({ title: "Mi primera lista 💕", userId })
    //   where: { title: task.title },
    
  const wish = await createWish({ title, body, noteId: firstList.id });

  return redirect(`/wishes/${wish.id}`);
}

export default function NewWishPage() {
  const data = useLoaderData<typeof loader>();

  // console.log( "DATAs DATA DATA DATA", data )
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const noteIdRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

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
          <span>Title: </span>
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

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
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

      {/* LISTA begin */}

      <div>
        <label className="flex w-full flex-col gap-1">
          
          { 
            data.defaultNote ? 
            <span>Se agregara a la <i>Lista de deseos</i>: <b>{data.defaultNote?.title}</b></span> :
            <span>Al guardar este deseo se creará tu primera lista de deseos 💕</span> } 
          
          <input
            ref={noteIdRef}
            // disabled="true"
            hidden={true}
            readOnly={true}
            value={data.defaultNote?.id}
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
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
