source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "webrick", "~> 1.9"

# Local gem for development and E2E tests
gem "turbo-themes", path: "."

# Useful during development
group :development do
  gem "html-proofer", "~> 5.0"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end

# Testing
group :development, :test do
  gem "rspec", "~> 3.13"
  gem "simplecov", "~> 0.22"
  gem "simplecov-html", "~> 0.13"
end
