import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { getDaysInMonth } from "date-fns";
import { getDay, startOfMonth, startOfToday } from "date-fns/esm";
import React, { FC, ReactNode, useEffect, useState } from "react";

interface CalendarContentProps {
  currentDate: Date;
}
const useStyles = makeStyles(theme => ({
  root: {},
  cell: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      width: "5rem",
      height: "5rem",
      alignItems: "center",
      justifyContent: "center"
    },
    [theme.breakpoints.down("xs")]: {
      display: "block",
      width: "100%"
    }
  },

  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  row: {
    [theme.breakpoints.down("sm")]: {
      display: "block"
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexFlow: "row",
      padding: theme.spacing(1)
    }
  }
}));
const CalendarContent: FC<CalendarContentProps> = props => {
  const classes = useStyles();

  const { currentDate } = props;
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(currentDate));

  const setAllDays = () => {
    let blanks = [];
    let days = [];
    const startedDay = getDay(startOfMonth(currentDate));

    for (let counter = 1; counter < startedDay; counter++) {
      blanks.push(<div className={classes.cell}></div>);
    }
    for (let counter = 1; counter <= daysInMonth; counter++) {
      days.push(
        <div key={counter}>
          {" "}
          <ButtonBase className={classes.cell}>
            <Typography variant="body2">{counter}</Typography>
          </ButtonBase>
        </div>
      );
    }
    return [...blanks, ...days];
  };

  const setRows = () => {
    let rows: ReactNode[] = [];
    let cells: ReactNode[] = [];
    setAllDays().forEach((row, index) => {
      if (index % 7 == 0 && cells.length > 0) {
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

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
    setAllDays();
    setRows();
  }, [currentDate, setAllDays, setRows]);

  const renderWeek = () => {
    //format(currentDate, "ddd") is not working
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days = [];
    for (let counter = 0; counter < 7; counter++) {
      days.push(
        <div>
          <ButtonBase disableRipple className={classes.cell}>
            <Typography variant="body2">{daysOfWeek[counter]}</Typography>
          </ButtonBase>
        </div>
      );
    }
    return days;
  };

  return (
    <Paper variant="outlined" square>
      <div className={classes.row}>{renderWeek()}</div>
      {setRows()}

      {/* {[...Array(getDaysInMonth(currentDate))].map((_, index) => (
        <div key={index}>
          <ButtonBase
            className={clsx({
              [classes.today]:
                getDate(currentDate) - 1 == index && isThisMonth(currentDate)
            })}
          >
            <Typography variant="body2" className={classes.item}>
              {index + 1}
            </Typography>
          </ButtonBase>
        </div>
      ))} */}
    </Paper>
  );
};
export default CalendarContent;
