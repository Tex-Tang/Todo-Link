const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  return (
    <button
      className={
        "text-white text-xl p-1 focus:outline-none border border-transparent focus:border-white rounded-md " + className
      }
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
