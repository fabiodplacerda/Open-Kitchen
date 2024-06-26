import { Button, Box, Modal } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";

const ModalBox = ({
  title,
  text,
  open,
  handleOpen,
  isLoading,
  deleteFunction,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-box">
        <p className="fs-2 text-center">{title}</p>
        <p className="text-center">{text}</p>
        <Button variant="contained" color="success" onClick={handleOpen}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="error"
          loadingPosition="end"
          endIcon={<DeleteIcon />}
          loading={isLoading}
          onClick={deleteFunction}
        >
          Delete
        </LoadingButton>
      </Box>
    </Modal>
  );
};

export default ModalBox;
