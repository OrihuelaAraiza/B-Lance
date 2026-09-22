type BrandMarkProps = { href?: string; inverse?: boolean };

// Display the exact supplied artwork through an SVG viewport; no redrawing.
export function BrandSymbol() {
  return (
    <svg className="brand-symbol" viewBox="120 625 215 172" aria-hidden="true">
      <image
        href="/images/brand/identidad-oficial.jpeg"
        width="1536"
        height="1024"
      />
    </svg>
  );
}

export function BrandMark({
  href = "#inicio",
  inverse = false,
}: BrandMarkProps) {
  return (
    <a
      className={`brand-mark brand-mark--official${inverse ? " brand-mark--inverse" : ""}`}
      href={href}
      aria-label="B-lance, equilibrio para tu mente, ir al inicio"
    >
      <svg viewBox="517 652 490 133" role="img" aria-label="B-lance">
        <image
          href="/images/brand/identidad-oficial.jpeg"
          width="1536"
          height="1024"
        />
      </svg>
    </a>
  );
}
