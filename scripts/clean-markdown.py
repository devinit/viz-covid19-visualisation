""" Clean up a Markdown file generated from a Google Doc

Assuming the "Docs to Markdown" plugin.

Removes comments, fixes links, and adds anchors. No external-package requirements.

Processes the whole document as a single string, using the re.MULTILINE flag for regular-expression processing.

Usage:

    python3 clean-markdown.py infile.md > outfile.md

Started 2021-02-19 by David Megginson

"""

import re, sys


#
# Utility functions
#

def esc (s):
    """ Escape a string literal for HTML """
    return s.replace("&", "&amp").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&apos;").replace('"', "&quot;")


def make_anchor (s):
    """ Make an HTML anchor from a string """
    return re.sub("[^a-z]+", "_", s.strip().lower())


#
# Cleanup functions
#

def remove_comments (s):
    """ Remove comments from the generated markdown """
    return re.sub("<!--[^>]+-->", "", s, flags=re.MULTILINE)


def fix_headers (s):
    """ Remove boldface and add link anchors to headers """

    def add_anchors (match):
        return '{} <a name="{}">{}</a>'.format(
            match.group(1),
            make_anchor(match.group(2)),
            match.group(2)
        )

    # Here Be Dragons: using a function instead of a replacement string
    return re.sub("^(#+)\s*(?:\*\*)?\s*([^*\n]+)\s*(?:\*\*)?\s*$", add_anchors, s, flags=re.MULTILINE)


def fix_links (s):
    """ Replace Markdown links with HTML links that will open in a new tab """
    
    def linkify (match):
        """ Generate an HTML external link from an re match object """
        return ' <a href="{}" target="_blank">{}</a> '.format(
            esc(match.group(2).strip()), # URL, escaped and with whitespace trimmed
            esc(match.group(1).strip())  # link text, escaped and with whitespace trimmed
        )

    # Here Be Dragons: uses a function instead of a replacement string
    return re.sub("\[([^\]]+)\]\(([^\)]+)\)", linkify, s, flags=re.MULTILINE)


#
# Main entry point
#

def clean_markdown (s):
    """ Clean markdown for use with the USAID C19 viz """
    s = remove_comments(s)
    s = fix_headers(s)
    s = fix_links(s)
    return s


#
# If run from the command line
#

if __name__ == "__main__":

    s = ''

    if len(sys.argv) == 1:
        s = sys.stdin.read()
    elif len(sys.argv) == 2:
        with open(sys.argv[1], 'r') as input:
            s = input.read()
    else:
        print("Usage: {} [infile.md] > outfile.md".format(sys.argv[0]), file=sys.stderr)
        sys.exit(2)

    print(clean_markdown(s), end='')

sys.exit(0)

# end
