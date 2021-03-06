"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Exp=Ops.Exp || {};
Ops.Anim=Ops.Anim || {};
Ops.Math=Ops.Math || {};
Ops.Exp.Gl=Ops.Exp.Gl || {};
Ops.Devices=Ops.Devices || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Deprecated=Ops.Deprecated || {};
Ops.Devices.Mouse=Ops.Devices.Mouse || {};
Ops.Deprecated.Gl=Ops.Deprecated.Gl || {};
Ops.Gl.ShaderEffects=Ops.Gl.ShaderEffects || {};
Ops.Gl.TextureEffects=Ops.Gl.TextureEffects || {};
Ops.Deprecated.Gl.Shader=Ops.Deprecated.Gl.Shader || {};
Ops.Gl.TextureEffects.Noise=Ops.Gl.TextureEffects.Noise || {};



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
// Ops.Gl.TextureEffects.ImageCompose
// 
// **************************************************************

Ops.Gl.TextureEffects.ImageCompose = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const render=op.inTrigger("render");
const useVPSize=op.addInPort(new CABLES.Port(op,"use viewport size",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
const width=op.inValueInt("width");
const height=op.inValueInt("height");

const tfilter=op.inValueSelect("filter",['nearest','linear','mipmap'],"linear");
const twrap=op.inValueSelect("wrap",['clamp to edge','repeat','mirrored repeat']);
const fpTexture=op.inValueBool("HDR");

const trigger=op.outTrigger("trigger");
const texOut=op.outTexture("texture_out");

const bgAlpha=op.inValueSlider("Background Alpha",1);
const outRatio=op.outValue("Aspect Ratio");

op.setPortGroup("Texture Size",[useVPSize,width,height]);
op.setPortGroup("Texture Settings",[twrap,tfilter,fpTexture]);



texOut.set(null);
var cgl=op.patch.cgl;
var effect=null;
var tex=null;

var w=8,h=8;
var prevViewPort=[0,0,0,0];
var reInitEffect=true;

var bgFrag=''
    .endl()+'uniform float a;'
    .endl()+'void main()'
    .endl()+'{'
    .endl()+'   outColor= vec4(0.0,0.0,0.0,a);'
    .endl()+'}';
var bgShader=new CGL.Shader(cgl,'imgcompose bg');
bgShader.setSource(bgShader.getDefaultVertexShader(),bgFrag);
var uniBgAlpha=new CGL.Uniform(bgShader,'f','a',bgAlpha);

var selectedFilter=CGL.Texture.FILTER_LINEAR;
var selectedWrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;

function initEffect()
{
    if(effect)effect.delete();
    if(tex)tex.delete();

    effect=new CGL.TextureEffect(cgl,{"isFloatingPointTexture":fpTexture.get()});

    tex=new CGL.Texture(cgl,
        {
            "name":"image compose",
            "isFloatingPointTexture":fpTexture.get(),
            "filter":selectedFilter,
            "wrap":selectedWrap,
            "width": Math.ceil(width.get()),
            "height": Math.ceil(height.get()),
        });

    effect.setSourceTexture(tex);
    texOut.set(null);
    // texOut.set(effect.getCurrentSourceTexture());

    reInitEffect=false;

    // op.log("reinit effect");
    // tex.printInfo();
}

fpTexture.onChange=function()
{
    reInitEffect=true;
};

function updateResolution()
{
    if(!effect)initEffect();

    if(useVPSize.get())
    {
        w=cgl.getViewPort()[2];
        h=cgl.getViewPort()[3];
    }
    else
    {
        w=Math.ceil(width.get());
        h=Math.ceil(height.get());
    }

    if((w!=tex.width || h!= tex.height) && (w!==0 && h!==0))
    {
        height.set(h);
        width.set(w);
        tex.setSize(w,h);
        outRatio.set(w/h);
        effect.setSourceTexture(tex);
        texOut.set(null);
        texOut.set(tex);
    }

    if(texOut.get())
        if(!texOut.get().isPowerOfTwo() )
        {
            if(!op.uiAttribs.hint)
                op.uiAttr(
                    {
                        hint:'texture dimensions not power of two! - texture filtering will not work.',
                        warning:null
                    });
        }
        else
        if(op.uiAttribs.hint)
        {
            op.uiAttr({hint:null,warning:null}); //todo only when needed...
        }

}


function updateSizePorts()
{
    if(useVPSize.get())
    {
        width.setUiAttribs({greyout:true});
        height.setUiAttribs({greyout:true});
    }
    else
    {
        width.setUiAttribs({greyout:false});
        height.setUiAttribs({greyout:false});
    }
}


useVPSize.onChange=function()
{
    updateSizePorts();
    if(useVPSize.get())
    {
        width.onChange=null;
        height.onChange=null;
    }
    else
    {
        width.onChange=updateResolution;
        height.onChange=updateResolution;
    }
    updateResolution();

};


op.preRender=function()
{
    doRender();
    bgShader.bind();
};


var doRender=function()
{
    if(!effect || reInitEffect)
    {
        initEffect();
    }
    var vp=cgl.getViewPort();
    prevViewPort[0]=vp[0];
    prevViewPort[1]=vp[1];
    prevViewPort[2]=vp[2];
    prevViewPort[3]=vp[3];


    cgl.gl.blendFunc(cgl.gl.SRC_ALPHA, cgl.gl.ONE_MINUS_SRC_ALPHA);
    // cgl.gl.blendFunc(cgl.gl.SRC_ALPHA,cgl.gl.ONE_MINUS_SRC_ALPHA);



    updateResolution();

    cgl.currentTextureEffect=effect;
    effect.setSourceTexture(tex);

    effect.startEffect();

    // render background color...
    cgl.setShader(bgShader);
    cgl.currentTextureEffect.bind();
    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );
    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();

    texOut.set(effect.getCurrentSourceTexture());
    // texOut.set(effect.getCurrentTargetTexture());


    // if(effect.getCurrentSourceTexture.filter==CGL.Texture.FILTER_MIPMAP)
    // {
    //         this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, effect.getCurrentSourceTexture.tex);
    //         effect.getCurrentSourceTexture.updateMipMap();
    //     // else
    //     // {
    //     //     this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, this._textureSource.tex);;
    //     //     this._textureSource.updateMipMap();
    //     // }

    //     this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null);
    // }

    effect.endEffect();

    cgl.setViewPort(prevViewPort[0],prevViewPort[1],prevViewPort[2],prevViewPort[3]);


    cgl.gl.blendFunc(cgl.gl.SRC_ALPHA,cgl.gl.ONE_MINUS_SRC_ALPHA);

    cgl.currentTextureEffect=null;
};


function onWrapChange()
{
    if(twrap.get()=='repeat') selectedWrap=CGL.Texture.WRAP_REPEAT;
    if(twrap.get()=='mirrored repeat') selectedWrap=CGL.Texture.WRAP_MIRRORED_REPEAT;
    if(twrap.get()=='clamp to edge') selectedWrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;

    reInitEffect=true;
    updateResolution();
}

twrap.set('clamp to edge');
twrap.onChange=onWrapChange;

function onFilterChange()
{
    if(tfilter.get()=='nearest') selectedFilter=CGL.Texture.FILTER_NEAREST;
    if(tfilter.get()=='linear')  selectedFilter=CGL.Texture.FILTER_LINEAR;
    if(tfilter.get()=='mipmap')  selectedFilter=CGL.Texture.FILTER_MIPMAP;

    reInitEffect=true;
    updateResolution();
    // effect.setSourceTexture(tex);
    // updateResolution();
}

tfilter.set('linear');
tfilter.onChange=onFilterChange;

useVPSize.set(true);
render.onTriggered=doRender;

width.set(640);
height.set(360);
updateSizePorts();

};

Ops.Gl.TextureEffects.ImageCompose.prototype = new CABLES.Op();
CABLES.OPS["5c04608d-1e42-4e36-be00-1be4a81fc309"]={f:Ops.Gl.TextureEffects.ImageCompose,objName:"Ops.Gl.TextureEffects.ImageCompose"};




// **************************************************************
// 
// Ops.Gl.RandomCluster
// 
// **************************************************************

Ops.Gl.RandomCluster = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTrigger("exe"),
    num=op.inValueInt("num"),
    seed=op.inValueFloat("random seed",1),
    round=op.inValueBool('round',false),
    size=op.inValueFloat("size",10),
    scaleX=op.inValueFloat("scaleX",1),
    scaleY=op.inValueFloat("scaleY",1),
    scaleZ=op.inValueFloat("scaleZ",1),
    trigger=op.outTrigger("trigger"),
    idx=op.outValue("index"),
    rnd=op.outValue("rnd"),
    rotX=op.inValueSlider("Rotate X",1),
    rotY=op.inValueSlider("Rotate Y",1),
    rotZ=op.inValueSlider("Rotate Z",1),
    scrollX=op.inValue("Scroll X",0);

op.setPortGroup("Area",[size,scaleX,scaleY,scaleZ]);
op.setPortGroup("Rotation",[rotX,rotY,rotZ]);
op.setPortGroup("Parameters",[num,round,seed]);
op.toWorkPortsNeedToBeLinked(exe,trigger);

const cgl=op.patch.cgl;
var randoms=[];
var origRandoms=[];
var randomsRot=[];
var randomsFloats=[];

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
CABLES.OPS["ca3bc984-e596-48fb-b53d-502eb13979b0"]={f:Ops.Gl.RandomCluster,objName:"Ops.Gl.RandomCluster"};




// **************************************************************
// 
// Ops.Gl.Meshes.Sphere
// 
// **************************************************************

Ops.Gl.Meshes.Sphere = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const render=op.inTrigger("render");
const inStacks=op.inValueInt("stacks",32);
const inSlices=op.inValueInt("slices",32);
const inRadius=op.addInPort(new CABLES.Port(op,"radius",CABLES.OP_PORT_TYPE_VALUE));
const inRender=op.inValueBool("Render",true);
const trigger=op.outTrigger("trigger")
const geomOut=op.addOutPort(new CABLES.Port(op,"geometry",CABLES.OP_PORT_TYPE_OBJECT));

inRadius.set(1);
geomOut.ignoreValueSerialize=true;

const cgl=op.patch.cgl;
var mesh=null;
var geom=null;
var geomVertices=[];
var geomVertexNormals=[];
var geomTexCoords=[];
var geomVerticesIndices=[];

inSlices.onChange=inStacks.onChange=inRadius.onChange=function()
    {
        if(mesh)mesh.dispose();
        mesh=null;
    };

op.preRender=
render.onTriggered=function()
{
    if(!mesh) updateMesh();

    if(inRender.get()) mesh.render(cgl.getShader());
    
    trigger.trigger();
};

function updateMesh()
{
    var nslices=Math.round(inSlices.get());
    var nstacks=Math.round(inStacks.get());
    if(nslices<1)nslices=1;
    if(nstacks<1)nstacks=1;
    var r=inRadius.get();
    
    uvSphere(r, nslices, nstacks);
}

// updateMesh();

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

    for (i=0; i<size; i++)
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


// from http://math.hws.edu/graphicsbook/source/webgl/basic-object-models-IFS.js
function uvSphere(radius, slices, stacks)
{
    var geom=new CGL.Geometry("sphere");

    radius = radius || 0.5;
    slices = slices || 32;
    stacks = stacks || 16;
    var vertexCount = (slices+1)*(stacks+1);
    var vertices = new Float32Array( 3*vertexCount );
    var normals = new Float32Array( 3* vertexCount );
    var texCoords = new Float32Array( 2*vertexCount );
    var indices = new Uint16Array( 2*slices*stacks*3 );
    var du = 2*Math.PI/slices;
    var dv = Math.PI/stacks;
    var i,j,u,v,x,y,z;
    var indexV = 0;
    var indexT = 0;
    for (i = 0; i <= stacks; i++)
    {
        v = -Math.PI/2 + i*dv;
        for (j = 0; j <= slices; j++)
        {
            u = j*du;
            x = Math.cos(u)*Math.cos(v);
            y = Math.sin(u)*Math.cos(v);
            z = Math.sin(v);

            vertices[indexV] = radius*x;
            normals[indexV++] = x;

            vertices[indexV] = radius*y;
            normals[indexV++] = y;

            vertices[indexV] = radius*z;
            normals[indexV++] = z;

            texCoords[indexT++] = j/slices;
            texCoords[indexT++] = i/stacks;
        } 
    }
    var k = 0;
    for (j = 0; j < stacks; j++)
    {
        var row1 = j*(slices+1);
        var row2 = (j+1)*(slices+1);
        for (i = 0; i < slices; i++)
        {
            indices[k++] = row1 + i;
            indices[k++] = row2 + i;
            indices[k++] = row2 + i + 1;
         
            indices[k++] = row1 + i;
            indices[k++] = row2 + i + 1;
            indices[k++] = row1 + i + 1;
        }
    }

    geom.vertices=vertices;
    geom.vertexNormals=normals;
    geom.texCoords=texCoords;
    geom.verticesIndices=indices;
    geom.glPrimitive=cgl.gl.TRIANGLE_STRIP;

    geomOut.set(geom);

    if(!mesh)mesh=new CGL.Mesh(cgl,geom);
    mesh.setGeom(geom);
}

