import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Onchain Tic Tac Toe',
  description: 'Play a friend or the computer. Connect your wallet to save your record on Base.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
