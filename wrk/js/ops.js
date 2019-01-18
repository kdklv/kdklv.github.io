"use strict";

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Anim=Ops.Anim || {};
Ops.Gl.Matrix=Ops.Gl.Matrix || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Gl.TextureEffects=Ops.Gl.TextureEffects || {};
Ops.Gl.TextureEffects.Noise=Ops.Gl.TextureEffects.Noise || {};

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
// Ops.Gl.TextureEffects.ImageCompose
// 
// **************************************************************

Ops.Gl.TextureEffects.ImageCompose = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
const render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
const useVPSize=op.addInPort(new Port(op,"use viewport size",OP_PORT_TYPE_VALUE,{ display:'bool' }));
const width=op.inValueInt("width");
const height=op.inValueInt("height");

const tfilter=op.inValueSelect("filter",['nearest','linear','mipmap'],"linear");
const twrap=op.inValueSelect("wrap",['clamp to edge','repeat','mirrored repeat']);
const bgAlpha=op.inValueSlider("Background Alpha",1);
const fpTexture=op.inValueBool("HDR");

const trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
const texOut=op.outTexture("texture_out");

const outRatio=op.outValue("Aspect Ratio");

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
    .endl()+'   gl_FragColor = vec4(0.0,0.0,0.0,a);'
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
            "isFloatingPointTexture":fpTexture.get(),
            "filter":selectedFilter,
            "wrap":selectedWrap,
            "width": Math.floor(width.get()),
            "height": Math.floor(height.get()),
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
        w=Math.floor(width.get());
        h=Math.floor(height.get());
    }

    if((w!=tex.width || h!= tex.height) && (w!==0 && h!==0))
    {
        height.set(h);
        width.set(w);
        tex.filter=CGL.Texture.FILTER_LINEAR;
        tex.setSize(w,h);
        outRatio.set(w/h);
        effect.setSourceTexture(tex);
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
        width.setUiAttribs({hidePort:true,greyout:true});
        height.setUiAttribs({hidePort:true,greyout:true});
    }
    else
    {
        width.setUiAttribs({hidePort:false,greyout:false});
        height.setUiAttribs({hidePort:false,greyout:false});
    }
}


useVPSize.onValueChanged=function()
{
    updateSizePorts();
    if(useVPSize.get())
    {
        width.onValueChanged=null;
        height.onValueChanged=null;
    }
    else
    {
        width.onValueChanged=updateResolution;
        height.onValueChanged=updateResolution;
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
    cgl.gl.activeTexture(cgl.gl.TEXTURE0);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );
    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();

    texOut.set(effect.getCurrentSourceTexture());
    // texOut.set(effect.getCurrentTargetTexture());

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
twrap.onValueChanged=onWrapChange;

function onFilterChange()
{
    if(tfilter.get()=='nearest') selectedFilter=CGL.Texture.FILTER_NEAREST;
    if(tfilter.get()=='linear')  selectedFilter=CGL.Texture.FILTER_LINEAR;
    // if(tfilter.get()=='mipmap')  selectedFilter=CGL.Texture.FILTER_MIPMAP;

    reInitEffect=true;
    updateResolution();
    // effect.setSourceTexture(tex);
    // updateResolution();
}

tfilter.set('linear');
tfilter.onValueChanged=onFilterChange;

useVPSize.set(true);
render.onTriggered=doRender;

width.set(640);
height.set(360);
updateSizePorts();

};

Ops.Gl.TextureEffects.ImageCompose.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureEffects.DrawImage
// 
// **************************************************************

Ops.Gl.TextureEffects.DrawImage = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["drawimage_frag"]="#ifdef HAS_TEXTURES\n  IN vec2 texCoord;\n  UNI sampler2D tex;\n  UNI sampler2D image;\n#endif\n\nIN mat3 transform;\nUNI float rotate;\n{{BLENDCODE}}\n\n#ifdef HAS_TEXTUREALPHA\n   UNI sampler2D imageAlpha;\n#endif\n\nUNI float amount;\n\nvoid main()\n{\n   vec4 blendRGBA=vec4(0.0,0.0,0.0,1.0);\n   #ifdef HAS_TEXTURES\n       vec2 tc=texCoord;\n\n       #ifdef TEX_FLIP_X\n           tc.x=1.0-tc.x;\n       #endif\n       #ifdef TEX_FLIP_Y\n           tc.y=1.0-tc.y;\n       #endif\n\n       #ifdef TEX_TRANSFORM\n           vec3 coordinates=vec3(tc.x, tc.y,1.0);\n           tc=(transform * coordinates ).xy;\n       #endif\n\n       blendRGBA=texture2D(image,tc);\n\n       vec3 blend=blendRGBA.rgb;\n       vec4 baseRGBA=texture2D(tex,texCoord);\n       vec3 base=baseRGBA.rgb;\n\n       vec3 colNew=_blend(base,blend);\n\n       #ifdef REMOVE_ALPHA_SRC\n           blendRGBA.a=1.0;\n       #endif\n\n       #ifdef HAS_TEXTUREALPHA\n           vec4 colImgAlpha=texture2D(imageAlpha,texCoord);\n           float colImgAlphaAlpha=colImgAlpha.a;\n\n           #ifdef ALPHA_FROM_LUMINANCE\n               vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), colImgAlpha.rgb ));\n               colImgAlphaAlpha=(gray.r+gray.g+gray.b)/3.0;\n           #endif\n\n           blendRGBA.a=colImgAlphaAlpha*blendRGBA.a;\n           \n           #ifdef INVERT_ALPHA\n           blendRGBA.a=1.0-blendRGBA.a;\n           #endif\n       #endif\n\n\n   #endif\n\n   blendRGBA.rgb=mix( colNew, base ,1.0-blendRGBA.a*amount);\n   blendRGBA.a=1.0;\n\n\n   gl_FragColor = blendRGBA;\n}";
attachments["drawimage_vert"]="IN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\nOUT vec2 texCoord;\nOUT vec3 norm;\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nUNI float posX;\nUNI float posY;\nUNI float scale;\nUNI float rotate;\n\nOUT mat3 transform;\n\nvoid main()\n{\n    texCoord=attrTexCoord;\n    norm=attrVertNormal;\n\n    #ifdef TEX_TRANSFORM\n    vec3 coordinates=vec3(attrTexCoord.x, attrTexCoord.y,1.0);\n    float angle = radians( rotate );\n    vec2 scale= vec2(scale,scale);\n    vec2 translate= vec2(posX,posY);\n\n    transform = mat3(   scale.x * cos( angle ), scale.x * sin( angle ), 0.0,\n                        - scale.y * sin( angle ), scale.y * cos( angle ), 0.0,\n                        - 0.5 * scale.x * cos( angle ) + 0.5 * scale.y * sin( angle ) - 0.5 * translate.x*2.0 + 0.5,  - 0.5 * scale.x * sin( angle ) - 0.5 * scale.y * cos( angle ) - 0.5 * translate.y*2.0 + 0.5, 1.0);\n    #endif\n\n    gl_Position = projMatrix * mvMatrix * vec4(vPosition,  1.0);\n}";
var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var amount=op.addInPort(new Port(op,"amount",OP_PORT_TYPE_VALUE,{ display:'range' }));

var image=op.addInPort(new Port(op,"image",OP_PORT_TYPE_TEXTURE,{preview:true }));
var blendMode=CGL.TextureEffect.AddBlendSelect(op,"blendMode");

