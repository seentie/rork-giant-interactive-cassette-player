import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Modal,
  useWindowDimensions,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Play, SkipBack, Square, FastForward, Palette, Settings, Plus, Layers, RotateCcw } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTapes, TAPE_STYLES } from "./tape-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CASSETTE_WIDTH = SCREEN_WIDTH * 0.85;
const CASSETTE_HEIGHT = CASSETTE_WIDTH * 0.62;

type ColorScheme = {
  name: string;
  background: string[];
  cassetteBody: string[];
  labelStripe: string;
  controlPanel: string[];
  accent: string;
  text: string;
};

const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Classic",
    background: ["#2C1810", "#4A2C1A", "#2C1810"],
    cassetteBody: ["#F5E6D3", "#E8D4B0"],
    labelStripe: "#FF6B6B",
    controlPanel: ["#3A3A3A", "#2A2A2A"],
    accent: "#F5E6D3",
    text: "#F5E6D3",
  },
  {
    name: "Miami Vice",
    background: ["#FF006E", "#8338EC", "#3A86FF"],
    cassetteBody: ["#FFE66D", "#FF9F1C"],
    labelStripe: "#FF006E",
    controlPanel: ["#240046", "#10002B"],
    accent: "#FFE66D",
    text: "#FFE66D",
  },
  {
    name: "Neon Dreams",
    background: ["#0F0F23", "#240046", "#0F0F23"],
    cassetteBody: ["#00F5FF", "#0080FF"],
    labelStripe: "#FF1493",
    controlPanel: ["#FF1493", "#8B008B"],
    accent: "#00F5FF",
    text: "#00F5FF",
  },
  {
    name: "Sunset Strip",
    background: ["#FF4081", "#FF6EC7", "#FF9A56"],
    cassetteBody: ["#FFE082", "#FFCC02"],
    labelStripe: "#FF4081",
    controlPanel: ["#6A1B9A", "#4A148C"],
    accent: "#FFE082",
    text: "#FFE082",
  },
  {
    name: "Synthwave",
    background: ["#1A0033", "#330066", "#1A0033"],
    cassetteBody: ["#FF00FF", "#CC00CC"],
    labelStripe: "#00FFFF",
    controlPanel: ["#000033", "#000066"],
    accent: "#00FFFF",
    text: "#00FFFF",
  },
  {
    name: "Retro Arcade",
    background: ["#FF6B35", "#F7931E", "#FFD23F"],
    cassetteBody: ["#06FFA5", "#00CC88"],
    labelStripe: "#FF6B35",
    controlPanel: ["#1B263B", "#0D1B2A"],
    accent: "#06FFA5",
    text: "#06FFA5",
  },
  {
    name: "Pastel Dream",
    background: ["#FFD6E8", "#C9EEFF", "#E7D4FF"],
    cassetteBody: ["#FFF4E6", "#FFE4E9"],
    labelStripe: "#FFB3D9",
    controlPanel: ["#B8A4D4", "#A394C9"],
    accent: "#C9EEFF",
    text: "#9B7EBD",
  },
  {
    name: "Pastel Sunset",
    background: ["#FFDAB9", "#FFC8DD", "#BDE0FE"],
    cassetteBody: ["#FFFACD", "#FFE4E1"],
    labelStripe: "#FFB4C8",
    controlPanel: ["#CDB4DB", "#BDB2DB"],
    accent: "#BDE0FE",
    text: "#9785BA",
  },
  {
    name: "Pastel Garden",
    background: ["#CCFBF1", "#D4F1F4", "#E5F9DB"],
    cassetteBody: ["#E5F9E0", "#D4F1F4"],
    labelStripe: "#A8E6CF",
    controlPanel: ["#8BC6A8", "#7BB39E"],
    accent: "#A8E6CF",
    text: "#5A9279",
  },
  {
    name: "Pastel Rainbow",
    background: ["#FFB3BA", "#FFDFBA", "#FFFFBA"],
    cassetteBody: ["#BAFFC9", "#BAE1FF"],
    labelStripe: "#FFC3A0",
    controlPanel: ["#C9B3E0", "#B9A3D0"],
    accent: "#BAFFC9",
    text: "#9B7EC0",
  },
  {
    name: "Starry Night",
    background: ["#000428", "#004E92", "#000428"],
    cassetteBody: ["#2E3A59", "#1C2A42"],
    labelStripe: "#FFD700",
    controlPanel: ["#0A1931", "#000000"],
    accent: "#FFD700",
    text: "#FFD700",
  },
  {
    name: "Disco Ball Gold",
    background: ["#1A1A1A", "#2D2D2D", "#1A1A1A"],
    cassetteBody: ["#FFD700", "#FFC700"],
    labelStripe: "#FFD700",
    controlPanel: ["#4A4A4A", "#2A2A2A"],
    accent: "#FFD700",
    text: "#FFD700",
  },
  {
    name: "Disco Ball Silver",
    background: ["#1A1A1A", "#2D2D2D", "#1A1A1A"],
    cassetteBody: ["#E8E8E8", "#C0C0C0"],
    labelStripe: "#C0C0C0",
    controlPanel: ["#4A4A4A", "#2A2A2A"],
    accent: "#E8E8E8",
    text: "#E8E8E8",
  },
  {
    name: "Christmas Red",
    background: ["#0F4D21", "#165B33", "#0F4D21"],
    cassetteBody: ["#C41E3A", "#A0192C"],
    labelStripe: "#165B33",
    controlPanel: ["#0F4D21", "#0A3318"],
    accent: "#FFD700",
    text: "#FFD700",
  },
  {
    name: "Christmas Green",
    background: ["#8B0000", "#A52A2A", "#8B0000"],
    cassetteBody: ["#165B33", "#0F4D21"],
    labelStripe: "#C41E3A",
    controlPanel: ["#8B0000", "#660000"],
    accent: "#FFD700",
    text: "#FFD700",
  },
  {
    name: "Festive Gold",
    background: ["#8B0000", "#A52A2A", "#165B33"],
    cassetteBody: ["#FFD700", "#B8860B"],
    labelStripe: "#8B0000",
    controlPanel: ["#2F4F4F", "#1A3333"],
    accent: "#FFD700",
    text: "#FFD700",
  },
  {
    name: "Snowflake White",
    background: ["#4682B4", "#5F9EA0", "#87CEEB"],
    cassetteBody: ["#FFFAFA", "#F0F8FF"],
    labelStripe: "#4682B4",
    controlPanel: ["#4682B4", "#36648B"],
    accent: "#FFFFFF",
    text: "#FFFFFF",
  },
  {
    name: "Hanukkah Blue",
    background: ["#000033", "#003399", "#000033"],
    cassetteBody: ["#0038A8", "#003399"],
    labelStripe: "#FFFFFF",
    controlPanel: ["#000033", "#000022"],
    accent: "#FFFFFF",
    text: "#FFFFFF",
  },
  {
    name: "Hanukkah Silver",
    background: ["#003399", "#0038A8", "#003399"],
    cassetteBody: ["#C0C0C0", "#A8A8A8"],
    labelStripe: "#0038A8",
    controlPanel: ["#003399", "#002266"],
    accent: "#C0C0C0",
    text: "#E8E8E8",
  },
  {
    name: "Mono Red",
    background: ["#2D0A0A", "#4A1212", "#2D0A0A"],
    cassetteBody: ["#FFE5E5", "#FFCCCC"],
    labelStripe: "#CC0000",
    controlPanel: ["#1A0606", "#0D0303"],
    accent: "#FF6666",
    text: "#FF6666",
  },
  {
    name: "Mono Blue",
    background: ["#0A0A2D", "#12124A", "#0A0A2D"],
    cassetteBody: ["#E5E5FF", "#CCCCFF"],
    labelStripe: "#0000CC",
    controlPanel: ["#060619", "#03030D"],
    accent: "#6666FF",
    text: "#6666FF",
  },
  {
    name: "Mono Green",
    background: ["#0A2D0A", "#124A12", "#0A2D0A"],
    cassetteBody: ["#E5FFE5", "#CCFFCC"],
    labelStripe: "#00CC00",
    controlPanel: ["#061906", "#030D03"],
    accent: "#66FF66",
    text: "#66FF66",
  },
  {
    name: "Mono Purple",
    background: ["#1A0A2D", "#2D124A", "#1A0A2D"],
    cassetteBody: ["#F0E5FF", "#E0CCFF"],
    labelStripe: "#6600CC",
    controlPanel: ["#0D0619", "#06030D"],
    accent: "#9966FF",
    text: "#9966FF",
  },
  {
    name: "Mono Teal",
    background: ["#0A2D2D", "#124A4A", "#0A2D2D"],
    cassetteBody: ["#E5FFFF", "#CCFFFF"],
    labelStripe: "#00CCCC",
    controlPanel: ["#061919", "#030D0D"],
    accent: "#66FFFF",
    text: "#66FFFF",
  },
  {
    name: "Mono Orange",
    background: ["#2D1A0A", "#4A2D12", "#2D1A0A"],
    cassetteBody: ["#FFF0E5", "#FFE0CC"],
    labelStripe: "#CC6600",
    controlPanel: ["#190D06", "#0D0603"],
    accent: "#FF9966",
    text: "#FF9966",
  },
  {
    name: "Mono Gray",
    background: ["#1A1A1A", "#2D2D2D", "#1A1A1A"],
    cassetteBody: ["#F5F5F5", "#E0E0E0"],
    labelStripe: "#666666",
    controlPanel: ["#0D0D0D", "#050505"],
    accent: "#CCCCCC",
    text: "#CCCCCC",
  },
];

