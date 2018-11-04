"use strict";

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Math=Ops.Math || {};
Ops.Html=Ops.Html || {};
Ops.Json3d=Ops.Json3d || {};
Ops.Trigger=Ops.Trigger || {};
Ops.Devices=Ops.Devices || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Deprecated=Ops.Deprecated || {};
Ops.Deprecated.Gl=Ops.Deprecated.Gl || {};
Ops.Devices.Mouse=Ops.Devices.Mouse || {};
Ops.Deprecated.Ops=Ops.Deprecated.Ops || {};
Ops.Deprecated.Ops.Gl=Ops.Deprecated.Ops.Gl || {};
Ops.Deprecated.Gl.Meshes=Ops.Deprecated.Gl.Meshes || {};
Ops.Deprecated.Ops.Gl.Meshes=Ops.Deprecated.Ops.Gl.Meshes || {};

//----------------



// **************************************************************
// 
// Ops.Gl.MainLoop
// 
// **************************************************************

Ops.Gl.MainLoop = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
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

//----------------



// **************************************************************
// 
// Ops.Trigger.Sequence
// 
// **************************************************************

Ops.Trigger.Sequence = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};

var exe=op.addInPort(new CABLES.Port(op,"exe",CABLES.OP_PORT_TYPE_FUNCTION));

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

//----------------



// **************************************************************
// 
// Ops.Gl.Depth
// 
// **************************************************************

Ops.Gl.Depth = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
var cgl=op.patch.cgl;

var render=op.inTrigger('render');
var trigger=op.outTrigger('trigger');

