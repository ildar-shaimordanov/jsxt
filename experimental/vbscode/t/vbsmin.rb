# frozen_string_literal: true

# Ruby internal
require 'fileutils'
# Project internal
#require 'vbsmin/version'

# Global VBSmin class
class VBSMin
  # Constants
#  include Version

  # @return [Integer] Size (in bytes) of the original file
  attr_reader :input_size

  # @return [Integer] Size (in bytes) of the minified file
  attr_reader :output_size

  # @return [Integer] Saved size (in bytes)
  attr_reader :diff_size

  # @return [String] Path of the original file
  attr_reader :original_filepath

  # @return [String] Path of the minified file
  attr_reader :min_filepath

  # Instantiate a VBSmin object
  def initialize
    @input_size = nil
    @output_size = nil
    @diff_size = nil
    @original_filepath = nil
    @min_filepath = nil
  end

  # Minify a VBScript file (make a minified copy: file.min.vbs)
  # @param filepath [String] Path to the VBS file to minify
  # @return [String] Path of the minified file
  def minify(filepath)
    @original_filepath = filepath
    # Count number of line of input
    input_lines = IO.readlines(filepath).length
    # File streaming
    File.open(min_ext, 'w') do |output|
      File.foreach(filepath).with_index(1) do |line, i|
        eol = ':' # End of file char
        # Remove inline comment (must be before whitespace striping)
        line = inline_comment(line)
        # Remove leading and trailing whitespaces: null, horizontal tab, line feed,
        # vertical tab, form feed, carriage return, space
        line.strip!
        # Remove comments except inline ones (must be after whitespace striping)
        line = '' if line[0] == "'" || line[0..2].upcase == 'REM'
        # Remove space when several spaces between two keywords
        line = internal_space(line)
        # Remove line splitting
        line[-1] = '' && eol = '' if line[-2..] == ' _'
        # Write processed line unless it is a blank line or the last line
        unless line.empty?
          output.write(line)
          output.write(eol) unless i == input_lines
        end
      end
    end
    calc_size
    return @min_filepath
  end

  private

  # Create the path of the minified file from the path of the original file
  def min_ext
    extension = File.extname(@original_filepath).downcase
    abort 'Not a .vbs file' unless extension == '.vbs'
    min_filepath = @original_filepath.chomp(extension) + '.min.vbs'
    @min_filepath = min_filepath
    return min_filepath
  end

  # Calculate the size of the files and the saved size
  def calc_size
    @input_size = File.size(@original_filepath)
    @output_size = File.size(@min_filepath)
    @diff_size = @input_size - @output_size
  end

  # DO NOT USE, use internal_space instead()
  def internal_space_old(line)
    arr = []
    single_quote = line.count('"')
    # This method won't work when there is two consecutive double quote
    # so we must replace them else they will get removed.
    line.gsub!('""', '☠')
    line.split('"').each_with_index do |item, i|
      # if odd number of double quote we are in a string else we are out
      # process only if out of a string
      item.gsub!(/ +/, ' ') if i.even?
      arr.push(item)
    end
    output = arr.join('"')
    output.gsub!('☠', '""')
    output += '"' unless single_quote == output.count('"')
    return output
  end

  # Remove extra spaces (several spaces between two keywords except in a string)
  # More reliable than internal_space_old which use string replacement and string
  # split
  def internal_space(line)
    # For each single quote, if there is an odd number of double quote before
    # we are in a string, but if there is an even number of double quote before
    # we are out of a string.
    double_quote = 0
    previous_char = nil
    output = ''
    i = 0
    line.each_char do |c|
      double_quote += 1 if c == '"'
      output += c unless previous_char == ' ' && c == ' ' && double_quote.even?
      i += 1
      previous_char = c
    end
    return output
  end

  # Remove inline comments
  # In VBS there is no single quote strings so it's safe to remove until the end
  # of string when ecountering a single quote.
  # The only case to handle if is a single quote appears in a double quote string.
  def inline_comment(line)
    # For each single quote, if there is an odd number of double quote before
    # we are in a string, but if there is an even number of double quote before
    # we are out of a string so this is an inline comment and we can remove all
    # that comes after.
    double_quote = 0
    i = 0
    line.each_char do |c|
      double_quote += 1 if c == '"'
      if c == "'" && double_quote.even?
        line = line[0..i]
        break
      end
      i += 1
    end
    return line
  end
end
