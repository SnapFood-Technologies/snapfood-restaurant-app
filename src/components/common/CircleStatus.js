import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';

export default class CircleStatus extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.containerStyle}>
        <View
          style={[styles.circleStyle, {backgroundColor: this.props.color}, {height: this.props.height}, {width: this.props.width}, {borderRadius: this.props.borderRadius}]}>
          <Text style={{fontFamily: 'SF_medium', fontSize: 14, color: '#F5F4F9'}}>{this.props.number}</Text>
        </View>
        <Text style={{fontFamily: 'SF_regular', fontSize: 10, color: '#4D4D4D'}}>{this.props.status}</Text>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '5%',
    flexDirection: 'column'
  },
  circleStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    //  width: 30,
    //  height: 30,
    //  borderRadius: 15,


  },

};
