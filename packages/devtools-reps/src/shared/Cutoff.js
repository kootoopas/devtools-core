/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
import { Component } from "react";
import type {LoadedProperties} from "../object-inspector/types";
const dom = require("react-dom-factories");
const { span } = dom;
const {
  REPS: {
    Rep
  },
} = require("../reps/rep");

type Props = {
  repProps: object,
  expandable: boolean,
  expanded: boolean,
  loading: boolean,
  onExpand?: () => void,
  onCollapse?: () => void,
  onFocus?: () => void,
  loadedProperties?: LoadedProperties,
};

class Cutoff extends Component {
  constructor(props: Props) {
    super();
  }

  render() {
    const {
      expanded,
      expandable,
      onExpand,
      onCollapse,
      repProps,
    } = this.props;

    const onClick = expandable
      ? () => expanded ? onCollapse() : onExpand()
      : undefined;

    let fullText;
    let member;
    if (expanded) {
      member = {
        open: true
      };
      fullText = this.props.loadedProperties.fullText;
    }

    const props = Object.assign({}, repProps, {
      member,
      object: Object.assign({}, repProps.object, { fullText })
    });

    return span({
      onClick,
    }, Rep(props));
  }
}

export default Cutoff;
