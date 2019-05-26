import React, { Component } from "react";
import {View, StyleSheet, Alert, Text} from "react-native";
import StorageHelper from "../helper/StorageHelper";
import { Container, Header, Content, Form, Item, Input, Button, Label } from 'native-base';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';




export default class AddReport extends React.Component {

    async addReport() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', 'NO-ID');
        let details = {
            'reportIds': [this.state.value],
        };
        let token =  await StorageHelper.getToken();

        // let formBody = [];
        // for (let property in details) {
        //     let encodedKey = encodeURIComponent(property);
        //     let encodedValue = encodeURIComponent(details[property]);
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        console.log('this.state.value',this.state.value);
        // formBody = formBody.join("&");

        const URL = `https://staging-analytics.quezx.com/api/reportCategory/${id}`;
        return fetch(URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization: `Bearer ${token}`

            },
            body: JSON.stringify(details),
        }).then((response) => response.json())
            .then((responseJson) => {
               console.log('data after add report',responseJson);
                Alert.alert(
                    'Successfully added',
                    'Report Successfully added',
                    [
                        {text: 'OK', onPress: () =>
                                this.props.navigation.navigate('DetailReportList',{
                                    title: navigation.state.params.title,
                                    id:navigation.getParam('id', 'NO-ID'),
                                })
                        },
                    ],
                    {cancelable: false},
                );

               return responseJson;

            })
            .catch((error) => {
                console.error(error);
            });

    }

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => ({
        title: `Add Report to ${navigation.state.params.title}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },

    });


    state = {
        //Assing a array to your pokeList state
        pokeList: [{
            value:'0',
            label: 'MOM'
        }],
        //Have a loading state where when data retrieve returns data.
        loading: true,
        checked: 'first'
    }
    //Define your componentDidMount lifecycle hook that will retrieve data.
    //Also have the async keyword to indicate that it is asynchronous.
    async componentDidMount() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', 'NO-ID');
        console.log('NAVIGATION ID',id);
        let token =  await StorageHelper.getToken();
        const URL = `https://staging-analytics.quezx.com/api/reportCategory/${id}/upMappedReport`;
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
            let pokemon = await pokemonApiCall.json();
            pokemon = pokemon.data.map(e => ({label: e.name, value: e.id}));
            this.setState({pokeList: pokemon, loading: false});
            console.log("LISTAFTERMAP",pokemon);
            console.log("LISTINADDREPORT",this.state.pokeList);
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }

    render() {
        console.log('RENDER');
        //Destruct pokeList from state.
        const { pokeList, value } = this.state;


            return <View style={styles.container}>
                <RadioForm
                    radio_props={pokeList}
                    initial={0}
                    onPress={(value) => {this.setState({value:value})}}
                />
                <View style={styles.bottom}>
                    <View style={styles.backgroundColorButton}>
                        <Button block success
                            onPress={() => {
                                this.addReport()
                            }
                            }
                        >
                            <Text style={styles.buttonLabel}
                            > ADD </Text>
                        </Button>
                    </View>

                </View>
            </View>

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    button: {
        position: 'absolute',
        bottom:0,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
        width: "90%",
    },
    backgroundColorButton: {
        backgroundColor: '#228b22',
        marginTop: 15,
        width: "100%",
    }
})


