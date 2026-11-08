import { describe, expect, it } from "vitest";
import { leerMesa } from "./mesa";

describe("leerMesa", () => {
  it.each([
    ["?mesa=4", 4],
    ["", null],
    ["?mesa=abc", null],
    ["?mesa=-1", null],
    ["?mesa=0", null],
    ["?mesa=4.5", null],
    ["?otro=1", null],
  ])("interpreta %s como %s", (search, expected) => {
    expect(leerMesa(search)).toBe(expected);
  });
});
