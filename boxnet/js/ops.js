"use strict";

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Math=Ops.Math || {};
Ops.Devices=Ops.Devices || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Devices.Mouse=Ops.Devices.Mouse || {};

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
// Ops.Gl.Meshes.Rectangle
// 
// **************************************************************

Ops.Gl.Meshes.Rectangle = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var render=op.inFunction("render");
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var width=op.inValue("width",1);
var height=op.inValue("height",1);

var pivotX=op.addInPort(new Port(op,"pivot x",OP_PORT_TYPE_VALUE,{display:'dropdown',values:["center","left","right"]} ));
var pivotY=op.addInPort(new Port(op,"pivot y",OP_PORT_TYPE_VALUE,{display:'dropdown',values:["center","top","bottom"]} ));

var nColumns=op.inValueInt("num columns",1);
var nRows=op.inValueInt("num rows",1);
var axis=op.addInPort(new Port(op,"axis",OP_PORT_TYPE_VALUE,{display:'dropdown',values:["xy","xz"]} ));

var active=op.inValueBool('Active',true);

var geomOut=op.addOutPort(new Port(op,"geometry",OP_PORT_TYPE_OBJECT));
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

    if(!mesh) mesh=new CGL.Mesh(cgl,geom);
        else mesh.setGeom(geom);

    geomOut.set(null);
    geomOut.set(geom);

}


};

Ops.Gl.Meshes.Rectangle.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Sequence
// 
// **************************************************************

Ops.Sequence = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const exe=op.addInPort(new Port(op,"exe",OP_PORT_TYPE_FUNCTION));
const exes=[];
const triggers=[];
const num=16;
exe.onTriggered=triggerAll;

function triggerAll()
{
    for(var i=0;i<triggers.length;i++) triggers[i].trigger();
}

for(var i=0;i<num;i++)
{
    triggers.push( op.addOutPort(new Port(op,"trigger "+i,OP_PORT_TYPE_FUNCTION)) );
    
    if(i<num-1)
    {
        var newExe=op.addInPort(new Port(op,"exe "+i,OP_PORT_TYPE_FUNCTION));
        newExe.onTriggered=triggerAll;
        exes.push( newExe );
    }
}


};

Ops.Sequence.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Matrix.Translate
// 
// **************************************************************

Ops.Gl.Matrix.Translate = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var cgl=op.patch.cgl;

var x=op.addInPort(new Port(op,"x"));
var y=op.addInPort(new Port(op,"y"));
var z=op.addInPort(new Port(op,"z"));

x.set(0.0);
y.set(0.0);
z.set(0.0);

var vec=vec3.create();

render.onTriggered=function()
{
    vec3.set(vec, x.get(),y.get(),z.get());
    cgl.pushModelMatrix();
    mat4.translate(cgl.mvMatrix,cgl.mvMatrix, vec);
    trigger.trigger();
    cgl.popModelMatrix();
};


};

Ops.Gl.Matrix.Translate.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Devices.Mouse.MouseWheel
// 
// **************************************************************

Ops.Devices.Mouse.MouseWheel = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

op.name='mousewheel';

var valIn=op.inValue("Value",0);

var mul=op.inValue("Multiply",1);

var minUnlimitedPort = op.inValueBool('Min Unlimited', false);
minUnlimitedPort.setUiAttribs({ hidePort: true });
var min=op.inValue("min",-100);
var maxUnlimitedPort = op.inValueBool('Max Unlimited', false);
maxUnlimitedPort.setUiAttribs({ hidePort: true });
var max=op.inValue("max", 100);

var smooth=op.inValueBool("smooth");
var smoothSpeed=op.inValue("delay",0.3);
var preventScroll=op.inValueBool("prevent scroll");
var flip=op.inValueBool("Flip Direction");

var active=op.inValueBool("active",true);

var reset=op.inFunctionButton("Reset");

var absVal=op.outValue("absolute value",0);
var delta=op.outValue("delta",0);

var cgl=op.patch.cgl;


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
// Ops.Math.Divide
// 
// **************************************************************

Ops.Math.Divide = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const number1 = op.addInPort(new Port(op, "number1"));
const number2 = op.addInPort(new Port(op, "number2"));
const result = op.addOutPort(new Port(op, "result"));

const exec = function() {
    result.set( number1.get() / number2.get() );
};

number1.set(1);
number2.set(1);

number1.onValueChanged = exec;
number2.onValueChanged = exec;
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
// Ops.Devices.Mouse.MouseDrag2
// 
// **************************************************************