var clear=op.addInPort(new CABLES.Port(op,"clear depth",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
var enable=op.addInPort(new CABLES.Port(op,"enable depth testing",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
var write=op.addInPort(new CABLES.Port(op,"write to depth buffer",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));

var depthFunc=op.addInPort(new CABLES.Port(op,"ratio",CABLES.OP_PORT_TYPE_VALUE ,{display:'dropdown',values:['never','always','less','less or equal','greater', 'greater or equal','equal','not equal']} ));
var theDepthFunc=cgl.gl.LEQUAL;

depthFunc.onChange=updateFunc;
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
// Ops.Deprecated.Gl.Meshes.Spline
// 
// **************************************************************

Ops.Deprecated.Gl.Meshes.Spline = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};

var render=op.inTrigger('render');
var thickness=op.addInPort(new CABLES.Port(op,"thickness",CABLES.OP_PORT_TYPE_VALUE));
var subDivs=op.addInPort(new CABLES.Port(op,"subDivs",CABLES.OP_PORT_TYPE_VALUE));
var bezier=op.addInPort(new CABLES.Port(op,"Bezier",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var centerpoint=op.addInPort(new CABLES.Port(op,"centerpoint",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var doClose=op.addInPort(new CABLES.Port(op,"Closed",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var renderLines=op.addInPort(new CABLES.Port(op,"Draw",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));

var trigger=op.outTrigger('trigger');
var triggerPoints=op.addOutPort(new CABLES.Port(op,"triggerPoints",CABLES.OP_PORT_TYPE_FUNCTION));
var outPoints=op.addOutPort(new CABLES.Port(op,"Points",CABLES.OP_PORT_TYPE_ARRAY));

renderLines.set(true);
centerpoint.set(false);
thickness.set(1.0);
outPoints.ignoreValueSerialize=true;

var points=[];
var mesh=null;
var oldLength=0;
var cgl=op.patch.cgl;


var geom=new CGL.Geometry("spline");

var mySplinePoints=[];
var oldSplinePoints=null;
render.onTriggered=function()
{

    if(cgl.frameStore.SplinePoints) oldSplinePoints=cgl.frameStore.SplinePoints;

    mySplinePoints.length=0;
    cgl.frameStore.SplinePoints=mySplinePoints;


    var shader=cgl.getShader();
    trigger.trigger();
    if(!shader)return;
    bufferData();

    cgl.pushModelMatrix();
    mat4.identity(cgl.mvMatrix);

    if(renderLines.get() && mesh)
    {
        var oldPrim=shader.glPrimitive;
        if(centerpoint.get()) shader.glPrimitive=cgl.gl.LINES;
            shader.glPrimitive=cgl.gl.LINE_STRIP;

        cgl.gl.lineWidth(thickness.get());

        mesh.render(shader);
        shader.glPrimitive=oldPrim;
    }

    if(triggerPoints.isLinked())
    {
        for(var i=0;i<cgl.frameStore.SplinePoints.length;i+=3)
        {
            var vec=[0,0,0];
            vec3.set(vec, cgl.frameStore.SplinePoints[i+0], cgl.frameStore.SplinePoints[i+1], cgl.frameStore.SplinePoints[i+2]);
            cgl.pushModelMatrix();
            mat4.translate(cgl.mvMatrix,cgl.mvMatrix, vec);
            triggerPoints.trigger();
            cgl.popModelMatrix();
        }
    }

    outPoints.set(null);
    outPoints.set(points);

    cgl.popModelMatrix();
    // cgl.frameStore.SplinePoints.length=0;
    mySplinePoints.length=0;

    if(oldSplinePoints) cgl.frameStore.SplinePoints=oldSplinePoints;
    oldSplinePoints=null;

};

function ip(x0,x1,x2,t)//Bezier
{
    var r =(x0 * (1-t) * (1-t) + 2 * x1 * (1 - t)* t + x2 * t * t);
    return r;
}


function bufferData()
{
    var i=0,k=0,j=0;
    var subd=subDivs.get();

    if(!cgl.frameStore.SplinePoints || cgl.frameStore.SplinePoints.length===0)return;
    points.length=0;

    if(doClose.get())
    {
        cgl.frameStore.SplinePoints.push(cgl.frameStore.SplinePoints[0]);
        cgl.frameStore.SplinePoints.push(cgl.frameStore.SplinePoints[1]);
        cgl.frameStore.SplinePoints.push(cgl.frameStore.SplinePoints[2]);
    }

    if(centerpoint.get())
    {
        for(i=0;i<cgl.frameStore.SplinePoints.length;i+=3)
        {
            //center point...
            points.push( cgl.frameStore.SplinePoints[0] );
            points.push( cgl.frameStore.SplinePoints[1] );
            points.push( cgl.frameStore.SplinePoints[2] );

            //other point
            points.push( cgl.frameStore.SplinePoints[i+0] );
            points.push( cgl.frameStore.SplinePoints[i+1] );
            points.push( cgl.frameStore.SplinePoints[i+2] );
        }

        // cgl.frameStore.SplinePoints=points;
    }
    else
    if(subd>0 && !bezier.get())
    {

        points.length=(cgl.frameStore.SplinePoints.length-3)*(subd);

        // console.log("should be length",points.length);

        var count=0;
        for(i=0;i<cgl.frameStore.SplinePoints.length-3;i+=3)
        {
            for(j=0;j<subd;j++)
            {
                for(k=0;k<3;k++)
                {
                    points[count]=
                        cgl.frameStore.SplinePoints[i+k]+
                            ( cgl.frameStore.SplinePoints[i+k+3] - cgl.frameStore.SplinePoints[i+k] ) *
                            j/subd
                            ;
                    count++;
                }
            }
        }

        // console.log(" length",count);

    }
    else
    if(subd>0 && bezier.get() )
    {
        points.length=(cgl.frameStore.SplinePoints.length-3)*(subd);
        var count=0;

        for(i=3;i<cgl.frameStore.SplinePoints.length-6;i+=3)
        {
            for(j=0;j<subd;j++)
            {
                for(k=0;k<3;k++)
                {
                    var p=ip(
                            (cgl.frameStore.SplinePoints[i+k-3]+cgl.frameStore.SplinePoints[i+k])/2,
                            cgl.frameStore.SplinePoints[i+k+0],
                            (cgl.frameStore.SplinePoints[i+k+3]+cgl.frameStore.SplinePoints[i+k+0])/2,
                            j/subd
                            );

                    // points.push(p);
                    points[count]=p;
                    count++;
                }
            }
        }

    }
    else
    {
        points = cgl.frameStore.SplinePoints.slice(); //fast array copy
    }

    if(thickness.get()<1) thickness.set(1);

    if(!points || points.length===0)
    {
        // console.log('no points...',cgl.frameStore.SplinePoints.length);
    }


    if(renderLines.get())
    {
        geom.clear();
        geom.vertices=points;

        // console.log(geom.vertices.length);

        if(oldLength!=geom.vertices.length)
        {
            oldLength=geom.vertices.length;
            // if(geom.vertices.length*2!=geom.texCoords.length)geom.texCoords.length=geom.vertices.length*2;
            geom.verticesIndices.length=geom.vertices.length;
            for(i=0;i<geom.vertices.length;i+=3)
            {
                geom.texCoords[i*2+0]=0;
                geom.texCoords[i*2+1]=0;
                geom.verticesIndices[i/3]=i/3;
            }
        }

        if(!mesh) mesh=new CGL.Mesh(cgl,geom);
            else mesh.setGeom(geom);
    }

}

bufferData();

};

Ops.Deprecated.Gl.Meshes.Spline.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Deprecated.Ops.Gl.Meshes.SplinePoint
// 
// **************************************************************

Ops.Deprecated.Ops.Gl.Meshes.SplinePoint = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
op.name='SplinePoint';

var render=op.inTrigger('render');
var trigger=op.outTrigger('trigger');

var cgl=op.patch.cgl;

render.onTriggered=function()
{
    if(!cgl.frameStore.SplinePoints)return;
    var pos=[0,0,0];
    vec3.transformMat4(pos, [0,0,0], cgl.mvMatrix);

    cgl.frameStore.SplinePoints.push(pos[0]);
    cgl.frameStore.SplinePoints.push(pos[1]);
    cgl.frameStore.SplinePoints.push(pos[2]);

    trigger.trigger();
};


};

Ops.Deprecated.Ops.Gl.Meshes.SplinePoint.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.CanvasSize
// 
// **************************************************************

Ops.Gl.CanvasSize = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};


var width=op.addOutPort(new CABLES.Port(op,"width",CABLES.OP_PORT_TYPE_VALUE));
var height=op.addOutPort(new CABLES.Port(op,"height",CABLES.OP_PORT_TYPE_VALUE));
var pixelRatio=op.outValue("Pixel Ratio");
var aspect=op.outValue("Aspect Ratio");

var cgl=op.patch.cgl;
cgl.addEventListener("resize",update);
update();

function update()
{
    height.set(cgl.canvasHeight);
    width.set(cgl.canvasWidth);
    pixelRatio.set(window.devicePixelRatio);
    aspect.set(cgl.canvasWidth/cgl.canvasHeight);
}


};

Ops.Gl.CanvasSize.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Math.Divide
// 
// **************************************************************

Ops.Math.Divide = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const number1 = op.addInPort(new CABLES.Port(op, "number1"));
const number2 = op.addInPort(new CABLES.Port(op, "number2"));
const result = op.addOutPort(new CABLES.Port(op, "result"));

const exec = function() {
    result.set( number1.get() / number2.get() );
};

number1.set(1);
number2.set(1);

number1.onChange=exec;
number2.onChange=exec;
exec();


};

Ops.Math.Divide.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Math.Multiply
// 
// **************************************************************

Ops.Math.Multiply = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const number1=op.addInPort(new CABLES.Port(op,"number1"));
const number2=op.addInPort(new CABLES.Port(op,"number2"));
const result=op.addOutPort(new CABLES.Port(op,"result"));

function update()
{
    const n1=number1.get();
    const n2=number2.get();

    if(isNaN(n1))n1=0;
    if(isNaN(n2))n2=0;

    result.set( n1*n2 );
}

number1.onChange=update;
number2.onChange=update;

number1.set(1);
number2.set(2);


};

Ops.Math.Multiply.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Matrix.Transform
// 
// **************************************************************

Ops.Gl.Matrix.Transform = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const render=op.addInPort(new CABLES.Port(op,"render",CABLES.OP_PORT_TYPE_FUNCTION));
const trigger=op.addOutPort(new CABLES.Port(op,"trigger",CABLES.OP_PORT_TYPE_FUNCTION));


const posX=op.inValue("posX",0);
const posY=op.inValue("posY",0);
const posZ=op.inValue("posZ",0);

const scale=op.inValue("scale",0);

const rotX=op.inValue("rotX",0);
const rotY=op.inValue("rotY",0);
const rotZ=op.inValue("rotZ",0);


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
// Ops.Math.DeltaSum
// 
// **************************************************************

Ops.Math.DeltaSum = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const inVal=op.inValue("Delta Value");
const defVal=op.inValue("Default Value",0);
const inReset=op.inTriggerButton("Reset");
const inLimit=op.inValueBool("Limit",false);
const inMin=op.inValue("Min",0);
const inMax=op.inValue("Max",100);
const inMul=op.inValue("Multiply",1);

inVal.changeAlways=true;

var value=0;
var outVal=op.outValue("Absolute Value");
inLimit.onChange=updateLimit;
updateLimit();

function resetValue()
{
    value=defVal.get();
    outVal.set(value);

}

defVal.onChange=resetValue;
inReset.onTriggered=resetValue;

function updateLimit()
{
    if(!inLimit.get())
    {
        inMin.setUiAttribs({hidePort:true,greyout:true});
        inMax.setUiAttribs({hidePort:true,greyout:true});
    }
    else
    {
        inMin.setUiAttribs({hidePort:false,greyout:false});
        inMax.setUiAttribs({hidePort:false,greyout:false});
    }
}


inVal.onChange=function()
{
    value+=inVal.get()*inMul.get();

    if(inLimit.get())
    {
        if(value<inMin.get())value=inMin.get();
        if(value>inMax.get())value=inMax.get();
    }

    outVal.set(value);
};


};

Ops.Math.DeltaSum.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Devices.Mouse.MouseWheel
// 
// **************************************************************

Ops.Devices.Mouse.MouseWheel = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const valIn=op.inValue("Value",0);
const mul=op.inValue("Multiply",1);
const minUnlimitedPort = op.inValueBool('Min Unlimited', false);
minUnlimitedPort.setUiAttribs({ hidePort: true });
const min=op.inValue("min",-100);
const maxUnlimitedPort = op.inValueBool('Max Unlimited', false);
maxUnlimitedPort.setUiAttribs({ hidePort: true });
const max=op.inValue("max", 100);
const smooth=op.inValueBool("smooth");
const smoothSpeed=op.inValue("delay",0.3);
const preventScroll=op.inValueBool("prevent scroll");
const flip=op.inValueBool("Flip Direction");
const active=op.inValueBool("active",true);
const reset=op.inTriggerButton("Reset");
const absVal=op.outValue("absolute value",0);
const delta=op.outValue("delta",0);

const cgl=op.patch.cgl;
var value=0;

var anim=new CABLES.TL.Anim();
anim.defaultEasing=CABLES.TL.EASING_EXPO_OUT;

var startTime=CABLES.now()/1000.0;
var v=0;
var smoothTimer=0;

anim.clear();
anim.setValue(CABLES.now()/1000.0-startTime,absVal.get());
var dir=1;
var isWindows=navigator.appVersion.indexOf("Win")!=-1;

addListener();

min.onChange=function()
{
    checkValue();
    absVal.set( v );
};

max.onChange=function()
{
    checkValue();
    absVal.set( v );
};

minUnlimitedPort.onChange = function() {
    var minUnlimited = minUnlimitedPort.get();
    min.setUiAttribs({
        hidePort: minUnlimited,
        greyout: minUnlimited
    });
};

maxUnlimitedPort.onChange = function() {
    var maxUnlimited = maxUnlimitedPort.get();
    max.setUiAttribs({
        hidePort: maxUnlimited,
        greyout: maxUnlimited
    });
};

reset.onTriggered=function()
{
    anim.clear();
    anim.setValue(CABLES.now()/1000.0-startTime,valIn.get());
    absVal.set(valIn.get());
    v=0;
};

valIn.onChange=function()
{
    v=valIn.get();

    checkValue();

    absVal.set( v );

    anim.clear();
    anim.setValue(CABLES.now()/1000.0-startTime,absVal.get());

};

function updateSmooth()
{
    var v=anim.getValue( CABLES.now()/1000.0-startTime );

    absVal.set( v );
}

smooth.onChange=function()
{
    if(smooth.get()) smoothTimer = setInterval(updateSmooth, 15);
        else clearTimeout(smoothTimer);
};

// var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;


function checkValue()
{
    if(!maxUnlimitedPort.get()) {
        v=Math.min(max.get(),v);
    }
    if(!minUnlimitedPort.get()) {
        v=Math.max(min.get(),v);
    }
}

flip.onChange=function()
{
    if(flip.get())dir=-1;
        else dir=1;
};

var vOut=0;

function onMouseWheel(e)
{
    var d= CGL.getWheelSpeed(e)*(dir)*mul.get();
    if(isWindows)d*=4;

    delta.set(0);
    delta.set(d);
    v-=d;
    checkValue();

    if( !smooth.get() )
    {
        absVal.set(v);
    }
    else
    {
        anim.clear();
        anim.setValue(CABLES.now()/1000.0-startTime,absVal.get());
        anim.setValue(CABLES.now()/1000.0-startTime+smoothSpeed.get(),v);
    }

    if(preventScroll.get()) e.preventDefault();
}

function addListener()
{
    cgl.canvas.addEventListener('wheel', onMouseWheel);
}

function removeListener()
{
    cgl.canvas.removeEventListener('wheel', onMouseWheel);
}


active.onChange=function()
{
    removeListener();
    if(active.get())addListener();
};



};

Ops.Devices.Mouse.MouseWheel.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Devices.Mouse.MouseDrag2
// 
// **************************************************************

Ops.Devices.Mouse.MouseDrag2 = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
var active=op.inValueBool("Active",true);
var speed=op.inValue("Speed",0.01);
var outDeltaX=op.outValue("Delta X");
var outDeltaY=op.outValue("Delta Y");


var outDragging=op.outValue("Is Dragging");

var canvas=op.patch.cgl.canvas;

var absoluteX=0;
var absoluteY=0;
var pressed=false;
var lastX=0;
var lastY=0;
var firstMove=true;

function onMouseMove(e)
{
    if(e.touches) e=e.touches[0];

    if(pressed && e)
    {
        if(!firstMove)
        {
            outDragging.set(true);
            var deltaX=(e.clientX-lastX)*speed.get();
            var deltaY=(e.clientY-lastY)*speed.get();

            outDeltaX.set(deltaX);
            outDeltaY.set(deltaY);
        }
        
        firstMove=false;
        
        lastX=e.clientX;
        lastY=e.clientY;
    }
}


function onMouseDown(e)
{
    pressed=true;
}

function onMouseUp(e)
{
    pressed=false;
    outDragging.set(false);
    lastX=0;
    lastY=0;
    firstMove=true;
}


function bind()
{
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseenter', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);

    canvas.addEventListener("touchmove", onMouseMove);
    canvas.addEventListener("touchend", onMouseUp);
    canvas.addEventListener('touchstart', onMouseDown);
}

function unbind()
{
    // console.log("remove mouse op...");

    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mouseenter', onMouseUp);
    canvas.removeEventListener('mouseleave', onMouseUp);
    
    canvas.removeEventListener("touchmove", onMouseMove);
    canvas.removeEventListener("touchend", onMouseUp);
    canvas.removeEventListener('touchstart', onMouseDown);
}

active.onChange=function()
{
    if(active.get())bind();
    else unbind();
};

bind();

op.onDelete=function()
{
    unbind();
};



};

