import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import StorageHelper from "../helper/StorageHelper";
import Icon from 'react-native-vector-icons/Ionicons';
import { Form, Item, Input, Label, Button } from 'native-base';

export default class ReportList extends React.Component {

    constructor(props) {
        super(props);
    }


    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

    state = {
        //Assing a array to your pokeList state
        pokeList: [],
        //Have a loading state where when data retrieve returns data.
        loading: true
    }
    //Define your componentDidMount lifecycle hook that will retrieve data.
    //Also have the async keyword to indicate that it is asynchronous.
    async componentDidMount() {
        console.log('componentDidMount');

        let token =  await StorageHelper.getToken();
        const URL = 'https://staging-analytics.quezx.com/api/category';
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
            this.setState({ pokeList: pokemon.data, loading: false }, () => {
                console.log('STATE IS CHANGED NOW');

            });
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
    //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
    renderItem() {
        return (data) => {
            console.log('PROPS DATA',this);
            console.log('THEDATAAFTER ADDITION',data);
            let reportCount = 0;
            if (data.item.ReportCount > 0) {
                reportCount = data.item.ReportCount;
            }
            if (data.item.addNew) {
                return <TouchableOpacity
                    style={{backgroundColor: 'transparent'}}>
                    <View  style={styles.listItemContainer}>
                        <View
                            style={styles.addNewCardViewStyle}
                        >
                            <Icon name="ios-list-box" size={30} color="#4F8EF7" />
                            <Form>
                                <Item inlineLabel>
                                    <Label>Enter Report Name</Label>
                                    <Input />
                                </Item>
                            </Form>
                            <TouchableOpacity style={[styles.GooglePlusStyle, styles.input]} activeOpacity={0.5}>
                                <Button success><Text> Save </Text></Button>
                                <Button light><Text> Cancel </Text></Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            }
            if (data.item.plusImage){
                return <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('AddReportType')}
                    style={{backgroundColor: 'transparent'}}>
                    <View  style={styles.listItemContainer}>
                        <View
                            style={styles.addNewCardViewStyle}
                        >
                            <Icon name="ios-add" size={30} color="#4F8EF7" />
                            <Text style={styles.cardView_InsideText}>Add New</Text>

                        </View>
                    </View>
                </TouchableOpacity>
            }else{
                return <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('DetailReportList',{
                        title: data.item.name,
                        id:data.item.id,
                    })}
                    style={{backgroundColor: 'transparent'}}>
                    <View  style={styles.listItemContainer}>
                        <View
                            style={styles.cardViewStyle}
                        >
                            <Icon name="ios-folder" size={30} color="#4F8EF7" />
                            <Text style={styles.cardView_InsideText}>{data.item.name}({reportCount})</Text>

                        </View>
                    </View>
                </TouchableOpacity>
            }

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
                    data={[...pokeList, { plusImage: true, name: 'PlusImage' }]}
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

        width: 300,
        height: 200,
        backgroundColor: '#fff',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    addNewCardViewStyle:{

        width: 300,
        height: 200,
        backgroundColor: '#e5e9ea',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardView_InsideText:{

        fontSize: 18,
        color: '#000',
        textAlign: 'center',

    },
    GooglePlusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: .5,
        borderColor: '#fff',
        height: 40,
        borderRadius: 5,
        paddingLeft: 90
    }
})


