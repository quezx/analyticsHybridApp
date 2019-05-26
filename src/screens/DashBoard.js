import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity, WebView} from 'react-native';
import { getMetaBaseURL } from '../service/FetchURL'
import conn from '../connection/QuezxConection'
import StorageHelper from '../helper/StorageHelper';
import { Footer, FooterTab, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


var dashboard_types = [
    {label: 'Central Dashboard', value: 0 , id: 2, dashboardId: 3},
    {label: 'Budget Summary Dashboard', value: 1 , id: 3,dashboardId: 4},
    {label: 'Circle Wise - Salary Expense Dashboard', value: 2, id: 5,dashboardId: 6 }
];

export default class DashBoard extends React.Component {


    constructor() {
        super();
        this.state = {returnURL: 'https://github.com/facebook/react-native', id: 2, dashboardId: 3, label: 'Central Dashboard'};
        console.log('############ constructor ##################');
    }


    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

    render() {
        console.log('################### render ####################');
        console.log('this.props.navigation.state.params.dashboardType;',this.props.navigation.state.params.dashboardType);
        const { checked } = this.state;
        console.log('COUNTRY ROADS TAKE ME HOME', this.state.returnURL);
        return (
            <View style={styles.container}>
                <View style={styles.top}>
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
                    <WebView
                        source={{uri: this.state.returnURL}}
                        style={{marginTop: 20, height: "100%" }}
                        startInLoadingState={true}
                    />
                    <Footer>
                        <FooterTab>
                            <Button vertical>
                                <Icon name="view-grid" size={30} />
                                <Text>Dashboard</Text>
                            </Button>
                            <Button vertical
                                onPress={() =>
                                    this.props.navigation.navigate('ReportList', {title: 'ReportList'})
                                }
                                >
                                <Icon name="file-find" size={30} />
                                <Text>Reports</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </View>
            </View>
        );
    }

    componentDidMount(): void {
        console.log('############ componentDidMount ##################');
        this.getMetabaseLink()
    }

    async shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        console.log('############ shouldComponentUpdate ##################');
        const selectedDashboard =  dashboard_types.find(dashboard => dashboard.value === nextProps.navigation.state.params.dashboardType);
        console.log('selectedDashboard == ', selectedDashboard);
        if (selectedDashboard) {
            console.log('selectedDashboard.dashboardId == ', selectedDashboard.dashboardId);
            console.log('this.state.dashboardId == ', this.state.dashboardId);
            console.log('CONDITION == ', selectedDashboard.dashboardId === this.state.dashboardId);
        }

        if (!selectedDashboard) return true;
        else if (selectedDashboard.dashboardId === this.state.dashboardId) {
            return false;
        } else {
            await this.setState((state, props) => ({
                dashboardId: selectedDashboard.dashboardId,
                id: selectedDashboard.id,
                returnURL:'',
                label: selectedDashboard.label
            }));
            this.getMetabaseLink();
            return true;
        }
    }


    async getMetabaseLink() {
        console.log('getMetabaseLink ===== ', getMetaBaseURL);
        let metaBaseUrl = "https://marqmeta.quezx.com";

        let token =  await StorageHelper.getToken();
        let refresh_Token = await StorageHelper.getRefreshToken();
        console.log('TOKENISHERE', token);
        console.log('refresh_Token', refresh_Token);


        console.log('THIS>STATE===========>', this.state);

        const URL = `https://staging-analytics.quezx.com/api/dashboard/${this.state.id}?dashboard_id=${this.state.dashboardId}&metabaseUrl=${metaBaseUrl}`;
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
}


function setUpUser(access_token) {
    const URL = `https://staging-accounts.quezx.com/api/users/me`;
    return fetch(URL, {
        method: 'GET',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${access_token}`
        }
    }).then(user => {
        StorageHelper.saveUser(user);
        return user;
    })
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    button: {
        position: 'absolute',
        bottom:0,
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
    },
    top: {
        flex: 1,
        justifyContent: 'flex-start',
        width: "90%",
        marginTop: 15,
    },
    GooglePlusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#509ee3',
        borderWidth: .5,
        borderColor: '#fff',
        height: 40,
        borderRadius: 5,
        paddingLeft: 10,
        justifyContent: 'flex-start'
    },
    input: {
       width: "100%",
    },
    ImageIconStyle: {
        padding: 10,
        marginLeft: 90,
        height: 25,
        width: 25,
        position: 'absolute',
        right: 0,
        justifyContent: 'flex-end',
        resizeMode : 'stretch',
    },
    buttonColor: {
        color: '#fff'
    }
});
