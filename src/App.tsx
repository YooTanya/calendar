import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {
  addMonths,
  endOfYear,
  format,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  setDate,
  startOfMonth,
  startOfYear,
  subMonths
} from "date-fns/esm";
import startOfToday from "date-fns/esm/startOfToday";
import React, { FC, useCallback, useEffect, useState } from "react";
import CalendarContent from "./components/CalendarContent";
import CalendarDay from "./types/CalendarDay";

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon: {
    color: theme.palette.common.white
  }
}));
const App: FC = () => {
  const classes = useStyles();
  const [disabledPrevIcon, setDisabledPrevIcon] = useState(false);
  const [disabledNextIcon, setDisabledNextIcon] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(currentDate));
  const [dates, setDates] = useState<CalendarDay[]>([]);

  const displayIcons = useCallback(() => {
    const firstMonth = startOfYear(startOfToday()).getMonth();
    const lastMonth = endOfYear(startOfToday()).getMonth();
    const currentMonth = getMonth(currentDate);

    switch (currentMonth) {
      case firstMonth:
        setDisabledPrevIcon(true);
        break;
      case lastMonth:
        setDisabledNextIcon(true);
        break;
      default:
        setDisabledPrevIcon(false);
        setDisabledNextIcon(false);
    }
  }, [currentDate]);

  useEffect(() => {
    displayIcons();
  }, [displayIcons]);

  const createDaysInMonth = useCallback(() => {
    let blanks: CalendarDay[] = [];
    let values: CalendarDay[] = [];
    const startedDay = getDay(startOfMonth(currentDate));
    for (let counter = 1; counter < startedDay; counter++) {
      blanks.push({
        id: `blank-${counter}`,
        description: ""
      });
    }
    for (let counter = 1; counter <= daysInMonth; counter++) {
      values.push({
        id: counter,
        date: setDate(currentDate, counter),
        description: ""
      });
    }

    return [...blanks, ...values];
  }, [currentDate, daysInMonth]);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
    setDates(createDaysInMonth());
  }, [currentDate, createDaysInMonth]);

  return (
    <div>
      <AppBar className={classes.header} position="static">
        <IconButton
          className={classes.icon}
          disabled={disabledPrevIcon}
          onClick={() => {
            setCurrentDate(subMonths(currentDate, 1));
          }}
        >
          <KeyboardArrowLeftIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6">
          {`${format(currentDate, "MMMM")} ${getYear(currentDate)}`}
        </Typography>
        <IconButton
          className={classes.icon}
          disabled={disabledNextIcon}
          onClick={() => {
            setCurrentDate(addMonths(currentDate, 1));
          }}
        >
          <KeyboardArrowRightIcon fontSize="small" />
        </IconButton>
      </AppBar>
      <CalendarContent currentDate={currentDate} dates={dates} />
      <Hidden smUp>
        <AppBar className={classes.header} position="static">
          <IconButton
            className={classes.icon}
            disabled={disabledPrevIcon}
            onClick={() => {
              setCurrentDate(subMonths(currentDate, 1));
              displayIcons();
            }}
          >
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6">
            {`${format(currentDate, "MMMM")} ${getYear(currentDate)}`}
          </Typography>
          <IconButton
            className={classes.icon}
            disabled={disabledNextIcon}
            onClick={() => {
              setCurrentDate(addMonths(currentDate, 1));
              displayIcons();
            }}
          >
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
        </AppBar>
      </Hidden>
    </div>
  );
};

export default App;
