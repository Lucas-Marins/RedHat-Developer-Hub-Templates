const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from ${{ values.appName }}!' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});