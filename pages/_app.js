import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import "../app/globals.css"; // Ensure you have the correct path to your global CSS

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <div>
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
}

export default MyApp;
