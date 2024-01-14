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

const React = {
  render,
  createElement
}

export default React;