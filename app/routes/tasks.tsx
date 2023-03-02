import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getTaskListItems } from "~/models/task.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  // const noteId = "clerevzq30002w8bq7tkrhbxk"
  const taskListItems = await getTaskListItems({ noteId: null });
  console.log({taskListItems})
  return json({ taskListItems });
}

export default function TasksPage() {
  const data = useLoaderData<typeof loader>();
  console.log({data})
  // const note = useNote();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Tasks</Link>
        </h1>
        {/* <p>{note.noteId}</p> */}
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Task
          </Link>

          <hr />

          {data.taskListItems.length === 0 ? (
            <p className="p-4">No tasks yet</p>
          ) : (
            <ol>
              {data.taskListItems.map((task) => (
                <li key={task.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={task.id}
                  >
                    📝 {task.title}
                    
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={`/notes/${task.noteId}`}
                  >
                  ⨾ {task.noteId}
                    
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
