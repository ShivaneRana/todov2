import {
  highListPickedList,
  renderProjectInputDialog,
  renderProjectList,
  renderTodo,
} from "./dom.js";
import { localStorageProject } from "./storage.js";
import { highLightOnClick } from "./uilogic.js";

export const projectLogic = (function () {
  let projectList = {
    All: {},
    Completed: {},
  };

  const setList = function () {
    console.log("ProjectList was set");
    let retrivedList = localStorageProject.retrieveProjectList();
    projectList = { ...projectList, ...retrivedList };
  };

  const getList = function () {
    console.log("projectList was called");
    return projectList;
  };

  const removeFromList = function (key) {
    delete projectList[key];
    console.log(`${key} has been removed`);
    localStorageProject.storeProjectList();
  };

  const checkInput = function (name) {
    if (
      name === "all" ||
      name === "ALL" ||
      name === "completed" ||
      name === "Completed"
    ) {
      renderProjectInputDialog.projectNotAdded(
        "This will break the program so dont bother writting it",
      );
      return false;
    } else if (!(name === "" || name === null || name === undefined)) {
      let exist = Object.keys(projectList).includes(name);
      if (exist !== true) {
        console.log("value added to projectList");
        return true;
      } else {
        renderProjectInputDialog.projectNotAdded(
          "Project with same name already exist!",
        );
        return false;
      }
    } else {
      renderProjectInputDialog.projectNotAdded("No project Name was provided!");
      return false;
    }
  };

  const addToList = function (name) {
    projectList[name] = {};
    localStorageProject.storeProjectList();
  };

  const renderList = function (container) {
    renderProjectList.clear(container);
    renderProjectList.render(projectList, container);
  };

  // if the value can be inserted into the project then true else false
  const addObjectToListItems = function (obj) {
    if (obj.title in projectList[obj.target]) {
      renderProjectInputDialog.projectNotAdded(
        "Todo with similar name already exist",
      );
      return false;
    } else {
      projectList[obj.target][obj.title] = obj;
      localStorageProject.storeProjectList();
      return true;
    }
  };

  // display the content of the list
  const displayProjectListItems = function (name) {
    highLightOnClick(name);
    const list = projectList[name];
    renderTodo.render(list);
    console.log(`${name} was rendered`);
  };

  const finale = function (container, projectName) {
    if (checkInput(projectName)) {
      addToList(projectName);
      renderList(container);
      return true;
    }
    return false;
  };

  return {
    finale,
    removeFromList,
    renderList,
    getList,
    setList,
    addObjectToListItems,
    displayProjectListItems,
  };
})();

// this logic is shared amound all the todo container like all,completed,today
// also all the new created projects
export const universalLogic = (function () {
  // this is used on all the todos
  const todoFormat = function (title, description, date, priority, target) {
    return {
      title: title,
      description: description,
      date: date,
      priority: priority,
      target: target,
      initialTitle: title,
      completed: false,
      initialTarget: target,
    };
  };

  const notesFormat = function (title, description) {
    return {
      title: title,
      description: description,
      initialTitle: title,
    };
  };

  return { todoFormat, notesFormat };
})();
