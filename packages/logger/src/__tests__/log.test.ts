import { describe, expect, it, jest } from "@jest/globals";
import { log } from "..";

jest.spyOn(global.console, "log");

describe("@stashbase/logger", () => {
  it("prints a message", () => {
    log("hello");
    expect(console.log).toHaveBeenCalled();
  });
});
