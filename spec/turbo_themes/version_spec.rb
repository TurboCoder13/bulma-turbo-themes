# frozen_string_literal: true

RSpec.describe "TurboThemes::VERSION" do
  let(:gemspec_path) { File.expand_path("../../turbo-themes.gemspec", __dir__) }
  let(:gemspec_content) { File.read(gemspec_path) }

  it "exists and is not nil" do
    expect(TurboThemes::VERSION).not_to be_nil
  end

  it "is not empty" do
    expect(TurboThemes::VERSION).not_to be_empty
  end

  it "matches the version in gemspec" do
    # The gemspec uses require_relative to load version, so they should match
    # This test ensures consistency between lib/turbo-themes/version.rb and the gem
    expect(gemspec_content).to include("spec.version = TurboThemes::VERSION")
  end

  it "has major version >= 0" do
    major = TurboThemes::VERSION.split(".").first.to_i
    expect(major).to be >= 0
  end

  it "has three version components" do
    components = TurboThemes::VERSION.split(".")
    expect(components.length).to be >= 3
  end
end
