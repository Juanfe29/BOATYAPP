'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={`glass glass-glow p-8 relative group overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                {children}
            </div>

            {/* Animated corner accent */}
            <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-white/30 to-transparent" />
            <div className="absolute top-0 right-0 h-12 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
    );
}
