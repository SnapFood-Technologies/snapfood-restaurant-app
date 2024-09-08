import React, {PureComponent} from 'react';
import {StatusBar} from 'react-native';

class CustomStatusBar extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StatusBar
        backgroundColor="red"
        barStyle="light-content"
      />
    )

  }

}

export default CustomStatusBar;
