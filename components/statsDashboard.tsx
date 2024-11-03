
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';

import { Prestige } from './Prestige/prestige';

const StatsDashboard = ({streak, completionStats, perfectMonths}: any) => {
   
  


  // handle render streak logic

  const getExp = (streak: number) => {
    const prestige = Prestige.find((p) => p.streak <= streak);
    return prestige ? prestige.img : require('@/assets/images/pres1.png');
  };
  

    const { width } = Dimensions.get('window');
  
    return (
      <View style={{
        justifyContent: "center",
        alignItems: "center",
        width: width,
        height: 220,
        padding: 10,
        flexDirection: 'row',
        gap: 10,
      }}>
        {/* Left large box */}
        <View style={{
          flex: 2,
          backgroundColor: '#0F0F0F',
          borderRadius: 8,
          padding: 15,
          height: "100%",
          justifyContent: 'center',
          alignItems: "center",
        }}>
          <Image
            source={getExp(streak)}
            style={{
              width: 80,
              height: 80,
              resizeMode: 'contain',
            }}
          />
          <View>
            <Text style={{
              color: '#666',
              fontSize: 14,
              textAlign: "center"
            }}>
              Höchste Streak
            </Text>
            <Text style={{
              color: '#C68F3E',
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: "center",
            }}>
             {streak}
            </Text>
          </View>
        </View>
  
        {/* Middle column */}
        <View style={{
          gap: 8,
        }}>
          {/* Top  box */}
          <View style={{
            flex: 1,
            backgroundColor: '#0F0F0F',
            borderRadius: 8,
            padding: 15,
            justifyContent: 'center',
            alignItems: "center",
          }}>
            <Text style={{
              color: '#666',
              fontSize: 14,
              marginBottom: 5,
            }}>
              Complete Ratio
            </Text>
            <Text style={{
              color: '#C68F3E',
              fontSize: 24,
              fontWeight: 'bold',
            }}>
            {completionStats.completionRate}%
            </Text>
          </View>
  
          {/* Bottom  box */}
          <View style={{
            flex: 1,
            backgroundColor: '#0F0F0F',
            borderRadius: 8,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image
              source={require('@/assets/images/nuke.png')}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
              }}
            />
                <Text style={{
              color: '#666',
              fontSize: 14,
              marginBottom: 5,
            }}>
              Nukelear`s
            </Text>
            <Text style={{
              color: '#C68F3E',
              fontSize: 24,
              fontWeight: 'bold',
            }}>
              {perfectMonths}
            </Text>
          </View>
        </View>

          {/* Right large box */}
          <View style={{
          flex: 2,
          backgroundColor: '#0F0F0F',
          borderRadius: 8,
          padding: 15,
          height: "100%",
          justifyContent: 'space-between',
        }}>
          
        
        </View>
      </View>
    );
  };
  
 

export default StatsDashboard;



