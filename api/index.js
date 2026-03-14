module.exports = (req, res) => {
  res.json({ 
    message: 'Root API is working!', 
    timestamp: new Date(),
    node_version: process.version 
  });
};
