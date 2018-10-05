"use strict";

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Math=Ops.Math || {};
Ops.Devices=Ops.Devices || {};
Ops.Boolean=Ops.Boolean || {};
Ops.WebAudio=Ops.WebAudio || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Textures=Ops.Gl.Textures || {};
Ops.WebAudio.Lib=Ops.WebAudio.Lib || {};
Ops.Devices.Mouse=Ops.Devices.Mouse || {};
Ops.Gl.ShaderEffects=Ops.Gl.ShaderEffects || {};
Ops.WebAudio.Lib.Tonejs=Ops.WebAudio.Lib.Tonejs || {};
Ops.WebAudio.Lib.Tonejs.Source=Ops.WebAudio.Lib.Tonejs.Source || {};
Ops.WebAudio.Lib.Tonejs.Effect=Ops.WebAudio.Lib.Tonejs.Effect || {};

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
// Ops.Gl.ShaderEffects.VertexDisplacementMap
// 
// **************************************************************

Ops.Gl.ShaderEffects.VertexDisplacementMap = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var cgl=op.patch.cgl;
var id='mod'+Math.floor(Math.random()*10000);

op.render=op.addInPort(new Port(this,"render",OP_PORT_TYPE_FUNCTION));
op.trigger=op.addOutPort(new Port(this,"trigger",OP_PORT_TYPE_FUNCTION));

var texture=this.addInPort(new Port(this,"texture",OP_PORT_TYPE_TEXTURE));

var extrude=op.inValue("extrude",0.5);//addInPort(new Port(this,"extrude",OP_PORT_TYPE_VALUE));

var flip=op.inValueBool("flip",true);

var removeZero=op.addInPort(new Port(this,"Ignore Zero Values",OP_PORT_TYPE_VALUE,{display:'bool'}));

var invert=op.addInPort(new Port(this,"invert",OP_PORT_TYPE_VALUE,{display:'bool'}));
invert.set(false);
var offsetX=op.addInPort(new Port(this,"offset X",OP_PORT_TYPE_VALUE));
var offsetY=op.addInPort(new Port(this,"offset Y",OP_PORT_TYPE_VALUE));

var colorize=op.addInPort(new Port(this,"colorize",OP_PORT_TYPE_VALUE,{display:'bool'}));
var colorizeAdd=op.addInPort(new Port(this,"colorize add",OP_PORT_TYPE_VALUE,{display:'range'}));
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

colorize.onValueChanged=updateColorize;
invert.onValueChanged=updateInvert;

var meth=op.addInPort(new Port(this,"mode",OP_PORT_TYPE_VALUE,{display:'dropdown',
    values:['normal','mul xyz','add z','add y','mul y','sub z']}));


removeZero.onValueChanged=updateRemoveZero;

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

flip.onValueChanged=updateMethod;
meth.onValueChanged=updateMethod;
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

        /* --- */cgl.setTexture(0+texSlot,texture.get().tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, texture.get().tex);
    }

    op.trigger.trigger();
};


};

Ops.Gl.ShaderEffects.VertexDisplacementMap.prototype = new CABLES.Op();

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
// Ops.Devices.Mouse.Mouse
// 
// **************************************************************

