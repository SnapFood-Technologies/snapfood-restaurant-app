import React, {Component} from 'react';
import {Modal, Text, View} from 'react-native';

class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: true
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
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

          <TouchableOpacity
            onPress={() => {
              this.setState({visible: false});
            }}>
            <Text>OK</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    );
  }
};

export default Message;
