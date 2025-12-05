export default function Input(props) {
  const {
    className,
    style,
    startIcon,
    endIcon,
    ...otherProps
  } = props;

  return (
    <div className={className} style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      columnGap: "8px",
      ...style
    }}>
      {startIcon}
      <input
        style={{ width: "100%", margin: 0, padding: 0 }}
        {...otherProps}
      />
      {endIcon}
    </div>
  );
}
