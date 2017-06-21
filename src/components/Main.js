require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

let yeomanImage = require('../images/yeoman.png');

function getRamdom(low , high){
	return Math.ceil(Math.random() * (high - low) + low);
}

function getDegRamdom(){
	return ((Math.random()>0.5 ? '' : '-' )+ Math.ceil(Math.random() * 30));
}

var imageDatas = require('../data/ImageData.json')
imageDatas = (function getImageUrl(imageDatasArr){
	for(var i=0;i<imageDatasArr.length;i++){
		var singleImageData = imageDatasArr[i];
	    singleImageData.imageURL = require('../images/'+
	    	singleImageData.filename);
	    imageDatasArr[i] = singleImageData;	
	}
	return imageDatasArr;

})(imageDatas);



var ImgFigure = React.createClass({
	
	handerClick: function(e){

		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	},

	render:function(){

		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate){
			styleObj['transform'] = 'rotate(' + this.props.arrange.rotate 
				+ 'deg)';
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}
		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '' ;

		return(
			<figure className={imgFigureClassName} style = {styleObj} onClick={this.handerClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption >
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handerClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>

		)
	}
})

//控制组件
var ControllerUnits = React.createClass({
	handleClick: function(e){
		//区分点击的是居中图片对应的按钮还是翻转
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	},

	render:function(){
		var UnitClassName = "controller-unit";
		if(this.props.arrange.isCenter){
			UnitClassName += " is-center";
			if(this.props.arrange.isInverse){
				UnitClassName += " is-inverse";
			}
		}


		return(
			<span className={UnitClassName} onClick={this.handleClick}>
			<i className="arrow-icon"></i>
			</span>
		)
	}
})





var GalleryByReact = React.createClass ({
	Constant:{
		centerPos:{
			left: 0,
			right:0
		},
		hPosRange:{                     //水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{                    //垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}		
	},

	//翻转图片
	inverse: function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			})

		}.bind(this);
	},



	//布局图片，传入下标
	rearrange : function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeLeftSecx = hPosRange.leftSecX,
		hPosRangerightSecx = hPosRange.rightSecX,
		hPostRangeY = hPosRange.y,
		vPosRangeTopY = vPosRange.topY,
		vPosRangeX = vPosRange.x,

		imgsArrangeTopArr = [],
		topImgNum = Math.floor(Math.random() * 2),
		topImgSpliceIndex = 0,

		//居中imgsArrangeCenterArr
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate:0,
			isCenter:true
		 
		}
		imgsArrangeCenterArr[0].rotate = 0;

		//拿到上方的图片
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex , topImgNum);

		//布局上侧图片
		imgsArrangeTopArr.forEach(function(value , index){
			imgsArrangeTopArr[index] = {
				pos : {
					top: getRamdom(vPosRangeTopY[0] , vPosRangeTopY[1]),
					left: getRamdom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate: getDegRamdom(),
				isCenter: false
			}
		});

		//布局左右图片
		for (var i = 0 , j = imgsArrangeArr.length/2 ; i < imgsArrangeArr.length; i++) {
			var hPosRangeLORX = null ;

			if(i<j){
				hPosRangeLORX = hPosRangeLeftSecx;
			}else{
				hPosRangeLORX = hPosRangerightSecx;
			}

			imgsArrangeArr[i] = {
				pos: {
					top: getRamdom(hPostRangeY[0],hPostRangeY[1]),
					left: getRamdom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate: getDegRamdom(),
				isCenter: false
			}
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr : imgsArrangeArr
		}) ;

	},

	//
	center: function(index){
		return function(){
			this.rearrange(index)
		}.bind(this)
	},


	getInitialState : function(){
		return{
			imgsArrangeArr:[

			]
		};
	},



	componentDidMount:function(){         //组件加载后，计算图片的取值范围
		//舞台大小
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);
		//拿到imagefigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imagefigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfimgW = Math.ceil(imgW/2),
			halfimgH = Math.ceil(imgH/2);

		this.Constant.centerPos = {
			left: halfStageW - halfimgW,
			top: halfStageH - halfimgH
		}

		this.Constant.hPosRange.leftSecX[0] = -halfimgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - 3*halfimgW;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfimgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfimgW;
		this.Constant.hPosRange.y[0] = -halfimgH;
		this.Constant.hPosRange.y[1] = stageH - halfimgH;

		this.Constant.vPosRange.topY[0] = -halfimgH;
		this.Constant.vPosRange.topY[1] = halfStageH - 3*halfimgH;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	},

	render:function(){
	var controllerUnits =[],imgFigure=[];

	imageDatas.forEach(function(value,index){

		if(!this.state.imgsArrangeArr[index]){
			this.state.imgsArrangeArr[index] = {
				pos: {
					left: 0,
					top: 0
				},
				rotate : 0,
				isInverse: false,
				isCenter: false
			}				
		}

		imgFigure.push(<ImgFigure data={value} ref={'imagefigure' + index}
			arrange = {this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}
			/>);
		controllerUnits.push(<ControllerUnits arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)		
		}.bind(this));

	return(
		<section className="stage">
			<section className="img-sec" ref="stage">
				{imgFigure}
			</section>
			<nav className="controller-nav">
				{controllerUnits}
			</nav>
		</section>
	);
    }
});


GalleryByReact.defaultProps = {
};

export default GalleryByReact;













// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         <img src={yeomanImage} alt="Yeoman Generator" />
//         <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
//       </div>
//     );
//   }
// }

// AppComponent.defaultProps = {
// };

// export default AppComponent;
