// @flow
import React, { Component } from "react";
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
  fullValue?: any,
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
      fullValue,
    } = this.props;

    if (expanded) {
      repProps.member = {
        open: true
      };
      repProps.object.fullText = fullValue;
    } else {
      delete repProps.object.fullText;
      delete repProps.member;
    }

    const onClick = expandable
      ? () => expanded ? onCollapse() : onExpand()
      : undefined;

    return span({
      onClick,
    }, Rep(repProps));
  }
}

export default Cutoff;
