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
  getMonth,
  getYear,
  startOfYear,
  subMonths
} from "date-fns/esm";
import startOfToday from "date-fns/esm/startOfToday";
import React, { FC, useEffect, useState } from "react";
import CalendarContent from "./components/CalendarContent";

const useStyles = makeStyles(theme => ({
  root: {},
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  today: {
    color: "red"
  }
}));
const App: FC = () => {
  const classes = useStyles();
  const [disabledPrevIcon, setDisabledPrevIcon] = useState(false);
  const [disabledNextIcon, setDisabledNextIcon] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfToday());

  const displayIcons = () => {
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
  };

  useEffect(() => {
    displayIcons();
  }, [displayIcons]);

  return (
    <div>
      <AppBar className={classes.header} position="static">
        <IconButton
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
          disabled={disabledNextIcon}
          onClick={() => {
            setCurrentDate(addMonths(currentDate, 1));
            displayIcons();
          }}
        >
          <KeyboardArrowRightIcon fontSize="small" />
        </IconButton>
      </AppBar>
      <CalendarContent currentDate={currentDate} />
      <Hidden smUp>
        <AppBar className={classes.header} position="static">
          <IconButton
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
