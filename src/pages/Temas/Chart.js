import React, {useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Pie, PieChart, Tooltip, Cell, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// Generate Sales Data
function createData(time, acumulado) {
  return { time, acumulado };
}

const data = [
  { name: 'Estudantes', value: 567 },
  { name: 'Professores', value: 67 },
  { name: 'Escolas', value: 57 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const hoje = new Date();
const mes = hoje.toDateString().slice(4,7)
const ano = hoje.toDateString().slice(11)

export default function Chart() {
  const theme = useTheme();


  const [Hoje, setHoje] = useState(ano)

  return (
    <React.Fragment>
      <PieChart width={200} height={200}>
        <Tooltip  />
        <Pie
          data={data}
          cx={105}
          cy={100}
          outerRadius={50}
          dataKey="value"
          innerRadius={70} outerRadius={90}  
          label
        > 
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} label/>)
          }
          <Label value="%" offset={0} position="center" />
        </Pie>
      </PieChart>

    </React.Fragment>
  );
}