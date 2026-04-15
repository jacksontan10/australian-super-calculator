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
          Wondering how much <strong>extra salary sacrifice</strong> you could still tuck in this
          financial year—without accidentally blowing past your <strong>concessional cap</strong>? This
          little tool lines up employer super, what you already sacrifice, and anything you are
          thinking of adding, so you can see the headroom at a glance.
        </p>
        <ul className="jess-landing__bullets">
          <li>
            <span className="jess-landing__bullet-icon" aria-hidden="true">
              ✦
            </span>
            See how much concessional room is left (with carry-forward rules simplified the way the
            app explains them).
          </li>
          <li>
            <span className="jess-landing__bullet-icon" aria-hidden="true">
              ✦
            </span>
            Get a per-pay salary sacrifice idea for the rest of the year—handy if you want to max out
            without guesswork.
          </li>
          <li>
            <span className="jess-landing__bullet-icon" aria-hidden="true">
              ✦
            </span>
            Still only an educational estimate—not personal advice—so you stay in charge with your
            fund and the ATO as the real referees.
          </li>
        </ul>
        <button type="button" className="jess-landing__cta" onClick={onOpenCalculator}>
          Open the calculator
          <span className="jess-landing__cta-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <p className="jess-landing__footnote">
          Numbers stay in your browser (they auto-save locally). Tap the button whenever you are
          ready—no rush, no pressure, just maths wearing a slightly nicer outfit.
        </p>
      </div>
    </div>
  );
};
