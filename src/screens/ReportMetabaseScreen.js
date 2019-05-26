import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    WebView
} from "react-native";
import { List } from "react-native-elements";
import StorageHelper from "../helper/StorageHelper";
import {getMetaBaseURL} from "../service/FetchURL";

export default class ReportMetabaseScreen extends React.Component {

    constructor() {
        super();
        this.state = {returnURL: 'https://github.com/facebook/react-native'};
        console.log('############ constructor ##################');
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });


    componentDidMount(): void {
        console.log('############ componentDidMount ##################');
        this.getMetabaseLink()
    }



    async getMetabaseLink() {
        console.log('getMetabaseLink ===== ', getMetaBaseURL);

        const { navigation } = this.props;
        const id = navigation.getParam('id', 'NO-ID');
        const metaBaseURL = navigation.getParam('metaBaseURL','NO-URL');
        const question_id = navigation.getParam('question_id','question_id');
        console.log('NAVIGATION INMETABASE SCREEN',id,metaBaseURL,question_id);

        let token =  await StorageHelper.getToken();
        let refresh_Token = await StorageHelper.getRefreshToken();
        console.log('TOKENISHERE', token);
        console.log('refresh_Token', refresh_Token);


        console.log('THIS>STATE===========>', this.state);

        const URL = `https://staging-analytics.quezx.com/api/report/${id}?metabaseUrl=${metaBaseURL}&question_id=${question_id}`;
        fetch(URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
                //  Authorization: 'Bearer f588b0f54cd93661448260e4d5dee159e936b4aa'
            }
        })
            .then((res) => Promise.all([res.status, res.json()]))
            .then(([statusCode, data]) => {
                console.log("statusCode",statusCode);
                console.log("data",data);
                if (statusCode === 401){
                    this.refreshToken(refresh_Token);
                }
                this.setState((state, props) => ({
                    returnURL: data.toString(),
                }), () => {
                    console.log('SURTHI',this.state);
                    return true;
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    refreshToken(refresh_Token) {
        let details = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_Token,
            'client_id': 'analyticsquezx',
            'client_secret': 'analyticssecret'
        };

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        console.log('formBody', formBody);

        const URL = `https://staging-accounts.quezx.com/oauth/token`;
        return fetch(URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
        }).then((response) => Promise.all([response.status, response.json()])
            .then(([statusCode, responseJson]) => {
                StorageHelper.saveToken(responseJson.access_token);
                StorageHelper.saveRefreshToken(responseJson.refresh_token);
                console.log('ACCESSTOKEN', responseJson.access_token);
                console.log('ONREFRESHTOKENSTATUSCODE', statusCode);
                console.log('RECIEVED DATA==========>', responseJson);
                //this.setUpUser(responseJson.access_token);
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            }));
    }

    render() {
        console.log('################### render ####################');
        console.log('this.props.navigation.state.params.dashboardType;',this.props.navigation.state.params.dashboardType);
        const { checked } = this.state;
        console.log('COUNTRY ROADS TAKE ME HOME', this.state.returnURL);
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <WebView
                        source={{uri: this.state.returnURL}}
                        style={{marginTop: 20, height: "100%",backgroundColor: '#000' }}
                        startInLoadingState={true}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    listItemContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    top: {
        flex: 1,
        justifyContent: 'flex-start',
        width: "90%",
        marginTop: 15,
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


