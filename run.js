#!/usr/bin/env node

var yaml = require('js-yaml');
var fs = require('fs');
var triggerTravis = require('trigger-travis');

var args = process.argv.slice(2);
var yamlFilename = args[0];
var patches = yaml.safeLoad(fs.readFileSync(yamlFilename, 'utf8'), {filename: yamlFilename});

var travisToken = process.env.TRAVIS_API_TOKEN;

function travisConfigForTarget(targetNickname) {
    var injectGems = {};
    // TODO: Walk depends_on transitive closure
    for (let patchNickname of (patches[targetNickname].depends_on || [])) {
        var patch = patches[patchNickname];
        if (patch.gem !== undefined) {
            injectGems[patch.gem] = {git: `https://github.com/${patch.github}`, branch: patch.branch};
        }
    }

    return {
        "merge_mode": "deep_merge",
        "cache": false,
        "before_install": [
            // Setting env vars by export command rather than `env:` is an attempt to avoid issues
            // with depending on how exactly `env:` was declared in original .travis.yml
            // https://github.com/travis-ci/docs-travis-ci-com/issues/1485
            `export INJECT_GEMS='${JSON.stringify(injectGems)}'`,
            "git clone https://github.com/patch-graph/gitjection",
            "gitjection/injectors/inject-all.sh"
        ]
    };
}

for (var nickname in patches) {
    var patch = patches[nickname];
    var config = travisConfigForTarget(nickname);
    console.log('---');
    console.log(`# For ${patch.github}`);
    if (patch.test !== false) {
        console.log('# test: false, skipping.');
        continue;
    }
    if ((patch.depends_on || []) == []) {
        console.log('# No dependencies, skipping (normal Travis build should work). Set test: true to force.');
        continue;
    }

    console.log(yaml.safeDump(config));
    if (travisToken === undefined) {
        console.error('TRAVIS_API_TOKEN env var not set, not executing');
    } else {
        var [owner, repo] = patch.github.split('/');
        triggerTravis.pull({
            token: travisToken,
            owner: owner,
            repo: repo,
            branch: patch.branch || 'master',
            config: config,
            debug: false
        });
    }
}
