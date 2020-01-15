import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { FC } from "react";
import { format } from "date-fns";

interface CalendarDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  title: Date;
}

const CalendarDialog: FC<CalendarDialogProps> = props => {
  const { isOpen, closeDialog, title } = props;
  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle id="form-dialog-title">
        {format(title, "d MMMM Y")}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={closeDialog} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CalendarDialog;
