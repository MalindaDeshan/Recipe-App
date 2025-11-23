import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View,KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {Image} from "expo-image";
import {authStyles} from "../../assets/styles/auth.styles";
import { COLORS } from '../../constants/colors';

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    // FIXED VALIDATION BLOCK
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      // THIS IS OK NOW — FUNCTION IS ASYNC
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/home");
      } else {
        Alert.alert("Error", "Sign-in failed. Please try again.");
      }

    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Something in failed");
      console.error(JSON.stringify(error, null, 2)); // Log full error to console

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({
        ios: 64,
        android: 50,
      })}
      >

        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <View style={authStyles.imageContainer}>
            <Image 
              source={require("../../assets/images/app_icon.png")}
              style={authStyles.image}
              contentFit='contain'
            />
          </View>

          <Text style={authStyles.title}>Welcome!</Text>

          {/* Form Container */}
          <View style={authStyles.formContainer}>

            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color={COLORS.textLight} 
                />

              </TouchableOpacity>
            </View>

            {/* SIGN IN BUTTON */}
            <TouchableOpacity
                style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
            >
            <Text style={authStyles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
            </TouchableOpacity>

            {/*Sign Up Link*/}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={()=> router.push("/(auth)/sign-up")}
            >
              <Text style={authStyles.linkText}>
                Don&apos;t have an account?<Text style={authStyles.link}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;