var imageAlpha=op.addInPort(new Port(op,"imageAlpha",OP_PORT_TYPE_TEXTURE,{preview:true }));
var alphaSrc=op.inValueSelect("alphaSrc",['alpha channel','luminance']);
var removeAlphaSrc=op.addInPort(new Port(op,"removeAlphaSrc",OP_PORT_TYPE_VALUE,{ display:'bool' }));

var invAlphaChannel=op.addInPort(new Port(op,"invert alpha channel",OP_PORT_TYPE_VALUE,{ display:'bool' }));


var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

blendMode.set('normal');
var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl,'drawimage');

amount.set(1.0);




var srcFrag=attachments.drawimage_frag.replace('{{BLENDCODE}}',CGL.TextureEffect.getBlendCode());


shader.setSource(attachments.drawimage_vert,srcFrag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);
var textureDisplaceUniform=new CGL.Uniform(shader,'t','image',1);
var textureAlpha=new CGL.Uniform(shader,'t','imageAlpha',2);

invAlphaChannel.onValueChanged=function()
{
    if(invAlphaChannel.get()) shader.define('INVERT_ALPHA');
        else shader.removeDefine('INVERT_ALPHA');
};

removeAlphaSrc.onValueChanged=function()
{
    if(removeAlphaSrc.get()) shader.define('REMOVE_ALPHA_SRC');
        else shader.removeDefine('REMOVE_ALPHA_SRC');
};
removeAlphaSrc.set(true);

alphaSrc.onValueChanged=function()
{
    if(alphaSrc.get()=='luminance') shader.define('ALPHA_FROM_LUMINANCE');
        else shader.removeDefine('ALPHA_FROM_LUMINANCE');
};

alphaSrc.set("alpha channel");


{
    //
    // texture flip
    //
    var flipX=op.addInPort(new Port(op,"flip x",OP_PORT_TYPE_VALUE,{ display:'bool' }));
    var flipY=op.addInPort(new Port(op,"flip y",OP_PORT_TYPE_VALUE,{ display:'bool' }));

    flipX.onValueChanged=function()
    {
        if(flipX.get()) shader.define('TEX_FLIP_X');
            else shader.removeDefine('TEX_FLIP_X');
    };

    flipY.onValueChanged=function()
    {
        if(flipY.get()) shader.define('TEX_FLIP_Y');
            else shader.removeDefine('TEX_FLIP_Y');
    };
}

{
    //
    // texture transform
    //
    var scale=op.addInPort(new Port(op,"scale",OP_PORT_TYPE_VALUE,{ display:'range' }));
    var posX=op.addInPort(new Port(op,"pos x",OP_PORT_TYPE_VALUE, {}));
    var posY=op.addInPort(new Port(op,"pos y",OP_PORT_TYPE_VALUE, {}));
    var rotate=op.addInPort(new Port(op,"rotate",OP_PORT_TYPE_VALUE, {}));

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

blendMode.onValueChanged=function()
{
    CGL.TextureEffect.onChangeBlendSelect(shader,blendMode.get());
};


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

        cgl.gl.activeTexture(cgl.gl.TEXTURE0);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

        cgl.gl.activeTexture(cgl.gl.TEXTURE1);
        if(image.get() && image.get().tex) cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, image.get().tex );
            else cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);

        cgl.gl.activeTexture(cgl.gl.TEXTURE2);
        if(imageAlpha.get() && imageAlpha.get().tex) cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, imageAlpha.get().tex );
            else cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);

        cgl.currentTextureEffect.finish();
        cgl.setPreviousShader();
    }

    trigger.trigger();
}

render.onTriggered=doRender;


};

Ops.Gl.TextureEffects.DrawImage.prototype = new CABLES.Op();

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
attachments["shader_frag"]="{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        uniform sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        uniform sampler2D texOpacity;\n   #endif\n#endif\nuniform float r;\nuniform float g;\nuniform float b;\nuniform float a;\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=vec4(r,g,b,a);\n    \n    #ifdef HAS_TEXTURES\n        #ifdef HAS_TEXTURE_DIFFUSE\n\n           col=texture2D(tex,vec2(texCoord.x,(1.0-texCoord.y)));\n\n//         col=texture2D(tex,vec2(texCoords.x*1.0,(1.0-texCoords.y)*1.0));\n           #ifdef COLORIZE_TEXTURE\n               col.r*=r;\n               col.g*=g;\n               col.b*=b;\n           #endif\n    #endif\n    col.a*=a;\n    #ifdef HAS_TEXTURE_OPACITY\n      \n            #ifdef TRANSFORMALPHATEXCOORDS\n                col.a*=texture2D(texOpacity,vec2(texCoordOrig.s,1.0-texCoordOrig.t)).g;\n            #endif\n            #ifndef TRANSFORMALPHATEXCOORDS\n                col.a*=texture2D(texOpacity,vec2(texCoord.s,1.0-texCoord.t)).g;\n            #endif\n       #endif\n       \n    #endif\n\n    {{MODULE_COLOR}}\n\n    outColor = col;\n}\n";
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
    if(diffuseTexture.get())
    {
        cgl.gl.activeTexture(cgl.gl.TEXTURE0);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, diffuseTexture.get().tex);
    }

    if(op.textureOpacity.get())
    {
        cgl.gl.activeTexture(cgl.gl.TEXTURE1);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, op.textureOpacity.get().tex);
    }
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
// Ops.Gl.TextureEffects.Levels
// 
// **************************************************************

Ops.Gl.TextureEffects.Levels = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["levels_frag"]="IN vec2 texCoord;\nUNI sampler2D tex;\nUNI float inMin;\nUNI float inMax;\nUNI float midPoint;\nUNI float outMax;\nUNI float outMin;\n\nvoid main()\n{\n   vec4 base=texture2D(tex,texCoord);\n\n   vec4 inputRange = min(max(base - vec4(inMin), vec4(0.0)) / (vec4(inMax) - vec4(inMin)), vec4(outMax));\n   inputRange = pow(inputRange, vec4(1.0 / (1.5 - midPoint)));\n\n   gl_FragColor = mix(vec4(outMin), vec4(1.0), inputRange);\n\n}";
op.name="Levels";

var render=op.addInPort(new Port(op,"Render",OP_PORT_TYPE_FUNCTION));

var inMin=op.inValueSlider("In Min",0);
var inMid=op.inValueSlider("Midpoint",0.5);
var inMax=op.inValueSlider("In Max",1);

var outMin=op.inValueSlider("Out Min",0);
var outMax=op.inValueSlider("Out Max",1);

var trigger=op.addOutPort(new Port(op,"Next",OP_PORT_TYPE_FUNCTION));

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

    cgl.gl.activeTexture(cgl.gl.TEXTURE0);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Levels.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureEffects.Posterize
// 
// **************************************************************

Ops.Gl.TextureEffects.Posterize = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["posterize_frag"]="uniform sampler2D tex;\nIN vec2 texCoord;\nuniform float levels;\n\nvoid main(void)\n{\n    vec3 srcPixel = texture2D(tex, texCoord  ).rgb;\n    vec3 amountPerLevel = vec3(1.0/levels);\n    vec3 numOfLevels = floor(srcPixel/amountPerLevel);\n    vec3 col = numOfLevels * (vec3(1.0) / (vec3(levels) - vec3(1.0)));\n    gl_FragColor = vec4(col,1.0);\n}\n\n";
op.name="Posterize";

