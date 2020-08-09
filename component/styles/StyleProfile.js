import React, {Component} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  header: {
    // flex: 2,
    padding: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    // flex: 13,
    backgroundColor: '#fff',
    height: height - 90,
    marginLeft: 10,
    marginRight: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerForm: {
    backgroundColor: '#eee',
    marginTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    height: 30,
    width: width - 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infor: {
    marginTop: 10,
    width: width - 20,
    height: 60,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconFirst: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 15,
  },
  formInput: {
    flex: 12,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  label: {color: 'gray', fontSize: 10},
  input: {color: '#000', fontSize: 18},
  iconLast: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 15,
  },
  line2: {marginBottom: 20},
});

export {styles};
