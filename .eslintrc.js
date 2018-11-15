module.exports = {
    "parser": "babel-eslint",
    
    "env": {
        "browser": true,
        "es6": true
    },
    "settings": {
          "ecmascript": 6,
          "jsx": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "experimentalDecorators": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
    ],
    "extends": "airbnb",
    "rules": {
      "react/jsx-filename-extension": 1,
      "function-paren-newline": 1,
      "implicit-arrow-linebreak": 1,
      "eqeqeq": 1, 
    }
  };