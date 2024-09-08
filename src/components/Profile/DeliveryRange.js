import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import Slider from 'react-native-slider';
import NotificationBadge from '../common/NotificationBadge';
import {Spinner} from "../common";

let {height, width} = Dimensions.get('window');

class DeliveryRange extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: <Text style={{fontWeight: "400", fontSize: 17}}>Delivery Range</Text>,
      headerRight: <TouchableOpacity onPress={() => {
        navigation.navigate('Notifications');
      }}>
        <NotificationBadge/>
      </TouchableOpacity>,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      search: null,
      height: 0,
      loaded: false,
      valueSlider: 0,
      minSlider: 0,
      maxSlider: null,
      sliders: [],
      valueFee: null,
      editMaxRange: null,
      reachedMax: null,
      error: '',
      saveRanges: [],
      deaful_fee: null

    };

  }

  componentWillMount() {
    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}/delivery-range`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({
          maxSlider: response.data.max_range, editMaxRange: response.data.max_range,
          deaful_fee: response.data.deaful_fee, sliders: response.data.ranges, loaded: true
        });
        if (this.state.sliders.length !== 0)
          this.setState({
            minSlider: this.state.sliders[this.state.sliders.length - 1].to,
            valueSlider: this.state.sliders[this.state.sliders.length - 1].to
          })
      })
      .catch(error => console.log(error));


  }

  EditMaxRange = (value) => {

    const {token, vendor} = this.props;

    if (value === '' || value === null)
      Alert.alert("Please fill the maximum range");
    else if (value < this.state.maxSlider) {
      Alert.alert("Please delete all ranges and fill the maximum range again!");
      this.setState({editMaxRange: this.state.maxSlider});
    } else {
      axios.put(`${BASE_URL}/vendors/${vendor}/delivery-range/update`, {max_delivery_range: value},
        {headers: {"App-Key": APP_KEY, "Authorization": `Bearer ${token}`}})
        .then(response => {
          Alert.alert("Updated Successfully");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");
        });
      this.setState({maxSlider: parseInt(value)});
    }
  };

  saveChanges = () => {

  };

  deleteAll = () => {

    const {token, vendor} = this.props;
    axios.delete(`${BASE_URL}/vendors/${vendor}/delivery-range`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({sliders: [], minSlider: 0, valueSlider: 0, editMaxRange: '', maxSlider: 0});
      })
      .catch(error => console.log(error));

  };


  addNewSlider = (valueFee, valueSlider) => {
    if (valueFee === null || valueFee === '')
      Alert.alert("Please fill the delivery fee");
    else if (this.state.minSlider === valueSlider)
      Alert.alert("Please change the range");
    else {
      let newSlider = {
        from: this.state.minSlider,
        to: valueSlider,
        delivery_fee: valueFee
      };

      let data = {
        'from-to': `${this.state.minSlider};${this.state.valueSlider}`,
        'delivery_fee': `${valueFee}`
      };

      const {token, vendor} = this.props;

      axios.post(`${BASE_URL}/vendors/${vendor}/delivery-range`, data,
        {headers: {"App-Key": APP_KEY, "Authorization": `Bearer ${token}`}})
        .then(response => {
          Alert.alert("Updated Successfully");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");
        });


      this.setState({minSlider: valueSlider, sliders: [...this.state.sliders, newSlider], valueFee: null});
    }
  };

  render() {
    if (this.state.loaded)
      return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <View style={{
                flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%',
                marginVertical: 3, paddingVertical: 3, justifyContent: 'space-between', alignItems: 'center'
              }}>
                <Text style={{fontFamily: 'SF_medium', fontSize: 18, color: '#1A1A1A'}}>
                  Location Delivery
                </Text>

                <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: '#50b7ed'}}>
                  Default Fee = {this.state.deaful_fee} {this.props.currencyChoosen}
                </Text>
              </View>

              <View style={{
                backgroundColor: 'white',
                paddingLeft: '5%',
                paddingRight: '5%',
                paddingTop: '3%',
                paddingBottom: '3%'
              }}>
                <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: '#1A1A1A'}}>
                  Your maximum delivery range meters
                </Text>

                <View style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  marginLeft: 15,
                  alignContent: 'center',
                  justifyContent: 'center',
                  width: 0.8 * width
                }}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder={"Delivery Range"}
                    keyboardType='numeric'
                    style={[styles.inputStyleFee, {width: '30%'}]}
                    value={`${this.state.editMaxRange}`}
                    onChangeText={(editMaxRange) => {
                      this.setState({editMaxRange, error: null})
                    }}
                    autoCorrect={false}
                    placeholderTextColor={'#808080'}
                  />
                  <TouchableOpacity
                    onPress={() => this.EditMaxRange(this.state.editMaxRange)}
                    style={styles.createButtonStyle1}>
                    <Text style={styles.createTextStyle1}>
                      Edit Range
                    </Text>
                  </TouchableOpacity>

                </View>


                <View style={{marginTop: 15, flexDirection: 'row', justifyContent: 'space-between'}}>

                  <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: '#1A1A1A'}}>
                    Enter deliveries based on your needs
                  </Text>

                </View>


                {
                  this.state.sliders.map((slider) => {
                    return (

                      <View style={{marginTop: 10}} key={slider.to}>

                        <View style={{alignItems: 'flex-end', alignContent: 'flex-end', justifyContent: 'flex-end'}}>
                          <View style={{width: '22%'}}>
                            <View style={{padding: 5, backgroundColor: '#989898', borderRadius: 10}}>
                              <Text
                                style={{fontFamily: 'SF_medium', fontSize: 12, color: 'white', textAlign: 'center'}}>
                                {slider.delivery_fee} {this.props.currencyChoosen}
                              </Text>
                            </View>

                            <Text style={{
                              marginTop: 2,
                              fontFamily: 'SF_regular',
                              textAlign: 'center',
                              fontSize: 12,
                              color: '#989898'
                            }}>
                              Delivery Fee
                            </Text>
                          </View>
                        </View>

                        <View style={{marginTop: 10}}>
                          {

                            <View style={styles.containerSlider}>
                              <Slider
                                disabled={true}
                                minimumTrackTintColor={"#50b7ed"}
                                minimumValue={slider.from}
                                maximumValue={this.state.maxSlider}
                                sliderColor={"#50b7ed"}
                                thumbTintColor={"#50b7ed"}
                                step={1}
                                value={slider.to}
                              />
                              <Text style={{
                                textAlign: 'center',
                                fontFamily: 'SF_light',
                                fontSize: 15
                              }}>Value: {slider.to}</Text>
                            </View>
                          }

                        </View>
                      </View>
                    );
                  })
                }


                {this.state.minSlider !== this.state.maxSlider ? (
                  <View>
                    <View style={{marginTop: 20}}>

                      <View style={styles.containerSlider}>
                        <Slider
                          minimumTrackTintColor={"#50b7ed"}
                          minimumValue={this.state.minSlider}
                          maximumValue={this.state.maxSlider}
                          sliderColor={"#50b7ed"}
                          thumbTintColor={"#50b7ed"}
                          step={1}
                          value={this.state.valueSlider}
                          onValueChange={(valueSlider) => {
                            this.setState({valueSlider})
                          }
                          }/>
                        <Text style={{
                          textAlign: 'center',
                          fontFamily: 'SF_light',
                          fontSize: 15
                        }}>Value: {this.state.valueSlider}</Text>
                      </View>

                    </View>

                    <View style={{
                      flexDirection: 'row',
                      marginTop: 15,
                      marginLeft: 15,
                      alignContent: 'center',
                      justifyContent: 'center',
                      width: 0.8 * width
                    }}>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={"Delivery Fee"}
                        //keyboardType = 'numeric'
                        style={[styles.inputStyleFee, {width: '30%'}]}
                        value={this.state.valueFee}
                        onChangeText={(valueFee) => {
                          this.setState({valueFee, error: null})
                        }}
                        autoCorrect={false}
                        placeholderTextColor={'#808080'}
                      />
                      <TouchableOpacity
                        onPress={() => this.addNewSlider(this.state.valueFee, this.state.valueSlider)}
                        style={styles.createButtonStyle1}>
                        <Text style={styles.createTextStyle1}>
                          Add Range
                        </Text>
                      </TouchableOpacity>

                    </View>


                  </View>
                ) : null}

                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Text style={{fontFamily: 'SF_regular', fontSize: 13, color: '#989898'}}>
                    To create a new delivery from the beginning
                  </Text>

                  <View style={{
                    marginLeft: 10,
                    alignItems: 'flex-end',
                    alignContent: 'flex-end',
                    justifyContent: 'flex-end'
                  }}>
                    <TouchableOpacity onPress={() => this.deleteAll()}>
                      <Text style={{fontFamily: 'SF_semibold', fontSize: 13, color: '#FB5E6F'}}>
                        Delete All
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>


                <View style={{marginTop: 20}}>
                  <TouchableOpacity onPress={() => this.saveChanges()}
                                    style={styles.createButtonStyle}>
                    <Text style={styles.createTextStyle}>
                      Save Changes
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      );
    else
      return <Spinner/>;
  }

}

const styles = {
  containerStyle: {
    height: height,
    backgroundColor: '#F2F2F2'
  },

  inputStyle: {
    color: '#292D2E',
    flex: 10,
    marginRight: 20,
    padding: 8,
    fontSize: 15,
    fontFamily: 'SF_regular',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    borderRadius: 30

  },
  containerInput: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addProduct: {
    flex: 1,
    padding: 8,
    height: 31,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  headerIcon: {
    height: 18,
    width: 16.5
  },
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  createButtonStyle: {
    width: '40%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 15,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  containerSlider: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  newCategLabel: {
    //SF Medium 26pt = #1A1A1A
    fontFamily: 'SF_medium',
    color: '#1A1A1A',
    fontSize: 16,
  },
  inputStyleFee: {
    color: '#1A1A1A',
    paddingRight: 5,
    paddingLeft: 10,
    marginLeft: 5,
    lineHeight: 23,
    height: 35,
    borderRadius: 5,
    fontSize: 13,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    fontFamily: 'SF_medium',
    marginRight: 15
  },
  createTextStyle1: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  createButtonStyle1: {
    width: '25%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#50b7ed',
    marginRight: 10,
    height: 35,
    justifyContent: 'center',
  },

};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    currencyChoosen: state.auth.currencyChoosen
  };
};

export default connect(mapStateToProps)(DeliveryRange);
