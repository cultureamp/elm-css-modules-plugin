import { transformSync, PluginObj } from "@babel/core"
import * as path from "path"
import * as fs from "fs"

import plugin, { PluginOptions } from "../src"

const EXAMPLE_TAGGER_NAME = "author$project$CssModules$css"

const fixture = (filename: string) =>
  fs.readFileSync(path.join(__dirname, "fixtures", filename)).toString()

const transformWith = (plugin: ({}) => PluginObj, options?: PluginOptions) => (
  input: string
) => transformSync(input, { plugins: [[plugin, options]] }).code

describe("elm-css-modules-plugin", () => {
  const transform = transformWith(plugin, { taggerName: EXAMPLE_TAGGER_NAME })

  it("transforms simple input to the expected output", () => {
    const input = fixture("simple-input.js")
    const expectedOutput = fixture("simple-output.js")
    expect(transform(input)).toBe(expectedOutput)
  })

  it("transforms kebab-cased classnames according to snapshot", () => {
    const input = fixture("kebab.js")
    expect(transform(input)).toMatchSnapshot()
  })

  it("transforms Elm 0.18 modules according to snapshot", () => {
    const input = fixture("elm-0.18.js")
    expect(transform(input)).toMatchSnapshot()
  })

  it("transforms example webpack output according to snapshot", () => {
    const input = fixture("example.js")
    expect(transform(input)).toMatchSnapshot()
  })

  it("throws if a classname node contains an empty string", () => {
    const input = fixture("old-api.js")
    expect(() => transform(input)).toThrowError()
  })

  it("locates and transforms modules by tagger name according to snapshot", () => {
    const alternateTaggerName = "someone$elsewhere$BizarroCssModules$bcss"
    const alternateTransform = transformWith(plugin, {
      taggerName: alternateTaggerName
    })
    const input = fixture("alternate-tagger.js")
    expect(alternateTransform(input)).toMatchSnapshot()
  })
})
