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
let taskId = 1;
function workLoop(deadLine){
  taskId++;
  let shouldYield = false;
  while(!shouldYield){
    // run task  每个任务执行的次数和时间不一样
    console.log(`taskId: ${taskId}`,`剩余时间：${deadLine.timeRemaining()}`);
    shouldYield = deadLine.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);