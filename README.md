Simple Analyze der Collection Strukur für MongoDB
=================================================

  
 ac = analyze collection
 
 # use:
 
 mongo <dbname>
 
 \>load("ac.js")
 
 \>ac("<collection-name>")
 
 # or
 
 \>ac("<collection-name>", "<to permanent save collection-name>")
 
 # generate data

 \>load('fillcoll.js')
 
 # generate test data and how ac() works.
 
 \>testdata()

 # generate random data
 
 \>fillcoll("random_coll")