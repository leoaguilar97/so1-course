import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';

import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '6px 16px',
    align: 'center'
  }
}));

const Item = ({ name, hour, text }) => {
  const classes = useStyles();

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography variant="body2" color="textSecondary">
          {hour}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot>
          <Avatar>
            {
              name.substring(0, 1)
            }
          </Avatar>
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h6" component="h1">
            {name}
          </Typography>
          <Typography>{text}</Typography>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );

}

export default Item;