Ops.Devices.Mouse.Mouse = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var outMouseX=op.addOutPort(new Port(op,"x",OP_PORT_TYPE_VALUE));
var outMouseY=op.addOutPort(new Port(op,"y",OP_PORT_TYPE_VALUE));
var mouseDown=op.addOutPort(new Port(op,"button down",OP_PORT_TYPE_VALUE));
var mouseClick=op.addOutPort(new Port(op,"click",OP_PORT_TYPE_FUNCTION));
var mouseUp=op.addOutPort(new Port(op,"Button Up",OP_PORT_TYPE_FUNCTION));
var mouseClickRight=op.addOutPort(new Port(op,"click right",OP_PORT_TYPE_FUNCTION));
var mouseOver=op.addOutPort(new Port(op,"mouseOver",OP_PORT_TYPE_VALUE));
var relative=op.addInPort(new Port(op,"relative",OP_PORT_TYPE_VALUE,{display:'bool'}));
var normalize=op.addInPort(new Port(op,"normalize",OP_PORT_TYPE_VALUE,{display:'bool'}));
var active=op.inValueBool("Active",true);
var smooth=op.addInPort(new Port(op,"smooth",OP_PORT_TYPE_VALUE,{display:'bool'}));
var smoothSpeed=op.addInPort(new Port(op,"smoothSpeed",OP_PORT_TYPE_VALUE));
var area=op.addInPort(new Port(op,"Area",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['Canvas','Document','Parent Element']}));
var outButton=op.addOutPort(new Port(op,"button",OP_PORT_TYPE_VALUE));
var multiply=op.addInPort(new Port(op,"multiply",OP_PORT_TYPE_VALUE));
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

smooth.onValueChanged=function()
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

area.onValueChanged=addListeners;

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
// Ops.Math.MapRange
// 
// **************************************************************

Ops.Math.MapRange = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var result=op.addOutPort(new Port(op,"result"));
var v=op.addInPort(new Port(op,"value"));
var old_min=op.addInPort(new Port(op,"old min"));
var old_max=op.addInPort(new Port(op,"old max"));
var new_min=op.addInPort(new Port(op,"new min"));
var new_max=op.addInPort(new Port(op,"new max"));
var easing=op.inValueSelect("Easing",["Linear","Smoothstep","Smootherstep"],"Linear");

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


v.onValueChanged=exec;
old_min.onValueChanged=exec;
old_max.onValueChanged=exec;
new_min.onValueChanged=exec;
new_max.onValueChanged=exec;

result.set(0);

exec();

};

Ops.Math.MapRange.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.WebAudio.Output
// 
// **************************************************************

Ops.WebAudio.Output = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='audioOutput';
op.requirements=[CABLES.Requirements.WEBAUDIO];

var audioCtx = CABLES.WEBAUDIO.createAudioContext(op);

// constants
var VOLUME_DEFAULT = 1;
var VOLUME_MIN = 0;
var VOLUME_MAX = 1;

// vars
var gainNode = audioCtx.createGain();
var destinationNode = audioCtx.destination;
gainNode.connect(destinationNode);
var masterVolume = 1;

// inputs
var audioInPort = CABLES.WEBAUDIO.createAudioInPort(op, "Audio In", gainNode);
var volumePort = op.inValueSlider("Volume", VOLUME_DEFAULT);
var mutePort = op.inValueBool("Mute", false);

// functions
// sets the volume, multiplied by master volume
function setVolume() {
    var volume = volumePort.get() * masterVolume;
    if(volume >= VOLUME_MIN && volume <= VOLUME_MAX) {
        // gainNode.gain.value = volume;
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    } else {
        // gainNode.gain.value = VOLUME_DEFAULT * masterVolume;
        gainNode.gain.setValueAtTime(VOLUME_DEFAULT * masterVolume, audioCtx.currentTime);
    }
}

function mute(b) {
    if(b) {
        // gainNode.gain.value = 0;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    } else {
        setVolume();
    }
}

// change listeners
mutePort.onChange = function() {
    mute(mutePort.get());
};

volumePort.onChange = function() {
    if(mutePort.get()) {
        return;
    }
    setVolume();
};

op.onMasterVolumeChanged = function(v) {
    masterVolume = v;
    setVolume();
};




};

Ops.WebAudio.Output.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Boolean.Or
// 
// **************************************************************

