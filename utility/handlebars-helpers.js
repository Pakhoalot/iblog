const moment = require('moment');
const markdownParser = require("./markdown-parser");


module.exports = {
  moment: function (time) {
    return moment(time).format("LLL");
  },
  spliting: function (array) {
    if (array) return array.join(' ');
    return '';
  },
  userStorage: function (user) {
      return '';
  },
  mdparse: function (content) {
    return markdownParser.parse(content);
  },
  shorten: function (str) {
    if(typeof str === 'string')
      return str.substr(0, 244) + '...';
    else return "hello world";
  }
}
