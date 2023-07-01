import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { requireUserId } from "~/session.server";
import { getUserById, updateUserInfo } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  //   invariant(params.wishId, "wishId not found");

  const userInfo = await getUserById(userId);
  if (!userInfo) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ userInfo });
}

function containsOnlyLetters(input: string): boolean {
  return Array.from(input).every((char) =>
    (char >= "a" && char <= "z") || (char >= "A" && char <= "Z")
  );
}

const validateUsername = (username: string) => {
  return containsOnlyLetters(username)
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    username.length === 0 ||
    (username.length > 0 && !validateUsername(username))
  ) {
    return json(
      { errors: { username: "nombre de usuaria no es válido" } },
      { status: 400 }
    );
  }


  await updateUserInfo(userId, username);

  return redirect(`/me`);
}

export default function UserPersonalInfoPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  const usernameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
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
        <input name="id" type="hidden" value={data.userInfo.id} />

        <label className="flex w-full flex-col gap-1">
          <span>nombre de usuaria: </span>

          <input
            ref={usernameRef}
            defaultValue={data.userInfo.username || ""}
            name="username"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.username ? true : undefined}
            aria-errormessage={
              actionData?.errors?.username ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.username && (
          <div className="pt-1 text-red-700" id="username-error">
            {actionData.errors.username}
          </div>
        )}
        <div>
          solo letras, sin espacios
        </div>
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
