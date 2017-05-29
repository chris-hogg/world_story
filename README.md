# World Map

## TODO
How can I set the names as a variable?
How can I make it faster loading? Especially with the large files (38mb!!).
How can I combine TOPOJSON, so it has a higher resolution in one of the areas than other ones?
## What I changed
I changed 3 places (and around 10 lines of code).
`d3.json("world.topojson"` to world.topojson

`locationFile.objects.iso_a3`: the iso_a3 indicates the group at the top.
`d.properties.adm0_a3`: indicates the property of each of the objects.
