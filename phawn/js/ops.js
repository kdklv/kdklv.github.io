"use strict";

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Exp=Ops.Exp || {};
Ops.Anim=Ops.Anim || {};
Ops.Math=Ops.Math || {};
Ops.String=Ops.String || {};
Ops.Exp.Gl=Ops.Exp.Gl || {};
Ops.Devices=Ops.Devices || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Deprecated=Ops.Deprecated || {};
Ops.Deprecated.Gl=Ops.Deprecated.Gl || {};
Ops.Devices.Mobile=Ops.Devices.Mobile || {};
Ops.Deprecated.Html=Ops.Deprecated.Html || {};
Ops.Deprecated.Html.Elements=Ops.Deprecated.Html.Elements || {};

//----------------



// **************************************************************
// 
// Ops.Deprecated.Html.Elements.Div
// 
// **************************************************************

Ops.Deprecated.Html.Elements.Div = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
// var text=op.addInPort(new Port(op,"Text",OP_PORT_TYPE_VALUE,{type:'string'}));
var text=op.addInPort(new Port(op,"Text",OP_PORT_TYPE_VALUE,{type:'string',display:'editor'}));

var id=op.addInPort(new Port(op,"Id",OP_PORT_TYPE_VALUE,{type:'string'}));
// var classes=op.addInPort(new Port(op,"Class",OP_PORT_TYPE_VALUE,{type:'string'}));
var classes=op.inValueString("Class");


var visible=op.addInPort(new Port(op,"Visible",OP_PORT_TYPE_VALUE,{display:"bool"}));
visible.set(true);


var doCenterX=op.inValueBool("Center X",false);
var doCenterY=op.inValueBool("Center Y",false);

var posLeft=op.addInPort(new Port(op,"Left",OP_PORT_TYPE_VALUE));
var posTop=op.addInPort(new Port(op,"Top",OP_PORT_TYPE_VALUE));

var borderRadius=op.addInPort(new Port(op,"Border radius",OP_PORT_TYPE_VALUE));
var fontSize=op.addInPort(new Port(op,"Font size",OP_PORT_TYPE_VALUE));
var fontFamily=op.addInPort(new Port(op,"Font Family",OP_PORT_TYPE_VALUE,{type:'string'}));

var cursor=op.addInPort(new Port(op,"cursor",OP_PORT_TYPE_VALUE,{display:'dropdown',values:["auto","crosshair","pointer","Hand","move","n-resize","ne-resize","e-resize","se-resize","s-resize","sw-resize","w-resize","nw-resize","text","wait","help"]} ));

var opacity=op.inValueSlider("Opacity",1.0);

