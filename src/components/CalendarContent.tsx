import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
  startOfToday,
  getDay
} from "date-fns/esm";
import React, { FC, useEffect } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { getDaysInMonth } from "date-fns";

interface CalendarContentProps {
  currentDate: Date;
}
const useStyles = makeStyles(theme => ({
  root: {},

  day: {
    width: "50px",
    height: "50px",
    display: "inline-block"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  item: {
    [theme.breakpoints.down("xs")]: {
      display: "block"
    },
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      flexFlow: "row",

      padding: theme.spacing(1)
    }
  },
  today: {
    color: "red",
    "& :after, & :before": {
      content: "",
      position: "absolute"
    },
    "& :after": {
      borderRadius: "50%",
      backgroundColor: "pink"
    }
  },
  row: {
    display: "flex"
  }
}));
const CalendarContent: FC<CalendarContentProps> = props => {
  const { currentDate } = props;
  const classes = useStyles();
  //   console.log(startOfWeek(currentDate, { weekStartsOn: 1 }));
  //   console.log(getDay(startOfMonth(currentDate)) - 1);
  //   console.log(getWeeksInMonth(currentDate, { weekStartsOn: 1 }));

  const renderWeek = () => {
    //format(currentDate, "ddd") is not working
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days = [];
    for (let counter = 0; counter < 7; counter++) {
      days.push(
        <div className={classes.day}>
          <ButtonBase>{daysOfWeek[counter]}</ButtonBase>
        </div>
      );
    }
    return days;
  };

  const getFirstDayOfMonth = () => {
    return getDay(startOfMonth(startOfToday()));
  };

  const getBlankDays = () => {
    let blanks = [];
    for (let counter = 1; counter < getFirstDayOfMonth(); counter++) {
      blanks.push(<div className={classes.day}></div>);
    }
    return blanks;
  };

  const displayDates = () => {
    let days = [];
    for (let counter = 1; counter <= getDaysInMonth(currentDate); counter++) {
      days.push(
        <div className={classes.day} key={counter}>
          {counter}
        </div>
      );
    }
    return [...getBlankDays(), ...days];
  };

  let rows: any[] = [];
  let cells: any[] = [];

  displayDates().forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === displayDates().length - 1) {
      rows.push(cells);
    }
  });

  let daysinmonth = rows.map((d, i) => {
    return <div>{d}</div>;
  });

  return (
    <Paper variant="outlined" square>
      {renderWeek()}
      {daysinmonth}
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
