import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon — Konaverse',
  description: 'Konaverse is a premium digital agency based in Cyprus. Something exceptional is coming.',
  robots: 'noindex, nofollow',
};

export default function ComingSoonPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-reveal {
          opacity: 0;
          animation: revealUp 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .delay-1 { animation-delay: 100ms; }
        .delay-2 { animation-delay: 200ms; }
        .delay-3 { animation-delay: 300ms; }
        .delay-4 { animation-delay: 400ms; }
        .delay-5 { animation-delay: 500ms; }
        .delay-6 { animation-delay: 600ms; }
      `}} />
      <div className="fixed inset-0 z-[99999] bg-[#111111] overflow-y-auto overflow-x-hidden">
        <div className="min-h-[100dvh] w-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
          
          {/* Top Left: Archive Label */}
          <div className="flex justify-start items-start animate-reveal delay-1 w-full shrink-0">
            <div className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-[#6b7f62]">
              01 — KONAVERSE
            </div>
          </div>

          {/* Middle Section: Main Content */}
          <div className="flex-1 flex flex-col justify-center items-start w-full py-16 xl:pl-24 2xl:pl-32">
            <h1 
              className="text-[#faf7f2] font-extrabold text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] tracking-tight leading-[1.05] animate-reveal delay-2"
              style={{ fontFamily: 'var(--font-monument), sans-serif', fontWeight: 800 }}
            >
              Something<br />
              Exceptional<br />
              Is Coming.
            </h1>

            <div className="mt-8 md:mt-12 animate-reveal delay-3">
              <div className="w-10 h-[1px] bg-[#6b7f62] mb-5 md:mb-6"></div>
              <p className="font-sans font-light text-base md:text-lg text-[#b6a492]">
                We&apos;re crafting it with intention.
              </p>
            </div>

            <div className="mt-8 md:mt-10 animate-reveal delay-4">
              <a 
                href="mailto:info@kona-verse.com" 
                className="font-mono text-sm tracking-[0.15em] text-[#c8b4a0] hover:text-[#faf7f2] transition-colors duration-300 block w-fit"
              >
                info@kona-verse.com
              </a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full space-y-8 md:space-y-0 text-xs font-mono uppercase tracking-[0.2em] shrink-0">
            {/* Bottom Left: Socials */}
            <div className="flex items-center space-x-6 animate-reveal delay-5">
              <a 
                href="https://www.instagram.com/konaverse.cy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#faf7f2] hover:text-[#6b7f62] transition-colors duration-300"
              >
                INSTAGRAM
              </a>
              <span className="text-[#6b7f62]/30">/</span>
              <a 
                href="https://www.facebook.com/konaverse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#faf7f2] hover:text-[#6b7f62] transition-colors duration-300"
              >
                FACEBOOK
              </a>
            </div>
            
            {/* Bottom Right: Archive Reference */}
            <div className="text-[#b6a492] opacity-40 animate-reveal delay-6 tracking-[0.2em]">
              Archive_Ref: CS_01
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