op.onDelete=function()
{
    if(mesh)mesh.dispose();
}


};

Ops.Gl.Meshes.Sphere.prototype = new CABLES.Op();
CABLES.OPS["f12b6515-4432-4a78-8194-556b09154b84"]={f:Ops.Gl.Meshes.Sphere,objName:"Ops.Gl.Meshes.Sphere"};




// **************************************************************
// 
// Ops.Gl.Texture
// 
// **************************************************************

Ops.Gl.Texture = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var filename=op.inFile("file");
var tfilter=op.inValueSelect("filter",['nearest','linear','mipmap']);
var wrap=op.inValueSelect("wrap",['repeat','mirrored repeat','clamp to edge'],"clamp to edge");
var flip=op.inValueBool("flip",false);
var unpackAlpha=op.inValueBool("unpackPreMultipliedAlpha",false);

var textureOut=op.outTexture("texture");
var width=op.outValue("width");
var height=op.outValue("height");
var loading=op.outValue("loading");
var ratio=op.outValue("Aspect Ratio");

unpackAlpha.hidePort();

const cgl=op.patch.cgl;
var cgl_filter=0;
var cgl_wrap=0;

filename.onChange=flip.onChange=function(){reloadSoon();};

tfilter.onChange=onFilterChange;
wrap.onChange=onWrapChange;
unpackAlpha.onChange=function(){ reloadSoon(); };

var timedLoader=0;

tfilter.set('mipmap');
wrap.set('repeat');

textureOut.set(CGL.Texture.getEmptyTexture(cgl));

var setTempTexture=function()
{
    var t=CGL.Texture.getTempTexture(cgl);
    textureOut.set(t);
};

var loadingId=null;
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
    if(!loadingId)loadingId=cgl.patch.loading.start('textureOp',filename.get());

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
                    cgl.patch.loading.finished(loadingId);
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

        cgl.patch.loading.finished(loadingId);
    }
    else
    {
        cgl.patch.loading.finished(loadingId);
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
    console.log(fn);
    if(filename.get() && filename.get().indexOf(fn)>-1)
    {
        textureOut.set(null);
        textureOut.set(CGL.Texture.getTempTexture(cgl));

        realReload(true);
    }
};







};

Ops.Gl.Texture.prototype = new CABLES.Op();
CABLES.OPS["466394d4-6c1a-4e5d-a057-0063ab0f096a"]={f:Ops.Gl.Texture,objName:"Ops.Gl.Texture"};




// **************************************************************
// 
// Ops.Gl.TextureEffects.toNormalMap
// 
// **************************************************************

Ops.Gl.TextureEffects.toNormalMap = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={tonormal_frag:"#ifdef HAS_TEXTURES\n  IN vec2 texCoord;\n  UNI sampler2D tex;\n#endif\n\nUNI float strength;\n\nvoid main()\n{\n\n    float texelSize=1.0/1024.0;\n    \n    float tl = abs(texture(tex, texCoord + texelSize * vec2(-1.0, -1.0)).x);   // top left\n    float  l = abs(texture(tex, texCoord + texelSize * vec2(-1.0,  0.0)).x);   // left\n    float bl = abs(texture(tex, texCoord + texelSize * vec2(-1.0,  1.0)).x);   // bottom left\n    float  t = abs(texture(tex, texCoord + texelSize * vec2( 0.0, -1.0)).x);   // top\n    float  b = abs(texture(tex, texCoord + texelSize * vec2( 0.0,  1.0)).x);   // bottom\n    float tr = abs(texture(tex, texCoord + texelSize * vec2( 1.0, -1.0)).x);   // top right\n    float  r = abs(texture(tex, texCoord + texelSize * vec2( 1.0,  0.0)).x);   // right\n    float br = abs(texture(tex, texCoord + texelSize * vec2( 1.0,  1.0)).x);   // bottom right\n    \n    //     // Compute dx using Sobel:\n    //     //           -1 0 1 \n    //     //           -2 0 2\n    //     //           -1 0 1\n    float dX = tr + 2.0*r + br -tl - 2.0*l - bl;\n    \n    //     // Compute dy using Sobel:\n    //     //           -1 -2 -1 \n    //     //            0  0  0\n    //     //            1  2  1\n    float dY = bl + 2.0*b + br -tl - 2.0*t - tr;\n    \n    //     // Build the normalized normal\n    \n    vec4 N = vec4(normalize(vec3(dX,dY, 1.0 / strength)), 1.0);\n    \n    //     //convert (-1.0 , 1.0) to (0.0 , 1.0), if needed\n    N= N * 0.5 + 0.5;\n\n   outColor= N;\n}",};
var render=op.inTrigger('render');
var trigger=op.outTrigger('trigger');
var strength=op.inValue("Strength",4);
var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);

// from: https://forum.openframeworks.cc/t/compute-normal-map-from-image/1400/11

shader.setSource(shader.getDefaultVertexShader(),attachments.tonormal_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);
var uniStrength=new CGL.Uniform(shader,'f','strength',strength);

render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );
    

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.toNormalMap.prototype = new CABLES.Op();
CABLES.OPS["a9aba612-dc72-4108-a6fb-f0292463a186"]={f:Ops.Gl.TextureEffects.toNormalMap,objName:"Ops.Gl.TextureEffects.toNormalMap"};




// **************************************************************
// 
// Ops.Gl.TextureEffects.Noise.WorleyNoise
// 
// **************************************************************

Ops.Gl.TextureEffects.Noise.WorleyNoise = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={worleynoise_frag:"// Author: Stefan Gustavson\n// Title: Worley noise 2x2x2\n\nIN vec2 texCoord;\n\nUNI float amount;\nUNI float x;\nUNI float y;\nUNI float z;\nUNI float scale;\nUNI sampler2D tex;\nUNI float rangeA;\nUNI float rangeB;\n{{BLENDCODE}}\n\n\n// Cellular noise (\"Worley noise\") in 3D in GLSL.\n// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.\n// This code is released under the conditions of the MIT license.\n// See LICENSE file for details.\n\n// Permutation polynomial: (34x^2 + x) mod 289\nvec4 permute(vec4 x) {\n  return mod((34.0 * x + 1.0) * x, 289.0);\n}\nvec3 permute(vec3 x) {\n  return mod((34.0 * x + 1.0) * x, 289.0);\n}\n\n// Cellular noise, returning F1 and F2 in a vec2.\n// Speeded up by using 2x2x2 search window instead of 3x3x3,\n// at the expense of some pattern artifacts.\n// F2 is often wrong and has sharp discontinuities.\n// If you need a good F2, use the slower 3x3x3 version.\nvec2 cellular2x2x2(vec3 P) {\n\t#define K 0.142857142857 // 1/7\n\t#define Ko 0.428571428571 // 1/2-K/2\n\t#define K2 0.020408163265306 // 1/(7*7)\n\t#define Kz 0.166666666667 // 1/6\n\t#define Kzo 0.416666666667 // 1/2-1/6*2\n\t#define jitter 0.8 // smaller jitter gives less errors in F2\n\tvec3 Pi = mod(floor(P), 289.0);\n \tvec3 Pf = fract(P);\n\tvec4 Pfx = Pf.x + vec4(0.0, -1.0, 0.0, -1.0);\n\tvec4 Pfy = Pf.y + vec4(0.0, 0.0, -1.0, -1.0);\n\tvec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));\n\tp = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));\n\tvec4 p1 = permute(p + Pi.z); // z+0\n\tvec4 p2 = permute(p + Pi.z + vec4(1.0)); // z+1\n\tvec4 ox1 = fract(p1*K) - Ko;\n\tvec4 oy1 = mod(floor(p1*K), 7.0)*K - Ko;\n\tvec4 oz1 = floor(p1*K2)*Kz - Kzo; // p1 < 289 guaranteed\n\tvec4 ox2 = fract(p2*K) - Ko;\n\tvec4 oy2 = mod(floor(p2*K), 7.0)*K - Ko;\n\tvec4 oz2 = floor(p2*K2)*Kz - Kzo;\n\tvec4 dx1 = Pfx + jitter*ox1;\n\tvec4 dy1 = Pfy + jitter*oy1;\n\tvec4 dz1 = Pf.z + jitter*oz1;\n\tvec4 dx2 = Pfx + jitter*ox2;\n\tvec4 dy2 = Pfy + jitter*oy2;\n\tvec4 dz2 = Pf.z - 1.0 + jitter*oz2;\n\tvec4 d1 = dx1 * dx1 + dy1 * dy1 + dz1 * dz1; // z+0\n\tvec4 d2 = dx2 * dx2 + dy2 * dy2 + dz2 * dz2; // z+1\n\n\t// Sort out the two smallest distances (F1, F2)\n#if 0\n\t// Cheat and sort out only F1\n\td1 = min(d1, d2);\n\td1.xy = min(d1.xy, d1.wz);\n\td1.x = min(d1.x, d1.y);\n\treturn sqrt(d1.xx);\n#else\n\t// Do it right and sort out both F1 and F2\n\tvec4 d = min(d1,d2); // F1 is now in d\n\td2 = max(d1,d2); // Make sure we keep all candidates for F2\n\td.xy = (d.x < d.y) ? d.xy : d.yx; // Swap smallest to d.x\n\td.xz = (d.x < d.z) ? d.xz : d.zx;\n\td.xw = (d.x < d.w) ? d.xw : d.wx; // F1 is now in d.x\n\td.yzw = min(d.yzw, d2.yzw); // F2 now not in d2.yzw\n\td.y = min(d.y, d.z); // nor in d.z\n\td.y = min(d.y, d.w); // nor in d.w\n\td.y = min(d.y, d2.x); // F2 is now in d.y\n\treturn sqrt(d.xy); // F1 and F2\n#endif\n}\n\nvoid main(void) {\n\tvec2 st = texCoord;//gl_FragCoord.xy/u_resolution.xy;\n\n\t#ifdef DO_TILEABLE\n\t    st=abs(texCoord-0.5);\n\t#endif\n\n    st.x-=0.5;\n    st.y-=0.5;\n\tst *= scale;\n    st.x+=0.5;\n    st.y+=0.5;\n\n\tst.x+=x;\n\tst.y+=y;\n\t\n\n\tvec2 F = cellular2x2x2(vec3(st,z));\n\tfloat n = smoothstep(rangeA,rangeB, F.x);\n\n    #ifdef DO_INVERT\n        n=1.0-n;\n    #endif\n    \n    vec4 col=vec4(n,n,n,1.0);\n\n    vec4 base=texture(tex,texCoord);\n    \n    col=vec4( _blend(base.rgb,col.rgb) ,1.0);\n    col=vec4( mix( col.rgb, base.rgb ,1.0-base.a*amount),1.0);\n\n    outColor= col;\n\n// \toutColor= vec4(n, n, n, 1.0);\n}\n",};
var render=op.inTrigger('render');

var blendMode=CGL.TextureEffect.AddBlendSelect(op,"Blend Mode","normal");
var amount=op.inValueSlider("Amount",1);

var x=op.inValue("X",0);
var y=op.inValue("Y",0);
var z=op.inValue("Z",0);
var scale=op.inValue("Scale",22);
var inv=op.inValueBool("Invert",true);

var rangeA=op.inValueSlider("RangeA",0.4);
var rangeB=op.inValueSlider("RangeB",0.5);

var trigger=op.outTrigger('trigger');

var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);

const srcFrag=(attachments.worleynoise_frag||'').replace('{{BLENDCODE}}',CGL.TextureEffect.getBlendCode());

