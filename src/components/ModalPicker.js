import React, {Component} from 'react';
import ModalSelector from 'react-native-modal-selector'
import {View} from 'react-native';

class ModalPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      textInputValue: ''
    }
  }

  render() {
    let index = 0;
    const data = [
      {key: index++, section: true, label: 'Fruits'},
      {key: index++, label: 'Red Apples'},
      {key: index++, label: 'Cherries'},
      {key: index++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries'},
      // etc...
      // Can also add additional custom keys which are passed to the onChange callback
      {key: index++, label: 'Vegetable', customKey: 'Not a fruit'}
    ];

    return (
      <View style={{flex: 1, justifyContent: 'space-around', padding: 50}}>


        <ModalSelector
          data={data}
          initValue="Select something yummy!"
          onChange={(option) => {
            alert(`${option.label} (${option.key}) nom nom nom`)
          }}/>


      </View>
    );
  }
}

export default ModalPicker;
