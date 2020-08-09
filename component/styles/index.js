import React, {Component} from 'react';
import {
  Text,
  Dimensions,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
  },
  header: {
    marginTop: 10,
    color: 'red',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  num: {
    // marginLeft: 20,
    color: '#fff',
    fontSize: 40,
  },
  // num: {
  //   marginLeft: 50,
  //   color: '#fff',
  //   fontSize: 30,
  // },
  // text: {
  //   marginLeft: -50,
  //   color: '#fff',
  //   fontSize: 30,
  // },
  // just: {
  //   flex: 1,
  //   color: '#fff',
  //   marginLeft: 30,
  // },
  text: {
    marginLeft: 20,
    color: '#fff',
    fontSize: 40,
  },
  just: {
    marginLeft: 30,
    marginTop: 30,
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
  },
  up: {
    flex: 20,
  },
  task: {
    height: width / 3,
    backgroundColor: '#fff',
    width: width - 20,
    padding: 10,
    justifyContent: 'space-between',
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  pickup: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  acknowledge: {
    width: width / 2 + 40,
    backgroundColor: '#0FBD34',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 5,
    padding: 4,
  },
  // acknowledge: {
  //   width: width - 40,
  //   backgroundColor: '#00b300',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-around',
  //   borderRadius: 5,
  //   padding: 4,
  // },
  address: {
    width: width - 40,
    fontSize: 15,
    color: '#333333',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    margin: 4,
    // backgroundColor: 'red',
  },
  header2: {
    justifyContent: 'center',
    // flex: 1.5,
    height: height / 15,
    backgroundColor: '#000',
  },
  body: {
    marginTop: 10,
    padding: 0,
    marginLeft: 7,
    marginRight: 7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // borderRadius: 10,
    // height: 50,
    // height: (height / 7) * 6 - 20,
    // flex: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: width / 2,
    // backgroundColor: "#fff",
  },
  infor: {
    // flex: 1,
    // height: 80,
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // backgroundColor: 'blue',
  },
});

export {styles};
