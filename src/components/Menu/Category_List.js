import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ItemCategoryList from '../common/ItemCategoryList';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import NotificationBadge from '../common/NotificationBadge';
import {Spinner} from '../common/index';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';

let {height} = Dimensions.get('window');

class Category_List extends Component {

  static navigationOptions = ({navigation}) => {
    //title:<Text style={{fontWeight:"400",fontSize:17}}>Products</Text>,

    const {params = {}} = navigation.state;

    return {
      headerTitle: `Category-List Menu`,
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
      categories: null,
      search: null,
      height: 0,
      loaded: false,
      refreshing: false
    };

  }


  _keyExtractor = (item, index) => item.id;

  _onRefresh() {
    this.setState({refreshing: true});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/menu`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({categories: response.data.categories, loaded: true, refreshing: false}))
      .catch(error => console.log(error))
  }

  componentWillMount() {
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/menu`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({categories: response.data.categories, loaded: true}))
      .catch(error => console.log(error))
  }

  renderCategoryList = () => {

    if (this.state.loaded)
      if (this.state.categories.length !== 0) {
        return (<FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          data={this.state.categories}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
          renderItem={({item}) =>
            (
              <ItemCategoryList
                navigation={this.props.navigation}
                id={item.id}
                total_per_category={item.total_per_category}
                title={item.title}
                order={item.order}
                products_available={item.products_available}
                products_unavailable={item.products_unavailable}
              />)
          }
        />);
      } else {
        return (
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      }>
            <View style={styles.container}>
              <Image
                style={styles.noNotificationsImage}
                source={require('../../img/Products/noproducts.png')}
              />
              <Text
                style={{fontFamily: 'SF_semibold', fontSize: 14, color: '#808080', textAlign: 'center', marginTop: 10}}>
                0 Categories
              </Text>
            </View>
          </ScrollView>
        );
      }
    else
      return <Spinner/>
  };

  onFilterPress = () => {
    this.setState({loaded: false});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/menu?title=${this.state.search}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({categories: response.data.categories, loaded: true}))
      .catch(error => console.log(error.response))
  };

  render()  {
    return (

      // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.containerStyle}>
        <View style={styles.containerInput}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Search for categories"
            style={styles.inputStyle}
            value={this.state.search}
            onChangeText={search => this.setState({search})}
            // autoCorrect={false}
            placeholderTextColor={'#4D4D4D'}
          />

          <TouchableOpacity onPress={() => this.onFilterPress()} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>
              <Icon size={17} name="search" marginTop={5} color="#fff"/>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCategory} onPress={() => {
            this.props.navigation.navigate('NewCategory')
          }}>
            {
              <View style={{alignItems: 'center'}}>
                <Icon size={17} name="plus" color="#50b7ed"/>
              </View>
            }
          </TouchableOpacity>
        </View>

        <View style={{height: '70%'}}>
          {this.renderCategoryList()}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  noNotificationsImage: {
    marginTop: -10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerStyle: {
    height: height,
    backgroundColor: '#F2F2F2'
  },

  inputStyle: {
    color: '#292D2E',
    flex: 10,
    marginRight: 32,
    padding: 8,
    fontSize: 15,
    fontFamily: 'SF_regular',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    borderRadius: 30

  },
  containerInput: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCategory: {
    flex: 1,
    padding: 5,
    height: 35,
    paddingTop: 9,
    borderRadius: 35,
    marginRight: 0,
    backgroundColor: '#FFF',
  },
  headerIcon: {
    height: 18,
    width: 16.5
  },
  buttonText: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'SF_regular'
  },

  buttonStyle: {
    flex: 1,
    padding: 5,
    height: 35,
    paddingTop: 8,
    borderRadius: 35,
    marginLeft: -20,
    marginRight: 10,
    backgroundColor: '#50b7ed',
  },
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(Category_List);
