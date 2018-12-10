<template>
  <div :class="showWarn >= 0 ? 'drag':'drag_warn'" ref="drag">
    <div ref="bg" class="drag_bg"></div>
    <div ref="txt" class="drag_text">{{confirmWords}}</div>
    <div ref="mover" @mousedown="mousedown($event)" @mousemove="mousemove($event)" @mouseup="mouseup($event)"
         @mouseleave="mouseup($event)"
         :class="{'handler_ok_bg':confirmSuccess}"
         class="handler handler_bg" style="position: absolute;top: 0px;left: 0px;"></div>
  </div>
</template>
<script>
  export default {
    props: {
      showWarn: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        beginClientX: 0, /*距离屏幕左端距离*/
        mouseMoveStata: false, /*触发拖动状态  判断*/
        maxwidth: '', /*拖动最大宽度，依据滑块宽度算出来的*/
        confirmWords: '拖动滑块验证', /*滑块文字*/
        confirmSuccess: false,
        downSuccess: false
      }
    },
    methods: {
      reset: function () {
        this.downSuccess = false
        this.confirmSuccess = false
        this.confirmWords = "拖动滑块验证"
        this.$refs.txt.style.color = '#fff'
        this.$refs.mover.style.left = 0 + 'px';
        this.$refs.bg.style.width = 0 + 'px';
      },
      mousedown: function (ev) {
        if (!this.downSuccess) {
          this.$emit("validate");
        } else {
          if (!this.confirmSuccess) {
            //阻止文字选中等 浏览器默认事件
            if (event.preventDefault) {
              event.preventDefault();
            } else {
              event.returnValue = false;
            }
            this.mouseMoveStata = true;
            this.beginClientX = ev.clientX;
          }
        }
      },
      success() {
        if (this.confirmSuccess) {
        } else {
          this.confirmSuccess = true
          this.confirmWords = '验证通过';
          this.$refs.txt.style.color = '#fff'
          this.$refs.mover.style.left = this.maxwidth + 'px';
          this.$refs.bg.style.width = this.maxwidth + 'px';
          this.$emit("checkcode", parseInt(Math.random() * 9, 10) + 1);
        }
      },
      mousemove(e) {
        if (this.mouseMoveStata) {
          let width = e.clientX - this.beginClientX;
          if (width > 0 && width <= this.maxwidth) {
            this.$emit("checkcode", 0);
            this.$refs.mover.style.left = width + 'px';
            this.$refs.bg.style.width = width + 'px';
          } else if (width > this.maxwidth) {
            this.success();
          }
        }
      },
      mouseup(e) {
        this.mouseMoveStata = false;
        if (!this.confirmSuccess) {
          let width = e.clientX - this.beginClientX;
          if (width < this.maxwidth) {
            this.$refs.mover.style.left = 0 + 'px';
            this.$refs.bg.style.width = 0 + 'px';
          }
        }
      }
    },
    mounted() {
      this.maxwidth = this.$refs.drag.clientWidth - this.$refs.mover.clientWidth;
    }
  }
</script>

<style scoped>
  .drag {
    position: relative;
    background-color: #e8e8e8;
    width: 100%;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }

  .drag_warn {
    position: relative;
    background-color: #e8e8e8;
    border: 1px solid #ed4014;
    width: 100%;
    height: 35px;
    line-height: 34px;
    text-align: center;
  }

  .handler {
    width: 40px;
    height: 34px;
    border: 1px solid #ccc;
    cursor: move;
  }

  .handler_bg {
    background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==") no-repeat center;
  }

  .handler_ok_bg {
    background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==") no-repeat center;
  }

  .drag_bg {
    background-color: #7ac23c;
    height: 34px;
    width: 0px;
  }

  .drag_bg_warn {
    background-color: #7ac23c;
    height: 34px;
    width: 0px;
  }

  .drag_text {
    position: absolute;
    top: 0px;
    width: 100%;
    text-align: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
  }
</style>
