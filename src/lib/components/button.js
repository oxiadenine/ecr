import PropTypes from "prop-types";

export default function Button(props) {
  const { type = "button" } = props;

  PropTypes.checkPropTypes(Button.propTypes, props, "prop", Button.name);

  return (
    <button
      id={props.id}
      name={props.name}
      type={type}
      disabled={props.disabled}
      onClick={props.onClick}
      className={props.className}
      style={{
        display: "flex",
        alignItems: "center",
        columnGap: "8px"
      }}
    >
      {props.startIcon}
      {props.children}
      {props.endIcon}
    </button>
  );
}

Button.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.oneOf(["button", "reset", "submit"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  startIcon: PropTypes.object,
  endIcon: PropTypes.object
};
