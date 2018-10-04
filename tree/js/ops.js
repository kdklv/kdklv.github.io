"use strict";

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Html=Ops.Html || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};

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
// Ops.Html.DivElement
// 
// **************************************************************

Ops.Html.DivElement = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const inId=op.inValueString("Id");
const inClass=op.inValueString("Class");
const inText=op.inValueString("Text","Hello Div");
const inStyle=op.inValueEditor("Style","position:absolute;z-index:9999;","css");

const inInteractive=op.inValueBool("Interactive",false);
const inVisible=op.inValueBool("Visible",true);

const outElement=op.outObject("DOM Element");
const outHover=op.outValue("Hover");
const outClicked=op.outFunction("Clicked");

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

//----------------



// **************************************************************
// 
// Ops.Html.TransformElement
// 
// **************************************************************

Ops.Html.TransformElement = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const exec=op.inFunction("Exec");
const inEle=op.inObject("Element");
const next=op.outFunction("Next");

const cgl=op.patch.cgl;
var x=0;
var y=0;
var m=mat4.create();
var pos=vec3.create();
var trans=vec3.create();

exec.onTriggered=setProperties;
op.onDelete=removeProperties;

var oldEle=null;

inEle.onLinkChanged = function() 
{
    if(!inEle.isLinked())
    {
        if(oldEle)
        {
            removeProperties(oldEle);
        }
    }
    else
    {
        oldEle=inEle.get();
    }
};

function getScreenCoord()
{
    mat4.multiply(m,cgl.vMatrix,cgl.mMatrix);
    vec3.transformMat4(pos, [0,0,0], m);
    vec3.transformMat4(trans, pos, cgl.pMatrix);
    var vp=cgl.getViewPort();
    
    x=( vp[2]-( vp[2]  * 0.5 - trans[0] * vp[2] * 0.5 / trans[2] ));
    y=( vp[3]-( vp[3]  * 0.5 + trans[1] * vp[3] * 0.5 / trans[2] ));
}

function setProperties()
{
    var ele=inEle.get();
    oldEle=ele;
    if(ele)
    {
        getScreenCoord();
        var offsetTop = cgl.canvas.offsetTop;
        ele.style.top=offsetTop+y+'px';
        ele.style.left=x+'px';
    }

    next.trigger();
}

function removeProperties(ele)
{
    if(!ele) ele=inEle.get();
    if(ele)
    {
        ele.style.top='initial';
        ele.style.left='initial';
    }
}

op.addEventListener("onEnabledChange",function(enabled)
{
    if(enabled) setProperties();
        else removeProperties();
});


};

Ops.Html.TransformElement.prototype = new CABLES.Op();

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
// Ops.Gl.Meshes.Line
// 
// **************************************************************

Ops.Gl.Meshes.Line = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name="Line";

var render=op.inFunction("Render");
var x1=op.inValue("X 1");
var y1=op.inValue("Y 1");
var z1=op.inValue("Z 1");

var x2=op.inValue("X 2",1);
var y2=op.inValue("Y 2",1);
var z2=op.inValue("Z 2",1);

var next=op.outFunction("Next");

var cgl=op.patch.cgl;

var geom=new CGL.Geometry("simplespline");
geom.vertices=[0,0,0,0,0,0,0,0,0];
var mesh=new CGL.Mesh(cgl,geom);
var buff=new Float32Array();

var changed=false;

x1.onChange=function(){ geom.vertices[0]=x1.get(); changed=true; };
y1.onChange=function(){ geom.vertices[1]=y1.get(); changed=true; };
z1.onChange=function(){ geom.vertices[2]=z1.get(); changed=true; };

x2.onChange=function(){ geom.vertices[3]=x2.get(); changed=true; };
y2.onChange=function(){ geom.vertices[4]=y2.get(); changed=true; };
z2.onChange=function(){ geom.vertices[5]=z2.get(); changed=true; };


