import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Keyboard,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { AsyncStorage } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';

import Icon from "react-native-vector-icons/FontAwesome5";
// import ValidationComponent from 'react-native-form-validator';
// import DropdownAlert from 'react-native-dropdownalert';

import io from "socket.io-client";
import { addressSocket, API } from "../connection/index";

var { height, width } = Dimensions.get("window");
const line = (
  <View
    style={{ width: width - 60, height: 1, backgroundColor: "gray" }}
  ></View>
);
var socketcConn;
export default class Login extends Component {
  constructor(props) {
    super(props);
    socketcConn = this;
    this.socket = io(addressSocket, { jsonp: false });
    this.state = {
      username: "",
      password: "",
      error: "",
      errorUsername: "",
      errorPassword: "",
      secureTextEntry: true,
      nameIcon: "eye-slash",
    };

    this.socket.on("order-agent", function (data) {
      console.log("order:");
      console.log(data);
      Alert.alert(
        "Công việc mới: ",
        "Bạn có muốn nhận đơn ở: " + data.address,
        [
          {
            text: "Cancel",
            onPress: () => socketcConn.socket.emit("agent-un-receive"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              socketcConn.socket.emit("agent-receive");
            },
          },
        ],
        { cancelable: false }
      );
    });
  }

  _login() {
    fetch(API + "auth/login-agent", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        // username: this.state.username,
        // password: this.state.password,
        username: "tranphu",
        password: "147147",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        AsyncStorage.clear();
        const agent = data.data;
        if (data.meta != null) {
          fetch(API + "access/agent:updateStatus/" + agent._id, {
            method: "PUT",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              status: 1,
            }),
          })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
              alert("error" + error);
            })
            .done();
          let dataAgent = data.data;
          dataAgent.status = 1;
          AsyncStorage.setItem("Agent", JSON.stringify(dataAgent));
          // console.log(agent);
          // console.log(dataAgent);
          this.socket.emit("agent-login", {
            _id: dataAgent._id,
            username: dataAgent.username,
          });
          this.socket.on("ok", function (data) {
            console.log("data");
          });
          // this.props.navigation.navigate("home");
        }
        // console.log(data.data.result);
        // if (data.result == 1) {

        //   const user = data;
        //   AsyncStorage.setItem('User', JSON.stringify(user));
        //   console.log(user);
        //   console.log(data.id);
        //   console.log(data.username);
        //   // console.log(data.id);
        //   // this.socket.
        //   const dataUser = {
        //     id: data.id,
        //     username: data.username,
        //   };
        // } else if (data.result == -2) {
        //   console.log('acb: ' + data.result);
        //   this.dropDownAlertRef.alertWithType(
        //     'error',
        //     'Authentication invalid ',
        //     'Wrong username',
        //   );
        // } else {
        //   this.dropDownAlertRef.alertWithType(
        //     'error',
        //     'Authentication invalid ',
        //     'Wrong password',
        //   );
        // }
      })
      .catch((error) => {
        alert("error" + error);
        this.setState({
          error: "Tài khoản hoặc mật khẩu không đúng",
        });
      })
      .done();
  }
  _hidePass() {
    var name = "";
    if (this.state.nameIcon == "eye-slash") {
      name = "eye";
    } else {
      name = "eye-slash";
    }
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
      nameIcon: name,
    });
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 30 }}>
            <View style={{ flex: 4 }}>
              <Text style={{ fontSize: 15, color: "gray" }}>
                Version 4.1.39
              </Text>
              <Text style={{ fontSize: 40, color: "gray" }}>Sign in</Text>
            </View>
            <View style={{ flex: 11 }}>
              <View>
                <TextInput
                  style={{ fontSize: 18 }}
                  TextContentType="emaiAddress"
                  keyboardType="email-address"
                  placeholder="Username/Mobile"
                  onChangeText={(text) => this.setState({ username: text })}
                ></TextInput>
                <View
                  style={{
                    width: width - 60,
                    height: 1,
                    backgroundColor: "gray",
                  }}
                ></View>
              </View>
              <View style={{ paddingTop: 50 }}>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={{ flex: 9, fontSize: 18 }}
                    placeholder="Password"
                    secureTextEntry={this.state.secureTextEntry}
                    onChangeText={(text) => this.setState({ password: text })}
                  ></TextInput>
                  <TouchableOpacity
                    onPress={() => this._hidePass()}
                    style={{ flex: 1, top: 10 }}
                  >
                    <Icon
                      name={this.state.nameIcon}
                      size={20}
                      color={"black"}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: width - 60,
                    height: 1,
                    backgroundColor: "gray",
                  }}
                ></View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 20,
                  }}
                >
                  <Text
                    onPress={() =>
                      this.props.navigation.navigate("forgotpassword")
                    }
                    style={{ fontSize: 12, color: "#2183E8" }}
                  >
                    Forgot Password
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this._login()}>
                  <View
                    style={{
                      width: width - 60,
                      height: 50,
                      borderRadius: 5,
                      backgroundColor: "#2183E8",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 30,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 20 }}>Sign in</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
// const styles = StyleSheet.create({});
