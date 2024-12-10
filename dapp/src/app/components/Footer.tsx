// Footer.tsx
import { Github, X } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Your Project. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}