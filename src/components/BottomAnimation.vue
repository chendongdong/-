<template>
  <div>
    <img src="../assets/ic_sector_bcg.png" class="sector-bcg" />
    <div class="compass-wrapper">
      <canvas id="canvas" :width="canvasWid" :height="canvasHei" :style="{ transition: !isRotate ? 'none' : 'transform 1s', transform: 'rotate(' + rotateDeg + 'deg)' }"></canvas>
    </div>
    <img src="../assets/ic_rotate.png" :width="2 * sectorInnerR - 6" class="img-rotate" />
    <div class="all-select" @click="selectAll"></div>
    <img src="../assets/ic_sector_arrow.png" class="select-arrow" v-show="!isSelectAll" />
    <div class="left-circle"></div>
    <div class="right-circle"></div>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from 'timers'
export default {
  data() {
    return {
      ctx: null,
      canvasWid: 480,
      canvasHei: 480,
      sectorOutR: 240,
      sectorTextR: 208,
      sectorInnerR: 176,
      lineAngle: 0.5, // 线（空白）的宽度
      nAngle: 0, // 每个模块的宽度
      n: 10, // 模块的个数
      textAngle: 20, // 文字所占角度的宽度
      staticText: ['高空鹰眼', '路口鹰眼', '视频监控', '警车云镜', '铁骑云镜', '执法记录'],
      compassText: [],
      angles: [],
      centerIdx: 0,
      selectIdx: 2,
      pressIdx: 2,
      selectAngleIdx: 7,
      pressAngleIdx: 7,
      rotateDeg: 0,
      canvas: null,
      isSelectAll: false,
      selectBcg: 'rgba(41,204,255,0.6)',
      normalBcg: 'rgba(15,29,57,0.6)',
      isDown: false,
      isMove: false,
      isRotate: false,
      rotateTimer: null
    }
  },
  methods: {
    selectAll() {
      this.isSelectAll = !this.isSelectAll
      this.initDraw()
    },
    // 角度转换成弧度
    rads(x) {
      return (Math.PI * x) / 180
    },
    // 画扇形
    drawArc(a, b, r, fillStyle, strokeGradient) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.canvasWid / 2, this.canvasHei / 2)
      this.ctx.arc(this.canvasWid / 2, this.canvasHei / 2, r, this.rads(a), this.rads(b))
      // this.ctx.closePath()
      this.ctx.fillStyle = fillStyle
      this.ctx.strokeStyle = strokeGradient
      this.ctx.stroke()
      this.ctx.fill()
      this.ctx.closePath()
    },
    drawCircle(a, b, r, width, color) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.canvasWid / 2, this.canvasHei / 2)
      this.ctx.arc(this.canvasWid / 2, this.canvasHei / 2, r, this.rads(a), this.rads(b))
      // this.ctx.lineWidth = width
      // this.ctx.fillStyle = 'transparent'
      this.ctx.strokeStyle = color
      this.ctx.stroke()
      // this.ctx.fill()
      this.ctx.closePath()
    },
    // 画文字
    drawCircularText(s, string, startAngle, endAngle, color) {
      var radius = s.radius,
        angleDecrement = (startAngle - endAngle) / (string.length - 1),
        angle = parseFloat(startAngle),
        index = 0,
        character

      this.ctx.save()

      this.ctx.fillStyle = color
      this.ctx.font = '20px 微软雅黑'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      while (index < string.length) {
        character = string.charAt(index)

        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.translate(s.x + Math.cos(angle) * radius, s.y + Math.sin(angle) * radius)
        this.ctx.rotate(Math.PI / 2 + angle)
        this.ctx.fillText(character, 0, 0)
        angle -= angleDecrement
        index++
        this.ctx.restore()
      }
      this.ctx.restore()
      this.ctx.closePath()
    },
    // https://blog.csdn.net/qq_20423863/article/details/90701917
    getEventPosition(ev) {
      var x, y
      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX
        y = ev.layerY
      } else {
        x = ev.offsetX
        y = ev.offsetY
      }
      return { x: x, y: y }
    },
    rotateCanvas() {
      if (this.isRotate || !this.isDown || this.pressAngleIdx == this.selectAngleIdx) {
        return
      }
      if (this.rotateTimer) {
        clearTimeout(this.rotateTimer)
        this.rotateTimer = null
      }
      console.log('抬起，旋转--')
      this.isDown = false
      this.isRotate = true
      let moveAngle = Math.abs(this.pressAngleIdx - this.selectAngleIdx) * (this.nAngle + this.lineAngle)
      if (this.pressAngleIdx < this.selectAngleIdx) {
        this.rotateDeg += moveAngle
      } else if (this.pressAngleIdx > this.selectAngleIdx) {
        this.isRotate = true
        this.rotateDeg -= moveAngle
      }
      // 等动画旋转完毕后再重现渲染
      setTimeout(() => {
        this.isRotate = false
        this.rotateDeg = 0
        this.selectIdx = this.pressIdx
        this.pressAngleIdx = this.selectAngleIdx
        this.initDraw()
      }, 800)
    },
    pressCanvas(event) {
      if (this.isRotate) {
        console.log('不处理----')
        return
      }
      let pos = this.getEventPosition(event)
      // 通过两条直角边，获取斜边，即r
      let r = Math.sqrt(pos.x * pos.x + (this.canvasHei / 2 - pos.y) * (this.canvasHei / 2 - pos.y))
      if (r > this.sectorInnerR && r < this.sectorOutR) {
        this.isDown = true
        console.log('按下，设置选中---')
        // 获取反余弦值
        let acos = Math.acos(Math.abs(pos.x / r))
        // 将弧度转成角度
        let angle = Number.parseFloat((acos * 180) / Math.PI)
        if (pos.x <= 0) {
          angle += 180
        } else {
          // 先求angle的补交
          angle = 180 - angle + 180
        }
        for (let i = 0; i < this.angles.length; i++) {
          // 判断当前点击的模块
          if (angle >= this.angles[i].s && angle < this.angles[i].e) {
            if (this.isSelectAll) {
              this.isSelectAll = false
            }
            this.pressAngleIdx = i
            let count = Math.abs(this.selectAngleIdx - i)
            if (i < this.selectAngleIdx) {
              // 点击左边
              this.pressIdx -= count
            } else if (i > this.selectAngleIdx) {
              // 点击右边
              this.pressIdx += count
            }
            this.pressIdx = this.handleBorder(this.pressIdx)
            this.initDraw()
            if (count != 0) {
              // 有时候会丢失mouseup事件，设置延迟定时旋转
              // this.rotateTimer = setTimeout(() => {
              //   this.rotateCanvas()
              // }, 300)
            }
            break
          }
        }
      } else {
        this.pressAngleIdx = this.selectAngleIdx
        this.initDraw()
      }
    },
    addListener() {
      this.canvas.addEventListener('mousemove', event => {
        this.pressCanvas(event)
      })
      this.canvas.addEventListener('mousedown', event => {
        if (this.pressAngleIdx == this.selectAngleIdx) {
          this.pressCanvas(event)
        }
      })
      this.canvas.addEventListener('mouseout', event => {
        console.log('mouseout---')
        this.pressAngleIdx = this.selectAngleIdx
        this.initDraw()
      })
      this.canvas.addEventListener('click', event => {
        console.log('click---')
        this.initDraw(true)
        // this.rotateCanvas()
      })
    },
    initDraw(isRotate) {
      // 清除画板
      this.ctx.clearRect(0, 0, this.canvasWid, this.canvasHei)
      let smccircle = { x: this.canvasWid / 2, y: this.canvasHei / 2, radius: this.sectorTextR }
      let textStart // 文字开始角度

      let strokeGradient = this.ctx.createRadialGradient(smccircle.x, smccircle.y, 0, smccircle.x, smccircle.y, this.sectorOutR)
      let scale = this.sectorInnerR / this.sectorOutR
      strokeGradient.addColorStop(0, 'transparent')
      strokeGradient.addColorStop(scale, 'transparent')
      strokeGradient.addColorStop(scale, 'rgba(255,255,255,0.5)')
      strokeGradient.addColorStop(1, 'rgba(255,255,255,0.5)')
      for (let i = 0; i < this.n; i++) {
        let bcg = ''
        let textColor = '#ACC0E6'
        if (this.isSelectAll) {
          bcg = this.selectBcg
        } else {
          if (isRotate) {
            bcg = i == this.pressAngleIdx ? this.selectBcg : this.normalBcg
          } else {
            bcg = i == this.selectAngleIdx || i == this.pressAngleIdx ? this.selectBcg : this.normalBcg
          }
          // if (this.pressIdx == this.selectIdx) {
          //   bcg = i == this.selectAngleIdx ? this.selectBcg : this.normalBcg
          // } else {
          //   bcg = i == this.pressAngleIdx ? this.selectBcg : this.normalBcg
          // }
        }
        let fillGradient = this.ctx.createRadialGradient(smccircle.x, smccircle.y, 0, smccircle.x, smccircle.y, this.sectorOutR)
        fillGradient.addColorStop(0, 'transparent')
        fillGradient.addColorStop(scale, 'transparent')
        fillGradient.addColorStop(scale, bcg)
        fillGradient.addColorStop(1, bcg)
        // 画扇形
        this.drawArc(this.angles[i].s, this.angles[i].e, this.sectorOutR, fillGradient, strokeGradient)
        textStart = this.angles[i].s + (this.nAngle - this.textAngle) / 2
        textColor = bcg == this.selectBcg ? '#ffffff' : '#ACC0E6'
        if (i >= this.n / 2) {
          // 显示内容
          let k = i - this.n / 2 + this.selectIdx - this.centerIdx
          k = this.handleBorder(k)
          this.drawCircularText(smccircle, this.compassText[k], this.rads(textStart), this.rads(textStart + this.textAngle), textColor)
        }
        if (i < this.centerIdx) {
          // 尾部
          let j = this.selectIdx + this.centerIdx + i + 1
          j = this.handleBorder(j)
          this.drawCircularText(smccircle, this.compassText[j], this.rads(textStart), this.rads(textStart + this.textAngle), textColor)
        }
        if (i > this.centerIdx && i < this.n / 2) {
          // 头部
          let l = this.selectIdx - this.centerIdx * 2 + i - (this.centerIdx + 1)
          l = this.handleBorder(l)
          this.drawCircularText(smccircle, this.compassText[l], this.rads(textStart), this.rads(textStart + this.textAngle), textColor)
        }
      }
      console.log('绘制完成')
      if (isRotate) {
        this.rotateCanvas()
      }
    },
    handleBorder(k) {
      if (k < 0) {
        k += this.compassText.length
      }
      if (k >= this.compassText.length) {
        k -= this.compassText.length
      }
      return k
    },
    initData() {
      this.nAngle = (360 - this.n * this.lineAngle) / this.n // 每个模块所占的角度
      let startAngle = 0 // 模块开始角度
      this.angles = [] // 每个模块对应的角度
      for (let i = 0; i < this.n; i++) {
        startAngle = i * (this.lineAngle + this.nAngle) + this.lineAngle / 2
        let itemAngle = {
          s: startAngle,
          e: startAngle + this.nAngle
        }
        this.angles.push(itemAngle)
      }
      // console.log('this.angles=', this.angles)
      this.initDraw()
    }
  },
  mounted() {
    this.$nextTick(function() {
      if (this.n < this.compassText.length) {
        console.log('模块的个数不能大于轮盘个数')
        return
      }
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      if (!this.canvas.getContext) {
        return
      }
      this.initData()
      this.addListener()
    })
  },
  created() {
    if (this.staticText.length < 5) {
      this.n = this.staticText.length * 2
    } else {
      this.n = 5 * 2
    }
    this.centerIdx = Number.parseInt(this.n / 4)
    let header = this.staticText.slice(this.staticText.length - this.centerIdx)
    let end = this.staticText.slice(0, this.centerIdx)
    this.compassText = [...header, ...this.staticText, ...end]
    // console.log('compassText=', this.compassText)
    this.selectIdx = this.centerIdx + header.length
    this.pressIdx = this.selectIdx
    this.selectAngleIdx = Number.parseInt((this.n * 3) / 4)
    this.pressAngleIdx = this.selectAngleIdx
    // console.log('n=' + this.n + ' selectIdx=' + this.selectIdx + ' selectAngleIdx=' + this.selectAngleIdx + ' centerIdx=' + this.centerIdx)
  }
}
</script>
<style lang="scss">
$circleR: 240px;
.compass-wrapper {
  position: fixed;
  left: 50%;
  // bottom: 0;
  bottom: -$circleR;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 10;
}
.sector-bcg {
  height: $circleR + 60px;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.img-rotate {
  position: fixed;
  left: 50%;
  bottom: -170px;
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
  width: 54px;
  height: 58px;
  bottom: 73px;
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
  bottom: $circleR;
  left: 50%;
  height: 32px;
  transform: translateX(-50%);
}
.circle {
  width: 34px;
  height: 34px;
  background: url('../assets/ic_circle.png') center no-repeat;
  background-size: 100%;
  position: fixed;
  bottom: 20px;
}
.left-circle {
  @extend .circle;
  left: calc(50% - 34px - #{$circleR} - 27px);
  animation: left-rotate 2s infinite linear;
}
.right-circle {
  @extend .circle;
  left: calc(50% + #{$circleR} + 27px);
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
</style>
