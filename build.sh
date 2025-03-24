#!/bin/bash

# Define file paths
SOURCE_FILE="index.htm"
DEST_DIR="."
DEST_FILE="$DEST_DIR/index.html"
# Print "Building production index.html" in rainbow letters

printf "\n\e[1;31mB\e[1;33mu\e[1;32mi\e[1;36ml\e[1;34md\e[1;35mi\e[1;31mn\e[1;33mg \e[1;32mp\e[1;36mr\e[1;34mo\e[1;35md\e[1;31mu\e[1;33mc\e[1;32mt\e[1;36mi\e[1;34mo\e[1;35mn \e[0m\n"
# Ensure destination directory exists
mkdir -p "$DEST_DIR"

# Temporary files to hold multi-line content
GOOGLE_FONTS_FILE=$(mktemp)
STYLE_FILE=$(mktemp)

# Define multiple Google Fonts
cat <<-END > "$GOOGLE_FONTS_FILE"
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,500&display=swap" rel="stylesheet">
END

# Define custom style
cat <<-END > "$STYLE_FILE"
<style>
.inter-500 {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}
body { 
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    background-color: #4100FC; 
}
h1 {
    font-family: inherit;
}
#fullscreen-btn{
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 1000;
    background-color: #4100FC;
    color: white;
    border: none;
    padding: 10px 20px 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;
    display: flex;
    align-items: center;
    gap: 15px;
}
#fullscreen-btn:hover {
    background-color: #5a00ff;
}
#fullscreen-btn:active {
    background-color: #2a00ff;
}
</style>
END

# Define custom script
CUSTOM_SCRIPT='<script src="init.js"></script>'

# Inject Google Fonts and custom style before </head>
# Inject custom script before </body>
awk -v fonts_file="$GOOGLE_FONTS_FILE" -v style_file="$STYLE_FILE" -v script="$CUSTOM_SCRIPT" '
    /<\/head>/ { 
        while (getline < fonts_file) print
        while (getline < style_file) print
    }
    /<\/body>/ { print script; print; next }
    { print }
' "$SOURCE_FILE" > "$DEST_FILE"

# Clean up temporary files
rm "$GOOGLE_FONTS_FILE" "$STYLE_FILE"

echo "Processed $SOURCE_FILE -> $DEST_FILE"
echo "Run npx http-server and open $DEST_FILE in browser..."
# Open the destination file in the default web browser


