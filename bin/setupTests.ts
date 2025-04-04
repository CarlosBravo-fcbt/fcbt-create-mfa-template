import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// jest.mock("redux-micro-frontend", () => ({
//   GlobalStore: {
//     Get: jest.fn(),
//   },
// }));

// jest.mock("@ag-grid-community/styles/ag-grid.css", () => ({}));
// jest.mock("@ag-grid-community/styles/ag-theme-quartz.css", () => ({}));
// jest.mock("@ag-grid-community/styles/ag-theme-balham.css", () => ({}));

// global.console = {
//   log: jest.fn(),
//   warn: jest.fn(),
//   info: jest.fn(),
//   error: jest.fn(),
//   debug: jest.fn(),
// } as any;

Object.assign(global, { TextDecoder, TextEncoder });
