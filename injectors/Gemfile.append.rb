
# appended by gitjection
ENV.each do |name, value|
  if /^inject\.gem\.(?<gem_name>.*)\.git_url$/ =~ name
    git_url = value
    git_branch = ENV["inject.gem.#{gem_name}.git_branch"]
    @dependencies.delete_if {|d| d.name == gem_name }
    puts "gitjection: gem(#{gem_name}, git: #{git_url}, branch: #{git_branch})"
    gem(gem_name, git: git_url, branch: git_branch)
  end
end
# end of code appended by gitjection