var render=op.inFunction("Render");
var trigger=op.outFunction("Trigger");

var levels=op.inValue("levels",2);

var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);
op.onLoaded=shader.compile;

shader.setSource(shader.getDefaultVertexShader(),attachments.posterize_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);
var levelsUniform=new CGL.Uniform(shader,'f','levels',levels);

var uniWidth=new CGL.Uniform(shader,'f','texWidth',128);
var uniHeight=new CGL.Uniform(shader,'f','texHeight',128);


render.onTriggered=function()
{
    if(!cgl.currentTextureEffect)return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    uniWidth.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().width);
    uniHeight.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().height);

    cgl.gl.activeTexture(cgl.gl.TEXTURE0);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Posterize.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureEffects.EdgeDetection
// 
// **************************************************************

Ops.Gl.TextureEffects.EdgeDetection = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["edgedetect_frag"]="\nprecision highp float;\nIN vec2 texCoord;\nuniform sampler2D tex;\nuniform float amount;\n\nuniform float texWidth;\nuniform float texHeight;\n\nuniform float mulColor;\n\n\nconst vec4 lumcoeff = vec4(0.299,0.587,0.114, 0.);\n\nvec3 desaturate(vec3 color)\n{\n    return vec3(dot(vec3(0.2126,0.7152,0.0722), color));\n}\n\n\nvoid main()\n{\n    vec4 col=vec4(1.0,0.0,0.0,1.0);\n    \n    float pixelX=amount/texWidth;\n    float pixelY=amount/texHeight;\n\n    // col=texture2D(tex,texCoord);\n    \n    float count=1.0;\n    \n\tvec4 horizEdge = vec4( 0.0 );\n\thorizEdge -= texture2D( tex, vec2( texCoord.x - pixelX, texCoord.y - pixelY ) ) * 1.0;\n\thorizEdge -= texture2D( tex, vec2( texCoord.x - pixelX, texCoord.y     ) ) * 2.0;\n\thorizEdge -= texture2D( tex, vec2( texCoord.x - pixelX, texCoord.y + pixelY ) ) * 1.0;\n\thorizEdge += texture2D( tex, vec2( texCoord.x + pixelX, texCoord.y - pixelY ) ) * 1.0;\n\thorizEdge += texture2D( tex, vec2( texCoord.x + pixelX, texCoord.y     ) ) * 2.0;\n\thorizEdge += texture2D( tex, vec2( texCoord.x + pixelX, texCoord.y + pixelY ) ) * 1.0;\n\tvec4 vertEdge = vec4( 0.0 );\n\tvertEdge -= texture2D( tex, vec2( texCoord.x - pixelX, texCoord.y - pixelY ) ) * 1.0;\n\tvertEdge -= texture2D( tex, vec2( texCoord.x    , texCoord.y - pixelY ) ) * 2.0;\n\tvertEdge -= texture2D( tex, vec2( texCoord.x + pixelX, texCoord.y - pixelY ) ) * 1.0;\n\tvertEdge += texture2D( tex, vec2( texCoord.x - pixelX, texCoord.y + pixelY ) ) * 1.0;\n\tvertEdge += texture2D( tex, vec2( texCoord.x    , texCoord.y + pixelY ) ) * 2.0;\n\tvertEdge += texture2D( tex, vec2( texCoord.x + pixelX, texCoord.y + pixelY ) ) * 1.0;\n\n\n\tvec3 edge = sqrt((horizEdge.rgb/count * horizEdge.rgb/count) + (vertEdge.rgb/count * vertEdge.rgb/count));\n// \tedge=vec3(atan(edge.x,edge.y));\n\t\n// \tif(edge.r>1.1)edge=vec3(1.0,1.0,1.0);\n// \telse edge=vec3(0.0,0.0,0.0);\n\n// edge*=5.0;\n\n\nedge=desaturate(edge);\n\n    if(mulColor>0.0)\n        edge*=texture2D( tex, texCoord ).rgb*mulColor*4.0;\n    \n    gl_FragColor = vec4(edge,1.0);\n\n}\n    \n ";
op.name="EdgeDetection";

var render=op.inFunction("Render");
var trigger=op.outFunction("Trigger");

var amount=op.inValueSlider("amount",1);

var mulColor=op.inValueSlider("Mul Color",0);

var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);
op.onLoaded=shader.compile;



shader.setSource(shader.getDefaultVertexShader(),attachments.edgedetect_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);
var amountUniform=new CGL.Uniform(shader,'f','amount',amount);

var uniWidth=new CGL.Uniform(shader,'f','texWidth',128);
var uniHeight=new CGL.Uniform(shader,'f','texHeight',128);
var uniMulColor=new CGL.Uniform(shader,'f','mulColor',mulColor);


render.onTriggered=function()
{
    if(!cgl.currentTextureEffect)return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.gl.activeTexture(cgl.gl.TEXTURE0);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    uniWidth.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().width);
    uniHeight.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().height);

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};

};

Ops.Gl.TextureEffects.EdgeDetection.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Render2Texture
// 
// **************************************************************

Ops.Gl.Render2Texture = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var cgl=op.patch.cgl;

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));

var msaa=op.inValueSelect("MSAA",["none","2x","4x","8x"],"none");

var useVPSize=op.addInPort(new Port(op,"use viewport size",OP_PORT_TYPE_VALUE,{ display:'bool' }));

var width=op.inValueInt("texture width");
var height=op.inValueInt("texture height");

var tfilter=op.addInPort(new Port(op,"filter",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['nearest','linear','mipmap']}));
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
// var tex=op.addOutPort(new Port(op,"texture",OP_PORT_TYPE_TEXTURE,{preview:true}));
// var texDepth=op.addOutPort(new Port(op,"textureDepth",OP_PORT_TYPE_TEXTURE));

var tex=op.outTexture("texture");
var texDepth=op.outTexture("textureDepth");

var fpTexture=op.inValueBool("HDR");
var depth=op.inValueBool("Depth",true);
var clear=op.inValueBool("Clear",true);


var fb=null;

width.set(512);
height.set(512);
useVPSize.set(true);
tfilter.set('linear');
var reInitFb=true;


// todo why does it only work when we render a mesh before>?>?????
// only happens with matcap material with normal map....

useVPSize.onChange=updateVpSize;
function updateVpSize()
{
    if(useVPSize.get())
    {
        width.setUiAttribs({hidePort:true,greyout:true});
        height.setUiAttribs({hidePort:true,greyout:true});
    }
    else
    {
        width.setUiAttribs({hidePort:false,greyout:false});
        height.setUiAttribs({hidePort:false,greyout:false});
    }
}


fpTexture.onChange=function()
{
    reInitFb=true;
};

depth.onChange=function()
{
    reInitFb=true;
};

clear.onChange=function()
{
    reInitFb=true;
};


var onFilterChange=function()
{
    reInitFb=true;
};

msaa.onChange=function()
{
    reInitFb=true;
};

