const fetch = require('cross-fetch');
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
  .then(body => parseTitle(body))
  return parsedTitle;
}

module.exports = { parseTitle, fetchTitle }
