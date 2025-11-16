# frozen_string_literal: true

require "bundler/gem_tasks"

# Override the default build task to use our npm build process
Rake::Task["build"].clear
task :build do
  sh "npm run build:gem"
end

# The release task from bundler/gem_tasks will now use our custom build