function doRender()
{
    if(!fb || reInitFb)
    {
        if(fb) fb.delete();
        if(cgl.glVersion>=2) 
        {
            var ms=true;
            var msSamples=4;
            
            if(msaa.get()=="none")
            {
                msSamples=0;
                ms=false;
            }
            if(msaa.get()=="2x")msSamples=2;
            if(msaa.get()=="4x")msSamples=4;
            if(msaa.get()=="8x")msSamples=8;
            
            fb=new CGL.Framebuffer2(cgl,8,8,
            {
                isFloatingPointTexture:fpTexture.get(),
                multisampling:ms,
                depth:depth.get(),
                multisamplingSamples:msSamples,
                clear:clear.get()
            });
        }
        else
        {
            fb=new CGL.Framebuffer(cgl,8,8,{isFloatingPointTexture:fpTexture.get()});
        }

        if(tfilter.get()=='nearest') fb.setFilter(CGL.Texture.FILTER_NEAREST);
            else if(tfilter.get()=='linear') fb.setFilter(CGL.Texture.FILTER_LINEAR);
            else if(tfilter.get()=='mipmap') fb.setFilter(CGL.Texture.FILTER_MIPMAP);

        tex.set( fb.getTextureColor() );
        texDepth.set( fb.getTextureDepth() );
        reInitFb=false;
    }

    if(useVPSize.val)
    {
        width.set( cgl.getViewPort()[2] );
        height.set( cgl.getViewPort()[3] );
    }

    if(fb.getWidth()!=width.get() || fb.getHeight()!=height.get() )
    {
        fb.setSize( width.get(),height.get() );
    }



    fb.renderStart(cgl);
    // mesh.render(cgl.getShader());


    trigger.trigger();
    // cgl.printError("start r2t");
    fb.renderEnd(cgl);

    cgl.resetViewPort();
}


render.onTriggered=doRender;


tfilter.onValueChange(onFilterChange);
updateVpSize();

};

Ops.Gl.Render2Texture.prototype = new CABLES.Op();

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

var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION)) ;
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
// Ops.Gl.Texture
// 
// **************************************************************

Ops.Gl.Texture = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var filename=op.addInPort(new Port(op,"file",OP_PORT_TYPE_VALUE,{ display:'file',type:'string',filter:'image' } ));
var tfilter=op.inValueSelect("filter",['nearest','linear','mipmap']);
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

flip.onChange=function(){reload();};
filename.onChange=reload;

tfilter.onChange=onFilterChange;
wrap.onChange=onWrapChange;
unpackAlpha.onChange=function(){ reload(); };

var timedLoader=0;

var setTempTexture=function()
{
    var t=CGL.Texture.getTempTexture(cgl);
    textureOut.set(t);
};

var loadingId=null;

function reload(nocache)
{
    if(!loadingId)loadingId=cgl.patch.loading.start('texture',filename.get());
    clearTimeout(timedLoader);
    timedLoader=setTimeout(function()
    {
        realReload(nocache);
    },30);
}

function realReload(nocache)
{
    if(!loadingId)loadingId=cgl.patch.loading.start('texture',filename.get());
    
    var url=op.patch.getFilePath(String(filename.get()));
    if(nocache)url+='?rnd='+CABLES.generateUUID();

    if((filename.get() && filename.get().length>1))
    {
        loading.set(true);

        var tex=CGL.Texture.load(cgl,url,
            function(err)
            {
                // console.log('tex loaded!!');

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
                cgl.patch.loading.finished(loadingId);
                
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
        loading.set(false);
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

    reload();
}

function onWrapChange()
{
    if(wrap.get()=='repeat') cgl_wrap=CGL.Texture.WRAP_REPEAT;
    if(wrap.get()=='mirrored repeat') cgl_wrap=CGL.Texture.WRAP_MIRRORED_REPEAT;
    if(wrap.get()=='clamp to edge') cgl_wrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;

    reload();
}

op.onFileUploaded=function(fn)
{
    if(filename.get() && filename.get().indexOf(fn)>-1)
    {
        textureOut.set(null);
        textureOut.set(CGL.Texture.getTempTexture(cgl));

        realReload(true);
    }
};




tfilter.set('linear');
wrap.set('repeat');


textureOut.set(CGL.Texture.getEmptyTexture(cgl));



};

Ops.Gl.Texture.prototype = new CABLES.Op();

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
    // geom.calculateNormals({"forceZUp":true});

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
// Ops.Gl.Matrix.CircleMovement
// 
// **************************************************************

Ops.Gl.Matrix.CircleMovement = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));

var segments=op.addInPort(new Port(op,"segments"));
var radius=op.addInPort(new Port(op,"radius"));
var mulX=op.addInPort(new Port(op,"mulX"));
var mulY=op.addInPort(new Port(op,"mulY"));
var percent=op.addInPort(new Port(op,"percent",OP_PORT_TYPE_VALUE,{display:'range'}));

var offset=op.addInPort(new Port(op,"offset"));

var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
var index=op.addOutPort(new Port(op,"index"));

var outX=op.addOutPort(new Port(op,"X"));
var outY=op.addOutPort(new Port(op,"Y"));


var speed=op.inValue("speed",1);

var startTime=CABLES.now()/1000;
var cgl=op.patch.cgl;
var animX=new CABLES.TL.Anim();
var animY=new CABLES.TL.Anim();
var pos=[];
animX.loop=true;
animY.loop=true;

segments.set(40);
radius.set(1);
mulX.set(1);
mulY.set(1);

segments.onValueChanged=calc;

calc();

render.onTriggered=function()
{
    cgl.pushModelMatrix();


    var time=(CABLES.now()/1000-startTime)*speed.get()+Math.round(segments.get())*0.1*percent.get();

    var x=animX.getValue(time+offset.get())*mulX.get()*radius.get();
    var y=animY.getValue(time+offset.get())*mulY.get()*radius.get();

    outX.set(x);
    outY.set(y);

    mat4.translate(cgl.mvMatrix,cgl.mvMatrix, [
        x,
        y,
        0] );

    trigger.trigger();

    cgl.popModelMatrix();
};

function calc()
{
    pos.length=0;
    var i=0,degInRad=0;
    animX.clear();
    animY.clear();

    for (i=0; i <= Math.round(segments.get()); i++)
    {
        index.set(i);
        degInRad = (360/Math.round(segments.get()))*i*CGL.DEG2RAD;
        animX.setValue(i*0.1,Math.cos(degInRad));
        animY.setValue(i*0.1,Math.sin(degInRad));
    }
}



};

Ops.Gl.Matrix.CircleMovement.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureEffects.EdgeDetectionFreiChen
// 
// **************************************************************

