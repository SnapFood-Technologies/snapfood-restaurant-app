import React, {Component} from 'react';
import {Alert, Dimensions, Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import CircleStatus from '../common/CircleStatus';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import {openModal} from './../../actions/print_modal';
import axios from 'axios';
import {Input_Label, Section} from "../common/index";
import {fetchNewOrders} from "../../actions/notifications";

let {height, width} = Dimensions.get('window');

let color = {
  new: '#F7931E',
  processing: '#22B573',
  delivered: '#F7931E',
  declined: '#C61425',
  notificationTime: '#FB5E6F'
};


class NotificationItem extends Component {


  constructor(props) {
    super(props);
    this.state = {
      cancelPicker: false,
      okPicker: false,
      modalPicker: false,
      rejectedReason: '',
      error: ''
    };

  }

  renderHeaderSection = () => {
    const {notification} = this.props;

    let duration = moment.duration(moment().diff(this.props.time_created));
    let seconds = parseInt(duration.asSeconds());
    let minutes = 0;
    let hours = 0;

    if (seconds > 59)
      minutes = parseInt(duration.asMinutes());

    if (minutes > 59)
      hours = parseInt(duration.asHours());


    return (
      <View style={styles.rowStyle}>
        <View style={{justifyContent: 'center', flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 2.5, flexDirection: 'row'}}>
              <Text style={[styles.title]}>{notification.order_number}</Text>
            </View>

            <View style={{flexDirection: 'row', flex: 2.2}}>
              <Text style={{
                textAlign: 'center',
                fontSize: 13,
                fontFamily: 'SF_regular',
                color: color['notificationTime'],
                flex: 1.4
              }}>
                {
                  hours !== 0 ? hours + " hours ago" : minutes !== 0 ? minutes + " min ago" : seconds + " sec ago"
                }</Text>
              <View style={{flex: 0.8}}>
                <Image style={{width: 33.5, height: 17.5, marginLeft: 10}}
                       source={require('../../img/Notifications/new-notifications.png')}/>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  };

  renderProductsSection = () => {
    return (
      <View style={{marginBottom: 5, width: '70%'}}>
        <Text style={styles.descriptionStyle}>{this.props.products.map((product) => {
          return product.quantity + "x " + product.title + ", "
        })}</Text>
      </View>
    )
  };

  setModalVisible(visible) {
    this.setState({modalPicker: visible});
  }

  renderError() {
    return (
      <View style={{backgroundColor: 'white'}}>
        {
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        }
      </View>
    );
  }


  renderModal = () => {

    return (
      <Modal animationType="slide"
             transparent={true}
             visible={this.state.modalPicker}
             onRequestClose={() => {
               alert('Modal has been closed.');
             }}>

        <View style={{
          flex: 1,
          backgroundColor: '#00000080',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            justifyContent: 'space-between',
            width: width - 50,
            backgroundColor: 'white',
            height: height / 3
          }}>

            <View style={{padding: 10}}>
              <Text style={{fontFamily: 'SF_medium', textAlign: 'center', fontSize: 19, fontWeight: "400"}}>
                Reject this order?
              </Text>


              <Section style={{marginTop: 10, marginLeft: 8, marginRight: 10}}>
                <Input_Label
                  value={this.state.rejectedReason}
                  onChangeText={rejectedReason => {
                    this.setState({rejectedReason, error: ''})
                  }}
                  styleInput={styles.styleInput}
                  label="Reason"
                />
              </Section>

              {this.renderError()}


            </View>


            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginLeft: 30,
              marginRight: 30,
              marginBottom: 30,
              alignItems: 'center'
            }}>
              <TouchableOpacity onPress={() => this.declineOrder()}>
                <Text style={{fontFamily: 'SF_medium', fontSize: 17}}>
                  OK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.setModalVisible(!this.state.modalPicker);
                this.setState({error: ''})
              }}>
                <Text style={{fontFamily: 'SF_medium', fontSize: 17}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  };
  renderModal = () => {

    return (
      <Modal animationType="slide"
             transparent={true}
             visible={this.state.modalPicker}
             onRequestClose={() => {
               alert('Modal has been closed.');
             }}>

        <View style={{
          flex: 1,
          backgroundColor: '#00000080',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            justifyContent: 'space-between',
            width: width - 50,
            backgroundColor: 'white',
            height: height / 3,
            borderRadius: 15
          }}>

            <View style={{padding: 10, paddingTop: 12, paddingBottom: 5}}>
              <Text style={{fontFamily: 'SF_semibold', textAlign: 'center', fontSize: 18, fontWeight: "400"}}>
                Reject this order?
              </Text>


              <Section style={{marginTop: 5, marginLeft: 8, marginRight: 10}}>
                <Input_Label
                  value={this.state.rejectedReason}
                  onChangeText={rejectedReason => {
                    this.setState({rejectedReason, error: ''})
                  }}
                  styleInput={styles.styleInput}
                  label="Reason"
                />
              </Section>
              {this.renderError()}
            </View>


            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginLeft: 30,
              marginRight: 30,
              marginBottom: 10,
              alignItems: 'center'
            }}>
              <TouchableOpacity onPress={() => this.declineOrder()} style={styles.okButtonStyle}>
                <Text style={{
                  alignSelf: 'center',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'SF_semibold'
                }}>
                  OK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.setModalVisible(!this.state.modalPicker);
                this.setState({error: ''})
              }} style={styles.cancelButtonStyle}>
                <Text style={{
                  alignSelf: 'center',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'SF_semibold'
                }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    )
  };

  renderFooterSection = () => {
    const {notification} = this.props;
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{justifyContent: 'center', alignContent: 'center', marginRight: 5}}>
          <Image
            style={styles.clockStyle}
            source={require('../../img/Orders/Clock.png')}  //26-26
          />
        </View>
        <View style={{flex: 2, flexDirection: 'row'}}>
          <Text style={[styles.timeStyle, {marginRight: 5}]}>
            {moment(notification.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}
          </Text>
          <Text style={styles.timeStyle}>
            Ora {moment(notification.created_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
          </Text>
        </View>
        <Text style={{
          flex: 1,
          textAlign: 'right',
          marginLeft: 14,
          fontFamily: 'SF_semibold',
          fontSize: 15,
          color: '#F7931E'
        }}>
          {notification.total_price} {this.props.currencyChoosen}
        </Text>
      </View>
    )
  };

  renderLeftSection = () => {
    const {notification} = this.props;
    return (
      <View style={styles.counterContainer}>
        <CircleStatus
          number={1}
          width={38}
          height={38}
          borderRadius={28}
          color={color[notification.status]}
        />
        <Text style={{
          fontFamily: 'SF_semibold',
          fontSize: 10,
          marginTop: -10,
          color: '#808080',
          textAlign: 'center'
        }}>{notification.status}</Text>
      </View>

    )
  };

  renderLeftSectionImage = () => {
    const {notification} = this.props;
    return (
      <Image style={styles.splitLine}
             source={require('../../img/Notifications/split.png')}/>

    )
  };

  acceptOrder = () => {
    const {token, vendor, notification} = this.props;

    axios.post(`${BASE_URL}/vendors/${vendor}/orders/set-order-to-processing/${notification.id}`, {},
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        // this.props.fetchNewOrders(token, vendor)
        Alert.alert(`Order ${notification.order_number} accepted`, '', [{
          text: "Close", onPress: () => {
          }
        }], {cancelable: false})
        // this.props.onModalOpen(response.data.urlEncodeOrderData)
        this.props.onNewOrders();

      })
      .catch(error =>
          console.log(error)
        // Alert.alert(`An error occoured`,'',[{text:"Close",onPress: () => {}}], { cancelable: false })
      )


  }

  //Tested - OK
  declineOrder = () => {

    const {rejectedReason} = this.state;
    if (!rejectedReason)
      this.setState({error: 'Fill the reason you want to reject'});
    else {

      this.setModalVisible(!this.state.modalPicker);

      const {token, vendor, notification} = this.props;

      axios.post(`${BASE_URL}/vendors/${vendor}/orders/set-order-to-declined/${notification.id}`, {reason: rejectedReason},
        {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {
          // this.props.fetchNewOrders(token, vendor)
          Alert.alert(`Order ${notification.order_number} rejected`, '', [{
            text: "Close", onPress: () => {
            }
          }], {cancelable: false})
          this.props.onNewOrders();

        })
        .catch(error =>
          Alert.alert(`An error occoured`, '', [{
            text: "Close", onPress: () => {
            }
          }], {cancelable: false})
        )

    }
  }


  render() {

    let swipeBtns = [{
      component: (
        <Image style={{width: 80, height: 100, marginTop: 15}}
               source={require('../../img/Notifications/order-reject.png')}/>
      ),
      backgroundColor: 'transparent',
      borderRadius: 8,
      onPress: () => {
        this.setModalVisible(true)
      },
    },
      {
        component: (<Image style={{width: 80, height: 100, marginTop: 15}}
                           source={require('../../img/Notifications/order-accept.png')}/>),
        backgroundColor: 'transparent',
        onPress: () => {

          Alert.alert(
            'Accept Order',
            'Do you want to accept this order?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.acceptOrder()},
            ],
            {cancelable: false}
          )
        },
      }
    ];

    return (

      <Swipeout right={swipeBtns}
                autoClose={true}
        // sensitivity={100}
                backgroundColor='transparent'>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("OrderDetails", {
            color: this.props.color, status: this.props.status,
            id: this.props.id
          })
        }}>

          <View style={[styles.itemStyle, this.props.style]}>

            {this.renderLeftSection()}
            {this.renderLeftSectionImage()}
            {this.renderModal()}


            <View style={styles.item}>
              {this.renderHeaderSection()}
              {this.renderProductsSection()}
              {this.renderFooterSection()}
            </View>

          </View>
        </TouchableOpacity>
      </Swipeout>

    );

  }
}

