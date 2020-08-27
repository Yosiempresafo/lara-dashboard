import React, { useEffect } from 'react';
import { Provider, useQuery } from 'urql';
import {client, clientSuscription } from '../services/clients';
import Query from '../services/query';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSubscription, SubscriptionHandler } from 'urql';

const query = Query.Historical;
const afterLudo = Date.now() - (30 * 60000);

/*
const query = Query.Tick;

const handleSubscription: SubscriptionHandler<any, any> = (messages = [], response) => {
  console.log(response.newMeasurement)
  return [response.newMeasurement, ...messages];
};
*/

const Dashboard = () => {
  /*
  const [result] = useQuery({
    query
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      console.log(error)
      return;
    }
    if (!data) return;
    console.log(data.getMetrics)
  }, [data, error]);

  */

  
  const [result] = useQuery({
    query,
    variables: {
      input: [{metricName: "oilTemp", after: afterLudo},{metricName: "waterTemp", after: afterLudo}],
    },
  });

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      console.log(error)
      return;
    }
    if (!data) return;
    console.log(data)
  }, [data, error]);


  if (fetching) return <LinearProgress />;
  

  /*
  const [res] = useSubscription({ query }, handleSubscription);
  if (!res.data) {
    return <p>No new messages</p>;
  }*/

  return (
    <section>
      <input></input>
      <h3>last-messures</h3>
      <h3>graphs</h3>
    </section>
  );
};

export default () => {
  return (
    <Provider value={clientSuscription}>
      <Dashboard />
    </Provider>
  );
};