var r=op.addInPort(new Port(op,"Text Red",OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
var g=op.addInPort(new Port(op,"Text Green",OP_PORT_TYPE_VALUE,{ display:'range' }));
var b=op.addInPort(new Port(op,"Text Blue",OP_PORT_TYPE_VALUE,{ display:'range' }));
var a=op.addInPort(new Port(op,"Text Opacity",OP_PORT_TYPE_VALUE,{ display:'range' }));

var bgR=op.addInPort(new Port(op,"Background Red",OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
var bgG=op.addInPort(new Port(op,"Background Green",OP_PORT_TYPE_VALUE,{ display:'range' }));
var bgB=op.addInPort(new Port(op,"Background Blue",OP_PORT_TYPE_VALUE,{ display:'range' }));
var bgA=op.addInPort(new Port(op,"Background Opacity",OP_PORT_TYPE_VALUE,{ display:'range' }));

var outElement=op.outObject("Element");

r.set(1);
g.set(1);
b.set(1);
a.set(1);

bgR.set(0.5);
bgG.set(0.5);
bgB.set(0.5);
bgA.set(1);

var ignoreMouse=op.addInPort(new Port(op,"Ignore Mouse",OP_PORT_TYPE_VALUE,{display:'bool'}));
ignoreMouse.set(false);

var autoSize=op.addInPort(new Port(op,"Auto width/height",OP_PORT_TYPE_VALUE,{display:'bool'}));
var width=op.addInPort(new Port(op,"Width",OP_PORT_TYPE_VALUE));
var height=op.addInPort(new Port(op,"Height",OP_PORT_TYPE_VALUE));

var clickTrigger=op.addOutPort(new Port(op,"OnClick",OP_PORT_TYPE_FUNCTION));
var mouseOver=op.addOutPort(new Port(op,"MouseOver",OP_PORT_TYPE_VALUE,{type:'bool'}));
var clientWidth=op.addOutPort(new Port(op,"Client Width",OP_PORT_TYPE_VALUE));
var clientHeight=op.addOutPort(new Port(op,"Client Height",OP_PORT_TYPE_VALUE));


text.set('This is a HTML element');
width.set(100);
height.set(30);
fontSize.set(12);
fontFamily.set("Arial");
autoSize.set(true);
autoSize.set(true);

mouseOver.set(false);
var element=null;


text.onValueChanged=updateText;

classes.onChange=updateClasses;
updateText();


width.onValueChanged=updateSize;
height.onValueChanged=updateSize;
autoSize.onValueChanged=updateSize;
posLeft.onValueChanged=updatePos;
posTop.onValueChanged=updatePos;
doCenterX.onValueChanged=updatePos;
doCenterY.onValueChanged=updatePos;

bgR.onValueChanged=updateBgColor;
bgG.onValueChanged=updateBgColor;
bgB.onValueChanged=updateBgColor;
bgA.onValueChanged=updateBgColor;

r.onValueChanged=updateColor;
g.onValueChanged=updateColor;
b.onValueChanged=updateColor;
a.onValueChanged=updateColor;

opacity.onChange=updateOpacity;

fontSize.onValueChanged=updateFont;
fontFamily.onValueChanged=updateFont;
borderRadius.onValueChanged=updateBorder;
cursor.onValueChanged=updateCursor;
ignoreMouse.onValueChanged=updateIgnoreMouse;
init();

visible.onValueChanged=function()
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

id.onValueChanged=function()
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

//----------------



// **************************************************************
// 
// Ops.Gl.MainLoop
// 
// **************************************************************

Ops.Gl.MainLoop = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const fpsLimit=op.inValue("FPS Limit",0);
const trigger=op.outFunction("trigger");
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

//----------------



// **************************************************************
// 
// Ops.Devices.MotionSensor
// 
// **************************************************************

Ops.Devices.MotionSensor = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
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

Ops.Devices.MotionSensor.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Shader.BasicMaterial
// 
// **************************************************************

Ops.Gl.Shader.BasicMaterial = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["shader_frag"]="{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        uniform sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        uniform sampler2D texOpacity;\n   #endif\n#endif\nuniform float r;\nuniform float g;\nuniform float b;\nuniform float a;\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=vec4(r,g,b,a);\n    \n    #ifdef HAS_TEXTURES\n        #ifdef HAS_TEXTURE_DIFFUSE\n\n           col=texture2D(tex,vec2(texCoord.x,(1.0-texCoord.y)));\n\n//         col=texture2D(tex,vec2(texCoords.x*1.0,(1.0-texCoords.y)*1.0));\n           #ifdef COLORIZE_TEXTURE\n               col.r*=r;\n               col.g*=g;\n               col.b*=b;\n           #endif\n    #endif\n    col.a*=a;\n    #ifdef HAS_TEXTURE_OPACITY\n      \n            #ifdef TRANSFORMALPHATEXCOORDS\n                col.a*=texture2D(texOpacity,vec2(texCoordOrig.s,1.0-texCoordOrig.t)).g;\n            #endif\n            #ifndef TRANSFORMALPHATEXCOORDS\n                col.a*=texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).g;\n            #endif\n       #endif\n       \n    #endif\n\n    {{MODULE_COLOR}}\n\n    outColor = col;\n\n    \n}\n";
attachments["shader_vert"]="{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nIN vec3 attrVertNormal;\nIN vec2 attrTexCoord;\n\nOUT vec3 norm;\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TEXTURES\n    #ifdef TEXTURE_REPEAT\n        UNI float diffuseRepeatX;\n        UNI float diffuseRepeatY;\n        UNI float texOffsetX;\n        UNI float texOffsetY;\n    #endif\n#endif\n\n\nvoid main()\n{\n    mat4 mMatrix=modelMatrix;\n    mat4 mvMatrix;\n    \n    texCoordOrig=attrTexCoord;\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        #ifdef TEXTURE_REPEAT\n            texCoord.x=texCoord.x*diffuseRepeatX+texOffsetX;\n            texCoord.y=texCoord.y*diffuseRepeatY+texOffsetY;\n        #endif\n    #endif\n\n    vec4 pos = vec4( vPosition, 1. );\n\n\n    #ifdef BILLBOARD\n       vec3 position=vPosition;\n       mvMatrix=viewMatrix*modelMatrix;\n\n       gl_Position = projMatrix * mvMatrix * vec4((\n           position.x * vec3(\n               mvMatrix[0][0],\n               mvMatrix[1][0],\n               mvMatrix[2][0] ) +\n           position.y * vec3(\n               mvMatrix[0][1],\n               mvMatrix[1][1],\n               mvMatrix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifndef BILLBOARD\n        mvMatrix=viewMatrix * mMatrix;\n    #endif\n\n\n    #ifndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n        gl_Position = projMatrix * mvMatrix * pos;\n    #endif\n}\n";
const render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION) );
const trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
const shaderOut=op.addOutPort(new Port(op,"shader",OP_PORT_TYPE_OBJECT));
shaderOut.ignoreValueSerialize=true;

const cgl=op.patch.cgl;


var shader=new CGL.Shader(cgl,'BasicMaterial');
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);
shader.bindTextures=bindTextures;
shader.setSource(attachments.shader_vert,attachments.shader_frag);
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


{
    // rgba colors
    
    var r=op.addInPort(new Port(op,"r",OP_PORT_TYPE_VALUE,{ display:'range',colorPick:'true' }));
    r.set(Math.random());
    r.uniform=new CGL.Uniform(shader,'f','r',r);
    
    var g=op.addInPort(new Port(op,"g",OP_PORT_TYPE_VALUE,{ display:'range'}));
    g.set(Math.random());
    g.uniform=new CGL.Uniform(shader,'f','g',g);
    
    var b=op.addInPort(new Port(op,"b",OP_PORT_TYPE_VALUE,{ display:'range' }));
    b.set(Math.random());
    b.uniform=new CGL.Uniform(shader,'f','b',b);
    
    var a=op.addInPort(new Port(op,"a",OP_PORT_TYPE_VALUE,{ display:'range'}));
    a.uniform=new CGL.Uniform(shader,'f','a',a);
    a.set(1.0);
    
}

{
    // diffuse outTexture
    
    var diffuseTexture=this.addInPort(new Port(this,"texture",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
    var diffuseTextureUniform=null;
    shader.bindTextures=bindTextures;
    
    diffuseTexture.onChange=function()
    {
        if(diffuseTexture.get())
        {
            // if(diffuseTextureUniform!==null)return;
            // shader.addveUniform('texDiffuse');
            if(!shader.hasDefine('HAS_TEXTURE_DIFFUSE'))shader.define('HAS_TEXTURE_DIFFUSE');
            if(!diffuseTextureUniform)diffuseTextureUniform=new CGL.Uniform(shader,'t','texDiffuse',0);
            updateTexRepeat();
        }
        else
        {
            shader.removeUniform('texDiffuse');
            shader.removeDefine('HAS_TEXTURE_DIFFUSE');
            diffuseTextureUniform=null;
        }
    };


    
}

{
    // opacity texture 
    op.textureOpacity=op.addInPort(new Port(op,"textureOpacity",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
    op.textureOpacityUniform=null;
    
    op.textureOpacity.onChange=function()
    {
        if(op.textureOpacity.get())
        {
            if(op.textureOpacityUniform!==null)return;
            shader.removeUniform('texOpacity');
            shader.define('HAS_TEXTURE_OPACITY');
            if(!op.textureOpacityUniform)op.textureOpacityUniform=new CGL.Uniform(shader,'t','texOpacity',1);
        }
        else
        {
            shader.removeUniform('texOpacity');
            shader.removeDefine('HAS_TEXTURE_OPACITY');
            op.textureOpacityUniform=null;
        }
    };
    
}

op.colorizeTexture=op.addInPort(new Port(op,"colorizeTexture",OP_PORT_TYPE_VALUE,{ display:'bool' }));
op.colorizeTexture.set(false);
op.colorizeTexture.onChange=function()
{
    if(op.colorizeTexture.get()) shader.define('COLORIZE_TEXTURE');
        else shader.removeDefine('COLORIZE_TEXTURE');
};


op.doBillboard=op.addInPort(new Port(op,"billboard",OP_PORT_TYPE_VALUE,{ display:'bool' }));
op.doBillboard.set(false);
op.doBillboard.onChange=function()
{
    if(op.doBillboard.get()) shader.define('BILLBOARD');
        else shader.removeDefine('BILLBOARD');
};

var texCoordAlpha=op.inValueBool("Opacity TexCoords Transform",false);

texCoordAlpha.onChange=function()
{
    if(texCoordAlpha.get()) shader.define('TRANSFORMALPHATEXCOORDS');
        else shader.removeDefine('TRANSFORMALPHATEXCOORDS');
    
};

var preMultipliedAlpha=op.addInPort(new Port(op,"preMultiplied alpha",OP_PORT_TYPE_VALUE,{ display:'bool' }));

function updateTexRepeat()
{
    if(!diffuseRepeatXUniform)
    {
        diffuseRepeatXUniform=new CGL.Uniform(shader,'f','diffuseRepeatX',diffuseRepeatX);
        diffuseRepeatYUniform=new CGL.Uniform(shader,'f','diffuseRepeatY',diffuseRepeatY);
        diffuseOffsetXUniform=new CGL.Uniform(shader,'f','texOffsetX',diffuseOffsetX);
        diffuseOffsetYUniform=new CGL.Uniform(shader,'f','texOffsetY',diffuseOffsetY);
    }

    diffuseRepeatXUniform.setValue(diffuseRepeatX.get());
    diffuseRepeatYUniform.setValue(diffuseRepeatY.get());
    diffuseOffsetXUniform.setValue(diffuseOffsetX.get());
    diffuseOffsetYUniform.setValue(diffuseOffsetY.get());
}


{
    // texture coords
    
    var diffuseRepeatX=op.addInPort(new Port(op,"diffuseRepeatX",OP_PORT_TYPE_VALUE));
    var diffuseRepeatY=op.addInPort(new Port(op,"diffuseRepeatY",OP_PORT_TYPE_VALUE));
    var diffuseOffsetX=op.addInPort(new Port(op,"Tex Offset X",OP_PORT_TYPE_VALUE));
    var diffuseOffsetY=op.addInPort(new Port(op,"Tex Offset Y",OP_PORT_TYPE_VALUE));
    
    diffuseRepeatX.onChange=updateTexRepeat;
    diffuseRepeatY.onChange=updateTexRepeat;
    diffuseOffsetY.onChange=updateTexRepeat;
    diffuseOffsetX.onChange=updateTexRepeat;
    
    var diffuseRepeatXUniform=null;
    var diffuseRepeatYUniform=null;
    var diffuseOffsetXUniform=null;
    var diffuseOffsetYUniform=null;
    
    shader.define('TEXTURE_REPEAT');
    

    diffuseOffsetX.set(0);
    diffuseOffsetY.set(0);
    diffuseRepeatX.set(1);
    diffuseRepeatY.set(1);
}


};

Ops.Gl.Shader.BasicMaterial.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Meshes.RandomPoints
// 
// **************************************************************

Ops.Gl.Meshes.RandomPoints = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var exe=op.addInPort(new Port(op,"exe",OP_PORT_TYPE_FUNCTION));
var num=op.addInPort(new Port(op,"num"));
var size=op.addInPort(new Port(op,"size"),OP_PORT_TYPE_VALUE);
var seed=op.addInPort(new Port(op,"random seed"));
var scaleX=op.addInPort(new Port(op,"scaleX",OP_PORT_TYPE_VALUE,{ display:'range' }));
var scaleY=op.addInPort(new Port(op,"scaleY",OP_PORT_TYPE_VALUE,{ display:'range' }));
var scaleZ=op.addInPort(new Port(op,"scaleZ",OP_PORT_TYPE_VALUE,{ display:'range' }));
// var round=op.inValueBool('round',false);

var cgl=op.patch.cgl;

scaleX.set(1);
scaleY.set(1);
scaleZ.set(1);

function doRender()
{
    if(mesh)
    {
        mesh.render(cgl.getShader());
        
        if(CABLES.UI && CABLES.UI.renderHelper)
        {
            CABLES.GL_MARKER.drawCube(op,
                size.get()/2*scaleX.get(),
                size.get()/2*scaleY.get(),
                size.get()/2*scaleZ.get());
        }
    }
}

exe.onTriggered=doRender;

var mesh=null;
var geom=null;

function reset()
{
    geom=new CGL.Geometry();
    var verts=[];
    var n=Math.round(num.get())||1;
    if(n<0)n=1;
    var texCoords=[];
    var vertColors=[];
    verts.length=n*3;
    texCoords.length=n*2;
    vertColors.length=n*3;
    
    Math.randomSeed=seed.get()+0.01;

    var sizeMul=size.get();

    for(var i=0;i<num.get();i++)
    {
        verts[i*3+0]=scaleX.get()*(Math.seededRandom()-0.5)*sizeMul;
        verts[i*3+1]=scaleY.get()*(Math.seededRandom()-0.5)*sizeMul;
        verts[i*3+2]=scaleZ.get()*(Math.seededRandom()-0.5)*sizeMul;
        
        vertColors[i*3+0]=Math.seededRandom();
        vertColors[i*3+1]=Math.seededRandom();
        vertColors[i*3+2]=Math.seededRandom();
        
        texCoords[i*2]=Math.seededRandom();
        texCoords[i*2+1]=Math.seededRandom();
    }
    
    geom.setPointVertices(verts);
    geom.vertColors=vertColors;
    geom.texCoords=texCoords;

    if(mesh)mesh.dispose();
    mesh =new CGL.Mesh(cgl,geom,cgl.gl.POINTS);
    mesh.addVertexNumbers=true;
    mesh.setGeom(geom);
}

size.set(5);
seed.set(0);
seed.onChange=reset;
num.onChange=reset;
size.onChange=reset;
scaleX.onChange=reset;
scaleZ.onChange=reset;
scaleY.onChange=reset;

num.set(1000);


};

Ops.Gl.Meshes.RandomPoints.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Shader.PointMaterial
// 
// **************************************************************

Ops.Gl.Shader.PointMaterial = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["shader_frag"]="\n{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n#ifdef HAS_TEXTURES\n   \n   #ifdef HAS_TEXTURE_DIFFUSE\n       UNI sampler2D diffTex;\n   #endif\n   #ifdef HAS_TEXTURE_MASK\n       UNI sampler2D texMask;\n   #endif\n#endif\nUNI float r;\nUNI float g;\nUNI float b;\nUNI float a;\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n\n    vec4 col=vec4(r,g,b,a);\n\n    #ifdef HAS_TEXTURES\n\n        #ifdef HAS_TEXTURE_MASK\n            float mask=texture2D(texMask,vec2(gl_PointCoord.x,(1.0-gl_PointCoord.y))).r;\n        #endif\n\n        #ifdef HAS_TEXTURE_DIFFUSE\n\n            #ifdef LOOKUP_TEXTURE\n                col=texture2D(diffTex,texCoord);\n            #endif\n            #ifndef LOOKUP_TEXTURE\n                col=texture2D(diffTex,vec2(gl_PointCoord.x,(1.0-gl_PointCoord.y)));\n            #endif\n\n            #ifdef COLORIZE_TEXTURE\n              col.r*=r;\n              col.g*=g;\n              col.b*=b;\n            #endif\n        #endif\n        col.a*=a;\n    #endif\n\n    {{MODULE_COLOR}}\n\n    #ifdef MAKE_ROUND\n        if ((gl_PointCoord.x-0.5)*(gl_PointCoord.x-0.5) + (gl_PointCoord.y-0.5)*(gl_PointCoord.y-0.5) > 0.25) discard; //col.a=0.0;\n    #endif\n\n    #ifdef HAS_TEXTURE_MASK\n        col.a=mask;\n    #endif\n\n\n    // #ifdef RANDOMIZE_COLOR\n        // col.rgb*=fract(sin(dot(texCoord.xy ,vec2(12.9898,78.233))) * 43758.5453);\n    // #endif\n\n\n\n    outColor = col;\n}\n";
attachments["shader_vert"]="{{MODULES_HEAD}}\nIN vec3 vPosition;\nIN vec2 attrTexCoord;\n\nOUT vec3 norm;\n#ifdef HAS_TEXTURES\n    OUT vec2 texCoord;\n#endif\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\nUNI float pointSize;\nUNI vec3 camPos;\n\nUNI float canvasWidth;\nUNI float canvasHeight;\nUNI float camDistMul;\n\nUNI float randomSize;\n\nIN float attrVertIndex;\n\nfloat rand(float n){return fract(sin(n) * 43758.5453123);}\n\n#define POINTMATERIAL\n\nvoid main()\n{\n    float psMul=sqrt(canvasWidth*canvasHeight)*0.001+0.00000000001;\n    float sizeMultiply=1.0;\n\n    #ifdef HAS_TEXTURES\n        texCoord=attrTexCoord;\n    #endif\n    \n    mat4 mMatrix=modelMatrix;\n\n    vec4 pos = vec4( vPosition, 1. );\n\n    {{MODULE_VERTEX_POSITION}}\n\n    vec4 model=mMatrix * pos;\n\n    psMul+=rand(attrVertIndex)*randomSize;\n\n    psMul*=sizeMultiply;\n\n    #ifndef SCALE_BY_DISTANCE\n        gl_PointSize = pointSize * psMul;\n    #endif\n    #ifdef SCALE_BY_DISTANCE\n        float cameraDist = distance(model.xyz, camPos);\n        gl_PointSize = (pointSize / cameraDist) * psMul;\n    #endif\n\n\n\n\n    gl_Position = projMatrix * viewMatrix * model;\n\n\n}\n";
var cgl=op.patch.cgl;

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION) );
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
var shaderOut=op.addOutPort(new Port(op,"shader",OP_PORT_TYPE_OBJECT));

var pointSize=op.addInPort(new Port(op,"PointSize",OP_PORT_TYPE_VALUE));
var randomSize=op.inValue("Random Size",0);

var makeRound=op.addInPort(new Port(op,"Round",OP_PORT_TYPE_VALUE,{ display:'bool' }));
var doScale=op.addInPort(new Port(op,"Scale by Distance",OP_PORT_TYPE_VALUE,{ display:'bool' }));
var r=op.addInPort(new Port(op,"r",OP_PORT_TYPE_VALUE,{ display:'range',colorPick:'true' }));
var g=op.addInPort(new Port(op,"g",OP_PORT_TYPE_VALUE,{ display:'range' }));
var b=op.addInPort(new Port(op,"b",OP_PORT_TYPE_VALUE,{ display:'range' }));
var a=op.addInPort(new Port(op,"a",OP_PORT_TYPE_VALUE,{ display:'range' }));
var preMultipliedAlpha=op.addInPort(new Port(op,"preMultiplied alpha",OP_PORT_TYPE_VALUE,{ display:'bool' }));


makeRound.set(true);
doScale.set(false);
pointSize.set(3);


var shader=new CGL.Shader(cgl,'PointMaterial');
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);

