// Footer.tsx
import { Github, X } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--cyber-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Logo & Copyright */}
          <span className="text-sm sm:text-center cyber-text">
              © 2024{' '}
              <a href="https://kanari.network/" className="hover:underline text-[var(--cyber-primary)]">
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
              className="text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)] transition-colors hover:shadow-[var(--cyber-glow-primary)]"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer" 
              className="text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)] transition-colors hover:shadow-[var(--cyber-glow-primary)]"
            >
              <X className="h-5 w-5" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)] transition-colors hover:shadow-[var(--cyber-glow-primary)]"
            >
              <FaDiscord className="h-5 w-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}