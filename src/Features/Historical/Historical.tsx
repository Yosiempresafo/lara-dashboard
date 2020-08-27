import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import Query from '../../services/query';
import LinearProgress from '@material-ui/core/LinearProgress';

const query = Query.Historical;
//const after = Date.now() - (30 * 60000);

const Historical = ({metrics = [], initTime = Date.now()}) => {
  const [result] = useQuery({
    query,
    variables: {
      input: metrics.map((metric:any) => ({metricName: metric.value, after: initTime})),
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

  //if (fetching) return <LinearProgress />;

  return (
    <h1>Historical Data</h1>
  );
};

export default Historical;