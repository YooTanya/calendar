import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { format } from "date-fns/esm";
import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import CalendarDialog from "./CalendarDialog";
import CalendarDay from "../types/CalendarDay";

interface CalendarContentProps {
  currentDate: Date;
  dates: CalendarDay[];
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
    [theme.breakpoints.up("xs")]: {
      "&::before ,&::after": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        borderColor: "transparent",
        borderStyle: "solid",
        display: "block"
      },
      "&::before": {
        content: "''",
        borderWidth: "7px",
        borderLeftColor: theme.palette.error.dark,
        borderTopColor: theme.palette.error.dark
      }
    },
    [theme.breakpoints.down("xs")]: {
      "&::before": {
        borderColor: "transparent"
      }
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
  const { currentDate, dates } = props;
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedDateDescription, setSelectedDateDescription] = useState<
    string
  >("");
  const [currentDates, setCurrentDates] = useState<CalendarDay[]>(dates);
  const [dayDiv, setDayDiv] = useState<ReactNode[]>([]);

  const handleOpenDialog = useCallback((currentDate, date, description) => {
    if (!!date) {
      setIsOpenDialog(true);
      setSelectedDateDescription(description);
      setSelectedDate(date);
    }
  }, []);

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const saveDescription = (
    updatedData: Pick<CalendarDay, "date" | "description">
  ) => {
    setIsOpenDialog(false);
    let newCalendarDates: CalendarDay[] = [];

    if (!!updatedData.description) {
      newCalendarDates = dates.map(eachDate => {
        if (eachDate.date === updatedData.date) {
          eachDate.description = updatedData.description;
        }

        return eachDate;
      });
    }
    setCurrentDates(newCalendarDates);
  };

  const createDayElement = useCallback(() => {
    return dates.map(values => {
      const { id, date, description } = values;
      return (
        <div
          key={id}
          className={clsx(
            classes.cell,
            {
              [classes.cellBlank]: date === undefined
            },
            { [classes.mark]: !!description }
          )}
          onClick={() => handleOpenDialog(currentDate, date, description)}
        >
          <ButtonBase disabled={date === undefined} className={classes.button}>
            <Typography variant="body2">
              {!!date && format(date, "d")}
            </Typography>
            {description && (
              <Typography variant="body2" className={classes.description}>
                {description}
              </Typography>
            )}
          </ButtonBase>
        </div>
      );
    });
  }, [currentDate, currentDates]);

  useEffect(() => {
    setCurrentDates(dates);
    setDayDiv(createDayElement());
  }, [dates, createDayElement]);

  const arrangeDays = () => {
    let rows: ReactNode[] = [];
    let cells: ReactNode[] = [];
    dayDiv.forEach((row, index) => {
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
        onClose={handleCloseDialog}
        onSave={saveDescription}
        selectedDate={selectedDate}
        description={selectedDateDescription}
      />
    </>
  );
};
export default CalendarContent;
