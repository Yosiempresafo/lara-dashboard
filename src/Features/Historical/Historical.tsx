import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import Query from '../../services/query';
//import LinearProgress from '@material-ui/core/LinearProgress';
import { actions } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import Plot from 'react-plotly.js';

const query = Query.Historical;
//const after = Date.now() - (30 * 60000);

const getMeasurements = (state: IState) => {
  return state.measurements;
};

//const layout:any = {
//  //datarevision: 0,
//  width: 1200,
//  height: 800,
//  xaxis: {
//    tickformat: '%H:%M:%S',
//    domain: [0.3, 1],
//    showgrid: false
//  },
//  yaxis: {
//    title: 'PSI',
//    titlefont: {color: '#1f77b4'},
//    tickfont: {color: '#1f77b4'},
//    showgrid: false,
//    linecolor: '#636363'
//  },
//  yaxis2: {
//    title: '°F',
//    titlefont: {color: '#ff7f0e'},
//    tickfont: {color: '#ff7f0e'},
//    showgrid: false,
//    anchor: 'free',
//    overlaying: 'y',
//    side: 'left',
//    position: 0.15
//  },
//  yaxis3: {
//    title: '%',
//    titlefont: {color: '#d62728'},
//    tickfont: {color: '#d62728'},
//    showgrid: true,
//    anchor: 'free',
//    overlaying: 'y',
//    side: 'left',
//    position: 0.23
//  }
//}

const layout2:any = {
  //datarevision: 0,
  width: 1200,
  height: 800,
  xaxis: {
    domain: [0.06, 1],
    showgrid: false
  }
}

const Grafico = (props:any) => {
  return(<Plot
    data={props.data}
    layout={props.ly}
  />)
}

const Historical = ({selectedOption = [], initTime = Date.now(), options = []}) => {
  const measurements:any = useSelector(getMeasurements);
  const dispatch = useDispatch();
  const [result] = useQuery({
    query,
    variables: {
      //input: selectedOption ? selectedOption.map((metric:any) => ({metricName: metric.value, after: initTime})) : [],
      input: options ? options.map((metric:any) => ({metricName: metric.value, after: initTime})) : [],
    },
  });
  const { data, error } = result;
  const [layouto, setLayouto] = useState({});
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (error) {
      dispatch(actions.historicalApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.historicalDataRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);

  useEffect(() => {
    const units_ = selectedOption ? selectedOption.reduce((res:any, measurement:any) => {
        if(!res.includes(measurement.unit)){
          res.push(measurement.unit)
        }
      return res;
    }, []):[];

    setUnits(units_);
  }, [selectedOption]);

  useEffect(() => {
    let layoutType = units.length; 
    let yaxis = {
      title: units[0],
      linecolor: '#636363',
      showgrid: false,
      rangemode: 'tozero'
    }
    let yaxis2 = {
      title: units[1],
      linecolor: '#636363',
      showgrid: false,
      anchor: 'free',
      overlaying: 'y',
      side: 'left',
      position: 0,
      rangemode: 'tozero'
    }
    let yaxis3 = {
      title: units[2],
      linecolor: '#636363',
      showgrid: false,
      anchor: 'x',
      overlaying: 'y',
      side: 'right',
      rangemode: 'tozero'
    }
    if(layoutType>=1){
      setLayouto({...layout2, yaxis})
    }else if(layoutType>=2){
      setLayouto({...layout2, yaxis, yaxis2})
    }else if(layoutType>=3){
      setLayouto({...layout2, yaxis, yaxis2, yaxis3})
    }
  }, [units]);

  const chooseYaxis = (unit:string) => {
    let layoutType = units.length; 
    if(layoutType>=1){
      return 'y1'
    }else if(layoutType>=2){
      if(units[0] === unit){
        return 'y1'
      }else {
        return 'y2'
      }
    }else if(layoutType>=3){
      if(units[0] === unit){
        return 'y1'
      }else if (units[1] === unit){
        return 'y2'
      }else{
        return 'y3'
      }
    }
  }

  return (
    <div>
      {selectedOption&&
        selectedOption.length>0&&
        <Grafico data={selectedOption.map((measurement:any) => {
          return (measurement.value in measurements) ?
          { x: measurements[measurement.value].x, 
            y: measurements[measurement.value].y, 
            //yaxis: measurement.unit === 'PSI' ? 'y1' : 'y2',
            yaxis: chooseYaxis(measurements[measurement.value].unit),
            type: 'scatter', 
            name: `${measurement.value} ${measurements[measurement.value].unit}`
          } : {}
        })} ly={layouto}/>
      }  
    </div>
  );
};

export default Historical;