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
import {APP_KEY, BASE_URL} from './../../../config/settings';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import NotificationBadge from '../common/NotificationBadge';
import {Spinner} from './../common/index';
import ItemReview from "../common/ItemReview";
import moment from "moment/moment";
// import PaginatedListView from 'react-native-paginated-listview';
let {height} = Dimensions.get('window');

class Reviews extends Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitle: "Reviews",
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

  _keyExtractor = (item) => item.id;

  constructor(props) {
    super(props);

    this.state = {
      statistics: {
        ok: null,
        sad: null,
        happy: null
      },
      ratingRepo: null,
      filter: null,
      loaded: false,
      refreshing: false,
      nextPageUrl: null,
      loadMoreReviews: true
    };

  }

  _onRefresh() {
    this.setState({refreshing: true});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/reviews`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data))
      .catch(error => console.log(error))
  }

  componentWillMount() {
    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}/reviews`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data))
      .catch(error => console.log(error))
  }

  //Update state
  updateState = data => {
    const {statistics, ratingRepo} = data;
    this.setState({
      statistics: {
        ok: statistics.ok,
        sad: statistics.sad,
        happy: statistics.happy
      },
      ratingRepo: ratingRepo.data,
      loaded: true,
      refreshing: false,
      nextPageUrl: ratingRepo.next_page_url
    })
  };

  filterReviews(emotion) {
    const {token, vendor} = this.props;

    axios.get(`${BASE_URL}/vendors/${vendor}/reviews?filter=${emotion}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data))
      .catch(error => console.log(error))
  }

  concatReviewsPagination = newReviews => {
    let oldReviews = this.state.ratingRepo;
    let array = oldReviews.concat(newReviews);
    return array;
  }

  onLoadNextPage = () => {
    const {token, vendor} = this.props;
    axios.get(this.state.nextPageUrl,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.setState({
        ratingRepo: this.concatReviewsPagination(response.data.ratingRepo.data),
        nextPageUrl: response.data.ratingRepo.next_page_url,
        loadMoreReviews: true
      }))
      .catch(error => console.log(error))
  }

  renderLoadMoreButton = () => {
    if (this.state.nextPageUrl !== null && this.state.loadMoreReviews)
      return (
        <TouchableOpacity onPress={() => {
          this.setState({loadMoreReviews: false});
          this.onLoadNextPage()
        }}
                          style={styles.createButtonStyle}>
          <Text style={styles.createTextStyle}>
            Load More
          </Text>
        </TouchableOpacity>
      )
    else if (!this.state.loadMoreReviews)
      return <Spinner/>;
  }

  onFilterPress = () => {
    this.setState({loaded: false});
    const {token, vendor} = this.props;
    axios.get(`${BASE_URL}/vendors/${vendor}/reviews?filter=&text=${this.state.search}`,
      {headers: {'Authorization': `Bearer ${token}`}})
      .then(response => this.updateState(response.data))
      .catch(error => console.log(error))
  };


  staticHeader = () => {
    const {statistics, ratingRepo} = this.state;
    return (<View style={styles.containerInput}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder="Reviews"
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
      <View style={{
        marginLeft: 5,
        marginRight: -5,
        paddingLeft: 15,
        paddingRight: 0,
        flex: 2,
        justifyContent: 'space-between',
        flexDirection: 'row'
      }}>
        <TouchableOpacity onPress={() => this.filterReviews(3)}>
          <View>
            <Image style={{alignSelf: 'center', width: 25, height: 25}}
                   source={require('../../img/Profile/happy2.png')} //40-40
            />
            <Text style={styles.emotionStyle}>Happy {statistics.happy}%</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.filterReviews(2)}>
          <View>
            <Image style={{alignSelf: 'center', width: 25, height: 25}}
                   source={require('../../img/Profile/ok2.png')} //40-40
            />
            <Text style={styles.emotionStyle}>Ok {statistics.ok}%</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.filterReviews(1)}>
          <View>
            <Image style={{alignSelf: 'center', width: 25, height: 25}}
                   source={require('../../img/Profile/sad2.png')} //40-40
            />
            <Text style={styles.emotionStyle}>Sad {statistics.sad}%</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>);
  };
  block = () => {
    const {statistics, ratingRepo} = this.state;
    if (this.state.ratingRepo.length != 0) {
      return (<FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        data={this.state.ratingRepo}
        keyExtractor={this._keyExtractor}
        extraData={this.state}
        renderItem={({item}) =>
          (
            <ItemReview
              date={moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')}
              emoji={item.emotion}
              navigation={this.props.navigation}
              id={item.id}
              order_number={item.order_number}
              time={moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
              description={item.comment}
            />

          )
        }
        ListFooterComponent={

          <View style={{width: '100%'}}>
            {this.renderLoadMoreButton()}
          </View>
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
              source={require('../../img/Profile/no-review.png')}
            />
            <Text
              style={{fontFamily: 'SF_semibold', fontSize: 14, color: '#808080', textAlign: 'center', marginTop: 10}}>
              Restaurant has 0 reviews
            </Text>
          </View>
        </ScrollView>
      );
    }
  };

  render() {

    if (this.state.loaded) {
      return (<View style={styles.containerStyle}>
        {this.staticHeader()}
        <View style={{height: '70%'}}>
          {this.block()}
        </View>
      </View>);
    } else {
      return <Spinner/>
    }

  }
}


const styles = {
  containerStyle: {
    height: height,
    backgroundColor: '#F2F2F2'
  },

  inputStyle: {
    color: '#292D2E',
    flex: 2,
    padding: 8,
    paddingRight: 15,
    paddingLeft: 15,
    fontSize: 15,
    fontFamily: 'SF_regular',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    borderRadius: 30,
    marginRight: 8,

  },
  containerInput: {
    margin: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    height: 18,
    width: 16.5
  },
  emotionStyle: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: 'SF_regular',
    color: '#4D4D4D',
    justifyContent: 'center'
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
    flex: 0.4,
    padding: 5,
    height: 35,
    paddingTop: 8,
    borderRadius: 35,
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
    vendor: state.auth.vendor_id
  }
};

export default connect(mapStateToProps)(Reviews);
