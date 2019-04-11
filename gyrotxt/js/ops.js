"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Math=Ops.Math || {};
Ops.Html=Ops.Html || {};
Ops.Value=Ops.Value || {};
Ops.String=Ops.String || {};
Ops.Trigger=Ops.Trigger || {};
Ops.Devices=Ops.Devices || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Deprecated=Ops.Deprecated || {};
Ops.Gl.Textures=Ops.Gl.Textures || {};
Ops.Devices.Mobile=Ops.Devices.Mobile || {};
Ops.Deprecated.Html=Ops.Deprecated.Html || {};
Ops.Deprecated.Html.Elements=Ops.Deprecated.Html.Elements || {};



// **************************************************************
// 
// Ops.Html.DivElement
// 
// **************************************************************

Ops.Html.DivElement = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inId=op.inValueString("Id");
const inClass=op.inValueString("Class");
const inText=op.inValueString("Text","Hello Div");
const inStyle=op.inValueEditor("Style","position:absolute;z-index:9999;","css");

const inInteractive=op.inValueBool("Interactive",false);
const inVisible=op.inValueBool("Visible",true);

const outElement=op.outObject("DOM Element");
const outHover=op.outValue("Hover");
const outClicked=op.outTrigger("Clicked");

var listenerElement=null;

var div = document.createElement('div');
var canvas = op.patch.cgl.canvas.parentElement;

canvas.appendChild(div);
outElement.set(div);

inClass.onChange=updateClass;
inText.onChange=updateText;
inStyle.onChange=updateStyle;
inInteractive.onChange=updateInteractive;
inVisible.onChange=updateVisibility;

updateText();
updateStyle();

op.onDelete=removeElement;


function setCSSVisible(visible)
{
    if(!visible)
    {
        div.style.visibility='hidden';
        div.style.display='none';
    }
    else
    {
        div.style.visibility='visible';
        div.style.display='block';
    }
}

function updateVisibility()
{
    setCSSVisible(inVisible.get());
}

function updateText()
{
    div.innerHTML=inText.get();
    outElement.set(null);
    outElement.set(div);
}

function removeElement()
{
    div.parentNode.removeChild(div);
}

function updateStyle()
{
    div.setAttribute("style",inStyle.get());
    updateVisibility();
    outElement.set(null);
    outElement.set(div);
}

function updateClass()
{
    div.setAttribute("class",inClass.get());
}

function onMouseEnter()
{
    outHover.set(true);
}

function onMouseLeave()
{
    outHover.set(false);
}

function onMouseClick()
{
    outClicked.trigger();
}

function updateInteractive()
{
    removeListeners();
    if(inInteractive.get()) addListeners();
}

inId.onChange=function()
{
    div.id=inId.get();
};

function removeListeners()
{
    if(listenerElement)
    {
        listenerElement.removeEventListener('click', onMouseClick);
        listenerElement.removeEventListener('mouseleave', onMouseLeave);
        listenerElement.removeEventListener('mouseenter', onMouseEnter);
        listenerElement=null;
    }
}

function addListeners()
{
    if(listenerElement)removeListeners();

    listenerElement=div;

    if(listenerElement)
    {
        listenerElement.addEventListener('click', onMouseClick);
        listenerElement.addEventListener('mouseleave', onMouseLeave);
        listenerElement.addEventListener('mouseenter', onMouseEnter);
    }
}

op.addEventListener("onEnabledChange",function(enabled)
{
    setCSSVisible( div.style.visibility!='visible' );
});










};

Ops.Html.DivElement.prototype = new CABLES.Op();
CABLES.OPS["cd1742e1-058a-48d3-ac53-0e53d4984c47"]={f:Ops.Html.DivElement,objName:"Ops.Html.DivElement"};




// **************************************************************
// 
// Ops.Gl.MainLoop
// 
// **************************************************************

Ops.Gl.MainLoop = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const fpsLimit=op.inValue("FPS Limit",0);
const trigger=op.outTrigger("trigger");
const width=op.outValue("width");
const height=op.outValue("height");
const reduceLoadingFPS=op.inValueBool("Reduce FPS loading");
const clear=op.inValueBool("Clear",true);
const fullscreen=op.inValueBool("Fullscreen Button",false);
const active=op.inValueBool("Active",true);
const hdpi=op.inValueBool("Hires Displays",false);

hdpi.onChange=function()
{
    if(hdpi.get()) op.patch.cgl.pixelDensity=window.devicePixelRatio;
        else op.patch.cgl.pixelDensity=1;
        
    op.patch.cgl.updateSize();
    if(CABLES.UI) gui.setLayout();
};


var cgl=op.patch.cgl;
var rframes=0;
var rframeStart=0;

if(!op.patch.cgl) op.uiAttr( { 'error': 'No webgl cgl context' } );

var identTranslate=vec3.create();
vec3.set(identTranslate, 0,0,0);
var identTranslateView=vec3.create();
vec3.set(identTranslateView, 0,0,-2);

fullscreen.onChange=updateFullscreenButton;
setTimeout(updateFullscreenButton,100);
var fsElement=null;

function updateFullscreenButton()
{
    function onMouseEnter()
    {
        if(fsElement)fsElement.style.display="block";
    }

    function onMouseLeave()
    {
        if(fsElement)fsElement.style.display="none";
    }
    
    op.patch.cgl.canvas.addEventListener('mouseleave', onMouseLeave);
    op.patch.cgl.canvas.addEventListener('mouseenter', onMouseEnter);

    if(fullscreen.get())
    {
        if(!fsElement) 
        {
            fsElement = document.createElement('div');

            var container = op.patch.cgl.canvas.parentElement;
            if(container)container.appendChild(fsElement);
    
            fsElement.addEventListener('mouseenter', onMouseEnter);
            fsElement.addEventListener('click', function(e)
            {
                if(CABLES.UI && !e.shiftKey) gui.cycleRendererSize();
                    else
                    {
                        cgl.fullScreen();
                    }
            });
        }

        fsElement.style.padding="10px";
        fsElement.style.position="absolute";
        fsElement.style.right="5px";
        fsElement.style.top="5px";
        fsElement.style.width="20px";
        fsElement.style.height="20px";
        // fsElement.style.opacity="1.0";
        fsElement.style.cursor="pointer";
        fsElement.style['border-radius']="40px";
        fsElement.style.background="#444";
        fsElement.style["z-index"]="9999";
        fsElement.style.display="none";
        fsElement.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 490 490" style="width:20px;height:20px;" xml:space="preserve" width="512px" height="512px"><g><path d="M173.792,301.792L21.333,454.251v-80.917c0-5.891-4.776-10.667-10.667-10.667C4.776,362.667,0,367.442,0,373.333V480     c0,5.891,4.776,10.667,10.667,10.667h106.667c5.891,0,10.667-4.776,10.667-10.667s-4.776-10.667-10.667-10.667H36.416     l152.459-152.459c4.093-4.237,3.975-10.99-0.262-15.083C184.479,297.799,177.926,297.799,173.792,301.792z" fill="#FFFFFF"/><path d="M480,0H373.333c-5.891,0-10.667,4.776-10.667,10.667c0,5.891,4.776,10.667,10.667,10.667h80.917L301.792,173.792     c-4.237,4.093-4.354,10.845-0.262,15.083c4.093,4.237,10.845,4.354,15.083,0.262c0.089-0.086,0.176-0.173,0.262-0.262     L469.333,36.416v80.917c0,5.891,4.776,10.667,10.667,10.667s10.667-4.776,10.667-10.667V10.667C490.667,4.776,485.891,0,480,0z" fill="#FFFFFF"/><path d="M36.416,21.333h80.917c5.891,0,10.667-4.776,10.667-10.667C128,4.776,123.224,0,117.333,0H10.667     C4.776,0,0,4.776,0,10.667v106.667C0,123.224,4.776,128,10.667,128c5.891,0,10.667-4.776,10.667-10.667V36.416l152.459,152.459     c4.237,4.093,10.99,3.975,15.083-0.262c3.992-4.134,3.992-10.687,0-14.82L36.416,21.333z" fill="#FFFFFF"/><path d="M480,362.667c-5.891,0-10.667,4.776-10.667,10.667v80.917L316.875,301.792c-4.237-4.093-10.99-3.976-15.083,0.261     c-3.993,4.134-3.993,10.688,0,14.821l152.459,152.459h-80.917c-5.891,0-10.667,4.776-10.667,10.667s4.776,10.667,10.667,10.667     H480c5.891,0,10.667-4.776,10.667-10.667V373.333C490.667,367.442,485.891,362.667,480,362.667z" fill="#FFFFFF"/></g></svg>';
    }
    else
    {
        if(fsElement)
        {
            fsElement.style.display="none";
            fsElement.remove();
            fsElement=null;
        }
    }
}