shader.define('MAKE_ROUND');

var uniPointSize=new CGL.Uniform(shader,'f','pointSize',pointSize);
var uniRandomSize=new CGL.Uniform(shader,'f','randomSize',randomSize);


shaderOut.set(shader);
shader.setSource(attachments.shader_vert,attachments.shader_frag);
shader.glPrimitive=cgl.gl.POINTS;
shader.bindTextures=bindTextures;
shaderOut.ignoreValueSerialize=true;

r.set(Math.random());
g.set(Math.random());
b.set(Math.random());
a.set(1.0);

r.uniform=new CGL.Uniform(shader,'f','r',r);
g.uniform=new CGL.Uniform(shader,'f','g',g);
b.uniform=new CGL.Uniform(shader,'f','b',b);
a.uniform=new CGL.Uniform(shader,'f','a',a);

var uniWidth=new CGL.Uniform(shader,'f','canvasWidth',cgl.canvasWidth);
var uniHeight=new CGL.Uniform(shader,'f','canvasHeight',cgl.canvasHeight);

render.onTriggered=doRender;

var texture=op.inTexture("texture");
var textureUniform=null;

var textureMask=op.inTexture("Texture Mask");
var textureMaskUniform=null;

op.preRender=function()
{
    if(shader)shader.bind();
    doRender();
};

function bindTextures()
{
    if(texture.get())
    {
        cgl.setTexture(0,texture.get().tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, texture.get().tex);
    }
    if(textureMask.get())
    {
        cgl.setTexture(1,textureMask.get().tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, textureMask.get().tex);
    }
}

function doRender()
{
    uniWidth.setValue(cgl.canvasWidth);
    uniHeight.setValue(cgl.canvasHeight);
    
    
    cgl.setShader(shader);
    bindTextures();
    if(preMultipliedAlpha.get())cgl.gl.blendFunc(cgl.gl.ONE, cgl.gl.ONE_MINUS_SRC_ALPHA);

    trigger.trigger();
    if(preMultipliedAlpha.get())cgl.gl.blendFunc(cgl.gl.SRC_ALPHA,cgl.gl.ONE_MINUS_SRC_ALPHA);

    cgl.setPreviousShader();
}


doScale.onValueChanged=function()
{
    if(doScale.get()) shader.define('SCALE_BY_DISTANCE');
        else shader.removeDefine('SCALE_BY_DISTANCE');
};

makeRound.onValueChanged=function()
{
    if(makeRound.get()) shader.define('MAKE_ROUND');
        else shader.removeDefine('MAKE_ROUND');
};

texture.onValueChanged=function()
{
    if(texture.get())
    {
        if(textureUniform!==null)return;
        shader.removeUniform('diffTex');
        shader.define('HAS_TEXTURE_DIFFUSE');
        textureUniform=new CGL.Uniform(shader,'t','diffTex',0);
    }
    else
    {
        shader.removeUniform('diffTex');
        shader.removeDefine('HAS_TEXTURE_DIFFUSE');
        textureUniform=null;
    }
};

textureMask.onValueChanged=function()
{
    if(textureMask.get())
    {
        if(textureMaskUniform!==null)return;
        shader.removeUniform('texMask');
        shader.define('HAS_TEXTURE_MASK');
        textureMaskUniform=new CGL.Uniform(shader,'t','texMask',1);
    }
    else
    {
        shader.removeUniform('texMask');
        shader.removeDefine('HAS_TEXTURE_MASK');
        textureMaskUniform=null;
    }
};



var colorizeTexture=op.addInPort(new Port(op,"colorizeTexture",OP_PORT_TYPE_VALUE,{ display:'bool' }));
colorizeTexture.set(false);
colorizeTexture.onValueChanged=function()
{
    if(colorizeTexture.get()) shader.define('COLORIZE_TEXTURE');
        else shader.removeDefine('COLORIZE_TEXTURE');
};

var textureLookup=op.addInPort(new Port(op,"texture Lookup",OP_PORT_TYPE_VALUE,{ display:'bool' }));
textureLookup.set(false);
textureLookup.onValueChanged=function()
{
    if(textureLookup.get()) shader.define('LOOKUP_TEXTURE');
        else shader.removeDefine('LOOKUP_TEXTURE');
};



};

Ops.Gl.Shader.PointMaterial.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Depth
// 
// **************************************************************

Ops.Gl.Depth = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var cgl=op.patch.cgl;

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var clear=op.addInPort(new Port(op,"clear depth",OP_PORT_TYPE_VALUE,{ display:'bool' }));
var enable=op.addInPort(new Port(op,"enable depth testing",OP_PORT_TYPE_VALUE,{ display:'bool' }));
var write=op.addInPort(new Port(op,"write to depth buffer",OP_PORT_TYPE_VALUE,{ display:'bool' }));

var depthFunc=op.addInPort(new Port(op,"ratio",OP_PORT_TYPE_VALUE ,{display:'dropdown',values:['never','always','less','less or equal','greater', 'greater or equal','equal','not equal']} ));
var theDepthFunc=cgl.gl.LEQUAL;

depthFunc.onValueChanged=updateFunc;
depthFunc.set('less or equal');
clear.set(false);
enable.set(true);
write.set(true);

function updateFunc()
{
    if(depthFunc.get()=='never') theDepthFunc=cgl.gl.NEVER;
    if(depthFunc.get()=='always') theDepthFunc=cgl.gl.ALWAYS;
    if(depthFunc.get()=='less') theDepthFunc=cgl.gl.LESS;
    if(depthFunc.get()=='less or equal') theDepthFunc=cgl.gl.LEQUAL;
    if(depthFunc.get()=='greater') theDepthFunc=cgl.gl.GREATER;
    if(depthFunc.get()=='greater or equal') theDepthFunc=cgl.gl.GEQUAL;
    if(depthFunc.get()=='equal') theDepthFunc=cgl.gl.EQUAL;
    if(depthFunc.get()=='not equal') theDepthFunc=cgl.gl.NOTEQUAL;
}

render.onTriggered=function()
{
    if(clear.get()) cgl.gl.clear(cgl.gl.DEPTH_BUFFER_BIT);

    if(!enable.get()) cgl.gl.disable(cgl.gl.DEPTH_TEST);
        else cgl.gl.enable(cgl.gl.DEPTH_TEST);

    if(!write.get()) cgl.gl.depthMask(false);
        else cgl.gl.depthMask(true);

    cgl.gl.depthFunc(theDepthFunc);

    trigger.trigger();

    cgl.gl.enable(cgl.gl.DEPTH_TEST);
    cgl.gl.depthMask(true);
    cgl.gl.depthFunc(cgl.gl.LEQUAL);
};

};

