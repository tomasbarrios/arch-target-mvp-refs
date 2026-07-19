import styles from "~/styles/hecho-a-mano.css";

export const hechoAManoLinks = (): { rel: string; href: string }[] => {
  return [{ rel: "stylesheet", href: styles }];
};

export function Polaroid({
  src,
  alt,
  caption,
  rotate,
}: {
  src?: string | null;
  alt?: string;
  caption?: string;
  rotate?: number;
}) {
  return (
    <div
      className="ha-polaroid"
      style={{ transform: `rotate(${rotate ?? -3}deg)` }}
    >
      <div className="ha-tape" />
      <div className="ha-polaroid-foto">
        {src ? <img src={src} alt={alt ?? ""} /> : "📷"}
      </div>
      {caption && <div className="ha-caption">{caption}</div>}
    </div>
  );
}

export function Timbre({ name }: { name: string }) {
  return <div className="ha-timbre">lo tiene {name}</div>;
}

export function FlexBadge({
  flexibility,
  detailed,
}: {
  flexibility?: string | null;
  detailed?: boolean;
}) {
  if (flexibility === "exact") {
    return <span className="ha-flex-mark ha-exact">ESTE EXACTO ✓</span>;
  }
  if (flexibility === "similar") {
    return (
      <span className="ha-flex-mark ha-similar">
        ALGO COMO ESTO{detailed ? " — tú eliges cuál" : ""}
      </span>
    );
  }
  return null;
}

export function PrecioDots({
  tier,
  detailed,
}: {
  tier?: number | null;
  detailed?: boolean;
}) {
  if (!tier) {
    return null;
  }
  return (
    <span className="ha-price">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= tier ? "ha-fill" : undefined} />
      ))}
      {detailed && <span className="ha-price-cap">precio aprox.</span>}
    </span>
  );
}
