import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {APP_KEY, BASE_URL} from "../../../config/settings";
import axios from "axios";
import NotificationBadge from '../common/NotificationBadge';
import {Spinner} from '../common/index';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

let {height, width} = Dimensions.get('window');

class NewCategory extends Component {


  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitle: 'New Category',
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
      headerBackTitle: null
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      category: '',
      description: '',
      categories: null,
      error: null,
      loaded: false,
      refresh: false
    };

  }


  componentWillMount() {
    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}/categories`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({categories: response.data.categories, loaded: true, refresh: true}))
      .catch(error => console.log(error))
  }

  refreshState = () => {
    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}/categories`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({categories: response.data.categories, loaded: true, refresh: true}))
      .catch(error => console.log(error))
  }

  resetState = () => {
    this.setState({category: null, description: null})
  }
  onButtonPress = () => {

    const {token, vendor} = this.props;
    const {category, description} = this.state;
    if (!category)
      this.setState({error: 'Fill the field Category!'});
    else {
      axios.post(`${BASE_URL}/vendors/${vendor}/categories`,
        {
          title: this.state.category,
          description: this.state.description,
          available: 1
        },
        {headers: {"App-Key": APP_KEY, 'Authorization': `Bearer ${token}`}})
        .then(response => {
          this.resetState();
          this.refreshState();
          this.setState({refresh: false});
          Alert.alert("Category Created with success");
        })
        .catch(function (error) {
          Alert.alert("Problems in Updating");

        });
    }

  }

  deleteCategory = (id) => {

    const {token, vendor} = this.props;

    axios.delete(`${BASE_URL}/vendors/${vendor}/categories/${id}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        // this.refreshState();
        this.setState({categories: this.state.categories.filter(category => id !== category.id)})
        //this.setState({refresh:false})
        Alert.alert("Deleted Successfully!")
      })
      .catch(error => console.log(error))
  }

  renderItemCategory = (item) => {
    //SF Medium 26 pt = #666666
    return (
      <View style={{backgroundColor: 'white', width: '75%', flexDirection: 'row', marginBottom: 2, padding: 7}}>
        <Text style={{
          textAlign: 'left',
          paddingLeft: 5,
          fontSize: 17,
          fontFamily: 'SF_medium',
          color: item.available === 0 ? '#e2353e' : '#666666',
          width: '80%'
        }}>{item.title}</Text>
        <TouchableOpacity style={{alignContent: 'flex-end', justifyContent: 'center', paddingRight: 5}}
                          onPress={() => {
                            Alert.alert(
                              'Delete Category',
                              'Do you want to delete this category?',
                              [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'OK', onPress: () => this.deleteCategory(item.id)},
                              ],
                              {cancelable: false}
                            )
                          }}
        >
          <Icon name="times" color='#e2353e'/>
        </TouchableOpacity>
      </View>
    );
  }

  renderError() {
    if (this.state.error)
      return (
        <View style={{marginTop: 10}}>
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        </View>
      );

  }


  render() {
    if (this.state.loaded)
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{height: height}}>
              <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 15, justifyContent: 'center'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.newCategLabel}>
                    New Category:
                  </Text>
                </View>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder={"Category"}
                  style={styles.inputStyle}
                  value={this.state.category}
                  onChangeText={(category) => {
                    this.setState({category, error: ''})
                  }}
                  autoCorrect={false}
                  placeholderTextColor={'#808080'}
                />
              </View>

              <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 15}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.newCategLabel}>
                    Description:
                  </Text>
                </View>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder={"Description"}
                  style={[styles.inputStyle, {flex: 2}]}
                  value={this.state.description}
                  onChangeText={(description) => {
                    this.setState({description, error: null})
                  }}
                  autoCorrect={false}
                  placeholderTextColor={'#808080'}
                />

              </View>
              <View style={{marginTop: 10}}>
                <TouchableOpacity
                  onPress={() => this.onButtonPress()}
                  style={styles.createButtonStyle}>
                  <Text style={styles.createTextStyle}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
              {this.renderError()}
              <View style={{
                width: '100%',
                marginTop: 20,
                alignContent: 'center',
                alignItems: 'center'
              }}>
                {
                  this.state.refresh ? (
                    this.state.categories.map((category) => {
                      return (
                        <View key={category.id}>
                          {this.renderItemCategory(category)}
                        </View>
                      )
                    })
                  ) : <Spinner/>
                }

              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      );
    else return <Spinner/>;
  }
}

const styles = {
  newCategLabel: {
    //SF Medium 26pt = #1A1A1A
    fontFamily: 'SF_medium',
    color: '#1A1A1A',
    fontSize: 16,
  },
  inputStyle: {
    color: '#1A1A1A',
    paddingRight: 5,
    paddingLeft: 10,
    marginLeft: 5,
    lineHeight: 23,
    height: 40,
    borderRadius: 5,
    fontSize: 16,
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 10,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
    fontFamily: 'SF_medium',
    flex: 2,
    marginRight: 15
  },
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },
  createButtonStyle: {
    width: '30%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#50b7ed',
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  errorTextStyle: {
    fontSize: 13,
    alignSelf: 'center',
    color: 'red',
    fontFamily: 'SF_regular'
  }

};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(NewCategory);
