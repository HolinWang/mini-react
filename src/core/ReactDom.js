import React from "./React.js";

const {render} = React;
const ReactDOM = {
  /**
   * @param {*} container  根容器
   * @returns 
   */
  createRoot(container){
    return{
      render(App){
        render(App,container)
      }
    }
  }
}

export default ReactDOM;