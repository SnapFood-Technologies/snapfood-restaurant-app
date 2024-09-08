import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';


class OrderItem extends Component {
  constructor(props) {
    super(props);
  }

  find_dimesions(layout) {
    const {height} = layout;
    this.props.onHeightItem(height);
  }

  render() {


    return (
      <TouchableOpacity onPress={() => {
        this.props.navigation.navigate("OrderDetails", {
          fontLoaded: this.props.fontLoaded,
          color: this.props.color, status: this.props.status,
          id: this.props.id
        })
      }}>
        <View onLayout={(event) => {
          this.find_dimesions(event.nativeEvent.layout)
        }}>
          <View style={[styles.itemStyle, this.props.style]}>
            <View style={styles.contentStyle}>
              <View style={styles.firstRow}>
                <Text style={styles.addressStyle}>{this.props.address1}</Text>
                <Text style={styles.priceStyle}>{this.props.price.split('.')[0]} {this.props.currencyChoosen}</Text>
              </View>

              <View style={styles.secondRow}>
                <Text style={styles.styleAddress}>{this.props.address2}</Text>
                <Text style={styles.taxStyle}>{this.props.tax.split('.')[0]} {this.props.currencyChoosen} Tax</Text>
              </View>

            </View>
          </View>
          <View style={styles.footerStyle}>
            <View style={styles.clockContainer}>
              <Image
                style={styles.clockStyle}
                source={require('../../img/Orders/Clock.png')}  //26-26
              />
            </View>
            <Text style={styles.dateStyle}>{this.props.date}</Text>

            <View style={[styles.commentsStyle, {display: this.props.display}]}>
              <View style={styles.clockContainer}>
                <Image
                  style={styles.chatStyle}
                  source={require('../../img/Orders/Chat.png')} //26-23 (26 width )
                />
              </View>
              <Text style={styles.chatNumberStyle}>{this.props.comments}</Text>
            </View>

            <Text style={[styles.statusStyle, {color: this.props.color}]}>{this.props.status}</Text>


          </View>


        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  itemStyle: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '3%',
    paddingBottom: '3%'
  },

  contentStyle: {
    flex: 2,
    flexDirection: 'column'
  },
  firstRow: {
    flexDirection: 'row'
  },
  addressStyle: {
    flex: 1,
    color: '#000000',
    fontSize: 17,
    textAlign: 'left',
    fontFamily: 'SF_light'
  },
  priceStyle: {
    flex: 1,
    textAlign: 'right',
    fontSize: 17,
    color: '#000000',
    fontFamily: 'SF_bold',
  },
  secondRow: {
    flexDirection: 'row',
  },
  styleAddress: {
    flex: 1,
    color: '#000000',
    fontSize: 17,
    textAlign: 'left',
    fontFamily: 'SF_light'
  },
  taxStyle: {
    flex: 1,
    color: '#000000',
    fontSize: 17,
    textAlign: 'right',
    fontFamily: 'SF_light'
  },
  footerStyle: {
    marginTop: 2,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '3%',
    paddingBottom: '3%'
  },
  clockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  clockStyle: {
    height: 13,
    width: 13,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dateStyle: {
    flex: 3,
    textAlign: 'left',
    fontFamily: 'SF_light',
    fontSize: 16
  },
  chatStyle: {
    width: 13,
    height: 11.5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  chatNumberStyle: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'SF_light',
    color: '#50b7ed',
    marginRight: 20
  },
  statusStyle: {
    flex: 5,
    fontSize: 16,
    fontFamily: 'SF_medium',
    textAlign: 'right'
  },
  commentsStyle: {
    flex: 2,
    flexDirection: 'row'
  }


};

export default OrderItem;