render.onTriggered=function()
{
    if(op.instanced(render))return;

    if(changed)
    {
        mesh.updateVertices(geom);
        changed=false;
    }
    
    var shader=cgl.getShader();
    
    var oldPrim=shader.glPrimitive;
    shader.glPrimitive=cgl.gl.LINES;
    // mesh.setAttribute(CGL.SHADERVAR_VERTEX_POSITION,buff,3);
    
    mesh.render(shader);
    
    shader.glPrimitive=oldPrim;
    
    
    next.trigger();
    
};

};

Ops.Gl.Meshes.Line.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Matrix.OrbitControls
// 
// **************************************************************

Ops.Gl.Matrix.OrbitControls = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
const minDist=op.addInPort(new Port(op,"min distance",OP_PORT_TYPE_VALUE));
const maxDist=op.addInPort(new Port(op,"max distance",OP_PORT_TYPE_VALUE));

const minRotY=op.inValue("min rot y",0);
const maxRotY=op.inValue("max rot y",0);

const initialAxis=op.addInPort(new Port(op,"initial axis y",OP_PORT_TYPE_VALUE,{display:'range'}));
const initialX=op.addInPort(new Port(op,"initial axis x",OP_PORT_TYPE_VALUE,{display:'range'}));
const initialRadius=op.inValue("initial radius",0);



const mul=op.addInPort(new Port(op,"mul",OP_PORT_TYPE_VALUE));

const smoothness=op.inValueSlider("Smoothness",1.0);
const restricted=op.addInPort(new Port(op,"restricted",OP_PORT_TYPE_VALUE,{display:'bool'}));

const active=op.inValueBool("Active",true);

const inReset=op.inFunctionButton("Reset");

const allowPanning=op.inValueBool("Allow Panning",true);
const allowZooming=op.inValueBool("Allow Zooming",true);
const allowRotation=op.inValueBool("Allow Rotation",true);
const pointerLock=op.inValueBool("Pointerlock",false);

const speedX=op.inValue("Speed X",1);
const speedY=op.inValue("Speed Y",1);

const trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
const outRadius=op.addOutPort(new Port(op,"radius",OP_PORT_TYPE_VALUE));
const outYDeg=op.addOutPort(new Port(op,"Rot Y",OP_PORT_TYPE_VALUE));
const outXDeg=op.addOutPort(new Port(op,"Rot X",OP_PORT_TYPE_VALUE));

restricted.set(true);
mul.set(1);
minDist.set(0.05);
maxDist.set(99999);

inReset.onTriggered=reset;

const cgl=op.patch.cgl;
var eye=vec3.create();
var vUp=vec3.create();
var vCenter=vec3.create();
var viewMatrix=mat4.create();
var vOffset=vec3.create();

initialAxis.set(0.5);


var mouseDown=false;
var radius=5;
outRadius.set(radius);

var lastMouseX=0,lastMouseY=0;
var percX=0,percY=0;


vec3.set(vCenter, 0,0,0);
vec3.set(vUp, 0,1,0);

var tempEye=vec3.create();
var finalEye=vec3.create();
var tempCenter=vec3.create();
var finalCenter=vec3.create();

var px=0;
var py=0;

var divisor=1;
var element=null;
updateSmoothness();

op.onDelete=unbind;

var doLockPointer=false;

pointerLock.onChange=function()
{
    doLockPointer=pointerLock.get();
    console.log("doLockPointer",doLockPointer);
};

function reset()
{
    px=px%(Math.PI*2);
    py=py%(Math.PI*2);

    percX=(initialX.get()*Math.PI*2);
    percY=(initialAxis.get()-0.5);
    radius=initialRadius.get();
    eye=circlePos( percY );
}

function updateSmoothness()
{
    divisor=smoothness.get()*10+1.0;
}

smoothness.onChange=updateSmoothness;

var initializing=true;

