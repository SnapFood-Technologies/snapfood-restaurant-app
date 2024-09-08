import React, {Component} from 'react';
import {Dimensions, Modal, Platform, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {updateOpeningHours} from './../../actions/opening_hours';

let {height, width} = Dimensions.get('window');

class DailyHours extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hourOpening: '',
      minuteOpening: '30',
      hourClosing: '20',
      minuteClosing: '10',

      cancelPicker: false,
      okPicker: false,
      modalPicker: false,
      switch1Value: this.props.open === 1,
      chosenDate: new Date(),

      error: ''
    };

    this.setDate = this.setDate.bind(this);
  }

  componentDidMount() {
    const splittedTimeOpen = this.props.day.time_open.split(':');
    const splittedTimeClose = this.props.day.time_close.split(':');

    this.setState({
      time_open_hour: splittedTimeOpen[0],
      time_open_minutes: splittedTimeOpen[1],
      time_close_hour: splittedTimeClose[0],
      time_close_minutes: splittedTimeClose[1]
    })
  }

  setDate(newDate) {
    this.setState({chosenDate: newDate})
  }

  changeOpenState = (value) => {
    this.props.updateOpeningHours({
      open: value ? 1 : 0,
      weekDay: this.props.day.weekDay,
      time_open: this.props.day.time_open,
      time_close: this.props.day.time_close
    })
  };

  changeThisDayOpeningHours = () => {

    const {time_open_hour, time_close_hour, time_open_minutes, time_close_minutes} = this.state;

    if (!time_close_hour || !time_open_hour || !time_close_minutes || !time_open_minutes)
      this.setState({error: "Please fill all fields!"});
    else if (time_close_hour > 23 || time_close_hour < 0 || time_open_hour > 23 || time_open_hour < 0 ||
      time_close_minutes > 59 || time_close_minutes < 0 || time_open_minutes > 59 || time_open_minutes < 0)
      this.setState({error: "Please write the time in the right format"});
    else {
      this.props.updateOpeningHours({
        open: this.props.day.open,
        weekDay: this.props.day.weekDay,
        time_open: `${this.state.time_open_hour}:${this.state.time_open_minutes}`,
        time_close: `${this.state.time_close_hour}:${this.state.time_close_minutes}`
      });
      this.setModalVisible(false)
    }
  };

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

  toggleSwitch1 = (value) => {
    this.setState({switch1Value: value});
  };

  setModalVisible(visible) {
    this.setState({modalPicker: visible});
  }


  renderHourSection = () => {
    if (this.props.open === 0)
      return (
        <View style={{marginTop: 5}}>
          <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: '#e2353e'}}>
            Closed
          </Text>
        </View>
      )

    else if (this.props.time_close && this.props.time_open)
      return (
        <View style={{marginTop: 5, flexDirection: 'row'}}>
          <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: "#827d7d"}}>From: </Text>
          <TouchableOpacity style={{marginRight: 15}} onPress={() => this.setModalVisible(true)}>
            <Text style={{fontFamily: 'SF_semibold', fontSize: 16, color: '#50b7ed'}}>{this.props.time_open}
            </Text>
          </TouchableOpacity>

          <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: "#827d7d"}}>To: </Text>

          <TouchableOpacity onPress={() => this.setModalVisible(true)}>
            <Text style={{fontFamily: 'SF_semibold', fontSize: 16, color: '#50b7ed'}}>{this.props.time_close}
            </Text>
          </TouchableOpacity>
        </View>
      );
    else
      return (
        <TouchableOpacity style={{marginTop: 5}} onPress={() => this.setModalVisible(true)}>
          <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: '#50b7ed'}}>
            + Add Hours
          </Text>
        </TouchableOpacity>
      )
  };

  renderModal = () => {

    return (
      <Modal animationType="slide"
             transparent={true}
             visible={this.state.modalPicker}
             onRequestClose={() => {
               alert('Modal has been closed.');
             }}>

        <View style={{
          flex: 1,
          backgroundColor: '#00000080',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            justifyContent: 'space-between',
            width: width - 50,
            backgroundColor: 'white',
            height: height / 2.5
          }}>

            <View style={{padding: 10}}>
              <Text style={{
                fontFamily: 'SF_medium',
                textAlign: 'center',
                fontSize: 17.5,
                color: '#444444',
                fontWeight: "400"
              }}>Opening Hour</Text>
              <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                <TextInput style={styles.inputStyle}
                           value={this.state.time_open_hour}
                           onChangeText={value => this.setState({time_open_hour: value, error: ''})}
                           keyboardType='numeric'/>
                <Text style={{color: '#50b7ed', fontFamily: 'SF_regular', fontSize: 16, textAlign: 'center'}}> : </Text>
                <TextInput style={styles.inputStyle}
                           value={this.state.time_open_minutes}
                           onChangeText={value => this.setState({time_open_minutes: value, error: ''})}
                           keyboardType='numeric'/>
              </View>

              <Text style={{
                fontFamily: 'SF_medium',
                textAlign: 'center',
                fontSize: 17.5,
                color: '#444444',
                fontWeight: "400"
              }}>Closing Hour</Text>
              <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 10}}>
                <TextInput style={styles.inputStyle}
                           value={this.state.time_close_hour}
                           onChangeText={value => this.setState({time_close_hour: value, error: ''})}
                           keyboardType='numeric'/>
                <Text style={{color: '#50b7ed', fontFamily: 'SF_regular', fontSize: 16, textAlign: 'center'}}> : </Text>
                <TextInput style={styles.inputStyle}
                           value={this.state.time_close_minutes}
                           onChangeText={value => this.setState({time_close_minutes: value, error: ''})}
                           keyboardType='numeric'/>
              </View>
            </View>

            {this.renderError()}

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
              <TouchableOpacity onPress={() => this.changeThisDayOpeningHours()}
                                style={styles.createButtonStyle}>
                <Text style={styles.createTextStyle}>
                  SAVE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalPicker)}
                                style={styles.resetButtonStyle}>
                <Text style={styles.resetTextStyle}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  };


  render() {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View style={{flexDirection: 'column', padding: 5}}>
            <Text style={{fontFamily: 'SF_medium', fontSize: 16.5, color: '#444444', fontWeight: "400"}}>
              {this.props.day.weekDay}
            </Text>

            {this.renderModal()}

            {this.renderHourSection()}

          </View>
          <View>
            <Switch
              style={{transform: Platform.OS === "ios" ? [{scaleX: .7}, {scaleY: .7}] : [{scaleX: 1}, {scaleY: 1}]}}
              onTintColor={"#50b7ed"}
              onValueChange={value => this.changeOpenState(value)}
              value={this.props.day.open === 1 ? true : false}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    margin: '3%',
    padding: 5,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 6,
    shadowRadius: 2,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputStyle: {
    width: 30,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 6,
    shadowRadius: 2,
    borderRadius: 8,
    elevation: 2,
    height: 30,
    color: '#50b7ed',
    fontFamily: 'SF_regular',
    fontSize: 16,
    textAlign: 'center'

  },
  createButtonStyle: {
    flex: 0.45,
    alignSelf: 'stretch',
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 10,
    marginRight: 10,
    height: 35,
    justifyContent: 'center',
  },
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },

  resetTextStyle: {
    alignSelf: 'center',
    color: '#50b7ed',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  resetButtonStyle: {
    flex: 0.45,
    alignSelf: 'stretch',
    borderRadius: 30,
    borderColor: '#50b7ed',
    borderWidth: 3,
    backgroundColor: '#ffffff',
    marginTop: 10,
    height: 35,
    justifyContent: 'center',
  },

  errorTextStyle: {
    fontSize: 14.5,
    alignSelf: 'center',
    color: '#e2353e',
    fontFamily: 'SF_medium'
  },

};

const mapDispatchToProps = dispatch => {
  return {
    updateOpeningHours: (data) => dispatch(updateOpeningHours(data))
  }
};

export default connect(null, mapDispatchToProps)(DailyHours);
