import React, { useEffect, useState } from 'react';
import Query from '../../services/query';
//import LinearProgress from '@material-ui/core/LinearProgress';
import { useSubscription, SubscriptionHandler } from 'urql';

import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Historical/reducer';
import { IState } from '../../store';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

const query = Query.Tick;
const useStyles = makeStyles({
  root: {
    minWidth: 150,
    maxWidth: 300,
    margin: 10
  },
  title: {
    fontSize: 20,
  },
  value:{
    fontSize: 40,
  }
});

//export type Metrica = {
//  description: string;
//  locationName: string;
//  temperatureinCelsius: number;
//};

const handleSubscription: SubscriptionHandler<any, any> = (messages = [], response) => {
  //console.log(response.newMeasurement)
  return response.newMeasurement;
};

const getMeasurements = (state: IState) => {
  return state.measurements;
};

const Metric = ({selectedOption = []}) => {
  const dispatch = useDispatch();
  const measurements: any = useSelector(getMeasurements);
  const classes = useStyles();

  const [result] = useSubscription({ query }, handleSubscription);
  useEffect(() => {
    if (result.data) {
      dispatch(actions.lastDataRecevied(result.data));
    }
  }, [dispatch, result]);
  const { fetching, data, error } = result;

  if (!result.data) {
    return (<div><LinearProgress /></div>);
  }

  return (
    <div>
      <h1>Last-tick</h1>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        {selectedOption && selectedOption.map((measurement: any) => (
          <Card className={classes.root} key={measurement.value}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                {measurement.value}
              </Typography>
              <Typography className={classes.value} component="h3">
                {
                  measurement.value in measurements ?
                  measurements[measurement.value].last.value + "  " + measurements[measurement.value].last.unit :
                  <CircularProgress/>
                }
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </div>
  );
};

export default Metric;
