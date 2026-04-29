import React from 'react';
import { Link } from 'react-router-dom';

const SOCIAL = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/201000000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    bg: 'bg-[#25D366]',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/elvo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    bg: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@elvo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z"/>
      </svg>
    ),
    bg: 'bg-black',
  },
];

const Home: React.FC = () => (
  <main className="bg-[var(--bg-primary)]">

    {/* HERO */}
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden noise-bg">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[22vw] font-black text-[var(--text-primary)] opacity-[0.025] whitespace-nowrap">ELVO</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 mb-8 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-accent font-semibold text-xs tracking-[0.15em] uppercase">New Season Drop</span>
          </div>

          <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.9] mb-6">
            WEAR<br /><span className="text-accent">YOUR</span><br />PACE
          </h1>

          <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed mb-10">
            Premium streetwear built for those who move fast. Clean cuts, bold design, made to last.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/catalog">
              <button className="bg-accent text-white font-semibold px-8 py-4 rounded-full
                                 hover:bg-[var(--accent-hover)] transition-all duration-300
                                 hover:shadow-[0_0_30px_rgba(225,6,0,0.35)]">
                Shop Now
              </button>
            </Link>
            <Link to="/catalog">
              <button className="font-semibold px-8 py-4 rounded-full border border-[var(--border)]
                                 bg-[var(--surface)] hover:border-accent hover:text-accent transition-all duration-300">
                View Collection
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-[1px] h-12 bg-[var(--text-primary)] animate-pulse" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>

    {/* FEATURES */}
    <section className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          { title: 'Premium Quality', desc: 'Heavyweight cotton blends and performance fabrics that hold their shape wash after wash.' },
          { title: 'Bold Design', desc: 'Every piece is designed to stand out. Limited runs mean you stay ahead of the crowd.' },
          { title: 'Fast Dispatch', desc: 'Orders shipped within 24 hours. Straight to your door, no delays.' },
        ].map(item => (
          <div key={item.title} className="flex gap-5 items-start group">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center
                            group-hover:bg-accent transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-accent group-hover:bg-white transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1">{item.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="relative overflow-hidden bg-accent py-20 text-center noise-bg">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <p className="font-display text-6xl md:text-8xl text-white mb-4">JOIN THE CREW</p>
        <p className="text-white/80 mb-8 text-lg">Register now and get early access to new drops.</p>
        <Link to="/register">
          <button className="bg-white text-accent font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-colors">
            Create Account
          </button>
        </Link>
      </div>
    </section>

    {/* FOOTER with social */}
    <footer className="border-t border-[var(--border)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-display text-3xl">EL<span className="text-accent">VO</span></span>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Premium streetwear. Fast delivery.</p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIAL.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                title={s.name}
                className={`w-10 h-10 rounded-full ${s.bg} text-white flex items-center justify-center
                            hover:scale-110 hover:shadow-lg transition-all duration-200`}>
                {s.icon}
              </a>
            ))}
          </div>

          <div className="flex gap-6 text-sm text-[var(--text-secondary)]">
            <Link to="/catalog" className="hover:text-accent transition-colors">Shop</Link>
            <Link to="/orders"  className="hover:text-accent transition-colors">My Orders</Link>
            <Link to="/login"   className="hover:text-accent transition-colors">Account</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-secondary)]">
          © 2025 Elvo. All rights reserved.
        </div>
      </div>
    </footer>
  </main>
);

export default Home;
