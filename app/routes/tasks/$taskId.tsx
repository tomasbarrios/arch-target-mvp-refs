import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteTask, getTask } from "~/models/task.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.taskId, "taskId not found");

  const task = await getTask({ id: params.taskId });
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ task });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.taskId, "taskId not found");

  await deleteTask({ id: params.taskId });

  return redirect("/tasks");
}

export default function TaskDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.task.title}</h3>
      <p className="py-6">{data.task.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Task not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