Ops.Devices.Mouse.MouseDrag2.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Math.Sum
// 
// **************************************************************

Ops.Math.Sum = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
var result=op.addOutPort(new CABLES.Port(op,"result"));
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
// Ops.Gl.Meshes.Rectangle
// 
// **************************************************************

Ops.Gl.Meshes.Rectangle = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
var render=op.inTrigger("render");
var trigger=op.outTrigger('trigger');

var width=op.inValue("width",1);
var height=op.inValue("height",1);

var pivotX=op.addInPort(new CABLES.Port(op,"pivot x",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:["center","left","right"]} ));
var pivotY=op.addInPort(new CABLES.Port(op,"pivot y",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:["center","top","bottom"]} ));

var nColumns=op.inValueInt("num columns",1);
var nRows=op.inValueInt("num rows",1);
var axis=op.addInPort(new CABLES.Port(op,"axis",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:["xy","xz"]} ));

var active=op.inValueBool('Active',true);

var geomOut=op.addOutPort(new CABLES.Port(op,"geometry",CABLES.OP_PORT_TYPE_OBJECT));
geomOut.ignoreValueSerialize=true;

var cgl=op.patch.cgl;
axis.set('xy');
pivotX.set('center');
pivotY.set('center');

op.setPortGroup([pivotX,pivotY]);
op.setPortGroup([width,height]);
op.setPortGroup([nColumns,nRows]);

var geom=new CGL.Geometry('rectangle');
var mesh=null;

axis.onChange=rebuild;
pivotX.onChange=rebuild;
pivotY.onChange=rebuild;
width.onChange=rebuild;
height.onChange=rebuild;
nRows.onChange=rebuild;
nColumns.onChange=rebuild;
rebuild();

render.onTriggered=function()
{
    if(active.get() && mesh) mesh.render(cgl.getShader());
    trigger.trigger();
};

