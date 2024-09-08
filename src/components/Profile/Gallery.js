import React, {Component} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import ItemGallery from '../common/ItemGallery';
import {APP_KEY, BASE_URL} from "../../../config/settings";
import axios from "axios/index";
import {Spinner} from './../common/index';
import {connect} from 'react-redux';

let {width} = Dimensions.get('window');

class Gallery extends Component {

  static navigationOptions = {
    title: <Text style={{fontWeight: "400", fontSize: 17}}>Gallery</Text>,
    headerRight: <TouchableOpacity onPress={() => {
    }}><Text style={{fontWeight: "100", marginRight: 10, fontSize: 15}}>Done</Text></TouchableOpacity>,
    headerBackTitle: null,
    headerStyle: {
      backgroundColor: '#50b7ed'
    },
    headerTintColor: 'white',
  };


  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      gallery: [],
      sourcesImages: []
    };

  }


  componentWillMount() {

    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/gallery`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({
          gallery: response.data.gallery,
          loaded: true
        })
      })
      .catch(error => console.log(error.response));

  }


  render() {
    if (this.state.loaded) {

      for (let i = 0; i < this.state.gallery.length; i++)
        this.state.sourcesImages.push(this.state.gallery[i].thumbnail_path);

      for (let i = this.state.sourcesImages.length; i < 8; i++)
        this.state.sourcesImages.push("");

      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{marginTop: '5%', marginLeft: 0.025 * width}}>
            <Text style={styles.attachStyle}>
              Attach images to Gallery
            </Text>

            <View style={{flexDirection: 'row'}}>
              <ItemGallery sourceImg={this.state.sourcesImages[0]}/>
              <ItemGallery sourceImg={this.state.sourcesImages[1]}/>
              <ItemGallery sourceImg={this.state.sourcesImages[2]}/>

            </View>

            <View style={{flexDirection: 'row', marginTop: '5%'}}>
              <ItemGallery sourceImg={this.state.sourcesImages[3]}/>
              <ItemGallery sourceImg={this.state.sourcesImages[4]}/>
              <ItemGallery sourceImg={this.state.sourcesImages[5]}/>

            </View>

            <View style={{flexDirection: 'row', marginTop: '5%'}}>
              <ItemGallery sourceImg={this.state.sourcesImages[6]}/>
              <ItemGallery sourceImg={this.state.sourcesImages[7]}/>
            </View>

          </View>
        </View>
      );
    } else
      return <Spinner/>;
  }
}

const styles = {
  attachStyle: {
    fontSize: 16,
    fontFamily: 'SF_medium',
    color: '#000000',
    marginBottom: '5%'
  },
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
  }
};


export default connect(mapStateToProps)(Gallery);

