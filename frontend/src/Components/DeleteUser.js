import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Delete({ id }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClosebtn = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
    fetch(`http://localhost:4000/profile/${id}`, {
      method: "DELETE",
    }).then(() => {
      toast.success("User Deleted");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    });
  };

  return (
    <React.Fragment>
      <Button
        style={{ color: "white", backgroundColor: "red" }}
        onClick={handleClickOpen}
      >
        Delete
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Delete User ?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosebtn}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you want to delete this user and all of its posts?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Yes, Delete
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
