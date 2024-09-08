import React, {Component} from 'react';
import {Alert, Dimensions, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Input_Label, Section} from "../common/index";
import axios from "axios/index";
import {APP_KEY, BASE_URL} from "../../../config/settings";
import {connect} from 'react-redux';

var {height} = Dimensions.get('window');


class ChangePassword extends Component {


  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: <Text style={{fontWeight: "400", fontSize: 17}}>Change Password</Text>,
      headerRight: <TouchableOpacity onPress={() => {
        params.handleThis()
      }}><Text style={{fontWeight: "100", marginRight: 10, fontSize: 15}}>Done</Text></TouchableOpacity>,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',
    }
  };


  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.onButtonPress.bind(this)
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      newPassword: '',
      newPassword2: '',
    };

  }

  onButtonPress() {
    const {password, newPassword, newPassword2} = this.state;
    const {token, vendor} = this.props;
    if (!password || !newPassword || !newPassword2)
      this.setState({error: 'Fill all the fields'});
    else if (newPassword2 !== newPassword)
      this.setState({error: 'The new passwords do not match'});
    else if (newPassword == password)
      this.setState({error: 'New password is required'});
    else {
      axios.post(`${BASE_URL}/change-password`,
        {
          now_password: password,
          password: newPassword,
          password_confirmation: newPassword2,
        },
        {headers: {"App-Key": APP_KEY, 'Authorization': `Bearer ${token}`}})
        .then(response => {
          this.resetState();
          Alert.alert("Updated Successfully");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");

        });


    }

  }

  renderError() {
    return (
      <View style={{backgroundColor: 'white'}}>
        {
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        }
      </View>
    );
  }

  resetState = () => {
    this.setState({password: null, newPassword: null, newPassword2: null})
  }


  render() {

    const {password, newPassword2, newPassword} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={{backgroundColor: 'white', height: height}}>
          <Section style={{marginLeft: 8, marginTop: 10, marginRight: 10}}>
            <Input_Label
              value={password}
              styleInput={styles.styleInput}
              label="Current Password"
              secure={true}
              onChangeText={password => {
                this.setState({password, error: ''})
              }}
            />
          </Section>
          <Section style={{marginLeft: 8, marginRight: 10}}>
            <Input_Label
              value={newPassword}
              styleInput={styles.styleInput}
              label="New Password"
              secure={true}
              onChangeText={newPassword => {
                this.setState({newPassword, error: ''})
              }}
            />
          </Section>
          <Section style={{marginLeft: 8, marginRight: 10}}>
            <Input_Label
              value={newPassword2}
              styleInput={styles.styleInput}
              label="Re-type New Password"
              secure={true}
              onChangeText={newPassword2 => {
                this.setState({newPassword2, error: ''})
              }}
            />
          </Section>
          {this.renderError()}
        </View>
      </TouchableWithoutFeedback>

    );
  }


}

const styles = {
  styleInput: {
    fontSize: 17,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    fontFamily: 'SF_light'
  },
  errorTextStyle: {
    fontSize: 14.5,
    alignSelf: 'center',
    color: '#e2353e',
    fontFamily: 'SF_medium'
  },
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(ChangePassword);
