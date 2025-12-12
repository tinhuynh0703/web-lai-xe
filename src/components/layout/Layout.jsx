import { Header } from "./Header";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  );
}
