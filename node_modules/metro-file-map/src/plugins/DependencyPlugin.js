"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
class DependencyPlugin {
  name = "dependencies";
  #dependencyExtractor;
  #computeDependencies;
  #getDependencies;
  #rootDir;
  constructor(options) {
    this.#dependencyExtractor = options.dependencyExtractor;
    this.#computeDependencies = options.computeDependencies;
    this.#rootDir = options.rootDir;
  }
  async initialize(initOptions) {
    const { files } = initOptions;
    this.#getDependencies = (mixedPath) => {
      const result = files.lookup(mixedPath);
      if (result.exists && result.type === "f") {
        return result.pluginData ?? [];
      }
      return null;
    };
  }
  getSerializableSnapshot() {
    return null;
  }
  bulkUpdate(delta) {}
  onNewOrModifiedFile(relativeFilePath, pluginData) {}
  onRemovedFile(relativeFilePath, pluginData) {}
  assertValid() {}
  getCacheKey() {
    if (this.#dependencyExtractor != null) {
      const extractor = require(this.#dependencyExtractor);
      return JSON.stringify({
        extractorKey: extractor.getCacheKey?.() ?? null,
        extractorPath: this.#dependencyExtractor,
      });
    }
    return "default-dependency-extractor";
  }
  getWorker() {
    const excludedExtensions = require("../workerExclusionList");
    return {
      worker: {
        modulePath: require.resolve("./dependencies/worker.js"),
        setupArgs: {
          dependencyExtractor: this.#dependencyExtractor ?? null,
        },
      },
      filter: ({ normalPath, isNodeModules }) => {
        if (!this.#computeDependencies) {
          return false;
        }
        if (isNodeModules) {
          return false;
        }
        const ext = normalPath.substr(normalPath.lastIndexOf("."));
        return !excludedExtensions.has(ext);
      },
    };
  }
  getDependencies(mixedPath) {
    if (this.#getDependencies == null) {
      throw new Error(
        "DependencyPlugin has not been initialized before getDependencies",
      );
    }
    return this.#getDependencies(mixedPath);
  }
}
exports.default = DependencyPlugin;
