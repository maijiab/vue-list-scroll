//用于创建每一个块所包含的信息
import Section from './Section'

const SECTION_SIZE = 600;

class SectionManager {
  constructor(sectionSize = SECTION_SIZE){
    // 设置默认视图大小
    this._sectionSize = sectionSize;

    /**
     * @description 收集所有cell的数据
     * @example   0: {height: 82.86971190771277, width: 75, x: 0, y: 0}
     *            1: {height: 135.70965757896562, width: 75, x: 85, y: 0}
     */
    this._cellMetadata = [];
    /**@description 用于收集一个section所包含的信息
     * @example{
     *           0.0: 
     *           {
     *             height: 300
     *             width: 300
     *             x: 0
     *             y: 0
     *             _indexMap: {0: true, 1: true}
     *             _indices: (2) [0, 1]
     *           }
     *          }
     */

    this._sections = {};

  }



  registerCell({cellMetadatum,index}){
    this._cellMetadata[index] = cellMetadatum;

    this.getSections(cellMetadatum).forEach((section)=>{
      return section.addCellIndex({index})
    })
  }

  getSections({height,width,x,y}){
    /**
     * @description 设置该块的分割线,即该cell处于那个Section
     * @example   
                  =>┏━━┯━━┯━━┓ 分割线sectionY
                  0┃0 0 ┊1 3 ┊6 6 ┃
                  1┃0 0 ┊2 3 ┊6 6 ┃
                  =>┠┈┈┼┈┈┼┈┈┨ 分割线 sectionY
                  2┃4 4 ┊4 3 ┊7 8 ┃
                  3┃4 4 ┊4 5 ┊9 9 ┃
                  ┗━━┷━━┷━━┛
                  ↑    ↑
                  sectionX sectionX
    */
    // 设置该块X轴的分割线
    const sectionXStart = Math.floor(x /this._sectionSize);
    const sectionXStop = Math.floor((x + width ) / this._sectionSize)

    // 设置该块Y轴的分割线
    const sectionYStart = Math.floor(y / this._sectionSize);
    const sectionYStop = Math.floor((y + height - 1) / this._sectionSize);

    // 设置用于保存所有重叠的块
    const sections = [];

    //创建块的范围
    for(let sectionX= sectionXStart; sectionX<= sectionXStop; sectionX++){
      for(let sectionY = sectionYStart; sectionY<=sectionYStop; sectionY++){
        const key = `${sectionX}.${sectionY}`;
        if(!this._sections[key]){
          this._sections[key] = new Section({
            height:this._sectionSize,
            width:this._sectionSize,
            x:sectionX * this._sectionSize,
            y:sectionY * this._sectionSize
          });
        }
        sections.push(this._sections[key]) 
      }
    }
    return sections
  }

  // 获取需要渲染那些块的索引
  // 一个块中可能会包含其他块的部分范围
  //_section中已存cell
  getCellIndex ({height, width, x, y}) {
   const indices = {};

   this.getSections({height,width,x,y}).forEach((section)=>{
     section.getCellIndex().forEach((index)=>{
       return indices[index] = index
     })
   })

   //因为indices是一个object所以我们要把它转换成为Number来得到索引
   return Object.keys(indices).map((index)=>{
    return indices[index];
   })
  }

  

}


export default SectionManager;