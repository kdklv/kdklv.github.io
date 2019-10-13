var CABLES;
!function (t, e) {
    if ("object" == typeof exports && "object" == typeof module) 
        module.exports = e();
    else if ("function" == typeof define && define.amd) 
        define([], e);
    else {
        var i = e();
        for (var n in i) 
            (
                "object" == typeof exports
                    ? exports
                    : t
            )[n] = i[n]
    }
}(this, function () {
    return function (t) {
        function e(n) {
            if (i[n]) 
                return i[n].exports;
            var r = i[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return t[n].call(r.exports, r, r.exports, e),
            r.loaded = !0,
            r.exports
        }
        var i = {};
        return e.m = t,
        e.c = i,
        e.p = "",
        e(0)
    }([
        function (t, e, i) {
            e.glMatrix = i(1),
            e.mat2 = i(2),
            e.mat2d = i(3),
            e.mat3 = i(4),
            e.mat4 = i(5),
            e.quat = i(6),
            e.vec2 = i(9),
            e.vec3 = i(7),
            e.vec4 = i(8)
        },
        function (t, e) {
            var i = {
                EPSILON: 1e-6
            };
            i.ARRAY_TYPE = "undefined" != typeof Float32Array
                ? Float32Array
                : Array,
            i.RANDOM = Math.random,
            i.ENABLE_SIMD = !1,
            i.SIMD_AVAILABLE = i.ARRAY_TYPE === this.Float32Array && "SIMD" in this,
            i.USE_SIMD = i.ENABLE_SIMD && i.SIMD_AVAILABLE,
            i.setMatrixArrayType = function (t) {
                i.ARRAY_TYPE = t
            };
            var n = Math.PI / 180;
            i.toRadian = function (t) {
                return t * n
            },
            i.equals = function (t, e) {
                return Math.abs(t - e) <= i.EPSILON * Math.max(1, Math.abs(t), Math.abs(e))
            },
            t.exports = i
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(4);
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(4);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e[2] = t[2],
                        e[3] = t[3],
                        e
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t[3] = e[3],
                        t
                    },
                    identity: function (t) {
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t
                    },
                    fromValues: function (t, e, i, r) {
                        var s = new n.ARRAY_TYPE(4);
                        return s[0] = t,
                        s[1] = e,
                        s[2] = i,
                        s[3] = r,
                        s
                    },
                    set: function (t, e, i, n, r) {
                        return t[0] = e,
                        t[1] = i,
                        t[2] = n,
                        t[3] = r,
                        t
                    },
                    transpose: function (t, e) {
                        if (t === e) {
                            var i = e[1];
                            t[1] = e[2],
                            t[2] = i
                        } else 
                            t[0] = e[0],
                            t[1] = e[2],
                            t[2] = e[1],
                            t[3] = e[3];
                        return t
                    },
                    invert: function (t, e) {
                        var i = e[0],
                            n = e[1],
                            r = e[2],
                            s = e[3],
                            a = i * s - r * n;
                        return a
                            ? (a = 1 / a, t[0] = s * a, t[1] = -n * a, t[2] = -r * a, t[3] = i * a, t)
                            : null
                    },
                    adjoint: function (t, e) {
                        var i = e[0];
                        return t[0] = e[3],
                        t[1] = -e[1],
                        t[2] = -e[2],
                        t[3] = i,
                        t
                    },
                    determinant: function (t) {
                        return t[0] * t[3] - t[2] * t[1]
                    },
                    multiply: function (t, e, i) {
                        var n = e[0],
                            r = e[1],
                            s = e[2],
                            a = e[3],
                            o = i[0],
                            l = i[1],
                            h = i[2],
                            u = i[3];
                        return t[0] = n * o + s * l,
                        t[1] = r * o + a * l,
                        t[2] = n * h + s * u,
                        t[3] = r * h + a * u,
                        t
                    }
                };
            r.mul = r.multiply,
            r.rotate = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = Math.sin(i),
                    l = Math.cos(i);
                return t[0] = n * l + s * o,
                t[1] = r * l + a * o,
                t[2] = n * -o + s * l,
                t[3] = r * -o + a * l,
                t
            },
            r.scale = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = i[0],
                    l = i[1];
                return t[0] = n * o,
                t[1] = r * o,
                t[2] = s * l,
                t[3] = a * l,
                t
            },
            r.fromRotation = function (t, e) {
                var i = Math.sin(e),
                    n = Math.cos(e);
                return t[0] = n,
                t[1] = i,
                t[2] = -i,
                t[3] = n,
                t
            },
            r.fromScaling = function (t, e) {
                return t[0] = e[0],
                t[1] = 0,
                t[2] = 0,
                t[3] = e[1],
                t
            },
            r.str = function (t) {
                return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            },
            r.frob = function (t) {
                return Math.sqrt(
                    Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2)
                )
            },
            r.LDU = function (t, e, i, n) {
                return t[2] = n[2] / n[0],
                i[0] = n[0],
                i[1] = n[1],
                i[3] = n[3] - t[2] * i[1],
                [t, e, i]
            },
            r.add = function (t, e, i) {
                return t[0] = e[0] + i[0],
                t[1] = e[1] + i[1],
                t[2] = e[2] + i[2],
                t[3] = e[3] + i[3],
                t
            },
            r.subtract = function (t, e, i) {
                return t[0] = e[0] - i[0],
                t[1] = e[1] - i[1],
                t[2] = e[2] - i[2],
                t[3] = e[3] - i[3],
                t
            },
            r.sub = r.subtract,
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = t[2],
                    a = t[3],
                    o = e[0],
                    l = e[1],
                    h = e[2],
                    u = e[3];
                return Math.abs(i - o) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(
                    r - l
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(s - h) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(s),
                    Math.abs(h)
                ) && Math.abs(a - u) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(u))
            },
            r.multiplyScalar = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t[2] = e[2] * i,
                t[3] = e[3] * i,
                t
            },
            r.multiplyScalarAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t[2] = e[2] + i[2] * n,
                t[3] = e[3] + i[3] * n,
                t
            },
            t.exports = r
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(6);
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t[4] = 0,
                        t[5] = 0,
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(6);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e[2] = t[2],
                        e[3] = t[3],
                        e[4] = t[4],
                        e[5] = t[5],
                        e
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t[3] = e[3],
                        t[4] = e[4],
                        t[5] = e[5],
                        t
                    },
                    identity: function (t) {
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t[4] = 0,
                        t[5] = 0,
                        t
                    },
                    fromValues: function (t, e, i, r, s, a) {
                        var o = new n.ARRAY_TYPE(6);
                        return o[0] = t,
                        o[1] = e,
                        o[2] = i,
                        o[3] = r,
                        o[4] = s,
                        o[5] = a,
                        o
                    },
                    set: function (t, e, i, n, r, s, a) {
                        return t[0] = e,
                        t[1] = i,
                        t[2] = n,
                        t[3] = r,
                        t[4] = s,
                        t[5] = a,
                        t
                    },
                    invert: function (t, e) {
                        var i = e[0],
                            n = e[1],
                            r = e[2],
                            s = e[3],
                            a = e[4],
                            o = e[5],
                            l = i * s - n * r;
                        return l
                            ? (
                                l = 1 / l,
                                t[0] = s * l,
                                t[1] = -n * l,
                                t[2] = -r * l,
                                t[3] = i * l,
                                t[4] = (r * o - s * a) * l,
                                t[5] = (n * a - i * o) * l,
                                t
                            )
                            : null
                    },
                    determinant: function (t) {
                        return t[0] * t[3] - t[1] * t[2]
                    },
                    multiply: function (t, e, i) {
                        var n = e[0],
                            r = e[1],
                            s = e[2],
                            a = e[3],
                            o = e[4],
                            l = e[5],
                            h = i[0],
                            u = i[1],
                            c = i[2],
                            p = i[3],
                            d = i[4],
                            f = i[5];
                        return t[0] = n * h + s * u,
                        t[1] = r * h + a * u,
                        t[2] = n * c + s * p,
                        t[3] = r * c + a * p,
                        t[4] = n * d + s * f + o,
                        t[5] = r * d + a * f + l,
                        t
                    }
                };
            r.mul = r.multiply,
            r.rotate = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = e[4],
                    l = e[5],
                    h = Math.sin(i),
                    u = Math.cos(i);
                return t[0] = n * u + s * h,
                t[1] = r * u + a * h,
                t[2] = n * -h + s * u,
                t[3] = r * -h + a * u,
                t[4] = o,
                t[5] = l,
                t
            },
            r.scale = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = e[4],
                    l = e[5],
                    h = i[0],
                    u = i[1];
                return t[0] = n * h,
                t[1] = r * h,
                t[2] = s * u,
                t[3] = a * u,
                t[4] = o,
                t[5] = l,
                t
            },
            r.translate = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = e[4],
                    l = e[5],
                    h = i[0],
                    u = i[1];
                return t[0] = n,
                t[1] = r,
                t[2] = s,
                t[3] = a,
                t[4] = n * h + s * u + o,
                t[5] = r * h + a * u + l,
                t
            },
            r.fromRotation = function (t, e) {
                var i = Math.sin(e),
                    n = Math.cos(e);
                return t[0] = n,
                t[1] = i,
                t[2] = -i,
                t[3] = n,
                t[4] = 0,
                t[5] = 0,
                t
            },
            r.fromScaling = function (t, e) {
                return t[0] = e[0],
                t[1] = 0,
                t[2] = 0,
                t[3] = e[1],
                t[4] = 0,
                t[5] = 0,
                t
            },
            r.fromTranslation = function (t, e) {
                return t[0] = 1,
                t[1] = 0,
                t[2] = 0,
                t[3] = 1,
                t[4] = e[0],
                t[5] = e[1],
                t
            },
            r.str = function (t) {
                return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] +
                        ", " + t[5] + ")"
            },
            r.frob = function (t) {
                return Math.sqrt(
                    Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) +
                    Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1
                )
            },
            r.add = function (t, e, i) {
                return t[0] = e[0] + i[0],
                t[1] = e[1] + i[1],
                t[2] = e[2] + i[2],
                t[3] = e[3] + i[3],
                t[4] = e[4] + i[4],
                t[5] = e[5] + i[5],
                t
            },
            r.subtract = function (t, e, i) {
                return t[0] = e[0] - i[0],
                t[1] = e[1] - i[1],
                t[2] = e[2] - i[2],
                t[3] = e[3] - i[3],
                t[4] = e[4] - i[4],
                t[5] = e[5] - i[5],
                t
            },
            r.sub = r.subtract,
            r.multiplyScalar = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t[2] = e[2] * i,
                t[3] = e[3] * i,
                t[4] = e[4] * i,
                t[5] = e[5] * i,
                t
            },
            r.multiplyScalarAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t[2] = e[2] + i[2] * n,
                t[3] = e[3] + i[3] * n,
                t[4] = e[4] + i[4] * n,
                t[5] = e[5] + i[5] * n,
                t
            },
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = t[2],
                    a = t[3],
                    o = t[4],
                    l = t[5],
                    h = e[0],
                    u = e[1],
                    c = e[2],
                    p = e[3],
                    d = e[4],
                    f = e[5];
                return Math.abs(i - h) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(h)) && Math.abs(
                    r - u
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(u)) && Math.abs(s - c) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(s),
                    Math.abs(c)
                ) && Math.abs(a - p) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(p)) && Math.abs(
                    o - d
                ) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(d)) && Math.abs(l - f) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(l),
                    Math.abs(f)
                )
            },
            t.exports = r
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(9);
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 1,
                        t[5] = 0,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 1,
                        t
                    },
                    fromMat4: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t[3] = e[4],
                        t[4] = e[5],
                        t[5] = e[6],
                        t[6] = e[8],
                        t[7] = e[9],
                        t[8] = e[10],
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(9);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e[2] = t[2],
                        e[3] = t[3],
                        e[4] = t[4],
                        e[5] = t[5],
                        e[6] = t[6],
                        e[7] = t[7],
                        e[8] = t[8],
                        e
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t[3] = e[3],
                        t[4] = e[4],
                        t[5] = e[5],
                        t[6] = e[6],
                        t[7] = e[7],
                        t[8] = e[8],
                        t
                    },
                    fromValues: function (t, e, i, r, s, a, o, l, h) {
                        var u = new n.ARRAY_TYPE(9);
                        return u[0] = t,
                        u[1] = e,
                        u[2] = i,
                        u[3] = r,
                        u[4] = s,
                        u[5] = a,
                        u[6] = o,
                        u[7] = l,
                        u[8] = h,
                        u
                    },
                    set: function (t, e, i, n, r, s, a, o, l, h) {
                        return t[0] = e,
                        t[1] = i,
                        t[2] = n,
                        t[3] = r,
                        t[4] = s,
                        t[5] = a,
                        t[6] = o,
                        t[7] = l,
                        t[8] = h,
                        t
                    },
                    identity: function (t) {
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 1,
                        t[5] = 0,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 1,
                        t
                    },
                    transpose: function (t, e) {
                        if (t === e) {
                            var i = e[1],
                                n = e[2],
                                r = e[5];
                            t[1] = e[3],
                            t[2] = e[6],
                            t[3] = i,
                            t[5] = e[7],
                            t[6] = n,
                            t[7] = r
                        } else 
                            t[0] = e[0],
                            t[1] = e[3],
                            t[2] = e[6],
                            t[3] = e[1],
                            t[4] = e[4],
                            t[5] = e[7],
                            t[6] = e[2],
                            t[7] = e[5],
                            t[8] = e[8];
                        return t
                    },
                    invert: function (t, e) {
                        var i = e[0],
                            n = e[1],
                            r = e[2],
                            s = e[3],
                            a = e[4],
                            o = e[5],
                            l = e[6],
                            h = e[7],
                            u = e[8],
                            c = u * a - o * h,
                            p = -u * s + o * l,
                            d = h * s - a * l,
                            f = i * c + n * p + r * d;
                        return f
                            ? (
                                f = 1 / f,
                                t[0] = c * f,
                                t[1] = (-u * n + r * h) * f,
                                t[2] = (o * n - r * a) * f,
                                t[3] = p * f,
                                t[4] = (u * i - r * l) * f,
                                t[5] = (-o * i + r * s) * f,
                                t[6] = d * f,
                                t[7] = (-h * i + n * l) * f,
                                t[8] = (a * i - n * s) * f,
                                t
                            )
                            : null
                    },
                    adjoint: function (t, e) {
                        var i = e[0],
                            n = e[1],
                            r = e[2],
                            s = e[3],
                            a = e[4],
                            o = e[5],
                            l = e[6],
                            h = e[7],
                            u = e[8];
                        return t[0] = a * u - o * h,
                        t[1] = r * h - n * u,
                        t[2] = n * o - r * a,
                        t[3] = o * l - s * u,
                        t[4] = i * u - r * l,
                        t[5] = r * s - i * o,
                        t[6] = s * h - a * l,
                        t[7] = n * l - i * h,
                        t[8] = i * a - n * s,
                        t
                    },
                    determinant: function (t) {
                        var e = t[0],
                            i = t[1],
                            n = t[2],
                            r = t[3],
                            s = t[4],
                            a = t[5],
                            o = t[6],
                            l = t[7],
                            h = t[8];
                        return e * (h * s - a * l) + i * (-h * r + a * o) + n * (l * r - s * o)
                    },
                    multiply: function (t, e, i) {
                        var n = e[0],
                            r = e[1],
                            s = e[2],
                            a = e[3],
                            o = e[4],
                            l = e[5],
                            h = e[6],
                            u = e[7],
                            c = e[8],
                            p = i[0],
                            d = i[1],
                            f = i[2],
                            g = i[3],
                            _ = i[4],
                            m = i[5],
                            v = i[6],
                            b = i[7],
                            M = i[8];
                        return t[0] = p * n + d * a + f * h,
                        t[1] = p * r + d * o + f * u,
                        t[2] = p * s + d * l + f * c,
                        t[3] = g * n + _ * a + m * h,
                        t[4] = g * r + _ * o + m * u,
                        t[5] = g * s + _ * l + m * c,
                        t[6] = v * n + b * a + M * h,
                        t[7] = v * r + b * o + M * u,
                        t[8] = v * s + b * l + M * c,
                        t
                    }
                };
            r.mul = r.multiply,
            r.translate = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = e[4],
                    l = e[5],
                    h = e[6],
                    u = e[7],
                    c = e[8],
                    p = i[0],
                    d = i[1];
                return t[0] = n,
                t[1] = r,
                t[2] = s,
                t[3] = a,
                t[4] = o,
                t[5] = l,
                t[6] = p * n + d * a + h,
                t[7] = p * r + d * o + u,
                t[8] = p * s + d * l + c,
                t
            },
            r.rotate = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = e[4],
                    l = e[5],
                    h = e[6],
                    u = e[7],
                    c = e[8],
                    p = Math.sin(i),
                    d = Math.cos(i);
                return t[0] = d * n + p * a,
                t[1] = d * r + p * o,
                t[2] = d * s + p * l,
                t[3] = d * a - p * n,
                t[4] = d * o - p * r,
                t[5] = d * l - p * s,
                t[6] = h,
                t[7] = u,
                t[8] = c,
                t
            },
            r.scale = function (t, e, i) {
                var n = i[0],
                    r = i[1];
                return t[0] = n * e[0],
                t[1] = n * e[1],
                t[2] = n * e[2],
                t[3] = r * e[3],
                t[4] = r * e[4],
                t[5] = r * e[5],
                t[6] = e[6],
                t[7] = e[7],
                t[8] = e[8],
                t
            },
            r.fromTranslation = function (t, e) {
                return t[0] = 1,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 1,
                t[5] = 0,
                t[6] = e[0],
                t[7] = e[1],
                t[8] = 1,
                t
            },
            r.fromRotation = function (t, e) {
                var i = Math.sin(e),
                    n = Math.cos(e);
                return t[0] = n,
                t[1] = i,
                t[2] = 0,
                t[3] = -i,
                t[4] = n,
                t[5] = 0,
                t[6] = 0,
                t[7] = 0,
                t[8] = 1,
                t
            },
            r.fromScaling = function (t, e) {
                return t[0] = e[0],
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = e[1],
                t[5] = 0,
                t[6] = 0,
                t[7] = 0,
                t[8] = 1,
                t
            },
            r.fromMat2d = function (t, e) {
                return t[0] = e[0],
                t[1] = e[1],
                t[2] = 0,
                t[3] = e[2],
                t[4] = e[3],
                t[5] = 0,
                t[6] = e[4],
                t[7] = e[5],
                t[8] = 1,
                t
            },
            r.fromQuat = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = i + i,
                    o = n + n,
                    l = r + r,
                    h = i * a,
                    u = n * a,
                    c = n * o,
                    p = r * a,
                    d = r * o,
                    f = r * l,
                    g = s * a,
                    _ = s * o,
                    m = s * l;
                return t[0] = 1 - c - f,
                t[3] = u - m,
                t[6] = p + _,
                t[1] = u + m,
                t[4] = 1 - h - f,
                t[7] = d - g,
                t[2] = p - _,
                t[5] = d + g,
                t[8] = 1 - h - c,
                t
            },
            r.normalFromMat4 = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = e[4],
                    o = e[5],
                    l = e[6],
                    h = e[7],
                    u = e[8],
                    c = e[9],
                    p = e[10],
                    d = e[11],
                    f = e[12],
                    g = e[13],
                    _ = e[14],
                    m = e[15],
                    v = i * o - n * a,
                    b = i * l - r * a,
                    M = i * h - s * a,
                    E = n * l - r * o,
                    I = n * h - s * o,
                    A = r * h - s * l,
                    x = u * g - c * f,
                    O = u * _ - p * f,
                    T = u * m - d * f,
                    S = c * _ - p * g,
                    y = c * m - d * g,
                    R = p * m - d * _,
                    F = v * R - b * y + M * S + E * T - I * O + A * x;
                return F
                    ? (
                        F = 1 / F,
                        t[0] = (o * R - l * y + h * S) * F,
                        t[1] = (l * T - a * R - h * O) * F,
                        t[2] = (a * y - o * T + h * x) * F,
                        t[3] = (r * y - n * R - s * S) * F,
                        t[4] = (i * R - r * T + s * O) * F,
                        t[5] = (n * T - i * y - s * x) * F,
                        t[6] = (g * A - _ * I + m * E) * F,
                        t[7] = (_ * M - f * A - m * b) * F,
                        t[8] = (f * I - g * M + m * v) * F,
                        t
                    )
                    : null
            },
            r.str = function (t) {
                return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] +
                        ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
            },
            r.frob = function (t) {
                return Math.sqrt(
                    Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) +
                    Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) +
                    Math.pow(t[8], 2)
                )
            },
            r.add = function (t, e, i) {
                return t[0] = e[0] + i[0],
                t[1] = e[1] + i[1],
                t[2] = e[2] + i[2],
                t[3] = e[3] + i[3],
                t[4] = e[4] + i[4],
                t[5] = e[5] + i[5],
                t[6] = e[6] + i[6],
                t[7] = e[7] + i[7],
                t[8] = e[8] + i[8],
                t
            },
            r.subtract = function (t, e, i) {
                return t[0] = e[0] - i[0],
                t[1] = e[1] - i[1],
                t[2] = e[2] - i[2],
                t[3] = e[3] - i[3],
                t[4] = e[4] - i[4],
                t[5] = e[5] - i[5],
                t[6] = e[6] - i[6],
                t[7] = e[7] - i[7],
                t[8] = e[8] - i[8],
                t
            },
            r.sub = r.subtract,
            r.multiplyScalar = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t[2] = e[2] * i,
                t[3] = e[3] * i,
                t[4] = e[4] * i,
                t[5] = e[5] * i,
                t[6] = e[6] * i,
                t[7] = e[7] * i,
                t[8] = e[8] * i,
                t
            },
            r.multiplyScalarAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t[2] = e[2] + i[2] * n,
                t[3] = e[3] + i[3] * n,
                t[4] = e[4] + i[4] * n,
                t[5] = e[5] + i[5] * n,
                t[6] = e[6] + i[6] * n,
                t[7] = e[7] + i[7] * n,
                t[8] = e[8] + i[8] * n,
                t
            },
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = t[2],
                    a = t[3],
                    o = t[4],
                    l = t[5],
                    h = t[6],
                    u = t[7],
                    c = t[8],
                    p = e[0],
                    d = e[1],
                    f = e[2],
                    g = e[3],
                    _ = e[4],
                    m = e[5],
                    v = t[6],
                    b = e[7],
                    M = e[8];
                return Math.abs(i - p) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(p)) && Math.abs(
                    r - d
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(d)) && Math.abs(s - f) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(s),
                    Math.abs(f)
                ) && Math.abs(a - g) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(g)) && Math.abs(
                    o - _
                ) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(_)) && Math.abs(l - m) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(l),
                    Math.abs(m)
                ) && Math.abs(h - v) <= n.EPSILON * Math.max(1, Math.abs(h), Math.abs(v)) && Math.abs(
                    u - b
                ) <= n.EPSILON * Math.max(1, Math.abs(u), Math.abs(b)) && Math.abs(c - M) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(c),
                    Math.abs(M)
                )
            },
            t.exports = r
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    scalar: {},
                    SIMD: {},
                    create: function () {
                        var t = new n.ARRAY_TYPE(16);
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = 1,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = 1,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(16);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e[2] = t[2],
                        e[3] = t[3],
                        e[4] = t[4],
                        e[5] = t[5],
                        e[6] = t[6],
                        e[7] = t[7],
                        e[8] = t[8],
                        e[9] = t[9],
                        e[10] = t[10],
                        e[11] = t[11],
                        e[12] = t[12],
                        e[13] = t[13],
                        e[14] = t[14],
                        e[15] = t[15],
                        e
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t[3] = e[3],
                        t[4] = e[4],
                        t[5] = e[5],
                        t[6] = e[6],
                        t[7] = e[7],
                        t[8] = e[8],
                        t[9] = e[9],
                        t[10] = e[10],
                        t[11] = e[11],
                        t[12] = e[12],
                        t[13] = e[13],
                        t[14] = e[14],
                        t[15] = e[15],
                        t
                    },
                    fromValues: function (t, e, i, r, s, a, o, l, h, u, c, p, d, f, g, _) {
                        var m = new n.ARRAY_TYPE(16);
                        return m[0] = t,
                        m[1] = e,
                        m[2] = i,
                        m[3] = r,
                        m[4] = s,
                        m[5] = a,
                        m[6] = o,
                        m[7] = l,
                        m[8] = h,
                        m[9] = u,
                        m[10] = c,
                        m[11] = p,
                        m[12] = d,
                        m[13] = f,
                        m[14] = g,
                        m[15] = _,
                        m
                    },
                    set: function (t, e, i, n, r, s, a, o, l, h, u, c, p, d, f, g, _) {
                        return t[0] = e,
                        t[1] = i,
                        t[2] = n,
                        t[3] = r,
                        t[4] = s,
                        t[5] = a,
                        t[6] = o,
                        t[7] = l,
                        t[8] = h,
                        t[9] = u,
                        t[10] = c,
                        t[11] = p,
                        t[12] = d,
                        t[13] = f,
                        t[14] = g,
                        t[15] = _,
                        t
                    },
                    identity: function (t) {
                        return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = 1,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = 1,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                    }
                };
            r.scalar.transpose = function (t, e) {
                if (t === e) {
                    var i = e[1],
                        n = e[2],
                        r = e[3],
                        s = e[6],
                        a = e[7],
                        o = e[11];
                    t[1] = e[4],
                    t[2] = e[8],
                    t[3] = e[12],
                    t[4] = i,
                    t[6] = e[9],
                    t[7] = e[13],
                    t[8] = n,
                    t[9] = s,
                    t[11] = e[14],
                    t[12] = r,
                    t[13] = a,
                    t[14] = o
                } else 
                    t[0] = e[0],
                    t[1] = e[4],
                    t[2] = e[8],
                    t[3] = e[12],
                    t[4] = e[1],
                    t[5] = e[5],
                    t[6] = e[9],
                    t[7] = e[13],
                    t[8] = e[2],
                    t[9] = e[6],
                    t[10] = e[10],
                    t[11] = e[14],
                    t[12] = e[3],
                    t[13] = e[7],
                    t[14] = e[11],
                    t[15] = e[15];
                return t
            },
            r.SIMD.transpose = function (t, e) {
                var i,
                    n,
                    r,
                    s,
                    a,
                    o,
                    l,
                    h,
                    u,
                    c;
                return i = SIMD
                    .Float32x4
                    .load(e, 0),
                n = SIMD
                    .Float32x4
                    .load(e, 4),
                r = SIMD
                    .Float32x4
                    .load(e, 8),
                s = SIMD
                    .Float32x4
                    .load(e, 12),
                a = SIMD
                    .Float32x4
                    .shuffle(i, n, 0, 1, 4, 5),
                o = SIMD
                    .Float32x4
                    .shuffle(r, s, 0, 1, 4, 5),
                l = SIMD
                    .Float32x4
                    .shuffle(a, o, 0, 2, 4, 6),
                h = SIMD
                    .Float32x4
                    .shuffle(a, o, 1, 3, 5, 7),
                SIMD
                    .Float32x4
                    .store(t, 0, l),
                SIMD
                    .Float32x4
                    .store(t, 4, h),
                a = SIMD
                    .Float32x4
                    .shuffle(i, n, 2, 3, 6, 7),
                o = SIMD
                    .Float32x4
                    .shuffle(r, s, 2, 3, 6, 7),
                u = SIMD
                    .Float32x4
                    .shuffle(a, o, 0, 2, 4, 6),
                c = SIMD
                    .Float32x4
                    .shuffle(a, o, 1, 3, 5, 7),
                SIMD
                    .Float32x4
                    .store(t, 8, u),
                SIMD
                    .Float32x4
                    .store(t, 12, c),
                t
            },
            r.transpose = n.USE_SIMD
                ? r.SIMD.transpose
                : r.scalar.transpose,
            r.scalar.invert = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = e[4],
                    o = e[5],
                    l = e[6],
                    h = e[7],
                    u = e[8],
                    c = e[9],
                    p = e[10],
                    d = e[11],
                    f = e[12],
                    g = e[13],
                    _ = e[14],
                    m = e[15],
                    v = i * o - n * a,
                    b = i * l - r * a,
                    M = i * h - s * a,
                    E = n * l - r * o,
                    I = n * h - s * o,
                    A = r * h - s * l,
                    x = u * g - c * f,
                    O = u * _ - p * f,
                    T = u * m - d * f,
                    S = c * _ - p * g,
                    y = c * m - d * g,
                    R = p * m - d * _,
                    F = v * R - b * y + M * S + E * T - I * O + A * x;
                return F
                    ? (
                        F = 1 / F,
                        t[0] = (o * R - l * y + h * S) * F,
                        t[1] = (r * y - n * R - s * S) * F,
                        t[2] = (g * A - _ * I + m * E) * F,
                        t[3] = (p * I - c * A - d * E) * F,
                        t[4] = (l * T - a * R - h * O) * F,
                        t[5] = (i * R - r * T + s * O) * F,
                        t[6] = (_ * M - f * A - m * b) * F,
                        t[7] = (u * A - p * M + d * b) * F,
                        t[8] = (a * y - o * T + h * x) * F,
                        t[9] = (n * T - i * y - s * x) * F,
                        t[10] = (f * I - g * M + m * v) * F,
                        t[11] = (c * M - u * I - d * v) * F,
                        t[12] = (o * O - a * S - l * x) * F,
                        t[13] = (i * S - n * O + r * x) * F,
                        t[14] = (g * b - f * E - _ * v) * F,
                        t[15] = (u * E - c * b + p * v) * F,
                        t
                    )
                    : null
            },
            r.SIMD.invert = function (t, e) {
                var i,
                    n,
                    r,
                    s,
                    a,
                    o,
                    l,
                    h,
                    u,
                    c,
                    p = SIMD
                        .Float32x4
                        .load(e, 0),
                    d = SIMD
                        .Float32x4
                        .load(e, 4),
                    f = SIMD
                        .Float32x4
                        .load(e, 8),
                    g = SIMD
                        .Float32x4
                        .load(e, 12);
                return a = SIMD
                    .Float32x4
                    .shuffle(p, d, 0, 1, 4, 5),
                n = SIMD
                    .Float32x4
                    .shuffle(f, g, 0, 1, 4, 5),
                i = SIMD
                    .Float32x4
                    .shuffle(a, n, 0, 2, 4, 6),
                n = SIMD
                    .Float32x4
                    .shuffle(n, a, 1, 3, 5, 7),
                a = SIMD
                    .Float32x4
                    .shuffle(p, d, 2, 3, 6, 7),
                s = SIMD
                    .Float32x4
                    .shuffle(f, g, 2, 3, 6, 7),
                r = SIMD
                    .Float32x4
                    .shuffle(a, s, 0, 2, 4, 6),
                s = SIMD
                    .Float32x4
                    .shuffle(s, a, 1, 3, 5, 7),
                a = SIMD
                    .Float32x4
                    .mul(r, s),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 1, 0, 3, 2),
                o = SIMD
                    .Float32x4
                    .mul(n, a),
                l = SIMD
                    .Float32x4
                    .mul(i, a),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 2, 3, 0, 1),
                o = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(n, a), o),
                l = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(i, a), l),
                l = SIMD
                    .Float32x4
                    .swizzle(l, 2, 3, 0, 1),
                a = SIMD
                    .Float32x4
                    .mul(n, r),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 1, 0, 3, 2),
                o = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(s, a), o),
                u = SIMD
                    .Float32x4
                    .mul(i, a),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 2, 3, 0, 1),
                o = SIMD
                    .Float32x4
                    .sub(o, SIMD.Float32x4.mul(s, a)),
                u = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(i, a), u),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                a = SIMD
                    .Float32x4
                    .mul(SIMD.Float32x4.swizzle(n, 2, 3, 0, 1), s),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 1, 0, 3, 2),
                r = SIMD
                    .Float32x4
                    .swizzle(r, 2, 3, 0, 1),
                o = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(r, a), o),
                h = SIMD
                    .Float32x4
                    .mul(i, a),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 2, 3, 0, 1),
                o = SIMD
                    .Float32x4
                    .sub(o, SIMD.Float32x4.mul(r, a)),
                h = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(i, a), h),
                h = SIMD
                    .Float32x4
                    .swizzle(h, 2, 3, 0, 1),
                a = SIMD
                    .Float32x4
                    .mul(i, n),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 1, 0, 3, 2),
                h = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(s, a), h),
                u = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(r, a), u),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 2, 3, 0, 1),
                h = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(s, a), h),
                u = SIMD
                    .Float32x4
                    .sub(u, SIMD.Float32x4.mul(r, a)),
                a = SIMD
                    .Float32x4
                    .mul(i, s),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 1, 0, 3, 2),
                l = SIMD
                    .Float32x4
                    .sub(l, SIMD.Float32x4.mul(r, a)),
                h = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(n, a), h),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 2, 3, 0, 1),
                l = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(r, a), l),
                h = SIMD
                    .Float32x4
                    .sub(h, SIMD.Float32x4.mul(n, a)),
                a = SIMD
                    .Float32x4
                    .mul(i, r),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 1, 0, 3, 2),
                l = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(s, a), l),
                u = SIMD
                    .Float32x4
                    .sub(u, SIMD.Float32x4.mul(n, a)),
                a = SIMD
                    .Float32x4
                    .swizzle(a, 2, 3, 0, 1),
                l = SIMD
                    .Float32x4
                    .sub(l, SIMD.Float32x4.mul(s, a)),
                u = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(n, a), u),
                c = SIMD
                    .Float32x4
                    .mul(i, o),
                c = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), c),
                c = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), c),
                a = SIMD
                    .Float32x4
                    .reciprocalApproximation(c),
                c = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.add(a, a), SIMD.Float32x4.mul(c, SIMD.Float32x4.mul(a, a))),
                (c = SIMD.Float32x4.swizzle(c, 0, 0, 0, 0))
                    ? (
                        SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(c, o)),
                        SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(c, l)),
                        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(c, h)),
                        SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(c, u)),
                        t
                    )
                    : null
            },
            r.invert = n.USE_SIMD
                ? r.SIMD.invert
                : r.scalar.invert,
            r.scalar.adjoint = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = e[4],
                    o = e[5],
                    l = e[6],
                    h = e[7],
                    u = e[8],
                    c = e[9],
                    p = e[10],
                    d = e[11],
                    f = e[12],
                    g = e[13],
                    _ = e[14],
                    m = e[15];
                return t[0] = o * (p * m - d * _) - c * (l * m - h * _) + g * (l * d - h * p),
                t[1] = -(n * (p * m - d * _) - c * (r * m - s * _) + g * (r * d - s * p)),
                t[2] = n * (l * m - h * _) - o * (r * m - s * _) + g * (r * h - s * l),
                t[3] = -(n * (l * d - h * p) - o * (r * d - s * p) + c * (r * h - s * l)),
                t[4] = -(a * (p * m - d * _) - u * (l * m - h * _) + f * (l * d - h * p)),
                t[5] = i * (p * m - d * _) - u * (r * m - s * _) + f * (r * d - s * p),
                t[6] = -(i * (l * m - h * _) - a * (r * m - s * _) + f * (r * h - s * l)),
                t[7] = i * (l * d - h * p) - a * (r * d - s * p) + u * (r * h - s * l),
                t[8] = a * (c * m - d * g) - u * (o * m - h * g) + f * (o * d - h * c),
                t[9] = -(i * (c * m - d * g) - u * (n * m - s * g) + f * (n * d - s * c)),
                t[10] = i * (o * m - h * g) - a * (n * m - s * g) + f * (n * h - s * o),
                t[11] = -(i * (o * d - h * c) - a * (n * d - s * c) + u * (n * h - s * o)),
                t[12] = -(a * (c * _ - p * g) - u * (o * _ - l * g) + f * (o * p - l * c)),
                t[13] = i * (c * _ - p * g) - u * (n * _ - r * g) + f * (n * p - r * c),
                t[14] = -(i * (o * _ - l * g) - a * (n * _ - r * g) + f * (n * l - r * o)),
                t[15] = i * (o * p - l * c) - a * (n * p - r * c) + u * (n * l - r * o),
                t
            },
            r.SIMD.adjoint = function (t, e) {
                var i,
                    n,
                    r,
                    s,
                    a,
                    o,
                    l,
                    h,
                    u,
                    c,
                    p,
                    d,
                    f;
                return i = SIMD
                    .Float32x4
                    .load(e, 0),
                n = SIMD
                    .Float32x4
                    .load(e, 4),
                r = SIMD
                    .Float32x4
                    .load(e, 8),
                s = SIMD
                    .Float32x4
                    .load(e, 12),
                u = SIMD
                    .Float32x4
                    .shuffle(i, n, 0, 1, 4, 5),
                o = SIMD
                    .Float32x4
                    .shuffle(r, s, 0, 1, 4, 5),
                a = SIMD
                    .Float32x4
                    .shuffle(u, o, 0, 2, 4, 6),
                o = SIMD
                    .Float32x4
                    .shuffle(o, u, 1, 3, 5, 7),
                u = SIMD
                    .Float32x4
                    .shuffle(i, n, 2, 3, 6, 7),
                h = SIMD
                    .Float32x4
                    .shuffle(r, s, 2, 3, 6, 7),
                l = SIMD
                    .Float32x4
                    .shuffle(u, h, 0, 2, 4, 6),
                h = SIMD
                    .Float32x4
                    .shuffle(h, u, 1, 3, 5, 7),
                u = SIMD
                    .Float32x4
                    .mul(l, h),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 1, 0, 3, 2),
                c = SIMD
                    .Float32x4
                    .mul(o, u),
                p = SIMD
                    .Float32x4
                    .mul(a, u),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                c = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(o, u), c),
                p = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(a, u), p),
                p = SIMD
                    .Float32x4
                    .swizzle(p, 2, 3, 0, 1),
                u = SIMD
                    .Float32x4
                    .mul(o, l),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 1, 0, 3, 2),
                c = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(h, u), c),
                f = SIMD
                    .Float32x4
                    .mul(a, u),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                c = SIMD
                    .Float32x4
                    .sub(c, SIMD.Float32x4.mul(h, u)),
                f = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(a, u), f),
                f = SIMD
                    .Float32x4
                    .swizzle(f, 2, 3, 0, 1),
                u = SIMD
                    .Float32x4
                    .mul(SIMD.Float32x4.swizzle(o, 2, 3, 0, 1), h),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 1, 0, 3, 2),
                l = SIMD
                    .Float32x4
                    .swizzle(l, 2, 3, 0, 1),
                c = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(l, u), c),
                d = SIMD
                    .Float32x4
                    .mul(a, u),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                c = SIMD
                    .Float32x4
                    .sub(c, SIMD.Float32x4.mul(l, u)),
                d = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(a, u), d),
                d = SIMD
                    .Float32x4
                    .swizzle(d, 2, 3, 0, 1),
                u = SIMD
                    .Float32x4
                    .mul(a, o),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 1, 0, 3, 2),
                d = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(h, u), d),
                f = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(l, u), f),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                d = SIMD
                    .Float32x4
                    .sub(SIMD.Float32x4.mul(h, u), d),
                f = SIMD
                    .Float32x4
                    .sub(f, SIMD.Float32x4.mul(l, u)),
                u = SIMD
                    .Float32x4
                    .mul(a, h),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 1, 0, 3, 2),
                p = SIMD
                    .Float32x4
                    .sub(p, SIMD.Float32x4.mul(l, u)),
                d = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(o, u), d),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                p = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(l, u), p),
                d = SIMD
                    .Float32x4
                    .sub(d, SIMD.Float32x4.mul(o, u)),
                u = SIMD
                    .Float32x4
                    .mul(a, l),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 1, 0, 3, 2),
                p = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(h, u), p),
                f = SIMD
                    .Float32x4
                    .sub(f, SIMD.Float32x4.mul(o, u)),
                u = SIMD
                    .Float32x4
                    .swizzle(u, 2, 3, 0, 1),
                p = SIMD
                    .Float32x4
                    .sub(p, SIMD.Float32x4.mul(h, u)),
                f = SIMD
                    .Float32x4
                    .add(SIMD.Float32x4.mul(o, u), f),
                SIMD
                    .Float32x4
                    .store(t, 0, c),
                SIMD
                    .Float32x4
                    .store(t, 4, p),
                SIMD
                    .Float32x4
                    .store(t, 8, d),
                SIMD
                    .Float32x4
                    .store(t, 12, f),
                t
            },
            r.adjoint = n.USE_SIMD
                ? r.SIMD.adjoint
                : r.scalar.adjoint,
            r.determinant = function (t) {
                var e = t[0],
                    i = t[1],
                    n = t[2],
                    r = t[3],
                    s = t[4],
                    a = t[5],
                    o = t[6],
                    l = t[7],
                    h = t[8],
                    u = t[9],
                    c = t[10],
                    p = t[11],
                    d = t[12],
                    f = t[13],
                    g = t[14],
                    _ = t[15];
                return (e * a - i * s) * (c * _ - p * g) - (e * o - n * s) * (u * _ - p * f) + (
                    e * l - r * s
                ) * (u * g - c * f) + (i * o - n * a) * (h * _ - p * d) - (i * l - r * a) * (
                    h * g - c * d
                ) + (n * l - r * o) * (h * f - u * d)
            },
            r.SIMD.multiply = function (t, e, i) {
                var n = SIMD
                        .Float32x4
                        .load(e, 0),
                    r = SIMD
                        .Float32x4
                        .load(e, 4),
                    s = SIMD
                        .Float32x4
                        .load(e, 8),
                    a = SIMD
                        .Float32x4
                        .load(e, 12),
                    o = SIMD
                        .Float32x4
                        .load(i, 0),
                    l = SIMD
                        .Float32x4
                        .add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o, 0, 0, 0, 0), n),
                            SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o, 1, 1, 1, 1), r), SIMD.Float32x4.add(
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o, 2, 2, 2, 2), s),
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o, 3, 3, 3, 3), a)
                            ))
                        );
                SIMD
                    .Float32x4
                    .store(t, 0, l);
                var h = SIMD
                        .Float32x4
                        .load(i, 4),
                    u = SIMD
                        .Float32x4
                        .add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 0, 0, 0, 0), n),
                            SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 1, 1, 1, 1), r), SIMD.Float32x4.add(
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 2, 2, 2, 2), s),
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 3, 3, 3, 3), a)
                            ))
                        );
                SIMD
                    .Float32x4
                    .store(t, 4, u);
                var c = SIMD
                        .Float32x4
                        .load(i, 8),
                    p = SIMD
                        .Float32x4
                        .add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 0, 0, 0, 0), n),
                            SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 1, 1, 1, 1), r), SIMD.Float32x4.add(
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 2, 2, 2, 2), s),
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 3, 3, 3, 3), a)
                            ))
                        );
                SIMD
                    .Float32x4
                    .store(t, 8, p);
                var d = SIMD
                        .Float32x4
                        .load(i, 12),
                    f = SIMD
                        .Float32x4
                        .add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 0, 0, 0, 0), n),
                            SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 1, 1, 1, 1), r), SIMD.Float32x4.add(
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 2, 2, 2, 2), s),
                                SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 3, 3, 3, 3), a)
                            ))
                        );
                return SIMD
                    .Float32x4
                    .store(t, 12, f),
                t
            },
            r.scalar.multiply = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = e[4],
                    l = e[5],
                    h = e[6],
                    u = e[7],
                    c = e[8],
                    p = e[9],
                    d = e[10],
                    f = e[11],
                    g = e[12],
                    _ = e[13],
                    m = e[14],
                    v = e[15],
                    b = i[0],
                    M = i[1],
                    E = i[2],
                    I = i[3];
                return t[0] = b * n + M * o + E * c + I * g,
                t[1] = b * r + M * l + E * p + I * _,
                t[2] = b * s + M * h + E * d + I * m,
                t[3] = b * a + M * u + E * f + I * v,
                b = i[4],
                M = i[5],
                E = i[6],
                I = i[7],
                t[4] = b * n + M * o + E * c + I * g,
                t[5] = b * r + M * l + E * p + I * _,
                t[6] = b * s + M * h + E * d + I * m,
                t[7] = b * a + M * u + E * f + I * v,
                b = i[8],
                M = i[9],
                E = i[10],
                I = i[11],
                t[8] = b * n + M * o + E * c + I * g,
                t[9] = b * r + M * l + E * p + I * _,
                t[10] = b * s + M * h + E * d + I * m,
                t[11] = b * a + M * u + E * f + I * v,
                b = i[12],
                M = i[13],
                E = i[14],
                I = i[15],
                t[12] = b * n + M * o + E * c + I * g,
                t[13] = b * r + M * l + E * p + I * _,
                t[14] = b * s + M * h + E * d + I * m,
                t[15] = b * a + M * u + E * f + I * v,
                t
            },
            r.multiply = n.USE_SIMD
                ? r.SIMD.multiply
                : r.scalar.multiply,
            r.mul = r.multiply,
            r.scalar.translate = function (t, e, i) {
                var n,
                    r,
                    s,
                    a,
                    o,
                    l,
                    h,
                    u,
                    c,
                    p,
                    d,
                    f,
                    g = i[0],
                    _ = i[1],
                    m = i[2];
                return e === t
                    ? (
                        t[12] = e[0] * g + e[4] * _ + e[8] * m + e[12],
                        t[13] = e[1] * g + e[5] * _ + e[9] * m + e[13],
                        t[14] = e[2] * g + e[6] * _ + e[10] * m + e[14],
                        t[15] = e[3] * g + e[7] * _ + e[11] * m + e[15]
                    )
                    : (
                        n = e[0],
                        r = e[1],
                        s = e[2],
                        a = e[3],
                        o = e[4],
                        l = e[5],
                        h = e[6],
                        u = e[7],
                        c = e[8],
                        p = e[9],
                        d = e[10],
                        f = e[11],
                        t[0] = n,
                        t[1] = r,
                        t[2] = s,
                        t[3] = a,
                        t[4] = o,
                        t[5] = l,
                        t[6] = h,
                        t[7] = u,
                        t[8] = c,
                        t[9] = p,
                        t[10] = d,
                        t[11] = f,
                        t[12] = n * g + o * _ + c * m + e[12],
                        t[13] = r * g + l * _ + p * m + e[13],
                        t[14] = s * g + h * _ + d * m + e[14],
                        t[15] = a * g + u * _ + f * m + e[15]
                    ),
                t
            },
            r.SIMD.translate = function (t, e, i) {
                var n = SIMD
                        .Float32x4
                        .load(e, 0),
                    r = SIMD
                        .Float32x4
                        .load(e, 4),
                    s = SIMD
                        .Float32x4
                        .load(e, 8),
                    a = SIMD
                        .Float32x4
                        .load(e, 12),
                    o = SIMD.Float32x4(i[0], i[1], i[2], 0);
                e !== t && (
                    t[0] = e[0],
                    t[1] = e[1],
                    t[2] = e[2],
                    t[3] = e[3],
                    t[4] = e[4],
                    t[5] = e[5],
                    t[6] = e[6],
                    t[7] = e[7],
                    t[8] = e[8],
                    t[9] = e[9],
                    t[10] = e[10],
                    t[11] = e[11]
                ),
                n = SIMD
                    .Float32x4
                    .mul(n, SIMD.Float32x4.swizzle(o, 0, 0, 0, 0)),
                r = SIMD
                    .Float32x4
                    .mul(r, SIMD.Float32x4.swizzle(o, 1, 1, 1, 1)),
                s = SIMD
                    .Float32x4
                    .mul(s, SIMD.Float32x4.swizzle(o, 2, 2, 2, 2));
                var l = SIMD
                    .Float32x4
                    .add(n, SIMD.Float32x4.add(r, SIMD.Float32x4.add(s, a)));
                return SIMD
                    .Float32x4
                    .store(t, 12, l),
                t
            },
            r.translate = n.USE_SIMD
                ? r.SIMD.translate
                : r.scalar.translate,
            r.scalar.scale = function (t, e, i) {
                var n = i[0],
                    r = i[1],
                    s = i[2];
                return t[0] = e[0] * n,
                t[1] = e[1] * n,
                t[2] = e[2] * n,
                t[3] = e[3] * n,
                t[4] = e[4] * r,
                t[5] = e[5] * r,
                t[6] = e[6] * r,
                t[7] = e[7] * r,
                t[8] = e[8] * s,
                t[9] = e[9] * s,
                t[10] = e[10] * s,
                t[11] = e[11] * s,
                t[12] = e[12],
                t[13] = e[13],
                t[14] = e[14],
                t[15] = e[15],
                t
            },
            r.SIMD.scale = function (t, e, i) {
                var n,
                    r,
                    s,
                    a = SIMD.Float32x4(i[0], i[1], i[2], 0);
                return n = SIMD
                    .Float32x4
                    .load(e, 0),
                SIMD
                    .Float32x4
                    .store(t, 0, SIMD.Float32x4.mul(n, SIMD.Float32x4.swizzle(a, 0, 0, 0, 0))),
                r = SIMD
                    .Float32x4
                    .load(e, 4),
                SIMD
                    .Float32x4
                    .store(t, 4, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(a, 1, 1, 1, 1))),
                s = SIMD
                    .Float32x4
                    .load(e, 8),
                SIMD
                    .Float32x4
                    .store(t, 8, SIMD.Float32x4.mul(s, SIMD.Float32x4.swizzle(a, 2, 2, 2, 2))),
                t[12] = e[12],
                t[13] = e[13],
                t[14] = e[14],
                t[15] = e[15],
                t
            },
            r.scale = n.USE_SIMD
                ? r.SIMD.scale
                : r.scalar.scale,
            r.rotate = function (t, e, i, r) {
                var s,
                    a,
                    o,
                    l,
                    h,
                    u,
                    c,
                    p,
                    d,
                    f,
                    g,
                    _,
                    m,
                    v,
                    b,
                    M,
                    E,
                    I,
                    A,
                    x,
                    O,
                    T,
                    S,
                    y,
                    R = r[0],
                    F = r[1],
                    P = r[2],
                    N = Math.sqrt(R * R + F * F + P * P);
                return Math.abs(N) < n.EPSILON
                    ? null
                    : (
                        R *= N = 1 / N,
                        F *= N,
                        P *= N,
                        s = Math.sin(i),
                        o = 1 - (a = Math.cos(i)),
                        l = e[0],
                        h = e[1],
                        u = e[2],
                        c = e[3],
                        p = e[4],
                        d = e[5],
                        f = e[6],
                        g = e[7],
                        _ = e[8],
                        m = e[9],
                        v = e[10],
                        b = e[11],
                        M = R * R * o + a,
                        E = F * R * o + P * s,
                        I = P * R * o - F * s,
                        A = R * F * o - P * s,
                        x = F * F * o + a,
                        O = P * F * o + R * s,
                        T = R * P * o + F * s,
                        S = F * P * o - R * s,
                        y = P * P * o + a,
                        t[0] = l * M + p * E + _ * I,
                        t[1] = h * M + d * E + m * I,
                        t[2] = u * M + f * E + v * I,
                        t[3] = c * M + g * E + b * I,
                        t[4] = l * A + p * x + _ * O,
                        t[5] = h * A + d * x + m * O,
                        t[6] = u * A + f * x + v * O,
                        t[7] = c * A + g * x + b * O,
                        t[8] = l * T + p * S + _ * y,
                        t[9] = h * T + d * S + m * y,
                        t[10] = u * T + f * S + v * y,
                        t[11] = c * T + g * S + b * y,
                        e !== t && (t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]),
                        t
                    )
            },
            r.scalar.rotateX = function (t, e, i) {
                var n = Math.sin(i),
                    r = Math.cos(i),
                    s = e[4],
                    a = e[5],
                    o = e[6],
                    l = e[7],
                    h = e[8],
                    u = e[9],
                    c = e[10],
                    p = e[11];
                return e !== t && (
                    t[0] = e[0],
                    t[1] = e[1],
                    t[2] = e[2],
                    t[3] = e[3],
                    t[12] = e[12],
                    t[13] = e[13],
                    t[14] = e[14],
                    t[15] = e[15]
                ),
                t[4] = s * r + h * n,
                t[5] = a * r + u * n,
                t[6] = o * r + c * n,
                t[7] = l * r + p * n,
                t[8] = h * r - s * n,
                t[9] = u * r - a * n,
                t[10] = c * r - o * n,
                t[11] = p * r - l * n,
                t
            },
            r.SIMD.rotateX = function (t, e, i) {
                var n = SIMD
                        .Float32x4
                        .splat(Math.sin(i)),
                    r = SIMD
                        .Float32x4
                        .splat(Math.cos(i));
                e !== t && (
                    t[0] = e[0],
                    t[1] = e[1],
                    t[2] = e[2],
                    t[3] = e[3],
                    t[12] = e[12],
                    t[13] = e[13],
                    t[14] = e[14],
                    t[15] = e[15]
                );
                var s = SIMD
                        .Float32x4
                        .load(e, 4),
                    a = SIMD
                        .Float32x4
                        .load(e, 8);
                return SIMD
                    .Float32x4
                    .store(
                        t,
                        4,
                        SIMD.Float32x4.add(SIMD.Float32x4.mul(s, r), SIMD.Float32x4.mul(a, n))
                    ),
                SIMD
                    .Float32x4
                    .store(
                        t,
                        8,
                        SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, r), SIMD.Float32x4.mul(s, n))
                    ),
                t
            },
            r.rotateX = n.USE_SIMD
                ? r.SIMD.rotateX
                : r.scalar.rotateX,
            r.scalar.rotateY = function (t, e, i) {
                var n = Math.sin(i),
                    r = Math.cos(i),
                    s = e[0],
                    a = e[1],
                    o = e[2],
                    l = e[3],
                    h = e[8],
                    u = e[9],
                    c = e[10],
                    p = e[11];
                return e !== t && (
                    t[4] = e[4],
                    t[5] = e[5],
                    t[6] = e[6],
                    t[7] = e[7],
                    t[12] = e[12],
                    t[13] = e[13],
                    t[14] = e[14],
                    t[15] = e[15]
                ),
                t[0] = s * r - h * n,
                t[1] = a * r - u * n,
                t[2] = o * r - c * n,
                t[3] = l * r - p * n,
                t[8] = s * n + h * r,
                t[9] = a * n + u * r,
                t[10] = o * n + c * r,
                t[11] = l * n + p * r,
                t
            },
            r.SIMD.rotateY = function (t, e, i) {
                var n = SIMD
                        .Float32x4
                        .splat(Math.sin(i)),
                    r = SIMD
                        .Float32x4
                        .splat(Math.cos(i));
                e !== t && (
                    t[4] = e[4],
                    t[5] = e[5],
                    t[6] = e[6],
                    t[7] = e[7],
                    t[12] = e[12],
                    t[13] = e[13],
                    t[14] = e[14],
                    t[15] = e[15]
                );
                var s = SIMD
                        .Float32x4
                        .load(e, 0),
                    a = SIMD
                        .Float32x4
                        .load(e, 8);
                return SIMD
                    .Float32x4
                    .store(
                        t,
                        0,
                        SIMD.Float32x4.sub(SIMD.Float32x4.mul(s, r), SIMD.Float32x4.mul(a, n))
                    ),
                SIMD
                    .Float32x4
                    .store(
                        t,
                        8,
                        SIMD.Float32x4.add(SIMD.Float32x4.mul(s, n), SIMD.Float32x4.mul(a, r))
                    ),
                t
            },
            r.rotateY = n.USE_SIMD
                ? r.SIMD.rotateY
                : r.scalar.rotateY,
            r.scalar.rotateZ = function (t, e, i) {
                var n = Math.sin(i),
                    r = Math.cos(i),
                    s = e[0],
                    a = e[1],
                    o = e[2],
                    l = e[3],
                    h = e[4],
                    u = e[5],
                    c = e[6],
                    p = e[7];
                return e !== t && (
                    t[8] = e[8],
                    t[9] = e[9],
                    t[10] = e[10],
                    t[11] = e[11],
                    t[12] = e[12],
                    t[13] = e[13],
                    t[14] = e[14],
                    t[15] = e[15]
                ),
                t[0] = s * r + h * n,
                t[1] = a * r + u * n,
                t[2] = o * r + c * n,
                t[3] = l * r + p * n,
                t[4] = h * r - s * n,
                t[5] = u * r - a * n,
                t[6] = c * r - o * n,
                t[7] = p * r - l * n,
                t
            },
            r.SIMD.rotateZ = function (t, e, i) {
                var n = SIMD
                        .Float32x4
                        .splat(Math.sin(i)),
                    r = SIMD
                        .Float32x4
                        .splat(Math.cos(i));
                e !== t && (
                    t[8] = e[8],
                    t[9] = e[9],
                    t[10] = e[10],
                    t[11] = e[11],
                    t[12] = e[12],
                    t[13] = e[13],
                    t[14] = e[14],
                    t[15] = e[15]
                );
                var s = SIMD
                        .Float32x4
                        .load(e, 0),
                    a = SIMD
                        .Float32x4
                        .load(e, 4);
                return SIMD
                    .Float32x4
                    .store(
                        t,
                        0,
                        SIMD.Float32x4.add(SIMD.Float32x4.mul(s, r), SIMD.Float32x4.mul(a, n))
                    ),
                SIMD
                    .Float32x4
                    .store(
                        t,
                        4,
                        SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, r), SIMD.Float32x4.mul(s, n))
                    ),
                t
            },
            r.rotateZ = n.USE_SIMD
                ? r.SIMD.rotateZ
                : r.scalar.rotateZ,
            r.fromTranslation = function (t, e) {
                return t[0] = 1,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = 1,
                t[6] = 0,
                t[7] = 0,
                t[8] = 0,
                t[9] = 0,
                t[10] = 1,
                t[11] = 0,
                t[12] = e[0],
                t[13] = e[1],
                t[14] = e[2],
                t[15] = 1,
                t
            },
            r.fromScaling = function (t, e) {
                return t[0] = e[0],
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = e[1],
                t[6] = 0,
                t[7] = 0,
                t[8] = 0,
                t[9] = 0,
                t[10] = e[2],
                t[11] = 0,
                t[12] = 0,
                t[13] = 0,
                t[14] = 0,
                t[15] = 1,
                t
            },
            r.fromRotation = function (t, e, i) {
                var r,
                    s,
                    a,
                    o = i[0],
                    l = i[1],
                    h = i[2],
                    u = Math.sqrt(o * o + l * l + h * h);
                return Math.abs(u) < n.EPSILON
                    ? null
                    : (
                        o *= u = 1 / u,
                        l *= u,
                        h *= u,
                        r = Math.sin(e),
                        a = 1 - (s = Math.cos(e)),
                        t[0] = o * o * a + s,
                        t[1] = l * o * a + h * r,
                        t[2] = h * o * a - l * r,
                        t[3] = 0,
                        t[4] = o * l * a - h * r,
                        t[5] = l * l * a + s,
                        t[6] = h * l * a + o * r,
                        t[7] = 0,
                        t[8] = o * h * a + l * r,
                        t[9] = l * h * a - o * r,
                        t[10] = h * h * a + s,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                    )
            },
            r.fromXRotation = function (t, e) {
                var i = Math.sin(e),
                    n = Math.cos(e);
                return t[0] = 1,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = n,
                t[6] = i,
                t[7] = 0,
                t[8] = 0,
                t[9] = -i,
                t[10] = n,
                t[11] = 0,
                t[12] = 0,
                t[13] = 0,
                t[14] = 0,
                t[15] = 1,
                t
            },
            r.fromYRotation = function (t, e) {
                var i = Math.sin(e),
                    n = Math.cos(e);
                return t[0] = n,
                t[1] = 0,
                t[2] = -i,
                t[3] = 0,
                t[4] = 0,
                t[5] = 1,
                t[6] = 0,
                t[7] = 0,
                t[8] = i,
                t[9] = 0,
                t[10] = n,
                t[11] = 0,
                t[12] = 0,
                t[13] = 0,
                t[14] = 0,
                t[15] = 1,
                t
            },
            r.fromZRotation = function (t, e) {
                var i = Math.sin(e),
                    n = Math.cos(e);
                return t[0] = n,
                t[1] = i,
                t[2] = 0,
                t[3] = 0,
                t[4] = -i,
                t[5] = n,
                t[6] = 0,
                t[7] = 0,
                t[8] = 0,
                t[9] = 0,
                t[10] = 1,
                t[11] = 0,
                t[12] = 0,
                t[13] = 0,
                t[14] = 0,
                t[15] = 1,
                t
            },
            r.fromRotationTranslation = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = n + n,
                    l = r + r,
                    h = s + s,
                    u = n * o,
                    c = n * l,
                    p = n * h,
                    d = r * l,
                    f = r * h,
                    g = s * h,
                    _ = a * o,
                    m = a * l,
                    v = a * h;
                return t[0] = 1 - (d + g),
                t[1] = c + v,
                t[2] = p - m,
                t[3] = 0,
                t[4] = c - v,
                t[5] = 1 - (u + g),
                t[6] = f + _,
                t[7] = 0,
                t[8] = p + m,
                t[9] = f - _,
                t[10] = 1 - (u + d),
                t[11] = 0,
                t[12] = i[0],
                t[13] = i[1],
                t[14] = i[2],
                t[15] = 1,
                t
            },
            r.getTranslation = function (t, e) {
                return t[0] = e[12],
                t[1] = e[13],
                t[2] = e[14],
                t
            },
            r.getRotation = function (t, e) {
                var i = e[0] + e[5] + e[10],
                    n = 0;
                return i > 0
                    ? (
                        n = 2 * Math.sqrt(i + 1),
                        t[3] = .25 * n,
                        t[0] = (e[6] - e[9]) / n,
                        t[1] = (e[8] - e[2]) / n,
                        t[2] = (e[1] - e[4]) / n
                    )
                    : e[0] > e[5] & e[0] > e[10]
                        ? (
                            n = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]),
                            t[3] = (e[6] - e[9]) / n,
                            t[0] = .25 * n,
                            t[1] = (e[1] + e[4]) / n,
                            t[2] = (e[8] + e[2]) / n
                        )
                        : e[5] > e[10]
                            ? (
                                n = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]),
                                t[3] = (e[8] - e[2]) / n,
                                t[0] = (e[1] + e[4]) / n,
                                t[1] = .25 * n,
                                t[2] = (e[6] + e[9]) / n
                            )
                            : (
                                n = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]),
                                t[3] = (e[1] - e[4]) / n,
                                t[0] = (e[8] + e[2]) / n,
                                t[1] = (e[6] + e[9]) / n,
                                t[2] = .25 * n
                            ),
                t
            },
            r.fromRotationTranslationScale = function (t, e, i, n) {
                var r = e[0],
                    s = e[1],
                    a = e[2],
                    o = e[3],
                    l = r + r,
                    h = s + s,
                    u = a + a,
                    c = r * l,
                    p = r * h,
                    d = r * u,
                    f = s * h,
                    g = s * u,
                    _ = a * u,
                    m = o * l,
                    v = o * h,
                    b = o * u,
                    M = n[0],
                    E = n[1],
                    I = n[2];
                return t[0] = (1 - (f + _)) * M,
                t[1] = (p + b) * M,
                t[2] = (d - v) * M,
                t[3] = 0,
                t[4] = (p - b) * E,
                t[5] = (1 - (c + _)) * E,
                t[6] = (g + m) * E,
                t[7] = 0,
                t[8] = (d + v) * I,
                t[9] = (g - m) * I,
                t[10] = (1 - (c + f)) * I,
                t[11] = 0,
                t[12] = i[0],
                t[13] = i[1],
                t[14] = i[2],
                t[15] = 1,
                t
            },
            r.fromRotationTranslationScaleOrigin = function (t, e, i, n, r) {
                var s = e[0],
                    a = e[1],
                    o = e[2],
                    l = e[3],
                    h = s + s,
                    u = a + a,
                    c = o + o,
                    p = s * h,
                    d = s * u,
                    f = s * c,
                    g = a * u,
                    _ = a * c,
                    m = o * c,
                    v = l * h,
                    b = l * u,
                    M = l * c,
                    E = n[0],
                    I = n[1],
                    A = n[2],
                    x = r[0],
                    O = r[1],
                    T = r[2];
                return t[0] = (1 - (g + m)) * E,
                t[1] = (d + M) * E,
                t[2] = (f - b) * E,
                t[3] = 0,
                t[4] = (d - M) * I,
                t[5] = (1 - (p + m)) * I,
                t[6] = (_ + v) * I,
                t[7] = 0,
                t[8] = (f + b) * A,
                t[9] = (_ - v) * A,
                t[10] = (1 - (p + g)) * A,
                t[11] = 0,
                t[12] = i[0] + x - (t[0] * x + t[4] * O + t[8] * T),
                t[13] = i[1] + O - (t[1] * x + t[5] * O + t[9] * T),
                t[14] = i[2] + T - (t[2] * x + t[6] * O + t[10] * T),
                t[15] = 1,
                t
            },
            r.fromQuat = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = i + i,
                    o = n + n,
                    l = r + r,
                    h = i * a,
                    u = n * a,
                    c = n * o,
                    p = r * a,
                    d = r * o,
                    f = r * l,
                    g = s * a,
                    _ = s * o,
                    m = s * l;
                return t[0] = 1 - c - f,
                t[1] = u + m,
                t[2] = p - _,
                t[3] = 0,
                t[4] = u - m,
                t[5] = 1 - h - f,
                t[6] = d + g,
                t[7] = 0,
                t[8] = p + _,
                t[9] = d - g,
                t[10] = 1 - h - c,
                t[11] = 0,
                t[12] = 0,
                t[13] = 0,
                t[14] = 0,
                t[15] = 1,
                t
            },
            r.frustum = function (t, e, i, n, r, s, a) {
                var o = 1 / (i - e),
                    l = 1 / (r - n),
                    h = 1 / (s - a);
                return t[0] = 2 * s * o,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = 2 * s * l,
                t[6] = 0,
                t[7] = 0,
                t[8] = (i + e) * o,
                t[9] = (r + n) * l,
                t[10] = (a + s) * h,
                t[11] = -1,
                t[12] = 0,
                t[13] = 0,
                t[14] = a * s * 2 * h,
                t[15] = 0,
                t
            },
            r.perspective = function (t, e, i, n, r) {
                var s = 1 / Math.tan(e / 2),
                    a = 1 / (n - r);
                return t[0] = s / i,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = s,
                t[6] = 0,
                t[7] = 0,
                t[8] = 0,
                t[9] = 0,
                t[10] = (r + n) * a,
                t[11] = -1,
                t[12] = 0,
                t[13] = 0,
                t[14] = 2 * r * n * a,
                t[15] = 0,
                t
            },
            r.perspectiveFromFieldOfView = function (t, e, i, n) {
                var r = Math.tan(e.upDegrees * Math.PI / 180),
                    s = Math.tan(e.downDegrees * Math.PI / 180),
                    a = Math.tan(e.leftDegrees * Math.PI / 180),
                    o = Math.tan(e.rightDegrees * Math.PI / 180),
                    l = 2 / (a + o),
                    h = 2 / (r + s);
                return t[0] = l,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = h,
                t[6] = 0,
                t[7] = 0,
                t[8] = -(a - o) * l * .5,
                t[9] = (r - s) * h * .5,
                t[10] = n / (i - n),
                t[11] = -1,
                t[12] = 0,
                t[13] = 0,
                t[14] = n * i / (i - n),
                t[15] = 0,
                t
            },
            r.ortho = function (t, e, i, n, r, s, a) {
                var o = 1 / (e - i),
                    l = 1 / (n - r),
                    h = 1 / (s - a);
                return t[0] = -2 * o,
                t[1] = 0,
                t[2] = 0,
                t[3] = 0,
                t[4] = 0,
                t[5] = -2 * l,
                t[6] = 0,
                t[7] = 0,
                t[8] = 0,
                t[9] = 0,
                t[10] = 2 * h,
                t[11] = 0,
                t[12] = (e + i) * o,
                t[13] = (r + n) * l,
                t[14] = (a + s) * h,
                t[15] = 1,
                t
            },
            r.lookAt = function (t, e, i, s) {
                var a,
                    o,
                    l,
                    h,
                    u,
                    c,
                    p,
                    d,
                    f,
                    g,
                    _ = e[0],
                    m = e[1],
                    v = e[2],
                    b = s[0],
                    M = s[1],
                    E = s[2],
                    I = i[0],
                    A = i[1],
                    x = i[2];
                return Math.abs(_ - I) < n.EPSILON && Math.abs(m - A) < n.EPSILON && Math.abs(
                    v - x
                ) < n.EPSILON
                    ? r.identity(t)
                    : (
                        p = _ - I,
                        d = m - A,
                        f = v - x,
                        a = M * (f *= g = 1 / Math.sqrt(p * p + d * d + f * f)) - E * (d *= g),
                        o = E * (p *= g) - b * f,
                        l = b * d - M * p,
                        (g = Math.sqrt(a * a + o * o + l * l))
                            ? (a *= g = 1 / g, o *= g, l *= g)
                            : (a = 0, o = 0, l = 0),
                        h = d * l - f * o,
                        u = f * a - p * l,
                        c = p * o - d * a,
                        (g = Math.sqrt(h * h + u * u + c * c))
                            ? (h *= g = 1 / g, u *= g, c *= g)
                            : (h = 0, u = 0, c = 0),
                        t[0] = a,
                        t[1] = h,
                        t[2] = p,
                        t[3] = 0,
                        t[4] = o,
                        t[5] = u,
                        t[6] = d,
                        t[7] = 0,
                        t[8] = l,
                        t[9] = c,
                        t[10] = f,
                        t[11] = 0,
                        t[12] = -(a * _ + o * m + l * v),
                        t[13] = -(h * _ + u * m + c * v),
                        t[14] = -(p * _ + d * m + f * v),
                        t[15] = 1,
                        t
                    )
            },
            r.str = function (t) {
                return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] +
                        ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] +
                        ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
            },
            r.frob = function (t) {
                return Math.sqrt(
                    Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) +
                    Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) +
                    Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) +
                    Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2)
                )
            },
            r.add = function (t, e, i) {
                return t[0] = e[0] + i[0],
                t[1] = e[1] + i[1],
                t[2] = e[2] + i[2],
                t[3] = e[3] + i[3],
                t[4] = e[4] + i[4],
                t[5] = e[5] + i[5],
                t[6] = e[6] + i[6],
                t[7] = e[7] + i[7],
                t[8] = e[8] + i[8],
                t[9] = e[9] + i[9],
                t[10] = e[10] + i[10],
                t[11] = e[11] + i[11],
                t[12] = e[12] + i[12],
                t[13] = e[13] + i[13],
                t[14] = e[14] + i[14],
                t[15] = e[15] + i[15],
                t
            },
            r.subtract = function (t, e, i) {
                return t[0] = e[0] - i[0],
                t[1] = e[1] - i[1],
                t[2] = e[2] - i[2],
                t[3] = e[3] - i[3],
                t[4] = e[4] - i[4],
                t[5] = e[5] - i[5],
                t[6] = e[6] - i[6],
                t[7] = e[7] - i[7],
                t[8] = e[8] - i[8],
                t[9] = e[9] - i[9],
                t[10] = e[10] - i[10],
                t[11] = e[11] - i[11],
                t[12] = e[12] - i[12],
                t[13] = e[13] - i[13],
                t[14] = e[14] - i[14],
                t[15] = e[15] - i[15],
                t
            },
            r.sub = r.subtract,
            r.multiplyScalar = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t[2] = e[2] * i,
                t[3] = e[3] * i,
                t[4] = e[4] * i,
                t[5] = e[5] * i,
                t[6] = e[6] * i,
                t[7] = e[7] * i,
                t[8] = e[8] * i,
                t[9] = e[9] * i,
                t[10] = e[10] * i,
                t[11] = e[11] * i,
                t[12] = e[12] * i,
                t[13] = e[13] * i,
                t[14] = e[14] * i,
                t[15] = e[15] * i,
                t
            },
            r.multiplyScalarAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t[2] = e[2] + i[2] * n,
                t[3] = e[3] + i[3] * n,
                t[4] = e[4] + i[4] * n,
                t[5] = e[5] + i[5] * n,
                t[6] = e[6] + i[6] * n,
                t[7] = e[7] + i[7] * n,
                t[8] = e[8] + i[8] * n,
                t[9] = e[9] + i[9] * n,
                t[10] = e[10] + i[10] * n,
                t[11] = e[11] + i[11] * n,
                t[12] = e[12] + i[12] * n,
                t[13] = e[13] + i[13] * n,
                t[14] = e[14] + i[14] * n,
                t[15] = e[15] + i[15] * n,
                t
            },
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8] && t[9] === e[9] && t[10] === e[10] && t[11] === e[11] && t[12] === e[12] && t[13] === e[13] && t[14] === e[14] && t[15] === e[15]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = t[2],
                    a = t[3],
                    o = t[4],
                    l = t[5],
                    h = t[6],
                    u = t[7],
                    c = t[8],
                    p = t[9],
                    d = t[10],
                    f = t[11],
                    g = t[12],
                    _ = t[13],
                    m = t[14],
                    v = t[15],
                    b = e[0],
                    M = e[1],
                    E = e[2],
                    I = e[3],
                    A = e[4],
                    x = e[5],
                    O = e[6],
                    T = e[7],
                    S = e[8],
                    y = e[9],
                    R = e[10],
                    F = e[11],
                    P = e[12],
                    N = e[13],
                    C = e[14],
                    D = e[15];
                return Math.abs(i - b) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(b)) && Math.abs(
                    r - M
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(M)) && Math.abs(s - E) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(s),
                    Math.abs(E)
                ) && Math.abs(a - I) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(I)) && Math.abs(
                    o - A
                ) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(A)) && Math.abs(l - x) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(l),
                    Math.abs(x)
                ) && Math.abs(h - O) <= n.EPSILON * Math.max(1, Math.abs(h), Math.abs(O)) && Math.abs(
                    u - T
                ) <= n.EPSILON * Math.max(1, Math.abs(u), Math.abs(T)) && Math.abs(c - S) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(c),
                    Math.abs(S)
                ) && Math.abs(p - y) <= n.EPSILON * Math.max(1, Math.abs(p), Math.abs(y)) && Math.abs(
                    d - R
                ) <= n.EPSILON * Math.max(1, Math.abs(d), Math.abs(R)) && Math.abs(f - F) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(f),
                    Math.abs(F)
                ) && Math.abs(g - P) <= n.EPSILON * Math.max(1, Math.abs(g), Math.abs(P)) && Math.abs(
                    _ - N
                ) <= n.EPSILON * Math.max(1, Math.abs(_), Math.abs(N)) && Math.abs(m - C) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(m),
                    Math.abs(C)
                ) && Math.abs(v - D) <= n.EPSILON * Math.max(1, Math.abs(v), Math.abs(D))
            },
            t.exports = r
        },
        function (t, e, i) {
            var n = i(1),
                r = i(4),
                s = i(7),
                a = i(8),
                o = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(4);
                        return t[0] = 0,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t
                    }
                };
            o.rotationTo = function () {
                var t = s.create(),
                    e = s.fromValues(1, 0, 0),
                    i = s.fromValues(0, 1, 0);
                return function (n, r, a) {
                    var l = s.dot(r, a);
                    return -.999999 > l
                        ? (
                            s.cross(t, e, r),
                            s.length(t) < 1e-6 && s.cross(t, i, r),
                            s.normalize(t, t),
                            o.setAxisAngle(n, t, Math.PI),
                            n
                        )
                        : l > .999999
                            ? (n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 1, n)
                            : (
                                s.cross(t, r, a),
                                n[0] = t[0],
                                n[1] = t[1],
                                n[2] = t[2],
                                n[3] = 1 + l,
                                o.normalize(n, n)
                            )
                }
            }(),
            o.setAxes = function () {
                var t = r.create();
                return function (e, i, n, r) {
                    return t[0] = n[0],
                    t[3] = n[1],
                    t[6] = n[2],
                    t[1] = r[0],
                    t[4] = r[1],
                    t[7] = r[2],
                    t[2] = -i[0],
                    t[5] = -i[1],
                    t[8] = -i[2],
                    o.normalize(e, o.fromMat3(e, t))
                }
            }(),
            o.clone = a.clone,
            o.fromValues = a.fromValues,
            o.copy = a.copy,
            o.set = a.set,
            o.identity = function (t) {
                return t[0] = 0,
                t[1] = 0,
                t[2] = 0,
                t[3] = 1,
                t
            },
            o.setAxisAngle = function (t, e, i) {
                i *= .5;
                var n = Math.sin(i);
                return t[0] = n * e[0],
                t[1] = n * e[1],
                t[2] = n * e[2],
                t[3] = Math.cos(i),
                t
            },
            o.getAxisAngle = function (t, e) {
                var i = 2 * Math.acos(e[3]),
                    n = Math.sin(i / 2);
                return 0 != n
                    ? (t[0] = e[0] / n, t[1] = e[1] / n, t[2] = e[2] / n)
                    : (t[0] = 1, t[1] = 0, t[2] = 0),
                i
            },
            o.add = a.add,
            o.multiply = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = i[0],
                    l = i[1],
                    h = i[2],
                    u = i[3];
                return t[0] = n * u + a * o + r * h - s * l,
                t[1] = r * u + a * l + s * o - n * h,
                t[2] = s * u + a * h + n * l - r * o,
                t[3] = a * u - n * o - r * l - s * h,
                t
            },
            o.mul = o.multiply,
            o.scale = a.scale,
            o.rotateX = function (t, e, i) {
                i *= .5;
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = Math.sin(i),
                    l = Math.cos(i);
                return t[0] = n * l + a * o,
                t[1] = r * l + s * o,
                t[2] = s * l - r * o,
                t[3] = a * l - n * o,
                t
            },
            o.rotateY = function (t, e, i) {
                i *= .5;
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = Math.sin(i),
                    l = Math.cos(i);
                return t[0] = n * l - s * o,
                t[1] = r * l + a * o,
                t[2] = s * l + n * o,
                t[3] = a * l - r * o,
                t
            },
            o.rotateZ = function (t, e, i) {
                i *= .5;
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3],
                    o = Math.sin(i),
                    l = Math.cos(i);
                return t[0] = n * l + r * o,
                t[1] = r * l - n * o,
                t[2] = s * l + a * o,
                t[3] = a * l - s * o,
                t
            },
            o.calculateW = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2];
                return t[0] = i,
                t[1] = n,
                t[2] = r,
                t[3] = Math.sqrt(Math.abs(1 - i * i - n * n - r * r)),
                t
            },
            o.dot = a.dot,
            o.lerp = a.lerp,
            o.slerp = function (t, e, i, n) {
                var r,
                    s,
                    a,
                    o,
                    l,
                    h = e[0],
                    u = e[1],
                    c = e[2],
                    p = e[3],
                    d = i[0],
                    f = i[1],
                    g = i[2],
                    _ = i[3];
                return 0 > (s = h * d + u * f + c * g + p * _) && (
                    s = -s,
                    d = -d,
                    f = -f,
                    g = -g,
                    _ = -_
                ),
                1 - s > 1e-6
                    ? (
                        r = Math.acos(s),
                        a = Math.sin(r),
                        o = Math.sin((1 - n) * r) / a,
                        l = Math.sin(n * r) / a
                    )
                    : (o = 1 - n, l = n),
                t[0] = o * h + l * d,
                t[1] = o * u + l * f,
                t[2] = o * c + l * g,
                t[3] = o * p + l * _,
                t
            },
            o.sqlerp = function () {
                var t = o.create(),
                    e = o.create();
                return function (i, n, r, s, a, l) {
                    return o.slerp(t, n, a, l),
                    o.slerp(e, r, s, l),
                    o.slerp(i, t, e, 2 * l * (1 - l)),
                    i
                }
            }(),
            o.invert = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = i * i + n * n + r * r + s * s,
                    o = a
                        ? 1 / a
                        : 0;
                return t[0] = -i * o,
                t[1] = -n * o,
                t[2] = -r * o,
                t[3] = s * o,
                t
            },
            o.conjugate = function (t, e) {
                return t[0] = -e[0],
                t[1] = -e[1],
                t[2] = -e[2],
                t[3] = e[3],
                t
            },
            o.length = a.length,
            o.len = o.length,
            o.squaredLength = a.squaredLength,
            o.sqrLen = o.squaredLength,
            o.normalize = a.normalize,
            o.fromMat3 = function (t, e) {
                var i,
                    n = e[0] + e[4] + e[8];
                if (n > 0) 
                    i = Math.sqrt(n + 1),
                    t[3] = .5 * i,
                    i = .5 / i,
                    t[0] = (e[5] - e[7]) * i,
                    t[1] = (e[6] - e[2]) * i,
                    t[2] = (e[1] - e[3]) * i;
                else {
                    var r = 0;
                    e[4] > e[0] && (r = 1),
                    e[8] > e[3 * r + r] && (r = 2);
                    var s = (r + 1) % 3,
                        a = (r + 2) % 3;
                    i = Math.sqrt(e[3 * r + r] - e[3 * s + s] - e[3 * a + a] + 1),
                    t[r] = .5 * i,
                    i = .5 / i,
                    t[3] = (e[3 * s + a] - e[3 * a + s]) * i,
                    t[s] = (e[3 * s + r] + e[3 * r + s]) * i,
                    t[a] = (e[3 * a + r] + e[3 * r + a]) * i
                }
                return t
            },
            o.str = function (t) {
                return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            },
            o.exactEquals = a.exactEquals,
            o.equals = a.equals,
            t.exports = o
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(3);
                        return t[0] = 0,
                        t[1] = 0,
                        t[2] = 0,
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(3);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e[2] = t[2],
                        e
                    },
                    fromValues: function (t, e, i) {
                        var r = new n.ARRAY_TYPE(3);
                        return r[0] = t,
                        r[1] = e,
                        r[2] = i,
                        r
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t
                    },
                    set: function (t, e, i, n) {
                        return t[0] = e,
                        t[1] = i,
                        t[2] = n,
                        t
                    },
                    add: function (t, e, i) {
                        return t[0] = e[0] + i[0],
                        t[1] = e[1] + i[1],
                        t[2] = e[2] + i[2],
                        t
                    },
                    subtract: function (t, e, i) {
                        return t[0] = e[0] - i[0],
                        t[1] = e[1] - i[1],
                        t[2] = e[2] - i[2],
                        t
                    }
                };
            r.sub = r.subtract,
            r.multiply = function (t, e, i) {
                return t[0] = e[0] * i[0],
                t[1] = e[1] * i[1],
                t[2] = e[2] * i[2],
                t
            },
            r.mul = r.multiply,
            r.divide = function (t, e, i) {
                return t[0] = e[0] / i[0],
                t[1] = e[1] / i[1],
                t[2] = e[2] / i[2],
                t
            },
            r.div = r.divide,
            r.ceil = function (t, e) {
                return t[0] = Math.ceil(e[0]),
                t[1] = Math.ceil(e[1]),
                t[2] = Math.ceil(e[2]),
                t
            },
            r.floor = function (t, e) {
                return t[0] = Math.floor(e[0]),
                t[1] = Math.floor(e[1]),
                t[2] = Math.floor(e[2]),
                t
            },
            r.min = function (t, e, i) {
                return t[0] = Math.min(e[0], i[0]),
                t[1] = Math.min(e[1], i[1]),
                t[2] = Math.min(e[2], i[2]),
                t
            },
            r.max = function (t, e, i) {
                return t[0] = Math.max(e[0], i[0]),
                t[1] = Math.max(e[1], i[1]),
                t[2] = Math.max(e[2], i[2]),
                t
            },
            r.round = function (t, e) {
                return t[0] = Math.round(e[0]),
                t[1] = Math.round(e[1]),
                t[2] = Math.round(e[2]),
                t
            },
            r.scale = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t[2] = e[2] * i,
                t
            },
            r.scaleAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t[2] = e[2] + i[2] * n,
                t
            },
            r.distance = function (t, e) {
                var i = e[0] - t[0],
                    n = e[1] - t[1],
                    r = e[2] - t[2];
                return Math.sqrt(i * i + n * n + r * r)
            },
            r.dist = r.distance,
            r.squaredDistance = function (t, e) {
                var i = e[0] - t[0],
                    n = e[1] - t[1],
                    r = e[2] - t[2];
                return i * i + n * n + r * r
            },
            r.sqrDist = r.squaredDistance,
            r.length = function (t) {
                var e = t[0],
                    i = t[1],
                    n = t[2];
                return Math.sqrt(e * e + i * i + n * n)
            },
            r.len = r.length,
            r.squaredLength = function (t) {
                var e = t[0],
                    i = t[1],
                    n = t[2];
                return e * e + i * i + n * n
            },
            r.sqrLen = r.squaredLength,
            r.negate = function (t, e) {
                return t[0] = -e[0],
                t[1] = -e[1],
                t[2] = -e[2],
                t
            },
            r.inverse = function (t, e) {
                return t[0] = 1 / e[0],
                t[1] = 1 / e[1],
                t[2] = 1 / e[2],
                t
            },
            r.normalize = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = i * i + n * n + r * r;
                return s > 0 && (
                    s = 1 / Math.sqrt(s),
                    t[0] = e[0] * s,
                    t[1] = e[1] * s,
                    t[2] = e[2] * s
                ),
                t
            },
            r.dot = function (t, e) {
                return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
            },
            r.cross = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = i[0],
                    o = i[1],
                    l = i[2];
                return t[0] = r * l - s * o,
                t[1] = s * a - n * l,
                t[2] = n * o - r * a,
                t
            },
            r.lerp = function (t, e, i, n) {
                var r = e[0],
                    s = e[1],
                    a = e[2];
                return t[0] = r + n * (i[0] - r),
                t[1] = s + n * (i[1] - s),
                t[2] = a + n * (i[2] - a),
                t
            },
            r.hermite = function (t, e, i, n, r, s) {
                var a = s * s,
                    o = a * (2 * s - 3) + 1,
                    l = a * (s - 2) + s,
                    h = a * (s - 1),
                    u = a * (3 - 2 * s);
                return t[0] = e[0] * o + i[0] * l + n[0] * h + r[0] * u,
                t[1] = e[1] * o + i[1] * l + n[1] * h + r[1] * u,
                t[2] = e[2] * o + i[2] * l + n[2] * h + r[2] * u,
                t
            },
            r.bezier = function (t, e, i, n, r, s) {
                var a = 1 - s,
                    o = a * a,
                    l = s * s,
                    h = o * a,
                    u = 3 * s * o,
                    c = 3 * l * a,
                    p = l * s;
                return t[0] = e[0] * h + i[0] * u + n[0] * c + r[0] * p,
                t[1] = e[1] * h + i[1] * u + n[1] * c + r[1] * p,
                t[2] = e[2] * h + i[2] * u + n[2] * c + r[2] * p,
                t
            },
            r.random = function (t, e) {
                e = e || 1;
                var i = 2 * n.RANDOM() * Math.PI,
                    r = 2 * n.RANDOM() - 1,
                    s = Math.sqrt(1 - r * r) * e;
                return t[0] = Math.cos(i) * s,
                t[1] = Math.sin(i) * s,
                t[2] = r * e,
                t
            },
            r.transformMat4 = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = i[3] * n + i[7] * r + i[11] * s + i[15];
                return a = a || 1,
                t[0] = (i[0] * n + i[4] * r + i[8] * s + i[12]) / a,
                t[1] = (i[1] * n + i[5] * r + i[9] * s + i[13]) / a,
                t[2] = (i[2] * n + i[6] * r + i[10] * s + i[14]) / a,
                t
            },
            r.transformMat3 = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2];
                return t[0] = n * i[0] + r * i[3] + s * i[6],
                t[1] = n * i[1] + r * i[4] + s * i[7],
                t[2] = n * i[2] + r * i[5] + s * i[8],
                t
            },
            r.transformQuat = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = i[0],
                    o = i[1],
                    l = i[2],
                    h = i[3],
                    u = h * n + o * s - l * r,
                    c = h * r + l * n - a * s,
                    p = h * s + a * r - o * n,
                    d = -a * n - o * r - l * s;
                return t[0] = u * h + d * -a + c * -l - p * -o,
                t[1] = c * h + d * -o + p * -a - u * -l,
                t[2] = p * h + d * -l + u * -o - c * -a,
                t
            },
            r.rotateX = function (t, e, i, n) {
                var r = [],
                    s = [];
                return r[0] = e[0] - i[0],
                r[1] = e[1] - i[1],
                r[2] = e[2] - i[2],
                s[0] = r[0],
                s[1] = r[1] * Math.cos(n) - r[2] * Math.sin(n),
                s[2] = r[1] * Math.sin(n) + r[2] * Math.cos(n),
                t[0] = s[0] + i[0],
                t[1] = s[1] + i[1],
                t[2] = s[2] + i[2],
                t
            },
            r.rotateY = function (t, e, i, n) {
                var r = [],
                    s = [];
                return r[0] = e[0] - i[0],
                r[1] = e[1] - i[1],
                r[2] = e[2] - i[2],
                s[0] = r[2] * Math.sin(n) + r[0] * Math.cos(n),
                s[1] = r[1],
                s[2] = r[2] * Math.cos(n) - r[0] * Math.sin(n),
                t[0] = s[0] + i[0],
                t[1] = s[1] + i[1],
                t[2] = s[2] + i[2],
                t
            },
            r.rotateZ = function (t, e, i, n) {
                var r = [],
                    s = [];
                return r[0] = e[0] - i[0],
                r[1] = e[1] - i[1],
                r[2] = e[2] - i[2],
                s[0] = r[0] * Math.cos(n) - r[1] * Math.sin(n),
                s[1] = r[0] * Math.sin(n) + r[1] * Math.cos(n),
                s[2] = r[2],
                t[0] = s[0] + i[0],
                t[1] = s[1] + i[1],
                t[2] = s[2] + i[2],
                t
            },
            r.forEach = function () {
                var t = r.create();
                return function (e, i, n, r, s, a) {
                    var o,
                        l;
                    for (
                        i || (i = 3),
                        n || (n = 0),
                        l = r
                            ? Math.min(r * i + n, e.length)
                            : e.length,
                        o = n; l > o; o += i
                    ) 
                        t[0] = e[o],
                        t[1] = e[o + 1],
                        t[2] = e[o + 2],
                        s(t, t, a),
                        e[o] = t[0],
                        e[o + 1] = t[1],
                        e[o + 2] = t[2];
                    return e
                }
            }(),
            r.angle = function (t, e) {
                var i = r.fromValues(t[0], t[1], t[2]),
                    n = r.fromValues(e[0], e[1], e[2]);
                r.normalize(i, i),
                r.normalize(n, n);
                var s = r.dot(i, n);
                return s > 1
                    ? 0
                    : Math.acos(s)
            },
            r.str = function (t) {
                return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
            },
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = t[2],
                    a = e[0],
                    o = e[1],
                    l = e[2];
                return Math.abs(i - a) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(
                    r - o
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(o)) && Math.abs(s - l) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(s),
                    Math.abs(l)
                )
            },
            t.exports = r
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(4);
                        return t[0] = 0,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(4);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e[2] = t[2],
                        e[3] = t[3],
                        e
                    },
                    fromValues: function (t, e, i, r) {
                        var s = new n.ARRAY_TYPE(4);
                        return s[0] = t,
                        s[1] = e,
                        s[2] = i,
                        s[3] = r,
                        s
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t[2] = e[2],
                        t[3] = e[3],
                        t
                    },
                    set: function (t, e, i, n, r) {
                        return t[0] = e,
                        t[1] = i,
                        t[2] = n,
                        t[3] = r,
                        t
                    },
                    add: function (t, e, i) {
                        return t[0] = e[0] + i[0],
                        t[1] = e[1] + i[1],
                        t[2] = e[2] + i[2],
                        t[3] = e[3] + i[3],
                        t
                    },
                    subtract: function (t, e, i) {
                        return t[0] = e[0] - i[0],
                        t[1] = e[1] - i[1],
                        t[2] = e[2] - i[2],
                        t[3] = e[3] - i[3],
                        t
                    }
                };
            r.sub = r.subtract,
            r.multiply = function (t, e, i) {
                return t[0] = e[0] * i[0],
                t[1] = e[1] * i[1],
                t[2] = e[2] * i[2],
                t[3] = e[3] * i[3],
                t
            },
            r.mul = r.multiply,
            r.divide = function (t, e, i) {
                return t[0] = e[0] / i[0],
                t[1] = e[1] / i[1],
                t[2] = e[2] / i[2],
                t[3] = e[3] / i[3],
                t
            },
            r.div = r.divide,
            r.ceil = function (t, e) {
                return t[0] = Math.ceil(e[0]),
                t[1] = Math.ceil(e[1]),
                t[2] = Math.ceil(e[2]),
                t[3] = Math.ceil(e[3]),
                t
            },
            r.floor = function (t, e) {
                return t[0] = Math.floor(e[0]),
                t[1] = Math.floor(e[1]),
                t[2] = Math.floor(e[2]),
                t[3] = Math.floor(e[3]),
                t
            },
            r.min = function (t, e, i) {
                return t[0] = Math.min(e[0], i[0]),
                t[1] = Math.min(e[1], i[1]),
                t[2] = Math.min(e[2], i[2]),
                t[3] = Math.min(e[3], i[3]),
                t
            },
            r.max = function (t, e, i) {
                return t[0] = Math.max(e[0], i[0]),
                t[1] = Math.max(e[1], i[1]),
                t[2] = Math.max(e[2], i[2]),
                t[3] = Math.max(e[3], i[3]),
                t
            },
            r.round = function (t, e) {
                return t[0] = Math.round(e[0]),
                t[1] = Math.round(e[1]),
                t[2] = Math.round(e[2]),
                t[3] = Math.round(e[3]),
                t
            },
            r.scale = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t[2] = e[2] * i,
                t[3] = e[3] * i,
                t
            },
            r.scaleAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t[2] = e[2] + i[2] * n,
                t[3] = e[3] + i[3] * n,
                t
            },
            r.distance = function (t, e) {
                var i = e[0] - t[0],
                    n = e[1] - t[1],
                    r = e[2] - t[2],
                    s = e[3] - t[3];
                return Math.sqrt(i * i + n * n + r * r + s * s)
            },
            r.dist = r.distance,
            r.squaredDistance = function (t, e) {
                var i = e[0] - t[0],
                    n = e[1] - t[1],
                    r = e[2] - t[2],
                    s = e[3] - t[3];
                return i * i + n * n + r * r + s * s
            },
            r.sqrDist = r.squaredDistance,
            r.length = function (t) {
                var e = t[0],
                    i = t[1],
                    n = t[2],
                    r = t[3];
                return Math.sqrt(e * e + i * i + n * n + r * r)
            },
            r.len = r.length,
            r.squaredLength = function (t) {
                var e = t[0],
                    i = t[1],
                    n = t[2],
                    r = t[3];
                return e * e + i * i + n * n + r * r
            },
            r.sqrLen = r.squaredLength,
            r.negate = function (t, e) {
                return t[0] = -e[0],
                t[1] = -e[1],
                t[2] = -e[2],
                t[3] = -e[3],
                t
            },
            r.inverse = function (t, e) {
                return t[0] = 1 / e[0],
                t[1] = 1 / e[1],
                t[2] = 1 / e[2],
                t[3] = 1 / e[3],
                t
            },
            r.normalize = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = e[2],
                    s = e[3],
                    a = i * i + n * n + r * r + s * s;
                return a > 0 && (
                    a = 1 / Math.sqrt(a),
                    t[0] = i * a,
                    t[1] = n * a,
                    t[2] = r * a,
                    t[3] = s * a
                ),
                t
            },
            r.dot = function (t, e) {
                return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
            },
            r.lerp = function (t, e, i, n) {
                var r = e[0],
                    s = e[1],
                    a = e[2],
                    o = e[3];
                return t[0] = r + n * (i[0] - r),
                t[1] = s + n * (i[1] - s),
                t[2] = a + n * (i[2] - a),
                t[3] = o + n * (i[3] - o),
                t
            },
            r.random = function (t, e) {
                return e = e || 1,
                t[0] = n.RANDOM(),
                t[1] = n.RANDOM(),
                t[2] = n.RANDOM(),
                t[3] = n.RANDOM(),
                r.normalize(t, t),
                r.scale(t, t, e),
                t
            },
            r.transformMat4 = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = e[3];
                return t[0] = i[0] * n + i[4] * r + i[8] * s + i[12] * a,
                t[1] = i[1] * n + i[5] * r + i[9] * s + i[13] * a,
                t[2] = i[2] * n + i[6] * r + i[10] * s + i[14] * a,
                t[3] = i[3] * n + i[7] * r + i[11] * s + i[15] * a,
                t
            },
            r.transformQuat = function (t, e, i) {
                var n = e[0],
                    r = e[1],
                    s = e[2],
                    a = i[0],
                    o = i[1],
                    l = i[2],
                    h = i[3],
                    u = h * n + o * s - l * r,
                    c = h * r + l * n - a * s,
                    p = h * s + a * r - o * n,
                    d = -a * n - o * r - l * s;
                return t[0] = u * h + d * -a + c * -l - p * -o,
                t[1] = c * h + d * -o + p * -a - u * -l,
                t[2] = p * h + d * -l + u * -o - c * -a,
                t[3] = e[3],
                t
            },
            r.forEach = function () {
                var t = r.create();
                return function (e, i, n, r, s, a) {
                    var o,
                        l;
                    for (
                        i || (i = 4),
                        n || (n = 0),
                        l = r
                            ? Math.min(r * i + n, e.length)
                            : e.length,
                        o = n; l > o; o += i
                    ) 
                        t[0] = e[o],
                        t[1] = e[o + 1],
                        t[2] = e[o + 2],
                        t[3] = e[o + 3],
                        s(t, t, a),
                        e[o] = t[0],
                        e[o + 1] = t[1],
                        e[o + 2] = t[2],
                        e[o + 3] = t[3];
                    return e
                }
            }(),
            r.str = function (t) {
                return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            },
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = t[2],
                    a = t[3],
                    o = e[0],
                    l = e[1],
                    h = e[2],
                    u = e[3];
                return Math.abs(i - o) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(
                    r - l
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(s - h) <= n.EPSILON * Math.max(
                    1,
                    Math.abs(s),
                    Math.abs(h)
                ) && Math.abs(a - u) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(u))
            },
            t.exports = r
        },
        function (t, e, i) {
            var n = i(1),
                r = {
                    create: function () {
                        var t = new n.ARRAY_TYPE(2);
                        return t[0] = 0,
                        t[1] = 0,
                        t
                    },
                    clone: function (t) {
                        var e = new n.ARRAY_TYPE(2);
                        return e[0] = t[0],
                        e[1] = t[1],
                        e
                    },
                    fromValues: function (t, e) {
                        var i = new n.ARRAY_TYPE(2);
                        return i[0] = t,
                        i[1] = e,
                        i
                    },
                    copy: function (t, e) {
                        return t[0] = e[0],
                        t[1] = e[1],
                        t
                    },
                    set: function (t, e, i) {
                        return t[0] = e,
                        t[1] = i,
                        t
                    },
                    add: function (t, e, i) {
                        return t[0] = e[0] + i[0],
                        t[1] = e[1] + i[1],
                        t
                    },
                    subtract: function (t, e, i) {
                        return t[0] = e[0] - i[0],
                        t[1] = e[1] - i[1],
                        t
                    }
                };
            r.sub = r.subtract,
            r.multiply = function (t, e, i) {
                return t[0] = e[0] * i[0],
                t[1] = e[1] * i[1],
                t
            },
            r.mul = r.multiply,
            r.divide = function (t, e, i) {
                return t[0] = e[0] / i[0],
                t[1] = e[1] / i[1],
                t
            },
            r.div = r.divide,
            r.ceil = function (t, e) {
                return t[0] = Math.ceil(e[0]),
                t[1] = Math.ceil(e[1]),
                t
            },
            r.floor = function (t, e) {
                return t[0] = Math.floor(e[0]),
                t[1] = Math.floor(e[1]),
                t
            },
            r.min = function (t, e, i) {
                return t[0] = Math.min(e[0], i[0]),
                t[1] = Math.min(e[1], i[1]),
                t
            },
            r.max = function (t, e, i) {
                return t[0] = Math.max(e[0], i[0]),
                t[1] = Math.max(e[1], i[1]),
                t
            },
            r.round = function (t, e) {
                return t[0] = Math.round(e[0]),
                t[1] = Math.round(e[1]),
                t
            },
            r.scale = function (t, e, i) {
                return t[0] = e[0] * i,
                t[1] = e[1] * i,
                t
            },
            r.scaleAndAdd = function (t, e, i, n) {
                return t[0] = e[0] + i[0] * n,
                t[1] = e[1] + i[1] * n,
                t
            },
            r.distance = function (t, e) {
                var i = e[0] - t[0],
                    n = e[1] - t[1];
                return Math.sqrt(i * i + n * n)
            },
            r.dist = r.distance,
            r.squaredDistance = function (t, e) {
                var i = e[0] - t[0],
                    n = e[1] - t[1];
                return i * i + n * n
            },
            r.sqrDist = r.squaredDistance,
            r.length = function (t) {
                var e = t[0],
                    i = t[1];
                return Math.sqrt(e * e + i * i)
            },
            r.len = r.length,
            r.squaredLength = function (t) {
                var e = t[0],
                    i = t[1];
                return e * e + i * i
            },
            r.sqrLen = r.squaredLength,
            r.negate = function (t, e) {
                return t[0] = -e[0],
                t[1] = -e[1],
                t
            },
            r.inverse = function (t, e) {
                return t[0] = 1 / e[0],
                t[1] = 1 / e[1],
                t
            },
            r.normalize = function (t, e) {
                var i = e[0],
                    n = e[1],
                    r = i * i + n * n;
                return r > 0 && (r = 1 / Math.sqrt(r), t[0] = e[0] * r, t[1] = e[1] * r),
                t
            },
            r.dot = function (t, e) {
                return t[0] * e[0] + t[1] * e[1]
            },
            r.cross = function (t, e, i) {
                var n = e[0] * i[1] - e[1] * i[0];
                return t[0] = t[1] = 0,
                t[2] = n,
                t
            },
            r.lerp = function (t, e, i, n) {
                var r = e[0],
                    s = e[1];
                return t[0] = r + n * (i[0] - r),
                t[1] = s + n * (i[1] - s),
                t
            },
            r.random = function (t, e) {
                e = e || 1;
                var i = 2 * n.RANDOM() * Math.PI;
                return t[0] = Math.cos(i) * e,
                t[1] = Math.sin(i) * e,
                t
            },
            r.transformMat2 = function (t, e, i) {
                var n = e[0],
                    r = e[1];
                return t[0] = i[0] * n + i[2] * r,
                t[1] = i[1] * n + i[3] * r,
                t
            },
            r.transformMat2d = function (t, e, i) {
                var n = e[0],
                    r = e[1];
                return t[0] = i[0] * n + i[2] * r + i[4],
                t[1] = i[1] * n + i[3] * r + i[5],
                t
            },
            r.transformMat3 = function (t, e, i) {
                var n = e[0],
                    r = e[1];
                return t[0] = i[0] * n + i[3] * r + i[6],
                t[1] = i[1] * n + i[4] * r + i[7],
                t
            },
            r.transformMat4 = function (t, e, i) {
                var n = e[0],
                    r = e[1];
                return t[0] = i[0] * n + i[4] * r + i[12],
                t[1] = i[1] * n + i[5] * r + i[13],
                t
            },
            r.forEach = function () {
                var t = r.create();
                return function (e, i, n, r, s, a) {
                    var o,
                        l;
                    for (
                        i || (i = 2),
                        n || (n = 0),
                        l = r
                            ? Math.min(r * i + n, e.length)
                            : e.length,
                        o = n; l > o; o += i
                    ) 
                        t[0] = e[o],
                        t[1] = e[o + 1],
                        s(t, t, a),
                        e[o] = t[0],
                        e[o + 1] = t[1];
                    return e
                }
            }(),
            r.str = function (t) {
                return "vec2(" + t[0] + ", " + t[1] + ")"
            },
            r.exactEquals = function (t, e) {
                return t[0] === e[0] && t[1] === e[1]
            },
            r.equals = function (t, e) {
                var i = t[0],
                    r = t[1],
                    s = e[0],
                    a = e[1];
                return Math.abs(i - s) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(
                    r - a
                ) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(a))
            },
            t.exports = r
        }
    ])
}),
(CABLES = function (t) {
    var e = {};
    function i(n) {
        if (e[n]) 
            return e[n].exports;
        var r = e[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return t[n].call(r.exports, r, r.exports, i),
        r.l = !0,
        r.exports
    }
    return i.m = t,
    i.c = e,
    i.d = function (t, e, n) {
        i.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: n
        })
    },
    i.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(
            t,
            Symbol.toStringTag,
            {value: "Module"}
        ),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    },
    i.t = function (t, e) {
        if (1 & e && (t = i(t)), 8 & e) 
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) 
            return t;
        var n = Object.create(null);
        if (i.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t) 
            for (var r in t) 
                i.d(n, r, function (e) {
                    return t[e]
                }.bind(null, r));
    return n
    },
    i.n = function (t) {
        var e = t && t.__esModule
            ? function () {
                return t.default
            }
            : function () {
                return t
            };
        return i.d(e, "a", e),
        e
    },
    i.o = function (t, e) {
        return Object
            .prototype
            .hasOwnProperty
            .call(t, e)
    },
    i.p = "",
    i(i.s = 0)
}([
    function (t, e, i) {
        t.exports = i(1)
    },
    function (t, e, n) {
        "use strict";
        n.r(e);
        var r = {};
        n.r(r),
        n.d(r, "base64Chars", function () {
            return l
        }),
        n.d(r, "base64lookup", function () {
            return c
        }),
        n.d(r, "b64encTypesArray", function () {
            return p
        }),
        n.d(r, "b64decTypedArray", function () {
            return d
        });
        var s = {};
        n.r(s),
        n.d(s, "shuffleArray", function () {
            return _
        }),
        n.d(s, "uuid", function () {
            return v
        }),
        n.d(s, "generateUUID", function () {
            return b
        }),
        n.d(s, "simpleId", function () {
            return E
        }),
        n.d(s, "smoothStep", function () {
            return I
        }),
        n.d(s, "smootherStep", function () {
            return A
        }),
        n.d(s, "map", function () {
            return x
        }),
        n.d(s, "cacheBust", function () {
            return O
        }),
        n.d(s, "jsonp", function () {
            return S
        }),
        n.d(s, "ajaxSync", function () {
            return y
        }),
        n.d(s, "ajax", function () {
            return R
        }),
        n.d(s, "request", function () {
            return F
        }),
        n.d(s, "UTILS", function () {
            return g
        });
        var a = {};
        n.r(a),
        n.d(a, "easeExpoIn", function () {
            return D
        }),
        n.d(a, "easeExpoOut", function () {
            return w
        }),
        n.d(a, "easeExpoInOut", function () {
            return L
        }),
        n.d(a, "easeCubicIn", function () {
            return B
        }),
        n.d(a, "easeCubicOut", function () {
            return k
        }),
        n.d(a, "easeCubicInOut", function () {
            return U
        }),
        n.d(a, "ANIM", function () {
            return C
        }),
        n.d(a, "Anim", function () {
            return V
        }),
        n.d(a, "TL", function () {
            return G
        });
        var o = {};
        n.r(o),
        n.d(o, "togglePacoRenderer", function () {
            return Tt
        }),
        n.d(o, "showPacoRenderer", function () {
            return St
        }),
        n.d(o, "PatchConnectionReceiver", function () {
            return yt
        }),
        n.d(o, "PatchConnectionSender", function () {
            return Rt
        }),
        n.d(o, "PatchConnectorBroadcastChannel", function () {
            return Ft
        });
        const l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            h = new Uint8Array(256);
        for (var u = 0; u < l.length; u++) 
            h[l.charCodeAt(u)] = u;
        const c = h,
            p = function (t) {
                t.buffer && (t = t.buffer);
                var e,
                    i = new Uint8Array(t),
                    n = i.length,
                    r = "";
                for (e = 0; e < n; e += 3) 
                    r += l[i[e] >> 2],
                    r += l[(3 & i[e]) << 4 | i[e + 1] >> 4],
                    r += l[(15 & i[e + 1]) << 2 | i[e + 2] >> 6],
                    r += l[63 & i[e + 2]];
                return n % 3 == 2
                    ? r = r.substring(0, r.length - 1) + "="
                    : n % 3 == 1 && (r = r.substring(0, r.length - 2) + "=="),
                r
            },
            d = function (t) {
                var e,
                    i,
                    n,
                    r,
                    s,
                    a = .75 * t.length,
                    o = t.length,
                    l = 0;
                "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
                var h = new ArrayBuffer(a),
                    u = new Uint8Array(h);
                for (e = 0; e < o; e += 4) 
                    i = c[t.charCodeAt(e)],
                    n = c[t.charCodeAt(e + 1)],
                    r = c[t.charCodeAt(e + 2)],
                    s = c[t.charCodeAt(e + 3)],
                    u[l++] = i << 2 | n >> 4,
                    u[l++] = (15 & n) << 4 | r >> 2,
                    u[l++] = (3 & r) << 6 | 63 & s;
                return h
            },
            f = function () {
                this._eventCallbacks = {},
                this.addEventListener = function (t, e) {
                    this._eventCallbacks[t]
                        ? this
                            ._eventCallbacks[t]
                            .push(e)
                        : this._eventCallbacks[t] = [e]
                },
                this.hasEventListener = function (t, e) {
                    if (t && e) {
                        if (this._eventCallbacks[t]) 
                            return -1 != this
                                ._eventCallbacks[t]
                                .indexOf(e)
                        } else 
                        console.log("hasListener: missing parameters")
                },
                this.removeEventListener = function (t, e) {
                    if (this._eventCallbacks[t]) {
                        var i = this
                            ._eventCallbacks[t]
                            .indexOf(e);
                        -1 == i
                            ? console.log("eventlistener " + t + " not found...")
                            : this
                                ._eventCallbacks[t]
                                .splice(i)
                    }
                },
                this.emitEvent = function (t, e, i, n, r, s, a) {
                    if (this._eventCallbacks[t]) 
                        for (var o = 0; o < this._eventCallbacks[t].length; o++) 
                            this._eventCallbacks[t][o] && this._eventCallbacks[t][o](e, i, n, r, s, a)
                }
            },
            g = {
                float32Concat: function (t, e) {
                    t instanceof Float32Array || (t = new Float32Array(t)),
                    e instanceof Float32Array || (e = new Float32Array(e));
                    var i = t.length,
                        n = new Float32Array(i + e.length);
                    return n.set(t),
                    n.set(e, i),
                    n
                }
            },
            _ = function (t) {
                for (var e = t.length - 1; e > 0; e--) {
                    var i = Math.floor(Math.seededRandom() * (e + 1)),
                        n = t[e];
                    t[e] = t[i],
                    t[i] = n
                }
                return t
            },
            m = function () {
                var t = (new Date).getTime();
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, e => {
                    var i = (t + 16 * Math.random()) % 16 | 0;
                    return t = Math.floor(t / 16),
                    (
                        "x" == e
                            ? i
                            : 3 & i | 8
                    ).toString(16)
                })
            },
            v = m,
            b = m;
        var M = 0;
        const E = function () {
                return++ M
            },
            I = function (t) {
                var e = Math.max(0, Math.min(1, (t - 0) / 1));
                return e * e * (3 - 2 * e)
            },
            A = function (t) {
                var e = Math.max(0, Math.min(1, (t - 0) / 1));
                return e * e * e * (e * (6 * e - 15) + 10)
            },
            x = function (t, e, i, n, r, s) {
                if (t >= i) 
                    return r;
                if (t <= e) 
                    return n;
                var a = !1,
                    o = Math.min(e, i),
                    l = Math.max(e, i);
                o != e && (a = !0);
                var h = !1,
                    u = Math.min(n, r),
                    c = Math.max(n, r);
                u != n && (h = !0);
                var p,
                    d;
                return p = a
                    ? (l - t) * (c - u) / (l - o)
                    : (t - o) * (c - u) / (l - o),
                d = h
                    ? c - p
                    : p + u,
                s
                    ? 1 == s
                        ? n + (t = Math.max(0, Math.min(1, (d - n) / (r - n)))) * t * (3 - 2 * t) * (
                            r - n
                        )
                        : 2 == s
                            ? n + (t = Math.max(0, Math.min(1, (d - n) / (r - n)))) * t * t * (
                                t * (6 * t - 15) + 10
                            ) * (r - n)
                            : d
                    : d
            };
        Math.randomSeed = 1,
        Math.seededRandom = function (t, e) {
            return 0 === Math.randomSeed && (Math.randomSeed = 999 * Math.random()),
            t = t || 1,
            e = e || 0,
            Math.randomSeed = (9301 * Math.randomSeed + 49297) % 233280,
            e + Math.randomSeed / 233280 * (t - e)
        },
        g.arrayWriteToEnd = function (t, e) {
            for (var i = 1; i < t.length; i++) 
                t[i - 1] = t[i];
            t[t.length - 1] = e
        },
        g.isNumeric = function (t) {
            return !isNaN(parseFloat(t)) && isFinite(t)
        },
        g.isArray = function (t) {
            return "[object Array]" === Object
                .prototype
                .toString
                .call(t)
        },
        String.prototype.endl = function () {
            return this + "\n"
        },
        String.prototype.startsWith = function (t) {
            return 0 === this.indexOf(t)
        },
        String.prototype.endsWith = function (t) {
            return this.match(t + "$") == t
        };
        const O = function (t) {
            return t.indexOf("?") > -1
                ? t += "&"
                : t += "?",
            t + "cb=" + CABLES.uuid()
        };
        var T = null;
        const S = function (t, e) {
                T = T || 0;
                var i = ++T;
                console.log("making jsonp request..."),
                CABLES["jsonpFunc" + i] = function (t) {
                    console.log(t),
                    e(!1, t)
                };
                var n = "?";
                t.indexOf(n) > -1 && (n = "&");
                var r = document.createElement("script");
                r.setAttribute("src", t + n + "callback=CABLES.jsonpFunc" + i),
                document
                    .body
                    .appendChild(r)
            },
            y = function (t, e, i, n, r) {
                F({
                    url: t,
                    cb: e,
                    method: i,
                    data: n,
                    contenttype: r,
                    sync: !0
                })
            },
            R = function (t, e, i, n, r, s) {
                F({
                    url: t,
                    cb: e,
                    method: i,
                    "data:": n,
                    contenttype: r,
                    sync: !1,
                    jsonp: s
                })
            },
            F = function (t) {
                var e;
                t.hasOwnProperty("asynch") || (t.asynch = !0);
                try {
                    e = new XMLHttpRequest
                } catch (t) {}
                e.onreadystatechange = function () {
                    4 == e.readyState && t.cb && (
                        200 == e.status || 0 == e.status
                            ? t.cb(!1, e.responseText, e)
                            : t.cb(!0, e.responseText, e)
                    )
                },
                e.addEventListener("progress", t => {}),
                e.open(
                    t.method
                        ? t.method.toUpperCase()
                        : "GET",
                    t.url,
                    !t.sync
                ),
                t.post || t.data
                    ? (e.setRequestHeader(
                        "Content-type",
                        t.contenttype
                            ? t.contenttype
                            : "application/x-www-form-urlencoded"
                    ), e.send(t.data || t.post))
                    : e.send()
            };
        window.performance = window.performance || {
            offset: Date.now(),
            now: function () {
                return Date.now() - this.offset
            }
        };
        const P = {
                ANIM: {
                    EASINGS: [
                        "linear",
                        "absolute",
                        "smoothstep",
                        "smootherstep",
                        "Cubic In",
                        "Cubic Out",
                        "Cubic In Out",
                        "Expo In",
                        "Expo Out",
                        "Expo In Out",
                        "Sin In",
                        "Sin Out",
                        "Sin In Out",
                        "Quart In",
                        "Quart Out",
                        "Quart In Out",
                        "Quint In",
                        "Quint Out",
                        "Quint In Out",
                        "Back In",
                        "Back Out",
                        "Back In Out",
                        "Elastic In",
                        "Elastic Out",
                        "Elastic In Out",
                        "Bounce In",
                        "Bounce Out"
                    ],
                    EASING_LINEAR: 0,
                    EASING_ABSOLUTE: 1,
                    EASING_SMOOTHSTEP: 2,
                    EASING_SMOOTHERSTEP: 3,
                    EASING_BEZIER: 4,
                    EASING_CUBIC_IN: 5,
                    EASING_CUBIC_OUT: 6,
                    EASING_CUBIC_INOUT: 7,
                    EASING_EXPO_IN: 8,
                    EASING_EXPO_OUT: 9,
                    EASING_EXPO_INOUT: 10,
                    EASING_SIN_IN: 11,
                    EASING_SIN_OUT: 12,
                    EASING_SIN_INOUT: 13,
                    EASING_BACK_IN: 14,
                    EASING_BACK_OUT: 15,
                    EASING_BACK_INOUT: 16,
                    EASING_ELASTIC_IN: 17,
                    EASING_ELASTIC_OUT: 18,
                    EASING_BOUNCE_IN: 19,
                    EASING_BOUNCE_OUT: 21,
                    EASING_QUART_IN: 22,
                    EASING_QUART_OUT: 23,
                    EASING_QUART_INOUT: 24,
                    EASING_QUINT_IN: 25,
                    EASING_QUINT_OUT: 26,
                    EASING_QUINT_INOUT: 27
                },
                OP: {
                    OP_PORT_TYPE_VALUE: 0,
                    OP_PORT_TYPE_FUNCTION: 1,
                    OP_PORT_TYPE_OBJECT: 2,
                    OP_PORT_TYPE_TEXTURE: 2,
                    OP_PORT_TYPE_ARRAY: 3,
                    OP_PORT_TYPE_DYNAMIC: 4,
                    OP_PORT_TYPE_STRING: 5,
                    OP_VERSION_PREFIX: "_v"
                },
                PORT: {
                    PORT_DIR_IN: 0,
                    PORT_DIR_OUT: 1
                },
                PACO: {
                    PACO_CLEAR: 0,
                    PACO_VALUECHANGE: 1,
                    PACO_OP_DELETE: 2,
                    PACO_UNLINK: 3,
                    PACO_LINK: 4,
                    PACO_LOAD: 5,
                    PACO_OP_CREATE: 6,
                    PACO_OP_ENABLE: 7,
                    PACO_OP_DISABLE: 8
                }
            },
            N = function (t, e, i, n) {
                f.apply(this),
                this.data = {},
                this.direction = P.PORT.PORT_DIR_IN,
                this.id = b(),
                this.parent = t,
                this.links = [],
                this.value = 0,
                this.name = e,
                this.type = i || P.OP.OP_PORT_TYPE_VALUE,
                this.uiAttribs = n || {},
                this.anim = null,
                this._oldAnimVal = -5711,
                this.defaultValue = null,
                this._uiActiveState = !0,
                this.ignoreValueSerialize = !1,
                this.onLinkChanged = null,
                this.crashed = !1,
                this._valueBeforeLink = null,
                this._lastAnimFrame = -1,
                this._animated = !1,
                this.onValueChanged = null,
                this.onTriggered = null,
                this.onUiActiveStateChange = null,
                this.changeAlways = !1,
                this._warnedDeprecated = !1,
                Object.defineProperty(this, "val", {
                    get() {
                        return this._warnedDeprecated = !0,
                        this.get()
                    },
                    set(t) {
                        this.setValue(t),
                        this._warnedDeprecated = !0
                    }
                })
            };
        N.prototype.onAnimToggle = function () {},
        N.prototype._onAnimToggle = function () {
            this.onAnimToggle()
        },
        N.prototype.hidePort = function () {
            this.setUiAttribs({
                hidePort: !0
            })
        },
        N.prototype.remove = function () {
            this.removeLinks(),
            this
                .parent
                .removePort(this)
        },
        N.prototype.setUiAttribs = function (t) {
            for (var e in this.uiAttribs || (this.uiAttribs = {}), t) 
                this.uiAttribs[e] = t[e];
            this.emitEvent("onUiAttrChange", t)
        },
        N.prototype.get = function () {
            return this._animated && this._lastAnimFrame != this
                .parent
                .patch
                .getFrameNum() && (
                    this._lastAnimFrame = this.parent.patch.getFrameNum(),
                    this.value = this.anim.getValue(this.parent.patch.timer.getTime()),
                    this._oldAnimVal = this.value,
                    this.forceChange()
                ),
            this.value
        },
        N.prototype.set = N.prototype.setValue = function (t) {
            if (void 0 !== t && this.parent.enabled && !this.crashed && (t !== this.value || this.changeAlways || this.type == P.OP.OP_PORT_TYPE_TEXTURE || this.type == P.OP.OP_PORT_TYPE_ARRAY)) {
                if (this._animated) 
                    this
                        .anim
                        .setValue(this.parent.patch.timer.getTime(), t);
                else {
                    try {
                        this.value = t,
                        this.forceChange()
                    } catch (t) {
                        this.crashed = !0,
                        this.setValue = function (t) {},
                        this.onTriggered = function () {},
                        console.log("exception!"),
                        console.error("onvaluechanged exception cought", t),
                        console.log(t.stack),
                        console.log("exception in: " + this.parent.name),
                        gui && gui.showOpCrash(this.parent),
                        this
                            .parent
                            .patch
                            .emitEvent("exception".ex, this.parent)
                    }
                    CABLES.UI && this.type == P.OP.OP_PORT_TYPE_TEXTURE && gui
                        .texturePreview()
                        .updateTexturePort(this)
                }
                if (this.direction == P.PORT.PORT_DIR_OUT) 
                    for (var e = 0; e < this.links.length; ++e) 
                        this
                            .links[e]
                            .setValue()
                }
        },
        N.prototype.updateAnim = function () {
            this._animated && (
                this.value = this.get(),
                (this._oldAnimVal != this.value || this.changeAlways) && (this._oldAnimVal = this.value, this.forceChange()),
                this._oldAnimVal = this.value
            )
        },
        N.args = function (t) {
            return (t + "")
                .replace(/[\/][\/].*$/gm, "")
                .replace(/\s+/g, "")
                .replace(/[\/][*][^\/*]*[*][\/]/g, "")
                .split("){", 1)[0]
                .replace(/^[^(]*[(]/, "")
                .replace(/=[^,]+/g, "")
                .split(",")
                .filter(Boolean)
        },
        N.prototype.forceChange = function () {
            this.onValueChanged || this.onChange,
            this.onChange
                ? this.onChange(this, this.value)
                : this.onValueChanged && this.onValueChanged(this, this.value)
        },
        N.prototype.getTypeString = function () {
            return this.type == P.OP.OP_PORT_TYPE_VALUE
                ? "Number"
                : this.type == P.OP.OP_PORT_TYPE_FUNCTION
                    ? "Trigger"
                    : this.type == P.OP.OP_PORT_TYPE_OBJECT
                        ? "Object"
                        : this.type == P.OP.OP_PORT_TYPE_DYNAMIC
                            ? "Dynamic"
                            : this.type == P.OP.OP_PORT_TYPE_ARRAY
                                ? "Array"
                                : this.type == P.OP.OP_PORT_TYPE_STRING
                                    ? "String"
                                    : "Unknown"
        },
        N.prototype.getSerialized = function () {
            var t = {};
            if (
                t.name = this.getName(),
                this.ignoreValueSerialize || 0 !== this.links.length || this.type == P.OP.OP_PORT_TYPE_OBJECT && this.value && this.value.tex || (t.value = this.value),
                this._animated && (t.animated = !0),
                this.anim && (t.anim = this.anim.getSerialized()),
                "file" == this.uiAttribs.display && (t.display = this.uiAttribs.display),
                this.direction == P.PORT.PORT_DIR_IN && this.links.length > 0
            ) 
                for (var e in t.links = [], this.links) 
                    this
                        .links[e]
                        .portIn && this
                        .links[e]
                        .portOut && t
                        .links
                        .push(this.links[e].getSerialized());
            return t
        },
        N.prototype.shouldLink = function () {
            return !0
        },
        N.prototype.removeLinks = function () {
            for (var t = 0; this.links.length > 0;) {
                if (++t > 5e3) {
                    console.warn("could not delete links... / infinite loop"),
                    this.links.length = 0;
                    break
                }
                this
                    .links[0]
                    .remove()
            }
        },
        N.prototype.removeLink = function (t) {
            for (var e in this.links) 
                this.links[e] == t && this
                    .links
                    .splice(e, 1);
            this.direction == P.PORT.PORT_DIR_IN && (
                this.type == P.OP.OP_PORT_TYPE_VALUE
                    ? this.setValue(this._valueBeforeLink || 0)
                    : this.setValue(this._valueBeforeLink || null)
            ),
            this.onLinkChanged && this.onLinkChanged(),
            this.emitEvent("onLinkChanged")
        },
        N.prototype.getName = function () {
            return this.name
        },
        N.prototype.addLink = function (t) {
            this._valueBeforeLink = this.value,
            this
                .links
                .push(t),
            this.onLinkChanged && this.onLinkChanged(),
            this.emitEvent("onLinkChanged")
        },
        N.prototype.getLinkTo = function (t) {
            for (var e in this.links) 
                if (this.links[e].portIn == t || this.links[e].portOut == t) 
                    return this.links[e]
        },
        N.prototype.removeLinkTo = function (t) {
            for (var e in this.links) 
                if (this.links[e].portIn == t || this.links[e].portOut == t) 
                    return this
                        .links[e]
                        .remove(),
                    this.onLinkChanged && this.onLinkChanged(),
                    void this.emitEvent("onLinkChanged")
        },
        N.prototype.isLinkedTo = function (t) {
            for (var e in this.links) 
                if (this.links[e].portIn == t || this.links[e].portOut == t) 
                    return !0;
        return !1
        },
        N.prototype.trigger = function () {
            if (0 !== this.links.length && this.parent.enabled) {
                var t = null;
                try {
                    for (var e = 0; e < this.links.length; ++e) 
                        this
                            .links[e]
                            .portIn && (t = this.links[e].portIn)._onTriggered(),
                        this.links[e] && this
                            .links[e]
                            .activity()
                    } catch (e) {
                    this.parent.enabled = !1,
                    CABLES.UI && (
                        this.parent.patch.emitEvent("exception".ex, t.parent),
                        window.gui && gui.showOpCrash(t.parent)
                    ),
                    console.log("exception!"),
                    console.error("ontriggered exception cought", e),
                    console.log(e.stack),
                    console.log("exception in: " + t.parent.name)
                }
            }
        },
        N.prototype.call = function () {
            console.log("call deprecated - use trigger() "),
            this.trigger()
        },
        N.prototype.execute = function () {
            console.log("### execute port: " + this.getName(), this.goals.length)
        },
        N.prototype.setAnimated = function (t) {
            this._animated != t && (
                this._animated = t,
                this._animated && !this.anim && (this.anim = new V),
                this._onAnimToggle()
            )
        },
        N.prototype.toggleAnim = function (t) {
            this._animated = !this._animated,
            this._animated && !this.anim && (this.anim = new V),
            this.setAnimated(this._animated),
            this._onAnimToggle()
        },
        N.prototype.getType = function () {
            return this.type
        },
        N.prototype.isLinked = function () {
            return this.links.length > 0
        },
        N.prototype.isAnimated = function () {
            return this._animated
        },
        N.prototype.isHidden = function () {
            return this.uiAttribs.hidePort
        },
        N.prototype._onTriggered = function () {
            this
                .parent
                .updateAnims(),
            this.parent.enabled && this.onTriggered && this.onTriggered()
        },
        N.prototype._onTriggeredProfiling = function () {
            this
                .parent
                .updateAnims(),
            this
                .parent
                .patch
                .profiler
                .add("port", this),
            this.parent.enabled && this.onTriggered && this.onTriggered(),
            this
                .parent
                .patch
                .profiler
                .add("port", null)
        },
        N.prototype.onValueChange = function (t) {
            this.onChange = t
        },
        N.prototype.getUiActiveState = function () {
            return this._uiActiveState
        },
        N.prototype.setUiActiveState = function (t) {
            this._uiActiveState = t,
            this.onUiActiveStateChange && this.onUiActiveStateChange()
        },
        N.portTypeNumberToString = function (t) {
            return t == P.OP.OP_PORT_TYPE_VALUE
                ? "value"
                : t == P.OP.OP_PORT_TYPE_FUNCTION
                    ? "function"
                    : t == P.OP.OP_PORT_TYPE_OBJECT
                        ? "object"
                        : t == P.OP.OP_PORT_TYPE_ARRAY
                            ? "array"
                            : t == P.OP.OP_PORT_TYPE_STRING
                                ? "string"
                                : t == P.OP.OP_PORT_TYPE_DYNAMIC
                                    ? "dynamic"
                                    : "unknown"
        };
        const C = {
            Key: function (t) {
                this.time = 0,
                this.value = 0,
                this.ui = {},
                this.onChange = null,
                this._easing = 0,
                this.bezTime = .5,
                this.bezValue = 0,
                this.bezTimeIn = -.5,
                this.bezValueIn = 0,
                this.cb = null,
                this.cbTriggered = !1,
                this._updateBezier = !1,
                this.setEasing(P.ANIM.EASING_LINEAR),
                this.set(t)
            }
        };
        C.Key.linear = function (t, e, i) {
            return parseFloat(e.value) + parseFloat(i.value - e.value) * t
        },
        C.Key.easeLinear = function (t, e) {
            return C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeAbsolute = function (t, e) {
            return this.value
        };
        const D = function (t) {
            return Math.pow(2, 10 * (t - 1))
        };
        C.Key.easeExpoIn = function (t, e) {
            return t = D(t),
            C
                .Key
                .linear(t, this, e)
        };
        const w = function (t) {
            return 1 - Math.pow(2, -10 * t)
        };
        C.Key.easeExpoOut = function (t, e) {
            return t = w(t),
            C
                .Key
                .linear(t, this, e)
        };
        const L = function (t) {
            return (t *= 2) < 1
                ? t = .5 * Math.pow(2, 10 * (t - 1))
                : (t--, t = .5 * (2 - Math.pow(2, -10 * t))),
            t
        };
        C.Key.easeExpoInOut = function (t, e) {
            return t = L(t),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeSinIn = function (t, e) {
            return t = -1 * Math.cos(t * Math.PI / 2) + 1,
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeSinOut = function (t, e) {
            return t = Math.sin(t * Math.PI / 2),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeSinInOut = function (t, e) {
            return t = -.5 * (Math.cos(Math.PI * t) - 1),
            C
                .Key
                .linear(t, this, e)
        };
        const B = function (t) {
            return t * (t * t)
        };
        C.Key.easeCubicIn = function (t, e) {
            return t = B(t),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeInQuint = function (t, e) {
            return t *= t * t * t * t,
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeOutQuint = function (t, e) {
            return t = (t -= 1) * t * t * t * t + 1,
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeInOutQuint = function (t, e) {
            return (t /= .5) < 1
                ? t *= .5 * t * t * t * t
                : t = .5 * ((t -= 2) * t * t * t * t + 2),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeInQuart = function (t, e) {
            return t *= t * t * t,
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeOutQuart = function (t, e) {
            return t = -1 * ((t -= 1) * t * t * t - 1),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeInOutQuart = function (t, e) {
            return (t /= .5) < 1
                ? t *= .5 * t * t * t
                : t = -.5 * ((t -= 2) * t * t * t - 2),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.bounce = function (t) {
            return (t /= 1) < 1 / 2.75
                ? t *= 7.5625 * t
                : t = t < 2 / 2.75
                    ? 7.5625 * (t -= 1.5 / 2.75) * t + .75
                    : t < 2.5 / 2.75
                        ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375
                        : 7.5625 * (t -= 2.625 / 2.75) * t + .984375,
            t
        },
        C.Key.easeInBounce = function (t, e) {
            return C
                .Key
                .linear(C.Key.bounce(t), this, e)
        },
        C.Key.easeOutBounce = function (t, e) {
            return C
                .Key
                .linear(C.Key.bounce(t), this, e)
        },
        C.Key.easeInElastic = function (t, e) {
            var i = 1.70158,
                n = 0,
                r = 1;
            return 0 === t
                ? t = 0
                : 1 == (t /= 1)
                    ? t = 1
                    : (
                        n || (n = .3),
                        r < Math.abs(1)
                            ? (r = 1, i = n / 4)
                            : i = n / (2 * Math.PI) * Math.asin(1 / r),
                        t = -r * Math.pow(2, 10 * (t -= 1)) * Math.sin((1 * t - i) * (2 * Math.PI) / n) + 0
                    ),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeOutElastic = function (t, e) {
            var i = 1.70158,
                n = 0,
                r = 1;
            return 0 === t
                ? t = 0
                : 1 == (t /= 1)
                    ? t = 1
                    : (
                        n || (n = .3),
                        r < Math.abs(1)
                            ? (r = 1, i = n / 4)
                            : i = n / (2 * Math.PI) * Math.asin(1 / r),
                        t = r * Math.pow(2, -10 * t) * Math.sin((1 * t - i) * (2 * Math.PI) / n) + 1 + 0
                    ),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeInBack = function (t, e) {
            var i = 1.70158;
            return t = t * t * ((i + 1) * t - i),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeOutBack = function (t, e) {
            var i = 1.70158;
            return t = (t = t / 1 - 1) * t * ((i + 1) * t + i) + 1,
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeInOutBack = function (t, e) {
            var i = 1.70158;
            return t = (t /= .5) < 1
                ? t * t * ((1 + (i *= 1.525)) * t - i) * .5
                : .5 * ((t -= 2) * t * ((1 + (i *= 1.525)) * t + i) + 2),
            C
                .Key
                .linear(t, this, e)
        };
        const k = function (t) {
            return-- t * t * t + 1
        };
        C.Key.easeCubicOut = function (t, e) {
            return t = k(t),
            C
                .Key
                .linear(t, this, e)
        };
        const U = function (t) {
            return (t *= 2) < 1
                ? t *= .5 * t * t
                : t = .5 * ((t -= 2) * t * t + 2),
            t
        };
        C.Key.easeCubicInOut = function (t, e) {
            return t = U(t),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeSmoothStep = function (t, e) {
            var i = Math.max(0, Math.min(1, t));
            return t = i * i * (3 - 2 * i),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.easeSmootherStep = function (t, e) {
            var i = Math.max(0, Math.min(1, (t - 0) / 1));
            return t = i * i * i * (i * (6 * i - 15) + 10),
            C
                .Key
                .linear(t, this, e)
        },
        C.Key.prototype.setEasing = function (t) {
            this._easing = t,
            this._easing == P.ANIM.EASING_ABSOLUTE
                ? this.ease = C.Key.easeAbsolute
                : this._easing == P.ANIM.EASING_SMOOTHSTEP
                    ? this.ease = C.Key.easeSmoothStep
                    : this._easing == P.ANIM.EASING_SMOOTHERSTEP
                        ? this.ease = C.Key.easeSmootherStep
                        : this._easing == P.ANIM.EASING_CUBIC_IN
                            ? this.ease = C.Key.easeCubicIn
                            : this._easing == P.ANIM.EASING_CUBIC_OUT
                                ? this.ease = C.Key.easeCubicOut
                                : this._easing == P.ANIM.EASING_CUBIC_INOUT
                                    ? this.ease = C.Key.easeCubicInOut
                                    : this._easing == P.ANIM.EASING_EXPO_IN
                                        ? this.ease = C.Key.easeExpoIn
                                        : this._easing == P.ANIM.EASING_EXPO_OUT
                                            ? this.ease = C.Key.easeExpoOut
                                            : this._easing == P.ANIM.EASING_EXPO_INOUT
                                                ? this.ease = C.Key.easeExpoInOut
                                                : this._easing == P.ANIM.EASING_SIN_IN
                                                    ? this.ease = C.Key.easeSinIn
                                                    : this._easing == P.ANIM.EASING_SIN_OUT
                                                        ? this.ease = C.Key.easeSinOut
                                                        : this._easing == P.ANIM.EASING_SIN_INOUT
                                                            ? this.ease = C.Key.easeSinInOut
                                                            : this._easing == P.ANIM.EASING_BACK_OUT
                                                                ? this.ease = C.Key.easeOutBack
                                                                : this._easing == P.ANIM.EASING_BACK_IN
                                                                    ? this.ease = C.Key.easeInBack
                                                                    : this._easing == P.ANIM.EASING_BACK_INOUT
                                                                        ? this.ease = C.Key.easeInOutBack
                                                                        : this._easing == P.ANIM.EASING_ELASTIC_IN
                                                                            ? this.ease = C.Key.easeInElastic
                                                                            : this._easing == P.ANIM.EASING_ELASTIC_OUT
                                                                                ? this.ease = C.Key.easeOutElastic
                                                                                : this._easing == P.ANIM.EASING_BOUNCE_IN
                                                                                    ? this.ease = C.Key.easeInBounce
                                                                                    : this._easing == P.ANIM.EASING_BOUNCE_OUT
                                                                                        ? this.ease = C.Key.easeOutBounce
                                                                                        : this._easing == P.ANIM.EASING_QUART_OUT
                                                                                            ? this.ease = C.Key.easeOutQuart
                                                                                            : this._easing == P.ANIM.EASING_QUART_IN
                                                                                                ? this.ease = C.Key.easeInQuart
                                                                                                : this._easing == P.ANIM.EASING_QUART_INOUT
                                                                                                    ? this.ease = C.Key.easeInOutQuart
                                                                                                    : this._easing == P.ANIM.EASING_QUINT_OUT
                                                                                                        ? this.ease = C.Key.easeOutQuint
                                                                                                        : this._easing == P.ANIM.EASING_QUINT_IN
                                                                                                            ? this.ease = C.Key.easeInQuint
                                                                                                            : this._easing == P.ANIM.EASING_QUINT_INOUT
                                                                                                                ? this.ease = C.Key.easeInOutQuint
                                                                                                                : this._easing == P.ANIM.EASING_BEZIER
                                                                                                                    ? (this._updateBezier = !0, this.ease = C.Key.easeBezier)
                                                                                                                    : (this._easing = P.ANIM.EASING_LINEAR, this.ease = C.Key.easeLinear)
        },
        C.Key.prototype.trigger = function () {
            this.cb(),
            this.cbTriggered = !0
        },
        C.Key.prototype.setValue = function (t) {
            this.value = t,
            this._updateBezier = !0,
            null !== this.onChange && this.onChange()
        },
        C.Key.prototype.set = function (t) {
            t && (
                t.e && this.setEasing(t.e),
                t.cb && (this.cb = t.cb, this.cbTriggered = !1),
                t.b && (
                    this.bezTime = t.b[0],
                    this.bezValue = t.b[1],
                    this.bezTimeIn = t.b[2],
                    this.bezValueIn = t.b[3],
                    this._updateBezier = !0
                ),
                t.hasOwnProperty("t") && (this.time = t.t),
                t.hasOwnProperty("time") && (this.time = t.time),
                t.hasOwnProperty("v")
                    ? this.value = t.v
                    : t.hasOwnProperty("value") && (this.value = t.value)
            ),
            null !== this.onChange && this.onChange()
        },
        C.Key.prototype.getSerialized = function () {
            var t = {};
            return t.t = this.time,
            t.v = this.value,
            t.e = this._easing,
            this._easing == P.ANIM.EASING_BEZIER && (
                t.b = [this.bezTime, this.bezValue, this.bezTimeIn, this.bezValueIn]
            ),
            t
        },
        C.Key.prototype.getEasing = function () {
            return this._easing
        };
        const V = function (t) {
            this.keys = [],
            this.onChange = null,
            this.stayInTimeline = !1,
            this.loop = !1,
            this.defaultEasing = P.ANIM.EASING_LINEAR,
            this.onLooped = null,
            this._timesLooped = 0,
            this._needsSort = !1
        };
        V.prototype.forceChangeCallback = function () {
            null !== this.onChange && this.onChange()
        },
        V.prototype.hasEnded = function (t) {
            return 0 === this.keys.length || this
                .keys[this.keys.length - 1]
                .time <= t
        },
        V.prototype.isRising = function (t) {
            if (this.hasEnded(t)) 
                return !1;
            var e = this.getKeyIndex(t);
            return this
                .keys[e]
                .value < this
                .keys[e + 1]
                .value
        },
        V.prototype.clear = function (t) {
            var e = 0;
            t && (e = this.getValue(t)),
            this.keys.length = 0,
            t && this.setValue(t, e),
            null !== this.onChange && this.onChange()
        },
        V.prototype.sortKeys = function () {
            this
                .keys
                .sort((t, e) => parseFloat(t.time) - parseFloat(e.time)),
            this._needsSort = !1
        },
        V.prototype.getLength = function () {
            return 0 === this.keys.length
                ? 0
                : this
                    .keys[this.keys.length - 1]
                    .time
        },
        V.prototype.getKeyIndex = function (t) {
            for (var e = 0, i = 0; i < this.keys.length; i++) 
                if (t >= this.keys[i].time && (e = i), this.keys[i].time > t) 
                    return e;
        return e
        },
        V.prototype.setValue = function (t, e, i) {
            var n = !1;
            for (var r in this.keys) 
                if (this.keys[r].time == t) {
                    n = this.keys[r],
                    this
                        .keys[r]
                        .setValue(e),
                    this
                        .keys[r]
                        .cb = i;
                    break
                }
            n || this
                .keys
                .push(new C.Key({time: t, value: e, e: this.defaultEasing, cb: i})),
            this.onChange && this.onChange(),
            this._needsSort = !0
        },
        V.prototype.getSerialized = function () {
            var t = {
                keys: []
            };
            for (var e in t.loop = this.loop, this.keys) 
                t
                    .keys
                    .push(this.keys[e].getSerialized());
            return t
        },
        V.prototype.getKey = function (t) {
            var e = this.getKeyIndex(t);
            return this.keys[e]
        },
        V.prototype.getNextKey = function (t) {
            var e = this.getKeyIndex(t) + 1;
            return e >= this.keys.length && (e = this.keys.length - 1),
            this.keys[e]
        },
        V.prototype.isFinished = function (t) {
            return this.keys.length <= 0 || t > this
                .keys[this.keys.length - 1]
                .time
        },
        V.prototype.isStarted = function (t) {
            return !(this.keys.length <= 0) && t >= this
                .keys[0]
                .time
        },
        V.prototype.getValue = function (t) {
            if (0 === this.keys.length) 
                return 0;
            if (this._needsSort && this.sortKeys(), t < this.keys[0].time) 
                return this
                    .keys[0]
                    .value;
            var e = this.keys.length - 1;
            this.loop && t > this
                .keys[e]
                .time && (
                    t / this.keys[e].time > this._timesLooped && (this._timesLooped++, this.onLooped && this.onLooped()),
                    t = (t - this.keys[0].time) % (this.keys[e].time - this.keys[0].time),
                    t += this.keys[0].time
                );
            var i = this.getKeyIndex(t);
            if (i >= e) 
                return this
                    .keys[e]
                    .cb && !this
                    .keys[e]
                    .cbTriggered && this
                    .keys[e]
                    .trigger(),
                this
                    .keys[e]
                    .value;
            var n = parseInt(i, 10) + 1,
                r = this.keys[i],
                s = this.keys[n];
            if (r.cb && !r.cbTriggered && r.trigger(), !s) 
                return -1;
            var a = (t - r.time) / (s.time - r.time);
            return r.ease(a, s)
        },
        V.prototype.addKey = function (t) {
            void 0 === t.time
                ? console.log("key time undefined, ignoring!")
                : (this.keys.push(t), null !== this.onChange && this.onChange())
        },
        V.prototype.easingFromString = function (t) {
            return "linear" == t
                ? P.ANIM.EASING_LINEAR
                : "absolute" == t
                    ? P.ANIM.EASING_ABSOLUTE
                    : "smoothstep" == t
                        ? P.ANIM.EASING_SMOOTHSTEP
                        : "smootherstep" == t
                            ? P.ANIM.EASING_SMOOTHERSTEP
                            : "Cubic In" == t
                                ? P.ANIM.EASING_CUBIC_IN
                                : "Cubic Out" == t
                                    ? P.ANIM.EASING_CUBIC_OUT
                                    : "Cubic In Out" == t
                                        ? P.ANIM.EASING_CUBIC_INOUT
                                        : "Expo In" == t
                                            ? P.ANIM.EASING_EXPO_IN
                                            : "Expo Out" == t
                                                ? P.ANIM.EASING_EXPO_OUT
                                                : "Expo In Out" == t
                                                    ? P.ANIM.EASING_EXPO_INOUT
                                                    : "Sin In" == t
                                                        ? P.ANIM.EASING_SIN_IN
                                                        : "Sin Out" == t
                                                            ? P.ANIM.EASING_SIN_OUT
                                                            : "Sin In Out" == t
                                                                ? P.ANIM.EASING_SIN_INOUT
                                                                : "Back In" == t
                                                                    ? P.ANIM.EASING_BACK_IN
                                                                    : "Back Out" == t
                                                                        ? P.ANIM.EASING_BACK_OUT
                                                                        : "Back In Out" == t
                                                                            ? P.ANIM.EASING_BACK_INOUT
                                                                            : "Elastic In" == t
                                                                                ? P.ANIM.EASING_ELASTIC_IN
                                                                                : "Elastic Out" == t
                                                                                    ? P.ANIM.EASING_ELASTIC_OUT
                                                                                    : "Bounce In" == t
                                                                                        ? P.ANIM.EASING_BOUNCE_IN
                                                                                        : "Bounce Out" == t
                                                                                            ? P.ANIM.EASING_BOUNCE_OUT
                                                                                            : "Quart Out" == t
                                                                                                ? P.ANIM.EASING_QUART_OUT
                                                                                                : "Quart In" == t
                                                                                                    ? P.ANIM.EASING_QUART_IN
                                                                                                    : "Quart In Out" == t
                                                                                                        ? P.ANIM.EASING_QUART_INOUT
                                                                                                        : "Quint Out" == t
                                                                                                            ? P.ANIM.EASING_QUINT_OUT
                                                                                                            : "Quint In" == t
                                                                                                                ? P.ANIM.EASING_QUINT_IN
                                                                                                                : "Quint In Out" == t
                                                                                                                    ? P.ANIM.EASING_QUINT_INOUT
                                                                                                                    : void 0
        },
        V.prototype.createPort = function (t, e, i) {
            var n = t.addInPort(new N(t, e, P.OP.OP_PORT_TYPE_VALUE, {
                display: "dropdown",
                values: P.ANIM.EASINGS
            }));
            return n.set("linear"),
            n.defaultValue = "linear",
            n.onChange = function () {
                this.defaultEasing = this.easingFromString(n.get()),
                i && i()
            }.bind(this),
            n
        },
        V.slerpQuaternion = function (t, e, i, n, r, s) {
            V.slerpQuaternion.q1 || (
                V.slerpQuaternion.q1 = quat.create(),
                V.slerpQuaternion.q2 = quat.create()
            );
            var a = i.getKeyIndex(t),
                o = a + 1;
            if (o >= i.keys.length && (o = i.keys.length - 1), a == o) 
                quat.set(e, i.keys[a].value, n.keys[a].value, r.keys[a].value, s.keys[a].value);
            else {
                var l = i
                        .keys[a]
                        .time,
                    h = (t - l) / (i.keys[o].time - l);
                quat.set(
                    V.slerpQuaternion.q1,
                    i.keys[a].value,
                    n.keys[a].value,
                    r.keys[a].value,
                    s.keys[a].value
                ),
                quat.set(
                    V.slerpQuaternion.q2,
                    i.keys[o].value,
                    n.keys[o].value,
                    r.keys[o].value,
                    s.keys[o].value
                ),
                quat.slerp(e, V.slerpQuaternion.q1, V.slerpQuaternion.q2, h)
            }
            return e
        };
        const G = C;
        G.Anim = V;
        const z = function (t) {
            this.portIn = null,
            this.portOut = null,
            this.scene = t,
            this.activityCounter = 0
        };
        z.prototype.setValue = function (t) {
            void 0 === t
                ? this._setValue()
                : this
                    .portIn
                    .set(t)
        },
        z.prototype.activity = function () {
            this.activityCounter++
        },
        z.prototype._setValue = function () {
            if (this.portOut) {
                var t = this
                    .portOut
                    .get();
                t == t && (
                    this.portIn.type != P.OP.OP_PORT_TYPE_FUNCTION && this.activity(),
                    this.portIn.get() !== t
                        ? this.portIn.set(t)
                        : this.portIn.changeAlways && this.portIn.set(t)
                )
            } else 
                this.remove()
        },
        z.prototype.getOtherPort = function (t) {
            return t == this.portIn
                ? this.portOut
                : this.portIn
        },
        z.prototype.remove = function () {
            this.portIn && this
                .portIn
                .removeLink(this),
            this.portOut && this
                .portOut
                .removeLink(this),
            this.scene && this
                .scene
                .emitEvent("onUnLink", this.portIn, this.portOut),
            this.portIn && this.portIn.type == P.OP.OP_PORT_TYPE_OBJECT && (
                this.portIn.set(null),
                this.portIn.links.length > 0 && this.portIn.set(this.portIn.links[0].getOtherPort(this.portIn).get())
            ),
            this.portIn && this
                .portIn
                .parent
                ._checkLinksNeededToWork(),
            this.portOut && this
                .portOut
                .parent
                ._checkLinksNeededToWork(),
            this.portIn = null,
            this.portOut = null,
            this.scene = null
        },
        z.prototype.link = function (t, e) {
            if (!z.canLink(t, e)) 
                return console.log("cannot link ports!"),
                !1;
            t.direction == P.PORT.PORT_DIR_IN
                ? (this.portIn = t, this.portOut = e)
                : (this.portIn = e, this.portOut = t),
            t.addLink(this),
            e.addLink(this),
            this.setValue(),
            t.onLink && t.onLink(this),
            e.onLink && e.onLink(this),
            t
                .parent
                ._checkLinksNeededToWork(),
            e
                .parent
                ._checkLinksNeededToWork()
        },
        z.prototype.getSerialized = function () {
            var t = {};
            return t.portIn = this
                .portIn
                .getName(),
            t.portOut = this
                .portOut
                .getName(),
            t.objIn = this.portIn.parent.id,
            t.objOut = this.portOut.parent.id,
            t
        },
        z.canLinkText = function (t, e) {
            if (t.direction == e.direction) {
                var i = "(out)";
                return e.direction == P.PORT.PORT_DIR_IN && (i = "(in)"),
                "can not link: same direction " + i
            }
            return t.parent == e.parent
                ? "can not link: same op"
                : t.type != P.OP.OP_PORT_TYPE_DYNAMIC && e.type != P.OP.OP_PORT_TYPE_DYNAMIC && t.type != e.type
                    ? "can not link: different type"
                    : t
                        ? e
                            ? t.direction == P.PORT.PORT_DIR_IN && t.isAnimated()
                                ? "can not link: is animated"
                                : e.direction == P.PORT.PORT_DIR_IN && e.isAnimated()
                                    ? "can not link: is animated"
                                    : t.isLinkedTo(e)
                                        ? "ports already linked"
                                        : t.canLink && !t.canLink(e) || e.canLink && !e.canLink(t)
                                            ? "Incompatible"
                                            : "can link"
                            : "can not link: port 2 invalid"
                        : "can not link: port 1 invalid"
        },
        z.canLink = function (t, e) {
            return !(
                !t || !e || t.direction == P.PORT.PORT_DIR_IN && t.isAnimated() || e.direction == P.PORT.PORT_DIR_IN && e.isAnimated() || t.isHidden() || e.isHidden() || t.isLinkedTo(e) || t.direction == e.direction || t.type != e.type && t.type != P.OP.OP_PORT_TYPE_DYNAMIC && e.type != P.OP.OP_PORT_TYPE_DYNAMIC || t.type != P.OP.OP_PORT_TYPE_DYNAMIC && e.type != P.OP.OP_PORT_TYPE_DYNAMIC && (t.parent == e.parent || t.canLink && !t.canLink(e) || e.canLink && !e.canLink(t))
            )
        };
        const Y = function () {
            if (
                this.data = {},
                this.objName = "",
                this.portsOut = [],
                this.portsIn = [],
                this.portsInData = [],
                this.opId = "",
                this.uiAttribs = {},
                this.enabled = !0,
                this.patch = arguments[0],
                this.name = arguments[1],
                this.errors = {},
                this._needsLinkedToWork = [],
                this._needsParentOp = null,
                this._shortOpName = "",
                arguments[1]
            ) {
                if (this._shortOpName = arguments[1].split(".")[
                    arguments[1]
                        .split(".")
                        .length - 1
                ], this._shortOpName.indexOf(P.OP.OP_VERSION_PREFIX) > 0) {
                    var t = this
                        ._shortOpName
                        .split(P.OP.OP_VERSION_PREFIX)[1];
                    this._shortOpName = this
                        ._shortOpName
                        .substring(0, this._shortOpName.length - (P.OP.OP_VERSION_PREFIX + t).length)
                }
                this.uiAttribs.title = this._shortOpName
            }
            this.id = arguments[2] || v(),
            this.onAddPort = null,
            this.onCreate = null,
            this.onResize = null,
            this.onLoaded = null,
            this.onDelete = null,
            this.onUiAttrChange = null,
            this._eventCallbacks = {},
            this._instances = null,
            this.preRender = null,
            this.init = null
        };
        {
            Y.prototype.clearUiAttrib = function (t) {
                this.uiAttrib({name: null})
            },
            Y.prototype.setTitle = function (t) {
                var e = this.name != t;
                this.name = t,
                this.uiAttr({title: t}),
                e && this.fireEvent("onTitleChange", t)
            };
            const t = function (t) {
                for (var e in this.uiAttribs || (this.uiAttribs = {}), t) 
                    this.uiAttribs[e] = t[e];
                this.fireEvent("onUiAttribsChange", t)
            };
            Y.prototype.setUiAttrib = t,
            Y.prototype.uiAttr = t,
            Y.prototype.getName = function () {
                return this.uiAttribs.name
                    ? this.uiAttribs.name
                    : this
                        .objName
                        .split(".")
            },
            Y.prototype.addOutPort = function (t) {
                return t.direction = P.PORT.PORT_DIR_OUT,
                t.parent = this,
                this
                    .portsOut
                    .push(t),
                this.onAddPort && this.onAddPort(t),
                t
            },
            Y.prototype.hasPort = function (t) {
                for (var e = 0; e < this.portsIn.length; e++) 
                    if (this.portsIn[i].getName() == t) 
                        return !0;
            return !1
            },
            Y.prototype.hasDynamicPort = function () {
                var t = 0;
                for (t = 0; t < this.portsIn.length; t++) {
                    if (this.portsIn[t].type == P.OP.OP_PORT_TYPE_DYNAMIC) 
                        return !0;
                    if ("dyn" == this.portsIn[t].getName()) 
                        return !0
                }
                for (t = 0; t < this.portsOut.length; t++) {
                    if (this.portsOut[t].type == P.OP.OP_PORT_TYPE_DYNAMIC) 
                        return !0;
                    if ("dyn" == this.portsOut[t].getName()) 
                        return !0
                }
                return !1
            },
            Y.prototype.addInPort = function (t) {
                if (!(t instanceof N)) 
                    throw new Error("parameter is not a port!");
                return t.direction = P.PORT.PORT_DIR_IN,
                t.parent = this,
                this
                    .portsIn
                    .push(t),
                this.onAddPort && this.onAddPort(t),
                t
            },
            Y.prototype.inFunction = Y.prototype.inTrigger = function (t, e) {
                var i = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_FUNCTION));
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.inFunctionButton = Y.prototype.inTriggerButton = function (t, e) {
                var i = this.addInPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_FUNCTION, {display: "button"})
                );
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.inValueFloat = Y.prototype.inValue = Y.prototype.inFloat = function (
                t,
                e
            ) {
                var i = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE));
                return void 0 !== e && (i.set(e), i.defaultValue = e),
                i
            },
            Y.prototype.inValueBool = Y.prototype.inBool = function (t, e) {
                var i = this.addInPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {display: "bool"})
                );
                return void 0 !== e && (i.set(e), i.defaultValue = e),
                i
            },
            Y.prototype.inValueString = function (t, e) {
                var i = this.addInPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {type: "string"})
                );
                return i.value = "",
                void 0 !== e && (i.set(e), i.defaultValue = e),
                i
            },
            Y.prototype.inString = function (t, e) {
                var i = this.addInPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_STRING, {type: "string"})
                );
                return e = e || "",
                i.value = e,
                i.set(e),
                i.defaultValue = e,
                i
            },
            Y.prototype.inValueText = function (t, e) {
                var i = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {
                    type: "string",
                    display: "text"
                }));
                return i.value = "",
                void 0 !== e && (i.set(e), i.defaultValue = e),
                i
            },
            Y.prototype.inStringEditor = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_STRING, {
                    type: "string",
                    display: "editor",
                    editorSyntax: i
                }));
                return n.value = "",
                void 0 !== e && (n.set(e), n.defaultValue = e),
                n
            },
            Y.prototype.inValueEditor = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {
                    type: "string",
                    display: "editor",
                    editorSyntax: i
                }));
                return n.value = "",
                void 0 !== e && (n.set(e), n.defaultValue = e),
                n
            },
            Y.prototype.inValueSelect = Y.prototype.inDropDown = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {
                    display: "dropdown",
                    hidePort: !0,
                    values: e
                }));
                return void 0 !== i && (n.set(i), n.defaultValue = i),
                n
            },
            Y.prototype.inSwitch = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_STRING, {
                    display: "switch",
                    hidePort: !0,
                    type: "string",
                    values: e
                }));
                return void 0 !== i && (n.set(i), n.defaultValue = i),
                n
            },
            Y.prototype.inValueInt = Y.prototype.inInt = function (t, e) {
                var i = this.addInPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {increment: "integer"})
                );
                return void 0 !== e && (i.set(e), i.defaultValue = e),
                i
            },
            Y.prototype.inFile = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {
                    display: "file",
                    filter: e
                }));
                return void 0 !== i && (n.set(i), n.defaultValue = i),
                n
            },
            Y.prototype.inUrl = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_STRING, {
                    display: "file",
                    filter: e
                }));
                return void 0 !== i && (n.set(i), n.defaultValue = i),
                n
            },
            Y.prototype.inTexture = function (t, e) {
                var i = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_OBJECT, {
                    display: "texture",
                    preview: !0
                }));
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.inObject = function (t, e, i) {
                var n = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_OBJECT, i));
                return void 0 !== e && n.set(e),
                n
            },
            Y.prototype.inGradient = function (t, e) {
                var i = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {
                    display: "gradient",
                    hidePort: !0
                }));
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.inArray = function (t, e) {
                var i = this.addInPort(new N(this, t, P.OP.OP_PORT_TYPE_ARRAY));
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.inValueSlider = Y.prototype.inFloatSlider = function (t, e) {
                var i = this.addInPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {display: "range"})
                );
                return void 0 !== e && (i.set(e), i.defaultValue = e),
                i
            },
            Y.prototype.outFunction = Y.prototype.outTrigger = function (t, e) {
                var i = this.addOutPort(new N(this, t, P.OP.OP_PORT_TYPE_FUNCTION));
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.outValue = Y.prototype.outNumber = function (t, e) {
                var i = this.addOutPort(new N(this, t, P.OP.OP_PORT_TYPE_VALUE));
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.outValueBool = Y.prototype.outBool = function (t, e) {
                var i = this.addOutPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {display: "bool"})
                );
                return void 0 !== e
                    ? i.set(e)
                    : i.set(!1),
                i
            },
            Y.prototype.outValueString = function (t, e) {
                var i = this.addOutPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_VALUE, {type: "string"})
                );
                return void 0 !== e && i.set(e),
                i
            },
            Y.prototype.outString = function (t, e) {
                var i = this.addOutPort(
                    new N(this, t, P.OP.OP_PORT_TYPE_STRING, {type: "string"})
                );
                return void 0 !== e
                    ? i.set(e)
                    : i.set(""),
                i
            },
            Y.prototype.outObject = function (t, e) {
                var i = this.addOutPort(new N(this, t, P.OP.OP_PORT_TYPE_OBJECT));
                return void 0 !== e && i.set(e),
                i.ignoreValueSerialize = !0,
                i
            },
            Y.prototype.outArray = function (t, e) {
                var i = this.addOutPort(new N(this, t, P.OP.OP_PORT_TYPE_ARRAY));
                return void 0 !== e && i.set(e),
                i.ignoreValueSerialize = !0,
                i
            },
            Y.prototype.outTexture = function (t, e) {
                var i = this.addOutPort(new N(this, t, P.OP.OP_PORT_TYPE_OBJECT, {
                    preview: !0
                }));
                return void 0 !== e && i.set(e),
                i.ignoreValueSerialize = !0,
                i
            },
            Y.prototype.inDynamic = function (t, e, i, n) {
                var r = new N(this, t, P.OP.OP_PORT_TYPE_DYNAMIC, i);
                return r.shouldLink = function (t, i) {
                    if (e && g.isArray(e)) {
                        for (var n = 0; n < e.length; n++) {
                            if (t == this && i.type === e[n]) 
                                return !0;
                            if (i == this && t.type === e[n]) 
                                return !0
                        }
                        return !1
                    }
                    return !0
                },
                this.addInPort(r),
                void 0 !== n && (r.set(n), r.defaultValue = n),
                r
            },
            Y.prototype.printInfo = function () {
                for (var t = 0; t < this.portsIn.length; t++) 
                    console.log("in: " + this.portsIn[t].getName());
                for (var e in this.portsOut) 
                    console.log("out: " + this.portsOut[e].getName())
            },
            Y.prototype.getOutChilds = function () {
                var t = [];
                for (var e in this.portsOut) 
                    for (var i in this.portsOut[e].links) 
                        this
                            .portsOut[e]
                            .type == P.OP.OP_PORT_TYPE_FUNCTION && t.push(
                                this.portsOut[e].links[i].portIn.parent
                            );
                return t
            },
            Y.prototype.markChilds = function () {
                for (var t in this.marked = !0, this.portsOut) 
                    for (var e in this.portsOut[t].links) 
                        this
                            .portsOut[t]
                            .parent
                            .marked = !0,
                        this
                            .portsOut[t]
                            .links[e]
                            .portIn
                            .parent != this && this
                            .portsOut[t]
                            .links[e]
                            .portIn
                            .parent
                            .markChilds()
                },
            Y.prototype.deleteChilds = function () {
                var t = [];
                for (var e in this.portsOut) 
                    for (var i in this.portsOut[e].links) 
                        this
                            .portsOut[e]
                            .links[i]
                            .portIn
                            .parent != this && (
                                this.portsOut[e].parent != this && t.push(this.portsOut[e].parent),
                                t.push(this.portsOut[e].links[i].portIn.parent),
                                this.portsOut[e].links[i].portIn.parent.deleteChilds()
                            );
                for (var n in t) 
                    this
                        .patch
                        .deleteOp(t[n].id)
                },
            Y.prototype.removeLinks = function () {
                for (var t = 0; t < this.portsIn.length; t++) 
                    this
                        .portsIn[t]
                        .removeLinks();
                for (var e = 0; e < this.portsOut.length; e++) 
                    this
                        .portsOut[e]
                        .removeLinks()
                },
            Y.prototype.countFittingPorts = function (t) {
                var e = 0;
                for (var i in this.portsOut) 
                    z.canLink(t, this.portsOut[i]) && e++;
                for (var n in this.portsIn) 
                    z.canLink(t, this.portsIn[n]) && e++;
                return e
            },
            Y.prototype.findFittingPort = function (t) {
                for (var e in this.portsOut) 
                    if (z.canLink(t, this.portsOut[e])) 
                        return this.portsOut[e];
            for (var i in this.portsIn) 
                    if (z.canLink(t, this.portsIn[i])) 
                        return this.portsIn[i]
            },
            Y.prototype.getSerialized = function () {
                var t = {};
                this.opId && (t.opId = this.opId),
                t.objName = this.objName,
                t.id = this.id,
                t.uiAttribs = this.uiAttribs,
                this.uiAttribs.title == this._shortOpName && delete this.uiAttribs.title,
                this
                    .uiAttribs
                    .hasOwnProperty("working") && 1 == this.uiAttribs.working && delete this.uiAttribs.working,
                t.portsIn = [],
                t.portsOut = [];
                for (var e = 0; e < this.portsIn.length; e++) 
                    t
                        .portsIn
                        .push(this.portsIn[e].getSerialized());
                for (var i in this.portsOut) 
                    t
                        .portsOut
                        .push(this.portsOut[i].getSerialized());
                return t
            },
            Y.prototype.getFirstOutPortByType = function (t) {
                for (var e in this.portsOut) 
                    if (this.portsOut[e].type == t) 
                        return this.portsOut[e]
            },
            Y.prototype.getPort = Y.prototype.getPortByName = function (t) {
                for (var e = 0; e < this.portsIn.length; e++) 
                    if (this.portsIn[e].getName() == t) 
                        return this.portsIn[e];
            for (var i = 0; i < this.portsOut.length; i++) 
                    if (this.portsOut[i].getName() == t) 
                        return this.portsOut[i]
            },
            Y.prototype.getPortById = function (t) {
                for (var e = 0; e < this.portsIn.length; e++) 
                    if (this.portsIn[e].id == t) 
                        return this.portsIn[e];
            for (var i = 0; i < this.portsOut.length; i++) 
                    if (this.portsOut[i].id == t) 
                        return this.portsOut[i]
            },
            Y.prototype.updateAnims = function () {
                for (var t = 0; t < this.portsIn.length; t++) 
                    this
                        .portsIn[t]
                        .updateAnim()
                },
            Y.prototype.log = function () {
                this.patch.silent || Function
                    .prototype
                    .apply
                    .apply(console.log, [console, arguments])
            },
            Y.prototype.error = function () {
                this.patch.silent || Function
                    .prototype
                    .apply
                    .apply(console.error, [console, arguments])
            },
            Y.prototype.warn = function () {
                this.patch.silent || Function
                    .prototype
                    .apply
                    .apply(console.warn, [console, arguments])
            },
            Y.prototype.undoUnLinkTemporary = function () {
                if (
                    this.shakeLink && this.shakeLink.remove(),
                    this.shakeLink = null,
                    this.oldLinks
                ) {
                    for (var t = 0; t < this.oldLinks.length; t++) 
                        this
                            .patch
                            .link(
                                this.oldLinks[t]. in.parent,
                                this.oldLinks[t]. in.getName(),
                                this.oldLinks[t].out.parent,
                                this.oldLinks[t].out.getName()
                            );
                    this.oldLinks.length = 0
                }
            },
            Y.prototype.unLink = function () {
                for (var t = 0; t < this.portsOut.length; t++) 
                    this
                        .portsOut[t]
                        .removeLinks();
                for (var e = 0; e < this.portsIn.length; e++) 
                    this
                        .portsIn[e]
                        .removeLinks()
                },
            Y.unLinkTempReLinkP1 = null,
            Y.unLinkTempReLinkP2 = null,
            Y.prototype.unLinkTemporary = function () {
                var t = 0;
                this.shakeLink = null,
                this.oldLinks = [],
                this.portsIn.length > 0 && this
                    .portsIn[0]
                    .isLinked() && this
                    .portsOut
                    .length > 0 && this
                    .portsOut[0]
                    .isLinked() && this
                    .portsIn[0]
                    .getType() == this
                    .portsOut[0]
                    .getType() && (
                        Y.unLinkTempReLinkP1 = this.portsIn[0].links[0].getOtherPort(this.portsIn[0]),
                        Y.unLinkTempReLinkP2 = this.portsOut[0].links[0].getOtherPort(this.portsOut[0])
                    );
                for (var e = 0; e < this.portsIn.length; e++) 
                    for (t = 0; t < this.portsIn[e].links.length; t++) 
                        this
                            .oldLinks
                            .push({
                                in: this
                                    .portsIn[e]
                                    .links[t]
                                    .portIn,
                                out: this
                                    .portsIn[e]
                                    .links[t]
                                    .portOut
                            });
                for (var i = 0; i < this.portsOut.length; i++) 
                    for (t = 0; t < this.portsOut[i].links.length; t++) 
                        this
                            .oldLinks
                            .push({
                                in: this
                                    .portsOut[i]
                                    .links[t]
                                    .portIn,
                                out: this
                                    .portsOut[i]
                                    .links[t]
                                    .portOut
                            });
                this.unLink(),
                Y.unLinkTempReLinkP1 && Y.unLinkTempReLinkP2 && (
                    this.shakeLink = this.patch.link(
                        Y.unLinkTempReLinkP1.parent,
                        Y.unLinkTempReLinkP1.getName(),
                        Y.unLinkTempReLinkP2.parent,
                        Y.unLinkTempReLinkP2.getName()
                    )
                )
            },
            Y.prototype.profile = function (t) {
                for (var e = 0; e < this.portsIn.length; e++) 
                    this
                        .portsIn[e]
                        ._onTriggered = this
                        .portsIn[e]
                        ._onTriggeredProfiling
                },
            Y.prototype.findParent = function (t) {
                for (var e = 0; e < this.portsIn.length; e++) 
                    if (this.portsIn[e].isLinked()) {
                        if (this.portsIn[e].links[0].portOut.parent.objName == t) 
                            return this
                                .portsIn[e]
                                .links[0]
                                .portOut
                                .parent;
                        var i;
                        if (i = this.portsIn[e].links[0].portOut.parent.findParent(t)) 
                            return i
                    }
                return null
            },
            Y.prototype.cleanUp = function () {
                if (this._instances) {
                    for (var t = 0; t < this._instances.length; t++) 
                        this
                            ._instances[t]
                            .onDelete && this
                            ._instances[t]
                            .onDelete();
                    this._instances.length = 0
                }
            },
            Y.prototype.instanced = function (t) {
                if (0 === this.patch.instancing.numCycles()) 
                    return !1;
                var e = 0,
                    i = 0;
                if (!this._instances || this._instances.length != this.patch.instancing.numCycles()) {
                    for (
                        this._instances || (this._instances = []),
                        console.log(
                            "creating instances of ",
                            this.objName,
                            this.patch.instancing.numCycles(),
                            this._instances.length
                        ),
                        this._instances.length = this.patch.instancing.numCycles(),
                        e = 0; e < this._instances.length; e++
                    ) {
                        this._instances[e] = this
                            .patch
                            .createOp(this.objName, !0),
                        this
                            ._instances[e]
                            .instanced = function () {
                                return !1
                            },
                        this
                            ._instances[e]
                            .uiAttr(this.uiAttribs);
                        for (var n = 0; n < this.portsOut.length; n++) 
                            this
                                .portsOut[n]
                                .type == P.OP.OP_PORT_TYPE_FUNCTION && (
                                    this._instances[e].getPortByName(this.portsOut[n].name).trigger = this.portsOut[n].trigger.bind(this.portsOut[n])
                                )
                        }
                    for (i = 0; i < this.portsIn.length; i++) 
                        this
                            .portsIn[i]
                            .onChange = null,
                        this
                            .portsIn[i]
                            .onValueChanged = null
                    }
                for (i = 0; i < this.portsIn.length; i++) 
                    this
                        .portsIn[i]
                        .type != P
                        .OP
                        .OP_PORT_TYPE_VALUE && this
                        .portsIn[i]
                        .type != P
                        .OP
                        .OP_PORT_TYPE_ARRAY || this
                        ._instances[
                            this
                                .patch
                                .instancing
                                .index()
                        ]
                        .portsIn[i]
                        .set(this.portsIn[i].get()),
                    this
                        .portsIn[i]
                        .type,
                    P.OP.OP_PORT_TYPE_FUNCTION;
                for (i = 0; i < this.portsOut.length; i++) 
                    this
                        .portsOut[i]
                        .type == P
                        .OP
                        .OP_PORT_TYPE_VALUE && this
                        .portsOut[i]
                        .set(this._instances[
                            this
                                .patch
                                .instancing
                                .index()
                        ].portsOut[i].get());
                return !0
            },
            Y.prototype.initInstancable = function () {},
            Y.prototype.setValues = function (t) {
                for (var e in t) {
                    var i = this.getPortByName(e);
                    i
                        ? i.set(t[e])
                        : console.log("op.setValues: port not found:", e)
                }
            },
            Y.prototype.error = function (t, e) {
                this.errors[t] = e,
                null == e && delete this.errors[t];
                var i = "";
                for (var n in this.errors) 
                    i += "- " + this.errors[n] + "<br/>";
                this.uiAttr({error: i})
            },
            Y.prototype.addListener = Y.prototype.addEventListener = function (t, e) {
                this._eventCallbacks[t]
                    ? this
                        ._eventCallbacks[t]
                        .push(e)
                    : this._eventCallbacks[t] = [e]
            },
            Y.prototype.hasEventListener = function (t, e) {
                if (t && e) {
                    if (this._eventCallbacks[t]) 
                        return -1 != this
                            ._eventCallbacks[t]
                            .indexOf(e)
                    } else 
                    console.log("hasListener: missing parameters")
            },
            Y.prototype.removeEventListener = function (t, e) {
                if (this._eventCallbacks[t]) {
                    var i = this
                        ._eventCallbacks[t]
                        .indexOf(e);
                    -1 == i
                        ? console.log("eventlistener " + t + " not found...")
                        : this
                            ._eventCallbacks[t]
                            .slice(i)
                }
            },
            Y.prototype.fireEvent = function (t, e) {
                if (this._eventCallbacks[t]) 
                    for (var i = 0; i < this._eventCallbacks[t].length; i++) 
                        this._eventCallbacks[t][i] && this._eventCallbacks[t][i](e);
            this.onUiAttrChange && "onUiAttribsChange" == t && this.onUiAttrChange(e)
            },
            Y.prototype.setEnabled = function (t) {
                this.enabled = t,
                this.fireEvent("onEnabledChange", t)
            },
            Y.prototype.setPortGroup = function (t, e) {
                for (var i = 0; i < e.length; i++) 
                    e[i] && e[i].setUiAttribs
                        ? e[i].setUiAttribs({group: t})
                        : console.error("setPortGroup: invalid port!")
                },
            Y.prototype.setUiAxisPorts = function (t, e, i) {
                t && t.setUiAttribs({axis: "X"}),
                e && e.setUiAttribs({axis: "Y"}),
                i && i.setUiAttribs({axis: "Z"})
            },
            Y.prototype.removePort = function (t) {
                for (var e = 0; e < this.portsIn.length; e++) 
                    if (this.portsIn[e] == t) 
                        return this
                            .portsIn
                            .splice(e, 1),
                        this.fireEvent("onUiAttribsChange", {}),
                        void this.fireEvent("onPortRemoved", {})
            },
            Y.prototype.checkLinkTimeWarnings = function () {
                function t(e, i, n) {
                    for (var r = 0; r < e.portsIn.length; r++) 
                        if (e.portsIn[r].type == i && e.portsIn[r].isLinked()) 
                            for (var s = e.portsIn[r], a = 0; a < s.links.length; a++) 
                                if (s.links[a]) {
                                    if (s.links[a].portOut.parent.objName.indexOf(n) > -1) 
                                        return !0;
                                    if (t(s.links[a].portOut.parent, i, n)) 
                                        return !0
                                }
                            return !1
                }
                var e,
                    i = null,
                    n = !0;
                if (
                    n && 0 == this.objName.indexOf("Ops.Gl.TextureEffects") && (e = this).portsIn.length > 0 && e.portsIn[0].type == P.OP.OP_PORT_TYPE_FUNCTION && -1 == this.objName.indexOf("TextureEffects.ImageCompose") && ((n = t(this, P.OP.OP_PORT_TYPE_FUNCTION, "TextureEffects.ImageCompose")) || (i = CABLES.UI.TEXTS.working_connected_to + "ImageCompose")),
                    this._needsParentOp && n && ((n = t(this, P.OP.OP_PORT_TYPE_OBJECT, this._needsParentOp)) || (i = CABLES.UI.TEXTS.working_connected_to + this._needsParentOp)),
                    this._needsLinkedToWork.length > 0
                ) 
                    for (var r = 0; r < this._needsLinkedToWork.length; r++) {
                        var s = this._needsLinkedToWork[r];
                        s
                            ? s.isLinked() || (
                                n = !1,
                                i
                                    ? i += ", "
                                    : i = CABLES.UI.TEXTS.working_connected_needs_connections_to,
                                i += s.name.toUpperCase()
                            )
                            : console.warn("[needsLinkedToWork] port not found")
                    }
                n
                    ? this.uiAttribs.working || this.setUiAttrib({
                        working: !0,
                        notWorkingMsg: null
                    })
                    : this.setUiAttrib({working: n, notWorkingMsg: i})
            },
            Y.prototype._checkLinksNeededToWork = function () {},
            Y.prototype.toWorkNeedsParent = function (t) {
                this
                    .patch
                    .isEditorMode() && (this._needsParentOp = t)
            },
            Y.prototype.toWorkPortsNeedToBeLinked = function () {
                if (this.patch.isEditorMode()) 
                    for (var t = 0; t < arguments.length; t++) 
                        -1 == this
                            ._needsLinkedToWork
                            .indexOf(arguments[t]) && this
                            ._needsLinkedToWork
                            .push(arguments[t])
                },
            Y.prototype.toWorkPortsNeedToBeLinkedReset = function () {
                this
                    .patch
                    .isEditorMode() && (
                        this._needsLinkedToWork.length = 0,
                        this.checkLinkTimeWarnings()
                    )
            },
            Y.prototype.refreshParams = function () {
                CABLES.UI && gui && gui
                    .patch()
                    .refreshOpParams(this)
            }
        }
        Y.getNamespaceClassName = function (t) {
            return t
                ? t.startsWith("Ops.Gl")
                    ? "gl"
                    : t.startsWith("Ops.WebAudio")
                        ? "audio"
                        : t.startsWith("Ops.Devices")
                            ? "devices"
                            : t.startsWith("Ops.Html")
                                ? "html"
                                : t.startsWith("Ops.Sidebar")
                                    ? "html"
                                    : t.startsWith("Ops.Math")
                                        ? "math"
                                        : t.startsWith("Ops.User")
                                            ? "user"
                                            : "default"
                : "default"
        },
        Y.isSubpatchOp = function (t) {
            return "Ops.Ui.Patch" == t || "Ops.Ui.SubPatch" == t
        };
        const H = new function () {
            this.profileUniformCount = 0,
            this.profileShaderBinds = 0,
            this.profileUniformCount = 0,
            this.profileShaderCompiles = 0,
            this.profileVideosPlaying = 0,
            this.profileMVPMatrixCount = 0,
            this.profileEffectBuffercreate = 0
        };
        var j = null,
            W = null,
            X = null,
            K = null;
        const q = function (t, e) {
            if (!t) 
                throw "no cgl";
            this._cgl = t,
            this.tex = this
                ._cgl
                .gl
                .createTexture(),
            this.id = v(),
            this.width = 0,
            this.height = 0,
            this.flip = !0,
            this.shadowMap = !1,
            this.filter = q.FILTER_NEAREST,
            this.wrap = q.WRAP_CLAMP_TO_EDGE,
            this.texTarget = this._cgl.gl.TEXTURE_2D,
            e && e.type && (this.texTarget = e.type),
            this.textureType = q.TYPE_DEFAULT,
            this.unpackAlpha = !0,
            this._fromData = !0,
            this.name = "unknown",
            e
                ? (
                    this.name = e.name || this.name,
                    e.isDepthTexture && (this.textureType = q.TYPE_DEPTH),
                    e.isFloatingPointTexture && (this.textureType = q.TYPE_FLOAT),
                    "textureType" in e && (this.textureType = e.textureType),
                    "filter" in e && (this.filter = e.filter),
                    "wrap" in e && (this.wrap = e.wrap),
                    "unpackAlpha" in e && (this.unpackAlpha = e.unpackAlpha),
                    "flip" in e && (this.flip = e.flip),
                    "shadowMap" in e && (this.shadowMap = e.shadowMap)
                )
                : e = {
                    width: 8,
                    height: 8
                },
            this.setSize(e.width, e.height)
        };
        q.prototype.compareSettings = function (t) {
            return !!t && t.width == this.width && t.height == this.height && t.filter == this.filter && t.wrap == this.wrap && t.textureType == this.textureType && t.unpackAlpha == this.unpackAlpha && t.flip == this.flip
        },
        q.prototype.clone = function () {
            var t = new q(this._cgl, {
                name: this.name,
                filter: this.filter,
                wrap: this.wrap,
                textureType: this.textureType,
                unpackAlpha: this.unpackAlpha,
                flip: this.flip,
                width: this.width,
                height: this.height
            });
            return this.compareSettings(t) || (
                console.error("Cloned texture settings do not compare!"),
                console.log(this),
                console.log(t)
            ),
            t
        },
        q.prototype.setSize = function (t, e) {
            if (
                (t != t || t <= 0 || !t) && (t = 8),
                (e != e || e <= 0 || !e) && (e = 8),
                t = Math.floor(t),
                e = Math.floor(e),
                this.width != t || this.height != e
            ) {
                if (
                    this.width = t,
                    this.height = e,
                    this._cgl.gl.bindTexture(this.texTarget, this.tex),
                    H.profileTextureResize++,
                    this.textureType == q.TYPE_FLOAT && (this.filter = q.FILTER_NEAREST),
                    this._setFilter(),
                    this.textureType == q.TYPE_FLOAT
                ) 
                    if (1 == this._cgl.glVersion) 
                        if (this._cgl.glUseHalfFloatTex) {
                            var i = this
                                ._cgl
                                .gl
                                .getExtension("OES_texture_half_float");
                            if (1 == this._cgl.glVersion && !i) 
                                throw "no half float texture extension";
                            this
                                ._cgl
                                .gl
                                .texImage2D(
                                    this.texTarget,
                                    0,
                                    this._cgl.gl.RGBA,
                                    t,
                                    e,
                                    0,
                                    this._cgl.gl.RGBA,
                                    i.HALF_FLOAT_OES,
                                    null
                                )
                        }
                    else 
                    i = this
                        ._cgl
                        .gl
                        .getExtension("OES_texture_float"),
                    this
                        ._cgl
                        .gl
                        .texImage2D(
                            this.texTarget,
                            0,
                            this._cgl.gl.RGBA,
                            t,
                            e,
                            0,
                            this._cgl.gl.RGBA,
                            this._cgl.gl.FLOAT,
                            null
                        );
                else 
                    this
                        ._cgl
                        .gl
                        .texImage2D(
                            this.texTarget,
                            0,
                            this._cgl.gl.RGBA32F,
                            t,
                            e,
                            0,
                            this._cgl.gl.RGBA,
                            this._cgl.gl.FLOAT,
                            null
                        );
                else if (this.textureType == q.TYPE_DEPTH) 
                    if (1 == this._cgl.glVersion) {
                        var n = this._cgl.gl.DEPTH_COMPONENT;
                        this
                            ._cgl
                            .gl
                            .texImage2D(
                                this.texTarget,
                                0,
                                n,
                                t,
                                e,
                                0,
                                this._cgl.gl.DEPTH_COMPONENT,
                                this._cgl.gl.UNSIGNED_SHORT,
                                null
                            )
                    } else 
                        n = this._cgl.gl.DEPTH_COMPONENT32F,
                        this
                            ._cgl
                            .gl
                            .texImage2D(
                                this.texTarget,
                                0,
                                n,
                                t,
                                e,
                                0,
                                this._cgl.gl.DEPTH_COMPONENT,
                                this._cgl.gl.FLOAT,
                                null
                            );
                else 
                    this
                        ._cgl
                        .gl
                        .texImage2D(
                            this.texTarget,
                            0,
                            this._cgl.gl.RGBA,
                            t,
                            e,
                            0,
                            this._cgl.gl.RGBA,
                            this._cgl.gl.UNSIGNED_BYTE,
                            null
                        );
                this.updateMipMap(),
                this
                    ._cgl
                    .gl
                    .bindTexture(this.texTarget, null)
            }
        },
        q.prototype.initFromData = function (t, e, i, n, r) {
            this.filter = n,
            this.wrap = r,
            null == n && (this.filter = q.FILTER_LINEAR),
            null == r && (this.wrap = q.CLAMP_TO_EDGE),
            this.width = e,
            this.height = i,
            this._fromData = !0,
            this
                ._cgl
                .gl
                .bindTexture(this.texTarget, this.tex),
            this
                ._cgl
                .gl
                .texImage2D(
                    this.texTarget,
                    0,
                    this._cgl.gl.RGBA,
                    e,
                    i,
                    0,
                    this._cgl.gl.RGBA,
                    this._cgl.gl.UNSIGNED_BYTE,
                    t
                ),
            this._setFilter(),
            this.updateMipMap(),
            this
                ._cgl
                .gl
                .bindTexture(this.texTarget, null)
        },
        q.prototype.updateMipMap = function () {
            2 != this._cgl.glVersion && !this.isPowerOfTwo() || this.filter != q.FILTER_MIPMAP || this
                ._cgl
                .gl
                .generateMipmap(this.texTarget)
        },
        q.prototype.initTexture = function (t, e) {
            this._fromData = !1,
            this
                ._cgl
                .gl
                .pixelStorei(this._cgl.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.unpackAlpha),
            t.width && (this.width = t.width),
            t.height && (this.height = t.height),
            e && (this.filter = e),
            this
                ._cgl
                .gl
                .bindTexture(this.texTarget, this.tex),
            this
                ._cgl
                .gl
                .pixelStorei(this._cgl.gl.UNPACK_FLIP_Y_WEBGL, !this.flip),
            this
                ._cgl
                .gl
                .texImage2D(
                    this.texTarget,
                    0,
                    this._cgl.gl.RGBA,
                    this._cgl.gl.RGBA,
                    this._cgl.gl.UNSIGNED_BYTE,
                    t
                ),
            this._setFilter(),
            this.updateMipMap(),
            this
                ._cgl
                .gl
                .bindTexture(this.texTarget, null),
            this
                ._cgl
                .gl
                .pixelStorei(this._cgl.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1)
        },
        q.prototype.delete = function () {
            H.profileTextureDelete++,
            this
                ._cgl
                .gl
                .deleteTexture(this.tex)
        },
        q.prototype.isPowerOfTwo = function () {
            return q.isPowerOfTwo(this.width) && q.isPowerOfTwo(this.height)
        },
        q.prototype.printInfo = function () {
            console.log(this.getInfo())
        },
        q.prototype.getInfoReadable = function () {
            var t = this.getInfo(),
                e = "";
            for (var i in t.name = t.name.substr(0, t.name.indexOf("?rnd=")), t) 
                e += "* " + i + ":  **" + t[i] + "**\n";
            return e
        },
        q.prototype.getInfo = function () {
            var t = {};
            t.name = this.name,
            t["power of two"] = this.isPowerOfTwo(),
            t.size = this.width + " x " + this.height;
            var e = this.texTarget;
            return this.texTarget == this._cgl.gl.TEXTURE_2D && (e = "TEXTURE_2D"),
            t.target = e,
            t.unpackAlpha = this.unpackAlpha,
            this.textureType == q.TYPE_FLOAT
                ? t.textureType = "TYPE_FLOAT"
                : this.textureType == q.TYPE_DEPTH
                    ? t.textureType = "TYPE_DEPTH"
                    : this.textureType == q.TYPE_DEFAULT
                        ? t.textureType = "TYPE_DEFAULT"
                        : t.textureType = "UNKNOWN",
            this.wrap == q.WRAP_CLAMP_TO_EDGE
                ? t.wrap = "CLAMP_TO_EDGE"
                : this.wrap == q.WRAP_REPEAT
                    ? t.wrap = "WRAP_REPEAT"
                    : this.wrap == q.WRAP_MIRRORED_REPEAT
                        ? t.wrap = "WRAP_MIRRORED_REPEAT"
                        : t.wrap = "UNKNOWN",
            this.filter == q.FILTER_NEAREST
                ? t.filter = "FILTER_NEAREST"
                : this.filter == q.FILTER_LINEAR
                    ? t.filter = "FILTER_LINEAR"
                    : this.filter == q.FILTER_MIPMAP
                        ? t.filter = "FILTER_MIPMAP"
                        : t.filter = "UNKNOWN",
            t
        },
        q.prototype._setFilter = function () {
            if (
                this._fromData || this._cgl.gl.pixelStorei(this._cgl.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.unpackAlpha),
                this.shadowMap && (console.log("shadowmap tex"), this._cgl.gl.texParameteri(
                    this._cgl.gl.TEXTURE_2D,
                    this._cgl.gl.TEXTURE_COMPARE_MODE,
                    this._cgl.gl.COMPARE_REF_TO_TEXTURE
                ), this._cgl.gl.texParameteri(
                    this._cgl.gl.TEXTURE_2D,
                    this._cgl.gl.TEXTURE_COMPARE_FUNC,
                    this._cgl.gl.LEQUAL
                )),
                1 != this._cgl.glVersion || this.isPowerOfTwo()
            ) 
                if (
                    this.wrap == q.WRAP_CLAMP_TO_EDGE
                        ? (
                            this._cgl.gl.texParameteri(this.texTarget, this._cgl.gl.TEXTURE_WRAP_S, this._cgl.gl.CLAMP_TO_EDGE),
                            this._cgl.gl.texParameteri(this.texTarget, this._cgl.gl.TEXTURE_WRAP_T, this._cgl.gl.CLAMP_TO_EDGE)
                        )
                        : this.wrap == q.WRAP_REPEAT
                            ? (
                                this._cgl.gl.texParameteri(this.texTarget, this._cgl.gl.TEXTURE_WRAP_S, this._cgl.gl.REPEAT),
                                this._cgl.gl.texParameteri(this.texTarget, this._cgl.gl.TEXTURE_WRAP_T, this._cgl.gl.REPEAT)
                            )
                            : this.wrap == q.WRAP_MIRRORED_REPEAT && (
                                this._cgl.gl.texParameteri(this.texTarget, this._cgl.gl.TEXTURE_WRAP_S, this._cgl.gl.MIRRORED_REPEAT),
                                this._cgl.gl.texParameteri(this.texTarget, this._cgl.gl.TEXTURE_WRAP_T, this._cgl.gl.MIRRORED_REPEAT)
                            ),
                    this.filter == q.FILTER_NEAREST
                ) 
                    this
                        ._cgl
                        .gl
                        .texParameteri(
                            this.texTarget,
                            this._cgl.gl.TEXTURE_MAG_FILTER,
                            this._cgl.gl.NEAREST
                        ),
                    this
                        ._cgl
                        .gl
                        .texParameteri(
                            this.texTarget,
                            this._cgl.gl.TEXTURE_MIN_FILTER,
                            this._cgl.gl.NEAREST
                        );
                else if (this.filter == q.FILTER_LINEAR) 
                    this
                        ._cgl
                        .gl
                        .texParameteri(
                            this.texTarget,
                            this._cgl.gl.TEXTURE_MIN_FILTER,
                            this._cgl.gl.LINEAR
                        ),
                    this
                        ._cgl
                        .gl
                        .texParameteri(
                            this.texTarget,
                            this._cgl.gl.TEXTURE_MAG_FILTER,
                            this._cgl.gl.LINEAR
                        );
                else {
                    if (this.filter != q.FILTER_MIPMAP) 
                        throw console.log("unknown texture filter!", this.filter),
                        new Error("unknown texture filter!" + this.filter);
                    this
                        ._cgl
                        .gl
                        .texParameteri(
                            this.texTarget,
                            this._cgl.gl.TEXTURE_MAG_FILTER,
                            this._cgl.gl.LINEAR
                        ),
                    this
                        ._cgl
                        .gl
                        .texParameteri(
                            this.texTarget,
                            this._cgl.gl.TEXTURE_MIN_FILTER,
                            this._cgl.gl.LINEAR_MIPMAP_LINEAR
                        )
                }
            else 
                this
                    ._cgl
                    .gl
                    .texParameteri(
                        this.texTarget,
                        this._cgl.gl.TEXTURE_MAG_FILTER,
                        this._cgl.gl.NEAREST
                    ),
                this
                    ._cgl
                    .gl
                    .texParameteri(
                        this.texTarget,
                        this._cgl.gl.TEXTURE_MIN_FILTER,
                        this._cgl.gl.NEAREST
                    ),
                this
                    ._cgl
                    .gl
                    .texParameteri(
                        this.texTarget,
                        this._cgl.gl.TEXTURE_WRAP_S,
                        this._cgl.gl.CLAMP_TO_EDGE
                    ),
                this
                    ._cgl
                    .gl
                    .texParameteri(
                        this.texTarget,
                        this._cgl.gl.TEXTURE_WRAP_T,
                        this._cgl.gl.CLAMP_TO_EDGE
                    ),
                this.filter = q.FILTER_NEAREST,
                this.wrap = q.WRAP_CLAMP_TO_EDGE
        },
        q.load = function (t, e, i, n) {
            var r = t
                    .patch
                    .loading
                    .start("texture", e),
                s = new q(t);
            return s.name = e,
            CABLES.UI && gui
                .jobs()
                .start({
                    id: "loadtexture" + r,
                    title: "loading texture (" + e + ")"
                }),
            s.image = new Image,
            s.image.crossOrigin = "",
            n && n.hasOwnProperty("filter") && (s.filter = n.filter),
            n && n.hasOwnProperty("flip") && (s.flip = n.flip),
            n && n.hasOwnProperty("wrap") && (s.wrap = n.wrap),
            n && n.hasOwnProperty("unpackAlpha") && (s.unpackAlpha = n.unpackAlpha),
            s.image.onabort = s.image.onerror = function (e) {
                console.warn("[cgl.texture.load] error loading texture", e),
                t
                    .patch
                    .loading
                    .finished(r),
                i && i({
                    error: !0
                }),
                CABLES.UI && gui
                    .jobs()
                    .finish("loadtexture" + r)
            },
            s.image.onload = function (e) {
                s.initTexture(s.image),
                t
                    .patch
                    .loading
                    .finished(r),
                CABLES.UI && gui
                    .jobs()
                    .finish("loadtexture" + r),
                i && i()
            },
            s.image.src = e,
            s
        },
        q.getTempTexture = function (t) {
            return j || (j = q.getTemporaryTexture(t, 256, q.FILTER_LINEAR, q.REPEAT)),
            j
        },
        q.getEmptyTexture = function (t) {
            if (W) 
                return W;
            W = new q(t);
            var e = new Uint8Array(256);
            return W.initFromData(e, 8, 8, q.FILTER_NEAREST, q.WRAP_REPEAT),
            W
        },
        q.getRandomTexture = function (t) {
            if (X) 
                return X;
            const e = new Uint8Array(262144);
            for (var i = 0; i < 65536; i++) 
                e[4 * i + 0] = 255 * Math.random(),
                e[4 * i + 1] = 255 * Math.random(),
                e[4 * i + 2] = 255 * Math.random(),
                e[4 * i + 3] = 255;
            return (X = new q(t)).initFromData(
                e,
                256,
                256,
                q.FILTER_NEAREST,
                q.WRAP_REPEAT
            ),
            X
        },
        q.getTempGradientTexture = function (t) {
            if (K) 
                return K;
            for (var e = new q(t), i = new Uint8Array(262144), n = 0; n < 256; n++) 
                for (var r = 0; r < 256; r++) 
                    i[4 * (r + 256 * n) + 0] = i[4 * (r + 256 * n) + 1] = i[4 * (r + 256 * n) + 2] = 255 - n,
                    i[4 * (r + 256 * n) + 3] = 255;
        return e.initFromData(i, 256, 256, q.FILTER_NEAREST, q.WRAP_REPEAT),
            K = e,
            e
        },
        q.getTemporaryTexture = function (t, e, i, n) {
            for (var r = new q(t), s = [], a = 0; a < e; a++) 
                for (var o = 0; o < e; o++) 
                    (o + a) % 64 < 32
                        ? (
                            s.push(200 + a / e * 25 + o / e * 25),
                            s.push(200 + a / e * 25 + o / e * 25),
                            s.push(
                                200 + a / e * 25 + o / e * 25
                            )
                        )
                        : (
                            s.push(40 + a / e * 25 + o / e * 25),
                            s.push(40 + a / e * 25 + o / e * 25),
                            s.push(
                                40 + a / e * 25 + o / e * 25
                            )
                        ),
                    s.push(255);
        var l = new Uint8Array(s);
            return r.initFromData(l, e, e, i, n),
            r
        },
        q.createFromImage = function (t, e, i) {
            var n = new q(t, i);
            return n.flip = !1,
            n.image = e,
            n.width = e.width,
            n.height = e.height,
            n.initTexture(e, i.filter),
            n
        },
        q.fromImage = function (t, e, i, n) {
            console.error("deprecated texture from image...");
            var r = new q(t);
            return r.flip = !1,
            i && (r.filter = i),
            n && (r.wrap = n),
            r.image = e,
            r.initTexture(e),
            r
        },
        q.isPowerOfTwo = function (t) {
            return 1 == t || 2 == t || 4 == t || 8 == t || 16 == t || 32 == t || 64 == t || 128 == t || 256 == t || 512 == t || 1024 == t || 2048 == t || 4096 == t || 8192 == t || 16384 == t
        },
        q.FILTER_NEAREST = 0,
        q.FILTER_LINEAR = 1,
        q.FILTER_MIPMAP = 2,
        q.WRAP_REPEAT = 0,
        q.WRAP_MIRRORED_REPEAT = 1,
        q.WRAP_CLAMP_TO_EDGE = 2,
        q.TYPE_DEFAULT = 0,
        q.TYPE_DEPTH = 1,
        q.TYPE_FLOAT = 2;
        const Z = function (t, e, i, n) {
            this.Framebuffer2DrawTargetsDefault = null,
            this.Framebuffer2BlittingFramebuffer = null,
            this.Framebuffer2FinalFramebuffer = null,
            this._cgl = t,
            this._width = 0,
            this._height = 0,
            this._depthRenderbuffer = null,
            this._frameBuffer = null,
            this._textureFrameBuffer = null,
            this._colorRenderbuffers = [],
            this._drawTargetArray = [],
            this.Framebuffer2BlittingFramebuffer || (
                this.Framebuffer2BlittingFramebuffer = t.gl.createFramebuffer()
            ),
            this.Framebuffer2FinalFramebuffer || (
                this.Framebuffer2FinalFramebuffer = t.gl.createFramebuffer()
            ),
            this.Framebuffer2DrawTargetsDefault || (
                this.Framebuffer2DrawTargetsDefault = [t.gl.COLOR_ATTACHMENT0]
            ),
            this._options = n || {
                isFloatingPointTexture: !1
            },
            this
                ._options
                .hasOwnProperty("numRenderBuffers") || (this._options.numRenderBuffers = 1),
            this
                ._options
                .hasOwnProperty("depth") || (this._options.depth = !0),
            this
                ._options
                .hasOwnProperty("clear") || (this._options.clear = !0),
            this
                ._options
                .hasOwnProperty("multisampling") || (
                    this._options.multisampling = !1,
                    this._options.multisamplingSamples = 0
                ),
            this._options.multisamplingSamples && (
                this._cgl.gl.MAX_SAMPLES
                    ? this._options.multisamplingSamples = Math.min(
                        this._cgl.gl.getParameter(this._cgl.gl.MAX_SAMPLES),
                        this._options.multisamplingSamples
                    )
                    : this._options.multisamplingSamples = 0
            ),
            this
                ._options
                .hasOwnProperty("filter") || (this._options.filter = q.FILTER_LINEAR),
            this._numRenderBuffers = this._options.numRenderBuffers,
            this._colorTextures = [];
            for (var r = 0; r < this._numRenderBuffers; r++) 
                this._colorTextures[r] = new q(t, {
                    name: "framebuffer2 texture " + r,
                    isFloatingPointTexture: this._options.isFloatingPointTexture,
                    filter: this._options.filter,
                    wrap: this._options.wrap
                });
            var s = q.FILTER_NEAREST;
            this._options.shadowMap && (s = q.FILTER_LINEAR),
            this._textureDepth = new q(t, {
                name: "framebuffer2 depth texture",
                isDepthTexture: !0,
                filter: s,
                shadowMap: this._options.shadowMap || !1
            }),
            this.setSize(e || 512, i || 512)
        };
        Z.prototype.getWidth = function () {
            return this._width
        },
        Z.prototype.getHeight = function () {
            return this._height
        },
        Z.prototype.getGlFrameBuffer = function () {
            return this._frameBuffer
        },
        Z.prototype.getDepthRenderBuffer = function () {
            return this._depthRenderbuffer
        },
        Z.prototype.getTextureColor = function () {
            return this._colorTextures[0]
        },
        Z.prototype.getTextureColorNum = function (t) {
            return this._colorTextures[t]
        },
        Z.prototype.getTextureDepth = function () {
            return this._textureDepth
        },
        Z.prototype.setFilter = function (t) {
            for (var e = 0; e < this._numRenderBuffers; e++) 
                this
                    ._colorTextures[e]
                    .filter = t,
                this
                    ._colorTextures[e]
                    .setSize(this._width, this._height)
            },
        Z.prototype.delete = Z.prototype.dispose = function () {
            for (var t = 0; t < this._numRenderBuffers; t++) 
                this
                    ._colorTextures[t]
                    .delete();
            for (this._textureDepth.delete(), t = 0; t < this._numRenderBuffers; t++) 
                this
                    ._cgl
                    .gl
                    .deleteRenderbuffer(this._colorRenderbuffers[t]);
            this
                ._cgl
                .gl
                .deleteRenderbuffer(this._depthRenderbuffer),
            this
                ._cgl
                .gl
                .deleteFramebuffer(this._frameBuffer),
            this
                ._cgl
                .gl
                .deleteFramebuffer(this._textureFrameBuffer)
        },
        Z.prototype.setSize = function (t, e) {
            if (
                this._width = Math.floor(t),
                this._height = Math.floor(e),
                H.profileFrameBuffercreate++,
                this._frameBuffer
            ) {
                for (var i = 0; i < this._numRenderBuffers; i++) 
                    this
                        ._cgl
                        .gl
                        .deleteRenderbuffer(this._colorRenderbuffers[i]);
                this
                    ._cgl
                    .gl
                    .deleteRenderbuffer(this._depthRenderbuffer),
                this
                    ._cgl
                    .gl
                    .deleteFramebuffer(this._frameBuffer),
                this
                    ._cgl
                    .gl
                    .deleteFramebuffer(this._textureFrameBuffer)
            }
            this._frameBuffer = this
                ._cgl
                .gl
                .createFramebuffer(),
            this._textureFrameBuffer = this
                ._cgl
                .gl
                .createFramebuffer();
            var n = this._options.depth;
            for (i = 0; i < this._numRenderBuffers; i++) 
                this
                    ._colorTextures[i]
                    .setSize(this._width, this._height);
            for (i = 0; i < this._numRenderBuffers; i++) {
                var r = this
                    ._cgl
                    .gl
                    .createRenderbuffer();
                this
                    ._cgl
                    .gl
                    .getExtension("EXT_color_buffer_float"),
                this
                    ._cgl
                    .gl
                    .bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuffer),
                this
                    ._cgl
                    .gl
                    .bindRenderbuffer(this._cgl.gl.RENDERBUFFER, r),
                this._options.isFloatingPointTexture
                    ? this._options.multisampling
                        ? this
                            ._cgl
                            .gl
                            .renderbufferStorageMultisample(
                                this._cgl.gl.RENDERBUFFER,
                                this._options.multisamplingSamples,
                                this._cgl.gl.RGBA32F,
                                this._width,
                                this._height
                            )
                        : this
                            ._cgl
                            .gl
                            .renderbufferStorage(
                                this._cgl.gl.RENDERBUFFER,
                                this._cgl.gl.RGBA32F,
                                this._width,
                                this._height
                            )
                    : this._options.multisampling
                        ? this
                            ._cgl
                            .gl
                            .renderbufferStorageMultisample(
                                this._cgl.gl.RENDERBUFFER,
                                this._options.multisamplingSamples,
                                this._cgl.gl.RGBA8,
                                this._width,
                                this._height
                            )
                        : this
                            ._cgl
                            .gl
                            .renderbufferStorage(
                                this._cgl.gl.RENDERBUFFER,
                                this._cgl.gl.RGBA8,
                                this._width,
                                this._height
                            ),
                this
                    ._cgl
                    .gl
                    .framebufferRenderbuffer(
                        this._cgl.gl.FRAMEBUFFER,
                        this._cgl.gl.COLOR_ATTACHMENT0 + i,
                        this._cgl.gl.RENDERBUFFER,
                        r
                    ),
                this._colorRenderbuffers[i] = r
            }
            for (
                this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._textureFrameBuffer),
                i = 0;
                i < this._numRenderBuffers;
                i++
            ) 
                this
                    ._cgl
                    .gl
                    .framebufferTexture2D(
                        this._cgl.gl.FRAMEBUFFER,
                        this._cgl.gl.COLOR_ATTACHMENT0 + i,
                        this._cgl.gl.TEXTURE_2D,
                        this._colorTextures[i].tex,
                        0
                    );
            for (
                this._options.depth && this._cgl.gl.framebufferTexture2D(
                    this._cgl.gl.FRAMEBUFFER,
                    this._cgl.gl.DEPTH_ATTACHMENT,
                    this._cgl.gl.TEXTURE_2D,
                    this._textureDepth.tex,
                    0
                ),
                this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuffer),
                n && (
                    this._textureDepth.setSize(this._width, this._height),
                    this._depthRenderbuffer = this._cgl.gl.createRenderbuffer(),
                    this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, this._depthRenderbuffer),
                    this._options.isFloatingPointTexture,
                    this._options.multisampling
                        ? this._cgl.gl.renderbufferStorageMultisample(
                            this._cgl.gl.RENDERBUFFER,
                            this._options.multisamplingSamples,
                            this._cgl.gl.DEPTH_COMPONENT32F,
                            this._width,
                            this._height
                        )
                        : this._cgl.gl.renderbufferStorage(
                            this._cgl.gl.RENDERBUFFER,
                            this._cgl.gl.DEPTH_COMPONENT32F,
                            this._width,
                            this._height
                        ),
                    this._cgl.gl.framebufferRenderbuffer(
                        this._cgl.gl.FRAMEBUFFER,
                        this._cgl.gl.DEPTH_ATTACHMENT,
                        this._cgl.gl.RENDERBUFFER,
                        this._depthRenderbuffer
                    )
                ),
                this._drawTargetArray.length = 0,
                i = 0; i < this._numRenderBuffers; i++
            ) 
                this
                    ._drawTargetArray
                    .push(this._cgl.gl.COLOR_ATTACHMENT0 + i);
            if (!this._cgl.gl.isFramebuffer(this._textureFrameBuffer)) 
                throw "Invalid framebuffer";
            var s = this
                ._cgl
                .gl
                .checkFramebufferStatus(this._cgl.gl.FRAMEBUFFER);
            switch (s) {
                case this._cgl.gl.FRAMEBUFFER_COMPLETE:
                    break;
                case this._cgl.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    throw console.log("FRAMEBUFFER_INCOMPLETE_ATTACHMENT..."),
                    new Error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                case this._cgl.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    throw console.log("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"),
                    new Error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                case this._cgl.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    throw console.log("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"),
                    new Error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                case this._cgl.gl.FRAMEBUFFER_UNSUPPORTED:
                    throw console.log("FRAMEBUFFER_UNSUPPORTED"),
                    new Error("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
                default:
                    throw console.log("incomplete framebuffer", s),
                    new Error("Incomplete framebuffer: " + s)
            }
            this
                ._cgl
                .gl
                .bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null),
            this
                ._cgl
                .gl
                .bindRenderbuffer(this._cgl.gl.RENDERBUFFER, null)
        },
        Z.prototype.renderStart = function () {
            this
                ._cgl
                .pushModelMatrix(),
            this
                ._cgl
                .gl
                .bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuffer),
            this
                ._cgl
                .pushGlFrameBuffer(this._frameBuffer),
            this
                ._cgl
                .pushFrameBuffer(this),
            this
                ._cgl
                .pushPMatrix(),
            this
                ._cgl
                .gl
                .viewport(0, 0, this._width, this._height),
            this
                ._cgl
                .gl
                .drawBuffers(this._drawTargetArray),
            this._options.clear && (
                this._cgl.gl.clearColor(0, 0, 0, 0),
                this._cgl.gl.clear(this._cgl.gl.COLOR_BUFFER_BIT | this._cgl.gl.DEPTH_BUFFER_BIT)
            )
        },
        Z.prototype.renderEnd = function () {
            if (this._cgl.popPMatrix(), this._numRenderBuffers <= 1) 
                this
                    ._cgl
                    .gl
                    .bindFramebuffer(this._cgl.gl.READ_FRAMEBUFFER, this._frameBuffer),
                this
                    ._cgl
                    .gl
                    .bindFramebuffer(this._cgl.gl.DRAW_FRAMEBUFFER, this._textureFrameBuffer),
                this
                    ._cgl
                    .gl
                    .clearBufferfv(this._cgl.gl.COLOR, 0, [0, 0, 0, 1]),
                this
                    ._cgl
                    .gl
                    .blitFramebuffer(
                        0,
                        0,
                        this._width,
                        this._height,
                        0,
                        0,
                        this._width,
                        this._height,
                        this._cgl.gl.COLOR_BUFFER_BIT | this._cgl.gl.DEPTH_BUFFER_BIT,
                        this._cgl.gl.NEAREST
                    );
            else {
                this
                    ._cgl
                    .gl
                    .bindFramebuffer(
                        this._cgl.gl.FRAMEBUFFER,
                        this.Framebuffer2BlittingFramebuffer
                    ),
                this
                    ._cgl
                    .gl
                    .framebufferRenderbuffer(
                        this._cgl.gl.FRAMEBUFFER,
                        this._cgl.gl.DEPTH_ATTACHMENT,
                        this._cgl.gl.RENDERBUFFER,
                        this._depthRenderbuffer
                    ),
                this
                    ._cgl
                    .gl
                    .bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this.Framebuffer2FinalFramebuffer),
                this
                    ._cgl
                    .gl
                    .framebufferTexture2D(
                        this._cgl.gl.FRAMEBUFFER,
                        this._cgl.gl.DEPTH_ATTACHMENT,
                        this._cgl.gl.TEXTURE_2D,
                        this._textureDepth.tex,
                        0
                    );
                for (var t = 0; t < this._numRenderBuffers; t++) {
                    this
                        ._cgl
                        .gl
                        .bindFramebuffer(
                            this._cgl.gl.FRAMEBUFFER,
                            this.Framebuffer2BlittingFramebuffer
                        ),
                    this
                        ._cgl
                        .gl
                        .framebufferRenderbuffer(
                            this._cgl.gl.FRAMEBUFFER,
                            this._cgl.gl.COLOR_ATTACHMENT0,
                            this._cgl.gl.RENDERBUFFER,
                            this._colorRenderbuffers[t]
                        ),
                    this
                        ._cgl
                        .gl
                        .bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this.Framebuffer2FinalFramebuffer),
                    this
                        ._cgl
                        .gl
                        .framebufferTexture2D(
                            this._cgl.gl.FRAMEBUFFER,
                            this._cgl.gl.COLOR_ATTACHMENT0,
                            this._cgl.gl.TEXTURE_2D,
                            this._colorTextures[t].tex,
                            0
                        ),
                    this
                        ._cgl
                        .gl
                        .bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null),
                    this
                        ._cgl
                        .gl
                        .bindFramebuffer(
                            this._cgl.gl.READ_FRAMEBUFFER,
                            this.Framebuffer2BlittingFramebuffer
                        ),
                    this
                        ._cgl
                        .gl
                        .bindFramebuffer(
                            this._cgl.gl.DRAW_FRAMEBUFFER,
                            this.Framebuffer2FinalFramebuffer
                        ),
                    this
                        ._cgl
                        .gl
                        .clearBufferfv(this._cgl.gl.COLOR, 0, [0, 0, 0, 1]);
                    var e = this._cgl.gl.COLOR_BUFFER_BIT;
                    0 == t && (e |= this._cgl.gl.DEPTH_BUFFER_BIT),
                    this
                        ._cgl
                        .gl
                        .blitFramebuffer(
                            0,
                            0,
                            this._width,
                            this._height,
                            0,
                            0,
                            this._width,
                            this._height,
                            e,
                            this._cgl.gl.NEAREST
                        )
                }
            }
            if (
                this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._cgl.popGlFrameBuffer()),
                this._cgl.popFrameBuffer(),
                this._cgl.popModelMatrix(),
                this._cgl.resetViewPort(),
                this._colorTextures[0].filter == q.FILTER_MIPMAP
            ) 
                for (t = 0; t < this._numRenderBuffers; t++) 
                    this
                        ._cgl
                        .gl
                        .bindTexture(this._cgl.gl.TEXTURE_2D, this._colorTextures[t].tex),
                    this
                        ._colorTextures[t]
                        .updateMipMap(),
                    this
                        ._cgl
                        .gl
                        .bindTexture(this._cgl.gl.TEXTURE_2D, null)
            };
        const Q = function (t) {
            this.name = t,
            this.faceVertCount = 3,
            this._vertices = [],
            this.verticesIndices = [],
            this.texCoords = new Float32Array,
            this.texCoordsIndices = [],
            this.vertexNormals = [],
            this.tangents = [],
            this.biTangents = [],
            this.barycentrics = [],
            this.morphTargets = [],
            this.vertexColors = [],
            this._attributes = {},
            Object.defineProperty(this, "vertices", {
                get() {
                    return this._vertices
                },
                set(t) {
                    this.setVertices(t)
                }
            })
        };
        Q.prototype.clear = function () {
            this.vertices = new Float32Array([]),
            this.verticesIndices.length = 0,
            this.texCoords = new Float32Array([]),
            this.texCoordsIndices.length = 0,
            this.vertexNormals = new Float32Array([])
        },
        Q.prototype.getAttributes = function () {
            return this._attributes
        },
        Q.prototype.getAttribute = function (t) {
            for (var e in this._attributes) 
                if (this._attributes[e].name == t) 
                    return this._attributes[e];
        return null
        },
        Q.prototype.setAttribute = function (t, e, i) {
            var n = "";
            1 == i
                ? n = "float"
                : 2 == i
                    ? n = "vec2"
                    : 3 == i
                        ? n = "vec3"
                        : 4 == i && (n = "vec4");
            var r = {
                name: t,
                data: e,
                itemSize: i,
                type: n
            };
            this._attributes[t] = r
        },
        Q.prototype.setVertices = function (t) {
            t instanceof Float32Array
                ? this._vertices = t
                : this._vertices = new Float32Array(t)
        },
        Q.prototype.setTexCoords = function (t) {
            t instanceof Float32Array
                ? this.texCoords = t
                : this.texCoords = new Float32Array(t)
        },
        Q.prototype.calcNormals = function (t) {
            t || this.unIndex(),
            this.calculateNormals({})
        },
        Q.prototype.setPointVertices = function (t) {
            if (t.length % 3 == 0) {
                t instanceof Float32Array
                    ? this.vertices = t
                    : this.vertices = new Float32Array(t),
                this.texCoords instanceof Float32Array || (
                    this.texCoords = new Float32Array(t.length / 3 * 2)
                ),
                this.verticesIndices.length = t.length / 3;
                for (var e = 0; e < t.length / 3; e++) 
                    this.verticesIndices[e] = e,
                    this.texCoords[2 * e] = 0,
                    this.texCoords[2 * e + 1] = 0
            } else 
                console.error("CGL MESH : SetPointVertices: Array must be multiple of three.")
        },
        Q.prototype.merge = function (t) {
            if (t) {
                var e = this.verticesIndices.length,
                    i = this.vertices.length / 3;
                this.verticesIndices.length = this.verticesIndices.length + t.verticesIndices.length;
                for (var n = 0; n < t.verticesIndices.length; n++) 
                    this.verticesIndices[e + n] = t.verticesIndices[n] + i;
                this.vertices = g.float32Concat(this.vertices, t.vertices),
                this.texCoords = g.float32Concat(this.texCoords, t.texCoords),
                this.vertexNormals = g.float32Concat(this.vertexNormals, t.vertexNormals),
                this.tangents = g.float32Concat(this.vertexNormals, t.tangents),
                this.bitangents = g.float32Concat(this.vertexNormals, t.bitangents)
            }
        },
        Q.prototype.copy = function () {
            var t = 0,
                e = new Q;
            for (
                e.faceVertCount = this.faceVertCount,
                e.setVertices(this._vertices.slice(0)),
                e.verticesIndices.length = this.verticesIndices.length,
                t = 0;
                t < this.verticesIndices.length;
                t++
            ) 
                e.verticesIndices[t] = this.verticesIndices[t];
            for (
                e.texCoords = new Float32Array(this.texCoords.length),
                t = 0;
                t < this.texCoords.length;
                t++
            ) 
                e.texCoords[t] = this.texCoords[t];
            for (
                e.texCoordsIndices.length = this.texCoordsIndices.length,
                t = 0;
                t < this.texCoordsIndices.length;
                t++
            ) 
                e.texCoordsIndices[t] = this.texCoordsIndices[t];
            for (
                e.vertexNormals = new Float32Array(this.vertexNormals.length),
                t = 0;
                t < this.vertexNormals.length;
                t++
            ) 
                e.vertexNormals[t] = this.vertexNormals[t];
            if (this.tangents) 
                for (
                    e.tangents = [],
                    e.tangents.length = this.tangents.length,
                    t = 0;
                    t < this.tangents.length;
                    t++
                ) 
                    e.tangents[t] = this.tangents[t];
        if (this.biTangents) 
                for (
                    e.biTangents = [],
                    e.biTangents.length = this.biTangents.length,
                    t = 0;
                    t < this.biTangents.length;
                    t++
                ) 
                    e.biTangents[t] = this.biTangents[t];
        for (
                e.barycentrics.length = this.barycentrics.length,
                t = 0;
                t < this.barycentrics.length;
                t++
            ) 
                e.barycentrics[t] = this.barycentrics[t];
            for (
                e.morphTargets.length = this.morphTargets.length,
                t = 0;
                t < this.morphTargets.length;
                t++
            ) 
                e.morphTargets[t] = this.morphTargets[t];
            for (
                e.vertexColors.length = this.vertexColors.length,
                t = 0;
                t < this.vertexColors.length;
                t++
            ) 
                e.vertexColors[t] = this.vertexColors[t];
            return e
        },
        Q.prototype.calculateNormals = function (t) {
            var e = vec3.create(),
                i = vec3.create(),
                n = vec3.create(),
                r = 0;
            function s(r) {
                return vec3.subtract(e, r[0], r[1]),
                vec3.subtract(i, r[0], r[2]),
                vec3.cross(n, e, i),
                vec3.normalize(n, n),
                t && t.forceZUp && n[2] < 0 && (n[0] *= -1, n[1] *= -1, n[2] *= -1),
                n
            }
            for (
                this.getVertexVec = function (t) {
                    var e = [0, 0, 0];
                    return e[0] = this.vertices[3 * t + 0],
                    e[1] = this.vertices[3 * t + 1],
                    e[2] = this.vertices[3 * t + 2],
                    e
                },
                this.vertexNormals instanceof Float32Array && this.vertexNormals.length == this.vertices.length || (
                    this.vertexNormals = new Float32Array(this.vertices.length)
                ),
                r = 0; r < this.vertices.length; r++
            ) 
                this.vertexNormals[r] = 0;
            if (this.isIndexed()) {
                var a = [];
                for (
                    a.length = this.verticesIndices.length / 3,
                    r = 0;
                    r < this.verticesIndices.length;
                    r += 3
                ) 
                    u = [
                        this.getVertexVec(this.verticesIndices[r + 0]),
                        this.getVertexVec(this.verticesIndices[r + 1]),
                        this.getVertexVec(this.verticesIndices[r + 2])
                    ],
                    a[r / 3] = s(u),
                    this.vertexNormals[3 * this.verticesIndices[r + 0] + 0] += a[r / 3][0],
                    this.vertexNormals[3 * this.verticesIndices[r + 0] + 1] += a[r / 3][1],
                    this.vertexNormals[3 * this.verticesIndices[r + 0] + 2] += a[r / 3][2],
                    this.vertexNormals[3 * this.verticesIndices[r + 1] + 0] += a[r / 3][0],
                    this.vertexNormals[3 * this.verticesIndices[r + 1] + 1] += a[r / 3][1],
                    this.vertexNormals[3 * this.verticesIndices[r + 1] + 2] += a[r / 3][2],
                    this.vertexNormals[3 * this.verticesIndices[r + 2] + 0] += a[r / 3][0],
                    this.vertexNormals[3 * this.verticesIndices[r + 2] + 1] += a[r / 3][1],
                    this.vertexNormals[3 * this.verticesIndices[r + 2] + 2] += a[r / 3][2];
                for (r = 0; r < this.verticesIndices.length; r += 3) 
                    for (var o = 0; o < 3; o++) {
                        var l = [
                            this.vertexNormals[3 * this.verticesIndices[r + o] + 0],
                            this.vertexNormals[3 * this.verticesIndices[r + o] + 1],
                            this.vertexNormals[3 * this.verticesIndices[r + o] + 2]
                        ];
                        vec3.normalize(l, l),
                        this.vertexNormals[3 * this.verticesIndices[r + o] + 0] = l[0],
                        this.vertexNormals[3 * this.verticesIndices[r + o] + 1] = l[1],
                        this.vertexNormals[3 * this.verticesIndices[r + o] + 2] = l[2]
                    }
                } else {
                var h = [];
                for (r = 0; r < this.vertices.length; r += 9) {
                    var u;
                    n = s(u = [
                        [
                            this.vertices[r + 0],
                            this.vertices[r + 1],
                            this.vertices[r + 2]
                        ],
                        [
                            this.vertices[r + 3],
                            this.vertices[r + 4],
                            this.vertices[r + 5]
                        ],
                        [
                            this.vertices[r + 6],
                            this.vertices[r + 7],
                            this.vertices[r + 8]
                        ]
                    ]),
                    h.push(n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2])
                }
                this.vertexNormals = h
            }
        },
        Q.prototype.calcTangentsBitangents = function () {
            if (!this.vertices.length) 
                throw new Error("Cannot calculate tangents/bitangents without vertices.");
            if (!this.vertexNormals.length) 
                throw new Error("Cannot calculate tangents/bitangents without normals.");
            if (!this.texCoords.length) 
                throw new Error(
                    "Cannot calculate tangents/bitangents without texture coordinates."
                );
            if (!this.verticesIndices.length) 
                throw new Error("Cannot calculate tangents/bitangents without vertex indices.");
            if (this.verticesIndices.length % 3 != 0) 
                throw new Error("Vertex indices mismatch!");
            const t = this.verticesIndices.length / 3,
                e = this.vertices.length / 3;
            this.tangents = new Float32Array(this.vertexNormals.length),
            this.biTangents = new Float32Array(this.vertexNormals.length);
            var i = [];
            i.length = 2 * e;
            const n = vec3.create(),
                r = vec3.create(),
                s = vec3.create(),
                a = vec2.create(),
                o = vec2.create(),
                l = vec2.create(),
                h = vec3.create(),
                u = vec3.create();
            for (var c = 0; c < t; c += 1) {
                const t = this.verticesIndices[3 * c],
                    p = this.verticesIndices[3 * c + 1],
                    d = this.verticesIndices[3 * c + 2];
                vec3.set(
                    n,
                    this.vertices[3 * t],
                    this.vertices[3 * t + 1],
                    this.vertices[3 * t + 2]
                ),
                vec3.set(
                    r,
                    this.vertices[3 * p],
                    this.vertices[3 * p + 1],
                    this.vertices[3 * p + 2]
                ),
                vec3.set(
                    s,
                    this.vertices[3 * d],
                    this.vertices[3 * d + 1],
                    this.vertices[3 * d + 2]
                ),
                vec2.set(a, this.texCoords[2 * t], this.texCoords[2 * t + 1]),
                vec2.set(o, this.texCoords[2 * p], this.texCoords[2 * p + 1]),
                vec2.set(l, this.texCoords[2 * d], this.texCoords[2 * d + 1]);
                const f = r[0] - n[0],
                    g = s[0] - n[0],
                    _ = r[1] - n[1],
                    m = s[1] - n[1],
                    v = r[2] - n[2],
                    b = s[2] - n[2],
                    M = o[0] - a[0],
                    E = l[0] - a[0],
                    I = o[1] - a[1],
                    A = l[1] - a[1],
                    x = 1 / (M * A - E * I);
                vec3.set(h, (A * f - I * g) * x, (A * _ - I * m) * x, (A * v - I * b) * x),
                vec3.set(u, (M * g - E * f) * x, (M * m - E * _) * x, (M * b - E * v) * x),
                i[t] = h,
                i[p] = h,
                i[d] = h,
                i[t + e] = u,
                i[p + e] = u,
                i[d + e] = u
            }
            const p = vec3.create(),
                d = vec3.create(),
                f = vec3.create(),
                g = vec3.create(),
                _ = vec3.create(),
                m = vec3.create(),
                v = vec3.create(),
                b = vec3.create();
            for (var M = 0; M < e; M += 1) {
                vec3.set(
                    p,
                    this.vertexNormals[3 * M],
                    this.vertexNormals[3 * M + 1],
                    this.vertexNormals[3 * M + 2]
                ),
                vec3.set(d, i[M][0], i[M][1], i[M][2]);
                const t = vec3.dot(p, d);
                vec3.scale(_, p, t),
                vec3.subtract(m, d, _),
                vec3.normalize(b, m),
                vec3.cross(v, p, d);
                const n = vec3.dot(v, i[M + e]) < 0
                    ? -1
                    : 1;
                vec3.scale(f, b, 1 / n),
                vec3.cross(g, p, f),
                this.tangents[3 * M + 0] = f[0],
                this.tangents[3 * M + 1] = f[1],
                this.tangents[3 * M + 2] = f[2],
                this.biTangents[3 * M + 0] = g[0],
                this.biTangents[3 * M + 1] = g[1],
                this.biTangents[3 * M + 2] = g[2]
            }
        },
        Q.prototype.isIndexed = function () {
            return 0 != this.verticesIndices.length
        },
        Q.prototype.unIndex = function (t) {
            var e = [],
                i = [],
                n = [],
                r = [],
                s = 0,
                a = 0;
            for (this.vertexNormals = [], a = 0; a < this.verticesIndices.length; a += 3) 
                e.push(this.vertices[3 * this.verticesIndices[a + 0] + 0]),
                e.push(this.vertices[3 * this.verticesIndices[a + 0] + 1]),
                e.push(this.vertices[3 * this.verticesIndices[a + 0] + 2]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 0] + 0]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 0] + 1]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 0] + 2]),
                this.texCoords
                    ? (
                        n.push(this.texCoords[2 * this.verticesIndices[a + 0] + 0]),
                        n.push(this.texCoords[2 * this.verticesIndices[a + 0] + 1])
                    )
                    : (n.push(0), n.push(0)),
                i.push(s),
                s++,
                e.push(this.vertices[3 * this.verticesIndices[a + 1] + 0]),
                e.push(this.vertices[3 * this.verticesIndices[a + 1] + 1]),
                e.push(this.vertices[3 * this.verticesIndices[a + 1] + 2]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 1] + 0]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 1] + 1]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 1] + 2]),
                this.texCoords
                    ? (
                        n.push(this.texCoords[2 * this.verticesIndices[a + 1] + 0]),
                        n.push(this.texCoords[2 * this.verticesIndices[a + 1] + 1])
                    )
                    : (n.push(0), n.push(0)),
                i.push(s),
                s++,
                e.push(this.vertices[3 * this.verticesIndices[a + 2] + 0]),
                e.push(this.vertices[3 * this.verticesIndices[a + 2] + 1]),
                e.push(this.vertices[3 * this.verticesIndices[a + 2] + 2]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 2] + 0]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 2] + 1]),
                r.push(this.vertexNormals[3 * this.verticesIndices[a + 2] + 2]),
                this.texCoords
                    ? (
                        n.push(this.texCoords[2 * this.verticesIndices[a + 2] + 0]),
                        n.push(this.texCoords[2 * this.verticesIndices[a + 2] + 1])
                    )
                    : (n.push(0), n.push(0)),
                i.push(s),
                s++;
            this.vertices = e,
            this.texCoords = n,
            this.vertexNormals = r,
            this.verticesIndices.length = 0,
            t && (this.verticesIndices = i),
            this.calculateNormals()
        },
        Q.prototype.calcBarycentric = function () {
            this.barycentrics.length = this.vertices.length;
            var t = 0;
            for (t = 0; t < this.vertices.length; t++) 
                this.barycentrics[t] = 0;
            var e = 0;
            for (t = 0; t < this.vertices.length; t += 3) 
                this.barycentrics[t + e] = 1,
                3 == ++e && (e = 0)
        },
        Q.prototype.getBounds = function () {
            var t = 0,
                e = {
                    maxX: -Number.MAX_VALUE,
                    maxY: -Number.MAX_VALUE,
                    maxZ: -Number.MAX_VALUE,
                    minX: Number.MAX_VALUE,
                    minY: Number.MAX_VALUE,
                    minZ: Number.MAX_VALUE
                };
            for (t = 0; t < this.vertices.length; t += 3) 
                this.vertices[t + 0] == this.vertices[t + 0] && (
                    e.maxX = Math.max(e.maxX, this.vertices[t + 0]),
                    e.maxY = Math.max(e.maxY, this.vertices[t + 1]),
                    e.maxZ = Math.max(e.maxZ, this.vertices[t + 2]),
                    e.minX = Math.min(e.minX, this.vertices[t + 0]),
                    e.minY = Math.min(e.minY, this.vertices[t + 1]),
                    e.minZ = Math.min(e.minZ, this.vertices[t + 2])
                );
            return e.x = Math.abs(e.maxX) + Math.abs(e.minX),
            e.y = Math.abs(e.maxY) + Math.abs(e.minY),
            e.z = Math.abs(e.maxZ) + Math.abs(e.minZ),
            e.maxAxis = Math.max(e.z, Math.max(e.x, e.y)),
            e
        },
        Q.prototype.center = function (t, e, i) {
            void 0 === t && (t = !0, e = !0, i = !0);
            var n = 0;
            const r = this.getBounds(),
                s = [
                    r.minX + (r.maxX - r.minX) / 2,
                    r.minY + (r.maxY - r.minY) / 2,
                    r.minZ + (r.maxZ - r.minZ) / 2
                ];
            for (n = 0; n < this.vertices.length; n += 3) 
                this.vertices[n + 0] == this.vertices[n + 0] && (
                    t && (this.vertices[n + 0] -= s[0]),
                    e && (this.vertices[n + 1] -= s[1]),
                    i && (this.vertices[n + 2] -= s[2])
                );
            return s
        },
        Q.prototype.mapTexCoords2d = function () {
            var t = this.getBounds(),
                e = this.vertices.length / 3;
            this.texCoords = new Float32Array(length = 2 * e);
            for (var i = 0; i < e; i++) {
                var n = this.vertices[3 * i + 0],
                    r = this.vertices[3 * i + 1];
                this.texCoords[2 * i + 0] = n / (t.maxX - t.minX) + .5,
                this.texCoords[2 * i + 1] = 1 - r / (t.maxY - t.minY) + .5
            }
        },
        Q.buildFromFaces = function (t) {
            for (var e = [], i = [], n = 0; n < t.length; n += 3) {
                for (var r = t[n + 0], s = t[n + 1], a = t[n + 2], o = [
                    -1, -1, -1
                ], l = 0; l < e; l += 3) 
                    e[l + 0] == r[0] && e[l + 1] == r[1] && e[l + 2] == r[2] && (o[0] = l / 3),
                    e[l + 0] == s[0] && e[l + 1] == s[1] && e[l + 2] == s[2] && (o[1] = l / 3),
                    e[l + 0] == a[0] && e[l + 1] == a[1] && e[l + 2] == a[2] && (o[2] = l / 3);
                
- 1 == o[0] && (e.push(r[0], r[1], r[2]), o[0] = (e.length - 1) / 3),
                -1 == o[1] && (e.push(s[0], s[1], s[2]), o[1] = (e.length - 1) / 3),
                -1 == o[2] && (e.push(a[0], a[1], a[2]), o[2] = (e.length - 1) / 3),
                i.push(parseInt(o[0], 10)),
                i.push(parseInt(o[1], 10)),
                i.push(parseInt(o[2], 10))
            }
            var h = new Q;
            return h.vertices = e,
            h.verticesIndices = i,
            h
        },
        Q.json2geom = function (t) {
            var e = new Q;
            if (
                e.verticesIndices = [],
                e.vertices = t.vertices || [],
                e.vertexNormals = t.normals || [],
                e.vertexColors = t.colors || [],
                e.tangents = t.tangents || [],
                e.biTangents = t.bitangents || [],
                t.texturecoords && e.setTexCoords(t.texturecoords[0]),
                t.vertices_b64 && (e.vertices = new Float32Array(d(t.vertices_b64))),
                t.normals_b64 && (e.vertexNormals = new Float32Array(d(t.normals_b64))),
                t.tangents_b64 && (e.tangents = new Float32Array(d(t.tangents_b64))),
                t.bitangents_b64 && (e.biTangents = new Float32Array(d(t.bitangents_b64))),
                t.texturecoords_b64 && e.setTexCoords(new Float32Array(d(t.texturecoords_b64[0]))),
                t.faces_b64
            ) 
                e.verticesIndices = new Uint32Array(d(t.faces_b64));
            else {
                e.verticesIndices.length = 3 * t.faces.length;
                for (var i = 0; i < t.faces.length; i++) 
                    e.verticesIndices[3 * i] = t.faces[i][0],
                    e.verticesIndices[3 * i + 1] = t.faces[i][1],
                    e.verticesIndices[3 * i + 2] = t.faces[i][2]
            }
            return e
        };
        const J = function (t, e, i, n) {
            if (
                this._loc = -1,
                this._type = e,
                this._name = i,
                this._shader = t,
                this._value = 1e-5,
                this._oldValue = null,
                this._port = null,
                this._shader.addUniform(this),
                this.needsUpdate = !0,
                "f" == e
            ) 
                this.set = this.setValue = this
                    .setValueF
                    .bind(this),
                this.updateValue = this
                    .updateValueF
                    .bind(this);
            else if ("f[]" == e) 
                this.set = this.setValue = this
                    .setValueArrayF
                    .bind(this),
                this.updateValue = this
                    .updateValueArrayF
                    .bind(this);
            else if ("3f[]" == e) 
                this.set = this.setValue = this
                    .setValueArray3F
                    .bind(this),
                this.updateValue = this
                    .updateValueArray3F
                    .bind(this);
            else if ("i" == e) 
                this.set = this.setValue = this
                    .setValueI
                    .bind(this),
                this.updateValue = this
                    .updateValueI
                    .bind(this);
            else if ("b" == e) 
                this.set = this.setValue = this
                    .setValueBool
                    .bind(this),
                this.updateValue = this
                    .updateValueBool
                    .bind(this);
            else if ("4f" == e) 
                this.set = this.setValue = this
                    .setValue4F
                    .bind(this),
                this.updateValue = this
                    .updateValue4F
                    .bind(this);
            else if ("3f" == e) 
                this.set = this.setValue = this
                    .setValue3F
                    .bind(this),
                this.updateValue = this
                    .updateValue3F
                    .bind(this);
            else if ("2f" == e) 
                this.set = this.setValue = this
                    .setValue2F
                    .bind(this),
                this.updateValue = this
                    .updateValue2F
                    .bind(this);
            else if ("t" == e) 
                this.set = this.setValue = this
                    .setValueT
                    .bind(this),
                this.updateValue = this
                    .updateValueT
                    .bind(this);
            else {
                if ("m4" != e) 
                    throw new Error("Unknown uniform type");
                this.set = this.setValue = this
                    .setValueM4
                    .bind(this),
                this.updateValue = this
                    .updateValueM4
                    .bind(this)
            }
            "object" == typeof n && n instanceof N
                ? (
                    this._port = n,
                    this._value = this._port.get(),
                    this._port.onValueChanged = this.updateFromPort.bind(this)
                )
                : this._value = n,
            this.setValue(this._value),
            this.needsUpdate = !0
        };
        J.prototype.getType = function () {
            return this._type
        },
        J.prototype.getName = function () {
            return this._name
        },
        J.prototype.getValue = function () {
            return this._value
        },
        J.prototype.resetLoc = function () {
            this._loc = -1,
            this.needsUpdate = !0
        },
        J.prototype.bindTextures = function () {
            return this._value
        },
        J.prototype.resetLoc = function () {
            this._loc = -1,
            this.needsUpdate = !0
        },
        J.prototype.bindTextures = function () {},
        J.prototype.getLoc = function () {
            return this._loc
        },
        J.prototype.updateFromPort = function () {
            this.setValue(this._port.get())
        },
        J.prototype.updateValueF = function () {
            -1 == this._loc
                ? this._loc = this
                    ._shader
                    .getCgl()
                    .gl
                    .getUniformLocation(this._shader.getProgram(), this._name)
                : this.needsUpdate = !1,
            this
                ._shader
                .getCgl()
                .gl
                .uniform1f(this._loc, this._value),
            H.profileUniformCount++
        },
        J.prototype.setValueF = function (t) {
            t != this._value && (this.needsUpdate = !0, this._value = t)
        },
        J.prototype.updateValueI = function () {
            -1 == this._loc
                ? this._loc = this
                    ._shader
                    .getCgl()
                    .gl
                    .getUniformLocation(this._shader.getProgram(), this._name)
                : this.needsUpdate = !1,
            this
                ._shader
                .getCgl()
                .gl
                .uniform1i(this._loc, this._value),
            H.UniformCount++
        },
        J.prototype.setValueI = function (t) {
            t != this._value && (this.needsUpdate = !0, this._value = t)
        },
        J.prototype.updateValueBool = function () {
            -1 == this._loc
                ? this._loc = this
                    ._shader
                    .getCgl()
                    .gl
                    .getUniformLocation(this._shader.getProgram(), this._name)
                : this.needsUpdate = !1,
            this
                ._shader
                .getCgl()
                .gl
                .uniform1i(
                    this._loc,
                    this._value
                        ? 1
                        : 0
                ),
            H.UniformCount++
        },
        J.prototype.setValueBool = function (t) {
            t != this._value && (this.needsUpdate = !0, this._value = t)
        },
        J.prototype.setValueArray3F = function (t) {
            this.needsUpdate = !0,
            this._value = t
        },
        J.prototype.updateValueArray3F = function () {
            -1 == this._loc
                ? this._loc = this
                    ._shader
                    .getCgl()
                    .gl
                    .getUniformLocation(this._shader.getProgram(), this._name)
                : this.needsUpdate = !1,
            this._value && (
                this._shader.getCgl().gl.uniform3fv(this._loc, this._value),
                H.UniformCount++
            )
        },
        J.prototype.setValueArrayF = function (t) {
            this.needsUpdate = !0,
            this._value = t
        },
        J.prototype.updateValueArrayF = function () {
            -1 == this._loc
                ? this._loc = this
                    ._shader
                    .getCgl()
                    .gl
                    .getUniformLocation(this._shader.getProgram(), this._name)
                : this.needsUpdate = !1,
            this._value && (
                this._shader.getCgl().gl.uniform1fv(this._loc, this._value),
                H.UniformCount++
            )
        },
        J.prototype.updateValue3F = function () {
            this._value && (
                -1 == this._loc && (
                    this._loc = this._shader.getCgl().gl.getUniformLocation(this._shader.getProgram(), this._name),
                    H.ShaderGetUniform++,
                    H.ShaderGetUniformName = this._name
                ),
                this._shader.getCgl().gl.uniform3f(this._loc, this._value[0], this._value[1], this._value[2]),
                this.needsUpdate = !1,
                H.UniformCount++
            )
        },
        J.prototype.setValue3F = function (t) {
            t && (
                this._oldValue
                    ? t[0] == this._oldValue[0] && t[1] == this._oldValue[1] && t[2] == this._oldValue[2] || (
                        this._oldValue[0] = t[0],
                        this._oldValue[1] = t[1],
                        this._oldValue[2] = t[2],
                        this.needsUpdate = !0
                    )
                    : (this._oldValue = [
                        t[0] - 1,
                        1,
                        2
                    ], this.needsUpdate = !0),
                this._value = t
            )
        },
        J.prototype.updateValue2F = function () {
            this._value && (
                -1 == this._loc && (
                    this._loc = this._shader.getCgl().gl.getUniformLocation(this._shader.getProgram(), this._name),
                    H.ShaderGetUniform++,
                    H.ShaderGetUniformName = this._name
                ),
                this._shader.getCgl().gl.uniform2f(this._loc, this._value[0], this._value[1]),
                this.needsUpdate = !1,
                H.UniformCount++
            )
        },
        J.prototype.setValue2F = function (t) {
            t && (
                this._oldValue
                    ? t[0] == this._oldValue[0] && t[1] == this._oldValue[1] || (
                        this._oldValue[0] = t[0],
                        this._oldValue[1] = t[1],
                        this.needsUpdate = !0
                    )
                    : (this._oldValue = [
                        t[0] - 1,
                        1
                    ], this.needsUpdate = !0),
                this._value = t
            )
        },
        J.prototype.updateValueT = function () {
            -1 == this._loc && (
                this._loc = this._shader.getCgl().gl.getUniformLocation(this._shader.getProgram(), this._name),
                H.ShaderGetUniform++,
                H.ShaderGetUniformName = this._name,
                -1 == this._loc && console.log("texture this._loc unknown!!")
            ),
            H.UniformCount++,
            this
                ._shader
                .getCgl()
                .gl
                .uniform1i(this._loc, this._value),
            this.needsUpdate = !1
        },
        J.prototype.setValueT = function (t) {
            this.needsUpdate = !0,
            this._value = t
        },
        J.prototype.updateValue4F = function () {
            -1 == this._loc && (
                this._loc = this._shader.getCgl().gl.getUniformLocation(this._shader.getProgram(), this._name),
                H.ShaderGetUniform++,
                H.ShaderGetUniformName = this._name
            ),
            this
                ._shader
                .getCgl()
                .gl
                .uniform4f(
                    this._loc,
                    this._value[0],
                    this._value[1],
                    this._value[2],
                    this._value[3]
                ),
            H.UniformCount++
        },
        J.prototype.setValue4F = function (t) {
            this.needsUpdate = !0,
            this._value = t
        },
        J.prototype.updateValueM4 = function () {
            -1 == this._loc && (
                this._loc = this._shader.getCgl().gl.getUniformLocation(this._shader.getProgram(), this._name),
                H.ShaderGetUniform++,
                H.ShaderGetUniformName = this._name
            ),
            this
                ._shader
                .getCgl()
                .gl
                .uniformMatrix4fv(this._loc, !1, this._value),
            H.UniformCount++
        },
        J.prototype.setValueM4 = function (t) {
            this.needsUpdate = !0,
            this._value = t
        };
        const $ = {
                MATH: {
                    DEG2RAD: Math.PI / 180,
                    RAD2DEG: 180 / Math.PI
                },
                SHADER: {
                    SHADERVAR_VERTEX_POSITION: "vPosition",
                    SHADERVAR_VERTEX_NUMBER: "attrVertIndex",
                    SHADERVAR_VERTEX_TEXCOORD: "attrTexCoord",
                    SHADERVAR_INSTANCE_MMATRIX: "instMat",
                    SHADERVAR_UNI_PROJMAT: "projMatrix",
                    SHADERVAR_UNI_VIEWMAT: "viewMatrix",
                    SHADERVAR_UNI_MODELMAT: "modelMatrix",
                    SHADERVAR_UNI_NORMALMAT: "normalMatrix",
                    SHADERVAR_UNI_INVVIEWMAT: "inverseViewMatrix",
                    SHADERVAR_UNI_VIEWPOS: "camPos"
                },
                BLEND_MODES: {
                    BLEND_NONE: 0,
                    BLEND_NORMAL: 1,
                    BLEND_ADD: 2,
                    BLEND_SUB: 3,
                    BLEND_MUL: 4
                }
            },
            tt = {
                lastMesh: null
            },
            et = function (t, e, i) {
                this._cgl = t,
                this._bufVertexAttrib = null,
                this._bufVerticesIndizes = this
                    ._cgl
                    .gl
                    .createBuffer(),
                this._attributes = [],
                this._attribLocs = {},
                this._geom = null,
                this._lastShader = null,
                this._numInstances = 0,
                this._glPrimitive = i,
                this._preWireframeGeom = null,
                this.addVertexNumbers = !1,
                this.feedBackAttributes = [],
                this.setGeom(e),
                this._feedBacks = [],
                this._feedBacksChanged = !1,
                this._transformFeedBackLoc = -1,
                this._lastAttrUpdate = 0,
                Object.defineProperty(this, "numInstances", {
                    get() {
                        return this._numInstances
                    },
                    set(t) {
                        this.setNumInstances(t)
                    }
                })
            };
        et.prototype.updateVertices = function (t) {
            this.setAttribute($.SHADER.SHADERVAR_VERTEX_POSITION, t.vertices, 3)
        },
        et.prototype.setAttributePointer = function (t, e, i, n) {
            for (var r = 0; r < this._attributes.length; r++) 
                this
                    ._attributes[r]
                    .name == t && (
                        this._attributes[r].pointer || (this._attributes[r].pointer = []),
                        this._attributes[r].pointer.push({
                        loc: -1,
                        name: e,
                        stride: i,
                        offset: n,
                        instanced: t == $.SHADER.SHADERVAR_INSTANCE_MMATRIX
                    })
                    )
            },
        et.prototype.getAttribute = function (t) {
            for (var e = 0; e < this._attributes.length; e++) 
                if (this._attributes[e].name == t) 
                    return this._attributes[e]
        },
        et.prototype.addAttribute = et.prototype.updateAttribute = et.prototype.setAttribute = function (
            t,
            e,
            i,
            n
        ) {
            var r = null,
                s = null,
                a = !1,
                o = 0,
                l = e.length / i;
            for (
                0 === l && console.warn(
                    "CGL_MESH: num items in attribute " + t + " is ZERO"
                ),
                "function" == typeof n && (s = n),
                "object" == typeof n && (n.cb && (s = n.cb), n.instanced && (a = n.instanced)),
                t == $.SHADER.SHADERVAR_INSTANCE_MMATRIX && (a = !0),
                e instanceof Float32Array
                    ? r = e
                    : (
                        r = new Float32Array(e),
                        H.profileNonTypedAttrib++,
                        H.profileNonTypedAttribNames = this._geom.name + " " + t
                    ),
                o = 0; o < this._attributes.length; o++
            ) 
                if (this._attributes[o].name == t) 
                    return this
                        ._attributes[o]
                        .numItems = l,
                    this
                        ._cgl
                        .gl
                        .bindBuffer(this._cgl.gl.ARRAY_BUFFER, this._attributes[o].buffer),
                    this
                        ._cgl
                        .gl
                        .bufferData(this._cgl.gl.ARRAY_BUFFER, r, this._cgl.gl.DYNAMIC_DRAW),
                    this._attributes[o];
        var h = this
                ._cgl
                .gl
                .createBuffer();
            this
                ._cgl
                .gl
                .bindBuffer(this._cgl.gl.ARRAY_BUFFER, h),
            this
                ._cgl
                .gl
                .bufferData(this._cgl.gl.ARRAY_BUFFER, r, this._cgl.gl.DYNAMIC_DRAW);
            var u = this._cgl.gl.FLOAT;
            n && n.type && (u = n.type);
            var c = {
                buffer: h,
                name: t,
                cb: s,
                itemSize: i,
                numItems: l,
                startItem: 0,
                instanced: a,
                type: u
            };
            return t == $.SHADER.SHADERVAR_VERTEX_POSITION && (this._bufVertexAttrib = c),
            this
                ._attributes
                .push(c),
            this._attribLocs = {},
            c
        },
        et.prototype.getAttributes = function () {
            return this._attributes
        },
        et.prototype.updateTexCoords = function (t) {
            if (t.texCoords && t.texCoords.length > 0) 
                this.setAttribute($.SHADER.SHADERVAR_VERTEX_TEXCOORD, t.texCoords, 2);
            else {
                var e = new Float32Array(Math.round(t.vertices.length / 3 * 2));
                this.setAttribute($.SHADER.SHADERVAR_VERTEX_TEXCOORD, e, 2)
            }
        },
        et.prototype._setVertexNumbers = function () {
            var t = this._geom.vertices.length / 3;
            if (!this._verticesNumbers || this._verticesNumbers.length != t) {
                this._verticesNumbers = new Float32Array(t);
                for (var e = 0; e < t; e++) 
                    this._verticesNumbers[e] = e;
                this.setAttribute(
                    $.SHADER.SHADERVAR_VERTEX_NUMBER,
                    this._verticesNumbers,
                    1,
                    (e, i, n) => {
                        n.uniformNumVertices || (
                            n.uniformNumVertices = new J(n, "f", "numVertices", t)
                        ),
                        n
                            .uniformNumVertices
                            .setValue(t)
                    }
                )
            }
        },
        et.prototype.setVertexIndices = function (t) {
            if (t.length > 0) {
                for (var e = 0; e < t.length; e++) 
                    if (t[e] >= this._geom.vertices.length / 3) 
                        return void console.warn("invalid index in " + this._geom.name);
            this
                    ._cgl
                    .gl
                    .bindBuffer(this._cgl.gl.ELEMENT_ARRAY_BUFFER, this._bufVerticesIndizes),
                t instanceof Uint16Array
                    ? this.vertIndicesTyped = t
                    : this.vertIndicesTyped = new Uint16Array(t),
                this
                    ._cgl
                    .gl
                    .bufferData(
                        this._cgl.gl.ELEMENT_ARRAY_BUFFER,
                        this.vertIndicesTyped,
                        this._cgl.gl.DYNAMIC_DRAW
                    ),
                this._bufVerticesIndizes.itemSize = 1,
                this._bufVerticesIndizes.numItems = t.length
            } else 
                this._bufVerticesIndizes.numItems = 0
        },
        et.prototype.setGeom = function (t) {
            this._geom = t,
            tt.lastMesh = null,
            H.profileMeshSetGeom++,
            this._disposeAttributes(),
            this.updateVertices(this._geom),
            this.setVertexIndices(this._geom.verticesIndices),
            this._geom.vertexNormals.length > 0 && this.setAttribute(
                "attrVertNormal",
                this._geom.vertexNormals,
                3
            ),
            this.updateTexCoords(this._geom),
            this
                ._geom
                .hasOwnProperty("tangents") && this._geom.tangents && this._geom.tangents.length > 0 && this.setAttribute(
                    "attrTangent",
                    this._geom.tangents,
                    3
                ),
            this
                ._geom
                .hasOwnProperty("biTangents") && this._geom.biTangents && this._geom.biTangents.length > 0 && this.setAttribute(
                    "attrBiTangent",
                    this._geom.biTangents,
                    3
                ),
            this._geom.vertexColors.length > 0 && this.setAttribute(
                "attrVertColor",
                this._geom.vertexColors,
                4
            ),
            this.addVertexNumbers && this._setVertexNumbers();
            var e = this
                ._geom
                .getAttributes();
            for (var i in e) 
                this.setAttribute(i, e[i].data, e[i].itemSize)
        },
        et.prototype._preBind = function (t) {
            for (var e = 0; e < this._attributes.length; e++) 
                this
                    ._attributes[e]
                    .cb && this
                    ._attributes[e]
                    .cb(this._attributes[e], this._geom, t)
            },
        et.prototype._bind = function (t) {
            t != this._lastShader && this.unBind();
            var e = [];
            this._attribLocs[t.id]
                ? e = this._attribLocs[t.id]
                : this._attribLocs[t.id] = e,
            this._lastShader = t;
            var i = 0;
            if (t.lastCompile > this._lastAttrUpdate || e.length != this._attributes.length) 
                for (
                    this._lastAttrUpdate = t.lastCompile,
                    i = 0;
                    i < this._attributes.length;
                    i++
                ) 
                    e[i] = -1;
        for (i = 0; i < this._attributes.length; i++) {
                var n = this._attributes[i];
                if (-1 == e[i] && n._attrLocationLastShaderTime != t.lastCompile && (
                    n._attrLocationLastShaderTime = t.lastCompile,
                    e[i] = this._cgl.glGetAttribLocation(t.getProgram(), n.name),
                    H.profileAttrLoc++
                ), -1 != e[i]) 
                    if (
                        this._cgl.gl.enableVertexAttribArray(e[i]),
                        this._cgl.gl.bindBuffer(this._cgl.gl.ARRAY_BUFFER, n.buffer),
                        n.instanced
                    ) 
                        if (n.itemSize <= 4) 
                            n.itemSize && 0 != n.itemSize || console.log(
                                "instanced attrib itemsize error",
                                this._geom.name,
                                n
                            ),
                            this
                                ._cgl
                                .gl
                                .vertexAttribPointer(e[i], n.itemSize, n.type, !1, 4 * n.itemSize, 0),
                            this
                                ._cgl
                                .gl
                                .vertexAttribDivisor(e[i], 1);
                        else if (16 == n.itemSize) {
                            const t = 64;
                            this
                                ._cgl
                                .gl
                                .vertexAttribPointer(e[i], 4, n.type, !1, t, 0),
                            this
                                ._cgl
                                .gl
                                .enableVertexAttribArray(e[i] + 1),
                            this
                                ._cgl
                                .gl
                                .vertexAttribPointer(e[i] + 1, 4, n.type, !1, t, 16),
                            this
                                ._cgl
                                .gl
                                .enableVertexAttribArray(e[i] + 2),
                            this
                                ._cgl
                                .gl
                                .vertexAttribPointer(e[i] + 2, 4, n.type, !1, t, 32),
                            this
                                ._cgl
                                .gl
                                .enableVertexAttribArray(e[i] + 3),
                            this
                                ._cgl
                                .gl
                                .vertexAttribPointer(e[i] + 3, 4, n.type, !1, t, 48),
                            this
                                ._cgl
                                .gl
                                .vertexAttribDivisor(e[i], 1),
                            this
                                ._cgl
                                .gl
                                .vertexAttribDivisor(e[i] + 1, 1),
                            this
                                ._cgl
                                .gl
                                .vertexAttribDivisor(e[i] + 2, 1),
                            this
                                ._cgl
                                .gl
                                .vertexAttribDivisor(e[i] + 3, 1)
                        }
                    else 
                    console.log("unknown instance attrib size", n.name);
                else {
                    if (
                        n.itemSize && 0 != n.itemSize || console.log("attrib itemsize error", this._geom.name, n),
                        this._cgl.gl.vertexAttribPointer(e[i], n.itemSize, n.type, !1, 4 * n.itemSize, 0),
                        n.pointer
                    ) 
                        for (var r = 0; r < n.pointer.length; r++) {
                            var s = n.pointer[r];
                            -1 == s.loc && (s.loc = this._cgl.glGetAttribLocation(t.getProgram(), s.name)),
                            H.profileAttrLoc++,
                            this
                                ._cgl
                                .gl
                                .enableVertexAttribArray(s.loc),
                            this
                                ._cgl
                                .gl
                                .vertexAttribPointer(s.loc, n.itemSize, n.type, !1, s.stride, s.offset)
                        }
                    this.bindFeedback(n)
                }
            }
            0 !== this._bufVerticesIndizes.numItems && this
                ._cgl
                .gl
                .bindBuffer(this._cgl.gl.ELEMENT_ARRAY_BUFFER, this._bufVerticesIndizes)
        },
        et.prototype.unBind = function () {
            var t = this._lastShader;
            if (this._lastShader = null, t) {
                var e = [];
                this._attribLocs[t.id]
                    ? e = this._attribLocs[t.id]
                    : this._attribLocs[t.id] = e,
                tt.lastMesh = null;
                for (var i = 0; i < this._attributes.length; i++) 
                    this
                        ._attributes[i]
                        .instanced && (
                            this._attributes[i].itemSize <= 4
                                ? (
                                    -1 != e[i] && this._cgl.gl.vertexAttribDivisor(e[i], 0),
                                    e[i] >= 0 && this._cgl.gl.disableVertexAttribArray(e[i])
                                )
                                : (
                                    this._cgl.gl.vertexAttribDivisor(e[i], 0),
                                    this._cgl.gl.vertexAttribDivisor(
                                        e[i] + 1,
                                        0
                                    ),
                                    this._cgl.gl.vertexAttribDivisor(e[i] + 2, 0),
                                    this._cgl.gl.vertexAttribDivisor(
                                        e[i] + 3,
                                        0
                                    ),
                                    this._cgl.gl.disableVertexAttribArray(e[i] + 1),
                                    this._cgl.gl.disableVertexAttribArray(
                                        e[i] + 2
                                    ),
                                    this._cgl.gl.disableVertexAttribArray(e[i] + 3)
                                )
                        ),
                    -1 != e[i] && this
                        ._cgl
                        .gl
                        .disableVertexAttribArray(e[i])
                }
        },
        et.prototype.meshChanged = function () {
            return this._cgl.lastMesh && this._cgl.lastMesh != this
        },
        et.prototype.printDebug = function (t) {
            for (console.log("--attributes"), i = 0; i < this._attributes.length; i++) 
                console.log("attribute " + i + " " + this._attributes[i].name)
        },
        et.prototype.setNumVertices = function (t) {
            this._bufVertexAttrib.numItems = t
        },
        et.prototype.render = function (t) {
            if (t) {
                t.wireframe || this
                    ._geom
                    .isIndexed() || !this._preWireframeGeom || this.setGeom(this._preWireframeGeom),
                t.wireframe && this
                    ._geom
                    .isIndexed() && (
                        this._preWireframeGeom = this._geom,
                        this._geom = this._geom.copy(),
                        this._geom.unIndex(),
                        this._geom.calcBarycentric(),
                        this.setGeom(this._geom),
                        this.setAttribute("attrBarycentric", this._geom.barycentrics, 3)
                    );
                var e = !1;
                tt.lastMesh != this && (tt.lastMesh && tt.lastMesh.unBind(), e = !0),
                e && this._preBind(t),
                t.bind(),
                t.bindTextures && t.bindTextures(),
                this._bind(t),
                this.addVertexNumbers && this._setVertexNumbers(),
                tt.lastMesh = this;
                var i = this._cgl.gl.TRIANGLES;
                void 0 !== this._glPrimitive && (i = this._glPrimitive),
                null !== t.glPrimitive && (i = t.glPrimitive),
                this.hasFeedbacks()
                    ? this.drawFeedbacks(t, i)
                    : 0 === this._bufVerticesIndizes.numItems
                        ? 0 === this._numInstances
                            ? this
                                ._cgl
                                .gl
                                .drawArrays(
                                    i,
                                    this._bufVertexAttrib.startItem,
                                    this._bufVertexAttrib.numItems - this._bufVertexAttrib.startItem
                                )
                            : this
                                ._cgl
                                .gl
                                .drawArraysInstanced(
                                    i,
                                    this._bufVertexAttrib.startItem,
                                    this._bufVertexAttrib.numItems,
                                    this._numInstances
                                )
                        : 0 === this._numInstances
                            ? this
                                ._cgl
                                .gl
                                .drawElements(
                                    i,
                                    this._bufVerticesIndizes.numItems,
                                    this._cgl.gl.UNSIGNED_SHORT,
                                    0
                                )
                            : this
                                ._cgl
                                .gl
                                .drawElementsInstanced(
                                    i,
                                    this._bufVerticesIndizes.numItems,
                                    this._cgl.gl.UNSIGNED_SHORT,
                                    0,
                                    this._numInstances
                                )
            }
        },
        et.prototype.setNumInstances = function (t) {
            if (this._numInstances = t, t > 0) {
                for (var e = new Float32Array(t), i = 0; i < t; i++) 
                    e[i] = i;
                this.setAttribute("instanceIndex", e, 1, {
                    instanced: !0
                })
            }
        },
        et.prototype._disposeAttributes = function () {
            if (this._attributes) {
                for (var t = 0; t < this._attributes.length; t++) 
                    this
                        ._attributes[t]
                        .buffer && (
                            this._cgl.gl.deleteBuffer(this._attributes[t].buffer),
                            this._attributes[t].buffer = null
                        );
                this._attributes.length = 0
            }
        },
        et.prototype.dispose = function () {
            this._bufVertexAttrib && this._bufVertexAttrib.buffer && this
                ._cgl
                .gl
                .deleteBuffer(this._bufVertexAttrib.buffer),
            this._bufVerticesIndizes && this
                ._cgl
                .gl
                .deleteBuffer(this._bufVerticesIndizes),
            this._disposeAttributes()
        },
        function (t) {
            t.prototype.hasFeedbacks = function () {
                return this._feedBacks.length > 0
            },
            t.prototype.removeFeedbacks = function (t) {
                this._feedbacks && (this._feedbacks.length = 0, this._feedBacksChanged = !0)
            },
            t.prototype.setAttributeFeedback = function () {},
            t.prototype.setFeedback = function (t, e, i) {
                var n = {
                        nameOut: e
                    },
                    r = !1;
                this.unBindFeedbacks();
                for (var s = 0; s < this._feedBacks.length; s++) 
                    this
                        ._feedBacks[s]
                        .nameOut == e && (n = this._feedBacks[s], r = !0);
                return r || (this._feedBacksChanged = !0),
                n.initialArr = i,
                n.attrib = t,
                n.outBuffer && this
                    ._cgl
                    .gl
                    .deleteBuffer(n.outBuffer),
                n.outBuffer = this
                    ._cgl
                    .gl
                    .createBuffer(),
                this
                    ._cgl
                    .gl
                    .bindBuffer(this._cgl.gl.ARRAY_BUFFER, n.outBuffer),
                this
                    ._cgl
                    .gl
                    .bufferData(this._cgl.gl.ARRAY_BUFFER, n.initialArr, this._cgl.gl.STATIC_DRAW),
                this
                    ._cgl
                    .gl
                    .bindBuffer(this._cgl.gl.ARRAY_BUFFER, n.attrib.buffer),
                this
                    ._cgl
                    .gl
                    .bufferData(this._cgl.gl.ARRAY_BUFFER, n.initialArr, this._cgl.gl.STATIC_DRAW),
                r || this
                    ._feedBacks
                    .push(n),
                n
            },
            t.prototype.bindFeedback = function (t) {
                if (this._feedBacks && 0 !== this._feedBacks.length) {
                    -1 == this._transformFeedBackLoc && (
                        this._transformFeedBackLoc = this._cgl.gl.createTransformFeedback()
                    ),
                    this
                        ._cgl
                        .gl
                        .bindTransformFeedback(
                            this._cgl.gl.TRANSFORM_FEEDBACK,
                            this._transformFeedBackLoc
                        );
                    for (var e = 0; e < this._feedBacks.length; e++) {
                        var i = this._feedBacks[e];
                        i.attrib == t && this
                            ._cgl
                            .gl
                            .bindBufferBase(this._cgl.gl.TRANSFORM_FEEDBACK_BUFFER, e, i.outBuffer)
                    }
                }
            },
            t.prototype.drawFeedbacks = function (t, e) {
                var i = 0;
                if (this._feedBacksChanged) {
                    var n = [];
                    for (
                        this._cgl.gl.bindTransformFeedback(this._cgl.gl.TRANSFORM_FEEDBACK, this._transformFeedBackLoc),
                        i = 0;
                        i < this._feedBacks.length;
                        i++
                    ) 
                        n.push(this._feedBacks[i].nameOut);
                    return t.setFeedbackNames(n),
                    console.log("feedbacknames", n),
                    t.compile(),
                    this._feedBacksChanged = !1,
                    this
                        ._cgl
                        .gl
                        .bindTransformFeedback(this._cgl.gl.TRANSFORM_FEEDBACK, null),
                    void console.log("changed finished")
                }
                this
                    ._cgl
                    .gl
                    .beginTransformFeedback(this.glPrimitive),
                this
                    ._cgl
                    .gl
                    .drawArrays(e, 0, this._feedBacks[0].attrib.numItems),
                this
                    ._cgl
                    .gl
                    .endTransformFeedback(),
                this.unBindFeedbacks(),
                this.feedBacksSwapBuffers()
            },
            t.prototype.unBindFeedbacks = function () {
                for (i = 0; i < this._feedBacks.length; i++) 
                    this
                        ._cgl
                        .gl
                        .bindBufferBase(this._cgl.gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
                this
                    ._cgl
                    .gl
                    .bindTransformFeedback(this._cgl.gl.TRANSFORM_FEEDBACK, null)
            },
            t.prototype.feedBacksSwapBuffers = function () {
                for (var t = 0; t < this._feedBacks.length; t++) {
                    var e = this
                        ._feedBacks[t]
                        .attrib
                        .buffer;
                    this
                        ._feedBacks[t]
                        .attrib
                        .buffer = this
                        ._feedBacks[t]
                        .outBuffer,
                    this
                        ._feedBacks[t]
                        .outBuffer = e
                }
            }
        }(et);
        const it = {
                getSimpleRect: function (t, e) {
                    var i = new Q(e);
                    return i.vertices = [
                        1,
                        1,
                        0,
                        -1,
                        1,
                        0,
                        1,
                        -1,
                        0,
                        -1,
                        -1,
                        0
                    ],
                    i.texCoords = [
                        1,
                        1,
                        0,
                        1,
                        1,
                        0,
                        0,
                        0
                    ],
                    i.verticesIndices = [
                        0,
                        1,
                        2,
                        2,
                        1,
                        3
                    ],
                    new et(t, i)
                }
            },
            nt = function (t, e) {
                this._cgl = t,
                t.TextureEffectMesh || this.createMesh(),
                this._textureSource = null,
                this._textureTarget = null,
                this._frameBuf = this
                    ._cgl
                    .gl
                    .createFramebuffer(),
                this._frameBuf2 = this
                    ._cgl
                    .gl
                    .createFramebuffer(),
                this._renderbuffer = this
                    ._cgl
                    .gl
                    .createRenderbuffer(),
                this._renderbuffer2 = this
                    ._cgl
                    .gl
                    .createRenderbuffer(),
                this.switched = !1,
                this.depth = !1
            };
        nt.prototype.setSourceTexture = function (t) {
            t.textureType == q.TYPE_FLOAT && this
                ._cgl
                .gl
                .getExtension("EXT_color_buffer_float"),
            null === t
                ? (this._textureSource = new q(this._cgl), this._textureSource.setSize(16, 16))
                : this._textureSource = t,
            this
                ._textureSource
                .compareSettings(this._textureTarget) || (
                    this._textureTarget && this._textureTarget.delete(),
                    this._textureTarget = this._textureSource.clone(),
                    H.profileEffectBuffercreate++,
                    this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuf),
                    this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, this._renderbuffer),
                    this.depth && this._cgl.gl.renderbufferStorage(
                        this._cgl.gl.RENDERBUFFER,
                        this._cgl.gl.DEPTH_COMPONENT16,
                        this._textureSource.width,
                        this._textureSource.height
                    ),
                    this._cgl.gl.framebufferTexture2D(
                    this._cgl.gl.FRAMEBUFFER,
                    this._cgl.gl.COLOR_ATTACHMENT0,
                    this._cgl.gl.TEXTURE_2D,
                    this._textureTarget.tex,
                    0
                ),
                    this.depth && this._cgl.gl.framebufferRenderbuffer(
                    this._cgl.gl.FRAMEBUFFER,
                    this._cgl.gl.DEPTH_ATTACHMENT,
                    this._cgl.gl.RENDERBUFFER,
                    this._renderbuffer
                ),
                    this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null),
                    this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, null),
                    this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null),
                    this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuf2),
                    this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, this._renderbuffer2),
                    this.depth && this._cgl.gl.renderbufferStorage(
                    this._cgl.gl.RENDERBUFFER,
                    this._cgl.gl.DEPTH_COMPONENT16,
                    this._textureSource.width,
                    this._textureSource.height
                ),
                    this._cgl.gl.framebufferTexture2D(
                    this._cgl.gl.FRAMEBUFFER,
                    this._cgl.gl.COLOR_ATTACHMENT0,
                    this._cgl.gl.TEXTURE_2D,
                    this._textureSource.tex,
                    0
                ),
                    this.depth && this._cgl.gl.framebufferRenderbuffer(
                    this._cgl.gl.FRAMEBUFFER,
                    this._cgl.gl.DEPTH_ATTACHMENT,
                    this._cgl.gl.RENDERBUFFER,
                    this._renderbuffer2
                ),
                    this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null),
                    this._cgl.gl.bindRenderbuffer(this._cgl.gl.RENDERBUFFER, null),
                    this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, null)
                )
        },
        nt.prototype.startEffect = function () {
            this._textureTarget
                ? (
                    this.switched = !1,
                    this._cgl.pushDepthTest(!1),
                    this._cgl.pushModelMatrix(),
                    this._cgl.pushPMatrix(),
                    this._cgl.gl.viewport(
                        0,
                        0,
                        this.getCurrentTargetTexture().width,
                        this.getCurrentTargetTexture().height
                    ),
                    mat4.perspective(
                        this._cgl.pMatrix,
                        45,
                        this.getCurrentTargetTexture().width / this.getCurrentTargetTexture().height,
                        .1,
                        1100
                    ),
                    this._cgl.pushPMatrix(),
                    mat4.identity(this._cgl.pMatrix),
                    this._cgl.pushViewMatrix(),
                    mat4.identity(this._cgl.vMatrix),
                    this._cgl.pushModelMatrix(),
                    mat4.identity(this._cgl.mvMatrix)
                )
                : console.log("effect has no target")
        },
        nt.prototype.endEffect = function () {
            this
                ._cgl
                .popDepthTest(!1),
            this
                ._cgl
                .popModelMatrix(),
            this
                ._cgl
                .popPMatrix(),
            this
                ._cgl
                .popModelMatrix(),
            this
                ._cgl
                .popViewMatrix(),
            this
                ._cgl
                .popPMatrix(),
            this
                ._cgl
                .resetViewPort()
        },
        nt.prototype.bind = function () {
            null !== this._textureSource
                ? this.switched
                    ? (
                        this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuf2),
                        this._cgl.pushGlFrameBuffer(this._frameBuf2)
                    )
                    : (
                        this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._frameBuf),
                        this._cgl.pushGlFrameBuffer(this._frameBuf)
                    )
                : console.log("no base texture set!")
        },
        nt.prototype.finish = function () {
            null !== this._textureSource
                ? (
                    this._cgl.TextureEffectMesh.render(this._cgl.getShader()),
                    this._cgl.gl.bindFramebuffer(this._cgl.gl.FRAMEBUFFER, this._cgl.popGlFrameBuffer()),
                    this._textureTarget.filter == q.FILTER_MIPMAP && (
                        this.switched
                            ? (
                                this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, this._textureSource.tex),
                                this._textureSource.updateMipMap()
                            )
                            : (
                                this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, this._textureTarget.tex),
                                this._textureTarget.updateMipMap()
                            ),
                        this._cgl.gl.bindTexture(this._cgl.gl.TEXTURE_2D, null)
                    ),
                    this.switched = !this.switched
                )
                : console.log("no base texture set!")
        },
        nt.prototype.getCurrentTargetTexture = function () {
            return this.switched
                ? this._textureSource
                : this._textureTarget
        },
        nt.prototype.getCurrentSourceTexture = function () {
            return this.switched
                ? this._textureTarget
                : this._textureSource
        },
        nt.prototype.delete = function () {
            this._textureTarget && this
                ._textureTarget
                .delete(),
            this._textureSource && this
                ._textureSource
                .delete(),
            this
                ._cgl
                .gl
                .deleteRenderbuffer(this._renderbuffer),
            this
                ._cgl
                .gl
                .deleteFramebuffer(this._frameBuf)
        },
        nt.prototype.createMesh = function () {
            this._cgl.TextureEffectMesh = it.getSimpleRect(this._cgl, "textureEffect rect")
        },
        nt.checkOpNotInTextureEffect = function (t) {
            return t.uiAttribs.error && !t.patch.cgl.currentTextureEffect
                ? (t.uiAttr({error: null}), !0)
                : !t.patch.cgl.currentTextureEffect || (
                    t.patch.cgl.currentTextureEffect && !t.uiAttribs.error
                        ? (
                            t.uiAttr({
                                error: "This op can not be a child of a ImageCompose/texture effect! imagecompose shou" +
                                        "ld only have textureeffect childs."
                            }),
                            !1
                        )
                        : !t.patch.cgl.currentTextureEffect
                )
        },
        nt.checkOpInEffect = function (t) {
            return t.patch.cgl.currentTextureEffect && t.uiAttribs.error
                ? (t.uiAttr({error: null}), !0)
                : !!t.patch.cgl.currentTextureEffect || (
                    t.patch.cgl.currentTextureEffect || t.uiAttribs.error
                        ? !!t.patch.cgl.currentTextureEffect
                        : (
                            t.uiAttr({
                                error: 'This op must be a child of a texture effect! More infos <a href="https://docs.' +
                                        'cables.gl/image_composition/image_composition.html" target="_blank">here</a>.'
                            }),
                            !1
                        )
                )
        },
        nt.getBlendCode = function () {
            return "".endl() + "vec3 _blend(vec3 base,vec3 blend)".endl() + "{".endl() + ( " " +
                "  vec3 colNew=blend;".endl() + "   #ifdef BM_MULTIPLY".endl() + ( "       colNew" +
                "=base*blend;".endl() + "   #endif".endl() + "   #ifdef BM_MULTIPLY_INV".endl() +
                "       colNew=base* vec3(1.0)-blend;".endl() + "   #endif".endl() + ( "   #ifdef" +
                " BM_AVERAGE".endl() + "       colNew=((base + blend) / 2.0);".endl() + ( "   #en" +
                "dif".endl() + "   #ifdef BM_ADD".endl() + ( "       colNew=min(base + blend, vec" +
                "3(1.0));".endl() + "   #endif".endl() + "   #ifdef BM_SUBSTRACT".endl() + ( "   " +
                "    colNew=max(base + blend - vec3(1.0), vec3(0.0));".endl() + "   #endif".endl() +
                "   #ifdef BM_DIFFERENCE".endl() + "       colNew=abs(base - blend);".endl() +
                "   #endif".endl() + "   #ifdef BM_NEGATION".endl() + ( "       colNew=(vec3(1.0)" +
                " - abs(vec3(1.0) - base - blend));".endl() + "   #endif".endl() + ( "   #ifdef B" +
                "M_EXCLUSION".endl() + "       colNew=(base + blend - 2.0 * base * blend);".endl() +
                "   #endif".endl() + "   #ifdef BM_LIGHTEN".endl() + ( "       colNew=max(blend, " +
                "base);".endl() + "   #endif".endl() + "   #ifdef BM_DARKEN".endl() + ( "       c" +
                "olNew=min(blend, base);".endl() + "   #endif".endl() +
                "   #ifdef BM_OVERLAY".endl() + ( "      #define BlendOverlayf(base, blend)  (bas" +
                "e < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)))".endl() +
                (
                "      colNew=vec3(BlendOverlayf(base.r, blend.r),BlendOverlayf(base.g, blend.g" +
                "),BlendOverlayf(base.b, blend.b));"
            ).endl() + "   #endif".endl() + "   #ifdef BM_SCREEN".endl() + ( "      #define B" +
                "lendScreenf(base, blend)       (1.0 - ((1.0 - base) * (1.0 - blend)))".endl() +
                (
                "      colNew=vec3(BlendScreenf(base.r, blend.r),BlendScreenf(base.g, blend.g)," +
                "BlendScreenf(base.b, blend.b));"
            ).endl() + "   #endif".endl() + "   #ifdef BM_SOFTLIGHT".endl() + ( "      #defin" +
                "e BlendSoftLightf(base, blend)    ((blend < 0.5) ? (2.0 * base * blend + base " +
                "* base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base" +
                " * (1.0 - blend)))"
            ).endl() + ( "      colNew=vec3(BlendSoftLightf(base.r, blend.r),BlendSoftLightf(" +
                "base.g, blend.g),BlendSoftLightf(base.b, blend.b));".endl() + "   #endif".endl() +
                "   #ifdef BM_HARDLIGHT".endl() + ( "      #define BlendOverlayf(base, blend)  (b" +
                "ase < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)))"
            ).endl() + ( "      colNew=vec3(BlendOverlayf(base.r, blend.r),BlendOverlayf(base" +
                ".g, blend.g),BlendOverlayf(base.b, blend.b));".endl() + "   #endif".endl() + "   #ifdef BM_COLORDODGE".endl() +
                (
                "      #define BlendColorDodgef(base, blend)   ((blend == 1.0) ? blend : min(ba" +
                "se / (1.0 - blend), 1.0))"
            ).endl() + ( "      colNew=vec3(BlendColorDodgef(base.r, blend.r),BlendColorDodge" +
                "f(base.g, blend.g),BlendColorDodgef(base.b, blend.b));".endl() + "   #endif".endl() +
                "   #ifdef BM_COLORBURN".endl() + ( "      #define BlendColorBurnf(base, blend)  " +
                "  ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0))".endl() +
                (
                "      colNew=vec3(BlendColorBurnf(base.r, blend.r),BlendColorBurnf(base.g, ble" +
                "nd.g),BlendColorBurnf(base.b, blend.b));"
            ).endl() + "   #endif".endl() + "   return colNew;".endl() + "}".endl() + ( "vec4" +
                " cgl_blend(vec4 oldColor,vec4 newColor,float amount)".endl() + "{".endl() + ( " " +
                "  vec4 col=vec4( _blend(oldColor.rgb,newColor.rgb) ,1.0);".endl() + ( "   col=ve" +
                "c4( mix( col.rgb, oldColor.rgb ,1.0-oldColor.a*amount),1.0);".endl() + ( "   ret" +
                "urn col;".endl() + "}"
        },
        nt.onChangeBlendSelect = function (t, e) {
            "normal" == e
                ? t.define("BM_NORMAL")
                : t.removeDefine("BM_NORMAL"),
            "multiply" == e
                ? t.define("BM_MULTIPLY")
                : t.removeDefine("BM_MULTIPLY"),
            "multiply invert" == e
                ? t.define("BM_MULTIPLY_INV")
                : t.removeDefine("BM_MULTIPLY_INV"),
            "average" == e
                ? t.define("BM_AVERAGE")
                : t.removeDefine("BM_AVERAGE"),
            "add" == e
                ? t.define("BM_ADD")
                : t.removeDefine("BM_ADD"),
            "substract" == e
                ? t.define("BM_SUBSTRACT")
                : t.removeDefine("BM_SUBSTRACT"),
            "difference" == e
                ? t.define("BM_DIFFERENCE")
                : t.removeDefine("BM_DIFFERENCE"),
            "negation" == e
                ? t.define("BM_NEGATION")
                : t.removeDefine("BM_NEGATION"),
            "exclusion" == e
                ? t.define("BM_EXCLUSION")
                : t.removeDefine("BM_EXCLUSION"),
            "lighten" == e
                ? t.define("BM_LIGHTEN")
                : t.removeDefine("BM_LIGHTEN"),
            "darken" == e
                ? t.define("BM_DARKEN")
                : t.removeDefine("BM_DARKEN"),
            "overlay" == e
                ? t.define("BM_OVERLAY")
                : t.removeDefine("BM_OVERLAY"),
            "screen" == e
                ? t.define("BM_SCREEN")
                : t.removeDefine("BM_SCREEN"),
            "softlight" == e
                ? t.define("BM_SOFTLIGHT")
                : t.removeDefine("BM_SOFTLIGHT"),
            "hardlight" == e
                ? t.define("BM_HARDLIGHT")
                : t.removeDefine("BM_HARDLIGHT"),
            "color dodge" == e
                ? t.define("BM_COLORDODGE")
                : t.removeDefine("BM_COLORDODGE"),
            "color burn" == e
                ? t.define("BM_COLORBURN")
                : t.removeDefine("BM_COLORBURN")
        },
        nt.AddBlendSelect = function (t, e) {
            return t.inValueSelect(e, [
                "normal",
                "lighten",
                "darken",
                "multiply",
                "multiply invert",
                "average",
                "add",
                "substract",
                "difference",
                "negation",
                "exclusion",
                "overlay",
                "screen",
                "color dodge",
                "color burn",
                "softlight",
                "hardlight"
            ], "normal")
        },
        nt.setupBlending = function (t, e, i, n) {
            t.setPortGroup("Blending", [i, n]),
            i.onChange = function () {
                nt.onChangeBlendSelect(e, i.get());
                var n = i.get();
                "normal" == n
                    ? n = null
                    : "multiply" == n
                        ? n = "mul"
                        : "multiply invert" == n
                            ? n = "mulinv"
                            : "lighten" == n
                                ? n = "light"
                                : "darken" == n
                                    ? n = "darken"
                                    : "average" == n
                                        ? n = "avg"
                                        : "substract" == n
                                            ? n = "sub"
                                            : "difference" == n
                                                ? n = "diff"
                                                : "negation" == n
                                                    ? n = "neg"
                                                    : "negation" == n
                                                        ? n = "neg"
                                                        : "negation" == n
                                                            ? n = "neg"
                                                            : "exclusion" == n
                                                                ? n = "exc"
                                                                : "overlay" == n
                                                                    ? n = "ovl"
                                                                    : "color dodge" == n
                                                                        ? n = "dodge"
                                                                        : "color burn" == n
                                                                            ? n = "burn"
                                                                            : "softlight" == n
                                                                                ? n = "soft"
                                                                                : "hardlight" == n && (n = "hard"),
                t.setUiAttrib({extendTitle: n})
            }
        };
        const rt = {
                "CGL.BLENDMODES": function () {
                    this.name = "blendmodes",
                    this.srcHeadFrag = nt.getBlendCode()
                },
                "CGL.RANDOM_OLD": function () {
                    this.name = "randomNumber",
                    this.srcHeadFrag = "".endl() + "float cgl_random(vec2 co)".endl() + "{".endl() +
                            "    return fract(sin(dot(co.xy ,vec2(12.9898,4.1414))) * 432758.5453);".endl() +
                            "}".endl() + "vec3 cgl_random3(vec2 co)".endl() + "{".endl() + ( "    return vec3" +
                        "( cgl_random(co),cgl_random(co+0.5711),cgl_random(co+1.5711));".endl() + "}"
                },
                "CGL.RANDOM_LOW": function () {
                    this.name = "randomNumber",
                    this.srcHeadFrag = "".endl() + "float cgl_random(vec2 co)".endl() + "{".endl() +
                            "    return fract(sin(dot(co.xy ,vec2(12.9898,4.1414))) * 358.5453);".endl() +
                            "}".endl() + "vec3 cgl_random3(vec2 co)".endl() + "{".endl() + ( "    return vec3" +
                        "( cgl_random(co),cgl_random(co+0.5711),cgl_random(co+1.5711));".endl() + "}"
                },
                "CGL.RANDOM_TEX": function () {
                    this.name = "randomNumbertex",
                    this.srcHeadFrag = "".endl() + "UNI sampler2D CGLRNDTEX;".endl() + ( "float cgl_r" +
                        "andom(vec2 co)".endl() + "{".endl() + ( "    return texture(CGLRNDTEX,co*5711.0)" +
                        ".r;".endl() + "}".endl() + "vec3 cgl_random3(vec2 co)".endl() + "{".endl() + "    return texture(CGLRNDTEX,co*5711.0).rgb;".endl() +
                        "}",
                    this.initUniforms = function (t) {
                        return [new J(t, "t", "CGLRNDTEX", 7)]
                    },
                    this.onBind = function (t, e) {
                        q.getRandomTexture(t),
                        t.setTexture(7, q.getRandomTexture(t).tex)
                    }
                }
            },
            st = function () {
                return window
                    .performance
                    .now()
            },
            at = function () {
                return st()
            },
            ot = function () {
                this._timeStart = st(),
                this._timeOffset = 0,
                this._currentTime = 0,
                this._lastTime = 0,
                this._paused = !0,
                this._delay = 0,
                this._eventsPaused = !1,
                this.overwriteTime = -1,
                this.cbPlayPause = [],
                this.cbTimeChange = []
            };
        ot.prototype._getTime = function () {
            return this._lastTime = (st() - this._timeStart) / 1e3,
            this._lastTime + this._timeOffset
        },
        ot.prototype._eventPlayPause = function () {
            if (!this._eventsPaused) 
                for (var t in this.cbPlayPause) 
                    this.cbPlayPause[t]()
        },
        ot.prototype._eventTimeChange = function () {
            if (!this._eventsPaused) 
                for (var t in this.cbTimeChange) 
                    this.cbTimeChange[t]()
        },
        ot.prototype.setDelay = function (t) {
            this._delay = t,
            this._eventTimeChange()
        },
        ot.prototype.isPlaying = function () {
            return !this._paused
        },
        ot.prototype.update = function () {
            if (!this._paused) 
                return this._currentTime = this._getTime(),
                this._currentTime
        },
        ot.prototype.getMillis = function () {
            return 1e3 * this.get()
        },
        ot.prototype.get = ot.prototype.getTime = function () {
            return this.overwriteTime >= 0
                ? this.overwriteTime - this._delay
                : this._currentTime - this._delay
        },
        ot.prototype.togglePlay = function () {
            this._paused
                ? this.play()
                : this.pause()
        },
        ot.prototype.setTime = function (t) {
            t < 0 && (t = 0),
            this._timeStart = st(),
            this._timeOffset = t,
            this._currentTime = t,
            this._eventTimeChange()
        },
        ot.prototype.setOffset = function (t) {
            this._currentTime + t < 0
                ? (this._timeStart = st(), this._timeOffset = 0, this._currentTime = 0)
                : (
                    this._timeOffset += t,
                    this._currentTime = this._lastTime + this._timeOffset
                ),
            this._eventTimeChange()
        },
        ot.prototype.play = function () {
            this._timeStart = st(),
            this._paused = !1,
            this._eventPlayPause()
        },
        ot.prototype.pause = function () {
            this._timeOffset = this._currentTime,
            this._paused = !0,
            this._eventPlayPause()
        },
        ot.prototype.pauseEvents = function (t) {
            this._eventsPaused = t
        },
        ot.prototype.onPlayPause = function (t) {
            t && "function" == typeof t && this
                .cbPlayPause
                .push(t)
        },
        ot.prototype.onTimeChange = function (t) {
            t && "function" == typeof t && this
                .cbTimeChange
                .push(t)
        };
        const lt = function (t, e) {
            if (!t) 
                throw "shader constructed without cgl";
            this._cgl = t,
            this._name = e || "unknown",
            this.glslVersion = 0,
            t.glVersion > 1 && (this.glslVersion = 300),
            this.id = E(),
            this._program = null,
            this._uniforms = [],
            this._drawBuffers = [!0],
            this._defines = [],
            this._needsRecompile = !0,
            this._projMatrixUniform = null,
            this._mvMatrixUniform = null,
            this._mMatrixUniform = null,
            this._vMatrixUniform = null,
            this._camPosUniform = null,
            this._normalMatrixUniform = null,
            this._inverseViewMatrixUniform = null,
            this._attrVertexPos = -1,
            this.precision = t.patch.config.glslPrecision || "highp",
            this._pMatrixState = -1,
            this._vMatrixState = -1,
            this._modGroupCount = 0,
            this._feedBackNames = [],
            this._attributes = [],
            this.glPrimitive = null,
            this.offScreenPass = !1,
            this._extensions = [],
            this.srcVert = this.getDefaultVertexShader(),
            this.srcFrag = this.getDefaultFragmentShader(),
            this.lastCompile = 0,
            this._moduleNames = [],
            this._modules = [],
            this._moduleNumId = 0,
            this._libs = [],
            this._tempNormalMatrix = mat4.create(),
            this._tempCamPosMatrix = mat4.create(),
            this._tempInverseViewMatrix = mat4.create(),
            this.setModules(
                ["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG"]
            )
        };
        lt.prototype.getCgl = function () {
            return this._cgl
        },
        lt.prototype.getName = function () {
            return this._name
        },
        lt.prototype.enableExtension = function (t) {
            this.setWhyCompile("enable extension " + t),
            this._needsRecompile = !0,
            this
                ._extensions
                .push(t)
        },
        lt.prototype.getAttrVertexPos = function () {
            return this._attrVertexPos
        },
        lt.prototype.hasTextureUniforms = function () {
            for (var t = 0; t < this._uniforms.length; t++) 
                if ("t" == this._uniforms[t].getType()) 
                    return !0;
        return !1
        },
        lt.prototype.setWhyCompile = function (t) {},
        lt.prototype.setSource = function (t, e) {
            this.srcVert = t,
            this.srcFrag = e,
            this.setWhyCompile("Source changed"),
            this._needsRecompile = !0
        },
        lt.prototype._addLibs = function (t) {
            for (var e in rt) 
                if (t.indexOf(e) > -1) {
                    var i = new rt[e];
                    t = t.replace("{{" + e + "}}", i.srcHeadFrag),
                    this
                        ._libs
                        .push(i),
                    i.initUniforms && i.initUniforms(this)
                }
            return t
        },
        lt.prototype.compile = function () {
            H.profileShaderCompiles++,
            H.profileShaderCompileName = this._name;
            var t = "";
            if (this._extensions) 
                for (i = 0; i < this._extensions.length; i++) 
                    t += "#extension " + this._extensions[i] + " : enable".endl();
        var e = "",
                i = 0;
            for (i = 0; i < this._defines.length; i++) 
                e += "#define " + this._defines[i][0] + " " + this._defines[i][1] + "".endl();
            if (this._uniforms) 
                for (i = 0; i < this._uniforms.length; i++) 
                    this
                        ._uniforms[i]
                        .resetLoc();
            this.hasTextureUniforms() && (e += "#define HAS_TEXTURES".endl());
            var n = "",
                r = "";
            if (300 == this.glslVersion) {
                var s = "",
                    a = 0;
                if (
                    this.srcFrag.indexOf("outColor0") > -1 && (this._drawBuffers[0] = !0),
                    this.srcFrag.indexOf("outColor1") > -1 && (this._drawBuffers[1] = !0),
                    this.srcFrag.indexOf("outColor2") > -1 && (this._drawBuffers[2] = !0),
                    this.srcFrag.indexOf("outColor3") > -1 && (this._drawBuffers[3] = !0),
                    1 == this._drawBuffers.length
                ) 
                    s = "out vec4 outColor;".endl(),
                    s += "#define gl_FragColor outColor".endl();
                else 
                    for (
                        a = 0,
                        s += "vec4 outColor;".endl(),
                        i = 0;
                        i < this._drawBuffers.length;
                        i++
                    ) 
                        0 == a && (s += "#define gl_FragColor outColor" + i + "".endl()),
                        s += "layout(location = " + i + ") out vec4 outColor" + i + ";".endl(),
                        a++;
            n = "#version 300 es".endl() + "// ".endl() + "// vertex shader " + this
                    ._name
                    .endl() + "// ".endl() + "precision " + this.precision + " float;".endl() + "".endl() +
                            "#define WEBGL2".endl() + "#define texture2D texture".endl() + ( "#define UNI uni" +
                    "form".endl() + "#define IN in".endl() + "#define OUT out".endl(),
                r = "#version 300 es".endl() + "// ".endl() + "// fragment shader " + this
                    ._name
                    .endl() + "// ".endl() + "precision " + this.precision + " float;".endl() + "".endl() +
                            "#define WEBGL2".endl() + "#define texture2D texture".endl() +
                            "#define IN in".endl() + "#define UNI uniform".endl() + s.endl()
            } else 
                r = "".endl() + "// ".endl() + "// fragment shader " + this
                    ._name
                    .endl() + "// ".endl() + "#define WEBGL1".endl() +
                            "#define texture texture2D".endl() + "#define outColor gl_FragColor".endl() + "#define IN varying".endl() +
                            "#define UNI uniform".endl(),
                n = "".endl() + "// ".endl() + "// vertex shader " + this
                    ._name
                    .endl() + "// ".endl() + "#define WEBGL1".endl() +
                            "#define texture texture2D".endl() + "#define OUT varying".endl() + ( "#define IN" +
                    " attribute".endl() + "#define UNI uniform".endl();
            
- 1 == r.indexOf("precision") && (
                r = "precision " + this.precision + " float;".endl() + r
            ),
            -1 == n.indexOf("precision") && (
                n = "precision " + this.precision + " float;".endl() + n
            ),
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) && (r += "#define MOBILE".endl(), n += "#define MOBILE".endl()),
            n = t + n + e + this.srcVert,
            r = t + r + e + this.srcFrag;
            var o = "",
                l = "";
            this
                ._modules
                .sort(function (t, e) {
                    return t.group - e.group
                }),
            this
                ._modules
                .sort(function (t, e) {
                    return t.priority || 0 - e.priority || 0
                });
            var h = !1;
            for (i = 0; i < this._moduleNames.length; i++) {
                for (var u = "", c = "", p = 0; p < this._modules.length; p++) 
                    if (this._modules[p].name == this._moduleNames[i]) {
                        if (
                            o += "\n//---- MOD: " + this._modules[p].group + ": " + p + " - " + this._modules[p].title +
                                        " ------\n",
                            l += "\n//---- MOD: " + this._modules[p].group + ": " + p + " - " + this._modules[p].title +
                                        " ------\n",
                            u += "\n\n//---- MOD: " + this._modules[p].title + " ------\n",
                            c += "\n\n//---- MOD: " + this._modules[p].title + " ------\n",
                            !h
                        ) {
                            h = !0;
                            for (var d = 0; d < this._attributes.length; d++) 
                                this
                                    ._attributes[d]
                                    .name && this
                                    ._attributes[d]
                                    .type && (
                                        o += "".endl() + "#ifndef ATTRIB_" + this._attributes[d].name.endl() + "  #define AT" +
                                            "TRIB_" + this._attributes[d].name.endl() + "  IN " + this._attributes[d].type +
                                            " " + this._attributes[d].name + ";".endl() + "#endif",
                                        this._attributes[d].nameFrag && (
                                        o += "".endl() + "#ifndef ATTRIB_" + this._attributes[d].nameFrag.endl() + "  #defin" +
                                                "e ATTRIB_" + this._attributes[d].nameFrag.endl() + "  OUT " + this._attributes[d].type +
                                                " " + this._attributes[d].nameFrag + ";".endl() + "#endif",
                                        u += "".endl() + this._attributes[d].nameFrag + "=" + this._attributes[d].name +
                                            ";"
                                    ),
                                        l += "".endl() + "#ifndef ATTRIB_" + this._attributes[d].nameFrag.endl() + "  #defin" +
                                            "e ATTRIB_" + this._attributes[d].nameFrag.endl() + "  IN " + this._attributes[d].type +
                                            " " + this._attributes[d].nameFrag + ";".endl() + "#endif"
                                    )
                            }
                        o += this
                            ._modules[p]
                            .srcHeadVert || "",
                        l += this
                            ._modules[p]
                            .srcHeadFrag || "",
                        u += this
                            ._modules[p]
                            .srcBodyVert || "",
                        c += this
                            ._modules[p]
                            .srcBodyFrag || "",
                        o += "\n//---- end mod ------\n",
                        l += "\n//---- end mod ------\n",
                        c += "\n//---- end mod ------\n",
                        u = (u += "\n//---- end mod ------\n").replace(
                            /{{mod}}/g,
                            this._modules[p].prefix
                        ),
                        c = c.replace(/{{mod}}/g, this._modules[p].prefix),
                        o = o.replace(/{{mod}}/g, this._modules[p].prefix),
                        l = l.replace(/{{mod}}/g, this._modules[p].prefix),
                        u = u.replace(/MOD_/g, this._modules[p].prefix),
                        c = c.replace(/MOD_/g, this._modules[p].prefix),
                        o = o.replace(/MOD_/g, this._modules[p].prefix),
                        l = l.replace(/MOD_/g, this._modules[p].prefix)
                    }
                n = n.replace("{{" + this._moduleNames[i] + "}}", u),
                r = r.replace("{{" + this._moduleNames[i] + "}}", c)
            }
            if (
                n = n.replace("{{MODULES_HEAD}}", o),
                r = r.replace("{{MODULES_HEAD}}", l),
                n = this._addLibs(n),
                r = this._addLibs(r),
                this._program
            ) 
                for (
                    this._program = this._createProgram(n, r),
                    this._projMatrixUniform = null,
                    i = 0;
                    i < this._uniforms.length;
                    i++
                ) 
                    this
                        ._uniforms[i]
                        .resetLoc();
            else 
                this._program = this._createProgram(n, r);
            this.finalShaderFrag = r,
            this.finalShaderVert = n,
            tt.lastMesh = null,
            tt.lastShader = null,
            this._needsRecompile = !1,
            this.lastCompile = at()
        },
        lt.prototype.bind = function () {
            var t = 0;
            if (
                tt.lastShader = this,
                this._program && !this._needsRecompile || this.compile(),
                !this._projMatrixUniform
            ) 
                for (
                    this._attrVertexPos = this._cgl.glGetAttribLocation(this._program, $.SHADER.SHADERVAR_VERTEX_POSITION),
                    this._projMatrixUniform = this._cgl.gl.getUniformLocation(this._program, $.SHADER.SHADERVAR_UNI_PROJMAT),
                    this._mvMatrixUniform = this._cgl.gl.getUniformLocation(this._program, "mvMatrix"),
                    this._vMatrixUniform = this._cgl.gl.getUniformLocation(this._program, $.SHADER.SHADERVAR_UNI_VIEWMAT),
                    this._mMatrixUniform = this._cgl.gl.getUniformLocation(this._program, $.SHADER.SHADERVAR_UNI_MODELMAT),
                    this._camPosUniform = this._cgl.gl.getUniformLocation(this._program, $.SHADER.SHADERVAR_UNI_VIEWPOS),
                    this._normalMatrixUniform = this._cgl.gl.getUniformLocation(this._program, $.SHADER.SHADERVAR_UNI_NORMALMAT),
                    this._inverseViewMatrixUniform = this._cgl.gl.getUniformLocation(this._program, $.SHADER.SHADERVAR_UNI_INVVIEWMAT),
                    t = 0;
                    t < this._uniforms.length;
                    t++
                ) 
                    this
                        ._uniforms[t]
                        .needsUpdate = !0;
            for (this._cgl.currentProgram != this._program && (
                H.profileShaderBinds++,
                this._cgl.gl.useProgram(this._program),
                this._cgl.currentProgram = this._program
            ), t = 0; t < this._uniforms.length; t++) 
                this
                    ._uniforms[t]
                    .needsUpdate && this
                    ._uniforms[t]
                    .updateValue();
            if (this._pMatrixState != this._cgl.getProjectionMatrixStateCount() && (
                this._pMatrixState = this._cgl.getProjectionMatrixStateCount(),
                this._cgl.gl.uniformMatrix4fv(this._projMatrixUniform, !1, this._cgl.pMatrix),
                H.profileMVPMatrixCount++
            ), this._vMatrixUniform) 
                this._vMatrixState != this
                    ._cgl
                    .getViewMatrixStateCount() && (
                        this._cgl.gl.uniformMatrix4fv(this._vMatrixUniform, !1, this._cgl.vMatrix),
                        H.profileMVPMatrixCount++,
                        this._vMatrixState = this._cgl.getViewMatrixStateCount(),
                        this._inverseViewMatrixUniform && (
                            mat4.invert(this._tempInverseViewMatrix, this._cgl.vMatrix),
                            this._cgl.gl.uniformMatrix4fv(this._inverseViewMatrixUniform, !1, this._tempInverseViewMatrix),
                            H.profileMVPMatrixCount++
                        )
                    ),
                this
                    ._cgl
                    .gl
                    .uniformMatrix4fv(this._mMatrixUniform, !1, this._cgl.mMatrix),
                H.profileMVPMatrixCount++,
                this._camPosUniform && (
                    mat4.invert(this._tempCamPosMatrix, this._cgl.vMatrix),
                    this._cgl.gl.uniform3f(
                        this._camPosUniform,
                        this._tempCamPosMatrix[12],
                        this._tempCamPosMatrix[13],
                        this._tempCamPosMatrix[14]
                    ),
                    H.profileMVPMatrixCount++
                );
            else {
                var e = mat4.create();
                mat4.mul(e, this._cgl.vMatrix, this._cgl.mMatrix),
                this
                    ._cgl
                    .gl
                    .uniformMatrix4fv(this._mvMatrixUniform, !1, e),
                H.profileMVPMatrixCount++
            }
            for (
                this._normalMatrixUniform && (
                    mat4.mul(this._tempNormalMatrix, this._cgl.vMatrix, this._cgl.mMatrix),
                    mat4.invert(this._tempNormalMatrix, this._tempNormalMatrix),
                    mat4.transpose(this._tempNormalMatrix, this._tempNormalMatrix),
                    this._cgl.gl.uniformMatrix4fv(this._normalMatrixUniform, !1, this._tempNormalMatrix),
                    H.profileMVPMatrixCount++
                ),
                t = 0; t < this._libs.length; t++
            ) 
                this
                    ._libs[t]
                    .onBind && this
                    ._libs[t]
                    .onBind
                    .bind(this._libs[t])(this._cgl, this)
            },
        lt.prototype.toggleDefine = function (t, e) {
            e
                ? this.define(t)
                : this.removeDefine(t)
        },
        lt.prototype.define = function (t, e) {
            e || (e = "");
            for (var i = 0; i < this._defines.length; i++) {
                if (this._defines[i][0] == t && this._defines[i][1] == e) 
                    return;
                if (this._defines[i][0] == t) 
                    return this._defines[i][1] = e,
                    void(this._needsRecompile = !0)
            }
            this
                ._defines
                .push([t, e]),
            this._needsRecompile = !0,
            this.setWhyCompile("define " + t + " " + e)
        },
        lt.prototype.getDefines = function () {
            return this._defines
        },
        lt.prototype.getDefine = function (t) {
            for (var e = 0; e < this._defines.length; e++) 
                if (this._defines[e][0] == t) 
                    return this._defines[e][1];
        return null
        },
        lt.prototype.hasDefine = function (t) {
            for (var e = 0; e < this._defines.length; e++) 
                if (this._defines[e][0] == t) 
                    return !0
        },
        lt.prototype.removeDefine = function (t) {
            for (var e = 0; e < this._defines.length; e++) 
                if (this._defines[e][0] == t) 
                    return this
                        ._defines
                        .splice(e, 1),
                    void(this._needsRecompile = !0)
        },
        lt.prototype.removeModule = function (t) {
            for (var e = 0; e < this._modules.length; e++) 
                if (t && t.id && (this._modules[e].id == t.id || !this._modules[e])) {
                    for (var i = !0; i;) {
                        i = !1;
                        for (var n = 0; n < this._uniforms.length; n++) 
                            0 != this
                                ._uniforms[n]
                                .getName()
                                .indexOf(t.prefix) || (this._uniforms.splice(n, 1), i = !0)
                        }
                    this._needsRecompile = !0,
                    this.setWhyCompile("remove module " + t.title),
                    this
                        ._modules
                        .splice(e, 1);
                    break
                }
            },
        lt.prototype.getNumModules = function () {
            return this._modules.length
        },
        lt.prototype.getCurrentModules = function () {
            return this._modules
        },
        lt.prototype.addModule = function (t, e) {
            return t.id || (t.id = b()),
            t.numId || (t.numId = this._moduleNumId),
            t.num || (t.num = this._modules.length),
            t.group = e
                ? e.group
                : this._modGroupCount++,
            t.prefix = "mod" + t.group,
            this
                ._modules
                .push(t),
            this._needsRecompile = !0,
            this.setWhyCompile("add module " + t.title),
            this._moduleNumId++,
            t
        },
        lt.prototype.setModules = function (t) {
            this._moduleNames = t
        },
        lt.prototype.dispose = function () {
            this
                ._cgl
                .gl
                .deleteProgram(this._program)
        },
        lt.prototype.setDrawBuffers = function (t) {
            this._drawBuffers = t,
            this._needsRecompile = !0
        },
        lt.prototype.getUniforms = function () {
            return this._uniforms
        },
        lt.prototype.getUniform = function (t) {
            for (var e = 0; e < this._uniforms.length; e++) 
                if (this._uniforms[e].getName() == t) 
                    return this._uniforms[e];
        return null
        },
        lt.prototype.removeUniform = function (t) {
            for (var e = 0; e < this._uniforms.length; e++) 
                this
                    ._uniforms[e]
                    .getName() == t && this
                    ._uniforms
                    .splice(e, 1);
            this._needsRecompile = !0,
            this.setWhyCompile("remove uniform " + t)
        },
        lt.prototype.addUniform = function (t) {
            this
                ._uniforms
                .push(t),
            this.setWhyCompile("add uniform " + name),
            this._needsRecompile = !0
        },
        lt.prototype._createProgram = function (t, e) {
            var i = this
                ._cgl
                .gl
                .createProgram();
            return this.vshader = lt.createShader(
                this._cgl,
                t,
                this._cgl.gl.VERTEX_SHADER,
                this
            ),
            this.fshader = lt.createShader(
                this._cgl,
                e,
                this._cgl.gl.FRAGMENT_SHADER,
                this
            ),
            this
                ._cgl
                .gl
                .attachShader(i, this.vshader),
            this
                ._cgl
                .gl
                .attachShader(i, this.fshader),
            this._linkProgram(i),
            i
        },
        lt.prototype.hasErrors = function () {
            return this._hasErrors
        },
        lt.prototype._linkProgram = function (t) {
            this._feedBackNames.length > 0 && this
                ._cgl
                .gl
                .transformFeedbackVaryings(
                    t,
                    this._feedBackNames,
                    this._cgl.gl.SEPARATE_ATTRIBS
                ),
            this
                ._cgl
                .gl
                .linkProgram(t),
            this
                ._cgl
                .gl
                .validateProgram(t),
            this
                ._cgl
                .gl
                .getProgramParameter(t, this._cgl.gl.LINK_STATUS) || (
                    console.warn(this._cgl.gl.getShaderInfoLog(this.fshader)),
                    console.warn(this._cgl.gl.getShaderInfoLog(this.vshader)),
                    console.error(
                    name + " shader linking fail..."
                ),
                    console.log("srcFrag", this.srcFrag),
                    console.log("srcVert", this.srcVert),
                    console.log(
                    name + " programinfo: ",
                    this._cgl.gl.getProgramInfoLog(t)
                ),
                    console.log("--------------------------------------"),
                    console.log(this),
                    console.log("--------------------------------------"),
                    name = "errorshader",
                    this.setSource(lt.getDefaultVertexShader(), lt.getErrorFragmentShader())
                )
        },
        lt.prototype.getProgram = function () {
            return this._program
        },
        lt.prototype.setFeedbackNames = function (t) {
            this._needsRecompile = !0,
            this._feedBackNames = t
        },
        lt.prototype.getDefaultVertexShader = lt.getDefaultVertexShader = function () {
            return "".endl() + "{{MODULES_HEAD}}".endl() + "IN vec3 vPosition;".endl() + ( "I" +
                "N vec2 attrTexCoord;".endl() + "IN vec3 attrVertNormal;".endl() + ( "IN float at" +
                "trVertIndex;".endl() + "OUT vec2 texCoord;".endl() + "OUT vec3 norm;".endl() +
                "UNI mat4 projMatrix;".endl() + "UNI mat4 viewMatrix;".endl() + ( "UNI mat4 model" +
                "Matrix;".endl() + "void main()".endl() + "{".endl() + ( "   texCoord=attrTexCoor" +
                "d;".endl() + "   norm=attrVertNormal;".endl() + ( "   vec4 pos=vec4(vPosition,  " +
                "1.0);".endl() + "   mat4 mMatrix=modelMatrix;".endl() + ( "   {{MODULE_VERTEX_PO" +
                "SITION}}".endl() +
                "   gl_Position = projMatrix * (viewMatrix*mMatrix) * pos;".endl() + "}"
        },
        lt.prototype.getDefaultFragmentShader = lt.getDefaultFragmentShader = function (
            t,
            e,
            i
        ) {
            return null == t && (t = .5, e = .5, i = .5),
            "".endl() + "IN vec2 texCoord;".endl() + "{{MODULES_HEAD}}".endl() + ( "void main" +
                "()".endl() + "{".endl() + "    vec4 col=vec4(" + t + "," + e + "," + i + ( ",1.0" +
                ");".endl() + "    {{MODULE_COLOR}}".endl() + "    outColor = col;".endl() +
                "}"
        },
        lt.prototype.addAttribute = function (t) {
            for (var e = 0; e < this._attributes.length; e++) 
                if (this._attributes[e].name == t.name && this._attributes[e].nameFrag == t.nameFrag) 
                    return;
        this
                ._attributes
                .push(t),
            this._needsRecompile = !0
        },
        lt.getErrorFragmentShader = function () {
            return "".endl() + "void main()".endl() + "{".endl() + ( "   float g=mod((gl_Frag" +
                "Coord.y+gl_FragCoord.x),50.0)/50.0;".endl() + "   g= step(0.1,g);".endl() + ( " " +
                "  outColor = vec4( g+0.5, 0.0, 0.0, 1.0);".endl() + "}"
        },
        lt.createShader = function (t, e, i, n) {
            var r = t
                .gl
                .createShader(i);
            if (
                t.gl.shaderSource(r, e),
                t.gl.compileShader(r),
                !t.gl.getShaderParameter(r, t.gl.COMPILE_STATUS)
            ) {
                console.log("compile status: "),
                i == t.gl.VERTEX_SHADER && console.log("VERTEX_SHADER"),
                i == t.gl.FRAGMENT_SHADER && console.log("FRAGMENT_SHADER"),
                console.warn(t.gl.getShaderInfoLog(r));
                var s = t
                        .gl
                        .getShaderInfoLog(r),
                    a = function (t) {
                        var e = [],
                            i = s.split("\n");
                        for (var n in i) {
                            var r = i[n].split(":");
                            parseInt(r[2], 10) && e.push(parseInt(r[2], 10))
                        }
                        return e
                    }(),
                    o = '<div class="shaderErrorCode">',
                    l = e.match(/^.*((\r\n|\n|\r)|$)/gm);
                for (var h in l) {
                    var u = parseInt(h, 10) + 1,
                        c = u + ": " + l[h];
                    console.log(c);
                    var p = !1;
                    for (var d in a) 
                        a[d] == u && (p = !0);
                    p && (o += '<span class="error">'),
                    o += c,
                    p && (o += "</span>")
                }
                console.warn(s),
                o = (s = s.replace(/\n/g, "<br/>")) + "<br/>" + o + "<br/><br/>",
                t
                    .patch
                    .emitEvent("criticalError", "Shader error " + name, o),
                t
                    .patch
                    .isEditorMode() && console.log("Shader error " + name, o),
                o += "</div>",
                name = "errorshader",
                n.setSource(lt.getDefaultVertexShader(), lt.getErrorFragmentShader())
            }
            return r
        };
        const ht = Math.PI / 180,
            ut = (Math.PI, -1 != window.navigator.userAgent.indexOf("Windows")),
            ct = function (t) {
                var e;
                if (t.wheelDelta) 
                    e = t.wheelDelta % 120 - 0 == -0
                        ? t.wheelDelta / 120
                        : t.wheelDelta / 30,
                    e *= -1.5,
                    ut && (e *= 2);
                else {
                    var i = t.deltaY;
                    t.shiftKey && (i = t.deltaX);
                    var n = i || t.detail;
                    e = -(
                        n % 3
                            ? 10 * n
                            : n / 3
                    ),
                    e *= -3
                }
                return e > 20 && (e = 20),
                e < -20 && (e = -20),
                e
            },
            pt = ct,
            dt = ct,
            ft = function () {
                this._arr = [mat4.create()],
                this._index = 0,
                this.stateCounter = 0
            };
        ft.prototype.push = function (t) {
            if (this._index++, this.stateCounter++, this._index == this._arr.length) {
                var e = mat4.create();
                this
                    ._arr
                    .push(e)
            }
            return mat4.copy(this._arr[this._index], t || this._arr[this._index - 1]),
            this._arr[this._index]
        },
        ft.prototype.pop = function () {
            return this.stateCounter++,
            this._index--,
            this._index < 0 && (this._index = 0),
            this._arr[this._index]
        },
        ft.prototype.length = function () {
            return this._index
        };
        const gt = function (t) {
            var e = this,
                i = [0, 0, 0, 0];
            this.glVersion = 0,
            this.glUseHalfFloatTex = !1,
            this.clearCanvasTransparent = !0,
            this.clearCanvasDepth = !0,
            this.patch = t,
            this.temporaryTexture = null,
            this.frameStore = {},
            this.gl = null,
            this.pMatrix = mat4.create(),
            this.mMatrix = mat4.create(),
            this.vMatrix = mat4.create(),
            this._textureslots = [],
            this._pMatrixStack = new ft,
            this._mMatrixStack = new ft,
            this._vMatrixStack = new ft,
            this._glFrameBufferStack = [],
            this._frameBufferStack = [],
            this._shaderStack = [],
            Object.defineProperty(this, "mvMatrix", {
                get() {
                    return this.mMatrix
                },
                set(t) {
                    this.mMatrix = t
                }
            }),
            this.canvas = null,
            this.pixelDensity = 1,
            mat4.identity(this.mMatrix),
            mat4.identity(this.vMatrix);
            var n = new lt(this, "simpleshader");
            n.setModules(["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG"]),
            n.setSource(lt.getDefaultVertexShader(), lt.getDefaultFragmentShader());
            var r = n,
                s = [];
            this.addEventListener = function (t, e) {
                "resize" == t && s.push(e)
            },
            this.removeEventListener = function (t, e) {
                if ("resize" == t) 
                    for (var i in s) 
                        if (s[i] == e) 
                            return void s.splice(i, 1)
            },
            this.exitError = function (t, e) {
                this
                    .patch
                    .exitError(t, e),
                this.aborted = !0
            },
            this.setCanvas = function (t) {
                if (
                    this.canvas = "string" == typeof t
                        ? document.getElementById(t)
                        : t,
                    this.patch.config.canvas || (this.patch.config.canvas = {}),
                    this.patch.config.canvas.hasOwnProperty("preserveDrawingBuffer") || (
                        this.patch.config.canvas.preserveDrawingBuffer = !1
                    ),
                    this.patch.config.canvas.hasOwnProperty("premultipliedAlpha") || (
                        this.patch.config.canvas.premultipliedAlpha = !1
                    ),
                    this.patch.config.canvas.hasOwnProperty("alpha") || (
                        this.patch.config.canvas.alpha = !1
                    ),
                    this.patch.config.hasOwnProperty("clearCanvasColor") && (
                        this.clearCanvasTransparent = this.patch.config.clearCanvasColor
                    ),
                    this.patch.config.hasOwnProperty("clearCanvasDepth") && (
                        this.clearCanvasDepth = this.patch.config.clearCanvasDepth
                    ),
                    this.gl = this.canvas.getContext("webgl2", this.patch.config.canvas),
                    this.gl
                        ? this.glVersion = 2
                        : (
                            this.gl = this.canvas.getContext("webgl", this.patch.config.canvas) || this.canvas.getContext("experimental-webgl", this.patch.config.canvas),
                            this.glVersion = 1,
                            /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && (this.glUseHalfFloatTex = !0),
                            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && (this.patch.config.canvas.hasOwnProperty("powerPreference") || (this.patch.config.canvas.powerPreference = "high-performance"))
                        ),
                    this.gl
                ) {
                    this
                        .gl
                        .getExtension("GL_OES_standard_derivatives");
                    var i = this
                        .gl
                        .getExtension("ANGLE_instanced_arrays") || this.gl;
                    i.vertexAttribDivisorANGLE && (
                        this.gl.vertexAttribDivisor = i.vertexAttribDivisorANGLE.bind(i),
                        this.gl.drawElementsInstanced = i.drawElementsInstancedANGLE.bind(i)
                    ),
                    e.updateSize()
                } else 
                    this.exitError(
                        "NO_WEBGL",
                        "sorry, could not initialize WebGL. Please check if your Browser supports WebGL" +
                                "."
                    )
            },
            this.updateSize = function () {
                this.canvas.width = this.canvasWidth = this.canvas.clientWidth * this.pixelDensity,
                this.canvas.height = this.canvasHeight = this.canvas.clientHeight * this.pixelDensity
            },
            this.canvasWidth = -1,
            this.canvasHeight = -1,
            this.canvasScale = 1;
            var a = -1,
                o = -1;
            this.getViewPort = function () {
                return i
            },
            this.resetViewPort = function () {
                this
                    .gl
                    .viewport(i[0], i[1], i[2], i[3])
            },
            this.setViewPort = function (t, e, n, r) {
                i[0] = Math.round(t),
                i[1] = Math.round(e),
                i[2] = Math.round(n),
                i[3] = Math.round(r),
                this
                    .gl
                    .viewport(i[0], i[1], i[2], i[3])
            },
            this.beginFrame = function () {
                CABLES.UI && (
                    gui.metaTexturePreviewer.render(),
                    CABLES.UI.patchPreviewer && CABLES.UI.patchPreviewer.render()
                ),
                e.setShader(n)
            },
            this.screenShot = function (t, e) {
                e && (
                    this.gl.clearColor(1, 1, 1, 1),
                    this.gl.colorMask(!1, !1, !1, !0),
                    this.gl.clear(this.gl.COLOR_BUFFER_BIT),
                    this.gl.colorMask(!0, !0, !0, !0)
                ),
                this.canvas && this.canvas.toBlob && this
                    .canvas
                    .toBlob(e => {
                        t
                            ? t(e)
                            : console.log("no screenshot callback...")
                    })
            },
            this.endFrame = function () {
                if (
                    CABLES.UI && CABLES.GL_MARKER.drawMarkerLayer(this),
                    e.setPreviousShader(),
                    this._vMatrixStack.length() > 0 && console.warn("view matrix stack length !=0 at end of rendering..."),
                    this._mMatrixStack.length() > 0 && console.warn("mvmatrix stack length !=0 at end of rendering..."),
                    this._pMatrixStack.length() > 0 && console.warn("pmatrix stack length !=0 at end of rendering..."),
                    this._glFrameBufferStack.length > 0 && console.warn("glFrameBuffer stack length !=0 at end of rendering..."),
                    this._stackDepthTest.length > 0 && console.warn("depthtest stack length !=0 at end of rendering..."),
                    this._stackDepthWrite.length > 0 && console.warn("depthwrite stack length !=0 at end of rendering..."),
                    this._stackDepthFunc.length > 0 && console.warn("depthfunc stack length !=0 at end of rendering..."),
                    this._stackBlend.length > 0 && console.warn("blend stack length !=0 at end of rendering..."),
                    this._stackBlendMode.length > 0 && console.warn("blendMode stack length !=0 at end of rendering..."),
                    this._shaderStack.length > 0 && console.warn("this._shaderStack length !=0 at end of rendering..."),
                    a != e.canvasWidth || o != e.canvasHeight
                ) {
                    a = e.canvasWidth,
                    o = e.canvasHeight,
                    this.setSize(
                        e.canvasWidth / this.pixelDensity,
                        e.canvasHeight / this.pixelDensity
                    ),
                    this.updateSize();
                    for (var t = 0; t < s.length; t++) 
                        s[t]()
                }
            },
            this.getShader = function () {
                if (r && (!this.frameStore || !0 === this.frameStore.renderOffscreen == r.offScreenPass == 1)) 
                    return r;
                for (var t = this._shaderStack.length - 1; t >= 0; t--) 
                    if (this._shaderStack[t] && this.frameStore.renderOffscreen == this._shaderStack[t].offScreenPass) 
                        return this._shaderStack[t]
            },
            this.getDefaultShader = function () {
                return n
            },
            this.setShader = function (t) {
                this
                    ._shaderStack
                    .push(t),
                r = t
            },
            this.setPreviousShader = function () {
                if (0 === this._shaderStack.length) 
                    throw "Invalid shader stack pop!";
                this
                    ._shaderStack
                    .pop(),
                r = this._shaderStack[this._shaderStack.length - 1]
            },
            this.pushGlFrameBuffer = function (t) {
                this
                    ._glFrameBufferStack
                    .push(t)
            },
            this.popGlFrameBuffer = function () {
                return 0 == this._glFrameBufferStack.length
                    ? null
                    : (
                        this._glFrameBufferStack.pop(),
                        this._glFrameBufferStack[this._glFrameBufferStack.length - 1]
                    )
            },
            this.getCurrentGlFrameBuffer = function () {
                return 0 === this._glFrameBufferStack.length
                    ? null
                    : this._glFrameBufferStack[this._glFrameBufferStack.length - 1]
            },
            this.pushFrameBuffer = function (t) {
                this
                    ._frameBufferStack
                    .push(t)
            },
            this.popFrameBuffer = function () {
                return 0 == this._frameBufferStack.length
                    ? null
                    : (
                        this._frameBufferStack.pop(),
                        this._frameBufferStack[this._frameBufferStack.length - 1]
                    )
            },
            this.getCurrentFrameBuffer = function () {
                return 0 === this._frameBufferStack.length
                    ? null
                    : this._frameBufferStack[this._frameBufferStack.length - 1]
            };
            var l = vec3.create();
            vec3.set(l, 0, 0, 2);
            var h = vec3.create();
            vec3.set(h, 0, 0, 0),
            this.renderStart = function (t, e, i) {
                e || (e = h),
                i || (i = l),
                this.pushDepthTest(!0),
                this.pushDepthWrite(!0),
                this.pushDepthFunc(t.gl.LEQUAL),
                this.clearCanvasTransparent && (
                    t.gl.clearColor(0, 0, 0, 0),
                    t.gl.clear(t.gl.COLOR_BUFFER_BIT)
                ),
                this.clearCanvasDepth && t
                    .gl
                    .clear(t.gl.DEPTH_BUFFER_BIT),
                t.setViewPort(0, 0, t.canvasWidth, t.canvasHeight),
                mat4.perspective(t.pMatrix, 45, t.canvasWidth / t.canvasHeight, .1, 1e3),
                mat4.identity(t.mMatrix),
                mat4.identity(t.vMatrix),
                mat4.translate(t.mMatrix, t.mMatrix, e),
                mat4.translate(t.vMatrix, t.vMatrix, i),
                t.pushPMatrix(),
                t.pushModelMatrix(),
                t.pushViewMatrix(),
                t.pushBlendMode($.BLEND_MODES.BLEND_NORMAL, !1);
                for (var n = 0; n < this._textureslots.length; n++) 
                    this._textureslots[n] = null;
                t.beginFrame()
            },
            this.renderEnd = function (t, e) {
                t.popViewMatrix(),
                t.popModelMatrix(),
                t.popPMatrix(),
                this.popDepthTest(),
                this.popDepthWrite(),
                this.popDepthFunc(),
                this.popBlend(),
                this.popBlendMode(),
                t.endFrame()
            },
            this.getTexture = function (t) {
                return this._textureslots[t]
            },
            this.setTexture = function (t, e, i) {
                this._textureslots[t] != e && (
                    this.gl.activeTexture(this.gl.TEXTURE0 + t),
                    this.gl.bindTexture(i || this.gl.TEXTURE_2D, e),
                    this._textureslots[t] = e
                )
            },
            this.fullScreen = function () {
                this.canvas.requestFullscreen
                    ? this
                        .canvas
                        .requestFullscreen()
                    : this.canvas.mozRequestFullScreen
                        ? this
                            .canvas
                            .mozRequestFullScreen()
                        : this.canvas.webkitRequestFullscreen
                            ? this
                                .canvas
                                .webkitRequestFullscreen()
                            : this.canvas.msRequestFullscreen && this
                                .canvas
                                .msRequestFullscreen()
            },
            this.setSize = function (t, e) {
                this.canvas.style.width = t + "px",
                this.canvas.style.height = e + "px",
                this.canvas.width = t * this.pixelDensity,
                this.canvas.height = e * this.pixelDensity,
                this.updateSize()
            },
            this._resizeToWindowSize = function () {
                this.setSize(window.innerWidth, window.innerHeight),
                this.updateSize()
            },
            this._resizeToParentSize = function () {
                console.log("_resizeToParentSize");
                var t = this.canvas.parentElement;
                t
                    ? (
                        this.setSize(t.clientWidth, t.clientHeight),
                        console.log("_resizeToParentSize", t.clientWidth, t.clientHeight),
                        this.updateSize()
                    )
                    : console.error("cables: can not resize to container element")
            },
            this.setAutoResize = function (t) {
                window.removeEventListener("resize", this._resizeToWindowSize.bind(this)),
                window.removeEventListener("resize", this._resizeToParentSize.bind(this)),
                "window" == t && (
                    window.addEventListener("resize", this._resizeToWindowSize.bind(this)),
                    window.addEventListener("orientationchange", this._resizeToWindowSize.bind(this)),
                    this._resizeToWindowSize()
                ),
                "parent" == t && (
                    window.addEventListener("resize", this._resizeToParentSize.bind(this)),
                    this._resizeToParentSize()
                )
            },
            this.printError = function (t) {
                var e = this
                    .gl
                    .getError();
                if (e != this.gl.NO_ERROR) {
                    var i = "";
                    e == this.gl.OUT_OF_MEMORY && (i = "OUT_OF_MEMORY"),
                    e == this.gl.INVALID_ENUM && (i = "INVALID_ENUM"),
                    e == this.gl.INVALID_OPERATION && (i = "INVALID_OPERATION"),
                    e == this.gl.INVALID_FRAMEBUFFER_OPERATION && (
                        i = "INVALID_FRAMEBUFFER_OPERATION"
                    ),
                    e == this.gl.INVALID_VALUE && (i = "INVALID_VALUE"),
                    e == this.gl.CONTEXT_LOST_WEBGL && (i = "CONTEXT_LOST_WEBGL"),
                    e == this.gl.NO_ERROR && (i = "NO_ERROR"),
                    console.log("gl error: ", t, e, i)
                }
            },
            this.saveScreenshot = function (t, e, i, n) {
                this
                    .patch
                    .renderOneFrame();
                var r = this.canvas.clientWidth,
                    s = this.canvas.clientHeight;
                function a(t, e, i) {
                    return Array(e - String(t).length + 1).join(i || "0") + t
                }
                i && (this.canvas.width = i, r = i),
                n && (this.canvas.height = n, s = n);
                var o = new Date,
                    l = ""
                        .concat(
                            String(o.getFullYear()) + String(o.getMonth() + 1) + String(o.getDate()),
                            "_"
                        )
                        .concat(a(o.getHours(), 2))
                        .concat(a(o.getMinutes(), 2))
                        .concat(a(o.getSeconds(), 2));
                t
                    ? t += ".png"
                    : t = "cables_" + l + ".png",
                this
                    .patch
                    .cgl
                    .screenShot(i => {
                        if (this.canvas.width = r, this.canvas.height = s, i) {
                            var n = document.createElement("a");
                            n.download = t,
                            n.href = URL.createObjectURL(i),
                            document
                                .body
                                .appendChild(n),
                            n.click(),
                            e && e(i),
                            n.remove()
                        } else 
                            console.log("screenshot: no blob")
                    }, !0)
            }
        };
        gt.prototype.pushViewMatrix = function () {
            this.vMatrix = this
                ._vMatrixStack
                .push(this.vMatrix)
        },
        gt.prototype.popViewMatrix = function () {
            this.vMatrix = this
                ._vMatrixStack
                .pop()
        },
        gt.prototype.getViewMatrixStateCount = function () {
            return this._vMatrixStack.stateCounter
        },
        gt.prototype.pushPMatrix = function () {
            this.pMatrix = this
                ._pMatrixStack
                .push(this.pMatrix)
        },
        gt.prototype.popPMatrix = function () {
            return this.pMatrix = this
                ._pMatrixStack
                .pop(),
            this.pMatrix
        },
        gt.prototype.getProjectionMatrixStateCount = function () {
            return this._pMatrixStack.stateCounter
        },
        gt.prototype.pushMvMatrix = gt.prototype.pushModelMatrix = function () {
            this.mMatrix = this
                ._mMatrixStack
                .push(this.mMatrix)
        },
        gt.prototype.popMvMatrix = gt.prototype.popmMatrix = gt.prototype.popModelMatrix = function () {
            return this.mMatrix = this
                ._mMatrixStack
                .pop(),
            this.mMatrix
        },
        gt.prototype.modelMatrix = function () {
            return this.mMatrix
        },
        gt.prototype._stackDepthTest = [],
        gt.prototype.pushDepthTest = function (t) {
            this
                ._stackDepthTest
                .push(t),
            t
                ? this
                    .gl
                    .enable(this.gl.DEPTH_TEST)
                : this
                    .gl
                    .disable(this.gl.DEPTH_TEST)
        },
        gt.prototype.stateDepthTest = function () {
            return this._stackDepthTest[this._stackDepthTest.length - 1]
        },
        gt.prototype.popDepthTest = function () {
            this
                ._stackDepthTest
                .pop(),
            this._stackDepthTest[this._stackDepthTest.length - 1]
                ? this
                    .gl
                    .enable(this.gl.DEPTH_TEST)
                : this
                    .gl
                    .disable(this.gl.DEPTH_TEST)
        },
        gt.prototype._stackDepthWrite = [],
        gt.prototype.pushDepthWrite = function (t) {
            this
                ._stackDepthWrite
                .push(t),
            this
                .gl
                .depthMask(t)
        },
        gt.prototype.stateDepthWrite = function () {
            return this._stackDepthWrite[this._stackDepthWrite.length - 1]
        },
        gt.prototype.popDepthWrite = function () {
            this
                ._stackDepthWrite
                .pop(),
            this
                .gl
                .depthMask(this._stackDepthWrite[this._stackDepthWrite.length - 1])
        },
        gt.prototype._stackDepthFunc = [],
        gt.prototype.pushDepthFunc = function (t) {
            this
                ._stackDepthFunc
                .push(t),
            this
                .gl
                .depthFunc(t)
        },
        gt.prototype.stateDepthFunc = function () {
            return this._stackDepthFunc.length > 0 && this._stackDepthFunc[this._stackDepthFunc.length - 1]
        },
        gt.prototype.popDepthFunc = function () {
            this
                ._stackDepthFunc
                .pop(),
            this._stackDepthFunc.length > 0 && this
                .gl
                .depthFunc(this._stackDepthFunc[this._stackDepthFunc.length - 1])
        },
        gt.prototype._stackBlend = [],
        gt.prototype.pushBlend = function (t) {
            this
                ._stackBlend
                .push(t),
            t
                ? this
                    .gl
                    .enable(this.gl.BLEND)
                : this
                    .gl
                    .disable(this.gl.BLEND)
        },
        gt.prototype.popBlend = function () {
            this
                ._stackBlend
                .pop(),
            this._stackBlend[this._stackBlend.length - 1]
                ? this
                    .gl
                    .enable(this.gl.BLEND)
                : this
                    .gl
                    .disable(this.gl.BLEND)
        },
        gt.prototype.stateBlend = function () {
            return this._stackBlend[this._stackBlend.length - 1]
        },
        gt.prototype._stackBlendMode = [],
        gt.prototype._stackBlendModePremul = [],
        gt.prototype.pushBlendMode = function (t, e) {
            this
                ._stackBlendMode
                .push(t),
            this
                ._stackBlendModePremul
                .push(e);
            const i = this._stackBlendMode.length - 1;
            this.pushBlend(this._stackBlendMode[i] !== $.BLEND_MODES.BLEND_NONE),
            this._setBlendMode(this._stackBlendMode[i], this._stackBlendModePremul[i])
        },
        gt.prototype.popBlendMode = function () {
            this
                ._stackBlendMode
                .pop(),
            this
                ._stackBlendModePremul
                .pop();
            const t = this._stackBlendMode.length - 1;
            this.popBlend(this._stackBlendMode[t] !== $.BLEND_MODES.BLEND_NONE),
            t > 0 && this._setBlendMode(
                this._stackBlendMode[t],
                this._stackBlendModePremul[t]
            )
        },
        gt.prototype.glGetAttribLocation = function (t, e) {
            return this
                .gl
                .getAttribLocation(t, e)
        },
        gt.prototype._setBlendMode = function (t, e) {
            const i = this.gl;
            t == $.BLEND_MODES.BLEND_NONE || (
                t == $.BLEND_MODES.BLEND_ADD
                    ? e
                        ? (
                            i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                            i.blendFuncSeparate(i.ONE, i.ONE, i.ONE, i.ONE)
                        )
                        : (i.blendEquation(i.FUNC_ADD), i.blendFunc(i.SRC_ALPHA, i.ONE))
                    : t == $.BLEND_MODES.BLEND_SUB
                        ? e
                            ? (
                                i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                                i.blendFuncSeparate(i.ZERO, i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ONE_MINUS_SRC_ALPHA)
                            )
                            : (i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ZERO, i.ONE_MINUS_SRC_COLOR))
                        : t == $.BLEND_MODES.BLEND_MUL
                            ? e
                                ? (
                                    i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                                    i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA)
                                )
                                : (i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ZERO, i.SRC_COLOR))
                            : t == $.BLEND_MODES.BLEND_NORMAL
                                ? e
                                    ? (
                                        i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                                        i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA)
                                    )
                                    : (
                                        i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD),
                                        i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA)
                                    )
                                : console.log("setblendmode: unknown blendmode")
            )
        };
        const _t = Object.assign({
            Framebuffer: function (t, e, i, n) {
                var r = t,
                    s = r
                        .gl
                        .getExtension("WEBGL_depth_texture") || r
                        .gl
                        .getExtension("WEBKIT_WEBGL_depth_texture") || r
                        .gl
                        .getExtension("MOZ_WEBGL_depth_texture") || r.gl.DEPTH_TEXTURE;
                if (s) {
                    var a = e || 512,
                        o = i || 512;
                    (n = n || {
                        isFloatingPointTexture: !1
                    }).hasOwnProperty("filter") || (n.filter = q.FILTER_LINEAR);
                    var l = new q(r, {
                            isFloatingPointTexture: n.isFloatingPointTexture,
                            filter: n.filter,
                            wrap: q.CLAMP_TO_EDGE
                        }),
                        h = null;
                    s && (h = new q(r, {
                        isDepthTexture: !0
                    }));
                    var u = r
                            .gl
                            .createFramebuffer(),
                        c = r
                            .gl
                            .createRenderbuffer();
                    this.getWidth = function () {
                        return a
                    },
                    this.getHeight = function () {
                        return o
                    },
                    this.getGlFrameBuffer = function () {
                        return u
                    },
                    this.getDepthRenderBuffer = function () {
                        return c
                    },
                    this.getTextureColor = function () {
                        return l
                    },
                    this.getTextureDepth = function () {
                        return h
                    },
                    this.setFilter = function (t) {
                        l.filter = t,
                        l.setSize(a, o)
                    },
                    this.setSize = function (t, e) {
                        if (
                            t < 2 && (t = 2),
                            e < 2 && (e = 2),
                            a = Math.ceil(t),
                            o = Math.ceil(e),
                            H.profileFrameBuffercreate++,
                            r.gl.bindFramebuffer(r.gl.FRAMEBUFFER, u),
                            r.gl.bindRenderbuffer(r.gl.RENDERBUFFER, c),
                            l.setSize(a, o),
                            h && h.setSize(a, o),
                            s && r.gl.renderbufferStorage(r.gl.RENDERBUFFER, r.gl.DEPTH_COMPONENT16, a, o),
                            r.gl.framebufferTexture2D(r.gl.FRAMEBUFFER, r.gl.COLOR_ATTACHMENT0, r.gl.TEXTURE_2D, l.tex, 0),
                            s && (
                                r.gl.framebufferRenderbuffer(r.gl.FRAMEBUFFER, r.gl.DEPTH_ATTACHMENT, r.gl.RENDERBUFFER, c),
                                r.gl.framebufferTexture2D(r.gl.FRAMEBUFFER, r.gl.DEPTH_ATTACHMENT, r.gl.TEXTURE_2D, h.tex, 0)
                            ),
                            !r.gl.isFramebuffer(u)
                        ) 
                            throw "Invalid framebuffer";
                        var i = r
                            .gl
                            .checkFramebufferStatus(r.gl.FRAMEBUFFER);
                        switch (i) {
                            case r.gl.FRAMEBUFFER_COMPLETE:
                                break;
                            case r.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                                throw console.log("FRAMEBUFFER_INCOMPLETE_ATTACHMENT...", a, o, l.tex, c),
                                new Error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                            case r.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                                throw console.log("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"),
                                new Error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                            case r.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                                throw console.log("FRAMEBUFFER_INCOMPLETE_DIMENSIONS"),
                                new Error("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                            case r.gl.FRAMEBUFFER_UNSUPPORTED:
                                throw console.log("FRAMEBUFFER_UNSUPPORTED"),
                                new Error("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED");
                            default:
                                throw console.log("incomplete framebuffer", i),
                                new Error("Incomplete framebuffer: " + i)
                        }
                        r
                            .gl
                            .bindTexture(r.gl.TEXTURE_2D, null),
                        r
                            .gl
                            .bindRenderbuffer(r.gl.RENDERBUFFER, null),
                        r
                            .gl
                            .bindFramebuffer(r.gl.FRAMEBUFFER, null)
                    },
                    this.renderStart = function () {
                        r.pushModelMatrix(),
                        r
                            .gl
                            .bindFramebuffer(r.gl.FRAMEBUFFER, u),
                        r.pushGlFrameBuffer(u),
                        r.pushFrameBuffer(this),
                        r.pushPMatrix(),
                        r
                            .gl
                            .viewport(0, 0, a, o),
                        r
                            .gl
                            .clearColor(0, 0, 0, 0),
                        r
                            .gl
                            .clear(r.gl.COLOR_BUFFER_BIT | r.gl.DEPTH_BUFFER_BIT)
                    },
                    this.renderEnd = function () {
                        r.popPMatrix(),
                        r
                            .gl
                            .bindFramebuffer(r.gl.FRAMEBUFFER, r.popGlFrameBuffer()),
                        r.popFrameBuffer(),
                        r.popModelMatrix(),
                        r.resetViewPort()
                    },
                    this.delete = function () {
                        l.delete(),
                        h && h.delete(),
                        r
                            .gl
                            .deleteRenderbuffer(c),
                        r
                            .gl
                            .deleteFramebuffer(u)
                    },
                    this.setSize(a, o)
                } else 
                    r.exitError("NO_DEPTH_TEXTURE", "no depth texture support")
            },
            Framebuffer2: Z,
            Geometry: Q,
            Marker: function (t) {
                var e = new Q("marker");
                e.setPointVertices([
                    1e-5,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1e-5,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1e-5,
                    0,
                    0,
                    1
                ]);
                var i = new et(t, e, t.gl.LINES);
                i.setGeom(e);
                var n = new lt(t, "markermaterial"),
                    r = "".endl() + "precision highp float;".endl() + "IN vec3 axisColor;".endl() +
                            "void main()".endl() + "{".endl() + "    vec4 col=vec4(axisColor,1.0);".endl() +
                            "    outColor = col;".endl() + "}",
                    s = "".endl() + "IN vec3 vPosition;".endl() + "UNI mat4 projMatrix;".endl() + "UNI mat4 mvMatrix;".endl() +
                            "OUT vec3 axisColor;".endl() + "void main()".endl() + "{".endl() + ( "   vec4 pos" +
                        "=vec4(vPosition, 1.0);".endl() +
                        "   if(pos.x!=0.0)axisColor=vec3(1.0,0.3,0.0);".endl() + ( "   if(pos.y!=0.0)axis" +
                        "Color=vec3(0.0,1.0,0.2);".endl() + ( "   if(pos.z!=0.0)axisColor=vec3(0.0,0.5,1." +
                        "0);".endl() + "   gl_Position = projMatrix * mvMatrix * pos;".endl() + "}";
                n.setSource(s, r),
                this._vScale = vec3.create(),
                this.draw = function (t) {
                    t.pushModelMatrix(),
                    t.setShader(n),
                    vec3.set(this._vScale, 2, 2, 2),
                    mat4.scale(t.mvMatrix, t.mvMatrix, this._vScale),
                    t.pushDepthTest(!1),
                    i.render(t.getShader()),
                    t.popDepthTest(),
                    t.setPreviousShader(),
                    t.popModelMatrix()
                }
            },
            WirePoint: function (t, e) {
                var i = t
                        .gl
                        .createBuffer(),
                    n = vec3.create();
                this.render = function (t, e) {
                    t.pushModelMatrix(),
                    vec3.set(n, e, e, e),
                    mat4.scale(t.mvMatrix, t.mvMatrix, n);
                    var r = t.getShader();
                    r.bind(),
                    t
                        .gl
                        .bindBuffer(t.gl.ARRAY_BUFFER, i),
                    t
                        .gl
                        .vertexAttribPointer(r.getAttrVertexPos(), i.itemSize, t.gl.FLOAT, !1, 0, 0),
                    t
                        .gl
                        .enableVertexAttribArray(r.getAttrVertexPos()),
                    t
                        .gl
                        .bindBuffer(t.gl.ARRAY_BUFFER, i),
                    t
                        .gl
                        .drawArrays(t.gl.LINE_STRIP, 0, i.numItems),
                    t.popModelMatrix()
                },
                function () {
                    var e = [],
                        n = 0,
                        r = 0;
                    for (n = 0; n <= Math.round(24); n++) 
                        r = 360 / Math.round(24) * n * ht,
                        e.push(.5 * Math.cos(r)),
                        e.push(0),
                        e.push(.5 * Math.sin(r));
                    for (n = 0; n <= Math.round(24); n++) 
                        r = 360 / Math.round(24) * n * ht,
                        e.push(.5 * Math.cos(r)),
                        e.push(.5 * Math.sin(r)),
                        e.push(0);
                    for (n = 0; n <= Math.round(24); n++) 
                        r = 360 / Math.round(24) * n * ht,
                        e.push(0),
                        e.push(.5 * Math.cos(r)),
                        e.push(.5 * Math.sin(r));
                    t
                        .gl
                        .bindBuffer(t.gl.ARRAY_BUFFER, i),
                    t
                        .gl
                        .bufferData(t.gl.ARRAY_BUFFER, new Float32Array(e), t.gl.STATIC_DRAW),
                    i.itemSize = 3,
                    i.numItems = e.length / i.itemSize
                }()
            },
            WireCube: function (t) {
                var e,
                    i = t
                        .gl
                        .createBuffer(),
                    n = vec3.create();
                this.render = function (t, e, r, s) {
                    t.pushModelMatrix(),
                    vec3.set(n, e || 1, r || 1, s || 1),
                    mat4.scale(t.mvMatrix, t.mvMatrix, n);
                    var a = t.getShader();
                    a.bind(),
                    t
                        .gl
                        .bindBuffer(t.gl.ARRAY_BUFFER, i),
                    t
                        .gl
                        .vertexAttribPointer(a.getAttrVertexPos(), i.itemSize, t.gl.FLOAT, !1, 0, 0),
                    t
                        .gl
                        .enableVertexAttribArray(a.getAttrVertexPos()),
                    t
                        .gl
                        .bindBuffer(t.gl.ARRAY_BUFFER, i),
                    t
                        .gl
                        .drawArrays(t.gl.LINE_STRIP, 0, i.numItems),
                    t.popModelMatrix()
                },
                (e = []).push(-1, -1, 1),
                e.push(1, -1, 1),
                e.push(1, 1, 1),
                e.push(-1, 1, 1),
                e.push(-1, -1, 1),
                e.push(-1, -1, -1),
                e.push(1, -1, -1),
                e.push(1, 1, -1),
                e.push(-1, 1, -1),
                e.push(-1, -1, -1),
                e.push(-1, -1, -1),
                e.push(-1, 1, -1),
                e.push(-1, 1, 1),
                e.push(-1, -1, 1),
                e.push(-1, -1, -1),
                e.push(1, -1, -1),
                e.push(1, 1, -1),
                e.push(1, 1, 1),
                e.push(1, -1, 1),
                e.push(1, -1, -1),
                t
                    .gl
                    .bindBuffer(t.gl.ARRAY_BUFFER, i),
                t
                    .gl
                    .bufferData(t.gl.ARRAY_BUFFER, new Float32Array(e), t.gl.STATIC_DRAW),
                i.itemSize = 3,
                i.numItems = e.length / i.itemSize
            },
            MatrixStack: ft,
            Mesh: et,
            MESH: tt,
            ShaderLibMods: rt,
            Shader: lt,
            Uniform: J,
            MESHES: it,
            Context: gt,
            Texture: q,
            TextureEffect: nt,
            isWindows: ut,
            getWheelSpeed: pt,
            getWheelDelta: dt,
            onLoadingAssetsFinished: null,
            profileData: H
        }, $.BLEND_MODES, $.SHADER, $.MATH, $.BLEND_MODES);
        window.CGL = _t;
        const mt = function (t) {
            this._loadingAssets = {},
            this._cbFinished = [],
            this._percent = 0,
            this._count = 0,
            this._countFinished = 0,
            this._order = 0,
            this._startTime = 0,
            this._patch = t
        };
        mt.prototype.setOnFinishedLoading = function (t) {
            this
                ._cbFinished
                .push(t)
        },
        mt.prototype.getNumAssets = function () {
            return this._countFinished
        },
        mt.prototype.getProgress = function () {
            return this._percent
        },
        mt.prototype.checkStatus = function () {
            for (var t in this._countFinished = 0, this._count = 0, this._loadingAssets) 
                this._count++,
                this
                    ._loadingAssets[t]
                    .finished || this._countFinished++;
            if (
                this._percent = (this._count - this._countFinished) / this._count,
                0 === this._countFinished
            ) {
                for (var e = 0; e < this._cbFinished.length; e++) 
                    setTimeout(this._cbFinished[e], 200);
                this.print()
            }
        },
        mt.prototype.print = function () {
            if (!this._patch.silent) {
                var t = [];
                for (var e in this._loadingAssets) 
                    t.push([
                        this
                            ._loadingAssets[e]
                            .order,
                        this
                            ._loadingAssets[e]
                            .type,
                        this
                            ._loadingAssets[e]
                            .name,
                        (this._loadingAssets[e].timeEnd - this._loadingAssets[e].timeStart) / 1e3 + "s"
                    ]);
                console.groupCollapsed(
                    "finished loading " + this._order + " assets in " + (
                        Date.now() - this._startTime
                    ) / 1e3 + "s"
                ),
                console.table(t),
                console.groupEnd()
            }
        },
        mt.prototype.finished = function (t) {
            this._loadingAssets[t] && (
                this._loadingAssets[t].finished = !0,
                this._loadingAssets[t].timeEnd = Date.now()
            ),
            this.checkStatus()
        },
        mt.prototype.start = function (t, e) {
            0 == this._startTime && (this._startTime = Date.now());
            var i = b();
            return this._loadingAssets[i] = {
                id: i,
                type: t,
                name: e,
                finished: !1,
                timeStart: Date.now(),
                order: this._order
            },
            this._order++,
            i
        };
        const vt = function () {
            this._loops = [],
            this._indizes = [],
            this._index = 0
        };
        vt.prototype.pushLoop = function (t) {
            this
                ._loops
                .push(Math.abs(Math.floor(t))),
            this
                ._indizes
                .push(this._index)
        },
        vt.prototype.popLoop = function () {
            this
                ._loops
                .pop(),
            this._index = this
                ._indizes
                .pop(),
            0 === this._loops.length && (this._index = 0)
        },
        vt.prototype.numLoops = function () {
            return this._loops.length
        },
        vt.prototype.numCycles = function () {
            if (0 === this._loops.length) 
                return 0;
            for (var t = this._loops[0], e = 1; e < this._loops.length; e++) 
                t *= this._loops[e];
            return t
        },
        vt.prototype.inLoop = function () {
            return this._loops.length > 0
        },
        vt.prototype.increment = function () {
            this._index++
        },
        vt.prototype.index = function () {
            return this._index
        };
        const bt = function () {
                var t = {},
                    e = null,
                    i = 0;
                this.getItems = function () {
                    return t
                },
                this.clear = function () {
                    t = {}
                },
                this.add = function (n, r) {
                    null !== e && (r && r.id == e || t[e] && (
                        t[e].timeUsed += performance.now() - i,
                        (!t[e].peakTime || at() - t[e].peakTime > 5e3) && (
                            t[e].peak > 1 && r && console.log("PEAK ", r.parent.objName),
                            t[e].peak = 0,
                            t[e].peakTime = at()
                        ),
                        t[e].peak = Math.max(t[e].peak, performance.now() - i)
                    )),
                    null !== r
                        ? (
                            t[r.id] || (t[r.id] = {
                                numTriggers: 0,
                                timeUsed: 0
                            }),
                            t[r.id].numTriggers++,
                            t[r.id].title = r.parent.name + r.name,
                            e = r.id,
                            i = performance.now()
                        )
                        : e = null
                },
                this.print = function () {
                    for (var e in console.log("--------"), t) 
                        console.log(t[e].title + ": " + t[e].numTriggers + " / " + t[e].timeUsed)
                }
            },
            Mt = function (t) {
                this._patch = t,
                this.result = []
            };
        Mt.MIDI = 0,
        Mt.POINTERLOCK = 1,
        Mt.WEBAUDIO = 2,
        Mt.WEBGL2 = 3,
        (Mt.infos = [])[Mt.POINTERLOCK] = {
            title: "pointerLock",
            caniuse: "https://caniuse.com/#search=pointerlock"
        },
        Mt.infos[Mt.MIDI] = {
            title: "midi API",
            caniuse: "https://caniuse.com/#search=midi"
        },
        Mt.infos[Mt.WEBAUDIO] = {
            title: "web audio",
            caniuse: "https://caniuse.com/#search=webaudio"
        },
        Mt.infos[Mt.WEBGL2] = {
            title: "WebGL 2"
        },
        Mt.prototype.checkRequirement = function (t, e) {
            switch (this.result = [], t) {
                case Mt.WEBGL2:
                    return e.patch.cgl.glVersion >= 2;
                case Mt.POINTERLOCK:
                    return "exitPointerLock" in document;
                case Mt.MIDI:
                    return "MIDIAccess" in window;
                case Mt.WEBAUDIO:
                    var i = !1;
                    return window.audioContext && (i = !0),
                    !i && ("webkitAudioContext" in window || "AudioContext" in window) && (i = !0),
                    i
            }
        },
        Mt.prototype.checkOp = function (t) {
            if (t && t.requirements) 
                for (var e = 0; e < t.requirements.length; e++) {
                    var i = t.requirements[e];
                    if (!this.result[i]) {
                        var n = this.checkRequirement(i, t);
                        if (!n) 
                            throw t.patch.cgl && t.patch.cgl.canvas && t
                                .patch
                                .cgl
                                .canvas
                                .remove(),
                            Mt
                                .infos[i]
                                .title,
                            Mt
                                .infos[i]
                                .caniuse && (Mt.infos[i].caniuse, Mt.infos[i].title, t.objName),
                            "this browser does not meet requirement: " + Mt
                                .infos[i]
                                .title + " (" + t.objName + ")";
                        this.result[i] = {
                            success: n,
                            info: Mt.infos[i]
                        }
                    }
                }
            };
        const Et = function (t) {
            f.apply(this),
            this.ops = [],
            this.settings = {},
            this.timer = new ot,
            this.freeTimer = new ot,
            this.animFrameOps = [],
            this.animFrameCallbacks = [],
            this.gui = !1,
            this.silent = !1,
            this.profiler = null,
            this.onLoadStart = null,
            this.onLoadEnd = null,
            this.aborted = !1,
            this.loading = new mt(this),
            this._crashedOps = [],
            this._perf = {
                fps: 0,
                ms: 0,
                _fpsFrameCount: 0,
                _fpsMsCount: 0,
                _fpsStart: 0
            },
            this._volumeListeners = [],
            this._paused = !1,
            this._frameNum = 0,
            this.instancing = new vt,
            this.onOneFrameRendered = null,
            this.namedTriggers = {},
            this._origData = null,
            this._frameNext = 0,
            this._frameInterval = 0,
            this._lastFrameTime = 0,
            this._frameWasdelayed = !0,
            this.config = t || {
                glCanvasResizeToWindow: !1,
                prefixAssetPath: "",
                silent: !1,
                onError: null,
                onFinishedLoading: null,
                onFirstFrameRendered: null,
                onPatchLoaded: null,
                fpsLimit: 0
            },
            this
                .config
                .hasOwnProperty("doRequestAnimation") || (this.config.doRequestAnimation = !0),
            this.config.prefixAssetPath || (this.config.prefixAssetPath = ""),
            this.config.masterVolume || (this.config.masterVolume = 1),
            this._variables = {},
            t && t.variables && (this._variables = t.variables || {}),
            this._variableListeners = [],
            this.vars = {},
            t && t.vars && (this.vars = t.vars),
            this.cgl = new gt(this),
            this
                .cgl
                .setCanvas(this.config.glCanvasId || this.config.glCanvas || "glcanvas"),
            !0 === this.config.glCanvasResizeToWindow && this
                .cgl
                .setAutoResize("window"),
            !0 === this.config.glCanvasResizeToParent && this
                .cgl
                .setAutoResize("parent"),
            this
                .loading
                .setOnFinishedLoading(this.config.onFinishedLoading),
            this.cgl.aborted && (this.aborted = !0),
            this.cgl.silent && (this.silent = !0),
            this
                .freeTimer
                .play(),
            this.exec(),
            this.aborted || (
                this.config.patch
                    ? (this.deSerialize(this.config.patch), this.timer.play())
                    : this.config.patchFile && (R(this.config.patchFile, (t, e) => {
                        var i = JSON.parse(e);
                        if (t) 
                            return console.error("err", t),
                            console.error("data", i),
                            void console.error("data", i.msg);
                        this.deSerialize(i)
                    }), this.timer.play())
            ),
            console.log("Los Camillo ‎– Caramba 'La Cucaracha'")
        };
        Et.prototype.isPlaying = function () {
            return !this._paused
        },
        Et.prototype.renderOneFrame = function () {
            this._paused = !0,
            this._renderOneFrame = !0,
            this.exec(),
            this._renderOneFrame = !1
        },
        Et.prototype.getFPS = function () {
            return this._fps
        },
        Et.prototype.isEditorMode = function () {
            return !0 === this.config.editorMode
        },
        Et.prototype.pause = function () {
            this._paused = !0,
            this
                .freeTimer
                .pause()
        },
        Et.prototype.resume = function () {
            this._paused && (this._paused = !1, this.freeTimer.play(), this.exec())
        },
        Et.prototype.setVolume = function (t) {
            this.config.masterVolume = t;
            for (var e = 0; e < this._volumeListeners.length; e++) 
                this
                    ._volumeListeners[e]
                    .onMasterVolumeChanged(t)
            },
        Et.prototype.getFilePath = function (t) {
            return t
                ? 0 === t.indexOf("https:") || 0 === t.indexOf("http:")
                    ? t
                    : (
                        t = t.replace("//", "/"),
                        this.config.prefixAssetPath + t + (this.config.suffixAssetPath || "")
                    )
                : t
        },
        Et.prototype.clear = function () {
            for (
                this.cgl.TextureEffectMesh = null,
                this.animFrameOps.length = 0,
                this.timer = new ot;
                this.ops.length > 0;
            ) 
                this.deleteOp(this.ops[0].id)
        },
        Et.getOpClass = function (t) {
            var e = t.split("."),
                i = null;
            try {
                return 2 == e.length
                    ? i = window[e[0]][e[1]]
                    : 3 == e.length
                        ? i = window[e[0]][e[1]][e[2]]
                        : 4 == e.length
                            ? i = window[e[0]][e[1]][e[2]][e[3]]
                            : 5 == e.length
                                ? i = window[e[0]][e[1]][e[2]][e[3]][e[4]]
                                : 6 == e.length
                                    ? i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]]
                                    : 7 == e.length
                                        ? i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]]
                                        : 8 == e.length
                                            ? i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]][e[7]]
                                            : 9 == e.length
                                                ? i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]][e[7]][e[8]]
                                                : 10 == e.length && (
                                                    i = window[e[0]][e[1]][e[2]][e[3]][e[4]][e[5]][e[6]][e[7]][e[8]][e[9]]
                                                ),
                i
            } catch (t) {
                return null
            }
        },
        Et.prototype.createOp = function (t, e) {
            var i = t.split("."),
                n = null,
                r = "";
            try {
                if (-1 == t.indexOf("Ops.")) {
                    var s = t;
                    if (!CABLES.OPS[s]) 
                        throw "could not find op by id: " + s;
                    r = CABLES
                        .OPS[s]
                        .objName,
                    (n = new CABLES.OPS[s].f(this, r, e, s)).opId = s
                }
                if (!n) {
                    if (!Et.getOpClass(r = t)) 
                        throw this.emitEvent("criticalError", "unknown op", "unknown op: " + r),
                        console.error("unknown op: " + r),
                        new Error("unknown op: " + r);
                    if (
                        2 == i.length
                            ? n = new window[i[0]][i[1]](this, r, e)
                            : 3 == i.length
                                ? n = new window[i[0]][i[1]][i[2]](this, r, e)
                                : 4 == i.length
                                    ? n = new window[i[0]][i[1]][i[2]][i[3]](this, r, e)
                                    : 5 == i.length
                                        ? n = new window[i[0]][i[1]][i[2]][i[3]][i[4]](this, r, e)
                                        : 6 == i.length
                                            ? n = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]](this, r, e)
                                            : 7 == i.length
                                                ? n = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]](this, r, e)
                                                : 8 == i.length
                                                    ? n = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]][i[7]](this, r, e)
                                                    : 9 == i.length
                                                        ? n = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]][i[7]][i[8]](
                                                            this,
                                                            r,
                                                            e
                                                        )
                                                        : 10 == i.length
                                                            ? n = new window[i[0]][i[1]][i[2]][i[3]][i[4]][i[5]][i[6]][i[7]][i[8]][i[9]](
                                                                this,
                                                                r,
                                                                e
                                                            )
                                                            : console.log("parts.length", i.length),
                        n
                    ) 
                        for (var a in n.opId = null, CABLES.OPS) 
                            CABLES
                                .OPS[a]
                                .objName == r && (n.opId = a)
                    }
            } catch (t) {
                if (
                    this._crashedOps.push(r),
                    this.emitEvent("exceptionOp", t, r),
                    !this.isEditorMode
                ) 
                    throw console.log(t),
                    console.error("[instancing error] " + r, t),
                    CABLES.api && CABLES
                        .api
                        .sendErrorReport(t),
                    this.exitError("INSTANCE_ERR", "Instancing Error " + r),
                    "instancing error " + r
            }
            return n && (n.objName = r, n.patch = this),
            n
        },
        Et.prototype.addOp = function (t, e, i) {
            var n = this.createOp(t, i);
            return n && (
                n.uiAttr(e),
                n.onCreate && n.onCreate(),
                n.hasOwnProperty("onAnimFrame") && this.animFrameOps.push(n),
                n.hasOwnProperty("onMasterVolumeChanged") && this._volumeListeners.push(n),
                this.ops.push(n),
                this.emitEvent("onOpAdd", n),
                n.init && n.init()
            ),
            n
        },
        Et.prototype.addOnAnimFrame = function (t) {
            this
                .animFrameOps
                .push(t)
        },
        Et.prototype.removeOnAnimFrame = function (t) {
            for (var e = 0; e < this.animFrameOps.length; e++) 
                if (this.animFrameOps[e] == t) 
                    return void this
                        .animFrameOps
                        .splice(e, 1)
            },
        Et.prototype.addOnAnimFrameCallback = function (t) {
            this
                .animFrameCallbacks
                .push(t)
        },
        Et.prototype.removeOnAnimCallback = function (t) {
            for (var e = 0; e < this.animFrameCallbacks.length; e++) 
                if (this.animFrameCallbacks[e] == t) 
                    return void this
                        .animFrameCallbacks
                        .splice(e, 1)
            },
        Et.prototype.deleteOp = function (t, e) {
            for (var i in this.ops) 
                if (this.ops[i].id == t) {
                    var n = null,
                        r = null;
                    if (this.ops[i]) {
                        e && this
                            .ops[i]
                            .portsIn
                            .length > 0 && this
                            .ops[i]
                            .portsIn[0]
                            .isLinked() && this
                            .ops[i]
                            .portsOut
                            .length > 0 && this
                            .ops[i]
                            .portsOut[0]
                            .isLinked() && this
                            .ops[i]
                            .portsIn[0]
                            .getType() == this
                            .ops[i]
                            .portsOut[0]
                            .getType() && (
                                n = this.ops[i].portsIn[0].links[0].getOtherPort(this.ops[i].portsIn[0]),
                                r = this.ops[i].portsOut[0].links[0].getOtherPort(this.ops[i].portsOut[0])
                            );
                        var s = this.ops[i];
                        s.removeLinks(),
                        this.onDelete && (
                            console.log("deprecated this.onDelete", this.onDelete),
                            this.onDelete(s)
                        ),
                        this.emitEvent("onOpDelete", s),
                        this
                            .ops
                            .splice(i, 1),
                        s.onDelete && s.onDelete(),
                        s.cleanUp(),
                        null !== n && null !== r && this.link(
                            n.parent,
                            n.getName(),
                            r.parent,
                            r.getName()
                        )
                    }
                }
            },
        Et.prototype.getFrameNum = function () {
            return this._frameNum
        },
        Et.prototype.renderFrame = function (t) {
            this
                .timer
                .update(),
            this
                .freeTimer
                .update();
            for (
                var e = this.timer.getTime(),
                i = 0;
                i < this.animFrameCallbacks.length;
                ++i
            ) 
                this.animFrameCallbacks[i] && this.animFrameCallbacks[i](e, this._frameNum);
            for (i = 0; i < this.animFrameOps.length; ++i) 
                this
                    .animFrameOps[i]
                    .onAnimFrame && this
                    .animFrameOps[i]
                    .onAnimFrame(e);
            this._frameNum++,
            1 == this._frameNum && this.config.onFirstFrameRendered && this
                .config
                .onFirstFrameRendered()
        },
        Et.prototype.exec = function (t) {
            if (this._renderOneFrame || !this._paused && !this.aborted) {
                this.config.fpsLimit = this.config.fpsLimit || 0,
                this.config.fpsLimit && (this._frameInterval = 1e3 / this.config.fpsLimit);
                var e = CABLES.now(),
                    i = e - this._frameNext;
                if (this.isEditorMode() && !this._renderOneFrame && e - this._lastFrameTime >= 500 && 0 !== this._lastFrameTime && !this._frameWasdelayed) 
                    return this._lastFrameTime = 0,
                    setTimeout(this.exec.bind(this), 500),
                    this.emitEvent("renderDelayStart"),
                    void(this._frameWasdelayed = !0);
                if (this._renderOneFrame || 0 === this.config.fpsLimit || i > this._frameInterval || this._frameWasdelayed) {
                    var n = CABLES.now();
                    this.renderFrame(),
                    this._perf._fpsMsCount += CABLES.now() - n,
                    this._frameInterval && (this._frameNext = e - i % this._frameInterval)
                }
                this._frameWasdelayed && (
                    this.emitEvent("renderDelayEnd"),
                    this._frameWasdelayed = !1
                ),
                this._renderOneFrame && this.onOneFrameRendered && (
                    this.onOneFrameRendered(),
                    this._renderOneFrame = !1
                ),
                CABLES.now() - this._perf._fpsStart >= 1e3 && this._perf.fps != this._perf._fpsFrameCount && (
                    this._perf.fps = this._perf._fpsFrameCount,
                    this._perf.ms = Math.round(this._perf._fpsMsCount / this._perf._fpsFrameCount),
                    this.emitEvent("performance", this._perf),
                    this._perf._fpsFrameCount = 0,
                    this._perf._fpsMsCount = 0,
                    this._perf._fpsStart = CABLES.now()
                ),
                this._perf._lastFrameTime = CABLES.now(),
                this._perf._fpsFrameCount++,
                this.config.doRequestAnimation && requestAnimationFrame(this.exec.bind(this))
            }
        },
        Et.prototype.link = function (t, e, i, n) {
            if (t) 
                if (i) {
                    var r = t.getPort(e),
                        s = i.getPort(n);
                    if (r) 
                        if (s) {
                            if (!r.shouldLink(r, s) || !s.shouldLink(r, s)) 
                                return !1;
                            if (z.canLink(r, s)) {
                                var a = new z(this);
                                return a.link(r, s),
                                this.emitEvent("onLink", r, s, a),
                                a
                            }
                        } else 
                            console.warn("port not found! " + n + " of " + i.name + "(" + i.objName + ")");
                else 
                        console.warn("port not found! " + e + "(" + t.objName + ")")
                } else 
                    console.log("link: op2 is null");
        else 
                console.log("link: op1 is null ")
        },
        Et.prototype.serialize = function (t) {
            var e = {
                ops: []
            };
            for (var i in e.settings = this.settings, this.ops) 
                e
                    .ops
                    .push(this.ops[i].getSerialized());
            return t
                ? e
                : JSON.stringify(e)
        },
        Et.prototype.getOpById = function (t) {
            for (var e in this.ops) 
                if (this.ops[e].id == t) 
                    return this.ops[e]
        },
        Et.prototype.getOpsByName = function (t) {
            var e = [];
            for (var i in this.ops) 
                this
                    .ops[i]
                    .name == t && e.push(this.ops[i]);
            return e
        },
        Et.prototype.getOpsByObjName = function (t) {
            var e = [];
            for (var i in this.ops) 
                this
                    .ops[i]
                    .objName == t && e.push(this.ops[i]);
            return e
        },
        Et.prototype.loadLib = function (t) {
            y("/ui/libs/" + t + ".js", (t, e) => {
                var i = document.createElement("script");
                i.type = "text/javascript",
                i.text = e,
                document
                    .getElementsByTagName("head")[0]
                    .appendChild(i)
            }, "GET")
        },
        Et.prototype.reloadOp = function (t, e) {
            var i = 0,
                n = [],
                r = [];
            for (var s in this.ops) 
                this
                    .ops[s]
                    .objName == t && r.push(this.ops[s]);
            for (s = 0; s < r.length; s++) {
                i++;
                var a = r[s];
                a.deleted = !0;
                var o,
                    l,
                    h = this.addOp(t, a.uiAttribs);
                for (o in n.push(h), a.portsIn) 
                    if (0 === a.portsIn[o].links.length) {
                        var u = h.getPort(a.portsIn[o].name);
                        u
                            ? u.set(a.portsIn[o].get())
                            : console.error(
                                "[reloadOp] could not set port " + a.portsIn[o].name + ", propably renamed port" +
                                " ?"
                            )
                    }
                else 
                    for (; a.portsIn[o].links.length;) {
                        var c = a
                                .portsIn[o]
                                .links[0]
                                .portIn
                                .name,
                            p = a
                                .portsIn[o]
                                .links[0]
                                .portOut
                                .name,
                            d = a
                                .portsIn[o]
                                .links[0]
                                .portOut
                                .parent;
                        a
                            .portsIn[o]
                            .links[0]
                            .remove(),
                        (l = this.link(h, c, d, p))
                            ? l.setValue()
                            : console.log(
                                "[reloadOp] relink after op reload not successfull for port " + p
                            )
                    }
                for (o in a.portsOut) 
                    for (; a.portsOut[o].links.length;) {
                        var f = a
                                .portsOut[o]
                                .links[0]
                                .portOut
                                .name,
                            g = a
                                .portsOut[o]
                                .links[0]
                                .portIn
                                .name,
                            _ = a
                                .portsOut[o]
                                .links[0]
                                .portIn
                                .parent;
                        a
                            .portsOut[o]
                            .links[0]
                            .remove(),
                        (l = this.link(h, f, _, g))
                            ? l.setValue()
                            : console.log("relink after op reload not successfull for port " + g)
                    }
                this.deleteOp(a.id)
            }
            e(i, n)
        },
        Et.prototype.getSubPatchOps = function (t) {
            var e = [];
            for (var i in this.ops) 
                this
                    .ops[i]
                    .uiAttribs && this
                    .ops[i]
                    .uiAttribs
                    .subPatch == t && e.push(this.ops[i]);
            return e
        },
        Et.prototype.getSubPatchOp = function (t, e) {
            for (var i in this.ops) 
                if (this.ops[i].uiAttribs && this.ops[i].uiAttribs.subPatch == t && this.ops[i].objName == e) 
                    return this.ops[i];
        return !1
        },
        Et.prototype.deSerialize = function (t, e) {
            if (!this.aborted) {
                var i = this
                    .loading
                    .start("core", "deserialize");
                this.onLoadStart && this.onLoadStart(),
                this.namespace = t.namespace || "",
                this.name = t.name || "",
                "string" == typeof t && (t = JSON.parse(t));
                var n = this;
                this.settings = t.settings;
                var r,
                    s,
                    a,
                    o,
                    l = new Mt(this);
                for (var h in t.ops) {
                    var u = CABLES.now(),
                        c = t.ops[h],
                        p = null;
                    try {
                        p = c.opId
                            ? this.addOp(c.opId, c.uiAttribs, c.id)
                            : this.addOp(c.objName, c.uiAttribs, c.id)
                    } catch (t) {
                        throw console.warn("[instancing error] op data:", c),
                        "instancing error: " + c.objName
                    }
                    if (l.checkOp(p), p) {
                        for (
                            var d in e && (p.id = v()),
                            p.portsInData = c.portsIn,
                            p._origData = c,
                            c.portsIn
                        ) {
                            var f = c.portsIn[d],
                                g = p.getPort(f.name);
                            if (
                                !g || "bool" != g.uiAttribs.display && "bool" != g.uiAttribs.type || isNaN(f.value) || (f.value = !0 === f.value),
                                g && void 0 !== f.value && g.type != P.OP.OP_PORT_TYPE_TEXTURE && g.set(f.value),
                                g && f && f.animated && g.setAnimated(f.animated),
                                g && f && f.anim
                            ) 
                                for (
                                    var _ in g.anim || (g.anim = new V),
                                    f.anim.loop && (g.anim.loop = f.anim.loop),
                                    f.anim.keys
                                ) 
                                    g
                                        .anim
                                        .keys
                                        .push(new C.Key(f.anim.keys[_]))
                            }
                        for (var m in c.portsOut) {
                            var b = p.getPort(c.portsOut[m].name);
                            b && b.type != P.OP.OP_PORT_TYPE_TEXTURE && c
                                .portsOut[m]
                                .hasOwnProperty("value") && b.set(t.ops[h].portsOut[m].value)
                        }
                    }
                    Math.round(100 * (CABLES.now() - u))
                }
                for (var M in this.ops) 
                    this
                        .ops[M]
                        .onLoadedValueSet && (
                            this.ops[M].onLoadedValueSet(this.ops[M]._origData),
                            this.ops[M].onLoadedValueSet = null,
                            this.ops[M]._origData = null
                        );
                if (t.ops) 
                    for (h = 0; h < t.ops.length; h++) 
                        if (t.ops[h].portsIn) 
                            for (var E = 0; E < t.ops[h].portsIn.length; E++) 
                                if (t.ops[h].portsIn[E].links) 
                                    for (var I = 0; I < t.ops[h].portsIn[E].links.length; I++) 
                                        t
                                            .ops[h]
                                            .portsIn[E]
                                            .links[I] && (
                                                r = t.ops[h].portsIn[E].links[I].objIn,
                                                s = t.ops[h].portsIn[E].links[I].objOut,
                                                a = t.ops[h].portsIn[E].links[I].portIn,
                                                o = t.ops[h].portsIn[E].links[I].portOut,
                                                n.link(n.getOpById(r), a, n.getOpById(s), o)
                                            );
                for (var M in this.ops) 
                    this
                        .ops[M]
                        .onLoaded && (this.ops[M].onLoaded(), this.ops[M].onLoaded = null);
                for (var M in this.ops) 
                    this
                        .ops[M]
                        .init && (this.ops[M].init(), this.ops[M].init = null);
                if (this.config.variables) 
                    for (var A in this.config.variables) 
                        this.setVarValue(A, this.config.variables[A]);
            setTimeout(() => {
                    this
                        .loading
                        .finished(i)
                }, 100),
                this.config.onPatchLoaded && this
                    .config
                    .onPatchLoaded(),
                this.onLoadEnd && this.onLoadEnd()
            }
        },
        Et.prototype.profile = function (t) {
            for (var e in this.profiler = new bt, this.ops) 
                this
                    .ops[e]
                    .profile(t)
            },
        (Et.Variable = function (t, e) {
            this._name = t,
            this._changeListeners = [],
            this.setValue(e)
        }).prototype.getValue = function () {
            return this._v
        },
        Et.Variable.prototype.getName = function () {
            return this._name
        },
        Et.Variable.prototype.setValue = function (t) {
            this._v = t;
            for (var e = 0; e < this._changeListeners.length; e++) 
                this._changeListeners[e](t)
        },
        Et.Variable.prototype.addListener = function (t) {
            this
                ._changeListeners
                .push(t)
        },
        Et.Variable.prototype.removeListener = function (t) {
            var e = this
                ._changeListeners
                .indexOf(t);
            this
                ._changeListeners
                .splice(e, 1)
        },
        Et.prototype.setVariable = function (t, e) {
            this
                ._variables
                .hasOwnProperty(t)
                    ? this
                        ._variables[t]
                        .setValue(e)
                    : console.warn("variable " + t + " not found!")
        },
        Et.prototype.setVarValue = function (t, e) {
            return this
                ._variables
                .hasOwnProperty(t)
                    ? this
                        ._variables[t]
                        .setValue(e)
                    : (
                        this._variables[t] = new Et.Variable(t, e),
                        this.emitEvent("variablesChanged")
                    ),
            this._variables[t]
        },
        Et.prototype.getVarValue = function (t, e) {
            if (this._variables.hasOwnProperty(t)) 
                return this
                    ._variables[t]
                    .getValue()
            },
        Et.prototype.getVar = function (t) {
            if (this._variables.hasOwnProperty(t)) 
                return this._variables[t]
        },
        Et.prototype.getVars = function () {
            return this._variables
        },
        Et.prototype.getVars = function () {
            return this._variables
        },
        Et.prototype.exitError = function (t, e) {
            this && this.config && this.config.onError && (
                this.config.onError(t, e),
                this.aborted = !0
            )
        },
        Et.prototype.preRenderOps = function () {
            console.log("prerendering...");
            var t = null;
            CABLES.StopWatch && (t = new CABLES.StopWatch("prerendering"));
            for (var e = 0; e < this.ops.length; e++) 
                this
                    .ops[e]
                    .preRender && (
                        this.ops[e].preRender(),
                        console.log("prerender " + this.ops[e].objName)
                    );
            t && t.stop("prerendering")
        },
        Et.prototype.dispose = function () {
            this.pause(),
            this.clear()
        };
        var It = Et;
        const At = {
                addPatch: function (t, e) {
                    var i = t,
                        n = b();
                    if ("string" != typeof t || (n = t, i = document.getElementById(n))) {
                        var r = document.createElement("canvas");
                        return r.id = "glcanvas_" + n,
                        r.width = i.clientWidth,
                        r.height = i.clientHeight,
                        window.addEventListener("resize", function () {
                            this.setAttribute("width", i.clientWidth),
                            this.height = i.clientHeight
                        }.bind(r)),
                        i.appendChild(r),
                        (e = e || {}).glCanvasId = r.id,
                        e.onError || (e.onError = function (t) {
                            console.log(t)
                        }),
                        CABLES.patch = new It(e),
                        r
                    }
                    console.error(
                        n + " Polyshape Container Element not found!"
                    )
                }
            },
            xt = {
                LineDrawer: function (t, e) {
                    this._num = 1e5,
                    this._counter = 0,
                    this._positions = new Float32Array(3 * this._num),
                    this._colors = new Float32Array(4 * this._num)
                },
                RectInstancer: function (t, e) {
                    this._counter = 0,
                    this._num = 1e5,
                    this._needsRebuild = !0,
                    this._positions = new Float32Array(3 * this._num),
                    this._colors = new Float32Array(4 * this._num),
                    this._sizes = new Float32Array(2 * this._num),
                    this._shader = new lt(t, "rectinstancer"),
                    this
                        ._shader
                        .setSource(
                            "".endl() + "IN vec3 vPosition;".endl() + "IN vec3 instPos;".endl() + ( "IN vec4 " +
                                    "instCol;".endl() + "IN vec2 instSize;".endl() + "OUT vec4 col;".endl() + ( "UNI " +
                                    "float zoom,resX,resY,scrollX,scrollY;".endl() + "void main()".endl() + "{".endl() +
                                    "    vec3 pos=vPosition;".endl() + "    pos.xy*=instSize;".endl() + ( "    pos.x+" +
                                    "=scrollX;".endl() + "    pos.y+=scrollY;".endl() + "    pos.x+=instPos.x;".endl() +
                                    "    pos.y+=instPos.y;".endl() + "    pos.y=0.0-pos.y;".endl() + ( "    col=instC" +
                                    "ol;".endl() + "    gl_Position = vec4(pos*(1.0/zoom),1.0);".endl() + "}",
                            "IN vec4 col;void main(){outColor=vec4(col.rgb,1.0);}"
                        ),
                    this._uniZoom = new J(this._shader, "f", "zoom", 0),
                    this._uniResX = new J(this._shader, "f", "resX", 500),
                    this._uniResY = new J(this._shader, "f", "resY", 500),
                    this._uniscrollX = new J(this._shader, "f", "scrollX", 0),
                    this._uniscrollY = new J(this._shader, "f", "scrollY", 0),
                    this._geom = new Q("rectinstancer"),
                    this._geom.vertices = new Float32Array([
                        1,
                        1,
                        0,
                        0,
                        1,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]),
                    this._geom.verticesIndices = new Float32Array([
                        2,
                        1,
                        0,
                        3,
                        1,
                        2
                    ]),
                    this._mesh = new et(t, this._geom),
                    this._mesh.numInstances = this._num;
                    var i = 0;
                    for (i = 0; i < 2 * this._num; i++) 
                        this._sizes[i] = 0;
                    for (i = 0; i < 3 * this._num; i++) 
                        this._positions[i] = 0;
                    for (i = 0; i < 4 * this._num; i++) 
                        this._colors[i] = 1
                }
            };
        xt.RectInstancer.prototype.dispose = function () {},
        xt.RectInstancer.prototype.render = function (t, e, i, n, r) {
            this
                ._uniResX
                .set(t),
            this
                ._uniResY
                .set(e),
            this
                ._uniscrollX
                .set(i),
            this
                ._uniscrollY
                .set(n),
            this
                ._uniZoom
                .set(r),
            this._needsRebuild && this.rebuild(),
            this
                ._mesh
                .render(this._shader)
        },
        xt.RectInstancer.prototype.rebuild = function () {
            this
                ._mesh
                .addAttribute("instPos", this._positions, 3, {
                    instanced: !0
                }),
            this
                ._mesh
                .addAttribute("instCol", this._colors, 4, {
                    instanced: !0
                }),
            this
                ._mesh
                .addAttribute("instSize", this._sizes, 2, {
                    instanced: !0
                }),
            this._needsRebuild = !1
        },
        xt.RectInstancer.prototype.getIndex = function () {
            return this._counter++,
            this._counter
        },
        xt.RectInstancer.prototype.setPosition = function (t, e, i) {
            this._positions[3 * t + 0] = e,
            this._positions[3 * t + 1] = i,
            this._needsRebuild = !0
        },
        xt.RectInstancer.prototype.setSize = function (t, e, i) {
            this._sizes[2 * t + 0] = e,
            this._sizes[2 * t + 1] = i,
            this._needsRebuild = !0
        },
        xt.RectInstancer.prototype.setColor = function (t, e, i, n) {
            this._colors[4 * t + 0] = e,
            this._colors[4 * t + 1] = i,
            this._colors[4 * t + 2] = n,
            this._colors[4 * t + 3] = 1,
            this._needsRebuild = !0
        },
        xt.GlRect = function (t, e) {
            e = e || {},
            this._rectInstancer = t,
            this._attrIndex = t.getIndex(),
            this._parent = e.parent || null,
            this.childs = []
        },
        xt.GlRect.prototype.addChild = function (t) {
            this
                .childs
                .push(t)
        },
        xt.GlRect.prototype.setSize = function (t, e) {
            this
                ._rectInstancer
                .setSize(this._attrIndex, t, e)
        },
        xt.GlRect.prototype.setColor = function (t, e, i) {
            this
                ._rectInstancer
                .setColor(this._attrIndex, t, e, i)
        },
        xt.GlRect.prototype.setPosition = function (t, e) {
            this.x = t,
            this.y = e;
            var i = this.x,
                n = this.y;
            this._parent && (i += this._parent.x, n += this._parent.y),
            this
                ._rectInstancer
                .setPosition(this._attrIndex, i, n);
            for (var r = 0; r < this.childs.length; r++) 
                this
                    .childs[r]
                    .setPosition(this.childs[r].x, this.childs[r].y)
            },
        xt.OP_MIN_WIDTH = 100,
        xt.GlOp = function (t, e) {
            this._op = e,
            this._instancer = t,
            this._glRectBg = new xt.GlRect(t),
            this
                ._glRectBg
                .setSize(100, 30),
            this
                ._glRectBg
                .setColor(.1, .1, .1),
            this._portRects = [],
            this.updatePosition();
            for (var i = 0; i < this._op.portsIn.length; i++) 
                this._setupPort(i, this._op.portsIn[i]);
            for (i = 0; i < this._op.portsOut.length; i++) 
                this._setupPort(i, this._op.portsOut[i]);
            const n = 10 * Math.max(this._op.portsIn.length, this._op.portsOut.length);
            this
                ._glRectBg
                .setSize(Math.max(xt.OP_MIN_WIDTH, n), 30)
        },
        xt.GlOp.prototype.dispose = function () {
            this._glRectBg && (
                this._glRectBg.setSize(0, 0),
                this._glRectBg.setPosition(0, 0)
            );
            for (var t = 0; t < this._portRects.length; t++) 
                this
                    ._portRects[t]
                    .setSize(0, 0),
                this
                    ._portRects[t]
                    .setPosition(0, 0);
            this._op = null,
            this._portRects.length = 0,
            this._glRectBg = null,
            this._instancer = null
        },
        xt.GlOp.prototype._setupPort = function (t, e) {
            var i = new xt.GlRect(this._instancer, {parent: this._glRectBg});
            i.setSize(7, 5),
            e.type == P.OP.OP_PORT_TYPE_VALUE
                ? i.setColor(0, 1, .7)
                : e.type == P.OP.OP_PORT_TYPE_FUNCTION
                    ? i.setColor(1, 1, 0)
                    : e.type == P.OP.OP_PORT_TYPE_OBJECT
                        ? i.setColor(1, 0, 1)
                        : e.type == P.OP.OP_PORT_TYPE_ARRAY
                            ? i.setColor(0, .3, 1)
                            : e.type == P.OP.OP_PORT_TYPE_STRING
                                ? i.setColor(1, .3, 0)
                                : e.type == P.OP.OP_PORT_TYPE_DYNAMIC && i.setColor(1, 1, 1);
            var n = 0;
            1 == e.direction && (n = 25),
            i.setPosition(10 * t, n),
            this
                ._glRectBg
                .addChild(i),
            this
                ._portRects
                .push(i)
        },
        xt.GlOp.prototype.updatePosition = function () {
            this._glRectBg
                ? this
                    ._glRectBg
                    .setPosition(this._op.uiAttribs.translate.x, this._op.uiAttribs.translate.y)
                : console.log("no this._glRectBg")
        },
        xt.GlOp.prototype.getOp = function () {
            return this._op
        },
        xt.GlOp.prototype.update = function () {
            this.updatePosition()
        },
        xt.GlPatch = function (t) {
            this._patch = t,
            this._glOps = [],
            this._rectInstancer = new xt.RectInstancer(this._patch.cgl),
            this
                ._rectInstancer
                .rebuild(),
            t.addEventListener("onOpAdd", this.addOp.bind(this)),
            t.addEventListener("onOpDelete", this.deleteOp.bind(this))
        },
        xt.GlPatch.prototype.getOpAt = function (t, e) {},
        xt.GlPatch.prototype.deleteOp = function (t) {
            for (var e = 0; e < this._glOps.length; e++) 
                if (this._glOps[e].getOp() == t) {
                    var i = this._glOps[e];
                    return this
                        ._glOps[e]
                        .getOp()
                        .removeEventListener("onUiAttribsChange", this._glOps[e].update),
                    this
                        ._glOps
                        .slice(e, 1),
                    void i.dispose()
                }
            },
        xt.GlPatch.prototype.addOp = function (t) {
            console.log("OP ADDEDDDDDD");
            const e = new xt.GlOp(this._rectInstancer, t);
            this
                ._glOps
                .push(e),
            t.addEventListener("onUiAttribsChange", e.update.bind(e))
        },
        xt.GlPatch.prototype.render = function (t, e, i, n, r) {
            this
                ._rectInstancer
                .render(t, e, i, n, r)
        },
        xt.GlPatch.prototype.dispose = function () {
            for (; this._glOps.length > 0;) 
                this
                    ._glOps[0]
                    .dispose(),
                this
                    ._glOps
                    .splice(0, 1);
            this._rectInstancer && this
                ._rectInstancer
                .dispose()
        },
        xt.GlPatch.prototype.reset = function () {
            if (
                this._rectInstancer = new xt.RectInstancer(this._patch.cgl),
                this._rectInstancer.rebuild(),
                this.dispose(),
                0 == this._glOps.length
            ) 
                for (var t = 0; t < this._patch.ops.length; t++) 
                    this.addOp(this._patch.ops[t]);
        for (t = 0; t < this._glOps.length; t++) 
                this
                    ._glOps[t]
                    .updatePosition();
            this
                ._rectInstancer
                .rebuild()
        };
        const Ot = {
                toneJsInitialized: !1,
                createAudioContext: function (t) {
                    if (
                        window.AudioContext = window.AudioContext || window.webkitAudioContext,
                        window.AudioContext
                    ) 
                        return window.audioContext || (window.audioContext = new AudioContext),
                        window.Tone && !Ot.toneJsInitialized && (
                            Tone.setContext(window.audioContext),
                            Ot.toneJsInitialized = !0
                        ),
                        window.audioContext;
                    t
                        .patch
                        .config
                        .onError("NO_WEBAUDIO", "Web Audio is not supported in this browser.")
                },
                getAudioContext: function () {
                    return window.audioContext
                },
                createAudioInPort: function (t, e, i, n) {
                    if (!t || !e || !i) {
                        var r = "ERROR: createAudioInPort needs three parameters, op, portName and audioNode";
                        throw t.log(r),
                        new Error(r)
                    }
                    n || (n = 0),
                    t.webAudio = t.webAudio || {},
                    t.webAudio.audioInPorts = t.webAudio.audioInPorts || [];
                    var s = t.inObject(e);
                    return s.webAudio = {},
                    s.webAudio.previousAudioInNode = null,
                    s.webAudio.audioNode = i,
                    t
                        .webAudio
                        .audioInPorts[e] = s,
                    s.onChange = function () {
                        var e = s.get();
                        if (e) 
                            try {
                                e.connect(s.webAudio.audioNode, 0, n)
                            } catch (i) {
                                throw t.log("Error: Failed to connect web audio node!", i),
                                t.log("port.webAudio.audioNode", s.webAudio.audioNode),
                                t.log("audioInNode: ", e),
                                t.log("inputChannelIndex:", n),
                                t.log("audioInNode.connect: ", e.connect),
                                i
                            }
                        else if (s.webAudio.previousAudioInNode) 
                            try {
                                s
                                    .webAudio
                                    .previousAudioInNode
                                    .disconnect(s.webAudio.audioNode, 0, n)
                            } catch (e) {
                                try {
                                    s
                                        .webAudio
                                        .previousAudioInNode
                                        .disconnect(s.webAudio.audioNode)
                                } catch (e) {
                                    throw t.log(
                                        "Disconnecting audio node with in/out port index, as well as without in/out-por" +
                                                "t-index did not work ",
                                        e
                                    ),
                                    e.printStackTrace && e.printStackTrace(),
                                    e
                                }
                            }
                        s.webAudio.previousAudioInNode = e
                    },
                    s
                },
                replaceNodeInPort: function (t, e, i) {
                    var n = t.webAudio.previousAudioInNode;
                    if (n && n.disconnect) {
                        try {
                            n.disconnect(e)
                        } catch (t) {
                            throw t.printStackTrace && t.printStackTrace(),
                            new Error(
                                "replaceNodeInPort: Could not disconnect old audio node. " + t.name + " " + t.message
                            )
                        }
                        t.webAudio.audioNode = i;
                        try {
                            n.connect(i)
                        } catch (t) {
                            throw t.printStackTrace && t.printStackTrace(),
                            new Error(
                                "replaceNodeInPort: Could not connect to new node. " + t.name + " " + t.message
                            )
                        }
                    }
                },
                createAudioOutPort: function (t, e, i) {
                    if (!t || !e || !i) {
                        var n = "ERROR: createAudioOutPort needs three parameters, op, portName and audioNode";
                        throw t.log(n),
                        new Error(n)
                    }
                    var r = t.outObject(e);
                    return r.set(i),
                    r
                },
                createAudioParamInPort: function (t, e, i, n, r) {
                    if (!t || !e || !i) 
                        return t.log(
                            "ERROR: createAudioParamInPort needs three parameters, op, portName and audioNo" +
                            "de"
                        ),
                        t && t.name && t.log("opname: ", t.name),
                        t.log("portName", e),
                        void t.log("audioNode: ", i);
                    t.webAudio = t.webAudio || {},
                    t.webAudio.audioInPorts = t.webAudio.audioInPorts || [];
                    var s = t.inDynamic(e, [
                        P.OP.OP_PORT_TYPE_VALUE, P.OP.OP_PORT_TYPE_OBJECT
                    ], n, r);
                    return s.webAudio = {},
                    s.webAudio.previousAudioInNode = null,
                    s.webAudio.audioNode = i,
                    t
                        .webAudio
                        .audioInPorts[e] = s,
                    s.onChange = function () {
                        var e = s.get(),
                            i = s.webAudio.audioNode,
                            n = Ot.getAudioContext();
                        if (null != e) 
                            if ("object" == typeof e && e.connect) {
                                try {
                                    e.connect(i)
                                } catch (e) {
                                    throw t.log("Could not connect audio node: ", e),
                                    e.printStackTrace && e.printStackTrace(),
                                    e
                                }
                                s.webAudio.previousAudioInNode = e
                            }
                        else {
                            if (i._param && i._param.minValue && i._param.maxValue) 
                                if (e >= i._param.minValue && e <= i._param.maxValue) 
                                    try {
                                        i.setValueAtTime
                                            ? i.setValueAtTime(e, n.currentTime)
                                            : i.value = e
                                    } catch (e) {
                                        throw t.log("Possible AudioParam problem with tone.js op: ", e),
                                        e.printStackTrace && e.printStackTrace(),
                                        e
                                    }
                                else 
                                t.log("Warning: The value for an audio parameter is out of range!");
                            else if (i.minValue && i.maxValue) 
                                if (e >= i.minValue && e <= i.maxValue) 
                                    try {
                                        i.setValueAtTime
                                            ? i.setValueAtTime(e, n.currentTime)
                                            : i.value = e
                                    } catch (e) {
                                        throw t.log(
                                            "AudioParam has minValue / maxValue defined, and value is in range, but setting" +
                                                    " the value failed! ",
                                            e
                                        ),
                                        e.printStackTrace && e.printStackTrace(),
                                        e
                                    }
                                else 
                                t.log("Warning: The value for an audio parameter is out of range!");
                            else 
                                try {
                                    i.setValueAtTime
                                        ? i.setValueAtTime(e, n.currentTime)
                                        : i.value = e
                                } catch (e) {
                                    throw t.log("Possible AudioParam problem (without minValue / maxValue): ", e),
                                    e.printStackTrace && e.printStackTrace(),
                                    e
                                }
                            if (s.webAudio.previousAudioInNode && s.webAudio.previousAudioInNode.disconnect) {
                                try {
                                    s
                                        .webAudio
                                        .previousAudioInNode
                                        .disconnect(i)
                                } catch (e) {
                                    throw t.log("Could not disconnect previous audio node: ", e),
                                    e
                                }
                                s.webAudio.previousAudioInNode = void 0
                            }
                        } else 
                            s.webAudio.previousAudioInNode
                    },
                    s
                },
                loadAudioFile: function (t, e, i, n) {
                    var r = Ot.createAudioContext(),
                        s = t
                            .loading
                            .start("audio", e);
                    CABLES.UI && gui
                        .jobs()
                        .start({
                            id: "loadaudio" + s,
                            title: " loading audio (" + e + ")"
                        });
                    var a = new XMLHttpRequest;
                    e && (
                        a.open("GET", e, !0),
                        a.responseType = "arraybuffer",
                        a.onload = function () {
                            t
                                .loading
                                .finished(s),
                            CABLES.UI && gui
                                .jobs()
                                .finish("loadaudio" + s),
                            r.decodeAudioData(a.response, i, n)
                        },
                        a.send()
                    )
                },
                isValidToneTime: function (t) {
                    try {
                        new Tone.Time(t)
                    } catch (t) {
                        return !1
                    }
                    return !0
                },
                isValidToneNote: function (t) {
                    try {
                        Tone.Frequency(t)
                    } catch (t) {
                        return !1
                    }
                    return !0
                }
            },
            Tt = function () {
                var t = CABLES
                    .UI
                    .userSettings
                    .get("pacoRenderer") || !1;
                CABLES
                    .UI
                    .userSettings
                    .set("pacoRenderer", !t),
                document
                    .location
                    .reload()
            },
            St = function () {},
            yt = function (t, e, i) {
                this._patch = t,
                this.connector = i || new Ft,
                this
                    .connector
                    .receive(this)
            };
        yt.prototype._receive = function (t) {
            var e;
            if ((
                e = t.event
                    ? t
                    : JSON.parse(t.data)
            ).event == P.PACO.PACO_OP_CREATE) 
                console.log("op create: data.vars.objName"),
                (a = this._patch.addOp(e.vars.objName)).id = e.vars.opId;
            else if (e.event == P.PACO.PACO_LOAD) 
                console.log("load patch....."),
                this
                    ._patch
                    .clear(),
                this
                    ._patch
                    .deSerialize(e.vars.patch);
            else if (e.event == P.PACO.PACO_CLEAR) 
                this
                    ._patch
                    .clear(),
                console.log("clear");
            else if (e.event == P.PACO.PACO_OP_DELETE) 
                console.log("op delete"),
                this
                    ._patch
                    .deleteOp(e.vars.op, !0);
            else if (e.event == P.PACO.PACO_OP_ENABLE) 
                (a = this._patch.getOpById(e.vars.op)) && (a.enabled = !0);
            else if (e.event == P.PACO.PACO_OP_DISABLE) 
                (a = this._patch.getOpById(e.vars.op)) && (a.enabled = !1);
            else if (e.event == P.PACO.PACO_UNLINK) {
                var i = this
                        ._patch
                        .getOpById(e.vars.op1),
                    n = this
                        ._patch
                        .getOpById(e.vars.op2),
                    r = i.getPort(e.vars.port1),
                    s = n.getPort(e.vars.port2);
                r.removeLinkTo(s)
            } else if (e.event == P.PACO.PACO_LINK) 
                i = this
                    ._patch
                    .getOpById(e.vars.op1),
                n = this
                    ._patch
                    .getOpById(e.vars.op2),
                this
                    ._patch
                    .link(i, e.vars.port1, n, e.vars.port2);
            else if (e.event == P.PACO.PACO_VALUECHANGE) {
                var a;
                (a = this._patch.getOpById(e.vars.op))
                    .getPort(e.vars.port)
                    .set(e.vars.v)
            } else 
                console.log("unknown patchConnectionEvent!", t)
        };
        const Rt = function (t, e) {
            this.connectors = [],
            this
                .connectors
                .push(new Ft)
        };
        Rt.prototype.send = function (t, e) {
            for (var i = 0; i < this.connectors.length; i++) 
                this
                    .connectors[i]
                    .send(t, e)
            };
        const Ft = function () {
            window.BroadcastChannel && (this.bc = new BroadcastChannel("test_channel"))
        };
        Ft.prototype.receive = function (t) {
            this.bc && (console.log("init"), this.bc.onmessage = t._receive.bind(t))
        },
        Ft.prototype.send = function (t, e) {
            if (this.bc) {
                var i = {};
                i.event = t,
                i.vars = e,
                this
                    .bc
                    .postMessage(JSON.stringify(i))
            }
        };
        const Pt = Object.assign({
            EventTarget: f,
            EMBED: At,
            Link: z,
            Port: N,
            Op: Y,
            Profiler: bt,
            Requirements: Mt,
            Patch: It,
            GLGUI: xt,
            Instancing: vt,
            Timer: ot,
            WEBAUDIO: Ot,
            Variable: function () {
                var t = null,
                    e = [];
                this.onChanged = function (t) {
                    e.push(t)
                },
                this.getValue = function () {
                    return t
                },
                this.setValue = function (e) {
                    t = e,
                    i()
                };
                var i = function () {
                    for (var t = 0; t < e.length; t++) 
                        e[t]()
                }
            },
            LoadingStatus: mt,
            now: at,
            internalNow: st
        }, r, s, a, o, P.PORT, P.PACO, P.ANIM, P.OP);
        e.default = Pt
    }
]).default).exportedPatch = {
    settings: {
        opExample: [],
        licence: "none",
        isPublic: !1
    },
    ops: [
        {
            opId: "3b15ad33-0117-4a33-975e-bca154a7f298",
            objName: "Ops.Devices.Mobile.MotionSensor",
            id: "e9e0ce45-5221-4d1f-9c03-a84a8d7abbca",
            uiAttribs: {
                translate: {
                    x: 384,
                    y: -140
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Mul Orientation",
                    value: 1
                }
            ],
            portsOut: [
                {
                    name: "Orientation Alpha",
                    value: 0
                }, {
                    name: "Orientation Beta",
                    value: 0
                }, {
                    name: "Orientation Gamme",
                    value: 0
                }, {
                    name: "Acceleration X",
                    value: 0
                }, {
                    name: "Acceleration Y",
                    value: 0
                }, {
                    name: "Acceleration Z",
                    value: 0
                }, {
                    name: "Acceleration X no gravity"
                }, {
                    name: "Acceleration Y no gravity",
                    value: 0
                }, {
                    name: "Acceleration Z no gravity"
                }, {
                    name: "Object"
                }
            ]
        }, {
            opId: "e9fdcaca-a007-4563-8a4d-e94e08506e0f",
            objName: "Ops.Math.Math",
            id: "4d41410e-1a29-4f5f-bce9-240588f5876e",
            uiAttribs: {
                translate: {
                    x: 384,
                    y: -60
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "number 0",
                    links: [
                        {
                            portIn: "number 0",
                            portOut: "Acceleration X no gravity",
                            objIn: "4d41410e-1a29-4f5f-bce9-240588f5876e",
                            objOut: "e9e0ce45-5221-4d1f-9c03-a84a8d7abbca"
                        }
                    ]
                }, {
                    name: "number 1",
                    links: [
                        {
                            portIn: "number 1",
                            portOut: "Acceleration X no gravity",
                            objIn: "4d41410e-1a29-4f5f-bce9-240588f5876e",
                            objOut: "e9e0ce45-5221-4d1f-9c03-a84a8d7abbca"
                        }
                    ]
                }, {
                    name: "math mode",
                    value: "+"
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "e9fdcaca-a007-4563-8a4d-e94e08506e0f",
            objName: "Ops.Math.Math",
            id: "bfe96759-09bb-4f9e-86a6-b64bc82ed19b",
            uiAttribs: {
                translate: {
                    x: 444,
                    y: -60
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "number 0",
                    links: [
                        {
                            portIn: "number 0",
                            portOut: "Acceleration Z no gravity",
                            objIn: "bfe96759-09bb-4f9e-86a6-b64bc82ed19b",
                            objOut: "e9e0ce45-5221-4d1f-9c03-a84a8d7abbca"
                        }
                    ]
                }, {
                    name: "number 1",
                    links: [
                        {
                            portIn: "number 1",
                            portOut: "Acceleration Z no gravity",
                            objIn: "bfe96759-09bb-4f9e-86a6-b64bc82ed19b",
                            objOut: "e9e0ce45-5221-4d1f-9c03-a84a8d7abbca"
                        }
                    ]
                }, {
                    name: "math mode",
                    value: "+"
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "c8fb181e-0b03-4b41-9e55-06b6267bc634",
            objName: "Ops.Math.Sum",
            id: "62521d15-fea2-4acf-a1e9-e9d7b5c27dad",
            uiAttribs: {
                translate: {
                    x: 420,
                    y: 0
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "number1",
                    links: [
                        {
                            portIn: "number1",
                            portOut: "result",
                            objIn: "62521d15-fea2-4acf-a1e9-e9d7b5c27dad",
                            objOut: "4d41410e-1a29-4f5f-bce9-240588f5876e"
                        }
                    ]
                }, {
                    name: "number2",
                    links: [
                        {
                            portIn: "number2",
                            portOut: "result",
                            objIn: "62521d15-fea2-4acf-a1e9-e9d7b5c27dad",
                            objOut: "bfe96759-09bb-4f9e-86a6-b64bc82ed19b"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "dec567c3-231d-4146-964d-891fde8924f1",
            objName: "Ops.Math.Sqrt",
            id: "360c2063-a3f9-44b5-aa2f-ce4e8d36ef4d",
            uiAttribs: {
                translate: {
                    x: 420,
                    y: 80
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "number",
                    links: [
                        {
                            portIn: "number",
                            portOut: "result",
                            objIn: "360c2063-a3f9-44b5-aa2f-ce4e8d36ef4d",
                            objOut: "62521d15-fea2-4acf-a1e9-e9d7b5c27dad"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "b0472a1d-db16-4ba6-8787-f300fbdc77bb",
            objName: "Ops.Gl.MainLoop",
            id: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f",
            uiAttribs: {
                translate: {
                    x: 756,
                    y: -140
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "FPS Limit",
                    value: 30
                }, {
                    name: "Reduce FPS loading",
                    value: !1
                }, {
                    name: "Clear",
                    value: !0
                }, {
                    name: "ClearAlpha",
                    value: !0
                }, {
                    name: "Fullscreen Button",
                    value: !1
                }, {
                    name: "Active",
                    value: !0
                }, {
                    name: "Hires Displays",
                    value: !0
                }
            ],
            portsOut: [
                {
                    name: "trigger"
                }, {
                    name: "width"
                }, {
                    name: "height"
                }
            ]
        }, {
            opId: "0b3e04f7-323e-4ac8-8a22-a21e2f36e0e9",
            objName: "Ops.Gl.Matrix.TransformView",
            id: "2e3c4283-52a5-4fc7-a7c9-eafbef4b2b07",
            uiAttribs: {
                translate: {
                    x: 756,
                    y: 200
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "render",
                    links: [
                        {
                            portIn: "render",
                            portOut: "trigger",
                            objIn: "2e3c4283-52a5-4fc7-a7c9-eafbef4b2b07",
                            objOut: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f"
                        }
                    ]
                }, {
                    name: "posX",
                    value: 0
                }, {
                    name: "posY",
                    value: -.1
                }, {
                    name: "posZ",
                    value: 0
                }, {
                    name: "scale",
                    value: 1.75
                }, {
                    name: "rotX",
                    value: 0
                }, {
                    name: "rotY",
                    value: 0
                }, {
                    name: "rotZ",
                    value: 0
                }
            ],
            portsOut: [
                {
                    name: "trigger"
                }
            ]
        }, {
            opId: "98d1c79e-71ea-468b-81fc-17da2cd3da89",
            objName: "Ops.Gl.Textures.Graph",
            id: "59de3765-3f3d-438c-b12c-eee6fa94ae3a",
            uiAttribs: {
                translate: {
                    x: 588,
                    y: 440
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "trigger",
                    links: [
                        {
                            portIn: "trigger",
                            portOut: "trigger",
                            objIn: "59de3765-3f3d-438c-b12c-eee6fa94ae3a",
                            objOut: "2e3c4283-52a5-4fc7-a7c9-eafbef4b2b07"
                        }
                    ]
                }, {
                    name: "value",
                    links: [
                        {
                            portIn: "value",
                            portOut: "Sum",
                            objIn: "59de3765-3f3d-438c-b12c-eee6fa94ae3a",
                            objOut: "eae135e6-b71b-4dbc-8589-c1681359a936"
                        }
                    ]
                }, {
                    name: "index",
                    value: 0
                }, {
                    name: "reset",
                    value: 0
                }, {
                    name: "Show Min/Max",
                    value: !0
                }, {
                    name: "Color Random Seed",
                    value: .3
                }, {
                    name: "Texture Width",
                    links: [
                        {
                            portIn: "Texture Width",
                            portOut: "width",
                            objIn: "59de3765-3f3d-438c-b12c-eee6fa94ae3a",
                            objOut: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f"
                        }
                    ]
                }, {
                    name: "Texture Height",
                    links: [
                        {
                            portIn: "Texture Height",
                            portOut: "height",
                            objIn: "59de3765-3f3d-438c-b12c-eee6fa94ae3a",
                            objOut: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "Texture"
                }
            ]
        }, {
            opId: "ca9219d2-9f06-4516-9cf2-98e61f84d4bb",
            objName: "Ops.Array.Array_v2",
            id: "2881102c-8e24-4d90-880b-7e4d3311ce1a",
            uiAttribs: {
                extendTitle: "Number",
                translate: {
                    x: 1020,
                    y: 100
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Mode select",
                    value: "Number"
                }, {
                    name: "Array length",
                    value: 10
                }, {
                    name: "Default Value",
                    value: 0
                }
            ],
            portsOut: [
                {
                    name: "Array"
                }, {
                    name: "Array length out",
                    value: 10
                }
            ]
        }, {
            opId: "5593ea29-19d3-4161-af0c-b8d62079487d",
            objName: "Ops.Array.ArraySumUp",
            id: "eae135e6-b71b-4dbc-8589-c1681359a936",
            uiAttribs: {
                translate: {
                    x: 444,
                    y: 340
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Array",
                    links: [
                        {
                            portIn: "Array",
                            portOut: "Result",
                            objIn: "eae135e6-b71b-4dbc-8589-c1681359a936",
                            objOut: "dd46746a-08c7-474a-8f78-08899467036c"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "Sum"
                }
            ]
        }, {
            opId: "332174c6-af8f-4c4a-9ea2-a0be249ecd72",
            objName: "Ops.Array.ArrayBuffer",
            id: "ee250d81-a4fd-4741-8ca1-4f2fa8666e98",
            uiAttribs: {
                translate: {
                    x: 432,
                    y: 240
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "exec",
                    links: [
                        {
                            portIn: "exec",
                            portOut: "Next",
                            objIn: "ee250d81-a4fd-4741-8ca1-4f2fa8666e98",
                            objOut: "55956922-4ec9-4eac-9edc-6c0257de6a96"
                        }
                    ]
                }, {
                    name: "Value",
                    links: [
                        {
                            portIn: "Value",
                            portOut: "Result",
                            objIn: "ee250d81-a4fd-4741-8ca1-4f2fa8666e98",
                            objOut: "55956922-4ec9-4eac-9edc-6c0257de6a96"
                        }
                    ]
                }, {
                    name: "Max Length",
                    value: 39
                }, {
                    name: "Reset",
                    value: 0
                }
            ],
            portsOut: [
                {
                    name: "Trigger out",
                    value: 0
                }, {
                    name: "Result"
                }, {
                    name: "Array length",
                    value: 39
                }
            ]
        }, {
            opId: "86fcfd8c-038d-4b91-9820-a08114f6b7eb",
            objName: "Ops.Math.Divide",
            id: "51eb3b04-be81-4162-8382-a5ce98faeab6",
            uiAttribs: {
                translate: {
                    x: 444,
                    y: 400
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "number1",
                    links: [
                        {
                            portIn: "number1",
                            portOut: "Sum",
                            objIn: "51eb3b04-be81-4162-8382-a5ce98faeab6",
                            objOut: "eae135e6-b71b-4dbc-8589-c1681359a936"
                        }
                    ]
                }, {
                    name: "number2",
                    links: [
                        {
                            portIn: "number2",
                            portOut: "Array length",
                            objIn: "51eb3b04-be81-4162-8382-a5ce98faeab6",
                            objOut: "dd46746a-08c7-474a-8f78-08899467036c"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "8def22f1-c618-485d-b36b-4b7579cb079f",
            objName: "Ops.Anim.AverageInterpolation_v2",
            id: "55956922-4ec9-4eac-9edc-6c0257de6a96",
            uiAttribs: {
                translate: {
                    x: 432,
                    y: 180
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Update",
                    links: [
                        {
                            portIn: "Update",
                            portOut: "trigger",
                            objIn: "55956922-4ec9-4eac-9edc-6c0257de6a96",
                            objOut: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f"
                        }
                    ]
                }, {
                    name: "Value",
                    links: [
                        {
                            portIn: "Value",
                            portOut: "result",
                            objIn: "55956922-4ec9-4eac-9edc-6c0257de6a96",
                            objOut: "3cca7157-46c1-4263-88fb-581e92cc2c93"
                        }
                    ]
                }, {
                    name: "Divisor",
                    value: 30
                }
            ],
            portsOut: [
                {
                    name: "Next"
                }, {
                    name: "Result"
                }
            ]
        }, {
            opId: "2617b407-60a0-4ff6-b4a7-18136cfa7817",
            objName: "Ops.Math.MapRange",
            id: "3cca7157-46c1-4263-88fb-581e92cc2c93",
            uiAttribs: {
                translate: {
                    x: 444,
                    y: 140
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "value",
                    links: [
                        {
                            portIn: "value",
                            portOut: "result",
                            objIn: "3cca7157-46c1-4263-88fb-581e92cc2c93",
                            objOut: "360c2063-a3f9-44b5-aa2f-ce4e8d36ef4d"
                        }
                    ]
                }, {
                    name: "old min",
                    value: 1
                }, {
                    name: "old max",
                    value: 10
                }, {
                    name: "new min",
                    value: 0
                }, {
                    name: "new max",
                    value: 5
                }, {
                    name: "Easing",
                    value: "Linear"
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "a52722aa-0ca9-402c-a844-b7e98a6c6e60",
            objName: "Ops.String.Concat_v2",
            id: "4bc9805a-40a6-4dbe-b910-76c413d1c2d3",
            uiAttribs: {
                title: "Concat2",
                translate: {
                    x: 636,
                    y: 740
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "string1",
                    links: [
                        {
                            portIn: "string1",
                            portOut: "Result",
                            objIn: "4bc9805a-40a6-4dbe-b910-76c413d1c2d3",
                            objOut: "b0ae7706-dced-49c5-8b22-eb82a2901d99"
                        }
                    ]
                }, {
                    name: "string2",
                    value: "vh"
                }, {
                    name: "New Line",
                    value: !1
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "e7b4ea20-ef7e-461d-92f8-6aff58c5ba6f",
            objName: "Ops.Html.SetCssVariableString",
            id: "3f2dbadd-7965-4296-95ee-b7a7a9ee60d0",
            uiAttribs: {
                translate: {
                    x: 612,
                    y: 800
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Var Name",
                    value: "size"
                }, {
                    name: "Value",
                    links: [
                        {
                            portIn: "Value",
                            portOut: "result",
                            objIn: "3f2dbadd-7965-4296-95ee-b7a7a9ee60d0",
                            objOut: "4bc9805a-40a6-4dbe-b910-76c413d1c2d3"
                        }
                    ]
                }
            ],
            portsOut: []
        }, {
            opId: "5c6d375a-82db-4366-8013-93f56b4061a9",
            objName: "Ops.String.NumberToString_v2",
            id: "b0ae7706-dced-49c5-8b22-eb82a2901d99",
            uiAttribs: {
                title: "NumberToString2",
                translate: {
                    x: 636,
                    y: 680
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Number",
                    links: [
                        {
                            portIn: "Number",
                            portOut: "result",
                            objIn: "b0ae7706-dced-49c5-8b22-eb82a2901d99",
                            objOut: "a1161abf-3829-4e2c-baef-9773a61db6d6"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "Result"
                }
            ]
        }, {
            opId: "2617b407-60a0-4ff6-b4a7-18136cfa7817",
            objName: "Ops.Math.MapRange",
            id: "a1161abf-3829-4e2c-baef-9773a61db6d6",
            uiAttribs: {
                translate: {
                    x: 636,
                    y: 620
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "value",
                    links: [
                        {
                            portIn: "value",
                            portOut: "result",
                            objIn: "a1161abf-3829-4e2c-baef-9773a61db6d6",
                            objOut: "51eb3b04-be81-4162-8382-a5ce98faeab6"
                        }
                    ]
                }, {
                    name: "old min",
                    value: 0
                }, {
                    name: "old max",
                    value: .5
                }, {
                    name: "new min",
                    value: 4
                }, {
                    name: "new max",
                    value: 8.5
                }, {
                    name: "Easing",
                    value: "Smootherstep"
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "650baeb1-db2d-4781-9af6-ab4e9d4277be",
            objName: "Ops.Gl.Matrix.Transform",
            id: "394553a0-e99f-4570-8672-2c48f7d23d99",
            uiAttribs: {
                translate: {
                    x: 912,
                    y: 300
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "render",
                    links: [
                        {
                            portIn: "render",
                            portOut: "trigger",
                            objIn: "394553a0-e99f-4570-8672-2c48f7d23d99",
                            objOut: "2e3c4283-52a5-4fc7-a7c9-eafbef4b2b07"
                        }
                    ]
                }, {
                    name: "posX",
                    value: 0
                }, {
                    name: "posY",
                    value: -.4
                }, {
                    name: "posZ",
                    value: 0
                }, {
                    name: "scale",
                    value: 1
                }, {
                    name: "rotX",
                    value: 0
                }, {
                    name: "rotY",
                    value: 0
                }, {
                    name: "rotZ",
                    value: 0
                }
            ],
            portsOut: [
                {
                    name: "trigger"
                }
            ]
        }, {
            opId: "20f3c4e7-04d1-44e0-b868-05756d1c66c6",
            objName: "Ops.Gl.Meshes.Rectangle",
            id: "152de028-1a2b-4e14-a769-900f00c32603",
            uiAttribs: {
                translate: {
                    x: 936,
                    y: 440
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "render",
                    links: [
                        {
                            portIn: "render",
                            portOut: "trigger",
                            objIn: "152de028-1a2b-4e14-a769-900f00c32603",
                            objOut: "46af9804-168a-4bc7-804b-5f09c6e5c259"
                        }
                    ]
                }, {
                    name: "width",
                    links: [
                        {
                            portIn: "width",
                            portOut: "Aspect Ratio",
                            objIn: "152de028-1a2b-4e14-a769-900f00c32603",
                            objOut: "774fb45a-3709-4b56-9749-164064115051"
                        }
                    ]
                }, {
                    name: "height",
                    value: 1
                }, {
                    name: "pivot x",
                    value: "center"
                }, {
                    name: "pivot y",
                    value: "center"
                }, {
                    name: "num columns",
                    value: 1
                }, {
                    name: "num rows",
                    value: 1
                }, {
                    name: "axis",
                    value: "xy"
                }, {
                    name: "Active",
                    value: !0
                }
            ],
            portsOut: [
                {
                    name: "trigger",
                    value: 0
                }, {
                    name: "geometry"
                }
            ]
        }, {
            opId: "94e499e5-b4ee-4861-ab48-6ab5098b2cc3",
            objName: "Ops.Gl.CanvasSize",
            id: "774fb45a-3709-4b56-9749-164064115051",
            uiAttribs: {
                translate: {
                    x: 960,
                    y: 340
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [],
            portsOut: [
                {
                    name: "width",
                    value: 1292
                }, {
                    name: "height",
                    value: 854
                }, {
                    name: "Pixel Ratio",
                    value: 2
                }, {
                    name: "Aspect Ratio"
                }, {
                    name: "Landscape",
                    value: !0
                }
            ]
        }, {
            opId: "51f2207b-daaa-447f-bdbe-87fdd72f0c40",
            objName: "Ops.Gl.Shader.BasicMaterial_v2",
            id: "46af9804-168a-4bc7-804b-5f09c6e5c259",
            uiAttribs: {
                translate: {
                    x: 912,
                    y: 380
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "render",
                    links: [
                        {
                            portIn: "render",
                            portOut: "trigger",
                            objIn: "46af9804-168a-4bc7-804b-5f09c6e5c259",
                            objOut: "394553a0-e99f-4570-8672-2c48f7d23d99"
                        }
                    ]
                }, {
                    name: "r",
                    value: .5048424957458515
                }, {
                    name: "g",
                    value: .34195733339718526
                }, {
                    name: "b",
                    value: .3343083860439553
                }, {
                    name: "a",
                    value: 1
                }, {
                    name: "texture",
                    links: [
                        {
                            portIn: "texture",
                            portOut: "Texture",
                            objIn: "46af9804-168a-4bc7-804b-5f09c6e5c259",
                            objOut: "59de3765-3f3d-438c-b12c-eee6fa94ae3a"
                        }
                    ]
                }, {
                    name: "colorizeTexture",
                    value: !1
                }, {
                    name: "textureOpacity",
                    value: 0
                }, {
                    name: "Alpha Mask Source",
                    value: "Luminance"
                }, {
                    name: "Opacity TexCoords Transform",
                    value: !1
                }, {
                    name: "Discard Transparent Pixels",
                    value: !1
                }, {
                    name: "diffuseRepeatX",
                    value: 1
                }, {
                    name: "diffuseRepeatY",
                    value: 1
                }, {
                    name: "Tex Offset X",
                    value: 0
                }, {
                    name: "Tex Offset Y",
                    value: 0
                }, {
                    name: "billboard",
                    value: !1
                }
            ],
            portsOut: [
                {
                    name: "trigger"
                }, {
                    name: "shader"
                }
            ]
        }, {
            opId: "e3a24a1a-a74b-4c38-b492-63abca68f6d1",
            objName: "Ops.Gl.Meshes.RectangleFrame",
            id: "1505f907-4b32-4c67-83a4-10822ea11dd8",
            uiAttribs: {
                translate: {
                    x: 900,
                    y: 560
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Render",
                    links: [
                        {
                            portIn: "Render",
                            portOut: "trigger",
                            objIn: "1505f907-4b32-4c67-83a4-10822ea11dd8",
                            objOut: "4bb03613-fd6f-476b-8f13-94f73d37f7b4"
                        }
                    ]
                }, {
                    name: "Width",
                    links: [
                        {
                            portIn: "Width",
                            portOut: "result",
                            objIn: "1505f907-4b32-4c67-83a4-10822ea11dd8",
                            objOut: "fe56dc94-adfb-456d-89fe-bcf55baccd72"
                        }
                    ]
                }, {
                    name: "Height",
                    value: 2.5
                }, {
                    name: "Thickness",
                    value: .005
                }, {
                    name: "pivot x",
                    value: "center"
                }, {
                    name: "pivot y",
                    value: "center"
                }, {
                    name: "Draw Top",
                    value: !0
                }, {
                    name: "Draw Bottom",
                    value: !0
                }, {
                    name: "Draw Left",
                    value: !0
                }, {
                    name: "Draw Right",
                    value: !0
                }
            ],
            portsOut: [
                {
                    name: "trigger",
                    value: 0
                }, {
                    name: "Geometry"
                }
            ]
        }, {
            opId: "51f2207b-daaa-447f-bdbe-87fdd72f0c40",
            objName: "Ops.Gl.Shader.BasicMaterial_v2",
            id: "4bb03613-fd6f-476b-8f13-94f73d37f7b4",
            uiAttribs: {
                translate: {
                    x: 900,
                    y: 500
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "render",
                    links: [
                        {
                            portIn: "render",
                            portOut: "trigger",
                            objIn: "4bb03613-fd6f-476b-8f13-94f73d37f7b4",
                            objOut: "0031b885-df20-42d3-a0dc-b91016a53841"
                        }
                    ]
                }, {
                    name: "r",
                    value: 0
                }, {
                    name: "g",
                    value: .9765625
                }, {
                    name: "b",
                    value: 1
                }, {
                    name: "a",
                    value: 1
                }, {
                    name: "texture",
                    value: 0
                }, {
                    name: "colorizeTexture",
                    value: !1
                }, {
                    name: "textureOpacity",
                    value: 0
                }, {
                    name: "Alpha Mask Source",
                    value: "Luminance"
                }, {
                    name: "Opacity TexCoords Transform",
                    value: !1
                }, {
                    name: "Discard Transparent Pixels",
                    value: !1
                }, {
                    name: "diffuseRepeatX",
                    value: 1
                }, {
                    name: "diffuseRepeatY",
                    value: 1
                }, {
                    name: "Tex Offset X",
                    value: 0
                }, {
                    name: "Tex Offset Y",
                    value: 0
                }, {
                    name: "billboard",
                    value: !1
                }
            ],
            portsOut: [
                {
                    name: "trigger"
                }, {
                    name: "shader"
                }
            ]
        }, {
            opId: "650baeb1-db2d-4781-9af6-ab4e9d4277be",
            objName: "Ops.Gl.Matrix.Transform",
            id: "0031b885-df20-42d3-a0dc-b91016a53841",
            uiAttribs: {
                translate: {
                    x: 816,
                    y: 260
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "render",
                    links: [
                        {
                            portIn: "render",
                            portOut: "trigger",
                            objIn: "0031b885-df20-42d3-a0dc-b91016a53841",
                            objOut: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f"
                        }
                    ]
                }, {
                    name: "posX",
                    value: 0
                }, {
                    name: "posY",
                    value: 0
                }, {
                    name: "posZ",
                    value: 0
                }, {
                    name: "scale",
                    value: .73
                }, {
                    name: "rotX",
                    value: 0
                }, {
                    name: "rotY",
                    value: 0
                }, {
                    name: "rotZ",
                    value: 0
                }
            ],
            portsOut: [
                {
                    name: "trigger"
                }
            ]
        }, {
            opId: "1bbdae06-fbb2-489b-9bcc-36c9d65bd441",
            objName: "Ops.Math.Multiply",
            id: "fe56dc94-adfb-456d-89fe-bcf55baccd72",
            uiAttribs: {
                translate: {
                    x: 900,
                    y: 440
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "number1",
                    links: [
                        {
                            portIn: "number1",
                            portOut: "Aspect Ratio",
                            objIn: "fe56dc94-adfb-456d-89fe-bcf55baccd72",
                            objOut: "774fb45a-3709-4b56-9749-164064115051"
                        }
                    ]
                }, {
                    name: "number2",
                    value: 2.8
                }
            ],
            portsOut: [
                {
                    name: "result"
                }
            ]
        }, {
            opId: "0cf90109-cccd-4633-9c77-8aaf53eae15c",
            objName: "Ops.Html.FontFile",
            id: "37cc80b6-974a-4b5f-8619-110174b30e37",
            uiAttribs: {
                translate: {
                    x: 1068,
                    y: 200
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "file",
                    value: "assets/5d8cada2572ed112bfb1c28f_asdkersnikova_v6_ang-Light.woff",
                    display: "file"
                }, {
                    name: "family",
                    value: "fonet"
                }
            ],
            portsOut: [
                {
                    name: "Loaded",
                    value: !0
                }, {
                    name: "Loaded Trigger",
                    value: 0
                }
            ]
        }, {
            opId: "332174c6-af8f-4c4a-9ea2-a0be249ecd72",
            objName: "Ops.Array.ArrayBuffer",
            id: "cc9dba40-44d4-4af5-9bf6-3db41a28e48f",
            uiAttribs: {
                translate: {
                    x: 288,
                    y: 260
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "exec",
                    links: [
                        {
                            portIn: "exec",
                            portOut: "trigger",
                            objIn: "cc9dba40-44d4-4af5-9bf6-3db41a28e48f",
                            objOut: "43a1d73c-ce3f-4194-b33e-1adc1a4c0f8f"
                        }
                    ]
                }, {
                    name: "Value",
                    links: [
                        {
                            portIn: "Value",
                            portOut: "Result",
                            objIn: "cc9dba40-44d4-4af5-9bf6-3db41a28e48f",
                            objOut: "55956922-4ec9-4eac-9edc-6c0257de6a96"
                        }
                    ]
                }, {
                    name: "Max Length",
                    value: 1
                }, {
                    name: "Reset",
                    value: 0
                }
            ],
            portsOut: [
                {
                    name: "Trigger out",
                    value: 0
                }, {
                    name: "Result"
                }, {
                    name: "Array length",
                    value: 1
                }
            ]
        }, {
            opId: "77eb7794-37e1-4c43-83b0-5dab6ec07e74",
            objName: "Ops.Array.ArrayMerge_v2",
            id: "dd46746a-08c7-474a-8f78-08899467036c",
            uiAttribs: {
                translate: {
                    x: 444,
                    y: 300
                },
                subPatch: 0,
                notWorkingMsg: null
            },
            portsIn: [
                {
                    name: "Array",
                    links: [
                        {
                            portIn: "Array",
                            portOut: "Result",
                            objIn: "dd46746a-08c7-474a-8f78-08899467036c",
                            objOut: "ee250d81-a4fd-4741-8ca1-4f2fa8666e98"
                        }
                    ]
                }, {
                    name: "Array 2",
                    links: [
                        {
                            portIn: "Array 2",
                            portOut: "Result",
                            objIn: "dd46746a-08c7-474a-8f78-08899467036c",
                            objOut: "cc9dba40-44d4-4af5-9bf6-3db41a28e48f"
                        }
                    ]
                }
            ],
            portsOut: [
                {
                    name: "Result"
                }, {
                    name: "Array length"
                }
            ]
        }
    ],
    users: [],
    userOps: [],
    tags: [],
    _id: "5d9db5d4a8ef6f174621435f",
    name: "delay",
    userId: "5aa800bf6332e26355ea010c",
    created: "2019-10-09T10:26:28.549Z",
    updated: "2019-10-09T10:50:16.631Z",
    __v: 22,
    shortId: "7vA3MS",
    opsHash: "75953e1808573b1c96fd6d6349100167971d3e9a",
    ui: {
        viewBox: {
            x: -58,
            y: -240,
            w: 1117.8879310344828,
            h: 1140
        },
        timeLineLength: 20,
        bookmarks: [],
        subPatchViewBoxes: [],
        renderer: {
            w: 646,
            h: 427,
            s: 1
        }
    },
    updatedByUser: "kdklv",
    cachedUsername: "kdklv",
    views: 0,
    cachedNumComments: 0,
    cachedNumFavs: 0,
    statsAdmin: {
        filenameScreenshots: [],
        filenameExports: [],
        filenameAssets: [],
        hasOldScreenshots: !1,
        hasOldExports: !1,
        sizeScreenshots: 0,
        sizeExports: 0,
        sizeAssets: 0
    },
    exports: 1
},
(CABLES = CABLES || {}).OPS = CABLES.OPS || {};
var Ops = Ops || {};
Ops.Gl = Ops.Gl || {},
Ops.Math = Ops.Math || {},
Ops.Html = Ops.Html || {},
Ops.Anim = Ops.Anim || {},
Ops.Array = Ops.Array || {},
Ops.String = Ops.String || {},
Ops.Devices = Ops.Devices || {},
Ops.Gl.Meshes = Ops.Gl.Meshes || {},
Ops.Gl.Matrix = Ops.Gl.Matrix || {},
Ops.Gl.Shader = Ops.Gl.Shader || {},
Ops.Gl.Textures = Ops.Gl.Textures || {},
Ops.Devices.Mobile = Ops.Devices.Mobile || {},
Ops.Devices.Mobile.MotionSensor = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inValue("Mul Orientation", 1),
        i = t.outValue("Orientation Alpha"),
        n = t.outValue("Orientation Beta"),
        r = t.outValue("Orientation Gamme"),
        s = t.outValue("Acceleration X"),
        a = t.outValue("Acceleration Y"),
        o = t.outValue("Acceleration Z"),
        l = t.outValue("Acceleration X no gravity"),
        h = t.outValue("Acceleration Y no gravity"),
        u = t.outValue("Acceleration Z no gravity"),
        c = t.outObject("Object");
    var p = 0,
        d = 0,
        f = {};
    setTimeout(function () {
        window.addEventListener("devicemotion", function (t) {
            CABLES.now() - d > 15 && (
                d = CABLES.now(),
                s.set(t.accelerationIncludingGravity.x || 0),
                a.set(t.accelerationIncludingGravity.y || 0),
                o.set(t.accelerationIncludingGravity.z || 0),
                l.set(t.acceleration.x || 0),
                h.set(t.acceleration.y || 0),
                u.set(t.acceleration.z || 0),
                f.AccelerationX = s.get(),
                f.AccelerationY = a.get(),
                f.AccelerationZ = o.get(),
                c.set(null),
                c.set(f)
            )
        }, !0),
        window.addEventListener("deviceorientation", function (t) {
            CABLES.now() - p > 15 && (
                p = CABLES.now(),
                i.set((t.alpha || 0) * e.get()),
                n.set((t.beta || 0) * e.get()),
                r.set((t.gamma || 0) * e.get()),
                f.OrientationAlpha = i.get(),
                f.OrientationBeta = n.get(),
                f.OrientationGamma = r.get(),
                c.set(null),
                c.set(f)
            )
        }, !0),
        console.log("window.DeviceOrientationEvent: ", window.DeviceOrientationEvent)
    }, 3e3)
},
Ops.Devices.Mobile.MotionSensor.prototype = new CABLES.Op,
CABLES.OPS["3b15ad33-0117-4a33-975e-bca154a7f298"] = {
    f: Ops.Devices.Mobile.MotionSensor,
    objName: "Ops.Devices.Mobile.MotionSensor"
},
Ops.Math.Math = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inFloat("number 0", 0),
        i = t.inFloat("number 1", 0),
        n = t.inSwitch("math mode", [
            "+",
            "-",
            "*",
            "/",
            "%",
            "min",
            "max"
        ], "+"),
        r = t.outNumber("result");
    e.onChange = i.onChange = n.onChange = function () {
        var s = n.get(),
            a = e.get(),
            o = i.get();
        t.setUiAttrib({extendTitle: s}),
        "+" === s
            ? r.set(a + o)
            : "-" === s
                ? r.set(a - o)
                : "*" === s
                    ? r.set(a * o)
                    : "/" === s
                        ? r.set(a / o)
                        : "%" === s
                            ? r.set(a % o)
                            : "min" === s
                                ? r.set(Math.min(a, o))
                                : "max" === s && r.set(Math.max(a, o))
    }
},
Ops.Math.Math.prototype = new CABLES.Op,
CABLES.OPS["e9fdcaca-a007-4563-8a4d-e94e08506e0f"] = {
    f: Ops.Math.Math,
    objName: "Ops.Math.Math"
},
Ops.Math.Sum = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inValueFloat("number1", 1),
        e = this.inValueFloat("number2", 1),
        i = this.outValue("result");
    function n() {
        var n = t.get() + e.get();
        isNaN(n) || i.set(n)
    }
    t.onChange = e.onChange = n,
    n()
},
Ops.Math.Sum.prototype = new CABLES.Op,
CABLES.OPS["c8fb181e-0b03-4b41-9e55-06b6267bc634"] = {
    f: Ops.Math.Sum,
    objName: "Ops.Math.Sum"
},
Ops.Math.Sqrt = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inValue("number"),
        e = this.outValue("result");
    t.onChange = function () {
        let i = Math.sqrt(t.get());
        isNaN(i) && (i = 0),
        e.set(i)
    }
},
Ops.Math.Sqrt.prototype = new CABLES.Op,
CABLES.OPS["dec567c3-231d-4146-964d-891fde8924f1"] = {
    f: Ops.Math.Sqrt,
    objName: "Ops.Math.Sqrt"
},
Ops.Gl.MainLoop = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inValue("FPS Limit", 0),
        i = t.outTrigger("trigger"),
        n = t.outValue("width"),
        r = t.outValue("height"),
        s = t.inValueBool("Reduce FPS loading"),
        a = t.inValueBool("Clear", !0),
        o = t.inValueBool("ClearAlpha", !0),
        l = t.inValueBool("Fullscreen Button", !1),
        h = t.inValueBool("Active", !0),
        u = t.inValueBool("Hires Displays", !1);
    t.onAnimFrame = v,
    u.onChange = function () {
        u.get()
            ? t.patch.cgl.pixelDensity = window.devicePixelRatio
            : t.patch.cgl.pixelDensity = 1,
        t
            .patch
            .cgl
            .updateSize(),
        CABLES.UI && gui.setLayout()
    },
    h.onChange = function () {
        t
            .patch
            .removeOnAnimFrame(t),
        h.get() && (
            t.onAnimFrame = v,
            t.patch.addOnAnimFrame(t),
            console.log("adding again!")
        )
    };
    var c = t.patch.cgl,
        p = 0,
        d = 0;
    t.patch.cgl || t.uiAttr({error: "No webgl cgl context"});
    var f = vec3.create();
    vec3.set(f, 0, 0, 0);
    var g = vec3.create();
    vec3.set(g, 0, 0, -2),
    l.onChange = m,
    setTimeout(m, 100);
    var _ = null;
    function m() {
        function e() {
            _ && (_.style.display = "block")
        }
        if (
            t.patch.cgl.canvas.addEventListener("mouseleave", function () {
                _ && (_.style.display = "none")
            }),
            t.patch.cgl.canvas.addEventListener("mouseenter", e),
            l.get()
        ) {
            if (!_) {
                _ = document.createElement("div");
                var i = t.patch.cgl.canvas.parentElement;
                i && i.appendChild(_),
                _.addEventListener("mouseenter", e),
                _.addEventListener("click", function (t) {
                    CABLES.UI && !t.shiftKey
                        ? gui.cycleRendererSize()
                        : c.fullScreen()
                })
            }
            _.style.padding = "10px",
            _.style.position = "absolute",
            _.style.right = "5px",
            _.style.top = "5px",
            _.style.width = "20px",
            _.style.height = "20px",
            _.style.cursor = "pointer",
            _.style["border-radius"] = "40px",
            _.style.background = "#444",
            _.style["z-index"] = "9999",
            _.style.display = "none",
            _.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xl' +
                    'ink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 490 490" style="wi' +
                    'dth:20px;height:20px;" xml:space="preserve" width="512px" height="512px"><g><p' +
                    'ath d="M173.792,301.792L21.333,454.251v-80.917c0-5.891-4.776-10.667-10.667-10.' +
                    '667C4.776,362.667,0,367.442,0,373.333V480     c0,5.891,4.776,10.667,10.667,10.' +
                    '667h106.667c5.891,0,10.667-4.776,10.667-10.667s-4.776-10.667-10.667-10.667H36.' +
                    '416     l152.459-152.459c4.093-4.237,3.975-10.99-0.262-15.083C184.479,297.799,' +
                    '177.926,297.799,173.792,301.792z" fill="#FFFFFF"/><path d="M480,0H373.333c-5.8' +
                    '91,0-10.667,4.776-10.667,10.667c0,5.891,4.776,10.667,10.667,10.667h80.917L301.' +
                    '792,173.792     c-4.237,4.093-4.354,10.845-0.262,15.083c4.093,4.237,10.845,4.3' +
                    '54,15.083,0.262c0.089-0.086,0.176-0.173,0.262-0.262     L469.333,36.416v80.917' +
                    'c0,5.891,4.776,10.667,10.667,10.667s10.667-4.776,10.667-10.667V10.667C490.667,' +
                    '4.776,485.891,0,480,0z" fill="#FFFFFF"/><path d="M36.416,21.333h80.917c5.891,0' +
                    ',10.667-4.776,10.667-10.667C128,4.776,123.224,0,117.333,0H10.667     C4.776,0,' +
                    '0,4.776,0,10.667v106.667C0,123.224,4.776,128,10.667,128c5.891,0,10.667-4.776,1' +
                    '0.667-10.667V36.416l152.459,152.459     c4.237,4.093,10.99,3.975,15.083-0.262c' +
                    '3.992-4.134,3.992-10.687,0-14.82L36.416,21.333z" fill="#FFFFFF"/><path d="M480' +
                    ',362.667c-5.891,0-10.667,4.776-10.667,10.667v80.917L316.875,301.792c-4.237-4.0' +
                    '93-10.99-3.976-15.083,0.261     c-3.993,4.134-3.993,10.688,0,14.821l152.459,15' +
                    '2.459h-80.917c-5.891,0-10.667,4.776-10.667,10.667s4.776,10.667,10.667,10.667  ' +
                    '   H480c5.891,0,10.667-4.776,10.667-10.667V373.333C490.667,367.442,485.891,362' +
                    '.667,480,362.667z" fill="#FFFFFF"/></g></svg>'
        } else 
            _ && (_.style.display = "none", _.remove(), _ = null)
    }
    function v(e) {
        h.get() && (
            c.aborted || 0 === c.canvas.clientWidth || 0 === c.canvas.clientHeight || (
                t.patch.loading.getProgress() < 1 && s.get() && (t.patch.config.fpsLimit = 5),
                -1 != c.canvasWidth
                    ? (
                        c.canvasWidth == n.get() && c.canvasHeight == r.get() || (n.set(c.canvasWidth), r.set(c.canvasHeight)),
                        CABLES.now() - d > 1e3 && (
                            CGL.fpsReport = CGL.fpsReport || [],
                            t.patch.loading.getProgress() >= 1 && 0 !== d && CGL.fpsReport.push(p),
                            p = 0,
                            d = CABLES.now()
                        ),
                        CGL.MESH.lastShader = null,
                        CGL.MESH.lastMesh = null,
                        c.renderStart(c, f, g),
                        a.get() && (
                            c.gl.clearColor(0, 0, 0, 1),
                            c.gl.clear(c.gl.COLOR_BUFFER_BIT | c.gl.DEPTH_BUFFER_BIT)
                        ),
                        i.trigger(),
                        CGL.MESH.lastMesh && CGL.MESH.lastMesh.unBind(),
                        CGL.Texture.previewTexture && (
                            CGL.Texture.texturePreviewer || (CGL.Texture.texturePreviewer = new CGL.Texture.texturePreview(c)),
                            CGL.Texture.texturePreviewer.render(CGL.Texture.previewTexture)
                        ),
                        c.renderEnd(c),
                        o.get() && (
                            c.gl.clearColor(1, 1, 1, 1),
                            c.gl.colorMask(!1, !1, !1, !0),
                            c.gl.clear(c.gl.COLOR_BUFFER_BIT),
                            c.gl.colorMask(!0, !0, !0, !0)
                        ),
                        c.frameStore.phong || (c.frameStore.phong = {}),
                        p++
                    )
                    : c.setCanvas(t.patch.config.glCanvasId)
            )
        )
    }
    e.onChange = function () {
        t.patch.config.fpsLimit = e.get() || 0
    },
    t.onDelete = function () {
        c
            .gl
            .clearColor(0, 0, 0, 0),
        c
            .gl
            .clear(c.gl.COLOR_BUFFER_BIT | c.gl.DEPTH_BUFFER_BIT)
    },
    t
        .patch
        .loading
        .setOnFinishedLoading(function (i) {
            t.patch.config.fpsLimit = e.get()
        })
},
Ops.Gl.MainLoop.prototype = new CABLES.Op,
CABLES.OPS["b0472a1d-db16-4ba6-8787-f300fbdc77bb"] = {
    f: Ops.Gl.MainLoop,
    objName: "Ops.Gl.MainLoop"
},
Ops.Gl.Matrix.TransformView = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inTrigger("render"),
        i = t.inValueFloat("posX"),
        n = t.inValueFloat("posY"),
        r = t.inValueFloat("posZ"),
        s = t.inValueFloat("scale"),
        a = t.inValueFloat("rotX"),
        o = t.inValueFloat("rotY"),
        l = t.inValueFloat("rotZ"),
        h = t.outTrigger("trigger");
    t.setPortGroup("Position", [i, n, r]),
    t.setPortGroup("Scale", [s]),
    t.setPortGroup("Rotation", [a, l, o]);
    var u = t.patch.cgl,
        c = vec3.create(),
        p = vec3.create(),
        d = mat4.create();
    mat4.identity(d);
    var f = !1,
        g = !1,
        _ = !0,
        m = !0,
        v = !0;
    e.onTriggered = function () {
        var e = !1;
        _ && (!function () {
            g = !1,
            (0 !== i.get() || 0 !== n.get() || 0 !== r.get()) && (g = !0);
            vec3.set(c, i.get(), n.get(), r.get()),
            _ = !1
        }(), e = !0),
        m && (!function () {
            f = !1,
            0 !== s.get() && (f = !0);
            vec3.set(p, s.get(), s.get(), s.get()),
            m = !1
        }(), e = !0),
        v && (e = !0),
        e && b(),
        u.pushViewMatrix(),
        mat4.multiply(u.vMatrix, u.vMatrix, d),
        h.trigger(),
        u.popViewMatrix(),
        CABLES.UI && gui
            .patch()
            .isCurrentOp(t) && gui.setTransformGizmo({posX: i, posY: n, posZ: r})
    },
    t.transform3d = function () {
        return {
            pos: [i, n, r]
        }
    };
    var b = function () {
        mat4.identity(d),
        g && mat4.translate(d, d, c),
        0 !== a.get() && mat4.rotateX(d, d, a.get() * CGL.DEG2RAD),
        0 !== o.get() && mat4.rotateY(d, d, o.get() * CGL.DEG2RAD),
        0 !== l.get() && mat4.rotateZ(d, d, l.get() * CGL.DEG2RAD),
        f && mat4.scale(d, d, p),
        v = !1
    };
    var M = function () {
        _ = !0
    };
    m = function () {
        m = !0
    },
    v = function () {
        v = !0
    };
    a.onChange = v,
    o.onChange = v,
    l.onChange = v,
    s.onChange = m,
    i.onChange = M,
    n.onChange = M,
    r.onChange = M,
    a.set(0),
    o.set(0),
    l.set(0),
    s.set(1),
    i.set(0),
    n.set(0),
    r.set(0),
    b()
},
Ops.Gl.Matrix.TransformView.prototype = new CABLES.Op,
CABLES.OPS["0b3e04f7-323e-4ac8-8a22-a21e2f36e0e9"] = {
    f: Ops.Gl.Matrix.TransformView,
    objName: "Ops.Gl.Matrix.TransformView"
},
Ops.Gl.Textures.Graph = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = this.inTrigger("trigger"),
        i = this.inValueFloat("value"),
        n = this.inValueInt("index"),
        r = this.inTriggerButton("reset"),
        s = t.inValueBool("Show Min/Max"),
        a = t.inValueFloat("Color Random Seed", 23),
        o = t.inValueInt("Texture Width", 512),
        l = t.inValueInt("Texture Height", 512),
        h = t.outTexture("Texture"),
        u = t.patch.cgl;
    var c = document.createElement("canvas");
    c.id = "graph_" + Math.random(),
    c.width = 512,
    c.height = 512,
    c.style.display = "none",
    document
        .getElementsByTagName("body")[0]
        .appendChild(c);
    var p = document.getElementById(c.id),
        d = p.getContext("2d");
    o.onChange = l.onChange = function () {
        c.width = o.get(),
        c.height = l.get()
    };
    var f = [],
        g = -Number.MAX_VALUE,
        _ = Number.MAX_VALUE,
        m = [],
        v = Date.now();
    function b() {
        f.length = 0,
        g = -999999,
        _ = 999999
    }
    function M(t, i) {
        g = Math.max(g, parseFloat(t)),
        _ = Math.min(_, parseFloat(t)),
        f[i] || (
            f[i] = [],
            Math.randomSeed = a.get() + i,
            m[i] = "rgba(" + Math.round(255 * Math.seededRandom()) + "," + Math.round(255 * Math.seededRandom()) +
                "," + Math.round(255 * Math.seededRandom()) + ",1)"
        ),
        f[i].push(t),
        e.isLinked() || Date.now() - v > 30 && E()
    }
    function E() {
        function t(t) {
            return c.height - (t / n * c.height / 2 * .9 + c.height / 2)
        }
        d.fillStyle = "#000",
        d.fillRect(0, 0, c.width, c.height),
        d.fillStyle = "#444",
        d.fillRect(0, t(0), c.width, 1);
        for (var e = 0; e < f.length; e++) {
            var i = f[e];
            if (i) {
                d.lineWidth = 2;
                var n = Math.max(Math.abs(g), Math.abs(_)),
                    r = (c.height, Math.max(0, i.length - c.width));
                d.beginPath(),
                d.strokeStyle = m[e],
                d.moveTo(0, t(i[r]));
                for (var a = r; a < i.length; a++) 
                    d.lineTo(1 + a - r, t(i[a]));
                d.stroke()
            }
        }
        d.font = "22px monospace",
        s.get() && (
            d.fillStyle = "#fff",
            d.fillText("max:" + Math.round(100 * g) / 100, 10, c.height - 10),
            d.fillText(
                "min:" + Math.round(100 * _) / 100,
                10,
                c.height - 30
            )
        ),
        h.get()
            ? h
                .get()
                .initTexture(p)
            : h.set(
                new CGL.Texture.createFromImage(u, p, {filter: CGL.Texture.FILTER_MIPMAP})
            ),
        v = Date.now()
    }
    i.onLinkChanged = b,
    n.onLinkChanged = b,
    r.onTriggered = b,
    i.onChange = function () {
        M(i.get(), Math.round(n.get()))
    },
    e.onTriggered = function () {
        for (var t = 0; t < f.length; t++) 
            f[t] && M(f[t][f[t].length - 1], t);
        E()
    }
},
Ops.Gl.Textures.Graph.prototype = new CABLES.Op,
CABLES.OPS["98d1c79e-71ea-468b-81fc-17da2cd3da89"] = {
    f: Ops.Gl.Textures.Graph,
    objName: "Ops.Gl.Textures.Graph"
},
Ops.Array.Array_v2 = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inSwitch("Mode select", [
            "Number", "1,2,3,4", "0-1"
        ], "Number"),
        i = t.inValueInt("Array length", 10),
        n = t.inValueFloat("Default Value"),
        r = t.outArray("Array"),
        s = t.outNumber("Array length out");
    var a = [],
        o = 0;
    const l = 0,
        h = 1,
        u = 2;
    function c() {
        var i = e.get();
        "Number" === i
            ? o = l
            : "1,2,3,4" === i
                ? o = h
                : "0-1" === i && (o = u),
        o === l
            ? n.setUiAttribs({
                greyout: !1
            })
            : o === h
                ? n.setUiAttribs({
                    greyout: !0
                })
                : o === u && n.setUiAttribs({
                    greyout: !0
                }),
        t.setUiAttrib({extendTitle: e.get()}),
        p()
    }
    function p() {
        a.length = 0;
        var t,
            e = i.get(),
            c = n.get();
        if (s.set(e), o === l) 
            for (t = 0; t < e; t++) 
                a[t] = c;
            else if (o === h) 
                for (t = 0; t < e; t++) 
                    a[t] = t;
    else if (o === u) {
            var p = e;
            for (t = 0; t < e; t++) 
                a[t] = t / p
        }
        r.set(null),
        r.set(a)
    }
    c(),
    n.onChange = i.onChange = function () {
        p()
    },
    e.onChange = c,
    p()
},
Ops.Array.Array_v2.prototype = new CABLES.Op,
CABLES.OPS["ca9219d2-9f06-4516-9cf2-98e61f84d4bb"] = {
    f: Ops.Array.Array_v2,
    objName: "Ops.Array.Array_v2"
},
Ops.Array.ArraySumUp = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inArray("Array"),
        e = this.outValue("Sum");
    t.onChange = function () {
        if (t.get()) {
            for (var i = t.get(), n = 0, r = 0; r < i.length; r++) 
                n += Number(i[r]);
            e.set(n)
        } else 
            e.set(0)
    }
},
Ops.Array.ArraySumUp.prototype = new CABLES.Op,
CABLES.OPS["5593ea29-19d3-4161-af0c-b8d62079487d"] = {
    f: Ops.Array.ArraySumUp,
    objName: "Ops.Array.ArraySumUp"
},
Ops.Array.ArrayBuffer = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inTriggerButton("exec"),
        i = t.inValue("Value"),
        n = t.outTrigger("Trigger out"),
        r = t.outArray("Result"),
        s = t.outNumber("Array length");
    var a = [],
        o = t.inInt("Max Length", 100),
        l = t.inTriggerButton("Reset");
    function h() {
        a.length = Math.abs(Math.floor(o.get())) || 0;
        for (var t = 0; t < a.length; t++) 
            a[t] = 0;
        r.set(null),
        r.set(a),
        s.set(0)
    }
    r.set(a),
    o.onChange = h,
    l.onTriggered = h,
    h(),
    e.onTriggered = function () {
        for (var t = 1; t < a.length; t++) 
            a[t - 1] = a[t];
        a[a.length - 1] = i.get(),
        r.set(null),
        r.set(a),
        s.set(a.length),
        n.trigger()
    }
},
Ops.Array.ArrayBuffer.prototype = new CABLES.Op,
CABLES.OPS["332174c6-af8f-4c4a-9ea2-a0be249ecd72"] = {
    f: Ops.Array.ArrayBuffer,
    objName: "Ops.Array.ArrayBuffer"
},
Ops.Math.Divide = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inValueFloat("number1", 1),
        e = this.inValueFloat("number2", 1),
        i = this.outValue("result");
    function n() {
        i.set(t.get() / e.get())
    }
    t.onChange = e.onChange = n,
    n()
},
Ops.Math.Divide.prototype = new CABLES.Op,
CABLES.OPS["86fcfd8c-038d-4b91-9820-a08114f6b7eb"] = {
    f: Ops.Math.Divide,
    objName: "Ops.Math.Divide"
},
Ops.Anim.AverageInterpolation_v2 = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this;
    var e = 5;
    const i = t.inTrigger("Update"),
        n = t.inValue("Value"),
        r = t.outTrigger("Next"),
        s = t.inValue("Divisor", e),
        a = t.outValue("Result", 0);
    var o = 0,
        l = 0,
        h = 0,
        u = 0;
    t.toWorkPortsNeedToBeLinked(i),
    n.onChange = function () {
        l = n.get()
    },
    s.onChange = function () {
        (e = s.get()) <= 0 && (e = 5)
    },
    i.onTriggered = function () {
        var t = 1;
        CABLES.now() - u > 500 || 0 === u
            ? o = n.get()
            : t = (CABLES.now() - u) / 16,
        u = CABLES.now(),
        e <= 0 && (e = 1e-4),
        (o += (l - o) / (e * t)) > 0 && o < 1e-9 && (o = 0),
        e != e && (o = 0),
        o == o && o != -1 / 0 && o != 1 / 0 || (o = n.get()),
        h != o && (a.set(o), h = o),
        r.trigger()
    }
},
Ops.Anim.AverageInterpolation_v2.prototype = new CABLES.Op,
CABLES.OPS["8def22f1-c618-485d-b36b-4b7579cb079f"] = {
    f: Ops.Anim.AverageInterpolation_v2,
    objName: "Ops.Anim.AverageInterpolation_v2"
},
Ops.Math.MapRange = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.outValue("result");
    var i = t.inValueFloat("value"),
        n = t.inValueFloat("old min"),
        r = t.inValueFloat("old max"),
        s = t.inValueFloat("new min"),
        a = t.inValueFloat("new max"),
        o = t.inValueSelect("Easing", [
            "Linear", "Smoothstep", "Smootherstep"
        ], "Linear");
    t.setPortGroup("Input Range", [n, r]),
    t.setPortGroup("Output Range", [s, a]);
    var l = 0,
        h = 0;
    function u() {
        if (i.get() >= Math.max(r.get(), n.get())) 
            e.set(a.get());
        else if (i.get() <= Math.min(r.get(), n.get())) 
            e.set(s.get());
        else {
            var t = s.get(),
                o = a.get(),
                u = n.get(),
                c = r.get(),
                p = i.get(),
                d = !1,
                f = Math.min(u, c),
                g = Math.max(u, c);
            f != u && (d = !0);
            var _ = !1,
                m = Math.min(t, o),
                v = Math.max(t, o);
            m != t && (_ = !0);
            var b = 0;
            b = d
                ? (g - p) * (v - m) / (g - f)
                : (p - f) * (v - m) / (g - f),
            h = _
                ? v - b
                : b + m,
            0 === l
                ? e.set(h)
                : 1 == l
                    ? (
                        p = Math.max(0, Math.min(1, (h - t) / (o - t))),
                        e.set(t + p * p * (3 - 2 * p) * (o - t))
                    )
                    : 2 == l && (
                        p = Math.max(0, Math.min(1, (h - t) / (o - t))),
                        e.set(t + p * p * p * (p * (6 * p - 15) + 10) * (o - t))
                    )
        }
    }
    o.onChange = function () {
        l = "Smoothstep" == o.get()
            ? 1
            : "Smootherstep" == o.get()
                ? 2
                : 0
    },
    i.set(0),
    n.set(0),
    r.set(1),
    s.set(-1),
    a.set(1),
    i.onChange = u,
    n.onChange = u,
    r.onChange = u,
    s.onChange = u,
    a.onChange = u,
    e.set(0),
    u()
},
Ops.Math.MapRange.prototype = new CABLES.Op,
CABLES.OPS["2617b407-60a0-4ff6-b4a7-18136cfa7817"] = {
    f: Ops.Math.MapRange,
    objName: "Ops.Math.MapRange"
},
Ops.String.Concat_v2 = function () {
    CABLES
        .Op
        .apply(this, arguments);
    var t = this.inString("string1", "ABC"),
        e = this.inString("string2", "XYZ"),
        i = this.inValueBool("New Line", !1),
        n = this.outString("result");
    function r() {
        var r = t.get(),
            s = e.get();
        if (r || s) {
            r || (r = ""),
            s || (s = "");
            var a = "";
            r && s && i.get() && (a = "\n"),
            n.set(String(r) + a + String(s))
        } else 
            n.set("")
    }
    i.onChange = e.onChange = t.onChange = r,
    r()
},
Ops.String.Concat_v2.prototype = new CABLES.Op,
CABLES.OPS["a52722aa-0ca9-402c-a844-b7e98a6c6e60"] = {
    f: Ops.String.Concat_v2,
    objName: "Ops.String.Concat_v2"
},
Ops.Html.SetCssVariableString = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inString("Var Name"),
        e = this.inString("Value");
    var i = document.documentElement;
    e.onChange = t.onChange = function () {
        i
            .style
            .setProperty("--" + t.get(), e.get())
    }
},
Ops.Html.SetCssVariableString.prototype = new CABLES.Op,
CABLES.OPS["e7b4ea20-ef7e-461d-92f8-6aff58c5ba6f"] = {
    f: Ops.Html.SetCssVariableString,
    objName: "Ops.Html.SetCssVariableString"
},
Ops.String.NumberToString_v2 = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inValue("Number"),
        e = this.outString("Result");
    function i() {
        e.set(String(t.get() || 0))
    }
    t.onChange = i,
    i()
},
Ops.String.NumberToString_v2.prototype = new CABLES.Op,
CABLES.OPS["5c6d375a-82db-4366-8013-93f56b4061a9"] = {
    f: Ops.String.NumberToString_v2,
    objName: "Ops.String.NumberToString_v2"
},
Ops.Gl.Matrix.Transform = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inTrigger("render"),
        i = t.inValue("posX", 0),
        n = t.inValue("posY", 0),
        r = t.inValue("posZ", 0),
        s = t.inValue("scale", 1),
        a = t.inValue("rotX", 0),
        o = t.inValue("rotY", 0),
        l = t.inValue("rotZ", 0),
        h = t.outTrigger("trigger");
    t.setPortGroup("Rotation", [a, o, l]),
    t.setPortGroup("Position", [i, n, r]),
    t.setPortGroup("Scale", [s]),
    t.setUiAxisPorts(i, n, r);
    const u = t.patch.cgl;
    var c = vec3.create(),
        p = vec3.create(),
        d = mat4.create();
    mat4.identity(d);
    var f = !1,
        g = !1,
        _ = !0,
        m = !0,
        v = !0;
    function b() {
        mat4.identity(d),
        g && mat4.translate(d, d, c),
        0 !== a.get() && mat4.rotateX(d, d, a.get() * CGL.DEG2RAD),
        0 !== o.get() && mat4.rotateY(d, d, o.get() * CGL.DEG2RAD),
        0 !== l.get() && mat4.rotateZ(d, d, l.get() * CGL.DEG2RAD),
        f && mat4.scale(d, d, p),
        v = !1
    }
    a.onChange = o.onChange = l.onChange = function () {
        v = !0
    },
    i.onChange = n.onChange = r.onChange = function () {
        _ = !0
    },
    s.onChange = function () {
        m = !0
    },
    e.onTriggered = function () {
        var e = !1;
        _ && (!function () {
            g = !1,
            (0 !== i.get() || 0 !== n.get() || 0 !== r.get()) && (g = !0);
            vec3.set(c, i.get(), n.get(), r.get()),
            _ = !1
        }(), e = !0),
        m && (f = !0, vec3.set(p, s.get(), s.get(), s.get()), m = !1, e = !0),
        v && (e = !0),
        e && b(),
        u.pushModelMatrix(),
        mat4.multiply(u.mMatrix, u.mMatrix, d),
        h.trigger(),
        u.popModelMatrix(),
        CABLES.UI && gui
            .patch()
            .isCurrentOp(t) && gui.setTransformGizmo({posX: i, posY: n, posZ: r})
    },
    t.transform3d = function () {
        return {
            pos: [i, n, r]
        }
    },
    b()
},
Ops.Gl.Matrix.Transform.prototype = new CABLES.Op,
CABLES.OPS["650baeb1-db2d-4781-9af6-ab4e9d4277be"] = {
    f: Ops.Gl.Matrix.Transform,
    objName: "Ops.Gl.Matrix.Transform"
},
Ops.Gl.Meshes.Rectangle = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this;
    var e = t.inTrigger("render"),
        i = t.outTrigger("trigger"),
        n = t.inValue("width", 1),
        r = t.inValue("height", 1),
        s = t.inSwitch("pivot x", ["left", "center", "right"]),
        a = t.inSwitch("pivot y", ["top", "center", "bottom"]),
        o = t.inValueInt("num columns", 1),
        l = t.inValueInt("num rows", 1),
        h = t.inSwitch("axis", [
            "xy", "xz"
        ], "xy"),
        u = t.inValueBool("Active", !0),
        c = t.outObject("geometry");
    c.ignoreValueSerialize = !0;
    var p = t.patch.cgl;
    h.set("xy"),
    s.set("center"),
    a.set("center"),
    t.setPortGroup("Pivot", [s, a]),
    t.setPortGroup("Size", [n, r]),
    t.setPortGroup("Structure", [o, l]);
    var d = new CGL.Geometry("rectangle"),
        f = null;
    function g() {
        var t = n.get(),
            e = r.get(),
            i = 0,
            u = 0;
        "string" == typeof t && (t = parseFloat(t)),
        "string" == typeof e && (e = parseFloat(e)),
        "center" == s.get()
            ? i = 0
            : "right" == s.get()
                ? i = -t / 2
                : "left" == s.get() && (i = +t / 2),
        "center" == a.get()
            ? u = 0
            : "top" == a.get()
                ? u = -e / 2
                : "bottom" == a.get() && (u = +e / 2);
        var g,
            _,
            m,
            v = [],
            b = [],
            M = [],
            E = [],
            I = [],
            A = [],
            x = Math.round(l.get()),
            O = Math.round(o.get()),
            T = t / O,
            S = e / x;
        for (m = h.get(), _ = 0; _ <= x; _++) 
            for (g = 0; g <= O; g++) 
                v.push(g * T - n.get() / 2 + i),
                "xz" == m && v.push(0),
                v.push(_ * S - r.get() / 2 + u),
                "xy" == m && v.push(0),
                b.push(g / O),
                b.push(1 - _ / x),
                "xz" == m
                    ? (M.push(0, 1, 0), E.push(1, 0, 0), I.push(0, 0, 1))
                    : "xy" == m && (M.push(0, 0, 1), E.push(-1, 0, 0), I.push(0, -1, 0));
        for (g = 0; g < O; g++) 
            for (_ = 0; _ < x; _++) {
                var y = g + (O + 1) * _,
                    R = y,
                    F = y + 1,
                    P = y + O + 1,
                    N = y + 1 + O + 1;
                A.push(R),
                A.push(P),
                A.push(F),
                A.push(F),
                A.push(P),
                A.push(N)
            }
        d.clear(),
        d.vertices = v,
        d.texCoords = b,
        d.verticesIndices = A,
        d.vertexNormals = M,
        d.tangents = E,
        d.biTangents = I,
        O * x > 64e3 && d.unIndex(),
        f
            ? f.setGeom(d)
            : f = new CGL.Mesh(p, d),
        c.set(null),
        c.set(d)
    }
    h.onChange = g,
    s.onChange = g,
    a.onChange = g,
    n.onChange = g,
    r.onChange = g,
    l.onChange = g,
    o.onChange = g,
    g(),
    t.preRender = e.onTriggered = function () {
        CGL
            .TextureEffect
            .checkOpNotInTextureEffect(t) && (
                u.get() && f && f.render(p.getShader()),
                i.trigger()
            )
    },
    t.onDelete = function () {
        f && f.dispose()
    }
},
Ops.Gl.Meshes.Rectangle.prototype = new CABLES.Op,
CABLES.OPS["20f3c4e7-04d1-44e0-b868-05756d1c66c6"] = {
    f: Ops.Gl.Meshes.Rectangle,
    objName: "Ops.Gl.Meshes.Rectangle"
},
Ops.Gl.CanvasSize = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.outValue("width"),
        i = t.outValue("height"),
        n = t.outValue("Pixel Ratio"),
        r = t.outValue("Aspect Ratio"),
        s = t.outValueBool("Landscape");
    var a = t.patch.cgl;
    function o() {
        i.set(a.canvasHeight),
        e.set(a.canvasWidth),
        n.set(window.devicePixelRatio),
        r.set(a.canvasWidth / a.canvasHeight),
        s.set(a.canvasWidth > a.canvasHeight)
    }
    a.addEventListener("resize", o),
    o()
},
Ops.Gl.CanvasSize.prototype = new CABLES.Op,
CABLES.OPS["94e499e5-b4ee-4861-ab48-6ab5098b2cc3"] = {
    f: Ops.Gl.CanvasSize,
    objName: "Ops.Gl.CanvasSize"
},
Ops.Gl.Shader.BasicMaterial_v2 = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = "{{MODULES_HEAD}}\n\nIN vec2 texCoord;\nUNI float r;\nUNI float g;\nUNI float b" +
                ";\nUNI float a;\n\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef " +
                "HAS_TEXTURE_DIFFUSE\n        UNI sampler2D tex;\n    #endif\n    #ifdef HAS_TE" +
                "XTURE_OPACITY\n        UNI sampler2D texOpacity;\n   #endif\n#endif\n\nvoid ma" +
                "in()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=vec4(r,g,b,a);\n\n    #ifdef " +
                "HAS_TEXTURES\n        vec2 uv=vec2(texCoord.s,1.0-texCoord.t);\n\n        #ifd" +
                "ef HAS_TEXTURE_DIFFUSE\n            col=texture(tex,uv);\n\n            #ifdef" +
                " COLORIZE_TEXTURE\n                col.r*=r;\n                col.g*=g;\n     " +
                "           col.b*=b;\n            #endif\n        #endif\n        col.a*=a;\n " +
                "       #ifdef HAS_TEXTURE_OPACITY\n            #ifdef TRANSFORMALPHATEXCOORDS" +
                "\n                uv=vec2(texCoordOrig.s,1.0-texCoordOrig.t);\n            #en" +
                "dif\n            #ifdef ALPHA_MASK_ALPHA\n                col.a*=texture(texOp" +
                "acity,uv).a;\n            #endif\n            #ifdef ALPHA_MASK_LUMI\n        " +
                "        col.a*=dot(vec3(0.2126,0.7152,0.0722), texture(texOpacity,uv).rgb);\n " +
                "           #endif\n            #ifdef ALPHA_MASK_R\n                col.a*=tex" +
                "ture(texOpacity,uv).r;\n            #endif\n            #ifdef ALPHA_MASK_G\n " +
                "               col.a*=texture(texOpacity,uv).g;\n            #endif\n         " +
                "   #ifdef ALPHA_MASK_B\n                col.a*=texture(texOpacity,uv).b;\n    " +
                "        #endif\n            // #endif\n        #endif\n    #endif\n\n    {{MOD" +
                "ULE_COLOR}}\n\n    #ifdef DISCARDTRANS\n        if(col.a<0.2) discard;\n    #e" +
                "ndif\n\n    outColor = col;\n}\n",
        i = "{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nIN vec3 attrVertNormal;\nIN vec2 attrT" +
                "exCoord;\n\nOUT vec3 norm;\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI " +
                "mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TE" +
                "XTURES\n    UNI float diffuseRepeatX;\n    UNI float diffuseRepeatY;\n    UNI " +
                "float texOffsetX;\n    UNI float texOffsetY;\n#endif\n\n\nvoid main()\n{\n    " +
                "mat4 mMatrix=modelMatrix;\n    mat4 mvMatrix;\n\n    texCoordOrig=attrTexCoord" +
                ";\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        texCoord.x=tex" +
                "Coord.x*diffuseRepeatX+texOffsetX;\n        texCoord.y=texCoord.y*diffuseRepea" +
                "tY+texOffsetY;\n    #endif\n\n    vec4 pos = vec4( vPosition, 1. );\n\n\n    #" +
                "ifdef BILLBOARD\n       vec3 position=vPosition;\n       mvMatrix=viewMatrix*m" +
                "odelMatrix;\n\n       gl_Position = projMatrix * mvMatrix * vec4((\n          " +
                " position.x * vec3(\n               mvMatrix[0][0],\n               mvMatrix[1" +
                "][0],\n               mvMatrix[2][0] ) +\n           position.y * vec3(\n     " +
                "          mvMatrix[0][1],\n               mvMatrix[1][1],\n               mvMa" +
                "trix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifn" +
                "def BILLBOARD\n        mvMatrix=viewMatrix * mMatrix;\n    #endif\n\n\n    #if" +
                "ndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix" +
                " * pos;\n        gl_Position = projMatrix * mvMatrix * pos;\n    #endif\n}\n",
        n = t.inTrigger("render"),
        r = t.outTrigger("trigger"),
        s = t.outObject("shader");
    s.ignoreValueSerialize = !0;
    const a = t.patch.cgl;
    t.toWorkPortsNeedToBeLinked(n, r);
    const o = new CGL.Shader(a, "basicmaterialnew");
    function l() {
        f.get() && a.setTexture(0, f.get().tex),
        t
            .textureOpacity
            .get() && a.setTexture(1, t.textureOpacity.get().tex)
    }
    function h() {
        o && (a.setShader(o), o.bindTextures(), r.trigger(), a.setPreviousShader())
    }
    o.setModules(["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG"]),
    o.bindTextures = l,
    o.setSource(i, e),
    s.set(o),
    n.onTriggered = h,
    t.preRender = function () {
        o.bind(),
        h()
    };
    const u = t.inValueSlider("r", Math.random()),
        c = t.inValueSlider("g", Math.random()),
        p = t.inValueSlider("b", Math.random()),
        d = t.inValueSlider("a", 1);
    u.setUiAttribs({
        colorPick: !0
    });
    new CGL.Uniform(o, "f", "r", u),
    new CGL.Uniform(o, "f", "g", c),
    new CGL.Uniform(o, "f", "b", p),
    new CGL.Uniform(o, "f", "a", d);
    t.setPortGroup("Color", [u, c, p, d]);
    var f = t.inTexture("texture"),
        g = null;
    function _() {
        f.get()
            ? (
                o.hasDefine("HAS_TEXTURE_DIFFUSE") || o.define("HAS_TEXTURE_DIFFUSE"),
                g || (g = new CGL.Uniform(o, "t", "texDiffuse", 0)),
                I.setUiAttribs({
                    greyout: !1
                }),
                A.setUiAttribs({
                    greyout: !1
                }),
                x.setUiAttribs({
                    greyout: !1
                }),
                O.setUiAttribs({
                    greyout: !1
                }),
                m.setUiAttribs({
                    greyout: !1
                })
            )
            : (
                o.removeUniform("texDiffuse"),
                o.removeDefine("HAS_TEXTURE_DIFFUSE"),
                g = null,
                I.setUiAttribs({
                    greyout: !0
                }),
                A.setUiAttribs({
                    greyout: !0
                }),
                x.setUiAttribs({
                    greyout: !0
                }),
                O.setUiAttribs({
                    greyout: !0
                }),
                m.setUiAttribs({
                    greyout: !0
                })
            )
    }
    o.bindTextures = l,
    f.onChange = _;
    const m = t.inValueBool("colorizeTexture", !1);
    function v() {
        "Alpha Channel" == t
            .alphaMaskSource
            .get()
                ? o.define("ALPHA_MASK_ALPHA")
                : o.removeDefine("ALPHA_MASK_ALPHA"),
        "Luminance" == t
            .alphaMaskSource
            .get()
                ? o.define("ALPHA_MASK_LUMI")
                : o.removeDefine("ALPHA_MASK_LUMI"),
        "R" == t
            .alphaMaskSource
            .get()
                ? o.define("ALPHA_MASK_R")
                : o.removeDefine("ALPHA_MASK_R"),
        "G" == t
            .alphaMaskSource
            .get()
                ? o.define("ALPHA_MASK_G")
                : o.removeDefine("ALPHA_MASK_G"),
        "B" == t
            .alphaMaskSource
            .get()
                ? o.define("ALPHA_MASK_B")
                : o.removeDefine("ALPHA_MASK_B")
    }
    function b() {
        if (t.textureOpacity.get()) {
            if (null !== t.textureOpacityUniform) 
                return;
            o.removeUniform("texOpacity"),
            o.define("HAS_TEXTURE_OPACITY"),
            t.textureOpacityUniform || (
                t.textureOpacityUniform = new CGL.Uniform(o, "t", "texOpacity", 1)
            ),
            t
                .alphaMaskSource
                .setUiAttribs({
                    greyout: !1
                }),
            E.setUiAttribs({
                greyout: !1
            }),
            M.setUiAttribs({
                greyout: !1
            })
        } else 
            o.removeUniform("texOpacity"),
            o.removeDefine("HAS_TEXTURE_OPACITY"),
            t.textureOpacityUniform = null,
            t
                .alphaMaskSource
                .setUiAttribs({
                    greyout: !0
                }),
            E.setUiAttribs({
                greyout: !0
            }),
            M.setUiAttribs({
                greyout: !0
            });
        v()
    }
    t.setPortGroup("Color Texture", [f, m]),
    t.textureOpacity = t.inTexture("textureOpacity"),
    t.textureOpacityUniform = null,
    t.alphaMaskSource = t.inSwitch("Alpha Mask Source", [
        "Luminance", "R", "G", "B", "A"
    ], "Luminance"),
    t.alphaMaskSource.onChange = v,
    t
        .alphaMaskSource
        .setUiAttribs({
            greyout: !0
        }),
    t.textureOpacity.onChange = b;
    var M = t.inValueBool("Opacity TexCoords Transform", !1);
    const E = t.inValueBool("Discard Transparent Pixels");
    E.onChange = function () {
        E.get()
            ? o.define("DISCARDTRANS")
            : o.removeDefine("DISCARDTRANS")
    },
    M.onChange = function () {
        M.get()
            ? o.define("TRANSFORMALPHATEXCOORDS")
            : o.removeDefine("TRANSFORMALPHATEXCOORDS")
    },
    t.setPortGroup("Opacity", [t.textureOpacity, t.alphaMaskSource, E, M]),
    m.onChange = function () {
        m.get()
            ? o.define("COLORIZE_TEXTURE")
            : o.removeDefine("COLORIZE_TEXTURE")
    };
    const I = t.inValue("diffuseRepeatX", 1),
        A = t.inValue("diffuseRepeatY", 1),
        x = t.inValue("Tex Offset X", 0),
        O = t.inValue("Tex Offset Y", 0);
    new CGL.Uniform(o, "f", "diffuseRepeatX", I),
    new CGL.Uniform(o, "f", "diffuseRepeatY", A),
    new CGL.Uniform(o, "f", "texOffsetX", x),
    new CGL.Uniform(o, "f", "texOffsetY", O);
    t.setPortGroup("Texture Transform", [I, A, x, O]);
    const T = t.inValueBool("billboard", !1);
    T.onChange = function () {
        T.get()
            ? o.define("BILLBOARD")
            : o.removeDefine("BILLBOARD")
    },
    b(),
    _()
},
Ops.Gl.Shader.BasicMaterial_v2.prototype = new CABLES.Op,
CABLES.OPS["51f2207b-daaa-447f-bdbe-87fdd72f0c40"] = {
    f: Ops.Gl.Shader.BasicMaterial_v2,
    objName: "Ops.Gl.Shader.BasicMaterial_v2"
},
Ops.Gl.Meshes.RectangleFrame = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inTrigger("Render"),
        i = t.inValueFloat("Width", 1),
        n = t.inValueFloat("Height", 1),
        r = t.inValueFloat("Thickness", -.1),
        s = t.inValueSelect("pivot x", [
            "center", "left", "right"
        ], "center"),
        a = t.inValueSelect("pivot y", [
            "center", "top", "bottom"
        ], "center"),
        o = t.outTrigger("trigger"),
        l = t.outObject("Geometry"),
        h = t.inValueBool("Draw Top", !0),
        u = t.inValueBool("Draw Bottom", !0),
        c = t.inValueBool("Draw Left", !0),
        p = t.inValueBool("Draw Right", !0),
        d = t.patch.cgl;
    var f = null,
        g = new CGL.Geometry;
    function _() {
        var t = i.get(),
            e = n.get(),
            o = -t / 2,
            _ = -e / 2,
            m = r.get();
        if (
            "right" == s.get()
                ? o = -t
                : "left" == s.get() && (o = 0),
            "top" == a.get()
                ? _ = -t
                : "bottom" == a.get() && (_ = 0),
            g.vertices.length = 0,
            g.vertices.push(
                o,
                _,
                0,
                o + t,
                _,
                0,
                o + t,
                _ + e,
                0,
                o,
                _ + e,
                0,
                o - m,
                _ - m,
                0,
                o + t + m,
                _ - m,
                0,
                o + t + m,
                _ + e + m,
                0,
                o - m,
                _ + e + m,
                0
            ),
            0 === g.vertexNormals.length && g.vertexNormals.push(
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1
            ),
            0 === g.tangents.length && g.tangents.push(
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0
            ),
            0 === g.biTangents.length && g.biTangents.push(
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0,
                0,
                1,
                0
            ),
            g.verticesIndices
                ? g.verticesIndices.length = 0
                : g.verticesIndices = [],
            u.get() && g.verticesIndices.push(0, 1, 4, 1, 5, 4),
            p.get() && g.verticesIndices.push(1, 2, 5, 5, 2, 6),
            h.get() && g.verticesIndices.push(7, 6, 3, 6, 2, 3),
            c.get() && g.verticesIndices.push(0, 4, 3, 4, 7, 3),
            0 === g.texCoords.length
        ) {
            g.texCoords = new Float32Array;
            for (var v = 0, b = 0; v < g.vertices.length; v += 3, b += 2) 
                g.texCoords[b] = g.vertices[v + 0] / t - .5,
                g.texCoords[b] = g.vertices[v + 1] / e - .5
        }
        f
            ? f.setGeom(g)
            : f = new CGL.Mesh(d, g),
        l.set(null),
        l.set(g)
    }
    g.tangents = [],
    g.biTangents = [],
    l.ignoreValueSerialize = !0,
    i.onChange = s.onChange = a.onChange = n.onChange = r.onChange = h.onChange = u.onChange = c.onChange = p.onChange = _,
    _(),
    e.onTriggered = function () {
        f.render(d.getShader()),
        o.trigger()
    }
},
Ops.Gl.Meshes.RectangleFrame.prototype = new CABLES.Op,
CABLES.OPS["e3a24a1a-a74b-4c38-b492-63abca68f6d1"] = {
    f: Ops.Gl.Meshes.RectangleFrame,
    objName: "Ops.Gl.Meshes.RectangleFrame"
},
Ops.Math.Multiply = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inValueFloat("number1"),
        e = this.inValueFloat("number2"),
        i = this.outValue("result");
    function n() {
        const n = t.get(),
            r = e.get();
        isNaN(n) && (n = 0),
        isNaN(r) && (r = 0),
        i.set(n * r)
    }
    t.set(1),
    e.set(2),
    t.onChange = n,
    e.onChange = n,
    n()
},
Ops.Math.Multiply.prototype = new CABLES.Op,
CABLES.OPS["1bbdae06-fbb2-489b-9bcc-36c9d65bd441"] = {
    f: Ops.Math.Multiply,
    objName: "Ops.Math.Multiply"
},
Ops.Html.FontFile = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this,
        e = t.inFile("file"),
        i = t.inValueString("family"),
        n = t.outValue("Loaded"),
        r = t.outTrigger("Loaded Trigger");
    var s;
    function a() {
        if (e.get() && i.get()) 
            if (document.fonts) 
                s = new FontFace(i.get(), "url(" + t.patch.getFilePath(String(e.get())) + ")"),
                document
                    .fonts
                    .add(s),
                s.load(),
                s
                    .loaded
                    .then(t => {
                        n.set(!0),
                        r.trigger()
                    }, t => {
                        console.error("Font loading error! Current status", s.status)
                    });
            else {
                var a = t
                        .patch
                        .getFilePath(String(e.get())),
                    o = "".endl() + "@font-face".endl() + "{".endl() + '  font-family: "' + i.get() +
                            '";'.endl() + '  src: url("' + a + '") format("truetype");'.endl() + "}",
                    l = document.createElement("style");
                l.type = "text/css",
                l.innerHTML = o,
                document
                    .getElementsByTagName("head")[
                        document
                            .getElementsByTagName("head")
                            .length - 1
                    ]
                    .appendChild(l)
            }
        }
    e.onChange = function () {
        n.set(!1),
        a()
    },
    i.onChange = a
},
Ops.Html.FontFile.prototype = new CABLES.Op,
CABLES.OPS["0cf90109-cccd-4633-9c77-8aaf53eae15c"] = {
    f: Ops.Html.FontFile,
    objName: "Ops.Html.FontFile"
},
Ops.Array.ArrayMerge_v2 = function () {
    CABLES
        .Op
        .apply(this, arguments);
    const t = this.inArray("Array"),
        e = this.inArray("Array 2"),
        i = this.outArray("Result"),
        n = this.outNumber("Array length");
    var r = [];
    t.onChange = e.onChange = function () {
        var s = t.get(),
            a = e.get();
        if (!s || !a) 
            return i.set(null),
            void n.set(0);
        s && a && (r.length = 0, r = (r = r.concat(t.get())).concat(e.get())),
        i.set(null),
        i.set(r),
        n.set(r.length)
    }
},
Ops.Array.ArrayMerge_v2.prototype = new CABLES.Op,
CABLES.OPS["77eb7794-37e1-4c43-83b0-5dab6ec07e74"] = {
    f: Ops.Array.ArrayMerge_v2,
    objName: "Ops.Array.ArrayMerge_v2"
};