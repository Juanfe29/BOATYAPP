'use client';

import { motion } from 'framer-motion';
import AntigravityScene from './AntigravityScene';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            <AntigravityScene />

            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-6 leading-tight">
                        SYNTHESIZE <span className="text-glow">CHAOS</span>.<br />
                        PREDICT <span className="text-white/40">CONTROL</span>.
                    </h1>

                    <p className="text-lg md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto font-sans tracking-wide">
                        Unified Data Intelligence & AI Forecasting for Enterprise.
                        The infrastructure of the future, suspended in precision.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-black font-display font-bold text-sm tracking-widest uppercase"
                        >
                            SEE THE INFRASTRUCTURE
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="px-8 py-4 border border-white/20 font-display font-bold text-sm tracking-widest uppercase backdrop-blur-sm"
                        >
                            OUR TECHNOLOGY
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.3em] font-display">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
        </section>
    );
}
