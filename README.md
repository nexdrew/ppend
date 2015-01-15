# ppend

Simple CLI to rename files by appending, prepending, or cutting (removing) text from filenames.

A better alternative to calling mv several times.

## Usage

usage: ppend [options] text filePattern [...]

Append text to filenames matching the given patterns.

Options:
   -p, --pre      Prepend the text to the filenames instead of appending it.
                  Mutually exlusive with the -c option.

   -c, --cut      Remove the text from the filenames instead of appending it.
                  Takes precedence over the -p option.

   -v, --verbose  Print pseudo mv commands to stdout.