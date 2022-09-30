const express = require('express')
const { graphqlHTTP } = require("express-graphql")
const { fetchTitle } = require("./utils/utils")
const schema = require("./schemas/schema")

const app = express()

const root = {
  records: ({ message }) => {
    const emoticonsRegEx = /\(([^)]{1,15})\)/;
    const linkRegEx = /^https?\:\/\//i

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

app.listen(3005, () => console.log("Server started on port 3005"))
