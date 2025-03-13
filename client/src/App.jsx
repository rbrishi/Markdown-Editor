import React, { useState, useEffect } from "react";
import axios from "axios";
import Toolbar from "./components/Toolbar";
import Tabs from "./components/Tabs";
import "./App.css";

const initialDocuments = [
  {
    id: Date.now(),
    title: "Document 1",
    content: "# Welcome!",
    html: "",
  },
];

export default function App() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeId, setActiveId] = useState(initialDocuments[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const activeDoc = documents.find((doc) => doc.id === activeId);

  useEffect(() => {
    const convertMarkdown = async () => {
      if (!activeDoc.content.trim()) {
        updateDocument(activeId, { html: "" });
        return;
      }

      setIsLoading(true);
      try {
        const res = await axios.post("http://localhost:3001/convert", {
          markdown: activeDoc.content,
        });
        updateDocument(activeId, { html: res.data.html });
        setError("");
      } catch (err) {
        setError("Failed to convert markdown");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(convertMarkdown, 500);
    return () => clearTimeout(timer);
  }, [activeDoc.content]);

  const updateDocument = (id, updates) => {
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const handleInput = (e) => {
    updateDocument(activeId, { content: e.target.value });
  };

  const insertSyntax = ({ syntax, endSyntax, wrap, replace }) => {
    const textarea = document.getElementById("editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

    let newText = syntax;
    let newCursorPos = start + syntax.length;

    if (wrap && selection) {
      newText = `${syntax}${selection}${endSyntax || syntax}`;
      newCursorPos += selection.length + (endSyntax?.length || syntax.length);
    } else if (endSyntax) {
      newText += endSyntax;
    } else if (replace) {
      newCursorPos = start + syntax.length;
    }

    const updatedContent =
      text.substring(0, start) + newText + text.substring(end);

    updateDocument(activeId, { content: updatedContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const createDocument = () => {
    const newDoc = {
      id: Date.now(),
      title: `Document ${documents.length + 1}`,
      content: "",
      html: "",
    };
    setDocuments([...documents, newDoc]);
    setActiveId(newDoc.id);
  };

  const switchDocument = (id) => setActiveId(id);

  const closeDocument = (id) => {
    if (documents.length <= 1) return;

    const newDocs = documents.filter((doc) => doc.id !== id);
    setDocuments(newDocs);
    setActiveId(newDocs[0].id);
  };

  return (
    <div className="app-container">
      <Tabs
        documents={documents}
        activeId={activeId}
        onSwitch={switchDocument}
        onClose={closeDocument}
        onCreate={createDocument}
      />

      <div className="editor-preview">
        <div className="editor-section">
          <Toolbar onInsert={insertSyntax} />
          <textarea
            id="editor"
            value={activeDoc.content}
            onChange={handleInput}
            placeholder="Write your markdown here..."
            className="editor-input"
          />
          {error && <div className="error">{error}</div>}
        </div>

        <div className="preview-section">
          <h3>
            Preview {isLoading && <span className="loading">(Loading...)</span>}
          </h3>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: activeDoc.html }}
          />
        </div>
      </div>
    </div>
  );
}
