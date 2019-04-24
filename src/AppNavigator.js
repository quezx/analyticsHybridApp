import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';
import Login from './screens/Login';
import DashBoard from './screens/DashBoard';
import ChangeDashboardView from './screens/ChangeDashBoardView'
import SetUpScreen from './screens/SetUpScreen'
import ReportList from './screens/ReportList'
import DetailReportList from './screens/DetailReportList'

import Ionicons from "react-native-vector-icons/Ionicons";
const ReportListDetail = createStackNavigator({
        DetailReportList: { screen: DetailReportList },
        ReportList: { screen: ReportList}
},{
    initialRouteName: 'ReportList',
    navigationOptions: () => ({
        title: `A`,
        headerBackTitle: null
    }),
    }

);
const TabNavigator = createBottomTabNavigator(
    {
        DashBoard: { screen: DashBoard },
        Reports: { screen: ReportListDetail },
    },
    {
        initialRouteName: 'DashBoard',
        navigationOptions: ({ navigation }) => {
            const { index } = navigation.state;
            let title;
            if (index === 0) {
                title = 'DashBoard';
            } else if (index === 1) {
                title = 'Reports';
            }
            return { title };
        },
        defaultNavigationOptions: ({ navigation }) => {
            const { routeName } = navigation.state;

            const tabBarLabel = () => {
                console.log('qqqqqqqqqqqqqqq');
                let title;
                if (routeName === 'DashBoard') {
                    title = 'DashBoard';
                } else if (routeName === 'Reports') {
                    title = 'Reports';
                }
                return <Text>{title}</Text>
            };

            const tabBarIcon = ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName;
                if (routeName === 'DashBoard') {
                    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
                } else if (routeName === 'Reports') {
                    iconName = `ios-checkmark-circle${focused ? '' : '-outline'}`;
                }
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            };

            return {tabBarIcon, tabBarLabel };
        },
        tabBarOptions: {
            activeTintColor: '#42f44b',
            inactiveTintColor: 'gray',
        },

    }
);


const AppNavigator = createStackNavigator({
    SetUpScreen: { screen: SetUpScreen },
    Login: { screen: Login },
    DashBoard: { screen: TabNavigator },
    ChangeDashboardView: { screen: ChangeDashboardView },



},{ initialRouteName: 'SetUpScreen' });
const container = createAppContainer(AppNavigator);
export default container;
