import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {WebView} from 'react-native-webview';
import CircleStatus from "../common/CircleStatus";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import axios from 'axios';
import {APP_KEY, BASE_URL} from './../../../config/settings';
import {connect} from 'react-redux';
import moment from 'moment';
import PrintModal from "react-native-modal";
import {Input_Label, Section} from "../common/index";
import {closeModal, openModal} from './../../actions/print_modal';
import {fetchNewOrders} from "../../actions/notifications";
import {Spinner} from './../common/index';
import NotificationBadge from '../common/NotificationBadge';

let {height, width} = Dimensions.get('window');

class OrderDetails extends Component {

  static navigationOptions = ({navigation}) => {

    return {
      title: "Order Details",
      headerTitleStyle: {
        fontWeight: '400',
        fontSize: 17,
        width: "100%",
        textAlign: 'center',
      },
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',
      headerRight: <TouchableOpacity onPress={() => {
        navigation.navigate('Notifications');
      }}>
        <NotificationBadge/>
      </TouchableOpacity>,
    };
  };


  constructor(props) {

    super(props);
    this.state = {
      order: null,
      products: null,
      showComments: false,
      regionSet: false,
      region: {
        latitude: 41.327953,
        longitude: 19.819025,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      loaded: false,
      loadedComments: false,
      refreshing: false,
      cancelPicker: false,
      okPicker: false,
      modalPicker: false,
      printModal: false,
      receiptURL: null,
      rejectedReason: '',
      error: '',
      comment: '',
      comments: [],
      orderNumber: null,

      time: {
        "m": 0,
        "s": 0
      },
      seconds: 0
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

  }

  secondsToTime(secs) {

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "m": minutes,
      "s": seconds
    };
    return obj;
  }


  setModalVisible(visible) {
    this.setState({modalPicker: visible});
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      this.setState({color: '#C61425', status: 'declined'});
      this.setState({time: {"m": 0, "s": 0}, seconds: 0});

      clearInterval(this.timer);
    }
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


  acceptOrder = () => {
    const {token, vendor, notification} = this.props;
    const {params} = this.props.navigation.state;

    axios.post(`${BASE_URL}/vendors/${vendor}/orders/set-order-to-processing/${params.id}`, {},
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        // this.props.fetchNewOrders(token, vendor)
        Alert.alert(`Order accepted`, '', [{
          text: "Close", onPress: () => {
          }
        }], {cancelable: false})
        //this.props.onModalOpen(response.data.urlEncodeOrderData);
        this.setState({color: '#22B573', status: 'processing'})
        this.props.onNewOrders();

      })
      .catch(error =>
        Alert.alert(`An error occoured`, '', [{
          text: "Close", onPress: () => {
          }
        }], {cancelable: false})
      )


  };

