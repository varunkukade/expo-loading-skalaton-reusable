import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Image } from "react-native";
import { ANIMATION_DIRECTION, SkalatonLoader } from "./SkalatonLoader";
import { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {loading ? (
          <>
            <View style={styles.row}>
              <SkalatonLoader
                style={{ marginRight: 20 }}
                width={"70%"}
                height={50}
                direction={ANIMATION_DIRECTION.leftToRight}
              />
              <SkalatonLoader
                style={{ borderRadius: 50 }}
                width={50}
                height={50}
                direction={ANIMATION_DIRECTION.leftToRight}
              />
            </View>
            <SkalatonLoader
              direction={ANIMATION_DIRECTION.leftToRight}
              width={"95%"}
              height={100}
            />
          </>
        ) : (
          <>
            <View style={styles.row}>
              <Text
                style={{ fontSize: 25, fontWeight: "700", marginRight: 20 }}
              >
                SkalatonLoader
              </Text>
              <Image
                style={{ height: 50, width: 50, borderRadius: 25 }}
                source={{
                  uri: "https://seeklogo.com/images/E/expo-go-app-logo-BBBE394CB8-seeklogo.com.png",
                }}
              />
            </View>
            <Text style={{ fontSize: 15 }}>
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
    zIndex: 101,
    paddingHorizontal: 24,
  },
});
