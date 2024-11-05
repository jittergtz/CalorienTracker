// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Image } from 'expo-image';  
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import { useDatabase } from '../ProviderDb';
import StatsDashboard from  "@/components/statsDashboard"
import { Prestige } from '@/components/Prestige/prestige';
import RepeatCustomerRateChart from "@/components/Barchart"

const Statistics = () => {
  const [sound, setSound] = useState();
  const [unlock, setUnlock] = useState(false)
  const { db, streak, highestStreak, completionStats, perfectMonths } = useDatabase();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../../assets/sounds/one.mp3')
    );
    setSound(sound);

    await sound.setVolumeAsync(0.5);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const images = [
    { src: require('@/assets/images/pres1.png'), streak: 1,  description: "Um diesen Rang freizuschalten musst du eine Streak von 1 tag erreichen" },
    { src: require('@/assets/images/pres2.png'), streak: 3, description: "Um diesen Rang freizuschalten musst du eine Streak von 3 tagen erreichen"  },
    { src: require('@/assets/images/bo3zombies1.webp'), streak: 7, description: "Um diesen Rang freizuschalten musst du eine Streak von 7 tagen erreichen"  },
    { src: require('@/assets/images/boszombies2.webp'), streak: 12, description: "Um diesen Rang freizuschalten musst du eine Streak von 12 tagen erreichen"  },
    { src: require('@/assets/images/nuke.png'), streak: 30, description: "Um diesen Rang freizuschalten musst du eine Streak von 30 erreichen"  },
    { src: require('@/assets/images/pres5.png'), streak: 35, description: "Um diesen Rang freizuschalten musst du eine Streak von 35 tagen erreichen"  },
    { src: require('@/assets/images/pres6.png'), streak: 40, description: "Um diesen Rang freizuschalten musst du eine Streak von 40 tagen erreichen"  },
    { src: require('@/assets/images/pres7.png'), streak: 45, description: "Um diesen Rang freizuschalten musst du eine Streak von 45 tagen erreichen"  },
    { src: require('@/assets/images/pres8.png'), streak: 50, description: "Um diesen Rang freizuschalten musst du eine Streak von 50 tagen erreichen"  },
    { src: require('@/assets/images/pres9.png'), streak: 60, description: "Um diesen Rang freizuschalten musst du eine Streak von 60 tagen erreichen"  },
    { src: require('@/assets/images/pres10.png'), streak: 75, description: "Um diesen Rang freizuschalten musst du eine Streak von 75 tagen erreichen"  },
    { src: require('@/assets/images/pres10a.png'), streak: 100, description: "Um diesen Rang freizuschalten musst du eine Streak von 100 tagen erreichen"  },

    { src: require('@/assets/images/pres7.png'), streak: 125, description: "Um diesen Rang freizuschalten musst du eine Streak von 125 tagen erreichen"  },
    { src: require('@/assets/images/pres8.png'), streak: 150, description: "???"  },
    { src: require('@/assets/images/pres9.png'), streak: 200, description: "???"  },
    { src: require('@/assets/images/pres10.png'), streak: 250, description: "???"  },
    { src: require('@/assets/images/pres10a.png'), streak: 300, description: "???"  },
    { src: require('@/assets/images/pres10a.png'), streak: 365, description: "???" },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#090909" }}>
      <View style={styles.calorieGaolContainer}>
      <Button title="Play Sound" onPress={playSound} /> 



      <StatsDashboard 
      streak={highestStreak}
       completionStats={completionStats}
       perfectMonths={perfectMonths}/>
      </View>


    
      
    <View>
  
    <View style={styles.container}>
     <ScrollView contentContainerStyle={styles.new}
      showsHorizontalScrollIndicator={false} >
              <RepeatCustomerRateChart/>
              <View style={styles.textContainer}><Text style={styles.text}>Ränge</Text></View>
      {images.map((item, index) => (

        
        <View key={index} style={styles.CardContainer}>
        <View  style={styles.imageContainer}>
          <Image  
           recyclingKey="animated" 
          contentFit="contain" 
          source={item.src} style={styles.image} />
      
      
          {highestStreak <= item.streak && (
            <View style={styles.lockedOverlay}>
               <View style={styles.lockedContainer}>
              <Image
              source={require('@/assets/images/lock.png')}
              style={styles.lockedIcon} /> 
               </View> 
              </View>  
                )}

             
            </View>
         
            <View style={styles.CardTextContainer}>
                  <Text style={{color: "white", fontSize: 20, color: "#949494"}}>
                    Rang {index +1}
                  </Text>
                  <Text style={{color: "white", fontSize: 13, color: "#666666"}}>
                  {item.description}
                  </Text>
                </View>
               
        </View>

        
      ))}
      </ScrollView>
    </View>
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    height: 400,
  },

  calorieGaolContainer: {
    height: 300,
    marginTop: 70,
    padding: 0,
  },

  new: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },


  text: {
   fontSize: 20,
    color: "#666" 
  },

  highscoreText: {
   fontSize: 120,
   color: "#B07D31",
   fontWeight: "bold",
   fontFamily: "",
  },

  textContainer: {
    marginHorizontal: 10,
    borderRadius: 10,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    paddingHorizontal: 15,
    backgroundColor: "#0F0F0F",

  },

  CardContainer: {
    width: "100%",
    backgroundColor: "#050505",
    borderRadius: 10,
    alignItems: "start",
    flexDirection: "row",
    display: "flex",
  

  },

  CardTextContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    
    
    
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
    borderRadius: 10,
  },
  unlockedContainer: {
    padding: 10,
    backgroundColor: '#BA9BD8',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#6711B8",
    borderRadius: 10,
  },
  lockedIcon: {
    width: 40,
    height: 40, 
  },
});

export default Statistics;