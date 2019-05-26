import React, {Component} from 'react';
import StorageHelper from '../helper/StorageHelper';
import {Text, View} from "react-native";


export default class SetUpScreen extends Component {

   async componentDidMount(): void {
       let token = await StorageHelper.getUser();
       console.log('USERDETAILS',token);
       if (token) {
           this.props.navigation.replace('DashBoard', {title: 'Dashboard',left: null})
       } else {
           this.props.navigation.replace('Login', {title: 'Login', left: null})
       }
   }
   constructor(props) {
        super(props);

    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>Loading...</Text>
            </View>
        )
    }
}
