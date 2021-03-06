import React from 'react';
import { StyleSheet, View,Text } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { Button } from 'native-base';


var dashboard_types = [
    {label: 'Central Dashboard', value: 0 },
    {label: 'Budget Summary Dashboard', value: 1 },
    {label: 'Circle Wise - Salary Expense Dashboard', value: 2 }
];

export default class ChangeDashBoardView extends React.Component {
    state = {
        checked: 'first',
    };

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

    render() {
        const { checked } = this.state;
        return (
            <View style={styles.container}>
                <RadioForm
                    radio_props={dashboard_types}
                    initial={0}
                    onPress={(value) => {this.setState({value:value})}}
                />
                <View style={styles.bottom}>
                    <View style={styles.backgroundColorButton}>
                        <Button block success
                            onPress={() => {
                                console.log('AFTER CHANGE',this.state.value)
                                this.props.navigation.navigate('DashBoard',
                                    {title: 'Dashboard',
                                        dashboardType:this.state.value,
                                    left: null})
                            }
                            }
                        >
                            <Text style={styles.buttonLabel}
                            > Set as Default </Text>
                        </Button>
                    </View>

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
        marginTop: 20,
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
    buttonLabel: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    backgroundColorButton: {
        backgroundColor: '#228b22',
        marginTop: 15,
        width: "100%",
    }
});