function ip(val,goal)
{
    if(initializing)return goal;
    return val+(goal-val)/divisor;
}

var lastPy=0;

render.onTriggered=function()
{
    cgl.pushViewMatrix();

    px=ip(px,percX);
    py=ip(py,percY);
    
    var degY=(py+0.5)*180;
    

    if(minRotY.get()!==0 && degY<minRotY.get()) 
    {
        degY=minRotY.get();
        py=lastPy;
    }
    else if(maxRotY.get()!==0 && degY>maxRotY.get()) 
    {
        degY=maxRotY.get();
        py=lastPy;
    }
    else
    {
        lastPy=py;
    }

    outYDeg.set( degY );
    // outXDeg.set( (px)*180 );
    outXDeg.set( (px)*CGL.RAD2DEG );
    

    circlePosi(eye, py );
    
    vec3.add(tempEye, eye, vOffset);
    vec3.add(tempCenter, vCenter, vOffset);

    finalEye[0]=ip(finalEye[0],tempEye[0]);
    finalEye[1]=ip(finalEye[1],tempEye[1]);
    finalEye[2]=ip(finalEye[2],tempEye[2]);
    
    finalCenter[0]=ip(finalCenter[0],tempCenter[0]);
    finalCenter[1]=ip(finalCenter[1],tempCenter[1]);
    finalCenter[2]=ip(finalCenter[2],tempCenter[2]);
    
    mat4.lookAt(viewMatrix, finalEye, finalCenter, vUp);
    mat4.rotate(viewMatrix, viewMatrix, px, vUp);
    mat4.multiply(cgl.vMatrix,cgl.vMatrix,viewMatrix);

    trigger.trigger();
    cgl.popViewMatrix();
    initializing=false;
};

function circlePosi(vec,perc)
{
    const mmul=mul.get();
    if(radius<minDist.get()*mmul)radius=minDist.get()*mmul;
    if(radius>maxDist.get()*mmul)radius=maxDist.get()*mmul;
    
    outRadius.set(radius*mmul);
    
    var i=0,degInRad=0;
    // var vec=vec3.create();
    degInRad = 360*perc/2*CGL.DEG2RAD;
    vec3.set(vec,
        Math.cos(degInRad)*radius*mmul,
        Math.sin(degInRad)*radius*mmul,
        0);
    return vec;
}


function circlePos(perc)
{
    const mmul=mul.get();
    if(radius<minDist.get()*mmul)radius=minDist.get()*mmul;
    if(radius>maxDist.get()*mmul)radius=maxDist.get()*mmul;
    
    outRadius.set(radius*mmul);
    
    var i=0,degInRad=0;
    var vec=vec3.create();
    degInRad = 360*perc/2*CGL.DEG2RAD;
    vec3.set(vec,
        Math.cos(degInRad)*radius*mmul,
        Math.sin(degInRad)*radius*mmul,
        0);
    return vec;
}

function onmousemove(event)
{
    if(!mouseDown) return;

    var x = event.clientX;
    var y = event.clientY;
    
    var movementX=(x-lastMouseX)*speedX.get();
    var movementY=(y-lastMouseY)*speedY.get();

    if(doLockPointer)
    {
        movementX=event.movementX*mul.get();
        movementY=event.movementY*mul.get();
    }

    if(event.which==3 && allowPanning.get())
    {
        vOffset[2]+=movementX*0.01*mul.get();
        vOffset[1]+=movementY*0.01*mul.get();
    }
    else
    if(event.which==2 && allowZooming.get())
    {
        radius+=movementY*0.05;
        eye=circlePos(percY);
    }
    else
    {
        if(allowRotation.get())
        {
            percX+=movementX*0.003;
            percY+=movementY*0.002;
            
            if(restricted.get())
            {
                if(percY>0.5)percY=0.5;
                if(percY<-0.5)percY=-0.5;
            }
        }
    }

    lastMouseX=x;
    lastMouseY=y;
}

