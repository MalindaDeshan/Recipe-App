import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router'
import React, { Component, useState } from 'react'
import { Alert, Text, View } from 'react-native'

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

    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )

}

export default SignupScreen;
