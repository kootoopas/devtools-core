/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const { createElement, createFactory } = require("react");
const { Provider } = require("react-redux");
const { applyMiddleware, createStore } = require("redux");
const {thunk} = require("../shared/redux/middleware/thunk");
const ObjectInspector = createFactory(require("./ObjectInspector"));
const createReducer = require("./reducer");

import type {
  Props,
  State,
} from "./types";

function createInitialState(overrides : Object) : State {
  return Object.assign({
    actors: new Set(),
    expandedPaths: new Set(),
    focusedItem: null,
    loadedProperties: new Map(),
    loading: new Map(),
  }, overrides);
}

module.exports = (
  props : Props,
  initialState : State = createInitialState({focusedItem: props.focusedItem}),
  statePersister?: Function
) => {
  const middlewares = [thunk()];
  if (statePersister && typeof statePersister === "function") {
    middlewares.push(statePersister);
  }

  const store = createStore(
    createReducer(initialState),
    applyMiddleware(...middlewares)
  );

  return createElement(
    Provider,
    {store},
    ObjectInspector(props)
  );
};
