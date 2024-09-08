import React, {PureComponent} from 'react';
import {ImageBackground, Text, View} from 'react-native';
import {connect} from 'react-redux';


class NotificationBadge extends PureComponent {

  constructor(props) {
    super(props);
  }

  renderNotificationCount = () => {
    if (this.props.notifications)
      return (
        <View style={styles.notificationBadgeContainer}>
          <View style={styles.notificationBadgeSection}>
            <Text style={styles.notificationBadge}>
              {this.props.notifications}
            </Text>
          </View>
        </View>
      );
  };


  render() {

    return (
      <ImageBackground style={{height: 18.5, width: 15.5, marginRight: 10}}
                       source={require('../../img/notificationwhite.png')} //31-37
      >
        {this.renderNotificationCount()}
      </ImageBackground>
    );
  }
}

const styles = {

  notificationBadgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: 5,
    marginRight: -5,
    marginTop: -5,
    paddingTop: 4
  },

  notificationBadgeSection: {
    backgroundColor: '#e2353e',
    height: 13,
    width: 13,
    borderRadius: 6,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  notificationBadge: {
    color: 'white', textAlign: 'center',
    fontSize: 9,
    fontFamily: 'SF_semibold',
    marginTop: -1
  }


};

const mapStateToProps = state => {
  return {
    notifications: state.notifications.total
  }
};

export default connect(mapStateToProps)(NotificationBadge);
