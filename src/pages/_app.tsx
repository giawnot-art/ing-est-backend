import '../styles/globals.css'; // Usa il percorso relativo invece di @/
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-slate-50">
       <Component {...pageProps} />
    </div>
  );
}
