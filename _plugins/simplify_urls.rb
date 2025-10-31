# Jekyll plugin to create simplified report URLs
# After Jekyll builds, this creates simplified directory names for cleaner URLs

Jekyll::Hooks.register :site, :post_write do |site|
  # Create simplified paths for reports
  if Dir.exist?("_site/playwright-report")
    FileUtils.rm_rf("_site/playwright") if Dir.exist?("_site/playwright")
    FileUtils.cp_r("_site/playwright-report", "_site/playwright")
  end
  
  if Dir.exist?("_site/lighthouse-reports")
    FileUtils.rm_rf("_site/lighthouse") if Dir.exist?("_site/lighthouse")
    FileUtils.cp_r("_site/lighthouse-reports", "_site/lighthouse")
  end
  
  if Dir.exist?("_site/coverage")
    # Coverage already has the right name, but ensure it's there
    Jekyll.logger.info "Simplified report URLs created: /playwright/, /lighthouse/, /coverage/"
  end
end

