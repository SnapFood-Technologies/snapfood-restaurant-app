import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Input_Label} from "../common/index";
import * as ImagePicker from "expo-image-picker";
import { Entypo, FontAwesome } from '@expo/vector-icons'; 

import {APP_KEY, BASE_URL} from './../../../config/settings';
import {connect} from 'react-redux';
import axios from 'axios';
import {Spinner} from './../common/index';
import {logout} from "../../actions/auth";
// Notification
import {Notifications} from 'expo';
// import push from './../../nortification/push'

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

let {height, width} = Dimensions.get('window');

class Profile extends Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitle: 'Profile', //based on clicked item
      headerTitleStyle: {
        fontWeight: '400',
        fontSize: 17,
        width: "100%",
        textAlign: 'center',
      },
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',
      headerBackTitle: null
    }
  };


  state = {
    //switch1Value: this.state.open,
    loaded: false,
    statistics: {
      ok: null,
      sad: null,
      happy: null
    },
    vendor: {
      title: null,
      address: null,
      phone: null,
      description: null,
      image: null,
      icon: null

    },
    open: null,
    refreshing: false,
    error: ''

  };

  toggleSwitch1 = (value) => {
    this.setState({open: value});

    const {token, vendor} = this.props;

    axios.post(`${BASE_URL}/vendors/${vendor}/open-close-vendor`, {},
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => console.log(response))
      .catch(error => console.log(error.response))


  };

  componentWillMount() {
    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data))
      .catch(error => console.log(error))
  }

  _onRefresh() {
    this.setState({refreshing: true});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data))
      .catch(error => console.log(error))
  }

  //Update state
  updateState = data => {
    const {statistics, vendor} = data;
    this.setState({
      statistics: {
        ok: statistics.ok,
        sad: statistics.sad,
        happy: statistics.happy
      },
      vendor: {
        title: vendor.title,
        address: vendor.address,
        phone: vendor.phone_number,
        description: vendor.description,
        image: vendor.profile_thumbnail_path,
        icon: vendor.logo_thumbnail_path
      },
      open: vendor.is_open === 1 ? true : false,
      loaded: true,
      refreshing: false
    })
  };

  onUpdatePress = () => {
    const {vendor, token} = this.props;
    const {title, description, address, phone} = this.state.vendor;

    if (!title || !address || !phone)
      this.setState({error: "Fill the fields marked with *!"});
    else
      axios.put(`${BASE_URL}/vendors/${vendor}`,
        {
          title: this.state.vendor.title,
          description: this.state.vendor.description,
          address: this.state.vendor.address,
          phone_number: this.state.vendor.phone
        }, {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {
          Alert.alert("Successfully Updated");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");

        });
  };

  updateVendor = (obj) => {
    if (obj instanceof Object) {
      this.setState(
        prevState => Object.assign({}, prevState, obj)
      )
    }
  };

  handleTitleChange = (_title) => {
    this.setState({error: ''});

    this.updateVendor({
      vendor: Object.assign({}, this.state.vendor, {title: _title})
    })
  };


  handlePhoneChange = (_phone) => {
    this.setState({error: ''});

    this.updateVendor({
      vendor: Object.assign({}, this.state.vendor, {phone: _phone})
    })
  };

  handleDescriptionChange = (_description) => {
    this.setState({error: ''});

    this.updateVendor({
      vendor: Object.assign({}, this.state.vendor, {description: _description})
    })
  };

  handleAddressChange = (_address) => {
    this.setState({error: ''});
    this.updateVendor({
      vendor: Object.assign({}, this.state.vendor, {address: _address})
    })
  };

  _pickImage = async () => {


    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);
    if (!result.cancelled) {
      this.setState({vendor: {image: result.uri}})
    }
  };

  _pickIcon = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);
    if (!result.cancelled) {
      this.setState({vendor: {icon: result.uri}})
    }
  };

  renderGenderalDiv = () => {
    console.log(this.state.vendor);
    const {statistics, vendor} = this.state;
    return (
      <View style={styles.header}>
        <View style={styles.leftStyle}>

          <Text style={styles.titleStyle}>{vendor.title}</Text>
          <Text style={styles.restStyle}>{vendor.description.substr(0, 20)}...</Text>


          <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: '5%', marginBottom: '5%'}}>

            <View>
              <Image style={{alignSelf: 'center', width: 25, height: 25}}
                     source={require('../../img/Profile/happy2.png')} //40-40
              />
              <Text style={styles.emotionStyle}>Happy {statistics.happy}%</Text>
            </View>
            <View>
              <Image style={{alignSelf: 'center', width: 25, height: 25}}
                     source={require('../../img/Profile/ok2.png')} //40-40
              />
              <Text style={styles.emotionStyle}>Ok {statistics.ok}%</Text>
            </View>
            <View>
              <Image style={{alignSelf: 'center', width: 25, height: 25}}
                     source={require('../../img/Profile/sad2.png')} //40-40
              />
              <Text style={styles.emotionStyle}>Sad {statistics.sad}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.iconsStyle}>
          <View style={{flexDirection: 'row', marginBottom: '2%', marginRight: '5%'}}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('Order');
            }}>
              <View style={styles.iconStyleBorder}>
                <Image style={{width: 14.5, height: 14.5}}
                       source={require('../../img/Profile/ordersettings-profile.png')}//29-26
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('Gallery');
            }}>
              <View style={styles.iconStyleBorder}>
                <Image style={{width: 14.5, height: 13}} source={require('../../img/Profile/icon1.png')}//29-26
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('Reviews');
            }}>
              <View style={styles.iconStyleBorder}>
                <Image style={{width: 14.5, height: 14}} source={require('../../img/Profile/icon2.png')}//29-28
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('DeliveryRange');
            }}>
              <View style={styles.iconStyleBorder}>
                <Image style={{width: 14.5, height: 14.5}} source={require('../../img/Profile/icon3.png')}//29-29
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginRight: '5%'}}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('PersonalInfo');
            }}>
              <View style={styles.iconStyleBorder}>
                <Image style={{width: 15, height: 14.5}} source={require('../../img/Profile/icon4.png')}//21-30
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('ChangePassword');
            }}>
              <View style={styles.iconStyleBorder}>

                <Image style={{width: 10.5, height: 15}} source={require('../../img/Profile/icon5.png')}//21-30
                />

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('OpeningHours');
            }}>
              <View style={styles.iconStyleBorder}>

                <Image style={{width: 14.5, height: 14.5}} source={require('../../img/Profile/icon6.png')}//29-29
                />
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  };


  onLogoutPress() {

    this.clearAsyncStorageData();
    this.props.onLogout();

  };

  clearAsyncStorageData = async () => {

    await AsyncStorage.removeItem('@SnapFood:auth');

    // // Get the token that uniquely identifies this device
    // let expoToken = push.init();
    // const {token, vendor} = this.props;
    // axios.delete(`${BASE_URL}/vendors/${vendor}/expo-token?token=${expoToken}`,
    //   {headers: {'Authorization': `Bearer ${token}`}});
    // try {
    //   await AsyncStorage.removeItem('@SnapFood:auth');
    // } catch (error) {
    //   // Error saving data
    // }
  };


  renderImageDiv = () => {
    let {image, icon} = this.state.vendor;
    return (
      <View style={{width: width, height: 0.3 * height}}>
        {!image ?
          (
            <View style={{height: 0.3 * height}}>
              <View style={{flexDirection: 'row', marginTop: 5, flex: 1}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Switch
                    style={{transform: Platform.OS === "ios" ? [{scaleX: .7}, {scaleY: .7}] : [{scaleX: 1}, {scaleY: 1}]}}
                    onValueChange={this.toggleSwitch1}
                    value={this.state.open}/>
                </View>
                {/*<View style={{flex: 5, justifyContent: 'center'}}>*/}
                {/*  <Text style={{*/}
                {/*    marginLeft: 5,*/}
                {/*    textAlign: 'center',*/}
                {/*    fontFamily: 'SF_medium',*/}
                {/*    fontSize: 18,*/}
                {/*    color: '#50b7ed'*/}
                {/*  }}>Profile</Text>*/}
                {/*</View>*/}
              </View>

              <View style={{justifyContent: 'center', width: width, alignContent: 'center', alignItems: 'center'}}>
                <View style={{height: 0.17 * height, width: 0.17 * height, borderWidth: 1, borderColor: '#d3d3d3'}}>

                  <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    <TouchableOpacity style={{
                      justifyContent: 'flex-end', alignItems: 'flex-end',
                      paddingRight: 7, paddingBottom: 3
                    }} onPress={this._pickIcon}>
                      <Entypo name="camera" color={'#50b7ed'} size={20}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{
                  height: '50%', width: '10%', justifyContent: 'flex-end', alignItems: 'flex-end',
                  paddingRight: 7, paddingBottom: 3
                }} onPress={this._pickImage}>
                  <Entypo name="camera" color={"#50b7ed"} size={20}/>
                </TouchableOpacity>
              </View>
            </View>)
          :
          (<ImageBackground source={{uri: 'https://snapfood.al/' + image}} style={{
            width: width, height: 0.3 * height,
            justifyContent: 'space-between'
          }}>
            <View style={{flexDirection: 'row', marginTop: 5, flex: 1}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Switch
                  style={{transform: Platform.OS === "ios" ? [{scaleX: .7}, {scaleY: .7}] : [{scaleX: 1}, {scaleY: 1}]}}
                  onValueChange={this.toggleSwitch1}
                  value={this.state.open}/>
              </View>
              <View style={{flex: 5, justifyContent: 'center'}}>
                <Text style={{
                  marginLeft: 5,
                  textAlign: 'center',
                  fontFamily: 'SF_medium',
                  fontSize: 18,
                  color: '#50b7ed'
                }}>Profile</Text>
              </View>
              <TouchableOpacity style={{flex: 1, alignItems: 'flex-end', marginRight: 3, justifyContent: 'center'}}
                                onPress={() => this.onLogoutPress()}>
                <FontAwesome name="sign-out" color={'#50b7ed'} size={20}/>
              </TouchableOpacity>
            </View>

            <View style={{justifyContent: 'center', width: width, alignContent: 'center', alignItems: 'center'}}>
              <ImageBackground source={{uri: 'https://snapfood.al/' + icon}}
                               style={{height: 0.17 * height, width: 0.17 * height}}>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                  <TouchableOpacity style={{
                    justifyContent: 'flex-end', alignItems: 'flex-end',
                    paddingRight: 7, paddingBottom: 3
                  }} onPress={this._pickIcon}>
                    <Entypo name="camera" color={'#50b7ed'} size={20}/>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>

            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <TouchableOpacity style={{
                height: '50%', width: '10%', justifyContent: 'flex-end', alignItems: 'flex-end',
                paddingRight: 7, paddingBottom: 3
              }} onPress={this._pickImage}>
                <Entypo name="camera" color={'#50b7ed'} size={20}/>
              </TouchableOpacity>
            </View>
          </ImageBackground>)
        }
      </View>
    );
  };

  renderError() {
    return (
      <View>
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
      </View>
    );
  }

  renderFormDiv = () => {
    const {vendor} = this.state;
    return (
      <View>
        <View style={{flexDirection: 'row', marginRight: 5}}>

          <Input_Label
            style={{width: "50%", marginBottom: 2, paddingBottom: 5}}
            styleInput={styles.styleInput}
            placeholder="Title"
            value={vendor.title}
            onChangeText={title => this.handleTitleChange(title)}
            label="Title"
            mandatory="*"
          />


          <Input_Label
            style={{width: '50%', marginBottom: 2, paddingBottom: 5}}
            styleInput={styles.styleInput}
            placeholder="Street"
            value={vendor.address}
            onChangeText={address => this.handleAddressChange(address)}
            label="Address"
            mandatory="*"

          />

        </View>
        <View style={{flexDirection: 'row', marginRight: 5}}>

          <Input_Label
            style={{width: '50%', marginBottom: 2, paddingBottom: 5}}
            styleInput={styles.styleInput}
            label="Phone number"
            placeholder="Phone number"
            value={vendor.phone}
            onChangeText={phone => this.handlePhoneChange(phone)}
            keyboardType='numeric'
            mandatory="*"
          />


          <Input_Label
            style={{width: '50%', marginBottom: 2, paddingBottom: 5}}
            styleInput={styles.styleInput}
            label="Partner"
            mandatory=" "
          />

        </View>
        {/*<View style={{flex:1, padding:10, alignItems:'stretch', marginBottom:2,paddingBottom:5,marginRight:5}}>*/}
        {/*<View style={{flexDirection:'row'}}>*/}
        {/*<Text style={styles.styleInputAddress}>Address</Text>*/}
        {/*<Text style={styles.asterixStyle}>*</Text>*/}

        {/*</View>*/}

        {/*<GooglePlacesAutocomplete*/}
        {/*minLength={2}*/}
        {/*autoFocus={false}*/}
        {/*returnKeyType={'default'}*/}
        {/*fetchDetails={false}*/}
        {/*onPress={(data) => {this.handleAddressChange(data.description)}}*/}
        {/*predefinedPlacesAlwaysVisible={false}*/}
        {/*query={{*/}
        {/*// available options: https://developers.google.com/places/web-service/autocomplete*/}
        {/*key: 'AIzaSyBQYwhZCiyxYq6jU7-ZpLju94Ta7dYnlc8\t',*/}
        {/*language: 'al', // language of the results*/}
        {/*types: 'address' // default: 'geocode'*/}
        {/*}}*/}
        {/*getDefaultValue={() => {*/}
        {/*return this.state.vendor.address; // text input default value*/}
        {/*}}*/}
        {/*styles={{*/}
        {/*textInputContainer: {*/}
        {/*backgroundColor:'white',*/}

        {/*borderTopWidth: 0,*/}
        {/*borderBottomWidth:0,*/}
        {/*marginRight: 0,*/}
        {/*paddingRight:5,*/}
        {/*marginLeft:5,*/}
        {/*borderRadius: 5,*/}
        {/*marginTop: -4,*/}
        {/*height:45,*/}


        {/*},*/}
        {/*textInput: {*/}
        {/*lineHeight:23,*/}
        {/*fontSize:17,*/}
        {/*fontFamily:'SF_light',*/}
        {/*color:'#4D4D4D',*/}
        {/*paddingLeft:2*/}
        {/*},*/}
        {/*predefinedPlacesDescription: {*/}
        {/*color: '#1faadb'*/}
        {/*},*/}
        {/*poweredContainer:{*/}
        {/*backgroundColor: '#d3d3d3'*/}
        {/*}*/}
        {/*}}*/}
        {/*currentLocation={false}*/}
        {/*/>*/}

        {/*</View>*/}

        <View style={{flexDirection: 'row', marginRight: 5}}>

          <Input_Label
            style={{marginBottom: 2, paddingBottom: 5}}
            styleInput={[styles.styleInput, {height: 80}]}
            value={vendor.description}
            onChangeText={description => this.handleDescriptionChange(description)}
            label="Description"
          />

        </View>
        {this.renderError()}

        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.onUpdatePress()}
                            style={[styles.buttonStyle, height > 630 ? {height: 40, width: '40%'} : {
                              height: 30,
                              width: '30%'
                            }]}>
            <Text style={[styles.buttonText, height > 630 ? {fontSize: 17} : {fontSize: 14}]}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  };

  checkLoaded = () => {
    if (this.state.loaded)
      return (
        <View>
          {this.renderImageDiv()}

          {this.renderGenderalDiv()}

          {this.renderFormDiv()}
        </View>);
    else
      return <Spinner/>
  };

  render() {


    return (
      <KeyboardAvoidingView behavior={"padding"}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            showsVerticalScrollIndicator={false}>
            {/*<MyStatusBar backgroundColor="#50b7ed" barStyle="light-content"/>*/}

            {this.checkLoaded()}

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // static clearAsyncStorageData() {
  //
  // }
}


const styles = {
  styleInput: {
    fontSize: 17,
    backgroundColor: 'white',
    fontFamily: 'SF_light',
    color: '#4D4D4D',
    marginTop: -4
  },
  buttonText: {
    alignSelf: 'center',
    color: '#ffffff',
    // fontSize:16,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  buttonStyle: {
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 15,
    marginBottom: 15,
    //width:'40%',
    // height:35,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  leftStyle: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
    paddingTop: 7
  },
  iconsStyle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  titleStyle: {
    color: '#000000',
    fontFamily: 'SF_medium',
    fontSize: 18
  },
  restStyle: {
    color: '#4D4D4D',
    fontFamily: 'SF_regular',
    fontSize: 15
  },
  emotionStyle: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: 'SF_regular',
    color: '#4D4D4D',
    justifyContent: 'center'
  },
  iconStyleBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    padding: '3%',
    marginRight: '3%',
    borderRadius: 5,
    borderWidth: 0.7,
    borderColor: '#d3d3d3',
  },
  errorTextStyle: {
    fontSize: 13,
    alignSelf: 'center',
    color: 'red',
    fontFamily: 'SF_regular'
  },
  styleInputAddress: {
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'SF_medium',
    color: '#000000'
  },
  asterixStyle: {
    marginLeft: 5,
    fontSize: 17,
    marginBottom: 10,
    fontFamily: 'SF_medium',
    color: '#cc0000'
  },

  inputStyleText: {
    paddingRight: 5,
    paddingLeft: 10,
    marginLeft: 5,
    lineHeight: 23,
    height: 45,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: 'white',
    fontFamily: 'SF_light',
    color: '#4D4D4D',
    marginTop: -4
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => {
      dispatch(logout())
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
