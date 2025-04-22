'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Footer: React.FC<FooterProps> = ({ darkMode, setDarkMode }) => {
  const [discordHover, setDiscordHover] = useState(false);
  const [blueskyHover, setBlueskyHover] = useState(false);
  const [githubHover, setGithubHover] = useState(false);

  return (
    <div className="pt-4 px-4 pb-4">
      <footer className={`backdrop-blur-sm ${darkMode
        ? 'bg-gray-900/90 text-gray-100 border border-indigo-700/30'
        : 'bg-white/90 text-gray-800 border border-red-300/30'
        } rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300 relative overflow-hidden`}>
        
        {/* Japanese-inspired decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/80 via-indigo-500/60 to-red-500/80"></div>
        
        {/* Japanese wave pattern (seigaiha) */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-repeat-x opacity-5" 
             style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTAwIj48cGF0aCBmaWxsPSIjOEI1Q0YwIiBkPSJNMCAwQzUwIDAgNTAgNTAgMCAxMDBIMjAwQzE1MCAxMDAgMTUwIDUwIDIwMCAwSDBaIi8+PC9zdmc+')"}}>
        </div>
        
        {/* Asanoha pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-repeat opacity-5"
             style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMEwwIDIwaDIwTDAgNDBoMjBsMjAtMjBIMjBMNDAgMEgyMHoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIxIj48L3BhdGg+PC9zdmc+')"}}>
        </div>

        <div className="mx-auto w-full max-w-screen-xl py-6 lg:py-8 relative">
          {/* Logo Section */}
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0 group">
              <Link href="/" className="flex items-center">
                <div className="relative">
                  {/* Decorative "stamp" effect behind logo */}
                  <div className={`absolute inset-0 rounded-full ${darkMode ? 'bg-red-500/10' : 'bg-red-500/5'}`}></div>
                  <Image
                    src="/Kari.svg"
                    className="h-10 w-10 mr-3 transform group-hover:rotate-6 transition-transform relative z-10"
                    alt="KanariLogo"
                    width={40}
                    height={40}
                  />
                </div>
                <span className={`text-2xl font-bold bg-gradient-to-r ${darkMode 
                  ? 'from-red-400 to-indigo-400' 
                  : 'from-red-600 to-indigo-600'} 
                  bg-clip-text text-transparent transition-all duration-300`}>
                  Kanari Network
                </span>
              </Link>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16">

              {/* Resources */}
              <div className="space-y-5">
                <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center
                  ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  <span className="w-1 h-4 mr-2 rounded-full bg-current"></span>
                  Resources
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a href="/DeveloperPortal" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Developer Portal
                    </a>
                  </li>
                  <li>
                    <a href="https://docs.kanari.site/" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Docs
                    </a>
                  </li>
                  <li>
                    <a href="https://karimove.kanari.site/" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Kari Move
                    </a>
                  </li>
                  <li>
                    <a href="https://whitepaper.kanari.site/" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Whitepaper
                    </a>
                  </li>
                  <li>
                    <a href="https://kanarinet.slack.com/" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Developer forum
                    </a>
                  </li>
                </ul>
              </div>

              {/* Solutions */}
              <div className="space-y-5">
                <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center
                  ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  <span className="w-1 h-4 mr-2 rounded-full bg-current"></span>
                  Solutions
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a href="https://github.com/jamesatomc/walletkari" className="inline-block hover:translate-x-1 transition-transform hover:text-indigo-500 decoration-2 underline-offset-4">
                      Kanari Pay soon
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-block hover:translate-x-1 transition-transform hover:text-indigo-500 decoration-2 underline-offset-4">
                      AI soon
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/kanari-network/kanari-sdk" className="inline-block hover:translate-x-1 transition-transform hover:text-indigo-500 decoration-2 underline-offset-4">
                      Kanari SDK
                    </a>
                  </li>
                </ul>
              </div>

              {/* About */}
              <div className="space-y-5">
                <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center
                  ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  <span className="w-1 h-4 mr-2 rounded-full bg-current"></span>
                  About
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a href="/KanariFoundation" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Kanari Foundation
                    </a>
                  </li>
                  <li>
                    <a href="/MediaKit" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Media Kit
                    </a>
                  </li>
                  <li>
                    <a href="/Team" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Team
                    </a>
                  </li>
                  <li>
                    <a href="https://blog.kanari.site/" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/PrivacyPolicy" className="inline-block hover:translate-x-1 transition-transform hover:text-red-500 decoration-2 underline-offset-4">
                      PrivacyPolicy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider - Japanese style with mon pattern */}
          <div className="my-8 flex items-center">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
            <div className={`px-4 ${darkMode ? 'text-red-400/50' : 'text-red-600/50'}`}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/>
                <path d="M12,6a6,6,0,1,0,6,6A6,6,0,0,0,12,6Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          </div>

          {/* Copyright and Social */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className={`text-sm sm:text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} relative inline-block`}>
              © 2025{' '}
              <Link href="/" className={`${darkMode ? 'text-white' : 'text-gray-900'} hover:text-red-500 transition-colors`}>
                Kanari Network™
              </Link>
              <span className="relative inline-flex items-center">
                <span className="mx-1">·</span> community 
                <span className="ml-1 text-xs opacity-70">コミュニティ</span>
              </span>
            </span>

            <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-6">
              {/* Social icons with Japanese-style hover effect */}
              {/* Bluesky */}
              <a
                href="https://bsky.app/profile/kanari.site"
                className="relative group"
                onMouseEnter={() => setBlueskyHover(true)}
                onMouseLeave={() => setBlueskyHover(false)}
              >
                <div className={`absolute -inset-2 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300`}></div>
                <Image
                  src="/Bluesky_Logo.svg"
                  alt="Bluesky Logo"
                  width={20}
                  height={20}
                  className={`w-5 h-5 relative z-10 transition-transform duration-300 ${blueskyHover ? 'transform scale-125' : ''}`}
                />
                <span className="sr-only">Bluesky profile</span>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/QU6fTacXab"
                className="relative group"
                onMouseEnter={() => setDiscordHover(true)}
                onMouseLeave={() => setDiscordHover(false)}
              >
                <div className={`absolute -inset-2 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-all duration-300`}></div>
                <svg
                  className={`w-5 h-5 relative z-10 transition-transform duration-300 ${discordHover ? 'transform scale-125' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 21 16"
                >
                  <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                </svg>
                <span className="sr-only">Discord community</span>
              </a>

              {/* Github */}
              <a
                href="https://github.com/kanari-network"
                className="relative group"
                onMouseEnter={() => setGithubHover(true)}
                onMouseLeave={() => setGithubHover(false)}
              >
                <div className={`absolute -inset-2 rounded-full bg-gray-500/0 group-hover:bg-gray-500/10 transition-all duration-300`}></div>
                <svg
                  className={`w-5 h-5 relative z-10 transition-transform duration-300 ${githubHover ? 'transform scale-125' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/80 via-red-500/60 to-indigo-500/80"></div>
      </footer>
    </div>
  );
};

export default Footer;