const markdownParser = require('marked');
// const hljs = require('highlight.js');
markdownParser.setOptions({
  renderer: new markdownParser.Renderer(),
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

module.exports = markdownParser
