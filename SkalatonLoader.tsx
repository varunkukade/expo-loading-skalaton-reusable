import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export enum ANIMATION_DIRECTION {
  leftToRight = "leftToRight",
  rightToLeft = "rightToLeft",
  topToBottom = "topToBottom",
  bottomToTop = "bottomToTop",
}

export const SkalatonLoader = ({
  height,
  width,
  style = {},
  backgroundColor = "#F0F8FF",
  direction = ANIMATION_DIRECTION.leftToRight,
}) => {
  const translatex = useSharedValue(0);

  const [gradientWidth, setGradientWidth] = useState(-1);
  const [parentWidth, setParentWidth] = useState(-1);

  const [coordinates, setCoordinates] = useState({
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  });

  useEffect(() => {
    if (!direction) return;
    switch (direction) {
      case ANIMATION_DIRECTION.leftToRight:
        setCoordinates({
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        });
        break;
      case ANIMATION_DIRECTION.rightToLeft:
        setCoordinates({
          start: { x: 1, y: 0 },
          end: { x: 0, y: 0 },
        });
        break;
      case ANIMATION_DIRECTION.topToBottom:
        setCoordinates({
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        });
        break;
      case ANIMATION_DIRECTION.bottomToTop:
        setCoordinates({
          start: { x: 0, y: 1 },
          end: { x: 0, y: 0 },
        });
        break;
      default:
        break;
    }
  }, [direction]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translatex.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (parentWidth !== -1 && gradientWidth !== -1 && direction) {
      const leftMostEnd = -(parentWidth * 0.75);
      const rightMostEnd = parentWidth - gradientWidth + parentWidth * 0.75;
      translatex.value =
        direction === ANIMATION_DIRECTION.leftToRight
          ? leftMostEnd
          : rightMostEnd;
      translatex.value = withRepeat(
        withSequence(
          withTiming(
            direction === ANIMATION_DIRECTION.leftToRight
              ? rightMostEnd
              : leftMostEnd,
            {
              duration: 500,
              easing: Easing.linear,
            }
          ),
          withDelay(
            800, // Delay before the animation restarts
            withTiming(0, {
              duration: 0,
            })
          )
        ),
        -1, // Repeat indefinitely
        false // Do not reverse
      );
    }
  }, [parentWidth, gradientWidth, direction]);

  return (
    <View
      onLayout={(event) => {
        if (parentWidth === -1) {
          setParentWidth(event.nativeEvent.layout.width);
        }
      }}
      style={[styles.itemParent, { height, width, backgroundColor }, style]}
    >
      <Animated.View
        onLayout={(event) => {
          if (gradientWidth === -1) {
            setGradientWidth(event.nativeEvent.layout.width);
          }
        }}
        style={[
          styles.gradientParent,
          animatedStyle,
          { height: "100%", width: "70%" },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.1)",
            "rgba(255,255,255,0.6)",
            "rgba(255,255,255,0.7)",
            "rgba(255,255,255,0.6)",
            "rgba(255,255,255,0.1)",
            "rgba(255,255,255,0)",
          ]}
          style={styles.background}
          start={coordinates.start}
          end={coordinates.end}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemParent: {
    height: 100,
    width: "85%",
    zIndex: 1000,
    overflow: "hidden",
  },
  gradientParent: {
    zIndex: 100,
  },
  background: {
    height: "100%",
    width: "100%",
    zIndex: 100,
  },
});