Ops.Gl.TextureEffects.EdgeDetectionFreiChen = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["edgeFreiChen_frag"]="/**\n * @author zz85 / https://github.com/zz85 | https://www.lab4games.net/zz85/blog\n *\n * Edge Detection Shader using Frei-Chen filter\n * Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector\n *\n */\n\n\nuniform float texWidth;\nuniform float texHeight;\nuniform float amount;\n\nuniform sampler2D tex;\nIN vec2 texCoord;\n\nmat3 G[9];\n// hard coded matrix values!!!! as suggested in https://github.com/neilmendoza/ofxPostProcessing/blob/master/src/EdgePass.cpp#L45\nconst mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );\nconst mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );\nconst mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );\nconst mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );\nconst mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );\nconst mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );\nconst mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );\nconst mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );\nconst mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );\n\nvoid main(void)\n{\n    vec2 texel = vec2(amount / texWidth,amount / texHeight);\n\n\tG[0] = g0,\n\tG[1] = g1,\n\tG[2] = g2,\n\tG[3] = g3,\n\tG[4] = g4,\n\tG[5] = g5,\n\tG[6] = g6,\n\tG[7] = g7,\n\tG[8] = g8;\n\n\tmat3 I;\n\tfloat cnv[9];\n\tvec3 smpl;\n\n\t/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */\n\tfor (float i=0.0; i<3.0; i++) {\n\t\tfor (float j=0.0; j<3.0; j++) {\n\t\t\tsmpl = texture2D(tex, texCoord + texel * vec2(i-1.0,j-1.0) ).rgb;\n\t\t\tI[int(i)][int(j)] = length(smpl);\n\t\t}\n\t}\n\n\t/* calculate the convolution values for all the masks */\n\tfor (int i=0; i<9; i++) {\n\t\tfloat dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);\n\t\tcnv[i] = dp3 * dp3;\n\t}\n\n\tfloat M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);\n\tfloat S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);\n\n\tgl_FragColor = vec4(vec3(sqrt(M/S)), texture2D( tex, texCoord ).a )*2.0;\n\n}\n";

var render=op.inFunction("Render");
var trigger=op.outFunction("Trigger");



var amount=op.inValueSlider("amount",1);

var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);
op.onLoaded=shader.compile;



shader.setSource(shader.getDefaultVertexShader(),attachments.edgeFreiChen_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);
var amountUniform=new CGL.Uniform(shader,'f','amount',amount);

var uniWidth=new CGL.Uniform(shader,'f','texWidth',128);
var uniHeight=new CGL.Uniform(shader,'f','texHeight',128);


render.onTriggered=function()
{
    if(!cgl.currentTextureEffect)return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.gl.activeTexture(cgl.gl.TEXTURE0);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    uniWidth.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().width);
    uniHeight.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().height);


    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.EdgeDetectionFreiChen.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Meshes.FullscreenRectangle
// 
// **************************************************************

Ops.Gl.Meshes.FullscreenRectangle = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["shader_frag"]="\nUNI sampler2D tex;\nIN vec2 texCoord;\n\nprecision highp float;\n\nvoid main()\n{\n   gl_FragColor = texture2D(tex,vec2(texCoord.x,(1.0-texCoord.y)));\n}\n";
attachments["shader_vert"]="{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nOUT vec2 texCoord;\nIN vec2 attrTexCoord;\n\nvoid main()\n{\n   vec4 pos=vec4(vPosition,  1.0);\n\n   texCoord=attrTexCoord;\n\n\n   gl_Position = projMatrix * mvMatrix * pos;\n}\n";


var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var centerInCanvas=op.addInPort(new Port(op,"Center in Canvas",OP_PORT_TYPE_VALUE,{display:'bool'}));
var flipY=op.inValueBool("Flip Y");

var inTexture=op.inTexture("Texture");


var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var cgl=op.patch.cgl;
var mesh=null;
var geom=new CGL.Geometry("fullscreen rectangle");
var x=0,y=0,z=0,w=0,h=0;

centerInCanvas.onChange=rebuild;
flipY.onChange=rebuild;

var shader=null;
render.onTriggered=doRender;

inTexture.onChange=function()
{
    var tex=inTexture.get();
    // shader=null;
    if(tex && !shader)
    {
        shader=new CGL.Shader(cgl,'fullscreenrectangle');
        shader.setModules(['MODULE_VERTEX_POSITION','MODULE_COLOR','MODULE_BEGIN_FRAG']);

        shader.setSource(attachments.shader_vert,attachments.shader_frag);
        shader.fullscreenRectUniform=new CGL.Uniform(shader,'t','tex',0);
    }
};

op.preRender=function()
{
    if(shader)shader.bind();
    if(mesh)mesh.render(shader);
    doRender();
    
};

function doRender()
{
    if( cgl.getViewPort()[2]!=w || cgl.getViewPort()[3]!=h )
    {
        rebuild();
    }

    cgl.pushPMatrix();
    mat4.identity(cgl.pMatrix);
    mat4.ortho(cgl.pMatrix, 0, w,h, 0, -10.0, 1000);

    cgl.pushModelMatrix();
    mat4.identity(cgl.mvMatrix);

    cgl.pushViewMatrix();
    mat4.identity(cgl.vMatrix);

    if(centerInCanvas.get())
    {
        var x=0;
        var y=0;
        if(w<cgl.canvasWidth) x=(cgl.canvasWidth-w)/2;
        if(h<cgl.canvasHeight) y=(cgl.canvasHeight-h)/2;

        cgl.setViewPort(x,y,w,h);
    }

    if(shader)
    {
        if(inTexture.get())
        {
            cgl.gl.activeTexture(cgl.gl.TEXTURE0);
            cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, inTexture.get().tex);
        }

        mesh.render(shader);
    }
    else
    {
        mesh.render(cgl.getShader());
    }

    cgl.gl.clear(cgl.gl.DEPTH_BUFFER_BIT);

    cgl.popPMatrix();
    cgl.popModelMatrix();
    cgl.popViewMatrix();

    trigger.trigger();
};


function rebuild()
{

    var currentViewPort=cgl.getViewPort();
    if(currentViewPort[2]==w && currentViewPort[3]==h)return;

    var xx=0,xy=0;

    w=currentViewPort[2];
    h=currentViewPort[3];

    geom.vertices = new Float32Array([
         xx+w, xy+h,  0.0,
         xx,   xy+h,  0.0,
         xx+w, xy,    0.0,
         xx,   xy,    0.0
    ]);

    if(flipY.get())
        geom.setTexCoords( new Float32Array([
             1.0, 0.0,
             0.0, 0.0,
             1.0, 1.0,
             0.0, 1.0
        ]));
    else
        geom.setTexCoords(new Float32Array([
             1.0, 1.0,
             0.0, 1.0,
             1.0, 0.0,
             0.0, 0.0
        ]));

    geom.verticesIndices = new Float32Array([
        0, 1, 2,
        3, 1, 2
    ]);


    if(!mesh) mesh=new CGL.Mesh(cgl,geom);
        else mesh.setGeom(geom);
}


};

Ops.Gl.Meshes.FullscreenRectangle.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.Performance
// 
// **************************************************************

Ops.Gl.Performance = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
var exe=this.addInPort(new Port(this,"exe",OP_PORT_TYPE_FUNCTION));
var next=this.addOutPort(new Port(this,"childs",OP_PORT_TYPE_FUNCTION)) ;

var inShow=op.inValueBool("Visible",true);

var outFPS=op.outValue("FPS");
var element = document.createElement('div');
var ctx=null;
var cgl=op.patch.cgl;
var opened=false;
var frameCount=0;
var fps=0;
var fpsStartTime=0;
var childsTime=0;
var avgMsChilds=0;
var queue=[];
var queueChilds=[];
var numBars=128;
var avgMs=0;
var selfTime=0;
var canvas=null;
var lastTime=0;
var loadingCounter=0;

var loadingChars=['|','/','-','\\'];

for(var i=0;i<numBars;i++)
{
    queue[i]=-1;
    queueChilds[i]=-1;
}

element.id="performance";
element.style.position="absolute";
element.style.left="0px";
element.style.top="0px";
element.style.opacity="0.8";
element.style.padding="10px";
element.style.cursor="pointer";
element.style.background="#222";
element.style.color="white";
element.style["font-family"]="monospace";
element.style["font-size"]="11px";
element.style["z-index"]="9999";
element.innerHTML="&nbsp;";