Ops.Devices.Mouse.MouseDrag2 = function()
{
Op.apply(this, arguments);
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
// Ops.Math.DeltaSum
// 
// **************************************************************

Ops.Math.DeltaSum = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var inVal=op.inValue("Delta Value");
var defVal=op.inValue("Default Value",0);

var inReset=op.inFunctionButton("Reset");

var inLimit=op.inValueBool("Limit",false);
var inMin=op.inValue("Min",0);
var inMax=op.inValue("Max",100);
var inMul=op.inValue("Multiply",1);

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
// Ops.Gl.Shader.BasicMaterialNew
// 
// **************************************************************

Ops.Gl.Shader.BasicMaterialNew = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["basicmaterial_frag"]="{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        uniform sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        uniform sampler2D texOpacity;\n   #endif\n#endif\nuniform float r;\nuniform float g;\nuniform float b;\nuniform float a;\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=vec4(r,g,b,a);\n\n    #ifdef HAS_TEXTURES\n        #ifdef HAS_TEXTURE_DIFFUSE\n            col=texture2D(tex,vec2(texCoord.x,(1.0-texCoord.y)));\n\n//         col=texture2D(tex,vec2(texCoords.x*1.0,(1.0-texCoords.y)*1.0));\n            #ifdef COLORIZE_TEXTURE\n                col.r*=r;\n                col.g*=g;\n                col.b*=b;\n            #endif\n        #endif\n        col.a*=a;\n        #ifdef HAS_TEXTURE_OPACITY\n            #ifdef TRANSFORMALPHATEXCOORDS\n                col.a*=texture2D(texOpacity,vec2(texCoordOrig.s,1.0-texCoordOrig.t)).g;\n            #endif\n            #ifndef TRANSFORMALPHATEXCOORDS\n                \n                #ifdef ALPHA_MASK_ALPHA\n                    col.a*=texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).a;\n                #endif\n                #ifdef ALPHA_MASK_LUMI\n                    col.a*=dot(vec3(0.2126,0.7152,0.0722), texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).rgb);\n                #endif\n                #ifdef ALPHA_MASK_R\n                    col.a*=texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).r;\n                #endif\n                #ifdef ALPHA_MASK_G\n                    col.a*=texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).g;\n                #endif\n                #ifdef ALPHA_MASK_B\n                    col.a*=texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).b;\n                #endif\n    \n                \n                \n                \n            #endif\n        #endif\n    #endif\n\n    {{MODULE_COLOR}}\n\n    outColor = col;\n}\n";
attachments["basicmaterial_vert"]="{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nIN vec3 attrVertNormal;\nIN vec2 attrTexCoord;\n\nOUT vec3 norm;\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TEXTURES\n    #ifdef TEXTURE_REPEAT\n        UNI float diffuseRepeatX;\n        UNI float diffuseRepeatY;\n        UNI float texOffsetX;\n        UNI float texOffsetY;\n    #endif\n#endif\n\n\nvoid main()\n{\n    mat4 mMatrix=modelMatrix;\n    mat4 mvMatrix;\n    \n    texCoordOrig=attrTexCoord;\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        #ifdef TEXTURE_REPEAT\n            texCoord.x=texCoord.x*diffuseRepeatX+texOffsetX;\n            texCoord.y=texCoord.y*diffuseRepeatY+texOffsetY;\n        #endif\n    #endif\n\n    vec4 pos = vec4( vPosition, 1. );\n\n\n    #ifdef BILLBOARD\n       vec3 position=vPosition;\n       mvMatrix=viewMatrix*modelMatrix;\n\n       gl_Position = projMatrix * mvMatrix * vec4((\n           position.x * vec3(\n               mvMatrix[0][0],\n               mvMatrix[1][0],\n               mvMatrix[2][0] ) +\n           position.y * vec3(\n               mvMatrix[0][1],\n               mvMatrix[1][1],\n               mvMatrix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifndef BILLBOARD\n        mvMatrix=viewMatrix * mMatrix;\n    #endif\n\n\n    #ifndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n        gl_Position = projMatrix * mvMatrix * pos;\n    #endif\n}\n";


var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION) );
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
var shaderOut=op.addOutPort(new Port(op,"shader",OP_PORT_TYPE_OBJECT));
shaderOut.ignoreValueSerialize=true;

var cgl=op.patch.cgl;


var shader=new CGL.Shader(cgl,'BasicMaterialNew');
shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);
shader.bindTextures=bindTextures;
shader.setSource(attachments.basicmaterial_vert,attachments.basicmaterial_frag);
shaderOut.set(shader);

render.onTriggered=doRender;


function bindTextures()
{
    if(diffuseTexture.get())
    {
        /* --- */cgl.setTexture(0, diffuseTexture.get().tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, diffuseTexture.get().tex);
    }

    if(op.textureOpacity.get())
    {
        /* --- */cgl.setTexture(1, op.textureOpacity.get().tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, op.textureOpacity.get().tex);
    }
}

op.preRender=function()
{
    shader.bind();
    doRender();
}

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
    
    op.alphaMaskSource=op.inValueSelect("Alpha Mask Source",["Alpha Channel","Luminance","R","G","B"],"Luminance");
    
    op.alphaMaskSource.onChange=updateAlphaMaskMethod;
    
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

    };
    
    
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
        updateAlphaMaskMethod();
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

Ops.Gl.Shader.BasicMaterialNew.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureSVG
// 
// **************************************************************

Ops.Gl.TextureSVG = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='SVG Texture';

var filename=op.addInPort(new Port(op,"file",OP_PORT_TYPE_VALUE,{ display:'file',type:'string' } ));

var texWidth=op.inValueInt("texture width");
var texHeight=op.inValueInt("texture height");

var wrap=op.addInPort(new Port(op,"wrap",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['repeat','mirrored repeat','clamp to edge']}));
var tfilter=op.addInPort(new Port(op,"filter",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['nearest','linear','mipmap']}));

var textureOut=op.outTexture("texture");


tfilter.onValueChanged=onFilterChange;
wrap.onValueChanged=onWrapChange;


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

var cgl_filter=CGL.Texture.FILTER_LINEAR;
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

texWidth.onValueChanged=reSize;
texHeight.onValueChanged=reSize;

createCanvas();
reSize();


};

Ops.Gl.TextureSVG.prototype = new CABLES.Op();

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

