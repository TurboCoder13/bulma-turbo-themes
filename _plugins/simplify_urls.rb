# Jekyll plugin to create simplified report URLs
# After Jekyll builds, this creates simplified directory names for cleaner URLs

require 'fileutils'
require 'cgi'

Jekyll::Hooks.register :site, :post_write do |site|
  # reports collected for future diagnostics — retained intentionally
  # TODO: Use reports array for summary logging or diagnostics output
  reports = []
  dest = site.dest
  source = site.source

  # Process playwright reports
  begin
    pw_src = File.join(source, "playwright-report")
    pw_dst = File.join(dest, "playwright")
    if Dir.exist?(pw_src)
      FileUtils.rm_rf(pw_dst) if Dir.exist?(pw_dst)
      # Copy instead of symlink for static deploys (GitHub Pages, Netlify don't support symlinks)
      FileUtils.mkdir_p(pw_dst)
      FileUtils.cp_r(File.join(pw_src, "."), pw_dst)
      Jekyll.logger.info "Simplified URL created: /playwright/ (copy)"
      reports << "/playwright/"
    else
      # Create placeholder directory with index.html so the link doesn't break
      FileUtils.rm_rf(pw_dst) if Dir.exist?(pw_dst)
      FileUtils.mkdir_p(pw_dst)
      playwright_index = File.join(pw_dst, "index.html")
      File.open(playwright_index, "w") do |f|
        f.puts "<!DOCTYPE html>"
        f.puts "<html lang=\"en\">"
        f.puts "<head>"
        f.puts "  <meta charset=\"UTF-8\">"
        f.puts "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
        f.puts "  <title>Playwright E2E Test Reports</title>"
        f.puts "  <style>"
        f.puts "    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }"
        f.puts "    h1 { color: #333; }"
        f.puts "    p { color: #666; }"
        f.puts "  </style>"
        f.puts "</head>"
        f.puts "<body>"
        f.puts "  <h1>Playwright E2E Test Reports</h1>"
        f.puts "  <p>No Playwright test reports available. E2E test reports will appear here when tests are run.</p>"
        f.puts "</body>"
        f.puts "</html>"
      end
      Jekyll.logger.debug "Created placeholder playwright directory at /playwright/"
      reports << "/playwright/"
    end
  rescue StandardError => e
    Jekyll.logger.warn "Failed to process playwright reports: #{e.message}"
    Jekyll.logger.debug e.backtrace.join("\n")
  end
  
  # Process lighthouse reports
  begin
    lh_src = File.join(source, "lighthouse-reports")
    lh_src_alt = File.join(source, ".lighthouseci")  # Alternative location for newer LHCI

    # Use lighthouse-reports if it exists, otherwise try .lighthouseci
    if Dir.exist?(lh_src)
      lh_src_to_use = lh_src
    elsif Dir.exist?(lh_src_alt)
      lh_src_to_use = lh_src_alt
    end

    lh_dst = File.join(dest, "lighthouse")
    if lh_src_to_use
      FileUtils.rm_rf(lh_dst) if Dir.exist?(lh_dst)
      # Copy instead of symlink for static deploys (GitHub Pages, Netlify don't support symlinks)
      FileUtils.mkdir_p(lh_dst)
      FileUtils.cp_r(File.join(lh_src_to_use, "."), lh_dst)
      if Dir.exist?(lh_dst)
        # Create index.html listing all lighthouse reports
        report_files = Dir.glob(File.join(lh_dst, "lhr-*.html")).sort.reverse
        if report_files.any?
          index_path = File.join(lh_dst, "index.html")
          File.open(index_path, "w") do |f|
            f.puts "<!DOCTYPE html>"
            f.puts "<html lang=\"en\">"
            f.puts "<head>"
            f.puts "  <meta charset=\"UTF-8\">"
            f.puts "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
            f.puts "  <title>Lighthouse Reports</title>"
            f.puts "  <style>"
            f.puts "    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }"
            f.puts "    h1 { color: #333; }"
            f.puts "    ul { list-style: none; padding: 0; }"
            f.puts "    li { margin: 0.5rem 0; }"
            f.puts "    a { color: #0066cc; text-decoration: none; }"
            f.puts "    a:hover { text-decoration: underline; }"
            f.puts "  </style>"
            f.puts "</head>"
            f.puts "<body>"
            f.puts "  <h1>Lighthouse Reports</h1>"
            f.puts "  <ul>"
            report_files.each do |report_file|
              report_name = File.basename(report_file)
              href_name = CGI.escape(report_name) # URL-encode for href
              text_name = CGI.escapeHTML(report_name) # Escape text for display
              f.puts "    <li><a href=\"#{href_name}\">#{text_name}</a></li>"
            end
            f.puts "  </ul>"
            f.puts "</body>"
            f.puts "</html>"
          end
          Jekyll.logger.info "Simplified URL created: /lighthouse/ with index.html"
        else
          Jekyll.logger.info "Simplified URL created: /lighthouse/"
        end
        reports << "/lighthouse/"
      else
        Jekyll.logger.warn "Failed to create lighthouse simplified URL: directory not found after copy"
      end
    else
      # Create placeholder directory with index.html so the link doesn't break
      FileUtils.rm_rf(lh_dst) if Dir.exist?(lh_dst)
      FileUtils.mkdir_p(lh_dst)
      lighthouse_index = File.join(lh_dst, "index.html")
      File.open(lighthouse_index, "w") do |f|
        f.puts "<!DOCTYPE html>"
        f.puts "<html lang=\"en\">"
        f.puts "<head>"
        f.puts "  <meta charset=\"UTF-8\">"
        f.puts "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
        f.puts "  <title>Lighthouse Reports</title>"
        f.puts "  <style>"
        f.puts "    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }"
        f.puts "    h1 { color: #333; }"
        f.puts "    p { color: #666; }"
        f.puts "  </style>"
        f.puts "</head>"
        f.puts "<body>"
        f.puts "  <h1>Lighthouse Reports</h1>"
        f.puts "  <p>No Lighthouse reports available. Run the build with Lighthouse enabled to generate reports.</p>"
        f.puts "</body>"
        f.puts "</html>"
      end
      Jekyll.logger.debug "Created placeholder lighthouse directory at /lighthouse/"
      reports << "/lighthouse/"
    end
  rescue StandardError => e
    Jekyll.logger.warn "Failed to copy lighthouse reports: #{e.message}"
    Jekyll.logger.debug e.backtrace.join("\n")
  end
  
  # Process coverage reports
  begin
    cvg_src = File.join(source, "coverage")
    cvg_dst = File.join(dest, "coverage")
    if Dir.exist?(cvg_src)
      # Copy coverage reports to destination
      FileUtils.rm_rf(cvg_dst) if Dir.exist?(cvg_dst)
      FileUtils.mkdir_p(cvg_dst)
      FileUtils.cp_r(File.join(cvg_src, "."), cvg_dst)

      # Create index.html for coverage if it doesn't exist
      coverage_index = File.join(cvg_dst, "index.html")
      unless File.exist?(coverage_index)
        # Try to find an existing index.html in subdirectories
        index_candidates = Dir.glob(File.join(cvg_dst, "**", "index.html"))
        if index_candidates.any?
          # Use the first found index.html
          FileUtils.cp(index_candidates.first, coverage_index)
        else
          # Create a simple index.html
          File.open(coverage_index, "w") do |f|
            f.puts "<!DOCTYPE html>"
            f.puts "<html lang=\"en\">"
            f.puts "<head>"
            f.puts "  <meta charset=\"UTF-8\">"
            f.puts "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
            f.puts "  <title>Coverage Reports</title>"
            f.puts "  <style>"
            f.puts "    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }"
            f.puts "    h1 { color: #333; }"
            f.puts "  </style>"
            f.puts "</head>"
            f.puts "<body>"
            f.puts "  <h1>Coverage Reports</h1>"
            f.puts "  <p>Coverage reports are available in subdirectories.</p>"
            f.puts "</body>"
            f.puts "</html>"
          end
        end
      end
      Jekyll.logger.info "Found coverage reports at /coverage/"
      reports << "/coverage/"
    else
      # Create placeholder directory with index.html so the link doesn't break
      FileUtils.rm_rf(cvg_dst) if Dir.exist?(cvg_dst)
      FileUtils.mkdir_p(cvg_dst)
      coverage_index = File.join(cvg_dst, "index.html")
      File.open(coverage_index, "w") do |f|
        f.puts "<!DOCTYPE html>"
        f.puts "<html lang=\"en\">"
        f.puts "<head>"
        f.puts "  <meta charset=\"UTF-8\">"
        f.puts "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
        f.puts "  <title>Coverage Reports</title>"
        f.puts "  <style>"
        f.puts "    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }"
        f.puts "    h1 { color: #333; }"
        f.puts "    p { color: #666; }"
        f.puts "  </style>"
        f.puts "</head>"
        f.puts "<body>"
        f.puts "  <h1>Coverage Reports</h1>"
        f.puts "  <p>No coverage reports available. Coverage reports will appear here when tests are run with coverage enabled.</p>"
        f.puts "</body>"
        f.puts "</html>"
      end
      Jekyll.logger.debug "Created placeholder coverage directory at /coverage/"
      reports << "/coverage/"
    end
  rescue StandardError => e
    Jekyll.logger.warn "Failed to process coverage reports: #{e.message}"
    Jekyll.logger.debug e.backtrace.join("\n")
  end
end

