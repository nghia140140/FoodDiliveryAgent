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
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import { AsyncStorage } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from "../styles/StyleProfile";
import Icon from "react-native-vector-icons/FontAwesome5";
// import DropdownAlert from 'react-native-dropdownalert';
import { API } from "../connection/index";

var { height, width } = Dimensions.get("window");

// const iconSearch = <Icon name="times" size={20} color={'#fff'} />;
const iconLock = <Icon name="lock" size={13} color={"gray"} />;
const iconArrowLeft = <Icon name="arrow-left" size={20} color={"#fff"} />;
const iconPen = <Icon name="pen" size={13} color={"blue"} />;
const iconUser = <Icon name="user" size={15} color={"gray"} />;

const iconPhone = <Icon name="phone" size={13} color={"gray"} />;
const iconEye_slash = <Icon name="eye-slash" size={13} color={"gray"} />;
const iconEye = <Icon name="eye" size={13} color={"gray"} />;
const iconAddress = <Icon name="map-marker" size={13} color={"gray"} />;
const line = (
  <View
    style={{ width: width - 40, height: 1, backgroundColor: "gray" }}
  ></View>
);

const line2 = (
  <View
    style={{ width: width - 130, height: 1, backgroundColor: "gray" }}
  ></View>
);
const lineHightlight = (
  <View
    style={{ width: width - 130, height: 2, backgroundColor: "blue" }}
  ></View>
);
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      username: "",
      name: "",
      phone: "",
      address: "",
      email: "",
      password: "",
      status: 0,
      passwordCurrent: "",
      passwordNew: "",
      passwordReTypeNew: "",
      edit: false,
      changePass: false,
      secureTextEntry: [true, true, true],
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("Agent")
      .then((agent) => {
        if (agent !== null) {
          const agentdata = JSON.parse(agent);
          // const name = userdata.first_name + ' ' + userdata.last_name;
          this.setState({
            _id: agentdata._id,
            name: agentdata.name,
            username: agentdata.username,
            phone: agentdata.phone,
            email: agentdata.email,
            address: agentdata.address,
            status: agentdata.status,
            // password: agentdata.password,
          });
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  _hidenPassword(possition) {
    let temp = [...this.state.secureTextEntry];
    temp[possition] = !temp[possition];
    this.setState({ secureTextEntry: temp });
  }
  _changePassword() {
    this.setState({
      changePass: false,
    });
  }
  editProfile() {
    fetch(API + "access/agent:update/" + this.state._id, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        username: this.state.username,
        name: this.state.name,
        email: this.state.email,
        address: this.state.address,
        phone: this.state.phone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data == true) {
          this.setState({ edit: false });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }
  changePass() {
    if (this.state.passwordNew === this.state.passwordReTypeNew) {
      fetch(API + "agent_changePassword", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          username: this.state.username,
          oldPass: this.state.passwordCurrent,
          newPass: this.state.passwordNew,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({
            changePass: false,
          });
        })
        .catch((error) => {})
        .done();
    } else {
      this.dropDownAlertRef.alertWithType(
        "error",
        "Authentication invalid ",
        "Wrong email"
      );
      return;
      // alert('mat khau khong khop');
    }
  }
  logout() {
    console.log(Date());
    console.log(this.state._id);
    fetch(API + "access/agent:updateStatus/" + this.state._id, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        status: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        alert("error" + error);
      })
      .done();
    this.props.navigation.popToTop();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            {iconArrowLeft}
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>PROFILE</Text>
          <TouchableOpacity onPress={() => this.logout()}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.body}>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            {/* <Image
              style={{height: 160, width: 160, borderRadius: 80}}
              resizeMode="contain"
              source={require('./image/icon2.png')}
            /> */}
            <View style={styles.headerForm}>
              <Text style={{ fontSize: 14, color: "gray" }}>
                ACCOUNT DETAILS
              </Text>
              {this.state.edit == false ? (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      edit: true,
                    })
                  }
                  style={{ flexDirection: "row" }}
                >
                  <Text
                    style={{ color: "blue", fontSize: 13, marginRight: 10 }}
                  >
                    Edit
                  </Text>
                  {iconPen}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      edit: false,
                    })
                  }
                  style={{ flexDirection: "row" }}
                >
                  <Text style={{ color: "#000", fontSize: 13 }}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infor}>
              <View style={styles.iconFirst}>{iconUser}</View>
              <View style={styles.formInput}>
                <View
                  style={{
                    heigth: 25,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={styles.label}>Name</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  onChangeText={(text) => this.setState({ name: text })}
                  value={this.state.name}
                  editable={this.state.edit}
                ></TextInput>
              </View>
              <View style={styles.iconLast}>{iconLock}</View>
            </View>
            <View style={styles.line2}>
              {this.state.edit == false ? line2 : lineHightlight}
            </View>
            <View style={styles.infor}>
              <View style={styles.iconFirst}>{iconPhone}</View>
              <View style={styles.formInput}>
                <View
                  style={{
                    heigth: 25,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={styles.label}>Phone</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone"
                  onChangeText={(text) => this.setState({ phone: text })}
                  value={this.state.phone}
                  editable={this.state.edit}
                ></TextInput>
              </View>
              <View style={styles.iconLast}>{iconLock}</View>
            </View>
            <View style={styles.line2}>
              {this.state.edit == false ? line2 : lineHightlight}
            </View>

            <View style={styles.infor}>
              <View style={styles.iconFirst}>{iconAddress}</View>
              <View style={styles.formInput}>
                <View
                  style={{
                    heigth: 25,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={styles.label}>address</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your address"
                  onChangeText={(text) => this.setState({ address: text })}
                  value={this.state.address}
                  editable={this.state.edit}
                ></TextInput>
              </View>
              <View style={styles.iconLast}>{iconLock}</View>
            </View>
            <View style={styles.line2}>
              {this.state.edit == false ? line2 : lineHightlight}
            </View>

            <View style={styles.infor}>
              <View style={styles.iconFirst}>{iconLock}</View>
              <View style={styles.formInput}>
                <View
                  style={{
                    heigth: 25,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={styles.label}>Email</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                  editable={this.state.edit}
                ></TextInput>
              </View>
              <View style={styles.iconLast}>{iconLock}</View>
            </View>
            <View style={styles.line2}>
              {this.state.edit == false ? line2 : lineHightlight}
            </View>
            {/* {this.state.edit == false ? (
              this.state.changePass == false ? (
                <TouchableOpacity>
                  <Text style={{ color: "blue" }}>Change Password</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: width, alignItems: "center" }}>
                  <View style={styles.infor}>
                    <View style={styles.iconFirst}>{iconLock}</View>
                    <View style={styles.formInput}>
                      <View
                        style={{
                          heigth: 25,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text style={styles.label}>Current</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter current password"
                        secureTextEntry={this.state.secureTextEntry[0]}
                        onChangeText={(text) =>
                          this.setState({ passwordCurrent: text })
                        }
                        value={this.state.passwordCurrent}
                      ></TextInput>
                    </View>
                    <TouchableOpacity
                      onPress={() => this._hidenPassword(0)}
                      style={styles.iconLast}
                    >
                      {this.state.secureTextEntry[0] == true
                        ? iconEye_slash
                        : iconEye}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.line2}>
                    {this.state.edit == false ? line2 : lineHightlight}
                  </View>
                  <View style={styles.infor}>
                    <View style={styles.iconFirst}>{iconLock}</View>
                    <View style={styles.formInput}>
                      <View
                        style={{
                          heigth: 25,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text style={styles.label}>New</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your new password"
                        secureTextEntry={this.state.secureTextEntry[1]}
                        onChangeText={(text) =>
                          this.setState({ passwordNew: text })
                        }
                        value={this.state.passwordNew}
                      ></TextInput>
                    </View>
                    <TouchableOpacity
                      onPress={() => this._hidenPassword(1)}
                      style={styles.iconLast}
                    >
                      {this.state.secureTextEntry[1] == true
                        ? iconEye_slash
                        : iconEye}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.line2}>
                    {this.state.edit == false ? line2 : lineHightlight}
                  </View>
                  <View style={styles.infor}>
                    <View style={styles.iconFirst}>{iconLock}</View>
                    <View style={styles.formInput}>
                      <View
                        style={{
                          heigth: 25,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text style={styles.label}>Re-type new</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        secureTextEntry={this.state.secureTextEntry[2]}
                        onChangeText={(text) =>
                          this.setState({ passwordReTypeNew: text })
                        }
                        value={this.state.passwordReTypeNew}
                      ></TextInput>
                    </View>
                    <TouchableOpacity
                      onPress={() => this._hidenPassword(2)}
                      style={styles.iconLast}
                    >
                      {this.state.secureTextEntry[2] == true
                        ? iconEye_slash
                        : iconEye}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.line2}>
                    {this.state.edit == false ? line2 : lineHightlight}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: width - 80,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.changePass()}
                      style={{
                        width: width / 3,
                        justifyContent: "center",
                        padding: 5,
                        backgroundColor: "#468499",
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 15 }}>
                        Change
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ changePass: false })}
                      style={{
                        width: width / 3,
                        justifyContent: "center",
                        padding: 5,
                        backgroundColor: "#468499",
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 15 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: width }}>
                    <DropdownAlert
                      ref={(ref) => (this.dropDownAlertRef = ref)}
                    />
                  </View>
                </View>
              )
            ) : (
              <View style={{ paddingTop: 30 }}>
                <TouchableOpacity
                  onPress={() => this.editProfile()}
                  style={{
                    width: (width * 2) / 3,
                    backgroundColor: "#468499",
                    justifyContent: "center",
                    borderRadius: 5,
                    padding: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Save</Text>
                </TouchableOpacity>
              </View>
            )} */}

            <View style={{ height: 18 }}></View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
