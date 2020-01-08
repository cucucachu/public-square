const noomman = require('noomman');


const uri = 'mongodb+srv://cody_jones:cody_jones@publicsquaredev-d3ue6.gcp.mongodb.net/test?retryWrites=true';
const databaseName = 'public-square-test';

async function connect() {
    await noomman.connect(uri, databaseName);
}

async function close() {
    await noomman.close();
}

module.exports = {
    connect,
    close,
}