import { cn } from '../../lib/utils';

const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-primary text-white',
    secondary: 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
    destructive: 'bg-danger text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    outline: 'text-gray-900 border border-gray-300 dark:text-gray-100 dark:border-gray-600',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Badge;
