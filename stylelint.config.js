module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    "rule-empty-line-before": ["always", { ignore: ["inside-block"], except: ["after-single-line-comment"] }]
  }
}
