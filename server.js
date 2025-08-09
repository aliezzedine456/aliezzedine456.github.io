const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with the keys you generated
const vapidKeys = {
  publicKey: 'BOwbDdRmFYCLE6mGP9yndxkWqzOLSNSSE3_fHS-Va5rlM7QG9cPXTNNweAd20JnlV41e1qnRuVvIQ8oY4Wb2yhc',
  privateKey: 'RgaybBV74ETaZIigxde2q3JYj4lAL1W-PgUY-VP3eMQ'
};

webpush.setVapidDetails(
  'mailto:you@example.com', // Contact email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Temporary in-memory storage (use a DB for production)
let subscriptions = [];

// Save subscription
app.post('/api/save-subscription', (req, res) => {
  subscriptions.push(req.body);
  console.log('New subscription saved:', req.body);
  res.status(201).json({ message: 'Subscription saved.' });
});

// Send push notification
app.post('/api/send-notification', (req, res) => {
  const payload = JSON.stringify(req.body);

  const sendPromises = subscriptions.map(sub =>
    webpush.sendNotification(sub, payload).catch(err => console.error(err))
  );

  Promise.all(sendPromises)
    .then(() => res.json({ message: 'Notifications sent.' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3000, () => {
  console.log('Push notification server running on port 3000');
});
