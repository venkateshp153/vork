// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet,TouchableOpacity } from 'react-native';

// // Google Apps Script Web App URL
// const StoreDataUrl = 'https://script.google.com/macros/s/AKfycbyE22UsfuM5FfHZU7DD6wPKxFqa2o-X-fW_THAbS4wV4h_rRT-PZQ8oBYxt7AyAmuMiTQ/exec';
// const ProductsDataUrl = "https://script.google.com/macros/s/AKfycbyV7p0g-AHtFPOPynBzATdeUv9VGcfs-btibnsgatzej_76AFE8lLtvwvSj7PauTUrMyg/exec";


// export default  function App(){
//   // const [data, setData] = useState([]);
//   const [newEntry, setNewEntry] = useState('');
//   const [editIndex, setEditIndex] = useState(null);
//   const [selectedParent, setSelectedParent] = useState("Top");
  
// const data = [{"CategoryId": 1001, "CategoryName": "Menu", "ParentId": 0, "ParentName": "Top"}, {"CategoryId": 1002, "CategoryName": "Baked Goods", "ParentId": 1, "ParentName": "Menu"}, {"CategoryId": 1003, "CategoryName": "Beverages", "ParentId": 1, "ParentName": "Menu"}, {"CategoryId": 1004, "CategoryName": "Grain Bowl", "ParentId": 1, "ParentName": "Menu"}, {"CategoryId": 1005, "CategoryName": "Salads & Soups", "ParentId": 1, "ParentName": "Menu"}, {"CategoryId": 1006, "CategoryName": "Sandwiches", "ParentId": 1, "ParentName": "Menu"}, {"CategoryId": 1007, "CategoryName": "Ice Creams", "ParentId": 1, "ParentName": "Menu"}, {"CategoryId": 1008, "CategoryName": "Muffins/Scones", "ParentId": 2, "ParentName": "Baked Goods"}, {"CategoryId": 1009, "CategoryName": "Cookies & Bread Pudding", "ParentId": 2, "ParentName": "Baked Goods"}, {"CategoryId": 1010, "CategoryName": "Croissants/Danish", "ParentId": 2, "ParentName": "Baked Goods"}, {"CategoryId": 1011, "CategoryName": "Tarts & Pies", "ParentId": 2, "ParentName": "Baked Goods"}, {"CategoryId": 1012, "CategoryName": "Breads", "ParentId": 2, "ParentName": "Baked Goods"}, {"CategoryId": 1013, "CategoryName": "Breakfast Pastry", "ParentId": 2, "ParentName": "Baked Goods"}, {"CategoryId": 1014, "CategoryName": "Blueberry Muffin", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1015, "CategoryName": "Vegan Muffin", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1016, "CategoryName": "Gluten Free Blueberry Muffin", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1017, "CategoryName": "Gluten Free Almond Muffin", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1018, "CategoryName": "Blueberry Scone", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1019, "CategoryName": "White Chocolate Scone", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1020, "CategoryName": "Chocolate Muffin", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1021, "CategoryName": "Mixed Berry Muffin", "ParentId": 3, "ParentName": "Muffins/Scones"}, {"CategoryId": 1022, "CategoryName": "French Cream Donut", "ParentId": "", "ParentName": ""}, {"CategoryId": 1023, "CategoryName": "OatMeal", "ParentId": "", "ParentName": ""}]

//   // Fetch Data from Google Sheets
//   // const fetchData = async () => {
//   //   try {
//   //     const response = await fetch(`${StoreDataUrl}`);
//   //     if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
//   //     const json = await response.json();
//   //     setData(json.data || []);
//   //     console.log(json.data)
//   //   } catch (error) {
//   //     Alert.alert('Error', `Failed to fetch data: ${error.message}`);
//   //   }
//   // };
//   const getNestedCategories = (parentName) => {
//     return data
//       .filter((item) => item.ParentName === parentName)
//       .map((category) => ({
//         ...category,
//         subcategories: getNestedCategories(data.CategoryName),
//       }));
//   };
//   const [nestedCategories, setNestedCategories] = useState(getNestedCategories("Top"));
//   const handleParentClick = (parentName) => {
//     setSelectedParent(parentName);
//     const categories = getNestedCategories(data.parentName);
//     setNestedCategories(categories);
//   };

//   const resetToTop = () => {
//     setSelectedParent("Top");
//     setNestedCategories(getNestedCategories("Top"));
//   };

//   // Add Data to Google Sheets
//   const addData = async () => {
//     if (!newEntry.trim()) {
//       Alert.alert('Error', 'Entry cannot be empty.');
//       return;
//     }
//     try {
//       const response = await fetch(`${StoreDataUrl}?action=create`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ entry: newEntry }),
//       });
//       if (!response.ok) throw new Error(`Error adding data: ${response.status}`);
//       Alert.alert('Success', 'Data added successfully.');
//       setNewEntry('');
//       // fetchData();
//     } catch (error) {
//       Alert.alert('Error', `Failed to add data: ${error.message}`);
//     }
//   };

