// app/(tabs)/index.tsx - Home tab screen
import TimesheetCard from '@/components/TimesheetCard';
import TimesheetSummary from '@/components/TimesheetSummary';
import { useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../redux/hooks';

interface TimesheetEntry {
  id: string;
  date: string;
  inTime: string;
  outTime: string;
  totalHours: string;
}
export default function HomeScreen() {
  const { isAuthenticated,user} = useAppSelector(state => state.auth)
  useEffect(() => {
    console.log("------>",user)
    if (isAuthenticated) {
      const backAction = () => {
        BackHandler.exitApp() // Exit the app
        return true // Prevent default back behavior
      }

      // Add event listener for hardware back press
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      )

      // Cleanup on unmount
      return () => backHandler.remove()
    }
  }, [isAuthenticated])
  const timesheetData: TimesheetEntry[] = [
    {
      id: '1',
      date: 'July 16th, 2022',
      inTime: '09:00 AM',
      outTime: '05:10 PM',
      totalHours: '08:10 total hrs',
    },
    {
      id: '2',
      date: 'July 15th, 2022',
      inTime: '08:00 AM',
      outTime: '04:00 PM',
      totalHours: '08:00 total Hrs',
    },
    // Add more entries as needed
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.greeting}>Good morning Bagus</Text>
        <Text style={styles.motivation}>Let's get to work!</Text>
        
        <TimesheetSummary
          todayHours="00:00Hrs"
          periodHours="45:56Hrs"
          payPeriod="Jul 01st - 31st, 2022"
          notification="Tomorrow will be the last day of this pay period. Please make sure your timesheet is completed"
        />
        
        {timesheetData.map((entry) => (
          <TimesheetCard
            key={entry.id}
            date={entry.date}
            inTime={entry.inTime}
            outTime={entry.outTime}
            totalHours={entry.totalHours}
            onPress={() => console.log('Pressed:', entry.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  motivation: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
});

