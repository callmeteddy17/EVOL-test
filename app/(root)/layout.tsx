import Navbar from './components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className=" w-full">
        <Navbar></Navbar>
      </div>
      {children}
    </div>
  );
}
