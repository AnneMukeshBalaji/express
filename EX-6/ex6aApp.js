import React, { Component } from "react";

// ✅ Function Component for Avatar
function Avatar(props) {
  return (
    <img
      src={props.src}
      alt="profile"
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "3px solid #4CAF50",
        marginBottom: "10px",
      }}
    />
  );
}

// ✅ Function Component for User Details
function UserDetails(props) {
  return (
    <div>
      <h2 style={{ margin: "5px 0" }}>{props.name}</h2>
      <p style={{ margin: "5px 0", fontStyle: "italic" }}>📍 {props.location}</p>
      <p style={{ margin: "5px 0" }}>✨ Skills: {props.skills.join(", ")}</p>
    </div>
  );
}

// ✅ Class Component for Profile Card
class ProfileCard extends Component {
  render() {
    return (
      <div
        style={{
          width: "300px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "15px",
          padding: "20px",
          margin: "20px auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Avatar src={this.props.avatarUrl} />
        <UserDetails
          name={this.props.name}
          location={this.props.location}
          skills={this.props.skills}
        />
      </div>
    );
  }
}

// ✅ Main App Component (nesting everything)
function App() {
  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>React Profile Cards</h1>

      <ProfileCard
        name="Harikrishna"
        location="Hyderabad, India"
        skills={["React", "JavaScript", "Node.js"]}
        avatarUrl="https://i.pravatar.cc/150?img=12"
      />

      <ProfileCard
        name="Sneha"
        location="Bangalore, India"
        skills={["Python", "Django", "ML"]}
        avatarUrl="https://i.pravatar.cc/150?img=22"
      />
    </div>
  );
}

export default App;

