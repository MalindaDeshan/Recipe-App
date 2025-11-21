import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router'
import React, { Component, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authStyles } from '../../assets/styles/auth.styles';

import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import VerifyEmail from './verify-email';

const SignupScreen = () => {

  const router = useRouter();
  const {isLoaded,signUp} = useSignUp();
  const [email,setEmail] = useState("");
  const [password,setPassword] =useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [pendingVerification , setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error","Please fill in all fields");
    if (password.length<6) return Alert.alert("Error","Password must be at least 6 characters");

    if(!isLoaded) return;

    setLoading(true)

    try {
      await signUp.create({emailAddress:email,password})

      await signUp.prepareEmailAddressVerification({strategy: "email_code"})

      setPendingVerification(true)

    } catch (error) {
      Alert.alert("Error",error.errors?.[0]?.message || "Failed to create account");
      console.error(JSON.stringify(error,null,2));
    } finally {
      setLoading(false)
    }

  };

    if (pendingVerification) 
      return <VerifyEmail email={email} onBack ={() => setPendingVerification(false)}/>;

    return (
      <View style={authStyles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.os === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({
                  ios: 64,
                  android: 50,
                })}
          style={authStyles.keyboardView}
        >

          <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsHorizontalScrollIndicator={false}
          >
            <View style={authStyles.imageContainer}>
                        <Image 
                          source={require("../../assets/images/i2.png")}
                          style={authStyles.image}
                          contentFit='contain'
                        />
                      </View>
            <Text style={authStyles.title}>Create Account</Text>

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

              {/* SIGN UP BUTTON */}
              <TouchableOpacity
                  style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                  onPress={handleSignUp}
                  disabled={loading}
                  activeOpacity={0.8}
              >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
              </TouchableOpacity>

              {/*Sign Up Link*/}
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={()=> router.back()}
              >
                <Text style={authStyles.linkText}>
                  Already have an account?<Text style={authStyles.link}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
       
      </View>
    )

}

export default SignupScreen;
