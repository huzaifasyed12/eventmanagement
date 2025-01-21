import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, FlatList, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventCard from "./components/EventCard";
import RegisteredEventCard from "./components/RegisteredEventCard";
import RegisterModal from "./components/RegisterModal";
import FeedbackModal from "./components/FeedbackModal";

const mockAPI = [
  { id: 1, name: "Tech Conference", date: "2025-02-20", time: "10:00 AM", venue: "Auditorium", description: "Tech conference description", status: "upcoming" },
  { id: 2, name: "AI Workshop", date: "2025-02-22", time: "1:00 PM", venue: "Room 101", description: "AI workshop description", status: "completed" },
  { id: 3, name: "Blockchain Summit", date: "2025-03-01", time: "9:00 AM", venue: "Main Hall", description: "Blockchain technologies summit", status: "upcoming" },
  { id: 4, name: "Data Science Seminar", date: "2025-03-05", time: "11:00 AM", venue: "Room 203", description: "Exploring data science concepts", status: "completed" },
  { id: 5, name: "Mobile App Development Bootcamp", date: "2025-03-10", time: "2:00 PM", venue: "Room 301", description: "Mobile development training", status: "upcoming" },
  { id: 6, name: "Cybersecurity Conference", date: "2025-03-15", time: "10:00 AM", venue: "Conference Hall", description: "Cybersecurity industry trends", status: "upcoming" },
  { id: 7, name: "Quantum Computing Workshop", date: "2025-03-18", time: "1:00 PM", venue: "Lab 202", description: "Exploring quantum computing", status: "completed" },
  { id: 8, name: "Cloud Computing Symposium", date: "2025-04-01", time: "3:00 PM", venue: "Room 101", description: "Cloud technologies in practice", status: "upcoming" },
  { id: 9, name: "AI and Ethics Panel", date: "2025-04-03", time: "10:00 AM", venue: "Main Auditorium", description: "Ethics in AI discussion", status: "completed" },
  { id: 10, name: "Full Stack Web Development", date: "2025-04-05", time: "12:00 PM", venue: "Room 302", description: "Web development course", status: "upcoming" },
  { id: 11, name: "Machine Learning Workshop", date: "2025-04-10", time: "9:00 AM", venue: "Room 204", description: "Introduction to machine learning", status: "completed" },
  { id: 12, name: "IoT Summit", date: "2025-04-12", time: "1:00 PM", venue: "Conference Room", description: "Internet of Things innovations", status: "upcoming" },
  { id: 13, name: "Mobile UX/UI Design", date: "2025-04-15", time: "11:00 AM", venue: "Room 205", description: "Mobile design principles", status: "completed" },
  { id: 14, name: "Smart Cities Conference", date: "2025-05-01", time: "10:00 AM", venue: "Main Hall", description: "Innovations for smart cities", status: "upcoming" },
  { id: 15, name: "Cloud Security Workshop", date: "2025-05-05", time: "2:00 PM", venue: "Room 103", description: "Security practices for cloud computing", status: "completed" },
  { id: 16, name: "AI for Healthcare", date: "2025-05-10", time: "9:00 AM", venue: "Room 301", description: "Artificial intelligence in healthcare", status: "upcoming" },
  { id: 17, name: "Big Data Summit", date: "2025-05-15", time: "3:00 PM", venue: "Room 104", description: "Big data analytics trends", status: "completed" },
  { id: 18, name: "Tech Trends in 2025", date: "2025-06-01", time: "10:00 AM", venue: "Main Auditorium", description: "Latest tech trends overview", status: "upcoming" },
  { id: 19, name: "Artificial Intelligence and Robotics", date: "2025-06-10", time: "11:00 AM", venue: "Room 105", description: "The intersection of AI and robotics", status: "upcoming" },
  { id: 20, name: "Digital Transformation Forum", date: "2025-06-15", time: "1:00 PM", venue: "Conference Hall", description: "How digital transformation is changing industries", status: "completed" }
];


export default function App() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [showRegisteredEvents, setShowRegisteredEvents] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    setEvents(mockAPI); // Load events from mock data
    loadRegisteredEvents(); // Load registered events on start
  }, []);

  const loadRegisteredEvents = async () => {
    try {
      const data = await AsyncStorage.getItem("registeredEvents");
      if (data) setRegisteredEvents(JSON.parse(data));
    } catch (error) {
      console.error("Error loading registered events:", error);
    }
  };

  const saveRegisteredEvents = async (data) => {
    try {
      await AsyncStorage.setItem("registeredEvents", JSON.stringify(data));
      setRegisteredEvents(data);
    } catch (error) {
      console.error("Error saving registered events:", error);
    }
  };

  const handleRegister = () => {
    if (!userDetails.name || !userDetails.email) {
      alert("Please provide name and email.");
      return;
    }
    const newRegisteredEvent = { ...selectedEvent, feedback: "" };
    const updatedRegisteredEvents = [...registeredEvents, newRegisteredEvent];
    saveRegisteredEvents(updatedRegisteredEvents);
    setRegisterModalVisible(false);
    alert("Registered successfully!");
  };

  const handleFeedbackSubmit = () => {
    const updatedEvents = registeredEvents.map((event) =>
      event.id === selectedEvent.id ? { ...event, feedback: feedbackText } : event
    );
    saveRegisteredEvents(updatedEvents);
    setFeedbackModalVisible(false);
    alert("Feedback submitted successfully!");
  };

  const filteredEvents = events
    .filter((event) => (filter === "all" ? true : event.status === filter))
    .filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Text style={[styles.title, darkMode && styles.textDark]}>University Event Management</Text>
      <Switch value={darkMode} onValueChange={setDarkMode} />
      <TextInput
        style={[styles.searchInput, darkMode && styles.textDark]}
        placeholder="Search events"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("upcoming")}>
          <Text style={styles.filterText}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("completed")}>
          <Text style={styles.filterText}>Completed</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowRegisteredEvents(!showRegisteredEvents)}
      >
        <Text style={styles.buttonText}>
          {showRegisteredEvents ? "Show All Events" : "Show Registered Events"}
        </Text>
      </TouchableOpacity>

      <ScrollView>
        {showRegisteredEvents ? (
          <FlatList
            data={registeredEvents}
            renderItem={({ item }) => <RegisteredEventCard event={item} darkMode={darkMode} />}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                setSelectedEvent={setSelectedEvent}
                setRegisterModalVisible={setRegisterModalVisible}
                setFeedbackModalVisible={setFeedbackModalVisible}
                darkMode={darkMode}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </ScrollView>

      <RegisterModal
        registerModalVisible={registerModalVisible}
        setRegisterModalVisible={setRegisterModalVisible}
        selectedEvent={selectedEvent}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        handleRegister={handleRegister}
      />

      <FeedbackModal
        feedbackModalVisible={feedbackModalVisible}
        setFeedbackModalVisible={setFeedbackModalVisible}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        handleFeedbackSubmit={handleFeedbackSubmit}
        selectedEvent={selectedEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  containerDark: { backgroundColor: "#333" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  textDark: { color: "#fff" },
  searchInput: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  filterText: { fontSize: 16, color: "#007bff" },
  button: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 }
});
