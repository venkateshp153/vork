//app/tabs/cart.tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {}

const ListScreen = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>List Screen</Text>
    </View>
  )
}

export default ListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})