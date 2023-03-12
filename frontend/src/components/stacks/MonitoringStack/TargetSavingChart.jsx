import React from 'react';
import { PieChart, Pie, Sector } from 'recharts';


const renderActiveShape = (props) => {

    const { cx, cy, startAngle, endAngle, payload, innerRadius, outerRadius, z, cornerRadius } = props;
    console.log("*****************************************")
    console.log(startAngle, endAngle)
    console.log("*****************************************")

    return (
        <>
            <text x={cx} y={cy - 10} dy={8} fontSize={z ? '16px' : "24px"} textAnchor="middle" fill="gray" fontWeight="bold">
                {payload.value < 1000 ? payload.value : `${parseFloat(payload.value / 1000).toFixed(1)}K`}
            </text>
            <text x={cx} y={cy + 5} dy={8} fontSize="12px" textAnchor="middle" fill="#5C677D">
                {payload.name}
            </text>

            {/* Blue circle - Achieved Goal */}
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius -1}
                outerRadius={outerRadius + 2}
                startAngle={startAngle}
                endAngle={endAngle}
                cornerRadius={0}
                fill="url(#colorUvPie)"
            />

           

            {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
            {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}%`}</text> */}
        </>
    );
};


//https://stackoverflow.com/questions/72108791/how-to-use-linear-gradient-in-rechart
export default function TargetSavingChart() {

    // const [activeIndex, setActiveIndex] = useState(1)

    const data = [
        { name: 'Saving Account', value: 3000 }, // Saving Account minus the Target goal
        { name: 'Vacancy', value: 8000 },
      ];

    // const onPieEnter = (_, index) => {
    //     setActiveIndex(index)
    // };
    // const { isMobile } =       getDevice()
    const isMobile = false;
    return (
        <PieChart width={210} height={170}>
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
            <Pie
                activeIndex={1}
                activeShape={renderActiveShape}
                blendStroke={0.3}
                data={data}
                cx={110}
                cy={85}
                innerRadius={65}
                outerRadius={75}
                cornerRadius={0}
                dataKey="value"
                fillOpacity={0.9}
                fill={"url(#colorUvPie1)"}
            >
            </Pie>
        </PieChart>
    );
}