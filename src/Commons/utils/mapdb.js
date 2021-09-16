/* istanbul ignore file */
/* eslint-disable camelcase */
const mapDBToDetailThread = ({
  id,
  title,
  body,
  date,
  username,
}) => ({
  id,
  title,
  body,
  date,
  username,
});

const mapDBToDetailComment = ({
  id,
  username,
  date,
  content,
  replies,
}) => ({
  id,
  username,
  date,
  content,
  replies,
});
const mapDBToDetailReply = ({
  id,
  username,
  date,
  content,
}) => ({
  id,
  username,
  date,
  content,
});

module.exports = { mapDBToDetailThread, mapDBToDetailComment, mapDBToDetailReply };
