import React, { useState } from "react";
import "./CommandManager.css";

function CommandManager() {
  const [command, setCommand] = useState("");
  const [link, setLink] = useState("");
  const [commands, setCommands] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addOrUpdateCommand = () => {
    if (!command || !link) return;

    if (editingIndex !== null) {
      const updated = [...commands];
      updated[editingIndex] = { name: command, url: link };
      setCommands(updated);
      setEditingIndex(null);
    } else {
      setCommands([...commands, { name: command, url: link }]);
    }

    setCommand("");
    setLink("");
  };

  const editCommand = (index) => {
    setCommand(commands[index].name);
    setLink(commands[index].url);
    setEditingIndex(index);
  };

  const deleteCommand = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this command?");
    if (!confirmDelete) return;
    setCommands(commands.filter((_, i) => i !== index));
  };

  const cancelEdit = () => {
    setCommand("");
    setLink("");
    setEditingIndex(null);
  };

  return (
    <>
      {/* Main Form */}
      <div className="jarvis-container">
        <h2>⚡ JARVIS Command Manager</h2>

        <div className="form-section">
          <input
            type="text"
            placeholder="Command (e.g., open youtube)"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL (e.g., https://youtube.com)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="buttons">
            <button onClick={addOrUpdateCommand}>
              {editingIndex !== null ? "Update Command" : "Add Command"}
            </button>
            {editingIndex !== null && (
              <button className="cancel" onClick={cancelEdit}>
                Back to Form
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Separate Saved Commands Panel */}
      <div className="saved-commands-container">
        <h3>📜 Saved Commands</h3>
        <ul className="command-list">
          {commands.map((cmd, index) => (
            <li key={index}>
              <span className="cmd-name">{cmd.name}</span>
              <span className="cmd-url">{cmd.url}</span>
              <div className="actions">
                <button className="edit" onClick={() => editCommand(index)}>Edit</button>
                <button className="delete" onClick={() => deleteCommand(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default CommandManager;
