import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const Statistics = () => {
  const [streak, setStreak] = useState(40);

  const images = [
    { src: require('@/assets/images/pres1.png'), streak: 0 },
    { src: require('@/assets/images/pres2.png'), streak: 3 },
    { src: require('@/assets/images/pres3.png'), streak: 10 },
    { src: require('@/assets/images/pres4.png'), streak: 20 },
    { src: require('@/assets/images/nuke.png'), streak: 30 },
    { src: require('@/assets/images/pres5.png'), streak: 35 },
    { src: require('@/assets/images/pres6.png'), streak: 40 },
    { src: require('@/assets/images/pres7.png'), streak: 45 },
    { src: require('@/assets/images/pres8.png'), streak: 50 },
    { src: require('@/assets/images/pres9.png'), streak: 60 },
    { src: require('@/assets/images/pres10.png'), streak: 75 },
    { src: require('@/assets/images/pres10a.png'), streak: 100 },

    { src: require('@/assets/images/pres7.png'), streak: 45 },
    { src: require('@/assets/images/pres8.png'), streak: 50 },
    { src: require('@/assets/images/pres9.png'), streak: 60 },
    { src: require('@/assets/images/pres10.png'), streak: 75 },
    { src: require('@/assets/images/pres10a.png'), streak: 100 },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.calorieGaolContainer}>

      </View>
    <View style={styles.file}>
      <View><Text style={styles.text}>Abzeichen</Text></View>
    <View style={styles.container}>
     <ScrollView contentContainerStyle={styles.new}
      showsHorizontalScrollIndicator={false} >
      {images.map((item, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={item.src} style={styles.image} />
          {streak <= item.streak && (
            <View style={styles.lockedOverlay}>
              <View style={styles.lockedContainer}>
                <Image
                  source={require('@/assets/images/lock.png')}
                  style={styles.lockedIcon}
                />
              </View>
            </View>
          )}
          
        </View>
      ))}
      </ScrollView>
    </View>
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  file: {
    padding: 30,
    margin: 10,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    height: 400,
  },

  calorieGaolContainer: {
    width: "100%",
    height: 400
  },

  new: {
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },


  text: {
   fontSize: 22,
    color: "#A8A8A8" 
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
  },
  lockedOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedContainer: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  lockedIcon: {
    width: 40,
    height: 40,
  },
});

export default Statistics;