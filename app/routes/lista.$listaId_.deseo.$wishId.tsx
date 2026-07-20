import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  FlexBadge,
  Polaroid,
  PrecioDots,
  Timbre,
  hechoAManoLinks,
} from "~/components/hechoamano";
import { prisma } from "~/db.server";
import {
  DEFAULT_PRE_ASSIGN_COPY,
  DEFAULT_SUCCESS_THANKS_COPY,
} from "~/models/note-copys.server";
import { createGuestSession, getGuestId } from "~/guest-session.server";
import {
  createGuest,
  getGuest,
  setGuestEmail,
  setGuestName,
} from "~/models/guest.server";
import {
  getListaPublica,
  releaseWish,
  takeWish,
} from "~/models/lista-publica.server";
import Button from "~/shared/Button";
import { Confetti, links as confettiLinks } from "~/shared/Confetti";

export const links: LinksFunction = () => [
  ...hechoAManoLinks(),
  ...confettiLinks(),
];

function nombreDelDueno(title: string) {
  const match = title.match(/\bde\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.listaId, "listaId not found");
  invariant(params.wishId, "wishId not found");

  const lista = await getListaPublica({ listaId: params.listaId });
  const wish = lista?.wishes.find((w) => w.id === params.wishId);
  if (!lista || !wish) {
    throw new Response("No encontrado", { status: 404 });
  }

  const guestOnWish = await prisma.guestOnWish.findUnique({
    where: { wishId: params.wishId },
    select: { guestId: true },
  });

  const guestId = await getGuestId(request);
  const esMio = !!guestOnWish && guestOnWish.guestId === guestId;

  const guest = esMio && guestId ? await getGuest(guestId) : null;

  const url = new URL(request.url);
  const mostrarConfirmacion = esMio && url.searchParams.get("tomado") === "1";

  return json({
    listaId: params.listaId,
    dueño: nombreDelDueno(lista.title),
    // Copys personalizables: el campo de la Note o el default centralizado.
    preAssignCopy: lista.preAssignCopy ?? DEFAULT_PRE_ASSIGN_COPY,
    successThanksCopy: lista.successThanksCopy ?? DEFAULT_SUCCESS_THANKS_COPY,
    wish: {
      id: wish.id,
      title: wish.title,
      body: wish.body,
      exampleUrls: wish.exampleUrls,
      linkImages: wish.linkImages,
      flexibility: wish.flexibility,
      priceTier: wish.priceTier,
    },
    estado: esMio ? "mio" : wish.takenBy ? "otro" : "libre",
    tomadoPor: wish.takenBy?.name ?? null,
    mostrarConfirmacion,
    guestName: guest?.name ?? null,
    guestEmail: guest?.email ?? null,
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.listaId, "listaId not found");
  invariant(params.wishId, "wishId not found");

  const formData = await request.formData();
  const intent = formData.get("intent");

  type Errors = { name?: string; take?: string; email?: string };

  if (intent === "take") {
    const name = formData.get("name");
    if (typeof name !== "string" || name.trim().length === 0) {
      return json<{ errors: Errors }>(
        {
          errors: {
            name: "Cuéntanos cómo te llamas, así saben quién se encargó 🙂",
          },
        },
        { status: 400 }
      );
    }

    const existingGuestId = await getGuestId(request);
    const existingGuest = existingGuestId
      ? await getGuest(existingGuestId)
      : null;
    let guestId: string;
    let headers: HeadersInit = {};

    if (existingGuest) {
      guestId = existingGuest.id;
      await setGuestName({ id: guestId, name: name.trim() });
    } else {
      // Cookie sin invitado válido (nunca tomó nada, o su guest fue borrado) — identidad nueva.
      const guest = await createGuest({ name: name.trim() });
      guestId = guest.id;
      headers = await createGuestSession({ request, guestId });
    }

    const result = await takeWish({
      wishId: params.wishId,
      guestId,
    });

    if ("error" in result) {
      return json<{ errors: Errors }>(
        {
          errors: {
            take: "Justo se te adelantaron 😅 alguien más ya se encargó de este deseo.",
          },
        },
        { status: 400 }
      );
    }

    return redirect(
      `/lista/${params.listaId}/deseo/${params.wishId}?tomado=1`,
      { headers }
    );
  }

  if (intent === "email") {
    const guestId = await getGuestId(request);
    const email = formData.get("email");

    if (!guestId) {
      return json<{ errors: Errors }>(
        { errors: { email: "No pudimos identificarte, prueba de nuevo." } },
        { status: 400 }
      );
    }
    if (typeof email !== "string" || !email.includes("@")) {
      return json<{ errors: Errors }>(
        { errors: { email: "Ponle un correo válido, porfa." } },
        { status: 400 }
      );
    }

    await setGuestEmail({ id: guestId, email: email.trim() });
    return json({ emailSaved: true });
  }

  if (intent === "release") {
    const guestId = await getGuestId(request);
    if (guestId) {
      await releaseWish({ wishId: params.wishId, guestId });
    }
    return redirect(`/lista/${params.listaId}/deseos`);
  }

  throw new Response("Solicitud no reconocida", { status: 400 });
}

const linkVolver = { fontSize: 14, fontWeight: 700, color: "var(--ha-gris)" };

export default function DeseoPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors =
    actionData && "errors" in actionData ? actionData.errors : undefined;

  const volver = (
    <div style={{ padding: "18px 22px 0" }}>
      <Link to={`/lista/${data.listaId}/deseos`} style={linkVolver}>
        ‹ volver a los deseos
      </Link>
    </div>
  );

  const notaDelDueno = data.wish.body && (
    <p
      className="ha-manuscrita"
      style={{ fontSize: 23, color: "var(--ha-gris)", marginTop: 8 }}
    >
      &ldquo;{data.wish.body}&rdquo;
    </p>
  );

  const nudgeEmail = !data.guestEmail && (
    <Form method="post" style={{ margin: "22px 22px 0", textAlign: "center" }}>
      <input type="hidden" name="intent" value="email" />
      <p style={{ fontSize: 13, color: "var(--ha-gris)", lineHeight: 1.6 }}>
        ¿Cambias seguido de teléfono?{" "}
        <label htmlFor="email" style={{ textDecoration: "underline" }}>
          Deja tu email
        </label>{" "}
        para no perder tu elección.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          style={{
            flex: 1,
            fontFamily: "Karla",
            fontSize: 14,
            border: "1.5px solid var(--ha-borde)",
            borderRadius: 6,
            padding: "10px 12px",
          }}
        />
        <button
          type="submit"
          className="ha-btn-secundario"
          aria-label="Guardar email"
          style={{
            paddingLeft: 14,
            paddingRight: 14,
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ✓
        </button>
      </div>
      {errors?.email && (
        <p style={{ color: "var(--ha-rojo)", fontSize: 13, marginTop: 6 }}>
          {errors.email}
        </p>
      )}
    </Form>
  );

  const emailConfirmado = data.guestEmail && (
    <p
      style={{
        textAlign: "center",
        fontSize: 13,
        color: "var(--ha-verde)",
        margin: "22px 22px 0",
      }}
    >
      Ya tenemos tu correo ✅
    </p>
  );

  if (data.estado === "otro") {
    return (
      <div>
        {volver}
        <div style={{ textAlign: "center", padding: "40px 22px" }}>
          <Timbre name={data.tomadoPor ?? "otra persona"} />
          <h2
            style={{
              fontSize: 23,
              fontWeight: 800,
              marginTop: 20,
              lineHeight: 1.25,
            }}
          >
            {data.wish.title}
          </h2>
          {notaDelDueno}
          <p
            style={{
              fontSize: 14,
              color: "var(--ha-gris)",
              marginTop: 18,
              lineHeight: 1.5,
            }}
          >
            {data.tomadoPor} ya se encargó de este. ¡Gracias por pasar a mirar!
            💛
          </p>
        </div>
      </div>
    );
  }

  if (data.estado === "mio" && data.mostrarConfirmacion) {
    return (
      <div style={{ position: "relative" }}>
        <Confetti />
        <div style={{ textAlign: "center", padding: "52px 22px 6px" }}>
          <div style={{ fontSize: 58 }}>🎉</div>
          <h1
            className="ha-manuscrita"
            style={{
              fontSize: 44,
              fontWeight: 700,
              marginTop: 8,
              transform: "rotate(-1.5deg)",
            }}
          >
            Listo, {data.wish.title} es tuyo 🙌
          </h1>
          <p
            className="ha-manuscrita"
            style={{ fontSize: 23, lineHeight: 1.3, marginTop: 14 }}
          >
            &ldquo;{data.successThanksCopy}&rdquo;
          </p>
          <p
            className="ha-manuscrita"
            style={{ fontSize: 17, color: "var(--ha-gris)", marginTop: 2 }}
          >
            — {data.dueño ?? "quien organiza esto"}
          </p>
        </div>

        <div style={{ margin: "34px 22px 4px", position: "relative" }}>
          <div style={{ position: "absolute", top: -18, right: -6, zIndex: 1 }}>
            <Timbre name={data.guestName ?? "ti"} />
          </div>
          <div className="ha-card" style={{ transform: "rotate(.4deg)" }}>
            <h3 style={{ fontSize: 16.5, fontWeight: 800 }}>
              {data.wish.title}
            </h3>
            {data.wish.body && (
              <p
                className="ha-manuscrita"
                style={{
                  fontSize: 20,
                  color: "var(--ha-gris)",
                  margin: "4px 0 8px",
                }}
              >
                &ldquo;{data.wish.body}&rdquo;
              </p>
            )}
            <FlexBadge flexibility={data.wish.flexibility} />
          </div>
        </div>

        <div style={{ margin: "44px 22px 0", textAlign: "center" }}>
          <Link
            to={`/lista/${data.listaId}/deseos`}
            className="ha-btn-secundario"
          >
            Volver a los deseos
          </Link>
        </div>

        {data.guestEmail ? emailConfirmado : nudgeEmail}
        <div style={{ paddingBottom: 30 }} />
      </div>
    );
  }

  if (data.estado === "mio") {
    return (
      <div>
        {volver}
        <div style={{ textAlign: "center", padding: "40px 22px 10px" }}>
          <Timbre name="ti" />
          <h2
            style={{
              fontSize: 23,
              fontWeight: 800,
              marginTop: 20,
              lineHeight: 1.25,
            }}
          >
            {data.wish.title}
          </h2>
          {notaDelDueno}
          <p
            style={{
              fontSize: 14,
              color: "var(--ha-gris)",
              marginTop: 18,
              lineHeight: 1.5,
            }}
          >
            Tú te encargas de esto.
          </p>
        </div>

        {data.guestEmail ? emailConfirmado : nudgeEmail}

        <details style={{ margin: "26px 22px 34px", textAlign: "center" }}>
          <summary
            style={{ fontSize: 13, color: "var(--ha-gris)", cursor: "pointer" }}
          >
            ¿Ya no puedes encargarte?
          </summary>
          <Form method="post" style={{ marginTop: 14 }}>
            <input type="hidden" name="intent" value="release" />
            <Button
              type="submit"
              className="ha-btn-secundario"
              confirmPrompt="¿Soltar este deseo? Alguien más podrá tomarlo."
            >
              Soltar este deseo
            </Button>
          </Form>
        </details>
      </div>
    );
  }

  // estado === "libre"
  return (
    <div>
      {volver}

      <div style={{ textAlign: "center", padding: "18px 22px 0" }}>
        <div style={{ display: "inline-block" }}>
          <Polaroid rotate={2.5} />
        </div>
        <h2
          style={{
            fontSize: 23,
            fontWeight: 800,
            marginTop: 18,
            lineHeight: 1.25,
          }}
        >
          {data.wish.title}
        </h2>
        {notaDelDueno}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginTop: 12,
          }}
        >
          <FlexBadge flexibility={data.wish.flexibility} detailed />
          <PrecioDots tier={data.wish.priceTier} detailed />
        </div>
        {data.wish.exampleUrls && (
          <div style={{ marginTop: 10 }}>
            {data.wish.exampleUrls
              .split("\n")
              .filter(Boolean)
              .map((url) => {
                const linkImages: Record<string, string> = data.wish
                  .linkImages
                  ? JSON.parse(data.wish.linkImages)
                  : {};
                const image = linkImages[url];
                return (
                  <div
                    key={url}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {image && (
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--ha-tinta)",
                      }}
                    >
                      ver dónde comprarlo →
                    </a>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "26px 22px 6px" }}>
        <span
          style={{
            fontSize: 34,
            display: "inline-block",
            transform: "rotate(-6deg)",
          }}
        >
          ✋
        </span>
        <h1
          className="ha-manuscrita"
          style={{ fontSize: 38, fontWeight: 700, marginTop: 4 }}
        >
          {data.preAssignCopy}
        </h1>
        <p
          style={{
            fontSize: 14.5,
            color: "var(--ha-gris)",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          Deja tu nombre y ya está — sin correo, sin claves.
        </p>
      </div>

      <Form method="post" style={{ margin: "18px 22px 0" }}>
        <input type="hidden" name="intent" value="take" />
        <label
          htmlFor="name"
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          ¿Cómo te llamas?
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Tu nombre y apellido, o inicial — ej. Caro B."
          aria-invalid={errors?.name ? true : undefined}
          style={{
            width: "100%",
            fontFamily: "Karla",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--ha-tinta)",
            background: "var(--ha-papel)",
            border: "1.5px solid var(--ha-borde)",
            borderRadius: 6,
            padding: "14px 16px",
            outline: "none",
          }}
        />
        {(errors?.name || errors?.take) && (
          <p style={{ color: "var(--ha-rojo)", fontSize: 13, marginTop: 6 }}>
            {errors.name ?? errors.take}
          </p>
        )}
        <p style={{ fontSize: 12.5, color: "var(--ha-gris)", marginTop: 6 }}>
          Con tu apellido (o su inicial) tus conocidos sabrán que eres tú.
        </p>
        <button
          type="submit"
          className="ha-btn"
          style={{
            display: "block",
            width: "100%",
            marginTop: 16,
            fontSize: 16,
            padding: 15,
          }}
        >
          Yo me encargo
        </button>
      </Form>

      <div style={{ margin: "22px 22px 30px" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 17, lineHeight: 1.5 }}>👀</span>
          <span
            style={{ fontSize: 14, color: "var(--ha-gris)", lineHeight: 1.5 }}
          >
            <b style={{ color: "var(--ha-tinta)" }}>
              {data.dueño ?? "El resto"} va a saber
            </b>{" "}
            que tú te encargaste de esto — así nadie lo trae duplicado.
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 17, lineHeight: 1.5 }}>🔄</span>
          <span
            style={{ fontSize: 14, color: "var(--ha-gris)", lineHeight: 1.5 }}
          >
            ¿Te arrepientes?{" "}
            <b style={{ color: "var(--ha-tinta)" }}>
              Puedes soltarlo cuando quieras
            </b>
            , sin drama.
          </span>
        </div>
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
          Este deseo no existe o ya no está disponible.
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
