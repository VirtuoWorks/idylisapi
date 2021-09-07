#!/bin/sh

# ******************************************** #
# Create environment variables for credentials #
#     based on arguments passed at runtime     #
# ******************************************** #

env "CODEABONNE"=$1 "IDENTIFIANT"=$2 "MOTDEPASSE"=$3 tsdx test
