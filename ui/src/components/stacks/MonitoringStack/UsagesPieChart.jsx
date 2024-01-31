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
import { useEffect, useContext, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ExpensesContext } from '../../../utils/AppUtil';
import { Skeleton } from '@mui/material';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export default function UsagesPieChart() {
  const expensesState = useContext(ExpensesContext);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExpensesChanged = (expenses) => {
    console.log('[UsagesPieChart][Expenses]: ', expenses);
    setLoading(false);
    setExpenses(expenses);
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: 6,
    textAlign: "center",
    color: theme.palette.text.secondary,
    boxShadow: "0px 6px 8px #45464a"
  }));

  useEffect(() => {
    console.log("[UsagesPieChart][UseEffect] Initializing Component.");
    expensesState.addListener(handleExpensesChanged);
    setExpenses(expensesState.getState());
  }, [expensesState]);

  return (
    loading ?
      <Skeleton sx={{ bgcolor: 'grey.500' }} variant="rounded" height={385} />
      :
      <Item style={{ height: "375px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={expenses}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="name" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </Item>
  );

}
