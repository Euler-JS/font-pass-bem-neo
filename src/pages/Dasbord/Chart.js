import React, {useState, useEffect} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { CartesianGrid, Tooltip, ComposedChart, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import api from '../../services/api';

const anoAtual = new Date().getFullYear().toString();

const mesesVazios = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
].map(name => ({ time: name, acumulado: 0 }));

export default function Chart() {
  const theme = useTheme();

  const [ano, setAno] = useState(anoAtual);
  const [data, setData] = useState(mesesVazios);

  useEffect(() => {
    async function fetchChart() {
      try {
        const res = await api.get(`/dasboard/chart?ano=${ano}`);
        setData(res?.data?.value || mesesVazios);
      } catch {
        setData(mesesVazios);
      }
    }
    fetchChart();
  }, [ano]);

  return (
    <React.Fragment>
      <section style={{display:"flex",flexDirection:"row"}}>
      <Select
        labelId="demo-simple-select-placeholder-label-label"
        id="demo-simple-select-placeholder-label"
        displayEmpty
        value={ano}
        onChange={e => setAno(e.target.value)}
      >
        <MenuItem value={"2020"}>2020</MenuItem>
        <MenuItem value={"2021"}>2021</MenuItem>
        <MenuItem value={"2022"}>2022</MenuItem>
        <MenuItem value={"2023"}>2023</MenuItem>
        <MenuItem value={"2024"}>2024</MenuItem>
        <MenuItem value={"2025"}>2025</MenuItem>
        <MenuItem value={"2026"}>2026</MenuItem>
      </Select>
      <Title>Balaço anual </Title>
      </section>
      <ResponsiveContainer>
        <ComposedChart height={300} data={data}>
          <XAxis dataKey="time" stroke="#8884d8" />
          <YAxis stroke={theme.palette.text.secondary}/>
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="9 9" />
          <Bar dataKey="acumulado" fill="#119abf" barSize={30} />
        </ComposedChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
