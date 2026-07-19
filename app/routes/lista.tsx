import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { hechoAManoLinks } from "~/components/hechoamano";

export const links: LinksFunction = () => hechoAManoLinks();

export const meta: V2_MetaFunction = () => [{ title: "Lista de deseos" }];

export default function ListaLayout() {
  return (
    <div className="ha-root">
      <Outlet />
    </div>
  );
}
