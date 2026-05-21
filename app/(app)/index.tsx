import { View, Text, StyleSheet } from 'react-native'

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>PetMeds</Text>
            <Text style={styles.subtitle}>Welcome</Text>
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  }
})