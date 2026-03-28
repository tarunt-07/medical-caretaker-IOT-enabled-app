import prantarLogo from "../../assets/prantar-logo.jpg";

function BrandLogo({ size = "md", subtitle = "Logo loading" }) {
  return (
    <div className={`brand-logo brand-logo-${size}`}>
      <div
        className="brand-logo-mark"
        role="img"
        aria-label="prantar.io logo"
        style={{ backgroundImage: `url(${prantarLogo})` }}
      />
      <div className="brand-logo-copy">
        <div className="brand-logo-title">prantar.io</div>
        <div className="brand-logo-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

export default BrandLogo;
