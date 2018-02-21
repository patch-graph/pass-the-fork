#!/usr/bin/env node

var yaml = require('js-yaml');
var fs = require('fs');

var args = process.argv.slice(2);
var yamlFilename = args[0];
var patches = yaml.safeLoad(fs.readFileSync(yamlFilename, 'utf8'), {filename: yamlFilename});

function travisConfigForTarget(targetNickname) {
    var injectGems = {};
    // TODO: Walk depends_on transitive closure
    for (let patchNickname of (patches[targetNickname].depends_on || [])) {
        var patch = patches[patchNickname];
        if (patch.gem !== undefined) {
            injectGems[patch.gem] = {git: `https://github.com/${patch.github}`, branch: patch.branch};
        }
    }

    return yaml.safeDump({
        "merge_mode": "deep_merge",
        "before_install": [
            `export INJECT_GEMS='${JSON.stringify(injectGems)}'`,
            "git clone https://github.com/patch-graph/gitjection",
            "gitjection/injectors/inject-all.sh"
        ]
    });
}

for (var nickname in patches) {
    var patch = patches[nickname];
    console.log('---');
    console.log(`# For ${nickname}`);
    if (patch.test !== false) {
        console.log(travisConfigForTarget(nickname));
    }
}