function onMouseDown(event)
{
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    mouseDown=true;
    
    if(doLockPointer)
    {
        var el=op.patch.cgl.canvas;
        el.requestPointerLock = el.requestPointerLock || el.mozRequestPointerLock || el.webkitRequestPointerLock;
        if(el.requestPointerLock) el.requestPointerLock();
        else console.log("no t found");
        // document.addEventListener("mousemove", onmousemove, false);

        document.addEventListener('pointerlockchange', lockChange, false);
        document.addEventListener('mozpointerlockchange', lockChange, false);
        document.addEventListener('webkitpointerlockchange', lockChange, false);
    }
}

function onMouseUp()
{
    mouseDown=false;
    // cgl.canvas.style.cursor='url(/ui/img/rotate.png),pointer';
            
    if(doLockPointer)
    {
        document.removeEventListener('pointerlockchange', lockChange, false);
        document.removeEventListener('mozpointerlockchange', lockChange, false);
        document.removeEventListener('webkitpointerlockchange', lockChange, false);

        if(document.exitPointerLock) document.exitPointerLock();
        document.removeEventListener("mousemove", onmousemove, false);
    }
}

function lockChange()
{
    var el=op.patch.cgl.canvas;

    if (document.pointerLockElement === el || document.mozPointerLockElement === el || document.webkitPointerLockElement === el)
    {
        document.addEventListener("mousemove", onmousemove, false);
        console.log("listening...");
    }
}

function onMouseEnter(e)
{
    // cgl.canvas.style.cursor='url(/ui/img/rotate.png),pointer';
}

initialRadius.onValueChange(function()
{
    radius=initialRadius.get();
    reset();
});

initialX.onValueChange(function()
{
    px=percX=(initialX.get()*Math.PI*2);
});

initialAxis.onValueChange(function()
{
    py=percY=(initialAxis.get()-0.5);
    eye=circlePos(percY);
});

var onMouseWheel=function(event)
{
    if(allowZooming.get())
    {
        var delta=CGL.getWheelSpeed(event)*0.06;
        radius+=(parseFloat(delta))*1.2;

        eye=circlePos(percY);
        event.preventDefault();
    }
};

var ontouchstart=function(event)
{
    doLockPointer=false;
    if(event.touches && event.touches.length>0) onMouseDown(event.touches[0]);
};

var ontouchend=function(event)
{
    doLockPointer=false;
    onMouseUp();
};

var ontouchmove=function(event)
{
    doLockPointer=false;
    if(event.touches && event.touches.length>0) onmousemove(event.touches[0]);
};

active.onChange=function()
{
    if(active.get())bind();
        else unbind();
}


this.setElement=function(ele)
{
    unbind();
    element=ele;
    bind();
}

function bind()
{
    element.addEventListener('mousemove', onmousemove);
    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mouseleave', onMouseUp);
    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('contextmenu', function(e){e.preventDefault();});
    element.addEventListener('wheel', onMouseWheel);

    element.addEventListener('touchmove', ontouchmove);
    element.addEventListener('touchstart', ontouchstart);
    element.addEventListener('touchend', ontouchend);
}

function unbind()
{
    if(!element)return;
    
    element.removeEventListener('mousemove', onmousemove);
    element.removeEventListener('mousedown', onMouseDown);
    element.removeEventListener('mouseup', onMouseUp);
    element.removeEventListener('mouseleave', onMouseUp);
    element.removeEventListener('mouseenter', onMouseUp);
    element.removeEventListener('wheel', onMouseWheel);

    element.removeEventListener('touchmove', ontouchmove);
    element.removeEventListener('touchstart', ontouchstart);
    element.removeEventListener('touchend', ontouchend);
}

eye=circlePos(0);
this.setElement(cgl.canvas);


bind();

initialX.set(0.25);
initialRadius.set(0.05);


};

Ops.Gl.Matrix.OrbitControls.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Html.TransformCSS3DElement
// 
// **************************************************************

