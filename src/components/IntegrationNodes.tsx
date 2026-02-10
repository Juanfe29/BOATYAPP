'use client';

import { motion } from 'framer-motion';
import { Database, Cpu, LayoutDashboard, Share2 } from 'lucide-react';

const nodes = [
    { id: 'CRM', icon: Database, label: 'CRM', x: '10%', y: '20%' },
    { id: 'POS', icon: LayoutDashboard, label: 'POS', x: '20%', y: '70%' },
    { id: 'ERP', icon: Cpu, label: 'ERP', x: '50%', y: '40%' },
    { id: 'MODEL', icon: Share2, label: 'FORECAST MODEL', x: '85%', y: '50%', main: true },
];

export default function IntegrationNodes() {
    return (
        <div className="relative w-full h-[400px] border border-white/5 bg-black/40 overflow-hidden rounded-3xl">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90base,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full">
                {nodes.filter(n => !n.main).map((node, i) => (
                    <motion.line
                        key={i}
                        x1={node.x}
                        y1={node.y}
                        x2="85%"
                        y2="50%"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                    />
                ))}
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => (
                <motion.div
                    key={node.id}
                    style={{ left: node.x, top: node.y }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group`}
                >
                    <div className={`p-4 rounded-xl backdrop-blur-md border ${node.main ? 'bg-white border-white' : 'bg-white/5 border-white/10 group-hover:border-white/40 transition-colors'}`}>
                        <node.icon className={`w-6 h-6 ${node.main ? 'text-black' : 'text-white'}`} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-display text-white/40 group-hover:text-white transition-colors">
                        {node.label}
                    </span>

                    {node.main && (
                        <div className="absolute inset-0 -z-10 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
