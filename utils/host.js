if(process.env.NODE_ENV === 'production') {
    exports.host = 'obscure-journey-42939.herokuapp.com';
  } else {
    exports.host = 'localhost:8080';
  };