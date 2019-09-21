<template>
  <div id="app">
    <div class="text1">CSS实现方式：</div>
    <sector></sector>
    <div class="text2">canvas实现方式：</div>
    <bottom-animation></bottom-animation>
  </div>
</template>

<script>
import Sector from './components/Sector'
import BottomAnimation from './components/BottomAnimation'
import PromiseTest from './utils/PromiseTest'
import AsyncTest from './utils/AsyncTest'
export default {
  name: 'app',
  mixins: [PromiseTest, AsyncTest],
  components: {
    Sector,
    BottomAnimation
  },
  data() {
    return {}
  },
  methods: {},
  created() {
    this.initPromiseData()
    // this.initAsyncData()
  }
}
</script>

<style lang="scss">
@import './style/_base.scss';
#app {
  left: 0;
  top: 0;
  position: absolute;
  background: #051226;
  width: 100%;
  height: 100%;
  .text1,
  .text2 {
    font-size: 20px;
    color: white;
  }
  .text1 {
    position: relative;
    left: 30%;
    top: 25%;
  }
  .text2 {
    position: relative;
    left: 30%;
    top: 70%;
  }
  .top-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    margin-top: 8px;
    height: px2rem(40);
  }
}
</style>
