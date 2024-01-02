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
package com.budgeta.sdk.api.repository;

import com.budgeta.sdk.api.model.Dashboard;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DashboardRepository extends MongoRepository<Dashboard, String> {
    List<Dashboard> findByYearAndMonth(int year, int month);

    /**
     * The aggregation query will group Expenses, Unexpecteds and Savings for each month based on the dashboardId association.
     * Note: Mandatory usage of preserveNullAndEmptyArrays: true, otherwise it will exclude documents if there are no
     * unexpected records for the specified dashboardId
     *
     * @return aggregated list of Dashboard objects including the fields totalExpenses, totalUnexpecteds, targetSaving
     */
    @Aggregation(pipeline = {
            "{$lookup: {from: 'expenses', let: {id: '$_id'}, pipeline: [{$match: {$expr: {$eq: [{$toObjectId: '$dashboardId'}, '$$id']}}}], as: 'expenses'}}",
            "{$unwind: { path: '$expenses', preserveNullAndEmptyArrays: true }}",
            "{$group: { _id: '$_id', month: {$first: '$month'}, year: {$first: '$year'}, readOnly: {$first: '$readOnly'}, totalExpenses: {$sum: {$toDouble: '$expenses.value'}}}}",
            "{$lookup: {from: 'unexpecteds', let: {id: '$_id'}, pipeline: [{$match: {$expr: {$eq: [{$toObjectId: '$dashboardId'}, '$$id']}}}], as: 'unexpecteds'}}",
            "{$unwind: { path: '$unexpecteds', preserveNullAndEmptyArrays: true }}",
            "{$group: { _id: '$_id', month: {$first: '$month'}, year: {$first: '$year'}, readOnly: {$first: '$readOnly'}, totalExpenses: {$first: '$totalExpenses'}, totalUnexpecteds: {$sum: {$toDouble: '$unexpecteds.value'}}}}",
            "{$lookup: {from: 'cost_analytics', let: {id: '$_id'}, pipeline: [{$match: {$expr: {$eq: [{$toObjectId: '$dashboardId'}, '$$id']}}}], as: 'costAnalytics'}}",
            "{$unwind: { path: '$costAnalytics', preserveNullAndEmptyArrays: true }}",
            "{$group: { _id: '$_id', month: {$first: '$month'}, year: {$first: '$year'}, readOnly: {$first: '$readOnly'}, totalExpenses: {$first: '$totalExpenses'}, totalUnexpecteds: {$first: '$totalUnexpecteds'}, targetSaving: {$first: '$costAnalytics.targetSaving'}}}"
    })
    List<Dashboard> getAggregatedDashboards();

    List<Dashboard> findByYearOrderByMonthDesc(int i);

    List<Dashboard> findByYear(int year);

    List<Dashboard> findByYearOrderByMonthAsc(int year);
}
