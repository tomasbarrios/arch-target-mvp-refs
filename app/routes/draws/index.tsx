import { Link } from "@remix-run/react";
// import App from './main'

export default function DrawIndexPage() {
  return (
    <>
      <p>
        No task selected. Select a note on the left, or{" "}
        <Link to="new" className="text-blue-500 underline">
          create a new task.
        </Link>
      </p>
      {/* <App /> */}
    </>
  );
}
