"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type RadioDrawerProps = {
  cards: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onHoverClose: () => void;
  reduceMotion: boolean;
  subtitle: string;
  title: string;
};

export function RadioDrawer({
  cards,
  children,
  isOpen,
  onClose,
  onHoverClose,
  reduceMotion,
  subtitle,
  title,
}: RadioDrawerProps) {
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="radio-drawer-backdrop"
            aria-label="Close radio drawer"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={
          isOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : reduceMotion
              ? { opacity: 0, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.985 }
        }
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`radio-drawer-anchor ${isOpen ? "radio-drawer-anchor-open" : "radio-drawer-anchor-closed"}`}
        aria-hidden={!isOpen}
      >
        <div className="radio-drawer wii-scrollbar">
          <div className="radio-drawer-header">
            <div>
              <div className="radio-panel-kicker">{title}</div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              onMouseEnter={onHoverClose}
              className="wii-btn group h-10 w-10 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-400"
              aria-label="Close radio drawer"
            >
              <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          <div className="grid gap-2.5 md:grid-cols-2">{cards}</div>
          <div className="mt-4">{children}</div>
        </div>
      </motion.div>
    </>
  );
}
