export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4">{children}</div>;
}
