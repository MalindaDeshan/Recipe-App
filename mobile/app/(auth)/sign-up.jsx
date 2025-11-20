import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router'
import React, { Component, useState } from 'react'
import { Text, View } from 'react-native'

const SignupScreen = () => {

  const router = useRouter();
  const {isLoaded,signUp} = useSignUp();
  const [email,setEmail] = useState("");
  const [password,setPassword] =useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [pendingVerification , setPendingVerification] = useState(false);


    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )

}

export default SignupScreen;
