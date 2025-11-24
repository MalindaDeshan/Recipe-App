import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { authStyles } from '../../assets/styles/auth.styles';

import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';

const VerifyEmail = ({email,onBack}) => {

  const {isLoaded,signUp,setActive}=useSignUp();
  const [code,setCode]= useState("");
  const [loading,setLoading] =useState(false);

  const handleVerification = async () => {
    if(!isLoaded) return;

    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({code})

      if(signUpAttempt.status === "complete"){
        await setActive({session:signUpAttempt.createdSessionId})
      } else{
        Alert.alert("Error","Verification failed.Please try again.");
        console.error(JSON.stringify(signUpAttempt,null,2));
      }
    
    } catch (error) {

      Alert.alert("Error",error.errors?.[0]?.message || "Verification failed");
      console.error(JSON.stringify(error,null,2));
      
    } finally {

      setLoading(false)
    }
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS==="ios" ? "padding" : "height"}
        style = {authStyles.keyboardView}
        keyboardVerticalOffset={Platform.select({
                          ios: 64,
                          android: 50,
                        })}
      >
        <ScrollView
          contentContainerStyle = {authStyles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          
          {/*Image Container*/}
          <View
            style={authStyles.imageContainer}
          >
            <Image
              source = {require("../../assets/images/app_icon.png")}
              style= {authStyles.image}
              contentFit="contain"
            />

          </View>

          {/*Title*/}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

          <View style={authStyles.formContainer}>
            {/*Verification code input*/}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter verification code'
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType='number-pad'
                autoCapitalize='none'
              />

            </View>
            {/*Verifu Button*/}
            <TouchableOpacity
              style={[authStyles.authButton,loading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>

            {/*Back to sign up*/}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={onBack}
            >
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmail
