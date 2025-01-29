import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';

export const PayHours = () => {
    const headers = ['Name', 'Id','Position','Date', 'In-Time', 'Out-Time','Hours'];

    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [currentColumn, setCurrentColumn] = useState(null);
    const [currentValue, setCurrentValue] = useState(new Date());
    const [clockIn, setClockIn] = useState(false);
    const [clockData, setClockData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const name = "Leah";
    const id = "E101";

    // Fetch data based on name and id
    function fetchData() {
        fetch(`https://sheetdb.io/api/v1/mm8jpgiaq7bqt/search?name=${name}&id=${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(JSON.stringify(data));
                setData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setHasError(true);
                setIsLoading(false);
            });
    }

    // Function to parse time (e.g., "09:00 AM")
    const parseTime = (time) => {
        const [hours, minutes, period] = time.match(/(\d+):(\d+)\s?(AM|PM)/i).slice(1);
        let hrs = parseInt(hours, 10);
        const mins = parseInt(minutes, 10);
        if (period.toUpperCase() === 'PM' && hrs !== 12) hrs += 12;
        if (period.toUpperCase() === 'AM' && hrs === 12) hrs = 0;
        return hrs * 60 + mins;
    };

    const calculateHours = (inTime, outTime) => {
        const inMinutes = parseTime(inTime);
        const outMinutes = parseTime(outTime);
        const diff = (outMinutes - inMinutes) / 60;
        return diff > 0 ? diff.toFixed(2) : '0';
    };

    const handleTextClick = (index, column) => {
        if (column === 'hours') return;
        console.log("index:",index," column:",column)
        setCurrentIndex(index);
        setCurrentColumn(column);
        setCurrentValue(new Date());
        setShowDatePicker(true);
    };

    const handleDateChange = (date) => {
        setCurrentValue(date);
    };

    const handleOk = () => {
      const updatedData = [...data];
      const formattedValue =
          currentColumn === 'date'
              ? currentValue.toLocaleDateString()
              : currentValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      updatedData[currentIndex][currentColumn] = formattedValue;

      if (currentColumn === 'inTime' || currentColumn === 'outTime') {
          const { inTime, outTime } = updatedData[currentIndex];

          // Check if Out-Time is not less than In-Time
          if (inTime && outTime) {
              const inMinutes = parseTime(inTime);
              const outMinutes = parseTime(outTime);
              if (outMinutes < inMinutes) {
                  alert("Out-Time cannot be earlier than In-Time!");
                  setShowDatePicker(false);
                  return;
              }
              updatedData[currentIndex].hours = calculateHours(inTime, outTime);  // Recalculate hours
          }
      }

      setData(updatedData);
      setShowDatePicker(false);
      saveDataToServer(updatedData); // Call the function to save data
  };

  // Function to save data to the server (e.g., using a POST request)
  const saveDataToServer = (updatedData) => {
      setIsLoading(true);
      fetch('https://sheetdb.io/api/v1/mm8jpgiaq7bqt', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
      })
          .then((response) => response.json())
          .then((data) => {
              console.log('Data saved successfully:', data);
              setIsLoading(false);
              Alert.alert('Success', 'Data saved successfully!');
          })
          .catch((error) => {
              console.error('Error saving data:', error);
              setIsLoading(false);
              setHasError(true);
              Alert.alert('Error', 'There was an error saving the data.');
          });
  };

    const handleClockIn = () => {
        const currentDateTime = new Date();
        setClockIn(true);
        setClockData({
            date: currentDateTime.toLocaleDateString(),
            inTime: currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
    };

    const handleClockOut = () => {
        Alert.alert(
            "Clock Out",
            "Make sure to count the drawer and close all cheques before clocking out.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        const currentDateTime = new Date();
                        setClockData((prevData) => ({
                            ...prevData,
                            outTime: currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        }));
                        setClockIn(false);
                    },
                },
            ]
        );
    };
useEffect(()=>{fetchData()},[])
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        {headers.map((header, index) => (
                            <Text key={index} style={styles.headerText}>{header}</Text>
                        ))}
                    </View>
                    {data.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {Object.keys(row).map((key, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    style={styles.cell}
                                    onPress={() => isEditing && handleTextClick(rowIndex, key)}>
                                    <Text style={styles.cellText}>{row[key]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {!clockIn ? (
                <TouchableOpacity style={styles.clockInButton} onPress={handleClockIn}>
                    <Text style={styles.clockInText}>Clock In</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.clockOutButton} onPress={handleClockOut}>
                    <Text style={styles.clockOutText}>Clock Out</Text>
                </TouchableOpacity>
            )}

            {/* DatePicker Modal */}
            <Modal
                visible={showDatePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDatePicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <DatePicker
                            mode={currentColumn === 'date' ? 'date' : 'time'}
                            date={currentValue}
                            onDateChange={handleDateChange}
                        />
                        <Button title="OK" onPress={handleOk} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        justifyContent: 'space-around',
    },
    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        fontSize: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    editText: {
        color: '#fff',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#FF5722',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
    },
    clockInButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    clockInText: {
        color: '#fff',
        fontSize: 16,
    },
    clockOutButton: {
        backgroundColor: '#FF5722',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    clockOutText: {
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
});
