type BrandMarkProps = {
  inverse?: boolean;
};

export function BrandMark({ inverse = false }: BrandMarkProps) {
  return (
    <a className={`brand-mark${inverse ? " brand-mark--inverse" : ""}`} href="#inicio" aria-label="B Lance by ROMI, ir al inicio">
      <span className="brand-mark__symbol" aria-hidden="true">
        <span>B</span>
        <i />
      </span>
      <span className="brand-mark__name">
        <strong>B Lance</strong>
        <small>by ROMI</small>
      </span>
    </a>
  );
}
