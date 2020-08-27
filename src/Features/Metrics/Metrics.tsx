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
  return [response.newMeasurement, ...messages];
};


const Metric = ({metrics = []}) => {
  const classes = useStyles();

  //const [res] = useSubscription({ query }, handleSubscription);
  //if (!res.data) {
  //  return <p>No new messages</p>;
  //}

  return (
    <div>
      <h1>Last-tick</h1>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        {metrics.map((metric:any) => (
          <Card className={classes.root} key={metric.value}>
          <CardContent>
            <Typography className={classes.title} gutterBottom>
              {metric.value}
            </Typography>
        
            <Typography className={classes.value} component="h3">
              {3000 + "F"}
            </Typography>
          </CardContent>
        </Card>
        ))}
      </Grid>
    </div>
  );
};

export default Metric;
