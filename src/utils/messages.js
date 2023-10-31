const generateMessage = (userName,msg) => {
  return {
    userName,
    text: msg,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (userName,url) => {
  return {
    userName,
    url,
    createdAt: new Date().getTime(),
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage,
};
