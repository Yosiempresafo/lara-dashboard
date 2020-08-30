import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import Query from '../../services/query';
import LinearProgress from '@material-ui/core/LinearProgress';
import { actions } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import Plot from 'react-plotly.js';

const query = Query.Historical;
//const after = Date.now() - (30 * 60000);

const getMeasurements = (state: IState) => {
  return state.measurements;
};

const layout:any = {
  //title: 'multiple y-axes example',
  width: 1200,
  height: 800,
  xaxis: {
    tickformat: '%H:%M:%S',
    domain: [0, 1],
    showgrid: false
  },
  yaxis: {
    title: 'yaxis title',
    titlefont: {color: '#1f77b4'},
    tickfont: {color: '#1f77b4'}
  },
  yaxis2: {
    title: '°F',
    titlefont: {color: '#ff7f0e'},
    tickfont: {color: '#ff7f0e'},
    anchor: 'free',
    overlaying: 'y',
    side: 'left',
    position: 0,
    linecolor: '#636363'
  }
}

let hola  = [
  {at: new Date(1598655510534), value: 30.58,  kind: "F"},
  {at: new Date(1598655511534), value: 35.58,  kind: "F"},
  {at: new Date(1598655512534), value: 10.58,  kind: "F"},
]

const trace1 = {
x: hola.map(x=>x.at),
y: hola.map(x=>x.value),
name: 'yaxis1 data',
type: 'scatter'
};

const trace2 = {
x: hola.map(x=>x.at),
y: hola.map(x=>x.value + 100),
name: 'yaxis2 data',
yaxis: 'y2',
type: 'scatter'
};


const data1:any = [trace1, trace2];

const Historical = ({selectedOption = [], initTime = Date.now()}) => {
  const dispatch = useDispatch();
  const measurements:any = useSelector(getMeasurements);

    const [result] = useQuery({
      query,
      variables: {
        input: selectedOption ? selectedOption.map((metric:any) => ({metricName: metric.value, after: initTime})) : [],
      },
    });

    const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.historicalApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.historicalDataRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);
  
  const graph:any[] = selectedOption ? selectedOption.map((measurement:any) => {
    if (measurement.value in measurements) {
      const plot = measurements[measurement.value];

      //return <h3 key={measurements[measurement.value].name}>{measurements[measurement.value].name}</h3>
      return {x: plot.x, y: plot.y, yaxis: 'y2', type: 'scatter', name: `${measurement.value} ${plot.unit}`}
    }
  }): [];

  return (
    <div>
      {graph.length>0&&
        <Plot
          data={graph}
          layout={ layout }
        />
      }  
    </div>
  );
};

export default Historical;