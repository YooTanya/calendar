import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { format } from "date-fns";
import React, { ChangeEventHandler, FC, useState } from "react";
interface CalendarDay {
  id: number | string;
  date: Date | undefined;
  description: string;
}
interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: Date; description: string }) => void;
  selectedDate: Date;
  description: string;
}

const CalendarDialog: FC<CalendarDialogProps> = props => {
  const { isOpen, description, onClose, onSave, selectedDate } = props;
  const [currentDescription, setCurrentDescription] = useState<string>(
    description
  );

  const updateDescription: ChangeEventHandler<HTMLInputElement> = event => {
    setCurrentDescription(event.target.value);
  };

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle id="form-dialog-title">
        {format(selectedDate, "d MMMM Y")}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          inputProps={{
            maxLength: 40
          }}
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          defaultValue={description}
          onChange={updateDescription}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave({ date: selectedDate, description: currentDescription });
          }}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CalendarDialog;
