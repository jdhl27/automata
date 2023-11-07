import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "background.paper",
  boxShadow: 24,
  maxHeight: "80vh",
  overflow: "auto",
  p: 4,
  borderRadius: 1,
};

export default function BasicModal({ children, isOpen = false, handleClose }) {
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
          }}
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
}
