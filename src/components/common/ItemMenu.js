import React, {Component} from 'react';
import {Alert, Image, Platform, Switch, Text, View} from 'react-native';
import Swipeout from 'react-native-swipeout';
import axios from 'axios';
import {connect} from 'react-redux';
import {deleteProductFromMenu} from './../../actions/menu';
import {APP_KEY, BASE_URL} from './../../../config/settings';

class ItemMenu extends Component {


  constructor(props) {
    super(props);
    this.state = {
      switch1Value: this.props.available === 1,
    };

  }

  toggleSwitch1 = (value) => {
    this.setState({switch1Value: value});

    const {token, vendor} = this.props;

    axios.post(`${BASE_URL}/vendors/${vendor}/products/${this.props.id}/change-status`, {},
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => console.log(response))
      .catch(error => console.log(error.response))

  };

  removeProduct = (id, menu) => {
    this.props.onDeleteProductFromMenu(id, menu);
    // const { token, vendor, menu } = this.props;


  };

  render() {

    let swipeBtns = [{
      component: (
        <Image style={{width: 71, height: 66}}
               source={require('../../img/Products/Asset8.png')}/>
      ),
      backgroundColor: '#F2F2F2',
      onPress: () => {
        Alert.alert(
          'Remove Item',
          'Do you want to remove this item?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.removeProduct(this.props.id, this.props.menu)},
          ],
          {cancelable: false}
        )
      }
    }];


    return (

      <Swipeout right={swipeBtns}
                autoClose={true}
                backgroundColor='transparent'>
        <View
          style={[styles.itemStyle, this.props.style]}>
          {

            <View style={styles.counterContainer}>
              {!this.state.switch1Value ? (
                  <Image style={{width: 17.5, height: 20.5}}
                         source={require('../../img/Footer/products2.png')//35-41
                         }
                  />
                ) :
                <Image style={{width: 17.5, height: 20}}
                       source={require('../../img/Footer/products1.png')//35-40
                       }
                />
              }
            </View>
          }

          <View style={styles.item}>
            <View style={styles.rowStyle}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              {/*
                                        <View style={{flex: 2, justifyContent: 'center'}}>
                                            <Text style={styles.priceStyle}>{this.props.price} ALL</Text>
                                        </View>*/
              }
              <View style={{alignItems: 'flex-end', flex: 2}}>
                <Switch
                  style={{transform: Platform.OS === "ios" ? [{scaleX: .7}, {scaleY: .7}] : [{scaleX: 1}, {scaleY: 1}]}}
                  onTintColor={"#50b7ed"}
                  onValueChange={this.toggleSwitch1}
                  value={this.state.switch1Value}/>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.descriptionStyle}>{this.props.description}</Text>
              <View style={{marginLeft: 5, flex: 3, justifyContent: 'flex-end', alignContent: 'flex-end'}}>
                <Text style={styles.priceStyle}>{this.props.price} {this.props.currencyChoosen}</Text>
              </View>
            </View>


          </View>


        </View>
      </Swipeout>
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
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
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
    // flex:3,
    fontSize: 17,
    color: '#333333'
  },

  descriptionStyle: {
    flex: 6,
    fontSize: 14,
    fontFamily: 'SF_light',
    color: '#808080',
  },


  priceStyle: {
    //flex:2,
    color: '#50b7ed',
    fontSize: 17,
    fontFamily: 'SF_semibold',

  }
};


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    currencyChoosen: state.auth.currencyChoosen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteProductFromMenu: (id, menu) => dispatch(deleteProductFromMenu(id, menu))
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(ItemMenu);

