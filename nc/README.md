# NetCrafters Bootstrap v1.0

## Compiling CSS and JavaScript

NetCrafters includes a [makefile](Netcraft) called "Netcraft" the build instructions. Before getting started, be sure to install the necessary local dependencies.

#### build - `make -f Netcraft`
Runs the recess compiler to rebuild the `/less` files and compiles the docs. Requires recess and uglify-js.

## Modifying the makefile

All I did was `cp Makefile Netcraft` and then replaced the string "docs/assets" with "nc".

