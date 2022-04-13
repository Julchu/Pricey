import { DOMAttributes, CSSProperties } from 'react';

export type IconProps = {
  color?: string;
  rotated?: boolean;
  completed?: boolean;
  style?: CSSProperties;
  size?: number;
} & DOMAttributes<SVGSVGElement>;