//   // Update Data in Google Sheets
//   const updateData = async () => {
//     if (editIndex === null || !newEntry.trim()) {
//       Alert.alert('Error', 'Select an item to edit and provide a valid entry.');
//       return;
//     }
//     try {
//       const response = await fetch(`${StoreDataUrl}?action=update`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ index: editIndex, entry: newEntry }),
//       });
//       if (!response.ok) throw new Error(`Error updating data: ${response.status}`);
//       Alert.alert('Success', 'Data updated successfully.');
//       setNewEntry('');
//       setEditIndex(null);
//       // fetchData();
//     } catch (error) {
//       Alert.alert('Error', `Failed to update data: ${error.message}`);
//     }
//   };

//   // Delete Data from Google Sheets
//   const deleteData = async (index) => {
//     try {
//       const response = await fetch(`${StoreDataUrl}?action=delete`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ index }),
//       });
//       if (!response.ok) throw new Error(`Error deleting data: ${response.status}`);
//       Alert.alert('Success', 'Data deleted successfully.');
//       // fetchData();
//     } catch (error) {
//       Alert.alert('Error', `Failed to delete data: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     // fetchData();
//   }, []);

//   return (
   
//     <View style={styles.container}>
//     <Text style={styles.title}>
//       {selectedParent === "Top"
//         ? "Top-Level Categories"
//         : `Categories under "${selectedParent}"`}
//     </Text>

//     {selectedParent !== "Top" && (
//       <TouchableOpacity style={styles.resetButton} onPress={resetToTop}>
//         <Text style={styles.resetButtonText}>Back to Top</Text>
//       </TouchableOpacity>
//     )}

//     <FlatList
//       data={nestedCategories}
//       keyExtractor={(item) => item.CategoryId.toString()}
//       renderItem={({ item }) => <CategoryItem category={item} />}
//       ListEmptyComponent={<Text style={styles.noData}>No Categories Found</Text>}
//     />
//   </View>
//   );
// };

// const CategoryItem = ({ category }) => {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <View>
//       <TouchableOpacity
//         style={styles.categoryItem}
//         onPress={() => setExpanded(!expanded)}
//       >
//         <Text style={styles.categoryText}>{category.CategoryName}</Text>
//       </TouchableOpacity>
//       {expanded && category.subcategories?.length > 0 && (
//         <View style={styles.subcategoryContainer}>
//           {category.subcategories.map((subcategory) => (
//             <CategoryItem key={subcategory.CategoryId} category={subcategory} />
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   resetButton: {
//     backgroundColor: "#ff5c5c",
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   resetButtonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   categoryItem: {
//     backgroundColor: "#e3e3e3",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   categoryText: {
//     fontSize: 16,
//   },
//   subcategoryContainer: {
//     marginLeft: 20,
//     borderLeftWidth: 2,
//     borderColor: "#ccc",
//     paddingLeft: 10,
//   },
//   noData: {
//     fontSize: 16,
//     color: "#999",
//     textAlign: "center",
//     marginTop: 20,
//   },
// });



import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";

const StoreDataUrl = "https://script.google.com/macros/s/AKfycbyE22UsfuM5FfHZU7DD6wPKxFqa2o-X-fW_THAbS4wV4h_rRT-PZQ8oBYxt7AyAmuMiTQ/exec"; 
export default function Main() {
  const [selectedParent, setSelectedParent] = useState("Top");
  const [nestedCategories, setNestedCategories] = useState([]);
  const [data, setData] = useState([]);

  const getNestedCategories = (parentName, categories) => {
    return categories
      .filter((item) => item.ParentName === parentName)
      .map((category) => ({
        ...category,
        subcategories: getNestedCategories(category.CategoryName, categories),
      }));
  };

  const handleParentClick = (parentName) => {
    setSelectedParent(parentName);
    const categories = getNestedCategories(parentName, data);
    setNestedCategories(categories);
  };

  const resetToTop = () => {
    setSelectedParent("Top");
    setNestedCategories(getNestedCategories("Top", data));
  };

  const fetchData = async () => {
    try {
      const response = await fetch(StoreDataUrl);
      if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
      const json = await response.json();
      setData(json.data || []);
      setNestedCategories(getNestedCategories("Top", json.data || []));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to fetch data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedParent === "Top"
          ? "Top-Level Categories"
          : `Categories under "${selectedParent}"`}
      </Text>

      {selectedParent !== "Top" && (
        <TouchableOpacity style={styles.resetButton} onPress={resetToTop}>
          <Text style={styles.resetButtonText}>Back to Top</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={nestedCategories}
        keyExtractor={(item) => item.CategoryId.toString()}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onParentClick={handleParentClick}
          />
        )}
        ListEmptyComponent={<Text style={styles.noData}>No Categories Found</Text>}
      />
    </View>
  );
}

const CategoryItem = ({ category, onParentClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.menuView}>
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => setExpanded(!expanded)}
        onLongPress={() => onParentClick(category.CategoryName)}
      >
        <Text style={styles.categoryText}>{category.CategoryName}</Text>
      </TouchableOpacity>
      {expanded && category.subcategories?.length > 0 && (
        <View style={styles.subcategoryContainer}>
          {category.subcategories.map((subcategory) => (
            <CategoryItem
              key={subcategory.CategoryId}
              category={subcategory}
              onParentClick={onParentClick}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: "#ff5c5c",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  categoryItem: {
    backgroundColor: "#e3e3e3",
    height: 40,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 12,
  },
  subcategoryContainer: {
    marginLeft: 20,
    borderLeftWidth: 2,
    borderColor: "#ccc",
    paddingLeft: 10,
  },
  noData: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
