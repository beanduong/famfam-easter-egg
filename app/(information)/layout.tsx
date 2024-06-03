export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="p-8 xl:w-1/2 md:w-2/3 w-full">{children}</section>;
}