fpsLimit.onChange=function()
{
    op.patch.config.fpsLimit=fpsLimit.get()||0;
};

op.onDelete=function()
{
    cgl.gl.clearColor(0,0,0,0);
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);

    op.patch.removeOnAnimFrame(op);
};


op.patch.loading.setOnFinishedLoading(function(cb)
{
    op.patch.config.fpsLimit=fpsLimit.get();
});



op.onAnimFrame=function(time)
{
    if(!active.get())return;
    if(cgl.aborted || cgl.canvas.clientWidth===0 || cgl.canvas.clientHeight===0)return;

    if(op.patch.loading.getProgress()<1.0 && reduceLoadingFPS.get())
    {
        op.patch.config.fpsLimit=5;
    }

    if(cgl.canvasWidth==-1)
    {
        cgl.setCanvas(op.patch.config.glCanvasId);
        return;
    }

    if(cgl.canvasWidth!=width.get() || cgl.canvasHeight!=height.get())
    {
        // cgl.canvasWidth=cgl.canvas.clientWidth;
        width.set(cgl.canvasWidth);
        // cgl.canvasHeight=cgl.canvas.clientHeight;
        height.set(cgl.canvasHeight);
    }

    if(CABLES.now()-rframeStart>1000)
    {
        CGL.fpsReport=CGL.fpsReport||[];
        if(op.patch.loading.getProgress()>=1.0 && rframeStart!==0)CGL.fpsReport.push(rframes);
        rframes=0;
        rframeStart=CABLES.now();
    }
    CGL.MESH.lastShader=null;
    CGL.MESH.lastMesh=null;

    cgl.renderStart(cgl,identTranslate,identTranslateView);

    if(clear.get())
    {
        cgl.gl.clearColor(0,0,0,1);
        cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
    }

    trigger.trigger();


    if(CGL.MESH.lastMesh)CGL.MESH.lastMesh.unBind();


    if(CGL.Texture.previewTexture)
    {
        if(!CGL.Texture.texturePreviewer) CGL.Texture.texturePreviewer=new CGL.Texture.texturePreview(cgl);
        CGL.Texture.texturePreviewer.render(CGL.Texture.previewTexture);
    }
    cgl.renderEnd(cgl);
    
    
    // cgl.printError('mainloop end');
    
    

    if(!cgl.frameStore.phong)cgl.frameStore.phong={};
    rframes++;
};


};

Ops.Gl.MainLoop.prototype = new CABLES.Op();
CABLES.OPS["b0472a1d-db16-4ba6-8787-f300fbdc77bb"]={f:Ops.Gl.MainLoop,objName:"Ops.Gl.MainLoop"};




// **************************************************************
// 
// Ops.Gl.Matrix.Transform
// 
// **************************************************************

Ops.Gl.Matrix.Transform = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    render=op.inTrigger("render"),
    posX=op.inValue("posX",0),
    posY=op.inValue("posY",0),
    posZ=op.inValue("posZ",0),
    scale=op.inValue("scale",1),
    rotX=op.inValue("rotX",0),
    rotY=op.inValue("rotY",0),
    rotZ=op.inValue("rotZ",0),
    trigger=op.outTrigger("trigger");

op.setPortGroup('Rotation',[rotX,rotY,rotZ]);
op.setPortGroup('Position',[posX,posY,posZ]);
op.setPortGroup('Scale',[scale]);
op.setUiAxisPorts(posX,posY,posZ);

const cgl=op.patch.cgl;
var vPos=vec3.create();
var vScale=vec3.create();
var transMatrix = mat4.create();
mat4.identity(transMatrix);

var
    doScale=false,
    doTranslate=false,
    translationChanged=true,
    scaleChanged=true,
    rotChanged=true;

rotX.onChange=rotY.onChange=rotZ.onChange=setRotChanged;
posX.onChange=posY.onChange=posZ.onChange=setTranslateChanged;
scale.onChange=setScaleChanged;

render.onTriggered=function()
{
    // if(!CGL.TextureEffect.checkOpNotInTextureEffect(op)) return;

    var updateMatrix=false;
    if(translationChanged)
    {
        updateTranslation();
        updateMatrix=true;
    }
    if(scaleChanged)
    {
        updateScale();
        updateMatrix=true;
    }
    if(rotChanged) updateMatrix=true;

    if(updateMatrix) doUpdateMatrix();

    cgl.pushModelMatrix();
    mat4.multiply(cgl.mMatrix,cgl.mMatrix,transMatrix);

    trigger.trigger();
    cgl.popModelMatrix();

    if(CABLES.UI && gui.patch().isCurrentOp(op))
        gui.setTransformGizmo(
            {
                posX:posX,
                posY:posY,
                posZ:posZ,
            });
};

op.transform3d=function()
{
    return { pos:[posX,posY,posZ] };
};

function doUpdateMatrix()
{
    mat4.identity(transMatrix);
    if(doTranslate)mat4.translate(transMatrix,transMatrix, vPos);

    if(rotX.get()!==0)mat4.rotateX(transMatrix,transMatrix, rotX.get()*CGL.DEG2RAD);
    if(rotY.get()!==0)mat4.rotateY(transMatrix,transMatrix, rotY.get()*CGL.DEG2RAD);
    if(rotZ.get()!==0)mat4.rotateZ(transMatrix,transMatrix, rotZ.get()*CGL.DEG2RAD);

    if(doScale)mat4.scale(transMatrix,transMatrix, vScale);
    rotChanged=false;
}

function updateTranslation()
{
    doTranslate=false;
    if(posX.get()!==0.0 || posY.get()!==0.0 || posZ.get()!==0.0) doTranslate=true;
    vec3.set(vPos, posX.get(),posY.get(),posZ.get());
    translationChanged=false;
}

function updateScale()
{
    // doScale=false;
    // if(scale.get()!==0.0)
    doScale=true;
    vec3.set(vScale, scale.get(),scale.get(),scale.get());
    scaleChanged=false;
}

function setTranslateChanged()
{
    translationChanged=true;
}

function setScaleChanged()
{
    scaleChanged=true;
}

function setRotChanged()
{
    rotChanged=true;
}

doUpdateMatrix();




};

Ops.Gl.Matrix.Transform.prototype = new CABLES.Op();
CABLES.OPS["650baeb1-db2d-4781-9af6-ab4e9d4277be"]={f:Ops.Gl.Matrix.Transform,objName:"Ops.Gl.Matrix.Transform"};




// **************************************************************
// 
// Ops.Trigger.Sequence
// 
// **************************************************************

Ops.Trigger.Sequence = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const exe=op.inTrigger("exe");

var exes=[];
var triggers=[];

var triggerAll=function()
{
    for(var i=0;i<triggers.length;i++) triggers[i].trigger();
};

exe.onTriggered=triggerAll;

var num=16;

for(var i=0;i<num;i++)
{
    triggers.push( op.addOutPort(new CABLES.Port(op,"trigger "+i,CABLES.OP_PORT_TYPE_FUNCTION)) );
    
    if(i<num-1)
    {
        var newExe=op.addInPort(new CABLES.Port(op,"exe "+i,CABLES.OP_PORT_TYPE_FUNCTION));
        newExe.onTriggered=triggerAll;
        exes.push( newExe );
    }
}


};