Ops.Gl.Depth.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Texture
// 
// **************************************************************

Ops.Gl.Texture = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var filename=op.addInPort(new Port(op,"file",OP_PORT_TYPE_VALUE,{ display:'file',type:'string',filter:'image' } ));
var tfilter=op.inValueSelect("filter",['nearest','linear','mipmap'],'mipmap');
var wrap=op.inValueSelect("wrap",['repeat','mirrored repeat','clamp to edge'],"clamp to edge");
var flip=op.addInPort(new Port(op,"flip",OP_PORT_TYPE_VALUE,{display:'bool'}));
var unpackAlpha=op.addInPort(new Port(op,"unpackPreMultipliedAlpha",OP_PORT_TYPE_VALUE,{display:'bool'}));


var textureOut=op.outTexture("texture");
var width=op.addOutPort(new Port(op,"width",OP_PORT_TYPE_VALUE));
var height=op.addOutPort(new Port(op,"height",OP_PORT_TYPE_VALUE));
var loading=op.addOutPort(new Port(op,"loading",OP_PORT_TYPE_VALUE));
var ratio=op.outValue("Aspect Ratio");

flip.set(false);
unpackAlpha.set(false);
unpackAlpha.hidePort();

var cgl=op.patch.cgl;
var cgl_filter=0;
var cgl_wrap=0;

flip.onChange=function(){reloadSoon();};
filename.onChange=reloadSoon;

tfilter.onChange=onFilterChange;
wrap.onChange=onWrapChange;
unpackAlpha.onChange=function(){ reloadSoon(); };

var timedLoader=0;

tfilter.set('linear');
wrap.set('repeat');

textureOut.set(CGL.Texture.getEmptyTexture(cgl));

var setTempTexture=function()
{
    var t=CGL.Texture.getTempTexture(cgl);
    textureOut.set(t);
};

// var loadingId=null;
var tex=null;
function reloadSoon(nocache)
{
    // if(!loadingId)loadingId=cgl.patch.loading.start('textureOp',filename.get());
    
    // if(timedLoader!=0)
    // {
    //     console.log('tex load canceled...');
    // }
    clearTimeout(timedLoader);
    timedLoader=setTimeout(function()
    {
        // console.log('tex load yay...');
        realReload(nocache);
    },30);
}

function realReload(nocache)
{
    // if(!loadingId)loadingId=cgl.patch.loading.start('textureOp',filename.get());
    
    var url=op.patch.getFilePath(String(filename.get()));
    if(nocache)url+='?rnd='+CABLES.generateUUID();

    if((filename.get() && filename.get().length>1))
    {
        loading.set(true);

        if(tex)tex.delete();
        tex=CGL.Texture.load(cgl,url,
            function(err)
            {
                if(err)
                {
                    setTempTexture();
                    op.uiAttr({'error':'could not load texture "'+filename.get()+'"'});
                    // cgl.patch.loading.finished(loadingId);
                    return;
                }
                else op.uiAttr({'error':null});
                textureOut.set(tex);
                width.set(tex.width);
                height.set(tex.height);
                ratio.set(tex.width/tex.height);

                if(!tex.isPowerOfTwo()) op.uiAttr(
                    {
                        hint:'texture dimensions not power of two! - texture filtering will not work.',
                        warning:null
                    });
                    else op.uiAttr(
                        {
                            hint:null,
                            warning:null
                        });

                textureOut.set(null);
                textureOut.set(tex);
                // tex.printInfo();

            },{
                wrap:cgl_wrap,
                flip:flip.get(),
                unpackAlpha:unpackAlpha.get(),
                filter:cgl_filter
            });

        textureOut.set(null);
        textureOut.set(tex);

        if(!textureOut.get() && nocache)
        {
        }
        
        // cgl.patch.loading.finished(loadingId);
    }
    else
    {
        // cgl.patch.loading.finished(loadingId);
        setTempTexture();
    }
}


function onFilterChange()
{
    if(tfilter.get()=='nearest') cgl_filter=CGL.Texture.FILTER_NEAREST;
    if(tfilter.get()=='linear') cgl_filter=CGL.Texture.FILTER_LINEAR;
    if(tfilter.get()=='mipmap') cgl_filter=CGL.Texture.FILTER_MIPMAP;

    reloadSoon();
}

function onWrapChange()
{
    if(wrap.get()=='repeat') cgl_wrap=CGL.Texture.WRAP_REPEAT;
    if(wrap.get()=='mirrored repeat') cgl_wrap=CGL.Texture.WRAP_MIRRORED_REPEAT;
    if(wrap.get()=='clamp to edge') cgl_wrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;

    reloadSoon();
}

op.onFileChanged=function(fn)
{
    if(filename.get() && filename.get().indexOf(fn)>-1)
    {
        textureOut.set(null);
        textureOut.set(CGL.Texture.getTempTexture(cgl));

        realReload(true);
    }
};







};

Ops.Gl.Texture.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Math.Sum
// 
// **************************************************************

Ops.Math.Sum = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var result=op.addOutPort(new Port(op,"result"));
var number1=op.inValue("number1");
var number2=op.inValue("number2");

function exec()
{
    var v=parseFloat(number1.get())+parseFloat(number2.get());
    if(!isNaN(v)) result.set( v );
}

number1.onChange=exec;
number2.onChange=exec;

number1.set(1);
number2.set(1);


};

Ops.Math.Sum.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Matrix.LookatCamera
// 
// **************************************************************

Ops.Gl.Matrix.LookatCamera = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var eyeX=op.addInPort(new Port(op,"eyeX"));
var eyeY=op.addInPort(new Port(op,"eyeY"));
var eyeZ=op.addInPort(new Port(op,"eyeZ"));

var centerX=op.addInPort(new Port(op,"centerX"));
var centerY=op.addInPort(new Port(op,"centerY"));
var centerZ=op.addInPort(new Port(op,"centerZ"));

var vecUpX=op.addInPort(new Port(op,"upX"));
var vecUpY=op.addInPort(new Port(op,"upY"));
var vecUpZ=op.addInPort(new Port(op,"upZ"));

var outArr=op.outArray("Array");

centerX.set(0);
centerY.set(0);
centerZ.set(0);

eyeX.set(5);
eyeY.set(5);
eyeZ.set(5);

vecUpX.set(0);
vecUpY.set(1);
vecUpZ.set(0);

var cgl=op.patch.cgl;
var vUp=vec3.create();
var vEye=vec3.create();
var vCenter=vec3.create();
var transMatrix = mat4.create();
mat4.identity(transMatrix);

var arr=[];


render.onTriggered=function()
{
    
    if(CABLES.UI && gui.patch().isCurrentOp(op)) 
        gui.setTransformGizmo(
            {
                posX:eyeX,
                posY:eyeY,
                posZ:eyeZ
            });


    cgl.pushViewMatrix();
    
    arr[0]=eyeX.get();
    arr[1]=eyeY.get();
    arr[2]=eyeZ.get();

    arr[3]=centerX.get();
    arr[4]=centerY.get();
    arr[5]=centerZ.get();

    arr[6]=vecUpX.get();
    arr[7]=vecUpY.get();
    arr[8]=vecUpZ.get();
    outArr.set(arr);

    vec3.set(vUp, vecUpX.get(),vecUpY.get(),vecUpZ.get());
    vec3.set(vEye, eyeX.get(),eyeY.get(),eyeZ.get());
    vec3.set(vCenter, centerX.get(),centerY.get(),centerZ.get());

    mat4.lookAt(transMatrix, vEye, vCenter, vUp);
    
    mat4.multiply(cgl.vMatrix,cgl.vMatrix,transMatrix);

    trigger.trigger();
    cgl.popViewMatrix();
};


};

Ops.Gl.Matrix.LookatCamera.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Meshes.Torus
// 
// **************************************************************

Ops.Gl.Meshes.Torus = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var sides=op.addInPort(new Port(op,"sides",OP_PORT_TYPE_VALUE));
var rings=op.addInPort(new Port(op,"rings",OP_PORT_TYPE_VALUE));
var innerRadius=op.addInPort(new Port(op,"innerRadius",OP_PORT_TYPE_VALUE));
var outerRadius=op.addInPort(new Port(op,"outerRadius",OP_PORT_TYPE_VALUE));

var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
var geomOut=op.addOutPort(new Port(op,"geometry",OP_PORT_TYPE_OBJECT));

sides.set(32);
rings.set(32);
innerRadius.set(0.5);
outerRadius.set(1);

geomOut.ignoreValueSerialize=true;

var cgl=op.patch.cgl;
var mesh=null;
var geom=null;
var j=0,i=0,idx=0;
rings.onValueChanged=updateMesh;
sides.onValueChanged=updateMesh;
innerRadius.onValueChanged=updateMesh;
outerRadius.onValueChanged=updateMesh;

render.onTriggered=function()
{
    if(mesh!==null) mesh.render(cgl.getShader());
    trigger.trigger();
};

function updateMesh()
{
    var nrings=Math.round(rings.get());
    var nsides=Math.round(sides.get());
    if(nrings<2)nrings=2;
    if(nsides<2)nsides=2;
    var r=innerRadius.get();
    var r2=outerRadius.get();
    generateTorus(r,r2, nrings, nsides);
}


updateMesh();

function circleTable(n,halfCircle)
{
    var i;
    /* Table size, the sign of n flips the circle direction */
    var size = Math.abs(n);

    /* Determine the angle between samples */
    var angle = (halfCircle?1:2)*Math.PI/n;// ( n === 0 ) ? 1 : n ;

    /* Allocate memory for n samples, plus duplicate of first entry at the end */
    var sint=[];
    var cost=[];

    /* Compute cos and sin around the circle */
    sint[0] = 0.0;
    cost[0] = 1.0;

    for (i=1; i<size; i++)
    {
        sint[i] = Math.sin(angle*i);
        cost[i] = Math.cos(angle*i);
    }
    
    if (halfCircle)
    {
        sint[size] =  0.0;  /* sin PI */
        cost[size] = -1.0;  /* cos PI */
    }
    else
    {
        /* Last sample is duplicate of the first (sin or cos of 2 PI) */
        sint[size] = sint[0];
        cost[size] = cost[0];
    }
    return {cost:cost,sint:sint};
}


