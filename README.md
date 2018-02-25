# gitjection — inject forked dependencies into CI builds

When making changes to several related repositories, by default CI tests each against unmodified dependencies.  This tool will allow explicitly requesting a testing against modified dependencies.

Currently working on injecting Ruby gems into Travis builds, for GitHub pull requests.  I'd love to expand each of these (details below).

## Use cases

Imagine repository X is a library on which repository Y depends.

1. Compatibility: `@you` forked X, sent pull request `X#1`, wonder if it'll break Y.
   By default Y tests weren't even run.
   Want to run B tests against `you/X` fork at `your-x-branch-1`.

2. Dependent PRs: you forked both, sent pull requests `X#2` which adds new api, `Y#2` which uses it.
   By default, `Y#2` is tested against `X@master` and obviously fails.
   Want to run `you/Y@your-y-branch-2` fork tests against `you/X@your-x-branch-2` fork.

3. ...

[TODO: flesh this out, add diagram, include merge order considerations...]

## Functionality (nothing working yet, but this shows what I'm starting from)

The long-term goal is to help test/coordinate/present related changes accross all kinds of free / open source software,
that were not necessarily aware of each other.

- [ ] translate PR urls to specific git url & branch (or commit).
    - [ ] WIP GitHub pull request url
    - [ ] GitLab pull request url
    - [ ] other hosts...
    - [ ] any hg/bzr/svn/etc branch?
    - [ ] patch in mailing list / issue trackers?

- [x] WIP script to override one or more dependencies
    - [x] WIP Ruby gems
    - [ ] Javascript npm packages
    - [ ] ...

    far off future: would love to do not only source package managers but also:
    - [ ] git submodules
    - [ ] vendored code
    - [ ] docker images
    - [ ] build-time shell install commands like `apt`/`rpm`, tarballs, ...
    - [ ] run-time fetching dependencies (eg. javascript from CDNs)

- [x] WIP CLI to trigger CI run with above overriding script
    - [x] WIP on Travis via https://docs.travis-ci.com/user/triggering-builds API (using [trigger-travis](https://github.com/ishmael-readingplus/trigger-travis))
    - [ ] ...

- [ ] Report build status back on pull request.
    - [ ] [GitHub status API](https://developer.github.com/v3/repos/statuses/) apparently requires repo write permissions :-(
    - [ ] badge image?
    - [ ] make textual comment on PR?
        - on update, remove previous comment (like miq_bot does for linter comments)

- [ ] A way to re-run on PR changes.  (For starters, just re-run the CLI)

- [ ] A bot that does the above?
    For now I'd like to get as far as possible without bots, only CLI anybody can run...

- [ ] Record versions actually used in a build? (feels a good idea, but what's the use case? possibly belongs in separate project.)

## Prior art

- [Trigger a Travis CI build from another project’s build](https://hiddentao.com/archives/2016/08/29/triggering-travis-ci-build-from-another-projects-build/), Ramesh Nair, https://github.com/waigo/waigo/blob/master/scripts/triggerDocSiteBuild.js
- https://stackoverflow.com/a/34273424/239657, Michael Ernst, https://github.com/mernst/plume-lib/blob/master/bin/trigger-travis.sh
- https://github.com/stephanmg/travis-dependent-builds, Stephan Grein
- [http://eng.rightscale.com/2015/04/27/dependent-builds-in-travis.html](Dependent builds in Travis), Sean McGivern — obsolete, was restarting builds before trigger new build was possible.
- [Improving hosted continuous integration services](https://publishup.uni-potsdam.de/frontdoor/index/index/docId/9425), Christopher Weyand, Jonas Chromik, Lennard Wolf, Steffen Kötte, Konstantin Haase, Tim Felgentreff, Jens Lincke, Robert Hirschfeld