  //Not tested
  declineOrder = () => {

    const {rejectedReason} = this.state;
    const {params} = this.props.navigation.state;
    if (!rejectedReason)
      this.setState({error: 'Fill the reason you want to reject'});
    else {

      this.setModalVisible(!this.state.modalPicker);

      const {token, vendor} = this.props;

      axios.post(`${BASE_URL}/vendors/${vendor}/orders/set-order-to-declined/${params.id}`, {reason: rejectedReason},
        {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {
          Alert.alert(`Order ${this.state.order.order_number} rejected`, '', [{
            text: "Close", onPress: () => {
            }
          }], {cancelable: false})
          this.props.onNewOrders();
          this.setState({color: '#C61425', status: 'declined'})

        })
        .catch(error =>
          Alert.alert(`An error occoured`, '', [{
            text: "Close", onPress: () => {
            }
          }], {cancelable: false})
        )

    }
  };


  _onRefresh() {
    this.setState({refreshing: true});
    const {token, vendor} = this.props;
    const {params} = this.props.navigation.state;
    axios.get(`${BASE_URL}/vendors/${vendor}/orders/${params.id}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({
          order: response.data.order,
          products: response.data.order.products,
          status: response.data.order.status,
          color: response.data.order.status == "delivered" ? '#50b7ed' : response.data.order.status == "new" ? '#F7931E' :
            response.data.order.status == "declined" ? '#C61425' :
              '#22B573',
          rejectedReason: response.data.order.declined_reason,
          loaded: true,
          orderNumber: response.data.order.order_number,
          refreshing: false
        });

        if (this.state.status === "new") {
          let duration = parseInt(moment.duration(moment().diff(moment(this.state.order.created_at, 'YYYY-MM-DD HH:mm:ss'))).asSeconds());
          if (duration > 180) {
            this.setState({color: '#C61425', status: 'declined'});

            let timeLeftVar = this.secondsToTime(0);
            this.setState({time: {"m": 0, "s": 0}, seconds: 0});
          } else {
            let timeLeftVar = this.secondsToTime(180 - duration);
            this.setState({time: timeLeftVar, seconds: (180 - duration)});
            this.startTimer();
          }
        }


      })
      .catch(error => console.log(error.response))


  }


  componentWillMount() {
    const {params} = this.props.navigation.state;

    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/orders/${params.id}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({
          order: response.data.order,
          products: response.data.order.products,
          color: response.data.order.status == "delivered" ? '#50b7ed' : response.data.order.status == "new" ? '#F7931E' :
            response.data.order.status == "declined" ? '#C61425' : '#22B573',
          status: response.data.order.status,
          rejectedReason: response.data.order.declined_reason,
          orderNumber: response.data.order.order_number,
          loaded: true
        })

        if (this.state.status === "new") {
          let duration = parseInt(moment.duration(moment().diff(moment(this.state.order.created_at, 'YYYY-MM-DD HH:mm:ss'))).asSeconds());
          if (duration > 180) {
            this.setState({color: '#C61425', status: 'declined'})

            let timeLeftVar = this.secondsToTime(0);
            this.setState({time: {"m": 0, "s": 0}, seconds: 0});
          } else {
            let timeLeftVar = this.secondsToTime(180 - duration);
            this.setState({time: timeLeftVar, seconds: (180 - duration)});
            this.startTimer();
          }
        }


      })
      .catch(error => console.log(error.response));

    axios.get(`${BASE_URL}/vendors/${vendor}/orders/${params.id}/comments`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({
          comments: response.data.comments,
          loadedComments: true
        })
      })
      .catch(error => console.log(error.response));

  }


  onRegionChange(region) {
    this.setState({region});

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen && nextProps.receiptURL !== null) {
      this.setState({printModal: true, receiptURL: nextProps.receiptURL})
      console.log(nextProps)
    }

    if (nextProps.isOpen === false)
      this.setState({printModal: false, receiptURL: nextProps.receiptURL})

  }

  _renderModalContent = () => {

    return (
      (
        <View style={{height: 0.3 * height, justifyContent: 'center', backgroundColor: 'white'}}>
          <Text
            style={{fontFamily: 'SF_semibold', textAlign: 'center', fontSize: 18, fontWeight: "400", marginTop: 15}}>
            Print Order
          </Text>

          <TouchableOpacity style={styles.buttonExit} onPress={() => this.props.onModalClose()}>
            <Text style={{
              alignSelf: 'center',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'SF_semibold'
            }}>
              Exit Printing Mode
            </Text>
          </TouchableOpacity>
          <WebView
            source={
              {
                uri: BASE_URL + "/printer?" + this.state.receiptURL,
                headers: {

                  'Authorization': `Bearer ${this.props.token}`
                }
              }
            }
            style={{flex: 5}}

          />

        </View>
      )
    );
  };

  onButtonPress = () => {
    if (this.state.comment === '')
      Alert.alert("Please write a comment");
    else {
      const {token, vendor} = this.props;
      const {params} = this.props.navigation.state;
      axios.post(`${BASE_URL}/vendors/${vendor}/orders/${params.id}/comments`,
        {text: this.state.comment},
        {headers: {"App-Key": APP_KEY, "Authorization": `Bearer ${token}`}})
        .then(response => {
          this.refreshComments();
          this.setState({comment: ''})
          // Alert.alert("Commented Successfully");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");
        });
    }
  };

  refreshComments = () => {
    const {params} = this.props.navigation.state;

    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}/orders/${params.id}/comments`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({
          comments: response.data.comments,
          //loadedComments:true
        })
      })
      .catch(error => console.log(error.response));
  };