function generateTorus(iradius,oradius,nRings,nSides)
{
    var table1=circleTable( nRings,false);
    var table2=circleTable(-nSides,false);

    // if(!geom)
    geom=new CGL.Geometry();
    // geom.clear();

    for( j=0; j<nRings; j++ )
    {
        for( i=0; i<nSides; i++ )
        {
            var offset = 3 * ( j * nSides + i ) ;
            var offset2 = 2 * ( j * nSides + i ) ;

            geom.vertices[offset  ] = table1.cost[j] * ( oradius + table2.cost[i] * iradius );
            geom.vertices[offset+1] = table1.sint[j] * ( oradius + table2.cost[i] * iradius );
            geom.vertices[offset+2] = table2.sint[i] * iradius;
            geom.vertexNormals[offset  ] = table1.cost[j] * table2.cost[i];
            geom.vertexNormals[offset+1] = table1.sint[j] * table2.cost[i];
            geom.vertexNormals[offset+2] = table2.sint[i];
            
            geom.texCoords[offset2] = 0;
            geom.texCoords[offset2+1] = 0;

        }
    }


    for( i=0, idx=0; i<nSides; i++ )
    {
        var ioff = 1;
        if (i==nSides-1) ioff = -i;

        for( j=0; j<nRings; j++, idx+=2 )
        {
            var offset = j * nSides + i;
            geom.verticesIndices[idx  ] = offset;
            geom.verticesIndices[idx+1] = offset + ioff;
        }
        /* repeat first to close off shape */
        geom.verticesIndices[idx  ] = i;
        geom.verticesIndices[idx+1] = i + ioff;
        idx +=2;
    }
    
    //geom.calcNormals({smooth:rue});
    geomOut.set(null);
    geomOut.set(geom);

    if(!mesh)mesh=new CGL.Mesh(cgl,geom,cgl.gl.TRIANGLE_STRIP);
        else mesh.setGeom(geom);

}


};

Ops.Gl.Meshes.Torus.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Matrix.Transform
// 
// **************************************************************

Ops.Gl.Matrix.Transform = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
const trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));


const posX=op.addInPort(new Port(op,"posX"),0);
const posY=op.addInPort(new Port(op,"posY"),0);
const posZ=op.addInPort(new Port(op,"posZ"),0);

const scale=op.addInPort(new Port(op,"scale"));

const rotX=op.addInPort(new Port(op,"rotX"));
const rotY=op.addInPort(new Port(op,"rotY"));
const rotZ=op.addInPort(new Port(op,"rotZ"));

op.setPortGroup([rotX,rotY,rotZ]);
op.setPortGroup([posX,posY,posZ]);


var cgl=op.patch.cgl;
var vPos=vec3.create();
var vScale=vec3.create();
var transMatrix = mat4.create();
mat4.identity(transMatrix);

var doScale=false;
var doTranslate=false;

var translationChanged=true;
var scaleChanged=true;
var rotChanged=true;

scale.setUiAttribs({"divider":true});

render.onTriggered=function()
{
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
    if(rotChanged)
    {
        updateMatrix=true;
    }
    if(updateMatrix)doUpdateMatrix();

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
    return {
            pos:[posX,posY,posZ]
        };
    
};

var doUpdateMatrix=function()
{
    mat4.identity(transMatrix);
    if(doTranslate)mat4.translate(transMatrix,transMatrix, vPos);

    if(rotX.get()!==0)mat4.rotateX(transMatrix,transMatrix, rotX.get()*CGL.DEG2RAD);
    if(rotY.get()!==0)mat4.rotateY(transMatrix,transMatrix, rotY.get()*CGL.DEG2RAD);
    if(rotZ.get()!==0)mat4.rotateZ(transMatrix,transMatrix, rotZ.get()*CGL.DEG2RAD);

    if(doScale)mat4.scale(transMatrix,transMatrix, vScale);
    rotChanged=false;
};

function updateTranslation()
{
    doTranslate=false;
    if(posX.get()!==0.0 || posY.get()!==0.0 || posZ.get()!==0.0) doTranslate=true;
    vec3.set(vPos, posX.get(),posY.get(),posZ.get());
    translationChanged=false;
}

function updateScale()
{
    doScale=false;
    if(scale.get()!==0.0)doScale=true;
    vec3.set(vScale, scale.get(),scale.get(),scale.get());
    scaleChanged=false;
}

var translateChanged=function()
{
    translationChanged=true;
};

var scaleChanged=function()
{
    scaleChanged=true;
};

var rotChanged=function()
{
    rotChanged=true;
};


rotX.onChange=rotChanged;
rotY.onChange=rotChanged;
rotZ.onChange=rotChanged;

scale.onChange=scaleChanged;

posX.onChange=translateChanged;
posY.onChange=translateChanged;
posZ.onChange=translateChanged;

rotX.set(0.0);
rotY.set(0.0);
rotZ.set(0.0);

scale.set(1.0);

posX.set(0.0);
posY.set(0.0);
posZ.set(0.0);

doUpdateMatrix();



};

Ops.Gl.Matrix.Transform.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.IdentityViewMatrix
// 
// **************************************************************

Ops.Gl.IdentityViewMatrix = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='view Identity ';

var exe=op.addInPort(new Port(op,"exe",OP_PORT_TYPE_FUNCTION));

var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var cgl=op.patch.cgl;

exe.onTriggered=function()
{
    cgl.pushViewMatrix();

    mat4.identity(cgl.vMatrix);
    trigger.trigger();

    cgl.popViewMatrix();
};

};

Ops.Gl.IdentityViewMatrix.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.String.Concat
// 
// **************************************************************

Ops.String.Concat = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var string1=op.inValueString("string1","ABC");
var string2=op.inValueString("string2","XYZ");
var newLine=op.inValueBool("New Line",false);

var result=op.outValueString("result");

function exec()
{
    var nl='';
    if(newLine.get())nl='\n';
    result.set( String(string1.get())+nl+String(string2.get()));
}

newLine.onChange=string2.onChange=string1.onChange=exec;



};

Ops.String.Concat.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.ClearColor
// 
// **************************************************************

Ops.Gl.ClearColor = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
const trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
const r=op.addInPort(new Port(op,"r",OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
const g=op.inValueSlider("g",0.1);
const b=op.inValueSlider("b",0.1);
const a=op.inValueSlider("a",1);

r.set(0.1);
const cgl=op.patch.cgl;

render.onTriggered=function()
{
    cgl.gl.clearColor(r.get(),g.get(),b.get(),a.get());
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
    trigger.trigger();
};


};

Ops.Gl.ClearColor.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Deprecated.Gl.CanvasSize
// 
// **************************************************************

Ops.Deprecated.Gl.CanvasSize = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='CanvasSize';

var exe=op.addInPort(new Port(op,"exe",OP_PORT_TYPE_FUNCTION));
var width=op.addOutPort(new Port(op,"width",OP_PORT_TYPE_VALUE));
var height=op.addOutPort(new Port(op,"height",OP_PORT_TYPE_VALUE));

var cgl=op.patch.cgl;
var w=0,h=0;

exe.onTriggered=function()
{
    height.set(cgl.canvasHeight);
    width.set(cgl.canvasWidth);
};



};

Ops.Deprecated.Gl.CanvasSize.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Perspective
// 
// **************************************************************

Ops.Gl.Perspective = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
// http://stackoverflow.com/questions/5504635/computing-fovx-opengl

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var fovY=op.addInPort(new Port(op,"fov y",OP_PORT_TYPE_VALUE ));
var zNear=op.addInPort(new Port(op,"frustum near",OP_PORT_TYPE_VALUE ));
var zFar=op.addInPort(new Port(op,"frustum far",OP_PORT_TYPE_VALUE ));
var autoAspect=op.inValueBool("Auto Aspect Ratio",true);
var aspect=op.inValue("Aspect Ratio");

var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));


var cgl=op.patch.cgl;
zNear.set(0.01);
fovY.set(45);
zFar.set(500.0);

fovY.onValueChanged=changed;
zFar.onValueChanged=changed;
zNear.onValueChanged=changed;
changed();

var asp=0;

render.onTriggered=function()
{
    asp=cgl.getViewPort()[2]/cgl.getViewPort()[3];
    if(!autoAspect.get())asp=aspect.get();
    
    cgl.pushPMatrix();
    mat4.perspective(
        cgl.pMatrix,
        fovY.get()*0.0174533, 
        asp, 
        zNear.get(), 
        zFar.get());

    trigger.trigger();

    cgl.popPMatrix();
};

function changed()
{
    cgl.frameStore.perspective=
    {
        fovy:fovY.get(),
        zFar:zFar.get(),
        zNear:zNear.get(),
    };
}



};

Ops.Gl.Perspective.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.String.NumberToString
// 
// **************************************************************

Ops.String.NumberToString = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name="NumberToString";

var val=op.addInPort(new Port(op,"Number",OP_PORT_TYPE_VALUE));
var result=op.addOutPort(new Port(op,"Result",OP_PORT_TYPE_VALUE,{type:'string'}));

function update()
{
    result.set( ''+String(val.get()||0));
}

val.onChange=update;
update();

};

Ops.String.NumberToString.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Devices.Mobile.ScreenOrientation
// 
// **************************************************************

Ops.Devices.Mobile.ScreenOrientation = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name="ScreenOrientation";

var angle=op.outValue("Angle");
var str=op.outValue("Description");

var count=0;
window.addEventListener("resize", onOrientationChange, false);
window.addEventListener("orientationchange", onOrientationChange,false);

onOrientationChange();

if(screen && screen.orientation) 
{
    screen.orientation.addEventListener('change', onOrientationChange);
}



function onOrientationChange()
{
    count++;
    if(!screen.orientation)return;
    if(screen.orientation.hasOwnProperty("angle"))angle.set(screen.orientation.angle);
    var s=screen.orientation.type+" #"+count+" WINORIENT:"+window.orientation;
    str.set(s);
}

op.onDelete=function()
{
    window.removeEventListener("resize", onOrientationChange);
    window.removeEventListener("orientationchange", onOrientationChange);
};





};

