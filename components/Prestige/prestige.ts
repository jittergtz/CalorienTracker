interface prestige {
    name: string,
    img: string,
    description: string,
    streak: number,
}

export const Prestige: prestige[] = [
  {
    name: "Predator",
    img: require('@/assets/images/gg2.png'),
    description: "Glückwunsch du hast den höchsten Rang Freigeschaltet!",
    streak: 175,
  },
  {
    name: "Predator",
    img: require('@/assets/images/gg1.png'),
    description: "Du hast Rang 17 erreicht!",
    streak: 150,
  },
  {
    name: "Predator",
    img: require('@/assets/images/pres2bo4.webp'),
    description: "Du hast Rang 16 erreicht!",
    streak: 130,
  },
    {
      name: "Olympia",
      img: require('@/assets/images/awpres1.webp'),
      description: "Du hast Rang 15 erreicht!",
      streak: 115,
    },
    {
      name: "Olymp",
      img: require('@/assets/images/pres10a.png'),
      description: "Rang 14 wurde erreicht  du bist auf einer 100 Tage Streak! ",
      streak: 100,
    },

    {
      name: "Unaufhaltbar",
      img: require('@/assets/images/pres10.png'),
      description: "Du hast Rang 13 erreicht!",
      streak: 90,
    },
    {
        name: "Berserk",
        img: require('@/assets/images/pres9.png'),
        description: "Du hast Rang 12 erreicht!",
        streak: 80,
      },
      {
        name: "GOTT",
        img: require('@/assets/images/pres8.png'),
        description: "Du hast Rang 11 erreicht!",
        streak: 70,
      },
      {
        name: "Unaufhaltbar",
        img: require('@/assets/images/pres7.png'),
        description: "Du hast Rang 10 erreicht!",
        streak: 60,
      },
      {
        name: "Zerstörer",
        img: require('@/assets/images/pres6.png'),
        description: "Du hast Rang 9 erreicht!",
        streak: 50,
      },
      {
        name: "Unaufhaltbar",
        img: require('@/assets/images/pres5.png'),
        description: "Du hast Rang 8 erreicht!",
        streak: 40,
      },
      {
        name: "Nukelear",
        img: require('@/assets/images/nuke.png'),
        description: "Nukelear! 30 Tage Streak Erreicht",
        streak: 30,
      },
      {
        name: "Soldar",
        img: require('@/assets/images/pres4.png'),
        description: "Du hast Rang 6 erreicht!",
        streak: 25,
      },
      {
        name: "Nukelear",
        img: require('@/assets/images/pres3.png'),
        description: "Du hast Rang 5 erreicht!",
        streak: 18,
      },
      {
        name: "444",
        img: require('@/assets/images/boszombies2.webp'),
        description: "Du hast Rang 4 erreicht!",
        streak: 12,
      },
      {
        name: "Prestige 3",
        img: require('@/assets/images/bo3zombies1.webp'),
        description: "Du hast Rang 3 erreicht!",
        streak: 7,
      },
      {
        name: "Hungrig",
        img: require('@/assets/images/pres2.png'),
        description: "Du hast Rang 2 erreicht!",
        streak: 3,
      },


]