var container = op.patch.cgl.canvas.parentElement;
container.appendChild(element);

element.addEventListener("click", toggleOpened);

op.onDelete=function()
{
    element.remove();
};

inShow.onChange=function()
{
    if(!inShow.get())element.style.opacity=0;
        else element.style.opacity=1;
    
};

function toggleOpened()
{
    element.style.opacity=1;
    opened=!opened;
    updateText();
    if(!canvas)createCanvas();
    if(opened)
    {
        canvas.style.display="block";
        element.style.left=numBars+"px";
        element.style["min-height"]="56px";
    }
    else 
    {
        canvas.style.display="none";
        element.style.left="0px";
        element.style["min-height"]="auto";
    }
}

function updateCanvas()
{
    ctx.fillStyle="#222222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#555555";
    var k=0;
    for(k=numBars;k>=0;k--)
    {
        if(queue[k]>30)ctx.fillStyle="#ff5555";
        ctx.fillRect(numBars-k,canvas.height-queue[k]*2.5,1,queue[k]*2.5);
        if(queue[k]>30)ctx.fillStyle="#555555";
    }

    ctx.fillStyle="#aaaaaa";
    for(k=numBars;k>=0;k--)
    {
        if(queueChilds[k]>30)ctx.fillStyle="#ff00ff";
        ctx.fillRect(numBars-k,canvas.height-queueChilds[k]*2.5,1,queueChilds[k]*2.5);
        if(queueChilds[k]>30)ctx.fillStyle="#aaaaaa";
    }

}

function createCanvas()
{
    canvas = document.createElement('canvas');
    canvas.id     = "performance_"+op.patch.config.glCanvasId;
    canvas.width  = numBars;
    canvas.height = "128";
    canvas.style.display   = "block";
    canvas.style.opacity   = 0.9;
    canvas.style.position  = "absolute";
    canvas.style.left  = "0px";
    canvas.style.cursor  = "pointer";
    canvas.style.top  = "-64px";
    canvas.style['z-index']   = "9998";
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    canvas.addEventListener("click", toggleOpened);
    
}

function updateText()
{

    var warn="";
    if(CGL.profileShaderCompiles>0)warn+='Shader compile ('+CGL.profileShaderCompileName+') ';
    if(CGL.profileShaderGetUniform>0)warn+='Shader get uni loc! ('+CGL.profileShaderGetUniformName+')';
    if(CGL.profileTextureResize>0)warn+='Texture resize! ';
    if(CGL.profileFrameBuffercreate>0)warn+='Framebuffer create! ';
    if(CGL.profileEffectBuffercreate>0)warn+='Effectbuffer create! ';
    if(CGL.profileTextureDelete>0)warn+='Texture delete! ';

    if(CGL.profileNonTypedAttrib>0)warn+='Not-Typed Buffer Attrib! '+CGL.profileNonTypedAttribNames;
    
    //     CGL.profileNonTypedAttrib=0;
    // CGL.profileNonTypedAttribNames="";

    // if(warn && warn.length>0)console.warn(warn);
    
    if(warn.length>0)
    {
        warn='| <span style="color:#f80;">WARNING: '+warn+'<span>';
    }

    element.innerHTML=fps+" fps | "+Math.round(childsTime*100)/100+"ms "+warn;
    if(op.patch.loading.getProgress()!=1.0)
    {
        element.innerHTML+="<br/>loading "+op.patch.loading.getProgress()+' '+loadingChars[ (++loadingCounter)%loadingChars.length ];
    }
    
    if(opened)
    {
        var count=0;
        avgMs=0;
        avgMsChilds=0;
        for(var i=queue.length;i>queue.length-queue.length/3;i--)
        {
            if(queue[i]>-1)
            {
                avgMs+=queue[i];
                count++;
            }

            if(queueChilds[i]>-1)
            {
                avgMsChilds+=queueChilds[i];
            }
        }
        
        avgMs/=count;
        avgMsChilds/=count;

        element.innerHTML+='<br/> '+cgl.canvasWidth+' x '+cgl.canvasHeight+' (x'+cgl.pixelDensity+') ';
        element.innerHTML+='<br/>frame avg: '+Math.round(avgMsChilds*100)/100+' ms ('+Math.round(avgMsChilds/avgMs*100)+'%) / '+Math.round(avgMs*100)/100+' ms';
        element.innerHTML+=' (self: '+Math.round((selfTime)*100)/100+' ms) ';
        
        element.innerHTML+='<br/>shader binds: '+Math.ceil(CGL.profileShaderBinds/fps)+
            ' uniforms: '+Math.ceil(CGL.profileUniformCount/fps)+
            ' mvp_uni_mat4: '+Math.ceil(CGL.profileMVPMatrixCount/fps)+
                

            ' mesh.setGeom: '+CGL.profileMeshSetGeom+
            ' videos: '+CGL.profileVideosPlaying;
        
    }


    CGL.profileUniformCount=0;
    CGL.profileShaderGetUniform=0;
    CGL.profileShaderCompiles=0;
    CGL.profileShaderBinds=0;
    CGL.profileTextureResize=0;
    CGL.profileFrameBuffercreate=0;
    CGL.profileEffectBuffercreate=0;
    CGL.profileTextureDelete=0;
    CGL.profileMeshSetGeom=0;
    CGL.profileVideosPlaying=0;
    CGL.profileMVPMatrixCount=0;

    CGL.profileNonTypedAttrib=0;
    CGL.profileNonTypedAttribNames="";

}


exe.onTriggered=function()
{
    var selfTimeStart=performance.now();
    frameCount++;

    if(fpsStartTime===0)fpsStartTime=Date.now();
    if(Date.now()-fpsStartTime>=1000)
    {
        fps=frameCount;
        frameCount=0;
        frames=0;
        outFPS.set(fps);
        updateText();
        
        fpsStartTime=Date.now();
    }
   
    if(opened)
    {
        var timeUsed=performance.now()-lastTime;
        // if(timeUsed>30)console.log("peak ",performance.now()-lastTime);
        queue.push(timeUsed);
        queue.shift();
    
        queueChilds.push(childsTime);
        queueChilds.shift();

        updateCanvas();
    }
    
    lastTime=performance.now();
    selfTime=performance.now()-selfTimeStart;
    var startTimeChilds=performance.now();

    next.trigger();

    childsTime=performance.now()-startTimeChilds;
    
};


op.onDelete=function()
{
  if(canvas)canvas.remove();
  if(element)element.remove();
};

};

Ops.Gl.Performance.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureEffects.Blur
// 
// **************************************************************

Ops.Gl.TextureEffects.Blur = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["blur_frag"]="IN vec2 texCoord;\nuniform sampler2D tex;\nuniform float dirX;\nuniform float dirY;\nuniform float amount;\n\n#ifdef HAS_MASK\n    uniform sampler2D imageMask;\n#endif\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main()\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float am=amount;\n    #ifdef HAS_MASK\n        am=amount*texture2D(imageMask,texCoord).r;\n        if(am<=0.02)\n        {\n            gl_FragColor=texture2D(tex, texCoord);\n            return;\n        }\n    #endif\n\n   vec2 delta=vec2(dirX*am*0.01,dirY*am*0.01);\n\n\n    \n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n\n    #ifndef FASTBLUR\n    const float range=20.0;\n    #endif\n    #ifdef FASTBLUR\n    const float range=5.0;\n    #endif\n\n    for (float t = -range; t <= range; t++)\n    {\n        float percent = (t + offset - 0.5) / range;\n        float weight = 1.0 - abs(percent);\n        vec4 smpl = texture2D(tex, texCoord + delta * percent);\n        \n        smpl.rgb *= smpl.a;\n\n        color += smpl * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}";
var cgl=op.patch.cgl;

