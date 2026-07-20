import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useActionData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import { updateNote, getNote } from "~/models/note.server";
import {
  DEFAULT_PRE_ASSIGN_COPY,
  DEFAULT_SUCCESS_THANKS_COPY,
} from "~/models/note-copys.server";
import { requireUserId } from "~/session.server";
import { validateURLString } from "~/urls";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
};

export async function action({ request }: ActionArgs) {
  // const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const coverImage = formData.get("coverImage");
  const introSignerName = formData.get("introSignerName");
  const preAssignCopy = formData.get("preAssignCopy");
  const successThanksCopy = formData.get("successThanksCopy");
  const id = formData.get("id");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null, coverImage: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required", coverImage: null } },
      { status: 400 }
    );
  }

  if (
    typeof coverImage !== "string" ||
    (coverImage.length > 0 && !validateURLString(coverImage))
  ) {
    return json(
      {
        errors: {
          title: null,
          body: null,
          coverImage: "El link de la imagen debe ser válido y comenzar con http o https",
        },
      },
      { status: 400 }
    );
  }

  if (typeof id !== "string" || id.length === 0) {
    console.log("ID", { id });
    return json(
      { errors: { title: null, body: null, coverImage: null, id: "id is required" } },
      { status: 400 }
    );
  }
  const note = await updateNote({
    id,
    title,
    body,
    coverImage: coverImage.length > 0 ? coverImage : null,
    introSignerName:
      typeof introSignerName === "string" ? introSignerName : null,
    preAssignCopy: typeof preAssignCopy === "string" ? preAssignCopy : null,
    successThanksCopy:
      typeof successThanksCopy === "string" ? successThanksCopy : null,
  });

  return redirect(`/notes/${note.id}`);
}

export default function EditDetailsPage() {
  console.log("EditDetailsPage");
  const actionData = useActionData<typeof action>();

  const data = useLoaderData<typeof loader>();

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <div>
          <input name="id" type="hidden" value={data.note.id} />

          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>

            <input
              ref={titleRef}
              defaultValue={data.note.title}
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
              defaultValue={data.note.body}
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

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Imagen de portada (link): </span>
            <input
              defaultValue={data.note.coverImage ?? ""}
              name="coverImage"
              placeholder="https://..."
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.coverImage ? true : undefined}
              aria-errormessage={
                actionData?.errors?.coverImage ? "coverImage-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.coverImage && (
            <div className="pt-1 text-red-700" id="coverImage-error">
              {actionData.errors.coverImage}
            </div>
          )}
          {data.note.coverImage && (
            <img
              src={data.note.coverImage}
              alt="Vista previa"
              className="mt-2 h-24 w-24 rounded object-cover"
            />
          )}
        </div>

        <hr className="my-4" />
        <h4 className="text-lg font-bold">Copys personalizables</h4>
        <p className="py-2 text-sm text-gray-600">
          Dejá en blanco para usar el texto por defecto.
        </p>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Firma del intro (home): </span>
            <input
              defaultValue={data.note.introSignerName ?? ""}
              name="introSignerName"
              placeholder="Si está vacío, se deriva del título de la lista"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Frase antes de asignar el regalo: </span>
            <textarea
              defaultValue={data.note.preAssignCopy ?? ""}
              name="preAssignCopy"
              rows={2}
              placeholder={DEFAULT_PRE_ASSIGN_COPY}
              className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            />
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Frase de broma del dueño (pantalla de éxito): </span>
            <textarea
              defaultValue={data.note.successThanksCopy ?? ""}
              name="successThanksCopy"
              rows={2}
              placeholder={DEFAULT_SUCCESS_THANKS_COPY}
              className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
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
      <Link to="edit">Editarrrr</Link>
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
