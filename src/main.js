/**
 * 需求： 实现页面呈现 app
 * <div id="root">
 *   <div id="app">app</div>
 * </div>
 * 
 * 开发思路：
 * 第一阶段：使用最简单的方式让页面显示app
 *    1. 创建一个dom节点 id为app 类型为div
 *    2. 将id为app追加到根容器root节点
 *    3. 创建一个空的文本节点textNode，并将文本节点的nodeValue设置为 “app”
 *    4. 将textNode追加到dom节点app后面
 * 
 * 第二阶段：重构第一阶段的方式，引用React VDom结构来重构
 * 思考：
 *    1. 首先VDom是什么？  =》 javascript Object        对象
 *    2. 创建的节点有类型区别。结合第一步和第三步来看      type
 *    3. 创建的节点有自己的属性。比如说textNode 有nodeValue属性。   props
 *    4. 节点之间有层级之分，是一个树状结构，root => app =>...。    children
 * 
 * 
 * 第三阶段： 已经引用了React VDom结构来重构，但是还是存在问题 =》 现在我们的dom是写死的数据，所以第三阶段的任务是 动态创建VDom
 * 
 * 思考：如何动态创建VDom？
 * 既然是创建节点，可以用函数方法来创建。
 * 创建element可以使用createElement方法
 * 创建textNode可以使用createTextNode方法
 * 
 * 
 * 第四阶段：虽然已经实现了动态创建VDom，但是目前的结构比较单一，不具备动态生成dom的需求，递归思想动态渲染
 * 抽象动作：
 *    1. 创建节点
 *    2. set 属性props
 *    3. 追加到父节点 append
 */

/**###################################### 第一阶段 ################################### */

/* 
const dom = document.createElement("div");
dom.id = "app";
document.querySelector("#root").append(dom);

const textNode = document.createTextNode("");
textNode.nodeValue = "app";
dom.append(textNode);

console.log(document.querySelector("#root"))
*/

/**###################################### 第二阶段 ################################### */

/** 
  const element = {
    type:"div",
    props:{
      id:"app",
      children:[
        {
          type:"TEXT_ELEMENT",
          props:{
            nodeValue:"app",
            children:[]
          }
        }
      ]
    }
  }
*/
/* const textElement = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "app",
    children: []
  }
}

const element = {
  type:"div",
  props:{
    id:"app",
    children:[textElement]
  }
}

const dom = document.createElement(element.type);
dom.id = element.props.id;
document.querySelector("#root").append(dom);

const textNode = document.createTextNode("");
textNode.nodeValue = textElement.props.nodeValue;
dom.append(textNode);

console.log(document.querySelector("#root")) */


/**###################################### 第三阶段 ################################### */

/* const createTextNodeElement = (text) =>{
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

const createElement = (type,props,...children) =>{
  return {
    type:type,
    props:{
      ...props,
      children
    }
  }
}

const textNodeElement = createTextNodeElement("app");
const App = createElement("div",{id:"app"},textNodeElement);
const dom = document.createElement(App.type);
dom.id = App.props.id;
document.querySelector("#root").append(dom);
const textNode = document.createTextNode("");
textNode.nodeValue = textNodeElement.props.nodeValue;
dom.append(textNode);

console.log(JSON.stringify(App))
console.log(document.querySelector("#root")) */

/**###################################### 第四阶段 ################################### */

/**
 * 
  {
    "type": "div",
      "props": {
      "id": "app",
        "children": [
          {
            "type": "TEXT_ELEMENT",
            "props": {
              "nodeValue": "app",
              "children": []
            }
          }
        ]
    }
  }
 * 
 */

const createTextNodeElement = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

const createElement = (type, props, ...children) => {
  return {
    type: type,
    props: {
      ...props,
      children
    }
  }
}

const textNodeElement = createTextNodeElement("app");
const App = createElement("div", { id: "app" }, textNodeElement);

function render(el, container) {
  const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type);
  Object.keys(el.props).forEach((key) => {
    if(key !== "children"){
      dom[key] = el.props[key];
    }
  })
  // 如果存在子节点，递归
  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  })
  container.append(dom);
  console.log(el,container)
}
render(App,document.querySelector("#root"));