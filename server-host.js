const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
