import React from 'react';
import {Button, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import StorageHelper from '../helper/StorageHelper';


export default class Login extends React.Component {
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
            'client_id':'analyticsapp',
            'client_secret': 'analyticshybridapp',
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
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#4F6D7A"
                />
                <Image style={styles.logo} source={require('../../images/quezx_logo.png')} />
                <Text style={styles.title}>
                    ANALYTICS
                </Text>
                <Text style={styles.labels}>
                    User Name
                </Text>
                <View style={[styles.row, styles.underline]}>
                    <TextInput
                        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                        editable = {true}
                        maxLength = {40}
                        onChangeText = {this.handleEmail}
                    />
                </View >
                <Text style={styles.labels}>
                    Password
                </Text>
                <View style={[styles.row, styles.underline]}>
                    <TextInput
                        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                        editable = {true}
                        maxLength = {40}
                        onChangeText = {this.handlePassword}
                    />
                </View >
                <View style={styles.backgroundColorButton}>
                    <Button
                        title="LOGIN"
                        color="#ffffff"
                        accessibilityLabel="Learn more about this purple button"
                        onPress={() =>
                            this.login(this.state.email, this.state.password)
                            // this.props.navigation.navigate('DashBoard', {title: 'Dashboard'})
                        }
                    />
                </View>
                <Text style={styles.welcome}>
                    OR
                </Text>
                <TouchableOpacity style={[styles.GooglePlusStyle, styles.input]} activeOpacity={0.5}>
                    {<Image
                        source={require('../../images/google_icon.png')}
                        style={styles.ImageIconStyle}
                    />}
                    <Text> Sign in with Google </Text>
                </TouchableOpacity>
                <Text style={styles.labels}>
                    Forgot Password
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logo: {
        height: 80,
        width: 156,
        resizeMode: 'contain',
    },
    title: {
        color: '#a9a9a9',
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
    underline: {
        width:'90%',
        borderColor: '#a9a9a9',
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
        paddingBottom:10,
    },
    backgroundColorButton: {
        backgroundColor: '#228b22',
        marginTop: 15,
        width: "90%",
    },
    signInWithGoogle: {
        backgroundColor: '#ffffff',
        marginTop: 15,
        width: "90%",
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
    },
    input:
        {
            width: "90%",

        }
});