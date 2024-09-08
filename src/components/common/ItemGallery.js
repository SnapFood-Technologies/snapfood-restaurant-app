import React, {Component} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from "expo-image-picker";
import Icon from 'react-native-vector-icons/FontAwesome';

let {width, height} = Dimensions.get('window');

class ItemGallery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: this.props.sourceImg,
    };

  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  };

  render() {

    return (
      <View>
        {this.state.image === '' ?
          (
            <TouchableOpacity onPress={this._pickImage} style={styles.pictureStyle}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Icon name="plus" size={30} color="#d3d3d3"/>
              </View>
            </TouchableOpacity>
          ) :
          (
            <TouchableOpacity onPress={this._pickImage}>
              <View style={styles.pictureStyle}>
                <Image source={{uri: 'https://snapfood.al/' + this.state.image}} style={styles.photoStyle}/>
              </View>
            </TouchableOpacity>
          )}
      </View>
    );
  }
}

const styles = {

  pictureStyle: {
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 6,
    shadowRadius: 2,
    borderRadius: 8,
    marginRight: 0.025 * width,
    elevation: 2,
    height: 0.3 * width,
    width: 0.3 * width,
    alignContent: 'center',
    justifyContent: 'center'
  },

  photoStyle: {
    borderRadius: 8,
    height: 0.3 * width,
    width: 0.3 * width,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 6,
    shadowRadius: 2,
  }

};


export default ItemGallery;
