const {decode} = require('jsonwebtoken');

// Liveness probe
const livenessProbe = (req, res) => {
    const jwt = req.headers.authorization.split(' ')[1];
    const usercode = decode(jwt).USERNAME;
    res.send(decodedToken.USERNAME);
};

// Readiness probe
const readinessProbe = (req, res) => {
    res.send('OK');
};

// Startup Probe
const startupProbe = (req, res) => {
    res.send('OK');
};

module.exports = {
    startupProbe,
    readinessProbe,
    livenessProbe,

};