// TimesheetSummary.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimesheetSummaryProps {
  todayHours: string;
  periodHours: string;
  payPeriod: string;
  notification?: string;
}

const TimesheetSummary: React.FC<TimesheetSummaryProps> = ({
  todayHours,
  periodHours,
  payPeriod,
  notification,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Clock In</Text>
      <Text style={styles.subHeader}>Total working hour</Text>
      
      <View style={styles.hoursContainer}>
        <View style={styles.hourBlock}>
          <Text style={styles.hourLabel}>Today</Text>
          <Text style={styles.hourValue}>{todayHours}</Text>
        </View>
        <View style={styles.hourBlock}>
          <Text style={styles.hourLabel}>This pay period</Text>
          <Text style={styles.hourValue}>{periodHours}</Text>
        </View>
      </View>
      
      <Text style={styles.payPeriodLabel}>Current pay period</Text>
      <Text style={styles.payPeriod}>{payPeriod}</Text>
      
      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#555',
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hourBlock: {
    alignItems: 'center',
  },
  hourLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hourValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  payPeriodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  payPeriod: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  notificationContainer: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 6,
  },
  notificationText: {
    fontSize: 14,
    color: '#E6A700',
  },
});

export default TimesheetSummary;