Ops.Trigger.Sequence.prototype = new CABLES.Op();
CABLES.OPS["641934f6-5143-4a6b-b592-08ab26e2cab0"]={f:Ops.Trigger.Sequence,objName:"Ops.Trigger.Sequence"};




// **************************************************************
// 
// Ops.Devices.Mobile.MotionSensor
// 
// **************************************************************

Ops.Devices.Mobile.MotionSensor = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var mulAxis=op.inValue("Mul Orientation",1);

var axis1=op.outValue("Orientation Alpha");
var axis2=op.outValue("Orientation Beta");
var axis3=op.outValue("Orientation Gamme");

var accX=op.outValue("Acceleration X");
var accY=op.outValue("Acceleration Y");
var accZ=op.outValue("Acceleration Z");

var outObj=op.outObject("Object");


var lastTime=0;
var lastTimeAcc=0;

var obj={};

setTimeout(function(){ 
    registerEvents();
    console.log('window.DeviceOrientationEvent: ', window.DeviceOrientationEvent);
}, 3000);

// op.onLoaded = registerEvents;



function registerEvents() {
  window.addEventListener("devicemotion", function(event)
{
    if(CABLES.now()-lastTimeAcc>15)
    {
        lastTimeAcc=CABLES.now();
        accX.set( event.accelerationIncludingGravity.x || 0);
        accY.set( event.accelerationIncludingGravity.y || 0 );
        accZ.set( event.accelerationIncludingGravity.z || 0 );
        
        obj.AccelerationX=accX.get();
        obj.AccelerationY=accY.get();
        obj.AccelerationZ=accZ.get();

        outObj.set(null);
        outObj.set(obj);
    }

}, true);


window.addEventListener("deviceorientation", function (event)
{
    if(CABLES.now()-lastTime>15)
    {
        lastTime=CABLES.now();
        axis1.set( (event.alpha || 0) *mulAxis.get() );
        axis2.set( (event.beta || 0 ) *mulAxis.get() );
        axis3.set( (event.gamma || 0) *mulAxis.get() );

        obj.OrientationAlpha=axis1.get();
        obj.OrientationBeta=axis2.get();
        obj.OrientationGamma=axis3.get();

        outObj.set(null);
        outObj.set(obj);

    }
}, true);  
}



};

Ops.Devices.Mobile.MotionSensor.prototype = new CABLES.Op();
CABLES.OPS["3b15ad33-0117-4a33-975e-bca154a7f298"]={f:Ops.Devices.Mobile.MotionSensor,objName:"Ops.Devices.Mobile.MotionSensor"};




// **************************************************************
// 
// Ops.Deprecated.Html.Elements.Div
// 
// **************************************************************

Ops.Deprecated.Html.Elements.Div = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// var text=op.addInPort(new CABLES.Port(op,"Text",CABLES.OP_PORT_TYPE_VALUE,{type:'string'}));
var text=op.addInPort(new CABLES.Port(op,"Text",CABLES.OP_PORT_TYPE_VALUE,{type:'string',display:'editor'}));

var id=op.addInPort(new CABLES.Port(op,"Id",CABLES.OP_PORT_TYPE_VALUE,{type:'string'}));
// var classes=op.addInPort(new CABLES.Port(op,"Class",CABLES.OP_PORT_TYPE_VALUE,{type:'string'}));
var classes=op.inValueString("Class");


var visible=op.addInPort(new CABLES.Port(op,"Visible",CABLES.OP_PORT_TYPE_VALUE,{display:"bool"}));
visible.set(true);


var doCenterX=op.inValueBool("Center X",false);
var doCenterY=op.inValueBool("Center Y",false);

var posLeft=op.addInPort(new CABLES.Port(op,"Left",CABLES.OP_PORT_TYPE_VALUE));
var posTop=op.addInPort(new CABLES.Port(op,"Top",CABLES.OP_PORT_TYPE_VALUE));

var borderRadius=op.addInPort(new CABLES.Port(op,"Border radius",CABLES.OP_PORT_TYPE_VALUE));
var fontSize=op.addInPort(new CABLES.Port(op,"Font size",CABLES.OP_PORT_TYPE_VALUE));
var fontFamily=op.addInPort(new CABLES.Port(op,"Font Family",CABLES.OP_PORT_TYPE_VALUE,{type:'string'}));

var cursor=op.addInPort(new CABLES.Port(op,"cursor",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:["auto","crosshair","pointer","Hand","move","n-resize","ne-resize","e-resize","se-resize","s-resize","sw-resize","w-resize","nw-resize","text","wait","help"]} ));

var opacity=op.inValueSlider("Opacity",1.0);

