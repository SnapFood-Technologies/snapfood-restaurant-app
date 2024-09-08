import React, {Component} from 'react';
import {Alert, Dimensions, Image, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Input_Label, Section, Spinner} from "../common/index";
import axios from 'axios';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import PopupDialog from 'react-native-popup-dialog';

let {height} = Dimensions.get('window');

class PersonalInfo extends Component {


  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: <Text style={{fontWeight: "400", fontSize: 17}}>Personal Info</Text>,
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
      email: '',
      full_name: '',
      phone: '',
      error: '',
      loaded: false
    };

  }

  onButtonPress() {
    const {email, full_name, phone} = this.state;
    const {token, vendor} = this.props;
    if (!email || !full_name || !phone)
      this.setState({error: 'Fill all the fields'});
    else {
      let data = {
        email: email,
        full_name: full_name,
        phone: phone,
      };


      axios.put(`${BASE_URL}/users/${vendor}`, data,
        {headers: {"App-Key": APP_KEY, "Authorization": `Bearer ${token}`}})
        .then(response => {
          //this.showDialog();
          Alert.alert("Updated Successfully");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");

        });
    }
  }

  showDialog = () => {
    this.popupDialog.show();
  };

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


  componentWillMount() {
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/users/${vendor}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({
          email: response.data.user.email,
          full_name: response.data.user.full_name,
          phone: response.data.user.phone, loaded: true
        }),
      )
      .catch(error => console.log(error))
  }


  render() {


    const {email, full_name, phone} = this.state;
    if (this.state.loaded)
      return (


        <View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={{backgroundColor: 'white', height: height}}>
              <View style={{marginLeft: 8, marginRight: 10, marginTop: 10, flexDirection: 'row'}}>

                <Section style={{width: '50%'}}>
                  <Input_Label
                    value={full_name}
                    styleInput={styles.styleInput}
                    placeholder="Ex. Restaurant Name"
                    label="Full Name"
                    onChangeText={full_name => {
                      this.setState({full_name, error: ''})
                    }}
                  />
                </Section>

                <Section style={{width: '50%'}}>
                  <Input_Label
                    value={phone}
                    styleInput={styles.styleInput}
                    placeholder="Ex. +355........."
                    label="Mobile Number"
                    keyboardType='numeric'
                    onChangeText={phone => {
                      this.setState({phone, error: ''})
                    }}
                  />
                </Section>


              </View>

              <Section style={{marginLeft: 8, marginRight: 10}}>
                <Input_Label
                  value={email}
                  onChangeText={email => {
                    this.setState({email, error: ''})
                  }}
                  styleInput={styles.styleInput}
                  placeholder="Ex. rest@.mail.com"
                  label="Email"
                />
              </Section>

              {this.renderError()}
            </View>
          </TouchableWithoutFeedback>

          <PopupDialog ref={(popupDialog) => {
            this.popupDialog = popupDialog;
          }}
                       width={0.7}
                       height={0.12}
                       containerStyle={styles.popup}
          >
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
              <View style={styles.popupImage}>
                <Image style={{width: 30, height: 30}}
                       source={require('./../../img/success.png')}/>
              </View>
              <View>
                <Text style={styles.popupText}>Changes were saved!!</Text>
              </View>
            </View>
          </PopupDialog>
        </View>
      );

    else
      return <Spinner/>
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
  popup: {
    alignItems: 'center',
  },
  popupImage: {
    paddingTop: 10,
    alignItems: 'center',
  },
  popupText: {
    textAlign: 'center',
    fontFamily: 'SF_light',
    fontSize: 13,
  }
}


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(PersonalInfo);

