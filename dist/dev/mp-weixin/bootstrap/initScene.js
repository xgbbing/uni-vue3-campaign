"use strict";
const managers_SceneManager = require("../managers/SceneManager.js");
const managers_scenes = require("../managers/scenes.js");
const managers_sceneFlow = require("../managers/sceneFlow.js");
const managers_PageManager = require("../managers/PageManager.js");
const config_scene_config = require("../config/scene.config.js");
function initScene() {
  managers_scenes.scenes.forEach((scene) => {
    managers_SceneManager.sceneManager.register(scene);
  });
  managers_SceneManager.sceneManager.start(managers_sceneFlow.sceneFlow);
  managers_PageManager.pageManager.register(config_scene_config.SceneConfig);
}
exports.initScene = initScene;
//# sourceMappingURL=../../.sourcemap/mp-weixin/bootstrap/initScene.js.map
