import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import PureChart from 'react-native-pure-chart';
import ModalSelector from 'react-native-modal-selector';
import ProgressCircle from 'react-native-progress-circle'
import {fetchNewOrders} from './../../actions/notifications';
import NotificationBadge from '../common/NotificationBadge';

import {Spinner} from "../common";
import moment from "moment/moment";

import {
  PUSH_NOTIFICATION_RECEIVED_EVENT,
  setupPushNotifications,
} from '../../common/services/pushNotifications';
import { EventRegister } from 'react-native-event-listeners';

let { width } = Dimensions.get('window');

let index = 0;
let data = [
  {key: index++, label: 'Today'},
  {key: index++, label: 'Last 7 Days'},
  {key: index++, label: 'Last 30 Days'},
  {key: index++, label: 'Last Month'},
  {key: index++, label: 'This Month'},
];


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      filter: 'Today',
      refreshing: false,
      orderStatistics: {
        deliveredOrders: 0,
        refusedOrders: 0,
        totalOrders: 0,
        pendingOrders: 0
      },
      revenueStatistics: {
        totalProfit: 0,
        totalTax: 0
      },
      revenueChartData: [
        {
          labels: null,
          dataSets: {
            totalPrice: 0,
            totalTax: 0,
            totalOrders: 0
          }
        }
      ]

    }
  }

  async componentDidMount() {
    await this.setupNotificationListener();
    await setupPushNotifications();
  }

  setupNotificationListener = async () => {
    EventRegister.addEventListener(PUSH_NOTIFICATION_RECEIVED_EVENT, async (notification) => {
      this.onNotificationOpened(notification);
    });
  };

  onNotificationOpened = (notification) => {
    if (notification && notification.data) {
      switch (notification.data.type) {
        case 'vendor_new_order_notification': {
          setTimeout(() => {
            try {
              this.props.navigation.navigate("OrderDetails", {
                fontLoaded: false,
                color: '#F7931E',
                status: 'new',
                id: notification.data.order_id
              })
            } catch (e) {
              console.log(e);
            }
          }, 100);
          break;
        }
        default: {

        }
      }
    }
  };


  _onRefresh() {
    this.setState(
      {
        refreshing: true,
        filter: 'Today'
      }
    );
    this.props.onFetchNotifications();
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/statistics`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({
          orderStatistics: response.data.ordersStatistics,
          revenueStatistics: response.data.revenueStatistics,
          revenueChartData: response.data.revenueChartData,
          loaded: true,
          refreshing: false
        }),
      )
      .catch(error => console.log(error))
  }

  componentWillMount() {
    this.props.onFetchNotifications();
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/statistics`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({
          orderStatistics: response.data.ordersStatistics,
          revenueStatistics: response.data.revenueStatistics,
          revenueChartData: response.data.revenueChartData,
          loaded: true
        }),
      )
      .catch(error => console.log(error))
  }

  static navigationOptions = ({navigation}) => {
    //title:<Text style={{fontWeight:"400",fontSize:17}}>Products</Text>,

    const {params = {}} = navigation.state;

    return {
      headerTitle: `Dashboard`,
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
      headerRight: <TouchableOpacity onPress={() => {
        navigation.navigate('Notifications');
      }}>
        <NotificationBadge/>
      </TouchableOpacity>,
      headerBackTitle: null
    }


  };


  renderCircleOrder(status) {
    let color;
    let statistics = this.state.orderStatistics;

    let numerator;
    let denominator = statistics.totalOrders;
    switch (status) {
      case 'Total':
        color = '#22B573';
        numerator = statistics.totalOrders;
        break;
      case 'Delivered':
        color = '#50b7ed';
        numerator = statistics.deliveredOrders;
        break;
      case 'Pending':
        color = '#F7931E';
        numerator = statistics.pendingOrders;
        break;
      case 'Rejected':
        color = '#C61425';
        numerator = statistics.refusedOrders;
        break;
    }

    let percentage = statistics.totalOrders !== 0 ?
      Math.round((numerator * 100 / denominator) * 10) / 10 : 0;

    return (
      <View>
        <ProgressCircle
          percent={percentage}
          radius={0.1 * width}
          borderWidth={5}
          color={color}
          bgColor="#fff"
          shadowColor="#d3d3d3"
        >
          <Text style={styles.gaugeText}>{percentage}%</Text>
        </ProgressCircle>

        <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 5}}>
          <Text style={{fontFamily: 'SF_regular', fontSize: 14}}>{status}</Text>
          <Text style={{fontFamily: 'SF_light', fontSize: 13}}>{numerator}</Text>
        </View>
      </View>
    )
  }

  renderAmount(amount, typeTotal, color) {
    return (
      <View style={{backgroundColor: color, padding: 15, borderRadius: 10, width: 0.43 * width, flexDirection: 'row'}}>
        <View style={styles.counterContainer}>
          <Image style={styles.imageStyle} source={require('../../../src/img/Products/increase-dashboard.png')}/>
        </View>
        <View style={{
          flex: 11,
          justifyContent: 'center',
          paddingLeft: 36,
          flexDirection: 'column',
        }}>
          <Text style={{
            fontSize: 16.5,
            fontFamily: 'SF_semibold',
            color: 'white'
          }}>{amount} {this.props.currencyChoosen}</Text>
          <Text style={{fontSize: 13.5, fontFamily: 'SF_regular', color: 'white'}}>Total {typeTotal}</Text>
        </View>
      </View>
    );
  }

  renderStatistics(sampleData) {
    return (
      <View style={{marginTop: '5%', borderRadius: 5, borderWidth: 3, borderColor: '#d3d3d3'}}>
        <View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
          <View>
            <Text style={{fontFamily: 'SF_regular', fontSize: 12}}>REVENUE STATISTICS</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              <View style={{marginTop: 2, height: 8, width: 8, borderRadius: 4, backgroundColor: '#22B573'}}></View>
              <Text style={{fontFamily: 'SF_regular', fontSize: 10}}> Total Revenue</Text>
              <View style={{
                marginTop: 2,
                marginLeft: 5,
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: '#50b7ed'
              }}></View>
              <Text style={{fontFamily: 'SF_regular', fontSize: 10}}> Total Tax</Text>
            </View>
          </View>
          <View style={{width: '30%', justifyContent: 'center'}}>

            <View style={{padding: 5, borderRadius: 5, backgroundColor: '#e4e4e4'}}>
              <Text style={{fontFamily: 'SF_regular', fontSize: 10, color: '#4D4D4D'}}>{this.state.filter}</Text>
            </View>
          </View>
        </View>
        <View style={{width: '85%'}}>
          <PureChart data={sampleData} type='line'/>
        </View>

      </View>
    )
  }

  renderOrderCharts(secondData) {
    return (
      <View style={{marginTop: '5%', borderRadius: 5, borderWidth: 3, borderColor: '#d3d3d3'}}>
        <View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
          <View>
            <Text style={{fontFamily: 'SF_regular', fontSize: 12}}>TOTAL ORDERS</Text>
            <View style={{flexDirection: 'row', marginTop: 3}}>
              <View style={{marginTop: 2, height: 8, width: 8, borderRadius: 4, backgroundColor: '#50b7ed'}}></View>
              <Text style={{fontFamily: 'SF_regular', fontSize: 10}}> Total Order</Text>
            </View>
          </View>

          <View style={{width: '30%', justifyContent: 'center'}}>
            <View style={{padding: 5, borderRadius: 5, backgroundColor: '#e4e4e4'}}>
              <Text style={{fontFamily: 'SF_regular', fontSize: 10, color: '#4D4D4D'}}>{this.state.filter}</Text>
            </View>
          </View>
        </View>
        <View style={{width: '85%'}}>
          <PureChart data={secondData} type='bar'/>
        </View>

      </View>
    )
  }

  onChangeFilter = (option) => {
    this.setState({filter: option.label});

    let startDate = "";
    let endDate = "";

    if (option.label == "Today") {
      startDate = moment().format("YYYY-MM-DD");
      endDate = moment().format("YYYY-MM-DD");
    } else if (option.label == "Last 7 Days") {
      startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
      endDate = moment().format("YYYY-MM-DD");
    } else if (option.label == "Last 30 Days") {
      startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
      endDate = moment().format("YYYY-MM-DD");
    } else if (option.label == "Last Month") {
      startDate = moment().subtract(1, 'months').startOf("month").format('YYYY-MM-DD');
      endDate = moment().subtract(1, 'months').endOf("month").format('YYYY-MM-DD')
    } else {
      startDate = moment().startOf("month").format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD')
    }
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/statistics?start_date=${startDate}&end_date=${endDate}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({
          orderStatistics: response.data.ordersStatistics,
          revenueStatistics: response.data.revenueStatistics,
          revenueChartData: response.data.revenueChartData,
          loaded: true
        }),
      )
      .catch(error => console.log(error))


  };

  render() {
    const {totalProfit, totalTax} = this.state.revenueStatistics;
    let totalPrices = [], totalTaxes = [], totalOrders1 = [];

    if (this.state.loaded) {

      this.state.revenueChartData.map((item) => {
        totalPrices.push({x: item.labels, y: item.dataSets.totalPrice});
        totalTaxes.push({x: item.labels, y: item.dataSets.totalTax});
        totalOrders1.push({x: item.labels, y: item.dataSets.totalOrders})
      });


      let firstChartData = [
        {
          seriesName: 'revenue',
          data: totalPrices,
          color: '#50b7ed'
        },
        {
          seriesName: 'tax',
          data: totalTaxes,
          color: '#22B573'
        }
      ];

      let secondChartData = [
        {
          data: totalOrders1,
          color: '#50b7ed'
        }
      ];


      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: 'white'}}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      }>
            <View style={styles.containerStyle}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.searchStyle}>Total Orders</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.searchStyle}>Filter by: </Text>

                  <ModalSelector
                    overlayStyle={{justifyContent: 'flex-end'}}
                    data={data}
                    optionContainerStyle={{borderRadius: 10}}
                    cancelStyle={{borderRadius: 10}}
                    optionTextStyle={{fontSize: 20}}
                    cancelTextStyle={{color: '#C61425', fontSize: 20}}
                    onChange={(option) => {
                      this.onChangeFilter(option)
                      // this.setState({filter: option.label})
                    }}
                  >
                    <Text
                      style={[styles.searchStyle, {color: '#50b7ed'}]}>{this.state.filter}</Text>

                  </ModalSelector>


                  <TouchableOpacity onPress={() => {
                    (console.log("test"))
                  }
                  }>


                  </TouchableOpacity>
                </View>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: '5%'}}>


                {this.renderCircleOrder("Total")}
                {this.renderCircleOrder("Delivered")}
                {this.renderCircleOrder("Pending")}
                {this.renderCircleOrder("Rejected")}
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: '5%'}}>
                {this.renderAmount(totalProfit, "Profit", '#50b7ed')}
                {this.renderAmount(totalTax, "Tax", '#22B573')}
              </View>
              {this.renderStatistics(firstChartData)}

              {this.renderOrderCharts(secondChartData)}

            </View>

          </ScrollView>
        </TouchableWithoutFeedback>

      );
    } else
      return <Spinner/>;
  }

}

const styles = {
  containerStyle: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '3%',
    paddingBottom: '3%'
  },
  searchStyle: {
    fontFamily: 'SF_semibold',
    color: '#1A1A1A',
    fontSize: 16
  },
  gauge: {
    position: 'absolute',
    width: 0.2 * width,
    height: 0.2 * width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    fontFamily: 'SF_medium',
    color: '#1A1A1A',
    fontSize: 19,
  },

  imageStyle: {
    marginLeft: -5
  },
  counterContainer: {
    flex: 1.2,
    alignContent: 'center',
    justifyContent: 'center',
  }
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    currencyChoosen: state.auth.currencyChoosen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchNotifications: () => dispatch(fetchNewOrders())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
