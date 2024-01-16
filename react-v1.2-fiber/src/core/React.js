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
      children: children.map((child) => {
        return typeof child === "string" ? createTextNodeElement(child) : child
      })
    }
  }
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props:{
      children:[el]
    }
  }
  // const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type);
  // Object.keys(el.props).forEach((key) => {
  //   if(key !== "children"){
  //     dom[key] = el.props[key];
  //   }
  // })
  // // 如果存在子节点，递归
  // const children = el.props.children;
  // children.forEach((child) => {
  //   render(child, dom);
  // })
  // container.append(dom);
  // console.log(el,container)
}


/**
 * requestIdleCallback方法
 * 不希望因为一些不重要的任务（如统计上报）导致用户感觉到卡顿的话，就应该考虑使用requestIdleCallback。
 * 因为requestIdleCallback回调的执行的前提条件是当前浏览器处于空闲状态。
 * 
 * 思考：
 * 1. dom是一个树结构的，该如何分配不同的Task
 * 2. dom分配到不同的Task之后该如何渲染
 * @param {*} deadLine 
 */
let nextWorkOfUnit = null;
function workLoop(deadLine){
  let shouldYield = false;
  while(!shouldYield && nextWorkOfUnit){
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    // run task  每个任务执行的次数和时间不一样
    shouldYield = deadLine.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

function performWorkOfUnit(work){
  /**
   * 1. 创建dom
   * 2. 处理props
   * 3. 转换链表，设置指针
   * 4. 返回下一个要执行的指针
   */
  // 1
  if(!work.dom){
    const dom = (work.dom = work.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(work.type));
    work.parent.dom.append(dom);   //需要将当前的dom添加到父级容器中
    // 2
    Object.keys(work.props).forEach((key) => {
      if(key !== "children"){
        dom[key] = work.props[key];
      }
    })
  }
  // 3
  /**
   *  0            a
   *  1        b       c
   *  2   d    e     f     g   
   * 
   * 关键点：每次只构建当前节点和它的孩子节点之间关系
   * 首先从a开始，处理a所有的child，建立其指针的指向，a => child : b => sibling: c ,
   * 然后返回child ： b
   * 再处理b的child，类似处理a的child的过程。
   * 
   * 首先遍历所有的孩子节点child, 第一个节点需要绑定到当前节点的child上，
   * index = 0, 直接绑定
   * index = 0 => a
   * index = 1 => c, 此时绑定sibling的时候需要知道b，所以需要记录一下上一个child
   * 
   * 每次结束之后 prevChild = child;
   * 
   * 代码解读：
   * 这里的work其实就相当于这里的a的结构，就是一个VDom对象
   * const children = work.props.children;   相当于 获取到a的所有children节点
   * 循环遍历的是当前work的所有子节点
   * let prevChild = null;
   *children.forEach((child,index) => {
      const newWork = {             每次循环重新创建一个VDom结构，注意里面的属性
        type:child.type,
        props:child.props,
        child:null,
        parent:work,
        sibling:null,
        dom:null
      }
      if(index === 0){              当前的 b节点
        work.child = child;         将b节点直接赋值给a的child，
      }else{                        index等于1的时候，相当于遍历到了c这里，c是b的兄弟节点，所以直接赋值给b的 sibling
        prevChild.sibling = child;
      }
      prevChild = child;            每次执行完之后，在循环的最后需要记录上一个节点，比如index = 0的时候，将b节点直接赋值给a的child，然后需要记录b,就是这一步
    })
   */
  const children = work.props.children;
  let prevChild = null;
  children.forEach((child,index) => {
    const newWork = {
      type:child.type,
      props:child.props,
      child:null,
      parent: work,
      sibling:null,
      dom:null
    }
    if(index === 0){
      work.child = newWork;
    }else{
      prevChild.sibling = newWork;
    }
    prevChild = newWork;
  })

  // 4
  if(work.child){
    return work.child;
  }
  if(work.sibling){
    return work.sibling;
  }
  return work.parent?.sibling
}
requestIdleCallback(workLoop);

const React = {
  render,
  createElement
}
export default React;