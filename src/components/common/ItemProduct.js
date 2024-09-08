import React, {PureComponent} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {connect} from 'react-redux'
import {deleteProduct} from './../../actions/products';


class ItemProduct extends PureComponent {
  constructor(props) {
    super(props);
  }

  find_dimesions(layout) {
    const {height} = layout;
    this.props.onHeightItem(height);
  }

  deleteProduct = (id) => {
    this.props.onDeleteProduct(id)
  };

  render() {

    let swipeBtns = [{
      component: (
        <Image style={{width: 71, height: 68}}
               source={require('../../img/Products/Asset8.png')}/>
      ),
      backgroundColor: '#F2F2F2',
      onPress: () => {
        Alert.alert(
          'Delete Item',
          'Do you want to delete this item?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => this.deleteProduct(this.props.id)},
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
              {
                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('EditProduct', {id: this.props.id});
                }}><Text>Edit</Text></TouchableOpacity>
                /*<TouchableOpacity onPress={
                ()=>{this.props.navigation.navigate('EditProduct', {
                fontLoaded:this.props.fontLoaded
               });}
            }> <Text style={styles.editStyle}>{"Edit"}</Text> </TouchableOpacity>*/

              }
            </View>
            <Text style={styles.descriptionStyle}>{this.props.description}</Text>

            <View style={styles.footer}>

              <Text style={[styles.publishStyle, {color: this.props.color}]}>{this.props.published}</Text>

              {/*<View  style={styles.imageContainer}>*/}
              {/*<Image*/}
              {/*style={styles.imageStyle}*/}
              {/*source={require('../../../src/img/Products/Asset4.png')}/>*/}
              {/*</View>*/}

              {/*<Text style={styles.numberStyle}>12</Text>*/}
              <View style={styles.starContainer}>
                {this.props.popular === 0 ? (
                    <Image
                      style={styles.starStyle}
                      source={require('../../img/Products/star.png')}//29-27 (full start:26-25)
                    />
                  ) :
                  <Image
                    style={[styles.starStyle, {width: 13, height: 12.5}]}
                    source={require('../../img/Products/fullStar.png')}//29-27 (full start:26-25)
                  />
                }
              </View>
              <Text style={styles.priceStyle}>{this.props.price} {this.props.currencyChoosen}</Text>

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
    marginTop: 0,
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
    vendor: state.auth.vendor_id,
    currencyChoosen: state.auth.currencyChoosen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteProduct: id => dispatch(deleteProduct(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemProduct);

