import React from 'react';
import {Text, TextInput, View} from 'react-native';

const Input_Label = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      <View style={{flexDirection: 'row'}}>
        {
          //props.fontLoaded ? (
          <Text style={styles.labelStyle}>{props.label}</Text>
          //):null
        }

        {
          //props.fontLoaded ? (
          <Text style={styles.asterixStyle}>{props.mandatory}</Text>
          // ):null
        }
      </View>
      {
        //  props.fontLoaded ? (
        <TextInput
          keyboardType={props.keyboardType}
          underlineColorAndroid="transparent"
          placeholder={props.placeholder}
          style={[styles.inputStyle, props.styleInput]}
          value={props.value}
          onChangeText={props.onChangeText}
          autoCorrect={false}
          secureTextEntry={props.secure}
          placeholderTextColor={'#808080'}
        />
        // ) : null
      }
    </View>
  );
};


const styles = {
  inputStyle: {
    color: '#808080',
    paddingRight: 5,
    fontSize: 13,
    paddingLeft: 10,
    marginLeft: 5,
    lineHeight: 23,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#F2F2F2',
    fontFamily: 'SF_regular'
  },
  containerStyle: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  labelStyle: {
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'SF_medium',
    color: '#000000'
  },
  asterixStyle: {
    marginLeft: 5,
    fontSize: 17,
    marginBottom: 10,
    fontFamily: 'SF_medium',
    color: '#cc0000'

  }
};

export {Input_Label};
