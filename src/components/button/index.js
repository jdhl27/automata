import React from "react";
import "./styles.css";

function ButtonComponent({ text = "", onClick = () => null, style = {} }) {
  return (
    <div
      style={style}
      className="button"
      onClick={() => {
        onClick();
      }}
    >
      {text}
    </div>
  );
}

export default ButtonComponent;
