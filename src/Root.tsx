import { useEffect, useState } from "react";
import App from "./App";
import { JessLanding } from "./components/JessLanding";

const CALCULATOR_HASH = "#/calculator";

const viewFromHash = (): "landing" | "calc" =>
  typeof window !== "undefined" && window.location.hash === CALCULATOR_HASH ? "calc" : "landing";

export default function Root() {
  const [view, setView] = useState<"landing" | "calc">(viewFromHash);

  useEffect(() => {
    const sync = () => setView(viewFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.title =
      view === "landing" ? "Hey Jess · Super & salary sacrifice" : "Australian Super Contribution Calculator";
  }, [view]);

  const openCalculator = () => {
    window.location.hash = CALCULATOR_HASH;
  };

  const backHome = () => {
    if (window.location.hash) {
      window.location.hash = "";
    }
    setView("landing");
  };

  if (view === "landing") {
    return <JessLanding onOpenCalculator={openCalculator} />;
  }

  return <App onBackHome={backHome} />;
}
