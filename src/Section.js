
/**
 * @example   { 
                height: 300
                width: 300
                x: 0
                y: 0
                _indexMap:{
                  0: true
                  1: true
                }
                _indices: [0,1]
              }
 */

class Section {
  constructor ({height,width,x,y}){
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

    //收集当前应该显示哪些块
    this._indexMap = {};

    //收集当前需要显示块的索引并保持它们
    this._indices = [];
  }

  //添加块的索引
  addCellIndex ({index}) {
    if (!this._indexMap[index]) {
      // 收集当前应该显示那些块
      this._indexMap[index] = true;
      // 收集当前需要显示块的索引并保持它们
      this._indices.push(index);
    }
  }

  //获取所有块的索引
  getCellIndex(){
    return this._indices;
  }


}

export default Section;