var r=op.addInPort(new CABLES.Port(op,"Text Red",CABLES.OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
var g=op.addInPort(new CABLES.Port(op,"Text Green",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
var b=op.addInPort(new CABLES.Port(op,"Text Blue",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
var a=op.addInPort(new CABLES.Port(op,"Text Opacity",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));

var bgR=op.addInPort(new CABLES.Port(op,"Background Red",CABLES.OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
var bgG=op.addInPort(new CABLES.Port(op,"Background Green",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
var bgB=op.addInPort(new CABLES.Port(op,"Background Blue",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
var bgA=op.addInPort(new CABLES.Port(op,"Background Opacity",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));

var outElement=op.outObject("Element");

r.set(1);
g.set(1);
b.set(1);
a.set(1);

bgR.set(0.5);
bgG.set(0.5);
bgB.set(0.5);
bgA.set(1);

var ignoreMouse=op.addInPort(new CABLES.Port(op,"Ignore Mouse",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
ignoreMouse.set(false);

var autoSize=op.addInPort(new CABLES.Port(op,"Auto width/height",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var width=op.addInPort(new CABLES.Port(op,"Width",CABLES.OP_PORT_TYPE_VALUE));
var height=op.addInPort(new CABLES.Port(op,"Height",CABLES.OP_PORT_TYPE_VALUE));

var clickTrigger=op.addOutPort(new CABLES.Port(op,"OnClick",CABLES.OP_PORT_TYPE_FUNCTION));
var mouseOver=op.addOutPort(new CABLES.Port(op,"MouseOver",CABLES.OP_PORT_TYPE_VALUE,{type:'bool'}));
var clientWidth=op.addOutPort(new CABLES.Port(op,"Client Width",CABLES.OP_PORT_TYPE_VALUE));
var clientHeight=op.addOutPort(new CABLES.Port(op,"Client Height",CABLES.OP_PORT_TYPE_VALUE));


text.set('This is a HTML element');
width.set(100);
height.set(30);
fontSize.set(12);
fontFamily.set("Arial");
autoSize.set(true);
autoSize.set(true);

mouseOver.set(false);
var element=null;


text.onChange=updateText;

classes.onChange=updateClasses;
updateText();


width.onChange=updateSize;
height.onChange=updateSize;
autoSize.onChange=updateSize;
posLeft.onChange=updatePos;
posTop.onChange=updatePos;
doCenterX.onChange=updatePos;
doCenterY.onChange=updatePos;

bgR.onChange=updateBgColor;
bgG.onChange=updateBgColor;
bgB.onChange=updateBgColor;
bgA.onChange=updateBgColor;

r.onChange=updateColor;
g.onChange=updateColor;
b.onChange=updateColor;
a.onChange=updateColor;

opacity.onChange=updateOpacity;

fontSize.onChange=updateFont;
fontFamily.onChange=updateFont;
borderRadius.onChange=updateBorder;
cursor.onChange=updateCursor;
ignoreMouse.onChange=updateIgnoreMouse;
init();

visible.onChange=function()
{
    if(visible.get()) element.style.display="block";
    else element.style.display="none";
};


function updateClientSize()
{
    clientWidth.set(element.clientWidth);
    clientHeight.set(element.clientHeight);
}

function updateSize()
{
    if(!element) return;
    if(!autoSize.get())
    {
        element.style.width=width.get()+"px";
        element.style.height=height.get()+"px";
    }
    else
    {
        element.style.height="auto";
        element.style.width="auto";
    }
    updateClientSize();
}

function updateFont()
{
    if(!element) return;
    element.style['font-size']=fontSize.get()+"px";
    element.style['font-family']=fontFamily.get();
    updateClientSize();
}

function updateBorder()
{
    if(!element) return;
    element.style['border-radius']=borderRadius.get()+"px";
}

function updateBgColor()
{
    if(!element) return;
    element.style["background-color"]='rgba('+Math.round(bgR.get()*255)+','+Math.round(bgG.get()*255)+','+Math.round(bgB.get()*255)+','+(bgA.get())+')';
}

function updateOpacity()
{
    if(!element) return;
    element.style.opacity=opacity.get();
}

function updateColor()
{
    if(!element) return;
    element.style.color='rgba('+Math.round(r.get()*255)+','+Math.round(g.get()*255)+','+Math.round(b.get()*255)+','+(a.get())+')';
}

function updatePos()
{
    if(!element) return;
    var l=posLeft.get();
    var t=posTop.get();
    if(doCenterX.get()) l-=element.clientWidth/2;
    if(doCenterY.get()) t-=element.clientHeight/2;

    element.style['margin-left']=l+"px";
    element.style['margin-top']=t+"px";
    updateClientSize();
}

function updateCursor()
{
    if(!element) return;
    element.style.cursor=cursor.get();
}

function updateIgnoreMouse()
{
    if(ignoreMouse.get()) element.style['pointer-events']="none";
        else element.style['pointer-events']="default";
};

function updateText()
{
    if(!element)return;
    var str=String(text.get()||'').replace(/(?:\r\n|\r|\n)/g, '<br />');


    element.innerHTML=str;
    updateClientSize();
};

id.onChange=function()
{
    element.id=id.get();
};

function updateClasses()
{
    if(element)
    {
        element.className = classes.get();
    }
    
}



function init()
{
    element = document.createElement('div');
    outElement.set(element);
    element.style.padding="10px";
    element.style.position="absolute";
    element.style.overflow="hidden";
    element.style["z-index"]="9999";
    
    // element.style["background-color"]="#f00";
    

    // var canvas = document.getElementById("cablescanvas") || document.body; 
    var canvas = op.patch.cgl.canvas.parentElement;
    canvas.appendChild(element);

    updateSize();
    updatePos();
    updateBgColor();
    updateColor();
    updateBorder();
    updateFont();
    updateClientSize();
    updateCursor();
    updateIgnoreMouse();
    updateOpacity();
    
    element.onclick=function(e)
    {
        clickTrigger.trigger();
        e.preventDefault();
    };

    element.ontouchstart=function(e)
    {
        clickTrigger.trigger();
        e.preventDefault();
    };

    element.onmouseover=function()
    {
        mouseOver.set(true);
    };

    element.onmouseleave=function()
    {
        mouseOver.set(false);
    };
    
    updateText();
    updateClasses();
}

op.onDelete=function()
{
    element.remove();
}

};

Ops.Deprecated.Html.Elements.Div.prototype = new CABLES.Op();
CABLES.OPS["4b7c6c44-54a6-4ac6-82ac-3de2450cbc80"]={f:Ops.Deprecated.Html.Elements.Div,objName:"Ops.Deprecated.Html.Elements.Div"};




// **************************************************************
// 
// Ops.String.StringCompose
// 
// **************************************************************

Ops.String.StringCompose = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var format=op.inValueString('Format',"hello $a, $b $c und $d");
var a=op.inValueString('String A','world');
var b=op.inValueString('String B',1);
var c=op.inValueString('String C',2);
var d=op.inValueString('String D',3);
var e=op.inValueString('String E');
var f=op.inValueString('String F');
var result=op.outValue("Result");

format.onChange=
a.onChange=
b.onChange=
c.onChange=
d.onChange=
e.onChange=
f.onChange=update;

update();

function update()
{
    var str=format.get()||'';
    if(typeof str!='string')
    {
        str='';
    }

    str = str.replace(/\$a/g, a.get());
    str = str.replace(/\$b/g, b.get());
    str = str.replace(/\$c/g, c.get());
    str = str.replace(/\$d/g, d.get());
    str = str.replace(/\$e/g, e.get());
    str = str.replace(/\$f/g, f.get());

    result.set(str);
}

};

Ops.String.StringCompose.prototype = new CABLES.Op();
CABLES.OPS["046f9917-939c-4007-8116-6ab1a1f1d9d0"]={f:Ops.String.StringCompose,objName:"Ops.String.StringCompose"};




// **************************************************************
// 
// Ops.Math.Round
// 
// **************************************************************

Ops.Math.Round = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    result=op.outValue("result"),
    number1=op.inValueFloat("number"),
    decPlaces=op.inValueFloat("Decimal Places",0);

number1.onChange=decPlaces.onChange=exec;

function exec()
{
    var decm=Math.pow(10,decPlaces.get());
    result.set(Math.round(number1.get()*decm)/decm);
}



};

Ops.Math.Round.prototype = new CABLES.Op();
CABLES.OPS["1a1ef636-6d02-42ba-ae1e-627b917d0d2b"]={f:Ops.Math.Round,objName:"Ops.Math.Round"};




// **************************************************************
// 
// Ops.Gl.Meshes.Cube
// 
// **************************************************************

Ops.Gl.Meshes.Cube = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    render=op.inTrigger('render'),
    width=op.inValue('width',1),
    height=op.inValue('height',1),
    lengt=op.inValue('length',1),
    center=op.inValueBool('center',true),
    active=op.inValueBool('Active',true),
    trigger=op.outTrigger('trigger'),
    geomOut=op.outObject("geometry");

const cgl=op.patch.cgl;

op.setPortGroup("Geometry",[width,height,lengt]);

var geom=null;
var mesh=null;

width.onChange=buildMesh;
height.onChange=buildMesh;
lengt.onChange=buildMesh;
center.onChange=buildMesh;

buildMesh();


render.onTriggered=function()
{
    if(active.get() && mesh) mesh.render(cgl.getShader());
    trigger.trigger();
};

op.preRender=function()
{
    buildMesh();
    mesh.render(cgl.getShader());
};

function buildMesh()
{
    if(!geom)geom=new CGL.Geometry("cubemesh");
    geom.clear();

    var x=width.get();
    var nx=-1*width.get();
    var y=lengt.get();
    var ny=-1*lengt.get();
    var z=height.get();
    var nz=-1*height.get();

    if(!center.get())
    {
        nx=0;
        ny=0;
        nz=0;
    }
    else
    {
        x*=0.5;
        nx*=0.5;
        y*=0.5;
        ny*=0.5;
        z*=0.5;
        nz*=0.5;
    }

    geom.vertices = [
        // Front face
        nx, ny,  z,
        x, ny,  z,
        x,  y,  z,
        nx,  y,  z,
        // Back face
        nx, ny, nz,
        nx,  y, nz,
        x,  y, nz,
        x, ny, nz,
        // Top face
        nx,  y, nz,
        nx,  y,  z,
        x,  y,  z,
        x,  y, nz,
        // Bottom face
        nx, ny, nz,
        x, ny, nz,
        x, ny,  z,
        nx, ny,  z,
        // Right face
        x, ny, nz,
        x,  y, nz,
        x,  y,  z,
        x, ny,  z,
        // zeft face
        nx, ny, nz,
        nx, ny,  z,
        nx,  y,  z,
        nx,  y, nz
        ];

    geom.setTexCoords( [
          // Front face
          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
          0.0, 0.0,
          // Back face
          1.0, 1.0,
          1.0, 0.0,
          0.0, 0.0,
          0.0, 1.0,
          // Top face
          0.0, 0.0,
          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
          // Bottom face
          1.0, 0.0,
          0.0, 0.0,
          0.0, 1.0,
          1.0, 1.0,
          // Right face
          1.0, 1.0,
          1.0, 0.0,
          0.0, 0.0,
          0.0, 1.0,
          // Left face
          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
          0.0, 0.0,
        ]);

    geom.vertexNormals = [
        // Front face
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,

        // Back face
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,

        // Top face
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,

        // Bottom face
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,

        // Right face
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];
    geom.tangents = [
        // front face
        -1,0,0, -1,0,0, -1,0,0, -1,0,0,
        // back face
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        // top face
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        // bottom face
        -1,0,0, -1,0,0, -1,0,0, -1,0,0,
        // right face
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
        // left face
        0,0,1, 0,0,1, 0,0,1, 0,0,1
    ];
    geom.biTangents = [
        // front face
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
        // back face
        0,1,0, 0,1,0, 0,1,0, 0,1,0,
        // top face
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
        // bottom face
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        // right face
        0,1,0, 0,1,0, 0,1,0, 0,1,0,
        // left face
        0,1,0, 0,1,0, 0,1,0, 0,1,0
    ];

    geom.verticesIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];

    if(mesh)mesh.dispose();
    mesh=new CGL.Mesh(cgl,geom);
    geomOut.set(null);
    geomOut.set(geom);
}


op.onDelete=function()
{
    if(mesh)mesh.dispose();
}

};

Ops.Gl.Meshes.Cube.prototype = new CABLES.Op();
CABLES.OPS["ff0535e2-603a-4c07-9ce6-e9e0db857dfe"]={f:Ops.Gl.Meshes.Cube,objName:"Ops.Gl.Meshes.Cube"};




// **************************************************************
// 
// Ops.Gl.Textures.TextureSVG
// 
// **************************************************************

Ops.Gl.Textures.TextureSVG = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var filename=op.addInPort(new CABLES.Port(op,"file",CABLES.OP_PORT_TYPE_VALUE,{ display:'file',type:'string' } ));

var texWidth=op.inValueInt("texture width");
var texHeight=op.inValueInt("texture height");

var wrap=op.addInPort(new CABLES.Port(op,"wrap",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['repeat','mirrored repeat','clamp to edge']}));
var tfilter=op.addInPort(new CABLES.Port(op,"filter",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['nearest','linear','mipmap']}));

var textureOut=op.outTexture("texture");


tfilter.onChange=onFilterChange;
wrap.onChange=onWrapChange;


texWidth.set(1024);
texHeight.set(1024);

var cgl=op.patch.cgl;
var canvas=null;
var ctx=null;

function removeCanvas()
{
    if(!canvas)return;
    canvas.remove();
    canvas=null;
}

function createCanvas()
{
    if(canvas)removeCanvas();
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d',{alpha:true});

    ctx.canvas.width=canvas.width=texWidth.get();
    ctx.canvas.height=canvas.height=texHeight.get();

    canvas.style.display = "none";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
}


textureOut.set(new CGL.Texture(cgl));

function reSize()
{
    update();
}

var data = "data:image/svg+xml," +
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
            //  '<em>I</em> like ' + 
            //  '<span style="color:white; text-shadow:0 0 2px blue;">' +
            //  'cables</span>' +
           '</div>' +
           '</foreignObject>' +
           '</svg>';

var cgl_filter=CGL.Texture.FILTER_MIPMAP;
var cgl_wrap=CGL.Texture.WRAP_REPEAT;

function onFilterChange()
{
    if(tfilter.get()=='nearest') cgl_filter=CGL.Texture.FILTER_NEAREST;
    if(tfilter.get()=='linear') cgl_filter=CGL.Texture.FILTER_LINEAR;
    if(tfilter.get()=='mipmap') cgl_filter=CGL.Texture.FILTER_MIPMAP;

    reload();
}

function onWrapChange()
{
    if(wrap.get()=='repeat') cgl_wrap=CGL.Texture.WRAP_REPEAT;
    if(wrap.get()=='mirrored repeat') cgl_wrap=CGL.Texture.WRAP_MIRRORED_REPEAT;
    if(wrap.get()=='clamp to edge') cgl_wrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;

    reload();
}


function reload()
{
    var loadingId=op.patch.loading.start('svg file',filename.get());
    CABLES.ajax(
        op.patch.getFilePath(filename.get()),
        function(err,_data,xhr)
        {
            data="data:image/svg+xml,"+_data;
            
            data=data.replace( /#/g, '%23' );
            // console.log(data);
            
            op.patch.loading.finished(loadingId);
            update();
        }
    );
}

function update()
{
    
    
    var img = new Image();
    var loadingId=op.patch.loading.start('svg2texture',filename.get());

    img.onerror = function(e)
    {
        op.patch.loading.finished(loadingId);
        op.uiAttr( { 'error': 'Could not load SVG file!' } );
        console.log('Could not load SVG file');
        console.log(e);
        
    };
    
    img.onload = function()
    {
        createCanvas();
        op.patch.loading.finished(loadingId);
        canvas.width=texWidth.get();
        canvas.height=texHeight.get();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height );
        textureOut.set(new CGL.Texture.createFromImage(cgl,canvas,
        {
            wrap:cgl_wrap,
            filter:cgl_filter,
            width: canvas.width, 
            height: canvas.height,
            unpackAlpha:true
        }));
        removeCanvas();
    };

    img.src = data;
    
}

op.onFileChanged=function(fn)
{
    if(filename.get() && filename.get().endsWith(fn))
    {
        reload();
    }
};

filename.onValueChange(reload);

texWidth.onChange=reSize;
texHeight.onChange=reSize;

createCanvas();
reSize();

tfilter.set("mipmap");

};

Ops.Gl.Textures.TextureSVG.prototype = new CABLES.Op();
CABLES.OPS["ecd162d1-615e-4d97-8376-9edbbc51aee1"]={f:Ops.Gl.Textures.TextureSVG,objName:"Ops.Gl.Textures.TextureSVG"};




// **************************************************************
// 
// Ops.Gl.FaceCulling
// 
// **************************************************************

Ops.Gl.FaceCulling = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    render=op.inTrigger("render"),
    trigger=op.outTrigger("trigger"),
    enable=op.inValueBool("enable",true),
    facing=op.inValueSelect("facing",['back','front','both'],'back'),
    cgl=op.patch.cgl;

var whichFace=cgl.gl.BACK;

render.onTriggered=function()
{
    if(enable.get()) cgl.gl.enable(cgl.gl.CULL_FACE);
        else cgl.gl.disable(cgl.gl.CULL_FACE);

    cgl.gl.cullFace(whichFace);
    trigger.trigger();
    cgl.gl.disable(cgl.gl.CULL_FACE);
};

facing.onChange=function()
{
    whichFace=cgl.gl.BACK;
    if(facing.get()=='front') whichFace=cgl.gl.FRONT;
        else if(facing.get()=='both') whichFace=cgl.gl.FRONT_AND_BACK;
};

};

Ops.Gl.FaceCulling.prototype = new CABLES.Op();
CABLES.OPS["a389f42c-7324-45c9-bb47-369e31d602f0"]={f:Ops.Gl.FaceCulling,objName:"Ops.Gl.FaceCulling"};




// **************************************************************
// 
// Ops.Math.MapRange
// 
// **************************************************************

Ops.Math.MapRange = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const result=op.outValue("result");
var v=op.inValueFloat("value");
var old_min=op.inValueFloat("old min");
var old_max=op.inValueFloat("old max");
var new_min=op.inValueFloat("new min");
var new_max=op.inValueFloat("new max");
var easing=op.inValueSelect("Easing",["Linear","Smoothstep","Smootherstep"],"Linear");

op.setPortGroup("Input Range",[old_min,old_max]);
op.setPortGroup("Output Range",[new_min,new_max]);

var ease=0;
var r=0;

easing.onChange=function()
{
    if(easing.get()=="Smoothstep") ease=1;
        else if(easing.get()=="Smootherstep") ease=2;
            else ease=0;
};


function exec()
{
    if(v.get()>=Math.max( old_max.get(),old_min.get() ))
    {
        result.set(new_max.get());
        return;
    }
    else
    if(v.get()<=Math.min( old_max.get(),old_min.get() ))
    {
        result.set(new_min.get());
        return;
    }

    var nMin=new_min.get();
    var nMax=new_max.get();
    var oMin=old_min.get();
    var oMax=old_max.get();
    var x=v.get();

    var reverseInput = false;
    var oldMin = Math.min( oMin, oMax );
    var oldMax = Math.max( oMin, oMax );
    if(oldMin!= oMin) reverseInput = true;

    var reverseOutput = false;
    var newMin = Math.min( nMin, nMax );
    var newMax = Math.max( nMin, nMax );
    if(newMin != nMin) reverseOutput = true;

    var portion=0;

    if(reverseInput) portion = (oldMax-x)*(newMax-newMin)/(oldMax-oldMin);
        else portion = (x-oldMin)*(newMax-newMin)/(oldMax-oldMin);

    if(reverseOutput) r=newMax - portion;
        else r=portion + newMin;

    if(ease===0)
    {
        result.set(r);
    }
    else
    if(ease==1)
    {
        x = Math.max(0, Math.min(1, (r-nMin)/(nMax-nMin)));
        result.set( nMin+x*x*(3 - 2*x)* (nMax-nMin) ); // smoothstep
    }
    else
    if(ease==2)
    {
        x = Math.max(0, Math.min(1, (r-nMin)/(nMax-nMin)));
        result.set( nMin+x*x*x*(x*(x*6 - 15) + 10) * (nMax-nMin) ) ; // smootherstep
    }

}

v.set(0);
old_min.set(0);
old_max.set(1);
new_min.set(-1);
new_max.set(1);


v.onChange=exec;
old_min.onChange=exec;
old_max.onChange=exec;
new_min.onChange=exec;
new_max.onChange=exec;

result.set(0);

exec();

};

Ops.Math.MapRange.prototype = new CABLES.Op();
CABLES.OPS["2617b407-60a0-4ff6-b4a7-18136cfa7817"]={f:Ops.Math.MapRange,objName:"Ops.Math.MapRange"};




// **************************************************************
// 
// Ops.Gl.Shader.BasicMaterialNew
// 
// **************************************************************

Ops.Gl.Shader.BasicMaterialNew = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={basicmaterial_frag:"{{MODULES_HEAD}}\n\nIN vec2 texCoord;\nUNI float r;\nUNI float g;\nUNI float b;\nUNI float a;\n\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        UNI sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        UNI sampler2D texOpacity;\n   #endif\n#endif\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=vec4(r,g,b,a);\n\n    #ifdef HAS_TEXTURES\n        vec2 uv=vec2(texCoord.s,1.0-texCoord.t);\n\n        #ifdef HAS_TEXTURE_DIFFUSE\n            col=texture(tex,uv);\n\n            #ifdef COLORIZE_TEXTURE\n                col.r*=r;\n                col.g*=g;\n                col.b*=b;\n            #endif\n        #endif\n        col.a*=a;\n        #ifdef HAS_TEXTURE_OPACITY\n            #ifdef TRANSFORMALPHATEXCOORDS\n                uv=vec2(texCoordOrig.s,1.0-texCoordOrig.t);\n            #endif\n            #ifdef ALPHA_MASK_ALPHA\n                col.a*=texture(texOpacity,uv).a;\n            #endif\n            #ifdef ALPHA_MASK_LUMI\n                col.a*=dot(vec3(0.2126,0.7152,0.0722), texture(texOpacity,uv).rgb);\n            #endif\n            #ifdef ALPHA_MASK_R\n                col.a*=texture(texOpacity,uv).r;\n            #endif\n            #ifdef ALPHA_MASK_G\n                col.a*=texture(texOpacity,uv).g;\n            #endif\n            #ifdef ALPHA_MASK_B\n                col.a*=texture(texOpacity,uv).b;\n            #endif\n            // #endif\n        #endif\n    #endif\n\n    {{MODULE_COLOR}}\n\n    #ifdef DISCARDTRANS\n        if(col.a<0.2) discard;\n    #endif\n\n    outColor = col;\n}\n",basicmaterial_vert:"{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nIN vec3 attrVertNormal;\nIN vec2 attrTexCoord;\n\nOUT vec3 norm;\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TEXTURES\n    UNI float diffuseRepeatX;\n    UNI float diffuseRepeatY;\n    UNI float texOffsetX;\n    UNI float texOffsetY;\n#endif\n\n\nvoid main()\n{\n    mat4 mMatrix=modelMatrix;\n    mat4 mvMatrix;\n\n    texCoordOrig=attrTexCoord;\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        texCoord.x=texCoord.x*diffuseRepeatX+texOffsetX;\n        texCoord.y=texCoord.y*diffuseRepeatY+texOffsetY;\n    #endif\n\n    vec4 pos = vec4( vPosition, 1. );\n\n\n    #ifdef BILLBOARD\n       vec3 position=vPosition;\n       mvMatrix=viewMatrix*modelMatrix;\n\n       gl_Position = projMatrix * mvMatrix * vec4((\n           position.x * vec3(\n               mvMatrix[0][0],\n               mvMatrix[1][0],\n               mvMatrix[2][0] ) +\n           position.y * vec3(\n               mvMatrix[0][1],\n               mvMatrix[1][1],\n               mvMatrix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifndef BILLBOARD\n        mvMatrix=viewMatrix * mMatrix;\n    #endif\n\n\n    #ifndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n        gl_Position = projMatrix * mvMatrix * pos;\n    #endif\n}\n",};
const render=op.inTrigger("render");
const trigger=op.outTrigger('trigger');
const shaderOut=op.outObject("shader");
shaderOut.ignoreValueSerialize=true;

const cgl=op.patch.cgl;


op.toWorkPortsNeedToBeLinked(render,trigger);



const shader=new CGL.Shader(cgl,"basicmaterialnew");
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);
shader.bindTextures=bindTextures;
shader.setSource(attachments.basicmaterial_vert,attachments.basicmaterial_frag);
shaderOut.set(shader);

render.onTriggered=doRender;

function bindTextures()
{
    if(diffuseTexture.get()) cgl.setTexture(0, diffuseTexture.get().tex);
    if(op.textureOpacity.get()) cgl.setTexture(1, op.textureOpacity.get().tex);
}

op.preRender=function()
{
    shader.bind();
    doRender();
};

function doRender()
{
    if(!shader)return;

    cgl.setShader(shader);
    shader.bindTextures();
    trigger.trigger();
    cgl.setPreviousShader();
}

// rgba colors
const r=op.inValueSlider("r",Math.random());
const g=op.inValueSlider("g",Math.random());
const b=op.inValueSlider("b",Math.random());
const a=op.inValueSlider("a",1);
r.setUiAttribs({"colorPick":true});

const unir=new CGL.Uniform(shader,'f','r',r);
const unig=new CGL.Uniform(shader,'f','g',g);
const unib=new CGL.Uniform(shader,'f','b',b);
const unia=new CGL.Uniform(shader,'f','a',a);

op.setPortGroup("Color",[r,g,b,a]);





    // diffuse outTexture

    var diffuseTexture=op.inTexture("texture");
    var diffuseTextureUniform=null;
    shader.bindTextures=bindTextures;

    diffuseTexture.onChange=updateDiffuseTexture;

    function updateDiffuseTexture()
    {
        if(diffuseTexture.get())
        {
            if(!shader.hasDefine('HAS_TEXTURE_DIFFUSE'))shader.define('HAS_TEXTURE_DIFFUSE');
            if(!diffuseTextureUniform)diffuseTextureUniform=new CGL.Uniform(shader,'t','texDiffuse',0);

            diffuseRepeatX.setUiAttribs({greyout:false});
            diffuseRepeatY.setUiAttribs({greyout:false});
            diffuseOffsetX.setUiAttribs({greyout:false});
            diffuseOffsetY.setUiAttribs({greyout:false});
            colorizeTexture.setUiAttribs({greyout:false});
        }
        else
        {
            shader.removeUniform('texDiffuse');
            shader.removeDefine('HAS_TEXTURE_DIFFUSE');
            diffuseTextureUniform=null;

            diffuseRepeatX.setUiAttribs({greyout:true});
            diffuseRepeatY.setUiAttribs({greyout:true});
            diffuseOffsetX.setUiAttribs({greyout:true});
            diffuseOffsetY.setUiAttribs({greyout:true});
            colorizeTexture.setUiAttribs({greyout:true});

        }
    };
const colorizeTexture=op.inValueBool("colorizeTexture",false);

op.setPortGroup("Color Texture",[diffuseTexture,colorizeTexture]);


// opacity texture
op.textureOpacity=op.inTexture("textureOpacity");
op.textureOpacityUniform=null;

op.alphaMaskSource=op.inValueSelect("Alpha Mask Source",["Alpha Channel","Luminance","R","G","B"],"Luminance");
op.alphaMaskSource.onChange=updateAlphaMaskMethod;
op.alphaMaskSource.setUiAttribs({greyout:true});

function updateAlphaMaskMethod()
{
    if(op.alphaMaskSource.get()=='Alpha Channel') shader.define('ALPHA_MASK_ALPHA');
        else shader.removeDefine('ALPHA_MASK_ALPHA');

    if(op.alphaMaskSource.get()=='Luminance') shader.define('ALPHA_MASK_LUMI');
        else shader.removeDefine('ALPHA_MASK_LUMI');

    if(op.alphaMaskSource.get()=='R') shader.define('ALPHA_MASK_R');
        else shader.removeDefine('ALPHA_MASK_R');

    if(op.alphaMaskSource.get()=='G') shader.define('ALPHA_MASK_G');
        else shader.removeDefine('ALPHA_MASK_G');

    if(op.alphaMaskSource.get()=='B') shader.define('ALPHA_MASK_B');
        else shader.removeDefine('ALPHA_MASK_B');
}

op.textureOpacity.onChange=updateOpacity;
function updateOpacity()
{

    if(op.textureOpacity.get())
    {
        if(op.textureOpacityUniform!==null)return;
        shader.removeUniform('texOpacity');
        shader.define('HAS_TEXTURE_OPACITY');
        if(!op.textureOpacityUniform)op.textureOpacityUniform=new CGL.Uniform(shader,'t','texOpacity',1);

        op.alphaMaskSource.setUiAttribs({greyout:false});
        discardTransPxl.setUiAttribs({greyout:false});
        texCoordAlpha.setUiAttribs({greyout:false});

    }
    else
    {
        shader.removeUniform('texOpacity');
        shader.removeDefine('HAS_TEXTURE_OPACITY');
        op.textureOpacityUniform=null;

        op.alphaMaskSource.setUiAttribs({greyout:true});
        discardTransPxl.setUiAttribs({greyout:true});
        texCoordAlpha.setUiAttribs({greyout:true});
    }
    updateAlphaMaskMethod();
};


var texCoordAlpha=op.inValueBool("Opacity TexCoords Transform",false);
const discardTransPxl=op.inValueBool("Discard Transparent Pixels");

discardTransPxl.onChange=function()
{
    if(discardTransPxl.get()) shader.define('DISCARDTRANS');
        else shader.removeDefine('DISCARDTRANS');
};


texCoordAlpha.onChange=function()
{
    if(texCoordAlpha.get()) shader.define('TRANSFORMALPHATEXCOORDS');
        else shader.removeDefine('TRANSFORMALPHATEXCOORDS');
};

op.setPortGroup("Opacity",[op.textureOpacity,op.alphaMaskSource,discardTransPxl,texCoordAlpha]);


colorizeTexture.onChange=function()
{
    if(colorizeTexture.get()) shader.define('COLORIZE_TEXTURE');
        else shader.removeDefine('COLORIZE_TEXTURE');
};




// texture coords

const diffuseRepeatX=op.inValue("diffuseRepeatX",1);
const diffuseRepeatY=op.inValue("diffuseRepeatY",1);
const diffuseOffsetX=op.inValue("Tex Offset X",0);
const diffuseOffsetY=op.inValue("Tex Offset Y",0);

const diffuseRepeatXUniform=new CGL.Uniform(shader,'f','diffuseRepeatX',diffuseRepeatX);
const diffuseRepeatYUniform=new CGL.Uniform(shader,'f','diffuseRepeatY',diffuseRepeatY);
const diffuseOffsetXUniform=new CGL.Uniform(shader,'f','texOffsetX',diffuseOffsetX);
const diffuseOffsetYUniform=new CGL.Uniform(shader,'f','texOffsetY',diffuseOffsetY);

op.setPortGroup("Texture Transform",[diffuseRepeatX,diffuseRepeatY,diffuseOffsetX,diffuseOffsetY]);



const doBillboard=op.inValueBool("billboard",false);

doBillboard.onChange=function()
{
    if(doBillboard.get()) shader.define('BILLBOARD');
        else shader.removeDefine('BILLBOARD');
};

updateOpacity();
updateDiffuseTexture();

};

Ops.Gl.Shader.BasicMaterialNew.prototype = new CABLES.Op();
CABLES.OPS["51f2207b-daaa-447f-bdbe-87fdd72f0c40"]={f:Ops.Gl.Shader.BasicMaterialNew,objName:"Ops.Gl.Shader.BasicMaterialNew"};




// **************************************************************
// 
// Ops.Math.Abs
// 
// **************************************************************

Ops.Math.Abs = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const number=op.inValue("number");
const result=op.outValue("result");

number.onChange=function()
{
    result.set( Math.abs(number.get()) );
};

};

Ops.Math.Abs.prototype = new CABLES.Op();
CABLES.OPS["6b5af21d-065f-44d2-9442-8b7a254753f6"]={f:Ops.Math.Abs,objName:"Ops.Math.Abs"};




// **************************************************************
// 
// Ops.Gl.ClearColor
// 
// **************************************************************

Ops.Gl.ClearColor = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    render=op.inTrigger("render"),
    trigger=op.outTrigger("trigger"),
    r=op.inValueSlider("r",0.1),
    g=op.inValueSlider("g",0.1),
    b=op.inValueSlider("b",0.1),
    a=op.inValueSlider("a",1);

r.setUiAttribs({ colorPick: true });

const cgl=op.patch.cgl;

render.onTriggered=function()
{
    cgl.gl.clearColor(r.get(),g.get(),b.get(),a.get());
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
    trigger.trigger();
};


};

Ops.Gl.ClearColor.prototype = new CABLES.Op();
CABLES.OPS["19b441eb-9f63-4f35-ba08-b87841517c4d"]={f:Ops.Gl.ClearColor,objName:"Ops.Gl.ClearColor"};




// **************************************************************
// 
// Ops.Gl.Textures.Text
// 
// **************************************************************

Ops.Gl.Textures.Text = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var text=op.addInPort(new CABLES.Port(op,"text",CABLES.OP_PORT_TYPE_VALUE,{type:'string',display:'editor'}));
var inFontSize=op.addInPort(new CABLES.Port(op,"fontSize"));
var maximize=op.addInPort(new CABLES.Port(op,"Maximize Size",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var texWidth=op.addInPort(new CABLES.Port(op,"texture width"));
var texHeight=op.addInPort(new CABLES.Port(op,"texture height"));
var align=op.addInPort(new CABLES.Port(op,"align",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['left','center','right']}));
var valign=op.addInPort(new CABLES.Port(op,"vertical align",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['top','center','bottom']}));
var font=op.addInPort(new CABLES.Port(op,"font",CABLES.OP_PORT_TYPE_VALUE,{type:'string'}));
var lineDistance=op.addInPort(new CABLES.Port(op,"line distance"));
var border=op.addInPort(new CABLES.Port(op,"border"));
var doRefresh=op.inTriggerButton("Refresh");

var cachetexture=op.inValueBool("Reuse Texture",true);

// var textureOut=op.addOutPort(new CABLES.Port(op,"texture",CABLES.OP_PORT_TYPE_TEXTURE));
var textureOut=op.outTexture("texture");
var outRatio=op.addOutPort(new CABLES.Port(op,"Ratio",CABLES.OP_PORT_TYPE_VALUE));
textureOut.ignoreValueSerialize=true;

var cgl=op.patch.cgl;

doRefresh.onTriggered=refresh;

border.set(0);
texWidth.set(512);
texHeight.set(512);
lineDistance.set(1);
inFontSize.set(30);
font.set('Arial');
align.set('center');
valign.set('center');

var fontImage = document.createElement('canvas');
fontImage.id = "texturetext_"+CABLES.generateUUID();
fontImage.style.display = "none";
var body = document.getElementsByTagName("body")[0];
body.appendChild(fontImage);



var ctx = fontImage.getContext('2d');


function reSize()
{
    textureOut.get().setSize(texWidth.get(),texHeight.get());

    ctx.canvas.width=fontImage.width=texWidth.get();
    ctx.canvas.height=fontImage.height=texHeight.get();
    refresh();
}

function refresh()
{
    ctx.clearRect(0,0,fontImage.width,fontImage.height);
    ctx.fillStyle = 'white';
    var fontSize=parseFloat(inFontSize.get());
    var fontname=font.get()+'';
    if(fontname.indexOf(" ")>-1)fontname='"'+fontname+'"';
    ctx.font = fontSize+'px '+fontname+'';
    ctx.textAlign = align.get();

    if(border.get()>0)
    {
        ctx.beginPath();
        ctx.lineWidth=""+border.get();
        ctx.strokeStyle="white";
        ctx.rect(
            0,
            0,
            texWidth.get(),
            texHeight.get()
            );
        ctx.stroke();
    }

    var i=0;

    // if(text.get())
    {
        var txt=(text.get()+'').replace(/<br\/>/g, '\n');
        var txt=(text.get()+'').replace(/<br>/g, '\n');

        var strings = txt.split("\n");


        var posy=0,i=0;

        if(maximize.get())
        {
            fontSize=texWidth.get();
            var count=0;
            var maxWidth=0;
            var maxHeight=0;

            do
            {
                count++;
                if(count>300)break;
                fontSize-=10;
                ctx.font = fontSize+'px "'+font.get()+'"';
                maxWidth=0;
                maxHeight=strings.length*fontSize*1.1;
                for(i=0;i<strings.length;i++)
                {
                    maxWidth=Math.max(maxWidth,ctx.measureText(strings[i]).width);
                }
            }
            while(maxWidth>ctx.canvas.width || maxHeight>ctx.canvas.height);
        }

        if(valign.get()=='center')
        {
            var maxy=(strings.length-1.5)*fontSize+parseFloat(lineDistance.get());
            posy=ctx.canvas.height / 2-maxy/2;
        }
        else if(valign.get()=='top') posy=fontSize;
        else if(valign.get()=='bottom')  posy=ctx.canvas.height -(strings.length)*(parseFloat(inFontSize.get())+parseFloat(lineDistance.get()));

        for(i=0;i<strings.length;i++)
        {
            if(align.get()=='center') ctx.fillText(strings[i], ctx.canvas.width / 2, posy);
            if(align.get()=='left') ctx.fillText(strings[i], 0, posy);
            if(align.get()=='right') ctx.fillText(strings[i], ctx.canvas.width, posy);
            posy+=fontSize+parseFloat(lineDistance.get());
        }
    }

    ctx.restore();
    outRatio.set(ctx.canvas.height/ctx.canvas.width);


    if(!cachetexture.get() || !textureOut.get()) textureOut.set(new CGL.Texture.createFromImage( cgl, fontImage, { filter:CGL.Texture.FILTER_MIPMAP } ));
        else textureOut.get().initTexture(fontImage,CGL.Texture.FILTER_MIPMAP);

    textureOut.get().unpackAlpha=true;
}

align.onChange=refresh;
valign.onChange=refresh;
text.onChange=refresh;
inFontSize.onChange=refresh;
font.onChange=refresh;
lineDistance.onChange=refresh;
maximize.onChange=refresh;

texWidth.onChange=reSize;
texHeight.onChange=reSize;

border.onChange=refresh;

text.set('cables');
reSize();

};

Ops.Gl.Textures.Text.prototype = new CABLES.Op();
CABLES.OPS["84a1d08e-c0c7-4f73-9e15-06dd86e854d3"]={f:Ops.Gl.Textures.Text,objName:"Ops.Gl.Textures.Text"};




// **************************************************************
// 
// Ops.Math.Multiply
// 
// **************************************************************

Ops.Math.Multiply = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const number1=op.inValueFloat("number1");
const number2=op.inValueFloat("number2");
const result=op.outValue("result");

number1.set(1);
number2.set(2);

number1.onChange=update;
number2.onChange=update;
update();

function update()
{
    const n1=number1.get();
    const n2=number2.get();

    if(isNaN(n1))n1=0;
    if(isNaN(n2))n2=0;

    result.set( n1*n2 );
}



};

