import React,{Component} from 'react';
import { AsyncStorage } from 'react-native';
import * as Font from "expo-font";
import {connect} from 'react-redux';
import LoginForm from './src/components/LoginForm';
import MainNavigator from "./src/navigation";
import { storeAuthData } from './src/actions/auth';
import firebase from '@react-native-firebase/app';
// import pushNotificationService from './src/nortification/push';



class IntroScreen extends Component {

    state = {
        fontLoaded: false,
    };


    async UNSAFE_componentDidMount() {
        await Font.loadAsync({
            'SF_regular': require('./assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Regular.otf'),
            'SF_semibold':require('./assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Semibold.otf'),
            'SF_bold':require('./assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Bold.otf'),
            'SF_light':require('./assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Light.otf'),
            'SF_medium':require('./assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Medium.otf')
        });

        this.setState({ fontLoaded: true });

    }

   async UNSAFE_componentWillMount(){
        this.getAsyncStorageData();
        await firebase.messaging().requestPermission();
    }

    getAsyncStorageData = async () => {
        try {
            const value = await AsyncStorage.getItem('@SnapFood:auth');
            if (value !== null){
                // We have data!!
                this.props.onStoreAuthData(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    render() {
        if (!this.props.isLoggedIn) {
            return <LoginForm />;
        } else {
            return <MainNavigator/>;
        }
    }
}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onStoreAuthData: data => dispatch(storeAuthData(data))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);









