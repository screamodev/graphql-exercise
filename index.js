const express = require('express')
const fetch = require('cross-fetch');
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema")

const app = express()

const root = {
  records: ({ message }) => {
    const emoticonsRegEx = /\(([^)]{1,15})\)/;
    const linkRegEx = /^https?\:\/\//i
    const titleRegEx = /<title>([^<]*)<\/title>/

    const parseTitle = (body) => {
      const match = body.match(titleRegEx)
      if (!match || typeof match[1] !== 'string') {
        throw new Error("Title tag doesn't exist")
      }
      return match[1]
    }

    const fetchTitle = (url) => {
      const parsedTitle = fetch(url)
      .then(res => res.text())
      .catch(e => new Error(e.message))
      .then(body => parseTitle(body))
      return parsedTitle;
    }

    const mentions = message.split(" ")
    .filter(word => word[0] === "@")
    .map(word => word.slice(1))

    const emoticons = message.split(" ")
    .filter(word => emoticonsRegEx.test(word))
    .map(word => word.slice(1, -1))

    const links = message.split(" ")
    .filter(word => linkRegEx.test(word))
    .map(url => ({ url, title: fetchTitle(url) }))

    return { mentions, emoticons, links };
  }
}

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(3005), () => console.log("Server started on port 3005")
