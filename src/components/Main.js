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

class ImgFigure extends React.Component {
  render(){
    var styleObj = {};

    // 如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
    }

    return(
      <figure className='img-figure' style={styleObj} ref={this.props.inputRef}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}
/**
 * 获取区间内的一个随机值
 */
function getRangeRandom(low,high){
  return Math.ceil(Math.random() * (high - low) + low);
}
class AppComponent extends React.Component {
  
  constructor(props){
    super(props);

    this.imgFigureObj = [];
    this.stage = null;
    this.Constant = {
      centerPos:{
        left:0,
        top:0
      },
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{
        topY:[0,0],
        x:[0,0]
      }
    };
    this.state = {
      imgsArrangeArr:[

      ]
    };
  }
  //组件加载后，计算图片位置范围
  componentDidMount(){
    //获取舞台大小
    console.log(this.imgFigureObj[0]);
    var stageDOM = this.stage,
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //获取图片大小
    var imgFigureDOM = this.imgFigureObj[0],
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };

    //计算左侧、右侧区域图片排布位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  /**
   * 重新布局所以图片
   * @param centerIndex 指定居中的图片
   */
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中centerIndex的图片，居中的centerIndex的图片不需要旋转
        console.log(centerPos);
        imgsArrangeCenterArr[0] = {
          pos:centerPos,
          rotate:0,
          isCenter:true
        };

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index] = {
            pos:{
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            isCenter:false
          };
        });

        //布局左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2;i<j;i++){
          var hPosRangeLORX = null;

          if(i<k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else{
            hPosRangeLORX = hPosRangeRightSecX;
          }
          imgsArrangeArr[i] = {
            pos:{
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
            },
            isCenter:false
          };
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  }
  
  render() {
    var imgFigures = [], controllerNav = [];
      imagesData.forEach(function(value,index){
          if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
              pos:{
                left:0,
                top:0
              },
              rotate:0,
              isInverse:false,
              isCenter:false
            }
          }

          imgFigures.push(<ImgFigure data={value} inputRef={(figure) => {this.imgFigureObj[index]=figure}} arrange={this.state.imgsArrangeArr[index]} />);

    }.bind(this));

    return (
      <section className="stage" ref={(section) => {this.stage = section}}>
        <section className="image-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerNav}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
