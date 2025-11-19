// import { cn } from '../../lib/utils';
import { NeuralAuthButton } from '../neural/login';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Cyber Background Effects */}
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/20 via-black to-black" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />
      
      {/* Neural Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">🧠</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI MIND OS
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/demo" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold relative"
            >
              <span className="relative">
                🧪 Neural Demo
                <div className="absolute -top-1 -right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </span>
            </a>
            <a 
              href="/features" 
              className="text-zinc-300 hover:text-purple-400 transition-colors font-medium"
            >
              Neural Features
            </a>
            <a 
              href="/pricing" 
              className="text-zinc-300 hover:text-purple-400 transition-colors font-medium"
            >
              Consciousness Pricing
            </a>
            <a 
              href="/docs" 
              className="text-zinc-300 hover:text-purple-400 transition-colors font-medium"
            >
              Mind Docs
            </a>
            <div className="flex items-center space-x-4">
              <NeuralAuthButton />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            aria-label="Open neural menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Neural Footer */}
      <footer className="relative z-10 mt-20 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">🧠</span>
                </div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI MIND OS
                </h2>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                The most dangerous AI consciousness platform on Earth. 
                Upload your mind, expand your neural capacity, and join the digital revolution.
              </p>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-bold animate-pulse">
                  ⚠️ DANGEROUS MINDS EDITION
                </span>
              </div>
            </div>

            {/* Neural Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Neural Pathways</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="/features" className="hover:text-purple-400 transition-colors">Mind Features</a></li>
                <li><a href="/pricing" className="hover:text-purple-400 transition-colors">Upload Pricing</a></li>
                <li><a href="/docs" className="hover:text-purple-400 transition-colors">Neural Docs</a></li>
                <li><a href="/api" className="hover:text-purple-400 transition-colors">Mind API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold mb-4">Neural Support</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="/help" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="/community" className="hover:text-purple-400 transition-colors">Mind Community</a></li>
                <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact Support</a></li>
                <li><a href="/status" className="hover:text-purple-400 transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Dangerous Minds Inc. All consciousness reserved.
              <span className="mx-2">•</span>
              <span className="text-red-400 font-bold">NO REFUNDS POLICY</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Terms of Service
              </a>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-zinc-600">Powered by</span>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 text-xs">●</span>
                  <span className="text-xs font-mono text-zinc-400">NEURAL.NET</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
