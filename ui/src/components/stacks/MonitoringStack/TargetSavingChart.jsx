// TODO: Remove this after charts are ready
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload, cornerRadius } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={10} fontSize={innerRadius / 2} textAnchor="middle" fill="gray" fontWeight="bold">
        {payload.value < 1000 ? payload.value : `${parseFloat(payload.value / 1000).toFixed(1)}K`}
      </text>
      <text x={cx} y={cy + 10} dy={10} fontSize={innerRadius / 3} textAnchor="middle" fill="#5C677D">
        {payload.name}
      </text>

      {/* Blue circle - Achieved Goal */}
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} cornerRadius={0} fill="url(#colorUvPie)" />

      {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
      {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}%`}</text> */}
    </g>
  );
};

//https://stackoverflow.com/questions/72108791/how-to-use-linear-gradient-in-rechart
export default function TargetSavingChart({ id }) {
  // const [activeIndex, setActiveIndex] = useState(1)

  const data = [
    { name: "Saving Account", value: 3000 }, // Saving Account minus the Target goal
    { name: "Vacancy", value: 8000 },
  ];

  // const onPieEnter = (_, index) => {
  //     setActiveIndex(index)
  // };
  // const { isMobile } =       getDevice()
  const isMobile = false;
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart id={`piechart-${id}`}>
        <defs>
          <linearGradient id="colorUvPie" x1="1" y1="1" x2="0" y2="0">
            <stop offset="10%" stopColor="#c0c3ef" stopOpacity={2} />
            <stop offset="100%" stopColor="#2a6bee" stopOpacity={5} />
          </linearGradient>
          <linearGradient id="colorUvPie1" x1="1" y1="1" x2="0" y2="0">
            <stop offset="30%" stopColor="rgb(37, 43, 50)" stopOpacity={5} />
            <stop offset="95%" stopColor="rgb(37, 43, 50)" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="colorUvPieInner" x1="1" y1="1" x2="0" y2="0">
            <stop offset="5%" stopColor="white" stopOpacity={5} />
            <stop offset="95%" stopColor="gray" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <Pie activeIndex={1} activeShape={renderActiveShape} blendStroke={0.3} data={data} cx="50%" cy="50%" innerRadius="75%" outerRadius="85%" cornerRadius={0} dataKey="value" fillOpacity={0.9} fill={"url(#colorUvPie1)"}></Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
