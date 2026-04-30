const React = require('react');
const { View } = require('react-native');

function createMock(displayName) {
  const Component = ({ children, ...props }) =>
    React.createElement(View, { testID: displayName, ...props }, children);
  Component.displayName = displayName;
  return Component;
}

const Svg = createMock('Svg');

module.exports = {
  __esModule: true,
  default: Svg,
  Svg,
  Circle: createMock('Circle'),
  Ellipse: createMock('Ellipse'),
  G: createMock('G'),
  Text: createMock('Text'),
  TSpan: createMock('TSpan'),
  TextPath: createMock('TextPath'),
  Path: createMock('Path'),
  Polygon: createMock('Polygon'),
  Polyline: createMock('Polyline'),
  Line: createMock('Line'),
  Rect: createMock('Rect'),
  Use: createMock('Use'),
  Image: createMock('Image'),
  Symbol: createMock('Symbol'),
  Defs: createMock('Defs'),
  LinearGradient: createMock('LinearGradient'),
  RadialGradient: createMock('RadialGradient'),
  Stop: createMock('Stop'),
  ClipPath: createMock('ClipPath'),
  Pattern: createMock('Pattern'),
  Mask: createMock('Mask'),
  ForeignObject: createMock('ForeignObject'),
  Marker: createMock('Marker'),
};