shader.setSource(shader.getDefaultVertexShader(),srcFrag );
const textureUniform=new CGL.Uniform(shader,'t','tex',0);

const uniZ=new CGL.Uniform(shader,'f','z',z);
const uniX=new CGL.Uniform(shader,'f','x',x);
const uniY=new CGL.Uniform(shader,'f','y',y);
const uniScale=new CGL.Uniform(shader,'f','scale',scale);
const amountUniform=new CGL.Uniform(shader,'f','amount',amount);
const rangeAUniform=new CGL.Uniform(shader,'f','rangeA',rangeA);
const rangeBUniform=new CGL.Uniform(shader,'f','rangeB',rangeB);

inv.onChange=updateInvert;
updateInvert();

CGL.TextureEffect.setupBlending(op,shader,blendMode,amount);


function updateInvert()
{
    if(inv.get())shader.define("DO_INVERT");
        else shader.removeDefine("DO_INVERT");
}

var tile=op.inValueBool("Tileable",false);
tile.onChange=updateTileable;
function updateTileable()
{
    if(tile.get())shader.define("DO_TILEABLE");
        else shader.removeDefine("DO_TILEABLE");
}

render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );
    

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Noise.WorleyNoise.prototype = new CABLES.Op();
CABLES.OPS["cc0e941c-6f03-4c40-8cc2-8cecaac2e059"]={f:Ops.Gl.TextureEffects.Noise.WorleyNoise,objName:"Ops.Gl.TextureEffects.Noise.WorleyNoise"};




// **************************************************************
// 
// Ops.Gl.TextureEffects.Noise.FBMNoise
// 
// **************************************************************

Ops.Gl.TextureEffects.Noise.FBMNoise = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={fbmnoise_frag:"UNI sampler2D tex;\nUNI float anim;\n\nUNI float scale;\nUNI float repeat;\n\nUNI float scrollX;\nUNI float scrollY;\n\nUNI float amount;\n\nUNI bool layer1;\nUNI bool layer2;\nUNI bool layer3;\nUNI bool layer4;\n\nUNI float aspect;\n\nIN vec2 texCoord;\n\n\n{{BLENDCODE}}\n\n// adapted from warp shader by inigo quilez/iq\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\n// See here for a tutorial on how to make this: http://www.iquilezles.org/www/articles/warp/warp.htm\n\nconst mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );\n\nfloat noise( in vec2 x )\n{\n\treturn sin(1.5*x.x)*sin(1.5*x.y);\n}\n\nfloat fbm4( vec2 p )\n{\n    float f = 0.0;\n    f += 0.5000*noise( p ); p = m*p*2.02;\n    f += 0.2500*noise( p ); p = m*p*2.03;\n    f += 0.1250*noise( p ); p = m*p*2.01;\n    f += 0.0625*noise( p );\n    return f/0.9375;\n}\n\nfloat fbm6( vec2 p )\n{\n    float f = 0.0;\n    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;\n    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;\n    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;\n    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;\n    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;\n    f += 0.015625*(0.5+0.5*noise( p ));\n    return f/0.96875;\n}\n\nvoid main()\n{\n    // vec4 col=texture(tex,texCoord+2.0*fbm4(texCoord+2.0*fbm6(texCoord+anim)));\n\n    vec2 tc=texCoord;\n\t#ifdef DO_TILEABLE\n\t    tc=abs(texCoord-0.5);\n\t#endif\n\n\n    vec2 p=(tc-0.5)*scale;\n\n\n    p.y/=aspect;\n    vec2 q = vec2( fbm4( p + vec2(0.3+scrollX,0.20+scrollY) ),\n                   fbm4( p + vec2(3.1+scrollX,1.3+scrollY) ) );\n\n    vec2 q2 = vec2( fbm4( p + vec2(2.0+scrollX,1.0+scrollY) ),\n                   fbm4( p + vec2(3.1+scrollX,1.3+scrollY) ) );\n\n    vec2 q3 = vec2( fbm4( p + vec2(9.0+scrollX,4.0+scrollY) ),\n                   fbm4( p + vec2(3.1+scrollX,4.3+scrollY) ) );\n\n\n\n    float v= fbm4( ( p + 4.0*q +anim*0.1)*repeat);\n    float v2= fbm4( (p + 4.0*q2 +anim*0.1)*repeat );\n\n    float v3= fbm6( (p + 4.0*q3 +anim*0.1)*repeat );\n    float v4= fbm6( (p + 4.0*q2 +anim*0.1)*repeat );\n\n\n    // vec4 col=vec4( vec3( fbm4(( texCoord + fbm6(texCoord*anim) ) )) ,1.0 );\n    // outColor = vec4(vec3(fbm6(texCoord)),1.0);\n\n\n    vec4 base=texture(tex,texCoord);\n\n    vec4 finalColor;\n    float colVal=0.0;\n    float numLayers=0.0;\n\n    if(layer1)\n    {\n        colVal+=v;\n        numLayers++;\n    }\n\n    if(layer2)\n    {\n        colVal+=v2;\n        numLayers++;\n    }\n\n    if(layer3)\n    {\n        colVal+=v3;\n        numLayers++;\n    }\n\n    if(layer4)\n    {\n        colVal+=v4;\n        numLayers++;\n    }\n\n\n    // finalColor=vec4( vec3(v3)*1.0,1.0);\n    // finalColor=vec4( vec3(v3+v2)/2.0,1.0);\n    // finalColor=vec4( vec3(v+v2+v4+v3)/4.0,1.0);\n\n    finalColor=vec4( vec3(colVal/numLayers),1.0);\n\n\n    finalColor = vec4( _blend( base.rgb, finalColor.rgb ) ,1.0);\n    finalColor = vec4( mix( finalColor.rgb, base.rgb ,1.0-base.a*amount),1.0);\n\n\n    outColor = finalColor;\n\n\n    // outColor=vec4( v2,v,v4,1.0);\n    // outColor=vec4( vec3(q.x+q.y),1.0);\n\n    // outColor=texture(tex,vec2(v,v2));\n}\n",};
const
    render=op.inTrigger("render"),
    blendMode=CGL.TextureEffect.AddBlendSelect(op,"Blend Mode","normal"),
    amount=op.inValueSlider("Amount",1),
    trigger=op.outTrigger("trigger");

const cgl=op.patch.cgl;
const shader=new CGL.Shader(cgl);

var srcFrag=attachments.fbmnoise_frag.replace('{{BLENDCODE}}',CGL.TextureEffect.getBlendCode());

shader.setSource(shader.getDefaultVertexShader(),srcFrag );
var textureUniform=new CGL.Uniform(shader,'t','tex',0);

var uniScale=new CGL.Uniform(shader,'f','scale',op.inValue("scale",2));
var uniAnim=new CGL.Uniform(shader,'f','anim',op.inValue("anim",0));
var uniScrollX=new CGL.Uniform(shader,'f','scrollX',op.inValue("scrollX",9));
var uniScrollY=new CGL.Uniform(shader,'f','scrollY',op.inValue("scrollY",0));
var uniRepeat=new CGL.Uniform(shader,'f','repeat',op.inValue("repeat",1));
var uniAspect=new CGL.Uniform(shader,'f','aspect',op.inValue("aspect",1));

var uniLayer1=new CGL.Uniform(shader,'b','layer1',op.inValueBool("Layer 1",true));
var uniLayer2=new CGL.Uniform(shader,'b','layer2',op.inValueBool("Layer 2",true));
var uniLayer3=new CGL.Uniform(shader,'b','layer3',op.inValueBool("Layer 3",true));
var uniLayer4=new CGL.Uniform(shader,'b','layer4',op.inValueBool("Layer 4",true));

var amountUniform=new CGL.Uniform(shader,'f','amount',amount);

var tile=op.inValueBool("Tileable",false);
tile.onChange=updateTileable;
function updateTileable()
{
    if(tile.get())shader.define("DO_TILEABLE");
        else shader.removeDefine("DO_TILEABLE");
}

CGL.TextureEffect.setupBlending(op,shader,blendMode,amount);

render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    uniAspect.set( cgl.currentTextureEffect.getCurrentSourceTexture().width / cgl.currentTextureEffect.getCurrentSourceTexture().height );

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Noise.FBMNoise.prototype = new CABLES.Op();
CABLES.OPS["7073186c-b776-48c2-a01e-041df88ad88a"]={f:Ops.Gl.TextureEffects.Noise.FBMNoise,objName:"Ops.Gl.TextureEffects.Noise.FBMNoise"};




// **************************************************************
// 
// Ops.Gl.TextureEffects.Levels
// 
// **************************************************************

Ops.Gl.TextureEffects.Levels = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={levels_frag:"IN vec2 texCoord;\nUNI sampler2D tex;\nUNI float inMin;\nUNI float inMax;\nUNI float midPoint;\nUNI float outMax;\nUNI float outMin;\n\nvoid main()\n{\n   vec4 base=texture(tex,texCoord);\n\n   vec4 inputRange = min(max(base - vec4(inMin), vec4(0.0)) / (vec4(inMax) - vec4(inMin)), vec4(outMax));\n   inputRange = pow(inputRange, vec4(1.0 / (1.5 - midPoint)));\n\n   outColor= mix(vec4(outMin), vec4(1.0), inputRange);\n\n}",};
var render=op.inTrigger('Render');

var inMin=op.inValueSlider("In Min",0);
var inMid=op.inValueSlider("Midpoint",0.5);
var inMax=op.inValueSlider("In Max",1);

var outMin=op.inValueSlider("Out Min",0);
var outMax=op.inValueSlider("Out Max",1);

var trigger=op.addOutPort(new CABLES.Port(op,"Next",CABLES.OP_PORT_TYPE_FUNCTION));

var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);

var uniInMin=new CGL.Uniform(shader,'f','inMin',inMin);
var uniInMid=new CGL.Uniform(shader,'f','midPoint',inMid);
var uniInMax=new CGL.Uniform(shader,'f','inMax',inMax);

var uniOutMin=new CGL.Uniform(shader,'f','outMin',outMin);
var uniOutMax=new CGL.Uniform(shader,'f','outMax',outMax);




shader.setSource(shader.getDefaultVertexShader(),attachments.levels_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);

render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Levels.prototype = new CABLES.Op();
CABLES.OPS["42ad6bbe-df17-48c7-89dd-bd7022113897"]={f:Ops.Gl.TextureEffects.Levels,objName:"Ops.Gl.TextureEffects.Levels"};




// **************************************************************
// 
// Ops.Gl.TextureEffects.DrawImage
// 
// **************************************************************

