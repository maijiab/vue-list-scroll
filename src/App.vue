<template>
  <div class="zy-wrapper" :style="wrapperStyle">
    <div class="zy-wrapper-container" :style="scrollHeight" >
      <div class="cell-container" v-for="(item,index) in displayItems" :key="index"  :style="getComputedStyle(item, index)">
        {{item.data}}
      </div>
    </div>
  </div>
</template>

<script>
import SectionManager from "./SectionManager"

export default {
  computed:{
    wrapperStyle(){
      return {
        height:this.height + 'px',
        width:this.width + 'px'
      }
    },
    // 创建滚动区域
    scrollHeight () {
        let scrollHeight = 0;
        let scrollWidth = 0;
        
        // 遍历循环计算出滚动区域的总宽度和总高度
        this._sectionManager._cellMetadata.forEach((sizeAndPosition) => {
          const {x, y, width, height} = sizeAndPosition;
          const bottom = y - height;
          const right = x - width;
          if (bottom > scrollHeight) {
            scrollHeight = bottom
          }
          if (right > scrollWidth) {
            scrollWidth = right
          }
        });

        return {
          height: scrollHeight + 'px',
          width: scrollWidth + 'px'
        }
      }
  },
  created(){
    // 获取块的管理
    this._sectionManager = new SectionManager(this.sectionSize);
    this.registerCellsToSectionManeger();
    this.flushDisplayItems();
  },
  data(){
    return {
      collection:new Array(100).fill(0).map((_,index)=>({
        data:'#'+index
      })),
      width:500,
      height:500,
      sectionSize:300,
      displayItems:[],
    }
  },
  methods:{
    /**
     * 
     */
    registerCellsToSectionManeger(){
      if(!this._sectionManager){
        this._sectionManager = new SectionManager(this.sectionSize);
      }

      this.collection.forEach((item,index)=>{
        this._sectionManager.registerCell({
          index,
          cellMetadatum:this.cellSizeAndPositionGetter(item,index)
        })
      })
    },

    cellSizeAndPositionGetter(item,index){
      // 计算大小和位置
      return {
        width: 100,
        height: 150,
        x: (index % 2 * 110),
        y: parseInt(index / 2) * 160
      }
    },

    //设置当前视图我们应该显示的那些区块
    flushDisplayItems(){
      let scrollTop = 0;
      let scrollLeft = 0;

      // 然后这里我们需要去设置当前视图中应该渲染那些块
      // 于是我们要在 SectionManager类中定义一个方法去获取需要渲染的那个块的索引
      let index = this._sectionManager.getCellIndex({
        height: this.height,
        width: this.width,
        x: scrollLeft,
        y: scrollTop
      });

      const displayItems = [];
      index.forEach((index)=>{
        displayItems.push({
          index,
          ...this.collection[index]
        })
      })

      if(window.requestAnimationFrame){
        window.requestAnimationFrame(()=>{
          this.displayItems = displayItems;
        })
      }else{
        this.displayItems = displayItems
      }        
      console.log(this.displayItems);

    },

    getComputedStyle(displayItem){
      if(!displayItem){
        return
      }

      console.log(this._sectionManager);
      const {width,height,x,y} = this._sectionManager._cellMetadata[displayItem.index];

      return {
        left:`${x}px`,
        top:`${y}px`,
        width:`${width}px`,
        height:`${height}px`
      }
    }

  }
}
</script>

<style>
  .zy-wrapper{
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .zy-wrapper-container{
    position: relative;
  }

  .cell-container{
    position: absolute;
  }

</style>