Ops.Devices.Mobile.ScreenOrientation.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Meshes.Triangle
// 
// **************************************************************

Ops.Gl.Meshes.Triangle = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
var sizeW=op.addInPort(new Port(op,"width",OP_PORT_TYPE_VALUE));
var sizeH=op.addInPort(new Port(op,"height",OP_PORT_TYPE_VALUE));
const draw=op.inValueBool("Draw",true);
var geom=new CGL.Geometry("triangle");

sizeW.set(1);
sizeH.set(1);

var geomOut=op.addOutPort(new Port(op,"geometry",OP_PORT_TYPE_OBJECT));
geomOut.ignoreValueSerialize=true;

var cgl=op.patch.cgl;
var mesh=null;

render.onTriggered=function()
{
    if(draw.get())mesh.render(cgl.getShader());
    trigger.trigger();
};

function create()
{
    geom.vertices = [
         0.0,           sizeH.get(),  0.0,
        -sizeW.get(),  -sizeH.get(),  0.0,
         sizeW.get(),  -sizeH.get(),  0.0
    ];

    geom.vertexNormals = [
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0
    ];

    geom.texCoords = [
         0.5,  0.0,
         1.0,  1.0,
         0.0,  1.0,
    ];

    geom.verticesIndices = [
        0, 1, 2
    ];

    mesh=new CGL.Mesh(cgl,geom);
    geomOut.set(null);
    geomOut.set(geom);
}

sizeW.onValueChange(create);
sizeH.onValueChange(create);

create();

};

Ops.Gl.Meshes.Triangle.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.RandomCluster
// 
// **************************************************************

Ops.Gl.RandomCluster = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var exe=op.addInPort(new Port(op,"exe",OP_PORT_TYPE_FUNCTION));
var num=op.addInPort(new Port(op,"num"));
var size=op.addInPort(new Port(op,"size"));
var seed=op.addInPort(new Port(op,"random seed"));
var scaleX=op.addInPort(new Port(op,"scaleX",OP_PORT_TYPE_VALUE,{ display:'range' }));
var scaleY=op.addInPort(new Port(op,"scaleY",OP_PORT_TYPE_VALUE,{ display:'range' }));
var scaleZ=op.addInPort(new Port(op,"scaleZ",OP_PORT_TYPE_VALUE,{ display:'range' }));
var round=op.inValueBool('round',false);

var trigger=op.outTrigger("trigger");
var idx=op.addOutPort(new Port(op,"index")) ;
var rnd=op.addOutPort(new Port(op,"rnd")) ;

var rotX=op.inValueSlider("Rotate X",1);
var rotY=op.inValueSlider("Rotate Y",1);
var rotZ=op.inValueSlider("Rotate Z",1);

var scrollX=op.inValue("Scroll X",0);

var cgl=op.patch.cgl;
var randoms=[];
var origRandoms=[];
var randomsRot=[];
var randomsFloats=[];

scaleX.set(1);
scaleY.set(1);
scaleZ.set(1);

var transVec=vec3.create();
var mat=mat4.create();

function doRender()
{
    // console.log(doRender);
    if(op.instanced(exe))return;

    if(CABLES.UI && CABLES.UI.renderHelper)
    {
        CABLES.GL_MARKER.drawCube(op,
            size.get()/2*scaleX.get(),
            size.get()/2*scaleY.get(),
            size.get()/2*scaleZ.get());
    }

    op.patch.instancing.pushLoop(randoms.length);
    
    if(scrollX.get()!=0)
    {
        for(var i=0;i<origRandoms.length;i++)
        {
            randoms[i][0]=origRandoms[i][0]+scrollX.get();
            randoms[i][0]=(randoms[i][0]%size.get())-(size.get()/2);
        }
    }

    for(var i=0;i<randoms.length;i++)
    {
        cgl.pushModelMatrix();

        mat4.translate(cgl.mMatrix,cgl.mMatrix, randoms[i]);

        mat4.rotateX(cgl.mMatrix,cgl.mMatrix, randomsRot[i][0]);
        mat4.rotateY(cgl.mMatrix,cgl.mMatrix, randomsRot[i][1]);
        mat4.rotateZ(cgl.mMatrix,cgl.mMatrix, randomsRot[i][2]);

        idx.set(i);
        rnd.set(randomsFloats[i]);

        trigger.trigger();
        op.patch.instancing.increment();

        cgl.popModelMatrix();
    }
    op.patch.instancing.popLoop();

}

exe.onTriggered=doRender;

function getRandomPos()
{
    return vec3.fromValues(
        scaleX.get()*(Math.seededRandom()-0.5)*size.get(),
        scaleY.get()*(Math.seededRandom()-0.5)*size.get(),
        scaleZ.get()*(Math.seededRandom()-0.5)*size.get()
        );
}


function reset()
{
    randoms.length=0;
    randomsRot.length=0;
    randomsFloats.length=0;
    origRandoms.length=0;

    Math.randomSeed=seed.get();
    
    var makeRound=round.get();

    for(var i=0;i<num.get();i++)
    {
        randomsFloats.push(Math.seededRandom());

        var v=getRandomPos();
        
        if(makeRound)
            while(vec3.len(v)>size.get()/2)
                v=getRandomPos();

        origRandoms.push( [ v[0],v[1],v[2] ]);
        randoms.push(v);

        randomsRot.push(vec3.fromValues(
            Math.seededRandom()*360*CGL.DEG2RAD*rotX.get(),
            Math.seededRandom()*360*CGL.DEG2RAD*rotY.get(),
            Math.seededRandom()*360*CGL.DEG2RAD*rotZ.get()
            ));
    }
}

size.set(20);
seed.set(1);
seed.onChange=reset;
num.onChange=reset;
size.onChange=reset;
scaleX.onChange=reset;
scaleZ.onChange=reset;
scaleY.onChange=reset;
round.onChange=reset;
rotX.onChange=reset;
rotY.onChange=reset;
rotZ.onChange=reset;

num.set(100);

};

Ops.Gl.RandomCluster.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Shader.MatCapMaterial
// 
// **************************************************************

Ops.Gl.Shader.MatCapMaterial = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var self=this;
var cgl=self.patch.cgl;

this.name='MatCapMaterial';
this.render=this.addInPort(new Port(this,"render",OP_PORT_TYPE_FUNCTION));
this.trigger=this.addOutPort(new Port(this,"trigger",OP_PORT_TYPE_FUNCTION));
this.shaderOut=this.addOutPort(new Port(this,"shader",OP_PORT_TYPE_OBJECT));
this.shaderOut.ignoreValueSerialize=true;