Ops.Math.Multiply.prototype = new CABLES.Op();
CABLES.OPS["1bbdae06-fbb2-489b-9bcc-36c9d65bd441"]={f:Ops.Math.Multiply,objName:"Ops.Math.Multiply"};




// **************************************************************
// 
// Ops.Value.DelayedValue
// 
// **************************************************************

Ops.Value.DelayedValue = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

var exe=op.inTrigger("Update");
var v=op.inValue("Value",0);
var delay=op.inValue("Delay",0.5);
var result=op.outValue("Result",0);
var clear=op.inValueBool("Clear on Change",true);

var anim=new CABLES.Anim();
anim.createPort(op,"easing",function(){}).set("absolute");

exe.onTriggered=function()
{
    result.set(anim.getValue( op.patch.freeTimer.get() )||0);
};

v.onChange=function()
{
    var current=anim.getValue( op.patch.freeTimer.get() );
    var t=op.patch.freeTimer.get();

    if(clear.get()) anim.clear(t);

    anim.setValue(t+delay.get(),v.get());
};

};

Ops.Value.DelayedValue.prototype = new CABLES.Op();
CABLES.OPS["8e7741e0-0b1b-40f3-a62c-ac8a8828dffb"]={f:Ops.Value.DelayedValue,objName:"Ops.Value.DelayedValue"};




