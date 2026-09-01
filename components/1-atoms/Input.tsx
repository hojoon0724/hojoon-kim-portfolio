interface InputProps {
  id: string;
  type: string;
  placeholder?: string;
  label?: string;
  autocomplete?: string;
  required?: boolean;
  disabled?: boolean;
  focus?: boolean;
  value?: string;
  className?: string;
  textAreaRows?: number;
  onChange: (value: string) => void;
}

export function Input({
  id,
  type,
  placeholder = " ",
  label,
  autocomplete,
  required,
  disabled,
  focus,
  value,
  className,
  textAreaRows = 5,
  onChange,
}: InputProps) {
  const isTextArea = type === "textarea";
  const commonFieldProps = {
    id,
    placeholder,
    autoComplete: autocomplete,
    required,
    disabled,
    autoFocus: focus,
    value,
    className: "peer w-full border-b px-0 pt-6 pb-2",
  };

  return (
    <div
      className={`floating-label-input-group relative flex h-full w-full flex-col ${className}`}
    >
      {isTextArea ? (
        <textarea
          {...commonFieldProps}
          onChange={(event) => onChange(event.target.value)}
          rows={textAreaRows}
        ></textarea>
      ) : (
        <input
          {...commonFieldProps}
          onChange={(event) => onChange(event.target.value)}
          type={type}
        />
      )}
      <label
        className="roboto-mono pointer-events-none absolute top-1/2 left-0 origin-top-left -translate-y-1/2 text-nowrap opacity-60 transition-all duration-300 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:origin-top-left peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:scale-75 peer-focus:top-0 peer-focus:origin-top-left peer-focus:translate-y-0 peer-focus:scale-75"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}
