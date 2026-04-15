interface JessLandingProps {
  onOpenCalculator: () => void;
}

export const JessLanding = ({ onOpenCalculator }: JessLandingProps) => {
  return (
    <div className="jess-landing">
      <div className="jess-landing__bg" aria-hidden="true">
        <span className="jess-landing__orb jess-landing__orb--a" />
        <span className="jess-landing__orb jess-landing__orb--b" />
        <span className="jess-landing__orb jess-landing__orb--c" />
      </div>
      <div className="jess-landing__card">
        <p className="jess-landing__eyebrow">Made for you</p>
        <p className="jess-landing__attribution">by Jackson</p>
        <h1 className="jess-landing__title">Hey Jess</h1>
        <p className="jess-landing__lead">
          Wondering how much extra <strong>salary sacrifice</strong> you could still tuck in this financial
          year—without accidentally blowing past your <strong>concessional cap</strong>? This little tool lines
          up <strong>employer super</strong>, what you already sacrifice, and anything you are thinking of
          adding, so you can see the <strong>headroom</strong> at a glance. Have your <strong>super fund</strong>{" "}
          (app or website), <strong>ATO</strong> details (e.g. myGov), and <strong>payroll</strong> figures
          ready.
        </p>
        <ul className="jess-landing__bullets">
          <li>
            <span className="jess-landing__bullet-icon" aria-hidden="true">
              ✦
            </span>
            <span className="jess-landing__bullet-text">
              See how much <strong>concessional room</strong> is left (with <strong>carry-forward</strong>{" "}
              rules simplified the way the app explains them).
            </span>
          </li>
          <li>
            <span className="jess-landing__bullet-icon" aria-hidden="true">
              ✦
            </span>
            <span className="jess-landing__bullet-text">
              Get a <strong>per-pay salary sacrifice</strong> idea for the rest of the year—handy if you want
              to <strong>max out</strong> without guesswork.
            </span>
          </li>
        </ul>
        <button type="button" className="jess-landing__cta" onClick={onOpenCalculator}>
          Open the calculator
          <span className="jess-landing__cta-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
