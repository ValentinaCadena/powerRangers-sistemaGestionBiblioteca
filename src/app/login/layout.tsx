import "../../styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