const getFontFamily = (font: string): string => {
  switch (font) {
    case 'handwriting':
      return Platform.select({
        ios: 'Bradley Hand',
        android: 'cursive',
        default: 'cursive'
      }) || 'cursive';
    case 'handwriting-bold':
      return Platform.select({
        ios: 'Snell Roundhand',
        android: 'casual',
        web: 'Brush Script MT, cursive',
        default: 'cursive'
      }) || 'cursive';
    case 'monospace':
    case 'monospace-bold':
      return Platform.select({
        ios: 'Courier New',
        android: 'monospace',
        default: 'monospace'
      }) || 'monospace';
    case 'serif':
    case 'serif-bold':
      return Platform.select({
        ios: 'Georgia',
        android: 'serif',
        default: 'serif'
      }) || 'serif';
    case 'bold':
      return Platform.select({
        ios: 'System',
        android: 'sans-serif-medium',
        default: 'System'
      }) || 'System';
    case 'sharpie':
    case 'sharpie-bold':
      return Platform.select({
        ios: 'Snell Roundhand',
        android: 'casual',
        web: 'Caveat, cursive',
        default: 'cursive'
      }) || 'cursive';
    case 'default-bold':
    default:
      return Platform.select({
        ios: 'System',
        android: 'sans-serif',
        default: 'System'
      }) || 'System';
  }
};

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  twinkleDelay: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  scale: Animated.Value;
}

