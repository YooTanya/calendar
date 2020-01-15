import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { getDay, getDaysInMonth, setDate, startOfMonth } from "date-fns/esm";
import React, { FC, useCallback, useEffect, useState } from "react";
import CalendarDialog from "./CalendarDialog";

interface CalendarContentProps {
  currentDate: Date;
}
interface CalendarDay {
  id: number | string;
  day: number | undefined;
  description?: string | undefined;
}
const useStyles = makeStyles(theme => ({
  button: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "flex-start",
      marginLeft: theme.spacing(2)
    }
  },
  cell: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      justifyContent: "center",
      width: "calc(100%/7)",
      height: "7rem"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      width: "100%"
    }
  },
  cellBlank: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  description: {
    [theme.breakpoints.up("xs")]: {
      display: "none"
    },
    [theme.breakpoints.down("xs")]: {
      display: "inline-block",
      marginLeft: "3rem",
      width: "100%",
      textAlign: "left"
    }
  },
  header: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  mark: {
    position: "relative",
    "&:before": {
      borderWidth: "5px",
      borderLeftColor: theme.palette.error.dark,
      borderTopColor: theme.palette.error.dark
    },
    "&:before, &:after": {
      content: "",
      position: "absolute",
      top: 0,
      left: 0,
      borderColor: "transparent",
      borderStyle: "solid",
      display: "block"
    }
  },
  row: {
    [theme.breakpoints.down("sm")]: {
      display: "block"
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexFlow: "row"
    }
  }
}));
const CalendarContent: FC<CalendarContentProps> = props => {
  const classes = useStyles();

  const { currentDate } = props;
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(currentDate));
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [dates, setDates] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
  }, [currentDate]);

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleOpenDialog = useCallback((currentDate, id) => {
    if (!id.toString().startsWith("blank")) {
      setIsOpenDialog(true);
      setSelectedDate(setDate(currentDate, id));
    }
  }, []);

  const setAllDays = () => {
    let blanks: CalendarDay[] = [];
    let values: CalendarDay[] = [];
    const startedDay = getDay(startOfMonth(currentDate));
    for (let counter = 1; counter < startedDay; counter++) {
      blanks.push({
        id: `blank-${counter}`,
        day: undefined,
        description: undefined
      });
    }

    for (let counter = 1; counter <= daysInMonth; counter++) {
      values.push({ id: counter, day: counter, description: "description" });
    }

    const days = [...blanks, ...values].map(values => {
      const { id, description, day } = values;
      return (
        <div
          key={id}
          className={clsx(
            classes.cell,
            {
              [classes.cellBlank]: day === undefined
            },
            { [classes.mark]: !!description }
          )}
          onClick={() => handleOpenDialog(currentDate, id)}
        >
          <ButtonBase disabled={day === undefined} className={classes.button}>
            <Typography variant="body2">{day}</Typography>
            {description && (
              <Typography variant="body2" className={classes.description}>
                {description}
              </Typography>
            )}
          </ButtonBase>
        </div>
      );
    });
    return days;
  };

  const arrangeDays = () => {
    let rows: Object[] = [];
    let cells: Object[] = [];
    setAllDays().forEach((row, index) => {
      if (index % 7 === 0 && cells.length > 0) {
        rows.push(cells);
        cells = [];
        cells.push(row);
      } else {
        cells.push(row);
      }
    });

    rows.push(cells);
    return rows.map((day, index) => (
      <div className={classes.row} key={index}>
        {day}
      </div>
    ));
  };

  const renderWeek = () => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days = [];
    for (let counter = 0; counter < 7; counter++) {
      days.push(
        <div
          key={`days-${counter}`}
          className={clsx(classes.cell, classes.header)}
        >
          <ButtonBase disabled className={classes.button}>
            <Typography variant="body2">{daysOfWeek[counter]}</Typography>
          </ButtonBase>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <Paper variant="outlined">
        <div className={classes.row}>{renderWeek()}</div>
        {arrangeDays()}
      </Paper>
      <CalendarDialog
        isOpen={isOpenDialog}
        closeDialog={handleCloseDialog}
        title={selectedDate}
      />
    </>
  );
};
export default CalendarContent;