function rebuild()
{
    var w=width.get();
    var h=height.get();
    var x=0;
    var y=0;
    
    if(typeof w=='string')w=parseFloat(w);
    if(typeof h=='string')h=parseFloat(h);
    
    if(pivotX.get()=='center') x=0;
    if(pivotX.get()=='right') x=-w/2;
    if(pivotX.get()=='left') x=+w/2;

    if(pivotY.get()=='center') y=0;
    if(pivotY.get()=='top') y=-h/2;
    if(pivotY.get()=='bottom') y=+h/2;

    var verts=[];
    var tc=[];
    var norms=[];
    var indices=[];

    var numRows=Math.round(nRows.get());
    var numColumns=Math.round(nColumns.get());

    var stepColumn=w/numColumns;
    var stepRow=h/numRows;

    var c,r;

    for(r=0;r<=numRows;r++)
    {
        for(c=0;c<=numColumns;c++)
        {
            verts.push( c*stepColumn - width.get()/2+x );
            if(axis.get()=='xz') verts.push( 0.0 );
            verts.push( r*stepRow - height.get()/2+y );
            if(axis.get()=='xy') verts.push( 0.0 );

            tc.push( c/numColumns );
            tc.push( 1.0-r/numRows );

            if(axis.get()=='xz')
            {
                norms.push(0);
                norms.push(1);
                norms.push(0);
            }

            if(axis.get()=='xy')
            {
                norms.push(0);
                norms.push(0);
                norms.push(-1);
            }
        }
    }
    
    for(c=0;c<numColumns;c++)
    {
        for(r=0;r<numRows;r++)
        {
            var ind = c+(numColumns+1)*r;
            var v1=ind;
            var v2=ind+1;
            var v3=ind+numColumns+1;
            var v4=ind+1+numColumns+1;

            indices.push(v1);
            indices.push(v3);
            indices.push(v2);

            indices.push(v2);
            indices.push(v3);
            indices.push(v4);
        }
    }

    geom.clear();
    geom.vertices=verts;
    geom.texCoords=tc;
    geom.verticesIndices=indices;
    geom.vertexNormals=norms;
    geom.calculateNormals();
    
    if(numColumns*numRows>64000)geom.unIndex();

    if(!mesh) mesh=new CGL.Mesh(cgl,geom);
        else mesh.setGeom(geom);

    geomOut.set(null);
    geomOut.set(geom);

}

op.onDelete=function()
{
    if(mesh)mesh.dispose();
}

};

Ops.Gl.Meshes.Rectangle.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.ClearColor
// 
// **************************************************************

