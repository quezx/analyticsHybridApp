import React from 'react';
import {Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Animated} from "react-native";
import StorageHelper from '../helper/StorageHelper';
import { Container, Header, Content, Form, Item, Input, Button, Label } from 'native-base';


export default class Login extends React.Component {

    navigationOptions: {
        header: {
            visible: false
        }
    }

    state = {
        email: '',
        password: ''
    };
    handleEmail = (text) => {
        this.setState({ email: text })
    };
    handlePassword = (text) => {
        this.setState({ password: text })
    };
    login = (email, pass) => {
        this.loginUser(email,pass);
    };
    loginUser(email,pass){
        let details = {
            'username': email,
            'password': pass,
            'client_id':'analyticsquezx',
            'client_secret': 'analyticssecret',
            'grant_type': 'password'
        };

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        const URL = `https://staging-accounts.quezx.com/oauth/token`;
        return fetch(URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            body: formBody,
        }).then((response) => response.json())
            .then((responseJson) => {
                StorageHelper.saveToken(responseJson.access_token);
                StorageHelper.saveRefreshToken(responseJson.refresh_token);
                console.log('RECIEVED DATA AFTER LOGIN==========>',responseJson);

                this.setUpUser(responseJson.access_token);

                this.props.navigation.replace('DashBoard', {title: 'Dashboard',left: null})
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    setUpUser(access_token) {
        const URL = `https://staging-accounts.quezx.com/api/users/me`;
        return fetch(URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${access_token}`
            }
            }).then(user => {
                console.log('USER DETAILS',user);
            StorageHelper.saveUser(user);
            return user;
        })
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <Animated.Image source={require('../../images/quezx_logo.png')} style={[styles.logo]} />
                <Text style={styles.title}>
                    ANALYTICS
                </Text>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    editable = {true}
                    maxLength = {40}
                    onChangeText = {this.handleEmail}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                    editable = {true}
                    maxLength = {40}
                    onChangeText = {this.handlePassword}

                />
                <View style={styles.backgroundColorButton}>
                    <Button block success
                            accessibilityLabel="Learn more about this purple button"
                            onPress={() =>
                                this.login(this.state.email, this.state.password)
                                // this.props.navigation.navigate('DashBoard', {title: 'Dashboard'})
                            }
                    >
                        <Text style={styles.buttonLabel}
                        > LOG IN </Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        width: "90%",
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 5,
        borderColor: 'gray',
        borderWidth: 0.5
    },
    logo: {
        height: 80,
        width: 200,
        padding:10,
        resizeMode: 'contain',
    },
    loginContainer: {
        flex: 1,
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'flex-start',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    title: {
        color: '#a9a9a9',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    labels: {
        color: '#a9a9a9',
        fontSize: 14,
        textAlign: 'left',
        width: "90%",
        fontWeight: 'bold',
        marginTop: 30,
    },
    backgroundColorButton: {
        flex: 1,
        margin: 15,
        width: "90%"
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
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode : 'stretch',
    }
});
