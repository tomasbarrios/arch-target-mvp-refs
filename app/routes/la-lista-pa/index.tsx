import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No wish selected. Select a wish on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new wish.
      </Link>
    </p>
  );
}
