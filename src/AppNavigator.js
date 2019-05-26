import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';
import Login from './screens/Login';
import DashBoard from './screens/DashBoard';
import ChangeDashboardView from './screens/ChangeDashBoardView'
import SetUpScreen from './screens/SetUpScreen'
import ReportList from './screens/ReportList'
import DetailReportList from './screens/DetailReportList'
import ReportMetabaseScreen from './screens/ReportMetabaseScreen'
import AddReport from './screens/AddReport'
import AddReportType from './screens/AddReportType'



const AppNavigator = createStackNavigator({
    SetUpScreen: { screen: SetUpScreen },
    Login: {
        screen:Login,
        navigationOptions: {
            header:null
        }
    },
    DashBoard: { screen: DashBoard },
    ChangeDashboardView: { screen: ChangeDashboardView },
    ReportList: { screen: ReportList },
    DetailReportList: { screen: DetailReportList },
    ReportMetabaseScreen: { screen: ReportMetabaseScreen },
    AddReport: { screen: AddReport },
    AddReportType: { screen: AddReportType }

},{ initialRouteName: 'SetUpScreen' });
const container = createAppContainer(AppNavigator);
export default container;
