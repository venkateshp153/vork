import { format, isSameDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

// Types
type ScheduleItem = {
  id: string;
  date: Date;
  openingTime: Date;
  closingTime: Date;
  employeeName: string;
  notes?: string;
  submittedList: boolean;
};

type EmployeeWorkRecord = {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  submitted: boolean;
};

type CalendarViewProps = {
  currentDate: Date;
  onDatePress: (date: Date) => void;
  schedules: ScheduleItem[];
  onMonthChange: (date: Date) => void;
  onYearPress: () => void;
};

type ScheduleModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onSave: (schedule: Omit<ScheduleItem, 'id'>) => void;
  workRecords?: EmployeeWorkRecord[];
};

type YearSelectorProps = {
  visible: boolean;
  currentYear: number;
  onSelect: (year: number) => void;
  onClose: () => void;
};

// Constants
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i);

// Year Selector Component
const YearSelector: React.FC<YearSelectorProps> = ({ visible, currentYear, onSelect, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.yearSelectorOverlay}>
        <View style={styles.yearSelectorContainer}>
          <Text style={styles.yearSelectorTitle}>Select Year</Text>
          <FlatList
            data={YEARS}
            keyExtractor={(item) => item.toString()}
            numColumns={3}
            contentContainerStyle={styles.yearList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.yearButton,
                  item === currentYear && styles.selectedYearButton
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.yearButtonText,
                  item === currentYear && styles.selectedYearButtonText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.yearSelectorClose}>
            <Text style={styles.yearSelectorCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Calendar View Component
const CalendarView: React.FC<CalendarViewProps> = ({ 
  currentDate, 
  onDatePress, 
  schedules, 
  onMonthChange,
  onYearPress 
}) => {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = [];
  
  for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
    daysInMonth.push(new Date(d));
  }

  // Add empty days at start if month doesn't begin on Sunday
  const startDay = monthStart.getDay();
  for (let i = 0; i < startDay; i++) {
    daysInMonth.unshift(null);
  }

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hasSchedule = (date: Date | null) => {
    if (!date) return false;
    return schedules.some(schedule => isSameDay(schedule.date, date));
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.yearDisplay}>
        <TouchableOpacity onPress={onYearPress}>
          <Text style={styles.yearText}>{currentDate.getFullYear()}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{MONTHS[currentDate.getMonth()]}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.daysHeader}>
        {DAYS.map(day => (
          <Text key={day} style={styles.dayHeaderText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {daysInMonth.map((date, index) => {
          const dayHasSchedule = hasSchedule(date);
          
          return date ? (
            <TouchableOpacity 
              key={index}
              onPress={() => onDatePress(date)}
              style={[
                styles.dayButton,
                dayHasSchedule && styles.dayWithSchedule,
                isSameDay(date, new Date()) && styles.currentDay
              ]}
            >
              <Text style={[
                styles.dayText,
                dayHasSchedule && styles.dayWithScheduleText,
                isSameDay(date, new Date()) && styles.currentDayText
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ) : (
            <View key={index} style={styles.emptyDay} />
          );
        })}
      </View>
    </View>
  );
};

// Schedule Modal Component
const ScheduleModal: React.FC<ScheduleModalProps> = ({ 
  visible, 
  onClose, 
  selectedDate, 
  onSave,
  workRecords 
}) => {
  const [date, setDate] = useState(selectedDate || new Date());
  const [openingTime, setOpeningTime] = useState(new Date());
  const [closingTime, setClosingTime] = useState(new Date());
  const [employeeName, setEmployeeName] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedList, setSubmittedList] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [openingTimePickerOpen, setOpeningTimePickerOpen] = useState(false);
  const [closingTimePickerOpen, setClosingTimePickerOpen] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSave = () => {
    onSave({
      date,
      openingTime,
      closingTime,
      employeeName,
      notes,
      submittedList
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setDate(selectedDate || new Date());
    setOpeningTime(new Date());
    setClosingTime(new Date());
    setEmployeeName('');
    setNotes('');
    setSubmittedList(false);
  };

  const renderWorkRecord = ({ item }: { item: EmployeeWorkRecord }) => (
    <View style={styles.workRecord}>
      <Text style={styles.workRecordName}>{item.name}</Text>
      <Text style={styles.workRecordTime}>
        {format(item.startTime, 'HH:mm')} - {format(item.endTime, 'HH:mm')}
      </Text>
      <Text style={[
        styles.workRecordStatus,
        item.submitted ? styles.submitted : styles.notSubmitted
      ]}>
        {item.submitted ? 'Submitted' : 'Pending'}
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedDate ? 'Edit Schedule' : 'Add New Schedule'}
          </Text>
          
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setDatePickerOpen(true)}
          >
            <Text style={styles.datePickerButtonText}>
              Date: {format(date, 'MMMM d, yyyy')}
            </Text>
          </TouchableOpacity>
          
          <DatePicker
            modal
            open={datePickerOpen}
            date={date}
            mode="date"
            onConfirm={(selectedDate) => {
              setDatePickerOpen(false);
              setDate(selectedDate);
            }}
            onCancel={() => setDatePickerOpen(false)}
          />
          
          <Text style={styles.sectionTitle}>Working Hours</Text>
          
          <TouchableOpacity 
            style={styles.timePickerButton}
            onPress={() => setOpeningTimePickerOpen(true)}
          >
            <Text style={styles.timePickerButtonText}>
              Opening Time: {format(openingTime, 'HH:mm')}
            </Text>
          </TouchableOpacity>
          
          <DatePicker
            modal
            open={openingTimePickerOpen}
            date={openingTime}
            mode="time"
            onConfirm={(selectedTime) => {
              setOpeningTimePickerOpen(false);
              setOpeningTime(selectedTime);
            }}
            onCancel={() => setOpeningTimePickerOpen(false)}
          />
          
          <TouchableOpacity 
            style={styles.timePickerButton}
            onPress={() => setClosingTimePickerOpen(true)}
          >
            <Text style={styles.timePickerButtonText}>
              Closing Time: {format(closingTime, 'HH:mm')}
            </Text>
          </TouchableOpacity>
          
          <DatePicker
            modal
            open={closingTimePickerOpen}
            date={closingTime}
            mode="time"
            onConfirm={(selectedTime) => {
              setClosingTimePickerOpen(false);
              setClosingTime(selectedTime);
            }}
            onCancel={() => setClosingTimePickerOpen(false)}
          />
          
          <Text style={styles.inputLabel}>Employee Name</Text>
          <TextInput
            style={styles.input}
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder="Enter employee name"
          />
          
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            multiline
          />
          
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, submittedList && styles.checkboxChecked]}
              onPress={() => setSubmittedList(!submittedList)}
            >
              {submittedList && <Text style={styles.checkboxCheckmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>List submitted</Text>
          </View>
          
          {workRecords && workRecords.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Work History</Text>
              <FlatList
                data={workRecords}
                renderItem={renderWorkRecord}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => {
              resetForm();
              onClose();
            }} style={[styles.modalButton, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.modalButton, styles.saveButton]}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Main Schedule Screen
const ScheduleScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [yearSelectorVisible, setYearSelectorVisible] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    // Sample data
    {
      id: '1',
      date: new Date(),
      openingTime: new Date(new Date().setHours(9, 0, 0, 0)),
      closingTime: new Date(new Date().setHours(17, 0, 0, 0)),
      employeeName: 'John Doe',
      notes: 'Regular shift',
      submittedList: true
    }
  ]);
  
  const handleAddSchedule = () => {
    setSelectedDate(undefined);
    setModalVisible(true);
  };
  
  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };
  
  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setYearSelectorVisible(false);
  };
  
  const handleSaveSchedule = (newSchedule: Omit<ScheduleItem, 'id'>) => {
    const existingIndex = schedules.findIndex(s => isSameDay(s.date, newSchedule.date));
    
    if (existingIndex >= 0) {
      // Update existing schedule
      const updatedSchedules = [...schedules];
      updatedSchedules[existingIndex] = { ...newSchedule, id: schedules[existingIndex].id };
      setSchedules(updatedSchedules);
    } else {
      // Add new schedule
      setSchedules([...schedules, { ...newSchedule, id: Date.now().toString() }]);
    }
  };
  
  const getScheduleForDate = (date: Date) => {
    return schedules.find(s => isSameDay(s.date, date));
  };
  
  const getWorkRecordsForDate = (date: Date): EmployeeWorkRecord[] => {
    const schedule = getScheduleForDate(date);
    if (!schedule) return [];
    
    return [{
      id: schedule.id,
      name: schedule.employeeName,
      startTime: schedule.openingTime,
      endTime: schedule.closingTime,
      submitted: schedule.submittedList
    }];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <TouchableOpacity onPress={handleAddSchedule} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <CalendarView 
          currentDate={currentDate}
          onDatePress={handleDatePress}
          schedules={schedules}
          onMonthChange={handleMonthChange}
          onYearPress={() => setYearSelectorVisible(true)}
        />
        
        {selectedDate && getScheduleForDate(selectedDate) && (
          <View style={styles.scheduleDetails}>
            <Text style={styles.detailsTitle}>
              Schedule for {format(selectedDate, 'MMMM d, yyyy')}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Employee: </Text>
              {getScheduleForDate(selectedDate)?.employeeName}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hours: </Text>
              {format(getScheduleForDate(selectedDate)?.openingTime || new Date(), 'HH:mm')} - 
              {format(getScheduleForDate(selectedDate)?.closingTime || new Date(), 'HH:mm')}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status: </Text>
              <Text style={[
                styles.statusText,
                getScheduleForDate(selectedDate)?.submittedList ? styles.submitted : styles.notSubmitted
              ]}>
                {getScheduleForDate(selectedDate)?.submittedList ? 'List Submitted' : 'List Pending'}
              </Text>
            </Text>
            {getScheduleForDate(selectedDate)?.notes && (
              <Text style={styles.detailItem}>
                <Text style={styles.detailLabel}>Notes: </Text>
                {getScheduleForDate(selectedDate)?.notes}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      
      <ScheduleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedDate={selectedDate}
        onSave={handleSaveSchedule}
        workRecords={selectedDate ? getWorkRecordsForDate(selectedDate) : undefined}
      />
      
      <YearSelector
        visible={yearSelectorVisible}
        currentYear={currentDate.getFullYear()}
        onSelect={handleYearSelect}
        onClose={() => setYearSelectorVisible(false)}
      />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
  },
  calendarContainer: {
    padding: 16,
  },
  yearDisplay: {
    alignItems: 'center',
    marginBottom: 8,
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    padding: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowButton: {
    padding: 8,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayHeaderText: {
    width: '14%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  emptyDay: {
    width: '14%',
    aspectRatio: 1,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
  },
  dayWithSchedule: {
    backgroundColor: '#E3F2FD',
  },
  dayWithScheduleText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  currentDay: {
    backgroundColor: '#007AFF',
  },
  currentDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  timePickerButtonText: {
    fontSize: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxCheckmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scheduleDetails: {
    padding: 16,
    margin: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detailItem: {
    marginBottom: 8,
    fontSize: 16,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  statusText: {
    fontWeight: 'bold',
  },
  submitted: {
    color: 'green',
  },
  notSubmitted: {
    color: 'orange',
  },
  workRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workRecordName: {
    flex: 2,
    fontSize: 16,
  },
  workRecordTime: {
    flex: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  workRecordStatus: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  yearSelectorOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  yearSelectorContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  yearSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  yearList: {
    justifyContent: 'center',
  },
  yearButton: {
    width: '30%',
    padding: 12,
    margin: 4,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedYearButton: {
    backgroundColor: '#007AFF',
  },
  yearButtonText: {
    fontSize: 16,
  },
  selectedYearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  yearSelectorClose: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    alignItems: 'center',
  },
  yearSelectorCloseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ScheduleScreen;