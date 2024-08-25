import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Image } from "react-native";
import {
  ANIMATION_DIRECTION,
  ANIMATION_TYPE,
  SkeletonLoader,
} from "./SkeletonLoader";
import { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //simulate API call
    setInterval(() => {
      setLoading((prevLoading) => !prevLoading);
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {loading ? (
          <>
            <View style={styles.row}>
              <SkeletonLoader
                style={{ marginRight: 20, borderRadius: 10 }}
                width={"70%"}
                height={50}
              />
              <SkeletonLoader
                style={{ borderRadius: 50 }}
                width={50}
                height={50}
              />
            </View>
            <SkeletonLoader
              width={"95%"}
              style={{ borderRadius: 10 }}
              height={100}
            />
          </>
        ) : (
          <>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "700",
                  marginRight: 20,
                  color: "black",
                }}
              >
                SkeletonLoader
              </Text>
              <Image
                style={{ height: 50, width: 50, borderRadius: 25 }}
                source={{
                  uri: "https://seeklogo.com/images/E/expo-go-app-logo-BBBE394CB8-seeklogo.com.png",
                }}
              />
            </View>
            <Text style={{ fontSize: 15, color: "black" }}>
              Expo is a free and open-source platform for building apps with
              React Native. It simplifies the development process by providing
              tools, libraries, and services to streamline the creation of
              cross-platform applications for iOS, Android, and web using a
              single codebase.
            </Text>
          </>
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  box: {
    width: "80%",
    height: 500,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
