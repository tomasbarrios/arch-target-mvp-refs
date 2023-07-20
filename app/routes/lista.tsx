import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  // useLocation, //
} from "@remix-run/react";
// import { useState } from "react";

import {
  requireUserId,
  getSession,
  // , commitSession
} from "~/session.server";
// import { useUser } from "~/utils";
import { getOrganization } from "~/models/organization.server";
import { getWishListItemsWithVolunteerCount } from "~/models/la-lista-pa.server";
import { getWishListAsNote } from "~/models/note.server";
import { getUserById, updateKnownUrls } from "~/models/user.server";
import { addWithSeparator } from "~/utils-serialize";

/**
 * Ordena un arreglo segun las siguietnes reglas
 *
 * 1. No completadas y TOP
 * 2. No completadas
 * 3. Completadas
 * @param objeto1
 * @param objeto2
 * @returns
 */
function comparador(objeto1: any, objeto2: any) {
  var anotaciones1 = objeto1.flaggedAs;
  var anotaciones2 = objeto2.flaggedAs;

  if (anotaciones1?.includes("done") && !anotaciones2?.includes("done")) {
    return 1; // objeto2 va primero si objeto1 tiene anotaciones ?.includes(
  } else if (
    !anotaciones1?.includes("done") &&
    anotaciones2?.includes("done")
  ) {
    return -1; // objeto1 va primero si objeto2 tiene anotaciones "done"
  } else if (anotaciones1?.includes("important")) {
    return -1; // objeto1 va primero si tiene "important"
  } else if (anotaciones2?.includes("important")) {
    return 1; // objeto2 va primero si tiene "important"
  } else if (anotaciones1 === "" && anotaciones2 !== "") {
    return -1; // objeto1 va primero si objeto2 tiene anotaciones distintas de ""
  } else if (anotaciones1 !== "" && anotaciones2 === "") {
    return 1; // objeto2 va primero si objeto1 tiene anotaciones distintas de ""
  } else {
    return 0; // mantén el orden actual
  }
}
/**
 * TODO1: This loads the wishlist, but lista/$listaId lo hace tb, es decir dos veces XO
 *
 * @param param0
 * @returns
 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  const organization = await getOrganization({ userId });

  if (!params.listaId) throw new Error("No listId provided");

  /**
   * latestKnownUrls allows to see lists
   *
   */
  const hasVisitedBefore = user?.latestKnownUrls?.includes(params.listaId);
  if (!hasVisitedBefore) {
    const addWithSerializer = addWithSeparator("\n");
    const updatedSerializedKnownUrls = addWithSerializer(
      user?.latestKnownUrls || "",
      `list${params.listaId}`
    );

    // User knows the url (arrived here),
    // but not yet in his known registry
    await updateKnownUrls(userId, updatedSerializedKnownUrls);
  }

  const session = await getSession(request);

  const globalMessage = session.get("globalMessage");
  // console.log("ADD TO JSON", { additional, globalMessage });

  const wishListItems = await getWishListItemsWithVolunteerCount({
    noteId: params.listaId,
  });

  // console.log("wishListItems",{wishListItems});

  wishListItems?.sort(comparador);
  // console.log("getWishListItemsWithVolunteerCount", { wishListItems });
  const note = await getWishListAsNote({ id: params.listaId });

  // console.log({ organization, list: "hey" });
  return json({
    wishListItems: wishListItems.map((w) => {
      return {
        ...w,
        url: `/lista/${params.listaId}/deseo/${w.id}`,
        volunteersCount: w._count.volunteers,
      };
    }),
    note,
    organization,
    globalMessage,
  });
}

const stylesForFlags: { [key: string]: {} } = {
  parent: { position: "relative" },
};

export const meta: V2_MetaFunction = () => [{ title: "Lista" }];

export default function WishListPageLayout() {
  console.log("Rendering WishListPageLayout");

  const data = useLoaderData<typeof loader>();
  // const { globalMessage } = data;
  // const user = useUser()
  // const location = useLocation();
  // const [savedLocation] = useState(location.key);

  // console.log({ globalMessage1: globalMessage });
  // console.log({
  //   "location.key === savedLocation": location.key === savedLocation,
  // });
  // console.log({ locationKey: location.key, savedLocation });

  const validFlags = {
    important: "important",
    done: "done",
  };
  const WishFlag = ({ variant }: { variant: string }) => {
    // console.log({ variant });
    const variantToIcon: { [key: string]: string } = {
      important: "🔝",
    };
    if (!Object.keys(variantToIcon).includes(variant)) {
      return null;
    }
    // console.log({ variat: variantToIcon[variant] });
    return (
      <div className={"wishFlag-container"}>
        <i>{variantToIcon[variant]}</i>
      </div>
    );
  };


  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/listas">Listas</Link>
        </h1>
        <p>
          {/* FIXME: Org should bot be optional */}
          Lista de deseos para "{data.note.title}"
        </p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="c-list h-full w-80 border-r bg-gray-50">
          {data.wishListItems.length === 0 ? (
            <p className="p-4">No wishs yet</p>
          ) : (
            <ol>
              {data.wishListItems.map((wish) => {
                const wishFlags = wish.flaggedAs?.split("\n") || [];
                const isDone = wishFlags.some((wf) =>
                  wf.startsWith(validFlags.done)
                );
                return (
                  <li key={wish.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${
                          isActive ? "bg-white" : ""
                        }`
                      }
                      to={wish.url}
                    >
                      <div style={stylesForFlags.parent}>
                        {wishFlags.map((f) => {
                          return <WishFlag key={wish.id + f} variant={f} />;
                        })}

                        {isDone ? `✅ ` : `📝 `}

                        {isDone ? (
                          <span style={{ textDecoration: "line-through" }}>
                            {wish.title}
                          </span>
                        ) : (
                          `${wish.title}`
                        )}

                        {wish.volunteersCount > 0
                          ? ` (${wish.volunteersCount})`
                          : ""}
                      </div>

                      {/* {wish.flaggedAs} */}
                    </NavLink>
                  </li>
                );
              })}
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