Ops.Gl.TextureEffects.DrawImage = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={drawimage_frag:"#ifdef HAS_TEXTURES\n  IN vec2 texCoord;\n  UNI sampler2D tex;\n  UNI sampler2D image;\n#endif\n\nIN mat3 transform;\nUNI float rotate;\n{{BLENDCODE}}\n\n#ifdef HAS_TEXTUREALPHA\n   UNI sampler2D imageAlpha;\n#endif\n\nUNI float amount;\n\nvoid main()\n{\n   vec4 blendRGBA=vec4(0.0,0.0,0.0,1.0);\n   #ifdef HAS_TEXTURES\n       vec2 tc=texCoord;\n\n       #ifdef TEX_FLIP_X\n           tc.x=1.0-tc.x;\n       #endif\n       #ifdef TEX_FLIP_Y\n           tc.y=1.0-tc.y;\n       #endif\n\n       #ifdef TEX_TRANSFORM\n           vec3 coordinates=vec3(tc.x, tc.y,1.0);\n           tc=(transform * coordinates ).xy;\n       #endif\n\n       blendRGBA=texture(image,tc);\n\n       vec3 blend=blendRGBA.rgb;\n       vec4 baseRGBA=texture(tex,texCoord);\n       vec3 base=baseRGBA.rgb;\n\n       vec3 colNew=_blend(base,blend);\n\n       #ifdef REMOVE_ALPHA_SRC\n           blendRGBA.a=1.0;\n       #endif\n\n       #ifdef HAS_TEXTUREALPHA\n           vec4 colImgAlpha=texture(imageAlpha,texCoord);\n           float colImgAlphaAlpha=colImgAlpha.a;\n\n           #ifdef ALPHA_FROM_LUMINANCE\n               vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), colImgAlpha.rgb ));\n               colImgAlphaAlpha=(gray.r+gray.g+gray.b)/3.0;\n           #endif\n\n           blendRGBA.a=colImgAlphaAlpha*blendRGBA.a;\n           \n           #ifdef INVERT_ALPHA\n           blendRGBA.a=1.0-blendRGBA.a;\n           #endif\n       #endif\n\n\n   #endif\n\n   blendRGBA.rgb=mix( colNew, base ,1.0-blendRGBA.a*amount);\n   blendRGBA.a=1.0;\n\n\n   outColor= blendRGBA;\n}",drawimage_vert:"IN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\nOUT vec2 texCoord;\nOUT vec3 norm;\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nUNI float posX;\nUNI float posY;\nUNI float scale;\nUNI float rotate;\n\nOUT mat3 transform;\n\nvoid main()\n{\n    texCoord=attrTexCoord;\n    norm=attrVertNormal;\n\n    #ifdef TEX_TRANSFORM\n    vec3 coordinates=vec3(attrTexCoord.x, attrTexCoord.y,1.0);\n    float angle = radians( rotate );\n    vec2 scale= vec2(scale,scale);\n    vec2 translate= vec2(posX,posY);\n\n    transform = mat3(   scale.x * cos( angle ), scale.x * sin( angle ), 0.0,\n                        - scale.y * sin( angle ), scale.y * cos( angle ), 0.0,\n                        - 0.5 * scale.x * cos( angle ) + 0.5 * scale.y * sin( angle ) - 0.5 * translate.x*2.0 + 0.5,  - 0.5 * scale.x * sin( angle ) - 0.5 * scale.y * cos( angle ) - 0.5 * translate.y*2.0 + 0.5, 1.0);\n    #endif\n\n    gl_Position = projMatrix * mvMatrix * vec4(vPosition,  1.0);\n}",};
var render=op.inTrigger('render');
var amount=op.addInPort(new CABLES.Port(op,"amount",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
var blendMode=CGL.TextureEffect.AddBlendSelect(op,"blendMode");

var image=op.addInPort(new CABLES.Port(op,"image",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true }));

var imageAlpha=op.addInPort(new CABLES.Port(op,"imageAlpha",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true }));
var alphaSrc=op.inValueSelect("alphaSrc",['alpha channel','luminance']);
var removeAlphaSrc=op.addInPort(new CABLES.Port(op,"removeAlphaSrc",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));

var invAlphaChannel=op.addInPort(new CABLES.Port(op,"invert alpha channel",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));


var trigger=op.outTrigger('trigger');

op.toWorkPortsNeedToBeLinked(image);


blendMode.set('normal');
var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl,'drawimage');

amount.set(1.0);

render.onTriggered=doRender;

var srcFrag=attachments.drawimage_frag.replace('{{BLENDCODE}}',CGL.TextureEffect.getBlendCode());

shader.setSource(attachments.drawimage_vert,srcFrag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);
var textureDisplaceUniform=new CGL.Uniform(shader,'t','image',1);
var textureAlpha=new CGL.Uniform(shader,'t','imageAlpha',2);

invAlphaChannel.onChange=function()
{
    if(invAlphaChannel.get()) shader.define('INVERT_ALPHA');
        else shader.removeDefine('INVERT_ALPHA');
};

removeAlphaSrc.onChange=function()
{
    if(removeAlphaSrc.get()) shader.define('REMOVE_ALPHA_SRC');
        else shader.removeDefine('REMOVE_ALPHA_SRC');
};
removeAlphaSrc.set(true);

alphaSrc.onChange=function()
{
    if(alphaSrc.get()=='luminance') shader.define('ALPHA_FROM_LUMINANCE');
        else shader.removeDefine('ALPHA_FROM_LUMINANCE');
};

alphaSrc.set("alpha channel");


{
    //
    // texture flip
    //
    var flipX=op.addInPort(new CABLES.Port(op,"flip x",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
    var flipY=op.addInPort(new CABLES.Port(op,"flip y",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));

    flipX.onChange=function()
    {
        if(flipX.get()) shader.define('TEX_FLIP_X');
            else shader.removeDefine('TEX_FLIP_X');
    };

    flipY.onChange=function()
    {
        if(flipY.get()) shader.define('TEX_FLIP_Y');
            else shader.removeDefine('TEX_FLIP_Y');
    };
}

{
    //
    // texture transform
    //
    var scale=op.addInPort(new CABLES.Port(op,"scale",CABLES.OP_PORT_TYPE_VALUE,{ display:'range' }));
    var posX=op.addInPort(new CABLES.Port(op,"pos x",CABLES.OP_PORT_TYPE_VALUE, {}));
    var posY=op.addInPort(new CABLES.Port(op,"pos y",CABLES.OP_PORT_TYPE_VALUE, {}));
    var rotate=op.addInPort(new CABLES.Port(op,"rotate",CABLES.OP_PORT_TYPE_VALUE, {}));

    scale.set(1.0);

    var uniScale=new CGL.Uniform(shader,'f','scale',scale.get());
    var uniPosX=new CGL.Uniform(shader,'f','posX',posX.get());
    var uniPosY=new CGL.Uniform(shader,'f','posY',posY.get());
    var uniRotate=new CGL.Uniform(shader,'f','rotate',rotate.get());

    function updateTransform()
    {
        if(scale.get()!=1.0 || posX.get()!=0.0 || posY.get()!=0.0 || rotate.get()!=0.0 )
        {
            if(!shader.hasDefine('TEX_TRANSFORM')) shader.define('TEX_TRANSFORM');
            uniScale.setValue( parseFloat(scale.get()) );
            uniPosX.setValue( posX.get() );
            uniPosY.setValue( posY.get() );
            uniRotate.setValue( rotate.get() );
        }
        else
        {
            // shader.removeDefine('TEX_TRANSFORM');
        }
    }

    scale.onChange=updateTransform;
    posX.onChange=updateTransform;
    posY.onChange=updateTransform;
    rotate.onChange=updateTransform;
}

CGL.TextureEffect.setupBlending(op,shader,blendMode,amount);


var amountUniform=new CGL.Uniform(shader,'f','amount',amount);
var oldHadImageAlpha=false;

function doRender()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    if(imageAlpha.get() && !oldHadImageAlpha || !imageAlpha.get() && oldHadImageAlpha)
    {
        if(imageAlpha.get() && imageAlpha.get().tex)
        {
            shader.define('HAS_TEXTUREALPHA');
            oldHadImageAlpha=true;
        }
        else
        {
            shader.removeDefine('HAS_TEXTUREALPHA');
            oldHadImageAlpha=false;
        }
    }

    if(image.get() && image.get().tex && amount.get()>0.0)
    {
        cgl.setShader(shader);
        cgl.currentTextureEffect.bind();

        cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

        if(image.get() && image.get().tex) cgl.setTexture(1, image.get().tex );
            else cgl.setTexture(1, null);

        if(imageAlpha.get() && imageAlpha.get().tex) cgl.setTexture(2, imageAlpha.get().tex );
            else cgl.setTexture(2,null);

        cgl.currentTextureEffect.finish();
        cgl.setPreviousShader();
    }

    trigger.trigger();
}



};

Ops.Gl.TextureEffects.DrawImage.prototype = new CABLES.Op();
CABLES.OPS["8248b866-9492-48c8-897d-3097c6fe6fe8"]={f:Ops.Gl.TextureEffects.DrawImage,objName:"Ops.Gl.TextureEffects.DrawImage"};




// **************************************************************
// 
// Ops.Sequence
// 
// **************************************************************

Ops.Sequence = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const exe=op.inTrigger("exe");
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
    triggers.push( op.addOutPort(new CABLES.Port(op,"trigger "+i,CABLES.OP_PORT_TYPE_FUNCTION)) );
    
    if(i<num-1)
    {
        var newExe=op.addInPort(new CABLES.Port(op,"exe "+i,CABLES.OP_PORT_TYPE_FUNCTION));
        newExe.onTriggered=triggerAll;
        exes.push( newExe );
    }
}


};

Ops.Sequence.prototype = new CABLES.Op();
CABLES.OPS["a466bc1f-06e9-4595-8849-bffb9fe22f99"]={f:Ops.Sequence,objName:"Ops.Sequence"};




// **************************************************************
// 
// Ops.Deprecated.Gl.Shader.MatCapMaterial
// 
// **************************************************************

Ops.Deprecated.Gl.Shader.MatCapMaterial = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var self=this;
var cgl=self.patch.cgl;

this.render=this.addInPort(new CABLES.Port(this,"render",CABLES.OP_PORT_TYPE_FUNCTION));
this.trigger=this.addOutPort(new CABLES.Port(this,"trigger",CABLES.OP_PORT_TYPE_FUNCTION));
this.shaderOut=this.addOutPort(new CABLES.Port(this,"shader",CABLES.OP_PORT_TYPE_OBJECT));
this.shaderOut.ignoreValueSerialize=true;

