import React, {Component} from 'react';
import {DatePickerIOS, Modal, Text, TimePickerAndroid, TouchableOpacity, View} from 'react-native';

export default class DateTimePickerTester extends Component {

  showAndroidDatePicker = async () => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM',
        mode: "spinner",
        title: 'Shtyp oren'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }

  };

  state = {
    itemPickerVisible: false,
  };


  showModal() {
    return (
      <Modal onRequestClose={() => {
        alert('Modal has been closed.');
      }}>>
        <Text>Opening Hours</Text>
        {this.showAndroidDatePicker()}
      </Modal>
    )
  }

  render() {
    return (

      <View style={{marginTop: 50}}>

        <TouchableOpacity onPress={() => {
          this.showModal()
        }}>
          <Text>Shtyppp</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderModal() {
    if (!this.state.itemPickerVisible) return;

    let datePicker = <DatePickerIOS date={this.state.selectedValue} mode="date"
                                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                                    onDateChange={(date) => {
                                      this.setState({selectedValue: date})
                                    }}/>;
    if (Platform.OS === "android") {
      datePicker = this.showAndroidDatePicker()
    }

    return (
      <Modal animationType="fade" transparent={true} visible={this.state.itemPickerVisible}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
          <View style={{flex: 1, backgroundColor: '#000', opacity: 0.4}}>
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <View style={{backgroundColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between', padding: 7}}>
              <Text style={{padding: 4}}>{this.props.title}</Text>
              <TouchableHighlight onPress={this.selectedItem.bind(this)}>
                <Text style={{padding: 4, color: s.colorDark}}>{gettext("Done")}</Text>
              </TouchableHighlight>
            </View>
            <View>
              {datePicker}
            </View>
          </View>
        </View>
      </Modal>
    )
  }

}
