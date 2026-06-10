import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? { whileHover: { y: -4 }, transition: { duration: 0.2 } }
    : {};

  return (
    <Component
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
