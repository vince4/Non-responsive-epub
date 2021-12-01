# Sample of a non-responsive ePub

## Issue

I noticed using the epubjs library, that an ePub chapter rendered an empty page at the end.

## Project

This project renders this chapter in an epubjs reader of iPhone 13 screen size. It creates a blank page at the end. 

## Explanations

After analysis, it turns out that the chapter ends with a table whose lines (\<tr>) are wider than the table (\<table>). 
It makes wrong the content width calculated by epubjs. To calculate the content width, epubjs creates a range, add the iframe body in it and execute `getBoundingClientRect()`. 
Everything happen in the method `textWidth()` of `contents.js`

## Licences

#### ePub sample
Title: Italiano - Guía de conversación
Author: Jean-Pierre Guglielmi
Publisher: Assimil
EAN: 9782700561302