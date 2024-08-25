import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import Animated, {
  cancelAnimation,
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

export enum ANIMATION_TYPE {
  shiver = "shiver",
  pulse = "pulse",
}

export const SkeletonLoader = ({
  height,
  width,
  style = {},
  backgroundColor = "#DDEAF5",
  direction = ANIMATION_DIRECTION.leftToRight,
  animationType = ANIMATION_TYPE.shiver,
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

  //to create pulse animation by increasing and decreasing opacity of parent
  const opacity = useSharedValue(1);

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
    return () => {
      //cancel running animations after component unmounts
      cancelAnimation(translatex);
      cancelAnimation(translatey);
      cancelAnimation(opacity);
    };
  }, []);

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

  const animatedStyleParent = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animateAcrossXDirection = () => {
    /*
    We need overflowOffset because we start moving animation little bit before actual start
    Also we end moving animation little bit after actual end.
    We hide those overflowed views using overflow: "hidden" on parent view
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
      withDelay(
        800, //Delay before the next iteration of animation starts
        withTiming(
          direction === ANIMATION_DIRECTION.leftToRight
            ? rightMostEnd
            : leftMostEnd,
          {
            duration: 500,
            easing: Easing.linear,
          }
        )
      ),
      -1
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

  useEffect(() => {
    if (animationType !== ANIMATION_TYPE.pulse) {
      return;
    }
    //create pulse effect by repeating opacity animation
    opacity.value = withRepeat(
      withTiming(0.4, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  return (
    <Animated.View
      onLayout={(event) => {
        if (
          parentDimensions.height === -1 &&
          parentDimensions.width === -1 &&
          animationType === ANIMATION_TYPE.shiver
        ) {
          //only in case of shiver animation, find out the width and height of parent view.
          setParentDimensions({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          });
        }
      }}
      style={[
        styles.itemParent,
        { height, width, backgroundColor },
        style,
        animatedStyleParent,
      ]}
    >
      {animationType === ANIMATION_TYPE.shiver ? (
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
            isXDirectionAnimation && animatedStyleX,
            isXDirectionAnimation && {
              height: "100%",
              width: "80%",
            },
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
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemParent: {
    overflow: "hidden",
  },
  background: {
    height: "100%",
    width: "100%",
  },
});
