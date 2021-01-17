import { Range } from './base.directive';

export interface TestData {
  screenSize: number,
  ifValue: Range | Range[],
  visibility: boolean,
}

export interface ErrorData {
  ifValue: any;
}

export interface ResizeData {
  screenSizeInitial: number;
  screenSizeNew: number;
  ifValue: Range | Range[];
  visibilityInitial: boolean;
  visibilityNew: boolean;
}

export const testCases: TestData[] = [
  {
    screenSize: 0,
    ifValue: [0, 300],
    visibility: true,
  },
  {
    screenSize: 500,
    ifValue: [0, 300],
    visibility: false,
  },
  {
    screenSize: 300,
    ifValue: [0, 300],
    visibility: false,
  },
  {
    screenSize: 299,
    ifValue: [0, 300],
    visibility: true,
  },
  {
    screenSize: 500,
    ifValue: [0, 'max'],
    visibility: true,
  },
  {
    screenSize: Number.MAX_VALUE,
    ifValue: [0, 'max'],
    visibility: true,
  },
  {
    screenSize: 400,
    ifValue: [[0, 400], [600, 800]],
    visibility: false,
  },
  {
    screenSize: 600,
    ifValue: [[0, 400], [600, 800]],
    visibility: true,
  },
  {
    screenSize: 500,
    ifValue: [[0, 400], [600, 800]],
    visibility: false,
  },
  {
    screenSize: 399,
    ifValue: [[0, 400], [600, 800]],
    visibility: true,
  },
  {
    screenSize: 1000,
    ifValue: [[600, 800], [0, 400]],
    visibility: false,
  },
  {
    screenSize: 700,
    ifValue: [[600, 800], [0, 400]],
    visibility: true,
  },
]

export const errorCases: ErrorData[] = [
  {
    ifValue: ['a', 300]
  },
  {
    ifValue: [0, '400']
  },
  {
    ifValue: ['max', 300],
  },
  {
    ifValue: [300, 0],
  },
  {
    ifValue: [],
  },
  {
    ifValue: 'hello',
  },
  {
    ifValue: [0, 400, 600],
  },
]

export const resizeCases: ResizeData[] = [
  {
    screenSizeInitial: 0,
    screenSizeNew: 1000,
    ifValue: [0, 500],
    visibilityInitial: true,
    visibilityNew: false,
  },
  {
    screenSizeInitial: 0,
    screenSizeNew: 499,
    ifValue: [0, 500],
    visibilityInitial: true,
    visibilityNew: true,
  },
  {
    screenSizeInitial: 700,
    screenSizeNew: 300,
    ifValue: [0, 500],
    visibilityInitial: false,
    visibilityNew: true,
  },
  {
    screenSizeInitial: 0,
    screenSizeNew: 1000,
    ifValue: [300, 700],
    visibilityInitial: false,
    visibilityNew: false,
  }
]