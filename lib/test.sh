#!/bin/bash

for i in in*; do
  echo --- $i
  ./sol < $i > o && (diff -y o out${i:2:5} > t || cat t) || cat o
done
