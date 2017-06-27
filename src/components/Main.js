require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imagesData = require('../data/imagesData.json');

imagesData = (function generateImgUrl(imagesData){
  for(var i = 0 , j = imagesData.length; i<j; i++){
    var singleData = imagesData[i];
    singleData.imageURL = require('../images/' + singleData.fileName);
    imagesData[i] = singleData;
  }
  return imagesData;
  
})(imagesData);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
        <span>Hello</span>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
