import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Image, Platform } from "react-native";
import CreateProduct from "./components/Products/CreateProduct";
import Products from "./components/Products/Products";
import EditProduct from "./components/Products/EditProduct";
import OrderList from "./components/Orders/OrderList";
import ChangePassword from "./components/Profile/ChangePassword";
import FilterCalendar from "./components/Orders/FilterCalendar";
import Profile from "./components/Profile/Profile";
import OpeningHours from "./components/Profile/OpeningHours";
import DeliveryRange from "./components/Profile/DeliveryRange";
import ProductMenu from "./components/Menu/ProductMenu";
import Reviews from "./components/Profile/Reviews";
import OrderDetails from "./components/Orders/OrderDetails";
import Gallery from "./components/Profile/Gallery";
import Order from "./components/Profile/Order";
import PersonalInfo from "./components/Profile/PersonalInfo";
import Category_List from "./components/Menu/Category_List";
import Dashboard from "./components/Dashboard/Dashboard";
import AddProductLIst from "./components/Menu/AddProductList";
import NewCategory from "./components/Menu/NewCategory";
import Notifications from "./components/Notifications";

const ProductsStack = createStackNavigator(
  {
    Products: { screen: Products },
    EditProduct: { screen: EditProduct },
    CreateProduct: { screen: CreateProduct },
    Notifications: { screen: Notifications },
    OrderDetails: { screen: OrderDetails },
  },
  {
    headerMode: "screen",
    initialRouteName: "Products",
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    ChangePassword: { screen: ChangePassword },
    OpeningHours: { screen: OpeningHours },
    Reviews: { screen: Reviews },
    Gallery: { screen: Gallery },
    Order: { screen: Order },
    DeliveryRange: { screen: DeliveryRange },
    PersonalInfo: { screen: PersonalInfo },
    Notifications: { screen: Notifications },
  },
  {
    headerMode: "screen",
    initialRouteName: "Profile",
  }
);

const OrderStack = createStackNavigator(
  {
    OrderList: { screen: OrderList },
    OrderDetails: { screen: OrderDetails },
    FilterCalendar: { screen: FilterCalendar },
    Notifications: { screen: Notifications },
  },
  {
    headerMode: "screen",
    initialRouteName: "OrderList",
  }
);

const MenuStack = createStackNavigator(
  {
    Category_List: { screen: Category_List },
    ProductMenu: { screen: ProductMenu },
    NewCategory: { screen: NewCategory },
    AddProductToMenu: { screen: AddProductLIst },
    Notifications: { screen: Notifications },
    OrderDetails: { screen: OrderDetails },
  },
  {
    headerMode: "screen",
    initialRouteName: "Category_List",
  }
);

const DashboardStack = createStackNavigator(
  {
    Dashboard: { screen: Dashboard },
    Notifications: { screen: Notifications },
    OrderDetails: { screen: OrderDetails },
  },
  {
    headerMode: "screen",
    initialRouteName: "Dashboard",
  }
);

var _style =
  Platform.OS === "ios"
    ? {
        backgroundColor: "white",
      }
    : {
        backgroundColor: "white",
        paddingBottom: 3,
        paddingTop: 3,
      };

export default createAppContainer(
  createBottomTabNavigator(
    {
      Dashboard: {
        screen: DashboardStack,
        navigationOptions: { tabBarLabel: "Dashboard" },
      },
      Products: {
        screen: ProductsStack,
        navigationOptions: { tabBarLabel: "Products" },
      },
      Orders: {
        screen: OrderStack,
        navigationOptions: { tabBarLabel: "Orders" },
      },
      Menu: { screen: MenuStack, navigationOptions: { tabBarLabel: "Menu" } },
      Profile: {
        screen: ProfileStack,
        navigationOptions: { tabBarLabel: "Profile" },
      },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ width, height, focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === "Products") {
            if (!focused) {
              iconName = require("./img/Footer/products.png");
              width = 22;
              height = 23;
            } else {
              iconName = require("./img/Footer/products1.png"); // 42-41
              width = 22;
              height = 23;
            }
          } else if (routeName === "Profile") {
            if (!focused) {
              iconName = require("./img/Footer/profile.png");
              width = 21;
              height = 20.5;
            } else {
              iconName = require("./img/Footer/profile1.png"); // 42-41
              width = 21;
              height = 20.5;
            }
          } else if (routeName === "Orders") {
            if (!focused) {
              iconName = require("./img/Footer/orders.png"); //41-30
              width = 20.5;
              height = 15;
            } else {
              iconName = require("./img/Footer/orders1.png"); //41-28
              width = 20.5;
              height = 14;
            }
          } else if (routeName === "Menu") {
            if (!focused) {
              iconName = require("./img/Footer/menu.png"); //44-41
              width = 22;
              height = 20.5;
            } else {
              iconName = require("./img/Footer/menu1.png"); //44-41
              width = 22;
              height = 20.5;
            }
          } else if (routeName === "Dashboard") {
            if (!focused) {
              iconName = require("./img/Footer/dashboard.png"); //44-41
              width = 22;
              height = 20.5;
            } else {
              iconName = require("./img/Footer/dashboard1.png"); //44-41
              width = 22;
              height = 20.5;
            }
          }
          // You can return any component that you like here!
          return (
            <Image source={iconName} style={{ width: width, height: height }} />
          );
        },
      }),
      tabBarOptions: {
        style: _style,
        activeTintColor: "#50b7ed",
        inactiveTintColor: "grey",
      },
    }
  )
);
