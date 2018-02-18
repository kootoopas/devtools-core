/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const stubs = new Map();
stubs.set("Symbol", {
  type: "symbol",
  actor: "server1.conn1.child1/symbol1",
  name: "foo"
});

stubs.set("SymbolWithoutIdentifier", {
  type: "symbol",
  actor: "server1.conn1.child1/symbol2",
});

const fullText = "blah".repeat(10000);
const initialText = fullText.substring(0, 10000);

stubs.set("SymbolWithLongStringIdentifier", {
  type: "symbol",
  actor: "server1.conn1.child1/symbol2",
  name: {
    "type": "longString",
    "initial": initialText,
    "fullText": fullText,
    "length": fullText.length,
    "actor": "server1.conn1.child1/longString58"
  }
});

module.exports = stubs;
