import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import Query from '../../services/query';
import LinearProgress from '@material-ui/core/LinearProgress';
import { actions } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';

const query = Query.Historical;
//const after = Date.now() - (30 * 60000);

const getMeasurements = (state: IState) => {
  return state.measurements;
};

const Historical = ({selectedOption = [], initTime = Date.now()}) => {
  const dispatch = useDispatch();
  const measurements:any = useSelector(getMeasurements);

  const [result] = useQuery({
    query,
    variables: {
      input: selectedOption ? selectedOption.map((metric:any) => ({metricName: metric.value, after: initTime})) : [],
    },
  });
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.historicalApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.historicalDataRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);
  //if (fetching) return <LinearProgress />;
  
  return (
    <div>
      <h1>Historical Data</h1>
      {selectedOption && selectedOption.map((measurement:any) => {
        if (measurement.value in measurements) {
          return <h3 key={measurements[measurement.value].name}>{measurements[measurement.value].name}</h3>
        }
      })}
    </div>
  );
};

export default Historical;