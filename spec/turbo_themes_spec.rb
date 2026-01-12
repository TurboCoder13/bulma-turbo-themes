# frozen_string_literal: true

RSpec.describe TurboThemes do
  describe "module" do
    it "is defined as a module" do
      expect(TurboThemes).to be_a(Module)
    end

    it "has a VERSION constant" do
      expect(TurboThemes).to have_constant(:VERSION)
    end
  end

  describe "VERSION" do
    it "is a string" do
      expect(TurboThemes::VERSION).to be_a(String)
    end

    it "follows semantic versioning format" do
      expect(TurboThemes::VERSION).to match(/\A\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?\z/)
    end

    it "is frozen" do
      expect(TurboThemes::VERSION).to be_frozen
    end
  end
end

# Custom matcher for constant existence
RSpec::Matchers.define :have_constant do |const|
  match do |owner|
    owner.const_defined?(const)
  end

  description do
    "have constant #{const}"
  end

  failure_message do |owner|
    "expected #{owner} to have constant #{const}"
  end
end
