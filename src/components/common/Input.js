import React from 'react';
import {TextInput, View} from 'react-native';
import Image from 'react-native-remote-svg';

const Input = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      <View style={{width: 45, alignItems: 'center'}}>
        <Image
          style={props.styleIcon}
          source={props.source}/>
      </View>
      {
        props.fontLoaded ? (
          <TextInput
            underlineColorAndroid="transparent"
            secureTextEntry={props.secure}
            placeholder={props.placeholder}
            style={styles.inputStyle}
            value={props.value}
            onChangeText={props.onChangeText}
            autoCorrect={false}
            placeholderTextColor={'#4D4D4D'}
          />
        ) : null
      }
    </View>
  );
};


const styles = {
  inputStyle: {
    color: '#292D2E',
    paddingRight: 5,
    paddingLeft: 5,
    lineHeight: 23,
    fontSize: 15,
    flex: 5,
    height: 45,
    fontFamily: 'SF_regular'
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    backgroundColor: '#F2F2F2',
    shadowRadius: 2,
    borderRadius: 5,
  },

};

export {Input};
