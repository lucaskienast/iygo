const fs = require("fs");
const path = require('path');

const printWelcomeMessage = () => {
    console.log(__dirname);
    const phoenixAsciiArt = path.join(__dirname, 'ascii-art-phoenix.txt');
    fs.readFile(phoenixAsciiArt, "utf8", (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    });
};

module.exports = { printWelcomeMessage };