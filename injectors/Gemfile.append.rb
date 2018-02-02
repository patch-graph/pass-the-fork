
# appended by gitjection
require 'json'
if ENV['INJECT_GEMS']
  config = JSON.parse(ENV['INJECT_GEMS'])
  config.each do |gem_name, options|
    @dependencies.delete_if {|d| d.name == gem_name }
    git = options['git']
    branch = options['branch']
    puts "gitjection: gem(#{gem_name}, git: #{git}, branch: #{branch})"
    gem(gem_name, git: git, branch: branch)
  end
end
# end of code appended by gitjection
