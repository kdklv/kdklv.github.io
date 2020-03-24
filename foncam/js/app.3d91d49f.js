(function(e) {
    function t(t) {
     for (var a, s, o = t[0], c = t[1], l = t[2], d = 0, v = []; d < o.length; d++) s = o[d], Object.prototype.hasOwnProperty.call(i, s) && i[s] && v.push(i[s][0]), i[s] = 0;
     for (a in c) Object.prototype.hasOwnProperty.call(c, a) && (e[a] = c[a]);
     u && u(t);
     while (v.length) v.shift()();
     return r.push.apply(r, l || []), n()
    }
   
    function n() {
     for (var e, t = 0; t < r.length; t++) {
      for (var n = r[t], a = !0, o = 1; o < n.length; o++) {
       var c = n[o];
       0 !== i[c] && (a = !1)
      }
      a && (r.splice(t--, 1), e = s(s.s = n[0]))
     }
     return e
    }
    var a = {},
     i = {
      app: 0
     },
     r = [];
   
    function s(t) {
     if (a[t]) return a[t].exports;
     var n = a[t] = {
      i: t,
      l: !1,
      exports: {}
     };
     return e[t].call(n.exports, n, n.exports, s), n.l = !0, n.exports
    }
    s.m = e, s.c = a, s.d = function(e, t, n) {
     s.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: n
     })
    }, s.r = function(e) {
     "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
     }), Object.defineProperty(e, "__esModule", {
      value: !0
     })
    }, s.t = function(e, t) {
     if (1 & t && (e = s(e)), 8 & t) return e;
     if (4 & t && "object" === typeof e && e && e.__esModule) return e;
     var n = Object.create(null);
     if (s.r(n), Object.defineProperty(n, "default", {
       enumerable: !0,
       value: e
      }), 2 & t && "string" != typeof e)
      for (var a in e) s.d(n, a, function(t) {
       return e[t]
      }.bind(null, a));
     return n
    }, s.n = function(e) {
     var t = e && e.__esModule ? function() {
      return e["default"]
     } : function() {
      return e
     };
     return s.d(t, "a", t), t
    }, s.o = function(e, t) {
     return Object.prototype.hasOwnProperty.call(e, t)
    }, s.p = "/";
    var o = window["webpackJsonp"] = window["webpackJsonp"] || [],
     c = o.push.bind(o);
    o.push = t, o = o.slice();
    for (var l = 0; l < o.length; l++) t(o[l]);
    var u = c;
    r.push([0, "chunk-vendors"]), n()
   })({
    0: function(e, t, n) {
     e.exports = n("56d7")
    },
    1: function(e, t) {},
    "111d": function(e, t, n) {},
    2: function(e, t) {},
    3: function(e, t) {},
    4: function(e, t) {},
    5: function(e, t) {},
    "56d7": function(e, t, n) {
     "use strict";
     n.r(t);
     n("e260"), n("e6cf"), n("cca6"), n("a79d");
     var a = n("2b0e"),
      i = function() {
       var e = this,
        t = e.$createElement,
        n = e._self._c || t;
       return n("v-app", {
        staticClass: "black theme--dark",
        attrs: {
         id: "app"
        }
       }, [n("v-content", {
        staticClass: "pa-0"
       }, [n("router-view")], 1)], 1)
      },
      r = [],
      s = (n("7faf"), n("2877")),
      o = n("6544"),
      c = n.n(o),
      l = n("7496"),
      u = n("a75b"),
      d = {},
      v = Object(s["a"])(d, i, r, !1, null, null, null),
      f = v.exports;
     c()(v, {
      VApp: l["a"],
      VContent: u["a"]
     });
     var g = n("8c4f"),
      h = function() {
       var e = this,
        t = e.$createElement,
        n = e._self._c || t;
       return n("v-container", {
        directives: [{
         name: "resize",
         rawName: "v-resize",
         value: e.onResize,
         expression: "onResize"
        }],
        staticClass: "pa-0",
        attrs: {
         fluid: "",
         "fill-height": ""
        }
       }, [n("v-app-bar", {
        staticClass: "app-toolbar transparent",
        attrs: {
         bottom: "",
         fixed: "",
         dense: "",
         flat: "",
         dark: ""
        }
       }, [n("v-btn", {
        attrs: {
         icon: ""
        },
        on: {
         click: e.onClickSettings
        }
       }, [n("v-icon", {
        attrs: {
         large: ""
        }
       }, [e._v("mdi-settings")])], 1), n("v-spacer"), n("v-btn", {
        attrs: {
         icon: ""
        },
        on: {
         click: e.onSwitchCamera
        }
       }, [n("v-icon", {
        attrs: {
         large: ""
        }
       }, [e._v("mdi-camera-switch")])], 1), n("v-spacer"), n("v-progress-circular", {
        style: {
         visibility: e.loading ? "visible" : "hidden"
        },
        attrs: {
         indeterminate: "",
         color: "white"
        }
       })], 1), n("v-dialog", {
        attrs: {
         fullscreen: "",
         "hide-overlay": "",
         transition: "dialog-bottom-transition",
         "content-class": "app-settings"
        },
        model: {
         value: e.dialog,
         callback: function(t) {
          e.dialog = t
         },
         expression: "dialog"
        }
       }, [n("v-card", [n("v-toolbar", {
        attrs: {
         dark: "",
         color: "primary"
        }
       }, [n("v-btn", {
        attrs: {
         icon: "",
         dark: ""
        },
        on: {
         click: function(t) {
          e.dialog = !1
         }
        }
       }, [n("v-icon", [e._v("mdi-close")])], 1), n("v-toolbar-title", [e._v("Settings")]), n("v-spacer"), n("v-toolbar-items", [n("v-btn", {
        attrs: {
         dark: "",
         text: ""
        },
        on: {
         click: function(t) {
          e.dialog = !1
         }
        }
       }, [e._v("Save")])], 1)], 1), n("v-list", {
        attrs: {
         "three-line": "",
         subheader: ""
        }
       }, [n("v-subheader", [e._v("Camera Settings")]), n("v-list-item", [n("v-list-item-content", [n("v-list-item-title", [e._v("Device")]), n("v-select", {
        attrs: {
         items: e.devices,
         "item-value": "deviceId",
         "item-text": "label"
        },
        model: {
         value: e.deviceId,
         callback: function(t) {
          e.deviceId = t
         },
         expression: "deviceId"
        }
       })], 1)], 1)], 1), n("v-divider"), n("v-list", {
        attrs: {
         "three-line": "",
         subheader: ""
        }
       }, [n("v-subheader", [e._v("Translation Settings")]), n("v-list-item", [n("v-list-item-content", [n("v-list-item-title", [e._v("Target Language")]), n("v-select", {
        attrs: {
         items: e.languages,
         "item-value": "code",
         "item-text": "name"
        },
        model: {
         value: e.targetLanguage,
         callback: function(t) {
          e.targetLanguage = t
         },
         expression: "targetLanguage"
        }
       })], 1)], 1)], 1), n("v-divider"), n("v-list", {
        attrs: {
         subheader: ""
        }
       }, [n("v-subheader", [e._v("Dictionaries")]), e._l(e.translations, (function(t) {
        return e._l(t, (function(t, a) {
         return n("v-list-item", {
          key: "entry-" + a
         }, [n("v-simple-table", {
          scopedSlots: e._u([{
           key: "default",
           fn: function() {
            return [n("thead", [n("tr", [n("th", {
             staticClass: "text-left"
            }, [e._v("English")]), n("th", {
             staticClass: "text-left"
            }, [e._v(e._s(e.languages.find((function(e) {
             return e.code == a
            })).name))])])]), n("tbody", e._l(t, (function(t, a) {
             return n("tr", {
              key: t
             }, [n("td", [e._v(e._s(a))]), n("td", [e._v(e._s(t))])])
            })), 0)]
           },
           proxy: !0
          }], null, !0)
         })], 1)
        }))
       }))], 2)], 1)], 1), n("v-row", {
        staticClass: "ma-0"
       }, [n("v-col", {
        staticClass: "pa-0",
        attrs: {
         cols: "12"
        }
       }, [n("div", {
        staticClass: "video-container"
       }, [n("vue-web-cam", {
        ref: "webcam",
        attrs: {
         width: "100%",
         height: "100%",
         "device-id": e.deviceId,
         resolution: e.resolution
        },
        on: {
         started: e.onStarted,
         stopped: e.onStopped,
         error: e.onError,
         cameras: e.onCameras,
         "camera-change": e.onCameraChange,
         "video-live": e.onVideoLive
        }
       }), n("div", {
        staticClass: "canvas-container"
       }, [n("canvas", {
        ref: "canvas",
        staticClass: "prediction-surface",
        attrs: {
         height: e.canvasDimensions.height,
         width: e.canvasDimensions.width
        }
       })])], 1)])], 1)], 1)
      },
      m = [],
      p = (n("7db0"), n("c740"), n("fb6a"), n("96cf"), n("1da1")),
      b = n("4f96"),
      w = n("5530"),
      x = n("b3cb"),
      y = n("c832"),
      C = n.n(y),
      S = n("c317"),
      _ = (n("0b53"), n("2f62")),
      k = {
       name: "App",
       components: {
        "vue-web-cam": x["WebCam"]
       },
       data: function() {
        return {
         img: null,
         camera: null,
         deviceId: null,
         loading: !0,
         dialog: !1,
         targetLanguage: "sl",
         devices: [],
         drawer: !1,
         classifier: null,
         resolution: this.getResolution(window.innerWidth, window.innerHeight),
         canvasDimensions: {
          width: window.innerWidth,
          height: window.innerHeight
         },
         activeBtn: 1,
         model: null
        }
       },
       computed: Object(w["a"])({}, Object(_["b"])(["languages", "translations"]), {
        device: function() {
         var e = this;
         return this.devices.find((function(t) {
          return t.deviceId === e.deviceId
         }))
        }
       }),
       watch: {
        camera: function(e) {
         this.deviceId = e
        },
        devices: function() {
         var e = Object(b["a"])(this.devices),
          t = e[0],
          n = e.slice(1);
         console.log("devices", t, n), t && (this.camera = t.deviceId, this.deviceId = t.deviceId)
        }
       },
       methods: {
        onClickSettings: function() {
         this.dialog = !this.dialogs
        },
        onSwitchCamera: function() {
         var e = this,
          t = this.devices.findIndex((function(t) {
           return t.deviceId === e.deviceId
          }));
         this.camera = this.devices[(t + 1) % this.devices.length].deviceId
        },
        getResolution: function(e, t) {
         return e < t ? {
          width: t,
          height: e
         } : {
          width: e,
          height: t
         }
        },
        onCapture: function() {
         this.img = this.$refs.webcam.capture()
        },
        onStarted: function(e) {
         var t = this;
         return Object(p["a"])(regeneratorRuntime.mark((function n() {
          return regeneratorRuntime.wrap((function(n) {
           while (1) switch (n.prev = n.next) {
            case 0:
             if (console.log("On Started Event", e), t.loading = !0, t.model) {
              n.next = 6;
              break
             }
             return n.next = 5, S["a"]();
            case 5:
             t.model = n.sent;
            case 6:
             t.detectFrame(t.$refs.webcam.$refs.video, t.model), t.loading = !1;
            case 8:
            case "end":
             return n.stop()
           }
          }), n)
         })))()
        },
        onStopped: function(e) {
         console.log("On Stopped Event", e)
        },
        onStop: function() {
         this.$refs.webcam.stop()
        },
        onStart: function() {
         this.$refs.webcam.start()
        },
        onVideoLive: function(e) {
         var t = e.getVideoTracks()[0].getSettings();
         console.log("On Video Live Event", e, t.height, t.width), this.canvasDimensions = {
          width: t.width,
          height: t.height
         }
        },
        onError: function(e) {
         console.log("On Error Event", e)
        },
        onCameras: function(e) {
         console.log("On Cameras Event", e), this.devices = e
        },
        onCameraChange: function(e) {
         console.log("On Camera Change Event", e), this.deviceId = e, this.camera = e
        },
        onResize: function() {
         this.$refs.webcam.stop(), this.resolution = this.getResolution(window.innerWidth, window.innerHeight), this.$refs.webcam.start()
        },
        detectFrame: function(e, t) {
         var n = this;
         4 === e.readyState ? t.detect(e).then((function(a) {
          n.renderPredictions(a), requestAnimationFrame((function() {
           n.detectFrame(e, t)
          }))
         })) : requestAnimationFrame((function() {
          n.detectFrame(e, t)
         }))
        },
        renderPredictions: function(e) {
         var t = this.$refs.canvas.getContext("2d");
         t.clearRect(0, 0, t.canvas.width, t.canvas.height);
         var n = "24px sans-serif";
         t.font = n, t.textBaseline = "top";
         var a = e.length;
         while (a--) {
          var i = e[a],
           r = i.bbox[0],
           s = i.bbox[1],
           o = i.bbox[2],
           c = i.bbox[3];
          t.strokeStyle = "#FFFFFF", t.lineWidth = 4, t.strokeRect(r, s, o, c);
          var l = C()(this.$store.state.translations, ["en", this.targetLanguage, i.class]);
          l || (this.$store.dispatch("getTranslations", {
           from: "en",
           to: this.targetLanguage,
           originals: [i.class]
          }), l = "Loading..."), t.fillStyle = "#FFFFFF";
          var u = t.measureText(i.class).width,
           d = parseInt(n, 10),
           v = r + .5 * o - .5 * u,
           f = s + .5 * c - .5 * d;
          t.fillRect(v, f, u + 4, d + 4);
          var g = t.measureText(l).width,
           h = r + .5 * o - .5 * g,
           m = s + .5 * c - .5 * d + d;
          t.fillRect(h, m, g + 4, d + 4)
         }
         a = e.length;
         while (a--) {
          var p = e[a],
           b = t.measureText(p.class).width,
           w = parseInt(n, 10),
           x = p.bbox[0] + .5 * p.bbox[2] - .5 * b,
           y = p.bbox[1] + .5 * p.bbox[3] - .5 * w;
          t.fillStyle = "#000000", t.fillText(p.class, x, y);
          var S = C()(this.$store.state.translations, ["en", this.targetLanguage, p.class]),
           _ = t.measureText(S).width,
           k = p.bbox[0] + .5 * p.bbox[2] - .5 * _,
           V = p.bbox[1] + .5 * p.bbox[3] - .5 * w + w;
          t.fillText(S, k, V)
         }
        }
       },
       created: function() {
        this.$store.dispatch("getLanguages")
       }
      },
      V = k,
      F = (n("c219"), n("40dc")),
      O = n("8336"),
      T = n("b0af"),
      I = n("62ad"),
      L = n("a523"),
      R = n("169a"),
      j = n("ce7e"),
      $ = n("132d"),
      E = n("8860"),
      P = n("da13"),
      D = n("5d23"),
      A = n("490a"),
      z = n("0fd9"),
      B = n("b974"),
      W = n("1f4f"),
      q = n("2fa4"),
      H = n("e0c7"),
      M = n("71d9"),
      J = n("2a7f"),
      N = n("269a"),
      G = n.n(N),
      K = n("dc22"),
      Q = Object(s["a"])(V, h, m, !1, null, null, null),
      U = Q.exports;
     c()(Q, {
      VAppBar: F["a"],
      VBtn: O["a"],
      VCard: T["a"],
      VCol: I["a"],
      VContainer: L["a"],
      VDialog: R["a"],
      VDivider: j["a"],
      VIcon: $["a"],
      VList: E["a"],
      VListItem: P["a"],
      VListItemContent: D["a"],
      VListItemTitle: D["b"],
      VProgressCircular: A["a"],
      VRow: z["a"],
      VSelect: B["a"],
      VSimpleTable: W["a"],
      VSpacer: q["a"],
      VSubheader: H["a"],
      VToolbar: M["a"],
      VToolbarItems: J["a"],
      VToolbarTitle: J["b"]
     }), G()(Q, {
      Resize: K["a"]
     }), a["a"].use(g["a"]);
     var X = [{
       path: "/",
       name: "Home",
       component: U
      }],
      Y = new g["a"]({
       mode: "history",
       base: "/",
       routes: X
      }),
      Z = Y,
      ee = (n("4160"), n("159b"), n("bc3a")),
      te = n.n(ee);
     a["a"].use(_["a"]);
     var ne = new _["a"].Store({
       state: {
        translations: {},
        languages: [{
         name: "Arabic",
         code: "ar"
        }]
       },
       mutations: {
        setTranslationsRequested: function(e, t) {
         var n = t.to,
          i = t.from,
          r = t.originals;
         a["a"].set(e.translations, i, e.translations[i] || {}), a["a"].set(e.translations[i], n, e.translations[i][n] || {}), r.forEach((function(t, r) {
          a["a"].set(e.translations[i][n], t, "Loading...")
         }))
        },
        setTranslations: function(e, t) {
         var n = t.to,
          i = t.from,
          r = t.originals,
          s = t.translations;
         a["a"].set(e.translations, i, e.translations[i] || {}), a["a"].set(e.translations[i], n, e.translations[i][n] || {}), r.forEach((function(t, r) {
          a["a"].set(e.translations[i][n], t, s[r])
         }))
        },
        setLanguages: function(e, t) {
         var n = t.languages;
         e.languages = n
        }
       },
       actions: {
        getTranslations: function(e, t) {
         var n = e.commit,
          a = t.to,
          i = t.from,
          r = t.originals;
         return Object(p["a"])(regeneratorRuntime.mark((function e() {
          var t;
          return regeneratorRuntime.wrap((function(e) {
           while (1) switch (e.prev = e.next) {
            case 0:
             return console.debug("Translating...".concat(JSON.stringify(i))), n("setTranslationsRequested", {
              to: a,
              from: i,
              originals: r
             }), e.next = 4, te.a.post("https://europe-west1-capture-translate.cloudfunctions.net/translate", {
              to: a,
              from: i,
              text: r
             });
            case 4:
             return t = e.sent, n("setTranslations", {
              to: a,
              from: i,
              originals: r,
              translations: t.data
             }), e.abrupt("return", t.data);
            case 7:
            case "end":
             return e.stop()
           }
          }), e)
         })))()
        },
        getLanguages: function(e) {
         var t = e.commit;
         return Object(p["a"])(regeneratorRuntime.mark((function e() {
          var n;
          return regeneratorRuntime.wrap((function(e) {
           while (1) switch (e.prev = e.next) {
            case 0:
             return e.next = 2, te.a.get("https://europe-west1-capture-translate.cloudfunctions.net/languages");
            case 2:
             return n = e.sent, t("setLanguages", {
              languages: n.data
             }), e.abrupt("return", n.data);
            case 5:
            case "end":
             return e.stop()
           }
          }), e)
         })))()
        }
       },
       modules: {}
      }),
      ae = n("f309");
     a["a"].use(ae["a"]);
     var ie = new ae["a"]({
      theme: {
       themes: {
        light: {
         primary: "#ee44aa",
         secondary: "#424242",
         accent: "#82B1FF",
         error: "#FF5252",
         info: "#2196F3",
         success: "#4CAF50",
         warning: "#FFC107"
        }
       }
      }
     });
     n("d5e8"), n("5363");
     a["a"].config.productionTip = !1, new a["a"]({
      router: Z,
      store: ne,
      vuetify: ie,
      render: function(e) {
       return e(f)
      }
     }).$mount("#app")
    },
    "5c85": function(e, t, n) {},
    6: function(e, t) {},
    7: function(e, t) {},
    "7faf": function(e, t, n) {
     "use strict";
     var a = n("111d"),
      i = n.n(a);
     i.a
    },
    8: function(e, t) {},
    9: function(e, t) {},
    c219: function(e, t, n) {
     "use strict";
     var a = n("5c85"),
      i = n.n(a);
     i.a
    }
   });
   //# sourceMappingURL=app.3d91d49f.js.map