import React, {PureComponent} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux'
import {APP_KEY, BASE_URL} from './../../../config/settings';


class ItemAddProduct extends PureComponent {
  constructor(props) {
    super(props);
  }

  find_dimesions(layout) {
    const {height} = layout;
    this.props.onHeightItem(height);
  }

  onItemPress = () => {
    Alert.alert(
      `Add product to ${this.props.navigation.state.params.title}`,
      'Do you want to add this product?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.addProductToMenu()},
      ],
      {cancelable: false}
    )
  };

  addProductToMenu = () => {

    const category = this.props.navigation.state.params.category;
    const {token, vendor} = this.props;

    let payload = {
      products: [this.props.id]
    };

    axios.post(`${BASE_URL}/vendors/${vendor}/menu/${category}/products`,
      payload,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        Alert.alert("Product added with success")
      })
      .catch(function (error) {
        Alert.alert("Problems in adding the product");

      });

  };

  render() {


    return (
      <View>
        <TouchableOpacity onPress={() => this.onItemPress()}>
          <View
            onLayout={(event) => {
              this.find_dimesions(event.nativeEvent.layout)
            }}
            style={[styles.itemStyle, this.props.style]}>

            <View style={styles.counterContainer}>
              <Text style={styles.counterStyle}>Nr. {this.props.id}</Text>
            </View>
            <View style={styles.item}>
              <View style={styles.rowStyle}>
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              <Text style={styles.descriptionStyle}>{this.props.description} </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = {
  itemStyle: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginBottom: 15,
    marginLeft: '2%',
    marginRight: '2%',
    borderRadius: 4,
    padding: 8,
  },
  counterContainer: {
    flex: 1.2,
    alignContent: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  counterStyle: {

    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 13,
    fontFamily: 'SF_light',
    color: '#808080',
  },
  item: {
    flex: 11,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  rowStyle: {
    flexDirection: 'row'
  },
  title: {
    fontFamily: 'SF_regular',
    flex: 9,
    fontSize: 17,
    color: '#333333'
  },
  editStyle: {

    flex: 2,
    fontFamily: 'SF_medium',
    fontSize: 15,
    color: '#808080',
    textAlign: 'right'
  },
  descriptionStyle: {
    fontSize: 14,
    fontFamily: 'SF_light',
    color: '#808080',
  },
  footer: {
    marginTop: 5,
    flexDirection: 'row',
  },
  publishStyle: {
    flex: 3,
    fontSize: 14,
    fontFamily: 'SF_medium',

  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignContent: 'center'
  },
  imageStyle: {
    height: 9,
    width: 13.5,
    justifyContent: 'center',
    alignContent: 'center'
  },
  numberStyle: {
    flex: 1,
    color: '#808080',
    fontFamily: 'SF_medium'
  },
  starContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  starStyle: {
    height: 13.5,
    width: 14.5,
    justifyContent: 'center',
    alignContent: 'center',
  },


  priceStyle: {

    flex: 4,
    textAlign: 'right',
    color: '#50b7ed',
    fontSize: 15,
    fontFamily: 'SF_semibold',

  }
};


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(ItemAddProduct);

