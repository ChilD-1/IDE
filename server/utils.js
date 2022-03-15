
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');


// Generate a random new playground id
const get_playground_id = () => {
    const name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "-",
      style: "lowerCase",
    });
    return name;
  };


function getRandomInt() {
    var min = 10000
    var max = 30000
    return Math.floor(Math.random() * max + min).toString();
}

const subPortMap = new Map();

module.exports = { get_playground_id, getRandomInt, subPortMap };