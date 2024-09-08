import React, {Component} from 'react';
import {Alert, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import DailyHours from "../common/DailyHours";
import axios from 'axios';
import {connect} from 'react-redux';
import {fetchOpeningHours} from './../../actions/opening_hours';
import {Spinner} from "../common/index";
import {APP_KEY, BASE_URL} from './../../../config/settings';
import moment from "moment/moment";
import PopupDialog from 'react-native-popup-dialog';


class OpeningHours extends Component {

  static navigationOptions = ({navigation}) => {

    const {params} = navigation.state;
    return {
      title: <Text style={{fontWeight: "400", fontSize: 17}}>Opening Hours</Text>,
      headerRight:
        <TouchableOpacity onPress={() => params.handleThis()}>
          <Text style={{fontWeight: "100", marginRight: 10, fontSize: 15}}>Done</Text>

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
    //const { params } = this.props.navigation.state;

    this.state = {
      open: null,
      loaded: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.onButtonPress.bind(this)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loaded === true)
      this.setState({loaded: true})
  }

  onButtonPress() {
    const {token, vendor} = this.props;

    //if(this.props.weekDays !== null)
    let openingHours = this.props.weekDays.map(day => {
      if (day.open === 1)
        return {open: 'on', time_open: day.time_open, time_close: day.time_close};
      else
        return {time_open: day.time_open, time_close: day.time_close};
    });

    console.log("UPDATE OPENING HOURS");
    console.log(openingHours);

    axios.post(`${BASE_URL}/vendors/${vendor}/opening-hours`,
      {opening_hours: openingHours},
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        // this.showDialog();
        Alert.alert("Updated Successfully");
      })
      .catch(function (error) {
        Alert.alert("Problems in Updating");

      });
  }

  showDialog = () => {
    this.popupDialog.show();
  };


  componentWillMount() {
    this.props.onFetchOpeningHours();
  }

  render() {

    // const { params } = this.props.navigation.state;

    if (this.state.loaded) {

      return (
        <ScrollView style={{backgroundColor: 'white'}}>
          <Text style={{
            fontFamily: 'SF_medium',
            fontSize: 16,
            color: '#000000',
            paddingTop: '5%',
            paddingLeft: '5%',
            paddingBottom: '2%'
          }}>
            Open and Closing Days
          </Text>
          {this.state.loaded ?
            this.props.weekDays.map((date) => {

              return (<DailyHours day={date}
                                  key={date.weekDay} open={date.open}
                                  time_open={moment(date.time_open, 'HH:mm:ss').format('HH:mm')}
                                  time_close={moment(date.time_close, 'HH:mm:ss').format('HH:mm')}/>)
            })
            :
            <Spinner/>
          }

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
                <Text style={styles.popupText}>Changes were saved</Text>
              </View>
            </View>
          </PopupDialog>

        </ScrollView>
      );
    } else
      return <Spinner/>
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    weekDays: state.openingHours.weekDays,
    loaded: state.openingHours.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // storeOpeningDays: (data) => dispatch(storeOpeningDays(data)),
    onFetchOpeningHours: () => dispatch(fetchOpeningHours())
  }
};

const styles = {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(OpeningHours);
