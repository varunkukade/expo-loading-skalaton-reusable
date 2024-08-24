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
  const isXDirectionAnimation =
    direction === ANIMATION_DIRECTION.leftToRight ||
    direction === ANIMATION_DIRECTION.rightToLeft;

  const isYDirectionAnimation =
    direction === ANIMATION_DIRECTION.topToBottom ||
    direction === ANIMATION_DIRECTION.bottomToTop;

  //to move the gradient view across x direction
  const translatex = useSharedValue(0);

  //to move the gradient view across y direction
  const translatey = useSharedValue(0);

  //track dimensions of child (gradient view) for deciding movable boundaries
  const [gradientDimensions, setGradientDimensions] = useState({
    height: -1,
    width: -1,
  });

  //track dimensions of parent view (parent of gradient view) for deciding movable boundaries
  const [parentDimensions, setParentDimensions] = useState({
    height: -1,
    width: -1,
  });

  //to toggle between different direction of move
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

  const animatedStyleX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translatex.value,
        },
      ],
    };
  });

  const animatedStyleY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translatey.value,
        },
      ],
    };
  });

  const animateAcrossXDirection = () => {
    /*
    We need overflowOffset because we start moving animation little bit before actual start
    Also we end moving animation little bit after actual end.
    We hide those overflowed views using overflow: "hidden" style on parent view
    */
    const overflowOffset = parentDimensions.width * 0.75;

    /*
    In case of leftToRight direction, we start animation from leftMostEnd
    In case of rightToLeft direction, we stop animation at leftMostEnd
    */
    const leftMostEnd = -overflowOffset;

    /*
    In case of leftToRight direction, we stop animation at rightMostEnd
    In case of rightToLeft direction, we start animation at rightMostEnd
    We subtract gradientDimensions.width because animation should end (in case of leftToRight)/start(in case of rightToLeft) 
     when leftmost end of gradient view touches the right most end of parent view
    */
    const rightMostEnd =
      parentDimensions.width - gradientDimensions.width + overflowOffset;
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
          800, // Delay before the next iteration of animation starts
          withTiming(0, {
            duration: 0,
          })
        )
      ),
      -1, // Repeat inifinite times
      false // Do not reverse the animation
    );
  };

  const animateAcrossYDirection = () => {
    /*
    We need overflowOffset because we start moving animation little bit before actual start
    Also we end moving animation little bit after actual end.
    We hide those overflowed views using overflow: "hidden" style on parent view
    */
    const overflowOffset = parentDimensions.height * 0.75;

    /*
    In case of topToBottom direction, we start animation from topMostEnd
    In case of bottomToTop direction, we stop animation at topMostEnd
    */
    const topMostEnd = -overflowOffset;

    /*
    In case of topToBottom direction, we stop animation at bottomMostEnd
    In case of bottomToTop direction, we start animation at bottomMostEnd
    We subtract gradientDimensions.height because animation should end (in case of topToBottom)/start(in case of bottomToTop) 
     when topmost end of gradient view touches the bottom most end of parent view
    */
    const bottomMostEnd =
      parentDimensions.height - gradientDimensions.height + overflowOffset;
    translatey.value =
      direction === ANIMATION_DIRECTION.topToBottom
        ? topMostEnd
        : bottomMostEnd;
    translatey.value = withRepeat(
      withSequence(
        withTiming(
          direction === ANIMATION_DIRECTION.topToBottom
            ? bottomMostEnd
            : topMostEnd,
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
  };

  useEffect(() => {
    if (
      parentDimensions.height !== -1 &&
      parentDimensions.width !== -1 &&
      gradientDimensions.height !== -1 &&
      gradientDimensions.width !== -1 &&
      direction
    ) {
      if (isXDirectionAnimation) {
        animateAcrossXDirection();
      } else {
        animateAcrossYDirection();
      }
    }
  }, [parentDimensions, gradientDimensions, direction, isXDirectionAnimation]);

  return (
    <View
      onLayout={(event) => {
        if (parentDimensions.height === -1 && parentDimensions.width === -1) {
          setParentDimensions({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          });
        }
      }}
      style={[styles.itemParent, { height, width, backgroundColor }, style]}
    >
      <Animated.View
        onLayout={(event) => {
          if (
            gradientDimensions.width === -1 &&
            gradientDimensions.height === -1
          ) {
            setGradientDimensions({
              width: event.nativeEvent.layout.width,
              height: event.nativeEvent.layout.height,
            });
          }
        }}
        style={[
          styles.gradientParent,
          isXDirectionAnimation && animatedStyleX,
          isXDirectionAnimation && { height: "100%", width: "80%" },
          isYDirectionAnimation && animatedStyleY,
          isYDirectionAnimation && { height: "80%", width: "100%" },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.1)",
            "rgba(255,255,255,0.4)",
            "rgba(255,255,255,0.6)",
            "rgba(255,255,255,0.7)",
            "rgba(255,255,255,0.6)",
            "rgba(255,255,255,0.4)",
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
