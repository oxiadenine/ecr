export default function Button(props) {
  const {
    className,
    style,
    type = "button",
    startIcon,
    endIcon,
    children,
    ...otherProps
  } = props;

  return (
    <button
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        columnGap: "8px",
        ...style
      }}
      type={type}
      {...otherProps}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
