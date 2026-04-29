"use client";

import { motion, useReducedMotion } from "framer-motion";

const cards = ["Click", "Landing Page", "Intent Filter", "CRM", "Sales Call"];

export function PipelineVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="pipeline-visual" aria-label="Abstract real estate lead pipeline">
      <div className="pipeline-grid" />
      <div className="pipeline-orbit" />
      {cards.map((card, index) => (
        <motion.div
          className="pipeline-card"
          key={card}
          initial={false}
          animate={reduced ? undefined : { y: [0, index % 2 ? -8 : 8, 0] }}
          transition={{ duration: 5 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ ["--i" as string]: index }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{card}</strong>
        </motion.div>
      ))}
      <motion.div
        className="pipeline-pulse"
        animate={reduced ? undefined : { offsetDistance: ["0%", "100%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
