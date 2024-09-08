import React, {Component} from 'react';
import {Spinner} from "../common/index";
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
import ItemAddProduct from "../common/ItemAddProduct";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from "expo-font";
import axios from 'axios';
import NotificationBadge from '../common/NotificationBadge';
import {connect} from 'react-redux';
import {APP_KEY, BASE_URL} from './../../../config/settings';

let {height} = Dimensions.get('window');
let itemHeight = 0;

class AddProductList extends Component {

  static navigationOptions = ({navigation}) => {
    //title:<Text style={{fontWeight:"400",fontSize:17}}>Products</Text>,

    const {params = {}} = navigation.state;

    return {
      headerTitle: `Add Product to ${params.title}`,
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

  _keyExtractor = (item, index) => item.id;

  constructor(props) {
    super(props);

    this.state = {
      products: null,
      search: null,
      height: 0,
      fontLoaded: false,
      loaded: false,
      refreshing: false,
      nextPageUrl: null
    };

  }

  _onRefresh() {
    this.setState({refreshing: true});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/products/index`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data.products))
      .catch(error => console.log(error))
  }

  componentWillMount() {
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/products/index`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data.products))
      .catch(error => console.log(error))
  }

  updateState = data => {
    this.setState({
      products: data.data,
      loaded: true,
      nextPageUrl: data.next_page_url,
      refreshing: false
    })
  }


  concatProductsPagination = newProducts => {
    let oldProducts = this.state.products;
    let array = oldProducts.concat(newProducts);
    return array;
  };

  onLoadNextPage = () => {
    const {token, vendor} = this.props;
    axios.get(this.state.nextPageUrl,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({
        products: this.concatProductsPagination(response.data.products.data),
        nextPageUrl: response.data.products.next_page_url
      }))
      .catch(error => console.log(error))
  };

  renderLoadMoreButton = () => {
    if (this.state.nextPageUrl !== null)
      return (
        <TouchableOpacity onPress={() => this.onLoadNextPage()}
                          style={styles.createButtonStyle}>
          <Text style={styles.createTextStyle}>
            Load More
          </Text>
        </TouchableOpacity>
      )
  };

  async componentDidMount() {
    await Font.loadAsync({
      'SF_regular': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoText-Regular.otf'),
      'SF_semibold': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Semibold.otf'),
      'SF_bold': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Bold.otf'),
      'SF_light': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Light.otf'),
      'SF_medium': require('../../../assets/fonts/SanFranciscoFont-master/SanFranciscoDisplay-Medium.otf')
    });

    this.setState({fontLoaded: true});
  }


  heightItem = (height) => {
    this.setState({height: height});
    itemHeight = height;

  };


  returnProductList = () => {
    if (this.state.loaded)
      if (this.state.products.length != 0) {
        return (<FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          data={this.state.products}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
          renderItem={({item}) =>
            (
              <ItemAddProduct
                navigation={this.props.navigation}
                id={item.id}
                onHeightItem={this.heightItem.bind(this)}
                title={item.title}
                description={item.description.substr(0, 35)}
                published={item.available == '1' ? 'Published' : 'Unpublished'}
                price={item.price}
                popular={item.is_popular}
                color={item.available == '1' ? '#22B573' : '#A7222F'}
              />)
          }
          ListFooterComponent={

            <View style={{width: '100%'}}>
              {this.renderLoadMoreButton()}
            </View>
          }
        />)
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
                0 Products
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
    axios.get(`${BASE_URL}/vendors/${vendor}/products/search?title=${this.state.search}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => {
        this.setState({products: response.data.products.data, loaded: true}
        )
      })
      .catch(error => console.log(error))
  };

  render() {


    return (
      <View style={styles.containerStyle}>
        <View style={styles.containerInput}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Search for products"
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

        </View>

        <View style={{height: '70%'}}>
          {this.returnProductList()}
        </View>
      </View>
    );
  }
}


const styles = {
  containerStyle: {
    height: height,
    backgroundColor: '#F2F2F2'
  },

  inputStyle: {
    color: '#292D2E',
    flex: 10,
    marginRight: 35,
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
  addProduct: {
    flex: 1,
    padding: 8,
    height: 31,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
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
    padding: 3,
    height: 35,
    paddingTop: 8,
    borderRadius: 35,
    marginLeft: -20,
    marginRight: 0,
    backgroundColor: '#50b7ed',
  },

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
  createTextStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'SF_semibold'
  },

  createButtonStyle: {
    width: '30%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#50b7ed',
    marginTop: 15,
    height: 30,
    justifyContent: 'center',
  },

};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    vendor: state.auth.vendor_id
  };
};

export default connect(mapStateToProps)(AddProductList);
