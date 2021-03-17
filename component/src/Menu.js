import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Switch,
  Animated,
  Keyboard,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { AsyncStorage } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';

import io from "socket.io-client";
import {API} from '../connection/index';
import Icon from "react-native-vector-icons/FontAwesome5";

var { height, width } = Dimensions.get("window");

const iconTimes = <Icon name="times" size={20} color={"#fff"} />;
const iconUser = <Icon name="user" size={18} color={"#fff"} />;
const line = (
  <View
    style={{ width: width - 40, height: 1, backgroundColor: "gray" }}
  ></View>
);
export default class Menu extends Component {
  constructor(props) {
    super(props);
    // this.socket = io(addressSocket, {jsonp: false});
    this.state = {
      switch: false,
      _id: "",
      status: 0,
    };
  }
  componentDidMount() {
    // alert('welcome');
    AsyncStorage.getItem("Agent")
      .then((agent) => {
        if (agent !== null) {
          const agentdata = JSON.parse(agent);
          console.log(agentdata.status);
          console.log(agentdata);
          if (agentdata.status == 1) {
            this.setState({
              switch: true,
              _id: agentdata._id,
              status: agentdata.status,
            });
          }
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  changeDuty() {
    // if (this.state.switch == false) {
    //   this.socket.emit('agent-duty', 1);
    // } else {
    //   this.socket.emit('agent-login', -1);
    // }
    let statusx = 1;
    if (this.state.switch) statusx = 0;
    fetch(API + "access/agent:updateStatus/" + this.state._id, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        status: statusx,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          switch: !this.state.switch,
        });
      })
      .catch((error) => {
        alert("error" + error);
      })
      .done();
  }
  render() {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: "#000" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: height / 15,
            backgroundColor: "#000",
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            {iconTimes}
          </TouchableOpacity>
          <Text style={{ color: "red" }}></Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("profile")}
          >
            {iconUser}
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: 30 }}>
          <TouchableOpacity>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                On Duty
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={this.state.switch ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.changeDuty()}
                value={this.state.switch}
              />
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                Notifications
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                History
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                Schedule
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                Chat with us
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                Settings
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                Tutorial
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                Support
              </Text>
            </View>
            <View style={{}}>{line}</View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
