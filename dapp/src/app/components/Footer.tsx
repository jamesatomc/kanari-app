// Footer.tsx
import { Github, X } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Logo & Copyright */}
          <span className="text-sm sm:text-center">
              © 2024{' '}
              <a href="https://kanari.network/" className="hover:underline">
                Kanari Network™
              </a>
              . community.
          </span>

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
              <FaDiscord className="h-5 w-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}