  renderOrder = () => {
    return this.state.products.map(product => {
        return (
          <View key={product.id}>
            <View style={{flexDirection: 'row', marginBottom: 3}}>
              <View style={{flexDirection: 'row', flex: 1, alignContent: 'flex-start'}}>
                <Text style={styles.orderStyle}>{product.quantity}x </Text>
                <Text style={styles.orderStyle}> {product.title}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.orderStyle, {textAlign: 'right'}]}>{product.total_price}</Text>
              </View>
            </View>

            <View>
              {
                product.product_options.map((option => {
                  return (
                    <View key={option.id} style={{flexDirection: 'row', marginBottom: 2}}>

                      <Text style={[styles.orderStyle, {
                        fontSize: 13.5,
                        padding: 2, paddingLeft: 5, paddingRight: 5, borderRadius: 3, overflow: 'hidden',
                        textAlign: 'left', backgroundColor: '#337ab7', color: '#ffffff', marginLeft: 30
                      }]}>
                        {option.title} - {option.price} {this.props.currencyChoosen}
                      </Text>
                    </View>
                  );
                }))
              }
            </View>
          </View>
        )
      }
    );
  }

  renderComment(topic, comment, date, time) {
    return (
      <View
        style={{paddingTop: 10, marginTop: 10, flexDirection: 'row', borderTopWidth: 0.6, borderTopColor: '#588184'}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 13.5, fontFamily: 'SF_semibold', color: '#50b7ed'}}>{topic}</Text>
          <Text style={{fontSize: 13.5, fontFamily: 'SF_medium', color: '#666666'}}>{comment}</Text>
        </View>
        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
          <View style={{justifyContent: 'center', alignContent: 'center', marginRight: 5}}>
            <Image
              style={styles.clockStyle}
              source={require('../../img/Orders/Clock.png')}  //26-26
            />
          </View>

          <View style={{justifyContent: 'center', alignContent: 'center', marginRight: 5}}>
            <Text style={[styles.timeStyle, {
              marginRight: 5,
              justifyContent: 'center',
              alignContent: 'center'
            }]}>{date} </Text>
          </View>
          <View style={{justifyContent: 'center', alignContent: 'center', marginRight: 5}}>
            <Text style={[styles.timeStyle, {
              marginRight: 5,
              justifyContent: 'center',
              alignContent: 'center'
            }]}>Ora {time} </Text>
          </View>
        </View>
      </View>
    );
  }

  onRejectOrder = () => {
    this.setModalVisible(true)
  };

  onAcceptOrder = () => {
    Alert.alert(
      'Accept Order',
      'Do you want to accept this order?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.acceptOrder()},
      ],
      {cancelable: false}
    )
  };

  onSetToDelivered = () => {
    const {params} = this.props.navigation.state;

    const {token, vendor} = this.props;

    axios.post(`${BASE_URL}/vendors/${vendor}/orders/set-order-to-delivered/${params.id}`, {},
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        Alert.alert("Order set to delivered");
        this.setState({color: '#50b7ed', status: 'delivered'})
      })
      .catch(error => console.log(error.response));
  };

  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  render() {
    const {params} = this.props.navigation.state;

    const {order, loaded, loadedComments} = this.state;
    if (loaded && loadedComments) {


      return (
        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: 'white'}}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                      />
                    }>
          <View style={{backgroundColor: 'white'}}>
            {this.renderModal()}

            {
              this.state.status === "declined" ? (
                <View style={[styles.deliverDetails, {
                  marginTop: 15,
                  padding: 10,
                  backgroundColor: this.state.color,
                  height: 40,
                }]}>
                  <Text style={{color: 'white', fontFamily: 'SF_bold', fontSize: 15}}>x Rejected
                    Reason: <Text style={styles.remainingTimeCal}>{this.state.rejectedReason}</Text></Text>
                </View>
              ) : null
            }

            {
              this.state.status === "new" ? (
                <View style={{flexDirection: 'row'}}>
                  <View style={[styles.deliverDetails, {
                    marginTop: 15,
                    padding: 10,
                    backgroundColor: this.state.color,
                    height: 40,
                    width: '69%'
                  }]}>
                    <Text style={styles.remainingTime}>Remaining Time:
                      <Text style={styles.remainingTimeCal}> {this.state.time.m} min, {this.state.time.s} secs</Text>
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => this.onRejectOrder()}>
                    <Image style={{
                      width: 40,
                      height: 40,
                      marginTop: 15,
                      paddingTop: 10,
                      borderRadius: 8,
                      marginRight: 5
                    }}
                           source={require('../../img/Orders/order-details-decline.png')}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.onAcceptOrder()}>
                    <Image style={{
                      width: 40,
                      height: 40,
                      marginTop: 15,
                      paddingTop: 10,
                      borderRadius: 8
                    }}
                           source={require('../../img/Orders/order-details-accept.png')}/>
                  </TouchableOpacity>
                  <PrintModal
                    isVisible={this.state.printModal}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                  >
                    {this._renderModalContent()}
                  </PrintModal>
                </View>
              ) : null
            }
            {
              this.state.status === "processing" ? (
                <View style={{flexDirection: 'row'}}>
                  <View style={[styles.deliverDetails, {
                    marginTop: 15,
                    padding: 10,
                    backgroundColor: this.state.color,
                    height: 40,
                    width: '81%'
                  }]}>
                    <Text style={styles.remainingTime}>Order {this.state.orderNumber} Accepted</Text>
                  </View>


                  <TouchableOpacity onPress={() => this.onSetToDelivered()}>
                    <Image style={{
                      width: 40,
                      height: 40,
                      marginTop: 15,
                      paddingTop: 10,
                      borderRadius: 8,
                      marginRight: 5
                    }}
                           source={require('../../img/Orders/setToDelivered.png')}/>
                  </TouchableOpacity>
                  <PrintModal
                    isVisible={this.state.printModal}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                  >
                    {this._renderModalContent()}
                  </PrintModal>

                </View>

              ) : null
            }
            <View style={[styles.deliverDetails]}>
              <View style={{flexDirection: 'column', flex: 3, paddingLeft: 0}}>

                <Text
                  style={[styles.deliveredStyle, {
                    color: this.state.color,
                    fontFamily: 'SF_semibold',
                    fontSize: 15.5,
                  }]}>{this.capitalizeFirstLetter(this.state.status)}</Text>
                <View style={{flexDirection: 'row', marginBottom: 2}}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text style={styles.totalStyle}>Total Price: </Text>
                    <Text
                      style={[styles.priceStyle, {color: this.state.color}]}>
                      {order.total_price.split('.')[0]} {this.props.currencyChoosen}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1, alignContent: 'flex-start'}}>
                    <Text style={styles.totalStyle}>Total Tax: </Text>
                    <Text
                      style={[styles.priceStyle, {color: this.state.color}]}>
                      {order.tax_total.split('.')[0]} {this.props.currencyChoosen}
                    </Text>
                  </View>

                </View>

                <View style={{flexDirection: 'row', marginBottom: 8}}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text style={styles.totalStyle}>Sub Price: </Text>
                    <Text
                      style={[styles.priceStyle, {color: this.state.color}]}>
                      {order.sub_total.split('.')[0]} {this.props.currencyChoosen}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text style={styles.totalStyle}>Tax Percentage: </Text>
                    <Text
                      style={[styles.priceStyle, {color: this.state.color}]}>{order.tax_percent} %</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', flex: 1, marginTop: -7, paddingBottom: 5}}>
                  <Text style={styles.totalStyle}>Delivery Fee: </Text>
                  <Text
                    style={[styles.priceStyle, {color: this.state.color}]}>
                    {order.delivery_fee.split('.')[0]} {this.props.currencyChoosen}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 0}}>
                  <View style={{justifyContent: 'center', alignContent: 'center', marginRight: 5}}>
                    <Image
                      style={styles.clockStyle}
                      source={require('../../img/Orders/Clock.png')}  //26-26
                    />
                  </View>
                  <Text
                    style={[styles.timeStyle, {marginRight: 5}]}>{moment(order.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}</Text>
                  <Text
                    style={styles.timeStyle}>Ora {moment(order.created_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}</Text>
                </View>
              </View>

              <View style={[styles.deliverTime, {marginRight: -15}]}>
                <CircleStatus
                  number={moment(order.updated_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
                  color={this.state.color}
                  status={moment(order.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}
                  width={40}
                  height={40}
                  borderRadius={20}


                />
              </View>
            </View>
            <View style={[styles.deliverDetails, {
              flexDirection: 'column',
              padding: 10,
              paddingTop: 10
            }]}>
              <Text style={{
                fontFamily: 'SF_semibold',
                fontSize: 15.5,
                color: '#4D4D4D',
                marginBottom: 5
              }}>Order</Text>
              {this.renderOrder()}
            </View>

            <View style={[styles.deliverDetails, {
              flexDirection: 'column',
              padding: 10,
              paddingTop: 10
            }]}>
              <Text style={[styles.commentStyle]}>Comment here</Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput

                  value={this.state.comment}
                  onChangeText={(comment) => {
                    this.setState({comment});
                  }}
                  style={[styles.commentsStyle, {flex: 3}]}
                  underlineColorAndroid="transparent"
                  borderBottomWidth={1}
                  borderBottomColor={"#848484"}
                />

                <TouchableOpacity
                  onPress={() => this.onButtonPress()}
                  style={[styles.createButtonStyle, {flex: 1, backgroundColor: this.state.color}]}>
                  <Text style={styles.createTextStyle}>
                    Comment
                  </Text>
                </TouchableOpacity>

              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <View style={{justifyContent: 'center', flex: 2}}>
                  {!this.state.showComments ? (
                    <TouchableOpacity onPress={() => {
                      this.setState({showComments: true})
                    }}>
                      <Text style={styles.coPrintmmentStyle}>Show comments <Icon name="chevron-down"
                                                                                 color={"#666666"}/>
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => {
                      this.setState({showComments: false})
                    }}>
                      <Text style={styles.commentStyle}>Hide comments <Icon name="chevron-up"
                                                                            color={"#666666"}/>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
              <View>
                {/*
                                this.state.showComments ? (
                                    this.renderComment("Delivery", "Motoristi u nis", "02/29/2018", "18:44")
                                ) : null
                                */
                }
                {
                  this.state.showComments ? (

                    this.state.comments.map((comment) => {
                      return (
                        <View key={comment.id}>
                          {
                            this.renderComment("Admin", comment.text,
                              moment(comment.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
                              moment(comment.created_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'))
                          }
                        </View>
                      )
                    })
                  ) : null

                }
              </View>
            </View>

            <View style={[styles.deliverDetails, {
              flexDirection: 'column',
              paddingTop: 10,
              padding: 10
            }]}>
              <Text
                style={{fontFamily: 'SF_semibold', fontSize: 15.5, color: '#4D4D4D', marginBottom: 5}}>Customer</Text>
              <View style={{flexDirection: 'row', marginBottom: 2}}>
                <Text style={styles.dataStyle}>Phone: </Text>
                <Text style={styles.orderStyle}>{order.address.mobile}</Text>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 2}}>
                <Text style={styles.dataStyle}>Order Notes: </Text>
                <Text style={styles.orderStyle}>{order.order_note}</Text>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 2}}>
                <Text style={styles.dataStyle}>Address: </Text>
                <Text
                  style={styles.orderStyle}>{order.address.street}</Text>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 2}}>
                <Text style={styles.dataStyle}>Address Notes: </Text>
                <Text style={styles.orderStyle}>{order.notes}</Text>
              </View>
            </View>

            <View style={[styles.deliverDetails, {flexDirection: 'column'}]}>
              <View style={{paddingBottom: 10}}>
                <Text style={{
                  fontFamily: 'SF_semibold',
                  fontSize: 15.5,
                  color: '#4D4D4D',
                }}>Location</Text>
              </View>
              <View>
                <MapView
                  style={{height: 200, position: 'relative', left: 0, right: 0}}
                  initialRegion={this.state.region}
                  //onRegionChange={this.onRegionChange.bind(this)}
                >
                  <MapView.Marker
                    coordinate={{
                      latitude: parseFloat(this.state.order.address.lat),
                      longitude: parseFloat(this.state.order.address.lng)
                    }}
                    pinColor='rgba(128, 0, 0, 1)'/>
                </MapView>
              </View>
            </View>

          </View>
        </ScrollView>
      );
    } else return (<Spinner/>);
  }
}

