import React, { useState } from "react";
import Input from "../input";
import ButtonComponent from "../button";
import "./styles.css";
import { Notify } from "../notify";

const expRegular = /^(?:[A-Za-z0-9]{1,4},){1,5}[A-Za-z0-9]{1,4}$/;

function FormAFND({
  dataInitial = [],
  deleteAutomata = () => null,
  dataAutomata = () => null,
}) {
  const [data, setData] = useState({});

  const validateAutomata = () => {
    if (!data?.inputSymbols || !data?.finalStates) {
      Notify("Debe llenar todos los campos", "error");
      return;
    }

    if (!expRegular.test(data?.inputSymbols)) {
      Notify("Revisa los simbolos porque no cumple las condiciones", "error");
      Notify("Ejemplo válido: A,B,D,G,Q,J");
      return;
    }

    if (!expRegular.test(data?.finalStates)) {
      Notify("Revisa los estados porque no cumple las condiciones", "error");
      Notify("Ejemplo válido: A,B,D,G,Q,J");
      return;
    }

    let arraySymbols = data?.inputSymbols?.split(",");
    if (arraySymbols.length !== new Set(arraySymbols).size) {
      Notify("No se pueden repetir simbolos", "error");
      return;
    }

    let arrayState = data?.finalStates?.split(",");
    if (arrayState.length !== new Set(arrayState).size) {
      Notify("No se pueden repetir estados", "error");
      return;
    }

    dataAutomata(data);
  };

  const generateInfo = () => {
    Notify(`
    1). Solo se permiten letras y números\n
    2). Cada valor debe estar separado por una coma\n
    3). No debe terminar con una coma\n
    4). Cada valor no debe exceder los 4 caracteres\n
    5). Se requieren al menos 2 valores, excluyendo los separados por comas\n
    6). Como máximo puede contener 6 valores
`);
  };

  return (
    <div className="container-logo-form">
      <h2 className="subtitle" style={{ textAlign: "center" }}>
        AUTÓMATA FINITO NO DETERMINISTA{" "}
      </h2>
      <span
        style={{
          textDecoration: "underline",
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={generateInfo}
      >
        info
      </span>

      <div className="form">
        <Input
          disabled={dataInitial.length > 0}
          type="text"
          placeholder="Ej: 0,1"
          label="Simbolos de entrada (Separados por coma)"
          autofocus={true}
          onchange={(value) => {
            setData({
              ...data,
              inputSymbols: value,
            });
          }}
        />

        <Input
          disabled={dataInitial.length > 0}
          type="text"
          placeholder="Ej: A,B,C"
          label="Estados (Separados por coma)"
          onchange={(value) => {
            setData({
              ...data,
              finalStates: value,
            });
          }}
        />

        {!dataInitial || dataInitial.length <= 0 ? (
          <ButtonComponent
            style={{ marginTop: "20px" }}
            text="Crear tabla"
            onClick={() => {
              validateAutomata();
            }}
          />
        ) : (
          <ButtonComponent
            style={{ marginTop: "20px", backgroundColor: "#ff3f48" }}
            text="Reiniciar Autómata"
            onClick={() => {
              deleteAutomata();
            }}
          />
        )}
      </div>
      <hr className="line" />
    </div>
  );
}

export default FormAFND;
