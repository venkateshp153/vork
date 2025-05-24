// TimesheetCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimesheetCardProps {
  date: string;
  inTime: string;
  outTime: string;
  totalHours: string;
  onPress?: () => void;
}

const TimesheetCard: React.FC<TimesheetCardProps> = ({
  date,
  inTime,
  outTime,
  totalHours,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{inTime} — {outTime}</Text>
        <Text style={styles.totalHoursText}>{totalHours}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  totalHoursText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TimesheetCard;