this.texture=this.addInPort(new Port(this,"texture",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureUniform=null;

this.textureDiffuse=this.addInPort(new Port(this,"diffuse",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureDiffuseUniform=null;

this.textureNormal=this.addInPort(new Port(this,"normal",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureNormalUniform=null;

this.normalScale=this.addInPort(new Port(this,"normalScale",OP_PORT_TYPE_VALUE,{display:'range'}));
this.normalScale.set(0.4);
this.normalScaleUniform=null;

this.textureSpec=this.addInPort(new Port(this,"specular",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureSpecUniform=null;

this.textureSpecMatCap=this.addInPort(new Port(this,"specular matcap",OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureSpecMatCapUniform=null;


this.diffuseRepeatX=this.addInPort(new Port(this,"diffuseRepeatX",OP_PORT_TYPE_VALUE));
this.diffuseRepeatY=this.addInPort(new Port(this,"diffuseRepeatY",OP_PORT_TYPE_VALUE));
this.diffuseRepeatX.set(1.0);
this.diffuseRepeatY.set(1.0);

var pOpacity=op.inValueSlider("Opacity",1);


this.diffuseRepeatX.onValueChanged=function()
{
    self.diffuseRepeatXUniform.setValue(self.diffuseRepeatX.get());
};

this.diffuseRepeatY.onValueChanged=function()
{
    self.diffuseRepeatYUniform.setValue(self.diffuseRepeatY.get());
};


this.calcTangents=this.addInPort(new Port(this,"calc normal tangents",OP_PORT_TYPE_VALUE,{display:'bool'}));
this.calcTangents.onValueChanged=function()
{
    if(self.calcTangents.get()) shader.define('CALC_TANGENT');
        else shader.removeDefine('CALC_TANGENT');
};

this.projectCoords=this.addInPort(new Port(this,"projectCoords",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['no','xy','yz','xz']}));
this.projectCoords.set('no');
this.projectCoords.onValueChanged=function()
{
    shader.removeDefine('DO_PROJECT_COORDS_XY');
    shader.removeDefine('DO_PROJECT_COORDS_YZ');
    shader.removeDefine('DO_PROJECT_COORDS_XZ');

    if(self.projectCoords.get()=='xy') shader.define('DO_PROJECT_COORDS_XY');
    if(self.projectCoords.get()=='yz') shader.define('DO_PROJECT_COORDS_YZ');
    if(self.projectCoords.get()=='xz') shader.define('DO_PROJECT_COORDS_XZ');
};

this.normalRepeatX=this.addInPort(new Port(this,"normalRepeatX",OP_PORT_TYPE_VALUE));
this.normalRepeatY=this.addInPort(new Port(this,"normalRepeatY",OP_PORT_TYPE_VALUE));
this.normalRepeatX.set(1.0);
this.normalRepeatY.set(1.0);

this.normalRepeatX.onValueChanged=function()
{
    self.normalRepeatXUniform.setValue(self.normalRepeatX.get());
};

this.normalRepeatY.onValueChanged=function()
{
    self.normalRepeatYUniform.setValue(self.normalRepeatY.get());
};

this.normalScale.onValueChanged=function()
{
    self.normalScaleUniform.setValue(self.normalScale.get()*2.0);
};

this.texture.onPreviewChanged=function()
{
    if(self.texture.showPreview) self.render.onTriggered=self.texture.get().preview;
        else self.render.onTriggered=self.doRender;
};

this.textureDiffuse.onPreviewChanged=function()
{
    if(self.textureDiffuse.showPreview) self.render.onTriggered=self.textureDiffuse.get().preview;
        else self.render.onTriggered=self.doRender;
};

this.textureNormal.onPreviewChanged=function()
{
    if(self.textureNormal.showPreview) self.render.onTriggered=self.textureNormal.get().preview;
        else self.render.onTriggered=self.doRender;
};

this.texture.onValueChanged=function()
{
    if(self.texture.get())
    {
        if(self.textureUniform!==null)return;
        shader.removeUniform('tex');
        self.textureUniform=new CGL.Uniform(shader,'t','tex',0);
    }
    else
    {
        shader.removeUniform('tex');
        self.textureUniform=null;
    }
};

this.textureDiffuse.onValueChanged=function()
{
    if(self.textureDiffuse.get())
    {
        if(self.textureDiffuseUniform!==null)return;
        shader.define('HAS_DIFFUSE_TEXTURE');
        shader.removeUniform('texDiffuse');
        self.textureDiffuseUniform=new CGL.Uniform(shader,'t','texDiffuse',1);
    }
    else
    {
        shader.removeDefine('HAS_DIFFUSE_TEXTURE');
        shader.removeUniform('texDiffuse');
        self.textureDiffuseUniform=null;
    }
};



this.textureNormal.onValueChanged=function()
{
    if(self.textureNormal.get())
    {
        if(self.textureNormalUniform!==null)return;
        shader.define('HAS_NORMAL_TEXTURE');
        shader.removeUniform('texNormal');
        self.textureNormalUniform=new CGL.Uniform(shader,'t','texNormal',2);
    }
    else
    {
        shader.removeDefine('HAS_NORMAL_TEXTURE');
        shader.removeUniform('texNormal');
        self.textureNormalUniform=null;
    }
};


function changeSpec()
{
    if(self.textureSpec.get() && self.textureSpecMatCap.get())
    {
        if(self.textureSpecUniform!==null)return;
        shader.define('USE_SPECULAR_TEXTURE');
        shader.removeUniform('texSpec');
        shader.removeUniform('texSpecMatCap');
        self.textureSpecUniform=new CGL.Uniform(shader,'t','texSpec',3);
        self.textureSpecMatCapUniform=new CGL.Uniform(shader,'t','texSpecMatCap',4);
    }
    else
    {
        shader.removeDefine('USE_SPECULAR_TEXTURE');
        shader.removeUniform('texSpec');
        shader.removeUniform('texSpecMatCap');
        self.textureSpecUniform=null;
        self.textureSpecMatCapUniform=null;
    }

}

this.textureSpec.onValueChanged=changeSpec;
this.textureSpecMatCap.onValueChanged=changeSpec;


function bindTextures()
{
    
    if(self.texture.get())
    {
        /* --- */cgl.setTexture(0);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, self.texture.get().tex);
    }

    if(self.textureDiffuse.get())
    {
        /* --- */cgl.setTexture(1);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, self.textureDiffuse.get().tex);
    }

    if(self.textureNormal.get())
    {
        /* --- */cgl.setTexture(2);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, self.textureNormal.get().tex);
    }

    if(self.textureSpec.get())
    {
        /* --- */cgl.setTexture(3);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, self.textureSpec.get().tex);
    }
    if(self.textureSpecMatCap.get())
    {
        /* --- */cgl.setTexture(4);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, self.textureSpecMatCap.get().tex);
    }

};




this.doRender=function()
{
    shader.bindTextures=bindTextures;
    
    cgl.setShader(shader);
    self.trigger.trigger();
    cgl.setPreviousShader();



    // if(self.texture.get())
    // {
    //     /* --- */cgl.setTexture(0);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }

    // if(self.textureDiffuse.get())
    // {
    //     /* --- */cgl.setTexture(1);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }

    // if(self.textureNormal.get())
    // {
    //     /* --- */cgl.setTexture(2);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }

    // if(self.textureSpec.get())
    // {
    //     /* --- */cgl.setTexture(3);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }
    // if(self.textureSpecMatCap.get())
    // {
    //     /* --- */cgl.setTexture(4);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }
};

var srcVert=''
    .endl()+'{{MODULES_HEAD}}'
    .endl()+'precision highp float;'
    .endl()+'IN vec3 vPosition;'
    .endl()+'IN vec2 attrTexCoord;'
    .endl()+'IN vec3 attrVertNormal;'

    .endl()+'#ifdef HAS_NORMAL_TEXTURE'
    .endl()+'   IN vec3 attrTangent;'
    .endl()+'   IN vec3 attrBiTangent;'

    .endl()+'   OUT vec3 vBiTangent;'
    .endl()+'   OUT vec3 vTangent;'
    .endl()+'#endif'

    .endl()+'OUT vec2 texCoord;'
    .endl()+'OUT vec3 norm;'
    .endl()+'UNI mat4 projMatrix;'
    .endl()+'UNI mat4 modelMatrix;'
    .endl()+'UNI mat4 viewMatrix;'
    .endl()+'UNI mat4 normalMatrix;'
    .endl()+'OUT vec2 vNorm;'

    .endl()+'OUT vec3 e;'

    .endl()+'void main()'
    .endl()+'{'
    .endl()+'    texCoord=attrTexCoord;'
    .endl()+'    norm=attrVertNormal;'

    .endl()+'    #ifdef HAS_NORMAL_TEXTURE'
    .endl()+'        vTangent=attrTangent;'
    .endl()+'        vBiTangent=attrBiTangent;'
    .endl()+'    #endif'

    .endl()+'    vec4 pos = vec4( vPosition, 1. );'
    .endl()+'    mat4 mMatrix=modelMatrix;'

    .endl()+'    {{MODULE_VERTEX_POSITION}}'
    .endl()+'    mat4 mvMatrix= viewMatrix * mMatrix;'
    .endl()+'    e = normalize( vec3( mvMatrix * pos ) );'
    .endl()+'    vec3 n = normalize( mat3(normalMatrix) * norm );'

    .endl()+'    vec3 r = reflect( e, n );'
    .endl()+'    float m = 2. * sqrt( '
    .endl()+'        pow(r.x, 2.0)+'
    .endl()+'        pow(r.y, 2.0)+'
    .endl()+'        pow(r.z + 1.0, 2.0)'
    .endl()+'    );'
    .endl()+'    vNorm = r.xy / m + 0.5;'

    .endl()+'   #ifdef DO_PROJECT_COORDS_XY'
    .endl()+'       texCoord=(projMatrix * mvMatrix*pos).xy*0.1;'
    .endl()+'   #endif'

    .endl()+'   #ifdef DO_PROJECT_COORDS_YZ'
    .endl()+'       texCoord=(projMatrix * mvMatrix*pos).yz*0.1;'
    .endl()+'   #endif'

    .endl()+'   #ifdef DO_PROJECT_COORDS_XZ'
    .endl()+'       texCoord=(projMatrix * mvMatrix*pos).xz*0.1;'
    .endl()+'   #endif'

    .endl()+'   gl_Position = projMatrix * mvMatrix * pos;'

    .endl()+'}';


var srcFrag=''
    .endl()+'precision highp float;'

    .endl()+'{{MODULES_HEAD}}'

    .endl()+'IN vec3 norm;'
    .endl()+'IN vec2 texCoord;'
    .endl()+'UNI sampler2D tex;'
    .endl()+'IN vec2 vNorm;'
    .endl()+'UNI mat4 viewMatrix;'

    .endl()+'UNI float diffuseRepeatX;'
    .endl()+'UNI float diffuseRepeatY;'
    .endl()+'UNI float opacity;'

    .endl()+'#ifdef HAS_DIFFUSE_TEXTURE'
    .endl()+'   UNI sampler2D texDiffuse;'
    .endl()+'#endif'

    .endl()+'#ifdef USE_SPECULAR_TEXTURE'
    .endl()+'   UNI sampler2D texSpec;'
    .endl()+'   UNI sampler2D texSpecMatCap;'
    .endl()+'#endif'


    .endl()+'#ifdef HAS_NORMAL_TEXTURE'
    .endl()+'   IN vec3 vBiTangent;'
    .endl()+'   IN vec3 vTangent;'

    .endl()+'   UNI sampler2D texNormal;'
    .endl()+'   UNI mat4 normalMatrix;'
    .endl()+'   UNI float normalScale;'
    .endl()+'   UNI float normalRepeatX;'
    .endl()+'   UNI float normalRepeatY;'
    .endl()+'   IN vec3 e;'
    .endl()+'   vec2 vNormt;'
    .endl()+'#endif'

    .endl()+''
    .endl()+'void main()'
    .endl()+'{'

    .endl()+'   vec2 vnOrig=vNorm;'
    .endl()+'   vec2 vn=vNorm;'

    .endl()+'   #ifdef HAS_TEXTURES'
    .endl()+'       vec2 texCoords=texCoord;'
    .endl()+'       {{MODULE_BEGIN_FRAG}}'
    .endl()+'   #endif'


    .endl()+'   #ifdef HAS_NORMAL_TEXTURE'
    .endl()+'       vec3 tnorm=texture2D( texNormal, vec2(texCoord.x*normalRepeatX,texCoord.y*normalRepeatY) ).xyz * 2.0 - 1.0;'

    .endl()+'       tnorm = normalize(tnorm*normalScale);'

    .endl()+'       vec3 tangent;'
    .endl()+'       vec3 binormal;'

    .endl()+'       #ifdef CALC_TANGENT'
    .endl()+'           vec3 c1 = cross(norm, vec3(0.0, 0.0, 1.0));'
    // .endl()+'           vec3 c2 = cross(norm, vec3(0.0, 1.0, 0.0));'
    // .endl()+'           if(length(c1)>length(c2)) tangent = c2;'
    // .endl()+'               else tangent = c1;'
    .endl()+'           tangent = c1;'
    .endl()+'           tangent = normalize(tangent);'
    .endl()+'           binormal = cross(norm, tangent);'
    .endl()+'           binormal = normalize(binormal);'
    .endl()+'       #endif'

    .endl()+'       #ifndef CALC_TANGENT'
    .endl()+'           tangent=normalize(vTangent);'
    // .endl()+'           tangent.y*=-13.0;'
    // .endl()+'           binormal=vBiTangent*norm;'
    // .endl()+'           binormal.z*=-1.0;'
    // .endl()+'           binormal=normalize(binormal);'
    .endl()+'           binormal=normalize( cross( normalize(norm), normalize(vBiTangent) )   );'
        // vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );

    .endl()+'       #endif'

    .endl()+'       tnorm=normalize(tangent*tnorm.x + binormal*tnorm.y + norm*tnorm.z);'

    .endl()+'       vec3 n = normalize( mat3(normalMatrix) * (norm+tnorm*normalScale) );'

    .endl()+'       vec3 r = reflect( e, n );'
    .endl()+'       float m = 2. * sqrt( '
    .endl()+'           pow(r.x, 2.0)+'
    .endl()+'           pow(r.y, 2.0)+'
    .endl()+'           pow(r.z + 1.0, 2.0)'
    .endl()+'       );'
    .endl()+'       vn = (r.xy / m + 0.5);'

    .endl()+'       vn.t=clamp(vn.t, 0.0, 1.0);'
    .endl()+'       vn.s=clamp(vn.s, 0.0, 1.0);'
    .endl()+'    #endif'

    .endl()+'    vec4 col = texture2D( tex, vn );'

    // .endl()+'   float bias=0.1;'
    // .endl()+'    if(vn.s>1.0-bias || vn.t>1.0-bias || vn.s<bias || vn.t<bias)' //col.rgb=vec3(0.0,1.0,0.0);
    // .endl()+'    {;'
    // .endl()+'       col = texture2D( tex, vnOrig );'

    // .endl()+'    };'


    .endl()+'    #ifdef HAS_DIFFUSE_TEXTURE'
    .endl()+'       col = col*texture2D( texDiffuse, vec2(texCoords.x*diffuseRepeatX,texCoords.y*diffuseRepeatY));'
    .endl()+'    #endif'

    .endl()+'    #ifdef USE_SPECULAR_TEXTURE'
    .endl()+'       vec4 spec = texture2D( texSpecMatCap, vn );'
    .endl()+'       spec*= texture2D( texSpec, vec2(texCoords.x*diffuseRepeatX,texCoords.y*diffuseRepeatY) );'
    .endl()+'       col+=spec;'
    .endl()+'    #endif'

    .endl()+'    col.a*=opacity;'

    .endl()+'    {{MODULE_COLOR}}'

    // .endl()+'    col.xy=vn;'
    // .endl()+'    col.r=0.0;'
    // .endl()+'    col.g=0.0;'
    // .endl()+'    col.b=0.0;'

    // .endl()+'    if()col.rgb=vec3(1.0,0.0,0.0);'

    // .endl()+'    col.rgb=vec3(length(vn),0.0,0.0);'


    .endl()+'    gl_FragColor = col;'
    .endl()+''
    .endl()+'}';

var shader=new CGL.Shader(cgl,'MatCapMaterial');
var uniOpacity=new CGL.Uniform(shader,'f','opacity',pOpacity);
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);


shader.bindTextures=bindTextures;
this.shaderOut.set(shader);
// this.onLoaded=shader.compile;
shader.setSource(srcVert,srcFrag);
this.normalScaleUniform=new CGL.Uniform(shader,'f','normalScale',self.normalScale.get());
this.normalRepeatXUniform=new CGL.Uniform(shader,'f','normalRepeatX',self.normalRepeatX.get());
this.normalRepeatYUniform=new CGL.Uniform(shader,'f','normalRepeatY',self.normalRepeatY.get());

this.diffuseRepeatXUniform=new CGL.Uniform(shader,'f','diffuseRepeatX',self.diffuseRepeatX.get());
this.diffuseRepeatYUniform=new CGL.Uniform(shader,'f','diffuseRepeatY',self.diffuseRepeatY.get());

this.render.onTriggered=this.doRender;
this.calcTangents.set(true);
this.doRender();


};

Ops.Gl.Shader.MatCapMaterial.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.FaceCulling
// 
// **************************************************************

Ops.Gl.FaceCulling = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
op.trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

op.enable=op.addInPort(new Port(op,"enable",OP_PORT_TYPE_VALUE,{ display:'bool' }));
op.enable.set(true);

op.facing=op.addInPort(new Port(op,"facing",OP_PORT_TYPE_VALUE ,{display:'dropdown',values:['back','front','both']} ));
op.facing.set('back');

var cgl=op.patch.cgl;

var whichFace=cgl.gl.BACK;
op.render.onTriggered=function()
{
    if(op.enable.get()) cgl.gl.enable(cgl.gl.CULL_FACE);
    else cgl.gl.disable(cgl.gl.CULL_FACE);
    
    cgl.gl.cullFace(whichFace);

    op.trigger.trigger();

    cgl.gl.disable(cgl.gl.CULL_FACE);
};

op.facing.onValueChanged=function()
{
    whichFace=cgl.gl.BACK;
    if(op.facing.get()=='front')whichFace=cgl.gl.FRONT;
    if(op.facing.get()=='both')whichFace=cgl.gl.FRONT_AND_BACK;
};

};

Ops.Gl.FaceCulling.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Exp.Gl.DeviceOrientationCamera
// 
// **************************************************************

Ops.Exp.Gl.DeviceOrientationCamera = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name="DeviceOrientationCamera";

var render=op.inFunction("Render");
var next=op.outFunction("Next");
var winOrient=op.outValue("Window Orientation");

window.addEventListener("deviceorientation", onOrientationChange,true);

var cgl=op.patch.cgl;
var vCenter=vec3.create();
var transMatrix = mat4.create();
var displayOrientQuat=quat.create();
var displayOrientMatrix=mat4.create();
var tempQuat=quat.create();
mat4.identity(transMatrix);

var viewDirQuat=quat.create();

render.onTriggered=function()
{
    cgl.pushViewMatrix();

    tempQuat=quat.clone(viewDirQuat);
    quat.invert(tempQuat,tempQuat);

    if(window.orientation==90 ||window.orientation==-90)
    {
        quat.setAxisAngle(displayOrientQuat,[0,0,1],window.orientation*CGL.DEG2RAD);
        quat.multiply(tempQuat,displayOrientQuat,tempQuat);
    }

    mat4.fromQuat(transMatrix,tempQuat);
    mat4.multiply(cgl.vMatrix,cgl.vMatrix,transMatrix);
    mat4.translate(cgl.vMatrix,cgl.vMatrix,[1,0,0]);

    next.trigger();
    cgl.popViewMatrix();
};

// frp, http://asterixcreative.com/blog/mobile-gyroscope-with-javascript-and-quaternions-programming-tutorial-part-1/
function quatFromEuler(quat,alpha,beta,gamma)
{
	var x = CGL.DEG2RAD*beta;
	var y = CGL.DEG2RAD*gamma;
	var z = CGL.DEG2RAD*alpha;

	var cX = Math.cos( x/2 );
	var cY = Math.cos( y/2 );
	var cZ = Math.cos( z/2 );
	var sX = Math.sin( x/2 );
	var sY = Math.sin( y/2 );
	var sZ = Math.sin( z/2 );

	quat[0] = sX * cY * cZ - cX * sY * sZ;
	quat[1] = cX * sY * cZ + sX * cY * sZ;
	quat[2] = cX * cY * sZ + sX * sY * cZ;
	quat[3] = cX * cY * cZ - sX * sY * sZ;

	return quat;	  
}

function onOrientationChange(event)
{
    var alpha = (event.alpha || 0);
    var beta  = (event.beta || 0 );
    var gamma = (event.gamma || 0);

    winOrient.set( window.orientation||0 );
    quatFromEuler(viewDirQuat,alpha,beta,gamma);
}






};