const styles = {
  itemStyle: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 7,
    padding: 8,
  },
  counterContainer: {
    flex: 1.7,
    alignContent: 'center',
    justifyContent: 'center',
    borderRightColor: '#e0e0e0',
  },
  splitLine: {
    marginTop: 5,
    marginLeft: 10
  },


  item: {
    flex: 11,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingTop: 2,
  },
  rowStyle: {
    flexDirection: 'row'
  },
  title: {
    fontFamily: 'SF_regular',
    fontWeight: 'bold',
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

  clockStyle: {
    height: 13,
    width: 13,
    justifyContent: 'center',
    alignContent: 'center',
  },
  timeStyle: {
    fontFamily: 'SF_light',
    fontSize: 15,
    color: '#1A1A1A'
  },

  styleInput: {
    fontSize: 17,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    fontFamily: 'SF_light'
  },
  cancelButtonStyle: {
    width: '35%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#e2353e',
    marginTop: -125,
    marginBottom: -45,
    height: 30,
    justifyContent: 'center',
  },

  okButtonStyle: {
    width: '30%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#5ad6b2',
    marginTop: -125,
    marginBottom: -45,
    height: 30,
    justifyContent: 'center',
  },
  errorTextStyle: {
    fontSize: 14.5,
    alignSelf: 'center',
    color: '#e2353e',
    fontFamily: 'SF_medium'
  }
};


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id,
    currencyChoosen: state.auth.currencyChoosen
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onModalOpen: url => dispatch(openModal(url)),
    onNewOrders: () => dispatch(fetchNewOrders())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationItem);
