#!/bin/bash

# This will be run on Travis in the before_install step.

injectors_dir="$(dirname "$0")"

# Ruby gems
if [ -e Gemfile ]; then
  echo "pass-the-fork: patched Gemfile to use inject.gem.* env vars."
  cat "$injectors_dir/Gemfile.append.rb" >> Gemfile
fi
