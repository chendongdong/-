<template>
  <div class="sector">
    <!-- ondragstart="return false" 禁止图片拖拽 -->
    <img src="../assets/ic_sector_bcg.png" class="sector-bcg" ondragstart="return false" />
    <div class="sector-container">
      <div :class="['sector-inner', { 'select-wrap': isSelectAll }]"></div>
      <div :class="['sector-wrap', { 'select-wrap': isSelectAll }]">
        <div class="sector-ul" :style="{ transform: `rotate(${sectorAngle}deg)` }">
          <ul>
            <li class="item" v-for="(item, key) in showText" :style="{ transform: `rotate(${key * rotateAngle}deg) skew(${skewAngle}deg)` }" :key="key">
              <p
                :class="['text', { select: isSelectAll || key == selectKey }]"
                :style="{ transform: `skew(${-skewAngle}deg) rotate(${skewAngle - rotateAngle - 90}deg)` }"
                @click="clickItem(key)"
              >
                <span v-for="(s, i) in item" :key="i" :style="{ transform: `translateY(${getY(i, item.length)}px) rotate(${getR(i, item.length)}deg)` }">{{ s }}</span>
              </p>
              <span :class="['line', { 'line-select': isSelectAll }]"></span>
            </li>
          </ul>
        </div>
        <img src="../assets/ic_rotate.png" class="img-rotate" ondragstart="return false" />
      </div>
    </div>
    <div class="all-select" @click="isSelectAll = !isSelectAll"></div>
    <img src="../assets/ic_sector_arrow.png" class="select-arrow" v-show="!isSelectAll" ondragstart="return false" />
    <div class="left-circle"></div>
    <div class="right-circle"></div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      isSelectAll: false,
      n: 5,
      showText: [],
      sectorAngle: 0,
      rotateAngle: 0,
      skewAngle: 0,
      selectKey: -1,
      centerIdx: 0,
      statistic: ['高空鹰眼', '路口鹰眼', '视频监控', '警车云镜', '铁骑云镜', '执法记录'],
      statisKey: ['hightAR', 'crossAR', 'vedioMonitor', 'policeIPC', 'IPC', 'recorder'],
      selectKeyList: ['hightAR']
    }
  },
  watch: {
    isSelectAll(val) {
      if (val) {
        this.selectKeyList = this.statisKey
      } else if (this.selectKey >= 0) {
        // 全选状态时，再点击中间位置的item, selectKey不变，watch 监听不到，所以在这里处理
        let text = this.showText[this.selectKey]
        console.log('text=', text)
        let key = this.statistic.indexOf(text)
        this.selectKeyList = [this.statisKey[key]]
      }
    },
    selectKey(val, oldVal) {
      console.log('watch selectKey=', val)
      if (val >= 0 && oldVal >= 0) {
        let text = this.showText[val]
        console.log('text=', text)
        let key = this.statistic.indexOf(text)
        this.selectKeyList = [this.statisKey[key]]
        setTimeout(() => {
          this.updateData()
        }, 2000)
      }
    }
  },
  methods: {
    getY(i, len) {
      let s = Number.parseInt(len / 2) * 2
      if (len <= 2) {
        return -s
      } else {
        let center = Number.parseInt(len / 2)
        if (len % 2 == 0 && i < center) {
          return Math.abs(center - i - 1) * 2 - s
        } else {
          return Math.abs(center - i) * 2 - s
        }
      }
    },
    getR(i, len) {
      if (len == 1) {
        return 0
      } else if (len == 2) {
        return -4
      } else {
        let center = Number.parseInt(len / 2)
        if (len % 2 == 0) {
          if (center >= i) {
            return -4 + (i - center + 1) * 8
          } else {
            return 4 + (i - center) * 8
          }
        } else {
          return (i - center) * 8
        }
      }
    },
    initData() {
      let selectIdx
      if (this.selectKeyList.length == this.statisKey.length) {
        this.isSelectAll = true
        selectIdx = this.centerIdx
      } else {
        selectIdx = this.statisKey.indexOf(this.selectKeyList[0])
      }
      for (let i = selectIdx - this.centerIdx; i <= selectIdx + this.centerIdx * 2 + 1; i++) {
        this.showText.push(this.statistic[this.getIdx(i, this.statistic.length)])
      }
      for (let j = selectIdx - this.centerIdx * 2; j < selectIdx - this.centerIdx; j++) {
        this.showText.push(this.statistic[this.getIdx(j, this.statistic.length)])
      }
    },
    updateData(val) {
      let s = this.showText[val]
      let idx = this.statistic.indexOf(s)
      // console.log('当前元素s=' + s + ' 下标idx=' + idx)
      let leftCount = this.centerIdx * 2
      // 重新设置左边数据
      for (let i = 1; i <= leftCount; i++) {
        let showIdx = this.getIdx(val - i, this.showText.length)
        let statisIdx = this.getIdx(idx - i, this.statistic.length)
        this.showText.splice(showIdx, 1, this.statistic[statisIdx])
        // console.log('左边 替换 下标=' + showIdx + ' 元素=' + this.statistic[statisIdx])
      }
      let rightCount = this.centerIdx * 2 + 1
      for (let i = 1; i <= rightCount; i++) {
        let showIdx = this.getIdx(val + i, this.showText.length)
        let statisIdx = this.getIdx(idx + i, this.statistic.length)
        this.showText.splice(showIdx, 1, this.statistic[statisIdx])
        // console.log('右边 替换 下标=' + showIdx + ' 元素=' + this.statistic[statisIdx])
      }
    },
    getIdx(idx, len) {
      let k = idx
      if (idx < 0) {
        k = len + idx
      } else if (idx >= len) {
        k = idx % len
      }
      return k
    },
    clickItem(key) {
      if (this.isSelectAll) {
        this.isSelectAll = false
      }
      let selectIdx = this.selectKey
      if (this.selectKey == -1) {
        selectIdx = this.centerIdx
      }
      let count = Math.abs(key - selectIdx)
      if (count > this.centerIdx) {
        if (selectIdx >= 0 && selectIdx < this.centerIdx) {
          // 选中第一个，点击最后一个，点击左边
          this.sectorAngle += (this.showText.length - key + selectIdx) * this.rotateAngle
          // console.log('左边极限 count=' + count + ' 取模=' + (count % (this.centerIdx + 1)))
        } else {
          // 选中最后一个，点击第一个, 点击右边
          this.sectorAngle -= (this.showText.length + key - selectIdx) * this.rotateAngle
        }
      } else {
        this.sectorAngle -= (key - selectIdx) * this.rotateAngle
      }
      this.selectKey = key
    }
  },
  created() {
    this.centerIdx = Number.parseInt(this.n / 2)
    this.selectKey = this.centerIdx
    this.initData()
    this.rotateAngle = 360 / (this.n * 2)
    this.skewAngle = 90 - this.rotateAngle
  }
}
</script>
<style lang="scss">
@import '../style/_base.scss';
.sector {
  $circleR: px2rem(271);
  $textHeight: px2rem(72);
  position: fixed;
  left: 50%;
  bottom: 50%;
  transform: translateX(-50%);
  .sector-container {
    width: $circleR * 2;
    height: $circleR;
    overflow: hidden;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(50% + #{px2rem(9)});
    .sector-wrap {
      cursor: pointer;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 0;
      transform-origin: 100% 100%;
      width: calc(#{$circleR} * 2);
      height: calc(#{$circleR} * 2);
      border-radius: 100%;
      box-sizing: border-box;
      border: 1px solid #5e80c5;
      box-shadow: 0 1px 4px 0px #699bfc;
      background: radial-gradient(
        transparent,
        transparent calc(#{$circleR} - #{$textHeight}),
        rgba(15, 29, 57, 0.6) calc(#{$circleR} - #{$textHeight}),
        rgba(15, 29, 57, 0.6) $circleR
      );
    }
    .sector-inner {
      position: absolute;
      left: $textHeight;
      top: $textHeight;
      width: calc((#{$circleR} - #{$textHeight}) * 2);
      height: calc((#{$circleR} - #{$textHeight}) * 2);
      border-radius: 100%;
      box-sizing: border-box;
      border: 2px solid #5e80c5;
      box-shadow: 0 1px 4px 0px #699bfc;
    }
    .select-wrap {
      border: 2px solid #3df6ff;
      box-shadow: 0 3px 4px 0px #ecc3f3;
    }
  }

  .item {
    width: $circleR;
    height: $circleR;
    font-size: px2rem(20);
    transform-origin: 100% 100%;
    position: absolute;
    box-sizing: border-box;
    left: 0;
    top: 0;
    overflow: hidden;
  }
  .text {
    width: $circleR * 2;
    height: $circleR * 2;
    text-align: center;
    position: relative;
    padding-top: calc((#{$textHeight} - #{px2rem(20)}) / 2);
    color: #acc0e6;
    box-sizing: border-box;
    &:active,
    &:hover,
    &.select {
      color: #fff;
      background: radial-gradient(transparent calc(#{$circleR} - #{$textHeight}), rgba(41, 204, 255, 0.6) calc(#{$circleR} - #{$textHeight}), rgba(41, 204, 255, 0.6) $circleR);
    }
    span {
      display: inline-block;
      transition: none 0s ease 0s;
    }
  }
  .line {
    position: absolute;
    left: 2px;
    bottom: 0px;
    content: '';
    background: #5e80c5;
    box-shadow: 0 1px 4px 0px #699bfc;
    width: $textHeight;
    height: 2px;
    &.line-select {
      background: #3df6ff;
      box-shadow: 0 3px 4px 0px #ecc3f3;
    }
  }

  .sector-ul {
    position: absolute;
    border-radius: 100%;
    overflow: hidden;
    z-index: 9;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    transition: transform 0.8s linear;
  }
  .sector-bcg {
    height: $circleR + $textHeight;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
  .img-rotate {
    width: calc(2 * (#{$circleR} - #{$textHeight}) - #{px2rem(10)});
    position: absolute;
    left: 50%;
    top: calc(#{$textHeight} + #{px2rem(5)});
    border-radius: 50%;
    z-index: 10;
    animation: img-rotate 3s infinite linear;
  }
  @keyframes img-rotate {
    0% {
      transform: translateX(-50%) rotate(0deg);
    }
    100% {
      transform: translateX(-50%) rotate(360deg);
    }
  }
  .all-select {
    cursor: pointer;
    width: px2rem(54);
    height: px2rem(58);
    bottom: px2rem(73);
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    background: url('../assets/ic_all_nor.png') center no-repeat;
    background-size: 100%;
    z-index: 11;
    &:active {
      background-image: url('../assets/ic_all_select.png');
    }
  }
  .select-arrow {
    position: fixed;
    bottom: calc(#{$circleR} + 3px);
    left: 50%;
    height: px2rem(33);
    transform: translateX(-50%);
  }
  $circleWid: px2rem(34);
  .circle {
    width: $circleWid;
    height: $circleWid;
    background: url('../assets/ic_circle.png') center no-repeat;
    background-size: 100%;
    position: fixed;
    bottom: px2rem(26);
  }
  .left-circle {
    @extend .circle;
    left: calc(50% - #{$circleWid} - #{px2rem(594 / 2 + 10)});
    animation: left-rotate 2s infinite linear;
  }
  .right-circle {
    @extend .circle;
    left: calc(50% + #{px2rem(594 / 2 + 10)});
    animation: right-rotate 2s infinite linear;
  }
  @keyframes left-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes right-rotate {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
}
</style>
