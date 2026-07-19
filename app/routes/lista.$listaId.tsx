import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { Polaroid } from "~/components/hechoamano";
import { prisma } from "~/db.server";
import { getGuestId } from "~/guest-session.server";
import { getListaPublica } from "~/models/lista-publica.server";

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

function nombreDelDueno(title: string) {
  const match = title.match(/\bde\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.listaId, "listaId not found");

  const lista = await getListaPublica({ listaId: params.listaId });
  if (!lista) {
    throw new Response("No encontrada", { status: 404 });
  }

  const dias = lista.eventDate ? diasRestantes(lista.eventDate as unknown as string) : null;

  const guestId = await getGuestId(request);
  const misCompromisos = guestId
    ? (
        await prisma.guestOnWish.findMany({
          where: { guestId, wish: { noteId: params.listaId } },
          select: {
            wish: { select: { id: true, title: true, body: true } },
          },
        })
      ).map((c) => c.wish)
    : [];

  const tomadosCount = lista.wishes.filter((w) => w.takenBy).length;

  return json({
    listaId: params.listaId,
    title: lista.title,
    body: lista.body,
    eventDate: lista.eventDate,
    coverImage: lista.coverImage,
    dias,
    nombre: nombreDelDueno(lista.title),
    misCompromisos,
    tomadosCount,
    total: lista.wishes.length,
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Lista de deseos" }];
  }
  const title = `La lista de deseos de ${data.title}`;
  const description = "Mira qué le encantaría recibir.";
  const tags = [
    { title },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
  if (data.coverImage) {
    tags.push({ property: "og:image", content: data.coverImage });
  }
  return tags;
};

const formatoFecha = new Intl.DateTimeFormat("es-CL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export default function LaCarta() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div style={{ padding: "42px 22px 8px", textAlign: "center" }}>
        <Polaroid src={data.coverImage} alt={data.title} rotate={-3} />
        <h1
          className="ha-manuscrita"
          style={{ fontSize: 42, fontWeight: 700, marginTop: 18 }}
        >
          {data.title}
        </h1>
        {data.eventDate && (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ha-gris)" }}>
              {formatoFecha.format(new Date(data.eventDate))}
            </div>
            {data.dias !== null && data.dias >= 0 && (
              <div
                className="ha-manuscrita"
                style={{
                  display: "inline-block",
                  fontSize: 21,
                  color: "var(--ha-rojo)",
                  transform: "rotate(-2deg)",
                  marginTop: 4,
                }}
              >
                ¡{data.dias === 0 ? "es hoy" : data.dias === 1 ? "falta 1 día" : `faltan ${data.dias} días`}!
              </div>
            )}
          </>
        )}
      </div>

      {data.misCompromisos.length > 0 ? (
        <>
          {data.misCompromisos.map((wish) => (
            <div
              key={wish.id}
              style={{ margin: "20px 22px", position: "relative", transform: "rotate(-.4deg)" }}
            >
              <div style={{ position: "absolute", right: 16, top: -14, zIndex: 1 }}>
                <span className="ha-timbre">¡ya estás en esto!</span>
              </div>
              <div className="ha-compromiso">
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    letterSpacing: "0.03em",
                    color: "var(--ha-gris)",
                    textTransform: "uppercase",
                  }}
                >
                  Tú te encargas de
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 800, marginTop: 6, lineHeight: 1.3 }}>
                  {wish.title}
                </h2>
                {wish.body && (
                  <p className="ha-manuscrita" style={{ fontSize: 19, color: "#6d675c", marginTop: 6 }}>
                    &ldquo;{wish.body}&rdquo;
                  </p>
                )}
              </div>
              <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
                <Link
                  to={`/lista/${data.listaId}/deseo/${wish.id}`}
                  style={{ fontSize: 13, color: "var(--ha-gris)", textDecoration: "underline" }}
                >
                  ¿Ya no puedes? Suéltalo aquí
                </Link>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 22px 4px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--ha-borde)" }} />
            <span className="ha-manuscrita" style={{ fontSize: 22, whiteSpace: "nowrap" }}>
              así va la minga
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--ha-borde)" }} />
          </div>
          <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--ha-gris)", margin: "0 22px 6px" }}>
            {data.tomadosCount} de {data.total} deseos ya tienen quien se encargue 🙌
          </p>

          <div className="ha-manuscrita" style={{ textAlign: "center", fontSize: 21, padding: "14px 0 28px" }}>
            <Link
              to={`/lista/${data.listaId}/deseos`}
              style={{
                color: "var(--ha-tinta)",
                fontFamily: "Karla",
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                borderBottom: "2px solid var(--ha-tinta)",
                paddingBottom: 2,
              }}
            >
              Ver la lista completa
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="ha-papel" style={{ margin: "24px 22px" }}>
            &ldquo;{data.body}&rdquo;
            {data.nombre && <div className="ha-firma">— {data.nombre}</div>}
          </div>

          <div style={{ margin: "auto 22px 0", paddingBottom: 38, textAlign: "center" }}>
            <Link
              to={`/lista/${data.listaId}/deseos`}
              className="ha-btn"
              style={{ display: "block" }}
            >
              Ver sus deseos ✨
            </Link>
          </div>
        </>
      )}
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
