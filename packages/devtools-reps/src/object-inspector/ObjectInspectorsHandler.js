/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const ObjectInspectorCreator = require("./ObjectInspectorCreator");

import type {
  Props,
  ObjectInspectorId,
  PersistedStates,
} from "./types";

const persistedStates : PersistedStates = new Map();

function createStatePersister(id: any) {
  return store => next => action => {
    let result = next(action);
    let state = store.getState();
    persistedStates.set(id, state);
    return result;
  };
}

const ObjectInspectorHandler = {
  create: (id: ObjectInspectorId, props: Props) => {
    if (!id) {
      throw Error("The ObjectInspector needs a unique `id` prop");
    }

    return ObjectInspectorCreator(
      props,
      persistedStates.get(id),
      createStatePersister(id)
    );
  },
  delete: (id: ObjectInspectorId) => {
    if (persistedStates.has(id)) {
      persistedStates.delete(id);
    } else {
      console.log("ObjectInspector", id, "was not found.");
    }
  },
  clear: () => {
    persistedStates.clear();
  }
};

module.exports = ObjectInspectorHandler;
