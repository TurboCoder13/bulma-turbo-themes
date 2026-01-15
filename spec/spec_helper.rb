# frozen_string_literal: true

# SimpleCov must be started before any application code is loaded
require "simplecov"

# Get the repo root directory
REPO_ROOT = File.expand_path("..", __dir__)

SimpleCov.start do
  # Use absolute path for coverage directory
  coverage_dir File.join(REPO_ROOT, "rspec-coverage")

  add_filter "/spec/"
  add_filter "/vendor/"

  # Use absolute paths for grouping
  add_group "Lib", File.join(REPO_ROOT, "lib")

  # Track turbo-themes lib files
  track_files File.join(REPO_ROOT, "lib/**/*.rb")

  # Enable branch coverage
  enable_coverage :branch

  # Minimum coverage threshold
  # The gem is minimal: turbo-themes.rb (module definition) and version.rb (VERSION constant)
  # SimpleCov shows 40% because version.rb lines appear uncovered despite being executed
  minimum_coverage 40
end

# Load the gem
require_relative "../lib/turbo-themes"

# Load Jekyll for plugin testing
require "jekyll"
require "fileutils"
require "tmpdir"

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = ".rspec_status"

  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!

  # Run specs in random order
  config.order = :random
  Kernel.srand config.seed

  # Use expect syntax
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  # Shared context for Jekyll plugin testing
  config.shared_context_metadata_behavior = :apply_to_host_groups
end

# Helper module for creating temporary Jekyll site structures
module JekyllTestHelpers
  def create_temp_site
    @temp_dir = Dir.mktmpdir("turbo-themes-test")
    # The plugin expects source to be at apps/site/ so project_root = File.expand_path("../..", source) works
    @source_dir = File.join(@temp_dir, "apps", "site")
    @dest_dir = File.join(@temp_dir, "_site")
    FileUtils.mkdir_p(@source_dir)
    FileUtils.mkdir_p(@dest_dir)
    { source: @source_dir, dest: @dest_dir }
  end

  # Get the project root from the temp site (mirrors plugin's project_root calculation)
  def project_root
    File.expand_path("../..", @source_dir)
  end

  def cleanup_temp_site
    FileUtils.rm_rf(@temp_dir) if @temp_dir && Dir.exist?(@temp_dir)
  end

  def create_mock_site(source:, dest:)
    site = double("Jekyll::Site")
    allow(site).to receive(:source).and_return(source)
    allow(site).to receive(:dest).and_return(dest)
    site
  end

  def create_directory_with_files(base_path, files)
    FileUtils.mkdir_p(base_path)
    files.each do |file_path, content|
      full_path = File.join(base_path, file_path)
      FileUtils.mkdir_p(File.dirname(full_path))
      File.write(full_path, content)
    end
  end
end

RSpec.configure do |config|
  config.include JekyllTestHelpers
end
