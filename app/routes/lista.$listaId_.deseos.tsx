import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
import { getGuestId } from "~/guest-session.server";
import { getListaPublica } from "~/models/lista-publica.server";
import { FlexBadge, PrecioDots, Timbre } from "~/components/hechoamano";

function diasRestantes(eventDate: string) {
  const hoy = new Date();
  const evento = new Date(eventDate);
  const msPorDia = 1000 * 60 * 60 * 24;
  const dias = Math.ceil(
    (Date.UTC(evento.getUTCFullYear(), evento.getUTCMonth(), evento.getUTCDate()) -
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate())) /
      msPorDia
  );
  return dias;
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.listaId, "listaId not found");

  const lista = await getListaPublica({ listaId: params.listaId });
  if (!lista) {
    throw new Response("No encontrada", { status: 404 });
  }

  const guestId = await getGuestId(request);
  const misWishIds = guestId
    ? (
        await prisma.guestOnWish.findMany({
          where: { guestId },
          select: { wishId: true },
        })
      ).map((g) => g.wishId)
    : [];

  const dias = lista.eventDate
    ? diasRestantes(lista.eventDate as unknown as string)
    : null;

  const wishes = lista.wishes.map((wish) => ({
    ...wish,
    important: (wish.flaggedAs ?? "").includes("important"),
    esMio: misWishIds.includes(wish.id),
  }));

  const tomadosCount = wishes.filter((w) => w.takenBy).length;

  return json({
    listaId: params.listaId,
    title: lista.title,
    dias,
    wishes,
    tomadosCount,
    total: wishes.length,
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Sus deseos" }];
  }
  return [{ title: `Sus deseos — ${data.title}` }];
};

export default function ExplorarDeseos() {
  const data = useLoaderData<typeof loader>();
  const [tab, setTab] = useState<"todos" | "importantes">("todos");

  const misDeseos = data.wishes.filter((w) => w.esMio);

  const visibles = data.wishes.filter(
    (w) => tab === "todos" || w.important
  );
  const destacados = visibles.filter((w) => w.important && !w.takenBy);
  const libres = visibles.filter((w) => !w.important && !w.takenBy);
  const tomados = visibles.filter((w) => w.takenBy);
  const ordenados = [...destacados, ...libres, ...tomados];

  return (
    <div>
      <div
        style={{
          padding: "20px 22px 14px",
          borderBottom: "1.5px solid var(--ha-borde)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to={`/lista/${data.listaId}`}
          className="ha-manuscrita"
          style={{ fontSize: 28, fontWeight: 700, color: "var(--ha-tinta)", textDecoration: "none" }}
        >
          ‹ {data.title}
        </Link>
        {data.dias !== null && data.dias >= 0 && (
          <div
            className="ha-manuscrita"
            style={{ fontSize: 17, color: "var(--ha-rojo)", transform: "rotate(-2deg)" }}
          >
            {data.dias === 0 ? "¡es hoy!" : data.dias === 1 ? "¡falta 1 día!" : `¡faltan ${data.dias} días!`}
          </div>
        )}
      </div>

      {misDeseos.length > 0 && (
        <div className="ha-compromiso" style={{ margin: "18px 22px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.03em", color: "var(--ha-gris)", textTransform: "uppercase" }}>
            Tú te encargas de
          </div>
          {misDeseos.map((w) => (
            <div key={w.id} style={{ marginTop: 6 }}>
              <Link
                to={`/lista/${data.listaId}/deseo/${w.id}`}
                style={{ fontSize: 17, fontWeight: 800, color: "var(--ha-tinta)" }}
              >
                {w.title}
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="ha-tabs" style={{ margin: "16px 22px 0" }}>
        <button
          type="button"
          className={`ha-tab${tab === "todos" ? " ha-tab-active" : ""}`}
          onClick={() => setTab("todos")}
        >
          Todos
        </button>
        <button
          type="button"
          className={`ha-tab${tab === "importantes" ? " ha-tab-active" : ""}`}
          onClick={() => setTab("importantes")}
        >
          <span style={{ color: "var(--ha-mostaza)" }}>★</span> Los que más le importan
        </button>
      </div>

      <div className="ha-section-titulo" style={{ margin: "18px 22px 4px" }}>
        Sus deseos ✨
      </div>

      {ordenados.map((wish) => (
        <div
          key={wish.id}
          className={`ha-card${wish.takenBy ? " ha-card-taken" : ""}`}
          style={{ margin: "12px 22px" }}
        >
          {wish.important && !wish.takenBy && <span className="ha-fav">⭐</span>}
          {wish.takenBy ? (
            <>
              <div style={{ position: "absolute", right: 14, top: 14 }}>
                <Timbre name={wish.takenBy.name} />
              </div>
              <h3 style={{ fontSize: 16.5, fontWeight: 800, paddingRight: 92 }}>
                {wish.title}
              </h3>
            </>
          ) : (
            <>
              <Link
                to={`/lista/${data.listaId}/deseo/${wish.id}`}
                className="ha-btn"
                style={{ float: "right", textDecoration: "none" }}
              >
                Yo me encargo
              </Link>
              <h3 style={{ fontSize: 16.5, fontWeight: 800, paddingRight: 100 }}>
                {wish.title}
              </h3>
            </>
          )}
          <p className="ha-manuscrita" style={{ fontSize: 20, color: "#6d675c", margin: "4px 0 8px" }}>
            {wish.body}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <FlexBadge flexibility={wish.flexibility} />
            <PrecioDots tier={wish.priceTier} />
          </div>
          {!wish.takenBy && (
            <Link
              to={`/lista/${data.listaId}/deseo/${wish.id}`}
              style={{ fontSize: 13, fontWeight: 700, color: "var(--ha-tinta)", textDecoration: "underline dotted", textUnderlineOffset: "3px" }}
            >
              ver este deseo →
            </Link>
          )}
        </div>
      ))}

      <div className="ha-manuscrita" style={{ textAlign: "center", fontSize: 21, color: "var(--ha-gris)", padding: "12px 0 28px" }}>
        {data.tomadosCount} de {data.total} deseos ya tienen quien se encargue 🙌
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div style={{ padding: "60px 22px", textAlign: "center" }}>
        <p className="ha-manuscrita" style={{ fontSize: 26 }}>
          Esta lista no existe o ya no está disponible.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "60px 22px", textAlign: "center" }}>
      <p>Algo salió mal. Intenta de nuevo más tarde.</p>
    </div>
  );
}
