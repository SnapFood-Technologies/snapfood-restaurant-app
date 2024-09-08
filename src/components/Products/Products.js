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
    View,
} from 'react-native';
import ItemProduct from "../common/ItemProduct";
import { FontAwesome } from '@expo/vector-icons'; 
import * as Font from "expo-font";
import NotificationBadge from '../common/NotificationBadge';
import {connect} from 'react-redux';
import {
    fetchProducts,
    loadNextPage,
    searchProducts,
    setLoadedToFalse,
    setloadMoreProducts
} from './../../actions/products';

let {height} = Dimensions.get('window');
let itemHeight = 0;

class Products extends Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      headerTitle: "Products",
      headerTitleStyle: {
        fontWeight: '400',
        fontSize: 17,
        width: "100%",
        textAlign: 'center',
      },
      headerRight: <TouchableOpacity onPress={() => {
        navigation.navigate('Notifications');
      }}>
        <NotificationBadge/>
      </TouchableOpacity>,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#50b7ed'
      },
      headerTintColor: 'white',
    }

  };

  _keyExtractor = (item, index) => item.id;

  constructor(props) {
    super(props);
    //const { params } = this.props.navigation.state;

    this.state = {
      search: null,
      height: 0,
      fontLoaded: false,
      // loaded: false,
      refreshing: false
    };

  }


  renderLoadMoreButton = () => {
    if (this.props.nextPageUrl !== null && this.props.loadNextPage)
      return (
        <TouchableOpacity onPress={() => {
          this.props.onloadMoreProducts()
          this.props.onLoadNextPage()
        }}
                          style={styles.createButtonStyle}>
          <Text style={styles.createTextStyle}>
            Load More
          </Text>
        </TouchableOpacity>
      )
    else if (!this.props.loadNextPage) {
      return <Spinner/>;
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.onSetLoadedToFalse();
    this.props.onFetchProducts();
    this.setState({refreshing: false});
  }

  componentWillMount() {
    this.props.onFetchProducts();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.refreshing && nextProps.loaded)
      this.setState({refreshing: false});

    if (nextProps.loaded === true) {
      this.setState({loaded: true})
    }
  }

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

  onFilterPress = () => {

    this.props.onSetLoadedToFalse();
    this.props.onSearchProducts(this.state.search);
    // this.setState({loaded: false})
    // const { token, vendor } = this.props;

    // axios.get(`${BASE_URL}/vendors/${vendor}/products/search?title=${this.state.search}`,
    //     {headers: {'Authorization': `Bearer ${token}`}})
    //     .then(response => this.setState({products: response.data.products, loaded: true}))
    //     .catch(error => console.log(error))
  };

  returnProductList = () => {
    if (this.state.loaded)
      if (this.props.products.length != 0) {
        return (<FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          data={this.props.products}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
          renderItem={({item}) =>
            (
              <ItemProduct
                navigation={this.props.navigation}
                id={item.id}
                onHeightItem={this.heightItem.bind(this)}
                title={item.title}
                // description={item.description.substr(0, 35)}
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
      } else
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
    else
      return <Spinner/>
  }


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
              <FontAwesome size={17} name="search" marginTop={5} color="#fff"/>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addProduct} onPress={() => {
            this.props.navigation.navigate('CreateProduct', {
              fontLoaded: this.state.fontLoaded
            });
          }}>
            {
              <View style={{alignItems: 'center'}}>
                <FontAwesome size={17} name="plus" color="#50b7ed"/>
              </View>
            }
          </TouchableOpacity>
        </View>

        <View style={{height: '70%'}}>
          {
            this.returnProductList()
          }
        </View>
      </View>
    );
  }
}


const styles = {

  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 25
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
  addProduct: {
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
    vendor: state.auth.vendor_id,
    products: state.products.products,
    loaded: state.products.loaded,
    refreshing: state.products.refreshing,
    nextPageUrl: state.products.next_page_url,
    loadNextPage: state.products.loadNextPage

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchProducts: () => {
      dispatch(fetchProducts())
    },
    onSetLoadedToFalse: () => {
      dispatch(setLoadedToFalse())
    },
    onSearchProducts: (searchTerms) => {
      dispatch(searchProducts(searchTerms))
    },
    onLoadNextPage: () => dispatch(loadNextPage()),
    onloadMoreProducts: () => dispatch(setloadMoreProducts())

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
