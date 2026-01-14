"use client";
import React, {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {NAV_LINKS, BRAND_COLORS} from '../../lib/data';
import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-18 md:h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Image
                        src="/images/logos/Logo_Holyann_ngang-removebg-preview.png"
                        alt="Holyann Logo"
                        width={150}
                        height={40}
                        className="cursor-pointer w-auto h-8 sm:h-9 md:h-10"
                        priority
                    />
                </div>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {NAV_LINKS.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href}
                            className="text-primary dark:text-primary-foreground hover:text-[var(--brand-blue)] dark:hover:text-accent transition-colors uppercase text-xs xl:text-sm tracking-wide font-bold whitespace-nowrap"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <a 
                        href="#contact"
                        className={`hidden sm:block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 whitespace-nowrap ${BRAND_COLORS.primaryGradient}`}
                    >
                        Đăng Ký Tư Vấn
                    </a>
                    <button 
                        className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-300" />
                        ) : (
                            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 absolute w-full left-0 right-0 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <nav className="px-4 sm:px-6 py-4 flex flex-col gap-2">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block text-primary dark:text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-base sm:text-lg uppercase"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className={`mt-2 px-4 py-3 rounded-lg text-white font-semibold text-sm shadow-lg text-center ${BRAND_COLORS.primaryGradient}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Đăng Ký Tư Vấn
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}