type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
export default function Input({ label, ...props }: Props) {
  return (
    <label className="block">
      {label && <div className="label">{label}</div>}
      <input className="input" {...props} />
    </label>
  );
}