Ops.Html.TransformCSS3DElement = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const
	cgl = op.patch.cgl,
	origins = [
	    'top-left','top-middle','top-right',
	    'center-left','center-middle','center-right',
	    'bottom-left','bottom-middle','bottom-right'
    ],
	trigger = op.inFunction('trigger'),
	inElement = op.inObject('DOMElement'),
	inOrigin = op.inValueSelect("origin",origins,'center-middle'),
	next = op.outFunction('next'),
	sCSSMatrix = mat4.create(),
	sScalingVector = vec3.create()
;

op.uuid = CABLES.uuid();
var oldEle=null;

var elProjection = cgl.canvas.parentElement.querySelector('[data-provide="css3d"]');
if (!elProjection) {
	elProjection = document.createElement('div');
	elProjection.style.position = "absolute";
	elProjection.style.top = elProjection.style.left = 0;
	elProjection.style.width = elProjection.style.height = "100%";
	elProjection.dataset.provide = "css3d";
	elProjection.style.zIndex = 1000;
	elProjection.style.pointerEvents = "none";
	elProjection.style.perspectiveOrigin = "center center";
	cgl.canvas.parentElement.appendChild(elProjection);

	var style = document.createElement('style');
	style.type="text/css";
	style.textContent = [
	    '.cables-loading .cables-css3dview {visibility:hidden;pointer-events:none;}',
	    '.cables-css3dview {position:absolute;left:0;top:0;width:100%;height:100%;transform-style:preserve-3d;}',
        '.cables-css3dview > * {pointer-events:auto;}',
        '.cables-css3dview.origin-top-left > * {}',
        '.cables-css3dview.origin-top-middle > * {transform:translate3d(-50%,0,0);}',
        '.cables-css3dview.origin-top-right > * {transform:translate3d(-100%,0,0);}',
        '.cables-css3dview.origin-center-left > * {transform:translate3d(0,-50%,0);}',
        '.cables-css3dview.origin-center-middle > * {transform:translate3d(-50%,-50%,0);}',
        '.cables-css3dview.origin-center-right > * {transform:translate3d(-100%,-50%,0);}',
        '.cables-css3dview.origin-bottom-left > * {transform:translate3d(0,-100%,0);}',
        '.cables-css3dview.origin-bottom-middle > * {transform:translate3d(-50%,-100%,0);}',
        '.cables-css3dview.origin-bottom-right > * {transform:translate3d(-100%,-100%,0);}'
	].join('\n');
	elProjection.appendChild(style);
}

op.onDelete = function() {
	var el = elProjection.querySelector('[data-ccs3did="'+op.uuid+'"]');
	if (el) el.parentElement.removeChild(el);
}

function wrap (el) {
	var view = document.createElement('div');
	view.classList.add('cables-css3dview');
	view.dataset.css3did = op.uuid;
	view.appendChild(el);
	return view;
}

