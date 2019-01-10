<template>
<div class="full" ref="full">
  <div class="row" v-if="entryRT && entryRT.data.inited">
    <div class="col-vs">
      Vertex Shader
      <ACE
        v-model="entryRT.data.vertexShader"
        :readOnly="false"
        :filepath="'@/fun.vert'"
        @close="() => {}"
        @open="() => { }"
        @save="() => { $emit('send') }"
        @input="(v) => { entryRT.data.vertexShader = v; $emit('send') }"
        theme="chrome"
        width="100%"
        :height="height + 'px'"
      />
    </div>
    <div class="col-fs">
      <div class="hr"></div>
      Fragment Shader
      <ACE
        v-model="entryRT.data.fragmentShader"
        :readOnly="false"
        :filepath="'@/fun.frag'"
        @close="() => {}"
        @open="() => { }"
        @save="() => { $emit('send') }"
        @input="(v) => { entryRT.data.fragmentShader = v; $emit('send') }"
        theme="chrome"
        width="100%"
        :height="height + 'px'"
      />
      <div class="hr"></div>
    </div>
  </div>
</div>
</template>

<script>
import ACE from '@/components/parts/EffectNode/ACE/ACE.vue'
import * as Hot from '../HotData.js'
export default {
  props: {
    root: {},
    cID: {},
    eID: {}
  },
  components: {
    ACE
  },
  data () {
    return {
      entryRT: false,
      height: window.innerHeight
    }
  },
  watch: {
    root () {
      this.entryRT = Hot.getEntryBycIDeID({ root: this.root, cID: this.cID, eID: this.eID })
    }
  },
  mounted () {
    this.entryRT = Hot.getEntryBycIDeID({ root: this.root, cID: this.cID, eID: this.eID })
    this.makeHeight()
    window.addEventListener('resize', this.makeHeight.bind(this), false)
    this.initData()
  },
  methods: {
    makeHeight () {
      if (!this.$refs['full']) {
        return
      }
      this.height = this.$refs['full'].getBoundingClientRect().height * 0.5
    },
    initData () {
      if (!this.entryRT.data.inited) {
        this.entryRT.data.inited = true
        this.entryRT.data.vertexShader = `void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`
        this.entryRT.data.fragmentShader = `void main () {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}`
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped>
@import url(../Shared.css);

.full{
  height: calc(100vh - 250px);
  width: calc(100% - 390px);
  max-width: 1200px;
}
.row{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.col-vs,
.col-fs{
  width: 100%;
  height: 50%;
}

</style>
