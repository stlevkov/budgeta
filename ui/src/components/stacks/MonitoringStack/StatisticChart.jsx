/*
    Budgeta Application
    Copyright (C) 2022 - 2023  S.Levkov, K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
import React, { PureComponent } from 'react';
import { useState, useEffect, useContext } from "react";
import { ComposedChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardContext } from '../../../utils/AppUtil';

const monthTickFormatter = (tick) => {
  const date = new Date(tick);
  return "";
};

export default function StatisticChart() {
  const dashboardState = useContext(DashboardContext);
  const [aggregationState, setAggregationState] = useState([]);

  const [seriesVisibility, setSeriesVisibility] = useState({
    expenses: true,
    unexpecteds: true,
    savings: true,
  });

  const [seriesColor, setSeriesColor] = useState({
    expenses: "#2da81d",
    unexpecteds: "#8884d8",
    savings: "lightblue",
  });

  const handleClick = (e) => {
    const { value } = e;
    const updatedVisibility = { ...seriesVisibility };
    updatedVisibility[value] = !updatedVisibility[value];
    setSeriesVisibility(updatedVisibility);
  }

  // adjust the text color/decoration of the Legend text
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{
      color: seriesVisibility[value] ? color : 'gray',
      textDecoration: seriesVisibility[value] ? 'none' : 'line-through',
      cursor: 'pointer',
    }}>{value}</span>;
  };

  const transformAggregationState = (originalState) => {
    if(!originalState) return;

    const transformedState = originalState.map((item) => {
      return {
        date: `${item.year}-${item.month}`, 
        expenses: item.totalExpenses,
        unexpecteds: item.totalUnexpecteds,
        savings: item.targetSaving,
      };
    });

    transformedState.sort((a, b) => (a.date > b.date ? 1 : -1));
  
    return transformedState;
  };

  const handleDashboardAggregationChanged = (aggregation) => {
    console.log('[StatisticChart][Aggregation]: ', aggregation);
    setAggregationState(transformAggregationState(dashboardState.getAggregationState()));
 }

 useEffect(() => {
  console.log("[StatisticChart][UseEffect] Initializing Component.");
  dashboardState.addAggregationListener(handleDashboardAggregationChanged);
  setAggregationState(transformAggregationState(dashboardState.getAggregationState()));
}, [dashboardState]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={300}
        data={aggregationState}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="date" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          interval={0}
          tickFormatter={monthTickFormatter}
          height={1}
          scale="band"

          xAxisId="quarter"
        />
        <YAxis  />
        <Tooltip>updatedVisibility</Tooltip>
        <Legend
          onClick={(e) => handleClick(e)}
          payload={Object.keys(seriesVisibility).map((dataKey) => ({ // adjust square box icon next to the text
            value: dataKey,
            type: 'square',
            color: seriesVisibility[dataKey] ? seriesColor[dataKey] : 'gray',
          }))}
          formatter={renderColorfulLegendText}
        />

        <Bar dataKey="expenses" hide={!seriesVisibility["expenses"]} fill={seriesColor["expenses"]} />
        <Bar dataKey="unexpecteds" hide={!seriesVisibility["unexpecteds"]} fill={seriesColor["unexpecteds"]} />
        <Line dataKey="savings" type="monotone" hide={!seriesVisibility["savings"]} stroke={seriesColor["savings"]} strokeWidth="10" />
      </ComposedChart>
    </ResponsiveContainer>
  );

}
