const {buildSchema} = require("graphql")

const schema = buildSchema(`
  type Message {
    mentions: [String]
    emoticons: [String]
    links: [Link]
  }
  
  type Link {
    url: String
    title: String
  }
  
  type Query {
   records(message: String): Message
  }
`)

module.exports = schema
