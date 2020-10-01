import React, {useRef, useEffect, useLayoutEffect} from 'react';
import Konva from 'konva';

let angularVelocity = 6;
let angularVelocities = [];
let lastRotation = 0;
let controlled = true;
let angularFriction = 0.2;
let target, activeWedge, stage, layer, wheel, pointer;
let finished = false;
let wheelMoving = false;

// handle wheel spin
let rotationMilisec = 2000;

let vw = window.outerWidth;
let isMobile = vw <= 768


function Wheel(props) {

    let square = props.width;

    if(square >= props.height){
        square = props.height
    }

    let numWedges = props.wedges;
    let width = square;
    let height = square;
    
    Konva.angleDeg = false;


    /**
     * Duplicate odds until it reaches max length
     */
    let collection = [...props.odds].sort(() => Math.random() - 0.5)
    let selectedOdd = {}
    let indicator = 0;
    let hexs = [
      '#390099', '#9e0059', '#ff0054', '#2a9d8f','#ffbd00',
      '#9b5de5', '#f15bb5', '#fee440', '#00bbf9','#00f5d4',
      '#264653', '#2a9d8f', '#e9c46a', '#f4a261','#e76f51',
      '#ef476f', '#C49E85', '#06d6a0', '#118ab2','#073b4c',
      '#083d77', '#ebebd3', '#f4d35e', '#ee964b','#f95738'
    ]

    function getRandomOdds(index) {
    
      let randomColor = Math.round(Math.random() * (hexs.length - 1));

      if( (index % collection.length) == 0 ) {
        indicator = 0
      }

      let odd = collection[indicator];
      let bg = hexs[randomColor];

      if(Object.keys(selectedOdd).includes(odd)) {

        bg = selectedOdd[odd];

      } else {

        let bg = hexs[randomColor]

        selectedOdd[odd] = bg;

        hexs.splice(randomColor, 1)
      }

      indicator++
      return [odd, bg]
    }
    
    function addWedge(n) {

      const [odd, bg] = getRandomOdds(n);

      let startColor = bg;
      let endColor = bg;
    
      let angle = (2 * Math.PI) / numWedges;

      let wedge = new Konva.Group({
        rotation: (2 * n * Math.PI) / numWedges,
      });
    
      let wedgeBackground = new Konva.Wedge({
        radius: (stage.width() / 2) - 10,
        angle: angle,
        fillRadialGradientStartPoint: {x: 0, y: 0},
        fillRadialGradientStartRadius: 0,
        fillRadialGradientEndPoint: {x: 0, y: 0},
        fillRadialGradientEndRadius: 400,
        fillRadialGradientColorStops: [0, startColor, 1, endColor],
        fill: '#c0fdff',
        fillPriority: 'radial-gradient',
        stroke: '#000',
        strokeWidth:  isMobile ? 1 : 2,
      });
    
      wedge.add(wedgeBackground);


      let circumference = (2 * Math.PI) * ((stage.width() / 2) - 10)
      let wedgeCircumference = (circumference / numWedges) + 20

    
      let text = new Konva.Text({
        text: odd,
        fontFamily: 'Tahoma',
        fontSize: isMobile ? 20 :40,
        fill: 'white',
        align: 'center',
        stroke: '#000',
        strokeWidth: 0,
        rotation: isMobile ? 3.4 : 3.3, // (Math.PI + angle) / 2, 
        x: isMobile ? (stage.width() / 2) - 25 : (stage.width() / 2) - 50 ,
        y: wedgeCircumference / 2,
        listening: false,
        shadowColor: 'black',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 5,
        shadowOpacity: 0.2,
      });
    
      wedge.add(text);
      text.cache();
    
      wedge.startRotation = wedge.rotation();
    
      wheel.add(wedge);
    }
    
    function animate(frame) {
    
 
      let angularVelocityChange = (angularVelocity * frame.timeDiff * (1 - angularFriction)) / rotationMilisec;
    
      angularVelocity -= angularVelocityChange;
    
      // activate / deactivate wedges based on point intersection
      let shape = stage.getIntersection({
        x: stage.width() / 2,
        y: 100,
      });
    
      if (controlled) {
    
        if (angularVelocities.length > 10) {
          angularVelocities.shift();
        }
    
        angularVelocities.push(
          ((wheel.rotation() - lastRotation) * 1000) / frame.timeDiff
        );
    
      } else {
    
        let diff = (frame.timeDiff * angularVelocity) / 1000;
        let abs = Math.abs(diff)

        if (abs > 0.0001) {
    
          wheel.rotate(diff);
    
        } else if (!finished && !controlled) {
    
          if (shape) {
    
            wheelMoving = false
    
            let text = shape.getParent().findOne('Text').text();
            let active = text.split('\n').join('');
    
            // console.log('You Got ' + active + '!');
            props.onStop(active)
            
          }
          
          finished = true;
          return false;
    
        }
    
    
      }
    
      lastRotation = wheel.rotation();
    
      if (shape) {
    
        if (shape && (!activeWedge || shape._id !== activeWedge._id)) {

          pointer.y(isMobile ? 28 : 45);
    
          new Konva.Tween({
            node: pointer,
            duration: 0.3,
            y:  isMobile ? 25 : 40,
            easing: Konva.Easings.ElasticEaseOut,
          }).play();
    
          if (activeWedge) {
            activeWedge.fillPriority('radial-gradient');
          }
    
          shape.fillPriority('fill');
          activeWedge = shape;
        }
      }
    
    }
    

    useEffect(() => {

      stage = new Konva.Stage({
        container: 'roulette',
        width: width,
        height: height,
      });
    
      layer = new Konva.Layer();
    
      wheel = new Konva.Group({
        x: stage.width() / 2,
        y: stage.width() / 2,
      });
    
      for (let n = 0; n < numWedges; n++) {
        addWedge(n);
      }

      pointer = new Konva.Wedge({
        fillRadialGradientStartPoint: {x: 0, y: 0},
        fillRadialGradientStartRadius: 0,
        fillRadialGradientEndPoint: {x: 0, y: 0},
        fillRadialGradientEndRadius: 30,
        fillRadialGradientColorStops: [0, '#ff0054', 1, '#ff0054'],
        stroke: '#000',
        strokeWidth: isMobile ? 1 : 2,
        lineJoin: 'round',
        angle: 1,
        radius: isMobile ? 20 : 35,
        x: stage.width() / 2,
        y: 40,
        rotation: -90,
        shadowColor: 'black',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 5,
        shadowOpacity: 0.2,
      });
    
    
      // add components to the stage
      layer.add(wheel);
      layer.add(pointer);
      stage.add(layer);
    
    
      // bind events
    
      const onMouseDown = (evt) => {

          // if wheel is moving, dont do anything
          if(wheelMoving) {
            console.log('Wheel is moving, Please Wait!');
            return
          };

          angularVelocity = 0;
          controlled = true;
          target = evt.target;
          finished = false;
      }
    
      const onMouseUp = (evt) => {

        // if wheel is moving, dont do anything
        if(wheelMoving) {
          return
        };

        angularVelocity = getAverageAngularVelocity() * 5;

        // if Velocity is 0, dont do anything
        if(angularVelocity == 0) {
          return
        }
    
        wheelMoving = true;
        controlled = false;

        props.onStart()
    
        if (angularVelocity > 20) {
          angularVelocity = 20;
        } else if (angularVelocity < -20) {
          angularVelocity = -20;
        }
    
        angularVelocities = [];
    
      }
    
      const onMouseMove = (evt) => {
    
          let mousePos = stage.getPointerPosition();
    
          if (controlled && mousePos && target) {
    
            let x = mousePos.x - wheel.getX();
            let y = mousePos.y - wheel.getY();
    
            let atan = Math.atan(y / x);
            let rotation = x >= 0 ? atan : atan + Math.PI;
            let targetGroup = target.getParent();
    
            wheel.rotation( rotation - targetGroup.startRotation - target.angle() / 2 );
    
          }
      }
    
      wheel.on('mousedown touchstart', onMouseDown);
      stage.addEventListener( 'mouseup touchend', onMouseUp, false );
      stage.addEventListener( 'mousemove touchmove', onMouseMove, false);
    
      let anim = new Konva.Animation(animate, layer);
    
      anim.start();

      // Cleanup!
      return () => {  
        wheel.removeEventListener('mousedown touchstart', onMouseDown);
        stage.removeEventListener( 'mouseup touchend', onMouseUp);
        stage.removeEventListener( 'mousemove touchmove', onMouseMove);

        anim.stop();
      }
      
    }, [props.odds, props.wedges, props.random]);


  return (
      <div id="roulette">
      </div>
  );
}



function getAverageAngularVelocity() {
  let total = 0;
  let len = angularVelocities.length;

  if (len === 0) {
    return 0;
  }

  for (let n = 0; n < len; n++) {
    total += angularVelocities[n];
  }

  return total / len;
}

function getRandomHex() {

  let hexs = [
    '#390099', '#9e0059', '#ff0054', '#2a9d8f','#ffbd00',
    '#9b5de5', '#f15bb5', '#fee440', '#00bbf9','#00f5d4',
    '#264653', '#2a9d8f', '#e9c46a', '#f4a261','#e76f51',
    '#ef476f', '#C49E85', '#06d6a0', '#118ab2','#073b4c',
    '#083d77', '#ebebd3', '#f4d35e', '#ee964b','#f95738'
  ]

  let r = Math.round(Math.random() * (hexs.length - 1));

  return hexs[r]

}

Wheel.defaultProps = {
  wedges: 12,
  width: 600, 
  height: 600,
  odds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
}

export default Wheel;
