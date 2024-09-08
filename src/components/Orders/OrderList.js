import React, {Component} from 'react';
import {Dimensions, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import * as Font from "expo-font";
import OrderItem from '../common/OrderItem'
import CircleStatus from '../common/CircleStatus';
import ModalSelector from 'react-native-modal-selector';
import NotificationBadge from '../common/NotificationBadge';
import {connect} from 'react-redux';
import {
    changeSearchField,
    fetchOrdersList,
    loadNextPage,
    searchOrders,
    setLoadedToFalse,
    setSearchStatus
} from './../../actions/orders_list';
import moment from 'moment';
import {Spinner} from './../common/index';
import {setLoadMoreToFalse} from "../../actions/orders_list";

let {height} = Dimensions.get('window');
let itemHeight = 0;
let index = 0;

const data = [
  {key: index++, label: 'New'},
  {key: index++, label: 'Processing'},
  {key: index++, label: 'Delivered'},
  {key: index++, label: 'Declined'},
  {key: index++, label: 'All'}
];

class OrderList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      orderStage: {
        deliveredOrders: 0,
        declinedOrders: 0,
        acceptedOrders: 0,
        pendingOrders: 0
      },
      height: 0,
      today: moment().format().split('T')[0],
      fontLoaded: false,
      loaded: false,
      refreshing: false
    };

  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.onSetLoadedToFalse();
    this.props.onFetchOrdersList();
    this.props.onChangeSearchField('Today');
  }

  async componentDidMount() {
    await Font.loadAsync({
      'SF_regular': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoText-Regular.otf'),
      'SF_semibold': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Semibold.otf'),
      'SF_bold': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Bold.otf'),
      'SF_light': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Light.otf'),
      'SF_medium': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Medium.otf')
    });
    this.setState({fontLoaded: true});
    this.props.navigation.setParams({
      onSetSearchStatus: data => this.searchOrder(data)
    })
  }

  renderLoadMoreButton = () => {
    if (this.props.nextPageUrl !== null && this.props.loadNextPage)
      return (
        <TouchableOpacity onPress={() => {
          this.props.onSetLoadMoreFalse()
          this.props.onLoadNextPage()
        }}
                          style={styles.createButtonStyle}>
          <Text style={styles.createTextStyle}>
            Load More
          </Text>
        </TouchableOpacity>
      )
    else if (!this.props.loadNextPage)
      return (<Spinner/>)
  }

  searchOrder = (data) => {
    this.props.onSetSearchStatus(data);
    this.props.onSearchOrders();
  };

  componentWillMount() {
    const {search} = this.props;
    if (search.order_date_from === null || search.order_status === null)
      this.props.onFetchOrdersList();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.loaded, this.state.refreshing);

    if (nextProps.loaded && !this.state.refreshing) {
      this.setState({loaded: true, refreshing: false})
    } else if (nextProps.loaded && this.state.refreshing) {
      this.setState({loaded: true, refreshing: false})
    } else if (nextProps.loaded && !this.state.refreshing) {
      this.setState({loaded: true, refreshing: false})
    }


  }

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      headerTitle: "Orders",
      headerTitleStyle: {
        fontWeight: '400',
        fontSize: 17,
        width: "100%",
        textAlign: 'center',
      },

      headerRight: <View style={{flexDirection: 'row'}}>

        <ModalSelector
          overlayStyle={{justifyContent: 'flex-end'}}
          data={data}

          optionContainerStyle={{borderRadius: 10}}
          cancelStyle={{borderRadius: 10}}
          optionTextStyle={{fontSize: 20}}
          onChange={(option) => params.onSetSearchStatus(option.label)}
          cancelTextStyle={{color: '#C61425', fontSize: 20}}>

          <Image style={{height: 18, width: 18, marginRight: 10}}
                 source={require('../../img/filterwhite.png')}>

          </Image>
        </ModalSelector>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Notifications');
        }}>
          <NotificationBadge/>
        </TouchableOpacity>
      </View>,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',
    };
  };
  _keyExtractor = (item, index) => item.id;

  heightItem = (height) => {
    this.setState({height: height});
    itemHeight = height;

  };


  renderSearchHeader = () => {

    if (this.state.fontLoaded && this.state.loaded)
      return (

        <View style={styles.headerStyle}>
          <View style={styles.textStyle}>
            <Text style={styles.searchStyle}>Search by:</Text>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('FilterCalendar', {
                fontLoaded: this.state.fontLoaded,
                navigation: this.props.navigation
              });
            }}>

              <Text style={styles.periodStyle}>{this.props.searchField}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageStyle}>
            <CircleStatus
              fontLoaded={this.state.fontLoaded}
              number={this.props.totals.delivered}
              width={30}
              height={30}
              borderRadius={15}
              color={"#50b7ed"}
              status={"Delivered"}
            />
            <CircleStatus
              fontLoaded={this.state.fontLoaded}
              number={this.props.totals.processing}
              width={30}
              height={30}
              borderRadius={15}
              color={"#22B573"}
              status={"Processing"}
            />
            <CircleStatus
              fontLoaded={this.state.fontLoaded}
              color={"#F7931E"}
              number={this.props.totals.new}
              width={30}
              height={30}
              borderRadius={15}
              status={"Pending"}
            />
            <CircleStatus
              fontLoaded={this.state.fontLoaded}
              color={"#C61425"}
              number={this.props.totals.declined}
              width={30}
              height={30}
              borderRadius={15}
              status={"Rejected"}
            />
          </View>
        </View>
      );
  };

  renderOrderList = () => {
    if (this.state.fontLoaded && this.state.loaded)
      if (this.props.orders.length != 0) {
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
            renderItem={({item}) =>
              (
                <OrderItem
                  navigation={this.props.navigation}
                  id={item.id}
                  onHeightItem={this.heightItem.bind(this)}
                  address1={item.order_number}
                  address2={item.address2}
                  status={item.status}
                  comments={item.comments_count}
                  tax={item.tax_total}
                  date={moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}
                  price={item.total_price}
                  currencyChoosen={this.props.currencyChoosen}
                  fontLoaded={this.state.fontLoaded}
                  display={item.comments_count == 0 ? 'none' : 'flex'}
                  color={item.status == "delivered" ? '#50b7ed' : item.status == "new" ? '#F7931E' :
                    item.status == "declined" ? '#C61425' : '#22B573'}
                />)}
            ListFooterComponent={

              <View style={{width: '100%'}}>
                {this.renderLoadMoreButton()}
              </View>
            }
          />

        );
      } else
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
                source={require('../../img/Orders/noorders.png')}
              />
              <Text
                style={{fontFamily: 'SF_semibold', fontSize: 14, color: '#808080', textAlign: 'center', marginTop: 10}}>
                0 Orders in this range
              </Text>
            </View>
          </ScrollView>
        );

    else
      return <Spinner/>
  }

  render() {

    return (
      <View style={{height: height}}>
        {this.state.fontLoaded ? this.renderSearchHeader() : null}
        <View style={{height: '70%'}}>
          {this.renderOrderList()}
        </View>
      </View>
    );
  }
}

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

  headerStyle: {
    paddingBottom: '2%',
    height: '10%',
    flexDirection: 'row'
  },
  textStyle: {
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: '2%',
    flexDirection: 'column'
  },
  searchStyle: {
    fontFamily: 'SF_medium',
    color: '#1A1A1A',
    fontSize: 16
  },
  periodStyle: {

    fontFamily: 'SF_medium',
    color: '#50b7ed',
    fontSize: 16
  },
  imageStyle: {
    flex: 1.5,
    justifyContent: 'flex-end',
    paddingTop: '3%',
    paddingRight: '3%',
    flexDirection: 'row'
  },

  notificationBadgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: 5,
    marginRight: -5,
    marginTop: -5,
    paddingTop: 4
  },

  notificationBadgeSection: {
    backgroundColor: '#e2353e',
    height: 13,
    width: 13,
    borderRadius: 6,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  notificationBadge: {},
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },

  createButtonStyle: {
    width: '30%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 15,
    height: 30,
    justifyContent: 'center',
  },


};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrdersList: () => dispatch(fetchOrdersList()),
    onSetSearchStatus: data => dispatch(setSearchStatus(data)),
    onSearchOrders: () => dispatch(searchOrders()),
    onSetLoadedToFalse: () => dispatch(setLoadedToFalse()),
    onChangeSearchField: (data) => dispatch(changeSearchField(data)),
    onLoadNextPage: () => dispatch(loadNextPage()),
    onSetLoadMoreFalse: () => dispatch(setLoadMoreToFalse())
  }
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    search: state.orders_list.search,
    orders: state.orders_list.orders,
    loaded: state.orders_list.loaded,
    totals: state.orders_list.totals,
    searchField: state.orders_list.searchField,
    nextPageUrl: state.orders_list.next_page_url,
    loadNextPage: state.orders_list.loadNextPage,
    currencyChoosen: state.auth.currencyChoosen
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);

