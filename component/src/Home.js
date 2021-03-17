import React, { Component } from "react";
import {
  Text,
  Dimensions,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { AsyncStorage } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
// import { IconMenu, iconBars } from "./icon/index";

const GOOGLE_MAPS_APIKEY = "AIzaSyCMkBU6QM6jEnGGBItURq2xXw-c_YUhuao";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
// import Geolocation from "@react-native-community/geolocation";
import MapViewDirections from "react-native-maps-directions";
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
// import {LocaleConfig} from 'react-native-calendars';

// var geolocation = require('geolocation');
// import Geolocation from 'react-native-geolocation-service';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

// import geolocation from 'geolocation';
// import Draggable from './Draggable';
const ASPECT_RATIO = width / height;
const LATITUDE = 10.7619376;
const LONGITUDE = 106.657737;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import { addressSocket, API } from "../connection/index";
import io from "socket.io-client";
import { ketnoi } from "./Login";
import { styles } from "../styles/index";
var { height, width } = Dimensions.get("window");
console.disableYellowBox = true;

// TODO Icon
const iconCalender = <Icon name="calendar" size={30} color={"#fff"} />;
const line = (
  <View
    style={{ width: width - 77, height: 1, backgroundColor: "#000" }}
  ></View>
);
const header = <View style={{ height: 18, backgroundColor: "ff0000" }}></View>;
var _this;
export default class Task extends Component {
  constructor(props) {
    super(props);
    this.socket = ketnoi;
    this.state = {
      modelDateTime: false,
      num: 1,
      newTask: 0,
      screen: 0,
      stepOrder: 0,
      dataFood: [],
      geocode: "",
      latitudeCurent: 0,
      longitudeCurent: 0,
      latitudeTo: 0,
      longitudeTo: 0,
      addressTo: "",
      // "99 Lê Văn Việt, Tăng Nhơn Phú A, Quận 9, Thành phố Hồ Chí Minh, Việt Nam",
      coordinates: [],
      heightBody: new Animated.Value((height / 8) * 7 - 20),
      // date: new Date(),
      // dataTask: [
      //   {
      //     date: "31/07/2020",
      //     time: "03:45",
      //     stutus: 1,
      //     user: "",
      //     address:
      //       "123 Điện Biên Phủ, Điện Biên Phủ, Phường 15, Quận Bình Thạnh, Thành phố Hồ Chí Minh, 8428, Việt Nam",
      //     info: "Info",
      //   },
      //   {
      //     date: "29/07/2020",
      //     time: "05:45",
      //     stutus: 1,
      //     user: "",
      //     address: "123 Đường Lê Văn Sỹ, phường 13, Phú Nhuận, Hồ Chí Minh",
      //     info: "Info ABC",
      //   },
      //   {
      //     date: "31/07/2020",
      //     time: "05:45",
      //     stutus: 1,
      //     user: "",
      //     address: "123 Đường Lê Văn Sỹ, phường 13, Phú Nhuận, Hồ Chí Minh",
      //     info: "Info ABC",
      //   },
      // ],
      // datacurrent: {
      //   time: "03:45",
      //   stutus: 1,
      //   user: "",
      //   address:
      //     "123 Điện Biên Phủ, Điện Biên Phủ, Phường 15, Quận Bình Thạnh, Thành phố Hồ Chí Minh, 8428, Việt Nam",
      //   info: "Info",
      // },
      seconds: 30,
      dataAgent: {},
      dataUser: {},
      dataOrder: {},
      // dataOrder: {
      //   _id: "5f44df946204c22fa8c45414",
      //   userId: "5f2c91d11feca6396c793913",
      //   timeOrder: "2020-08-25T09:53:24.444Z",
      //   totalCost: 24,
      //   address:
      //     "99 Lê Văn Việt, Tăng Nhơn Phú A, Quận 9, Thành phố Hồ Chí Minh, Việt Nam",
      //   phone: "0899839162",
      //   latitude: 10.8473375,
      //   longitude: 106.8019782,
      //   agentId: "",
      //   status: 0,
      // },
      orderHistory: [],
      itemHistory: [],
      viewHistory: 0,

      agentId: "",
      item: [],
    };
    this.socket.on(
      "order-agent",
      function (data) {
        console.log("order:");
        console.log(data);
        this.setState({
          dataOrder: data,
          newTask: 1,
          seconds: 30,
        });
        this.startTimer();
      }.bind(this)
    );
  }
  _changebody() {
    if (this.state.status === 0) {
      Animated.timing(this.state.heightBody, {
        toValue: 150,
        duration: 700,
      }).start();
      this.setState({
        status: 1,
      });
    } else {
      Animated.timing(this.state.heightBody, {
        toValue: (height / 8) * 7 - 20,
        duration: 500,
      }).start();
      this.setState({
        status: 0,
      });
    }
  }
  _Call() {
    const url = "http://tutofox.com/foodapp/api.json";
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataFood: responseJson.food,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getGeocodeAsync = async (location) => {
    let geocodec = await Location.reverseGeocodeAsync(location);
    console.log(Date());
    // console.log(geocodec);
    console.log(geocodec[0]);
    this.setState({
      geocode:
        geocodec[0].street +
        ", " +
        geocodec[0].region +
        ", " +
        geocodec[0].country,
    });
  };
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      alert("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const { latitude, longitude } = location.coords;
    // console.log(location.coords);
    // console.log(location.coords.latitude);
    var coor = [
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      },
    ];
    this.setState({
      latitudeCurent: location.coords.latitude,
      longitudeCurent: location.coords.longitude,
      // coordinates: coor,
    });
    this.getGeocodeAsync({ latitude, longitude });
    // console.log(this.state.geocode);
  };
  componentDidMount() {
    // this._Call();
    this.getLocationAsync();
    AsyncStorage.getItem("Agent")
      .then((agent) => {
        if (agent !== null) {
          const agentdata = JSON.parse(agent);
          console.log(agentdata._id);
          this.setState({ dataAgent: agentdata, agentId: agentdata._id });
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  _direction() {
    _this = this;
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={{
          flex: 1,
          width: width,
          height: height,
          position: "absolute",
        }}
        // style={{height: height - 50, width: width}}
        ref={(c) => (this.mapView = c)}
        onPress={this.onMapPress}
      >
        {this.state.coordinates.map((coordinate, index) => (
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate}>
            {index == 0 ? (
              <Callout>
                <Text>You</Text>
                {/* <Text>{_this.state.geocode}</Text> */}
              </Callout>
            ) : (
              <Callout>
                <Text>{this.state.addressTo}</Text>
              </Callout>
            )}
          </MapView.Marker>
        ))}
        {this.state.coordinates.length >= 2 && (
          <MapViewDirections
            origin={this.state.coordinates[0]}
            waypoints={
              this.state.coordinates.length > 1
                ? this.state.coordinates.slice(1, 0)
                : null
            }
            destination={
              // this.state.coordinates[1]
              this.state.coordinates[this.state.coordinates.length - 1]
            }
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`
              );
            }}
            onReady={(result) => {
              // console.log(result);
              _this.setState({
                addressTo:
                  _this.state.addressTo +
                  "\n" +
                  `Distance: "${result.distance}" km` +
                  "\n" +
                  `Duration: "${result.duration}" min.`,
              });
              console.log(`Distance: "${result.distance}" km`);
              console.log(`Duration: "${result.duration}" min.`);
              // this.setState({
              //   screen: 1,
              // });
              this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        )}
      </MapView>
    );
  }
  onMapPress = (e) => {
    console.log("coor");
    console.log(e);

    console.log(e.nativeEvent.coordinate);
    this.setState({
      coordinates: this.state.coordinates.splice(1, 1),
    });
    var coor = [
      {
        latitude: this.state.latitudeCurent,
        longitude: this.state.longitudeCurent,
      },
      {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
    ];
    this.setState({
      coordinates: coor,
    });
    console.log(this.state.coordinates);
  };
  onClickMap(e) {
    const { latitude, longitude } = e.coordinate;
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
  }
  startTimer() {
    if (this.state.seconds > 0) {
      var time = setInterval(() => {
        let seconds = this.state.seconds - 1;
        this.setState({
          seconds: seconds,
        });
        if (seconds == 0) {
          clearInterval(time);
          this.setState({ newTask: 0 });
        }
      }, 1000);
    }
  }
  _datafood(item) {
    console.log(item._id);
    return fetch(API + "access/order:fetchDetail/" + item._id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          itemHistory: responseJson.data,
          viewHistory: 2,
        });
        // console.log("data" + responseJson.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  receive() {
    var coor = [
      {
        latitude: this.state.latitudeCurent,
        longitude: this.state.longitudeCurent,
      },
      {
        latitude: this.state.dataOrder.latitude,
        longitude: this.state.dataOrder.longitude,
      },
    ];
    console.log(coor);
    this.setState({
      seconds: 1,
      latitudeTo: this.state.dataOrder.latitude,
      longitudeTo: this.state.dataOrder.longitude,
      coordinates: coor,
      addressTo: this.state.dataOrder.address,
    });
    this.socket.emit("agent-receive", this.state.dataAgent);
    fetch(API + "access/order:agentId/" + this.state.dataOrder._id, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        status: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          screen: 1,
        });
      })
      .catch((error) => {
        alert("error" + error);
      })
      .done();
    fetch(API + "access/user/" + this.state.dataOrder.userId)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ dataUser: data.data });
      })
      .catch((error) => {
        alert("error" + error);
      })
      .done();
    //TODO FETCH DETAIL ORDER
    fetch(API + "/api/access/order:fetchDetail/" + this.state.dataOrder._id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          item: responseJson.data,
        });
        // this.setState({
        //   lastList: 0,
        // });
        console.log("data" + responseJson.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  unreceive() {
    this.socket.emit("agent-un-receive");
  }
  _taskItem(item) {
    return (
      <View style={styles.task}>
        <View style={styles.pickup}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {/* {item.time} */}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Away
          </Text>
        </View>
        <Text style={styles.address}>{item.address}</Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => this.unreceive()}
            style={{
              justifyContent: "center",
              width: width / 2 - 80,
            }}
          >
            <Text style={{ color: "red", textAlign: "center", fontSize: 18 }}>
              Decline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.receive()}
            style={styles.acknowledge}
          >
            <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
              Accept
            </Text>
            <Text style={{ fontSize: 18, color: "white" }}>
              00:{this.state.seconds}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  _newTask(data) {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", marginLeft: 20 }}>
              <Text style={styles.num}>{this.state.num}</Text>
              <Text style={styles.text}>New Task</Text>
            </View>
            <View style={{ justifyContent: "center", marginRight: 20 }}>
              <TouchableOpacity onPress={() => this.closeNewtask()}>
                <Icon name="times" size={30} color={"#fff"} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.just}>Just Now</Text>
          <View style={styles.up}>
            <View style={styles.task}>
              <View style={styles.pickup}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {/* {item.time} */}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Away
                </Text>
              </View>
              <Text style={styles.address}>{data.address}</Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => this.unreceive()}
                  style={{
                    justifyContent: "center",
                    width: width / 2 - 80,
                  }}
                >
                  <Text
                    style={{ color: "red", textAlign: "center", fontSize: 18 }}
                  >
                    Decline
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.receive()}
                  style={styles.acknowledge}
                >
                  <Text
                    style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                  >
                    Accept
                  </Text>
                  <Text style={{ fontSize: 18, color: "white" }}>
                    00:{this.state.seconds}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <FlatList
              //horizontal={true}
              data={data}
              numColumns={1}
              renderItem={({ item }) => this._taskItem(data)}
              keyExtractor={(item, index) => index.toString()}
            /> */}
            <View style={{ height: 20 }} />
          </View>
        </View>
      </View>
    );
  }
  _task(item) {
    return (
      <View>
        <TouchableOpacity onPress={() => this._datafood(item)}>
          <View
            style={{
              ...styles.task,
              width: width - 30,
              height: height / 7,
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            <View
              style={{
                ...styles.pickup,
                justifyContent: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {item.timeOrder}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 20,
                }}
              >
                Accepted
              </Text>
            </View>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  updateStatusOrder(status) {
    fetch(API + "access/order:status/" + this.state.dataOrder._id, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        status: status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        alert("error" + error);
      })
      .done();
    if (status == 2) {
      this.setState({ stepOrder: 1 });
    } else if (status == 3 || status == -1) {
      this.setState({ stepOrder: 3 });
    }
  }
  _itemTask(item) {
    return (
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            marginTop: 20,
            paddingLeft: 20,
          }}
        >
          <View style={styles.infor}>
            <View style={{ width: 40 }}>
              <Icon name="clock" size={18} color={"#fff"} />
            </View>
            <View>
              <View
                style={{
                  width: width - 80,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.timeOrder} pm - Pickup
                </Text>
                {/* <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 18,
                      color: "purple",
                      paddingRight: 15,
                    }}
                  >
                    Accepted
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>{line}</View>
            </View>
          </View>
          <View style={styles.infor}>
            <View style={{ width: 40 }}>
              <Icon name="user" size={18} color={"#fff"} />
            </View>
            <View>
              <View
                style={{
                  width: width - 80,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {item.userId == "" ? (
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    No Recipient
                  </Text>
                ) : (
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.userId}
                  </Text>
                )}
              </View>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>{line}</View>
            </View>
          </View>
          <View style={styles.infor}>
            <View style={{ width: 40 }}>
              <Icon name="map-marker" size={18} color={"#fff"} />
            </View>
            <View>
              <View
                style={{
                  width: width - 80,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ fontSize: 18, width: width - 120 }}>
                  {item.address}
                </Text>
                <TouchableOpacity
                  style={{ width: 40, justifyContent: "center" }}
                >
                  <Icon name="directions" size={40} color={"blue"} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>{line}</View>
            </View>
          </View>
          <View style={styles.infor}>
            <View style={{ width: 40 }}>
              <Icon name="phone" size={18} color={"#fff"} />
            </View>
            <View>
              <View
                style={{
                  width: width - 80,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.phone}
                </Text>
              </View>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>{line}</View>
            </View>
          </View>
          <View style={styles.infor}>
            <View style={{ width: 40 }}>
              <Icon name="info-circle" size={18} color={"#fff"} />
            </View>
            <View>
              <View
                style={{
                  width: width - 80,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  TotalCost: {item.totalCost} $
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            marginBottom: 30,
            width: width,
            justifyContent: "center",
            height: 70,
            backgroundColor: "#fff",
          }}
        >
          {this.state.stepOrder == 0 ? (
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => this.updateStatusOrder(-1)}
                style={{ justifyContent: "center", paddingLeft: 20 }}
              >
                <Text style={{ fontSize: 18, color: "#f00" }}>Cancel</Text>
              </TouchableOpacity>
              {/* <Draggable /> */}
              <TouchableOpacity
                onPress={() => this.updateStatusOrder(2)}
                style={{ justifyContent: "center", paddingRight: 20 }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "#2ef027" }}
                >
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          ) : this.state.stepOrder == 1 ? (
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => this.updateStatusOrder(-1)}
                style={{ justifyContent: "center", paddingLeft: 20 }}
              >
                <Text style={{ fontSize: 18, color: "#f00" }}>Cancel</Text>
              </TouchableOpacity>
              {/* <Draggable /> */}
              <TouchableOpacity
                onPress={() => this.updateStatusOrder(3)}
                style={{ justifyContent: "center", paddingRight: 20 }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "#2ef027" }}
                >
                  Finish
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => this.setState({ screen: 0 })}
              style={{
                backgroundColor: "#2ef027",
                alignItems: "center",
                height: 70,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "#fff" }}>
                Order Food Successfully
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
  closeNewtask() {
    this.setState({
      newTask: 0,
    });
  }
  _renderSingleItem(item) {
    return (
      <TouchableOpacity style={styles.divFood}>
        <Image
          style={styles.imageFood}
          resizeMode="contain"
          source={{ uri: item.food.pathImage }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          {item.name}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          {item.description}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          Quantity: {item.quantity}
        </Text>
        {/* <Text>{item.description}</Text> */}
        <Text style={{ fontWeight: "bold", fontSize: 15, textAlign: "center" }}>
          Price: ${item.food.price}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 18, backgroundColor: "#000" }}></View>
        {this.state.newTask == 1 ? (
          this._newTask(this.state.dataOrder)
        ) : (
          <View style={{ flex: 1, position: "relative" }}>
            {this._direction()}
            <View style={styles.container2}>
              <View style={styles.header2}>
                {this.state.screen == 2 ? (
                  <View style={styles.menu}>
                    <View
                      style={{ justifyContent: "center", flexDirection: "row" }}
                    >
                      <TouchableOpacity
                        onPress={() => this.setState({ screen: 1 })}
                      >
                        <Icon name="arrow-left" size={20} color={"#fff"} />
                      </TouchableOpacity>
                      <Text style={{ color: "#fff", marginLeft: 10 }}>
                        back
                      </Text>
                    </View>
                    <Icon name="ellipsis-v" size={20} color={"#fff"} />
                  </View>
                ) : (
                  <View style={styles.menu}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("menu")}
                    >
                      <Icon name="bars" size={25} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      // onPress={() => this.setState({ modelDateTime: true })}
                      onPress={() => this.getOrderByAgentId()}
                      style={{ flexDirection: "row" }}
                    >
                      <Text style={{ color: "#fff", fontSize: 20 }}>
                        History
                      </Text>
                      {/* <Icon name="angle-down" size={25} color={"#fff"} /> */}
                    </TouchableOpacity>
                    <Icon name="search" size={25} color={"#fff"} />
                  </View>
                )}
              </View>
              {this.state.screen == 0 ? (
                <View
                  style={{
                    ...styles.body,
                    height: (height / 8) * 7 - 20,
                    paddingTop: 50,
                    elevation: 10,
                    shadowOpacity: 0.5,
                    shadowRadius: 50,
                  }}
                >
                  {/* <TouchableOpacity
                    onPress={() => this._changebody()}
                    style={{marginLeft: 5}}>
                    {iconDown2}
                  </TouchableOpacity> */}
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={require("../image/icon_food.png")}
                  />
                  <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                    All clear
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      paddingLeft: 20,
                      paddingRight: 20,
                    }}
                  >
                    Looks like you have no task(s) for this day
                  </Text>
                </View>
              ) : this.state.screen == 1 ? (
                <Animated.View
                  style={{
                    ...styles.body,
                    height: this.state.heightBody,
                    elevation: 10,
                    shadowOpacity: 0.5,
                    shadowRadius: 50,
                    backgroundColor: "#e2f0f9",
                  }}
                >
                  {this.state.viewHistory == 0 ? (
                    <TouchableOpacity
                      onPress={() => this._changebody()}
                      style={{ marginLeft: 5 }}
                    >
                      <Icon
                        name="chevron-down"
                        size={30}
                        color={"#f00"}
                        style={{ justifyContent: "center", height: 30 }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity></TouchableOpacity>
                  )}

                  {this.state.viewHistory == 0 ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => this.setState({ screen: 2 })}
                      >
                        <View
                          style={{
                            ...styles.task,
                            width: width - 30,
                            height: height / 7,
                            marginLeft: 5,
                            marginRight: 5,
                          }}
                        >
                          <View
                            style={{
                              ...styles.pickup,
                              justifyContent: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                              }}
                            >
                              {this.state.dataOrder.timeOrder}
                            </Text>

                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                marginLeft: 20,
                              }}
                            >
                              Accepted
                            </Text>
                          </View>
                          <Text style={styles.address}>
                            {this.state.dataOrder.address}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : this.state.viewHistory == 1 ? (
                    <View>
                      <TouchableOpacity
                        style={{ justifyContent: "flex-start" }}
                        onPress={() =>
                          this.setState({
                            viewHistory: 0,
                            screen: 0,
                          })
                        }
                      >
                        <Icon name="arrow-left" size={20} color={"#000"} />
                      </TouchableOpacity>
                      <View>
                        <Text style={{ fontSize: 20, color: "#5a6650" }}>
                          History
                        </Text>
                      </View>
                      <FlatList
                        data={this.state.orderHistory}
                        numColumns={1}
                        renderItem={({ item }) => this._task(item)}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        style={{ justifyContent: "flex-start" }}
                        onPress={() =>
                          this.setState({
                            viewHistory: 1,
                          })
                        }
                      >
                        <Icon name="arrow-left" size={20} color={"#000"} />
                      </TouchableOpacity>
                      <View>
                        <Text style={{ fontSize: 20, color: "#5a6650" }}>
                          Item Food
                        </Text>
                      </View>
                      <FlatList
                        data={this.state.itemHistory}
                        numColumns={1}
                        renderItem={({ item }) => this._renderSingleItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  )}

                  <View style={{ height: 20 }} />
                </Animated.View>
              ) : (
                <Animated.View
                  style={{
                    ...styles.body,
                    height: this.state.heightBody,
                    // backgroundColor: "#333",
                    elevation: 10,
                    shadowOpacity: 0.5,
                    shadowRadius: 50,
                    backgroundColor: "#e2f0f9",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this._changebody()}
                    style={{ marginLeft: 5 }}
                  >
                    <Icon
                      name="chevron-down"
                      size={30}
                      color={"#f00"}
                      style={{ justifyContent: "center", height: 30 }}
                    />
                  </TouchableOpacity>
                  {this._itemTask(this.state.dataOrder)}
                </Animated.View>
              )}
            </View>
          </View>
        )}

        <Modal transparent={true} visible={this.state.modelDateTime}>
          <View style={{ flex: 1, backgroundColor: "#000000aa" }}>
            <View style={{ flex: 14, backgroundColor: "#fff" }}>
              <View style={{ height: 50, justifyContent: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: width / 3,
                      paddingLeft: 15,
                      possition: "relative",
                    }}
                  >
                    <Text
                      style={{
                        position: "absolute",
                        left: 16,
                        top: 7,
                        fontSize: 11,
                        color: "#4695f6",
                      }}
                    >
                      20
                    </Text>
                    <Icon name="calendar" size={23} color={"#4695f6"} />
                    <Text
                      style={{
                        paddingLeft: 15,
                        fontSize: 30,
                        color: "#4695f6",
                      }}
                    >
                      Today
                    </Text>
                  </View>
                  <View
                    style={{
                      width: width / 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>CALENDER</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({ modelDateTime: false })}
                    style={{
                      width: width / 3 - 15,
                      flexDirection: "row-reverse",
                      paddingRight: 15,
                    }}
                  >
                    <Icon name="times" size={20} color={"#000"} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: width - 60,
                  height: 1,
                  backgroundColor: "gray",
                  marginTop: 40,
                  marginLeft: 30,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  paddingLeft: 30,
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: "#4695f6",
                  }}
                ></View>
                <Text style={{ marginLeft: 10 }}>{this.state.num} Pending</Text>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: "gray",
                    marginLeft: 10,
                  }}
                ></View>
                <Text style={{ marginLeft: 10 }}>
                  {this.state.num} Complete
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 20,
                  paddingRight: 20,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.getOrderByAgentId()}
                  style={{
                    height: 50,
                    width: width / 2 - 30,
                    backgroundColor: "#4695f6",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 15,
                    borderRadius: 25,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      History
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ screen: 1, modelDateTime: false })
                  }
                  style={{
                    height: 50,
                    width: width / 2 - 30,
                    backgroundColor: "#4695f6",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 15,
                    borderRadius: 25,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      View Task(s)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ modelDateTime: false })}
              style={{ flex: 3 }}
            ></TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
  getOrderByAgentId() {
    // console.log("abc");
    // console.log(this.state.dataAgent._id);
    console.log(Date());
    console.log(this.state.agentId);
    return fetch(API + "access/order:fetchByAgentId/" + this.state.agentId)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          orderHistory: data.data,
          screen: 1,
          viewHistory: 1,
          modelDateTime: false,
        });
        console.log(Date());
        console.log(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