Ops.Gl.ClearColor = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const render=op.addInPort(new CABLES.Port(op,"render",CABLES.OP_PORT_TYPE_FUNCTION));
const trigger=op.addOutPort(new CABLES.Port(op,"trigger",CABLES.OP_PORT_TYPE_FUNCTION));
const r=op.addInPort(new CABLES.Port(op,"r",CABLES.OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
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
// Ops.Gl.Shader.BasicMaterial
// 
// **************************************************************

Ops.Gl.Shader.BasicMaterial = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
attachments["shader_frag"]="{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        UNI sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        UNI sampler2D texOpacity;\n   #endif\n#endif\nUNI float r;\nUNI float g;\nUNI float b;\nUNI float a;\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=vec4(r,g,b,a);\n\n    #ifdef HAS_TEXTURES\n        #ifdef HAS_TEXTURE_DIFFUSE\n\n           col=texture(tex,vec2(texCoord.x,(1.0-texCoord.y)));\n\n           #ifdef COLORIZE_TEXTURE\n               col.r*=r;\n               col.g*=g;\n               col.b*=b;\n           #endif\n        #endif\n\n        col.a*=a;\n        #ifdef HAS_TEXTURE_OPACITY\n            #ifdef TRANSFORMALPHATEXCOORDS\n                col.a*=texture(texOpacity,vec2(texCoordOrig.s,1.0-texCoordOrig.t)).g;\n            #endif\n            #ifndef TRANSFORMALPHATEXCOORDS\n                col.a*=texture(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).g;\n            #endif\n       #endif\n\n    #endif\n\n    {{MODULE_COLOR}}\n\n    outColor = col;\n\n\n}\n";
attachments["shader_vert"]="{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nIN vec3 attrVertNormal;\nIN vec2 attrTexCoord;\n\nOUT vec3 norm;\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TEXTURES\n    #ifdef TEXTURE_REPEAT\n        UNI float diffuseRepeatX;\n        UNI float diffuseRepeatY;\n        UNI float texOffsetX;\n        UNI float texOffsetY;\n    #endif\n#endif\n\n\nvoid main()\n{\n    mat4 mMatrix=modelMatrix;\n    mat4 mvMatrix;\n    \n    texCoordOrig=attrTexCoord;\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        #ifdef TEXTURE_REPEAT\n            texCoord.x=texCoord.x*diffuseRepeatX+texOffsetX;\n            texCoord.y=texCoord.y*diffuseRepeatY+texOffsetY;\n        #endif\n    #endif\n\n    vec4 pos = vec4( vPosition, 1. );\n\n\n    #ifdef BILLBOARD\n       vec3 position=vPosition;\n       mvMatrix=viewMatrix*modelMatrix;\n\n       gl_Position = projMatrix * mvMatrix * vec4((\n           position.x * vec3(\n               mvMatrix[0][0],\n               mvMatrix[1][0],\n               mvMatrix[2][0] ) +\n           position.y * vec3(\n               mvMatrix[0][1],\n               mvMatrix[1][1],\n               mvMatrix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifndef BILLBOARD\n        mvMatrix=viewMatrix * mMatrix;\n    #endif\n\n\n    #ifndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n        gl_Position = projMatrix * mvMatrix * pos;\n    #endif\n}\n";
const render=op.addInPort(new CABLES.Port(op,"render",CABLES.OP_PORT_TYPE_FUNCTION) );
const trigger=op.addOutPort(new CABLES.Port(op,"trigger",CABLES.OP_PORT_TYPE_FUNCTION));
const shaderOut=op.addOutPort(new CABLES.Port(op,"shader",CABLES.OP_PORT_TYPE_OBJECT));

shaderOut.ignoreValueSerialize=true;
const cgl=op.patch.cgl;


var shader=new CGL.Shader(cgl,'BasicMaterial');
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);
shader.bindTextures=bindTextures;
shader.setSource(attachments.shader_vert,attachments.shader_frag);
shaderOut.set(shader);

render.onTriggered=doRender;

var textureOpacity=null;
var textureOpacityUniform=null;


function bindTextures()
{
    if(diffuseTexture.get()) cgl.setTexture(0, diffuseTexture.get().tex);
    if(textureOpacity.get()) cgl.setTexture(1, textureOpacity.get().tex);
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
    var r=op.addInPort(new CABLES.Port(op,"r",CABLES.OP_PORT_TYPE_VALUE,{ display:'range',colorPick:'true' }));
    var g=op.addInPort(new CABLES.Port(op,"g",CABLES.OP_PORT_TYPE_VALUE,{ display:'range'}));
    var b=op.addInPort(new CABLES.Port(op,"b",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
    var a=op.addInPort(new CABLES.Port(op,"a",CABLES.OP_PORT_TYPE_VALUE,{ display:'range'}));

    a.uniform=new CGL.Uniform(shader,'f','a',a);
    b.uniform=new CGL.Uniform(shader,'f','b',b);
    r.uniform=new CGL.Uniform(shader,'f','r',r);
    g.uniform=new CGL.Uniform(shader,'f','g',g);


    r.set(Math.random());
    g.set(Math.random());
    b.set(Math.random());
    a.set(1.0);

}

{
    // diffuse outTexture


    var diffuseTexture=op.inTexture("texture");
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
    textureOpacity=op.inTexture("textureOpacity");

    textureOpacity.onChange=function()
    {
        if(textureOpacity.get())
        {
            if(textureOpacityUniform!==null)return;
            shader.removeUniform('texOpacity');
            shader.define('HAS_TEXTURE_OPACITY');
            if(!textureOpacityUniform)textureOpacityUniform=new CGL.Uniform(shader,'t','texOpacity',1);
        }
        else
        {
            shader.removeUniform('texOpacity');
            shader.removeDefine('HAS_TEXTURE_OPACITY');
            textureOpacityUniform=null;
        }
    };

}

op.colorizeTexture=op.addInPort(new CABLES.Port(op,"colorizeTexture",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
op.colorizeTexture.set(false);
op.colorizeTexture.onChange=function()
{
    if(op.colorizeTexture.get()) shader.define('COLORIZE_TEXTURE');
        else shader.removeDefine('COLORIZE_TEXTURE');
};


op.doBillboard=op.addInPort(new CABLES.Port(op,"billboard",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
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

var preMultipliedAlpha=op.addInPort(new CABLES.Port(op,"preMultiplied alpha",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));

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

    var diffuseRepeatX=op.addInPort(new CABLES.Port(op,"diffuseRepeatX",CABLES.OP_PORT_TYPE_VALUE));
    var diffuseRepeatY=op.addInPort(new CABLES.Port(op,"diffuseRepeatY",CABLES.OP_PORT_TYPE_VALUE));
    var diffuseOffsetX=op.addInPort(new CABLES.Port(op,"Tex Offset X",CABLES.OP_PORT_TYPE_VALUE));
    var diffuseOffsetY=op.addInPort(new CABLES.Port(op,"Tex Offset Y",CABLES.OP_PORT_TYPE_VALUE));

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
// Ops.Gl.Meshes.Circle
// 
// **************************************************************

Ops.Gl.Meshes.Circle = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const render=op.inTrigger("render");
const segments=op.inValueInt('segments',40);
const radius=op.inValue('radius',0.5);
const innerRadius=op.inValueSlider('innerRadius',0);
const percent=op.inValueSlider('percent',1);
const steps=op.inValue('steps',0);
const invertSteps=op.inValueBool('invertSteps',false);
const inDraw=op.inValueBool('Draw',true);
const mapping=op.addInPort(new CABLES.Port(op,"mapping",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['flat','round']}));
const drawSpline=op.inValueBool("Spline",false);

const trigger=op.outTrigger('trigger');
const geomOut=op.addOutPort(new CABLES.Port(op,"geometry",CABLES.OP_PORT_TYPE_OBJECT));

mapping.set('flat');

mapping.onChange=
    segments.onChange=
    radius.onChange=
    innerRadius.onChange=
    percent.onChange=
    steps.onChange=
    invertSteps.onChange=
    drawSpline.onChange=calcLater;

geomOut.ignoreValueSerialize=true;
const cgl=op.patch.cgl;

var geom=new CGL.Geometry("circle");
var mesh=null;
var lastSegs=-1;

var oldPrim=0;
var shader=null;
var needsCalc=true;

op.preRender=
render.onTriggered=function()
{
    if(needsCalc)calc();
    shader=cgl.getShader();
    if(!shader)return;
    oldPrim=shader.glPrimitive;

    if(drawSpline.get()) shader.glPrimitive=cgl.gl.LINE_STRIP;

    if(inDraw.get())mesh.render(shader);
    trigger.trigger();

    shader.glPrimitive=oldPrim;
};

function calc()
{
    var segs=Math.max(3,Math.floor(segments.get()));

    geom.clear();

    var faces=[];
    var texCoords=[];
    var vertexNormals=[];

    var i=0,degInRad=0;
    var oldPosX=0,oldPosY=0;
    var oldPosXTexCoord=0,oldPosYTexCoord=0;

    var oldPosXIn=0,oldPosYIn=0;
    var oldPosXTexCoordIn=0,oldPosYTexCoordIn=0;

    var posxTexCoordIn=0,posyTexCoordIn=0;
    var posxTexCoord=0,posyTexCoord=0;
    var posx=0,posy=0;

    var verts=[];

    if(drawSpline.get())
    {
        var lastX=0;
        var lastY=0;
        var tc=[];
        for (i=0; i <= segs*percent.get(); i++)
        {
            degInRad = (360/segs)*i*CGL.DEG2RAD;
            posx=Math.cos(degInRad)*radius.get();
            posy=Math.sin(degInRad)*radius.get();

            posyTexCoord=0.5;

            if(i>0)
            {
                verts.push(lastX);
                verts.push(lastY);
                verts.push(0);
                posxTexCoord=1.0-(i-1)/segs;

                tc.push(posxTexCoord,posyTexCoord);
            }
            verts.push(posx);
            verts.push(posy);
            verts.push(0);

            lastX=posx;
            lastY=posy;
        }
        geom.setPointVertices(verts);
    }
    else
    if(innerRadius.get()<=0)
    {

        for (i=0; i <= segs*percent.get(); i++)
        {
            degInRad = (360/segs)*i*CGL.DEG2RAD;
            posx=Math.cos(degInRad)*radius.get();
            posy=Math.sin(degInRad)*radius.get();

            if(mapping.get()=='flat')
            {
                posxTexCoord=(Math.cos(degInRad)+1.0)/2;
                posyTexCoord=1.0-(Math.sin(degInRad)+1.0)/2;
                posxTexCoordIn=0.5;
                posyTexCoordIn=0.5;
            }
            else if(mapping.get()=='round')
            {
                posxTexCoord=1.0-i/segs;
                posyTexCoord=0;
                posxTexCoordIn=posxTexCoord;
                posyTexCoordIn=1;
            }

            faces.push(
                      [posx,posy,0],
                      [oldPosX,oldPosY,0],
                      [0,0,0]
                      );

            texCoords.push(posxTexCoord,posyTexCoord,oldPosXTexCoord,oldPosYTexCoord,posxTexCoordIn,posyTexCoordIn);
            vertexNormals.push(0,0,1,0,0,1,0,0,1);

            oldPosXTexCoord=posxTexCoord;
            oldPosYTexCoord=posyTexCoord;

            oldPosX=posx;
            oldPosY=posy;
        }

        geom=CGL.Geometry.buildFromFaces(faces);
        geom.vertexNormals=vertexNormals;
        geom.texCoords=texCoords;
    }
    else
    {
        var count=0;
        var numSteps=segs*percent.get();
        var pos=0;

        for (i=0; i <= numSteps; i++)
        {
            count++;

            degInRad = (360/segs)*i*CGL.DEG2RAD;
            posx=Math.cos(degInRad)*radius.get();
            posy=Math.sin(degInRad)*radius.get();

            var posxIn=Math.cos(degInRad)*innerRadius.get()*radius.get();
            var posyIn=Math.sin(degInRad)*innerRadius.get()*radius.get();

            if(mapping.get()=='round')
            {
                posxTexCoord=1.0-i/segs;
                posyTexCoord=0;
                posxTexCoordIn=posxTexCoord;
                posyTexCoordIn=1;
            }

            if(steps.get()===0.0 ||
                (count%parseInt(steps.get(),10)===0 && !invertSteps.get()) ||
                (count%parseInt(steps.get(),10)!==0 && invertSteps.get()) )
            {
                faces.push(
                        [posx,posy,0],
                        [oldPosX,oldPosY,0],
                        [posxIn,posyIn,0]
                        );

                faces.push(
                        [posxIn,posyIn,0],
                        [oldPosX,oldPosY,0],
                        [oldPosXIn,oldPosYIn,0]
                        );

                texCoords.push(
                    posxTexCoord,0,
                    oldPosXTexCoord,0,
                    posxTexCoordIn,1,

                    posxTexCoord,1,
                    oldPosXTexCoord,0,
                    oldPosXTexCoordIn,1);

                vertexNormals.push(0,0,1,0,0,1,0,0,1);
                vertexNormals.push(0,0,1,0,0,1,0,0,1);
            }

            oldPosXTexCoordIn=posxTexCoordIn;
            oldPosYTexCoordIn=posyTexCoordIn;

            oldPosXTexCoord=posxTexCoord;
            oldPosYTexCoord=posyTexCoord;

            oldPosX=posx;
            oldPosY=posy;

            oldPosXIn=posxIn;
            oldPosYIn=posyIn;
        }

        geom=CGL.Geometry.buildFromFaces(faces);
        geom.vertexNormals=vertexNormals;

        if(mapping.get()=='flat') geom.mapTexCoords2d();
            else geom.texCoords=texCoords;
    }

    geomOut.set(null);
    geomOut.set(geom);

    if(geom.vertices.length==0)return;
    if(mesh) mesh.dispose();
    mesh=null;
    mesh=new CGL.Mesh(cgl,geom);
    needsCalc=false;
}

function calcLater()
{
    needsCalc=true;
}

op.onDelete=function()
{
    if(mesh)mesh.dispose();
}

};

Ops.Gl.Meshes.Circle.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Html.DivElement
// 
// **************************************************************

Ops.Html.DivElement = function()
{
CABLES.Op.apply(this,arguments);
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

//----------------



// **************************************************************
// 
// Ops.Html.TransformCSS3DElement
// 
// **************************************************************

Ops.Html.TransformCSS3DElement = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const
	cgl = op.patch.cgl,
	origins = [
	    'top-left','top-middle','top-right',
	    'center-left','center-middle','center-right',
	    'bottom-left','bottom-middle','bottom-right'
    ],
	trigger = op.inTrigger('trigger'),
	inElement = op.inObject('DOMElement'),
	inOrigin = op.inValueSelect("origin",origins,'center-middle'),
	next = op.outTrigger('next'),
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
	if(el && el.parentElement) el.parentElement.removeChild(el);
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
    if (!el || !el.parentElement) return;
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
		if(el.parentElement)
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
    if(el && el.parentElement)el.parentElement.style.transform='';
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
// Ops.Json3d.Json3dMesh
// 
// **************************************************************

Ops.Json3d.Json3dMesh = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const cgl=op.patch.cgl;

var scene=new CABLES.Variable();

cgl.frameStore.currentScene=null;

var exe=op.inTrigger("Render");
var filename=op.addInPort(new CABLES.Port(op,"file",CABLES.OP_PORT_TYPE_VALUE,{ display:'file',type:'string',filter:'3d json' } ));
var meshIndex=op.inValueInt("Mesh Index",0);


var draw=op.inValueBool("Draw",true);
var centerPivot=op.inValueBool("Center Mesh",true);


var inSize=op.inValue("Size",1);

var next=op.outTrigger("trigger");
var geometryOut=op.outObject("Geometry");

var merge=op.inValueBool("Merge",false);

var inNormals=op.inValueSelect("Calculate Normals",["no","smooth","flat"],"no");
var outScale=op.outValue("Scaling",1.0);

var geom=null;
var data=null;
var mesh=null;
var meshes=[];
var currentIndex=-1;
var transMatrix=mat4.create();
var bounds={};
var vScale=vec3.fromValues(1,1,1);

exe.onTriggered=render;
filename.onChange=reload;
centerPivot.onChange=setMeshLater;
meshIndex.onChange=setMeshLater;
inNormals.onChange=setMeshLater;
merge.onChange=setMeshLater;

inSize.onChange=updateScale;
var needSetMesh=true;


function calcNormals()
{
    if(!geom)
    {
        console.log('calc normals: no geom!');
        return;
    }

    if(inNormals.get()=='no')return;
    if(inNormals.get()=='smooth')geom.calculateNormals();
    if(inNormals.get()=='flat')
    {
        geom.unIndex();
        geom.calculateNormals();
    }
}

function render()
{
    if(needSetMesh) setMesh();

    if(draw.get())
    {
        cgl.pushModelMatrix();
        mat4.multiply(cgl.mvMatrix,cgl.mvMatrix,transMatrix);

        if(mesh) mesh.render(cgl.getShader());

        cgl.popModelMatrix();
        next.trigger();
    }
}

function setMeshLater()
{
    needSetMesh=true;
}


function updateScale()
{
    if(inSize.get()!==0)
    {
        var scale=inSize.get()/bounds.maxAxis;
        vec3.set(vScale,scale,scale,scale);
        outScale.set(scale);
    }
    else
    {
        vec3.set(vScale,1,1,1);
    }

    mat4.identity(transMatrix);
    mat4.scale(transMatrix,transMatrix, vScale);
}

function updateInfo(geom)
{
    if(!CABLES.UI)return;

    var nfo='<div class="panel">';

    if(data)
    {
        nfo += 'Mesh '+(currentIndex+1)+' of '+data.meshes.length+'<br/>';
        nfo += '<br/>';
    }

    if(geom)
    {
        nfo += (geom.verticesIndices||[]).length/3+' faces <br/>';
        nfo += (geom.vertices||[]).length/3+' vertices <br/>';
        nfo += (geom.texCoords||[]).length/2+' texturecoords <br/>';
        nfo += (geom.vertexNormals||[]).length/3+' normals <br/>';
        nfo += (geom.tangents||[]).length/3+' tangents <br/>';
        nfo += (geom.biTangents||[]).length/3+' bitangents <br/>';
    }

    nfo+="</div>";

    op.uiAttr({info:nfo});
}


function setMesh()
{
    if(mesh)
    {
        mesh.dispose();
        mesh=null;
    }
    var index=Math.floor(meshIndex.get());

    if(!data || index!=index || !CABLES.UTILS.isNumeric(index) || index<0 || index>=data.meshes.length)
    {
        op.uiAttr({warning:'mesh not found - index out of range '});
        return;
    }

    currentIndex=index;

    geom=new CGL.Geometry();

    if(merge.get())
    {
        for(var i=0;i<data.meshes.length;i++)
        {
            var jsonGeom=data.meshes[i];
            if(jsonGeom)
            {
                var geomNew=CGL.Geometry.json2geom(jsonGeom);
                geom.merge(geomNew);
            }
        }

        var bnd=geom.getBounds();

        for(var i=0;i<geom.vertices.length;i++)
        {
            geom.vertices[i]/=bnd.maxAxis;
        }


    }
    else
    {
        var jsonGeom=data.meshes[index];

        if(!jsonGeom)
        {
            mesh=null;
            op.uiAttr({warning:'mesh not found'});
            return;
        }

        var i=0;
        geom=CGL.Geometry.json2geom(jsonGeom);


    }

    if(centerPivot.get())geom.center();

    bounds=geom.getBounds();
    updateScale();
    updateInfo(geom);

    calcNormals();
    geometryOut.set(geom);

    if(mesh)mesh.dispose();

    mesh=new CGL.Mesh(cgl,geom);
    needSetMesh=false;
    meshes[index]=mesh;

    // console.log("set mesh done");
    // console.log(geom);

    op.uiAttr({'warning':null});
}

function reload()
{
    if(!filename.get())return;
    currentIndex=-1;

    function doLoad()
    {
        CABLES.ajax(
            op.patch.getFilePath(filename.get()),
            function(err,_data,xhr)
            {
                if(err)
                {
                    if(CABLES.UI)op.uiAttr({'error':'could not load file...'});

                    console.error('ajax error:',err);
                    op.patch.loading.finished(loadingId);
                    return;
                }
                else
                {
                    if(CABLES.UI)op.uiAttr({'error':null});
                }

                try
                {
                    data=JSON.parse(_data);
                }
                catch(ex)
                {
                    if(CABLES.UI)op.uiAttr({'error':'could not load file...'});
                    op.patch.loading.finished(loadingId);
                    return;
                }

                needSetMesh=true;
                op.patch.loading.finished(loadingId);
                if(CABLES.UI) gui.jobs().finish('loading3d'+loadingId);

            });
        // setMesh();
    }

    var loadingId=op.patch.loading.start('json3dMesh',filename.get());

    if(CABLES.UI) gui.jobs().start({id:'loading3d'+loadingId,title:'loading 3d data'},doLoad);
        else doLoad();
}

};

Ops.Json3d.Json3dMesh.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Devices.Mouse.Mouse
// 
// **************************************************************

Ops.Devices.Mouse.Mouse = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};

var outMouseX=op.addOutPort(new CABLES.Port(op,"x",CABLES.OP_PORT_TYPE_VALUE));
var outMouseY=op.addOutPort(new CABLES.Port(op,"y",CABLES.OP_PORT_TYPE_VALUE));
var mouseDown=op.addOutPort(new CABLES.Port(op,"button down",CABLES.OP_PORT_TYPE_VALUE));
var mouseClick=op.addOutPort(new CABLES.Port(op,"click",CABLES.OP_PORT_TYPE_FUNCTION));
var mouseUp=op.addOutPort(new CABLES.Port(op,"Button Up",CABLES.OP_PORT_TYPE_FUNCTION));
var mouseClickRight=op.addOutPort(new CABLES.Port(op,"click right",CABLES.OP_PORT_TYPE_FUNCTION));
var mouseOver=op.addOutPort(new CABLES.Port(op,"mouseOver",CABLES.OP_PORT_TYPE_VALUE));
var relative=op.addInPort(new CABLES.Port(op,"relative",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var normalize=op.addInPort(new CABLES.Port(op,"normalize",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var active=op.inValueBool("Active",true);
var smooth=op.addInPort(new CABLES.Port(op,"smooth",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var smoothSpeed=op.addInPort(new CABLES.Port(op,"smoothSpeed",CABLES.OP_PORT_TYPE_VALUE));
var area=op.addInPort(new CABLES.Port(op,"Area",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['Canvas','Document','Parent Element']}));
var outButton=op.addOutPort(new CABLES.Port(op,"button",CABLES.OP_PORT_TYPE_VALUE));
var multiply=op.addInPort(new CABLES.Port(op,"multiply",CABLES.OP_PORT_TYPE_VALUE));
var flipY=op.inValueBool("flip y",true);

area.set("Canvas");

multiply.set(1.0);
var smoothTimer=0;
smoothSpeed.set(20);

var cgl=op.patch.cgl;
var listenerElement=null;

function setValue(x,y)
{
    if(normalize.get())
    {
        var w=cgl.canvas.width;
        var h=cgl.canvas.height;
        if(listenerElement==document.body)
        {
            w=listenerElement.clientWidth;
            h=listenerElement.clientHeight;
        }
        outMouseX.set( (x/w*2.0-1.0)*multiply.get() );
        outMouseY.set( (y/h*2.0-1.0)*multiply.get() );
    }
    else
    {
        outMouseX.set( x*multiply.get() );
        outMouseY.set( y*multiply.get() );
    }
}

smooth.onChange=function()
{
    if(smooth.get()) smoothTimer = setInterval(updateSmooth, 5);
        else if(smoothTimer)clearTimeout(smoothTimer);
};

var smoothX,smoothY;
var lineX=0,lineY=0;

var mouseX=cgl.canvas.width/2;
var mouseY=cgl.canvas.height/2;
lineX=mouseX;
lineY=mouseY;

outMouseX.set(mouseX);
outMouseY.set(mouseY);

var relLastX=0;
var relLastY=0;
var offsetX=0;
var offsetY=0;
addListeners();

area.onChange=addListeners;

var speed=0;

function updateSmooth()
{
    speed=smoothSpeed.get();
    if(speed<=0)speed=0.01;
    var distanceX = Math.abs(mouseX - lineX);
    var speedX = Math.round( distanceX / speed, 0 );
    lineX = (lineX < mouseX) ? lineX + speedX : lineX - speedX;

    var distanceY = Math.abs(mouseY - lineY);
    var speedY = Math.round( distanceY / speed, 0 );
    lineY = (lineY < mouseY) ? lineY + speedY : lineY - speedY;

    setValue(lineX,lineY);
}

var onMouseEnter = function(e)
{
    mouseDown.set(false);
    mouseOver.set(true);
    speed=smoothSpeed.get();
};

var onMouseDown = function(e)
{
    outButton.set(e.which);
    mouseDown.set(true);
};

var onMouseUp = function(e)
{
    outButton.set(0);
    mouseDown.set(false);
    mouseUp.trigger();
};

var onClickRight= function(e)
{
    mouseClickRight.trigger();
    e.preventDefault();
};

function onmouseclick(e)
{
    mouseClick.trigger();
}


function onMouseLeave(e)
{
    relLastX=0;
    relLastY=0;

    speed=100;
    
    if(area.get()!='Document')
    {
        // leave anim
        if(smooth.get())
        {
            mouseX=cgl.canvas.width/2;
            mouseY=cgl.canvas.height/2;
        }
        
    }
    mouseOver.set(false);
    mouseDown.set(false);
}

relative.onChange=function()
{
    offsetX=0;
    offsetY=0;
}

function onmousemove(e)
{
    mouseOver.set(true);
    
    if(!relative.get())
    {
        if(area.get()!="Document")
        {
            offsetX=e.offsetX;
            offsetY=e.offsetY;
        }
        else
        {
            offsetX=e.clientX;
            offsetY=e.clientY;
        }

        if(smooth.get())
        {
            mouseX=offsetX;
            
            if(flipY.get()) mouseY=listenerElement.clientHeight-offsetY;
                else mouseY=offsetY;
        }
        else
        {
            if(flipY.get()) setValue(offsetX,listenerElement.clientHeight-offsetY);
                else setValue(offsetX,offsetY);
        }
    }
    else
    {
        if(relLastX!=0 && relLastY!=0)
        {
            offsetX=e.offsetX-relLastX;
            offsetY=e.offsetY-relLastY;
        }
        else
        {

        }

        relLastX=e.offsetX;
        relLastY=e.offsetY;

        mouseX+=offsetX;
        mouseY+=offsetY;
        
        if(mouseY>460)mouseY=460;
    }
};

function ontouchstart(event)
{
    mouseDown.set(true);

    if(event.touches && event.touches.length>0) onMouseDown(event.touches[0]);
};

function ontouchend(event)
{
    mouseDown.set(false);
    onMouseUp();
};

function removeLiseteners()
{
    listenerElement.removeEventListener('touchend', ontouchend);
    listenerElement.removeEventListener('touchstart', ontouchstart);

    listenerElement.removeEventListener('click', onmouseclick);
    listenerElement.removeEventListener('mousemove', onmousemove);
    listenerElement.removeEventListener('mouseleave', onMouseLeave);
    listenerElement.removeEventListener('mousedown', onMouseDown);
    listenerElement.removeEventListener('mouseup', onMouseUp);
    listenerElement.removeEventListener('mouseenter', onMouseEnter);
    listenerElement.removeEventListener('contextmenu', onClickRight);
    listenerElement=null;
}

function addListeners()
{
    if(listenerElement)removeLiseteners();

    listenerElement=cgl.canvas;
    if(area.get()=='Document') listenerElement=document.body;
    if(area.get()=='Parent Element') listenerElement=cgl.canvas.parentElement;

    listenerElement.addEventListener('touchend', ontouchend);
    listenerElement.addEventListener('touchstart', ontouchstart);

    listenerElement.addEventListener('click', onmouseclick);
    listenerElement.addEventListener('mousemove', onmousemove);
    listenerElement.addEventListener('mouseleave', onMouseLeave);
    listenerElement.addEventListener('mousedown', onMouseDown);
    listenerElement.addEventListener('mouseup', onMouseUp);
    listenerElement.addEventListener('mouseenter', onMouseEnter);
    listenerElement.addEventListener('contextmenu', onClickRight);
}

active.onChange=function()
{
    if(listenerElement)removeLiseteners();
    if(active.get())addListeners();
}

op.onDelete=function()
{
    removeLiseteners();
};

addListeners();


};

Ops.Devices.Mouse.Mouse.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Matrix.ScreenPosTo3dNew
// 
// **************************************************************

Ops.Gl.Matrix.ScreenPosTo3dNew = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
const exec=op.inTrigger("Exec");
const inX=op.inValue("X");
const inY=op.inValue("Y");
const outX=op.outValue("Result X");
const outY=op.outValue("Result Y");

const mat=mat4.create();
const cgl=op.patch.cgl;

exec.onTriggered=calc;

function calc()
{
    var x = 2.0 * inX.get() / cgl.canvas.clientWidth - 1;
    var y = - 2.0 * inY.get() / cgl.canvas.clientHeight + 1;
    
    var point3d=vec3.fromValues(x,y,0);
    
    mat4.mul(mat,cgl.pMatrix,cgl.vMatrix);

    mat4.invert(mat,mat);
    
    vec3.transformMat4(point3d, point3d, mat);
    
    outX.set(point3d[0]*10);
    outY.set(point3d[1]*10);
}


};

Ops.Gl.Matrix.ScreenPosTo3dNew.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Shader.WireframeMaterial
// 
// **************************************************************

Ops.Gl.Shader.WireframeMaterial = function()
{
CABLES.Op.apply(this,arguments);
var op=this;
var attachments={};
attachments["wireframe_frag"]="IN vec3 barycentric;\nUNI float width;\nUNI float opacity;\nUNI float r,g,b;\nUNI float fr,fg,fb;\nIN vec3 norm;\n\nfloat edgeFactor()\n{\n    vec3 d = fwidth(barycentric);\n    vec3 a3 = smoothstep(vec3(0.0), d*width*4.0, barycentric);\n    return min(min(a3.x, a3.y), a3.z);\n}\n\nvoid main()\n{\n    vec4 col;\n\n    #ifdef WIREFRAME_FILL\n        float v=opacity*(1.0-edgeFactor())*0.95;\n        vec3 wire = vec3(fr, fg, fb);\n        col.rgb = vec3(r, g, b);\n        col.rgb = mix(wire,col.rgb,v);\n        col.a = opacity;\n    #endif\n\n    #ifndef WIREFRAME_FILL\n       col = vec4(r,g,b, opacity*(1.0-edgeFactor())*0.95);\n    #endif\n    \n    // col=vec4(barycentric,1.0);\n    \n    outColor=col;\n\n}";
attachments["wireframe_vert"]="{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nIN vec3 attrBarycentric;\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\nOUT vec3 barycentric;\nIN vec2 attrTexCoord;\nOUT vec2 texCoord;\n\nIN vec3 attrVertNormal;\nOUT vec3 norm;\n\nvoid main()\n{\n    norm=attrVertNormal;\n    texCoord=attrTexCoord;\n    barycentric=attrBarycentric;\n    vec4 pos = vec4( vPosition, 1. );\n    {{MODULE_VERTEX_POSITION}}\n    gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n}\n";
var cgl=op.patch.cgl;

var render=op.addInPort(new CABLES.Port(op,"render",CABLES.OP_PORT_TYPE_FUNCTION) );
var trigger=op.outTrigger('trigger');

var enableDepth=op.addInPort(new CABLES.Port(op,"enable depth testing",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
enableDepth.set(true);

var fill=op.addInPort(new CABLES.Port(op,"fill",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
fill.set(true);

function setDefines()
{
    if(shader)
        if(fill.get()) shader.define('WIREFRAME_FILL');
            else shader.removeDefine('WIREFRAME_FILL');
}
fill.onChange=function()
{
    setDefines();
};

var w=op.addInPort(new CABLES.Port(op,"width",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
w.set(0.25);
w.onChange=function(){ uniformWidth.setValue(w.get()); };

var opacity=op.addInPort(new CABLES.Port(op,"opacity",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
opacity.set(1.0);
opacity.onChange=function(){ uniformOpacity.setValue(opacity.get()); };

if(cgl.glVersion==1 && !cgl.gl.getExtension('OES_standard_derivatives') )
{
    op.uiAttr( { 'error': 'no oes standart derivatives!' } );
}
else
{
    op.uiAttr( { 'error': null } );
}




var doRender=function()
{
    // if(true!==enableDepth.get()) cgl.gl.disable(cgl.gl.DEPTH_TEST);
        // else cgl.gl.enable(cgl.gl.DEPTH_TEST);
    cgl.pushDepthTest(enableDepth.get());

    cgl.setShader(shader);
    trigger.trigger();
    cgl.setPreviousShader();

    // if(true!==enableDepth.get()) cgl.gl.enable(cgl.gl.DEPTH_TEST);
    cgl.popDepthTest();

};

var shader=new CGL.Shader(cgl,'Wireframe Material');

if(cgl.glVersion>1)shader.glslVersion=300;
var uniformWidth=new CGL.Uniform(shader,'f','width',w.get());
var uniformOpacity=new CGL.Uniform(shader,'f','opacity',opacity.get());

if(cgl.glVersion==1)shader.enableExtension('OES_standard_derivatives');

shader.setSource(attachments.wireframe_vert||'',attachments.wireframe_frag||'');
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);
shader.wireframe=true;
setDefines();

{
    // diffuse color

    var r=op.addInPort(new CABLES.Port(op,"diffuse r",CABLES.OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
    r.onChange=function()
    {
        if(!r.uniform) r.uniform=new CGL.Uniform(shader,'f','r',r.get());
        else r.uniform.setValue(r.get());
    };

    var g=op.addInPort(new CABLES.Port(op,"diffuse g",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
    g.onChange=function()
    {
        if(!g.uniform) g.uniform=new CGL.Uniform(shader,'f','g',g.get());
        else g.uniform.setValue(g.get());
    };

    var b=op.addInPort(new CABLES.Port(op,"diffuse b",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
    b.onChange=function()
    {
        if(!b.uniform) b.uniform=new CGL.Uniform(shader,'f','b',b.get());
        else b.uniform.setValue(b.get());
    };

    r.set(Math.random());
    g.set(Math.random());
    b.set(Math.random());
}

{
    // diffuse color

    var fr=op.addInPort(new CABLES.Port(op,"Fill R",CABLES.OP_PORT_TYPE_VALUE,{ display:'range', colorPick:'true' }));
    fr.uniform=new CGL.Uniform(shader,'f','fr',fr);

    var fg=op.addInPort(new CABLES.Port(op,"Fill G",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
    fg.uniform=new CGL.Uniform(shader,'f','fg',fg);

    var fb=op.addInPort(new CABLES.Port(op,"Fill B",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
    fb.uniform=new CGL.Uniform(shader,'f','fb',fb);

    fr.set(0);
    fg.set(0);
    fb.set(0);
}




render.onTriggered=doRender;

doRender();


};

Ops.Gl.Shader.WireframeMaterial.prototype = new CABLES.Op();

//----------------

