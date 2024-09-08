import React, {Component} from 'react';
import {Alert, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Input_Label, Section} from "../common/index";
import {Dropdown} from 'react-native-material-dropdown-v2';
import {Spinner} from './../common/index';
import {connect} from 'react-redux';
import NotificationBadge from '../common/NotificationBadge';
import axios from 'axios';
import {APP_KEY, BASE_URL} from './../../../config/settings';

var {height, width} = Dimensions.get('window');

class CreateProduct extends Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      title: "Create Product",
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

  state = {
    title: null,
    description: null,
    available: 0,
    price: null,
  };


  updateAvailability = (value) => {
    this.setState(value === "Yes" ? {available: 1} : {available: 0})
  };

  onButtonCreatePress = () => {

    const {title, description, available, price} = this.state;
    console.log(available);
    const {token, vendor} = this.props;
    if (!title || !description || (available == 0) || !price)
      this.setState({error: 'Fill all the fields'});
    else {
      axios.post(`${BASE_URL}/vendors/${vendor}/products`,
        {
          title: this.state.title,
          description: this.state.description,
          available: this.state.available,
          price: this.state.price,
        },
        {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => {
          this.resetState();
          Alert.alert("Product Created Succesfully");
        })
        .catch(error => console.log(error))
    }
  };

  renderError() {
    return (
      <View style={{backgroundColor: 'transparent'}}>
        {
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        }
      </View>
    );
  }

  resetState = () => {
    this.setState({title: null, description: '', available: 0, price: null,})
  };

  renderCreateForm = () => {

    const {params} = this.props.navigation.state;

    if (params.fontLoaded)
      return (
        <View style={{height: 0.84 * height, justifyContent: 'center', alignContent: 'center'}}>
          <View style={styles.containerView}>
            <Section style={{borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingTop: 5, paddingRight: 5}}>
              <Input_Label
                fontLoaded={params.fontLoaded}
                styleInput={styles.styleInput}
                placeholder="Enter title"
                value={this.state.title}
                onChangeText={title => this.setState({title, error: ''})}
                label="Title"
              />
            </Section>
            <Section style={{borderTopLeftRadius: 8, borderTopRightRadius: 8, marginTop: -10, paddingRight: 5}}>
              <Input_Label
                //keyboardType = 'numeric'
                fontLoaded={params.fontLoaded}
                styleInput={styles.styleInput}
                placeholder="Enter price"
                value={this.state.price}
                onChangeText={price => this.setState({price, error: ''})}
                label="Price"
              />
            </Section>
            <Section style={{borderTopLeftRadius: 8, borderTopRightRadius: 8, marginTop: -10, paddingRight: 5}}>
              <View style={styles.containerStyle}>
                <Text style={styles.labelStyle}>Description</Text>
                <TextInput
                  placeholder="Enter description"
                  style={styles.inputStyle}
                  autoCorrect={false}
                  multiline={true}
                  numberOfLines={2}
                  onChangeText={description => this.setState({description, error: ''})}
                  placeholderTextColor={'#808080'}
                />
              </View>
            </Section>
            <Section style={{borderTopLeftRadius: 8, borderTopRightRadius: 8, marginTop: -10, paddingRight: 5}}>
              <View style={styles.containerStyle}>
                <View style={styles.containerDropdown}>
                  <Dropdown
                    label={'Publish'}
                    value={'Select status'}
                    data={[{value: 'Yes',}, {value: 'No',}]}
                    itemTextStyle={{fontFamily: 'SF_regular', color: '#292D2E'}}
                    itemCount={2}
                    fontSize={14}
                    onChangeText={(value) => this.updateAvailability(value)}
                  />
                </View>
              </View>
            </Section>

            <Section style={{marginTop: -15, paddingBottom: 15, borderBottomRightRadius: 8, borderBottomLeftRadius: 8}}>
              <TouchableOpacity onPress={() => this.onButtonCreatePress()}
                                style={styles.createButtonStyle}>
                <Text style={styles.createTextStyle}>
                  CREATE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.resetState()} style={styles.resetButtonStyle}>
                <Text style={styles.resetTextStyle}>
                  RESET
                </Text>
              </TouchableOpacity>
            </Section>
          </View>
          {this.renderError()}
        </View>
      );
    else
      return <Spinner/>
  };

  render() {

    let data = [{value: 'Enter',}, {value: 'Mango',}, {value: 'Pear',}, {value: 'Pear2',}, {value: 'Pear3',}, {value: 'Pear4',}, {value: 'Pear6',}];

    const {params} = this.props.navigation.state;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>

        <View>
          {//<Header headerText="Create Product" fontLoaded={params.fontLoaded}/>
          }
          <View>
            {this.renderCreateForm()}
          </View>
        </View>
      </ScrollView>
    );
  }

}

const styles = {
  inputStyle: {
    color: '#808080',
    paddingRight: 5,
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
    marginLeft: 5,
    lineHeight: 23,
    height: 0.1 * height,
    borderRadius: 5,
    backgroundColor: '#F2F2F2',
    fontFamily: 'SF_light',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    elevation: 2,


  },

  containerStyle: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 10,

  },

  labelStyle: {
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'SF_medium',
    color: '#000000'

  },

  containerDropdown: {
    backgroundColor: '#F2F2F2',
    paddingTop: 0,
    marginLeft: 5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },

  createButtonStyle: {
    flex: 0.45,
    alignSelf: 'stretch',
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 15,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },

  resetStyle: {
    width: width,
    flexDirection: 'row',
    alignSelf: 'center',

  },

  resetTextStyle: {
    alignSelf: 'center',
    color: '#50b7ed',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },

  resetButtonStyle: {
    flex: 0.45,
    alignSelf: 'stretch',
    borderRadius: 30,
    borderColor: '#50b7ed',
    borderWidth: 3,
    backgroundColor: '#ffffff',
    marginTop: 15,
    height: 40,
    justifyContent: 'center',
  },

  containerView: {
    shadowColor: '#c1c1c1',
    shadowOpacity: 10,
    shadowRadius: 5,
    borderColor: '#c1c1c1',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    elevation: 5,

    // marginTop:50,
    // paddingBottom: 30
  },

  styleInput: {
    fontSize: 14,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    fontFamily: 'SF_light',
  },

  errorTextStyle: {
    fontSize: 13,
    alignSelf: 'center',
    color: '#e2353e',
    fontFamily: 'SF_medium',
  }
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  }
};


export default connect(mapStateToProps)(CreateProduct);