// **************************************************************
// 
// Ops.Gl.Meshes.Grid
// 
// **************************************************************

Ops.Gl.Meshes.Grid = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const render=op.inTrigger("Render");
const inNum=op.inValue("Num",10);
const inSpacing=op.inValue("Spacing",1);
const next=op.outTrigger("Next");

const cgl=op.patch.cgl;
var mesh=null;

inNum.onChange=inSpacing.onChange=function()
{
    if(mesh)mesh.dispose();
    mesh=null;
};

function init()
{
    var geomVertical=new CGL.Geometry();

    var space=inSpacing.get();
    var num=Math.floor(inNum.get());

    var l=space*num/2;

    var tc=[];

    for(var i=-num/2;i<num/2+1;i++)
    {
        geomVertical.vertices.push(-l);
        geomVertical.vertices.push(i*space);
        geomVertical.vertices.push(0);

        geomVertical.vertices.push(l);
        geomVertical.vertices.push(i*space);
        geomVertical.vertices.push(0);

        geomVertical.vertices.push(i*space);
        geomVertical.vertices.push(-l);
        geomVertical.vertices.push(0);

        geomVertical.vertices.push(i*space);
        geomVertical.vertices.push(l);
        geomVertical.vertices.push(0);
        
        tc.push(0,0);
        tc.push(0,0);
        tc.push(0,0);
        tc.push(0,0);
    }
    
    geomVertical.setTexCoords(tc);
    geomVertical.calculateNormals();

    if(!mesh) mesh=new CGL.Mesh(cgl,geomVertical);
        else mesh.setGeom(geomVertical);
}


render.onTriggered=function()
{
    if(!mesh)init();
    var shader=cgl.getShader();
    if(!shader)return;

    var oldPrim=shader.glPrimitive;

    shader.glPrimitive=cgl.gl.LINES;

    mesh.render(shader);
    
    shader.glPrimitive=oldPrim;
    
    next.trigger();
};



};

Ops.Gl.Meshes.Grid.prototype = new CABLES.Op();
CABLES.OPS["677a7c03-6885-46b4-8a64-e4ea54ee5d7f"]={f:Ops.Gl.Meshes.Grid,objName:"Ops.Gl.Meshes.Grid"};


