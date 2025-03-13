// const express = require("express");
// const cors = require("cors");
// const { marked } = require("marked");
// const app = express();
// const port = 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Markdown conversion endpoint
// app.post("/convert", (req, res) => {
//   const { markdown } = req.body;

//   if (!markdown) {
//     return res.status(400).json({ error: "No markdown content provided" });
//   }

//   try {
//     const html = marked(markdown);
//     res.json({ html });
//   } catch (error) {
//     res.status(500).json({ error: "Error converting markdown" });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require("express");
const cors = require("cors");
const { marked } = require("marked");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const app = express();
const port = 3001;

const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);

app.use(cors());
app.use(express.json());

app.post("/convert", (req, res) => {
  const { markdown } = req.body;

  if (!markdown) {
    return res.status(400).json({ error: "No markdown content provided" });
  }

  try {
    const html = marked(markdown);
    const cleanHtml = DOMPurify.sanitize(html);
    res.json({ html: cleanHtml });
  } catch (error) {
    res.status(500).json({
      error: "Error converting markdown",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