Ops.Exp.Gl.DeviceOrientationCamera.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Anim.RelativeTime
// 
// **************************************************************

Ops.Anim.RelativeTime = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='RelativeTime';

var exe=op.inFunction("exe");
var mul=op.inValue("Multiply",1);
var result=op.outValue("result");

exe.onTriggered=update;
update();

function update()
{
    result.set( op.patch.freeTimer.get()*mul.get() );
}



};

Ops.Anim.RelativeTime.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Math.Multiply
// 
// **************************************************************

Ops.Math.Multiply = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const number1=op.addInPort(new Port(op,"number1"));
const number2=op.addInPort(new Port(op,"number2"));
const result=op.addOutPort(new Port(op,"result"));

function update()
{
    const n1=number1.get();
    const n2=number2.get();

    if(isNaN(n1))n1=0;
    if(isNaN(n2))n2=0;

    result.set( n1*n2 );
}

number1.onValueChanged=update;
number2.onValueChanged=update;

number1.set(1);
number2.set(2);


};

Ops.Math.Multiply.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Meshes.Cube
// 
// **************************************************************

Ops.Gl.Meshes.Cube = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='Cube';

var render=op.inFunction('render');
var width=op.inValue('width');
var height=op.inValue('height');
var lengt=op.inValue('length');
var center=op.inValueBool('center');

var active=op.inValueBool('Active',true);

var trigger=op.outFunction('trigger');
var geomOut=op.outObject("geometry");


var cgl=op.patch.cgl;
var geom=null;
var mesh=null;
width.set(1.0);
height.set(1.0);
lengt.set(1.0);
center.set(true);

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


    geom.verticesIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];

    mesh=new CGL.Mesh(cgl,geom);
    geomOut.set(null);
    geomOut.set(geom);

}

width.onValueChanged=buildMesh;
height.onValueChanged=buildMesh;
lengt.onValueChanged=buildMesh;
center.onValueChanged=buildMesh;



buildMesh();

};

Ops.Gl.Meshes.Cube.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.String.ObjectToString
// 
// **************************************************************

Ops.String.ObjectToString = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var obj=op.inObject("Object");
var result=op.outValue("Result");

obj.onChange=update;

function update()
{
    try
    {
        var string="";
        var o=obj.get();

        if(typeof(o[i])==='number') o[i]=Math.round(o[i]*100)/100;

        for(var i in o)
            string+=i+": "+o[i]+"\n";

        result.set(string);
    }
    catch(e)
    {
        result.set("error");
    }
}



};

Ops.String.ObjectToString.prototype = new CABLES.Op();

//----------------

