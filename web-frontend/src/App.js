import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");

  // Fetch data from the backend on component mount
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/todo")
      .then((res) => res.json())
      .then((data) => setData(data.items))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleCreate = () => {
    fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: inputValue }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Item created:", data);
        fetchData(); // Fetch updated data after creation
      })
      .catch((error) => console.error("Error creating item:", error));
  };

  const [editedItem, setEditedItem] = React.useState({ id: null, name: "" });

  const handleUpdate = () => {
    if (editedItem.id !== null && editedItem.name !== "") {
      fetch(`/api/todo/${editedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedItem.name }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Item updated:", data);
          fetchData(); // Fetch updated data after update
          setEditedItem({ id: null, name: "" }); // Clear the editedItem state
        })
        .catch((error) => console.error("Error updating item:", error));
    }
  };

  const handleEdit = (id, name) => {
    setEditedItem({ id, name });
  };

  const handleDelete = (id) => {
    fetch(`/api/todo/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Item deleted:", data);
        fetchData(); // Fetch updated data after deletion
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Grocery List</p>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter item name"
          />
          <button onClick={handleCreate}>Create</button>
        </div>
        {data ? (
        <ul>
          {data.map((item) => (
            <li className="listItem" key={item.id}>
              {editedItem.id === item.id ? (
                <>
                  <input
                    type="text"
                    value={editedItem.name}
                    onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  />
                  <button onClick={handleUpdate}>Save</button>
                </>
              ) : (
                <>
                  <span>{item.name}</span>
                  <button className="btn" onClick={() => handleEdit(item.id, item.name)}>Edit</button>
                  <button className="btn" onClick={() => handleDelete(item.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;

