/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {connect} from "react-redux";

const React = require("react");
const { Component, createFactory } = React;
const PropTypes = require("prop-types");
const dom = require("react-dom-factories");
const { MODE } = require("../../reps/constants");
const ObjectInspector = createFactory(require("../../index").ObjectInspector);
const { Rep } = require("../../reps/rep");
const { bindActionCreators } = require("redux");
import actions from "../actions";

class Result extends Component {
  static get propTypes() {
    return {
      expression: PropTypes.object.isRequired,
      showResultPacket: PropTypes.func.isRequired,
      hideResultPacket: PropTypes.func.isRequired,
      createObjectClient: PropTypes.func.isRequired,
      releaseActor: PropTypes.func.isRequired,
      getLongStringFullText: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.copyPacketToClipboard = this.copyPacketToClipboard.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.renderRepInAllModes = this.renderRepInAllModes.bind(this);
    this.renderRep = this.renderRep.bind(this);
    this.renderPacket = this.renderPacket.bind(this);
  }

  copyPacketToClipboard(e, packet) {
    e.stopPropagation();

    let textField = document.createElement("textarea");
    textField.innerHTML = JSON.stringify(packet, null, "  ");
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  onHeaderClick() {
    const {expression} = this.props;
    if (expression.showPacket === true) {
      this.props.hideResultPacket();
    } else {
      this.props.showResultPacket();
    }
  }

  renderRepInAllModes({ object }) {
    return Object.keys(MODE).map(modeKey =>
       this.renderRep({ object, modeKey })
     );
  }

  renderRep({ object, modeKey }) {
    const {
      createObjectClient,
      releaseActor,
      getLongStringFullText,
    } = this.props;
    const path = object.actor;

    return dom.div(
      {
        className: `rep-element`,
        key: `${path}${modeKey}`,
        "data-mode": modeKey
      },
      ObjectInspector({
        roots: [{
          path,
          contents: {
            value: object
          }
        }],
        autoExpandDepth: 0,
        createObjectClient,
        releaseActor,
        getLongStringFullText,
        mode: MODE[modeKey],
        onInspectIconClick: nodeFront => console.log("inspectIcon click", nodeFront),
        onViewSourceInDebugger: location =>
          console.log("onViewSourceInDebugger", {location}),
      })
    );
  }

  renderPacket(expression) {
    let {packet, showPacket} = expression;
    let headerClassName = showPacket ? "packet-expanded" : "packet-collapsed";
    let headerLabel = showPacket ? "Hide expression packet" : "Show expression packet";

    return dom.div({ className: "packet" },
      dom.header({
        className: headerClassName,
        onClick: this.onHeaderClick,
      },
        headerLabel,
        showPacket && dom.button({
          className: "copy-packet-button",
          onClick: (e) => this.copyPacketToClipboard(e, packet)
        }, "Copy as JSON")
      ),
      showPacket &&
      dom.div({className: "packet-rep"}, Rep({object: packet}))
    );
  }

  render() {
    let {expression} = this.props;
    let {input, packet} = expression;
    return dom.div(
      { className: "rep-row" },
      dom.div({ className: "rep-input" }, input),
      dom.div({ className: "reps" }, this.renderRepInAllModes({
        object: packet.exception || packet.result
      })),
      this.renderPacket(expression)
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getLongStringFullText: actions.getLongStringFullText
  }, dispatch);
}

module.exports = connect(null, mapDispatchToProps)(Result);
