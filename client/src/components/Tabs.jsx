import React from "react";

export default function Tabs({
  documents,
  activeId,
  onSwitch,
  onClose,
  onCreate,
}) {
  return (
    <div className="tab-bar">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`tab ${doc.id === activeId ? "active" : ""}`}
          onClick={() => onSwitch(doc.id)}
        >
          {doc.title}
          <span
            className="close-tab"
            onClick={(e) => {
              e.stopPropagation();
              onClose(doc.id);
            }}
          >
            ×
          </span>
        </div>
      ))}
      <button className="new-tab-btn" onClick={onCreate}>
        +
      </button>
    </div>
  );
}