import React, {PureComponent} from 'react';
import {Image, Text, View} from 'react-native';


class ItemReview extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        // onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}
        style={[styles.itemStyle, this.props.style]}>
        {
          <View style={styles.counterContainer}>
            {this.props.emoji === 3 ? (
              <Image style={{width: 20, height: 20}}
                     source={require('../../img/Profile/happy2.png')}/>
            ) : this.props.emoji === 1 ? (
              <Image style={{width: 20, height: 20}}
                     source={require('../../img/Profile/sad2.png')}/>
            ) : (
              <Image style={{width: 20, height: 20}}
                     source={require('../../img/Profile/ok2.png')}/>
            )
            }

          </View>
        }

        <View style={styles.item}>
          <View style={styles.rowStyle}>
            <View style={{justifyContent: 'center', flex: 1}}>
              <Text style={styles.title}>{this.props.order_number}</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', alignContent: 'flex-end', flexDirection: 'row'}}>

              <Image style={{alignSelf: 'center', width: 12.5, height: 12.5, marginRight: 3, marginTop: 1}}
                     source={require('../../img/Reviews/clock.png')} //40-40
              />
              <View style={{justifyContent: 'center', marginRight: 3}}>
                <Text style={styles.dateStyle}>{this.props.date}</Text>
              </View>
              <View style={{justifyContent: 'flex-start'}}>
                <Text style={styles.timeStyle}>{this.props.time}</Text>
              </View>
            </View>

          </View>

          <Text style={styles.descriptionStyle}>{this.props.description}</Text>
        </View>

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
    fontSize: 15,
    color: '#333333'
  },

  descriptionStyle: {
    fontSize: 14,
    fontFamily: 'SF_light',
    color: '#808080',
  },

  dateStyle: {
    color: '#1A1A1A',
    fontSize: 15,
    fontFamily: 'SF_light'
  },
  timeStyle: {
    // flex:2,
    color: '#666666',
    fontSize: 15,
    fontFamily: 'SF_light',

  }
};

export default ItemReview;

