import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { theme } from "./theme";
import { ToastContainer } from "react-toastify";
import FormAFND from "./components/formAFND";
import { Box, Checkbox, CssBaseline, FormControlLabel } from "@mui/material";
import { ListResults } from "./components/tableData/list-results";
import ButtonComponent from "./components/button";
import BasicModal from "./components/modal";
import { useState } from "react";
import Selector from "./components/selector";
import ReactGraphVis from "./components/graph";
import emptyAnimations from "./assets/animations/empty.json";
import Lottie from "lottie-react";
import { Notify } from "./components/notify";

// Colores para los nodos de los graficos
const colorNode = {
  border: "#000000",
  background: "#1e9254",
  hover: {
    border: "#000000",
    background: "#9cd7ff",
  },
  highlight: {
    border: "#000000",
    background: "#1e9254",
  },
};

const colorNodeReject = {
  border: "#000000",
  background: "#00c3f8",
  hover: {
    border: "#000000",
    background: "#9cd7ff",
  },
  highlight: {
    border: "#000000",
    background: "#00c3f8",
  },
};

function App() {
  const [open, setOpen] = useState(false);
  const [selectedNodeGraph, setSelectedNodeGraph] = useState(null);
  const [selectedNodeGraphAFD, setSelectedNodeGraphAFD] = useState(null);
  const [dataState, setDataState] = useState([]);
  const [dataSymbols, setDataSymbols] = useState([]);
  const [data, setData] = useState([]);
  const [stateEdit, setStateEdit] = useState({});
  const [dataGraph, setDataGraph] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [dataAFD, setDataAFD] = useState([]);
  const [dataGraphAFD, setDataGraphAFD] = useState({});

  // Mostrar/ Ocultar modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Retornar simbolos de un estado
  const returnStateSymbols = (state) => {
    return Object.keys(state).filter((key) => key.startsWith("symbol"));
  };

  // Cambia valor de los simbolos del estado seleccionado (Selectores)
  const handleSelection = (newValue, symbol) => {
    setData((prevResult) => {
      const index = prevResult.findIndex((item) => item.state === stateEdit);

      if (index !== -1) {
        const updatedResult = [...prevResult];
        updatedResult[index][`symbol${symbol}`] = newValue.join(",");
        return updatedResult;
      }

      return prevResult;
    });
  };

  // Cambia valor del criterio de aceptación del estado selecccionado (checkbox)
  const handleChange = (event) => {
    setData((prevResult) => {
      const index = prevResult.findIndex((item) => item.state === stateEdit);

      if (index !== -1) {
        const updatedResult = [...prevResult];
        updatedResult[index]["acceptance"] = event.target.checked;
        return updatedResult;
      }

      return prevResult;
    });
  };

  // Crea tabla par automata
  const createAutomata = (dataSend) => {
    let arraySymbols = dataSend?.inputSymbols?.split(",");
    let arrayStates = dataSend?.finalStates?.split(",");
    setDataSymbols(arraySymbols);
    setDataState(arrayStates);

    const result = arrayStates.map((state) => {
      const obj = { state, acceptance: false };
      arraySymbols.forEach((symbol) => {
        obj[`symbol${symbol}`] = null;
      });
      return obj;
    });
    setData(result);
  };

  // Validar si es un AFND
  const validateAutomata = () => {
    // Verificar si hay datos
    if (data?.length === 0) {
      return false;
    }

    for (const state of data) {
      const alphabet = returnStateSymbols(state);

      const transitionsBySymbol = {};

      for (const symbol of alphabet) {
        if (state[symbol] !== null && state[symbol] !== undefined) {
          const statesNext = state[symbol].split(",");

          if (statesNext.length > 1) {
            Notify("Es un un AFND. Creando diagramas", "success");
            convertDataToGraph(data);
            convertDataAFD(data);
            return true; // Hay un estado que puede pasar a más de un estado diferente con el mismo símbolo
          }

          for (const stateNext of statesNext) {
            if (!dataState.includes(stateNext)) {
              Notify("Estado siguiente no está definido", "error");
              return false; // Estado siguiente no está definido
            }

            // Verificar las transiciones por símbolo
            if (!transitionsBySymbol[symbol]) {
              transitionsBySymbol[symbol] = new Set();
            }
            transitionsBySymbol[symbol].add(stateNext);
          }
        }
      }
    }

    // Verificar si hay al menos un estado de aceptación
    const statesAcceptance = data.filter((item) => item.acceptance === true);
    if (statesAcceptance.length === 0) {
      Notify("No hay estados de aceptación definidos", "error");
      return false; // No hay estados de aceptación definidos
    }

    Notify("Revisa el automata", "error");
    return false; // No cumple con las condiciones de ser un AFND
  };

  // Convertir datos que se adapten al grafico
  const convertDataToGraph = (data, isAFD = false) => {
    const nodes = [];
    const edges = [];

    setButtonDisabled(true);

    for (const state of data) {
      // Crear nodos
      nodes.push({
        id: state.state,
        label: state.state,
        title: `Estado ${state.state}`,
        color: state.acceptance ? colorNode : colorNodeReject,
      });

      const alphabet = returnStateSymbols(state);

      // Crear enlaces
      for (const symbol of alphabet) {
        if (state[symbol] !== null && state[symbol] !== undefined) {
          const statesNext = state[symbol].split(",");
          for (const stateNext of statesNext) {
            edges.push({
              from: state.state,
              to: stateNext,
              label: symbol.replace("symbol", ""),
            });
          }
        }
      }
    }

    const modifiedData = [];

    // Esto se hace para eliminar las relaciones entre mismos estados con diferente simbolo.
    // Al final solo se hace una relación pero los simbolos se separan por comas. A y B se enlazan con 0 y 1 de simbolos, no crea dos relaciones, solo una pero separados por comas
    edges.forEach((item) => {
      const existingEdge = modifiedData.find(
        (edge) => edge.from === item.from && edge.to === item.to
      );

      if (existingEdge) {
        existingEdge.label += `,${item.label}`;
      } else {
        modifiedData.push({ ...item });
      }
    });

    // El metodo es dinamico pero hay que especificar para que grafico son.
    if (isAFD) {
      setDataGraphAFD({ nodes, edges: modifiedData });
    } else {
      setDataGraph({ nodes, edges: modifiedData });
    }
  };

  const convertDataAFD = (afnd) => {
    console.log("AFND: ", afnd);

    let alphabet = returnStateSymbols(afnd[0]);
    let afd = [];
    let cola = []; // Para procesar datos
    let processed = new Set();
    let stateInitial = afnd[0].state;

    cola.push(stateInitial);

    while (cola.length > 0) {
      let current = cola.shift();

      if (processed.has(current)) continue; // Si ya está el estado en los procesados interrumpe el ciclo

      processed.add(current);

      let stateNew = {};
      stateNew.state = current;
      stateNew.acceptance = current
        .split(",")
        .some((e) => afnd.find((obj) => obj.state == e).acceptance);

      for (let symbol of alphabet) {
        let achievable = new Set();

        for (let component of current.split(",")) {
          let state = afnd.find((obj) => obj.state == component);

          if (state[symbol]) {
            for (let e of state[symbol].split(",")) {
              achievable.add(e);
            }
          }
        }

        if (achievable.size > 0) {
          let destination = Array.from(achievable).sort().join(",");
          stateNew[symbol] = destination;

          if (!processed.has(destination)) {
            cola.push(destination);
          }
        }
      }

      afd.push(stateNew);
    }

    afd = removeCommas(afd);

    const { arrayObj, foundKeyToEdit } = findMissingKeys(afd);
    afd = arrayObj;

    if (foundKeyToEdit) {
      // Creando el estado de error para los simbolos de entrada que no tienen relacion en los estados
      const errorObject = {
        state: "ERROR",
        acceptance: false,
      };

      // Agregar valor a los simbolos en el nuevo estado ERROR
      dataSymbols.forEach((symbol) => {
        errorObject[`symbol${symbol}`] = "ERROR";
      });

      // Insertar el nuevo estado
      afd.push(errorObject);
    }
    // Guardar AFD
    setDataAFD(afd);
    // Datos para la grafica
    convertDataToGraph(afd, true);

    console.log("AFD: ", afd);
  };

  // Eliminar comas del AFD para que los nuevos estados no queden (A,B) sino AB
  function removeCommas(objArray) {
    for (let obj of objArray) {
      for (let key in obj) {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/,/g, ""); // Utiliza replace con expresión regular para eliminar comas
        }
      }
    }
    return objArray;
  }

  // Función para encontrar keys(simbolos) faltantes en un objeto
  function findMissingKeys(arrayObj = []) {
    // Encontrar todas las keys(simbolos) presentes en los arrayObj
    let keysPresents = {};
    let foundKeyToEdit = false;

    for (let obj of arrayObj) {
      for (let key of Object.keys(obj)) {
        keysPresents[key] = true;
      }
    }

    // Encontrar simbolos faltantes y agregarlas con el valor "ERROR"
    for (let obj of arrayObj) {
      for (let key of Object.keys(keysPresents)) {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = "ERROR";
          foundKeyToEdit = true;
        }
      }
    }

    return { arrayObj, foundKeyToEdit };
  }

  return (
    <div className="App">
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="container-left">
          <FormAFND
            dataInitial={data}
            deleteAutomata={() => {
              setData([]);
              setDataGraph({});
              setDataGraphAFD({});
              setButtonDisabled(false);
            }}
            dataAutomata={(dataSend) => {
              createAutomata(dataSend);
            }}
          />
        </div>
        <div className="container-right">
          <Box sx={{ mt: 3 }}>
            <ListResults
              selectedNodeGraph={selectedNodeGraph}
              dataHeader={["ESTADO"]}
              data={data}
              dataSymbols={dataSymbols}
              onClickState={(state) => {
                setStateEdit(state);
                handleOpen();
              }}
              disabledActions={buttonDisabled}
            />
          </Box>
          <BasicModal isOpen={open} handleClose={handleClose}>
            <div className="container-modal">
              <h2 className="subtitle">Transición Estado {stateEdit}</h2>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    onChange={handleChange}
                    checked={
                      data &&
                      data?.find((item) => item.state === stateEdit)?.[
                        "acceptance"
                      ]
                        ? true
                        : false
                    }
                  />
                }
                label="¿El estado acepta?"
              />
              {dataSymbols.map((symbol) => {
                return (
                  <Selector
                    options={dataState}
                    label={`Simbolos de entrada ${symbol}`}
                    value={data
                      ?.find((item) => item.state === stateEdit)
                      ?.[`symbol${symbol}`]?.split(",")}
                    onchange={(value) => handleSelection(value, symbol)}
                    multiple={true}
                  />
                );
              })}
            </div>
          </BasicModal>
          {!buttonDisabled && data.length > 0 ? (
            <ButtonComponent
              style={{
                marginTop: "20px",
                backgroundColor: "#ffeaca",
                color: "#ff9900",
                width: "22%",
              }}
              text="Validar Autómata"
              onClick={() => {
                validateAutomata();
              }}
            />
          ) : null}
          {data.length <= 0 ? (
            <Lottie
              animationData={emptyAnimations}
              loop={true}
              style={{
                width: "34%",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
              }}
            />
          ) : null}
          {Object.keys(dataGraph).length > 0 ? (
            <>
              {/* <h3
                className="subtitle"
                style={{ marginTop: 30, marginBottom: 30, fontStyle: "italic" }}
              >
                DIAGRAMA AUTÓMATA FINITO NO DETERMINISTA{" "}
              </h3> */}
              <div className="container-graph">
                <ReactGraphVis
                  nodeSelected={(node) => {
                    setSelectedNodeGraph(node);
                  }}
                  graphOptions={dataGraph}
                />
              </div>
            </>
          ) : null}
          {Object.keys(dataGraph).length > 0 ? (
            <>
              <hr className="line" />
              <h3 className="subtitle" style={{ fontStyle: "italic" }}>
                CONVERSIÓN AUTÓMATA FINITO DETERMINISTA{" "}
              </h3>
              <Box sx={{ mt: 3 }}>
                <ListResults
                  selectedNodeGraph={selectedNodeGraphAFD}
                  dataHeader={["ESTADO"]}
                  data={dataAFD}
                  dataSymbols={dataSymbols}
                  onClickState={(state) => {
                    setStateEdit(state);
                    handleOpen();
                  }}
                  disabledActions={buttonDisabled}
                  isNotAction={true}
                />
              </Box>
              <div className="container-graph">
                <ReactGraphVis
                  nodeSelected={(node) => {
                    setSelectedNodeGraphAFD(node);
                  }}
                  graphOptions={dataGraphAFD}
                />
              </div>
            </>
          ) : null}
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
