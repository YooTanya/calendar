import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import {
  format,
  getDay,
  getDaysInMonth,
  setDate,
  startOfMonth
} from "date-fns/esm";
import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import CalendarDialog from "./CalendarDialog";
import { getDate } from "date-fns";

interface CalendarContentProps {
  currentDate: Date;
}

interface CalendarDay {
  id: number | string;
  date: Date | undefined;
  description: string;
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
  const { currentDate } = props;
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(currentDate));
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [dates, setDates] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedDateDescription, setSelectedDateDescription] = useState<
    string
  >("");
  const [dayDiv, setDayDiv] = useState<ReactNode[]>([]);
  const [marks, setMarks] = useState<any[]>([]);

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
    console.log(updatedData);
    const { date } = updatedData;
    let returnValue: CalendarDay[] = [];

    if (!!date) {
      dates.map(date => {
        returnValue = { ...dates };

        // if (dates.date === date) {
        //   returnValue.description = description;
        // }

        return returnValue;
      });

      // setSelectedIds(updatedIds);
    }
  };

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
  }, [currentDate]);

  const createDaysInMonth = () => {
    let blanks: CalendarDay[] = [];
    let values: CalendarDay[] = [];
    const startedDay = getDay(startOfMonth(currentDate));
    for (let counter = 1; counter < startedDay; counter++) {
      blanks.push({
        id: `blank-${counter}`,
        date: undefined,
        description: ""
      });
    }

    for (let counter = 1; counter <= daysInMonth; counter++) {
      let description = "";
      if (counter === 25 || counter === 26 || counter === 27) {
        description = "Chinese new year";
      }
      if (counter === 1 || counter === 31) {
        description = "New year";
      }
      values.push({
        id: counter,
        date: setDate(currentDate, counter),
        description: description
      });
    }
    return [...blanks, ...values];
  };

  const createDayElement = () => {
    return createDaysInMonth().map(values => {
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
  };

  useEffect(() => {
    setDates(createDaysInMonth());
    setDayDiv(createDayElement());
  }, [currentDate]);

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