const generateStars = (count: number, width: number, height: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    opacity: new Animated.Value(Math.random()),
    twinkleDelay: Math.random() * 2000,
  }));
};

const generateSparkles = (count: number, width: number, height: number): Sparkle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    opacity: new Animated.Value(Math.random()),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
  }));
};

export default function CassettePlayer() {
  const { currentTape, tapes, getTapeStyle, selectTape } = useTapes();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [currentSchemeIndex, setCurrentSchemeIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTapeSelector, setShowTapeSelector] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isSideB, setIsSideB] = useState(false);
  
  const leftReelRotation = useRef(new Animated.Value(0)).current;
  const rightReelRotation = useRef(new Animated.Value(0)).current;
  const rotationAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const flipRotation = useRef(new Animated.Value(0)).current;
  const starAnimations = useRef<Animated.CompositeAnimation[]>([]);
  const sparkleAnimations = useRef<Animated.CompositeAnimation[]>([]);

  const currentScheme = COLOR_SCHEMES[currentSchemeIndex];
  const tapeStyle = currentTape ? getTapeStyle(currentTape.styleId) : TAPE_STYLES[0];
  const isStarryNight = currentScheme.name === 'Starry Night';
  const isDiscoBall = currentScheme.name === 'Disco Ball Gold' || currentScheme.name === 'Disco Ball Silver';
  const isPastelMode = currentScheme.name.includes('Pastel');

  useEffect(() => {
    if (isPlaying && !isRewinding && !isFastForwarding) {
      startReelAnimation('play');
    } else if (isRewinding) {
      startReelAnimation('rewind');
    } else if (isFastForwarding) {
      startReelAnimation('fastforward');
    } else {
      stopReelAnimation();
    }
  }, [isPlaying, isRewinding, isFastForwarding]);

  useEffect(() => {
    if (isPlaying && !isRewinding && !isFastForwarding) {
      startReelAnimation('play');
    } else if (isRewinding) {
      startReelAnimation('rewind');
    } else if (isFastForwarding) {
      startReelAnimation('fastforward');
    }
  }, [isLandscape]);

  useEffect(() => {
    if (isStarryNight) {
      const newStars = generateStars(100, width, height);
      setStars(newStars);

      starAnimations.current.forEach(anim => anim.stop());
      starAnimations.current = [];

      newStars.forEach((star) => {
        const twinkle = Animated.loop(
          Animated.sequence([
            Animated.timing(star.opacity, {
              toValue: 1,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(star.opacity, {
              toValue: 0.2,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        );
        setTimeout(() => twinkle.start(), star.twinkleDelay);
        starAnimations.current.push(twinkle);
      });
    } else {
      starAnimations.current.forEach(anim => anim.stop());
      starAnimations.current = [];
      setStars([]);
    }

    return () => {
      starAnimations.current.forEach(anim => anim.stop());
      starAnimations.current = [];
    };
  }, [isStarryNight, width, height]);

  useEffect(() => {
    if (isDiscoBall) {
      const newSparkles = generateSparkles(30, width, height);
      setSparkles(newSparkles);

      sparkleAnimations.current.forEach(anim => anim.stop());
      sparkleAnimations.current = [];

      newSparkles.forEach((sparkle) => {
        const sparkleAnim = Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(sparkle.opacity, {
                toValue: 1,
                duration: 300 + Math.random() * 500,
                useNativeDriver: true,
              }),
              Animated.timing(sparkle.opacity, {
                toValue: 0,
                duration: 300 + Math.random() * 500,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(sparkle.scale, {
                toValue: 1.2,
                duration: 300 + Math.random() * 500,
                useNativeDriver: true,
              }),
              Animated.timing(sparkle.scale, {
                toValue: 0.5,
                duration: 300 + Math.random() * 500,
                useNativeDriver: true,
              }),
            ]),
          ])
        );
        sparkleAnim.start();
        sparkleAnimations.current.push(sparkleAnim);
      });
    } else {
      sparkleAnimations.current.forEach(anim => anim.stop());
      sparkleAnimations.current = [];
      setSparkles([]);
    }

    return () => {
      sparkleAnimations.current.forEach(anim => anim.stop());
      sparkleAnimations.current = [];
    };
  }, [isDiscoBall, width, height]);

  const startReelAnimation = (direction: 'play' | 'rewind' | 'fastforward' = 'play') => {
    stopReelAnimation();
    
    const baseDuration = direction === 'fastforward' ? 600 : direction === 'rewind' ? 800 : 1500;
    const leftDuration = direction === 'rewind' ? baseDuration * 0.6 : baseDuration;
    const rightDuration = direction === 'rewind' ? baseDuration : baseDuration * 0.7;
    const leftValue = direction === 'rewind' ? -1 : 1;
    const rightValue = direction === 'rewind' ? -1 : 1;
    
    leftReelRotation.setValue(0);
    rightReelRotation.setValue(0);
    
    const leftAnimation = Animated.loop(
      Animated.timing(leftReelRotation, {
        toValue: leftValue,
        duration: leftDuration,
        useNativeDriver: true,
        easing: (t) => t,
      }),
      { iterations: -1, resetBeforeIteration: true }
    );
    
    const rightAnimation = Animated.loop(
      Animated.timing(rightReelRotation, {
        toValue: rightValue,
        duration: rightDuration,
        useNativeDriver: true,
        easing: (t) => t,
      }),
      { iterations: -1, resetBeforeIteration: true }
    );
    
    const animation = Animated.parallel([leftAnimation, rightAnimation]);
    rotationAnimation.current = animation;
    animation.start();
  };

  const stopReelAnimation = () => {
    if (rotationAnimation.current) {
      rotationAnimation.current.stop();
      rotationAnimation.current = null;
    }
    leftReelRotation.stopAnimation();
    rightReelRotation.stopAnimation();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePlay = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    animateButtonPress();
    
    setIsRewinding(false);
    setIsFastForwarding(false);
    setIsPlaying(true);
  };

  const handlePause = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    animateButtonPress();
    
    setIsRewinding(false);
    setIsFastForwarding(false);
    setIsPlaying(false);
  };

  const handleStop = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    animateButtonPress();
    
    setIsRewinding(false);
    setIsFastForwarding(false);
    setIsPlaying(false);
  };

  const handleRewind = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    animateButtonPress();
    
    setIsPlaying(false);
    setIsFastForwarding(false);
    setIsRewinding(true);
    
    setTimeout(() => {
      setIsRewinding(false);
    }, 2000);
  };

  const handleFastForward = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    animateButtonPress();
    
    setIsPlaying(false);
    setIsRewinding(false);
    setIsFastForwarding(true);
    
    setTimeout(() => {
      setIsFastForwarding(false);
    }, 2000);
  };

  const handleFlipTape = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Animated.sequence([
      Animated.timing(flipRotation, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flipRotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      flipRotation.setValue(0);
    });
    
    setTimeout(() => {
      setIsSideB(!isSideB);
    }, 300);
  };

  const handleColorSchemeChange = (index: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentSchemeIndex(index);
    setShowColorPicker(false);
  };

  const leftReelSpin = leftReelRotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-360deg", "0deg", "360deg"],
  });

  const rightReelSpin = rightReelRotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-360deg", "0deg", "360deg"],
  });

  const flipInterpolate = flipRotation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });

  const flipOpacity = flipRotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.5, 0, 0.5, 1],
  });

  const landscapeCassetteWidth = Math.min(width * 0.85, height * 1.2);
  const landscapeCassetteHeight = landscapeCassetteWidth * 0.62;

  if (isLandscape) {
    return (
      <LinearGradient
        colors={currentScheme.background as [string, string, ...string[]]}
        style={styles.container}
      >
        {isStarryNight && stars.map((star) => (
          <Animated.View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              },
            ]}
          />
        ))}
        {isDiscoBall && sparkles.map((sparkle) => (
          <Animated.View
            key={sparkle.id}
            style={[
              styles.sparkle,
              {
                left: sparkle.x,
                top: sparkle.y,
                opacity: sparkle.opacity,
                transform: [{ scale: sparkle.scale }],
                backgroundColor: currentScheme.accent,
                shadowColor: currentScheme.accent,
              },
            ]}
          />
        ))}
        <SafeAreaView style={styles.landscapeContainer}>
          <View style={styles.landscapeContent}>
            <View style={[styles.cassette, { width: landscapeCassetteWidth, height: landscapeCassetteHeight, elevation: 20, shadowOpacity: 0.7 }]}>
              <LinearGradient
                colors={tapeStyle.cassetteBody as [string, string, ...string[]]}
                style={styles.cassetteBody}
              >
                <View style={styles.labelArea}>
                  <View style={[styles.labelStripe, { backgroundColor: tapeStyle.labelStripe }]} />
                  
                  {isSideB ? (
                    <>
                      <View style={styles.sideLabelBox}>
                        <Text style={styles.sideLabelBoxText}>B</Text>
                      </View>
                      <View style={{ height: 8 }} />
                      {currentTape?.playlistUrl ? (
                        <TouchableOpacity onPress={() => Linking.openURL(currentTape.playlistUrl!)} activeOpacity={0.7} style={{ marginTop: 4 }}>
                          <Text style={[styles.playlistUrl, { fontSize: 7 }]} numberOfLines={2} ellipsizeMode="tail">
                            {currentTape.playlistUrl}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={{ height: 12 }} />
                      )}
                      <View style={{ height: 8 }} />
                    </>
                  ) : (
                    currentTape ? (
                      <>
                        <View style={styles.sideLabelBox}>
                          <Text style={styles.sideLabelBoxText}>A</Text>
                        </View>
                        <Text style={[
                          styles.labelTitle,
                          { fontSize: 18 },
                          { fontFamily: getFontFamily(currentTape.font) },
                          (currentTape.font === 'bold' || (currentTape.font.endsWith('-bold') && currentTape.font !== 'handwriting-bold')) && { fontWeight: '700' as const },
                          currentTape.font === 'handwriting-bold' && { fontWeight: '900' as const, fontSize: 19 }
                        ]} numberOfLines={1} ellipsizeMode="tail">
                          {currentTape.name}
                        </Text>
                        {currentTape.description && (
                          <Text style={[styles.labelDescription, { fontSize: 12 }]} numberOfLines={2} ellipsizeMode="tail">
                            {currentTape.description}
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        <View style={styles.sideLabelBox}>
                          <Text style={styles.sideLabelBoxText}>A</Text>
                        </View>
                        <Text style={[styles.labelTitle, { fontSize: 18, fontFamily: getFontFamily('default-bold'), fontWeight: '700' as const }]} numberOfLines={1} ellipsizeMode="tail">My Best Mix Tape &apos;85</Text>
                        <Text style={[styles.labelDescription, { fontSize: 12 }]} numberOfLines={2} ellipsizeMode="tail">weekend radio mix</Text>
                      </>
                    )
                  )}
                  
                  <View style={[styles.labelStripe, { backgroundColor: tapeStyle.labelStripe }]} />
                </View>

                <View style={[styles.tapeWindow, { height: landscapeCassetteHeight * 0.32 }]}>
                  <View style={[styles.reelContainer, { width: landscapeCassetteWidth * 0.18, height: landscapeCassetteWidth * 0.18 }]}>
                    <Animated.View
                      style={[
                        styles.reel,
                        { transform: [{ rotate: leftReelSpin }] },
                      ]}
                    >
                      <View style={[styles.reelCenter, { backgroundColor: currentScheme.accent }]} />
                      <View style={styles.reelSpoke1} />
                      <View style={styles.reelSpoke2} />
                    </Animated.View>
                  </View>

                  <View style={styles.tapeMiddle}>
                    <View style={[styles.tapeStrip, { height: 20 }]} />
                  </View>

                  <View style={[styles.reelContainer, { width: landscapeCassetteWidth * 0.18, height: landscapeCassetteWidth * 0.18 }]}>
                    <Animated.View
                      style={[
                        styles.reel,
                        { transform: [{ rotate: rightReelSpin }] },
                      ]}
                    >
                      <View style={[styles.reelCenter, { backgroundColor: currentScheme.accent }]} />
                      <View style={styles.reelSpoke1} />
                      <View style={styles.reelSpoke2} />
                    </Animated.View>
                  </View>
                </View>

                <View style={styles.bottomDetails}>
                  <View style={[styles.screw, { width: 18, height: 18 }]} />
                  <View style={[styles.typeIndicator, { backgroundColor: currentScheme.background[1] }]}>
                    <Text style={[styles.typeText, { color: currentScheme.accent, fontSize: 10 }]}>TYPE II</Text>
                  </View>
                  <View style={[styles.screw, { width: 18, height: 18 }]} />
                </View>
              </LinearGradient>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={currentScheme.background as [string, string, ...string[]]}
      style={styles.container}
    >
      {isStarryNight && stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
      {isDiscoBall && sparkles.map((sparkle) => (
        <Animated.View
          key={sparkle.id}
          style={[
            styles.sparkle,
            {
              left: sparkle.x,
              top: sparkle.y,
              opacity: sparkle.opacity,
              transform: [{ scale: sparkle.scale }],
              backgroundColor: currentScheme.accent,
              shadowColor: currentScheme.accent,
            },
          ]}
        />
      ))}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: currentScheme.text }]}>AIR CASSETTE &apos;85</Text>
          </View>
          
          {showColorPicker && (
            <View style={styles.colorPicker}>
              <Text style={[styles.colorPickerTitle, { color: currentScheme.text }]}>Choose Color Scheme</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent} nestedScrollEnabled>
                {COLOR_SCHEMES.map((scheme, index) => (
                  <TouchableOpacity
                    key={scheme.name}
                    style={[
                      styles.colorOption,
                      {
                        borderColor: index === currentSchemeIndex ? currentScheme.accent : 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      },
                    ]}
                    onPress={() => handleColorSchemeChange(index)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={scheme.background as [string, string, ...string[]]}
                      style={styles.colorPreview}
                    >
                      <View style={[styles.colorPreviewInner, { backgroundColor: scheme.cassetteBody[0] }]} />
                    </LinearGradient>
                    <Text style={[styles.colorName, { color: currentScheme.text }]}>{scheme.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.cassetteContainer}>
            <Animated.View
              style={[
                styles.cassette,
                {
                  transform: [{ rotateY: flipInterpolate }],
                  opacity: flipOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={tapeStyle.cassetteBody as [string, string, ...string[]]}
                style={styles.cassetteBody}
              >
                <View style={styles.labelArea}>
                  <View style={[styles.labelStripe, { backgroundColor: tapeStyle.labelStripe }]} />
                  
                  {isSideB ? (
                    <>
                      <View style={styles.sideLabelBox}>
                        <Text style={styles.sideLabelBoxText}>B</Text>
                      </View>
                      <View style={{ height: 8 }} />
                      {currentTape?.playlistUrl ? (
                        <TouchableOpacity onPress={() => Linking.openURL(currentTape.playlistUrl!)} activeOpacity={0.7} style={{ marginTop: 2 }}>
                          <Text style={[styles.playlistUrl]} numberOfLines={2} ellipsizeMode="tail">
                            {currentTape.playlistUrl}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={{ height: 12 }} />
                      )}
                      <View style={{ height: 8 }} />
                    </>
                  ) : (
                    currentTape ? (
                      <>
                        <View style={styles.sideLabelBox}>
                          <Text style={styles.sideLabelBoxText}>A</Text>
                        </View>
                        <Text style={[
                          styles.labelTitle,
                          { fontFamily: getFontFamily(currentTape.font) },
                          (currentTape.font === 'bold' || (currentTape.font.endsWith('-bold') && currentTape.font !== 'handwriting-bold')) && { fontWeight: '700' as const },
                          currentTape.font === 'handwriting-bold' && { fontWeight: '900' as const, fontSize: 16 }
                        ]}>
                          {currentTape.name}
                        </Text>
                        {currentTape.description && (
                          <Text style={styles.labelDescription} numberOfLines={2}>
                            {currentTape.description}
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        <View style={styles.sideLabelBox}>
                          <Text style={styles.sideLabelBoxText}>A</Text>
                        </View>
                        <Text style={[styles.labelTitle, { fontFamily: getFontFamily('default-bold'), fontWeight: '700' as const }]}>My Best Mix Tape &apos;85</Text>
                        <Text style={styles.labelDescription} numberOfLines={2}>weekend radio mix</Text>
                      </>
                    )
                  )}
                  
                  <View style={[styles.labelStripe, { backgroundColor: tapeStyle.labelStripe }]} />
                </View>

                <View style={styles.tapeWindow}>
                  <View style={styles.reelContainer}>
                    <Animated.View
                      style={[
                        styles.reel,
                        { transform: [{ rotate: leftReelSpin }] },
                      ]}
                    >
                      <View style={[styles.reelCenter, { backgroundColor: currentScheme.accent }]} />
                      <View style={styles.reelSpoke1} />
                      <View style={styles.reelSpoke2} />
                    </Animated.View>
                  </View>

                  <View style={styles.tapeMiddle}>
                    <View style={styles.tapeStrip} />
                  </View>

                  <View style={styles.reelContainer}>
                    <Animated.View
                      style={[
                        styles.reel,
                        { transform: [{ rotate: rightReelSpin }] },
                      ]}
                    >
                      <View style={[styles.reelCenter, { backgroundColor: currentScheme.accent }]} />
                      <View style={styles.reelSpoke1} />
                      <View style={styles.reelSpoke2} />
                    </Animated.View>
                  </View>
                </View>

                <View style={styles.bottomDetails}>
                  <View style={styles.screw} />
                  <View style={[styles.typeIndicator, { backgroundColor: currentScheme.background[1] }]}>
                    <Text style={[styles.typeText, { color: currentScheme.accent }]}>TYPE II</Text>
                  </View>
                  <View style={styles.screw} />
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
          
          <View style={styles.controlPanel}>
            <LinearGradient
              colors={currentScheme.controlPanel as [string, string, ...string[]]}
              style={styles.controlPanelGradient}
            >
              <Animated.View
                style={[
                  styles.controlButtons,
                  { transform: [{ scale: buttonScale }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleRewind}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonInner}>
                    <SkipBack size={24} color={currentScheme.accent} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, styles.playButton]}
                  onPress={isPlaying ? handlePause : handlePlay}
                  activeOpacity={0.8}
                >
                  <View style={[styles.buttonInner, styles.playButtonInner]}>
                    <Play size={28} color={currentScheme.accent} fill={currentScheme.accent} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleFastForward}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonInner}>
                    <FastForward size={24} color={currentScheme.accent} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleStop}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonInner}>
                    <Square size={22} color={currentScheme.accent} fill={currentScheme.accent} />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Text style={styles.brandText}>MUSIC PLAYER</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.bottomMenu}>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: currentScheme.accent },
                isPastelMode && styles.menuButtonPastel
              ]}
              onPress={() => setShowTapeSelector(true)}
              activeOpacity={0.8}
            >
              <Plus size={24} color={isPastelMode ? '#2A2A2A' : currentScheme.background[0]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: currentScheme.accent },
                isPastelMode && styles.menuButtonPastel
              ]}
              onPress={() => router.push('/mixed-tapes')}
              activeOpacity={0.8}
            >
              <Layers size={24} color={isPastelMode ? '#2A2A2A' : currentScheme.background[0]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: currentScheme.accent },
                isPastelMode && styles.menuButtonPastel
              ]}
              onPress={handleFlipTape}
              activeOpacity={0.8}
            >
              <RotateCcw size={24} color={isPastelMode ? '#2A2A2A' : currentScheme.background[0]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: currentScheme.accent },
                isPastelMode && styles.menuButtonPastel
              ]}
              onPress={() => setShowColorPicker(!showColorPicker)}
              activeOpacity={0.8}
            >
              <Palette size={24} color={isPastelMode ? '#2A2A2A' : currentScheme.background[0]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: currentScheme.accent },
                isPastelMode && styles.menuButtonPastel
              ]}
              onPress={() => router.push('/settings')}
              activeOpacity={0.8}
            >
              <Settings size={24} color={isPastelMode ? '#2A2A2A' : currentScheme.background[0]} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={showTapeSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTapeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Tape or Create New</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTapeSelector(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.createNewButton}
              onPress={() => {
                setShowTapeSelector(false);
                router.push('/mixed-tapes');
              }}
              activeOpacity={0.8}
            >
              <Plus size={24} color="#fff" />
              <Text style={styles.createNewText}>Create New Tape</Text>
            </TouchableOpacity>

            {tapes.filter(t => t.id !== 'default-tape-1985').length > 0 && (
              <ScrollView style={styles.tapeList} showsVerticalScrollIndicator={false}>
                <Text style={styles.tapeListTitle}>My Tape Stack ({tapes.filter(t => t.id !== 'default-tape-1985').length}/50)</Text>
                {tapes.filter(t => t.id !== 'default-tape-1985').map((tape) => {
                  const style = getTapeStyle(tape.styleId);
                  return (
                    <TouchableOpacity
                      key={tape.id}
                      style={styles.tapeItem}
                      onPress={() => {
                        selectTape(tape.id);
                        setShowTapeSelector(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={style.cassetteBody as [string, string, ...string[]]}
                        style={styles.tapeItemGradient}
                      >
                        <Text style={styles.tapeItemName}>{tape.name}</Text>
                        <Text style={styles.tapeItemTo}>To: {tape.to}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  landscapeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  landscapeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900" as const,
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textAlign: "center" as const,
  },
  colorPicker: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: '100%',
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  colorScrollContent: {
    paddingHorizontal: 10,
  },
  colorOption: {
    alignItems: "center",
    marginHorizontal: 8,
    borderWidth: 2,
    borderRadius: 12,
    padding: 8,
    minWidth: 80,
  },
  colorPreview: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  colorPreviewInner: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  colorName: {
    fontSize: 11,
    fontWeight: "bold" as const,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cassetteContainer: {
    width: CASSETTE_WIDTH,
    height: CASSETTE_HEIGHT,
    marginBottom: 20,
  },

  cassette: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cassetteBody: {
    flex: 1,
    padding: 15,
  },
  labelArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 10,
    justifyContent: "center",
  },
  labelStripe: {
    height: 2,
    marginVertical: 3,
  },
  labelTitle: {
    fontSize: 15,
    fontWeight: "bold" as const,
    color: "#000000",
    textAlign: "center",
    marginTop: 1,
    marginBottom: 2,
    paddingHorizontal: 4,
    flexShrink: 1,
  },
  toFromContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 0,
    marginBottom: 2,
    paddingHorizontal: 4,
    paddingLeft: 32,
  },
  toFromLabel: {
    fontSize: 11,
    color: "#000000",
    fontWeight: "600" as const,
    flexShrink: 1,
  },
  labelDescription: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    marginTop: 1,
    marginBottom: 1,
    paddingHorizontal: 4,
    lineHeight: 17,
    flexShrink: 1,
  },
  tapeWindow: {
    flexDirection: "row",
    height: CASSETTE_HEIGHT * 0.35,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 4,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  reelContainer: {
    width: CASSETTE_WIDTH * 0.22,
    height: CASSETTE_WIDTH * 0.22,
    alignItems: "center",
    justifyContent: "center",
  },
  reel: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#333",
  },
  reelCenter: {
    width: "30%",
    height: "30%",
    borderRadius: 100,
    position: "absolute",
  },
  reelSpoke1: {
    position: "absolute",
    width: "100%",
    height: 3,
    backgroundColor: "#333",
  },
  reelSpoke2: {
    position: "absolute",
    width: 3,
    height: "100%",
    backgroundColor: "#333",
  },
  tapeMiddle: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  tapeStrip: {
    height: 20,
    backgroundColor: "#2A1810",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1A0A00",
  },
  bottomDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  screw: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#999",
    borderWidth: 2,
    borderColor: "#666",
  },
  typeIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "bold" as const,
  },
  controlPanel: {
    width: CASSETTE_WIDTH,
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  controlPanelGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#444",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  buttonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonInner: {
    paddingLeft: 3,
  },
  brandText: {
    position: "absolute",
    bottom: 5,
    right: 15,
    fontSize: 10,
    color: "#999",
    fontWeight: "bold" as const,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: '#fff',
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  createNewText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  tapeList: {
    flex: 1,
  },
  tapeListTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#00d4ff',
    marginBottom: 15,
  },
  tapeItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tapeItemGradient: {
    padding: 16,
  },
  tapeItemName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#2C1810',
    marginBottom: 4,
  },
  tapeItemTo: {
    fontSize: 12,
    color: '#333',
  },
  bottomMenu: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 25,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  menuButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  star: {
    position: 'absolute' as const,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  sparkle: {
    position: 'absolute' as const,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  menuButtonPastel: {
    borderWidth: 4,
    borderColor: '#2A2A2A',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },

  sideLabel: {
    fontSize: 9,
    fontWeight: 'bold' as const,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  sideLabelBox: {
    position: 'absolute' as const,
    left: 4,
    top: 10,
    width: 24,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  sideLabelBoxText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
  },

  nriContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 2,
  },
  nriText: {
    fontSize: 8,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  checkboxes: {
    flexDirection: 'row',
    gap: 4,
  },
  checkbox: {
    width: 14,
    height: 10,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 5,
    color: '#333',
    fontWeight: 'bold' as const,
  },
  playlistUrl: {
    fontSize: 7,
    color: '#001a33',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      default: 'monospace'
    }),
    lineHeight: 10,
    textDecorationLine: 'underline' as const,
    fontWeight: '700' as const,
  },
});
