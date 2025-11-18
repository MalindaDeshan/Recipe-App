import { Slot, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{headerShown : false}} />
      </SafeAreaView>
    </ClerkProvider>
    
  );
}