op.name='Blur';
var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));
var fast=op.inValueBool("Fast",true);




var amount=op.addInPort(new Port(op,"amount",OP_PORT_TYPE_VALUE));
amount.set(10);

var shader=new CGL.Shader(cgl);
op.onLoaded=shader.compile;

shader.define("FASTBLUR");

fast.onChange=function()
{
    if(fast.get()) shader.define("FASTBLUR");
        else shader.removeDefine("FASTBLUR");
};

shader.setSource(shader.getDefaultVertexShader(),attachments.blur_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);

var uniDirX=new CGL.Uniform(shader,'f','dirX',0);
var uniDirY=new CGL.Uniform(shader,'f','dirY',0);

var uniWidth=new CGL.Uniform(shader,'f','width',0);
var uniHeight=new CGL.Uniform(shader,'f','height',0);

var uniAmount=new CGL.Uniform(shader,'f','amount',amount.get());
amount.onValueChange(function(){ uniAmount.setValue(amount.get()); });

var textureAlpha=new CGL.Uniform(shader,'t','imageMask',1);


var direction=op.addInPort(new Port(op,"direction",OP_PORT_TYPE_VALUE,{display:'dropdown',values:['both','vertical','horizontal']}));
var dir=0;
direction.set('both');
direction.onValueChange(function()
{
    if(direction.get()=='both')dir=0;
    if(direction.get()=='horizontal')dir=1;
    if(direction.get()=='vertical')dir=2;
});

var mask=op.addInPort(new Port(op,"mask",OP_PORT_TYPE_TEXTURE,{preview:true }));

mask.onValueChanged=function()
{
    if(mask.get() && mask.get().tex) shader.define('HAS_MASK');
        else shader.removeDefine('HAS_MASK');
};



render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.setShader(shader);

    uniWidth.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().width);
    uniHeight.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().height);

    // first pass
    if(dir===0 || dir==2)
    {

        cgl.currentTextureEffect.bind();
        cgl.gl.activeTexture(cgl.gl.TEXTURE0);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

        if(mask.get() && mask.get().tex)
        {
            cgl.gl.activeTexture(cgl.gl.TEXTURE1);
            cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, mask.get().tex );
        }


        uniDirX.setValue(0.0);
        uniDirY.setValue(1.0);

        cgl.currentTextureEffect.finish();
    }

    // second pass
    if(dir===0 || dir==1)
    {

        cgl.currentTextureEffect.bind();
        cgl.gl.activeTexture(cgl.gl.TEXTURE0);
        cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

        if(mask.get() && mask.get().tex)
        {
            cgl.gl.activeTexture(cgl.gl.TEXTURE1);
            cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, mask.get().tex );
        }

        uniDirX.setValue(1.0);
        uniDirY.setValue(0.0);

        cgl.currentTextureEffect.finish();
    }

    cgl.setPreviousShader();
    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Blur.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Anim.RandomAnim
// 
// **************************************************************

Ops.Anim.RandomAnim = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};

var exe=op.inFunction("exe");
var min=op.inValue("min",0);
var max=op.inValue("max",1);

var pause=op.inValue("pause between",0);
var seed=op.inValue("random seed",0);

var duration=op.inValue("duration",0.5);

var result=op.outValue("result");

var anim=new CABLES.TL.Anim();
anim.createPort(op,"easing",reinit);

reinit();

min.onChange=reinit;
max.onChange=reinit;
pause.onChange=reinit;
seed.onChange=reinit;
duration.onChange=reinit;

function getRandom()
{
    var minVal = parseFloat( min.get() );
    var maxVal = parseFloat( max.get() );
    return Math.seededRandom() * ( maxVal - minVal ) + minVal;
}

function reinit()
{
    Math.randomSeed=seed.get();
    init(getRandom());
}

function init(v)
{
    anim.clear();
    
    anim.setValue(op.patch.freeTimer.get(), v);
    if(pause.get()!=0.0)anim.setValue(op.patch.freeTimer.get()+pause.get(), v);
    
    anim.setValue(parseFloat(duration.get())+op.patch.freeTimer.get()+pause.get(), getRandom());
}


exe.onTriggered=function()
{
    if(op.instanced(exe))return;


    Math.randomSeed=seed.get();

// +offset.get())%duration.get()
    var t=op.patch.freeTimer.get();
    var v=anim.getValue(t);
    if(anim.hasEnded(t))
    {
        anim.clear();
        init(v);
    }
    result.set(v);
};



};

Ops.Anim.RandomAnim.prototype = new CABLES.Op();

//----------------



// **************************************************************
// 
// Ops.Gl.TextureEffects.Noise.CellularNoise
// 
// **************************************************************

