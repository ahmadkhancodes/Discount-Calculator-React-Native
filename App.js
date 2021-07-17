
import * as React from 'react';
import { 
  View, Text, Button, TextInput, Image, 
  SafeAreaView, FlatList, StatusBar, StyleSheet,
  Alert, TouchableOpacity
   } from 'react-native';

import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({navigation}) {
const [finalPrice,setFinalPrice] = useState(0); 
const [priceSaved,setSavedPrice] = useState(0); 
const [orignalPrice,setOrignalPrice] = useState('');
const [salePercentage,setSalePercentage] = useState('');
const [buttonState, setButtonState] = useState(true);
const [orignalPriceError, setOrignalPriceError] = useState(false);
const [salePercentageError, setSalePercentageError] = useState(false);
const [history, setHistory]=useState([]);

const onChangeText = (text) =>{
if(text>0 && text <= 100){
setSalePercentage(text),
setFinalPrice(orignalPrice - (orignalPrice * (text/100))),
setSavedPrice((orignalPrice-(orignalPrice - (orignalPrice * (text/100))))),
setSalePercentageError(false),
setButtonState(false)}
else{
setSalePercentageError(true);
setButtonState(true),
setSavedPrice(0),
setFinalPrice(0)
}}
const onChangeOText =(text)=>{
  if(text>0){
setOrignalPrice(text);
setFinalPrice(text),
    setOrignalPriceError(false);
    setButtonState(true);
  }
  else{
    setOrignalPriceError(true),
    setSavedPrice(0),
    setFinalPrice(0),
    setButtonState(true);

  }
}


const saveHistory = (orignalPrice,finalPrice) => {
var obj={};
obj['id']=history.length+1;
obj['orignalPrice']=orignalPrice;
obj['finalPrice']=finalPrice;
history.push(obj);
setHistory(history);
Alert.alert('Successfully Saved !');
setSavedPrice(0),
setFinalPrice(0),
setButtonState(true);
}

React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate("HistoryScreen", { data: history })} title="History"
        color="#2b2e2c" />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center'}}>
      <Text>{'\n'}</Text>
      <Text style={{color: '#2b2e2c', fontSize: 30, textAlign: 'center'}}>Enter Orignal Price and Sale Percentage</Text>
      <Text>{'\n'}</Text>
      <View style={{display: 'flex', flexDirection: 'row'}}>
      <View>
       <TextInput 
       style={{width:150,height: 50, borderWidth: 2, borderRadius: 5, 
       borderColor: orignalPriceError ?'red':'#2b2e2c', textAlign: 'center', marginRight:5}}
       placeholder= 'Orignal Price'
       onChangeText={(thisText) => onChangeOText(thisText)}
       />
      </View>
      <View>
       <TextInput 
       style={{width:150,height: 50, borderWidth: 2, borderRadius: 5, 
        borderColor: salePercentageError ?'red':'#2b2e2c',textAlign: 'center', marginLeft:5}}
        placeholder= 'Sale Percentage'
        onChangeText={(text) => onChangeText(text)}
        maxLength={3}
       />
      </View>
      </View>
     <Text>{'\n'}</Text>
      <Text style={{color: '#2b2e2c', fontSize: 17, alignSelf: 'flex-start', marginLeft: 23}}>Final Price :</Text>
       <Text style={{fontWeight: 'bold', color: '#2b2e2c', marginBottom: -10}}>RS</Text>
      <Text style={{color: '#2b2e2c', fontSize: 60}}>{finalPrice}</Text>
      <Text style={{color: '#2b2e2c'}}>You Saved Rupees : {priceSaved}</Text>
           <Text>{'\n'}</Text>
      <View style={{width : '70%'}}>
      <Button title= 'Save' color= '#2b2e2c' 
      disabled={buttonState}
      onPress={()=>saveHistory(orignalPrice,finalPrice)}>
      </Button>
      </View>
    </View>
  );
}
//2nd Screen
function HistoryScreen({route, navigation}) {

const recievedData= route.params.data;
const [data,setData] = useState(recievedData);

const deleteItemById = id => {
  setData((prevTodo) => {
      return prevTodo.filter((todo) => todo.id != id);
    });
}

React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={()=>setData([])} title="Clear All"
        color="#2b2e2c" />
      ),
    });
  }, [navigation]);

const Item = ({ id,orignalPrice,finalPrice }) => (
  <View style={{
    display: 'flex',flexDirection: 'row', width: 300, 
    borderRadius: 2, borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderColor: '#2b2e2c'
    }}>
    <Text>{orignalPrice}</Text>
    <Text>{orignalPrice-finalPrice}</Text>
    <Text>{finalPrice}</Text>
    <Button color='#2b2e2c' title= 'x' onPress={()=>deleteItemById(id)}></Button>
  </View>
);
  const renderItem = ({ item }) => (
    <Item id={item.id} orignalPrice={item.orignalPrice} finalPrice={item.finalPrice} />
  );
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', paddingTop: 10}}>
    <Text style={{fontWeight: 'bold', alignSelf: 'flex-start'}}>         Orignal Price   Discount     Final Price</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(data) =>data.id.toString()}
      />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="Discount Calculator"
        component={HomeScreen}
         options={{
          title: 'Discount Calculator',
          headerStyle: {
            backgroundColor: '#4f5751'
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />
      <Stack.Screen name='HistoryScreen' 
      component={HistoryScreen}
       options={{
          title: 'History',
          headerStyle: {
            backgroundColor: '#4f5751',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          }}}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;