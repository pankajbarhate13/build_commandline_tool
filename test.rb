# a=["aa","bb","cc","bb","bb","cc"]

# b = Hash.new(0)

# a.each do |v|
#   b[v] += 1
# end

# b.each do |k, v|
#   puts "#{k} appears #{v} times"
# end



# <img src="<%= Redmine::Utils.relative_url_root %>/images/aquapay.png" style="margin-top: 15px; margin-left: 15px;"/>
# =====================================================================================


a = [1, 2, 2, 3, 3, 3, 4].group_by(&:itself).map { |k,v| [k, v.count] }.to_h

puts a

