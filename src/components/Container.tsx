export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-4 max-w-6xl mx-auto">
      {children}
    </div>
  );
}