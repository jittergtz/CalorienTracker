
import { BlurView } from 'expo-blur';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';  // Using expo-image instead of regular Image
import { Audio } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Prestige } from './Prestige/prestige';

const LevelBannerModal = ({streak}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const imageScale = useSharedValue(0.2);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const streakOpacity = useSharedValue(0);
  const streakTranslateY = useSharedValue(10);


  const toggleModal = async () => {
    if (isVisible) {
      await sound?.unloadAsync();
      hideAnimation();
    } else 
    {
      await playSound();
      showAnimation();
    }
    setIsVisible(!isVisible);
  };
   

  const [shownAchievements, setShownAchievements] = useState(new Set());
  
  // State to store the current achievement being displayed
  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    // Function to check if there's a new achievement to show
    const checkStreakAchievement = () => {
      // Find any matching achievement that hasn't been shown yet
      const newAchievement = Prestige.find(achievement => 
        achievement.streak === streak && !shownAchievements.has(achievement.name)
      );

      if (newAchievement) {
        // Store the current achievement for modal content
        setCurrentAchievement(newAchievement);
        
        // Add to shown achievements
        setShownAchievements(prev => new Set([...prev, newAchievement.name]));
        
        // Trigger the modal
        toggleModal();
      }
    };

    // Check for achievements whenever streak changes
    checkStreakAchievement();
  }, [streak, Prestige, toggleModal, shownAchievements]);


  const showAnimation = () => {
    imageScale.value = withTiming(1, { duration: 1500 });
    textOpacity.value = withTiming(1, { duration: 1500 });
    textTranslateY.value = withTiming(0, { duration: 1500 });
    streakOpacity.value = withDelay(3000, withTiming(1, { duration: 500 }));
    streakTranslateY.value = withTiming(0, { duration: 1200 });
  };

  const hideAnimation = () => {
    imageScale.value = withTiming(0.5, { duration: 800 });
    textOpacity.value = withTiming(0, { duration: 800 });
    textTranslateY.value = withTiming(20, { duration: 800 });
    streakOpacity.value = withTiming(0, { duration: 200 });
    streakTranslateY.value = withTiming(20, { duration: 800 });
  };

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/NewEmblemSound.mp3')
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

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const streakAnimatedStyle = useAnimatedStyle(() => ({
    opacity: streakOpacity.value,
    transform: [{ translateY: streakTranslateY.value }],
  }));



  // handle render streak logic

  const getIcon = (streak: number) => {
    const prestige = Prestige.find((p) => p.streak <= streak);
    return prestige ? prestige.img : require('@/assets/images/pres1.png');
  };

  const GetName = (streak: number) => {
    const prestige = Prestige.find((p) => p.streak <= streak);
    return prestige ? prestige.name : "Master";
  };

  const GetDescription = (streak: number) => {
    const prestige = Prestige.find((p) => p.streak <= streak);
    return prestige ? prestige.description : "Du hast ein neues Prestige erreicht";
  };


   // Add new animated value for shine effect
   const shinePosition = useSharedValue(-200);
  
   // Create the shine animation style
   const shineAnimatedStyle = useAnimatedStyle(() => {
     return {
       position: 'absolute',
       top: 0,
       left: 0,
       right: 0,
       bottom: 0,
       opacity: 0.4,
       transform: [{ translateX: shinePosition.value }],
     };
   });
 
   // Start shine animation when modal is visible
   useEffect(() => {
     if (isVisible) {
       const screenWidth = Dimensions.get('window').width;
       const animateShine = () => {
        shinePosition.value = withDelay(3200, 
          withSequence(
            withTiming(-300, { duration: 0 }),
            withTiming(screenWidth + 300, {
              duration: 650,
              easing: Easing.ease,
            }),
          )
        );
      };
 
       // Initial animation
       animateShine();

          // Set up interval for repeated animation
      const intervalId = setInterval(animateShine, 8000);

      // Cleanup
      return () => clearInterval(intervalId);
    }
  }, [isVisible]);
  


  return (
    <>
      {isVisible && (
        <BlurView intensity={40} tint="dark" style={styles.container}>
            <View></View>
             

            <Animated.View style={shineAnimatedStyle}>
            <LinearGradient
              style={styles.shine}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#ffffff00', '#ffffff40', '#ffffff00']}
            />
         </Animated.View>
          <View style={styles.badgeContainer}>
            <Animated.View style={[styles.image, imageAnimatedStyle]}>
              <Image  
                 recyclingKey="animated" 
                  contentFit="contain"
                source={getIcon(streak)}    
                style={styles.image}
              />                       
            </Animated.View>
            <Animated.View style={textAnimatedStyle}>
              <Text style={styles.text}>{GetName(streak)}</Text>
            </Animated.View>
            <Animated.View style={streakAnimatedStyle}>
           
              <LinearGradient
             style={styles.streakContainer}  
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
             colors={['#1A0213', '#69198E', '#1A0213']}>
                <Text style={styles.streakText}>Streak {streak}</Text> 
            </LinearGradient>
            </Animated.View>

            <Animated.View style={streakAnimatedStyle}>
              <View style={styles.callingCardContainer}>
              <Text style={styles.paragraphText}>Visitenkarte erhalten</Text>
            <Image  
           recyclingKey="animated" 
          contentFit="contain" 
          source={require('@/assets/gifs/underFireCd.webp')} style={styles.callingCard} />
          </View>
         </Animated.View>


            <Animated.View style={streakAnimatedStyle}>
            <View style={styles.paragraphContainer}>
            <Text style={styles.paragraphText}>{GetDescription(streak)}</Text>
            </View>
            </Animated.View>
          </View>
       

          <Animated.View style={[styles.width ,streakAnimatedStyle]}>
          <Pressable style={styles.button} onPress={toggleModal}>
            <Text style={styles.textButton}>Weiter</Text>
          </Pressable>
          </Animated.View>

        </BlurView>
      )}
            <View style={styles.offContainer}>
      <Pressable style={styles.button} onPress={toggleModal}>
        <Text style={styles.textButton}>Open Modal</Text>
      </Pressable>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  
  callingCardContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  
  callingCard: {
    width: 240,
    height: 62,
    borderWidth: 1,
    borderColor: "#404040",
    backgroundColor: "#1B1B1B",
    borderRadius: 5,
    overflow: "hidden",
  
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    paddingVertical: 60,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  offContainer: {
    marginTop: 100,
    position: "absolute",
    zIndex: 999,
  },
  button: {
    backgroundColor: '#141414',
    height: 45,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252525',
  },
  textButton: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  streakContainer: {
    height: 40,
    width: 160,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#450B4B',
  },

  width: {
    width: "100%",
    alignItems: "center",
  },
  streakText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF99',
  },
  image: {
    width: 120,
    height: 120,
  },
  text: {
    marginVertical: 8,
    fontSize: 22,
    color: '#CCCCCC',
    fontWeight: 'bold',
  },

  textgradient: {
    fontSize: 40,
  },

  paragraphContainer: {
    marginTop: 60,
  },
  paragraphText: {
    fontSize: 16,
    color: "#C4C4C4",
    textAlign: "center",
    fontWeight: "600",
    width: 200,
  },





  shine: {
    width: 200,
    height: '100%',
    transform: [{ skewX: '-20deg' }],
  },
});

export default LevelBannerModal;

