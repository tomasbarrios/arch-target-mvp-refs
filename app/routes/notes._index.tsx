import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  console.log("Rendering Notes Index")
  return (
    <p>
      No note selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </p>
  );
}
