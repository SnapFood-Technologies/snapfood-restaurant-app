import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {connect} from 'react-redux';
import {setSearchTimeFrom, setSearchTimeTo} from './../../actions/orders_list'
import {changeSearchField} from "../../actions/orders_list";

let {height} = Dimensions.get('window');

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {

    this.props.onChangeSearchField("Custom Range");


    if (type === 'END_DATE')
      this.props.onFilterDateTo(date.format('DD/MM/YYYY'))
    else
      this.props.onFilterDateFrom(date.format('DD/MM/YYYY'))
  }

  render() {
    const {selectedStartDate, selectedEndDate} = this.state;
    const minDate = new Date(2000, 1, 1);
    const maxDate = new Date();//today
    const startDate = selectedStartDate ? selectedStartDate.format('MM/DD/YYYY') : '';
    const endDate = selectedEndDate ? selectedEndDate.format('MM/DD/YYYY') : '';

    return (
      <View>
        <CalendarPicker
          style={{height: 100}}
          weekdays={["M", "T", "W", "T", "F", "S", "S"]}
          // previousTitle={<Icon name="angle-left" color="#50b7ed" size={30}/>}
          //   nextTitle={<Icon name="angle-right" color="#50b7ed" size={30}/>}
          months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]}
          startFromMonday={true}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
          textStyle={height > 630 ? {fontFamily: 'SF_regular', fontSize: 18} : {fontFamily: 'SF_regular', fontSize: 15}}
          todayBackgroundColor="#F2F2F2"
          todayTextStyle={{color: '#000000'}}
          selectedDayColor="#50b7ed"
          selectedDayTextColor="#FFFFFF"
          onDateChange={this.onDateChange}
        />
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={[styles.dateStyle, height > 630 ? {fontSize: 18} : {fontSize: 15}]}>Start Date:</Text>
            <Text
              style={[styles.date, height > 630 ? {fontSize: 18} : {fontSize: 15}]}>{this.props.search.order_date_from}</Text>
          </View>

          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={[styles.dateStyle, height > 630 ? {fontSize: 18} : {fontSize: 15}]}>End Date:</Text>
            <Text
              style={[styles.date, height > 630 ? {fontSize: 18} : {fontSize: 15}]}>{this.props.search.order_date_to}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  dateStyle: {
    fontFamily: 'SF_semibold',
  },
  date: {
    fontFamily: 'SF_regular',
    color: '#50b7ed'
  }
}

const mapStateToProps = state => {
  return {
    search: state.orders_list.search,
    searchField: state.orders_list.searchField
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFilterDateFrom: data => dispatch(setSearchTimeFrom(data)),
    onFilterDateTo: data => dispatch(setSearchTimeTo(data)),
    onChangeSearchField: data => dispatch(changeSearchField(data))

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