const styles = {
  deliverDetails: {
    margin: 10,
    flexDirection: 'row',
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 6,
    shadowRadius: 2,
    borderRadius: 8,
    elevation: 2,
    padding: 10,
    paddingTop: 10

  },
  deliverTime: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  deliveredStyle: {
    fontSize: 15.5,
    fontFamily: 'SF_semibold',
    // color:'#50b7ed',
    marginBottom: 5
  },
  totalStyle: {
    fontSize: 13.5,
    fontFamily: 'SF_medium',
    color: '#666666'
  },
  priceStyle: {
    fontSize: 14,
    fontFamily: 'SF_semibold',
    // color:'#50b7ed'
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
  orderStyle: {
    fontFamily: 'SF_medium',
    fontSize: 13.5,
    fontWeight: "500",
    color: '#666666'
  },
  commentStyle: {
    fontFamily: 'SF_semibold',
    fontSize: 15.5,
    color: '#4D4D4D',
    marginBottom: 5,
  },
  buttonText: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'SF_regular'
  },

  remainingTime: {
    color: 'white',
    fontFamily: 'SF_bold',
    fontSize: 14,
    marginTop: 0
  },

  remainingTimeCal: {
    color: 'white',
    fontFamily: 'SF_regular',
    fontSize: 14,
    marginTop: 5
  },

  buttonStyle: {
    borderRadius: 5,
    // backgroundColor:'#50b7ed',
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'flex-end'
  },
  dataStyle: {
    //SF Semibold 24pt = #333333
    fontFamily: 'SF_semibold',
    fontSize: 14,
    color: '#333333'
  },
  buttonExit: {
    borderRadius: 15,
    backgroundColor: '#e2353e',
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    width: '55%',
    alignSelf: 'center',
    height: 30,
  },
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  createButtonStyle: {
    // width:'30%',
    alignSelf: 'flex-end',
    borderRadius: 10,
    backgroundColor: '#50b7ed',
    height: 30,
    marginLeft: 5,
    justifyContent: 'center',
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
    receiptURL: state.printModal.url,
    isOpen: state.printModal.isOpen,
    currencyChoosen: state.auth.currencyChoosen
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onModalOpen: url => dispatch(openModal(url)),
    onModalClose: () => dispatch(closeModal()),
    onNewOrders: () => dispatch(fetchNewOrders())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
