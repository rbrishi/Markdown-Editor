import React from "react";

const syntaxItems = [
  { label: "H1", syntax: "# " },
  { label: "H2", syntax: "## " },
  { label: "Bold", syntax: "**", wrap: true },
  { label: "Italic", syntax: "*", wrap: true },
  { label: "List", syntax: "- " },
  { label: "Code", syntax: "```\n", endSyntax: "\n```" },
  { label: "Link", syntax: "[text](url)", replace: true },
];

export default function Toolbar({ onInsert }) {
  return (
    <div className="toolbar">
      {syntaxItems.map((item) => (
        <button
          key={item.label}
          onClick={() => onInsert(item)}
          className="toolbar-btn"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}