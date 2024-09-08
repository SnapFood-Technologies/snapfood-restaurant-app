import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {Input_Label, Section} from "../common/index";
import axios from 'axios';
import MapView, {Circle} from 'react-native-maps';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import {Spinner} from './../common/index';

let {height} = Dimensions.get('window');

class Order extends Component {


  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: <Text style={{fontWeight: "400", fontSize: 17}}>Order</Text>,
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

  // onRegionChange = (region) => {
  //     this.setState({ region });
  // };

  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.onButtonPress.bind(this)
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      prefix: '',
      minimumDeliveryTime: '',
      maximumDeliveryTime: '',
      deliveryFee: '',
      minimumOrder: '',
      maxDeliveryRange: '',
      maxRange: '',
      regionSet: false,
      region: {
        latitude: 41.327953,
        longitude: 19.819025,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      error: '',
      refreshing: false,
      loaded: false,
      sliders: []
    };

  };

  onChanged(text) {
    let newText = '';
    let numbers = '0123456789';
    if (text.length < 1) {
      this.setState({myNumber: ''});
    }
    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
      this.setState({myNumber: newText});
    }
  }


  onButtonPress() {
    const {prefix, minimumDeliveryTime, maxRange, maximumDeliveryTime, deliveryFee, minimumOrder, maxDeliveryRange} = this.state;
    const {token, vendor} = this.props;
    if (!prefix || !minimumDeliveryTime || !maximumDeliveryTime || !deliveryFee || !minimumOrder || !maxDeliveryRange)
      this.setState({error: 'Fill all the fields'});
    else if (maxDeliveryRange < maxRange) {
      Alert.alert("Please delete all ranges before lowering the maximum range")
      this.setState({maxDeliveryRange: maxRange});
    } else {
      let data = {
        prefix: prefix,
        min_delivery_time: parseFloat(minimumDeliveryTime),
        max_delivery_time: parseFloat(maximumDeliveryTime),
        delivery_fee: parseFloat(deliveryFee),
        min_order_price: parseFloat(minimumOrder),
        max_delivery_range: parseFloat(maxDeliveryRange),
      };


      axios.post(`${BASE_URL}/vendors/${vendor}/order-settings`, data,
        {headers: {'Authorization': `Bearer ${token}`}})
        .then(reponse => Alert.alert('Changes were saved with success'))
        .catch(function (error) {
          Alert.alert("Problems in Updating Order Settings");

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

  componentWillMount() {
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/order-settings`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data.settings))
      .catch(error => console.log(error))

    axios.get(`${BASE_URL}/vendors/${vendor}/delivery-range`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({sliders: response.data.ranges})
      })
      .catch(error => console.log(error));
  }

  _onRefresh() {
    this.setState({refreshing: true});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/order-settings`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data.settings))
      .catch(error => console.log(error))
  }


  updateState = data => {
    this.setState({
      prefix: data.prefix,
      minimumDeliveryTime: data.min_delivery_time.toString(),
      maximumDeliveryTime: data.max_delivery_time.toString(),
      deliveryFee: data.delivery_fee.toString(),
      minimumOrder: data.min_order_price.toString(),
      maxDeliveryRange: data.max_delivery_range.toString(),
      maxRange: data.max_delivery_range.toString(),
      regionSet: false,
      region: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      refreshing: false,
      loaded: true
    })
  };

  render() {


    const {prefix, minimumDeliveryTime, maximumDeliveryTime, deliveryFee, minimumOrder, maxDeliveryRange} = this.state;
    if (this.state.loaded) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

          <ScrollView style={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      }>
            <View style={{marginLeft: 8, marginRight: 10, marginTop: 10, flexDirection: 'row'}}>
              <Section style={{width: '50%'}}>
                <Input_Label
                  value={prefix}
                  styleInput={styles.styleInput}
                  placeholder="Ex. Restaurant Name"
                  label="Prefix"
                  onChangeText={prefix => {
                    this.setState({prefix, error: ''})
                  }}
                />
              </Section>
              <Section style={{width: '50%'}}>
                {this.renderError()}
              </Section>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.lineDelivery}>
                Delivery
              </Text>
            </View>
            <View style={{marginLeft: 8, marginRight: 10, marginTop: 10, flexDirection: 'row', marginBottom: -10}}>
              <Section style={{width: '50%'}}>
                <Input_Label
                  value={minimumDeliveryTime}
                  styleInput={styles.styleInput}
                  placeholder="Ex. 30"
                  label="Min. Delivery Time (min)"
                  onChangeText={minimumDeliveryTime => {
                    this.setState({minimumDeliveryTime, error: ''})
                  }}
                />
              </Section>
              <Section style={{width: '50%'}}>
                <Input_Label
                  value={maximumDeliveryTime}
                  styleInput={styles.styleInput}
                  placeholder="Ex. 40"
                  label="Max. Delivery Time (min)"
                  onChangeText={maximumDeliveryTime => {
                    this.setState({maximumDeliveryTime, error: ''})
                  }}
                />
              </Section>
            </View>
            <View style={{marginLeft: 8, marginRight: 10, marginTop: 5, flexDirection: 'row', marginBottom: -5}}>
              <Section style={{width: '50%'}}>
                <Input_Label
                  value={deliveryFee}
                  styleInput={styles.styleInput}
                  placeholder="Ex. 10"
                  label="Delivery Fee"
                  onChangeText={deliveryFee => {
                    this.setState({deliveryFee, error: ''})
                  }}
                />
              </Section>
              <Section style={{width: '50%'}}>
                <Input_Label
                  value={minimumOrder}
                  styleInput={styles.styleInput}
                  placeholder="1000"
                  label="Minimum Order"
                  onChangeText={minimumOrder => {
                    this.setState({minimumOrder, error: ''})
                  }}
                />
              </Section>
            </View>
            <View style={{marginLeft: 8, marginRight: 10, marginTop: 0, flexDirection: 'row', marginBottom: 3}}>
              <Section style={{width: '100%'}}>
                <Input_Label
                  keyboardType='numeric'
                  maxLength={10}
                  value={maxDeliveryRange}
                  onChangeText={maxDeliveryRange => {
                    this.setState({maxDeliveryRange, error: ''})
                  }}
                  styleInput={styles.styleInput}
                  placeholder="4500"
                  label="Enter Maximum Delivery Range in Meters"
                />
              </Section>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.lineDelivery}>
                Location
              </Text>
            </View>
            <View style={styles.mapView}>
              <MapView
                style={{height: 250, position: 'relative', marginBottom: 10, left: 0, right: 0}}
                initialRegion={this.state.region}
                // onRegionChange={this.onRegionChange.bind(this)}
              >
                <MapView.Marker
                  coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
                  pinColor='rgba(128, 0, 0, 1)'/>
                <Circle
                  key={(this.state.region.latitude + this.state.region.latitude + this.state.maxDeliveryRange).toString()}
                  center={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
                  radius={parseFloat(this.state.maxDeliveryRange)}
                  fillColor='rgba(0, 0, 0, 0.2)'
                  strokeColor='rgba(128, 0, 0, 1)'
                  pinColor='rgba(128, 0, 0, 1)'
                />
              </MapView>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      );
    } else {
      return <Spinner/>
    }

  }


}

const styles = {
  styleInput: {
    fontSize: 15,
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
  labelStyle: {
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'SF_light',
    color: '#000000'
  },
  lineDelivery: {
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 23,
    paddingBottom: 12,
    paddingTop: 12,
    fontSize: 15,
    fontFamily: 'SF_medium'
  },
  mapView: {
    marginTop: 15
  }
};


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    currencyChoosen: state.auth.currencyChoosen
  };
};

export default connect(mapStateToProps)(Order);

