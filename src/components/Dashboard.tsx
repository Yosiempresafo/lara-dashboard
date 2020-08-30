import React, { useEffect, useState } from 'react';
import { Provider, useQuery } from 'urql';
import client from '../services/client';
import Query from '../services/query';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Metrics from '../Features/Metrics/Metrics';
import Historical from '../Features/Historical/Historical';
import Select from 'react-select';

const query = Query.allMetrics;
const initTime = Date.now() - (30 * 60000);

const Dashboard = () => {
  const [selectedOption, setSelectedOption]:any[] = useState([]);
  const [options, setOptions] = useState([]);

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
    setOptions(data.getMetrics.map((metric:any) => ({value: metric, label: metric, unit: metric.includes('Temp')?'°F':metric.includes('Pressure')?'PSI':'%'})));
  }, [data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <Container maxWidth="xl">
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          isMulti
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <Metrics selectedOption={selectedOption} />
        <Historical selectedOption={selectedOption} initTime={initTime} options={options}/>
    </Container>
  );
};

export default () => {
  return (
    <Provider value={client}>
      <Dashboard />
    </Provider>
  );
};