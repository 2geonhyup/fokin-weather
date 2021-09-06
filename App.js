import React from 'react';
import { Alert } from 'react-native';
import  Loading from "./Loading";
import * as Location from 'expo-location';
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "a37cb5604a179b6e300d7b28b07b65bd";


export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async(latitude, longitude) => {
    const { 
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric
      `
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp: (temp-273.15)
    });
  }
  getLocation = async() => {
    try{
      await Location.requestForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error){
      Alert.alert("Can't find you.","So sad");
    }
  };
  componentDidMount(){
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