Ops.Boolean.Or = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var bool0=op.addInPort(new Port(op,"bool 1",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool1=op.addInPort(new Port(op,"bool 2",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool2=op.addInPort(new Port(op,"bool 3",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool3=op.addInPort(new Port(op,"bool 4",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool4=op.addInPort(new Port(op,"bool 5",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool5=op.addInPort(new Port(op,"bool 6",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool6=op.addInPort(new Port(op,"bool 7",OP_PORT_TYPE_VALUE,{display:'bool'}));
var bool7=op.addInPort(new Port(op,"bool 8",OP_PORT_TYPE_VALUE,{display:'bool'}));

var result=op.addOutPort(new Port(op,"result",OP_PORT_TYPE_VALUE));

function exec()
{
    result.set( bool0.get() || bool1.get()  || bool2.get() || bool3.get() || bool4.get() || bool5.get() || bool6.get() || bool7.get() );
}

bool0.onValueChange(exec);
bool1.onValueChange(exec);
bool2.onValueChange(exec);
bool3.onValueChange(exec);
bool4.onValueChange(exec);
bool5.onValueChange(exec);
bool6.onValueChange(exec);
bool7.onValueChange(exec);



};

Ops.Boolean.Or.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.WebAudio.Lib.Tonejs.Source.AmOscillator
// 
// **************************************************************

Ops.WebAudio.Lib.Tonejs.Source.AmOscillator = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name="AmOscillator";

CABLES.WEBAUDIO.createAudioContext(op);

// constants
var FREQUENCY_DEFAULT = 440;
var DETUNE_DEFAULT = 0;
var PHASE_DEFAULT = 0;
var PHASE_MIN = 0;
var PHASE_MAX = 180;
var MODULATION_TYPE_DEFAULT = "square";
var HARMONICITY_DEFAULT = 1;
var VOLUME_DEFAULT = -6;
var MUTE_DEFAULT = false;
var SYNC_FREQUENCY_DEFAULT = false;
var START_DEFAULT = true;
var START_TIME_DEFAULT = "+0";
var STOP_TIME_DEFAULT = "+0";
var AUTO_START_DEFAULT = true;
var TYPES = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
];
var TYPE_DEFAULT = "sine";

// vars
var node = new Tone.AMOscillator();

// inputs
var frequencyPort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Frequency", node.frequency, null, FREQUENCY_DEFAULT);
var detunePort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Detune", node.detune, null, DETUNE_DEFAULT);
var harmonicityPort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Harmonicity", node.harmonicity, null, HARMONICITY_DEFAULT);
var typePort = op.addInPort( new Port( op, "Type", OP_PORT_TYPE_VALUE, { display: 'dropdown', values: TYPES } ) );
typePort.set(TYPE_DEFAULT);
var modulationTypePort = op.addInPort( new Port( op, "Modulation Type", OP_PORT_TYPE_VALUE, { display: 'dropdown', values: TYPES } ) );
modulationTypePort.set(MODULATION_TYPE_DEFAULT);
var phasePort = op.addInPort( new Port( op, "Phase", OP_PORT_TYPE_VALUE, { 'display': 'range', 'min': PHASE_MIN, 'max': PHASE_MAX } ));
phasePort.set(PHASE_DEFAULT);
var syncFrequencyPort = op.inValueBool("Sync Frequency", SYNC_FREQUENCY_DEFAULT);
var startPort = op.addInPort( new Port( op, "Start", OP_PORT_TYPE_FUNCTION, { "display": "button" } ));
var startTimePort = op.inValueString("Start Time", START_TIME_DEFAULT);
var stopPort = op.addInPort( new Port( op, "Stop", OP_PORT_TYPE_FUNCTION, { "display": "button" } ));
var stopTimePort = op.inValueString("Stop Time", STOP_TIME_DEFAULT);
var autoStartPort = op.inValueBool("Auto Start", AUTO_START_DEFAULT);
var volumePort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Volume", node.volume, null, VOLUME_DEFAULT);
var mutePort = op.addInPort( new Port( op, "Mute", OP_PORT_TYPE_VALUE, { display: 'bool' } ) );
mutePort.set(MUTE_DEFAULT);

function setSyncAndAutostart() {
    var syncFrequency = syncFrequencyPort.get();
    if(syncFrequency) {
        syncFrequency();
    } else {
        unsyncFrequency();
    }
    if(autoStartPort.get()) {
        start();
    }
}

// init
op.onLoaded = setSyncAndAutostart;

// functions
function syncFrequency() {
    node.syncFrequency();
}

function unsyncFrequency() {
    node.unsyncFrequency();
}

function start() {
    if(node.state !== 'started') {
        var startTime = startTimePort.get();
        if(!CABLES.WEBAUDIO.isValidToneTime(startTime)) {
            startTime = START_TIME_DEFAULT;
        }
        node.start(startTime);
    }
}

function stop() {
    if(node.state !== 'stopped') {
        var stopTime = stopTimePort.get();
        if(!CABLES.WEBAUDIO.isValidToneTime(stopTime)) {
            stopTime = STOP_TIME_DEFAULT;
        }
        node.stop(stopTime);
    }
}

// change listeners
typePort.onChange = function() {
    var type = typePort.get();
    if(type && TYPES.indexOf(type) > -1) {
        node.set("type", type);
    }
};
modulationTypePort.onChange = function() {
    var modulationType = modulationTypePort.get();
    if(modulationType && TYPES.indexOf(modulationType) > -1) {
        node.set("modulationType", modulationType);
    }
};
phasePort.onChange = function() {
    var phase = phasePort.get();
    if(phase >= PHASE_MIN && phase <= PHASE_MAX) {
        node.set("phase", phase);    
    }
};
startPort.onTriggered = function() {
    start();
};

stopPort.onTriggered = function() {
    stop();
};

mutePort.onChange = function() {
    node.mute = mutePort.get() ? true : false; 
};

syncFrequencyPort.onChange = function() {
    var sync = syncFrequencyPort.get();
    if(sync) {
        syncFrequency();
    } else {
        unsyncFrequency();
    }
};
autoStartPort.onChange = function() {
    op.log("autoStartPort changed: ", autoStartPort.get());
};

// outputs
var audioOutPort = CABLES.WEBAUDIO.createAudioOutPort(op, "Audio Out", node);
audioOutPort.onLinkChanged = function() {
    if(audioOutPort.isLinked()) {
        setSyncAndAutostart();
    }
};

// clean up
op.onDelete = function() {
    node.dispose();
};




};

Ops.WebAudio.Lib.Tonejs.Source.AmOscillator.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Textures.Text
// 
// **************************************************************

Ops.Gl.Textures.Text = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name='TextureText';

var text=op.addInPort(new Port(op,"text",OP_PORT_TYPE_VALUE,{type:'string',display:'editor'}));
var inFontSize=op.addInPort(new Port(op,"fontSize"));
var maximize=op.addInPort(new Port(op,"Maximize Size",OP_PORT_TYPE_VALUE,{display:'bool'}));
var texWidth=op.addInPort(new Port(op,"texture width"));
var texHeight=op.addInPort(new Port(op,"texture height"));
var align=op.addInPort(new Port(op,"align",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['left','center','right']}));
var valign=op.addInPort(new Port(op,"vertical align",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['top','center','bottom']}));
var font=op.addInPort(new Port(op,"font",OP_PORT_TYPE_VALUE,{type:'string'}));
var lineDistance=op.addInPort(new Port(op,"line distance"));
var border=op.addInPort(new Port(op,"border"));
var doRefresh=op.inFunctionButton("Refresh");

// var textureOut=op.addOutPort(new Port(op,"texture",OP_PORT_TYPE_TEXTURE));
var textureOut=op.outTexture("texture");
var outRatio=op.addOutPort(new Port(op,"Ratio",OP_PORT_TYPE_VALUE));

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
    var fontname=font.get();
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

    // if(text.get())
    {
        var txt=(text.get()+'').replace(/<br\/>/g, '\n');

        if(txt=='0')txt=' ';
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

    if(textureOut.get()) textureOut.get().initTexture(fontImage,CGL.Texture.FILTER_MIPMAP);
        else textureOut.set(new CGL.Texture.createFromImage( cgl, fontImage, { filter:CGL.Texture.FILTER_MIPMAP } ));

    textureOut.get().unpackAlpha=true;
}

align.onValueChanged=refresh;
valign.onValueChanged=refresh;
text.onValueChanged=refresh;
inFontSize.onValueChanged=refresh;
font.onValueChanged=refresh;
lineDistance.onValueChanged=refresh;
maximize.onValueChanged=refresh;

texWidth.onValueChanged=reSize;
texHeight.onValueChanged=reSize;

border.onValueChanged=refresh;

text.set('cables');
reSize();

};

Ops.Gl.Textures.Text.prototype = new CABLES.Op();

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
// Ops.WebAudio.Lib.Tonejs.Effect.AutoFilter
// 
// **************************************************************

Ops.WebAudio.Lib.Tonejs.Effect.AutoFilter = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
op.name="AutoFilter";

CABLES.WEBAUDIO.createAudioContext(op);

// TODO: Add filter / filter-op needed?

// vars
var node = new Tone.AutoFilter("4n").start(); // TODO: create start / stop nodes!?

// default values
var DEPTH_DEFAULT = 1;
var DEPTH_MIN = 0;
var DEPTH_MAX = 1;
var FREQUENCY_DEFAULT = 200;
var OSCILLATOR_TYPES = ["sine", "square", "triangle", "sawtooth"];
/*
var MIN_DEFAULT = 100; // ??
var MIN_MIN = 0; // ??
var MIN_MAX = 20000; // ??
*/
var OCTAVES_DEFAULT = 2.6;
var OCTAVES_MIN = -1;
var OCTAVES_MAX = 10;
var WET_DEFAULT = 1.0;
var WET_MIN = 0.0;
var WET_MAX = 1.0;

// input ports
var audioInPort = CABLES.WEBAUDIO.createAudioInPort(op, "Audio In", node);
var depthPort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Depth", node.depth, {"display": "range", "min": DEPTH_MIN, "max": DEPTH_MAX}, DEPTH_DEFAULT);
var frequencyPort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Frequency", node.frequency, null, FREQUENCY_DEFAULT);
//var filterPort = op.inObject("Filter");
var typePort = this.addInPort( new Port( op, "Type", OP_PORT_TYPE_VALUE, { display: 'dropdown', values: OSCILLATOR_TYPES }, OSCILLATOR_TYPES[0] ) );
typePort.set(OSCILLATOR_TYPES[0]);
//var minPort = op.inValue("Min", MIN_DEFAULT); // not noticable, tone.js bug?
var octavesPort = op.inValue("Octaves", OCTAVES_DEFAULT);
var wetPort = CABLES.WEBAUDIO.createAudioParamInPort(op, "Wet", node.wet, {"display": "range", "min": WET_MIN, "max": WET_MAX}, WET_DEFAULT);

// change listeners
/*
minPort.onChange = function() {
    var min = minPort.get();
    if(min && min >= MIN_MIN && min >= MIN_MAX) {
        node.set("min", minPort.get());    
    }
};
*/

octavesPort.onChange = function() {
    var octaves = octavesPort.get();
    if(octaves) {
        octaves = Math.round(parseFloat(octaves));
        if(octaves && octaves >= OCTAVES_MIN && octaves <= OCTAVES_MAX) {
            node.set("octaves", octaves);    
        }
    }
};

typePort.onChange = function() {
    if(typePort.get()) {
        node.set("type", typePort.get());    
    }
};

// output ports
var audioOutPort = CABLES.WEBAUDIO.createAudioOutPort(op, "Audio Out", node);



};

Ops.WebAudio.Lib.Tonejs.Effect.AutoFilter.prototype = new CABLES.Op();

//----------------

