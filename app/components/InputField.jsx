export default function InputField({ props }) {
  return (
    <input
      className={props.className || "w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3.5 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"}
      placeholder={props.placeholder}
      type={props.type}
      value={props.value}
      name={props.name}
      required={props.required}
      onChange={(event)=>{
        props.inputValue(event.target.value);
      }}
    />
  );
}
