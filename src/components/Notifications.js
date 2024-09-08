import React, {Component} from 'react';
import {Dimensions, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';
import NotificationItem from "./common/NotificationItem";
import {connect} from 'react-redux';
import {fetchNewOrders} from '../actions/notifications';
import moment from "moment/moment";
import NotificationBadge from '../components/common/NotificationBadge';

let {height, width} = Dimensions.get('window');

class Notifications extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      orders: null,
      refreshing: false,
      printModal: false,
      receiptURL: null,
    }

  }

  //TODO FIX EVERY HEADER NAVIGATION AS MOCKUP
  static navigationOptions = {

    headerTitle: "Notifications",
    headerTitleStyle: {
      fontWeight: '400',
      fontSize: 17,
      width: "100%",
      textAlign: 'center',
    },
    headerRight: <NotificationBadge/>,
    headerBackTitle: null,
    headerStyle: {
      backgroundColor: '#50b7ed'
    },
    headerTintColor: 'white',

  };

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.onFetchNotifications();
  }

  componentWillMount() {
    this.props.onFetchNotifications();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ordersLoaded)
      this.setState({loaded: true, refreshing: false})

    if (nextProps.isOpen && nextProps.receiptURL !== null) {
      this.setState({printModal: true, receiptURL: nextProps.receiptURL})
      console.log(nextProps)
    }

    if (nextProps.isOpen === false)
      this.setState({printModal: false, receiptURL: nextProps.receiptURL})

  }

  renderNotificationList = () => {
    if (this.state.loaded)
      /** Notifications **/
      if (this.props.orders.length != 0)
        return (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            data={this.props.orders}
            keyExtractor={this._keyExtractor}
            extraData={this.state}
            renderItem={({item}) => (
              <NotificationItem
                notification={item}
                navigation={this.props.navigation}
                id={item.id}
                address1={item.order_number}
                address2={item.address2}
                products={item.products}
                status={item.status}
                comments={item.comments}
                tax={item.tax_total}
                date={moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}
                time_created={moment(item.created_at, 'YYYY-MM-DD HH:mm:ss')}
                price={item.total_price}
                fontLoaded={this.state.fontLoaded}
                display={item.comments == 0 ? 'none' : 'flex'}
                color={item.status == "delivered" ? '#50b7ed' : item.status == "new" ? '#F7931E' :
                  item.status == "declined" ? '#C61425' : '#22B573'}
              />
            )}
          />
        );
      /** No Notifications **/
      else
        return (
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      }>
            <View style={styles.container}>
              <Image
                style={styles.noNotificationsImage}
                source={require('../img/Notifications/no-notifications.png')}
              />
              <Text
                style={{fontFamily: 'SF_semibold', fontSize: 14, color: '#808080', textAlign: 'center', marginTop: 10}}>
                You have 0 Notifications
              </Text>
            </View>
          </ScrollView>
        );

  };

  _keyExtractor = (item, index) => item.id;

  render() {

    let status = "Pending";

    //TODO MANAGE CASES HERE
    return (
      <View style={{height: '100%'}}>
        {this.renderNotificationList()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchNotifications: (token, vendor) => {
      dispatch(fetchNewOrders(token, vendor))
    },
  }
};

const mapStateToProps = state => {
  return {
    orders: state.notifications.orders,
    ordersLoaded: state.notifications.loaded,
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    receiptURL: state.printModal.url,
    isOpen: state.printModal.isOpen
  }
};


const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  noNotificationsImage: {
    marginTop: -10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonExit: {
    borderRadius: 15,
    backgroundColor: '#e2353e',
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    width: '55%',
    alignSelf: 'center',
    height: 30,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
