import React, {useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { CartesianGrid, Tooltip, ComposedChart, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// Generate Sales Data
function createData(time, acumulado) {
  return { time, acumulado };
}

const data = [
  createData('Janeiro', 0),
  createData('Fevereiro', 0),
  createData('Março', 0),
  createData('Abril', 0),
  createData('Maio', 0),
  createData('Junho', 0),
  createData('Julho', 0),
  createData('Agosto', 0),
  createData('Setembro', 0),
];
const hoje = new Date();
const mes = hoje.toDateString().slice(4,7)
const ano = hoje.toDateString().slice(11)

export default function Chart() {
  const theme = useTheme();


  const [Hoje, setHoje] = useState(ano)

  return (
    <React.Fragment>
      <section style={{display:"flex",flexDirection:"row"}}>
      <Select
        labelId="demo-simple-select-placeholder-label-label"
        id="demo-simple-select-placeholder-label"
        displayEmpty
        //className={classes.selectEmpty}
        value={Hoje}
        onChange={e => setHoje(e.target.value)} 
        //error={VFcidade}
      >
        <MenuItem value={"2020"}>2020</MenuItem>
        <MenuItem value={"2021"}>2021</MenuItem>
        <MenuItem value={"2022"}>2022</MenuItem>
        <MenuItem value={"2023"}>2023</MenuItem>
        <MenuItem value={"2024"}>2024</MenuItem>
        <MenuItem value={"2025"}>2025</MenuItem>        
      </Select>
      <Title>Balaço anual </Title>
      </section>
      <ResponsiveContainer>
        <ComposedChart  height={300} data={data}  >
          <XAxis dataKey="time" stroke="#8884d8" />
          <YAxis  stroke={theme.palette.text.secondary}/>
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="9 9" />
          <Bar dataKey="acumulado" fill="#119abf" barSize={30} />
        </ComposedChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}