this.texture=this.addInPort(new CABLES.Port(this,"texture",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureUniform=null;

this.textureDiffuse=this.addInPort(new CABLES.Port(this,"diffuse",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureDiffuseUniform=null;

this.textureNormal=this.addInPort(new CABLES.Port(this,"normal",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureNormalUniform=null;

this.normalScale=this.addInPort(new CABLES.Port(this,"normalScale",CABLES.OP_PORT_TYPE_VALUE,{display:'range'}));
this.normalScale.set(0.4);
this.normalScaleUniform=null;

this.textureSpec=this.addInPort(new CABLES.Port(this,"specular",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureSpecUniform=null;

this.textureSpecMatCap=this.addInPort(new CABLES.Port(this,"specular matcap",CABLES.OP_PORT_TYPE_TEXTURE,{preview:true,display:'createOpHelper'}));
this.textureSpecMatCapUniform=null;


this.diffuseRepeatX=this.addInPort(new CABLES.Port(this,"diffuseRepeatX",CABLES.OP_PORT_TYPE_VALUE));
this.diffuseRepeatY=this.addInPort(new CABLES.Port(this,"diffuseRepeatY",CABLES.OP_PORT_TYPE_VALUE));
this.diffuseRepeatX.set(1.0);
this.diffuseRepeatY.set(1.0);

var pOpacity=op.inValueSlider("Opacity",1);


this.diffuseRepeatX.onChange=function()
{
    self.diffuseRepeatXUniform.setValue(self.diffuseRepeatX.get());
};

this.diffuseRepeatY.onChange=function()
{
    self.diffuseRepeatYUniform.setValue(self.diffuseRepeatY.get());
};


this.calcTangents=this.addInPort(new CABLES.Port(this,"calc normal tangents",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
this.calcTangents.onChange=function()
{
    if(self.calcTangents.get()) shader.define('CALC_TANGENT');
        else shader.removeDefine('CALC_TANGENT');
};

this.projectCoords=this.addInPort(new CABLES.Port(this,"projectCoords",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',values:['no','xy','yz','xz']}));
this.projectCoords.set('no');
this.projectCoords.onChange=function()
{
    shader.removeDefine('DO_PROJECT_COORDS_XY');
    shader.removeDefine('DO_PROJECT_COORDS_YZ');
    shader.removeDefine('DO_PROJECT_COORDS_XZ');

    if(self.projectCoords.get()=='xy') shader.define('DO_PROJECT_COORDS_XY');
    if(self.projectCoords.get()=='yz') shader.define('DO_PROJECT_COORDS_YZ');
    if(self.projectCoords.get()=='xz') shader.define('DO_PROJECT_COORDS_XZ');
};

this.normalRepeatX=this.addInPort(new CABLES.Port(this,"normalRepeatX",CABLES.OP_PORT_TYPE_VALUE));
this.normalRepeatY=this.addInPort(new CABLES.Port(this,"normalRepeatY",CABLES.OP_PORT_TYPE_VALUE));
this.normalRepeatX.set(1.0);
this.normalRepeatY.set(1.0);

this.normalRepeatX.onChange=function()
{
    self.normalRepeatXUniform.setValue(self.normalRepeatX.get());
};

this.normalRepeatY.onChange=function()
{
    self.normalRepeatYUniform.setValue(self.normalRepeatY.get());
};

this.normalScale.onChange=function()
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

this.texture.onChange=function()
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

this.textureDiffuse.onChange=function()
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



this.textureNormal.onChange=function()
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

this.textureSpec.onChange=changeSpec;
this.textureSpecMatCap.onChange=changeSpec;


function bindTextures()
{
    if(self.texture.get())cgl.setTexture(0,self.texture.get().tex);
    if(self.textureDiffuse.get()) cgl.setTexture(1,self.textureDiffuse.get().tex);
    if(self.textureNormal.get()) cgl.setTexture(2,self.textureNormal.get().tex);
    if(self.textureSpec.get()) cgl.setTexture(3,self.textureSpec.get().tex);
    if(self.textureSpecMatCap.get()) cgl.setTexture(4,self.textureSpecMatCap.get().tex);
};

this.doRender=function()
{
    shader.bindTextures=bindTextures;

    cgl.setShader(shader);
    self.trigger.trigger();
    cgl.setPreviousShader();



    // if(self.texture.get())
    // {
    //     cgl.setTexture(0);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }

    // if(self.textureDiffuse.get())
    // {
    //     cgl.setTexture(1);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }

    // if(self.textureNormal.get())
    // {
    //     cgl.setTexture(2);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }

    // if(self.textureSpec.get())
    // {
    //     cgl.setTexture(3);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }
    // if(self.textureSpecMatCap.get())
    // {
    //     cgl.setTexture(4);
    //     cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);
    // }
};

var srcVert=''
    .endl()+'{{MODULES_HEAD}}'

    .endl()+'IN vec3 vPosition;'
    .endl()+'IN float attrVertIndex;'

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


    .endl()+'    outColor= col;'
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

Ops.Deprecated.Gl.Shader.MatCapMaterial.prototype = new CABLES.Op();
CABLES.OPS["06d1d014-7de0-4d95-b80f-c3e4b583b25f"]={f:Ops.Deprecated.Gl.Shader.MatCapMaterial,objName:"Ops.Deprecated.Gl.Shader.MatCapMaterial"};




// **************************************************************
// 
// Ops.Gl.Meshes.Rectangle
// 
// **************************************************************

Ops.Gl.Meshes.Rectangle = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var render=op.inTrigger("render");
var trigger=op.outTrigger('trigger');

var width=op.inValue("width",1);
var height=op.inValue("height",1);

var pivotX=op.inValueSelect("pivot x",["center","left","right"]);
var pivotY=op.inValueSelect("pivot y",["center","top","bottom"]);

var nColumns=op.inValueInt("num columns",1);
var nRows=op.inValueInt("num rows",1);
var axis=op.inValueSelect("axis",["xy","xz"],"xy");

var active=op.inValueBool('Active',true);

var geomOut=op.outObject("geometry");
geomOut.ignoreValueSerialize=true;

var cgl=op.patch.cgl;
axis.set('xy');
pivotX.set('center');
pivotY.set('center');

op.setPortGroup('Pivot',[pivotX,pivotY]);
op.setPortGroup('Size',[width,height]);
op.setPortGroup('Structure',[nColumns,nRows]);

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
    if(!CGL.TextureEffect.checkOpNotInTextureEffect(op)) return;


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
    else if(pivotX.get()=='right') x=-w/2;
    else if(pivotX.get()=='left') x=+w/2;

    if(pivotY.get()=='center') y=0;
    else if(pivotY.get()=='top') y=-h/2;
    else if(pivotY.get()=='bottom') y=+h/2;

    var verts=[];
    var tc=[];
    var norms=[];
    var tangents=[];
    var biTangents=[];
    var indices=[];

    var numRows=Math.round(nRows.get());
    var numColumns=Math.round(nColumns.get());

    var stepColumn=w/numColumns;
    var stepRow=h/numRows;

    var c,r,a;
    a=axis.get();
    for(r=0;r<=numRows;r++)
    {
        for(c=0;c<=numColumns;c++)
        {
            verts.push( c*stepColumn - width.get()/2+x );
            if(a=='xz') verts.push( 0.0 );
            verts.push( r*stepRow - height.get()/2+y );
            if(a=='xy') verts.push( 0.0 );

            tc.push( c/numColumns );
            tc.push( 1.0-r/numRows );

            if(a=='xz')
            {
                norms.push(0,1,0);
                tangents.push(1,0,0);
                biTangents.push(0,0,1);
            }
            else if(a=='xy')
            {
                norms.push(0,0,1);
                tangents.push(-1,0,0);
                biTangents.push(0,-1,0);
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
    geom.tangents=tangents;
    geom.biTangents=biTangents;

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
CABLES.OPS["20f3c4e7-04d1-44e0-b868-05756d1c66c6"]={f:Ops.Gl.Meshes.Rectangle,objName:"Ops.Gl.Meshes.Rectangle"};




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
// Ops.Devices.Mouse.Mouse
// 
// **************************************************************

Ops.Devices.Mouse.Mouse = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

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

normalize.onChange=function()
{
    mouseX=0;
    mouseY=0;
    setValue(mouseX,mouseY);
};

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

function removeListeners()
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
    if(listenerElement)removeListeners();

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
    if(listenerElement)removeListeners();
    if(active.get())addListeners();
}

op.onDelete=function()
{
    removeListeners();
};

addListeners();


};

Ops.Devices.Mouse.Mouse.prototype = new CABLES.Op();
CABLES.OPS["0bf51f3e-3161-4cc5-aecf-6e9160089fd2"]={f:Ops.Devices.Mouse.Mouse,objName:"Ops.Devices.Mouse.Mouse"};




// **************************************************************
// 
// Ops.Anim.Timer
// 
// **************************************************************

Ops.Anim.Timer = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var playPause=op.inValueBool("Play",true);
var reset=op.inTriggerButton("Reset");
var outTime=op.outValue("Time");
var inSpeed=op.inValue("Speed",1);

var timer=new CABLES.Timer();

playPause.onChange=setState;
setState();

function setState()
{
    if(playPause.get())
    {
        timer.play();
        op.patch.addOnAnimFrame(op);
    }
    else
    {
        timer.pause();
        op.patch.removeOnAnimFrame(op);
    }
}

reset.onTriggered=function()
{
    timer.setTime(0);
    outTime.set(0);
};

op.onAnimFrame=function()
{
    timer.update();
    outTime.set(timer.get()*inSpeed.get());

};


};

Ops.Anim.Timer.prototype = new CABLES.Op();
CABLES.OPS["65ae3c2e-90d7-48fe-93df-30245f0bcf34"]={f:Ops.Anim.Timer,objName:"Ops.Anim.Timer"};




// **************************************************************
// 
// Ops.Anim.RandomAnim
// 
// **************************************************************

Ops.Anim.RandomAnim = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var exe=op.inTrigger("exe");

var min=op.inValue("min",0);
var max=op.inValue("max",1);
var seed=op.inValue("random seed",0);

var duration=op.inValue("duration",0.5);
var pause=op.inValue("pause between",0);


var result=op.outValue("result");
var looped=op.outTrigger("Looped");

var anim=new CABLES.Anim();
anim.createPort(op,"easing",reinit);

op.setPortGroup("Timing",[duration,pause]);
op.setPortGroup("Value",[min,max,seed]);

op.toWorkPortsNeedToBeLinked(exe);

var counter=0;

min.onChange=
max.onChange=
pause.onChange=
seed.onChange=
duration.onChange=reinitLater;

var needsReinit=true;

function reinitLater()
{
    needsReinit=true;
}

function getRandom()
{
    var minVal = ( min.get() );
    return Math.seededRandom() * (  max.get()  - minVal ) + minVal;
}

function reinit()
{
    Math.randomSeed=seed.get()+counter*100;
    init(getRandom());
    needsReinit=false;
}

function init(v)
{
    anim.clear();

    anim.setValue(op.patch.freeTimer.get(), v);
    if(pause.get()!==0.0) anim.setValue(op.patch.freeTimer.get()+pause.get(), v);

    anim.setValue(duration.get()+op.patch.freeTimer.get()+pause.get(), getRandom());
}


exe.onTriggered=function()
{
    if(needsReinit)reinit();

    var t=op.patch.freeTimer.get();
    var v=anim.getValue(t);

    if(anim.hasEnded(t))
    {
        counter++;
        anim.clear();
        init(v);
        looped.trigger();
    }
    result.set(v);
};



};

Ops.Anim.RandomAnim.prototype = new CABLES.Op();
CABLES.OPS["2d2e5f0e-b69f-4789-9a48-1ee6ade5049a"]={f:Ops.Anim.RandomAnim,objName:"Ops.Anim.RandomAnim"};




// **************************************************************
// 
// Ops.Gl.Shader.MatCapMaterialNew
// 
// **************************************************************

Ops.Gl.Shader.MatCapMaterialNew = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={matcap_frag:"\n{{MODULES_HEAD}}\n\nIN vec3 norm;\nIN vec2 texCoord;\nUNI sampler2D tex;\nIN vec2 vNorm;\nUNI mat4 viewMatrix;\n\nUNI float repeatX;\nUNI float repeatY;\nUNI float opacity;\n\nUNI float r;\nUNI float g;\nUNI float b;\n\nIN vec3 e;\n\n\n\n#ifdef HAS_DIFFUSE_TEXTURE\n   UNI sampler2D texDiffuse;\n#endif\n\n#ifdef USE_SPECULAR_TEXTURE\n   UNI sampler2D texSpec;\n   UNI sampler2D texSpecMatCap;\n#endif\n\n#ifdef HAS_AO_TEXTURE\n    UNI sampler2D texAo;\n    UNI float aoIntensity;\n#endif\n\n#ifdef HAS_NORMAL_TEXTURE\n   IN vec3 vBiTangent;\n   IN vec3 vTangent;\n\n   UNI sampler2D texNormal;\n   UNI mat4 normalMatrix;\n   \n   vec2 vNormt;\n#endif\n\n#ifdef CALC_SSNORMALS\n    // from https://www.enkisoftware.com/devlogpost-20150131-1-Normal_generation_in_the_pixel_shader\n    IN vec3 eye_relative_pos;\n#endif\n\n\nconst float normalScale=0.4;\n\nconst vec2 invAtan = vec2(0.1591, 0.3183);\nvec2 sampleSphericalMap(vec3 direction)\n{\n    vec2 uv = vec2(atan(direction.z, direction.x), asin(direction.y));\n    uv *= invAtan;\n    uv += 0.5;\n    return uv;\n}\n\n\nvoid main()\n{\n    vec2 vnOrig=vNorm;\n    vec2 vn=vNorm;\n\n\n\n    #ifdef HAS_TEXTURES\n        vec2 texCoords=texCoord;\n        {{MODULE_BEGIN_FRAG}}\n    #endif\n\n    #ifdef CALC_SSNORMALS\n    \tvec3 dFdxPos = dFdx( eye_relative_pos );\n    \tvec3 dFdyPos = dFdy( eye_relative_pos );\n    \tvec3 ssn = normalize( cross(dFdxPos,dFdyPos ));\n    \t\n        vec3 rr = reflect( e, ssn );\n        float ssm = 2. * sqrt( \n            pow(rr.x, 2.0)+\n            pow(rr.y, 2.0)+\n            pow(rr.z + 1.0, 2.0)\n        );\n\n\n        vn = (rr.xy / ssm + 0.5);\n        \n        vn.t=clamp(vn.t, 0.0, 1.0);\n        vn.s=clamp(vn.s, 0.0, 1.0);\n        \n        // float dst = dot(abs(coord-center), vec2(1.0));\n        // float aaf = fwidth(dst);\n        // float alpha = smoothstep(radius - aaf, radius, dst);\n\n    #endif\n\n   #ifdef HAS_NORMAL_TEXTURE\n        vec3 tnorm=texture( texNormal, vec2(texCoord.x*repeatX,texCoord.y*repeatY) ).xyz * 2.0 - 1.0;\n        \n        tnorm = normalize(tnorm*normalScale);\n        \n        vec3 tangent;\n        vec3 binormal;\n        \n        #ifdef CALC_TANGENT\n            vec3 c1 = cross(norm, vec3(0.0, 0.0, 1.0));\n//            vec3 c2 = cross(norm, vec3(0.0, 1.0, 0.0));\n//            if(length(c1)>length(c2)) tangent = c2;\n//                else tangent = c1;\n            tangent = c1;\n            tangent = normalize(tangent);\n            binormal = cross(norm, tangent);\n            binormal = normalize(binormal);\n        #endif\n\n        #ifndef CALC_TANGENT\n            tangent=normalize(vTangent);\n//            tangent.y*=-13.0;\n//            binormal=vBiTangent*norm;\n//            binormal.z*=-1.0;\n//            binormal=normalize(binormal);\n            binormal=normalize( cross( normalize(norm), normalize(vBiTangent) ));\n        // vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );\n\n        #endif\n\n        tnorm=normalize(tangent*tnorm.x + binormal*tnorm.y + norm*tnorm.z);\n\n        // vec3 n = normalize( mat3(normalMatrix) * (norm+tnorm*normalScale) );\n        vec3 n = normalize( mat3(normalMatrix) * (norm+tnorm*normalScale) );\n\n        vec3 re = reflect( e, n );\n        float m = 2. * sqrt( \n            pow(re.x, 2.0)+\n            pow(re.y, 2.0)+\n            pow(re.z + 1.0, 2.0)\n        );\n        \n        vn = (re.xy / m + 0.5);\n        \n    #endif\n\n    vn.t=clamp(vn.t, 0.0, 1.0);\n    vn.s=clamp(vn.s, 0.0, 1.0);\n    \n    \n    vec4 col = texture( tex, vn );\n\n    #ifdef HAS_DIFFUSE_TEXTURE\n        col = col*texture( texDiffuse, vec2(texCoords.x*repeatX,texCoords.y*repeatY));\n    #endif\n\n    col.r*=r;\n    col.g*=g;\n    col.b*=b;\n\n\n    #ifdef HAS_AO_TEXTURE\n        col = col*\n            mix(\n                vec4(1.0,1.0,1.0,1.0),\n                texture( texAo, vec2(texCoords.x*repeatX,texCoords.y*repeatY)),\n                aoIntensity\n                );\n    #endif\n\n    #ifdef USE_SPECULAR_TEXTURE\n        vec4 spec = texture( texSpecMatCap, vn );\n        spec*= texture( texSpec, vec2(texCoords.x*repeatX,texCoords.y*repeatY) );\n        col+=spec;\n    #endif\n\n    col.a*=opacity;\n\n    {{MODULE_COLOR}}\n\n    outColor = col;\n\n}",matcap_vert:"\nIN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\nIN float attrVertIndex;\n\n#ifdef HAS_NORMAL_TEXTURE\n   IN vec3 attrTangent;\n   IN vec3 attrBiTangent;\n\n   OUT vec3 vBiTangent;\n   OUT vec3 vTangent;\n#endif\n\nOUT vec2 texCoord;\nOUT vec3 norm;\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\nOUT vec2 vNorm;\nOUT vec3 e;\n\n#ifndef INSTANCING\n    UNI mat4 normalMatrix;\n#endif\n\n\n{{MODULES_HEAD}}\n\n#ifdef CALC_SSNORMALS\n    // from https://www.enkisoftware.com/devlogpost-20150131-1-Normal_generation_in_the_pixel_shader\n    OUT vec3 eye_relative_pos;\n    UNI vec3 camPos;\n#endif\n\n\n\nvoid main()\n{\n    texCoord=attrTexCoord;\n    norm=attrVertNormal;\n    mat4 mMatrix=modelMatrix;\n    mat4 mvMatrix;\n    \n    #ifdef HAS_NORMAL_TEXTURE\n        vTangent=attrTangent;\n        vBiTangent=attrBiTangent;\n    #endif\n\n    vec4 pos = vec4( vPosition, 1. );\n\n    {{MODULE_VERTEX_POSITION}}\n\n\n    mvMatrix= viewMatrix * mMatrix;\n\n    #ifdef INSTANCING\n        mat4 normalMatrix=inverse(transpose(mvMatrix));\n    #endif\n    \n    e = normalize( vec3( mvMatrix * pos ) );\n    vec3 n = normalize( mat3(normalMatrix) * norm );\n    \n\n    // mat3 nMatrix = transpose(inverse(mat3(mMatrix)));\n    // vec3 n = normalize( mat3(nMatrix) * norm );\n    // norm=n;\n\n    vec3 r = reflect( e, n );\n    \n    \n    \n    \n    float m = 2. * sqrt(\n        pow(r.x, 2.0)+\n        pow(r.y, 2.0)+\n        pow(r.z + 1.0, 2.0)\n    );\n    vNorm = r.xy / m + 0.5;\n\n    #ifdef DO_PROJECT_COORDS_XY\n       texCoord=(projMatrix * mvMatrix*pos).xy*0.1;\n    #endif\n\n    #ifdef DO_PROJECT_COORDS_YZ\n       texCoord=(projMatrix * mvMatrix*pos).yz*0.1;\n    #endif\n\n    #ifdef DO_PROJECT_COORDS_XZ\n        texCoord=(projMatrix * mvMatrix*pos).xz*0.1;\n    #endif\n\n    #ifdef CALC_SSNORMALS\n        eye_relative_pos = (mvMatrix * pos ).xyz - camPos;\n    #endif\n\n\n\n   gl_Position = projMatrix * mvMatrix * pos;\n\n}",};
const render=op.inTrigger("render");
const textureMatcap=op.inTexture('MatCap');
const textureDiffuse=op.inTexture('Diffuse');
const textureNormal=op.inTexture('Normal');
const textureSpec=op.inTexture('Specular');
const textureSpecMatCap=op.inTexture('Specular MatCap');
const textureAo=op.inTexture('AO Texture');
const r=op.inValueSlider('r',1);
const g=op.inValueSlider('g',1);
const b=op.inValueSlider('b',1);
const pOpacity=op.inValueSlider("Opacity",1);
const aoIntensity=op.inValueSlider("AO Intensity",1.0);
const repeatX=op.inValue("Repeat X",1);
const repeatY=op.inValue("Repeat Y",1);
const calcTangents = op.inValueBool("calc normal tangents",true);
const projectCoords=op.inValueSelect('projectCoords',['no','xy','yz','xz'],'no');
const ssNormals=op.inValueBool("Screen Space Normals");
const next=op.outTrigger("trigger");
const shaderOut=op.outObject("Shader");

r.setUiAttribs({colorPick:true});
op.setPortGroup("Texture maps",[textureDiffuse,textureNormal,textureSpec,textureSpecMatCap,textureAo,]);
op.setPortGroup("Color",[r,g,b,pOpacity]);

const cgl=op.patch.cgl;
const shader=new CGL.Shader(cgl,'MatCapMaterialNew');
var uniOpacity=new CGL.Uniform(shader,'f','opacity',pOpacity);

shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);
shader.bindTextures=bindTextures;
shader.setSource(attachments.matcap_vert,attachments.matcap_frag);
shaderOut.set(shader);

var textureMatcapUniform=null;
var textureDiffuseUniform=null;
var textureNormalUniform=null;
var textureSpecUniform=null;
var textureSpecMatCapUniform=null;
var textureAoUniform=null;
var repeatXUniform=new CGL.Uniform(shader,'f','repeatX',repeatX);
var repeatYUniform=new CGL.Uniform(shader,'f','repeatY',repeatY);
var aoIntensityUniform=new CGL.Uniform(shader,'f','aoIntensity',aoIntensity);
b.uniform=new CGL.Uniform(shader,'f','b',b);
g.uniform=new CGL.Uniform(shader,'f','g',g);
r.uniform=new CGL.Uniform(shader,'f','r',r);


calcTangents.onChange=updateDefines;
updateDefines();
updateMatcap();

function updateDefines()
{
    if(calcTangents.get()) shader.define('CALC_TANGENT');
        else shader.removeDefine('CALC_TANGENT');

}

ssNormals.onChange=function()
{
    if(ssNormals.get())
    {
        if(cgl.glVersion<2)
        {
            cgl.gl.getExtension('OES_standard_derivatives');
            shader.enableExtension('GL_OES_standard_derivatives');
        }

        shader.define('CALC_SSNORMALS');
    }
    else shader.removeDefine('CALC_SSNORMALS');
};

projectCoords.onChange=function()
{
    shader.removeDefine('DO_PROJECT_COORDS_XY');
    shader.removeDefine('DO_PROJECT_COORDS_YZ');
    shader.removeDefine('DO_PROJECT_COORDS_XZ');

    if(projectCoords.get()=='xy') shader.define('DO_PROJECT_COORDS_XY');
    else if(projectCoords.get()=='yz') shader.define('DO_PROJECT_COORDS_YZ');
    else if(projectCoords.get()=='xz') shader.define('DO_PROJECT_COORDS_XZ');
};

textureMatcap.onChange=updateMatcap;

function updateMatcap()
{
    if(textureMatcap.get())
    {
        if(textureMatcapUniform!==null)return;
        shader.removeUniform('tex');
        textureMatcapUniform=new CGL.Uniform(shader,'t','tex',0);
    }
    else
    {
        if(!CGL.defaultTextureMap)
        {
            var pixels=new Uint8Array(256*4);
            for(var x=0;x<16;x++)
            {
                for(var y=0;y<16;y++)
                {
                    var c=y*16;
                    c*=Math.min(1,(x+y/3)/8);
                    pixels[(x+y*16)*4+0]=pixels[(x+y*16)*4+1]=pixels[(x+y*16)*4+2]=c;
                    pixels[(x+y*16)*4+3]=255;
                }
            }

            CGL.defaultTextureMap=new CGL.Texture(cgl);
            CGL.defaultTextureMap.initFromData(pixels,16,16);
        }
        textureMatcap.set(CGL.defaultTextureMap);

        shader.removeUniform('tex');
        textureMatcapUniform=new CGL.Uniform(shader,'t','tex',0);
    }
}

textureDiffuse.onChange=function()
{
    if(textureDiffuse.get())
    {
        if(textureDiffuseUniform!==null)return;
        shader.define('HAS_DIFFUSE_TEXTURE');
        shader.removeUniform('texDiffuse');
        textureDiffuseUniform=new CGL.Uniform(shader,'t','texDiffuse',1);
    }
    else
    {
        shader.removeDefine('HAS_DIFFUSE_TEXTURE');
        shader.removeUniform('texDiffuse');
        textureDiffuseUniform=null;
    }
};

textureNormal.onChange=function()
{
    if(textureNormal.get())
    {
        if(textureNormalUniform!==null)return;
        shader.define('HAS_NORMAL_TEXTURE');
        shader.removeUniform('texNormal');
        textureNormalUniform=new CGL.Uniform(shader,'t','texNormal',2);
    }
    else
    {
        shader.removeDefine('HAS_NORMAL_TEXTURE');
        shader.removeUniform('texNormal');
        textureNormalUniform=null;
    }
};

textureAo.onChange=function()
{
    if(textureAo.get())
    {
        if(textureAoUniform!==null)return;
        shader.define('HAS_AO_TEXTURE');
        shader.removeUniform('texAo');
        textureAoUniform=new CGL.Uniform(shader,'t','texAo',5);
    }
    else
    {
        shader.removeDefine('HAS_AO_TEXTURE');
        shader.removeUniform('texAo');
        textureAoUniform=null;
    }
};

textureSpec.onChange=textureSpecMatCap.onChange=function()
{
    if(textureSpec.get() && textureSpecMatCap.get())
    {
        if(textureSpecUniform!==null)return;
        shader.define('USE_SPECULAR_TEXTURE');
        shader.removeUniform('texSpec');
        shader.removeUniform('texSpecMatCap');
        textureSpecUniform=new CGL.Uniform(shader,'t','texSpec',3);
        textureSpecMatCapUniform=new CGL.Uniform(shader,'t','texSpecMatCap',4);
    }
    else
    {
        shader.removeDefine('USE_SPECULAR_TEXTURE');
        shader.removeUniform('texSpec');
        shader.removeUniform('texSpecMatCap');
        textureSpecUniform=null;
        textureSpecMatCapUniform=null;
    }
};

function bindTextures()
{
    if(textureMatcap.get())     cgl.setTexture(0,textureMatcap.get().tex);
    if(textureDiffuse.get())    cgl.setTexture(1,textureDiffuse.get().tex);
    if(textureNormal.get())     cgl.setTexture(2,textureNormal.get().tex);
    if(textureSpec.get())       cgl.setTexture(3,textureSpec.get().tex);
    if(textureSpecMatCap.get()) cgl.setTexture(4,textureSpecMatCap.get().tex);
    if(textureAo.get())         cgl.setTexture(5,textureAo.get().tex);
};

op.onDelete=function()
{
    if(CGL.defaultTextureMap)
    {
        CGL.defaultTextureMap.delete();
        CGL.defaultTextureMap=null;
    }
};

op.preRender=function()
{
    shader.bind();
};

render.onTriggered=function()
{
    shader.bindTextures=bindTextures;
    cgl.setShader(shader);
    next.trigger();
    cgl.setPreviousShader();
};



};

Ops.Gl.Shader.MatCapMaterialNew.prototype = new CABLES.Op();
CABLES.OPS["7857ee9e-6d60-4c30-9bc0-dfdddf2b47ad"]={f:Ops.Gl.Shader.MatCapMaterialNew,objName:"Ops.Gl.Shader.MatCapMaterialNew"};




// **************************************************************
// 
// Ops.Exp.Gl.DeviceOrientationCamera
// 
// **************************************************************

Ops.Exp.Gl.DeviceOrientationCamera = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

var render=op.inTrigger("Render");
var next=op.outTrigger("Next");
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





// **************************************************************
// 
// Ops.Anim.SineAnim
// 
// **************************************************************

Ops.Anim.SineAnim = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTrigger("exe"),
    result=op.outValue("result"),
    phase=op.inValueFloat("phase",0),
    mul=op.inValueFloat("frequency",1),
    amplitude=op.inValueFloat("amplitude",1);

op.toWorkPortsNeedToBeLinked(exe);

exe.onTriggered=exec;
exec();

function exec()
{
    result.set( amplitude.get() * Math.sin( (op.patch.freeTimer.get()*mul.get()) + phase.get() ));
}



};

Ops.Anim.SineAnim.prototype = new CABLES.Op();
CABLES.OPS["736d3d0e-c920-449e-ade0-f5ca6018fb5c"]={f:Ops.Anim.SineAnim,objName:"Ops.Anim.SineAnim"};




// **************************************************************
// 
// Ops.Math.Sum
// 
// **************************************************************

Ops.Math.Sum = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    number1=op.inValueFloat("number1",1),
    number2=op.inValueFloat("number2",1),
    result=op.outValue("result");

number1.onChange=
number2.onChange=exec;

function exec()
{
    var v=number1.get()+number2.get();
    if(!isNaN(v)) result.set( v );
}



};

Ops.Math.Sum.prototype = new CABLES.Op();
CABLES.OPS["c8fb181e-0b03-4b41-9e55-06b6267bc634"]={f:Ops.Math.Sum,objName:"Ops.Math.Sum"};




// **************************************************************
// 
// Ops.Gl.ShaderEffects.VertexDisplacementMap
// 
// **************************************************************

Ops.Gl.ShaderEffects.VertexDisplacementMap = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var cgl=op.patch.cgl;
var id='mod'+Math.floor(Math.random()*10000);

op.render=op.addInPort(new CABLES.Port(this,"render",CABLES.OP_PORT_TYPE_FUNCTION));
op.trigger=op.addOutPort(new CABLES.Port(this,"trigger",CABLES.OP_PORT_TYPE_FUNCTION));

var texture=this.addInPort(new CABLES.Port(this,"texture",CABLES.OP_PORT_TYPE_TEXTURE));

var extrude=op.inValue("extrude",0.5);//addInPort(new CABLES.Port(this,"extrude",CABLES.OP_PORT_TYPE_VALUE));

var flip=op.inValueBool("flip",true);

var removeZero=op.addInPort(new CABLES.Port(this,"Ignore Zero Values",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));

var invert=op.addInPort(new CABLES.Port(this,"invert",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
invert.set(false);
var offsetX=op.addInPort(new CABLES.Port(this,"offset X",CABLES.OP_PORT_TYPE_VALUE));
var offsetY=op.addInPort(new CABLES.Port(this,"offset Y",CABLES.OP_PORT_TYPE_VALUE));

var colorize=op.addInPort(new CABLES.Port(this,"colorize",CABLES.OP_PORT_TYPE_VALUE,{display:'bool'}));
var colorizeAdd=op.addInPort(new CABLES.Port(this,"colorize add",CABLES.OP_PORT_TYPE_VALUE,{display:'range'}));
colorize.set(false);

function updateColorize()
{
    if(shader)
        if(colorize.get()) shader.define(id+'HEIGHTMAP_COLORIZE');
            else shader.removeDefine(id+'HEIGHTMAP_COLORIZE');
}

function updateInvert()
{
    if(shader)
        if(invert.get()) shader.define(id+'HEIGHTMAP_INVERT');
            else shader.removeDefine(id+'HEIGHTMAP_INVERT');
}

colorize.onChange=updateColorize;
invert.onChange=updateInvert;

var meth=op.addInPort(new CABLES.Port(this,"mode",CABLES.OP_PORT_TYPE_VALUE,{display:'dropdown',
    values:['normal','mul xyz','add z','add y','mul y','sub z']}));


removeZero.onChange=updateRemoveZero;

function updateRemoveZero()
{
    if(shader)
        if(removeZero.get()) shader.define(id+'DISPLACE_REMOVE_ZERO');
            else shader.removeDefine(id+'DISPLACE_REMOVE_ZERO');
}

var updateMethod=function()
{
    if(shader)
    {
        if(flip.get()) shader.define(id+'FLIPY');
            else shader.removeDefine(id+'FLIPY');

        shader.removeDefine(id+'DISPLACE_METH_MULXYZ');
        shader.removeDefine(id+'DISPLACE_METH_ADDZ');
        shader.removeDefine(id+'DISPLACE_METH_ADDY');
        shader.removeDefine(id+'DISPLACE_METH_NORMAL');

        if(meth.get()=='mul xyz') shader.define(id+'DISPLACE_METH_MULXYZ');
        if(meth.get()=='add z') shader.define(id+'DISPLACE_METH_ADDZ');
        if(meth.get()=='add y') shader.define(id+'DISPLACE_METH_ADDY');
        if(meth.get()=='mul y') shader.define(id+'DISPLACE_METH_MULY');
        if(meth.get()=='normal') shader.define(id+'DISPLACE_METH_NORMAL');

        updateRemoveZero();
    }
};

flip.onChange=updateMethod;
meth.onChange=updateMethod;
meth.set('normal');

var shader=null;
var uniExtrude,uniTexture;


var srcHeadVert=''
    .endl()+'UNI float {{mod}}_extrude;'
    .endl()+'UNI sampler2D {{mod}}_texture;'
    .endl()+'UNI float {{mod}}_offsetX;'
    .endl()+'UNI float {{mod}}_offsetY;'

    .endl()+'OUT float '+id+'displHeightMapColor;'
    .endl();

var srcBodyVert=''


    .endl()+'vec2 {{mod}}tc=texCoord;'
    // .endl()+'vec2 {{mod}}tc=vec2(pos.x,pos.y);'

    .endl()+'#ifdef '+id+'FLIPY'
    .endl()+'    {{mod}}tc.y=1.0-{{mod}}tc.y;'
    .endl()+'#endif'


    .endl()+'float {{mod}}_texVal=texture2D( {{mod}}_texture, vec2({{mod}}tc.x+{{mod}}_offsetX,{{mod}}tc.y+{{mod}}_offsetY) ).b;'

    .endl()+'#ifdef '+id+'HEIGHTMAP_INVERT'
    .endl()+'{{mod}}_texVal=1.0-{{mod}}_texVal;'
    .endl()+'#endif'

    .endl()+'#ifdef '+id+'DISPLACE_METH_MULXYZ'
    .endl()+'   {{mod}}_texVal+=1.0;'
    .endl()+'   pos.xyz *= {{mod}}_texVal * {{mod}}_extrude;'
    // .endl()+'   norm=normalize(norm+normalize(pos.xyz+vec3({{mod}}_texVal)* {{mod}}_extrude));'
    .endl()+'#endif'

    .endl()+'#ifdef '+id+'DISPLACE_METH_ADDZ'
    .endl()+'   pos.z+=({{mod}}_texVal * {{mod}}_extrude);'
    .endl()+'#endif'

    .endl()+'#ifdef '+id+'DISPLACE_METH_ADDY'
    .endl()+'   pos.y+=({{mod}}_texVal * {{mod}}_extrude);'
    // .endl()+'norm=normalize(norm+normalize(vec3(0.0,0.0+({{mod}}_texVal ),0.0)));'
    .endl()+'#endif'


    .endl()+'#ifdef '+id+'DISPLACE_METH_MULY'
    .endl()+'   pos.y+=(({{mod}}_texVal-0.5) * {{mod}}_extrude);'
    .endl()+'#endif'

    .endl()+'#ifdef '+id+'DISPLACE_METH_NORMAL'
    .endl()+'   pos.xyz+=norm*{{mod}}_texVal*{{mod}}_extrude;'
    .endl()+'#endif'


    .endl()+''+id+'displHeightMapColor={{mod}}_texVal;'

    .endl();

var srcHeadFrag=''
    .endl()+'UNI float {{mod}}_colorizeAdd;'
    .endl()+'IN float '+id+'displHeightMapColor;'
    .endl()+'UNI sampler2D {{mod}}_texture;'
    // .endl()+'IN vec3 vViewPosition;'

    .endl();

var srcBodyFrag=''

    .endl()+'#ifdef '+id+'HEIGHTMAP_COLORIZE'
    .endl()+'   col.rgb*='+id+'displHeightMapColor*(1.0-{{mod}}_colorizeAdd);'
    .endl()+'   col+={{mod}}_colorizeAdd;'
    .endl()+'#endif'

    .endl()+'#ifdef '+id+'DISPLACE_REMOVE_ZERO'
    .endl()+'if('+id+'displHeightMapColor==0.0)discard;'
    .endl()+'#endif'
    .endl();


var moduleFrag=null;
var moduleVert=null;

function removeModule()
{
    if(shader && moduleFrag) shader.removeModule(moduleFrag);
    if(shader && moduleVert) shader.removeModule(moduleVert);
    shader=null;
}


var uniTexture=null;
var uniTextureFrag=null;
var uniExtrude=null;
var uniOffsetX=null;
var uniOffsetY=null;
var uniColorizeAdd=null;

op.render.onLinkChanged=removeModule;

op.render.onTriggered=function()
{
    if(!cgl.getShader())
    {
         op.trigger.trigger();
         return;
    }


    if(cgl.getShader()!=shader)
    {
        if(shader) removeModule();


        // console.log('re init shader module vertexdisplacement');

        shader=cgl.getShader();


        moduleVert=shader.addModule(
            {
                title:op.objName,
                name:'MODULE_VERTEX_POSITION',
                srcHeadVert:srcHeadVert,
                srcBodyVert:srcBodyVert
            });

        uniTexture=new CGL.Uniform(shader,'t',moduleVert.prefix+'_texture',0);
        uniExtrude=new CGL.Uniform(shader,'f',moduleVert.prefix+'_extrude',extrude);
        uniOffsetX=new CGL.Uniform(shader,'f',moduleVert.prefix+'_offsetX',offsetX);
        uniOffsetY=new CGL.Uniform(shader,'f',moduleVert.prefix+'_offsetY',offsetY);

        moduleFrag=shader.addModule(
            {
                title:op.objName,
                name:'MODULE_COLOR',
                srcHeadFrag:srcHeadFrag,
                srcBodyFrag:srcBodyFrag
            });
        uniTextureFrag=new CGL.Uniform(shader,'t',moduleFrag.prefix+'_texture',0);
        uniColorizeAdd=new CGL.Uniform(shader,'f',moduleFrag.prefix+'_colorizeAdd',colorizeAdd);

        updateMethod();
        updateInvert();
        updateColorize();
    }


    if(!shader)return;
    var texSlot=moduleVert.num+5;

    if(texture.get())
    {
        uniTexture.setValue(texSlot);
        uniTextureFrag.setValue(texSlot);

        cgl.setTexture(0+texSlot,texture.get().tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, texture.get().tex);
    }

    op.trigger.trigger();
};


};

Ops.Gl.ShaderEffects.VertexDisplacementMap.prototype = new CABLES.Op();
CABLES.OPS["94ffa0de-2926-4d02-842e-a1ad6f5846c2"]={f:Ops.Gl.ShaderEffects.VertexDisplacementMap,objName:"Ops.Gl.ShaderEffects.VertexDisplacementMap"};




// **************************************************************
// 
// Ops.Anim.RelativeTime
// 
// **************************************************************

Ops.Anim.RelativeTime = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTrigger("exe"),
    mul=op.inValue("Multiply",1),
    result=op.outValue("result");

exe.onTriggered=update;
update();

function update()
{
    result.set( op.patch.freeTimer.get()*mul.get() );
}



};

Ops.Anim.RelativeTime.prototype = new CABLES.Op();
CABLES.OPS["917df27b-7cc3-465f-986d-bcf5a7e125a7"]={f:Ops.Anim.RelativeTime,objName:"Ops.Anim.RelativeTime"};




// **************************************************************
// 
// Ops.Gl.TextureEffects.Noise.PerlinNoise
// 
// **************************************************************

Ops.Gl.TextureEffects.Noise.PerlinNoise = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={perlinnoise3d_frag:"UNI float z;\nUNI float x;\nUNI float y;\nUNI float scale;\nIN vec2 texCoord;\nUNI sampler2D tex;\n\nUNI float amount;\n\n{{BLENDCODE}}\n\n\nfloat Interpolation_C2( float x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }   //  6x^5-15x^4+10x^3\t( Quintic Curve.  As used by Perlin in Improved Noise.  http://mrl.nyu.edu/~perlin/paper445.pdf )\nvec2 Interpolation_C2( vec2 x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }\nvec3 Interpolation_C2( vec3 x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }\nvec4 Interpolation_C2( vec4 x ) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }\nvec4 Interpolation_C2_InterpAndDeriv( vec2 x ) { return x.xyxy * x.xyxy * ( x.xyxy * ( x.xyxy * ( x.xyxy * vec2( 6.0, 0.0 ).xxyy + vec2( -15.0, 30.0 ).xxyy ) + vec2( 10.0, -60.0 ).xxyy ) + vec2( 0.0, 30.0 ).xxyy ); }\nvec3 Interpolation_C2_Deriv( vec3 x ) { return x * x * (x * (x * 30.0 - 60.0) + 30.0); }\n\n\nvoid FAST32_hash_3D( \tvec3 gridcell,\n                        out vec4 lowz_hash_0,\n                        out vec4 lowz_hash_1,\n                        out vec4 lowz_hash_2,\n                        out vec4 highz_hash_0,\n                        out vec4 highz_hash_1,\n                        out vec4 highz_hash_2\t)\t\t//\tgenerates 3 random numbers for each of the 8 cell corners\n{\n    //    gridcell is assumed to be an integer coordinate\n\n    //\tTODO: \tthese constants need tweaked to find the best possible noise.\n    //\t\t\tprobably requires some kind of brute force computational searching or something....\n    const vec2 OFFSET = vec2( 50.0, 161.0 );\n    const float DOMAIN = 69.0;\n    const vec3 SOMELARGEFLOATS = vec3( 635.298681, 682.357502, 668.926525 );\n    const vec3 ZINC = vec3( 48.500388, 65.294118, 63.934599 );\n\n    //\ttruncate the domain\n    gridcell.xyz = gridcell.xyz - floor(gridcell.xyz * ( 1.0 / DOMAIN )) * DOMAIN;\n    vec3 gridcell_inc1 = step( gridcell, vec3( DOMAIN - 1.5 ) ) * ( gridcell + 1.0 );\n\n    //\tcalculate the noise\n    vec4 P = vec4( gridcell.xy, gridcell_inc1.xy ) + OFFSET.xyxy;\n    P *= P;\n    P = P.xzxz * P.yyww;\n    vec3 lowz_mod = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + gridcell.zzz * ZINC.xyz ) );\n    vec3 highz_mod = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + gridcell_inc1.zzz * ZINC.xyz ) );\n    lowz_hash_0 = fract( P * lowz_mod.xxxx );\n    highz_hash_0 = fract( P * highz_mod.xxxx );\n    lowz_hash_1 = fract( P * lowz_mod.yyyy );\n    highz_hash_1 = fract( P * highz_mod.yyyy );\n    lowz_hash_2 = fract( P * lowz_mod.zzzz );\n    highz_hash_2 = fract( P * highz_mod.zzzz );\n}\n\n//\n//\tPerlin Noise 3D  ( gradient noise )\n//\tReturn value range of -1.0->1.0\n//\thttp://briansharpe.files.wordpress.com/2011/11/perlinsample.jpg\n//\nfloat Perlin3D( vec3 P )\n{\n    //\testablish our grid cell and unit position\n    vec3 Pi = floor(P);\n    vec3 Pf = P - Pi;\n    vec3 Pf_min1 = Pf - 1.0;\n\n#if 1\n    //\n    //\tclassic noise.\n    //\trequires 3 random values per point.  with an efficent hash function will run faster than improved noise\n    //\n\n    //\tcalculate the hash.\n    //\t( various hashing methods listed in order of speed )\n    vec4 hashx0, hashy0, hashz0, hashx1, hashy1, hashz1;\n    FAST32_hash_3D( Pi, hashx0, hashy0, hashz0, hashx1, hashy1, hashz1 );\n    //SGPP_hash_3D( Pi, hashx0, hashy0, hashz0, hashx1, hashy1, hashz1 );\n\n    //\tcalculate the gradients\n    vec4 grad_x0 = hashx0 - 0.49999;\n    vec4 grad_y0 = hashy0 - 0.49999;\n    vec4 grad_z0 = hashz0 - 0.49999;\n    vec4 grad_x1 = hashx1 - 0.49999;\n    vec4 grad_y1 = hashy1 - 0.49999;\n    vec4 grad_z1 = hashz1 - 0.49999;\n    vec4 grad_results_0 = inversesqrt( grad_x0 * grad_x0 + grad_y0 * grad_y0 + grad_z0 * grad_z0 ) * ( vec2( Pf.x, Pf_min1.x ).xyxy * grad_x0 + vec2( Pf.y, Pf_min1.y ).xxyy * grad_y0 + Pf.zzzz * grad_z0 );\n    vec4 grad_results_1 = inversesqrt( grad_x1 * grad_x1 + grad_y1 * grad_y1 + grad_z1 * grad_z1 ) * ( vec2( Pf.x, Pf_min1.x ).xyxy * grad_x1 + vec2( Pf.y, Pf_min1.y ).xxyy * grad_y1 + Pf_min1.zzzz * grad_z1 );\n\n#if 1\n    //\tClassic Perlin Interpolation\n    vec3 blend = Interpolation_C2( Pf );\n    vec4 res0 = mix( grad_results_0, grad_results_1, blend.z );\n    vec4 blend2 = vec4( blend.xy, vec2( 1.0 - blend.xy ) );\n    float final = dot( res0, blend2.zxzx * blend2.wwyy );\n    final *= 1.1547005383792515290182975610039;\t\t//\t(optionally) scale things to a strict -1.0->1.0 range    *= 1.0/sqrt(0.75)\n    return final;\n#else\n    //\tClassic Perlin Surflet\n    //\thttp://briansharpe.wordpress.com/2012/03/09/modifications-to-classic-perlin-noise/\n    Pf *= Pf;\n    Pf_min1 *= Pf_min1;\n    vec4 vecs_len_sq = vec4( Pf.x, Pf_min1.x, Pf.x, Pf_min1.x ) + vec4( Pf.yy, Pf_min1.yy );\n    float final = dot( Falloff_Xsq_C2( min( vec4( 1.0 ), vecs_len_sq + Pf.zzzz ) ), grad_results_0 ) + dot( Falloff_Xsq_C2( min( vec4( 1.0 ), vecs_len_sq + Pf_min1.zzzz ) ), grad_results_1 );\n    final *= 2.3703703703703703703703703703704;\t\t//\t(optionally) scale things to a strict -1.0->1.0 range    *= 1.0/cube(0.75)\n    return final;\n#endif\n\n#else\n    //\n    //\timproved noise.\n    //\trequires 1 random value per point.  Will run faster than classic noise if a slow hashing function is used\n    //\n\n    //\tcalculate the hash.\n    //\t( various hashing methods listed in order of speed )\n    vec4 hash_lowz, hash_highz;\n    FAST32_hash_3D( Pi, hash_lowz, hash_highz );\n    //BBS_hash_3D( Pi, hash_lowz, hash_highz );\n    //SGPP_hash_3D( Pi, hash_lowz, hash_highz );\n\n    //\n    //\t\"improved\" noise using 8 corner gradients.  Faster than the 12 mid-edge point method.\n    //\tKen mentions using diagonals like this can cause \"clumping\", but we'll live with that.\n    //\t[1,1,1]  [-1,1,1]  [1,-1,1]  [-1,-1,1]\n    //\t[1,1,-1] [-1,1,-1] [1,-1,-1] [-1,-1,-1]\n    //\n    hash_lowz -= 0.5;\n    vec4 grad_results_0_0 = vec2( Pf.x, Pf_min1.x ).xyxy * sign( hash_lowz );\n    hash_lowz = abs( hash_lowz ) - 0.25;\n    vec4 grad_results_0_1 = vec2( Pf.y, Pf_min1.y ).xxyy * sign( hash_lowz );\n    vec4 grad_results_0_2 = Pf.zzzz * sign( abs( hash_lowz ) - 0.125 );\n    vec4 grad_results_0 = grad_results_0_0 + grad_results_0_1 + grad_results_0_2;\n\n    hash_highz -= 0.5;\n    vec4 grad_results_1_0 = vec2( Pf.x, Pf_min1.x ).xyxy * sign( hash_highz );\n    hash_highz = abs( hash_highz ) - 0.25;\n    vec4 grad_results_1_1 = vec2( Pf.y, Pf_min1.y ).xxyy * sign( hash_highz );\n    vec4 grad_results_1_2 = Pf_min1.zzzz * sign( abs( hash_highz ) - 0.125 );\n    vec4 grad_results_1 = grad_results_1_0 + grad_results_1_1 + grad_results_1_2;\n\n    //\tblend the gradients and return\n    vec3 blend = Interpolation_C2( Pf );\n    vec4 res0 = mix( grad_results_0, grad_results_1, blend.z );\n    vec4 blend2 = vec4( blend.xy, vec2( 1.0 - blend.xy ) );\n    return dot( res0, blend2.zxzx * blend2.wwyy ) * (2.0 / 3.0);\t//\t(optionally) mult by (2.0/3.0) to scale to a strict -1.0->1.0 range\n#endif\n}\n\nvoid main()\n{\n    vec4 base=texture(tex,texCoord);\n    vec2 p=vec2(texCoord.x-0.5,texCoord.y-0.5);\n\n    p=p*scale;\n    p=vec2(p.x+0.5-x,p.y+0.5-y);\n\n    float aa=texture(tex,texCoord).r;\n    float v=Perlin3D(vec3(p.x,p.y,z))*0.5+0.5;\n\n\n    vec4 col=vec4(v,v,v,1.0);\n\n    col=vec4( _blend(base.rgb,col.rgb) ,1.0);\n    col=vec4( mix( col.rgb, base.rgb ,1.0-base.a*amount),1.0);\n\n    outColor= col;\n}\n",};
const
    render=op.inTrigger("render"),
    blendMode=CGL.TextureEffect.AddBlendSelect(op,"Blend Mode","normal"),
    amount=op.inValueSlider("Amount",1),
    scale=op.inValue("Scale",22),
    x=op.inValue("X",0),
    y=op.inValue("Y",0),
    z=op.inValue("Z",0),
    trigger=op.outTrigger("trigger");

const cgl=op.patch.cgl;
const shader=new CGL.Shader(cgl);
const srcFrag=attachments.perlinnoise3d_frag.replace('{{BLENDCODE}}',CGL.TextureEffect.getBlendCode());

op.setPortGroup("Position",[x,y,z]);

shader.setSource(shader.getDefaultVertexShader(),srcFrag );

const
    textureUniform=new CGL.Uniform(shader,'t','tex',0),
    uniZ=new CGL.Uniform(shader,'f','z',z),
    uniX=new CGL.Uniform(shader,'f','x',x),
    uniY=new CGL.Uniform(shader,'f','y',y),
    uniScale=new CGL.Uniform(shader,'f','scale',scale),
    amountUniform=new CGL.Uniform(shader,'f','amount',amount);

CGL.TextureEffect.setupBlending(op,shader,blendMode,amount);

render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Noise.PerlinNoise.prototype = new CABLES.Op();
CABLES.OPS["446442ba-1a7e-4c71-bb43-b12005aa6511"]={f:Ops.Gl.TextureEffects.Noise.PerlinNoise,objName:"Ops.Gl.TextureEffects.Noise.PerlinNoise"};


