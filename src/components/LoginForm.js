import React, { Component } from "react";
import {
  Alert,
  AsyncStorage,
  Dimensions,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Input, Section, Spinner } from "./common";
import Image from "react-native-remote-svg";
import * as Font from "expo-font";
import { connect } from "react-redux";
import { login, loginSuccess } from "../actions/auth";
import axios from "axios";
import { APP_KEY, BASE_URL } from "./../../config/settings";
import DeviceInfo, { getUniqueId } from "react-native-device-info";
import VersionInfo from "react-native-version-info";
import firebase from "@react-native-firebase/app";

let { height, width } = Dimensions.get("window");

class LoginForm extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: __DEV__ ? "tymi@snapfood.al" : "",
    password: __DEV__ ? "tymi1234" : "",
    error: "",
    loading: false,
    fontLoaded: false,
    deviceId: "",
    deviceName: "",
    appVersion: "",
  };

  // build android branch
  async componentDidMount() {
    let deviceId = await getUniqueId();
    let deviceName = await DeviceInfo.getDeviceName();
    let appVersion = await VersionInfo.appVersion;

    await Font.loadAsync({
      SF_regular: require("../../assets/fonts/SanFranciscoFont-master/SanFranciscoText-Regular.otf"),
      SF_semibold: require("../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Semibold.otf"),
      SF_bold: require("../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Bold.otf"),
      SF_light: require("../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Light.otf"),
      SF_medium: require("../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Medium.otf"),
    });
    this.setState({
      fontLoaded: true,
      deviceId: deviceId,
      deviceName: deviceName,
      appVersion: appVersion,
    });
  }

  async onButtonPress() {
    let token;
    const { email, password, deviceId, deviceName, appVersion } = this.state;
    if (!email || !password) this.setState({ error: "Fill all the fields!" });
    else {
      try {
        token = await firebase.messaging().getToken();
      } catch (e) {
        token = "";
      }

      axios
        .post(`${BASE_URL}/login`, {
          email: email,
          password: password,
          device: {
            token: token,
            uuid: deviceId,
            platform: Platform.OS,
            mode: deviceName,
            version: appVersion,
          },
        })
        .then((response) => {
          this.setAsyncStorageData(response.data);
          this.props.onLoginSuccess(response.data);
        })
        .catch((error) => {
          this.setState({ error: "Wrong Credentials" });
        });
    }
  }

  setAsyncStorageData = async (data) => {
    let object = {
      email: data.user.email,
      token: data.token,
      role: data.role,
      vendor_id: data.vendors[0].id,
      currencyChoosen: data.currencyChoosen,
    };

    let jsonString = JSON.stringify(object);
    try {
      await AsyncStorage.setItem("@SnapFood:auth", jsonString);
    } catch (error) {
      // Error saving data
    }
  };

  renderError() {
    return (
      <View style={{ backgroundColor: "white" }}>
        {this.state.fontLoaded ? (
          <Text style={styles.errorTextStyle}>{this.state.error}</Text>
        ) : null}
      </View>
    );
  }

  render() {
    if (this.state.fontLoaded)
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <Section style={{ marginTop: "15%" }}>
              <Image
                style={[styles.imageStyle, { width: 224, height: 32 }]}
                source={require("../img/login2.png")} //448-64
              />
            </Section>
            <Section style={{ marginBottom: "20%" }}>
              {this.state.fontLoaded ? (
                <Text style={styles.logoStyle}>Restaurant</Text>
              ) : null}
            </Section>
            <Section style={{ paddingBottom: 5 }}>
              <Input
                source={
                  require("../img/chefico.png") //33-32
                }
                styleIcon={{ width: 16.5, height: 16 }}
                fontLoaded={this.state.fontLoaded}
                style={{ flex: 0.85 }}
                placeholder="Email address"
                value={this.state.email}
                onChangeText={(email) => {
                  this.setState({ email, error: "" });
                }}
              />
            </Section>
            <Section>
              <Input
                source={
                  require("../img/lock.png") //23-32
                }
                styleIcon={{ width: 11.5, height: 16 }}
                fontLoaded={this.state.fontLoaded}
                style={{ flex: 0.85 }}
                placeholder="Password"
                secure={true}
                value={this.state.password}
                onChangeText={(password) => {
                  this.setState({ password, error: "" });
                }}
              />
            </Section>
            {this.renderError()}
            <Section>
              <TouchableOpacity
                onPress={this.onButtonPress.bind(this)}
                style={styles.buttonStyle}
              >
                {this.state.fontLoaded ? (
                  <Text style={styles.textStyle}>LOGIN</Text>
                ) : null}
              </TouchableOpacity>
            </Section>
            <View style={{ flex: 1 }} />
            <Image
              resizeMode="cover"
              style={{ width: width, height: 182.5 }}
              source={require("../img/login1.png")} //752-365
            />
          </View>
        </TouchableWithoutFeedback>
      );
    else return <Spinner />;
  }
}

const styles = {
  textStyle: {
    alignSelf: "center",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SF_regular",
  },
  buttonStyle: {
    flex: 0.7,

    alignSelf: "stretch",
    borderRadius: 30,
    backgroundColor: "#50b7ed",
    marginTop: 15,
    shadowColor: "#50b7ed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 2,
    height: 45,
    justifyContent: "center",
  },
  errorTextStyle: {
    fontSize: 13,
    alignSelf: "center",
    color: "red",
    fontFamily: "SF_regular",
  },
  imageStyle: {
    //flex:0.7,
    flexDirection: "row",
    alignSelf: "center",
    marginTop: "8%",
  },
  logoStyle: {
    fontFamily: "SF_regular",
    fontSize: 20,
  },
  image_bottom: {
    // width:width,
    marginTop: "25%",
    flexDirection: "row",
    alignSelf: "center",
  },
};

const loginCall = (email, password) => {
  return axios.post(
    "http://35.185.22.217/public/api/v2/admin/login",
    {
      email: email,
      password: password,
    },
    {
      headers: { "App-Key": "SNAPFOOD-3exeAtM4CMRAKNWNdza92QyP4" },
    }
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (email, password) => {
      dispatch(login(email, password));
    },
    onLoginSuccess: (response) => {
      dispatch(loginSuccess(response));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    apiToken: state.auth.token,
    vendor: state.auth.vendor_id,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
