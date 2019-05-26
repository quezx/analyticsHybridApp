import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import StorageHelper from "../helper/StorageHelper";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button, Form, Input, Label} from "native-base";
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';


const MaterialHeaderButton = props => (
    <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="blue" />
);

export default class DetailReportList extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
        headerRight: (
            <HeaderButtons
                HeaderButtonComponent={MaterialHeaderButton}>
                <Item title="plus" iconName="add" onPress={() =>
                    navigation.navigate('AddReport', {
                        title: `${navigation.state.params.title}`,
                        id:navigation.getParam('id', 'NO-ID'),

                    })
                } />
            </HeaderButtons>
        ),
    });


    state = {
        //Assing a array to your pokeList state
        pokeList: [],
        //Have a loading state where when data retrieve returns data.
        loading: true,
        id:{}
    }
    //Define your componentDidMount lifecycle hook that will retrieve data.
    //Also have the async keyword to indicate that it is asynchronous.
    async componentDidMount() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', 'NO-ID');
        console.log('NAVIGATION ID',id);
        let token =  await StorageHelper.getToken();
        const URL = `https://staging-analytics.quezx.com/api/reportCategory/${id}`;
        //Have a try and catch block for catching errors.
        try {
            //Assign the promise unresolved first then get the data using the json method.
            const pokemonApiCall = await fetch(URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                    //  Authorization: 'Bearer f588b0f54cd93661448260e4d5dee159e936b4aa'
                }});
            const pokemon = await pokemonApiCall.json();
            this.setState({pokeList: pokemon.data, loading: false});
            console.log("LIST",pokemon.data);
            console.log("LIST",pokeList);
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }

    renderItem() {
        return (data) => {
            console.log('DETAILREPORT DATA',data.item);

            return <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ReportMetabaseScreen',{
                    title: data.item.Report.name,
                    id:data.item.report_id,
                    metaBaseURL:data.item.Report.Connection.metabase_url,
                    question_id: data.item.Report.question_id,
                })}
                style={{backgroundColor: 'transparent'}}>
                <View  style={styles.listItemContainer}>
                    <View
                        style={styles.cardViewStyle}
                    >
                        <Text style={styles.cardView_InsideText}>{data.item.Report.name}</Text>

                    </View>
                </View>
            </TouchableOpacity>
        }

    }

    render() {
        console.log('RENDER');
        //Destruct pokeList and Loading from state.
        const { pokeList, loading } = this.state;
        //If laoding to false, return a FlatList which will have data, rednerItem, and keyExtractor props used.
        //Data contains the data being  mapped over.
        //RenderItem a callback return UI for each item.
        //keyExtractor used for giving a unique identifier for each item.
        if(!loading) {
            return <View>
                <TouchableOpacity
                    style={[styles.GooglePlusStyle, styles.input]}
                    activeOpacity={0.5}
                    onPress={() =>
                        this.props.navigation.navigate('ChangeDashboardView', {title: 'ChangeDashboardView'})
                    }>
                    <Text style={styles.buttonColor}>{this.state.label}</Text>
                    {<Image
                        source={require('../../images/arrow_right.png')}
                        style={styles.ImageIconStyle}
                    />}
                </TouchableOpacity>
                <FlatList
                    data={[...pokeList]}
                    renderItem={this.renderItem()}
                    extraData={this.state}
                    keyExtractor={(item) => {
                        console.log('1111eeeeeeehbchdbcjhdsbjhdsbjsbdvjsbd === ', item);
                        return item.name;
                    }}
                />
            </View>
        } else {
            return <ActivityIndicator />
        }
    }
    _onPress(item) {
        Alert.alert(item.name);
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pokeItemHeader: {
        color: '#000',
        fontSize: 18,
    },
    pokeImage: {
        backgroundColor: 'transparent',
        height: 50,
        width: 50,
    },
    cardViewStyle:{
        width: '90%',
        height: '90%',
        padding: 10,
        backgroundColor: '#fff',
        margin: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    cardView_InsideText:{

        fontSize: 18,
        color: '#000',
        textAlign: 'center',

    }
})


