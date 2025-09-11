import PropTypes from "prop-types";

export default function Input(props) {
  const { type = "text" } = props;

  PropTypes.checkPropTypes(Input.propTypes, props, "prop", Input.name);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      columnGap: "8px",
      padding: "8px"
    }} className={props.className}>
      {props.startIcon}
      <input
        id={props.id}
        name={props.name}
        type={type}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
        style={{ width: "100%", margin: 0, padding: 0 }}
      />
      {props.endIcon}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.oneOf(["text", "number", "password", "file"]),
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  startIcon: PropTypes.object,
  endIcon: PropTypes.object
};
