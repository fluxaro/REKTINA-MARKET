export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div className={`surface-card ${padding ? 'p-5' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}
