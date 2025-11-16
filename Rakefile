# frozen_string_literal: true

require "bundler/gem_tasks"

# Default task: show available tasks
task default: :list

desc "List all available tasks"
task :list do
  sh "rake -T"
end

# Build tasks for hybrid npm/Ruby project
namespace :build do
  desc "Build npm package (TypeScript -> JavaScript)"
  task :npm do
    sh "npm run build"
  end

  desc "Build Ruby gem (includes npm build)"
  task :gem do
    sh "npm run build:gem"
  end
end

# Override bundler's build task to use our npm-based build
# This allows `rake release` to work with our hybrid project
task build: "build:gem"

# Clean task
desc "Remove built artifacts"
task :clean do
  sh "rm -f *.gem"
  sh "rm -rf dist/"
  sh "rm -rf _site/"
end

# Verification tasks
namespace :verify do
  desc "Verify gem can be built"
  task :gem do
    sh "npm run build:gem"
    gem_file = Dir["*.gem"].first
    if gem_file && File.exist?(gem_file)
      puts "✅ Gem built successfully: #{gem_file}"
    else
      abort "❌ Gem build failed"
    end
  end

  desc "Verify all checks pass"
  task all: [:gem] do
    sh "npm run lint"
    sh "npm test"
  end
end

# Development helper
desc "Open interactive Ruby console with gem loaded"
task :console do
  require "irb"
  require "bundler/setup"
  require_relative "lib/bulma-turbo-themes"
  ARGV.clear
  IRB.start
end

