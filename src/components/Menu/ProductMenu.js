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
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemMenu from "../common/ItemMenu";
import NotificationBadge from '../common/NotificationBadge';
import {Spinner} from '../common/index';
import {connect} from 'react-redux';
import {fetchProductsMenu, searchProductsMenu, setLoadedToFalse} from './../../actions/menu';

let {height} = Dimensions.get('window');


let itemHeight = 0;

class ProductMenu extends Component {


  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitle: params.title, //based on clicked item
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

  _keyExtractor = (item) => item.id;

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;

    this.state = {
      search: null,
      loaded: false,
      refreshing: false,
      id: params.id
    };

  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.refreshing && nextProps.loaded)
      this.setState({refreshing: false});

    if (nextProps.loaded === true) {
      this.setState({loaded: true})
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.onSetLoadedToFalse();
    this.props.onFetchProductsMenu(this.state.id);
    this.setState({refreshing: false});
  }

  componentWillMount() {
    this.props.onFetchProductsMenu(this.state.id);
  }

  renderProductMenu = () => {

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
              <ItemMenu
                navigation={this.props.navigation}
                id={item.id}
                menu={this.state.id}
                price={item.price}
                title={item.title}
                description={item.description.substr(0, 30)}
                available={item.available}
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
    this.props.onSetLoadedToFalse();
    this.props.onSearchProductsMenu(this.state.search, this.state.id);
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
            placeholderTextColor={'#4D4D4D'}
          />
          <TouchableOpacity onPress={() => this.onFilterPress()} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>
              <Icon size={17} name="search" marginTop={5} color="#fff"/>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addProduct} onPress={() => {
            this.props.navigation.navigate('AddProductToMenu', {
              fontLoaded: this.state.fontLoaded,
              category: this.state.id,
              title: this.props.navigation.state.params.title
            });
          }}>
            <View style={{alignItems: 'center'}}>
              <Icon size={17} name="plus" color="#50b7ed"/>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{height: '70%'}}>
          {this.renderProductMenu()}
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

  headerIcon: {
    height: 18,
    width: 16.5
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
    vendor: state.auth.vendor_id,
    products: state.menu.products,
    loaded: state.menu.loaded,
    refreshing: state.menu.refreshing
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onFetchProductsMenu: (id) => {
      dispatch(fetchProductsMenu(id))
    },
    onSetLoadedToFalse: () => {
      dispatch(setLoadedToFalse())
    },
    onSearchProductsMenu: (searchTerms, id) => {
      dispatch(searchProductsMenu(searchTerms, id))
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(ProductMenu);
