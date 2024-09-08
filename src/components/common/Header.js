//import libraries for making a component
import React from 'react';
import {Text, View} from 'react-native';
import Image from 'react-native-remote-svg';
//make a component
const Header = (props) => {
  const {textStyle, viewStyle} = styles;

  return (
    <View style={viewStyle}>
      <View style={styles.iconContainer}>
        {
          <Image
            style={styles.headerIcon}
            source={require('../../../src/img/Products/Asset3.png')}/>
        }
      </View>
      {
        props.fontLoaded ? (
          <Text style={textStyle}>{props.headerText}</Text>
        ) : null
      }
      <View style={styles.iconContainer}>
        {
          <Image
            style={styles.headerIcon}
            source={require('../../../src/img/Products/Asset3.png')}/>
        }
      </View>

    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    elevation: 2,
    flexDirection: 'row',
    position: 'relative'
  },

  textStyle: {
    flex: 4,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'SF_regular'
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center'
  },
  headerIcon: {
    height: 18,
    width: 16.5
  }
};

//make the component available to other parts of the app
export {Header};
