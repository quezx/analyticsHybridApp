import React, { Component } from "react";
import {View, StyleSheet, Alert, TouchableOpacity, Text} from "react-native";
import StorageHelper from "../helper/StorageHelper";

import Icon from 'react-native-vector-icons/Ionicons';
import {Form, Input, Item, Label, Button, Container,Content,Header} from "native-base";




export default class AddReportType extends React.Component {

    state = {
        name: '',
        password: ''
    };
    handleName = (text) => {
        this.setState({ name: text })
    };

    async addReportType(name) {
        const { navigation } = this.props;
        const id = navigation.getParam('id', 'NO-ID');
        let details = {
            'name': name,
        };
        let token =  await StorageHelper.getToken();

        console.log('this.state.value',this.state.value);


        const URL = `https://staging-analytics.quezx.com/api/category`;
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
                    'Report Type Successfully added',
                    [
                        {text: 'OK', onPress: () =>
                                this.props.navigation.navigate('ReportList', {title: 'ReportList'})
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



    //Define your componentDidMount lifecycle hook that will retrieve data.
    //Also have the async keyword to indicate that it is asynchronous.
    async componentDidMount() {

    }

    render() {
        console.log('RENDER OF REPORTTYPE ADD');
        //Destruct pokeList from state.
        return <View  style={styles.listItemContainer}>
                <View
                    style={styles.cardViewStyle}
                >
                    <Icon name="ios-folder" size={30} color="#4F8EF7" />
                      <Content style={styles.contentStyle}>
                      <Form>
                      <Item floatingLabel>
                      <Label>Enter Report Type</Label>
                          <Input
                              {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                              editable = {true}
                              maxLength = {40}
                              onChangeText = {this.handleName}
                          />
                      </Item>
                      </Form>
                      <TouchableOpacity style={[styles.GooglePlusStyle, styles.input]} activeOpacity={0.5}>
                          <Button success
                                  style={styles.buttonMarginRight}
                                  onPress={() =>
                                      this.addReportType(this.state.name)
                                  }
                          ><Text> Save </Text></Button>
                          <Button light
                          onPress={()=>  this.props.navigation.navigate('ReportList', {title: 'ReportList'})
                          }
                          ><Text> Cancel </Text></Button>
                      </TouchableOpacity>
                      </Content>

                </View>
            </View>

    }
}
const styles = StyleSheet.create({
    contentStyle: {
        width:'90%',
        flexWrap:'wrap'
    },
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
    buttonMarginRight: {
      marginRight: 10
    },
    GooglePlusStyle: {
        marginTop: 30,
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


