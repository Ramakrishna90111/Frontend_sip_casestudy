export default function InputField({ props }) {
  return (
    <input
      className={props.className || "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500"}
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
