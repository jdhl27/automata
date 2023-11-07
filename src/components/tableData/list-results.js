import { BiSolidEdit } from "react-icons/bi";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "./styles.css";

export const ListResults = ({
  data = [],
  dataHeader = [],
  dataSymbols = [],
  onClickState = () => null,
  selectedNodeGraph = null,
  disabledActions = false,
  isNotAction = false,
  ...rest
}) => {
  const renderDataRow = (item) => {
    return (
      <>
        <TableCell>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography color="textPrimary" variant="body1">
              {item.state}
            </Typography>
          </Box>
        </TableCell>
        {dataSymbols?.map((symbol, i) => {
          return (
            <TableCell key={i}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography color="textPrimary" variant="body1">
                  {item[`symbol${symbol}`] ? item[`symbol${symbol}`] : ""}
                </Typography>
              </Box>
            </TableCell>
          );
        })}
        <TableCell>
          <div
            className={
              item.acceptance ? "containerAcceptance" : "containerReject"
            }
          >
            {item.acceptance ? "Acepta" : "Rechaza"}
          </div>
        </TableCell>
        {!isNotAction ? (
          <TableCell>
            <BiSolidEdit
              fontSize={20}
              onClick={() =>
                disabledActions ? null : onClickState(item.state)
              }
            />
          </TableCell>
        ) : null}
      </>
    );
  };

  if (data.length > 0) {
    return (
      <Card {...rest}>
        <Box
          sx={{
            minWidth: 1050,
            overflowX: "auto",
            maxHeight: 500,
            maxWidth: "100%",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {dataHeader.map((header, i) => (
                  <TableCell key={i}>{header}</TableCell>
                ))}
                {dataSymbols.map((symbol, i) => (
                  <TableCell key={i}>S.ENTRADA {symbol}</TableCell>
                ))}
                <TableCell>Criterio</TableCell>
                {!isNotAction ? <TableCell>Acción</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, i) => (
                <TableRow
                  hover
                  key={i}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedNodeGraph == item.state
                        ? "#9cd7ff"
                        : i % 2
                        ? "#f7f6fe"
                        : "#fff",
                  }}
                >
                  {renderDataRow(item)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    );
  }

  return <div></div>;
};
