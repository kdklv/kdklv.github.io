"use strict";

window.addEventListener("devicemotion", devicemotionHandler);
function devicemotionHandler(event) {
  // X軸 , Y軸 , Z軸
  const x = event.acceleration.x;
  const y = event.acceleration.y;
  const z = event.acceleration.z;
  document.getElementById("acceleration__detection__x").innerHTML = "x軸の加速度" + Math.trunc(x);
  document.getElementById("acceleration__detection__y").innerHTML = "y軸の加速度" + Math.trunc(y);
  document.getElementById("acceleration__detection__z").innerHTML = "z軸の加速度" + Math.trunc(z);
}


const matter = matter || {};
const canvas__width = document.documentElement.clientWidth;
const canvas__height = document.documentElement.clientHeight;

//使用するモジュールを決める
matter.module = function () {
  const Engine = Matter.Engine; //エンジンの作成と操作のためのモジュール
  const Render = Matter.Render; //HTML5キャンバスベースのレンダラを使用するモジュール
  const Runner = Matter.Runner; //エンジンをブラウザ内で自動的に更新するモジュール　　Engineモジュールのupdateは詳細に設定可能
  const Composites = Matter.Composites; //複合体(二つ以上のものが結合して一体となっているもの)を作成および操作するためのモジュールが含まれています。
  const Common = Matter.Common; //すべてのモジュールに共通する補助的な機能が含まれています。
  const MouseConstraint = Matter.MouseConstraint; //マウスの制約（ある条件を課して、自由にはさせないこと）を作成するためのモジュール
  const Mouse = Matter.Mouse; //マウスの操作を作成するためのモジュール
  const World = Matter.World; //物理演算の必要な要素（重力やシェイプなど）を作成するモジュール
  const Bodies = Matter.Bodies; //一般的に使用されるボディ構成（四角形、円、その他のポリゴンなど）を使用して剛体モデルを作成するためのモジュール

  //エンジンの設定
  const engine = Engine.create(); //新しいエンジンを作成します。optionsパラメータは、デフォルトで上書きするプロパティをもつオブジェクトです。
  const world = engine.world; //すべてのシミュレートされたボディと制約を含む

  //レンダリングの設定
  const render = Render.create({ //新しいレンダラーを作成します。optionsパラメータは、デフォルトを上書きするプロパティを指定するオブジェクトです。
    element: canvas__wrap, //キャンバスが挿入される要素への参照
    canvas: canvas__wrap__physics,
    engine: engine, //使用するMatter.Engineインスタンスへの参照
    options: { //オプション設定
      width: Math.min(canvas__width), //作成されるcanvasの幅（ピクセル単位）。デフォルト： 600
      height: Math.min(canvas__height), ////作成されるcanvasの高さ（ピクセル単位）。デフォルト： 800
      pixelRatio: 1, //ピクセル比率
      background: '#fafafa', //背景
      hasBounds: false, //レンダリング時にrender.boundsを使用するかどうかを指定するフラグ。
      enabled: true,
      wireframes: true } });



  //requestAnimationFrameはアニメーションを行いたいことを知らせて、再描画の前にアニメーションを更新するために指定した関数を呼び出す
  //キャンバスを継続的に更新します。
  Render.run(render);

  // create runner
  const runner = Runner.create(); //新しいランナーを作成します。
  Runner.run(runner, engine); //requestAnimationFrameでRunner.tickを呼び出して、Matter.Engineを継続的にチェックします。

  // add bodies
  //作成されたボディを含む新しいコンポジットをグリッド配列で作成します。 この関数は、重なりを防ぐために本体の境界を使用します。
  //複数の剛体をいっぺんに生成することが可能です
  //(xx, yy,columns, rows, columnGap(隙間), rowGap（隙間）, callback)
  const circle_stack = Composites.stack(10, 10, 8, 5, 0, 0, function (x, y) {
    //returnを書かないとだめ
    return Bodies.circle(x, y, Common.random(15, 20), { //Matter.Common.random（min、max） 最小値と最大値の間のランダム値を返します。
      isStatic: false,
      frictionAir: 0.01, //空気抵抗
      restitution: 0.3 //	弾力性
    });
  });
  //ワールドに追加
  World.add(world, circle_stack);

  World.add(world, [
  // walls
  //isStaticは物理的な能力はあるが動かない
  //rectangle（x、y、width、height、[options]）
  Bodies.rectangle(canvas__width / 2, -25, canvas__width, 50, { isStatic: true }), //上

  Bodies.rectangle(canvas__width - 55, canvas__height + 15, canvas__width / 1.5, 50, { isStatic: true, angle: -120 }), //右下
  Bodies.rectangle(canvas__width / 2, canvas__height + 25, canvas__width / 2, 50, { isStatic: true }), //下
  Bodies.rectangle(canvas__width / 6, canvas__height + 15, canvas__width / 1.5, 50, { isStatic: true, angle: 120 }), //左下

  Bodies.rectangle(canvas__width + 25, canvas__height / 2, 50, canvas__height, { isStatic: true }), //右
  Bodies.rectangle(-25, canvas__height / 2, 50, canvas__height, { isStatic: true }) //左
  ]);

  // add gyro control
  window.addEventListener("deviceorientation", deviceorientationHandler);
  function deviceorientationHandler(event) {
    // X軸 , Y軸 , Z軸
    const x = event.beta;
    const y = event.gamma;
    const z = event.alpha;
    document.getElementById("gyro__detection__x").innerHTML = "x軸の角度" + Math.trunc(x);
    document.getElementById("gyro__detection__y").innerHTML = "y軸の角度" + Math.trunc(y);
    document.getElementById("gyro__detection__z").innerHTML = "z軸の角度" + Math.trunc(z);

    //もしz軸が０ならorientationは１
    var orientation;
    if (z === 0) {
      orientation = 1;
    } else if (z !== 0) {
      orientation = 0;
    }
    //window.alert(orientation);
    //worldに重力設定を追加
    const gravity = engine.world.gravity;
    //デバイスの種類によって重力設定を変える
    // 1 = PC
    // 0 = iphone6s,　xperiaSOV32

    if (orientation === 0) {
      //Matter.Common.clamp（値、最小、最大） 最小値と最大値の間でクランプされた所定の値を返します。
      const orientation_0_y = Common.clamp(x, -90, 90) / 90;
      const orientation_0_x = Common.clamp(y, -90, 90) / 90;
      gravity.x = orientation_0_x;
      gravity.y = orientation_0_y;
      document.getElementById("mattar__gyrodetection__detection__x").innerHTML = "x軸の重力" + orientation_0_x;
      document.getElementById("mattar__gyrodetection__detection__y").innerHTML = "y軸の重力" + orientation_0_y;
    } else if (orientation === 1) {
      gravity.x = 0;
      gravity.y = 0.7;
    }
  }

  // マウスコントロール
  /*
  const mouse = Mouse.create(canvas__wrap__physics);//マウス入力を作成します。　optionはHTMLElement
  const mouseConstraint = MouseConstraint.create(engine, {　//新しいマウス制約を作成。
    mouse: mouse,//使用中のMouseインスタンス。 MouseConstraint.createで指定されていない場合は、1つ作成されます。
    constraint: {//制約
      stiffness: 1,// 剛性　0.2の値は、制約がソフトスプリングのように機能する。
      render: {
        visible: false //マウスの軌道可視化
      }
    }
  });
  //マウスの制約をワールドに追加
  World.add(world, mouseConstraint);  
  render.mouse = mouse; // レンダリングとマウスを同期させる
  */
  Render.lookAt(render, { //レンダービューポートをシーンに合わせる
    min: { x: 0, y: 0 },
    max: { x: canvas__width, y: canvas__height } });


  // MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: canvas__wrap__physics,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      window.addEventListener("deviceorientation", deviceorientationHandler);
    } };

};

matter.module();


/*
                 //canvasのサイズ
                 function setCanvasSize (){
                   const container = document.getElementById('canvas__wrap');
                   const canvas = document.getElementById('canvas__wrap__physics');
                   //canvasは親要素の大きさに従う
                   canvas.width = container.clientWidth;
                   canvas.height = container.clientHeight; 
                 }
                 
                 //ウィンドウを読み込んだら
                 window.onload = setCanvasSize;
                 //ウィンドウがリサイズされたら
                 window.onresize = setCanvasSize;
                 */