Ops.Gl.TextureEffects.Noise.CellularNoise = function()
{
Op.apply(this, arguments);
var op=this;
var attachments={};
attachments["cellularnoise3d_frag"]="precision highp float;\n\nuniform float z;\nuniform float x;\nuniform float y;\nuniform float scale;\nIN vec2 texCoord;\nuniform sampler2D tex;\n\n\nvoid FAST32_hash_3D( \tvec3 gridcell,\n                        out vec4 lowz_hash_0,\n                        out vec4 lowz_hash_1,\n                        out vec4 lowz_hash_2,\n                        out vec4 highz_hash_0,\n                        out vec4 highz_hash_1,\n                        out vec4 highz_hash_2\t)\t\t//\tgenerates 3 random numbers for each of the 8 cell corners\n{\n    //    gridcell is assumed to be an integer coordinate\n\n    //\tTODO: \tthese constants need tweaked to find the best possible noise.\n    //\t\t\tprobably requires some kind of brute force computational searching or something....\n    const vec2 OFFSET = vec2( 50.0, 161.0 );\n    const float DOMAIN = 69.0;\n    const vec3 SOMELARGEFLOATS = vec3( 635.298681, 682.357502, 668.926525 );\n    const vec3 ZINC = vec3( 48.500388, 65.294118, 63.934599 );\n\n    //\ttruncate the domain\n    gridcell.xyz = gridcell.xyz - floor(gridcell.xyz * ( 1.0 / DOMAIN )) * DOMAIN;\n    vec3 gridcell_inc1 = step( gridcell, vec3( DOMAIN - 1.5 ) ) * ( gridcell + 1.0 );\n\n    //\tcalculate the noise\n    vec4 P = vec4( gridcell.xy, gridcell_inc1.xy ) + OFFSET.xyxy;\n    P *= P;\n    P = P.xzxz * P.yyww;\n    vec3 lowz_mod = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + gridcell.zzz * ZINC.xyz ) );\n    vec3 highz_mod = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + gridcell_inc1.zzz * ZINC.xyz ) );\n    lowz_hash_0 = fract( P * lowz_mod.xxxx );\n    highz_hash_0 = fract( P * highz_mod.xxxx );\n    lowz_hash_1 = fract( P * lowz_mod.yyyy );\n    highz_hash_1 = fract( P * highz_mod.yyyy );\n    lowz_hash_2 = fract( P * lowz_mod.zzzz );\n    highz_hash_2 = fract( P * highz_mod.zzzz );\n}\n\n\n\n\nvec4 Cellular_weight_samples( vec4 samples )\n{\n    samples = samples * 2.0 - 1.0;\n    //return (1.0 - samples * samples) * sign(samples);\t// square\n    return (samples * samples * samples) - sign(samples);\t// cubic (even more variance)\n}\n\n\n//\n//\tCellular Noise 3D\n//\tBased off Stefan Gustavson's work at http://www.itn.liu.se/~stegu/GLSL-cellular\n//\thttp://briansharpe.files.wordpress.com/2011/12/cellularsample.jpg\n//\n//\tSpeed up by using 2x2x2 search window instead of 3x3x3\n//\tproduces range of 0.0->1.0\n//\nfloat Cellular3D(vec3 P)\n{\n    //\testablish our grid cell and unit position\n    vec3 Pi = floor(P);\n    vec3 Pf = P - Pi;\n\n    //\tcalculate the hash.\n    //\t( various hashing methods listed in order of speed )\n    vec4 hash_x0, hash_y0, hash_z0, hash_x1, hash_y1, hash_z1;\n    FAST32_hash_3D( Pi, hash_x0, hash_y0, hash_z0, hash_x1, hash_y1, hash_z1 );\n    //SGPP_hash_3D( Pi, hash_x0, hash_y0, hash_z0, hash_x1, hash_y1, hash_z1 );\n\n    //\tgenerate the 8 random points\n#if 1\n    //\trestrict the random point offset to eliminate artifacts\n    //\twe'll improve the variance of the noise by pushing the points to the extremes of the jitter window\n    const float JITTER_WINDOW = 0.166666666;\t// 0.166666666 will guarentee no artifacts. It is the intersection on x of graphs f(x)=( (0.5 + (0.5-x))^2 + 2*((0.5-x)^2) ) and f(x)=( 2 * (( 0.5 + x )^2) + x * x )\n    hash_x0 = Cellular_weight_samples( hash_x0 ) * JITTER_WINDOW + vec4(0.0, 1.0, 0.0, 1.0);\n    hash_y0 = Cellular_weight_samples( hash_y0 ) * JITTER_WINDOW + vec4(0.0, 0.0, 1.0, 1.0);\n    hash_x1 = Cellular_weight_samples( hash_x1 ) * JITTER_WINDOW + vec4(0.0, 1.0, 0.0, 1.0);\n    hash_y1 = Cellular_weight_samples( hash_y1 ) * JITTER_WINDOW + vec4(0.0, 0.0, 1.0, 1.0);\n    hash_z0 = Cellular_weight_samples( hash_z0 ) * JITTER_WINDOW + vec4(0.0, 0.0, 0.0, 0.0);\n    hash_z1 = Cellular_weight_samples( hash_z1 ) * JITTER_WINDOW + vec4(1.0, 1.0, 1.0, 1.0);\n#else\n    //\tnon-weighted jitter window.  jitter window of 0.4 will give results similar to Stefans original implementation\n    //\tnicer looking, faster, but has minor artifacts.  ( discontinuities in signal )\n    const float JITTER_WINDOW = 0.4;\n    hash_x0 = hash_x0 * JITTER_WINDOW * 2.0 + vec4(-JITTER_WINDOW, 1.0-JITTER_WINDOW, -JITTER_WINDOW, 1.0-JITTER_WINDOW);\n    hash_y0 = hash_y0 * JITTER_WINDOW * 2.0 + vec4(-JITTER_WINDOW, -JITTER_WINDOW, 1.0-JITTER_WINDOW, 1.0-JITTER_WINDOW);\n    hash_x1 = hash_x1 * JITTER_WINDOW * 2.0 + vec4(-JITTER_WINDOW, 1.0-JITTER_WINDOW, -JITTER_WINDOW, 1.0-JITTER_WINDOW);\n    hash_y1 = hash_y1 * JITTER_WINDOW * 2.0 + vec4(-JITTER_WINDOW, -JITTER_WINDOW, 1.0-JITTER_WINDOW, 1.0-JITTER_WINDOW);\n    hash_z0 = hash_z0 * JITTER_WINDOW * 2.0 + vec4(-JITTER_WINDOW, -JITTER_WINDOW, -JITTER_WINDOW, -JITTER_WINDOW);\n    hash_z1 = hash_z1 * JITTER_WINDOW * 2.0 + vec4(1.0-JITTER_WINDOW, 1.0-JITTER_WINDOW, 1.0-JITTER_WINDOW, 1.0-JITTER_WINDOW);\n#endif\n\n    //\treturn the closest squared distance\n    vec4 dx1 = Pf.xxxx - hash_x0;\n    vec4 dy1 = Pf.yyyy - hash_y0;\n    vec4 dz1 = Pf.zzzz - hash_z0;\n    vec4 dx2 = Pf.xxxx - hash_x1;\n    vec4 dy2 = Pf.yyyy - hash_y1;\n    vec4 dz2 = Pf.zzzz - hash_z1;\n    vec4 d1 = dx1 * dx1 + dy1 * dy1 + dz1 * dz1;\n    vec4 d2 = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;\n    d1 = min(d1, d2);\n    d1.xy = min(d1.xy, d1.wz);\n    return min(d1.x, d1.y) * ( 9.0 / 12.0 );\t//\tscale return value from 0.0->1.333333 to 0.0->1.0  \t(2/3)^2 * 3  == (12/9) == 1.333333\n}\n\n\nvoid main()\n{\n\n   vec2 p=vec2(texCoord.x-0.5,texCoord.y-0.5);\n   p=p*scale;\n\n   p=vec2(p.x+0.5-x,p.y+0.5-y);\n\n   float v=Cellular3D(vec3(p.x,p.y,z));\n   vec4 col=vec4(v,v,v,1.0);\n   gl_FragColor = col;\n}\n";
op.name="CellularNoise";

var render=op.addInPort(new Port(op,"render",OP_PORT_TYPE_FUNCTION));
var x=op.inValue("X",0);
var y=op.inValue("Y",0);
var z=op.inValue("Z",0);
var scale=op.inValue("Scale",22);
var trigger=op.addOutPort(new Port(op,"trigger",OP_PORT_TYPE_FUNCTION));

var cgl=op.patch.cgl;
var shader=new CGL.Shader(cgl);
shader.setSource(shader.getDefaultVertexShader(),attachments.cellularnoise3d_frag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);

var uniZ=new CGL.Uniform(shader,'f','z',z);
var uniX=new CGL.Uniform(shader,'f','x',x);
var uniY=new CGL.Uniform(shader,'f','y',y);
var uniScale=new CGL.Uniform(shader,'f','scale',scale);

render.onTriggered=function()
{
    if(!cgl.currentTextureEffect)return;

    cgl.setShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.gl.activeTexture(cgl.gl.TEXTURE0);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, cgl.currentTextureEffect.getCurrentSourceTexture().tex );

    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    trigger.trigger();
};


};

Ops.Gl.TextureEffects.Noise.CellularNoise.prototype = new CABLES.Op();

//----------------

