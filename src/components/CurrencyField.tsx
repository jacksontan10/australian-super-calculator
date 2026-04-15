import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes
} from "react";

const sanitizeDecimalInput = (raw: string): string => {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) {
    return cleaned;
  }
  return `${cleaned.slice(0, firstDot + 1)}${cleaned.slice(firstDot + 1).replace(/\./g, "")}`;
};

const valueToPlainString = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "0";
  }
  const rounded = Math.round(value * 100) / 100;
  if (Object.is(rounded, -0)) {
    return "0";
  }
  return String(rounded);
};

const parsePartialDecimal = (s: string): number => {
  const t = sanitizeDecimalInput(s);
  if (t === "" || t === ".") {
    return 0;
  }
  if (t.endsWith(".")) {
    const base = t.slice(0, -1);
    if (base === "") {
      return 0;
    }
    const n = Number(base);
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
  }
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
};

const formatCurrency = (value: number): string =>
  value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

export interface CurrencyFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

export const CurrencyField = ({ value, onChange, onBlur, onFocus, ...rest }: CurrencyFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const displayValue = focused ? draft : formatCurrency(value);

  const handleFocus: InputHTMLAttributes<HTMLInputElement>["onFocus"] = (event) => {
    setFocused(true);
    setDraft(valueToPlainString(valueRef.current));
    onFocus?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = sanitizeDecimalInput(event.target.value);
    setDraft(next);
    onChange(parsePartialDecimal(next));
  };

  const handleBlur: InputHTMLAttributes<HTMLInputElement>["onBlur"] = (event) => {
    const finalValue = parsePartialDecimal(draft);
    onChange(finalValue);
    setFocused(false);
    setDraft("");
    onBlur?.(event);
  };

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={displayValue}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
