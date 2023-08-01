import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteTask, getTask } from "~/models/task.server";

// FIXME
// All this operations could be potentially be executed by any user
// Tasks are not binded to the user in a mandatory way

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.taskId, "taskId not found");

  const task = await getTask({ id: params.taskId });
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ task });
};

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.taskId, "taskId not found");

  await deleteTask({ id: params.taskId });

  return redirect("/tasks");
};

export default function TaskDetailsPage() {
  console.log("TaskDetailsPage");
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.task.title}</h3>
      <p className="py-6">{data.task.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      <Link to="edit">Editar!</Link>
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
    return <div>Task not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
