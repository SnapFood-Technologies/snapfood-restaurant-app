import React, {Component} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import Calendar from "./Calendar";
import {searchOrders} from './../../actions/orders_list';
import {connect} from 'react-redux';
import moment from "moment/moment";
import {changeSearchField, setSearchTimeFrom, setSearchTimeTo} from "../../actions/orders_list";
import NotificationBadge from '../common/NotificationBadge';

let index = 0;
let {height} = Dimensions.get('window');
const data = [
  {key: index++, label: 'Delivered'},
  {key: index++, label: 'Accepted'},
  {key: index++, label: 'Pending'},
  {key: index++, label: 'Rejected'},
  {key: index++, label: 'All'}
];


class FilterCalendar extends Component {


  static navigationOptions = {
    title: "Filters",
    headerTitleStyle: {alignSelf: 'center', fontSize: 17, fontWeight: '400'},
    headerRight: <View style={{flexDirection: 'row'}}>
      <ModalSelector
        overlayStyle={{justifyContent: 'flex-end'}}
        data={data}
        optionContainerStyle={{borderRadius: 10}}
        cancelStyle={{borderRadius: 10}}
        optionTextStyle={{fontSize: 20}}
        cancelTextStyle={{color: '#C61425', fontSize: 20}}>
        <Image style={{height: 18, width: 18, marginRight: 10}} source={require('../../img/filterwhite.png')}/>
      </ModalSelector>

      <TouchableOpacity onPress={() => {
        navigation.navigate('Notifications');
      }}>
        <NotificationBadge/>
      </TouchableOpacity>
    </View>,
    headerStyle: {
      backgroundColor: '#50b7ed'
    },
    headerTintColor: 'white',
    headerBackTitle: null
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.searchField,
      color1: this.props.searchField !== "Today" ? '#1A1A1A' : "#50b7ed",
      color2: this.props.searchField !== "Last 30 Days" ? '#1A1A1A' : "#50b7ed",
      color3: this.props.searchField !== "Last Month" ? '#1A1A1A' : "#50b7ed",
      color4: this.props.searchField !== "Last 7 Days" ? '#1A1A1A' : "#50b7ed",
      color5: this.props.searchField !== "This Month" ? '#1A1A1A' : "#50b7ed",
      color6: this.props.searchField !== "Custom Range" ? '#1A1A1A' : "#50b7ed",
      fontFamily1: this.props.searchField !== "Today" ? 'SF_regular' : "SF_semibold",
      fontFamily2: this.props.searchField !== "Last 30 Days" ? 'SF_regular' : "SF_semibold",
      fontFamily3: this.props.searchField !== "Last Month" ? 'SF_regular' : "SF_semibold",
      fontFamily4: this.props.searchField !== "Last 7 Days" ? 'SF_regular' : "SF_semibold",
      fontFamily5: this.props.searchField !== "This Month" ? 'SF_regular' : "SF_semibold",
      fontFamily6: this.props.searchField !== "Custom Range" ? 'SF_regular' : "SF_semibold",
    };

  }

  onFilterPress = () => {

    this.props.onSearchOrders();
    this.props.navigation.navigate('OrderList');
  };

  onChangeFilter = (filter) => {
    if (filter == "filter1") {
      this.props.onFilterDateFrom(moment().format('DD/MM/YYYY'));
      this.props.onChangeSearchField("Today");
      this.setState({
        color1: '#50b7ed', fontFamily1: 'SF_semibold', color2: '#1A1A1A', fontFamily2: 'SF_regular',
        color3: '#1A1A1A', fontFamily3: 'SF_regular', color4: '#1A1A1A', fontFamily4: 'SF_regular',
        color5: '#1A1A1A', fontFamily5: 'SF_regular', color6: '#1A1A1A', fontFamily6: 'SF_regular'
      })
    } else if (filter == "filter2") {
      //moment().subtract(30, 'days');
      this.props.onFilterDateFrom(moment().subtract(30, 'days').format('DD/MM/YYYY'));
      this.props.onFilterDateTo(moment().format('DD/MM/YYYY'));
      this.props.onChangeSearchField("Last 30 Days");


      this.setState({
        color2: '#50b7ed', fontFamily2: 'SF_semibold', color1: '#1A1A1A', fontFamily1: 'SF_regular',
        color3: '#1A1A1A', fontFamily3: 'SF_regular', color4: '#1A1A1A', fontFamily4: 'SF_regular',
        color5: '#1A1A1A', fontFamily5: 'SF_regular', color6: '#1A1A1A', fontFamily6: 'SF_regular'
      })
    } else if (filter == "filter3") {
      this.props.onChangeSearchField("Last Month");

      this.props.onFilterDateFrom(moment().subtract(1, 'months').startOf("month").format('DD/MM/YYYY'));
      this.props.onFilterDateTo(moment().subtract(1, 'months').endOf("month").format('DD/MM/YYYY'));

      this.setState({
        color3: '#50b7ed', fontFamily3: 'SF_semibold', color2: '#1A1A1A', fontFamily2: 'SF_regular',
        color1: '#1A1A1A', fontFamily1: 'SF_regular', color4: '#1A1A1A', fontFamily4: 'SF_regular',
        color5: '#1A1A1A', fontFamily5: 'SF_regular', color6: '#1A1A1A', fontFamily6: 'SF_regular'
      })
    } else if (filter == "filter4") {
      this.props.onChangeSearchField("Last 7 Days");

      this.props.onFilterDateFrom(moment().subtract(6, 'days').format('DD/MM/YYYY'));
      this.props.onFilterDateTo(moment().format('DD/MM/YYYY'));

      this.setState({
        color4: '#50b7ed', fontFamily4: 'SF_semibold', color2: '#1A1A1A', fontFamily2: 'SF_regular',
        color3: '#1A1A1A', fontFamily3: 'SF_regular', color1: '#1A1A1A', fontFamily1: 'SF_regular',
        color5: '#1A1A1A', fontFamily5: 'SF_regular', color6: '#1A1A1A', fontFamily6: 'SF_regular'
      })
    } else if (filter == "filter5") {
      this.props.onChangeSearchField("This Month");

      this.props.onFilterDateFrom(moment().startOf("month").format('DD/MM/YYYY'));
      this.props.onFilterDateTo(moment().format('DD/MM/YYYY'));


      this.setState({
        color5: '#50b7ed', fontFamily5: 'SF_semibold', color2: '#1A1A1A', fontFamily2: 'SF_regular',
        color3: '#1A1A1A', fontFamily3: 'SF_regular', color4: '#1A1A1A', fontFamily4: 'SF_regular',
        color1: '#1A1A1A', fontFamily1: 'SF_regular', color6: '#1A1A1A', fontFamily6: 'SF_regular'
      })
    } else {
      this.props.onChangeSearchField("Custom Range");

      this.setState({
        color6: '#50b7ed', fontFamily6: 'SF_semibold', color2: '#1A1A1A', fontFamily2: 'SF_regular',
        color3: '#1A1A1A', fontFamily3: 'SF_regular', color4: '#1A1A1A', fontFamily4: 'SF_regular',
        color5: '#1A1A1A', fontFamily5: 'SF_regular', color1: '#1A1A1A', fontFamily1: 'SF_regular'
      })
    }

  }


  render() {

    const {params} = this.props.navigation.state;

    return (
      <View style={{backgroundColor: '#F2F2F2', height: height}}>
        <View style={styles.header}>

          <Text style={[styles.filter, height > 630 ? {fontSize: 19} : {fontSize: 16}]}>Filter by:</Text>

          <View style={styles.rowStyle}>
            <TouchableOpacity
              onPress={() => {
                this.onChangeFilter("filter1")
              }}
              style={{flex: 1}}>
              <Text style={[{
                color: this.state.color1,
                fontFamily: this.state.fontFamily1
              }, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>Today</Text></TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}
                              onPress={() => {
                                this.onChangeFilter("filter2")
                              }}>
              <Text style={[{
                color: this.state.color2,
                fontFamily: this.state.fontFamily2
              }, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>Last 30 Days</Text></TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}
                              onPress={() => {
                                this.onChangeFilter("filter3")
                              }}>
              <Text style={[{
                textAlign: 'right',
                color: this.state.color3,
                fontFamily: this.state.fontFamily3
              }, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>
                Last Month</Text></TouchableOpacity>
          </View>

          <View style={[styles.rowStyle, {paddingBottom: '2%'}]}>
            <TouchableOpacity style={{flex: 1}}
                              onPress={() => {
                                this.onChangeFilter("filter4")
                              }}>
              <Text style={[{
                color: this.state.color4,
                fontFamily: this.state.fontFamily4
              }, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>
                Last 7 Days</Text></TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}
                              onPress={() => {
                                this.onChangeFilter("filter5")
                              }}>
              <Text style={[{
                color: this.state.color5,
                fontFamily: this.state.fontFamily5
              }, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>
                This Month</Text></TouchableOpacity>
            <TouchableOpacity style={{flex: 1}}
                              onPress={() => {
                                this.onChangeFilter("filter6")
                              }}>
              <Text style={[{
                color: this.state.color6,
                fontFamily: this.state.fontFamily6,
                textAlign: 'right'
              }, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>
                Custom Range</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.calendar}>
          <View style={{height: '70%'}}>
            <Calendar fontLoaded={params.fontLoaded}/>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.onFilterPress()}
                              style={[styles.buttonStyle, height > 630 ? {height: 35, width: '40%'} : {
                                height: 25,
                                width: '30%'
                              }]}>

              <Text style={[styles.buttonText, height > 630 ? {fontSize: 16} : {fontSize: 13}]}>
                Filter
              </Text>

            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = {
  header: {
    backgroundColor: 'white',
    paddingTop: '3%',
    paddingLeft: '5%',
    paddingRight: '4%',
    flexDirection: 'column'
  },
  filter: {
    marginBottom: '2%',
    textAlign: 'left',
    color: '#50b7ed',
    //fontSize:19,
    fontFamily: 'SF_regular'
  },
  rowStyle: {
    marginBottom: '3%',
    flexDirection: 'row',
  },

  costumStyle: {
    //flex:1,
    color: '#50b7ed',
    fontFamily: 'SF_semibold',
    //fontSize:16
  },
  calendar: {
    marginTop: 2,
    paddingTop: 1,

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
    //width:'40%',
    // height:35,
    justifyContent: 'center',
  },


};

const mapDispatchToProps = dispatch => {
  return {
    onFilterDateFrom: data => dispatch(setSearchTimeFrom(data)),
    onFilterDateTo: data => dispatch(setSearchTimeTo(data)),
    onSearchOrders: () => dispatch(searchOrders()),
    onChangeSearchField: data => dispatch(changeSearchField(data))
  }
};

const mapStateToProps = state => {
  return {
    searchField: state.orders_list.searchField,

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterCalendar);
