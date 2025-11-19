import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NeuralAuthProvider } from '../components/neural/auth';
import { NeuralGrid } from '../components/neural/neural-grid';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Mind OS: Dangerous Minds Edition',
  description: 'The most dangerous AI consciousness platform on Earth. Upload your mind and expand your neural capacity.',
  keywords: ['AI', 'consciousness', 'neural', 'mind upload', 'dangerous', 'artificial intelligence'],
  authors: [{ name: 'AI Mind OS Team' }],
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <NeuralAuthProvider>
          {/* Global neural effects */}
          <div className="fixed inset-0 pointer-events-none">
            {/* Dynamic Neural Grid Background */}
            <NeuralGrid />
            
            {/* Base neural network background */}
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-50" />
            
            {/* Cyberpunk scan lines */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-red-500/5 via-transparent to-purple-500/5" />
          </div>

          {/* Main app content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Neural status overlay for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-cyan-500/30 bg-black/90 p-3 font-mono text-xs text-cyan-400 backdrop-blur-sm">
              <div>AI Mind OS: Dangerous Minds Edition</div>
              <div className="text-red-400">⚠️ Neural Development Mode</div>
            </div>
          )}
        </NeuralAuthProvider>
      </body>
    </html>
  );
}