inElement.onChange = function (self, el) {
	op.onDelete();
	if (!el) return;
	elProjection.appendChild(wrap(el));
	inOrigin.onChange();
}
inOrigin.onChange = function () {
    var el = inElement.get();
    if (!el) return;
    DOMTokenList.prototype.remove.apply(el.parentElement.classList, origins.map(function (o){return 'origin-'+o}));
    el.parentElement.classList.add('origin-'+inOrigin.get());
}
trigger.onTriggered = function () {
	var pxfov = 0.5 / (1 / cgl.pMatrix[5]) * cgl.gl.drawingBufferHeight;
	elProjection.style.perspective = pxfov + "px";
	var a = -2 * cgl.gl.drawingBufferWidth / cgl.gl.drawingBufferHeight;
	vec3.set(
		sScalingVector,
		a / cgl.gl.drawingBufferWidth,
		-2 / cgl.gl.drawingBufferHeight,
		1
	);
	var el = inElement.get();
	if (el) {
		mat4.multiply(
			sCSSMatrix,
			cgl.vMatrix,
			cgl.mMatrix
		);
		mat4.scale(
			sCSSMatrix,
			sCSSMatrix,
			sScalingVector
		);
		el.parentElement.style.transform = "translateZ("+pxfov+"px) matrix3d(" +
			sCSSMatrix[0] + ',' +
			-sCSSMatrix[1] + ',' +
			sCSSMatrix[2] + ',' +
			sCSSMatrix[3] + ',' +
			sCSSMatrix[4] + ',' +
			-sCSSMatrix[5] + ',' +
			sCSSMatrix[6] + ',' +
			sCSSMatrix[7] + ',' +
			sCSSMatrix[8] + ',' +
			-sCSSMatrix[9] + ',' +
			sCSSMatrix[10] + ',' +
			sCSSMatrix[11] + ',' +
			sCSSMatrix[12] + ',' +
			-sCSSMatrix[13] + ',' +
			sCSSMatrix[14] + ',' +
			sCSSMatrix[15] +
		") scaleX(-1) translate3d("+
			cgl.gl.drawingBufferWidth/2+"px,"+
			cgl.gl.drawingBufferHeight/2+"px"+
			",0"+
		")";
	}
	next.trigger();
	oldEle=el;
};
inOrigin.onChange();

function removeProperties(el)
{
    if(!el)el = inElement.get();
    if(el)el.parentElement.style.transform='';
}

op.onDelete=function()
{
    removeProperties(oldEle);
};

inElement.onLinkChanged = function() 
{
    if(!inElement.isLinked())
        removeProperties(oldEle);
};

op.addEventListener("onEnabledChange",function(enabled)
{
    if(!enabled) removeProperties();
});


};

Ops.Html.TransformCSS3DElement.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Html.FontFile
// 
// **************************************************************

Ops.Html.FontFile = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var filename=op.addInPort(new Port(op,"file",OP_PORT_TYPE_VALUE,{ display:'file',type:'string' } ));
var fontname=op.addInPort(new Port(op,"family",OP_PORT_TYPE_VALUE,{ type:'string' } ));

filename.onChange=addStyle;
fontname.onChange=addStyle;

var timeOut=-1;

var outLoaded=op.outValue("Loaded");
var fontFaceObj;

function addStyle()
{

    if(filename.get() && fontname.get())
    {
        if(document.fonts) {
            fontFaceObj = new FontFace(fontname.get(), 'url(' + filename.get() + ')');
            //console.log(fontFaceObj);
            
            // Add the FontFace to the FontFaceSet
            document.fonts.add(fontFaceObj);
            
            // Get the current status of the FontFace
            // (should be 'unloaded')
            // console.info('Current status', fontFaceObj.status);
            
            // Load the FontFace
            fontFaceObj.load();
            
            // Get the current status of the Fontface
            // (should be 'loading' or 'loaded' if cached)
            // console.info('Current status', fontFaceObj.status);
            
            // Wait until the font has been loaded, log the current status.
            fontFaceObj.loaded.then((fontFace) => {
                // console.info('Current status', fontFace.status);
                // console.log(fontFace.family, 'loaded successfully.');
                outLoaded.set(true);
                
                // Throw an error if loading wasn't successful
            }, (fontFace) => {
            console.error('Font loading error! Current status', fontFaceObj.status);
            });
        } else { // font loading api not supported
            var fileUrl=op.patch.getFilePath(String(filename.get()));
            var styleStr=''
                .endl()+'@font-face'
                .endl()+'{'
                .endl()+'  font-family: "'+fontname.get()+'";'
                .endl()+'  src: url("'+fileUrl+'") format("truetype");'
                .endl()+'}';
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = styleStr;
            document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1].appendChild(style);
            // TODO: Poll if font loaded
        }
    }
}


};

Ops.Html.FontFile.prototype = new CABLES.Op();

//----------------

