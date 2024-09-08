import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

class ItemCategoryList extends PureComponent {
  constructor(props) {
    super(props);
  }
  renderAvailability(number, text) {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontFamily: 'SF_medium', fontSize: 16, color: '#333333'}}>{number} </Text>
        <Text style={{fontFamily: 'SF_light', fontSize: 16, color: '#4D4D4D'}}>{text}</Text>
      </View>
    );
  }
  renderStatus(number, status, color) {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontFamily: 'SF_medium', fontSize: 15, color: color}}>{number}</Text>
        <Text style={{fontFamily: 'SF_light', fontSize: 15, color: '#4D4D4D'}}>{status} </Text>
      </View>
    );
  }


  render() {
    return (
      <TouchableOpacity onPress={() => {
        this.props.navigation.navigate("ProductMenu", {id: this.props.id, title: this.props.title})
      }}>
        <View
          // onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}
        >
          <View style={styles.itemStyle}>
            <View style={{flex: 1}}>

              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text style={styles.productStyle}>{this.props.title}</Text>
                <View style={styles.containerNumber}>
                  <Text style={styles.numberProducts}>{this.props.total_per_category} products</Text></View>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {this.renderAvailability(this.props.products_available, "Available")}
                {this.renderAvailability(this.props.products_unavailable, "Unavailable")}
                <View style={{paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: '#e0e0e0'}}>
                  {this.renderAvailability(`${this.props.order} Total Orders`, '')}
                </View>
              </View>

            </View>
          </View>

          <View style={styles.footerStyle}>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {this.renderStatus('?', "Delivered", "#50b7ed")}
                {this.renderStatus('?', "Accepted", "#22B573")}
                {this.renderStatus('?', "Pending", "#FBAE17")}
                {this.renderStatus('?', "Rejected", "#FF0000")}
              </View>
            </View>


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
  productStyle: {
    //flex:1,
    color: '#1A1A1A',
    fontSize: 17,
    //textAlign:'left',
    fontFamily: 'SF_semibold'
  },

  numberProducts: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'SF_regular'
  },
  containerNumber: {
    borderRadius: 12,
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#50b7ed'
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


};

export default ItemCategoryList;
