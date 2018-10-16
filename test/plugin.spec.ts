import { transformSync, PluginObj } from "@babel/core"
import * as path from "path"
import * as fs from "fs"

import * as plugin from "../src"

const EXAMPLE_TAGGER_NAME = "author$project$CssModules$css"

const fixture = (filename: string) =>
  fs.readFileSync(path.join(__dirname, "fixtures", filename)).toString()

const transformWith = (plugin: PluginObj) => (input: string) =>
  transformSync(input, { plugins: [plugin] }).code

describe("elm-css-modules-plugin", () => {
  const transform = transformWith(
    plugin.withOptions({ taggerName: EXAMPLE_TAGGER_NAME })
  )

  it("transforms simple input to the expected output", () => {
    const input = fixture("input.js")
    const expectedOutput = fixture("output.js")
    expect(transform(input)).toBe(expectedOutput)
  })

  it("transforms example webpack output according to snapshot", () => {
    const input = fixture("example.js")
    expect(transform(input)).toMatchSnapshot()
  })

  it("throws if a classname node contains an empty string", () => {
    const input = fixture("old-api.js")
    expect(() => transform(input)).toThrowError()
  })
})
